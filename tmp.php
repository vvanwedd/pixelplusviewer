﻿<!DOCTYPE html>
<!--
license
-->
<!-- This PHP initiates the web viewer itself, keep the code separated from the minidome webpage -->
<!-- TODO:  eliminiate unused items.. split functionalities.. -->

<head>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8">
	<title>Minidome Viewer</title>
	<!-- STYLE SHEETS -->
	<link href='data/style/greyRed/jquery-ui-1.10.1.custom.css' type='text/css' rel='stylesheet' />
	<link href='data/style/main.css' type='text/css' rel='stylesheet' />
	<script src="data/js/jquery/jquery-1.9.1.min.js"></script> <!--Placed here to avoid flash of unstyled content (http://www.learningjquery.com/2008/10/1-way-to-avoid-the-flash-of-unstyled-content)-->
</head>
<body>

<!--
<header>
	<div id="logo" style="float:left;">
<table>
<tbody>
<tr style="border: none;">
<td style="border: none;"><a href="home.php" target="_blank"><img src="data/style/images/minidome_logo_inv.png" height="45px" /></a></td>
<td style="border: none;"> <h1><a href="home.php" target="_blank">Minidome</a> Viewer</h1></td>
</tr>
</tbody>
</table>
		<a href="home.php" target="_blank"><h1>Minidome Viewer</h1></a>
-->
	</div>
	<div id="mainButtonsWrapper">
		<input id="fileinput" type="file" id="files" name="files[]" title="Open ZUN or CUN file" multiple />
		<input type="submit" value="Open local file" title="Open local ZUN or CUN file" id="ButtonOpenFile" />
		<input type="submit" value="Toggle Fullscreen" title="Enter or leave fullscreen mode" id="ButtonFullScreen" />
	</div>

	<div id="radiosetIntro">
		<input type="radio" id="radioIntro1" name="radio"><label for="radioIntro1">Help</label>
	</div>
	<div id="radioset">
		<input type="radio" id="radio8" name="radio" checked="checked"><label for="radio8"><div title="Mouse/keyboard mode" class="ui-icon-mouse"></div></label>
		<input type="radio" id="radio1" name="radio"><label for="radio1"><div title="Light only/touch mode" class="ui-icon-light"></div></label>
		<input type="radio" id="radio2" name="radio"><label for="radio2"><div title="Pan only/touch mode" class="ui-icon-pan"></div></label>
		<input type="radio" id="radio3" name="radio"><label for="radio3"><div title="Zoom only/touch mode" class="ui-icon-zoom"></div></label>
		<input type="radio" id="radio4" name="radio"><label for="radio4"><div title="Rotate only/touch mode" class="ui-icon-rotz"></div></label>
		<input type="radio" id="radio6" name="radio"><label for="radio6"><div title="3D mode (if 3D available)" class="ui-icon-side"></div></label>
		<input type="radio" id="radio9" name="radio"><label for="radio9"><div title="Show controls in separate page" class="ui-icon-helpme"></div></label>


<!--
		<script>
		$("#radio9").attr("href", "webgl.php");
		</script>
<input type="radio" id="radio5" name="radio"><label for="radio5">XY R</label>
<input type="radio" id="radio7" name="radio"><label for="radio7">Meas</label>
-->

	</div>
		
		<div id="wip" align="middle"> <b><span style="color:red">..Site under construction..</span></b> </div>
</header>
<div id="main">
		<div id="contentwrapper">
			<div id="mainIntro">
				
				<div id="introContentWrapper">
<!--REM <a href="http://www.arts.kuleuven.be/info/ONO/Meso/digitalisatie" target="_blank">Click here for more information on the Minidome.</a></p>-->
<!--
						<h1>Introduction</h1>
						<p>This web-based viewer allows to interactively investigate the 3D surface and material characteristics of specimen recordind in the Minidome.

-->

<!--
<div id="introFeatures">
<div id="introFeaturesController">
<div id="introSliderControl">
<input type="submit" id="introSliderPrevious"><label class="introLabel" for="introSliderPrevious"><div class="ui-icon-previous"></div></label>
<input type="submit" id="introSliderPlay"><label class="introLabel" for="introSliderPlay"><div id="introPlay" class="ui-icon-pause2"></div></label>
<input type="submit" id="introSliderNext"><label class="introLabel" for="introSliderNext"><div class="ui-icon-next"></div></label>
</div>
</div>
</div>
-->

<!--REM -->
<!--
					<div id="introLinks" style="overflow:auto;">
						<h1>Links</h1>
						<div class="introLinksItem"><a href="http://www.esat.kuleuven.be/psi/visics/" target="_blank"><h2>VISICS</h2></a>Computer Vision < PSI < ESAT < KU Leuven</li></div>
						<div class="introLinksItem"><a href="http://www.arts.kuleuven.be/info/ONO/Meso/digitalisatie" target="_blank"><h2>Digitization of Cuneiform Tablets</h2></a>Background info on the Minidome</li></div>
						<div class="introLinksItem"><a href="http://www.arts.kuleuven.be/info/ONO/Meso/cuneiformcollection" target="_blank"><h2>Leuven Cuneiform Collection</h2></a>Recorded with the Minidome</li></div>
						<div class="introLinksItem"><a href="http://www.arts.kuleuven.be/info/ONO/Meso/cornell" target="_blank"><h2>Cornell University Near Eastern Studies Collection: CUSAS 8</h2></a>Recorded with the Minidome</li></div>
						<div class="introLinksItem"><a href="http://www.arc3d.be" target="_blank"><h2>ARC3D</h2></a>Convert your images into 3D</li></div>
						<div class="introLinksItem"><a href="http://www.flandrica.be/" target="_blank"><h2>Flandrica.be</h2></a>Flemish cultural heritage libraries</li></div>
						<div class="introLinksItem"><a href="http://cdli.ucla.edu/" target="_blank"><h2>cdli</h2></a>Cuneiform Digital Library Initiative</li></div>
					</div>
-->
<!--REM -->

</div>
				
			</div>
<div id="downloadIndicator"><h2>Downloading file to browser memory</h2><div id="progressbar"><div class="percent">0%</div></div></div>
			<div id="errorMessages"></div>
			<div id="loader"><h2>Reading file</h2><img src="data/style/images/ajax-loader.gif"></div>
			
			<div id="content">
				<canvas id='canvasMain'>
				Your browser does not support the HTML5 canvas element. If possible, please upgrade your browser.
				</canvas>
</div>
			</div>
			
		</div>

		<div id="rightAside">
		<h3 style="border-top:0; margin-bottom:-1px;">Metadata</h3>
		<div>
			<ul class="aside metadata">
				<li>Collection number: <input disabled type="text" id="inputColNum" value=""></li>
				<li>Database number: <input disabled type="text" id="inputDbNum" value=""></li>
				<li>Publication number: <input disabled type="text" id="inputPubNum" value=""></li>
				<li>Site Provenance: <input disabled type="text" id="inputSiteProv" value=""></li>
				<li>Time period: <input disabled type="text" id="inputTimePeriod" value=""></li>
				<li>Relative date: <input disabled type="text" id="inputRelDate" value=""></li>
				<li>Genre: <input disabled type="text" id="inputGenre" value=""></li>
				<li>Medium: <input disabled type="text" id="inputMedium" value=""></li>
				<!-- <li>Seal: <input disabled type="text" id="inputSeal" value=""></li> -->
				<li>w x h x thickness: <input disabled type="text" id="inputColNum" value=""></li>
				<li>Publication: <textarea disabled id="inputPublication"></textarea></li>
				<li>Description: <textarea disabled id="inputDescription"></textarea></li>
				<li>Notes: <textarea disabled id="inputNotes"></textarea></li>
			</ul>
		  </div>

		  <h3 style="margin-bottom:0;">Display</h3>

		  <div>
		        
		        <button onclick="animateTest()">rotate</button>
                        
						<div id="positioning">
					<h4>Position</h4>	
					<input type="submit" value="Reset" id="ButtonResetPosition" /><input type="submit" value="Display 1:1" id="Button1on1Position" />			
				</div>
				<div id="reflectanceset">
					<h4>Reflectance source</h4>
					<input type="radio" id="color0" name="radio3" checked="checked"><label for="color0">Albedo</label>
					<input type="radio" id="color1" name="radio3"><label for="color1">Ambient</label>
				</div>
				<div id="colorset">
					<h4>Color source</h4>
					<input type="radio" id="colorIRG" name="radioColorSet"><label for="colorIRG">IRG</label>
					<input type="radio" id="colorIGB" name="radioColorSet"><label for="colorIGB">IGB</label>
					<input type="radio" id="colorRGB" name="radioColorSet" checked="checked"><label for="colorRGB">RGB</label>
					<input type="radio" id="colorRGU" name="radioColorSet"><label for="colorRGU">RGU</label>
					<input type="radio" id="colorGBU" name="radioColorSet"><label for="colorGBU">GBU</label>
					<input type="radio" id="colorI" name="radioColorSet"><label for="colorI">I</label>
					<input type="radio" id="colorR" name="radioColorSet"><label for="colorR">R</label>
					<input type="radio" id="colorG" name="radioColorSet"><label for="colorG">G</label>
					<input type="radio" id="colorB" name="radioColorSet"><label for="colorB">B</label>
					<input type="radio" id="colorU" name="radioColorSet"><label for="colorU">U</label>
				</div>
				<div id="normalset">
                                        <h4>Normal source</h4>
                                        <input type="radio" id="normalI" name="radioNormalSet"><label for="normalI">I</label>
                                        <input type="radio" id="normalR" name="radioNormalSet"><label for="normalR">R</label>
                                        <input type="radio" id="normalG" name="radioNormalSet" checked="checked"><label for="normalG">G</label>
                                        <input type="radio" id="normalB" name="radioNormalSet"><label for="normalB">B</label>
                                        <input type="radio" id="normalU" name="radioNormalSet"><label for="normalU">U</label>
                                </div>
			<div id="shaderset">
				<h4>Visual style</h4>
				<input type="radio" id="shader1" name="radio1" checked="checked"><label for="shader1" id="lshader1">Color</label>
				<input type="radio" id="shader8" name="radio1"><label for="shader8" id="lshader8">sharpen</label>
				<!--<input type="radio" id="shader2" name="radio1"><label for="shader2">Specular color</label>-->
				<input type="radio" id="shader3" name="radio1"><label for="shader3" id="lshader3">Shaded</label>
				<input type="radio" id="shader4" name="radio1"><label for="shader4" id="lshader4">Shaded exaggerated</label>
				<input type="radio" id="shader5" name="radio1"><label for="shader5" id="lshader5">Sketch 1</label>
				<input type="radio" id="shader6" name="radio1"><label for="shader6" id="lshader6">Sketch 2</label>
				<span style="display:none;"><input type="radio" id="shader7" name="radio1"><label for="shader7" id="lshader7">xray</label></span>
				<input type="radio" id="shader9" name="radio1"><label for="shader9" id="lshader9">curvature</label>
				<input type="radio" id="shader10" name="radio1"><label for="shader10" id="lshader10">normals</label>
 				<input type="radio" id="shader11" name="radio1"><label for="shader11" id="lshader11">HSH RTI</label>
				<input type="radio" id="shader12" name="radio1"><label for="shader12" id="lshader12">PTM RTI</label>
			</div>
			<div id="filterparameters">
				<h4>Filter parameters</h4>
				<span id="light0wrapper"><span id="light0">Intensity 1: </span><div id="sliderLight0"></div></br></span>
				<span id="light1wrapper"><span id="light1">Intensity 2: </span><div id="sliderLight1"></div></br></span>
				<span id="param0wrapper" style="display:none;"><span id="param0">Param 0: </span><div id="sliderParam0"></div></br></span>
				<span id="param1wrapper" style="display:none;"><span id="param1">Param 1: </span><div id="sliderParam1"></div></br></span>
			</div>
			<p><br><br></p>
			<div id="printing">
				<h4>Printing</h4>
				<ul class="aside metadata">
				<li>Name: <input type="text" id="inputOffscreenName" value="" width="90%"></li>
				<li><button id="buttonPrint">Take 1:1 printout</button></li>
				</ul>
				
			<a id="aOffscreenHelper" download="a.jpg" href="" style="display:none;">link</a>
			<canvas id="canvasOffscreenHelper" style="display:none;"></canvas>
			<img id="imgOffscreenHelper" style="display:none;">
		<!-- used to load ZUNs directly into the website. Note that the URL has to be encoded/decoded -->
		<?php
			if(isset($_GET["file"])){
				echo "<script> $(document).ready(function() {xhrTest( encodeURIComponent('" . $_GET["file"] . "'))});</script>";
			}
		?>
			</div>
		  </div>

        </div>
		<div id="rightAsideButton"><span id="rightAsideButtonIcon" class="sidebarIcon ui-icon ui-icon-triangle-1-w"></span></div>
    </div>
    <footer><!-- Defining the footer section of the page -->
        © Copyright KU Leuven
    </footer>





<!-- JAVASCRIPT -->

<script src="data/js/jquery/jquery-ui-1.10.1.min.js"></script>
	
<script src="data/js/cunparser/parser.js"></script>
<script src="data/js/cunparser/zlib_and_gzip.min.js"></script>
<script src="data/js/cunparser/base64.js"></script>
<script src="data/js/cunparser/bzip2min.js"></script>

<script src="data/js/webgl/gl-matrix-min.js"></script>
<script src="data/js/webgl/utils.js"></script>
<script src="data/js/webgl/program.js"></script>
<script src="data/js/webgl/scene.js"></script>
<script src="data/js/webgl/grid.js"></script>
<script src="data/js/webgl/objectLight.js"></script>
<script src="data/js/webgl/objectPlane.js"></script>
<script src="data/js/webgl/main.js"></script>
<!--<script src="data/js/measurement.js"></script>-->
<script src="data/js/interaction.js"></script>


</body>
</html>
