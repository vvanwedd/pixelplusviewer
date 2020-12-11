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
  vec3 rbf[6];

  rbf[0] = vec3( texture2D(rbfCoeff0Tex, vTextureCoord) ).rgb;
  rbf[1] = vec3( texture2D(rbfCoeff1Tex, vTextureCoord) ).rgb;
  rbf[2] = vec3( texture2D(rbfCoeff2Tex, vTextureCoord) ).rgb;
  rbf[3] = vec3( texture2D(rbfCoeff3Tex, vTextureCoord) ).rgb;
  rbf[4] = vec3( texture2D(rbfCoeff4Tex, vTextureCoord) ).rgb;
  rbf[5] = vec3( texture2D(rbfCoeff5Tex, vTextureCoord) ).rgb;

  vec3 color = rbfBase[0];
  for(int j = 0; j < 6; j++) {
		color += rbfBase[j*3+1]*(rbf[j].x - rbfBias[j*3+1])*rbfScale[j*3+1];
		color += rbfBase[j*3+2]*(rbf[j].y - rbfBias[j*3+2])*rbfScale[j*3+2];
		color += rbfBase[j*3+3]*(rbf[j].z - rbfBias[j*3+3])*rbfScale[j*3+3];
   }

  vec4 total = vec4(color*uLightIntensity0*0.7,1.0);
  if(uMaterialAmbient.x != 66666666.0){
		gl_FragColor = uMaterialAmbient;
	}
	else{
	 gl_FragColor =  total;
  }
}
