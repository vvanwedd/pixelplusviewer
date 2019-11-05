precision highp float;

//geometry
uniform vec4 uMaterialDiffuse;
uniform vec4 uMaterialAmbient;

uniform mat4 uNMatrix;

uniform vec4 uLightAmbient;
uniform float uLightIntensity0;
uniform float uLightIntensity1;
uniform vec3 uLightDirection0;
uniform vec3 uLightDirection1;

//samplers
uniform sampler2D uSampler;
uniform sampler2D uNormalSampler;
uniform sampler2D uDispSampler;

//varying
varying vec4 vColor;
varying vec2 vTextureCoord;
varying vec3 vTangentLightDir;
varying vec3 vTangentEyeDir;

const float factor = 0.4;

void main(void)
{   
	// Unpack tangent-space normal from texture
	vec3 normal = texture2D(uNormalSampler, vTextureCoord).rgb;
	normal.b = normal.b*factor;
  	normal = normalize(normal);
	normal = (uNMatrix * vec4(normal, 0.0)).xyz;
    

   // Normalize light direction
	vec3 light0 = normalize(uLightDirection0.xyz);
	vec3 light1 = normalize(uLightDirection1.xyz);
		
	float diffuseTerm0 = max(0.0,dot(normal,light0)); //lamberterm would be max of this and predescribed value, eg 0.2
	vec3 diffspec0 = vec3(1.0,1.0,1.0)*diffuseTerm0;
	float diffuseTerm1 =  max(0.0,dot(normal,light1)); //lamberterm would be max of this and predescribed value, eg 0.2
	vec3 diffspec1 = vec3(1.0,1.0,1.0)*diffuseTerm1;
	
	vec3 total = (uLightIntensity0 ) * diffspec0 + (uLightIntensity1 ) * diffspec1;
    
	gl_FragColor = vec4(total,1.0) + uMaterialAmbient;
}
