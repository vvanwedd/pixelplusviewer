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
uniform float uMoving;
uniform vec3 uSplit;


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
  vec3 reflectanceChannels = reflectanceChannelMix;
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

  if(uBoolFloatTexture!=1.0 && uBoolScml != 1.0){normal = 2.0*(normal - 0.5);}

  normal = (uNMatrix * vec4(normal, 0.0)).xyz;

  int s = int(1.0 + 5.0*uParam[1]); // PROBLEM: sum/float(...) return 0 if s>1!
	const float gamma = 3.0; //obsolete..*param3;

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

if(uBoolScml == 1.0){
    sum.x = scmlScale[0]*( sum.x - scmlBias[0]);
    sum.y = scmlScale[1]*( sum.y - scmlBias[1]);
    sum.z = scmlScale[2]*( sum.z - scmlBias[2]);
  }


  float invn = 1.0/float((2*s+1)*(2*s+1));
  sum = normalize(sum);

  // roughness
  float sigma2 = 0.0;
  float sigma2avg = 0.0;
  float signavg = 0.0;
  for (int i=1; i<=11; i++){
	for (int y=-1; y<=1; y+=1){
    int endx;
		if(y < 0) endx = i;
		else endx = 0;
		for (int x=-1; x<=1; x+=1){

      vec3 neighbourN = vec3( texture2D(uNormalSampler, vTextureCoord+vec2(float(x*i)/uImgDim[0],float(y*i)/uImgDim[1]))).rgb;
      if(uBoolScml == 1.0){
        neighbourN.x = scmlScale[0]*( neighbourN.x - scmlBias[0]);
        neighbourN.y = scmlScale[1]*( neighbourN.y - scmlBias[1]);
        neighbourN.z = scmlScale[2]*( neighbourN.z - scmlBias[2]);
      }
      vec3 diff1 = sum - neighbourN;

      vec3 neighbourN2 = vec3( texture2D(uNormalSampler, vTextureCoord+vec2(-float(x*i)/float(uImgDim.x),-float(y*i)/float(uImgDim.y))) ).rgb;
		  if(uBoolScml == 1.0){
        neighbourN2.x = scmlScale[0]*( neighbourN2.x - scmlBias[0]);
        neighbourN2.y = scmlScale[1]*( neighbourN2.y - scmlBias[1]);
        neighbourN2.z = scmlScale[2]*( neighbourN2.z - scmlBias[2]);
      }
      vec3 diff2 = sum - neighbourN2;

		  float sign1 = -dot(diff1, vec3(-float(x*i), float(y*i), 0.0));
		  float sign2 = -dot(diff2, vec3(float(x*i), -float(y*i), 0.0));
		  sigma2 = sigma2 + sign1*dot(diff1,diff1) + sign2*dot(diff2,diff2);
      //--signavg = signavg+sign;
      //--sigma2avg = sigma2avg + dot(diff,diff);
      if(x==int(float(endx)/float(i))){break;}

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
  float wedge2 = 1.0-pow(wedge, uParam[0]); // lightIntensity [0,2]

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
}