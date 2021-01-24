precision highp float;

//geometry
uniform vec4 uMaterialDiffuse;
uniform vec4 uMaterialAmbient;

uniform mat4 uNMatrix;

uniform vec4 uLightAmbient;
uniform float uLightIntensity0;
uniform float uLightIntensity1;
uniform float uParam[5];
uniform vec3 uLightDirection0;
uniform vec3 uLightDirection1;

//samplers
uniform sampler2D uAlbedoSampler;
uniform sampler2D uNormalSampler;
uniform sampler2D uDispSampler;

uniform float uBoolFloatTexture;
uniform float uBoolScml;
uniform float scmlBias[21];
uniform float scmlScale[21];
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


uniform vec4 uScaleHSH;
uniform vec4 uBiasHSH;

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
    if(uMaterialAmbient.x != 66666666.0){
		gl_FragColor = uMaterialAmbient;
	}
	else{
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


vec3 hshL0 = vec3(0.0, 0.0, 0.0);
vec3 hshL1 = vec3(0.0, 0.0, 0.0);

if(uBoolScml == 1.0){

  vec3 lightDirection = normalize(uLightDirection0.xyz);
  
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
        
        //hshCoeff[i] *= (rtiWeights0[i] * uLightIntensity0 + rtiWeights1[i] * uLightIntensity1);
        hshL0 += (hshCoeff[i] *rtiWeights0[i] * uLightIntensity0);
        hshL1 += (hshCoeff[i] *rtiWeights1[i] * uLightIntensity1);
        //hsh += hshCoeff[i];
      }
      
}


	vec3 normal;
	// Unpack tangent-space normal from texture
  normal = texture2D(uNormalSampler, vTextureCoord).rgb;

    vec2 lightIntensity = vec2(uLightIntensity0, uLightIntensity1);
  if(uBoolScml == 1.0){
    normal.x = scmlScale[18]*( normal.x - scmlBias[18]);
    normal.y = scmlScale[19]*( normal.y - scmlBias[19]);
    normal.z = scmlScale[20]*( normal.z - scmlBias[20]);
    lightIntensity *= 0.33;
  }
  
	if(uBoolFloatTexture !=1.0 && uBoolScml != 1.0){normal = 2.0*(normal - 0.5);}
	normal = (uNMatrix * vec4(normal, 0.0)).xyz;
  normal = normalize(normal);

  vec3 lightDirection = normalize(uLightDirection0.xyz);
  vec3 h0 = vec3(0.0, 0.0, 1.0);
  h0 += lightDirection;
  h0 = normalize(h0);
  float nDotH0 = max(0.0,dot(normal,h0));

  nDotH0 = pow(nDotH0, uParam[0]*50.0);
  float spec0 = /*(hshL0.x + hshL0.y + hshL0.z) * */uParam[1] / uLightIntensity0 /10.0* nDotH0;

  vec3 lightDirection1 = normalize(uLightDirection1.xyz);

  h0 = vec3(0.0, 0.0, 1.0);
  h0 += lightDirection1;
  h0 = normalize(h0);
  nDotH0 = max(0.0,dot(normal,h0));

  nDotH0 = pow(nDotH0, uParam[0]*50.0);
  float spec1 = /*(hshL1.x + hshL1.y + hshL1.z) * */uParam[1] /uLightIntensity0 /10.0 * nDotH0;
  
//hsh = 0.000005*hweights0*hsh0 + 10000.0*hweights1*hsh1;//+hsh0;
 //float nDotH = max(min(dot(normal, lightDirection), 0.0f), 1.0f);
 //gl_FragColor = vec4(hsh0.x,1.0,1.0,1.0);

  //vec3 test = max(0.0,dot(normal,lightDirection))*vec3(1.0, 1.0, 1.0);
	// gl_FragColor =  vec4(test * uLightIntensity0/5.0, 1.0  );
	 gl_FragColor =  vec4(hshL0 * uParam[2] / 100.0 + spec0*vec3(1.0, 1.0, 1.0) * uLightIntensity0  + hshL1 * uParam[2] / 100.0 + spec1*vec3(1.0, 1.0, 1.0) * uLightIntensity1, 1.0);
  }
}
