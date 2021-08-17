precision highp float;

//geometry
uniform vec4 uMaterialDiffuse;
uniform vec4 uMaterialAmbient;

uniform mat4 uNMatrix;

uniform float uLightIntensity0;
uniform float uLightIntensity1;
uniform vec3 uLightDirection0;
uniform vec3 uLightDirection1;

uniform float uBoolFloatTexture;
uniform float uBoolScml;
uniform float scmlBias[3];
uniform float scmlScale[3];
uniform vec3 reflectanceChannelMix; //r g b ir uv


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
    if(uMaterialAmbient.x != 66666666.0){
    gl_FragColor = uMaterialAmbient;
  }
  else{


    
  vec3 reflectanceChannels = reflectanceChannelMix;
  
  // Unpack tangent-space normal from texture
  vec3 normal = texture2D(uNormalSampler, vTextureCoord).rgb;
  vec2 lightIntensity = vec2(uLightIntensity0, uLightIntensity1);
  if(uBoolScml == 1.0){
    normal.x = scmlScale[0]*( normal.x - scmlBias[0]);
    normal.y = scmlScale[1]*( normal.y - scmlBias[1]);
    normal.z = scmlScale[2]*( normal.z - scmlBias[2]);
    lightIntensity *= 0.33;
  }

  
  if(uBoolFloatTexture!=1.0 && uBoolScml != 1.0){normal = 2.0*(normal - 0.5);}

  normal = (uNMatrix * vec4(normal, 0.0)).xyz;

  vec3 light0 = normalize(uLightDirection0.xyz);
  vec3 light1 = normalize(uLightDirection1.xyz);

  vec3 c = 0.5*vec3(1.0, 1.0, 1.0);

  float diffuseTerm0 = max(0.0,dot(normal,light0)); 
  vec3 diffspec0 = c*diffuseTerm0;
  float diffuseTerm1 =  max(0.0,dot(normal,light1)); 
  vec3 diffspec1 = c*diffuseTerm1;

  vec4 total = vec4(lightIntensity.x*diffspec0 + lightIntensity.y*diffspec1,1.0);

    gl_FragColor =  total;
  }
}
