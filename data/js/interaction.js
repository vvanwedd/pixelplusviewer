// this file generally describes ui functions, see technical paper for explanation
///globals
var mouseDown = false;
var touchXyRotationToggle = false;
var touchZoomToggle = false;
var touchLightToggle = false;
var touchPanToggle = false;
var touchZRotationToggle = false;
var touchPanToggle = false;
var touchSideToggle = false;
var toggleGrid = false;
var oldX=null;
var oldY=null;
var dragStartPosition;
var shiftToggle=false;
var touchMeasureToggle = false;
var touchMouseToggle = true;
var keyLightToggle = true;

var moving = false;

var leftAside = true;
var rightAside = false;

var alreadyRendering = false;

var snappedTo90 = false;
var snappedToMin90 = false;
var rotationHelper = 0;
var rotAngle;
var msWidth;
var msHeight;
var lightEllipseFactor = 1.3;
document.oncontextmenu = document.body.oncontextmenu = function() {return false;}


function initInteraction(){
	mouseDown = false;
	touchXyRotationToggle = false;
	touchZoomToggle = false;
	touchLightToggle = false;
	touchPanToggle = false;
	touchZRotationToggle = false;
	touchPanToggle = false;
	touchSideToggle = false;
	toggleGrid = false;
	oldX=null;
	oldY=null;
	dragStartPosition;
	shiftToggle=false;
	touchMeasureToggle = false;
	touchMouseToggle = true;
	keyLightToggle = true;

	leftAside = false;
	rightAside = true;
	$("#rightAside").animate({right:'15px'});
	$("#contentwrapper").css("right","390px");
	$("#rightAsideButtonIcon").attr("class","sidebarIcon ui-icon ui-icon-triangle-1-e");

	alreadyRendering = false;
	boolAlreadyChangedSide = false;

	snappedTo90 = false;
	snappedToMin90 = false;
	rotationHelper = 0;
	rotAngle=0;

	$("#sliderLight0").slider({value: 3});
	$("#sliderLight1").slider({value: 2});
	$("#sliderParam0").slider({value: 0});
	$("#sliderParam1").slider({value: 0});
	$("#sliderParam2").slider({value: 0});
	$("#sliderParam3").slider({value: 0});

	rect = canvas.getBoundingClientRect();
	twidth = rect.right - rect.left;
	theight = -rect.top + rect.bottom;
	oldX0=0;
	oldY0=0;
	oldX1= twidth;
	oldY1=0;

	//$("#albPLD")[0].checked =true;
	//$("#albPLD").button();
	//$("#albPLD").button("refresh");
	//$("#ambPLD").button("widget").css({"display": "none"});
	//$("#ambPLD").button("refresh");
	$("#pld_default_color")[0].checked =true;
	$("#pld_default_color").button("refresh");
	$("#radio8")[0].checked =true;
	$("#radio8").button("refresh");

	$("#colorIRG").button("refresh");

	$('#lpld_default_color').button();
	$('#lpld_color_specular').button();
	$('#lpld_sharpen_refl').button();
	$('#lpld_sharpen_nor').button();
	$('#lpld_shaded').button();
	$('#lpld_shaded_exag').button();
	$('#lpld_sketch1').button();
	$('#lpld_sketch2').button();
	$('#lpld_curvature1').button();
	$('#lpld_curvature2').button();
	$('#lnormals').button();
	$('#lrefl').button();
	$('#lhsh_default_color').button();
	$('#lhsh_spec_enh').button();
	$('#lhsh_sharpen_hsh').button();
	$('#lhsh_sharpen_nor').button();
	$('#lptm_default_color').button();
	$('#lptm_spec_enh').button();
	$('#lrbf_default_color').button();
	$('#lrbf_spec_enh').button();
	//$('#lshader33').button();

	$("#colorI").button();
	$("#colorR").button();
	$("#colorG").button();
	$("#colorB").button();
	$("#colorU").button();

	$("#colorIRG").button();
	$("#colorIGB").button();
	$("#colorRGB").button();
	$("#colorRGU").button();
	$("#colorGBU").button();

	$("#lDephNone").button();

	$("#normalI").button();
	$("#normalR").button();
	$("#normalG").button();
	$("#normalB").button();
	$("#normalU").button();

	if(!boolMultiSpectral){
		$("#colorI").button("disable");
		$("#colorU").button("disable");

		$("#colorIRG").button("disable");
		$("#colorIGB").button("disable");
		$("#colorRGU").button("disable");
		$("#colorGBU").button("disable");

		$("#normalI").button("disable");
		$("#normalR").button("disable");
		$("#normalB").button("disable");
		$("#normalU").button("disable");

	} else{
		$("#colorI").button("enable");
		$("#colorU").button("enable");

		$("#colorIRG").button("enable");
		$("#colorIGB").button("enable");
		$("#colorRGU").button("enable");
		$("#colorGBU").button("enable");

		$("#normalI").button("enable");
		$("#normalR").button("enable");
		$("#normalB").button("enable");
		$("#normalU").button("enable");
	}



}
function boolLightToggle(){
	return (touchLightToggle||keyLightToggle);
}

function openInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}

//function to sync mouse mode and touch mode input
function updateUi(number){
	touchZoomToggle = false;
	touchLightToggle = false;
	touchPanToggle = false;
	touchZRotationToggle = false;
	touchXyRotationToggle = false;
	touchMeasureToggle = false;
	touchMouseToggle = false;
	touchHelpToggle = false;
	switch(number){
		case 1: touchLightToggle = true; break;
		case 2: touchPanToggle = true; keyLightToggle=false; break;
		case 3: touchZoomToggle= true; keyLightToggle=false; break;
		case 4: touchZRotationToggle= true; keyLightToggle=false; break;
		case 5: touchXyRotationToggle= true; keyLightToggle=false; break;
		case 6: touchSideToggle= true; keyLightToggle=false; break;
		case 7: touchMeasureToggle= true; keyLightToggle=false; break;
		case 8: touchMouseToggle= true; break;
		case 9: touchHelpToggle= true; break;
	}
	document.getElementById("canvasOverlay").style.cursor="default";
	if(touchLightToggle==true){
		$('#rightAside').accordion({active:1});
		$("#radio1")[0].checked =true;
		$("#radio1").button("refresh");
	}
	else if(touchZoomToggle==true){
		$('#rightAside').accordion({active:1});
		$("#radio3")[0].checked =true;
		$("#radio3").button("refresh");
	}
	else if(touchPanToggle==true){
		$('#rightAside').accordion({active:1});
		$("#radio2")[0].checked =true;
		$("#radio2").button("refresh");
		document.getElementById("canvasOverlay").style.cursor="move";
	}
	else if(touchZRotationToggle==true){
		$('#rightAside').accordion({active:1});
		$("#radio4")[0].checked =true;
		$("#radio4").button("refresh");
	}
	else if(touchXyRotationToggle==true){
		//$('#rightAside').accordion({active:1});
		//$("#radio5")[0].checked =true;
		//$("#radio5").button("refresh");
	}
	else if(touchMeasureToggle==true){
		$('#rightAside').accordion({active:1});
		$("#radio7")[0].checked =true;
		$("#radio7").button("refresh");
		document.getElementById("canvasOverlay").style.cursor="crosshair";
	}
	else if(touchMouseToggle==true){
		$('#rightAside').accordion({active:1});
		$("#radio8")[0].checked =true;
		$("#radio8").button("refresh");
	}
	else if(touchSideToggle==true){
		$('#rightAside').accordion({active:1});
		$("#radio6")[0].checked =true;
		$("#radio6").button("refresh");
	}
	else if(touchHelpToggle==true){
		openInNewTab('http://www.heritage-visualisation.org/manual.html');

	}
	if(gl){render(0);}
}

$(document).ready(function(){
	$( document ).tooltip();
	$("#rightAsideButton").click(function(){
		if(rightAside==true){
			rightAside=false;
			$("#rightAside").animate({right:'-375px'});
			$("#contentwrapper").css("right","15px");
			$("#rightAsideButtonIcon").attr("class","sidebarIcon ui-icon ui-icon-triangle-1-w");
		}
		else{
			rightAside=true;
			$("#rightAside").animate({right:'15px'});
			$("#contentwrapper").css("right","390px");
			$("#rightAsideButtonIcon").attr("class","sidebarIcon ui-icon ui-icon-triangle-1-e");
		}
		updateCanvasSize();
	});
	$("#rightAside" ).accordion({
		collapsible: true,
		heightStyle: "fill"
    });

	$("#radioset" ).buttonset();
	$("#radioset").change(function(){
		if($("#radio1")[0].checked==true){updateUi(1);}
		else if($("#radio2")[0].checked==true){updateUi(2);}
		else if($("#radio3")[0].checked==true){updateUi(3);}
		else if($("#radio4")[0].checked==true){updateUi(4);}
		/*else if($("#radio5")[0].checked==true){}*/
		else if($("#radio6")[0].checked==true){updateUi(5);}
		/*else if($("#radio7")[0].checked==true){updateUi(7);}*/
		else if($("#radio8")[0].checked==true){updateUi(8);}
		else if($("#radio9")[0].checked==true){updateUi(9);}

	});
	$("#radiosetIntro" ).buttonset();
	$("#radiosetIntro").change(function(){
		console.log("clicked");
		if($("#radioIntro0")[0].checked==true){
			$("#introHelp").css("opacity","0");
			$("#introHelp").css("display","none");
			$("#introLinks").css("opacity","0");
			$("#introLinks").css("display","none");
			$("#introFeatures").css("display","block");
			$("#introFeatures").animate({opacity:'1.0'});
		}
		else if($("#radioIntro1")[0].checked==true){
			$("#introFeatures").css("opacity","0");
			$("#introFeatures").css("display","none");
			$("#introLinks").css("opacity","0");
			$("#introLinks").css("display","none");
			$("#introHelp").css("display","block");
			$("#introHelp").animate({opacity:'1.0'});
		}
		else if($("#radioIntro2")[0].checked==true){
			$("#introHelp").css("opacity","0");
			$("#introHelp").css("display","none");
			$("#introFeatures").css("opacity","0");
			$("#introFeatures").css("display","none");
			$("#introLinks").css("display","block");
			$("#introLinks").animate({opacity:'1.0'});
		}
	});
 $("#colorSet" ).buttonset();
 $("#colorSet").change(function(){
	if($("#colorIRG")[0].checked==true){
		if(gl){gl.clearColor(0.0, 0.0, 0.0, 1.0);}
		updateColorMix("IRG");
	}
	if($("#colorIGB")[0].checked==true){
		if(gl){gl.clearColor(0.0, 0.0, 0.0, 1.0);}
		updateColorMix("IGB");
	}
	if($("#colorRGB")[0].checked==true){
		if(gl){gl.clearColor(0.0, 0.0, 0.0, 1.0);}
		updateColorMix("RGB");
	}
	if($("#colorRGU")[0].checked==true){
		if(gl){gl.clearColor(0.0, 0.0, 0.0, 1.0);}
		updateColorMix("RGU");
	}
	if($("#colorIGB")[0].checked==true){
		if(gl){gl.clearColor(0.0, 0.0, 0.0, 1.0);}
		updateColorMix("IGB");
	}
	if($("#colorGBU")[0].checked==true){
		if(gl){gl.clearColor(0.0, 0.0, 0.0, 1.0);}
		updateColorMix("GBU");
	}
	if($("#colorI")[0].checked==true){
		if(gl){gl.clearColor(0.0, 0.0, 0.0, 1.0);}
		updateColorMix("III");
	}
	if($("#colorR")[0].checked==true){
		if(gl){gl.clearColor(0.0, 0.0, 0.0, 1.0);}
		updateColorMix("RRR");
	}
	if($("#colorG")[0].checked==true){
		if(gl){gl.clearColor(0.0, 0.0, 0.0, 1.0);}
		updateColorMix("GGG");
	}
	if($("#colorB")[0].checked==true){
		if(gl){gl.clearColor(0.0, 0.0, 0.0, 1.0);}
		updateColorMix("BBB");
	}
	if($("#colorU")[0].checked==true){
		if(gl){gl.clearColor(0.0, 0.0, 0.0, 1.0);}
		updateColorMix("UUU");
	}

if(gl){render(0);}


});


 $("#normalSet" ).buttonset();
	$("#normalSet").change(function(){
                if($("#normalI")[0].checked==true){
                        updateNormal(0);
			if(gl){render(0);}
		}
		if($("#normalR")[0].checked==true){
                        updateNormal(1);
			if(gl){render(0);}

                }
		if($("#normalG")[0].checked==true){
                        updateNormal(2);
			if(gl){render(0);}

                }
		if($("#normalB")[0].checked==true){
                        updateNormal(3);
			if(gl){render(0);}

                }
		if($("#normalU")[0].checked==true){
			updateNormal(4);
                        if(gl){render(0);}
				}
		if($("#normalHSH")[0].checked==true){
			updateNormal(5);
		 				if(gl){render(0);}
				}
		if($("#normalPTM")[0].checked==true){
			updateNormal(6);
			if(gl){render(0);}
		}
		if($("#normalRBF")[0].checked==true){
			updateNormal(7);
			if(gl){render(0);}
		}

	});

	$("#depthSet" ).buttonset();
	$("#depthNone").button({disabled:false});
	$("#depthPldWl").button({disabled:true});
	$("#depthPldIR").button({disabled:true});
	$("#depthPldR").button({disabled:true});
	$("#depthPldG").button({disabled:true});
	$("#depthPldB").button({disabled:true});
	$("#depthPldUV").button({disabled:true});

	$("#depthSet").change(function(){
        if($("#depthNone")[0].checked==true){
                      
		}
		if($("#depthPldWl")[0].checked==true){

                }
		if($("#depthPldIR")[0].checked==true){

                }
		if($("#depthPldR")[0].checked==true){

                }
		if($("#depthPldG")[0].checked==true){
				}
		if($("#depthPldB")[0].checked==true){
				}
		if($("#depthPldUV")[0].checked==true){
		}
	});
	$("#reflectanceSet" ).buttonset();
	$("#lwlAmbPLD").button({disabled:false});
	$("#lwlAlbPLD").button({disabled:false});
	$("#lmsAmbPLD").button({disabled:false});
	$("#lmsAlbPLD").button({disabled:false});
	$("#lambPTM").button({disabled:false});
	$("#lambHSH").button({disabled:false});
	$("#lambRBF").button({disabled:false});
	$("#reflectanceSet").change(function(){
		if($("#wlAlbPLD")[0].checked==true){
			useAmbient = false;
			updateReflectance(0);
		}
		else if($("#wlAmbPLD")[0].checked==true){
			useAmbient = true;
			updateReflectance(1);
		}
		if($("#msAlbPLD")[0].checked==true){
			useAmbient = false;
			updateReflectance(2);
		}
		else if($("#msAmbPLD")[0].checked==true){
			useAmbient = true;
			updateReflectance(3);
		}
		else if($("#ambPTM")[0].checked==true){
			useAmbient = true;
			updateReflectance(4);
		}
		else if($("#ambHSH")[0].checked==true){
			useAmbient = true;
			updateReflectance(4);
		}
		else if($("#ambRBF")[0].checked==true){
			useAmbient = true;
			updateReflectance(4);
		}
		if(gl){render(0)};
	});
	

	$("#shaderSet" ).buttonset();
	$("#shaderSet").change(function(){
		if($("#pld_default_color")[0].checked==true){
			if(gl){gl.clearColor(0.0, 0.0, 0.0, 1.0);}
			updateProgram("pld_default_color");
			document.getElementById("light0wrapper").style.display="inline";
			document.getElementById("light1wrapper").style.display="inline";
			document.getElementById("param0wrapper").style.display="none";
			document.getElementById("param1wrapper").style.display="none";
			document.getElementById("param2wrapper").style.display="none";
			document.getElementById("param3wrapper").style.display="none";
			document.getElementById("content").style.background="black";
		}
		else if($("#pld_color_specular")[0].checked==true){
			if(gl){gl.clearColor(0.0, 0.0, 0.0, 1.0);}
			updateProgram("pld_color_specular");
			document.getElementById("light0wrapper").style.display="inline";
			document.getElementById("light1wrapper").style.display="inline";
			document.getElementById("param0wrapper").style.display="inline";
			document.getElementById("param1wrapper").style.display="inline";
			document.getElementById("param2wrapper").style.display="inline";
			document.getElementById("param0").innerHTML = "exp";
			document.getElementById("param1").innerHTML = "Ks";
			document.getElementById("param2").innerHTML = "Kd";
			document.getElementById("param3wrapper").style.display="none";

			document.getElementById("content").style.background="black";
		}
		else if($("#pld_sharpen_refl")[0].checked==true){
			if(gl){gl.clearColor(0.0, 0.0, 0.0, 1.0);}
			updateProgram("pld_sharpen_refl");
			document.getElementById("light0wrapper").style.display="inline";
			document.getElementById("light1wrapper").style.display="inline";
			document.getElementById("param0wrapper").style.display="inline";
			document.getElementById("param1wrapper").style.display="inline";
			document.getElementById("param0").innerHTML = "Percentage";
			document.getElementById("param1").innerHTML = "Size";
			document.getElementById("param2wrapper").style.display="none";
			document.getElementById("param3wrapper").style.display="none";
			document.getElementById("content").style.background="black";
		}
		else if($("#pld_sharpen_nor")[0].checked==true){
			if(gl){gl.clearColor(0.0, 0.0, 0.0, 1.0);}
			updateProgram("pld_sharpen_nor");
			document.getElementById("light0wrapper").style.display="inline";
			document.getElementById("light1wrapper").style.display="inline";
			document.getElementById("param0wrapper").style.display="none";
			document.getElementById("param1wrapper").style.display="none";
			document.getElementById("param2").innerHTML = "Amount";
			document.getElementById("param2wrapper").style.display="inline";
			document.getElementById("param3wrapper").style.display="none";
			document.getElementById("content").style.background="black";
		}
		else if($("#pld_curvature1")[0].checked==true){
			if(gl){gl.clearColor(0.0, 0.0, 0.0, 1.0);}
			updateProgram("pld_curvature1");
			document.getElementById("light0wrapper").style.display="inline";
			document.getElementById("light1wrapper").style.display="inline";
			document.getElementById("param0wrapper").style.display="none";
			document.getElementById("param1wrapper").style.display="none";
			document.getElementById("param2wrapper").style.display="none";
			document.getElementById("param3wrapper").style.display="none";
		}
		else if($("#pld_curvature2")[0].checked==true){
			if(gl){gl.clearColor(1.0, 1.0, 1.0, 1.0);}
			updateProgram("pld_curvature2");
			document.getElementById("light0wrapper").style.display="inline";
			document.getElementById("light1wrapper").style.display="none";
			document.getElementById("param0wrapper").style.display="inline";
			document.getElementById("param1wrapper").style.display="inline";
			document.getElementById("param0").innerHTML = "Sensitivity";
			document.getElementById("param1").innerHTML = "Thickness";
			document.getElementById("param2wrapper").style.display="none";
			document.getElementById("param3wrapper").style.display="none";
		}
		else if($("#pld_sketch1")[0].checked==true){
			if(gl){gl.clearColor(1.0, 1.0, 1.0, 1.0);}
			updateProgram("pld_sketch1");
			document.getElementById("light0wrapper").style.display="none";
			document.getElementById("light1wrapper").style.display="none";
			document.getElementById("param0wrapper").style.display="inline";
			document.getElementById("param1wrapper").style.display="inline";
			document.getElementById("param0").innerHTML = "Sensitivity";
			document.getElementById("param1").innerHTML = "Thickness";
			document.getElementById("param2wrapper").style.display="none";
			document.getElementById("param3wrapper").style.display="none";
		}
		else if($("#pld_sketch2")[0].checked==true){
			if(gl){gl.clearColor(1.0, 1.0, 1.0, 1.0);}
			updateProgram("pld_sketch2");
			document.getElementById("light0wrapper").style.display="none";
			document.getElementById("light1wrapper").style.display="none";
			document.getElementById("param0wrapper").style.display="inline";
			document.getElementById("param1wrapper").style.display="inline";
			document.getElementById("param0").innerHTML = "Sensitivity";
			document.getElementById("param1").innerHTML = "Thickness";
			document.getElementById("param2wrapper").style.display="none";
			document.getElementById("param3wrapper").style.display="none";
		}
		else if($("#pld_shaded")[0].checked==true){
			if(gl){gl.clearColor(0.0, 0.0, 0.0, 1.0);}
			updateProgram("pld_shaded");
			document.getElementById("light0wrapper").style.display="inline";
			document.getElementById("light1wrapper").style.display="inline";
			document.getElementById("param0wrapper").style.display="none";
			document.getElementById("param1wrapper").style.display="none";
			document.getElementById("param2wrapper").style.display="none";
			document.getElementById("param3wrapper").style.display="none";
		}
		else if($("#pld_shaded_exag")[0].checked==true){
			if(gl){gl.clearColor(1.0, 1.0, 1.0, 1.0);}
			updateProgram("pld_shaded_exag");
			document.getElementById("light0wrapper").style.display="inline";
			document.getElementById("light1wrapper").style.display="inline";
			document.getElementById("param0wrapper").style.display="none";
			document.getElementById("param1wrapper").style.display="none";
			document.getElementById("param2").innerHTML = "Amount";
			document.getElementById("param2wrapper").style.display="inline";
			document.getElementById("param3wrapper").style.display="none";
			document.getElementById("content").style.background="black";
		}
		else if($("#normals")[0].checked==true){
			if(gl){gl.clearColor(0.5, 0.5, 1.0, 1.0);} //default color for normal map view
			//gl.useProgram(prg1);
			//animateTest2();
			updateProgram("normals");
			document.getElementById("light0wrapper").style.display="none";
			document.getElementById("light1wrapper").style.display="none";
			document.getElementById("param0wrapper").style.display="none";
			document.getElementById("param1wrapper").style.display="none";
			document.getElementById("param2wrapper").style.display="none";
			document.getElementById("param3wrapper").style.display="none";

		}
		else if($("#refl")[0].checked==true){
            if(gl){gl.clearColor(0.0, 0.0, 0.0, 1.0);}
			updateProgram("refl");
            document.getElementById("light0wrapper").style.display="inline";
            document.getElementById("light1wrapper").style.display="inline";
            document.getElementById("param0wrapper").style.display="none";
			document.getElementById("param1wrapper").style.display="none";
			document.getElementById("param2wrapper").style.display="none";
			document.getElementById("param3wrapper").style.display="none";
            document.getElementById("content").style.background="black";

		}
		else if($("#hsh_default_color")[0].checked==true){
			if(gl){gl.clearColor(0.0, 0.0, 0.0, 1.0);}
			updateProgram("hsh_default_color");
			document.getElementById("light0wrapper").style.display="inline";
			document.getElementById("light1wrapper").style.display="inline";
			document.getElementById("param0wrapper").style.display="none";
			document.getElementById("param1wrapper").style.display="none";
			document.getElementById("param2wrapper").style.display="none";
			document.getElementById("param3wrapper").style.display="none";

			document.getElementById("content").style.background="black";
		}
		else if($("#hsh_sharpen_hsh")[0].checked==true){
			if(gl){gl.clearColor(0.0, 0.0, 0.0, 1.0);}
			updateProgram("hsh_sharpen_hsh");
			document.getElementById("light0wrapper").style.display="inline";
			document.getElementById("light1wrapper").style.display="inline";
			document.getElementById("param0wrapper").style.display="inline";
			document.getElementById("param1wrapper").style.display="inline";
			document.getElementById("param2wrapper").style.display="none";
			document.getElementById("param0").innerHTML = "size";
			document.getElementById("param1").innerHTML = "percentage";
			document.getElementById("param3wrapper").style.display="none";

			document.getElementById("content").style.background="black";
		}
		else if($("#hsh_sharpen_nor")[0].checked==true){
			if(gl){gl.clearColor(0.0, 0.0, 0.0, 1.0);}
			updateProgram("hsh_sharpen_nor");
			document.getElementById("light0wrapper").style.display="inline";
			document.getElementById("light1wrapper").style.display="inline";
			document.getElementById("param0wrapper").style.display="inline";
			document.getElementById("param1wrapper").style.display="inline";
			document.getElementById("param2wrapper").style.display="none";
			document.getElementById("param0").innerHTML = "size";
			document.getElementById("param1").innerHTML = "percentage";
			document.getElementById("param3wrapper").style.display="none";

			document.getElementById("content").style.background="black";
		}
		else if($("#hsh_spec_enh")[0].checked==true){
			if(gl){gl.clearColor(0.0, 0.0, 0.0, 1.0);}
			updateProgram("hsh_spec_enh");
			document.getElementById("light0wrapper").style.display="inline";
			document.getElementById("light1wrapper").style.display="inline";
			document.getElementById("param0wrapper").style.display="inline";
			document.getElementById("param1wrapper").style.display="inline";
			document.getElementById("param2wrapper").style.display="inline";
			document.getElementById("param0").innerHTML = "exp";
			document.getElementById("param1").innerHTML = "Ks";
			document.getElementById("param2").innerHTML = "Kd";
			document.getElementById("param3wrapper").style.display="none";

			document.getElementById("content").style.background="black";
		}
		else if($("#ptm_default_color")[0].checked==true){
			if(gl){gl.clearColor(0.0, 0.0, 0.0, 1.0);}
			updateProgram("ptm_default_color");
			document.getElementById("light0wrapper").style.display="inline";
			document.getElementById("light1wrapper").style.display="inline";
			document.getElementById("param0wrapper").style.display="inline";
			document.getElementById("param1wrapper").style.display="inline";
			document.getElementById("param2wrapper").style.display="inline";
			document.getElementById("param0").innerHTML = "Percentage";
			document.getElementById("param1").innerHTML = "Size";
			document.getElementById("param2").innerHTML = "Kd";
			document.getElementById("param3wrapper").style.display="none";

			document.getElementById("content").style.background="black";
		}
		else if($("#ptm_spec_enh")[0].checked==true){
			if(gl){gl.clearColor(0.0, 0.0, 0.0, 1.0);}
			updateProgram("ptm_spec_enh");
			document.getElementById("light0wrapper").style.display="inline";
			document.getElementById("light1wrapper").style.display="inline";
			document.getElementById("param0wrapper").style.display="inline";
			document.getElementById("param1wrapper").style.display="inline";
			document.getElementById("param2wrapper").style.display="inline";
			document.getElementById("param0").innerHTML = "exp";
			document.getElementById("param1").innerHTML = "Ks";
			document.getElementById("param2").innerHTML = "Kd";
			document.getElementById("param3wrapper").style.display="none";

			document.getElementById("content").style.background="black";
		}
		else if($("#rbf_default_color")[0].checked==true){
			if(gl){gl.clearColor(0.0, 0.0, 0.0, 1.0);}
			updateProgram("rbf_default_color");
			document.getElementById("light0wrapper").style.display="inline";
			document.getElementById("light1wrapper").style.display="inline";
			document.getElementById("param0wrapper").style.display="none";
			document.getElementById("param1wrapper").style.display="none";
			document.getElementById("param2wrapper").style.display="none";
			document.getElementById("param0").innerHTML = "Rel. %";
			document.getElementById("param2").innerHTML = "Intensity";

			document.getElementById("param3wrapper").style.display="none";

			document.getElementById("content").style.background="black";
		}
		else if($("#rbf_spec_enh")[0].checked==true){
			if(gl){gl.clearColor(0.0, 0.0, 0.0, 1.0);}
			updateProgram("rbf_spec_enh");
			document.getElementById("light0wrapper").style.display="inline";
			document.getElementById("light1wrapper").style.display="inline";
			document.getElementById("param0wrapper").style.display="inline";
			document.getElementById("param1wrapper").style.display="inline";
			document.getElementById("param2wrapper").style.display="inline";
			document.getElementById("param0").innerHTML = "exp";
			document.getElementById("param1").innerHTML = "Ks";
			document.getElementById("param2").innerHTML = "Kd";
			document.getElementById("param3wrapper").style.display="none";

			document.getElementById("content").style.background="black";
		}

	});
	$("#shader2").button({disabled:true});
	//$('#shader1')[0].hide();

	$( "#ButtonResetPosition" )
      .button()
      .click(function( event ) {
        event.preventDefault();
        resetPosition();
      });
	function resetPosition(){
		console.log("resetPosition");
		position = HOME.slice(0); //slice: clones the array and returns the reference to the new array
		rotation = [0,0,0];
		mainSide = 0;
		changeSide(10);
		if(gl){render(0)};
		console.log(HOME);
	}
	$( "#Button1on1Position" )
      .button()
      .click(function( event ) {
        event.preventDefault();
        oneOnOnePosition();
      });
	function oneOnOnePosition(){
		position[2] = -50/Math.tan(15/180*Math.PI)*textureData[0].height/textureData[0].width*canvasHeight/textureData[0].width; //slice: clones the array and returns the reference to the new array
		if(gl){render(0)};
		console.log(position);
	}
	$( "#ButtonRotatePosition" )
      .button()
      .click(function( event ) {
        event.preventDefault();
		RotatePosition();
	  });
	  function RotatePosition(){
		  rotation[2]-=90;
		  if(gl){render(0);}
	  }

	$("#ButtonOpenFile")
      .button()
      .click(function( event ) {
        $("#fileinput").click();
	});
       $("#ButtonExamples")
      .button()
      .click(function( event ) {
       location.href = "index.html";
        });

       $("#ButtonFullScreen")
      .button()
      .click(function( event ) {
       toggleFullScreen();
	});
	$( "#sliderLight0" ).slider({orientation: "horizontal",
      range: "min",
		min:0,
      max: 10,
		step:0.01,
      value: 3,
      slide: updateLight0,
      change: updateLight0
	});
	$( "#sliderLight0" ).draggable();
	$( "#sliderLight1" ).slider({orientation: "horizontal",
      range: "min",
		min:0,
      max: 10,
		step:0.01,
      value: 2,
      slide: updateLight1,
      change: updateLight1,
	});
	$( "#sliderParam0" ).slider({orientation: "horizontal",
      range: "min",
		min:0.1,
      max: 2,
		step:0.1,
      value: 0,
      slide: updateParam0,
      change: updateParam0
	});
	$( "#sliderParam1" ).slider({orientation: "horizontal",
      range: "min",
		min:0,
      max: 2,
		step:0.1,
      value: 0,
      slide: updateParam1,
      change: updateParam1
	});
	$( "#sliderParam2" ).slider({orientation: "horizontal",
	range: "min",
	  min:0,
	max: 100,
	  step:1,
	value: 0,
	slide: updateParam2,
	change: updateParam2
  });
  $( "#sliderParam3" ).slider({orientation: "horizontal",
  range: "min",
	min:0,
  max: 100,
	step:1,
  value: 0,
  slide: updateParam3,
  change: updateParam3
});
	function updateLight0(){
		lightIntensity0 = $( "#sliderLight0" ).slider( "value" );
		lightColor0 = intensity2Color(lightIntensity0);
		if(gl&&!alreadyRendering){render(0)};
	}
	function updateLight1(){
		lightIntensity1 = $( "#sliderLight1" ).slider( "value" );
		lightColor1 = intensity2Color(lightIntensity1); 
		if(gl&&!alreadyRendering){render(0)};
	}
	function updateParam0(){
		param[0] = $( "#sliderParam0" ).slider( "value" );
		if(gl&&!alreadyRendering){render(0)};
	}
	function updateParam1(){
		param[1] = $( "#sliderParam1" ).slider( "value" );
		if(gl&&!alreadyRendering){render(0)};
	}
	function updateParam2(){
		param[2] = $( "#sliderParam2" ).slider( "value" );
		if(gl&&!alreadyRendering){render(0)};
	}
	function updateParam3(){
		param[3] = $( "#sliderParam3" ).slider( "value" );
		if(gl&&!alreadyRendering){render(0)};
	}
	function updateParam4(){
		param[4] = $( "#sliderParam4" ).slider( "value" );
		if(gl&&!alreadyRendering){render(0)};
	}

	$( "#buttonPrint" ).button();
	$( "#buttonPrint" ).click(function(){
		takeScreenshot();
	});
	$("#buttonMeasure").button();
	$("#buttonMeasure").click(function(){
		measure();
	});

});

$(window).resize(function(){
	$("#rightAside").accordion("refresh");
	updateCanvasSize();
});

function intensity2Color(intensity){ // intensity between 0 and 10
	var i = intensity * 3900 + 1000; // convert 0 10 -> 1000 40000 Kelvin
	var i = i/100; 
	var c = [0.0, 0.0, 0.0, 1.0];
	//red
	if(i <= 66){
		c[0] = 255;
	} else{
		c[0] = i - 60;
		c[0] = 329.698727446 * ( Math.pow(c[0], -0.1332047592));
		if(c[0] < 0){ c[0] = 0;} 
		else if(c[0] > 255) {c[0] = 255;}
	}
	//green
	if(i <= 66){
		c[1] = i;
		c[1] = 99.4708025861 * Math.log(c[1]) - 161.1195681661;
		if(c[1] < 0){ c[1] = 0;} 
		else if(c[1] > 255) {c[1] = 255;}
	} else{
		c[1] = i - 60;
		c[1] = 288.1221695283 * Math.pow(c[1],-0.0755148492);
		if(c[1] < 0){ c[1] = 0;} 
		else if(c[1] > 255) {c[1] = 255;}
	}
	//blue
	if(i >= 66)	{
		c[2] = 255;
	} else{
		if (i <= 19){
			c[2] = 0;
		} else{
			c[2] = i - 10;
			c[2] = 138.5177312231 * Math.log(c[2]) - 305.0447927307;
			if(c[2] < 0){ c[2] = 0;} 
			else if(c[2] > 255) {c[2] = 255;}
		}
	}
	c[0] = c[0]/255.0*(3*intensity/40.0+0.25)+0.1;
	c[1] = c[1]/255.0*(3*intensity/40.0+0.25)+0.1;
	c[2] = c[2]/255.0*(3*intensity/40.0+0.25);
	return c;
}

$(document).ready(function(){
$("#canvasOverlay").bind('mousewheel DOMMouseScroll',function(e) {
	e.preventDefault();
	var delta;
	//to support all current browser implementations of positive and negative scrolling
    if (e.type == 'mousewheel') {
        delta = (e.originalEvent.wheelDelta * -1);
    }
    else if (e.type == 'DOMMouseScroll') {
        delta = 40 * e.originalEvent.detail;
    }
	if(shiftToggle){
		if(delta >0) {
			rotation[2]=(rotation[2]-90)%360;
			rotationHelper -=90;
		}
		else{
			rotation[2]=(rotation[2]+90)%360;
			rotationHelper +=90;
		}
console.log(rotation[2]);
	changeSide(10);
	}
	else{
		if(delta < 0) {
			position[2]=1.1*position[2];
		}
		else{
			position[2]=0.9*position[2];
		}

		if(hasMeasurement){drawUpdateZoom();}
	}
		if(gl&&!alreadyRendering){timeoutid = window.requestAnimFrame(animate);alreadyRendering=true;console.log("start rendering");};

});
});




$(document).ready(function(){

$(document).mouseup(function(e){
	//console.log("mouseup: " + timeoutid);
	mouseDown = false;
	alreadyRendering = false;
	boolAlreadyChangedSide = false;
	if(touchMeasureToggle){
		var canvas = document.getElementById("canvasMain");
		yMouseUp = event.clientY - rect.top;
	}
	if(touchZRotationToggle&&!shiftToggle){
		if(snappedTo90){rotationHelper=(rotationHelper+90)%360; snappedTo90 = false;}
		if(snappedToMin90){rotationHelper=(rotationHelper-90)%360; snappedToMin90 = false;}
		if(rotAngle!=90 || rotAngle!=-90){rotation[2]=rotationHelper;}
		changeSide(10);
	}
	//mousup should stop the animation loop
	window.cancelAnimFrame(timeoutid);
	moving=false; // to be able to render more rapidly
	if(gl){render(0);}

	snapped2=false;
});
$(document).keyup(function (e){
	document.getElementById("canvasOverlay").style.cursor="default";
	if(e.keyCode==16){shiftToggle=false;}
});

$(document).keydown(function (e){
	if(e.altKey){updateUi(5);}
	if(e.shiftKey){/*updateUi(2);*/ shiftToggle=true;document.getElementById("canvasOverlay").style.cursor="move";}		//pan
	if(e.keyCode==76){keyLightToggle=!keyLightToggle;}  				//l for light
	if(e.keyCode==82){updateUi(4);}	//r for rotation around z axis
	if(e.keyCode==71){toggleGrid = !toggleGrid;}	//g for toggleGrid

	if(e.keyCode==38){changeSideHelper(0);} //up key
	if(e.keyCode==40){changeSideHelper(1);} //down key
	if(e.keyCode==37){changeSideHelper(2);} //left key
	if(e.keyCode==39){changeSideHelper(3);} //right key
 	if(e.keyCode==13){toggleFullScreen();} 	// enter
	if(gl){render(0)};
});



$(".ui-slider").mousedown(function(e){
	if(gl&&!alreadyRendering){timeoutid = window.requestAnimFrame(animate);alreadyRendering=true;/*console.log("start rendering");*/};
});
$("canvas").mousedown(function(e){
	moving =true;
	if(gl&&!alreadyRendering){timeoutid = window.requestAnimFrame(animate);alreadyRendering=true;/*console.log("start rendering");*/};
	//console.log("mousedown: " +timeoutid);
	mouseDown = true;
	var canvas = document.getElementById("canvasMain");
	var rect = canvas.getBoundingClientRect();
	oldX = e.clientX - rect.left;
	oldY = e.clientY - rect.top;
	if(touchMeasureToggle){
		xMouseDown = oldX;
		yMouseDown = oldY;
		centerPosition = position.slice(0);
	}
	if(touchZRotationToggle&&!shiftToggle){
		snappedTo90 = false;
		snappedToMin90 = false;
	}
	//if(gl){render(0)};
	dragStartPosition = position.slice(0);
});

});//end document ready


canvas = document.getElementById("canvasMain");
rect = canvas.getBoundingClientRect();
var twidth = rect.right - rect.left;
var theight = -rect.top + rect.bottom;
var oldX0=0;
var oldY0=0;
var oldX1= twidth;
var oldY1=0;

function changeSideHelper(direction){
	if(rotation[2] == 0 || rotation[2] == 360){changeSide(direction);}
	else if(rotation[2] == 180 || rotation[2] == -180){switch(direction){
																					case 0: 	changeSide(1);break;
																					case 1: 	changeSide(0);break;
																					case 2: 	changeSide(3);break;
																					case 3: 	changeSide(2);break;
																							}}
	else if(rotation[2] == 90 || rotation[2] == -270){switch(direction){
																					case 0: 	changeSide(3);break;
																					case 1: 	changeSide(2);break;
																					case 2: 	changeSide(0);break;
																					case 3: 	changeSide(1);break;
																							}}
	else if(rotation[2] == -90 || rotation[2] == 270){switch(direction){
																					case 0: 	changeSide(2);break;
																					case 1: 	changeSide(3);break;
																					case 2: 	changeSide(1);break;
																					case 3: 	changeSide(0);break;
																							}}
}
var boolAlreadyChangedSide = false;
var snapped2;

function handleMouseMove(event) {
	//console.log("handleMouseMove");
	if(!mouseDown){return;}
	var newX = event.clientX - rect.left;
	var newY = event.clientY - rect.top;
	if(touchPanToggle==true || shiftToggle == true){
		moving=true;
		position[0]=dragStartPosition[0]-(newX-oldX)/canvasWidth2*position[2]*Math.tan(15/180*Math.PI)*2*canvasWidth/canvasHeight;
		position[1]=dragStartPosition[1]+(newY-oldY)/canvasHeight2*(position[2])*Math.tan(15/180*Math.PI)*2;
		if(hasMeasurement){drawUpdatePan();}
	}
	else if((keyLightToggle==true||touchLightToggle==true)/*&&(mainPrg != prg2 || mainPrg != prg2)*/ ){
		var closerToLight0;
		if(Math.pow(newX-oldX0,2) + Math.pow(newY-oldY0,2) > Math.pow(newX-oldX1,2) + Math.pow(newY-oldY1,2)){
			closerToLight0 = false;
		}

		else {closerToLight0=true;}
		if(closerToLight0){
			oldX0 = newX;
			oldY0 = newY;
			lightDirection0[0] = lightEllipseFactor*(newX-canvasWidth2/2)/canvasWidth2*2;
			lightDirection0[1] = -lightEllipseFactor*(newY-canvasHeight2/2)/canvasHeight2*2;

			var d = Math.sqrt(Math.pow(lightDirection0[0],2)+Math.pow(lightDirection0[1],2));
			if(d>1){
				lightDirection0[0] = lightDirection0[0]/d;
				lightDirection0[1] = lightDirection0[1]/d;
			}
			lightDirection0[2] = Math.sqrt(1-Math.pow(lightDirection0[0],2)-Math.pow(lightDirection0[1],2));
			if(isNaN(lightDirection0[2])){lightDirection0[2]=0;}
			//console.log(lightDirection0);
		}
		else{
			oldX1 = newX;
			oldY1 = newY;
			lightDirection1[0] = lightEllipseFactor*(newX-canvasWidth2/2)/canvasWidth2*2;
			lightDirection1[1] = -lightEllipseFactor*(newY-canvasHeight2/2)/canvasHeight2*2;
			var d = Math.sqrt(Math.pow(lightDirection1[0],2)+Math.pow(lightDirection1[1],2));
			if(d>1){
				lightDirection1[0] = lightDirection1[0]/d;
				lightDirection1[1] = lightDirection1[1]/d;
			}
			lightDirection1[2] = Math.sqrt(1-Math.pow(lightDirection1[0],2)-Math.pow(lightDirection1[1],2));
			if(isNaN(lightDirection1[2])){lightDirection1[2]=0;}
		}
	}
	else if((keyLightToggle==true||touchLightToggle==true)&&(mainPrg == prg5 || mainPrg == prg6)){
		if(rotation[2]==0 || rotation[2]==360){

			split[1]=-(newY-canvasHeight2/2)/canvasHeight2*2*position[2]/(-1/Math.tan(15/180*Math.PI)*(50*msHeight/msWidth*((msHeight<msWidth) ? msWidth/textureData[0].width:msHeight/msHeight*msWidth/textureData[0].height)))-position[1]/50/msHeight*msWidth;

		}
		else if(rotation[2]==90 || rotation[2]==-270){
			split[1]=-(newX-canvasWidth2/2)/canvasHeight2*2*position[2]/(-1/Math.tan(15/180*Math.PI)*(50*msHeight/msWidth))+position[0]/50/msHeight*msWidth;
		}
		else if(rotation[2]==180 || rotation[2]==-180){
			split[1]=(newY-canvasHeight2/2)/canvasHeight2*2*position[2]/(-1/Math.tan(15/180*Math.PI)*(50*msHeight/msWidth))+position[1]/50/msHeight*msWidth;
		}
		else if(rotation[2]==270 || rotation[2]==-90){
			split[1]=(newX-canvasWidth2/2)/canvasHeight2*2*position[2]/(-1/Math.tan(15/180*Math.PI)*(50*msHeight/msWidth))-position[0]/50/msHeight*msWidth;
		}

	}
	else if(touchZoomToggle==true){
		position[2]=dragStartPosition[2]*((newY-oldY)/canvasHeight2+1);
		if(hasMeasurement){drawUpdateZoom();}
	}
	else if(touchZRotationToggle==true){
		moving = true;

		v1x = oldX-canvasWidth2/2;
		v1y = oldY-canvasHeight2/2;
		v2x =	newX-canvasWidth2/2;
		v2y = newY-canvasHeight2/2;
		//console.log(v1x + " " + v1y);
		rotAngle = Math.asin((-v1x*v2y+v1y*v2x)/(Math.sqrt(v1x*v1x+v1y*v1y)*Math.sqrt(v2x*v2x+v2y*v2y)))*180/Math.PI;
		console.log(rotAngle);
		console.log(rotation[2]);
		if(rotAngle <45 && rotAngle>-45){snapped2=false;}
		if(rotAngle>=45){
			rotAngle=90;
			snappedTo90=true;
			if(!snapped2){
				if(v1x<=0 && v1y<=0 && v2x>0 && v2y>0){
					oldX=canvasWidth2/2+v1y;
					oldY=canvasHeight2/2-v1x;
					rotationHelper+=90;
					snapped2=true;
				} else if(v1x<=0 && v1y>0 && v2x>0 && v2y<=0){
					oldX=canvasWidth2/2+v1y;
					oldY=canvasHeight2/2-v1x;
					rotationHelper+=90;
					snapped2=true;
				} else if(v1x>0 && v1y>0 && v2x<=0 && v2y<=0){
					oldX=canvasWidth2/2+v1y;
					oldY=canvasHeight2/2-v1x;
					rotationHelper+=90;
					snapped2=true;
				} else if(v1x>0 && v1y<=0 && v2x<=0 && v2y>0){
					oldX=canvasWidth2/2+v1y;
					oldY=canvasHeight2/2-v1x;
					rotationHelper+=90;
					snapped2=true;
				}
				console.log("oldx: "+ oldX + "oldy: " + oldY);
			}

		}
		if(rotAngle<=-45){
			rotAngle=-90;
			snappedToMin90=true;
		}
		rotation[2]=rotAngle+rotationHelper;
		if(rotation[2]==-90){rotation[2]+360;}
		if(rotation[2]==360){rotation[2]=0;}
		changeSide(10);
	}
	else if(touchXyRotationToggle==true){
		rotation[1]=(newX-canvasWidth2/2)/canvasWidth2*2*45;
		rotation[0]=(newY-canvasHeight2/2)/canvasHeight2*2*45;
	}
	else if(touchMeasureToggle==true){
		drawArrow(xMouseDown,yMouseDown,newX,newY);
	}
	else if(touchSideToggle==true){
		if(newY-oldY>0.2*canvasHeight2&&!boolAlreadyChangedSide){changeSideHelper(0);boolAlreadyChangedSide=true;}
		else if(-newY+oldY>0.2*canvasHeight2&&!boolAlreadyChangedSide){changeSideHelper(1); boolAlreadyChangedSide=true;}
		else if(newX-oldX>0.2*canvasHeight2&&!boolAlreadyChangedSide){changeSideHelper(2); boolAlreadyChangedSide=true;}
		else if(-newX+oldX>0.2*canvasHeight2&&!boolAlreadyChangedSide){changeSideHelper(3); boolAlreadyChangedSide=true;}
	}
	//if(gl){render(0)};

}

function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }

	rightAside=false;
	$("#rightAside").css("right","-390px");
	$("#contentwrapper").css("right","15px");
	$("#rightAsideButtonIcon").attr("class","sidebarIcon ui-icon ui-icon-triangle-1-w");

  } else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
	rightAside=true;
	$("#rightAside").css("right","15px");
	$("#contentwrapper").css("right","390px");
	$("#rightAsideButtonIcon").attr("class","sidebarIcon ui-icon ui-icon-triangle-1-e");
  }
}

function displayRightAside(boolAside){
	if(boolAside){
		rightAside=true;
		$("#rightAside").css("right","15px");
		$("#contentwrapper").css("right","390px");
		$("#rightAsideButtonIcon").attr("class","sidebarIcon ui-icon ui-icon-triangle-1-e");
	} else {
		rightAside=false;
		$("#rightAside").css("right","-390px");
		$("#contentwrapper").css("right","15px");
		$("#rightAsideButtonIcon").attr("class","sidebarIcon ui-icon ui-icon-triangle-1-w");
	}
return;
}

function setProgressText(boolClear, text, boolIsError){
	if(boolClear){
		if(!boolIsError){ $("#progressText").html("<p>" + text + "</p>");} 
		else{        	  $("#progressText").html("<h2 id='error'>Error: " + text + "</h2>");}
	}
	else{
		if(!boolIsError){ $("#progressText").append("<p>" + text + "</p>");} 
		else{        	  $("#progressText").append("<h2 id='error'>Error: " + text + "</h2>");}
	}


}

var introID =0;
function animateIntroSlider(){
	introID=(introID+1)%($('.featureWrapper').length);
	$("#featureWrapper"+introID).animate(
		{opacity:'1.0'},500,
		function(){$("#featureWrapper"+((introID!=0)?introID-1:$('.featureWrapper').length-1)).css("opacity","0.0");}
	);
}
function changeIntroSlider(direction){
	if(direction==-1){
		introID=((introID!=0)?introID-1:$('.featureWrapper').length-1);
		$('#featureWrapper'+introID).css("opacity","1.0");
		$("#featureWrapper"+((introID+1)%($('.featureWrapper').length))).animate(
		{opacity:'0.0'},200,
		function(){});
	}else if(direction==1){
		introID=(introID+1)%($('.featureWrapper').length);
		$("#featureWrapper"+introID).animate(
		{opacity:'1.0'},200,
		function(){$("#featureWrapper"+((introID!=0)?introID-1:$('.featureWrapper').length-1)).css("opacity","0.0");
		});
	}
console.log(introID);
}
var introPlaying=true;
var introPlayingNr;
$(document).ready(function(){
//$("#radioIntro0")[0].checked =true;
$("#radioIntro0").button("refresh");
$("#radiosetIntro").css("display","block");

introPlayingNr = window.setInterval(animateIntroSlider,5000);
$("#introSliderPrevious")
      .button()
      .click(function( event ) {
       changeIntroSlider(-1);
	});
$("#introSliderPlay")
      .button()
      .click(function( event ){
			if(introPlaying){introPlayingNr=window.clearInterval(introPlayingNr);$("#introPlay").attr("class","ui-icon-play3"); }
			else{introPlayingNr = window.setInterval(animateIntroSlider,5000);$("#introPlay").attr("class","ui-icon-pause2");}
			introPlaying=!introPlaying;
	});
$("#introSliderNext")
      .button()
      .click(function( event ) {
       changeIntroSlider(1);
	});
	/*
$("#introContentWrapper").hover(
  function () {
  	$("#introFeaturesController").css("opacity","1.0");
  },  function () {
  	$("#introFeaturesController").css("opacity","0.0");
  }
);*/
});


function handleOrientation(event) {
	var absolute = event.absolute;
	var alpha    = event.alpha;
	var x     = event.beta;
	var y    = event.gamma;
	if(gl){
		if(window.innerHeight < window.innerWidth){
			rotation = [-y*1.5,x*1.5,boolZRotation ? pZRotation : 0];
		}
		else{
			rotation = [x*1.5,y*1.5,boolZRotation ? pZRotation : 0];
		}
		render();

	}

	// Do stuff with the new orientation data
  }
  window.addEventListener("deviceorientation", handleOrientation, true);


var myOptions;
var myTouchElement = document.getElementById("content");
var hammertime = new Hammer(myTouchElement);//, myOptions);
hammertime.get('pinch').set({ enable: true });
hammertime.get('rotate').set({ enable: true });

hammertime.on("touch", function(ev) {
  console.log("touched");
  dragStartPosition = position.slice(0);
  	oldX = ev.gesture.touches[0].clientX - rect.left;
	oldY = ev.gesture.touches[0].clientY - rect.top;
	//console.log(ev);
   ev.gesture.preventDefault();
});
hammertime.on("drag", function(ev) {
  //console.log(ev);
  var touches = ev.gesture.touches;
  console.log(touches[0].clientY);
  newX=touches[0].clientX - rect.left;
  newY=touches[0].clientY - rect.top;
   ev.gesture.preventDefault();
   if(touchPanToggle==true || shiftToggle == true){
		moving=true;
		position[0]=dragStartPosition[0]-(newX-oldX)/canvasWidth2*position[2]*Math.tan(15/180*Math.PI)*2*canvasWidth/canvasHeight;
		position[1]=dragStartPosition[1]+(newY-oldY)/canvasHeight2*(position[2])*Math.tan(15/180*Math.PI)*2;
	}
	else if(touchLightToggle==true){
   var closerToLight0;
		if(Math.pow(newX-oldX0,2) + Math.pow(newY-oldY0,2) > Math.pow(newX-oldX1,2) + Math.pow(newY-oldY1,2)){
			closerToLight0 = false;
		}

		else {closerToLight0=true;}
		if(closerToLight0){
			oldX0 = newX;
			oldY0 = newY;
			lightDirection0[0] = lightEllipseFactor*(newX-canvasWidth2/2)/canvasWidth2*2;
			lightDirection0[1] = -lightEllipseFactor*(newY-canvasHeight2/2)/canvasHeight2*2;

			var d = Math.sqrt(Math.pow(lightDirection0[0],2)+Math.pow(lightDirection0[1],2));
			if(d>1){
				lightDirection0[0] = lightDirection0[0]/d;
				lightDirection0[1] = lightDirection0[1]/d;
			}
			lightDirection0[2] = Math.sqrt(1-Math.pow(lightDirection0[0],2)-Math.pow(lightDirection0[1],2));
			if(isNaN(lightDirection0[2])){lightDirection0[2]=0;}
			console.log(lightDirection0);
		}
		else{
			oldX1 = newX;
			oldY1 = newY;
			lightDirection1[0] = lightEllipseFactor*(newX-canvasWidth2/2)/canvasWidth2*2;
			lightDirection1[1] = -lightEllipseFactor*(newY-canvasHeight2/2)/canvasHeight2*2;
			var d = Math.sqrt(Math.pow(lightDirection1[0],2)+Math.pow(lightDirection1[1],2));
			if(d>1){
				lightDirection1[0] = lightDirection1[0]/d;
				lightDirection1[1] = lightDirection1[1]/d;
			}
			lightDirection1[2] = Math.sqrt(1-Math.pow(lightDirection1[0],2)-Math.pow(lightDirection1[1],2));
			if(isNaN(lightDirection1[2])){lightDirection1[2]=0;}
		}
		}
		if(gl){render(0);}
});
hammertime.on("transform", function(ev) {
	if(touchZoomToggle==true){
	position[2]=dragStartPosition[2]/ev.gesture.scale;
	}
	if(gl){render(0);}
});
