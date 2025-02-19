var oR=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);var BP=oR((St,Nt)=>{function Ze(t){return typeof t==="object"&&t!==null&&typeof t.$type==="string"}function tn(t){return typeof t==="object"&&t!==null&&typeof t.$refText==="string"}function dg(t){return typeof t==="object"&&t!==null&&typeof t.name==="string"&&typeof t.type==="string"&&typeof t.path==="string"}function Ll(t){return typeof t==="object"&&t!==null&&Ze(t.container)&&tn(t.reference)&&typeof t.message==="string"}class fg{constructor(){this.subtypes={};this.allSubtypes={}}isInstance(e,n){return Ze(e)&&this.isSubtype(e.$type,n)}isSubtype(e,n){if(e===n){return true}let r=this.subtypes[e];if(!r){r=this.subtypes[e]={}}const i=r[n];if(i!==void 0){return i}else{const s=this.computeIsSubtype(e,n);r[n]=s;return s}}getAllSubTypes(e){const n=this.allSubtypes[e];if(n){return n}else{const r=this.getAllTypes();const i=[];for(const s of r){if(this.isSubtype(s,e)){i.push(s)}}this.allSubtypes[e]=i;return i}}}function hr(t){return typeof t==="object"&&t!==null&&Array.isArray(t.content)}function qs(t){return typeof t==="object"&&t!==null&&typeof t.tokenType==="object"}function pg(t){return hr(t)&&typeof t.fullText==="string"}class Je{constructor(e,n){this.startFn=e;this.nextFn=n}iterator(){const e={state:this.startFn(),next:()=>this.nextFn(e.state),[Symbol.iterator]:()=>e};return e}[Symbol.iterator](){return this.iterator()}isEmpty(){const e=this.iterator();return Boolean(e.next().done)}count(){const e=this.iterator();let n=0;let r=e.next();while(!r.done){n++;r=e.next()}return n}toArray(){const e=[];const n=this.iterator();let r;do{r=n.next();if(r.value!==void 0){e.push(r.value)}}while(!r.done);return e}toSet(){return new Set(this)}toMap(e,n){const r=this.map(i=>[e?e(i):i,n?n(i):i]);return new Map(r)}toString(){return this.join()}concat(e){return new Je(()=>({first:this.startFn(),firstDone:false,iterator:e[Symbol.iterator]()}),n=>{let r;if(!n.firstDone){do{r=this.nextFn(n.first);if(!r.done){return r}}while(!r.done);n.firstDone=true}do{r=n.iterator.next();if(!r.done){return r}}while(!r.done);return Mt})}join(e=","){const n=this.iterator();let r="";let i;let s=false;do{i=n.next();if(!i.done){if(s){r+=e}r+=lR(i.value)}s=true}while(!i.done);return r}indexOf(e,n=0){const r=this.iterator();let i=0;let s=r.next();while(!s.done){if(i>=n&&s.value===e){return i}s=r.next();i++}return-1}every(e){const n=this.iterator();let r=n.next();while(!r.done){if(!e(r.value)){return false}r=n.next()}return true}some(e){const n=this.iterator();let r=n.next();while(!r.done){if(e(r.value)){return true}r=n.next()}return false}forEach(e){const n=this.iterator();let r=0;let i=n.next();while(!i.done){e(i.value,r);i=n.next();r++}}map(e){return new Je(this.startFn,n=>{const{done:r,value:i}=this.nextFn(n);if(r){return Mt}else{return{done:false,value:e(i)}}})}filter(e){return new Je(this.startFn,n=>{let r;do{r=this.nextFn(n);if(!r.done&&e(r.value)){return r}}while(!r.done);return Mt})}nonNullable(){return this.filter(e=>e!==void 0&&e!==null)}reduce(e,n){const r=this.iterator();let i=n;let s=r.next();while(!s.done){if(i===void 0){i=s.value}else{i=e(i,s.value)}s=r.next()}return i}reduceRight(e,n){return this.recursiveReduce(this.iterator(),e,n)}recursiveReduce(e,n,r){const i=e.next();if(i.done){return r}const s=this.recursiveReduce(e,n,r);if(s===void 0){return i.value}return n(s,i.value)}find(e){const n=this.iterator();let r=n.next();while(!r.done){if(e(r.value)){return r.value}r=n.next()}return void 0}findIndex(e){const n=this.iterator();let r=0;let i=n.next();while(!i.done){if(e(i.value)){return r}i=n.next();r++}return-1}includes(e){const n=this.iterator();let r=n.next();while(!r.done){if(r.value===e){return true}r=n.next()}return false}flatMap(e){return new Je(()=>({this:this.startFn()}),n=>{do{if(n.iterator){const s=n.iterator.next();if(s.done){n.iterator=void 0}else{return s}}const{done:r,value:i}=this.nextFn(n.this);if(!r){const s=e(i);if(eu(s)){n.iterator=s[Symbol.iterator]()}else{return{done:false,value:s}}}}while(n.iterator);return Mt})}flat(e){if(e===void 0){e=1}if(e<=0){return this}const n=e>1?this.flat(e-1):this;return new Je(()=>({this:n.startFn()}),r=>{do{if(r.iterator){const a=r.iterator.next();if(a.done){r.iterator=void 0}else{return a}}const{done:i,value:s}=n.nextFn(r.this);if(!i){if(eu(s)){r.iterator=s[Symbol.iterator]()}else{return{done:false,value:s}}}}while(r.iterator);return Mt})}head(){const e=this.iterator();const n=e.next();if(n.done){return void 0}return n.value}tail(e=1){return new Je(()=>{const n=this.startFn();for(let r=0;r<e;r++){const i=this.nextFn(n);if(i.done){return n}}return n},this.nextFn)}limit(e){return new Je(()=>({size:0,state:this.startFn()}),n=>{n.size++;if(n.size>e){return Mt}return this.nextFn(n.state)})}distinct(e){return new Je(()=>({set:new Set,internalState:this.startFn()}),n=>{let r;do{r=this.nextFn(n.internalState);if(!r.done){const i=e?e(r.value):r.value;if(!n.set.has(i)){n.set.add(i);return r}}}while(!r.done);return Mt})}exclude(e,n){const r=new Set;for(const i of e){const s=n?n(i):i;r.add(s)}return this.filter(i=>{const s=n?n(i):i;return!r.has(s)})}}function lR(t){if(typeof t==="string"){return t}if(typeof t==="undefined"){return"undefined"}if(typeof t.toString==="function"){return t.toString()}return Object.prototype.toString.call(t)}function eu(t){return!!t&&typeof t[Symbol.iterator]==="function"}const mg=new Je(()=>void 0,()=>Mt);const Mt=Object.freeze({done:true,value:void 0});function Ae(...t){if(t.length===1){const e=t[0];if(e instanceof Je){return e}if(eu(e)){return new Je(()=>e[Symbol.iterator](),n=>n.next())}if(typeof e.length==="number"){return new Je(()=>({index:0}),n=>{if(n.index<e.length){return{done:false,value:e[n.index++]}}else{return Mt}})}}if(t.length>1){return new Je(()=>({collIndex:0,arrIndex:0}),e=>{do{if(e.iterator){const n=e.iterator.next();if(!n.done){return n}e.iterator=void 0}if(e.array){if(e.arrIndex<e.array.length){return{done:false,value:e.array[e.arrIndex++]}}e.array=void 0;e.arrIndex=0}if(e.collIndex<t.length){const n=t[e.collIndex++];if(eu(n)){e.iterator=n[Symbol.iterator]()}else if(n&&typeof n.length==="number"){e.array=n}}}while(e.iterator||e.array||e.collIndex<t.length);return Mt})}return mg}class tu extends Je{constructor(e,n,r){super(()=>({iterators:(r===null||r===void 0?void 0:r.includeRoot)?[[e][Symbol.iterator]()]:[n(e)[Symbol.iterator]()],pruned:false}),i=>{if(i.pruned){i.iterators.pop();i.pruned=false}while(i.iterators.length>0){const s=i.iterators[i.iterators.length-1];const a=s.next();if(a.done){i.iterators.pop()}else{i.iterators.push(n(a.value)[Symbol.iterator]());return a}}return Mt})}iterator(){const e={state:this.startFn(),next:()=>this.nextFn(e.state),prune:()=>{e.state.pruned=true},[Symbol.iterator]:()=>e};return e}}var Sd;(function(t){function e(s){return s.reduce((a,o)=>a+o,0)}t.sum=e;function n(s){return s.reduce((a,o)=>a*o,0)}t.product=n;function r(s){return s.reduce((a,o)=>Math.min(a,o))}t.min=r;function i(s){return s.reduce((a,o)=>Math.max(a,o))}t.max=i})(Sd||(Sd={}));function nu(t){return new tu(t,e=>{if(hr(e)){return e.content}else{return[]}},{includeRoot:true})}function uR(t){return nu(t).filter(qs)}function cR(t,e){while(t.container){t=t.container;if(t===e){return true}}return false}function Nd(t){return{start:{character:t.startColumn-1,line:t.startLine-1},end:{character:t.endColumn,line:t.endLine-1}}}function ru(t){if(!t){return void 0}const{offset:e,end:n,range:r}=t;return{range:r,offset:e,end:n,length:n-e}}var Cn;(function(t){t[t["Before"]=0]="Before";t[t["After"]=1]="After";t[t["OverlapFront"]=2]="OverlapFront";t[t["OverlapBack"]=3]="OverlapBack";t[t["Inside"]=4]="Inside";t[t["Outside"]=5]="Outside"})(Cn||(Cn={}));function dR(t,e){if(t.end.line<e.start.line||t.end.line===e.start.line&&t.end.character<=e.start.character){return Cn.Before}else if(t.start.line>e.end.line||t.start.line===e.end.line&&t.start.character>=e.end.character){return Cn.After}const n=t.start.line>e.start.line||t.start.line===e.start.line&&t.start.character>=e.start.character;const r=t.end.line<e.end.line||t.end.line===e.end.line&&t.end.character<=e.end.character;if(n&&r){return Cn.Inside}else if(n){return Cn.OverlapBack}else if(r){return Cn.OverlapFront}else{return Cn.Outside}}function hg(t,e){const n=dR(t,e);return n>Cn.After}const yg=/^[\w\p{L}]$/u;function yr(t,e,n=yg){if(t){if(e>0){const r=e-t.offset;const i=t.text.charAt(r);if(!n.test(i)){e--}}return gg(t,e)}return void 0}function fR(t,e){if(t){const n=pR(t,true);if(n&&zp(n,e)){return n}if(pg(t)){const r=t.content.findIndex(i=>!i.hidden);for(let i=r-1;i>=0;i--){const s=t.content[i];if(zp(s,e)){return s}}}}return void 0}function zp(t,e){return qs(t)&&e.includes(t.tokenType.name)}function gg(t,e){if(qs(t)){return t}else if(hr(t)){const n=Ig(t,e,false);if(n){return gg(n,e)}}return void 0}function kd(t,e){if(qs(t)){return t}else if(hr(t)){const n=Ig(t,e,true);if(n){return kd(n,e)}}return void 0}function Ig(t,e,n){let r=0;let i=t.content.length-1;let s=void 0;while(r<=i){const a=Math.floor((r+i)/2);const o=t.content[a];if(o.offset<=e&&o.end>e){return o}if(o.end<=e){s=n?o:void 0;r=a+1}else{i=a-1}}return s}function pR(t,e=true){while(t.container){const n=t.container;let r=n.content.indexOf(t);while(r>0){r--;const i=n.content[r];if(e||!i.hidden){return i}}t=n}return void 0}class vg extends Error{constructor(e,n){super(e?`${n} at ${e.range.start.line}:${e.range.start.character}`:n)}}function js(t){throw new Error("Error! The input value was not handled.")}const Ea="AbstractRule";const $a="AbstractType";const sc="Condition";const Xp="TypeDefinition";const ac="ValueLiteral";const xi="AbstractElement";function Rg(t){return ue.isInstance(t,xi)}const Ta="ArrayLiteral";const Ca="ArrayType";const Fi="BooleanLiteral";function mR(t){return ue.isInstance(t,Fi)}const Ki="Conjunction";function hR(t){return ue.isInstance(t,Ki)}const Ui="Disjunction";function yR(t){return ue.isInstance(t,Ui)}const wa="Grammar";const oc="GrammarImport";const Wi="InferredType";function Eg(t){return ue.isInstance(t,Wi)}const Gi="Interface";function $g(t){return ue.isInstance(t,Gi)}const lc="NamedArgument";const Hi="Negation";function gR(t){return ue.isInstance(t,Hi)}const ba="NumberLiteral";const Aa="Parameter";const qi="ParameterReference";function IR(t){return ue.isInstance(t,qi)}const ji="ParserRule";function it(t){return ue.isInstance(t,ji)}const Ma="ReferenceType";const xl="ReturnType";function vR(t){return ue.isInstance(t,xl)}const Vi="SimpleType";function RR(t){return ue.isInstance(t,Vi)}const Sa="StringLiteral";const Or="TerminalRule";function Yn(t){return ue.isInstance(t,Or)}const zi="Type";function Tg(t){return ue.isInstance(t,zi)}const uc="TypeAttribute";const Na="UnionType";const Xi="Action";function Vs(t){return ue.isInstance(t,Xi)}const Yi="Alternatives";function rp(t){return ue.isInstance(t,Yi)}const Ji="Assignment";function sn(t){return ue.isInstance(t,Ji)}const Qi="CharacterRange";function ER(t){return ue.isInstance(t,Qi)}const Zi="CrossReference";function zs(t){return ue.isInstance(t,Zi)}const es="EndOfFile";function $R(t){return ue.isInstance(t,es)}const ts="Group";function gr(t){return ue.isInstance(t,ts)}const ns="Keyword";function an(t){return ue.isInstance(t,ns)}const rs="NegatedToken";function TR(t){return ue.isInstance(t,rs)}const is="RegexToken";function CR(t){return ue.isInstance(t,is)}const ss="RuleCall";function Pn(t){return ue.isInstance(t,ss)}const as="TerminalAlternatives";function wR(t){return ue.isInstance(t,as)}const os="TerminalGroup";function bR(t){return ue.isInstance(t,os)}const ls="TerminalRuleCall";function AR(t){return ue.isInstance(t,ls)}const us="UnorderedGroup";function ip(t){return ue.isInstance(t,us)}const cs="UntilToken";function MR(t){return ue.isInstance(t,cs)}const ds="Wildcard";function SR(t){return ue.isInstance(t,ds)}class Cg extends fg{getAllTypes(){return[xi,Ea,$a,Xi,Yi,Ta,Ca,Ji,Fi,Qi,sc,Ki,Zi,Ui,es,wa,oc,ts,Wi,Gi,ns,lc,rs,Hi,ba,Aa,qi,ji,Ma,is,xl,ss,Vi,Sa,as,os,Or,ls,zi,uc,Xp,Na,us,cs,ac,ds]}computeIsSubtype(e,n){switch(e){case Xi:case Yi:case Ji:case Qi:case Zi:case es:case ts:case ns:case rs:case is:case ss:case as:case os:case ls:case us:case cs:case ds:{return this.isSubtype(xi,n)}case Ta:case ba:case Sa:{return this.isSubtype(ac,n)}case Ca:case Ma:case Vi:case Na:{return this.isSubtype(Xp,n)}case Fi:{return this.isSubtype(sc,n)||this.isSubtype(ac,n)}case Ki:case Ui:case Hi:case qi:{return this.isSubtype(sc,n)}case Wi:case Gi:case zi:{return this.isSubtype($a,n)}case ji:{return this.isSubtype(Ea,n)||this.isSubtype($a,n)}case Or:{return this.isSubtype(Ea,n)}default:{return false}}}getReferenceType(e){const n=`${e.container.$type}:${e.property}`;switch(n){case"Action:type":case"CrossReference:type":case"Interface:superTypes":case"ParserRule:returnType":case"SimpleType:typeRef":{return $a}case"Grammar:hiddenTokens":case"ParserRule:hiddenTokens":case"RuleCall:rule":{return Ea}case"Grammar:usedGrammars":{return wa}case"NamedArgument:parameter":case"ParameterReference:parameter":{return Aa}case"TerminalRuleCall:rule":{return Or}default:{throw new Error(`${n} is not a valid reference id.`)}}}getTypeMetaData(e){switch(e){case xi:{return{name:xi,properties:[{name:"cardinality"},{name:"lookahead"}]}}case Ta:{return{name:Ta,properties:[{name:"elements",defaultValue:[]}]}}case Ca:{return{name:Ca,properties:[{name:"elementType"}]}}case Fi:{return{name:Fi,properties:[{name:"true",defaultValue:false}]}}case Ki:{return{name:Ki,properties:[{name:"left"},{name:"right"}]}}case Ui:{return{name:Ui,properties:[{name:"left"},{name:"right"}]}}case wa:{return{name:wa,properties:[{name:"definesHiddenTokens",defaultValue:false},{name:"hiddenTokens",defaultValue:[]},{name:"imports",defaultValue:[]},{name:"interfaces",defaultValue:[]},{name:"isDeclared",defaultValue:false},{name:"name"},{name:"rules",defaultValue:[]},{name:"types",defaultValue:[]},{name:"usedGrammars",defaultValue:[]}]}}case oc:{return{name:oc,properties:[{name:"path"}]}}case Wi:{return{name:Wi,properties:[{name:"name"}]}}case Gi:{return{name:Gi,properties:[{name:"attributes",defaultValue:[]},{name:"name"},{name:"superTypes",defaultValue:[]}]}}case lc:{return{name:lc,properties:[{name:"calledByName",defaultValue:false},{name:"parameter"},{name:"value"}]}}case Hi:{return{name:Hi,properties:[{name:"value"}]}}case ba:{return{name:ba,properties:[{name:"value"}]}}case Aa:{return{name:Aa,properties:[{name:"name"}]}}case qi:{return{name:qi,properties:[{name:"parameter"}]}}case ji:{return{name:ji,properties:[{name:"dataType"},{name:"definesHiddenTokens",defaultValue:false},{name:"definition"},{name:"entry",defaultValue:false},{name:"fragment",defaultValue:false},{name:"hiddenTokens",defaultValue:[]},{name:"inferredType"},{name:"name"},{name:"parameters",defaultValue:[]},{name:"returnType"},{name:"wildcard",defaultValue:false}]}}case Ma:{return{name:Ma,properties:[{name:"referenceType"}]}}case xl:{return{name:xl,properties:[{name:"name"}]}}case Vi:{return{name:Vi,properties:[{name:"primitiveType"},{name:"stringType"},{name:"typeRef"}]}}case Sa:{return{name:Sa,properties:[{name:"value"}]}}case Or:{return{name:Or,properties:[{name:"definition"},{name:"fragment",defaultValue:false},{name:"hidden",defaultValue:false},{name:"name"},{name:"type"}]}}case zi:{return{name:zi,properties:[{name:"name"},{name:"type"}]}}case uc:{return{name:uc,properties:[{name:"defaultValue"},{name:"isOptional",defaultValue:false},{name:"name"},{name:"type"}]}}case Na:{return{name:Na,properties:[{name:"types",defaultValue:[]}]}}case Xi:{return{name:Xi,properties:[{name:"cardinality"},{name:"feature"},{name:"inferredType"},{name:"lookahead"},{name:"operator"},{name:"type"}]}}case Yi:{return{name:Yi,properties:[{name:"cardinality"},{name:"elements",defaultValue:[]},{name:"lookahead"}]}}case Ji:{return{name:Ji,properties:[{name:"cardinality"},{name:"feature"},{name:"lookahead"},{name:"operator"},{name:"terminal"}]}}case Qi:{return{name:Qi,properties:[{name:"cardinality"},{name:"left"},{name:"lookahead"},{name:"right"}]}}case Zi:{return{name:Zi,properties:[{name:"cardinality"},{name:"deprecatedSyntax",defaultValue:false},{name:"lookahead"},{name:"terminal"},{name:"type"}]}}case es:{return{name:es,properties:[{name:"cardinality"},{name:"lookahead"}]}}case ts:{return{name:ts,properties:[{name:"cardinality"},{name:"elements",defaultValue:[]},{name:"guardCondition"},{name:"lookahead"}]}}case ns:{return{name:ns,properties:[{name:"cardinality"},{name:"lookahead"},{name:"value"}]}}case rs:{return{name:rs,properties:[{name:"cardinality"},{name:"lookahead"},{name:"terminal"}]}}case is:{return{name:is,properties:[{name:"cardinality"},{name:"lookahead"},{name:"regex"}]}}case ss:{return{name:ss,properties:[{name:"arguments",defaultValue:[]},{name:"cardinality"},{name:"lookahead"},{name:"rule"}]}}case as:{return{name:as,properties:[{name:"cardinality"},{name:"elements",defaultValue:[]},{name:"lookahead"}]}}case os:{return{name:os,properties:[{name:"cardinality"},{name:"elements",defaultValue:[]},{name:"lookahead"}]}}case ls:{return{name:ls,properties:[{name:"cardinality"},{name:"lookahead"},{name:"rule"}]}}case us:{return{name:us,properties:[{name:"cardinality"},{name:"elements",defaultValue:[]},{name:"lookahead"}]}}case cs:{return{name:cs,properties:[{name:"cardinality"},{name:"lookahead"},{name:"terminal"}]}}case ds:{return{name:ds,properties:[{name:"cardinality"},{name:"lookahead"}]}}default:{return{name:e,properties:[]}}}}}const ue=new Cg;function NR(t){for(const[e,n]of Object.entries(t)){if(!e.startsWith("$")){if(Array.isArray(n)){n.forEach((r,i)=>{if(Ze(r)){r.$container=t;r.$containerProperty=e;r.$containerIndex=i}})}else if(Ze(n)){n.$container=t;n.$containerProperty=e}}}}function Sn(t,e){let n=t;while(n){if(e(n)){return n}n=n.$container}return void 0}function ct(t){const e=iu(t);const n=e.$document;if(!n){throw new Error("AST node has no document.")}return n}function iu(t){while(t.$container){t=t.$container}return t}function Bu(t,e){if(!t){throw new Error("Node must be an AstNode.")}const n=e===null||e===void 0?void 0:e.range;return new Je(()=>({keys:Object.keys(t),keyIndex:0,arrayIndex:0}),r=>{while(r.keyIndex<r.keys.length){const i=r.keys[r.keyIndex];if(!i.startsWith("$")){const s=t[i];if(Ze(s)){r.keyIndex++;if(Pd(s,n)){return{done:false,value:s}}}else if(Array.isArray(s)){while(r.arrayIndex<s.length){const a=r.arrayIndex++;const o=s[a];if(Ze(o)&&Pd(o,n)){return{done:false,value:o}}}r.arrayIndex=0}}r.keyIndex++}return Mt})}function Tr(t,e){if(!t){throw new Error("Root node must be an AstNode.")}return new tu(t,n=>Bu(n,e))}function qn(t,e){if(!t){throw new Error("Root node must be an AstNode.")}else if((e===null||e===void 0?void 0:e.range)&&!Pd(t,e.range)){return new tu(t,()=>[])}return new tu(t,n=>Bu(n,e),{includeRoot:true})}function Pd(t,e){var n;if(!e){return true}const r=(n=t.$cstNode)===null||n===void 0?void 0:n.range;if(!r){return false}return hg(r,e)}function wg(t){return new Je(()=>({keys:Object.keys(t),keyIndex:0,arrayIndex:0}),e=>{while(e.keyIndex<e.keys.length){const n=e.keys[e.keyIndex];if(!n.startsWith("$")){const r=t[n];if(tn(r)){e.keyIndex++;return{done:false,value:{reference:r,container:t,property:n}}}else if(Array.isArray(r)){while(e.arrayIndex<r.length){const i=e.arrayIndex++;const s=r[i];if(tn(s)){return{done:false,value:{reference:s,container:t,property:n,index:i}}}}e.arrayIndex=0}}e.keyIndex++}return Mt})}function bg(t,e){const n=t.getTypeMetaData(e.$type);const r=e;for(const i of n.properties){if(i.defaultValue!==void 0&&r[i.name]===void 0){r[i.name]=Ag(i.defaultValue)}}}function Ag(t){if(Array.isArray(t)){return[...t.map(Ag)]}else{return t}}function Z(t){return t.charCodeAt(0)}function cc(t,e){if(Array.isArray(t)){t.forEach(function(n){e.push(n)})}else{e.push(t)}}function ni(t,e){if(t[e]===true){throw"duplicate flag "+e}t[e];t[e]=true}function kr(t){if(t===void 0){throw Error("Internal Error - Should never get here!")}return true}function kR(){throw Error("Internal Error - Should never get here!")}function Yp(t){return t["type"]==="Character"}const su=[];for(let t=Z("0");t<=Z("9");t++){su.push(t)}const au=[Z("_")].concat(su);for(let t=Z("a");t<=Z("z");t++){au.push(t)}for(let t=Z("A");t<=Z("Z");t++){au.push(t)}const Jp=[Z(" "),Z("\f"),Z("\n"),Z("\r"),Z("	"),Z("\v"),Z("	"),Z(" "),Z(" "),Z(" "),Z(" "),Z(" "),Z(" "),Z(" "),Z(" "),Z(" "),Z(" "),Z(" "),Z(" "),Z(" "),Z("\u2028"),Z("\u2029"),Z(" "),Z(" "),Z("　"),Z("\uFEFF")];const PR=/[0-9a-fA-F]/;const ka=/[0-9]/;const DR=/[1-9]/;class Mg{constructor(){this.idx=0;this.input="";this.groupIdx=0}saveState(){return{idx:this.idx,input:this.input,groupIdx:this.groupIdx}}restoreState(e){this.idx=e.idx;this.input=e.input;this.groupIdx=e.groupIdx}pattern(e){this.idx=0;this.input=e;this.groupIdx=0;this.consumeChar("/");const n=this.disjunction();this.consumeChar("/");const r={type:"Flags",loc:{begin:this.idx,end:e.length},global:false,ignoreCase:false,multiLine:false,unicode:false,sticky:false};while(this.isRegExpFlag()){switch(this.popChar()){case"g":ni(r,"global");break;case"i":ni(r,"ignoreCase");break;case"m":ni(r,"multiLine");break;case"u":ni(r,"unicode");break;case"y":ni(r,"sticky");break}}if(this.idx!==this.input.length){throw Error("Redundant input: "+this.input.substring(this.idx))}return{type:"Pattern",flags:r,value:n,loc:this.loc(0)}}disjunction(){const e=[];const n=this.idx;e.push(this.alternative());while(this.peekChar()==="|"){this.consumeChar("|");e.push(this.alternative())}return{type:"Disjunction",value:e,loc:this.loc(n)}}alternative(){const e=[];const n=this.idx;while(this.isTerm()){e.push(this.term())}return{type:"Alternative",value:e,loc:this.loc(n)}}term(){if(this.isAssertion()){return this.assertion()}else{return this.atom()}}assertion(){const e=this.idx;switch(this.popChar()){case"^":return{type:"StartAnchor",loc:this.loc(e)};case"$":return{type:"EndAnchor",loc:this.loc(e)};case"\\":switch(this.popChar()){case"b":return{type:"WordBoundary",loc:this.loc(e)};case"B":return{type:"NonWordBoundary",loc:this.loc(e)}}throw Error("Invalid Assertion Escape");case"(":this.consumeChar("?");let n;switch(this.popChar()){case"=":n="Lookahead";break;case"!":n="NegativeLookahead";break}kr(n);const r=this.disjunction();this.consumeChar(")");return{type:n,value:r,loc:this.loc(e)}}return kR()}quantifier(e=false){let n=void 0;const r=this.idx;switch(this.popChar()){case"*":n={atLeast:0,atMost:Infinity};break;case"+":n={atLeast:1,atMost:Infinity};break;case"?":n={atLeast:0,atMost:1};break;case"{":const i=this.integerIncludingZero();switch(this.popChar()){case"}":n={atLeast:i,atMost:i};break;case",":let s;if(this.isDigit()){s=this.integerIncludingZero();n={atLeast:i,atMost:s}}else{n={atLeast:i,atMost:Infinity}}this.consumeChar("}");break}if(e===true&&n===void 0){return void 0}kr(n);break}if(e===true&&n===void 0){return void 0}if(kr(n)){if(this.peekChar(0)==="?"){this.consumeChar("?");n.greedy=false}else{n.greedy=true}n.type="Quantifier";n.loc=this.loc(r);return n}}atom(){let e;const n=this.idx;switch(this.peekChar()){case".":e=this.dotAll();break;case"\\":e=this.atomEscape();break;case"[":e=this.characterClass();break;case"(":e=this.group();break}if(e===void 0&&this.isPatternCharacter()){e=this.patternCharacter()}if(kr(e)){e.loc=this.loc(n);if(this.isQuantifier()){e.quantifier=this.quantifier()}return e}}dotAll(){this.consumeChar(".");return{type:"Set",complement:true,value:[Z("\n"),Z("\r"),Z("\u2028"),Z("\u2029")]}}atomEscape(){this.consumeChar("\\");switch(this.peekChar()){case"1":case"2":case"3":case"4":case"5":case"6":case"7":case"8":case"9":return this.decimalEscapeAtom();case"d":case"D":case"s":case"S":case"w":case"W":return this.characterClassEscape();case"f":case"n":case"r":case"t":case"v":return this.controlEscapeAtom();case"c":return this.controlLetterEscapeAtom();case"0":return this.nulCharacterAtom();case"x":return this.hexEscapeSequenceAtom();case"u":return this.regExpUnicodeEscapeSequenceAtom();default:return this.identityEscapeAtom()}}decimalEscapeAtom(){const e=this.positiveInteger();return{type:"GroupBackReference",value:e}}characterClassEscape(){let e;let n=false;switch(this.popChar()){case"d":e=su;break;case"D":e=su;n=true;break;case"s":e=Jp;break;case"S":e=Jp;n=true;break;case"w":e=au;break;case"W":e=au;n=true;break}if(kr(e)){return{type:"Set",value:e,complement:n}}}controlEscapeAtom(){let e;switch(this.popChar()){case"f":e=Z("\f");break;case"n":e=Z("\n");break;case"r":e=Z("\r");break;case"t":e=Z("	");break;case"v":e=Z("\v");break}if(kr(e)){return{type:"Character",value:e}}}controlLetterEscapeAtom(){this.consumeChar("c");const e=this.popChar();if(/[a-zA-Z]/.test(e)===false){throw Error("Invalid ")}const n=e.toUpperCase().charCodeAt(0)-64;return{type:"Character",value:n}}nulCharacterAtom(){this.consumeChar("0");return{type:"Character",value:Z("\0")}}hexEscapeSequenceAtom(){this.consumeChar("x");return this.parseHexDigits(2)}regExpUnicodeEscapeSequenceAtom(){this.consumeChar("u");return this.parseHexDigits(4)}identityEscapeAtom(){const e=this.popChar();return{type:"Character",value:Z(e)}}classPatternCharacterAtom(){switch(this.peekChar()){case"\n":case"\r":case"\u2028":case"\u2029":case"\\":case"]":throw Error("TBD");default:const e=this.popChar();return{type:"Character",value:Z(e)}}}characterClass(){const e=[];let n=false;this.consumeChar("[");if(this.peekChar(0)==="^"){this.consumeChar("^");n=true}while(this.isClassAtom()){const r=this.classAtom();r.type==="Character";if(Yp(r)&&this.isRangeDash()){this.consumeChar("-");const i=this.classAtom();i.type==="Character";if(Yp(i)){if(i.value<r.value){throw Error("Range out of order in character class")}e.push({from:r.value,to:i.value})}else{cc(r.value,e);e.push(Z("-"));cc(i.value,e)}}else{cc(r.value,e)}}this.consumeChar("]");return{type:"Set",complement:n,value:e}}classAtom(){switch(this.peekChar()){case"]":case"\n":case"\r":case"\u2028":case"\u2029":throw Error("TBD");case"\\":return this.classEscape();default:return this.classPatternCharacterAtom()}}classEscape(){this.consumeChar("\\");switch(this.peekChar()){case"b":this.consumeChar("b");return{type:"Character",value:Z("\b")};case"d":case"D":case"s":case"S":case"w":case"W":return this.characterClassEscape();case"f":case"n":case"r":case"t":case"v":return this.controlEscapeAtom();case"c":return this.controlLetterEscapeAtom();case"0":return this.nulCharacterAtom();case"x":return this.hexEscapeSequenceAtom();case"u":return this.regExpUnicodeEscapeSequenceAtom();default:return this.identityEscapeAtom()}}group(){let e=true;this.consumeChar("(");switch(this.peekChar(0)){case"?":this.consumeChar("?");this.consumeChar(":");e=false;break;default:this.groupIdx++;break}const n=this.disjunction();this.consumeChar(")");const r={type:"Group",capturing:e,value:n};if(e){r["idx"]=this.groupIdx}return r}positiveInteger(){let e=this.popChar();if(DR.test(e)===false){throw Error("Expecting a positive integer")}while(ka.test(this.peekChar(0))){e+=this.popChar()}return parseInt(e,10)}integerIncludingZero(){let e=this.popChar();if(ka.test(e)===false){throw Error("Expecting an integer")}while(ka.test(this.peekChar(0))){e+=this.popChar()}return parseInt(e,10)}patternCharacter(){const e=this.popChar();switch(e){case"\n":case"\r":case"\u2028":case"\u2029":case"^":case"$":case"\\":case".":case"*":case"+":case"?":case"(":case")":case"[":case"|":throw Error("TBD");default:return{type:"Character",value:Z(e)}}}isRegExpFlag(){switch(this.peekChar(0)){case"g":case"i":case"m":case"u":case"y":return true;default:return false}}isRangeDash(){return this.peekChar()==="-"&&this.isClassAtom(1)}isDigit(){return ka.test(this.peekChar(0))}isClassAtom(e=0){switch(this.peekChar(e)){case"]":case"\n":case"\r":case"\u2028":case"\u2029":return false;default:return true}}isTerm(){return this.isAtom()||this.isAssertion()}isAtom(){if(this.isPatternCharacter()){return true}switch(this.peekChar(0)){case".":case"\\":case"[":case"(":return true;default:return false}}isAssertion(){switch(this.peekChar(0)){case"^":case"$":return true;case"\\":switch(this.peekChar(1)){case"b":case"B":return true;default:return false}case"(":return this.peekChar(1)==="?"&&(this.peekChar(2)==="="||this.peekChar(2)==="!");default:return false}}isQuantifier(){const e=this.saveState();try{return this.quantifier(true)!==void 0}catch(n){return false}finally{this.restoreState(e)}}isPatternCharacter(){switch(this.peekChar()){case"^":case"$":case"\\":case".":case"*":case"+":case"?":case"(":case")":case"[":case"|":case"/":case"\n":case"\r":case"\u2028":case"\u2029":return false;default:return true}}parseHexDigits(e){let n="";for(let i=0;i<e;i++){const s=this.popChar();if(PR.test(s)===false){throw Error("Expecting a HexDecimal digits")}n+=s}const r=parseInt(n,16);return{type:"Character",value:r}}peekChar(e=0){return this.input[this.idx+e]}popChar(){const e=this.peekChar(0);this.consumeChar(void 0);return e}consumeChar(e){if(e!==void 0&&this.input[this.idx]!==e){throw Error("Expected: '"+e+"' but found: '"+this.input[this.idx]+"' at offset: "+this.idx)}if(this.idx>=this.input.length){throw Error("Unexpected end of input")}this.idx++}loc(e){return{begin:e,end:this.idx}}}class Lu{visitChildren(e){for(const n in e){const r=e[n];if(e.hasOwnProperty(n)){if(r.type!==void 0){this.visit(r)}else if(Array.isArray(r)){r.forEach(i=>{this.visit(i)},this)}}}}visit(e){switch(e.type){case"Pattern":this.visitPattern(e);break;case"Flags":this.visitFlags(e);break;case"Disjunction":this.visitDisjunction(e);break;case"Alternative":this.visitAlternative(e);break;case"StartAnchor":this.visitStartAnchor(e);break;case"EndAnchor":this.visitEndAnchor(e);break;case"WordBoundary":this.visitWordBoundary(e);break;case"NonWordBoundary":this.visitNonWordBoundary(e);break;case"Lookahead":this.visitLookahead(e);break;case"NegativeLookahead":this.visitNegativeLookahead(e);break;case"Character":this.visitCharacter(e);break;case"Set":this.visitSet(e);break;case"Group":this.visitGroup(e);break;case"GroupBackReference":this.visitGroupBackReference(e);break;case"Quantifier":this.visitQuantifier(e);break}this.visitChildren(e)}visitPattern(e){}visitFlags(e){}visitDisjunction(e){}visitAlternative(e){}visitStartAnchor(e){}visitEndAnchor(e){}visitWordBoundary(e){}visitNonWordBoundary(e){}visitLookahead(e){}visitNegativeLookahead(e){}visitCharacter(e){}visitSet(e){}visitGroup(e){}visitGroupBackReference(e){}visitQuantifier(e){}}const OR=/\r?\n/gm;const _R=new Mg;class BR extends Lu{constructor(){super(...arguments);this.isStarting=true;this.endRegexpStack=[];this.multiline=false}get endRegex(){return this.endRegexpStack.join("")}reset(e){this.multiline=false;this.regex=e;this.startRegexp="";this.isStarting=true;this.endRegexpStack=[]}visitGroup(e){if(e.quantifier){this.isStarting=false;this.endRegexpStack=[]}}visitCharacter(e){const n=String.fromCharCode(e.value);if(!this.multiline&&n==="\n"){this.multiline=true}if(e.quantifier){this.isStarting=false;this.endRegexpStack=[]}else{const r=xu(n);this.endRegexpStack.push(r);if(this.isStarting){this.startRegexp+=r}}}visitSet(e){if(!this.multiline){const n=this.regex.substring(e.loc.begin,e.loc.end);const r=new RegExp(n);this.multiline=Boolean("\n".match(r))}if(e.quantifier){this.isStarting=false;this.endRegexpStack=[]}else{const n=this.regex.substring(e.loc.begin,e.loc.end);this.endRegexpStack.push(n);if(this.isStarting){this.startRegexp+=n}}}visitChildren(e){if(e.type==="Group"){const n=e;if(n.quantifier){return}}super.visitChildren(e)}}const dc=new BR;function LR(t){try{if(typeof t==="string"){t=new RegExp(t)}t=t.toString();dc.reset(t);dc.visit(_R.pattern(t));return dc.multiline}catch(e){return false}}const xR="\f\n\r	\v              \u2028\u2029  　\uFEFF".split("");function ou(t){const e=typeof t==="string"?new RegExp(t):t;return xR.some(n=>e.test(n))}function xu(t){return t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function FR(t){return Array.prototype.map.call(t,e=>/\w/.test(e)?`[${e.toLowerCase()}${e.toUpperCase()}]`:xu(e)).join("")}function KR(t,e){const n=UR(t);const r=e.match(n);return!!r&&r[0].length>0}function UR(t){if(typeof t==="string"){t=new RegExp(t)}const e=t,n=t.source;let r=0;function i(){let s="",a;function o(u){s+=n.substr(r,u);r+=u}function l(u){s+="(?:"+n.substr(r,u)+"|$)";r+=u}while(r<n.length){switch(n[r]){case"\\":switch(n[r+1]){case"c":l(3);break;case"x":l(4);break;case"u":if(e.unicode){if(n[r+2]==="{"){l(n.indexOf("}",r)-r+1)}else{l(6)}}else{l(2)}break;case"p":case"P":if(e.unicode){l(n.indexOf("}",r)-r+1)}else{l(2)}break;case"k":l(n.indexOf(">",r)-r+1);break;default:l(2);break}break;case"[":a=/\[(?:\\.|.)*?\]/g;a.lastIndex=r;a=a.exec(n)||[];l(a[0].length);break;case"|":case"^":case"$":case"*":case"+":case"?":o(1);break;case"{":a=/\{\d+,?\d*\}/g;a.lastIndex=r;a=a.exec(n);if(a){o(a[0].length)}else{l(1)}break;case"(":if(n[r+1]==="?"){switch(n[r+2]){case":":s+="(?:";r+=3;s+=i()+"|$)";break;case"=":s+="(?=";r+=3;s+=i()+")";break;case"!":a=r;r+=3;i();s+=n.substr(a,r-a);break;case"<":switch(n[r+3]){case"=":case"!":a=r;r+=4;i();s+=n.substr(a,r-a);break;default:o(n.indexOf(">",r)-r+1);s+=i()+"|$)";break}break}}else{o(1);s+=i()+"|$)"}break;case")":++r;return s;default:l(1);break}}return s}return new RegExp(i(),t.flags)}function Dd(t){return t.rules.find(e=>it(e)&&e.entry)}function WR(t){return t.rules.filter(e=>Yn(e)&&e.hidden)}function sp(t,e){const n=new Set;const r=Dd(t);if(!r){return new Set(t.rules)}const i=[r].concat(WR(t));for(const a of i){Sg(a,n,e)}const s=new Set;for(const a of t.rules){if(n.has(a.name)||Yn(a)&&a.hidden){s.add(a)}}return s}function Sg(t,e,n){e.add(t.name);Tr(t).forEach(r=>{if(Pn(r)||n){const i=r.rule.ref;if(i&&!e.has(i.name)){Sg(i,e,n)}}})}function Ng(t){if(t.terminal){return t.terminal}else if(t.type.ref){const e=Og(t.type.ref);return e===null||e===void 0?void 0:e.terminal}return void 0}function GR(t){return t.hidden&&!ou(Ku(t))}function kg(t,e){if(!t||!e){return[]}return op(t,e,t.astNode,true)}function ap(t,e,n){if(!t||!e){return void 0}const r=op(t,e,t.astNode,true);if(r.length===0){return void 0}if(n!==void 0){n=Math.max(0,Math.min(n,r.length-1))}else{n=0}return r[n]}function op(t,e,n,r){if(!r){const i=Sn(t.grammarSource,sn);if(i&&i.feature===e){return[t]}}if(hr(t)&&t.astNode===n){return t.content.flatMap(i=>op(i,e,n,false))}return[]}function HR(t,e){if(!t){return[]}return Dg(t,e,t===null||t===void 0?void 0:t.astNode)}function Pg(t,e,n){if(!t){return void 0}const r=Dg(t,e,t===null||t===void 0?void 0:t.astNode);if(r.length===0){return void 0}if(n!==void 0){n=Math.max(0,Math.min(n,r.length-1))}else{n=0}return r[n]}function Dg(t,e,n){if(t.astNode!==n){return[]}if(an(t.grammarSource)&&t.grammarSource.value===e){return[t]}const r=nu(t).iterator();let i;const s=[];do{i=r.next();if(!i.done){const a=i.value;if(a.astNode===n){if(an(a.grammarSource)&&a.grammarSource.value===e){s.push(a)}}else{r.prune()}}}while(!i.done);return s}function qR(t){var e;const n=t.astNode;while(n===((e=t.container)===null||e===void 0?void 0:e.astNode)){const r=Sn(t.grammarSource,sn);if(r){return r}t=t.container}return void 0}function Og(t){let e=t;if(Eg(e)){if(Vs(e.$container)){e=e.$container.$container}else if(it(e.$container)){e=e.$container}else{js(e.$container)}}return _g(t,e,new Map)}function _g(t,e,n){var r;function i(s,a){let o=void 0;const l=Sn(s,sn);if(!l){o=_g(a,a,n)}n.set(t,o);return o}if(n.has(t)){return n.get(t)}n.set(t,void 0);for(const s of Tr(e)){if(sn(s)&&s.feature.toLowerCase()==="name"){n.set(t,s);return s}else if(Pn(s)&&it(s.rule.ref)){return i(s,s.rule.ref)}else if(RR(s)&&((r=s.typeRef)===null||r===void 0?void 0:r.ref)){return i(s,s.typeRef.ref)}}return void 0}function ks(t,e){return t==="?"||t==="*"||gr(e)&&Boolean(e.guardCondition)}function jR(t){return t==="*"||t==="+"}function Bg(t){return Lg(t,new Set)}function Lg(t,e){if(e.has(t)){return true}else{e.add(t)}for(const n of Tr(t)){if(Pn(n)){if(!n.rule.ref){return false}if(it(n.rule.ref)&&!Lg(n.rule.ref,e)){return false}}else if(sn(n)){return false}else if(Vs(n)){return false}}return Boolean(t.definition)}function Xs(t){if(t.inferredType){return t.inferredType.name}else if(t.dataType){return t.dataType}else if(t.returnType){const e=t.returnType.ref;if(e){if(it(e)){return e.name}else if($g(e)||Tg(e)){return e.name}}}return void 0}function Fu(t){var e;if(it(t)){return Bg(t)?t.name:(e=Xs(t))!==null&&e!==void 0?e:t.name}else if($g(t)||Tg(t)||vR(t)){return t.name}else if(Vs(t)){const n=VR(t);if(n){return n}}else if(Eg(t)){return t.name}throw new Error("Cannot get name of Unknown Type")}function VR(t){var e;if(t.inferredType){return t.inferredType.name}else if((e=t.type)===null||e===void 0?void 0:e.ref){return Fu(t.type.ref)}return void 0}function zR(t){var e,n,r;if(Yn(t)){return(n=(e=t.type)===null||e===void 0?void 0:e.name)!==null&&n!==void 0?n:"string"}else{return(r=Xs(t))!==null&&r!==void 0?r:t.name}}function Ku(t){const e={s:false,i:false,u:false};const n=Xr(t.definition,e);const r=Object.entries(e).filter(([,i])=>i).map(([i])=>i).join("");return new RegExp(n,r)}const lp=/[\s\S]/.source;function Xr(t,e){if(wR(t)){return XR(t)}else if(bR(t)){return YR(t)}else if(ER(t)){return ZR(t)}else if(AR(t)){const n=t.rule.ref;if(!n){throw new Error("Missing rule reference.")}return Nn(Xr(n.definition),{cardinality:t.cardinality,lookahead:t.lookahead})}else if(TR(t)){return QR(t)}else if(MR(t)){return JR(t)}else if(CR(t)){const n=t.regex.lastIndexOf("/");const r=t.regex.substring(1,n);const i=t.regex.substring(n+1);if(e){e.i=i.includes("i");e.s=i.includes("s");e.u=i.includes("u")}return Nn(r,{cardinality:t.cardinality,lookahead:t.lookahead,wrap:false})}else if(SR(t)){return Nn(lp,{cardinality:t.cardinality,lookahead:t.lookahead})}else{throw new Error(`Invalid terminal element: ${t===null||t===void 0?void 0:t.$type}`)}}function XR(t){return Nn(t.elements.map(e=>Xr(e)).join("|"),{cardinality:t.cardinality,lookahead:t.lookahead})}function YR(t){return Nn(t.elements.map(e=>Xr(e)).join(""),{cardinality:t.cardinality,lookahead:t.lookahead})}function JR(t){return Nn(`${lp}*?${Xr(t.terminal)}`,{cardinality:t.cardinality,lookahead:t.lookahead})}function QR(t){return Nn(`(?!${Xr(t.terminal)})${lp}*?`,{cardinality:t.cardinality,lookahead:t.lookahead})}function ZR(t){if(t.right){return Nn(`[${fc(t.left)}-${fc(t.right)}]`,{cardinality:t.cardinality,lookahead:t.lookahead,wrap:false})}return Nn(fc(t.left),{cardinality:t.cardinality,lookahead:t.lookahead,wrap:false})}function fc(t){return xu(t.value)}function Nn(t,e){var n;if(e.wrap!==false||e.lookahead){t=`(${(n=e.lookahead)!==null&&n!==void 0?n:""}${t})`}if(e.cardinality){return`${t}${e.cardinality}`}return t}function eE(t){const e=[];const n=t.Grammar;for(const r of n.rules){if(Yn(r)&&GR(r)&&LR(Ku(r))){e.push(r.name)}}return{multilineCommentRules:e,nameRegexp:yg}}var xg=typeof global=="object"&&global&&global.Object===Object&&global;var tE=typeof self=="object"&&self&&self.Object===Object&&self;var on=xg||tE||Function("return this")();var Kt=on.Symbol;var Fg=Object.prototype;var nE=Fg.hasOwnProperty;var rE=Fg.toString;var ri=Kt?Kt.toStringTag:void 0;function iE(t){var e=nE.call(t,ri),n=t[ri];try{t[ri]=void 0;var r=true}catch(s){}var i=rE.call(t);if(r){if(e){t[ri]=n}else{delete t[ri]}}return i}var sE=Object.prototype;var aE=sE.toString;function oE(t){return aE.call(t)}var lE="[object Null]";var uE="[object Undefined]";var Qp=Kt?Kt.toStringTag:void 0;function Jn(t){if(t==null){return t===void 0?uE:lE}return Qp&&Qp in Object(t)?iE(t):oE(t)}function Vt(t){return t!=null&&typeof t=="object"}var cE="[object Symbol]";function Ys(t){return typeof t=="symbol"||Vt(t)&&Jn(t)==cE}function Uu(t,e){var n=-1,r=t==null?0:t.length,i=Array(r);while(++n<r){i[n]=e(t[n],n,t)}return i}var oe=Array.isArray;var Zp=Kt?Kt.prototype:void 0;var em=Zp?Zp.toString:void 0;function Kg(t){if(typeof t=="string"){return t}if(oe(t)){return Uu(t,Kg)+""}if(Ys(t)){return em?em.call(t):""}var e=t+"";return e=="0"&&1/t==-Infinity?"-0":e}var dE=/\s/;function fE(t){var e=t.length;while(e--&&dE.test(t.charAt(e))){}return e}var pE=/^\s+/;function mE(t){return t?t.slice(0,fE(t)+1).replace(pE,""):t}function Ut(t){var e=typeof t;return t!=null&&(e=="object"||e=="function")}var tm=0/0;var hE=/^[-+]0x[0-9a-f]+$/i;var yE=/^0b[01]+$/i;var gE=/^0o[0-7]+$/i;var IE=parseInt;function vE(t){if(typeof t=="number"){return t}if(Ys(t)){return tm}if(Ut(t)){var e=typeof t.valueOf=="function"?t.valueOf():t;t=Ut(e)?e+"":e}if(typeof t!="string"){return t===0?t:+t}t=mE(t);var n=yE.test(t);return n||gE.test(t)?IE(t.slice(2),n?2:8):hE.test(t)?tm:+t}var RE=1/0;var EE=17976931348623157e292;function $E(t){if(!t){return t===0?t:0}t=vE(t);if(t===RE||t===-Infinity){var e=t<0?-1:1;return e*EE}return t===t?t:0}function Wu(t){var e=$E(t),n=e%1;return e===e?n?e-n:e:0}function Ir(t){return t}var TE="[object AsyncFunction]";var CE="[object Function]";var wE="[object GeneratorFunction]";var bE="[object Proxy]";function Ln(t){if(!Ut(t)){return false}var e=Jn(t);return e==CE||e==wE||e==TE||e==bE}var pc=on["__core-js_shared__"];var nm=function(){var t=/[^.]+$/.exec(pc&&pc.keys&&pc.keys.IE_PROTO||"");return t?"Symbol(src)_1."+t:""}();function AE(t){return!!nm&&nm in t}var ME=Function.prototype;var SE=ME.toString;function Cr(t){if(t!=null){try{return SE.call(t)}catch(e){}try{return t+""}catch(e){}}return""}var NE=/[\\^$.*+?()[\]{}|]/g;var kE=/^\[object .+?Constructor\]$/;var PE=Function.prototype;var DE=Object.prototype;var OE=PE.toString;var _E=DE.hasOwnProperty;var BE=RegExp("^"+OE.call(_E).replace(NE,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");function LE(t){if(!Ut(t)||AE(t)){return false}var e=Ln(t)?BE:kE;return e.test(Cr(t))}function xE(t,e){return t==null?void 0:t[e]}function wr(t,e){var n=xE(t,e);return LE(n)?n:void 0}var Od=wr(on,"WeakMap");var rm=Object.create;var FE=function(){function t(){}return function(e){if(!Ut(e)){return{}}if(rm){return rm(e)}t.prototype=e;var n=new t;t.prototype=void 0;return n}}();function KE(t,e,n){switch(n.length){case 0:return t.call(e);case 1:return t.call(e,n[0]);case 2:return t.call(e,n[0],n[1]);case 3:return t.call(e,n[0],n[1],n[2])}return t.apply(e,n)}function He(){}function UE(t,e){var n=-1,r=t.length;e||(e=Array(r));while(++n<r){e[n]=t[n]}return e}var WE=800;var GE=16;var HE=Date.now;function qE(t){var e=0,n=0;return function(){var r=HE(),i=GE-(r-n);n=r;if(i>0){if(++e>=WE){return arguments[0]}}else{e=0}return t.apply(void 0,arguments)}}function jE(t){return function(){return t}}var lu=function(){try{var t=wr(Object,"defineProperty");t({},"",{});return t}catch(e){}}();var VE=!lu?Ir:function(t,e){return lu(t,"toString",{"configurable":true,"enumerable":false,"value":jE(e),"writable":true})};var zE=qE(VE);function Ug(t,e){var n=-1,r=t==null?0:t.length;while(++n<r){if(e(t[n],n,t)===false){break}}return t}function Wg(t,e,n,r){var i=t.length,s=n+-1;while(++s<i){if(e(t[s],s,t)){return s}}return-1}function XE(t){return t!==t}function YE(t,e,n){var r=n-1,i=t.length;while(++r<i){if(t[r]===e){return r}}return-1}function up(t,e,n){return e===e?YE(t,e,n):Wg(t,XE,n)}function Gg(t,e){var n=t==null?0:t.length;return!!n&&up(t,e,0)>-1}var JE=9007199254740991;var QE=/^(?:0|[1-9]\d*)$/;function Gu(t,e){var n=typeof t;e=e==null?JE:e;return!!e&&(n=="number"||n!="symbol"&&QE.test(t))&&(t>-1&&t%1==0&&t<e)}function cp(t,e,n){if(e=="__proto__"&&lu){lu(t,e,{"configurable":true,"enumerable":true,"value":n,"writable":true})}else{t[e]=n}}function Js(t,e){return t===e||t!==t&&e!==e}var ZE=Object.prototype;var e$=ZE.hasOwnProperty;function Hu(t,e,n){var r=t[e];if(!(e$.call(t,e)&&Js(r,n))||n===void 0&&!(e in t)){cp(t,e,n)}}function dp(t,e,n,r){var i=!n;n||(n={});var s=-1,a=e.length;while(++s<a){var o=e[s];var l=void 0;if(l===void 0){l=t[o]}if(i){cp(n,o,l)}else{Hu(n,o,l)}}return n}var im=Math.max;function t$(t,e,n){e=im(e===void 0?t.length-1:e,0);return function(){var r=arguments,i=-1,s=im(r.length-e,0),a=Array(s);while(++i<s){a[i]=r[e+i]}i=-1;var o=Array(e+1);while(++i<e){o[i]=r[i]}o[e]=n(a);return KE(t,this,o)}}function fp(t,e){return zE(t$(t,e,Ir),t+"")}var n$=9007199254740991;function pp(t){return typeof t=="number"&&t>-1&&t%1==0&&t<=n$}function ln(t){return t!=null&&pp(t.length)&&!Ln(t)}function Hg(t,e,n){if(!Ut(n)){return false}var r=typeof e;if(r=="number"?ln(n)&&Gu(e,n.length):r=="string"&&e in n){return Js(n[e],t)}return false}function r$(t){return fp(function(e,n){var r=-1,i=n.length,s=i>1?n[i-1]:void 0,a=i>2?n[2]:void 0;s=t.length>3&&typeof s=="function"?(i--,s):void 0;if(a&&Hg(n[0],n[1],a)){s=i<3?void 0:s;i=1}e=Object(e);while(++r<i){var o=n[r];if(o){t(e,o,r,s)}}return e})}var i$=Object.prototype;function Qs(t){var e=t&&t.constructor,n=typeof e=="function"&&e.prototype||i$;return t===n}function s$(t,e){var n=-1,r=Array(t);while(++n<t){r[n]=e(n)}return r}var a$="[object Arguments]";function sm(t){return Vt(t)&&Jn(t)==a$}var qg=Object.prototype;var o$=qg.hasOwnProperty;var l$=qg.propertyIsEnumerable;var qu=sm(function(){return arguments}())?sm:function(t){return Vt(t)&&o$.call(t,"callee")&&!l$.call(t,"callee")};function u$(){return false}var jg=typeof St=="object"&&St&&!St.nodeType&&St;var am=jg&&typeof Nt=="object"&&Nt&&!Nt.nodeType&&Nt;var c$=am&&am.exports===jg;var om=c$?on.Buffer:void 0;var d$=om?om.isBuffer:void 0;var Ps=d$||u$;var f$="[object Arguments]";var p$="[object Array]";var m$="[object Boolean]";var h$="[object Date]";var y$="[object Error]";var g$="[object Function]";var I$="[object Map]";var v$="[object Number]";var R$="[object Object]";var E$="[object RegExp]";var $$="[object Set]";var T$="[object String]";var C$="[object WeakMap]";var w$="[object ArrayBuffer]";var b$="[object DataView]";var A$="[object Float32Array]";var M$="[object Float64Array]";var S$="[object Int8Array]";var N$="[object Int16Array]";var k$="[object Int32Array]";var P$="[object Uint8Array]";var D$="[object Uint8ClampedArray]";var O$="[object Uint16Array]";var _$="[object Uint32Array]";var Re={};Re[A$]=Re[M$]=Re[S$]=Re[N$]=Re[k$]=Re[P$]=Re[D$]=Re[O$]=Re[_$]=true;Re[f$]=Re[p$]=Re[w$]=Re[m$]=Re[b$]=Re[h$]=Re[y$]=Re[g$]=Re[I$]=Re[v$]=Re[R$]=Re[E$]=Re[$$]=Re[T$]=Re[C$]=false;function B$(t){return Vt(t)&&pp(t.length)&&!!Re[Jn(t)]}function ju(t){return function(e){return t(e)}}var Vg=typeof St=="object"&&St&&!St.nodeType&&St;var Ss=Vg&&typeof Nt=="object"&&Nt&&!Nt.nodeType&&Nt;var L$=Ss&&Ss.exports===Vg;var mc=L$&&xg.process;var jn=function(){try{var t=Ss&&Ss.require&&Ss.require("util").types;if(t){return t}return mc&&mc.binding&&mc.binding("util")}catch(e){}}();var lm=jn&&jn.isTypedArray;var mp=lm?ju(lm):B$;var x$=Object.prototype;var F$=x$.hasOwnProperty;function zg(t,e){var n=oe(t),r=!n&&qu(t),i=!n&&!r&&Ps(t),s=!n&&!r&&!i&&mp(t),a=n||r||i||s,o=a?s$(t.length,String):[],l=o.length;for(var u in t){if((e||F$.call(t,u))&&!(a&&(u=="length"||i&&(u=="offset"||u=="parent")||s&&(u=="buffer"||u=="byteLength"||u=="byteOffset")||Gu(u,l)))){o.push(u)}}return o}function Xg(t,e){return function(n){return t(e(n))}}var K$=Xg(Object.keys,Object);var U$=Object.prototype;var W$=U$.hasOwnProperty;function Yg(t){if(!Qs(t)){return K$(t)}var e=[];for(var n in Object(t)){if(W$.call(t,n)&&n!="constructor"){e.push(n)}}return e}function Wt(t){return ln(t)?zg(t):Yg(t)}var G$=Object.prototype;var H$=G$.hasOwnProperty;var Pt=r$(function(t,e){if(Qs(e)||ln(e)){dp(e,Wt(e),t);return}for(var n in e){if(H$.call(e,n)){Hu(t,n,e[n])}}});function q$(t){var e=[];if(t!=null){for(var n in Object(t)){e.push(n)}}return e}var j$=Object.prototype;var V$=j$.hasOwnProperty;function z$(t){if(!Ut(t)){return q$(t)}var e=Qs(t),n=[];for(var r in t){if(!(r=="constructor"&&(e||!V$.call(t,r)))){n.push(r)}}return n}function Jg(t){return ln(t)?zg(t,true):z$(t)}var X$=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;var Y$=/^\w*$/;function hp(t,e){if(oe(t)){return false}var n=typeof t;if(n=="number"||n=="symbol"||n=="boolean"||t==null||Ys(t)){return true}return Y$.test(t)||!X$.test(t)||e!=null&&t in Object(e)}var Ds=wr(Object,"create");function J$(){this.__data__=Ds?Ds(null):{};this.size=0}function Q$(t){var e=this.has(t)&&delete this.__data__[t];this.size-=e?1:0;return e}var Z$="__lodash_hash_undefined__";var eT=Object.prototype;var tT=eT.hasOwnProperty;function nT(t){var e=this.__data__;if(Ds){var n=e[t];return n===Z$?void 0:n}return tT.call(e,t)?e[t]:void 0}var rT=Object.prototype;var iT=rT.hasOwnProperty;function sT(t){var e=this.__data__;return Ds?e[t]!==void 0:iT.call(e,t)}var aT="__lodash_hash_undefined__";function oT(t,e){var n=this.__data__;this.size+=this.has(t)?0:1;n[t]=Ds&&e===void 0?aT:e;return this}function vr(t){var e=-1,n=t==null?0:t.length;this.clear();while(++e<n){var r=t[e];this.set(r[0],r[1])}}vr.prototype.clear=J$;vr.prototype["delete"]=Q$;vr.prototype.get=nT;vr.prototype.has=sT;vr.prototype.set=oT;function lT(){this.__data__=[];this.size=0}function Vu(t,e){var n=t.length;while(n--){if(Js(t[n][0],e)){return n}}return-1}var uT=Array.prototype;var cT=uT.splice;function dT(t){var e=this.__data__,n=Vu(e,t);if(n<0){return false}var r=e.length-1;if(n==r){e.pop()}else{cT.call(e,n,1)}--this.size;return true}function fT(t){var e=this.__data__,n=Vu(e,t);return n<0?void 0:e[n][1]}function pT(t){return Vu(this.__data__,t)>-1}function mT(t,e){var n=this.__data__,r=Vu(n,t);if(r<0){++this.size;n.push([t,e])}else{n[r][1]=e}return this}function xn(t){var e=-1,n=t==null?0:t.length;this.clear();while(++e<n){var r=t[e];this.set(r[0],r[1])}}xn.prototype.clear=lT;xn.prototype["delete"]=dT;xn.prototype.get=fT;xn.prototype.has=pT;xn.prototype.set=mT;var Os=wr(on,"Map");function hT(){this.size=0;this.__data__={"hash":new vr,"map":new(Os||xn),"string":new vr}}function yT(t){var e=typeof t;return e=="string"||e=="number"||e=="symbol"||e=="boolean"?t!=="__proto__":t===null}function zu(t,e){var n=t.__data__;return yT(e)?n[typeof e=="string"?"string":"hash"]:n.map}function gT(t){var e=zu(this,t)["delete"](t);this.size-=e?1:0;return e}function IT(t){return zu(this,t).get(t)}function vT(t){return zu(this,t).has(t)}function RT(t,e){var n=zu(this,t),r=n.size;n.set(t,e);this.size+=n.size==r?0:1;return this}function Fn(t){var e=-1,n=t==null?0:t.length;this.clear();while(++e<n){var r=t[e];this.set(r[0],r[1])}}Fn.prototype.clear=hT;Fn.prototype["delete"]=gT;Fn.prototype.get=IT;Fn.prototype.has=vT;Fn.prototype.set=RT;var ET="Expected a function";function yp(t,e){if(typeof t!="function"||e!=null&&typeof e!="function"){throw new TypeError(ET)}var n=function(){var r=arguments,i=e?e.apply(this,r):r[0],s=n.cache;if(s.has(i)){return s.get(i)}var a=t.apply(this,r);n.cache=s.set(i,a)||s;return a};n.cache=new(yp.Cache||Fn);return n}yp.Cache=Fn;var $T=500;function TT(t){var e=yp(t,function(r){if(n.size===$T){n.clear()}return r});var n=e.cache;return e}var CT=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;var wT=/\\(\\)?/g;var bT=TT(function(t){var e=[];if(t.charCodeAt(0)===46){e.push("")}t.replace(CT,function(n,r,i,s){e.push(i?s.replace(wT,"$1"):r||n)});return e});function AT(t){return t==null?"":Kg(t)}function Xu(t,e){if(oe(t)){return t}return hp(t,e)?[t]:bT(AT(t))}function Zs(t){if(typeof t=="string"||Ys(t)){return t}var e=t+"";return e=="0"&&1/t==-Infinity?"-0":e}function gp(t,e){e=Xu(e,t);var n=0,r=e.length;while(t!=null&&n<r){t=t[Zs(e[n++])]}return n&&n==r?t:void 0}function MT(t,e,n){var r=t==null?void 0:gp(t,e);return r===void 0?n:r}function Ip(t,e){var n=-1,r=e.length,i=t.length;while(++n<r){t[i+n]=e[n]}return t}var um=Kt?Kt.isConcatSpreadable:void 0;function ST(t){return oe(t)||qu(t)||!!(um&&t&&t[um])}function vp(t,e,n,r,i){var s=-1,a=t.length;n||(n=ST);i||(i=[]);while(++s<a){var o=t[s];if(n(o)){{Ip(i,o)}}else if(!r){i[i.length]=o}}return i}function Ft(t){var e=t==null?0:t.length;return e?vp(t):[]}var Qg=Xg(Object.getPrototypeOf,Object);function Zg(t,e,n){var r=-1,i=t.length;if(e<0){e=-e>i?0:i+e}n=n>i?i:n;if(n<0){n+=i}i=e>n?0:n-e>>>0;e>>>=0;var s=Array(i);while(++r<i){s[r]=t[r+e]}return s}function NT(t,e,n,r){var i=-1,s=t==null?0:t.length;if(r&&s){n=t[++i]}while(++i<s){n=e(n,t[i],i,t)}return n}function kT(){this.__data__=new xn;this.size=0}function PT(t){var e=this.__data__,n=e["delete"](t);this.size=e.size;return n}function DT(t){return this.__data__.get(t)}function OT(t){return this.__data__.has(t)}var _T=200;function BT(t,e){var n=this.__data__;if(n instanceof xn){var r=n.__data__;if(!Os||r.length<_T-1){r.push([t,e]);this.size=++n.size;return this}n=this.__data__=new Fn(r)}n.set(t,e);this.size=n.size;return this}function nn(t){var e=this.__data__=new xn(t);this.size=e.size}nn.prototype.clear=kT;nn.prototype["delete"]=PT;nn.prototype.get=DT;nn.prototype.has=OT;nn.prototype.set=BT;function LT(t,e){return t&&dp(e,Wt(e),t)}var eI=typeof St=="object"&&St&&!St.nodeType&&St;var cm=eI&&typeof Nt=="object"&&Nt&&!Nt.nodeType&&Nt;var xT=cm&&cm.exports===eI;var dm=xT?on.Buffer:void 0;var fm=dm?dm.allocUnsafe:void 0;function FT(t,e){var n=t.length,r=fm?fm(n):new t.constructor(n);t.copy(r);return r}function Rp(t,e){var n=-1,r=t==null?0:t.length,i=0,s=[];while(++n<r){var a=t[n];if(e(a,n,t)){s[i++]=a}}return s}function tI(){return[]}var KT=Object.prototype;var UT=KT.propertyIsEnumerable;var pm=Object.getOwnPropertySymbols;var Ep=!pm?tI:function(t){if(t==null){return[]}t=Object(t);return Rp(pm(t),function(e){return UT.call(t,e)})};function WT(t,e){return dp(t,Ep(t),e)}var GT=Object.getOwnPropertySymbols;var HT=!GT?tI:function(t){var e=[];while(t){Ip(e,Ep(t));t=Qg(t)}return e};function nI(t,e,n){var r=e(t);return oe(t)?r:Ip(r,n(t))}function _d(t){return nI(t,Wt,Ep)}function qT(t){return nI(t,Jg,HT)}var Bd=wr(on,"DataView");var Ld=wr(on,"Promise");var Lr=wr(on,"Set");var mm="[object Map]";var jT="[object Object]";var hm="[object Promise]";var ym="[object Set]";var gm="[object WeakMap]";var Im="[object DataView]";var VT=Cr(Bd);var zT=Cr(Os);var XT=Cr(Ld);var YT=Cr(Lr);var JT=Cr(Od);var Lt=Jn;if(Bd&&Lt(new Bd(new ArrayBuffer(1)))!=Im||Os&&Lt(new Os)!=mm||Ld&&Lt(Ld.resolve())!=hm||Lr&&Lt(new Lr)!=ym||Od&&Lt(new Od)!=gm){Lt=function(t){var e=Jn(t),n=e==jT?t.constructor:void 0,r=n?Cr(n):"";if(r){switch(r){case VT:return Im;case zT:return mm;case XT:return hm;case YT:return ym;case JT:return gm}}return e}}var QT=Object.prototype;var ZT=QT.hasOwnProperty;function eC(t){var e=t.length,n=new t.constructor(e);if(e&&typeof t[0]=="string"&&ZT.call(t,"index")){n.index=t.index;n.input=t.input}return n}var uu=on.Uint8Array;function tC(t){var e=new t.constructor(t.byteLength);new uu(e).set(new uu(t));return e}function nC(t,e){var n=t.buffer;return new t.constructor(n,t.byteOffset,t.byteLength)}var rC=/\w*$/;function iC(t){var e=new t.constructor(t.source,rC.exec(t));e.lastIndex=t.lastIndex;return e}var vm=Kt?Kt.prototype:void 0;var Rm=vm?vm.valueOf:void 0;function sC(t){return Rm?Object(Rm.call(t)):{}}function aC(t,e){var n=t.buffer;return new t.constructor(n,t.byteOffset,t.length)}var oC="[object Boolean]";var lC="[object Date]";var uC="[object Map]";var cC="[object Number]";var dC="[object RegExp]";var fC="[object Set]";var pC="[object String]";var mC="[object Symbol]";var hC="[object ArrayBuffer]";var yC="[object DataView]";var gC="[object Float32Array]";var IC="[object Float64Array]";var vC="[object Int8Array]";var RC="[object Int16Array]";var EC="[object Int32Array]";var $C="[object Uint8Array]";var TC="[object Uint8ClampedArray]";var CC="[object Uint16Array]";var wC="[object Uint32Array]";function bC(t,e,n){var r=t.constructor;switch(e){case hC:return tC(t);case oC:case lC:return new r(+t);case yC:return nC(t);case gC:case IC:case vC:case RC:case EC:case $C:case TC:case CC:case wC:return aC(t);case uC:return new r;case cC:case pC:return new r(t);case dC:return iC(t);case fC:return new r;case mC:return sC(t)}}function AC(t){return typeof t.constructor=="function"&&!Qs(t)?FE(Qg(t)):{}}var MC="[object Map]";function SC(t){return Vt(t)&&Lt(t)==MC}var Em=jn&&jn.isMap;var NC=Em?ju(Em):SC;var kC="[object Set]";function PC(t){return Vt(t)&&Lt(t)==kC}var $m=jn&&jn.isSet;var DC=$m?ju($m):PC;var rI="[object Arguments]";var OC="[object Array]";var _C="[object Boolean]";var BC="[object Date]";var LC="[object Error]";var iI="[object Function]";var xC="[object GeneratorFunction]";var FC="[object Map]";var KC="[object Number]";var sI="[object Object]";var UC="[object RegExp]";var WC="[object Set]";var GC="[object String]";var HC="[object Symbol]";var qC="[object WeakMap]";var jC="[object ArrayBuffer]";var VC="[object DataView]";var zC="[object Float32Array]";var XC="[object Float64Array]";var YC="[object Int8Array]";var JC="[object Int16Array]";var QC="[object Int32Array]";var ZC="[object Uint8Array]";var ew="[object Uint8ClampedArray]";var tw="[object Uint16Array]";var nw="[object Uint32Array]";var Ie={};Ie[rI]=Ie[OC]=Ie[jC]=Ie[VC]=Ie[_C]=Ie[BC]=Ie[zC]=Ie[XC]=Ie[YC]=Ie[JC]=Ie[QC]=Ie[FC]=Ie[KC]=Ie[sI]=Ie[UC]=Ie[WC]=Ie[GC]=Ie[HC]=Ie[ZC]=Ie[ew]=Ie[tw]=Ie[nw]=true;Ie[LC]=Ie[iI]=Ie[qC]=false;function Fl(t,e,n,r,i,s){var a;if(a!==void 0){return a}if(!Ut(t)){return t}var o=oe(t);if(o){a=eC(t);{return UE(t,a)}}else{var l=Lt(t),u=l==iI||l==xC;if(Ps(t)){return FT(t)}if(l==sI||l==rI||u&&!i){a=u?{}:AC(t);{return WT(t,LT(a,t))}}else{if(!Ie[l]){return i?t:{}}a=bC(t,l)}}s||(s=new nn);var c=s.get(t);if(c){return c}s.set(t,a);if(DC(t)){t.forEach(function(p){a.add(Fl(p,e,n,p,t,s))})}else if(NC(t)){t.forEach(function(p,y){a.set(y,Fl(p,e,n,y,t,s))})}var d=_d;var f=o?void 0:d(t);Ug(f||t,function(p,y){if(f){y=p;p=t[y]}Hu(a,y,Fl(p,e,n,y,t,s))});return a}var rw=4;function tt(t){return Fl(t,rw)}function ea(t){var e=-1,n=t==null?0:t.length,r=0,i=[];while(++e<n){var s=t[e];if(s){i[r++]=s}}return i}var iw="__lodash_hash_undefined__";function sw(t){this.__data__.set(t,iw);return this}function aw(t){return this.__data__.has(t)}function Kr(t){var e=-1,n=t==null?0:t.length;this.__data__=new Fn;while(++e<n){this.add(t[e])}}Kr.prototype.add=Kr.prototype.push=sw;Kr.prototype.has=aw;function aI(t,e){var n=-1,r=t==null?0:t.length;while(++n<r){if(e(t[n],n,t)){return true}}return false}function $p(t,e){return t.has(e)}var ow=1;var lw=2;function oI(t,e,n,r,i,s){var a=n&ow,o=t.length,l=e.length;if(o!=l&&!(a&&l>o)){return false}var u=s.get(t);var c=s.get(e);if(u&&c){return u==e&&c==t}var d=-1,f=true,p=n&lw?new Kr:void 0;s.set(t,e);s.set(e,t);while(++d<o){var y=t[d],R=e[d];if(r){var A=a?r(R,y,d,e,t,s):r(y,R,d,t,e,s)}if(A!==void 0){if(A){continue}f=false;break}if(p){if(!aI(e,function(v,$){if(!$p(p,$)&&(y===v||i(y,v,n,r,s))){return p.push($)}})){f=false;break}}else if(!(y===R||i(y,R,n,r,s))){f=false;break}}s["delete"](t);s["delete"](e);return f}function uw(t){var e=-1,n=Array(t.size);t.forEach(function(r,i){n[++e]=[i,r]});return n}function Tp(t){var e=-1,n=Array(t.size);t.forEach(function(r){n[++e]=r});return n}var cw=1;var dw=2;var fw="[object Boolean]";var pw="[object Date]";var mw="[object Error]";var hw="[object Map]";var yw="[object Number]";var gw="[object RegExp]";var Iw="[object Set]";var vw="[object String]";var Rw="[object Symbol]";var Ew="[object ArrayBuffer]";var $w="[object DataView]";var Tm=Kt?Kt.prototype:void 0;var hc=Tm?Tm.valueOf:void 0;function Tw(t,e,n,r,i,s,a){switch(n){case $w:if(t.byteLength!=e.byteLength||t.byteOffset!=e.byteOffset){return false}t=t.buffer;e=e.buffer;case Ew:if(t.byteLength!=e.byteLength||!s(new uu(t),new uu(e))){return false}return true;case fw:case pw:case yw:return Js(+t,+e);case mw:return t.name==e.name&&t.message==e.message;case gw:case vw:return t==e+"";case hw:var o=uw;case Iw:var l=r&cw;o||(o=Tp);if(t.size!=e.size&&!l){return false}var u=a.get(t);if(u){return u==e}r|=dw;a.set(t,e);var c=oI(o(t),o(e),r,i,s,a);a["delete"](t);return c;case Rw:if(hc){return hc.call(t)==hc.call(e)}}return false}var Cw=1;var ww=Object.prototype;var bw=ww.hasOwnProperty;function Aw(t,e,n,r,i,s){var a=n&Cw,o=_d(t),l=o.length,u=_d(e),c=u.length;if(l!=c&&!a){return false}var d=l;while(d--){var f=o[d];if(!(a?f in e:bw.call(e,f))){return false}}var p=s.get(t);var y=s.get(e);if(p&&y){return p==e&&y==t}var R=true;s.set(t,e);s.set(e,t);var A=a;while(++d<l){f=o[d];var v=t[f],$=e[f];if(r){var C=a?r($,v,f,e,t,s):r(v,$,f,t,e,s)}if(!(C===void 0?v===$||i(v,$,n,r,s):C)){R=false;break}A||(A=f=="constructor")}if(R&&!A){var O=t.constructor,Y=e.constructor;if(O!=Y&&("constructor"in t&&"constructor"in e)&&!(typeof O=="function"&&O instanceof O&&typeof Y=="function"&&Y instanceof Y)){R=false}}s["delete"](t);s["delete"](e);return R}var Mw=1;var Cm="[object Arguments]";var wm="[object Array]";var Pa="[object Object]";var Sw=Object.prototype;var bm=Sw.hasOwnProperty;function Nw(t,e,n,r,i,s){var a=oe(t),o=oe(e),l=a?wm:Lt(t),u=o?wm:Lt(e);l=l==Cm?Pa:l;u=u==Cm?Pa:u;var c=l==Pa,d=u==Pa,f=l==u;if(f&&Ps(t)){if(!Ps(e)){return false}a=true;c=false}if(f&&!c){s||(s=new nn);return a||mp(t)?oI(t,e,n,r,i,s):Tw(t,e,l,n,r,i,s)}if(!(n&Mw)){var p=c&&bm.call(t,"__wrapped__"),y=d&&bm.call(e,"__wrapped__");if(p||y){var R=p?t.value():t,A=y?e.value():e;s||(s=new nn);return i(R,A,n,r,s)}}if(!f){return false}s||(s=new nn);return Aw(t,e,n,r,i,s)}function Cp(t,e,n,r,i){if(t===e){return true}if(t==null||e==null||!Vt(t)&&!Vt(e)){return t!==t&&e!==e}return Nw(t,e,n,r,Cp,i)}var kw=1;var Pw=2;function Dw(t,e,n,r){var i=n.length,s=i;if(t==null){return!s}t=Object(t);while(i--){var a=n[i];if(a[2]?a[1]!==t[a[0]]:!(a[0]in t)){return false}}while(++i<s){a=n[i];var o=a[0],l=t[o],u=a[1];if(a[2]){if(l===void 0&&!(o in t)){return false}}else{var c=new nn;var d;if(!(d===void 0?Cp(u,l,kw|Pw,r,c):d)){return false}}}return true}function lI(t){return t===t&&!Ut(t)}function Ow(t){var e=Wt(t),n=e.length;while(n--){var r=e[n],i=t[r];e[n]=[r,i,lI(i)]}return e}function uI(t,e){return function(n){if(n==null){return false}return n[t]===e&&(e!==void 0||t in Object(n))}}function _w(t){var e=Ow(t);if(e.length==1&&e[0][2]){return uI(e[0][0],e[0][1])}return function(n){return n===t||Dw(n,t,e)}}function Bw(t,e){return t!=null&&e in Object(t)}function cI(t,e,n){e=Xu(e,t);var r=-1,i=e.length,s=false;while(++r<i){var a=Zs(e[r]);if(!(s=t!=null&&n(t,a))){break}t=t[a]}if(s||++r!=i){return s}i=t==null?0:t.length;return!!i&&pp(i)&&Gu(a,i)&&(oe(t)||qu(t))}function Lw(t,e){return t!=null&&cI(t,e,Bw)}var xw=1;var Fw=2;function Kw(t,e){if(hp(t)&&lI(e)){return uI(Zs(t),e)}return function(n){var r=MT(n,t);return r===void 0&&r===e?Lw(n,t):Cp(e,r,xw|Fw)}}function Uw(t){return function(e){return e==null?void 0:e[t]}}function Ww(t){return function(e){return gp(e,t)}}function Gw(t){return hp(t)?Uw(Zs(t)):Ww(t)}function Xt(t){if(typeof t=="function"){return t}if(t==null){return Ir}if(typeof t=="object"){return oe(t)?Kw(t[0],t[1]):_w(t)}return Gw(t)}function Hw(t,e,n,r){var i=-1,s=t==null?0:t.length;while(++i<s){var a=t[i];e(r,a,n(a),t)}return r}function qw(t){return function(e,n,r){var i=-1,s=Object(e),a=r(e),o=a.length;while(o--){var l=a[++i];if(n(s[l],l,s)===false){break}}return e}}var jw=qw();function Vw(t,e){return t&&jw(t,e,Wt)}function zw(t,e){return function(n,r){if(n==null){return n}if(!ln(n)){return t(n,r)}var i=n.length,s=-1,a=Object(n);while(++s<i){if(r(a[s],s,a)===false){break}}return n}}var br=zw(Vw);function Xw(t,e,n,r){br(t,function(i,s,a){e(r,i,n(i),a)});return r}function Yw(t,e){return function(n,r){var i=oe(n)?Hw:Xw,s=e?e():{};return i(n,t,Xt(r),s)}}var dI=Object.prototype;var Jw=dI.hasOwnProperty;var wp=fp(function(t,e){t=Object(t);var n=-1;var r=e.length;var i=r>2?e[2]:void 0;if(i&&Hg(e[0],e[1],i)){r=1}while(++n<r){var s=e[n];var a=Jg(s);var o=-1;var l=a.length;while(++o<l){var u=a[o];var c=t[u];if(c===void 0||Js(c,dI[u])&&!Jw.call(t,u)){t[u]=s[u]}}}return t});function Am(t){return Vt(t)&&ln(t)}var Qw=200;function Zw(t,e,n,r){var i=-1,s=Gg,a=true,o=t.length,l=[],u=e.length;if(!o){return l}if(e.length>=Qw){s=$p;a=false;e=new Kr(e)}e:while(++i<o){var c=t[i],d=c;c=c!==0?c:0;if(a&&d===d){var f=u;while(f--){if(e[f]===d){continue e}}l.push(c)}else if(!s(e,d,r)){l.push(c)}}return l}var Yu=fp(function(t,e){return Am(t)?Zw(t,vp(e,1,Am,true)):[]});function Ur(t){var e=t==null?0:t.length;return e?t[e-1]:void 0}function Ye(t,e,n){var r=t==null?0:t.length;if(!r){return[]}e=e===void 0?1:Wu(e);return Zg(t,e<0?0:e,r)}function _s(t,e,n){var r=t==null?0:t.length;if(!r){return[]}e=e===void 0?1:Wu(e);e=r-e;return Zg(t,0,e<0?0:e)}function eb(t){return typeof t=="function"?t:Ir}function X(t,e){var n=oe(t)?Ug:br;return n(t,eb(e))}function tb(t,e){var n=-1,r=t==null?0:t.length;while(++n<r){if(!e(t[n],n,t)){return false}}return true}function nb(t,e){var n=true;br(t,function(r,i,s){n=!!e(r,i,s);return n});return n}function qt(t,e,n){var r=oe(t)?tb:nb;return r(t,Xt(e))}function fI(t,e){var n=[];br(t,function(r,i,s){if(e(r,i,s)){n.push(r)}});return n}function Dt(t,e){var n=oe(t)?Rp:fI;return n(t,Xt(e))}function rb(t){return function(e,n,r){var i=Object(e);if(!ln(e)){var s=Xt(n);e=Wt(e);n=function(o){return s(i[o],o,i)}}var a=t(e,n,r);return a>-1?i[s?e[a]:a]:void 0}}var ib=Math.max;function sb(t,e,n){var r=t==null?0:t.length;if(!r){return-1}var i=n==null?0:Wu(n);if(i<0){i=ib(r+i,0)}return Wg(t,Xt(e),i)}var Wr=rb(sb);function zt(t){return t&&t.length?t[0]:void 0}function ab(t,e){var n=-1,r=ln(t)?Array(t.length):[];br(t,function(i,s,a){r[++n]=e(i,s,a)});return r}function W(t,e){var n=oe(t)?Uu:ab;return n(t,Xt(e))}function kt(t,e){return vp(W(t,e))}var ob=Object.prototype;var lb=ob.hasOwnProperty;var ub=Yw(function(t,e,n){if(lb.call(t,n)){t[n].push(e)}else{cp(t,n,[e])}});var cb=Object.prototype;var db=cb.hasOwnProperty;function fb(t,e){return t!=null&&db.call(t,e)}function Q(t,e){return t!=null&&cI(t,e,fb)}var pb="[object String]";function vt(t){return typeof t=="string"||!oe(t)&&Vt(t)&&Jn(t)==pb}function mb(t,e){return Uu(e,function(n){return t[n]})}function qe(t){return t==null?[]:mb(t,Wt(t))}var hb=Math.max;function ht(t,e,n,r){t=ln(t)?t:qe(t);n=n&&true?Wu(n):0;var i=t.length;if(n<0){n=hb(i+n,0)}return vt(t)?n<=i&&t.indexOf(e,n)>-1:!!i&&up(t,e,n)>-1}function Mm(t,e,n){var r=t==null?0:t.length;if(!r){return-1}var i=0;return up(t,e,i)}var yb="[object Map]";var gb="[object Set]";var Ib=Object.prototype;var vb=Ib.hasOwnProperty;function ye(t){if(t==null){return true}if(ln(t)&&(oe(t)||typeof t=="string"||typeof t.splice=="function"||Ps(t)||mp(t)||qu(t))){return!t.length}var e=Lt(t);if(e==yb||e==gb){return!t.size}if(Qs(t)){return!Yg(t).length}for(var n in t){if(vb.call(t,n)){return false}}return true}var Rb="[object RegExp]";function Eb(t){return Vt(t)&&Jn(t)==Rb}var Sm=jn&&jn.isRegExp;var Dn=Sm?ju(Sm):Eb;function On(t){return t===void 0}function $b(t,e){return t<e}function Tb(t,e,n){var r=-1,i=t.length;while(++r<i){var s=t[r],a=e(s);if(a!=null&&(o===void 0?a===a&&!Ys(a):n(a,o))){var o=a,l=s}}return l}function Cb(t){return t&&t.length?Tb(t,Ir,$b):void 0}var wb="Expected a function";function bb(t){if(typeof t!="function"){throw new TypeError(wb)}return function(){var e=arguments;switch(e.length){case 0:return!t.call(this);case 1:return!t.call(this,e[0]);case 2:return!t.call(this,e[0],e[1]);case 3:return!t.call(this,e[0],e[1],e[2])}return!t.apply(this,e)}}function Ab(t,e,n,r){if(!Ut(t)){return t}e=Xu(e,t);var i=-1,s=e.length,a=s-1,o=t;while(o!=null&&++i<s){var l=Zs(e[i]),u=n;if(l==="__proto__"||l==="constructor"||l==="prototype"){return t}if(i!=a){var c=o[l];u=void 0;if(u===void 0){u=Ut(c)?c:Gu(e[i+1])?[]:{}}}Hu(o,l,u);o=o[l]}return t}function Mb(t,e,n){var r=-1,i=e.length,s={};while(++r<i){var a=e[r],o=gp(t,a);if(n(o,a)){Ab(s,Xu(a,t),o)}}return s}function Yt(t,e){if(t==null){return{}}var n=Uu(qT(t),function(r){return[r]});e=Xt(e);return Mb(t,n,function(r,i){return e(r,i[0])})}function Sb(t,e,n,r,i){i(t,function(s,a,o){n=r?(r=false,s):e(n,s,a,o)});return n}function ft(t,e,n){var r=oe(t)?NT:Sb,i=arguments.length<3;return r(t,Xt(e),n,i,br)}function Ju(t,e){var n=oe(t)?Rp:fI;return n(t,bb(Xt(e)))}function Nb(t,e){var n;br(t,function(r,i,s){n=e(r,i,s);return!n});return!!n}function pI(t,e,n){var r=oe(t)?aI:Nb;return r(t,Xt(e))}var kb=1/0;var Pb=!(Lr&&1/Tp(new Lr([,-0]))[1]==kb)?He:function(t){return new Lr(t)};var Db=200;function mI(t,e,n){var r=-1,i=Gg,s=t.length,a=true,o=[],l=o;if(s>=Db){var u=e?null:Pb(t);if(u){return Tp(u)}a=false;i=$p;l=new Kr}else{l=e?[]:o}e:while(++r<s){var c=t[r],d=e?e(c):c;c=c!==0?c:0;if(a&&d===d){var f=l.length;while(f--){if(l[f]===d){continue e}}if(e){l.push(d)}o.push(c)}else if(!i(l,d,n)){if(l!==o){l.push(d)}o.push(c)}}return o}function bp(t){return t&&t.length?mI(t):[]}function Ob(t,e){return t&&t.length?mI(t,Xt(e)):[]}function xd(t){if(console&&console.error){console.error(`Error: ${t}`)}}function hI(t){if(console&&console.warn){console.warn(`Warning: ${t}`)}}function yI(t){const e=new Date().getTime();const n=t();const r=new Date().getTime();const i=r-e;return{time:i,value:n}}function gI(t){function e(){}e.prototype=t;const n=new e;function r(){return typeof n.bar}r();r();return t}function _b(t){if(Bb(t)){return t.LABEL}else{return t.name}}function Bb(t){return vt(t.LABEL)&&t.LABEL!==""}class un{get definition(){return this._definition}set definition(e){this._definition=e}constructor(e){this._definition=e}accept(e){e.visit(this);X(this.definition,n=>{n.accept(e)})}}class pt extends un{constructor(e){super([]);this.idx=1;Pt(this,Yt(e,n=>n!==void 0))}set definition(e){}get definition(){if(this.referencedRule!==void 0){return this.referencedRule.definition}return[]}accept(e){e.visit(this)}}class Yr extends un{constructor(e){super(e.definition);this.orgText="";Pt(this,Yt(e,n=>n!==void 0))}}class Rt extends un{constructor(e){super(e.definition);this.ignoreAmbiguities=false;Pt(this,Yt(e,n=>n!==void 0))}}class et extends un{constructor(e){super(e.definition);this.idx=1;Pt(this,Yt(e,n=>n!==void 0))}}class Ot extends un{constructor(e){super(e.definition);this.idx=1;Pt(this,Yt(e,n=>n!==void 0))}}class _t extends un{constructor(e){super(e.definition);this.idx=1;Pt(this,Yt(e,n=>n!==void 0))}}class ke extends un{constructor(e){super(e.definition);this.idx=1;Pt(this,Yt(e,n=>n!==void 0))}}class Et extends un{constructor(e){super(e.definition);this.idx=1;Pt(this,Yt(e,n=>n!==void 0))}}class $t extends un{get definition(){return this._definition}set definition(e){this._definition=e}constructor(e){super(e.definition);this.idx=1;this.ignoreAmbiguities=false;this.hasPredicates=false;Pt(this,Yt(e,n=>n!==void 0))}}class Ee{constructor(e){this.idx=1;Pt(this,Yt(e,n=>n!==void 0))}accept(e){e.visit(this)}}function Lb(t){return W(t,Kl)}function Kl(t){function e(n){return W(n,Kl)}if(t instanceof pt){const n={type:"NonTerminal",name:t.nonTerminalName,idx:t.idx};if(vt(t.label)){n.label=t.label}return n}else if(t instanceof Rt){return{type:"Alternative",definition:e(t.definition)}}else if(t instanceof et){return{type:"Option",idx:t.idx,definition:e(t.definition)}}else if(t instanceof Ot){return{type:"RepetitionMandatory",idx:t.idx,definition:e(t.definition)}}else if(t instanceof _t){return{type:"RepetitionMandatoryWithSeparator",idx:t.idx,separator:Kl(new Ee({terminalType:t.separator})),definition:e(t.definition)}}else if(t instanceof Et){return{type:"RepetitionWithSeparator",idx:t.idx,separator:Kl(new Ee({terminalType:t.separator})),definition:e(t.definition)}}else if(t instanceof ke){return{type:"Repetition",idx:t.idx,definition:e(t.definition)}}else if(t instanceof $t){return{type:"Alternation",idx:t.idx,definition:e(t.definition)}}else if(t instanceof Ee){const n={type:"Terminal",name:t.terminalType.name,label:_b(t.terminalType),idx:t.idx};if(vt(t.label)){n.terminalLabel=t.label}const r=t.terminalType.PATTERN;if(t.terminalType.PATTERN){n.pattern=Dn(r)?r.source:r}return n}else if(t instanceof Yr){return{type:"Rule",name:t.name,orgText:t.orgText,definition:e(t.definition)}}else{throw Error("non exhaustive match")}}class Jr{visit(e){const n=e;switch(n.constructor){case pt:return this.visitNonTerminal(n);case Rt:return this.visitAlternative(n);case et:return this.visitOption(n);case Ot:return this.visitRepetitionMandatory(n);case _t:return this.visitRepetitionMandatoryWithSeparator(n);case Et:return this.visitRepetitionWithSeparator(n);case ke:return this.visitRepetition(n);case $t:return this.visitAlternation(n);case Ee:return this.visitTerminal(n);case Yr:return this.visitRule(n);default:throw Error("non exhaustive match")}}visitNonTerminal(e){}visitAlternative(e){}visitOption(e){}visitRepetition(e){}visitRepetitionMandatory(e){}visitRepetitionMandatoryWithSeparator(e){}visitRepetitionWithSeparator(e){}visitAlternation(e){}visitTerminal(e){}visitRule(e){}}function xb(t){return t instanceof Rt||t instanceof et||t instanceof ke||t instanceof Ot||t instanceof _t||t instanceof Et||t instanceof Ee||t instanceof Yr}function cu(t,e=[]){const n=t instanceof et||t instanceof ke||t instanceof Et;if(n){return true}if(t instanceof $t){return pI(t.definition,r=>{return cu(r,e)})}else if(t instanceof pt&&ht(e,t)){return false}else if(t instanceof un){if(t instanceof pt){e.push(t)}return qt(t.definition,r=>{return cu(r,e)})}else{return false}}function Fb(t){return t instanceof $t}function en(t){if(t instanceof pt){return"SUBRULE"}else if(t instanceof et){return"OPTION"}else if(t instanceof $t){return"OR"}else if(t instanceof Ot){return"AT_LEAST_ONE"}else if(t instanceof _t){return"AT_LEAST_ONE_SEP"}else if(t instanceof Et){return"MANY_SEP"}else if(t instanceof ke){return"MANY"}else if(t instanceof Ee){return"CONSUME"}else{throw Error("non exhaustive match")}}class Qu{walk(e,n=[]){X(e.definition,(r,i)=>{const s=Ye(e.definition,i+1);if(r instanceof pt){this.walkProdRef(r,s,n)}else if(r instanceof Ee){this.walkTerminal(r,s,n)}else if(r instanceof Rt){this.walkFlat(r,s,n)}else if(r instanceof et){this.walkOption(r,s,n)}else if(r instanceof Ot){this.walkAtLeastOne(r,s,n)}else if(r instanceof _t){this.walkAtLeastOneSep(r,s,n)}else if(r instanceof Et){this.walkManySep(r,s,n)}else if(r instanceof ke){this.walkMany(r,s,n)}else if(r instanceof $t){this.walkOr(r,s,n)}else{throw Error("non exhaustive match")}})}walkTerminal(e,n,r){}walkProdRef(e,n,r){}walkFlat(e,n,r){const i=n.concat(r);this.walk(e,i)}walkOption(e,n,r){const i=n.concat(r);this.walk(e,i)}walkAtLeastOne(e,n,r){const i=[new et({definition:e.definition})].concat(n,r);this.walk(e,i)}walkAtLeastOneSep(e,n,r){const i=Nm(e,n,r);this.walk(e,i)}walkMany(e,n,r){const i=[new et({definition:e.definition})].concat(n,r);this.walk(e,i)}walkManySep(e,n,r){const i=Nm(e,n,r);this.walk(e,i)}walkOr(e,n,r){const i=n.concat(r);X(e.definition,s=>{const a=new Rt({definition:[s]});this.walk(a,i)})}}function Nm(t,e,n){const r=[new et({definition:[new Ee({terminalType:t.separator})].concat(t.definition)})];const i=r.concat(e,n);return i}function ta(t){if(t instanceof pt){return ta(t.referencedRule)}else if(t instanceof Ee){return Wb(t)}else if(xb(t)){return Kb(t)}else if(Fb(t)){return Ub(t)}else{throw Error("non exhaustive match")}}function Kb(t){let e=[];const n=t.definition;let r=0;let i=n.length>r;let s;let a=true;while(i&&a){s=n[r];a=cu(s);e=e.concat(ta(s));r=r+1;i=n.length>r}return bp(e)}function Ub(t){const e=W(t.definition,n=>{return ta(n)});return bp(Ft(e))}function Wb(t){return[t.terminalType]}const II="_~IN~_";class Gb extends Qu{constructor(e){super();this.topProd=e;this.follows={}}startWalking(){this.walk(this.topProd);return this.follows}walkTerminal(e,n,r){}walkProdRef(e,n,r){const i=qb(e.referencedRule,e.idx)+this.topProd.name;const s=n.concat(r);const a=new Rt({definition:s});const o=ta(a);this.follows[i]=o}}function Hb(t){const e={};X(t,n=>{const r=new Gb(n).startWalking();Pt(e,r)});return e}function qb(t,e){return t.name+e+II}let Ul={};const jb=new Mg;function Zu(t){const e=t.toString();if(Ul.hasOwnProperty(e)){return Ul[e]}else{const n=jb.pattern(e);Ul[e]=n;return n}}function Vb(){Ul={}}const vI="Complement Sets are not supported for first char optimization";const du='Unable to use "first char" lexer optimizations:\n';function zb(t,e=false){try{const n=Zu(t);const r=Fd(n.value,{},n.flags.ignoreCase);return r}catch(n){if(n.message===vI){if(e){hI(`${du}	Unable to optimize: < ${t.toString()} >
	Complement Sets cannot be automatically optimized.
	This will disable the lexer's first char optimizations.
	See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#COMPLEMENT for details.`)}}else{let r="";if(e){r="\n	This will disable the lexer's first char optimizations.\n	See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#REGEXP_PARSING for details."}xd(`${du}
	Failed parsing: < ${t.toString()} >
	Using the @chevrotain/regexp-to-ast library
	Please open an issue at: https://github.com/chevrotain/chevrotain/issues`+r)}}return[]}function Fd(t,e,n){switch(t.type){case"Disjunction":for(let i=0;i<t.value.length;i++){Fd(t.value[i],e,n)}break;case"Alternative":const r=t.value;for(let i=0;i<r.length;i++){const s=r[i];switch(s.type){case"EndAnchor":case"GroupBackReference":case"Lookahead":case"NegativeLookahead":case"StartAnchor":case"WordBoundary":case"NonWordBoundary":continue}const a=s;switch(a.type){case"Character":Da(a.value,e,n);break;case"Set":if(a.complement===true){throw Error(vI)}X(a.value,l=>{if(typeof l==="number"){Da(l,e,n)}else{const u=l;if(n===true){for(let c=u.from;c<=u.to;c++){Da(c,e,n)}}else{for(let c=u.from;c<=u.to&&c<ps;c++){Da(c,e,n)}if(u.to>=ps){const c=u.from>=ps?u.from:ps;const d=u.to;const f=Vn(c);const p=Vn(d);for(let y=f;y<=p;y++){e[y]=y}}}}});break;case"Group":Fd(a.value,e,n);break;default:throw Error("Non Exhaustive Match")}const o=a.quantifier!==void 0&&a.quantifier.atLeast===0;if(a.type==="Group"&&Kd(a)===false||a.type!=="Group"&&o===false){break}}break;default:throw Error("non exhaustive match!")}return qe(e)}function Da(t,e,n){const r=Vn(t);e[r]=r;if(n===true){Xb(t,e)}}function Xb(t,e){const n=String.fromCharCode(t);const r=n.toUpperCase();if(r!==n){const i=Vn(r.charCodeAt(0));e[i]=i}else{const i=n.toLowerCase();if(i!==n){const s=Vn(i.charCodeAt(0));e[s]=s}}}function km(t,e){return Wr(t.value,n=>{if(typeof n==="number"){return ht(e,n)}else{const r=n;return Wr(e,i=>r.from<=i&&i<=r.to)!==void 0}})}function Kd(t){const e=t.quantifier;if(e&&e.atLeast===0){return true}if(!t.value){return false}return oe(t.value)?qt(t.value,Kd):Kd(t.value)}class Yb extends Lu{constructor(e){super();this.targetCharCodes=e;this.found=false}visitChildren(e){if(this.found===true){return}switch(e.type){case"Lookahead":this.visitLookahead(e);return;case"NegativeLookahead":this.visitNegativeLookahead(e);return}super.visitChildren(e)}visitCharacter(e){if(ht(this.targetCharCodes,e.value)){this.found=true}}visitSet(e){if(e.complement){if(km(e,this.targetCharCodes)===void 0){this.found=true}}else{if(km(e,this.targetCharCodes)!==void 0){this.found=true}}}}function Ap(t,e){if(e instanceof RegExp){const n=Zu(e);const r=new Yb(t);r.visit(n);return r.found}else{return Wr(e,n=>{return ht(t,n.charCodeAt(0))})!==void 0}}const Rr="PATTERN";const fs="defaultMode";const Oa="modes";let RI=typeof new RegExp("(?:)").sticky==="boolean";function Jb(t,e){e=wp(e,{useSticky:RI,debug:false,safeMode:false,positionTracking:"full",lineTerminatorCharacters:["\r","\n"],tracer:($,C)=>C()});const n=e.tracer;n("initCharCodeToOptimizedIndexMap",()=>{R1()});let r;n("Reject Lexer.NA",()=>{r=Ju(t,$=>{return $[Rr]===It.NA})});let i=false;let s;n("Transform Patterns",()=>{i=false;s=W(r,$=>{const C=$[Rr];if(Dn(C)){const O=C.source;if(O.length===1&&O!=="^"&&O!=="$"&&O!=="."&&!C.ignoreCase){return O}else if(O.length===2&&O[0]==="\\"&&!ht(["d","D","s","S","t","r","n","t","0","c","b","B","f","v","w","W"],O[1])){return O[1]}else{return e.useSticky?Dm(C):Pm(C)}}else if(Ln(C)){i=true;return{exec:C}}else if(typeof C==="object"){i=true;return C}else if(typeof C==="string"){if(C.length===1){return C}else{const O=C.replace(/[\\^$.*+?()[\]{}|]/g,"\\$&");const Y=new RegExp(O);return e.useSticky?Dm(Y):Pm(Y)}}else{throw Error("non exhaustive match")}})});let a;let o;let l;let u;let c;n("misc mapping",()=>{a=W(r,$=>$.tokenTypeIdx);o=W(r,$=>{const C=$.GROUP;if(C===It.SKIPPED){return void 0}else if(vt(C)){return C}else if(On(C)){return false}else{throw Error("non exhaustive match")}});l=W(r,$=>{const C=$.LONGER_ALT;if(C){const O=oe(C)?W(C,Y=>Mm(r,Y)):[Mm(r,C)];return O}});u=W(r,$=>$.PUSH_MODE);c=W(r,$=>Q($,"POP_MODE"))});let d;n("Line Terminator Handling",()=>{const $=TI(e.lineTerminatorCharacters);d=W(r,C=>false);if(e.positionTracking!=="onlyOffset"){d=W(r,C=>{if(Q(C,"LINE_BREAKS")){return!!C.LINE_BREAKS}else{return $I(C,$)===false&&Ap($,C.PATTERN)}})}});let f;let p;let y;let R;n("Misc Mapping #2",()=>{f=W(r,EI);p=W(s,g1);y=ft(r,($,C)=>{const O=C.GROUP;if(vt(O)&&!(O===It.SKIPPED)){$[O]=[]}return $},{});R=W(s,($,C)=>{return{pattern:s[C],longerAlt:l[C],canLineTerminator:d[C],isCustom:f[C],short:p[C],group:o[C],push:u[C],pop:c[C],tokenTypeIdx:a[C],tokenType:r[C]}})});let A=true;let v=[];if(!e.safeMode){n("First Char Optimization",()=>{v=ft(r,($,C,O)=>{if(typeof C.PATTERN==="string"){const Y=C.PATTERN.charCodeAt(0);const G=Vn(Y);yc($,G,R[O])}else if(oe(C.START_CHARS_HINT)){let Y;X(C.START_CHARS_HINT,G=>{const J=typeof G==="string"?G.charCodeAt(0):G;const te=Vn(J);if(Y!==te){Y=te;yc($,te,R[O])}})}else if(Dn(C.PATTERN)){if(C.PATTERN.unicode){A=false;if(e.ensureOptimizations){xd(`${du}	Unable to analyze < ${C.PATTERN.toString()} > pattern.
	The regexp unicode flag is not currently supported by the regexp-to-ast library.
	This will disable the lexer's first char optimizations.
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#UNICODE_OPTIMIZE`)}}else{const Y=zb(C.PATTERN,e.ensureOptimizations);if(ye(Y)){A=false}X(Y,G=>{yc($,G,R[O])})}}else{if(e.ensureOptimizations){xd(`${du}	TokenType: <${C.name}> is using a custom token pattern without providing <start_chars_hint> parameter.
	This will disable the lexer's first char optimizations.
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#CUSTOM_OPTIMIZE`)}A=false}return $},[])})}return{emptyGroups:y,patternIdxToConfig:R,charCodeToPatternIdxToConfig:v,hasCustom:i,canBeOptimized:A}}function Qb(t,e){let n=[];const r=e1(t);n=n.concat(r.errors);const i=t1(r.valid);const s=i.valid;n=n.concat(i.errors);n=n.concat(Zb(s));n=n.concat(u1(s));n=n.concat(c1(s,e));n=n.concat(d1(s));return n}function Zb(t){let e=[];const n=Dt(t,r=>Dn(r[Rr]));e=e.concat(r1(n));e=e.concat(a1(n));e=e.concat(o1(n));e=e.concat(l1(n));e=e.concat(i1(n));return e}function e1(t){const e=Dt(t,i=>{return!Q(i,Rr)});const n=W(e,i=>{return{message:"Token Type: ->"+i.name+"<- missing static 'PATTERN' property",type:Pe.MISSING_PATTERN,tokenTypes:[i]}});const r=Yu(t,e);return{errors:n,valid:r}}function t1(t){const e=Dt(t,i=>{const s=i[Rr];return!Dn(s)&&!Ln(s)&&!Q(s,"exec")&&!vt(s)});const n=W(e,i=>{return{message:"Token Type: ->"+i.name+"<- static 'PATTERN' can only be a RegExp, a Function matching the {CustomPatternMatcherFunc} type or an Object matching the {ICustomPattern} interface.",type:Pe.INVALID_PATTERN,tokenTypes:[i]}});const r=Yu(t,e);return{errors:n,valid:r}}const n1=/[^\\][$]/;function r1(t){class e extends Lu{constructor(){super(...arguments);this.found=false}visitEndAnchor(s){this.found=true}}const n=Dt(t,i=>{const s=i.PATTERN;try{const a=Zu(s);const o=new e;o.visit(a);return o.found}catch(a){return n1.test(s.source)}});const r=W(n,i=>{return{message:"Unexpected RegExp Anchor Error:\n	Token Type: ->"+i.name+"<- static 'PATTERN' cannot contain end of input anchor '$'\n	See chevrotain.io/docs/guide/resolving_lexer_errors.html#ANCHORS	for details.",type:Pe.EOI_ANCHOR_FOUND,tokenTypes:[i]}});return r}function i1(t){const e=Dt(t,r=>{const i=r.PATTERN;return i.test("")});const n=W(e,r=>{return{message:"Token Type: ->"+r.name+"<- static 'PATTERN' must not match an empty string",type:Pe.EMPTY_MATCH_PATTERN,tokenTypes:[r]}});return n}const s1=/[^\\[][\^]|^\^/;function a1(t){class e extends Lu{constructor(){super(...arguments);this.found=false}visitStartAnchor(s){this.found=true}}const n=Dt(t,i=>{const s=i.PATTERN;try{const a=Zu(s);const o=new e;o.visit(a);return o.found}catch(a){return s1.test(s.source)}});const r=W(n,i=>{return{message:"Unexpected RegExp Anchor Error:\n	Token Type: ->"+i.name+"<- static 'PATTERN' cannot contain start of input anchor '^'\n	See https://chevrotain.io/docs/guide/resolving_lexer_errors.html#ANCHORS	for details.",type:Pe.SOI_ANCHOR_FOUND,tokenTypes:[i]}});return r}function o1(t){const e=Dt(t,r=>{const i=r[Rr];return i instanceof RegExp&&(i.multiline||i.global)});const n=W(e,r=>{return{message:"Token Type: ->"+r.name+"<- static 'PATTERN' may NOT contain global('g') or multiline('m')",type:Pe.UNSUPPORTED_FLAGS_FOUND,tokenTypes:[r]}});return n}function l1(t){const e=[];let n=W(t,s=>{return ft(t,(a,o)=>{if(s.PATTERN.source===o.PATTERN.source&&!ht(e,o)&&o.PATTERN!==It.NA){e.push(o);a.push(o);return a}return a},[])});n=ea(n);const r=Dt(n,s=>{return s.length>1});const i=W(r,s=>{const a=W(s,l=>{return l.name});const o=zt(s).PATTERN;return{message:`The same RegExp pattern ->${o}<-has been used in all of the following Token Types: ${a.join(", ")} <-`,type:Pe.DUPLICATE_PATTERNS_FOUND,tokenTypes:s}});return i}function u1(t){const e=Dt(t,r=>{if(!Q(r,"GROUP")){return false}const i=r.GROUP;return i!==It.SKIPPED&&i!==It.NA&&!vt(i)});const n=W(e,r=>{return{message:"Token Type: ->"+r.name+"<- static 'GROUP' can only be Lexer.SKIPPED/Lexer.NA/A String",type:Pe.INVALID_GROUP_TYPE_FOUND,tokenTypes:[r]}});return n}function c1(t,e){const n=Dt(t,i=>{return i.PUSH_MODE!==void 0&&!ht(e,i.PUSH_MODE)});const r=W(n,i=>{const s=`Token Type: ->${i.name}<- static 'PUSH_MODE' value cannot refer to a Lexer Mode ->${i.PUSH_MODE}<-which does not exist`;return{message:s,type:Pe.PUSH_MODE_DOES_NOT_EXIST,tokenTypes:[i]}});return r}function d1(t){const e=[];const n=ft(t,(r,i,s)=>{const a=i.PATTERN;if(a===It.NA){return r}if(vt(a)){r.push({str:a,idx:s,tokenType:i})}else if(Dn(a)&&p1(a)){r.push({str:a.source,idx:s,tokenType:i})}return r},[]);X(t,(r,i)=>{X(n,({str:s,idx:a,tokenType:o})=>{if(i<a&&f1(s,r.PATTERN)){const l=`Token: ->${o.name}<- can never be matched.
Because it appears AFTER the Token Type ->${r.name}<-in the lexer's definition.
See https://chevrotain.io/docs/guide/resolving_lexer_errors.html#UNREACHABLE`;e.push({message:l,type:Pe.UNREACHABLE_PATTERN,tokenTypes:[r,o]})}})});return e}function f1(t,e){if(Dn(e)){const n=e.exec(t);return n!==null&&n.index===0}else if(Ln(e)){return e(t,0,[],{})}else if(Q(e,"exec")){return e.exec(t,0,[],{})}else if(typeof e==="string"){return e===t}else{throw Error("non exhaustive match")}}function p1(t){const e=[".","\\","[","]","|","^","$","(",")","?","*","+","{"];return Wr(e,n=>t.source.indexOf(n)!==-1)===void 0}function Pm(t){const e=t.ignoreCase?"i":"";return new RegExp(`^(?:${t.source})`,e)}function Dm(t){const e=t.ignoreCase?"iy":"y";return new RegExp(`${t.source}`,e)}function m1(t,e,n){const r=[];if(!Q(t,fs)){r.push({message:"A MultiMode Lexer cannot be initialized without a <"+fs+"> property in its definition\n",type:Pe.MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE})}if(!Q(t,Oa)){r.push({message:"A MultiMode Lexer cannot be initialized without a <"+Oa+"> property in its definition\n",type:Pe.MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY})}if(Q(t,Oa)&&Q(t,fs)&&!Q(t.modes,t.defaultMode)){r.push({message:`A MultiMode Lexer cannot be initialized with a ${fs}: <${t.defaultMode}>which does not exist
`,type:Pe.MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST})}if(Q(t,Oa)){X(t.modes,(i,s)=>{X(i,(a,o)=>{if(On(a)){r.push({message:`A Lexer cannot be initialized using an undefined Token Type. Mode:<${s}> at index: <${o}>
`,type:Pe.LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED})}else if(Q(a,"LONGER_ALT")){const l=oe(a.LONGER_ALT)?a.LONGER_ALT:[a.LONGER_ALT];X(l,u=>{if(!On(u)&&!ht(i,u)){r.push({message:`A MultiMode Lexer cannot be initialized with a longer_alt <${u.name}> on token <${a.name}> outside of mode <${s}>
`,type:Pe.MULTI_MODE_LEXER_LONGER_ALT_NOT_IN_CURRENT_MODE})}})}})})}return r}function h1(t,e,n){const r=[];let i=false;const s=ea(Ft(qe(t.modes)));const a=Ju(s,l=>l[Rr]===It.NA);const o=TI(n);if(e){X(a,l=>{const u=$I(l,o);if(u!==false){const c=v1(l,u);const d={message:c,type:u.issue,tokenType:l};r.push(d)}else{if(Q(l,"LINE_BREAKS")){if(l.LINE_BREAKS===true){i=true}}else{if(Ap(o,l.PATTERN)){i=true}}}})}if(e&&!i){r.push({message:"Warning: No LINE_BREAKS Found.\n	This Lexer has been defined to track line and column information,\n	But none of the Token Types can be identified as matching a line terminator.\n	See https://chevrotain.io/docs/guide/resolving_lexer_errors.html#LINE_BREAKS \n	for details.",type:Pe.NO_LINE_BREAKS_FLAGS})}return r}function y1(t){const e={};const n=Wt(t);X(n,r=>{const i=t[r];if(oe(i)){e[r]=[]}else{throw Error("non exhaustive match")}});return e}function EI(t){const e=t.PATTERN;if(Dn(e)){return false}else if(Ln(e)){return true}else if(Q(e,"exec")){return true}else if(vt(e)){return false}else{throw Error("non exhaustive match")}}function g1(t){if(vt(t)&&t.length===1){return t.charCodeAt(0)}else{return false}}const I1={test:function(t){const e=t.length;for(let n=this.lastIndex;n<e;n++){const r=t.charCodeAt(n);if(r===10){this.lastIndex=n+1;return true}else if(r===13){if(t.charCodeAt(n+1)===10){this.lastIndex=n+2}else{this.lastIndex=n+1}return true}}return false},lastIndex:0};function $I(t,e){if(Q(t,"LINE_BREAKS")){return false}else{if(Dn(t.PATTERN)){try{Ap(e,t.PATTERN)}catch(n){return{issue:Pe.IDENTIFY_TERMINATOR,errMsg:n.message}}return false}else if(vt(t.PATTERN)){return false}else if(EI(t)){return{issue:Pe.CUSTOM_LINE_BREAK}}else{throw Error("non exhaustive match")}}}function v1(t,e){if(e.issue===Pe.IDENTIFY_TERMINATOR){return`Warning: unable to identify line terminator usage in pattern.
	The problem is in the <${t.name}> Token Type
	 Root cause: ${e.errMsg}.
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#IDENTIFY_TERMINATOR`}else if(e.issue===Pe.CUSTOM_LINE_BREAK){return`Warning: A Custom Token Pattern should specify the <line_breaks> option.
	The problem is in the <${t.name}> Token Type
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#CUSTOM_LINE_BREAK`}else{throw Error("non exhaustive match")}}function TI(t){const e=W(t,n=>{if(vt(n)){return n.charCodeAt(0)}else{return n}});return e}function yc(t,e,n){if(t[e]===void 0){t[e]=[n]}else{t[e].push(n)}}const ps=256;let Wl=[];function Vn(t){return t<ps?t:Wl[t]}function R1(){if(ye(Wl)){Wl=new Array(65536);for(let t=0;t<65536;t++){Wl[t]=t>255?255+~~(t/255):t}}}function na(t,e){const n=t.tokenTypeIdx;if(n===e.tokenTypeIdx){return true}else{return e.isParent===true&&e.categoryMatchesMap[n]===true}}function fu(t,e){return t.tokenTypeIdx===e.tokenTypeIdx}let Om=1;const CI={};function ra(t){const e=E1(t);$1(e);C1(e);T1(e);X(e,n=>{n.isParent=n.categoryMatches.length>0})}function E1(t){let e=tt(t);let n=t;let r=true;while(r){n=ea(Ft(W(n,s=>s.CATEGORIES)));const i=Yu(n,e);e=e.concat(i);if(ye(i)){r=false}else{n=i}}return e}function $1(t){X(t,e=>{if(!bI(e)){CI[Om]=e;e.tokenTypeIdx=Om++}if(_m(e)&&!oe(e.CATEGORIES)){e.CATEGORIES=[e.CATEGORIES]}if(!_m(e)){e.CATEGORIES=[]}if(!w1(e)){e.categoryMatches=[]}if(!b1(e)){e.categoryMatchesMap={}}})}function T1(t){X(t,e=>{e.categoryMatches=[];X(e.categoryMatchesMap,(n,r)=>{e.categoryMatches.push(CI[r].tokenTypeIdx)})})}function C1(t){X(t,e=>{wI([],e)})}function wI(t,e){X(t,n=>{e.categoryMatchesMap[n.tokenTypeIdx]=true});X(e.CATEGORIES,n=>{const r=t.concat(e);if(!ht(r,n)){wI(r,n)}})}function bI(t){return Q(t,"tokenTypeIdx")}function _m(t){return Q(t,"CATEGORIES")}function w1(t){return Q(t,"categoryMatches")}function b1(t){return Q(t,"categoryMatchesMap")}function A1(t){return Q(t,"tokenTypeIdx")}const Ud={buildUnableToPopLexerModeMessage(t){return`Unable to pop Lexer Mode after encountering Token ->${t.image}<- The Mode Stack is empty`},buildUnexpectedCharactersMessage(t,e,n,r,i){return`unexpected character: ->${t.charAt(e)}<- at offset: ${e}, skipped ${n} characters.`}};var Pe;(function(t){t[t["MISSING_PATTERN"]=0]="MISSING_PATTERN";t[t["INVALID_PATTERN"]=1]="INVALID_PATTERN";t[t["EOI_ANCHOR_FOUND"]=2]="EOI_ANCHOR_FOUND";t[t["UNSUPPORTED_FLAGS_FOUND"]=3]="UNSUPPORTED_FLAGS_FOUND";t[t["DUPLICATE_PATTERNS_FOUND"]=4]="DUPLICATE_PATTERNS_FOUND";t[t["INVALID_GROUP_TYPE_FOUND"]=5]="INVALID_GROUP_TYPE_FOUND";t[t["PUSH_MODE_DOES_NOT_EXIST"]=6]="PUSH_MODE_DOES_NOT_EXIST";t[t["MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE"]=7]="MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE";t[t["MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY"]=8]="MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY";t[t["MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST"]=9]="MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST";t[t["LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED"]=10]="LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED";t[t["SOI_ANCHOR_FOUND"]=11]="SOI_ANCHOR_FOUND";t[t["EMPTY_MATCH_PATTERN"]=12]="EMPTY_MATCH_PATTERN";t[t["NO_LINE_BREAKS_FLAGS"]=13]="NO_LINE_BREAKS_FLAGS";t[t["UNREACHABLE_PATTERN"]=14]="UNREACHABLE_PATTERN";t[t["IDENTIFY_TERMINATOR"]=15]="IDENTIFY_TERMINATOR";t[t["CUSTOM_LINE_BREAK"]=16]="CUSTOM_LINE_BREAK";t[t["MULTI_MODE_LEXER_LONGER_ALT_NOT_IN_CURRENT_MODE"]=17]="MULTI_MODE_LEXER_LONGER_ALT_NOT_IN_CURRENT_MODE"})(Pe||(Pe={}));const ms={deferDefinitionErrorsHandling:false,positionTracking:"full",lineTerminatorsPattern:/\n|\r\n?/g,lineTerminatorCharacters:["\n","\r"],ensureOptimizations:false,safeMode:false,errorMessageProvider:Ud,traceInitPerf:false,skipValidations:false,recoveryEnabled:true};Object.freeze(ms);class It{constructor(e,n=ms){this.lexerDefinition=e;this.lexerDefinitionErrors=[];this.lexerDefinitionWarning=[];this.patternIdxToConfig={};this.charCodeToPatternIdxToConfig={};this.modes=[];this.emptyGroups={};this.trackStartLines=true;this.trackEndLines=true;this.hasCustom=false;this.canModeBeOptimized={};this.TRACE_INIT=(i,s)=>{if(this.traceInitPerf===true){this.traceInitIndent++;const a=new Array(this.traceInitIndent+1).join("	");if(this.traceInitIndent<this.traceInitMaxIdent){console.log(`${a}--> <${i}>`)}const{time:o,value:l}=yI(s);const u=o>10?console.warn:console.log;if(this.traceInitIndent<this.traceInitMaxIdent){u(`${a}<-- <${i}> time: ${o}ms`)}this.traceInitIndent--;return l}else{return s()}};if(typeof n==="boolean"){throw Error("The second argument to the Lexer constructor is now an ILexerConfig Object.\na boolean 2nd argument is no longer supported")}this.config=Pt({},ms,n);const r=this.config.traceInitPerf;if(r===true){this.traceInitMaxIdent=Infinity;this.traceInitPerf=true}else if(typeof r==="number"){this.traceInitMaxIdent=r;this.traceInitPerf=true}this.traceInitIndent=-1;this.TRACE_INIT("Lexer Constructor",()=>{let i;let s=true;this.TRACE_INIT("Lexer Config handling",()=>{if(this.config.lineTerminatorsPattern===ms.lineTerminatorsPattern){this.config.lineTerminatorsPattern=I1}else{if(this.config.lineTerminatorCharacters===ms.lineTerminatorCharacters){throw Error("Error: Missing <lineTerminatorCharacters> property on the Lexer config.\n	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#MISSING_LINE_TERM_CHARS")}}if(n.safeMode&&n.ensureOptimizations){throw Error('"safeMode" and "ensureOptimizations" flags are mutually exclusive.')}this.trackStartLines=/full|onlyStart/i.test(this.config.positionTracking);this.trackEndLines=/full/i.test(this.config.positionTracking);if(oe(e)){i={modes:{defaultMode:tt(e)},defaultMode:fs}}else{s=false;i=tt(e)}});if(this.config.skipValidations===false){this.TRACE_INIT("performRuntimeChecks",()=>{this.lexerDefinitionErrors=this.lexerDefinitionErrors.concat(m1(i,this.trackStartLines,this.config.lineTerminatorCharacters))});this.TRACE_INIT("performWarningRuntimeChecks",()=>{this.lexerDefinitionWarning=this.lexerDefinitionWarning.concat(h1(i,this.trackStartLines,this.config.lineTerminatorCharacters))})}i.modes=i.modes?i.modes:{};X(i.modes,(o,l)=>{i.modes[l]=Ju(o,u=>On(u))});const a=Wt(i.modes);X(i.modes,(o,l)=>{this.TRACE_INIT(`Mode: <${l}> processing`,()=>{this.modes.push(l);if(this.config.skipValidations===false){this.TRACE_INIT(`validatePatterns`,()=>{this.lexerDefinitionErrors=this.lexerDefinitionErrors.concat(Qb(o,a))})}if(ye(this.lexerDefinitionErrors)){ra(o);let u;this.TRACE_INIT(`analyzeTokenTypes`,()=>{u=Jb(o,{lineTerminatorCharacters:this.config.lineTerminatorCharacters,positionTracking:n.positionTracking,ensureOptimizations:n.ensureOptimizations,safeMode:n.safeMode,tracer:this.TRACE_INIT})});this.patternIdxToConfig[l]=u.patternIdxToConfig;this.charCodeToPatternIdxToConfig[l]=u.charCodeToPatternIdxToConfig;this.emptyGroups=Pt({},this.emptyGroups,u.emptyGroups);this.hasCustom=u.hasCustom||this.hasCustom;this.canModeBeOptimized[l]=u.canBeOptimized}})});this.defaultMode=i.defaultMode;if(!ye(this.lexerDefinitionErrors)&&!this.config.deferDefinitionErrorsHandling){const o=W(this.lexerDefinitionErrors,u=>{return u.message});const l=o.join("-----------------------\n");throw new Error("Errors detected in definition of Lexer:\n"+l)}X(this.lexerDefinitionWarning,o=>{hI(o.message)});this.TRACE_INIT("Choosing sub-methods implementations",()=>{if(RI){this.chopInput=Ir;this.match=this.matchWithTest}else{this.updateLastIndex=He;this.match=this.matchWithExec}if(s){this.handleModes=He}if(this.trackStartLines===false){this.computeNewColumn=Ir}if(this.trackEndLines===false){this.updateTokenEndLineColumnLocation=He}if(/full/i.test(this.config.positionTracking)){this.createTokenInstance=this.createFullToken}else if(/onlyStart/i.test(this.config.positionTracking)){this.createTokenInstance=this.createStartOnlyToken}else if(/onlyOffset/i.test(this.config.positionTracking)){this.createTokenInstance=this.createOffsetOnlyToken}else{throw Error(`Invalid <positionTracking> config option: "${this.config.positionTracking}"`)}if(this.hasCustom){this.addToken=this.addTokenUsingPush;this.handlePayload=this.handlePayloadWithCustom}else{this.addToken=this.addTokenUsingMemberAccess;this.handlePayload=this.handlePayloadNoCustom}});this.TRACE_INIT("Failed Optimization Warnings",()=>{const o=ft(this.canModeBeOptimized,(l,u,c)=>{if(u===false){l.push(c)}return l},[]);if(n.ensureOptimizations&&!ye(o)){throw Error(`Lexer Modes: < ${o.join(", ")} > cannot be optimized.
	 Disable the "ensureOptimizations" lexer config flag to silently ignore this and run the lexer in an un-optimized mode.
	 Or inspect the console log for details on how to resolve these issues.`)}});this.TRACE_INIT("clearRegExpParserCache",()=>{Vb()});this.TRACE_INIT("toFastProperties",()=>{gI(this)})})}tokenize(e,n=this.defaultMode){if(!ye(this.lexerDefinitionErrors)){const r=W(this.lexerDefinitionErrors,s=>{return s.message});const i=r.join("-----------------------\n");throw new Error("Unable to Tokenize because Errors detected in definition of Lexer:\n"+i)}return this.tokenizeInternal(e,n)}tokenizeInternal(e,n){let r,i,s,a,o,l,u,c,d,f,p,y,R,A,v;const $=e;const C=$.length;let O=0;let Y=0;const G=this.hasCustom?0:Math.floor(e.length/10);const J=new Array(G);const te=[];let ie=this.trackStartLines?1:void 0;let ce=this.trackStartLines?1:void 0;const _=y1(this.emptyGroups);const T=this.trackStartLines;const g=this.config.lineTerminatorsPattern;let M=0;let L=[];let D=[];const B=[];const $e=[];Object.freeze($e);let F;function S(){return L}function ne(pe){const Se=Vn(pe);const We=D[Se];if(We===void 0){return $e}else{return We}}const Tt=pe=>{if(B.length===1&&pe.tokenType.PUSH_MODE===void 0){const Se=this.config.errorMessageProvider.buildUnableToPopLexerModeMessage(pe);te.push({offset:pe.startOffset,line:pe.startLine,column:pe.startColumn,length:pe.image.length,message:Se})}else{B.pop();const Se=Ur(B);L=this.patternIdxToConfig[Se];D=this.charCodeToPatternIdxToConfig[Se];M=L.length;const We=this.canModeBeOptimized[Se]&&this.config.safeMode===false;if(D&&We){F=ne}else{F=S}}};function Ct(pe){B.push(pe);D=this.charCodeToPatternIdxToConfig[pe];L=this.patternIdxToConfig[pe];M=L.length;M=L.length;const Se=this.canModeBeOptimized[pe]&&this.config.safeMode===false;if(D&&Se){F=ne}else{F=S}}Ct.call(this,n);let Te;const wt=this.config.recoveryEnabled;while(O<C){l=null;const pe=$.charCodeAt(O);const Se=F(pe);const We=Se.length;for(r=0;r<We;r++){Te=Se[r];const ge=Te.pattern;u=null;const H=Te.short;if(H!==false){if(pe===H){l=ge}}else if(Te.isCustom===true){v=ge.exec($,O,J,_);if(v!==null){l=v[0];if(v.payload!==void 0){u=v.payload}}else{l=null}}else{this.updateLastIndex(ge,O);l=this.match(ge,e,O)}if(l!==null){o=Te.longerAlt;if(o!==void 0){const I=o.length;for(s=0;s<I;s++){const b=L[o[s]];const q=b.pattern;c=null;if(b.isCustom===true){v=q.exec($,O,J,_);if(v!==null){a=v[0];if(v.payload!==void 0){c=v.payload}}else{a=null}}else{this.updateLastIndex(q,O);a=this.match(q,e,O)}if(a&&a.length>l.length){l=a;u=c;Te=b;break}}}break}}if(l!==null){d=l.length;f=Te.group;if(f!==void 0){p=Te.tokenTypeIdx;y=this.createTokenInstance(l,O,p,Te.tokenType,ie,ce,d);this.handlePayload(y,u);if(f===false){Y=this.addToken(J,Y,y)}else{_[f].push(y)}}e=this.chopInput(e,d);O=O+d;ce=this.computeNewColumn(ce,d);if(T===true&&Te.canLineTerminator===true){let ge=0;let H;let I;g.lastIndex=0;do{H=g.test(l);if(H===true){I=g.lastIndex-1;ge++}}while(H===true);if(ge!==0){ie=ie+ge;ce=d-I;this.updateTokenEndLineColumnLocation(y,f,I,ge,ie,ce,d)}}this.handleModes(Te,Tt,Ct,y)}else{const ge=O;const H=ie;const I=ce;let b=wt===false;while(b===false&&O<C){e=this.chopInput(e,1);O++;for(i=0;i<M;i++){const q=L[i];const w=q.pattern;const de=q.short;if(de!==false){if($.charCodeAt(O)===de){b=true}}else if(q.isCustom===true){b=w.exec($,O,J,_)!==null}else{this.updateLastIndex(w,O);b=w.exec(e)!==null}if(b===true){break}}}R=O-ge;ce=this.computeNewColumn(ce,R);A=this.config.errorMessageProvider.buildUnexpectedCharactersMessage($,ge,R,H,I);te.push({offset:ge,line:H,column:I,length:R,message:A});if(wt===false){break}}}if(!this.hasCustom){J.length=Y}return{tokens:J,groups:_,errors:te}}handleModes(e,n,r,i){if(e.pop===true){const s=e.push;n(i);if(s!==void 0){r.call(this,s)}}else if(e.push!==void 0){r.call(this,e.push)}}chopInput(e,n){return e.substring(n)}updateLastIndex(e,n){e.lastIndex=n}updateTokenEndLineColumnLocation(e,n,r,i,s,a,o){let l,u;if(n!==void 0){l=r===o-1;u=l?-1:0;if(!(i===1&&l===true)){e.endLine=s+u;e.endColumn=a-1+-u}}}computeNewColumn(e,n){return e+n}createOffsetOnlyToken(e,n,r,i){return{image:e,startOffset:n,tokenTypeIdx:r,tokenType:i}}createStartOnlyToken(e,n,r,i,s,a){return{image:e,startOffset:n,startLine:s,startColumn:a,tokenTypeIdx:r,tokenType:i}}createFullToken(e,n,r,i,s,a,o){return{image:e,startOffset:n,endOffset:n+o-1,startLine:s,endLine:s,startColumn:a,endColumn:a+o-1,tokenTypeIdx:r,tokenType:i}}addTokenUsingPush(e,n,r){e.push(r);return n}addTokenUsingMemberAccess(e,n,r){e[n]=r;n++;return n}handlePayloadNoCustom(e,n){}handlePayloadWithCustom(e,n){if(n!==null){e.payload=n}}matchWithTest(e,n,r){const i=e.test(n);if(i===true){return n.substring(r,e.lastIndex)}return null}matchWithExec(e,n){const r=e.exec(n);return r!==null?r[0]:null}}It.SKIPPED="This marks a skipped Token pattern, this means each token identified by it willbe consumed and then thrown into oblivion, this can be used to for example to completely ignore whitespace.";It.NA=/NOT_APPLICABLE/;function xr(t){if(AI(t)){return t.LABEL}else{return t.name}}function AI(t){return vt(t.LABEL)&&t.LABEL!==""}const M1="parent";const Bm="categories";const Lm="label";const xm="group";const Fm="push_mode";const Km="pop_mode";const Um="longer_alt";const Wm="line_breaks";const Gm="start_chars_hint";function MI(t){return S1(t)}function S1(t){const e=t.pattern;const n={};n.name=t.name;if(!On(e)){n.PATTERN=e}if(Q(t,M1)){throw"The parent property is no longer supported.\nSee: https://github.com/chevrotain/chevrotain/issues/564#issuecomment-349062346 for details."}if(Q(t,Bm)){n.CATEGORIES=t[Bm]}ra([n]);if(Q(t,Lm)){n.LABEL=t[Lm]}if(Q(t,xm)){n.GROUP=t[xm]}if(Q(t,Km)){n.POP_MODE=t[Km]}if(Q(t,Fm)){n.PUSH_MODE=t[Fm]}if(Q(t,Um)){n.LONGER_ALT=t[Um]}if(Q(t,Wm)){n.LINE_BREAKS=t[Wm]}if(Q(t,Gm)){n.START_CHARS_HINT=t[Gm]}return n}const zn=MI({name:"EOF",pattern:It.NA});ra([zn]);function Mp(t,e,n,r,i,s,a,o){return{image:e,startOffset:n,endOffset:r,startLine:i,endLine:s,startColumn:a,endColumn:o,tokenTypeIdx:t.tokenTypeIdx,tokenType:t}}function SI(t,e){return na(t,e)}const Br={buildMismatchTokenMessage({expected:t,actual:e,previous:n,ruleName:r}){const i=AI(t);const s=i?`--> ${xr(t)} <--`:`token of type --> ${t.name} <--`;const a=`Expecting ${s} but found --> '${e.image}' <--`;return a},buildNotAllInputParsedMessage({firstRedundant:t,ruleName:e}){return"Redundant input, expecting EOF but found: "+t.image},buildNoViableAltMessage({expectedPathsPerAlt:t,actual:e,previous:n,customUserDescription:r,ruleName:i}){const s="Expecting: ";const a=zt(e).image;const o="\nbut found: '"+a+"'";if(r){return s+r+o}else{const l=ft(t,(f,p)=>f.concat(p),[]);const u=W(l,f=>`[${W(f,p=>xr(p)).join(", ")}]`);const c=W(u,(f,p)=>`  ${p+1}. ${f}`);const d=`one of these possible Token sequences:
${c.join("\n")}`;return s+d+o}},buildEarlyExitMessage({expectedIterationPaths:t,actual:e,customUserDescription:n,ruleName:r}){const i="Expecting: ";const s=zt(e).image;const a="\nbut found: '"+s+"'";if(n){return i+n+a}else{const o=W(t,u=>`[${W(u,c=>xr(c)).join(",")}]`);const l=`expecting at least one iteration which starts with one of these possible Token sequences::
  <${o.join(" ,")}>`;return i+l+a}}};Object.freeze(Br);const N1={buildRuleNotFoundError(t,e){const n="Invalid grammar, reference to a rule which is not defined: ->"+e.nonTerminalName+"<-\ninside top level rule: ->"+t.name+"<-";return n}};const fr={buildDuplicateFoundError(t,e){function n(c){if(c instanceof Ee){return c.terminalType.name}else if(c instanceof pt){return c.nonTerminalName}else{return""}}const r=t.name;const i=zt(e);const s=i.idx;const a=en(i);const o=n(i);const l=s>0;let u=`->${a}${l?s:""}<- ${o?`with argument: ->${o}<-`:""}
                  appears more than once (${e.length} times) in the top level rule: ->${r}<-.                  
                  For further details see: https://chevrotain.io/docs/FAQ.html#NUMERICAL_SUFFIXES 
                  `;u=u.replace(/[ \t]+/g," ");u=u.replace(/\s\s+/g,"\n");return u},buildNamespaceConflictError(t){const e=`Namespace conflict found in grammar.
The grammar has both a Terminal(Token) and a Non-Terminal(Rule) named: <${t.name}>.
To resolve this make sure each Terminal and Non-Terminal names are unique
This is easy to accomplish by using the convention that Terminal names start with an uppercase letter
and Non-Terminal names start with a lower case letter.`;return e},buildAlternationPrefixAmbiguityError(t){const e=W(t.prefixPath,i=>xr(i)).join(", ");const n=t.alternation.idx===0?"":t.alternation.idx;const r=`Ambiguous alternatives: <${t.ambiguityIndices.join(" ,")}> due to common lookahead prefix
in <OR${n}> inside <${t.topLevelRule.name}> Rule,
<${e}> may appears as a prefix path in all these alternatives.
See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#COMMON_PREFIX
For Further details.`;return r},buildAlternationAmbiguityError(t){const e=W(t.prefixPath,i=>xr(i)).join(", ");const n=t.alternation.idx===0?"":t.alternation.idx;let r=`Ambiguous Alternatives Detected: <${t.ambiguityIndices.join(" ,")}> in <OR${n}> inside <${t.topLevelRule.name}> Rule,
<${e}> may appears as a prefix path in all these alternatives.
`;r=r+`See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#AMBIGUOUS_ALTERNATIVES
For Further details.`;return r},buildEmptyRepetitionError(t){let e=en(t.repetition);if(t.repetition.idx!==0){e+=t.repetition.idx}const n=`The repetition <${e}> within Rule <${t.topLevelRule.name}> can never consume any tokens.
This could lead to an infinite loop.`;return n},buildTokenNameError(t){return"deprecated"},buildEmptyAlternationError(t){const e=`Ambiguous empty alternative: <${t.emptyChoiceIdx+1}> in <OR${t.alternation.idx}> inside <${t.topLevelRule.name}> Rule.
Only the last alternative may be an empty alternative.`;return e},buildTooManyAlternativesError(t){const e=`An Alternation cannot have more than 256 alternatives:
<OR${t.alternation.idx}> inside <${t.topLevelRule.name}> Rule.
 has ${t.alternation.definition.length+1} alternatives.`;return e},buildLeftRecursionError(t){const e=t.topLevelRule.name;const n=W(t.leftRecursionPath,s=>s.name);const r=`${e} --> ${n.concat([e]).join(" --> ")}`;const i=`Left Recursion found in grammar.
rule: <${e}> can be invoked from itself (directly or indirectly)
without consuming any Tokens. The grammar path that causes this is: 
 ${r}
 To fix this refactor your grammar to remove the left recursion.
see: https://en.wikipedia.org/wiki/LL_parser#Left_factoring.`;return i},buildInvalidRuleNameError(t){return"deprecated"},buildDuplicateRuleNameError(t){let e;if(t.topLevelRule instanceof Yr){e=t.topLevelRule.name}else{e=t.topLevelRule}const n=`Duplicate definition, rule: ->${e}<- is already defined in the grammar: ->${t.grammarName}<-`;return n}};function k1(t,e){const n=new P1(t,e);n.resolveRefs();return n.errors}class P1 extends Jr{constructor(e,n){super();this.nameToTopRule=e;this.errMsgProvider=n;this.errors=[]}resolveRefs(){X(qe(this.nameToTopRule),e=>{this.currTopLevel=e;e.accept(this)})}visitNonTerminal(e){const n=this.nameToTopRule[e.nonTerminalName];if(!n){const r=this.errMsgProvider.buildRuleNotFoundError(this.currTopLevel,e);this.errors.push({message:r,type:mt.UNRESOLVED_SUBRULE_REF,ruleName:this.currTopLevel.name,unresolvedRefName:e.nonTerminalName})}else{e.referencedRule=n}}}class D1 extends Qu{constructor(e,n){super();this.topProd=e;this.path=n;this.possibleTokTypes=[];this.nextProductionName="";this.nextProductionOccurrence=0;this.found=false;this.isAtEndOfPath=false}startWalking(){this.found=false;if(this.path.ruleStack[0]!==this.topProd.name){throw Error("The path does not start with the walker's top Rule!")}this.ruleStack=tt(this.path.ruleStack).reverse();this.occurrenceStack=tt(this.path.occurrenceStack).reverse();this.ruleStack.pop();this.occurrenceStack.pop();this.updateExpectedNext();this.walk(this.topProd);return this.possibleTokTypes}walk(e,n=[]){if(!this.found){super.walk(e,n)}}walkProdRef(e,n,r){if(e.referencedRule.name===this.nextProductionName&&e.idx===this.nextProductionOccurrence){const i=n.concat(r);this.updateExpectedNext();this.walk(e.referencedRule,i)}}updateExpectedNext(){if(ye(this.ruleStack)){this.nextProductionName="";this.nextProductionOccurrence=0;this.isAtEndOfPath=true}else{this.nextProductionName=this.ruleStack.pop();this.nextProductionOccurrence=this.occurrenceStack.pop()}}}class O1 extends D1{constructor(e,n){super(e,n);this.path=n;this.nextTerminalName="";this.nextTerminalOccurrence=0;this.nextTerminalName=this.path.lastTok.name;this.nextTerminalOccurrence=this.path.lastTokOccurrence}walkTerminal(e,n,r){if(this.isAtEndOfPath&&e.terminalType.name===this.nextTerminalName&&e.idx===this.nextTerminalOccurrence&&!this.found){const i=n.concat(r);const s=new Rt({definition:i});this.possibleTokTypes=ta(s);this.found=true}}}class ec extends Qu{constructor(e,n){super();this.topRule=e;this.occurrence=n;this.result={token:void 0,occurrence:void 0,isEndOfRule:void 0}}startWalking(){this.walk(this.topRule);return this.result}}class _1 extends ec{walkMany(e,n,r){if(e.idx===this.occurrence){const i=zt(n.concat(r));this.result.isEndOfRule=i===void 0;if(i instanceof Ee){this.result.token=i.terminalType;this.result.occurrence=i.idx}}else{super.walkMany(e,n,r)}}}class Hm extends ec{walkManySep(e,n,r){if(e.idx===this.occurrence){const i=zt(n.concat(r));this.result.isEndOfRule=i===void 0;if(i instanceof Ee){this.result.token=i.terminalType;this.result.occurrence=i.idx}}else{super.walkManySep(e,n,r)}}}class B1 extends ec{walkAtLeastOne(e,n,r){if(e.idx===this.occurrence){const i=zt(n.concat(r));this.result.isEndOfRule=i===void 0;if(i instanceof Ee){this.result.token=i.terminalType;this.result.occurrence=i.idx}}else{super.walkAtLeastOne(e,n,r)}}}class qm extends ec{walkAtLeastOneSep(e,n,r){if(e.idx===this.occurrence){const i=zt(n.concat(r));this.result.isEndOfRule=i===void 0;if(i instanceof Ee){this.result.token=i.terminalType;this.result.occurrence=i.idx}}else{super.walkAtLeastOneSep(e,n,r)}}}function Wd(t,e,n=[]){n=tt(n);let r=[];let i=0;function s(o){return o.concat(Ye(t,i+1))}function a(o){const l=Wd(s(o),e,n);return r.concat(l)}while(n.length<e&&i<t.length){const o=t[i];if(o instanceof Rt){return a(o.definition)}else if(o instanceof pt){return a(o.definition)}else if(o instanceof et){r=a(o.definition)}else if(o instanceof Ot){const l=o.definition.concat([new ke({definition:o.definition})]);return a(l)}else if(o instanceof _t){const l=[new Rt({definition:o.definition}),new ke({definition:[new Ee({terminalType:o.separator})].concat(o.definition)})];return a(l)}else if(o instanceof Et){const l=o.definition.concat([new ke({definition:[new Ee({terminalType:o.separator})].concat(o.definition)})]);r=a(l)}else if(o instanceof ke){const l=o.definition.concat([new ke({definition:o.definition})]);r=a(l)}else if(o instanceof $t){X(o.definition,l=>{if(ye(l.definition)===false){r=a(l.definition)}});return r}else if(o instanceof Ee){n.push(o.terminalType)}else{throw Error("non exhaustive match")}i++}r.push({partialPath:n,suffixDef:Ye(t,i)});return r}function NI(t,e,n,r){const i="EXIT_NONE_TERMINAL";const s=[i];const a="EXIT_ALTERNATIVE";let o=false;const l=e.length;const u=l-r-1;const c=[];const d=[];d.push({idx:-1,def:t,ruleStack:[],occurrenceStack:[]});while(!ye(d)){const f=d.pop();if(f===a){if(o&&Ur(d).idx<=u){d.pop()}continue}const p=f.def;const y=f.idx;const R=f.ruleStack;const A=f.occurrenceStack;if(ye(p)){continue}const v=p[0];if(v===i){const $={idx:y,def:Ye(p),ruleStack:_s(R),occurrenceStack:_s(A)};d.push($)}else if(v instanceof Ee){if(y<l-1){const $=y+1;const C=e[$];if(n(C,v.terminalType)){const O={idx:$,def:Ye(p),ruleStack:R,occurrenceStack:A};d.push(O)}}else if(y===l-1){c.push({nextTokenType:v.terminalType,nextTokenOccurrence:v.idx,ruleStack:R,occurrenceStack:A});o=true}else{throw Error("non exhaustive match")}}else if(v instanceof pt){const $=tt(R);$.push(v.nonTerminalName);const C=tt(A);C.push(v.idx);const O={idx:y,def:v.definition.concat(s,Ye(p)),ruleStack:$,occurrenceStack:C};d.push(O)}else if(v instanceof et){const $={idx:y,def:Ye(p),ruleStack:R,occurrenceStack:A};d.push($);d.push(a);const C={idx:y,def:v.definition.concat(Ye(p)),ruleStack:R,occurrenceStack:A};d.push(C)}else if(v instanceof Ot){const $=new ke({definition:v.definition,idx:v.idx});const C=v.definition.concat([$],Ye(p));const O={idx:y,def:C,ruleStack:R,occurrenceStack:A};d.push(O)}else if(v instanceof _t){const $=new Ee({terminalType:v.separator});const C=new ke({definition:[$].concat(v.definition),idx:v.idx});const O=v.definition.concat([C],Ye(p));const Y={idx:y,def:O,ruleStack:R,occurrenceStack:A};d.push(Y)}else if(v instanceof Et){const $={idx:y,def:Ye(p),ruleStack:R,occurrenceStack:A};d.push($);d.push(a);const C=new Ee({terminalType:v.separator});const O=new ke({definition:[C].concat(v.definition),idx:v.idx});const Y=v.definition.concat([O],Ye(p));const G={idx:y,def:Y,ruleStack:R,occurrenceStack:A};d.push(G)}else if(v instanceof ke){const $={idx:y,def:Ye(p),ruleStack:R,occurrenceStack:A};d.push($);d.push(a);const C=new ke({definition:v.definition,idx:v.idx});const O=v.definition.concat([C],Ye(p));const Y={idx:y,def:O,ruleStack:R,occurrenceStack:A};d.push(Y)}else if(v instanceof $t){for(let $=v.definition.length-1;$>=0;$--){const C=v.definition[$];const O={idx:y,def:C.definition.concat(Ye(p)),ruleStack:R,occurrenceStack:A};d.push(O);d.push(a)}}else if(v instanceof Rt){d.push({idx:y,def:v.definition.concat(Ye(p)),ruleStack:R,occurrenceStack:A})}else if(v instanceof Yr){d.push(L1(v,y,R,A))}else{throw Error("non exhaustive match")}}return c}function L1(t,e,n,r){const i=tt(n);i.push(t.name);const s=tt(r);s.push(1);return{idx:e,def:t.definition,ruleStack:i,occurrenceStack:s}}var be;(function(t){t[t["OPTION"]=0]="OPTION";t[t["REPETITION"]=1]="REPETITION";t[t["REPETITION_MANDATORY"]=2]="REPETITION_MANDATORY";t[t["REPETITION_MANDATORY_WITH_SEPARATOR"]=3]="REPETITION_MANDATORY_WITH_SEPARATOR";t[t["REPETITION_WITH_SEPARATOR"]=4]="REPETITION_WITH_SEPARATOR";t[t["ALTERNATION"]=5]="ALTERNATION"})(be||(be={}));function Sp(t){if(t instanceof et||t==="Option"){return be.OPTION}else if(t instanceof ke||t==="Repetition"){return be.REPETITION}else if(t instanceof Ot||t==="RepetitionMandatory"){return be.REPETITION_MANDATORY}else if(t instanceof _t||t==="RepetitionMandatoryWithSeparator"){return be.REPETITION_MANDATORY_WITH_SEPARATOR}else if(t instanceof Et||t==="RepetitionWithSeparator"){return be.REPETITION_WITH_SEPARATOR}else if(t instanceof $t||t==="Alternation"){return be.ALTERNATION}else{throw Error("non exhaustive match")}}function jm(t){const{occurrence:e,rule:n,prodType:r,maxLookahead:i}=t;const s=Sp(r);if(s===be.ALTERNATION){return tc(e,n,i)}else{return nc(e,n,s,i)}}function x1(t,e,n,r,i,s){const a=tc(t,e,n);const o=DI(a)?fu:na;return s(a,r,o,i)}function F1(t,e,n,r,i,s){const a=nc(t,e,i,n);const o=DI(a)?fu:na;return s(a[0],o,r)}function K1(t,e,n,r){const i=t.length;const s=qt(t,a=>{return qt(a,o=>{return o.length===1})});if(e){return function(a){const o=W(a,l=>l.GATE);for(let l=0;l<i;l++){const u=t[l];const c=u.length;const d=o[l];if(d!==void 0&&d.call(this)===false){continue}e:for(let f=0;f<c;f++){const p=u[f];const y=p.length;for(let R=0;R<y;R++){const A=this.LA(R+1);if(n(A,p[R])===false){continue e}}return l}}return void 0}}else if(s&&!r){const a=W(t,l=>{return Ft(l)});const o=ft(a,(l,u,c)=>{X(u,d=>{if(!Q(l,d.tokenTypeIdx)){l[d.tokenTypeIdx]=c}X(d.categoryMatches,f=>{if(!Q(l,f)){l[f]=c}})});return l},{});return function(){const l=this.LA(1);return o[l.tokenTypeIdx]}}else{return function(){for(let a=0;a<i;a++){const o=t[a];const l=o.length;e:for(let u=0;u<l;u++){const c=o[u];const d=c.length;for(let f=0;f<d;f++){const p=this.LA(f+1);if(n(p,c[f])===false){continue e}}return a}}return void 0}}}function U1(t,e,n){const r=qt(t,s=>{return s.length===1});const i=t.length;if(r&&!n){const s=Ft(t);if(s.length===1&&ye(s[0].categoryMatches)){const a=s[0];const o=a.tokenTypeIdx;return function(){return this.LA(1).tokenTypeIdx===o}}else{const a=ft(s,(o,l,u)=>{o[l.tokenTypeIdx]=true;X(l.categoryMatches,c=>{o[c]=true});return o},[]);return function(){const o=this.LA(1);return a[o.tokenTypeIdx]===true}}}else{return function(){e:for(let s=0;s<i;s++){const a=t[s];const o=a.length;for(let l=0;l<o;l++){const u=this.LA(l+1);if(e(u,a[l])===false){continue e}}return true}return false}}}class W1 extends Qu{constructor(e,n,r){super();this.topProd=e;this.targetOccurrence=n;this.targetProdType=r}startWalking(){this.walk(this.topProd);return this.restDef}checkIsTarget(e,n,r,i){if(e.idx===this.targetOccurrence&&this.targetProdType===n){this.restDef=r.concat(i);return true}return false}walkOption(e,n,r){if(!this.checkIsTarget(e,be.OPTION,n,r)){super.walkOption(e,n,r)}}walkAtLeastOne(e,n,r){if(!this.checkIsTarget(e,be.REPETITION_MANDATORY,n,r)){super.walkOption(e,n,r)}}walkAtLeastOneSep(e,n,r){if(!this.checkIsTarget(e,be.REPETITION_MANDATORY_WITH_SEPARATOR,n,r)){super.walkOption(e,n,r)}}walkMany(e,n,r){if(!this.checkIsTarget(e,be.REPETITION,n,r)){super.walkOption(e,n,r)}}walkManySep(e,n,r){if(!this.checkIsTarget(e,be.REPETITION_WITH_SEPARATOR,n,r)){super.walkOption(e,n,r)}}}class kI extends Jr{constructor(e,n,r){super();this.targetOccurrence=e;this.targetProdType=n;this.targetRef=r;this.result=[]}checkIsTarget(e,n){if(e.idx===this.targetOccurrence&&this.targetProdType===n&&(this.targetRef===void 0||e===this.targetRef)){this.result=e.definition}}visitOption(e){this.checkIsTarget(e,be.OPTION)}visitRepetition(e){this.checkIsTarget(e,be.REPETITION)}visitRepetitionMandatory(e){this.checkIsTarget(e,be.REPETITION_MANDATORY)}visitRepetitionMandatoryWithSeparator(e){this.checkIsTarget(e,be.REPETITION_MANDATORY_WITH_SEPARATOR)}visitRepetitionWithSeparator(e){this.checkIsTarget(e,be.REPETITION_WITH_SEPARATOR)}visitAlternation(e){this.checkIsTarget(e,be.ALTERNATION)}}function Vm(t){const e=new Array(t);for(let n=0;n<t;n++){e[n]=[]}return e}function gc(t){let e=[""];for(let n=0;n<t.length;n++){const r=t[n];const i=[];for(let s=0;s<e.length;s++){const a=e[s];i.push(a+"_"+r.tokenTypeIdx);for(let o=0;o<r.categoryMatches.length;o++){const l="_"+r.categoryMatches[o];i.push(a+l)}}e=i}return e}function G1(t,e,n){for(let r=0;r<t.length;r++){if(r===n){continue}const i=t[r];for(let s=0;s<e.length;s++){const a=e[s];if(i[a]===true){return false}}}return true}function PI(t,e){const n=W(t,a=>Wd([a],1));const r=Vm(n.length);const i=W(n,a=>{const o={};X(a,l=>{const u=gc(l.partialPath);X(u,c=>{o[c]=true})});return o});let s=n;for(let a=1;a<=e;a++){const o=s;s=Vm(o.length);for(let l=0;l<o.length;l++){const u=o[l];for(let c=0;c<u.length;c++){const d=u[c].partialPath;const f=u[c].suffixDef;const p=gc(d);const y=G1(i,p,l);if(y||ye(f)||d.length===e){const R=r[l];if(Gd(R,d)===false){R.push(d);for(let A=0;A<p.length;A++){const v=p[A];i[l][v]=true}}}else{const R=Wd(f,a+1,d);s[l]=s[l].concat(R);X(R,A=>{const v=gc(A.partialPath);X(v,$=>{i[l][$]=true})})}}}}return r}function tc(t,e,n,r){const i=new kI(t,be.ALTERNATION,r);e.accept(i);return PI(i.result,n)}function nc(t,e,n,r){const i=new kI(t,n);e.accept(i);const s=i.result;const a=new W1(e,t,n);const o=a.startWalking();const l=new Rt({definition:s});const u=new Rt({definition:o});return PI([l,u],r)}function Gd(t,e){e:for(let n=0;n<t.length;n++){const r=t[n];if(r.length!==e.length){continue}for(let i=0;i<r.length;i++){const s=e[i];const a=r[i];const o=s===a||a.categoryMatchesMap[s.tokenTypeIdx]!==void 0;if(o===false){continue e}}return true}return false}function H1(t,e){return t.length<e.length&&qt(t,(n,r)=>{const i=e[r];return n===i||i.categoryMatchesMap[n.tokenTypeIdx]})}function DI(t){return qt(t,e=>qt(e,n=>qt(n,r=>ye(r.categoryMatches))))}function q1(t){const e=t.lookaheadStrategy.validate({rules:t.rules,tokenTypes:t.tokenTypes,grammarName:t.grammarName});return W(e,n=>Object.assign({type:mt.CUSTOM_LOOKAHEAD_VALIDATION},n))}function j1(t,e,n,r){const i=kt(t,l=>V1(l,n));const s=sA(t,e,n);const a=kt(t,l=>tA(l,n));const o=kt(t,l=>Y1(l,t,r,n));return i.concat(s,a,o)}function V1(t,e){const n=new X1;t.accept(n);const r=n.allProductions;const i=ub(r,z1);const s=Yt(i,o=>{return o.length>1});const a=W(qe(s),o=>{const l=zt(o);const u=e.buildDuplicateFoundError(t,o);const c=en(l);const d={message:u,type:mt.DUPLICATE_PRODUCTIONS,ruleName:t.name,dslName:c,occurrence:l.idx};const f=OI(l);if(f){d.parameter=f}return d});return a}function z1(t){return`${en(t)}_#_${t.idx}_#_${OI(t)}`}function OI(t){if(t instanceof Ee){return t.terminalType.name}else if(t instanceof pt){return t.nonTerminalName}else{return""}}class X1 extends Jr{constructor(){super(...arguments);this.allProductions=[]}visitNonTerminal(e){this.allProductions.push(e)}visitOption(e){this.allProductions.push(e)}visitRepetitionWithSeparator(e){this.allProductions.push(e)}visitRepetitionMandatory(e){this.allProductions.push(e)}visitRepetitionMandatoryWithSeparator(e){this.allProductions.push(e)}visitRepetition(e){this.allProductions.push(e)}visitAlternation(e){this.allProductions.push(e)}visitTerminal(e){this.allProductions.push(e)}}function Y1(t,e,n,r){const i=[];const s=ft(e,(a,o)=>{if(o.name===t.name){return a+1}return a},0);if(s>1){const a=r.buildDuplicateRuleNameError({topLevelRule:t,grammarName:n});i.push({message:a,type:mt.DUPLICATE_RULE_NAME,ruleName:t.name})}return i}function J1(t,e,n){const r=[];let i;if(!ht(e,t)){i=`Invalid rule override, rule: ->${t}<- cannot be overridden in the grammar: ->${n}<-as it is not defined in any of the super grammars `;r.push({message:i,type:mt.INVALID_RULE_OVERRIDE,ruleName:t})}return r}function _I(t,e,n,r=[]){const i=[];const s=Gl(e.definition);if(ye(s)){return[]}else{const a=t.name;const o=ht(s,t);if(o){i.push({message:n.buildLeftRecursionError({topLevelRule:t,leftRecursionPath:r}),type:mt.LEFT_RECURSION,ruleName:a})}const l=Yu(s,r.concat([t]));const u=kt(l,c=>{const d=tt(r);d.push(c);return _I(t,c,n,d)});return i.concat(u)}}function Gl(t){let e=[];if(ye(t)){return e}const n=zt(t);if(n instanceof pt){e.push(n.referencedRule)}else if(n instanceof Rt||n instanceof et||n instanceof Ot||n instanceof _t||n instanceof Et||n instanceof ke){e=e.concat(Gl(n.definition))}else if(n instanceof $t){e=Ft(W(n.definition,s=>Gl(s.definition)))}else if(n instanceof Ee);else{throw Error("non exhaustive match")}const r=cu(n);const i=t.length>1;if(r&&i){const s=Ye(t);return e.concat(Gl(s))}else{return e}}class Np extends Jr{constructor(){super(...arguments);this.alternations=[]}visitAlternation(e){this.alternations.push(e)}}function Q1(t,e){const n=new Np;t.accept(n);const r=n.alternations;const i=kt(r,s=>{const a=_s(s.definition);return kt(a,(o,l)=>{const u=NI([o],[],na,1);if(ye(u)){return[{message:e.buildEmptyAlternationError({topLevelRule:t,alternation:s,emptyChoiceIdx:l}),type:mt.NONE_LAST_EMPTY_ALT,ruleName:t.name,occurrence:s.idx,alternative:l+1}]}else{return[]}})});return i}function Z1(t,e,n){const r=new Np;t.accept(r);let i=r.alternations;i=Ju(i,a=>a.ignoreAmbiguities===true);const s=kt(i,a=>{const o=a.idx;const l=a.maxLookahead||e;const u=tc(o,t,l,a);const c=rA(u,a,t,n);const d=iA(u,a,t,n);return c.concat(d)});return s}class eA extends Jr{constructor(){super(...arguments);this.allProductions=[]}visitRepetitionWithSeparator(e){this.allProductions.push(e)}visitRepetitionMandatory(e){this.allProductions.push(e)}visitRepetitionMandatoryWithSeparator(e){this.allProductions.push(e)}visitRepetition(e){this.allProductions.push(e)}}function tA(t,e){const n=new Np;t.accept(n);const r=n.alternations;const i=kt(r,s=>{if(s.definition.length>255){return[{message:e.buildTooManyAlternativesError({topLevelRule:t,alternation:s}),type:mt.TOO_MANY_ALTS,ruleName:t.name,occurrence:s.idx}]}else{return[]}});return i}function nA(t,e,n){const r=[];X(t,i=>{const s=new eA;i.accept(s);const a=s.allProductions;X(a,o=>{const l=Sp(o);const u=o.maxLookahead||e;const c=o.idx;const d=nc(c,i,l,u);const f=d[0];if(ye(Ft(f))){const p=n.buildEmptyRepetitionError({topLevelRule:i,repetition:o});r.push({message:p,type:mt.NO_NON_EMPTY_LOOKAHEAD,ruleName:i.name})}})});return r}function rA(t,e,n,r){const i=[];const s=ft(t,(o,l,u)=>{if(e.definition[u].ignoreAmbiguities===true){return o}X(l,c=>{const d=[u];X(t,(f,p)=>{if(u!==p&&Gd(f,c)&&e.definition[p].ignoreAmbiguities!==true){d.push(p)}});if(d.length>1&&!Gd(i,c)){i.push(c);o.push({alts:d,path:c})}});return o},[]);const a=W(s,o=>{const l=W(o.alts,c=>c+1);const u=r.buildAlternationAmbiguityError({topLevelRule:n,alternation:e,ambiguityIndices:l,prefixPath:o.path});return{message:u,type:mt.AMBIGUOUS_ALTS,ruleName:n.name,occurrence:e.idx,alternatives:o.alts}});return a}function iA(t,e,n,r){const i=ft(t,(a,o,l)=>{const u=W(o,c=>{return{idx:l,path:c}});return a.concat(u)},[]);const s=ea(kt(i,a=>{const o=e.definition[a.idx];if(o.ignoreAmbiguities===true){return[]}const l=a.idx;const u=a.path;const c=Dt(i,f=>{return e.definition[f.idx].ignoreAmbiguities!==true&&f.idx<l&&H1(f.path,u)});const d=W(c,f=>{const p=[f.idx+1,l+1];const y=e.idx===0?"":e.idx;const R=r.buildAlternationPrefixAmbiguityError({topLevelRule:n,alternation:e,ambiguityIndices:p,prefixPath:f.path});return{message:R,type:mt.AMBIGUOUS_PREFIX_ALTS,ruleName:n.name,occurrence:y,alternatives:p}});return d}));return s}function sA(t,e,n){const r=[];const i=W(e,s=>s.name);X(t,s=>{const a=s.name;if(ht(i,a)){const o=n.buildNamespaceConflictError(s);r.push({message:o,type:mt.CONFLICT_TOKENS_RULES_NAMESPACE,ruleName:a})}});return r}function aA(t){const e=wp(t,{errMsgProvider:N1});const n={};X(t.rules,r=>{n[r.name]=r});return k1(n,e.errMsgProvider)}function oA(t){t=wp(t,{errMsgProvider:fr});return j1(t.rules,t.tokenTypes,t.errMsgProvider,t.grammarName)}const BI="MismatchedTokenException";const LI="NoViableAltException";const xI="EarlyExitException";const FI="NotAllInputParsedException";const KI=[BI,LI,xI,FI];Object.freeze(KI);function pu(t){return ht(KI,t.name)}class rc extends Error{constructor(e,n){super(e);this.token=n;this.resyncedTokens=[];Object.setPrototypeOf(this,new.target.prototype);if(Error.captureStackTrace){Error.captureStackTrace(this,this.constructor)}}}class UI extends rc{constructor(e,n,r){super(e,n);this.previousToken=r;this.name=BI}}class lA extends rc{constructor(e,n,r){super(e,n);this.previousToken=r;this.name=LI}}class uA extends rc{constructor(e,n){super(e,n);this.name=FI}}class cA extends rc{constructor(e,n,r){super(e,n);this.previousToken=r;this.name=xI}}const Ic={};const WI="InRuleRecoveryException";class dA extends Error{constructor(e){super(e);this.name=WI}}class fA{initRecoverable(e){this.firstAfterRepMap={};this.resyncFollows={};this.recoveryEnabled=Q(e,"recoveryEnabled")?e.recoveryEnabled:_n.recoveryEnabled;if(this.recoveryEnabled){this.attemptInRepetitionRecovery=pA}}getTokenToInsert(e){const n=Mp(e,"",NaN,NaN,NaN,NaN,NaN,NaN);n.isInsertedInRecovery=true;return n}canTokenTypeBeInsertedInRecovery(e){return true}canTokenTypeBeDeletedInRecovery(e){return true}tryInRepetitionRecovery(e,n,r,i){const s=this.findReSyncTokenType();const a=this.exportLexerState();const o=[];let l=false;const u=this.LA(1);let c=this.LA(1);const d=()=>{const f=this.LA(0);const p=this.errorMessageProvider.buildMismatchTokenMessage({expected:i,actual:u,previous:f,ruleName:this.getCurrRuleFullName()});const y=new UI(p,u,this.LA(0));y.resyncedTokens=_s(o);this.SAVE_ERROR(y)};while(!l){if(this.tokenMatcher(c,i)){d();return}else if(r.call(this)){d();e.apply(this,n);return}else if(this.tokenMatcher(c,s)){l=true}else{c=this.SKIP_TOKEN();this.addToResyncTokens(c,o)}}this.importLexerState(a)}shouldInRepetitionRecoveryBeTried(e,n,r){if(r===false){return false}if(this.tokenMatcher(this.LA(1),e)){return false}if(this.isBackTracking()){return false}if(this.canPerformInRuleRecovery(e,this.getFollowsForInRuleRecovery(e,n))){return false}return true}getFollowsForInRuleRecovery(e,n){const r=this.getCurrentGrammarPath(e,n);const i=this.getNextPossibleTokenTypes(r);return i}tryInRuleRecovery(e,n){if(this.canRecoverWithSingleTokenInsertion(e,n)){const r=this.getTokenToInsert(e);return r}if(this.canRecoverWithSingleTokenDeletion(e)){const r=this.SKIP_TOKEN();this.consumeToken();return r}throw new dA("sad sad panda")}canPerformInRuleRecovery(e,n){return this.canRecoverWithSingleTokenInsertion(e,n)||this.canRecoverWithSingleTokenDeletion(e)}canRecoverWithSingleTokenInsertion(e,n){if(!this.canTokenTypeBeInsertedInRecovery(e)){return false}if(ye(n)){return false}const r=this.LA(1);const i=Wr(n,s=>{return this.tokenMatcher(r,s)})!==void 0;return i}canRecoverWithSingleTokenDeletion(e){if(!this.canTokenTypeBeDeletedInRecovery(e)){return false}const n=this.tokenMatcher(this.LA(2),e);return n}isInCurrentRuleReSyncSet(e){const n=this.getCurrFollowKey();const r=this.getFollowSetFromFollowKey(n);return ht(r,e)}findReSyncTokenType(){const e=this.flattenFollowSet();let n=this.LA(1);let r=2;while(true){const i=Wr(e,s=>{const a=SI(n,s);return a});if(i!==void 0){return i}n=this.LA(r);r++}}getCurrFollowKey(){if(this.RULE_STACK.length===1){return Ic}const e=this.getLastExplicitRuleShortName();const n=this.getLastExplicitRuleOccurrenceIndex();const r=this.getPreviousExplicitRuleShortName();return{ruleName:this.shortRuleNameToFullName(e),idxInCallingRule:n,inRule:this.shortRuleNameToFullName(r)}}buildFullFollowKeyStack(){const e=this.RULE_STACK;const n=this.RULE_OCCURRENCE_STACK;return W(e,(r,i)=>{if(i===0){return Ic}return{ruleName:this.shortRuleNameToFullName(r),idxInCallingRule:n[i],inRule:this.shortRuleNameToFullName(e[i-1])}})}flattenFollowSet(){const e=W(this.buildFullFollowKeyStack(),n=>{return this.getFollowSetFromFollowKey(n)});return Ft(e)}getFollowSetFromFollowKey(e){if(e===Ic){return[zn]}const n=e.ruleName+e.idxInCallingRule+II+e.inRule;return this.resyncFollows[n]}addToResyncTokens(e,n){if(!this.tokenMatcher(e,zn)){n.push(e)}return n}reSyncTo(e){const n=[];let r=this.LA(1);while(this.tokenMatcher(r,e)===false){r=this.SKIP_TOKEN();this.addToResyncTokens(r,n)}return _s(n)}attemptInRepetitionRecovery(e,n,r,i,s,a,o){}getCurrentGrammarPath(e,n){const r=this.getHumanReadableRuleStack();const i=tt(this.RULE_OCCURRENCE_STACK);const s={ruleStack:r,occurrenceStack:i,lastTok:e,lastTokOccurrence:n};return s}getHumanReadableRuleStack(){return W(this.RULE_STACK,e=>this.shortRuleNameToFullName(e))}}function pA(t,e,n,r,i,s,a){const o=this.getKeyForAutomaticLookahead(r,i);let l=this.firstAfterRepMap[o];if(l===void 0){const f=this.getCurrRuleFullName();const p=this.getGAstProductions()[f];const y=new s(p,i);l=y.startWalking();this.firstAfterRepMap[o]=l}let u=l.token;let c=l.occurrence;const d=l.isEndOfRule;if(this.RULE_STACK.length===1&&d&&u===void 0){u=zn;c=1}if(u===void 0||c===void 0){return}if(this.shouldInRepetitionRecoveryBeTried(u,c,a)){this.tryInRepetitionRecovery(t,e,n,u)}}const mA=4;const Qn=8;const GI=1<<Qn;const HI=2<<Qn;const Hd=3<<Qn;const qd=4<<Qn;const jd=5<<Qn;const Hl=6<<Qn;function vc(t,e,n){return n|e|t}class kp{constructor(e){var n;this.maxLookahead=(n=e===null||e===void 0?void 0:e.maxLookahead)!==null&&n!==void 0?n:_n.maxLookahead}validate(e){const n=this.validateNoLeftRecursion(e.rules);if(ye(n)){const r=this.validateEmptyOrAlternatives(e.rules);const i=this.validateAmbiguousAlternationAlternatives(e.rules,this.maxLookahead);const s=this.validateSomeNonEmptyLookaheadPath(e.rules,this.maxLookahead);const a=[...n,...r,...i,...s];return a}return n}validateNoLeftRecursion(e){return kt(e,n=>_I(n,n,fr))}validateEmptyOrAlternatives(e){return kt(e,n=>Q1(n,fr))}validateAmbiguousAlternationAlternatives(e,n){return kt(e,r=>Z1(r,n,fr))}validateSomeNonEmptyLookaheadPath(e,n){return nA(e,n,fr)}buildLookaheadForAlternation(e){return x1(e.prodOccurrence,e.rule,e.maxLookahead,e.hasPredicates,e.dynamicTokensEnabled,K1)}buildLookaheadForOptional(e){return F1(e.prodOccurrence,e.rule,e.maxLookahead,e.dynamicTokensEnabled,Sp(e.prodType),U1)}}class hA{initLooksAhead(e){this.dynamicTokensEnabled=Q(e,"dynamicTokensEnabled")?e.dynamicTokensEnabled:_n.dynamicTokensEnabled;this.maxLookahead=Q(e,"maxLookahead")?e.maxLookahead:_n.maxLookahead;this.lookaheadStrategy=Q(e,"lookaheadStrategy")?e.lookaheadStrategy:new kp({maxLookahead:this.maxLookahead});this.lookAheadFuncsCache=new Map}preComputeLookaheadFunctions(e){X(e,n=>{this.TRACE_INIT(`${n.name} Rule Lookahead`,()=>{const{alternation:r,repetition:i,option:s,repetitionMandatory:a,repetitionMandatoryWithSeparator:o,repetitionWithSeparator:l}=gA(n);X(r,u=>{const c=u.idx===0?"":u.idx;this.TRACE_INIT(`${en(u)}${c}`,()=>{const d=this.lookaheadStrategy.buildLookaheadForAlternation({prodOccurrence:u.idx,rule:n,maxLookahead:u.maxLookahead||this.maxLookahead,hasPredicates:u.hasPredicates,dynamicTokensEnabled:this.dynamicTokensEnabled});const f=vc(this.fullRuleNameToShort[n.name],GI,u.idx);this.setLaFuncCache(f,d)})});X(i,u=>{this.computeLookaheadFunc(n,u.idx,Hd,"Repetition",u.maxLookahead,en(u))});X(s,u=>{this.computeLookaheadFunc(n,u.idx,HI,"Option",u.maxLookahead,en(u))});X(a,u=>{this.computeLookaheadFunc(n,u.idx,qd,"RepetitionMandatory",u.maxLookahead,en(u))});X(o,u=>{this.computeLookaheadFunc(n,u.idx,Hl,"RepetitionMandatoryWithSeparator",u.maxLookahead,en(u))});X(l,u=>{this.computeLookaheadFunc(n,u.idx,jd,"RepetitionWithSeparator",u.maxLookahead,en(u))})})})}computeLookaheadFunc(e,n,r,i,s,a){this.TRACE_INIT(`${a}${n===0?"":n}`,()=>{const o=this.lookaheadStrategy.buildLookaheadForOptional({prodOccurrence:n,rule:e,maxLookahead:s||this.maxLookahead,dynamicTokensEnabled:this.dynamicTokensEnabled,prodType:i});const l=vc(this.fullRuleNameToShort[e.name],r,n);this.setLaFuncCache(l,o)})}getKeyForAutomaticLookahead(e,n){const r=this.getLastExplicitRuleShortName();return vc(r,e,n)}getLaFuncFromCache(e){return this.lookAheadFuncsCache.get(e)}setLaFuncCache(e,n){this.lookAheadFuncsCache.set(e,n)}}class yA extends Jr{constructor(){super(...arguments);this.dslMethods={option:[],alternation:[],repetition:[],repetitionWithSeparator:[],repetitionMandatory:[],repetitionMandatoryWithSeparator:[]}}reset(){this.dslMethods={option:[],alternation:[],repetition:[],repetitionWithSeparator:[],repetitionMandatory:[],repetitionMandatoryWithSeparator:[]}}visitOption(e){this.dslMethods.option.push(e)}visitRepetitionWithSeparator(e){this.dslMethods.repetitionWithSeparator.push(e)}visitRepetitionMandatory(e){this.dslMethods.repetitionMandatory.push(e)}visitRepetitionMandatoryWithSeparator(e){this.dslMethods.repetitionMandatoryWithSeparator.push(e)}visitRepetition(e){this.dslMethods.repetition.push(e)}visitAlternation(e){this.dslMethods.alternation.push(e)}}const _a=new yA;function gA(t){_a.reset();t.accept(_a);const e=_a.dslMethods;_a.reset();return e}function zm(t,e){if(isNaN(t.startOffset)===true){t.startOffset=e.startOffset;t.endOffset=e.endOffset}else if(t.endOffset<e.endOffset===true){t.endOffset=e.endOffset}}function Xm(t,e){if(isNaN(t.startOffset)===true){t.startOffset=e.startOffset;t.startColumn=e.startColumn;t.startLine=e.startLine;t.endOffset=e.endOffset;t.endColumn=e.endColumn;t.endLine=e.endLine}else if(t.endOffset<e.endOffset===true){t.endOffset=e.endOffset;t.endColumn=e.endColumn;t.endLine=e.endLine}}function IA(t,e,n){if(t.children[n]===void 0){t.children[n]=[e]}else{t.children[n].push(e)}}function vA(t,e,n){if(t.children[e]===void 0){t.children[e]=[n]}else{t.children[e].push(n)}}const RA="name";function qI(t,e){Object.defineProperty(t,RA,{enumerable:false,configurable:true,writable:false,value:e})}function EA(t,e){const n=Wt(t);const r=n.length;for(let i=0;i<r;i++){const s=n[i];const a=t[s];const o=a.length;for(let l=0;l<o;l++){const u=a[l];if(u.tokenTypeIdx===void 0){this[u.name](u.children,e)}}}}function $A(t,e){const n=function(){};qI(n,t+"BaseSemantics");const r={visit:function(i,s){if(oe(i)){i=i[0]}if(On(i)){return void 0}return this[i.name](i.children,s)},validateVisitor:function(){const i=CA(this,e);if(!ye(i)){const s=W(i,a=>a.msg);throw Error(`Errors Detected in CST Visitor <${this.constructor.name}>:
	${s.join("\n\n").replace(/\n/g,"\n	")}`)}}};n.prototype=r;n.prototype.constructor=n;n._RULE_NAMES=e;return n}function TA(t,e,n){const r=function(){};qI(r,t+"BaseSemanticsWithDefaults");const i=Object.create(n.prototype);X(e,s=>{i[s]=EA});r.prototype=i;r.prototype.constructor=r;return r}var Vd;(function(t){t[t["REDUNDANT_METHOD"]=0]="REDUNDANT_METHOD";t[t["MISSING_METHOD"]=1]="MISSING_METHOD"})(Vd||(Vd={}));function CA(t,e){const n=wA(t,e);return n}function wA(t,e){const n=Dt(e,i=>{return Ln(t[i])===false});const r=W(n,i=>{return{msg:`Missing visitor method: <${i}> on ${t.constructor.name} CST Visitor.`,type:Vd.MISSING_METHOD,methodName:i}});return ea(r)}class bA{initTreeBuilder(e){this.CST_STACK=[];this.outputCst=e.outputCst;this.nodeLocationTracking=Q(e,"nodeLocationTracking")?e.nodeLocationTracking:_n.nodeLocationTracking;if(!this.outputCst){this.cstInvocationStateUpdate=He;this.cstFinallyStateUpdate=He;this.cstPostTerminal=He;this.cstPostNonTerminal=He;this.cstPostRule=He}else{if(/full/i.test(this.nodeLocationTracking)){if(this.recoveryEnabled){this.setNodeLocationFromToken=Xm;this.setNodeLocationFromNode=Xm;this.cstPostRule=He;this.setInitialNodeLocation=this.setInitialNodeLocationFullRecovery}else{this.setNodeLocationFromToken=He;this.setNodeLocationFromNode=He;this.cstPostRule=this.cstPostRuleFull;this.setInitialNodeLocation=this.setInitialNodeLocationFullRegular}}else if(/onlyOffset/i.test(this.nodeLocationTracking)){if(this.recoveryEnabled){this.setNodeLocationFromToken=zm;this.setNodeLocationFromNode=zm;this.cstPostRule=He;this.setInitialNodeLocation=this.setInitialNodeLocationOnlyOffsetRecovery}else{this.setNodeLocationFromToken=He;this.setNodeLocationFromNode=He;this.cstPostRule=this.cstPostRuleOnlyOffset;this.setInitialNodeLocation=this.setInitialNodeLocationOnlyOffsetRegular}}else if(/none/i.test(this.nodeLocationTracking)){this.setNodeLocationFromToken=He;this.setNodeLocationFromNode=He;this.cstPostRule=He;this.setInitialNodeLocation=He}else{throw Error(`Invalid <nodeLocationTracking> config option: "${e.nodeLocationTracking}"`)}}}setInitialNodeLocationOnlyOffsetRecovery(e){e.location={startOffset:NaN,endOffset:NaN}}setInitialNodeLocationOnlyOffsetRegular(e){e.location={startOffset:this.LA(1).startOffset,endOffset:NaN}}setInitialNodeLocationFullRecovery(e){e.location={startOffset:NaN,startLine:NaN,startColumn:NaN,endOffset:NaN,endLine:NaN,endColumn:NaN}}setInitialNodeLocationFullRegular(e){const n=this.LA(1);e.location={startOffset:n.startOffset,startLine:n.startLine,startColumn:n.startColumn,endOffset:NaN,endLine:NaN,endColumn:NaN}}cstInvocationStateUpdate(e){const n={name:e,children:Object.create(null)};this.setInitialNodeLocation(n);this.CST_STACK.push(n)}cstFinallyStateUpdate(){this.CST_STACK.pop()}cstPostRuleFull(e){const n=this.LA(0);const r=e.location;if(r.startOffset<=n.startOffset===true){r.endOffset=n.endOffset;r.endLine=n.endLine;r.endColumn=n.endColumn}else{r.startOffset=NaN;r.startLine=NaN;r.startColumn=NaN}}cstPostRuleOnlyOffset(e){const n=this.LA(0);const r=e.location;if(r.startOffset<=n.startOffset===true){r.endOffset=n.endOffset}else{r.startOffset=NaN}}cstPostTerminal(e,n){const r=this.CST_STACK[this.CST_STACK.length-1];IA(r,n,e);this.setNodeLocationFromToken(r.location,n)}cstPostNonTerminal(e,n){const r=this.CST_STACK[this.CST_STACK.length-1];vA(r,n,e);this.setNodeLocationFromNode(r.location,e.location)}getBaseCstVisitorConstructor(){if(On(this.baseCstVisitorConstructor)){const e=$A(this.className,Wt(this.gastProductionsCache));this.baseCstVisitorConstructor=e;return e}return this.baseCstVisitorConstructor}getBaseCstVisitorConstructorWithDefaults(){if(On(this.baseCstVisitorWithDefaultsConstructor)){const e=TA(this.className,Wt(this.gastProductionsCache),this.getBaseCstVisitorConstructor());this.baseCstVisitorWithDefaultsConstructor=e;return e}return this.baseCstVisitorWithDefaultsConstructor}getLastExplicitRuleShortName(){const e=this.RULE_STACK;return e[e.length-1]}getPreviousExplicitRuleShortName(){const e=this.RULE_STACK;return e[e.length-2]}getLastExplicitRuleOccurrenceIndex(){const e=this.RULE_OCCURRENCE_STACK;return e[e.length-1]}}class AA{initLexerAdapter(){this.tokVector=[];this.tokVectorLength=0;this.currIdx=-1}set input(e){if(this.selfAnalysisDone!==true){throw Error(`Missing <performSelfAnalysis> invocation at the end of the Parser's constructor.`)}this.reset();this.tokVector=e;this.tokVectorLength=e.length}get input(){return this.tokVector}SKIP_TOKEN(){if(this.currIdx<=this.tokVector.length-2){this.consumeToken();return this.LA(1)}else{return hu}}LA(e){const n=this.currIdx+e;if(n<0||this.tokVectorLength<=n){return hu}else{return this.tokVector[n]}}consumeToken(){this.currIdx++}exportLexerState(){return this.currIdx}importLexerState(e){this.currIdx=e}resetLexerState(){this.currIdx=-1}moveToTerminatedState(){this.currIdx=this.tokVector.length-1}getLexerPosition(){return this.exportLexerState()}}class MA{ACTION(e){return e.call(this)}consume(e,n,r){return this.consumeInternal(n,e,r)}subrule(e,n,r){return this.subruleInternal(n,e,r)}option(e,n){return this.optionInternal(n,e)}or(e,n){return this.orInternal(n,e)}many(e,n){return this.manyInternal(e,n)}atLeastOne(e,n){return this.atLeastOneInternal(e,n)}CONSUME(e,n){return this.consumeInternal(e,0,n)}CONSUME1(e,n){return this.consumeInternal(e,1,n)}CONSUME2(e,n){return this.consumeInternal(e,2,n)}CONSUME3(e,n){return this.consumeInternal(e,3,n)}CONSUME4(e,n){return this.consumeInternal(e,4,n)}CONSUME5(e,n){return this.consumeInternal(e,5,n)}CONSUME6(e,n){return this.consumeInternal(e,6,n)}CONSUME7(e,n){return this.consumeInternal(e,7,n)}CONSUME8(e,n){return this.consumeInternal(e,8,n)}CONSUME9(e,n){return this.consumeInternal(e,9,n)}SUBRULE(e,n){return this.subruleInternal(e,0,n)}SUBRULE1(e,n){return this.subruleInternal(e,1,n)}SUBRULE2(e,n){return this.subruleInternal(e,2,n)}SUBRULE3(e,n){return this.subruleInternal(e,3,n)}SUBRULE4(e,n){return this.subruleInternal(e,4,n)}SUBRULE5(e,n){return this.subruleInternal(e,5,n)}SUBRULE6(e,n){return this.subruleInternal(e,6,n)}SUBRULE7(e,n){return this.subruleInternal(e,7,n)}SUBRULE8(e,n){return this.subruleInternal(e,8,n)}SUBRULE9(e,n){return this.subruleInternal(e,9,n)}OPTION(e){return this.optionInternal(e,0)}OPTION1(e){return this.optionInternal(e,1)}OPTION2(e){return this.optionInternal(e,2)}OPTION3(e){return this.optionInternal(e,3)}OPTION4(e){return this.optionInternal(e,4)}OPTION5(e){return this.optionInternal(e,5)}OPTION6(e){return this.optionInternal(e,6)}OPTION7(e){return this.optionInternal(e,7)}OPTION8(e){return this.optionInternal(e,8)}OPTION9(e){return this.optionInternal(e,9)}OR(e){return this.orInternal(e,0)}OR1(e){return this.orInternal(e,1)}OR2(e){return this.orInternal(e,2)}OR3(e){return this.orInternal(e,3)}OR4(e){return this.orInternal(e,4)}OR5(e){return this.orInternal(e,5)}OR6(e){return this.orInternal(e,6)}OR7(e){return this.orInternal(e,7)}OR8(e){return this.orInternal(e,8)}OR9(e){return this.orInternal(e,9)}MANY(e){this.manyInternal(0,e)}MANY1(e){this.manyInternal(1,e)}MANY2(e){this.manyInternal(2,e)}MANY3(e){this.manyInternal(3,e)}MANY4(e){this.manyInternal(4,e)}MANY5(e){this.manyInternal(5,e)}MANY6(e){this.manyInternal(6,e)}MANY7(e){this.manyInternal(7,e)}MANY8(e){this.manyInternal(8,e)}MANY9(e){this.manyInternal(9,e)}MANY_SEP(e){this.manySepFirstInternal(0,e)}MANY_SEP1(e){this.manySepFirstInternal(1,e)}MANY_SEP2(e){this.manySepFirstInternal(2,e)}MANY_SEP3(e){this.manySepFirstInternal(3,e)}MANY_SEP4(e){this.manySepFirstInternal(4,e)}MANY_SEP5(e){this.manySepFirstInternal(5,e)}MANY_SEP6(e){this.manySepFirstInternal(6,e)}MANY_SEP7(e){this.manySepFirstInternal(7,e)}MANY_SEP8(e){this.manySepFirstInternal(8,e)}MANY_SEP9(e){this.manySepFirstInternal(9,e)}AT_LEAST_ONE(e){this.atLeastOneInternal(0,e)}AT_LEAST_ONE1(e){return this.atLeastOneInternal(1,e)}AT_LEAST_ONE2(e){this.atLeastOneInternal(2,e)}AT_LEAST_ONE3(e){this.atLeastOneInternal(3,e)}AT_LEAST_ONE4(e){this.atLeastOneInternal(4,e)}AT_LEAST_ONE5(e){this.atLeastOneInternal(5,e)}AT_LEAST_ONE6(e){this.atLeastOneInternal(6,e)}AT_LEAST_ONE7(e){this.atLeastOneInternal(7,e)}AT_LEAST_ONE8(e){this.atLeastOneInternal(8,e)}AT_LEAST_ONE9(e){this.atLeastOneInternal(9,e)}AT_LEAST_ONE_SEP(e){this.atLeastOneSepFirstInternal(0,e)}AT_LEAST_ONE_SEP1(e){this.atLeastOneSepFirstInternal(1,e)}AT_LEAST_ONE_SEP2(e){this.atLeastOneSepFirstInternal(2,e)}AT_LEAST_ONE_SEP3(e){this.atLeastOneSepFirstInternal(3,e)}AT_LEAST_ONE_SEP4(e){this.atLeastOneSepFirstInternal(4,e)}AT_LEAST_ONE_SEP5(e){this.atLeastOneSepFirstInternal(5,e)}AT_LEAST_ONE_SEP6(e){this.atLeastOneSepFirstInternal(6,e)}AT_LEAST_ONE_SEP7(e){this.atLeastOneSepFirstInternal(7,e)}AT_LEAST_ONE_SEP8(e){this.atLeastOneSepFirstInternal(8,e)}AT_LEAST_ONE_SEP9(e){this.atLeastOneSepFirstInternal(9,e)}RULE(e,n,r=yu){if(ht(this.definedRulesNames,e)){const s=fr.buildDuplicateRuleNameError({topLevelRule:e,grammarName:this.className});const a={message:s,type:mt.DUPLICATE_RULE_NAME,ruleName:e};this.definitionErrors.push(a)}this.definedRulesNames.push(e);const i=this.defineRule(e,n,r);this[e]=i;return i}OVERRIDE_RULE(e,n,r=yu){const i=J1(e,this.definedRulesNames,this.className);this.definitionErrors=this.definitionErrors.concat(i);const s=this.defineRule(e,n,r);this[e]=s;return s}BACKTRACK(e,n){return function(){this.isBackTrackingStack.push(1);const r=this.saveRecogState();try{e.apply(this,n);return true}catch(i){if(pu(i)){return false}else{throw i}}finally{this.reloadRecogState(r);this.isBackTrackingStack.pop()}}}getGAstProductions(){return this.gastProductionsCache}getSerializedGastProductions(){return Lb(qe(this.gastProductionsCache))}}class SA{initRecognizerEngine(e,n){this.className=this.constructor.name;this.shortRuleNameToFull={};this.fullRuleNameToShort={};this.ruleShortNameIdx=256;this.tokenMatcher=fu;this.subruleIdx=0;this.definedRulesNames=[];this.tokensMap={};this.isBackTrackingStack=[];this.RULE_STACK=[];this.RULE_OCCURRENCE_STACK=[];this.gastProductionsCache={};if(Q(n,"serializedGrammar")){throw Error("The Parser's configuration can no longer contain a <serializedGrammar> property.\n	See: https://chevrotain.io/docs/changes/BREAKING_CHANGES.html#_6-0-0\n	For Further details.")}if(oe(e)){if(ye(e)){throw Error("A Token Vocabulary cannot be empty.\n	Note that the first argument for the parser constructor\n	is no longer a Token vector (since v4.0).")}if(typeof e[0].startOffset==="number"){throw Error("The Parser constructor no longer accepts a token vector as the first argument.\n	See: https://chevrotain.io/docs/changes/BREAKING_CHANGES.html#_4-0-0\n	For Further details.")}}if(oe(e)){this.tokensMap=ft(e,(s,a)=>{s[a.name]=a;return s},{})}else if(Q(e,"modes")&&qt(Ft(qe(e.modes)),A1)){const s=Ft(qe(e.modes));const a=bp(s);this.tokensMap=ft(a,(o,l)=>{o[l.name]=l;return o},{})}else if(Ut(e)){this.tokensMap=tt(e)}else{throw new Error("<tokensDictionary> argument must be An Array of Token constructors, A dictionary of Token constructors or an IMultiModeLexerDefinition")}this.tokensMap["EOF"]=zn;const r=Q(e,"modes")?Ft(qe(e.modes)):qe(e);const i=qt(r,s=>ye(s.categoryMatches));this.tokenMatcher=i?fu:na;ra(qe(this.tokensMap))}defineRule(e,n,r){if(this.selfAnalysisDone){throw Error(`Grammar rule <${e}> may not be defined after the 'performSelfAnalysis' method has been called'
Make sure that all grammar rule definitions are done before 'performSelfAnalysis' is called.`)}const i=Q(r,"resyncEnabled")?r.resyncEnabled:yu.resyncEnabled;const s=Q(r,"recoveryValueFunc")?r.recoveryValueFunc:yu.recoveryValueFunc;const a=this.ruleShortNameIdx<<mA+Qn;this.ruleShortNameIdx++;this.shortRuleNameToFull[a]=e;this.fullRuleNameToShort[e]=a;let o;if(this.outputCst===true){o=function u(...c){try{this.ruleInvocationStateUpdate(a,e,this.subruleIdx);n.apply(this,c);const d=this.CST_STACK[this.CST_STACK.length-1];this.cstPostRule(d);return d}catch(d){return this.invokeRuleCatch(d,i,s)}finally{this.ruleFinallyStateUpdate()}}}else{o=function u(...c){try{this.ruleInvocationStateUpdate(a,e,this.subruleIdx);return n.apply(this,c)}catch(d){return this.invokeRuleCatch(d,i,s)}finally{this.ruleFinallyStateUpdate()}}}const l=Object.assign(o,{ruleName:e,originalGrammarAction:n});return l}invokeRuleCatch(e,n,r){const i=this.RULE_STACK.length===1;const s=n&&!this.isBackTracking()&&this.recoveryEnabled;if(pu(e)){const a=e;if(s){const o=this.findReSyncTokenType();if(this.isInCurrentRuleReSyncSet(o)){a.resyncedTokens=this.reSyncTo(o);if(this.outputCst){const l=this.CST_STACK[this.CST_STACK.length-1];l.recoveredNode=true;return l}else{return r(e)}}else{if(this.outputCst){const l=this.CST_STACK[this.CST_STACK.length-1];l.recoveredNode=true;a.partialCstResult=l}throw a}}else if(i){this.moveToTerminatedState();return r(e)}else{throw a}}else{throw e}}optionInternal(e,n){const r=this.getKeyForAutomaticLookahead(HI,n);return this.optionInternalLogic(e,n,r)}optionInternalLogic(e,n,r){let i=this.getLaFuncFromCache(r);let s;if(typeof e!=="function"){s=e.DEF;const a=e.GATE;if(a!==void 0){const o=i;i=()=>{return a.call(this)&&o.call(this)}}}else{s=e}if(i.call(this)===true){return s.call(this)}return void 0}atLeastOneInternal(e,n){const r=this.getKeyForAutomaticLookahead(qd,e);return this.atLeastOneInternalLogic(e,n,r)}atLeastOneInternalLogic(e,n,r){let i=this.getLaFuncFromCache(r);let s;if(typeof n!=="function"){s=n.DEF;const a=n.GATE;if(a!==void 0){const o=i;i=()=>{return a.call(this)&&o.call(this)}}}else{s=n}if(i.call(this)===true){let a=this.doSingleRepetition(s);while(i.call(this)===true&&a===true){a=this.doSingleRepetition(s)}}else{throw this.raiseEarlyExitException(e,be.REPETITION_MANDATORY,n.ERR_MSG)}this.attemptInRepetitionRecovery(this.atLeastOneInternal,[e,n],i,qd,e,B1)}atLeastOneSepFirstInternal(e,n){const r=this.getKeyForAutomaticLookahead(Hl,e);this.atLeastOneSepFirstInternalLogic(e,n,r)}atLeastOneSepFirstInternalLogic(e,n,r){const i=n.DEF;const s=n.SEP;const a=this.getLaFuncFromCache(r);if(a.call(this)===true){i.call(this);const o=()=>{return this.tokenMatcher(this.LA(1),s)};while(this.tokenMatcher(this.LA(1),s)===true){this.CONSUME(s);i.call(this)}this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal,[e,s,o,i,qm],o,Hl,e,qm)}else{throw this.raiseEarlyExitException(e,be.REPETITION_MANDATORY_WITH_SEPARATOR,n.ERR_MSG)}}manyInternal(e,n){const r=this.getKeyForAutomaticLookahead(Hd,e);return this.manyInternalLogic(e,n,r)}manyInternalLogic(e,n,r){let i=this.getLaFuncFromCache(r);let s;if(typeof n!=="function"){s=n.DEF;const o=n.GATE;if(o!==void 0){const l=i;i=()=>{return o.call(this)&&l.call(this)}}}else{s=n}let a=true;while(i.call(this)===true&&a===true){a=this.doSingleRepetition(s)}this.attemptInRepetitionRecovery(this.manyInternal,[e,n],i,Hd,e,_1,a)}manySepFirstInternal(e,n){const r=this.getKeyForAutomaticLookahead(jd,e);this.manySepFirstInternalLogic(e,n,r)}manySepFirstInternalLogic(e,n,r){const i=n.DEF;const s=n.SEP;const a=this.getLaFuncFromCache(r);if(a.call(this)===true){i.call(this);const o=()=>{return this.tokenMatcher(this.LA(1),s)};while(this.tokenMatcher(this.LA(1),s)===true){this.CONSUME(s);i.call(this)}this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal,[e,s,o,i,Hm],o,jd,e,Hm)}}repetitionSepSecondInternal(e,n,r,i,s){while(r()){this.CONSUME(n);i.call(this)}this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal,[e,n,r,i,s],r,Hl,e,s)}doSingleRepetition(e){const n=this.getLexerPosition();e.call(this);const r=this.getLexerPosition();return r>n}orInternal(e,n){const r=this.getKeyForAutomaticLookahead(GI,n);const i=oe(e)?e:e.DEF;const s=this.getLaFuncFromCache(r);const a=s.call(this,i);if(a!==void 0){const o=i[a];return o.ALT.call(this)}this.raiseNoAltException(n,e.ERR_MSG)}ruleFinallyStateUpdate(){this.RULE_STACK.pop();this.RULE_OCCURRENCE_STACK.pop();this.cstFinallyStateUpdate();if(this.RULE_STACK.length===0&&this.isAtEndOfInput()===false){const e=this.LA(1);const n=this.errorMessageProvider.buildNotAllInputParsedMessage({firstRedundant:e,ruleName:this.getCurrRuleFullName()});this.SAVE_ERROR(new uA(n,e))}}subruleInternal(e,n,r){let i;try{const s=r!==void 0?r.ARGS:void 0;this.subruleIdx=n;i=e.apply(this,s);this.cstPostNonTerminal(i,r!==void 0&&r.LABEL!==void 0?r.LABEL:e.ruleName);return i}catch(s){throw this.subruleInternalError(s,r,e.ruleName)}}subruleInternalError(e,n,r){if(pu(e)&&e.partialCstResult!==void 0){this.cstPostNonTerminal(e.partialCstResult,n!==void 0&&n.LABEL!==void 0?n.LABEL:r);delete e.partialCstResult}throw e}consumeInternal(e,n,r){let i;try{const s=this.LA(1);if(this.tokenMatcher(s,e)===true){this.consumeToken();i=s}else{this.consumeInternalError(e,s,r)}}catch(s){i=this.consumeInternalRecovery(e,n,s)}this.cstPostTerminal(r!==void 0&&r.LABEL!==void 0?r.LABEL:e.name,i);return i}consumeInternalError(e,n,r){let i;const s=this.LA(0);if(r!==void 0&&r.ERR_MSG){i=r.ERR_MSG}else{i=this.errorMessageProvider.buildMismatchTokenMessage({expected:e,actual:n,previous:s,ruleName:this.getCurrRuleFullName()})}throw this.SAVE_ERROR(new UI(i,n,s))}consumeInternalRecovery(e,n,r){if(this.recoveryEnabled&&r.name==="MismatchedTokenException"&&!this.isBackTracking()){const i=this.getFollowsForInRuleRecovery(e,n);try{return this.tryInRuleRecovery(e,i)}catch(s){if(s.name===WI){throw r}else{throw s}}}else{throw r}}saveRecogState(){const e=this.errors;const n=tt(this.RULE_STACK);return{errors:e,lexerState:this.exportLexerState(),RULE_STACK:n,CST_STACK:this.CST_STACK}}reloadRecogState(e){this.errors=e.errors;this.importLexerState(e.lexerState);this.RULE_STACK=e.RULE_STACK}ruleInvocationStateUpdate(e,n,r){this.RULE_OCCURRENCE_STACK.push(r);this.RULE_STACK.push(e);this.cstInvocationStateUpdate(n)}isBackTracking(){return this.isBackTrackingStack.length!==0}getCurrRuleFullName(){const e=this.getLastExplicitRuleShortName();return this.shortRuleNameToFull[e]}shortRuleNameToFullName(e){return this.shortRuleNameToFull[e]}isAtEndOfInput(){return this.tokenMatcher(this.LA(1),zn)}reset(){this.resetLexerState();this.subruleIdx=0;this.isBackTrackingStack=[];this.errors=[];this.RULE_STACK=[];this.CST_STACK=[];this.RULE_OCCURRENCE_STACK=[]}}class NA{initErrorHandler(e){this._errors=[];this.errorMessageProvider=Q(e,"errorMessageProvider")?e.errorMessageProvider:_n.errorMessageProvider}SAVE_ERROR(e){if(pu(e)){e.context={ruleStack:this.getHumanReadableRuleStack(),ruleOccurrenceStack:tt(this.RULE_OCCURRENCE_STACK)};this._errors.push(e);return e}else{throw Error("Trying to save an Error which is not a RecognitionException")}}get errors(){return tt(this._errors)}set errors(e){this._errors=e}raiseEarlyExitException(e,n,r){const i=this.getCurrRuleFullName();const s=this.getGAstProductions()[i];const a=nc(e,s,n,this.maxLookahead);const o=a[0];const l=[];for(let c=1;c<=this.maxLookahead;c++){l.push(this.LA(c))}const u=this.errorMessageProvider.buildEarlyExitMessage({expectedIterationPaths:o,actual:l,previous:this.LA(0),customUserDescription:r,ruleName:i});throw this.SAVE_ERROR(new cA(u,this.LA(1),this.LA(0)))}raiseNoAltException(e,n){const r=this.getCurrRuleFullName();const i=this.getGAstProductions()[r];const s=tc(e,i,this.maxLookahead);const a=[];for(let u=1;u<=this.maxLookahead;u++){a.push(this.LA(u))}const o=this.LA(0);const l=this.errorMessageProvider.buildNoViableAltMessage({expectedPathsPerAlt:s,actual:a,previous:o,customUserDescription:n,ruleName:this.getCurrRuleFullName()});throw this.SAVE_ERROR(new lA(l,this.LA(1),o))}}class kA{initContentAssist(){}computeContentAssist(e,n){const r=this.gastProductionsCache[e];if(On(r)){throw Error(`Rule ->${e}<- does not exist in this grammar.`)}return NI([r],n,this.tokenMatcher,this.maxLookahead)}getNextPossibleTokenTypes(e){const n=zt(e.ruleStack);const r=this.getGAstProductions();const i=r[n];const s=new O1(i,e).startWalking();return s}}const ic={description:"This Object indicates the Parser is during Recording Phase"};Object.freeze(ic);const Ym=true;const Jm=Math.pow(2,Qn)-1;const jI=MI({name:"RECORDING_PHASE_TOKEN",pattern:It.NA});ra([jI]);const VI=Mp(jI,"This IToken indicates the Parser is in Recording Phase\n	See: https://chevrotain.io/docs/guide/internals.html#grammar-recording for details",-1,-1,-1,-1,-1,-1);Object.freeze(VI);const PA={name:"This CSTNode indicates the Parser is in Recording Phase\n	See: https://chevrotain.io/docs/guide/internals.html#grammar-recording for details",children:{}};class DA{initGastRecorder(e){this.recordingProdStack=[];this.RECORDING_PHASE=false}enableRecording(){this.RECORDING_PHASE=true;this.TRACE_INIT("Enable Recording",()=>{for(let e=0;e<10;e++){const n=e>0?e:"";this[`CONSUME${n}`]=function(r,i){return this.consumeInternalRecord(r,e,i)};this[`SUBRULE${n}`]=function(r,i){return this.subruleInternalRecord(r,e,i)};this[`OPTION${n}`]=function(r){return this.optionInternalRecord(r,e)};this[`OR${n}`]=function(r){return this.orInternalRecord(r,e)};this[`MANY${n}`]=function(r){this.manyInternalRecord(e,r)};this[`MANY_SEP${n}`]=function(r){this.manySepFirstInternalRecord(e,r)};this[`AT_LEAST_ONE${n}`]=function(r){this.atLeastOneInternalRecord(e,r)};this[`AT_LEAST_ONE_SEP${n}`]=function(r){this.atLeastOneSepFirstInternalRecord(e,r)}}this[`consume`]=function(e,n,r){return this.consumeInternalRecord(n,e,r)};this[`subrule`]=function(e,n,r){return this.subruleInternalRecord(n,e,r)};this[`option`]=function(e,n){return this.optionInternalRecord(n,e)};this[`or`]=function(e,n){return this.orInternalRecord(n,e)};this[`many`]=function(e,n){this.manyInternalRecord(e,n)};this[`atLeastOne`]=function(e,n){this.atLeastOneInternalRecord(e,n)};this.ACTION=this.ACTION_RECORD;this.BACKTRACK=this.BACKTRACK_RECORD;this.LA=this.LA_RECORD})}disableRecording(){this.RECORDING_PHASE=false;this.TRACE_INIT("Deleting Recording methods",()=>{const e=this;for(let n=0;n<10;n++){const r=n>0?n:"";delete e[`CONSUME${r}`];delete e[`SUBRULE${r}`];delete e[`OPTION${r}`];delete e[`OR${r}`];delete e[`MANY${r}`];delete e[`MANY_SEP${r}`];delete e[`AT_LEAST_ONE${r}`];delete e[`AT_LEAST_ONE_SEP${r}`]}delete e[`consume`];delete e[`subrule`];delete e[`option`];delete e[`or`];delete e[`many`];delete e[`atLeastOne`];delete e.ACTION;delete e.BACKTRACK;delete e.LA})}ACTION_RECORD(e){}BACKTRACK_RECORD(e,n){return()=>true}LA_RECORD(e){return hu}topLevelRuleRecord(e,n){try{const r=new Yr({definition:[],name:e});r.name=e;this.recordingProdStack.push(r);n.call(this);this.recordingProdStack.pop();return r}catch(r){if(r.KNOWN_RECORDER_ERROR!==true){try{r.message=r.message+'\n	 This error was thrown during the "grammar recording phase" For more info see:\n	https://chevrotain.io/docs/guide/internals.html#grammar-recording'}catch(i){throw r}}throw r}}optionInternalRecord(e,n){return ii.call(this,et,e,n)}atLeastOneInternalRecord(e,n){ii.call(this,Ot,n,e)}atLeastOneSepFirstInternalRecord(e,n){ii.call(this,_t,n,e,Ym)}manyInternalRecord(e,n){ii.call(this,ke,n,e)}manySepFirstInternalRecord(e,n){ii.call(this,Et,n,e,Ym)}orInternalRecord(e,n){return OA.call(this,e,n)}subruleInternalRecord(e,n,r){mu(n);if(!e||Q(e,"ruleName")===false){const o=new Error(`<SUBRULE${Qm(n)}> argument is invalid expecting a Parser method reference but got: <${JSON.stringify(e)}>
 inside top level rule: <${this.recordingProdStack[0].name}>`);o.KNOWN_RECORDER_ERROR=true;throw o}const i=Ur(this.recordingProdStack);const s=e.ruleName;const a=new pt({idx:n,nonTerminalName:s,label:r===null||r===void 0?void 0:r.LABEL,referencedRule:void 0});i.definition.push(a);return this.outputCst?PA:ic}consumeInternalRecord(e,n,r){mu(n);if(!bI(e)){const a=new Error(`<CONSUME${Qm(n)}> argument is invalid expecting a TokenType reference but got: <${JSON.stringify(e)}>
 inside top level rule: <${this.recordingProdStack[0].name}>`);a.KNOWN_RECORDER_ERROR=true;throw a}const i=Ur(this.recordingProdStack);const s=new Ee({idx:n,terminalType:e,label:r===null||r===void 0?void 0:r.LABEL});i.definition.push(s);return VI}}function ii(t,e,n,r=false){mu(n);const i=Ur(this.recordingProdStack);const s=Ln(e)?e:e.DEF;const a=new t({definition:[],idx:n});if(r){a.separator=e.SEP}if(Q(e,"MAX_LOOKAHEAD")){a.maxLookahead=e.MAX_LOOKAHEAD}this.recordingProdStack.push(a);s.call(this);i.definition.push(a);this.recordingProdStack.pop();return ic}function OA(t,e){mu(e);const n=Ur(this.recordingProdStack);const r=oe(t)===false;const i=r===false?t:t.DEF;const s=new $t({definition:[],idx:e,ignoreAmbiguities:r&&t.IGNORE_AMBIGUITIES===true});if(Q(t,"MAX_LOOKAHEAD")){s.maxLookahead=t.MAX_LOOKAHEAD}const a=pI(i,o=>Ln(o.GATE));s.hasPredicates=a;n.definition.push(s);X(i,o=>{const l=new Rt({definition:[]});s.definition.push(l);if(Q(o,"IGNORE_AMBIGUITIES")){l.ignoreAmbiguities=o.IGNORE_AMBIGUITIES}else if(Q(o,"GATE")){l.ignoreAmbiguities=true}this.recordingProdStack.push(l);o.ALT.call(this);this.recordingProdStack.pop()});return ic}function Qm(t){return t===0?"":`${t}`}function mu(t){if(t<0||t>Jm){const e=new Error(`Invalid DSL Method idx value: <${t}>
	Idx value must be a none negative value smaller than ${Jm+1}`);e.KNOWN_RECORDER_ERROR=true;throw e}}class _A{initPerformanceTracer(e){if(Q(e,"traceInitPerf")){const n=e.traceInitPerf;const r=typeof n==="number";this.traceInitMaxIdent=r?n:Infinity;this.traceInitPerf=r?n>0:n}else{this.traceInitMaxIdent=0;this.traceInitPerf=_n.traceInitPerf}this.traceInitIndent=-1}TRACE_INIT(e,n){if(this.traceInitPerf===true){this.traceInitIndent++;const r=new Array(this.traceInitIndent+1).join("	");if(this.traceInitIndent<this.traceInitMaxIdent){console.log(`${r}--> <${e}>`)}const{time:i,value:s}=yI(n);const a=i>10?console.warn:console.log;if(this.traceInitIndent<this.traceInitMaxIdent){a(`${r}<-- <${e}> time: ${i}ms`)}this.traceInitIndent--;return s}else{return n()}}}function BA(t,e){e.forEach(n=>{const r=n.prototype;Object.getOwnPropertyNames(r).forEach(i=>{if(i==="constructor"){return}const s=Object.getOwnPropertyDescriptor(r,i);if(s&&(s.get||s.set)){Object.defineProperty(t.prototype,i,s)}else{t.prototype[i]=n.prototype[i]}})})}const hu=Mp(zn,"",NaN,NaN,NaN,NaN,NaN,NaN);Object.freeze(hu);const _n=Object.freeze({recoveryEnabled:false,maxLookahead:3,dynamicTokensEnabled:false,outputCst:true,errorMessageProvider:Br,nodeLocationTracking:"none",traceInitPerf:false,skipValidations:false});const yu=Object.freeze({recoveryValueFunc:()=>void 0,resyncEnabled:true});var mt;(function(t){t[t["INVALID_RULE_NAME"]=0]="INVALID_RULE_NAME";t[t["DUPLICATE_RULE_NAME"]=1]="DUPLICATE_RULE_NAME";t[t["INVALID_RULE_OVERRIDE"]=2]="INVALID_RULE_OVERRIDE";t[t["DUPLICATE_PRODUCTIONS"]=3]="DUPLICATE_PRODUCTIONS";t[t["UNRESOLVED_SUBRULE_REF"]=4]="UNRESOLVED_SUBRULE_REF";t[t["LEFT_RECURSION"]=5]="LEFT_RECURSION";t[t["NONE_LAST_EMPTY_ALT"]=6]="NONE_LAST_EMPTY_ALT";t[t["AMBIGUOUS_ALTS"]=7]="AMBIGUOUS_ALTS";t[t["CONFLICT_TOKENS_RULES_NAMESPACE"]=8]="CONFLICT_TOKENS_RULES_NAMESPACE";t[t["INVALID_TOKEN_NAME"]=9]="INVALID_TOKEN_NAME";t[t["NO_NON_EMPTY_LOOKAHEAD"]=10]="NO_NON_EMPTY_LOOKAHEAD";t[t["AMBIGUOUS_PREFIX_ALTS"]=11]="AMBIGUOUS_PREFIX_ALTS";t[t["TOO_MANY_ALTS"]=12]="TOO_MANY_ALTS";t[t["CUSTOM_LOOKAHEAD_VALIDATION"]=13]="CUSTOM_LOOKAHEAD_VALIDATION"})(mt||(mt={}));function Zm(t=void 0){return function(){return t}}class ia{static performSelfAnalysis(e){throw Error("The **static** `performSelfAnalysis` method has been deprecated.	\nUse the **instance** method with the same name instead.")}performSelfAnalysis(){this.TRACE_INIT("performSelfAnalysis",()=>{let e;this.selfAnalysisDone=true;const n=this.className;this.TRACE_INIT("toFastProps",()=>{gI(this)});this.TRACE_INIT("Grammar Recording",()=>{try{this.enableRecording();X(this.definedRulesNames,i=>{const s=this[i];const a=s["originalGrammarAction"];let o;this.TRACE_INIT(`${i} Rule`,()=>{o=this.topLevelRuleRecord(i,a)});this.gastProductionsCache[i]=o})}finally{this.disableRecording()}});let r=[];this.TRACE_INIT("Grammar Resolving",()=>{r=aA({rules:qe(this.gastProductionsCache)});this.definitionErrors=this.definitionErrors.concat(r)});this.TRACE_INIT("Grammar Validations",()=>{if(ye(r)&&this.skipValidations===false){const i=oA({rules:qe(this.gastProductionsCache),tokenTypes:qe(this.tokensMap),errMsgProvider:fr,grammarName:n});const s=q1({lookaheadStrategy:this.lookaheadStrategy,rules:qe(this.gastProductionsCache),tokenTypes:qe(this.tokensMap),grammarName:n});this.definitionErrors=this.definitionErrors.concat(i,s)}});if(ye(this.definitionErrors)){if(this.recoveryEnabled){this.TRACE_INIT("computeAllProdsFollows",()=>{const i=Hb(qe(this.gastProductionsCache));this.resyncFollows=i})}this.TRACE_INIT("ComputeLookaheadFunctions",()=>{var i,s;(s=(i=this.lookaheadStrategy).initialize)===null||s===void 0?void 0:s.call(i,{rules:qe(this.gastProductionsCache)});this.preComputeLookaheadFunctions(qe(this.gastProductionsCache))})}if(!ia.DEFER_DEFINITION_ERRORS_HANDLING&&!ye(this.definitionErrors)){e=W(this.definitionErrors,i=>i.message);throw new Error(`Parser Definition Errors detected:
 ${e.join("\n-------------------------------\n")}`)}})}constructor(e,n){this.definitionErrors=[];this.selfAnalysisDone=false;const r=this;r.initErrorHandler(n);r.initLexerAdapter();r.initLooksAhead(n);r.initRecognizerEngine(e,n);r.initRecoverable(n);r.initTreeBuilder(n);r.initContentAssist();r.initGastRecorder(n);r.initPerformanceTracer(n);if(Q(n,"ignoredIssues")){throw new Error("The <ignoredIssues> IParserConfig property has been deprecated.\n	Please use the <IGNORE_AMBIGUITIES> flag on the relevant DSL method instead.\n	See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#IGNORING_AMBIGUITIES\n	For further details.")}this.skipValidations=Q(n,"skipValidations")?n.skipValidations:_n.skipValidations}}ia.DEFER_DEFINITION_ERRORS_HANDLING=false;BA(ia,[fA,hA,bA,AA,SA,MA,NA,kA,DA,_A]);class LA extends ia{constructor(e,n=_n){const r=tt(n);r.outputCst=false;super(e,r)}}function Gr(t,e,n){return`${t.name}_${e}_${n}`}const Xn=1;const xA=2;const zI=4;const XI=5;const sa=7;const FA=8;const KA=9;const UA=10;const WA=11;const YI=12;class Pp{constructor(e){this.target=e}isEpsilon(){return false}}class Dp extends Pp{constructor(e,n){super(e);this.tokenType=n}}class JI extends Pp{constructor(e){super(e)}isEpsilon(){return true}}class Op extends Pp{constructor(e,n,r){super(e);this.rule=n;this.followState=r}isEpsilon(){return true}}function GA(t){const e={decisionMap:{},decisionStates:[],ruleToStartState:new Map,ruleToStopState:new Map,states:[]};HA(e,t);const n=t.length;for(let r=0;r<n;r++){const i=t[r];const s=Ar(e,i,i);if(s===void 0){continue}tM(e,i,s)}return e}function HA(t,e){const n=e.length;for(let r=0;r<n;r++){const i=e[r];const s=je(t,i,void 0,{type:xA});const a=je(t,i,void 0,{type:sa});s.stop=a;t.ruleToStartState.set(i,s);t.ruleToStopState.set(i,a)}}function QI(t,e,n){if(n instanceof Ee){return _p(t,e,n.terminalType,n)}else if(n instanceof pt){return eM(t,e,n)}else if(n instanceof $t){return XA(t,e,n)}else if(n instanceof et){return YA(t,e,n)}else if(n instanceof ke){return qA(t,e,n)}else if(n instanceof Et){return jA(t,e,n)}else if(n instanceof Ot){return VA(t,e,n)}else if(n instanceof _t){return zA(t,e,n)}else{return Ar(t,e,n)}}function qA(t,e,n){const r=je(t,e,n,{type:XI});Zn(t,r);const i=Qr(t,e,r,n,Ar(t,e,n));return ev(t,e,n,i)}function jA(t,e,n){const r=je(t,e,n,{type:XI});Zn(t,r);const i=Qr(t,e,r,n,Ar(t,e,n));const s=_p(t,e,n.separator,n);return ev(t,e,n,i,s)}function VA(t,e,n){const r=je(t,e,n,{type:zI});Zn(t,r);const i=Qr(t,e,r,n,Ar(t,e,n));return ZI(t,e,n,i)}function zA(t,e,n){const r=je(t,e,n,{type:zI});Zn(t,r);const i=Qr(t,e,r,n,Ar(t,e,n));const s=_p(t,e,n.separator,n);return ZI(t,e,n,i,s)}function XA(t,e,n){const r=je(t,e,n,{type:Xn});Zn(t,r);const i=W(n.definition,a=>QI(t,e,a));const s=Qr(t,e,r,n,...i);return s}function YA(t,e,n){const r=je(t,e,n,{type:Xn});Zn(t,r);const i=Qr(t,e,r,n,Ar(t,e,n));return JA(t,e,n,i)}function Ar(t,e,n){const r=Dt(W(n.definition,i=>QI(t,e,i)),i=>i!==void 0);if(r.length===1){return r[0]}else if(r.length===0){return void 0}else{return ZA(t,r)}}function ZI(t,e,n,r,i){const s=r.left;const a=r.right;const o=je(t,e,n,{type:WA});Zn(t,o);const l=je(t,e,n,{type:YI});s.loopback=o;l.loopback=o;t.decisionMap[Gr(e,i?"RepetitionMandatoryWithSeparator":"RepetitionMandatory",n.idx)]=o;Ue(a,o);if(i===void 0){Ue(o,s);Ue(o,l)}else{Ue(o,l);Ue(o,i.left);Ue(i.right,s)}return{left:s,right:l}}function ev(t,e,n,r,i){const s=r.left;const a=r.right;const o=je(t,e,n,{type:UA});Zn(t,o);const l=je(t,e,n,{type:YI});const u=je(t,e,n,{type:KA});o.loopback=u;l.loopback=u;Ue(o,s);Ue(o,l);Ue(a,u);if(i!==void 0){Ue(u,l);Ue(u,i.left);Ue(i.right,s)}else{Ue(u,o)}t.decisionMap[Gr(e,i?"RepetitionWithSeparator":"Repetition",n.idx)]=o;return{left:o,right:l}}function JA(t,e,n,r){const i=r.left;const s=r.right;Ue(i,s);t.decisionMap[Gr(e,"Option",n.idx)]=i;return r}function Zn(t,e){t.decisionStates.push(e);e.decision=t.decisionStates.length-1;return e.decision}function Qr(t,e,n,r,...i){const s=je(t,e,r,{type:FA,start:n});n.end=s;for(const o of i){if(o!==void 0){Ue(n,o.left);Ue(o.right,s)}else{Ue(n,s)}}const a={left:n,right:s};t.decisionMap[Gr(e,QA(r),r.idx)]=n;return a}function QA(t){if(t instanceof $t){return"Alternation"}else if(t instanceof et){return"Option"}else if(t instanceof ke){return"Repetition"}else if(t instanceof Et){return"RepetitionWithSeparator"}else if(t instanceof Ot){return"RepetitionMandatory"}else if(t instanceof _t){return"RepetitionMandatoryWithSeparator"}else{throw new Error("Invalid production type encountered")}}function ZA(t,e){const n=e.length;for(let s=0;s<n-1;s++){const a=e[s];let o;if(a.left.transitions.length===1){o=a.left.transitions[0]}const l=o instanceof Op;const u=o;const c=e[s+1].left;if(a.left.type===Xn&&a.right.type===Xn&&o!==void 0&&(l&&u.followState===a.right||o.target===a.right)){if(l){u.followState=c}else{o.target=c}nM(t,a.right)}else{Ue(a.right,c)}}const r=e[0];const i=e[n-1];return{left:r.left,right:i.right}}function _p(t,e,n,r){const i=je(t,e,r,{type:Xn});const s=je(t,e,r,{type:Xn});Bp(i,new Dp(s,n));return{left:i,right:s}}function eM(t,e,n){const r=n.referencedRule;const i=t.ruleToStartState.get(r);const s=je(t,e,n,{type:Xn});const a=je(t,e,n,{type:Xn});const o=new Op(i,r,a);Bp(s,o);return{left:s,right:a}}function tM(t,e,n){const r=t.ruleToStartState.get(e);Ue(r,n.left);const i=t.ruleToStopState.get(e);Ue(n.right,i);const s={left:r,right:i};return s}function Ue(t,e){const n=new JI(e);Bp(t,n)}function je(t,e,n,r){const i=Object.assign({atn:t,production:n,epsilonOnlyTransitions:false,rule:e,transitions:[],nextTokenWithinRule:[],stateNumber:t.states.length},r);t.states.push(i);return i}function Bp(t,e){if(t.transitions.length===0){t.epsilonOnlyTransitions=e.isEpsilon()}t.transitions.push(e)}function nM(t,e){t.states.splice(t.states.indexOf(e),1)}const gu={};class zd{constructor(){this.map={};this.configs=[]}get size(){return this.configs.length}finalize(){this.map={}}add(e){const n=tv(e);if(!(n in this.map)){this.map[n]=this.configs.length;this.configs.push(e)}}get elements(){return this.configs}get alts(){return W(this.configs,e=>e.alt)}get key(){let e="";for(const n in this.map){e+=n+":"}return e}}function tv(t,e=true){return`${e?`a${t.alt}`:""}s${t.state.stateNumber}:${t.stack.map(n=>n.stateNumber.toString()).join("_")}`}function rM(t,e){const n={};return r=>{const i=r.toString();let s=n[i];if(s!==void 0){return s}else{s={atnStartState:t,decision:e,states:{}};n[i]=s;return s}}}class nv{constructor(){this.predicates=[]}is(e){return e>=this.predicates.length||this.predicates[e]}set(e,n){this.predicates[e]=n}toString(){let e="";const n=this.predicates.length;for(let r=0;r<n;r++){e+=this.predicates[r]===true?"1":"0"}return e}}const eh=new nv;class iM extends kp{constructor(e){var n;super();this.logging=(n=e===null||e===void 0?void 0:e.logging)!==null&&n!==void 0?n:r=>console.log(r)}initialize(e){this.atn=GA(e.rules);this.dfas=sM(this.atn)}validateAmbiguousAlternationAlternatives(){return[]}validateEmptyOrAlternatives(){return[]}buildLookaheadForAlternation(e){const{prodOccurrence:n,rule:r,hasPredicates:i,dynamicTokensEnabled:s}=e;const a=this.dfas;const o=this.logging;const l=Gr(r,"Alternation",n);const u=this.atn.decisionMap[l];const c=u.decision;const d=W(jm({maxLookahead:1,occurrence:n,prodType:"Alternation",rule:r}),f=>W(f,p=>p[0]));if(th(d,false)&&!s){const f=ft(d,(p,y,R)=>{X(y,A=>{if(A){p[A.tokenTypeIdx]=R;X(A.categoryMatches,v=>{p[v]=R})}});return p},{});if(i){return function(p){var y;const R=this.LA(1);const A=f[R.tokenTypeIdx];if(p!==void 0&&A!==void 0){const v=(y=p[A])===null||y===void 0?void 0:y.GATE;if(v!==void 0&&v.call(this)===false){return void 0}}return A}}else{return function(){const p=this.LA(1);return f[p.tokenTypeIdx]}}}else if(i){return function(f){const p=new nv;const y=f===void 0?0:f.length;for(let A=0;A<y;A++){const v=f===null||f===void 0?void 0:f[A].GATE;p.set(A,v===void 0||v.call(this))}const R=Rc.call(this,a,c,p,o);return typeof R==="number"?R:void 0}}else{return function(){const f=Rc.call(this,a,c,eh,o);return typeof f==="number"?f:void 0}}}buildLookaheadForOptional(e){const{prodOccurrence:n,rule:r,prodType:i,dynamicTokensEnabled:s}=e;const a=this.dfas;const o=this.logging;const l=Gr(r,i,n);const u=this.atn.decisionMap[l];const c=u.decision;const d=W(jm({maxLookahead:1,occurrence:n,prodType:i,rule:r}),f=>{return W(f,p=>p[0])});if(th(d)&&d[0][0]&&!s){const f=d[0];const p=Ft(f);if(p.length===1&&ye(p[0].categoryMatches)){const y=p[0];const R=y.tokenTypeIdx;return function(){return this.LA(1).tokenTypeIdx===R}}else{const y=ft(p,(R,A)=>{if(A!==void 0){R[A.tokenTypeIdx]=true;X(A.categoryMatches,v=>{R[v]=true})}return R},{});return function(){const R=this.LA(1);return y[R.tokenTypeIdx]===true}}}return function(){const f=Rc.call(this,a,c,eh,o);return typeof f==="object"?false:f===0}}}function th(t,e=true){const n=new Set;for(const r of t){const i=new Set;for(const s of r){if(s===void 0){if(e){break}else{return false}}const a=[s.tokenTypeIdx].concat(s.categoryMatches);for(const o of a){if(n.has(o)){if(!i.has(o)){return false}}else{n.add(o);i.add(o)}}}}return true}function sM(t){const e=t.decisionStates.length;const n=Array(e);for(let r=0;r<e;r++){n[r]=rM(t.decisionStates[r],r)}return n}function Rc(t,e,n,r){const i=t[e](n);let s=i.start;if(s===void 0){const o=yM(i.atnStartState);s=iv(i,rv(o));i.start=s}const a=aM.apply(this,[i,s,n,r]);return a}function aM(t,e,n,r){let i=e;let s=1;const a=[];let o=this.LA(s++);while(true){let l=fM(i,o);if(l===void 0){l=oM.apply(this,[t,i,o,s,n,r])}if(l===gu){return dM(a,i,o)}if(l.isAcceptState===true){return l.prediction}i=l;a.push(o);o=this.LA(s++)}}function oM(t,e,n,r,i,s){const a=pM(e.configs,n,i);if(a.size===0){nh(t,e,n,gu);return gu}let o=rv(a);const l=hM(a,i);if(l!==void 0){o.isAcceptState=true;o.prediction=l;o.configs.uniqueAlt=l}else if(RM(a)){const u=Cb(a.alts);o.isAcceptState=true;o.prediction=u;o.configs.uniqueAlt=u;lM.apply(this,[t,r,a.alts,s])}o=nh(t,e,n,o);return o}function lM(t,e,n,r){const i=[];for(let u=1;u<=e;u++){i.push(this.LA(u).tokenType)}const s=t.atnStartState;const a=s.rule;const o=s.production;const l=uM({topLevelRule:a,ambiguityIndices:n,production:o,prefixPath:i});r(l)}function uM(t){const e=W(t.prefixPath,i=>xr(i)).join(", ");const n=t.production.idx===0?"":t.production.idx;let r=`Ambiguous Alternatives Detected: <${t.ambiguityIndices.join(", ")}> in <${cM(t.production)}${n}> inside <${t.topLevelRule.name}> Rule,
<${e}> may appears as a prefix path in all these alternatives.
`;r=r+`See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#AMBIGUOUS_ALTERNATIVES
For Further details.`;return r}function cM(t){if(t instanceof pt){return"SUBRULE"}else if(t instanceof et){return"OPTION"}else if(t instanceof $t){return"OR"}else if(t instanceof Ot){return"AT_LEAST_ONE"}else if(t instanceof _t){return"AT_LEAST_ONE_SEP"}else if(t instanceof Et){return"MANY_SEP"}else if(t instanceof ke){return"MANY"}else if(t instanceof Ee){return"CONSUME"}else{throw Error("non exhaustive match")}}function dM(t,e,n){const r=kt(e.configs.elements,s=>s.state.transitions);const i=Ob(r.filter(s=>s instanceof Dp).map(s=>s.tokenType),s=>s.tokenTypeIdx);return{actualToken:n,possibleTokenTypes:i,tokenPath:t}}function fM(t,e){return t.edges[e.tokenTypeIdx]}function pM(t,e,n){const r=new zd;const i=[];for(const a of t.elements){if(n.is(a.alt)===false){continue}if(a.state.type===sa){i.push(a);continue}const o=a.state.transitions.length;for(let l=0;l<o;l++){const u=a.state.transitions[l];const c=mM(u,e);if(c!==void 0){r.add({state:c,alt:a.alt,stack:a.stack})}}}let s;if(i.length===0&&r.size===1){s=r}if(s===void 0){s=new zd;for(const a of r.elements){Iu(a,s)}}if(i.length>0&&!IM(s)){for(const a of i){s.add(a)}}return s}function mM(t,e){if(t instanceof Dp&&SI(e,t.tokenType)){return t.target}return void 0}function hM(t,e){let n;for(const r of t.elements){if(e.is(r.alt)===true){if(n===void 0){n=r.alt}else if(n!==r.alt){return void 0}}}return n}function rv(t){return{configs:t,edges:{},isAcceptState:false,prediction:-1}}function nh(t,e,n,r){r=iv(t,r);e.edges[n.tokenTypeIdx]=r;return r}function iv(t,e){if(e===gu){return e}const n=e.configs.key;const r=t.states[n];if(r!==void 0){return r}e.configs.finalize();t.states[n]=e;return e}function yM(t){const e=new zd;const n=t.transitions.length;for(let r=0;r<n;r++){const i=t.transitions[r].target;const s={state:i,alt:r,stack:[]};Iu(s,e)}return e}function Iu(t,e){const n=t.state;if(n.type===sa){if(t.stack.length>0){const i=[...t.stack];const s=i.pop();const a={state:s,alt:t.alt,stack:i};Iu(a,e)}else{e.add(t)}return}if(!n.epsilonOnlyTransitions){e.add(t)}const r=n.transitions.length;for(let i=0;i<r;i++){const s=n.transitions[i];const a=gM(t,s);if(a!==void 0){Iu(a,e)}}}function gM(t,e){if(e instanceof JI){return{state:e.target,alt:t.alt,stack:t.stack}}else if(e instanceof Op){const n=[...t.stack,e.followState];return{state:e.target,alt:t.alt,stack:n}}return void 0}function IM(t){for(const e of t.elements){if(e.state.type===sa){return true}}return false}function vM(t){for(const e of t.elements){if(e.state.type!==sa){return false}}return true}function RM(t){if(vM(t)){return true}const e=EM(t.elements);const n=$M(e)&&!TM(e);return n}function EM(t){const e=new Map;for(const n of t){const r=tv(n,false);let i=e.get(r);if(i===void 0){i={};e.set(r,i)}i[n.alt]=true}return e}function $M(t){for(const e of Array.from(t.values())){if(Object.keys(e).length>1){return true}}return false}function TM(t){for(const e of Array.from(t.values())){if(Object.keys(e).length===1){return true}}return false}var Xd;(function(t){function e(n){return typeof n==="string"}t.is=e})(Xd||(Xd={}));var vu;(function(t){function e(n){return typeof n==="string"}t.is=e})(vu||(vu={}));var Yd;(function(t){t.MIN_VALUE=-2147483648;t.MAX_VALUE=2147483647;function e(n){return typeof n==="number"&&t.MIN_VALUE<=n&&n<=t.MAX_VALUE}t.is=e})(Yd||(Yd={}));var Bs;(function(t){t.MIN_VALUE=0;t.MAX_VALUE=2147483647;function e(n){return typeof n==="number"&&t.MIN_VALUE<=n&&n<=t.MAX_VALUE}t.is=e})(Bs||(Bs={}));var le;(function(t){function e(r,i){if(r===Number.MAX_VALUE){r=Bs.MAX_VALUE}if(i===Number.MAX_VALUE){i=Bs.MAX_VALUE}return{line:r,character:i}}t.create=e;function n(r){let i=r;return E.objectLiteral(i)&&E.uinteger(i.line)&&E.uinteger(i.character)}t.is=n})(le||(le={}));var re;(function(t){function e(r,i,s,a){if(E.uinteger(r)&&E.uinteger(i)&&E.uinteger(s)&&E.uinteger(a)){return{start:le.create(r,i),end:le.create(s,a)}}else if(le.is(r)&&le.is(i)){return{start:r,end:i}}else{throw new Error(`Range#create called with invalid arguments[${r}, ${i}, ${s}, ${a}]`)}}t.create=e;function n(r){let i=r;return E.objectLiteral(i)&&le.is(i.start)&&le.is(i.end)}t.is=n})(re||(re={}));var Ls;(function(t){function e(r,i){return{uri:r,range:i}}t.create=e;function n(r){let i=r;return E.objectLiteral(i)&&re.is(i.range)&&(E.string(i.uri)||E.undefined(i.uri))}t.is=n})(Ls||(Ls={}));var Jd;(function(t){function e(r,i,s,a){return{targetUri:r,targetRange:i,targetSelectionRange:s,originSelectionRange:a}}t.create=e;function n(r){let i=r;return E.objectLiteral(i)&&re.is(i.targetRange)&&E.string(i.targetUri)&&re.is(i.targetSelectionRange)&&(re.is(i.originSelectionRange)||E.undefined(i.originSelectionRange))}t.is=n})(Jd||(Jd={}));var Ru;(function(t){function e(r,i,s,a){return{red:r,green:i,blue:s,alpha:a}}t.create=e;function n(r){const i=r;return E.objectLiteral(i)&&E.numberRange(i.red,0,1)&&E.numberRange(i.green,0,1)&&E.numberRange(i.blue,0,1)&&E.numberRange(i.alpha,0,1)}t.is=n})(Ru||(Ru={}));var Qd;(function(t){function e(r,i){return{range:r,color:i}}t.create=e;function n(r){const i=r;return E.objectLiteral(i)&&re.is(i.range)&&Ru.is(i.color)}t.is=n})(Qd||(Qd={}));var Zd;(function(t){function e(r,i,s){return{label:r,textEdit:i,additionalTextEdits:s}}t.create=e;function n(r){const i=r;return E.objectLiteral(i)&&E.string(i.label)&&(E.undefined(i.textEdit)||jt.is(i))&&(E.undefined(i.additionalTextEdits)||E.typedArray(i.additionalTextEdits,jt.is))}t.is=n})(Zd||(Zd={}));var ef;(function(t){t.Comment="comment";t.Imports="imports";t.Region="region"})(ef||(ef={}));var tf;(function(t){function e(r,i,s,a,o,l){const u={startLine:r,endLine:i};if(E.defined(s)){u.startCharacter=s}if(E.defined(a)){u.endCharacter=a}if(E.defined(o)){u.kind=o}if(E.defined(l)){u.collapsedText=l}return u}t.create=e;function n(r){const i=r;return E.objectLiteral(i)&&E.uinteger(i.startLine)&&E.uinteger(i.startLine)&&(E.undefined(i.startCharacter)||E.uinteger(i.startCharacter))&&(E.undefined(i.endCharacter)||E.uinteger(i.endCharacter))&&(E.undefined(i.kind)||E.string(i.kind))}t.is=n})(tf||(tf={}));var Eu;(function(t){function e(r,i){return{location:r,message:i}}t.create=e;function n(r){let i=r;return E.defined(i)&&Ls.is(i.location)&&E.string(i.message)}t.is=n})(Eu||(Eu={}));var nf;(function(t){t.Error=1;t.Warning=2;t.Information=3;t.Hint=4})(nf||(nf={}));var rf;(function(t){t.Unnecessary=1;t.Deprecated=2})(rf||(rf={}));var sf;(function(t){function e(n){const r=n;return E.objectLiteral(r)&&E.string(r.href)}t.is=e})(sf||(sf={}));var xs;(function(t){function e(r,i,s,a,o,l){let u={range:r,message:i};if(E.defined(s)){u.severity=s}if(E.defined(a)){u.code=a}if(E.defined(o)){u.source=o}if(E.defined(l)){u.relatedInformation=l}return u}t.create=e;function n(r){var i;let s=r;return E.defined(s)&&re.is(s.range)&&E.string(s.message)&&(E.number(s.severity)||E.undefined(s.severity))&&(E.integer(s.code)||E.string(s.code)||E.undefined(s.code))&&(E.undefined(s.codeDescription)||E.string((i=s.codeDescription)===null||i===void 0?void 0:i.href))&&(E.string(s.source)||E.undefined(s.source))&&(E.undefined(s.relatedInformation)||E.typedArray(s.relatedInformation,Eu.is))}t.is=n})(xs||(xs={}));var Er;(function(t){function e(r,i,...s){let a={title:r,command:i};if(E.defined(s)&&s.length>0){a.arguments=s}return a}t.create=e;function n(r){let i=r;return E.defined(i)&&E.string(i.title)&&E.string(i.command)}t.is=n})(Er||(Er={}));var jt;(function(t){function e(s,a){return{range:s,newText:a}}t.replace=e;function n(s,a){return{range:{start:s,end:s},newText:a}}t.insert=n;function r(s){return{range:s,newText:""}}t.del=r;function i(s){const a=s;return E.objectLiteral(a)&&E.string(a.newText)&&re.is(a.range)}t.is=i})(jt||(jt={}));var mr;(function(t){function e(r,i,s){const a={label:r};if(i!==void 0){a.needsConfirmation=i}if(s!==void 0){a.description=s}return a}t.create=e;function n(r){const i=r;return E.objectLiteral(i)&&E.string(i.label)&&(E.boolean(i.needsConfirmation)||i.needsConfirmation===void 0)&&(E.string(i.description)||i.description===void 0)}t.is=n})(mr||(mr={}));var Qe;(function(t){function e(n){const r=n;return E.string(r)}t.is=e})(Qe||(Qe={}));var wn;(function(t){function e(s,a,o){return{range:s,newText:a,annotationId:o}}t.replace=e;function n(s,a,o){return{range:{start:s,end:s},newText:a,annotationId:o}}t.insert=n;function r(s,a){return{range:s,newText:"",annotationId:a}}t.del=r;function i(s){const a=s;return jt.is(a)&&(mr.is(a.annotationId)||Qe.is(a.annotationId))}t.is=i})(wn||(wn={}));var Fs;(function(t){function e(r,i){return{textDocument:r,edits:i}}t.create=e;function n(r){let i=r;return E.defined(i)&&Ks.is(i.textDocument)&&Array.isArray(i.edits)}t.is=n})(Fs||(Fs={}));var Hr;(function(t){function e(r,i,s){let a={kind:"create",uri:r};if(i!==void 0&&(i.overwrite!==void 0||i.ignoreIfExists!==void 0)){a.options=i}if(s!==void 0){a.annotationId=s}return a}t.create=e;function n(r){let i=r;return i&&i.kind==="create"&&E.string(i.uri)&&(i.options===void 0||(i.options.overwrite===void 0||E.boolean(i.options.overwrite))&&(i.options.ignoreIfExists===void 0||E.boolean(i.options.ignoreIfExists)))&&(i.annotationId===void 0||Qe.is(i.annotationId))}t.is=n})(Hr||(Hr={}));var qr;(function(t){function e(r,i,s,a){let o={kind:"rename",oldUri:r,newUri:i};if(s!==void 0&&(s.overwrite!==void 0||s.ignoreIfExists!==void 0)){o.options=s}if(a!==void 0){o.annotationId=a}return o}t.create=e;function n(r){let i=r;return i&&i.kind==="rename"&&E.string(i.oldUri)&&E.string(i.newUri)&&(i.options===void 0||(i.options.overwrite===void 0||E.boolean(i.options.overwrite))&&(i.options.ignoreIfExists===void 0||E.boolean(i.options.ignoreIfExists)))&&(i.annotationId===void 0||Qe.is(i.annotationId))}t.is=n})(qr||(qr={}));var jr;(function(t){function e(r,i,s){let a={kind:"delete",uri:r};if(i!==void 0&&(i.recursive!==void 0||i.ignoreIfNotExists!==void 0)){a.options=i}if(s!==void 0){a.annotationId=s}return a}t.create=e;function n(r){let i=r;return i&&i.kind==="delete"&&E.string(i.uri)&&(i.options===void 0||(i.options.recursive===void 0||E.boolean(i.options.recursive))&&(i.options.ignoreIfNotExists===void 0||E.boolean(i.options.ignoreIfNotExists)))&&(i.annotationId===void 0||Qe.is(i.annotationId))}t.is=n})(jr||(jr={}));var $u;(function(t){function e(n){let r=n;return r&&(r.changes!==void 0||r.documentChanges!==void 0)&&(r.documentChanges===void 0||r.documentChanges.every(i=>{if(E.string(i.kind)){return Hr.is(i)||qr.is(i)||jr.is(i)}else{return Fs.is(i)}}))}t.is=e})($u||($u={}));class Ba{constructor(e,n){this.edits=e;this.changeAnnotations=n}insert(e,n,r){let i;let s;if(r===void 0){i=jt.insert(e,n)}else if(Qe.is(r)){s=r;i=wn.insert(e,n,r)}else{this.assertChangeAnnotations(this.changeAnnotations);s=this.changeAnnotations.manage(r);i=wn.insert(e,n,s)}this.edits.push(i);if(s!==void 0){return s}}replace(e,n,r){let i;let s;if(r===void 0){i=jt.replace(e,n)}else if(Qe.is(r)){s=r;i=wn.replace(e,n,r)}else{this.assertChangeAnnotations(this.changeAnnotations);s=this.changeAnnotations.manage(r);i=wn.replace(e,n,s)}this.edits.push(i);if(s!==void 0){return s}}delete(e,n){let r;let i;if(n===void 0){r=jt.del(e)}else if(Qe.is(n)){i=n;r=wn.del(e,n)}else{this.assertChangeAnnotations(this.changeAnnotations);i=this.changeAnnotations.manage(n);r=wn.del(e,i)}this.edits.push(r);if(i!==void 0){return i}}add(e){this.edits.push(e)}all(){return this.edits}clear(){this.edits.splice(0,this.edits.length)}assertChangeAnnotations(e){if(e===void 0){throw new Error(`Text edit change is not configured to manage change annotations.`)}}}class rh{constructor(e){this._annotations=e===void 0?Object.create(null):e;this._counter=0;this._size=0}all(){return this._annotations}get size(){return this._size}manage(e,n){let r;if(Qe.is(e)){r=e}else{r=this.nextId();n=e}if(this._annotations[r]!==void 0){throw new Error(`Id ${r} is already in use.`)}if(n===void 0){throw new Error(`No annotation provided for id ${r}`)}this._annotations[r]=n;this._size++;return r}nextId(){this._counter++;return this._counter.toString()}}class CM{constructor(e){this._textEditChanges=Object.create(null);if(e!==void 0){this._workspaceEdit=e;if(e.documentChanges){this._changeAnnotations=new rh(e.changeAnnotations);e.changeAnnotations=this._changeAnnotations.all();e.documentChanges.forEach(n=>{if(Fs.is(n)){const r=new Ba(n.edits,this._changeAnnotations);this._textEditChanges[n.textDocument.uri]=r}})}else if(e.changes){Object.keys(e.changes).forEach(n=>{const r=new Ba(e.changes[n]);this._textEditChanges[n]=r})}}else{this._workspaceEdit={}}}get edit(){this.initDocumentChanges();if(this._changeAnnotations!==void 0){if(this._changeAnnotations.size===0){this._workspaceEdit.changeAnnotations=void 0}else{this._workspaceEdit.changeAnnotations=this._changeAnnotations.all()}}return this._workspaceEdit}getTextEditChange(e){if(Ks.is(e)){this.initDocumentChanges();if(this._workspaceEdit.documentChanges===void 0){throw new Error("Workspace edit is not configured for document changes.")}const n={uri:e.uri,version:e.version};let r=this._textEditChanges[n.uri];if(!r){const i=[];const s={textDocument:n,edits:i};this._workspaceEdit.documentChanges.push(s);r=new Ba(i,this._changeAnnotations);this._textEditChanges[n.uri]=r}return r}else{this.initChanges();if(this._workspaceEdit.changes===void 0){throw new Error("Workspace edit is not configured for normal text edit changes.")}let n=this._textEditChanges[e];if(!n){let r=[];this._workspaceEdit.changes[e]=r;n=new Ba(r);this._textEditChanges[e]=n}return n}}initDocumentChanges(){if(this._workspaceEdit.documentChanges===void 0&&this._workspaceEdit.changes===void 0){this._changeAnnotations=new rh;this._workspaceEdit.documentChanges=[];this._workspaceEdit.changeAnnotations=this._changeAnnotations.all()}}initChanges(){if(this._workspaceEdit.documentChanges===void 0&&this._workspaceEdit.changes===void 0){this._workspaceEdit.changes=Object.create(null)}}createFile(e,n,r){this.initDocumentChanges();if(this._workspaceEdit.documentChanges===void 0){throw new Error("Workspace edit is not configured for document changes.")}let i;if(mr.is(n)||Qe.is(n)){i=n}else{r=n}let s;let a;if(i===void 0){s=Hr.create(e,r)}else{a=Qe.is(i)?i:this._changeAnnotations.manage(i);s=Hr.create(e,r,a)}this._workspaceEdit.documentChanges.push(s);if(a!==void 0){return a}}renameFile(e,n,r,i){this.initDocumentChanges();if(this._workspaceEdit.documentChanges===void 0){throw new Error("Workspace edit is not configured for document changes.")}let s;if(mr.is(r)||Qe.is(r)){s=r}else{i=r}let a;let o;if(s===void 0){a=qr.create(e,n,i)}else{o=Qe.is(s)?s:this._changeAnnotations.manage(s);a=qr.create(e,n,i,o)}this._workspaceEdit.documentChanges.push(a);if(o!==void 0){return o}}deleteFile(e,n,r){this.initDocumentChanges();if(this._workspaceEdit.documentChanges===void 0){throw new Error("Workspace edit is not configured for document changes.")}let i;if(mr.is(n)||Qe.is(n)){i=n}else{r=n}let s;let a;if(i===void 0){s=jr.create(e,r)}else{a=Qe.is(i)?i:this._changeAnnotations.manage(i);s=jr.create(e,r,a)}this._workspaceEdit.documentChanges.push(s);if(a!==void 0){return a}}}var af;(function(t){function e(r){return{uri:r}}t.create=e;function n(r){let i=r;return E.defined(i)&&E.string(i.uri)}t.is=n})(af||(af={}));var of;(function(t){function e(r,i){return{uri:r,version:i}}t.create=e;function n(r){let i=r;return E.defined(i)&&E.string(i.uri)&&E.integer(i.version)}t.is=n})(of||(of={}));var Ks;(function(t){function e(r,i){return{uri:r,version:i}}t.create=e;function n(r){let i=r;return E.defined(i)&&E.string(i.uri)&&(i.version===null||E.integer(i.version))}t.is=n})(Ks||(Ks={}));var lf;(function(t){function e(r,i,s,a){return{uri:r,languageId:i,version:s,text:a}}t.create=e;function n(r){let i=r;return E.defined(i)&&E.string(i.uri)&&E.string(i.languageId)&&E.integer(i.version)&&E.string(i.text)}t.is=n})(lf||(lf={}));var Tu;(function(t){t.PlainText="plaintext";t.Markdown="markdown";function e(n){const r=n;return r===t.PlainText||r===t.Markdown}t.is=e})(Tu||(Tu={}));var Vr;(function(t){function e(n){const r=n;return E.objectLiteral(n)&&Tu.is(r.kind)&&E.string(r.value)}t.is=e})(Vr||(Vr={}));var bn;(function(t){t.Text=1;t.Method=2;t.Function=3;t.Constructor=4;t.Field=5;t.Variable=6;t.Class=7;t.Interface=8;t.Module=9;t.Property=10;t.Unit=11;t.Value=12;t.Enum=13;t.Keyword=14;t.Snippet=15;t.Color=16;t.File=17;t.Reference=18;t.Folder=19;t.EnumMember=20;t.Constant=21;t.Struct=22;t.Event=23;t.Operator=24;t.TypeParameter=25})(bn||(bn={}));var uf;(function(t){t.PlainText=1;t.Snippet=2})(uf||(uf={}));var cf;(function(t){t.Deprecated=1})(cf||(cf={}));var df;(function(t){function e(r,i,s){return{newText:r,insert:i,replace:s}}t.create=e;function n(r){const i=r;return i&&E.string(i.newText)&&re.is(i.insert)&&re.is(i.replace)}t.is=n})(df||(df={}));var ff;(function(t){t.asIs=1;t.adjustIndentation=2})(ff||(ff={}));var pf;(function(t){function e(n){const r=n;return r&&(E.string(r.detail)||r.detail===void 0)&&(E.string(r.description)||r.description===void 0)}t.is=e})(pf||(pf={}));var mf;(function(t){function e(n){return{label:n}}t.create=e})(mf||(mf={}));var hf;(function(t){function e(n,r){return{items:n?n:[],isIncomplete:!!r}}t.create=e})(hf||(hf={}));var Us;(function(t){function e(r){return r.replace(/[\\`*_{}[\]()#+\-.!]/g,"\\$&")}t.fromPlainText=e;function n(r){const i=r;return E.string(i)||E.objectLiteral(i)&&E.string(i.language)&&E.string(i.value)}t.is=n})(Us||(Us={}));var yf;(function(t){function e(n){let r=n;return!!r&&E.objectLiteral(r)&&(Vr.is(r.contents)||Us.is(r.contents)||E.typedArray(r.contents,Us.is))&&(n.range===void 0||re.is(n.range))}t.is=e})(yf||(yf={}));var gf;(function(t){function e(n,r){return r?{label:n,documentation:r}:{label:n}}t.create=e})(gf||(gf={}));var If;(function(t){function e(n,r,...i){let s={label:n};if(E.defined(r)){s.documentation=r}if(E.defined(i)){s.parameters=i}else{s.parameters=[]}return s}t.create=e})(If||(If={}));var vf;(function(t){t.Text=1;t.Read=2;t.Write=3})(vf||(vf={}));var Rf;(function(t){function e(n,r){let i={range:n};if(E.number(r)){i.kind=r}return i}t.create=e})(Rf||(Rf={}));var An;(function(t){t.File=1;t.Module=2;t.Namespace=3;t.Package=4;t.Class=5;t.Method=6;t.Property=7;t.Field=8;t.Constructor=9;t.Enum=10;t.Interface=11;t.Function=12;t.Variable=13;t.Constant=14;t.String=15;t.Number=16;t.Boolean=17;t.Array=18;t.Object=19;t.Key=20;t.Null=21;t.EnumMember=22;t.Struct=23;t.Event=24;t.Operator=25;t.TypeParameter=26})(An||(An={}));var Ef;(function(t){t.Deprecated=1})(Ef||(Ef={}));var $f;(function(t){function e(n,r,i,s,a){let o={name:n,kind:r,location:{uri:s,range:i}};if(a){o.containerName=a}return o}t.create=e})($f||($f={}));var Tf;(function(t){function e(n,r,i,s){return s!==void 0?{name:n,kind:r,location:{uri:i,range:s}}:{name:n,kind:r,location:{uri:i}}}t.create=e})(Tf||(Tf={}));var Cf;(function(t){function e(r,i,s,a,o,l){let u={name:r,detail:i,kind:s,range:a,selectionRange:o};if(l!==void 0){u.children=l}return u}t.create=e;function n(r){let i=r;return i&&E.string(i.name)&&E.number(i.kind)&&re.is(i.range)&&re.is(i.selectionRange)&&(i.detail===void 0||E.string(i.detail))&&(i.deprecated===void 0||E.boolean(i.deprecated))&&(i.children===void 0||Array.isArray(i.children))&&(i.tags===void 0||Array.isArray(i.tags))}t.is=n})(Cf||(Cf={}));var wf;(function(t){t.Empty="";t.QuickFix="quickfix";t.Refactor="refactor";t.RefactorExtract="refactor.extract";t.RefactorInline="refactor.inline";t.RefactorRewrite="refactor.rewrite";t.Source="source";t.SourceOrganizeImports="source.organizeImports";t.SourceFixAll="source.fixAll"})(wf||(wf={}));var Ws;(function(t){t.Invoked=1;t.Automatic=2})(Ws||(Ws={}));var bf;(function(t){function e(r,i,s){let a={diagnostics:r};if(i!==void 0&&i!==null){a.only=i}if(s!==void 0&&s!==null){a.triggerKind=s}return a}t.create=e;function n(r){let i=r;return E.defined(i)&&E.typedArray(i.diagnostics,xs.is)&&(i.only===void 0||E.typedArray(i.only,E.string))&&(i.triggerKind===void 0||i.triggerKind===Ws.Invoked||i.triggerKind===Ws.Automatic)}t.is=n})(bf||(bf={}));var Af;(function(t){function e(r,i,s){let a={title:r};let o=true;if(typeof i==="string"){o=false;a.kind=i}else if(Er.is(i)){a.command=i}else{a.edit=i}if(o&&s!==void 0){a.kind=s}return a}t.create=e;function n(r){let i=r;return i&&E.string(i.title)&&(i.diagnostics===void 0||E.typedArray(i.diagnostics,xs.is))&&(i.kind===void 0||E.string(i.kind))&&(i.edit!==void 0||i.command!==void 0)&&(i.command===void 0||Er.is(i.command))&&(i.isPreferred===void 0||E.boolean(i.isPreferred))&&(i.edit===void 0||$u.is(i.edit))}t.is=n})(Af||(Af={}));var Mf;(function(t){function e(r,i){let s={range:r};if(E.defined(i)){s.data=i}return s}t.create=e;function n(r){let i=r;return E.defined(i)&&re.is(i.range)&&(E.undefined(i.command)||Er.is(i.command))}t.is=n})(Mf||(Mf={}));var Sf;(function(t){function e(r,i){return{tabSize:r,insertSpaces:i}}t.create=e;function n(r){let i=r;return E.defined(i)&&E.uinteger(i.tabSize)&&E.boolean(i.insertSpaces)}t.is=n})(Sf||(Sf={}));var Nf;(function(t){function e(r,i,s){return{range:r,target:i,data:s}}t.create=e;function n(r){let i=r;return E.defined(i)&&re.is(i.range)&&(E.undefined(i.target)||E.string(i.target))}t.is=n})(Nf||(Nf={}));var kf;(function(t){function e(r,i){return{range:r,parent:i}}t.create=e;function n(r){let i=r;return E.objectLiteral(i)&&re.is(i.range)&&(i.parent===void 0||t.is(i.parent))}t.is=n})(kf||(kf={}));var Pf;(function(t){t["namespace"]="namespace";t["type"]="type";t["class"]="class";t["enum"]="enum";t["interface"]="interface";t["struct"]="struct";t["typeParameter"]="typeParameter";t["parameter"]="parameter";t["variable"]="variable";t["property"]="property";t["enumMember"]="enumMember";t["event"]="event";t["function"]="function";t["method"]="method";t["macro"]="macro";t["keyword"]="keyword";t["modifier"]="modifier";t["comment"]="comment";t["string"]="string";t["number"]="number";t["regexp"]="regexp";t["operator"]="operator";t["decorator"]="decorator"})(Pf||(Pf={}));var Df;(function(t){t["declaration"]="declaration";t["definition"]="definition";t["readonly"]="readonly";t["static"]="static";t["deprecated"]="deprecated";t["abstract"]="abstract";t["async"]="async";t["modification"]="modification";t["documentation"]="documentation";t["defaultLibrary"]="defaultLibrary"})(Df||(Df={}));var Of;(function(t){function e(n){const r=n;return E.objectLiteral(r)&&(r.resultId===void 0||typeof r.resultId==="string")&&Array.isArray(r.data)&&(r.data.length===0||typeof r.data[0]==="number")}t.is=e})(Of||(Of={}));var _f;(function(t){function e(r,i){return{range:r,text:i}}t.create=e;function n(r){const i=r;return i!==void 0&&i!==null&&re.is(i.range)&&E.string(i.text)}t.is=n})(_f||(_f={}));var Bf;(function(t){function e(r,i,s){return{range:r,variableName:i,caseSensitiveLookup:s}}t.create=e;function n(r){const i=r;return i!==void 0&&i!==null&&re.is(i.range)&&E.boolean(i.caseSensitiveLookup)&&(E.string(i.variableName)||i.variableName===void 0)}t.is=n})(Bf||(Bf={}));var Lf;(function(t){function e(r,i){return{range:r,expression:i}}t.create=e;function n(r){const i=r;return i!==void 0&&i!==null&&re.is(i.range)&&(E.string(i.expression)||i.expression===void 0)}t.is=n})(Lf||(Lf={}));var xf;(function(t){function e(r,i){return{frameId:r,stoppedLocation:i}}t.create=e;function n(r){const i=r;return E.defined(i)&&re.is(r.stoppedLocation)}t.is=n})(xf||(xf={}));var Cu;(function(t){t.Type=1;t.Parameter=2;function e(n){return n===1||n===2}t.is=e})(Cu||(Cu={}));var wu;(function(t){function e(r){return{value:r}}t.create=e;function n(r){const i=r;return E.objectLiteral(i)&&(i.tooltip===void 0||E.string(i.tooltip)||Vr.is(i.tooltip))&&(i.location===void 0||Ls.is(i.location))&&(i.command===void 0||Er.is(i.command))}t.is=n})(wu||(wu={}));var Ff;(function(t){function e(r,i,s){const a={position:r,label:i};if(s!==void 0){a.kind=s}return a}t.create=e;function n(r){const i=r;return E.objectLiteral(i)&&le.is(i.position)&&(E.string(i.label)||E.typedArray(i.label,wu.is))&&(i.kind===void 0||Cu.is(i.kind))&&i.textEdits===void 0||E.typedArray(i.textEdits,jt.is)&&(i.tooltip===void 0||E.string(i.tooltip)||Vr.is(i.tooltip))&&(i.paddingLeft===void 0||E.boolean(i.paddingLeft))&&(i.paddingRight===void 0||E.boolean(i.paddingRight))}t.is=n})(Ff||(Ff={}));var Kf;(function(t){function e(n){return{kind:"snippet",value:n}}t.createSnippet=e})(Kf||(Kf={}));var Uf;(function(t){function e(n,r,i,s){return{insertText:n,filterText:r,range:i,command:s}}t.create=e})(Uf||(Uf={}));var Wf;(function(t){function e(n){return{items:n}}t.create=e})(Wf||(Wf={}));var Gf;(function(t){t.Invoked=0;t.Automatic=1})(Gf||(Gf={}));var Hf;(function(t){function e(n,r){return{range:n,text:r}}t.create=e})(Hf||(Hf={}));var qf;(function(t){function e(n,r){return{triggerKind:n,selectedCompletionInfo:r}}t.create=e})(qf||(qf={}));var jf;(function(t){function e(n){const r=n;return E.objectLiteral(r)&&vu.is(r.uri)&&E.string(r.name)}t.is=e})(jf||(jf={}));const wM=["\n","\r\n","\r"];var Vf;(function(t){function e(s,a,o,l){return new bM(s,a,o,l)}t.create=e;function n(s){let a=s;return E.defined(a)&&E.string(a.uri)&&(E.undefined(a.languageId)||E.string(a.languageId))&&E.uinteger(a.lineCount)&&E.func(a.getText)&&E.func(a.positionAt)&&E.func(a.offsetAt)?true:false}t.is=n;function r(s,a){let o=s.getText();let l=i(a,(c,d)=>{let f=c.range.start.line-d.range.start.line;if(f===0){return c.range.start.character-d.range.start.character}return f});let u=o.length;for(let c=l.length-1;c>=0;c--){let d=l[c];let f=s.offsetAt(d.range.start);let p=s.offsetAt(d.range.end);if(p<=u){o=o.substring(0,f)+d.newText+o.substring(p,o.length)}else{throw new Error("Overlapping edit")}u=f}return o}t.applyEdits=r;function i(s,a){if(s.length<=1){return s}const o=s.length/2|0;const l=s.slice(0,o);const u=s.slice(o);i(l,a);i(u,a);let c=0;let d=0;let f=0;while(c<l.length&&d<u.length){let p=a(l[c],u[d]);if(p<=0){s[f++]=l[c++]}else{s[f++]=u[d++]}}while(c<l.length){s[f++]=l[c++]}while(d<u.length){s[f++]=u[d++]}return s}})(Vf||(Vf={}));let bM=class xP{constructor(e,n,r,i){this._uri=e;this._languageId=n;this._version=r;this._content=i;this._lineOffsets=void 0}get uri(){return this._uri}get languageId(){return this._languageId}get version(){return this._version}getText(e){if(e){let n=this.offsetAt(e.start);let r=this.offsetAt(e.end);return this._content.substring(n,r)}return this._content}update(e,n){this._content=e.text;this._version=n;this._lineOffsets=void 0}getLineOffsets(){if(this._lineOffsets===void 0){let e=[];let n=this._content;let r=true;for(let i=0;i<n.length;i++){if(r){e.push(i);r=false}let s=n.charAt(i);r=s==="\r"||s==="\n";if(s==="\r"&&i+1<n.length&&n.charAt(i+1)==="\n"){i++}}if(r&&n.length>0){e.push(n.length)}this._lineOffsets=e}return this._lineOffsets}positionAt(e){e=Math.max(Math.min(e,this._content.length),0);let n=this.getLineOffsets();let r=0,i=n.length;if(i===0){return le.create(0,e)}while(r<i){let a=Math.floor((r+i)/2);if(n[a]>e){i=a}else{r=a+1}}let s=r-1;return le.create(s,e-n[s])}offsetAt(e){let n=this.getLineOffsets();if(e.line>=n.length){return this._content.length}else if(e.line<0){return 0}let r=n[e.line];let i=e.line+1<n.length?n[e.line+1]:this._content.length;return Math.max(Math.min(r+e.character,i),r)}get lineCount(){return this.getLineOffsets().length}};var E;(function(t){const e=Object.prototype.toString;function n(p){return typeof p!=="undefined"}t.defined=n;function r(p){return typeof p==="undefined"}t.undefined=r;function i(p){return p===true||p===false}t.boolean=i;function s(p){return e.call(p)==="[object String]"}t.string=s;function a(p){return e.call(p)==="[object Number]"}t.number=a;function o(p,y,R){return e.call(p)==="[object Number]"&&y<=p&&p<=R}t.numberRange=o;function l(p){return e.call(p)==="[object Number]"&&-2147483648<=p&&p<=2147483647}t.integer=l;function u(p){return e.call(p)==="[object Number]"&&0<=p&&p<=2147483647}t.uinteger=u;function c(p){return e.call(p)==="[object Function]"}t.func=c;function d(p){return p!==null&&typeof p==="object"}t.objectLiteral=d;function f(p,y){return Array.isArray(p)&&p.every(y)}t.typedArray=f})(E||(E={}));var AM=Object.freeze({__proto__:null,get AnnotatedTextEdit(){return wn},get ChangeAnnotation(){return mr},get ChangeAnnotationIdentifier(){return Qe},get CodeAction(){return Af},get CodeActionContext(){return bf},get CodeActionKind(){return wf},get CodeActionTriggerKind(){return Ws},get CodeDescription(){return sf},get CodeLens(){return Mf},get Color(){return Ru},get ColorInformation(){return Qd},get ColorPresentation(){return Zd},get Command(){return Er},get CompletionItem(){return mf},get CompletionItemKind(){return bn},get CompletionItemLabelDetails(){return pf},get CompletionItemTag(){return cf},get CompletionList(){return hf},get CreateFile(){return Hr},get DeleteFile(){return jr},get Diagnostic(){return xs},get DiagnosticRelatedInformation(){return Eu},get DiagnosticSeverity(){return nf},get DiagnosticTag(){return rf},get DocumentHighlight(){return Rf},get DocumentHighlightKind(){return vf},get DocumentLink(){return Nf},get DocumentSymbol(){return Cf},get DocumentUri(){return Xd},EOL:wM,get FoldingRange(){return tf},get FoldingRangeKind(){return ef},get FormattingOptions(){return Sf},get Hover(){return yf},get InlayHint(){return Ff},get InlayHintKind(){return Cu},get InlayHintLabelPart(){return wu},get InlineCompletionContext(){return qf},get InlineCompletionItem(){return Uf},get InlineCompletionList(){return Wf},get InlineCompletionTriggerKind(){return Gf},get InlineValueContext(){return xf},get InlineValueEvaluatableExpression(){return Lf},get InlineValueText(){return _f},get InlineValueVariableLookup(){return Bf},get InsertReplaceEdit(){return df},get InsertTextFormat(){return uf},get InsertTextMode(){return ff},get Location(){return Ls},get LocationLink(){return Jd},get MarkedString(){return Us},get MarkupContent(){return Vr},get MarkupKind(){return Tu},get OptionalVersionedTextDocumentIdentifier(){return Ks},get ParameterInformation(){return gf},get Position(){return le},get Range(){return re},get RenameFile(){return qr},get SelectedCompletionInfo(){return Hf},get SelectionRange(){return kf},get SemanticTokenModifiers(){return Df},get SemanticTokenTypes(){return Pf},get SemanticTokens(){return Of},get SignatureInformation(){return If},get StringValue(){return Kf},get SymbolInformation(){return $f},get SymbolKind(){return An},get SymbolTag(){return Ef},get TextDocument(){return Vf},get TextDocumentEdit(){return Fs},get TextDocumentIdentifier(){return af},get TextDocumentItem(){return lf},get TextEdit(){return jt},get URI(){return vu},get VersionedTextDocumentIdentifier(){return of},WorkspaceChange:CM,get WorkspaceEdit(){return $u},get WorkspaceFolder(){return jf},get WorkspaceSymbol(){return Tf},get integer(){return Yd},get uinteger(){return Bs}});class MM{constructor(){this.nodeStack=[]}get current(){var e;return(e=this.nodeStack[this.nodeStack.length-1])!==null&&e!==void 0?e:this.rootNode}buildRootNode(e){this.rootNode=new av(e);this.rootNode.root=this.rootNode;this.nodeStack=[this.rootNode];return this.rootNode}buildCompositeNode(e){const n=new Lp;n.grammarSource=e;n.root=this.rootNode;this.current.content.push(n);this.nodeStack.push(n);return n}buildLeafNode(e,n){const r=new zf(e.startOffset,e.image.length,Nd(e),e.tokenType,!n);r.grammarSource=n;r.root=this.rootNode;this.current.content.push(r);return r}removeNode(e){const n=e.container;if(n){const r=n.content.indexOf(e);if(r>=0){n.content.splice(r,1)}}}addHiddenNodes(e){const n=[];for(const s of e){const a=new zf(s.startOffset,s.image.length,Nd(s),s.tokenType,true);a.root=this.rootNode;n.push(a)}let r=this.current;let i=false;if(r.content.length>0){r.content.push(...n);return}while(r.container){const s=r.container.content.indexOf(r);if(s>0){r.container.content.splice(s,0,...n);i=true;break}r=r.container}if(!i){this.rootNode.content.unshift(...n)}}construct(e){const n=this.current;if(typeof e.$type==="string"){this.current.astNode=e}e.$cstNode=n;const r=this.nodeStack.pop();if((r===null||r===void 0?void 0:r.content.length)===0){this.removeNode(r)}}}class sv{get parent(){return this.container}get feature(){return this.grammarSource}get hidden(){return false}get astNode(){var e,n;const r=typeof((e=this._astNode)===null||e===void 0?void 0:e.$type)==="string"?this._astNode:(n=this.container)===null||n===void 0?void 0:n.astNode;if(!r){throw new Error("This node has no associated AST element")}return r}set astNode(e){this._astNode=e}get element(){return this.astNode}get text(){return this.root.fullText.substring(this.offset,this.end)}}class zf extends sv{get offset(){return this._offset}get length(){return this._length}get end(){return this._offset+this._length}get hidden(){return this._hidden}get tokenType(){return this._tokenType}get range(){return this._range}constructor(e,n,r,i,s=false){super();this._hidden=s;this._offset=e;this._tokenType=i;this._length=n;this._range=r}}class Lp extends sv{constructor(){super(...arguments);this.content=new xp(this)}get children(){return this.content}get offset(){var e,n;return(n=(e=this.firstNonHiddenNode)===null||e===void 0?void 0:e.offset)!==null&&n!==void 0?n:0}get length(){return this.end-this.offset}get end(){var e,n;return(n=(e=this.lastNonHiddenNode)===null||e===void 0?void 0:e.end)!==null&&n!==void 0?n:0}get range(){const e=this.firstNonHiddenNode;const n=this.lastNonHiddenNode;if(e&&n){if(this._rangeCache===void 0){const{range:r}=e;const{range:i}=n;this._rangeCache={start:r.start,end:i.end.line<r.start.line?r.start:i.end}}return this._rangeCache}else{return{start:le.create(0,0),end:le.create(0,0)}}}get firstNonHiddenNode(){for(const e of this.content){if(!e.hidden){return e}}return this.content[0]}get lastNonHiddenNode(){for(let e=this.content.length-1;e>=0;e--){const n=this.content[e];if(!n.hidden){return n}}return this.content[this.content.length-1]}}class xp extends Array{constructor(e){super();this.parent=e;Object.setPrototypeOf(this,xp.prototype)}push(...e){this.addParents(e);return super.push(...e)}unshift(...e){this.addParents(e);return super.unshift(...e)}splice(e,n,...r){this.addParents(r);return super.splice(e,n,...r)}addParents(e){for(const n of e){n.container=this.parent}}}class av extends Lp{get text(){return this._text.substring(this.offset,this.end)}get fullText(){return this._text}constructor(e){super();this._text="";this._text=e!==null&&e!==void 0?e:""}}const Xf=Symbol("Datatype");function Ec(t){return t.$type===Xf}const ih="​";const ov=t=>t.endsWith(ih)?t:t+ih;class lv{constructor(e){this._unorderedGroups=new Map;this.allRules=new Map;this.lexer=e.parser.Lexer;const n=this.lexer.definition;const r=e.LanguageMetaData.mode==="production";this.wrapper=new DM(n,Object.assign(Object.assign({},e.parser.ParserConfig),{skipValidations:r,errorMessageProvider:e.parser.ParserErrorMessageProvider}))}alternatives(e,n){this.wrapper.wrapOr(e,n)}optional(e,n){this.wrapper.wrapOption(e,n)}many(e,n){this.wrapper.wrapMany(e,n)}atLeastOne(e,n){this.wrapper.wrapAtLeastOne(e,n)}getRule(e){return this.allRules.get(e)}isRecording(){return this.wrapper.IS_RECORDING}get unorderedGroups(){return this._unorderedGroups}getRuleStack(){return this.wrapper.RULE_STACK}finalize(){this.wrapper.wrapSelfAnalysis()}}class SM extends lv{get current(){return this.stack[this.stack.length-1]}constructor(e){super(e);this.nodeBuilder=new MM;this.stack=[];this.assignmentMap=new Map;this.linker=e.references.Linker;this.converter=e.parser.ValueConverter;this.astReflection=e.shared.AstReflection}rule(e,n){const r=this.computeRuleType(e);const i=this.wrapper.DEFINE_RULE(ov(e.name),this.startImplementation(r,n).bind(this));this.allRules.set(e.name,i);if(e.entry){this.mainRule=i}return i}computeRuleType(e){if(e.fragment){return void 0}else if(Bg(e)){return Xf}else{const n=Xs(e);return n!==null&&n!==void 0?n:e.name}}parse(e,n={}){this.nodeBuilder.buildRootNode(e);const r=this.lexerResult=this.lexer.tokenize(e);this.wrapper.input=r.tokens;const i=n.rule?this.allRules.get(n.rule):this.mainRule;if(!i){throw new Error(n.rule?`No rule found with name '${n.rule}'`:"No main rule available.")}const s=i.call(this.wrapper,{});this.nodeBuilder.addHiddenNodes(r.hidden);this.unorderedGroups.clear();this.lexerResult=void 0;return{value:s,lexerErrors:r.errors,lexerReport:r.report,parserErrors:this.wrapper.errors}}startImplementation(e,n){return r=>{const i=!this.isRecording()&&e!==void 0;if(i){const a={$type:e};this.stack.push(a);if(e===Xf){a.value=""}}let s;try{s=n(r)}catch(a){s=void 0}if(s===void 0&&i){s=this.construct()}return s}}extractHiddenTokens(e){const n=this.lexerResult.hidden;if(!n.length){return[]}const r=e.startOffset;for(let i=0;i<n.length;i++){const s=n[i];if(s.startOffset>r){return n.splice(0,i)}}return n.splice(0,n.length)}consume(e,n,r){const i=this.wrapper.wrapConsume(e,n);if(!this.isRecording()&&this.isValidToken(i)){const s=this.extractHiddenTokens(i);this.nodeBuilder.addHiddenNodes(s);const a=this.nodeBuilder.buildLeafNode(i,r);const{assignment:o,isCrossRef:l}=this.getAssignment(r);const u=this.current;if(o){const c=an(r)?i.image:this.converter.convert(i.image,a);this.assign(o.operator,o.feature,c,a,l)}else if(Ec(u)){let c=i.image;if(!an(r)){c=this.converter.convert(c,a).toString()}u.value+=c}}}isValidToken(e){return!e.isInsertedInRecovery&&!isNaN(e.startOffset)&&typeof e.endOffset==="number"&&!isNaN(e.endOffset)}subrule(e,n,r,i,s){let a;if(!this.isRecording()&&!r){a=this.nodeBuilder.buildCompositeNode(i)}const o=this.wrapper.wrapSubrule(e,n,s);if(!this.isRecording()&&a&&a.length>0){this.performSubruleAssignment(o,i,a)}}performSubruleAssignment(e,n,r){const{assignment:i,isCrossRef:s}=this.getAssignment(n);if(i){this.assign(i.operator,i.feature,e,r,s)}else if(!i){const a=this.current;if(Ec(a)){a.value+=e.toString()}else if(typeof e==="object"&&e){const o=this.assignWithoutOverride(e,a);const l=o;this.stack.pop();this.stack.push(l)}}}action(e,n){if(!this.isRecording()){let r=this.current;if(n.feature&&n.operator){r=this.construct();this.nodeBuilder.removeNode(r.$cstNode);const i=this.nodeBuilder.buildCompositeNode(n);i.content.push(r.$cstNode);const s={$type:e};this.stack.push(s);this.assign(n.operator,n.feature,r,r.$cstNode,false)}else{r.$type=e}}}construct(){if(this.isRecording()){return void 0}const e=this.current;NR(e);this.nodeBuilder.construct(e);this.stack.pop();if(Ec(e)){return this.converter.convert(e.value,e.$cstNode)}else{bg(this.astReflection,e)}return e}getAssignment(e){if(!this.assignmentMap.has(e)){const n=Sn(e,sn);this.assignmentMap.set(e,{assignment:n,isCrossRef:n?zs(n.terminal):false})}return this.assignmentMap.get(e)}assign(e,n,r,i,s){const a=this.current;let o;if(s&&typeof r==="string"){o=this.linker.buildReference(a,n,i,r)}else{o=r}switch(e){case"=":{a[n]=o;break}case"?=":{a[n]=true;break}case"+=":{if(!Array.isArray(a[n])){a[n]=[]}a[n].push(o)}}}assignWithoutOverride(e,n){for(const[i,s]of Object.entries(n)){const a=e[i];if(a===void 0){e[i]=s}else if(Array.isArray(a)&&Array.isArray(s)){s.push(...a);e[i]=s}}const r=e.$cstNode;if(r){r.astNode=void 0;e.$cstNode=void 0}return e}get definitionErrors(){return this.wrapper.definitionErrors}}class NM{buildMismatchTokenMessage(e){return Br.buildMismatchTokenMessage(e)}buildNotAllInputParsedMessage(e){return Br.buildNotAllInputParsedMessage(e)}buildNoViableAltMessage(e){return Br.buildNoViableAltMessage(e)}buildEarlyExitMessage(e){return Br.buildEarlyExitMessage(e)}}class uv extends NM{buildMismatchTokenMessage({expected:e,actual:n}){const r=e.LABEL?"`"+e.LABEL+"`":e.name.endsWith(":KW")?`keyword '${e.name.substring(0,e.name.length-3)}'`:`token of type '${e.name}'`;return`Expecting ${r} but found \`${n.image}\`.`}buildNotAllInputParsedMessage({firstRedundant:e}){return`Expecting end of file but found \`${e.image}\`.`}}class kM extends lv{constructor(){super(...arguments);this.tokens=[];this.elementStack=[];this.lastElementStack=[];this.nextTokenIndex=0;this.stackSize=0}action(){}construct(){return void 0}parse(e){this.resetState();const n=this.lexer.tokenize(e,{mode:"partial"});this.tokens=n.tokens;this.wrapper.input=[...this.tokens];this.mainRule.call(this.wrapper,{});this.unorderedGroups.clear();return{tokens:this.tokens,elementStack:[...this.lastElementStack],tokenIndex:this.nextTokenIndex}}rule(e,n){const r=this.wrapper.DEFINE_RULE(ov(e.name),this.startImplementation(n).bind(this));this.allRules.set(e.name,r);if(e.entry){this.mainRule=r}return r}resetState(){this.elementStack=[];this.lastElementStack=[];this.nextTokenIndex=0;this.stackSize=0}startImplementation(e){return n=>{const r=this.keepStackSize();try{e(n)}finally{this.resetStackSize(r)}}}removeUnexpectedElements(){this.elementStack.splice(this.stackSize)}keepStackSize(){const e=this.elementStack.length;this.stackSize=e;return e}resetStackSize(e){this.removeUnexpectedElements();this.stackSize=e}consume(e,n,r){this.wrapper.wrapConsume(e,n);if(!this.isRecording()){this.lastElementStack=[...this.elementStack,r];this.nextTokenIndex=this.currIdx+1}}subrule(e,n,r,i,s){this.before(i);this.wrapper.wrapSubrule(e,n,s);this.after(i)}before(e){if(!this.isRecording()){this.elementStack.push(e)}}after(e){if(!this.isRecording()){const n=this.elementStack.lastIndexOf(e);if(n>=0){this.elementStack.splice(n)}}}get currIdx(){return this.wrapper.currIdx}}const PM={recoveryEnabled:true,nodeLocationTracking:"full",skipValidations:true,errorMessageProvider:new uv};class DM extends LA{constructor(e,n){const r=n&&"maxLookahead"in n;super(e,Object.assign(Object.assign(Object.assign({},PM),{lookaheadStrategy:r?new kp({maxLookahead:n.maxLookahead}):new iM({logging:n.skipValidations?()=>{}:void 0})}),n))}get IS_RECORDING(){return this.RECORDING_PHASE}DEFINE_RULE(e,n){return this.RULE(e,n)}wrapSelfAnalysis(){this.performSelfAnalysis()}wrapConsume(e,n){return this.consume(e,n)}wrapSubrule(e,n,r){return this.subrule(e,n,{ARGS:[r]})}wrapOr(e,n){this.or(e,n)}wrapOption(e,n){this.option(e,n)}wrapMany(e,n){this.many(e,n)}wrapAtLeastOne(e,n){this.atLeastOne(e,n)}}function cv(t,e,n){const r={parser:e,tokens:n,ruleNames:new Map};OM(r,t);return e}function OM(t,e){const n=sp(e,false);const r=Ae(e.rules).filter(it).filter(i=>n.has(i));for(const i of r){const s=Object.assign(Object.assign({},t),{consume:1,optional:1,subrule:1,many:1,or:1});t.parser.rule(i,$r(s,i.definition))}}function $r(t,e,n=false){let r;if(an(e)){r=UM(t,e)}else if(Vs(e)){r=_M(t,e)}else if(sn(e)){r=$r(t,e.terminal)}else if(zs(e)){r=dv(t,e)}else if(Pn(e)){r=BM(t,e)}else if(rp(e)){r=xM(t,e)}else if(ip(e)){r=FM(t,e)}else if(gr(e)){r=KM(t,e)}else if($R(e)){const i=t.consume++;r=()=>t.parser.consume(i,zn,e)}else{throw new vg(e.$cstNode,`Unexpected element type: ${e.$type}`)}return fv(t,n?void 0:bu(e),r,e.cardinality)}function _M(t,e){const n=Fu(e);return()=>t.parser.action(n,e)}function BM(t,e){const n=e.rule.ref;if(it(n)){const r=t.subrule++;const i=n.fragment;const s=e.arguments.length>0?LM(n,e.arguments):()=>({});return a=>t.parser.subrule(r,pv(t,n),i,e,s(a))}else if(Yn(n)){const r=t.consume++;const i=Yf(t,n.name);return()=>t.parser.consume(r,i,e)}else if(!n){throw new vg(e.$cstNode,`Undefined rule: ${e.rule.$refText}`)}else{js()}}function LM(t,e){const n=e.map(r=>Mn(r.value));return r=>{const i={};for(let s=0;s<n.length;s++){const a=t.parameters[s];const o=n[s];i[a.name]=o(r)}return i}}function Mn(t){if(yR(t)){const e=Mn(t.left);const n=Mn(t.right);return r=>e(r)||n(r)}else if(hR(t)){const e=Mn(t.left);const n=Mn(t.right);return r=>e(r)&&n(r)}else if(gR(t)){const e=Mn(t.value);return n=>!e(n)}else if(IR(t)){const e=t.parameter.ref.name;return n=>n!==void 0&&n[e]===true}else if(mR(t)){const e=Boolean(t.true);return()=>e}js()}function xM(t,e){if(e.elements.length===1){return $r(t,e.elements[0])}else{const n=[];for(const i of e.elements){const s={ALT:$r(t,i,true)};const a=bu(i);if(a){s.GATE=Mn(a)}n.push(s)}const r=t.or++;return i=>t.parser.alternatives(r,n.map(s=>{const a={ALT:()=>s.ALT(i)};const o=s.GATE;if(o){a.GATE=()=>o(i)}return a}))}}function FM(t,e){if(e.elements.length===1){return $r(t,e.elements[0])}const n=[];for(const o of e.elements){const l={ALT:$r(t,o,true)};const u=bu(o);if(u){l.GATE=Mn(u)}n.push(l)}const r=t.or++;const i=(o,l)=>{const u=l.getRuleStack().join("-");return`uGroup_${o}_${u}`};const s=o=>t.parser.alternatives(r,n.map((l,u)=>{const c={ALT:()=>true};const d=t.parser;c.ALT=()=>{l.ALT(o);if(!d.isRecording()){const p=i(r,d);if(!d.unorderedGroups.get(p)){d.unorderedGroups.set(p,[])}const y=d.unorderedGroups.get(p);if(typeof(y===null||y===void 0?void 0:y[u])==="undefined"){y[u]=true}}};const f=l.GATE;if(f){c.GATE=()=>f(o)}else{c.GATE=()=>{const p=d.unorderedGroups.get(i(r,d));const y=!(p===null||p===void 0?void 0:p[u]);return y}}return c}));const a=fv(t,bu(e),s,"*");return o=>{a(o);if(!t.parser.isRecording()){t.parser.unorderedGroups.delete(i(r,t.parser))}}}function KM(t,e){const n=e.elements.map(r=>$r(t,r));return r=>n.forEach(i=>i(r))}function bu(t){if(gr(t)){return t.guardCondition}return void 0}function dv(t,e,n=e.terminal){if(!n){if(!e.type.ref){throw new Error("Could not resolve reference to type: "+e.type.$refText)}const r=Og(e.type.ref);const i=r===null||r===void 0?void 0:r.terminal;if(!i){throw new Error("Could not find name assignment for type: "+Fu(e.type.ref))}return dv(t,e,i)}else if(Pn(n)&&it(n.rule.ref)){const r=n.rule.ref;const i=t.subrule++;return s=>t.parser.subrule(i,pv(t,r),false,e,s)}else if(Pn(n)&&Yn(n.rule.ref)){const r=t.consume++;const i=Yf(t,n.rule.ref.name);return()=>t.parser.consume(r,i,e)}else if(an(n)){const r=t.consume++;const i=Yf(t,n.value);return()=>t.parser.consume(r,i,e)}else{throw new Error("Could not build cross reference parser")}}function UM(t,e){const n=t.consume++;const r=t.tokens[e.value];if(!r){throw new Error("Could not find token for keyword: "+e.value)}return()=>t.parser.consume(n,r,e)}function fv(t,e,n,r){const i=e&&Mn(e);if(!r){if(i){const s=t.or++;return a=>t.parser.alternatives(s,[{ALT:()=>n(a),GATE:()=>i(a)},{ALT:Zm(),GATE:()=>!i(a)}])}else{return n}}if(r==="*"){const s=t.many++;return a=>t.parser.many(s,{DEF:()=>n(a),GATE:i?()=>i(a):void 0})}else if(r==="+"){const s=t.many++;if(i){const a=t.or++;return o=>t.parser.alternatives(a,[{ALT:()=>t.parser.atLeastOne(s,{DEF:()=>n(o)}),GATE:()=>i(o)},{ALT:Zm(),GATE:()=>!i(o)}])}else{return a=>t.parser.atLeastOne(s,{DEF:()=>n(a)})}}else if(r==="?"){const s=t.optional++;return a=>t.parser.optional(s,{DEF:()=>n(a),GATE:i?()=>i(a):void 0})}else{js()}}function pv(t,e){const n=WM(t,e);const r=t.parser.getRule(n);if(!r)throw new Error(`Rule "${n}" not found."`);return r}function WM(t,e){if(it(e)){return e.name}else if(t.ruleNames.has(e)){return t.ruleNames.get(e)}else{let n=e;let r=n.$container;let i=e.$type;while(!it(r)){if(gr(r)||rp(r)||ip(r)){const a=r.elements.indexOf(n);i=a.toString()+":"+i}n=r;r=r.$container}const s=r;i=s.name+":"+i;t.ruleNames.set(e,i);return i}}function Yf(t,e){const n=t.tokens[e];if(!n)throw new Error(`Token "${e}" not found."`);return n}function GM(t){const e=t.Grammar;const n=t.parser.Lexer;const r=new kM(t);cv(e,r,n.definition);r.finalize();return r}function HM(t){const e=qM(t);e.finalize();return e}function qM(t){const e=t.Grammar;const n=t.parser.Lexer;const r=new SM(t);return cv(e,r,n.definition)}class mv{constructor(){this.diagnostics=[]}buildTokens(e,n){const r=Ae(sp(e,false));const i=this.buildTerminalTokens(r);const s=this.buildKeywordTokens(r,i,n);i.forEach(a=>{const o=a.PATTERN;if(typeof o==="object"&&o&&"test"in o&&ou(o)){s.unshift(a)}else{s.push(a)}});return s}flushLexingReport(e){return{diagnostics:this.popDiagnostics()}}popDiagnostics(){const e=[...this.diagnostics];this.diagnostics=[];return e}buildTerminalTokens(e){return e.filter(Yn).filter(n=>!n.fragment).map(n=>this.buildTerminalToken(n)).toArray()}buildTerminalToken(e){const n=Ku(e);const r=this.requiresCustomPattern(n)?this.regexPatternFunction(n):n;const i={name:e.name,PATTERN:r};if(typeof r==="function"){i.LINE_BREAKS=true}if(e.hidden){i.GROUP=ou(n)?It.SKIPPED:"hidden"}return i}requiresCustomPattern(e){if(e.flags.includes("u")||e.flags.includes("s")){return true}else if(e.source.includes("?<=")||e.source.includes("?<!")){return true}else{return false}}regexPatternFunction(e){const n=new RegExp(e,e.flags+"y");return(r,i)=>{n.lastIndex=i;const s=n.exec(r);return s}}buildKeywordTokens(e,n,r){return e.filter(it).flatMap(i=>Tr(i).filter(an)).distinct(i=>i.value).toArray().sort((i,s)=>s.value.length-i.value.length).map(i=>this.buildKeywordToken(i,n,Boolean(r===null||r===void 0?void 0:r.caseInsensitive)))}buildKeywordToken(e,n,r){const i=this.buildKeywordPattern(e,r);const s={name:e.value,PATTERN:i,LONGER_ALT:this.findLongerAlt(e,n)};if(typeof i==="function"){s.LINE_BREAKS=true}return s}buildKeywordPattern(e,n){return n?new RegExp(FR(e.value)):e.value}findLongerAlt(e,n){return n.reduce((r,i)=>{const s=i===null||i===void 0?void 0:i.PATTERN;if((s===null||s===void 0?void 0:s.source)&&KR("^"+s.source+"$",e.value)){r.push(i)}return r},[])}}class jM{convert(e,n){let r=n.grammarSource;if(zs(r)){r=Ng(r)}if(Pn(r)){const i=r.rule.ref;if(!i){throw new Error("This cst node was not parsed by a rule.")}return this.runConverter(i,e,n)}return e}runConverter(e,n,r){var i;switch(e.name.toUpperCase()){case"INT":return Tn.convertInt(n);case"STRING":return Tn.convertString(n);case"ID":return Tn.convertID(n)}switch((i=zR(e))===null||i===void 0?void 0:i.toLowerCase()){case"number":return Tn.convertNumber(n);case"boolean":return Tn.convertBoolean(n);case"bigint":return Tn.convertBigint(n);case"date":return Tn.convertDate(n);default:return n}}}var Tn;(function(t){function e(u){let c="";for(let d=1;d<u.length-1;d++){const f=u.charAt(d);if(f==="\\"){const p=u.charAt(++d);c+=n(p)}else{c+=f}}return c}t.convertString=e;function n(u){switch(u){case"b":return"\b";case"f":return"\f";case"n":return"\n";case"r":return"\r";case"t":return"	";case"v":return"\v";case"0":return"\0";default:return u}}function r(u){if(u.charAt(0)==="^"){return u.substring(1)}else{return u}}t.convertID=r;function i(u){return parseInt(u)}t.convertInt=i;function s(u){return BigInt(u)}t.convertBigint=s;function a(u){return new Date(u)}t.convertDate=a;function o(u){return Number(u)}t.convertNumber=o;function l(u){return u.toLowerCase()==="true"}t.convertBoolean=l})(Tn||(Tn={}));function VM(t){if(t.__esModule)return t;var e=t.default;if(typeof e=="function"){var n=function r(){if(this instanceof r){return Reflect.construct(e,arguments,this.constructor)}return e.apply(this,arguments)};n.prototype=e.prototype}else n={};Object.defineProperty(n,"__esModule",{value:true});Object.keys(t).forEach(function(r){var i=Object.getOwnPropertyDescriptor(t,r);Object.defineProperty(n,r,i.get?i:{enumerable:true,get:function(){return t[r]}})});return n}var nr={};var La={};var sh;function hv(){if(sh)return La;sh=1;Object.defineProperty(La,"__esModule",{value:true});let t;function e(){if(t===void 0){throw new Error(`No runtime abstraction layer installed`)}return t}(function(n){function r(i){if(i===void 0){throw new Error(`No runtime abstraction layer provided`)}t=i}n.install=r})(e);La.default=e;return La}var Ve={};var ah;function zM(){if(ah)return Ve;ah=1;Object.defineProperty(Ve,"__esModule",{value:true});Ve.stringArray=Ve.array=Ve.func=Ve.error=Ve.number=Ve.string=Ve.boolean=void 0;function t(o){return o===true||o===false}Ve.boolean=t;function e(o){return typeof o==="string"||o instanceof String}Ve.string=e;function n(o){return typeof o==="number"||o instanceof Number}Ve.number=n;function r(o){return o instanceof Error}Ve.error=r;function i(o){return typeof o==="function"}Ve.func=i;function s(o){return Array.isArray(o)}Ve.array=s;function a(o){return s(o)&&o.every(l=>e(l))}Ve.stringArray=a;return Ve}var rr={};var oh;function yv(){if(oh)return rr;oh=1;Object.defineProperty(rr,"__esModule",{value:true});rr.Emitter=rr.Event=void 0;const t=hv();var e;(function(i){const s={dispose(){}};i.None=function(){return s}})(e||(rr.Event=e={}));class n{add(s,a=null,o){if(!this._callbacks){this._callbacks=[];this._contexts=[]}this._callbacks.push(s);this._contexts.push(a);if(Array.isArray(o)){o.push({dispose:()=>this.remove(s,a)})}}remove(s,a=null){if(!this._callbacks){return}let o=false;for(let l=0,u=this._callbacks.length;l<u;l++){if(this._callbacks[l]===s){if(this._contexts[l]===a){this._callbacks.splice(l,1);this._contexts.splice(l,1);return}else{o=true}}}if(o){throw new Error("When adding a listener with a context, you should remove it with the same context")}}invoke(...s){if(!this._callbacks){return[]}const a=[],o=this._callbacks.slice(0),l=this._contexts.slice(0);for(let u=0,c=o.length;u<c;u++){try{a.push(o[u].apply(l[u],s))}catch(d){(0,t.default)().console.error(d)}}return a}isEmpty(){return!this._callbacks||this._callbacks.length===0}dispose(){this._callbacks=void 0;this._contexts=void 0}}class r{constructor(s){this._options=s}get event(){if(!this._event){this._event=(s,a,o)=>{if(!this._callbacks){this._callbacks=new n}if(this._options&&this._options.onFirstListenerAdd&&this._callbacks.isEmpty()){this._options.onFirstListenerAdd(this)}this._callbacks.add(s,a);const l={dispose:()=>{if(!this._callbacks){return}this._callbacks.remove(s,a);l.dispose=r._noop;if(this._options&&this._options.onLastListenerRemove&&this._callbacks.isEmpty()){this._options.onLastListenerRemove(this)}}};if(Array.isArray(o)){o.push(l)}return l}}return this._event}fire(s){if(this._callbacks){this._callbacks.invoke.call(this._callbacks,s)}}dispose(){if(this._callbacks){this._callbacks.dispose();this._callbacks=void 0}}}rr.Emitter=r;r._noop=function(){};return rr}var lh;function XM(){if(lh)return nr;lh=1;Object.defineProperty(nr,"__esModule",{value:true});nr.CancellationTokenSource=nr.CancellationToken=void 0;const t=hv();const e=zM();const n=yv();var r;(function(o){o.None=Object.freeze({isCancellationRequested:false,onCancellationRequested:n.Event.None});o.Cancelled=Object.freeze({isCancellationRequested:true,onCancellationRequested:n.Event.None});function l(u){const c=u;return c&&(c===o.None||c===o.Cancelled||e.boolean(c.isCancellationRequested)&&!!c.onCancellationRequested)}o.is=l})(r||(nr.CancellationToken=r={}));const i=Object.freeze(function(o,l){const u=(0,t.default)().timer.setTimeout(o.bind(l),0);return{dispose(){u.dispose()}}});class s{constructor(){this._isCancelled=false}cancel(){if(!this._isCancelled){this._isCancelled=true;if(this._emitter){this._emitter.fire(void 0);this.dispose()}}}get isCancellationRequested(){return this._isCancelled}get onCancellationRequested(){if(this._isCancelled){return i}if(!this._emitter){this._emitter=new n.Emitter}return this._emitter.event}dispose(){if(this._emitter){this._emitter.dispose();this._emitter=void 0}}}class a{get token(){if(!this._token){this._token=new s}return this._token}cancel(){if(!this._token){this._token=r.Cancelled}else{this._token.cancel()}}dispose(){if(!this._token){this._token=r.None}else if(this._token instanceof s){this._token.dispose()}}}nr.CancellationTokenSource=a;return nr}var he=XM();function YM(){return new Promise(t=>{if(typeof setImmediate==="undefined"){setTimeout(t,0)}else{setImmediate(t)}})}let ql=0;let JM=10;function QM(){ql=performance.now();return new he.CancellationTokenSource}const Au=Symbol("OperationCancelled");function aa(t){return t===Au}async function ut(t){if(t===he.CancellationToken.None){return}const e=performance.now();if(e-ql>=JM){ql=e;await YM();ql=performance.now()}if(t.isCancellationRequested){throw Au}}class Fp{constructor(){this.promise=new Promise((e,n)=>{this.resolve=r=>{e(r);return this};this.reject=r=>{n(r);return this}})}}class Gs{constructor(e,n,r,i){this._uri=e;this._languageId=n;this._version=r;this._content=i;this._lineOffsets=void 0}get uri(){return this._uri}get languageId(){return this._languageId}get version(){return this._version}getText(e){if(e){const n=this.offsetAt(e.start);const r=this.offsetAt(e.end);return this._content.substring(n,r)}return this._content}update(e,n){for(const r of e){if(Gs.isIncremental(r)){const i=Iv(r.range);const s=this.offsetAt(i.start);const a=this.offsetAt(i.end);this._content=this._content.substring(0,s)+r.text+this._content.substring(a,this._content.length);const o=Math.max(i.start.line,0);const l=Math.max(i.end.line,0);let u=this._lineOffsets;const c=uh(r.text,false,s);if(l-o===c.length){for(let f=0,p=c.length;f<p;f++){u[f+o+1]=c[f]}}else{if(c.length<1e4){u.splice(o+1,l-o,...c)}else{this._lineOffsets=u=u.slice(0,o+1).concat(c,u.slice(l+1))}}const d=r.text.length-(a-s);if(d!==0){for(let f=o+1+c.length,p=u.length;f<p;f++){u[f]=u[f]+d}}}else if(Gs.isFull(r)){this._content=r.text;this._lineOffsets=void 0}else{throw new Error("Unknown change event received")}}this._version=n}getLineOffsets(){if(this._lineOffsets===void 0){this._lineOffsets=uh(this._content,true)}return this._lineOffsets}positionAt(e){e=Math.max(Math.min(e,this._content.length),0);const n=this.getLineOffsets();let r=0,i=n.length;if(i===0){return{line:0,character:e}}while(r<i){const a=Math.floor((r+i)/2);if(n[a]>e){i=a}else{r=a+1}}const s=r-1;e=this.ensureBeforeEOL(e,n[s]);return{line:s,character:e-n[s]}}offsetAt(e){const n=this.getLineOffsets();if(e.line>=n.length){return this._content.length}else if(e.line<0){return 0}const r=n[e.line];if(e.character<=0){return r}const i=e.line+1<n.length?n[e.line+1]:this._content.length;const s=Math.min(r+e.character,i);return this.ensureBeforeEOL(s,r)}ensureBeforeEOL(e,n){while(e>n&&gv(this._content.charCodeAt(e-1))){e--}return e}get lineCount(){return this.getLineOffsets().length}static isIncremental(e){const n=e;return n!==void 0&&n!==null&&typeof n.text==="string"&&n.range!==void 0&&(n.rangeLength===void 0||typeof n.rangeLength==="number")}static isFull(e){const n=e;return n!==void 0&&n!==null&&typeof n.text==="string"&&n.range===void 0&&n.rangeLength===void 0}}var Mu;(function(t){function e(i,s,a,o){return new Gs(i,s,a,o)}t.create=e;function n(i,s,a){if(i instanceof Gs){i.update(s,a);return i}else{throw new Error("TextDocument.update: document must be created by TextDocument.create")}}t.update=n;function r(i,s){const a=i.getText();const o=Jf(s.map(ZM),(c,d)=>{const f=c.range.start.line-d.range.start.line;if(f===0){return c.range.start.character-d.range.start.character}return f});let l=0;const u=[];for(const c of o){const d=i.offsetAt(c.range.start);if(d<l){throw new Error("Overlapping edit")}else if(d>l){u.push(a.substring(l,d))}if(c.newText.length){u.push(c.newText)}l=i.offsetAt(c.range.end)}u.push(a.substr(l));return u.join("")}t.applyEdits=r})(Mu||(Mu={}));function Jf(t,e){if(t.length<=1){return t}const n=t.length/2|0;const r=t.slice(0,n);const i=t.slice(n);Jf(r,e);Jf(i,e);let s=0;let a=0;let o=0;while(s<r.length&&a<i.length){const l=e(r[s],i[a]);if(l<=0){t[o++]=r[s++]}else{t[o++]=i[a++]}}while(s<r.length){t[o++]=r[s++]}while(a<i.length){t[o++]=i[a++]}return t}function uh(t,e,n=0){const r=e?[n]:[];for(let i=0;i<t.length;i++){const s=t.charCodeAt(i);if(gv(s)){if(s===13&&i+1<t.length&&t.charCodeAt(i+1)===10){i++}r.push(n+i+1)}}return r}function gv(t){return t===13||t===10}function Iv(t){const e=t.start;const n=t.end;if(e.line>n.line||e.line===n.line&&e.character>n.character){return{start:n,end:e}}return t}function ZM(t){const e=Iv(t.range);if(e!==t.range){return{newText:t.newText,range:e}}return t}var vv;(()=>{var t={470:i=>{function s(l){if("string"!=typeof l)throw new TypeError("Path must be a string. Received "+JSON.stringify(l))}function a(l,u){for(var c,d="",f=0,p=-1,y=0,R=0;R<=l.length;++R){if(R<l.length)c=l.charCodeAt(R);else{if(47===c)break;c=47}if(47===c){if(p===R-1||1===y);else if(p!==R-1&&2===y){if(d.length<2||2!==f||46!==d.charCodeAt(d.length-1)||46!==d.charCodeAt(d.length-2)){if(d.length>2){var A=d.lastIndexOf("/");if(A!==d.length-1){-1===A?(d="",f=0):f=(d=d.slice(0,A)).length-1-d.lastIndexOf("/"),p=R,y=0;continue}}else if(2===d.length||1===d.length){d="",f=0,p=R,y=0;continue}}u&&(d.length>0?d+="/..":d="..",f=2)}else d.length>0?d+="/"+l.slice(p+1,R):d=l.slice(p+1,R),f=R-p-1;p=R,y=0}else 46===c&&-1!==y?++y:y=-1}return d}var o={resolve:function(){for(var l,u="",c=false,d=arguments.length-1;d>=-1&&!c;d--){var f;d>=0?f=arguments[d]:(void 0===l&&(l=process.cwd()),f=l),s(f),0!==f.length&&(u=f+"/"+u,c=47===f.charCodeAt(0))}return u=a(u,!c),c?u.length>0?"/"+u:"/":u.length>0?u:"."},normalize:function(l){if(s(l),0===l.length)return".";var u=47===l.charCodeAt(0),c=47===l.charCodeAt(l.length-1);return 0!==(l=a(l,!u)).length||u||(l="."),l.length>0&&c&&(l+="/"),u?"/"+l:l},isAbsolute:function(l){return s(l),l.length>0&&47===l.charCodeAt(0)},join:function(){if(0===arguments.length)return".";for(var l,u=0;u<arguments.length;++u){var c=arguments[u];s(c),c.length>0&&(void 0===l?l=c:l+="/"+c)}return void 0===l?".":o.normalize(l)},relative:function(l,u){if(s(l),s(u),l===u)return"";if((l=o.resolve(l))===(u=o.resolve(u)))return"";for(var c=1;c<l.length&&47===l.charCodeAt(c);++c);for(var d=l.length,f=d-c,p=1;p<u.length&&47===u.charCodeAt(p);++p);for(var y=u.length-p,R=f<y?f:y,A=-1,v=0;v<=R;++v){if(v===R){if(y>R){if(47===u.charCodeAt(p+v))return u.slice(p+v+1);if(0===v)return u.slice(p+v)}else f>R&&(47===l.charCodeAt(c+v)?A=v:0===v&&(A=0));break}var $=l.charCodeAt(c+v);if($!==u.charCodeAt(p+v))break;47===$&&(A=v)}var C="";for(v=c+A+1;v<=d;++v)v!==d&&47!==l.charCodeAt(v)||(0===C.length?C+="..":C+="/..");return C.length>0?C+u.slice(p+A):(p+=A,47===u.charCodeAt(p)&&++p,u.slice(p))},_makeLong:function(l){return l},dirname:function(l){if(s(l),0===l.length)return".";for(var u=l.charCodeAt(0),c=47===u,d=-1,f=true,p=l.length-1;p>=1;--p)if(47===(u=l.charCodeAt(p))){if(!f){d=p;break}}else f=false;return-1===d?c?"/":".":c&&1===d?"//":l.slice(0,d)},basename:function(l,u){if(void 0!==u&&"string"!=typeof u)throw new TypeError('"ext" argument must be a string');s(l);var c,d=0,f=-1,p=true;if(void 0!==u&&u.length>0&&u.length<=l.length){if(u.length===l.length&&u===l)return"";var y=u.length-1,R=-1;for(c=l.length-1;c>=0;--c){var A=l.charCodeAt(c);if(47===A){if(!p){d=c+1;break}}else-1===R&&(p=false,R=c+1),y>=0&&(A===u.charCodeAt(y)?-1==--y&&(f=c):(y=-1,f=R))}return d===f?f=R:-1===f&&(f=l.length),l.slice(d,f)}for(c=l.length-1;c>=0;--c)if(47===l.charCodeAt(c)){if(!p){d=c+1;break}}else-1===f&&(p=false,f=c+1);return-1===f?"":l.slice(d,f)},extname:function(l){s(l);for(var u=-1,c=0,d=-1,f=true,p=0,y=l.length-1;y>=0;--y){var R=l.charCodeAt(y);if(47!==R)-1===d&&(f=false,d=y+1),46===R?-1===u?u=y:1!==p&&(p=1):-1!==u&&(p=-1);else if(!f){c=y+1;break}}return-1===u||-1===d||0===p||1===p&&u===d-1&&u===c+1?"":l.slice(u,d)},format:function(l){if(null===l||"object"!=typeof l)throw new TypeError('The "pathObject" argument must be of type Object. Received type '+typeof l);return function(u,c){var d=c.dir||c.root,f=c.base||(c.name||"")+(c.ext||"");return d?d===c.root?d+f:d+"/"+f:f}(0,l)},parse:function(l){s(l);var u={root:"",dir:"",base:"",ext:"",name:""};if(0===l.length)return u;var c,d=l.charCodeAt(0),f=47===d;f?(u.root="/",c=1):c=0;for(var p=-1,y=0,R=-1,A=true,v=l.length-1,$=0;v>=c;--v)if(47!==(d=l.charCodeAt(v)))-1===R&&(A=false,R=v+1),46===d?-1===p?p=v:1!==$&&($=1):-1!==p&&($=-1);else if(!A){y=v+1;break}return-1===p||-1===R||0===$||1===$&&p===R-1&&p===y+1?-1!==R&&(u.base=u.name=0===y&&f?l.slice(1,R):l.slice(y,R)):(0===y&&f?(u.name=l.slice(1,p),u.base=l.slice(1,R)):(u.name=l.slice(y,p),u.base=l.slice(y,R)),u.ext=l.slice(p,R)),y>0?u.dir=l.slice(0,y-1):f&&(u.dir="/"),u},sep:"/",delimiter:":",win32:null,posix:null};o.posix=o,i.exports=o}},e={};function n(i){var s=e[i];if(void 0!==s)return s.exports;var a=e[i]={exports:{}};return t[i](a,a.exports,n),a.exports}n.d=(i,s)=>{for(var a in s)n.o(s,a)&&!n.o(i,a)&&Object.defineProperty(i,a,{enumerable:true,get:s[a]})},n.o=(i,s)=>Object.prototype.hasOwnProperty.call(i,s),n.r=i=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(i,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(i,"__esModule",{value:true})};var r={};(()=>{let i;if(n.r(r),n.d(r,{URI:()=>f,Utils:()=>ce}),"object"==typeof process)i="win32"===process.platform;else if("object"==typeof navigator){let _=navigator.userAgent;i=_.indexOf("Windows")>=0}const s=/^\w[\w\d+.-]*$/,a=/^\//,o=/^\/\//;function l(_,T){if(!_.scheme&&T)throw new Error(`[UriError]: Scheme is missing: {scheme: "", authority: "${_.authority}", path: "${_.path}", query: "${_.query}", fragment: "${_.fragment}"}`);if(_.scheme&&!s.test(_.scheme))throw new Error("[UriError]: Scheme contains illegal characters.");if(_.path){if(_.authority){if(!a.test(_.path))throw new Error('[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character')}else if(o.test(_.path))throw new Error('[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")')}}const u="",c="/",d=/^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;class f{static isUri(T){return T instanceof f||!!T&&"string"==typeof T.authority&&"string"==typeof T.fragment&&"string"==typeof T.path&&"string"==typeof T.query&&"string"==typeof T.scheme&&"string"==typeof T.fsPath&&"function"==typeof T.with&&"function"==typeof T.toString}scheme;authority;path;query;fragment;constructor(T,g,M,L,D,B=false){"object"==typeof T?(this.scheme=T.scheme||u,this.authority=T.authority||u,this.path=T.path||u,this.query=T.query||u,this.fragment=T.fragment||u):(this.scheme=function($e,F){return $e||F?$e:"file"}(T,B),this.authority=g||u,this.path=function($e,F){switch($e){case"https":case"http":case"file":F?F[0]!==c&&(F=c+F):F=c}return F}(this.scheme,M||u),this.query=L||u,this.fragment=D||u,l(this,B))}get fsPath(){return $(this)}with(T){if(!T)return this;let{scheme:g,authority:M,path:L,query:D,fragment:B}=T;return void 0===g?g=this.scheme:null===g&&(g=u),void 0===M?M=this.authority:null===M&&(M=u),void 0===L?L=this.path:null===L&&(L=u),void 0===D?D=this.query:null===D&&(D=u),void 0===B?B=this.fragment:null===B&&(B=u),g===this.scheme&&M===this.authority&&L===this.path&&D===this.query&&B===this.fragment?this:new y(g,M,L,D,B)}static parse(T,g=false){const M=d.exec(T);return M?new y(M[2]||u,G(M[4]||u),G(M[5]||u),G(M[7]||u),G(M[9]||u),g):new y(u,u,u,u,u)}static file(T){let g=u;if(i&&(T=T.replace(/\\/g,c)),T[0]===c&&T[1]===c){const M=T.indexOf(c,2);-1===M?(g=T.substring(2),T=c):(g=T.substring(2,M),T=T.substring(M)||c)}return new y("file",g,T,u,u)}static from(T){const g=new y(T.scheme,T.authority,T.path,T.query,T.fragment);return l(g,true),g}toString(T=false){return C(this,T)}toJSON(){return this}static revive(T){if(T){if(T instanceof f)return T;{const g=new y(T);return g._formatted=T.external,g._fsPath=T._sep===p?T.fsPath:null,g}}return T}}const p=i?1:void 0;class y extends f{_formatted=null;_fsPath=null;get fsPath(){return this._fsPath||(this._fsPath=$(this)),this._fsPath}toString(T=false){return T?C(this,true):(this._formatted||(this._formatted=C(this,false)),this._formatted)}toJSON(){const T={$mid:1};return this._fsPath&&(T.fsPath=this._fsPath,T._sep=p),this._formatted&&(T.external=this._formatted),this.path&&(T.path=this.path),this.scheme&&(T.scheme=this.scheme),this.authority&&(T.authority=this.authority),this.query&&(T.query=this.query),this.fragment&&(T.fragment=this.fragment),T}}const R={58:"%3A",47:"%2F",63:"%3F",35:"%23",91:"%5B",93:"%5D",64:"%40",33:"%21",36:"%24",38:"%26",39:"%27",40:"%28",41:"%29",42:"%2A",43:"%2B",44:"%2C",59:"%3B",61:"%3D",32:"%20"};function A(_,T,g){let M,L=-1;for(let D=0;D<_.length;D++){const B=_.charCodeAt(D);if(B>=97&&B<=122||B>=65&&B<=90||B>=48&&B<=57||45===B||46===B||95===B||126===B||T&&47===B||g&&91===B||g&&93===B||g&&58===B)-1!==L&&(M+=encodeURIComponent(_.substring(L,D)),L=-1),void 0!==M&&(M+=_.charAt(D));else{void 0===M&&(M=_.substr(0,D));const $e=R[B];void 0!==$e?(-1!==L&&(M+=encodeURIComponent(_.substring(L,D)),L=-1),M+=$e):-1===L&&(L=D)}}return-1!==L&&(M+=encodeURIComponent(_.substring(L))),void 0!==M?M:_}function v(_){let T;for(let g=0;g<_.length;g++){const M=_.charCodeAt(g);35===M||63===M?(void 0===T&&(T=_.substr(0,g)),T+=R[M]):void 0!==T&&(T+=_[g])}return void 0!==T?T:_}function $(_,T){let g;return g=_.authority&&_.path.length>1&&"file"===_.scheme?`//${_.authority}${_.path}`:47===_.path.charCodeAt(0)&&(_.path.charCodeAt(1)>=65&&_.path.charCodeAt(1)<=90||_.path.charCodeAt(1)>=97&&_.path.charCodeAt(1)<=122)&&58===_.path.charCodeAt(2)?_.path[1].toLowerCase()+_.path.substr(2):_.path,i&&(g=g.replace(/\//g,"\\")),g}function C(_,T){const g=T?v:A;let M="",{scheme:L,authority:D,path:B,query:$e,fragment:F}=_;if(L&&(M+=L,M+=":"),(D||"file"===L)&&(M+=c,M+=c),D){let S=D.indexOf("@");if(-1!==S){const ne=D.substr(0,S);D=D.substr(S+1),S=ne.lastIndexOf(":"),-1===S?M+=g(ne,false,false):(M+=g(ne.substr(0,S),false,false),M+=":",M+=g(ne.substr(S+1),false,true)),M+="@"}D=D.toLowerCase(),S=D.lastIndexOf(":"),-1===S?M+=g(D,false,true):(M+=g(D.substr(0,S),false,true),M+=D.substr(S))}if(B){if(B.length>=3&&47===B.charCodeAt(0)&&58===B.charCodeAt(2)){const S=B.charCodeAt(1);S>=65&&S<=90&&(B=`/${String.fromCharCode(S+32)}:${B.substr(3)}`)}else if(B.length>=2&&58===B.charCodeAt(1)){const S=B.charCodeAt(0);S>=65&&S<=90&&(B=`${String.fromCharCode(S+32)}:${B.substr(2)}`)}M+=g(B,true,false)}return $e&&(M+="?",M+=g($e,false,false)),F&&(M+="#",M+=T?F:A(F,false,false)),M}function O(_){try{return decodeURIComponent(_)}catch{return _.length>3?_.substr(0,3)+O(_.substr(3)):_}}const Y=/(%[0-9A-Za-z][0-9A-Za-z])+/g;function G(_){return _.match(Y)?_.replace(Y,T=>O(T)):_}var J=n(470);const te=J.posix||J,ie="/";var ce;!function(_){_.joinPath=function(T,...g){return T.with({path:te.join(T.path,...g)})},_.resolvePath=function(T,...g){let M=T.path,L=false;M[0]!==ie&&(M=ie+M,L=true);let D=te.resolve(M,...g);return L&&D[0]===ie&&!T.authority&&(D=D.substring(1)),T.with({path:D})},_.dirname=function(T){if(0===T.path.length||T.path===ie)return T;let g=te.dirname(T.path);return 1===g.length&&46===g.charCodeAt(0)&&(g=""),T.with({path:g})},_.basename=function(T){return te.basename(T.path)},_.extname=function(T){return te.extname(T.path)}}(ce||(ce={}))})(),vv=r})();const{URI:dt,Utils:si}=vv;var Ke;(function(t){t.basename=si.basename;t.dirname=si.dirname;t.extname=si.extname;t.joinPath=si.joinPath;t.resolvePath=si.resolvePath;function e(i,s){return(i===null||i===void 0?void 0:i.toString())===(s===null||s===void 0?void 0:s.toString())}t.equals=e;function n(i,s){const a=typeof i==="string"?i:i.path;const o=typeof s==="string"?s:s.path;const l=a.split("/").filter(p=>p.length>0);const u=o.split("/").filter(p=>p.length>0);let c=0;for(;c<l.length;c++){if(l[c]!==u[c]){break}}const d="../".repeat(l.length-c);const f=u.slice(c).join("/");return d+f}t.relative=n;function r(i){return dt.parse(i.toString()).toString()}t.normalize=r})(Ke||(Ke={}));var z;(function(t){t[t["Changed"]=0]="Changed";t[t["Parsed"]=1]="Parsed";t[t["IndexedContent"]=2]="IndexedContent";t[t["ComputedScopes"]=3]="ComputedScopes";t[t["Linked"]=4]="Linked";t[t["IndexedReferences"]=5]="IndexedReferences";t[t["Validated"]=6]="Validated"})(z||(z={}));class eS{constructor(e){this.serviceRegistry=e.ServiceRegistry;this.textDocuments=e.workspace.TextDocuments;this.fileSystemProvider=e.workspace.FileSystemProvider}async fromUri(e,n=he.CancellationToken.None){const r=await this.fileSystemProvider.readFile(e);return this.createAsync(e,r,n)}fromTextDocument(e,n,r){n=n!==null&&n!==void 0?n:dt.parse(e.uri);if(he.CancellationToken.is(r)){return this.createAsync(n,e,r)}else{return this.create(n,e,r)}}fromString(e,n,r){if(he.CancellationToken.is(r)){return this.createAsync(n,e,r)}else{return this.create(n,e,r)}}fromModel(e,n){return this.create(n,{$model:e})}create(e,n,r){if(typeof n==="string"){const i=this.parse(e,n,r);return this.createLangiumDocument(i,e,void 0,n)}else if("$model"in n){const i={value:n.$model,parserErrors:[],lexerErrors:[]};return this.createLangiumDocument(i,e)}else{const i=this.parse(e,n.getText(),r);return this.createLangiumDocument(i,e,n)}}async createAsync(e,n,r){if(typeof n==="string"){const i=await this.parseAsync(e,n,r);return this.createLangiumDocument(i,e,void 0,n)}else{const i=await this.parseAsync(e,n.getText(),r);return this.createLangiumDocument(i,e,n)}}createLangiumDocument(e,n,r,i){let s;if(r){s={parseResult:e,uri:n,state:z.Parsed,references:[],textDocument:r}}else{const a=this.createTextDocumentGetter(n,i);s={parseResult:e,uri:n,state:z.Parsed,references:[],get textDocument(){return a()}}}e.value.$document=s;return s}async update(e,n){var r,i;const s=(r=e.parseResult.value.$cstNode)===null||r===void 0?void 0:r.root.fullText;const a=(i=this.textDocuments)===null||i===void 0?void 0:i.get(e.uri.toString());const o=a?a.getText():await this.fileSystemProvider.readFile(e.uri);if(a){Object.defineProperty(e,"textDocument",{value:a})}else{const l=this.createTextDocumentGetter(e.uri,o);Object.defineProperty(e,"textDocument",{get:l})}if(s!==o){e.parseResult=await this.parseAsync(e.uri,o,n);e.parseResult.value.$document=e}e.state=z.Parsed;return e}parse(e,n,r){const i=this.serviceRegistry.getServices(e);return i.parser.LangiumParser.parse(n,r)}parseAsync(e,n,r){const i=this.serviceRegistry.getServices(e);return i.parser.AsyncParser.parse(n,r)}createTextDocumentGetter(e,n){const r=this.serviceRegistry;let i=void 0;return()=>{return i!==null&&i!==void 0?i:i=Mu.create(e.toString(),r.getServices(e).LanguageMetaData.languageId,0,n!==null&&n!==void 0?n:"")}}}class tS{constructor(e){this.documentMap=new Map;this.langiumDocumentFactory=e.workspace.LangiumDocumentFactory;this.serviceRegistry=e.ServiceRegistry}get all(){return Ae(this.documentMap.values())}addDocument(e){const n=e.uri.toString();if(this.documentMap.has(n)){throw new Error(`A document with the URI '${n}' is already present.`)}this.documentMap.set(n,e)}getDocument(e){const n=e.toString();return this.documentMap.get(n)}async getOrCreateDocument(e,n){let r=this.getDocument(e);if(r){return r}r=await this.langiumDocumentFactory.fromUri(e,n);this.addDocument(r);return r}createDocument(e,n,r){if(r){return this.langiumDocumentFactory.fromString(n,e,r).then(i=>{this.addDocument(i);return i})}else{const i=this.langiumDocumentFactory.fromString(n,e);this.addDocument(i);return i}}hasDocument(e){return this.documentMap.has(e.toString())}invalidateDocument(e){const n=e.toString();const r=this.documentMap.get(n);if(r){const i=this.serviceRegistry.getServices(e).references.Linker;i.unlink(r);r.state=z.Changed;r.precomputedScopes=void 0;r.diagnostics=void 0}return r}deleteDocument(e){const n=e.toString();const r=this.documentMap.get(n);if(r){r.state=z.Changed;this.documentMap.delete(n)}return r}}const $c=Symbol("ref_resolving");class nS{constructor(e){this.reflection=e.shared.AstReflection;this.langiumDocuments=()=>e.shared.workspace.LangiumDocuments;this.scopeProvider=e.references.ScopeProvider;this.astNodeLocator=e.workspace.AstNodeLocator}async link(e,n=he.CancellationToken.None){for(const r of qn(e.parseResult.value)){await ut(n);wg(r).forEach(i=>this.doLink(i,e))}}doLink(e,n){var r;const i=e.reference;if(i._ref===void 0){i._ref=$c;try{const s=this.getCandidate(e);if(Ll(s)){i._ref=s}else{i._nodeDescription=s;if(this.langiumDocuments().hasDocument(s.documentUri)){const a=this.loadAstNode(s);i._ref=a!==null&&a!==void 0?a:this.createLinkingError(e,s)}else{i._ref=void 0}}}catch(s){console.error(`An error occurred while resolving reference to '${i.$refText}':`,s);const a=(r=s.message)!==null&&r!==void 0?r:String(s);i._ref=Object.assign(Object.assign({},e),{message:`An error occurred while resolving reference to '${i.$refText}': ${a}`})}n.references.push(i)}}unlink(e){for(const n of e.references){delete n._ref;delete n._nodeDescription}e.references=[]}getCandidate(e){const n=this.scopeProvider.getScope(e);const r=n.getElement(e.reference.$refText);return r!==null&&r!==void 0?r:this.createLinkingError(e)}buildReference(e,n,r,i){const s=this;const a={$refNode:r,$refText:i,get ref(){var o;if(Ze(this._ref)){return this._ref}else if(dg(this._nodeDescription)){const l=s.loadAstNode(this._nodeDescription);this._ref=l!==null&&l!==void 0?l:s.createLinkingError({reference:a,container:e,property:n},this._nodeDescription)}else if(this._ref===void 0){this._ref=$c;const l=iu(e).$document;const u=s.getLinkedNode({reference:a,container:e,property:n});if(u.error&&l&&l.state<z.ComputedScopes){return this._ref=void 0}this._ref=(o=u.node)!==null&&o!==void 0?o:u.error;this._nodeDescription=u.descr;l===null||l===void 0?void 0:l.references.push(this)}else if(this._ref===$c){throw new Error(`Cyclic reference resolution detected: ${s.astNodeLocator.getAstNodePath(e)}/${n} (symbol '${i}')`)}return Ze(this._ref)?this._ref:void 0},get $nodeDescription(){return this._nodeDescription},get error(){return Ll(this._ref)?this._ref:void 0}};return a}getLinkedNode(e){var n;try{const r=this.getCandidate(e);if(Ll(r)){return{error:r}}const i=this.loadAstNode(r);if(i){return{node:i,descr:r}}else{return{descr:r,error:this.createLinkingError(e,r)}}}catch(r){console.error(`An error occurred while resolving reference to '${e.reference.$refText}':`,r);const i=(n=r.message)!==null&&n!==void 0?n:String(r);return{error:Object.assign(Object.assign({},e),{message:`An error occurred while resolving reference to '${e.reference.$refText}': ${i}`})}}}loadAstNode(e){if(e.node){return e.node}const n=this.langiumDocuments().getDocument(e.documentUri);if(!n){return void 0}return this.astNodeLocator.getAstNode(n.parseResult.value,e.path)}createLinkingError(e,n){const r=iu(e.container).$document;if(r&&r.state<z.ComputedScopes){console.warn(`Attempted reference resolution before document reached ComputedScopes state (${r.uri}).`)}const i=this.reflection.getReferenceType(e);return Object.assign(Object.assign({},e),{message:`Could not resolve reference to ${i} named '${e.reference.$refText}'.`,targetDescription:n})}}function Rv(t){return typeof t.name==="string"}class Ev{getName(e){if(Rv(e)){return e.name}return void 0}getNameNode(e){return ap(e.$cstNode,"name")}}class $v{constructor(e){this.nameProvider=e.references.NameProvider;this.index=e.shared.workspace.IndexManager;this.nodeLocator=e.workspace.AstNodeLocator}findDeclaration(e){if(e){const n=qR(e);const r=e.astNode;if(n&&r){const i=r[n.feature];if(tn(i)){return i.ref}else if(Array.isArray(i)){for(const s of i){if(tn(s)&&s.$refNode&&s.$refNode.offset<=e.offset&&s.$refNode.end>=e.end){return s.ref}}}}if(r){const i=this.nameProvider.getNameNode(r);if(i&&(i===e||cR(e,i))){return r}}}return void 0}findDeclarationNode(e){const n=this.findDeclaration(e);if(n===null||n===void 0?void 0:n.$cstNode){const r=this.nameProvider.getNameNode(n);return r!==null&&r!==void 0?r:n.$cstNode}return void 0}findReferences(e,n){const r=[];if(n.includeDeclaration){const s=this.getReferenceToSelf(e);if(s){r.push(s)}}let i=this.index.findAllReferences(e,this.nodeLocator.getAstNodePath(e));if(n.documentUri){i=i.filter(s=>Ke.equals(s.sourceUri,n.documentUri))}r.push(...i);return Ae(r)}getReferenceToSelf(e){const n=this.nameProvider.getNameNode(e);if(n){const r=ct(e);const i=this.nodeLocator.getAstNodePath(e);return{sourceUri:r.uri,sourcePath:i,targetUri:r.uri,targetPath:i,segment:ru(n),local:true}}return void 0}}class Su{constructor(e){this.map=new Map;if(e){for(const[n,r]of e){this.add(n,r)}}}get size(){return Sd.sum(Ae(this.map.values()).map(e=>e.length))}clear(){this.map.clear()}delete(e,n){if(n===void 0){return this.map.delete(e)}else{const r=this.map.get(e);if(r){const i=r.indexOf(n);if(i>=0){if(r.length===1){this.map.delete(e)}else{r.splice(i,1)}return true}}return false}}get(e){var n;return(n=this.map.get(e))!==null&&n!==void 0?n:[]}has(e,n){if(n===void 0){return this.map.has(e)}else{const r=this.map.get(e);if(r){return r.indexOf(n)>=0}return false}}add(e,n){if(this.map.has(e)){this.map.get(e).push(n)}else{this.map.set(e,[n])}return this}addAll(e,n){if(this.map.has(e)){this.map.get(e).push(...n)}else{this.map.set(e,Array.from(n))}return this}forEach(e){this.map.forEach((n,r)=>n.forEach(i=>e(i,r,this)))}[Symbol.iterator](){return this.entries().iterator()}entries(){return Ae(this.map.entries()).flatMap(([e,n])=>n.map(r=>[e,r]))}keys(){return Ae(this.map.keys())}values(){return Ae(this.map.values()).flat()}entriesGroupedByKey(){return Ae(this.map.entries())}}class ch{get size(){return this.map.size}constructor(e){this.map=new Map;this.inverse=new Map;if(e){for(const[n,r]of e){this.set(n,r)}}}clear(){this.map.clear();this.inverse.clear()}set(e,n){this.map.set(e,n);this.inverse.set(n,e);return this}get(e){return this.map.get(e)}getKey(e){return this.inverse.get(e)}delete(e){const n=this.map.get(e);if(n!==void 0){this.map.delete(e);this.inverse.delete(n);return true}return false}}class Tv{constructor(e){this.nameProvider=e.references.NameProvider;this.descriptions=e.workspace.AstNodeDescriptionProvider}async computeExports(e,n=he.CancellationToken.None){return this.computeExportsForNode(e.parseResult.value,e,void 0,n)}async computeExportsForNode(e,n,r=Bu,i=he.CancellationToken.None){const s=[];this.exportNode(e,s,n);for(const a of r(e)){await ut(i);this.exportNode(a,s,n)}return s}exportNode(e,n,r){const i=this.nameProvider.getName(e);if(i){n.push(this.descriptions.createDescription(e,i,r))}}async computeLocalScopes(e,n=he.CancellationToken.None){const r=e.parseResult.value;const i=new Su;for(const s of Tr(r)){await ut(n);this.processNode(s,e,i)}return i}processNode(e,n,r){const i=e.$container;if(i){const s=this.nameProvider.getName(e);if(s){r.add(i,this.descriptions.createDescription(e,s,n))}}}}class dh{constructor(e,n,r){var i;this.elements=e;this.outerScope=n;this.caseInsensitive=(i=r===null||r===void 0?void 0:r.caseInsensitive)!==null&&i!==void 0?i:false}getAllElements(){if(this.outerScope){return this.elements.concat(this.outerScope.getAllElements())}else{return this.elements}}getElement(e){const n=this.caseInsensitive?this.elements.find(r=>r.name.toLowerCase()===e.toLowerCase()):this.elements.find(r=>r.name===e);if(n){return n}if(this.outerScope){return this.outerScope.getElement(e)}return void 0}}class Cv{constructor(e,n,r){var i;this.elements=new Map;this.caseInsensitive=(i=r===null||r===void 0?void 0:r.caseInsensitive)!==null&&i!==void 0?i:false;for(const s of e){const a=this.caseInsensitive?s.name.toLowerCase():s.name;this.elements.set(a,s)}this.outerScope=n}getElement(e){const n=this.caseInsensitive?e.toLowerCase():e;const r=this.elements.get(n);if(r){return r}if(this.outerScope){return this.outerScope.getElement(e)}return void 0}getAllElements(){let e=Ae(this.elements.values());if(this.outerScope){e=e.concat(this.outerScope.getAllElements())}return e}}const rS={getElement(){return void 0},getAllElements(){return mg}};class wv{constructor(){this.toDispose=[];this.isDisposed=false}onDispose(e){this.toDispose.push(e)}dispose(){this.throwIfDisposed();this.clear();this.isDisposed=true;this.toDispose.forEach(e=>e.dispose())}throwIfDisposed(){if(this.isDisposed){throw new Error("This cache has already been disposed")}}}class iS extends wv{constructor(){super(...arguments);this.cache=new Map}has(e){this.throwIfDisposed();return this.cache.has(e)}set(e,n){this.throwIfDisposed();this.cache.set(e,n)}get(e,n){this.throwIfDisposed();if(this.cache.has(e)){return this.cache.get(e)}else if(n){const r=n();this.cache.set(e,r);return r}else{return void 0}}delete(e){this.throwIfDisposed();return this.cache.delete(e)}clear(){this.throwIfDisposed();this.cache.clear()}}class bv extends wv{constructor(e){super();this.cache=new Map;this.converter=e!==null&&e!==void 0?e:n=>n}has(e,n){this.throwIfDisposed();return this.cacheForContext(e).has(n)}set(e,n,r){this.throwIfDisposed();this.cacheForContext(e).set(n,r)}get(e,n,r){this.throwIfDisposed();const i=this.cacheForContext(e);if(i.has(n)){return i.get(n)}else if(r){const s=r();i.set(n,s);return s}else{return void 0}}delete(e,n){this.throwIfDisposed();return this.cacheForContext(e).delete(n)}clear(e){this.throwIfDisposed();if(e){const n=this.converter(e);this.cache.delete(n)}else{this.cache.clear()}}cacheForContext(e){const n=this.converter(e);let r=this.cache.get(n);if(!r){r=new Map;this.cache.set(n,r)}return r}}class sS extends bv{constructor(e,n){super(r=>r.toString());if(n){this.toDispose.push(e.workspace.DocumentBuilder.onDocumentPhase(n,r=>{this.clear(r.uri.toString())}));this.toDispose.push(e.workspace.DocumentBuilder.onUpdate((r,i)=>{for(const s of i){this.clear(s)}}))}else{this.toDispose.push(e.workspace.DocumentBuilder.onUpdate((r,i)=>{const s=r.concat(i);for(const a of s){this.clear(a)}}))}}}class aS extends iS{constructor(e,n){super();if(n){this.toDispose.push(e.workspace.DocumentBuilder.onBuildPhase(n,()=>{this.clear()}));this.toDispose.push(e.workspace.DocumentBuilder.onUpdate((r,i)=>{if(i.length>0){this.clear()}}))}else{this.toDispose.push(e.workspace.DocumentBuilder.onUpdate(()=>{this.clear()}))}}}class Av{constructor(e){this.reflection=e.shared.AstReflection;this.nameProvider=e.references.NameProvider;this.descriptions=e.workspace.AstNodeDescriptionProvider;this.indexManager=e.shared.workspace.IndexManager;this.globalScopeCache=new aS(e.shared)}getScope(e){const n=[];const r=this.reflection.getReferenceType(e);const i=ct(e.container).precomputedScopes;if(i){let a=e.container;do{const o=i.get(a);if(o.length>0){n.push(Ae(o).filter(l=>this.reflection.isSubtype(l.type,r)))}a=a.$container}while(a)}let s=this.getGlobalScope(r,e);for(let a=n.length-1;a>=0;a--){s=this.createScope(n[a],s)}return s}createScope(e,n,r){return new dh(Ae(e),n,r)}createScopeForNodes(e,n,r){const i=Ae(e).map(s=>{const a=this.nameProvider.getName(s);if(a){return this.descriptions.createDescription(s,a)}return void 0}).nonNullable();return new dh(i,n,r)}getGlobalScope(e,n){return this.globalScopeCache.get(e,()=>new Cv(this.indexManager.allElements(e)))}}function oS(t){return typeof t.$comment==="string"}function fh(t){return typeof t==="object"&&!!t&&("$ref"in t||"$error"in t)}class lS{constructor(e){this.ignoreProperties=new Set(["$container","$containerProperty","$containerIndex","$document","$cstNode"]);this.langiumDocuments=e.shared.workspace.LangiumDocuments;this.astNodeLocator=e.workspace.AstNodeLocator;this.nameProvider=e.references.NameProvider;this.commentProvider=e.documentation.CommentProvider}serialize(e,n){const r=n!==null&&n!==void 0?n:{};const i=n===null||n===void 0?void 0:n.replacer;const s=(o,l)=>this.replacer(o,l,r);const a=i?(o,l)=>i(o,l,s):s;try{this.currentDocument=ct(e);return JSON.stringify(e,a,n===null||n===void 0?void 0:n.space)}finally{this.currentDocument=void 0}}deserialize(e,n){const r=n!==null&&n!==void 0?n:{};const i=JSON.parse(e);this.linkNode(i,i,r);return i}replacer(e,n,{refText:r,sourceText:i,textRegions:s,comments:a,uriConverter:o}){var l,u,c,d;if(this.ignoreProperties.has(e)){return void 0}else if(tn(n)){const f=n.ref;const p=r?n.$refText:void 0;if(f){const y=ct(f);let R="";if(this.currentDocument&&this.currentDocument!==y){if(o){R=o(y.uri,n)}else{R=y.uri.toString()}}const A=this.astNodeLocator.getAstNodePath(f);return{$ref:`${R}#${A}`,$refText:p}}else{return{$error:(u=(l=n.error)===null||l===void 0?void 0:l.message)!==null&&u!==void 0?u:"Could not resolve reference",$refText:p}}}else if(Ze(n)){let f=void 0;if(s){f=this.addAstNodeRegionWithAssignmentsTo(Object.assign({},n));if((!e||n.$document)&&(f===null||f===void 0?void 0:f.$textRegion)){f.$textRegion.documentURI=(c=this.currentDocument)===null||c===void 0?void 0:c.uri.toString()}}if(i&&!e){f!==null&&f!==void 0?f:f=Object.assign({},n);f.$sourceText=(d=n.$cstNode)===null||d===void 0?void 0:d.text}if(a){f!==null&&f!==void 0?f:f=Object.assign({},n);const p=this.commentProvider.getComment(n);if(p){f.$comment=p.replace(/\r/g,"")}}return f!==null&&f!==void 0?f:n}else{return n}}addAstNodeRegionWithAssignmentsTo(e){const n=r=>({offset:r.offset,end:r.end,length:r.length,range:r.range});if(e.$cstNode){const r=e.$textRegion=n(e.$cstNode);const i=r.assignments={};Object.keys(e).filter(s=>!s.startsWith("$")).forEach(s=>{const a=kg(e.$cstNode,s).map(n);if(a.length!==0){i[s]=a}});return e}return void 0}linkNode(e,n,r,i,s,a){for(const[l,u]of Object.entries(e)){if(Array.isArray(u)){for(let c=0;c<u.length;c++){const d=u[c];if(fh(d)){u[c]=this.reviveReference(e,l,n,d,r)}else if(Ze(d)){this.linkNode(d,n,r,e,l,c)}}}else if(fh(u)){e[l]=this.reviveReference(e,l,n,u,r)}else if(Ze(u)){this.linkNode(u,n,r,e,l)}}const o=e;o.$container=i;o.$containerProperty=s;o.$containerIndex=a}reviveReference(e,n,r,i,s){let a=i.$refText;let o=i.$error;if(i.$ref){const l=this.getRefNode(r,i.$ref,s.uriConverter);if(Ze(l)){if(!a){a=this.nameProvider.getName(l)}return{$refText:a!==null&&a!==void 0?a:"",ref:l}}else{o=l}}if(o){const l={$refText:a!==null&&a!==void 0?a:""};l.error={container:e,property:n,message:o,reference:l};return l}else{return void 0}}getRefNode(e,n,r){try{const i=n.indexOf("#");if(i===0){const l=this.astNodeLocator.getAstNode(e,n.substring(1));if(!l){return"Could not resolve path: "+n}return l}if(i<0){const l=r?r(n):dt.parse(n);const u=this.langiumDocuments.getDocument(l);if(!u){return"Could not find document for URI: "+n}return u.parseResult.value}const s=r?r(n.substring(0,i)):dt.parse(n.substring(0,i));const a=this.langiumDocuments.getDocument(s);if(!a){return"Could not find document for URI: "+n}if(i===n.length-1){return a.parseResult.value}const o=this.astNodeLocator.getAstNode(a.parseResult.value,n.substring(i+1));if(!o){return"Could not resolve URI: "+n}return o}catch(i){return String(i)}}}class uS{get map(){return this.fileExtensionMap}constructor(e){this.languageIdMap=new Map;this.fileExtensionMap=new Map;this.textDocuments=e===null||e===void 0?void 0:e.workspace.TextDocuments}register(e){const n=e.LanguageMetaData;for(const r of n.fileExtensions){if(this.fileExtensionMap.has(r)){console.warn(`The file extension ${r} is used by multiple languages. It is now assigned to '${n.languageId}'.`)}this.fileExtensionMap.set(r,e)}this.languageIdMap.set(n.languageId,e);if(this.languageIdMap.size===1){this.singleton=e}else{this.singleton=void 0}}getServices(e){var n,r;if(this.singleton!==void 0){return this.singleton}if(this.languageIdMap.size===0){throw new Error("The service registry is empty. Use `register` to register the services of a language.")}const i=(r=(n=this.textDocuments)===null||n===void 0?void 0:n.get(e))===null||r===void 0?void 0:r.languageId;if(i!==void 0){const o=this.languageIdMap.get(i);if(o){return o}}const s=Ke.extname(e);const a=this.fileExtensionMap.get(s);if(!a){if(i){throw new Error(`The service registry contains no services for the extension '${s}' for language '${i}'.`)}else{throw new Error(`The service registry contains no services for the extension '${s}'.`)}}return a}hasServices(e){try{this.getServices(e);return true}catch(n){return false}}get all(){return Array.from(this.languageIdMap.values())}}function hs(t){return{code:t}}var Nu;(function(t){t.all=["fast","slow","built-in"]})(Nu||(Nu={}));class cS{constructor(e){this.entries=new Su;this.entriesBefore=[];this.entriesAfter=[];this.reflection=e.shared.AstReflection}register(e,n=this,r="fast"){if(r==="built-in"){throw new Error("The 'built-in' category is reserved for lexer, parser, and linker errors.")}for(const[i,s]of Object.entries(e)){const a=s;if(Array.isArray(a)){for(const o of a){const l={check:this.wrapValidationException(o,n),category:r};this.addEntry(i,l)}}else if(typeof a==="function"){const o={check:this.wrapValidationException(a,n),category:r};this.addEntry(i,o)}else{js()}}}wrapValidationException(e,n){return async(r,i,s)=>{await this.handleException(()=>e.call(n,r,i,s),"An error occurred during validation",i,r)}}async handleException(e,n,r,i){try{await e()}catch(s){if(aa(s)){throw s}console.error(`${n}:`,s);if(s instanceof Error&&s.stack){console.error(s.stack)}const a=s instanceof Error?s.message:String(s);r("error",`${n}: ${a}`,{node:i})}}addEntry(e,n){if(e==="AstNode"){this.entries.add("AstNode",n);return}for(const r of this.reflection.getAllSubTypes(e)){this.entries.add(r,n)}}getChecks(e,n){let r=Ae(this.entries.get(e)).concat(this.entries.get("AstNode"));if(n){r=r.filter(i=>n.includes(i.category))}return r.map(i=>i.check)}registerBeforeDocument(e,n=this){this.entriesBefore.push(this.wrapPreparationException(e,"An error occurred during set-up of the validation",n))}registerAfterDocument(e,n=this){this.entriesAfter.push(this.wrapPreparationException(e,"An error occurred during tear-down of the validation",n))}wrapPreparationException(e,n,r){return async(i,s,a,o)=>{await this.handleException(()=>e.call(r,i,s,a,o),n,s,i)}}get checksBefore(){return this.entriesBefore}get checksAfter(){return this.entriesAfter}}class Mv{constructor(e){this.validationRegistry=e.validation.ValidationRegistry;this.metadata=e.LanguageMetaData}async validateDocument(e,n={},r=he.CancellationToken.None){const i=e.parseResult;const s=[];await ut(r);if(!n.categories||n.categories.includes("built-in")){this.processLexingErrors(i,s,n);if(n.stopAfterLexingErrors&&s.some(a=>{var o;return((o=a.data)===null||o===void 0?void 0:o.code)===xt.LexingError})){return s}this.processParsingErrors(i,s,n);if(n.stopAfterParsingErrors&&s.some(a=>{var o;return((o=a.data)===null||o===void 0?void 0:o.code)===xt.ParsingError})){return s}this.processLinkingErrors(e,s,n);if(n.stopAfterLinkingErrors&&s.some(a=>{var o;return((o=a.data)===null||o===void 0?void 0:o.code)===xt.LinkingError})){return s}}try{s.push(...await this.validateAst(i.value,n,r))}catch(a){if(aa(a)){throw a}console.error("An error occurred during validation:",a)}await ut(r);return s}processLexingErrors(e,n,r){var i,s,a;const o=[...e.lexerErrors,...(s=(i=e.lexerReport)===null||i===void 0?void 0:i.diagnostics)!==null&&s!==void 0?s:[]];for(const l of o){const u=(a=l.severity)!==null&&a!==void 0?a:"error";const c={severity:Tc(u),range:{start:{line:l.line-1,character:l.column-1},end:{line:l.line-1,character:l.column+l.length-1}},message:l.message,data:fS(u),source:this.getSource()};n.push(c)}}processParsingErrors(e,n,r){for(const i of e.parserErrors){let s=void 0;if(isNaN(i.token.startOffset)){if("previousToken"in i){const a=i.previousToken;if(!isNaN(a.startOffset)){const o={line:a.endLine-1,character:a.endColumn};s={start:o,end:o}}else{const o={line:0,character:0};s={start:o,end:o}}}}else{s=Nd(i.token)}if(s){const a={severity:Tc("error"),range:s,message:i.message,data:hs(xt.ParsingError),source:this.getSource()};n.push(a)}}}processLinkingErrors(e,n,r){for(const i of e.references){const s=i.error;if(s){const a={node:s.container,property:s.property,index:s.index,data:{code:xt.LinkingError,containerType:s.container.$type,property:s.property,refText:s.reference.$refText}};n.push(this.toDiagnostic("error",s.message,a))}}}async validateAst(e,n,r=he.CancellationToken.None){const i=[];const s=(a,o,l)=>{i.push(this.toDiagnostic(a,o,l))};await this.validateAstBefore(e,n,s,r);await this.validateAstNodes(e,n,s,r);await this.validateAstAfter(e,n,s,r);return i}async validateAstBefore(e,n,r,i=he.CancellationToken.None){var s;const a=this.validationRegistry.checksBefore;for(const o of a){await ut(i);await o(e,r,(s=n.categories)!==null&&s!==void 0?s:[],i)}}async validateAstNodes(e,n,r,i=he.CancellationToken.None){await Promise.all(qn(e).map(async s=>{await ut(i);const a=this.validationRegistry.getChecks(s.$type,n.categories);for(const o of a){await o(s,r,i)}}))}async validateAstAfter(e,n,r,i=he.CancellationToken.None){var s;const a=this.validationRegistry.checksAfter;for(const o of a){await ut(i);await o(e,r,(s=n.categories)!==null&&s!==void 0?s:[],i)}}toDiagnostic(e,n,r){return{message:n,range:dS(r),severity:Tc(e),code:r.code,codeDescription:r.codeDescription,tags:r.tags,relatedInformation:r.relatedInformation,data:r.data,source:this.getSource()}}getSource(){return this.metadata.languageId}}function dS(t){if(t.range){return t.range}let e;if(typeof t.property==="string"){e=ap(t.node.$cstNode,t.property,t.index)}else if(typeof t.keyword==="string"){e=Pg(t.node.$cstNode,t.keyword,t.index)}e!==null&&e!==void 0?e:e=t.node.$cstNode;if(!e){return{start:{line:0,character:0},end:{line:0,character:0}}}return e.range}function Tc(t){switch(t){case"error":return 1;case"warning":return 2;case"info":return 3;case"hint":return 4;default:throw new Error("Invalid diagnostic severity: "+t)}}function fS(t){switch(t){case"error":return hs(xt.LexingError);case"warning":return hs(xt.LexingWarning);case"info":return hs(xt.LexingInfo);case"hint":return hs(xt.LexingHint);default:throw new Error("Invalid diagnostic severity: "+t)}}var xt;(function(t){t.LexingError="lexing-error";t.LexingWarning="lexing-warning";t.LexingInfo="lexing-info";t.LexingHint="lexing-hint";t.ParsingError="parsing-error";t.LinkingError="linking-error"})(xt||(xt={}));class pS{constructor(e){this.astNodeLocator=e.workspace.AstNodeLocator;this.nameProvider=e.references.NameProvider}createDescription(e,n,r){const i=r!==null&&r!==void 0?r:ct(e);n!==null&&n!==void 0?n:n=this.nameProvider.getName(e);const s=this.astNodeLocator.getAstNodePath(e);if(!n){throw new Error(`Node at path ${s} has no name.`)}let a;const o=()=>{var l;return a!==null&&a!==void 0?a:a=ru((l=this.nameProvider.getNameNode(e))!==null&&l!==void 0?l:e.$cstNode)};return{node:e,name:n,get nameSegment(){return o()},selectionSegment:ru(e.$cstNode),type:e.$type,documentUri:i.uri,path:s}}}class mS{constructor(e){this.nodeLocator=e.workspace.AstNodeLocator}async createDescriptions(e,n=he.CancellationToken.None){const r=[];const i=e.parseResult.value;for(const s of qn(i)){await ut(n);wg(s).filter(a=>!Ll(a)).forEach(a=>{const o=this.createDescription(a);if(o){r.push(o)}})}return r}createDescription(e){const n=e.reference.$nodeDescription;const r=e.reference.$refNode;if(!n||!r){return void 0}const i=ct(e.container).uri;return{sourceUri:i,sourcePath:this.nodeLocator.getAstNodePath(e.container),targetUri:n.documentUri,targetPath:n.path,segment:ru(r),local:Ke.equals(n.documentUri,i)}}}class hS{constructor(){this.segmentSeparator="/";this.indexSeparator="@"}getAstNodePath(e){if(e.$container){const n=this.getAstNodePath(e.$container);const r=this.getPathSegment(e);const i=n+this.segmentSeparator+r;return i}return""}getPathSegment({$containerProperty:e,$containerIndex:n}){if(!e){throw new Error("Missing '$containerProperty' in AST node.")}if(n!==void 0){return e+this.indexSeparator+n}return e}getAstNode(e,n){const r=n.split(this.segmentSeparator);return r.reduce((i,s)=>{if(!i||s.length===0){return i}const a=s.indexOf(this.indexSeparator);if(a>0){const o=s.substring(0,a);const l=parseInt(s.substring(a+1));const u=i[o];return u===null||u===void 0?void 0:u[l]}return i[s]},e)}}var yS=yv();class gS{constructor(e){this._ready=new Fp;this.settings={};this.workspaceConfig=false;this.onConfigurationSectionUpdateEmitter=new yS.Emitter;this.serviceRegistry=e.ServiceRegistry}get ready(){return this._ready.promise}initialize(e){var n,r;this.workspaceConfig=(r=(n=e.capabilities.workspace)===null||n===void 0?void 0:n.configuration)!==null&&r!==void 0?r:false}async initialized(e){if(this.workspaceConfig){if(e.register){const n=this.serviceRegistry.all;e.register({section:n.map(r=>this.toSectionName(r.LanguageMetaData.languageId))})}if(e.fetchConfiguration){const n=this.serviceRegistry.all.map(i=>({section:this.toSectionName(i.LanguageMetaData.languageId)}));const r=await e.fetchConfiguration(n);n.forEach((i,s)=>{this.updateSectionConfiguration(i.section,r[s])})}}this._ready.resolve()}updateConfiguration(e){if(!e.settings){return}Object.keys(e.settings).forEach(n=>{const r=e.settings[n];this.updateSectionConfiguration(n,r);this.onConfigurationSectionUpdateEmitter.fire({section:n,configuration:r})})}updateSectionConfiguration(e,n){this.settings[e]=n}async getConfiguration(e,n){await this.ready;const r=this.toSectionName(e);if(this.settings[r]){return this.settings[r][n]}}toSectionName(e){return`${e}`}get onConfigurationSectionUpdate(){return this.onConfigurationSectionUpdateEmitter.event}}var Ns;(function(t){function e(n){return{dispose:async()=>await n()}}t.create=e})(Ns||(Ns={}));class IS{constructor(e){this.updateBuildOptions={validation:{categories:["built-in","fast"]}};this.updateListeners=[];this.buildPhaseListeners=new Su;this.documentPhaseListeners=new Su;this.buildState=new Map;this.documentBuildWaiters=new Map;this.currentState=z.Changed;this.langiumDocuments=e.workspace.LangiumDocuments;this.langiumDocumentFactory=e.workspace.LangiumDocumentFactory;this.textDocuments=e.workspace.TextDocuments;this.indexManager=e.workspace.IndexManager;this.serviceRegistry=e.ServiceRegistry}async build(e,n={},r=he.CancellationToken.None){var i,s;for(const a of e){const o=a.uri.toString();if(a.state===z.Validated){if(typeof n.validation==="boolean"&&n.validation){a.state=z.IndexedReferences;a.diagnostics=void 0;this.buildState.delete(o)}else if(typeof n.validation==="object"){const l=this.buildState.get(o);const u=(i=l===null||l===void 0?void 0:l.result)===null||i===void 0?void 0:i.validationChecks;if(u){const c=(s=n.validation.categories)!==null&&s!==void 0?s:Nu.all;const d=c.filter(f=>!u.includes(f));if(d.length>0){this.buildState.set(o,{completed:false,options:{validation:Object.assign(Object.assign({},n.validation),{categories:d})},result:l.result});a.state=z.IndexedReferences}}}}else{this.buildState.delete(o)}}this.currentState=z.Changed;await this.emitUpdate(e.map(a=>a.uri),[]);await this.buildDocuments(e,n,r)}async update(e,n,r=he.CancellationToken.None){this.currentState=z.Changed;for(const a of n){this.langiumDocuments.deleteDocument(a);this.buildState.delete(a.toString());this.indexManager.remove(a)}for(const a of e){const o=this.langiumDocuments.invalidateDocument(a);if(!o){const l=this.langiumDocumentFactory.fromModel({$type:"INVALID"},a);l.state=z.Changed;this.langiumDocuments.addDocument(l)}this.buildState.delete(a.toString())}const i=Ae(e).concat(n).map(a=>a.toString()).toSet();this.langiumDocuments.all.filter(a=>!i.has(a.uri.toString())&&this.shouldRelink(a,i)).forEach(a=>{const o=this.serviceRegistry.getServices(a.uri).references.Linker;o.unlink(a);a.state=Math.min(a.state,z.ComputedScopes);a.diagnostics=void 0});await this.emitUpdate(e,n);await ut(r);const s=this.sortDocuments(this.langiumDocuments.all.filter(a=>{var o;return a.state<z.Linked||!((o=this.buildState.get(a.uri.toString()))===null||o===void 0?void 0:o.completed)}).toArray());await this.buildDocuments(s,this.updateBuildOptions,r)}async emitUpdate(e,n){await Promise.all(this.updateListeners.map(r=>r(e,n)))}sortDocuments(e){let n=0;let r=e.length-1;while(n<r){while(n<e.length&&this.hasTextDocument(e[n])){n++}while(r>=0&&!this.hasTextDocument(e[r])){r--}if(n<r){[e[n],e[r]]=[e[r],e[n]]}}return e}hasTextDocument(e){var n;return Boolean((n=this.textDocuments)===null||n===void 0?void 0:n.get(e.uri))}shouldRelink(e,n){if(e.references.some(r=>r.error!==void 0)){return true}return this.indexManager.isAffected(e,n)}onUpdate(e){this.updateListeners.push(e);return Ns.create(()=>{const n=this.updateListeners.indexOf(e);if(n>=0){this.updateListeners.splice(n,1)}})}async buildDocuments(e,n,r){this.prepareBuild(e,n);await this.runCancelable(e,z.Parsed,r,s=>this.langiumDocumentFactory.update(s,r));await this.runCancelable(e,z.IndexedContent,r,s=>this.indexManager.updateContent(s,r));await this.runCancelable(e,z.ComputedScopes,r,async s=>{const a=this.serviceRegistry.getServices(s.uri).references.ScopeComputation;s.precomputedScopes=await a.computeLocalScopes(s,r)});await this.runCancelable(e,z.Linked,r,s=>{const a=this.serviceRegistry.getServices(s.uri).references.Linker;return a.link(s,r)});await this.runCancelable(e,z.IndexedReferences,r,s=>this.indexManager.updateReferences(s,r));const i=e.filter(s=>this.shouldValidate(s));await this.runCancelable(i,z.Validated,r,s=>this.validate(s,r));for(const s of e){const a=this.buildState.get(s.uri.toString());if(a){a.completed=true}}}prepareBuild(e,n){for(const r of e){const i=r.uri.toString();const s=this.buildState.get(i);if(!s||s.completed){this.buildState.set(i,{completed:false,options:n,result:s===null||s===void 0?void 0:s.result})}}}async runCancelable(e,n,r,i){const s=e.filter(o=>o.state<n);for(const o of s){await ut(r);await i(o);o.state=n;await this.notifyDocumentPhase(o,n,r)}const a=e.filter(o=>o.state===n);await this.notifyBuildPhase(a,n,r);this.currentState=n}onBuildPhase(e,n){this.buildPhaseListeners.add(e,n);return Ns.create(()=>{this.buildPhaseListeners.delete(e,n)})}onDocumentPhase(e,n){this.documentPhaseListeners.add(e,n);return Ns.create(()=>{this.documentPhaseListeners.delete(e,n)})}waitUntil(e,n,r){let i=void 0;if(n&&"path"in n){i=n}else{r=n}r!==null&&r!==void 0?r:r=he.CancellationToken.None;if(i){const s=this.langiumDocuments.getDocument(i);if(s&&s.state>e){return Promise.resolve(i)}}if(this.currentState>=e){return Promise.resolve(void 0)}else if(r.isCancellationRequested){return Promise.reject(Au)}return new Promise((s,a)=>{const o=this.onBuildPhase(e,()=>{o.dispose();l.dispose();if(i){const u=this.langiumDocuments.getDocument(i);s(u===null||u===void 0?void 0:u.uri)}else{s(void 0)}});const l=r.onCancellationRequested(()=>{o.dispose();l.dispose();a(Au)})})}async notifyDocumentPhase(e,n,r){const i=this.documentPhaseListeners.get(n);const s=i.slice();for(const a of s){try{await a(e,r)}catch(o){if(!aa(o)){throw o}}}}async notifyBuildPhase(e,n,r){if(e.length===0){return}const i=this.buildPhaseListeners.get(n);const s=i.slice();for(const a of s){await ut(r);await a(e,r)}}shouldValidate(e){return Boolean(this.getBuildOptions(e).validation)}async validate(e,n){var r,i;const s=this.serviceRegistry.getServices(e.uri).validation.DocumentValidator;const a=this.getBuildOptions(e).validation;const o=typeof a==="object"?a:void 0;const l=await s.validateDocument(e,o,n);if(e.diagnostics){e.diagnostics.push(...l)}else{e.diagnostics=l}const u=this.buildState.get(e.uri.toString());if(u){(r=u.result)!==null&&r!==void 0?r:u.result={};const c=(i=o===null||o===void 0?void 0:o.categories)!==null&&i!==void 0?i:Nu.all;if(u.result.validationChecks){u.result.validationChecks.push(...c)}else{u.result.validationChecks=[...c]}}}getBuildOptions(e){var n,r;return(r=(n=this.buildState.get(e.uri.toString()))===null||n===void 0?void 0:n.options)!==null&&r!==void 0?r:{}}}class Sv{constructor(e){this.symbolIndex=new Map;this.symbolByTypeIndex=new bv;this.referenceIndex=new Map;this.documents=e.workspace.LangiumDocuments;this.serviceRegistry=e.ServiceRegistry;this.astReflection=e.AstReflection}findAllReferences(e,n){const r=ct(e).uri;const i=[];this.referenceIndex.forEach(s=>{s.forEach(a=>{if(Ke.equals(a.targetUri,r)&&a.targetPath===n){i.push(a)}})});return Ae(i)}allElements(e,n){let r=Ae(this.symbolIndex.keys());if(n){r=r.filter(i=>!n||n.has(i))}return r.map(i=>this.getFileDescriptions(i,e)).flat()}getFileDescriptions(e,n){var r;if(!n){return(r=this.symbolIndex.get(e))!==null&&r!==void 0?r:[]}const i=this.symbolByTypeIndex.get(e,n,()=>{var s;const a=(s=this.symbolIndex.get(e))!==null&&s!==void 0?s:[];return a.filter(o=>this.astReflection.isSubtype(o.type,n))});return i}remove(e){const n=e.toString();this.symbolIndex.delete(n);this.symbolByTypeIndex.clear(n);this.referenceIndex.delete(n)}async updateContent(e,n=he.CancellationToken.None){const r=this.serviceRegistry.getServices(e.uri);const i=await r.references.ScopeComputation.computeExports(e,n);const s=e.uri.toString();this.symbolIndex.set(s,i);this.symbolByTypeIndex.clear(s)}async updateReferences(e,n=he.CancellationToken.None){const r=this.serviceRegistry.getServices(e.uri);const i=await r.workspace.ReferenceDescriptionProvider.createDescriptions(e,n);this.referenceIndex.set(e.uri.toString(),i)}isAffected(e,n){const r=this.referenceIndex.get(e.uri.toString());if(!r){return false}return r.some(i=>!i.local&&n.has(i.targetUri.toString()))}}class Nv{constructor(e){this.initialBuildOptions={};this._ready=new Fp;this.serviceRegistry=e.ServiceRegistry;this.langiumDocuments=e.workspace.LangiumDocuments;this.documentBuilder=e.workspace.DocumentBuilder;this.fileSystemProvider=e.workspace.FileSystemProvider;this.mutex=e.workspace.WorkspaceLock}get ready(){return this._ready.promise}get workspaceFolders(){return this.folders}initialize(e){var n;this.folders=(n=e.workspaceFolders)!==null&&n!==void 0?n:void 0}initialized(e){return this.mutex.write(n=>{var r;return this.initializeWorkspace((r=this.folders)!==null&&r!==void 0?r:[],n)})}async initializeWorkspace(e,n=he.CancellationToken.None){const r=await this.performStartup(e);await ut(n);await this.documentBuilder.build(r,this.initialBuildOptions,n)}async performStartup(e){const n=this.serviceRegistry.all.flatMap(s=>s.LanguageMetaData.fileExtensions);const r=[];const i=s=>{r.push(s);if(!this.langiumDocuments.hasDocument(s.uri)){this.langiumDocuments.addDocument(s)}};await this.loadAdditionalDocuments(e,i);await Promise.all(e.map(s=>[s,this.getRootFolder(s)]).map(async s=>this.traverseFolder(...s,n,i)));this._ready.resolve();return r}loadAdditionalDocuments(e,n){return Promise.resolve()}getRootFolder(e){return dt.parse(e.uri)}async traverseFolder(e,n,r,i){const s=await this.fileSystemProvider.readDirectory(n);await Promise.all(s.map(async a=>{if(this.includeEntry(e,a,r)){if(a.isDirectory){await this.traverseFolder(e,a.uri,r,i)}else if(a.isFile){const o=await this.langiumDocuments.getOrCreateDocument(a.uri);i(o)}}}))}includeEntry(e,n,r){const i=Ke.basename(n.uri);if(i.startsWith(".")){return false}if(n.isDirectory){return i!=="node_modules"&&i!=="out"}else if(n.isFile){const s=Ke.extname(n.uri);return r.includes(s)}return false}}class vS{buildUnexpectedCharactersMessage(e,n,r,i,s){return Ud.buildUnexpectedCharactersMessage(e,n,r,i,s)}buildUnableToPopLexerModeMessage(e){return Ud.buildUnableToPopLexerModeMessage(e)}}const RS={mode:"full"};class kv{constructor(e){this.errorMessageProvider=e.parser.LexerErrorMessageProvider;this.tokenBuilder=e.parser.TokenBuilder;const n=this.tokenBuilder.buildTokens(e.Grammar,{caseInsensitive:e.LanguageMetaData.caseInsensitive});this.tokenTypes=this.toTokenTypeDictionary(n);const r=ph(n)?Object.values(n):n;const i=e.LanguageMetaData.mode==="production";this.chevrotainLexer=new It(r,{positionTracking:"full",skipValidations:i,errorMessageProvider:this.errorMessageProvider})}get definition(){return this.tokenTypes}tokenize(e,n=RS){var r,i,s;const a=this.chevrotainLexer.tokenize(e);return{tokens:a.tokens,errors:a.errors,hidden:(r=a.groups.hidden)!==null&&r!==void 0?r:[],report:(s=(i=this.tokenBuilder).flushLexingReport)===null||s===void 0?void 0:s.call(i,e)}}toTokenTypeDictionary(e){if(ph(e))return e;const n=Pv(e)?Object.values(e.modes).flat():e;const r={};n.forEach(i=>r[i.name]=i);return r}}function ES(t){return Array.isArray(t)&&(t.length===0||"name"in t[0])}function Pv(t){return t&&"modes"in t&&"defaultMode"in t}function ph(t){return!ES(t)&&!Pv(t)}function $S(t,e,n){let r;let i;if(typeof t==="string"){i=e;r=n}else{i=t.range.start;r=e}if(!i){i=le.create(0,0)}const s=Dv(t);const a=Kp(r);const o=wS({lines:s,position:i,options:a});return NS({index:0,tokens:o,position:i})}function TS(t,e){const n=Kp(e);const r=Dv(t);if(r.length===0){return false}const i=r[0];const s=r[r.length-1];const a=n.start;const o=n.end;return Boolean(a===null||a===void 0?void 0:a.exec(i))&&Boolean(o===null||o===void 0?void 0:o.exec(s))}function Dv(t){let e="";if(typeof t==="string"){e=t}else{e=t.text}const n=e.split(OR);return n}const mh=/\s*(@([\p{L}][\p{L}\p{N}]*)?)/uy;const CS=/\{(@[\p{L}][\p{L}\p{N}]*)(\s*)([^\r\n}]+)?\}/gu;function wS(t){var e,n,r;const i=[];let s=t.position.line;let a=t.position.character;for(let o=0;o<t.lines.length;o++){const l=o===0;const u=o===t.lines.length-1;let c=t.lines[o];let d=0;if(l&&t.options.start){const p=(e=t.options.start)===null||e===void 0?void 0:e.exec(c);if(p){d=p.index+p[0].length}}else{const p=(n=t.options.line)===null||n===void 0?void 0:n.exec(c);if(p){d=p.index+p[0].length}}if(u){const p=(r=t.options.end)===null||r===void 0?void 0:r.exec(c);if(p){c=c.substring(0,p.index)}}c=c.substring(0,SS(c));const f=Qf(c,d);if(f>=c.length){if(i.length>0){const p=le.create(s,a);i.push({type:"break",content:"",range:re.create(p,p)})}}else{mh.lastIndex=d;const p=mh.exec(c);if(p){const y=p[0];const R=p[1];const A=le.create(s,a+d);const v=le.create(s,a+d+y.length);i.push({type:"tag",content:R,range:re.create(A,v)});d+=y.length;d=Qf(c,d)}if(d<c.length){const y=c.substring(d);const R=Array.from(y.matchAll(CS));i.push(...bS(R,y,s,a+d))}}s++;a=0}if(i.length>0&&i[i.length-1].type==="break"){return i.slice(0,-1)}return i}function bS(t,e,n,r){const i=[];if(t.length===0){const s=le.create(n,r);const a=le.create(n,r+e.length);i.push({type:"text",content:e,range:re.create(s,a)})}else{let s=0;for(const o of t){const l=o.index;const u=e.substring(s,l);if(u.length>0){i.push({type:"text",content:e.substring(s,l),range:re.create(le.create(n,s+r),le.create(n,l+r))})}let c=u.length+1;const d=o[1];i.push({type:"inline-tag",content:d,range:re.create(le.create(n,s+c+r),le.create(n,s+c+d.length+r))});c+=d.length;if(o.length===4){c+=o[2].length;const f=o[3];i.push({type:"text",content:f,range:re.create(le.create(n,s+c+r),le.create(n,s+c+f.length+r))})}else{i.push({type:"text",content:"",range:re.create(le.create(n,s+c+r),le.create(n,s+c+r))})}s=l+o[0].length}const a=e.substring(s);if(a.length>0){i.push({type:"text",content:a,range:re.create(le.create(n,s+r),le.create(n,s+r+a.length))})}}return i}const AS=/\S/;const MS=/\s*$/;function Qf(t,e){const n=t.substring(e).match(AS);if(n){return e+n.index}else{return t.length}}function SS(t){const e=t.match(MS);if(e&&typeof e.index==="number"){return e.index}return void 0}function NS(t){var e,n,r,i;const s=le.create(t.position.line,t.position.character);if(t.tokens.length===0){return new hh([],re.create(s,s))}const a=[];while(t.index<t.tokens.length){const u=kS(t,a[a.length-1]);if(u){a.push(u)}}const o=(n=(e=a[0])===null||e===void 0?void 0:e.range.start)!==null&&n!==void 0?n:s;const l=(i=(r=a[a.length-1])===null||r===void 0?void 0:r.range.end)!==null&&i!==void 0?i:s;return new hh(a,re.create(o,l))}function kS(t,e){const n=t.tokens[t.index];if(n.type==="tag"){return _v(t,false)}else if(n.type==="text"||n.type==="inline-tag"){return Ov(t)}else{PS(n,e);t.index++;return void 0}}function PS(t,e){if(e){const n=new Lv("",t.range);if("inlines"in e){e.inlines.push(n)}else{e.content.inlines.push(n)}}}function Ov(t){let e=t.tokens[t.index];const n=e;let r=e;const i=[];while(e&&e.type!=="break"&&e.type!=="tag"){i.push(DS(t));r=e;e=t.tokens[t.index]}return new Zf(i,re.create(n.range.start,r.range.end))}function DS(t){const e=t.tokens[t.index];if(e.type==="inline-tag"){return _v(t,true)}else{return Bv(t)}}function _v(t,e){const n=t.tokens[t.index++];const r=n.content.substring(1);const i=t.tokens[t.index];if((i===null||i===void 0?void 0:i.type)==="text"){if(e){const s=Bv(t);return new wc(r,new Zf([s],s.range),e,re.create(n.range.start,s.range.end))}else{const s=Ov(t);return new wc(r,s,e,re.create(n.range.start,s.range.end))}}else{const s=n.range;return new wc(r,new Zf([],s),e,s)}}function Bv(t){const e=t.tokens[t.index++];return new Lv(e.content,e.range)}function Kp(t){if(!t){return Kp({start:"/**",end:"*/",line:"*"})}const{start:e,end:n,line:r}=t;return{start:Cc(e,true),end:Cc(n,false),line:Cc(r,true)}}function Cc(t,e){if(typeof t==="string"||typeof t==="object"){const n=typeof t==="string"?xu(t):t.source;if(e){return new RegExp(`^\\s*${n}`)}else{return new RegExp(`\\s*${n}\\s*$`)}}else{return t}}class hh{constructor(e,n){this.elements=e;this.range=n}getTag(e){return this.getAllTags().find(n=>n.name===e)}getTags(e){return this.getAllTags().filter(n=>n.name===e)}getAllTags(){return this.elements.filter(e=>"name"in e)}toString(){let e="";for(const n of this.elements){if(e.length===0){e=n.toString()}else{const r=n.toString();e+=yh(e)+r}}return e.trim()}toMarkdown(e){let n="";for(const r of this.elements){if(n.length===0){n=r.toMarkdown(e)}else{const i=r.toMarkdown(e);n+=yh(n)+i}}return n.trim()}}class wc{constructor(e,n,r,i){this.name=e;this.content=n;this.inline=r;this.range=i}toString(){let e=`@${this.name}`;const n=this.content.toString();if(this.content.inlines.length===1){e=`${e} ${n}`}else if(this.content.inlines.length>1){e=`${e}
${n}`}if(this.inline){return`{${e}}`}else{return e}}toMarkdown(e){var n,r;return(r=(n=e===null||e===void 0?void 0:e.renderTag)===null||n===void 0?void 0:n.call(e,this))!==null&&r!==void 0?r:this.toMarkdownDefault(e)}toMarkdownDefault(e){const n=this.content.toMarkdown(e);if(this.inline){const s=OS(this.name,n,e!==null&&e!==void 0?e:{});if(typeof s==="string"){return s}}let r="";if((e===null||e===void 0?void 0:e.tag)==="italic"||(e===null||e===void 0?void 0:e.tag)===void 0){r="*"}else if((e===null||e===void 0?void 0:e.tag)==="bold"){r="**"}else if((e===null||e===void 0?void 0:e.tag)==="bold-italic"){r="***"}let i=`${r}@${this.name}${r}`;if(this.content.inlines.length===1){i=`${i} — ${n}`}else if(this.content.inlines.length>1){i=`${i}
${n}`}if(this.inline){return`{${i}}`}else{return i}}}function OS(t,e,n){var r,i;if(t==="linkplain"||t==="linkcode"||t==="link"){const s=e.indexOf(" ");let a=e;if(s>0){const l=Qf(e,s);a=e.substring(l);e=e.substring(0,s)}if(t==="linkcode"||t==="link"&&n.link==="code"){a=`\`${a}\``}const o=(i=(r=n.renderLink)===null||r===void 0?void 0:r.call(n,e,a))!==null&&i!==void 0?i:_S(e,a);return o}return void 0}function _S(t,e){try{dt.parse(t,true);return`[${e}](${t})`}catch(n){return t}}class Zf{constructor(e,n){this.inlines=e;this.range=n}toString(){let e="";for(let n=0;n<this.inlines.length;n++){const r=this.inlines[n];const i=this.inlines[n+1];e+=r.toString();if(i&&i.range.start.line>r.range.start.line){e+="\n"}}return e}toMarkdown(e){let n="";for(let r=0;r<this.inlines.length;r++){const i=this.inlines[r];const s=this.inlines[r+1];n+=i.toMarkdown(e);if(s&&s.range.start.line>i.range.start.line){n+="\n"}}return n}}class Lv{constructor(e,n){this.text=e;this.range=n}toString(){return this.text}toMarkdown(){return this.text}}function yh(t){if(t.endsWith("\n")){return"\n"}else{return"\n\n"}}class xv{constructor(e){this.indexManager=e.shared.workspace.IndexManager;this.commentProvider=e.documentation.CommentProvider}getDocumentation(e){const n=this.commentProvider.getComment(e);if(n&&TS(n)){const r=$S(n);return r.toMarkdown({renderLink:(i,s)=>{return this.documentationLinkRenderer(e,i,s)},renderTag:i=>{return this.documentationTagRenderer(e,i)}})}return void 0}documentationLinkRenderer(e,n,r){var i;const s=(i=this.findNameInPrecomputedScopes(e,n))!==null&&i!==void 0?i:this.findNameInGlobalScope(e,n);if(s&&s.nameSegment){const a=s.nameSegment.range.start.line+1;const o=s.nameSegment.range.start.character+1;const l=s.documentUri.with({fragment:`L${a},${o}`});return`[${r}](${l.toString()})`}else{return void 0}}documentationTagRenderer(e,n){return void 0}findNameInPrecomputedScopes(e,n){const r=ct(e);const i=r.precomputedScopes;if(!i){return void 0}let s=e;do{const a=i.get(s);const o=a.find(l=>l.name===n);if(o){return o}s=s.$container}while(s);return void 0}findNameInGlobalScope(e,n){const r=this.indexManager.allElements().find(i=>i.name===n);return r}}class BS{constructor(e){this.grammarConfig=()=>e.parser.GrammarConfig}getComment(e){var n;if(oS(e)){return e.$comment}return(n=fR(e.$cstNode,this.grammarConfig().multilineCommentRules))===null||n===void 0?void 0:n.text}}class LS{constructor(e){this.syncParser=e.parser.LangiumParser}parse(e,n){return Promise.resolve(this.syncParser.parse(e))}}class xS{constructor(){this.previousTokenSource=new he.CancellationTokenSource;this.writeQueue=[];this.readQueue=[];this.done=true}write(e){this.cancelWrite();const n=QM();this.previousTokenSource=n;return this.enqueue(this.writeQueue,e,n.token)}read(e){return this.enqueue(this.readQueue,e)}enqueue(e,n,r=he.CancellationToken.None){const i=new Fp;const s={action:n,deferred:i,cancellationToken:r};e.push(s);this.performNextOperation();return i.promise}async performNextOperation(){if(!this.done){return}const e=[];if(this.writeQueue.length>0){e.push(this.writeQueue.shift())}else if(this.readQueue.length>0){e.push(...this.readQueue.splice(0,this.readQueue.length))}else{return}this.done=false;await Promise.all(e.map(async({action:n,deferred:r,cancellationToken:i})=>{try{const s=await Promise.resolve().then(()=>n(i));r.resolve(s)}catch(s){if(aa(s)){r.resolve(void 0)}else{r.reject(s)}}}));this.done=true;this.performNextOperation()}cancelWrite(){this.previousTokenSource.cancel()}}class FS{constructor(e){this.grammarElementIdMap=new ch;this.tokenTypeIdMap=new ch;this.grammar=e.Grammar;this.lexer=e.parser.Lexer;this.linker=e.references.Linker}dehydrate(e){return{lexerErrors:e.lexerErrors,lexerReport:e.lexerReport?this.dehydrateLexerReport(e.lexerReport):void 0,parserErrors:e.parserErrors.map(n=>Object.assign(Object.assign({},n),{message:n.message})),value:this.dehydrateAstNode(e.value,this.createDehyrationContext(e.value))}}dehydrateLexerReport(e){return e}createDehyrationContext(e){const n=new Map;const r=new Map;for(const i of qn(e)){n.set(i,{})}if(e.$cstNode){for(const i of nu(e.$cstNode)){r.set(i,{})}}return{astNodes:n,cstNodes:r}}dehydrateAstNode(e,n){const r=n.astNodes.get(e);r.$type=e.$type;r.$containerIndex=e.$containerIndex;r.$containerProperty=e.$containerProperty;if(e.$cstNode!==void 0){r.$cstNode=this.dehydrateCstNode(e.$cstNode,n)}for(const[i,s]of Object.entries(e)){if(i.startsWith("$")){continue}if(Array.isArray(s)){const a=[];r[i]=a;for(const o of s){if(Ze(o)){a.push(this.dehydrateAstNode(o,n))}else if(tn(o)){a.push(this.dehydrateReference(o,n))}else{a.push(o)}}}else if(Ze(s)){r[i]=this.dehydrateAstNode(s,n)}else if(tn(s)){r[i]=this.dehydrateReference(s,n)}else if(s!==void 0){r[i]=s}}return r}dehydrateReference(e,n){const r={};r.$refText=e.$refText;if(e.$refNode){r.$refNode=n.cstNodes.get(e.$refNode)}return r}dehydrateCstNode(e,n){const r=n.cstNodes.get(e);if(pg(e)){r.fullText=e.fullText}else{r.grammarSource=this.getGrammarElementId(e.grammarSource)}r.hidden=e.hidden;r.astNode=n.astNodes.get(e.astNode);if(hr(e)){r.content=e.content.map(i=>this.dehydrateCstNode(i,n))}else if(qs(e)){r.tokenType=e.tokenType.name;r.offset=e.offset;r.length=e.length;r.startLine=e.range.start.line;r.startColumn=e.range.start.character;r.endLine=e.range.end.line;r.endColumn=e.range.end.character}return r}hydrate(e){const n=e.value;const r=this.createHydrationContext(n);if("$cstNode"in n){this.hydrateCstNode(n.$cstNode,r)}return{lexerErrors:e.lexerErrors,lexerReport:e.lexerReport,parserErrors:e.parserErrors,value:this.hydrateAstNode(n,r)}}createHydrationContext(e){const n=new Map;const r=new Map;for(const s of qn(e)){n.set(s,{})}let i;if(e.$cstNode){for(const s of nu(e.$cstNode)){let a;if("fullText"in s){a=new av(s.fullText);i=a}else if("content"in s){a=new Lp}else if("tokenType"in s){a=this.hydrateCstLeafNode(s)}if(a){r.set(s,a);a.root=i}}}return{astNodes:n,cstNodes:r}}hydrateAstNode(e,n){const r=n.astNodes.get(e);r.$type=e.$type;r.$containerIndex=e.$containerIndex;r.$containerProperty=e.$containerProperty;if(e.$cstNode){r.$cstNode=n.cstNodes.get(e.$cstNode)}for(const[i,s]of Object.entries(e)){if(i.startsWith("$")){continue}if(Array.isArray(s)){const a=[];r[i]=a;for(const o of s){if(Ze(o)){a.push(this.setParent(this.hydrateAstNode(o,n),r))}else if(tn(o)){a.push(this.hydrateReference(o,r,i,n))}else{a.push(o)}}}else if(Ze(s)){r[i]=this.setParent(this.hydrateAstNode(s,n),r)}else if(tn(s)){r[i]=this.hydrateReference(s,r,i,n)}else if(s!==void 0){r[i]=s}}return r}setParent(e,n){e.$container=n;return e}hydrateReference(e,n,r,i){return this.linker.buildReference(n,r,i.cstNodes.get(e.$refNode),e.$refText)}hydrateCstNode(e,n,r=0){const i=n.cstNodes.get(e);if(typeof e.grammarSource==="number"){i.grammarSource=this.getGrammarElement(e.grammarSource)}i.astNode=n.astNodes.get(e.astNode);if(hr(i)){for(const s of e.content){const a=this.hydrateCstNode(s,n,r++);i.content.push(a)}}return i}hydrateCstLeafNode(e){const n=this.getTokenType(e.tokenType);const r=e.offset;const i=e.length;const s=e.startLine;const a=e.startColumn;const o=e.endLine;const l=e.endColumn;const u=e.hidden;const c=new zf(r,i,{start:{line:s,character:a},end:{line:o,character:l}},n,u);return c}getTokenType(e){return this.lexer.definition[e]}getGrammarElementId(e){if(!e){return void 0}if(this.grammarElementIdMap.size===0){this.createGrammarElementIdMap()}return this.grammarElementIdMap.get(e)}getGrammarElement(e){if(this.grammarElementIdMap.size===0){this.createGrammarElementIdMap()}const n=this.grammarElementIdMap.getKey(e);return n}createGrammarElementIdMap(){let e=0;for(const n of qn(this.grammar)){if(Rg(n)){this.grammarElementIdMap.set(n,e++)}}}}function Fv(t){return{documentation:{CommentProvider:e=>new BS(e),DocumentationProvider:e=>new xv(e)},parser:{AsyncParser:e=>new LS(e),GrammarConfig:e=>eE(e),LangiumParser:e=>HM(e),CompletionParser:e=>GM(e),ValueConverter:()=>new jM,TokenBuilder:()=>new mv,Lexer:e=>new kv(e),ParserErrorMessageProvider:()=>new uv,LexerErrorMessageProvider:()=>new vS},workspace:{AstNodeLocator:()=>new hS,AstNodeDescriptionProvider:e=>new pS(e),ReferenceDescriptionProvider:e=>new mS(e)},references:{Linker:e=>new nS(e),NameProvider:()=>new Ev,ScopeProvider:e=>new Av(e),ScopeComputation:e=>new Tv(e),References:e=>new $v(e)},serializer:{Hydrator:e=>new FS(e),JsonSerializer:e=>new lS(e)},validation:{DocumentValidator:e=>new Mv(e),ValidationRegistry:e=>new cS(e)},shared:()=>t.shared}}function Kv(t){return{ServiceRegistry:e=>new uS(e),workspace:{LangiumDocuments:e=>new tS(e),LangiumDocumentFactory:e=>new eS(e),DocumentBuilder:e=>new IS(e),IndexManager:e=>new Sv(e),WorkspaceManager:e=>new Nv(e),FileSystemProvider:e=>t.fileSystemProvider(e),WorkspaceLock:()=>new xS,ConfigurationProvider:e=>new gS(e)}}}var ku;(function(t){t.merge=(e,n)=>Du(Du({},e),n)})(ku||(ku={}));function Pu(t,e,n,r,i,s,a,o,l){const u=[t,e,n,r,i,s,a,o,l].reduce(Du,{});return Wv(u)}const Uv=Symbol("isProxy");function ep(t){if(t&&t[Uv]){for(const e of Object.values(t)){ep(e)}}return t}function Wv(t,e){const n=new Proxy({},{deleteProperty:()=>false,set:()=>{throw new Error("Cannot set property on injected service container")},get:(r,i)=>{if(i===Uv){return true}else{return Ih(r,i,t,e||n)}},getOwnPropertyDescriptor:(r,i)=>(Ih(r,i,t,e||n),Object.getOwnPropertyDescriptor(r,i)),has:(r,i)=>i in t,ownKeys:()=>[...Object.getOwnPropertyNames(t)]});return n}const gh=Symbol();function Ih(t,e,n,r){if(e in t){if(t[e]instanceof Error){throw new Error("Construction failure. Please make sure that your dependencies are constructable.",{cause:t[e]})}if(t[e]===gh){throw new Error('Cycle detected. Please make "'+String(e)+'" lazy. Visit https://langium.org/docs/reference/configuration-services/#resolving-cyclic-dependencies')}return t[e]}else if(e in n){const i=n[e];t[e]=gh;try{t[e]=typeof i==="function"?i(r):Wv(i,r)}catch(s){t[e]=s instanceof Error?s:void 0;throw s}return t[e]}else{return void 0}}function Du(t,e){if(e){for(const[n,r]of Object.entries(e)){if(r!==void 0){const i=t[n];if(i!==null&&r!==null&&typeof i==="object"&&typeof r==="object"){t[n]=Du(i,r)}else{t[n]=r}}}}return t}class KS{readFile(){throw new Error("No file system is available.")}async readDirectory(){return[]}}const Gv={fileSystemProvider:()=>new KS};const US={Grammar:()=>void 0,LanguageMetaData:()=>({caseInsensitive:false,fileExtensions:[".langium"],languageId:"langium"})};const WS={AstReflection:()=>new Cg};function GS(){const t=Pu(Kv(Gv),WS);const e=Pu(Fv({shared:t}),US);t.ServiceRegistry.register(e);return e}function HS(t){var e;const n=GS();const r=n.serializer.JsonSerializer.deserialize(t);n.shared.workspace.LangiumDocumentFactory.fromModel(r,dt.parse(`memory://${(e=r.name)!==null&&e!==void 0?e:"grammar"}.langium`));return r}var ai={};var oi={};var pn={};var li={};var ui={};var xa={};var bc={};var V={};var ze={};var vh;function oa(){if(vh)return ze;vh=1;Object.defineProperty(ze,"__esModule",{value:true});ze.stringArray=ze.array=ze.func=ze.error=ze.number=ze.string=ze.boolean=void 0;function t(o){return o===true||o===false}ze.boolean=t;function e(o){return typeof o==="string"||o instanceof String}ze.string=e;function n(o){return typeof o==="number"||o instanceof Number}ze.number=n;function r(o){return o instanceof Error}ze.error=r;function i(o){return typeof o==="function"}ze.func=i;function s(o){return Array.isArray(o)}ze.array=s;function a(o){return s(o)&&o.every(l=>e(l))}ze.stringArray=a;return ze}var Rh;function Hv(){if(Rh)return V;Rh=1;Object.defineProperty(V,"__esModule",{value:true});V.Message=V.NotificationType9=V.NotificationType8=V.NotificationType7=V.NotificationType6=V.NotificationType5=V.NotificationType4=V.NotificationType3=V.NotificationType2=V.NotificationType1=V.NotificationType0=V.NotificationType=V.RequestType9=V.RequestType8=V.RequestType7=V.RequestType6=V.RequestType5=V.RequestType4=V.RequestType3=V.RequestType2=V.RequestType1=V.RequestType=V.RequestType0=V.AbstractMessageSignature=V.ParameterStructures=V.ResponseError=V.ErrorCodes=void 0;const t=oa();var e;(function(T){T.ParseError=-32700;T.InvalidRequest=-32600;T.MethodNotFound=-32601;T.InvalidParams=-32602;T.InternalError=-32603;T.jsonrpcReservedErrorRangeStart=-32099;T.serverErrorStart=-32099;T.MessageWriteError=-32099;T.MessageReadError=-32098;T.PendingResponseRejected=-32097;T.ConnectionInactive=-32096;T.ServerNotInitialized=-32002;T.UnknownErrorCode=-32001;T.jsonrpcReservedErrorRangeEnd=-32e3;T.serverErrorEnd=-32e3})(e||(V.ErrorCodes=e={}));class n extends Error{constructor(g,M,L){super(M);this.code=t.number(g)?g:e.UnknownErrorCode;this.data=L;Object.setPrototypeOf(this,n.prototype)}toJson(){const g={code:this.code,message:this.message};if(this.data!==void 0){g.data=this.data}return g}}V.ResponseError=n;class r{constructor(g){this.kind=g}static is(g){return g===r.auto||g===r.byName||g===r.byPosition}toString(){return this.kind}}V.ParameterStructures=r;r.auto=new r("auto");r.byPosition=new r("byPosition");r.byName=new r("byName");class i{constructor(g,M){this.method=g;this.numberOfParams=M}get parameterStructures(){return r.auto}}V.AbstractMessageSignature=i;class s extends i{constructor(g){super(g,0)}}V.RequestType0=s;class a extends i{constructor(g,M=r.auto){super(g,1);this._parameterStructures=M}get parameterStructures(){return this._parameterStructures}}V.RequestType=a;class o extends i{constructor(g,M=r.auto){super(g,1);this._parameterStructures=M}get parameterStructures(){return this._parameterStructures}}V.RequestType1=o;class l extends i{constructor(g){super(g,2)}}V.RequestType2=l;class u extends i{constructor(g){super(g,3)}}V.RequestType3=u;class c extends i{constructor(g){super(g,4)}}V.RequestType4=c;class d extends i{constructor(g){super(g,5)}}V.RequestType5=d;class f extends i{constructor(g){super(g,6)}}V.RequestType6=f;class p extends i{constructor(g){super(g,7)}}V.RequestType7=p;class y extends i{constructor(g){super(g,8)}}V.RequestType8=y;class R extends i{constructor(g){super(g,9)}}V.RequestType9=R;class A extends i{constructor(g,M=r.auto){super(g,1);this._parameterStructures=M}get parameterStructures(){return this._parameterStructures}}V.NotificationType=A;class v extends i{constructor(g){super(g,0)}}V.NotificationType0=v;class $ extends i{constructor(g,M=r.auto){super(g,1);this._parameterStructures=M}get parameterStructures(){return this._parameterStructures}}V.NotificationType1=$;class C extends i{constructor(g){super(g,2)}}V.NotificationType2=C;class O extends i{constructor(g){super(g,3)}}V.NotificationType3=O;class Y extends i{constructor(g){super(g,4)}}V.NotificationType4=Y;class G extends i{constructor(g){super(g,5)}}V.NotificationType5=G;class J extends i{constructor(g){super(g,6)}}V.NotificationType6=J;class te extends i{constructor(g){super(g,7)}}V.NotificationType7=te;class ie extends i{constructor(g){super(g,8)}}V.NotificationType8=ie;class ce extends i{constructor(g){super(g,9)}}V.NotificationType9=ce;var _;(function(T){function g(D){const B=D;return B&&t.string(B.method)&&(t.string(B.id)||t.number(B.id))}T.isRequest=g;function M(D){const B=D;return B&&t.string(B.method)&&D.id===void 0}T.isNotification=M;function L(D){const B=D;return B&&(B.result!==void 0||!!B.error)&&(t.string(B.id)||t.number(B.id)||B.id===null)}T.isResponse=L})(_||(V.Message=_={}));return V}var mn={};var Eh;function qv(){if(Eh)return mn;Eh=1;var t;Object.defineProperty(mn,"__esModule",{value:true});mn.LRUCache=mn.LinkedMap=mn.Touch=void 0;var e;(function(i){i.None=0;i.First=1;i.AsOld=i.First;i.Last=2;i.AsNew=i.Last})(e||(mn.Touch=e={}));class n{constructor(){this[t]="LinkedMap";this._map=new Map;this._head=void 0;this._tail=void 0;this._size=0;this._state=0}clear(){this._map.clear();this._head=void 0;this._tail=void 0;this._size=0;this._state++}isEmpty(){return!this._head&&!this._tail}get size(){return this._size}get first(){return this._head?.value}get last(){return this._tail?.value}has(s){return this._map.has(s)}get(s,a=e.None){const o=this._map.get(s);if(!o){return void 0}if(a!==e.None){this.touch(o,a)}return o.value}set(s,a,o=e.None){let l=this._map.get(s);if(l){l.value=a;if(o!==e.None){this.touch(l,o)}}else{l={key:s,value:a,next:void 0,previous:void 0};switch(o){case e.None:this.addItemLast(l);break;case e.First:this.addItemFirst(l);break;case e.Last:this.addItemLast(l);break;default:this.addItemLast(l);break}this._map.set(s,l);this._size++}return this}delete(s){return!!this.remove(s)}remove(s){const a=this._map.get(s);if(!a){return void 0}this._map.delete(s);this.removeItem(a);this._size--;return a.value}shift(){if(!this._head&&!this._tail){return void 0}if(!this._head||!this._tail){throw new Error("Invalid list")}const s=this._head;this._map.delete(s.key);this.removeItem(s);this._size--;return s.value}forEach(s,a){const o=this._state;let l=this._head;while(l){if(a){s.bind(a)(l.value,l.key,this)}else{s(l.value,l.key,this)}if(this._state!==o){throw new Error(`LinkedMap got modified during iteration.`)}l=l.next}}keys(){const s=this._state;let a=this._head;const o={[Symbol.iterator]:()=>{return o},next:()=>{if(this._state!==s){throw new Error(`LinkedMap got modified during iteration.`)}if(a){const l={value:a.key,done:false};a=a.next;return l}else{return{value:void 0,done:true}}}};return o}values(){const s=this._state;let a=this._head;const o={[Symbol.iterator]:()=>{return o},next:()=>{if(this._state!==s){throw new Error(`LinkedMap got modified during iteration.`)}if(a){const l={value:a.value,done:false};a=a.next;return l}else{return{value:void 0,done:true}}}};return o}entries(){const s=this._state;let a=this._head;const o={[Symbol.iterator]:()=>{return o},next:()=>{if(this._state!==s){throw new Error(`LinkedMap got modified during iteration.`)}if(a){const l={value:[a.key,a.value],done:false};a=a.next;return l}else{return{value:void 0,done:true}}}};return o}[(t=Symbol.toStringTag,Symbol.iterator)](){return this.entries()}trimOld(s){if(s>=this.size){return}if(s===0){this.clear();return}let a=this._head;let o=this.size;while(a&&o>s){this._map.delete(a.key);a=a.next;o--}this._head=a;this._size=o;if(a){a.previous=void 0}this._state++}addItemFirst(s){if(!this._head&&!this._tail){this._tail=s}else if(!this._head){throw new Error("Invalid list")}else{s.next=this._head;this._head.previous=s}this._head=s;this._state++}addItemLast(s){if(!this._head&&!this._tail){this._head=s}else if(!this._tail){throw new Error("Invalid list")}else{s.previous=this._tail;this._tail.next=s}this._tail=s;this._state++}removeItem(s){if(s===this._head&&s===this._tail){this._head=void 0;this._tail=void 0}else if(s===this._head){if(!s.next){throw new Error("Invalid list")}s.next.previous=void 0;this._head=s.next}else if(s===this._tail){if(!s.previous){throw new Error("Invalid list")}s.previous.next=void 0;this._tail=s.previous}else{const a=s.next;const o=s.previous;if(!a||!o){throw new Error("Invalid list")}a.previous=o;o.next=a}s.next=void 0;s.previous=void 0;this._state++}touch(s,a){if(!this._head||!this._tail){throw new Error("Invalid list")}if(a!==e.First&&a!==e.Last){return}if(a===e.First){if(s===this._head){return}const o=s.next;const l=s.previous;if(s===this._tail){l.next=void 0;this._tail=l}else{o.previous=l;l.next=o}s.previous=void 0;s.next=this._head;this._head.previous=s;this._head=s;this._state++}else if(a===e.Last){if(s===this._tail){return}const o=s.next;const l=s.previous;if(s===this._head){o.previous=void 0;this._head=o}else{o.previous=l;l.next=o}s.next=void 0;s.previous=this._tail;this._tail.next=s;this._tail=s;this._state++}}toJSON(){const s=[];this.forEach((a,o)=>{s.push([o,a])});return s}fromJSON(s){this.clear();for(const[a,o]of s){this.set(a,o)}}}mn.LinkedMap=n;class r extends n{constructor(s,a=1){super();this._limit=s;this._ratio=Math.min(Math.max(0,a),1)}get limit(){return this._limit}set limit(s){this._limit=s;this.checkTrim()}get ratio(){return this._ratio}set ratio(s){this._ratio=Math.min(Math.max(0,s),1);this.checkTrim()}get(s,a=e.AsNew){return super.get(s,a)}peek(s){return super.get(s,e.None)}set(s,a){super.set(s,a,e.Last);this.checkTrim();return this}checkTrim(){if(this.size>this._limit){this.trimOld(Math.round(this._limit*this._ratio))}}}mn.LRUCache=r;return mn}var ci={};var $h;function qS(){if($h)return ci;$h=1;Object.defineProperty(ci,"__esModule",{value:true});ci.Disposable=void 0;var t;(function(e){function n(r){return{dispose:r}}e.create=n})(t||(ci.Disposable=t={}));return ci}var ir={};var Fa={};var Th;function Mr(){if(Th)return Fa;Th=1;Object.defineProperty(Fa,"__esModule",{value:true});let t;function e(){if(t===void 0){throw new Error(`No runtime abstraction layer installed`)}return t}(function(n){function r(i){if(i===void 0){throw new Error(`No runtime abstraction layer provided`)}t=i}n.install=r})(e);Fa.default=e;return Fa}var Ch;function la(){if(Ch)return ir;Ch=1;Object.defineProperty(ir,"__esModule",{value:true});ir.Emitter=ir.Event=void 0;const t=Mr();var e;(function(i){const s={dispose(){}};i.None=function(){return s}})(e||(ir.Event=e={}));class n{add(s,a=null,o){if(!this._callbacks){this._callbacks=[];this._contexts=[]}this._callbacks.push(s);this._contexts.push(a);if(Array.isArray(o)){o.push({dispose:()=>this.remove(s,a)})}}remove(s,a=null){if(!this._callbacks){return}let o=false;for(let l=0,u=this._callbacks.length;l<u;l++){if(this._callbacks[l]===s){if(this._contexts[l]===a){this._callbacks.splice(l,1);this._contexts.splice(l,1);return}else{o=true}}}if(o){throw new Error("When adding a listener with a context, you should remove it with the same context")}}invoke(...s){if(!this._callbacks){return[]}const a=[],o=this._callbacks.slice(0),l=this._contexts.slice(0);for(let u=0,c=o.length;u<c;u++){try{a.push(o[u].apply(l[u],s))}catch(d){(0,t.default)().console.error(d)}}return a}isEmpty(){return!this._callbacks||this._callbacks.length===0}dispose(){this._callbacks=void 0;this._contexts=void 0}}class r{constructor(s){this._options=s}get event(){if(!this._event){this._event=(s,a,o)=>{if(!this._callbacks){this._callbacks=new n}if(this._options&&this._options.onFirstListenerAdd&&this._callbacks.isEmpty()){this._options.onFirstListenerAdd(this)}this._callbacks.add(s,a);const l={dispose:()=>{if(!this._callbacks){return}this._callbacks.remove(s,a);l.dispose=r._noop;if(this._options&&this._options.onLastListenerRemove&&this._callbacks.isEmpty()){this._options.onLastListenerRemove(this)}}};if(Array.isArray(o)){o.push(l)}return l}}return this._event}fire(s){if(this._callbacks){this._callbacks.invoke.call(this._callbacks,s)}}dispose(){if(this._callbacks){this._callbacks.dispose();this._callbacks=void 0}}}ir.Emitter=r;r._noop=function(){};return ir}var sr={};var wh;function Up(){if(wh)return sr;wh=1;Object.defineProperty(sr,"__esModule",{value:true});sr.CancellationTokenSource=sr.CancellationToken=void 0;const t=Mr();const e=oa();const n=la();var r;(function(o){o.None=Object.freeze({isCancellationRequested:false,onCancellationRequested:n.Event.None});o.Cancelled=Object.freeze({isCancellationRequested:true,onCancellationRequested:n.Event.None});function l(u){const c=u;return c&&(c===o.None||c===o.Cancelled||e.boolean(c.isCancellationRequested)&&!!c.onCancellationRequested)}o.is=l})(r||(sr.CancellationToken=r={}));const i=Object.freeze(function(o,l){const u=(0,t.default)().timer.setTimeout(o.bind(l),0);return{dispose(){u.dispose()}}});class s{constructor(){this._isCancelled=false}cancel(){if(!this._isCancelled){this._isCancelled=true;if(this._emitter){this._emitter.fire(void 0);this.dispose()}}}get isCancellationRequested(){return this._isCancelled}get onCancellationRequested(){if(this._isCancelled){return i}if(!this._emitter){this._emitter=new n.Emitter}return this._emitter.event}dispose(){if(this._emitter){this._emitter.dispose();this._emitter=void 0}}}class a{get token(){if(!this._token){this._token=new s}return this._token}cancel(){if(!this._token){this._token=r.Cancelled}else{this._token.cancel()}}dispose(){if(!this._token){this._token=r.None}else if(this._token instanceof s){this._token.dispose()}}}sr.CancellationTokenSource=a;return sr}var ar={};var bh;function jS(){if(bh)return ar;bh=1;Object.defineProperty(ar,"__esModule",{value:true});ar.SharedArrayReceiverStrategy=ar.SharedArraySenderStrategy=void 0;const t=Up();var e;(function(a){a.Continue=0;a.Cancelled=1})(e||(e={}));class n{constructor(){this.buffers=new Map}enableCancellation(o){if(o.id===null){return}const l=new SharedArrayBuffer(4);const u=new Int32Array(l,0,1);u[0]=e.Continue;this.buffers.set(o.id,l);o.$cancellationData=l}async sendCancellation(o,l){const u=this.buffers.get(l);if(u===void 0){return}const c=new Int32Array(u,0,1);Atomics.store(c,0,e.Cancelled)}cleanup(o){this.buffers.delete(o)}dispose(){this.buffers.clear()}}ar.SharedArraySenderStrategy=n;class r{constructor(o){this.data=new Int32Array(o,0,1)}get isCancellationRequested(){return Atomics.load(this.data,0)===e.Cancelled}get onCancellationRequested(){throw new Error(`Cancellation over SharedArrayBuffer doesn't support cancellation events`)}}class i{constructor(o){this.token=new r(o)}cancel(){}dispose(){}}class s{constructor(){this.kind="request"}createCancellationTokenSource(o){const l=o.$cancellationData;if(l===void 0){return new t.CancellationTokenSource}return new i(l)}}ar.SharedArrayReceiverStrategy=s;return ar}var hn={};var di={};var Ah;function jv(){if(Ah)return di;Ah=1;Object.defineProperty(di,"__esModule",{value:true});di.Semaphore=void 0;const t=Mr();class e{constructor(r=1){if(r<=0){throw new Error("Capacity must be greater than 0")}this._capacity=r;this._active=0;this._waiting=[]}lock(r){return new Promise((i,s)=>{this._waiting.push({thunk:r,resolve:i,reject:s});this.runNext()})}get active(){return this._active}runNext(){if(this._waiting.length===0||this._active===this._capacity){return}(0,t.default)().timer.setImmediate(()=>this.doRunNext())}doRunNext(){if(this._waiting.length===0||this._active===this._capacity){return}const r=this._waiting.shift();this._active++;if(this._active>this._capacity){throw new Error(`To many thunks active`)}try{const i=r.thunk();if(i instanceof Promise){i.then(s=>{this._active--;r.resolve(s);this.runNext()},s=>{this._active--;r.reject(s);this.runNext()})}else{this._active--;r.resolve(i);this.runNext()}}catch(i){this._active--;r.reject(i);this.runNext()}}}di.Semaphore=e;return di}var Mh;function VS(){if(Mh)return hn;Mh=1;Object.defineProperty(hn,"__esModule",{value:true});hn.ReadableStreamMessageReader=hn.AbstractMessageReader=hn.MessageReader=void 0;const t=Mr();const e=oa();const n=la();const r=jv();var i;(function(l){function u(c){let d=c;return d&&e.func(d.listen)&&e.func(d.dispose)&&e.func(d.onError)&&e.func(d.onClose)&&e.func(d.onPartialMessage)}l.is=u})(i||(hn.MessageReader=i={}));class s{constructor(){this.errorEmitter=new n.Emitter;this.closeEmitter=new n.Emitter;this.partialMessageEmitter=new n.Emitter}dispose(){this.errorEmitter.dispose();this.closeEmitter.dispose()}get onError(){return this.errorEmitter.event}fireError(u){this.errorEmitter.fire(this.asError(u))}get onClose(){return this.closeEmitter.event}fireClose(){this.closeEmitter.fire(void 0)}get onPartialMessage(){return this.partialMessageEmitter.event}firePartialMessage(u){this.partialMessageEmitter.fire(u)}asError(u){if(u instanceof Error){return u}else{return new Error(`Reader received error. Reason: ${e.string(u.message)?u.message:"unknown"}`)}}}hn.AbstractMessageReader=s;var a;(function(l){function u(c){let d;let f;const p=new Map;let y;const R=new Map;if(c===void 0||typeof c==="string"){d=c??"utf-8"}else{d=c.charset??"utf-8";if(c.contentDecoder!==void 0){f=c.contentDecoder;p.set(f.name,f)}if(c.contentDecoders!==void 0){for(const A of c.contentDecoders){p.set(A.name,A)}}if(c.contentTypeDecoder!==void 0){y=c.contentTypeDecoder;R.set(y.name,y)}if(c.contentTypeDecoders!==void 0){for(const A of c.contentTypeDecoders){R.set(A.name,A)}}}if(y===void 0){y=(0,t.default)().applicationJson.decoder;R.set(y.name,y)}return{charset:d,contentDecoder:f,contentDecoders:p,contentTypeDecoder:y,contentTypeDecoders:R}}l.fromOptions=u})(a||(a={}));class o extends s{constructor(u,c){super();this.readable=u;this.options=a.fromOptions(c);this.buffer=(0,t.default)().messageBuffer.create(this.options.charset);this._partialMessageTimeout=1e4;this.nextMessageLength=-1;this.messageToken=0;this.readSemaphore=new r.Semaphore(1)}set partialMessageTimeout(u){this._partialMessageTimeout=u}get partialMessageTimeout(){return this._partialMessageTimeout}listen(u){this.nextMessageLength=-1;this.messageToken=0;this.partialMessageTimer=void 0;this.callback=u;const c=this.readable.onData(d=>{this.onData(d)});this.readable.onError(d=>this.fireError(d));this.readable.onClose(()=>this.fireClose());return c}onData(u){try{this.buffer.append(u);while(true){if(this.nextMessageLength===-1){const d=this.buffer.tryReadHeaders(true);if(!d){return}const f=d.get("content-length");if(!f){this.fireError(new Error(`Header must provide a Content-Length property.
${JSON.stringify(Object.fromEntries(d))}`));return}const p=parseInt(f);if(isNaN(p)){this.fireError(new Error(`Content-Length value must be a number. Got ${f}`));return}this.nextMessageLength=p}const c=this.buffer.tryReadBody(this.nextMessageLength);if(c===void 0){this.setPartialMessageTimer();return}this.clearPartialMessageTimer();this.nextMessageLength=-1;this.readSemaphore.lock(async()=>{const d=this.options.contentDecoder!==void 0?await this.options.contentDecoder.decode(c):c;const f=await this.options.contentTypeDecoder.decode(d,this.options);this.callback(f)}).catch(d=>{this.fireError(d)})}}catch(c){this.fireError(c)}}clearPartialMessageTimer(){if(this.partialMessageTimer){this.partialMessageTimer.dispose();this.partialMessageTimer=void 0}}setPartialMessageTimer(){this.clearPartialMessageTimer();if(this._partialMessageTimeout<=0){return}this.partialMessageTimer=(0,t.default)().timer.setTimeout((u,c)=>{this.partialMessageTimer=void 0;if(u===this.messageToken){this.firePartialMessage({messageToken:u,waitingTime:c});this.setPartialMessageTimer()}},this._partialMessageTimeout,this.messageToken,this._partialMessageTimeout)}}hn.ReadableStreamMessageReader=o;return hn}var yn={};var Sh;function zS(){if(Sh)return yn;Sh=1;Object.defineProperty(yn,"__esModule",{value:true});yn.WriteableStreamMessageWriter=yn.AbstractMessageWriter=yn.MessageWriter=void 0;const t=Mr();const e=oa();const n=jv();const r=la();const i="Content-Length: ";const s="\r\n";var a;(function(c){function d(f){let p=f;return p&&e.func(p.dispose)&&e.func(p.onClose)&&e.func(p.onError)&&e.func(p.write)}c.is=d})(a||(yn.MessageWriter=a={}));class o{constructor(){this.errorEmitter=new r.Emitter;this.closeEmitter=new r.Emitter}dispose(){this.errorEmitter.dispose();this.closeEmitter.dispose()}get onError(){return this.errorEmitter.event}fireError(d,f,p){this.errorEmitter.fire([this.asError(d),f,p])}get onClose(){return this.closeEmitter.event}fireClose(){this.closeEmitter.fire(void 0)}asError(d){if(d instanceof Error){return d}else{return new Error(`Writer received error. Reason: ${e.string(d.message)?d.message:"unknown"}`)}}}yn.AbstractMessageWriter=o;var l;(function(c){function d(f){if(f===void 0||typeof f==="string"){return{charset:f??"utf-8",contentTypeEncoder:(0,t.default)().applicationJson.encoder}}else{return{charset:f.charset??"utf-8",contentEncoder:f.contentEncoder,contentTypeEncoder:f.contentTypeEncoder??(0,t.default)().applicationJson.encoder}}}c.fromOptions=d})(l||(l={}));class u extends o{constructor(d,f){super();this.writable=d;this.options=l.fromOptions(f);this.errorCount=0;this.writeSemaphore=new n.Semaphore(1);this.writable.onError(p=>this.fireError(p));this.writable.onClose(()=>this.fireClose())}async write(d){return this.writeSemaphore.lock(async()=>{const f=this.options.contentTypeEncoder.encode(d,this.options).then(p=>{if(this.options.contentEncoder!==void 0){return this.options.contentEncoder.encode(p)}else{return p}});return f.then(p=>{const y=[];y.push(i,p.byteLength.toString(),s);y.push(s);return this.doWrite(d,y,p)},p=>{this.fireError(p);throw p})})}async doWrite(d,f,p){try{await this.writable.write(f.join(""),"ascii");return this.writable.write(p)}catch(y){this.handleError(y,d);return Promise.reject(y)}}handleError(d,f){this.errorCount++;this.fireError(d,f,this.errorCount)}end(){this.writable.end()}}yn.WriteableStreamMessageWriter=u;return yn}var fi={};var Nh;function XS(){if(Nh)return fi;Nh=1;Object.defineProperty(fi,"__esModule",{value:true});fi.AbstractMessageBuffer=void 0;const t=13;const e=10;const n="\r\n";class r{constructor(s="utf-8"){this._encoding=s;this._chunks=[];this._totalLength=0}get encoding(){return this._encoding}append(s){const a=typeof s==="string"?this.fromString(s,this._encoding):s;this._chunks.push(a);this._totalLength+=a.byteLength}tryReadHeaders(s=false){if(this._chunks.length===0){return void 0}let a=0;let o=0;let l=0;let u=0;e:while(o<this._chunks.length){const p=this._chunks[o];l=0;while(l<p.length){const y=p[l];switch(y){case t:switch(a){case 0:a=1;break;case 2:a=3;break;default:a=0}break;case e:switch(a){case 1:a=2;break;case 3:a=4;l++;break e;default:a=0}break;default:a=0}l++}u+=p.byteLength;o++}if(a!==4){return void 0}const c=this._read(u+l);const d=new Map;const f=this.toString(c,"ascii").split(n);if(f.length<2){return d}for(let p=0;p<f.length-2;p++){const y=f[p];const R=y.indexOf(":");if(R===-1){throw new Error(`Message header must separate key and value using ':'
${y}`)}const A=y.substr(0,R);const v=y.substr(R+1).trim();d.set(s?A.toLowerCase():A,v)}return d}tryReadBody(s){if(this._totalLength<s){return void 0}return this._read(s)}get numberOfBytes(){return this._totalLength}_read(s){if(s===0){return this.emptyBuffer()}if(s>this._totalLength){throw new Error(`Cannot read so many bytes!`)}if(this._chunks[0].byteLength===s){const u=this._chunks[0];this._chunks.shift();this._totalLength-=s;return this.asNative(u)}if(this._chunks[0].byteLength>s){const u=this._chunks[0];const c=this.asNative(u,s);this._chunks[0]=u.slice(s);this._totalLength-=s;return c}const a=this.allocNative(s);let o=0;let l=0;while(s>0){const u=this._chunks[l];if(u.byteLength>s){const c=u.slice(0,s);a.set(c,o);o+=s;this._chunks[l]=u.slice(s);this._totalLength-=s;s-=s}else{a.set(u,o);o+=u.byteLength;this._chunks.shift();this._totalLength-=u.byteLength;s-=u.byteLength}}return a}}fi.AbstractMessageBuffer=r;return fi}var Ac={};var kh;function YS(){if(kh)return Ac;kh=1;(function(t){Object.defineProperty(t,"__esModule",{value:true});t.createMessageConnection=t.ConnectionOptions=t.MessageStrategy=t.CancellationStrategy=t.CancellationSenderStrategy=t.CancellationReceiverStrategy=t.RequestCancellationReceiverStrategy=t.IdCancellationReceiverStrategy=t.ConnectionStrategy=t.ConnectionError=t.ConnectionErrors=t.LogTraceNotification=t.SetTraceNotification=t.TraceFormat=t.TraceValues=t.Trace=t.NullLogger=t.ProgressType=t.ProgressToken=void 0;const e=Mr();const n=oa();const r=Hv();const i=qv();const s=la();const a=Up();var o;(function(g){g.type=new r.NotificationType("$/cancelRequest")})(o||(o={}));var l;(function(g){function M(L){return typeof L==="string"||typeof L==="number"}g.is=M})(l||(t.ProgressToken=l={}));var u;(function(g){g.type=new r.NotificationType("$/progress")})(u||(u={}));class c{constructor(){}}t.ProgressType=c;var d;(function(g){function M(L){return n.func(L)}g.is=M})(d||(d={}));t.NullLogger=Object.freeze({error:()=>{},warn:()=>{},info:()=>{},log:()=>{}});var f;(function(g){g[g["Off"]=0]="Off";g[g["Messages"]=1]="Messages";g[g["Compact"]=2]="Compact";g[g["Verbose"]=3]="Verbose"})(f||(t.Trace=f={}));var p;(function(g){g.Off="off";g.Messages="messages";g.Compact="compact";g.Verbose="verbose"})(p||(t.TraceValues=p={}));(function(g){function M(D){if(!n.string(D)){return g.Off}D=D.toLowerCase();switch(D){case"off":return g.Off;case"messages":return g.Messages;case"compact":return g.Compact;case"verbose":return g.Verbose;default:return g.Off}}g.fromString=M;function L(D){switch(D){case g.Off:return"off";case g.Messages:return"messages";case g.Compact:return"compact";case g.Verbose:return"verbose";default:return"off"}}g.toString=L})(f||(t.Trace=f={}));var y;(function(g){g["Text"]="text";g["JSON"]="json"})(y||(t.TraceFormat=y={}));(function(g){function M(L){if(!n.string(L)){return g.Text}L=L.toLowerCase();if(L==="json"){return g.JSON}else{return g.Text}}g.fromString=M})(y||(t.TraceFormat=y={}));var R;(function(g){g.type=new r.NotificationType("$/setTrace")})(R||(t.SetTraceNotification=R={}));var A;(function(g){g.type=new r.NotificationType("$/logTrace")})(A||(t.LogTraceNotification=A={}));var v;(function(g){g[g["Closed"]=1]="Closed";g[g["Disposed"]=2]="Disposed";g[g["AlreadyListening"]=3]="AlreadyListening"})(v||(t.ConnectionErrors=v={}));class $ extends Error{constructor(M,L){super(L);this.code=M;Object.setPrototypeOf(this,$.prototype)}}t.ConnectionError=$;var C;(function(g){function M(L){const D=L;return D&&n.func(D.cancelUndispatched)}g.is=M})(C||(t.ConnectionStrategy=C={}));var O;(function(g){function M(L){const D=L;return D&&(D.kind===void 0||D.kind==="id")&&n.func(D.createCancellationTokenSource)&&(D.dispose===void 0||n.func(D.dispose))}g.is=M})(O||(t.IdCancellationReceiverStrategy=O={}));var Y;(function(g){function M(L){const D=L;return D&&D.kind==="request"&&n.func(D.createCancellationTokenSource)&&(D.dispose===void 0||n.func(D.dispose))}g.is=M})(Y||(t.RequestCancellationReceiverStrategy=Y={}));var G;(function(g){g.Message=Object.freeze({createCancellationTokenSource(L){return new a.CancellationTokenSource}});function M(L){return O.is(L)||Y.is(L)}g.is=M})(G||(t.CancellationReceiverStrategy=G={}));var J;(function(g){g.Message=Object.freeze({sendCancellation(L,D){return L.sendNotification(o.type,{id:D})},cleanup(L){}});function M(L){const D=L;return D&&n.func(D.sendCancellation)&&n.func(D.cleanup)}g.is=M})(J||(t.CancellationSenderStrategy=J={}));var te;(function(g){g.Message=Object.freeze({receiver:G.Message,sender:J.Message});function M(L){const D=L;return D&&G.is(D.receiver)&&J.is(D.sender)}g.is=M})(te||(t.CancellationStrategy=te={}));var ie;(function(g){function M(L){const D=L;return D&&n.func(D.handleMessage)}g.is=M})(ie||(t.MessageStrategy=ie={}));var ce;(function(g){function M(L){const D=L;return D&&(te.is(D.cancellationStrategy)||C.is(D.connectionStrategy)||ie.is(D.messageStrategy))}g.is=M})(ce||(t.ConnectionOptions=ce={}));var _;(function(g){g[g["New"]=1]="New";g[g["Listening"]=2]="Listening";g[g["Closed"]=3]="Closed";g[g["Disposed"]=4]="Disposed"})(_||(_={}));function T(g,M,L,D){const B=L!==void 0?L:t.NullLogger;let $e=0;let F=0;let S=0;const ne="2.0";let Tt=void 0;const Ct=new Map;let Te=void 0;const wt=new Map;const pe=new Map;let Se;let We=new i.LinkedMap;let ge=new Map;let H=new Set;let I=new Map;let b=f.Off;let q=y.Text;let w;let de=_.New;const nt=new s.Emitter;const Gt=new s.Emitter;const Kn=new s.Emitter;const Un=new s.Emitter;const Wn=new s.Emitter;const yt=D&&D.cancellationStrategy?D.cancellationStrategy:te.Message;function Jt(h){if(h===null){throw new Error(`Can't send requests with id null since the response can't be correlated.`)}return"req-"+h.toString()}function Sr(h){if(h===null){return"res-unknown-"+(++S).toString()}else{return"res-"+h.toString()}}function cn(){return"not-"+(++F).toString()}function dn(h,P){if(r.Message.isRequest(P)){h.set(Jt(P.id),P)}else if(r.Message.isResponse(P)){h.set(Sr(P.id),P)}else{h.set(cn(),P)}}function Qt(h){return void 0}function Bt(){return de===_.Listening}function N(){return de===_.Closed}function k(){return de===_.Disposed}function U(){if(de===_.New||de===_.Listening){de=_.Closed;Gt.fire(void 0)}}function gt(h){nt.fire([h,void 0,void 0])}function st(h){nt.fire(h)}g.onClose(U);g.onError(gt);M.onClose(U);M.onError(st);function er(){if(Se||We.size===0){return}Se=(0,e.default)().timer.setImmediate(()=>{Se=void 0;ua()})}function ei(h){if(r.Message.isRequest(h)){da(h)}else if(r.Message.isNotification(h)){pa(h)}else if(r.Message.isResponse(h)){fa(h)}else{ma(h)}}function ua(){if(We.size===0){return}const h=We.shift();try{const P=D?.messageStrategy;if(ie.is(P)){P.handleMessage(h,ei)}else{ei(h)}}finally{er()}}const ca=h=>{try{if(r.Message.isNotification(h)&&h.method===o.type.method){const P=h.params.id;const x=Jt(P);const j=We.get(x);if(r.Message.isRequest(j)){const me=D?.connectionStrategy;const Ne=me&&me.cancelUndispatched?me.cancelUndispatched(j,Qt):Qt(j);if(Ne&&(Ne.error!==void 0||Ne.result!==void 0)){We.delete(x);I.delete(P);Ne.id=j.id;tr(Ne,h.method,Date.now());M.write(Ne).catch(()=>B.error(`Sending response for canceled message failed.`));return}}const ve=I.get(P);if(ve!==void 0){ve.cancel();Nr(h);return}else{H.add(P)}}dn(We,h)}finally{er()}};function da(h){if(k()){return}function P(se,Ce,fe){const Ge={jsonrpc:ne,id:h.id};if(se instanceof r.ResponseError){Ge.error=se.toJson()}else{Ge.result=se===void 0?null:se}tr(Ge,Ce,fe);M.write(Ge).catch(()=>B.error(`Sending response failed.`))}function x(se,Ce,fe){const Ge={jsonrpc:ne,id:h.id,error:se.toJson()};tr(Ge,Ce,fe);M.write(Ge).catch(()=>B.error(`Sending response failed.`))}function j(se,Ce,fe){if(se===void 0){se=null}const Ge={jsonrpc:ne,id:h.id,result:se};tr(Ge,Ce,fe);M.write(Ge).catch(()=>B.error(`Sending response failed.`))}ga(h);const ve=Ct.get(h.method);let me;let Ne;if(ve){me=ve.type;Ne=ve.handler}const Be=Date.now();if(Ne||Tt){const se=h.id??String(Date.now());const Ce=O.is(yt.receiver)?yt.receiver.createCancellationTokenSource(se):yt.receiver.createCancellationTokenSource(h);if(h.id!==null&&H.has(h.id)){Ce.cancel()}if(h.id!==null){I.set(se,Ce)}try{let fe;if(Ne){if(h.params===void 0){if(me!==void 0&&me.numberOfParams!==0){x(new r.ResponseError(r.ErrorCodes.InvalidParams,`Request ${h.method} defines ${me.numberOfParams} params but received none.`),h.method,Be);return}fe=Ne(Ce.token)}else if(Array.isArray(h.params)){if(me!==void 0&&me.parameterStructures===r.ParameterStructures.byName){x(new r.ResponseError(r.ErrorCodes.InvalidParams,`Request ${h.method} defines parameters by name but received parameters by position`),h.method,Be);return}fe=Ne(...h.params,Ce.token)}else{if(me!==void 0&&me.parameterStructures===r.ParameterStructures.byPosition){x(new r.ResponseError(r.ErrorCodes.InvalidParams,`Request ${h.method} defines parameters by position but received parameters by name`),h.method,Be);return}fe=Ne(h.params,Ce.token)}}else if(Tt){fe=Tt(h.method,h.params,Ce.token)}const Ge=fe;if(!fe){I.delete(se);j(fe,h.method,Be)}else if(Ge.then){Ge.then(at=>{I.delete(se);P(at,h.method,Be)},at=>{I.delete(se);if(at instanceof r.ResponseError){x(at,h.method,Be)}else if(at&&n.string(at.message)){x(new r.ResponseError(r.ErrorCodes.InternalError,`Request ${h.method} failed with message: ${at.message}`),h.method,Be)}else{x(new r.ResponseError(r.ErrorCodes.InternalError,`Request ${h.method} failed unexpectedly without providing any details.`),h.method,Be)}})}else{I.delete(se);P(fe,h.method,Be)}}catch(fe){I.delete(se);if(fe instanceof r.ResponseError){P(fe,h.method,Be)}else if(fe&&n.string(fe.message)){x(new r.ResponseError(r.ErrorCodes.InternalError,`Request ${h.method} failed with message: ${fe.message}`),h.method,Be)}else{x(new r.ResponseError(r.ErrorCodes.InternalError,`Request ${h.method} failed unexpectedly without providing any details.`),h.method,Be)}}}else{x(new r.ResponseError(r.ErrorCodes.MethodNotFound,`Unhandled method ${h.method}`),h.method,Be)}}function fa(h){if(k()){return}if(h.id===null){if(h.error){B.error(`Received response message without id: Error is: 
${JSON.stringify(h.error,void 0,4)}`)}else{B.error(`Received response message without id. No further error information provided.`)}}else{const P=h.id;const x=ge.get(P);Ia(h,x);if(x!==void 0){ge.delete(P);try{if(h.error){const j=h.error;x.reject(new r.ResponseError(j.code,j.message,j.data))}else if(h.result!==void 0){x.resolve(h.result)}else{throw new Error("Should never happen.")}}catch(j){if(j.message){B.error(`Response handler '${x.method}' failed with message: ${j.message}`)}else{B.error(`Response handler '${x.method}' failed unexpectedly.`)}}}}}function pa(h){if(k()){return}let P=void 0;let x;if(h.method===o.type.method){const j=h.params.id;H.delete(j);Nr(h);return}else{const j=wt.get(h.method);if(j){x=j.handler;P=j.type}}if(x||Te){try{Nr(h);if(x){if(h.params===void 0){if(P!==void 0){if(P.numberOfParams!==0&&P.parameterStructures!==r.ParameterStructures.byName){B.error(`Notification ${h.method} defines ${P.numberOfParams} params but received none.`)}}x()}else if(Array.isArray(h.params)){const j=h.params;if(h.method===u.type.method&&j.length===2&&l.is(j[0])){x({token:j[0],value:j[1]})}else{if(P!==void 0){if(P.parameterStructures===r.ParameterStructures.byName){B.error(`Notification ${h.method} defines parameters by name but received parameters by position`)}if(P.numberOfParams!==h.params.length){B.error(`Notification ${h.method} defines ${P.numberOfParams} params but received ${j.length} arguments`)}}x(...j)}}else{if(P!==void 0&&P.parameterStructures===r.ParameterStructures.byPosition){B.error(`Notification ${h.method} defines parameters by position but received parameters by name`)}x(h.params)}}else if(Te){Te(h.method,h.params)}}catch(j){if(j.message){B.error(`Notification handler '${h.method}' failed with message: ${j.message}`)}else{B.error(`Notification handler '${h.method}' failed unexpectedly.`)}}}else{Kn.fire(h)}}function ma(h){if(!h){B.error("Received empty message.");return}B.error(`Received message which is neither a response nor a notification message:
${JSON.stringify(h,null,4)}`);const P=h;if(n.string(P.id)||n.number(P.id)){const x=P.id;const j=ge.get(x);if(j){j.reject(new Error("The received response has neither a result nor an error property."))}}}function Ht(h){if(h===void 0||h===null){return void 0}switch(b){case f.Verbose:return JSON.stringify(h,null,4);case f.Compact:return JSON.stringify(h);default:return void 0}}function ha(h){if(b===f.Off||!w){return}if(q===y.Text){let P=void 0;if((b===f.Verbose||b===f.Compact)&&h.params){P=`Params: ${Ht(h.params)}

`}w.log(`Sending request '${h.method} - (${h.id})'.`,P)}else{fn("send-request",h)}}function ya(h){if(b===f.Off||!w){return}if(q===y.Text){let P=void 0;if(b===f.Verbose||b===f.Compact){if(h.params){P=`Params: ${Ht(h.params)}

`}else{P="No parameters provided.\n\n"}}w.log(`Sending notification '${h.method}'.`,P)}else{fn("send-notification",h)}}function tr(h,P,x){if(b===f.Off||!w){return}if(q===y.Text){let j=void 0;if(b===f.Verbose||b===f.Compact){if(h.error&&h.error.data){j=`Error data: ${Ht(h.error.data)}

`}else{if(h.result){j=`Result: ${Ht(h.result)}

`}else if(h.error===void 0){j="No result returned.\n\n"}}}w.log(`Sending response '${P} - (${h.id})'. Processing request took ${Date.now()-x}ms`,j)}else{fn("send-response",h)}}function ga(h){if(b===f.Off||!w){return}if(q===y.Text){let P=void 0;if((b===f.Verbose||b===f.Compact)&&h.params){P=`Params: ${Ht(h.params)}

`}w.log(`Received request '${h.method} - (${h.id})'.`,P)}else{fn("receive-request",h)}}function Nr(h){if(b===f.Off||!w||h.method===A.type.method){return}if(q===y.Text){let P=void 0;if(b===f.Verbose||b===f.Compact){if(h.params){P=`Params: ${Ht(h.params)}

`}else{P="No parameters provided.\n\n"}}w.log(`Received notification '${h.method}'.`,P)}else{fn("receive-notification",h)}}function Ia(h,P){if(b===f.Off||!w){return}if(q===y.Text){let x=void 0;if(b===f.Verbose||b===f.Compact){if(h.error&&h.error.data){x=`Error data: ${Ht(h.error.data)}

`}else{if(h.result){x=`Result: ${Ht(h.result)}

`}else if(h.error===void 0){x="No result returned.\n\n"}}}if(P){const j=h.error?` Request failed: ${h.error.message} (${h.error.code}).`:"";w.log(`Received response '${P.method} - (${h.id})' in ${Date.now()-P.timerStart}ms.${j}`,x)}else{w.log(`Received response ${h.id} without active response promise.`,x)}}else{fn("receive-response",h)}}function fn(h,P){if(!w||b===f.Off){return}const x={isLSPMessage:true,type:h,message:P,timestamp:Date.now()};w.log(x)}function Gn(){if(N()){throw new $(v.Closed,"Connection is closed.")}if(k()){throw new $(v.Disposed,"Connection is disposed.")}}function va(){if(Bt()){throw new $(v.AlreadyListening,"Connection is already listening")}}function Ra(){if(!Bt()){throw new Error("Call listen() first.")}}function Hn(h){if(h===void 0){return null}else{return h}}function ti(h){if(h===null){return void 0}else{return h}}function m(h){return h!==void 0&&h!==null&&!Array.isArray(h)&&typeof h==="object"}function Oe(h,P){switch(h){case r.ParameterStructures.auto:if(m(P)){return ti(P)}else{return[Hn(P)]}case r.ParameterStructures.byName:if(!m(P)){throw new Error(`Received parameters by name but param is not an object literal.`)}return ti(P);case r.ParameterStructures.byPosition:return[Hn(P)];default:throw new Error(`Unknown parameter structure ${h.toString()}`)}}function _e(h,P){let x;const j=h.numberOfParams;switch(j){case 0:x=void 0;break;case 1:x=Oe(h.parameterStructures,P[0]);break;default:x=[];for(let ve=0;ve<P.length&&ve<j;ve++){x.push(Hn(P[ve]))}if(P.length<j){for(let ve=P.length;ve<j;ve++){x.push(null)}}break}return x}const ee={sendNotification:(h,...P)=>{Gn();let x;let j;if(n.string(h)){x=h;const me=P[0];let Ne=0;let Be=r.ParameterStructures.auto;if(r.ParameterStructures.is(me)){Ne=1;Be=me}let se=P.length;const Ce=se-Ne;switch(Ce){case 0:j=void 0;break;case 1:j=Oe(Be,P[Ne]);break;default:if(Be===r.ParameterStructures.byName){throw new Error(`Received ${Ce} parameters for 'by Name' notification parameter structure.`)}j=P.slice(Ne,se).map(fe=>Hn(fe));break}}else{const me=P;x=h.method;j=_e(h,me)}const ve={jsonrpc:ne,method:x,params:j};ya(ve);return M.write(ve).catch(me=>{B.error(`Sending notification failed.`);throw me})},onNotification:(h,P)=>{Gn();let x;if(n.func(h)){Te=h}else if(P){if(n.string(h)){x=h;wt.set(h,{type:void 0,handler:P})}else{x=h.method;wt.set(h.method,{type:h,handler:P})}}return{dispose:()=>{if(x!==void 0){wt.delete(x)}else{Te=void 0}}}},onProgress:(h,P,x)=>{if(pe.has(P)){throw new Error(`Progress handler for token ${P} already registered`)}pe.set(P,x);return{dispose:()=>{pe.delete(P)}}},sendProgress:(h,P,x)=>{return ee.sendNotification(u.type,{token:P,value:x})},onUnhandledProgress:Un.event,sendRequest:(h,...P)=>{Gn();Ra();let x;let j;let ve=void 0;if(n.string(h)){x=h;const se=P[0];const Ce=P[P.length-1];let fe=0;let Ge=r.ParameterStructures.auto;if(r.ParameterStructures.is(se)){fe=1;Ge=se}let at=P.length;if(a.CancellationToken.is(Ce)){at=at-1;ve=Ce}const Zt=at-fe;switch(Zt){case 0:j=void 0;break;case 1:j=Oe(Ge,P[fe]);break;default:if(Ge===r.ParameterStructures.byName){throw new Error(`Received ${Zt} parameters for 'by Name' request parameter structure.`)}j=P.slice(fe,at).map(aR=>Hn(aR));break}}else{const se=P;x=h.method;j=_e(h,se);const Ce=h.numberOfParams;ve=a.CancellationToken.is(se[Ce])?se[Ce]:void 0}const me=$e++;let Ne;if(ve){Ne=ve.onCancellationRequested(()=>{const se=yt.sender.sendCancellation(ee,me);if(se===void 0){B.log(`Received no promise from cancellation strategy when cancelling id ${me}`);return Promise.resolve()}else{return se.catch(()=>{B.log(`Sending cancellation messages for id ${me} failed`)})}})}const Be={jsonrpc:ne,id:me,method:x,params:j};ha(Be);if(typeof yt.sender.enableCancellation==="function"){yt.sender.enableCancellation(Be)}return new Promise(async(se,Ce)=>{const fe=Zt=>{se(Zt);yt.sender.cleanup(me);Ne?.dispose()};const Ge=Zt=>{Ce(Zt);yt.sender.cleanup(me);Ne?.dispose()};const at={method:x,timerStart:Date.now(),resolve:fe,reject:Ge};try{await M.write(Be);ge.set(me,at)}catch(Zt){B.error(`Sending request failed.`);at.reject(new r.ResponseError(r.ErrorCodes.MessageWriteError,Zt.message?Zt.message:"Unknown reason"));throw Zt}})},onRequest:(h,P)=>{Gn();let x=null;if(d.is(h)){x=void 0;Tt=h}else if(n.string(h)){x=null;if(P!==void 0){x=h;Ct.set(h,{handler:P,type:void 0})}}else{if(P!==void 0){x=h.method;Ct.set(h.method,{type:h,handler:P})}}return{dispose:()=>{if(x===null){return}if(x!==void 0){Ct.delete(x)}else{Tt=void 0}}}},hasPendingResponse:()=>{return ge.size>0},trace:async(h,P,x)=>{let j=false;let ve=y.Text;if(x!==void 0){if(n.boolean(x)){j=x}else{j=x.sendNotification||false;ve=x.traceFormat||y.Text}}b=h;q=ve;if(b===f.Off){w=void 0}else{w=P}if(j&&!N()&&!k()){await ee.sendNotification(R.type,{value:f.toString(h)})}},onError:nt.event,onClose:Gt.event,onUnhandledNotification:Kn.event,onDispose:Wn.event,end:()=>{M.end()},dispose:()=>{if(k()){return}de=_.Disposed;Wn.fire(void 0);const h=new r.ResponseError(r.ErrorCodes.PendingResponseRejected,"Pending response rejected since connection got disposed");for(const P of ge.values()){P.reject(h)}ge=new Map;I=new Map;H=new Set;We=new i.LinkedMap;if(n.func(M.dispose)){M.dispose()}if(n.func(g.dispose)){g.dispose()}},listen:()=>{Gn();va();de=_.Listening;g.listen(ca)},inspect:()=>{(0,e.default)().console.log("inspect")}};ee.onNotification(A.type,h=>{if(b===f.Off||!w){return}const P=b===f.Verbose||b===f.Compact;w.log(h.message,P?h.verbose:void 0)});ee.onNotification(u.type,h=>{const P=pe.get(h.token);if(P){P(h.value)}else{Un.fire(h)}});return ee}t.createMessageConnection=T})(Ac);return Ac}var Ph;function tp(){if(Ph)return bc;Ph=1;(function(t){Object.defineProperty(t,"__esModule",{value:true});t.ProgressType=t.ProgressToken=t.createMessageConnection=t.NullLogger=t.ConnectionOptions=t.ConnectionStrategy=t.AbstractMessageBuffer=t.WriteableStreamMessageWriter=t.AbstractMessageWriter=t.MessageWriter=t.ReadableStreamMessageReader=t.AbstractMessageReader=t.MessageReader=t.SharedArrayReceiverStrategy=t.SharedArraySenderStrategy=t.CancellationToken=t.CancellationTokenSource=t.Emitter=t.Event=t.Disposable=t.LRUCache=t.Touch=t.LinkedMap=t.ParameterStructures=t.NotificationType9=t.NotificationType8=t.NotificationType7=t.NotificationType6=t.NotificationType5=t.NotificationType4=t.NotificationType3=t.NotificationType2=t.NotificationType1=t.NotificationType0=t.NotificationType=t.ErrorCodes=t.ResponseError=t.RequestType9=t.RequestType8=t.RequestType7=t.RequestType6=t.RequestType5=t.RequestType4=t.RequestType3=t.RequestType2=t.RequestType1=t.RequestType0=t.RequestType=t.Message=t.RAL=void 0;t.MessageStrategy=t.CancellationStrategy=t.CancellationSenderStrategy=t.CancellationReceiverStrategy=t.ConnectionError=t.ConnectionErrors=t.LogTraceNotification=t.SetTraceNotification=t.TraceFormat=t.TraceValues=t.Trace=void 0;const e=Hv();Object.defineProperty(t,"Message",{enumerable:true,get:function(){return e.Message}});Object.defineProperty(t,"RequestType",{enumerable:true,get:function(){return e.RequestType}});Object.defineProperty(t,"RequestType0",{enumerable:true,get:function(){return e.RequestType0}});Object.defineProperty(t,"RequestType1",{enumerable:true,get:function(){return e.RequestType1}});Object.defineProperty(t,"RequestType2",{enumerable:true,get:function(){return e.RequestType2}});Object.defineProperty(t,"RequestType3",{enumerable:true,get:function(){return e.RequestType3}});Object.defineProperty(t,"RequestType4",{enumerable:true,get:function(){return e.RequestType4}});Object.defineProperty(t,"RequestType5",{enumerable:true,get:function(){return e.RequestType5}});Object.defineProperty(t,"RequestType6",{enumerable:true,get:function(){return e.RequestType6}});Object.defineProperty(t,"RequestType7",{enumerable:true,get:function(){return e.RequestType7}});Object.defineProperty(t,"RequestType8",{enumerable:true,get:function(){return e.RequestType8}});Object.defineProperty(t,"RequestType9",{enumerable:true,get:function(){return e.RequestType9}});Object.defineProperty(t,"ResponseError",{enumerable:true,get:function(){return e.ResponseError}});Object.defineProperty(t,"ErrorCodes",{enumerable:true,get:function(){return e.ErrorCodes}});Object.defineProperty(t,"NotificationType",{enumerable:true,get:function(){return e.NotificationType}});Object.defineProperty(t,"NotificationType0",{enumerable:true,get:function(){return e.NotificationType0}});Object.defineProperty(t,"NotificationType1",{enumerable:true,get:function(){return e.NotificationType1}});Object.defineProperty(t,"NotificationType2",{enumerable:true,get:function(){return e.NotificationType2}});Object.defineProperty(t,"NotificationType3",{enumerable:true,get:function(){return e.NotificationType3}});Object.defineProperty(t,"NotificationType4",{enumerable:true,get:function(){return e.NotificationType4}});Object.defineProperty(t,"NotificationType5",{enumerable:true,get:function(){return e.NotificationType5}});Object.defineProperty(t,"NotificationType6",{enumerable:true,get:function(){return e.NotificationType6}});Object.defineProperty(t,"NotificationType7",{enumerable:true,get:function(){return e.NotificationType7}});Object.defineProperty(t,"NotificationType8",{enumerable:true,get:function(){return e.NotificationType8}});Object.defineProperty(t,"NotificationType9",{enumerable:true,get:function(){return e.NotificationType9}});Object.defineProperty(t,"ParameterStructures",{enumerable:true,get:function(){return e.ParameterStructures}});const n=qv();Object.defineProperty(t,"LinkedMap",{enumerable:true,get:function(){return n.LinkedMap}});Object.defineProperty(t,"LRUCache",{enumerable:true,get:function(){return n.LRUCache}});Object.defineProperty(t,"Touch",{enumerable:true,get:function(){return n.Touch}});const r=qS();Object.defineProperty(t,"Disposable",{enumerable:true,get:function(){return r.Disposable}});const i=la();Object.defineProperty(t,"Event",{enumerable:true,get:function(){return i.Event}});Object.defineProperty(t,"Emitter",{enumerable:true,get:function(){return i.Emitter}});const s=Up();Object.defineProperty(t,"CancellationTokenSource",{enumerable:true,get:function(){return s.CancellationTokenSource}});Object.defineProperty(t,"CancellationToken",{enumerable:true,get:function(){return s.CancellationToken}});const a=jS();Object.defineProperty(t,"SharedArraySenderStrategy",{enumerable:true,get:function(){return a.SharedArraySenderStrategy}});Object.defineProperty(t,"SharedArrayReceiverStrategy",{enumerable:true,get:function(){return a.SharedArrayReceiverStrategy}});const o=VS();Object.defineProperty(t,"MessageReader",{enumerable:true,get:function(){return o.MessageReader}});Object.defineProperty(t,"AbstractMessageReader",{enumerable:true,get:function(){return o.AbstractMessageReader}});Object.defineProperty(t,"ReadableStreamMessageReader",{enumerable:true,get:function(){return o.ReadableStreamMessageReader}});const l=zS();Object.defineProperty(t,"MessageWriter",{enumerable:true,get:function(){return l.MessageWriter}});Object.defineProperty(t,"AbstractMessageWriter",{enumerable:true,get:function(){return l.AbstractMessageWriter}});Object.defineProperty(t,"WriteableStreamMessageWriter",{enumerable:true,get:function(){return l.WriteableStreamMessageWriter}});const u=XS();Object.defineProperty(t,"AbstractMessageBuffer",{enumerable:true,get:function(){return u.AbstractMessageBuffer}});const c=YS();Object.defineProperty(t,"ConnectionStrategy",{enumerable:true,get:function(){return c.ConnectionStrategy}});Object.defineProperty(t,"ConnectionOptions",{enumerable:true,get:function(){return c.ConnectionOptions}});Object.defineProperty(t,"NullLogger",{enumerable:true,get:function(){return c.NullLogger}});Object.defineProperty(t,"createMessageConnection",{enumerable:true,get:function(){return c.createMessageConnection}});Object.defineProperty(t,"ProgressToken",{enumerable:true,get:function(){return c.ProgressToken}});Object.defineProperty(t,"ProgressType",{enumerable:true,get:function(){return c.ProgressType}});Object.defineProperty(t,"Trace",{enumerable:true,get:function(){return c.Trace}});Object.defineProperty(t,"TraceValues",{enumerable:true,get:function(){return c.TraceValues}});Object.defineProperty(t,"TraceFormat",{enumerable:true,get:function(){return c.TraceFormat}});Object.defineProperty(t,"SetTraceNotification",{enumerable:true,get:function(){return c.SetTraceNotification}});Object.defineProperty(t,"LogTraceNotification",{enumerable:true,get:function(){return c.LogTraceNotification}});Object.defineProperty(t,"ConnectionErrors",{enumerable:true,get:function(){return c.ConnectionErrors}});Object.defineProperty(t,"ConnectionError",{enumerable:true,get:function(){return c.ConnectionError}});Object.defineProperty(t,"CancellationReceiverStrategy",{enumerable:true,get:function(){return c.CancellationReceiverStrategy}});Object.defineProperty(t,"CancellationSenderStrategy",{enumerable:true,get:function(){return c.CancellationSenderStrategy}});Object.defineProperty(t,"CancellationStrategy",{enumerable:true,get:function(){return c.CancellationStrategy}});Object.defineProperty(t,"MessageStrategy",{enumerable:true,get:function(){return c.MessageStrategy}});const d=Mr();t.RAL=d.default})(bc);return bc}var Dh;function JS(){if(Dh)return xa;Dh=1;Object.defineProperty(xa,"__esModule",{value:true});const t=tp();class e extends t.AbstractMessageBuffer{constructor(l="utf-8"){super(l);this.asciiDecoder=new TextDecoder("ascii")}emptyBuffer(){return e.emptyBuffer}fromString(l,u){return new TextEncoder().encode(l)}toString(l,u){if(u==="ascii"){return this.asciiDecoder.decode(l)}else{return new TextDecoder(u).decode(l)}}asNative(l,u){if(u===void 0){return l}else{return l.slice(0,u)}}allocNative(l){return new Uint8Array(l)}}e.emptyBuffer=new Uint8Array(0);class n{constructor(l){this.socket=l;this._onData=new t.Emitter;this._messageListener=u=>{const c=u.data;c.arrayBuffer().then(d=>{this._onData.fire(new Uint8Array(d))},()=>{(0,t.RAL)().console.error(`Converting blob to array buffer failed.`)})};this.socket.addEventListener("message",this._messageListener)}onClose(l){this.socket.addEventListener("close",l);return t.Disposable.create(()=>this.socket.removeEventListener("close",l))}onError(l){this.socket.addEventListener("error",l);return t.Disposable.create(()=>this.socket.removeEventListener("error",l))}onEnd(l){this.socket.addEventListener("end",l);return t.Disposable.create(()=>this.socket.removeEventListener("end",l))}onData(l){return this._onData.event(l)}}class r{constructor(l){this.socket=l}onClose(l){this.socket.addEventListener("close",l);return t.Disposable.create(()=>this.socket.removeEventListener("close",l))}onError(l){this.socket.addEventListener("error",l);return t.Disposable.create(()=>this.socket.removeEventListener("error",l))}onEnd(l){this.socket.addEventListener("end",l);return t.Disposable.create(()=>this.socket.removeEventListener("end",l))}write(l,u){if(typeof l==="string"){if(u!==void 0&&u!=="utf-8"){throw new Error(`In a Browser environments only utf-8 text encoding is supported. But got encoding: ${u}`)}this.socket.send(l)}else{this.socket.send(l)}return Promise.resolve()}end(){this.socket.close()}}const i=new TextEncoder;const s=Object.freeze({messageBuffer:Object.freeze({create:o=>new e(o)}),applicationJson:Object.freeze({encoder:Object.freeze({name:"application/json",encode:(o,l)=>{if(l.charset!=="utf-8"){throw new Error(`In a Browser environments only utf-8 text encoding is supported. But got encoding: ${l.charset}`)}return Promise.resolve(i.encode(JSON.stringify(o,void 0,0)))}}),decoder:Object.freeze({name:"application/json",decode:(o,l)=>{if(!(o instanceof Uint8Array)){throw new Error(`In a Browser environments only Uint8Arrays are supported.`)}return Promise.resolve(JSON.parse(new TextDecoder(l.charset).decode(o)))}})}),stream:Object.freeze({asReadableStream:o=>new n(o),asWritableStream:o=>new r(o)}),console,timer:Object.freeze({setTimeout(o,l,...u){const c=setTimeout(o,l,...u);return{dispose:()=>clearTimeout(c)}},setImmediate(o,...l){const u=setTimeout(o,0,...l);return{dispose:()=>clearTimeout(u)}},setInterval(o,l,...u){const c=setInterval(o,l,...u);return{dispose:()=>clearInterval(c)}}})});function a(){return s}(function(o){function l(){t.RAL.install(s)}o.install=l})(a);xa.default=a;return xa}var Oh;function Zr(){if(Oh)return ui;Oh=1;(function(t){var e=ui.__createBinding||(Object.create?function(l,u,c,d){if(d===void 0)d=c;var f=Object.getOwnPropertyDescriptor(u,c);if(!f||("get"in f?!u.__esModule:f.writable||f.configurable)){f={enumerable:true,get:function(){return u[c]}}}Object.defineProperty(l,d,f)}:function(l,u,c,d){if(d===void 0)d=c;l[d]=u[c]});var n=ui.__exportStar||function(l,u){for(var c in l)if(c!=="default"&&!Object.prototype.hasOwnProperty.call(u,c))e(u,l,c)};Object.defineProperty(t,"__esModule",{value:true});t.createMessageConnection=t.BrowserMessageWriter=t.BrowserMessageReader=void 0;const r=JS();r.default.install();const i=tp();n(tp(),t);class s extends i.AbstractMessageReader{constructor(u){super();this._onData=new i.Emitter;this._messageListener=c=>{this._onData.fire(c.data)};u.addEventListener("error",c=>this.fireError(c));u.onmessage=this._messageListener}listen(u){return this._onData.event(u)}}t.BrowserMessageReader=s;class a extends i.AbstractMessageWriter{constructor(u){super();this.port=u;this.errorCount=0;u.addEventListener("error",c=>this.fireError(c))}write(u){try{this.port.postMessage(u);return Promise.resolve()}catch(c){this.handleError(c,u);return Promise.reject(c)}}handleError(u,c){this.errorCount++;this.fireError(u,c,this.errorCount)}end(){}}t.BrowserMessageWriter=a;function o(l,u,c,d){if(c===void 0){c=i.NullLogger}if(i.ConnectionStrategy.is(d)){d={connectionStrategy:d}}return(0,i.createMessageConnection)(l,u,c,d)}t.createMessageConnection=o})(ui);return ui}var Mc;var _h;function Bh(){if(_h)return Mc;_h=1;Mc=Zr();return Mc}var pi={};var Wp=VM(AM);var ot={};var Lh;function Me(){if(Lh)return ot;Lh=1;Object.defineProperty(ot,"__esModule",{value:true});ot.ProtocolNotificationType=ot.ProtocolNotificationType0=ot.ProtocolRequestType=ot.ProtocolRequestType0=ot.RegistrationType=ot.MessageDirection=void 0;const t=Zr();var e;(function(o){o["clientToServer"]="clientToServer";o["serverToClient"]="serverToClient";o["both"]="both"})(e||(ot.MessageDirection=e={}));class n{constructor(l){this.method=l}}ot.RegistrationType=n;class r extends t.RequestType0{constructor(l){super(l)}}ot.ProtocolRequestType0=r;class i extends t.RequestType{constructor(l){super(l,t.ParameterStructures.byName)}}ot.ProtocolRequestType=i;class s extends t.NotificationType0{constructor(l){super(l)}}ot.ProtocolNotificationType0=s;class a extends t.NotificationType{constructor(l){super(l,t.ParameterStructures.byName)}}ot.ProtocolNotificationType=a;return ot}var Sc={};var Le={};var xh;function Gp(){if(xh)return Le;xh=1;Object.defineProperty(Le,"__esModule",{value:true});Le.objectLiteral=Le.typedArray=Le.stringArray=Le.array=Le.func=Le.error=Le.number=Le.string=Le.boolean=void 0;function t(u){return u===true||u===false}Le.boolean=t;function e(u){return typeof u==="string"||u instanceof String}Le.string=e;function n(u){return typeof u==="number"||u instanceof Number}Le.number=n;function r(u){return u instanceof Error}Le.error=r;function i(u){return typeof u==="function"}Le.func=i;function s(u){return Array.isArray(u)}Le.array=s;function a(u){return s(u)&&u.every(c=>e(c))}Le.stringArray=a;function o(u,c){return Array.isArray(u)&&u.every(c)}Le.typedArray=o;function l(u){return u!==null&&typeof u==="object"}Le.objectLiteral=l;return Le}var mi={};var Fh;function QS(){if(Fh)return mi;Fh=1;Object.defineProperty(mi,"__esModule",{value:true});mi.ImplementationRequest=void 0;const t=Me();var e;(function(n){n.method="textDocument/implementation";n.messageDirection=t.MessageDirection.clientToServer;n.type=new t.ProtocolRequestType(n.method)})(e||(mi.ImplementationRequest=e={}));return mi}var hi={};var Kh;function ZS(){if(Kh)return hi;Kh=1;Object.defineProperty(hi,"__esModule",{value:true});hi.TypeDefinitionRequest=void 0;const t=Me();var e;(function(n){n.method="textDocument/typeDefinition";n.messageDirection=t.MessageDirection.clientToServer;n.type=new t.ProtocolRequestType(n.method)})(e||(hi.TypeDefinitionRequest=e={}));return hi}var or={};var Uh;function eN(){if(Uh)return or;Uh=1;Object.defineProperty(or,"__esModule",{value:true});or.DidChangeWorkspaceFoldersNotification=or.WorkspaceFoldersRequest=void 0;const t=Me();var e;(function(r){r.method="workspace/workspaceFolders";r.messageDirection=t.MessageDirection.serverToClient;r.type=new t.ProtocolRequestType0(r.method)})(e||(or.WorkspaceFoldersRequest=e={}));var n;(function(r){r.method="workspace/didChangeWorkspaceFolders";r.messageDirection=t.MessageDirection.clientToServer;r.type=new t.ProtocolNotificationType(r.method)})(n||(or.DidChangeWorkspaceFoldersNotification=n={}));return or}var yi={};var Wh;function tN(){if(Wh)return yi;Wh=1;Object.defineProperty(yi,"__esModule",{value:true});yi.ConfigurationRequest=void 0;const t=Me();var e;(function(n){n.method="workspace/configuration";n.messageDirection=t.MessageDirection.serverToClient;n.type=new t.ProtocolRequestType(n.method)})(e||(yi.ConfigurationRequest=e={}));return yi}var lr={};var Gh;function nN(){if(Gh)return lr;Gh=1;Object.defineProperty(lr,"__esModule",{value:true});lr.ColorPresentationRequest=lr.DocumentColorRequest=void 0;const t=Me();var e;(function(r){r.method="textDocument/documentColor";r.messageDirection=t.MessageDirection.clientToServer;r.type=new t.ProtocolRequestType(r.method)})(e||(lr.DocumentColorRequest=e={}));var n;(function(r){r.method="textDocument/colorPresentation";r.messageDirection=t.MessageDirection.clientToServer;r.type=new t.ProtocolRequestType(r.method)})(n||(lr.ColorPresentationRequest=n={}));return lr}var ur={};var Hh;function rN(){if(Hh)return ur;Hh=1;Object.defineProperty(ur,"__esModule",{value:true});ur.FoldingRangeRefreshRequest=ur.FoldingRangeRequest=void 0;const t=Me();var e;(function(r){r.method="textDocument/foldingRange";r.messageDirection=t.MessageDirection.clientToServer;r.type=new t.ProtocolRequestType(r.method)})(e||(ur.FoldingRangeRequest=e={}));var n;(function(r){r.method=`workspace/foldingRange/refresh`;r.messageDirection=t.MessageDirection.serverToClient;r.type=new t.ProtocolRequestType0(r.method)})(n||(ur.FoldingRangeRefreshRequest=n={}));return ur}var gi={};var qh;function iN(){if(qh)return gi;qh=1;Object.defineProperty(gi,"__esModule",{value:true});gi.DeclarationRequest=void 0;const t=Me();var e;(function(n){n.method="textDocument/declaration";n.messageDirection=t.MessageDirection.clientToServer;n.type=new t.ProtocolRequestType(n.method)})(e||(gi.DeclarationRequest=e={}));return gi}var Ii={};var jh;function sN(){if(jh)return Ii;jh=1;Object.defineProperty(Ii,"__esModule",{value:true});Ii.SelectionRangeRequest=void 0;const t=Me();var e;(function(n){n.method="textDocument/selectionRange";n.messageDirection=t.MessageDirection.clientToServer;n.type=new t.ProtocolRequestType(n.method)})(e||(Ii.SelectionRangeRequest=e={}));return Ii}var gn={};var Vh;function aN(){if(Vh)return gn;Vh=1;Object.defineProperty(gn,"__esModule",{value:true});gn.WorkDoneProgressCancelNotification=gn.WorkDoneProgressCreateRequest=gn.WorkDoneProgress=void 0;const t=Zr();const e=Me();var n;(function(s){s.type=new t.ProgressType;function a(o){return o===s.type}s.is=a})(n||(gn.WorkDoneProgress=n={}));var r;(function(s){s.method="window/workDoneProgress/create";s.messageDirection=e.MessageDirection.serverToClient;s.type=new e.ProtocolRequestType(s.method)})(r||(gn.WorkDoneProgressCreateRequest=r={}));var i;(function(s){s.method="window/workDoneProgress/cancel";s.messageDirection=e.MessageDirection.clientToServer;s.type=new e.ProtocolNotificationType(s.method)})(i||(gn.WorkDoneProgressCancelNotification=i={}));return gn}var In={};var zh;function oN(){if(zh)return In;zh=1;Object.defineProperty(In,"__esModule",{value:true});In.CallHierarchyOutgoingCallsRequest=In.CallHierarchyIncomingCallsRequest=In.CallHierarchyPrepareRequest=void 0;const t=Me();var e;(function(i){i.method="textDocument/prepareCallHierarchy";i.messageDirection=t.MessageDirection.clientToServer;i.type=new t.ProtocolRequestType(i.method)})(e||(In.CallHierarchyPrepareRequest=e={}));var n;(function(i){i.method="callHierarchy/incomingCalls";i.messageDirection=t.MessageDirection.clientToServer;i.type=new t.ProtocolRequestType(i.method)})(n||(In.CallHierarchyIncomingCallsRequest=n={}));var r;(function(i){i.method="callHierarchy/outgoingCalls";i.messageDirection=t.MessageDirection.clientToServer;i.type=new t.ProtocolRequestType(i.method)})(r||(In.CallHierarchyOutgoingCallsRequest=r={}));return In}var lt={};var Xh;function lN(){if(Xh)return lt;Xh=1;Object.defineProperty(lt,"__esModule",{value:true});lt.SemanticTokensRefreshRequest=lt.SemanticTokensRangeRequest=lt.SemanticTokensDeltaRequest=lt.SemanticTokensRequest=lt.SemanticTokensRegistrationType=lt.TokenFormat=void 0;const t=Me();var e;(function(o){o.Relative="relative"})(e||(lt.TokenFormat=e={}));var n;(function(o){o.method="textDocument/semanticTokens";o.type=new t.RegistrationType(o.method)})(n||(lt.SemanticTokensRegistrationType=n={}));var r;(function(o){o.method="textDocument/semanticTokens/full";o.messageDirection=t.MessageDirection.clientToServer;o.type=new t.ProtocolRequestType(o.method);o.registrationMethod=n.method})(r||(lt.SemanticTokensRequest=r={}));var i;(function(o){o.method="textDocument/semanticTokens/full/delta";o.messageDirection=t.MessageDirection.clientToServer;o.type=new t.ProtocolRequestType(o.method);o.registrationMethod=n.method})(i||(lt.SemanticTokensDeltaRequest=i={}));var s;(function(o){o.method="textDocument/semanticTokens/range";o.messageDirection=t.MessageDirection.clientToServer;o.type=new t.ProtocolRequestType(o.method);o.registrationMethod=n.method})(s||(lt.SemanticTokensRangeRequest=s={}));var a;(function(o){o.method=`workspace/semanticTokens/refresh`;o.messageDirection=t.MessageDirection.serverToClient;o.type=new t.ProtocolRequestType0(o.method)})(a||(lt.SemanticTokensRefreshRequest=a={}));return lt}var vi={};var Yh;function uN(){if(Yh)return vi;Yh=1;Object.defineProperty(vi,"__esModule",{value:true});vi.ShowDocumentRequest=void 0;const t=Me();var e;(function(n){n.method="window/showDocument";n.messageDirection=t.MessageDirection.serverToClient;n.type=new t.ProtocolRequestType(n.method)})(e||(vi.ShowDocumentRequest=e={}));return vi}var Ri={};var Jh;function cN(){if(Jh)return Ri;Jh=1;Object.defineProperty(Ri,"__esModule",{value:true});Ri.LinkedEditingRangeRequest=void 0;const t=Me();var e;(function(n){n.method="textDocument/linkedEditingRange";n.messageDirection=t.MessageDirection.clientToServer;n.type=new t.ProtocolRequestType(n.method)})(e||(Ri.LinkedEditingRangeRequest=e={}));return Ri}var Xe={};var Qh;function dN(){if(Qh)return Xe;Qh=1;Object.defineProperty(Xe,"__esModule",{value:true});Xe.WillDeleteFilesRequest=Xe.DidDeleteFilesNotification=Xe.DidRenameFilesNotification=Xe.WillRenameFilesRequest=Xe.DidCreateFilesNotification=Xe.WillCreateFilesRequest=Xe.FileOperationPatternKind=void 0;const t=Me();var e;(function(l){l.file="file";l.folder="folder"})(e||(Xe.FileOperationPatternKind=e={}));var n;(function(l){l.method="workspace/willCreateFiles";l.messageDirection=t.MessageDirection.clientToServer;l.type=new t.ProtocolRequestType(l.method)})(n||(Xe.WillCreateFilesRequest=n={}));var r;(function(l){l.method="workspace/didCreateFiles";l.messageDirection=t.MessageDirection.clientToServer;l.type=new t.ProtocolNotificationType(l.method)})(r||(Xe.DidCreateFilesNotification=r={}));var i;(function(l){l.method="workspace/willRenameFiles";l.messageDirection=t.MessageDirection.clientToServer;l.type=new t.ProtocolRequestType(l.method)})(i||(Xe.WillRenameFilesRequest=i={}));var s;(function(l){l.method="workspace/didRenameFiles";l.messageDirection=t.MessageDirection.clientToServer;l.type=new t.ProtocolNotificationType(l.method)})(s||(Xe.DidRenameFilesNotification=s={}));var a;(function(l){l.method="workspace/didDeleteFiles";l.messageDirection=t.MessageDirection.clientToServer;l.type=new t.ProtocolNotificationType(l.method)})(a||(Xe.DidDeleteFilesNotification=a={}));var o;(function(l){l.method="workspace/willDeleteFiles";l.messageDirection=t.MessageDirection.clientToServer;l.type=new t.ProtocolRequestType(l.method)})(o||(Xe.WillDeleteFilesRequest=o={}));return Xe}var vn={};var Zh;function fN(){if(Zh)return vn;Zh=1;Object.defineProperty(vn,"__esModule",{value:true});vn.MonikerRequest=vn.MonikerKind=vn.UniquenessLevel=void 0;const t=Me();var e;(function(i){i.document="document";i.project="project";i.group="group";i.scheme="scheme";i.global="global"})(e||(vn.UniquenessLevel=e={}));var n;(function(i){i.$import="import";i.$export="export";i.local="local"})(n||(vn.MonikerKind=n={}));var r;(function(i){i.method="textDocument/moniker";i.messageDirection=t.MessageDirection.clientToServer;i.type=new t.ProtocolRequestType(i.method)})(r||(vn.MonikerRequest=r={}));return vn}var Rn={};var ey;function pN(){if(ey)return Rn;ey=1;Object.defineProperty(Rn,"__esModule",{value:true});Rn.TypeHierarchySubtypesRequest=Rn.TypeHierarchySupertypesRequest=Rn.TypeHierarchyPrepareRequest=void 0;const t=Me();var e;(function(i){i.method="textDocument/prepareTypeHierarchy";i.messageDirection=t.MessageDirection.clientToServer;i.type=new t.ProtocolRequestType(i.method)})(e||(Rn.TypeHierarchyPrepareRequest=e={}));var n;(function(i){i.method="typeHierarchy/supertypes";i.messageDirection=t.MessageDirection.clientToServer;i.type=new t.ProtocolRequestType(i.method)})(n||(Rn.TypeHierarchySupertypesRequest=n={}));var r;(function(i){i.method="typeHierarchy/subtypes";i.messageDirection=t.MessageDirection.clientToServer;i.type=new t.ProtocolRequestType(i.method)})(r||(Rn.TypeHierarchySubtypesRequest=r={}));return Rn}var cr={};var ty;function mN(){if(ty)return cr;ty=1;Object.defineProperty(cr,"__esModule",{value:true});cr.InlineValueRefreshRequest=cr.InlineValueRequest=void 0;const t=Me();var e;(function(r){r.method="textDocument/inlineValue";r.messageDirection=t.MessageDirection.clientToServer;r.type=new t.ProtocolRequestType(r.method)})(e||(cr.InlineValueRequest=e={}));var n;(function(r){r.method=`workspace/inlineValue/refresh`;r.messageDirection=t.MessageDirection.serverToClient;r.type=new t.ProtocolRequestType0(r.method)})(n||(cr.InlineValueRefreshRequest=n={}));return cr}var En={};var ny;function hN(){if(ny)return En;ny=1;Object.defineProperty(En,"__esModule",{value:true});En.InlayHintRefreshRequest=En.InlayHintResolveRequest=En.InlayHintRequest=void 0;const t=Me();var e;(function(i){i.method="textDocument/inlayHint";i.messageDirection=t.MessageDirection.clientToServer;i.type=new t.ProtocolRequestType(i.method)})(e||(En.InlayHintRequest=e={}));var n;(function(i){i.method="inlayHint/resolve";i.messageDirection=t.MessageDirection.clientToServer;i.type=new t.ProtocolRequestType(i.method)})(n||(En.InlayHintResolveRequest=n={}));var r;(function(i){i.method=`workspace/inlayHint/refresh`;i.messageDirection=t.MessageDirection.serverToClient;i.type=new t.ProtocolRequestType0(i.method)})(r||(En.InlayHintRefreshRequest=r={}));return En}var bt={};var ry;function yN(){if(ry)return bt;ry=1;Object.defineProperty(bt,"__esModule",{value:true});bt.DiagnosticRefreshRequest=bt.WorkspaceDiagnosticRequest=bt.DocumentDiagnosticRequest=bt.DocumentDiagnosticReportKind=bt.DiagnosticServerCancellationData=void 0;const t=Zr();const e=Gp();const n=Me();var r;(function(l){function u(c){const d=c;return d&&e.boolean(d.retriggerRequest)}l.is=u})(r||(bt.DiagnosticServerCancellationData=r={}));var i;(function(l){l.Full="full";l.Unchanged="unchanged"})(i||(bt.DocumentDiagnosticReportKind=i={}));var s;(function(l){l.method="textDocument/diagnostic";l.messageDirection=n.MessageDirection.clientToServer;l.type=new n.ProtocolRequestType(l.method);l.partialResult=new t.ProgressType})(s||(bt.DocumentDiagnosticRequest=s={}));var a;(function(l){l.method="workspace/diagnostic";l.messageDirection=n.MessageDirection.clientToServer;l.type=new n.ProtocolRequestType(l.method);l.partialResult=new t.ProgressType})(a||(bt.WorkspaceDiagnosticRequest=a={}));var o;(function(l){l.method=`workspace/diagnostic/refresh`;l.messageDirection=n.MessageDirection.serverToClient;l.type=new n.ProtocolRequestType0(l.method)})(o||(bt.DiagnosticRefreshRequest=o={}));return bt}var we={};var iy;function gN(){if(iy)return we;iy=1;Object.defineProperty(we,"__esModule",{value:true});we.DidCloseNotebookDocumentNotification=we.DidSaveNotebookDocumentNotification=we.DidChangeNotebookDocumentNotification=we.NotebookCellArrayChange=we.DidOpenNotebookDocumentNotification=we.NotebookDocumentSyncRegistrationType=we.NotebookDocument=we.NotebookCell=we.ExecutionSummary=we.NotebookCellKind=void 0;const t=Wp;const e=Gp();const n=Me();var r;(function(p){p.Markup=1;p.Code=2;function y(R){return R===1||R===2}p.is=y})(r||(we.NotebookCellKind=r={}));var i;(function(p){function y(v,$){const C={executionOrder:v};if($===true||$===false){C.success=$}return C}p.create=y;function R(v){const $=v;return e.objectLiteral($)&&t.uinteger.is($.executionOrder)&&($.success===void 0||e.boolean($.success))}p.is=R;function A(v,$){if(v===$){return true}if(v===null||v===void 0||$===null||$===void 0){return false}return v.executionOrder===$.executionOrder&&v.success===$.success}p.equals=A})(i||(we.ExecutionSummary=i={}));var s;(function(p){function y($,C){return{kind:$,document:C}}p.create=y;function R($){const C=$;return e.objectLiteral(C)&&r.is(C.kind)&&t.DocumentUri.is(C.document)&&(C.metadata===void 0||e.objectLiteral(C.metadata))}p.is=R;function A($,C){const O=new Set;if($.document!==C.document){O.add("document")}if($.kind!==C.kind){O.add("kind")}if($.executionSummary!==C.executionSummary){O.add("executionSummary")}if(($.metadata!==void 0||C.metadata!==void 0)&&!v($.metadata,C.metadata)){O.add("metadata")}if(($.executionSummary!==void 0||C.executionSummary!==void 0)&&!i.equals($.executionSummary,C.executionSummary)){O.add("executionSummary")}return O}p.diff=A;function v($,C){if($===C){return true}if($===null||$===void 0||C===null||C===void 0){return false}if(typeof $!==typeof C){return false}if(typeof $!=="object"){return false}const O=Array.isArray($);const Y=Array.isArray(C);if(O!==Y){return false}if(O&&Y){if($.length!==C.length){return false}for(let G=0;G<$.length;G++){if(!v($[G],C[G])){return false}}}if(e.objectLiteral($)&&e.objectLiteral(C)){const G=Object.keys($);const J=Object.keys(C);if(G.length!==J.length){return false}G.sort();J.sort();if(!v(G,J)){return false}for(let te=0;te<G.length;te++){const ie=G[te];if(!v($[ie],C[ie])){return false}}}return true}})(s||(we.NotebookCell=s={}));var a;(function(p){function y(A,v,$,C){return{uri:A,notebookType:v,version:$,cells:C}}p.create=y;function R(A){const v=A;return e.objectLiteral(v)&&e.string(v.uri)&&t.integer.is(v.version)&&e.typedArray(v.cells,s.is)}p.is=R})(a||(we.NotebookDocument=a={}));var o;(function(p){p.method="notebookDocument/sync";p.messageDirection=n.MessageDirection.clientToServer;p.type=new n.RegistrationType(p.method)})(o||(we.NotebookDocumentSyncRegistrationType=o={}));var l;(function(p){p.method="notebookDocument/didOpen";p.messageDirection=n.MessageDirection.clientToServer;p.type=new n.ProtocolNotificationType(p.method);p.registrationMethod=o.method})(l||(we.DidOpenNotebookDocumentNotification=l={}));var u;(function(p){function y(A){const v=A;return e.objectLiteral(v)&&t.uinteger.is(v.start)&&t.uinteger.is(v.deleteCount)&&(v.cells===void 0||e.typedArray(v.cells,s.is))}p.is=y;function R(A,v,$){const C={start:A,deleteCount:v};if($!==void 0){C.cells=$}return C}p.create=R})(u||(we.NotebookCellArrayChange=u={}));var c;(function(p){p.method="notebookDocument/didChange";p.messageDirection=n.MessageDirection.clientToServer;p.type=new n.ProtocolNotificationType(p.method);p.registrationMethod=o.method})(c||(we.DidChangeNotebookDocumentNotification=c={}));var d;(function(p){p.method="notebookDocument/didSave";p.messageDirection=n.MessageDirection.clientToServer;p.type=new n.ProtocolNotificationType(p.method);p.registrationMethod=o.method})(d||(we.DidSaveNotebookDocumentNotification=d={}));var f;(function(p){p.method="notebookDocument/didClose";p.messageDirection=n.MessageDirection.clientToServer;p.type=new n.ProtocolNotificationType(p.method);p.registrationMethod=o.method})(f||(we.DidCloseNotebookDocumentNotification=f={}));return we}var Ei={};var sy;function IN(){if(sy)return Ei;sy=1;Object.defineProperty(Ei,"__esModule",{value:true});Ei.InlineCompletionRequest=void 0;const t=Me();var e;(function(n){n.method="textDocument/inlineCompletion";n.messageDirection=t.MessageDirection.clientToServer;n.type=new t.ProtocolRequestType(n.method)})(e||(Ei.InlineCompletionRequest=e={}));return Ei}var ay;function vN(){if(ay)return Sc;ay=1;(function(t){Object.defineProperty(t,"__esModule",{value:true});t.WorkspaceSymbolRequest=t.CodeActionResolveRequest=t.CodeActionRequest=t.DocumentSymbolRequest=t.DocumentHighlightRequest=t.ReferencesRequest=t.DefinitionRequest=t.SignatureHelpRequest=t.SignatureHelpTriggerKind=t.HoverRequest=t.CompletionResolveRequest=t.CompletionRequest=t.CompletionTriggerKind=t.PublishDiagnosticsNotification=t.WatchKind=t.RelativePattern=t.FileChangeType=t.DidChangeWatchedFilesNotification=t.WillSaveTextDocumentWaitUntilRequest=t.WillSaveTextDocumentNotification=t.TextDocumentSaveReason=t.DidSaveTextDocumentNotification=t.DidCloseTextDocumentNotification=t.DidChangeTextDocumentNotification=t.TextDocumentContentChangeEvent=t.DidOpenTextDocumentNotification=t.TextDocumentSyncKind=t.TelemetryEventNotification=t.LogMessageNotification=t.ShowMessageRequest=t.ShowMessageNotification=t.MessageType=t.DidChangeConfigurationNotification=t.ExitNotification=t.ShutdownRequest=t.InitializedNotification=t.InitializeErrorCodes=t.InitializeRequest=t.WorkDoneProgressOptions=t.TextDocumentRegistrationOptions=t.StaticRegistrationOptions=t.PositionEncodingKind=t.FailureHandlingKind=t.ResourceOperationKind=t.UnregistrationRequest=t.RegistrationRequest=t.DocumentSelector=t.NotebookCellTextDocumentFilter=t.NotebookDocumentFilter=t.TextDocumentFilter=void 0;t.MonikerRequest=t.MonikerKind=t.UniquenessLevel=t.WillDeleteFilesRequest=t.DidDeleteFilesNotification=t.WillRenameFilesRequest=t.DidRenameFilesNotification=t.WillCreateFilesRequest=t.DidCreateFilesNotification=t.FileOperationPatternKind=t.LinkedEditingRangeRequest=t.ShowDocumentRequest=t.SemanticTokensRegistrationType=t.SemanticTokensRefreshRequest=t.SemanticTokensRangeRequest=t.SemanticTokensDeltaRequest=t.SemanticTokensRequest=t.TokenFormat=t.CallHierarchyPrepareRequest=t.CallHierarchyOutgoingCallsRequest=t.CallHierarchyIncomingCallsRequest=t.WorkDoneProgressCancelNotification=t.WorkDoneProgressCreateRequest=t.WorkDoneProgress=t.SelectionRangeRequest=t.DeclarationRequest=t.FoldingRangeRefreshRequest=t.FoldingRangeRequest=t.ColorPresentationRequest=t.DocumentColorRequest=t.ConfigurationRequest=t.DidChangeWorkspaceFoldersNotification=t.WorkspaceFoldersRequest=t.TypeDefinitionRequest=t.ImplementationRequest=t.ApplyWorkspaceEditRequest=t.ExecuteCommandRequest=t.PrepareRenameRequest=t.RenameRequest=t.PrepareSupportDefaultBehavior=t.DocumentOnTypeFormattingRequest=t.DocumentRangesFormattingRequest=t.DocumentRangeFormattingRequest=t.DocumentFormattingRequest=t.DocumentLinkResolveRequest=t.DocumentLinkRequest=t.CodeLensRefreshRequest=t.CodeLensResolveRequest=t.CodeLensRequest=t.WorkspaceSymbolResolveRequest=void 0;t.InlineCompletionRequest=t.DidCloseNotebookDocumentNotification=t.DidSaveNotebookDocumentNotification=t.DidChangeNotebookDocumentNotification=t.NotebookCellArrayChange=t.DidOpenNotebookDocumentNotification=t.NotebookDocumentSyncRegistrationType=t.NotebookDocument=t.NotebookCell=t.ExecutionSummary=t.NotebookCellKind=t.DiagnosticRefreshRequest=t.WorkspaceDiagnosticRequest=t.DocumentDiagnosticRequest=t.DocumentDiagnosticReportKind=t.DiagnosticServerCancellationData=t.InlayHintRefreshRequest=t.InlayHintResolveRequest=t.InlayHintRequest=t.InlineValueRefreshRequest=t.InlineValueRequest=t.TypeHierarchySupertypesRequest=t.TypeHierarchySubtypesRequest=t.TypeHierarchyPrepareRequest=void 0;const e=Me();const n=Wp;const r=Gp();const i=QS();Object.defineProperty(t,"ImplementationRequest",{enumerable:true,get:function(){return i.ImplementationRequest}});const s=ZS();Object.defineProperty(t,"TypeDefinitionRequest",{enumerable:true,get:function(){return s.TypeDefinitionRequest}});const a=eN();Object.defineProperty(t,"WorkspaceFoldersRequest",{enumerable:true,get:function(){return a.WorkspaceFoldersRequest}});Object.defineProperty(t,"DidChangeWorkspaceFoldersNotification",{enumerable:true,get:function(){return a.DidChangeWorkspaceFoldersNotification}});const o=tN();Object.defineProperty(t,"ConfigurationRequest",{enumerable:true,get:function(){return o.ConfigurationRequest}});const l=nN();Object.defineProperty(t,"DocumentColorRequest",{enumerable:true,get:function(){return l.DocumentColorRequest}});Object.defineProperty(t,"ColorPresentationRequest",{enumerable:true,get:function(){return l.ColorPresentationRequest}});const u=rN();Object.defineProperty(t,"FoldingRangeRequest",{enumerable:true,get:function(){return u.FoldingRangeRequest}});Object.defineProperty(t,"FoldingRangeRefreshRequest",{enumerable:true,get:function(){return u.FoldingRangeRefreshRequest}});const c=iN();Object.defineProperty(t,"DeclarationRequest",{enumerable:true,get:function(){return c.DeclarationRequest}});const d=sN();Object.defineProperty(t,"SelectionRangeRequest",{enumerable:true,get:function(){return d.SelectionRangeRequest}});const f=aN();Object.defineProperty(t,"WorkDoneProgress",{enumerable:true,get:function(){return f.WorkDoneProgress}});Object.defineProperty(t,"WorkDoneProgressCreateRequest",{enumerable:true,get:function(){return f.WorkDoneProgressCreateRequest}});Object.defineProperty(t,"WorkDoneProgressCancelNotification",{enumerable:true,get:function(){return f.WorkDoneProgressCancelNotification}});const p=oN();Object.defineProperty(t,"CallHierarchyIncomingCallsRequest",{enumerable:true,get:function(){return p.CallHierarchyIncomingCallsRequest}});Object.defineProperty(t,"CallHierarchyOutgoingCallsRequest",{enumerable:true,get:function(){return p.CallHierarchyOutgoingCallsRequest}});Object.defineProperty(t,"CallHierarchyPrepareRequest",{enumerable:true,get:function(){return p.CallHierarchyPrepareRequest}});const y=lN();Object.defineProperty(t,"TokenFormat",{enumerable:true,get:function(){return y.TokenFormat}});Object.defineProperty(t,"SemanticTokensRequest",{enumerable:true,get:function(){return y.SemanticTokensRequest}});Object.defineProperty(t,"SemanticTokensDeltaRequest",{enumerable:true,get:function(){return y.SemanticTokensDeltaRequest}});Object.defineProperty(t,"SemanticTokensRangeRequest",{enumerable:true,get:function(){return y.SemanticTokensRangeRequest}});Object.defineProperty(t,"SemanticTokensRefreshRequest",{enumerable:true,get:function(){return y.SemanticTokensRefreshRequest}});Object.defineProperty(t,"SemanticTokensRegistrationType",{enumerable:true,get:function(){return y.SemanticTokensRegistrationType}});const R=uN();Object.defineProperty(t,"ShowDocumentRequest",{enumerable:true,get:function(){return R.ShowDocumentRequest}});const A=cN();Object.defineProperty(t,"LinkedEditingRangeRequest",{enumerable:true,get:function(){return A.LinkedEditingRangeRequest}});const v=dN();Object.defineProperty(t,"FileOperationPatternKind",{enumerable:true,get:function(){return v.FileOperationPatternKind}});Object.defineProperty(t,"DidCreateFilesNotification",{enumerable:true,get:function(){return v.DidCreateFilesNotification}});Object.defineProperty(t,"WillCreateFilesRequest",{enumerable:true,get:function(){return v.WillCreateFilesRequest}});Object.defineProperty(t,"DidRenameFilesNotification",{enumerable:true,get:function(){return v.DidRenameFilesNotification}});Object.defineProperty(t,"WillRenameFilesRequest",{enumerable:true,get:function(){return v.WillRenameFilesRequest}});Object.defineProperty(t,"DidDeleteFilesNotification",{enumerable:true,get:function(){return v.DidDeleteFilesNotification}});Object.defineProperty(t,"WillDeleteFilesRequest",{enumerable:true,get:function(){return v.WillDeleteFilesRequest}});const $=fN();Object.defineProperty(t,"UniquenessLevel",{enumerable:true,get:function(){return $.UniquenessLevel}});Object.defineProperty(t,"MonikerKind",{enumerable:true,get:function(){return $.MonikerKind}});Object.defineProperty(t,"MonikerRequest",{enumerable:true,get:function(){return $.MonikerRequest}});const C=pN();Object.defineProperty(t,"TypeHierarchyPrepareRequest",{enumerable:true,get:function(){return C.TypeHierarchyPrepareRequest}});Object.defineProperty(t,"TypeHierarchySubtypesRequest",{enumerable:true,get:function(){return C.TypeHierarchySubtypesRequest}});Object.defineProperty(t,"TypeHierarchySupertypesRequest",{enumerable:true,get:function(){return C.TypeHierarchySupertypesRequest}});const O=mN();Object.defineProperty(t,"InlineValueRequest",{enumerable:true,get:function(){return O.InlineValueRequest}});Object.defineProperty(t,"InlineValueRefreshRequest",{enumerable:true,get:function(){return O.InlineValueRefreshRequest}});const Y=hN();Object.defineProperty(t,"InlayHintRequest",{enumerable:true,get:function(){return Y.InlayHintRequest}});Object.defineProperty(t,"InlayHintResolveRequest",{enumerable:true,get:function(){return Y.InlayHintResolveRequest}});Object.defineProperty(t,"InlayHintRefreshRequest",{enumerable:true,get:function(){return Y.InlayHintRefreshRequest}});const G=yN();Object.defineProperty(t,"DiagnosticServerCancellationData",{enumerable:true,get:function(){return G.DiagnosticServerCancellationData}});Object.defineProperty(t,"DocumentDiagnosticReportKind",{enumerable:true,get:function(){return G.DocumentDiagnosticReportKind}});Object.defineProperty(t,"DocumentDiagnosticRequest",{enumerable:true,get:function(){return G.DocumentDiagnosticRequest}});Object.defineProperty(t,"WorkspaceDiagnosticRequest",{enumerable:true,get:function(){return G.WorkspaceDiagnosticRequest}});Object.defineProperty(t,"DiagnosticRefreshRequest",{enumerable:true,get:function(){return G.DiagnosticRefreshRequest}});const J=gN();Object.defineProperty(t,"NotebookCellKind",{enumerable:true,get:function(){return J.NotebookCellKind}});Object.defineProperty(t,"ExecutionSummary",{enumerable:true,get:function(){return J.ExecutionSummary}});Object.defineProperty(t,"NotebookCell",{enumerable:true,get:function(){return J.NotebookCell}});Object.defineProperty(t,"NotebookDocument",{enumerable:true,get:function(){return J.NotebookDocument}});Object.defineProperty(t,"NotebookDocumentSyncRegistrationType",{enumerable:true,get:function(){return J.NotebookDocumentSyncRegistrationType}});Object.defineProperty(t,"DidOpenNotebookDocumentNotification",{enumerable:true,get:function(){return J.DidOpenNotebookDocumentNotification}});Object.defineProperty(t,"NotebookCellArrayChange",{enumerable:true,get:function(){return J.NotebookCellArrayChange}});Object.defineProperty(t,"DidChangeNotebookDocumentNotification",{enumerable:true,get:function(){return J.DidChangeNotebookDocumentNotification}});Object.defineProperty(t,"DidSaveNotebookDocumentNotification",{enumerable:true,get:function(){return J.DidSaveNotebookDocumentNotification}});Object.defineProperty(t,"DidCloseNotebookDocumentNotification",{enumerable:true,get:function(){return J.DidCloseNotebookDocumentNotification}});const te=IN();Object.defineProperty(t,"InlineCompletionRequest",{enumerable:true,get:function(){return te.InlineCompletionRequest}});var ie;(function(m){function Oe(_e){const ee=_e;return r.string(ee)||(r.string(ee.language)||r.string(ee.scheme)||r.string(ee.pattern))}m.is=Oe})(ie||(t.TextDocumentFilter=ie={}));var ce;(function(m){function Oe(_e){const ee=_e;return r.objectLiteral(ee)&&(r.string(ee.notebookType)||r.string(ee.scheme)||r.string(ee.pattern))}m.is=Oe})(ce||(t.NotebookDocumentFilter=ce={}));var _;(function(m){function Oe(_e){const ee=_e;return r.objectLiteral(ee)&&(r.string(ee.notebook)||ce.is(ee.notebook))&&(ee.language===void 0||r.string(ee.language))}m.is=Oe})(_||(t.NotebookCellTextDocumentFilter=_={}));var T;(function(m){function Oe(_e){if(!Array.isArray(_e)){return false}for(let ee of _e){if(!r.string(ee)&&!ie.is(ee)&&!_.is(ee)){return false}}return true}m.is=Oe})(T||(t.DocumentSelector=T={}));var g;(function(m){m.method="client/registerCapability";m.messageDirection=e.MessageDirection.serverToClient;m.type=new e.ProtocolRequestType(m.method)})(g||(t.RegistrationRequest=g={}));var M;(function(m){m.method="client/unregisterCapability";m.messageDirection=e.MessageDirection.serverToClient;m.type=new e.ProtocolRequestType(m.method)})(M||(t.UnregistrationRequest=M={}));var L;(function(m){m.Create="create";m.Rename="rename";m.Delete="delete"})(L||(t.ResourceOperationKind=L={}));var D;(function(m){m.Abort="abort";m.Transactional="transactional";m.TextOnlyTransactional="textOnlyTransactional";m.Undo="undo"})(D||(t.FailureHandlingKind=D={}));var B;(function(m){m.UTF8="utf-8";m.UTF16="utf-16";m.UTF32="utf-32"})(B||(t.PositionEncodingKind=B={}));var $e;(function(m){function Oe(_e){const ee=_e;return ee&&r.string(ee.id)&&ee.id.length>0}m.hasId=Oe})($e||(t.StaticRegistrationOptions=$e={}));var F;(function(m){function Oe(_e){const ee=_e;return ee&&(ee.documentSelector===null||T.is(ee.documentSelector))}m.is=Oe})(F||(t.TextDocumentRegistrationOptions=F={}));var S;(function(m){function Oe(ee){const h=ee;return r.objectLiteral(h)&&(h.workDoneProgress===void 0||r.boolean(h.workDoneProgress))}m.is=Oe;function _e(ee){const h=ee;return h&&r.boolean(h.workDoneProgress)}m.hasWorkDoneProgress=_e})(S||(t.WorkDoneProgressOptions=S={}));var ne;(function(m){m.method="initialize";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(ne||(t.InitializeRequest=ne={}));var Tt;(function(m){m.unknownProtocolVersion=1})(Tt||(t.InitializeErrorCodes=Tt={}));var Ct;(function(m){m.method="initialized";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolNotificationType(m.method)})(Ct||(t.InitializedNotification=Ct={}));var Te;(function(m){m.method="shutdown";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType0(m.method)})(Te||(t.ShutdownRequest=Te={}));var wt;(function(m){m.method="exit";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolNotificationType0(m.method)})(wt||(t.ExitNotification=wt={}));var pe;(function(m){m.method="workspace/didChangeConfiguration";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolNotificationType(m.method)})(pe||(t.DidChangeConfigurationNotification=pe={}));var Se;(function(m){m.Error=1;m.Warning=2;m.Info=3;m.Log=4;m.Debug=5})(Se||(t.MessageType=Se={}));var We;(function(m){m.method="window/showMessage";m.messageDirection=e.MessageDirection.serverToClient;m.type=new e.ProtocolNotificationType(m.method)})(We||(t.ShowMessageNotification=We={}));var ge;(function(m){m.method="window/showMessageRequest";m.messageDirection=e.MessageDirection.serverToClient;m.type=new e.ProtocolRequestType(m.method)})(ge||(t.ShowMessageRequest=ge={}));var H;(function(m){m.method="window/logMessage";m.messageDirection=e.MessageDirection.serverToClient;m.type=new e.ProtocolNotificationType(m.method)})(H||(t.LogMessageNotification=H={}));var I;(function(m){m.method="telemetry/event";m.messageDirection=e.MessageDirection.serverToClient;m.type=new e.ProtocolNotificationType(m.method)})(I||(t.TelemetryEventNotification=I={}));var b;(function(m){m.None=0;m.Full=1;m.Incremental=2})(b||(t.TextDocumentSyncKind=b={}));var q;(function(m){m.method="textDocument/didOpen";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolNotificationType(m.method)})(q||(t.DidOpenTextDocumentNotification=q={}));var w;(function(m){function Oe(ee){let h=ee;return h!==void 0&&h!==null&&typeof h.text==="string"&&h.range!==void 0&&(h.rangeLength===void 0||typeof h.rangeLength==="number")}m.isIncremental=Oe;function _e(ee){let h=ee;return h!==void 0&&h!==null&&typeof h.text==="string"&&h.range===void 0&&h.rangeLength===void 0}m.isFull=_e})(w||(t.TextDocumentContentChangeEvent=w={}));var de;(function(m){m.method="textDocument/didChange";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolNotificationType(m.method)})(de||(t.DidChangeTextDocumentNotification=de={}));var nt;(function(m){m.method="textDocument/didClose";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolNotificationType(m.method)})(nt||(t.DidCloseTextDocumentNotification=nt={}));var Gt;(function(m){m.method="textDocument/didSave";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolNotificationType(m.method)})(Gt||(t.DidSaveTextDocumentNotification=Gt={}));var Kn;(function(m){m.Manual=1;m.AfterDelay=2;m.FocusOut=3})(Kn||(t.TextDocumentSaveReason=Kn={}));var Un;(function(m){m.method="textDocument/willSave";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolNotificationType(m.method)})(Un||(t.WillSaveTextDocumentNotification=Un={}));var Wn;(function(m){m.method="textDocument/willSaveWaitUntil";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(Wn||(t.WillSaveTextDocumentWaitUntilRequest=Wn={}));var yt;(function(m){m.method="workspace/didChangeWatchedFiles";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolNotificationType(m.method)})(yt||(t.DidChangeWatchedFilesNotification=yt={}));var Jt;(function(m){m.Created=1;m.Changed=2;m.Deleted=3})(Jt||(t.FileChangeType=Jt={}));var Sr;(function(m){function Oe(_e){const ee=_e;return r.objectLiteral(ee)&&(n.URI.is(ee.baseUri)||n.WorkspaceFolder.is(ee.baseUri))&&r.string(ee.pattern)}m.is=Oe})(Sr||(t.RelativePattern=Sr={}));var cn;(function(m){m.Create=1;m.Change=2;m.Delete=4})(cn||(t.WatchKind=cn={}));var dn;(function(m){m.method="textDocument/publishDiagnostics";m.messageDirection=e.MessageDirection.serverToClient;m.type=new e.ProtocolNotificationType(m.method)})(dn||(t.PublishDiagnosticsNotification=dn={}));var Qt;(function(m){m.Invoked=1;m.TriggerCharacter=2;m.TriggerForIncompleteCompletions=3})(Qt||(t.CompletionTriggerKind=Qt={}));var Bt;(function(m){m.method="textDocument/completion";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(Bt||(t.CompletionRequest=Bt={}));var N;(function(m){m.method="completionItem/resolve";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(N||(t.CompletionResolveRequest=N={}));var k;(function(m){m.method="textDocument/hover";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(k||(t.HoverRequest=k={}));var U;(function(m){m.Invoked=1;m.TriggerCharacter=2;m.ContentChange=3})(U||(t.SignatureHelpTriggerKind=U={}));var gt;(function(m){m.method="textDocument/signatureHelp";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(gt||(t.SignatureHelpRequest=gt={}));var st;(function(m){m.method="textDocument/definition";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(st||(t.DefinitionRequest=st={}));var er;(function(m){m.method="textDocument/references";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(er||(t.ReferencesRequest=er={}));var ei;(function(m){m.method="textDocument/documentHighlight";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(ei||(t.DocumentHighlightRequest=ei={}));var ua;(function(m){m.method="textDocument/documentSymbol";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(ua||(t.DocumentSymbolRequest=ua={}));var ca;(function(m){m.method="textDocument/codeAction";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(ca||(t.CodeActionRequest=ca={}));var da;(function(m){m.method="codeAction/resolve";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(da||(t.CodeActionResolveRequest=da={}));var fa;(function(m){m.method="workspace/symbol";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(fa||(t.WorkspaceSymbolRequest=fa={}));var pa;(function(m){m.method="workspaceSymbol/resolve";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(pa||(t.WorkspaceSymbolResolveRequest=pa={}));var ma;(function(m){m.method="textDocument/codeLens";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(ma||(t.CodeLensRequest=ma={}));var Ht;(function(m){m.method="codeLens/resolve";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(Ht||(t.CodeLensResolveRequest=Ht={}));var ha;(function(m){m.method=`workspace/codeLens/refresh`;m.messageDirection=e.MessageDirection.serverToClient;m.type=new e.ProtocolRequestType0(m.method)})(ha||(t.CodeLensRefreshRequest=ha={}));var ya;(function(m){m.method="textDocument/documentLink";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(ya||(t.DocumentLinkRequest=ya={}));var tr;(function(m){m.method="documentLink/resolve";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(tr||(t.DocumentLinkResolveRequest=tr={}));var ga;(function(m){m.method="textDocument/formatting";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(ga||(t.DocumentFormattingRequest=ga={}));var Nr;(function(m){m.method="textDocument/rangeFormatting";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(Nr||(t.DocumentRangeFormattingRequest=Nr={}));var Ia;(function(m){m.method="textDocument/rangesFormatting";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(Ia||(t.DocumentRangesFormattingRequest=Ia={}));var fn;(function(m){m.method="textDocument/onTypeFormatting";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(fn||(t.DocumentOnTypeFormattingRequest=fn={}));var Gn;(function(m){m.Identifier=1})(Gn||(t.PrepareSupportDefaultBehavior=Gn={}));var va;(function(m){m.method="textDocument/rename";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(va||(t.RenameRequest=va={}));var Ra;(function(m){m.method="textDocument/prepareRename";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(Ra||(t.PrepareRenameRequest=Ra={}));var Hn;(function(m){m.method="workspace/executeCommand";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(Hn||(t.ExecuteCommandRequest=Hn={}));var ti;(function(m){m.method="workspace/applyEdit";m.messageDirection=e.MessageDirection.serverToClient;m.type=new e.ProtocolRequestType("workspace/applyEdit")})(ti||(t.ApplyWorkspaceEditRequest=ti={}))})(Sc);return Sc}var $i={};var oy;function RN(){if(oy)return $i;oy=1;Object.defineProperty($i,"__esModule",{value:true});$i.createProtocolConnection=void 0;const t=Zr();function e(n,r,i,s){if(t.ConnectionStrategy.is(s)){s={connectionStrategy:s}}return(0,t.createMessageConnection)(n,r,i,s)}$i.createProtocolConnection=e;return $i}var ly;function EN(){if(ly)return pi;ly=1;(function(t){var e=pi.__createBinding||(Object.create?function(s,a,o,l){if(l===void 0)l=o;var u=Object.getOwnPropertyDescriptor(a,o);if(!u||("get"in u?!a.__esModule:u.writable||u.configurable)){u={enumerable:true,get:function(){return a[o]}}}Object.defineProperty(s,l,u)}:function(s,a,o,l){if(l===void 0)l=o;s[l]=a[o]});var n=pi.__exportStar||function(s,a){for(var o in s)if(o!=="default"&&!Object.prototype.hasOwnProperty.call(a,o))e(a,s,o)};Object.defineProperty(t,"__esModule",{value:true});t.LSPErrorCodes=t.createProtocolConnection=void 0;n(Zr(),t);n(Wp,t);n(Me(),t);n(vN(),t);var r=RN();Object.defineProperty(t,"createProtocolConnection",{enumerable:true,get:function(){return r.createProtocolConnection}});var i;(function(s){s.lspReservedErrorRangeStart=-32899;s.RequestFailed=-32803;s.ServerCancelled=-32802;s.ContentModified=-32801;s.RequestCancelled=-32800;s.lspReservedErrorRangeEnd=-32800})(i||(t.LSPErrorCodes=i={}))})(pi);return pi}var uy;function Fe(){if(uy)return li;uy=1;(function(t){var e=li.__createBinding||(Object.create?function(s,a,o,l){if(l===void 0)l=o;var u=Object.getOwnPropertyDescriptor(a,o);if(!u||("get"in u?!a.__esModule:u.writable||u.configurable)){u={enumerable:true,get:function(){return a[o]}}}Object.defineProperty(s,l,u)}:function(s,a,o,l){if(l===void 0)l=o;s[l]=a[o]});var n=li.__exportStar||function(s,a){for(var o in s)if(o!=="default"&&!Object.prototype.hasOwnProperty.call(a,o))e(a,s,o)};Object.defineProperty(t,"__esModule",{value:true});t.createProtocolConnection=void 0;const r=Bh();n(Bh(),t);n(EN(),t);function i(s,a,o,l){return(0,r.createMessageConnection)(s,a,o,l)}t.createProtocolConnection=i})(li);return li}var cy;function Vv(){if(cy)return pn;cy=1;Object.defineProperty(pn,"__esModule",{value:true});pn.SemanticTokensBuilder=pn.SemanticTokensDiff=pn.SemanticTokensFeature=void 0;const t=Fe();const e=i=>{return class extends i{get semanticTokens(){return{refresh:()=>{return this.connection.sendRequest(t.SemanticTokensRefreshRequest.type)},on:s=>{const a=t.SemanticTokensRequest.type;return this.connection.onRequest(a,(o,l)=>{return s(o,l,this.attachWorkDoneProgress(o),this.attachPartialResultProgress(a,o))})},onDelta:s=>{const a=t.SemanticTokensDeltaRequest.type;return this.connection.onRequest(a,(o,l)=>{return s(o,l,this.attachWorkDoneProgress(o),this.attachPartialResultProgress(a,o))})},onRange:s=>{const a=t.SemanticTokensRangeRequest.type;return this.connection.onRequest(a,(o,l)=>{return s(o,l,this.attachWorkDoneProgress(o),this.attachPartialResultProgress(a,o))})}}}}};pn.SemanticTokensFeature=e;class n{constructor(s,a){this.originalSequence=s;this.modifiedSequence=a}computeDiff(){const s=this.originalSequence.length;const a=this.modifiedSequence.length;let o=0;while(o<a&&o<s&&this.originalSequence[o]===this.modifiedSequence[o]){o++}if(o<a&&o<s){let l=s-1;let u=a-1;while(l>=o&&u>=o&&this.originalSequence[l]===this.modifiedSequence[u]){l--;u--}if(l<o||u<o){l++;u++}const c=l-o+1;const d=this.modifiedSequence.slice(o,u+1);if(d.length===1&&d[0]===this.originalSequence[l]){return[{start:o,deleteCount:c-1}]}else{return[{start:o,deleteCount:c,data:d}]}}else if(o<a){return[{start:o,deleteCount:0,data:this.modifiedSequence.slice(o)}]}else if(o<s){return[{start:o,deleteCount:s-o}]}else{return[]}}}pn.SemanticTokensDiff=n;class r{constructor(){this._prevData=void 0;this.initialize()}initialize(){this._id=Date.now();this._prevLine=0;this._prevChar=0;this._data=[];this._dataLen=0}push(s,a,o,l,u){let c=s;let d=a;if(this._dataLen>0){c-=this._prevLine;if(c===0){d-=this._prevChar}}this._data[this._dataLen++]=c;this._data[this._dataLen++]=d;this._data[this._dataLen++]=o;this._data[this._dataLen++]=l;this._data[this._dataLen++]=u;this._prevLine=s;this._prevChar=a}get id(){return this._id.toString()}previousResult(s){if(this.id===s){this._prevData=this._data}this.initialize()}build(){this._prevData=void 0;return{resultId:this.id,data:this._data}}canBuildEdits(){return this._prevData!==void 0}buildEdits(){if(this._prevData!==void 0){return{resultId:this.id,edits:new n(this._prevData,this._data).computeDiff()}}else{return this.build()}}}pn.SemanticTokensBuilder=r;return pn}var Ti={};var dy;function $N(){if(dy)return Ti;dy=1;Object.defineProperty(Ti,"__esModule",{value:true});Ti.InlineCompletionFeature=void 0;const t=Fe();const e=n=>{return class extends n{get inlineCompletion(){return{on:r=>{return this.connection.onRequest(t.InlineCompletionRequest.type,(i,s)=>{return r(i,s,this.attachWorkDoneProgress(i))})}}}}};Ti.InlineCompletionFeature=e;return Ti}var Ci={};var fy;function zv(){if(fy)return Ci;fy=1;Object.defineProperty(Ci,"__esModule",{value:true});Ci.TextDocuments=void 0;const t=Fe();class e{constructor(r){this._configuration=r;this._syncedDocuments=new Map;this._onDidChangeContent=new t.Emitter;this._onDidOpen=new t.Emitter;this._onDidClose=new t.Emitter;this._onDidSave=new t.Emitter;this._onWillSave=new t.Emitter}get onDidOpen(){return this._onDidOpen.event}get onDidChangeContent(){return this._onDidChangeContent.event}get onWillSave(){return this._onWillSave.event}onWillSaveWaitUntil(r){this._willSaveWaitUntil=r}get onDidSave(){return this._onDidSave.event}get onDidClose(){return this._onDidClose.event}get(r){return this._syncedDocuments.get(r)}all(){return Array.from(this._syncedDocuments.values())}keys(){return Array.from(this._syncedDocuments.keys())}listen(r){r.__textDocumentSync=t.TextDocumentSyncKind.Incremental;const i=[];i.push(r.onDidOpenTextDocument(s=>{const a=s.textDocument;const o=this._configuration.create(a.uri,a.languageId,a.version,a.text);this._syncedDocuments.set(a.uri,o);const l=Object.freeze({document:o});this._onDidOpen.fire(l);this._onDidChangeContent.fire(l)}));i.push(r.onDidChangeTextDocument(s=>{const a=s.textDocument;const o=s.contentChanges;if(o.length===0){return}const{version:l}=a;if(l===null||l===void 0){throw new Error(`Received document change event for ${a.uri} without valid version identifier`)}let u=this._syncedDocuments.get(a.uri);if(u!==void 0){u=this._configuration.update(u,o,l);this._syncedDocuments.set(a.uri,u);this._onDidChangeContent.fire(Object.freeze({document:u}))}}));i.push(r.onDidCloseTextDocument(s=>{let a=this._syncedDocuments.get(s.textDocument.uri);if(a!==void 0){this._syncedDocuments.delete(s.textDocument.uri);this._onDidClose.fire(Object.freeze({document:a}))}}));i.push(r.onWillSaveTextDocument(s=>{let a=this._syncedDocuments.get(s.textDocument.uri);if(a!==void 0){this._onWillSave.fire(Object.freeze({document:a,reason:s.reason}))}}));i.push(r.onWillSaveTextDocumentWaitUntil((s,a)=>{let o=this._syncedDocuments.get(s.textDocument.uri);if(o!==void 0&&this._willSaveWaitUntil){return this._willSaveWaitUntil(Object.freeze({document:o,reason:s.reason}),a)}else{return[]}}));i.push(r.onDidSaveTextDocument(s=>{let a=this._syncedDocuments.get(s.textDocument.uri);if(a!==void 0){this._onDidSave.fire(Object.freeze({document:a}))}}));return t.Disposable.create(()=>{i.forEach(s=>s.dispose())})}}Ci.TextDocuments=e;return Ci}var dr={};var py;function Xv(){if(py)return dr;py=1;Object.defineProperty(dr,"__esModule",{value:true});dr.NotebookDocuments=dr.NotebookSyncFeature=void 0;const t=Fe();const e=zv();const n=s=>{return class extends s{get synchronization(){return{onDidOpenNotebookDocument:a=>{return this.connection.onNotification(t.DidOpenNotebookDocumentNotification.type,o=>{a(o)})},onDidChangeNotebookDocument:a=>{return this.connection.onNotification(t.DidChangeNotebookDocumentNotification.type,o=>{a(o)})},onDidSaveNotebookDocument:a=>{return this.connection.onNotification(t.DidSaveNotebookDocumentNotification.type,o=>{a(o)})},onDidCloseNotebookDocument:a=>{return this.connection.onNotification(t.DidCloseNotebookDocumentNotification.type,o=>{a(o)})}}}}};dr.NotebookSyncFeature=n;class r{onDidOpenTextDocument(a){this.openHandler=a;return t.Disposable.create(()=>{this.openHandler=void 0})}openTextDocument(a){this.openHandler&&this.openHandler(a)}onDidChangeTextDocument(a){this.changeHandler=a;return t.Disposable.create(()=>{this.changeHandler=a})}changeTextDocument(a){this.changeHandler&&this.changeHandler(a)}onDidCloseTextDocument(a){this.closeHandler=a;return t.Disposable.create(()=>{this.closeHandler=void 0})}closeTextDocument(a){this.closeHandler&&this.closeHandler(a)}onWillSaveTextDocument(){return r.NULL_DISPOSE}onWillSaveTextDocumentWaitUntil(){return r.NULL_DISPOSE}onDidSaveTextDocument(){return r.NULL_DISPOSE}}r.NULL_DISPOSE=Object.freeze({dispose:()=>{}});class i{constructor(a){if(a instanceof e.TextDocuments){this._cellTextDocuments=a}else{this._cellTextDocuments=new e.TextDocuments(a)}this.notebookDocuments=new Map;this.notebookCellMap=new Map;this._onDidOpen=new t.Emitter;this._onDidChange=new t.Emitter;this._onDidSave=new t.Emitter;this._onDidClose=new t.Emitter}get cellTextDocuments(){return this._cellTextDocuments}getCellTextDocument(a){return this._cellTextDocuments.get(a.document)}getNotebookDocument(a){return this.notebookDocuments.get(a)}getNotebookCell(a){const o=this.notebookCellMap.get(a);return o&&o[0]}findNotebookDocumentForCell(a){const o=typeof a==="string"?a:a.document;const l=this.notebookCellMap.get(o);return l&&l[1]}get onDidOpen(){return this._onDidOpen.event}get onDidSave(){return this._onDidSave.event}get onDidChange(){return this._onDidChange.event}get onDidClose(){return this._onDidClose.event}listen(a){const o=new r;const l=[];l.push(this.cellTextDocuments.listen(o));l.push(a.notebooks.synchronization.onDidOpenNotebookDocument(u=>{this.notebookDocuments.set(u.notebookDocument.uri,u.notebookDocument);for(const c of u.cellTextDocuments){o.openTextDocument({textDocument:c})}this.updateCellMap(u.notebookDocument);this._onDidOpen.fire(u.notebookDocument)}));l.push(a.notebooks.synchronization.onDidChangeNotebookDocument(u=>{const c=this.notebookDocuments.get(u.notebookDocument.uri);if(c===void 0){return}c.version=u.notebookDocument.version;const d=c.metadata;let f=false;const p=u.change;if(p.metadata!==void 0){f=true;c.metadata=p.metadata}const y=[];const R=[];const A=[];const v=[];if(p.cells!==void 0){const G=p.cells;if(G.structure!==void 0){const J=G.structure.array;c.cells.splice(J.start,J.deleteCount,...J.cells!==void 0?J.cells:[]);if(G.structure.didOpen!==void 0){for(const te of G.structure.didOpen){o.openTextDocument({textDocument:te});y.push(te.uri)}}if(G.structure.didClose){for(const te of G.structure.didClose){o.closeTextDocument({textDocument:te});R.push(te.uri)}}}if(G.data!==void 0){const J=new Map(G.data.map(te=>[te.document,te]));for(let te=0;te<=c.cells.length;te++){const ie=J.get(c.cells[te].document);if(ie!==void 0){const ce=c.cells.splice(te,1,ie);A.push({old:ce[0],new:ie});J.delete(ie.document);if(J.size===0){break}}}}if(G.textContent!==void 0){for(const J of G.textContent){o.changeTextDocument({textDocument:J.document,contentChanges:J.changes});v.push(J.document.uri)}}}this.updateCellMap(c);const $={notebookDocument:c};if(f){$.metadata={old:d,new:c.metadata}}const C=[];for(const G of y){C.push(this.getNotebookCell(G))}const O=[];for(const G of R){O.push(this.getNotebookCell(G))}const Y=[];for(const G of v){Y.push(this.getNotebookCell(G))}if(C.length>0||O.length>0||A.length>0||Y.length>0){$.cells={added:C,removed:O,changed:{data:A,textContent:Y}}}if($.metadata!==void 0||$.cells!==void 0){this._onDidChange.fire($)}}));l.push(a.notebooks.synchronization.onDidSaveNotebookDocument(u=>{const c=this.notebookDocuments.get(u.notebookDocument.uri);if(c===void 0){return}this._onDidSave.fire(c)}));l.push(a.notebooks.synchronization.onDidCloseNotebookDocument(u=>{const c=this.notebookDocuments.get(u.notebookDocument.uri);if(c===void 0){return}this._onDidClose.fire(c);for(const d of u.cellTextDocuments){o.closeTextDocument({textDocument:d})}this.notebookDocuments.delete(u.notebookDocument.uri);for(const d of c.cells){this.notebookCellMap.delete(d.document)}}));return t.Disposable.create(()=>{l.forEach(u=>u.dispose())})}updateCellMap(a){for(const o of a.cells){this.notebookCellMap.set(o.document,[o,a])}}}dr.NotebookDocuments=i;return dr}var ae={};var xe={};var my;function Yv(){if(my)return xe;my=1;Object.defineProperty(xe,"__esModule",{value:true});xe.thenable=xe.typedArray=xe.stringArray=xe.array=xe.func=xe.error=xe.number=xe.string=xe.boolean=void 0;function t(u){return u===true||u===false}xe.boolean=t;function e(u){return typeof u==="string"||u instanceof String}xe.string=e;function n(u){return typeof u==="number"||u instanceof Number}xe.number=n;function r(u){return u instanceof Error}xe.error=r;function i(u){return typeof u==="function"}xe.func=i;function s(u){return Array.isArray(u)}xe.array=s;function a(u){return s(u)&&u.every(c=>e(c))}xe.stringArray=a;function o(u,c){return Array.isArray(u)&&u.every(c)}xe.typedArray=o;function l(u){return u&&i(u.then)}xe.thenable=l;return xe}var At={};var hy;function Jv(){if(hy)return At;hy=1;Object.defineProperty(At,"__esModule",{value:true});At.generateUuid=At.parse=At.isUUID=At.v4=At.empty=void 0;class t{constructor(l){this._value=l}asHex(){return this._value}equals(l){return this.asHex()===l.asHex()}}class e extends t{static _oneOf(l){return l[Math.floor(l.length*Math.random())]}static _randomHex(){return e._oneOf(e._chars)}constructor(){super([e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),"-",e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),"-","4",e._randomHex(),e._randomHex(),e._randomHex(),"-",e._oneOf(e._timeHighBits),e._randomHex(),e._randomHex(),e._randomHex(),"-",e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex()].join(""))}}e._chars=["0","1","2","3","4","5","6","6","7","8","9","a","b","c","d","e","f"];e._timeHighBits=["8","9","a","b"];At.empty=new t("00000000-0000-0000-0000-000000000000");function n(){return new e}At.v4=n;const r=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;function i(o){return r.test(o)}At.isUUID=i;function s(o){if(!i(o)){throw new Error("invalid uuid")}return new t(o)}At.parse=s;function a(){return n().asHex()}At.generateUuid=a;return At}var $n={};var yy;function TN(){if(yy)return $n;yy=1;Object.defineProperty($n,"__esModule",{value:true});$n.attachPartialResult=$n.ProgressFeature=$n.attachWorkDone=void 0;const t=Fe();const e=Jv();class n{constructor(f,p){this._connection=f;this._token=p;n.Instances.set(this._token,this)}begin(f,p,y,R){let A={kind:"begin",title:f,percentage:p,message:y,cancellable:R};this._connection.sendProgress(t.WorkDoneProgress.type,this._token,A)}report(f,p){let y={kind:"report"};if(typeof f==="number"){y.percentage=f;if(p!==void 0){y.message=p}}else{y.message=f}this._connection.sendProgress(t.WorkDoneProgress.type,this._token,y)}done(){n.Instances.delete(this._token);this._connection.sendProgress(t.WorkDoneProgress.type,this._token,{kind:"end"})}}n.Instances=new Map;class r extends n{constructor(f,p){super(f,p);this._source=new t.CancellationTokenSource}get token(){return this._source.token}done(){this._source.dispose();super.done()}cancel(){this._source.cancel()}}class i{constructor(){}begin(){}report(){}done(){}}class s extends i{constructor(){super();this._source=new t.CancellationTokenSource}get token(){return this._source.token}done(){this._source.dispose()}cancel(){this._source.cancel()}}function a(d,f){if(f===void 0||f.workDoneToken===void 0){return new i}const p=f.workDoneToken;delete f.workDoneToken;return new n(d,p)}$n.attachWorkDone=a;const o=d=>{return class extends d{constructor(){super();this._progressSupported=false}initialize(f){super.initialize(f);if(f?.window?.workDoneProgress===true){this._progressSupported=true;this.connection.onNotification(t.WorkDoneProgressCancelNotification.type,p=>{let y=n.Instances.get(p.token);if(y instanceof r||y instanceof s){y.cancel()}})}}attachWorkDoneProgress(f){if(f===void 0){return new i}else{return new n(this.connection,f)}}createWorkDoneProgress(){if(this._progressSupported){const f=(0,e.generateUuid)();return this.connection.sendRequest(t.WorkDoneProgressCreateRequest.type,{token:f}).then(()=>{const p=new r(this.connection,f);return p})}else{return Promise.resolve(new s)}}}};$n.ProgressFeature=o;var l;(function(d){d.type=new t.ProgressType})(l||(l={}));class u{constructor(f,p){this._connection=f;this._token=p}report(f){this._connection.sendProgress(l.type,this._token,f)}}function c(d,f){if(f===void 0||f.partialResultToken===void 0){return void 0}const p=f.partialResultToken;delete f.partialResultToken;return new u(d,p)}$n.attachPartialResult=c;return $n}var wi={};var gy;function CN(){if(gy)return wi;gy=1;Object.defineProperty(wi,"__esModule",{value:true});wi.ConfigurationFeature=void 0;const t=Fe();const e=Yv();const n=r=>{return class extends r{getConfiguration(i){if(!i){return this._getConfiguration({})}else if(e.string(i)){return this._getConfiguration({section:i})}else{return this._getConfiguration(i)}}_getConfiguration(i){let s={items:Array.isArray(i)?i:[i]};return this.connection.sendRequest(t.ConfigurationRequest.type,s).then(a=>{if(Array.isArray(a)){return Array.isArray(i)?a:a[0]}else{return Array.isArray(i)?[]:null}})}}};wi.ConfigurationFeature=n;return wi}var bi={};var Iy;function wN(){if(Iy)return bi;Iy=1;Object.defineProperty(bi,"__esModule",{value:true});bi.WorkspaceFoldersFeature=void 0;const t=Fe();const e=n=>{return class extends n{constructor(){super();this._notificationIsAutoRegistered=false}initialize(r){super.initialize(r);let i=r.workspace;if(i&&i.workspaceFolders){this._onDidChangeWorkspaceFolders=new t.Emitter;this.connection.onNotification(t.DidChangeWorkspaceFoldersNotification.type,s=>{this._onDidChangeWorkspaceFolders.fire(s.event)})}}fillServerCapabilities(r){super.fillServerCapabilities(r);const i=r.workspace?.workspaceFolders?.changeNotifications;this._notificationIsAutoRegistered=i===true||typeof i==="string"}getWorkspaceFolders(){return this.connection.sendRequest(t.WorkspaceFoldersRequest.type)}get onDidChangeWorkspaceFolders(){if(!this._onDidChangeWorkspaceFolders){throw new Error("Client doesn't support sending workspace folder change events.")}if(!this._notificationIsAutoRegistered&&!this._unregistration){this._unregistration=this.connection.client.register(t.DidChangeWorkspaceFoldersNotification.type)}return this._onDidChangeWorkspaceFolders.event}}};bi.WorkspaceFoldersFeature=e;return bi}var Ai={};var vy;function bN(){if(vy)return Ai;vy=1;Object.defineProperty(Ai,"__esModule",{value:true});Ai.CallHierarchyFeature=void 0;const t=Fe();const e=n=>{return class extends n{get callHierarchy(){return{onPrepare:r=>{return this.connection.onRequest(t.CallHierarchyPrepareRequest.type,(i,s)=>{return r(i,s,this.attachWorkDoneProgress(i),void 0)})},onIncomingCalls:r=>{const i=t.CallHierarchyIncomingCallsRequest.type;return this.connection.onRequest(i,(s,a)=>{return r(s,a,this.attachWorkDoneProgress(s),this.attachPartialResultProgress(i,s))})},onOutgoingCalls:r=>{const i=t.CallHierarchyOutgoingCallsRequest.type;return this.connection.onRequest(i,(s,a)=>{return r(s,a,this.attachWorkDoneProgress(s),this.attachPartialResultProgress(i,s))})}}}}};Ai.CallHierarchyFeature=e;return Ai}var Mi={};var Ry;function AN(){if(Ry)return Mi;Ry=1;Object.defineProperty(Mi,"__esModule",{value:true});Mi.ShowDocumentFeature=void 0;const t=Fe();const e=n=>{return class extends n{showDocument(r){return this.connection.sendRequest(t.ShowDocumentRequest.type,r)}}};Mi.ShowDocumentFeature=e;return Mi}var Si={};var Ey;function MN(){if(Ey)return Si;Ey=1;Object.defineProperty(Si,"__esModule",{value:true});Si.FileOperationsFeature=void 0;const t=Fe();const e=n=>{return class extends n{onDidCreateFiles(r){return this.connection.onNotification(t.DidCreateFilesNotification.type,i=>{r(i)})}onDidRenameFiles(r){return this.connection.onNotification(t.DidRenameFilesNotification.type,i=>{r(i)})}onDidDeleteFiles(r){return this.connection.onNotification(t.DidDeleteFilesNotification.type,i=>{r(i)})}onWillCreateFiles(r){return this.connection.onRequest(t.WillCreateFilesRequest.type,(i,s)=>{return r(i,s)})}onWillRenameFiles(r){return this.connection.onRequest(t.WillRenameFilesRequest.type,(i,s)=>{return r(i,s)})}onWillDeleteFiles(r){return this.connection.onRequest(t.WillDeleteFilesRequest.type,(i,s)=>{return r(i,s)})}}};Si.FileOperationsFeature=e;return Si}var Ni={};var $y;function SN(){if($y)return Ni;$y=1;Object.defineProperty(Ni,"__esModule",{value:true});Ni.LinkedEditingRangeFeature=void 0;const t=Fe();const e=n=>{return class extends n{onLinkedEditingRange(r){return this.connection.onRequest(t.LinkedEditingRangeRequest.type,(i,s)=>{return r(i,s,this.attachWorkDoneProgress(i),void 0)})}}};Ni.LinkedEditingRangeFeature=e;return Ni}var ki={};var Ty;function NN(){if(Ty)return ki;Ty=1;Object.defineProperty(ki,"__esModule",{value:true});ki.TypeHierarchyFeature=void 0;const t=Fe();const e=n=>{return class extends n{get typeHierarchy(){return{onPrepare:r=>{return this.connection.onRequest(t.TypeHierarchyPrepareRequest.type,(i,s)=>{return r(i,s,this.attachWorkDoneProgress(i),void 0)})},onSupertypes:r=>{const i=t.TypeHierarchySupertypesRequest.type;return this.connection.onRequest(i,(s,a)=>{return r(s,a,this.attachWorkDoneProgress(s),this.attachPartialResultProgress(i,s))})},onSubtypes:r=>{const i=t.TypeHierarchySubtypesRequest.type;return this.connection.onRequest(i,(s,a)=>{return r(s,a,this.attachWorkDoneProgress(s),this.attachPartialResultProgress(i,s))})}}}}};ki.TypeHierarchyFeature=e;return ki}var Pi={};var Cy;function kN(){if(Cy)return Pi;Cy=1;Object.defineProperty(Pi,"__esModule",{value:true});Pi.InlineValueFeature=void 0;const t=Fe();const e=n=>{return class extends n{get inlineValue(){return{refresh:()=>{return this.connection.sendRequest(t.InlineValueRefreshRequest.type)},on:r=>{return this.connection.onRequest(t.InlineValueRequest.type,(i,s)=>{return r(i,s,this.attachWorkDoneProgress(i))})}}}}};Pi.InlineValueFeature=e;return Pi}var Di={};var wy;function PN(){if(wy)return Di;wy=1;Object.defineProperty(Di,"__esModule",{value:true});Di.FoldingRangeFeature=void 0;const t=Fe();const e=n=>{return class extends n{get foldingRange(){return{refresh:()=>{return this.connection.sendRequest(t.FoldingRangeRefreshRequest.type)},on:r=>{const i=t.FoldingRangeRequest.type;return this.connection.onRequest(i,(s,a)=>{return r(s,a,this.attachWorkDoneProgress(s),this.attachPartialResultProgress(i,s))})}}}}};Di.FoldingRangeFeature=e;return Di}var Oi={};var by;function DN(){if(by)return Oi;by=1;Object.defineProperty(Oi,"__esModule",{value:true});Oi.InlayHintFeature=void 0;const t=Fe();const e=n=>{return class extends n{get inlayHint(){return{refresh:()=>{return this.connection.sendRequest(t.InlayHintRefreshRequest.type)},on:r=>{return this.connection.onRequest(t.InlayHintRequest.type,(i,s)=>{return r(i,s,this.attachWorkDoneProgress(i))})},resolve:r=>{return this.connection.onRequest(t.InlayHintResolveRequest.type,(i,s)=>{return r(i,s)})}}}}};Oi.InlayHintFeature=e;return Oi}var _i={};var Ay;function ON(){if(Ay)return _i;Ay=1;Object.defineProperty(_i,"__esModule",{value:true});_i.DiagnosticFeature=void 0;const t=Fe();const e=n=>{return class extends n{get diagnostics(){return{refresh:()=>{return this.connection.sendRequest(t.DiagnosticRefreshRequest.type)},on:r=>{return this.connection.onRequest(t.DocumentDiagnosticRequest.type,(i,s)=>{return r(i,s,this.attachWorkDoneProgress(i),this.attachPartialResultProgress(t.DocumentDiagnosticRequest.partialResult,i))})},onWorkspace:r=>{return this.connection.onRequest(t.WorkspaceDiagnosticRequest.type,(i,s)=>{return r(i,s,this.attachWorkDoneProgress(i),this.attachPartialResultProgress(t.WorkspaceDiagnosticRequest.partialResult,i))})}}}}};_i.DiagnosticFeature=e;return _i}var Bi={};var My;function _N(){if(My)return Bi;My=1;Object.defineProperty(Bi,"__esModule",{value:true});Bi.MonikerFeature=void 0;const t=Fe();const e=n=>{return class extends n{get moniker(){return{on:r=>{const i=t.MonikerRequest.type;return this.connection.onRequest(i,(s,a)=>{return r(s,a,this.attachWorkDoneProgress(s),this.attachPartialResultProgress(i,s))})}}}}};Bi.MonikerFeature=e;return Bi}var Sy;function BN(){if(Sy)return ae;Sy=1;Object.defineProperty(ae,"__esModule",{value:true});ae.createConnection=ae.combineFeatures=ae.combineNotebooksFeatures=ae.combineLanguagesFeatures=ae.combineWorkspaceFeatures=ae.combineWindowFeatures=ae.combineClientFeatures=ae.combineTracerFeatures=ae.combineTelemetryFeatures=ae.combineConsoleFeatures=ae._NotebooksImpl=ae._LanguagesImpl=ae.BulkUnregistration=ae.BulkRegistration=ae.ErrorMessageTracker=void 0;const t=Fe();const e=Yv();const n=Jv();const r=TN();const i=CN();const s=wN();const a=bN();const o=Vv();const l=AN();const u=MN();const c=SN();const d=NN();const f=kN();const p=PN();const y=DN();const R=ON();const A=Xv();const v=_N();function $(H){if(H===null){return void 0}return H}class C{constructor(){this._messages=Object.create(null)}add(I){let b=this._messages[I];if(!b){b=0}b++;this._messages[I]=b}sendErrors(I){Object.keys(this._messages).forEach(b=>{I.window.showErrorMessage(b)})}}ae.ErrorMessageTracker=C;class O{constructor(){}rawAttach(I){this._rawConnection=I}attach(I){this._connection=I}get connection(){if(!this._connection){throw new Error("Remote is not attached to a connection yet.")}return this._connection}fillServerCapabilities(I){}initialize(I){}error(I){this.send(t.MessageType.Error,I)}warn(I){this.send(t.MessageType.Warning,I)}info(I){this.send(t.MessageType.Info,I)}log(I){this.send(t.MessageType.Log,I)}debug(I){this.send(t.MessageType.Debug,I)}send(I,b){if(this._rawConnection){this._rawConnection.sendNotification(t.LogMessageNotification.type,{type:I,message:b}).catch(()=>{(0,t.RAL)().console.error(`Sending log message failed`)})}}}class Y{constructor(){}attach(I){this._connection=I}get connection(){if(!this._connection){throw new Error("Remote is not attached to a connection yet.")}return this._connection}initialize(I){}fillServerCapabilities(I){}showErrorMessage(I,...b){let q={type:t.MessageType.Error,message:I,actions:b};return this.connection.sendRequest(t.ShowMessageRequest.type,q).then($)}showWarningMessage(I,...b){let q={type:t.MessageType.Warning,message:I,actions:b};return this.connection.sendRequest(t.ShowMessageRequest.type,q).then($)}showInformationMessage(I,...b){let q={type:t.MessageType.Info,message:I,actions:b};return this.connection.sendRequest(t.ShowMessageRequest.type,q).then($)}}const G=(0,l.ShowDocumentFeature)((0,r.ProgressFeature)(Y));var J;(function(H){function I(){return new te}H.create=I})(J||(ae.BulkRegistration=J={}));class te{constructor(){this._registrations=[];this._registered=new Set}add(I,b){const q=e.string(I)?I:I.method;if(this._registered.has(q)){throw new Error(`${q} is already added to this registration`)}const w=n.generateUuid();this._registrations.push({id:w,method:q,registerOptions:b||{}});this._registered.add(q)}asRegistrationParams(){return{registrations:this._registrations}}}var ie;(function(H){function I(){return new ce(void 0,[])}H.create=I})(ie||(ae.BulkUnregistration=ie={}));class ce{constructor(I,b){this._connection=I;this._unregistrations=new Map;b.forEach(q=>{this._unregistrations.set(q.method,q)})}get isAttached(){return!!this._connection}attach(I){this._connection=I}add(I){this._unregistrations.set(I.method,I)}dispose(){let I=[];for(let q of this._unregistrations.values()){I.push(q)}let b={unregisterations:I};this._connection.sendRequest(t.UnregistrationRequest.type,b).catch(()=>{this._connection.console.info(`Bulk unregistration failed.`)})}disposeSingle(I){const b=e.string(I)?I:I.method;const q=this._unregistrations.get(b);if(!q){return false}let w={unregisterations:[q]};this._connection.sendRequest(t.UnregistrationRequest.type,w).then(()=>{this._unregistrations.delete(b)},de=>{this._connection.console.info(`Un-registering request handler for ${q.id} failed.`)});return true}}class _{attach(I){this._connection=I}get connection(){if(!this._connection){throw new Error("Remote is not attached to a connection yet.")}return this._connection}initialize(I){}fillServerCapabilities(I){}register(I,b,q){if(I instanceof te){return this.registerMany(I)}else if(I instanceof ce){return this.registerSingle1(I,b,q)}else{return this.registerSingle2(I,b)}}registerSingle1(I,b,q){const w=e.string(b)?b:b.method;const de=n.generateUuid();let nt={registrations:[{id:de,method:w,registerOptions:q||{}}]};if(!I.isAttached){I.attach(this.connection)}return this.connection.sendRequest(t.RegistrationRequest.type,nt).then(Gt=>{I.add({id:de,method:w});return I},Gt=>{this.connection.console.info(`Registering request handler for ${w} failed.`);return Promise.reject(Gt)})}registerSingle2(I,b){const q=e.string(I)?I:I.method;const w=n.generateUuid();let de={registrations:[{id:w,method:q,registerOptions:b||{}}]};return this.connection.sendRequest(t.RegistrationRequest.type,de).then(nt=>{return t.Disposable.create(()=>{this.unregisterSingle(w,q).catch(()=>{this.connection.console.info(`Un-registering capability with id ${w} failed.`)})})},nt=>{this.connection.console.info(`Registering request handler for ${q} failed.`);return Promise.reject(nt)})}unregisterSingle(I,b){let q={unregisterations:[{id:I,method:b}]};return this.connection.sendRequest(t.UnregistrationRequest.type,q).catch(()=>{this.connection.console.info(`Un-registering request handler for ${I} failed.`)})}registerMany(I){let b=I.asRegistrationParams();return this.connection.sendRequest(t.RegistrationRequest.type,b).then(()=>{return new ce(this._connection,b.registrations.map(q=>{return{id:q.id,method:q.method}}))},q=>{this.connection.console.info(`Bulk registration failed.`);return Promise.reject(q)})}}class T{constructor(){}attach(I){this._connection=I}get connection(){if(!this._connection){throw new Error("Remote is not attached to a connection yet.")}return this._connection}initialize(I){}fillServerCapabilities(I){}applyEdit(I){function b(w){return w&&!!w.edit}let q=b(I)?I:{edit:I};return this.connection.sendRequest(t.ApplyWorkspaceEditRequest.type,q)}}const g=(0,u.FileOperationsFeature)((0,s.WorkspaceFoldersFeature)((0,i.ConfigurationFeature)(T)));class M{constructor(){this._trace=t.Trace.Off}attach(I){this._connection=I}get connection(){if(!this._connection){throw new Error("Remote is not attached to a connection yet.")}return this._connection}initialize(I){}fillServerCapabilities(I){}set trace(I){this._trace=I}log(I,b){if(this._trace===t.Trace.Off){return}this.connection.sendNotification(t.LogTraceNotification.type,{message:I,verbose:this._trace===t.Trace.Verbose?b:void 0}).catch(()=>{})}}class L{constructor(){}attach(I){this._connection=I}get connection(){if(!this._connection){throw new Error("Remote is not attached to a connection yet.")}return this._connection}initialize(I){}fillServerCapabilities(I){}logEvent(I){this.connection.sendNotification(t.TelemetryEventNotification.type,I).catch(()=>{this.connection.console.log(`Sending TelemetryEventNotification failed`)})}}class D{constructor(){}attach(I){this._connection=I}get connection(){if(!this._connection){throw new Error("Remote is not attached to a connection yet.")}return this._connection}initialize(I){}fillServerCapabilities(I){}attachWorkDoneProgress(I){return(0,r.attachWorkDone)(this.connection,I)}attachPartialResultProgress(I,b){return(0,r.attachPartialResult)(this.connection,b)}}ae._LanguagesImpl=D;const B=(0,p.FoldingRangeFeature)((0,v.MonikerFeature)((0,R.DiagnosticFeature)((0,y.InlayHintFeature)((0,f.InlineValueFeature)((0,d.TypeHierarchyFeature)((0,c.LinkedEditingRangeFeature)((0,o.SemanticTokensFeature)((0,a.CallHierarchyFeature)(D)))))))));class $e{constructor(){}attach(I){this._connection=I}get connection(){if(!this._connection){throw new Error("Remote is not attached to a connection yet.")}return this._connection}initialize(I){}fillServerCapabilities(I){}attachWorkDoneProgress(I){return(0,r.attachWorkDone)(this.connection,I)}attachPartialResultProgress(I,b){return(0,r.attachPartialResult)(this.connection,b)}}ae._NotebooksImpl=$e;const F=(0,A.NotebookSyncFeature)($e);function S(H,I){return function(b){return I(H(b))}}ae.combineConsoleFeatures=S;function ne(H,I){return function(b){return I(H(b))}}ae.combineTelemetryFeatures=ne;function Tt(H,I){return function(b){return I(H(b))}}ae.combineTracerFeatures=Tt;function Ct(H,I){return function(b){return I(H(b))}}ae.combineClientFeatures=Ct;function Te(H,I){return function(b){return I(H(b))}}ae.combineWindowFeatures=Te;function wt(H,I){return function(b){return I(H(b))}}ae.combineWorkspaceFeatures=wt;function pe(H,I){return function(b){return I(H(b))}}ae.combineLanguagesFeatures=pe;function Se(H,I){return function(b){return I(H(b))}}ae.combineNotebooksFeatures=Se;function We(H,I){function b(w,de,nt){if(w&&de){return nt(w,de)}else if(w){return w}else{return de}}let q={__brand:"features",console:b(H.console,I.console,S),tracer:b(H.tracer,I.tracer,Tt),telemetry:b(H.telemetry,I.telemetry,ne),client:b(H.client,I.client,Ct),window:b(H.window,I.window,Te),workspace:b(H.workspace,I.workspace,wt),languages:b(H.languages,I.languages,pe),notebooks:b(H.notebooks,I.notebooks,Se)};return q}ae.combineFeatures=We;function ge(H,I,b){const q=b&&b.console?new(b.console(O)):new O;const w=H(q);q.rawAttach(w);const de=b&&b.tracer?new(b.tracer(M)):new M;const nt=b&&b.telemetry?new(b.telemetry(L)):new L;const Gt=b&&b.client?new(b.client(_)):new _;const Kn=b&&b.window?new(b.window(G)):new G;const Un=b&&b.workspace?new(b.workspace(g)):new g;const Wn=b&&b.languages?new(b.languages(B)):new B;const yt=b&&b.notebooks?new(b.notebooks(F)):new F;const Jt=[q,de,nt,Gt,Kn,Un,Wn,yt];function Sr(N){if(N instanceof Promise){return N}else if(e.thenable(N)){return new Promise((k,U)=>{N.then(gt=>k(gt),gt=>U(gt))})}else{return Promise.resolve(N)}}let cn=void 0;let dn=void 0;let Qt=void 0;let Bt={listen:()=>w.listen(),sendRequest:(N,...k)=>w.sendRequest(e.string(N)?N:N.method,...k),onRequest:(N,k)=>w.onRequest(N,k),sendNotification:(N,k)=>{const U=e.string(N)?N:N.method;return w.sendNotification(U,k)},onNotification:(N,k)=>w.onNotification(N,k),onProgress:w.onProgress,sendProgress:w.sendProgress,onInitialize:N=>{dn=N;return{dispose:()=>{dn=void 0}}},onInitialized:N=>w.onNotification(t.InitializedNotification.type,N),onShutdown:N=>{cn=N;return{dispose:()=>{cn=void 0}}},onExit:N=>{Qt=N;return{dispose:()=>{Qt=void 0}}},get console(){return q},get telemetry(){return nt},get tracer(){return de},get client(){return Gt},get window(){return Kn},get workspace(){return Un},get languages(){return Wn},get notebooks(){return yt},onDidChangeConfiguration:N=>w.onNotification(t.DidChangeConfigurationNotification.type,N),onDidChangeWatchedFiles:N=>w.onNotification(t.DidChangeWatchedFilesNotification.type,N),__textDocumentSync:void 0,onDidOpenTextDocument:N=>w.onNotification(t.DidOpenTextDocumentNotification.type,N),onDidChangeTextDocument:N=>w.onNotification(t.DidChangeTextDocumentNotification.type,N),onDidCloseTextDocument:N=>w.onNotification(t.DidCloseTextDocumentNotification.type,N),onWillSaveTextDocument:N=>w.onNotification(t.WillSaveTextDocumentNotification.type,N),onWillSaveTextDocumentWaitUntil:N=>w.onRequest(t.WillSaveTextDocumentWaitUntilRequest.type,N),onDidSaveTextDocument:N=>w.onNotification(t.DidSaveTextDocumentNotification.type,N),sendDiagnostics:N=>w.sendNotification(t.PublishDiagnosticsNotification.type,N),onHover:N=>w.onRequest(t.HoverRequest.type,(k,U)=>{return N(k,U,(0,r.attachWorkDone)(w,k),void 0)}),onCompletion:N=>w.onRequest(t.CompletionRequest.type,(k,U)=>{return N(k,U,(0,r.attachWorkDone)(w,k),(0,r.attachPartialResult)(w,k))}),onCompletionResolve:N=>w.onRequest(t.CompletionResolveRequest.type,N),onSignatureHelp:N=>w.onRequest(t.SignatureHelpRequest.type,(k,U)=>{return N(k,U,(0,r.attachWorkDone)(w,k),void 0)}),onDeclaration:N=>w.onRequest(t.DeclarationRequest.type,(k,U)=>{return N(k,U,(0,r.attachWorkDone)(w,k),(0,r.attachPartialResult)(w,k))}),onDefinition:N=>w.onRequest(t.DefinitionRequest.type,(k,U)=>{return N(k,U,(0,r.attachWorkDone)(w,k),(0,r.attachPartialResult)(w,k))}),onTypeDefinition:N=>w.onRequest(t.TypeDefinitionRequest.type,(k,U)=>{return N(k,U,(0,r.attachWorkDone)(w,k),(0,r.attachPartialResult)(w,k))}),onImplementation:N=>w.onRequest(t.ImplementationRequest.type,(k,U)=>{return N(k,U,(0,r.attachWorkDone)(w,k),(0,r.attachPartialResult)(w,k))}),onReferences:N=>w.onRequest(t.ReferencesRequest.type,(k,U)=>{return N(k,U,(0,r.attachWorkDone)(w,k),(0,r.attachPartialResult)(w,k))}),onDocumentHighlight:N=>w.onRequest(t.DocumentHighlightRequest.type,(k,U)=>{return N(k,U,(0,r.attachWorkDone)(w,k),(0,r.attachPartialResult)(w,k))}),onDocumentSymbol:N=>w.onRequest(t.DocumentSymbolRequest.type,(k,U)=>{return N(k,U,(0,r.attachWorkDone)(w,k),(0,r.attachPartialResult)(w,k))}),onWorkspaceSymbol:N=>w.onRequest(t.WorkspaceSymbolRequest.type,(k,U)=>{return N(k,U,(0,r.attachWorkDone)(w,k),(0,r.attachPartialResult)(w,k))}),onWorkspaceSymbolResolve:N=>w.onRequest(t.WorkspaceSymbolResolveRequest.type,N),onCodeAction:N=>w.onRequest(t.CodeActionRequest.type,(k,U)=>{return N(k,U,(0,r.attachWorkDone)(w,k),(0,r.attachPartialResult)(w,k))}),onCodeActionResolve:N=>w.onRequest(t.CodeActionResolveRequest.type,(k,U)=>{return N(k,U)}),onCodeLens:N=>w.onRequest(t.CodeLensRequest.type,(k,U)=>{return N(k,U,(0,r.attachWorkDone)(w,k),(0,r.attachPartialResult)(w,k))}),onCodeLensResolve:N=>w.onRequest(t.CodeLensResolveRequest.type,(k,U)=>{return N(k,U)}),onDocumentFormatting:N=>w.onRequest(t.DocumentFormattingRequest.type,(k,U)=>{return N(k,U,(0,r.attachWorkDone)(w,k),void 0)}),onDocumentRangeFormatting:N=>w.onRequest(t.DocumentRangeFormattingRequest.type,(k,U)=>{return N(k,U,(0,r.attachWorkDone)(w,k),void 0)}),onDocumentOnTypeFormatting:N=>w.onRequest(t.DocumentOnTypeFormattingRequest.type,(k,U)=>{return N(k,U)}),onRenameRequest:N=>w.onRequest(t.RenameRequest.type,(k,U)=>{return N(k,U,(0,r.attachWorkDone)(w,k),void 0)}),onPrepareRename:N=>w.onRequest(t.PrepareRenameRequest.type,(k,U)=>{return N(k,U)}),onDocumentLinks:N=>w.onRequest(t.DocumentLinkRequest.type,(k,U)=>{return N(k,U,(0,r.attachWorkDone)(w,k),(0,r.attachPartialResult)(w,k))}),onDocumentLinkResolve:N=>w.onRequest(t.DocumentLinkResolveRequest.type,(k,U)=>{return N(k,U)}),onDocumentColor:N=>w.onRequest(t.DocumentColorRequest.type,(k,U)=>{return N(k,U,(0,r.attachWorkDone)(w,k),(0,r.attachPartialResult)(w,k))}),onColorPresentation:N=>w.onRequest(t.ColorPresentationRequest.type,(k,U)=>{return N(k,U,(0,r.attachWorkDone)(w,k),(0,r.attachPartialResult)(w,k))}),onFoldingRanges:N=>w.onRequest(t.FoldingRangeRequest.type,(k,U)=>{return N(k,U,(0,r.attachWorkDone)(w,k),(0,r.attachPartialResult)(w,k))}),onSelectionRanges:N=>w.onRequest(t.SelectionRangeRequest.type,(k,U)=>{return N(k,U,(0,r.attachWorkDone)(w,k),(0,r.attachPartialResult)(w,k))}),onExecuteCommand:N=>w.onRequest(t.ExecuteCommandRequest.type,(k,U)=>{return N(k,U,(0,r.attachWorkDone)(w,k),void 0)}),dispose:()=>w.dispose()};for(let N of Jt){N.attach(Bt)}w.onRequest(t.InitializeRequest.type,N=>{I.initialize(N);if(e.string(N.trace)){de.trace=t.Trace.fromString(N.trace)}for(let k of Jt){k.initialize(N.capabilities)}if(dn){let k=dn(N,new t.CancellationTokenSource().token,(0,r.attachWorkDone)(w,N),void 0);return Sr(k).then(U=>{if(U instanceof t.ResponseError){return U}let gt=U;if(!gt){gt={capabilities:{}}}let st=gt.capabilities;if(!st){st={};gt.capabilities=st}if(st.textDocumentSync===void 0||st.textDocumentSync===null){st.textDocumentSync=e.number(Bt.__textDocumentSync)?Bt.__textDocumentSync:t.TextDocumentSyncKind.None}else if(!e.number(st.textDocumentSync)&&!e.number(st.textDocumentSync.change)){st.textDocumentSync.change=e.number(Bt.__textDocumentSync)?Bt.__textDocumentSync:t.TextDocumentSyncKind.None}for(let er of Jt){er.fillServerCapabilities(st)}return gt})}else{let k={capabilities:{textDocumentSync:t.TextDocumentSyncKind.None}};for(let U of Jt){U.fillServerCapabilities(k.capabilities)}return k}});w.onRequest(t.ShutdownRequest.type,()=>{I.shutdownReceived=true;if(cn){return cn(new t.CancellationTokenSource().token)}else{return void 0}});w.onNotification(t.ExitNotification.type,()=>{try{if(Qt){Qt()}}finally{if(I.shutdownReceived){I.exit(0)}else{I.exit(1)}}});w.onNotification(t.SetTraceNotification.type,N=>{de.trace=t.Trace.fromString(N.value)});return Bt}ae.createConnection=ge;return ae}var Ny;function ky(){if(Ny)return oi;Ny=1;(function(t){var e=oi.__createBinding||(Object.create?function(l,u,c,d){if(d===void 0)d=c;var f=Object.getOwnPropertyDescriptor(u,c);if(!f||("get"in f?!u.__esModule:f.writable||f.configurable)){f={enumerable:true,get:function(){return u[c]}}}Object.defineProperty(l,d,f)}:function(l,u,c,d){if(d===void 0)d=c;l[d]=u[c]});var n=oi.__exportStar||function(l,u){for(var c in l)if(c!=="default"&&!Object.prototype.hasOwnProperty.call(u,c))e(u,l,c)};Object.defineProperty(t,"__esModule",{value:true});t.ProposedFeatures=t.NotebookDocuments=t.TextDocuments=t.SemanticTokensBuilder=void 0;const r=Vv();Object.defineProperty(t,"SemanticTokensBuilder",{enumerable:true,get:function(){return r.SemanticTokensBuilder}});const i=$N();n(Fe(),t);const s=zv();Object.defineProperty(t,"TextDocuments",{enumerable:true,get:function(){return s.TextDocuments}});const a=Xv();Object.defineProperty(t,"NotebookDocuments",{enumerable:true,get:function(){return a.NotebookDocuments}});n(BN(),t);var o;(function(l){l.all={__brand:"features",languages:i.InlineCompletionFeature}})(o||(t.ProposedFeatures=o={}))})(oi);return oi}var Nc;var Py;function LN(){if(Py)return Nc;Py=1;Nc=Fe();return Nc}var Dy;function Qv(){if(Dy)return ai;Dy=1;(function(t){var e=ai.__createBinding||(Object.create?function(o,l,u,c){if(c===void 0)c=u;var d=Object.getOwnPropertyDescriptor(l,u);if(!d||("get"in d?!l.__esModule:d.writable||d.configurable)){d={enumerable:true,get:function(){return l[u]}}}Object.defineProperty(o,c,d)}:function(o,l,u,c){if(c===void 0)c=u;o[c]=l[u]});var n=ai.__exportStar||function(o,l){for(var u in o)if(u!=="default"&&!Object.prototype.hasOwnProperty.call(l,u))e(l,o,u)};Object.defineProperty(t,"__esModule",{value:true});t.createConnection=void 0;const r=ky();n(LN(),t);n(ky(),t);let i=false;const s={initialize:o=>{},get shutdownReceived(){return i},set shutdownReceived(o){i=o},exit:o=>{}};function a(o,l,u,c){let d;let f;let p;let y;if(o!==void 0&&o.__brand==="features"){d=o;o=l;l=u;u=c}if(r.ConnectionStrategy.is(o)||r.ConnectionOptions.is(o)){y=o}else{f=o;p=l;y=u}const R=A=>{return(0,r.createProtocolConnection)(f,p,A,y)};return(0,r.createConnection)(R,s,d)}t.createConnection=a})(ai);return ai}var K=Qv();function Oy(t,e){const n={stacks:t,tokens:e};xN(n);n.stacks.flat().forEach(i=>{i.property=void 0});const r=eR(n.stacks);return r.map(i=>i[i.length-1])}function Hp(t){const{next:e,cardinalities:n,visited:r,plus:i}=t;const s=[];const a=e.feature;if(r.has(a)){return[]}else if(!gr(a)){r.add(a)}let o;let l=a;while(l.$container){if(gr(l.$container)){o=l.$container;break}else if(Rg(l.$container)){l=l.$container}else{break}}if(jR(l.cardinality)){const u=Fr({next:{feature:l,type:e.type},cardinalities:n,visited:r,plus:i});for(const c of u){i.add(c.feature)}s.push(...u)}if(o){const u=o.elements.indexOf(l);if(u!==void 0&&u<o.elements.length-1){s.push(...Zv({feature:o,type:e.type},u+1,n,r,i))}if(s.every(c=>ks(c.feature.cardinality,c.feature)||ks(n.get(c.feature))||i.has(c.feature))){s.push(...Hp({next:{feature:o,type:e.type},cardinalities:n,visited:r,plus:i}))}}return s}function np(t){if(Ze(t)){t={feature:t}}return Fr({next:t,cardinalities:new Map,visited:new Set,plus:new Set})}function Fr(t){var e,n,r;const{next:i,cardinalities:s,visited:a,plus:o}=t;if(i===void 0){return[]}const{feature:l,type:u}=i;if(gr(l)){if(a.has(l)){return[]}else{a.add(l)}return Zv(i,0,s,a,o).map(c=>Ka(c,l.cardinality,s))}else if(rp(l)||ip(l)){return l.elements.flatMap(c=>Fr({next:{feature:c,type:u,property:i.property},cardinalities:s,visited:a,plus:o})).map(c=>Ka(c,l.cardinality,s))}else if(sn(l)){const c={feature:l.terminal,type:u,property:(e=i.property)!==null&&e!==void 0?e:l.feature};return Fr({next:c,cardinalities:s,visited:a,plus:o}).map(d=>Ka(d,l.cardinality,s))}else if(Vs(l)){return Hp({next:{feature:l,type:Fu(l),property:(n=i.property)!==null&&n!==void 0?n:l.feature},cardinalities:s,visited:a,plus:o})}else if(Pn(l)&&it(l.rule.ref)){const c=l.rule.ref;const d={feature:c.definition,type:c.fragment||c.dataType?void 0:(r=Xs(c))!==null&&r!==void 0?r:c.name,property:i.property};return Fr({next:d,cardinalities:s,visited:a,plus:o}).map(f=>Ka(f,l.cardinality,s))}else{return[i]}}function Ka(t,e,n){n.set(t.feature,e);return t}function Zv(t,e,n,r,i){var s;const a=[];let o;while(e<t.feature.elements.length){const l=t.feature.elements[e++];o={feature:l,type:t.type};a.push(...Fr({next:o,cardinalities:n,visited:r,plus:i}));if(!ks((s=o.feature.cardinality)!==null&&s!==void 0?s:n.get(o.feature),o.feature)){break}}return a}function xN(t){for(const e of t.tokens){const n=eR(t.stacks,e);t.stacks=n}}function eR(t,e){const n=[];for(const r of t){n.push(...FN(r,e))}return n}function FN(t,e){const n=new Map;const r=new Set(t.map(s=>s.feature).filter(KN));const i=[];while(t.length>0){const s=t.pop();const a=Hp({next:s,cardinalities:n,plus:r,visited:new Set}).filter(o=>e?qp(o.feature,e):true);for(const o of a){i.push([...t,o])}if(!a.every(o=>ks(o.feature.cardinality,o.feature)||ks(n.get(o.feature)))){break}}return i}function KN(t){if(t.cardinality==="+"){return true}const e=Sn(t,sn);if(e&&e.cardinality==="+"){return true}return false}function qp(t,e){if(an(t)){const n=t.value;return n===e.image}else if(Pn(t)){return UN(t.rule.ref,e)}else if(zs(t)){const n=Ng(t);if(n){return qp(n,e)}}return false}function UN(t,e){if(it(t)){const n=np(t.definition);return n.some(r=>qp(r.feature,e))}else if(Yn(t)){return Ku(t).test(e.image)}else{return false}}function WN(t){const e=Array.from(new Set(t.flatMap(r=>{var i;return(i=r===null||r===void 0?void 0:r.triggerCharacters)!==null&&i!==void 0?i:[]})));const n=Array.from(new Set(t.flatMap(r=>{var i;return(i=r===null||r===void 0?void 0:r.allCommitCharacters)!==null&&i!==void 0?i:[]})));return{triggerCharacters:e.length>0?e:void 0,allCommitCharacters:n.length>0?n:void 0}}class tR{constructor(e){this.scopeProvider=e.references.ScopeProvider;this.grammar=e.Grammar;this.completionParser=e.parser.CompletionParser;this.nameProvider=e.references.NameProvider;this.lexer=e.parser.Lexer;this.nodeKindProvider=e.shared.lsp.NodeKindProvider;this.fuzzyMatcher=e.shared.lsp.FuzzyMatcher;this.grammarConfig=e.parser.GrammarConfig;this.astReflection=e.shared.AstReflection;this.documentationProvider=e.documentation.DocumentationProvider}async getCompletion(e,n,r){const i=[];const s=this.buildContexts(e,n.position);const a=(u,c)=>{const d=this.fillCompletionItem(u,c);if(d){i.push(d)}};const o=u=>{if(an(u.feature)){return u.feature.value}else{return u.feature}};const l=[];for(const u of s){await Promise.all(Ae(u.features).distinct(o).exclude(l).map(c=>this.completionFor(u,c,a)));l.push(...u.features);if(!this.continueCompletion(i)){break}}return K.CompletionList.create(this.deduplicateItems(i),true)}deduplicateItems(e){return Ae(e).distinct(n=>`${n.kind}_${n.label}_${n.detail}`).toArray()}findFeaturesAt(e,n){const r=e.getText({start:K.Position.create(0,0),end:e.positionAt(n)});const i=this.completionParser.parse(r);const s=i.tokens;if(i.tokenIndex===0){const l=Dd(this.grammar);const u=np({feature:l.definition,type:Xs(l)});if(s.length>0){s.shift();return Oy(u.map(c=>[c]),s)}else{return u}}const a=[...s].splice(i.tokenIndex);const o=Oy([i.elementStack.map(l=>({feature:l}))],a);return o}*buildContexts(e,n){var r,i;const s=e.parseResult.value.$cstNode;if(!s){return}const a=e.textDocument;const o=a.getText();const l=a.offsetAt(n);const u={document:e,textDocument:a,offset:l,position:n};const c=this.findDataTypeRuleStart(s,l);if(c){const[$,C]=c;const O=(r=kd(s,$))===null||r===void 0?void 0:r.astNode;yield Object.assign(Object.assign({},u),{node:O,tokenOffset:$,tokenEndOffset:C,features:this.findFeaturesAt(a,$)})}const{nextTokenStart:d,nextTokenEnd:f,previousTokenStart:p,previousTokenEnd:y}=this.backtrackToAnyToken(o,l);let R=d;if(l<=d&&p!==void 0){R=p}const A=(i=kd(s,R))===null||i===void 0?void 0:i.astNode;let v=true;if(p!==void 0&&y!==void 0&&y===l){yield Object.assign(Object.assign({},u),{node:A,tokenOffset:p,tokenEndOffset:y,features:this.findFeaturesAt(a,p)});v=this.performNextTokenCompletion(e,o.substring(p,y),p,y);if(v){yield Object.assign(Object.assign({},u),{node:A,tokenOffset:y,tokenEndOffset:y,features:this.findFeaturesAt(a,y)})}}if(!A){const $=Dd(this.grammar);if(!$){throw new Error("Missing entry parser rule")}yield Object.assign(Object.assign({},u),{tokenOffset:d,tokenEndOffset:f,features:np($.definition)})}else if(v){yield Object.assign(Object.assign({},u),{node:A,tokenOffset:d,tokenEndOffset:f,features:this.findFeaturesAt(a,d)})}}performNextTokenCompletion(e,n,r,i){return/\P{L}$/u.test(n)}findDataTypeRuleStart(e,n){var r,i;let s=yr(e,n,this.grammarConfig.nameRegexp);let a=Boolean((r=Sn(s===null||s===void 0?void 0:s.grammarSource,it))===null||r===void 0?void 0:r.dataType);if(a){while(a){s=s===null||s===void 0?void 0:s.container;a=Boolean((i=Sn(s===null||s===void 0?void 0:s.grammarSource,it))===null||i===void 0?void 0:i.dataType)}if(s){return[s.offset,s.end]}}return void 0}continueCompletion(e){return e.length===0}backtrackToAnyToken(e,n){const r=this.lexer.tokenize(e).tokens;if(r.length===0){return{nextTokenStart:n,nextTokenEnd:n}}let i;for(const s of r){if(s.startOffset>=n){return{nextTokenStart:n,nextTokenEnd:n,previousTokenStart:i?i.startOffset:void 0,previousTokenEnd:i?i.endOffset+1:void 0}}if(s.endOffset>=n){return{nextTokenStart:s.startOffset,nextTokenEnd:s.endOffset+1,previousTokenStart:i?i.startOffset:void 0,previousTokenEnd:i?i.endOffset+1:void 0}}i=s}return{nextTokenStart:n,nextTokenEnd:n,previousTokenStart:i?i.startOffset:void 0,previousTokenEnd:i?i.endOffset+1:void 0}}completionFor(e,n,r){if(an(n.feature)){return this.completionForKeyword(e,n.feature,r)}else if(zs(n.feature)&&e.node){return this.completionForCrossReference(e,n,r)}}completionForCrossReference(e,n,r){const i=Sn(n.feature,sn);let s=e.node;if(i&&s){if(n.type){s={$type:n.type,$container:s,$containerProperty:n.property};bg(this.astReflection,s)}const a={reference:{$refText:""},container:s,property:i.feature};try{for(const o of this.getReferenceCandidates(a,e)){r(e,this.createReferenceCompletionItem(o))}}catch(o){console.error(o)}}}getReferenceCandidates(e,n){return this.scopeProvider.getScope(e).getAllElements()}createReferenceCompletionItem(e){const n=this.nodeKindProvider.getCompletionItemKind(e);const r=this.getReferenceDocumentation(e);return{nodeDescription:e,kind:n,documentation:r,detail:e.type,sortText:"0"}}getReferenceDocumentation(e){if(!e.node){return void 0}const n=this.documentationProvider.getDocumentation(e.node);if(!n){return void 0}return{kind:"markdown",value:n}}completionForKeyword(e,n,r){if(!this.filterKeyword(e,n)){return}r(e,{label:n.value,kind:this.getKeywordCompletionItemKind(n),detail:"Keyword",sortText:"1"})}getKeywordCompletionItemKind(e){return K.CompletionItemKind.Keyword}filterKeyword(e,n){return/\p{L}/u.test(n.value)}fillCompletionItem(e,n){var r,i;let s;if(typeof n.label==="string"){s=n.label}else if("node"in n){const u=this.nameProvider.getName(n.node);if(!u){return void 0}s=u}else if("nodeDescription"in n){s=n.nodeDescription.name}else{return void 0}let a;if(typeof((r=n.textEdit)===null||r===void 0?void 0:r.newText)==="string"){a=n.textEdit.newText}else if(typeof n.insertText==="string"){a=n.insertText}else{a=s}const o=(i=n.textEdit)!==null&&i!==void 0?i:this.buildCompletionTextEdit(e,s,a);if(!o){return void 0}const l={additionalTextEdits:n.additionalTextEdits,command:n.command,commitCharacters:n.commitCharacters,data:n.data,detail:n.detail,documentation:n.documentation,filterText:n.filterText,insertText:n.insertText,insertTextFormat:n.insertTextFormat,insertTextMode:n.insertTextMode,kind:n.kind,labelDetails:n.labelDetails,preselect:n.preselect,sortText:n.sortText,tags:n.tags,textEditText:n.textEditText,textEdit:o,label:s};return l}buildCompletionTextEdit(e,n,r){const i=e.textDocument.getText();const s=i.substring(e.tokenOffset,e.offset);if(this.fuzzyMatcher.match(s,n)){const a=e.textDocument.positionAt(e.tokenOffset);const o=e.position;return{newText:r,range:{start:a,end:o}}}else{return void 0}}}class GN{constructor(e){this.nameProvider=e.references.NameProvider;this.references=e.references.References;this.grammarConfig=e.parser.GrammarConfig}getDefinition(e,n,r){const i=e.parseResult.value;if(i.$cstNode){const s=i.$cstNode;const a=yr(s,e.textDocument.offsetAt(n.position),this.grammarConfig.nameRegexp);if(a){return this.collectLocationLinks(a,n)}}return void 0}collectLocationLinks(e,n){var r;const i=this.findLink(e);if(i){return[K.LocationLink.create(i.targetDocument.textDocument.uri,((r=i.target.astNode.$cstNode)!==null&&r!==void 0?r:i.target).range,i.target.range,i.source.range)]}return void 0}findLink(e){const n=this.references.findDeclarationNode(e);if(n===null||n===void 0?void 0:n.astNode){const r=ct(n.astNode);if(n&&r){return{source:e,target:n,targetDocument:r}}}return void 0}}class HN{constructor(e){this.references=e.references.References;this.nameProvider=e.references.NameProvider;this.grammarConfig=e.parser.GrammarConfig}getDocumentHighlight(e,n,r){const i=e.parseResult.value.$cstNode;if(!i){return void 0}const s=yr(i,e.textDocument.offsetAt(n.position),this.grammarConfig.nameRegexp);if(!s){return void 0}const a=this.references.findDeclaration(s);if(a){const o=Ke.equals(ct(a).uri,e.uri);const l={documentUri:e.uri,includeDeclaration:o};const u=this.references.findReferences(a,l);return u.map(c=>this.createDocumentHighlight(c)).toArray()}return void 0}createDocumentHighlight(e){return K.DocumentHighlight.create(e.segment.range)}}class qN{constructor(e){this.nameProvider=e.references.NameProvider;this.nodeKindProvider=e.shared.lsp.NodeKindProvider}getSymbols(e,n,r){return this.getSymbol(e,e.parseResult.value)}getSymbol(e,n){const r=n.$cstNode;const i=this.nameProvider.getNameNode(n);if(i&&r){const s=this.nameProvider.getName(n);return[{kind:this.nodeKindProvider.getSymbolKind(n),name:s||i.text,range:r.range,selectionRange:i.range,children:this.getChildSymbols(e,n)}]}else{return this.getChildSymbols(e,n)||[]}}getChildSymbols(e,n){const r=[];for(const i of Bu(n)){const s=this.getSymbol(e,i);r.push(...s)}if(r.length>0){return r}return void 0}}class nR{constructor(e){this.workspaceManager=e.workspace.WorkspaceManager;this.documentBuilder=e.workspace.DocumentBuilder;this.workspaceLock=e.workspace.WorkspaceLock;this.serviceRegistry=e.ServiceRegistry;let n=false;e.lsp.LanguageServer.onInitialize(r=>{var i,s;n=Boolean((s=(i=r.capabilities.workspace)===null||i===void 0?void 0:i.didChangeWatchedFiles)===null||s===void 0?void 0:s.dynamicRegistration)});e.lsp.LanguageServer.onInitialized(r=>{if(n){this.registerFileWatcher(e)}})}registerFileWatcher(e){const n=Ae(e.ServiceRegistry.all).flatMap(r=>r.LanguageMetaData.fileExtensions).map(r=>r.startsWith(".")?r.substring(1):r).distinct().toArray();if(n.length>0){const r=e.lsp.Connection;const i={watchers:[{globPattern:n.length===1?`**/*.${n[0]}`:`**/*.{${n.join(",")}}`}]};r===null||r===void 0?void 0:r.client.register(K.DidChangeWatchedFilesNotification.type,i)}}fireDocumentUpdate(e,n){e=e.filter(r=>this.serviceRegistry.hasServices(r));this.workspaceManager.ready.then(()=>{this.workspaceLock.write(r=>this.documentBuilder.update(e,n,r))}).catch(r=>{console.error("Workspace initialization failed. Could not perform document update.",r)})}didChangeContent(e){this.fireDocumentUpdate([dt.parse(e.document.uri)],[])}didChangeWatchedFiles(e){const n=Ae(e.changes).filter(i=>i.type!==K.FileChangeType.Deleted).distinct(i=>i.uri).map(i=>dt.parse(i.uri)).toArray();const r=Ae(e.changes).filter(i=>i.type===K.FileChangeType.Deleted).distinct(i=>i.uri).map(i=>dt.parse(i.uri)).toArray();this.fireDocumentUpdate(n,r)}}class jN{constructor(e){this.commentNames=e.parser.GrammarConfig.multilineCommentRules}getFoldingRanges(e,n,r){const i=[];const s=a=>i.push(a);this.collectFolding(e,s);return i}collectFolding(e,n){var r;const i=(r=e.parseResult)===null||r===void 0?void 0:r.value;if(i){if(this.shouldProcessContent(i)){const s=Tr(i).iterator();let a;do{a=s.next();if(!a.done){const o=a.value;if(this.shouldProcess(o)){this.collectObjectFolding(e,o,n)}if(!this.shouldProcessContent(o)){s.prune()}}}while(!a.done)}this.collectCommentFolding(e,i,n)}}shouldProcess(e){return true}shouldProcessContent(e){return true}collectObjectFolding(e,n,r){const i=n.$cstNode;if(i){const s=this.toFoldingRange(e,i);if(s){r(s)}}}collectCommentFolding(e,n,r){const i=n.$cstNode;if(i){for(const s of uR(i)){if(this.commentNames.includes(s.tokenType.name)){const a=this.toFoldingRange(e,s,K.FoldingRangeKind.Comment);if(a){r(a)}}}}}toFoldingRange(e,n,r){const i=n.range;const s=i.start;let a=i.end;if(a.line-s.line<2){return void 0}if(!this.includeLastFoldingLine(n,r)){a=e.textDocument.positionAt(e.textDocument.offsetAt({line:a.line,character:0})-1)}return K.FoldingRange.create(s.line,a.line,s.character,a.character,r)}includeLastFoldingLine(e,n){if(n===K.FoldingRangeKind.Comment){return false}const r=e.text;const i=r.charAt(r.length-1);if(i==="}"||i===")"||i==="]"){return false}return true}}class VN{match(e,n){if(e.length===0){return true}let r=false;let i;let s=0;const a=n.length;for(let o=0;o<a;o++){const l=n.charCodeAt(o);const u=e.charCodeAt(s);if(l===u||this.toUpperCharCode(l)===this.toUpperCharCode(u)){r||(r=i===void 0||this.isWordTransition(i,l));if(r){s++}if(s===e.length){return true}}i=l}return false}isWordTransition(e,n){return _y<=e&&e<=By&&zN<=n&&n<=XN||e===Ly&&n!==Ly}toUpperCharCode(e){if(_y<=e&&e<=By){return e-32}return e}}const _y="a".charCodeAt(0);const By="z".charCodeAt(0);const zN="A".charCodeAt(0);const XN="Z".charCodeAt(0);const Ly="_".charCodeAt(0);class YN{constructor(e){this.references=e.references.References;this.grammarConfig=e.parser.GrammarConfig}getHoverContent(e,n){var r,i;const s=(i=(r=e.parseResult)===null||r===void 0?void 0:r.value)===null||i===void 0?void 0:i.$cstNode;if(s){const a=e.textDocument.offsetAt(n.position);const o=yr(s,a,this.grammarConfig.nameRegexp);if(o&&o.offset+o.length>a){const l=this.references.findDeclaration(o);if(l){return this.getAstNodeHoverContent(l)}}}return void 0}}class JN extends YN{constructor(e){super(e);this.documentationProvider=e.documentation.DocumentationProvider}getAstNodeHoverContent(e){const n=this.documentationProvider.getDocumentation(e);if(n){return{contents:{kind:"markdown",value:n}}}return void 0}}var pr=Fe();const QN={[K.SemanticTokenTypes.class]:0,[K.SemanticTokenTypes.comment]:1,[K.SemanticTokenTypes.enum]:2,[K.SemanticTokenTypes.enumMember]:3,[K.SemanticTokenTypes.event]:4,[K.SemanticTokenTypes.function]:5,[K.SemanticTokenTypes.interface]:6,[K.SemanticTokenTypes.keyword]:7,[K.SemanticTokenTypes.macro]:8,[K.SemanticTokenTypes.method]:9,[K.SemanticTokenTypes.modifier]:10,[K.SemanticTokenTypes.namespace]:11,[K.SemanticTokenTypes.number]:12,[K.SemanticTokenTypes.operator]:13,[K.SemanticTokenTypes.parameter]:14,[K.SemanticTokenTypes.property]:15,[K.SemanticTokenTypes.regexp]:16,[K.SemanticTokenTypes.string]:17,[K.SemanticTokenTypes.struct]:18,[K.SemanticTokenTypes.type]:19,[K.SemanticTokenTypes.typeParameter]:20,[K.SemanticTokenTypes.variable]:21,[K.SemanticTokenTypes.decorator]:22};const ZN={[K.SemanticTokenModifiers.abstract]:1<<0,[K.SemanticTokenModifiers.async]:1<<1,[K.SemanticTokenModifiers.declaration]:1<<2,[K.SemanticTokenModifiers.defaultLibrary]:1<<3,[K.SemanticTokenModifiers.definition]:1<<4,[K.SemanticTokenModifiers.deprecated]:1<<5,[K.SemanticTokenModifiers.documentation]:1<<6,[K.SemanticTokenModifiers.modification]:1<<7,[K.SemanticTokenModifiers.readonly]:1<<8,[K.SemanticTokenModifiers.static]:1<<9};function ek(t){const e=[];const n=[];let r=true;let i=true;let s=true;for(const a of t){if(!a){continue}a.legend.tokenTypes.forEach((o,l)=>{const u=e[l];if(u&&u!==o){throw new Error(`Cannot merge '${u}' and '${o}' token types. They use the same index ${l}.`)}else{e[l]=o}});a.legend.tokenModifiers.forEach((o,l)=>{const u=n[l];if(u&&u!==o){throw new Error(`Cannot merge '${u}' and '${o}' token modifier. They use the same index ${l}.`)}else{n[l]=o}});if(!a.full){r=false}else if(typeof a.full==="object"&&!a.full.delta){i=false}if(!a.range){s=false}}return{legend:{tokenTypes:e,tokenModifiers:n},full:r&&{delta:i},range:s}}class tk extends K.SemanticTokensBuilder{constructor(){super(...arguments);this._tokens=[]}push(e,n,r,i,s){this._tokens.push({line:e,char:n,length:r,tokenType:i,tokenModifiers:s})}build(){this.applyTokens();return super.build()}buildEdits(){this.applyTokens();return super.buildEdits()}flush(){this.previousResult(this.id)}applyTokens(){for(const e of this._tokens.sort(this.compareTokens)){super.push(e.line,e.char,e.length,e.tokenType,e.tokenModifiers)}this._tokens=[]}compareTokens(e,n){if(e.line===n.line){return e.char-n.char}return e.line-n.line}}class nk{constructor(e){this.tokensBuilders=new Map;e.shared.workspace.TextDocuments.onDidClose(n=>{this.tokensBuilders.delete(n.document.uri)});e.shared.lsp.LanguageServer.onInitialize(n=>{var r;this.initialize((r=n.capabilities.textDocument)===null||r===void 0?void 0:r.semanticTokens)})}initialize(e){this.clientCapabilities=e}get tokenTypes(){return QN}get tokenModifiers(){return ZN}get semanticTokensOptions(){return{legend:{tokenTypes:Object.keys(this.tokenTypes),tokenModifiers:Object.keys(this.tokenModifiers)},full:{delta:true},range:true}}async semanticHighlight(e,n,r=he.CancellationToken.None){this.currentRange=void 0;this.currentDocument=e;this.currentTokensBuilder=this.getDocumentTokensBuilder(e);this.currentTokensBuilder.flush();await this.computeHighlighting(e,this.createAcceptor(),r);return this.currentTokensBuilder.build()}async semanticHighlightRange(e,n,r=he.CancellationToken.None){this.currentRange=n.range;this.currentDocument=e;this.currentTokensBuilder=this.getDocumentTokensBuilder(e);this.currentTokensBuilder.flush();await this.computeHighlighting(e,this.createAcceptor(),r);return this.currentTokensBuilder.build()}async semanticHighlightDelta(e,n,r=he.CancellationToken.None){this.currentRange=void 0;this.currentDocument=e;this.currentTokensBuilder=this.getDocumentTokensBuilder(e);this.currentTokensBuilder.previousResult(n.previousResultId);await this.computeHighlighting(e,this.createAcceptor(),r);return this.currentTokensBuilder.buildEdits()}createAcceptor(){const e=n=>{if("line"in n){this.highlightToken({range:{start:{line:n.line,character:n.char},end:{line:n.line,character:n.char+n.length}},type:n.type,modifier:n.modifier})}else if("range"in n){this.highlightToken(n)}else if("keyword"in n){this.highlightKeyword(n)}else if("property"in n){this.highlightProperty(n)}else{this.highlightNode({node:n.cst,type:n.type,modifier:n.modifier})}};return e}getDocumentTokensBuilder(e){const n=this.tokensBuilders.get(e.uri.toString());if(n){return n}const r=new tk;this.tokensBuilders.set(e.uri.toString(),r);return r}async computeHighlighting(e,n,r){const i=e.parseResult.value;const s=qn(i,{range:this.currentRange}).iterator();let a;do{a=s.next();if(!a.done){await ut(r);const o=a.value;if(this.highlightElement(o,n)==="prune"){s.prune()}}}while(!a.done)}highlightToken(e){var n;const{range:r,type:i}=e;let s=e.modifier;if(this.currentRange&&!hg(r,this.currentRange)||!this.currentDocument||!this.currentTokensBuilder){return}const a=this.tokenTypes[i];let o=0;if(s!==void 0){if(typeof s==="string"){s=[s]}for(const c of s){const d=this.tokenModifiers[c];o|=d}}const l=r.start.line;const u=r.end.line;if(l===u){const c=r.start.character;const d=r.end.character-c;this.currentTokensBuilder.push(l,c,d,a,o)}else if((n=this.clientCapabilities)===null||n===void 0?void 0:n.multilineTokenSupport){const c=r.start.character;const d=this.currentDocument.textDocument.offsetAt(r.start);const f=this.currentDocument.textDocument.offsetAt(r.end);this.currentTokensBuilder.push(l,c,f-d,a,o)}else{const c=r.start;let d=this.currentDocument.textDocument.offsetAt({line:l+1,character:0});this.currentTokensBuilder.push(c.line,c.character,d-c.character-1,a,o);for(let f=l+1;f<u;f++){const p=d;d=this.currentDocument.textDocument.offsetAt({line:f+1,character:0});this.currentTokensBuilder.push(f,0,d-p-1,a,o)}this.currentTokensBuilder.push(u,0,r.end.character,a,o)}}highlightProperty(e){const n=[];if(typeof e.index==="number"){const s=ap(e.node.$cstNode,e.property,e.index);if(s){n.push(s)}}else{n.push(...kg(e.node.$cstNode,e.property))}const{type:r,modifier:i}=e;for(const s of n){this.highlightNode({node:s,type:r,modifier:i})}}highlightKeyword(e){const{node:n,keyword:r,type:i,index:s,modifier:a}=e;const o=[];if(typeof s==="number"){const l=Pg(n.$cstNode,r,s);if(l){o.push(l)}}else{o.push(...HR(n.$cstNode,r))}for(const l of o){this.highlightNode({node:l,type:i,modifier:a})}}highlightNode(e){const{node:n,type:r,modifier:i}=e;const s=n.range;this.highlightToken({range:s,type:r,modifier:i})}}var xy;(function(t){function e(r,i,s){const a=new Map;Object.entries(i).forEach(([u,c])=>a.set(c,u));let o=0;let l=0;return n(r.data,5).map(u=>{o+=u[0];if(u[0]!==0){l=0}l+=u[1];const c=u[2];const d=s.textDocument.offsetAt({line:o,character:l});return{offset:d,tokenType:a.get(u[3]),tokenModifiers:u[4],text:s.textDocument.getText({start:{line:o,character:l},end:{line:o,character:l+c}})}})}t.decode=e;function n(r,i){const s=[];for(let a=0;a<r.length;a+=i){const o=r.slice(a,a+i);s.push(o)}return s}})(xy||(xy={}));function rk(t){const e=[];const n=[];t.forEach(i=>{if(i===null||i===void 0?void 0:i.triggerCharacters){e.push(...i.triggerCharacters)}if(i===null||i===void 0?void 0:i.retriggerCharacters){n.push(...i.retriggerCharacters)}});const r={triggerCharacters:e.length>0?Array.from(new Set(e)).sort():void 0,retriggerCharacters:n.length>0?Array.from(new Set(n)).sort():void 0};return r.triggerCharacters?r:void 0}class ik{constructor(e){this.onInitializeEmitter=new pr.Emitter;this.onInitializedEmitter=new pr.Emitter;this.services=e}get onInitialize(){return this.onInitializeEmitter.event}get onInitialized(){return this.onInitializedEmitter.event}async initialize(e){this.eagerLoadServices();this.fireInitializeOnDefaultServices(e);this.onInitializeEmitter.fire(e);this.onInitializeEmitter.dispose();return this.buildInitializeResult(e)}eagerLoadServices(){ep(this.services);this.services.ServiceRegistry.all.forEach(e=>ep(e))}hasService(e){const n=this.services.ServiceRegistry.all;return n.some(r=>e(r)!==void 0)}buildInitializeResult(e){var n,r,i,s;const a=this.services.lsp.DocumentUpdateHandler;const o=(n=this.services.lsp.FileOperationHandler)===null||n===void 0?void 0:n.fileOperationOptions;const l=this.services.ServiceRegistry.all;const u=this.hasService(F=>{var S;return(S=F.lsp)===null||S===void 0?void 0:S.Formatter});const c=l.map(F=>{var S,ne;return(ne=(S=F.lsp)===null||S===void 0?void 0:S.Formatter)===null||ne===void 0?void 0:ne.formatOnTypeOptions}).find(F=>Boolean(F));const d=this.hasService(F=>{var S;return(S=F.lsp)===null||S===void 0?void 0:S.CodeActionProvider});const f=this.hasService(F=>{var S;return(S=F.lsp)===null||S===void 0?void 0:S.SemanticTokenProvider});const p=ek(l.map(F=>{var S,ne;return(ne=(S=F.lsp)===null||S===void 0?void 0:S.SemanticTokenProvider)===null||ne===void 0?void 0:ne.semanticTokensOptions}));const y=(i=(r=this.services.lsp)===null||r===void 0?void 0:r.ExecuteCommandHandler)===null||i===void 0?void 0:i.commands;const R=this.hasService(F=>{var S;return(S=F.lsp)===null||S===void 0?void 0:S.DocumentLinkProvider});const A=rk(l.map(F=>{var S,ne;return(ne=(S=F.lsp)===null||S===void 0?void 0:S.SignatureHelp)===null||ne===void 0?void 0:ne.signatureHelpOptions}));const v=this.hasService(F=>{var S;return(S=F.lsp)===null||S===void 0?void 0:S.TypeProvider});const $=this.hasService(F=>{var S;return(S=F.lsp)===null||S===void 0?void 0:S.ImplementationProvider});const C=this.hasService(F=>{var S;return(S=F.lsp)===null||S===void 0?void 0:S.CompletionProvider});const O=WN(l.map(F=>{var S,ne;return(ne=(S=F.lsp)===null||S===void 0?void 0:S.CompletionProvider)===null||ne===void 0?void 0:ne.completionOptions}));const Y=this.hasService(F=>{var S;return(S=F.lsp)===null||S===void 0?void 0:S.ReferencesProvider});const G=this.hasService(F=>{var S;return(S=F.lsp)===null||S===void 0?void 0:S.DocumentSymbolProvider});const J=this.hasService(F=>{var S;return(S=F.lsp)===null||S===void 0?void 0:S.DefinitionProvider});const te=this.hasService(F=>{var S;return(S=F.lsp)===null||S===void 0?void 0:S.DocumentHighlightProvider});const ie=this.hasService(F=>{var S;return(S=F.lsp)===null||S===void 0?void 0:S.FoldingRangeProvider});const ce=this.hasService(F=>{var S;return(S=F.lsp)===null||S===void 0?void 0:S.HoverProvider});const _=this.hasService(F=>{var S;return(S=F.lsp)===null||S===void 0?void 0:S.RenameProvider});const T=this.hasService(F=>{var S;return(S=F.lsp)===null||S===void 0?void 0:S.CallHierarchyProvider});const g=this.hasService(F=>{var S;return(S=F.lsp)===null||S===void 0?void 0:S.TypeHierarchyProvider});const M=this.hasService(F=>{var S;return(S=F.lsp)===null||S===void 0?void 0:S.CodeLensProvider});const L=this.hasService(F=>{var S;return(S=F.lsp)===null||S===void 0?void 0:S.DeclarationProvider});const D=this.hasService(F=>{var S;return(S=F.lsp)===null||S===void 0?void 0:S.InlayHintProvider});const B=(s=this.services.lsp)===null||s===void 0?void 0:s.WorkspaceSymbolProvider;const $e={capabilities:{workspace:{workspaceFolders:{supported:true},fileOperations:o},executeCommandProvider:y&&{commands:y},textDocumentSync:{change:pr.TextDocumentSyncKind.Incremental,openClose:true,save:Boolean(a.didSaveDocument),willSave:Boolean(a.willSaveDocument),willSaveWaitUntil:Boolean(a.willSaveDocumentWaitUntil)},completionProvider:C?O:void 0,referencesProvider:Y,documentSymbolProvider:G,definitionProvider:J,typeDefinitionProvider:v,documentHighlightProvider:te,codeActionProvider:d,documentFormattingProvider:u,documentRangeFormattingProvider:u,documentOnTypeFormattingProvider:c,foldingRangeProvider:ie,hoverProvider:ce,renameProvider:_?{prepareProvider:true}:void 0,semanticTokensProvider:f?p:void 0,signatureHelpProvider:A,implementationProvider:$,callHierarchyProvider:T?{}:void 0,typeHierarchyProvider:g?{}:void 0,documentLinkProvider:R?{resolveProvider:false}:void 0,codeLensProvider:M?{resolveProvider:false}:void 0,declarationProvider:L,inlayHintProvider:D?{resolveProvider:false}:void 0,workspaceSymbolProvider:B?{resolveProvider:Boolean(B.resolveSymbol)}:void 0}};return $e}initialized(e){this.fireInitializedOnDefaultServices(e);this.onInitializedEmitter.fire(e);this.onInitializedEmitter.dispose()}fireInitializeOnDefaultServices(e){this.services.workspace.ConfigurationProvider.initialize(e);this.services.workspace.WorkspaceManager.initialize(e)}fireInitializedOnDefaultServices(e){const n=this.services.lsp.Connection;const r=n?Object.assign(Object.assign({},e),{register:i=>n.client.register(pr.DidChangeConfigurationNotification.type,i),fetchConfiguration:i=>n.workspace.getConfiguration(i)}):e;this.services.workspace.ConfigurationProvider.initialized(r).catch(i=>console.error("Error in ConfigurationProvider initialization:",i));this.services.workspace.WorkspaceManager.initialized(e).catch(i=>console.error("Error in WorkspaceManager initialization:",i))}}function sk(t){const e=t.lsp.Connection;if(!e){throw new Error("Starting a language server requires the languageServer.Connection service to be set.")}ak(e,t);ok(e,t);lk(e,t);uk(e,t);ck(e,t);fk(e,t);pk(e,t);mk(e,t);hk(e,t);gk(e,t);vk(e,t);Rk(e,t);dk(e,t);Ek(e,t);Ik(e,t);$k(e,t);Tk(e,t);wk(e,t);Ak(e,t);Nk(e,t);kk(e,t);Mk(e,t);bk(e,t);Ck(e,t);yk(e,t);Sk(e,t);e.onInitialize(r=>{return t.lsp.LanguageServer.initialize(r)});e.onInitialized(r=>{t.lsp.LanguageServer.initialized(r)});const n=t.workspace.TextDocuments;n.listen(e);e.listen()}function ak(t,e){const n=e.lsp.DocumentUpdateHandler;const r=e.workspace.TextDocuments;if(n.didOpenDocument){r.onDidOpen(i=>n.didOpenDocument(i))}if(n.didChangeContent){r.onDidChangeContent(i=>n.didChangeContent(i))}if(n.didCloseDocument){r.onDidClose(i=>n.didCloseDocument(i))}if(n.didSaveDocument){r.onDidSave(i=>n.didSaveDocument(i))}if(n.willSaveDocument){r.onWillSave(i=>n.willSaveDocument(i))}if(n.willSaveDocumentWaitUntil){r.onWillSaveWaitUntil(i=>n.willSaveDocumentWaitUntil(i))}if(n.didChangeWatchedFiles){t.onDidChangeWatchedFiles(i=>n.didChangeWatchedFiles(i))}}function ok(t,e){const n=e.lsp.FileOperationHandler;if(!n){return}if(n.didCreateFiles){t.workspace.onDidCreateFiles(r=>n.didCreateFiles(r))}if(n.didRenameFiles){t.workspace.onDidRenameFiles(r=>n.didRenameFiles(r))}if(n.didDeleteFiles){t.workspace.onDidDeleteFiles(r=>n.didDeleteFiles(r))}if(n.willCreateFiles){t.workspace.onWillCreateFiles(r=>n.willCreateFiles(r))}if(n.willRenameFiles){t.workspace.onWillRenameFiles(r=>n.willRenameFiles(r))}if(n.willDeleteFiles){t.workspace.onWillDeleteFiles(r=>n.willDeleteFiles(r))}}function lk(t,e){const n=e.workspace.DocumentBuilder;n.onUpdate(async(r,i)=>{for(const s of i){t.sendDiagnostics({uri:s.toString(),diagnostics:[]})}});n.onDocumentPhase(z.Validated,async r=>{if(r.diagnostics){t.sendDiagnostics({uri:r.uri.toString(),diagnostics:r.diagnostics})}})}function uk(t,e){t.onCompletion(rt((n,r,i,s)=>{var a,o;return(o=(a=n.lsp)===null||a===void 0?void 0:a.CompletionProvider)===null||o===void 0?void 0:o.getCompletion(r,i,s)},e,z.IndexedReferences))}function ck(t,e){t.onReferences(rt((n,r,i,s)=>{var a,o;return(o=(a=n.lsp)===null||a===void 0?void 0:a.ReferencesProvider)===null||o===void 0?void 0:o.findReferences(r,i,s)},e,z.IndexedReferences))}function dk(t,e){t.onCodeAction(rt((n,r,i,s)=>{var a,o;return(o=(a=n.lsp)===null||a===void 0?void 0:a.CodeActionProvider)===null||o===void 0?void 0:o.getCodeActions(r,i,s)},e,z.Validated))}function fk(t,e){t.onDocumentSymbol(rt((n,r,i,s)=>{var a,o;return(o=(a=n.lsp)===null||a===void 0?void 0:a.DocumentSymbolProvider)===null||o===void 0?void 0:o.getSymbols(r,i,s)},e,z.Parsed))}function pk(t,e){t.onDefinition(rt((n,r,i,s)=>{var a,o;return(o=(a=n.lsp)===null||a===void 0?void 0:a.DefinitionProvider)===null||o===void 0?void 0:o.getDefinition(r,i,s)},e,z.IndexedReferences))}function mk(t,e){t.onTypeDefinition(rt((n,r,i,s)=>{var a,o;return(o=(a=n.lsp)===null||a===void 0?void 0:a.TypeProvider)===null||o===void 0?void 0:o.getTypeDefinition(r,i,s)},e,z.IndexedReferences))}function hk(t,e){t.onImplementation(rt((n,r,i,s)=>{var a,o;return(o=(a=n.lsp)===null||a===void 0?void 0:a.ImplementationProvider)===null||o===void 0?void 0:o.getImplementation(r,i,s)},e,z.IndexedReferences))}function yk(t,e){t.onDeclaration(rt((n,r,i,s)=>{var a,o;return(o=(a=n.lsp)===null||a===void 0?void 0:a.DeclarationProvider)===null||o===void 0?void 0:o.getDeclaration(r,i,s)},e,z.IndexedReferences))}function gk(t,e){t.onDocumentHighlight(rt((n,r,i,s)=>{var a,o;return(o=(a=n.lsp)===null||a===void 0?void 0:a.DocumentHighlightProvider)===null||o===void 0?void 0:o.getDocumentHighlight(r,i,s)},e,z.IndexedReferences))}function Ik(t,e){t.onHover(rt((n,r,i,s)=>{var a,o;return(o=(a=n.lsp)===null||a===void 0?void 0:a.HoverProvider)===null||o===void 0?void 0:o.getHoverContent(r,i,s)},e,z.IndexedReferences))}function vk(t,e){t.onFoldingRanges(rt((n,r,i,s)=>{var a,o;return(o=(a=n.lsp)===null||a===void 0?void 0:a.FoldingRangeProvider)===null||o===void 0?void 0:o.getFoldingRanges(r,i,s)},e,z.Parsed))}function Rk(t,e){t.onDocumentFormatting(rt((n,r,i,s)=>{var a,o;return(o=(a=n.lsp)===null||a===void 0?void 0:a.Formatter)===null||o===void 0?void 0:o.formatDocument(r,i,s)},e,z.Parsed));t.onDocumentRangeFormatting(rt((n,r,i,s)=>{var a,o;return(o=(a=n.lsp)===null||a===void 0?void 0:a.Formatter)===null||o===void 0?void 0:o.formatDocumentRange(r,i,s)},e,z.Parsed));t.onDocumentOnTypeFormatting(rt((n,r,i,s)=>{var a,o;return(o=(a=n.lsp)===null||a===void 0?void 0:a.Formatter)===null||o===void 0?void 0:o.formatDocumentOnType(r,i,s)},e,z.Parsed))}function Ek(t,e){t.onRenameRequest(rt((n,r,i,s)=>{var a,o;return(o=(a=n.lsp)===null||a===void 0?void 0:a.RenameProvider)===null||o===void 0?void 0:o.rename(r,i,s)},e,z.IndexedReferences));t.onPrepareRename(rt((n,r,i,s)=>{var a,o;return(o=(a=n.lsp)===null||a===void 0?void 0:a.RenameProvider)===null||o===void 0?void 0:o.prepareRename(r,i,s)},e,z.IndexedReferences))}function $k(t,e){t.languages.inlayHint.on(kn((n,r,i,s)=>{var a,o;return(o=(a=n.lsp)===null||a===void 0?void 0:a.InlayHintProvider)===null||o===void 0?void 0:o.getInlayHints(r,i,s)},e,z.IndexedReferences))}function Tk(t,e){const n={data:[]};t.languages.semanticTokens.on(kn((r,i,s,a)=>{var o;if((o=r.lsp)===null||o===void 0?void 0:o.SemanticTokenProvider){return r.lsp.SemanticTokenProvider.semanticHighlight(i,s,a)}return n},e,z.IndexedReferences));t.languages.semanticTokens.onDelta(kn((r,i,s,a)=>{var o;if((o=r.lsp)===null||o===void 0?void 0:o.SemanticTokenProvider){return r.lsp.SemanticTokenProvider.semanticHighlightDelta(i,s,a)}return n},e,z.IndexedReferences));t.languages.semanticTokens.onRange(kn((r,i,s,a)=>{var o;if((o=r.lsp)===null||o===void 0?void 0:o.SemanticTokenProvider){return r.lsp.SemanticTokenProvider.semanticHighlightRange(i,s,a)}return n},e,z.IndexedReferences))}function Ck(t,e){t.onDidChangeConfiguration(n=>{if(n.settings){e.workspace.ConfigurationProvider.updateConfiguration(n)}})}function wk(t,e){const n=e.lsp.ExecuteCommandHandler;if(n){t.onExecuteCommand(async(r,i)=>{var s;try{return await n.executeCommand(r.command,(s=r.arguments)!==null&&s!==void 0?s:[],i)}catch(a){return Bn(a)}})}}function bk(t,e){t.onDocumentLinks(kn((n,r,i,s)=>{var a,o;return(o=(a=n.lsp)===null||a===void 0?void 0:a.DocumentLinkProvider)===null||o===void 0?void 0:o.getDocumentLinks(r,i,s)},e,z.Parsed))}function Ak(t,e){t.onSignatureHelp(kn((n,r,i,s)=>{var a,o;return(o=(a=n.lsp)===null||a===void 0?void 0:a.SignatureHelp)===null||o===void 0?void 0:o.provideSignatureHelp(r,i,s)},e,z.IndexedReferences))}function Mk(t,e){t.onCodeLens(kn((n,r,i,s)=>{var a,o;return(o=(a=n.lsp)===null||a===void 0?void 0:a.CodeLensProvider)===null||o===void 0?void 0:o.provideCodeLens(r,i,s)},e,z.IndexedReferences))}function Sk(t,e){var n;const r=e.lsp.WorkspaceSymbolProvider;if(r){const i=e.workspace.DocumentBuilder;t.onWorkspaceSymbol(async(a,o)=>{try{await i.waitUntil(z.IndexedContent,o);return await r.getSymbols(a,o)}catch(l){return Bn(l)}});const s=(n=r.resolveSymbol)===null||n===void 0?void 0:n.bind(r);if(s){t.onWorkspaceSymbolResolve(async(a,o)=>{try{await i.waitUntil(z.IndexedContent,o);return await s(a,o)}catch(l){return Bn(l)}})}}}function Nk(t,e){t.languages.callHierarchy.onPrepare(kn(async(n,r,i,s)=>{var a;if((a=n.lsp)===null||a===void 0?void 0:a.CallHierarchyProvider){const o=await n.lsp.CallHierarchyProvider.prepareCallHierarchy(r,i,s);return o!==null&&o!==void 0?o:null}return null},e,z.IndexedReferences));t.languages.callHierarchy.onIncomingCalls(Ou(async(n,r,i)=>{var s;if((s=n.lsp)===null||s===void 0?void 0:s.CallHierarchyProvider){const a=await n.lsp.CallHierarchyProvider.incomingCalls(r,i);return a!==null&&a!==void 0?a:null}return null},e));t.languages.callHierarchy.onOutgoingCalls(Ou(async(n,r,i)=>{var s;if((s=n.lsp)===null||s===void 0?void 0:s.CallHierarchyProvider){const a=await n.lsp.CallHierarchyProvider.outgoingCalls(r,i);return a!==null&&a!==void 0?a:null}return null},e))}function kk(t,e){if(!e.ServiceRegistry.all.some(n=>{var r;return(r=n.lsp)===null||r===void 0?void 0:r.TypeHierarchyProvider})){return}t.languages.typeHierarchy.onPrepare(kn(async(n,r,i,s)=>{var a,o;const l=await((o=(a=n.lsp)===null||a===void 0?void 0:a.TypeHierarchyProvider)===null||o===void 0?void 0:o.prepareTypeHierarchy(r,i,s));return l!==null&&l!==void 0?l:null},e,z.IndexedReferences));t.languages.typeHierarchy.onSupertypes(Ou(async(n,r,i)=>{var s,a;const o=await((a=(s=n.lsp)===null||s===void 0?void 0:s.TypeHierarchyProvider)===null||a===void 0?void 0:a.supertypes(r,i));return o!==null&&o!==void 0?o:null},e));t.languages.typeHierarchy.onSubtypes(Ou(async(n,r,i)=>{var s,a;const o=await((a=(s=n.lsp)===null||s===void 0?void 0:s.TypeHierarchyProvider)===null||a===void 0?void 0:a.subtypes(r,i));return o!==null&&o!==void 0?o:null},e))}function Ou(t,e){const n=e.ServiceRegistry;return async(r,i)=>{const s=dt.parse(r.item.uri);const a=await jp(e,i,s,z.IndexedReferences);if(a){return a}if(!n.hasServices(s)){const l=`Could not find service instance for uri: '${s}'`;console.debug(l);return Bn(new Error(l))}const o=n.getServices(s);try{return await t(o,r,i)}catch(l){return Bn(l)}}}function kn(t,e,n){const r=e.workspace.LangiumDocuments;const i=e.ServiceRegistry;return async(s,a)=>{const o=dt.parse(s.textDocument.uri);const l=await jp(e,a,o,n);if(l){return l}if(!i.hasServices(o)){const c=`Could not find service instance for uri: '${o}'`;console.debug(c);return Bn(new Error(c))}const u=i.getServices(o);try{const c=await r.getOrCreateDocument(o);return await t(u,c,s,a)}catch(c){return Bn(c)}}}function rt(t,e,n){const r=e.workspace.LangiumDocuments;const i=e.ServiceRegistry;return async(s,a)=>{const o=dt.parse(s.textDocument.uri);const l=await jp(e,a,o,n);if(l){return l}if(!i.hasServices(o)){console.debug(`Could not find service instance for uri: '${o.toString()}'`);return null}const u=i.getServices(o);try{const c=await r.getOrCreateDocument(o);return await t(u,c,s,a)}catch(c){return Bn(c)}}}async function jp(t,e,n,r){if(r!==void 0){const i=t.workspace.DocumentBuilder;try{await i.waitUntil(r,n,e)}catch(s){return Bn(s)}}return void 0}function Bn(t){if(aa(t)){return new pr.ResponseError(pr.LSPErrorCodes.RequestCancelled,"The request has been cancelled.")}if(t instanceof pr.ResponseError){return t}throw t}class rR{getSymbolKind(e){return K.SymbolKind.Field}getCompletionItemKind(e){return K.CompletionItemKind.Reference}}class Pk{constructor(e){this.nameProvider=e.references.NameProvider;this.references=e.references.References;this.grammarConfig=e.parser.GrammarConfig}findReferences(e,n,r){const i=e.parseResult.value.$cstNode;if(!i){return[]}const s=yr(i,e.textDocument.offsetAt(n.position),this.grammarConfig.nameRegexp);if(!s){return[]}return this.getReferences(s,n,e)}getReferences(e,n,r){const i=[];const s=this.references.findDeclaration(e);if(s){const a={includeDeclaration:n.context.includeDeclaration};this.references.findReferences(s,a).forEach(o=>{i.push(K.Location.create(o.sourceUri.toString(),o.segment.range))})}return i}}class Dk{constructor(e){this.references=e.references.References;this.nameProvider=e.references.NameProvider;this.grammarConfig=e.parser.GrammarConfig}async rename(e,n,r){const i={};const s=e.parseResult.value.$cstNode;if(!s)return void 0;const a=e.textDocument.offsetAt(n.position);const o=yr(s,a,this.grammarConfig.nameRegexp);if(!o)return void 0;const l=this.references.findDeclaration(o);if(!l)return void 0;const u={onlyLocal:false,includeDeclaration:true};const c=this.references.findReferences(l,u);c.forEach(d=>{const f=jt.replace(d.segment.range,n.newName);const p=d.sourceUri.toString();if(i[p]){i[p].push(f)}else{i[p]=[f]}});return{changes:i}}prepareRename(e,n,r){return this.renameNodeRange(e,n.position)}renameNodeRange(e,n){const r=e.parseResult.value.$cstNode;const i=e.textDocument.offsetAt(n);if(r&&i){const s=yr(r,i,this.grammarConfig.nameRegexp);if(!s){return void 0}const a=this.references.findDeclaration(s);if(a||this.isNameNode(s)){return s.range}}return void 0}isNameNode(e){return(e===null||e===void 0?void 0:e.astNode)&&Rv(e.astNode)&&e===this.nameProvider.getNameNode(e.astNode)}}class Ok{constructor(e){this.indexManager=e.workspace.IndexManager;this.nodeKindProvider=e.lsp.NodeKindProvider;this.fuzzyMatcher=e.lsp.FuzzyMatcher}async getSymbols(e,n=he.CancellationToken.None){const r=[];const i=e.query.toLowerCase();for(const s of this.indexManager.allElements()){await ut(n);if(this.fuzzyMatcher.match(i,s.name)){const a=this.getWorkspaceSymbol(s);if(a){r.push(a)}}}return r}getWorkspaceSymbol(e){const n=e.nameSegment;if(n){return{kind:this.nodeKindProvider.getSymbolKind(e),name:e.name,location:{range:n.range,uri:e.documentUri.toString()}}}else{return void 0}}}class _k{constructor(e){this._configuration=e;this._syncedDocuments=new Map;this._onDidChangeContent=new K.Emitter;this._onDidOpen=new K.Emitter;this._onDidClose=new K.Emitter;this._onDidSave=new K.Emitter;this._onWillSave=new K.Emitter}get onDidOpen(){return this._onDidOpen.event}get onDidChangeContent(){return this._onDidChangeContent.event}get onWillSave(){return this._onWillSave.event}onWillSaveWaitUntil(e){this._willSaveWaitUntil=e}get onDidSave(){return this._onDidSave.event}get onDidClose(){return this._onDidClose.event}get(e){return this._syncedDocuments.get(Ke.normalize(e))}set(e){const n=Ke.normalize(e.uri);let r=true;if(this._syncedDocuments.has(n)){r=false}this._syncedDocuments.set(n,e);const i=Object.freeze({document:e});this._onDidOpen.fire(i);this._onDidChangeContent.fire(i);return r}delete(e){const n=Ke.normalize(typeof e==="object"&&"uri"in e?e.uri:e);const r=this._syncedDocuments.get(n);if(r!==void 0){this._syncedDocuments.delete(n);this._onDidClose.fire(Object.freeze({document:r}))}}all(){return Array.from(this._syncedDocuments.values())}keys(){return Array.from(this._syncedDocuments.keys())}listen(e){e.__textDocumentSync=K.TextDocumentSyncKind.Incremental;const n=[];n.push(e.onDidOpenTextDocument(r=>{const i=r.textDocument;const s=Ke.normalize(i.uri);const a=this._configuration.create(s,i.languageId,i.version,i.text);this._syncedDocuments.set(s,a);const o=Object.freeze({document:a});this._onDidOpen.fire(o);this._onDidChangeContent.fire(o)}));n.push(e.onDidChangeTextDocument(r=>{const i=r.textDocument;const s=r.contentChanges;if(s.length===0){return}const{version:a}=i;if(a===null||a===void 0){throw new Error(`Received document change event for ${i.uri} without valid version identifier`)}const o=Ke.normalize(i.uri);let l=this._syncedDocuments.get(o);if(l!==void 0){l=this._configuration.update(l,s,a);this._syncedDocuments.set(o,l);this._onDidChangeContent.fire(Object.freeze({document:l}))}}));n.push(e.onDidCloseTextDocument(r=>{const i=Ke.normalize(r.textDocument.uri);const s=this._syncedDocuments.get(i);if(s!==void 0){this._syncedDocuments.delete(i);this._onDidClose.fire(Object.freeze({document:s}))}}));n.push(e.onWillSaveTextDocument(r=>{const i=this._syncedDocuments.get(Ke.normalize(r.textDocument.uri));if(i!==void 0){this._onWillSave.fire(Object.freeze({document:i,reason:r.reason}))}}));n.push(e.onWillSaveTextDocumentWaitUntil((r,i)=>{const s=this._syncedDocuments.get(Ke.normalize(r.textDocument.uri));if(s!==void 0&&this._willSaveWaitUntil){return this._willSaveWaitUntil(Object.freeze({document:s,reason:r.reason}),i)}else{return[]}}));n.push(e.onDidSaveTextDocument(r=>{const i=this._syncedDocuments.get(Ke.normalize(r.textDocument.uri));if(i!==void 0){this._onDidSave.fire(Object.freeze({document:i}))}}));return K.Disposable.create(()=>{n.forEach(r=>r.dispose())})}}function Bk(t){return ku.merge(Fv(t),Lk(t))}function Lk(t){return{lsp:{CompletionProvider:e=>new tR(e),DocumentSymbolProvider:e=>new qN(e),HoverProvider:e=>new JN(e),FoldingRangeProvider:e=>new jN(e),ReferencesProvider:e=>new Pk(e),DefinitionProvider:e=>new GN(e),DocumentHighlightProvider:e=>new HN(e),RenameProvider:e=>new Dk(e)},shared:()=>t.shared}}function xk(t){return ku.merge(Kv(t),Fk(t))}function Fk(t){return{lsp:{Connection:()=>t.connection,LanguageServer:e=>new ik(e),DocumentUpdateHandler:e=>new nR(e),WorkspaceSymbolProvider:e=>new Ok(e),NodeKindProvider:()=>new rR,FuzzyMatcher:()=>new VN},workspace:{TextDocuments:()=>new _k(Mu)}}}var kc;var Fy;function Kk(){if(Fy)return kc;Fy=1;kc=Qv();return kc}var Vp=Kk();const Pc="AllocateAttribute";const Ky="Condition";const Uy="ConstantExpression";const Wy="DataSpecificationDataListEntry";const Dc="DeclarationAttribute";const Oc="Directives";const _c="DoType2";const Gy="EntryDescription";const Bc="Expression";const Hy="FormatItem";const Lc="GetStatement";const xc="InitialAttributeItem";const Fc="InitialAttributeSpecificationIteration";const ys="NamedElement";function qy(t){return De.isInstance(t,ys)}const Kc="NamedType";const jy="OptionsItem";const Uc="OrdinalType";const Pr="PackageLevelStatements";const Wc="ProcedureLevelStatement";const Gc="PutStatement";const Vy="TopLevelStatement";const Dr="Unit";const Ua="AddExpression";const Wa="AFormatItem";const Ga="AllocateDimension";const Hc="AllocatedVariable";const Ha="AllocateLocationReference";const qa="AllocateStatement";const ja="AllocateType";const Va="AssertStatement";const za="AssignmentStatement";const Xa="AttachStatement";const Ya="BeginStatement";const Ja="BFormatItem";const Qa="BitAndExpression";const Za="BitOrExpression";const qc="Bound";const eo="CallStatement";const to="CancelThreadStatement";const no="CFormatItem";const ro="CloseStatement";const io="CMPATOptionsItem";const so="ColumnFormatItem";const ao="CompExpression";const jc="CompilerOptions";const gs="ComputationDataAttribute";function Uk(t){return De.isInstance(t,gs)}const oo="ConcatExpression";const Vc="ConditionPrefix";const zc="ConditionPrefixItem";const Xc="DataSpecificationDataList";const lo="DataSpecificationDataListItem";const uo="DataSpecificationDataListItem3DO";const Yc="DataSpecificationOptions";const co="DateAttribute";const Jc="DeclaredItem";const Is="DeclaredVariable";function zr(t){return De.isInstance(t,Is)}const vs="DeclareStatement";function Wk(t){return De.isInstance(t,vs)}const Qc="DefaultAttributeExpression";const Zc="DefaultAttributeExpressionNot";const ed="DefaultExpression";const td="DefaultExpressionPart";const nd="DefaultRangeIdentifierItem";const rd="DefaultRangeIdentifiers";const fo="DefaultStatement";const Rs="DefineAliasStatement";function Gk(t){return De.isInstance(t,Rs)}const po="DefinedAttribute";const mo="DefineOrdinalStatement";const ho="DefineStructureStatement";const yo="DelayStatement";const go="DeleteStatement";const Io="DetachStatement";const id="DimensionBound";const sd="Dimensions";const vo="DimensionsDataAttribute";const Ro="DisplayStatement";const ad="DoSpecification";const Li="DoStatement";const Es="DoType3Variable";function iR(t){return De.isInstance(t,Es)}const Eo="DoUntil";const $o="DoWhile";const To="EFormatItem";const jl="EndStatement";function Hk(t){return De.isInstance(t,jl)}const $s="EntryAttribute";function qk(t){return De.isInstance(t,$s)}const Co="EntryParameterDescription";const wo="EntryStatement";const bo="EntryUnionDescription";const Ao="EnvironmentAttribute";const od="EnvironmentAttributeItem";const Mo="ExecStatement";const zy="ExitStatement";const So="ExpExpression";const ld="Exports";const ud="FetchEntry";const No="FetchStatement";const ko="FFormatItem";const Po="FileReferenceCondition";const Do="FlushStatement";const cd="FormatList";const dd="FormatListItem";const fd="FormatListItemLevel";const Oo="FormatStatement";const _o="FreeStatement";const Bo="GetFileStatement";const Lo="GetStringStatement";const xo="GFormatItem";const Fo="GoToStatement";const Ko="HandleAttribute";const Uo="IfStatement";const Ts="IncludeDirective";function jk(t){return De.isInstance(t,Ts)}const pd="IncludeItem";const md="InitAcrossExpression";const Wo="InitialAttribute";const Go="InitialAttributeExpression";const Xy="InitialAttributeItemStar";const Ho="InitialAttributeSpecification";const qo="InitialAttributeSpecificationIterationValue";const hd="InitialToContent";const jo="IterateStatement";const Vo="KeywordCondition";const Cs="LabelPrefix";function Hs(t){return De.isInstance(t,Cs)}const Vl="LabelReference";function Vk(t){return De.isInstance(t,Vl)}const zo="LeaveStatement";const Yy="LFormatItem";const Xo="LikeAttribute";const Yo="LineDirective";const Jo="LineFormatItem";const Qo="LinkageOptionsItem";const ws="Literal";function zk(t){return De.isInstance(t,ws)}const Zo="LocateStatement";const el="LocatorCall";const zl="MemberCall";function Xk(t){return De.isInstance(t,zl)}const tl="MultExpression";const nl="NamedCondition";const rl="NoMapOptionsItem";const Jy="NoPrintDirective";const il="NoteDirective";const Qy="NullStatement";const Xl="NumberLiteral";function Yk(t){return De.isInstance(t,Xl)}const sl="OnStatement";const yd="OpenOptionsGroup";const al="OpenStatement";const gd="Options";const ol="OrdinalTypeAttribute";const Id="OrdinalValue";const vd="OrdinalValueList";const Rd="OtherwiseStatement";const bs="Package";function Zy(t){return De.isInstance(t,bs)}const eg="PageDirective";const tg="PageFormatItem";const ll="PFormatItem";const ul="PictureAttribute";const Ed="PliProgram";const ng="PopDirective";const $d="PrefixedAttribute";const rg="PrintDirective";const Yl="ProcedureCall";function Jk(t){return De.isInstance(t,Yl)}const Jl="ProcedureParameter";function Qk(t){return De.isInstance(t,Jl)}const _r="ProcedureStatement";function rn(t){return De.isInstance(t,_r)}const cl="ProcessDirective";const dl="ProcincDirective";const ig="PushDirective";const fl="PutFileStatement";const Td="PutItem";const pl="PutStringStatement";const ml="QualifyStatement";const hl="ReadStatement";const Ql="ReferenceItem";function Zk(t){return De.isInstance(t,Ql)}const yl="ReinitStatement";const gl="ReleaseStatement";const Cd="Reserves";const sg="ResignalStatement";const Il="ReturnsAttribute";const wd="ReturnsOption";const vl="ReturnStatement";const Rl="RevertStatement";const El="RewriteStatement";const $l="RFormatItem";const Tl="SelectStatement";const Cl="SignalStatement";const As="SimpleOptionsItem";function eP(t){return De.isInstance(t,As)}const wl="SkipDirective";const bl="SkipFormatItem";const Ms="Statement";function tP(t){return De.isInstance(t,Ms)}const ag="StopStatement";const Zl="StringLiteral";function nP(t){return De.isInstance(t,Zl)}const bd="SubStructure";const Al="TypeAttribute";const Ml="UnaryExpression";const Sl="ValueAttribute";const Ad="ValueAttributeItem";const Nl="ValueListAttribute";const kl="ValueListFromAttribute";const Pl="ValueRangeAttribute";const og="VFormatItem";const Dl="WaitStatement";const Md="WhenStatement";const Ol="WriteStatement";const _l="XFormatItem";const Bl="DoType3";class sR extends fg{getAllTypes(){return[Wa,Ua,Pc,Ga,Ha,qa,ja,Hc,Va,za,Xa,Ja,Ya,Qa,Za,qc,no,io,eo,to,ro,so,ao,jc,gs,oo,Ky,Vc,zc,Uy,Xc,Wy,lo,uo,Yc,co,Dc,vs,Jc,Is,Qc,Zc,ed,td,nd,rd,fo,Rs,mo,ho,po,yo,go,Io,id,sd,vo,Oc,Ro,ad,Li,_c,Bl,Es,Eo,$o,To,jl,$s,Gy,Co,wo,bo,Ao,od,Mo,zy,So,ld,Bc,ko,ud,No,Po,Do,Hy,cd,dd,fd,Oo,_o,xo,Bo,Lc,Lo,Fo,Ko,Uo,Ts,pd,md,Wo,Go,xc,Xy,Ho,Fc,qo,hd,jo,Vo,Yy,Cs,Vl,zo,Xo,Yo,Jo,Qo,ws,Zo,el,zl,tl,nl,ys,Kc,rl,Jy,il,Qy,Xl,sl,yd,al,gd,jy,Uc,ol,Id,vd,Rd,ll,bs,Pr,eg,tg,ul,Ed,ng,$d,rg,Yl,Wc,Jl,_r,cl,dl,ig,fl,Td,Gc,pl,ml,$l,hl,Ql,yl,gl,Cd,sg,vl,Il,wd,Rl,El,Tl,Cl,As,wl,bl,Ms,ag,Zl,bd,Vy,Al,Ml,Dr,og,Sl,Ad,Nl,kl,Pl,Dl,Md,Ol,_l]}computeIsSubtype(e,n){switch(e){case Ua:case Qa:case Za:case ao:case oo:case So:case el:case tl:case Ml:{return this.isSubtype(Bc,n)}case Wa:case Ja:case no:case so:case To:case ko:case xo:case Yy:case Jo:case tg:case ll:case $l:case bl:case og:case _l:{return this.isSubtype(Hy,n)}case Ga:case Ha:case ja:{return this.isSubtype(Pc,n)}case qa:case Va:case za:case Xa:case Ya:case eo:case to:case ro:case yo:case go:case Io:case Ro:case Li:case wo:case Mo:case zy:case No:case Do:case Oo:case _o:case Lc:case Fo:case Uo:case jo:case zo:case Zo:case Qy:case sl:case al:case Gc:case ml:case hl:case yl:case gl:case sg:case vl:case Rl:case El:case Tl:case Cl:case ag:case Dl:case Ol:{return this.isSubtype(Dr,n)}case io:case Qo:case rl:case As:{return this.isSubtype(jy,n)}case gs:case co:case po:case vo:case $s:case Ao:case Ko:case Xo:case ol:case ul:case Il:case Al:case Sl:case Nl:case kl:case Pl:{return this.isSubtype(Dc,n)}case lo:case uo:{return this.isSubtype(Wy,n)}case Is:case Es:{return this.isSubtype(ys,n)}case vs:case fo:case ho:{return this.isSubtype(Pr,n)||this.isSubtype(Dr,n)}case Rs:{return this.isSubtype(Kc,n)||this.isSubtype(Pr,n)||this.isSubtype(Dr,n)}case mo:{return this.isSubtype(Uc,n)||this.isSubtype(Pr,n)||this.isSubtype(Dr,n)}case Oc:case bs:case Pr:{return this.isSubtype(Vy,n)}case _c:case Bl:{return this.isSubtype(Li,n)}case Eo:case $o:{return this.isSubtype(_c,n)}case Co:case bo:{return this.isSubtype(Gy,n)}case Po:case Vo:case nl:{return this.isSubtype(Ky,n)}case Bo:case Lo:{return this.isSubtype(Lc,n)}case Ts:case Yo:case Jy:case il:case eg:case ng:case rg:case cl:case dl:case ig:case wl:{return this.isSubtype(Oc,n)||this.isSubtype(Dr,n)}case Wo:{return this.isSubtype(Pc,n)||this.isSubtype(Dc,n)}case Go:case Xy:{return this.isSubtype(xc,n)||this.isSubtype(Fc,n)}case Ho:{return this.isSubtype(xc,n)}case qo:{return this.isSubtype(Fc,n)}case ws:{return this.isSubtype(Uy,n)||this.isSubtype(Bc,n)}case _r:{return this.isSubtype(ys,n)||this.isSubtype(Pr,n)||this.isSubtype(Wc,n)}case fl:case pl:{return this.isSubtype(Gc,n)}case Ms:{return this.isSubtype(Wc,n)}default:{return false}}}getReferenceType(e){const n=`${e.container.$type}:${e.property}`;switch(n){case"HandleAttribute:type":case"TypeAttribute:type":{return Kc}case"LabelReference:label":{return Cs}case"OrdinalTypeAttribute:type":{return Uc}case"ProcedureCall:procedure":{return _r}case"ReferenceItem:ref":{return ys}default:{throw new Error(`${n} is not a valid reference id.`)}}}getTypeMetaData(e){switch(e){case Ua:{return{name:Ua,properties:[{name:"left"},{name:"op"},{name:"right"}]}}case Wa:{return{name:Wa,properties:[{name:"fieldWidth"}]}}case Ga:{return{name:Ga,properties:[{name:"dimensions"}]}}case Hc:{return{name:Hc,properties:[{name:"attribute"},{name:"level"},{name:"var"}]}}case Ha:{return{name:Ha,properties:[{name:"area"},{name:"locatorVariable"}]}}case qa:{return{name:qa,properties:[{name:"variables",defaultValue:[]}]}}case ja:{return{name:ja,properties:[{name:"dimensions"},{name:"type"}]}}case Va:{return{name:Va,properties:[{name:"actual"},{name:"compare",defaultValue:false},{name:"displayExpression"},{name:"expected"},{name:"false",defaultValue:false},{name:"operator"},{name:"true",defaultValue:false},{name:"unreachable",defaultValue:false}]}}case za:{return{name:za,properties:[{name:"dimacrossExpr"},{name:"expression"},{name:"operator"},{name:"refs",defaultValue:[]}]}}case Xa:{return{name:Xa,properties:[{name:"environment",defaultValue:false},{name:"reference"},{name:"task"},{name:"tstack"}]}}case Ya:{return{name:Ya,properties:[{name:"end"},{name:"options"},{name:"order",defaultValue:false},{name:"recursive",defaultValue:false},{name:"reorder",defaultValue:false},{name:"statements",defaultValue:[]}]}}case Ja:{return{name:Ja,properties:[{name:"fieldWidth"}]}}case Qa:{return{name:Qa,properties:[{name:"left"},{name:"op"},{name:"right"}]}}case Za:{return{name:Za,properties:[{name:"left"},{name:"op"},{name:"right"}]}}case qc:{return{name:qc,properties:[{name:"expression"},{name:"refer"}]}}case eo:{return{name:eo,properties:[{name:"call"}]}}case to:{return{name:to,properties:[{name:"thread"}]}}case no:{return{name:no,properties:[{name:"item"}]}}case ro:{return{name:ro,properties:[{name:"files",defaultValue:[]}]}}case io:{return{name:io,properties:[{name:"value"}]}}case so:{return{name:so,properties:[{name:"characterPosition"}]}}case ao:{return{name:ao,properties:[{name:"left"},{name:"op"},{name:"right"}]}}case jc:{return{name:jc,properties:[{name:"value"}]}}case gs:{return{name:gs,properties:[{name:"dimensions"},{name:"type"}]}}case oo:{return{name:oo,properties:[{name:"left"},{name:"op"},{name:"right"}]}}case Vc:{return{name:Vc,properties:[{name:"items",defaultValue:[]}]}}case zc:{return{name:zc,properties:[{name:"conditions",defaultValue:[]}]}}case Xc:{return{name:Xc,properties:[{name:"items",defaultValue:[]}]}}case lo:{return{name:lo,properties:[{name:"value"}]}}case uo:{return{name:uo,properties:[{name:"do"},{name:"list"}]}}case Yc:{return{name:Yc,properties:[{name:"data",defaultValue:false},{name:"dataList"},{name:"dataListItems",defaultValue:[]},{name:"dataLists",defaultValue:[]},{name:"edit",defaultValue:false},{name:"formatLists",defaultValue:[]}]}}case co:{return{name:co,properties:[{name:"pattern"}]}}case Jc:{return{name:Jc,properties:[{name:"attributes",defaultValue:[]},{name:"element"},{name:"items",defaultValue:[]},{name:"level"}]}}case Is:{return{name:Is,properties:[{name:"name"}]}}case vs:{return{name:vs,properties:[{name:"items",defaultValue:[]},{name:"xDeclare",defaultValue:false}]}}case Qc:{return{name:Qc,properties:[{name:"items",defaultValue:[]},{name:"operators",defaultValue:[]}]}}case Zc:{return{name:Zc,properties:[{name:"not",defaultValue:false},{name:"value"}]}}case ed:{return{name:ed,properties:[{name:"attributes",defaultValue:[]},{name:"expression"}]}}case td:{return{name:td,properties:[{name:"expression"},{name:"identifiers"}]}}case nd:{return{name:nd,properties:[{name:"from"},{name:"to"}]}}case rd:{return{name:rd,properties:[{name:"identifiers",defaultValue:[]}]}}case fo:{return{name:fo,properties:[{name:"expressions",defaultValue:[]}]}}case Rs:{return{name:Rs,properties:[{name:"attributes",defaultValue:[]},{name:"name"},{name:"xDefine",defaultValue:false}]}}case po:{return{name:po,properties:[{name:"position"},{name:"reference"}]}}case mo:{return{name:mo,properties:[{name:"name"},{name:"ordinalValues"},{name:"precision"},{name:"signed",defaultValue:false},{name:"unsigned",defaultValue:false},{name:"xDefine",defaultValue:false}]}}case ho:{return{name:ho,properties:[{name:"level"},{name:"name"},{name:"substructures",defaultValue:[]},{name:"union",defaultValue:false},{name:"xDefine",defaultValue:false}]}}case yo:{return{name:yo,properties:[{name:"delay"}]}}case go:{return{name:go,properties:[{name:"file"},{name:"key"}]}}case Io:{return{name:Io,properties:[{name:"reference"}]}}case id:{return{name:id,properties:[{name:"bound1"},{name:"bound2"}]}}case sd:{return{name:sd,properties:[{name:"dimensions",defaultValue:[]}]}}case vo:{return{name:vo,properties:[{name:"dimensions"}]}}case Ro:{return{name:Ro,properties:[{name:"desc",defaultValue:[]},{name:"expression"},{name:"reply"},{name:"rout",defaultValue:[]}]}}case ad:{return{name:ad,properties:[{name:"by"},{name:"downthru"},{name:"exp1"},{name:"repeat"},{name:"to"},{name:"upthru"},{name:"whileOrUntil"}]}}case Li:{return{name:Li,properties:[{name:"end"},{name:"statements",defaultValue:[]}]}}case Es:{return{name:Es,properties:[{name:"name"}]}}case Eo:{return{name:Eo,properties:[{name:"until"},{name:"while"}]}}case $o:{return{name:$o,properties:[{name:"until"},{name:"while"}]}}case To:{return{name:To,properties:[{name:"fieldWidth"},{name:"fractionalDigits"},{name:"significantDigits"}]}}case jl:{return{name:jl,properties:[{name:"label"},{name:"labels",defaultValue:[]}]}}case $s:{return{name:$s,properties:[{name:"attributes",defaultValue:[]},{name:"environmentName",defaultValue:[]},{name:"limited",defaultValue:[]},{name:"options",defaultValue:[]},{name:"returns",defaultValue:[]},{name:"variable",defaultValue:[]}]}}case Co:{return{name:Co,properties:[{name:"attributes",defaultValue:[]},{name:"star",defaultValue:false}]}}case wo:{return{name:wo,properties:[{name:"environmentName",defaultValue:[]},{name:"limited",defaultValue:[]},{name:"options",defaultValue:[]},{name:"parameters",defaultValue:[]},{name:"returns",defaultValue:[]},{name:"variable",defaultValue:[]}]}}case bo:{return{name:bo,properties:[{name:"attributes",defaultValue:[]},{name:"init"},{name:"prefixedAttributes",defaultValue:[]}]}}case Ao:{return{name:Ao,properties:[{name:"items",defaultValue:[]}]}}case od:{return{name:od,properties:[{name:"args",defaultValue:[]},{name:"environment"}]}}case Mo:{return{name:Mo,properties:[{name:"query"}]}}case So:{return{name:So,properties:[{name:"left"},{name:"op"},{name:"right"}]}}case ld:{return{name:ld,properties:[{name:"all",defaultValue:false},{name:"procedures",defaultValue:[]}]}}case ud:{return{name:ud,properties:[{name:"name"},{name:"set"},{name:"title"}]}}case No:{return{name:No,properties:[{name:"entries",defaultValue:[]}]}}case ko:{return{name:ko,properties:[{name:"fieldWidth"},{name:"fractionalDigits"},{name:"scalingFactor"}]}}case Po:{return{name:Po,properties:[{name:"fileReference"},{name:"keyword"}]}}case Do:{return{name:Do,properties:[{name:"file"}]}}case cd:{return{name:cd,properties:[{name:"items",defaultValue:[]}]}}case dd:{return{name:dd,properties:[{name:"item"},{name:"level"},{name:"list"}]}}case fd:{return{name:fd,properties:[{name:"level"}]}}case Oo:{return{name:Oo,properties:[{name:"list"}]}}case _o:{return{name:_o,properties:[{name:"references",defaultValue:[]}]}}case Bo:{return{name:Bo,properties:[{name:"copy",defaultValue:false},{name:"copyReference"},{name:"dataSpecification"},{name:"file"},{name:"skip",defaultValue:false},{name:"skipExpression"}]}}case Lo:{return{name:Lo,properties:[{name:"dataSpecification"},{name:"expression"}]}}case xo:{return{name:xo,properties:[{name:"fieldWidth"}]}}case Fo:{return{name:Fo,properties:[{name:"label"}]}}case Ko:{return{name:Ko,properties:[{name:"size"},{name:"type"}]}}case Uo:{return{name:Uo,properties:[{name:"else"},{name:"expression"},{name:"unit"}]}}case Ts:{return{name:Ts,properties:[{name:"items",defaultValue:[]}]}}case pd:{return{name:pd,properties:[{name:"ddname",defaultValue:false},{name:"file"}]}}case md:{return{name:md,properties:[{name:"expressions",defaultValue:[]}]}}case Wo:{return{name:Wo,properties:[{name:"across",defaultValue:false},{name:"call",defaultValue:false},{name:"content"},{name:"direct",defaultValue:false},{name:"expressions",defaultValue:[]},{name:"items",defaultValue:[]},{name:"procedureCall"},{name:"to",defaultValue:false}]}}case Go:{return{name:Go,properties:[{name:"expression"}]}}case Ho:{return{name:Ho,properties:[{name:"expression"},{name:"item"},{name:"star",defaultValue:false}]}}case qo:{return{name:qo,properties:[{name:"items",defaultValue:[]}]}}case hd:{return{name:hd,properties:[{name:"type"},{name:"varying"}]}}case jo:{return{name:jo,properties:[{name:"label"}]}}case Vo:{return{name:Vo,properties:[{name:"keyword"}]}}case Cs:{return{name:Cs,properties:[{name:"name"}]}}case Vl:{return{name:Vl,properties:[{name:"label"}]}}case zo:{return{name:zo,properties:[{name:"label"}]}}case Xo:{return{name:Xo,properties:[{name:"reference"}]}}case Yo:{return{name:Yo,properties:[{name:"file"},{name:"line"}]}}case Jo:{return{name:Jo,properties:[{name:"lineNumber"}]}}case Qo:{return{name:Qo,properties:[{name:"value"}]}}case ws:{return{name:ws,properties:[{name:"multiplier"},{name:"value"}]}}case Zo:{return{name:Zo,properties:[{name:"file"},{name:"keyfrom"},{name:"set"},{name:"variable"}]}}case el:{return{name:el,properties:[{name:"element"},{name:"handle",defaultValue:false},{name:"pointer",defaultValue:false},{name:"previous"}]}}case zl:{return{name:zl,properties:[{name:"element"},{name:"previous"}]}}case tl:{return{name:tl,properties:[{name:"left"},{name:"op"},{name:"right"}]}}case nl:{return{name:nl,properties:[{name:"name"}]}}case rl:{return{name:rl,properties:[{name:"parameters",defaultValue:[]},{name:"type"}]}}case il:{return{name:il,properties:[{name:"code"},{name:"message"}]}}case Xl:{return{name:Xl,properties:[{name:"value"}]}}case sl:{return{name:sl,properties:[{name:"conditions",defaultValue:[]},{name:"onUnit"},{name:"snap",defaultValue:false},{name:"system",defaultValue:false}]}}case yd:{return{name:yd,properties:[{name:"buffered",defaultValue:false},{name:"direct",defaultValue:false},{name:"file"},{name:"input",defaultValue:false},{name:"keyed",defaultValue:false},{name:"lineSize"},{name:"output",defaultValue:false},{name:"pageSize"},{name:"print",defaultValue:false},{name:"record",defaultValue:false},{name:"sequential",defaultValue:false},{name:"stream",defaultValue:false},{name:"title"},{name:"unbuffered",defaultValue:false},{name:"update",defaultValue:false}]}}case al:{return{name:al,properties:[{name:"options",defaultValue:[]}]}}case gd:{return{name:gd,properties:[{name:"items",defaultValue:[]}]}}case ol:{return{name:ol,properties:[{name:"byvalue",defaultValue:false},{name:"type"}]}}case Id:{return{name:Id,properties:[{name:"name"},{name:"value"}]}}case vd:{return{name:vd,properties:[{name:"members",defaultValue:[]}]}}case Rd:{return{name:Rd,properties:[{name:"unit"}]}}case bs:{return{name:bs,properties:[{name:"end"},{name:"exports"},{name:"name"},{name:"options"},{name:"prefix"},{name:"reserves"},{name:"statements",defaultValue:[]}]}}case ll:{return{name:ll,properties:[{name:"specification"}]}}case ul:{return{name:ul,properties:[{name:"picture"}]}}case Ed:{return{name:Ed,properties:[{name:"statements",defaultValue:[]}]}}case $d:{return{name:$d,properties:[{name:"attribute"},{name:"level"}]}}case Yl:{return{name:Yl,properties:[{name:"args",defaultValue:[]},{name:"procedure"}]}}case Jl:{return{name:Jl,properties:[{name:"id"}]}}case _r:{return{name:_r,properties:[{name:"end"},{name:"environmentName",defaultValue:[]},{name:"labels",defaultValue:[]},{name:"options",defaultValue:[]},{name:"order",defaultValue:[]},{name:"parameters",defaultValue:[]},{name:"recursive",defaultValue:[]},{name:"returns",defaultValue:[]},{name:"scope",defaultValue:[]},{name:"statements",defaultValue:[]},{name:"xProc",defaultValue:false}]}}case cl:{return{name:cl,properties:[{name:"compilerOptions",defaultValue:[]}]}}case dl:{return{name:dl,properties:[{name:"datasetName"}]}}case fl:{return{name:fl,properties:[{name:"items",defaultValue:[]}]}}case Td:{return{name:Td,properties:[{name:"attribute"},{name:"expression"}]}}case pl:{return{name:pl,properties:[{name:"dataSpecification"},{name:"stringExpression"}]}}case ml:{return{name:ml,properties:[{name:"end"},{name:"statements",defaultValue:[]}]}}case hl:{return{name:hl,properties:[{name:"fileReference"},{name:"ignore"},{name:"intoRef"},{name:"key"},{name:"keyto"},{name:"set"}]}}case Ql:{return{name:Ql,properties:[{name:"dimensions"},{name:"ref"}]}}case yl:{return{name:yl,properties:[{name:"reference"}]}}case gl:{return{name:gl,properties:[{name:"references",defaultValue:[]},{name:"star",defaultValue:false}]}}case Cd:{return{name:Cd,properties:[{name:"all",defaultValue:false},{name:"variables",defaultValue:[]}]}}case Il:{return{name:Il,properties:[{name:"attrs",defaultValue:[]}]}}case wd:{return{name:wd,properties:[{name:"returnAttribute"}]}}case vl:{return{name:vl,properties:[{name:"expression"}]}}case Rl:{return{name:Rl,properties:[{name:"conditions",defaultValue:[]}]}}case El:{return{name:El,properties:[{name:"file"},{name:"from"},{name:"key"}]}}case $l:{return{name:$l,properties:[{name:"labelReference"}]}}case Tl:{return{name:Tl,properties:[{name:"end"},{name:"on"},{name:"statements",defaultValue:[]}]}}case Cl:{return{name:Cl,properties:[{name:"condition",defaultValue:[]}]}}case As:{return{name:As,properties:[{name:"value"}]}}case wl:{return{name:wl,properties:[{name:"lines"}]}}case bl:{return{name:bl,properties:[{name:"skip"}]}}case Ms:{return{name:Ms,properties:[{name:"condition"},{name:"labels",defaultValue:[]},{name:"value"}]}}case Zl:{return{name:Zl,properties:[{name:"value"}]}}case bd:{return{name:bd,properties:[{name:"attributes",defaultValue:[]},{name:"level"},{name:"name"}]}}case Al:{return{name:Al,properties:[{name:"type"}]}}case Ml:{return{name:Ml,properties:[{name:"expr"},{name:"op"}]}}case Sl:{return{name:Sl,properties:[{name:"items",defaultValue:[]},{name:"value"}]}}case Ad:{return{name:Ad,properties:[{name:"attributes",defaultValue:[]}]}}case Nl:{return{name:Nl,properties:[{name:"values",defaultValue:[]}]}}case kl:{return{name:kl,properties:[{name:"from"}]}}case Pl:{return{name:Pl,properties:[{name:"values",defaultValue:[]}]}}case Dl:{return{name:Dl,properties:[{name:"task"}]}}case Md:{return{name:Md,properties:[{name:"conditions",defaultValue:[]},{name:"unit"}]}}case Ol:{return{name:Ol,properties:[{name:"fileReference"},{name:"from"},{name:"keyfrom"},{name:"keyto"}]}}case _l:{return{name:_l,properties:[{name:"width"}]}}case Bl:{return{name:Bl,properties:[{name:"end"},{name:"specifications",defaultValue:[]},{name:"statements",defaultValue:[]},{name:"variable"}]}}default:{return{name:e,properties:[]}}}}}const De=new sR;let lg;const rP=()=>lg??(lg=HS(`{
  "$type": "Grammar",
  "isDeclared": true,
  "name": "Pl1",
  "rules": [
    {
      "$type": "ParserRule",
      "entry": true,
      "name": "PliProgram",
      "definition": {
        "$type": "Assignment",
        "feature": "statements",
        "operator": "+=",
        "terminal": {
          "$type": "RuleCall",
          "rule": {
            "$ref": "#/rules@1"
          },
          "arguments": []
        },
        "cardinality": "*"
      },
      "definesHiddenTokens": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "TopLevelStatement",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@3"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@14"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@2"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "Directives",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@135"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@109"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@114"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@96"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@99"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@108"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@110"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@92"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@98"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@111"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@113"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "Package",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "prefix",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@4"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "name",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@202"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ":"
          },
          {
            "$type": "Keyword",
            "value": "PACKAGE"
          },
          {
            "$type": "Assignment",
            "feature": "exports",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@6"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "reserves",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@7"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "options",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@8"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": ";"
          },
          {
            "$type": "Assignment",
            "feature": "statements",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@14"
              },
              "arguments": []
            },
            "cardinality": "*"
          },
          {
            "$type": "Assignment",
            "feature": "end",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@34"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ConditionPrefix",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "items",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@5"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ")"
          },
          {
            "$type": "Keyword",
            "value": ":"
          }
        ],
        "cardinality": "+"
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ConditionPrefixItem",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "conditions",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@102"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ","
              },
              {
                "$type": "Assignment",
                "feature": "conditions",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@102"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "Exports",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "EXPORTS"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "all",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "*"
                }
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Assignment",
                    "feature": "procedures",
                    "operator": "+=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@202"
                      },
                      "arguments": []
                    }
                  },
                  {
                    "$type": "Group",
                    "elements": [
                      {
                        "$type": "Keyword",
                        "value": ","
                      },
                      {
                        "$type": "Assignment",
                        "feature": "procedures",
                        "operator": "+=",
                        "terminal": {
                          "$type": "RuleCall",
                          "rule": {
                            "$ref": "#/rules@202"
                          },
                          "arguments": []
                        }
                      }
                    ],
                    "cardinality": "*"
                  }
                ]
              }
            ]
          },
          {
            "$type": "Keyword",
            "value": ")"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "Reserves",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "RESERVES"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "all",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "*"
                }
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Assignment",
                    "feature": "variables",
                    "operator": "+=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@202"
                      },
                      "arguments": []
                    }
                  },
                  {
                    "$type": "Group",
                    "elements": [
                      {
                        "$type": "Keyword",
                        "value": ","
                      },
                      {
                        "$type": "Assignment",
                        "feature": "variables",
                        "operator": "+=",
                        "terminal": {
                          "$type": "RuleCall",
                          "rule": {
                            "$ref": "#/rules@202"
                          },
                          "arguments": []
                        }
                      }
                    ],
                    "cardinality": "*"
                  }
                ]
              }
            ]
          },
          {
            "$type": "Keyword",
            "value": ")"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "Options",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "OPTIONS"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "items",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@9"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ",",
                "cardinality": "?"
              },
              {
                "$type": "Assignment",
                "feature": "items",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@9"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": ")"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "OptionsItem",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@13"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@11"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@10"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@12"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "LinkageOptionsItem",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "LINKAGE"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "value",
            "operator": "=",
            "terminal": {
              "$type": "Alternatives",
              "elements": [
                {
                  "$type": "Keyword",
                  "value": "CDECL"
                },
                {
                  "$type": "Keyword",
                  "value": "OPTLINK"
                },
                {
                  "$type": "Keyword",
                  "value": "STDCALL"
                },
                {
                  "$type": "Keyword",
                  "value": "SYSTEM"
                }
              ]
            }
          },
          {
            "$type": "Keyword",
            "value": ")"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "CMPATOptionsItem",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "CMPAT"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "value",
            "operator": "=",
            "terminal": {
              "$type": "Alternatives",
              "elements": [
                {
                  "$type": "Keyword",
                  "value": "V1"
                },
                {
                  "$type": "Keyword",
                  "value": "V2"
                },
                {
                  "$type": "Keyword",
                  "value": "V3"
                }
              ]
            }
          },
          {
            "$type": "Keyword",
            "value": ")"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "NoMapOptionsItem",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "type",
            "operator": "=",
            "terminal": {
              "$type": "Alternatives",
              "elements": [
                {
                  "$type": "Keyword",
                  "value": "NOMAP"
                },
                {
                  "$type": "Keyword",
                  "value": "NOMAPIN"
                },
                {
                  "$type": "Keyword",
                  "value": "NOMAPOUT"
                }
              ]
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Assignment",
                    "feature": "parameters",
                    "operator": "+=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@202"
                      },
                      "arguments": []
                    }
                  },
                  {
                    "$type": "Group",
                    "elements": [
                      {
                        "$type": "Keyword",
                        "value": ","
                      },
                      {
                        "$type": "Assignment",
                        "feature": "parameters",
                        "operator": "+=",
                        "terminal": {
                          "$type": "RuleCall",
                          "rule": {
                            "$ref": "#/rules@202"
                          },
                          "arguments": []
                        }
                      }
                    ],
                    "cardinality": "*"
                  }
                ],
                "cardinality": "?"
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "SimpleOptionsItem",
      "definition": {
        "$type": "Assignment",
        "feature": "value",
        "operator": "=",
        "terminal": {
          "$type": "Alternatives",
          "elements": [
            {
              "$type": "Keyword",
              "value": "ORDER"
            },
            {
              "$type": "Keyword",
              "value": "REORDER"
            },
            {
              "$type": "Keyword",
              "value": "NOCHARGRAPHIC"
            },
            {
              "$type": "Keyword",
              "value": "CHARGRAPHIC"
            },
            {
              "$type": "Keyword",
              "value": "NOINLINE"
            },
            {
              "$type": "Keyword",
              "value": "INLINE"
            },
            {
              "$type": "Keyword",
              "value": "MAIN"
            },
            {
              "$type": "Keyword",
              "value": "NOEXECOPS"
            },
            {
              "$type": "Keyword",
              "value": "COBOL"
            },
            {
              "$type": "Keyword",
              "value": "FORTRAN"
            },
            {
              "$type": "Keyword",
              "value": "BYADDR"
            },
            {
              "$type": "Keyword",
              "value": "BYVALUE"
            },
            {
              "$type": "Keyword",
              "value": "DESCRIPTOR"
            },
            {
              "$type": "Keyword",
              "value": "NODESCRIPTOR"
            },
            {
              "$type": "Keyword",
              "value": "IRREDUCIBLE"
            },
            {
              "$type": "Keyword",
              "value": "REDUCIBLE"
            },
            {
              "$type": "Keyword",
              "value": "NORETURN"
            },
            {
              "$type": "Keyword",
              "value": "REENTRANT"
            },
            {
              "$type": "Keyword",
              "value": "FETCHABLE"
            },
            {
              "$type": "Keyword",
              "value": "RENT"
            },
            {
              "$type": "Keyword",
              "value": "AMODE31"
            },
            {
              "$type": "Keyword",
              "value": "AMODE64"
            },
            {
              "$type": "Keyword",
              "value": "DLLINTERNAL"
            },
            {
              "$type": "Keyword",
              "value": "FROMALIEN"
            },
            {
              "$type": "Keyword",
              "value": "RETCODE"
            },
            {
              "$type": "Keyword",
              "value": "ASSEMBLER"
            },
            {
              "$type": "Keyword",
              "value": "ASM",
              "$comment": "/* abbr */"
            },
            {
              "$type": "Keyword",
              "value": "WINMAIN"
            },
            {
              "$type": "Keyword",
              "value": "INTER"
            },
            {
              "$type": "Keyword",
              "value": "RECURSIVE"
            }
          ]
        }
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "PackageLevelStatements",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@150"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@46"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@47"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@50"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@38"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@15"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ProcedureStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "labels",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@17"
              },
              "arguments": []
            },
            "cardinality": "*"
          },
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Keyword",
                "value": "PROC"
              },
              {
                "$type": "Keyword",
                "value": "PROCEDURE"
              },
              {
                "$type": "Assignment",
                "feature": "xProc",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "XPROC"
                }
              },
              {
                "$type": "Assignment",
                "feature": "xProc",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "XPROCEDURE"
                }
              }
            ]
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Assignment",
                    "feature": "parameters",
                    "operator": "+=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@181"
                      },
                      "arguments": []
                    }
                  },
                  {
                    "$type": "Group",
                    "elements": [
                      {
                        "$type": "Keyword",
                        "value": ","
                      },
                      {
                        "$type": "Assignment",
                        "feature": "parameters",
                        "operator": "+=",
                        "terminal": {
                          "$type": "RuleCall",
                          "rule": {
                            "$ref": "#/rules@181"
                          },
                          "arguments": []
                        }
                      }
                    ],
                    "cardinality": "*"
                  }
                ],
                "cardinality": "?"
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "returns",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@176"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Assignment",
                "feature": "options",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@8"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Assignment",
                "feature": "recursive",
                "operator": "+=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "RECURSIVE"
                }
              },
              {
                "$type": "Assignment",
                "feature": "order",
                "operator": "+=",
                "terminal": {
                  "$type": "Alternatives",
                  "elements": [
                    {
                      "$type": "Keyword",
                      "value": "ORDER"
                    },
                    {
                      "$type": "Keyword",
                      "value": "REORDER"
                    }
                  ]
                }
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Alternatives",
                    "elements": [
                      {
                        "$type": "Keyword",
                        "value": "EXTERNAL"
                      },
                      {
                        "$type": "Keyword",
                        "value": "EXT"
                      }
                    ]
                  },
                  {
                    "$type": "Group",
                    "elements": [
                      {
                        "$type": "Keyword",
                        "value": "("
                      },
                      {
                        "$type": "Assignment",
                        "feature": "environmentName",
                        "operator": "+=",
                        "terminal": {
                          "$type": "RuleCall",
                          "rule": {
                            "$ref": "#/rules@183"
                          },
                          "arguments": []
                        }
                      },
                      {
                        "$type": "Keyword",
                        "value": ")"
                      }
                    ],
                    "cardinality": "?"
                  }
                ]
              },
              {
                "$type": "Assignment",
                "feature": "scope",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@16"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": ";"
          },
          {
            "$type": "Assignment",
            "feature": "statements",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@19"
              },
              "arguments": []
            },
            "cardinality": "*"
          },
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Keyword",
                "value": "PROC"
              },
              {
                "$type": "Keyword",
                "value": "PROCEDURE"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "end",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@34"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ScopeAttribute",
      "dataType": "string",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "Keyword",
            "value": "STATIC"
          },
          {
            "$type": "Keyword",
            "value": "DYNAMIC"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "LabelPrefix",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "name",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@202"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ":"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "EntryStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "ENTRY"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Assignment",
                    "feature": "parameters",
                    "operator": "+=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@181"
                      },
                      "arguments": []
                    }
                  },
                  {
                    "$type": "Group",
                    "elements": [
                      {
                        "$type": "Keyword",
                        "value": ","
                      },
                      {
                        "$type": "Assignment",
                        "feature": "parameters",
                        "operator": "+=",
                        "terminal": {
                          "$type": "RuleCall",
                          "rule": {
                            "$ref": "#/rules@181"
                          },
                          "arguments": []
                        }
                      }
                    ],
                    "cardinality": "*"
                  }
                ],
                "cardinality": "?"
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Alternatives",
                    "elements": [
                      {
                        "$type": "Keyword",
                        "value": "EXTERNAL"
                      },
                      {
                        "$type": "Keyword",
                        "value": "EXT"
                      }
                    ]
                  },
                  {
                    "$type": "Group",
                    "elements": [
                      {
                        "$type": "Keyword",
                        "value": "("
                      },
                      {
                        "$type": "Assignment",
                        "feature": "environmentName",
                        "operator": "+=",
                        "terminal": {
                          "$type": "RuleCall",
                          "rule": {
                            "$ref": "#/rules@183"
                          },
                          "arguments": []
                        }
                      },
                      {
                        "$type": "Keyword",
                        "value": ")"
                      }
                    ],
                    "cardinality": "?"
                  }
                ]
              },
              {
                "$type": "Assignment",
                "feature": "variable",
                "operator": "+=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "VARIABLE"
                }
              },
              {
                "$type": "Assignment",
                "feature": "limited",
                "operator": "+=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "LIMITED"
                }
              },
              {
                "$type": "Assignment",
                "feature": "returns",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@176"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Assignment",
                "feature": "options",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@8"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ProcedureLevelStatement",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@20"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@15"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "Statement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "condition",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@4"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "labels",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@17"
              },
              "arguments": []
            },
            "cardinality": "*"
          },
          {
            "$type": "Assignment",
            "feature": "value",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@21"
              },
              "arguments": []
            }
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "Unit",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@150"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@22"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@29"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@30"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@32"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@33"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@35"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@36"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@37"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@38"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@46"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@47"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@50"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@52"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@53"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@54"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@55"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@56"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@18"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@63"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@64"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@65"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@67"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@68"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@88"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@89"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@90"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@91"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@92"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@94"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@95"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@96"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@97"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@98"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@99"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@100"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@101"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@106"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@108"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@109"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@110"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@111"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@113"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@114"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@115"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@123"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@124"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@125"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@126"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@127"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@128"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@129"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@130"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@131"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@134"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@135"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@136"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@137"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@138"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "AllocateStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Keyword",
                "value": "ALLOCATE"
              },
              {
                "$type": "Keyword",
                "value": "ALLOC"
              }
            ]
          },
          {
            "$type": "Assignment",
            "feature": "variables",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@23"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ","
              },
              {
                "$type": "Assignment",
                "feature": "variables",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@23"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "AllocatedVariable",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "level",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@206"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "var",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@182"
              },
              "arguments": []
            }
          },
          {
            "$type": "Assignment",
            "feature": "attribute",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@24"
              },
              "arguments": []
            },
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "AllocateAttribute",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@26"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@27"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@25"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@139"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "AllocateLocationReference",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "IN"
              },
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "area",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@193"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Keyword",
                "value": ")"
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": "SET"
                  },
                  {
                    "$type": "Keyword",
                    "value": "("
                  },
                  {
                    "$type": "Assignment",
                    "feature": "locatorVariable",
                    "operator": "=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@193"
                      },
                      "arguments": []
                    }
                  },
                  {
                    "$type": "Keyword",
                    "value": ")"
                  }
                ],
                "cardinality": "?"
              }
            ]
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "SET"
              },
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "locatorVariable",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@193"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ]
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "AllocateDimension",
      "definition": {
        "$type": "Assignment",
        "feature": "dimensions",
        "operator": "=",
        "terminal": {
          "$type": "RuleCall",
          "rule": {
            "$ref": "#/rules@170"
          },
          "arguments": []
        }
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "AllocateType",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "type",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@28"
              },
              "arguments": []
            }
          },
          {
            "$type": "Assignment",
            "feature": "dimensions",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@170"
              },
              "arguments": []
            },
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "AllocateAttributeType",
      "dataType": "string",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "Keyword",
            "value": "CHAR"
          },
          {
            "$type": "Keyword",
            "value": "CHARACTER"
          },
          {
            "$type": "Keyword",
            "value": "BIT"
          },
          {
            "$type": "Keyword",
            "value": "GRAPHIC"
          },
          {
            "$type": "Keyword",
            "value": "UCHAR"
          },
          {
            "$type": "Keyword",
            "value": "WIDECHAR"
          },
          {
            "$type": "Keyword",
            "value": "AREA"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "AssertStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "ASSERT"
          },
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Assignment",
                    "feature": "true",
                    "operator": "?=",
                    "terminal": {
                      "$type": "Keyword",
                      "value": "TRUE"
                    }
                  },
                  {
                    "$type": "Keyword",
                    "value": "("
                  },
                  {
                    "$type": "Assignment",
                    "feature": "actual",
                    "operator": "=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@183"
                      },
                      "arguments": []
                    }
                  },
                  {
                    "$type": "Keyword",
                    "value": ")"
                  }
                ]
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Assignment",
                    "feature": "false",
                    "operator": "?=",
                    "terminal": {
                      "$type": "Keyword",
                      "value": "FALSE"
                    }
                  },
                  {
                    "$type": "Keyword",
                    "value": "("
                  },
                  {
                    "$type": "Assignment",
                    "feature": "actual",
                    "operator": "=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@183"
                      },
                      "arguments": []
                    }
                  },
                  {
                    "$type": "Keyword",
                    "value": ")"
                  }
                ]
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Assignment",
                    "feature": "compare",
                    "operator": "?=",
                    "terminal": {
                      "$type": "Keyword",
                      "value": "COMPARE"
                    }
                  },
                  {
                    "$type": "Keyword",
                    "value": "("
                  },
                  {
                    "$type": "Assignment",
                    "feature": "actual",
                    "operator": "=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@183"
                      },
                      "arguments": []
                    }
                  },
                  {
                    "$type": "Keyword",
                    "value": ","
                  },
                  {
                    "$type": "Assignment",
                    "feature": "expected",
                    "operator": "=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@183"
                      },
                      "arguments": []
                    }
                  },
                  {
                    "$type": "Group",
                    "elements": [
                      {
                        "$type": "Keyword",
                        "value": ","
                      },
                      {
                        "$type": "Assignment",
                        "feature": "operator",
                        "operator": "=",
                        "terminal": {
                          "$type": "RuleCall",
                          "rule": {
                            "$ref": "#/rules@210"
                          },
                          "arguments": []
                        }
                      }
                    ],
                    "cardinality": "?"
                  },
                  {
                    "$type": "Keyword",
                    "value": ")"
                  }
                ]
              },
              {
                "$type": "Assignment",
                "feature": "unreachable",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "UNREACHABLE"
                }
              }
            ]
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "TEXT"
              },
              {
                "$type": "Assignment",
                "feature": "displayExpression",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@183"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "AssignmentStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "refs",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@193"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ","
              },
              {
                "$type": "Assignment",
                "feature": "refs",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@193"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          },
          {
            "$type": "Assignment",
            "feature": "operator",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@31"
              },
              "arguments": []
            }
          },
          {
            "$type": "Assignment",
            "feature": "expression",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@183"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ","
              },
              {
                "$type": "Keyword",
                "value": "BY"
              },
              {
                "$type": "Alternatives",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": "NAME"
                  },
                  {
                    "$type": "Group",
                    "elements": [
                      {
                        "$type": "Keyword",
                        "value": "DIMACROSS"
                      },
                      {
                        "$type": "Assignment",
                        "feature": "dimacrossExpr",
                        "operator": "=",
                        "terminal": {
                          "$type": "RuleCall",
                          "rule": {
                            "$ref": "#/rules@183"
                          },
                          "arguments": []
                        }
                      }
                    ]
                  }
                ]
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "AssignmentOperator",
      "dataType": "string",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "Keyword",
            "value": "="
          },
          {
            "$type": "Keyword",
            "value": "+="
          },
          {
            "$type": "Keyword",
            "value": "-="
          },
          {
            "$type": "Keyword",
            "value": "*="
          },
          {
            "$type": "Keyword",
            "value": "/="
          },
          {
            "$type": "Keyword",
            "value": "|="
          },
          {
            "$type": "Keyword",
            "value": "&="
          },
          {
            "$type": "Keyword",
            "value": "||="
          },
          {
            "$type": "Keyword",
            "value": "**="
          },
          {
            "$type": "Keyword",
            "value": "¬="
          },
          {
            "$type": "Keyword",
            "value": "^="
          },
          {
            "$type": "Keyword",
            "value": "<>"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "AttachStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "ATTACH"
          },
          {
            "$type": "Assignment",
            "feature": "reference",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@193"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "THREAD"
              },
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "task",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@193"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ]
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "environment",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "ENVIRONMENT"
                }
              },
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": "TSTACK"
                  },
                  {
                    "$type": "Keyword",
                    "value": "("
                  },
                  {
                    "$type": "Assignment",
                    "feature": "tstack",
                    "operator": "=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@183"
                      },
                      "arguments": []
                    }
                  },
                  {
                    "$type": "Keyword",
                    "value": ")"
                  }
                ],
                "cardinality": "?"
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "BeginStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "BEGIN"
          },
          {
            "$type": "Assignment",
            "feature": "options",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@8"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "recursive",
            "operator": "?=",
            "terminal": {
              "$type": "Keyword",
              "value": "RECURSIVE"
            },
            "cardinality": "?"
          },
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "order",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "ORDER"
                }
              },
              {
                "$type": "Assignment",
                "feature": "reorder",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "REORDER"
                }
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": ";"
          },
          {
            "$type": "Assignment",
            "feature": "statements",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@20"
              },
              "arguments": []
            },
            "cardinality": "*"
          },
          {
            "$type": "Assignment",
            "feature": "end",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@34"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "EndStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "labels",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@17"
              },
              "arguments": []
            },
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": "END"
          },
          {
            "$type": "Assignment",
            "feature": "label",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@195"
              },
              "arguments": []
            },
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "CallStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "CALL"
          },
          {
            "$type": "Assignment",
            "feature": "call",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@194"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "CancelThreadStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "CANCEL"
          },
          {
            "$type": "Keyword",
            "value": "THREAD"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "thread",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@193"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ")"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "CloseStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "CLOSE"
          },
          {
            "$type": "Keyword",
            "value": "FILE"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "files",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@192"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Assignment",
                "feature": "files",
                "operator": "+=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "*"
                }
              }
            ]
          },
          {
            "$type": "Keyword",
            "value": ")"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ",",
                "cardinality": "?"
              },
              {
                "$type": "Keyword",
                "value": "FILE"
              },
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Alternatives",
                "elements": [
                  {
                    "$type": "Assignment",
                    "feature": "files",
                    "operator": "+=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@192"
                      },
                      "arguments": []
                    }
                  },
                  {
                    "$type": "Assignment",
                    "feature": "files",
                    "operator": "+=",
                    "terminal": {
                      "$type": "Keyword",
                      "value": "*"
                    }
                  }
                ]
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DefaultStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Keyword",
                "value": "DEFAULT"
              },
              {
                "$type": "Keyword",
                "value": "DFT"
              }
            ]
          },
          {
            "$type": "Assignment",
            "feature": "expressions",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@39"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ","
              },
              {
                "$type": "Assignment",
                "feature": "expressions",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@39"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DefaultExpression",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "expression",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@40"
              },
              "arguments": []
            }
          },
          {
            "$type": "Assignment",
            "feature": "attributes",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@153"
              },
              "arguments": []
            },
            "cardinality": "*"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DefaultExpressionPart",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "DESCRIPTORS"
              },
              {
                "$type": "Assignment",
                "feature": "expression",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@43"
                  },
                  "arguments": []
                }
              }
            ]
          },
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": "RANGE"
                  },
                  {
                    "$type": "Keyword",
                    "value": "("
                  },
                  {
                    "$type": "Assignment",
                    "feature": "identifiers",
                    "operator": "=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@41"
                      },
                      "arguments": []
                    }
                  },
                  {
                    "$type": "Keyword",
                    "value": ")"
                  }
                ]
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": "("
                  },
                  {
                    "$type": "Assignment",
                    "feature": "expression",
                    "operator": "=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@43"
                      },
                      "arguments": []
                    }
                  },
                  {
                    "$type": "Keyword",
                    "value": ")"
                  }
                ]
              }
            ]
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DefaultRangeIdentifiers",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "identifiers",
            "operator": "+=",
            "terminal": {
              "$type": "Alternatives",
              "elements": [
                {
                  "$type": "Keyword",
                  "value": "*"
                },
                {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@42"
                  },
                  "arguments": []
                }
              ]
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ","
              },
              {
                "$type": "Assignment",
                "feature": "identifiers",
                "operator": "+=",
                "terminal": {
                  "$type": "Alternatives",
                  "elements": [
                    {
                      "$type": "Keyword",
                      "value": "*"
                    },
                    {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@42"
                      },
                      "arguments": []
                    }
                  ]
                }
              }
            ],
            "cardinality": "*"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DefaultRangeIdentifierItem",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "from",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@202"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ":"
              },
              {
                "$type": "Assignment",
                "feature": "to",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@202"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DefaultAttributeExpression",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "items",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@44"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "operators",
                "operator": "+=",
                "terminal": {
                  "$type": "Alternatives",
                  "elements": [
                    {
                      "$type": "Keyword",
                      "value": "AND"
                    },
                    {
                      "$type": "Keyword",
                      "value": "OR"
                    }
                  ]
                }
              },
              {
                "$type": "Assignment",
                "feature": "items",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@44"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DefaultAttributeExpressionNot",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "not",
            "operator": "?=",
            "terminal": {
              "$type": "Keyword",
              "value": "NOT"
            },
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "value",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@45"
              },
              "arguments": []
            }
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DefaultAttribute",
      "dataType": "string",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "Keyword",
            "value": "ABNORMAL"
          },
          {
            "$type": "Keyword",
            "value": "ALIGNED"
          },
          {
            "$type": "Keyword",
            "value": "AREA"
          },
          {
            "$type": "Keyword",
            "value": "ASSIGNABLE"
          },
          {
            "$type": "Keyword",
            "value": "AUTOMATIC"
          },
          {
            "$type": "Keyword",
            "value": "BACKWARDS"
          },
          {
            "$type": "Keyword",
            "value": "BASED"
          },
          {
            "$type": "Keyword",
            "value": "BIT"
          },
          {
            "$type": "Keyword",
            "value": "BUFFERED"
          },
          {
            "$type": "Keyword",
            "value": "BUILTIN"
          },
          {
            "$type": "Keyword",
            "value": "BYADDR"
          },
          {
            "$type": "Keyword",
            "value": "BYVALUE"
          },
          {
            "$type": "Keyword",
            "value": "BIN"
          },
          {
            "$type": "Keyword",
            "value": "BINARY"
          },
          {
            "$type": "Keyword",
            "value": "CHARACTER"
          },
          {
            "$type": "Keyword",
            "value": "CHAR"
          },
          {
            "$type": "Keyword",
            "value": "COMPLEX"
          },
          {
            "$type": "Keyword",
            "value": "CONDITION"
          },
          {
            "$type": "Keyword",
            "value": "CONNECTED"
          },
          {
            "$type": "Keyword",
            "value": "CONSTANT"
          },
          {
            "$type": "Keyword",
            "value": "CONTROLLED"
          },
          {
            "$type": "Keyword",
            "value": "CTL"
          },
          {
            "$type": "Keyword",
            "value": "DECIMAL"
          },
          {
            "$type": "Keyword",
            "value": "DEC"
          },
          {
            "$type": "Keyword",
            "value": "DIMACROSS"
          },
          {
            "$type": "Keyword",
            "value": "EVENT"
          },
          {
            "$type": "Keyword",
            "value": "EXCLUSIVE"
          },
          {
            "$type": "Keyword",
            "value": "EXTERNAL"
          },
          {
            "$type": "Keyword",
            "value": "EXT"
          },
          {
            "$type": "Keyword",
            "value": "FILE"
          },
          {
            "$type": "Keyword",
            "value": "FIXED"
          },
          {
            "$type": "Keyword",
            "value": "FLOAT"
          },
          {
            "$type": "Keyword",
            "value": "FORMAT"
          },
          {
            "$type": "Keyword",
            "value": "GENERIC"
          },
          {
            "$type": "Keyword",
            "value": "GRAPHIC"
          },
          {
            "$type": "Keyword",
            "value": "HEX"
          },
          {
            "$type": "Keyword",
            "value": "HEXADEC"
          },
          {
            "$type": "Keyword",
            "value": "IEEE"
          },
          {
            "$type": "Keyword",
            "value": "INONLY"
          },
          {
            "$type": "Keyword",
            "value": "INOUT"
          },
          {
            "$type": "Keyword",
            "value": "INTERNAL"
          },
          {
            "$type": "Keyword",
            "value": "INT"
          },
          {
            "$type": "Keyword",
            "value": "IRREDUCIBLE"
          },
          {
            "$type": "Keyword",
            "value": "INPUT"
          },
          {
            "$type": "Keyword",
            "value": "KEYED"
          },
          {
            "$type": "Keyword",
            "value": "LABEL"
          },
          {
            "$type": "Keyword",
            "value": "LIST"
          },
          {
            "$type": "Keyword",
            "value": "MEMBER"
          },
          {
            "$type": "Keyword",
            "value": "NATIVE"
          },
          {
            "$type": "Keyword",
            "value": "NONASSIGNABLE"
          },
          {
            "$type": "Keyword",
            "value": "NONASGN"
          },
          {
            "$type": "Keyword",
            "value": "NONCONNECTED"
          },
          {
            "$type": "Keyword",
            "value": "NONNATIVE"
          },
          {
            "$type": "Keyword",
            "value": "NONVARYING"
          },
          {
            "$type": "Keyword",
            "value": "NORMAL"
          },
          {
            "$type": "Keyword",
            "value": "OFFSET"
          },
          {
            "$type": "Keyword",
            "value": "OPTIONAL"
          },
          {
            "$type": "Keyword",
            "value": "OPTIONS"
          },
          {
            "$type": "Keyword",
            "value": "OUTONLY"
          },
          {
            "$type": "Keyword",
            "value": "OUTPUT"
          },
          {
            "$type": "Keyword",
            "value": "PARAMETER"
          },
          {
            "$type": "Keyword",
            "value": "POINTER"
          },
          {
            "$type": "Keyword",
            "value": "PTR"
          },
          {
            "$type": "Keyword",
            "value": "POSITION"
          },
          {
            "$type": "Keyword",
            "value": "PRECISION"
          },
          {
            "$type": "Keyword",
            "value": "PREC"
          },
          {
            "$type": "Keyword",
            "value": "PRINT"
          },
          {
            "$type": "Keyword",
            "value": "RANGE"
          },
          {
            "$type": "Keyword",
            "value": "REAL"
          },
          {
            "$type": "Keyword",
            "value": "RECORD"
          },
          {
            "$type": "Keyword",
            "value": "RESERVED"
          },
          {
            "$type": "Keyword",
            "value": "RETURNS"
          },
          {
            "$type": "Keyword",
            "value": "SEQUENTIAL"
          },
          {
            "$type": "Keyword",
            "value": "SIGNED"
          },
          {
            "$type": "Keyword",
            "value": "STATIC"
          },
          {
            "$type": "Keyword",
            "value": "STREAM"
          },
          {
            "$type": "Keyword",
            "value": "STRUCTURE"
          },
          {
            "$type": "Keyword",
            "value": "TASK"
          },
          {
            "$type": "Keyword",
            "value": "TRANSIENT"
          },
          {
            "$type": "Keyword",
            "value": "UNAL"
          },
          {
            "$type": "Keyword",
            "value": "UCHAR"
          },
          {
            "$type": "Keyword",
            "value": "UNALIGNED"
          },
          {
            "$type": "Keyword",
            "value": "UNBUFFERED"
          },
          {
            "$type": "Keyword",
            "value": "UNION"
          },
          {
            "$type": "Keyword",
            "value": "UNSIGNED"
          },
          {
            "$type": "Keyword",
            "value": "UPDATE"
          },
          {
            "$type": "Keyword",
            "value": "VARIABLE"
          },
          {
            "$type": "Keyword",
            "value": "VARYING"
          },
          {
            "$type": "Keyword",
            "value": "VAR"
          },
          {
            "$type": "Keyword",
            "value": "VARYING4"
          },
          {
            "$type": "Keyword",
            "value": "VARYINGZ"
          },
          {
            "$type": "Keyword",
            "value": "VARZ"
          },
          {
            "$type": "Keyword",
            "value": "WIDECHAR"
          },
          {
            "$type": "Keyword",
            "value": "BIGENDIAN"
          },
          {
            "$type": "Keyword",
            "value": "LITTLEENDIAN"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DefineAliasStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Keyword",
                "value": "DEFINE"
              },
              {
                "$type": "Assignment",
                "feature": "xDefine",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "XDEFINE"
                }
              }
            ]
          },
          {
            "$type": "Keyword",
            "value": "ALIAS"
          },
          {
            "$type": "Assignment",
            "feature": "name",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@202"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "attributes",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@153"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": ",",
                    "cardinality": "?"
                  },
                  {
                    "$type": "Assignment",
                    "feature": "attributes",
                    "operator": "+=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@153"
                      },
                      "arguments": []
                    }
                  }
                ],
                "cardinality": "*"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DefineOrdinalStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Keyword",
                "value": "DEFINE"
              },
              {
                "$type": "Assignment",
                "feature": "xDefine",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "XDEFINE"
                }
              }
            ]
          },
          {
            "$type": "Keyword",
            "value": "ORDINAL"
          },
          {
            "$type": "Assignment",
            "feature": "name",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@201"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "ordinalValues",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@48"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ")"
          },
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "signed",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "SIGNED"
                }
              },
              {
                "$type": "Assignment",
                "feature": "unsigned",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "UNSIGNED"
                }
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Alternatives",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": "PRECISION"
                  },
                  {
                    "$type": "Keyword",
                    "value": "PREC"
                  }
                ]
              },
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "precision",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@206"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "signed",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "SIGNED"
                }
              },
              {
                "$type": "Assignment",
                "feature": "unsigned",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "UNSIGNED"
                }
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "OrdinalValueList",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "members",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@49"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ","
              },
              {
                "$type": "Assignment",
                "feature": "members",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@49"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "OrdinalValue",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "name",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@202"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "VALUE"
              },
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "value",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@206"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DefineStructureStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Keyword",
                "value": "DEFINE"
              },
              {
                "$type": "Assignment",
                "feature": "xDefine",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "XDEFINE"
                }
              }
            ]
          },
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Keyword",
                "value": "STRUCTURE"
              },
              {
                "$type": "Keyword",
                "value": "STRUCT"
              }
            ]
          },
          {
            "$type": "Assignment",
            "feature": "level",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@206"
              },
              "arguments": []
            }
          },
          {
            "$type": "Assignment",
            "feature": "name",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@201"
              },
              "arguments": []
            }
          },
          {
            "$type": "Assignment",
            "feature": "union",
            "operator": "?=",
            "terminal": {
              "$type": "Keyword",
              "value": "UNION"
            },
            "cardinality": "?"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ","
              },
              {
                "$type": "Assignment",
                "feature": "substructures",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@51"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "SubStructure",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "level",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@206"
              },
              "arguments": []
            }
          },
          {
            "$type": "Assignment",
            "feature": "name",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@202"
              },
              "arguments": []
            }
          },
          {
            "$type": "Assignment",
            "feature": "attributes",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@153"
              },
              "arguments": []
            },
            "cardinality": "*"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DelayStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "DELAY"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "delay",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@183"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ")"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DeleteStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "DELETE"
          },
          {
            "$type": "Keyword",
            "value": "FILE"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "file",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@193"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ")"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "KEY"
              },
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "key",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@183"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DetachStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "DETACH"
          },
          {
            "$type": "Keyword",
            "value": "THREAD"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "reference",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@193"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ")"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DisplayStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "DISPLAY"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "expression",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@183"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ")"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "REPLY"
              },
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "reply",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@193"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "ROUTCDE"
              },
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "rout",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@206"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": ","
                  },
                  {
                    "$type": "Assignment",
                    "feature": "rout",
                    "operator": "+=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@206"
                      },
                      "arguments": []
                    }
                  }
                ],
                "cardinality": "*"
              },
              {
                "$type": "Keyword",
                "value": ")"
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": "DESC"
                  },
                  {
                    "$type": "Keyword",
                    "value": "("
                  },
                  {
                    "$type": "Assignment",
                    "feature": "desc",
                    "operator": "+=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@206"
                      },
                      "arguments": []
                    }
                  },
                  {
                    "$type": "Group",
                    "elements": [
                      {
                        "$type": "Keyword",
                        "value": ","
                      },
                      {
                        "$type": "Assignment",
                        "feature": "desc",
                        "operator": "+=",
                        "terminal": {
                          "$type": "RuleCall",
                          "rule": {
                            "$ref": "#/rules@206"
                          },
                          "arguments": []
                        }
                      }
                    ],
                    "cardinality": "*"
                  },
                  {
                    "$type": "Keyword",
                    "value": ")"
                  }
                ],
                "cardinality": "?"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DoStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "DO"
          },
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "RuleCall",
                "rule": {
                  "$ref": "#/rules@57"
                },
                "arguments": []
              },
              {
                "$type": "RuleCall",
                "rule": {
                  "$ref": "#/rules@60"
                },
                "arguments": [
                  {
                    "$type": "NamedArgument",
                    "value": {
                      "$type": "BooleanLiteral",
                      "true": true
                    },
                    "calledByName": false
                  }
                ]
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": ";"
          },
          {
            "$type": "Assignment",
            "feature": "statements",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@20"
              },
              "arguments": []
            },
            "cardinality": "*"
          },
          {
            "$type": "Assignment",
            "feature": "end",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@34"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DoType2",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@58"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@59"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DoWhile",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "WHILE"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "while",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@183"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ")"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "UNTIL"
              },
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "until",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@183"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DoUntil",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "UNTIL"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "until",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@183"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ")"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "WHILE"
              },
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "while",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@183"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DoType3",
      "parameters": [
        {
          "$type": "Parameter",
          "name": "content"
        }
      ],
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "variable",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@61"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": "="
          },
          {
            "$type": "Assignment",
            "feature": "specifications",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@62"
              },
              "arguments": [
                {
                  "$type": "NamedArgument",
                  "value": {
                    "$type": "ParameterReference",
                    "parameter": {
                      "$ref": "#/rules@60/parameters@0"
                    }
                  },
                  "calledByName": false
                }
              ]
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ","
              },
              {
                "$type": "Assignment",
                "feature": "specifications",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@62"
                  },
                  "arguments": [
                    {
                      "$type": "NamedArgument",
                      "value": {
                        "$type": "ParameterReference",
                        "parameter": {
                          "$ref": "#/rules@60/parameters@0"
                        }
                      },
                      "calledByName": false
                    }
                  ]
                }
              }
            ],
            "cardinality": "*"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DoType3Variable",
      "definition": {
        "$type": "Assignment",
        "feature": "name",
        "operator": "=",
        "terminal": {
          "$type": "RuleCall",
          "rule": {
            "$ref": "#/rules@205"
          },
          "arguments": []
        }
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DoSpecification",
      "parameters": [
        {
          "$type": "Parameter",
          "name": "content"
        }
      ],
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "exp1",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@183"
              },
              "arguments": []
            }
          },
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": "TO"
                  },
                  {
                    "$type": "Assignment",
                    "feature": "to",
                    "operator": "=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@183"
                      },
                      "arguments": []
                    }
                  },
                  {
                    "$type": "Group",
                    "elements": [
                      {
                        "$type": "Keyword",
                        "value": "BY"
                      },
                      {
                        "$type": "Assignment",
                        "feature": "by",
                        "operator": "=",
                        "terminal": {
                          "$type": "RuleCall",
                          "rule": {
                            "$ref": "#/rules@183"
                          },
                          "arguments": []
                        }
                      }
                    ],
                    "cardinality": "?"
                  }
                ]
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": "BY"
                  },
                  {
                    "$type": "Assignment",
                    "feature": "by",
                    "operator": "=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@183"
                      },
                      "arguments": []
                    }
                  },
                  {
                    "$type": "Group",
                    "elements": [
                      {
                        "$type": "Keyword",
                        "value": "TO"
                      },
                      {
                        "$type": "Assignment",
                        "feature": "to",
                        "operator": "=",
                        "terminal": {
                          "$type": "RuleCall",
                          "rule": {
                            "$ref": "#/rules@183"
                          },
                          "arguments": []
                        }
                      }
                    ],
                    "cardinality": "?"
                  }
                ]
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": "UPTHRU"
                  },
                  {
                    "$type": "Assignment",
                    "feature": "upthru",
                    "operator": "=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@183"
                      },
                      "arguments": []
                    }
                  }
                ]
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": "DOWNTHRU"
                  },
                  {
                    "$type": "Assignment",
                    "feature": "downthru",
                    "operator": "=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@183"
                      },
                      "arguments": []
                    }
                  }
                ]
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": "REPEAT"
                  },
                  {
                    "$type": "Assignment",
                    "feature": "repeat",
                    "operator": "=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@183"
                      },
                      "arguments": []
                    }
                  }
                ]
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Group",
            "guardCondition": {
              "$type": "ParameterReference",
              "parameter": {
                "$ref": "#/rules@62/parameters@0"
              }
            },
            "elements": [
              {
                "$type": "Assignment",
                "feature": "whileOrUntil",
                "operator": "=",
                "terminal": {
                  "$type": "Alternatives",
                  "elements": [
                    {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@58"
                      },
                      "arguments": []
                    },
                    {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@59"
                      },
                      "arguments": []
                    }
                  ]
                },
                "cardinality": "?"
              }
            ]
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ExecStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "EXEC"
          },
          {
            "$type": "Assignment",
            "feature": "query",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@204"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ExitStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Action",
            "inferredType": {
              "$type": "InferredType",
              "name": "ExitStatement"
            }
          },
          {
            "$type": "Keyword",
            "value": "EXIT"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "FetchStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "FETCH"
          },
          {
            "$type": "Assignment",
            "feature": "entries",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@66"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ","
              },
              {
                "$type": "Assignment",
                "feature": "entries",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@66"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "FetchEntry",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "name",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@202"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "SET"
              },
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "set",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@193"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "TITLE"
              },
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "title",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@183"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "FlushStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "FLUSH"
          },
          {
            "$type": "Keyword",
            "value": "FILE"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "file",
            "operator": "=",
            "terminal": {
              "$type": "Alternatives",
              "elements": [
                {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@193"
                  },
                  "arguments": []
                },
                {
                  "$type": "Keyword",
                  "value": "*"
                }
              ]
            }
          },
          {
            "$type": "Keyword",
            "value": ")"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "FormatStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "FORMAT"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "list",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@69"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ")"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "FormatList",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "items",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@70"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ","
              },
              {
                "$type": "Assignment",
                "feature": "items",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@70"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "FormatListItem",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "level",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@71"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "item",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@72"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": "("
                  },
                  {
                    "$type": "Assignment",
                    "feature": "list",
                    "operator": "=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@69"
                      },
                      "arguments": []
                    }
                  },
                  {
                    "$type": "Keyword",
                    "value": ")"
                  }
                ]
              }
            ]
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "FormatListItemLevel",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "level",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@206"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "level",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@183"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ]
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "FormatItem",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@73"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@74"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@75"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@77"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@76"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@78"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@79"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@80"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@81"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@82"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@83"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@84"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@85"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@86"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@87"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "AFormatItem",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "A"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "fieldWidth",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@183"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "BFormatItem",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "B"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "fieldWidth",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@183"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "CFormatItem",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "C"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "item",
            "operator": "=",
            "terminal": {
              "$type": "Alternatives",
              "elements": [
                {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@76"
                  },
                  "arguments": []
                },
                {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@77"
                  },
                  "arguments": []
                },
                {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@78"
                  },
                  "arguments": []
                }
              ]
            }
          },
          {
            "$type": "Keyword",
            "value": ")"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "FFormatItem",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "F"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "fieldWidth",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@183"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ","
              },
              {
                "$type": "Assignment",
                "feature": "fractionalDigits",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@183"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": ","
                  },
                  {
                    "$type": "Assignment",
                    "feature": "scalingFactor",
                    "operator": "=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@183"
                      },
                      "arguments": []
                    }
                  }
                ],
                "cardinality": "?"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": ")"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "EFormatItem",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "E"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "fieldWidth",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@183"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ","
          },
          {
            "$type": "Assignment",
            "feature": "fractionalDigits",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@183"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ","
              },
              {
                "$type": "Assignment",
                "feature": "significantDigits",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@183"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": ")"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "PFormatItem",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "P"
          },
          {
            "$type": "Assignment",
            "feature": "specification",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@210"
              },
              "arguments": []
            }
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ColumnFormatItem",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Keyword",
                "value": "COLUMN"
              },
              {
                "$type": "Keyword",
                "value": "COL"
              }
            ]
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "characterPosition",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@183"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ")"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "GFormatItem",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "G"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "fieldWidth",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@183"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "LFormatItem",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Action",
            "inferredType": {
              "$type": "InferredType",
              "name": "LFormatItem"
            }
          },
          {
            "$type": "Keyword",
            "value": "L"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "LineFormatItem",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "LINE"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "lineNumber",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@183"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ")"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "PageFormatItem",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Action",
            "inferredType": {
              "$type": "InferredType",
              "name": "PageFormatItem"
            }
          },
          {
            "$type": "Keyword",
            "value": "PAGE"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "RFormatItem",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "R"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "labelReference",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@202"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ")"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "SkipFormatItem",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "SKIP"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "skip",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@183"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "VFormatItem",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Action",
            "inferredType": {
              "$type": "InferredType",
              "name": "VFormatItem"
            }
          },
          {
            "$type": "Keyword",
            "value": "V"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "XFormatItem",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "X"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "width",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@183"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ")"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "FreeStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "FREE"
          },
          {
            "$type": "Assignment",
            "feature": "references",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@193"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ","
              },
              {
                "$type": "Assignment",
                "feature": "references",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@193"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "GetStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "GET"
          },
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Action",
                    "inferredType": {
                      "$type": "InferredType",
                      "name": "GetFileStatement"
                    }
                  },
                  {
                    "$type": "Group",
                    "elements": [
                      {
                        "$type": "Keyword",
                        "value": "FILE"
                      },
                      {
                        "$type": "Keyword",
                        "value": "("
                      },
                      {
                        "$type": "Assignment",
                        "feature": "file",
                        "operator": "=",
                        "terminal": {
                          "$type": "RuleCall",
                          "rule": {
                            "$ref": "#/rules@183"
                          },
                          "arguments": []
                        }
                      },
                      {
                        "$type": "Keyword",
                        "value": ")"
                      }
                    ],
                    "cardinality": "?"
                  },
                  {
                    "$type": "Assignment",
                    "feature": "dataSpecification",
                    "operator": "=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@118"
                      },
                      "arguments": []
                    },
                    "cardinality": "?"
                  },
                  {
                    "$type": "Group",
                    "elements": [
                      {
                        "$type": "Assignment",
                        "feature": "copy",
                        "operator": "?=",
                        "terminal": {
                          "$type": "Keyword",
                          "value": "COPY"
                        }
                      },
                      {
                        "$type": "Group",
                        "elements": [
                          {
                            "$type": "Keyword",
                            "value": "("
                          },
                          {
                            "$type": "Assignment",
                            "feature": "copyReference",
                            "operator": "=",
                            "terminal": {
                              "$type": "RuleCall",
                              "rule": {
                                "$ref": "#/rules@202"
                              },
                              "arguments": []
                            },
                            "$comment": "/* TODO REFERENCE */"
                          },
                          {
                            "$type": "Keyword",
                            "value": ")"
                          }
                        ],
                        "cardinality": "?"
                      }
                    ],
                    "cardinality": "?"
                  },
                  {
                    "$type": "Group",
                    "elements": [
                      {
                        "$type": "Assignment",
                        "feature": "skip",
                        "operator": "?=",
                        "terminal": {
                          "$type": "Keyword",
                          "value": "SKIP"
                        }
                      },
                      {
                        "$type": "Group",
                        "elements": [
                          {
                            "$type": "Keyword",
                            "value": "("
                          },
                          {
                            "$type": "Assignment",
                            "feature": "skipExpression",
                            "operator": "=",
                            "terminal": {
                              "$type": "RuleCall",
                              "rule": {
                                "$ref": "#/rules@183"
                              },
                              "arguments": []
                            }
                          },
                          {
                            "$type": "Keyword",
                            "value": ")"
                          }
                        ]
                      }
                    ],
                    "cardinality": "?"
                  }
                ]
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Action",
                    "inferredType": {
                      "$type": "InferredType",
                      "name": "GetStringStatement"
                    }
                  },
                  {
                    "$type": "Keyword",
                    "value": "STRING"
                  },
                  {
                    "$type": "Keyword",
                    "value": "("
                  },
                  {
                    "$type": "Assignment",
                    "feature": "expression",
                    "operator": "=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@183"
                      },
                      "arguments": []
                    }
                  },
                  {
                    "$type": "Keyword",
                    "value": ")"
                  },
                  {
                    "$type": "Assignment",
                    "feature": "dataSpecification",
                    "operator": "=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@118"
                      },
                      "arguments": []
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "GoToStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": "GO"
                  },
                  {
                    "$type": "Keyword",
                    "value": "TO"
                  }
                ]
              },
              {
                "$type": "Keyword",
                "value": "GOTO"
              }
            ]
          },
          {
            "$type": "Assignment",
            "feature": "label",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@195"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "IfStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "IF"
          },
          {
            "$type": "Assignment",
            "feature": "expression",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@183"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": "THEN"
          },
          {
            "$type": "Assignment",
            "feature": "unit",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@20"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "ELSE"
              },
              {
                "$type": "Assignment",
                "feature": "else",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@20"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "IncludeDirective",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Keyword",
                "value": "%INCLUDE"
              },
              {
                "$type": "Keyword",
                "value": "%XINCLUDE"
              }
            ]
          },
          {
            "$type": "Assignment",
            "feature": "items",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@93"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ","
              },
              {
                "$type": "Assignment",
                "feature": "items",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@93"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "IncludeItem",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "file",
            "operator": "=",
            "terminal": {
              "$type": "Alternatives",
              "elements": [
                {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@210"
                  },
                  "arguments": []
                },
                {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@205"
                  },
                  "arguments": []
                }
              ]
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "ddname",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "ddname"
                }
              },
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "file",
                "operator": "=",
                "terminal": {
                  "$type": "Alternatives",
                  "elements": [
                    {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@210"
                      },
                      "arguments": []
                    },
                    {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@205"
                      },
                      "arguments": []
                    }
                  ]
                }
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ]
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "IterateStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "ITERATE"
          },
          {
            "$type": "Assignment",
            "feature": "label",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@195"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "LeaveStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "LEAVE"
          },
          {
            "$type": "Assignment",
            "feature": "label",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@195"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "LineDirective",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "%LINE"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "line",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@206"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Keyword",
                "value": ","
              },
              {
                "$type": "Assignment",
                "feature": "file",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@210"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ]
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "LocateStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "LOCATE"
          },
          {
            "$type": "Assignment",
            "feature": "variable",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@193"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": "FILE"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "file",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@182"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ")"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "SET"
              },
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "set",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@193"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Keyword",
                "value": ")",
                "$comment": "/* TODO Pointer-Reference? */"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "KEYFROM"
              },
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "keyfrom",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@183"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "NoPrintDirective",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Action",
            "inferredType": {
              "$type": "InferredType",
              "name": "NoPrintDirective"
            }
          },
          {
            "$type": "Keyword",
            "value": "%NOPRINT"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "NoteDirective",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "%NOTE"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "message",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@183"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ","
              },
              {
                "$type": "Assignment",
                "feature": "code",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@183"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": ")"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "NullStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Action",
            "inferredType": {
              "$type": "InferredType",
              "name": "NullStatement"
            }
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "OnStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "ON"
          },
          {
            "$type": "Assignment",
            "feature": "conditions",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@102"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ","
              },
              {
                "$type": "Assignment",
                "feature": "conditions",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@102"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          },
          {
            "$type": "Assignment",
            "feature": "snap",
            "operator": "?=",
            "terminal": {
              "$type": "Keyword",
              "value": "SNAP"
            },
            "cardinality": "?"
          },
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Assignment",
                    "feature": "system",
                    "operator": "?=",
                    "terminal": {
                      "$type": "Keyword",
                      "value": "SYSTEM"
                    }
                  },
                  {
                    "$type": "Keyword",
                    "value": ";"
                  }
                ]
              },
              {
                "$type": "Assignment",
                "feature": "onUnit",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@20"
                  },
                  "arguments": []
                }
              }
            ]
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "Condition",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@103"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@104"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@105"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "KeywordCondition",
      "definition": {
        "$type": "Assignment",
        "feature": "keyword",
        "operator": "=",
        "terminal": {
          "$type": "Alternatives",
          "elements": [
            {
              "$type": "Keyword",
              "value": "ANYCONDITION"
            },
            {
              "$type": "Keyword",
              "value": "ANYCOND"
            },
            {
              "$type": "Keyword",
              "value": "AREA"
            },
            {
              "$type": "Keyword",
              "value": "ASSERTION"
            },
            {
              "$type": "Keyword",
              "value": "ATTENTION"
            },
            {
              "$type": "Keyword",
              "value": "CONFORMANCE"
            },
            {
              "$type": "Keyword",
              "value": "CONVERSION"
            },
            {
              "$type": "Keyword",
              "value": "ERROR"
            },
            {
              "$type": "Keyword",
              "value": "FINISH"
            },
            {
              "$type": "Keyword",
              "value": "FIXEDOVERFLOW"
            },
            {
              "$type": "Keyword",
              "value": "FOFL"
            },
            {
              "$type": "Keyword",
              "value": "INVALIDOP"
            },
            {
              "$type": "Keyword",
              "value": "OVERFLOW"
            },
            {
              "$type": "Keyword",
              "value": "OFL"
            },
            {
              "$type": "Keyword",
              "value": "SIZE"
            },
            {
              "$type": "Keyword",
              "value": "STORAGE"
            },
            {
              "$type": "Keyword",
              "value": "STRINGRANGE"
            },
            {
              "$type": "Keyword",
              "value": "STRINGSIZE"
            },
            {
              "$type": "Keyword",
              "value": "SUBSCRIPTRANGE"
            },
            {
              "$type": "Keyword",
              "value": "UNDERFLOW"
            },
            {
              "$type": "Keyword",
              "value": "UFL"
            },
            {
              "$type": "Keyword",
              "value": "ZERODIVIDE"
            },
            {
              "$type": "Keyword",
              "value": "ZDIV"
            }
          ]
        }
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "NamedCondition",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "CONDITION"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "name",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@202"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ")"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "FileReferenceCondition",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "keyword",
            "operator": "=",
            "terminal": {
              "$type": "Alternatives",
              "elements": [
                {
                  "$type": "Keyword",
                  "value": "ENDFILE"
                },
                {
                  "$type": "Keyword",
                  "value": "ENDPAGE"
                },
                {
                  "$type": "Keyword",
                  "value": "KEY"
                },
                {
                  "$type": "Keyword",
                  "value": "NAME"
                },
                {
                  "$type": "Keyword",
                  "value": "RECORD"
                },
                {
                  "$type": "Keyword",
                  "value": "TRANSMIT"
                },
                {
                  "$type": "Keyword",
                  "value": "UNDEFINEDFILE"
                },
                {
                  "$type": "Keyword",
                  "value": "UNDF"
                }
              ]
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "fileReference",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@182"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "OpenStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "OPEN"
          },
          {
            "$type": "Assignment",
            "feature": "options",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@107"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ","
              },
              {
                "$type": "Assignment",
                "feature": "options",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@107"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "OpenOptionsGroup",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "FILE"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "file",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@182"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ")"
          },
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "stream",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "STREAM"
                }
              },
              {
                "$type": "Assignment",
                "feature": "record",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "RECORD"
                }
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "input",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "INPUT"
                }
              },
              {
                "$type": "Assignment",
                "feature": "output",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "OUTPUT"
                }
              },
              {
                "$type": "Assignment",
                "feature": "update",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "UPDATE"
                }
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Alternatives",
                "elements": [
                  {
                    "$type": "Assignment",
                    "feature": "sequential",
                    "operator": "?=",
                    "terminal": {
                      "$type": "Alternatives",
                      "elements": [
                        {
                          "$type": "Keyword",
                          "value": "SEQUENTIAL"
                        },
                        {
                          "$type": "Keyword",
                          "value": "SEQL"
                        }
                      ]
                    }
                  },
                  {
                    "$type": "Assignment",
                    "feature": "direct",
                    "operator": "?=",
                    "terminal": {
                      "$type": "Keyword",
                      "value": "DIRECT"
                    }
                  }
                ],
                "cardinality": "?"
              },
              {
                "$type": "Alternatives",
                "elements": [
                  {
                    "$type": "Assignment",
                    "feature": "unbuffered",
                    "operator": "?=",
                    "terminal": {
                      "$type": "Alternatives",
                      "elements": [
                        {
                          "$type": "Keyword",
                          "value": "UNBUFFERED"
                        },
                        {
                          "$type": "Keyword",
                          "value": "UNBUF"
                        }
                      ]
                    }
                  },
                  {
                    "$type": "Assignment",
                    "feature": "buffered",
                    "operator": "?=",
                    "terminal": {
                      "$type": "Alternatives",
                      "elements": [
                        {
                          "$type": "Keyword",
                          "value": "BUF"
                        },
                        {
                          "$type": "Keyword",
                          "value": "BUFFERED"
                        }
                      ]
                    }
                  }
                ],
                "cardinality": "?"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "keyed",
            "operator": "?=",
            "terminal": {
              "$type": "Keyword",
              "value": "KEYED"
            },
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "print",
            "operator": "?=",
            "terminal": {
              "$type": "Keyword",
              "value": "PRINT"
            },
            "cardinality": "?"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "TITLE"
              },
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "title",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@183"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "LINESIZE"
              },
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "lineSize",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@183"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "PAGESIZE"
              },
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "pageSize",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@183"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "PageDirective",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Action",
            "inferredType": {
              "$type": "InferredType",
              "name": "PageDirective"
            }
          },
          {
            "$type": "Keyword",
            "value": "%PAGE"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "PopDirective",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Action",
            "inferredType": {
              "$type": "InferredType",
              "name": "PopDirective"
            }
          },
          {
            "$type": "Keyword",
            "value": "%POP"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "PrintDirective",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Action",
            "inferredType": {
              "$type": "InferredType",
              "name": "PrintDirective"
            }
          },
          {
            "$type": "Keyword",
            "value": "%PRINT"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ProcessDirective",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Keyword",
                "value": "*PROCESS"
              },
              {
                "$type": "Keyword",
                "value": "%PROCESS"
              }
            ]
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "compilerOptions",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@112"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": ","
                  },
                  {
                    "$type": "Assignment",
                    "feature": "compilerOptions",
                    "operator": "+=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@112"
                      },
                      "arguments": []
                    }
                  }
                ]
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "CompilerOptions",
      "definition": {
        "$type": "Assignment",
        "feature": "value",
        "operator": "=",
        "terminal": {
          "$type": "Keyword",
          "value": "TODO"
        }
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ProcincDirective",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Keyword",
                "value": "%PROCINC"
              },
              {
                "$type": "Keyword",
                "value": "*PROCINC"
              }
            ]
          },
          {
            "$type": "Assignment",
            "feature": "datasetName",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@202"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "PushDirective",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Action",
            "inferredType": {
              "$type": "InferredType",
              "name": "PushDirective"
            }
          },
          {
            "$type": "Keyword",
            "value": "%PUSH"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "PutStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "PUT"
          },
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Action",
                    "inferredType": {
                      "$type": "InferredType",
                      "name": "PutFileStatement"
                    }
                  },
                  {
                    "$type": "Assignment",
                    "feature": "items",
                    "operator": "+=",
                    "terminal": {
                      "$type": "Alternatives",
                      "elements": [
                        {
                          "$type": "RuleCall",
                          "rule": {
                            "$ref": "#/rules@116"
                          },
                          "arguments": []
                        },
                        {
                          "$type": "RuleCall",
                          "rule": {
                            "$ref": "#/rules@118"
                          },
                          "arguments": []
                        }
                      ]
                    },
                    "cardinality": "*"
                  }
                ]
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Action",
                    "inferredType": {
                      "$type": "InferredType",
                      "name": "PutStringStatement"
                    }
                  },
                  {
                    "$type": "Group",
                    "elements": [
                      {
                        "$type": "Keyword",
                        "value": "STRING"
                      },
                      {
                        "$type": "Keyword",
                        "value": "("
                      },
                      {
                        "$type": "Assignment",
                        "feature": "stringExpression",
                        "operator": "=",
                        "terminal": {
                          "$type": "RuleCall",
                          "rule": {
                            "$ref": "#/rules@183"
                          },
                          "arguments": []
                        }
                      },
                      {
                        "$type": "Keyword",
                        "value": ")"
                      },
                      {
                        "$type": "Assignment",
                        "feature": "dataSpecification",
                        "operator": "=",
                        "terminal": {
                          "$type": "RuleCall",
                          "rule": {
                            "$ref": "#/rules@118"
                          },
                          "arguments": []
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "PutItem",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "attribute",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@117"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "expression",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@183"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "PutAttribute",
      "dataType": "string",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "Keyword",
            "value": "PAGE"
          },
          {
            "$type": "Keyword",
            "value": "LINE"
          },
          {
            "$type": "Keyword",
            "value": "SKIP"
          },
          {
            "$type": "Keyword",
            "value": "FILE"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DataSpecificationOptions",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "LIST",
                "cardinality": "?"
              },
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "dataList",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@119"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ]
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "data",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "DATA"
                }
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": "("
                  },
                  {
                    "$type": "Assignment",
                    "feature": "dataListItems",
                    "operator": "+=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@121"
                      },
                      "arguments": []
                    }
                  },
                  {
                    "$type": "Group",
                    "elements": [
                      {
                        "$type": "Keyword",
                        "value": ","
                      },
                      {
                        "$type": "Assignment",
                        "feature": "dataListItems",
                        "operator": "+=",
                        "terminal": {
                          "$type": "RuleCall",
                          "rule": {
                            "$ref": "#/rules@121"
                          },
                          "arguments": []
                        }
                      }
                    ],
                    "cardinality": "*"
                  },
                  {
                    "$type": "Keyword",
                    "value": ")"
                  }
                ],
                "cardinality": "?"
              }
            ]
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "edit",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "EDIT"
                }
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": "("
                  },
                  {
                    "$type": "Assignment",
                    "feature": "dataLists",
                    "operator": "+=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@119"
                      },
                      "arguments": []
                    }
                  },
                  {
                    "$type": "Keyword",
                    "value": ")"
                  },
                  {
                    "$type": "Keyword",
                    "value": "("
                  },
                  {
                    "$type": "Assignment",
                    "feature": "formatLists",
                    "operator": "+=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@69"
                      },
                      "arguments": []
                    }
                  },
                  {
                    "$type": "Keyword",
                    "value": ")"
                  }
                ],
                "cardinality": "+"
              }
            ]
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DataSpecificationDataList",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "items",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@120"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ","
              },
              {
                "$type": "Assignment",
                "feature": "items",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@120"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DataSpecificationDataListEntry",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@121"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@122"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DataSpecificationDataListItem",
      "definition": {
        "$type": "Assignment",
        "feature": "value",
        "operator": "=",
        "terminal": {
          "$type": "RuleCall",
          "rule": {
            "$ref": "#/rules@183"
          },
          "arguments": []
        }
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DataSpecificationDataListItem3DO",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "list",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@119"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": "DO"
          },
          {
            "$type": "Assignment",
            "feature": "do",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@60"
              },
              "arguments": [
                {
                  "$type": "NamedArgument",
                  "value": {
                    "$type": "BooleanLiteral",
                    "true": false
                  },
                  "calledByName": false
                }
              ]
            }
          },
          {
            "$type": "Keyword",
            "value": ")"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "QualifyStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "QUALIFY"
          },
          {
            "$type": "Keyword",
            "value": ";"
          },
          {
            "$type": "Assignment",
            "feature": "statements",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@20"
              },
              "arguments": []
            },
            "cardinality": "*"
          },
          {
            "$type": "Assignment",
            "feature": "end",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@34"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ReadStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "READ"
          },
          {
            "$type": "Keyword",
            "value": "FILE"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "fileReference",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@193"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ")"
          },
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": "IGNORE"
                  },
                  {
                    "$type": "Keyword",
                    "value": "("
                  },
                  {
                    "$type": "Assignment",
                    "feature": "ignore",
                    "operator": "=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@183"
                      },
                      "arguments": []
                    }
                  },
                  {
                    "$type": "Keyword",
                    "value": ")"
                  }
                ]
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Alternatives",
                    "elements": [
                      {
                        "$type": "Group",
                        "elements": [
                          {
                            "$type": "Keyword",
                            "value": "INTO"
                          },
                          {
                            "$type": "Keyword",
                            "value": "("
                          },
                          {
                            "$type": "Assignment",
                            "feature": "intoRef",
                            "operator": "=",
                            "terminal": {
                              "$type": "RuleCall",
                              "rule": {
                                "$ref": "#/rules@193"
                              },
                              "arguments": []
                            }
                          },
                          {
                            "$type": "Keyword",
                            "value": ")"
                          }
                        ]
                      },
                      {
                        "$type": "Group",
                        "elements": [
                          {
                            "$type": "Keyword",
                            "value": "SET"
                          },
                          {
                            "$type": "Keyword",
                            "value": "("
                          },
                          {
                            "$type": "Assignment",
                            "feature": "set",
                            "operator": "=",
                            "terminal": {
                              "$type": "RuleCall",
                              "rule": {
                                "$ref": "#/rules@193"
                              },
                              "arguments": []
                            }
                          },
                          {
                            "$type": "Keyword",
                            "value": ")"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "$type": "Alternatives",
                    "elements": [
                      {
                        "$type": "Group",
                        "elements": [
                          {
                            "$type": "Keyword",
                            "value": "KEY"
                          },
                          {
                            "$type": "Keyword",
                            "value": "("
                          },
                          {
                            "$type": "Assignment",
                            "feature": "key",
                            "operator": "=",
                            "terminal": {
                              "$type": "RuleCall",
                              "rule": {
                                "$ref": "#/rules@183"
                              },
                              "arguments": []
                            }
                          },
                          {
                            "$type": "Keyword",
                            "value": ")"
                          }
                        ]
                      },
                      {
                        "$type": "Group",
                        "elements": [
                          {
                            "$type": "Keyword",
                            "value": "KEYTO"
                          },
                          {
                            "$type": "Keyword",
                            "value": "("
                          },
                          {
                            "$type": "Assignment",
                            "feature": "keyto",
                            "operator": "=",
                            "terminal": {
                              "$type": "RuleCall",
                              "rule": {
                                "$ref": "#/rules@193"
                              },
                              "arguments": []
                            }
                          },
                          {
                            "$type": "Keyword",
                            "value": ")"
                          }
                        ]
                      }
                    ],
                    "cardinality": "?"
                  }
                ]
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ReinitStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "REINIT"
          },
          {
            "$type": "Assignment",
            "feature": "reference",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@193"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ReleaseStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "RELEASE"
          },
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "star",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "*"
                }
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Assignment",
                    "feature": "references",
                    "operator": "+=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@202"
                      },
                      "arguments": []
                    }
                  },
                  {
                    "$type": "Group",
                    "elements": [
                      {
                        "$type": "Keyword",
                        "value": ","
                      },
                      {
                        "$type": "Assignment",
                        "feature": "references",
                        "operator": "+=",
                        "terminal": {
                          "$type": "RuleCall",
                          "rule": {
                            "$ref": "#/rules@202"
                          },
                          "arguments": []
                        }
                      }
                    ],
                    "cardinality": "*"
                  }
                ]
              }
            ]
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ResignalStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Action",
            "inferredType": {
              "$type": "InferredType",
              "name": "ResignalStatement"
            }
          },
          {
            "$type": "Keyword",
            "value": "RESIGNAL"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ReturnStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "RETURN"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "expression",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@183"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "RevertStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "REVER"
          },
          {
            "$type": "Assignment",
            "feature": "conditions",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@102"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ","
              },
              {
                "$type": "Assignment",
                "feature": "conditions",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@102"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "RewriteStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "REWRITE"
          },
          {
            "$type": "Keyword",
            "value": "FILE"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "file",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@193"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ")"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "FROM"
              },
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "from",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@193"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "KEY"
              },
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "key",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@183"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "SelectStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "SELECT"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "on",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@183"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": ";"
          },
          {
            "$type": "Assignment",
            "feature": "statements",
            "operator": "+=",
            "terminal": {
              "$type": "Alternatives",
              "elements": [
                {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@132"
                  },
                  "arguments": []
                },
                {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@133"
                  },
                  "arguments": []
                }
              ]
            },
            "cardinality": "*"
          },
          {
            "$type": "Assignment",
            "feature": "end",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@34"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "WhenStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "WHEN"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "conditions",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@183"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ","
              },
              {
                "$type": "Assignment",
                "feature": "conditions",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@183"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": ")"
          },
          {
            "$type": "Assignment",
            "feature": "unit",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@20"
              },
              "arguments": []
            }
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "OtherwiseStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Keyword",
                "value": "OTHERWISE"
              },
              {
                "$type": "Keyword",
                "value": "OTHER"
              }
            ]
          },
          {
            "$type": "Assignment",
            "feature": "unit",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@20"
              },
              "arguments": []
            }
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "SignalStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "SIGNAL"
          },
          {
            "$type": "Assignment",
            "feature": "condition",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@102"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "SkipDirective",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "%SKIP"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "lines",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@183"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "StopStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Action",
            "inferredType": {
              "$type": "InferredType",
              "name": "StopStatement"
            }
          },
          {
            "$type": "Keyword",
            "value": "STOP"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "WaitStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "WAIT"
          },
          {
            "$type": "Keyword",
            "value": "THREAD"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "task",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@193"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ")"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "WriteStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "WRITE"
          },
          {
            "$type": "Keyword",
            "value": "FILE"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "fileReference",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@193"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ")"
          },
          {
            "$type": "Keyword",
            "value": "FROM"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "from",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@193"
              },
              "arguments": []
            }
          },
          {
            "$type": "Keyword",
            "value": ")"
          },
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": "KEYFROM"
                  },
                  {
                    "$type": "Keyword",
                    "value": "("
                  },
                  {
                    "$type": "Assignment",
                    "feature": "keyfrom",
                    "operator": "=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@183"
                      },
                      "arguments": []
                    }
                  },
                  {
                    "$type": "Keyword",
                    "value": ")"
                  }
                ]
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": "KEYTO"
                  },
                  {
                    "$type": "Keyword",
                    "value": "("
                  },
                  {
                    "$type": "Assignment",
                    "feature": "keyto",
                    "operator": "=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@193"
                      },
                      "arguments": []
                    }
                  },
                  {
                    "$type": "Keyword",
                    "value": ")"
                  }
                ]
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "InitialAttribute",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Alternatives",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": "INITIAL"
                  },
                  {
                    "$type": "Keyword",
                    "value": "INIT"
                  }
                ]
              },
              {
                "$type": "Alternatives",
                "elements": [
                  {
                    "$type": "Group",
                    "elements": [
                      {
                        "$type": "Assignment",
                        "feature": "direct",
                        "operator": "?=",
                        "terminal": {
                          "$type": "Keyword",
                          "value": "("
                        }
                      },
                      {
                        "$type": "Assignment",
                        "feature": "items",
                        "operator": "+=",
                        "terminal": {
                          "$type": "RuleCall",
                          "rule": {
                            "$ref": "#/rules@144"
                          },
                          "arguments": []
                        }
                      },
                      {
                        "$type": "Group",
                        "elements": [
                          {
                            "$type": "Keyword",
                            "value": ","
                          },
                          {
                            "$type": "Assignment",
                            "feature": "items",
                            "operator": "+=",
                            "terminal": {
                              "$type": "RuleCall",
                              "rule": {
                                "$ref": "#/rules@144"
                              },
                              "arguments": []
                            }
                          }
                        ],
                        "cardinality": "*"
                      },
                      {
                        "$type": "Keyword",
                        "value": ")"
                      }
                    ]
                  },
                  {
                    "$type": "Group",
                    "elements": [
                      {
                        "$type": "Assignment",
                        "feature": "call",
                        "operator": "?=",
                        "terminal": {
                          "$type": "Keyword",
                          "value": "CALL"
                        }
                      },
                      {
                        "$type": "Assignment",
                        "feature": "procedureCall",
                        "operator": "=",
                        "terminal": {
                          "$type": "RuleCall",
                          "rule": {
                            "$ref": "#/rules@194"
                          },
                          "arguments": []
                        }
                      }
                    ]
                  },
                  {
                    "$type": "Group",
                    "elements": [
                      {
                        "$type": "Assignment",
                        "feature": "to",
                        "operator": "?=",
                        "terminal": {
                          "$type": "Keyword",
                          "value": "TO"
                        }
                      },
                      {
                        "$type": "Keyword",
                        "value": "("
                      },
                      {
                        "$type": "Assignment",
                        "feature": "content",
                        "operator": "=",
                        "terminal": {
                          "$type": "RuleCall",
                          "rule": {
                            "$ref": "#/rules@140"
                          },
                          "arguments": []
                        }
                      },
                      {
                        "$type": "Keyword",
                        "value": ")"
                      },
                      {
                        "$type": "Keyword",
                        "value": "("
                      },
                      {
                        "$type": "Assignment",
                        "feature": "items",
                        "operator": "+=",
                        "terminal": {
                          "$type": "RuleCall",
                          "rule": {
                            "$ref": "#/rules@144"
                          },
                          "arguments": []
                        }
                      },
                      {
                        "$type": "Group",
                        "elements": [
                          {
                            "$type": "Keyword",
                            "value": ","
                          },
                          {
                            "$type": "Assignment",
                            "feature": "items",
                            "operator": "+=",
                            "terminal": {
                              "$type": "RuleCall",
                              "rule": {
                                "$ref": "#/rules@144"
                              },
                              "arguments": []
                            }
                          }
                        ],
                        "cardinality": "*"
                      },
                      {
                        "$type": "Keyword",
                        "value": ")"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "across",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "INITACROSS"
                }
              },
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "expressions",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@143"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": ","
                  },
                  {
                    "$type": "Assignment",
                    "feature": "expressions",
                    "operator": "+=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@143"
                      },
                      "arguments": []
                    }
                  }
                ],
                "cardinality": "*"
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ]
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "InitialToContent",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "varying",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@141"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Assignment",
                "feature": "type",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@142"
                  },
                  "arguments": []
                },
                "cardinality": "?"
              }
            ]
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "type",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@142"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Assignment",
                "feature": "varying",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@141"
                  },
                  "arguments": []
                },
                "cardinality": "?"
              }
            ]
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "Varying",
      "dataType": "string",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "Keyword",
            "value": "VARYING"
          },
          {
            "$type": "Keyword",
            "value": "VARYING4"
          },
          {
            "$type": "Keyword",
            "value": "VARYINGZ"
          },
          {
            "$type": "Keyword",
            "value": "NONVARYING"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "CharType",
      "dataType": "string",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "Keyword",
            "value": "CHAR"
          },
          {
            "$type": "Keyword",
            "value": "UCHAR"
          },
          {
            "$type": "Keyword",
            "value": "WCHAR"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "InitAcrossExpression",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "expressions",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@183"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ","
              },
              {
                "$type": "Assignment",
                "feature": "expressions",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@183"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": ")"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "InitialAttributeItem",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@145"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@147"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@146"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "InitialAttributeItemStar",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Action",
            "inferredType": {
              "$type": "InferredType",
              "name": "InitialAttributeItemStar"
            }
          },
          {
            "$type": "Keyword",
            "value": "*"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "InitialAttributeExpression",
      "definition": {
        "$type": "Assignment",
        "feature": "expression",
        "operator": "=",
        "terminal": {
          "$type": "RuleCall",
          "rule": {
            "$ref": "#/rules@183"
          },
          "arguments": []
        }
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "InitialAttributeSpecification",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "star",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "*"
                }
              },
              {
                "$type": "Assignment",
                "feature": "expression",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@183"
                  },
                  "arguments": []
                }
              }
            ]
          },
          {
            "$type": "Keyword",
            "value": ")"
          },
          {
            "$type": "Assignment",
            "feature": "item",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@148"
              },
              "arguments": []
            }
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "InitialAttributeSpecificationIteration",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@145"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@146"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@149"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "InitialAttributeSpecificationIterationValue",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "items",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@144"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ","
              },
              {
                "$type": "Assignment",
                "feature": "items",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@144"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": ")"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DeclareStatement",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Keyword",
                "value": "DCL"
              },
              {
                "$type": "Keyword",
                "value": "DECLARE"
              },
              {
                "$type": "Assignment",
                "feature": "xDeclare",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "XDECLARE"
                }
              },
              {
                "$type": "Assignment",
                "feature": "xDeclare",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "XDCL"
                }
              }
            ]
          },
          {
            "$type": "Assignment",
            "feature": "items",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@151"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ","
              },
              {
                "$type": "Assignment",
                "feature": "items",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@151"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": ";"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DeclaredItem",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "level",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@206"
              },
              "arguments": []
            },
            "cardinality": "?"
          },
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "element",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@152"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Assignment",
                "feature": "element",
                "operator": "=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "*"
                }
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": "("
                  },
                  {
                    "$type": "Assignment",
                    "feature": "items",
                    "operator": "+=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@151"
                      },
                      "arguments": []
                    }
                  },
                  {
                    "$type": "Group",
                    "elements": [
                      {
                        "$type": "Keyword",
                        "value": ","
                      },
                      {
                        "$type": "Assignment",
                        "feature": "items",
                        "operator": "+=",
                        "terminal": {
                          "$type": "RuleCall",
                          "rule": {
                            "$ref": "#/rules@151"
                          },
                          "arguments": []
                        }
                      }
                    ],
                    "cardinality": "*"
                  },
                  {
                    "$type": "Keyword",
                    "value": ")"
                  }
                ]
              }
            ]
          },
          {
            "$type": "Assignment",
            "feature": "attributes",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@153"
              },
              "arguments": []
            },
            "cardinality": "*"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DeclaredVariable",
      "definition": {
        "$type": "Assignment",
        "feature": "name",
        "operator": "=",
        "terminal": {
          "$type": "RuleCall",
          "rule": {
            "$ref": "#/rules@205"
          },
          "arguments": []
        }
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DeclarationAttribute",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@139"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@154"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@169"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@155"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@156"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@173"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@157"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@162"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@165"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@164"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@166"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@160"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@161"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@175"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@168"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@158"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@159"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DateAttribute",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "DATE"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "pattern",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@210"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DefinedAttribute",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Keyword",
                "value": "DEFINED"
              },
              {
                "$type": "Keyword",
                "value": "DEF"
              }
            ]
          },
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "reference",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@192"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": "("
                  },
                  {
                    "$type": "Assignment",
                    "feature": "reference",
                    "operator": "=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@192"
                      },
                      "arguments": []
                    }
                  },
                  {
                    "$type": "Keyword",
                    "value": ")"
                  }
                ]
              }
            ]
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Alternatives",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": "POSITION"
                  },
                  {
                    "$type": "Keyword",
                    "value": "POS"
                  }
                ]
              },
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "position",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@183"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "PictureAttribute",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Keyword",
                "value": "PICTURE"
              },
              {
                "$type": "Keyword",
                "value": "WIDEPIC"
              },
              {
                "$type": "Keyword",
                "value": "PIC"
              }
            ]
          },
          {
            "$type": "Assignment",
            "feature": "picture",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@210"
              },
              "arguments": []
            },
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DimensionsDataAttribute",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Keyword",
                "value": "DIMENSION"
              },
              {
                "$type": "Keyword",
                "value": "DIM"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "dimensions",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@170"
              },
              "arguments": []
            }
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "TypeAttribute",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "TYPE"
          },
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "type",
                "operator": "=",
                "terminal": {
                  "$type": "CrossReference",
                  "type": {
                    "$ref": "#/types@1"
                  },
                  "terminal": {
                    "$type": "RuleCall",
                    "rule": {
                      "$ref": "#/rules@205"
                    },
                    "arguments": []
                  },
                  "deprecatedSyntax": false
                }
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": "("
                  },
                  {
                    "$type": "Assignment",
                    "feature": "type",
                    "operator": "=",
                    "terminal": {
                      "$type": "CrossReference",
                      "type": {
                        "$ref": "#/types@1"
                      },
                      "terminal": {
                        "$type": "RuleCall",
                        "rule": {
                          "$ref": "#/rules@205"
                        },
                        "arguments": []
                      },
                      "deprecatedSyntax": false
                    }
                  },
                  {
                    "$type": "Keyword",
                    "value": ")"
                  }
                ]
              }
            ]
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "OrdinalTypeAttribute",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "ORDINAL"
          },
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "type",
                "operator": "=",
                "terminal": {
                  "$type": "CrossReference",
                  "type": {
                    "$ref": "#/types@2"
                  },
                  "terminal": {
                    "$type": "RuleCall",
                    "rule": {
                      "$ref": "#/rules@205"
                    },
                    "arguments": []
                  },
                  "deprecatedSyntax": false
                }
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": "("
                  },
                  {
                    "$type": "Assignment",
                    "feature": "type",
                    "operator": "=",
                    "terminal": {
                      "$type": "CrossReference",
                      "type": {
                        "$ref": "#/types@2"
                      },
                      "terminal": {
                        "$type": "RuleCall",
                        "rule": {
                          "$ref": "#/rules@205"
                        },
                        "arguments": []
                      },
                      "deprecatedSyntax": false
                    }
                  },
                  {
                    "$type": "Keyword",
                    "value": ")"
                  }
                ]
              }
            ]
          },
          {
            "$type": "Assignment",
            "feature": "byvalue",
            "operator": "?=",
            "terminal": {
              "$type": "Keyword",
              "value": "BYVALUE"
            }
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ReturnsAttribute",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "RETURNS"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "attrs",
            "operator": "+=",
            "terminal": {
              "$type": "Alternatives",
              "elements": [
                {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@161"
                  },
                  "arguments": []
                },
                {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@154"
                  },
                  "arguments": []
                },
                {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@164"
                  },
                  "arguments": []
                },
                {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@166"
                  },
                  "arguments": []
                }
              ]
            },
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": ")"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false,
      "$comment": "/**\\n * Used to specify the attribute of a value that is returned (slightly different from \`ReturnsOption\`).\\n * Order of contained attributes is not a factor, consider it a set, so duplicates are ignored as well.\\n * All data attrs are valid + aligned/unaligned + non-data attributes BYVALUE/BYADDR, DATE, VALUELIST, and VALUERANGE (see pg. 134 lang-ref 6.1)\\n */"
    },
    {
      "$type": "ParserRule",
      "name": "ComputationDataAttribute",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "type",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@167"
              },
              "arguments": []
            }
          },
          {
            "$type": "Assignment",
            "feature": "dimensions",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@170"
              },
              "arguments": []
            },
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ValueAttribute",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "VALUE"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Assignment",
                    "feature": "items",
                    "operator": "+=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@163"
                      },
                      "arguments": []
                    }
                  },
                  {
                    "$type": "Group",
                    "elements": [
                      {
                        "$type": "Keyword",
                        "value": ","
                      },
                      {
                        "$type": "Assignment",
                        "feature": "items",
                        "operator": "+=",
                        "terminal": {
                          "$type": "RuleCall",
                          "rule": {
                            "$ref": "#/rules@163"
                          },
                          "arguments": []
                        }
                      }
                    ],
                    "cardinality": "*"
                  }
                ]
              },
              {
                "$type": "Assignment",
                "feature": "value",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@183"
                  },
                  "arguments": []
                }
              }
            ]
          },
          {
            "$type": "Keyword",
            "value": ")"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ValueAttributeItem",
      "definition": {
        "$type": "Assignment",
        "feature": "attributes",
        "operator": "+=",
        "terminal": {
          "$type": "RuleCall",
          "rule": {
            "$ref": "#/rules@153"
          },
          "arguments": []
        },
        "cardinality": "+"
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ValueListAttribute",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "VALUELIST"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "values",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@183"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": ","
                  },
                  {
                    "$type": "Assignment",
                    "feature": "values",
                    "operator": "+=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@183"
                      },
                      "arguments": []
                    }
                  }
                ],
                "cardinality": "*"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": ")"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ValueListFromAttribute",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "VALUELISTFROM"
          },
          {
            "$type": "Assignment",
            "feature": "from",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@193"
              },
              "arguments": []
            }
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ValueRangeAttribute",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "VALUERANGE"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "values",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@183"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": ","
                  },
                  {
                    "$type": "Assignment",
                    "feature": "values",
                    "operator": "+=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@183"
                      },
                      "arguments": []
                    }
                  }
                ],
                "cardinality": "*"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": ")"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DataAttributeType",
      "dataType": "string",
      "definition": {
        "$type": "RuleCall",
        "rule": {
          "$ref": "#/rules@45"
        },
        "arguments": []
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "LikeAttribute",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "LIKE"
          },
          {
            "$type": "Assignment",
            "feature": "reference",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@193"
              },
              "arguments": []
            }
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "HandleAttribute",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "HANDLE"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "size",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@206"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "type",
                "operator": "=",
                "terminal": {
                  "$type": "CrossReference",
                  "type": {
                    "$ref": "#/types@1"
                  },
                  "terminal": {
                    "$type": "RuleCall",
                    "rule": {
                      "$ref": "#/rules@205"
                    },
                    "arguments": []
                  },
                  "deprecatedSyntax": false
                }
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": "("
                  },
                  {
                    "$type": "Assignment",
                    "feature": "type",
                    "operator": "=",
                    "terminal": {
                      "$type": "CrossReference",
                      "type": {
                        "$ref": "#/types@1"
                      },
                      "terminal": {
                        "$type": "RuleCall",
                        "rule": {
                          "$ref": "#/rules@205"
                        },
                        "arguments": []
                      },
                      "deprecatedSyntax": false
                    }
                  },
                  {
                    "$type": "Keyword",
                    "value": ")"
                  }
                ]
              }
            ]
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "Dimensions",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "dimensions",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@171"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": ","
                  },
                  {
                    "$type": "Assignment",
                    "feature": "dimensions",
                    "operator": "+=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@171"
                      },
                      "arguments": []
                    }
                  }
                ],
                "cardinality": "*"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Keyword",
            "value": ")"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "DimensionBound",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "bound1",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@172"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ":"
              },
              {
                "$type": "Assignment",
                "feature": "bound2",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@172"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false,
      "$comment": "/** \\n * Attention! This naming has an explanation:\\n * - When only bound1 is given, it is the upper bound.\\n * - Otherwise bound1 is the lower and bound2 is the upper bound!\\n * Keep in mind, that \`DimensionBound: upper=Bound | lower=Bound ':' upper=Bound;\` is expensive because of the long common prefix.\\n */"
    },
    {
      "$type": "ParserRule",
      "name": "Bound",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "expression",
            "operator": "=",
            "terminal": {
              "$type": "Keyword",
              "value": "*"
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "expression",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@183"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": "REFER"
                  },
                  {
                    "$type": "Keyword",
                    "value": "("
                  },
                  {
                    "$type": "Assignment",
                    "feature": "refer",
                    "operator": "=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@193"
                      },
                      "arguments": []
                    }
                  },
                  {
                    "$type": "Keyword",
                    "value": ")"
                  }
                ],
                "cardinality": "?"
              }
            ]
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "EnvironmentAttribute",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Keyword",
                "value": "ENVIRONMENT"
              },
              {
                "$type": "Keyword",
                "value": "ENV"
              }
            ]
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "items",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@174"
              },
              "arguments": []
            },
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": ")"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "EnvironmentAttributeItem",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "environment",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@205"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Assignment",
                    "feature": "args",
                    "operator": "+=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@183"
                      },
                      "arguments": []
                    }
                  },
                  {
                    "$type": "Group",
                    "elements": [
                      {
                        "$type": "Keyword",
                        "value": ",",
                        "cardinality": "?"
                      },
                      {
                        "$type": "Assignment",
                        "feature": "args",
                        "operator": "+=",
                        "terminal": {
                          "$type": "RuleCall",
                          "rule": {
                            "$ref": "#/rules@183"
                          },
                          "arguments": []
                        }
                      }
                    ],
                    "cardinality": "*"
                  }
                ],
                "cardinality": "?"
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "EntryAttribute",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "limited",
            "operator": "+=",
            "terminal": {
              "$type": "Keyword",
              "value": "LIMITED"
            },
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": "ENTRY"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "attributes",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@177"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Keyword",
                    "value": ","
                  },
                  {
                    "$type": "Assignment",
                    "feature": "attributes",
                    "operator": "+=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@177"
                      },
                      "arguments": []
                    }
                  }
                ],
                "cardinality": "*"
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Alternatives",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "options",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@8"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Assignment",
                "feature": "variable",
                "operator": "+=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "VARIABLE"
                }
              },
              {
                "$type": "Assignment",
                "feature": "limited",
                "operator": "+=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "LIMITED"
                }
              },
              {
                "$type": "Assignment",
                "feature": "returns",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@176"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Alternatives",
                    "elements": [
                      {
                        "$type": "Keyword",
                        "value": "EXTERNAL"
                      },
                      {
                        "$type": "Keyword",
                        "value": "EXT"
                      }
                    ]
                  },
                  {
                    "$type": "Group",
                    "elements": [
                      {
                        "$type": "Keyword",
                        "value": "("
                      },
                      {
                        "$type": "Assignment",
                        "feature": "environmentName",
                        "operator": "+=",
                        "terminal": {
                          "$type": "RuleCall",
                          "rule": {
                            "$ref": "#/rules@183"
                          },
                          "arguments": []
                        }
                      },
                      {
                        "$type": "Keyword",
                        "value": ")"
                      }
                    ],
                    "cardinality": "?"
                  }
                ]
              }
            ],
            "cardinality": "*"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ReturnsOption",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "RETURNS"
          },
          {
            "$type": "Keyword",
            "value": "("
          },
          {
            "$type": "Assignment",
            "feature": "returnAttribute",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@153"
              },
              "arguments": []
            },
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": ")"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "EntryDescription",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@178"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@179"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "EntryParameterDescription",
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "attributes",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@153"
              },
              "arguments": []
            },
            "cardinality": "+"
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "star",
                "operator": "?=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "*"
                }
              },
              {
                "$type": "Assignment",
                "feature": "attributes",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@153"
                  },
                  "arguments": []
                },
                "cardinality": "*"
              }
            ]
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "EntryUnionDescription",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "init",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@206"
              },
              "arguments": []
            }
          },
          {
            "$type": "Assignment",
            "feature": "attributes",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@153"
              },
              "arguments": []
            },
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": ","
          },
          {
            "$type": "Assignment",
            "feature": "prefixedAttributes",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@180"
              },
              "arguments": []
            },
            "cardinality": "*"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "PrefixedAttribute",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "level",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@206"
              },
              "arguments": []
            }
          },
          {
            "$type": "Assignment",
            "feature": "attribute",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@153"
              },
              "arguments": []
            },
            "cardinality": "*"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ProcedureParameter",
      "definition": {
        "$type": "Assignment",
        "feature": "id",
        "operator": "=",
        "terminal": {
          "$type": "RuleCall",
          "rule": {
            "$ref": "#/rules@202"
          },
          "arguments": []
        }
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ReferenceItem",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "ref",
            "operator": "=",
            "terminal": {
              "$type": "CrossReference",
              "type": {
                "$ref": "#/types@0"
              },
              "terminal": {
                "$type": "RuleCall",
                "rule": {
                  "$ref": "#/rules@202"
                },
                "arguments": []
              },
              "deprecatedSyntax": false
            }
          },
          {
            "$type": "Assignment",
            "feature": "dimensions",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@170"
              },
              "arguments": []
            },
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "Expression",
      "definition": {
        "$type": "RuleCall",
        "rule": {
          "$ref": "#/rules@184"
        },
        "arguments": []
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "BitOrExpression",
      "inferredType": {
        "$type": "InferredType",
        "name": "Expression"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@185"
            },
            "arguments": []
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Action",
                "inferredType": {
                  "$type": "InferredType",
                  "name": "BitOrExpression"
                },
                "feature": "left",
                "operator": "="
              },
              {
                "$type": "Assignment",
                "feature": "op",
                "operator": "=",
                "terminal": {
                  "$type": "Alternatives",
                  "elements": [
                    {
                      "$type": "Keyword",
                      "value": "|"
                    },
                    {
                      "$type": "Keyword",
                      "value": "¬"
                    },
                    {
                      "$type": "Keyword",
                      "value": "^"
                    }
                  ]
                }
              },
              {
                "$type": "Assignment",
                "feature": "right",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@185"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "BitAndExpression",
      "inferredType": {
        "$type": "InferredType",
        "name": "Expression"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@186"
            },
            "arguments": []
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Action",
                "inferredType": {
                  "$type": "InferredType",
                  "name": "BitAndExpression"
                },
                "feature": "left",
                "operator": "="
              },
              {
                "$type": "Assignment",
                "feature": "op",
                "operator": "=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "&"
                }
              },
              {
                "$type": "Assignment",
                "feature": "right",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@186"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "CompExpression",
      "inferredType": {
        "$type": "InferredType",
        "name": "Expression"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@187"
            },
            "arguments": []
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Action",
                "inferredType": {
                  "$type": "InferredType",
                  "name": "CompExpression"
                },
                "feature": "left",
                "operator": "="
              },
              {
                "$type": "Assignment",
                "feature": "op",
                "operator": "=",
                "terminal": {
                  "$type": "Alternatives",
                  "elements": [
                    {
                      "$type": "Keyword",
                      "value": "<"
                    },
                    {
                      "$type": "Keyword",
                      "value": "¬<"
                    },
                    {
                      "$type": "Keyword",
                      "value": "<="
                    },
                    {
                      "$type": "Keyword",
                      "value": "="
                    },
                    {
                      "$type": "Keyword",
                      "value": "¬="
                    },
                    {
                      "$type": "Keyword",
                      "value": "^="
                    },
                    {
                      "$type": "Keyword",
                      "value": "<>"
                    },
                    {
                      "$type": "Keyword",
                      "value": ">="
                    },
                    {
                      "$type": "Keyword",
                      "value": ">"
                    },
                    {
                      "$type": "Keyword",
                      "value": "¬>"
                    }
                  ]
                }
              },
              {
                "$type": "Assignment",
                "feature": "right",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@187"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ConcatExpression",
      "inferredType": {
        "$type": "InferredType",
        "name": "Expression"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@188"
            },
            "arguments": []
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Action",
                "inferredType": {
                  "$type": "InferredType",
                  "name": "ConcatExpression"
                },
                "feature": "left",
                "operator": "="
              },
              {
                "$type": "Assignment",
                "feature": "op",
                "operator": "=",
                "terminal": {
                  "$type": "Alternatives",
                  "elements": [
                    {
                      "$type": "Keyword",
                      "value": "||"
                    },
                    {
                      "$type": "Keyword",
                      "value": "!!"
                    }
                  ]
                }
              },
              {
                "$type": "Assignment",
                "feature": "right",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@188"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "AddExpression",
      "inferredType": {
        "$type": "InferredType",
        "name": "Expression"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@189"
            },
            "arguments": []
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Action",
                "inferredType": {
                  "$type": "InferredType",
                  "name": "AddExpression"
                },
                "feature": "left",
                "operator": "="
              },
              {
                "$type": "Assignment",
                "feature": "op",
                "operator": "=",
                "terminal": {
                  "$type": "Alternatives",
                  "elements": [
                    {
                      "$type": "Keyword",
                      "value": "+"
                    },
                    {
                      "$type": "Keyword",
                      "value": "-"
                    }
                  ]
                }
              },
              {
                "$type": "Assignment",
                "feature": "right",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@189"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "MultExpression",
      "inferredType": {
        "$type": "InferredType",
        "name": "Expression"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@190"
            },
            "arguments": []
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Action",
                "inferredType": {
                  "$type": "InferredType",
                  "name": "MultExpression"
                },
                "feature": "left",
                "operator": "="
              },
              {
                "$type": "Assignment",
                "feature": "op",
                "operator": "=",
                "terminal": {
                  "$type": "Alternatives",
                  "elements": [
                    {
                      "$type": "Keyword",
                      "value": "*"
                    },
                    {
                      "$type": "Keyword",
                      "value": "/"
                    }
                  ]
                }
              },
              {
                "$type": "Assignment",
                "feature": "right",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@190"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ExpExpression",
      "inferredType": {
        "$type": "InferredType",
        "name": "Expression"
      },
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@191"
            },
            "arguments": []
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Action",
                "inferredType": {
                  "$type": "InferredType",
                  "name": "ExpExpression"
                },
                "feature": "left",
                "operator": "="
              },
              {
                "$type": "Assignment",
                "feature": "op",
                "operator": "=",
                "terminal": {
                  "$type": "Keyword",
                  "value": "**"
                }
              },
              {
                "$type": "Assignment",
                "feature": "right",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@191"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "PrimaryExpression",
      "inferredType": {
        "$type": "InferredType",
        "name": "Expression"
      },
      "definition": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@198"
            },
            "arguments": []
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "RuleCall",
                "rule": {
                  "$ref": "#/rules@183"
                },
                "arguments": []
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ]
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@196"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@193"
            },
            "arguments": []
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "MemberCall",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "element",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@182"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Action",
                "inferredType": {
                  "$type": "InferredType",
                  "name": "MemberCall"
                },
                "feature": "previous",
                "operator": "="
              },
              {
                "$type": "Keyword",
                "value": "."
              },
              {
                "$type": "Assignment",
                "feature": "element",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@182"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "LocatorCall",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "element",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@192"
              },
              "arguments": []
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Action",
                "inferredType": {
                  "$type": "InferredType",
                  "name": "LocatorCall"
                },
                "feature": "previous",
                "operator": "="
              },
              {
                "$type": "Alternatives",
                "elements": [
                  {
                    "$type": "Assignment",
                    "feature": "pointer",
                    "operator": "?=",
                    "terminal": {
                      "$type": "Keyword",
                      "value": "->"
                    }
                  },
                  {
                    "$type": "Assignment",
                    "feature": "handle",
                    "operator": "?=",
                    "terminal": {
                      "$type": "Keyword",
                      "value": "=>"
                    }
                  }
                ]
              },
              {
                "$type": "Assignment",
                "feature": "element",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@192"
                  },
                  "arguments": []
                }
              }
            ],
            "cardinality": "*"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ProcedureCall",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "procedure",
            "operator": "=",
            "terminal": {
              "$type": "CrossReference",
              "type": {
                "$ref": "#/rules@15"
              },
              "terminal": {
                "$type": "RuleCall",
                "rule": {
                  "$ref": "#/rules@205"
                },
                "arguments": []
              },
              "deprecatedSyntax": false
            }
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Group",
                "elements": [
                  {
                    "$type": "Assignment",
                    "feature": "args",
                    "operator": "+=",
                    "terminal": {
                      "$type": "Alternatives",
                      "elements": [
                        {
                          "$type": "RuleCall",
                          "rule": {
                            "$ref": "#/rules@183"
                          },
                          "arguments": []
                        },
                        {
                          "$type": "Keyword",
                          "value": "*"
                        }
                      ]
                    }
                  },
                  {
                    "$type": "Group",
                    "elements": [
                      {
                        "$type": "Keyword",
                        "value": ","
                      },
                      {
                        "$type": "Assignment",
                        "feature": "args",
                        "operator": "+=",
                        "terminal": {
                          "$type": "Alternatives",
                          "elements": [
                            {
                              "$type": "RuleCall",
                              "rule": {
                                "$ref": "#/rules@183"
                              },
                              "arguments": []
                            },
                            {
                              "$type": "Keyword",
                              "value": "*"
                            }
                          ]
                        }
                      }
                    ],
                    "cardinality": "*"
                  }
                ],
                "cardinality": "?"
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "LabelReference",
      "definition": {
        "$type": "Assignment",
        "feature": "label",
        "operator": "=",
        "terminal": {
          "$type": "CrossReference",
          "type": {
            "$ref": "#/rules@17"
          },
          "terminal": {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@205"
            },
            "arguments": []
          },
          "deprecatedSyntax": false
        }
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "UnaryExpression",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "op",
            "operator": "=",
            "terminal": {
              "$type": "Alternatives",
              "elements": [
                {
                  "$type": "Keyword",
                  "value": "+"
                },
                {
                  "$type": "Keyword",
                  "value": "-"
                },
                {
                  "$type": "Keyword",
                  "value": "¬"
                },
                {
                  "$type": "Keyword",
                  "value": "^"
                }
              ]
            }
          },
          {
            "$type": "Assignment",
            "feature": "expr",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "rule": {
                "$ref": "#/rules@183"
              },
              "arguments": []
            }
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "ConstantExpression",
      "definition": {
        "$type": "RuleCall",
        "rule": {
          "$ref": "#/rules@198"
        },
        "arguments": []
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "Literal",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "("
              },
              {
                "$type": "Assignment",
                "feature": "multiplier",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@206"
                  },
                  "arguments": []
                }
              },
              {
                "$type": "Keyword",
                "value": ")"
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "value",
            "operator": "=",
            "terminal": {
              "$type": "Alternatives",
              "elements": [
                {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@199"
                  },
                  "arguments": []
                },
                {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@200"
                  },
                  "arguments": []
                }
              ]
            }
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "StringLiteral",
      "definition": {
        "$type": "Assignment",
        "feature": "value",
        "operator": "=",
        "terminal": {
          "$type": "RuleCall",
          "rule": {
            "$ref": "#/rules@210"
          },
          "arguments": []
        }
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "NumberLiteral",
      "definition": {
        "$type": "Assignment",
        "feature": "value",
        "operator": "=",
        "terminal": {
          "$type": "RuleCall",
          "rule": {
            "$ref": "#/rules@206"
          },
          "arguments": []
        }
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "FQN",
      "dataType": "string",
      "definition": {
        "$type": "Group",
        "elements": [
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@205"
            },
            "arguments": []
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": "."
              },
              {
                "$type": "RuleCall",
                "rule": {
                  "$ref": "#/rules@205"
                },
                "arguments": []
              }
            ],
            "cardinality": "*"
          }
        ]
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "ParserRule",
      "name": "FeatureID",
      "dataType": "string",
      "definition": {
        "$type": "RuleCall",
        "rule": {
          "$ref": "#/rules@205"
        },
        "arguments": []
      },
      "definesHiddenTokens": false,
      "entry": false,
      "fragment": false,
      "hiddenTokens": [],
      "parameters": [],
      "wildcard": false
    },
    {
      "$type": "TerminalRule",
      "hidden": true,
      "name": "WS",
      "definition": {
        "$type": "RegexToken",
        "regex": "/\\\\s+/"
      },
      "fragment": false
    },
    {
      "$type": "TerminalRule",
      "name": "ExecFragment",
      "definition": {
        "$type": "RegexToken",
        "regex": "/(?<=EXEC\\\\s*)[a-zA-Z]+\\\\s[^;]*/i"
      },
      "fragment": false,
      "hidden": false
    },
    {
      "$type": "TerminalRule",
      "name": "ID",
      "definition": {
        "$type": "RegexToken",
        "regex": "/[$@#_a-zA-Z][\\\\w_$@#]*/"
      },
      "fragment": false,
      "hidden": false
    },
    {
      "$type": "TerminalRule",
      "name": "NUMBER",
      "definition": {
        "$type": "TerminalGroup",
        "elements": [
          {
            "$type": "TerminalRuleCall",
            "rule": {
              "$ref": "#/rules@208"
            }
          },
          {
            "$type": "RegexToken",
            "regex": "/([bB]|[iI])*/"
          }
        ]
      },
      "fragment": false,
      "hidden": false,
      "$comment": "/**\\n * Includes both fixed and non-fixed (with and without mantissa)\\n */"
    },
    {
      "$type": "TerminalRule",
      "fragment": true,
      "name": "NUM",
      "definition": {
        "$type": "RegexToken",
        "regex": "/([0-9][0-9_]*(\\\\.[0-9_]+)?)|(\\\\.[0-9_]+)/"
      },
      "hidden": false
    },
    {
      "$type": "TerminalRule",
      "fragment": true,
      "name": "FULL_NUM",
      "definition": {
        "$type": "TerminalGroup",
        "elements": [
          {
            "$type": "TerminalRuleCall",
            "rule": {
              "$ref": "#/rules@207"
            }
          },
          {
            "$type": "TerminalRuleCall",
            "rule": {
              "$ref": "#/rules@209"
            },
            "cardinality": "?"
          }
        ]
      },
      "hidden": false
    },
    {
      "$type": "TerminalRule",
      "fragment": true,
      "name": "MANTISSA",
      "definition": {
        "$type": "RegexToken",
        "regex": "/[eEsSdDqQ][-+]?[0-9]+/"
      },
      "hidden": false
    },
    {
      "$type": "TerminalRule",
      "name": "STRING_TERM",
      "definition": {
        "$type": "RegexToken",
        "regex": "/(\\"(\\"\\"|\\\\\\\\.|[^\\"\\\\\\\\])*\\"|'(''|\\\\\\\\.|[^'\\\\\\\\])*')([xX][nN]|[xX][uU]|[xX]|[aA]|[eE]|[bB]4|[bB]3|[bB][xX]|[bB]|[gG][xX]|[gG]|[uU][xX]|[wW][xX]|[iI])*/"
      },
      "fragment": false,
      "hidden": false
    },
    {
      "$type": "TerminalRule",
      "hidden": true,
      "name": "ML_COMMENT",
      "definition": {
        "$type": "RegexToken",
        "regex": "/\\\\/\\\\*[\\\\s\\\\S]*?\\\\*\\\\//"
      },
      "fragment": false
    },
    {
      "$type": "TerminalRule",
      "hidden": true,
      "name": "SL_COMMENT",
      "definition": {
        "$type": "RegexToken",
        "regex": "/\\\\/\\\\/[^\\\\n\\\\r]*/"
      },
      "fragment": false
    }
  ],
  "types": [
    {
      "$type": "Type",
      "name": "NamedElement",
      "type": {
        "$type": "UnionType",
        "types": [
          {
            "$type": "SimpleType",
            "typeRef": {
              "$ref": "#/rules@152"
            }
          },
          {
            "$type": "SimpleType",
            "typeRef": {
              "$ref": "#/rules@61"
            }
          },
          {
            "$type": "SimpleType",
            "typeRef": {
              "$ref": "#/rules@15"
            }
          }
        ]
      }
    },
    {
      "$type": "Type",
      "name": "NamedType",
      "type": {
        "$type": "SimpleType",
        "typeRef": {
          "$ref": "#/rules@46"
        }
      }
    },
    {
      "$type": "Type",
      "name": "OrdinalType",
      "type": {
        "$type": "SimpleType",
        "typeRef": {
          "$ref": "#/rules@47"
        }
      }
    }
  ],
  "definesHiddenTokens": false,
  "hiddenTokens": [],
  "imports": [],
  "interfaces": [],
  "usedGrammars": [],
  "$comment": "/**\\n * This program and the accompanying materials are made available under the terms of the\\n * Eclipse Public License v2.0 which accompanies this distribution, and is available at\\n * https://www.eclipse.org/legal/epl-v20.html\\n *\\n * SPDX-License-Identifier: EPL-2.0\\n *\\n * Copyright Contributors to the Zowe Project.\\n *\\n */"
}`));const iP={languageId:"pli",fileExtensions:[".pli"],caseInsensitive:true,mode:"development"};const sP={AstReflection:()=>new sR};const aP={Grammar:()=>rP(),LanguageMetaData:()=>iP,parser:{}};function oP(t,e){const n=new Set;t.procedures.forEach((r,i)=>{if(!n.has(r)){n.add(r)}else{e("error",`The name '${r}' occurs more than once in the EXPORTS clause.`,{code:"IBM1324IE",node:t,property:"procedures",index:i})}})}function _u(t){return t.toUpperCase()}function lP(t,e){return _u(t)===_u(e)}function uP(t,e){const n=t.options.flatMap(i=>i.items);const r=n.find(i=>eP(i)&&i.value.toUpperCase()==="NODESCRIPTOR");if(r){const i=new Set(t.parameters.map(a=>_u(a.id)));const s=t.statements.filter(tP).map(a=>a.value).filter(Wk).flatMap(a=>a.items).filter(a=>zr(a.element)&&i.has(_u(a.element.name))).filter(a=>a.attributes.some(o=>Uk(o)&&lP(o.type,"NONCONNECTED")));if(s.length>0){e("error","The NODESCRIPTOR attribute is invalid when any parameters have the NONCONNECTED attribute.",{code:"IBM1388IE",node:r,property:"value"})}}}function cP(t,e){if(!zr(t.element.ref.ref)){return}const n=t.element.ref.ref.$container;if(!n.attributes.some(o=>qk(o)&&o.returns)){return}const r=ct(t);const i=ct(n);if(r!==i){return}const s=t.$cstNode.offset;const a=n.$cstNode.offset;if(s>a){return}e("error","Function cannot be used before the function's descriptor list has been scanned.",{code:"IBM1747IS",node:t,property:"element"})}const ug={IBM3332I:{code:"IBM3332I",severity:"W",message:"The END statement has no matching BEGIN, DO, PACKAGE, PROC, or SELECT. This may indicate a problem with the syntax of a previous statement.",fullCode:"IBM3332IW"},IBM1078I:{code:"IBM1078I",severity:"W",message:"Statement may never be executed.",fullCode:"IBM1078IW"},IBM1079I:{code:"IBM1079I",severity:"W",message:"Too few arguments have been specified for the ENTRY  ${ENTRY name } .",fullCode:"IBM1079IW"},IBM1080I:{code:"IBM1080I",severity:"W",message:t=>`The keyword ${t} , which could form a complete statement, is accepted as a label name, but a colon may have been used where a semicolon was meant.`,fullCode:"IBM1080IW"},IBM1081I:{code:"IBM1081I",severity:"W",message:t=>`${t} expression should be scalar. Lower bounds assumed for any missing subscripts.`,fullCode:"IBM1081IW"},IBM1082I:{code:"IBM1082I",severity:"W",message:"Argument number  ${argument number }  in ENTRY reference  ${entry name }  is a scalar, but its declare specifies a structure.",fullCode:"IBM1082IW"},IBM1083I:{code:"IBM1083I",severity:"W",message:"Source in label assignment is inside a DO-loop, and an illegal jump into the loop may be attempted. Optimization will also be very inhibited.",fullCode:"IBM1083IW"},IBM1084I:{code:"IBM1084I",severity:"W",message:"Nonblanks after right margin are not allowed under RULES(NOLAXMARGINS).",fullCode:"IBM1084IW"},IBM1085I:{code:"IBM1085I",severity:"W",message:t=>`${t} may be unset when used.`,fullCode:"IBM1085IW"},IBM1086I:{code:"IBM1086I",severity:"W",message:t=>`${t} will be evaluated using long rather than extended routines.`,fullCode:"IBM1086IW"},IBM1087I:{code:"IBM1087I",severity:"W",message:t=>`FLOAT source is too big for its target. An appropriate HUGE value of ${t} is assumed.`,fullCode:"IBM1087IW"},IBM1088I:{code:"IBM1088I",severity:"W",message:"FLOAT literal is too big for its implicit precision. The E in the exponent will be replaced by a D.",fullCode:"IBM1088IW"},IBM1089I:{code:"IBM1089I",severity:"W",message:"Control variable in DO loop cannot exceed TO value, and loop may be infinite.",fullCode:"IBM1089IW"},IBM1090I:{code:"IBM1090I",severity:"W",message:"Constant used as locator qualifier.",fullCode:"IBM1090IW"},IBM1091I:{code:"IBM1091I",severity:"W",message:"FIXED BIN precision less than storage allows.",fullCode:"IBM1091IW"},IBM1092I:{code:"IBM1092I",severity:"W",message:"GOTO whose target is or may be in another block severely limits optimization.",fullCode:"IBM1092IW"},IBM1093I:{code:"IBM1093I",severity:"W",message:"PLIXOPT string is invalid. See related runtime message  ${message number } .",fullCode:"IBM1093IW"},IBM1094I:{code:"IBM1094I",severity:"W",message:(t,e)=>`Element ${t} in PLIXOPT is invalid. See related runtime message ${e} .`,fullCode:"IBM1094IW"},IBM1095I:{code:"IBM1095I",severity:"W",message:(t,e,n)=>`Element ${t} in PLIXOPT has been remapped to ${e} . See related runtime message ${n} .`,fullCode:"IBM1095IW"},IBM1096I:{code:"IBM1096I",severity:"W",message:t=>`STAE and SPIE in PLIXOPT is not supported. See related runtime message ${t} .`,fullCode:"IBM1096IW"},IBM1097I:{code:"IBM1097I",severity:"W",message:(t,e)=>`Scalar accepted as argument number ${t} in ENTRY reference ${e} although parameter description specifies an array.`,fullCode:"IBM1097IW"},IBM1098I:{code:"IBM1098I",severity:"W",message:"Extraneous comma at end of statement ignored.",fullCode:"IBM1098IW"},IBM1099I:{code:"IBM1099I",severity:"W",message:(t,e,n,r)=>`FIXED DEC( ${t} , ${e} ) operand will be converted to FIXED BIN( ${n} , ${r} ). Significant digits may be lost.`,fullCode:"IBM1099IW"},IBM1100I:{code:"IBM1100I",severity:"W",message:t=>`The attribute ${t} is not valid on BEGIN blocks and is ignored.`,fullCode:"IBM1100IW"},IBM1101I:{code:"IBM1101I",severity:"W",message:t=>`${t} is not a known PROCEDURE attribute and is ignored.`,fullCode:"IBM1101IW"},IBM1102I:{code:"IBM1102I",severity:"W",message:t=>`${t} is not a known BEGIN attribute and is ignored.`,fullCode:"IBM1102IW"},IBM1103I:{code:"IBM1103I",severity:"W",message:t=>`${t} is not a supported compiler option and is ignored.`,fullCode:"IBM1103IW"},IBM1104I:{code:"IBM1104I",severity:"W",message:t=>`Suboptions of the compiler option ${t} are not supported and are ignored.`,fullCode:"IBM1104IW"},IBM1105I:{code:"IBM1105I",severity:"W",message:(t,e)=>`A suboption of the compiler option ${t} is too long. It is shortened to length ${e} .`,fullCode:"IBM1105IW"},IBM1106I:{code:"IBM1106I",severity:"W",message:t=>`Condition prefixes on ${t} statements are ignored.`,fullCode:"IBM1106IW"},IBM1107I:{code:"IBM1107I",severity:"W",message:t=>`${t} is not a known ENTRY statement attribute and is ignored.`,fullCode:"IBM1107IW"},IBM1108I:{code:"IBM1108I",severity:"W",message:(t,e)=>`The character ${t} specified in the ${e} option is already defined and may not be redefined. The redefinition will be ignored.`,fullCode:"IBM1108IW"},IBM1109I:{code:"IBM1109I",severity:"W",message:"The second argument in the C- format item will be ignored.",fullCode:"IBM1109IW"},IBM1110I:{code:"IBM1110I",severity:"W",message:"The INCLUDE statement should be on a line by itself. The source on the line after the INCLUDE statement is ignored.",fullCode:"IBM1110IW"},IBM1111I:{code:"IBM1111I",severity:"W",message:"CHECK prefix is not supported and is ignored.",fullCode:"IBM1111IW"},IBM1112I:{code:"IBM1112I",severity:"W",message:t=>`${t} condition is not supported and is ignored.`,fullCode:"IBM1112IW"},IBM1113I:{code:"IBM1113I",severity:"W",message:t=>`${t} statement is not supported and is ignored.`,fullCode:"IBM1113IW"},IBM1114I:{code:"IBM1114I",severity:"W",message:"Comparands are both constant.",fullCode:"IBM1114IW"},IBM1115I:{code:"IBM1115I",severity:"W",message:(t,e,n)=>`INITIAL list contains ${t} items, but the array ${e} contains only ${n} . Excess is ignored.`,fullCode:"IBM1115IW"},IBM1116I:{code:"IBM1116I",severity:"W",message:"Comment spans more than one file.",fullCode:"IBM1116IW"},IBM1117I:{code:"IBM1117I",severity:"W",message:"String spans more than one file.",fullCode:"IBM1117IW"},IBM1118I:{code:"IBM1118I",severity:"W",message:(t,e)=>`Delimiter missing between ${t} and ${e} . A blank is assumed.`,fullCode:"IBM1118IW"},IBM1119I:{code:"IBM1119I",severity:"W",message:t=>`Code generated for DO group would be more efficient if control variable ${t} were not an aggregate member.`,fullCode:"IBM1119IW"},IBM1120I:{code:"IBM1120I",severity:"W",message:"Multiple closure of groups. END statements will be inserted to close intervening groups.",fullCode:"IBM1120IW"},IBM1121I:{code:"IBM1121I",severity:"W",message:t=>`Missing ${t} assumed.`,fullCode:"IBM1121IW"},IBM1122I:{code:"IBM1122I",severity:"W",message:(t,e)=>`Missing ${t} assumed before ${e} .`,fullCode:"IBM1122IW"},IBM1123I:{code:"IBM1123I",severity:"W",message:(t,e)=>`The ENVIRONMENT option ${t} has been specified without a suboption. The option ${e} is ignored.`,fullCode:"IBM1123IW"},IBM1124I:{code:"IBM1124I",severity:"W",message:"A suboption has been specified for the ENVIRONMENT option  ${option name } . The suboption will be ignored.",fullCode:"IBM1124IW"},IBM1125I:{code:"IBM1125I",severity:"W",message:"The ENVIRONMENT option  ${option name }  has been specified more than once.",fullCode:"IBM1125IW"},IBM1126I:{code:"IBM1126I",severity:"W",message:"The ENVIRONMENT option  ${option name }  has an invalid suboption. The option will be ignored.",fullCode:"IBM1126IW"},IBM1127I:{code:"IBM1127I",severity:"W",message:t=>`${t} is not a known ENVIRONMENT option. It will be ignored.`,fullCode:"IBM1127IW"},IBM1128I:{code:"IBM1128I",severity:"W",message:"The ENVIRONMENT option  ${option name }  conflicts with the LANGLVL compiler option. The option will be ignored.",fullCode:"IBM1128IW"},IBM1129I:{code:"IBM1129I",severity:"W",message:(t,e)=>`${t} ${e} statement ignored up to closing semicolon.`,fullCode:"IBM1129IW"},IBM1130I:{code:"IBM1130I",severity:"W",message:(t,e)=>`The external name ${t} is too long. It will be shortened to ${e} .`,fullCode:"IBM1130IW"},IBM1131I:{code:"IBM1131I",severity:"W",message:t=>`An EXTERNAL name specification for ${t} has been specified on its PROCEDURE statement and in the EXPORTS clause of the PACKAGE statement. The EXPORTS specification will be used.`,fullCode:"IBM1131IW"},IBM1132I:{code:"IBM1132I",severity:"W",message:t=>`An EXTERNAL name specification for ${t} has been specified in its declaration and in the RESERVES clause of the PACKAGE statement. The RESERVES specification will be used.`,fullCode:"IBM1132IW"},IBM1133I:{code:"IBM1133I",severity:"W",message:t=>`The FORMAT CONSTANT array ${t} is not fully initialized.`,fullCode:"IBM1133IW"},IBM1134I:{code:"IBM1134I",severity:"W",message:"The LABEL CONSTANT array  ${label reference }  is not fully initialized.",fullCode:"IBM1134IW"},IBM1135I:{code:"IBM1135I",severity:"W",message:"Logical operand is constant.",fullCode:"IBM1135IW"},IBM1136I:{code:"IBM1136I",severity:"W",message:"Function invoked as a subroutine.",fullCode:"IBM1136IW"},IBM1137I:{code:"IBM1137I",severity:"W",message:t=>`The attribute ${t} is invalid in GENERIC descriptions and will be ignored.`,fullCode:"IBM1137IW"},IBM1138I:{code:"IBM1138I",severity:"W",message:(t,e,n)=>`Number of items in INITIAL list is ${t} for the array ${e} which contains ${n} elements.`,fullCode:"IBM1138IW"},IBM1139I:{code:"IBM1139I",severity:"W",message:"Syntax of the CONTROL statement is incorrect.",fullCode:"IBM1139IW"},IBM1140I:{code:"IBM1140I",severity:"W",message:"Syntax of the LANGLVL option in the OPTION statement is incorrect.",fullCode:"IBM1140IW"},IBM1141I:{code:"IBM1141I",severity:"W",message:"Syntax of the NOPRINT statement is incorrect.",fullCode:"IBM1141IW"},IBM1142I:{code:"IBM1142I",severity:"W",message:"Syntax of the PAGE statement is incorrect.",fullCode:"IBM1142IW"},IBM1143I:{code:"IBM1143I",severity:"W",message:"Syntax of the PRINT statement is incorrect.",fullCode:"IBM1143IW"},IBM1144I:{code:"IBM1144I",severity:"W",message:"Number of lines specified with SKIP must be between 0 and 999 inclusive.",fullCode:"IBM1144IW"},IBM1145I:{code:"IBM1145I",severity:"W",message:"Syntax of the SKIP statement is incorrect.",fullCode:"IBM1145IW"},IBM1146I:{code:"IBM1146I",severity:"W",message:"Syntax of the TEST option in the OPTION statement is incorrect.",fullCode:"IBM1146IW"},IBM1147I:{code:"IBM1147I",severity:"W",message:"Syntax of the NOTEST option in the OPTION statement is incorrect.",fullCode:"IBM1147IW"},IBM1148I:{code:"IBM1148I",severity:"W",message:"Syntax of the PUSH statement is incorrect.",fullCode:"IBM1148IW"},IBM1149I:{code:"IBM1149I",severity:"W",message:"Syntax of the POP statement is incorrect.",fullCode:"IBM1149IW"},IBM1150I:{code:"IBM1150I",severity:"W",message:"Syntax of the NOTE statement is incorrect.",fullCode:"IBM1150IW"},IBM1151I:{code:"IBM1151I",severity:"W",message:t=>`FIXED BINARY precision is reduced to ${t} .`,fullCode:"IBM1151IW"},IBM1152I:{code:"IBM1152I",severity:"W",message:t=>`FIXED DECIMAL precision is reduced to ${t} .`,fullCode:"IBM1152IW"},IBM1153I:{code:"IBM1153I",severity:"W",message:t=>`FLOAT BINARY precision is reduced to ${t} .`,fullCode:"IBM1153IW"},IBM1154I:{code:"IBM1154I",severity:"W",message:t=>`FLOAT DECIMAL precision is reduced to ${t} .`,fullCode:"IBM1154IW"},IBM1155I:{code:"IBM1155I",severity:"W",message:t=>`The aggregate ${t} contains noncomputational values. Those values will be ignored.`,fullCode:"IBM1155IW"},IBM1156I:{code:"IBM1156I",severity:"W",message:"Arguments to MAIN PROCEDURE are not all POINTER.",fullCode:"IBM1156IW"},IBM1157I:{code:"IBM1157I",severity:"W",message:t=>`${t}`,fullCode:"IBM1157IW"},IBM1158I:{code:"IBM1158I",severity:"W",message:(t,e)=>`A ${t} is missing in the specification of the ${e} option. One is assumed.`,fullCode:"IBM1158IW"},IBM1159I:{code:"IBM1159I",severity:"W",message:t=>`The string ${t} is not recognized as a valid option keyword and is ignored.`,fullCode:"IBM1159IW"},IBM1160I:{code:"IBM1160I",severity:"W",message:"The third argument to the MARGINS option is not supported.",fullCode:"IBM1160IW"},IBM1161I:{code:"IBM1161I",severity:"W",message:(t,e)=>`The suboption ${t} is not valid for the ${e} compiler option.`,fullCode:"IBM1161IW"},IBM1162I:{code:"IBM1162I",severity:"W",message:t=>`A required suboption is missing for the ${t} option.`,fullCode:"IBM1162IW"},IBM1163I:{code:"IBM1163I",severity:"W",message:t=>`Required sub-fields are missing for the ${t} option. Default values are assumed.`,fullCode:"IBM1163IW"},IBM1164I:{code:"IBM1164I",severity:"W",message:t=>`${t} should be specified within OPTIONS, but is accepted as is.`,fullCode:"IBM1164IW"},IBM1165I:{code:"IBM1165I",severity:"W",message:t=>`The OPTIONS option ${t} has been specified more than once.`,fullCode:"IBM1165IW"},IBM1166I:{code:"IBM1166I",severity:"W",message:(t,e,n)=>`${t} is not a known ${e} suboption. The ${n} option will be ignored.`,fullCode:"IBM1166IW"},IBM1167I:{code:"IBM1167I",severity:"W",message:"Maximum number of PUSH statements exceeded. The control statement is ignored.",fullCode:"IBM1167IW"},IBM1168I:{code:"IBM1168I",severity:"W",message:"No PUSH statements are in effect. The POP control statement is ignored.",fullCode:"IBM1168IW"},IBM1169I:{code:"IBM1169I",severity:"W",message:t=>`No precision was specified for the result of the ${t} built- in function. The precision will be determined from the argument.`,fullCode:"IBM1169IW"},IBM1170I:{code:"IBM1170I",severity:"W",message:"The OPTIONS attribute  ${option attribute }  is not supported and is ignored.",fullCode:"IBM1170IW"},IBM1171I:{code:"IBM1171I",severity:"W",message:"SELECT statement contains no WHEN or OTHERWISE clauses.",fullCode:"IBM1171IW"},IBM1172I:{code:"IBM1172I",severity:"W",message:t=>`A zero length string has been entered for the ${t} option. The option is ignored.`,fullCode:"IBM1172IW"},IBM1173I:{code:"IBM1173I",severity:"W",message:"SELECT statement contains no WHEN clauses.",fullCode:"IBM1173IW"},IBM1174I:{code:"IBM1174I",severity:"W",message:"The reference in the  ${frominto clause }  clause may not be byte- aligned.",fullCode:"IBM1174IW"},IBM1175I:{code:"IBM1175I",severity:"W",message:"FIXED BINARY constant contains too many digits. Excess nonsignificant digits will be ignored.",fullCode:"IBM1175IW"},IBM1176I:{code:"IBM1176I",severity:"W",message:"FIXED DECIMAL constant contains too many digits. Excess nonsignificant digits will be ignored.",fullCode:"IBM1176IW"},IBM1177I:{code:"IBM1177I",severity:"W",message:"Mantissa in FLOAT BINARY constant contains more digits than the implementation maximum. Excess nonsignificant digits will be ignored.",fullCode:"IBM1177IW"},IBM1178I:{code:"IBM1178I",severity:"W",message:"Mantissa in FLOAT DECIMAL constant contains more digits than the implementation maximum. Excess nonsignificant digits will be ignored.",fullCode:"IBM1178IW"},IBM1179I:{code:"IBM1179I",severity:"W",message:"FLOAT literal is too big for its implicit precision. An appropriate HUGE value is assumed.",fullCode:"IBM1179IW"},IBM1180I:{code:"IBM1180I",severity:"W",message:t=>`Argument to ${t} is not byte aligned.`,fullCode:"IBM1180IW"},IBM1181I:{code:"IBM1181I",severity:"W",message:"A WHILE or UNTIL option at the end of a series of DO specifications applies only to the last specification.",fullCode:"IBM1181IW"},IBM1182I:{code:"IBM1182I",severity:"W",message:"Invocation of a NONRECURSIVE PROCEDURE from within that PROCEDURE is invalid. RECURSIVE attribute is assumed.",fullCode:"IBM1182IW"},IBM1183I:{code:"IBM1183I",severity:"W",message:t=>`${t} condition is disabled. Statement is ignored.`,fullCode:"IBM1183IW"},IBM1184I:{code:"IBM1184I",severity:"W",message:(t,e,n)=>`Source with length ${t} in INITIAL clause for ${e} has length greater than the length ${n} of that INITIAL variable.`,fullCode:"IBM1184IW"},IBM1185I:{code:"IBM1185I",severity:"W",message:t=>`Source with length ${t} in RETURN statement has length greater than that in the corresponding RETURNS attribute.`,fullCode:"IBM1185IW"},IBM1186I:{code:"IBM1186I",severity:"W",message:(t,e)=>`Source with length ${t} in string assignment has length greater than the length ${e} of the target.`,fullCode:"IBM1186IW"},IBM1187I:{code:"IBM1187I",severity:"W",message:(t,e,n)=>`Argument number ${t} in ENTRY reference ${e} has length ${n} which is greater than that of the corresponding parameter.`,fullCode:"IBM1187IW"},IBM1188I:{code:"IBM1188I",severity:"W",message:"Result of concatenating two strings is too long.",fullCode:"IBM1188IW"},IBM1189I:{code:"IBM1189I",severity:"W",message:t=>`NODESCRIPTOR attribute conflicts with the NONCONNECTED attribute for the parameter ${t} . CONNECTED is assumed.`,fullCode:"IBM1189IW"},IBM1190I:{code:"IBM1190I",severity:"W",message:t=>`The OPTIONS option ${t} conflicts with the LANGLVL compiler option. The option will be applied.`,fullCode:"IBM1190IW"},IBM1191I:{code:"IBM1191I",severity:"W",message:"Result of FIXED BIN divide will not be scaled.",fullCode:"IBM1191IW"},IBM1192I:{code:"IBM1192I",severity:"W",message:"WHEN clauses contain duplicate values.",fullCode:"IBM1192IW"},IBM1193I:{code:"IBM1193I",severity:"W",message:(t,e)=>`${t} statements in block ${e} .`,fullCode:"IBM1193IW"},IBM1194I:{code:"IBM1194I",severity:"W",message:"More than one argument to MAIN PROCEDURE.",fullCode:"IBM1194IW"},IBM1195I:{code:"IBM1195I",severity:"W",message:"Argument to MAIN PROCEDURE is not CHARACTER VARYING.",fullCode:"IBM1195IW"},IBM1196I:{code:"IBM1196I",severity:"W",message:"AREA initialized with EMPTY - INITIAL attribute is ignored.",fullCode:"IBM1196IW"},IBM1197I:{code:"IBM1197I",severity:"W",message:t=>`${t} assumed as file condition reference.`,fullCode:"IBM1197IW"},IBM1198I:{code:"IBM1198I",severity:"W",message:t=>`A null argument list is assumed for ${t} .`,fullCode:"IBM1198IW"},IBM1199I:{code:"IBM1199I",severity:"W",message:"Syntax of the LINE directive is incorrect.",fullCode:"IBM1199IW"},IBM1200I:{code:"IBM1200I",severity:"W",message:"Use of DATE built-in function may cause problems.",fullCode:"IBM1200IW"},IBM1201I:{code:"IBM1201I",severity:"W",message:(t,e)=>`${t} conflicts with a previously specified suboption for the ${e} compiler option.`,fullCode:"IBM1201IW"},IBM1202I:{code:"IBM1202I",severity:"W",message:"Syntax of the OPTION statement is incorrect.",fullCode:"IBM1202IW"},IBM1203I:{code:"IBM1203I",severity:"W",message:"Argument to PLITEST is ignored.",fullCode:"IBM1203IW"},IBM1204I:{code:"IBM1204I",severity:"W",message:"INTERNAL CONSTANT assumed for initialized STATIC LABEL.",fullCode:"IBM1204IW"},IBM1205I:{code:"IBM1205I",severity:"W",message:t=>`Arguments of the ${t} compiler option must be the same length.`,fullCode:"IBM1205IW"},IBM1206I:{code:"IBM1206I",severity:"W",message:"BIT operators should be applied only to BIT operands.",fullCode:"IBM1206IW"},IBM1207I:{code:"IBM1207I",severity:"W",message:"Operand to LENGTH built-in function should have string type.",fullCode:"IBM1207IW"},IBM1208I:{code:"IBM1208I",severity:"W",message:"INITIAL list for the array  ${variable name }  contains only one item.",fullCode:"IBM1208IW"},IBM1209I:{code:"IBM1209I",severity:"W",message:t=>`INDEXED environment option for file ${t} will be treated as ORGANIZATION(INDEXED).`,fullCode:"IBM1209IW"},IBM1210I:{code:"IBM1210I",severity:"W",message:t=>`The field width specified in the ${t} -format item may be too small for complete output of the data item.`,fullCode:"IBM1210IW"},IBM1211I:{code:"IBM1211I",severity:"W",message:(t,e,n)=>`Source with length ${t} in string assignment has length greater than the length ${e} of the target ${n} .`,fullCode:"IBM1211IW"},IBM1212I:{code:"IBM1212I",severity:"W",message:"The A format item requires an argument when used in GET statement. An L format item is assumed in its place.",fullCode:"IBM1212IW"},IBM1213I:{code:"IBM1213I",severity:"W",message:t=>`The PROCEDURE ${t} is not referenced.`,fullCode:"IBM1213IW"},IBM1214I:{code:"IBM1214I",severity:"W",message:(t,e)=>`A dummy argument will be created for argument number ${t} in ENTRY reference ${e} .`,fullCode:"IBM1214IW"},IBM1215I:{code:"IBM1215I",severity:"W",message:t=>`The variable ${t} is declared without any data attributes.`,fullCode:"IBM1215IW"},IBM1216I:{code:"IBM1216I",severity:"W",message:"The structure member  ${variable name }  is declared without any data attributes. A level number may be incorrect.",fullCode:"IBM1216IW"},IBM1217I:{code:"IBM1217I",severity:"W",message:"An unnamed structure member is declared without any data attributes. A level number may be incorrect.",fullCode:"IBM1217IW"},IBM1218I:{code:"IBM1218I",severity:"W",message:t=>`First argument to ${t} built-in function should have string type.`,fullCode:"IBM1218IW"},IBM1219I:{code:"IBM1219I",severity:"W",message:"LEAVE will exit noniterative DO- group.",fullCode:"IBM1219IW"},IBM1220I:{code:"IBM1220I",severity:"W",message:"Result of comparison is always constant.",fullCode:"IBM1220IW"},IBM1221I:{code:"IBM1221I",severity:"W",message:t=>`Statement uses ${t} bytes for temporaries.`,fullCode:"IBM1221IW"},IBM1222I:{code:"IBM1222I",severity:"W",message:"Comparison involving 2-digit year is problematic.",fullCode:"IBM1222IW"},IBM1223I:{code:"IBM1223I",severity:"W",message:"Literal in comparison interpreted with DATE attribute.",fullCode:"IBM1223IW"},IBM1224I:{code:"IBM1224I",severity:"W",message:"DATE attribute ignored in comparison with non-date literal.",fullCode:"IBM1224IW"},IBM1225I:{code:"IBM1225I",severity:"W",message:"DATE attribute ignored in conversion from literal.",fullCode:"IBM1225IW"},IBM2600I:{code:"IBM2600I",severity:"W",message:"Compiler backend issued warning messages to STDOUT.",fullCode:"IBM2600IW"},IBM2601I:{code:"IBM2601I",severity:"W",message:(t,e)=>`Missing ${t} assumed before ${e} . DECLARE and other nonexecutable statements should not have labels.`,fullCode:"IBM2601IW"},IBM2602I:{code:"IBM2602I",severity:"W",message:(t,e,n)=>`Number of items in INITIAL list is ${t} for the array ${e} which contains ${n} elements.`,fullCode:"IBM2602IW"},IBM2603I:{code:"IBM2603I",severity:"W",message:"INITIAL list for the array  ${variable name }  contains only one item.",fullCode:"IBM2603IW"},IBM2604I:{code:"IBM2604I",severity:"W",message:(t,e,n,r)=>`FIXED DEC( ${t} , ${e} ) will be converted to FIXED DEC( ${n} , ${r} ). Significant digits may be lost.`,fullCode:"IBM2604IW"},IBM2605I:{code:"IBM2605I",severity:"W",message:"Invalid carriage control character. Blank assumed.",fullCode:"IBM2605IW"},IBM2606I:{code:"IBM2606I",severity:"W",message:t=>`Code generated for the REFER object ${t} would be more efficient if the REFER object had the attributes REAL FIXED BIN(p,0).`,fullCode:"IBM2606IW"},IBM2607I:{code:"IBM2607I",severity:"W",message:(t,e,n,r)=>`PICTURE representing FIXED DEC( ${t} , ${e} ) will be converted to FIXED DEC( ${n} , ${r} ). Significant digits may be lost.`,fullCode:"IBM2607IW"},IBM2608I:{code:"IBM2608I",severity:"W",message:(t,e,n,r)=>`PICTURE representing FIXED DEC( ${t} , ${e} ) will be converted to PICTURE representing FIXED DEC( ${n} , ${r} ). Significant digits may be lost.`,fullCode:"IBM2608IW"},IBM2609I:{code:"IBM2609I",severity:"W",message:(t,e)=>`Comment contains a semicolon on line ${t} . ${e} .`,fullCode:"IBM2609IW"},IBM2610I:{code:"IBM2610I",severity:"W",message:t=>`One argument to ${t} built-in function is FIXED DEC while the other is FIXED BIN. Compiler will not interpret precision as FIXED DEC.`,fullCode:"IBM2610IW"},IBM2611I:{code:"IBM2611I",severity:"W",message:t=>`The binary value ${t} appears in more than one WHEN clause.`,fullCode:"IBM2611IW"},IBM2612I:{code:"IBM2612I",severity:"W",message:"The character string  ${character string }  appears in more than one WHEN clause.",fullCode:"IBM2612IW"},IBM2613I:{code:"IBM2613I",severity:"W",message:t=>`RULES(NOLAXINOUT) violation: ${t} is being passed as an INOUT parameter, but may be unset.`,fullCode:"IBM2613IW"},IBM2614I:{code:"IBM2614I",severity:"W",message:"Both comparands are Booleans.",fullCode:"IBM2614IW"},IBM2615I:{code:"IBM2615I",severity:"W",message:"DO-loop will always execute exactly once. A semicolon after the DO may be missing.",fullCode:"IBM2615IW"},IBM2616I:{code:"IBM2616I",severity:"W",message:t=>`Size of parameter ${t} will return the currentsize value since no descriptor is available.`,fullCode:"IBM2616IW"},IBM2617I:{code:"IBM2617I",severity:"W",message:"Passing a LABEL to a non-PL/I routine is very poor coding practice and will cause the compiler to generate less than optimal code.",fullCode:"IBM2617IW"},IBM2618I:{code:"IBM2618I",severity:"W",message:(t,e,n)=>`The suboption ${t} is not valid for the suboption ${e} of the ${n} compiler option.`,fullCode:"IBM2618IW"},IBM2620I:{code:"IBM2620I",severity:"W",message:"Target structure contains REFER objects. Results are undefined if the assignment changes any REFER object.",fullCode:"IBM2620IW"},IBM2621I:{code:"IBM2621I",severity:"W",message:"ON ERROR block does not start with ON ERROR SYSTEM. An error inside the block may lead to an infinite loop.",fullCode:"IBM2621IW"},IBM2622I:{code:"IBM2622I",severity:"W",message:"ENTRY used to set the initial value in a DO loop will be invoked after any TO or BY values are set.",fullCode:"IBM2622IW"},IBM2623I:{code:"IBM2623I",severity:"W",message:"Mixing FIXED BIN and FLOAT DEC produces a FLOAT BIN result. Under DFP, this will lead to poor performance.",fullCode:"IBM2623IW"},IBM2624I:{code:"IBM2624I",severity:"W",message:"Mixing BIT and FLOAT DEC produces a FLOAT BIN result.  27 Under DFP, this will lead to poor performance.",fullCode:"IBM2624IW"},IBM2625I:{code:"IBM2625I",severity:"W",message:"Mixing FLOAT BIN and FLOAT DEC produces a FLOAT BIN result. Under DFP, this will lead to poor performance.",fullCode:"IBM2625IW"},IBM2626I:{code:"IBM2626I",severity:"W",message:"Use of SUBSTR with a third argument equal to 0 is somewhat pointless since the result will always be a null string.",fullCode:"IBM2626IW"},IBM2627I:{code:"IBM2627I",severity:"W",message:t=>`No metadata will be generated for the structure ${t} since its use of REFER is too complex.`,fullCode:"IBM2627IW"},IBM2628I:{code:"IBM2628I",severity:"W",message:"BYVALUE parameters should ideally be no larger than 32 bytes.",fullCode:"IBM2628IW"},IBM2629I:{code:"IBM2629I",severity:"W",message:t=>`No debug symbol information will be generated for ${t} .`,fullCode:"IBM2629IW"},IBM2630I:{code:"IBM2630I",severity:"W",message:(t,e,n)=>`The operands in an arithmetic operation have the attributes ${t} and ${e} which will produce a result with the attributes ${n} . This means that its scale factor is greater than its precision! That may lead to an overflow and unexpected results.`,fullCode:"IBM2630IW"},IBM2631I:{code:"IBM2631I",severity:"W",message:t=>`One argument to ${t} built-in function is FIXED DEC while the other is FLOAT BIN. Compiler will not interpret precision as FIXED DEC.`,fullCode:"IBM2631IW"},IBM2632I:{code:"IBM2632I",severity:"W",message:t=>`One argument to ${t} built-in function is FIXED DEC while the other is FLOAT DEC. Compiler will not interpret precision as FIXED DEC.`,fullCode:"IBM2632IW"},IBM2633I:{code:"IBM2633I",severity:"W",message:"Given the support for addressing arithmetic, basing a POINTER or OFFSET on a FIXED BIN is unnecessary, and it will also fail to work properly if the size of a POINTER changes.",fullCode:"IBM2633IW"},IBM2634I:{code:"IBM2634I",severity:"W",message:"Given the support for addressing arithmetic, basing a FIXED BIN on a POINTER or OFFSET is unnecessary, and it will also fail to work properly if the size of a POINTER changes.",fullCode:"IBM2634IW"},IBM2635I:{code:"IBM2635I",severity:"W",message:(t,e,n)=>`The operands in an arithmetic operation have the attributes ${t} and ${e} which will produce a result with the attributes ${n} . This means that its scale factor is negative! That may lead to the loss of significant digits and unexpected results.`,fullCode:"IBM2635IW"},IBM2636I:{code:"IBM2636I",severity:"W",message:t=>`The ordinal ${t} appears in more than one WHEN clause.`,fullCode:"IBM2636IW"},IBM2637I:{code:"IBM2637I",severity:"W",message:"An ENTRY invoked as a function should have the RETURNS attribute.",fullCode:"IBM2637IW"},IBM2638I:{code:"IBM2638I",severity:"W",message:t=>`Statement used ${t} intermediate language instructions.`,fullCode:"IBM2638IW"},IBM2639I:{code:"IBM2639I",severity:"W",message:t=>`Previous statement used ${t} intermediate language instructions.`,fullCode:"IBM2639IW"},IBM2640I:{code:"IBM2640I",severity:"W",message:"Target is a REFER object. Results are undefined if an assignment changes a REFER object.",fullCode:"IBM2640IW"},IBM2641I:{code:"IBM2641I",severity:"W",message:(t,e)=>`The suboption ${t} of the ${e} compiler option must be followed by a (possibly empty) parenthesized list.`,fullCode:"IBM2641IW"},IBM2642I:{code:"IBM2642I",severity:"W",message:"OPTIONS(REENTRANT) is ignored.",fullCode:"IBM2642IW"},IBM2643I:{code:"IBM2643I",severity:"W",message:t=>`The built-in function ${t} will be deprecated.`,fullCode:"IBM2643IW"},IBM2644I:{code:"IBM2644I",severity:"W",message:t=>`The INCLUDE file ${t} will be deprecated.`,fullCode:"IBM2644IW"},IBM2645I:{code:"IBM2645I",severity:"W",message:t=>`The ENTRY named ${t} will be deprecated.`,fullCode:"IBM2645IW"},IBM2646I:{code:"IBM2646I",severity:"W",message:t=>`The VARIABLE named ${t} will be deprecated.`,fullCode:"IBM2646IW"},IBM2647I:{code:"IBM2647I",severity:"W",message:t=>`The ${t} statement will be deprecated.`,fullCode:"IBM2647IW"},IBM2648I:{code:"IBM2648I",severity:"W",message:t=>`Declaration contains ${t} INITIAL items.`,fullCode:"IBM2648IW"},IBM2649I:{code:"IBM2649I",severity:"W",message:t=>`The binary value ${t} appears more than once in the INLIST argument set.`,fullCode:"IBM2649IW"},IBM2650I:{code:"IBM2650I",severity:"W",message:t=>`The ordinal ${t} appears more than once in the INLIST argument set.`,fullCode:"IBM2650IW"},IBM2651I:{code:"IBM2651I",severity:"W",message:(t,e)=>`Block ${t} contains ${e} branches.`,fullCode:"IBM2651IW"},IBM2652I:{code:"IBM2652I",severity:"W",message:"REINIT reference contains no element with an INITIAL attribute.",fullCode:"IBM2652IW"},IBM2653I:{code:"IBM2653I",severity:"W",message:"The list of preprocessor options must be enclosed in quotation marks.",fullCode:"IBM2653IW"},IBM2654I:{code:"IBM2654I",severity:"W",message:"INITIAL attribute for BASED on ADDR has no effect on the base variable.",fullCode:"IBM2654IW"},IBM2655I:{code:"IBM2655I",severity:"W",message:"Some options conflict with the non-overridable options.",fullCode:"IBM2655IW"},IBM2656I:{code:"IBM2656I",severity:"W",message:"Simple defining applies to  ${variable name } . If string-overlay defining is intended, then add POS(1) to its declaration.",fullCode:"IBM2656IW"},IBM2657I:{code:"IBM2657I",severity:"W",message:"Both logical AND operands are identical.",fullCode:"IBM2657IW"},IBM2658I:{code:"IBM2658I",severity:"W",message:"Both logical OR operands are identical.",fullCode:"IBM2658IW"},IBM2659I:{code:"IBM2659I",severity:"W",message:t=>`Generated code would be better if all the INITIAL attributes in the declare for ${t} were changed to VALUE.`,fullCode:"IBM2659IW"},IBM2660I:{code:"IBM2660I",severity:"W",message:(t,e)=>`Program logic may lead to the END statement for ${t} even though ${e} is a function that should return a value.`,fullCode:"IBM2660IW"},IBM2661I:{code:"IBM2661I",severity:"W",message:t=>`The string ${t} appears more than once in the INLIST argument set.`,fullCode:"IBM2661IW"},IBM2662I:{code:"IBM2662I",severity:"W",message:"INLIST argument set contains duplicate values.",fullCode:"IBM2662IW"},IBM2663I:{code:"IBM2663I",severity:"W",message:"WHEN clause contains an expression that matches the previous expression in the containing SELECT statement.",fullCode:"IBM2663IW"},IBM2664I:{code:"IBM2664I",severity:"W",message:t=>`WHEN clause contains an expression that matches the expression ${t} previous in the containing SELECT statement.`,fullCode:"IBM2664IW"},IBM2665I:{code:"IBM2665I",severity:"W",message:"EXTERNAL PLIXOPT declare specifies run-time options only if the variable has the attribute CHARACTER VARYING INITIAL and is not an array.",fullCode:"IBM2665IW"},IBM2666I:{code:"IBM2666I",severity:"W",message:"RETURN expression holds the address of a variable in AUTOMATIC storage.",fullCode:"IBM2666IW"},IBM2667I:{code:"IBM2667I",severity:"W",message:(t,e)=>`The string lengths in the declare for ${t} depend on the size of ${e} whose declare comes later in the block. Consider moving the first declare after the second.`,fullCode:"IBM2667IW"},IBM2668I:{code:"IBM2668I",severity:"W",message:(t,e)=>`Using the VALUE function with the structure type ${t} adds ${e} bytes to the generated object.`,fullCode:"IBM2668IW"},IBM2669I:{code:"IBM2669I",severity:"W",message:t=>`The ${t} attribute is ignored in an ALIAS definition.`,fullCode:"IBM2669IW"},IBM2670I:{code:"IBM2670I",severity:"W",message:"The parameter to MAIN should be declared as CHAR(*) VARYING.",fullCode:"IBM2670IW"},IBM2671I:{code:"IBM2671I",severity:"W",message:(t,e,n,r,i)=>`The variable ${t} is passed as argument number ${e} to entry ${n} . The corresponding parameter has the ${r} attribute, and hence the variable could be modified despite having the ${i} attribute.`,fullCode:"IBM2671IW"},IBM2672I:{code:"IBM2672I",severity:"W",message:t=>`If ${t} is constant, then removing its STATIC attribute and changing its INITIAL attribute to the VALUE attribute would improve the performance of the generated code.`,fullCode:"IBM2672IW"},IBM2673I:{code:"IBM2673I",severity:"W",message:"Boolean is compared with something other than a BIT(1) restricted expression.",fullCode:"IBM2673IW"},IBM2674I:{code:"IBM2674I",severity:"W",message:(t,e,n)=>`The defined structure ${t} is ${e} byte aligned, but occupies only ${n} bytes of storage. This may lead to addressing problems and data corruption.`,fullCode:"IBM2674IW"},IBM2675I:{code:"IBM2675I",severity:"W",message:"Use of PICTURE as DO control variable is not recommended.",fullCode:"IBM2675IW"},IBM2676I:{code:"IBM2676I",severity:"W",message:"Code generated for DO group would be more efficient if control variable had type FIXED BIN with zero scale factor.",fullCode:"IBM2676IW"},IBM2677I:{code:"IBM2677I",severity:"W",message:t=>`Generated code would be better if the declare for ${t} were changed from AUTOMATIC to STATIC NONASSIGNABLE.`,fullCode:"IBM2677IW"},IBM2678I:{code:"IBM2678I",severity:"W",message:"Loop will never be run. TO value may be incorrect.",fullCode:"IBM2678IW"},IBM2679I:{code:"IBM2679I",severity:"W",message:"GONUMBER(SEPARATE) changed to GONUMBER(NOSEPARATE) since the SEPARATE suboption for the GONUMBER option should be specified only when the TEST option and its SEPARATE suboption are also specified.",fullCode:"IBM2679IW"},IBM2680I:{code:"IBM2680I",severity:"W",message:"Code generated for DO group would perform better if control variable was STATIC or AUTOMATIC.",fullCode:"IBM2680IW"},IBM2681I:{code:"IBM2681I",severity:"W",message:(t,e)=>`Source has length ${t} which is greater than the length of the source pattern ${e} . Unless the source has enough leading blanks, invoking this REPATTERN will cause the ERROR condition to be raised. The required checking will also cause this REPATTERN not to be inlined.`,fullCode:"IBM2681IW"},IBM2682I:{code:"IBM2682I",severity:"W",message:(t,e)=>`The variable ${t} needs ${e} storage bytes which exceeds the MAXSTATIC limit.`,fullCode:"IBM2682IW"}};const cg={IBM1226I:{code:"IBM1226I",severity:"E",message:t=>`Area extent is reduced to ${t} .`,fullCode:"IBM1226IE"},IBM1227I:{code:"IBM1227I",severity:"E",message:(t,e)=>`${t} statement is not allowed where an executable statement is required. A null statement will be inserted before the ${e} statement.`,fullCode:"IBM1227IE"},IBM1228I:{code:"IBM1228I",severity:"E",message:"DEFAULT statement is not allowed where an executable statement is required. The DEFAULT statement will be enrolled in the current block, and a null statement will be inserted in its place.",fullCode:"IBM1228IE"},IBM1229I:{code:"IBM1229I",severity:"E",message:"FORMAT statement is not allowed where an executable statement is required. The FORMAT statement will be enrolled in the current block, and a null statement will be inserted in its place.",fullCode:"IBM1229IE"},IBM1230I:{code:"IBM1230I",severity:"E",message:t=>`Arguments have been specified for the variable ${t} , but it is not an entry variable.`,fullCode:"IBM1230IE"},IBM1231I:{code:"IBM1231I",severity:"E",message:"Arguments/subscripts have been specified for the variable  ${variable name } , but it is neither an entry nor an array variable.",fullCode:"IBM1231IE"},IBM1232I:{code:"IBM1232I",severity:"E",message:"RULES(NOLAXPUNC) violation: extraneous comma at end of statement ignored.",fullCode:"IBM1232IE"},IBM1233I:{code:"IBM1233I",severity:"E",message:t=>`RULES(NOLAXPUNC) violation: missing ${t} assumed.`,fullCode:"IBM1233IE"},IBM1234I:{code:"IBM1234I",severity:"E",message:(t,e)=>`RULES(NOLAXPUNC) violation: missing ${t} assumed before ${e} .`,fullCode:"IBM1234IE"},IBM1235I:{code:"IBM1235I",severity:"E",message:"No data format item in format list.",fullCode:"IBM1235IE"},IBM1236I:{code:"IBM1236I",severity:"E",message:t=>`Subscripts on ${t} labels are ignored.`,fullCode:"IBM1236IE"},IBM1237I:{code:"IBM1237I",severity:"E",message:t=>`EXTERNAL ENTRY attribute is assumed for ${t} .`,fullCode:"IBM1237IE"},IBM1238I:{code:"IBM1238I",severity:"E",message:t=>`The second argument to the ${t} built-in function is greater than the precision of the result.`,fullCode:"IBM1238IE"},IBM1239I:{code:"IBM1239I",severity:"E",message:t=>`The ${t} attribute is not supported and is ignored.`,fullCode:"IBM1239IE"},IBM1240I:{code:"IBM1240I",severity:"E",message:t=>`The ${t} attribute is invalid in a RETURNS descriptor.`,fullCode:"IBM1240IE"},IBM1241I:{code:"IBM1241I",severity:"E",message:"Equality and inequality are the only valid comparisons of COMPLEX numbers.",fullCode:"IBM1241IE"},IBM1242I:{code:"IBM1242I",severity:"E",message:"Equality and inequality are the only valid comparisons of program control data.",fullCode:"IBM1242IE"},IBM1243I:{code:"IBM1243I",severity:"E",message:"REGIONAL( ${integerspecification(2 or3) } ) ENVIRONMENT option is not supported.",fullCode:"IBM1243IE"},IBM1244I:{code:"IBM1244I",severity:"E",message:t=>`The variable specified as the ${t} value in an ENVIRONMENT option must be a STATIC scalar 36  with the attributes REAL FIXED BIN(31,0).`,fullCode:"IBM1244IE"},IBM1245I:{code:"IBM1245I",severity:"E",message:t=>`The variable specified as the ${t} value in an ENVIRONMENT option must be a STATIC scalar with the attribute CHARACTER.`,fullCode:"IBM1245IE"},IBM1246I:{code:"IBM1246I",severity:"E",message:t=>`Argument to ${t} built-in function should be CONNECTED.`,fullCode:"IBM1246IE"},IBM1247I:{code:"IBM1247I",severity:"E",message:"RULES(NOLAXCONV) violation: arithmetic operands should both be numeric.",fullCode:"IBM1247IE"},IBM1248I:{code:"IBM1248I",severity:"E",message:t=>`RULES(NOLAXCONV) violation: argument to ${t} built- in function should have arithmetic type.`,fullCode:"IBM1248IE"},IBM1249I:{code:"IBM1249I",severity:"E",message:t=>`Argument to ${t} built-in function should have CHARACTER type.`,fullCode:"IBM1249IE"},IBM1252I:{code:"IBM1252I",severity:"E",message:(t,e)=>`RULES(NOLAXCONV) violation: argument number ${t} to ${e} built-in function should have arithmetic type.`,fullCode:"IBM1252IE"},IBM1254I:{code:"IBM1254I",severity:"E",message:"RULES(NOLAXCONV) violation: arithmetic prefix operand should be numeric.",fullCode:"IBM1254IE"},IBM1272I:{code:"IBM1272I",severity:"E",message:(t,e)=>`Argument number ${t} to ${e} built-in function is negative. It will be changed to 0.`,fullCode:"IBM1272IE"},IBM1273I:{code:"IBM1273I",severity:"E",message:t=>`Third argument to ${t} built-in function is negative. It will be changed to 0.`,fullCode:"IBM1273IE"},IBM1274I:{code:"IBM1274I",severity:"E",message:"RULES(NOLAXIF) violation: conditional expression does not have the attributes BIT(1).",fullCode:"IBM1274IE"},IBM1281I:{code:"IBM1281I",severity:"E",message:"OPTIONS(RETCODE) on ATTACH reference is invalid and will be ignored.",fullCode:"IBM1281IE"},IBM1287I:{code:"IBM1287I",severity:"E",message:"RULES(NOLAXCONV) violation: exponentiation operands should have numeric type.",fullCode:"IBM1287IE"},IBM1293I:{code:"IBM1293I",severity:"E",message:t=>`WIDECHAR extent is reduced to ${t} .`,fullCode:"IBM1293IE"},IBM1294I:{code:"IBM1294I",severity:"E",message:"BIT extent is reduced to  ${maximum value } .",fullCode:"IBM1294IE"},IBM1295I:{code:"IBM1295I",severity:"E",message:"Sole bound specified is less than 1. An upper bound of 1 is assumed.",fullCode:"IBM1295IE"},IBM1296I:{code:"IBM1296I",severity:"E",message:"The BYADDR option conflicts with the SYSTEM option.",fullCode:"IBM1296IE"},IBM1297I:{code:"IBM1297I",severity:"E",message:"Source and target in BY NAME assignment have no matching assignable base identifiers.",fullCode:"IBM1297IE"},IBM1298I:{code:"IBM1298I",severity:"E",message:"Characters in B3 literals must be 0-7.",fullCode:"IBM1298IE"},IBM1299I:{code:"IBM1299I",severity:"E",message:t=>`CHARACTER extent is reduced to ${t} .`,fullCode:"IBM1299IE"},IBM1300I:{code:"IBM1300I",severity:"E",message:(t,e)=>`RULES(NOLAXDCL) violation: ${t} is contextually declared as ${e} .`,fullCode:"IBM1300IE"},IBM1301I:{code:"IBM1301I",severity:"E",message:"A DECIMAL exponent is required.",fullCode:"IBM1301IE"},IBM1302I:{code:"IBM1302I",severity:"E",message:"The limit on the number of DEFAULT predicates in a block has already been reached. This and subsequent DEFAULT predicates in this block will be ignored.",fullCode:"IBM1302IE"},IBM1303I:{code:"IBM1303I",severity:"E",message:"A second argument to the  ${BUILTIN name }  built-in function must be supplied for arrays with more than one dimension. A value of 1 is assumed.",fullCode:"IBM1303IE"},IBM1304I:{code:"IBM1304I",severity:"E",message:t=>`Second argument to ${t} built-in function is not positive. A value of 1 is assumed.`,fullCode:"IBM1304IE"},IBM1305I:{code:"IBM1305I",severity:"E",message:(t,e)=>`Second argument to ${t} built-in function is greater than the number of dimensions for the first argument. A value of ${e} is assumed.`,fullCode:"IBM1305IE"},IBM1306I:{code:"IBM1306I",severity:"E",message:t=>`Repeated declaration of ${t} is invalid and will be ignored.`,fullCode:"IBM1306IE"},IBM1307I:{code:"IBM1307I",severity:"E",message:"Duplicate specification of arithmetic precision. Subsequent specification ignored.",fullCode:"IBM1307IE"},IBM1308I:{code:"IBM1308I",severity:"E",message:t=>`Repeated declaration of ${t} is invalid. The name will be replaced by an asterisk.`,fullCode:"IBM1308IE"},IBM1309I:{code:"IBM1309I",severity:"E",message:t=>`Duplicate specification of ${t} . Subsequent specification ignored.`,fullCode:"IBM1309IE"},IBM1310I:{code:"IBM1310I",severity:"E",message:t=>`The attribute ${t} conflicts with previous attributes and is ignored.`,fullCode:"IBM1310IE"},IBM1311I:{code:"IBM1311I",severity:"E",message:"EXTERNAL name contains no non- blank characters and is ignored.",fullCode:"IBM1311IE"},IBM1312I:{code:"IBM1312I",severity:"E",message:"WX literals should contain a multiple of 4 hex digits.",fullCode:"IBM1312IE"},IBM1314I:{code:"IBM1314I",severity:"E",message:"ELSE clause outside of an open IF- THEN statement is ignored.",fullCode:"IBM1314IE"},IBM1315I:{code:"IBM1315I",severity:"E",message:"END label matches a label on an open group, but that group label is subscripted.",fullCode:"IBM1315IE"},IBM1316I:{code:"IBM1316I",severity:"E",message:"END label is not a label on any open group.",fullCode:"IBM1316IE"},IBM1317I:{code:"IBM1317I",severity:"E",message:"An END statement may be missing after an OTHERWISE unit. One will be inserted.",fullCode:"IBM1317IE"},IBM1318I:{code:"IBM1318I",severity:"E",message:"The ENVIRONMENT option  ${option name }  conflicts with preceding ENVIRONMENT options. This option will be ignored.",fullCode:"IBM1318IE"},IBM1319I:{code:"IBM1319I",severity:"E",message:"STRINGSIZE condition raised while evaluating expression. Result is truncated.",fullCode:"IBM1319IE"},IBM1320I:{code:"IBM1320I",severity:"E",message:"STRINGRANGE condition raised while evaluating expression. Arguments are adjusted to fit.",fullCode:"IBM1320IE"},IBM1321I:{code:"IBM1321I",severity:"E",message:"LEAVE/ITERATE label matches a label on an open DO group, but that DO group label is subscripted.",fullCode:"IBM1321IE"},IBM1322I:{code:"IBM1322I",severity:"E",message:"LEAVE/ITERATE label is not a label on any open DO group in its containing block.",fullCode:"IBM1322IE"},IBM1323I:{code:"IBM1323I",severity:"E",message:"ITERATE/LEAVE statement is invalid outside an open DO statement. The statement will be ignored.",fullCode:"IBM1323IE"},IBM1324I:{code:"IBM1324I",severity:"E",message:t=>`The name ${t} occurs more than once in the EXPORTS clause.`,fullCode:"IBM1324IE"},IBM1325I:{code:"IBM1325I",severity:"E",message:t=>`The name ${t} occurs in the EXPORTS clause, but is not the name of any nonnested PROCEDURE.`,fullCode:"IBM1325IE"},IBM1326I:{code:"IBM1326I",severity:"E",message:"Variables declared without a name must be structure members or followed by a substructure list.",fullCode:"IBM1326IE"},IBM1327I:{code:"IBM1327I",severity:"E",message:"The CHARACTER VARYING parameter to MAIN should be ASCII with the attribute NATIVE.",fullCode:"IBM1327IE"},IBM1328I:{code:"IBM1328I",severity:"E",message:"The CHARACTER VARYING parameter to MAIN should be EBCDIC with the attribute BIGENDIAN.",fullCode:"IBM1328IE"},IBM1329I:{code:"IBM1329I",severity:"E",message:"ENTRY statements are not allowed under RULES(NOMULTIENTRY).",fullCode:"IBM1329IE"},IBM1330I:{code:"IBM1330I",severity:"E",message:"The I in an iSUB token must be bigger than zero. A value of 1 is assumed.",fullCode:"IBM1330IE"},IBM1331I:{code:"IBM1331I",severity:"E",message:"The I in an iSUB token must have no more than 2 digits. A value of 1 is assumed.",fullCode:"IBM1331IE"},IBM1332I:{code:"IBM1332I",severity:"E",message:t=>`The ${t} format item requires an argument when used in GET statement. A value of 1 is assumed.`,fullCode:"IBM1332IE"},IBM1333I:{code:"IBM1333I",severity:"E",message:"Non-asterisk array bounds are not permitted in GENERIC descriptions.",fullCode:"IBM1333IE"},IBM1334I:{code:"IBM1334I",severity:"E",message:"String lengths and area sizes are not permitted in GENERIC descriptions.",fullCode:"IBM1334IE"},IBM1335I:{code:"IBM1335I",severity:"E",message:"Entry description lists are not permitted in GENERIC descriptions.",fullCode:"IBM1335IE"},IBM1336I:{code:"IBM1336I",severity:"E",message:t=>`GRAPHIC extent is reduced to ${t} .`,fullCode:"IBM1336IE"},IBM1337I:{code:"IBM1337I",severity:"E",message:"GX literals should contain a multiple of 4 hex digits.",fullCode:"IBM1337IE"},IBM1338I:{code:"IBM1338I",severity:"E",message:"Upper bound is less than lower bound. Bounds will be reversed.",fullCode:"IBM1338IE"},IBM1339I:{code:"IBM1339I",severity:"E",message:t=>`Identifier is too long. It will be collapsed to ${t} .`,fullCode:"IBM1339IE"},IBM1340I:{code:"IBM1340I",severity:"E",message:"Argument number  ${argument number }  in ENTRY reference  ${ENTRY name }  contains BIT data. NOMAP is assumed.",fullCode:"IBM1340IE"},IBM1341I:{code:"IBM1341I",severity:"E",message:"Argument number  ${argument number }  in ENTRY reference  ${ENTRY name }  is or contains a UNION. NOMAP is assumed.",fullCode:"IBM1341IE"},IBM1342I:{code:"IBM1342I",severity:"E",message:"Argument number  ${argument number }  in ENTRY reference  ${ENTRY name }  contains non-constant extents. NOMAP is assumed.",fullCode:"IBM1342IE"},IBM1343I:{code:"IBM1343I",severity:"E",message:(t,e)=>`${t} is invalid as a suboption of ${e} .`,fullCode:"IBM1343IE"},IBM1344I:{code:"IBM1344I",severity:"E",message:"NOMAP specifications are valid only for ILC routines.",fullCode:"IBM1344IE"},IBM1345I:{code:"IBM1345I",severity:"E",message:"Initial level number in a structure is not 1.",fullCode:"IBM1345IE"},IBM1346I:{code:"IBM1346I",severity:"E",message:"INIT expression should be enclosed in parentheses.",fullCode:"IBM1346IE"},IBM1347I:{code:"IBM1347I",severity:"E",message:"B assumed to complete iSUB.",fullCode:"IBM1347IE"},IBM1348I:{code:"IBM1348I",severity:"E",message:"Digit in BINARY constant is not zero or one.",fullCode:"IBM1348IE"},IBM1349I:{code:"IBM1349I",severity:"E",message:"Characters in BIT literals must be 0 or 1.",fullCode:"IBM1349IE"},IBM1350I:{code:"IBM1350I",severity:"E",message:t=>`Character with decimal value ${t} does not belong to the PL/I character set. It will be ignored.`,fullCode:"IBM1350IE"},IBM1351I:{code:"IBM1351I",severity:"E",message:"Characters in hex literals must be 0-9 or A-F.",fullCode:"IBM1351IE"},IBM1352I:{code:"IBM1352I",severity:"E",message:t=>`The statement element ${t} is invalid. The statement will be ignored.`,fullCode:"IBM1352IE"},IBM1353I:{code:"IBM1353I",severity:"E",message:"Use of underscore as initial character in an identifier accepted although invalid under LANGLVL(SAA).",fullCode:"IBM1353IE"},IBM1354I:{code:"IBM1354I",severity:"E",message:"Multiple argument lists are valid only with the last identifier in a reference.",fullCode:"IBM1354IE"},IBM1355I:{code:"IBM1355I",severity:"E",message:"Empty argument lists are valid only with the last identifier in a reference.",fullCode:"IBM1355IE"},IBM1356I:{code:"IBM1356I",severity:"E",message:t=>`Character with decimal value ${t} does not belong to the PL/I character set. It is assumed to be an OR symbol.`,fullCode:"IBM1356IE"},IBM1357I:{code:"IBM1357I",severity:"E",message:t=>`Character with decimal value ${t} does not belong to the PL/I 44  character set. It is assumed to be a NOT symbol.`,fullCode:"IBM1357IE"},IBM1358I:{code:"IBM1358I",severity:"E",message:t=>`The scale factor specified in ${t} built-in function with a floating-point argument must be positive. It will be changed to 1.`,fullCode:"IBM1358IE"},IBM1359I:{code:"IBM1359I",severity:"E",message:(t,e)=>`Names in RANGE( ${t} : ${e} ) are not in ascending order. Order is reversed.`,fullCode:"IBM1359IE"},IBM1360I:{code:"IBM1360I",severity:"E",message:t=>`The name ${t} has already been defined as a FORMAT constant.`,fullCode:"IBM1360IE"},IBM1361I:{code:"IBM1361I",severity:"E",message:t=>`The name ${t} has already been defined as a LABEL constant.`,fullCode:"IBM1361IE"},IBM1362I:{code:"IBM1362I",severity:"E",message:t=>`The label ${t} has already been declared. The explicit declaration of the label will not be accepted.`,fullCode:"IBM1362IE"},IBM1363I:{code:"IBM1363I",severity:"E",message:"Structure level greater than 255 specified. It will be replaced by 255.",fullCode:"IBM1363IE"},IBM1364I:{code:"IBM1364I",severity:"E",message:"Elements with level numbers greater than 1 follow an element without a level number. A level number of 1 is assumed.",fullCode:"IBM1364IE"},IBM1365I:{code:"IBM1365I",severity:"E",message:"Statement type resolution requires too many lexical units to  45 be examined. The statement will be ignored.",fullCode:"IBM1365IE"},IBM1366I:{code:"IBM1366I",severity:"E",message:"Level number following LIKE specification is greater than than the level number for the LIKE specification. LIKE attribute will be ignored.",fullCode:"IBM1366IE"},IBM1367I:{code:"IBM1367I",severity:"E",message:"Statements inside a SELECT must be preceded by a WHEN or an OTHERWISE clause. Statement is ignored.",fullCode:"IBM1367IE"},IBM1368I:{code:"IBM1368I",severity:"E",message:t=>`The attribute ${t} is invalid if it is not followed by an element with a greater logical level.`,fullCode:"IBM1368IE"},IBM1369I:{code:"IBM1369I",severity:"E",message:"MAIN has already been specified in the PACKAGE.",fullCode:"IBM1369IE"},IBM1370I:{code:"IBM1370I",severity:"E",message:"Extent expression is negative. It will be replaced by the constant 1.",fullCode:"IBM1370IE"},IBM1371I:{code:"IBM1371I",severity:"E",message:t=>`RULES(NOLAXQUAL) violation: structure element ${t} is not dot qualified.`,fullCode:"IBM1371IE"},IBM1372I:{code:"IBM1372I",severity:"E",message:"EXTERNAL specified on internal entry point.",fullCode:"IBM1372IE"},IBM1373I:{code:"IBM1373I",severity:"E",message:t=>`RULES(NOLAXDCL) violation: variable ${t} is implicitly declared.`,fullCode:"IBM1373IE"},IBM1374I:{code:"IBM1374I",severity:"E",message:t=>`Contextual attributes conflicting with PARAMETER will not be applied to ${t} .`,fullCode:"IBM1374IE"},IBM1375I:{code:"IBM1375I",severity:"E",message:"The DEFINED variable  ${variable name }  does not fit into its base variable.",fullCode:"IBM1375IE"},IBM1376I:{code:"IBM1376I",severity:"E",message:"Factoring of level numbers into declaration lists containing level numbers is invalid. The level numbers in the declaration list will be ignored.",fullCode:"IBM1376IE"},IBM1377I:{code:"IBM1377I",severity:"E",message:"A scale factor has been specified as an argument to the  ${BUILTIN name }  built-in function, but the result of that function has type FLOAT. The scale factor will be ignored.",fullCode:"IBM1377IE"},IBM1378I:{code:"IBM1378I",severity:"E",message:"An arguments list or subscripts list has been provided for a GENERIC ENTRY reference. It will be ignored.",fullCode:"IBM1378IE"},IBM1379I:{code:"IBM1379I",severity:"E",message:"Locator qualifier for GENERIC reference is ignored.",fullCode:"IBM1379IE"},IBM1380I:{code:"IBM1380I",severity:"E",message:"Target structure in assignment contains no elements with the ASSIGNABLE attribute. No assignments will be generated.",fullCode:"IBM1380IE"},IBM1381I:{code:"IBM1381I",severity:"E",message:"DEFINED base for a BIT structure should be aligned.",fullCode:"IBM1381IE"},IBM1382I:{code:"IBM1382I",severity:"E",message:"INITIAL attribute is invalid for STATIC FORMAT variables. Storage class is changed to AUTOMATIC.",fullCode:"IBM1382IE"},IBM1383I:{code:"IBM1383I",severity:"E",message:t=>`Labels on ${t} statements are invalid and ignored.`,fullCode:"IBM1383IE"},IBM1384I:{code:"IBM1384I",severity:"E",message:t=>`${t}`,fullCode:"IBM1384IE"},IBM1385I:{code:"IBM1385I",severity:"E",message:"Invalid DEFINED - string overlay defining attempted.",fullCode:"IBM1385IE"},IBM1386I:{code:"IBM1386I",severity:"E",message:"DEFINED base for a BIT variable should not be subscripted.",fullCode:"IBM1386IE"},IBM1387I:{code:"IBM1387I",severity:"E",message:"The NODESCRIPTOR attribute is invalid when any parameters have * extents. The NODESCRIPTOR attribute will be ignored.",fullCode:"IBM1387IE"},IBM1388I:{code:"IBM1388I",severity:"E",message:"The NODESCRIPTOR attribute is invalid when any parameters have the NONCONNECTED attribute.",fullCode:"IBM1388IE"},IBM1389I:{code:"IBM1389I",severity:"E",message:t=>`The identifier ${t} is not the name of a built-in function. The BUILTIN attribute will be ignored.`,fullCode:"IBM1389IE"},IBM1390I:{code:"IBM1390I",severity:"E",message:t=>`${t}`,fullCode:"IBM1390IE"},IBM1391I:{code:"IBM1391I",severity:"E",message:"End-of-source has been encountered after an unmatched comment marker.",fullCode:"IBM1391IE"},IBM1392I:{code:"IBM1392I",severity:"E",message:"End-of-source has been encountered after an unmatched quote.",fullCode:"IBM1392IE"},IBM1393I:{code:"IBM1393I",severity:"E",message:t=>`Item in OPTIONS list conflicts with other attributes in the declaration. ${t} is ignored.`,fullCode:"IBM1393IE"},IBM1394I:{code:"IBM1394I",severity:"E",message:t=>`Item in OPTIONS list is invalid for BEGIN blocks. ${t} is ignored.`,fullCode:"IBM1394IE"},IBM1395I:{code:"IBM1395I",severity:"E",message:t=>`Item in OPTIONS list is invalid for PACKAGEs. ${t} is ignored.`,fullCode:"IBM1395IE"},IBM1396I:{code:"IBM1396I",severity:"E",message:t=>`Item in OPTIONS list is invalid for PROCEDUREs. ${t} is ignored.`,fullCode:"IBM1396IE"},IBM1397I:{code:"IBM1397I",severity:"E",message:t=>`Item in OPTIONS list is invalid for nested PROCEDUREs. ${t} is ignored.`,fullCode:"IBM1397IE"},IBM1398I:{code:"IBM1398I",severity:"E",message:t=>`Invalid item in OPTIONS list. ${t} is ignored.`,fullCode:"IBM1398IE"},IBM1399I:{code:"IBM1399I",severity:"E",message:t=>`Item in OPTIONS list is invalid for ENTRY statements. ${t} is ignored.`,fullCode:"IBM1399IE"},IBM1400I:{code:"IBM1400I",severity:"E",message:t=>`Item in OPTIONS list conflicts with preceding items. ${t} is ignored.`,fullCode:"IBM1400IE"},IBM1401I:{code:"IBM1401I",severity:"E",message:"Parameter attributes have been specified for a variable that is not a parameter. The parameter attributes are ignored.",fullCode:"IBM1401IE"},IBM1402I:{code:"IBM1402I",severity:"E",message:"Constant in POSITION attribute is less than 1.",fullCode:"IBM1402IE"},IBM1403I:{code:"IBM1403I",severity:"E",message:"The end of the source was reached before the logical end of the program. Null statements and END statements will be inserted as necessary to complete the program.",fullCode:"IBM1403IE"},IBM1404I:{code:"IBM1404I",severity:"E",message:t=>`The PROCEDURE name ${t} has already been declared. The explicit declaration of the PROCEDURE name will not be accepted.`,fullCode:"IBM1404IE"},IBM1405I:{code:"IBM1405I",severity:"E",message:"Only one description is allowed in a returns descriptor.",fullCode:"IBM1405IE"},IBM1406I:{code:"IBM1406I",severity:"E",message:(t,e)=>`The product of the repetition factor ${t} and the length of the constant ${e} to which it is applied is greater than the maximum length allowed for a constant. The repetition factor will be ignored.`,fullCode:"IBM1406IE"},IBM1407I:{code:"IBM1407I",severity:"E",message:"Scale factor is bigger than 127. It will be replaced by 127.",fullCode:"IBM1407IE"},IBM1408I:{code:"IBM1408I",severity:"E",message:"Scale factor is less than -128. It will be replaced by -128.",fullCode:"IBM1408IE"},IBM1409I:{code:"IBM1409I",severity:"E",message:"A SELECT statement may be missing. A SELECT statement, without an expression, will be inserted.",fullCode:"IBM1409IE"},IBM1410I:{code:"IBM1410I",severity:"E",message:"Semicolon inserted after ELSE keyword.",fullCode:"IBM1410IE"},IBM1411I:{code:"IBM1411I",severity:"E",message:"Semicolon inserted after ON clause.",fullCode:"IBM1411IE"},IBM1412I:{code:"IBM1412I",severity:"E",message:"Semicolon inserted after OTHERWISE keyword.",fullCode:"IBM1412IE"},IBM1413I:{code:"IBM1413I",severity:"E",message:"Semicolon inserted after THEN keyword.",fullCode:"IBM1413IE"},IBM1414I:{code:"IBM1414I",severity:"E",message:"Semicolon inserted after WHEN clause.",fullCode:"IBM1414IE"},IBM1415I:{code:"IBM1415I",severity:"E",message:"Source file does not end with the logical end of the program.",fullCode:"IBM1415IE"},IBM1416I:{code:"IBM1416I",severity:"E",message:t=>`Subscripts have been specified for the variable ${t} , but it is not an array variable.`,fullCode:"IBM1416IE"},IBM1417I:{code:"IBM1417I",severity:"E",message:t=>`Second argument in ${t} reference is less than 1. It will be replaced by 1.`,fullCode:"IBM1417IE"},IBM1418I:{code:"IBM1418I",severity:"E",message:t=>`Second argument in ${t} reference is too big. It will be trimmed to fit.`,fullCode:"IBM1418IE"},IBM1419I:{code:"IBM1419I",severity:"E",message:t=>`Third argument in ${t} reference is less than 0. It will be replaced by 0.`,fullCode:"IBM1419IE"},IBM1420I:{code:"IBM1420I",severity:"E",message:"The factor in  ${K/Mconstant }  is too large and is replaced by  ${maximum factor } .",fullCode:"IBM1420IE"},IBM1421I:{code:"IBM1421I",severity:"E",message:"More than 15 dimensions have been specified. Excess will be ignored.",fullCode:"IBM1421IE"},IBM1422I:{code:"IBM1422I",severity:"E",message:"Maximum of 500 LIKE attributes per block exceeded.",fullCode:"IBM1422IE"},IBM1423I:{code:"IBM1423I",severity:"E",message:"UNALIGNED attribute conflicts with AREA attribute.",fullCode:"IBM1423IE"},IBM1424I:{code:"IBM1424I",severity:"E",message:"End of comment marker found when there are no open comments. Marker will be ignored.",fullCode:"IBM1424IE"},IBM1425I:{code:"IBM1425I",severity:"E",message:t=>`There is no compiler directive ${t} . Input up to the next semicolon will be ignored.`,fullCode:"IBM1425IE"},IBM1426I:{code:"IBM1426I",severity:"E",message:"Structure level of 0 replaced by 1.",fullCode:"IBM1426IE"},IBM1427I:{code:"IBM1427I",severity:"E",message:"Numeric precision of 0 replaced by 1.",fullCode:"IBM1427IE"},IBM1428I:{code:"IBM1428I",severity:"E",message:"X literals should contain a multiple of 2 hex digits.",fullCode:"IBM1428IE"},IBM1429I:{code:"IBM1429I",severity:"E",message:t=>`INITIAL attribute for REFER object ${t} is invalid.`,fullCode:"IBM1429IE"},IBM1430I:{code:"IBM1430I",severity:"E",message:(t,e)=>`UNSIGNED attribute for ${t} type ${e} conflicts with negative INITIAL values and is ignored.`,fullCode:"IBM1430IE"},IBM1431I:{code:"IBM1431I",severity:"E",message:(t,e)=>`PRECISION specified for ${t} type ${e} is too small to cover its INITIAL values and is adjusted to fit.`,fullCode:"IBM1431IE"},IBM1432I:{code:"IBM1432I",severity:"E",message:t=>`The type ${t} is already defined. The redefinition is ignored.`,fullCode:"IBM1432IE"},IBM1433I:{code:"IBM1433I",severity:"E",message:t=>`The name ${t} occurs more than once in the RESERVES clause.`,fullCode:"IBM1433IE"},IBM1434I:{code:"IBM1434I",severity:"E",message:t=>`The name ${t} occurs in the RESERVES clause, but is not the name of any level 1 STATIC EXTERNAL variable.`,fullCode:"IBM1434IE"},IBM1435I:{code:"IBM1435I",severity:"E",message:t=>`A precision value less than 1 has been specified as an argument to the ${t} built-in function. It will be replaced by 15.`,fullCode:"IBM1435IE"},IBM1436I:{code:"IBM1436I",severity:"E",message:t=>`The scale factor specified as an argument to the ${t} built-in function is out of the valid range. It will be replaced by the nearest valid value.`,fullCode:"IBM1436IE"},IBM1437I:{code:"IBM1437I",severity:"E",message:t=>`The second argument to the ${t} built-in function is greater than the maximum FIXED BINARY precision. It will be replaced by the maximum value.`,fullCode:"IBM1437IE"},IBM1438I:{code:"IBM1438I",severity:"E",message:t=>`Excess arguments for ENTRY ${t} ignored.`,fullCode:"IBM1438IE"},IBM1439I:{code:"IBM1439I",severity:"E",message:"Excess arguments for  ${BUILTIN name }  built-in function ignored.",fullCode:"IBM1439IE"},IBM1441I:{code:"IBM1441I",severity:"E",message:"ENTRY/RETURNS description lists for comparands do not match.",fullCode:"IBM1441IE"},IBM1442I:{code:"IBM1442I",severity:"E",message:t=>`The ENTRY/RETURNS description lists in the ENTRY to be assigned to ${t} do not match those of the target variable.`,fullCode:"IBM1442IE"},IBM1443I:{code:"IBM1443I",severity:"E",message:t=>`An ENTRY/RETURNS description list in an ENTRY in the INITIAL list for ${t} do not match those of the target variable.`,fullCode:"IBM1443IE"},IBM1444I:{code:"IBM1444I",severity:"E",message:"The ENTRY/RETURNS description lists in the RETURN statement do not match those in the corresponding RETURNS attribute",fullCode:"IBM1444IE"},IBM1445I:{code:"IBM1445I",severity:"E",message:(t,e)=>`The ENTRY/RETURNS description lists for argument number ${t} in ENTRY reference ${e} do not match those in the corresponding parameter.`,fullCode:"IBM1445IE"},IBM1446I:{code:"IBM1446I",severity:"E",message:t=>`Third argument in ${t} reference is too big. It will be trimmed to fit.`,fullCode:"IBM1446IE"},IBM1447I:{code:"IBM1447I",severity:"E",message:"Literals with an X prefix are valid only in EXEC SQL statements.",fullCode:"IBM1447IE"},IBM1448I:{code:"IBM1448I",severity:"E",message:"Use of nonconstant extents in BASED variables without REFER accepted although invalid under LANGLVL(SAA).",fullCode:"IBM1448IE"},IBM1449I:{code:"IBM1449I",severity:"E",message:t=>`Use of ${t} accepted although invalid under LANGLVL(SAA).`,fullCode:"IBM1449IE"},IBM1450I:{code:"IBM1450I",severity:"E",message:t=>`${t} keyword accepted although invalid under LANGLVL(SAA).`,fullCode:"IBM1450IE"},IBM1451I:{code:"IBM1451I",severity:"E",message:"Use of S, D and Q constants accepted although invalid under LANGLVL(SAA).",fullCode:"IBM1451IE"},IBM1452I:{code:"IBM1452I",severity:"E",message:"Use of underscores in constants accepted although invalid under LANGLVL(SAA).",fullCode:"IBM1452IE"},IBM1453I:{code:"IBM1453I",severity:"E",message:"Use of asterisks for names in declares accepted although invalid under LANGLVL(SAA).",fullCode:"IBM1453IE"},IBM1454I:{code:"IBM1454I",severity:"E",message:"Use of XN and XU constants accepted although invalid under LANGLVL(SAA).",fullCode:"IBM1454IE"},IBM1455I:{code:"IBM1455I",severity:"E",message:t=>`Use of arguments with ${t} built-in function accepted although invalid under LANGLVL(SAA).`,fullCode:"IBM1455IE"},IBM1456I:{code:"IBM1456I",severity:"E",message:t=>`Use of 3 arguments with ${t} built-in function accepted although invalid under LANGLVL(SAA).`,fullCode:"IBM1456IE"},IBM1457I:{code:"IBM1457I",severity:"E",message:t=>`Use of 1 argument with ${t} built-in function accepted although invalid under LANGLVL(SAA).`,fullCode:"IBM1457IE"},IBM1458I:{code:"IBM1458I",severity:"E",message:"GOTO is not allowed under RULES(NOGOTO).",fullCode:"IBM1458IE"},IBM1459I:{code:"IBM1459I",severity:"E",message:"Uninitialized AUTOMATIC variables in a block should not be used in the prologue of that block.",fullCode:"IBM1459IE"},IBM1460I:{code:"IBM1460I",severity:"E",message:"Under RULES(ANS), nonzero scale factors are not permitted in declarations of FIXED BIN. Declared scale factor will be ignored.",fullCode:"IBM1460IE"},IBM1461I:{code:"IBM1461I",severity:"E",message:(t,e,n)=>`Tne result of the ${t} built-in would have the attributes FIXED BIN( ${e} , ${n} ), but under RULES(ANS), FIXED BIN scale factors must be zero. The scale factor will be set to zero.`,fullCode:"IBM1461IE"},IBM1462I:{code:"IBM1462I",severity:"E",message:"Expression in comparison interpreted with DATE attribute.",fullCode:"IBM1462IE"},IBM1463I:{code:"IBM1463I",severity:"E",message:"Operand with DATE attribute is invalid except in compare or  55 assign. DATE attribute will be ignored.",fullCode:"IBM1463IE"},IBM1464I:{code:"IBM1464I",severity:"E",message:"DATE attribute ignored in comparison with non-date expression.",fullCode:"IBM1464IE"},IBM1465I:{code:"IBM1465I",severity:"E",message:t=>`Source in assignment has the DATE attribute, but target ${t} does not. The DATE attribute will be ignored.`,fullCode:"IBM1465IE"},IBM1466I:{code:"IBM1466I",severity:"E",message:"Source in assignment has the DATE attribute, but target does not. The DATE attribute will be ignored.",fullCode:"IBM1466IE"},IBM1467I:{code:"IBM1467I",severity:"E",message:t=>`Source in INITIAL clause for ${t} has the DATE attribute but the target does not. The DATE attribute will be ignored.`,fullCode:"IBM1467IE"},IBM1468I:{code:"IBM1468I",severity:"E",message:"Argument number  ${argument number }  in ENTRY reference  ${entry name }  has the DATE attribute but the corresponding parameter does not. The DATE attribute will be ignored.",fullCode:"IBM1468IE"},IBM1469I:{code:"IBM1469I",severity:"E",message:"Source in RETURN statement has the DATE attribute, but the corresponding RETURNS option does not. The DATE attribute will be ignored.",fullCode:"IBM1469IE"},IBM1470I:{code:"IBM1470I",severity:"E",message:"An ID option must be specified for the INCLUDE preprocessor.",fullCode:"IBM1470IE"},IBM1471I:{code:"IBM1471I",severity:"E",message:"The ID option specified for the INCLUDE preprocessor is invalid.",fullCode:"IBM1471IE"},IBM1472I:{code:"IBM1472I",severity:"E",message:"A closing right parenthesis is missing from the ID option specified for the INCLUDE preprocessor.",fullCode:"IBM1472IE"},IBM1473I:{code:"IBM1473I",severity:"E",message:"The syntax of the preprocessor INCLUDE directive is incorrect.",fullCode:"IBM1473IE"},IBM1474I:{code:"IBM1474I",severity:"E",message:t=>`Source in assignment does not have the DATE attribute, but target ${t} does. The DATE attribute will be ignored.`,fullCode:"IBM1474IE"},IBM1475I:{code:"IBM1475I",severity:"E",message:"Target in assignment has the DATE attribute, but source does not. The DATE attribute will be ignored.",fullCode:"IBM1475IE"},IBM1476I:{code:"IBM1476I",severity:"E",message:t=>`Source in INITIAL clause for ${t} does not have the DATE attribute but the target does. The DATE attribute will be ignored.`,fullCode:"IBM1476IE"},IBM1477I:{code:"IBM1477I",severity:"E",message:"Argument number  ${argument number }  in ENTRY reference  ${entry name }  does not have the DATE attribute but the corresponding parameter does. The DATE attribute will be ignored.",fullCode:"IBM1477IE"},IBM1478I:{code:"IBM1478I",severity:"E",message:"Source in RETURN statement does not have the DATE attribute, but the corresponding RETURNS option does. The DATE attribute will be ignored.",fullCode:"IBM1478IE"},IBM1479I:{code:"IBM1479I",severity:"E",message:"Multiple RETURN statements are not allowed under RULES(NOMULTIEXIT).",fullCode:"IBM1479IE"},IBM1480I:{code:"IBM1480I",severity:"E",message:"Multiple closure of groups is not allowed under RULES(NOMULTICLOSE).",fullCode:"IBM1480IE"},IBM1481I:{code:"IBM1481I",severity:"E",message:"BYNAME assignment statements are not allowed under RULES(NOBYNAME).",fullCode:"IBM1481IE"},IBM1482I:{code:"IBM1482I",severity:"E",message:t=>`RULES(NOLAXDCL) violation: the variable ${t} is declared without any data attributes.`,fullCode:"IBM1482IE"},IBM1483I:{code:"IBM1483I",severity:"E",message:t=>`RULES(NOLAXDCL) violation: the structure member ${t} is declared without any data attributes. A level number may be incorrect.`,fullCode:"IBM1483IE"},IBM1484I:{code:"IBM1484I",severity:"E",message:"RULES(NOLAXDCL) violation: an unnamed structure member is declared without any data attributes. A level number may be incorrect.",fullCode:"IBM1484IE"},IBM1485I:{code:"IBM1485I",severity:"E",message:"A WHEN or OTHERWISE clause has been found inside of an open DO group contained in an open SELECT group. An END statement may be missing and will be inserted in an attempt to fix the problem.",fullCode:"IBM1485IE"},IBM1486I:{code:"IBM1486I",severity:"E",message:"Statement contains a mismatching number of ( and ).",fullCode:"IBM1486IE"},IBM1487I:{code:"IBM1487I",severity:"E",message:"Statement contains a mismatching number of (: and :).",fullCode:"IBM1487IE"},IBM1488I:{code:"IBM1488I",severity:"E",message:"Specification of an alternate DD for SYSIN after the source has been opened will be ignored.",fullCode:"IBM1488IE"},IBM2400I:{code:"IBM2400I",severity:"E",message:"Compiler backend issued error messages to STDOUT.",fullCode:"IBM2400IE"},IBM2401I:{code:"IBM2401I",severity:"E",message:(t,e)=>`RULES(NOLAXPUNC) violation: missing ${t} assumed before ${e} . DECLARE and other nonexecutable statements should not have labels.`,fullCode:"IBM2401IE"},IBM2402I:{code:"IBM2402I",severity:"E",message:(t,e,n,r)=>`${t} is declared as BASED on the ADDR of ${e} , but ${n} requires more storage than ${r} .`,fullCode:"IBM2402IE"},IBM2403I:{code:"IBM2403I",severity:"E",message:"PROCESS statements are not permitted under the NOPROCESS option.",fullCode:"IBM2403IE"},IBM2404I:{code:"IBM2404I",severity:"E",message:(t,e,n,r,i)=>`${t} is declared as BASED on the ADDR of ${e} , but ${n} requires more storage than remains in the enclosing level 1 structure ${r} after the location of ${i} .`,fullCode:"IBM2404IE"},IBM2405I:{code:"IBM2405I",severity:"E",message:"Even decimal precisions are not allowed under RULES(NOEVENDEC).",fullCode:"IBM2405IE"},IBM2406I:{code:"IBM2406I",severity:"E",message:"Precision outside VALUE clause will be ignored.",fullCode:"IBM2406IE"},IBM2407I:{code:"IBM2407I",severity:"E",message:"Length outside VALUE clause will be ignored.",fullCode:"IBM2407IE"},IBM2408I:{code:"IBM2408I",severity:"E",message:"AREA size outside VALUE clause will be ignored.",fullCode:"IBM2408IE"},IBM2409I:{code:"IBM2409I",severity:"E",message:"RETURN statement without an expression is invalid inside a nested PROCEDURE that specified the RETURNS attribute.",fullCode:"IBM2409IE"},IBM2410I:{code:"IBM2410I",severity:"E",message:t=>`Function ${t} contains no valid RETURN statement.`,fullCode:"IBM2410IE"},IBM2411I:{code:"IBM2411I",severity:"E",message:"STRINGOFGRAPHIC( CHARACTER ) option is ignored because argument to STRING built-in  59 function is possibly not contiguous.",fullCode:"IBM2411IE"},IBM2412I:{code:"IBM2412I",severity:"E",message:"PROCEDURE has no RETURNS attribute, but contains a RETURN statement. A RETURNS attribute will be assumed.",fullCode:"IBM2412IE"},IBM2413I:{code:"IBM2413I",severity:"E",message:t=>`The attribute ${t} should be specified only on parameters and descriptors.`,fullCode:"IBM2413IE"},IBM2414I:{code:"IBM2414I",severity:"E",message:(t,e,n)=>`The ${t} option conflicts with the ${e} option. The ${n} option will be used instead.`,fullCode:"IBM2414IE"},IBM2415I:{code:"IBM2415I",severity:"E",message:t=>`Without APAR ${t} , compiler would generate incorrect code for this statement.`,fullCode:"IBM2415IE"},IBM2416I:{code:"IBM2416I",severity:"E",message:"The SEPARATE suboption of TEST is not supported when the LINEDIR option is in effect.",fullCode:"IBM2416IE"},IBM2417I:{code:"IBM2417I",severity:"E",message:"In FETCHABLE code compiled with NORENT NOWRITABLE(PRV), it is invalid to ALLOCATE or FREE a CONTROLLED variable unless it is a PARAMETER.",fullCode:"IBM2417IE"},IBM2418I:{code:"IBM2418I",severity:"E",message:t=>`Variable ${t} is unreferenced.`,fullCode:"IBM2418IE"},IBM2419I:{code:"IBM2419I",severity:"E",message:(t,e)=>`${t} is invalid and ignored unless the ARCH option is ${e} or greater.`,fullCode:"IBM2419IE"},IBM2420I:{code:"IBM2420I",severity:"E",message:"DFP is invalid and ignored unless the ARCH option is 7 or greater.",fullCode:"IBM2420IE"},IBM2421I:{code:"IBM2421I",severity:"E",message:"A file should not be closed in its ENDFILE block.",fullCode:"IBM2421IE"},IBM2422I:{code:"IBM2422I",severity:"E",message:"Under the DFP option, the HEXADEC attribute is not supported for FLOAT DEC.",fullCode:"IBM2422IE"},IBM2423I:{code:"IBM2423I",severity:"E",message:"Under the DFP option, the IEEE attribute is not supported for FLOAT DEC.",fullCode:"IBM2423IE"},IBM2424I:{code:"IBM2424I",severity:"E",message:"Scale factors are not allowed in FLOAT declarations.",fullCode:"IBM2424IE"},IBM2425I:{code:"IBM2425I",severity:"E",message:"Statement with ELSE IF should be rewritten using SELECT.",fullCode:"IBM2425IE"},IBM2426I:{code:"IBM2426I",severity:"E",message:"Maximum nesting of DO statements has been exceeded.",fullCode:"IBM2426IE"},IBM2427I:{code:"IBM2427I",severity:"E",message:"Maximum nesting of IF statements has been exceeded.",fullCode:"IBM2427IE"},IBM2428I:{code:"IBM2428I",severity:"E",message:"Maximum nesting of PROC and BEGIN statements has been exceeded.",fullCode:"IBM2428IE"},IBM2429I:{code:"IBM2429I",severity:"E",message:"CMPAT(V3) requires that 8-byte integers be allowed. The second value in the FIXEDBIN suboption of the LIMITS option will be set to 63.",fullCode:"IBM2429IE"},IBM2430I:{code:"IBM2430I",severity:"E",message:t=>`The LINESIZE value specified in the OPEN of file ${t} is not compatible with the RECSIZE specified in its declare.`,fullCode:"IBM2430IE"},IBM2431I:{code:"IBM2431I",severity:"E",message:t=>`The ${t} option conflicts with the GOFF option. NOGOFF will be used instead.`,fullCode:"IBM2431IE"},IBM2432I:{code:"IBM2432I",severity:"E",message:t=>`The attribute ${t} is invalid with parameters and is ignored.`,fullCode:"IBM2432IE"},IBM2433I:{code:"IBM2433I",severity:"E",message:t=>`The attribute ${t} is invalid with DEFINED and is ignored.`,fullCode:"IBM2433IE"},IBM2434I:{code:"IBM2434I",severity:"E",message:t=>`RULES(NOLAXENTRY) violation: ${t} does not specify a parameter list.`,fullCode:"IBM2434IE"},IBM2435I:{code:"IBM2435I",severity:"E",message:"RULES(NOLAXSCALE) violation: scale factor is less than 0.",fullCode:"IBM2435IE"},IBM2436I:{code:"IBM2436I",severity:"E",message:"RULES(NOLAXSCALE) violation: scale factor is larger than the precision.",fullCode:"IBM2436IE"},IBM2437I:{code:"IBM2437I",severity:"E",message:"SQL preprocessor invoked more than once without INCONLY.",fullCode:"IBM2437IE"},IBM2438I:{code:"IBM2438I",severity:"E",message:"STOP and EXIT statements are not allowed.",fullCode:"IBM2438IE"},IBM2439I:{code:"IBM2439I",severity:"E",message:"RULES(NOPROCENDONLY) violation: END statement for a PROCEDURE must include the name of the PROCEDURE.",fullCode:"IBM2439IE"},IBM2440I:{code:"IBM2440I",severity:"E",message:t=>`RULES(NOLAXQUAL) violation: structure element ${t} is not qualified with the name of its containing level 1 structure.`,fullCode:"IBM2440IE"},IBM2441I:{code:"IBM2441I",severity:"E",message:"RULES(NOGOTO) violation: GOTO exits the current block.",fullCode:"IBM2441IE"},IBM2442I:{code:"IBM2442I",severity:"E",message:t=>`RULES(NOPADDING) violation: structure ${t} contains padding.`,fullCode:"IBM2442IE"},IBM2443I:{code:"IBM2443I",severity:"E",message:"RULES(NOGLOBALDO) violation: control variable in DO statement belongs to a parent block.",fullCode:"IBM2443IE"},IBM2444I:{code:"IBM2444I",severity:"E",message:t=>`The built-in function ${t} has been deprecated.`,fullCode:"IBM2444IE"},IBM2445I:{code:"IBM2445I",severity:"E",message:t=>`The INCLUDE file ${t} has been deprecated.`,fullCode:"IBM2445IE"},IBM2446I:{code:"IBM2446I",severity:"E",message:t=>`The ENTRY named ${t} has been deprecated.`,fullCode:"IBM2446IE"},IBM2447I:{code:"IBM2447I",severity:"E",message:t=>`The VARIABLE named ${t} has been deprecated.`,fullCode:"IBM2447IE"},IBM2448I:{code:"IBM2448I",severity:"E",message:"CICS preprocessor invoked more than once.",fullCode:"IBM2448IE"},IBM2449I:{code:"IBM2449I",severity:"E",message:"RULES(NOSELFASSIGN) violation: source and target in assignment are identical.",fullCode:"IBM2449IE"},IBM2450I:{code:"IBM2450I",severity:"E",message:(t,e)=>`First argument to ${t} built-in function should have length greater than or equal to ${e} .`,fullCode:"IBM2450IE"},IBM2451I:{code:"IBM2451I",severity:"E",message:"RULES(NOLAXIF) violation: source in the assignment is a Boolean, but the target is not BIT(1).",fullCode:"IBM2451IE"},IBM2452I:{code:"IBM2452I",severity:"E",message:"RULES(NOLAXSCALE) violation: scale factor is less than 0.",fullCode:"IBM2452IE"},IBM2453I:{code:"IBM2453I",severity:"E",message:"RULES(NOLAXNESTED) violation: code should come in one group of statements with no intervening procedures or BEGIN blocks.",fullCode:"IBM2453IE"},IBM2454I:{code:"IBM2454I",severity:"E",message:t=>`The ${t} statement has been deprecated.`,fullCode:"IBM2454IE"},IBM2455I:{code:"IBM2455I",severity:"E",message:t=>`The ${t} keyword does not conform to the CASERULES option.`,fullCode:"IBM2455IE"},IBM2456I:{code:"IBM2456I",severity:"E",message:"RULES(NORECURSIVE) violation: RECURSIVE PROCEDUREs are not allowed under RULES(NORECURSIVE).",fullCode:"IBM2456IE"},IBM2457I:{code:"IBM2457I",severity:"E",message:"RULES(NORECURSIVE) conflicts with DFT(RECURSIVE). The compiler will apply RULES(RECURSIVE) instead.",fullCode:"IBM2457IE"},IBM2458I:{code:"IBM2458I",severity:"E",message:"The CONTROLLED attribute is not allowed under RULES(NOCONTROLLED).",fullCode:"IBM2458IE"},IBM2459I:{code:"IBM2459I",severity:"E",message:t=>`The characters specified in the ${t} option must all have hexadecimal values less than 80.`,fullCode:"IBM2459IE"},IBM2460I:{code:"IBM2460I",severity:"E",message:t=>`The ${t} option conflicts with the ENCODING(UTF8) option. ENCODING(ASCII) will be assumed.`,fullCode:"IBM2460IE"},IBM2461I:{code:"IBM2461I",severity:"E",message:"The MARGINI option must specify a valid UTF-8 string consisting of one UTF-8 character.",fullCode:"IBM2461IE"},IBM2462I:{code:"IBM2462I",severity:"E",message:(t,e)=>`The attribute ${t} conflicts with the attribute ${e} and is ignored.`,fullCode:"IBM2462IE"},IBM2463I:{code:"IBM2463I",severity:"E",message:"LINKAGE(SYSTEM) is not supported for PL/I PROCEDUREs, and LINKAGE(OPTLINK) will be assumed instead.",fullCode:"IBM2463IE"},IBM2464I:{code:"IBM2464I",severity:"E",message:"RULES(NOLAXSTMT) violation: line contains more than one statement.",fullCode:"IBM2464IE"},IBM2465I:{code:"IBM2465I",severity:"E",message:"Assignment of a null string to a pointer is invalid.",fullCode:"IBM2465IE"},IBM2466I:{code:"IBM2466I",severity:"E",message:"Comparison of a null string to a pointer is invalid.",fullCode:"IBM2466IE"},IBM2467I:{code:"IBM2467I",severity:"E",message:"RULES(NOYY) conflicts with use of a date pattern with a 2-digit year.",fullCode:"IBM2467IE"},IBM2468I:{code:"IBM2468I",severity:"E",message:"RULES(NOYY) conflicts with use of a date pattern with a ZY.",fullCode:"IBM2468IE"},IBM2469I:{code:"IBM2469I",severity:"E",message:"RULES(NOYY) conflicts with use of the DATE attribute without a pattern.",fullCode:"IBM2469IE"},IBM2470I:{code:"IBM2470I",severity:"E",message:t=>`RULES(NOYY) conflicts with use of the ${t} built-in function.`,fullCode:"IBM2470IE"},IBM2471I:{code:"IBM2471I",severity:"E",message:t=>`RULES(NOYY) conflicts with use of the ${t} built-in function with a window argument.`,fullCode:"IBM2471IE"},IBM2472I:{code:"IBM2472I",severity:"E",message:"RULES(NOYY) conflicts with use of the DATE built-in function.",fullCode:"IBM2472IE"},IBM2473I:{code:"IBM2473I",severity:"E",message:t=>`RULES(NOLAXINTERFACE) violation: ${t} has not been explicitly declared.`,fullCode:"IBM2473IE"},IBM2474I:{code:"IBM2474I",severity:"E",message:"RULES(NOGOTO) violation: GOTO jumps to a previous line in the current block.",fullCode:"IBM2474IE"},IBM2475I:{code:"IBM2475I",severity:"E",message:"RULES(NOMULTISEMI) violation: line contains too many semicolons.",fullCode:"IBM2475IE"},IBM2476I:{code:"IBM2476I",severity:"E",message:"Item in OPTIONS list is invalid for ON-unit BEGIN blocks.  ${option name }  is ignored.",fullCode:"IBM2476IE"},IBM2478I:{code:"IBM2478I",severity:"E",message:"Under RULES(NOCOMPLEX), the COMPLEX attribute, the COMPLEX built-in function, and constants ending with the I suffix are not allowed.",fullCode:"IBM2478IE"},IBM2479I:{code:"IBM2479I",severity:"E",message:"RULES(NOLAXPACKAGE) violation: compilation unit does not contain a PACKAGE statement.",fullCode:"IBM2479IE"},IBM2480I:{code:"IBM2480I",severity:"E",message:"RULES(NOLAXEXPORTS) violation: package contains PROCEDUREs but no EXPORTS clause naming specifically which PROCEDUREs are exported.",fullCode:"IBM2480IE"},IBM2481I:{code:"IBM2481I",severity:"E",message:"RULES(NOLAXSCALE) violation: scale factor is greater than 0.",fullCode:"IBM2481IE"},IBM2482I:{code:"IBM2482I",severity:"E",message:t=>`RULES(NOLAXPARMS) violation: Parameter ${t} is declared without INONLY, OUTONLY, or INOUT.`,fullCode:"IBM2482IE"},IBM2483I:{code:"IBM2483I",severity:"E",message:(t,e,n)=>`RULES(NOPADDING) violation: the structure ${t} is ${e} -byte aligned, but does not have a multiple of ${n} bytes before its first element with that alignment.`,fullCode:"IBM2483IE"},IBM2484I:{code:"IBM2484I",severity:"E",message:t=>`RULES(NOPADDING) violation: the structure ${t} does not have a multiple of 8 bits before its first element with byte (or greater) alignment.`,fullCode:"IBM2484IE"},IBM2485I:{code:"IBM2485I",severity:"E",message:t=>`RULES(NOPADDING) violation: the size of the structure ${t} is not a multiple of its alignment.`,fullCode:"IBM2485IE"},IBM2486I:{code:"IBM2486I",severity:"E",message:t=>`RULES(NOPADDING) violation: the structure ${t} does not have a multiple of 8 bits after its last element with byte (or greater) alignment.`,fullCode:"IBM2486IE"},IBM2487I:{code:"IBM2487I",severity:"E",message:t=>`RULES(NOPADDING) violation: the structure ${t} does not contain a multiple of 8 bits.`,fullCode:"IBM2487IE"},IBM2489I:{code:"IBM2489I",severity:"E",message:(t,e,n,r,i,s)=>`RULES(NOLAXSCALE) violation: FIXED DEC( ${t} , ${e} ) operand 66  will be converted to FIXED BIN( ${n} , ${r} ). This introduces a non-zero scale factor into an integer operation and will produce a result with the attributes FIXED BIN( ${i} , ${s} ).`,fullCode:"IBM2489IE"},IBM2490I:{code:"IBM2490I",severity:"E",message:"Source in assignment does not fit in the the VALUERANGE of the target.",fullCode:"IBM2490IE"},IBM2491I:{code:"IBM2491I",severity:"E",message:"Source in assignment does not occur in the the VALUELIST of the target.",fullCode:"IBM2491IE"},IBM2492I:{code:"IBM2492I",severity:"E",message:t=>`RULES(NOGLOBAL) violation: Variable ${t} is used inside a nested PROCEDURE.`,fullCode:"IBM2492IE"},IBM2493I:{code:"IBM2493I",severity:"E",message:(t,e)=>`RULES(NOLAXOPTIONAL) violation: Variable ${t} is used as an argument to the ${e} function, but does not have the OPTIONAL attribute.`,fullCode:"IBM2493IE"},IBM2494I:{code:"IBM2494I",severity:"E",message:t=>`RULES(NOLAXQUAL) violation: Structure element ${t} is not fully qualified.`,fullCode:"IBM2494IE"},IBM2495I:{code:"IBM2495I",severity:"E",message:t=>`Third argument in ${t} reference is too small. It will be replaced by the value of the second argument minus 1.`,fullCode:"IBM2495IE"},IBM2499I:{code:"IBM2499I",severity:"E",message:t=>`MAXRUNONIF limit exceeded: IF statement tests an expression that consists of ${t} comparisons of the same reference against a series of constant values. The expression could be replaced by one INLIST reference.`,fullCode:"IBM2499IE"},IBM2500I:{code:"IBM2500I",severity:"E",message:t=>`MAXRUNONIF limit exceeded: IF statement tests an expression that consists of ${t} comparisons of the same reference against a series of constant values. The statement could be replaced by a SELECT statement containing one large WHEN statement.`,fullCode:"IBM2500IE"},IBM2501I:{code:"IBM2501I",severity:"E",message:"Alignment value is invalid and will be ignored.",fullCode:"IBM2501IE"},IBM2502I:{code:"IBM2502I",severity:"E",message:(t,e)=>`The compiler option CMPAT specifies V ${t} but the CMPAT suboption in the OPTIONS attribute specifies V ${e} . These values should match.`,fullCode:"IBM2502IE"},IBM2503I:{code:"IBM2503I",severity:"E",message:t=>`RULES(NOLAXENTRY) violation: ${t} has a parameter with the ENTRY attribute but which does not specify a parameter list.`,fullCode:"IBM2503IE"},IBM2504I:{code:"IBM2504I",severity:"E",message:"PROCINC syntax is invalid.",fullCode:"IBM2504IE"},IBM2505I:{code:"IBM2505I",severity:"E",message:"PROCINC files must include only PROCESS and PROCINC statements.",fullCode:"IBM2505IE"},IBM2506I:{code:"IBM2506I",severity:"E",message:"Only LIMITED ENTRY may be passed BYVALUE. All other ENTRY must be passed BYADDR.",fullCode:"IBM2506IE"},IBM2507I:{code:"IBM2507I",severity:"E",message:(t,e,n)=>`Tne result of the ${t} built-in would have the attributes FIXED BIN( ${e} , ${n} ), but FIXED BIN scale factors must be between zero and the specified precision. The scale factor will be adjusted to fit.`,fullCode:"IBM2507IE"},IBM2508I:{code:"IBM2508I",severity:"E",message:"In FIXED BIN(p,q) declares q must be between 0 and p (inclusive).",fullCode:"IBM2508IE"},IBM2509I:{code:"IBM2509I",severity:"E",message:"Support for ROUND of fixed binary expressions is deprecated and will be withdrawn in the next release.",fullCode:"IBM2509IE"},IBM2510I:{code:"IBM2510I",severity:"E",message:t=>`In ${t} of FIXED BIN(p,q), q should be greater than 0.`,fullCode:"IBM2510IE"},IBM2511I:{code:"IBM2511I",severity:"E",message:(t,e,n)=>`The operands in a multiplication operation have the attributes ${t} and ${e} which will produce a result with the attributes ${n} . This means that its scale factor is greater than its precision! That may lead to the loss of significant digits and unexpected results. You may be able to avoid this problem by reducing the the scale factor of 68  one of the operands or by using the MULTIPLY built-in function.`,fullCode:"IBM2511IE"},IBM2512I:{code:"IBM2512I",severity:"E",message:(t,e,n)=>`The operands in a division operation have the attributes ${t} and ${e} which will produce a result with the attributes ${n} . This means that its scale factor is negative! That may lead to the loss of significant digits and unexpected results. You may be able to avoid this problem by changing the the scale factor of the divisor (for example, if the divisor is the constant 100.0, by changing it to 100) or by using the DIVIDE built-in function.`,fullCode:"IBM2512IE"}};function dP(t){const e=t.validation.ValidationRegistry;const n=t.validation.Pl1Validator;const r={Exports:[oP],MemberCall:[cP],ProcedureStatement:[uP],LabelReference:[n.checkLabelReference]};e.register(r,n)}class fP{checkLabelReference(e,n){if(e.label&&!e.label.ref){n("warning",ug.IBM3332I.message,{code:ug.IBM3332I.fullCode,node:e,property:"label"});n("error",cg.IBM1316I.message,{code:cg.IBM1316I.fullCode,node:e,property:"label"})}}}const pP="\n".charCodeAt(0);class mP extends kv{tokenize(e){const n=this.splitLines(e);const r=n.map(s=>this.adjustLine(s));const i=r.join("");return super.tokenize(i)}splitLines(e){const n=[];for(let r=0;r<e.length;r++){const i=r;while(r<e.length&&e.charCodeAt(r)!==pP){r++}n.push(e.substring(i,r+1))}return n}adjustLine(e){let n="";if(e.endsWith("\r\n")){n="\r\n"}else if(e.endsWith("\n")){n="\n"}const r=1;const i=e.length-n.length;if(i<r){return" ".repeat(i)+n}const s=72;const a=" ".repeat(r);let o="";if(i>s){o=" ".repeat(i-s)}return a+e.substring(r,Math.min(s,i))+o+n}}class hP extends mv{buildTokens(e,n){const r=Ae(sp(e,false));const i=this.buildTerminalTokens(r);const s=this.buildKeywordTokens(r,i,n);const a=i.find(l=>l.name==="ID");for(const l of s){if(/[a-zA-Z]/.test(l.name)){l.CATEGORIES=[a]}}i.forEach(l=>{const u=l.PATTERN;if(typeof u==="object"&&u&&"test"in u&&ou(u)||l.name==="ExecFragment"){s.unshift(l)}else{s.push(l)}});const o=s.find(l=>l.name==="ExecFragment");o.START_CHARS_HINT=["S","C"];return s}}class yP extends Tv{async computeExports(e,n=K.CancellationToken.None){return this.computeExportsForNode(e.parseResult.value,e,Tr,n)}processNode(e,n,r){const i=iu(e);if(i){const s=this.nameProvider.getName(e);if(s){r.add(i,this.descriptions.createDescription(e,s,n))}}}}class gP extends Mv{processLinkingErrors(e,n,r){for(const i of e.references){const s=i.error;if(s){const a={node:s.container,property:s.property,index:s.index,data:{code:xt.LinkingError,containerType:s.container.$type,property:s.property,refText:s.reference.$refText}};n.push(this.toDiagnostic("warning",s.message,a))}}}}class IP extends nk{highlightElement(e,n){if(Zk(e)){const r=e.ref?.ref;n({node:e,property:"ref",type:rn(r)?K.SemanticTokenTypes.function:K.SemanticTokenTypes.variable})}else if(zr(e)||iR(e)){n({node:e,property:"name",type:K.SemanticTokenTypes.variable})}else if(Gk(e)){n({node:e,property:"name",type:K.SemanticTokenTypes.type})}else if(Qk(e)){n({node:e,property:"id",type:K.SemanticTokenTypes.parameter})}else if(Hk(e)){const r=e.$container;n({node:e,property:"label",type:rn(r)?K.SemanticTokenTypes.function:K.SemanticTokenTypes.variable})}else if(Vk(e)){n({node:e,property:"label",type:K.SemanticTokenTypes.variable})}else if(Jk(e)){n({node:e,property:"procedure",type:K.SemanticTokenTypes.function})}else if(Hs(e)){const r=e.$container;n({node:e,property:"name",type:rn(r)?K.SemanticTokenTypes.function:K.SemanticTokenTypes.variable})}else if(Yk(e)){n({node:e,property:"value",type:K.SemanticTokenTypes.number})}else if(nP(e)){n({node:e,property:"value",type:K.SemanticTokenTypes.string})}else if(zk(e)){n({node:e,property:"multiplier",type:K.SemanticTokenTypes.number})}}}class vP extends Ev{getName(e){if(rn(e)){const n=e.labels[0];return n?.name||void 0}else{return super.getName(e)}}getNameNode(e){if(rn(e)){const n=e.labels[0];if(n){return this.getNameNode(n)}else{return void 0}}else{return super.getNameNode(e)}}}class RP extends $v{findReferences(e,n){if(Hs(e)&&rn(e.$container)){return this.findReferences(e.$container,n)}else{return super.findReferences(e,n)}}}class EP extends Av{globalDocumentScopeCache;constructor(e){super(e);this.globalDocumentScopeCache=new sS(e.shared)}getGlobalScope(e,n){return this.globalDocumentScopeCache.get(ct(n.container).uri,e,()=>{const r=qn(ct(n.container).parseResult.value).filter(jk);const i=this.getUrisFromIncludes(ct(n.container).uri,r.toArray());return new Cv(this.indexManager.allElements(e,i))})}getUrisFromIncludes(e,n){const r=new Set;r.add(e.toString());const i=Ke.dirname(e);for(const s of n){for(const a of s.items){const o=Ke.joinPath(i,a.file.substring(1,a.file.length-1));r.add(o.toString())}}r.add("pli-builtin:/builtins.pli");return r}getScope(e){if(e.property==="ref"){const n=Sn(e.container,Xk);if(n?.previous){const r=n.previous.element.ref.ref;if(r&&zr(r)){return this.createScopeForNodes(this.findChildren(r))}else{return rS}}}return super.getScope(e)}findChildren(e){const n=e.$container;let r=Number(n.level);if(isNaN(r)||r<1){r=1}const i=[];const s=n.$container;const a=s.items.indexOf(n);for(let o=a+1;o<s.items.length;o++){const l=s.items[o];const u=Number(l.level);if(isNaN(u)||u<r){break}if(u===r+1){if(zr(l.element)){i.push(l.element)}}}return i}}class $P extends rR{getSymbolKind(e){const n=this.getNode(e);if(!n){return An.Null}if(rn(n)){return An.Function}else if(qy(n)){return An.Variable}else if(Zy(n)){return An.Namespace}else if(Hs(n)){return An.Constant}else{return An.Variable}}getCompletionItemKind(e){const n=this.getNode(e);if(!n){return bn.Text}if(rn(n)){return bn.Function}else if(qy(n)){return bn.Variable}else if(Zy(n)){return bn.Module}else if(Hs(n)){return bn.Constant}return bn.Variable}getNode(e){if(dg(e)){return e.node}return e}}class TP extends xv{getDocumentation(e){if(zr(e)){const n=e.$container;let r=`\`\`\`
DECLARE ${e.name} `;for(const i of n.attributes){r+=`${i.$cstNode?.text} `}r+="\n```";return r}else if(Hs(e)&&rn(e.$container)){return this.getProcedureHoverContent(e.$container)}else if(rn(e)){return this.getProcedureHoverContent(e)}else if(iR(e)){return"```\nDECLARE"+e.name+"\n```"}return""}getProcedureHoverContent(e){let n="```\n";for(const r of e.labels){n+=`${r.name} `}n+="PROCEDURE ";if(e.parameters.length>0){n+="("+e.parameters.map(r=>r.id).join(", ")+") "}if(e.recursive.length>0){n+="RECURSIVE "}if(e.order.includes("ORDER")){n+="ORDER "}else if(e.order.includes("REORDER")){n+="REORDER "}if(e.options.length>0){n+=e.options.map(r=>r.$cstNode?.text).join(" ")}if(e.returns.length>0){n+=e.returns.map(r=>r.$cstNode?.text).join(" ")}n+="\n```";return n}}class CP extends tR{createReferenceCompletionItem(e){let n=void 0;if(e.type==="ProcedureStatement"){n="PROCEDURE"}else if(e.type==="DeclaredVariable"||e.type==="DoType3Variable"){n="DECLARE"}else if(e.type==="LabelPrefix"){n="LABEL"}const r=this.nodeKindProvider.getCompletionItemKind(e);const i=this.getReferenceDocumentation(e);return{nodeDescription:e,kind:r,documentation:i,detail:n,sortText:"0"}}}class wP extends Sv{isAffected(e,n){return false}}const bP=` // Mathematical functions
 ABS: PROC (value) RETURNS ();
 END;

 CEIL: PROC (value) RETURNS ();
 END;

 COMPLEX: PROC (real, imag) RETURNS (COMPLEX);
 END;

 CONJG: PROC (value) RETURNS (COMPLEX);
 END;

 FLOOR: PROC (value) RETURNS ();
 END;

 IMAG: PROC (value) RETURNS ();
 END;

 MAX: PROC (value1, value2) RETURNS ();
 END;

 MAXVAL: PROC (array) RETURNS ();
 END;

 MIN: PROC (value1, value2) RETURNS ();
 END;

 MINVAL: PROC (array) RETURNS ();
 END;

 MOD: PROC (value1, value2) RETURNS ();
 END;

 RANDOM: PROC () RETURNS ();
 END;

 REAL: PROC (value) RETURNS ();
 END;

 REM: PROC (value1, value2) RETURNS ();
 END;

 ROUND: PROC (value) RETURNS ();
 END;

 ROUNDAWAYFROMZERO: PROC (value) RETURNS ();
 END;

 ROUNDTOEVEN: PROC (value) RETURNS ();
 END;

 SIGN: PROC (value) RETURNS ();
 END;

 TRUNC: PROC (value) RETURNS ();
 END;

 // Array handling functions
 ALL: PROC (array) RETURNS ();
 END;

 ANY: PROC (array) RETURNS ();
 END;

 DIMENSION: PROC (array) RETURNS ();
 END;

 HBOUND: PROC (array) RETURNS ();
 END;

 HBOUNDACROSS: PROC (array) RETURNS ();
 END;

 INARRAY: PROC (array, value) RETURNS ();
 END;

 LBOUND: PROC (array) RETURNS ();
 END;

 LBOUNDACROSS: PROC (array) RETURNS ();
 END;

 POLY: PROC (array, value) RETURNS ();
 END;

 PROD: PROC (array) RETURNS ();
 END;

 QUICKSORT: PROC (array) RETURNS ();
 END;

 QUICKSORTX: PROC (array, fn) RETURNS ();
 END;

 SUM: PROC (array) RETURNS ();
 END;

 // Buffer management functions
 COMPARE: PROC (buffer1, buffer2) RETURNS ();
 END;

 HEXENCODE: PROC (buffer) RETURNS ();
 END;

 HEXENCODE8: PROC (buffer) RETURNS ();
 END;

 HEXIMAGE: PROC (buffer) RETURNS ();
 END;

 HEXIMAGE8: PROC (buffer) RETURNS ();
 END;

 MEMCONVERT: PROC (buffer, from, to) RETURNS ();
 END;

 MEMCOLLAPSE: PROC (buffer) RETURNS ();
 END;

 MEMCU12: PROC (buffer, target) RETURNS ();
 END;

 MEMCU14: PROC (buffer, target) RETURNS ();
 END;

 MEMCU21: PROC (buffer, target) RETURNS ();
 END;

 MEMCU24: PROC (buffer, target) RETURNS ();
 END;

 MEMCU41: PROC (buffer, target) RETURNS ();
 END;

 MEMCU42: PROC (buffer, target) RETURNS ();
 END;

 MEMINDEX: PROC (buffer, value) RETURNS ();
 END;

 MEMREPLACE: PROC (buffer, value, replacement) RETURNS ();
 END;

 MEMSEARCH: PROC (buffer, value) RETURNS ();
 END;

 MEMSEARCHR: PROC (buffer, value) RETURNS ();
 END;

 MEMSQUEEZE: PROC (buffer, target, replacement) RETURNS ();
 END;

 /** 
  * Searches for the first nonoccurrence of any one of the elements of 
  * a string within a buffer. 
  */
 MEMVERIFY: PROC (buffer, value) RETURNS ();
 END;

 MEMVERIFYR: PROC (buffer, value) RETURNS ();
 END;

 WHEREDIFF: PROC (buffer1, buffer2) RETURNS ();
 END;

 WSCOLLAPSE: PROC (buffer, target) RETURNS ();
 END;

 WSCOLLAPSE16: PROC (buffer, target) RETURNS ();
 END;

 WSREPLACE: PROC (buffer, target) RETURNS ();
 END;

 WSREPLACE16: PROC (buffer, target) RETURNS ();
 END;

 XMLCHAR: PROC (buffer) RETURNS ();
 END;

 XMLSCRUB: PROC (buffer) RETURNS ();
 END;

 XMLSCRUB16: PROC (buffer) RETURNS ();
 END;

 XMLUCHAR: PROC (buffer) RETURNS ();
 END;

 // Condition handling builtins
 DATAFIELD: PROC () RETURNS ();
 END;
 ONACTUAL: PROC () RETURNS ();
 END;
 ONAREA: PROC () RETURNS ();
 END;
 ONCHAR: PROC () RETURNS ();
 END;
 ONEXPECTED: PROC () RETURNS ();
 END;
 ONCODE: PROC () RETURNS ();
 END;
 ONCONDCOND: PROC () RETURNS ();
 END;
 ONCONDID: PROC () RETURNS ();
 END;
 ONCOUNT: PROC () RETURNS ();
 END;
 ONFILE: PROC () RETURNS ();
 END;
 ONGSOURCE: PROC () RETURNS ();
 END;
 ONHBOUND: PROC () RETURNS ();
 END;
 ONJSONNAME: PROC () RETURNS ();
 END;
 ONKEY: PROC () RETURNS ();
 END;
 ONLBOUND: PROC () RETURNS ();
 END;
 ONLINE: PROC () RETURNS ();
 END;
 ONLOC: PROC () RETURNS ();
 END;
 ONOFFSET: PROC () RETURNS ();
 END;
 ONOPERATOR: PROC () RETURNS ();
 END;
 ONPACKAGE: PROC () RETURNS ();
 END;
 ONPROCEDURE: PROC () RETURNS ();
 END;
 ONSOURCE: PROC () RETURNS ();
 END;
 ONSUBSCRIPT: PROC () RETURNS ();
 END;
 ONTEXT: PROC () RETURNS ();
 END;
 ONUCHAR: PROC () RETURNS ();
 END;
 ONUSOURCE: PROC () RETURNS ();
 END;
 ONWCHAR: PROC () RETURNS ();
 END;
 ONWSOURCE: PROC () RETURNS ();
 END;

 // Date and time functions
 DATE: PROC () RETURNS ();
 END;

 DATEIME: PROC () RETURNS ();
 END;

 DAYS: PROC () RETURNS ();
 END;

 DAYSTODATE: PROC (days) RETURNS ();
 END;

 DAYSTOMICROSECS: PROC (days) RETURNS ();
 END;

 DAYSTOSECS: PROC (days) RETURNS ();
 END;

 JULIANTOSMF: PROC (julian) RETURNS ();
 END;

 MAXDATE: PROC () RETURNS ();
 END;

 MICROSECS: PROC () RETURNS ();
 END;

 MICROSECSTODATE: PROC (microsecs) RETURNS ();
 END;

 MICROSECSTODAYS: PROC (microsecs) RETURNS ();
 END;

 MINDATE: PROC () RETURNS ();
 END;

 REPATTERN: PROC () RETURNS ();
 END;

 SECS: PROC () RETURNS ();
 END;

 SECSTODATE: PROC (secs) RETURNS ();
 END;

 SECSTODAYS: PROC (secs) RETURNS ();
 END;

 SMFTOJULIAN: PROC (smf) RETURNS ();
 END;

 STCKETODATE: PROC (stck) RETURNS ();
 END;

 STCKTODATE: PROC (stck) RETURNS ();
 END;

 TIME: PROC () RETURNS ();
 END;

 TIMESTAMP: PROC () RETURNS ();
 END;

 UTCDATETIME: PROC () RETURNS ();
 END;

 UTCMICROSECS: PROC () RETURNS ();
 END;

 UTCSECS: PROC () RETURNS ();
 END;

 VALIDDATE: PROC (date) RETURNS ();
 END;

 WEEKDAY: PROC (date) RETURNS ();
 END;

 Y4DATE: PROC (date) RETURNS ();
 END;

 Y4JULIAN: PROC (julian) RETURNS ();
 END;

 Y4YEAR: PROC (date) RETURNS ();
 END;

 // Encoding and hashing functions
 BASE64DECODE: PROC (buffer) RETURNS ();
 END;
 BASE64DECODE8: PROC (buffer) RETURNS ();
 END;
 BASE64DECODE16: PROC (buffer) RETURNS ();
 END;
 BASE64ENCODE: PROC (buffer) RETURNS ();
 END;
 BASE64ENCODE8: PROC (buffer) RETURNS ();
 END;
 BASE64ENCODE16: PROC (buffer) RETURNS ();
 END;
 CHECKSUM: PROC (buffer) RETURNS ();
 END;
 HEXDECODE: PROC (buffer) RETURNS ();
 END;
 HEXDECODE8: PROC (buffer) RETURNS ();
 END;
 SHA1DIGEST: PROC (buffer) RETURNS ();
 END;
 SHA1FINAL: PROC (buffer) RETURNS ();
 END;
 SHA1INIT: PROC (buffer) RETURNS ();
 END;
 SHA1UPDATE: PROC (buffer) RETURNS ();
 END;
 SHA2DIGESTx: PROC (buffer) RETURNS ();
 END;
 SHA2FINALx: PROC (buffer) RETURNS ();
 END;
 SHA2INITx: PROC (buffer) RETURNS ();
 END;
 SHA2UPDATEx: PROC (buffer) RETURNS ();
 END;
 SHA3DIGESTx: PROC (buffer) RETURNS ();
 END;
 SHA3FINALx: PROC (buffer) RETURNS ();
 END;
 SHA3INITx: PROC (buffer) RETURNS ();
 END;
 SHA3UPDATEx: PROC (buffer) RETURNS ();
 END;
 
 // Floating point inquiry functions
 EPSILON: PROC () RETURNS ();
 END;
 HUGE: PROC () RETURNS ();
 END;
 ISFINITE: PROC (value) RETURNS ();
 END;
 ISINF: PROC (value) RETURNS ();
 END;
 ISNAN: PROC (value) RETURNS ();
 END;
 ISNORMAL: PROC (value) RETURNS ();
 END;
 ISZERO: PROC (value) RETURNS ();
 END;
 MAXEXP: PROC () RETURNS ();
 END;
 MINEXP: PROC () RETURNS ();
 END;
 PLACES: PROC (value) RETURNS ();
 END;
 RADIX: PROC (value) RETURNS ();
 END;
 TINY: PROC () RETURNS ();
 END;
 EXPONENT: PROC (value) RETURNS ();
 END;
 PRED: PROC (value) RETURNS ();
 END;
 SCALE: PROC (value, radix) RETURNS ();
 END;
 SUCC: PROC (value) RETURNS ();
 END;
 `;class AP extends Nv{factory;constructor(e){super(e);this.factory=e.workspace.LangiumDocumentFactory}async loadAdditionalDocuments(e,n){const r=this.factory.fromString(bP,dt.parse("pli-builtin:///builtins.pli"));n(r)}traverseFolder(){return Promise.resolve()}}class MP extends nR{didCloseDocument(e){const n=dt.parse(e.document.uri);if(n.scheme!=="pli-builtin"){this.fireDocumentUpdate([],[n])}}}const SP={documentation:{DocumentationProvider:t=>new TP(t)},validation:{Pl1Validator:()=>new fP,DocumentValidator:t=>new gP(t)},parser:{Lexer:t=>new mP(t),TokenBuilder:()=>new hP},references:{ScopeComputation:t=>new yP(t),NameProvider:()=>new vP,References:t=>new RP(t),ScopeProvider:t=>new EP(t)},lsp:{SemanticTokenProvider:t=>new IP(t),CompletionProvider:t=>new CP(t)}};const NP={lsp:{NodeKindProvider:()=>new $P,DocumentUpdateHandler:t=>new MP(t)},workspace:{IndexManager:t=>new wP(t),WorkspaceManager:t=>new AP(t)}};function kP(t){const e=Pu(xk(t),sP,NP);const n=Pu(Bk({shared:e}),aP,SP);e.ServiceRegistry.register(n);dP(n);if(!t.connection){e.workspace.ConfigurationProvider.initialized({})}return{shared:e,pli:n}}const PP=new Vp.BrowserMessageReader(self);const DP=new Vp.BrowserMessageWriter(self);const OP=Vp.createConnection(PP,DP);const{shared:_P}=kP({connection:OP,...Gv});sk(_P)});export default BP();
