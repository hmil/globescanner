uniform sampler2D tDepth;
uniform sampler2D tColor;
varying vec2 vUv;
uniform float nearClip;
uniform float farClip;
varying vec2 projectedPos;
uniform mat4 projectionMatrixInv;
uniform vec3 lightDirection;
uniform vec3 fogColor;
uniform float density;
uniform float size;

#include <common>
#include <packing>

float getDepth( const in vec2 screenPosition ) {
	return unpackRGBAToDepth( texture2D( tDepth, screenPosition ) );
}

float getViewZ( const in float depth ) {
	return perspectiveDepthToViewZ( depth, nearClip, farClip );
}

vec3 unproject(const in float depth ) {
    vec4 vect = projectionMatrixInv * vec4(projectedPos, depth, 1.0);
    return vec3(vect) / vect.w;
}

vec3 debugVectors( const in vec3 coords) {
    return coords;
}

float getFogSamplerT(const in float impactDepth, const in float endDepth, const in float startDepth) {
    if (impactDepth < endDepth) {
        return impactDepth;
    } else {
        return startDepth + (endDepth - startDepth) / 2.0;
    }
}

float compress(const in float value, const in float amount) {
    return (value + amount) / (1.0 + amount);
}

vec3 getBgColor(const in vec3 objectColor, const in vec3 bgColor, const in float impactDepth) {
    if (impactDepth < farClip) {
        return objectColor;
    } else {
        return bgColor;
    }
}

void main() {
    vec3 color = vec3(texture2D(tColor, vUv));
    float depth = (getDepth(vUv) - 0.5) * 2.0;
    vec3 p1 = unproject(depth);
    vec3 p0 = unproject(0.0);

    float viewZ = getViewZ(getDepth(vUv));
    float impactDepth = length(p0 - p1);
    vec3 direction = (p1 - p0) / impactDepth;
    vec3 offset = p0;

    // Sphere intersection
    float radius = 10.0 + 10.0 * size;
    float radius2 = radius * radius;
    
    float a = direction.x * direction.x + direction.y * direction.y + direction.z * direction.z;
    float b = 2.0 * (direction.x * offset.x + direction.y * offset.y + direction.z * offset.z);
    float c = offset.x * offset.x + offset.y * offset.y + offset.z * offset.z - radius2;

    float com = b * b - 4.0 * a * c;

    float cameraIncidence = saturate(dot(direction, lightDirection));
    float hdr = cameraIncidence * cameraIncidence;

    vec3 directSun = color * compress(hdr, 0.3) + saturate(cameraIncidence * 100000.0 - 99990.0);

    if (com < 0.0) {
        gl_FragColor = vec4(directSun, 1.0);
    } else {
        float t1 = (-b - sqrt(com)) / 2.0 * a;
        float t2 = (-b + sqrt(com)) / 2.0 * a;

        // Distance travelled in the fog
        float fogTravel = (min(impactDepth, t2) - t1);
        // Probe the maximum fog depth travelled
        vec3 impact = direction * getFogSamplerT(impactDepth, t2, t1) + offset;
        float penetration = radius - length(impact);
        // Effect of incident light
        float incidence = saturate(dot(normalize(impact), lightDirection));
        // Effect of camera angle
        float refraction = compress(cameraIncidence, 0.2);

        vec3 bg = getBgColor(color + 3.0 * color * hdr, directSun, impactDepth); 

        gl_FragColor = vec4(saturate(bg
            + fogColor  * incidence 
                        * refraction 
                        * fogTravel * density 
                        * penetration * penetration
        ), 1.0);
        // gl_FragColor = vec4(color, 1.0);
    }
}