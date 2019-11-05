var bzip2={};bzip2.array=function(e){var t=0,n=0;var r=[0,1,3,7,15,31,63,127,255];return function(i){var s=0;while(i>0){var o=8-t;if(i>=o){s<<=o;s|=r[o]&e[n++];t=0;i-=o}else{s<<=i;s|=(e[n]&r[i]<<8-i-t)>>8-i-t;t+=i;i=0}}return s}};bzip2.simple=function(e){var t=bzip2.header(e);var n=new Array,r=new Array;do{var i=n.concat(r);n=i;r=bzip2.decompress(e,t)}while(r!=-1);return n};bzip2.header=function(e){if(e(8*3)!=4348520)throw"No magic number found";var t=e(8)-48;if(t<1||t>9)throw"Not a BZIP archive";return t};bzip2.decompress=function(e,t,n){var r=20;var i=258;var s=0;var o=1;var u=50;var a=1e5*t;for(var f="",l=0;l<6;l++)f+=e(8).toString(16);if(f=="177245385090")return-1;if(f!="314159265359")throw"eek not valid bzip data";e(32);if(e(1))throw"unsupported obsolete version";var c=e(24);if(c>a)throw"Initial position larger than buffer size";var h=e(16);var p=new Uint8Array(256),d=0;for(l=0;l<16;l++){if(h&1<<15-l){var v=e(16);for(w=0;w<16;w++){if(v&1<<15-w){p[d++]=16*l+w}}}}var m=e(3);if(m<2||m>6)throw"another error";var g=e(15);if(g==0)throw"meh";var y=[];for(var l=0;l<m;l++)y[l]=l;var b=new Uint8Array(32768);for(var l=0;l<g;l++){for(var w=0;e(1);w++)if(w>=m)throw"whoops another error";var E=y[w];y.splice(w,1);y.splice(0,0,E);b[l]=E}var S=d+2;var x=[];for(var w=0;w<m;w++){var T=new Uint8Array(i),N=new Uint8Array(r+1);h=e(5);for(var l=0;l<S;l++){while(true){if(h<1||h>r)throw"I gave up a while ago on writing error messages";if(!e(1))break;if(!e(1))h++;else h--}T[l]=h}var C,k;C=k=T[0];for(var l=1;l<S;l++){if(T[l]>k)k=T[l];else if(T[l]<C)C=T[l]}var L;L=x[w]={};L.permute=new Uint32Array(i);L.limit=new Uint32Array(r+1);L.base=new Uint32Array(r+1);L.minLen=C;L.maxLen=k;var A=L.base.subarray(1);var O=L.limit.subarray(1);var M=0;for(var l=C;l<=k;l++)for(var h=0;h<S;h++)if(T[h]==l)L.permute[M++]=h;for(l=C;l<=k;l++)N[l]=O[l]=0;for(l=0;l<S;l++)N[T[l]]++;M=h=0;for(l=C;l<k;l++){M+=N[l];O[l]=M-1;M<<=1;A[l+1]=M-(h+=N[l])}O[k]=M+N[k]-1;A[C]=0}var _=new Uint32Array(256);for(var l=0;l<256;l++)y[l]=l;var D,P,S,H;D=P=S=H=0;var B=new Uint32Array(a);while(true){if(!(S--)){S=u-1;if(H>=g)throw"meow i'm a kitty, that's an error";L=x[b[H++]];A=L.base.subarray(1);O=L.limit.subarray(1)}l=L.minLen;w=e(l);while(true){if(l>L.maxLen)throw"rawr i'm a dinosaur";if(w<=O[l])break;l++;w=w<<1|e(1)}w-=A[l];if(w<0||w>=i)throw"moo i'm a cow";var j=L.permute[w];if(j==s||j==o){if(!D){D=1;h=0}if(j==s)h+=D;else h+=2*D;D<<=1;continue}if(D){D=0;if(P+h>=a)throw"Boom.";E=p[y[0]];_[E]+=h;while(h--)B[P++]=E}if(j>d)break;if(P>=a)throw"I can't think of anything. Error";l=j-1;E=y[l];y.splice(l,1);y.splice(0,0,E);E=p[E];_[E]++;B[P++]=E}if(c<0||c>=P)throw"I'm a monkey and I'm throwing something at someone, namely you";var w=0;for(var l=0;l<256;l++){v=w+_[l];_[l]=w;w=v}for(var l=0;l<P;l++){E=B[l]&255;B[_[E]]|=l<<8;_[E]++}var F=0,I=0,q=0;if(P){F=B[c];I=F&255;F>>=8;q=-1}P=P;var R=new Array;var U,z,W;if(!n)n=Infinity;while(P){P--;z=I;F=B[F];I=F&255;F>>=8;if(q++==3){U=I;W=z;I=-1}else{U=1;W=I}while(U--){R.push(W);if(!--n){return R}}if(I!=z)q=0}return R}