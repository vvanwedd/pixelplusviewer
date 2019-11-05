///globals   
document.oncontextmenu = document.body.oncontextmenu = function() {return false;}

$(document).ready(function(){
	$( document ).tooltip();

	$("#GotoWebviewer")
		.button()
		.click(function( event ) { document.location.href = "webgl.php"; });
	$("#GotoHome")
		.button()
		.click(function( event ) { document.location.href = "home.php"; });
	$("#GotoSpecs")
		.button()
		.click(function( event ) { document.location.href = "specs.php"; });
});



/*
// Create the XHR object.
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}


// Make the actual CORS request.
function xhrTest(zurl) {
  // All HTML5 Rocks properties support CORS.

  var xhr = createCORSRequest('GET', url);
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    var text = xhr.responseText;
    var title = getTitle(text);
    alert('Response from CORS request to ' + url + ': ' + title);
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };

  xhr.send();
}
*/




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


/*$("#radioIntro0")[0].checked =true;
$("#radioIntro0").button("refresh");
$("#radiosetIntro").css("display","block");*/

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
