precision highp float;

//geometry

uniform mat4 uNMatrix;
uniform float uFloatTex;

//samplers
uniform sampler2D uNormalSampler;

//varying
varying vec4 vColor;
varying vec2 vTextureCoord;
varying vec3 vTangentLightDir;
varying vec3 vTangentEyeDir;

void main(void)
{   
	vec3 normal;
	if(uFloatTex==1.0){
    	normal = 0.5*texture2D(uNormalSampler, vTextureCoord).rgb+0.5;
	}else{
		normal = texture2D(uNormalSampler, vTextureCoord).rgb;
	}
		
	gl_FragColor =  vec4(normal,1.0);
}
