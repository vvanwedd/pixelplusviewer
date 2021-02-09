// global variables
var bytePointer = 0;
// metadata
var timePeriodId = 0;
var genreId = 0;
var mediumId = 0;
var sealId = 0;
var width = 0;
var height = 0;
var thickness = 0;
var mWidth = 0;
var mHeight = 0;
var databaseNumber = "";
var collectionNumber = "";
var publicationNumber = "";
var siteProvenance = "";
var relativeDate = "";
var publicationInfo = "";
var description = "";
var notes = "";
var inputFilename= '';
var inputType = "";
var inputDimensions = "";
var creator = "";
var creationDate = "";
var copyright = "";
var mMmPerPixel;

var metadataObj;
var glTFObj;
var relightObj;

var mData = 0;
var minValue = 0;
var maxValue = 0;

var textureData = new Array(); //to pass data to webgl program
var worker = new Array(); //not necessary anymore when only using 1 worker
var dd1; //to store timing

var boolHasAmbient = new Array(6);
var allMapsReady = false;
var startPointer = new Array();
var beginPointer;
var endPos = new Array(6);


var vec3ScalePTM0 = [1.0, 1.0, 1.0];
var vec3ScalePTM1 = [1.0, 1.0, 1.0];
var vec3BiasPTM0 = [0.0, 0.0, 0.0];
var vec3BiasPTM1 = [0.0, 0.0, 0.0];

var vec4ScaleHSH = [1.0, 1.0, 1.0, 1.0];
var vec4BiasHSH = [0.0, 0.0, 0.0, 0.0];


var boolHsh = false;
var boolPhotometric = false;
var boolMultiSpectral = false;
var boolPtm = false;
var boolGLTF = false;
var boolRbf = false;
var boolScml = false;
var dsType = "";
var boolDepthMap = false;

var boolZRotation = false;
var pZRotation = 0;

var singleFile;
var fileLength = 0;

function initViewerParameters(){
  boolZRotation = false;
}


function loadDataSource(datasource, dataType){
  $("#mainIntro").css("display","none");
  $("#progressIndicator").css("display","block");
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.open('GET', decodeURIComponent(datasource), true);
  xhr.responseType = 'arraybuffer';
  xhr.onloadstart = function(e) {
    document.getElementById('progressbar').className = 'loading';
  };
  xhr.onload = function(e) {
	if (xhr.readyState == 4 && xhr.status === 200) {
    progress.style.width = '100%';
    progress.textContent = '100%';
    fileLength = this.response.byteLength;
	loadFileWrapper(this.response, datasource, dataType);
	} else if (xhr.status === 404){
		setProgressText(false, "Error 404: The selected file could not be found. Redirecting to <a href=\"http://www.heritage-visualisation.org\"> www.heritage-visualisation.org</a>." , true);
		abortExecution();
	}
  };
  xhr.onerror = errorHandler;
  xhr.onprogress = updateProgress;
  xhr.send();
}

function parseURL(){
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	if(urlParams.has('ds')){
  $("#mainIntro").css("display","none");
  $("#progressIndicator").css("display","block");
  displayRightAside(true);
  initViewerParameters();


  
	var dsType = "dsType";
	const dataSource = urlParams.get('ds');
	if(urlParams.has('type')){
		dsType = urlParams.get('type').toLowerCase(); 
	} else{
		dsType = dataSource.substring(dataSource.lastIndexOf('.') + 1).toLowerCase();
	}

	setProgressText(true, "Loading " + dsType + " datasource from URL " + dataSource + " ..." , false);

	if(dsType  === 'scml' || dsType === 'zip'){
		loadSingleFileScml(dataSource);
	}
	else if(dataSource.toLowerCase().endsWith('.zip') || dataSource.toLowerCase().endsWith('.scml')){ 
		loadSingleFileScml(dataSource);
	}
	else{
		loadDataSource(dataSource, dsType);
	}
  
  if(urlParams.has('zrotation')){
    boolZRotation = true;
    pZRotation = parseFloat(urlParams.get('zrotation'));
  }
}
}
$(document).ready(function(){
  parseURL();
});

var reader;
function errorHandler(evt) {
    if(evt.target.error){
    switch(evt.target.error.code) {
      case evt.target.error.NOT_FOUND_ERR:
        //$("#loader").css("display","none");
		//$("#errorMessages").css("display","block");
		//document.getElementById("errorMessages").innerHTML= "<h1>:-( Error</h1><h3>The file could not be found. </h3>";
		setProgressText(false, "Error: The requested file could not be found." , true);
        break;
      case evt.target.error.NOT_READABLE_ERR:
        //$("#loader").css("display","none");
		//$("#errorMessages").css("display","block");
		//document.getElementById("errorMessages").innerHTML= "<h1>:-( Error</h1><h3>The file is not readable. </h3>";
		setProgressText(false, "Error: The requested file is not readable." , true);

        break;
      case evt.target.error.ABORT_ERR:
        break; // noop
      default:
        //$("#loader").css("display","none");
		//$("#errorMessages").css("display","block");
		//document.getElementById("errorMessages").innerHTML= "<h1>:-( Error</h1><h3>The was an error reading the selected file. </h3>";
		setProgressText(false, "Error reading the selected file." , true);
        break;
    };
    }else{
                setProgressText(false, "Error reading the selected file. Possible CORS issue, see web console (ctrl+shift+k or ctrl+shift+i)" , true);
    }
  }

var progress = document.querySelector('.percent');

function updateProgress(evt) {
    // evt is an ProgressEvent.
    if (evt.lengthComputable) {
      var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
      // Increase the progress bar length.
      if (percentLoaded < 100) {
        progress.style.width = percentLoaded + '%';
        progress.textContent = percentLoaded + '%';
      }
    }
  }

function handleFileSelect(evt) {
    // Reset progress indicator on new file selection.
	$("#mainIntro").css("display","none");
	$("#progressIndicator").css("display","block");
  initViewerParameters();
window.history.pushState("object or string", "Title", "/ppv/");
  reader = new FileReader();
    reader.onerror = errorHandler;
    reader.onprogress = updateProgress;
    reader.onabort = function(e) {
	  alert('File read cancelled');
	  abortExecution();
    };
    reader.onloadstart = function(e) {
      document.getElementById('progressbar').className = 'loading';
    };
    reader.onload = function(e) {
		progress.style.width = '100%';
		progress.textContent = '100%';
		bytePointer = 0;

		//initParser();
		var nm = evt.target.files[0].name;
		var ext = nm.substr(nm.lastIndexOf('.') + 1).toLowerCase();
		loadFileWrapper(e.target.result, nm, ext);
    }

    reader.readAsArrayBuffer(evt.target.files[0]);
  }


document.getElementById('fileinput').addEventListener('change', handleFileSelect, false);

function loadFileWrapper(arrayBuffer, filename, dataType){
//	inputFilename = filename;
 if(dataType == 'cun' || dataType == 'zun' ){
	 console.log('Loading PLD file... ');
	 loadFile(arrayBuffer);
 }
 else if (dataType == 'rti'){
	console.log('Loading RTI file... ');
	loadFileRTI(arrayBuffer);
 }
 else if (dataType == 'ptm'){
	console.log('Loading PTM file... ');
	loadFilePTM(arrayBuffer);
 }
 else if (dataType == 'gltf'){
	console.log('Loading glTF file... ');
	loadFileGLTF(arrayBuffer, filename);
 }
 else if (dataType == 'json'){
	console.log('Loading RELIGHT RTI file... ');
	loadFileRelight(arrayBuffer, filename);
 }
 else if (dataType == 'scml'){
	console.log('Loading SCML file... ');
	loadLocalSingleFileScml(arrayBuffer, filename);
 }

 else{
	// $("#loader").css("display","none");
    //   $("#errorMessages").css("display","block");
    //   document.getElementById("errorMessages").innerHTML= "<h1>:-( Error</h1><h3>The requested file type is not supported. Redirecting to <a href=\"http://www.heritage-visualisation.org\"> www.heritage-visualisation.org</a>.</h3>";
	setProgressText(false, "Error: The requested file type is not supported. Redirecting to <a href=\"http://www.heritage-visualisation.org\"> www.heritage-visualisation.org</a>." , true);

	abortExecution();


 }

}

function readTillNewLine (inputBuffer) {
	let str = ''
	while (true) {
			if (inputBuffer.currentIndex >= inputBuffer.buffer.length)
					throw new Error('Reached end of file before newline')
			let next = String.fromCharCode.apply(null, new Uint8Array(inputBuffer.buffer,inputBuffer.currentIndex,1));
			inputBuffer.currentIndex += 1;
			//(inputBuffer[currentIndex++])

			if (next !== '\n')
					str += next
			else
					break
	}
	return str
}
function updateShaderList(){

	if(boolHsh){
		$('#lhsh_default_color').button( "enable");
		//$('#lhsh_spec_enh').button( "enable");
		$('#lhsh_sharpen_nor').button( "disable");
		$('#lhsh_sharpen_hsh').button( "disable");
		if(boolPhotometric){$('#lhsh_spec_enh').button( "enable");}
		else{$('#lhsh_spec_enh').button( "disable");}
	}
	else{
		$('#lhsh_default_color').button( "disable");
		$('#lhsh_sharpen_hsh').button( "disable");
		$('#lhsh_sharpen_nor').button( "disable");
		$('#lhsh_spec_enh').button( "disable");
	}
	if(boolHasAmbient[0]){
		$('#ambPLD').button( "enable");
		useAmbient = true;
	}
	else{
		$('#ambPLD').button( "disable");
	}
	if(boolPhotometric){
		$('#lpld_default_color').button( "enable");
		$('#lpld_color_specular').button( "enable");
		$('#lpld_sharpen_refl').button( "enable");
		$('#lpld_sharpen_nor').button( "enable");
		$('#lpld_shaded').button( "enable");
		$('#lpld_shaded_exag').button( "enable");
		$('#lpld_sketch1').button( "enable");
		$('#lpld_sketch2').button( "enable");
		$('#lpld_curvature1').button( "enable");
		$('#lnormals').button( "enable");
		$('#lrefl').button( "enable");
		$('#lpld_curvature2').button( "enable");
	}
	else{
		$('#lpld_default_color').button( "disable");
		$('#lpld_color_specular').button( "disable");
		$('#lpld_sharpen_refl').button( "disable");
		$('#lpld_sharpen_nor').button( "disable");
		$('#lpld_shaded').button( "disable");
		$('#lpld_shaded_exag').button( "disable");
		$('#lpld_sketch1').button( "disable");
		$('#lpld_sketch2').button( "disable");
		$('#lpld_curvature1').button( "disable");
		$('#lnormals').button( "disable");
		$('#lrefl').button( "disable");
		$('#lpld_curvature2').button( "disable");
	}
	if(boolPtm){
		$('#lptm_default_color').button( "enable");
		if(boolPhotometric){$('#lptm_spec_enh').button( "enable");}
	}
	else{
		$('#lptm_default_color').button( "disable");
		$('#lptm_spec_enh').button( "disable");
	}
	if(boolRbf){
    $('#lrbf_default_color').button( "enable");
    if(boolPhotometric){$('#lrbf_spec_enh').button( "enable");}
    $("#ambPLD").button({enabled:true});
    $('#ambPLD').button( "enable");
    $('#albPLD').button( "disable");
    $("#albPLD").button({disabled:true});
    useAmbient = true;
	}
	else{
        $('#lrbf_default_color').button( "disable");
        $('#lrbf_spec_enh').button( "disable");
	}
}
function ab2str(buf){
return String.fromCharCode.apply(null, new Uint8Array(buf));

}
function loadFileRelight(arrayBuffer,filename){
  $("#progressIndicator").css("display","none");
  $("#loader").css("display","block");
  $("#radiosetIntro").css("display","none");

  boolFloatTexture = false;
  boolHsh = false;
  boolPhotometric = true; // only when normal map is available, should check
  boolMultiSpectral = false;
  boolPtm = false;
  boolGLTF = false;
  boolRbf = true;
  boolScml = false;

  relightObj = new Relight();
  relightObj.parseJSON(ab2str(arrayBuffer));
  relightObj.loadFactorAndBias();
  relightObj.loadBasis(relightObj.infobasis);
  relightObj.computeLightWeights(lightDirection0);

  relightObj.filename = filename;
  textureData.length = 0;
  var sideData = new Object();
  sideData.width = relightObj.width;
  sideData.height = relightObj.height;

  textureData.push(sideData);
  runWebGL();
  updateShaderList();
  updateProgram("rbf_default_color");
  $('#lrbf_default_color').trigger("click");

}

function loadFileSCML(arrayBuffer,filename){
	$("#progressIndicator").css("display","none");
	$("#loader").css("display","block");
	$("#radiosetIntro").css("display","none");
  
	boolFloatTexture = false;
	boolHsh = false;
	boolPhotometric = true; // only when normal map is available, should check
	boolMultiSpectral = false;
	boolPtm = false;
	boolGLTF = false;
	boolRbf = false;
    boolScml = true;
	dsType = "SCML";

	scmlObj = new SCML();
	scmlObj.parseJSON(ab2str(arrayBuffer));
	//relightObj.loadFactorAndBias();
	//relightObj.loadBasis(relightObj.infobasis);
	//relightObj.computeLightWeights(lightDirection0);
  
	scmlObj.filename = filename;
	scmlObj.url = filename.substr(0,filename.lastIndexOf('/')+1);
	textureData.length = 0;
	var sideData = new Object();
	sideData.width = scmlObj.width;
	sideData.height = scmlObj.height;
	sideData.isMiddle = true;
	updateCanvasSize();
	scmlObj.canvas.width = canvasWidth;
	scmlObj.canvas.height = canvasHeight;
	
	if(scmlObj.boolRbf){
		scmlObj.loadFactorAndBias();
		scmlObj.loadBasis(scmlObj.infobasis);
		scmlObj.computeLightWeights(lightDirection0);
	}

	textureData.push(sideData);
	runWebGL();

	scmlObj.object = sideData;
    
	scmlObj.initTree();
	updateShaderList();
	updateProgram("pld_default_color");
	$('#lpld_default_color').trigger("click");
 
  }

  function loadSingleFileScml(dataSource){
	$("#mainIntro").css("display","none");
	setProgressText(true, "Loading " + dataSource + " ...", false);
	//$("#progressText").html("<p>Loading " + dataSource + " ...</p>");
	$("#progressIndicator").css("display","block");
	$("#loader").css("display","block");
	$("#radiosetIntro").css("display","none");

	boolFloatTexture = false;
	boolHsh = false;
	boolPhotometric = false; // only when normal map is available, should check
	boolMultiSpectral = false;
	boolPtm = false;
	boolGLTF = false;
	boolRbf = false;
	boolScml = true;

	dsType = "SCML";
	
	singleFile = new SingleFileSCML(dataSource );

	singleFile.init().then(function() {

	textureData.length = 0;
	var sideData = new Object();
	sideData.width = singleFile.width;
	sideData.height = singleFile.height;
	sideData.isMiddle = true;
	sideData.position = position;
	updateCanvasSize();
	singleFile.canvas.width = canvasWidth;
	singleFile.canvas.height = canvasHeight;
	
	if(singleFile.boolRbf){
		//singleFile.loadFactorAndBias();
		//singleFile.loadBasis(singleFile.infobasis);
		//singleFile.computeLightWeights(lightDirection0);
	}

	textureData.push(sideData);
	runWebGL();

	//singleFile.object = sideData;
	//singleFile.object = Scene.objects[0];
	//console.log(Scene.objects[0]);
    
	singleFile.initTree();
	updateShaderList();
	//updateProgram(1);
	//$('#lpld_default_color').trigger("click");
	if(singleFile.boolPld){updateProgram("pld_default_color");}
	else if(singleFile.boolPtm){updateProgram("ptm_default_color");}
	else if(singleFile.boolHsh){updateProgram("hsh_default_color");}
	else if(singleFile.boolRbf){updateProgram("rbf_default_color");}
	
    });
  }

  function loadLocalSingleFileScml(dataSource, name){
	$("#mainIntro").css("display","none");
	setProgressText(true, "Loading " + dataSource + " ...", false);
	//$("#progressText").html("<p>Loading " + dataSource + " ...</p>");
	$("#progressIndicator").css("display","block");
	$("#loader").css("display","block");
	$("#radiosetIntro").css("display","none");

	boolFloatTexture = false;
	boolHsh = false;
	boolPhotometric = false; // only when normal map is available, should check
	boolMultiSpectral = false;
	boolPtm = false;
	boolGLTF = false;
	boolRbf = false;
	boolScml = true;

	dsType = "SCML";
	
	singleFile = new SingleFileSCML(name );

	singleFile.initLocalFile(dataSource, name).then(function() {

	textureData.length = 0;
	var sideData = new Object();
	sideData.width = singleFile.width;
	sideData.height = singleFile.height;
	sideData.isMiddle = true;
	sideData.position = position;
	updateCanvasSize();
	singleFile.canvas.width = canvasWidth;
	singleFile.canvas.height = canvasHeight;
	
	if(singleFile.boolRbf){
		//singleFile.loadFactorAndBias();
		//singleFile.loadBasis(singleFile.infobasis);
		//singleFile.computeLightWeights(lightDirection0);
	}

	textureData.push(sideData);
	runWebGL();

	//singleFile.object = sideData;
	//singleFile.object = Scene.objects[0];
	//console.log(Scene.objects[0]);
    
	singleFile.initTree();
	updateShaderList();
	//updateProgram(1);
	//$('#lpld_default_color').trigger("click");
	if(singleFile.boolPld){updateProgram("pld_default_color");}
	else if(singleFile.boolPtm){updateProgram("ptm_default_color");}
	else if(singleFile.boolHsh){updateProgram("hsh_default_color");}
	else if(singleFile.boolRbf){updateProgram("rbf_default_color");}
	
    });
  }

function loadFileGLTF(arrayBuffer,filename){
	$("#progressIndicator").css("display","none");
	$("#loader").css("display","block");
	$("#radiosetIntro").css("display","none");

	try {
	  glTFObj = JSON.parse(ab2str(arrayBuffer));
	}
	catch(e){
    $("#errorMessages").css("display","block");
    document.getElementById("errorMessages").innerHTML= "<h1>:-( Error</h1><h3>The glTF file could not be parsed.</h3><h3>" + e.name + " "+ e.message + ". Redirecting to <a href=\"http://www.heritage-visualisation.org\">heritage-visualisation.org</a> ... ";
    abortExecution();
	}
  try{
  metadataObj = new Metadata();
  metadataObj.Filename = glTFObj.Metadata[0]["Original Filename"];
  metadataObj.Type = "glTF 2.0";
  metadataObj.Dimensions = glTFObj.width + 'x' + glTFObj.height;
  metadataObj.Publication = glTFObj.Metadata[0]["Publication"];
  metadataObj.Description = glTFObj.Metadata[0]["Description"];
  metadataObj.Notes = glTFObj.Metadata[0]["Notes"];
  metadataObj.updateMetaDataFields();
} catch(e){console.log("Metadata fields not filled.");}
	glTFObj.filename = filename.substr(0,filename.lastIndexOf('/')+1);
	boolGLTF = true;
	boolPtm = false;
	boolHsh = false;
	boolRbf = false;
	boolScml = false;
	dsType = "glTF";

	//setting length to 0 deletes all elements from array in js
	textureData.length = 0;

	if(glTFObj.hsh){
	  vec4BiasHSH = [parseFloat(glTFObj.hsh[0].hshCoef0[0].bias) , parseFloat(glTFObj.hsh[0].hshCoef1[0].bias), parseFloat(glTFObj.hsh[0].hshCoef2[0].bias), parseFloat(glTFObj.hsh[0].hshCoef3[0].bias)];
	  vec4ScaleHSH = [parseFloat(glTFObj.hsh[0].hshCoef0[0].scale) , parseFloat(glTFObj.hsh[0].hshCoef1[0].scale), parseFloat(glTFObj.hsh[0].hshCoef2[0].scale),parseFloat(glTFObj.hsh[0].hshCoef3[0].scale)];
	  boolHsh = true;
	}
	if(glTFObj.pld[0].depthTex){boolDepthMap = true;}
	if(glTFObj.ptm){
		var lst = glTFObj.ptm[0].ptmCoef0[0].bias.split(",", 3);
		vec3BiasPTM0 = [parseFloat(lst[0]),parseFloat(lst[1]),parseFloat(lst[2])];
		lst = glTFObj.ptm[0].ptmCoef1[0].bias.split(",", 3);
		vec3BiasPTM1 = [parseFloat(lst[0]),parseFloat(lst[1]),parseFloat(lst[2])];
		lst = glTFObj.ptm[0].ptmCoef0[0].scale.split(",", 3);
		vec3ScalePTM0 = [parseFloat(lst[0]),parseFloat(lst[1]),parseFloat(lst[2])];
		lst = glTFObj.ptm[0].ptmCoef0[0].scale.split(",", 3);
		vec3ScalePTM1 = [parseFloat(lst[0]),parseFloat(lst[1]),parseFloat(lst[2])];
		boolPtm = true;
	}
	boolPhotometric = true;
	var sideData = new Object();
	sideData.width = glTFObj.width;
	sideData.height = glTFObj.height;

	textureData.push(sideData);

	runWebGL();
  boolFloatTexture = false;
	//buildSidePlane(0);
	var t = glTFObj.shaderConfig[0].lightDirection0.split(" ", 3);
	lightDirection0 = [parseFloat(t[0]), parseFloat(t[1]), parseFloat(t[2]) ];
	var style = parseInt(glTFObj.shaderConfig[0].shader);
	param0 = parseFloat(glTFObj.shaderConfig[0].param0);
	param1 = parseFloat(glTFObj.shaderConfig[0].param1);
	updateProgram(style);
	$('#shader'+style).prop('checked',true);
	$("#shaderSet").change();
	updateShaderList();

}

function loadFilePTM(arrayBuffer){

	$("#progressIndicator").css("display","block");
	$("#progressText").text("Parsing PTM file");
	$("#content").css("display","none");
  boolFloatTexture = true;
	boolHsh = false;
	boolPhotometric = false;
	boolMultiSpectral = false;
	boolPtm = true;
	boolGLTF = false;
	boolRbf = false;
	boolScml = false;



	//setting length to 0 deletes all elements from array in js
	textureData.length = 0;


	let inputBuffer = {buffer:arrayBuffer,  currentIndex:0};
	var version = readTillNewLine(inputBuffer); console.log("PTM Version: " + version);
	var type = readTillNewLine(inputBuffer); console.log("PTM Type: " + type);

	dsType = "PTM " + type + " " + version;
	var w = parseInt(readTillNewLine(inputBuffer));
	var h = parseInt(readTillNewLine(inputBuffer));

	//str = readTillNewLine(inputBuffer); //console.log(str);

	workerPtm = new Worker('data/js/parser/workerPtmLoader.js');
	workerPtm.onerror = function(e){
		throw new Error(e.message + " (" + e.filename + ":" + e.lineno + ")" );
	};
	workerPtm.onmessage = function(event) {
	  if(event.data.ptmCoeff0){
		var sideData = new Object();
		sideData.ptmCoeff0 = event.data.ptmCoeff0;
		sideData.ptmCoeff1 = event.data.ptmCoeff1;
		sideData.ptmRgbCoeff = event.data.ptmRgbCoeff;
		sideData.normals = new Float32Array(w*h*4);
		sideData.albedo = new Float32Array(w*h*4);
		sideData.width = w;
		sideData.height = h;

		textureData.push(sideData);

		$("content").css("display","block");
		$("#progressIndicator").css("display","none");

	//console.log(mHshData);
		runWebGL();
		updateProgram("ptm_default_color");
		updateShaderList();
    $('#lptm_default_color').trigger("click");

		workerPtmNorm = new Worker('data/js/parser/workerCalculateNormals.js');
		workerPtmNorm.onerror = function(e){
			throw new Error(e.message + " (" + e.filename + ":" + e.lineno + ")" );
		};
		workerPtmNorm.onmessage = function(event) {
			textureData[0].ptmNormals = event.data.normalsBuf;
			updateNormal(0);
			boolPhotometric = true;
			updateShaderList();
		};
		workerPtmNorm.postMessage({width:w, height:h, ptmCoeffs0:sideData.ptmCoeff0,ptmCoeffs1:sideData.ptmCoeff1,},[sideData.ptmCoeff0.buffer,sideData.ptmCoeff1.buffer]);



	  }
	  else{
		percentLoaded = event.data;
		progress.style.width = percentLoaded + '%';
		progress.textContent = percentLoaded + '%';
	  }
	}
	workerPtm.postMessage({buffer: inputBuffer.buffer, currentIdx: inputBuffer.currentIndex, w: w, h:h,version:version,},[inputBuffer.buffer]);
	populateMetaFields();

}

function loadFileRTI(arrayBuffer){
	//$("#progressIndicator").css("display","block");
	//$("#progressText").text("Parsing RTI file");
	//$("#content").css("display","none");
	//$("#progressIndicator").css("display","none");
	//$("#loader").css("display","block");
	//$("#radiosetIntro").css("display","none");
  boolFloatTexture = true;
	boolHsh = true;
	boolPhotometric = false;
	boolMultiSpectral = false;
	boolPtm = false;
	boolGLTF = false;
	boolRbf = false;
	boolScml = false;
	//setting length to 0 deletes all elements from array in js
	textureData.length = 0;


	let inputBuffer = {buffer:arrayBuffer,  currentIndex:0};
	var str = '';
	//var inputBuffer = Buffer.from(arrayBuffer);
	do{
		str = readTillNewLine(inputBuffer); //console.log(str);
	}
	while(str.charAt(0) == '#');
	//console.log(inputBuffer.currentIndex);

	var rtiType = parseInt(str);
	//get width, height and nr of channels
	str = readTillNewLine(inputBuffer);
	var list = str.split(" ", 3);
	var w = parseInt(list[0]);
	var h = parseInt(list[1]);
	var ncolor = parseInt(list[2]);

	//get number of basis terms, basis type, element size
	str = readTillNewLine(inputBuffer);
	list = str.split(" ", 3);
	var basisTerm = parseInt(list[0]);
	var basisType = parseInt(list[1]);
	var elemSize = parseInt(list[2]);

	if (basisTerm == 1)
	basisTerm = 4;
else if (basisTerm == 2)
	basisTerm = 9;

	switch(rtiType){

		case 0: //RTI
		dsType = "RTI";
		break;
		case 1: // RTI PTM
		dsType = "PTM RTI";
		break;
		case 2: //RTI SH
		dsType = "SH RTI";
		break;
		case 3: //RTI HSH
		dsType = "HSH RTI";

		//loadDataHSH(inputBuffer, w, h, basisTerm, true);//RTI HSH
			workerRti = new Worker('data/js/parser/workerRtiLoader.js');
			workerRti.onerror = function(e){
				throw new Error(e.message + " (" + e.filename + ":" + e.lineno + ")" );
			};
			workerRti.onmessage = function(event) {
				if(event.data.coef0){
var sideData = new Object();
sideData.hshCoef0 = event.data.coef0;
sideData.hshCoef1 = event.data.coef1;
sideData.hshCoef2 = event.data.coef2;
sideData.hshCoef3 = event.data.coef3;
sideData.normals = new Float32Array(w*h*4);
sideData.albedo = new Float32Array(w*h*4);
sideData.width = w;
sideData.height = h;

textureData.push(sideData);
$("content").css("display","block");
$("#progressIndicator").css("display","none");
//console.log(mHshData);
runWebGL();
updateShaderList();
updateProgram("hsh_default_color");
$('#lshader11').trigger("click");


workerHshNorm = new Worker('data/js/parser/workerCalculateNormals.js');
workerHshNorm.onerror = function(e){
	throw new Error(e.message + " (" + e.filename + ":" + e.lineno + ")" );
};
workerHshNorm.onmessage = function(event) {
	textureData[0].hshNormals = event.data.normalsBuf;
	updateNormal(0);
	boolPhotometric = true;
	updateShaderList();
};
workerHshNorm.postMessage({width:w, height:h, coef0:sideData.hshCoef0,coef1:sideData.hshCoef1,coef2:sideData.hshCoef2,coef3:sideData.hshCoef3,},[sideData.hshCoef0.buffer,sideData.hshCoef1.buffer,sideData.hshCoef2.buffer,sideData.hshCoef3.buffer]);



//animateTest();
}
else{
	//console.log(event.data);
	percentLoaded = event.data;
	progress.style.width = percentLoaded + '%';
	progress.textContent = percentLoaded + '%';
}

			};
			workerRti.postMessage({buffer: inputBuffer.buffer, currentIdx: inputBuffer.currentIndex, w: w, h:h, basisTerm: basisTerm,},[inputBuffer.buffer]);

		break;
		case 4: break;
	}
	populateMetaFields();

}

function loadDataHSH(inputBuffer, width, height, basisTerm, urti)
{

	var w  = width;
	var h = height;

	var ordlen = basisTerm;
	var bands = 3;
	var gmin = new Float32Array(9);
	var gmax = new Float32Array(9);

	var tmp0 = new Float32Array(inputBuffer.buffer,inputBuffer.currentIndex,basisTerm);
	inputBuffer.currentIndex += Float32Array.BYTES_PER_ELEMENT * basisTerm;
	var tmp1 = new Float32Array(inputBuffer.buffer,inputBuffer.currentIndex,basisTerm);
	inputBuffer.currentIndex += Float32Array.BYTES_PER_ELEMENT * basisTerm;

	for(var i = 0; i < basisTerm; i++)
	{gmin[i] = tmp0[i];}
	for(var i = 0; i < basisTerm; i++)
	{gmax[i] = tmp1[i];}

	var offset = 0;

	var size = w * h * basisTerm;
	var redPtr = new Float32Array(size);
	var greenPtr = new Float32Array(size);
	var bluePtr = new Float32Array(size);
	//std::cout<<"basisterm: "<<basisTerm<<std::endl;
	var mHshData = new Array(4);
	for(var k=0; k<4; k++){
	  mHshData[k] = new Float32Array(w*h*3);
	}

var c;


for(var j = 0; j < h; j++)
{
	for(var i = 0; i < w; i++)
	{
		offset = j * w + i;
		for (var k = 0; k < basisTerm; k++)
		{
			c = new Uint8Array(inputBuffer.buffer,inputBuffer.currentIndex,1);
			inputBuffer.currentIndex += 1;
			redPtr[offset*basisTerm + k] = (parseFloat(c) / 255.0) * gmin[k] + gmax[k];
		}
		for (var k = 0; k < basisTerm; k++)
		{
			c = new Uint8Array(inputBuffer.buffer,inputBuffer.currentIndex,1);
			inputBuffer.currentIndex += 1;
			greenPtr[offset*basisTerm + k] = (parseFloat(c) / 255.0) * gmin[k] + gmax[k];
		}
		for (var k = 0; k < basisTerm; k++)
		{
			c = new Uint8Array(inputBuffer.buffer,inputBuffer.currentIndex,1);
			inputBuffer.currentIndex += 1;
			bluePtr[offset*basisTerm + k] = (parseFloat(c) / 255.0) * gmin[k] + gmax[k];
		}

		for(var k = 0; k < 4; k++){
					 mHshData[k][offset*3] = redPtr[offset*basisTerm+k];
					 mHshData[k][offset*3+1] = greenPtr[offset*basisTerm+k];
					 mHshData[k][offset*3+2] = bluePtr[offset*basisTerm+k];
					}
	}
}
var sideData = new Object();
sideData.hshCoef0 = mHshData[0];
sideData.hshCoef1 = mHshData[1];
sideData.hshCoef2 = mHshData[2];
sideData.hshCoef3 = mHshData[3];
sideData.normals = new Float32Array(width*height*4);
sideData.albedo = new Float32Array(width*height*4);
sideData.width = width;
sideData.height = height;
textureData.push(sideData);
console.log(mHshData);
runWebGL();

}



function loadFile(arrayBuffer){
  boolFloatTexture = true;
	boolHsh = false;
	boolPhotometric = true;
	boolMultiSpectral = false;
	boolPtm = false;
	boolGLTF = false;
	boolRbf = false;
	boolScml = false;
	//$("#loader").css("display","block");
	//$("#radiosetIntro").css("display","none");
	$("#progressIndicator").css("display","block");
	setProgressText(true, "Parsing PLD file ...", false);
	//$("#progressText").text("Parsing PLD file");
	$("#content").css("display","none");

	//setting length to 0 deletes all elements from array in js
	textureData.length = 0;

	dd1 = new Date().getTime();
	var dataView = new DataView(arrayBuffer);
	var uintHeader1 = new Uint8Array(arrayBuffer,0,5);
	bytePointer +=5;
	var stringHeader1 = { s: "" };
	charCodeArrayToString(uintHeader1,stringHeader1);
	console.log("Main header: "+stringHeader1.s);

	if(stringHeader1.s.localeCompare("CUN01")!=0){
		//$("#loader").css("display","none");
		//$("#errorMessages").css("display","block");
		//document.getElementById("errorMessages").innerHTML= "<h1>:-( Error</h1><h3>The file could not be read. Please choose a different ZUN or CUN file.  Header should be CUN01 but is: " + stringHeader1.s + " </h3>";
		setProgressText(false, "Error: The file could not be read. Please choose a different ZUN or CUN file.  Header should be CUN01 but is: " + stringHeader1.s , true);
		return;
	}

	var i = 0;
	while (true) {
		//read tag
		var uintTag = new Uint8Array(arrayBuffer,bytePointer,3);
		var stringTag = { s: "" };
		charCodeArrayToString(uintTag,stringTag);
		bytePointer +=3;

		//read length
		var len = dataView.getUint32(bytePointer,true);	//interpret these 4 bytes as unsigned 32 bit integer, use littleEndian (lb first)
		console.log("Len: "+len + " tag: " + stringTag.s);
		bytePointer +=4;
		if(stringTag.s.localeCompare("EOF")==0){
			break;
		}
		else if(stringTag.s.localeCompare("CFD")==0){
			loadInfo(arrayBuffer,dataView);
			populateMetaFields();
		}
		else if(stringTag.s.localeCompare("CSP")==0){
			console.log("tag: CSP");
			if (len>0) {
				loadVersion41(arrayBuffer,dataView,bytePointer+len,i);
				i++;
			}
		}

	}       //only one worker: see technical paper why
			workerOtherSides = new Worker('data/js/parser/workerLoadversion41OtherSides.js');
			workerOtherSides.onerror = function(e){
				throw new Error(e.message + " (" + e.filename + ":" + e.lineno + ")" );
			};
			workerOtherSides.onmessage = function(event) {
			  if(event.data.msNormals0){
				textureData[event.data.sideNr].normals = event.data.msNormals0;
				textureData[event.data.sideNr].normals0 = event.data.msNormals0;
				textureData[event.data.sideNr].normals1 = event.data.msNormals1;
				textureData[event.data.sideNr].normals2 = event.data.msNormals2;
				textureData[event.data.sideNr].normals3 = event.data.msNormals3;
				textureData[event.data.sideNr].normals4 = event.data.msNormals4;
				textureData[event.data.sideNr].albedo = event.data.msAlbedo0;
				textureData[event.data.sideNr].albedo0 = event.data.msAlbedo0;
				textureData[event.data.sideNr].albedo1 = event.data.msAlbedo1;
				//textureData[event.data.sideNr].MSnormals = event.data.msnormals0;
				if(boolHasAmbient[event.data.sideNr]){
					textureData[event.data.sideNr].ambient = event.data.msAmbient0;
					textureData[event.data.sideNr].ambient0 = event.data.msAmbient0;
					textureData[event.data.sideNr].ambient1 = event.data.msAmbient1;
				}
				if(event.data.sideNr==0){$("content").css("display","block");
				$("#progressIndicator").css("display","none");runWebGL();updateShaderList();}
				else{buildSidePlane(event.data.sideNr);render(0);}
			  }
			  else if(event.data.percentLoaded){
			    //console.log(event.data);
				percentLoaded = event.data.percentLoaded
				progress.style.width = percentLoaded + '%';
				progress.textContent = percentLoaded + '%';
			  } else if(event.data.progressText){
				setProgressText(false, event.data.progressText , event.data.progressTextType);

			  }
			};
			workerOtherSides.postMessage({buffer: arrayBuffer, startPtr: beginPointer,},[arrayBuffer]);
}

function loadVersion41(ArrayBuffer,dataView,endpos,SideNr){

	startPointer[SideNr] = bytePointer;
	console.log("loadVersion41(fd): " + SideNr);
	console.log("endpos: " + endpos);
	endPos[SideNr] = endpos;

	var tag = "";

	//header
	var uintHeader = new Uint8Array(ArrayBuffer,bytePointer,5);
	//console.log(uintHeader1);
	var stringHeader = { s: "" };
	charCodeArrayToString(uintHeader,stringHeader);
	console.log("header: "+stringHeader.s);
	bytePointer+=5;

	if(stringHeader.s.localeCompare("CSP41")!=0 && stringHeader.s.localeCompare("CSP12")!=0){
		//$("#progressIndicator").css("display","none");
		//$("#errorMessages").css("display","block");
		//document.getElementById("errorMessages").innerHTML= "<h1>:-( Error</h1><h3>The file could not be read. Please choose a different ZUN or CUN file.  LoadVersion41 Invalid header: " + stringHeader1.s + " </h3>";
		setProgressText(false, "Error: The file could not be read. Please choose a different ZUN or CUN file. Invalid header: " + stringHeader1.s , true);
		bytePointer-=5;
		abortExecution();
	}
	var sideData = new Object();
	//dimension/offsets
	var offsetX, offsetY;

	mWidth = dataView.getUint32(bytePointer,true);	//interpret these 4 bytes as usigned 32 bit integer, use littleEndian (lb first)
	console.log("mWidth: "+mWidth);
	bytePointer +=4;

	mHeight = dataView.getUint32(bytePointer,true);	//interpret these 4 bytes as usigned 32 bit integer, use littleEndian (lb first)
	console.log("mHeight: "+mHeight);
	bytePointer +=4;

	var offsetX = dataView.getUint32(bytePointer,true);	//interpret these 4 bytes as usigned 32 bit integer, use littleEndian (lb first)
	console.log("offsetX: "+offsetX);
	bytePointer +=4;

	var offsetY = dataView.getUint32(bytePointer,true);	//interpret these 4 bytes as usigned 32 bit integer, use littleEndian (lb first)
	console.log("offsetY: "+offsetY);
	bytePointer +=4;

	mMmPerPixel = 0;
	if(stringHeader.s.localeCompare("CSP41")==0){
		mMmPerPixel = dataView.getFloat32(bytePointer,true);	//interpret these 4 bytes as usigned 32 bit integer, use littleEndian (lb first)
		console.log("mMmPerPixel: "+mMmPerPixel);
		bytePointer +=4;
	}

	console.log("bytepointer: " +bytePointer);

	var pos = bytePointer;
  	var blocksize; // NOTE: we do not use long as it is not necessary yet and #bytes differs on 32-and 64-bit
	var i = 0;

	while(((endPos[SideNr]==0) || (bytePointer<endPos[SideNr]) /*&& i<4*/ ) /*&& (fread(tag, 1, 4, fd) == 4)*/ ) {
		var uintTag = new Uint8Array(ArrayBuffer,bytePointer,4);
		var stringTag = { s: "" };
		charCodeArrayToString(uintTag,stringTag);
		bytePointer+=4;

		var blocksize = dataView.getUint32(bytePointer,true);	//interpret these 4 bytes as usigned 32 bit integer, use littleEndian (lb first)
		bytePointer +=4;

		console.log("TAG: " + stringTag.s + " (" + blocksize + " bytes)");

		if(stringTag.s.localeCompare("INFO")==0){
			loadBlockInfo(ArrayBuffer,dataView,SideNr);
		}
		else if(stringTag.s.localeCompare("NORC")==0){
			loadBlockCompressedNormal(ArrayBuffer,dataView,SideNr);
		}
		else if(stringTag.s.localeCompare("NORZ")==0 || stringTag.s.localeCompare("NOZ2")==0 || stringTag.s.localeCompare("NOZ3")==0 || stringTag.s.localeCompare("NOZ4")==0 || stringTag.s.localeCompare("NOZ5")==0){
			if(stringTag.s.localeCompare("NOZ2")==0){boolMultiSpectral = true;initInteraction();updateShaderList();}
			loadBlockZippedNormal(ArrayBuffer,dataView,SideNr);
		}
		else if(stringTag.s.localeCompare("ALBC")==0){
			loadBlockCompressedDiffuse(ArrayBuffer,dataView,0,SideNr);
		}
		else if(stringTag.s.localeCompare("ALBZ")==0 || stringTag.s.localeCompare("ALZ2")==0 ){
			//console.log("before loadBlockZippedDiffuse : " + stringTag.s);
			loadBlockZippedDiffuse(ArrayBuffer,dataView,0,SideNr);
		}
		else if(stringTag.s.localeCompare("AMBC")==0){
			boolHasAmbient[SideNr] = true;
			loadBlockCompressedDiffuse(ArrayBuffer,dataView,1,SideNr);
		}
		else if(stringTag.s.localeCompare("AMBZ")==0 || stringTag.s.localeCompare("AMZ2")==0){
			boolHasAmbient[SideNr] = true;
			loadBlockZippedDiffuse(ArrayBuffer,dataView,1,SideNr);
		}
		else{
			//$("#loader").css("display","none");
			//$("#errorMessages").css("display","block");
			//document.getElementById("errorMessages").innerHTML= "<h1>:-( Error</h1><h3>The file could not be read. Please choose a different ZUN or CUN file.  Invalid compression tag: " + stringTag.s + " </h3>";
			setProgressText(false, "Error: The file could not be read. Please choose a different ZUN or CUN file.  Invalid compression tag: " + stringTag.s , true);
			bytePointer-=5;
			abortExecution();
		}

		console.log("Loaded " + stringTag.s);
		sideData.width = mWidth;
		sideData.height = mHeight;
		sideData.mmPerPixel = mMmPerPixel;
	i++;

	}
	textureData.push(sideData);

	console.log("---------------------------------------------------Done with this side");
	return;
}
//following functions are only used to jump over the compressed blocks.
function loadBlockZippedDiffuse(arrayBuffer,dataView,type,SideNr){
	console.log("  LOADING BLOCK: bzC texture");
  	var nbBits = dataView.getUint32(bytePointer,true);
	bytePointer +=4;
	var minValue = dataView.getFloat32(bytePointer,true);
	bytePointer +=4;
	var maxValue = dataView.getFloat32(bytePointer,true);
	bytePointer +=4;

	console.log("    #bits: " + nbBits);
	console.log("    read min/max: " + minValue + "/" + maxValue);

	var range = maxValue - minValue;

  	// - buffer size
	var compressedBufferLen = dataView.getUint32(bytePointer,true);
	bytePointer +=4;
	console.log("    compressedBufferLen: " + compressedBufferLen);

	// - buffer data
	var compressedBuffer = new Uint8Array(arrayBuffer,bytePointer,compressedBufferLen);
	var compressedSliced = arrayBuffer.slice(bytePointer,bytePointer+compressedBufferLen);
	bytePointer += compressedBufferLen;

}
function loadBlockCompressedDiffuse(arrayBuffer,dataView,type,SideNr){
	console.log("  LOADING BLOCK: bzC texture");
  	var nbBits = dataView.getUint32(bytePointer,true);
	bytePointer +=4;
	var minValue = dataView.getFloat32(bytePointer,true);
	bytePointer +=4;
	var maxValue = dataView.getFloat32(bytePointer,true);
	bytePointer +=4;

	console.log("    #bits: " + nbBits);
	console.log("    read min/max: " + minValue + "/" + maxValue);

	var range = maxValue - minValue;

  	// - buffer size
	var compressedBufferLen = dataView.getUint32(bytePointer,true);
	bytePointer +=4;
	console.log("    compressedBufferLen: " + compressedBufferLen);

	// - buffer data
	var compressedBuffer = new Uint8Array(arrayBuffer,bytePointer,compressedBufferLen);
	var compressedSliced = arrayBuffer.slice(bytePointer,bytePointer+compressedBufferLen);
	bytePointer += compressedBufferLen;

}
function loadBlockZippedNormal(arrayBuffer,dataView,SideNr){
	console.log("  LOADING BLOCK: compressed normals");
	var compressedBufferLen = dataView.getUint32(bytePointer,true);
	bytePointer +=4;
	console.log("    compressedBufferLen: " +compressedBufferLen);

	var compressedData = new Uint8Array(arrayBuffer,bytePointer,compressedBufferLen);

	bytePointer += compressedBufferLen;

}
function loadBlockCompressedNormal(arrayBuffer,dataView,SideNr){
	console.log("  LOADING BLOCK: compressed normals");
	var compressedBufferLen = dataView.getUint32(bytePointer,true);
	bytePointer +=4;
	console.log("    compressedBufferLen: " +compressedBufferLen);

	var compressedData = new Uint8Array(arrayBuffer,bytePointer,compressedBufferLen);

	bytePointer += compressedBufferLen;


}

function nbPixels(){
	return mWidth*mHeight;
}

function loadBlockInfo(ArrayBuffer,dataView){
	setProgressText(false, "Loading info ..." , false);
	console.log("  LOADING BLOCK: info");
	var mSide = dataView.getUint32(bytePointer,true);
	bytePointer +=4;

	var len = dataView.getUint32(bytePointer,true);
	bytePointer +=4;
	if(len>0) {
		var uintTag = new Uint8Array(ArrayBuffer,bytePointer,len);
		var stringTag = { s: "" };
		charCodeArrayToString(uintTag,stringTag);
		bytePointer+=len;
	}
	console.log("    "+stringTag.s);

}

function loadInfo(ArrayBuffer,dataView){
	var version = dataView.getFloat32(bytePointer,true);	//interpret these 4 bytes as 32 bit float
	bytePointer +=4;
	console.log("  version: "+version);
	if(version != 1.0){
			//$("#loader").css("display","none");
			//$("#errorMessages").css("display","block");
			//document.getElementById("errorMessages").innerHTML= "<h1>:-( Error</h1><h3>The file could not be read. Please choose a different ZUN or CUN file.  loadInfo: invalid version number: " + version + " </h3>";
		setProgressText(false, "The file could not be read. Please choose a different ZUN or CUN file.  loadInfo: invalid version number: " + version , true);
		bytePointer-=5;
		abortExecution();
	}

	var ID;
	var len;

	while(true){
		ID = dataView.getUint8(bytePointer,true);
		bytePointer++;
		//console.log("ID: "+ID);
		if (ID==0){
			break;
    	}

		if(ID<101){// int
      	switch(ID) {
      	case 1:
				timePeriodId = dataView.getInt32(bytePointer,true);
				bytePointer +=4;
				console.log("    timePeriodID: "+timePeriodId);
				break;
			case 2:
				genreId = dataView.getInt32(bytePointer,true);
				bytePointer +=4;
				console.log("    genreId: "+genreId);
				break;
			case 3:
				mediumId = dataView.getInt32(bytePointer,true);
				bytePointer +=4;
				console.log("    mediumId: "+mediumId);
				break;
			case 4:
				sealId = dataView.getInt32(bytePointer,true);
				bytePointer +=4;
				console.log("    sealId: "+sealId);
				break;
			case 5:
				width = dataView.getFloat32(bytePointer,true);
				bytePointer +=4;
				console.log("    width: "+width);
				break;
			case 6:
				height = dataView.getFloat32(bytePointer,true);
				bytePointer +=4;
				console.log("    height: "+height);
				break;
			case 7:
				thickness = dataView.getFloat32(bytePointer,true);
				bytePointer +=4;
				console.log("    thickness: "+thickness);
				break;
			default:
				break;
			}
		}
		else{ // string
			var str = "";
			len = dataView.getUint32(bytePointer,true);
			bytePointer +=4;
			//console.log("len on 141: "+len);
      	if(len>0){
				var uintString = new Uint8Array(ArrayBuffer,bytePointer,len);
				bytePointer +=len;
				var str = window.atob(String.fromCharCode.apply(null,uintString)); //atob: base64 decoder, needs string input
			}
			switch (ID) {
			case 101: databaseNumber = str; console.log("    databaseNumber: " + str); break;
			case 102: collectionNumber = str; console.log("    collectionNumber: " + str); break;
			case 103: publicationNumber = str; console.log("    publicationNumber: " + str); break;
			case 104: siteProvenance = str; console.log("    siteProvenance: " + str); break;
			case 105: relativeDate = str; console.log("    relativeDate: " + str); break;
			case 106: publicationInfo = str; console.log("    publicationInfo: " + str); break;
			case 107: description = str; console.log("    description: " + str); break;
			case 108: notes = str; console.log("    notes: " + str); break;
			case 109: creator = str; console.log("    creator: " + str); break;
			case 110: creationDate = str; console.log("    creationDate: " + str); break;
			case 111: copyright = str; console.log("    copyright: " + str); break;
			default: break;
			}
		}
	}// forever
  beginPointer = bytePointer;
  var mFilename = "";


}

/*
converts uint8array to string, stringobject to mimic pass by reference behaviour
*/
function charCodeArrayToString(charCodeArray,StringObject){
	for(var i = 0; i < charCodeArray.length; i++){
		StringObject.s += String.fromCharCode(charCodeArray[i]);
	}

}

function populateMetaFields(){
	$('#rightAside').accordion({active:0});
	//document.getElementById("inputColNum").value= collectionNumber;
	//document.getElementById("inputOffscreenName").value= collectionNumber;
	//document.getElementById("inputDbNum").value= databaseNumber;
	//document.getElementById("inputPubNum").value= publicationNumber;
	//document.getElementById("inputSiteProv").value= siteProvenance;
	//document.getElementById("inputColNum").value= collectionNumber;
	document.getElementById("inputFilename").innerHTML= inputFilename;
	document.getElementById("inputType").innerHTML= inputType;
	document.getElementById("inputDimensions").innerHTML= inputDimensions;

	document.getElementById("inputPublication").innerHTML= publicationInfo;
	document.getElementById("inputDescription").innerHTML= description;
	document.getElementById("inputNotes").innerHTML= notes;

	document.getElementById("inputType").value = "ZUN (Legacy web PLD)";
	//document.getElementById("scmlConfig").innerHTML = JSON.stringify(_this.scmlFiles[index].scmlFile, undefined, 2); 
	document.getElementById("inputFilesize").value =formatBytes(fileLength,2);
	document.getElementById("inputHttp206").value = "Not supported for legacy data type";
	//document.getElementById("inputNumberOfEntries").value = _this.entries.length;

	rightAside=true;
	$("#rightAside").animate({right:'15px'});
	$("#contentwrapper").css("right","315px");
	$("#rightAsideButtonIcon").attr("class","sidebarIcon ui-icon ui-icon-triangle-1-e");


}

function abortExecution(){ //to be called when something went terribly wrong
  var delay = 10000;
  setTimeout(function(){ window.location = "http://www.heritage-visualisation.org"; }, delay);
}
