/*
* please see the technical paper for additional info
*/

///globals
var useVertexColors = false;
var texture = null;
var gl = null;     		// WebGL context
var program1 = null; 	//WebGL program
var program2 = null; 
var program3 = null; 
var program4 = null; 
var program5 = null; 
var program6 = null; 
var program7 = null; 
var program8 = null; 
var program9 = null; 
var program10 = null;
var program11 = null;
var prg1 = null;
var prg2 = null;
var prg3 = null;
var prg4 = null;
var prg5 = null;
var prg6 = null;
var prg7 = null;
var prg8 = null;
var prg9 = null;
var prg10 = null;
var prg11 = null;
var mainPrg = null;	
var mainProgram = null;

var canvasWidth = 0;  	
var canvasHeight = 0;
var canvasWidth2 = 0;
var canvasHeight2 = 0;

var mvMatrix    = mat4.create();    // Model-View matrix
var mvMatrixCopy= mat4.create();    // copy of mvMatrix to transform individual objects in render(0)

var pMatrix     = mat4.create();    // Projection matrix
var nMatrix     = mat4.create();    // Normal matrix
var nMatrixCopy = mat4.create();

var HOME     = [0,0,-200];
var position = [0,0,-200];
var rotation = [0,0,0];
var lrotation = [0,0,0];

var lightDirection0 = [-0.5,0.5,0.7];
var lightDirection1 = [0.5,0.5,0.7];

var lightIntensity0 = 1;
var lightIntensity1 = 0;
var param0 = 0;
var param1=0;
var useAmbient = false;

var updateLightPosition = false;

var split = [0,-1,0];

var mainPlane;

var sidePlane = new Array(6);

var mainSide = 0;
var scaleFactor = new Array(6);

var light0;
var light1;

var framebuffer;

var albedoTex = new Array(6);
var normalTex = new Array(6);
var ambientTex = new Array(6);
var disTex = new Array(6);

var hshTex = new Array(4);

var kerneltest = new Array(1.0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 0.25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.375, 0.25, 0.062, 0, 0, 0, 0, 0, 0, 0, 0, 0.312, 0.234, 0.093, 0.015, 0, 0, 0, 0, 0, 0, 0, 0.274, 0.219, 0.109, 0.03, 0.003, 0, 0, 0, 0, 0, 0, 0.247, 0.206, 0.117, 0.043, 0.009, 0, 0, 0, 0, 0, 0, 0.227, 0.194, 0.121, 0.053, 0.015, 0.002, 0, 0, 0, 0, 0, 0.211, 0.184, 0.122, 0.06, 0.021, 0.004, 0, 0, 0, 0, 0, 0.198, 0.176, 0.122, 0.066, 0.026, 0.007, 0.001, 0, 0, 0, 0, 0.188, 0.169, 0.122, 0.07, 0.031, 0.01, 0.002, 0, 0, 0, 0, 0.179, 0.162, 0.121, 0.073, 0.035, 0.013, 0.003, 0, 0, 0, 0, 0.171, 0.157, 0.12, 0.076, 0.039, 0.016, 0.004, 0, 0, 0, 0);

var nuoud;
var timeoutid;

var vs;
var floatingPointTextureSupport = 1;

var offscreenRenderHeight;
var offscreenRenderWidth;

/*
* Invoked by runWebGL()
*/
function initWebGL(){
	useVertexColors = false;
	texture = null;
	gl = null;     		// WebGL context
	program1 = null; 		//WebGL program
	program2 = null; 
	program3 = null; 
	program4 = null; 
	program5 = null; 
	program6 = null; 
	program7 = null; 
	program8 = null; 
	program9 = null; 
	program10 = null;
	program11 = null;
	prg1 = null;
	prg2 = null;
	prg3 = null;
	prg4 = null;
	prg5 = null;
	prg6 = null;
	prg7 = null;
	prg8 = null;
	prg9 = null;
	prg10 = null;
	prg11 = null;
	mainPrg = null;
	mainProgram = null;

	canvasWidth = 0;  	
	canvasHeight = 0;

	mvMatrix    = mat4.create();    // Model-View matrix
	mvMatrixCopy= mat4.create();    // copy of mvMatrix to transform individual objects in render(0)

	pMatrix     = mat4.create();    // Projection matrix
	nMatrix     = mat4.create();    // Normal matrix
	nMatrixCopy = mat4.create();

	HOME     = [0,0,-200];
	position = [0,0,-200];
	rotation = [0,0,0];
	lrotation = [0,0,0];

	lightDirection0 = [-0.5,0.5,0.7];
	lightDirection1 = [0.5,0.5,0.7];

	lightIntensity0 = 1;
	lightIntensity1 = 0;
	param0 = 0.1;
	param1=0;
	useAmbient = false;

	updateLightPosition = false;

	split = [0,-1,0];

	mainPlane;
	mainSide = 0;
	scaleFactor = new Array(6);

	light0;
	light1;

	framebuffer;

	kerneltest = new Array(1.0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 0.25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.375, 0.25, 0.062, 0, 0, 0, 0, 0, 0, 0, 0, 0.312, 0.234, 0.093, 0.015, 0, 0, 0, 0, 0, 0, 0, 0.274, 0.219, 0.109, 0.03, 0.003, 0, 0, 0, 0, 0, 0, 0.247, 0.206, 0.117, 0.043, 0.009, 0, 0, 0, 0, 0, 0, 0.227, 0.194, 0.121, 0.053, 0.015, 0.002, 0, 0, 0, 0, 0, 0.211, 0.184, 0.122, 0.06, 0.021, 0.004, 0, 0, 0, 0, 0, 0.198, 0.176, 0.122, 0.066, 0.026, 0.007, 0.001, 0, 0, 0, 0, 0.188, 0.169, 0.122, 0.07, 0.031, 0.01, 0.002, 0, 0, 0, 0, 0.179, 0.162, 0.121, 0.073, 0.035, 0.013, 0.003, 0, 0, 0, 0, 0.171, 0.157, 0.12, 0.076, 0.039, 0.016, 0.004, 0, 0, 0, 0);

	nuoud;
	timeoutid;
	floatingPointTextureSupport = 1;
}
/*
* Main starting anchor for the WebGL part, invoked after first textureplane is parsed
*/
function runWebGL() {
	var dd2 = new Date().getTime();
	console.log("total parsing time: " +(dd2-dd1));
	$("#loader").css("display","none");
	$("#content").css("display","block");
	$("#mainButtonsWrapper").css("border-left","1px solid #aaa");
	$("#radioset").css("display","block");
	$('#rightAside').accordion({active:1});
	Utils.deleteContext();
	gl = null;
	updateCanvasSize();
	initInteraction();
	initWebGL();
	
	gl = Utils.getGLContext("canvasMain");

	configure();

	load();
	$(document).ready(function(){updateProgram(11);});
	
}


/*
* Basic gl configuration, tests whether floating textures are supported and creates the different shader programs
*/
function configure(){
	gl.clearColor(0.0,0.0,0.0, 0.0);
	gl.clearDepth(1);
	gl.enable(gl.DEPTH_TEST);
	//see http://www.khronos.org/registry/webgl/extensions/OES_texture_float/
   try { ext = gl.getExtension("OES_texture_float");
   } catch(e) {}
   if(!ext){floatingPointTextureSupport=0;
	console.log("no floating textures supported");
	}
	try { ext = gl.getExtension("OES_texture_float_linear");
   } catch(e) {}
   if(!ext){floatingPointTextureSupport=0;
	console.log("no linear interpolation on floating textures supported");
	}
	console.log("we're here");
	gl.depthFunc(gl.LEQUAL);
	//gl.enable(gl.BLEND);
	//gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
	initTransforms();
	vs = loadShaders(gl,"vs/mainVertexShader"); //since every program uses the same vertex shader, we only need to load it once
	prg1 = gl.createProgram();
	program1 = new Programm("vs/color","fs/color",prg1);
	mainPrg = prg1;
	mainProgram = program1;
	prg2 = gl.createProgram();
	program2 = new Programm("vs/color_specular","fs/color_specular",prg2); //specular
	prg3 = gl.createProgram();
	program3 = new Programm("vs/shaded","fs/shaded",prg3);
	prg4 = gl.createProgram();
	program4 = new Programm("vs/shaded_exag","fs/shaded_exag",prg4);
	prg5 = gl.createProgram();
	program5 = new Programm("vs/sketch1","fs/sketch1",prg5);
	prg6 = gl.createProgram();
	program6 = new Programm("vs/sketch2","fs/sketch2",prg6);
	/*prg7 = gl.createProgram();
	program7 = new Programm("vs/xray","fs/xray",prg7);*/
	prg8 = gl.createProgram();
	program8 = new Programm("vs/sharpen","fs/sharpen",prg8);
	prg9 = gl.createProgram();
	program9 = new Programm("vs/curvature","fs/curvature",prg9);
	prg10 = gl.createProgram();
	program10 = new Programm("vs/normals","fs/normals",prg10);
	prg11 = gl.createProgram();
	program11 = new Programm("vs/hsh","fs/hsh",prg11);
	
	//document.onmouseup = handleMouseUp; //see interaction.js
	document.onmousemove = handleMouseMove;
}

/*
* (re)sets the Model View Matrix to the starting position
*/
function initTransforms(){
	mat4.identity(mvMatrix);
	mat4.translate(mvMatrix, HOME);

	mat4.identity(pMatrix);
	  
	mat4.identity(nMatrix);
	mat4.set(mvMatrix, nMatrix);
	mat4.inverse(nMatrix);
	mat4.transpose(nMatrix);
}

/*
* Initializes the scene object, adds the light cones and the first texture plane to the scene 
*/
function load(){ 
	Scene.init();
	buildSidePlane(0);
	light0 = new ObjectLight("objectLight0");
	Scene.addObject(light0);
	light1 = new ObjectLight("objectLight1");
	Scene.addObject(light1);
}

/*
* helper function that is invoked each time the canvas size changes. Note the difference between width and css width (resolution vs occupied pixels)
*/
function updateCanvasSize(){
	canvasWidth = $('#content').width()*2;
	canvasHeight = $('#content').height()*2;
	$('#canvasMain').attr('width',canvasWidth	);
	$('#canvasMain').attr('height',canvasHeight);
	canvasWidth2 = $('#content').width();
	canvasHeight2 = $('#content').height();
	$('#canvasMain').width(canvasWidth2);
	$('#canvasMain').height(canvasHeight2);
	$('#canvasOverlay').width(canvasWidth2);
	$('#canvasOverlay').height(canvasHeight2);
	$('#canvasOverlay').attr('width',canvasWidth2);
	$('#canvasOverlay').attr('height',canvasHeight2);
	canvas = document.getElementById("canvasMain");
	rect = canvas.getBoundingClientRect();
	if(gl){render(0);}
	console.log(canvasWidth2);
}

/*
* builds the texture plane, input: sideNr: front: 0, back: 1, bottom: 2, top: 3, left: 4, right: 5
*/
function buildSidePlane(sideNr){
	
	var normalData;
	//floatingPointTextureSupport =0;
	if(!floatingPointTextureSupport){ //takes some time, luckily only for small percentage of visits
		var normalFloat32View = new Float32Array(textureData[sideNr].normals);
		var normalBuffer = new ArrayBuffer(textureData[sideNr].width*textureData[sideNr].height*4);
		normalData = new Uint8Array(normalBuffer);
		for(var i=0, j=0;i<textureData[sideNr].width*textureData[sideNr].height*4;i+=4,j+=3){
			normalData[i+0]=normalFloat32View[j+0]*128+127;	//0 255 -> x -1 1
			normalData[i+1]=normalFloat32View[j+1]*128+127;
			normalData[i+2]=normalFloat32View[j+2]*128+127;
			normalData[i+3]=255;
		}
	} else{
		normalData = new Float32Array(textureData[sideNr].normals);
	}
	var albedoData = new Uint8Array(textureData[sideNr].albedo);


	var xOff,yOff=0;
	//some files have mmPixelPixel filled in, others don't. Shouldn't be a visible difference..
	if(textureData[0].mmPerPixel!=0){
		scaleFactor[0] = 1;
		if(textureData[1]!== undefined){scaleFactor[1] = textureData[1].mmPerPixel/textureData[0].mmPerPixel*textureData[1].width/textureData[0].width;}
		if(textureData[2]!== undefined){scaleFactor[2] = textureData[2].mmPerPixel/textureData[0].mmPerPixel*textureData[2].width/textureData[0].width;}
		if(textureData[3]!== undefined){scaleFactor[3] = textureData[3].mmPerPixel/textureData[0].mmPerPixel*textureData[3].width/textureData[0].width;}
		if(textureData[4]!== undefined){scaleFactor[4] = textureData[4].mmPerPixel/textureData[0].mmPerPixel*textureData[4].width/textureData[0].width;}
		if(textureData[5]!== undefined){scaleFactor[5] = textureData[5].mmPerPixel/textureData[0].mmPerPixel*textureData[5].width/textureData[0].width;}
	}
	else{
		scaleFactor[0] = 1;
		if(textureData[1]!== undefined){scaleFactor[1] = textureData[1].width/textureData[0].width;}
		if(textureData[2]!== undefined){scaleFactor[2] = textureData[2].width/textureData[0].width;}
		if(textureData[3]!== undefined){scaleFactor[3] = textureData[3].width/textureData[0].width;}
		if(textureData[4]!== undefined){scaleFactor[4] = textureData[4].width/textureData[0].width;}
		if(textureData[5]!== undefined){scaleFactor[5] = textureData[5].width/textureData[0].width;}
	}
	console.log('scalefactor: ');
	console.log(scaleFactor);
	if(sideNr==0){
		//calculating what the total width and height of the scene are to calculate the home position and to calculate the resolution of the 1:1 offscreen render plane
		var widthBack;
		if(textureData[1]!== undefined){ widthBack = 50*scaleFactor[1]} else {widthBack=0;}
		var widthLeft;
		if(textureData[4]!== undefined){ widthLeft = 50*scaleFactor[4]} else {widthLeft=0;}
		var widthRight;
		if(textureData[5]!== undefined){ widthRight = 50*scaleFactor[5]} else {widthRight=0;}
		var heightBottom;
		if(textureData[2]!== undefined){ heightBottom = 50*textureData[2].height/textureData[2].width*scaleFactor[2]} else {heightBottom=0;}
		var heightTop;
		if(textureData[3]!== undefined){ heightTop = 50*textureData[3].height/textureData[3].width*scaleFactor[3]} else {heightTop=0;}
		var heightFront = 50*textureData[0].height/textureData[0].width;
		if((heightFront+heightBottom+heightTop)>canvasHeight/canvasWidth*(widthBack+50+widthRight+widthLeft)){
			HOME= [-widthBack,0,-1/Math.tan(15/180*Math.PI)*(50*textureData[0].height/textureData[0].width+heightBottom+heightTop)];
		}
		else{
			HOME= [-widthBack,0,-1/Math.tan(15/180*Math.PI)*(1/canvasWidth*canvasHeight*(widthBack+50+widthRight+widthLeft))];	
		}
		position = HOME.slice(0);
		console.log(position);
		offscreenRenderHeight = Math.round(((textureData[0]!== undefined)?textureData[0].height:0)+0*((textureData[1]!== undefined)?textureData[1].height:0)+((textureData[2]!== undefined)?textureData[2].height*scaleFactor[2]:0)+((textureData[3]!== undefined)?textureData[3].height*scaleFactor[3]:0));
		offscreenRenderWidth = Math.round(((textureData[4]!== undefined)?textureData[4].height*scaleFactor[4]:0)+((textureData[0]!== undefined)?textureData[0].width:0)+((textureData[5]!== undefined)?textureData[5].height*scaleFactor[5]:0)+((textureData[1]!== undefined)?textureData[1].width*scaleFactor[1]:0));
		offscreenRenderWidth = textureData[0].width*(1+((textureData[4]!== undefined)?1*scaleFactor[4]/*textureData[4].width/textureData[4].height*/:0)+((textureData[5]!== undefined)?1*scaleFactor[5]/*textureData[4].width/textureData[4].height*/:0)+((textureData[1]!== undefined)?1*scaleFactor[1]/*textureData[4].width/textureData[4].height*/:0));
	}

	sidePlane[sideNr] = null;
	sidePlane[sideNr] = new ObjectPlane(sideNr,200,200,scaleFactor[sideNr],textureData[sideNr].height/textureData[sideNr].width,xOff,yOff,textureData[sideNr].height,textureData[sideNr].width);
	Scene.addObject(sidePlane[sideNr]);
   	console.log("added side "+sideNr);
	changeSide(10);
	
	albedoTex[sideNr] = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, albedoTex[sideNr]);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, textureData[sideNr].width,textureData[sideNr].height,0, gl.RGBA, gl.UNSIGNED_BYTE, albedoData);	
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);	//to overcome not a power of 2 problem.
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //to overcome not a power of 2 problem.
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.bindTexture(gl.TEXTURE_2D, null);


	//create normal texture
	
	normalTex[sideNr] = gl.createTexture();

	gl.bindTexture(gl.TEXTURE_2D, normalTex[sideNr]);
	if(!floatingPointTextureSupport){
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, textureData[sideNr].width,textureData[sideNr].height,0, gl.RGBA, gl.UNSIGNED_BYTE, normalData);			
	}
	else{
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, textureData[sideNr].width,textureData[sideNr].height,0, gl.RGB, gl.FLOAT, normalData);	
	}	
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.bindTexture(gl.TEXTURE_2D, null);

	if(textureData[sideNr].disp){
	//create displacement texture
	disTex[sideNr] = gl.createTexture();
	var dispData = new Uint8Array(textureData[sideNr].disp);
	gl.bindTexture(gl.TEXTURE_2D, disTex[sideNr]);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, textureData[sideNr].width,textureData[sideNr].height,0, gl.RGBA, gl.UNSIGNED_BYTE, dispData);
	//gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, textureIMG);
	//gl.generateMipmap(gl.TEXTURE_2D);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.bindTexture(gl.TEXTURE_2D, null);
	}
	if(boolDepthMap){
		disTex[sideNr] = gl.createTexture();

	gl.bindTexture(gl.TEXTURE_2D, disTex[sideNr]);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, dieptemap[sideNr]);
	//gl.generateMipmap(gl.TEXTURE_2D);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.bindTexture(gl.TEXTURE_2D, null);
	}
	
	if(textureData[sideNr].ambient){
	$("#color1").button("widget").css({"display": "block"});
	//create specular texture
	ambientTex[sideNr] = gl.createTexture();
	var ambientData = new Uint8Array(textureData[0].ambient);
	gl.bindTexture(gl.TEXTURE_2D, ambientTex[sideNr]);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, textureData[sideNr].width,textureData[sideNr].height,0, gl.RGBA, gl.UNSIGNED_BYTE, ambientData);
	//gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, textureIMG);
	//gl.generateMipmap(gl.TEXTURE_2D);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.bindTexture(gl.TEXTURE_2D, null);
	}

	if(boolRti){
		console.log("boolRti");
		for(var i = 0; i<4; i++){
		hshTex[i] = gl.createTexture();
var hshData = new Uint8Array(textureData[0].hshCoef0);

	gl.bindTexture(gl.TEXTURE_2D, hshTex[i]);
	if(!floatingPointTextureSupport){
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, textureData[sideNr].width,textureData[sideNr].height,0, gl.RGBA, gl.UNSIGNED_BYTE, hshData);			
	}
	else{
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, textureData[sideNr].width,textureData[sideNr].height,0, gl.RGB, gl.FLOAT, textureData[0].hshsCoef0);	
	}	
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.bindTexture(gl.TEXTURE_2D, null);
	}
}
	delete textureData[sideNr].ambient; //check with chrome memory management: huge difference
	delete textureData[sideNr].normals;
	delete textureData[sideNr].albedo;
	
	//texture to store offscreen framebuffer color info
	var offscreenTex = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, offscreenTex);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, offscreenRenderWidth, offscreenRenderHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	
	var renderbuffer = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, offscreenRenderWidth, offscreenRenderHeight);
	
	framebuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D, offscreenTex, 0);
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER, renderbuffer);
	gl.bindTexture(gl.TEXTURE_2D, null);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	render(0); //temp: is this necessary
	
}
/*
* changes the old net to a new net, depending on which side has to be in the middle
*/
function changeSide(direction){//0 1 2 3 up bottom left right key
	//6 constellations			main: front: 0 back: 1 bottom: 2 top: 3 left: 4 right: 5
	//check which side is new main side
	switch(mainSide){
		case 0:
			if(direction==0){if(textureData[3]!== undefined){mainSide=3;}}
			else if(direction==1){if(textureData[2]!== undefined){mainSide=2;}}
			else if(direction==2){if(textureData[4]!== undefined){mainSide=4;}}
			else if(direction==3){if(textureData[5]!== undefined){mainSide=5;}}
			break;
		case 1:
			if(direction==0){if(textureData[2]!== undefined){mainSide=2;}}
			else if(direction==1){if(textureData[3]!== undefined){mainSide=3;}}
			else if(direction==2){if(textureData[5]!== undefined){mainSide=5;}}
			else if(direction==3){if(textureData[4]!== undefined){mainSide=4;}}
			break;
		case 2:
			if(direction==0){if(textureData[0]!== undefined){mainSide=0;}}
			else if(direction==1){if(textureData[1]!== undefined){mainSide=1;}}
			else if(direction==2){if(textureData[4]!== undefined){mainSide=4;}}
			else if(direction==3){if(textureData[5]!== undefined){mainSide=5;}}
			break;
		case 3:
			if(direction==0){if(textureData[1]!== undefined){mainSide=1;}}
			else if(direction==1){if(textureData[0]!== undefined){mainSide=0;}}
			else if(direction==2){if(textureData[4]!== undefined){mainSide=4;}}
			else if(direction==3){if(textureData[5]!== undefined){mainSide=5;}}
			break;
		case 4:
			if(direction==0){if(textureData[2]!== undefined){mainSide=2;}}
			else if(direction==1){if(textureData[3]!== undefined){mainSide=3;}}
			else if(direction==2){if(textureData[1]!== undefined){mainSide=1;}}
			else if(direction==3){if(textureData[0]!== undefined){mainSide=0;}}
			break;
		case 5:
			if(direction==0){if(textureData[2]!== undefined){mainSide=2;}}
			else if(direction==1){if(textureData[3]!== undefined){mainSide=3;}}
			else if(direction==2){if(textureData[0]!== undefined){mainSide=0;}}
			else if(direction==3){if(textureData[1]!== undefined){mainSide=1;}}
			break;
		default: break;
	}
	console.log("mainside: " + mainSide);
	//adjust new positions
	switch(mainSide){
		case 0: //front
			for(var i=0; i<Scene.objects.length; i++){
				var object = Scene.objects[i];
				var distance;
				switch(object.id){
					case 0: 
						object.isMiddle = true;
						object.xOff = 0;
						object.yOff = 0;
						object.zRotation = 0; 
						msWidth=textureData[0].width;
						msHeight=textureData[0].height;
						break;
					case 1: //backside
						object.isMiddle = false;
						distance = (50+((textureData[5]!== undefined)?100*scaleFactor[5]:0)+50*scaleFactor[1]);
						object.xOff = Math.cos(rotation[2]/180*Math.PI)*distance;
						object.yOff = Math.sin(rotation[2]/180*Math.PI)*distance;
						object.zRotation = 180;
						break;
					case 2: 
						object.isMiddle = false;
						distance = -(50*textureData[0].height/textureData[0].width+50*scaleFactor[2]*textureData[2].height/textureData[2].width);
						object.xOff = -Math.sin(rotation[2]/180*Math.PI)*distance;
						object.yOff = Math.cos(rotation[2]/180*Math.PI)*distance;
						object.zRotation = 0;
						break;
					case 3: 
						object.isMiddle = false;
						distance = 50*textureData[0].height/textureData[0].width+50*scaleFactor[3]*textureData[3].height/textureData[3].width;
						object.xOff = -Math.sin(rotation[2]/180*Math.PI)*distance;
						object.yOff = Math.cos(rotation[2]/180*Math.PI)*distance;
						object.zRotation = 0;
						break;
					case 4: 
						object.isMiddle = false;
						distance = -(50+50*scaleFactor[4]);
						object.xOff = Math.cos(rotation[2]/180*Math.PI)*distance;
						object.yOff = Math.sin(rotation[2]/180*Math.PI)*distance;
						object.zRotation = 0;
						break;
					case 5: 
						object.isMiddle = false;
						distance = (50+50*scaleFactor[5]);
						object.xOff = Math.cos(rotation[2]/180*Math.PI)*distance;
						object.yOff = Math.sin(rotation[2]/180*Math.PI)*distance;
						object.zRotation = 0;
						break;
				}
			}
			break;
		case 1: //back
			for(var i=0; i<Scene.objects.length; i++){
				var object = Scene.objects[i];
				var distance;
				switch(object.id){
					case 0: 
						distance = (50*textureData[1].height/textureData[1].width*scaleFactor[1]+100*textureData[2].height/textureData[2].width*scaleFactor[2]+50*textureData[0].height/textureData[0].width);
						object.isMiddle = false;
						object.xOff = -Math.sin(rotation[2]/180*Math.PI)*distance;
						object.yOff = Math.cos(rotation[2]/180*Math.PI)*distance;
						object.zRotation = 0;
						break;
					case 1: 
						object.isMiddle = true;
						object.xOff =0;
						object.yOff = 0;
						object.zRotation = 0;
						msWidth=textureData[1].width;
						msHeight=textureData[1].height;
						break;
					case 2: 
						distance = (50*textureData[1].height/textureData[1].width*scaleFactor[1]+50*textureData[2].height/textureData[2].width*scaleFactor[2]);
						object.isMiddle = false;
						object.xOff = -Math.sin(rotation[2]/180*Math.PI)*distance;
						object.yOff = Math.cos(rotation[2]/180*Math.PI)*distance;
						object.zRotation = 0;
						break;
					case 3: 
						distance = -(50*textureData[1].height/textureData[1].width*scaleFactor[1]+50*textureData[3].height/textureData[3].width*scaleFactor[3]);
						object.isMiddle = false;
						object.xOff = -Math.sin(rotation[2]/180*Math.PI)*distance;
						object.yOff = Math.cos(rotation[2]/180*Math.PI)*distance;
						object.zRotation = 0;
						break;
					case 4: 
						distance = -(50*scaleFactor[1]+50*scaleFactor[4]);
						object.isMiddle = false;
						object.xOff = Math.cos(rotation[2]/180*Math.PI)*distance;
						object.yOff = Math.sin(rotation[2]/180*Math.PI)*distance;
						object.zRotation = 180;
						break;
					case 5: 
						distance = (50*scaleFactor[1]+50*scaleFactor[5]);
						object.isMiddle = false;
						object.xOff = Math.cos(rotation[2]/180*Math.PI)*distance;
						object.yOff = Math.sin(rotation[2]/180*Math.PI)*distance;
						object.zRotation = 180;
						break;
				}
			}
			break;
		case 2: //bottom
			for(var i=0; i<Scene.objects.length; i++){
				var object = Scene.objects[i];
				var distance;
				switch(object.id){
					case 0: 
						distance = (50*textureData[2].height/textureData[0].width*scaleFactor[2]+50*textureData[0].height/textureData[0].width);
						object.isMiddle = false;
						object.xOff = -Math.sin(rotation[2]/180*Math.PI)*distance;
						object.yOff = Math.cos(rotation[2]/180*Math.PI)*distance;
						object.zRotation = 0;
						break;
					case 1: 
						distance = -(50*textureData[2].height/textureData[0].width*scaleFactor[2]+50*textureData[1].height/textureData[1].width*scaleFactor[1]);
						object.isMiddle = false;
						object.xOff = -Math.sin(rotation[2]/180*Math.PI)*distance;
						object.yOff = Math.cos(rotation[2]/180*Math.PI)*distance;
						object.zRotation = 0;
						break;
					case 2: 
						object.isMiddle = true;
						object.xOff =0;
						object.yOff = 0;
						object.zRotation = 0;
						msWidth=textureData[2].width;
						msHeight=textureData[2].height;
						break;
					case 3: 
						distance = (50*textureData[2].height/textureData[0].width*scaleFactor[2]+100*textureData[0].height/textureData[0].width+50*textureData[3].height/textureData[3].width*scaleFactor[3]);
						object.isMiddle = false;
						object.xOff = -Math.sin(rotation[2]/180*Math.PI)*distance;
						object.yOff = Math.cos(rotation[2]/180*Math.PI)*distance;
						object.zRotation = 0;
						break;
					case 4: 
						distance = -(50*scaleFactor[2]+50*scaleFactor[4]*textureData[4].height/textureData[4].width);
						object.isMiddle = false;
						object.xOff = Math.cos(rotation[2]/180*Math.PI)*distance;
						object.yOff = Math.sin(rotation[2]/180*Math.PI)*distance;
						object.zRotation = 90;
						break;
					case 5: 
						distance = (50*scaleFactor[2]+50*scaleFactor[5]*textureData[5].height/textureData[5].width);
						object.isMiddle = false;
						object.xOff = Math.cos(rotation[2]/180*Math.PI)*distance;
						object.yOff = Math.sin(rotation[2]/180*Math.PI)*distance;
						object.zRotation = -90;
						break;
				}
			}
			break;
		case 3: //top
			for(var i=0; i<Scene.objects.length; i++){
				var object = Scene.objects[i];
				var distance;
				switch(object.id){
					case 0: 
						distance = -(50*textureData[3].height/textureData[3].width*scaleFactor[3]+50*textureData[0].height/textureData[0].width);
						object.isMiddle = false;
						object.xOff = -Math.sin(rotation[2]/180*Math.PI)*distance;
						object.yOff = Math.cos(rotation[2]/180*Math.PI)*distance;
						object.zRotation = 0;
						break;
					case 1: 
						distance = (50*textureData[3].height/textureData[3].width*scaleFactor[3]+50*textureData[1].height/textureData[1].width*scaleFactor[1]);
						object.isMiddle = false;
						object.xOff = -Math.sin(rotation[2]/180*Math.PI)*distance;
						object.yOff = Math.cos(rotation[2]/180*Math.PI)*distance;
						object.zRotation = 0;
						break;
					case 2: 
						distance = (50*textureData[3].height/textureData[3].width*scaleFactor[3]+100*textureData[1].height/textureData[1].width*scaleFactor[1]+50*textureData[2].height/textureData[2].width*scaleFactor[2]);
						object.isMiddle = false;
						object.xOff = -Math.sin(rotation[2]/180*Math.PI)*distance;
						object.yOff = Math.cos(rotation[2]/180*Math.PI)*distance;

						object.zRotation = 0;
						break;
					case 3: 
						object.isMiddle = true;
						object.xOff =0;
						object.yOff = 0;
						object.zRotation = 0;
						msWidth=textureData[3].width;
						msHeight=textureData[3].height;
						break;
					case 4: 
						distance = -(50*scaleFactor[2]+50*scaleFactor[4]*textureData[4].height/textureData[4].width);
						object.isMiddle = false;
						object.xOff = Math.cos(rotation[2]/180*Math.PI)*distance;
						object.yOff = Math.sin(rotation[2]/180*Math.PI)*distance;
						object.zRotation = -90;
						break;
					case 5: 
						distance = (50*scaleFactor[2]+50*scaleFactor[5]*textureData[5].height/textureData[5].width);
						object.isMiddle = false;
						object.xOff = Math.cos(rotation[2]/180*Math.PI)*distance;
						object.yOff = Math.sin(rotation[2]/180*Math.PI)*distance;
						object.zRotation = 90;
						break;
				}
			}
			break;
		case 4: //left
			for(var i=0; i<Scene.objects.length; i++){
				var object = Scene.objects[i];
				var distance;
				switch(object.id){
					case 0: 
						distance = (50*scaleFactor[4]+50);
						object.isMiddle = false;
						object.xOff = Math.cos(rotation[2]/180*Math.PI)*distance;
						object.yOff = Math.sin(rotation[2]/180*Math.PI)*distance;
						object.zRotation = 0;
						break;
					case 1: 
						distance = -(50*scaleFactor[4]+50*scaleFactor[1]);
						object.isMiddle = false;
						object.xOff = Math.cos(rotation[2]/180*Math.PI)*distance;
						object.yOff = Math.sin(rotation[2]/180*Math.PI)*distance;
						object.zRotation = 180;
						break;
					case 2: 
						distance = -(50*textureData[4].height/textureData[4].width*scaleFactor[4]+50*scaleFactor[2]);
						object.isMiddle = false;
						object.xOff = -Math.sin(rotation[2]/180*Math.PI)*distance;
						object.yOff = Math.cos(rotation[2]/180*Math.PI)*distance;
						object.zRotation = -90;
						break;
					case 3: 
						distance = (50*textureData[4].height/textureData[4].width*scaleFactor[4]+50*scaleFactor[3]);
						object.isMiddle = false;
						object.xOff = -Math.sin(rotation[2]/180*Math.PI)*distance;
						object.yOff = Math.cos(rotation[2]/180*Math.PI)*distance;
						object.zRotation = 90;
						break;
					case 4: 
						object.isMiddle = true;
						object.xOff = 0;
						object.yOff = 0;
						object.zRotation = 0;
						msWidth=textureData[4].width;
						msHeight=textureData[4].height;
						break;
					case 5: 
						distance = -(50*textureData[4].height/textureData[4].width*scaleFactor[4]+100*scaleFactor[2]+50*textureData[5].height/textureData[5].width*scaleFactor[5]);
						object.isMiddle = false;
						object.xOff = -Math.sin(rotation[2]/180*Math.PI)*distance;
						object.yOff = Math.cos(rotation[2]/180*Math.PI)*distance;
						object.zRotation = 180;
						break;
				}
			}
			break;
		case 5: //right
			for(var i=0; i<Scene.objects.length; i++){
				var object = Scene.objects[i];
				var distance;
				switch(object.id){
					case 0: 
						distance = -(50*scaleFactor[5]+50);
						object.isMiddle = false;
						object.xOff = Math.cos(rotation[2]/180*Math.PI)*distance;
						object.yOff = Math.sin(rotation[2]/180*Math.PI)*distance;
						object.zRotation = 0;
						break;
					case 1: 
						distance = (50*scaleFactor[5]+50*scaleFactor[1]);
						object.isMiddle = false;
						object.xOff = Math.cos(rotation[2]/180*Math.PI)*distance;
						object.yOff = Math.sin(rotation[2]/180*Math.PI)*distance;
						object.zRotation = 180;
						break;
					case 2: 
						distance = -(50*textureData[5].height/textureData[5].width*scaleFactor[5]+50*scaleFactor[2]);
						object.isMiddle = false;
						object.xOff = -Math.sin(rotation[2]/180*Math.PI)*distance;
						object.yOff = Math.cos(rotation[2]/180*Math.PI)*distance;
						object.zRotation = -90;
						break;
					case 3: 
						distance = (50*textureData[5].height/textureData[5].width*scaleFactor[5]+50*scaleFactor[3]);
						object.isMiddle = false;
						object.xOff = -Math.sin(rotation[2]/180*Math.PI)*distance;
						object.yOff = Math.cos(rotation[2]/180*Math.PI)*distance;
						object.zRotation = 90;
						break;
					case 4: 
						distance = -(50*textureData[5].height/textureData[5].width*scaleFactor[5]+100*scaleFactor[2]+50*textureData[4].height/textureData[4].width*scaleFactor[4]);
						object.isMiddle = false;
						object.xOff = -Math.sin(rotation[2]/180*Math.PI)*distance;
						object.yOff = Math.cos(rotation[2]/180*Math.PI)*distance;
						object.zRotation = 180;
						break;
					case 5: 
						object.isMiddle = true;
						object.xOff = 0;
						object.yOff = 0;
						object.zRotation = 0;
						msWidth=textureData[5].width;
						msHeight=textureData[5].height;
						break;
				}
			}
			break;
	}

}

function updateProgram(number){
	if(!gl){return;}
	switch(number){
		case 1: mainPrg = prg1; mainProgram = program1; break;
		case 2: mainPrg = prg2; mainProgram = program2; break;
		case 3: mainPrg = prg3; mainProgram = program3; break;
		case 4: mainPrg = prg4; mainProgram = program4; break;
		case 5: mainPrg = prg5; mainProgram = program5; break;
		case 6: mainPrg = prg6; mainProgram = program6; break;
		case 7: /*mainPrg = prg7; mainProgram = program7; */break;
		case 8: mainPrg = prg8; mainProgram = program8; break;
		case 9: mainPrg = prg9; mainProgram = program9; break;
		case 10: mainPrg = prg10; mainProgram = program10; break;
	        case 11: mainPrg = prg11; mainProgram = program11; break;
	}
	render(0);
	console.log("program: "+number);
}
/*
* to do: major performance hit when readpixels and building canvas, create screenshotmode and hybrid mode
*/
function takeScreenshot(){
	if(!gl){return;}
	gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
	render(1);
var ddd1 = new Date().getTime();

	var offscreenView = new Uint8Array(offscreenRenderWidth*offscreenRenderHeight*4);
var ddd2 = new Date().getTime();
console.log((ddd2-ddd1));	
	gl.readPixels(0,0,offscreenRenderWidth,offscreenRenderHeight,gl.RGBA,gl.UNSIGNED_BYTE,offscreenView);
var ddd3 = new Date().getTime();
console.log("readpixels: "+(ddd3-ddd2));	
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	render(0);
var ddd4 = new Date().getTime();
console.log((ddd4-ddd3));
	//omzetten naar bmp
var cnvs=document.getElementById("canvasOffscreenHelper");	
	$('#canvasOffscreenHelper').attr('width',offscreenRenderWidth);
	$('#canvasOffscreenHelper').attr('height',offscreenRenderHeight);
	var ctxt=cnvs.getContext("2d");
	var imgData=ctxt.createImageData(offscreenRenderWidth,offscreenRenderHeight);
var ddd5 = new Date().getTime();
console.log((ddd5-ddd4));
	for(var i=0;i<offscreenRenderHeight;i+=1){							//put arraybuffer content in canvas, flipped vertically
		for(var j=0;j<=4*offscreenRenderWidth-4;j=j+1){
			imgData.data[j+i*4*offscreenRenderWidth]=offscreenView[j-i*4*offscreenRenderWidth+4*offscreenRenderWidth*offscreenRenderHeight];
		}
  	}
var ddd6 = new Date().getTime();
console.log((ddd6-ddd5));
	ctxt.putImageData(imgData,0,0);
	var img = cnvs.toDataURL("image/jpeg");;
	document.getElementById("imgOffscreenHelper").src=img;
	document.getElementById("aOffscreenHelper").href = img;
	document.getElementById("aOffscreenHelper").download=document.getElementById("inputOffscreenName").value+".jpeg";
  
	var clickEvent = document.createEvent("MouseEvent");
	clickEvent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null); 
	document.getElementById("aOffscreenHelper").dispatchEvent(clickEvent);

	console.log("done taking screenshot");
	
	return img;
		var ddd7 = new Date().getTime();

console.log((ddd7-ddd6));
}
var renderNew;
/*
* The only way to animate webgl scenes, using request animation frame
*/
function animate(){

	timeoutid = window.requestAnimFrame(animate);
	render(0);


}

var dddd2;
var dddd1;
var timeVar=0;
function animateTest(){
//gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
animateTest2();
}
function animateTest2(){
	
	timeoutid = window.requestAnimFrame(animateTest);
/*
var ddd1 = new Date().getTime();
if(rotation[2]%360==0){
	dddd2 = new Date().getTime();
console.log((dddd2-dddd1));
dddd1 = dddd2;
}
	rotation[2]+=3;
	render(0);
	var ddd2 = new Date().getTime();

//console.log((ddd2-ddd1));
*/
lightDirection0[0]=Math.cos(timeVar);
lightDirection0[1]=Math.sin(timeVar);
lightDirection0[2]=0.5;
timeVar += 0.01;
render(0);
}

/*
* the main render function. called whenever scene needs to be updated. s==0: render in regular canvas, s==1: render to offscreen framebuffer
* main idea: for each object in scene: update matrices, lightdirection and scene
*/
function render(s) {
renderTime0 = new Date().getTime();
	if(s==0){
		gl.viewport(0, 0, canvasWidth, canvasHeight);
	}
	else if(s==1){
		gl.viewport(0, 0,offscreenRenderWidth, offscreenRenderHeight);	
	}
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	var curPrg = null;
	var curProgram = null;
	
	try{	    
		for(var i=0; i<Scene.objects.length; i++){
			var object = Scene.objects[i];
			if(object.type=="sidePlane"){	
				gl.useProgram(mainPrg);
				curProgram = mainProgram;
				curPrg = mainPrg;
			}
			else{
				gl.useProgram(prg1);
				curProgram = program1;
				curPrg = prg1;			
			}
			
			var renderPosition = position.slice(0);
			renderPosition[0]+=object.xOff;
			renderPosition[1]+=object.yOff;
			var renderRotation = rotation.slice(0);
			renderRotation[2]+=object.zRotation;
			if(object.isMiddle==true){
				object.lightDirection0 = lightDirection0.slice(0);
				object.lightDirection1 = lightDirection1.slice(0);
				object.param0 = param0;
				object.param1 = param1;
				object.lightIntensity0 = lightIntensity0;
				object.lightIntensity1 = lightIntensity1;
			}
			
			//gl.uniform1fv(curProgram.gkernels, kerneltest);
			
			if(s==1){
				mat4.perspective(30/180*Math.PI, offscreenRenderWidth/offscreenRenderHeight, 1, 10000.0, pMatrix);		
			}	
			else{
				mat4.perspective(30/180*Math.PI, canvasWidth / canvasHeight, 1, 10000.0, pMatrix);  // We can resize the screen at any point so the perspective matrix should be updated always.
			}
			mat4.identity(mvMatrix);
			mat4.set(mvMatrix,mvMatrixCopy);
		
			if(object.type=="sidePlane"){

				if(s==1){
					mat4.translate(mvMatrix, [HOME[0]+object.xOff,HOME[1]+object.yOff,HOME[2]]);
					renderRotation[2] -= rotation[2];
				}
				else{
					mat4.translate(mvMatrix, renderPosition);
				}
				mat4.rotateX(mvMatrix,renderRotation[0]*Math.PI/180);
				mat4.rotateY(mvMatrix,renderRotation[1]*Math.PI/180);
				mat4.rotateZ(mvMatrix,renderRotation[2]*Math.PI/180);
				mat4.rotateX(nMatrix,renderRotation[0]*Math.PI/180);
				mat4.rotateY(nMatrix,renderRotation[1]*Math.PI/180);
				mat4.rotateZ(nMatrix,renderRotation[2]*Math.PI/180);	
			}

			if(object.id=="objectLight0"){
				var zdisp = 5;
				mat4.translate(mvMatrix, [lightDirection0[0]*Math.tan(15/180*Math.PI)*zdisp*canvasWidth / canvasHeight/lightEllipseFactor,lightDirection0[1]*Math.tan(15/180*Math.PI)*zdisp/lightEllipseFactor,-zdisp]);
				mat4.rotateY(mvMatrix,-Math.acos(lightDirection0[0])-lightDirection0[0]*30/180*Math.PI+Math.PI/2);
				mat4.rotateX(mvMatrix,Math.acos(lightDirection0[1])+lightDirection0[1]*30/180*Math.PI/canvasWidth*canvasHeight-Math.PI/2);
			}

			if(object.id=="objectLight1"){
				var zdisp = 5;
				mat4.translate(mvMatrix, [lightDirection1[0]*Math.tan(15/180*Math.PI)*zdisp*canvasWidth / canvasHeight/lightEllipseFactor,lightDirection1[1]*Math.tan(15/180*Math.PI)*zdisp/lightEllipseFactor,-zdisp]);
				mat4.rotateY(mvMatrix,-Math.acos(lightDirection1[0])-lightDirection1[0]*30/180*Math.PI+Math.PI/2);
				mat4.rotateX(mvMatrix,Math.acos(lightDirection1[1])+lightDirection1[1]*30/180*Math.PI/canvasWidth*canvasHeight-Math.PI/2);
			}

			gl.uniformMatrix4fv(curProgram.uMVMatrix, false, mvMatrix);
			gl.uniformMatrix4fv(curProgram.uPMatrix, false, pMatrix);    	
			mat4.inverse(mvMatrix,mvMatrix);     				
			mat4.transpose(mvMatrix, nMatrix);                     	
			gl.uniformMatrix4fv(curProgram.uNMatrix, false, nMatrix);    	
			gl.uniform3fv(curProgram.uLightDirection0, object.lightDirection0);
			gl.uniform3fv(curProgram.uLightDirection1, object.lightDirection1);
			gl.uniform3fv(curProgram.uSplit, split);
			gl.uniform1f(curProgram.uLightIntensity0, object.lightIntensity0);
			gl.uniform1f(curProgram.uLightIntensity1, object.lightIntensity1);
			gl.uniform1f(curProgram.uFloatTex, floatingPointTextureSupport);
			if(moving){		
				gl.uniform1f(curProgram.uParam0, 0.1);
				gl.uniform1f(curProgram.uParam1, 0);
			}
			else{
				gl.uniform1f(curProgram.uParam0, object.param0);
				gl.uniform1f(curProgram.uParam1, object.param1);
			}
			
			mat4.set(mvMatrixCopy,mvMatrix); //switch back to old mvMatrix
	
			gl.bindBuffer(gl.ARRAY_BUFFER, object.vbo);
			gl.enableVertexAttribArray(0);
			gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
			gl.bindBuffer(gl.ARRAY_BUFFER, null);
			//console.log( "VBO SIZE: "+gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE));

			if(object.id=="objectLight0" && boolLightToggle()){gl.uniform4fv(curProgram.uMaterialAmbient, [1.0, 1.0, 0, 1.0]);}
			else if(object.id=="objectLight1"){gl.uniform4fv(curProgram.uMaterialAmbient, [1.0, 1.0, 0, 1.0]);}
			else{gl.uniform4fv(curProgram.uMaterialAmbient, [0, 0, 0, 0]);}
			gl.bindBuffer(gl.ARRAY_BUFFER, object.tbo);
			gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);		
			gl.enableVertexAttribArray(1);
			
			if (object.id!="objectLight0" && object.id!="objectLight1"){
				gl.uniform2fv(curProgram.uImgDim, [textureData[object.id].width,textureData[object.id].height]);
				gl.uniform1f(curProgram.uBoolDepthMap, boolDepthMap);
				if(boolDepthMap){
					gl.activeTexture(gl.TEXTURE0);
					gl.bindTexture(gl.TEXTURE_2D, disTex[object.id]);
					gl.uniform1i(curProgram.uDispSampler, 0);
				}
				
				gl.activeTexture(gl.TEXTURE1);
				gl.bindTexture(gl.TEXTURE_2D, normalTex[object.id]);
				gl.uniform1i(curProgram.uNormalSampler, 1);
				
				if(useAmbient){
					gl.activeTexture(gl.TEXTURE2);
					gl.bindTexture(gl.TEXTURE_2D, ambientTex[object.id]);
					gl.uniform1i(curProgram.uAlbedoSampler, 2);
				}
				else{
					gl.activeTexture(gl.TEXTURE2);
					gl.bindTexture(gl.TEXTURE_2D, albedoTex[object.id]);
					gl.uniform1i(curProgram.uAlbedoSampler, 2);
				}
				if(boolRti){
					gl.activeTexture(gl.TEXTURE0);
					gl.bindTexture(gl.TEXTURE_2D, disTex[object.id]);
					gl.uniform1i(curProgram.hshCoeff0Tex, 0);
				}
			}
			else{
				gl.uniform1f(curProgram.uBoolDepthMap, false);
			}
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.ibo);
			if((object.type=="lightCone")&& boolLightToggle() &&(mainPrg == prg1 || mainPrg == prg3 || mainPrg == prg4 ||mainPrg == prg8 || mainPrg == prg9)){
                gl.drawElements(gl.LINE_STRIP, object.indices.length, gl.UNSIGNED_SHORT,0);
				if(object.id=="objectLight0"){gl.uniform4fv(curProgram.uMaterialAmbient, [lightIntensity0/2, lightIntensity0/2,0, 1.0]);}
				if(object.id=="objectLight1"){gl.uniform4fv(curProgram.uMaterialAmbient, [lightIntensity1/2, lightIntensity1/2,0, 1.0]);}
				gl.drawElements(gl.TRIANGLES, object.indices.length, gl.UNSIGNED_SHORT,0);
            }    
            if(object.type=="sidePlane"){gl.drawElements(gl.TRIANGLES, object.indices.length, gl.UNSIGNED_SHORT,0);}
			gl.bindBuffer(gl.ARRAY_BUFFER, null);
         gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        }
gl.finish(); // waiting for the program to have finished this draw call. performance trick, should be investigated further: some claim this actually make it worse due to context switch from gpu to cpu, but test indicated slow shaders worked better with this
renderTime1 = new Date().getTime();
console.log((renderTime1-renderTime0));

    }
    catch(err){
        alert(err);
        console.error(err.description);
    }
}
