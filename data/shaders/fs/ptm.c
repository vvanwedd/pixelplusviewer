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

uniform sampler2D ptmCoeff0Tex;
uniform sampler2D ptmCoeff1Tex;
uniform sampler2D ptmRgbCoeffTex;

//varying
varying vec4 vColor;
varying vec2 vTextureCoord;
varying vec3 vTangentLightDir;
varying vec3 vTangentEyeDir;

void main(void)
{   
  vec3 ptmCoeff0 = vec3( texture2D(ptmCoeff0Tex, vTextureCoord) ).rgb;
  vec3 ptmCoeff1 = vec3( texture2D(ptmCoeff1Tex, vTextureCoord) ).rgb;
  vec3 ptmCoeffRgb = vec3( texture2D(ptmRgbCoeffTex, vTextureCoord) ).rgb;

  vec3 lightDirection = normalize(uLightDirection0.xyz);

  vec3 lm0 = vec3(lightDirection.x*lightDirection.x, lightDirection.y*lightDirection.y, lightDirection.x*lightDirection.y);
  vec3 lm1 = vec3(lightDirection.x, lightDirection.y, 1.0);

  vec3 tmp0 = ptmCoeff0*lm0;  
  vec3 tmp1 = ptmCoeff1*lm1;

  float lum = (tmp0.x + tmp0.y + tmp0.z + tmp1.x + tmp1.y + tmp1.z)*uLightIntensity0/255.0/255.0/5.0;

  //hsh = 0.000005*hweights0*hsh0 + 10000.0*hweights1*hsh1;//+hsh0;
  //float nDotH = max(min(dot(normal, lightDirection), 0.0f), 1.0f);
  //gl_FragColor = vec4(hsh0.x,1.0,1.0,1.0);
  gl_FragColor = vec4(lum*ptmCoeffRgb, 1.0) + uMaterialAmbient;
}
