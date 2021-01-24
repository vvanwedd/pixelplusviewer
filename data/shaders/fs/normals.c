precision highp float;

uniform mat4 uNMatrix;

uniform float uBoolFloatTexture;
uniform float uBoolScml;
uniform float scmlBias[3];
uniform float scmlScale[3];

uniform sampler2D uNormalSampler;

varying vec4 vColor;
varying vec2 vTextureCoord;
varying vec3 vTangentLightDir;
varying vec3 vTangentEyeDir;

void main(void)
{
	vec3 normal = 0.5*texture2D(uNormalSampler, vTextureCoord).rgb + 0.5; 
	if(uBoolScml == 1.0){
    	normal.x = scmlScale[0]*( normal.x - scmlBias[0]);
    	normal.y = scmlScale[1]*( normal.y - scmlBias[1]);
    	normal.z = scmlScale[2]*( normal.z - scmlBias[2]);
	}
	if(uBoolFloatTexture!=1.0 && uBoolScml != 1.0 )
	{normal = 2.0*(normal - 0.5);}
	gl_FragColor =  vec4(normal,1.0);
}
