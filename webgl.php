<!DOCTYPE html>
<!--
license
-->

<?php include("header.php"); ?>
<body>

<div id="home" style="overflow:scroll;">

<div  style="margin-left: 20px;">
<br>
<h1>Minidome's webviewer</h1>
<p>The Minidome's web viewer is a web-based interface. It allows users to interact with the digitized objects through a traditional web browser without the need for installing specific software or the need for specific operating systems. It therefore also facilitates distribution and dissemination of the results. </p>

<h1>Browser requirements</h1>
<p>This viewer uses <span style="color:#ffbb88">html5</span> and is based on the state-of-the-art <span style="color:#ffbb88">WebGL</span> API for rendering 3D graphics through your browser. Altough quite some progress is made to have WebGL standardized on all browsers, whether or not it will work for you will depend on what browser and which version you use.
</p>
<p>The webviewer has been tested for <b><span style="color:#ffbb88">Google Chrome, Apple Safari and Mozilla Firefox</span></b>. Until further notice, <span style="color:#ffbb88">Internet Explorer does not support WebGl yet</span>. According to the latest news, it will be supported in the future version IE11. With respect to mobile devices and tablets, Android is being investigated, and some have already proven to be compliant. A more detailed list will follow. As for Apple's mobile devices and tablets, they do not support WegGL. </p>

<p>Make sure <span style="color:#ffbb88"><b>'WebGL' is activated</b></span> in your brower.You can verify whether your browser and graphics supports WebGL through <a href="http://get.webgl.org/" target="_blank"><span style="color:yellow">http://get.webgl.org/</span></a>. 
For a full WebGL analysis of your system, try out <a href="https://www.khronos.org/registry/webgl/sdk/tests/webgl-conformance-tests.html"><span style="color:yellow">https://www.khronos.org/registry/webgl/sdk/tests/webgl-conformance-tests.html</span></a>.

<p> As already indicated, the viewer exploits your graphics card performance to create live feedback. A good graphics card is always recommended, as some of the display modes are still quite demanding and may cause slight delays, and furthermore, the browser generates some unavoidable overhead.</p>

<h1>Controls</h1>
<p> The two samples here below allow you to experiment with the webviewer. Click on the images or captions to load them straight into the webviewer. If you have trouble, or the samples here below do not appear properly, feel free to pass on the issue to <it>info@minidome.be</it></p>

<p>
The <span style="color:#ffbb88">controls</span> to interact with the webviewer are explained <a href="controls.php"><span style="color:yellow">here</span></a>
</p>
<br><br>

<div align="center">
<a id="linkTesta1" target="_blank" href="">
    <span style="color:yellow"><img src="data/samples/gemseal.jpg" width="30%" border="1px"></span>
</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<a id="linkTestb1" target="_blank" href="">
    <span style="color:yellow"><img src="data/samples/paperseal.jpg" width="30%" border="1px"></span>
</a>
</figure>
</div>

<script>
$("#linkTesta1").attr("href", "viewer.php?file="+encodeURIComponent("data/samples/MB.Gl.30_seal_side3.zun"));
$("#linkTestb1").attr("href", "viewer.php?file="+encodeURIComponent("data/samples/paperseal01_8_200.zun"));
</script>

<!--
<p> Proceed to the <a href="viewer.php"><span style="color:yellow">web viewer</span> here</a>
-->


</div>		

<script src="data/js/jquery/jquery-ui-1.10.1.min.js"></script>
<script src="data/js/home_animate.js"></script>

<!--
<script src="data/js/general.js"></script>
-->
			

</div>
</body>
