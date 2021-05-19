function ObjectPlane(name,xres,yres,xScale,ratio,xOffset,yOffset,height,width){
	this.id = name;
	this.diffuse = [1.0,1,1.0,1.0];
	this.wireframe = false;
	this.type = "sidePlane";
	this.xOff = xOffset;
	this.yOff = yOffset;
	this.zRotation=0;
	this.scaleFactor = xScale;
	this.pixHeight = height;
	this.pixWidth = width;
	this.isMiddle = false;
	this.lightDirection0 = [0.0,0.0,1.0];
	this.lightDirection1 = [0.0,0.0,1.0];
	this.lightIntensity0 = 2.0;
	this.lightIntensity1 = 1.0;
	this.param = [2.0, 0.5, 25, 0, 0];
	var v = [];
	var i = [];
	var uv = [];
	var a,c,b = 0;
	var xwidth = 50*xScale;
if(boolDepthMap){ //boolDepthMap texture plane only needs to be made as a grid when using depth maps
	for(c=0;c<=3*(xres+1)*yres;c=c+3*(xres+1)){
		for(a=0;a<=3*xres;a=a+3){
			v[a+c] = -xwidth+a*2*xwidth/(3*xres); 
			v[a+c+1] =  ratio*xwidth - ((c-3))*(2*xwidth*ratio)/(3*xres*yres);
			v[a+c+2] = 0;	
		}
	}	
	for(c=0; c< 2*3*xres*yres; c=c+2*3*xres){	
		for(a=0;a<2*3*xres;a=a+6,b=b+1){
			i[a+c]   = b;
			i[a+c+1] = b+1.0+xres;
			i[a+c+2] = b+2+xres;
			i[a+c+3] = b;
			i[a+c+4] = b+2+xres;
			i[a+c+5] = b+1;        
		}
		b=b+1;
	}

	for(c=0;c< 2*(xres+1)*(yres+1); c=c+2*(xres+1)){
		for(a=0;a<=2*xres;a=a+2){
			uv[a+c]=a/(2*xres);
			uv[a+1+c]=(c)/(yres*2*(xres+1));
		}
	}
}
else{ 

	v[0]= -xwidth;
	v[1]= ratio*xwidth;
	v[2]= 0;

	v[3]= xwidth;
	v[4]= ratio*xwidth;
	v[5]= 0;
	
	v[6]= -xwidth;
	v[7]= -ratio*xwidth;
	v[8]= 0;

	v[9]= xwidth;
	v[10]= -ratio*xwidth;
	v[11]= 0;

	i[0]= 0
	i[1]= 1
	i[2]= 2;

	i[3]= 1;
	i[4]= 3;
	i[5]= 2;

	uv[0]= 0;
	uv[1]= 0;

	uv[2]= 1;
	uv[3]= 0;
	
	uv[4]= 0;
	uv[5]= 1;
	
	uv[6]= 1;
	uv[7]= 1;
}
	this.vertices = v;
	this.indices = i;
	this.textureCoords = uv;
	// /console.log(this.vertices);
}
//normals and tangents are calculated by utils.js when needed (in scene.js)
