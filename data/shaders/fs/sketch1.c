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
uniform float uMoving;
uniform float uTextureLevel;
uniform vec3 uLightDirection0;
uniform vec3 uLightDirection1;
uniform vec2 uImgDim;

uniform float uBoolFloatTexture;


uniform vec3 uSplit;
//samplers
uniform sampler2D uSampler;
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
	if(uBoolFloatTexture!=1.0){normal = 2.0*(normal - 0.5);}
  normal = (uNMatrix * vec4(normal, 0.0)).xyz;
	int s = int(1.0 + 5.0*uParam1); // PROBLEM: sum/float(...) return 0 if s>1!
	const float gamma = 3.0; //obsolete..*param3;

   //non constant expression in loop index: solved by for(int x=0;x<max_iterations;x++)
																			//if(x==variable){break}
																	      //else..
  // avgn
  float rawcolor = 1.0;
  vec3 sum = vec3(0.0);
  for(int i=1; i<=11; i++){ //11: MAXVALUE of int(1.0 + 5.0*uParam1);
	for (int y=-1; y<=1; y+=1){
		for (int x=-1; x<=1; x+=1){
			vec3 neighbourN = vec3( texture2D(uNormalSampler, vTextureCoord+vec2(float(x*i)/uImgDim[0],float(y*i)/uImgDim[1]))).rgb;
			sum = sum + neighbourN;
		}
	}
	if(i==s){break;}
  }

  float invn = 1.0/float((2*s+1)*(2*s+1));
  sum = normalize(sum);

  // roughness
  float sigma2 = 0.0;
  float sigma2avg = 0.0;
  float signavg = 0.0;
  for (int i=1; i<=11; i++){
	for (int y=-1; y<=1; y+=1){
		for (int x=-1; x<=1; x+=1){

      vec3 neighbourN = vec3( texture2D(uNormalSampler, vTextureCoord+vec2(float(x*i)/uImgDim[0],float(y*i)/uImgDim[1]))).rgb;
      vec3 diff = sum - neighbourN;

	  // the "sign" check if the neighbouring normal is pointing towards or away from the center.
      float sign = dot(sum-neighbourN, vec3(-float(x*i), float(y*i), 0.0));


      sigma2 = sigma2 + sign*dot(sum-neighbourN,sum-neighbourN);
      //--signavg = signavg+sign;
      //--sigma2avg = sigma2avg + dot(diff,diff);
		}
	}
	if(i==s){break;}
  }
  sigma2 = sigma2*invn;
  //--sigma2avg = sigma2avg*invn*signavg;

  //float d = (param3-1.0)/10.0;

  // a wedge is defined as an area where the neighbouring normals are pointing towards the center.
  // these have a negative sign in the computation in the above loop
  //
  float wedge = smoothstep(0.0, -0.01, sigma2);
  //float smooth = smoothstep( -0.01, 0.001, sigma2);

  //int lz = 1; // lz is to stretch intensity range..
  //--float wedge1 = step(0.5, wedge);
  float wedge2 = 1.0-pow(wedge, uParam0); // lightIntensity [0,2]

  // allow boundary line between shaded mode and sketch mod
  //...float(y)/float(imageDimension.y))
  if ((vTextureCoord.t - (1.0 - (uSplit.y+1.0)/2.0 ) )>0.0) { // split.y ranges from -1 to 1, convert to proper 0-1 range for uv coordinates
    rawcolor = dot(normal, vec3(0.0,0.0,1.0));

    //  } else if ((gl_TexCoord[0].t-(1.0-split.y)+.5)*(gl_TexCoord[0].s-split.x-.5)<0) {
    //    rawcolor = wedge1;

  } else {
    rawcolor = wedge2;
  }

  gl_FragColor = vec4(vec3(pow(rawcolor, gamma)), 1.0);

}
