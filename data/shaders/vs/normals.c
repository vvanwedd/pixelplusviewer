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

//varyings
varying vec2 vTextureCoord;
varying vec4 vColor;
varying vec3 vLightDirection0;
varying vec3 vLightDirection1;
//samplers
uniform sampler2D uDispSampler;


void main(void) {

    //Final vertex position
    gl_Position = uPMatrix * uMVMatrix *(vec4(aVertexPosition, 1.0));
    vTextureCoord = aVertexTextureCoords;
}
