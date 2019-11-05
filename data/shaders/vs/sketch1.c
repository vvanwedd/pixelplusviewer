//geometry
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec3 aVertexTangent;
attribute vec4 aVertexColor;
attribute vec2 aVertexTextureCoords;

//matrices
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

//lights
uniform vec3 uLightDirection0;
uniform vec3 uLightDirection1;
uniform vec4 uMaterialAmbient;

uniform float uBoolDepthMap;

//varyings
varying vec2 vTextureCoord;
varying vec4 vColor;
varying vec3 vLightDirection0;
varying vec3 vLightDirection1;
//samplers
uniform sampler2D uDispSampler;


void main(void) {
    //Transformed vertex position
	vLightDirection0 = uLightDirection0;
	vLightDirection1 = uLightDirection1;
	if(uBoolDepthMap){
		vec3 disp = texture2D(uDispSampler, aVertexTextureCoords).xyz;
		gl_Position = uPMatrix * uMVMatrix *(vec4(aVertexPosition, 1.0) + 20.0*vec4(0.0,0.0,(disp.x-0.5),0.0));	//hardcoded depthmultiplier should be changed.
	}
	else{
		gl_Position = uPMatrix * uMVMatrix *(vec4(aVertexPosition, 1.0);
	}
    vTextureCoord = aVertexTextureCoords;
}
