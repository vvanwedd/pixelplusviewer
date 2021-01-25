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
uniform sampler2D uAlbedoSampler;
uniform sampler2D uNormalSampler;
uniform sampler2D uDispSampler;

uniform float uBoolFloatTexture;

uniform vec4 uScaleHSH;
uniform vec4 uBiasHSH;

uniform sampler2D hshCoeff0Tex;
uniform sampler2D hshCoeff1Tex;
uniform sampler2D hshCoeff2Tex;
uniform sampler2D hshCoeff3Tex;

uniform float uBoolScml;
uniform float scmlBias[30];
uniform float scmlScale[30];
uniform float rtiWeights0[9];
uniform float rtiWeights1[9];
uniform sampler2D scmlTex0;
uniform sampler2D scmlTex1;
uniform sampler2D scmlTex2;
uniform sampler2D scmlTex3;
uniform sampler2D scmlTex4;
uniform sampler2D scmlTex5;
uniform sampler2D scmlTex6;
uniform sampler2D scmlTex7;

//varying
varying vec4 vColor;
varying vec2 vTextureCoord;
varying vec3 vTangentLightDir;
varying vec3 vTangentEyeDir;

//int s = int(1.0 + 5.0*uLightIntensity1);
//const float gamma = 3.0;
//const float M_PI = 3.1415926535897932384626433832795;

void main(void)
{
    if(uMaterialAmbient.x != 66666666.0){
		gl_FragColor = uMaterialAmbient;
	}
	else{

  vec2 lightIntensity = vec2(uLightIntensity0, uLightIntensity1);
  vec3 hsh0;
  vec3 hsh1;
  vec3 hsh2;
  vec3 hsh3;
if(uBoolScml != 1.0){
  if(uBoolFloatTexture!=1.0){
    hsh0 = uScaleHSH.x*vec3( texture2D(hshCoeff0Tex, vTextureCoord) ).rgb + vec3(uBiasHSH.x,uBiasHSH.x, uBiasHSH.x);
    hsh1 = uScaleHSH.y*vec3( texture2D(hshCoeff1Tex, vTextureCoord) ).rgb + vec3(uBiasHSH.y,uBiasHSH.y, uBiasHSH.y);
    hsh2 = uScaleHSH.z*vec3( texture2D(hshCoeff2Tex, vTextureCoord) ).rgb + vec3(uBiasHSH.z,uBiasHSH.z, uBiasHSH.z);
    hsh3 = uScaleHSH.w*vec3( texture2D(hshCoeff3Tex, vTextureCoord) ).rgb + vec3(uBiasHSH.w,uBiasHSH.w, uBiasHSH.w);
  }
  else{
    hsh0 = vec3( texture2D(hshCoeff0Tex, vTextureCoord) ).rgb;
    hsh1 = vec3( texture2D(hshCoeff1Tex, vTextureCoord) ).rgb;
    hsh2 = vec3( texture2D(hshCoeff2Tex, vTextureCoord) ).rgb;
    hsh3 = vec3( texture2D(hshCoeff3Tex, vTextureCoord) ).rgb;
  }
}


vec3 hsh = vec3(0.0, 0.0, 0.0);

if(uBoolScml == 1.0){

  vec3 lightDirection = normalize(uLightDirection0.xyz);
  lightIntensity *= 0.33;
  //float hweights4 = sqrt(30.0f/M_PI)     *  (cos(2.0f*phi)*(-cosTheta + cosTheta2));
	//float	hweights5 = sqrt(30.0f/M_PI)     *  (cosPhi*(-1.0f + 2.0f*cosTheta)*sqrt(cosTheta - cosTheta2));

 // vec3 hsh = hweights0*hsh0 + hweights1*hsh1 + hweights2*hsh2 + hweights3*hsh3;
  vec3 hshCoeff[6];

      hshCoeff[0] = vec3( texture2D(scmlTex0, vTextureCoord) ).rgb;
      hshCoeff[1] = vec3( texture2D(scmlTex1, vTextureCoord) ).rgb;
      hshCoeff[2] = vec3( texture2D(scmlTex2, vTextureCoord) ).rgb;
      hshCoeff[3] = vec3( texture2D(scmlTex3, vTextureCoord) ).rgb;
      hshCoeff[4] = vec3( texture2D(scmlTex4, vTextureCoord) ).rgb;
      hshCoeff[5] = vec3( texture2D(scmlTex5, vTextureCoord) ).rgb;

      for(int i = 0; i < 4; i++){
        hshCoeff[i].x = scmlScale[3*i+0] * (hshCoeff[i].x - scmlBias[3*i+0]);
        hshCoeff[i].y = scmlScale[3*i+1] * (hshCoeff[i].y - scmlBias[3*i+1]);
        hshCoeff[i].z = scmlScale[3*i+2] * (hshCoeff[i].z - scmlBias[3*i+2]);
        
        hshCoeff[i] *= (rtiWeights0[i] * lightIntensity.x + rtiWeights1[i] * lightIntensity.y);
        hsh += hshCoeff[i];
      }
      
}



	 gl_FragColor =  vec4(hsh, 1.0);
  }
}
