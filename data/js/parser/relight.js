class Relight {

parseJSON(jsonStr){

  this.relightJSON = JSON.parse(jsonStr);

  this.width = parseFloat(this.relightJSON.width);
  this.height = parseFloat(this.relightJSON.height);
  this.format = this.relightJSON.format;
  this.type = this.relightJSON.type;
  this.colorspace = this.relightJSON.colorspace;
  this.sigma = parseFloat(this.relightJSON.sigma);
  this.lights = this.relightJSON.lights;

  // only for rbf
  this.ndimensions = this.lights.length/3;

  this.nplanes = parseFloat(this.relightJSON.nplanes);
  this.quality = parseFloat(this.relightJSON.quality);
  this.infobasis = this.relightJSON.basis;
  //fix me
  this.materials = {range:0,scale:0,bias:0};
  this.materials.range = this.relightJSON.materials[0].range;
  this.materials.scale = this.relightJSON.materials[0].scale;
  this.materials.bias = this.relightJSON.materials[0].bias;
  this.nmaterials = 1;

  this.pos = { x: 0, y:0, z: 0, a: 0 };

}

rot(dx, dy, a) {
	var a = Math.PI*(a/180);
	var x =  Math.cos(a)*dx + Math.sin(a)*dy;
	var y = -Math.sin(a)*dx + Math.cos(a)*dy;
	return [x, y];
}

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
	var l = t.rot(lpos[0], lpos[1], -t.pos.a);
	l[2] = lpos[2];

	if(t.waiting) return;

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

computeLightWeightsRbf(lpos) {
	var t = this;
	var nm = t.nmaterials;
	var np = t.nplanes;
	var radius = 1/(t.sigma*t.sigma);

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
}
