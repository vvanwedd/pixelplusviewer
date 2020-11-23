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

class Entry{}

class SingleFileSCML{
    constructor(url){

	this.url = url;
	this.lastChunkSize = 1024*1024;
	this.entries = [];

}


init(){

	this.loadSingleDataFile();
	//todo: add support for several scml config files
	var scmlEntry = new Entry();
	scmlEntry = this.findEntry('scml2/singleimage.scml');
	this.loadEntry(scmlEntry);
}

getFilesize(url, callback) {
	
    var xhr = new XMLHttpRequest();
    xhr.open("HEAD", url, true); // Notice "HEAD" instead of "GET",
                                 //  to get only the header
    xhr.onreadystatechange = function() {
        if (this.readyState == this.DONE) {
            callback(parseInt(xhr.getResponseHeader("Content-Length")));
        }
    };
    xhr.send();
}

 loadSingleDataFile(){
	//return new Promise(function (resolve, reject) {
    var _this = this;
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

 zipBrowse(dataView){		
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
			index += 46 + entry.filenameLength + entry.extraFieldLength + entry.commentLength;
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

	//_this.fileSize = parseInt(size);
	//	console.log("The new size of " + _this.url + " is : " + _this.fileSize + " bytes.");
	var from = entry.offset + 34 + entry.filenameLength + entry.extraFieldLength; //why 34 instead of 30?
	//console.log(from);
	var to = 	entry.offset + 33 + entry.filenameLength + entry.extraFieldLength + entry.compressedSize;
	const client = new XMLHttpRequest();
    client.open('GET', _this.url, true);
    client.responseType = 'arraybuffer';
	var str = 'bytes=' + String(from) + '-' + String(to);
	var sz = to-from;
	console.log("size: " + String(sz));
	console.log(str);
	var extension = entry.filename.substr(entry.filename.lastIndexOf('.') + 1).toLowerCase();

    client.setRequestHeader('Range', str );
    client.onreadystatechange = function() {
    	if (client.readyState == 4 && client.status === 206) {
			if(extension === 'png'){
				var arrayBufferView = new Uint8Array( this.response );
				//console.log(_this.buf2hex(this.response));
				var blob = new Blob( [ arrayBufferView ], { type: "image/png" } );
				var urlCreator = window.URL || window.webkitURL;
				var imageUrl = urlCreator.createObjectURL( blob );
				var img = new Image();//*/document.querySelector( "#photo" );
				img.src = imageUrl;
			console.log(img);
			} else if(extension === 'scml' || extension === 'json' || extension === 'dzi'){
				//_this.scmlFile = JSON.stringify(Array.from(new Uint8Array(this.response)));
				//console.log(_this.buf2hex(this.response));
				console.log(String.fromCharCode.apply(null, new Uint8Array(this.response)));
				_this.scmlFile = JSON.parse(String.fromCharCode.apply(null, new Uint8Array(this.response)))
				//console.log(_this.scmlFile);
    		}
		}
	}
    client.send(null);
	//});
}

buf2hex(buffer) { // buffer is an ArrayBuffer
	return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}
findEntry(filename){ 
	return this.entries.find(entry => {return entry.filename === filename})
}


  
}