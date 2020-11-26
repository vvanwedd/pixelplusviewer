function decodeASCII(str) {
	var i, out = "", charCode, extendedASCII = [ '\u00C7', '\u00FC', '\u00E9', '\u00E2', '\u00E4', '\u00E0', '\u00E5', '\u00E7', '\u00EA', '\u00EB',
			'\u00E8', '\u00EF', '\u00EE', '\u00EC', '\u00C4', '\u00C5', '\u00C9', '\u00E6', '\u00C6', '\u00F4', '\u00F6', '\u00F2', '\u00FB', '\u00F9',
			'\u00FF', '\u00D6', '\u00DC', '\u00F8', '\u00A3', '\u00D8', '\u00D7', '\u0192', '\u00E1', '\u00ED', '\u00F3', '\u00FA', '\u00F1', '\u00D1',
			'\u00AA', '\u00BA', '\u00BF', '\u00AE', '\u00AC', '\u00BD', '\u00BC', '\u00A1', '\u00AB', '\u00BB', '_', '_', '_', '\u00A6', '\u00A6',
			'\u00C1', '\u00C2', '\u00C0', '\u00A9', '\u00A6', '\u00A6', '+', '+', '\u00A2', '\u00A5', '+', '+', '-', '-', '+', '-', '+', '\u00E3',
			'\u00C3', '+', '+', '-', '-', '\u00A6', '-', '+', '\u00A4', '\u00F0', '\u00D0', '\u00CA', '\u00CB', '\u00C8', 'i', '\u00CD', '\u00CE',
			'\u00CF', '+', '+', '_', '_', '\u00A6', '\u00CC', '_', '\u00D3', '\u00DF', '\u00D4', '\u00D2', '\u00F5', '\u00D5', '\u00B5', '\u00FE',
			'\u00DE', '\u00DA', '\u00DB', '\u00D9', '\u00FD', '\u00DD', '\u00AF', '\u00B4', '\u00AD', '\u00B1', '_', '\u00BE', '\u00B6', '\u00A7',
			'\u00F7', '\u00B8', '\u00B0', '\u00A8', '\u00B7', '\u00B9', '\u00B3', '\u00B2', '_', ' ' ];
	for (i = 0; i < str.length; i++) {
		charCode = str.charCodeAt(i) & 0xFF;
		if (charCode > 127)
			out += extendedASCII[charCode - 128];
		else
			out += String.fromCharCode(charCode);
	}
	return out;
}

function decodeUTF8(string) {
	return decodeURIComponent(escape(string));
}

function getString(bytes) {
	var i, str = "";
	for (i = 0; i < bytes.length; i++)
		str += String.fromCharCode(bytes[i]);
	return str;
}

function getDate(timeRaw) {
	var date = (timeRaw & 0xffff0000) >> 16, time = timeRaw & 0x0000ffff;
	try {
		return new Date(1980 + ((date & 0xFE00) >> 9), ((date & 0x01E0) >> 5) - 1, date & 0x001F, (time & 0xF800) >> 11, (time & 0x07E0) >> 5,
				(time & 0x001F) * 2, 0);
	} catch (e) {
	}
}

function getDataHelper(byteLength, bytes) {
	var dataBuffer, dataArray;
	dataBuffer = new ArrayBuffer(byteLength);
	dataArray = new Uint8Array(dataBuffer);
	if (bytes)
		dataArray.set(bytes, 0);
	return {
		buffer : dataBuffer,
		array : dataArray,
		view : new DataView(dataBuffer)
	};
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

class Entry{}

class SingleFileSCML{
    constructor(url){
	this.url = url;
	this.basename = this.url.substring(this.url.lastIndexOf('/') + 1);//, this.url.lastIndexOf('.') - 1);
	console.log(this.basename);
	this.lastChunkSize = 1024*1024*10;
	this.entries = [];
	this.scmlFiles = [];
}


init(){
	var _this = this;
	/*
	const callTasks = () => _this.getFileSize(_this.url)
	.then(_this.loadLastChunk(_this.url))
	.then(_this.zipBrowse(_this.dataView))
	.then(_this.findEntry('scml2/singleimage.scml'))
	.then(_this.loadEntry(_this.scmlFileEntry))
	.catch(console.error);
  
  callTasks();
*/
return new Promise(function (resolve, reject) {
	var index = 0;
_this.getFileSize(_this.url)
        .then(response => {
                        setProgressText(false, "Returned filesize: " + _this.fileSize + " bytes (" + formatBytes(_this.fileSize,2) +")", false );
            _this.loadLastChunk(_this.url).then(function() {
				_this.zipBrowse(_this.dataView);
				setProgressText(false, "Number of entries: " + _this.entries.length, false );
				_this.loadEntry(_this.scmlFiles[index]).then(function() {
					_this.parseSCML(index);
					setProgressText(false, "Loaded settings file " + _this.scmlFiles[index].filename, false );
					resolve();
					//console.log(" ---- done ----");
				}).catch(e => {
					reject({status: e});
				//		console.log("Error loadEntry: " + e);
				});
				//_this.parseSCML();
				
			}).catch(e => {
				reject({status: e});
				console.log("Error loadLastChunk: " + e);
	                        setProgressText(false, "Load last part of SCML failed: " + e.status + " " + e.statusText, true );

			});
        }).catch(e => {
			reject({status: e});
			console.log("Error getFileSize: " + e.statusText);
			setProgressText(false, "Get filesize failed: " + e.status + " " + e.statusText, true );
		});
		
	//this.loadSingleDataFile();
	//todo: add support for several scml config files
	//var scmlEntry = new Entry();
	//scmlEntry = this.findEntry('scml2/singleimage.scml');
	//console.log(scmlEntry);
	//this.loadEntry(scmlEntry);

}).catch(e => {
	console.log("Error: " + e);
});

}

getFileSize(url) {
//	console.log("getfilesize");
	var _this = this;
	return new Promise(function (resolve, reject) {
    	var xhr = new XMLHttpRequest();
    	xhr.open("HEAD", url, true); 
    	xhr.onreadystatechange = function() {
			if(this.status == 404){
				reject({status: this.status, statusText: xhr.statusText});
			}
        	if (this.readyState == this.DONE || this.readyState == 2) { //2 == HEADERS_RECEIVED
				_this.fileSize = parseInt(xhr.getResponseHeader("Content-Length"));

				if(_this.fileSize <= 500*1024*1024){_this.lastChunkSize == 1024*1024*2;}
				console.log("FileSize: "+ String(_this.fileSize));
				resolve(parseInt(xhr.getResponseHeader("Content-Length")));
      		} else {
				console.log("not ready: " + this.readyState);
        		reject({
          			status: this.status,
          			statusText: xhr.statusText
        		});
      		}
    	}
        xhr.onerror = function () {
			console.log("xhr.onerror");
			reject({
			  status: this.status,
			  statusText: xhr.statusText
			});
		};
		xhr.send();
	});
}

loadLastChunk(url){
//	console.log("loadLastChunk");
var _this = this;
return new Promise( function (resolve, reject){
	const xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'arraybuffer';
	var str = 'bytes=' + String(_this.fileSize - _this.lastChunkSize) + '-' + String(_this.fileSize - 0);
	console.log(str);
	xhr.setRequestHeader('Range', str );
	xhr.onreadystatechange = function() {
	  	if (xhr.readyState == 4 && xhr.status === 206) {
			//const boundary = client.getResponseHeader('Content-Type').match(/boundary=(.+)$/i)[1];
			//if (boundary) console.log('PARTS', parseMultipartBody(client.resposeText, boundary))
			console.log("loaded last chunk");
			_this.endOfFile = xhr.response;
			//console.log(_this.endOfFile);
			var dataView = new DataView(_this.endOfFile);
			_this.dataView = dataView;
			//_this.arrayBuffer = new ArrayBuffer()
			//_this.zipBrowse(dataView);
			resolve(xhr.response);
		} else {
			if (xhr.readyState == 2)
			{ console.log("headers received ... ");}
			else if (xhr.readyState == 3)
			{ console.log("downloading ... ");}
			else {
				console.log("shouldnt come here " + xhr.readyState);
	  		    reject({
				  status: this.status,
				  statusText: xhr.statusText
			    });
			}
		}
	}
	xhr.onerror = function () {
		//console.log("e2");
  		reject({
			status: this.status,
			statusText: xhr.statusText
  		});
	}
	xhr.send(null);
});
}

 /*
 loadSingleDataFile(){
	var _this = this;
	return new Promise(function (resolve, reject) {
	
	this.getFileSize(this.url).then((size)=>{
		_this.fileSize = parseInt(size);
		_this.zipBrowse()
	
	});
	});

	this.getFilesize(this.url, function(size) {

		_this.fileSize = parseInt(size);
		console.log("The new size of " + _this.url + " is : " + _this.fileSize + " bytes.");
		
		const client = new XMLHttpRequest();
        client.open('GET', _this.url, true);
        client.responseType = 'arraybuffer';
        var str = 'bytes=' + String(_this.fileSize - _this.lastChunkSize) + '-' + String(_this.fileSize - 0);
        console.log(str);
        client.setRequestHeader('Range', str );
        client.onreadystatechange = function() {
          if (client.readyState == 4 && client.status === 206) {
            //const boundary = client.getResponseHeader('Content-Type').match(/boundary=(.+)$/i)[1];
	        //if (boundary) console.log('PARTS', parseMultipartBody(client.resposeText, boundary))
			_this.endOfFile = client.response;
			console.log(_this.endOfFile);
			var dataView = new DataView(_this.endOfFile);
			_this.dataView = dataView;
			//_this.arrayBuffer = new ArrayBuffer()
			_this.zipBrowse(dataView);
          }
        }
        client.send(null);
	});
//});
}
*/

 zipBrowse(dataView){	
	console.log("zipBrowse");
	
     var _this  = this;		
	this.zipSeekEOCDR(function(dataView) {
	var datalength, fileslength;
	datalength = dataView.getUint32(16, true);
	fileslength = dataView.getUint16(8, true);
	if (datalength < 0 || datalength >= _this.fileSize) {
		onerror(ERR_BAD_FORMAT);
		return;
	}
	//reader.readUint8Array(datalength, _this.fileSize - datalength, function(bytes) {
		//console.log(datalength - (_this.fileSize - _this.lastChunkSize));
		//console.log( _this.fileSize - (datalength));// - (_this.fileSize - _this.lastChunkSize)));
		var bytes = new DataView(_this.dataView.buffer, datalength - (_this.fileSize - _this.lastChunkSize), _this.fileSize - (datalength));// - (_this.fileSize - _this.lastChunkSize)));
		var offset =  datalength - (_this.fileSize - _this.lastChunkSize);
		var bytes2 = new ArrayBuffer(_this.dataView.buffer, datalength - (_this.fileSize - _this.lastChunkSize), _this.fileSize - (datalength));
		var i, index = 0,/* entries = [], */ entry, filename, comment, data = bytes; //data = getDataHelper(bytes.length, bytes)
		for (i = 0; i < fileslength; i++) {
			entry = new Entry();
			//entry._worker = worker;
			if (data.getUint32(index) != 0x504b0102) {
				console.log("bad format:" + data.getUint32(index).toString(16));
				//onerror(ERR_BAD_FORMAT);
				return;
			}
			_this.readCommonHeader(entry, data, index + 6, true, onerror);
			var uint8Array = new Uint8Array(bytes.buffer);

			entry.commentLength = data.getUint16(index + 32, true);
			entry.directory = ((data.getUint8(index + 38) & 0x10) == 0x10);
			entry.offset = data.getUint32(index + 42, true);
			//console.log(entry.filenameLength);
			filename = getString(uint8Array.subarray(offset + index + 46,offset + index + 46 + entry.filenameLength));
			entry.filename = ((entry.bitFlag & 0x0800) === 0x0800) ? decodeUTF8(filename) : decodeASCII(filename);
			//console.log(entry.filename);
			if (!entry.directory && entry.filename.charAt(entry.filename.length - 1) == "/")
				entry.directory = true;
			comment = getString(uint8Array.subarray(offset + index + 46 + entry.filenameLength + entry.extraFieldLength, offset + index + 46
					+ entry.filenameLength + entry.extraFieldLength + entry.commentLength));
			entry.comment = ((entry.bitFlag & 0x0800) === 0x0800) ? decodeUTF8(comment) : decodeASCII(comment);
			//console.log(entry.comment);
			_this.entries.push(entry);
			var extension = entry.filename.substr(entry.filename.lastIndexOf('.') + 1).toLowerCase();
			if (extension === 'scml'){_this.scmlFiles.push(entry);} //CHANGE
			index += 46 + entry.filenameLength + entry.extraFieldLength + entry.commentLength;
			if(i==0){_this.rootname = _this.entries[0].filename;}
		}
                

	//	callback(entries);
	//}, function() {
	//	onerror(ERR_READ);
	//});
});

}

 zipSeekEOCDR(eocdrCallback) {
	 var _this = this;
	// "End of central directory record" is the last part of a zip archive, and is at least 22 bytes long.
	// Zip file comment is the last part of EOCDR and has max length of 64KB,
	// so we only have to search the last 64K + 22 bytes of a archive for EOCDR signature (0x06054b50).
	var EOCDR_MIN = 22;
	if (_this.fileSize < EOCDR_MIN) {
		onerror(ERR_BAD_FORMAT);
		return;
	}
	var ZIP_COMMENT_MAX = 256 * 256, EOCDR_MAX = EOCDR_MIN + ZIP_COMMENT_MAX;

	// In most cases, the EOCDR is EOCDR_MIN bytes long
	doSeek(EOCDR_MIN, function() {
		// If not found, try within EOCDR_MAX bytes
		doSeek(Math.min(EOCDR_MAX, _this.fileSize), function() {
			onerror(ERR_BAD_FORMAT);
		});
	});

	// seek last length bytes of file for EOCDR
	function doSeek(length, eocdrNotFoundCallback) {
        var bytesArray = new Uint8Array(_this.endOfFile);
        var bytes = Array.from(bytesArray);
		//_this.dataView.readUint8Array(_this.fileSize - length, length, function(bytes) {
			for (var i = bytes.length - EOCDR_MIN; i >= 0; i--) {
				if (bytes[i] === 0x50 && bytes[i + 1] === 0x4b && bytes[i + 2] === 0x05 && bytes[i + 3] === 0x06) {
					_this.eocdr = new DataView(new Uint8Array(bytes).buffer, i, EOCDR_MIN);//new Uint8Array(bytes,i, EOCDR_MIN);
					eocdrCallback(new DataView(new Uint8Array(bytes).buffer, i, EOCDR_MIN));
					return;
				}
			}
			//eocdrNotFoundCallback();
		//}, function() {
		//	onerror(ERR_READ);
        //});
        //function readUint8Array()
	}
 }

static getDate(timeRaw) {
	var date = (timeRaw & 0xffff0000) >> 16, time = timeRaw & 0x0000ffff;
	try {
		return new Date(1980 + ((date & 0xFE00) >> 9), ((date & 0x01E0) >> 5) - 1, date & 0x001F, (time & 0xF800) >> 11, (time & 0x07E0) >> 5,
				(time & 0x001F) * 2, 0);
	} catch (e) {
	}
}

 readCommonHeader(entry, data, index, centralDirectory, onerror) {
	entry.version = data.getUint16(index, true);
	entry.bitFlag = data.getUint16(index + 2, true);
	entry.compressionMethod = data.getUint16(index + 4, true);
	entry.lastModDateRaw = data.getUint32(index + 6, true);
	entry.lastModDate = getDate(entry.lastModDateRaw);
	if ((entry.bitFlag & 0x01) === 0x01) {
		//onerror(ERR_ENCRYPTED);
		console.log("ERR_ENCRYPTED");
		return;
	}
	if (centralDirectory || (entry.bitFlag & 0x0008) != 0x0008) {
		entry.crc32 = data.getUint32(index + 10, true);
		entry.compressedSize = data.getUint32(index + 14, true);
		entry.uncompressedSize = data.getUint32(index + 18, true);
	}
	if (entry.compressedSize === 0xFFFFFFFF || entry.uncompressedSize === 0xFFFFFFFF) {
		//onerror(ERR_ZIP64);
		console.log("ERR_ZIP64");
		return;
	}
	entry.filenameLength = data.getUint16(index + 22, true);
	entry.extraFieldLength = data.getUint16(index + 24, true);
}

loadEntry(entry){

	var _this = this;
	//this.getFilesize(this.url, function(size) {
	return new Promise(function (resolve, reject) {
	//_this.fileSize = parseInt(size);
	//	console.log("The new size of " + _this.url + " is : " + _this.fileSize + " bytes.");
	var from = entry.offset + 34 + entry.filenameLength + entry.extraFieldLength; //why 34 instead of 30?
	//console.log(from);
	var to = 	entry.offset + 33 + entry.filenameLength + entry.extraFieldLength + entry.compressedSize;
	const xhr = new XMLHttpRequest();
    xhr.open('GET', _this.url, true);
    xhr.responseType = 'arraybuffer';
	var str = 'bytes=' + String(from) + '-' + String(to);
	var sz = to-from;
//	console.log("size: " + String(sz));
//	console.log(str);
	var extension = entry.filename.substr(entry.filename.lastIndexOf('.') + 1).toLowerCase();
//console.log(entry);
//console.log(extension);
    xhr.setRequestHeader('Range', str );
    xhr.onreadystatechange = function() {
    	if (xhr.readyState == 4 && xhr.status === 206) {
			if(extension === 'png' || extension === 'jpeg' || extension ==='jpg'){
				/*var arrayBufferView = new Uint8Array( this.response );
				//console.log(_this.buf2hex(this.response));
				
				var blob;
				if(extension === 'png'){
					blob = new Blob( [ arrayBufferView ], { type: "image/png" } );
				} else{
					blob = new Blob( [ arrayBufferView ], { type: "image/jpg" } );
				}
				var urlCreator = window.URL || window.webkitURL;
				var imageUrl = urlCreator.createObjectURL( blob );
				var img = new Image();//document.querySelector( "#photo" );
				img.src = imageUrl;
				entry.image = img;
				console.log(entry);
				*/
				resolve(this.response);
			//console.log(img);
			} else if(extension === 'scml' || extension === 'json' ){
				//_this.scmlFile = JSON.stringify(Array.from(new Uint8Array(this.response)));
				//console.log(_this.buf2hex(this.response));
				//console.log(String.fromCharCode.apply(null, new Uint8Array(this.response)));
				
				entry.scmlFile = JSON.parse(String.fromCharCode.apply(null, new Uint8Array(this.response)));
				resolve();
			} else if(extension == 'dzi'){
				resolve(String.fromCharCode.apply(null, new Uint8Array(this.response)));
			}
		} else {
			//console.log("loadEntry xhr readystate: " + this.readyState);
			if(this.readyState != 2 && this.readyState != 3 ){
			  reject({
				  status: this.status,
				  statusText: xhr.statusText
		    	});
		    }
		  }
	}
	xhr.onerror = function () {
		console.log("loadEntry xhr.onerror");
		reject({
		  status: this.status,
		  statusText: xhr.statusText
		});
		
	}
    xhr.send(null);
	//});
});

}

buf2hex(buffer) { // buffer is an ArrayBuffer
	return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}
findEntry(filename){ 
//	console.log(this.rootname + filename);
	//if(filename ===)
	return this.entries.find(entry => {return entry.filename === this.rootname + filename})
}

parseSCML(index){
//console.log(this.scmlFiles[0]);
  
	this.width = parseFloat(this.scmlFiles[index].scmlFile.width);
	this.height = parseFloat(this.scmlFiles[index].scmlFile.height);
	this.layout = this.scmlFiles[index].scmlFile.layout;
  
	this.boolHsh = false;
	this.boolPld = false;
	this.boolPtm = false;
	this.boolRbf = false;
	this.njpegs = 0;
	this.planes = [];
	this.normalSource = 2; 
   
	if(this.scmlFiles[index].scmlFile.pld){
	  boolPhotometric = true;
	  this.pld_wl_nor = {file: this.scmlFiles[index].scmlFile.pld[0].pld_wl_nor[0].file, scale: parseFloat(this.scmlFiles[index].scmlFile.pld[0].pld_wl_nor[0].scale), bias: parseFloat(this.scmlFiles[index].scmlFile.pld[0].pld_wl_nor[0].bias), plane: 0 };
	  this.pld_wl_alb = {file: this.scmlFiles[index].scmlFile.pld[0].pld_wl_alb[0].file, scale: parseFloat(this.scmlFiles[index].scmlFile.pld[0].pld_wl_alb[0].scale), bias: parseFloat(this.scmlFiles[index].scmlFile.pld[0].pld_wl_alb[0].bias), plane: 1 };
	  this.planes[0] = this.pld_wl_nor;
	  this.planes[1] = this.pld_wl_alb;
	  if(this.scmlFiles[index].scmlFile.pld[0].pld_wl_amb){
		  boolHasAmbient[0] = true;
		  this.pld_wl_amb = {file: this.scmlFiles[index].scmlFile.pld[0].pld_wl_amb[0].file, scale: parseFloat(this.scmlFiles[index].scmlFile.pld[0].pld_wl_amb[0].scale), bias: parseFloat(this.scmlFiles[index].scmlFile.pld[0].pld_wl_amb[0].bias), plane: 2 };
		  this.planes[2] = this.pld_wl_amb;
	  }
	  this.njpegs += 3;
	  
	}
  
	if(this.scmlFiles[index].scmlFile.hsh ){
	  this.boolHsh = true;
	  boolRti = true;
	  this.hsh_plane_0 = {file: this.scmlFiles[index].scmlFile.hsh[0].hsh_plane_0[0].file, scale: parseFloat(this.scmlFiles[index].scmlFile.hsh[0].hsh_plane_0[0].scale), bias: parseFloat(this.scmlFiles[index].scmlFile.hsh[0].hsh_plane_0[0].bias), plane: 3 };
	  this.hsh_plane_1 = {file: this.scmlFiles[index].scmlFile.hsh[0].hsh_plane_1[0].file, scale: parseFloat(this.scmlFiles[index].scmlFile.hsh[0].hsh_plane_1[0].scale), bias: parseFloat(this.scmlFiles[index].scmlFile.hsh[0].hsh_plane_1[0].bias), plane: 4 };
	  this.hsh_plane_2 = {file: this.scmlFiles[index].scmlFile.hsh[0].hsh_plane_2[0].file, scale: parseFloat(this.scmlFiles[index].scmlFile.hsh[0].hsh_plane_2[0].scale), bias: parseFloat(this.scmlFiles[index].scmlFile.hsh[0].hsh_plane_2[0].bias), plane: 5 };
	  this.hsh_plane_3 = {file: this.scmlFiles[index].scmlFile.hsh[0].hsh_plane_3[0].file, scale: parseFloat(this.scmlFiles[index].scmlFile.hsh[0].hsh_plane_3[0].scale), bias: parseFloat(this.scmlFiles[index].scmlFile.hsh[0].hsh_plane_3[0].bias), plane: 6 };
	  this.planes[3] = this.hsh_plane_0;
	  this.planes[4] = this.hsh_plane_1;
	  this.planes[5] = this.hsh_plane_2;
	  this.planes[6] = this.hsh_plane_3;
  
	  vec4ScaleHSH = [this.planes[3].scale, this.planes[4].scale, this.planes[5].scale, this.planes[6].scale];
	  vec4BiasHSH = [this.planes[3].bias, this.planes[4].bias, this.planes[5].bias, this.planes[6].bias];
	  this.njpegs +=4;
	  if(this.scmlFiles[index].scmlFile.hsh[0].hsh_nor){
		  this.hsh_nor = {file: this.scmlFiles[index].scmlFile.hsh[0].hsh_nor[0].file, scale: parseFloat(this.scmlFiles[index].scmlFile.hsh[0].hsh_nor[0].scale), bias: parseFloat(this.scmlFiles[index].scmlFile.hsh[0].hsh_nor[0].bias), plane: 7  };
		  this.planes[7] = this.hsh_nor;
		  this.njpegs +=1;
	  } else { 
		  this.hsh_nor = {file: null, scale: 1, bias: 0};
	  }
	  if(this.scmlFiles[index].scmlFile.hsh[0].hsh_amb){
		  this.hsh_amb = {file: this.scmlFiles[index].scmlFile.hsh[0].hsh_amb[0].file, scale: parseFloat(this.scmlFiles[index].scmlFile.hsh[0].hsh_amb[0].scale), bias: parseFloat(this.scmlFiles[index].scmlFile.hsh[0].hsh_amb[0].bias), plane: 8 };
		  this.planes[8] = this.hsh_amb;
		  this.njpegs +=1;
	  } else { 
		  this.hsh_amb = {file: null, scale: 1, bias: 0};
	  }
	}
	//if(glTFObj.pld[0].depthTex){boolDepthMap = true;}
	if(this.scmlFiles[index].scmlFile.ptm){
	  this.boolPtm = true;
	  boolPtm = true;
		var lst = this.scmlFiles[index].scmlFile.ptm[0].ptm_plane_0[0].bias.split(",", 3);
		vec3BiasPTM0 = [parseFloat(lst[0]),parseFloat(lst[1]),parseFloat(lst[2])];
		lst = this.scmlFiles[index].scmlFile.ptm[0].ptm_plane_1[0].bias.split(",", 3);
		vec3BiasPTM1 = [parseFloat(lst[0]),parseFloat(lst[1]),parseFloat(lst[2])];
		lst = this.scmlFiles[index].scmlFile.ptm[0].ptm_plane_0[0].scale.split(",", 3);
		vec3ScalePTM0 = [parseFloat(lst[0]),parseFloat(lst[1]),parseFloat(lst[2])];
		lst = this.scmlFiles[index].scmlFile.ptm[0].ptm_plane_1[0].scale.split(",", 3);
		vec3ScalePTM1 = [parseFloat(lst[0]),parseFloat(lst[1]),parseFloat(lst[2])];
  
		this.hsh_plane_0 = {file: this.scmlFiles[index].scmlFile.ptm[0].ptm_plane_0[0].file, scale: parseFloat(this.scmlFiles[index].scmlFile.ptm[0].ptm_plane_0[0].scale), bias: parseFloat(this.scmlFiles[index].scmlFile.ptm[0].ptm_plane_0[0].bias), plane: 9 };
		this.hsh_plane_1 = {file: this.scmlFiles[index].scmlFile.ptm[0].ptm_plane_1[0].file, scale: parseFloat(this.scmlFiles[index].scmlFile.ptm[0].ptm_plane_1[0].scale), bias: parseFloat(this.scmlFiles[index].scmlFile.ptm[0].ptm_plane_1[0].bias), plane: 10 };
		this.hsh_plane_rgb = {file: this.scmlFiles[index].scmlFile.ptm[0].ptm_plane_rgb[0].file, scale: parseFloat(this.scmlFiles[index].scmlFile.ptm[0].ptm_plane_rgb[0].scale), bias: parseFloat(this.scmlFiles[index].scmlFile.ptm[0].ptm_plane_rgb[0].bias), plane: 11 };
		this.planes[9] = this.hsh_plane_0;
		this.planes[10] = this.hsh_plane_1;
		this.planes[11] = this.hsh_plane_rgb;
		this.njpegs+=3;
  
		if(this.scmlFiles[index].scmlFile.ptm[0].ptm_nor){
		  this.ptm_nor = {file: this.scmlFiles[index].scmlFile.ptm[0].ptm_nor[0].file, scale: parseFloat(this.scmlFiles[index].scmlFile.ptm[0].ptm_nor[0].scale), bias: parseFloat(this.scmlFiles[index].scmlFile.ptm[0].ptm_nor[0].bias), plane: 12 };
		  this.planes[12] = this.ptm_nor;
		  this.njpegs+=1;
		}
		if(this.scmlFiles[index].scmlFile.ptm[0].ptm_amb){
		  this.ptm_nor = {file: this.scmlFiles[index].scmlFile.ptm[0].ptm_amb[0].file, scale: parseFloat(this.scmlFiles[index].scmlFile.ptm[0].ptm_amb[0].scale), bias: parseFloat(this.scmlFiles[index].scmlFile.ptm[0].ptm_amb[0].bias), plane: 13 };
		  this.planes[13] = this.ptm_amb;
		  this.njpegs+=1;
		}
	  }
  
	  if(this.scmlFiles[index].scmlFile.rbf && 0 ){
		  this.boolRbf = true;
		  boolRbf = true;
		  this.nplanes = parseInt(this.scmlFiles[index].scmlFile.rbf[0].nplanes);
		  for (var i = 0; i < Math.ceil(this.nplanes/3); i++){
			  var strPlane = "rbf_plane_" + i;
			  var plane = {file: this.scmlFiles[index].scmlFile.rbf[0].eval(strPlane)[0].file, scale: parseFloat(this.scmlFiles[index].scmlFile.rbf[0].eval(strPlane)[0].scale), bias: parseFloat(this.scmlFiles[index].scmlFile.rbf[0].eval(strPlane)[0].bias), plane: i+14 };
			  this.planes[i + 14] = plane;
			  this.njpegs +=1;
		  }
		  this.rbf_plane_0 = {file: this.scmlFiles[index].scmlFile.hsh[0].hsh_plane_0[0].file, scale: parseFloat(this.scmlFiles[index].scmlFile.hsh[0].hsh_plane_0[0].scale), bias: parseFloat(this.scmlFiles[index].scmlFile.hsh[0].hsh_plane_0[0].bias), plane: 3 };
		  this.rbf_plane_1 = {file: this.scmlFiles[index].scmlFile.hsh[0].hsh_plane_1[0].file, scale: parseFloat(this.scmlFiles[index].scmlFile.hsh[0].hsh_plane_1[0].scale), bias: parseFloat(this.scmlFiles[index].scmlFile.hsh[0].hsh_plane_1[0].bias), plane: 4 };
		  this.rbf_plane_2 = {file: this.scmlFiles[index].scmlFile.hsh[0].hsh_plane_2[0].file, scale: parseFloat(this.scmlFiles[index].scmlFile.hsh[0].hsh_plane_2[0].scale), bias: parseFloat(this.scmlFiles[index].scmlFile.hsh[0].hsh_plane_2[0].bias), plane: 5 };
		  this.rbf_plane_3 = {file: this.scmlFiles[index].scmlFile.hsh[0].hsh_plane_3[0].file, scale: parseFloat(this.scmlFiles[index].scmlFile.hsh[0].hsh_plane_3[0].scale), bias: parseFloat(this.scmlFiles[index].scmlFile.hsh[0].hsh_plane_3[0].bias), plane: 6 };
		  this.planes[3] = this.hsh_plane_0;
		  this.planes[4] = this.hsh_plane_1;
		  this.planes[5] = this.hsh_plane_2;
		  this.planes[6] = this.hsh_plane_3;
	  
		  vec4ScaleHSH = [this.planes[3].scale, this.planes[4].scale, this.planes[5].scale, this.planes[6].scale];
		  vec4BiasHSH = [this.planes[3].bias, this.planes[4].bias, this.planes[5].bias, this.planes[6].bias];
		  this.njpegs +=4;
		  if(this.scmlFiles[index].scmlFile.hsh[0].hsh_nor){
			  this.hsh_nor = {file: this.scmlFiles[index].scmlFile.hsh[0].hsh_nor[0].file, scale: parseFloat(this.scmlFiles[index].scmlFile.hsh[0].hsh_nor[0].scale), bias: parseFloat(this.scmlFiles[index].scmlFile.hsh[0].hsh_nor[0].bias), plane: 7  };
			  this.planes[7] = this.hsh_nor;
			  this.njpegs +=1;
		  } else { 
			  this.hsh_nor = {file: null, scale: 1, bias: 0};
		  }
		  if(this.scmlFiles[index].scmlFile.hsh[0].hsh_amb){
			  this.hsh_amb = {file: this.scmlFiles[index].scmlFile.hsh[0].hsh_amb[0].file, scale: parseFloat(this.scmlFiles[index].scmlFile.hsh[0].hsh_amb[0].scale), bias: parseFloat(this.scmlFiles[index].scmlFile.hsh[0].hsh_amb[0].bias), plane: 8 };
			  this.planes[8] = this.hsh_amb;
			  this.njpegs +=1;
		  } else { 
			  this.hsh_amb = {file: null, scale: 1, bias: 0};
		  }
		}
	  
  
   this.njpegs = 0;
   for(var ab = 0; ab < this.planes.length; ab++){
	  if(this.planes[ab]){this.njpegs++;}
   }
  
	this.pos = { x: 0, y:0, z: 0, a: 0 };
	this.maxRequested = 10;
  
	this.border = 1;
	this.mipmapbias= 0.5;
	this.canvas = {width: 0, height: 0};
  
	//change
	this.pos = {x: this.width/2, y: this.height/2, z:1, a:100};
  
  }

  get(url, type) {
	  var _this = this;
	if(!url) throw "Missing url!";
	return new Promise(function (resolve, reject) {
		console.log(url);
		var entry = _this.findEntry(url);
		//console.log(entry);
		if(entry){
		  _this.loadEntry(entry)
			.then(function(e) {
				resolve(e);
			}).catch(function(e){console.log(e)});
	    } else { reject();}
	/*
	var r=new XMLHttpRequest();
	r.open('GET', url);
	if(type != 'xml')
		r.responseType = type;
	r.onload = function (e) {
		if (r.readyState === 4) {
			if (r.status === 200) {
				if(type == 'xml')
					callback(r.responseXML);
				else
					callback(r.response);
			} else {
				console.error(r.statusText);
			}
		}
	};
	r.send();
	*/

});

}


_onload = [];

nodes = [];
lweights = [];
cache = {};           //priority [index, level, x, y] //is really needed? probably not.
queued = [];          //array of things to load
requested = {};       //things being actually requested
requestedCount = 0;
animaterequest = null;
waiting = 0;
visible = true;
object = null;

setUrl(url){
	var t = this;
	t.url = url;
	t.img = 'plane_0';

	t.waiting = 1;
	t.get(url + '/info.scml', 'json').then(function(d) { t.waiting--; t.loadInfo(d); });
}
onLoad(f) {
	this._onload.push(f);
}


loaded() {
	var t = this;
	if(t.waiting) return;


	t.prefetch(); //TODO PROBLEM! thees need to be called everytime a node has been loaded (it will do by itself) or position has changed
	t._onload.forEach( (f) => { f(); });

	//this needs to know it's orientation.
	//t.computeLightWeights(t.light);
}


initTree() {
//console.log("inittree")
	var t = this;

	if(t.imgCache) {
		for(var i = 0; i < t.imgCache.length; i++)
			t.imgCache[i].src = '';
	} else {
		t.imgCache = [];
		for(var i = 0; i < t.maxRequested*t.njpegs; i++) {
			var image = new Image();
			image.crossOrigin = "";
			t.imgCache[i] = image;
		}
	}
	t.currImgCache = 0;

	t.flush();
	t.nodes = [];
//	console.log("inittree2" );

	switch(t.layout) {
		case "image":
			t.nlevels = 1;
			t.tilesize = 0;
			t.qbox = [[0, 0, 1, 1]];
			t.bbox = [[0, 0, t.width, t.height]];

			t.getTileURL = function(image, x, y, level) {
				return image;
			};
			t.nodes[0] = { tex: [], missing:t.njpegs };
			return;

		case "google":
			t.tilesize = 256;
			t.overlap = 0;
			var max = Math.max(t.width, t.height)/t.tilesize;
			t.nlevels = Math.ceil(Math.log(max) / Math.LN2) + 1;

			t.getTileURL = function(image, x, y, level) {
				var prefix = image.substr(0, image.lastIndexOf("."));
				var base = t.url + '/' + prefix;
				var ilevel = parseInt(t.nlevels - 1 - level);
				return base + "/" + ilevel + "/" + y + "/" + x + t.suffix;
			};
			break;

		case "deepzoom":
			t.metaDataURL = /*t.url + */t.planes[0].file;
			//console.log(t.planes[0].file);
			t.getTileURL = function (image, x, y, level) {
				//console.log(image);
				var prefix = image.substr(0, image.lastIndexOf("."));
				var base = /*t.url +  '/' +*/ prefix + '_files/';
				var ilevel = parseInt(t.nlevels - 1 - level);
				//console.log( base + ilevel + '/' + x + '_' + y + t.suffix);
				return base + ilevel + '/' + x + '_' + y + t.suffix;
			};

			t.parseMetaData = function (response) {
				t.suffix = "." + /Format="(\w+)/.exec(response)[1];
				t.tilesize = parseInt(/TileSize="(\d+)/.exec(response)[1]);
				t.overlap = parseInt(/Overlap="(\d+)/.exec(response)[1]);

				if(!t.width) t.width = parseInt(/Width="(\d+)/.exec(response)[1]);
				if(!t.height) t.height = parseInt(/Height="(\d+)/.exec(response)[1]);

				var max = Math.max(t.width, t.height)/t.tilesize;
				t.nlevels = Math.ceil(Math.log(max) / Math.LN2) + 1;
			};

			break;

		case "zoomify":
			t.overlap = 0; //overlap is not specified!
			t.metaDataURL = t.url + "/" + t.img + "/ImageProperties.xml";
			t.getTileURL = function(image, x, y, level) {
				var prefix = image.substr(0, image.lastIndexOf("."));
				var base = t.url + '/' + prefix;
				var ilevel = parseInt(t.nlevels - 1 - level);
				var index = t.index(level, x, y)>>>0;
				var group = index >> 8;
				return base + "/TileGroup" + group + "/" + ilevel + "-" + x + "-" + y + t.suffix;
			};

			t.parseMetaData = function(response) {
				var tmp = response.split('"');
				t.tilesize = parseInt(tmp[11]);

				var max = Math.max(t.width, t.height)/t.tilesize;
				t.nlevels = Math.ceil(Math.log(max) / Math.LN2) + 1;
			}
			break;


		case "iip":
			t.suffix = ".tif";
			t.overlap = 0;
			t.metaDataURL = t.server + "?FIF=" + t.path + "/" + t.img + t.suffix + "&obj=IIP,1.0&obj=Max-size&obj=Tile-size&obj=Resolution-number";

			t.parseMetaData = function(response) {
				var tmp = response.split( "Tile-size:" );
				if(!tmp[1]) return null;
				t.tilesize = parseInt(tmp[1].split(" ")[0]);
				tmp = response.split( "Max-size:" );
				if(!tmp[1]) return null;
				tmp = tmp[1].split('\n')[0].split(' ');
				t.width = parseInt(tmp[0]);
				t.height= parseInt(tmp[1]);
				t.nlevels  = parseInt(response.split( "Resolution-number:" )[1]);
			}

			t.getTileURL = function(image, x, y, level) {
				var prefix = image.substr(0, image.lastIndexOf("."));
				var img = t.path + "/" + prefix + t.suffix;
				var index = y*t.qbox[level][2] + x;
				var ilevel = parseInt(t.nlevels - 1 - level);
				return t.server+"?FIF=" + img + "&JTL=" + ilevel + "," + index;
			};
			break;

		case "iiif":
			t.metaDataURL = t.server + "?IIIF=" + t.path + "/" + t.img + "/info.json";
			t.parseMetaData = function(response) {
				var info = JSON.parse(response);
				t.width = info.width;
				t.height = info.height;
				t.nlevels = info.tiles[0].scaleFactors.length;
				t.tilesize = info.tiles[0].width;
			}
			t.getTileURL = function(image, x, y, level) {
				let tw = t.tilesize;
				let ilevel = parseInt(t.nlevels - 1 - level);
				let s = Math.pow(2, level);
				//region parameters
				let xr = x * tw * s;
				let yr = y * tw * s;
				let wr = Math.min(tw * s, t.width - xr)
				let hr = Math.min(tw * s, t.height - yr);

				// pixel size parameters /ws,hs/
				let ws = tw
				if (xr + tw*s > t.width)
					ws = (t.width - xr + s - 1) / s  
				let hs = tw
				if (yr + tw*s > t.height)
					hs = (t.height - yr + s - 1) / s

				return t.server + `?IIIF=${t.path}/${t.img}/${xr},${yr},${wr},${hr}/${ws},${hs}/0/default.jpg`;
			};
			break;
		default:
			console.log("OOOPPpppps");
	}

	if(t.metaDataURL) {
		t.waiting++;
		t.get(t.metaDataURL, 'text').then(function(r) {t.waiting--; t.parseMetaData(r); initBoxes(); t.loaded(); });
	} else 
		initBoxes();

	function initBoxes() {
//console.log("here");
		t.qbox = []; //by level (0 is the bottom)
		t.bbox = [];
		var w = t.width;
		var h = t.height;
		var count = 0;
		for(var level = t.nlevels - 1; level >= 0; level--) {
			var ilevel = t.nlevels -1 - level;
			t.qbox[ilevel] = [0, 0, 0, 0];
			t.bbox[ilevel] = [0, 0, w, h];
			for(var y = 0; y*t.tilesize < h; y++) {
				t.qbox[ilevel][3] = y+1;
				for(var x = 0; x*t.tilesize < w; x ++) {
					t.nodes[count++] = { tex: [], missing: t.njpegs };
					t.qbox[ilevel][2] = x+1;
				}
			}
			w >>>= 1;
			h >>>= 1;
		}
	}
}

rot(dx, dy, a) {
	var a = Math.PI*(a/180);
	var x =  Math.cos(a)*dx + Math.sin(a)*dy;
	var y = -Math.sin(a)*dx + Math.cos(a)*dy;
	return [x, y];
}

//convert image coords to canvas coords
project(pos, x, y) {
	var t = this;
	var z = Math.pow(2, pos.z);

	var r = t.rot(x - t.width/2,  y - t.height/2, pos.a);
	r[0] = (r[0] - pos.x)/z;
	r[1] = (r[1] - pos.y)/z;

	return r;
}

//TODO fully support rect
/*
iproject(pos, x, y) {
	var t = this;
	var z = Math.pow(2, pos.z);
	var r = t.rot(x*z + pos.x, y*z + pos.y, pos.a);
	r[0] += t.width/2;
	r[1] += t.height/2;
	return r;
}
*/

iproject(pos, x, y) {
	var tan15 = -Math.tan(15*Math.PI/180)*this.object.position[2]/this.object.vertices[1];
	var r = [];
	var scale = -Math.tan(15/180*Math.PI)*this.object.position[2]/this.object.vertices[1]*this.height/this.canvas.height;

	//r[1] = this.height*tan15/this.canvas.height * (y + this.canvas.height/2) + this.height/2*(1-tan15);// + this.object.position[1]*this.height/100*this.width/this.height;
	//r[0] = this.width*tan15*this.height/this.width/this.canvas.width * (x + this.canvas.width/2) + this.width/2 * (1-tan15*this.height/this.width);
    //r[0] = (this.width*tan15/this.canvas.width * (x + this.canvas.width/2) + this.width/2 * (1-tan15))*this.width/this.height*this.canvas.width/this.canvas.height;// - this.object.position[0]*this.width/100;
	r[1] = -Math.tan(15*Math.PI/180.0)*(y)*this.object.position[2]/this.object.vertices[1]*this.height/2 + this.height/2 +this.object.position[1]/this.object.vertices[1]*this.height/2 ;
	r[0] = -Math.tan(15*Math.PI/180.0)*x*this.object.position[2]/this.object.vertices[0]*this.width/2*this.canvas.width/this.canvas.height  + this.width/2 +this.object.position[0]/this.object.vertices[0]*this.width/2;
	return r;
}

//return the box of the image in the canvas coords (remember the center at 0,0)
getBox(pos) {
	var t = this;
	var corners = [0, 0,  0, 1,  1, 1,  1, 0];
	var box = [ 1e20, 1e20, -1e20, -1e20];
	for(var i = 0; i < 8; i+= 2) {
		var p = t.project(pos, corners[i]*t.width, corners[i+1]*t.height);
		box[0] = Math.min(p[0], box[0]);
		box[1] = Math.min(p[1], box[1]);
		box[2] = Math.max(p[0], box[2]);
		box[3] = Math.max(p[1], box[3]);
	}
	return box;
}

//sreturn the coordinates of the canvas in image space
getIBox(pos) {
	var t = this;
	var corners = [-1, -1,  -1, 1,  1, 1,  1, -1];
	var box = [ 1e20, 1e20, -1e20, -1e20];
	for(var i = 0; i < 8; i+= 2) {
		var p = t.iproject(pos, corners[i], corners[i+1]);
		box[0] = Math.min(p[0], box[0]);
		box[1] = Math.min(p[1], box[1]);
		box[2] = Math.max(p[0], box[2]);
		box[3] = Math.max(p[1], box[3]);
	}
	return box;
}

/*
getIBox(pos) {
	var t = this;
	var corners = [-0.5, -0.5,  -0.5, 0.5,  0.5, 0.5,  0.5, -0.5];
	var box = [];
	var tan15 = Math.tan(15*Math.PI/180)*this.object.position[2]/this.object.vertices[1];
	box[0] = this.height/2*(1-tan15);
	box[1] = this.height/2*(1+tan15);
	box[2] = this.width/2*(1-tan15*this.width/this.height);
	box[3] = this.width/2*(1+tan15*this.width/this.height);
	return box;
}
*/

// p from 0 to nplanes,
basePixelOffset(m, p, x, y, k) {
	var t = this;
	return ((m*(t.nplanes+1) + p)*t.resolution*t.resolution + (x + y*t.resolution))*3 + k;
}

baseLightOffset(m, p, l, k) {
	var t = this;
	return ((m*(t.nplanes+1) + p)*t.ndimensions + l)*3 + k;
}

loadFactorAndBias(){
	var t = this;
	t.factor = new Float32Array((t.nplanes+1)*t.nmaterials);
	t.bias = new Float32Array((t.nplanes+1)*t.nmaterials);

	for(var m = 0;  m < t.nmaterials; m++) {
		for(var p = 1; p < t.nplanes+1; p++) {
			t.factor[m*(t.nplanes+1) + p] = t.materials.scale[p-1];
			t.bias [m*(t.nplanes+1) + p] = t.materials.bias [p-1];
		}
	}

}

loadBasis(data) {
	var t = this;
	var tmp = new Uint8Array(data);

	//apply offset and scale of the basis
	t.basis = new Float32Array(tmp.length);
	for(var m = 0; m < t.nmaterials; m++) {
		for(var p = 0; p < t.nplanes+1; p++) {
			for(var c = 0; c < t.ndimensions; c++) {
				for(var k = 0; k < 3; k++) {
					var o = t.baseLightOffset(m, p, c, k);
					if(p == 0)
						t.basis[o] = tmp[o]/255; //range from 0 to 1.
					else
						t.basis[o] = ((tmp[o] - 127)/t.materials.range[p-1]);
				}
			}
		}
	}
}

computeLightWeights(lpos) {
	var t = this;
  var rotatedLight = [lpos[0]*Math.cos(rotation[2]/180*Math.PI)-lpos[1]*Math.sin(rotation[2]/180*Math.PI), lpos[0]*Math.sin(rotation[2]/180*Math.PI)+lpos[1]*Math.cos(rotation[2]/180*Math.PI), lpos[2] ];
	var l = t.rot(rotatedLight[0], rotatedLight[1], -t.pos.a);
	l[2] = rotatedLight[2];

	if(t.waiting) return;
	console
	var lightFun;
	switch(t.type) {
	case 'img':                                     return;
	case 'rbf':      lightFun = t.computeLightWeightsRbf;  break;
	case 'bilinear': lightFun = t.computeLightWeightsOcta; break;
	case 'ptm':      lightFun = t.computeLightWeightsPtm;  break;
	case 'hsh':      lightFun = t.computeLightWeightsHsh;  break;
	default: console.log("Unknown basis", t.type);
	}
	lightFun.call(this, l);
}

computeLightWeightsRbf(lp) {
	var t = this;
  var lpos = [lp[0]*Math.cos(rotation[2]/180*Math.PI)-lp[1]*Math.sin(rotation[2]/180*Math.PI), lp[0]*Math.sin(rotation[2]/180*Math.PI)+lp[1]*Math.cos(rotation[2]/180*Math.PI), lp[2] ];

	var nm = t.nmaterials;
	var np = t.nplanes;
	var radius = 1/(t.sigma*t.sigma);console

	var weights = new Array(t.ndimensions);

	//compute rbf weights
	var totw = 0.0;
	for(var i = 0; i < weights.length; i++) {
		var dx = t.lights[i*3+0] - lpos[0];
		var dy = t.lights[i*3+1] - lpos[1];
		var dz = t.lights[i*3+2] - lpos[2];

		var d2 = dx*dx + dy*dy + dz*dz;
		var w = Math.exp(-radius * d2);

		weights[i] = [i, w];
		totw += w;
	}
	for(var i = 0; i < weights.length; i++)
		weights[i][1] /= totw;


	//pick only most significant and renormalize

	var count = 0;
	totw = 0.0;
	for(var i = 0; i < weights.length; i++)
		if(weights[i][1] > 0.001) {
			weights[count++] =  weights[i];
			totw += weights[i][1];
		}

	weights = weights.slice(0, count);

	for(var i = 0; i < weights.length; i++)
		weights[i][1] /= totw;


	//now iterate basis:
	t.lweights = new Float32Array(nm * (np + 1) * 3);

	for(var m = 0; m < nm; m++) {
		for(var p = 0; p < np+1; p++) {
			for(var k = 0; k < 3; k++) {
				for(var l = 0; l < weights.length; l++) {
					var o = t.baseLightOffset(m, p, weights[l][0], k);
					t.lweights[3*(m*(np+1) + p) + k] += weights[l][1]*t.basis[o];
				}
			}
		}
	}
}

computeLightWeightsPtm(v) {
	var t = this;
	var w = [1.0, v[0], v[1], v[0]*v[0], v[0]*v[1], v[1]*v[1], 0, 0, 0];

	t.lweights = new Float32Array(t.nplanes);
	for(var p = 0; p < w.length; p++)
		t.lweights[p] = w[p];
}

computeLightWeightsHsh(v) {
	var t = this;
	var M_PI = 3.1415;
	var phi = Math.atan2(v[1], v[0]);
	if (phi < 0.0)
		phi = 2.0 * M_PI + phi;
	var theta = Math.min(Math.acos(v[2]), M_PI / 2.0 - 0.5);

	var cosP = Math.cos(phi);
	var cosT = Math.cos(theta);
	var cosT2 = cosT * cosT;

	var w = new Float32Array(9);
	w[0] = 1.0 / Math.sqrt(2.0 * M_PI);

	w[1] = Math.sqrt(6.0 / M_PI) * (cosP * Math.sqrt(cosT-cosT2));
	w[2] = Math.sqrt(3.0 / (2.0 * M_PI)) * (-1.0 + 2.0*cosT);
	w[3] = Math.sqrt(6.0 / M_PI) * (Math.sqrt(cosT - cosT2) * Math.sin(phi));

	w[4] = Math.sqrt(30.0 / M_PI) * (Math.cos(2.0 * phi) * (-cosT + cosT2));
	w[5] = Math.sqrt(30.0 / M_PI) * (cosP*(-1.0 + 2.0 * cosT) * Math.sqrt(cosT - cosT2));
	w[6] = Math.sqrt(5.0 / (2.0 * M_PI)) * (1.0 - 6.0 * cosT + 6.0 * cosT2);
	w[7] = Math.sqrt(30.0 / M_PI) * ((-1.0 + 2.0 * cosT) * Math.sqrt(cosT - cosT2) * Math.sin(phi));
	w[8] = Math.sqrt(30.0 / M_PI) * ((-cosT + cosT2) * Math.sin(2.0*phi));

	t.lweights = w;
}

index(level, x, y) {
	var t = this;
	var startindex = 0;
	for(var i = t.nlevels-1; i > level; i--) {
		startindex += t.qbox[i][2]*t.qbox[i][3];
	}
	return startindex + y*t.qbox[level][2] + x;

/*	var startindex = ((1<<(ilevel*2))-1)/3;
	var side = 1<<ilevel;
	return startindex + y*side + x; */
}

loadTile(level, x, y) {
	var t = this;
	var index = t.index(level, x, y);

	if(t.requested[index]) {
		console.log("AAARRGGHHH double request!");
		return;
	}
	t.requested[index] = true;
	t.requestedCount++;
	for(var p = 0; p < this.planes.length; p++) {
		if(t.planes[p]){
			t.loadComponent(p, index, level, x, y);
		}
	}
}

loadComponent(plane, index, level, x, y) {
	var t = this;
	//var gl = t.gl;
	//if(t.type == 'img')
	//	var name = t.img + ".jpg";
	//else

	var name = t.planes[plane].file;
	//TODO use a cache of images to avoid memory allocation waste
	var image = t.imgCache[t.currImgCache++]; //new Image();
	if(t.currImgCache >= t.imgCache.length)
		t.currImgCache = 0;
//	image.crossOrigin = "Anonymous";
	

//image.src = t.getTileURL(name, x, y, level);
//console.log(t.getTileURL(name, x, y, level));
t.loadEntry(t.findEntry(t.getTileURL(name, x, y, level))).then(function(e){
	//var img = new Image();
	var arrayBufferView = new Uint8Array( e );
	//console.log(t.buf2hex(e));
	var blob; 
	if(name.substring(name.lastIndexOf('.') + 1).toLowerCase() ==='png'){
		blob = new Blob( [ arrayBufferView ], { type: "image/png" } );
	} else {
		blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
	}
	$("#progressFooter").html("Loaded texture " + name + " (" + x + "," + y + "," + level+")");
	var urlCreator = window.URL || window.webkitURL;
	var imageUrl = urlCreator.createObjectURL( blob );
	//console.log(imageUrl);
	//var img = new Image();//*/document.querySelector( "#photo" );
	image.src = imageUrl;
	image.onload = function(){
	//console.log(image);
	//console.log("Loading image " + t.rootname + t.getTileURL(name, x, y, level) + " for index " + index + " level: " + level + " x: "+ x + " y: "+y + " dims: "+ image.height + 'x' + image.width);
	//console.log(t.findEntry(t.getTileURL(name, x, y, level)));
	var tex = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, tex);
	gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); //_MIPMAP_LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
//		gl.generateMipmap(gl.TEXTURE_2D);

	t.nodes[index].tex[plane] = tex;
	t.nodes[index].missing--;
	if(t.nodes[index].missing == 0) {
		delete t.requested[index];
		t.requestedCount--;
		t.preload();
		//t.redraw();
	}
	if(gl){render();}
}
}).catch(function(e){

	console.log("FAILED Loading image " + t.rootname + t.getTileURL(name, x, y, level) + " for index " + index);
	console.log(e);
	t.nodes[index].missing = -1;
	delete t.requested[index];
	t.requestedCount--;
	t.preload();

});


/*
//removeEventListener
//	image.addEventListener('load', function() {
	image.onload = function() {
		console.log("Loading image " + image.src + " for index " + index + " level: " + level + " x: "+ x + " y: "+y);
		var tex = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, tex);
		gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); //_MIPMAP_LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
//		gl.generateMipmap(gl.TEXTURE_2D);

		t.nodes[index].tex[plane] = tex;
		t.nodes[index].missing--;
		if(t.nodes[index].missing == 0) {
			delete t.requested[index];
			t.requestedCount--;
			t.preload();
			//t.redraw();
		}
	};
	image.onerror = function() {
		console.log("FAILED Loading image " + image.src + " for index " + index);

		t.nodes[index].missing = -1;
		delete t.requested[index];
		t.requestedCount--;
		t.preload();
	}
	*/
}

flush() {
	var t = this;
	if(!t.nodes) return;
	for(var i = 0; i < t.nodes.length; i++) {
		var node = t.nodes[i];
		//abort calls TODO
		for(var j = 0; j < node.tex.length; j++)
		{ console.log("delete textures");
			gl.deleteTexture(node.tex[j]);
		}
	}
	//clean up cache events
	t.previouslevel = null;
	t.previousbox = [1, 1, -1, -1];
	for(var i = 0; i < t.imgCache.length; i++) {
		var img = t.imgCache[i];
		img.onload = null;
		img.onerror = null;
	}
	t.requested = {};
	t.requestedCount = 0;
}

drawNode(pos, minlevel, level, x, y) {
	var t = this;
	var index = t.index(level, x, y);
//console.log(index+" "+ level+ " "+x+ " "+y);
	//TODO if parent is present let's these checks pass.
	//console.log("loading image"+index+" "+ level+ " "+x+ " "+y);
	if(this.nodes[index].missing != 0)
	{ console.log("missing image"+index+" "+ level+ " "+x+ " "+y);
		return; //missing image
	}
	//compute coords of the corners
	var z = Math.pow(2, pos.z);
	var a = Math.PI*pos.a/180;
	var c = Math.cos(a);
	var s = Math.sin(a);

//TODO use a static buffer
	var coords = new Float32Array([ 0, 0, 0,  1, 0, 0,   0, 1, 0,   1,  1, 0]);
	var tcoords = new Float32Array([0, 0,   1, 0,    0, 1,    1, 1]);


	var sx = 2.0/t.canvas.width;
	var sy = 2.0/t.canvas.height;

	if(t.layout == "image") {
		for(var i = 0; i < coords.length; i += 3) {

			coords[i] = -(coords[i]*t.width - t.width/2)/t.width*2*this.object.vertices[0];
			coords[i+1] = -(coords[i+1]*t.height - t.height/2)/t.height*2*this.object.vertices[1];
			coords[i+2] = 0;
		}

	} else {
		var side  = t.tilesize*(1<<(level)); //tilesizeinimgspace

		var tx = side;
		var ty = side;
		if(t.layout != "google") { //google does not clip images.
			if(side*(x+1) > t.width) {
				tx = (t.width  - side*x);
			}
			if(side*(y+1) > t.height) {
				ty = (t.height - side*y);
			} //in imagespace
		}

		var over = t.overlap;
		var lx  = t.qbox[level][2]-1;
		var ly  = t.qbox[level][3]-1;

		if(over) {
			var dtx = over / (tx/(1<<level) + (x==0?0:over) + (x==lx?0:over));
			var dty = over / (ty/(1<<level) + (y==0?0:over) + (y==ly?0:over));

			tcoords[0] = tcoords[4] = (x==0? 0: dtx);
			tcoords[1] = tcoords[3] = (y==0? 0: dty);

			tcoords[2] = tcoords[6] = (x==lx? 1: 1 - dtx);
			tcoords[7] = tcoords[5] = (y==ly? 1: 1 - dty);
		}

		/*for(var i = 0; i < coords.length; i+=3) {
			var r = t.rot(coords[i]*tx + side*x - t.width/2,  -coords[i+1]*ty - side*y + t.height/2, pos.a);
			coords[i]   = (r[0] - pos.x)*sx/z;
			coords[i+1] = (r[1] + pos.y)*sy/z;
		}
*/
	for(var i = 0; i < coords.length; i+=3) {
		coords[i] = -(coords[i]*tx+side*x - t.width/2)/t.width*2*this.object.vertices[0];
		coords[i+1] = -(coords[i+1]*ty+side*y - t.height/2)/t.height*2*this.object.vertices[1];
		//coords[i] = coords[i]*sx/z;
		//coords[i+1] = coords[i+1]*sy/z;
		coords[i+2] = 0;
	}
	//if(x==0){console.log(coords); console.log(this.object.vertices);};
	var abch =1;

	}

//0.0 is in the center of the screen, 
	//var gl = t.gl;
	//TODO join buffers, and just make one call per draw! (except the bufferData, which is per node)
	gl.bindBuffer(gl.ARRAY_BUFFER, this.object.vbo);
	gl.enableVertexAttribArray(0);
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
	
	gl.bufferData(gl.ARRAY_BUFFER, coords, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);


	gl.bindBuffer(gl.ARRAY_BUFFER, this.object.tbo);
	gl.enableVertexAttribArray(1);
	gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
	gl.bufferData(gl.ARRAY_BUFFER, tcoords, gl.STATIC_DRAW);
	
	
	//gl.vertexAttribPointer(t.texattrib, 2, gl.FLOAT, false, 0, 0);
	//gl.enableVertexAttribArray(t.texattrib);

	switch(this.normalSource){
		case 2: 			
			gl.activeTexture(gl.TEXTURE1);
			gl.bindTexture(gl.TEXTURE_2D, t.nodes[index].tex[0]);
			gl.uniform1i(this.curPrg.uNormalSampler, 1);
			break;
		case 5: 			
			gl.activeTexture(gl.TEXTURE1);
			gl.bindTexture(gl.TEXTURE_2D, t.nodes[index].tex[7]);
			gl.uniform1i(this.curPrg.uNormalSampler, 1);
			break;
		case 6: 			
			gl.activeTexture(gl.TEXTURE1);
			gl.bindTexture(gl.TEXTURE_2D, t.nodes[index].tex[12]);
			gl.uniform1i(this.curPrg.uNormalSampler, 1);
			break;

	}
	// Only the next shaders use HSH coeffs
if(this.curPrg == program20 || this.curPrg == program22 || this.curPrg == program24 || this.curPrg == program25){ 
	gl.activeTexture(gl.TEXTURE2);
	gl.bindTexture(gl.TEXTURE_2D, t.nodes[index].tex[3]);
	gl.uniform1i(this.curPrg.hshCoeff0Tex, 2);

	gl.activeTexture(gl.TEXTURE3);
	gl.bindTexture(gl.TEXTURE_2D, t.nodes[index].tex[4]);
	gl.uniform1i(this.curPrg.hshCoeff1Tex, 3);

	gl.activeTexture(gl.TEXTURE4);
	gl.bindTexture(gl.TEXTURE_2D, t.nodes[index].tex[5]);
	gl.uniform1i(this.curPrg.hshCoeff2Tex, 4);

	gl.activeTexture(gl.TEXTURE5);
	gl.bindTexture(gl.TEXTURE_2D, t.nodes[index].tex[6]);
	gl.uniform1i(this.curPrg.hshCoeff3Tex, 5);
} else if(this.curPrg == program21 || this.curPrg == program23){

	gl.activeTexture(gl.TEXTURE2);
	gl.bindTexture(gl.TEXTURE_2D,  t.nodes[index].tex[9]);
	gl.uniform1i(this.curPrg.ptmCoeff0Tex, 2);

	gl.activeTexture(gl.TEXTURE3);
	gl.bindTexture(gl.TEXTURE_2D,  t.nodes[index].tex[10]);
	gl.uniform1i(this.curPrg.ptmCoeff1Tex, 3);

	gl.activeTexture(gl.TEXTURE4);
	gl.bindTexture(gl.TEXTURE_2D,  t.nodes[index].tex[11]);
	gl.uniform1i(this.curPrg.ptmRgbCoeffTex, 4);
}
else if(this.curPrg == program33){
	gl.activeTexture(gl.TEXTURE6);
	gl.bindTexture(gl.TEXTURE_2D, t.nodes[index].tex[1]);
	gl.uniform1i(this.curPrg.uAlbedoSampler, 6);

	gl.activeTexture(gl.TEXTURE2);
	gl.bindTexture(gl.TEXTURE_2D, t.nodes[index].tex[3]);
	gl.uniform1i(this.curPrg.hshCoeff0Tex, 2);

	gl.activeTexture(gl.TEXTURE3);
	gl.bindTexture(gl.TEXTURE_2D, t.nodes[index].tex[4]);
	gl.uniform1i(this.curPrg.hshCoeff1Tex, 3);

	gl.activeTexture(gl.TEXTURE4);
	gl.bindTexture(gl.TEXTURE_2D, t.nodes[index].tex[5]);
	gl.uniform1i(this.curPrg.hshCoeff2Tex, 4);

	gl.activeTexture(gl.TEXTURE5);
	gl.bindTexture(gl.TEXTURE_2D, t.nodes[index].tex[6]);
	gl.uniform1i(this.curPrg.hshCoeff3Tex, 5);
}
else{

			gl.activeTexture(gl.TEXTURE2);
			if(useAmbient){
				gl.bindTexture(gl.TEXTURE_2D, t.nodes[index].tex[2]);
			}
			else{
				gl.bindTexture(gl.TEXTURE_2D, t.nodes[index].tex[1]);
			}
			gl.uniform1i(this.curPrg.uAlbedoSampler, 2);

	
}
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.object.ibo);
	gl.drawElements(gl.TRIANGLES, this.object.indices.length, gl.UNSIGNED_INT,0);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

draw(pos,obj,curProgram,canvasHeight,canvasWidth){
	//console.log("draw");
	this.object = obj;
	this.curPrg = curProgram;
	var t = this;
	this.canvas.width = canvasWidth;
	this.canvas.height = canvasHeight;
	//var gl = t.gl;

	if(t.waiting || !t.visible)
		return;

	var needed = t.neededBox(pos, 0);

	var minlevel = needed.level; //this is the minimum level;
	var ilevel = t.nlevels - 1 - minlevel;
	//size of a rendering pixel in original image pixels.
	var scale = -Math.tan(15*Math.PI/180)*this.object.position[2]/this.canvas.height;

	//find coordinates of the image in the canvas
	var box = [
		t.canvas.width/2 - pos[0],
		t.canvas.height/2 - (t.height/scale - pos[1]),
		t.width/scale,
		t.height/scale
	];
	if(t.layout == "google") {
		box[0] += 1; box[1] += 1; box[2] -= 2; box[3] -= 2;
	}
	//gl.enable(gl.SCISSOR_TEST);
	//gl.scissor(box[0], box[1], box[2], box[3]);

	//TEST
	//gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	//gl.enable(gl.BLEND);

	//gl.useProgram(t.program);
	//gl.uniform1f(t.opacitylocation, t.opacity);
	//t.drawNode(pos, minlevel, 2, 0, 0);
	//t.drawNode(pos, minlevel, 2, 1, 0);
	for(var y = 0; y<9; y++){
		for(var x = 0; x<10; x++){
		//	t.drawNode(pos, minlevel, 0, x, y);
		}
	}
	//t.drawNode(pos, minlevel, 0, 0, 0);
	//t.drawNode(pos, minlevel, 1, 2, 2);
	//t.drawNode(pos, minlevel, 0, 0, 8);
if(1){
	var torender = {}; //array of minlevel, actual level, x, y (referred to minlevel)
	var brothers = {};
	var box = needed.box[minlevel];
	//console.log(needed);
	//console.log("minlevel: "+minlevel);
	for(var y = box[1]; y < box[3]; y++) {
		for(var x = box[0]; x < box[2]; x++) {
			var level = minlevel;
			while(level < t.nlevels) {
				var d = level -minlevel;
				var index = t.index(level, x>>d, y>>d);
				if(t.nodes[index].missing == 0) {
					torender[index] = [level, x>>d, y>>d];
					break;
				} else {
					var sx = (x>>(d+1))<<1;
					var sy = (y>>(d+1))<<1;
					brothers[t.index(level, sx, sy)] = 1;
					brothers[t.index(level, sx+1, sy)] = 1;
					brothers[t.index(level, sx+1, sy+1)] = 1;
					brothers[t.index(level, sx, sy+1)] = 1;
				}
				level++;
			}
		}
	}
//console.log(torender);
	for(var index in torender) {
		var id = torender[index];
		//console.log("level: "+ id[0] +" x: "+ id[1]+" y: "+ id[1]);
		//console.log(torender);
		if(t.opacity != 1.0 && brothers[index]) continue;

		var level = id[0];
		var x = id[1];
		var y = id[2];
		//if(x==0 && y==2){
		  t.drawNode(pos, minlevel, level, x, y);
	   // }
	}
}

	//gl.disable(gl.SCISSOR_TEST);
	//gl.disable(gl.BLEND);
}

redraw(){
} //placeholder for other to replace the draw code.

prefetch(){
	var t = this;
	if(t.waiting || !t.visible)
		return;
	var needed = t.neededBox(t.pos, t.border);
	var minlevel = needed.level;

	//TODO check level also (unlikely, but let's be exact)
	var box = needed.box[minlevel];
	if(t.previouslevel == minlevel && box[0] == t.previousbox[0] && box[1] == t.previousbox[1] &&
		box[2] == t.previousbox[2] && box[3] == t.previousbox[3])
		return;

	t.previouslevel = minlevel;
	t.previousbox = box;
	t.queued = [];

	//look for needed nodes and prefetched nodes (on the pos destination
	for(var level = t.nlevels-1; level >= minlevel; level--) {
		var box = needed.box[level];
		var tmp = [];
		for(var y = box[1]; y < box[3]; y++) {
			for(var x = box[0]; x < box[2]; x++) {
				var index = t.index(level, x, y);
				if(t.nodes[index].missing != 0 && !t.requested[index])
					tmp.push({level:level, x:x, y:y});
			}
		}
		var cx = (box[0] + box[2]-1)/2;
		var cy = (box[1] + box[3]-1)/2;
		tmp.sort(function(a, b) { return Math.abs(a.x - cx) + Math.abs(a.y - cy) - Math.abs(b.x - cx) - Math.abs(b.y - cy); });
		t.queued = t.queued.concat(tmp);
	}
	//sort queued by level and distance from center
	t.preload();
}

preload() {
	while(this.requestedCount < this.maxRequested && this.queued.length > 0) {
		var tile = this.queued.shift();
		this.loadTile(tile.level, tile.x, tile.y);
	}
}

neededBox(pos, border, canvas) {
	var t = this;
	if(t.layout == "image") {
		return { level:0, box: [[0, 0, 1, 1]] };
	}
	var w = this.canvas.width;
	var h = this.canvas.height;

	var minlevel = 0;

	//size of a rendering pixel in original image pixels.
	var scale = -Math.tan(15/180*Math.PI)*this.object.position[2]/this.object.vertices[1]*this.height/this.canvas.height;
	if(scale>2) {minlevel = 1;}
	if(scale>4) {minlevel = 2;}
	if(scale>8) {minlevel = 3;}
	if(scale>16) {minlevel = 4;}
	if(scale>32) {minlevel = 5;}
	if(scale>64) {minlevel = 6;}
	var box = [];
	var bbox = t.getIBox(pos);
	for(var level = t.nlevels-1; level >= minlevel; level--) {
		var side = t.tilesize*Math.pow(2, level);
		//quantized bbox
		var qbox = [
			Math.floor((bbox[0])/side),
			Math.floor((bbox[1])/side),
			Math.floor((bbox[2]-1)/side) + 1,
			Math.floor((bbox[3]-1)/side) + 1];
	border=0;
		//clamp!
		qbox[0] = Math.max(qbox[0]-border, t.qbox[level][0]);
		qbox[1] = Math.max(qbox[1]-border, t.qbox[level][1]);
		qbox[2] = Math.min(qbox[2]+border, t.qbox[level][2]);
		qbox[3] = Math.min(qbox[3]+border, t.qbox[level][3]);
		box[level] = qbox;
	}
	return { level:minlevel, box: box };
}

  
}
