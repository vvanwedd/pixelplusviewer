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
uniform float scmlBias[9];
uniform float scmlScale[9];
uniform vec3 reflectanceChannelMix; //r g b ir uv
uniform float uParam[5];


//samplers
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
    vec2 uImgDim = vec2(1000.0, 1000.0);
  // Unpack tangent-space normal from texture
  vec3 normal = texture2D(uNormalSampler, vTextureCoord).rgb;
  vec2 lightIntensity = vec2(uLightIntensity0, uLightIntensity1);
  if(uBoolScml == 1.0){
    normal.x = scmlScale[0]*( normal.x - scmlBias[0]);
    normal.y = scmlScale[1]*( normal.y - scmlBias[1]);
    normal.z = scmlScale[2]*( normal.z - scmlBias[2]);
    lightIntensity *= 0.33;
  }

  const float gamma = 2.0;
  float rawcolor = 1.0;
  vec3 sum = vec3(0.0);
  float sign = 0.0;
  //for (int i=1; i<=s; i++)

	 int s = int(1.0 + 5.0*uParam[0]);
	 int ss = 2*s;
		for (int y=0; y<=22; y+=1){
			for (int x=0; x<=22; x+=1){
		  vec3 neighbourN = texture2D(uNormalSampler, vTextureCoord+vec2(float(x-s)/float(uImgDim.x),float(y-s)/float(uImgDim.y))).rgb;
		  if(uBoolScml == 1.0){
        neighbourN.x = scmlScale[0]*( neighbourN.x - scmlBias[0]);
        neighbourN.y = scmlScale[1]*( neighbourN.y - scmlBias[1]);
        neighbourN.z = scmlScale[2]*( neighbourN.z - scmlBias[2]);
      }
      sum = sum + neighbourN;
		  vec3 dir = vec3(float(x-s), -float(y-s), 0.001);
		  dir = normalize(dir);
		  sign = sign + dot(dir, neighbourN);
		  if(x==ss){break;}
		}
		if(y==ss){break;}
		}


  float invn = 1.0/float((2*s+1)*(2*s+1));
  sum = sum*invn;
  sign = sign*invn;

  float curv = 1.0 - dot(normal, sum); // [0,1]
  rawcolor = 1.0-sqrt( (2.0-curv)*curv );

  gl_FragColor = vec4(dot(normal, uLightDirection0)*pow(rawcolor, gamma)*lightIntensity.x*vec3(1.0,1.0,1.0),1.0);
}
}
