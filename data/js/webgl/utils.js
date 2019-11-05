
var Utils = {
	
	/**
	* Gets a WebGL context in a cross browser way.
	*/
	getGLContext : function(name){
	    
		var canvas = document.getElementById(name);
		canvas.addEventListener("webglcontextlost", function(event) {event.preventDefault();}, false);
		canvas.addEventListener("webglcontextrestored", handleContextRestored, false);
		var ctx = null;
		
		if(canvas==null){
			alert('there is no canvas on this page');
			return null;
		}
		else{
			canvasWidth = canvas.width;
			canvasHeight = canvas.height;
		}
		if (!window.WebGLRenderingContext) {// the browser doesn't even know what WebGL is
    		window.location = "http://get.webgl.org";
 		}	
		var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
	
		for (var i = 0; i < names.length; ++i) {
		try {
			ctx = canvas.getContext(names[i], { antialias: false }); //,{preserveDrawingBuffer: true} //doesn't increase performance
		} 
		catch(e) {}
			if (ctx) {
				break;
			}
		}
		if (ctx == null) {
			$("#loader").css("display","none");
			$("#content").css("display","none");
			$("#errorMessages").css("display","block");
			document.getElementById("errorMessages").innerHTML= "<h1>:-( Error</h1><h3>Could not initialize WebGL despite your browser seems to support it. Please check <a href='http://get.webgl.org/troubleshooting'>http://get.webgl.org/</a>. If this should normally work, please restart your browser and try again.</h3>";	return null;
		}
		else {
			return ctx;
		}
	},
	/**
	* Invoked each time a new object is opened. Helps freeing memory in some browsers.
	*/
	deleteContext : function(){
		if(gl){
			if(textureData[0].albedo){gl.deleteTexture(albedoTex[0]);}
			if(textureData[0].ambient){gl.deleteTexture(ambientTex[0]);}
			if(textureData[0].normals){gl.deleteTexture(normalTex[0]);}
			if(textureData[0].disp){gl.deleteTexture(disTex[0]);}
			if(textureData[1]){if(textureData[1].albedo){gl.deleteTexture(albedoTex[1]);}}
			if(textureData[1]){if(textureData[1].ambient){gl.deleteTexture(ambientTex[1]);}}
			if(textureData[1]){if(textureData[1].normals){gl.deleteTexture(normalTex[1]);}}
			if(textureData[1]){if(textureData[1].disp){gl.deleteTexture(disTex[1]);}}
			if(textureData[2]){if(textureData[2].albedo){gl.deleteTexture(albedoTex[2]);}}
			if(textureData[2]){if(textureData[2].ambient){gl.deleteTexture(ambientTex[2]);}}
			if(textureData[2]){if(textureData[2].normals){gl.deleteTexture(normalTex[2]);}}
			if(textureData[2]){if(textureData[2].disp){gl.deleteTexture(disTex[2]);}}
			if(textureData[3]){if(textureData[3].albedo){gl.deleteTexture(albedoTex[3]);}}
			if(textureData[3]){if(textureData[3].ambient){gl.deleteTexture(ambientTex[3]);}}
			if(textureData[3]){if(textureData[3].normals){gl.deleteTexture(normalTex[3]);}}
			if(textureData[3]){if(textureData[3].disp){gl.deleteTexture(disTex[3]);}}
			if(textureData[4]){if(textureData[4].albedo){gl.deleteTexture(albedoTex[4]);}}
			if(textureData[4]){if(textureData[4].ambient){gl.deleteTexture(ambientTex[4]);}}
			if(textureData[4]){if(textureData[4].normals){gl.deleteTexture(normalTex[4]);}}
			if(textureData[4]){if(textureData[4].disp){gl.deleteTexture(disTex[4]);}}
			if(textureData[5]){if(textureData[5].albedo){gl.deleteTexture(albedoTex[5]);}}
			if(textureData[5]){if(textureData[5].ambient){gl.deleteTexture(ambientTex[5]);}}
			if(textureData[5]){if(textureData[5].normals){gl.deleteTexture(normalTex[5]);}}
			if(textureData[5]){if(textureData[5].disp){gl.deleteTexture(disTex[5]);}}
			gl.deleteProgram(prg1);
			gl.deleteProgram(prg2);
			gl.deleteProgram(prg3);
			gl.deleteProgram(prg4);
			gl.deleteProgram(prg5);
			gl.deleteProgram(prg6);
			gl.deleteProgram(prg8);
			gl.deleteProgram(prg9);
			gl.deleteProgram(prg10);
			
		}
	},
	
	requestAnimFrame : function(o){
		requestAnimFrame(o);
	},
    
    //indices have to be completely defined NO TRIANGLE_STRIP only TRIANGLES
    calculateNormals : function(vs, ind){
        var x=0; 
        var y=1;
        var z=2;
        
        var ns = [];
        for(var i=0;i<vs.length;i=i+3){
            ns[i+x]=0.0;
            ns[i+y]=0.0;
            ns[i+z]=0.0;
        }
        
        for(var i=0;i<ind.length;i=i+3){
            var v1 = [];
            var v2 = [];
            var normal = [];	
            //p2 - p1
            v1[x] = vs[3*ind[i+2]+x] - vs[3*ind[i+1]+x];
            v1[y] = vs[3*ind[i+2]+y] - vs[3*ind[i+1]+y];
            v1[z] = vs[3*ind[i+2]+z] - vs[3*ind[i+1]+z];
            //p0 - p1
            v2[x] = vs[3*ind[i]+x] - vs[3*ind[i+1]+x];
            v2[y] = vs[3*ind[i]+y] - vs[3*ind[i+1]+y];
            v2[z] = vs[3*ind[i]+z] - vs[3*ind[i+1]+z];
            //cross product by Sarrus Rule
            normal[x] = v1[y]*v2[z] - v1[z]*v2[y];
            normal[y] = v1[z]*v2[x] - v1[x]*v2[z];
            normal[z] = v1[x]*v2[y] - v1[y]*v2[x];
            for(j=0;j<3;j++){ //update the normals of that triangle: sum of vectors
                ns[3*ind[i+j]+x] =  ns[3*ind[i+j]+x] + normal[x];
                ns[3*ind[i+j]+y] =  ns[3*ind[i+j]+y] + normal[y];
                ns[3*ind[i+j]+z] =  ns[3*ind[i+j]+z] + normal[z];
            }
        }
        //normalize the result
        for(var i=0;i<vs.length;i=i+3){
        
            var nn=[];
            nn[x] = ns[i+x];
            nn[y] = ns[i+y];
            nn[z] = ns[i+z];
            
            var len = Math.sqrt((nn[x]*nn[x])+(nn[y]*nn[y])+(nn[z]*nn[z]));
            if (len == 0) len = 1.0;
            
            nn[x] = nn[x]/len;
            nn[y] = nn[y]/len;
            nn[z] = nn[z]/len;
            
            ns[i+x] = nn[x];
            ns[i+y] = nn[y];
            ns[i+z] = nn[z];
        }
        
        return ns;
    }
}
	
/**
 * Provides requestAnimationFrame in a cross browser way.
 */
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function( callback,  element) {
           return window.setTimeout(callback, 1000/60);
         };
})();

/**
 * Provides cancelAnimationFrame in a cross browser way.
 */
window.cancelAnimFrame = (function() {
  return window.cancelAnimationFrame ||
         window.webkitCancelAnimationFrame ||
         window.mozCancelAnimationFrame ||
         window.oCancelAnimationFrame ||
         window.msCancelAnimationFrame ||
         window.clearTimeout;
})();

	
function handleContextLost(event) {
   event.preventDefault();
   cancelRequestAnimationFrame(requestId);
}

function handleContextRestored(event) {
 console.log("Context lost. Trying to restore it");
  runWebGL();
}
