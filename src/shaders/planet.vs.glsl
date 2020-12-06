#include <common>
varying vec2 vUv;
varying vec3 vViewPosition;
varying vec3 vNormal;

void main() {
    #include <beginnormal_vertex>
    #include <defaultnormal_vertex>
    vUv = uv;

    vNormal = normalize( transformedNormal );

    #include <begin_vertex>
    #include <project_vertex>

	vViewPosition = mvPosition.xyz;

    // vec4 transformed = vec4( position, 1.0 );
    // gl_Position = projectionMatrix * modelViewMatrix * transformed;
}
