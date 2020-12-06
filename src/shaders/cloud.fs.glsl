varying vec2 vUv;
varying vec3 vNormal;
uniform sampler2D map;

#include <common>
#include <packing>
#include <lights_pars_begin>

void main() {

    #include <normal_fragment_begin>

    vec4 tex1 = texture2D(map, vUv);

    DirectionalLight directionalLight = directionalLights[ 0 ];
    float incidence = saturate( dot(normal, directionalLight.direction ) );
    incidence = saturate(5.0 * incidence - 0.5);

    gl_FragColor = vec4(vec3(tex1) * incidence, tex1.a);

    // gl_FragColor = vec4(vec3(gl_FragCoord.z), 1.0);
}
