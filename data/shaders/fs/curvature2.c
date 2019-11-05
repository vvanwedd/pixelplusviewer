precision highp float;

//geometry
uniform vec4 uMaterialDiffuse;
uniform vec4 uMaterialAmbient;

uniform mat4 uNMatrix;

uniform vec4 uLightAmbient;
uniform vec4 uLightDiffuse0;
uniform vec4 uLightDiffuse1;
uniform vec3 uLightDirection0;
uniform vec3 uLightDirection1;
uniform vec2 uImgDim;

//samplers
uniform sampler2D uAlbedoSampler;
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
	 // Unpack tangent-space normal from texture
	vec3 normal = texture2D(uNormalSampler, vTextureCoord).rgb;
	normal = (uNMatrix * vec4(normal, 0.0)).xyz;
	
	// curvature
  float rawcolor = 1.0;
  vec3 sum = vec3(0.0,0.0,0.0);
  float sign = 0.0; 	
  //for (int i=1; i<=s; i++)


	 int s = int(1.0 + 5.0*uLightDiffuse0.x);
	float tot = float((s+1)*(s+1));
		for(int y=0; y<=11; y+=1){
			
		for(int x=0;x<=11; x+=1){
		  vec3 neighbourN = texture2D(uAlbedoSampler, vTextureCoord.st+vec2(float(x)/float(uImgDim.x),float(y)/float(uImgDim.y))).rgb; //+0.0*vec2(float(x)/float(uImgDim[0]),float(y)/float(uImgDim[1]))
		  sum = sum + neighbourN/(tot);
		  if(x==s){break;}
		}
		if(y==s){break;}
		}
//sum=sum/float((2*s+1));//*vec3(1.0/float((2*s+1)*(2*s+1)),1.0/float((2*s+1)*(2*s+1)),1.0/float((2*s+1)*(2*s+1)));

 
  //rawcolor = 1.0-sqrt( (2.0-curv)*curv );
  gl_FragColor = vec4(dot(normal, uLightDirection0)*sum*uLightDiffuse0.rgb,1.0);
//gl_FragColor = vec4(uLightDiffuse1.rgb,1.0);

}
