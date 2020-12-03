importScripts('bzip2a.js');
importScripts('zlib_and_gzip.min.js');


//loadblockcompresseddiffuse
var mData = 0;
var minValue = 0;
var maxValue = 0;

//normalquantization
var TOP_MASK = 0x1f80;
var BOTTOM_MASK = 0x007f;
var SIGN_MASK = 0xe000;
var XSIGN_MASK = 0x8000;
var YSIGN_MASK = 0x4000;
var ZSIGN_MASK = 0x2000;
var mUVAdjustment = new Array(0x2000);
var sideData = new Object();
var textureData = new Array(); 

var endPos = new Array(6);
var boolHasAmbient = new Array(6);

self.onmessage = function(event){
	var arrayBuffer  = event.data.buffer;
	var dataView = new DataView(arrayBuffer);
	bytePointer = event.data.startPtr;
	
	for(var i=0;i<6;i++){
		boolHasAmbient[i]=false;
	}
	var i = 0;
	while (true) {
		//read tag
		var uintTag = new Uint8Array(arrayBuffer,bytePointer,3);
		//console.log(uintTag);
		var stringTag = { s: "" };
		charCodeArrayToString(uintTag,stringTag);
		bytePointer +=3;

		//read length
		var len = dataView.getUint32(bytePointer,true);	//interpret these 4 bytes as usigned 32 bit integer, use littleEndian (lb first)
		bytePointer +=4;
		if(stringTag.s.localeCompare("EOF")==0){
			break;	
		}
		else if(stringTag.s.localeCompare("CFD")==0){
			loadInfo(arrayBuffer,dataView);	
			populateMetaFields();
		}
		else if(stringTag.s.localeCompare("CSP")==0){	
			if (len>0) {
				loadVersion41(arrayBuffer,dataView,bytePointer+len,i);
					
				
			}
		else{
			break;
			}
		}
		//textureData.push(sideData);
		//if(boolHasAmbient[i]){self.postMessage({sideData:sideData,sideNr:i,},[sideData]);}
		//if(boolHasAmbient[i]){
		
		

		
		self.postMessage({msNormals0:sideData.msNormals0,msNormals1:sideData.msNormals1,msNormals2:sideData.msNormals2,msNormals3:sideData.msNormals3,msNormals4:sideData.msNormals4,msAlbedo0:sideData.msAlbedo0,msAlbedo1:sideData.msAlbedo1,msAmbient0:sideData.msAmbient0,msAmbient1:sideData.msAmbient1,sideNr:i,},[sideData.msNormals0,sideData.msNormals1,sideData.msNormals2,sideData.msNormals3,sideData.msNormals4,sideData.msAlbedo0,sideData.msAlbedo1,sideData.msAmbient0,sideData.msAmbient1]);
		//}
		//else{self.postMessage({MSnormals0:sideData.MSnormals[0],normals:sideData.normals,albedo:sideData.albedo,sideNr:i,},[sideData.MSnormals[0],sideData.normals,sideData.albedo]);}
		i++;
	}
	
	close();

}

function loadVersion41(arrayBuffer,dataView,endpos,SideNr){

	endPos[SideNr] = endpos;
	
	var tag = "";  
	
	//header
	var uintHeader = new Uint8Array(arrayBuffer,bytePointer,5);
	var stringHeader = { s: "" };
	charCodeArrayToString(uintHeader,stringHeader);
	bytePointer+=5;

	if(stringHeader.s.localeCompare("CSP41")!=0 && stringHeader.s.localeCompare("CSP12")!=0){
		alert('    loadVersion41 Invalid header: ' + stringHeader.s);
		bytePointer-=5;
		return;
	}
	
	//dimension/offsets
	var offsetX, offsetY;

	mWidth = dataView.getUint32(bytePointer,true);	//interpret these 4 bytes as usigned 32 bit integer, use littleEndian (lb first)
	bytePointer +=4;
	
	mHeight = dataView.getUint32(bytePointer,true);	//interpret these 4 bytes as usigned 32 bit integer, use littleEndian (lb first)
	bytePointer +=4;

	var offsetX = dataView.getUint32(bytePointer,true);	//interpret these 4 bytes as usigned 32 bit integer, use littleEndian (lb first)
	bytePointer +=4;

	var offsetY = dataView.getUint32(bytePointer,true);	//interpret these 4 bytes as usigned 32 bit integer, use littleEndian (lb first)
	bytePointer +=4;

	if(stringHeader.s.localeCompare("CSP41")==0){
		mMmPerPixel = dataView.getFloat32(bytePointer,true);	//interpret these 4 bytes as usigned 32 bit integer, use littleEndian (lb first)
		bytePointer +=4;
	}
  //cout << "    side has dimension: " << mWidth << "x" << mHeight << endl;
  //cout << "    data N/D/A (init): " << mNormalData << "," << mDiffuseData << "," << mAmbientData << endl; 
  //float dmin, dmax;
  //float amin, amax;

	var pos = bytePointer;
  	var blocksize; // NOTE: we do not use long as it is not necessary yet and #bytes differs on 32-and 64-bit
	var i = 0;

	sideData = {
		//normals :  new ArrayBuffer(3*mWidth*mHeight),
		//albedo : new ArrayBuffer(3*mWidth*mHeight),
		msNormals0: new ArrayBuffer(3*mWidth*mHeight),
		msNormals1: new ArrayBuffer(3*mWidth*mHeight),
		msNormals2: new ArrayBuffer(3*mWidth*mHeight),
		msNormals3: new ArrayBuffer(3*mWidth*mHeight),
		msNormals4: new ArrayBuffer(3*mWidth*mHeight),
		msAlbedo0: new ArrayBuffer(3*mWidth*mHeight),
		msAlbedo1: new ArrayBuffer(3*mWidth*mHeight),
		msAmbient0: new ArrayBuffer(3*mWidth*mHeight),
		msAmbient1: new ArrayBuffer(3*mWidth*mHeight),
		//ambient : new ArrayBuffer(3*mWidth*mHeight),
		//MSnormals: new Array(6),
		//MSAlbedo: new Array(2),
		//MSAmbient: new Array(2)
};

	//var MSnormals = new Array(5);
	while(((endPos[SideNr]==0) || (bytePointer<endPos[SideNr]) /*&& i<4*/ ) /*&& (fread(tag, 1, 4, fd) == 4)*/ ) {
		mPercentLoaded = Math.round((bytePointer / endPos[SideNr]) * 100);
		self.postMessage({percentLoaded:mPercentLoaded});
		
   	//var tag = dataView.getUint32(bytePointer,true);	//interpret these 4 bytes as usigned 32 bit integer, use littleEndian (lb first)
		//bytePointer +=4;
		var uintTag = new Uint8Array(arrayBuffer,bytePointer,4);
		var stringTag = { s: "" };
		charCodeArrayToString(uintTag,stringTag);
		bytePointer+=4;		

		var blocksize = dataView.getUint32(bytePointer,true);	//interpret these 4 bytes as usigned 32 bit integer, use littleEndian (lb first)
		bytePointer +=4;

		//fread(&blocksize, sizeof(unsigned int), 1, fd);

		if(stringTag.s.localeCompare("INFO")==0){	
			var mProgressTextType = false;
			var mProgressText = "Loading info for side " + SideNr + " ...";
			self.postMessage({progressText:mProgressText,progressTextType:mProgressTextType});
			loadBlockInfo(ArrayBuffer,dataView,SideNr);
		}	
		else if(stringTag.s.localeCompare("NORC")==0){	
			var mProgressTextType = false;
			var mProgressText = "Loading surface normals for side " + SideNr + " ...";
			self.postMessage({progressText:mProgressText,progressTextType:mProgressTextType});
			sideData.msNormals0 = loadBlockCompressedNormal(arrayBuffer,dataView,SideNr);
		}	
		else if(stringTag.s.localeCompare("NORZ")==0){	
			var mProgressTextType = false;
			var mProgressText = "Loading surface normals for side " + SideNr + " ...";
			self.postMessage({progressText:mProgressText,progressTextType:mProgressTextType});
			sideData.msNormals0 = loadBlockZippedNormal(arrayBuffer,dataView,SideNr);
		}	
		else if(stringTag.s.localeCompare("NOZ2")==0){	
			var mProgressTextType = false;
			var mProgressText = "Loading R surface normals for side " + SideNr + " ...";
			self.postMessage({progressText:mProgressText,progressTextType:mProgressTextType});
			sideData.msNormals1 = loadBlockZippedNormal(arrayBuffer,dataView,SideNr);
		}
		else if(stringTag.s.localeCompare("NOZ3")==0){	
			var mProgressTextType = false;
			var mProgressText = "Loading G surface normals for side " + SideNr + " ...";
			self.postMessage({progressText:mProgressText,progressTextType:mProgressTextType});
			sideData.msNormals2 = loadBlockZippedNormal(arrayBuffer,dataView,SideNr);
		}
		else if(stringTag.s.localeCompare("NOZ4")==0){	
			var mProgressTextType = false;
			var mProgressText = "Loading B surface normals for side " + SideNr + " ...";
			self.postMessage({progressText:mProgressText,progressTextType:mProgressTextType});
			sideData.msNormals3 = loadBlockZippedNormal(arrayBuffer,dataView,SideNr);
		}
		else if(stringTag.s.localeCompare("NOZ5")==0){	
			var mProgressTextType = false;
			var mProgressText = "Loading N-UV surface normals for side " + SideNr + " ...";
			self.postMessage({progressText:mProgressText,progressTextType:mProgressTextType});
			sideData.msNormals4 = loadBlockZippedNormal(arrayBuffer,dataView,SideNr);
		}
		else if(stringTag.s.localeCompare("ALBC")==0){	
			var mProgressTextType = false;
			var mProgressText = "Loading albedo data for side " + SideNr + " ...";
			self.postMessage({progressText:mProgressText,progressTextType:mProgressTextType});
			sideData.msAlbedo0 = loadBlockCompressedDiffuse(arrayBuffer,dataView,0,SideNr);
		}	
		else if(stringTag.s.localeCompare("ALBZ")==0){	
			var mProgressTextType = false;
			var mProgressText = "Loading albedo data for side " + SideNr + " ...";
			self.postMessage({progressText:mProgressText,progressTextType:mProgressTextType});
			//sideData.albedo = loadBlockZippedDiffuse(arrayBuffer,dataView,0,SideNr);
			sideData.msAlbedo0 = loadBlockZippedDiffuse(arrayBuffer,dataView,0,SideNr);
		}	
		else if(stringTag.s.localeCompare("ALZ2")==0){	
			var mProgressTextType = false;
			var mProgressText = "Loading additional albedo data for side " + SideNr + " ...";
			self.postMessage({progressText:mProgressText,progressTextType:mProgressTextType});
			sideData.msAlbedo1 = loadBlockZippedDiffuse(arrayBuffer,dataView,0,SideNr);
		}	
		else if(stringTag.s.localeCompare("AMBC")==0){
			var mProgressTextType = false;
			var mProgressText = "Loading ambient data for side " + SideNr + " ...";
			self.postMessage({progressText:mProgressText,progressTextType:mProgressTextType});
			boolHasAmbient[SideNr]=true;
			sideData.msAmbient0 = loadBlockCompressedDiffuse(arrayBuffer,dataView,1,SideNr);
		}
		else if(stringTag.s.localeCompare("AMBZ")==0){	
			var mProgressTextType = false;
			var mProgressText = "Loading ambient data for side " + SideNr + " ...";
			self.postMessage({progressText:mProgressText,progressTextType:mProgressTextType});
			boolHasAmbient[SideNr]=true;
			//sideData.ambient = loadBlockZippedDiffuse(arrayBuffer,dataView,1,SideNr);
			sideData.msAmbient0 = loadBlockZippedDiffuse(arrayBuffer,dataView,1,SideNr);
		}
		else if(stringTag.s.localeCompare("AMZ2")==0){	
			var mProgressTextType = false;
			var mProgressText = "Loading additional ambient data for side " + SideNr + " ...";
			self.postMessage({progressText:mProgressText,progressTextType:mProgressTextType});
			sideData.msAmbient1 = loadBlockZippedDiffuse(arrayBuffer,dataView,1,SideNr);
		}	
	
		console.log("Parsed " + stringTag.s);
		sideData.width = mWidth;
		sideData.height = mHeight;
	i++;
	
	}
	//textureData.push(sideData);
	
	return;
}

function loadBlockZippedDiffuse(arrayBuffer,dataView,type,SideNr){

  	var nbBits = dataView.getUint32(bytePointer,true);
	bytePointer +=4;
	var minValue = dataView.getFloat32(bytePointer,true);
	bytePointer +=4;
	var maxValue = dataView.getFloat32(bytePointer,true);
	bytePointer +=4;

	var range = maxValue - minValue;

  	// - buffer size
	var compressedBufferLen = dataView.getUint32(bytePointer,true);
	bytePointer +=4;
	
	// - buffer data
	var compressedBuffer = new Uint8Array(arrayBuffer,bytePointer,compressedBufferLen);
	bytePointer += compressedBufferLen;
	
	if(nbBits ==16){
		;
	} else if(nbBits <=8){ //so far 8bit and 6bit option		
		//if(type==0){
		var imagesize = nbPixels();

		inflate = new Zlib.Inflate(compressedBuffer, {
		'index':0,
		'bufferSize': imagesize*4,
		'resize': false,
		'verify': false
		});
		plain = inflate.decompress();

		
		var albedoBuffer = new ArrayBuffer(imagesize*4);
		var albedoView = new Uint8Array(albedoBuffer);
		for (var i=0, j=0;i<imagesize*4;i+=4,j+=1){
			albedoView[i+0]=plain[j];
			albedoView[i+1]=plain[j+imagesize*1];
			albedoView[i+2]=plain[j+imagesize*2];
			albedoView[i+3]=255;
		}
	}
	
	return albedoBuffer;
}
function loadBlockCompressedDiffuse(arrayBuffer,dataView,type,SideNr){
  	var nbBits = dataView.getUint32(bytePointer,true);
	bytePointer +=4;
	var minValue = dataView.getFloat32(bytePointer,true);
	bytePointer +=4;
	var maxValue = dataView.getFloat32(bytePointer,true);
	bytePointer +=4;

	var range = maxValue - minValue;

  	// - buffer size
	var compressedBufferLen = dataView.getUint32(bytePointer,true);
	bytePointer +=4;
	
	// - buffer data
	var compressedBuffer = new Uint8Array(arrayBuffer,bytePointer,compressedBufferLen);
	var compressedSliced = arrayBuffer.slice(bytePointer,bytePointer+compressedBufferLen);
	bytePointer += compressedBufferLen;
	
	if(nbBits ==16){
		;
	} else if(nbBits <=8){ //so far 8bit and 6bit option		

			var uncompressedData = bzip2.simple(bzip2.array(compressedBuffer));

		var plain = new Uint8Array(uncompressedData);

		var imagesize = nbPixels();
		var albedoBuffer = new ArrayBuffer(nbPixels()*4);
		var albedoView = new Int8Array(albedoBuffer);
		for (var i=0, j=0;i<imagesize*4;i+=4,j+=1){
			albedoView[i+0]=plain[j];
			albedoView[i+1]=plain[j+imagesize*1];
			albedoView[i+2]=plain[j+imagesize*2];
			albedoView[i+3]=255;
		}
	}
	return albedoBuffer;
	
}
function loadBlockZippedNormal(arrayBuffer,dataView,SideNr){
	var compressedBufferLen = dataView.getUint32(bytePointer,true);
	bytePointer +=4;

	var compressedData = new Uint8Array(arrayBuffer,bytePointer,compressedBufferLen);
	bytePointer += compressedBufferLen;
var inflate = new Zlib.Inflate(compressedData);
var uncompressedData = inflate.decompress();
	var strBuf = new ArrayBuffer(uncompressedData.length);
	var str = new Uint8Array(strBuf); //using arraybuffers is +-10x faster than arrays


	 //using arraybuffers is +-10x faster than arrays
	var imagesize = nbPixels();
	for(var i=0;i<imagesize; i++){
		for(var j=0; j<2; ++j){
			str[2*i +j] = uncompressedData[imagesize*j + i];
		}
		//packedNormals[i] = str[2*i]+256*str[2*i+1];
	}
var packedNormals = new Uint16Array(strBuf);

	var normalBuf = new ArrayBuffer(imagesize*3*4); //*xyz*sizeoffloat32

	NormalQuantizationInitialize();
	unpackNormals(packedNormals, nbPixels(), normalBuf);	
	return normalBuf;
}
function loadBlockCompressedNormal(arrayBuffer,dataView,SideNr){
	var compressedBufferLen = dataView.getUint32(bytePointer,true);
	bytePointer +=4;

	var compressedData = new Uint8Array(arrayBuffer,bytePointer,compressedBufferLen);
	bytePointer += compressedBufferLen;
	var uncompressedData = bzip2.simple(bzip2.array(compressedData));

	var uncompressedView = new Uint8Array(uncompressedData);


	var strBuf = new ArrayBuffer(uncompressedData.length);
	var str = new Uint8Array(strBuf); //using arraybuffers is +-10x faster than arrays

	var imagesize = nbPixels();
	for(var i=0;i<imagesize; i++){
		for(var j=0; j<2; ++j){
			str[2*i +j] = uncompressedData[imagesize*j + i];
		}
	}
	var packedNormals = new Uint16Array(strBuf); //using arraybuffers is +-10x faster than arrays



	var normalBuf = new ArrayBuffer(imagesize*3*4); //*xyz*sizeoffloat32

	NormalQuantizationInitialize();
	unpackNormals(packedNormals, nbPixels(), normalBuf);	

	return normalBuf;
}

function unpackNormals(packedNormals, nbNormals, normalBuf){
  // if we do a straightforward backward transform
  // we will get points on the plane X0,Y0,Z0
  // however we need points on a sphere that goes through these points.
  // therefore we need to adjust x,y,z so that x^2+y^2+z^2=1
  // by normalizing the vector. We have already precalculated the amount
  // by which we need to scale, so all we do is a table lookup and a 
  // multiplication
	
	var normalObjects = new Float32Array(normalBuf);

	for(var i=0,j=0; i<nbNormals; i=i+1,j=j+3) {

		// get the x and y bits
		var xbits = ((packedNormals[i] & TOP_MASK)>>7);
		var ybits = (packedNormals[i] & BOTTOM_MASK);
		 
		// map the numbers back to the triangle (0,0)-(0,126)-(126,0)
		if((xbits+ybits)>=127){ 
			xbits = 127-xbits; 
			ybits = 127-ybits; 
		}
		
		// do the inverse transform and normalization
		// costs 3 extra multiplies and 2 subtracts. No big deal.         
		var uvadj = mUVAdjustment[packedNormals[i] & ~SIGN_MASK];
		normalObjects[j] = uvadj*xbits;
		normalObjects[j+1] = uvadj*ybits;
		normalObjects[j+2] = uvadj*(126-xbits-ybits);

		// set all the sign bits
		if(packedNormals[i] & XSIGN_MASK){normalObjects[j] = -normalObjects[j];}
		if(packedNormals[i] & YSIGN_MASK){normalObjects[j+1] = -normalObjects[j+1];}
		if(packedNormals[i] & ZSIGN_MASK){normalObjects[j+2] = -normalObjects[j+2];}
		
	} // foreach normal
}

function NormalQuantizationInitialize(){
	
	for(var idx=0; idx<0x2000; idx++ ){
		var xbits = idx >> 7;
		var ybits = idx & BOTTOM_MASK;
    
		// map the numbers back to the triangle (0,0)-(0,127)-(127,0)
		if((xbits+ybits) >= 127){ 
			xbits = 127-xbits; 
			ybits = 127-ybits; 
		}
    
		 // convert to 3D vectors
		var x = xbits;
		var y = ybits;
		var z = (126-xbits-ybits);

		// calculate the amount of normalization required
		mUVAdjustment[idx] = 1.0 / Math.sqrt(y*y+z*z+x*x);
		//assert( _finite( mUVAdjustment[idx]));
    
		//cerr << mUVAdjustment[idx] << "\t";
		//if ( xbits == 0 ) cerr << "\n";
	}

}
/*
converts uint8array to string, stringobject to mimic pass by reference behaviour
*/
function charCodeArrayToString(charCodeArray,StringObject){
	for(var i = 0; i < charCodeArray.length; i++){
		StringObject.s += String.fromCharCode(charCodeArray[i]);
	}
	
}
function nbPixels(){
	return mWidth*mHeight;
}
function loadBlockInfo(ArrayBuffer,dataView){
	var mSide = dataView.getUint32(bytePointer,true);
	bytePointer +=4;

	var len = dataView.getUint32(bytePointer,true);
	bytePointer +=4;
	if(len>0) {
		var uintTag = new Uint8Array(ArrayBuffer,bytePointer,len);
		var stringTag = { s: "" };
		charCodeArrayToString(uintTag,stringTag);
		bytePointer+=len;		
	}

}

