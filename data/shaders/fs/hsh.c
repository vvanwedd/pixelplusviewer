precision highp float;

//geometry
uniform vec4 uMaterialDiffuse;
uniform vec4 uMaterialAmbient;

uniform mat4 uNMatrix;

uniform vec4 uLightAmbient;
uniform float uLightIntensity0;
uniform float uLightIntensity1;
uniform float uFloatTex;
uniform vec3 uLightDirection0;
uniform vec3 uLightDirection1;

//samplers
uniform sampler2D uAlbedoSampler;
uniform sampler2D uNormalSampler;
uniform sampler2D uDispSampler;

uniform sampler2D hshCoeff0Tex;
uniform sampler2D hshCoeff1Tex;
uniform sampler2D hshCoeff2Tex;
uniform sampler2D hshCoeff3Tex;

//varying
varying vec4 vColor;
varying vec2 vTextureCoord;
varying vec3 vTangentLightDir;
varying vec3 vTangentEyeDir;

int s = int(1.0 + 5.0*uLightIntensity1); 
const float gamma = 3.0;
const float M_PI = 3.1415926535897932384626433832795;

void main(void)
{   
  vec3 hsh0 = vec3( texture2D(hshCoeff0Tex, vTextureCoord) ).rgb;
  vec3 hsh1 = vec3( texture2D(hshCoeff1Tex, vTextureCoord) ).rgb;
  vec3 hsh2 = vec3( texture2D(hshCoeff2Tex, vTextureCoord) ).rgb;
  vec3 hsh3 = vec3( texture2D(hshCoeff3Tex, vTextureCoord) ).rgb;

  vec3 lightDirection = normalize(uLightDirection0.xyz);
  float phi = atan(lightDirection.y, lightDirection.x);
  if(phi < 0.0){phi = 2.0*M_PI+phi;}

  float theta = min(acos(lightDirection.z), M_PI / 2.0 - 0.04);

  float cosPhi = cos(phi);
  float cosTheta = cos(theta);
  float cosTheta2 = cosTheta * cosTheta;
	
  float hweights0 = 1.0/sqrt(2.0*M_PI);
	float hweights1 = sqrt(6.0/M_PI)      *  (cosPhi*sqrt(cosTheta-cosTheta2));
	float hweights2 = sqrt(3.0/(2.0*M_PI))  *  (-1.0 + 2.0*cosTheta);
	float hweights3 = sqrt(6.0/M_PI)      *  (sqrt(cosTheta - cosTheta2)*sin(phi));
  //float hweights4 = sqrt(30.0f/M_PI)     *  (cos(2.0f*phi)*(-cosTheta + cosTheta2));
	//float	hweights5 = sqrt(30.0f/M_PI)     *  (cosPhi*(-1.0f + 2.0f*cosTheta)*sqrt(cosTheta - cosTheta2));

 vec3 hsh = hweights0*hsh0 + hweights1*hsh1 + hweights2*hsh2 + hweights3*hsh3; 
//hsh = 0.000005*hweights0*hsh0 + 10000.0*hweights1*hsh1;//+hsh0;
 //float nDotH = max(min(dot(normal, lightDirection), 0.0f), 1.0f);
 //gl_FragColor = vec4(hsh0.x,1.0,1.0,1.0);
  gl_FragColor = vec4(hsh*uLightIntensity0, 1.0) + uMaterialAmbient;
}
