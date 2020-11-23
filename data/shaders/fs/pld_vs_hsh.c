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

uniform float uParam0;
uniform float uParam2;

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
  vec3 hsh0;
  vec3 hsh1;
  vec3 hsh2;
  vec3 hsh3;

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

  vec3 lightDirection1 = normalize(uLightDirection1.xyz);
  float phi1 = atan(lightDirection1.y, lightDirection1.x);
  if(phi1 < 0.0){phi1 = 2.0*M_PI+phi1;}

  float theta1 = min(acos(lightDirection1.z), M_PI / 2.0 - 0.04);

  float cosPhi1 = cos(phi1);
  float cosTheta1 = cos(theta1);
  float cosTheta21 = cosTheta1 * cosTheta1;

  float hweights01 = 1.0/sqrt(2.0*M_PI);
	float hweights11 = sqrt(6.0/M_PI)      *  (cosPhi1*sqrt(cosTheta1-cosTheta21));
	float hweights21 = sqrt(3.0/(2.0*M_PI))  *  (-1.0 + 2.0*cosTheta1);
	float hweights31 = sqrt(6.0/M_PI)      *  (sqrt(cosTheta1 - cosTheta21)*sin(phi1));
  //float hweights4 = sqrt(30.0f/M_PI)     *  (cos(2.0f*phi)*(-cosTheta + cosTheta2));
	//float	hweights5 = sqrt(30.0f/M_PI)     *  (cosPhi*(-1.0f + 2.0f*cosTheta)*sqrt(cosTheta - cosTheta2));

  vec3 hshl1 = hweights01*hsh0 + hweights11*hsh1 + hweights21*hsh2 + hweights31*hsh3;
  //hsh = 0.000005*hweights0*hsh0 + 10000.0*hweights1*hsh1;//+hsh0;
  //float nDotH = max(min(dot(normal, lightDirection), 0.0f), 1.0f);
  //gl_FragColor = vec4(hsh0.x,1.0,1.0,1.0);


  vec3 normal = texture2D(uNormalSampler, vTextureCoord).rgb;
	if(uBoolFloatTexture!=1.0){normal = 2.0*(normal - 0.5);}
  normal = (uNMatrix * vec4(normal, 0.0)).xyz;
  vec3 albedo = texture2D(uAlbedoSampler, vTextureCoord).rgb;
	//vec3 albedo2 = texture2D(uAlbedo2Sampler, vTextureCoord).rgb;

	vec3 albedoMix = vec3(albedo.r, albedo.g, albedo.b);

  // Normalize light direction
	vec3 light0 = normalize(uLightDirection0.xyz);
	vec3 light1 = normalize(uLightDirection1.xyz);

  float diffuseTerm0 = max(0.0,dot(normal,light0)); //lamberterm would be max of this and predescribed value, eg 0.2
	vec3 diffspec0 = albedoMix*diffuseTerm0;
	float diffuseTerm1 =  max(0.0,dot(normal,light1)); //lamberterm would be max of this and predescribed value, eg 0.2
	vec3 diffspec1 = albedoMix*diffuseTerm1;


 vec3 differenceTerm0 = hsh/2.0*uParam0 - diffspec1;
 vec3 differenceTerm1 = hshl1/2.0*uParam0 - diffspec1;

 differenceTerm0 = vec3(differenceTerm0.x*differenceTerm0.x, differenceTerm0.y*differenceTerm0.y, differenceTerm0.z*differenceTerm0.z);

  if(uMaterialAmbient.x != 66666666.0){
		gl_FragColor = uMaterialAmbient;
	}
	else{
	 gl_FragColor =  vec4(differenceTerm0*uParam2, 1.0);
  }
}
