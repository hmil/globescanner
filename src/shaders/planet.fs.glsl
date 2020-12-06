varying vec2 vUv;
uniform sampler2D map;
uniform sampler2D mapDark;
uniform sampler2D mapAlt;
// uniform sampler2D mapCloud;

uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;

#include <common>
#include <packing>
#include <bsdfs>
#include <lights_pars_begin>
#include <lights_phong_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>


void main() {

    #include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <specularmap_fragment>

    vec3 diffuseColor = vec3(texture2D(map, vUv));
    // vec4 colorCloud = texture2D(mapCloud, vUv);
    vec3 colorDark = vec3(texture2D(mapDark, vUv)) * vec3(1.0, 0.88, 0.0);
    // colorDark = mix(colorDark, vec3(0.1, 0.1, 0.1), colorCloud.a);
    // vec3 tex3 = vec3(texture2D(mapAlt, vUv));
    // vec3 diffuseColor = mix(tex1, tex3, saturate(length(tex3)));
    // diffuseColor = mix(diffuseColor, vec3(colorCloud), colorCloud.a);
    ReflectedLight reflectedLight = ReflectedLight( vec3(0.0), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;

    #include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>

    directionalLight = directionalLights[ 0 ];
    float incidence = saturate( dot(normal, directionalLight.direction ) );
    incidence = 1.0 - saturate(20.0 * incidence - 2.0);

	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + /*reflectedLight.directSpecular + reflectedLight.indirectSpecular +*/ totalEmissiveRadiance;
    // float intensity = length(outgoingLight);
    // intensity = clamp(intensity, 0.0, 1.0);

    // gl_FragColor = vec4(mix(outgoingLight + colorDark * incidence, vec3(1.0 - incidence + 0.1), colorCloud.a), 1.0);
    gl_FragColor = vec4(outgoingLight + colorDark * incidence * 0.4, 1.0);
}
