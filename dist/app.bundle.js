/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/shaders/halo.fs.glsl":
/*!**********************************!*\
  !*** ./src/shaders/halo.fs.glsl ***!
  \**********************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (\"uniform sampler2D tDepth;\\nuniform sampler2D tColor;\\nvarying vec2 vUv;\\nuniform float nearClip;\\nuniform float farClip;\\nvarying vec2 projectedPos;\\nuniform mat4 projectionMatrixInv;\\nuniform vec3 lightDirection;\\nuniform vec3 fogColor;\\nuniform float density;\\nuniform float size;\\n\\n#include <common>\\n#include <packing>\\n\\nfloat getDepth( const in vec2 screenPosition ) {\\n\\treturn unpackRGBAToDepth( texture2D( tDepth, screenPosition ) );\\n}\\n\\nfloat getViewZ( const in float depth ) {\\n\\treturn perspectiveDepthToViewZ( depth, nearClip, farClip );\\n}\\n\\nvec3 unproject(const in float depth ) {\\n    vec4 vect = projectionMatrixInv * vec4(projectedPos, depth, 1.0);\\n    return vec3(vect) / vect.w;\\n}\\n\\nvec3 debugVectors( const in vec3 coords) {\\n    return coords;\\n}\\n\\nfloat getFogSamplerT(const in float impactDepth, const in float endDepth, const in float startDepth) {\\n    if (impactDepth < endDepth) {\\n        return impactDepth;\\n    } else {\\n        return startDepth + (endDepth - startDepth) / 2.0;\\n    }\\n}\\n\\nfloat compress(const in float value, const in float amount) {\\n    return (value + amount) / (1.0 + amount);\\n}\\n\\nvec3 getBgColor(const in vec3 objectColor, const in vec3 bgColor, const in float impactDepth) {\\n    if (impactDepth < farClip) {\\n        return objectColor;\\n    } else {\\n        return bgColor;\\n    }\\n}\\n\\nvoid main() {\\n    vec3 color = vec3(texture2D(tColor, vUv));\\n    float depth = (getDepth(vUv) - 0.5) * 2.0;\\n    vec3 p1 = unproject(depth);\\n    vec3 p0 = unproject(0.0);\\n\\n    float viewZ = getViewZ(getDepth(vUv));\\n    float impactDepth = length(p0 - p1);\\n    vec3 direction = (p1 - p0) / impactDepth;\\n    vec3 offset = p0;\\n\\n    // Sphere intersection\\n    float radius = 10.0 + 10.0 * size;\\n    float radius2 = radius * radius;\\n    \\n    float a = direction.x * direction.x + direction.y * direction.y + direction.z * direction.z;\\n    float b = 2.0 * (direction.x * offset.x + direction.y * offset.y + direction.z * offset.z);\\n    float c = offset.x * offset.x + offset.y * offset.y + offset.z * offset.z - radius2;\\n\\n    float com = b * b - 4.0 * a * c;\\n\\n    float cameraIncidence = saturate(dot(direction, lightDirection));\\n    float hdr = cameraIncidence * cameraIncidence;\\n\\n    vec3 directSun = color * compress(hdr, 0.3) + saturate(cameraIncidence * 100000.0 - 99990.0);\\n\\n    if (com < 0.0) {\\n        gl_FragColor = vec4(directSun, 1.0);\\n    } else {\\n        float t1 = (-b - sqrt(com)) / 2.0 * a;\\n        float t2 = (-b + sqrt(com)) / 2.0 * a;\\n\\n        // Distance travelled in the fog\\n        float fogTravel = (min(impactDepth, t2) - t1);\\n        // Probe the maximum fog depth travelled\\n        vec3 impact = direction * getFogSamplerT(impactDepth, t2, t1) + offset;\\n        float penetration = radius - length(impact);\\n        // Effect of incident light\\n        float incidence = saturate(dot(normalize(impact), lightDirection));\\n        // Effect of camera angle\\n        float refraction = compress(cameraIncidence, 0.2);\\n\\n        vec3 bg = getBgColor(color + 3.0 * color * hdr, directSun, impactDepth); \\n\\n        gl_FragColor = vec4(saturate(bg\\n            + fogColor  * incidence \\n                        * refraction \\n                        * fogTravel * density \\n                        * penetration * penetration\\n        ), 1.0);\\n        // gl_FragColor = vec4(color, 1.0);\\n    }\\n}\");\n\n//# sourceURL=webpack://globescanner/./src/shaders/halo.fs.glsl?");

/***/ }),

/***/ "./src/shaders/planet.fs.glsl":
/*!************************************!*\
  !*** ./src/shaders/planet.fs.glsl ***!
  \************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (\"varying vec2 vUv;\\nuniform sampler2D map;\\nuniform sampler2D mapDark;\\nuniform sampler2D mapAlt;\\n// uniform sampler2D mapCloud;\\n\\nuniform vec3 diffuse;\\nuniform vec3 emissive;\\nuniform vec3 specular;\\nuniform float shininess;\\nuniform float opacity;\\n\\n#include <common>\\n#include <packing>\\n#include <bsdfs>\\n#include <lights_pars_begin>\\n#include <lights_phong_pars_fragment>\\n#include <normalmap_pars_fragment>\\n#include <specularmap_pars_fragment>\\n\\n\\nvoid main() {\\n\\n    #include <normal_fragment_begin>\\n\\t#include <normal_fragment_maps>\\n\\t#include <specularmap_fragment>\\n\\n    vec3 diffuseColor = vec3(texture2D(map, vUv));\\n    // vec4 colorCloud = texture2D(mapCloud, vUv);\\n    vec3 colorDark = vec3(texture2D(mapDark, vUv)) * vec3(1.0, 0.88, 0.0);\\n    // colorDark = mix(colorDark, vec3(0.1, 0.1, 0.1), colorCloud.a);\\n    // vec3 tex3 = vec3(texture2D(mapAlt, vUv));\\n    // vec3 diffuseColor = mix(tex1, tex3, saturate(length(tex3)));\\n    // diffuseColor = mix(diffuseColor, vec3(colorCloud), colorCloud.a);\\n    ReflectedLight reflectedLight = ReflectedLight( vec3(0.0), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\\n\\tvec3 totalEmissiveRadiance = emissive;\\n\\n    #include <lights_phong_fragment>\\n\\t#include <lights_fragment_begin>\\n\\t#include <lights_fragment_maps>\\n\\t#include <lights_fragment_end>\\n\\n    directionalLight = directionalLights[ 0 ];\\n    float incidence = saturate( dot(normal, directionalLight.direction ) );\\n    incidence = 1.0 - saturate(20.0 * incidence - 2.0);\\n\\n\\tvec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + /*reflectedLight.directSpecular + reflectedLight.indirectSpecular +*/ totalEmissiveRadiance;\\n    // float intensity = length(outgoingLight);\\n    // intensity = clamp(intensity, 0.0, 1.0);\\n\\n    // gl_FragColor = vec4(mix(outgoingLight + colorDark * incidence, vec3(1.0 - incidence + 0.1), colorCloud.a), 1.0);\\n    gl_FragColor = vec4(outgoingLight + colorDark * incidence * 0.4, 1.0);\\n}\\n\");\n\n//# sourceURL=webpack://globescanner/./src/shaders/planet.fs.glsl?");

/***/ }),

/***/ "./src/shaders/planet.vs.glsl":
/*!************************************!*\
  !*** ./src/shaders/planet.vs.glsl ***!
  \************************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (\"#include <common>\\nvarying vec2 vUv;\\nvarying vec3 vViewPosition;\\nvarying vec3 vNormal;\\n\\nvoid main() {\\n    #include <beginnormal_vertex>\\n    #include <defaultnormal_vertex>\\n    vUv = uv;\\n\\n    vNormal = normalize( transformedNormal );\\n\\n    #include <begin_vertex>\\n    #include <project_vertex>\\n\\n\\tvViewPosition = mvPosition.xyz;\\n\\n    // vec4 transformed = vec4( position, 1.0 );\\n    // gl_Position = projectionMatrix * modelViewMatrix * transformed;\\n}\\n\");\n\n//# sourceURL=webpack://globescanner/./src/shaders/planet.vs.glsl?");

/***/ }),

/***/ "./src/shaders/post.vs.glsl":
/*!**********************************!*\
  !*** ./src/shaders/post.vs.glsl ***!
  \**********************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (\"varying vec2 vUv;\\nvarying vec2 projectedPos;\\nuniform mat4 projectionMatrixInv;\\n\\nvoid main() {\\n\\tvUv = uv;\\n    projectedPos = uv * 2.0 - vec2(1.0, 1.0); \\n\\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\\n}\\n\");\n\n//# sourceURL=webpack://globescanner/./src/shaders/post.vs.glsl?");

/***/ }),

/***/ "./src/air-data.ts":
/*!*************************!*\
  !*** ./src/air-data.ts ***!
  \*************************/
/*! namespace exports */
/*! export createTrackers [provided] [no usage info] [missing usage info prevents renaming] */
/*! export fetchData [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"fetchData\": () => /* binding */ fetchData,\n/* harmony export */   \"createTrackers\": () => /* binding */ createTrackers\n/* harmony export */ });\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ \"./node_modules/tslib/tslib.es6.js\");\n\nfunction fetchData() {\n    return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__awaiter)(this, void 0, void 0, function () {\n        var resp, data;\n        return (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__generator)(this, function (_a) {\n            switch (_a.label) {\n                case 0: return [4 /*yield*/, fetch('https://opensky-network.org/api/states/all.json')];\n                case 1:\n                    resp = _a.sent();\n                    return [4 /*yield*/, resp.json()];\n                case 2:\n                    data = _a.sent();\n                    console.log(data);\n                    return [2 /*return*/, data];\n            }\n        });\n    });\n}\nfunction createTrackers(data, factory) {\n    var ret = [];\n    data.states.map(function (s) {\n        // if (i > 100) {\n        //     return;\n        // }\n        var longitude = s[5];\n        var latitude = s[6];\n        var elevation = s[7];\n        if (longitude == null || latitude == null) {\n            return;\n        }\n        ret.push(factory({ longitude: longitude, latitude: latitude, elevation: elevation }));\n    });\n    return ret;\n}\n\n\n//# sourceURL=webpack://globescanner/./src/air-data.ts?");

/***/ }),

/***/ "./src/clock.ts":
/*!**********************!*\
  !*** ./src/clock.ts ***!
  \**********************/
/*! namespace exports */
/*! export Clock [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Clock\": () => /* binding */ Clock\n/* harmony export */ });\nvar Clock = /** @class */ (function () {\n    function Clock(anchor) {\n        this.el = document.createElement('div');\n        this.time = Date.now();\n        anchor.appendChild(this.el);\n    }\n    Clock.prototype.setTime = function (time) {\n        this.time = time;\n        this.refreshDisplay();\n    };\n    Clock.prototype.refreshDisplay = function () {\n        var d = new Date(this.time);\n        this.el.innerText = d.toUTCString();\n    };\n    return Clock;\n}());\n\n\n\n//# sourceURL=webpack://globescanner/./src/clock.ts?");

/***/ }),

/***/ "./src/halo-pass.ts":
/*!**************************!*\
  !*** ./src/halo-pass.ts ***!
  \**************************/
/*! namespace exports */
/*! export HaloPass [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"HaloPass\": () => /* binding */ HaloPass\n/* harmony export */ });\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ \"./node_modules/tslib/tslib.es6.js\");\n/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n/* harmony import */ var three_examples_jsm_postprocessing_Pass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three/examples/jsm/postprocessing/Pass */ \"./node_modules/three/examples/jsm/postprocessing/Pass.js\");\n\n\n\n\nvar HaloPass = /** @class */ (function (_super) {\n    (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__extends)(HaloPass, _super);\n    function HaloPass(lightDirection, scene, camera, params) {\n        var _this = _super.call(this) || this;\n        _this.lightDirection = lightDirection;\n        _this.scene = scene;\n        _this.camera = camera;\n        _this.fogColor = new three__WEBPACK_IMPORTED_MODULE_0__.Vector3(1.0, 1.0, 1.0);\n        _this.density = 72;\n        _this.size = 0.014;\n        _this.renderTargetDepth = new three__WEBPACK_IMPORTED_MODULE_0__.WebGLRenderTarget(params.width, params.height, {\n            minFilter: three__WEBPACK_IMPORTED_MODULE_0__.NearestFilter,\n            magFilter: three__WEBPACK_IMPORTED_MODULE_0__.NearestFilter\n        });\n        _this.renderTargetDepth.texture.name = \"HaloPass.depth\";\n        _this.materialDepth = new three__WEBPACK_IMPORTED_MODULE_0__.MeshDepthMaterial();\n        _this.materialDepth.depthPacking = three__WEBPACK_IMPORTED_MODULE_0__.RGBADepthPacking;\n        _this.materialDepth.blending = three__WEBPACK_IMPORTED_MODULE_0__.NoBlending;\n        _this.uniforms = three__WEBPACK_IMPORTED_MODULE_0__.UniformsUtils.clone(three__WEBPACK_IMPORTED_MODULE_0__.UniformsUtils.merge([\n            three__WEBPACK_IMPORTED_MODULE_0__.UniformsLib.common,\n            three__WEBPACK_IMPORTED_MODULE_0__.UniformsLib.lights,\n        ]));\n        _this.uniforms.tDepth = new three__WEBPACK_IMPORTED_MODULE_0__.Uniform(_this.renderTargetDepth.texture);\n        _this.uniforms.tColor = new three__WEBPACK_IMPORTED_MODULE_0__.Uniform(_this.renderTargetDepth.texture);\n        _this.uniforms.nearClip = new three__WEBPACK_IMPORTED_MODULE_0__.Uniform(camera.near);\n        _this.uniforms.farClip = new three__WEBPACK_IMPORTED_MODULE_0__.Uniform(camera.far);\n        _this.uniforms.lightDirection = new three__WEBPACK_IMPORTED_MODULE_0__.Uniform(lightDirection);\n        _this.uniforms.fogColor = new three__WEBPACK_IMPORTED_MODULE_0__.Uniform(_this.fogColor);\n        _this.uniforms.density = new three__WEBPACK_IMPORTED_MODULE_0__.Uniform(_this.density);\n        _this.uniforms.size = new three__WEBPACK_IMPORTED_MODULE_0__.Uniform(_this.size);\n        console.log(camera);\n        _this.uniforms.projectionMatrixInv = new three__WEBPACK_IMPORTED_MODULE_0__.Uniform(new three__WEBPACK_IMPORTED_MODULE_0__.Matrix4().getInverse(camera.projectionMatrix.clone().multiply(camera.matrixWorldInverse)));\n        _this.materialHalo = new three__WEBPACK_IMPORTED_MODULE_0__.ShaderMaterial({\n            uniforms: _this.uniforms,\n            lights: true,\n            vertexShader: __webpack_require__(/*! ./shaders/post.vs.glsl */ \"./src/shaders/post.vs.glsl\").default,\n            fragmentShader: __webpack_require__(/*! ./shaders/halo.fs.glsl */ \"./src/shaders/halo.fs.glsl\").default,\n        });\n        _this.fsQuad = new three_examples_jsm_postprocessing_Pass__WEBPACK_IMPORTED_MODULE_1__.Pass.FullScreenQuad(_this.materialHalo);\n        _this.oldClearColor = new three__WEBPACK_IMPORTED_MODULE_0__.Color();\n        return _this;\n    }\n    HaloPass.prototype.render = function (renderer, writeBuffer, readBuffer) {\n        this.scene.overrideMaterial = this.materialDepth;\n        this.oldClearColor.copy(renderer.getClearColor());\n        var oldClearAlpha = renderer.getClearAlpha();\n        var oldAutoClear = renderer.autoClear;\n        renderer.autoClear = false;\n        renderer.setClearColor(0xffffff);\n        renderer.setClearAlpha(1.0);\n        renderer.setRenderTarget(this.renderTargetDepth);\n        renderer.clear();\n        this.camera.layers.disable(1);\n        renderer.render(this.scene, this.camera);\n        this.camera.layers.enable(1);\n        this.uniforms[\"tColor\"].value = readBuffer.texture;\n        this.uniforms[\"nearClip\"].value = this.camera.near;\n        this.uniforms[\"farClip\"].value = this.camera.far;\n        this.uniforms[\"density\"].value = this.density;\n        this.uniforms[\"size\"].value = this.size;\n        this.uniforms.projectionMatrixInv = new three__WEBPACK_IMPORTED_MODULE_0__.Uniform(new three__WEBPACK_IMPORTED_MODULE_0__.Matrix4().getInverse(this.camera.projectionMatrix.clone().multiply(this.camera.matrixWorldInverse)));\n        // this.uniforms.projectionMatrixInv = new THREE.Uniform(this.camera.projectionMatrixInverse);\n        renderer.setRenderTarget(null);\n        this.fsQuad.render(renderer);\n        this.scene.overrideMaterial = null;\n        renderer.setClearColor(this.oldClearColor);\n        renderer.setClearAlpha(oldClearAlpha);\n        renderer.autoClear = oldAutoClear;\n    };\n    return HaloPass;\n}(three_examples_jsm_postprocessing_Pass__WEBPACK_IMPORTED_MODULE_1__.Pass));\n\n\n\n//# sourceURL=webpack://globescanner/./src/halo-pass.ts?");

/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! namespace exports */
/*! exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var dat_gui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! dat.gui */ \"./node_modules/dat.gui/build/dat.gui.module.js\");\n/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n/* harmony import */ var _clock__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./clock */ \"./src/clock.ts\");\n/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ \"./node_modules/three/examples/jsm/controls/OrbitControls.js\");\n/* harmony import */ var three_examples_jsm_postprocessing_EffectComposer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! three/examples/jsm/postprocessing/EffectComposer.js */ \"./node_modules/three/examples/jsm/postprocessing/EffectComposer.js\");\n/* harmony import */ var three_examples_jsm_postprocessing_RenderPass_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! three/examples/jsm/postprocessing/RenderPass.js */ \"./node_modules/three/examples/jsm/postprocessing/RenderPass.js\");\n/* harmony import */ var _air_data__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./air-data */ \"./src/air-data.ts\");\n/* harmony import */ var _halo_pass__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./halo-pass */ \"./src/halo-pass.ts\");\n\n\n\n\n\n\n\n\nvar gui = new dat_gui__WEBPACK_IMPORTED_MODULE_0__.GUI();\ndocument.body.appendChild(gui.domElement);\nvar cubes = [];\nvar skybox;\nnew _clock__WEBPACK_IMPORTED_MODULE_2__.Clock(document.body);\nfunction currentDay(date) {\n    var start = new Date(date.getFullYear(), 0, 0);\n    var diff = date.getTime() - start.getTime();\n    var oneDay = 1000 * 60 * 60 * 24;\n    var day = Math.floor(diff / oneDay);\n    return day;\n}\nvar guiControls = {\n    hour: new Date().getUTCHours(),\n    day: currentDay(new Date()),\n    light: 1,\n    fog: '#d1f2f2',\n    density: 1,\n    showPlanes: true\n};\nfunction setLight() {\n    var maxDeclination = 23 / 180 * Math.PI;\n    var equinox = 79; // Equinox happens on 79th day\n    var angleRadians = guiControls.hour / 12 * Math.PI + Math.PI;\n    var seasonality = maxDeclination * Math.sin((guiControls.day - equinox) / 183 * Math.PI);\n    var y = -Math.sin(seasonality);\n    var radiusAtY = Math.cos(seasonality);\n    directionalLight.position.set(Math.cos(angleRadians) * radiusAtY, -y, Math.sin(angleRadians) * radiusAtY);\n}\nfunction updateFogColor() {\n    var value = guiControls.fog;\n    var r = parseInt(value.substring(1, 3), 16);\n    var g = parseInt(value.substring(3, 5), 16);\n    var b = parseInt(value.substring(5, 7), 16);\n    halo.fogColor.set(r / 256, g / 256, b / 256);\n}\nvar aspectRatio = window.innerWidth / window.innerHeight;\nvar pixelRatio = window.devicePixelRatio;\nvar scene = new three__WEBPACK_IMPORTED_MODULE_1__.Scene();\nvar camera = new three__WEBPACK_IMPORTED_MODULE_1__.PerspectiveCamera(50, aspectRatio, 1, 10000);\nvar renderer = new three__WEBPACK_IMPORTED_MODULE_1__.WebGLRenderer();\nrenderer.setSize(window.innerWidth, window.innerHeight);\nrenderer.setPixelRatio(pixelRatio);\nrenderer.setClearColor(0x000000);\ndocument.body.appendChild(renderer.domElement);\nrenderer.outputEncoding = three__WEBPACK_IMPORTED_MODULE_1__.sRGBEncoding;\nvar light = new three__WEBPACK_IMPORTED_MODULE_1__.AmbientLight(0x404040, 0.1);\nscene.add(light);\nvar directionalLight = new three__WEBPACK_IMPORTED_MODULE_1__.DirectionalLight(0xFFFFFF, 1.2);\nsetLight();\nscene.add(directionalLight);\nvar composer = new three_examples_jsm_postprocessing_EffectComposer_js__WEBPACK_IMPORTED_MODULE_4__.EffectComposer(renderer);\nvar renderPass = new three_examples_jsm_postprocessing_RenderPass_js__WEBPACK_IMPORTED_MODULE_5__.RenderPass(scene, camera);\ncomposer.addPass(renderPass);\nvar halo = new _halo_pass__WEBPACK_IMPORTED_MODULE_7__.HaloPass(directionalLight.position, scene, camera, {\n    width: window.innerWidth,\n    height: window.outerHeight\n});\ncomposer.addPass(halo);\nvar controls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_3__.OrbitControls(camera, renderer.domElement);\ncontrols.enableDamping = true;\ncontrols.zoomSpeed = 0.5;\ncontrols.panSpeed = 0.5;\ncontrols.minDistance = 12;\ncontrols.maxDistance = 900;\ncamera.position.z = 30;\nmakeCube({ latitude: 46.3119, longitude: 6.3801 }, 0xff0000);\nvar earth = createEarth();\nscene.add(earth);\ncreateSkybox();\nvar animate = function () {\n    var _a, _b;\n    (_a = window.meter) === null || _a === void 0 ? void 0 : _a.tickStart();\n    controls.update();\n    skybox.position.copy(camera.position);\n    composer.render();\n    (_b = window.meter) === null || _b === void 0 ? void 0 : _b.tick();\n    requestAnimationFrame(animate);\n};\nanimate();\nwindow.addEventListener('resize', onWindowResize, false);\nvar fogFolder = gui.addFolder('fog');\nfogFolder.addColor(guiControls, 'fog').onChange(updateFogColor);\nfogFolder.add(halo, 'density', 0, 200);\nfogFolder.add(halo, 'size', 0, 0.10);\nvar sunFolder = gui.addFolder('sun');\nsunFolder.add(guiControls, 'hour', 0, 24).onChange(function () { return setLight(); });\nsunFolder.add(guiControls, 'day', 0, 365).onChange(function () { return setLight(); });\ngui.add(guiControls, 'showPlanes').onChange(function (value) {\n    if (value) {\n        cubes.forEach(function (cube) { cube.layers.enable(1); });\n    }\n    else {\n        cubes.forEach(function (cube) { cube.layers.disable(1); });\n    }\n});\nupdateFogColor();\nvar trackers;\nfunction refreshPlanes() {\n    (0,_air_data__WEBPACK_IMPORTED_MODULE_6__.fetchData)().then(function (d) {\n        trackers === null || trackers === void 0 ? void 0 : trackers.forEach(function (t) { return scene.remove(t); });\n        trackers = (0,_air_data__WEBPACK_IMPORTED_MODULE_6__.createTrackers)(d, makeCube);\n        if (!guiControls.showPlanes) {\n            cubes.forEach(function (cube) { cube.layers.disable(1); });\n        }\n    });\n}\nwindow.setInterval(refreshPlanes, 30000);\nrefreshPlanes();\nfunction onWindowResize() {\n    camera.aspect = window.innerWidth / window.innerHeight;\n    camera.updateProjectionMatrix();\n    renderer.setSize(window.innerWidth, window.innerHeight);\n}\nfunction makeCube(t, color) {\n    var _a;\n    if (color === void 0) { color = 0x0ff0f; }\n    var markerGroup = new three__WEBPACK_IMPORTED_MODULE_1__.Group();\n    scene.add(markerGroup);\n    var geometry = new three__WEBPACK_IMPORTED_MODULE_1__.CylinderBufferGeometry(1, 1, 1, 3, 1);\n    var material = new three__WEBPACK_IMPORTED_MODULE_1__.MeshBasicMaterial({ color: color });\n    var cube = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(geometry, material);\n    var scale = ((_a = t.elevation) !== null && _a !== void 0 ? _a : 10000) / 10000;\n    cube.scale.set(0.01, 0.1 * scale + 0.01, 0.01);\n    cube.translateY(10);\n    markerGroup.add(cube);\n    cubes.push(cube);\n    var longRad = t.longitude / 180 * Math.PI;\n    var latRad = t.latitude / 180 * Math.PI;\n    markerGroup.rotateY(longRad);\n    markerGroup.rotateZ(latRad - Math.PI / 2);\n    cube.layers.disableAll();\n    cube.layers.enable(1);\n    return markerGroup;\n}\nvar earthUniforms;\nvar earthMaterial;\nfunction loadBoxFace(side) {\n    var tex = new three__WEBPACK_IMPORTED_MODULE_1__.TextureLoader().load(\"models/skybox_\" + side + \".png\");\n    var material = new three__WEBPACK_IMPORTED_MODULE_1__.MeshBasicMaterial({ map: tex, opacity: 0.3, transparent: true, side: three__WEBPACK_IMPORTED_MODULE_1__.BackSide });\n    return material;\n}\nfunction createSkybox() {\n    var skyboxGeo = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(1000, 1000, 1000);\n    skybox = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(skyboxGeo, [\n        loadBoxFace('left'),\n        loadBoxFace('right'),\n        loadBoxFace('up'),\n        loadBoxFace('down'),\n        loadBoxFace('front'),\n        loadBoxFace('back'),\n    ]);\n    scene.add(skybox);\n}\nfunction createEarth() {\n    var textureCloud = new three__WEBPACK_IMPORTED_MODULE_1__.TextureLoader().load(\"models/earth/textures/NUAGES_baseColor.png\");\n    var texture2 = new three__WEBPACK_IMPORTED_MODULE_1__.TextureLoader().load(\"models/earth/textures/TERRE_emissive.jpeg\");\n    var texture = new three__WEBPACK_IMPORTED_MODULE_1__.TextureLoader().load(\"texture-earth-combined.jpg\");\n    texture.flipY = false;\n    texture2.flipY = false;\n    // texture3.flipY = false;\n    textureCloud.flipY = false;\n    // normalMap.flipY = false;\n    var geometry = new three__WEBPACK_IMPORTED_MODULE_1__.SphereBufferGeometry(10, 128, 64);\n    console.log(__webpack_require__(/*! ./shaders/planet.vs.glsl */ \"./src/shaders/planet.vs.glsl\"));\n    var uniforms = three__WEBPACK_IMPORTED_MODULE_1__.UniformsUtils.clone(three__WEBPACK_IMPORTED_MODULE_1__.UniformsUtils.merge([\n        three__WEBPACK_IMPORTED_MODULE_1__.UniformsLib.common,\n        three__WEBPACK_IMPORTED_MODULE_1__.UniformsLib.lights,\n    ]));\n    earthUniforms = uniforms;\n    uniforms.map = new three__WEBPACK_IMPORTED_MODULE_1__.Uniform(texture);\n    uniforms.mapDark = new three__WEBPACK_IMPORTED_MODULE_1__.Uniform(texture2);\n    // uniforms.mapAlt = new THREE.Uniform(texture3);\n    var material = earthMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.ShaderMaterial({\n        vertexShader: __webpack_require__(/*! ./shaders/planet.vs.glsl */ \"./src/shaders/planet.vs.glsl\").default,\n        fragmentShader: __webpack_require__(/*! ./shaders/planet.fs.glsl */ \"./src/shaders/planet.fs.glsl\").default,\n        uniforms: uniforms,\n        lights: true,\n        defines: {\n            USE_UV: 1,\n            USE_MAP: 1,\n        }\n    });\n    var mesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(geometry, material);\n    var cloudUniforms = three__WEBPACK_IMPORTED_MODULE_1__.UniformsUtils.clone(three__WEBPACK_IMPORTED_MODULE_1__.UniformsUtils.merge([\n        three__WEBPACK_IMPORTED_MODULE_1__.UniformsLib.common,\n        three__WEBPACK_IMPORTED_MODULE_1__.UniformsLib.lights,\n    ]));\n    cloudUniforms.map = new three__WEBPACK_IMPORTED_MODULE_1__.Uniform(textureCloud);\n    var cloudMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshPhongMaterial({\n        map: textureCloud,\n        transparent: true,\n    }); /*new THREE.ShaderMaterial({\n        vertexShader: require('./shaders/planet.vs.glsl').default,\n        fragmentShader: require('./shaders/cloud.fs.glsl').default,\n        uniforms: cloudUniforms,\n        // side: THREE.DoubleSide,\n        transparent: true,\n        lights: true,\n        alphaTest: 0.1,\n        defines: {\n            USE_UV: 1,\n            USE_MAP: 1,\n        }\n    });*/\n    // const cloudMaterial = new THREE.MeshPhongMaterial({\n    //     alphaMap: textureCloud\n    // });\n    var cloudSphere = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(geometry, cloudMaterial);\n    cloudSphere.layers.disableAll();\n    cloudSphere.layers.enable(1);\n    var cloudScale = 1.004;\n    cloudSphere.scale.set(cloudScale, cloudScale, cloudScale);\n    var group = new three__WEBPACK_IMPORTED_MODULE_1__.Group();\n    group.add(mesh);\n    group.add(cloudSphere);\n    // mesh.rotateZ(Math.PI);\n    return group;\n}\nfunction gpsToXYZ(latitude, longitude) {\n    var longRad = (longitude + 90) / 180 * Math.PI;\n    var latRad = latitude / 180 * Math.PI;\n    var scaling = 10.04;\n    var y = Math.sin(latRad);\n    var radiusAtLatitude = Math.cos(latRad);\n    var z = Math.cos(longRad) * radiusAtLatitude;\n    var x = Math.sin(longRad) * radiusAtLatitude;\n    return new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(x * scaling, y * scaling, z * scaling);\n}\n\n\n//# sourceURL=webpack://globescanner/./src/main.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// Promise = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"app": 0
/******/ 		};
/******/ 		
/******/ 		var deferredModules = [
/******/ 			["./src/main.ts","vendors"]
/******/ 		];
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		var checkDeferredModules = () => {
/******/ 		
/******/ 		};
/******/ 		function checkDeferredModulesImpl() {
/******/ 			var result;
/******/ 			for(var i = 0; i < deferredModules.length; i++) {
/******/ 				var deferredModule = deferredModules[i];
/******/ 				var fulfilled = true;
/******/ 				for(var j = 1; j < deferredModule.length; j++) {
/******/ 					var depId = deferredModule[j];
/******/ 					if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferredModules.splice(i--, 1);
/******/ 					result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 				}
/******/ 			}
/******/ 			if(deferredModules.length === 0) {
/******/ 				__webpack_require__.x();
/******/ 				__webpack_require__.x = () => {
/******/ 		
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		}
/******/ 		__webpack_require__.x = () => {
/******/ 			// reset startup function so it can be called again when more startup code is added
/******/ 			__webpack_require__.x = () => {
/******/ 		
/******/ 			}
/******/ 			chunkLoadingGlobal = chunkLoadingGlobal.slice();
/******/ 			for(var i = 0; i < chunkLoadingGlobal.length; i++) webpackJsonpCallback(chunkLoadingGlobal[i]);
/******/ 			return (checkDeferredModules = checkDeferredModulesImpl)();
/******/ 		};
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (data) => {
/******/ 			var [chunkIds, moreModules, runtime, executeModules] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0, resolves = [];
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					resolves.push(installedChunks[chunkId][0]);
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			for(moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			parentChunkLoadingFunction(data);
/******/ 			while(resolves.length) {
/******/ 				resolves.shift()();
/******/ 			}
/******/ 		
/******/ 			// add entry modules from loaded chunk to deferred list
/******/ 			if(executeModules) deferredModules.push.apply(deferredModules, executeModules);
/******/ 		
/******/ 			// run deferred modules when all chunks ready
/******/ 			return checkDeferredModules();
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkglobescanner"] = self["webpackChunkglobescanner"] || [];
/******/ 		var parentChunkLoadingFunction = chunkLoadingGlobal.push.bind(chunkLoadingGlobal);
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// run startup
/******/ 	return __webpack_require__.x();
/******/ })()
;