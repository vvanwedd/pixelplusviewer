precision highp float;

//geometry
uniform vec4 uMaterialDiffuse;
uniform vec4 uMaterialAmbient;

uniform mat4 uNMatrix;

uniform vec4 uLightAmbient;
uniform float uLightIntensity0;
uniform float uLightIntensity1;
uniform float uParam0;
uniform float uParam1;
uniform float uParam2;
uniform vec3 uLightDirection0;
uniform vec3 uLightDirection1;

//samplers
uniform sampler2D uAlbedoSampler;
uniform sampler2D uNormalSampler;
uniform sampler2D uDispSampler;

uniform sampler2D ptmCoeff0Tex;
uniform sampler2D ptmCoeff1Tex;
uniform sampler2D ptmRgbCoeffTex;

uniform float uBoolFloatTexture;
uniform vec3 uScalePTM0;
uniform vec3 uBiasPTM0;
uniform vec3 uScalePTM1;
uniform vec3 uBiasPTM1;

//varying
varying vec4 vColor;
varying vec2 vTextureCoord;
varying vec3 vTangentLightDir;
varying vec3 vTangentEyeDir;

void main(void)
{
  vec3 ptmCoeff0 = vec3( texture2D(ptmCoeff0Tex, vTextureCoord) ).rgb;
  vec3 ptmCoeff1 = vec3( texture2D(ptmCoeff1Tex, vTextureCoord) ).rgb;
  if(uBoolFloatTexture!=1.0){
    ptmCoeff0 *= 255.0;
    ptmCoeff1 *= 255.0;
    ptmCoeff0 = ptmCoeff0.bgr;
    ptmCoeff1 = ptmCoeff1.bgr;
    ptmCoeff0.x = uScalePTM0.x*(ptmCoeff0.x - uBiasPTM0.x);
    ptmCoeff0.y = uScalePTM0.y*(ptmCoeff0.y - uBiasPTM0.y);
    ptmCoeff0.z = uScalePTM0.z*(ptmCoeff0.z - uBiasPTM0.z);
    ptmCoeff1.x = uScalePTM1.x*(ptmCoeff1.x - uBiasPTM1.x);
    ptmCoeff1.y = uScalePTM1.y*(ptmCoeff1.y - uBiasPTM1.y);
    ptmCoeff1.z = uScalePTM1.z*(ptmCoeff1.z - uBiasPTM1.z);
  }

  vec3 ptmCoeffRgb = vec3( texture2D(ptmRgbCoeffTex, vTextureCoord) ).rgb;

  vec3 lightDirection = normalize(uLightDirection0.xyz);
  vec3 lm0 = vec3(lightDirection.x*lightDirection.x, lightDirection.y*lightDirection.y, lightDirection.x*lightDirection.y);
  vec3 lm1 = vec3(lightDirection.x, lightDirection.y, 1.0);
  vec3 tmp0 = ptmCoeff0*lm0;
  vec3 tmp1 = ptmCoeff1*lm1;
  float lum = (tmp0.x + tmp0.y + tmp0.z + tmp1.x + tmp1.y + tmp1.z)*uLightIntensity0/255.0/255.0/2.3;///255.0/5.0;
  if(uBoolFloatTexture!=1.0){ lum *= 255.0;}

  vec3 lightDirection1 = normalize(uLightDirection1.xyz);
  vec3 lm10 = vec3(lightDirection1.x*lightDirection1.x, lightDirection1.y*lightDirection1.y, lightDirection1.x*lightDirection1.y);
  vec3 lm11 = vec3(lightDirection1.x, lightDirection1.y, 1.0);
  vec3 tmp10 = ptmCoeff0*lm10;
  vec3 tmp11 = ptmCoeff1*lm11;
  float lum1 = (tmp10.x + tmp10.y + tmp10.z + tmp11.x + tmp11.y + tmp11.z)*uLightIntensity1/255.0/255.0/2.3;
  if(uBoolFloatTexture!=1.0){ lum1 *= 255.0;}

  lum += lum1;

  // Unpack tangent-space normal from texture
  vec3 normal = texture2D(uNormalSampler, vTextureCoord).rgb;
  if(uBoolFloatTexture!=1.0){normal = 2.0*(normal - 0.5);}
  //normal.x = -normal.x;
  normal = (uNMatrix * vec4(normal, 0.0)).xyz;

  vec3 h0 = vec3(0.0, 0.0, 1.0);
  h0 += lightDirection;
  h0 = normalize(h0);
  float nDotH0 = max(0.0,dot(normal,h0));
  nDotH0 = pow(nDotH0, uParam0*10.0);
  float spec0 = uParam1 * 1.0 * nDotH0;

  vec3 h1 = vec3(0.0, 0.0, 1.0);
  h1 += lightDirection1;
  h1 = normalize(h1);
  float nDotH1 = max(0.0,dot(normal,h1));
  nDotH1 = pow(nDotH1, uParam0*10.0);
  float spec1 = uParam1 * 1.0 * nDotH1;


  if(uMaterialAmbient.x == 66666666.0){
    gl_FragColor = vec4((ptmCoeffRgb * uParam2/100.0 + spec0 + spec1)*lum, 1.0);
  }
  else{
    gl_FragColor = uMaterialAmbient;
  }
}
