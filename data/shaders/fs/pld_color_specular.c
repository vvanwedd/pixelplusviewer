precision highp float;

//geometry
uniform vec4 uMaterialDiffuse;
uniform vec4 uMaterialAmbient;

uniform mat4 uNMatrix;

uniform float uLightIntensity0;
uniform float uLightIntensity1;
uniform vec3 uLightDirection0;
uniform vec3 uLightDirection1;

uniform float uParam[5];

uniform float uBoolFloatTexture;
uniform float uBoolScml;
uniform float scmlBias[9];
uniform float scmlScale[9];
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

  vec3 albedo;
  vec3 albedo2;
  vec3 c;

  if(reflectanceChannels.x < 3.0 && reflectanceChannels.y < 3.0 && reflectanceChannels.z < 3.0){
    albedo = texture2D(uAlbedoSampler, vTextureCoord).rgb;
    if(uBoolScml == 1.0){
      albedo.x = scmlScale[3]*( albedo.x - scmlBias[3]);
      albedo.y = scmlScale[4]*( albedo.y - scmlBias[4]);
      albedo.z = scmlScale[5]*( albedo.z - scmlBias[5]);
    }
  }
  else if(reflectanceChannels.x > 2.0 && reflectanceChannels.y > 2.0 && reflectanceChannels.z > 2.0){
    albedo2 = texture2D(uAlbedo2Sampler, vTextureCoord).rgb;
    if(uBoolScml == 1.0){
      albedo2.x = scmlScale[6]*( albedo2.x - scmlBias[6]);
      albedo2.y = scmlScale[7]*( albedo2.y - scmlBias[7]);
      albedo2.z = scmlScale[8]*( albedo2.z - scmlBias[8]);
    }
  } else {
    albedo = texture2D(uAlbedoSampler, vTextureCoord).rgb;
    albedo2 = texture2D(uAlbedo2Sampler, vTextureCoord).rgb;
    if(uBoolScml == 1.0){
      albedo.x = scmlScale[3]*( albedo.x - scmlBias[3]);
      albedo.y = scmlScale[4]*( albedo.y - scmlBias[4]);
      albedo.z = scmlScale[5]*( albedo.z - scmlBias[5]);
      albedo2.x = scmlScale[6]*( albedo2.x - scmlBias[6]);
      albedo2.y = scmlScale[7]*( albedo2.y - scmlBias[7]);
      albedo2.z = scmlScale[8]*( albedo2.z - scmlBias[8]);
    }
  }
  
  if (reflectanceChannels.x == 0.0 && reflectanceChannels.y == 1.0 && reflectanceChannels.z == 2.0){ //r g b
   c = albedo;
  } else if (reflectanceChannels.x == 0.0 && reflectanceChannels.y == 0.0 && reflectanceChannels.z == 0.0){ //r r r
    c = vec3(albedo.r, albedo.r, albedo.r);
  } else if (reflectanceChannels.x == 1.0 && reflectanceChannels.y == 1.0 && reflectanceChannels.z == 1.0){ //g g g
    c = vec3(albedo.g, albedo.g, albedo.g);
  }  else if (reflectanceChannels.x == 2.0 && reflectanceChannels.y == 2.0 && reflectanceChannels.z == 2.0){ //b b b
    c = vec3(albedo.b, albedo.b, albedo.b);
  }  else if (reflectanceChannels.x == 3.0 && reflectanceChannels.y == 3.0 && reflectanceChannels.z == 3.0){ //ir ir ir
    c = vec3(albedo2.r, albedo2.r, albedo2.r);
  } else if (reflectanceChannels.x == 4.0 && reflectanceChannels.y == 4.0 && reflectanceChannels.z == 4.0){ //uv uv uv
    c = vec3(albedo2.g, albedo2.g, albedo2.g);
  } else if (reflectanceChannels.x == 1.0 && reflectanceChannels.y == 2.0 && reflectanceChannels.z == 4.0){ //g b uv
    c = vec3(albedo.g, albedo.b, albedo2.g);
  } else if (reflectanceChannels.x == 3.0 && reflectanceChannels.y == 1.0 && reflectanceChannels.z == 2.0){ //ir g b
    c = vec3(albedo2.r, albedo.b, albedo.b);
  } else if (reflectanceChannels.x == 3.0 && reflectanceChannels.y == 0.0 && reflectanceChannels.z == 1.0){ //ir r g
    c = vec3(albedo2.r, albedo.r, albedo.g);
  } else if (reflectanceChannels.x == 0.0 && reflectanceChannels.y == 1.0 && reflectanceChannels.z == 4.0){ //r g uv
    c = vec3(albedo.r, albedo.g, albedo2.g);
  } 
  
  if(uBoolFloatTexture!=1.0 && uBoolScml != 1.0){normal = 2.0*(normal - 0.5);}

  normal = (uNMatrix * vec4(normal, 0.0)).xyz;

  
  vec3 lightDirection = normalize(uLightDirection0.xyz);
  vec3 h0 = vec3(0.0, 0.0, 1.0);
  h0 += lightDirection;
  h0 = normalize(h0);
  float nDotH0 = max(0.0,dot(normal,h0));

  nDotH0 = pow(nDotH0, uParam[0]*50.0);
  float spec0 = (c.x + c.y + c.z) * uParam[1] * 2.0/3.0 * nDotH0;

  vec3 lightDirection1 = normalize(uLightDirection1.xyz);

  h0 = vec3(0.0, 0.0, 1.0);
  h0 += lightDirection1;
  h0 = normalize(h0);
  nDotH0 = max(0.0,dot(normal,h0));

  nDotH0 = pow(nDotH0, uParam[0]*50.0);
  float spec1 = (c.x + c.y + c.z) * uParam[1] * 2.0/3.0 * nDotH0;

  float diffuseTerm0 = max(0.0,dot(normal,lightDirection)); 
  vec3 diffspec0 = c*diffuseTerm0;
  float diffuseTerm1 =  max(0.0,dot(normal,lightDirection1)); 
  vec3 diffspec1 = c*diffuseTerm1;

  vec4 total = vec4(uLightIntensity0*(diffspec0 *uParam[2] / 100. + spec0) + uLightIntensity1*(diffspec1 *uParam[2] / 100. + spec1), 1.0);//vec4( (diffspec0 + diffspec1 + rhoSpecular*specularTerm) * uParam[0], 1.0);

    gl_FragColor =  total;
  }
}
