<!DOCTYPE html>
<head>
  <!-- Global site tag (gtag.js) - Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=UA-155530128-1"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'UA-155530128-1');
  </script>

  <meta http-equiv="content-type" content="text/html; charset=UTF-8">
  <title>pixel+ Viewer</title>
  <link href="https://fonts.googleapis.com/css?family=Didact+Gothic&display=swap&subset=cyrillic,cyrillic-ext,greek,greek-ext,latin-ext" rel="stylesheet">
  <link href='data/style/greyRed/jquery-ui-1.10.1.custom.css' type='text/css' rel='stylesheet' />
  <link href='data/style/main.css' type='text/css' rel='stylesheet' />
  <script src="data/js/jquery/jquery-1.9.1.min.js"></script> <!--Placed here to avoid flash of unstyled content (http://www.learningjquery.com/2008/10/1-way-to-avoid-the-flash-of-unstyled-content)-->
</head>
<body>
  <header>
    <div id="logo" style="float:left;">
      <h1><a href="../index.html" target="_blank">heritage visualisation</a> </h1>
      <h1><a href="viewer.php" target="_blank">pixel+ viewer</a> </h1>
    </div>
    <div id="mainButtonsWrapper">
      <input id="fileinput" type="file" id="files" name="files[]" title="Open local PTM/RTI/CUN/ZUN file" multiple />
      <input type="submit" value="Open Local File" title="Open local PTM/RTI/CUN/ZUN file" id="ButtonOpenFile" />
      <input type="submit" value="Toggle Fullscreen" title="Enter or leave fullscreen mode" id="ButtonFullScreen" />
    </div>
	<div id="radioset">
      <input type="radio" id="radio8" name="radio" checked="checked"><label for="radio8"><div title="Mouse/keyboard mode" class="ui-icon-mouse"></div></label>
      <input type="radio" id="radio1" name="radio"><label for="radio1"><div title="Light only/touch mode" class="ui-icon-light"></div></label>
      <input type="radio" id="radio2" name="radio"><label for="radio2"><div title="Pan only/touch mode" class="ui-icon-pan"></div></label>
      <input type="radio" id="radio3" name="radio"><label for="radio3"><div title="Zoom only/touch mode" class="ui-icon-zoom"></div></label>
      <input type="radio" id="radio4" name="radio"><label for="radio4"><div title="Rotate only/touch mode" class="ui-icon-rotz"></div></label>
      <input type="radio" id="radio6" name="radio"><label for="radio6"><div title="3D mode (if 3D available)" class="ui-icon-side"></div></label>
      <input type="radio" id="radio9" name="radio"><label for="radio9"><div title="Help" class="ui-icon-helpme"></div></label>
    </div>
  </header>
  <div id="main">
    <div id="contentwrapper">
      <div id="mainIntro">
        <div id="introContentWrapper">
        </div>
      </div>
      <div id="progressIndicator">
        <h2 id="progressText">Downloading file to browser memory</h2><div id="progressbar"><div class="percent">0%</div></div></div>
				<div id="errorMessages"></div>
			<div id="content">
				<canvas id='canvasMain'>Your browser does not support the HTML5 canvas element. If possible, please upgrade your browser.</canvas>
				<canvas id="canvasOverlay">Your browser does not support the HTML5 canvas element. If possible, please upgrade your browser.</canvas>
			</div>
		</div>
		<div id="rightAside">
		<h3 style="border-top:0; margin-bottom:-1px;">Metadata</h3>
		<div>
			<ul class="aside metadata">
			  <li>Filename: <input disabled id="inputFilename"></li>
			  <li>Type: <input disabled id="inputType"></li>
			  <li>Dimensions: <input disabled id="inputDimensions"></li>
				<li>Publication: <textarea disabled id="inputPublication"></textarea></li>
				<li>Description: <textarea disabled id="inputDescription"></textarea></li>
				<li>Notes: <textarea disabled id="inputNotes"></textarea></li>
			</ul>
		  </div>

		  <h3 style="margin-bottom:0;">Display</h3>

		  <div>

		  <div id="shaderset">
				<h4>Visual style</h4>
				<div class="visualstyle">
				  <h5>PLD</h5>
				  <input type="radio" id="shader1" name="radio1" checked="checked"><label for="shader1" title="The ‘Color’ style implements how a diffuse material reflects light and is as such the inverse of the principle of Photometric Stereo (in which the albedo and surface normal get disentangled. This model is sometimes referred to as Lambertian reflectance. The reflected intensity is proportional to the cosine of the angle between the light direction and the normal vector." id="lshader1">Default color</label>
				  <input type="radio" id="shader8" name="radio1"><label for="shader8" id="lshader8" title="This visual style is the same as the Color style, except that the color map is sharpened. 2 parameters control the sharpening: Percentage and Size.">Sharpen</label>
				  <!--<input type="radio" id="shader2" name="radio1"><label for="shader2">Specular color</label>-->
				  <input type="radio" id="shader3" name="radio1"><label for="shader3" id="lshader3" title="This visual style is the same as the Color style, except that the Albedo is set to a uniform value. By removing the local color information from the image, a more careful study of the surface orientation is possible by carefully changing the virtual light direction.">Shaded</label>
				  <input type="radio" id="shader4" name="radio1"><label for="shader4" id="lshader4" title="This visual style is the same as the Shaded style, except that surface orientation is exaggerated w.r.t. the orientation parallell to the camera direction.">Shaded exaggerated</label>
				  <input type="radio" id="shader5" name="radio1"><label for="shader5" id="lshader5" title="This visual style is inspired by pencil drawings of objects with local relief like cuneiform tablets. Where the surface direction locally abrubtly changes, a black pixel value is set.">Sketch 1</label>
				  <input type="radio" id="shader6" name="radio1"><label for="shader6" id="lshader6">Sketch 2</label>
				  <span style="display:none;"><input type="radio" id="shader7" name="radio1"><label for="shader7" id="lshader7">xray</label></span>
				  <input type="radio" id="shader9" name="radio1"><label for="shader9" id="lshader9">Curvature</label>
				  <input type="radio" id="shader10" name="radio1"><label for="shader10" id="lshader10" title="The surface orientation is described by a vector that is perpendicular to the surface and is being refered to as the normal vector or more simply the normal. This calculation is performed for every pixel, resulting in a normal map or normal texture. The x, y and z components of the normal vector n at a particular pixel are stored as red, green and blue values.">Normals</label>
				</div>
				<div class="visualstyle">
				  <h5>HSH RTI</h5>
 				  <input type="radio" id="shader11" name="radio1"><label for="shader11" id="lshader11">Default color</label>
				  <input type="radio" id="shader13" name="radio1"><label for="shader13" id="lshader13">Specular Enhanchement</label>
				  <input type="radio" id="shader15" name="radio1"><label for="shader15" id="lshader15">HSH Sharpening</label>
				 <!-- <input type="radio" id="shader16" name="radio1"><label for="shader16" id="lshader16">Normals sharpening</label>-->
				</div>
				<div class="visualstyle">
				  <h5>PTM</h5>
				  <input type="radio" id="shader12" name="radio1"><label for="shader12" id="lshader12">Default color</label>
				  <input type="radio" id="shader14" name="radio1"><label for="shader14" id="lshader14">Specular Enhancement</label>
				</div>
			</div>
			<div id="filterparameters">
				<h4>Filter parameters</h4>
				<div class="visualstyle">

				<div id="light0wrapper" class="paramwrapper"><span id="light0">Intensity 1: </span><div id="sliderLight0"></div></br></div>
				<div id="light1wrapper" class="paramwrapper"><span id="light1">Intensity 2: </span><div id="sliderLight1"></div></br></div>
				<div id="param0wrapper" class="paramwrapper" style="display:none;"><span id="param0">Param 0: </span><div id="sliderParam0"></div></br></div>
				<div id="param1wrapper" class="paramwrapper" style="display:none;"><span id="param1">Param 1: </span><div id="sliderParam1"></div></br></div>
				<div id="param2wrapper" class="paramwrapper" style="display:none;"><span id="param2">Param 2: </span><div id="sliderParam2"></div></br></div>
				<div id="param3wrapper" class="paramwrapper" style="display:none;"><span id="param3">Param 3: </span><div id="sliderParam3"></div></br></div>
				</div>
			</div>
			<div id="reflectanceset">
					<h4>Reflectance source</h4>
					<div class="visualstyle">

					<input type="radio" id="color0" name="radio3" checked="checked"><label for="color0">Albedo</label>
					<input type="radio" id="color1" name="radio3"><label for="color1">Ambient</label>
				</div>
				</div>
				<div id="colorset">
					<h4>Color source</h4>
					<div class="visualstyle">
                                                <input type="radio" id="colorI" name="radioColorSet"><label for="colorI">IR</label>
                                                <input type="radio" id="colorR" name="radioColorSet"><label for="colorR">R</label>
                                                <input type="radio" id="colorG" name="radioColorSet"><label for="colorG">G</label>
                                                <input type="radio" id="colorB" name="radioColorSet"><label for="colorB">B</label>
                                                <input type="radio" id="colorU" name="radioColorSet"><label for="colorU">UV</label>
						<input type="radio" id="colorIRG" name="radioColorSet"><label for="colorIRG">IRG</label>
						<input type="radio" id="colorIGB" name="radioColorSet"><label for="colorIGB">IGB</label>
						<input type="radio" id="colorRGB" name="radioColorSet" checked="checked"><label for="colorRGB">RGB</label>
						<input type="radio" id="colorRGU" name="radioColorSet"><label for="colorRGU">RGU</label>
						<input type="radio" id="colorGBU" name="radioColorSet"><label for="colorGBU">GBU</label>
					</div>
				</div>
				<div id="normalset">
                	<h4>Normal source</h4>
					<div class="normalsource">
				  		<h5>PLD</h5>
                        <input type="radio" id="normalI" name="radioNormalSet"><label for="normalI">IR</label>
                        <input type="radio" id="normalR" name="radioNormalSet"><label for="normalR">R</label>
                        <input type="radio" id="normalG" name="radioNormalSet" checked="checked"><label for="normalG">G</label>
                        <input type="radio" id="normalB" name="radioNormalSet"><label for="normalB">B</label>
                        <input type="radio" id="normalU" name="radioNormalSet"><label for="normalU">UV</label>

					</div>
					<div class="normalsource">
				  		<h5>HSH RTI</h5>
							<input type="radio" id="normalHSH" name="radioNormalSet"><label for="normalHSH">HSH</label>
					</div>
					<div class="normalsource">
				  		<h5>PTM</h5>
							<input type="radio" id="normalPTM" name="radioNormalSet"><label for="normalPTM">PTM</label>
					</div>
                </div>


				<div id="positioning">
					<h4>Position</h4>
					<div class="visualstyle">

					<button id="ButtonResetPosition">Reset</button>
					<button id="Button1on1Position">Display 1:1</button>
					<button id="ButtonRotatePosition" >Rotate 90 degrees</button>
					</div>
				</div>
			<!--	<button onclick="animateTest()">lightanimationtest</button>-->


			<p><br><br></p>
			<div id="printing">
				<h4>Printing</h4>
				<div class="visualstyle">
					<ul class="aside metadata">
						<li>Name: <input type="text" id="inputOffscreenName" value="" width="90%"></li>
						<li><button id="buttonPrint">Take 1:1 printout</button></li>
					</ul>
				</div>
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
        © Copyright <a href="http://www.heritage-visualisation.org/pixelplus.html#project-partners">pixel+ project</a>
    </footer>





<!-- JAVASCRIPT -->

<script src="data/js/jquery/jquery-ui-1.10.1.min.js"></script>
<script src="data/js/hammer.min.js"></script>

<script src="data/js/cunparser/parser.js"></script>
<script src="data/js/cunparser/zlib_and_gzip.min.js"></script>
<script src="data/js/cunparser/bzip2min.js"></script>

<script src="data/js/webgl/gl-matrix-min.js"></script>
<script src="data/js/webgl/utils.js"></script>
<script src="data/js/webgl/program.js"></script>
<script src="data/js/webgl/scene.js"></script>
<script src="data/js/webgl/objectLight.js"></script>
<script src="data/js/webgl/objectPlane.js"></script>
<script src="data/js/webgl/main.js"></script>
<script src="data/js/measurement.js"></script>
<script src="data/js/interaction.js"></script>




</body>
</html>
