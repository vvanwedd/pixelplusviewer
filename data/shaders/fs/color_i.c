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

uniform float uBoolFloatTexture;
uniform float uBoolScml;
uniform float scmlPldBias[9];
uniform float scmlPldScale[9];


//samplers
uniform sampler2D uAlbedoSampler;
uniform sampler2D uAlbedo2Sampler;
uniform sampler2D uNormalSampler;
uniform sampler2D uDispSampler;

//varying
varying vec4 vColor;
varying vec2 vTextureCoord;
varying vec3 vTangentLightDir;
varying vec3 vTangentEyeDir;

void main(void)
{
  // Unpack tangent-space normal from texture
  vec3 normal = texture2D(uNormalSampler, vTextureCoord).rgb;
  vec3 albedo2 = texture2D(uAlbedo2Sampler, vTextureCoord).rgb;

  if(uBoolScml == 1.0){
    normal.x = scmlPldScale[0]*( normal.x - scmlPldBias[0]);
    normal.y = scmlPldScale[1]*( normal.y - scmlPldBias[1]);
    normal.z = scmlPldScale[2]*( normal.z - scmlPldBias[2]);
    albedo2.x = scmlPldScale[6]*( albedo2.x - scmlPldBias[6]);
    albedo2.y = scmlPldScale[7]*( albedo2.y - scmlPldBias[7]);
    albedo2.z = scmlPldScale[8]*( albedo2.z - scmlPldBias[8]);
  }
  if(uBoolFloatTexture!=1.0 && uBoolScml != 1.0){normal = 2.0*(normal - 0.5);}

  normal = (uNMatrix * vec4(normal, 0.0)).xyz;
  vec3 albedoMix = vec3(albedo2.r, albedo2.r, albedo2.r);

  // Normalize light direction
  vec3 light0 = normalize(uLightDirection0.xyz);
  vec3 light1 = normalize(uLightDirection1.xyz);

  float diffuseTerm0 = max(0.0,dot(normal,light0)); //lamberterm would be max of this and predescribed value, eg 0.2
  vec3 diffspec0 = albedoMix*diffuseTerm0;
  float diffuseTerm1 =  max(0.0,dot(normal,light1)); //lamberterm would be max of this and predescribed value, eg 0.2
  vec3 diffspec1 = albedoMix*diffuseTerm1;

  vec4 total = vec4(uLightIntensity0*diffspec0 + uLightIntensity1*diffspec1,1.0);
  if(uMaterialAmbient.x != 66666666.0){
    gl_FragColor = uMaterialAmbient;
  }
  else{
    gl_FragColor =  total;
  }
}

