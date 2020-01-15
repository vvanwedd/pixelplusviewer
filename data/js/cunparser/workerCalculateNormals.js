
var zerotol = 1.0e-5;

function isZero(x){

	var limit = 1e-9;
	return x > -limit && x < limit;
}

function solveQuadric(c, s, n){

	var p = c[1] / (2 * c[2]);
	var q = c[0] / c[2];

	var D = p * p - q;

	if (isZero(D))
	{
		s[0 + n] = -p;
		return 1;
	} 
	else if (D < 0)
	{
		return 0;
	} 
	else if (D > 0)
	{
        var sqrt_D = Math.sqrt(D);
		s[0 + n] = sqrt_D - p;
		s[1 + n] = -sqrt_D - p;
		return 2;
	}
	return -1;
}

function solveCubic(c, s)
{
	var i, num;
    var sub;
    var A, B, C;
    var sq_A, p, q;
    var cb_p, D;

	/* normal form: x^3 + Ax^2 + Bx + C = 0 */
	A = c[2] / c[3];
	B = c[1] / c[3];
	C = c[0] / c[3];

	/* substitute x = y - A/3 to eliminate quadric term: x^3 +px + q = 0 */
	sq_A = A * A;
	p = 1.0 / 3 * (-1.0 / 3 * sq_A + B);
	q = 1.0 / 2 * (2.0 / 27 * A * sq_A - 1.0 / 3 * A * B + C);

	/* use Cardano's formula */
	cb_p = p * p * p;
	D = q * q + cb_p;

	if (isZero(D))
	{
		if (isZero(q)) /* one triple solution */
		{
			s[0] = 0;
			num = 1;
		}
        else /* one single and one float solution */
		{
            var u = Math.cbrt(-q);
			s[0] = 2 * u;
			s[1] = -u;
			num = 2;
		}
	} 
	else if (D < 0) /* Casus irreducibilis: three real solutions */
	{
    	var phi = 1.0 / 3 * Math.acos(-q / Math.sqrt(-cb_p));
        var t = 2 * Math.sqrt(-p);

		s[0] = t * Math.cos(phi);
		s[1] = -t * Math.cos(phi + Math.PI / 3);
		s[2] = -t * Math.cos(phi - Math.PI / 3);
		num = 3;
	} 
	else /* one real solution */
	{
        var sqrt_D = Math.sqrt(D);
        var u = Math.cbrt(sqrt_D - q);
    	var v = - Math.cbrt(sqrt_D + q);

		s[0] = u + v;
		num = 1;
	}

	/* resubstitute */
	sub = 1.0 / 3 * A;
	for (i = 0; i < num; i++){
		s[i] -= sub;
	}
	return num;
}

function solveQuartic(c, s)
{
    var coeffs = new Array(4);
    var z, u, v, sub;
    var A, B, C, D;
    var sq_A, p, q, r;
	var i, num;

	/* normal form: x^4 + Ax^3 + Bx^2 + Cx + D = 0 */
	A = c[3] / c[4];
	B = c[2] / c[4];
	C = c[1] / c[4];
	D = c[0] / c[4];

	/* substitute x = y - A/4 to eliminate cubic term: x^4 + px^2 + qx + r = 0 */
	sq_A = A * A;
	p = -3.0 / 8 * sq_A + B;
	q = 1.0 / 8 * sq_A * A - 1.0 / 2 * A * B + C;
	r = -3.0 / 256 * sq_A * sq_A + 1.0 / 16 * sq_A * B - 1.0 / 4 * A * C + D;

	if (isZero(r)) {
		/* no absolute term: y(y^3 + py + q) = 0 */
		coeffs[0] = q;
		coeffs[1] = p;
		coeffs[2] = 0;
		coeffs[3] = 1;

		num = solveCubic(coeffs, s);

		s[num++] = 0;
	}
	else
	{
		/* solve the resolvent cubic ... */
		coeffs[0] = 1.0 / 2 * r * p - 1.0 / 8 * q * q;
		coeffs[1] = -r;
		coeffs[2] = -1.0 / 2 * p;
		coeffs[3] = 1;
		solveCubic(coeffs, s);

		/* ... and take the one real solution ... */
		z = s[0];

		/* ... to build two quadric equations */
		u = z * z - r;
		v = 2 * z - p;
		if (isZero(u))
			u = 0;
		else if (u > 0)
			u = Math.sqrt(u);
		else
			return 0;
		if (isZero(v))
			v = 0;
		else if (v > 0)
			v = Math.sqrt(v);
		else
			return 0;

		coeffs[0] = z - u;
		coeffs[1] = q < 0 ? -v : v;
		coeffs[2] = 1;
		num = solveQuadric(coeffs, s, 0);
		coeffs[0] = z + u;
		coeffs[1] = q < 0 ? v : -v;
		coeffs[2] = 1;
		num += solveQuadric(coeffs, s, num);
	}

	/* resubstitute */
	sub = 1.0 / 4 * A;
	for (i = 0; i < num; i++){
		s[i] -= sub;
	}
	return num;
}


function computeMaximumOnCircle( a, passByRefObj)
{
	var db0, db1, db2, db3, db4;
	var zeros = new Array(4);
	var u, v, maxval, maxu = -1, maxv = -1, inc, arg, polyval;
	var index, nroots;

	index = -1;
	nroots = -1;

	db0 = a[2] - a[3];
	db1 = 4 * a[1] - 2 * a[4] - 4 * a[0];
	db2 = -6 * a[2];
	db3 = -4 * a[1] - 2 * a[4] + 4 * a[0];
	db4 = a[2] + a[3];

	/* polynomial is constant on circle, pick (0,1) as a solution */
	if (Math.abs(db0) < zerotol && Math.abs(db1) < zerotol && 
			Math.abs(db2) < zerotol && Math.abs(db3) < zerotol)
	{
		passByRefObj.lx = 0.0;
		passByRefObj.ly = 1.0;
		return 1;
	}

	if (db0 != 0)
	{
        var c = [db4, db3, db2, db1, db0];
		nroots = solveQuartic(c, zeros);
	} 
	else if (db1 != 0)
	{
		var c = [db4, db3, db2, db1];
		nroots = solveCubic(c, zeros);
	}
	else 
	{
 		var c = [db4, db3, db2 ];
		nroots = solveQuadric(c, zeros, 0);
	}
			

	if (nroots <= 0)
		return -1;
	
	switch (nroots) {
		case 1:
			index = 0;
			break;
		default:
                       var vals = new Array(nroots);
			index = 0;
			for (var i = 0; i < nroots; i++) 
			{
				u = 2 * zeros[i] / (1 + zeros[i] * zeros[i]);
				v = (1 - zeros[i] * zeros[i]) / (1 + zeros[i] * zeros[i]);
				vals[i] = a[0] * u * u + a[1] * v * v + a[2] * u * v + a[3] * u + a[4] * v + a[5];
				if (vals[i] > vals[index])
					index = i;
			}
	}

	/*
	 * I noticed that the fact that the pont (0,-1) on the circle can only
	 * be attained in the limit causes it to be missed in case it really is
	 * the maximum. Hence it is necessary to investigate a neighboring
	 * region to find the potential maximum there, we look at the segment
	 * from 260 degress to 280 degrees (270 degrees being the limit point).
	 */

	passByRefObj.lx = 2 * zeros[index] / (1 + zeros[index] * zeros[index]);
	passByRefObj.ly = (1 - zeros[index] * zeros[index])/ (1 + zeros[index] * zeros[index]);

	/*
	 * test the correctness of solution:
	 */

	maxval = -1000;

	for (var k = 0; k <= 20; k++)
	{
		inc = (1 / 9.0) / 20 * k;
		arg =Math.PI * (26.0 / 18.0 + inc);
		u = Math.cos(arg);
		v = Math.sin(arg);
		polyval = a[0] * u * u + a[1] * v * v + a[2] * u * v + a[3] * u	+ a[4] * v + a[5];
		if (maxval < polyval) {
			maxval = polyval;
			maxu = u;
			maxv = v;
		}
	}

	u = 2 * zeros[index] / (1 + zeros[index] * zeros[index]);
	v = (1 - zeros[index] * zeros[index]) / (1 + zeros[index] * zeros[index]);
        var val1 = a[0] * u * u + a[1] * v * v + a[2] * u * v + a[3] * u + a[4] * v + a[5];
	if (maxval > val1) {
		passByRefObj.lx = maxu;
		passByRefObj.ly = maxv;
	}
	return 1;
}

self.onmessage = function(event){
	var normalsBuf;
	if( event.data.coef0){
		var coef0  = event.data.coef0;
		var coef1  = event.data.coef1;
		var coef2  = event.data.coef2;
		var coef3  = event.data.coef3;
		var width = event.data.width;
		var height = event.data.height;
		normalsBuf = new Float32Array(width*height*3);
		//ptmCoeffs1 = new Float32Array(width*height*3);
		//ptmRgbCoeffs = new Float32Array(width*height*3);
		//var basisTerm = event.data.basisTerm;
		//var dataView = new DataView(arrayBuffer);
		//bytePointer = event.data.startPtr;
		//int CuneiformSingleSidePhotometricData::loadDataLrgbPtm(FILE* file, int width, int height, int basisTerm, bool urti, bool jpegCompressed=false)

		calculateHshNormals(coef0,coef1,coef2,coef3,width,height,normalsBuf);
	}
	else if( event.data.ptmCoeffs0){
		var ptmCoeffs0 = event.data.ptmCoeffs0;
		var ptmCoeffs1 = event.data.ptmCoeffs1;
		var width = event.data.width;
		var height = event.data.height;
		normalsBuf = new Float32Array(width*height*3);
		calculateNormalsPtm(true, 75, 0, height,width, ptmCoeffs0, ptmCoeffs1, normalsBuf);

	}
			//textureData.push(sideData);
	self.postMessage({normalsBuf:normalsBuf,},[normalsBuf.buffer]);

	close();


}
function getHSH( theta,  phi, hweights, order)
{
	var cosPhi = Math.cos(phi);
	var cosTheta = Math.cos(theta);
	var cosTheta2 = cosTheta * cosTheta;
	hweights[0] = 1/Math.sqrt(2*Math.PI);
	hweights[1] = Math.sqrt(6/Math.PI)      *  (cosPhi*Math.sqrt(cosTheta-cosTheta2));
	hweights[2] = Math.sqrt(3/(2*Math.PI))  *  (-1. + 2.*cosTheta);
	hweights[3] = Math.sqrt(6/Math.PI)      *  (Math.sqrt(cosTheta - cosTheta2)*Math.sin(phi));
	if (order > 2)
	{
		hweights[4] = Math.sqrt(30/Math.PI)     *  (Math.cos(2.*phi)*(-cosTheta + cosTheta2));
		hweights[5] = Math.sqrt(30/Math.PI)     *  (cosPhi*(-1. + 2.*cosTheta)*Math.sqrt(cosTheta - cosTheta2));
		hweights[6] = Math.sqrt(5/(2*Math.PI))  *  (1 - 6.*cosTheta + 6.*cosTheta2);
		hweights[7] = Math.sqrt(30/Math.PI)     *  ((-1 + 2.*cosTheta)*Math.sqrt(cosTheta - cosTheta2)*Math.sin(phi));
		hweights[8] = Math.sqrt(30/Math.PI)     *  ((-cosTheta + cosTheta2)*Math.sin(2.*phi));
	}
	if (order > 3)
	{
		hweights[9]  = 2*Math.sqrt(35/Math.PI)	*	(Math.cos(3.0*phi)*Math.pow((cosTheta - cosTheta2), 1.5));
		hweights[10] = Math.sqrt(210/Math.PI)	*	(Math.cos(2.0*phi)*(-1 + 2*cosTheta)*(-cosTheta + cosTheta2));
		hweights[11] = 2*Math.sqrt(21/Math.PI)  *	(Math.cos(phi)*Math.sqrt(cosTheta - cosTheta2)*(1 - 5*cosTheta + 5*cosTheta2));
		hweights[12] = Math.sqrt(7/(2*Math.PI)) *	(-1 + 12*cosTheta - 30*cosTheta2 + 20*cosTheta2*cosTheta);
		hweights[13] = 2*Math.sqrt(21/Math.PI)  *	(Math.sqrt(cosTheta - cosTheta2)*(1 - 5*cosTheta + 5*cosTheta2)*Math.sin(phi));
		hweights[14] = Math.sqrt(210/Math.PI)  *	(-1 + 2*cosTheta)*(-cosTheta + cosTheta2)*Math.sin(2*phi);
		hweights[15] = 2*Math.sqrt(35/Math.PI)  *	Math.pow((cosTheta - cosTheta2), 1.5)*Math.sin(3*phi);
	}
}

function calculateHshNormals(coef0,coef1,coef2,coef3,width,height,normalsBuf){
	var ordlen = 4;
	var l0 = [Math.sin(Math.PI/4)*Math.cos(Math.PI/6), Math.sin(Math.PI/4)*Math.sin(Math.PI/6), Math.cos(Math.PI/4)];
	var l1 = [Math.sin(Math.PI/4)*Math.cos(5*Math.PI / 6), Math.sin(Math.PI/4)*Math.sin(5*Math.PI / 6), Math.cos(Math.PI/4)];
	var l2 = [Math.sin(Math.PI/4)*Math.cos(3*Math.PI / 2), Math.sin(Math.PI/4)*Math.sin(3*Math.PI/ 2), Math.cos(Math.PI/4)];
	var L = [Math.sin(Math.PI/4)*Math.cos(Math.PI/6), Math.sin(Math.PI/4)*Math.sin(Math.PI/6), Math.cos(Math.PI/4), Math.sin(Math.PI/4)*Math.cos(5*Math.PI / 6), Math.sin(Math.PI/4)*Math.sin(5*Math.PI / 6), Math.cos(Math.PI/4), Math.sin(Math.PI/4)*Math.cos(3*Math.PI / 2), Math.sin(Math.PI/4)*Math.sin(3*Math.PI/ 2), Math.cos(Math.PI/4)];
	var Linverse = [ L[4]*L[8]-L[5]*L[7], L[2]*L[7]-L[1]*L[8], L[1]*L[5]-L[2]*L[4], L[5]*L[6]-L[3]*L[8], L[0]*L[8]-L[2]*L[6], L[2]*L[3]-L[0]*L[5], L[3]*L[7]-L[4]*L[6], L[1]*L[6]*L[0]*L[7], L[0]*L[4]-L[1]*L[3] ];
	var Ldet = 1.0/(L[0]*(L[4]*L[8]-L[5]*L[7])-L[1]*(L[3]*L[8]-L[5]*L[6])+L[2]*	(L[3]*L[7]-L[4]*L[6]));
	for (var i = 0; i<9; i++){Linverse[i] *= Ldet;}

	var hweights0 = new Array(16);
	var hweights1 = new Array(16); 
	var hweights2 = new Array(16);
	getHSH(Math.PI / 4, Math.PI / 6, hweights0, ordlen);
	getHSH(Math.PI / 4, 5*Math.PI / 6, hweights1, ordlen);
	getHSH(Math.PI / 4, 3*Math.PI / 2, hweights2, ordlen);
	for (var y = 0; y < height; y++){
		for(var x = 0; x < width; x++){
			var tmp = [0.0,0.0,0.0];
			var offset = y * width + x;
			tmp[0] = (coef0[offset*3] + coef0[offset*3+1] + coef0[offset*3+2])*hweights0[0] + (coef1[offset*3] + coef1[offset*3+1] + coef1[offset*3+2])*hweights0[1] + (coef2[offset*3] + coef2[offset*3+1] + coef2[offset*3+2])*hweights0[2] + (coef3[offset*3] + coef3[offset*3+1] + coef3[offset*3+2])*hweights0[3];
			tmp[1] = (coef0[offset*3] + coef0[offset*3+1] + coef0[offset*3+2])*hweights1[0] + (coef1[offset*3] + coef1[offset*3+1] + coef1[offset*3+2])*hweights1[1] + (coef2[offset*3] + coef2[offset*3+1] + coef2[offset*3+2])*hweights1[2] + (coef3[offset*3] + coef3[offset*3+1] + coef3[offset*3+2])*hweights1[3];
			tmp[2] = (coef0[offset*3] + coef0[offset*3+1] + coef0[offset*3+2])*hweights2[0] + (coef1[offset*3] + coef1[offset*3+1] + coef1[offset*3+2])*hweights2[1] + (coef2[offset*3] + coef2[offset*3+1] + coef2[offset*3+2])*hweights2[2] + (coef3[offset*3] + coef3[offset*3+1] + coef3[offset*3+2])*hweights2[3];
			tmp[0] /= 3.0; tmp[1] /= 3.0; tmp[2] /= 3.0;
			normalsBuf[offset*3+0] = Linverse[0]*tmp[0]+Linverse[1]*tmp[1]+Linverse[2]*tmp[2];
			normalsBuf[offset*3+1] = Linverse[3]*tmp[0]+Linverse[4]*tmp[1]+Linverse[5]*tmp[2];
			normalsBuf[offset*3+2] = Linverse[6]*tmp[0]+Linverse[7]*tmp[1]+Linverse[8]*tmp[2];

			normalsBuf[offset*3+0]*=0.5; // why?
			normalsBuf[offset*3+1]*=0.5; // why?
			var no = Math.sqrt(normalsBuf[offset*3+0]*normalsBuf[offset*3+0]+normalsBuf[offset*3+1]*normalsBuf[offset*3+1]+normalsBuf[offset*3+2]*normalsBuf[offset*3+2]);
			normalsBuf[offset*3+0] /=no;
			normalsBuf[offset*3+1] /=no;
			normalsBuf[offset*3+2] /=no;

			//console.log(Linverse[0]);
		//console.log(tmp[0]);	
		}
	}
}

function calculateNormalsPtm(isLRGB, offset, limit,height, width, ptmCoeffs0,ptmCoeffs1, normalsBuf){
	
	for ( var y = 0; y < height; y++){
		for (var x = 0; x < width; x++){

			var offset = y*width + x;
			var a = new Array(6)
			for ( var k = 0; k < 3; k++){
				a[k] = ptmCoeffs0[offset*3+k] / 255;
				a[k+3] = ptmCoeffs1[offset*3+k] / 255;
			}
			var lx, ly, lz;
			if ( Math.abs( 4 * a[1] * a[0] - a[2]*a[2] ) < zerotol ){
				lx = 0.0;
				ly = 0.0;
			} else {
				if( Math.abs(a[2]) < zerotol ){
					lx = -a[3] / (2.0 * a[0]);
					ly = -a[4] / (2.0 * a[1]);
				}
				else
				{
					lx = (a[2]*a[4] - 2.0*a[1]*a[3])/(4.0*a[0]*a[1] - a[2]*a[2]);
					ly = (a[2]*a[3] - 2.0*a[0]*a[4])/(4.0*a[0]*a[1] - a[2]*a[2]);
				}
			}

			if (Math.abs(a[0]) < zerotol && Math.abs(a[1]) < zerotol && Math.abs(a[2]) < zerotol && Math.abs(a[3]) < zerotol && Math.abs(a[4]) < zerotol)
			{
				lx = 0.0;
				ly = 0.0;
				lz = 1.0;
			}
			else
			{	
            	var length2d = lx * lx + ly * ly;
				var maxfound;
				if (4 * a[0] * a[1] - a[2] * a[2] > zerotol && a[0] < -zerotol)
					maxfound = 1;
				else
					maxfound = 0;
				if (length2d > 1 - zerotol || maxfound == 0) {
					var passByRefObj = {lx:lx, ly:ly };
					//passByRefObj.lx = lx;
					//passByRefObj.ly = ly;
					var stat = computeMaximumOnCircle(a,passByRefObj);
					lx = passByRefObj.lx;
					ly = passByRefObj.ly;

					if (stat == -1) // failed
					{
						length2d = Math.sqrt(length2d);
						if (length2d > zerotol) {
							lx /= length2d;
							ly /= length2d;
						}
					}
				}
             	var disc = 1.0 - lx*lx - ly*ly;
				if (disc < 0.0)
					lz = 0.0;
				else 
					lz = Math.sqrt(disc);
			}
			
    		//var temp = [lx, ly, lz];
			var no = Math.sqrt(lx*lx+ly*ly+lz*lz);
			normalsBuf[offset*3+0] = lx/no;
			normalsBuf[offset*3+1] = ly/no;
			normalsBuf[offset*3+2] = lz/no;		
		}
	}
}



function loadDataLrgbPtm(inputBuffer, width, height, urti, version){
	var w = width;
	var h = height;
	var bias = new Array(6);
	var scale = new Array(6);

	if(!urti){
		var str= '';
		str = readTillNewLine(inputBuffer);
		list = str.split(" ", 6);
		for (i = 0; i<6; i++){
			scale[i] = parseFloat(list[i]);
		}
		str = readTillNewLine(inputBuffer);
		list = str.split(" ", 6);
		for (i = 0; i<6; i++){
			bias[i] = parseFloat(list[i]);
		}
	}

	for (y = h - 1; y >= 0; y--){
		percentLoaded = Math.round(66.66-(y / h) * 66.66);
	//if(y%10==0){
	  self.postMessage(percentLoaded);
	//}
        for (x = 0; x < w; x++){
			var offset = y * w + x;
			for (i = 0; i<3; i++){
				c = new Uint8Array(inputBuffer.buffer,inputBuffer.currentIndex,1);
				inputBuffer.currentIndex += 1;  
				ptmCoeffs0[offset*3+i] = (parseFloat(c)-bias[i])*scale[i];
			}
			for (i = 0; i<3; i++){
				c = new Uint8Array(inputBuffer.buffer,inputBuffer.currentIndex,1);
				inputBuffer.currentIndex += 1;  
				ptmCoeffs1[offset*3+i] = (parseFloat(c)-bias[i+3])*scale[i+3];
			}
			if(version == "PTM_1.1"){
				for (i = 0; i<3; i++){
					c = new Uint8Array(inputBuffer.buffer,inputBuffer.currentIndex,1);
					inputBuffer.currentIndex += 1;  
					ptmRgbCoeffs[offset*3+i] = parseFloat(c);
				}
			} 		
		}
	}

	if (version == "PTM_1.2"){
		for (y = h - 1; y >= 0; y--){
			percentLoaded = Math.round(100.0-(y / h) * 33.33);
			//if(y%10==0){
			  self.postMessage(percentLoaded);
			//}
			for (x = 0; x < w; x++){
				var offset = y * w + x;
				for (i = 0; i<3; i++){
					c = new Uint8Array(inputBuffer.buffer,inputBuffer.currentIndex,1);
					inputBuffer.currentIndex += 1;  
					//console.log(c + ' ' + parseFloat(c));
					ptmRgbCoeffs[offset*3+i] = parseFloat(c);
				}
			}
		}
	}

}

function loadDataHSH(inputBuffer, width, height, basisTerm, urti)
{
	var w  = width;
	var h = height;
	
	var ordlen = basisTerm;
	var bands = 3;
	var gmin = new Float32Array(9);
	var gmax = new Float32Array(9);

	var tmp0 = new Float32Array(inputBuffer.buffer,inputBuffer.currentIndex,basisTerm); 
	inputBuffer.currentIndex += Float32Array.BYTES_PER_ELEMENT * basisTerm;
	var tmp1 = new Float32Array(inputBuffer.buffer,inputBuffer.currentIndex,basisTerm); 
	inputBuffer.currentIndex += Float32Array.BYTES_PER_ELEMENT * basisTerm;

	for(var i = 0; i < basisTerm; i++)
	{gmin[i] = tmp0[i];}
	for(var i = 0; i < basisTerm; i++)
	{gmax[i] = tmp1[i];}

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

function readTillNewLine (inputBuffer) {
	let str = ''
	while (true) {
			if (inputBuffer.currentIndex >= inputBuffer.buffer.length)
					throw new Error('Reached end of file before newline')
			let next = String.fromCharCode.apply(null, new Uint8Array(inputBuffer.buffer,inputBuffer.currentIndex,1));
			inputBuffer.currentIndex += 1; 
			//(inputBuffer[currentIndex++])
			
			if (next !== '\n')
					str += next
			else
					break
	}
	return str
}