//#version 300 es
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


uniform vec3 uSplit;
//samplers
uniform sampler2D uAlbedoSampler;
uniform sampler2D uNormalSampler;
uniform sampler2D uDispSampler;

//varying
varying vec4 vColor;
varying vec2 vTextureCoord;
varying vec3 vTangentLightDir;
varying vec3 vTangentEyeDir;

uniform float param3;
uniform float param4;
//const int s = 2; // PROBLEM: sum/float(...) return 0 if s>1!
 //lightIntensity2.r);

// approximated discrete gaussian kernels
// note: these values are generated in constructor of RelighterCanvas, uncomment source if necessary


void main(void) {
  // init
  vec3 sum = vec3(0.0);
  float g = 1.0;
  float sumg = 0.0;
int s = int(1.0 + 10.0*uParam1);
  //int i = s;
  for (int i=0; i<21; i++){ //21: MAXVALUE of int s = int(1.0 + 10.0*uLightDiffuse1.r);
	  for (int y=-1; y<=1; y+=1){
		  for(int x=-1; x<=1; x+=1){
		    vec3 neighbourN = vec3(texture2D(uAlbedoSampler, vTextureCoord+vec2(float(x*i)/float(uImgDim[0]),float(y*i)/float(uImgDim[1]))) ).rgb;

		    g = float(s-i);

		    sum = sum + neighbourN * g;
		    sumg = sumg + g;
		    if(x==i){break;}
		  }
	  if(y==i){break;}
	  }
	  if(i==s){break;}
  }
  sumg = sumg + 0.0001;

  vec3 normal = vec3( texture2D(uNormalSampler, vTextureCoord) ).rgb;
  if(uBoolFloatTexture!=1.0){normal = 2.0*(normal - 0.5);}
  vec3 albedo = vec3( texture2D(uAlbedoSampler, vTextureCoord) ).rgb;
  albedo = albedo + (2.0*uParam0-1.0)*(albedo-sum/sumg);

  vec3 light0 = normalize(uLightDirection0.xyz);
  vec3 light1 = normalize(uLightDirection1.xyz);

  float diffuseTerm0 = max(0.0, dot(normal, light0) );
  vec3 diffspec0 = albedo*diffuseTerm0;
  float diffuseTerm1 = max(0.0, dot(normal, light1) );
  vec3 diffspec1 = albedo*diffuseTerm1;

  vec4 total = vec4(uLightIntensity0*diffspec0 + uLightIntensity1*diffspec1,1.0);
  if(uMaterialAmbient.x != 66666666.0){
		gl_FragColor = uMaterialAmbient;
	}
	else{
	 gl_FragColor =  total;
  }
}
