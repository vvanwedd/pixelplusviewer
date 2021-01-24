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

uniform vec3 rbfBase[19];
uniform float rbfBias[19];
uniform float rbfScale[19];
uniform float uBoolFloatTexture;

uniform float uBoolScml;
uniform float scmlBias[19];
uniform float scmlScale[30];
uniform vec3 rtiWeights0[19];
uniform vec3 rtiWeights1[19];

uniform sampler2D scmlTex0;
uniform sampler2D scmlTex1;
uniform sampler2D scmlTex2;
uniform sampler2D scmlTex3;
uniform sampler2D scmlTex4;
uniform sampler2D scmlTex5;
uniform sampler2D scmlTex6;
uniform sampler2D scmlTex7;



//samplers
uniform sampler2D rbfCoeff0Tex;
uniform sampler2D rbfCoeff1Tex;
uniform sampler2D rbfCoeff2Tex;
uniform sampler2D rbfCoeff3Tex;
uniform sampler2D rbfCoeff4Tex;
uniform sampler2D rbfCoeff5Tex;

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

  vec3 rbf0 = vec3( 0.0, 0.0, 0.0);
  vec3 rbf1 = vec3( 0.0, 0.0, 0.0);

  vec3 rbfCoeff[6];

  if(uBoolScml != 1.0){

  rbfCoeff[0] = vec3( texture2D(rbfCoeff0Tex, vTextureCoord) ).rgb;
  rbfCoeff[1] = vec3( texture2D(rbfCoeff1Tex, vTextureCoord) ).rgb;
  rbfCoeff[2] = vec3( texture2D(rbfCoeff2Tex, vTextureCoord) ).rgb;
  rbfCoeff[3] = vec3( texture2D(rbfCoeff3Tex, vTextureCoord) ).rgb;
  rbfCoeff[4] = vec3( texture2D(rbfCoeff4Tex, vTextureCoord) ).rgb;
  rbfCoeff[5] = vec3( texture2D(rbfCoeff5Tex, vTextureCoord) ).rgb;

  vec3 color = rbfBase[0];
  for(int j = 0; j < 6; j++) {
		color += rbfBase[j*3+1]*(rbfCoeff[j].x - rbfBias[j*3+1])*rbfScale[j*3+1];
		color += rbfBase[j*3+2]*(rbfCoeff[j].y - rbfBias[j*3+2])*rbfScale[j*3+2];
		color += rbfBase[j*3+3]*(rbfCoeff[j].z - rbfBias[j*3+3])*rbfScale[j*3+3];
   }

   rbf0 = color;
  } else {

 

    rbfCoeff[0] = vec3( texture2D(scmlTex0, vTextureCoord) ).rgb;
    rbfCoeff[1] = vec3( texture2D(scmlTex1, vTextureCoord) ).rgb;
    rbfCoeff[2] = vec3( texture2D(scmlTex2, vTextureCoord) ).rgb;
    rbfCoeff[3] = vec3( texture2D(scmlTex3, vTextureCoord) ).rgb;
    rbfCoeff[4] = vec3( texture2D(scmlTex4, vTextureCoord) ).rgb;
    rbfCoeff[5] = vec3( texture2D(scmlTex5, vTextureCoord) ).rgb;
    //rbfCoeff[6] = vec3( texture2D(scmlTex6, vTextureCoord) ).rgb;
    //rbfCoeff[7] = vec3( texture2D(scmlTex7, vTextureCoord) ).rgb;

    rbf0 = rtiWeights0[0];
    rbf1 = rtiWeights1[0];// * uLightIntensity0;
    //rbf += rtiWeights1[0] * uLightIntensity1;


    for(int i = 0; i < 6; i++){
     // rbfCoeff[i].x = scmlScale[3*i+1] * (rbfCoeff[i].x - scmlBias[3*i+1]);
     // rbfCoeff[i].y = scmlScale[3*i+2] * (rbfCoeff[i].y - scmlBias[3*i+2]);
     // rbfCoeff[i].z = scmlScale[3*i+3] * (rbfCoeff[i].z - scmlBias[3*i+3]);
        
     // rbf += rbfCoeff[i].x * uLightIntensity0 * rtiWeights0[i*3+1];
     // rbf += rbfCoeff[i].y * uLightIntensity0 * rtiWeights0[i*3+2];
     // rbf += rbfCoeff[i].z * uLightIntensity0 * rtiWeights0[i*3+3];
      //rbf += rbfCoeff[i];
rbf0 += rtiWeights0[i*3+1] * (rbfCoeff[i].x - scmlBias[3*i+1]) * scmlScale[3*i+1];
rbf0 += rtiWeights0[i*3+2] * (rbfCoeff[i].y - scmlBias[3*i+2]) * scmlScale[3*i+2];
rbf0 += rtiWeights0[i*3+3] * (rbfCoeff[i].z - scmlBias[3*i+3]) * scmlScale[3*i+3];

rbf1 += rtiWeights1[i*3+1] * (rbfCoeff[i].x - scmlBias[3*i+1]) * scmlScale[3*i+1];
rbf1 += rtiWeights1[i*3+2] * (rbfCoeff[i].y - scmlBias[3*i+2]) * scmlScale[3*i+2];
rbf1 += rtiWeights1[i*3+3] * (rbfCoeff[i].z - scmlBias[3*i+3]) * scmlScale[3*i+3];

    }

  }
 
	 gl_FragColor =  vec4(rbf0 * uLightIntensity0 + rbf1 * uLightIntensity1, 1.0);
  }
}
