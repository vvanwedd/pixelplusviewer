/*
* loads different fragment shaders (and 1 vertex shader, since it's the same for every program) via loadshaders (xhr)
* attaches the shaders to a program and links the program
*/
function Programm(vss,fss,prg){
	var fs = loadShaders(gl, fss);
	//var vs = loadShaders(gl, vss);


	gl.bindAttribLocation(prg, 0, "aVertexPosition");
	gl.bindAttribLocation(prg, 1, "aVertexTextureCoords");

	gl.attachShader(prg, vs);
	gl.attachShader(prg, fs);
	gl.linkProgram(prg);

	if(!gl.getProgramParameter(prg, gl.LINK_STATUS) && !gl.isContextLost()){
		alert("Shader initialisation failed. Please contact the administrator. FS: "+fss+" VS: "+vss);
	}

	//gl.useProgram(prg); //since the right program is called in main/render()

	this.uMVMatrix = gl.getUniformLocation(prg, "uMVMatrix");
	this.uPMatrix = gl.getUniformLocation(prg, "uPMatrix");
	this.uNMatrix = gl.getUniformLocation(prg, "uNMatrix");
	this.uMaterialDiffuse = gl.getUniformLocation(prg, "uMaterialDiffuse");
	this.uMaterialAmbient = gl.getUniformLocation(prg, "uMaterialAmbient");
	this.uLightAmbient = gl.getUniformLocation(prg, "uLightAmbient");
	this.uLightIntensity0 = gl.getUniformLocation(prg, "uLightIntensity0");
	this.uLightIntensity1 = gl.getUniformLocation(prg, "uLightIntensity1");
	this.uParam0 = gl.getUniformLocation(prg, "uParam0");
    this.uParam1 = gl.getUniformLocation(prg, "uParam1");
    this.uParam2 = gl.getUniformLocation(prg, "uParam2");
	this.uParam3 = gl.getUniformLocation(prg, "uParam3");
	this.uFloatTex = gl.getUniformLocation(prg, "uFloatTex");
    this.uBoolDepthMap = gl.getUniformLocation(prg, "uBoolDepthMap");
    this.uBoolFloatTexture = gl.getUniformLocation(prg, "uBoolFloatTexture");
	this.uUseAmbient = gl.getUniformLocation(prg, "uUseAmbient");
	this.uLightDirection0 = gl.getUniformLocation(prg, "uLightDirection0");
	this.uLightDirection1 = gl.getUniformLocation(prg, "uLightDirection1");
	this.uWireframe = gl.getUniformLocation(prg, "uWireframe");
	this.uAlpha = gl.getUniformLocation(prg, "uAlpha");
	this.uUseVertexColor = gl.getUniformLocation(prg, "uUseVertexColor");
	this.uUseLambert = gl.getUniformLocation(prg, "uUseLambert");
    this.uAlbedoSampler = gl.getUniformLocation(prg, "uAlbedoSampler");
    this.uAlbedo2Sampler = gl.getUniformLocation(prg, "uAlbedo2Sampler");
	this.uNormalSampler = gl.getUniformLocation(prg, "uNormalSampler");
	this.uDispSampler = gl.getUniformLocation(prg, "uDispSampler");
	this.uSplit = gl.getUniformLocation(prg, "uSplit");
	this.uImgDim = gl.getUniformLocation(prg, "uImgDim");
    this.gkernels = gl.getUniformLocation(prg, "gkernels");
    this.hshCoeff0Tex = gl.getUniformLocation(prg, "hshCoeff0Tex");
    this.hshCoeff1Tex = gl.getUniformLocation(prg, "hshCoeff1Tex");
    this.hshCoeff2Tex = gl.getUniformLocation(prg, "hshCoeff2Tex");
    this.hshCoeff3Tex = gl.getUniformLocation(prg, "hshCoeff3Tex");

    this.rbfCoeff0Tex = gl.getUniformLocation(prg, "rbfCoeff0Tex");
    this.rbfCoeff1Tex = gl.getUniformLocation(prg, "rbfCoeff1Tex");
    this.rbfCoeff2Tex = gl.getUniformLocation(prg, "rbfCoeff2Tex");
    this.rbfCoeff3Tex = gl.getUniformLocation(prg, "rbfCoeff3Tex");
    this.rbfCoeff4Tex = gl.getUniformLocation(prg, "rbfCoeff4Tex");
    this.rbfCoeff5Tex = gl.getUniformLocation(prg, "rbfCoeff5Tex");
    if(boolRbf){
     this.rbfScale = gl.getUniformLocation(prg, "rbfScale");
     this.rbfBase = gl.getUniformLocation(prg, "rbfBase");
	 this.rbfBias = gl.getUniformLocation(prg, "rbfBias");
    }
    this.uBoolScml = gl.getUniformLocation(prg, "uBoolScml");
    if(boolScml){
      this.scmlPldScale = gl.getUniformLocation(prg, "scmlPldScale");
      this.scmlPldBias = gl.getUniformLocation(prg, "scmlPldBias");
    }

    this.uScaleHSH = gl.getUniformLocation(prg, "uScaleHSH");
    this.uBiasHSH = gl.getUniformLocation(prg, "uBiasHSH");
    this.uScalePTM0 = gl.getUniformLocation(prg, "uScalePTM0");
    this.uBiasPTM0 = gl.getUniformLocation(prg, "uBiasPTM0");
    this.uScalePTM1 = gl.getUniformLocation(prg, "uScalePTM1");
    this.uBiasPTM1 = gl.getUniformLocation(prg, "uBiasPTM1");
    this.ptmCoeff0Tex = gl.getUniformLocation(prg, "ptmCoeff0Tex");
    this.ptmCoeff1Tex = gl.getUniformLocation(prg, "ptmCoeff1Tex");
    this.ptmRgbCoeffTex = gl.getUniformLocation(prg, "ptmRgbCoeffTex");
}

// our shaders base path
loadShaders.base = "data/shaders/";

// our shaders loader
function loadShaders(gl, shaders, callback) {
    // (C) WebReflection - Mit Style License
    function onreadystatechange() {
        var
            xhr = this,
            i = xhr.i
        ;
        if (xhr.readyState == 4) {
            shaders[i] = gl.createShader(
                shaders[i].slice(0, 2) == "fs" ?
                    gl.FRAGMENT_SHADER :
                    gl.VERTEX_SHADER
            );
           
            gl.shaderSource(shaders[i], xhr.responseText);
            gl.compileShader(shaders[i]);
            if (!gl.getShaderParameter(shaders[i], gl.COMPILE_STATUS) && !gl.isContextLost())
                throw gl.getShaderInfoLog(shaders[i])
            ;
            !--length && typeof callback == "function" && callback(shaders);
        }
    }
    for (var
        shaders = [].concat(shaders),
        asynchronous = !!callback,
        i = shaders.length,
        length = i,
        xhr;
        i--;
    ) {
        (xhr = new XMLHttpRequest).i = i;
        xhr.open("get", loadShaders.base + shaders[i] + ".c", asynchronous);
       // console.log(shaders[i]);
        if (asynchronous) {
            xhr.onreadystatechange = onreadystatechange;
        }
        xhr.send(null);
        onreadystatechange.call(xhr);
    }
    return shaders[0];
}
