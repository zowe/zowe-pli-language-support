import{N as yn}from"./index-C1KQ8Qa9.js";function wn(j,V){for(var R=0;R<V.length;R++){const S=V[R];if(typeof S!=="string"&&!Array.isArray(S)){for(const b in S){if(b!=="default"&&!(b in j)){const h=Object.getOwnPropertyDescriptor(S,b);if(h){Object.defineProperty(j,b,h.get?h:{enumerable:true,get:()=>S[b]})}}}}}return Object.freeze(Object.defineProperty(j,Symbol.toStringTag,{value:"Module"}))}var z={exports:{}};var Sn=z.exports;var X;function An(){if(X)return z.exports;X=1;(function(j,V){!function(R,S){j.exports=S()}(Sn,()=>{return R={770:function(b,h,O){var U=this&&this.__importDefault||function(m){return m&&m.__esModule?m:{default:m}};Object.defineProperty(h,"__esModule",{value:true}),h.setDefaultDebugCall=h.createOnigScanner=h.createOnigString=h.loadWASM=h.OnigScanner=h.OnigString=void 0;const D=U(O(418));let n=null,W=false;class E{static _utf8ByteLength(e){let f=0;for(let c=0,p=e.length;c<p;c++){const s=e.charCodeAt(c);let i=s,o=false;if(s>=55296&&s<=56319&&c+1<p){const a=e.charCodeAt(c+1);a>=56320&&a<=57343&&(i=65536+(s-55296<<10)|a-56320,o=true)}f+=i<=127?1:i<=2047?2:i<=65535?3:4,o&&c++}return f}constructor(e){const f=e.length,c=E._utf8ByteLength(e),p=c!==f,s=p?new Uint32Array(f+1):null;p&&(s[f]=c);const i=p?new Uint32Array(c+1):null;p&&(i[c]=f);const o=new Uint8Array(c);let a=0;for(let u=0;u<f;u++){const A=e.charCodeAt(u);let l=A,v=false;if(A>=55296&&A<=56319&&u+1<f){const x=e.charCodeAt(u+1);x>=56320&&x<=57343&&(l=65536+(A-55296<<10)|x-56320,v=true)}p&&(s[u]=a,v&&(s[u+1]=a),l<=127?i[a+0]=u:l<=2047?(i[a+0]=u,i[a+1]=u):l<=65535?(i[a+0]=u,i[a+1]=u,i[a+2]=u):(i[a+0]=u,i[a+1]=u,i[a+2]=u,i[a+3]=u)),l<=127?o[a++]=l:l<=2047?(o[a++]=192|(1984&l)>>>6,o[a++]=128|(63&l)>>>0):l<=65535?(o[a++]=224|(61440&l)>>>12,o[a++]=128|(4032&l)>>>6,o[a++]=128|(63&l)>>>0):(o[a++]=240|(1835008&l)>>>18,o[a++]=128|(258048&l)>>>12,o[a++]=128|(4032&l)>>>6,o[a++]=128|(63&l)>>>0),v&&u++}this.utf16Length=f,this.utf8Length=c,this.utf16Value=e,this.utf8Value=o,this.utf16OffsetToUtf8=s,this.utf8OffsetToUtf16=i}createString(e){const f=e._omalloc(this.utf8Length);return e.HEAPU8.set(this.utf8Value,f),f}}class _{constructor(e){if(this.id=++_.LAST_ID,!n)throw new Error("Must invoke loadWASM first.");this._onigBinding=n,this.content=e;const f=new E(e);this.utf16Length=f.utf16Length,this.utf8Length=f.utf8Length,this.utf16OffsetToUtf8=f.utf16OffsetToUtf8,this.utf8OffsetToUtf16=f.utf8OffsetToUtf16,this.utf8Length<1e4&&!_._sharedPtrInUse?(_._sharedPtr||(_._sharedPtr=n._omalloc(1e4)),_._sharedPtrInUse=true,n.HEAPU8.set(f.utf8Value,_._sharedPtr),this.ptr=_._sharedPtr):this.ptr=f.createString(n)}convertUtf8OffsetToUtf16(e){return this.utf8OffsetToUtf16?e<0?0:e>this.utf8Length?this.utf16Length:this.utf8OffsetToUtf16[e]:e}convertUtf16OffsetToUtf8(e){return this.utf16OffsetToUtf8?e<0?0:e>this.utf16Length?this.utf8Length:this.utf16OffsetToUtf8[e]:e}dispose(){this.ptr===_._sharedPtr?_._sharedPtrInUse=false:this._onigBinding._ofree(this.ptr)}}h.OnigString=_,_.LAST_ID=0,_._sharedPtr=0,_._sharedPtrInUse=false;class H{constructor(e){if(!n)throw new Error("Must invoke loadWASM first.");const f=[],c=[];for(let o=0,a=e.length;o<a;o++){const u=new E(e[o]);f[o]=u.createString(n),c[o]=u.utf8Length}const p=n._omalloc(4*e.length);n.HEAPU32.set(f,p/4);const s=n._omalloc(4*e.length);n.HEAPU32.set(c,s/4);const i=n._createOnigScanner(p,s,e.length);for(let o=0,a=e.length;o<a;o++)n._ofree(f[o]);n._ofree(s),n._ofree(p),0===i&&function(o){throw new Error(o.UTF8ToString(o._getLastOnigError()))}(n),this._onigBinding=n,this._ptr=i}dispose(){this._onigBinding._freeOnigScanner(this._ptr)}findNextMatchSync(e,f,c){let p=W,s=0;if("number"==typeof c?(8&c&&(p=true),s=c):"boolean"==typeof c&&(p=c),"string"==typeof e){e=new _(e);const i=this._findNextMatchSync(e,f,p,s);return e.dispose(),i}return this._findNextMatchSync(e,f,p,s)}_findNextMatchSync(e,f,c,p){const s=this._onigBinding;let i;if(i=c?s._findNextOnigScannerMatchDbg(this._ptr,e.id,e.ptr,e.utf8Length,e.convertUtf16OffsetToUtf8(f),p):s._findNextOnigScannerMatch(this._ptr,e.id,e.ptr,e.utf8Length,e.convertUtf16OffsetToUtf8(f),p),0===i)return null;const o=s.HEAPU32;let a=i/4;const u=o[a++],A=o[a++];let l=[];for(let v=0;v<A;v++){const x=e.convertUtf8OffsetToUtf16(o[a++]),B=e.convertUtf8OffsetToUtf16(o[a++]);l[v]={start:x,end:B,length:B-x}}return{index:u,captureIndices:l}}}h.OnigScanner=H;let M=false,T=null;h.loadWASM=function(m){if(M)return T;let e,f,c,p;if(M=true,function(s){return"function"==typeof s.instantiator}(m))e=m.instantiator,f=m.print;else{let s;!function(i){return void 0!==i.data}(m)?s=m:(s=m.data,f=m.print),e=function(i){return"undefined"!=typeof Response&&i instanceof Response}(s)?"function"==typeof WebAssembly.instantiateStreaming?function(i){return o=>WebAssembly.instantiateStreaming(i,o)}(s):function(i){return async o=>{const a=await i.arrayBuffer();return WebAssembly.instantiate(a,o)}}(s):function(i){return o=>WebAssembly.instantiate(i,o)}(s)}return T=new Promise((s,i)=>{c=s,p=i}),function(s,i,o,a){(0,D.default)({print:i,instantiateWasm:(u,A)=>{if("undefined"==typeof performance){const l=()=>Date.now();u.env.emscripten_get_now=l,u.wasi_snapshot_preview1.emscripten_get_now=l}return s(u).then(l=>A(l.instance),a),{}}}).then(u=>{n=u,o()})}(e,f,c,p),T},h.createOnigString=function(m){return new _(m)},h.createOnigScanner=function(m){return new H(m)},h.setDefaultDebugCall=function(m){W=m}},418:b=>{var h=("undefined"!=typeof document&&document.currentScript&&document.currentScript.src,function(O){var U,D,n=void 0!==(O=O||{})?O:{};n.ready=new Promise(function(t,r){U=t,D=r});var W,E=Object.assign({},n),_="";function H(t){return n.locateFile?n.locateFile(t,_):_+t}W=function(t){let r;return"function"==typeof readbuffer?new Uint8Array(readbuffer(t)):(r=read(t,"binary"),c("object"==typeof r),r)},"undefined"!=typeof scriptArgs?scriptArgs:void 0!==arguments&&arguments,"undefined"!=typeof onig_print&&("undefined"==typeof console&&(console={}),console.log=onig_print,console.warn=console.error="undefined"!=typeof printErr?printErr:onig_print);var M,T,m=n.print||console.log.bind(console),e=n.printErr||console.warn.bind(console);Object.assign(n,E),E=null,n.arguments&&n.arguments,n.thisProgram&&n.thisProgram,n.quit&&n.quit,n.wasmBinary&&(M=n.wasmBinary),n.noExitRuntime,"object"!=typeof WebAssembly&&F("no native wasm support detected");var f=false;function c(t,r){t||F(r)}var p,s,i,o="undefined"!=typeof TextDecoder?new TextDecoder("utf8"):void 0;function a(t,r,y){for(var P=r+y,g=r;t[g]&&!(g>=P);)++g;if(g-r>16&&t.buffer&&o)return o.decode(t.subarray(r,g));for(var d="";r<g;){var w=t[r++];if(128&w){var C=63&t[r++];if(192!=(224&w)){var N=63&t[r++];if((w=224==(240&w)?(15&w)<<12|C<<6|N:(7&w)<<18|C<<12|N<<6|63&t[r++])<65536)d+=String.fromCharCode(w);else{var Q=w-65536;d+=String.fromCharCode(55296|Q>>10,56320|1023&Q)}}else d+=String.fromCharCode((31&w)<<6|C)}else d+=String.fromCharCode(w)}return d}function u(t,r){return t?a(s,t,r):""}function A(t){p=t,n.HEAP8=new Int8Array(t),n.HEAP16=new Int16Array(t),n.HEAP32=new Int32Array(t),n.HEAPU8=s=new Uint8Array(t),n.HEAPU16=new Uint16Array(t),n.HEAPU32=i=new Uint32Array(t),n.HEAPF32=new Float32Array(t),n.HEAPF64=new Float64Array(t)}n.INITIAL_MEMORY;var l=[],v=[],x=[];function B(){if(n.preRun)for("function"==typeof n.preRun&&(n.preRun=[n.preRun]);n.preRun.length;)en(n.preRun.shift());$(l)}function nn(){$(v)}function tn(){if(n.postRun)for("function"==typeof n.postRun&&(n.postRun=[n.postRun]);n.postRun.length;)on(n.postRun.shift());$(x)}function en(t){l.unshift(t)}function rn(t){v.unshift(t)}function on(t){x.unshift(t)}var L=0,k=null;function an(t){L++,n.monitorRunDependencies&&n.monitorRunDependencies(L)}function sn(t){if(L--,n.monitorRunDependencies&&n.monitorRunDependencies(L),0==L&&k){var r=k;k=null,r()}}function F(t){n.onAbort&&n.onAbort(t),e(t="Aborted("+t+")"),f=true,t+=". Build with -sASSERTIONS for more info.";var r=new WebAssembly.RuntimeError(t);throw D(r),r}var I,Y,fn="data:application/octet-stream;base64,";function G(t){return t.startsWith(fn)}function un(t){try{if(t==I&&M)return new Uint8Array(M);if(W)return W(t);throw"both async and sync fetching of the wasm failed"}catch(r){F(r)}}function cn(){return Promise.resolve().then(function(){return un(I)})}function ln(){var t={env:J,wasi_snapshot_preview1:J};function r(g,d){var w=g.exports;n.asm=w,A((T=n.asm.memory).buffer),n.asm.__indirect_function_table,rn(n.asm.__wasm_call_ctors),sn()}function y(g){r(g.instance)}function P(g){return cn().then(function(d){return WebAssembly.instantiate(d,t)}).then(function(d){return d}).then(g,function(d){e("failed to asynchronously prepare wasm: "+d),F(d)})}if(an(),n.instantiateWasm)try{return n.instantiateWasm(t,r)}catch(g){e("Module.instantiateWasm callback failed with error: "+g),D(g)}return(M||"function"!=typeof WebAssembly.instantiateStreaming||G(I)||"function"!=typeof fetch?P(y):fetch(I,{credentials:"same-origin"}).then(function(g){return WebAssembly.instantiateStreaming(g,t).then(y,function(d){return e("wasm streaming compile failed: "+d),e("falling back to ArrayBuffer instantiation"),P(y)})})).catch(D),{}}function $(t){for(;t.length>0;)t.shift()(n)}function pn(t,r,y){s.copyWithin(t,r,r+y)}function gn(t){try{return T.grow(t-p.byteLength+65535>>>16),A(T.buffer),1}catch(r){}}function hn(t){var r,y=s.length,P=2147483648;if((t>>>=0)>P)return false;for(var g=1;g<=4;g*=2){var d=y*(1+.2/g);if(d=Math.min(d,t+100663296),gn(Math.min(P,(r=Math.max(t,d))+(65536-r%65536)%65536)))return true}return false}G(I="onig.wasm")||(I=H(I)),Y="undefined"!=typeof dateNow?dateNow:()=>performance.now();var dn=[null,[],[]];function mn(t,r){var y=dn[t];0===r||10===r?((1===t?m:e)(a(y,0)),y.length=0):y.push(r)}function _n(t,r,y,P){for(var g=0,d=0;d<y;d++){var w=i[r>>2],C=i[r+4>>2];r+=8;for(var N=0;N<C;N++)mn(t,s[w+N]);g+=C}return i[P>>2]=g,0}var q,J={emscripten_get_now:Y,emscripten_memcpy_big:pn,emscripten_resize_heap:hn,fd_write:_n};function K(t){function r(){q||(q=true,n.calledRun=true,f||(nn(),U(n),n.onRuntimeInitialized&&n.onRuntimeInitialized(),tn()))}L>0||(B(),L>0||(n.setStatus?(n.setStatus("Running..."),setTimeout(function(){setTimeout(function(){n.setStatus("")},1),r()},1)):r()))}if(ln(),n.___wasm_call_ctors=function(){return(n.___wasm_call_ctors=n.asm.__wasm_call_ctors).apply(null,arguments)},n.___errno_location=function(){return(n.___errno_location=n.asm.__errno_location).apply(null,arguments)},n._omalloc=function(){return(n._omalloc=n.asm.omalloc).apply(null,arguments)},n._ofree=function(){return(n._ofree=n.asm.ofree).apply(null,arguments)},n._getLastOnigError=function(){return(n._getLastOnigError=n.asm.getLastOnigError).apply(null,arguments)},n._createOnigScanner=function(){return(n._createOnigScanner=n.asm.createOnigScanner).apply(null,arguments)},n._freeOnigScanner=function(){return(n._freeOnigScanner=n.asm.freeOnigScanner).apply(null,arguments)},n._findNextOnigScannerMatch=function(){return(n._findNextOnigScannerMatch=n.asm.findNextOnigScannerMatch).apply(null,arguments)},n._findNextOnigScannerMatchDbg=function(){return(n._findNextOnigScannerMatchDbg=n.asm.findNextOnigScannerMatchDbg).apply(null,arguments)},n.stackSave=function(){return(n.stackSave=n.asm.stackSave).apply(null,arguments)},n.stackRestore=function(){return(n.stackRestore=n.asm.stackRestore).apply(null,arguments)},n.stackAlloc=function(){return(n.stackAlloc=n.asm.stackAlloc).apply(null,arguments)},n.dynCall_jiji=function(){return(n.dynCall_jiji=n.asm.dynCall_jiji).apply(null,arguments)},n.UTF8ToString=u,k=function t(){q||K(),q||(k=t)},n.preInit)for("function"==typeof n.preInit&&(n.preInit=[n.preInit]);n.preInit.length>0;)n.preInit.pop()();return K(),O.ready});b.exports=h}},S={},function b(h){var O=S[h];if(void 0!==O)return O.exports;var U=S[h]={exports:{}};return R[h].call(U.exports,U,U.exports,b),U.exports}(770);var R,S})})(z);return z.exports}var Z=An();const bn=yn(Z);const On=wn({__proto__:null,default:bn},[Z]);export{On as m};
