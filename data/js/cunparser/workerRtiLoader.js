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
var mHshData = new Array(4);

self.onmessage = function(event){
	var buffer  = event.data.buffer;
var currentIndex = event.data.currentIdx;
let inputBuffer = {buffer:buffer,  currentIndex:currentIndex};
	var width = event.data.w;
	var height = event.data.h;
	var basisTerm = event.data.basisTerm;
	//var dataView = new DataView(arrayBuffer);
	//bytePointer = event.data.startPtr;
	
loadDataHSH(inputBuffer, width, height, basisTerm, false);
		//textureData.push(sideData);
		self.postMessage({coef0:mHshData[0],coef1:mHshData[1],coef2:mHshData[2],coef3:mHshData[3],},[mHshData[0].buffer,mHshData[1].buffer,mHshData[2].buffer,mHshData[3].buffer]);

	close();

}

function loadDataHSH(inputBuffer, width, height, basisTerm, urti)
{
	var w  = width;
	var h = height;
	
	
	var ordlen = basisTerm;
	var bands = 3;
	var gmin = new Float32Array(9);
	var gmax = new Float32Array(9);

	var tmp0 = new DataView(inputBuffer.buffer,inputBuffer.currentIndex,4 * basisTerm);
	//var tmp0 = new Float32Array(inputBuffer.buffer,inputBuffer.currentIndex,basisTerm); 
	inputBuffer.currentIndex += Float32Array.BYTES_PER_ELEMENT * basisTerm;
	var tmp1 = new DataView(inputBuffer.buffer,inputBuffer.currentIndex,4 * basisTerm);
	//var tmp1 = new Float32Array(inputBuffer.buffer,inputBuffer.currentIndex,basisTerm); 
	inputBuffer.currentIndex += Float32Array.BYTES_PER_ELEMENT * basisTerm;

	for(var i = 0; i < basisTerm; i++)
	{
		//gmin[i] = tmp0[i];
		gmin[i] = tmp0.getFloat32(i*4,true);
		//console.log(gmin[i]);
	}
	for(var i = 0; i < basisTerm; i++)
	{
		//gmax[i] = tmp1[i];
		gmax[i] = tmp1.getFloat32(i*4,true);
	}

	var offset = 0;

	var size = w * h * basisTerm;
	var redPtr = new Float32Array(size);
	var greenPtr = new Float32Array(size);
	var bluePtr = new Float32Array(size);
	//std::cout<<"basisterm: "<<basisTerm<<std::endl;
	mHshData = new Array(4);
	for(var k=0; k<4; k++){
	  mHshData[k] = new Float32Array(w*h*3);
	}
	console.log(w + " " + h + " " + basisTerm);

var c;


for(var j = 0; j < h; j++)
{
	for(var i = 0; i < w; i++)
	{				
		offset = j * w + i;
		for (var k = 0; k < basisTerm; k++)
		{
			c = new Uint8Array(inputBuffer.buffer,inputBuffer.currentIndex,1);
			inputBuffer.currentIndex += 1; 
			redPtr[offset*basisTerm + k] = (parseFloat(c) / 255.0) * gmin[k] + gmax[k];
		}
		for (var k = 0; k < basisTerm; k++)
		{
			c = new Uint8Array(inputBuffer.buffer,inputBuffer.currentIndex,1);
			inputBuffer.currentIndex += 1; 
			greenPtr[offset*basisTerm + k] = (parseFloat(c) / 255.0) * gmin[k] + gmax[k];
		}
		for (var k = 0; k < basisTerm; k++)
		{
			c = new Uint8Array(inputBuffer.buffer,inputBuffer.currentIndex,1);
			inputBuffer.currentIndex += 1; 
			bluePtr[offset*basisTerm + k] = (parseFloat(c) / 255.0) * gmin[k] + gmax[k];
		}

		for(var k = 0; k < 4; k++){
					 mHshData[k][offset*3] = redPtr[offset*basisTerm+k];
					 mHshData[k][offset*3+1] = greenPtr[offset*basisTerm+k];
					 mHshData[k][offset*3+2] = bluePtr[offset*basisTerm+k];
					}
	}
}

}

function loadVersion41(ArrayBuffer,dataView,endpos,SideNr){
sideData = new Object();
	endPos[SideNr] = endpos;
	
	var tag = "";  
	
	//header
	var uintHeader = new Uint8Array(ArrayBuffer,bytePointer,5);
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

	while(((endPos[SideNr]==0) || (bytePointer<endPos[SideNr]) && i<4) /*&& (fread(tag, 1, 4, fd) == 4)*/ ) {
   	//var tag = dataView.getUint32(bytePointer,true);	//interpret these 4 bytes as usigned 32 bit integer, use littleEndian (lb first)
		//bytePointer +=4;
		var uintTag = new Uint8Array(ArrayBuffer,bytePointer,4);
		var stringTag = { s: "" };
		charCodeArrayToString(uintTag,stringTag);
		bytePointer+=4;		

		var blocksize = dataView.getUint32(bytePointer,true);	//interpret these 4 bytes as usigned 32 bit integer, use littleEndian (lb first)
		bytePointer +=4;

		//fread(&blocksize, sizeof(unsigned int), 1, fd);

		if(stringTag.s.localeCompare("INFO")==0){	
			loadBlockInfo(ArrayBuffer,dataView,SideNr);
		}	
		else if(stringTag.s.localeCompare("NORC")==0){	
			sideData.normals = loadBlockCompressedNormal(ArrayBuffer,dataView,SideNr);
		}	
		else if(stringTag.s.localeCompare("NORZ")==0){	
			sideData.normals = loadBlockZippedNormal(ArrayBuffer,dataView,SideNr);
		}	
		else if(stringTag.s.localeCompare("ALBC")==0){	
			sideData.albedo = loadBlockCompressedDiffuse(ArrayBuffer,dataView,0,SideNr);
		}	
		else if(stringTag.s.localeCompare("ALBZ")==0){	
			sideData.albedo = loadBlockZippedDiffuse(ArrayBuffer,dataView,0,SideNr);
		}	
		else if(stringTag.s.localeCompare("AMBC")==0){
			boolHasAmbient[SideNr]=true;
			sideData.ambient = loadBlockCompressedDiffuse(ArrayBuffer,dataView,1,SideNr);
		}
		else if(stringTag.s.localeCompare("AMBZ")==0){	
			boolHasAmbient[SideNr]=true;
			sideData.ambient = loadBlockZippedDiffuse(ArrayBuffer,dataView,1,SideNr);
		}	
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
var d1 = new Date().getTime();
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

