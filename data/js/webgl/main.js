
///globals
var useVertexColors = false;
var texture = null;
var gl = null;     		// WebGL context





var program_pld_default_color = null; 	//WebGL program
var program_pld_color_specular = null;
var program_pld_sharpen_refl = null;
var program_pld_sharpen_nor = null;
var program_pld_curvature1 = null;
var program_pld_curvature2 = null;
var program_pld_sketch1 = null;
var program_pld_sketch2 = null;
var program_pld_shaded = null;
var program_pld_shaded_exag = null;
var program_normals = null;
var program_refl = null;
var program_hsh_default_color = null;
var program_hsh_sharpen_hsh = null;
var program_hsh_sharpen_nor = null;
var program_hsh_spec_enh = null;
var program_ptm_default_color = null;
var program_ptm_spec_enh = null;
var program_rbf_default_color = null;
var program_rbf_spec_enh = null;

var prg_pld_default_color = null; 	//WebGL program
var prg_pld_color_specular = null;
var prg_pld_sharpen_refl = null;
var prg_pld_sharpen_nor = null;
var prg_pld_curvature1 = null;
var prg_pld_curvature2 = null;
var prg_pld_sketch1 = null;
var prg_pld_sketch2 = null;
var prg_pld_shaded = null;
var prg_pld_shaded_exag = null;
var prg_normals = null;
var prg_refl = null;
var prg_hsh_default_color = null;
var prg_hsh_sharpen_hsh = null;
var prg_hsh_sharpen_nor = null;
var prg_hsh_spec_enh = null;
var prg_ptm_default_color = null;
var prg_ptm_spec_enh = null;
var prg_rbf_default_color = null;
var prg_rbf_spec_enh = null;

const GlPrg = {"pld_default_color":1, "pld_color_specular":2, "pld_sharpen_refl":3, "pld_sharpen_nor":4, "pld_curvature1":5, "pld_curvature2":6, "pld_sketch1":7, "pld_sketch2":8, "pld_shaded":9, "pld_shaded_exag":10, "normals": 20, "refl":21, "hsh_default_color":30, "hsh_sharpen_hsh":31, "hsh_sharpen_nor":32, "hsh_spec_enh":33, "ptm_default_color":40, "ptm_spec_enh":41, "rbf_default_color":50, "rbf_spec_enh":51 };



var tan15 = Math.tan(15/180*Math.PI);
var tan30 = Math.tan(30/180*Math.PI);
var piDev180 = Math.PI/180;

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
var reflectPosition = 1.0;

var lightDirection0 = [-0.5,0.5,0.7];
var lightDirection1 = [0.5,0.5,0.7];

var lightIntensity0 = 3;
var lightIntensity1 = 1;

var param = [0.4, 0.5, 25, 0, 0];

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
var albedo2Tex = new Array(6); //contains ir and uv channels
var ambient2Tex = new Array(6);

var hshTex = new Array(4);
var ptmTex = new Array(3);
var rbfTex = new Array(6);

var reflectanceChannelMix = [0.0, 1.0, 2.0];

//var kerneltest = new Array(1.0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 0.25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.375, 0.25, 0.062, 0, 0, 0, 0, 0, 0, 0, 0, 0.312, 0.234, 0.093, 0.015, 0, 0, 0, 0, 0, 0, 0, 0.274, 0.219, 0.109, 0.03, 0.003, 0, 0, 0, 0, 0, 0, 0.247, 0.206, 0.117, 0.043, 0.009, 0, 0, 0, 0, 0, 0, 0.227, 0.194, 0.121, 0.053, 0.015, 0.002, 0, 0, 0, 0, 0, 0.211, 0.184, 0.122, 0.06, 0.021, 0.004, 0, 0, 0, 0, 0, 0.198, 0.176, 0.122, 0.066, 0.026, 0.007, 0.001, 0, 0, 0, 0, 0.188, 0.169, 0.122, 0.07, 0.031, 0.01, 0.002, 0, 0, 0, 0, 0.179, 0.162, 0.121, 0.073, 0.035, 0.013, 0.003, 0, 0, 0, 0, 0.171, 0.157, 0.12, 0.076, 0.039, 0.016, 0.004, 0, 0, 0, 0);

var nuoud;
var timeoutid;

var vs;
var floatingPointTextureSupport = 1;
var boolFloatTexture = 1.0;

var offscreenRenderHeight;
var offscreenRenderWidth;

var lightColor0 = [0.45077517154912006, 0.49069184135855726, 0.475, 1];//intensity2Color(lightIntensity0);
var lightColor1 = [0.42500000000000004, 0.3880429377746968, 0.2579906775424386, 1];//intensity2Color(lightIntensity1);

/*
* Invoked by runWebGL()
*/
function initWebGL(){
	useVertexColors = false;
	texture = null;
	gl = null;     		// WebGL context
	program_pld_default_color = null; 	//WebGL program
	program_pld_color_specular = null;
	program_pld_sharpen_refl = null;
	program_pld_sharpen_nor = null;
	program_pld_curvature1 = null;
	program_pld_curvature2 = null;
	program_pld_sketch1 = null;
	program_pld_sketch2 = null;
	program_pld_shaded = null;
	program_pld_shaded_exag = null;
	program_hsh_default_color = null;
	program_hsh_sharpen_hsh = null;
	program_hsh_sharpen_nor = null;
	program_hsh_spec_enh = null;
	program_normals = null;
	program_refl = null;
	program_ptm_default_color = null;
	program_ptm_spec_enh = null;
	program_rbf_default_color = null;
	program_rbf_spec_enh = null;

	prg_pld_default_color = null; 	//WebGL program
	prg_pld_color_specular = null;
	prg_pld_sharpen_refl = null;
	prg_pld_sharpen_nor = null;
	prg_pld_curvature1 = null;
	prg_pld_curvature2 = null;
	prg_pld_sketch1 = null;
	prg_pld_sketch2 = null;
	prg_pld_shaded = null;
	prg_pld_shaded_exag = null;
	prg_hsh_default_color = null;
	prg_hsh_sharpen_hsh = null;
	prg_hsh_sharpen_nor = null;
	prg_hsh_spec_enh = null;
	prg_normals = null;
	prg_refl = null;
	prg_ptm_default_color = null;
	prg_ptm_spec_enh = null;
	prg_rbf_default_color = null;
	prg_rbf_spec_enh = null;

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
	rotation[2] = boolZRotation ? pZRotation : 0;
	lrotation = [0,0,0];
	reflectPosition = 1.0;

	lightDirection0 = [-0.5,0.5,0.7];
	lightDirection1 = [0.5,0.5,0.7];

	lightIntensity0 = 3;
	lightIntensity1 = 1;
 
	param = [0.4, 0.5, 25, 0, 0];

	useAmbient = false;
	reflectanceChannelMix = [0.0, 1.0, 2.0];

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

	oldX0 = lightDirection0[0]* canvasWidth2/2/lightEllipseFactor +canvasWidth2/2;
	oldY0 = lightDirection0[1]* canvasHeight2/2/lightEllipseFactor +canvasHeight2/2;
	oldX1 = lightDirection1[0]* canvasWidth2/2/lightEllipseFactor +canvasWidth2/2;
	oldY1 = lightDirection1[1]* canvasHeight2/2/lightEllipseFactor +canvasHeight2/2;

	lightColor0 = intensity2Color(lightIntensity0);
	lightColor1 = intensity2Color(lightIntensity1);

}
/*
* Main starting anchor for the WebGL part, invoked after first textureplane is parsed
*/
function runWebGL() {

	$("#loader").css("display","none");
	$("#progressIndicator").css("display","none");
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

	updateCanvasSize();
	$(document).ready(function(){
		console.log("document ready"); 
		if(!boolScml){
		  if(boolPhotometric){updateProgram("pld_default_color");}
		  else if(boolPtm){updateProgram("ptm_default_color");}
		  else if(boolHsh){updateProgram("hsh_default_color");}
		  else if(boolRbf){updateProgram("rbf_default_color");}
		}
	});

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
	try { ext = gl.getExtension("OES_element_index_uint");} catch(e) {}
	if(!ext){floatingPointTextureSupport=0;
 	console.log("OES_element_index_uint not supported");}

	gl.depthFunc(gl.LEQUAL);
	//gl.enable(gl.BLEND);
	//gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
	initTransforms();

	vs = loadShaders(gl,"vs/mainVertexShader"); //since every program uses the same vertex shader, we only need to load it once

	prg_pld_default_color = gl.createProgram();
	program_pld_default_color = new Programm("vs/color","fs/pld_default_color",prg_pld_default_color);

	mainPrg = prg_pld_default_color;
	mainProgram = program_pld_default_color;

	prg_pld_color_specular = gl.createProgram();
	program_pld_color_specular = new Programm("vs/color","fs/pld_color_specular",prg_pld_color_specular);

	prg_pld_sharpen_refl = gl.createProgram();
	program_pld_sharpen_refl = new Programm("vs/color","fs/pld_sharpen_refl",prg_pld_sharpen_refl);

	prg_pld_sharpen_nor = gl.createProgram();
	program_pld_sharpen_nor = new Programm("vs/color","fs/pld_sharpen_nor",prg_pld_sharpen_nor);

	prg_normals = gl.createProgram();
	program_normals = new Programm("vs/color","fs/normals",prg_normals);
	
	prg_pld_shaded = gl.createProgram();
	program_pld_shaded = new Programm("vs/color","fs/pld_shaded",prg_pld_shaded);

	prg_pld_shaded_exag = gl.createProgram();
	program_pld_shaded_exag = new Programm("vs/color","fs/pld_shaded_exag",prg_pld_shaded_exag);

	prg_pld_curvature1 = gl.createProgram();
	program_pld_curvature1 = new Programm("vs/color","fs/pld_curvature",prg_pld_curvature1);

	prg_pld_curvature2 = gl.createProgram();
	program_pld_curvature2 = new Programm("vs/color","fs/pld_curvature2",prg_pld_curvature2);

	prg_pld_sketch1 = gl.createProgram();
	program_pld_sketch1 = new Programm("vs/color","fs/pld_sketch",prg_pld_sketch1);

	prg_pld_sketch2 = gl.createProgram();
	program_pld_sketch2 = new Programm("vs/color","fs/pld_sketch2",prg_pld_sketch2);

	prg_refl = gl.createProgram();
	program_refl = new Programm("vs/color","fs/refl",prg_refl);

	

	prg_hsh_default_color = gl.createProgram();
	program_hsh_default_color = new Programm("vs/color","fs/hsh_default_color",prg_hsh_default_color);

	prg_hsh_sharpen_hsh = gl.createProgram();
	program_hsh_sharpen_hsh = new Programm("vs/color","fs/hsh_sharpen_hsh",prg_hsh_sharpen_hsh);

	prg_hsh_sharpen_nor = gl.createProgram();
	program_hsh_sharpen_nor = new Programm("vs/color","fs/hsh_sharpen_nor",prg_hsh_sharpen_nor);

	prg_hsh_spec_enh = gl.createProgram();
	program_hsh_spec_enh = new Programm("vs/color","fs/hsh_spec_enh",prg_hsh_spec_enh);
	
	prg_ptm_default_color = gl.createProgram();
	program_ptm_default_color = new Programm("vs/color","fs/ptm_default_color",prg_ptm_default_color);

	prg_ptm_spec_enh = gl.createProgram();
	program_ptm_spec_enh = new Programm("vs/color","fs/ptm_spec_enh",prg_ptm_spec_enh);

	prg_rbf_default_color = gl.createProgram();
	program_rbf_default_color = new Programm("vs/color","fs/rbf_default_color",prg_rbf_default_color);

	prg_rbf_spec_enh = gl.createProgram();
	program_rbf_spec_enh = new Programm("vs/color","fs/rbf_spec_enh",prg_rbf_spec_enh);
	

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
	canvasWidth = $('#content').width()*1;
	canvasHeight = $('#content').height()*1; //check for performance
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
	//console.log(canvasWidth2);
}

// r g b ir uv -> 0 1 2 3 4
function updateColorMix(mix){

	if(mix === "IRG"){ reflectanceChannelMix = [3.0, 0.0, 1.0];}
	else if(mix === "IGB"){ reflectanceChannelMix = [3.0, 1.0, 2.0];}
	else if(mix === "RGB"){ reflectanceChannelMix = [0.0, 1.0, 2.0];}
	else if(mix === "RGU"){ reflectanceChannelMix = [0.0, 1.0, 4.0];}
	else if(mix === "GBU"){ reflectanceChannelMix = [1.0, 2.0, 4.0];}
	else if(mix === "III"){ reflectanceChannelMix = [3.0, 3.0, 3.0];}
	else if(mix === "RRR"){ reflectanceChannelMix = [0.0, 0.0, 0.0];}
	else if(mix === "GGG"){ reflectanceChannelMix = [1.0, 1.0, 1.0];}
	else if(mix === "BBB"){ reflectanceChannelMix = [2.0, 2.0, 2.0];}
	else if(mix === "UUU"){ reflectanceChannelMix = [3.0, 3.0, 3.0];}

}

function updateReflectance(id){
	if(boolScml){
		singleFile.reflectanceSource = id;
		singleFile.onShaderChange(mainProgram);
	}
	console.log("updateReflectance: " + id);
	if(gl){render(0);}
}

function updateNormal(spectralNb){
	if(boolScml){
		singleFile.normalSource = spectralNb;
		singleFile.onShaderChange(mainProgram);
	}
	else if(boolGLTF || boolRbf){
		var normalData;
	switch(spectralNb){
	/*	case 0:
			normalData = new Uint8Array( textureData[0].normals0);
			break;
		case 1:
			normalData = textureData[0].normals1;
			break;
		case 2:
			normalData = textureData[0].normals2;
			break;
		case 3:
			normalData = textureData[0].normals3;
			break;
		case 4:
			normalData = textureData[0].normals4;
			break;
			*/
		case 5:
		 	normalData = new Uint8Array(textureData[0].hshNormals);
			break;
		case 6:
			normalData = new Uint8Array(textureData[0].ptmNormals);
			break;
		case 7:
			normalData = new Uint8Array(textureData[0].rbfNormals);
			break;
		default:
			normalData = new Uint8Array(textureData[0].normals0);
			break;

		}
		gl.bindTexture(gl.TEXTURE_2D, normalTex[0]);
		//if floatingpointtexturesupport
		//console.log(normalData);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, textureData[0].width,textureData[0].height,0, gl.RGBA, gl.UNSIGNED_BYTE, normalData);

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

		gl.bindTexture(gl.TEXTURE_2D, null);
	render(0);
	}
	else{

	if(boolMultiSpectral){

	var normalData;
	//floating point textures should be supported as of 2019 so this isn't needed anymore
/*	if(!floatingPointTextureSupport){ //takes some time, luckily only for small percentage of visits
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
		*/
switch(spectralNb){
	case 0:
		normalData = new Float32Array(textureData[0].normals0);
		break;
	case 1:
		normalData = new Float32Array(textureData[0].normals1);
		break;
	case 2:
		normalData = new Float32Array(textureData[0].normals2);
		break;
	case 3:
		normalData = new Float32Array(textureData[0].normals3);
		break;
	case 4:
		normalData = new Float32Array(textureData[0].normals4);
		break;
	default:
		normalData = new Float32Array(textureData[0].normals);
		break;

	}
	gl.bindTexture(gl.TEXTURE_2D, normalTex[0]);
	//if floatingpointtexturesupport
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, textureData[0].width,textureData[0].height,0, gl.RGB, gl.FLOAT, normalData);

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.bindTexture(gl.TEXTURE_2D, null);
render(0);
}
if(boolHsh && !boolGLTF){
	var normalData;


	normalData = new Float32Array(textureData[0].hshNormals);



	gl.bindTexture(gl.TEXTURE_2D, normalTex[0]);
	//if floatingpointtexturesupport
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, textureData[0].width,textureData[0].height,0, gl.RGB, gl.FLOAT, normalData);

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.bindTexture(gl.TEXTURE_2D, null);
render(0);
}
else if(boolPtm && !boolGLTF){
	var normalData;

	normalData = new Float32Array(textureData[0].ptmNormals);


	gl.bindTexture(gl.TEXTURE_2D, normalTex[0]);
	//if floatingpointtexturesupport
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, textureData[0].width,textureData[0].height,0, gl.RGB, gl.FLOAT, normalData);

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.bindTexture(gl.TEXTURE_2D, null);
render(0);
}
}

}

function updateTexture(gl, texture, url){
	gl.bindTexture(gl.TEXTURE_2D, texture);
	const level = 0;
	const internalFormat = gl.RGBA;
	const width = 1;
	const height = 1;
	const border = 0;
	const srcFormat = gl.RGBA;
	const srcType = gl.UNSIGNED_BYTE;
	const pixel = new Uint8Array([0, 0, 0, 0]);  //  black
	gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);
	const image = new Image();
	image.onload = function() {
		console.log( "loading image " + image.src + " with dimensions " + image.width + " x " + image.height );
	  gl.bindTexture(gl.TEXTURE_2D, texture);
	  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
					srcFormat, srcType, image);
	  // WebGL1 has different requirements for power of 2 images
	  // vs non power of 2 images so check if the image is a
	  // power of 2 in both dimensions.
	  if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
		 // Yes, it's a power of 2. Generate mips.
		 gl.generateMipmap(gl.TEXTURE_2D);
	  } else {
		 // No, it's not a power of 2. Turn off mips and set
		 // wrapping to clamp to edge
		 gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		 gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		 gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	  }
	  render(0);
	};
	image.src = url;
	//render(0);
}
// loads and returns a gl texture from an image url
function loadTexture(gl, url) {

	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);

	// Because images have to be download over the internet
	// they might take a moment until they are ready.
	// Until then put a single pixel in the texture so we can
	// use it immediately. When the image has finished downloading
	// we'll update the texture with the contents of the image.
	const level = 0;
	const internalFormat = gl.RGBA;
	const width = 1;
	const height = 1;
	const border = 0;
	const srcFormat = gl.RGBA;
	const srcType = gl.UNSIGNED_BYTE;
	const pixel = new Uint8Array([0, 0, 0, 0]);  //  black
	gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
				  width, height, border, srcFormat, srcType,
				  pixel);
  //console.log(url);
	const image = new Image();
	image.onload = function() {
		console.log( "loading image " + image.src + "  with dimensions " + image.width + " x " + image.height );
	  gl.bindTexture(gl.TEXTURE_2D, texture);
	  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
					srcFormat, srcType, image);

	  // WebGL1 has different requirements for power of 2 images
	  // vs non power of 2 images so check if the image is a
	  // power of 2 in both dimensions.
	  if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
		 // Yes, it's a power of 2. Generate mips.
		 gl.generateMipmap(gl.TEXTURE_2D);
	  } else {
		 // No, it's not a power of 2. Turn off mips and set
		 // wrapping to clamp to edge
		 gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		 gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		 gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	  }
	  render(0);
	};
	image.src = url;

	return texture;

}

function loadImage(url) {
	return new Promise(resolve => {
	  const image = new Image();
	  image.addEventListener('load', () => {
		resolve(image);
	  });
	  image.src = url;
	});
}

function Image2Uint8Array(image) {
  var tmpCanvas = document.createElement('canvas'),
	tmpCtx = tmpCanvas.getContext('2d');
	tmpCanvas.width = image.width;
	tmpCanvas.height = image.height;
	tmpCtx.drawImage(image,0,0);
	var imageData = tmpCtx.getImageData(0,0,image.width,image.height);
	var buf = imageData.data.buffer;
	return buf;
}

function isPowerOf2(value) {
	return (value & (value - 1)) == 0;
}

/*
* builds the texture plane, input: sideNr: front: 0, back: 1, bottom: 2, top: 3, left: 4, right: 5
*/
function buildSidePlane(sideNr){

	var maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
	if((textureData[sideNr].height > maxTextureSize || textureData[sideNr].width > maxTextureSize) && !boolScml){

$("#errorMessages").css("display","block");
				document.getElementById("errorMessages").innerHTML= "<h1>:-( Error</h1><h3>The dimensions of the file are too big.</h3><h3> Maximum texture dimension supported by this hardware: " +maxTextureSize + ". Texture dimensions: " +  textureData[sideNr].height + "x" + textureData[sideNr].width;
			abortExecution();
	}

	if(boolScml){

		console.log("BuildSidePlane: bool SCML");
		sidePlane[0] = null;
		sidePlane[0] = new ObjectPlane(0,200,200,1,singleFile.height/singleFile.width,0,0,singleFile.height,singleFile.width);
		singleFile.object = sidePlane[0];
		//console.log(singleFile.object);
		Scene.addObject(sidePlane[0]);
		var canvasWidthMinSidebar = canvasWidth - $('#rightAside').width();
	/*	if(singleFile.height/canvasHeight > singleFile.width/canvasWidthMinSidebar){
		  position = [0,0,-1/Math.tan(15/180*Math.PI)*(50*singleFile.height/singleFile.width)];
	    }else{
			position = [0,0,-1/Math.tan(15/180*Math.PI)*(50)/canvasWidthMinSidebar*canvasHeight];
		}*/


		scaleFactor[0] = 1;
		var xOff,yOff=0;
		var widthBack;
		widthBack=0;
		var widthLeft;
		widthLeft=0;
		var widthRight;
		widthRight=0;
		var heightBottom;
		heightBottom=0;
		var heightTop;
		heightTop=0;
		var heightFront = 50*textureData[0].height/textureData[0].width;
		if((heightFront+heightBottom+heightTop)>canvasHeight/canvasWidth*(widthBack+50+widthRight+widthLeft)){
			HOME= [-widthBack,0,-1/Math.tan(15/180*Math.PI)*(50*textureData[0].height/textureData[0].width+heightBottom+heightTop)];
		}
		else{
			HOME= [-widthBack,0,-1/Math.tan(15/180*Math.PI)*(1/canvasWidth*canvasHeight*(widthBack+50+widthRight+widthLeft))];
		}
		position = HOME.slice(0);
		changeSide(10);
	//	if(boolPhotometric){updateProgram(1);}
	//	else if(boolPtm){updateProgram(21);}
	//	else if(boolHsh){updateProgram(20);}
	//	else if(boolRbf){updateProgram(31);}
	}

	else if(boolGLTF || boolRbf ){

		scaleFactor[0] = 1;
		var xOff,yOff=0;
		var widthBack;
		widthBack=0;
		var widthLeft;
		widthLeft=0;
		var widthRight;
		widthRight=0;
		var heightBottom;
		heightBottom=0;
		var heightTop;
		heightTop=0;
		var heightFront = 50*textureData[0].height/textureData[0].width;
		if((heightFront+heightBottom+heightTop)>canvasHeight/canvasWidth*(widthBack+50+widthRight+widthLeft)){
			HOME= [-widthBack,0,-1/Math.tan(15/180*Math.PI)*(50*textureData[0].height/textureData[0].width+heightBottom+heightTop)];
		}
		else{
			HOME= [-widthBack,0,-1/Math.tan(15/180*Math.PI)*(1/canvasWidth*canvasHeight*(widthBack+50+widthRight+widthLeft))];
		}
		position = HOME.slice(0);
		offscreenRenderHeight = Math.round(((textureData[0]!== undefined)?textureData[0].height:0)+0*((textureData[1]!== undefined)?textureData[1].height:0)+((textureData[2]!== undefined)?textureData[2].height*scaleFactor[2]:0)+((textureData[3]!== undefined)?textureData[3].height*scaleFactor[3]:0));
		offscreenRenderWidth = Math.round(((textureData[4]!== undefined)?textureData[4].height*scaleFactor[4]:0)+((textureData[0]!== undefined)?textureData[0].width:0)+((textureData[5]!== undefined)?textureData[5].height*scaleFactor[5]:0)+((textureData[1]!== undefined)?textureData[1].width*scaleFactor[1]:0));
		offscreenRenderWidth = textureData[0].width*(1+((textureData[4]!== undefined)?1*scaleFactor[4]/*textureData[4].width/textureData[4].height*/:0)+((textureData[5]!== undefined)?1*scaleFactor[5]/*textureData[4].width/textureData[4].height*/:0)+((textureData[1]!== undefined)?1*scaleFactor[1]/*textureData[4].width/textureData[4].height*/:0));

		sidePlane[sideNr] = null;
	sidePlane[sideNr] = new ObjectPlane(sideNr,1000,1000,scaleFactor[sideNr],textureData[sideNr].height/textureData[sideNr].width,xOff,yOff,textureData[sideNr].height,textureData[sideNr].width);
	Scene.addObject(sidePlane[sideNr]);
	console.log("added side "+sideNr);
	changeSide(10);
  if(!boolRbf){
	normalTex[0] = loadTexture(gl, glTFObj.filename + glTFObj.pld[0].normalTex);
	albedoTex[0] = loadTexture(gl, glTFObj.filename + glTFObj.pld[0].albTex);

	loadImage(glTFObj.filename + glTFObj.pld[0].normalTex).then(normalImage => {
		textureData[0].normals0 = Image2Uint8Array(normalImage);
	  });

	  if(glTFObj.pld[0].depthTex){
		  boolDepthMap = true;
		loadImage(glTFObj.filename + glTFObj.pld[0].depthTex).then(depthImage => {
			textureData[0].depth = Image2Uint8Array(depthImage);
		  });
		  disTex[0] = loadTexture(gl, glTFObj.filename + glTFObj.pld[0].depthTex);

	  }
	if(glTFObj.hsh){
	  loadImage(glTFObj.filename + glTFObj.hsh[0].normalTex).then(normalImage => {
		textureData[0].hshNormals = Image2Uint8Array(normalImage);
	});
	hshTex[0] = loadTexture(gl, glTFObj.filename + glTFObj.hsh[0].hshCoef0[0].path);
	hshTex[1] = loadTexture(gl, glTFObj.filename + glTFObj.hsh[0].hshCoef1[0].path);
	hshTex[2] = loadTexture(gl, glTFObj.filename + glTFObj.hsh[0].hshCoef2[0].path);
	hshTex[3] = loadTexture(gl, glTFObj.filename + glTFObj.hsh[0].hshCoef3[0].path);
	}
	if(glTFObj.ptm){
		ptmTex[0] = loadTexture(gl, glTFObj.filename + glTFObj.ptm[0].ptmCoef0[0].path);
		ptmTex[1] = loadTexture(gl, glTFObj.filename + glTFObj.ptm[0].ptmCoef1[0].path);
		ptmTex[2] = loadTexture(gl, glTFObj.filename + glTFObj.ptm[0].ptmCoefRGB[0].path);
		loadImage(glTFObj.filename + glTFObj.ptm[0].normalTex).then(normalImage => {
			textureData[0].ptmNormals = Image2Uint8Array(normalImage);
		});
	}
  }
  else{//boolRbf
		var url = relightObj.filename;
    rbfTex[0] =  loadTexture(gl, url.substring(0,url.lastIndexOf('/')+1)+"plane_0.jpg");
    rbfTex[1] =  loadTexture(gl, url.substring(0,url.lastIndexOf('/')+1)+"plane_1.jpg");
    rbfTex[2] =  loadTexture(gl, url.substring(0,url.lastIndexOf('/')+1)+"plane_2.jpg");
    rbfTex[3] =  loadTexture(gl, url.substring(0,url.lastIndexOf('/')+1)+"plane_3.jpg");
    rbfTex[4] =  loadTexture(gl, url.substring(0,url.lastIndexOf('/')+1)+"plane_4.jpg");
    rbfTex[5] =  loadTexture(gl, url.substring(0,url.lastIndexOf('/')+1)+"plane_5.jpg");

  //to do: check whether maps exist
	normalTex[0] = loadTexture(gl, url.substring(0,url.lastIndexOf('/')+1)+"normals.png");
	loadImage(url.substring(0,url.lastIndexOf('/')+1)+"normals.png").then(normalImage => {
		textureData[0].rbfNormals = Image2Uint8Array(normalImage);
	});
  ambientTex[0] = loadTexture(gl, url.substring(0,url.lastIndexOf('/')+1)+"means.png");
	loadImage(url.substring(0,url.lastIndexOf('/')+1)+"means.png").then(ambientImage => {
		textureData[0].rbfAmbient = Image2Uint8Array(ambientImage);
	});
  }
}
else{

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
	/*if(boolDepthMap){
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
*/
	if(textureData[sideNr].ambient){
	  useAmbient = true;
	  ambientTex[sideNr] = gl.createTexture();
	  var ambientData = new Uint8Array(textureData[sideNr].ambient);
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

	if(boolMultiSpectral){
		albedo2Tex[sideNr] = gl.createTexture();
		var albedo2Data = new Uint8Array(textureData[sideNr].albedo1);
		gl.bindTexture(gl.TEXTURE_2D, albedo2Tex[sideNr]);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, textureData[sideNr].width,textureData[sideNr].height,0, gl.RGBA, gl.UNSIGNED_BYTE, albedo2Data);
		//gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, textureIMG);
		//gl.generateMipmap(gl.TEXTURE_2D);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.bindTexture(gl.TEXTURE_2D, null);

		if(textureData[sideNr].ambient1){
		ambient2Tex[sideNr] = gl.createTexture();
		var ambient2Data = new Uint8Array(textureData[sideNr].ambient1);
		gl.bindTexture(gl.TEXTURE_2D, ambient2Tex[sideNr]);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, textureData[sideNr].width,textureData[sideNr].height,0, gl.RGBA, gl.UNSIGNED_BYTE, ambient2Data);
		//gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, textureIMG);
		//gl.generateMipmap(gl.TEXTURE_2D);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}

	if(boolHsh){
		console.log("boolHsh");
		for(var i = 0; i<4; i++){
		hshTex[i] = gl.createTexture();
		//var hshData = new Uint8Array(textureData[0].hshCoef0);

		gl.bindTexture(gl.TEXTURE_2D, hshTex[i]);
		if(!floatingPointTextureSupport){
			//gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, textureData[sideNr].width,textureData[sideNr].height,0, gl.RGBA, gl.UNSIGNED_BYTE, hshData);
		}
		else{
			var hshData;
			switch(i){
				case 0: hshData = new Float32Array(textureData[0].hshCoef0);break;
				case 1: hshData = new Float32Array(textureData[0].hshCoef1);break;
				case 2: hshData = new Float32Array(textureData[0].hshCoef2);	break;
				case 3: hshData = new Float32Array(textureData[0].hshCoef3);	break;
			}
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, textureData[sideNr].width,textureData[sideNr].height,0, gl.RGB, gl.FLOAT, hshData);

		}
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
	}
	if(boolPtm){
		console.log("Loading Ptm textures");
		for(var i = 0; i<3; i++){
		ptmTex[i] = gl.createTexture();
		//var hshData = new Uint8Array(textureData[0].hshCoef0);

		gl.bindTexture(gl.TEXTURE_2D, ptmTex[i]);
		if(!floatingPointTextureSupport){
			//gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, textureData[sideNr].width,textureData[sideNr].height,0, gl.RGBA, gl.UNSIGNED_BYTE, hshData);
		}
		else{
			var ptmData;
			switch(i){
				case 0: ptmData = new Float32Array(textureData[0].ptmCoeff0);break;
				case 1: ptmData = new Float32Array(textureData[0].ptmCoeff1);break;
				case 2: ptmData = new Float32Array(textureData[0].ptmRgbCoeff);	break;
			}
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, textureData[sideNr].width,textureData[sideNr].height,0, gl.RGB, gl.FLOAT, ptmData);

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
}
/*
* changes the old net to a new net, depending on which side has to be in the middle
*/
function changeSide(direction){//0 1 2 3 up bottom left right key
	//6 constellations			main: front: 0 back: 1 bottom: 2 top: 3 left: 4 right: 5
	//check which side is new main side
	switch(mainSide){
		case 0:
			if(direction==0){if(textureData[3]!== undefined){mainSide=3;}else if(textureData[1]!== undefined){mainSide=1;}}
			else if(direction==1){if(textureData[2]!== undefined){mainSide=2;}else if(textureData[1]!== undefined){mainSide=1;}}
			else if(direction==2){if(textureData[4]!== undefined){mainSide=4;}else if(textureData[1]!== undefined){mainSide=1;}}
			else if(direction==3){if(textureData[5]!== undefined){mainSide=5;}else if(textureData[1]!== undefined){mainSide=1;}}
			break;
		case 1:
			if(direction==0){if(textureData[2]!== undefined){mainSide=2;}else if(textureData[1]!== undefined){mainSide=0;}}
			else if(direction==1){if(textureData[3]!== undefined){mainSide=3;}else if(textureData[1]!== undefined){mainSide=0;}}
			else if(direction==2){if(textureData[5]!== undefined){mainSide=5;}else if(textureData[1]!== undefined){mainSide=0;}}
			else if(direction==3){if(textureData[4]!== undefined){mainSide=4;}else if(textureData[1]!== undefined){mainSide=0;}}
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
	//console.log("mainside: " + mainSide);
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
						if(textureData[2]!=undefined){object.zRotation = 180;}
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
						distance = (50*textureData[1].height/textureData[1].width*scaleFactor[1]+((textureData[2]!== undefined)?100*textureData[2].height/textureData[2].width*scaleFactor[2]:1)+50*textureData[0].height/textureData[0].width);
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



function updateProgram(prgName){
	if(!gl){return;}

mainPrg = eval("prg_" + prgName);
mainProgram = eval("program_" + prgName);

if(boolScml && singleFile){
	singleFile.onShaderChange(mainProgram);
}
	//console.log(mainProgram);
	render(0);
	console.log("program: "+prgName);
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


		var ddd7 = new Date().getTime();

console.log((ddd7-ddd6));
return img;
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
	//dddd1 = new Date().getTime();
	//setTimeout(animateTest2,1000/60);
	timeoutid = window.requestAnimationFrame(animateTest2);

lightDirection0[0]=Math.cos(timeVar);
lightDirection0[1]=Math.sin(timeVar);
lightDirection0[2]=0.1;
timeVar += 0.03;
render(0);
//dddd2 = new Date().getTime();
//console.log((dddd2-dddd1));
}
function animateM(n){
	lightDirection0[0]=Math.cos(n*Math.PI);
	lightDirection0[1]=Math.sin(n*Math.PI);
	lightDirection0[2]=0.1;
	render(0);
	takeScreenshot();
}

/*
* the main render function. called whenever scene needs to be updated. s==0: render in regular canvas, s==1: render to offscreen framebuffer
* main idea: for each object in scene: update matrices, lightdirection and scene
*/
function render(s) {
//renderTime0 = new Date().getTime();
//console.log("render");
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
				gl.useProgram(prg_pld_default_color);
				curProgram = program_pld_default_color;
				curPrg = prg_pld_default_color;
			}

			var renderPosition = position.slice(0);
			renderPosition[0]+=object.xOff;
			renderPosition[1]+=object.yOff;
			object.position = renderPosition;
			var renderRotation = rotation.slice(0);
			renderRotation[2]+=object.zRotation;
			if(object.isMiddle==true){
				object.lightDirection0 = lightDirection0.slice(0);
				object.lightDirection1 = lightDirection1.slice(0);
				object.param = param;
				//console.log(param);
				//object.param1 = param1;
				//object.param2 = param2;
				//object.param3 = param3;
				object.lightIntensity0 = lightIntensity0;
				object.lightIntensity1 = lightIntensity1;
			}

		//	gl.uniform1fv(curProgram.gkernels, kerneltest);

			if(s==1){
				mat4.perspective(30*piDev180, offscreenRenderWidth/offscreenRenderHeight, 1, 10000.0, pMatrix);
			}
			else{
				mat4.perspective(30*piDev180, canvasWidth / canvasHeight, 1, 10000.0, pMatrix);  // We can resize the screen at any point so the perspective matrix should be updated always.
			}
			mat4.identity(mvMatrix);
			mat4.set(mvMatrix,mvMatrixCopy);

			if(object.type=="sidePlane"){

				if(s==1){
					mat4.translate(mvMatrix, [HOME[0]+object.xOff,HOME[1]+object.yOff,HOME[2]]);
					//renderRotation[2] -= rotation[2];
				}
				else{
					mat4.translate(mvMatrix, renderPosition);
				}
				mat4.rotateX(mvMatrix,renderRotation[0]*piDev180);
				mat4.rotateY(mvMatrix,renderRotation[1]*piDev180);
				mat4.rotateZ(mvMatrix,renderRotation[2]*piDev180);
				mat4.rotateX(nMatrix,renderRotation[0]*piDev180);
				mat4.rotateY(nMatrix,renderRotation[1]*piDev180);
				mat4.rotateZ(nMatrix,renderRotation[2]*piDev180);
				var reflMatrix = mat4.identity(reflMatrix);
				reflMatrix[0] = reflectPosition;
				//console.log(reflMatrix);
				mat4.multiply(mvMatrix, reflMatrix, mvMatrix);
			}


			if(object.id=="objectLight0"){
				var zdisp = 5;
				mat4.translate(mvMatrix, [lightDirection0[0]*tan15*zdisp*canvasWidth / canvasHeight/lightEllipseFactor,lightDirection0[1]*Math.tan(15/180*Math.PI)*zdisp/lightEllipseFactor,-zdisp]);
				mat4.rotateY(mvMatrix,-Math.acos(lightDirection0[0])-lightDirection0[0]*30*piDev180+Math.PI/2);
				mat4.rotateX(mvMatrix,Math.acos(lightDirection0[1])+lightDirection0[1]*30*piDev180/canvasWidth*canvasHeight-Math.PI/2);
			}

			if(object.id=="objectLight1"){
				var zdisp = 5;
				mat4.translate(mvMatrix, [lightDirection1[0]*tan15*zdisp*canvasWidth / canvasHeight/lightEllipseFactor,lightDirection1[1]*Math.tan(15/180*Math.PI)*zdisp/lightEllipseFactor,-zdisp]);
				mat4.rotateY(mvMatrix,-Math.acos(lightDirection1[0])-lightDirection1[0]*30*piDev180+Math.PI/2);
				mat4.rotateX(mvMatrix,Math.acos(lightDirection1[1])+lightDirection1[1]*30*piDev180/canvasWidth*canvasHeight-Math.PI/2);
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
			gl.uniform1f(curProgram.uBoolFloatTexture, boolFloatTexture);
			gl.uniform1f(curProgram.uBoolScml, boolScml);
			gl.uniform3fv(curProgram.reflectanceChannelMix, reflectanceChannelMix);
			//gl.uniform1f(curProgram.normalSource, normalSource);
			gl.uniform3fv(curProgram.uScalePTM0, vec3ScalePTM0);
			gl.uniform3fv(curProgram.uBiasPTM0, vec3BiasPTM0);
			gl.uniform3fv(curProgram.uScalePTM1, vec3ScalePTM1);
			gl.uniform3fv(curProgram.uBiasPTM1, vec3BiasPTM1);
			gl.uniform4fv(curProgram.uScaleHSH, vec4ScaleHSH);
			gl.uniform4fv(curProgram.uBiasHSH, vec4BiasHSH);

			//if(moving){
			//	gl.uniform1f(curProgram.uParam0, 0.1);
			//	gl.uniform1f(curProgram.uParam1, 0);
			//}
			//else{
				//console.log(object.param);
				//console.log(param);
				gl.uniform1fv(curProgram.uParam, object.param);
				//gl.uniform1f(curProgram.uParam1, object.param1);
				//gl.uniform1f(curProgram.uParam2, object.param2);
				//gl.uniform1f(curProgram.uParam3, object.param3);
			//}
			mat4.set(mvMatrixCopy,mvMatrix); //switch back to old mvMatrix

			gl.bindBuffer(gl.ARRAY_BUFFER, object.vbo);
			gl.enableVertexAttribArray(0);
			gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
			gl.bindBuffer(gl.ARRAY_BUFFER, null);
			//console.log( "VBO SIZE: "+gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE));

			//if(object.id=="objectLight0" && boolLightToggle()){gl.uniform4fv(curProgram.uMaterialAmbient, [1.0, 1.0, 0, 1.0]);}
			//else if(object.id=="objectLight1"){gl.uniform4fv(curProgram.uMaterialAmbient, [1.0, 1.0, 0, 1.0]);}
			if(object.type!="lightCone"){gl.uniform4fv(curProgram.uMaterialAmbient, [0, 0, 0, 0]);}
			
			gl.bindBuffer(gl.ARRAY_BUFFER, object.tbo);
			gl.enableVertexAttribArray(1);
			gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
			gl.bindBuffer(gl.ARRAY_BUFFER, null);

			if (object.id!="objectLight0" && object.id!="objectLight1"){

			if(!boolScml){
				gl.uniform4fv(curProgram.uMaterialAmbient, [66666666.0,0.0,0.0, 1.0]);
				gl.uniform2fv(curProgram.uImgDim, [textureData[object.id].width,textureData[object.id].height]);
				gl.uniform1f(curProgram.uBoolDepthMap, boolDepthMap);
				if(boolDepthMap){
					gl.activeTexture(gl.TEXTURE0);
					gl.bindTexture(gl.TEXTURE_2D, disTex[object.id]);
					gl.uniform1i(curProgram.uDispSampler, 0);
				}
				if(boolPhotometric){
					gl.activeTexture(gl.TEXTURE1);
					gl.bindTexture(gl.TEXTURE_2D, normalTex[object.id]);
					//console.log(normalTex[object.id]);
					gl.uniform1i(curProgram.uNormalSampler, 1);
				}
				if(useAmbient && boolPhotometric){
					gl.activeTexture(gl.TEXTURE2);
					gl.bindTexture(gl.TEXTURE_2D, ambientTex[object.id]);
					gl.uniform1i(curProgram.uAlbedoSampler, 2);
				}
				else if (boolPhotometric){
					gl.activeTexture(gl.TEXTURE2);
					gl.bindTexture(gl.TEXTURE_2D, albedoTex[object.id]);
					gl.uniform1i(curProgram.uAlbedoSampler, 2);
				}

				if (boolMultiSpectral){
					gl.activeTexture(gl.TEXTURE3);
					gl.bindTexture(gl.TEXTURE_2D, albedo2Tex[object.id]);
					gl.uniform1i(curProgram.uAlbedo2Sampler, 3);
				}
				if (boolMultiSpectral && useAmbient){
					gl.activeTexture(gl.TEXTURE3);
					gl.bindTexture(gl.TEXTURE_2D, ambient2Tex[object.id]);
					gl.uniform1i(curProgram.uAlbedo2Sampler, 3);
				}

				if(boolHsh){
					gl.activeTexture(gl.TEXTURE11);
					gl.bindTexture(gl.TEXTURE_2D, hshTex[0]);
					gl.uniform1i(curProgram.hshCoeff0Tex, 11);

					gl.activeTexture(gl.TEXTURE12);
					gl.bindTexture(gl.TEXTURE_2D, hshTex[1]);
					gl.uniform1i(curProgram.hshCoeff1Tex, 12);

					gl.activeTexture(gl.TEXTURE13);
					gl.bindTexture(gl.TEXTURE_2D, hshTex[2]);
					gl.uniform1i(curProgram.hshCoeff2Tex, 13);

					gl.activeTexture(gl.TEXTURE14);
					gl.bindTexture(gl.TEXTURE_2D, hshTex[3]);
					gl.uniform1i(curProgram.hshCoeff3Tex, 14);
				}
				if(boolRbf){
					relightObj.computeLightWeightsRbf(lightDirection0);

					gl.uniform3fv(curProgram.rbfBase, relightObj.lweights);
					gl.uniform1fv(curProgram.rbfBias, relightObj.bias);
					gl.uniform1fv(curProgram.rbfScale, relightObj.factor);

          			gl.activeTexture(gl.TEXTURE11);
          			gl.bindTexture(gl.TEXTURE_2D, rbfTex[0]);
          			gl.uniform1i(curProgram.rbfCoeff0Tex, 11);

          			gl.activeTexture(gl.TEXTURE12);
          			gl.bindTexture(gl.TEXTURE_2D, rbfTex[1]);
          			gl.uniform1i(curProgram.rbfCoeff1Tex, 12);

          			gl.activeTexture(gl.TEXTURE13);
          			gl.bindTexture(gl.TEXTURE_2D, rbfTex[2]);
          			gl.uniform1i(curProgram.rbfCoeff2Tex, 13);

          			gl.activeTexture(gl.TEXTURE14);
          			gl.bindTexture(gl.TEXTURE_2D, rbfTex[3]);
         			gl.uniform1i(curProgram.rbfCoeff3Tex, 14);

       				gl.activeTexture(gl.TEXTURE8);
          			gl.bindTexture(gl.TEXTURE_2D, rbfTex[4]);
          			gl.uniform1i(curProgram.rbfCoeff4Tex, 8);

          			gl.activeTexture(gl.TEXTURE9);
          			gl.bindTexture(gl.TEXTURE_2D, rbfTex[5]);
          			gl.uniform1i(curProgram.rbfCoeff5Tex, 9);

				}
			    if(boolPtm){
					gl.activeTexture(gl.TEXTURE8);
					gl.bindTexture(gl.TEXTURE_2D, ptmTex[0]);
					gl.uniform1i(curProgram.ptmCoeff0Tex, 8);

					gl.activeTexture(gl.TEXTURE9);
					gl.bindTexture(gl.TEXTURE_2D, ptmTex[1]);
					gl.uniform1i(curProgram.ptmCoeff1Tex, 9);

					gl.activeTexture(gl.TEXTURE10);
					gl.bindTexture(gl.TEXTURE_2D, ptmTex[2]);
					gl.uniform1i(curProgram.ptmRgbCoeffTex, 10);
				}
			}
			else if(boolScml && singleFile.object){
				singleFile.neededTexturePlanes(curProgram);
				if(singleFile.boolHsh || singleFile.boolRbf || singleFile.boolPtm){
					singleFile.computeLightWeights(lightDirection0);
					singleFile.lweights0 = singleFile.lweights;
					singleFile.computeLightWeights(lightDirection1);
					singleFile.lweights1 = singleFile.lweights;
				}
				if(singleFile.layout=="image"){
					gl.uniform2fv(curProgram.uImgDim, [singleFile.width, singleFile.height]);
				} else{ 
					gl.uniform2fv(curProgram.uImgDim, [singleFile.tilesize, singleFile.tilesize	]);
				}
				gl.uniform2fv(curProgram.uImgDim, [singleFile.width,singleFile.height]);
				gl.uniform1f(curProgram.uTextureLevel, singleFile.textureScale);

				//console.log(singleFile.width + " "+ singleFile.height);
				singleFile.prefetch();
				
				singleFile.draw(position, object, curProgram, canvasHeight, canvasWidth);
				//console.log(singleFile.object.lightDirection0);
				//console.log(object.lightDirection0);
				//console.log(lightDirection0);
			
			}
		}

			else{
				gl.uniform1f(curProgram.uBoolDepthMap, false);
			}
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.ibo);
			if((object.type=="lightCone")&& boolLightToggle() && s==0 /*&&(mainPrg != prg2 || mainPrg != prg2 )*/){

				if(object.id=="objectLight0"){gl.uniform4fv(curProgram.uMaterialAmbient, lightColor0);} //[lightIntensity0/10+0.1, lightIntensity0/10+0.1,lightIntensity0/20, 1.0]);}
				if(object.id=="objectLight1"){gl.uniform4fv(curProgram.uMaterialAmbient, lightColor1);} //[lightIntensity1/10+0.1, lightIntensity1/10+0.1,lightIntensity1/20, 1.0]);}

				gl.drawElements(gl.TRIANGLES, object.indices.length, gl.UNSIGNED_INT,0);
				gl.uniform4fv(curProgram.uMaterialAmbient, [1.0,1.0,1.0, 1.0]);
				gl.drawElements(gl.LINE_STRIP, object.indices.length, gl.UNSIGNED_INT,0);
            }
            if(object.type=="sidePlane" && !boolScml){gl.drawElements(gl.TRIANGLES, object.indices.length, gl.UNSIGNED_INT,0);}
			gl.bindBuffer(gl.ARRAY_BUFFER, null);
         gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        }
//gl.finish(); // waiting for the program to have finished this draw call. performance trick, should be investigated further: some claim this actually make it worse due to context switch from gpu to cpu, but test indicated slow shaders worked better with this


    }
    catch(err){
        alert(err);
        console.error(err);
	}
	//renderTime1 = new Date().getTime();
//console.log((renderTime1-renderTime0));
}
