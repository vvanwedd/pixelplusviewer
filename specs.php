<!DOCTYPE html>
<!--
license
-->

<?php include("header.php"); ?>
<body>

<div id="home" style="overflow:scroll;">

<div id="homeText" style="margin-left: 20px;" >
<br>
<h1>Processing and Results</h1>
<p>
Thanks to the unique design of the Minidome and robust photometric techniques, surface characteristics of the object such as color and local surface orientation can be calculated to accuracies exceeding those of expensive scanners. The results can be viewed in the Minidome viewer. By interacting with virtual light sources, the object can be viewed under different lighting conditions in real time. In order to guarantee real-time feedback, the software exploits the power of your graphics card. The display modes on the right side of the interface give the user the necessary control to visualize the object under different photo-realistic as well as artificial circumstances, highlighting details that can not be observed under ordinary lighting. Additional modes allow to highlight specific characteristics in both shape and material. The sketch modes for instance, visualize specific shape variations and create line-drawing-like renders which are ready for immediate print-out or publication.
</p>
<p>The Minidome comes with an integrated software package for recording, processing and visualization of the results, also referred to as <span style="color:#ffbb88">PLD</span> package. The acquisition and processing software come with the dome hardware. The <span style="color:#ffbb88">PLDViewer</span> is free downloadable for viewing results. The latest version 4.1.6 is released for Windows, Newer versions for Mac OS will be released in the near future.<p>

<p> As an alternative, also a web-based viewer is offered, providing a platform independent solution. More information can be found on 
<a href="webgl.php"><span style="color:yellow">Minidome's Webviewer: Browser requirements and Controls</span></a></p>
</div>


<div id="homeTextBot" style="margin-left: 20px;" > <!-- links -->
<p>
The minidome has already been involved in digitizing individual specimen and entire collections. A few useful links:
<a href="http://www.esat.kuleuven.be/psi/visics/" target="_blank">PSI-ESAT-KULeuven</a>,
<a href="http://www.3d-coform.eu/" target="_blank">3D-Coform</a>,
<a href="http://www.vcc-3d.org" target="_blank">VCC-3D</a>,
<a href="http://www.naturalsciences.be" target="_blank">Natural Sciences</a>,
<a href="http://www.arts.kuleuven.be/info/ONO/Meso/digitalisatie" target="_blank">Digitization of Cuneiform Tablets</a>,
<a href="http://www.arts.kuleuven.be/info/ONO/Meso/cuneiformcollection" target="_blank">Leuven Cuneiform Collection</a>,
<a href="http://www.flandrica.be/" target="_blank">Flemish cultural heritage libraries</a>,
<a href="http://finds.org.uk" target="_blank">Portable Antiquity Scheme</a>,
<a href="http://www.ambientepi.arti.beniculturali.it/flash/musei/smatteo/index.html" target="_blank">Pisa San Matteo Museum</a>
<!--
<a href="http://www.arts.kuleuven.be/info/ONO/Meso/cornell" target="_blank"><h2>Cornell University Near Eastern Studies Collection: CUSAS 8</h2></a>
<a href="http://www.arc3d.be" target="_blank"><h2>ARC3D</h2></a>Convert your images into 3D
<a href="http://www.flandrica.be/" target="_blank"><h2>Flandrica.be</h2></a>Flemish cultural heritage libraries
<a href="http://cdli.ucla.edu/" target="_blank"><h2>cdli</h2></a>Cuneiform Digital Library Initiative
-->
</p>
</div> <!-- links -->

<div height="500pt" width="100%" top="5%" position="absolute"> <!-- loop -->
<div align="center" top="50px">
<!-- feature wrappers: areas with different background that are looped in home_animate.js -->
<div class="featureWrapper" id="featureWrapper0"><div class="featureMain" id="featureImages1"></div><div class="featureText"></div></div>
<div class="featureWrapper" id="featureWrapper1"><div class="featureMain" id="featureImages2"></div><div class="featureText"></div></div>
<div class="featureWrapper" id="featureWrapper2"><div class="featureMain" id="featureImages3"></div><div class="featureText"></div></div>
</div>

<!-- these disappear, solve..  -->
<!--
<div id="introFeaturesController" align="center">
<div id="introSliderControl">
<input type="submit" id="introSliderPrevious"><label class="introLabel" for="introSliderPrevious"><div class="ui-icon-previous"></div></label>
<input type="submit" id="introSliderPlay"><label class="introLabel" for="introSliderPlay"><div id="introPlay" class="ui-icon-pause2"></div></label>
<input type="submit" id="introSliderNext"><label class="introLabel" for="introSliderNext"><div class="ui-icon-next"></div></label>
</div>
</div>
-->
</div> <!-- loop -->




</div> <!-- div home -->



<script src="data/js/jquery/jquery-ui-1.10.1.min.js"></script>
<script src="data/js/home_animate.js"></script>

<!--
<script src="data/js/general.js"></script>
-->

</body>
</html>