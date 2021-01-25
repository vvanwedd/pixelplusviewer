precision highp float;

//geometry
uniform vec4 uMaterialDiffuse;
uniform vec4 uMaterialAmbient;

uniform mat4 uNMatrix;

uniform vec4 uLightAmbient;
uniform float uLightIntensity0;
uniform float uLightIntensity1;
uniform float uParam[5];
uniform float uParam1;
uniform float uParam2;
uniform vec3 uLightDirection0;
uniform vec3 uLightDirection1;

uniform vec3 rbfBase[19];
uniform float rbfBias[19];
uniform float rbfScale[19];
uniform float uBoolFloatTexture;

uniform float uBoolScml;
uniform float scmlBias[22];
uniform float scmlScale[22];
uniform vec3 rtiWeights0[20];
uniform vec3 rtiWeights1[20];

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
uniform sampler2D uNormalSampler;

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
  vec2 lightIntensity = vec2(uLightIntensity0, uLightIntensity1);

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

    lightIntensity *= 0.33;

    rbfCoeff[0] = vec3( texture2D(scmlTex0, vTextureCoord) ).rgb;
    rbfCoeff[1] = vec3( texture2D(scmlTex1, vTextureCoord) ).rgb;
    rbfCoeff[2] = vec3( texture2D(scmlTex2, vTextureCoord) ).rgb;
    rbfCoeff[3] = vec3( texture2D(scmlTex3, vTextureCoord) ).rgb;
    rbfCoeff[4] = vec3( texture2D(scmlTex4, vTextureCoord) ).rgb;
    rbfCoeff[5] = vec3( texture2D(scmlTex5, vTextureCoord) ).rgb;
    //rbfCoeff[6] = vec3( texture2D(scmlTex6, vTextureCoord) ).rgb;
    //rbfCoeff[7] = vec3( texture2D(scmlTex7, vTextureCoord) ).rgb;

    rbf0 = rtiWeights0[0];// * uLightIntensity0;
    rbf1 = rtiWeights1[0];


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

	vec3 normal = texture2D(uNormalSampler, vTextureCoord).rgb;
	if(uBoolFloatTexture != 1.0 && uBoolScml != 1.0){normal = 2.0*(normal - 0.5);}
	//normal.x = -normal.x;
if(uBoolScml == 1.0){
    normal.x = scmlScale[19]*( normal.x - scmlBias[19]);
    normal.y = scmlScale[20]*( normal.y - scmlBias[20]);
    normal.z = scmlScale[21]*( normal.z - scmlBias[21]);
	//lightIntensity *= 0.33;
  }
  //normal.x = -normal.x;
  normal = (uNMatrix * vec4(normal, 0.0)).xyz;
  normal = normalize(normal);

  vec3 lightDirection = normalize(uLightDirection0.xyz);
  vec3 h0 = vec3(0.0, 0.0, 1.0);
  h0 += lightDirection;
  h0 = normalize(h0);
  float nDotH0 = max(0.0,dot(normal,h0));

  nDotH0 = pow(nDotH0, uParam[0]*50.0);
  float spec0 = /*(rbf0.x + rbf0.y + rbf0.z) **/ uParam[1]  / 10.0* nDotH0;

  vec3 lightDirection1 = normalize(uLightDirection1.xyz);

  h0 = vec3(0.0, 0.0, 1.0);
  h0 += lightDirection1;
  h0 = normalize(h0);
  nDotH0 = max(0.0,dot(normal,h0));

  nDotH0 = pow(nDotH0, uParam[0]*50.0);
  float spec1 = /*(rbf1.x + rbf1.y + rbf1.z) **/ uParam[1] /10.0 * nDotH0;
  
  //vec3 test = max(0.0,dot(normal,lightDirection))*vec3(1.0, 1.0, 1.0);
//	 gl_FragColor =  vec4(test * uLightIntensity0/5.0, 1.0  );
	 gl_FragColor =  vec4((rbf0 * uParam[2] / 100.0 + spec0*vec3(1.0, 1.0, 1.0)) * lightIntensity.x  + (rbf1 * uParam[2] / 100.0 + spec1*vec3(1.0, 1.0, 1.0)) * lightIntensity.y, 1.0);
  }

}
