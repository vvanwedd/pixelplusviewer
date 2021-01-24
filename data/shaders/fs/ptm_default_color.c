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

uniform sampler2D ptmCoeffTex[6];

//uniform sampler2D ptmCoeff1Tex;
//uniform sampler2D ptmRgbCoeffTex;

uniform float uBoolFloatTexture;
uniform vec3 uScalePTM0;
uniform vec3 uBiasPTM0;
uniform vec3 uScalePTM1;
uniform vec3 uBiasPTM1;

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

void main(void)
{
    if(uMaterialAmbient.x != 66666666.0){
    gl_FragColor = uMaterialAmbient;
  }
  else{
  vec3 ptmCoeff[6];
  vec3 ptm;
  vec3 lightDirection = uLightDirection0;
  vec3 lightDirection1 = uLightDirection1;

 // vec3 lm0 = vec3(lightDirection.x*lightDirection.x, lightDirection.y*lightDirection.y, lightDirection.x*lightDirection.y);
 // vec3 lm1 = vec3(lightDirection.x, lightDirection.y, 1.0);

  //vec3 lm0 = vec3(1.0, lightDirection.x, lightDirection.y);
  //vec3 lm1 = vec3( lightDirection.x*lightDirection.x, lightDirection.y*lightDirection.x, lightDirection.y*lightDirection.y );
  //vec3 lm00 = vec3(1.0, lightDirection1.x, lightDirection1.y);
  //vec3 lm01 = vec3( lightDirection1.x*lightDirection1.x, lightDirection1.y*lightDirection1.x, lightDirection1.y*lightDirection1.y );


  //	var w = [1.0, v[0], v[1], v[0]*v[0], v[0]*v[1], v[1]*v[1], 0, 0, 0];

  if(uBoolScml == 1.0){
   // for(int i = 0; i < 1; i++){
      ptmCoeff[0] = vec3( texture2D(scmlTex0, vTextureCoord) ).rgb;
      ptmCoeff[1] = vec3( texture2D(scmlTex1, vTextureCoord) ).rgb;
      ptmCoeff[2] = vec3( texture2D(scmlTex2, vTextureCoord) ).rgb;
      ptmCoeff[3] = vec3( texture2D(scmlTex3, vTextureCoord) ).rgb;
      ptmCoeff[4] = vec3( texture2D(scmlTex4, vTextureCoord) ).rgb;
      ptmCoeff[5] = vec3( texture2D(scmlTex5, vTextureCoord) ).rgb;

      for(int i = 0; i < 6; i++){
        ptmCoeff[i].x = scmlScale[3*i] * (ptmCoeff[i].x - scmlBias[3*i]);
        ptmCoeff[i].y = scmlScale[3*i+1] * (ptmCoeff[i].y - scmlBias[3*i+1]);
        ptmCoeff[i].z = scmlScale[3*i+2] * (ptmCoeff[i].z - scmlBias[3*i+2]);

       ptm +=   ptmCoeff[i]*(rtiWeights0[i]*uLightIntensity0 + rtiWeights1[i]*uLightIntensity1);
      
    }
  }

  if(uMaterialAmbient.x == 66666666.0){
    gl_FragColor = vec4(ptm, 1.0);//lum*ptmCoeffRgb *255.0
  }
  else{
    gl_FragColor = uMaterialAmbient;
  }
}
}