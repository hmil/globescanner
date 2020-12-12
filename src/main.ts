import * as dat from 'dat.gui';
import * as THREE from 'three';
import { Clock } from './clock';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

import { createTrackers, fetchData, GpsLocation } from './air-data';
import { HaloPass } from './halo-pass';

const gui = new dat.GUI();
document.body.appendChild(gui.domElement);

let cubes: THREE.Mesh[] = [];
let skybox: THREE.Mesh;

new Clock(document.body);

function currentDay(date: Date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    return day;
}

const guiControls = {
    hour: new Date().getUTCHours(),
    day: currentDay(new Date()),
    light: 1,
    fog: '#d1f2f2',
    density: 1,
    showPlanes: true
}

function setLight() {
    const maxDeclination = 23 / 180 * Math.PI;
    const equinox = 79; // Equinox happens on 79th day
    const angleRadians = guiControls.hour / 12 * Math.PI + Math.PI;
    const seasonality = maxDeclination * Math.sin((guiControls.day - equinox) / 183 * Math.PI);
    const y = -Math.sin(seasonality);
    const radiusAtY = Math.cos(seasonality);
    directionalLight.position.set(Math.cos(angleRadians) * radiusAtY, -y, Math.sin(angleRadians) * radiusAtY);
}

function updateFogColor() {
    const value = guiControls.fog;
    const r = parseInt(value.substring(1, 3), 16);
    const g = parseInt(value.substring(3, 5), 16);
    const b = parseInt(value.substring(5, 7), 16);

    halo.fogColor.set(r / 256, g / 256, b / 256);
}

const aspectRatio = window.innerWidth / window.innerHeight;
const pixelRatio = window.devicePixelRatio;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 50, aspectRatio, 1, 10000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(pixelRatio);
renderer.setClearColor( 0x000000 );
document.body.appendChild( renderer.domElement );
renderer.outputEncoding = THREE.sRGBEncoding;

const light = new THREE.AmbientLight( 0x404040, 0.1);
scene.add( light );
const directionalLight = new THREE.DirectionalLight( 0xFFFFFF, 1.2);
setLight();
scene.add( directionalLight );


const composer = new EffectComposer( renderer );
const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );

const halo = new HaloPass(directionalLight.position, scene, camera, {
    width: window.innerWidth,
    height: window.outerHeight
});
composer.addPass(halo);

const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.zoomSpeed = 0.5;
controls.panSpeed = 0.5;
controls.minDistance = 12;
controls.maxDistance = 900;

camera.position.z = 30;

makeCube({ latitude: 46.3119, longitude: 6.3801 }, 0xff0000);

const earth = createEarth();
scene.add( earth );

createSkybox();

const animate = function () {
    (window as any).meter?.tickStart();
    controls.update();
    skybox.position.copy(camera.position);
    composer.render();
    (window as any).meter?.tick();
    requestAnimationFrame( animate );
};
animate();

window.addEventListener('resize', onWindowResize, false);

const fogFolder = gui.addFolder('fog');
fogFolder.addColor(guiControls, 'fog').onChange(updateFogColor);
fogFolder.add(halo, 'density', 0, 200);
fogFolder.add(halo, 'size', 0, 0.10);
const sunFolder = gui.addFolder('sun');
sunFolder.add(guiControls, 'hour', 0, 24).onChange(() => setLight());
sunFolder.add(guiControls, 'day', 0, 365).onChange(() => setLight());
gui.add(guiControls, 'showPlanes').onChange((value) => {
    if (value) {
        cubes.forEach(cube => { cube.layers.enable(1) });
    } else {
        cubes.forEach(cube => { cube.layers.disable(1) });
    }
});

updateFogColor();

let trackers: THREE.Group[] | undefined;

function refreshPlanes() {
    fetchData().then(d => {
        trackers?.forEach(t => scene.remove(t));
        trackers = createTrackers(d, makeCube);
        if (!guiControls.showPlanes) {
            cubes.forEach(cube => { cube.layers.disable(1) });
        }
    });
}

window.setInterval(refreshPlanes, 30000);
refreshPlanes();

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function makeCube(t: GpsLocation, color = 0x0ff0f) {
    const markerGroup = new THREE.Group();
    scene.add(markerGroup);

    const geometry = new THREE.CylinderBufferGeometry(1, 1, 1, 3, 1);
    const material = new THREE.MeshBasicMaterial( { color } );
    const cube = new THREE.Mesh( geometry, material );
    const scale = (t.elevation ?? 10000) / 10000;
    cube.scale.set(0.01, 0.1 * scale + 0.01, 0.01);
    cube.translateY(10);
    markerGroup.add( cube );
    cubes.push(cube);
    const longRad = t.longitude / 180 * Math.PI;
    const latRad = t.latitude / 180 * Math.PI;
    markerGroup.rotateY(longRad);
    markerGroup.rotateZ(latRad - Math.PI / 2);
    cube.layers.disableAll();
    cube.layers.enable(1);

    return markerGroup;
}

let earthUniforms: any;
let earthMaterial: THREE.Material;

function loadBoxFace(side: string) {
    const tex = new THREE.TextureLoader().load(`models/skybox_${side}.png`);
    const material = new THREE.MeshBasicMaterial({map: tex, opacity: 0.3, transparent: true, side: THREE.BackSide });
    return material;
}
function createSkybox() {
    const skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000);
    skybox = new THREE.Mesh(skyboxGeo, [
        loadBoxFace('left'),
        loadBoxFace('right'),
        loadBoxFace('up'),
        loadBoxFace('down'),
        loadBoxFace('front'),
        loadBoxFace('back'),
    ]);
    scene.add(skybox);
}

function createEarth() {
    const textureCloud = new THREE.TextureLoader().load( "models/earth/textures/NUAGES_baseColor.png" );
    const texture2 = new THREE.TextureLoader().load( "models/earth/textures/TERRE_emissive.jpeg" );
    const texture = new THREE.TextureLoader().load( "texture-earth-combined.jpg" );
    texture.flipY = false;
    texture2.flipY = false;
    // texture3.flipY = false;
    textureCloud.flipY = false;
    // normalMap.flipY = false;
    const geometry = new THREE.SphereBufferGeometry( 10, 128, 64 );
    console.log(require('./shaders/planet.vs.glsl'));
    const uniforms = THREE.UniformsUtils.clone( THREE.UniformsUtils.merge([
        THREE.UniformsLib.common,
        THREE.UniformsLib.lights,
    ]));
    earthUniforms = uniforms;
    uniforms.map = new THREE.Uniform(texture);
    uniforms.mapDark = new THREE.Uniform(texture2);
    // uniforms.mapAlt = new THREE.Uniform(texture3);
    const material = earthMaterial = new THREE.ShaderMaterial({
        vertexShader: require('./shaders/planet.vs.glsl').default,
        fragmentShader: require('./shaders/planet.fs.glsl').default,
        uniforms,
        lights: true,
        defines: {
            USE_UV: 1,
            USE_MAP: 1,
            // TANGENTSPACE_NORMALMAP: 1,
            // USE_NORMALMAP: 1
        }
    });
    const mesh = new THREE.Mesh( geometry, material );

    const cloudUniforms = THREE.UniformsUtils.clone( THREE.UniformsUtils.merge([
        THREE.UniformsLib.common,
        THREE.UniformsLib.lights,
    ]));
    cloudUniforms.map = new THREE.Uniform(textureCloud);
    const cloudMaterial = new THREE.MeshPhongMaterial({
        map: textureCloud,
        transparent: true,
    }); /*new THREE.ShaderMaterial({
        vertexShader: require('./shaders/planet.vs.glsl').default,
        fragmentShader: require('./shaders/cloud.fs.glsl').default,
        uniforms: cloudUniforms,
        // side: THREE.DoubleSide,
        transparent: true,
        lights: true,
        alphaTest: 0.1,
        defines: {
            USE_UV: 1,
            USE_MAP: 1,
        }
    });*/
    // const cloudMaterial = new THREE.MeshPhongMaterial({
    //     alphaMap: textureCloud
    // });
    const cloudSphere = new THREE.Mesh( geometry, cloudMaterial );
    cloudSphere.layers.disableAll();
    cloudSphere.layers.enable(1);
    const cloudScale = 1.004;
    cloudSphere.scale.set(cloudScale, cloudScale, cloudScale);
    const group = new THREE.Group();
    group.add(mesh);
    group.add(cloudSphere);
    // mesh.rotateZ(Math.PI);
    return group;
}

function gpsToXYZ(latitude: number, longitude: number): THREE.Vector3 {

    const longRad = (longitude + 90) / 180 * Math.PI;
    const latRad = latitude / 180 * Math.PI;

    const scaling = 10.04;

    const y = Math.sin(latRad);
    const radiusAtLatitude = Math.cos(latRad);
    const z = Math.cos(longRad) * radiusAtLatitude;
    const x = Math.sin(longRad) * radiusAtLatitude;

    return new THREE.Vector3(x * scaling, y * scaling, z * scaling);
}