precision highp float;

uniform mat4 uNMatrix;

uniform float uBoolFloatTexture;

uniform sampler2D uNormalSampler;

varying vec4 vColor;
varying vec2 vTextureCoord;
varying vec3 vTangentLightDir;
varying vec3 vTangentEyeDir;

void main(void)
{
	vec3 normal = 0.5*texture2D(uNormalSampler, vTextureCoord).rgb+0.5;
	if(uBoolFloatTexture!=1.0){normal = 2.0*(normal - 0.5);}
	gl_FragColor =  vec4(normal,1.0);
}
