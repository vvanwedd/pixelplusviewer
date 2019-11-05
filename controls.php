<!DOCTYPE html>
<!--
license
-->

<?php include("header.php"); ?>
<body>

<div id="home" style="overflow:scroll;">


<div  style="margin-left: 20px;">

<h1>Controls</h1>
<p>The interactive visualization is controlled by mouse/keyboard or touch input. Specific visualization modes, as indicated in the Display tab on the right hand side of the screen, are set by clicking the corresponding buttons.</p>

<h2>Light sources:</h2>

The viewer shows two virtual light sources indicated with a pyramidical shape. By clicking and dragging them over the object, one can simulate the effect of the relighting the object. The intensities of the two light sources can be controlled by the two sliders in the bottom part of the display tab on the right.
<br><span style="color:#ffbb88">If the lights are not visible, press the L-key.</span>

<h2>Mouse/Keyboard vs Touch:</h2>

Using the mouse and keyboard, all possible manipulations can be controlled by a combination of a mouse button and a key.
In touch or mobile systems, keys may be missing. In that case a number of additional buttons are provided to trigger any of the individual manipulation modes. So far a 'single' touch approach is used.</br></br>

<table align="center">
<tr>
	<td><img src="images/lights.jpg" height="5%" /></td>
	<td>Light controls</td>
</tr>
<tr>
	<td><img src="images/mousekey.jpg" /></td>
	<td>Mouse + Keyboard input <br> See shortcuts in the table below</td>
</tr>
<tr>
	<td><img src="images/touch.jpg" /></td>
	<td>Touch / selective input</td>
</tr>
</table>

<p> The tables below shows the conventions for mouse button and/or keyboard combinations.
<table align="center">
<tr>
	<td>Desired action</td>
	<td>Mouse + Keyboard input</td>
	<td>Touch input</td>
</tr>
<tr>
	<td>Change lightdirection</td>
	<td>Click left mouse button to drag virtual lights<br>Press L-key to show/hide the virtual lights</td>
	<td>Tap the light mode icon<br>Click and Drag virtual light</td>
</tr>
<tr>
	<td>Pan</td>
	<td>Press left mouse button and hold Shift key<br>Drag object</td>
	<td>Tap the Drag mode icon <br>Drag object</td>
</tr>
<tr>
        <td>Zoom</td>
        <td>Scroll mouse wheel</td>
	<td>Tap the Zoom mode icon <br>Drag up or down on the scene</td>
</tr>
<tr>
        <td>Rotate</td>
	<td>Hold Shift key and scroll mouse wheel</td>
        <td>Tap the rotate mode icon <br> Drag (counter)clockwise on the scene</td>
</tr>
<tr>
	<td>Change active side of the specimen:</td>
	<td>Press Up/Down/Left/Right arrow keys</td>
	<td>Tap the side mode icon<br>Drag up/down/left/right</td>
</tr>
</table>
</div>		
<br><br><br>

<script src="data/js/jquery/jquery-ui-1.10.1.min.js"></script>
<script src="data/js/home_animate.js"></script>

<!--
<script src="data/js/general.js"></script>
-->
			

</div>
</body>
