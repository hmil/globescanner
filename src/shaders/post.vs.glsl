varying vec2 vUv;
varying vec2 projectedPos;
uniform mat4 projectionMatrixInv;

void main() {
	vUv = uv;
    projectedPos = uv * 2.0 - vec2(1.0, 1.0); 
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
