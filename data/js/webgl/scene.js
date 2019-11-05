/*
* This object contains all the objects that need to be rendered.
*/
var Scene = {
	objects: [],
	addObject : function(object) { //adds texture plane or light cone to scene object, creates the necessary buffers

	var vertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.vertices), gl.STATIC_DRAW);
          
	var normalBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Utils.calculateNormals(object.vertices, object.indices)), gl.STATIC_DRAW);
    
	var textureBufferObject = null;
	if(object.textureCoords){
		textureBufferObject = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, textureBufferObject);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.textureCoords), gl.STATIC_DRAW);
		object.tbo = textureBufferObject;

	}
    
	var indexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(object.indices), gl.STATIC_DRAW);

	object.vbo = vertexBufferObject;
	object.ibo = indexBufferObject;
	object.nbo = normalBufferObject;

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	gl.bindBuffer(gl.ARRAY_BUFFER,null);
    
	Scene.objects.push(object);
    },
	init : function(){
	Scene.objects.length = 0; //empty scene needed when a second+ file is opened
	}
}
