import * as THREE from 'three';
import { Color } from 'three';
import { Pass } from 'three/examples/jsm/postprocessing/Pass';

export interface HaloPassParams {
    height: number;
    width: number;
}

export class HaloPass extends Pass{

    private materialDepth: THREE.MeshDepthMaterial;
    private renderTargetDepth: THREE.WebGLRenderTarget;
    private materialHalo: THREE.ShaderMaterial;
    private fsQuad: Pass.FullScreenQuad;
    private oldClearColor: THREE.Color;
    private uniforms: any;

    public fogColor = new THREE.Vector3(1.0, 1.0, 1.0);
    public density = 72;
    public size = 0.014;

    constructor(private readonly lightDirection: THREE.Vector3, private readonly scene: THREE.Scene, private readonly camera: THREE.PerspectiveCamera, params: HaloPassParams) {
        super();

        this.renderTargetDepth = new THREE.WebGLRenderTarget( params.width, params.height, {
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter
        } );

        this.renderTargetDepth.texture.name = "HaloPass.depth";

        this.materialDepth = new THREE.MeshDepthMaterial();
        this.materialDepth.depthPacking = THREE.RGBADepthPacking;
        this.materialDepth.blending = THREE.NoBlending;

        this.uniforms = THREE.UniformsUtils.clone( THREE.UniformsUtils.merge([
            THREE.UniformsLib.common,
            THREE.UniformsLib.lights,
        ]));
        this.uniforms.tDepth = new THREE.Uniform(this.renderTargetDepth.texture);
        this.uniforms.tColor = new THREE.Uniform(this.renderTargetDepth.texture);
        this.uniforms.nearClip = new THREE.Uniform(camera.near);
        this.uniforms.farClip = new THREE.Uniform(camera.far);
        this.uniforms.lightDirection = new THREE.Uniform(lightDirection);
        this.uniforms.fogColor = new THREE.Uniform(this.fogColor);
        this.uniforms.density = new THREE.Uniform(this.density);
        this.uniforms.size = new THREE.Uniform(this.size);
        console.log(camera);
        this.uniforms.projectionMatrixInv = new THREE.Uniform(new THREE.Matrix4().getInverse(camera.projectionMatrix.clone().multiply(camera.matrixWorldInverse)));

        this.materialHalo = new THREE.ShaderMaterial( {
            uniforms: this.uniforms,
            lights: true,
            vertexShader: require('./shaders/post.vs.glsl').default,
            fragmentShader: require('./shaders/halo.fs.glsl').default,
        } );

        this.fsQuad = new Pass.FullScreenQuad( this.materialHalo );
        this.oldClearColor = new Color();
    }

    render(renderer: THREE.WebGLRenderer, writeBuffer: any, readBuffer: any) {

        this.scene.overrideMaterial = this.materialDepth;
        this.oldClearColor.copy( renderer.getClearColor() );
        var oldClearAlpha = renderer.getClearAlpha();
        var oldAutoClear = renderer.autoClear;
        renderer.autoClear = false;

        renderer.setClearColor( 0xffffff );
        renderer.setClearAlpha( 1.0 );
        renderer.setRenderTarget( this.renderTargetDepth );
        renderer.clear();
        this.camera.layers.disable(1);
        renderer.render(this.scene, this.camera);
        this.camera.layers.enable(1);

        this.uniforms[ "tColor" ].value = readBuffer.texture;
        this.uniforms[ "nearClip" ].value = this.camera.near;
        this.uniforms[ "farClip" ].value = this.camera.far;
        this.uniforms[ "density" ].value = this.density;
        this.uniforms[ "size" ].value = this.size;
        
        this.uniforms.projectionMatrixInv = new THREE.Uniform(new THREE.Matrix4().getInverse(this.camera.projectionMatrix.clone().multiply(this.camera.matrixWorldInverse)));
        // this.uniforms.projectionMatrixInv = new THREE.Uniform(this.camera.projectionMatrixInverse);

        renderer.setRenderTarget(null);
        this.fsQuad.render( renderer );

        this.scene.overrideMaterial = null;
        renderer.setClearColor( this.oldClearColor );
        renderer.setClearAlpha( oldClearAlpha );
        renderer.autoClear = oldAutoClear;
    }
}