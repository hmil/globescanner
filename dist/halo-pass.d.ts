import * as THREE from 'three';
import { Pass } from 'three/examples/jsm/postprocessing/Pass';
export interface HaloPassParams {
    height: number;
    width: number;
}
export declare class HaloPass extends Pass {
    private readonly lightDirection;
    private readonly scene;
    private readonly camera;
    private materialDepth;
    private renderTargetDepth;
    private materialHalo;
    private fsQuad;
    private oldClearColor;
    private uniforms;
    fogColor: THREE.Vector3;
    density: number;
    size: number;
    constructor(lightDirection: THREE.Vector3, scene: THREE.Scene, camera: THREE.PerspectiveCamera, params: HaloPassParams);
    render(renderer: THREE.WebGLRenderer, writeBuffer: any, readBuffer: any): void;
}
//# sourceMappingURL=halo-pass.d.ts.map