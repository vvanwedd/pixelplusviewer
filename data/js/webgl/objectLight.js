function ObjectLight(name){
	this.id = name;
	this.type = "lightCone";
	this.lightDirection0 = [0.0,0.0,1.0];
	this.lightDirection1 = [0.0,0.0,1.0];
	this.lightIntensity0 = 1.0;
	this.lightIntensity1 = 0.0;
	this.param = [0.1, 0.0, 0.0, 0.0, 0.0];
	this.vertices = [0.05,0.05,-0.2,   0.05,-0.05,-0.2,  -0.05,-0.05,-0.2,  -0.05,0.05,-0.2,  0.0,0.0,0.0];
	this.indices = [0,1,2, 0,2,3, 0,1,4, 1,2,4, 2,3,4, 0,3,4];
	this.wireframe = false;
	this.textureCoords = [0,0,0,0,0,0,0,0,0,0];
}
//normals and tangents are calculated by utils.js when needed (in scene.js)
