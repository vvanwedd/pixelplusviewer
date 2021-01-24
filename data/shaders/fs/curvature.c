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
uniform vec3 uLightDirection0;
uniform vec3 uLightDirection1;
uniform vec2 uImgDim;

uniform float uBoolFloatTexture;
uniform float uBoolScml;
uniform float scmlPldBias[9];
uniform float scmlPldScale[9];


//samplers
uniform sampler2D uNormalSampler;
uniform sampler2D uDispSampler;

//varying
varying vec4 vColor;
varying vec2 vTextureCoord;
varying vec3 vTangentLightDir;
varying vec3 vTangentEyeDir;


const float gamma = 2.0;

void main(void)
{
	vec3 normal;
	// Unpack tangent-space normal from texture
  normal = texture2D(uNormalSampler, vTextureCoord).rgb;

    vec2 lightIntensity = vec2(uLightIntensity0, uLightIntensity1);
  if(uBoolScml == 1.0){
    normal.x = scmlPldScale[0]*( normal.x - scmlPldBias[0]);
    normal.y = scmlPldScale[1]*( normal.y - scmlPldBias[1]);
    normal.z = scmlPldScale[2]*( normal.z - scmlPldBias[2]);
    lightIntensity *= 0.33;
  }
  
	if(uBoolFloatTexture !=1.0 && uBoolScml != 1.0){normal = 2.0*(normal - 0.5);}
	normal = (uNMatrix * vec4(normal, 0.0)).xyz;

	// curvature
  float rawcolor = 1.0;
  vec3 sum = vec3(0.0);
  float sign = 0.0;
  //for (int i=1; i<=s; i++)


	 int s = int(1.0 + 5.0*uParam0);
	 int ss = 2*s;
		for (int y=0; y<=22; y+=1){
			for (int x=0; x<=22; x+=1){
		  vec3 neighbourN = texture2D(uNormalSampler, vTextureCoord+vec2(float(x-s)/float(uImgDim.x),float(y-s)/float(uImgDim.y))).rgb;
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
	//gl_FragColor = vec4(1.0,1.0,1.0,1.0);
}
