//not needed anymore since measurements will be drawn in WebGL to avoid slow canvasoperations

var overlayContext =null;// document.getElementById('canvasOverlay').getContext('2d');
var xMouseDown=null;
var yMouseDown=null;
var xMouseUp=null;
var yMouseUp=null;
var xPointA=null;
var yPointA=null;
var xPointB=null;
var yPointB=null;
var zoomWhenDrawn;
var centerPosition;
var hasMeasurement = false;

function measure(){ 
 
drawArrow(100,100,200,300);

}

function drawArrow(xA, yA, xB, yB){
	hasMeasurement = true;
	overlayContext.strokeStyle="#00ff00";
	overlayContext.fillStyle = "#00ff00";
	overlayContext.clearRect(0, 0, canvasWidth, canvasHeight);
	overlayContext.beginPath();
		
	var headLength = 10;	
	var dx = xB-xA;
	var dy = yB-yA;
	var angle = Math.atan2(dy,dx);
	overlayContext.moveTo(xA, yA);
	overlayContext.lineTo(xA-headLength*Math.cos(angle+5*Math.PI/6),yA-headLength*Math.sin(angle+5*Math.PI/6));
	overlayContext.moveTo(xA, yA);
	overlayContext.lineTo(xA-headLength*Math.cos(angle-5*Math.PI/6),yA-headLength*Math.sin(angle-5*Math.PI/6));
	overlayContext.moveTo(xA, yA);
	//overlayContext.lineTo(xA-headLength*Math.cos(angle-Math.PI/6),yA-headLength*Math.sin(angle-Math.PI/6));
	overlayContext.lineTo(xB, yB);
	overlayContext.lineTo(xB-headLength*Math.cos(angle-Math.PI/6),yB-headLength*Math.sin(angle-Math.PI/6));
	overlayContext.moveTo(xB, yB);
	overlayContext.lineTo(xB-headLength*Math.cos(angle+Math.PI/6),yB-headLength*Math.sin(angle+Math.PI/6));
  		
	overlayContext.closePath();
  	overlayContext.stroke();
	var scaleFactor = 1/canvasHeight/(-50/Math.tan(15/180*Math.PI)/position[2]/imgDim[0]*imgDim[1]/imgDim[0]);
	console.log(xB + " " + xB*scaleFactor);
	overlayContext.fillText(Math.sqrt(Math.pow((xB-xA)*scaleFactor,2)+Math.pow((yB-yA)*scaleFactor,2))*mMmPerPixel + " mm", (xB+xA)/2, (yB+yA)/2);
	zoomWhenDrawn = position[2];
	xPointA=xA;
	yPointA=yA;
	xPointB=xB;
	yPointB=yB;
}

function drawUpdateZoom(){
	var zoomFactor = zoomWhenDrawn/position[2];
	xPointA = canvasWidth/2 + zoomFactor*(xPointA-canvasWidth/2);
	xMouseDown=xPointA;
	xPointB = canvasWidth/2 + zoomFactor*(xPointB-canvasWidth/2);
	xMouseUp = xPointB;
	yPointA = canvasHeight/2 + zoomFactor*(yPointA-canvasHeight/2);
	yMouseDown = yPointA;
	yPointB = canvasHeight/2 + zoomFactor*(yPointB-canvasHeight/2);
	yMouseUp = yPointB;
	//console.log(zoomWhenDrawn + " " +position[2] + " "+zoomFactor);
	//console.log(xPointA + " " + yPointA + " " + xPointB + " " + yPointB);	
	drawArrow(xPointA, yPointA, xPointB, yPointB);
	centerPosition = position.slice(0);
}

function drawUpdatePan(){
	var panFactor = -1/(position[2]*Math.tan(15/180*Math.PI)*2/canvasHeight);

	xPointA = xMouseDown + (position[0]-centerPosition[0])*panFactor;
	yPointA = yMouseDown - (position[1]-centerPosition[1])*panFactor;
	xPointB = xMouseUp + (position[0]-centerPosition[0])*panFactor;
	yPointB = yMouseUp - (position[1]-centerPosition[1])*panFactor;
	drawArrow(xPointA, yPointA, xPointB, yPointB);
}
