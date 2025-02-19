var E$=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);var sI=E$((Ot,It)=>{function rt(t){return typeof t==="object"&&t!==null&&typeof t.$type==="string"}function on(t){return typeof t==="object"&&t!==null&&typeof t.$refText==="string"}function Rg(t){return typeof t==="object"&&t!==null&&typeof t.name==="string"&&typeof t.type==="string"&&typeof t.path==="string"}function ql(t){return typeof t==="object"&&t!==null&&rt(t.container)&&on(t.reference)&&typeof t.message==="string"}class vg{constructor(){this.subtypes={};this.allSubtypes={}}isInstance(e,n){return rt(e)&&this.isSubtype(e.$type,n)}isSubtype(e,n){if(e===n){return true}let r=this.subtypes[e];if(!r){r=this.subtypes[e]={}}const i=r[n];if(i!==void 0){return i}else{const a=this.computeIsSubtype(e,n);r[n]=a;return a}}getAllSubTypes(e){const n=this.allSubtypes[e];if(n){return n}else{const r=this.getAllTypes();const i=[];for(const a of r){if(this.isSubtype(a,e)){i.push(a)}}this.allSubtypes[e]=i;return i}}}function Tr(t){return typeof t==="object"&&t!==null&&Array.isArray(t.content)}function Ja(t){return typeof t==="object"&&t!==null&&typeof t.tokenType==="object"}function $g(t){return Tr(t)&&typeof t.fullText==="string"}class tt{constructor(e,n){this.startFn=e;this.nextFn=n}iterator(){const e={state:this.startFn(),next:()=>this.nextFn(e.state),[Symbol.iterator]:()=>e};return e}[Symbol.iterator](){return this.iterator()}isEmpty(){const e=this.iterator();return Boolean(e.next().done)}count(){const e=this.iterator();let n=0;let r=e.next();while(!r.done){n++;r=e.next()}return n}toArray(){const e=[];const n=this.iterator();let r;do{r=n.next();if(r.value!==void 0){e.push(r.value)}}while(!r.done);return e}toSet(){return new Set(this)}toMap(e,n){const r=this.map(i=>[e?e(i):i,n?n(i):i]);return new Map(r)}toString(){return this.join()}concat(e){return new tt(()=>({first:this.startFn(),firstDone:false,iterator:e[Symbol.iterator]()}),n=>{let r;if(!n.firstDone){do{r=this.nextFn(n.first);if(!r.done){return r}}while(!r.done);n.firstDone=true}do{r=n.iterator.next();if(!r.done){return r}}while(!r.done);return Dt})}join(e=","){const n=this.iterator();let r="";let i;let a=false;do{i=n.next();if(!i.done){if(a){r+=e}r+=w$(i.value)}a=true}while(!i.done);return r}indexOf(e,n=0){const r=this.iterator();let i=0;let a=r.next();while(!a.done){if(i>=n&&a.value===e){return i}a=r.next();i++}return-1}every(e){const n=this.iterator();let r=n.next();while(!r.done){if(!e(r.value)){return false}r=n.next()}return true}some(e){const n=this.iterator();let r=n.next();while(!r.done){if(e(r.value)){return true}r=n.next()}return false}forEach(e){const n=this.iterator();let r=0;let i=n.next();while(!i.done){e(i.value,r);i=n.next();r++}}map(e){return new tt(this.startFn,n=>{const{done:r,value:i}=this.nextFn(n);if(r){return Dt}else{return{done:false,value:e(i)}}})}filter(e){return new tt(this.startFn,n=>{let r;do{r=this.nextFn(n);if(!r.done&&e(r.value)){return r}}while(!r.done);return Dt})}nonNullable(){return this.filter(e=>e!==void 0&&e!==null)}reduce(e,n){const r=this.iterator();let i=n;let a=r.next();while(!a.done){if(i===void 0){i=a.value}else{i=e(i,a.value)}a=r.next()}return i}reduceRight(e,n){return this.recursiveReduce(this.iterator(),e,n)}recursiveReduce(e,n,r){const i=e.next();if(i.done){return r}const a=this.recursiveReduce(e,n,r);if(a===void 0){return i.value}return n(a,i.value)}find(e){const n=this.iterator();let r=n.next();while(!r.done){if(e(r.value)){return r.value}r=n.next()}return void 0}findIndex(e){const n=this.iterator();let r=0;let i=n.next();while(!i.done){if(e(i.value)){return r}i=n.next();r++}return-1}includes(e){const n=this.iterator();let r=n.next();while(!r.done){if(r.value===e){return true}r=n.next()}return false}flatMap(e){return new tt(()=>({this:this.startFn()}),n=>{do{if(n.iterator){const a=n.iterator.next();if(a.done){n.iterator=void 0}else{return a}}const{done:r,value:i}=this.nextFn(n.this);if(!r){const a=e(i);if(su(a)){n.iterator=a[Symbol.iterator]()}else{return{done:false,value:a}}}}while(n.iterator);return Dt})}flat(e){if(e===void 0){e=1}if(e<=0){return this}const n=e>1?this.flat(e-1):this;return new tt(()=>({this:n.startFn()}),r=>{do{if(r.iterator){const s=r.iterator.next();if(s.done){r.iterator=void 0}else{return s}}const{done:i,value:a}=n.nextFn(r.this);if(!i){if(su(a)){r.iterator=a[Symbol.iterator]()}else{return{done:false,value:a}}}}while(r.iterator);return Dt})}head(){const e=this.iterator();const n=e.next();if(n.done){return void 0}return n.value}tail(e=1){return new tt(()=>{const n=this.startFn();for(let r=0;r<e;r++){const i=this.nextFn(n);if(i.done){return n}}return n},this.nextFn)}limit(e){return new tt(()=>({size:0,state:this.startFn()}),n=>{n.size++;if(n.size>e){return Dt}return this.nextFn(n.state)})}distinct(e){return new tt(()=>({set:new Set,internalState:this.startFn()}),n=>{let r;do{r=this.nextFn(n.internalState);if(!r.done){const i=e?e(r.value):r.value;if(!n.set.has(i)){n.set.add(i);return r}}}while(!r.done);return Dt})}exclude(e,n){const r=new Set;for(const i of e){const a=n?n(i):i;r.add(a)}return this.filter(i=>{const a=n?n(i):i;return!r.has(a)})}}function w$(t){if(typeof t==="string"){return t}if(typeof t==="undefined"){return"undefined"}if(typeof t.toString==="function"){return t.toString()}return Object.prototype.toString.call(t)}function su(t){return!!t&&typeof t[Symbol.iterator]==="function"}const Tg=new tt(()=>void 0,()=>Dt);const Dt=Object.freeze({done:true,value:void 0});function be(...t){if(t.length===1){const e=t[0];if(e instanceof tt){return e}if(su(e)){return new tt(()=>e[Symbol.iterator](),n=>n.next())}if(typeof e.length==="number"){return new tt(()=>({index:0}),n=>{if(n.index<e.length){return{done:false,value:e[n.index++]}}else{return Dt}})}}if(t.length>1){return new tt(()=>({collIndex:0,arrIndex:0}),e=>{do{if(e.iterator){const n=e.iterator.next();if(!n.done){return n}e.iterator=void 0}if(e.array){if(e.arrIndex<e.array.length){return{done:false,value:e.array[e.arrIndex++]}}e.array=void 0;e.arrIndex=0}if(e.collIndex<t.length){const n=t[e.collIndex++];if(su(n)){e.iterator=n[Symbol.iterator]()}else if(n&&typeof n.length==="number"){e.array=n}}}while(e.iterator||e.array||e.collIndex<t.length);return Dt})}return Tg}class ou extends tt{constructor(e,n,r){super(()=>({iterators:(r===null||r===void 0?void 0:r.includeRoot)?[[e][Symbol.iterator]()]:[n(e)[Symbol.iterator]()],pruned:false}),i=>{if(i.pruned){i.iterators.pop();i.pruned=false}while(i.iterators.length>0){const a=i.iterators[i.iterators.length-1];const s=a.next();if(s.done){i.iterators.pop()}else{i.iterators.push(n(s.value)[Symbol.iterator]());return s}}return Dt})}iterator(){const e={state:this.startFn(),next:()=>this.nextFn(e.state),prune:()=>{e.state.pruned=true},[Symbol.iterator]:()=>e};return e}}var Ld;(function(t){function e(a){return a.reduce((s,o)=>s+o,0)}t.sum=e;function n(a){return a.reduce((s,o)=>s*o,0)}t.product=n;function r(a){return a.reduce((s,o)=>Math.min(s,o))}t.min=r;function i(a){return a.reduce((s,o)=>Math.max(s,o))}t.max=i})(Ld||(Ld={}));function lu(t){return new ou(t,e=>{if(Tr(e)){return e.content}else{return[]}},{includeRoot:true})}function C$(t){return lu(t).filter(Ja)}function A$(t,e){while(t.container){t=t.container;if(t===e){return true}}return false}function xd(t){return{start:{character:t.startColumn-1,line:t.startLine-1},end:{character:t.endColumn,line:t.endLine-1}}}function uu(t){if(!t){return void 0}const{offset:e,end:n,range:r}=t;return{range:r,offset:e,end:n,length:n-e}}var Nn;(function(t){t[t["Before"]=0]="Before";t[t["After"]=1]="After";t[t["OverlapFront"]=2]="OverlapFront";t[t["OverlapBack"]=3]="OverlapBack";t[t["Inside"]=4]="Inside";t[t["Outside"]=5]="Outside"})(Nn||(Nn={}));function S$(t,e){if(t.end.line<e.start.line||t.end.line===e.start.line&&t.end.character<=e.start.character){return Nn.Before}else if(t.start.line>e.end.line||t.start.line===e.end.line&&t.start.character>=e.end.character){return Nn.After}const n=t.start.line>e.start.line||t.start.line===e.start.line&&t.start.character>=e.start.character;const r=t.end.line<e.end.line||t.end.line===e.end.line&&t.end.character<=e.end.character;if(n&&r){return Nn.Inside}else if(n){return Nn.OverlapBack}else if(r){return Nn.OverlapFront}else{return Nn.Outside}}function Eg(t,e){const n=S$(t,e);return n>Nn.After}const wg=/^[\w\p{L}]$/u;function Er(t,e,n=wg){if(t){if(e>0){const r=e-t.offset;const i=t.text.charAt(r);if(!n.test(i)){e--}}return Cg(t,e)}return void 0}function k$(t,e){if(t){const n=b$(t,true);if(n&&rm(n,e)){return n}if($g(t)){const r=t.content.findIndex(i=>!i.hidden);for(let i=r-1;i>=0;i--){const a=t.content[i];if(rm(a,e)){return a}}}}return void 0}function rm(t,e){return Ja(t)&&e.includes(t.tokenType.name)}function Cg(t,e){if(Ja(t)){return t}else if(Tr(t)){const n=Ag(t,e,false);if(n){return Cg(n,e)}}return void 0}function Md(t,e){if(Ja(t)){return t}else if(Tr(t)){const n=Ag(t,e,true);if(n){return Md(n,e)}}return void 0}function Ag(t,e,n){let r=0;let i=t.content.length-1;let a=void 0;while(r<=i){const s=Math.floor((r+i)/2);const o=t.content[s];if(o.offset<=e&&o.end>e){return o}if(o.end<=e){a=n?o:void 0;r=s+1}else{i=s-1}}return a}function b$(t,e=true){while(t.container){const n=t.container;let r=n.content.indexOf(t);while(r>0){r--;const i=n.content[r];if(e||!i.hidden){return i}}t=n}return void 0}class Sg extends Error{constructor(e,n){super(e?`${n} at ${e.range.start.line}:${e.range.start.character}`:n)}}function Qa(t){throw new Error("Error! The input value was not handled.")}const ks="AbstractRule";const bs="AbstractType";const dc="Condition";const im="TypeDefinition";const fc="ValueLiteral";const ji="AbstractElement";function kg(t){return ce.isInstance(t,ji)}const Ns="ArrayLiteral";const Ps="ArrayType";const Bi="BooleanLiteral";function N$(t){return ce.isInstance(t,Bi)}const Wi="Conjunction";function P$(t){return ce.isInstance(t,Wi)}const Vi="Disjunction";function _$(t){return ce.isInstance(t,Vi)}const _s="Grammar";const pc="GrammarImport";const zi="InferredType";function bg(t){return ce.isInstance(t,zi)}const Yi="Interface";function Ng(t){return ce.isInstance(t,Yi)}const mc="NamedArgument";const Xi="Negation";function D$(t){return ce.isInstance(t,Xi)}const Ds="NumberLiteral";const Os="Parameter";const Ji="ParameterReference";function O$(t){return ce.isInstance(t,Ji)}const Qi="ParserRule";function ct(t){return ce.isInstance(t,Qi)}const Is="ReferenceType";const jl="ReturnType";function I$(t){return ce.isInstance(t,jl)}const Zi="SimpleType";function L$(t){return ce.isInstance(t,Zi)}const Ls="StringLiteral";const Ur="TerminalRule";function tr(t){return ce.isInstance(t,Ur)}const ea="Type";function Pg(t){return ce.isInstance(t,ea)}const hc="TypeAttribute";const xs="UnionType";const ta="Action";function Za(t){return ce.isInstance(t,ta)}const na="Alternatives";function dp(t){return ce.isInstance(t,na)}const ra="Assignment";function cn(t){return ce.isInstance(t,ra)}const ia="CharacterRange";function x$(t){return ce.isInstance(t,ia)}const aa="CrossReference";function es(t){return ce.isInstance(t,aa)}const sa="EndOfFile";function M$(t){return ce.isInstance(t,sa)}const oa="Group";function wr(t){return ce.isInstance(t,oa)}const la="Keyword";function dn(t){return ce.isInstance(t,la)}const ua="NegatedToken";function K$(t){return ce.isInstance(t,ua)}const ca="RegexToken";function F$(t){return ce.isInstance(t,ca)}const da="RuleCall";function Mn(t){return ce.isInstance(t,da)}const fa="TerminalAlternatives";function U$(t){return ce.isInstance(t,fa)}const pa="TerminalGroup";function G$(t){return ce.isInstance(t,pa)}const ma="TerminalRuleCall";function H$(t){return ce.isInstance(t,ma)}const ha="UnorderedGroup";function fp(t){return ce.isInstance(t,ha)}const ya="UntilToken";function q$(t){return ce.isInstance(t,ya)}const ga="Wildcard";function j$(t){return ce.isInstance(t,ga)}class _g extends vg{getAllTypes(){return[ji,ks,bs,ta,na,Ns,Ps,ra,Bi,ia,dc,Wi,aa,Vi,sa,_s,pc,oa,zi,Yi,la,mc,ua,Xi,Ds,Os,Ji,Qi,Is,ca,jl,da,Zi,Ls,fa,pa,Ur,ma,ea,hc,im,xs,ha,ya,fc,ga]}computeIsSubtype(e,n){switch(e){case ta:case na:case ra:case ia:case aa:case sa:case oa:case la:case ua:case ca:case da:case fa:case pa:case ma:case ha:case ya:case ga:{return this.isSubtype(ji,n)}case Ns:case Ds:case Ls:{return this.isSubtype(fc,n)}case Ps:case Is:case Zi:case xs:{return this.isSubtype(im,n)}case Bi:{return this.isSubtype(dc,n)||this.isSubtype(fc,n)}case Wi:case Vi:case Xi:case Ji:{return this.isSubtype(dc,n)}case zi:case Yi:case ea:{return this.isSubtype(bs,n)}case Qi:{return this.isSubtype(ks,n)||this.isSubtype(bs,n)}case Ur:{return this.isSubtype(ks,n)}default:{return false}}}getReferenceType(e){const n=`${e.container.$type}:${e.property}`;switch(n){case"Action:type":case"CrossReference:type":case"Interface:superTypes":case"ParserRule:returnType":case"SimpleType:typeRef":{return bs}case"Grammar:hiddenTokens":case"ParserRule:hiddenTokens":case"RuleCall:rule":{return ks}case"Grammar:usedGrammars":{return _s}case"NamedArgument:parameter":case"ParameterReference:parameter":{return Os}case"TerminalRuleCall:rule":{return Ur}default:{throw new Error(`${n} is not a valid reference id.`)}}}getTypeMetaData(e){switch(e){case ji:{return{name:ji,properties:[{name:"cardinality"},{name:"lookahead"}]}}case Ns:{return{name:Ns,properties:[{name:"elements",defaultValue:[]}]}}case Ps:{return{name:Ps,properties:[{name:"elementType"}]}}case Bi:{return{name:Bi,properties:[{name:"true",defaultValue:false}]}}case Wi:{return{name:Wi,properties:[{name:"left"},{name:"right"}]}}case Vi:{return{name:Vi,properties:[{name:"left"},{name:"right"}]}}case _s:{return{name:_s,properties:[{name:"definesHiddenTokens",defaultValue:false},{name:"hiddenTokens",defaultValue:[]},{name:"imports",defaultValue:[]},{name:"interfaces",defaultValue:[]},{name:"isDeclared",defaultValue:false},{name:"name"},{name:"rules",defaultValue:[]},{name:"types",defaultValue:[]},{name:"usedGrammars",defaultValue:[]}]}}case pc:{return{name:pc,properties:[{name:"path"}]}}case zi:{return{name:zi,properties:[{name:"name"}]}}case Yi:{return{name:Yi,properties:[{name:"attributes",defaultValue:[]},{name:"name"},{name:"superTypes",defaultValue:[]}]}}case mc:{return{name:mc,properties:[{name:"calledByName",defaultValue:false},{name:"parameter"},{name:"value"}]}}case Xi:{return{name:Xi,properties:[{name:"value"}]}}case Ds:{return{name:Ds,properties:[{name:"value"}]}}case Os:{return{name:Os,properties:[{name:"name"}]}}case Ji:{return{name:Ji,properties:[{name:"parameter"}]}}case Qi:{return{name:Qi,properties:[{name:"dataType"},{name:"definesHiddenTokens",defaultValue:false},{name:"definition"},{name:"entry",defaultValue:false},{name:"fragment",defaultValue:false},{name:"hiddenTokens",defaultValue:[]},{name:"inferredType"},{name:"name"},{name:"parameters",defaultValue:[]},{name:"returnType"},{name:"wildcard",defaultValue:false}]}}case Is:{return{name:Is,properties:[{name:"referenceType"}]}}case jl:{return{name:jl,properties:[{name:"name"}]}}case Zi:{return{name:Zi,properties:[{name:"primitiveType"},{name:"stringType"},{name:"typeRef"}]}}case Ls:{return{name:Ls,properties:[{name:"value"}]}}case Ur:{return{name:Ur,properties:[{name:"definition"},{name:"fragment",defaultValue:false},{name:"hidden",defaultValue:false},{name:"name"},{name:"type"}]}}case ea:{return{name:ea,properties:[{name:"name"},{name:"type"}]}}case hc:{return{name:hc,properties:[{name:"defaultValue"},{name:"isOptional",defaultValue:false},{name:"name"},{name:"type"}]}}case xs:{return{name:xs,properties:[{name:"types",defaultValue:[]}]}}case ta:{return{name:ta,properties:[{name:"cardinality"},{name:"feature"},{name:"inferredType"},{name:"lookahead"},{name:"operator"},{name:"type"}]}}case na:{return{name:na,properties:[{name:"cardinality"},{name:"elements",defaultValue:[]},{name:"lookahead"}]}}case ra:{return{name:ra,properties:[{name:"cardinality"},{name:"feature"},{name:"lookahead"},{name:"operator"},{name:"terminal"}]}}case ia:{return{name:ia,properties:[{name:"cardinality"},{name:"left"},{name:"lookahead"},{name:"right"}]}}case aa:{return{name:aa,properties:[{name:"cardinality"},{name:"deprecatedSyntax",defaultValue:false},{name:"lookahead"},{name:"terminal"},{name:"type"}]}}case sa:{return{name:sa,properties:[{name:"cardinality"},{name:"lookahead"}]}}case oa:{return{name:oa,properties:[{name:"cardinality"},{name:"elements",defaultValue:[]},{name:"guardCondition"},{name:"lookahead"}]}}case la:{return{name:la,properties:[{name:"cardinality"},{name:"lookahead"},{name:"value"}]}}case ua:{return{name:ua,properties:[{name:"cardinality"},{name:"lookahead"},{name:"terminal"}]}}case ca:{return{name:ca,properties:[{name:"cardinality"},{name:"lookahead"},{name:"regex"}]}}case da:{return{name:da,properties:[{name:"arguments",defaultValue:[]},{name:"cardinality"},{name:"lookahead"},{name:"rule"}]}}case fa:{return{name:fa,properties:[{name:"cardinality"},{name:"elements",defaultValue:[]},{name:"lookahead"}]}}case pa:{return{name:pa,properties:[{name:"cardinality"},{name:"elements",defaultValue:[]},{name:"lookahead"}]}}case ma:{return{name:ma,properties:[{name:"cardinality"},{name:"lookahead"},{name:"rule"}]}}case ha:{return{name:ha,properties:[{name:"cardinality"},{name:"elements",defaultValue:[]},{name:"lookahead"}]}}case ya:{return{name:ya,properties:[{name:"cardinality"},{name:"lookahead"},{name:"terminal"}]}}case ga:{return{name:ga,properties:[{name:"cardinality"},{name:"lookahead"}]}}default:{return{name:e,properties:[]}}}}}const ce=new _g;function B$(t){for(const[e,n]of Object.entries(t)){if(!e.startsWith("$")){if(Array.isArray(n)){n.forEach((r,i)=>{if(rt(r)){r.$container=t;r.$containerProperty=e;r.$containerIndex=i}})}else if(rt(n)){n.$container=t;n.$containerProperty=e}}}}function In(t,e){let n=t;while(n){if(e(n)){return n}n=n.$container}return void 0}function yt(t){const e=cu(t);const n=e.$document;if(!n){throw new Error("AST node has no document.")}return n}function cu(t){while(t.$container){t=t.$container}return t}function Hu(t,e){if(!t){throw new Error("Node must be an AstNode.")}const n=e===null||e===void 0?void 0:e.range;return new tt(()=>({keys:Object.keys(t),keyIndex:0,arrayIndex:0}),r=>{while(r.keyIndex<r.keys.length){const i=r.keys[r.keyIndex];if(!i.startsWith("$")){const a=t[i];if(rt(a)){r.keyIndex++;if(Kd(a,n)){return{done:false,value:a}}}else if(Array.isArray(a)){while(r.arrayIndex<a.length){const s=r.arrayIndex++;const o=a[s];if(rt(o)&&Kd(o,n)){return{done:false,value:o}}}r.arrayIndex=0}}r.keyIndex++}return Dt})}function Nr(t,e){if(!t){throw new Error("Root node must be an AstNode.")}return new ou(t,n=>Hu(n,e))}function Xn(t,e){if(!t){throw new Error("Root node must be an AstNode.")}else if((e===null||e===void 0?void 0:e.range)&&!Kd(t,e.range)){return new ou(t,()=>[])}return new ou(t,n=>Hu(n,e),{includeRoot:true})}function Kd(t,e){var n;if(!e){return true}const r=(n=t.$cstNode)===null||n===void 0?void 0:n.range;if(!r){return false}return Eg(r,e)}function Dg(t){return new tt(()=>({keys:Object.keys(t),keyIndex:0,arrayIndex:0}),e=>{while(e.keyIndex<e.keys.length){const n=e.keys[e.keyIndex];if(!n.startsWith("$")){const r=t[n];if(on(r)){e.keyIndex++;return{done:false,value:{reference:r,container:t,property:n}}}else if(Array.isArray(r)){while(e.arrayIndex<r.length){const i=e.arrayIndex++;const a=r[i];if(on(a)){return{done:false,value:{reference:a,container:t,property:n,index:i}}}}e.arrayIndex=0}}e.keyIndex++}return Dt})}function Og(t,e){const n=t.getTypeMetaData(e.$type);const r=e;for(const i of n.properties){if(i.defaultValue!==void 0&&r[i.name]===void 0){r[i.name]=Ig(i.defaultValue)}}}function Ig(t){if(Array.isArray(t)){return[...t.map(Ig)]}else{return t}}function Z(t){return t.charCodeAt(0)}function yc(t,e){if(Array.isArray(t)){t.forEach(function(n){e.push(n)})}else{e.push(t)}}function li(t,e){if(t[e]===true){throw"duplicate flag "+e}t[e];t[e]=true}function Mr(t){if(t===void 0){throw Error("Internal Error - Should never get here!")}return true}function W$(){throw Error("Internal Error - Should never get here!")}function am(t){return t["type"]==="Character"}const du=[];for(let t=Z("0");t<=Z("9");t++){du.push(t)}const fu=[Z("_")].concat(du);for(let t=Z("a");t<=Z("z");t++){fu.push(t)}for(let t=Z("A");t<=Z("Z");t++){fu.push(t)}const sm=[Z(" "),Z("\f"),Z("\n"),Z("\r"),Z("	"),Z("\v"),Z("	"),Z(" "),Z(" "),Z(" "),Z(" "),Z(" "),Z(" "),Z(" "),Z(" "),Z(" "),Z(" "),Z(" "),Z(" "),Z(" "),Z("\u2028"),Z("\u2029"),Z(" "),Z(" "),Z("　"),Z("\uFEFF")];const V$=/[0-9a-fA-F]/;const Ms=/[0-9]/;const z$=/[1-9]/;class Lg{constructor(){this.idx=0;this.input="";this.groupIdx=0}saveState(){return{idx:this.idx,input:this.input,groupIdx:this.groupIdx}}restoreState(e){this.idx=e.idx;this.input=e.input;this.groupIdx=e.groupIdx}pattern(e){this.idx=0;this.input=e;this.groupIdx=0;this.consumeChar("/");const n=this.disjunction();this.consumeChar("/");const r={type:"Flags",loc:{begin:this.idx,end:e.length},global:false,ignoreCase:false,multiLine:false,unicode:false,sticky:false};while(this.isRegExpFlag()){switch(this.popChar()){case"g":li(r,"global");break;case"i":li(r,"ignoreCase");break;case"m":li(r,"multiLine");break;case"u":li(r,"unicode");break;case"y":li(r,"sticky");break}}if(this.idx!==this.input.length){throw Error("Redundant input: "+this.input.substring(this.idx))}return{type:"Pattern",flags:r,value:n,loc:this.loc(0)}}disjunction(){const e=[];const n=this.idx;e.push(this.alternative());while(this.peekChar()==="|"){this.consumeChar("|");e.push(this.alternative())}return{type:"Disjunction",value:e,loc:this.loc(n)}}alternative(){const e=[];const n=this.idx;while(this.isTerm()){e.push(this.term())}return{type:"Alternative",value:e,loc:this.loc(n)}}term(){if(this.isAssertion()){return this.assertion()}else{return this.atom()}}assertion(){const e=this.idx;switch(this.popChar()){case"^":return{type:"StartAnchor",loc:this.loc(e)};case"$":return{type:"EndAnchor",loc:this.loc(e)};case"\\":switch(this.popChar()){case"b":return{type:"WordBoundary",loc:this.loc(e)};case"B":return{type:"NonWordBoundary",loc:this.loc(e)}}throw Error("Invalid Assertion Escape");case"(":this.consumeChar("?");let n;switch(this.popChar()){case"=":n="Lookahead";break;case"!":n="NegativeLookahead";break}Mr(n);const r=this.disjunction();this.consumeChar(")");return{type:n,value:r,loc:this.loc(e)}}return W$()}quantifier(e=false){let n=void 0;const r=this.idx;switch(this.popChar()){case"*":n={atLeast:0,atMost:Infinity};break;case"+":n={atLeast:1,atMost:Infinity};break;case"?":n={atLeast:0,atMost:1};break;case"{":const i=this.integerIncludingZero();switch(this.popChar()){case"}":n={atLeast:i,atMost:i};break;case",":let a;if(this.isDigit()){a=this.integerIncludingZero();n={atLeast:i,atMost:a}}else{n={atLeast:i,atMost:Infinity}}this.consumeChar("}");break}if(e===true&&n===void 0){return void 0}Mr(n);break}if(e===true&&n===void 0){return void 0}if(Mr(n)){if(this.peekChar(0)==="?"){this.consumeChar("?");n.greedy=false}else{n.greedy=true}n.type="Quantifier";n.loc=this.loc(r);return n}}atom(){let e;const n=this.idx;switch(this.peekChar()){case".":e=this.dotAll();break;case"\\":e=this.atomEscape();break;case"[":e=this.characterClass();break;case"(":e=this.group();break}if(e===void 0&&this.isPatternCharacter()){e=this.patternCharacter()}if(Mr(e)){e.loc=this.loc(n);if(this.isQuantifier()){e.quantifier=this.quantifier()}return e}}dotAll(){this.consumeChar(".");return{type:"Set",complement:true,value:[Z("\n"),Z("\r"),Z("\u2028"),Z("\u2029")]}}atomEscape(){this.consumeChar("\\");switch(this.peekChar()){case"1":case"2":case"3":case"4":case"5":case"6":case"7":case"8":case"9":return this.decimalEscapeAtom();case"d":case"D":case"s":case"S":case"w":case"W":return this.characterClassEscape();case"f":case"n":case"r":case"t":case"v":return this.controlEscapeAtom();case"c":return this.controlLetterEscapeAtom();case"0":return this.nulCharacterAtom();case"x":return this.hexEscapeSequenceAtom();case"u":return this.regExpUnicodeEscapeSequenceAtom();default:return this.identityEscapeAtom()}}decimalEscapeAtom(){const e=this.positiveInteger();return{type:"GroupBackReference",value:e}}characterClassEscape(){let e;let n=false;switch(this.popChar()){case"d":e=du;break;case"D":e=du;n=true;break;case"s":e=sm;break;case"S":e=sm;n=true;break;case"w":e=fu;break;case"W":e=fu;n=true;break}if(Mr(e)){return{type:"Set",value:e,complement:n}}}controlEscapeAtom(){let e;switch(this.popChar()){case"f":e=Z("\f");break;case"n":e=Z("\n");break;case"r":e=Z("\r");break;case"t":e=Z("	");break;case"v":e=Z("\v");break}if(Mr(e)){return{type:"Character",value:e}}}controlLetterEscapeAtom(){this.consumeChar("c");const e=this.popChar();if(/[a-zA-Z]/.test(e)===false){throw Error("Invalid ")}const n=e.toUpperCase().charCodeAt(0)-64;return{type:"Character",value:n}}nulCharacterAtom(){this.consumeChar("0");return{type:"Character",value:Z("\0")}}hexEscapeSequenceAtom(){this.consumeChar("x");return this.parseHexDigits(2)}regExpUnicodeEscapeSequenceAtom(){this.consumeChar("u");return this.parseHexDigits(4)}identityEscapeAtom(){const e=this.popChar();return{type:"Character",value:Z(e)}}classPatternCharacterAtom(){switch(this.peekChar()){case"\n":case"\r":case"\u2028":case"\u2029":case"\\":case"]":throw Error("TBD");default:const e=this.popChar();return{type:"Character",value:Z(e)}}}characterClass(){const e=[];let n=false;this.consumeChar("[");if(this.peekChar(0)==="^"){this.consumeChar("^");n=true}while(this.isClassAtom()){const r=this.classAtom();r.type==="Character";if(am(r)&&this.isRangeDash()){this.consumeChar("-");const i=this.classAtom();i.type==="Character";if(am(i)){if(i.value<r.value){throw Error("Range out of order in character class")}e.push({from:r.value,to:i.value})}else{yc(r.value,e);e.push(Z("-"));yc(i.value,e)}}else{yc(r.value,e)}}this.consumeChar("]");return{type:"Set",complement:n,value:e}}classAtom(){switch(this.peekChar()){case"]":case"\n":case"\r":case"\u2028":case"\u2029":throw Error("TBD");case"\\":return this.classEscape();default:return this.classPatternCharacterAtom()}}classEscape(){this.consumeChar("\\");switch(this.peekChar()){case"b":this.consumeChar("b");return{type:"Character",value:Z("\b")};case"d":case"D":case"s":case"S":case"w":case"W":return this.characterClassEscape();case"f":case"n":case"r":case"t":case"v":return this.controlEscapeAtom();case"c":return this.controlLetterEscapeAtom();case"0":return this.nulCharacterAtom();case"x":return this.hexEscapeSequenceAtom();case"u":return this.regExpUnicodeEscapeSequenceAtom();default:return this.identityEscapeAtom()}}group(){let e=true;this.consumeChar("(");switch(this.peekChar(0)){case"?":this.consumeChar("?");this.consumeChar(":");e=false;break;default:this.groupIdx++;break}const n=this.disjunction();this.consumeChar(")");const r={type:"Group",capturing:e,value:n};if(e){r["idx"]=this.groupIdx}return r}positiveInteger(){let e=this.popChar();if(z$.test(e)===false){throw Error("Expecting a positive integer")}while(Ms.test(this.peekChar(0))){e+=this.popChar()}return parseInt(e,10)}integerIncludingZero(){let e=this.popChar();if(Ms.test(e)===false){throw Error("Expecting an integer")}while(Ms.test(this.peekChar(0))){e+=this.popChar()}return parseInt(e,10)}patternCharacter(){const e=this.popChar();switch(e){case"\n":case"\r":case"\u2028":case"\u2029":case"^":case"$":case"\\":case".":case"*":case"+":case"?":case"(":case")":case"[":case"|":throw Error("TBD");default:return{type:"Character",value:Z(e)}}}isRegExpFlag(){switch(this.peekChar(0)){case"g":case"i":case"m":case"u":case"y":return true;default:return false}}isRangeDash(){return this.peekChar()==="-"&&this.isClassAtom(1)}isDigit(){return Ms.test(this.peekChar(0))}isClassAtom(e=0){switch(this.peekChar(e)){case"]":case"\n":case"\r":case"\u2028":case"\u2029":return false;default:return true}}isTerm(){return this.isAtom()||this.isAssertion()}isAtom(){if(this.isPatternCharacter()){return true}switch(this.peekChar(0)){case".":case"\\":case"[":case"(":return true;default:return false}}isAssertion(){switch(this.peekChar(0)){case"^":case"$":return true;case"\\":switch(this.peekChar(1)){case"b":case"B":return true;default:return false}case"(":return this.peekChar(1)==="?"&&(this.peekChar(2)==="="||this.peekChar(2)==="!");default:return false}}isQuantifier(){const e=this.saveState();try{return this.quantifier(true)!==void 0}catch(n){return false}finally{this.restoreState(e)}}isPatternCharacter(){switch(this.peekChar()){case"^":case"$":case"\\":case".":case"*":case"+":case"?":case"(":case")":case"[":case"|":case"/":case"\n":case"\r":case"\u2028":case"\u2029":return false;default:return true}}parseHexDigits(e){let n="";for(let i=0;i<e;i++){const a=this.popChar();if(V$.test(a)===false){throw Error("Expecting a HexDecimal digits")}n+=a}const r=parseInt(n,16);return{type:"Character",value:r}}peekChar(e=0){return this.input[this.idx+e]}popChar(){const e=this.peekChar(0);this.consumeChar(void 0);return e}consumeChar(e){if(e!==void 0&&this.input[this.idx]!==e){throw Error("Expected: '"+e+"' but found: '"+this.input[this.idx]+"' at offset: "+this.idx)}if(this.idx>=this.input.length){throw Error("Unexpected end of input")}this.idx++}loc(e){return{begin:e,end:this.idx}}}class qu{visitChildren(e){for(const n in e){const r=e[n];if(e.hasOwnProperty(n)){if(r.type!==void 0){this.visit(r)}else if(Array.isArray(r)){r.forEach(i=>{this.visit(i)},this)}}}}visit(e){switch(e.type){case"Pattern":this.visitPattern(e);break;case"Flags":this.visitFlags(e);break;case"Disjunction":this.visitDisjunction(e);break;case"Alternative":this.visitAlternative(e);break;case"StartAnchor":this.visitStartAnchor(e);break;case"EndAnchor":this.visitEndAnchor(e);break;case"WordBoundary":this.visitWordBoundary(e);break;case"NonWordBoundary":this.visitNonWordBoundary(e);break;case"Lookahead":this.visitLookahead(e);break;case"NegativeLookahead":this.visitNegativeLookahead(e);break;case"Character":this.visitCharacter(e);break;case"Set":this.visitSet(e);break;case"Group":this.visitGroup(e);break;case"GroupBackReference":this.visitGroupBackReference(e);break;case"Quantifier":this.visitQuantifier(e);break}this.visitChildren(e)}visitPattern(e){}visitFlags(e){}visitDisjunction(e){}visitAlternative(e){}visitStartAnchor(e){}visitEndAnchor(e){}visitWordBoundary(e){}visitNonWordBoundary(e){}visitLookahead(e){}visitNegativeLookahead(e){}visitCharacter(e){}visitSet(e){}visitGroup(e){}visitGroupBackReference(e){}visitQuantifier(e){}}const Y$=/\r?\n/gm;const X$=new Lg;class J$ extends qu{constructor(){super(...arguments);this.isStarting=true;this.endRegexpStack=[];this.multiline=false}get endRegex(){return this.endRegexpStack.join("")}reset(e){this.multiline=false;this.regex=e;this.startRegexp="";this.isStarting=true;this.endRegexpStack=[]}visitGroup(e){if(e.quantifier){this.isStarting=false;this.endRegexpStack=[]}}visitCharacter(e){const n=String.fromCharCode(e.value);if(!this.multiline&&n==="\n"){this.multiline=true}if(e.quantifier){this.isStarting=false;this.endRegexpStack=[]}else{const r=ju(n);this.endRegexpStack.push(r);if(this.isStarting){this.startRegexp+=r}}}visitSet(e){if(!this.multiline){const n=this.regex.substring(e.loc.begin,e.loc.end);const r=new RegExp(n);this.multiline=Boolean("\n".match(r))}if(e.quantifier){this.isStarting=false;this.endRegexpStack=[]}else{const n=this.regex.substring(e.loc.begin,e.loc.end);this.endRegexpStack.push(n);if(this.isStarting){this.startRegexp+=n}}}visitChildren(e){if(e.type==="Group"){const n=e;if(n.quantifier){return}}super.visitChildren(e)}}const gc=new J$;function Q$(t){try{if(typeof t==="string"){t=new RegExp(t)}t=t.toString();gc.reset(t);gc.visit(X$.pattern(t));return gc.multiline}catch(e){return false}}const Z$="\f\n\r	\v              \u2028\u2029  　\uFEFF".split("");function pu(t){const e=typeof t==="string"?new RegExp(t):t;return Z$.some(n=>e.test(n))}function ju(t){return t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function eT(t){return Array.prototype.map.call(t,e=>/\w/.test(e)?`[${e.toLowerCase()}${e.toUpperCase()}]`:ju(e)).join("")}function tT(t,e){const n=nT(t);const r=e.match(n);return!!r&&r[0].length>0}function nT(t){if(typeof t==="string"){t=new RegExp(t)}const e=t,n=t.source;let r=0;function i(){let a="",s;function o(u){a+=n.substr(r,u);r+=u}function l(u){a+="(?:"+n.substr(r,u)+"|$)";r+=u}while(r<n.length){switch(n[r]){case"\\":switch(n[r+1]){case"c":l(3);break;case"x":l(4);break;case"u":if(e.unicode){if(n[r+2]==="{"){l(n.indexOf("}",r)-r+1)}else{l(6)}}else{l(2)}break;case"p":case"P":if(e.unicode){l(n.indexOf("}",r)-r+1)}else{l(2)}break;case"k":l(n.indexOf(">",r)-r+1);break;default:l(2);break}break;case"[":s=/\[(?:\\.|.)*?\]/g;s.lastIndex=r;s=s.exec(n)||[];l(s[0].length);break;case"|":case"^":case"$":case"*":case"+":case"?":o(1);break;case"{":s=/\{\d+,?\d*\}/g;s.lastIndex=r;s=s.exec(n);if(s){o(s[0].length)}else{l(1)}break;case"(":if(n[r+1]==="?"){switch(n[r+2]){case":":a+="(?:";r+=3;a+=i()+"|$)";break;case"=":a+="(?=";r+=3;a+=i()+")";break;case"!":s=r;r+=3;i();a+=n.substr(s,r-s);break;case"<":switch(n[r+3]){case"=":case"!":s=r;r+=4;i();a+=n.substr(s,r-s);break;default:o(n.indexOf(">",r)-r+1);a+=i()+"|$)";break}break}}else{o(1);a+=i()+"|$)"}break;case")":++r;return a;default:l(1);break}}return a}return new RegExp(i(),t.flags)}function Fd(t){return t.rules.find(e=>ct(e)&&e.entry)}function rT(t){return t.rules.filter(e=>tr(e)&&e.hidden)}function pp(t,e){const n=new Set;const r=Fd(t);if(!r){return new Set(t.rules)}const i=[r].concat(rT(t));for(const s of i){xg(s,n,e)}const a=new Set;for(const s of t.rules){if(n.has(s.name)||tr(s)&&s.hidden){a.add(s)}}return a}function xg(t,e,n){e.add(t.name);Nr(t).forEach(r=>{if(Mn(r)||n){const i=r.rule.ref;if(i&&!e.has(i.name)){xg(i,e,n)}}})}function Mg(t){if(t.terminal){return t.terminal}else if(t.type.ref){const e=Gg(t.type.ref);return e===null||e===void 0?void 0:e.terminal}return void 0}function iT(t){return t.hidden&&!pu(Wu(t))}function Kg(t,e){if(!t||!e){return[]}return hp(t,e,t.astNode,true)}function mp(t,e,n){if(!t||!e){return void 0}const r=hp(t,e,t.astNode,true);if(r.length===0){return void 0}if(n!==void 0){n=Math.max(0,Math.min(n,r.length-1))}else{n=0}return r[n]}function hp(t,e,n,r){if(!r){const i=In(t.grammarSource,cn);if(i&&i.feature===e){return[t]}}if(Tr(t)&&t.astNode===n){return t.content.flatMap(i=>hp(i,e,n,false))}return[]}function aT(t,e){if(!t){return[]}return Ug(t,e,t===null||t===void 0?void 0:t.astNode)}function Fg(t,e,n){if(!t){return void 0}const r=Ug(t,e,t===null||t===void 0?void 0:t.astNode);if(r.length===0){return void 0}if(n!==void 0){n=Math.max(0,Math.min(n,r.length-1))}else{n=0}return r[n]}function Ug(t,e,n){if(t.astNode!==n){return[]}if(dn(t.grammarSource)&&t.grammarSource.value===e){return[t]}const r=lu(t).iterator();let i;const a=[];do{i=r.next();if(!i.done){const s=i.value;if(s.astNode===n){if(dn(s.grammarSource)&&s.grammarSource.value===e){a.push(s)}}else{r.prune()}}}while(!i.done);return a}function sT(t){var e;const n=t.astNode;while(n===((e=t.container)===null||e===void 0?void 0:e.astNode)){const r=In(t.grammarSource,cn);if(r){return r}t=t.container}return void 0}function Gg(t){let e=t;if(bg(e)){if(Za(e.$container)){e=e.$container.$container}else if(ct(e.$container)){e=e.$container}else{Qa(e.$container)}}return Hg(t,e,new Map)}function Hg(t,e,n){var r;function i(a,s){let o=void 0;const l=In(a,cn);if(!l){o=Hg(s,s,n)}n.set(t,o);return o}if(n.has(t)){return n.get(t)}n.set(t,void 0);for(const a of Nr(e)){if(cn(a)&&a.feature.toLowerCase()==="name"){n.set(t,a);return a}else if(Mn(a)&&ct(a.rule.ref)){return i(a,a.rule.ref)}else if(L$(a)&&((r=a.typeRef)===null||r===void 0?void 0:r.ref)){return i(a,a.typeRef.ref)}}return void 0}function Ma(t,e){return t==="?"||t==="*"||wr(e)&&Boolean(e.guardCondition)}function oT(t){return t==="*"||t==="+"}function qg(t){return jg(t,new Set)}function jg(t,e){if(e.has(t)){return true}else{e.add(t)}for(const n of Nr(t)){if(Mn(n)){if(!n.rule.ref){return false}if(ct(n.rule.ref)&&!jg(n.rule.ref,e)){return false}}else if(cn(n)){return false}else if(Za(n)){return false}}return Boolean(t.definition)}function ts(t){if(t.inferredType){return t.inferredType.name}else if(t.dataType){return t.dataType}else if(t.returnType){const e=t.returnType.ref;if(e){if(ct(e)){return e.name}else if(Ng(e)||Pg(e)){return e.name}}}return void 0}function Bu(t){var e;if(ct(t)){return qg(t)?t.name:(e=ts(t))!==null&&e!==void 0?e:t.name}else if(Ng(t)||Pg(t)||I$(t)){return t.name}else if(Za(t)){const n=lT(t);if(n){return n}}else if(bg(t)){return t.name}throw new Error("Cannot get name of Unknown Type")}function lT(t){var e;if(t.inferredType){return t.inferredType.name}else if((e=t.type)===null||e===void 0?void 0:e.ref){return Bu(t.type.ref)}return void 0}function uT(t){var e,n,r;if(tr(t)){return(n=(e=t.type)===null||e===void 0?void 0:e.name)!==null&&n!==void 0?n:"string"}else{return(r=ts(t))!==null&&r!==void 0?r:t.name}}function Wu(t){const e={s:false,i:false,u:false};const n=ti(t.definition,e);const r=Object.entries(e).filter(([,i])=>i).map(([i])=>i).join("");return new RegExp(n,r)}const yp=/[\s\S]/.source;function ti(t,e){if(U$(t)){return cT(t)}else if(G$(t)){return dT(t)}else if(x$(t)){return mT(t)}else if(H$(t)){const n=t.rule.ref;if(!n){throw new Error("Missing rule reference.")}return Ln(ti(n.definition),{cardinality:t.cardinality,lookahead:t.lookahead})}else if(K$(t)){return pT(t)}else if(q$(t)){return fT(t)}else if(F$(t)){const n=t.regex.lastIndexOf("/");const r=t.regex.substring(1,n);const i=t.regex.substring(n+1);if(e){e.i=i.includes("i");e.s=i.includes("s");e.u=i.includes("u")}return Ln(r,{cardinality:t.cardinality,lookahead:t.lookahead,wrap:false})}else if(j$(t)){return Ln(yp,{cardinality:t.cardinality,lookahead:t.lookahead})}else{throw new Error(`Invalid terminal element: ${t===null||t===void 0?void 0:t.$type}`)}}function cT(t){return Ln(t.elements.map(e=>ti(e)).join("|"),{cardinality:t.cardinality,lookahead:t.lookahead})}function dT(t){return Ln(t.elements.map(e=>ti(e)).join(""),{cardinality:t.cardinality,lookahead:t.lookahead})}function fT(t){return Ln(`${yp}*?${ti(t.terminal)}`,{cardinality:t.cardinality,lookahead:t.lookahead})}function pT(t){return Ln(`(?!${ti(t.terminal)})${yp}*?`,{cardinality:t.cardinality,lookahead:t.lookahead})}function mT(t){if(t.right){return Ln(`[${Rc(t.left)}-${Rc(t.right)}]`,{cardinality:t.cardinality,lookahead:t.lookahead,wrap:false})}return Ln(Rc(t.left),{cardinality:t.cardinality,lookahead:t.lookahead,wrap:false})}function Rc(t){return ju(t.value)}function Ln(t,e){var n;if(e.wrap!==false||e.lookahead){t=`(${(n=e.lookahead)!==null&&n!==void 0?n:""}${t})`}if(e.cardinality){return`${t}${e.cardinality}`}return t}function hT(t){const e=[];const n=t.Grammar;for(const r of n.rules){if(tr(r)&&iT(r)&&Q$(Wu(r))){e.push(r.name)}}return{multilineCommentRules:e,nameRegexp:wg}}var Bg=typeof global=="object"&&global&&global.Object===Object&&global;var yT=typeof self=="object"&&self&&self.Object===Object&&self;var fn=Bg||yT||Function("return this")();var Bt=fn.Symbol;var Wg=Object.prototype;var gT=Wg.hasOwnProperty;var RT=Wg.toString;var ui=Bt?Bt.toStringTag:void 0;function vT(t){var e=gT.call(t,ui),n=t[ui];try{t[ui]=void 0;var r=true}catch(a){}var i=RT.call(t);if(r){if(e){t[ui]=n}else{delete t[ui]}}return i}var $T=Object.prototype;var TT=$T.toString;function ET(t){return TT.call(t)}var wT="[object Null]";var CT="[object Undefined]";var om=Bt?Bt.toStringTag:void 0;function nr(t){if(t==null){return t===void 0?CT:wT}return om&&om in Object(t)?vT(t):ET(t)}function Qt(t){return t!=null&&typeof t=="object"}var AT="[object Symbol]";function ns(t){return typeof t=="symbol"||Qt(t)&&nr(t)==AT}function Vu(t,e){var n=-1,r=t==null?0:t.length,i=Array(r);while(++n<r){i[n]=e(t[n],n,t)}return i}var le=Array.isArray;var lm=Bt?Bt.prototype:void 0;var um=lm?lm.toString:void 0;function Vg(t){if(typeof t=="string"){return t}if(le(t)){return Vu(t,Vg)+""}if(ns(t)){return um?um.call(t):""}var e=t+"";return e=="0"&&1/t==-Infinity?"-0":e}var ST=/\s/;function kT(t){var e=t.length;while(e--&&ST.test(t.charAt(e))){}return e}var bT=/^\s+/;function NT(t){return t?t.slice(0,kT(t)+1).replace(bT,""):t}function Wt(t){var e=typeof t;return t!=null&&(e=="object"||e=="function")}var cm=0/0;var PT=/^[-+]0x[0-9a-f]+$/i;var _T=/^0b[01]+$/i;var DT=/^0o[0-7]+$/i;var OT=parseInt;function IT(t){if(typeof t=="number"){return t}if(ns(t)){return cm}if(Wt(t)){var e=typeof t.valueOf=="function"?t.valueOf():t;t=Wt(e)?e+"":e}if(typeof t!="string"){return t===0?t:+t}t=NT(t);var n=_T.test(t);return n||DT.test(t)?OT(t.slice(2),n?2:8):PT.test(t)?cm:+t}var LT=1/0;var xT=17976931348623157e292;function MT(t){if(!t){return t===0?t:0}t=IT(t);if(t===LT||t===-Infinity){var e=t<0?-1:1;return e*xT}return t===t?t:0}function zu(t){var e=MT(t),n=e%1;return e===e?n?e-n:e:0}function Cr(t){return t}var KT="[object AsyncFunction]";var FT="[object Function]";var UT="[object GeneratorFunction]";var GT="[object Proxy]";function Hn(t){if(!Wt(t)){return false}var e=nr(t);return e==FT||e==UT||e==KT||e==GT}var vc=fn["__core-js_shared__"];var dm=function(){var t=/[^.]+$/.exec(vc&&vc.keys&&vc.keys.IE_PROTO||"");return t?"Symbol(src)_1."+t:""}();function HT(t){return!!dm&&dm in t}var qT=Function.prototype;var jT=qT.toString;function Pr(t){if(t!=null){try{return jT.call(t)}catch(e){}try{return t+""}catch(e){}}return""}var BT=/[\\^$.*+?()[\]{}|]/g;var WT=/^\[object .+?Constructor\]$/;var VT=Function.prototype;var zT=Object.prototype;var YT=VT.toString;var XT=zT.hasOwnProperty;var JT=RegExp("^"+YT.call(XT).replace(BT,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");function QT(t){if(!Wt(t)||HT(t)){return false}var e=Hn(t)?JT:WT;return e.test(Pr(t))}function ZT(t,e){return t==null?void 0:t[e]}function _r(t,e){var n=ZT(t,e);return QT(n)?n:void 0}var Ud=_r(fn,"WeakMap");var fm=Object.create;var eE=function(){function t(){}return function(e){if(!Wt(e)){return{}}if(fm){return fm(e)}t.prototype=e;var n=new t;t.prototype=void 0;return n}}();function tE(t,e,n){switch(n.length){case 0:return t.call(e);case 1:return t.call(e,n[0]);case 2:return t.call(e,n[0],n[1]);case 3:return t.call(e,n[0],n[1],n[2])}return t.apply(e,n)}function Ve(){}function nE(t,e){var n=-1,r=t.length;e||(e=Array(r));while(++n<r){e[n]=t[n]}return e}var rE=800;var iE=16;var aE=Date.now;function sE(t){var e=0,n=0;return function(){var r=aE(),i=iE-(r-n);n=r;if(i>0){if(++e>=rE){return arguments[0]}}else{e=0}return t.apply(void 0,arguments)}}function oE(t){return function(){return t}}var mu=function(){try{var t=_r(Object,"defineProperty");t({},"",{});return t}catch(e){}}();var lE=!mu?Cr:function(t,e){return mu(t,"toString",{"configurable":true,"enumerable":false,"value":oE(e),"writable":true})};var uE=sE(lE);function zg(t,e){var n=-1,r=t==null?0:t.length;while(++n<r){if(e(t[n],n,t)===false){break}}return t}function Yg(t,e,n,r){var i=t.length,a=n+-1;while(++a<i){if(e(t[a],a,t)){return a}}return-1}function cE(t){return t!==t}function dE(t,e,n){var r=n-1,i=t.length;while(++r<i){if(t[r]===e){return r}}return-1}function gp(t,e,n){return e===e?dE(t,e,n):Yg(t,cE,n)}function Xg(t,e){var n=t==null?0:t.length;return!!n&&gp(t,e,0)>-1}var fE=9007199254740991;var pE=/^(?:0|[1-9]\d*)$/;function Yu(t,e){var n=typeof t;e=e==null?fE:e;return!!e&&(n=="number"||n!="symbol"&&pE.test(t))&&(t>-1&&t%1==0&&t<e)}function Rp(t,e,n){if(e=="__proto__"&&mu){mu(t,e,{"configurable":true,"enumerable":true,"value":n,"writable":true})}else{t[e]=n}}function rs(t,e){return t===e||t!==t&&e!==e}var mE=Object.prototype;var hE=mE.hasOwnProperty;function Xu(t,e,n){var r=t[e];if(!(hE.call(t,e)&&rs(r,n))||n===void 0&&!(e in t)){Rp(t,e,n)}}function vp(t,e,n,r){var i=!n;n||(n={});var a=-1,s=e.length;while(++a<s){var o=e[a];var l=void 0;if(l===void 0){l=t[o]}if(i){Rp(n,o,l)}else{Xu(n,o,l)}}return n}var pm=Math.max;function yE(t,e,n){e=pm(e===void 0?t.length-1:e,0);return function(){var r=arguments,i=-1,a=pm(r.length-e,0),s=Array(a);while(++i<a){s[i]=r[e+i]}i=-1;var o=Array(e+1);while(++i<e){o[i]=r[i]}o[e]=n(s);return tE(t,this,o)}}function $p(t,e){return uE(yE(t,e,Cr),t+"")}var gE=9007199254740991;function Tp(t){return typeof t=="number"&&t>-1&&t%1==0&&t<=gE}function pn(t){return t!=null&&Tp(t.length)&&!Hn(t)}function Jg(t,e,n){if(!Wt(n)){return false}var r=typeof e;if(r=="number"?pn(n)&&Yu(e,n.length):r=="string"&&e in n){return rs(n[e],t)}return false}function RE(t){return $p(function(e,n){var r=-1,i=n.length,a=i>1?n[i-1]:void 0,s=i>2?n[2]:void 0;a=t.length>3&&typeof a=="function"?(i--,a):void 0;if(s&&Jg(n[0],n[1],s)){a=i<3?void 0:a;i=1}e=Object(e);while(++r<i){var o=n[r];if(o){t(e,o,r,a)}}return e})}var vE=Object.prototype;function is(t){var e=t&&t.constructor,n=typeof e=="function"&&e.prototype||vE;return t===n}function $E(t,e){var n=-1,r=Array(t);while(++n<t){r[n]=e(n)}return r}var TE="[object Arguments]";function mm(t){return Qt(t)&&nr(t)==TE}var Qg=Object.prototype;var EE=Qg.hasOwnProperty;var wE=Qg.propertyIsEnumerable;var Ju=mm(function(){return arguments}())?mm:function(t){return Qt(t)&&EE.call(t,"callee")&&!wE.call(t,"callee")};function CE(){return false}var Zg=typeof Ot=="object"&&Ot&&!Ot.nodeType&&Ot;var hm=Zg&&typeof It=="object"&&It&&!It.nodeType&&It;var AE=hm&&hm.exports===Zg;var ym=AE?fn.Buffer:void 0;var SE=ym?ym.isBuffer:void 0;var Ka=SE||CE;var kE="[object Arguments]";var bE="[object Array]";var NE="[object Boolean]";var PE="[object Date]";var _E="[object Error]";var DE="[object Function]";var OE="[object Map]";var IE="[object Number]";var LE="[object Object]";var xE="[object RegExp]";var ME="[object Set]";var KE="[object String]";var FE="[object WeakMap]";var UE="[object ArrayBuffer]";var GE="[object DataView]";var HE="[object Float32Array]";var qE="[object Float64Array]";var jE="[object Int8Array]";var BE="[object Int16Array]";var WE="[object Int32Array]";var VE="[object Uint8Array]";var zE="[object Uint8ClampedArray]";var YE="[object Uint16Array]";var XE="[object Uint32Array]";var Te={};Te[HE]=Te[qE]=Te[jE]=Te[BE]=Te[WE]=Te[VE]=Te[zE]=Te[YE]=Te[XE]=true;Te[kE]=Te[bE]=Te[UE]=Te[NE]=Te[GE]=Te[PE]=Te[_E]=Te[DE]=Te[OE]=Te[IE]=Te[LE]=Te[xE]=Te[ME]=Te[KE]=Te[FE]=false;function JE(t){return Qt(t)&&Tp(t.length)&&!!Te[nr(t)]}function Qu(t){return function(e){return t(e)}}var eR=typeof Ot=="object"&&Ot&&!Ot.nodeType&&Ot;var La=eR&&typeof It=="object"&&It&&!It.nodeType&&It;var QE=La&&La.exports===eR;var $c=QE&&Bg.process;var Jn=function(){try{var t=La&&La.require&&La.require("util").types;if(t){return t}return $c&&$c.binding&&$c.binding("util")}catch(e){}}();var gm=Jn&&Jn.isTypedArray;var Ep=gm?Qu(gm):JE;var ZE=Object.prototype;var ew=ZE.hasOwnProperty;function tR(t,e){var n=le(t),r=!n&&Ju(t),i=!n&&!r&&Ka(t),a=!n&&!r&&!i&&Ep(t),s=n||r||i||a,o=s?$E(t.length,String):[],l=o.length;for(var u in t){if((e||ew.call(t,u))&&!(s&&(u=="length"||i&&(u=="offset"||u=="parent")||a&&(u=="buffer"||u=="byteLength"||u=="byteOffset")||Yu(u,l)))){o.push(u)}}return o}function nR(t,e){return function(n){return t(e(n))}}var tw=nR(Object.keys,Object);var nw=Object.prototype;var rw=nw.hasOwnProperty;function rR(t){if(!is(t)){return tw(t)}var e=[];for(var n in Object(t)){if(rw.call(t,n)&&n!="constructor"){e.push(n)}}return e}function Vt(t){return pn(t)?tR(t):rR(t)}var iw=Object.prototype;var aw=iw.hasOwnProperty;var xt=RE(function(t,e){if(is(e)||pn(e)){vp(e,Vt(e),t);return}for(var n in e){if(aw.call(e,n)){Xu(t,n,e[n])}}});function sw(t){var e=[];if(t!=null){for(var n in Object(t)){e.push(n)}}return e}var ow=Object.prototype;var lw=ow.hasOwnProperty;function uw(t){if(!Wt(t)){return sw(t)}var e=is(t),n=[];for(var r in t){if(!(r=="constructor"&&(e||!lw.call(t,r)))){n.push(r)}}return n}function iR(t){return pn(t)?tR(t,true):uw(t)}var cw=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;var dw=/^\w*$/;function wp(t,e){if(le(t)){return false}var n=typeof t;if(n=="number"||n=="symbol"||n=="boolean"||t==null||ns(t)){return true}return dw.test(t)||!cw.test(t)||e!=null&&t in Object(e)}var Fa=_r(Object,"create");function fw(){this.__data__=Fa?Fa(null):{};this.size=0}function pw(t){var e=this.has(t)&&delete this.__data__[t];this.size-=e?1:0;return e}var mw="__lodash_hash_undefined__";var hw=Object.prototype;var yw=hw.hasOwnProperty;function gw(t){var e=this.__data__;if(Fa){var n=e[t];return n===mw?void 0:n}return yw.call(e,t)?e[t]:void 0}var Rw=Object.prototype;var vw=Rw.hasOwnProperty;function $w(t){var e=this.__data__;return Fa?e[t]!==void 0:vw.call(e,t)}var Tw="__lodash_hash_undefined__";function Ew(t,e){var n=this.__data__;this.size+=this.has(t)?0:1;n[t]=Fa&&e===void 0?Tw:e;return this}function Ar(t){var e=-1,n=t==null?0:t.length;this.clear();while(++e<n){var r=t[e];this.set(r[0],r[1])}}Ar.prototype.clear=fw;Ar.prototype["delete"]=pw;Ar.prototype.get=gw;Ar.prototype.has=$w;Ar.prototype.set=Ew;function ww(){this.__data__=[];this.size=0}function Zu(t,e){var n=t.length;while(n--){if(rs(t[n][0],e)){return n}}return-1}var Cw=Array.prototype;var Aw=Cw.splice;function Sw(t){var e=this.__data__,n=Zu(e,t);if(n<0){return false}var r=e.length-1;if(n==r){e.pop()}else{Aw.call(e,n,1)}--this.size;return true}function kw(t){var e=this.__data__,n=Zu(e,t);return n<0?void 0:e[n][1]}function bw(t){return Zu(this.__data__,t)>-1}function Nw(t,e){var n=this.__data__,r=Zu(n,t);if(r<0){++this.size;n.push([t,e])}else{n[r][1]=e}return this}function qn(t){var e=-1,n=t==null?0:t.length;this.clear();while(++e<n){var r=t[e];this.set(r[0],r[1])}}qn.prototype.clear=ww;qn.prototype["delete"]=Sw;qn.prototype.get=kw;qn.prototype.has=bw;qn.prototype.set=Nw;var Ua=_r(fn,"Map");function Pw(){this.size=0;this.__data__={"hash":new Ar,"map":new(Ua||qn),"string":new Ar}}function _w(t){var e=typeof t;return e=="string"||e=="number"||e=="symbol"||e=="boolean"?t!=="__proto__":t===null}function ec(t,e){var n=t.__data__;return _w(e)?n[typeof e=="string"?"string":"hash"]:n.map}function Dw(t){var e=ec(this,t)["delete"](t);this.size-=e?1:0;return e}function Ow(t){return ec(this,t).get(t)}function Iw(t){return ec(this,t).has(t)}function Lw(t,e){var n=ec(this,t),r=n.size;n.set(t,e);this.size+=n.size==r?0:1;return this}function jn(t){var e=-1,n=t==null?0:t.length;this.clear();while(++e<n){var r=t[e];this.set(r[0],r[1])}}jn.prototype.clear=Pw;jn.prototype["delete"]=Dw;jn.prototype.get=Ow;jn.prototype.has=Iw;jn.prototype.set=Lw;var xw="Expected a function";function Cp(t,e){if(typeof t!="function"||e!=null&&typeof e!="function"){throw new TypeError(xw)}var n=function(){var r=arguments,i=e?e.apply(this,r):r[0],a=n.cache;if(a.has(i)){return a.get(i)}var s=t.apply(this,r);n.cache=a.set(i,s)||a;return s};n.cache=new(Cp.Cache||jn);return n}Cp.Cache=jn;var Mw=500;function Kw(t){var e=Cp(t,function(r){if(n.size===Mw){n.clear()}return r});var n=e.cache;return e}var Fw=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;var Uw=/\\(\\)?/g;var Gw=Kw(function(t){var e=[];if(t.charCodeAt(0)===46){e.push("")}t.replace(Fw,function(n,r,i,a){e.push(i?a.replace(Uw,"$1"):r||n)});return e});function Hw(t){return t==null?"":Vg(t)}function tc(t,e){if(le(t)){return t}return wp(t,e)?[t]:Gw(Hw(t))}function as(t){if(typeof t=="string"||ns(t)){return t}var e=t+"";return e=="0"&&1/t==-Infinity?"-0":e}function Ap(t,e){e=tc(e,t);var n=0,r=e.length;while(t!=null&&n<r){t=t[as(e[n++])]}return n&&n==r?t:void 0}function qw(t,e,n){var r=t==null?void 0:Ap(t,e);return r===void 0?n:r}function Sp(t,e){var n=-1,r=e.length,i=t.length;while(++n<r){t[i+n]=e[n]}return t}var Rm=Bt?Bt.isConcatSpreadable:void 0;function jw(t){return le(t)||Ju(t)||!!(Rm&&t&&t[Rm])}function kp(t,e,n,r,i){var a=-1,s=t.length;n||(n=jw);i||(i=[]);while(++a<s){var o=t[a];if(n(o)){{Sp(i,o)}}else if(!r){i[i.length]=o}}return i}function jt(t){var e=t==null?0:t.length;return e?kp(t):[]}var aR=nR(Object.getPrototypeOf,Object);function sR(t,e,n){var r=-1,i=t.length;if(e<0){e=-e>i?0:i+e}n=n>i?i:n;if(n<0){n+=i}i=e>n?0:n-e>>>0;e>>>=0;var a=Array(i);while(++r<i){a[r]=t[r+e]}return a}function Bw(t,e,n,r){var i=-1,a=t==null?0:t.length;if(r&&a){n=t[++i]}while(++i<a){n=e(n,t[i],i,t)}return n}function Ww(){this.__data__=new qn;this.size=0}function Vw(t){var e=this.__data__,n=e["delete"](t);this.size=e.size;return n}function zw(t){return this.__data__.get(t)}function Yw(t){return this.__data__.has(t)}var Xw=200;function Jw(t,e){var n=this.__data__;if(n instanceof qn){var r=n.__data__;if(!Ua||r.length<Xw-1){r.push([t,e]);this.size=++n.size;return this}n=this.__data__=new jn(r)}n.set(t,e);this.size=n.size;return this}function ln(t){var e=this.__data__=new qn(t);this.size=e.size}ln.prototype.clear=Ww;ln.prototype["delete"]=Vw;ln.prototype.get=zw;ln.prototype.has=Yw;ln.prototype.set=Jw;function Qw(t,e){return t&&vp(e,Vt(e),t)}var oR=typeof Ot=="object"&&Ot&&!Ot.nodeType&&Ot;var vm=oR&&typeof It=="object"&&It&&!It.nodeType&&It;var Zw=vm&&vm.exports===oR;var $m=Zw?fn.Buffer:void 0;var Tm=$m?$m.allocUnsafe:void 0;function eC(t,e){var n=t.length,r=Tm?Tm(n):new t.constructor(n);t.copy(r);return r}function bp(t,e){var n=-1,r=t==null?0:t.length,i=0,a=[];while(++n<r){var s=t[n];if(e(s,n,t)){a[i++]=s}}return a}function lR(){return[]}var tC=Object.prototype;var nC=tC.propertyIsEnumerable;var Em=Object.getOwnPropertySymbols;var Np=!Em?lR:function(t){if(t==null){return[]}t=Object(t);return bp(Em(t),function(e){return nC.call(t,e)})};function rC(t,e){return vp(t,Np(t),e)}var iC=Object.getOwnPropertySymbols;var aC=!iC?lR:function(t){var e=[];while(t){Sp(e,Np(t));t=aR(t)}return e};function uR(t,e,n){var r=e(t);return le(t)?r:Sp(r,n(t))}function Gd(t){return uR(t,Vt,Np)}function sC(t){return uR(t,iR,aC)}var Hd=_r(fn,"DataView");var qd=_r(fn,"Promise");var qr=_r(fn,"Set");var wm="[object Map]";var oC="[object Object]";var Cm="[object Promise]";var Am="[object Set]";var Sm="[object WeakMap]";var km="[object DataView]";var lC=Pr(Hd);var uC=Pr(Ua);var cC=Pr(qd);var dC=Pr(qr);var fC=Pr(Ud);var Ht=nr;if(Hd&&Ht(new Hd(new ArrayBuffer(1)))!=km||Ua&&Ht(new Ua)!=wm||qd&&Ht(qd.resolve())!=Cm||qr&&Ht(new qr)!=Am||Ud&&Ht(new Ud)!=Sm){Ht=function(t){var e=nr(t),n=e==oC?t.constructor:void 0,r=n?Pr(n):"";if(r){switch(r){case lC:return km;case uC:return wm;case cC:return Cm;case dC:return Am;case fC:return Sm}}return e}}var pC=Object.prototype;var mC=pC.hasOwnProperty;function hC(t){var e=t.length,n=new t.constructor(e);if(e&&typeof t[0]=="string"&&mC.call(t,"index")){n.index=t.index;n.input=t.input}return n}var hu=fn.Uint8Array;function yC(t){var e=new t.constructor(t.byteLength);new hu(e).set(new hu(t));return e}function gC(t,e){var n=t.buffer;return new t.constructor(n,t.byteOffset,t.byteLength)}var RC=/\w*$/;function vC(t){var e=new t.constructor(t.source,RC.exec(t));e.lastIndex=t.lastIndex;return e}var bm=Bt?Bt.prototype:void 0;var Nm=bm?bm.valueOf:void 0;function $C(t){return Nm?Object(Nm.call(t)):{}}function TC(t,e){var n=t.buffer;return new t.constructor(n,t.byteOffset,t.length)}var EC="[object Boolean]";var wC="[object Date]";var CC="[object Map]";var AC="[object Number]";var SC="[object RegExp]";var kC="[object Set]";var bC="[object String]";var NC="[object Symbol]";var PC="[object ArrayBuffer]";var _C="[object DataView]";var DC="[object Float32Array]";var OC="[object Float64Array]";var IC="[object Int8Array]";var LC="[object Int16Array]";var xC="[object Int32Array]";var MC="[object Uint8Array]";var KC="[object Uint8ClampedArray]";var FC="[object Uint16Array]";var UC="[object Uint32Array]";function GC(t,e,n){var r=t.constructor;switch(e){case PC:return yC(t);case EC:case wC:return new r(+t);case _C:return gC(t);case DC:case OC:case IC:case LC:case xC:case MC:case KC:case FC:case UC:return TC(t);case CC:return new r;case AC:case bC:return new r(t);case SC:return vC(t);case kC:return new r;case NC:return $C(t)}}function HC(t){return typeof t.constructor=="function"&&!is(t)?eE(aR(t)):{}}var qC="[object Map]";function jC(t){return Qt(t)&&Ht(t)==qC}var Pm=Jn&&Jn.isMap;var BC=Pm?Qu(Pm):jC;var WC="[object Set]";function VC(t){return Qt(t)&&Ht(t)==WC}var _m=Jn&&Jn.isSet;var zC=_m?Qu(_m):VC;var cR="[object Arguments]";var YC="[object Array]";var XC="[object Boolean]";var JC="[object Date]";var QC="[object Error]";var dR="[object Function]";var ZC="[object GeneratorFunction]";var eA="[object Map]";var tA="[object Number]";var fR="[object Object]";var nA="[object RegExp]";var rA="[object Set]";var iA="[object String]";var aA="[object Symbol]";var sA="[object WeakMap]";var oA="[object ArrayBuffer]";var lA="[object DataView]";var uA="[object Float32Array]";var cA="[object Float64Array]";var dA="[object Int8Array]";var fA="[object Int16Array]";var pA="[object Int32Array]";var mA="[object Uint8Array]";var hA="[object Uint8ClampedArray]";var yA="[object Uint16Array]";var gA="[object Uint32Array]";var ve={};ve[cR]=ve[YC]=ve[oA]=ve[lA]=ve[XC]=ve[JC]=ve[uA]=ve[cA]=ve[dA]=ve[fA]=ve[pA]=ve[eA]=ve[tA]=ve[fR]=ve[nA]=ve[rA]=ve[iA]=ve[aA]=ve[mA]=ve[hA]=ve[yA]=ve[gA]=true;ve[QC]=ve[dR]=ve[sA]=false;function Bl(t,e,n,r,i,a){var s;if(s!==void 0){return s}if(!Wt(t)){return t}var o=le(t);if(o){s=hC(t);{return nE(t,s)}}else{var l=Ht(t),u=l==dR||l==ZC;if(Ka(t)){return eC(t)}if(l==fR||l==cR||u&&!i){s=u?{}:HC(t);{return rC(t,Qw(s,t))}}else{if(!ve[l]){return i?t:{}}s=GC(t,l)}}a||(a=new ln);var c=a.get(t);if(c){return c}a.set(t,s);if(zC(t)){t.forEach(function(p){s.add(Bl(p,e,n,p,t,a))})}else if(BC(t)){t.forEach(function(p,y){s.set(y,Bl(p,e,n,y,t,a))})}var d=Gd;var f=o?void 0:d(t);zg(f||t,function(p,y){if(f){y=p;p=t[y]}Xu(s,y,Bl(p,e,n,y,t,a))});return s}var RA=4;function at(t){return Bl(t,RA)}function ss(t){var e=-1,n=t==null?0:t.length,r=0,i=[];while(++e<n){var a=t[e];if(a){i[r++]=a}}return i}var vA="__lodash_hash_undefined__";function $A(t){this.__data__.set(t,vA);return this}function TA(t){return this.__data__.has(t)}function Wr(t){var e=-1,n=t==null?0:t.length;this.__data__=new jn;while(++e<n){this.add(t[e])}}Wr.prototype.add=Wr.prototype.push=$A;Wr.prototype.has=TA;function pR(t,e){var n=-1,r=t==null?0:t.length;while(++n<r){if(e(t[n],n,t)){return true}}return false}function Pp(t,e){return t.has(e)}var EA=1;var wA=2;function mR(t,e,n,r,i,a){var s=n&EA,o=t.length,l=e.length;if(o!=l&&!(s&&l>o)){return false}var u=a.get(t);var c=a.get(e);if(u&&c){return u==e&&c==t}var d=-1,f=true,p=n&wA?new Wr:void 0;a.set(t,e);a.set(e,t);while(++d<o){var y=t[d],v=e[d];if(r){var k=s?r(v,y,d,e,t,a):r(y,v,d,t,e,a)}if(k!==void 0){if(k){continue}f=false;break}if(p){if(!pR(e,function($,E){if(!Pp(p,E)&&(y===$||i(y,$,n,r,a))){return p.push(E)}})){f=false;break}}else if(!(y===v||i(y,v,n,r,a))){f=false;break}}a["delete"](t);a["delete"](e);return f}function CA(t){var e=-1,n=Array(t.size);t.forEach(function(r,i){n[++e]=[i,r]});return n}function _p(t){var e=-1,n=Array(t.size);t.forEach(function(r){n[++e]=r});return n}var AA=1;var SA=2;var kA="[object Boolean]";var bA="[object Date]";var NA="[object Error]";var PA="[object Map]";var _A="[object Number]";var DA="[object RegExp]";var OA="[object Set]";var IA="[object String]";var LA="[object Symbol]";var xA="[object ArrayBuffer]";var MA="[object DataView]";var Dm=Bt?Bt.prototype:void 0;var Tc=Dm?Dm.valueOf:void 0;function KA(t,e,n,r,i,a,s){switch(n){case MA:if(t.byteLength!=e.byteLength||t.byteOffset!=e.byteOffset){return false}t=t.buffer;e=e.buffer;case xA:if(t.byteLength!=e.byteLength||!a(new hu(t),new hu(e))){return false}return true;case kA:case bA:case _A:return rs(+t,+e);case NA:return t.name==e.name&&t.message==e.message;case DA:case IA:return t==e+"";case PA:var o=CA;case OA:var l=r&AA;o||(o=_p);if(t.size!=e.size&&!l){return false}var u=s.get(t);if(u){return u==e}r|=SA;s.set(t,e);var c=mR(o(t),o(e),r,i,a,s);s["delete"](t);return c;case LA:if(Tc){return Tc.call(t)==Tc.call(e)}}return false}var FA=1;var UA=Object.prototype;var GA=UA.hasOwnProperty;function HA(t,e,n,r,i,a){var s=n&FA,o=Gd(t),l=o.length,u=Gd(e),c=u.length;if(l!=c&&!s){return false}var d=l;while(d--){var f=o[d];if(!(s?f in e:GA.call(e,f))){return false}}var p=a.get(t);var y=a.get(e);if(p&&y){return p==e&&y==t}var v=true;a.set(t,e);a.set(e,t);var k=s;while(++d<l){f=o[d];var $=t[f],E=e[f];if(r){var C=s?r(E,$,f,e,t,a):r($,E,f,t,e,a)}if(!(C===void 0?$===E||i($,E,n,r,a):C)){v=false;break}k||(k=f=="constructor")}if(v&&!k){var I=t.constructor,X=e.constructor;if(I!=X&&("constructor"in t&&"constructor"in e)&&!(typeof I=="function"&&I instanceof I&&typeof X=="function"&&X instanceof X)){v=false}}a["delete"](t);a["delete"](e);return v}var qA=1;var Om="[object Arguments]";var Im="[object Array]";var Ks="[object Object]";var jA=Object.prototype;var Lm=jA.hasOwnProperty;function BA(t,e,n,r,i,a){var s=le(t),o=le(e),l=s?Im:Ht(t),u=o?Im:Ht(e);l=l==Om?Ks:l;u=u==Om?Ks:u;var c=l==Ks,d=u==Ks,f=l==u;if(f&&Ka(t)){if(!Ka(e)){return false}s=true;c=false}if(f&&!c){a||(a=new ln);return s||Ep(t)?mR(t,e,n,r,i,a):KA(t,e,l,n,r,i,a)}if(!(n&qA)){var p=c&&Lm.call(t,"__wrapped__"),y=d&&Lm.call(e,"__wrapped__");if(p||y){var v=p?t.value():t,k=y?e.value():e;a||(a=new ln);return i(v,k,n,r,a)}}if(!f){return false}a||(a=new ln);return HA(t,e,n,r,i,a)}function Dp(t,e,n,r,i){if(t===e){return true}if(t==null||e==null||!Qt(t)&&!Qt(e)){return t!==t&&e!==e}return BA(t,e,n,r,Dp,i)}var WA=1;var VA=2;function zA(t,e,n,r){var i=n.length,a=i;if(t==null){return!a}t=Object(t);while(i--){var s=n[i];if(s[2]?s[1]!==t[s[0]]:!(s[0]in t)){return false}}while(++i<a){s=n[i];var o=s[0],l=t[o],u=s[1];if(s[2]){if(l===void 0&&!(o in t)){return false}}else{var c=new ln;var d;if(!(d===void 0?Dp(u,l,WA|VA,r,c):d)){return false}}}return true}function hR(t){return t===t&&!Wt(t)}function YA(t){var e=Vt(t),n=e.length;while(n--){var r=e[n],i=t[r];e[n]=[r,i,hR(i)]}return e}function yR(t,e){return function(n){if(n==null){return false}return n[t]===e&&(e!==void 0||t in Object(n))}}function XA(t){var e=YA(t);if(e.length==1&&e[0][2]){return yR(e[0][0],e[0][1])}return function(n){return n===t||zA(n,t,e)}}function JA(t,e){return t!=null&&e in Object(t)}function gR(t,e,n){e=tc(e,t);var r=-1,i=e.length,a=false;while(++r<i){var s=as(e[r]);if(!(a=t!=null&&n(t,s))){break}t=t[s]}if(a||++r!=i){return a}i=t==null?0:t.length;return!!i&&Tp(i)&&Yu(s,i)&&(le(t)||Ju(t))}function QA(t,e){return t!=null&&gR(t,e,JA)}var ZA=1;var eS=2;function tS(t,e){if(wp(t)&&hR(e)){return yR(as(t),e)}return function(n){var r=qw(n,t);return r===void 0&&r===e?QA(n,t):Dp(e,r,ZA|eS)}}function nS(t){return function(e){return e==null?void 0:e[t]}}function rS(t){return function(e){return Ap(e,t)}}function iS(t){return wp(t)?nS(as(t)):rS(t)}function en(t){if(typeof t=="function"){return t}if(t==null){return Cr}if(typeof t=="object"){return le(t)?tS(t[0],t[1]):XA(t)}return iS(t)}function aS(t,e,n,r){var i=-1,a=t==null?0:t.length;while(++i<a){var s=t[i];e(r,s,n(s),t)}return r}function sS(t){return function(e,n,r){var i=-1,a=Object(e),s=r(e),o=s.length;while(o--){var l=s[++i];if(n(a[l],l,a)===false){break}}return e}}var oS=sS();function lS(t,e){return t&&oS(t,e,Vt)}function uS(t,e){return function(n,r){if(n==null){return n}if(!pn(n)){return t(n,r)}var i=n.length,a=-1,s=Object(n);while(++a<i){if(r(s[a],a,s)===false){break}}return n}}var Dr=uS(lS);function cS(t,e,n,r){Dr(t,function(i,a,s){e(r,i,n(i),s)});return r}function dS(t,e){return function(n,r){var i=le(n)?aS:cS,a=e?e():{};return i(n,t,en(r),a)}}var RR=Object.prototype;var fS=RR.hasOwnProperty;var Op=$p(function(t,e){t=Object(t);var n=-1;var r=e.length;var i=r>2?e[2]:void 0;if(i&&Jg(e[0],e[1],i)){r=1}while(++n<r){var a=e[n];var s=iR(a);var o=-1;var l=s.length;while(++o<l){var u=s[o];var c=t[u];if(c===void 0||rs(c,RR[u])&&!fS.call(t,u)){t[u]=a[u]}}}return t});function xm(t){return Qt(t)&&pn(t)}var pS=200;function mS(t,e,n,r){var i=-1,a=Xg,s=true,o=t.length,l=[],u=e.length;if(!o){return l}if(e.length>=pS){a=Pp;s=false;e=new Wr(e)}e:while(++i<o){var c=t[i],d=c;c=c!==0?c:0;if(s&&d===d){var f=u;while(f--){if(e[f]===d){continue e}}l.push(c)}else if(!a(e,d,r)){l.push(c)}}return l}var nc=$p(function(t,e){return xm(t)?mS(t,kp(e,1,xm,true)):[]});function Vr(t){var e=t==null?0:t.length;return e?t[e-1]:void 0}function et(t,e,n){var r=t==null?0:t.length;if(!r){return[]}e=e===void 0?1:zu(e);return sR(t,e<0?0:e,r)}function Ga(t,e,n){var r=t==null?0:t.length;if(!r){return[]}e=e===void 0?1:zu(e);e=r-e;return sR(t,0,e<0?0:e)}function hS(t){return typeof t=="function"?t:Cr}function Y(t,e){var n=le(t)?zg:Dr;return n(t,hS(e))}function yS(t,e){var n=-1,r=t==null?0:t.length;while(++n<r){if(!e(t[n],n,t)){return false}}return true}function gS(t,e){var n=true;Dr(t,function(r,i,a){n=!!e(r,i,a);return n});return n}function Xt(t,e,n){var r=le(t)?yS:gS;return r(t,en(e))}function vR(t,e){var n=[];Dr(t,function(r,i,a){if(e(r,i,a)){n.push(r)}});return n}function Mt(t,e){var n=le(t)?bp:vR;return n(t,en(e))}function RS(t){return function(e,n,r){var i=Object(e);if(!pn(e)){var a=en(n);e=Vt(e);n=function(o){return a(i[o],o,i)}}var s=t(e,n,r);return s>-1?i[a?e[s]:s]:void 0}}var vS=Math.max;function $S(t,e,n){var r=t==null?0:t.length;if(!r){return-1}var i=n==null?0:zu(n);if(i<0){i=vS(r+i,0)}return Yg(t,en(e),i)}var zr=RS($S);function Zt(t){return t&&t.length?t[0]:void 0}function TS(t,e){var n=-1,r=pn(t)?Array(t.length):[];Dr(t,function(i,a,s){r[++n]=e(i,a,s)});return r}function H(t,e){var n=le(t)?Vu:TS;return n(t,en(e))}function Lt(t,e){return kp(H(t,e))}var ES=Object.prototype;var wS=ES.hasOwnProperty;var CS=dS(function(t,e,n){if(wS.call(t,n)){t[n].push(e)}else{Rp(t,n,[e])}});var AS=Object.prototype;var SS=AS.hasOwnProperty;function kS(t,e){return t!=null&&SS.call(t,e)}function Q(t,e){return t!=null&&gR(t,e,kS)}var bS="[object String]";function wt(t){return typeof t=="string"||!le(t)&&Qt(t)&&nr(t)==bS}function NS(t,e){return Vu(e,function(n){return t[n]})}function ze(t){return t==null?[]:NS(t,Vt(t))}var PS=Math.max;function $t(t,e,n,r){t=pn(t)?t:ze(t);n=n&&true?zu(n):0;var i=t.length;if(n<0){n=PS(i+n,0)}return wt(t)?n<=i&&t.indexOf(e,n)>-1:!!i&&gp(t,e,n)>-1}function Mm(t,e,n){var r=t==null?0:t.length;if(!r){return-1}var i=0;return gp(t,e,i)}var _S="[object Map]";var DS="[object Set]";var OS=Object.prototype;var IS=OS.hasOwnProperty;function ge(t){if(t==null){return true}if(pn(t)&&(le(t)||typeof t=="string"||typeof t.splice=="function"||Ka(t)||Ep(t)||Ju(t))){return!t.length}var e=Ht(t);if(e==_S||e==DS){return!t.size}if(is(t)){return!rR(t).length}for(var n in t){if(IS.call(t,n)){return false}}return true}var LS="[object RegExp]";function xS(t){return Qt(t)&&nr(t)==LS}var Km=Jn&&Jn.isRegExp;var Kn=Km?Qu(Km):xS;function Fn(t){return t===void 0}function MS(t,e){return t<e}function KS(t,e,n){var r=-1,i=t.length;while(++r<i){var a=t[r],s=e(a);if(s!=null&&(o===void 0?s===s&&!ns(s):n(s,o))){var o=s,l=a}}return l}function FS(t){return t&&t.length?KS(t,Cr,MS):void 0}var US="Expected a function";function GS(t){if(typeof t!="function"){throw new TypeError(US)}return function(){var e=arguments;switch(e.length){case 0:return!t.call(this);case 1:return!t.call(this,e[0]);case 2:return!t.call(this,e[0],e[1]);case 3:return!t.call(this,e[0],e[1],e[2])}return!t.apply(this,e)}}function HS(t,e,n,r){if(!Wt(t)){return t}e=tc(e,t);var i=-1,a=e.length,s=a-1,o=t;while(o!=null&&++i<a){var l=as(e[i]),u=n;if(l==="__proto__"||l==="constructor"||l==="prototype"){return t}if(i!=s){var c=o[l];u=void 0;if(u===void 0){u=Wt(c)?c:Yu(e[i+1])?[]:{}}}Xu(o,l,u);o=o[l]}return t}function qS(t,e,n){var r=-1,i=e.length,a={};while(++r<i){var s=e[r],o=Ap(t,s);if(n(o,s)){HS(a,tc(s,t),o)}}return a}function tn(t,e){if(t==null){return{}}var n=Vu(sC(t),function(r){return[r]});e=en(e);return qS(t,n,function(r,i){return e(r,i[0])})}function jS(t,e,n,r,i){i(t,function(a,s,o){n=r?(r=false,a):e(n,a,s,o)});return n}function gt(t,e,n){var r=le(t)?Bw:jS,i=arguments.length<3;return r(t,en(e),n,i,Dr)}function rc(t,e){var n=le(t)?bp:vR;return n(t,GS(en(e)))}function BS(t,e){var n;Dr(t,function(r,i,a){n=e(r,i,a);return!n});return!!n}function $R(t,e,n){var r=le(t)?pR:BS;return r(t,en(e))}var WS=1/0;var VS=!(qr&&1/_p(new qr([,-0]))[1]==WS)?Ve:function(t){return new qr(t)};var zS=200;function TR(t,e,n){var r=-1,i=Xg,a=t.length,s=true,o=[],l=o;if(a>=zS){var u=e?null:VS(t);if(u){return _p(u)}s=false;i=Pp;l=new Wr}else{l=e?[]:o}e:while(++r<a){var c=t[r],d=e?e(c):c;c=c!==0?c:0;if(s&&d===d){var f=l.length;while(f--){if(l[f]===d){continue e}}if(e){l.push(d)}o.push(c)}else if(!i(l,d,n)){if(l!==o){l.push(d)}o.push(c)}}return o}function Ip(t){return t&&t.length?TR(t):[]}function YS(t,e){return t&&t.length?TR(t,en(e)):[]}function jd(t){if(console&&console.error){console.error(`Error: ${t}`)}}function ER(t){if(console&&console.warn){console.warn(`Warning: ${t}`)}}function wR(t){const e=new Date().getTime();const n=t();const r=new Date().getTime();const i=r-e;return{time:i,value:n}}function CR(t){function e(){}e.prototype=t;const n=new e;function r(){return typeof n.bar}r();r();return t}function XS(t){if(JS(t)){return t.LABEL}else{return t.name}}function JS(t){return wt(t.LABEL)&&t.LABEL!==""}class mn{get definition(){return this._definition}set definition(e){this._definition=e}constructor(e){this._definition=e}accept(e){e.visit(this);Y(this.definition,n=>{n.accept(e)})}}class Rt extends mn{constructor(e){super([]);this.idx=1;xt(this,tn(e,n=>n!==void 0))}set definition(e){}get definition(){if(this.referencedRule!==void 0){return this.referencedRule.definition}return[]}accept(e){e.visit(this)}}class ni extends mn{constructor(e){super(e.definition);this.orgText="";xt(this,tn(e,n=>n!==void 0))}}class Ct extends mn{constructor(e){super(e.definition);this.ignoreAmbiguities=false;xt(this,tn(e,n=>n!==void 0))}}class it extends mn{constructor(e){super(e.definition);this.idx=1;xt(this,tn(e,n=>n!==void 0))}}class Kt extends mn{constructor(e){super(e.definition);this.idx=1;xt(this,tn(e,n=>n!==void 0))}}class Ft extends mn{constructor(e){super(e.definition);this.idx=1;xt(this,tn(e,n=>n!==void 0))}}class De extends mn{constructor(e){super(e.definition);this.idx=1;xt(this,tn(e,n=>n!==void 0))}}class At extends mn{constructor(e){super(e.definition);this.idx=1;xt(this,tn(e,n=>n!==void 0))}}class St extends mn{get definition(){return this._definition}set definition(e){this._definition=e}constructor(e){super(e.definition);this.idx=1;this.ignoreAmbiguities=false;this.hasPredicates=false;xt(this,tn(e,n=>n!==void 0))}}class Ee{constructor(e){this.idx=1;xt(this,tn(e,n=>n!==void 0))}accept(e){e.visit(this)}}function QS(t){return H(t,Wl)}function Wl(t){function e(n){return H(n,Wl)}if(t instanceof Rt){const n={type:"NonTerminal",name:t.nonTerminalName,idx:t.idx};if(wt(t.label)){n.label=t.label}return n}else if(t instanceof Ct){return{type:"Alternative",definition:e(t.definition)}}else if(t instanceof it){return{type:"Option",idx:t.idx,definition:e(t.definition)}}else if(t instanceof Kt){return{type:"RepetitionMandatory",idx:t.idx,definition:e(t.definition)}}else if(t instanceof Ft){return{type:"RepetitionMandatoryWithSeparator",idx:t.idx,separator:Wl(new Ee({terminalType:t.separator})),definition:e(t.definition)}}else if(t instanceof At){return{type:"RepetitionWithSeparator",idx:t.idx,separator:Wl(new Ee({terminalType:t.separator})),definition:e(t.definition)}}else if(t instanceof De){return{type:"Repetition",idx:t.idx,definition:e(t.definition)}}else if(t instanceof St){return{type:"Alternation",idx:t.idx,definition:e(t.definition)}}else if(t instanceof Ee){const n={type:"Terminal",name:t.terminalType.name,label:XS(t.terminalType),idx:t.idx};if(wt(t.label)){n.terminalLabel=t.label}const r=t.terminalType.PATTERN;if(t.terminalType.PATTERN){n.pattern=Kn(r)?r.source:r}return n}else if(t instanceof ni){return{type:"Rule",name:t.name,orgText:t.orgText,definition:e(t.definition)}}else{throw Error("non exhaustive match")}}class ri{visit(e){const n=e;switch(n.constructor){case Rt:return this.visitNonTerminal(n);case Ct:return this.visitAlternative(n);case it:return this.visitOption(n);case Kt:return this.visitRepetitionMandatory(n);case Ft:return this.visitRepetitionMandatoryWithSeparator(n);case At:return this.visitRepetitionWithSeparator(n);case De:return this.visitRepetition(n);case St:return this.visitAlternation(n);case Ee:return this.visitTerminal(n);case ni:return this.visitRule(n);default:throw Error("non exhaustive match")}}visitNonTerminal(e){}visitAlternative(e){}visitOption(e){}visitRepetition(e){}visitRepetitionMandatory(e){}visitRepetitionMandatoryWithSeparator(e){}visitRepetitionWithSeparator(e){}visitAlternation(e){}visitTerminal(e){}visitRule(e){}}function ZS(t){return t instanceof Ct||t instanceof it||t instanceof De||t instanceof Kt||t instanceof Ft||t instanceof At||t instanceof Ee||t instanceof ni}function yu(t,e=[]){const n=t instanceof it||t instanceof De||t instanceof At;if(n){return true}if(t instanceof St){return $R(t.definition,r=>{return yu(r,e)})}else if(t instanceof Rt&&$t(e,t)){return false}else if(t instanceof mn){if(t instanceof Rt){e.push(t)}return Xt(t.definition,r=>{return yu(r,e)})}else{return false}}function ek(t){return t instanceof St}function sn(t){if(t instanceof Rt){return"SUBRULE"}else if(t instanceof it){return"OPTION"}else if(t instanceof St){return"OR"}else if(t instanceof Kt){return"AT_LEAST_ONE"}else if(t instanceof Ft){return"AT_LEAST_ONE_SEP"}else if(t instanceof At){return"MANY_SEP"}else if(t instanceof De){return"MANY"}else if(t instanceof Ee){return"CONSUME"}else{throw Error("non exhaustive match")}}class ic{walk(e,n=[]){Y(e.definition,(r,i)=>{const a=et(e.definition,i+1);if(r instanceof Rt){this.walkProdRef(r,a,n)}else if(r instanceof Ee){this.walkTerminal(r,a,n)}else if(r instanceof Ct){this.walkFlat(r,a,n)}else if(r instanceof it){this.walkOption(r,a,n)}else if(r instanceof Kt){this.walkAtLeastOne(r,a,n)}else if(r instanceof Ft){this.walkAtLeastOneSep(r,a,n)}else if(r instanceof At){this.walkManySep(r,a,n)}else if(r instanceof De){this.walkMany(r,a,n)}else if(r instanceof St){this.walkOr(r,a,n)}else{throw Error("non exhaustive match")}})}walkTerminal(e,n,r){}walkProdRef(e,n,r){}walkFlat(e,n,r){const i=n.concat(r);this.walk(e,i)}walkOption(e,n,r){const i=n.concat(r);this.walk(e,i)}walkAtLeastOne(e,n,r){const i=[new it({definition:e.definition})].concat(n,r);this.walk(e,i)}walkAtLeastOneSep(e,n,r){const i=Fm(e,n,r);this.walk(e,i)}walkMany(e,n,r){const i=[new it({definition:e.definition})].concat(n,r);this.walk(e,i)}walkManySep(e,n,r){const i=Fm(e,n,r);this.walk(e,i)}walkOr(e,n,r){const i=n.concat(r);Y(e.definition,a=>{const s=new Ct({definition:[a]});this.walk(s,i)})}}function Fm(t,e,n){const r=[new it({definition:[new Ee({terminalType:t.separator})].concat(t.definition)})];const i=r.concat(e,n);return i}function os(t){if(t instanceof Rt){return os(t.referencedRule)}else if(t instanceof Ee){return rk(t)}else if(ZS(t)){return tk(t)}else if(ek(t)){return nk(t)}else{throw Error("non exhaustive match")}}function tk(t){let e=[];const n=t.definition;let r=0;let i=n.length>r;let a;let s=true;while(i&&s){a=n[r];s=yu(a);e=e.concat(os(a));r=r+1;i=n.length>r}return Ip(e)}function nk(t){const e=H(t.definition,n=>{return os(n)});return Ip(jt(e))}function rk(t){return[t.terminalType]}const AR="_~IN~_";class ik extends ic{constructor(e){super();this.topProd=e;this.follows={}}startWalking(){this.walk(this.topProd);return this.follows}walkTerminal(e,n,r){}walkProdRef(e,n,r){const i=sk(e.referencedRule,e.idx)+this.topProd.name;const a=n.concat(r);const s=new Ct({definition:a});const o=os(s);this.follows[i]=o}}function ak(t){const e={};Y(t,n=>{const r=new ik(n).startWalking();xt(e,r)});return e}function sk(t,e){return t.name+e+AR}let Vl={};const ok=new Lg;function ac(t){const e=t.toString();if(Vl.hasOwnProperty(e)){return Vl[e]}else{const n=ok.pattern(e);Vl[e]=n;return n}}function lk(){Vl={}}const SR="Complement Sets are not supported for first char optimization";const gu='Unable to use "first char" lexer optimizations:\n';function uk(t,e=false){try{const n=ac(t);const r=Bd(n.value,{},n.flags.ignoreCase);return r}catch(n){if(n.message===SR){if(e){ER(`${gu}	Unable to optimize: < ${t.toString()} >
	Complement Sets cannot be automatically optimized.
	This will disable the lexer's first char optimizations.
	See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#COMPLEMENT for details.`)}}else{let r="";if(e){r="\n	This will disable the lexer's first char optimizations.\n	See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#REGEXP_PARSING for details."}jd(`${gu}
	Failed parsing: < ${t.toString()} >
	Using the @chevrotain/regexp-to-ast library
	Please open an issue at: https://github.com/chevrotain/chevrotain/issues`+r)}}return[]}function Bd(t,e,n){switch(t.type){case"Disjunction":for(let i=0;i<t.value.length;i++){Bd(t.value[i],e,n)}break;case"Alternative":const r=t.value;for(let i=0;i<r.length;i++){const a=r[i];switch(a.type){case"EndAnchor":case"GroupBackReference":case"Lookahead":case"NegativeLookahead":case"StartAnchor":case"WordBoundary":case"NonWordBoundary":continue}const s=a;switch(s.type){case"Character":Fs(s.value,e,n);break;case"Set":if(s.complement===true){throw Error(SR)}Y(s.value,l=>{if(typeof l==="number"){Fs(l,e,n)}else{const u=l;if(n===true){for(let c=u.from;c<=u.to;c++){Fs(c,e,n)}}else{for(let c=u.from;c<=u.to&&c<va;c++){Fs(c,e,n)}if(u.to>=va){const c=u.from>=va?u.from:va;const d=u.to;const f=Qn(c);const p=Qn(d);for(let y=f;y<=p;y++){e[y]=y}}}}});break;case"Group":Bd(s.value,e,n);break;default:throw Error("Non Exhaustive Match")}const o=s.quantifier!==void 0&&s.quantifier.atLeast===0;if(s.type==="Group"&&Wd(s)===false||s.type!=="Group"&&o===false){break}}break;default:throw Error("non exhaustive match!")}return ze(e)}function Fs(t,e,n){const r=Qn(t);e[r]=r;if(n===true){ck(t,e)}}function ck(t,e){const n=String.fromCharCode(t);const r=n.toUpperCase();if(r!==n){const i=Qn(r.charCodeAt(0));e[i]=i}else{const i=n.toLowerCase();if(i!==n){const a=Qn(i.charCodeAt(0));e[a]=a}}}function Um(t,e){return zr(t.value,n=>{if(typeof n==="number"){return $t(e,n)}else{const r=n;return zr(e,i=>r.from<=i&&i<=r.to)!==void 0}})}function Wd(t){const e=t.quantifier;if(e&&e.atLeast===0){return true}if(!t.value){return false}return le(t.value)?Xt(t.value,Wd):Wd(t.value)}class dk extends qu{constructor(e){super();this.targetCharCodes=e;this.found=false}visitChildren(e){if(this.found===true){return}switch(e.type){case"Lookahead":this.visitLookahead(e);return;case"NegativeLookahead":this.visitNegativeLookahead(e);return}super.visitChildren(e)}visitCharacter(e){if($t(this.targetCharCodes,e.value)){this.found=true}}visitSet(e){if(e.complement){if(Um(e,this.targetCharCodes)===void 0){this.found=true}}else{if(Um(e,this.targetCharCodes)!==void 0){this.found=true}}}}function Lp(t,e){if(e instanceof RegExp){const n=ac(e);const r=new dk(t);r.visit(n);return r.found}else{return zr(e,n=>{return $t(t,n.charCodeAt(0))})!==void 0}}const Sr="PATTERN";const Ra="defaultMode";const Us="modes";let kR=typeof new RegExp("(?:)").sticky==="boolean";function fk(t,e){e=Op(e,{useSticky:kR,debug:false,safeMode:false,positionTracking:"full",lineTerminatorCharacters:["\r","\n"],tracer:(E,C)=>C()});const n=e.tracer;n("initCharCodeToOptimizedIndexMap",()=>{Lk()});let r;n("Reject Lexer.NA",()=>{r=rc(t,E=>{return E[Sr]===ot.NA})});let i=false;let a;n("Transform Patterns",()=>{i=false;a=H(r,E=>{const C=E[Sr];if(Kn(C)){const I=C.source;if(I.length===1&&I!=="^"&&I!=="$"&&I!=="."&&!C.ignoreCase){return I}else if(I.length===2&&I[0]==="\\"&&!$t(["d","D","s","S","t","r","n","t","0","c","b","B","f","v","w","W"],I[1])){return I[1]}else{return e.useSticky?Hm(C):Gm(C)}}else if(Hn(C)){i=true;return{exec:C}}else if(typeof C==="object"){i=true;return C}else if(typeof C==="string"){if(C.length===1){return C}else{const I=C.replace(/[\\^$.*+?()[\]{}|]/g,"\\$&");const X=new RegExp(I);return e.useSticky?Hm(X):Gm(X)}}else{throw Error("non exhaustive match")}})});let s;let o;let l;let u;let c;n("misc mapping",()=>{s=H(r,E=>E.tokenTypeIdx);o=H(r,E=>{const C=E.GROUP;if(C===ot.SKIPPED){return void 0}else if(wt(C)){return C}else if(Fn(C)){return false}else{throw Error("non exhaustive match")}});l=H(r,E=>{const C=E.LONGER_ALT;if(C){const I=le(C)?H(C,X=>Mm(r,X)):[Mm(r,C)];return I}});u=H(r,E=>E.PUSH_MODE);c=H(r,E=>Q(E,"POP_MODE"))});let d;n("Line Terminator Handling",()=>{const E=PR(e.lineTerminatorCharacters);d=H(r,C=>false);if(e.positionTracking!=="onlyOffset"){d=H(r,C=>{if(Q(C,"LINE_BREAKS")){return!!C.LINE_BREAKS}else{return NR(C,E)===false&&Lp(E,C.PATTERN)}})}});let f;let p;let y;let v;n("Misc Mapping #2",()=>{f=H(r,bR);p=H(a,Dk);y=gt(r,(E,C)=>{const I=C.GROUP;if(wt(I)&&!(I===ot.SKIPPED)){E[I]=[]}return E},{});v=H(a,(E,C)=>{return{pattern:a[C],longerAlt:l[C],canLineTerminator:d[C],isCustom:f[C],short:p[C],group:o[C],push:u[C],pop:c[C],tokenTypeIdx:s[C],tokenType:r[C]}})});let k=true;let $=[];if(!e.safeMode){n("First Char Optimization",()=>{$=gt(r,(E,C,I)=>{if(typeof C.PATTERN==="string"){const X=C.PATTERN.charCodeAt(0);const q=Qn(X);Ec(E,q,v[I])}else if(le(C.START_CHARS_HINT)){let X;Y(C.START_CHARS_HINT,q=>{const J=typeof q==="string"?q.charCodeAt(0):q;const ne=Qn(J);if(X!==ne){X=ne;Ec(E,ne,v[I])}})}else if(Kn(C.PATTERN)){if(C.PATTERN.unicode){k=false;if(e.ensureOptimizations){jd(`${gu}	Unable to analyze < ${C.PATTERN.toString()} > pattern.
	The regexp unicode flag is not currently supported by the regexp-to-ast library.
	This will disable the lexer's first char optimizations.
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#UNICODE_OPTIMIZE`)}}else{const X=uk(C.PATTERN,e.ensureOptimizations);if(ge(X)){k=false}Y(X,q=>{Ec(E,q,v[I])})}}else{if(e.ensureOptimizations){jd(`${gu}	TokenType: <${C.name}> is using a custom token pattern without providing <start_chars_hint> parameter.
	This will disable the lexer's first char optimizations.
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#CUSTOM_OPTIMIZE`)}k=false}return E},[])})}return{emptyGroups:y,patternIdxToConfig:v,charCodeToPatternIdxToConfig:$,hasCustom:i,canBeOptimized:k}}function pk(t,e){let n=[];const r=hk(t);n=n.concat(r.errors);const i=yk(r.valid);const a=i.valid;n=n.concat(i.errors);n=n.concat(mk(a));n=n.concat(Ck(a));n=n.concat(Ak(a,e));n=n.concat(Sk(a));return n}function mk(t){let e=[];const n=Mt(t,r=>Kn(r[Sr]));e=e.concat(Rk(n));e=e.concat(Tk(n));e=e.concat(Ek(n));e=e.concat(wk(n));e=e.concat(vk(n));return e}function hk(t){const e=Mt(t,i=>{return!Q(i,Sr)});const n=H(e,i=>{return{message:"Token Type: ->"+i.name+"<- missing static 'PATTERN' property",type:Oe.MISSING_PATTERN,tokenTypes:[i]}});const r=nc(t,e);return{errors:n,valid:r}}function yk(t){const e=Mt(t,i=>{const a=i[Sr];return!Kn(a)&&!Hn(a)&&!Q(a,"exec")&&!wt(a)});const n=H(e,i=>{return{message:"Token Type: ->"+i.name+"<- static 'PATTERN' can only be a RegExp, a Function matching the {CustomPatternMatcherFunc} type or an Object matching the {ICustomPattern} interface.",type:Oe.INVALID_PATTERN,tokenTypes:[i]}});const r=nc(t,e);return{errors:n,valid:r}}const gk=/[^\\][$]/;function Rk(t){class e extends qu{constructor(){super(...arguments);this.found=false}visitEndAnchor(a){this.found=true}}const n=Mt(t,i=>{const a=i.PATTERN;try{const s=ac(a);const o=new e;o.visit(s);return o.found}catch(s){return gk.test(a.source)}});const r=H(n,i=>{return{message:"Unexpected RegExp Anchor Error:\n	Token Type: ->"+i.name+"<- static 'PATTERN' cannot contain end of input anchor '$'\n	See chevrotain.io/docs/guide/resolving_lexer_errors.html#ANCHORS	for details.",type:Oe.EOI_ANCHOR_FOUND,tokenTypes:[i]}});return r}function vk(t){const e=Mt(t,r=>{const i=r.PATTERN;return i.test("")});const n=H(e,r=>{return{message:"Token Type: ->"+r.name+"<- static 'PATTERN' must not match an empty string",type:Oe.EMPTY_MATCH_PATTERN,tokenTypes:[r]}});return n}const $k=/[^\\[][\^]|^\^/;function Tk(t){class e extends qu{constructor(){super(...arguments);this.found=false}visitStartAnchor(a){this.found=true}}const n=Mt(t,i=>{const a=i.PATTERN;try{const s=ac(a);const o=new e;o.visit(s);return o.found}catch(s){return $k.test(a.source)}});const r=H(n,i=>{return{message:"Unexpected RegExp Anchor Error:\n	Token Type: ->"+i.name+"<- static 'PATTERN' cannot contain start of input anchor '^'\n	See https://chevrotain.io/docs/guide/resolving_lexer_errors.html#ANCHORS	for details.",type:Oe.SOI_ANCHOR_FOUND,tokenTypes:[i]}});return r}function Ek(t){const e=Mt(t,r=>{const i=r[Sr];return i instanceof RegExp&&(i.multiline||i.global)});const n=H(e,r=>{return{message:"Token Type: ->"+r.name+"<- static 'PATTERN' may NOT contain global('g') or multiline('m')",type:Oe.UNSUPPORTED_FLAGS_FOUND,tokenTypes:[r]}});return n}function wk(t){const e=[];let n=H(t,a=>{return gt(t,(s,o)=>{if(a.PATTERN.source===o.PATTERN.source&&!$t(e,o)&&o.PATTERN!==ot.NA){e.push(o);s.push(o);return s}return s},[])});n=ss(n);const r=Mt(n,a=>{return a.length>1});const i=H(r,a=>{const s=H(a,l=>{return l.name});const o=Zt(a).PATTERN;return{message:`The same RegExp pattern ->${o}<-has been used in all of the following Token Types: ${s.join(", ")} <-`,type:Oe.DUPLICATE_PATTERNS_FOUND,tokenTypes:a}});return i}function Ck(t){const e=Mt(t,r=>{if(!Q(r,"GROUP")){return false}const i=r.GROUP;return i!==ot.SKIPPED&&i!==ot.NA&&!wt(i)});const n=H(e,r=>{return{message:"Token Type: ->"+r.name+"<- static 'GROUP' can only be Lexer.SKIPPED/Lexer.NA/A String",type:Oe.INVALID_GROUP_TYPE_FOUND,tokenTypes:[r]}});return n}function Ak(t,e){const n=Mt(t,i=>{return i.PUSH_MODE!==void 0&&!$t(e,i.PUSH_MODE)});const r=H(n,i=>{const a=`Token Type: ->${i.name}<- static 'PUSH_MODE' value cannot refer to a Lexer Mode ->${i.PUSH_MODE}<-which does not exist`;return{message:a,type:Oe.PUSH_MODE_DOES_NOT_EXIST,tokenTypes:[i]}});return r}function Sk(t){const e=[];const n=gt(t,(r,i,a)=>{const s=i.PATTERN;if(s===ot.NA){return r}if(wt(s)){r.push({str:s,idx:a,tokenType:i})}else if(Kn(s)&&bk(s)){r.push({str:s.source,idx:a,tokenType:i})}return r},[]);Y(t,(r,i)=>{Y(n,({str:a,idx:s,tokenType:o})=>{if(i<s&&kk(a,r.PATTERN)){const l=`Token: ->${o.name}<- can never be matched.
Because it appears AFTER the Token Type ->${r.name}<-in the lexer's definition.
See https://chevrotain.io/docs/guide/resolving_lexer_errors.html#UNREACHABLE`;e.push({message:l,type:Oe.UNREACHABLE_PATTERN,tokenTypes:[r,o]})}})});return e}function kk(t,e){if(Kn(e)){const n=e.exec(t);return n!==null&&n.index===0}else if(Hn(e)){return e(t,0,[],{})}else if(Q(e,"exec")){return e.exec(t,0,[],{})}else if(typeof e==="string"){return e===t}else{throw Error("non exhaustive match")}}function bk(t){const e=[".","\\","[","]","|","^","$","(",")","?","*","+","{"];return zr(e,n=>t.source.indexOf(n)!==-1)===void 0}function Gm(t){const e=t.ignoreCase?"i":"";return new RegExp(`^(?:${t.source})`,e)}function Hm(t){const e=t.ignoreCase?"iy":"y";return new RegExp(`${t.source}`,e)}function Nk(t,e,n){const r=[];if(!Q(t,Ra)){r.push({message:"A MultiMode Lexer cannot be initialized without a <"+Ra+"> property in its definition\n",type:Oe.MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE})}if(!Q(t,Us)){r.push({message:"A MultiMode Lexer cannot be initialized without a <"+Us+"> property in its definition\n",type:Oe.MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY})}if(Q(t,Us)&&Q(t,Ra)&&!Q(t.modes,t.defaultMode)){r.push({message:`A MultiMode Lexer cannot be initialized with a ${Ra}: <${t.defaultMode}>which does not exist
`,type:Oe.MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST})}if(Q(t,Us)){Y(t.modes,(i,a)=>{Y(i,(s,o)=>{if(Fn(s)){r.push({message:`A Lexer cannot be initialized using an undefined Token Type. Mode:<${a}> at index: <${o}>
`,type:Oe.LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED})}else if(Q(s,"LONGER_ALT")){const l=le(s.LONGER_ALT)?s.LONGER_ALT:[s.LONGER_ALT];Y(l,u=>{if(!Fn(u)&&!$t(i,u)){r.push({message:`A MultiMode Lexer cannot be initialized with a longer_alt <${u.name}> on token <${s.name}> outside of mode <${a}>
`,type:Oe.MULTI_MODE_LEXER_LONGER_ALT_NOT_IN_CURRENT_MODE})}})}})})}return r}function Pk(t,e,n){const r=[];let i=false;const a=ss(jt(ze(t.modes)));const s=rc(a,l=>l[Sr]===ot.NA);const o=PR(n);if(e){Y(s,l=>{const u=NR(l,o);if(u!==false){const c=Ik(l,u);const d={message:c,type:u.issue,tokenType:l};r.push(d)}else{if(Q(l,"LINE_BREAKS")){if(l.LINE_BREAKS===true){i=true}}else{if(Lp(o,l.PATTERN)){i=true}}}})}if(e&&!i){r.push({message:"Warning: No LINE_BREAKS Found.\n	This Lexer has been defined to track line and column information,\n	But none of the Token Types can be identified as matching a line terminator.\n	See https://chevrotain.io/docs/guide/resolving_lexer_errors.html#LINE_BREAKS \n	for details.",type:Oe.NO_LINE_BREAKS_FLAGS})}return r}function _k(t){const e={};const n=Vt(t);Y(n,r=>{const i=t[r];if(le(i)){e[r]=[]}else{throw Error("non exhaustive match")}});return e}function bR(t){const e=t.PATTERN;if(Kn(e)){return false}else if(Hn(e)){return true}else if(Q(e,"exec")){return true}else if(wt(e)){return false}else{throw Error("non exhaustive match")}}function Dk(t){if(wt(t)&&t.length===1){return t.charCodeAt(0)}else{return false}}const Ok={test:function(t){const e=t.length;for(let n=this.lastIndex;n<e;n++){const r=t.charCodeAt(n);if(r===10){this.lastIndex=n+1;return true}else if(r===13){if(t.charCodeAt(n+1)===10){this.lastIndex=n+2}else{this.lastIndex=n+1}return true}}return false},lastIndex:0};function NR(t,e){if(Q(t,"LINE_BREAKS")){return false}else{if(Kn(t.PATTERN)){try{Lp(e,t.PATTERN)}catch(n){return{issue:Oe.IDENTIFY_TERMINATOR,errMsg:n.message}}return false}else if(wt(t.PATTERN)){return false}else if(bR(t)){return{issue:Oe.CUSTOM_LINE_BREAK}}else{throw Error("non exhaustive match")}}}function Ik(t,e){if(e.issue===Oe.IDENTIFY_TERMINATOR){return`Warning: unable to identify line terminator usage in pattern.
	The problem is in the <${t.name}> Token Type
	 Root cause: ${e.errMsg}.
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#IDENTIFY_TERMINATOR`}else if(e.issue===Oe.CUSTOM_LINE_BREAK){return`Warning: A Custom Token Pattern should specify the <line_breaks> option.
	The problem is in the <${t.name}> Token Type
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#CUSTOM_LINE_BREAK`}else{throw Error("non exhaustive match")}}function PR(t){const e=H(t,n=>{if(wt(n)){return n.charCodeAt(0)}else{return n}});return e}function Ec(t,e,n){if(t[e]===void 0){t[e]=[n]}else{t[e].push(n)}}const va=256;let zl=[];function Qn(t){return t<va?t:zl[t]}function Lk(){if(ge(zl)){zl=new Array(65536);for(let t=0;t<65536;t++){zl[t]=t>255?255+~~(t/255):t}}}function ls(t,e){const n=t.tokenTypeIdx;if(n===e.tokenTypeIdx){return true}else{return e.isParent===true&&e.categoryMatchesMap[n]===true}}function Ru(t,e){return t.tokenTypeIdx===e.tokenTypeIdx}let qm=1;const _R={};function us(t){const e=xk(t);Mk(e);Fk(e);Kk(e);Y(e,n=>{n.isParent=n.categoryMatches.length>0})}function xk(t){let e=at(t);let n=t;let r=true;while(r){n=ss(jt(H(n,a=>a.CATEGORIES)));const i=nc(n,e);e=e.concat(i);if(ge(i)){r=false}else{n=i}}return e}function Mk(t){Y(t,e=>{if(!OR(e)){_R[qm]=e;e.tokenTypeIdx=qm++}if(jm(e)&&!le(e.CATEGORIES)){e.CATEGORIES=[e.CATEGORIES]}if(!jm(e)){e.CATEGORIES=[]}if(!Uk(e)){e.categoryMatches=[]}if(!Gk(e)){e.categoryMatchesMap={}}})}function Kk(t){Y(t,e=>{e.categoryMatches=[];Y(e.categoryMatchesMap,(n,r)=>{e.categoryMatches.push(_R[r].tokenTypeIdx)})})}function Fk(t){Y(t,e=>{DR([],e)})}function DR(t,e){Y(t,n=>{e.categoryMatchesMap[n.tokenTypeIdx]=true});Y(e.CATEGORIES,n=>{const r=t.concat(e);if(!$t(r,n)){DR(r,n)}})}function OR(t){return Q(t,"tokenTypeIdx")}function jm(t){return Q(t,"CATEGORIES")}function Uk(t){return Q(t,"categoryMatches")}function Gk(t){return Q(t,"categoryMatchesMap")}function Hk(t){return Q(t,"tokenTypeIdx")}const Vd={buildUnableToPopLexerModeMessage(t){return`Unable to pop Lexer Mode after encountering Token ->${t.image}<- The Mode Stack is empty`},buildUnexpectedCharactersMessage(t,e,n,r,i){return`unexpected character: ->${t.charAt(e)}<- at offset: ${e}, skipped ${n} characters.`}};var Oe;(function(t){t[t["MISSING_PATTERN"]=0]="MISSING_PATTERN";t[t["INVALID_PATTERN"]=1]="INVALID_PATTERN";t[t["EOI_ANCHOR_FOUND"]=2]="EOI_ANCHOR_FOUND";t[t["UNSUPPORTED_FLAGS_FOUND"]=3]="UNSUPPORTED_FLAGS_FOUND";t[t["DUPLICATE_PATTERNS_FOUND"]=4]="DUPLICATE_PATTERNS_FOUND";t[t["INVALID_GROUP_TYPE_FOUND"]=5]="INVALID_GROUP_TYPE_FOUND";t[t["PUSH_MODE_DOES_NOT_EXIST"]=6]="PUSH_MODE_DOES_NOT_EXIST";t[t["MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE"]=7]="MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE";t[t["MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY"]=8]="MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY";t[t["MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST"]=9]="MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST";t[t["LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED"]=10]="LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED";t[t["SOI_ANCHOR_FOUND"]=11]="SOI_ANCHOR_FOUND";t[t["EMPTY_MATCH_PATTERN"]=12]="EMPTY_MATCH_PATTERN";t[t["NO_LINE_BREAKS_FLAGS"]=13]="NO_LINE_BREAKS_FLAGS";t[t["UNREACHABLE_PATTERN"]=14]="UNREACHABLE_PATTERN";t[t["IDENTIFY_TERMINATOR"]=15]="IDENTIFY_TERMINATOR";t[t["CUSTOM_LINE_BREAK"]=16]="CUSTOM_LINE_BREAK";t[t["MULTI_MODE_LEXER_LONGER_ALT_NOT_IN_CURRENT_MODE"]=17]="MULTI_MODE_LEXER_LONGER_ALT_NOT_IN_CURRENT_MODE"})(Oe||(Oe={}));const $a={deferDefinitionErrorsHandling:false,positionTracking:"full",lineTerminatorsPattern:/\n|\r\n?/g,lineTerminatorCharacters:["\n","\r"],ensureOptimizations:false,safeMode:false,errorMessageProvider:Vd,traceInitPerf:false,skipValidations:false,recoveryEnabled:true};Object.freeze($a);class ot{constructor(e,n=$a){this.lexerDefinition=e;this.lexerDefinitionErrors=[];this.lexerDefinitionWarning=[];this.patternIdxToConfig={};this.charCodeToPatternIdxToConfig={};this.modes=[];this.emptyGroups={};this.trackStartLines=true;this.trackEndLines=true;this.hasCustom=false;this.canModeBeOptimized={};this.TRACE_INIT=(i,a)=>{if(this.traceInitPerf===true){this.traceInitIndent++;const s=new Array(this.traceInitIndent+1).join("	");if(this.traceInitIndent<this.traceInitMaxIdent){console.log(`${s}--> <${i}>`)}const{time:o,value:l}=wR(a);const u=o>10?console.warn:console.log;if(this.traceInitIndent<this.traceInitMaxIdent){u(`${s}<-- <${i}> time: ${o}ms`)}this.traceInitIndent--;return l}else{return a()}};if(typeof n==="boolean"){throw Error("The second argument to the Lexer constructor is now an ILexerConfig Object.\na boolean 2nd argument is no longer supported")}this.config=xt({},$a,n);const r=this.config.traceInitPerf;if(r===true){this.traceInitMaxIdent=Infinity;this.traceInitPerf=true}else if(typeof r==="number"){this.traceInitMaxIdent=r;this.traceInitPerf=true}this.traceInitIndent=-1;this.TRACE_INIT("Lexer Constructor",()=>{let i;let a=true;this.TRACE_INIT("Lexer Config handling",()=>{if(this.config.lineTerminatorsPattern===$a.lineTerminatorsPattern){this.config.lineTerminatorsPattern=Ok}else{if(this.config.lineTerminatorCharacters===$a.lineTerminatorCharacters){throw Error("Error: Missing <lineTerminatorCharacters> property on the Lexer config.\n	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#MISSING_LINE_TERM_CHARS")}}if(n.safeMode&&n.ensureOptimizations){throw Error('"safeMode" and "ensureOptimizations" flags are mutually exclusive.')}this.trackStartLines=/full|onlyStart/i.test(this.config.positionTracking);this.trackEndLines=/full/i.test(this.config.positionTracking);if(le(e)){i={modes:{defaultMode:at(e)},defaultMode:Ra}}else{a=false;i=at(e)}});if(this.config.skipValidations===false){this.TRACE_INIT("performRuntimeChecks",()=>{this.lexerDefinitionErrors=this.lexerDefinitionErrors.concat(Nk(i,this.trackStartLines,this.config.lineTerminatorCharacters))});this.TRACE_INIT("performWarningRuntimeChecks",()=>{this.lexerDefinitionWarning=this.lexerDefinitionWarning.concat(Pk(i,this.trackStartLines,this.config.lineTerminatorCharacters))})}i.modes=i.modes?i.modes:{};Y(i.modes,(o,l)=>{i.modes[l]=rc(o,u=>Fn(u))});const s=Vt(i.modes);Y(i.modes,(o,l)=>{this.TRACE_INIT(`Mode: <${l}> processing`,()=>{this.modes.push(l);if(this.config.skipValidations===false){this.TRACE_INIT(`validatePatterns`,()=>{this.lexerDefinitionErrors=this.lexerDefinitionErrors.concat(pk(o,s))})}if(ge(this.lexerDefinitionErrors)){us(o);let u;this.TRACE_INIT(`analyzeTokenTypes`,()=>{u=fk(o,{lineTerminatorCharacters:this.config.lineTerminatorCharacters,positionTracking:n.positionTracking,ensureOptimizations:n.ensureOptimizations,safeMode:n.safeMode,tracer:this.TRACE_INIT})});this.patternIdxToConfig[l]=u.patternIdxToConfig;this.charCodeToPatternIdxToConfig[l]=u.charCodeToPatternIdxToConfig;this.emptyGroups=xt({},this.emptyGroups,u.emptyGroups);this.hasCustom=u.hasCustom||this.hasCustom;this.canModeBeOptimized[l]=u.canBeOptimized}})});this.defaultMode=i.defaultMode;if(!ge(this.lexerDefinitionErrors)&&!this.config.deferDefinitionErrorsHandling){const o=H(this.lexerDefinitionErrors,u=>{return u.message});const l=o.join("-----------------------\n");throw new Error("Errors detected in definition of Lexer:\n"+l)}Y(this.lexerDefinitionWarning,o=>{ER(o.message)});this.TRACE_INIT("Choosing sub-methods implementations",()=>{if(kR){this.chopInput=Cr;this.match=this.matchWithTest}else{this.updateLastIndex=Ve;this.match=this.matchWithExec}if(a){this.handleModes=Ve}if(this.trackStartLines===false){this.computeNewColumn=Cr}if(this.trackEndLines===false){this.updateTokenEndLineColumnLocation=Ve}if(/full/i.test(this.config.positionTracking)){this.createTokenInstance=this.createFullToken}else if(/onlyStart/i.test(this.config.positionTracking)){this.createTokenInstance=this.createStartOnlyToken}else if(/onlyOffset/i.test(this.config.positionTracking)){this.createTokenInstance=this.createOffsetOnlyToken}else{throw Error(`Invalid <positionTracking> config option: "${this.config.positionTracking}"`)}if(this.hasCustom){this.addToken=this.addTokenUsingPush;this.handlePayload=this.handlePayloadWithCustom}else{this.addToken=this.addTokenUsingMemberAccess;this.handlePayload=this.handlePayloadNoCustom}});this.TRACE_INIT("Failed Optimization Warnings",()=>{const o=gt(this.canModeBeOptimized,(l,u,c)=>{if(u===false){l.push(c)}return l},[]);if(n.ensureOptimizations&&!ge(o)){throw Error(`Lexer Modes: < ${o.join(", ")} > cannot be optimized.
	 Disable the "ensureOptimizations" lexer config flag to silently ignore this and run the lexer in an un-optimized mode.
	 Or inspect the console log for details on how to resolve these issues.`)}});this.TRACE_INIT("clearRegExpParserCache",()=>{lk()});this.TRACE_INIT("toFastProperties",()=>{CR(this)})})}tokenize(e,n=this.defaultMode){if(!ge(this.lexerDefinitionErrors)){const r=H(this.lexerDefinitionErrors,a=>{return a.message});const i=r.join("-----------------------\n");throw new Error("Unable to Tokenize because Errors detected in definition of Lexer:\n"+i)}return this.tokenizeInternal(e,n)}tokenizeInternal(e,n){let r,i,a,s,o,l,u,c,d,f,p,y,v,k,$;const E=e;const C=E.length;let I=0;let X=0;const q=this.hasCustom?0:Math.floor(e.length/10);const J=new Array(q);const ne=[];let ae=this.trackStartLines?1:void 0;let de=this.trackStartLines?1:void 0;const L=_k(this.emptyGroups);const w=this.trackStartLines;const g=this.config.lineTerminatorsPattern;let b=0;let M=[];let O=[];const x=[];const we=[];Object.freeze(we);let F;function N(){return M}function re(me){const Pe=Qn(me);const Be=O[Pe];if(Be===void 0){return we}else{return Be}}const kt=me=>{if(x.length===1&&me.tokenType.PUSH_MODE===void 0){const Pe=this.config.errorMessageProvider.buildUnableToPopLexerModeMessage(me);ne.push({offset:me.startOffset,line:me.startLine,column:me.startColumn,length:me.image.length,message:Pe})}else{x.pop();const Pe=Vr(x);M=this.patternIdxToConfig[Pe];O=this.charCodeToPatternIdxToConfig[Pe];b=M.length;const Be=this.canModeBeOptimized[Pe]&&this.config.safeMode===false;if(O&&Be){F=re}else{F=N}}};function bt(me){x.push(me);O=this.charCodeToPatternIdxToConfig[me];M=this.patternIdxToConfig[me];b=M.length;b=M.length;const Pe=this.canModeBeOptimized[me]&&this.config.safeMode===false;if(O&&Pe){F=re}else{F=N}}bt.call(this,n);let Ce;const Nt=this.config.recoveryEnabled;while(I<C){l=null;const me=E.charCodeAt(I);const Pe=F(me);const Be=Pe.length;for(r=0;r<Be;r++){Ce=Pe[r];const Re=Ce.pattern;u=null;const j=Ce.short;if(j!==false){if(me===j){l=Re}}else if(Ce.isCustom===true){$=Re.exec(E,I,J,L);if($!==null){l=$[0];if($.payload!==void 0){u=$.payload}}else{l=null}}else{this.updateLastIndex(Re,I);l=this.match(Re,e,I)}if(l!==null){o=Ce.longerAlt;if(o!==void 0){const R=o.length;for(a=0;a<R;a++){const S=M[o[a]];const B=S.pattern;c=null;if(S.isCustom===true){$=B.exec(E,I,J,L);if($!==null){s=$[0];if($.payload!==void 0){c=$.payload}}else{s=null}}else{this.updateLastIndex(B,I);s=this.match(B,e,I)}if(s&&s.length>l.length){l=s;u=c;Ce=S;break}}}break}}if(l!==null){d=l.length;f=Ce.group;if(f!==void 0){p=Ce.tokenTypeIdx;y=this.createTokenInstance(l,I,p,Ce.tokenType,ae,de,d);this.handlePayload(y,u);if(f===false){X=this.addToken(J,X,y)}else{L[f].push(y)}}e=this.chopInput(e,d);I=I+d;de=this.computeNewColumn(de,d);if(w===true&&Ce.canLineTerminator===true){let Re=0;let j;let R;g.lastIndex=0;do{j=g.test(l);if(j===true){R=g.lastIndex-1;Re++}}while(j===true);if(Re!==0){ae=ae+Re;de=d-R;this.updateTokenEndLineColumnLocation(y,f,R,Re,ae,de,d)}}this.handleModes(Ce,kt,bt,y)}else{const Re=I;const j=ae;const R=de;let S=Nt===false;while(S===false&&I<C){e=this.chopInput(e,1);I++;for(i=0;i<b;i++){const B=M[i];const A=B.pattern;const fe=B.short;if(fe!==false){if(E.charCodeAt(I)===fe){S=true}}else if(B.isCustom===true){S=A.exec(E,I,J,L)!==null}else{this.updateLastIndex(A,I);S=A.exec(e)!==null}if(S===true){break}}}v=I-Re;de=this.computeNewColumn(de,v);k=this.config.errorMessageProvider.buildUnexpectedCharactersMessage(E,Re,v,j,R);ne.push({offset:Re,line:j,column:R,length:v,message:k});if(Nt===false){break}}}if(!this.hasCustom){J.length=X}return{tokens:J,groups:L,errors:ne}}handleModes(e,n,r,i){if(e.pop===true){const a=e.push;n(i);if(a!==void 0){r.call(this,a)}}else if(e.push!==void 0){r.call(this,e.push)}}chopInput(e,n){return e.substring(n)}updateLastIndex(e,n){e.lastIndex=n}updateTokenEndLineColumnLocation(e,n,r,i,a,s,o){let l,u;if(n!==void 0){l=r===o-1;u=l?-1:0;if(!(i===1&&l===true)){e.endLine=a+u;e.endColumn=s-1+-u}}}computeNewColumn(e,n){return e+n}createOffsetOnlyToken(e,n,r,i){return{image:e,startOffset:n,tokenTypeIdx:r,tokenType:i}}createStartOnlyToken(e,n,r,i,a,s){return{image:e,startOffset:n,startLine:a,startColumn:s,tokenTypeIdx:r,tokenType:i}}createFullToken(e,n,r,i,a,s,o){return{image:e,startOffset:n,endOffset:n+o-1,startLine:a,endLine:a,startColumn:s,endColumn:s+o-1,tokenTypeIdx:r,tokenType:i}}addTokenUsingPush(e,n,r){e.push(r);return n}addTokenUsingMemberAccess(e,n,r){e[n]=r;n++;return n}handlePayloadNoCustom(e,n){}handlePayloadWithCustom(e,n){if(n!==null){e.payload=n}}matchWithTest(e,n,r){const i=e.test(n);if(i===true){return n.substring(r,e.lastIndex)}return null}matchWithExec(e,n){const r=e.exec(n);return r!==null?r[0]:null}}ot.SKIPPED="This marks a skipped Token pattern, this means each token identified by it willbe consumed and then thrown into oblivion, this can be used to for example to completely ignore whitespace.";ot.NA=/NOT_APPLICABLE/;function jr(t){if(IR(t)){return t.LABEL}else{return t.name}}function IR(t){return wt(t.LABEL)&&t.LABEL!==""}const qk="parent";const Bm="categories";const Wm="label";const Vm="group";const zm="push_mode";const Ym="pop_mode";const Xm="longer_alt";const Jm="line_breaks";const Qm="start_chars_hint";function rr(t){return jk(t)}function jk(t){const e=t.pattern;const n={};n.name=t.name;if(!Fn(e)){n.PATTERN=e}if(Q(t,qk)){throw"The parent property is no longer supported.\nSee: https://github.com/chevrotain/chevrotain/issues/564#issuecomment-349062346 for details."}if(Q(t,Bm)){n.CATEGORIES=t[Bm]}us([n]);if(Q(t,Wm)){n.LABEL=t[Wm]}if(Q(t,Vm)){n.GROUP=t[Vm]}if(Q(t,Ym)){n.POP_MODE=t[Ym]}if(Q(t,zm)){n.PUSH_MODE=t[zm]}if(Q(t,Xm)){n.LONGER_ALT=t[Xm]}if(Q(t,Jm)){n.LINE_BREAKS=t[Jm]}if(Q(t,Qm)){n.START_CHARS_HINT=t[Qm]}return n}const Zn=rr({name:"EOF",pattern:ot.NA});us([Zn]);function xp(t,e,n,r,i,a,s,o){return{image:e,startOffset:n,endOffset:r,startLine:i,endLine:a,startColumn:s,endColumn:o,tokenTypeIdx:t.tokenTypeIdx,tokenType:t}}function LR(t,e){return ls(t,e)}const Hr={buildMismatchTokenMessage({expected:t,actual:e,previous:n,ruleName:r}){const i=IR(t);const a=i?`--> ${jr(t)} <--`:`token of type --> ${t.name} <--`;const s=`Expecting ${a} but found --> '${e.image}' <--`;return s},buildNotAllInputParsedMessage({firstRedundant:t,ruleName:e}){return"Redundant input, expecting EOF but found: "+t.image},buildNoViableAltMessage({expectedPathsPerAlt:t,actual:e,previous:n,customUserDescription:r,ruleName:i}){const a="Expecting: ";const s=Zt(e).image;const o="\nbut found: '"+s+"'";if(r){return a+r+o}else{const l=gt(t,(f,p)=>f.concat(p),[]);const u=H(l,f=>`[${H(f,p=>jr(p)).join(", ")}]`);const c=H(u,(f,p)=>`  ${p+1}. ${f}`);const d=`one of these possible Token sequences:
${c.join("\n")}`;return a+d+o}},buildEarlyExitMessage({expectedIterationPaths:t,actual:e,customUserDescription:n,ruleName:r}){const i="Expecting: ";const a=Zt(e).image;const s="\nbut found: '"+a+"'";if(n){return i+n+s}else{const o=H(t,u=>`[${H(u,c=>jr(c)).join(",")}]`);const l=`expecting at least one iteration which starts with one of these possible Token sequences::
  <${o.join(" ,")}>`;return i+l+s}}};Object.freeze(Hr);const Bk={buildRuleNotFoundError(t,e){const n="Invalid grammar, reference to a rule which is not defined: ->"+e.nonTerminalName+"<-\ninside top level rule: ->"+t.name+"<-";return n}};const Rr={buildDuplicateFoundError(t,e){function n(c){if(c instanceof Ee){return c.terminalType.name}else if(c instanceof Rt){return c.nonTerminalName}else{return""}}const r=t.name;const i=Zt(e);const a=i.idx;const s=sn(i);const o=n(i);const l=a>0;let u=`->${s}${l?a:""}<- ${o?`with argument: ->${o}<-`:""}
                  appears more than once (${e.length} times) in the top level rule: ->${r}<-.                  
                  For further details see: https://chevrotain.io/docs/FAQ.html#NUMERICAL_SUFFIXES 
                  `;u=u.replace(/[ \t]+/g," ");u=u.replace(/\s\s+/g,"\n");return u},buildNamespaceConflictError(t){const e=`Namespace conflict found in grammar.
The grammar has both a Terminal(Token) and a Non-Terminal(Rule) named: <${t.name}>.
To resolve this make sure each Terminal and Non-Terminal names are unique
This is easy to accomplish by using the convention that Terminal names start with an uppercase letter
and Non-Terminal names start with a lower case letter.`;return e},buildAlternationPrefixAmbiguityError(t){const e=H(t.prefixPath,i=>jr(i)).join(", ");const n=t.alternation.idx===0?"":t.alternation.idx;const r=`Ambiguous alternatives: <${t.ambiguityIndices.join(" ,")}> due to common lookahead prefix
in <OR${n}> inside <${t.topLevelRule.name}> Rule,
<${e}> may appears as a prefix path in all these alternatives.
See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#COMMON_PREFIX
For Further details.`;return r},buildAlternationAmbiguityError(t){const e=H(t.prefixPath,i=>jr(i)).join(", ");const n=t.alternation.idx===0?"":t.alternation.idx;let r=`Ambiguous Alternatives Detected: <${t.ambiguityIndices.join(" ,")}> in <OR${n}> inside <${t.topLevelRule.name}> Rule,
<${e}> may appears as a prefix path in all these alternatives.
`;r=r+`See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#AMBIGUOUS_ALTERNATIVES
For Further details.`;return r},buildEmptyRepetitionError(t){let e=sn(t.repetition);if(t.repetition.idx!==0){e+=t.repetition.idx}const n=`The repetition <${e}> within Rule <${t.topLevelRule.name}> can never consume any tokens.
This could lead to an infinite loop.`;return n},buildTokenNameError(t){return"deprecated"},buildEmptyAlternationError(t){const e=`Ambiguous empty alternative: <${t.emptyChoiceIdx+1}> in <OR${t.alternation.idx}> inside <${t.topLevelRule.name}> Rule.
Only the last alternative may be an empty alternative.`;return e},buildTooManyAlternativesError(t){const e=`An Alternation cannot have more than 256 alternatives:
<OR${t.alternation.idx}> inside <${t.topLevelRule.name}> Rule.
 has ${t.alternation.definition.length+1} alternatives.`;return e},buildLeftRecursionError(t){const e=t.topLevelRule.name;const n=H(t.leftRecursionPath,a=>a.name);const r=`${e} --> ${n.concat([e]).join(" --> ")}`;const i=`Left Recursion found in grammar.
rule: <${e}> can be invoked from itself (directly or indirectly)
without consuming any Tokens. The grammar path that causes this is: 
 ${r}
 To fix this refactor your grammar to remove the left recursion.
see: https://en.wikipedia.org/wiki/LL_parser#Left_factoring.`;return i},buildInvalidRuleNameError(t){return"deprecated"},buildDuplicateRuleNameError(t){let e;if(t.topLevelRule instanceof ni){e=t.topLevelRule.name}else{e=t.topLevelRule}const n=`Duplicate definition, rule: ->${e}<- is already defined in the grammar: ->${t.grammarName}<-`;return n}};function Wk(t,e){const n=new Vk(t,e);n.resolveRefs();return n.errors}class Vk extends ri{constructor(e,n){super();this.nameToTopRule=e;this.errMsgProvider=n;this.errors=[]}resolveRefs(){Y(ze(this.nameToTopRule),e=>{this.currTopLevel=e;e.accept(this)})}visitNonTerminal(e){const n=this.nameToTopRule[e.nonTerminalName];if(!n){const r=this.errMsgProvider.buildRuleNotFoundError(this.currTopLevel,e);this.errors.push({message:r,type:vt.UNRESOLVED_SUBRULE_REF,ruleName:this.currTopLevel.name,unresolvedRefName:e.nonTerminalName})}else{e.referencedRule=n}}}class zk extends ic{constructor(e,n){super();this.topProd=e;this.path=n;this.possibleTokTypes=[];this.nextProductionName="";this.nextProductionOccurrence=0;this.found=false;this.isAtEndOfPath=false}startWalking(){this.found=false;if(this.path.ruleStack[0]!==this.topProd.name){throw Error("The path does not start with the walker's top Rule!")}this.ruleStack=at(this.path.ruleStack).reverse();this.occurrenceStack=at(this.path.occurrenceStack).reverse();this.ruleStack.pop();this.occurrenceStack.pop();this.updateExpectedNext();this.walk(this.topProd);return this.possibleTokTypes}walk(e,n=[]){if(!this.found){super.walk(e,n)}}walkProdRef(e,n,r){if(e.referencedRule.name===this.nextProductionName&&e.idx===this.nextProductionOccurrence){const i=n.concat(r);this.updateExpectedNext();this.walk(e.referencedRule,i)}}updateExpectedNext(){if(ge(this.ruleStack)){this.nextProductionName="";this.nextProductionOccurrence=0;this.isAtEndOfPath=true}else{this.nextProductionName=this.ruleStack.pop();this.nextProductionOccurrence=this.occurrenceStack.pop()}}}class Yk extends zk{constructor(e,n){super(e,n);this.path=n;this.nextTerminalName="";this.nextTerminalOccurrence=0;this.nextTerminalName=this.path.lastTok.name;this.nextTerminalOccurrence=this.path.lastTokOccurrence}walkTerminal(e,n,r){if(this.isAtEndOfPath&&e.terminalType.name===this.nextTerminalName&&e.idx===this.nextTerminalOccurrence&&!this.found){const i=n.concat(r);const a=new Ct({definition:i});this.possibleTokTypes=os(a);this.found=true}}}class sc extends ic{constructor(e,n){super();this.topRule=e;this.occurrence=n;this.result={token:void 0,occurrence:void 0,isEndOfRule:void 0}}startWalking(){this.walk(this.topRule);return this.result}}class Xk extends sc{walkMany(e,n,r){if(e.idx===this.occurrence){const i=Zt(n.concat(r));this.result.isEndOfRule=i===void 0;if(i instanceof Ee){this.result.token=i.terminalType;this.result.occurrence=i.idx}}else{super.walkMany(e,n,r)}}}class Zm extends sc{walkManySep(e,n,r){if(e.idx===this.occurrence){const i=Zt(n.concat(r));this.result.isEndOfRule=i===void 0;if(i instanceof Ee){this.result.token=i.terminalType;this.result.occurrence=i.idx}}else{super.walkManySep(e,n,r)}}}class Jk extends sc{walkAtLeastOne(e,n,r){if(e.idx===this.occurrence){const i=Zt(n.concat(r));this.result.isEndOfRule=i===void 0;if(i instanceof Ee){this.result.token=i.terminalType;this.result.occurrence=i.idx}}else{super.walkAtLeastOne(e,n,r)}}}class eh extends sc{walkAtLeastOneSep(e,n,r){if(e.idx===this.occurrence){const i=Zt(n.concat(r));this.result.isEndOfRule=i===void 0;if(i instanceof Ee){this.result.token=i.terminalType;this.result.occurrence=i.idx}}else{super.walkAtLeastOneSep(e,n,r)}}}function zd(t,e,n=[]){n=at(n);let r=[];let i=0;function a(o){return o.concat(et(t,i+1))}function s(o){const l=zd(a(o),e,n);return r.concat(l)}while(n.length<e&&i<t.length){const o=t[i];if(o instanceof Ct){return s(o.definition)}else if(o instanceof Rt){return s(o.definition)}else if(o instanceof it){r=s(o.definition)}else if(o instanceof Kt){const l=o.definition.concat([new De({definition:o.definition})]);return s(l)}else if(o instanceof Ft){const l=[new Ct({definition:o.definition}),new De({definition:[new Ee({terminalType:o.separator})].concat(o.definition)})];return s(l)}else if(o instanceof At){const l=o.definition.concat([new De({definition:[new Ee({terminalType:o.separator})].concat(o.definition)})]);r=s(l)}else if(o instanceof De){const l=o.definition.concat([new De({definition:o.definition})]);r=s(l)}else if(o instanceof St){Y(o.definition,l=>{if(ge(l.definition)===false){r=s(l.definition)}});return r}else if(o instanceof Ee){n.push(o.terminalType)}else{throw Error("non exhaustive match")}i++}r.push({partialPath:n,suffixDef:et(t,i)});return r}function xR(t,e,n,r){const i="EXIT_NONE_TERMINAL";const a=[i];const s="EXIT_ALTERNATIVE";let o=false;const l=e.length;const u=l-r-1;const c=[];const d=[];d.push({idx:-1,def:t,ruleStack:[],occurrenceStack:[]});while(!ge(d)){const f=d.pop();if(f===s){if(o&&Vr(d).idx<=u){d.pop()}continue}const p=f.def;const y=f.idx;const v=f.ruleStack;const k=f.occurrenceStack;if(ge(p)){continue}const $=p[0];if($===i){const E={idx:y,def:et(p),ruleStack:Ga(v),occurrenceStack:Ga(k)};d.push(E)}else if($ instanceof Ee){if(y<l-1){const E=y+1;const C=e[E];if(n(C,$.terminalType)){const I={idx:E,def:et(p),ruleStack:v,occurrenceStack:k};d.push(I)}}else if(y===l-1){c.push({nextTokenType:$.terminalType,nextTokenOccurrence:$.idx,ruleStack:v,occurrenceStack:k});o=true}else{throw Error("non exhaustive match")}}else if($ instanceof Rt){const E=at(v);E.push($.nonTerminalName);const C=at(k);C.push($.idx);const I={idx:y,def:$.definition.concat(a,et(p)),ruleStack:E,occurrenceStack:C};d.push(I)}else if($ instanceof it){const E={idx:y,def:et(p),ruleStack:v,occurrenceStack:k};d.push(E);d.push(s);const C={idx:y,def:$.definition.concat(et(p)),ruleStack:v,occurrenceStack:k};d.push(C)}else if($ instanceof Kt){const E=new De({definition:$.definition,idx:$.idx});const C=$.definition.concat([E],et(p));const I={idx:y,def:C,ruleStack:v,occurrenceStack:k};d.push(I)}else if($ instanceof Ft){const E=new Ee({terminalType:$.separator});const C=new De({definition:[E].concat($.definition),idx:$.idx});const I=$.definition.concat([C],et(p));const X={idx:y,def:I,ruleStack:v,occurrenceStack:k};d.push(X)}else if($ instanceof At){const E={idx:y,def:et(p),ruleStack:v,occurrenceStack:k};d.push(E);d.push(s);const C=new Ee({terminalType:$.separator});const I=new De({definition:[C].concat($.definition),idx:$.idx});const X=$.definition.concat([I],et(p));const q={idx:y,def:X,ruleStack:v,occurrenceStack:k};d.push(q)}else if($ instanceof De){const E={idx:y,def:et(p),ruleStack:v,occurrenceStack:k};d.push(E);d.push(s);const C=new De({definition:$.definition,idx:$.idx});const I=$.definition.concat([C],et(p));const X={idx:y,def:I,ruleStack:v,occurrenceStack:k};d.push(X)}else if($ instanceof St){for(let E=$.definition.length-1;E>=0;E--){const C=$.definition[E];const I={idx:y,def:C.definition.concat(et(p)),ruleStack:v,occurrenceStack:k};d.push(I);d.push(s)}}else if($ instanceof Ct){d.push({idx:y,def:$.definition.concat(et(p)),ruleStack:v,occurrenceStack:k})}else if($ instanceof ni){d.push(Qk($,y,v,k))}else{throw Error("non exhaustive match")}}return c}function Qk(t,e,n,r){const i=at(n);i.push(t.name);const a=at(r);a.push(1);return{idx:e,def:t.definition,ruleStack:i,occurrenceStack:a}}var ke;(function(t){t[t["OPTION"]=0]="OPTION";t[t["REPETITION"]=1]="REPETITION";t[t["REPETITION_MANDATORY"]=2]="REPETITION_MANDATORY";t[t["REPETITION_MANDATORY_WITH_SEPARATOR"]=3]="REPETITION_MANDATORY_WITH_SEPARATOR";t[t["REPETITION_WITH_SEPARATOR"]=4]="REPETITION_WITH_SEPARATOR";t[t["ALTERNATION"]=5]="ALTERNATION"})(ke||(ke={}));function Mp(t){if(t instanceof it||t==="Option"){return ke.OPTION}else if(t instanceof De||t==="Repetition"){return ke.REPETITION}else if(t instanceof Kt||t==="RepetitionMandatory"){return ke.REPETITION_MANDATORY}else if(t instanceof Ft||t==="RepetitionMandatoryWithSeparator"){return ke.REPETITION_MANDATORY_WITH_SEPARATOR}else if(t instanceof At||t==="RepetitionWithSeparator"){return ke.REPETITION_WITH_SEPARATOR}else if(t instanceof St||t==="Alternation"){return ke.ALTERNATION}else{throw Error("non exhaustive match")}}function th(t){const{occurrence:e,rule:n,prodType:r,maxLookahead:i}=t;const a=Mp(r);if(a===ke.ALTERNATION){return oc(e,n,i)}else{return lc(e,n,a,i)}}function Zk(t,e,n,r,i,a){const s=oc(t,e,n);const o=FR(s)?Ru:ls;return a(s,r,o,i)}function eb(t,e,n,r,i,a){const s=lc(t,e,i,n);const o=FR(s)?Ru:ls;return a(s[0],o,r)}function tb(t,e,n,r){const i=t.length;const a=Xt(t,s=>{return Xt(s,o=>{return o.length===1})});if(e){return function(s){const o=H(s,l=>l.GATE);for(let l=0;l<i;l++){const u=t[l];const c=u.length;const d=o[l];if(d!==void 0&&d.call(this)===false){continue}e:for(let f=0;f<c;f++){const p=u[f];const y=p.length;for(let v=0;v<y;v++){const k=this.LA(v+1);if(n(k,p[v])===false){continue e}}return l}}return void 0}}else if(a&&!r){const s=H(t,l=>{return jt(l)});const o=gt(s,(l,u,c)=>{Y(u,d=>{if(!Q(l,d.tokenTypeIdx)){l[d.tokenTypeIdx]=c}Y(d.categoryMatches,f=>{if(!Q(l,f)){l[f]=c}})});return l},{});return function(){const l=this.LA(1);return o[l.tokenTypeIdx]}}else{return function(){for(let s=0;s<i;s++){const o=t[s];const l=o.length;e:for(let u=0;u<l;u++){const c=o[u];const d=c.length;for(let f=0;f<d;f++){const p=this.LA(f+1);if(n(p,c[f])===false){continue e}}return s}}return void 0}}}function nb(t,e,n){const r=Xt(t,a=>{return a.length===1});const i=t.length;if(r&&!n){const a=jt(t);if(a.length===1&&ge(a[0].categoryMatches)){const s=a[0];const o=s.tokenTypeIdx;return function(){return this.LA(1).tokenTypeIdx===o}}else{const s=gt(a,(o,l,u)=>{o[l.tokenTypeIdx]=true;Y(l.categoryMatches,c=>{o[c]=true});return o},[]);return function(){const o=this.LA(1);return s[o.tokenTypeIdx]===true}}}else{return function(){e:for(let a=0;a<i;a++){const s=t[a];const o=s.length;for(let l=0;l<o;l++){const u=this.LA(l+1);if(e(u,s[l])===false){continue e}}return true}return false}}}class rb extends ic{constructor(e,n,r){super();this.topProd=e;this.targetOccurrence=n;this.targetProdType=r}startWalking(){this.walk(this.topProd);return this.restDef}checkIsTarget(e,n,r,i){if(e.idx===this.targetOccurrence&&this.targetProdType===n){this.restDef=r.concat(i);return true}return false}walkOption(e,n,r){if(!this.checkIsTarget(e,ke.OPTION,n,r)){super.walkOption(e,n,r)}}walkAtLeastOne(e,n,r){if(!this.checkIsTarget(e,ke.REPETITION_MANDATORY,n,r)){super.walkOption(e,n,r)}}walkAtLeastOneSep(e,n,r){if(!this.checkIsTarget(e,ke.REPETITION_MANDATORY_WITH_SEPARATOR,n,r)){super.walkOption(e,n,r)}}walkMany(e,n,r){if(!this.checkIsTarget(e,ke.REPETITION,n,r)){super.walkOption(e,n,r)}}walkManySep(e,n,r){if(!this.checkIsTarget(e,ke.REPETITION_WITH_SEPARATOR,n,r)){super.walkOption(e,n,r)}}}class MR extends ri{constructor(e,n,r){super();this.targetOccurrence=e;this.targetProdType=n;this.targetRef=r;this.result=[]}checkIsTarget(e,n){if(e.idx===this.targetOccurrence&&this.targetProdType===n&&(this.targetRef===void 0||e===this.targetRef)){this.result=e.definition}}visitOption(e){this.checkIsTarget(e,ke.OPTION)}visitRepetition(e){this.checkIsTarget(e,ke.REPETITION)}visitRepetitionMandatory(e){this.checkIsTarget(e,ke.REPETITION_MANDATORY)}visitRepetitionMandatoryWithSeparator(e){this.checkIsTarget(e,ke.REPETITION_MANDATORY_WITH_SEPARATOR)}visitRepetitionWithSeparator(e){this.checkIsTarget(e,ke.REPETITION_WITH_SEPARATOR)}visitAlternation(e){this.checkIsTarget(e,ke.ALTERNATION)}}function nh(t){const e=new Array(t);for(let n=0;n<t;n++){e[n]=[]}return e}function wc(t){let e=[""];for(let n=0;n<t.length;n++){const r=t[n];const i=[];for(let a=0;a<e.length;a++){const s=e[a];i.push(s+"_"+r.tokenTypeIdx);for(let o=0;o<r.categoryMatches.length;o++){const l="_"+r.categoryMatches[o];i.push(s+l)}}e=i}return e}function ib(t,e,n){for(let r=0;r<t.length;r++){if(r===n){continue}const i=t[r];for(let a=0;a<e.length;a++){const s=e[a];if(i[s]===true){return false}}}return true}function KR(t,e){const n=H(t,s=>zd([s],1));const r=nh(n.length);const i=H(n,s=>{const o={};Y(s,l=>{const u=wc(l.partialPath);Y(u,c=>{o[c]=true})});return o});let a=n;for(let s=1;s<=e;s++){const o=a;a=nh(o.length);for(let l=0;l<o.length;l++){const u=o[l];for(let c=0;c<u.length;c++){const d=u[c].partialPath;const f=u[c].suffixDef;const p=wc(d);const y=ib(i,p,l);if(y||ge(f)||d.length===e){const v=r[l];if(Yd(v,d)===false){v.push(d);for(let k=0;k<p.length;k++){const $=p[k];i[l][$]=true}}}else{const v=zd(f,s+1,d);a[l]=a[l].concat(v);Y(v,k=>{const $=wc(k.partialPath);Y($,E=>{i[l][E]=true})})}}}}return r}function oc(t,e,n,r){const i=new MR(t,ke.ALTERNATION,r);e.accept(i);return KR(i.result,n)}function lc(t,e,n,r){const i=new MR(t,n);e.accept(i);const a=i.result;const s=new rb(e,t,n);const o=s.startWalking();const l=new Ct({definition:a});const u=new Ct({definition:o});return KR([l,u],r)}function Yd(t,e){e:for(let n=0;n<t.length;n++){const r=t[n];if(r.length!==e.length){continue}for(let i=0;i<r.length;i++){const a=e[i];const s=r[i];const o=a===s||s.categoryMatchesMap[a.tokenTypeIdx]!==void 0;if(o===false){continue e}}return true}return false}function ab(t,e){return t.length<e.length&&Xt(t,(n,r)=>{const i=e[r];return n===i||i.categoryMatchesMap[n.tokenTypeIdx]})}function FR(t){return Xt(t,e=>Xt(e,n=>Xt(n,r=>ge(r.categoryMatches))))}function sb(t){const e=t.lookaheadStrategy.validate({rules:t.rules,tokenTypes:t.tokenTypes,grammarName:t.grammarName});return H(e,n=>Object.assign({type:vt.CUSTOM_LOOKAHEAD_VALIDATION},n))}function ob(t,e,n,r){const i=Lt(t,l=>lb(l,n));const a=$b(t,e,n);const s=Lt(t,l=>yb(l,n));const o=Lt(t,l=>db(l,t,r,n));return i.concat(a,s,o)}function lb(t,e){const n=new cb;t.accept(n);const r=n.allProductions;const i=CS(r,ub);const a=tn(i,o=>{return o.length>1});const s=H(ze(a),o=>{const l=Zt(o);const u=e.buildDuplicateFoundError(t,o);const c=sn(l);const d={message:u,type:vt.DUPLICATE_PRODUCTIONS,ruleName:t.name,dslName:c,occurrence:l.idx};const f=UR(l);if(f){d.parameter=f}return d});return s}function ub(t){return`${sn(t)}_#_${t.idx}_#_${UR(t)}`}function UR(t){if(t instanceof Ee){return t.terminalType.name}else if(t instanceof Rt){return t.nonTerminalName}else{return""}}class cb extends ri{constructor(){super(...arguments);this.allProductions=[]}visitNonTerminal(e){this.allProductions.push(e)}visitOption(e){this.allProductions.push(e)}visitRepetitionWithSeparator(e){this.allProductions.push(e)}visitRepetitionMandatory(e){this.allProductions.push(e)}visitRepetitionMandatoryWithSeparator(e){this.allProductions.push(e)}visitRepetition(e){this.allProductions.push(e)}visitAlternation(e){this.allProductions.push(e)}visitTerminal(e){this.allProductions.push(e)}}function db(t,e,n,r){const i=[];const a=gt(e,(s,o)=>{if(o.name===t.name){return s+1}return s},0);if(a>1){const s=r.buildDuplicateRuleNameError({topLevelRule:t,grammarName:n});i.push({message:s,type:vt.DUPLICATE_RULE_NAME,ruleName:t.name})}return i}function fb(t,e,n){const r=[];let i;if(!$t(e,t)){i=`Invalid rule override, rule: ->${t}<- cannot be overridden in the grammar: ->${n}<-as it is not defined in any of the super grammars `;r.push({message:i,type:vt.INVALID_RULE_OVERRIDE,ruleName:t})}return r}function GR(t,e,n,r=[]){const i=[];const a=Yl(e.definition);if(ge(a)){return[]}else{const s=t.name;const o=$t(a,t);if(o){i.push({message:n.buildLeftRecursionError({topLevelRule:t,leftRecursionPath:r}),type:vt.LEFT_RECURSION,ruleName:s})}const l=nc(a,r.concat([t]));const u=Lt(l,c=>{const d=at(r);d.push(c);return GR(t,c,n,d)});return i.concat(u)}}function Yl(t){let e=[];if(ge(t)){return e}const n=Zt(t);if(n instanceof Rt){e.push(n.referencedRule)}else if(n instanceof Ct||n instanceof it||n instanceof Kt||n instanceof Ft||n instanceof At||n instanceof De){e=e.concat(Yl(n.definition))}else if(n instanceof St){e=jt(H(n.definition,a=>Yl(a.definition)))}else if(n instanceof Ee);else{throw Error("non exhaustive match")}const r=yu(n);const i=t.length>1;if(r&&i){const a=et(t);return e.concat(Yl(a))}else{return e}}class Kp extends ri{constructor(){super(...arguments);this.alternations=[]}visitAlternation(e){this.alternations.push(e)}}function pb(t,e){const n=new Kp;t.accept(n);const r=n.alternations;const i=Lt(r,a=>{const s=Ga(a.definition);return Lt(s,(o,l)=>{const u=xR([o],[],ls,1);if(ge(u)){return[{message:e.buildEmptyAlternationError({topLevelRule:t,alternation:a,emptyChoiceIdx:l}),type:vt.NONE_LAST_EMPTY_ALT,ruleName:t.name,occurrence:a.idx,alternative:l+1}]}else{return[]}})});return i}function mb(t,e,n){const r=new Kp;t.accept(r);let i=r.alternations;i=rc(i,s=>s.ignoreAmbiguities===true);const a=Lt(i,s=>{const o=s.idx;const l=s.maxLookahead||e;const u=oc(o,t,l,s);const c=Rb(u,s,t,n);const d=vb(u,s,t,n);return c.concat(d)});return a}class hb extends ri{constructor(){super(...arguments);this.allProductions=[]}visitRepetitionWithSeparator(e){this.allProductions.push(e)}visitRepetitionMandatory(e){this.allProductions.push(e)}visitRepetitionMandatoryWithSeparator(e){this.allProductions.push(e)}visitRepetition(e){this.allProductions.push(e)}}function yb(t,e){const n=new Kp;t.accept(n);const r=n.alternations;const i=Lt(r,a=>{if(a.definition.length>255){return[{message:e.buildTooManyAlternativesError({topLevelRule:t,alternation:a}),type:vt.TOO_MANY_ALTS,ruleName:t.name,occurrence:a.idx}]}else{return[]}});return i}function gb(t,e,n){const r=[];Y(t,i=>{const a=new hb;i.accept(a);const s=a.allProductions;Y(s,o=>{const l=Mp(o);const u=o.maxLookahead||e;const c=o.idx;const d=lc(c,i,l,u);const f=d[0];if(ge(jt(f))){const p=n.buildEmptyRepetitionError({topLevelRule:i,repetition:o});r.push({message:p,type:vt.NO_NON_EMPTY_LOOKAHEAD,ruleName:i.name})}})});return r}function Rb(t,e,n,r){const i=[];const a=gt(t,(o,l,u)=>{if(e.definition[u].ignoreAmbiguities===true){return o}Y(l,c=>{const d=[u];Y(t,(f,p)=>{if(u!==p&&Yd(f,c)&&e.definition[p].ignoreAmbiguities!==true){d.push(p)}});if(d.length>1&&!Yd(i,c)){i.push(c);o.push({alts:d,path:c})}});return o},[]);const s=H(a,o=>{const l=H(o.alts,c=>c+1);const u=r.buildAlternationAmbiguityError({topLevelRule:n,alternation:e,ambiguityIndices:l,prefixPath:o.path});return{message:u,type:vt.AMBIGUOUS_ALTS,ruleName:n.name,occurrence:e.idx,alternatives:o.alts}});return s}function vb(t,e,n,r){const i=gt(t,(s,o,l)=>{const u=H(o,c=>{return{idx:l,path:c}});return s.concat(u)},[]);const a=ss(Lt(i,s=>{const o=e.definition[s.idx];if(o.ignoreAmbiguities===true){return[]}const l=s.idx;const u=s.path;const c=Mt(i,f=>{return e.definition[f.idx].ignoreAmbiguities!==true&&f.idx<l&&ab(f.path,u)});const d=H(c,f=>{const p=[f.idx+1,l+1];const y=e.idx===0?"":e.idx;const v=r.buildAlternationPrefixAmbiguityError({topLevelRule:n,alternation:e,ambiguityIndices:p,prefixPath:f.path});return{message:v,type:vt.AMBIGUOUS_PREFIX_ALTS,ruleName:n.name,occurrence:y,alternatives:p}});return d}));return a}function $b(t,e,n){const r=[];const i=H(e,a=>a.name);Y(t,a=>{const s=a.name;if($t(i,s)){const o=n.buildNamespaceConflictError(a);r.push({message:o,type:vt.CONFLICT_TOKENS_RULES_NAMESPACE,ruleName:s})}});return r}function Tb(t){const e=Op(t,{errMsgProvider:Bk});const n={};Y(t.rules,r=>{n[r.name]=r});return Wk(n,e.errMsgProvider)}function Eb(t){t=Op(t,{errMsgProvider:Rr});return ob(t.rules,t.tokenTypes,t.errMsgProvider,t.grammarName)}const HR="MismatchedTokenException";const qR="NoViableAltException";const jR="EarlyExitException";const BR="NotAllInputParsedException";const WR=[HR,qR,jR,BR];Object.freeze(WR);function vu(t){return $t(WR,t.name)}class uc extends Error{constructor(e,n){super(e);this.token=n;this.resyncedTokens=[];Object.setPrototypeOf(this,new.target.prototype);if(Error.captureStackTrace){Error.captureStackTrace(this,this.constructor)}}}class VR extends uc{constructor(e,n,r){super(e,n);this.previousToken=r;this.name=HR}}class wb extends uc{constructor(e,n,r){super(e,n);this.previousToken=r;this.name=qR}}class Cb extends uc{constructor(e,n){super(e,n);this.name=BR}}class Ab extends uc{constructor(e,n,r){super(e,n);this.previousToken=r;this.name=jR}}const Cc={};const zR="InRuleRecoveryException";class Sb extends Error{constructor(e){super(e);this.name=zR}}class kb{initRecoverable(e){this.firstAfterRepMap={};this.resyncFollows={};this.recoveryEnabled=Q(e,"recoveryEnabled")?e.recoveryEnabled:Un.recoveryEnabled;if(this.recoveryEnabled){this.attemptInRepetitionRecovery=bb}}getTokenToInsert(e){const n=xp(e,"",NaN,NaN,NaN,NaN,NaN,NaN);n.isInsertedInRecovery=true;return n}canTokenTypeBeInsertedInRecovery(e){return true}canTokenTypeBeDeletedInRecovery(e){return true}tryInRepetitionRecovery(e,n,r,i){const a=this.findReSyncTokenType();const s=this.exportLexerState();const o=[];let l=false;const u=this.LA(1);let c=this.LA(1);const d=()=>{const f=this.LA(0);const p=this.errorMessageProvider.buildMismatchTokenMessage({expected:i,actual:u,previous:f,ruleName:this.getCurrRuleFullName()});const y=new VR(p,u,this.LA(0));y.resyncedTokens=Ga(o);this.SAVE_ERROR(y)};while(!l){if(this.tokenMatcher(c,i)){d();return}else if(r.call(this)){d();e.apply(this,n);return}else if(this.tokenMatcher(c,a)){l=true}else{c=this.SKIP_TOKEN();this.addToResyncTokens(c,o)}}this.importLexerState(s)}shouldInRepetitionRecoveryBeTried(e,n,r){if(r===false){return false}if(this.tokenMatcher(this.LA(1),e)){return false}if(this.isBackTracking()){return false}if(this.canPerformInRuleRecovery(e,this.getFollowsForInRuleRecovery(e,n))){return false}return true}getFollowsForInRuleRecovery(e,n){const r=this.getCurrentGrammarPath(e,n);const i=this.getNextPossibleTokenTypes(r);return i}tryInRuleRecovery(e,n){if(this.canRecoverWithSingleTokenInsertion(e,n)){const r=this.getTokenToInsert(e);return r}if(this.canRecoverWithSingleTokenDeletion(e)){const r=this.SKIP_TOKEN();this.consumeToken();return r}throw new Sb("sad sad panda")}canPerformInRuleRecovery(e,n){return this.canRecoverWithSingleTokenInsertion(e,n)||this.canRecoverWithSingleTokenDeletion(e)}canRecoverWithSingleTokenInsertion(e,n){if(!this.canTokenTypeBeInsertedInRecovery(e)){return false}if(ge(n)){return false}const r=this.LA(1);const i=zr(n,a=>{return this.tokenMatcher(r,a)})!==void 0;return i}canRecoverWithSingleTokenDeletion(e){if(!this.canTokenTypeBeDeletedInRecovery(e)){return false}const n=this.tokenMatcher(this.LA(2),e);return n}isInCurrentRuleReSyncSet(e){const n=this.getCurrFollowKey();const r=this.getFollowSetFromFollowKey(n);return $t(r,e)}findReSyncTokenType(){const e=this.flattenFollowSet();let n=this.LA(1);let r=2;while(true){const i=zr(e,a=>{const s=LR(n,a);return s});if(i!==void 0){return i}n=this.LA(r);r++}}getCurrFollowKey(){if(this.RULE_STACK.length===1){return Cc}const e=this.getLastExplicitRuleShortName();const n=this.getLastExplicitRuleOccurrenceIndex();const r=this.getPreviousExplicitRuleShortName();return{ruleName:this.shortRuleNameToFullName(e),idxInCallingRule:n,inRule:this.shortRuleNameToFullName(r)}}buildFullFollowKeyStack(){const e=this.RULE_STACK;const n=this.RULE_OCCURRENCE_STACK;return H(e,(r,i)=>{if(i===0){return Cc}return{ruleName:this.shortRuleNameToFullName(r),idxInCallingRule:n[i],inRule:this.shortRuleNameToFullName(e[i-1])}})}flattenFollowSet(){const e=H(this.buildFullFollowKeyStack(),n=>{return this.getFollowSetFromFollowKey(n)});return jt(e)}getFollowSetFromFollowKey(e){if(e===Cc){return[Zn]}const n=e.ruleName+e.idxInCallingRule+AR+e.inRule;return this.resyncFollows[n]}addToResyncTokens(e,n){if(!this.tokenMatcher(e,Zn)){n.push(e)}return n}reSyncTo(e){const n=[];let r=this.LA(1);while(this.tokenMatcher(r,e)===false){r=this.SKIP_TOKEN();this.addToResyncTokens(r,n)}return Ga(n)}attemptInRepetitionRecovery(e,n,r,i,a,s,o){}getCurrentGrammarPath(e,n){const r=this.getHumanReadableRuleStack();const i=at(this.RULE_OCCURRENCE_STACK);const a={ruleStack:r,occurrenceStack:i,lastTok:e,lastTokOccurrence:n};return a}getHumanReadableRuleStack(){return H(this.RULE_STACK,e=>this.shortRuleNameToFullName(e))}}function bb(t,e,n,r,i,a,s){const o=this.getKeyForAutomaticLookahead(r,i);let l=this.firstAfterRepMap[o];if(l===void 0){const f=this.getCurrRuleFullName();const p=this.getGAstProductions()[f];const y=new a(p,i);l=y.startWalking();this.firstAfterRepMap[o]=l}let u=l.token;let c=l.occurrence;const d=l.isEndOfRule;if(this.RULE_STACK.length===1&&d&&u===void 0){u=Zn;c=1}if(u===void 0||c===void 0){return}if(this.shouldInRepetitionRecoveryBeTried(u,c,s)){this.tryInRepetitionRecovery(t,e,n,u)}}const Nb=4;const ir=8;const YR=1<<ir;const XR=2<<ir;const Xd=3<<ir;const Jd=4<<ir;const Qd=5<<ir;const Xl=6<<ir;function Ac(t,e,n){return n|e|t}class Fp{constructor(e){var n;this.maxLookahead=(n=e===null||e===void 0?void 0:e.maxLookahead)!==null&&n!==void 0?n:Un.maxLookahead}validate(e){const n=this.validateNoLeftRecursion(e.rules);if(ge(n)){const r=this.validateEmptyOrAlternatives(e.rules);const i=this.validateAmbiguousAlternationAlternatives(e.rules,this.maxLookahead);const a=this.validateSomeNonEmptyLookaheadPath(e.rules,this.maxLookahead);const s=[...n,...r,...i,...a];return s}return n}validateNoLeftRecursion(e){return Lt(e,n=>GR(n,n,Rr))}validateEmptyOrAlternatives(e){return Lt(e,n=>pb(n,Rr))}validateAmbiguousAlternationAlternatives(e,n){return Lt(e,r=>mb(r,n,Rr))}validateSomeNonEmptyLookaheadPath(e,n){return gb(e,n,Rr)}buildLookaheadForAlternation(e){return Zk(e.prodOccurrence,e.rule,e.maxLookahead,e.hasPredicates,e.dynamicTokensEnabled,tb)}buildLookaheadForOptional(e){return eb(e.prodOccurrence,e.rule,e.maxLookahead,e.dynamicTokensEnabled,Mp(e.prodType),nb)}}class Pb{initLooksAhead(e){this.dynamicTokensEnabled=Q(e,"dynamicTokensEnabled")?e.dynamicTokensEnabled:Un.dynamicTokensEnabled;this.maxLookahead=Q(e,"maxLookahead")?e.maxLookahead:Un.maxLookahead;this.lookaheadStrategy=Q(e,"lookaheadStrategy")?e.lookaheadStrategy:new Fp({maxLookahead:this.maxLookahead});this.lookAheadFuncsCache=new Map}preComputeLookaheadFunctions(e){Y(e,n=>{this.TRACE_INIT(`${n.name} Rule Lookahead`,()=>{const{alternation:r,repetition:i,option:a,repetitionMandatory:s,repetitionMandatoryWithSeparator:o,repetitionWithSeparator:l}=Db(n);Y(r,u=>{const c=u.idx===0?"":u.idx;this.TRACE_INIT(`${sn(u)}${c}`,()=>{const d=this.lookaheadStrategy.buildLookaheadForAlternation({prodOccurrence:u.idx,rule:n,maxLookahead:u.maxLookahead||this.maxLookahead,hasPredicates:u.hasPredicates,dynamicTokensEnabled:this.dynamicTokensEnabled});const f=Ac(this.fullRuleNameToShort[n.name],YR,u.idx);this.setLaFuncCache(f,d)})});Y(i,u=>{this.computeLookaheadFunc(n,u.idx,Xd,"Repetition",u.maxLookahead,sn(u))});Y(a,u=>{this.computeLookaheadFunc(n,u.idx,XR,"Option",u.maxLookahead,sn(u))});Y(s,u=>{this.computeLookaheadFunc(n,u.idx,Jd,"RepetitionMandatory",u.maxLookahead,sn(u))});Y(o,u=>{this.computeLookaheadFunc(n,u.idx,Xl,"RepetitionMandatoryWithSeparator",u.maxLookahead,sn(u))});Y(l,u=>{this.computeLookaheadFunc(n,u.idx,Qd,"RepetitionWithSeparator",u.maxLookahead,sn(u))})})})}computeLookaheadFunc(e,n,r,i,a,s){this.TRACE_INIT(`${s}${n===0?"":n}`,()=>{const o=this.lookaheadStrategy.buildLookaheadForOptional({prodOccurrence:n,rule:e,maxLookahead:a||this.maxLookahead,dynamicTokensEnabled:this.dynamicTokensEnabled,prodType:i});const l=Ac(this.fullRuleNameToShort[e.name],r,n);this.setLaFuncCache(l,o)})}getKeyForAutomaticLookahead(e,n){const r=this.getLastExplicitRuleShortName();return Ac(r,e,n)}getLaFuncFromCache(e){return this.lookAheadFuncsCache.get(e)}setLaFuncCache(e,n){this.lookAheadFuncsCache.set(e,n)}}class _b extends ri{constructor(){super(...arguments);this.dslMethods={option:[],alternation:[],repetition:[],repetitionWithSeparator:[],repetitionMandatory:[],repetitionMandatoryWithSeparator:[]}}reset(){this.dslMethods={option:[],alternation:[],repetition:[],repetitionWithSeparator:[],repetitionMandatory:[],repetitionMandatoryWithSeparator:[]}}visitOption(e){this.dslMethods.option.push(e)}visitRepetitionWithSeparator(e){this.dslMethods.repetitionWithSeparator.push(e)}visitRepetitionMandatory(e){this.dslMethods.repetitionMandatory.push(e)}visitRepetitionMandatoryWithSeparator(e){this.dslMethods.repetitionMandatoryWithSeparator.push(e)}visitRepetition(e){this.dslMethods.repetition.push(e)}visitAlternation(e){this.dslMethods.alternation.push(e)}}const Gs=new _b;function Db(t){Gs.reset();t.accept(Gs);const e=Gs.dslMethods;Gs.reset();return e}function rh(t,e){if(isNaN(t.startOffset)===true){t.startOffset=e.startOffset;t.endOffset=e.endOffset}else if(t.endOffset<e.endOffset===true){t.endOffset=e.endOffset}}function ih(t,e){if(isNaN(t.startOffset)===true){t.startOffset=e.startOffset;t.startColumn=e.startColumn;t.startLine=e.startLine;t.endOffset=e.endOffset;t.endColumn=e.endColumn;t.endLine=e.endLine}else if(t.endOffset<e.endOffset===true){t.endOffset=e.endOffset;t.endColumn=e.endColumn;t.endLine=e.endLine}}function Ob(t,e,n){if(t.children[n]===void 0){t.children[n]=[e]}else{t.children[n].push(e)}}function Ib(t,e,n){if(t.children[e]===void 0){t.children[e]=[n]}else{t.children[e].push(n)}}const Lb="name";function JR(t,e){Object.defineProperty(t,Lb,{enumerable:false,configurable:true,writable:false,value:e})}function xb(t,e){const n=Vt(t);const r=n.length;for(let i=0;i<r;i++){const a=n[i];const s=t[a];const o=s.length;for(let l=0;l<o;l++){const u=s[l];if(u.tokenTypeIdx===void 0){this[u.name](u.children,e)}}}}function Mb(t,e){const n=function(){};JR(n,t+"BaseSemantics");const r={visit:function(i,a){if(le(i)){i=i[0]}if(Fn(i)){return void 0}return this[i.name](i.children,a)},validateVisitor:function(){const i=Fb(this,e);if(!ge(i)){const a=H(i,s=>s.msg);throw Error(`Errors Detected in CST Visitor <${this.constructor.name}>:
	${a.join("\n\n").replace(/\n/g,"\n	")}`)}}};n.prototype=r;n.prototype.constructor=n;n._RULE_NAMES=e;return n}function Kb(t,e,n){const r=function(){};JR(r,t+"BaseSemanticsWithDefaults");const i=Object.create(n.prototype);Y(e,a=>{i[a]=xb});r.prototype=i;r.prototype.constructor=r;return r}var Zd;(function(t){t[t["REDUNDANT_METHOD"]=0]="REDUNDANT_METHOD";t[t["MISSING_METHOD"]=1]="MISSING_METHOD"})(Zd||(Zd={}));function Fb(t,e){const n=Ub(t,e);return n}function Ub(t,e){const n=Mt(e,i=>{return Hn(t[i])===false});const r=H(n,i=>{return{msg:`Missing visitor method: <${i}> on ${t.constructor.name} CST Visitor.`,type:Zd.MISSING_METHOD,methodName:i}});return ss(r)}class Gb{initTreeBuilder(e){this.CST_STACK=[];this.outputCst=e.outputCst;this.nodeLocationTracking=Q(e,"nodeLocationTracking")?e.nodeLocationTracking:Un.nodeLocationTracking;if(!this.outputCst){this.cstInvocationStateUpdate=Ve;this.cstFinallyStateUpdate=Ve;this.cstPostTerminal=Ve;this.cstPostNonTerminal=Ve;this.cstPostRule=Ve}else{if(/full/i.test(this.nodeLocationTracking)){if(this.recoveryEnabled){this.setNodeLocationFromToken=ih;this.setNodeLocationFromNode=ih;this.cstPostRule=Ve;this.setInitialNodeLocation=this.setInitialNodeLocationFullRecovery}else{this.setNodeLocationFromToken=Ve;this.setNodeLocationFromNode=Ve;this.cstPostRule=this.cstPostRuleFull;this.setInitialNodeLocation=this.setInitialNodeLocationFullRegular}}else if(/onlyOffset/i.test(this.nodeLocationTracking)){if(this.recoveryEnabled){this.setNodeLocationFromToken=rh;this.setNodeLocationFromNode=rh;this.cstPostRule=Ve;this.setInitialNodeLocation=this.setInitialNodeLocationOnlyOffsetRecovery}else{this.setNodeLocationFromToken=Ve;this.setNodeLocationFromNode=Ve;this.cstPostRule=this.cstPostRuleOnlyOffset;this.setInitialNodeLocation=this.setInitialNodeLocationOnlyOffsetRegular}}else if(/none/i.test(this.nodeLocationTracking)){this.setNodeLocationFromToken=Ve;this.setNodeLocationFromNode=Ve;this.cstPostRule=Ve;this.setInitialNodeLocation=Ve}else{throw Error(`Invalid <nodeLocationTracking> config option: "${e.nodeLocationTracking}"`)}}}setInitialNodeLocationOnlyOffsetRecovery(e){e.location={startOffset:NaN,endOffset:NaN}}setInitialNodeLocationOnlyOffsetRegular(e){e.location={startOffset:this.LA(1).startOffset,endOffset:NaN}}setInitialNodeLocationFullRecovery(e){e.location={startOffset:NaN,startLine:NaN,startColumn:NaN,endOffset:NaN,endLine:NaN,endColumn:NaN}}setInitialNodeLocationFullRegular(e){const n=this.LA(1);e.location={startOffset:n.startOffset,startLine:n.startLine,startColumn:n.startColumn,endOffset:NaN,endLine:NaN,endColumn:NaN}}cstInvocationStateUpdate(e){const n={name:e,children:Object.create(null)};this.setInitialNodeLocation(n);this.CST_STACK.push(n)}cstFinallyStateUpdate(){this.CST_STACK.pop()}cstPostRuleFull(e){const n=this.LA(0);const r=e.location;if(r.startOffset<=n.startOffset===true){r.endOffset=n.endOffset;r.endLine=n.endLine;r.endColumn=n.endColumn}else{r.startOffset=NaN;r.startLine=NaN;r.startColumn=NaN}}cstPostRuleOnlyOffset(e){const n=this.LA(0);const r=e.location;if(r.startOffset<=n.startOffset===true){r.endOffset=n.endOffset}else{r.startOffset=NaN}}cstPostTerminal(e,n){const r=this.CST_STACK[this.CST_STACK.length-1];Ob(r,n,e);this.setNodeLocationFromToken(r.location,n)}cstPostNonTerminal(e,n){const r=this.CST_STACK[this.CST_STACK.length-1];Ib(r,n,e);this.setNodeLocationFromNode(r.location,e.location)}getBaseCstVisitorConstructor(){if(Fn(this.baseCstVisitorConstructor)){const e=Mb(this.className,Vt(this.gastProductionsCache));this.baseCstVisitorConstructor=e;return e}return this.baseCstVisitorConstructor}getBaseCstVisitorConstructorWithDefaults(){if(Fn(this.baseCstVisitorWithDefaultsConstructor)){const e=Kb(this.className,Vt(this.gastProductionsCache),this.getBaseCstVisitorConstructor());this.baseCstVisitorWithDefaultsConstructor=e;return e}return this.baseCstVisitorWithDefaultsConstructor}getLastExplicitRuleShortName(){const e=this.RULE_STACK;return e[e.length-1]}getPreviousExplicitRuleShortName(){const e=this.RULE_STACK;return e[e.length-2]}getLastExplicitRuleOccurrenceIndex(){const e=this.RULE_OCCURRENCE_STACK;return e[e.length-1]}}class Hb{initLexerAdapter(){this.tokVector=[];this.tokVectorLength=0;this.currIdx=-1}set input(e){if(this.selfAnalysisDone!==true){throw Error(`Missing <performSelfAnalysis> invocation at the end of the Parser's constructor.`)}this.reset();this.tokVector=e;this.tokVectorLength=e.length}get input(){return this.tokVector}SKIP_TOKEN(){if(this.currIdx<=this.tokVector.length-2){this.consumeToken();return this.LA(1)}else{return Tu}}LA(e){const n=this.currIdx+e;if(n<0||this.tokVectorLength<=n){return Tu}else{return this.tokVector[n]}}consumeToken(){this.currIdx++}exportLexerState(){return this.currIdx}importLexerState(e){this.currIdx=e}resetLexerState(){this.currIdx=-1}moveToTerminatedState(){this.currIdx=this.tokVector.length-1}getLexerPosition(){return this.exportLexerState()}}class qb{ACTION(e){return e.call(this)}consume(e,n,r){return this.consumeInternal(n,e,r)}subrule(e,n,r){return this.subruleInternal(n,e,r)}option(e,n){return this.optionInternal(n,e)}or(e,n){return this.orInternal(n,e)}many(e,n){return this.manyInternal(e,n)}atLeastOne(e,n){return this.atLeastOneInternal(e,n)}CONSUME(e,n){return this.consumeInternal(e,0,n)}CONSUME1(e,n){return this.consumeInternal(e,1,n)}CONSUME2(e,n){return this.consumeInternal(e,2,n)}CONSUME3(e,n){return this.consumeInternal(e,3,n)}CONSUME4(e,n){return this.consumeInternal(e,4,n)}CONSUME5(e,n){return this.consumeInternal(e,5,n)}CONSUME6(e,n){return this.consumeInternal(e,6,n)}CONSUME7(e,n){return this.consumeInternal(e,7,n)}CONSUME8(e,n){return this.consumeInternal(e,8,n)}CONSUME9(e,n){return this.consumeInternal(e,9,n)}SUBRULE(e,n){return this.subruleInternal(e,0,n)}SUBRULE1(e,n){return this.subruleInternal(e,1,n)}SUBRULE2(e,n){return this.subruleInternal(e,2,n)}SUBRULE3(e,n){return this.subruleInternal(e,3,n)}SUBRULE4(e,n){return this.subruleInternal(e,4,n)}SUBRULE5(e,n){return this.subruleInternal(e,5,n)}SUBRULE6(e,n){return this.subruleInternal(e,6,n)}SUBRULE7(e,n){return this.subruleInternal(e,7,n)}SUBRULE8(e,n){return this.subruleInternal(e,8,n)}SUBRULE9(e,n){return this.subruleInternal(e,9,n)}OPTION(e){return this.optionInternal(e,0)}OPTION1(e){return this.optionInternal(e,1)}OPTION2(e){return this.optionInternal(e,2)}OPTION3(e){return this.optionInternal(e,3)}OPTION4(e){return this.optionInternal(e,4)}OPTION5(e){return this.optionInternal(e,5)}OPTION6(e){return this.optionInternal(e,6)}OPTION7(e){return this.optionInternal(e,7)}OPTION8(e){return this.optionInternal(e,8)}OPTION9(e){return this.optionInternal(e,9)}OR(e){return this.orInternal(e,0)}OR1(e){return this.orInternal(e,1)}OR2(e){return this.orInternal(e,2)}OR3(e){return this.orInternal(e,3)}OR4(e){return this.orInternal(e,4)}OR5(e){return this.orInternal(e,5)}OR6(e){return this.orInternal(e,6)}OR7(e){return this.orInternal(e,7)}OR8(e){return this.orInternal(e,8)}OR9(e){return this.orInternal(e,9)}MANY(e){this.manyInternal(0,e)}MANY1(e){this.manyInternal(1,e)}MANY2(e){this.manyInternal(2,e)}MANY3(e){this.manyInternal(3,e)}MANY4(e){this.manyInternal(4,e)}MANY5(e){this.manyInternal(5,e)}MANY6(e){this.manyInternal(6,e)}MANY7(e){this.manyInternal(7,e)}MANY8(e){this.manyInternal(8,e)}MANY9(e){this.manyInternal(9,e)}MANY_SEP(e){this.manySepFirstInternal(0,e)}MANY_SEP1(e){this.manySepFirstInternal(1,e)}MANY_SEP2(e){this.manySepFirstInternal(2,e)}MANY_SEP3(e){this.manySepFirstInternal(3,e)}MANY_SEP4(e){this.manySepFirstInternal(4,e)}MANY_SEP5(e){this.manySepFirstInternal(5,e)}MANY_SEP6(e){this.manySepFirstInternal(6,e)}MANY_SEP7(e){this.manySepFirstInternal(7,e)}MANY_SEP8(e){this.manySepFirstInternal(8,e)}MANY_SEP9(e){this.manySepFirstInternal(9,e)}AT_LEAST_ONE(e){this.atLeastOneInternal(0,e)}AT_LEAST_ONE1(e){return this.atLeastOneInternal(1,e)}AT_LEAST_ONE2(e){this.atLeastOneInternal(2,e)}AT_LEAST_ONE3(e){this.atLeastOneInternal(3,e)}AT_LEAST_ONE4(e){this.atLeastOneInternal(4,e)}AT_LEAST_ONE5(e){this.atLeastOneInternal(5,e)}AT_LEAST_ONE6(e){this.atLeastOneInternal(6,e)}AT_LEAST_ONE7(e){this.atLeastOneInternal(7,e)}AT_LEAST_ONE8(e){this.atLeastOneInternal(8,e)}AT_LEAST_ONE9(e){this.atLeastOneInternal(9,e)}AT_LEAST_ONE_SEP(e){this.atLeastOneSepFirstInternal(0,e)}AT_LEAST_ONE_SEP1(e){this.atLeastOneSepFirstInternal(1,e)}AT_LEAST_ONE_SEP2(e){this.atLeastOneSepFirstInternal(2,e)}AT_LEAST_ONE_SEP3(e){this.atLeastOneSepFirstInternal(3,e)}AT_LEAST_ONE_SEP4(e){this.atLeastOneSepFirstInternal(4,e)}AT_LEAST_ONE_SEP5(e){this.atLeastOneSepFirstInternal(5,e)}AT_LEAST_ONE_SEP6(e){this.atLeastOneSepFirstInternal(6,e)}AT_LEAST_ONE_SEP7(e){this.atLeastOneSepFirstInternal(7,e)}AT_LEAST_ONE_SEP8(e){this.atLeastOneSepFirstInternal(8,e)}AT_LEAST_ONE_SEP9(e){this.atLeastOneSepFirstInternal(9,e)}RULE(e,n,r=Eu){if($t(this.definedRulesNames,e)){const a=Rr.buildDuplicateRuleNameError({topLevelRule:e,grammarName:this.className});const s={message:a,type:vt.DUPLICATE_RULE_NAME,ruleName:e};this.definitionErrors.push(s)}this.definedRulesNames.push(e);const i=this.defineRule(e,n,r);this[e]=i;return i}OVERRIDE_RULE(e,n,r=Eu){const i=fb(e,this.definedRulesNames,this.className);this.definitionErrors=this.definitionErrors.concat(i);const a=this.defineRule(e,n,r);this[e]=a;return a}BACKTRACK(e,n){return function(){this.isBackTrackingStack.push(1);const r=this.saveRecogState();try{e.apply(this,n);return true}catch(i){if(vu(i)){return false}else{throw i}}finally{this.reloadRecogState(r);this.isBackTrackingStack.pop()}}}getGAstProductions(){return this.gastProductionsCache}getSerializedGastProductions(){return QS(ze(this.gastProductionsCache))}}class jb{initRecognizerEngine(e,n){this.className=this.constructor.name;this.shortRuleNameToFull={};this.fullRuleNameToShort={};this.ruleShortNameIdx=256;this.tokenMatcher=Ru;this.subruleIdx=0;this.definedRulesNames=[];this.tokensMap={};this.isBackTrackingStack=[];this.RULE_STACK=[];this.RULE_OCCURRENCE_STACK=[];this.gastProductionsCache={};if(Q(n,"serializedGrammar")){throw Error("The Parser's configuration can no longer contain a <serializedGrammar> property.\n	See: https://chevrotain.io/docs/changes/BREAKING_CHANGES.html#_6-0-0\n	For Further details.")}if(le(e)){if(ge(e)){throw Error("A Token Vocabulary cannot be empty.\n	Note that the first argument for the parser constructor\n	is no longer a Token vector (since v4.0).")}if(typeof e[0].startOffset==="number"){throw Error("The Parser constructor no longer accepts a token vector as the first argument.\n	See: https://chevrotain.io/docs/changes/BREAKING_CHANGES.html#_4-0-0\n	For Further details.")}}if(le(e)){this.tokensMap=gt(e,(a,s)=>{a[s.name]=s;return a},{})}else if(Q(e,"modes")&&Xt(jt(ze(e.modes)),Hk)){const a=jt(ze(e.modes));const s=Ip(a);this.tokensMap=gt(s,(o,l)=>{o[l.name]=l;return o},{})}else if(Wt(e)){this.tokensMap=at(e)}else{throw new Error("<tokensDictionary> argument must be An Array of Token constructors, A dictionary of Token constructors or an IMultiModeLexerDefinition")}this.tokensMap["EOF"]=Zn;const r=Q(e,"modes")?jt(ze(e.modes)):ze(e);const i=Xt(r,a=>ge(a.categoryMatches));this.tokenMatcher=i?Ru:ls;us(ze(this.tokensMap))}defineRule(e,n,r){if(this.selfAnalysisDone){throw Error(`Grammar rule <${e}> may not be defined after the 'performSelfAnalysis' method has been called'
Make sure that all grammar rule definitions are done before 'performSelfAnalysis' is called.`)}const i=Q(r,"resyncEnabled")?r.resyncEnabled:Eu.resyncEnabled;const a=Q(r,"recoveryValueFunc")?r.recoveryValueFunc:Eu.recoveryValueFunc;const s=this.ruleShortNameIdx<<Nb+ir;this.ruleShortNameIdx++;this.shortRuleNameToFull[s]=e;this.fullRuleNameToShort[e]=s;let o;if(this.outputCst===true){o=function u(...c){try{this.ruleInvocationStateUpdate(s,e,this.subruleIdx);n.apply(this,c);const d=this.CST_STACK[this.CST_STACK.length-1];this.cstPostRule(d);return d}catch(d){return this.invokeRuleCatch(d,i,a)}finally{this.ruleFinallyStateUpdate()}}}else{o=function u(...c){try{this.ruleInvocationStateUpdate(s,e,this.subruleIdx);return n.apply(this,c)}catch(d){return this.invokeRuleCatch(d,i,a)}finally{this.ruleFinallyStateUpdate()}}}const l=Object.assign(o,{ruleName:e,originalGrammarAction:n});return l}invokeRuleCatch(e,n,r){const i=this.RULE_STACK.length===1;const a=n&&!this.isBackTracking()&&this.recoveryEnabled;if(vu(e)){const s=e;if(a){const o=this.findReSyncTokenType();if(this.isInCurrentRuleReSyncSet(o)){s.resyncedTokens=this.reSyncTo(o);if(this.outputCst){const l=this.CST_STACK[this.CST_STACK.length-1];l.recoveredNode=true;return l}else{return r(e)}}else{if(this.outputCst){const l=this.CST_STACK[this.CST_STACK.length-1];l.recoveredNode=true;s.partialCstResult=l}throw s}}else if(i){this.moveToTerminatedState();return r(e)}else{throw s}}else{throw e}}optionInternal(e,n){const r=this.getKeyForAutomaticLookahead(XR,n);return this.optionInternalLogic(e,n,r)}optionInternalLogic(e,n,r){let i=this.getLaFuncFromCache(r);let a;if(typeof e!=="function"){a=e.DEF;const s=e.GATE;if(s!==void 0){const o=i;i=()=>{return s.call(this)&&o.call(this)}}}else{a=e}if(i.call(this)===true){return a.call(this)}return void 0}atLeastOneInternal(e,n){const r=this.getKeyForAutomaticLookahead(Jd,e);return this.atLeastOneInternalLogic(e,n,r)}atLeastOneInternalLogic(e,n,r){let i=this.getLaFuncFromCache(r);let a;if(typeof n!=="function"){a=n.DEF;const s=n.GATE;if(s!==void 0){const o=i;i=()=>{return s.call(this)&&o.call(this)}}}else{a=n}if(i.call(this)===true){let s=this.doSingleRepetition(a);while(i.call(this)===true&&s===true){s=this.doSingleRepetition(a)}}else{throw this.raiseEarlyExitException(e,ke.REPETITION_MANDATORY,n.ERR_MSG)}this.attemptInRepetitionRecovery(this.atLeastOneInternal,[e,n],i,Jd,e,Jk)}atLeastOneSepFirstInternal(e,n){const r=this.getKeyForAutomaticLookahead(Xl,e);this.atLeastOneSepFirstInternalLogic(e,n,r)}atLeastOneSepFirstInternalLogic(e,n,r){const i=n.DEF;const a=n.SEP;const s=this.getLaFuncFromCache(r);if(s.call(this)===true){i.call(this);const o=()=>{return this.tokenMatcher(this.LA(1),a)};while(this.tokenMatcher(this.LA(1),a)===true){this.CONSUME(a);i.call(this)}this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal,[e,a,o,i,eh],o,Xl,e,eh)}else{throw this.raiseEarlyExitException(e,ke.REPETITION_MANDATORY_WITH_SEPARATOR,n.ERR_MSG)}}manyInternal(e,n){const r=this.getKeyForAutomaticLookahead(Xd,e);return this.manyInternalLogic(e,n,r)}manyInternalLogic(e,n,r){let i=this.getLaFuncFromCache(r);let a;if(typeof n!=="function"){a=n.DEF;const o=n.GATE;if(o!==void 0){const l=i;i=()=>{return o.call(this)&&l.call(this)}}}else{a=n}let s=true;while(i.call(this)===true&&s===true){s=this.doSingleRepetition(a)}this.attemptInRepetitionRecovery(this.manyInternal,[e,n],i,Xd,e,Xk,s)}manySepFirstInternal(e,n){const r=this.getKeyForAutomaticLookahead(Qd,e);this.manySepFirstInternalLogic(e,n,r)}manySepFirstInternalLogic(e,n,r){const i=n.DEF;const a=n.SEP;const s=this.getLaFuncFromCache(r);if(s.call(this)===true){i.call(this);const o=()=>{return this.tokenMatcher(this.LA(1),a)};while(this.tokenMatcher(this.LA(1),a)===true){this.CONSUME(a);i.call(this)}this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal,[e,a,o,i,Zm],o,Qd,e,Zm)}}repetitionSepSecondInternal(e,n,r,i,a){while(r()){this.CONSUME(n);i.call(this)}this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal,[e,n,r,i,a],r,Xl,e,a)}doSingleRepetition(e){const n=this.getLexerPosition();e.call(this);const r=this.getLexerPosition();return r>n}orInternal(e,n){const r=this.getKeyForAutomaticLookahead(YR,n);const i=le(e)?e:e.DEF;const a=this.getLaFuncFromCache(r);const s=a.call(this,i);if(s!==void 0){const o=i[s];return o.ALT.call(this)}this.raiseNoAltException(n,e.ERR_MSG)}ruleFinallyStateUpdate(){this.RULE_STACK.pop();this.RULE_OCCURRENCE_STACK.pop();this.cstFinallyStateUpdate();if(this.RULE_STACK.length===0&&this.isAtEndOfInput()===false){const e=this.LA(1);const n=this.errorMessageProvider.buildNotAllInputParsedMessage({firstRedundant:e,ruleName:this.getCurrRuleFullName()});this.SAVE_ERROR(new Cb(n,e))}}subruleInternal(e,n,r){let i;try{const a=r!==void 0?r.ARGS:void 0;this.subruleIdx=n;i=e.apply(this,a);this.cstPostNonTerminal(i,r!==void 0&&r.LABEL!==void 0?r.LABEL:e.ruleName);return i}catch(a){throw this.subruleInternalError(a,r,e.ruleName)}}subruleInternalError(e,n,r){if(vu(e)&&e.partialCstResult!==void 0){this.cstPostNonTerminal(e.partialCstResult,n!==void 0&&n.LABEL!==void 0?n.LABEL:r);delete e.partialCstResult}throw e}consumeInternal(e,n,r){let i;try{const a=this.LA(1);if(this.tokenMatcher(a,e)===true){this.consumeToken();i=a}else{this.consumeInternalError(e,a,r)}}catch(a){i=this.consumeInternalRecovery(e,n,a)}this.cstPostTerminal(r!==void 0&&r.LABEL!==void 0?r.LABEL:e.name,i);return i}consumeInternalError(e,n,r){let i;const a=this.LA(0);if(r!==void 0&&r.ERR_MSG){i=r.ERR_MSG}else{i=this.errorMessageProvider.buildMismatchTokenMessage({expected:e,actual:n,previous:a,ruleName:this.getCurrRuleFullName()})}throw this.SAVE_ERROR(new VR(i,n,a))}consumeInternalRecovery(e,n,r){if(this.recoveryEnabled&&r.name==="MismatchedTokenException"&&!this.isBackTracking()){const i=this.getFollowsForInRuleRecovery(e,n);try{return this.tryInRuleRecovery(e,i)}catch(a){if(a.name===zR){throw r}else{throw a}}}else{throw r}}saveRecogState(){const e=this.errors;const n=at(this.RULE_STACK);return{errors:e,lexerState:this.exportLexerState(),RULE_STACK:n,CST_STACK:this.CST_STACK}}reloadRecogState(e){this.errors=e.errors;this.importLexerState(e.lexerState);this.RULE_STACK=e.RULE_STACK}ruleInvocationStateUpdate(e,n,r){this.RULE_OCCURRENCE_STACK.push(r);this.RULE_STACK.push(e);this.cstInvocationStateUpdate(n)}isBackTracking(){return this.isBackTrackingStack.length!==0}getCurrRuleFullName(){const e=this.getLastExplicitRuleShortName();return this.shortRuleNameToFull[e]}shortRuleNameToFullName(e){return this.shortRuleNameToFull[e]}isAtEndOfInput(){return this.tokenMatcher(this.LA(1),Zn)}reset(){this.resetLexerState();this.subruleIdx=0;this.isBackTrackingStack=[];this.errors=[];this.RULE_STACK=[];this.CST_STACK=[];this.RULE_OCCURRENCE_STACK=[]}}class Bb{initErrorHandler(e){this._errors=[];this.errorMessageProvider=Q(e,"errorMessageProvider")?e.errorMessageProvider:Un.errorMessageProvider}SAVE_ERROR(e){if(vu(e)){e.context={ruleStack:this.getHumanReadableRuleStack(),ruleOccurrenceStack:at(this.RULE_OCCURRENCE_STACK)};this._errors.push(e);return e}else{throw Error("Trying to save an Error which is not a RecognitionException")}}get errors(){return at(this._errors)}set errors(e){this._errors=e}raiseEarlyExitException(e,n,r){const i=this.getCurrRuleFullName();const a=this.getGAstProductions()[i];const s=lc(e,a,n,this.maxLookahead);const o=s[0];const l=[];for(let c=1;c<=this.maxLookahead;c++){l.push(this.LA(c))}const u=this.errorMessageProvider.buildEarlyExitMessage({expectedIterationPaths:o,actual:l,previous:this.LA(0),customUserDescription:r,ruleName:i});throw this.SAVE_ERROR(new Ab(u,this.LA(1),this.LA(0)))}raiseNoAltException(e,n){const r=this.getCurrRuleFullName();const i=this.getGAstProductions()[r];const a=oc(e,i,this.maxLookahead);const s=[];for(let u=1;u<=this.maxLookahead;u++){s.push(this.LA(u))}const o=this.LA(0);const l=this.errorMessageProvider.buildNoViableAltMessage({expectedPathsPerAlt:a,actual:s,previous:o,customUserDescription:n,ruleName:this.getCurrRuleFullName()});throw this.SAVE_ERROR(new wb(l,this.LA(1),o))}}class Wb{initContentAssist(){}computeContentAssist(e,n){const r=this.gastProductionsCache[e];if(Fn(r)){throw Error(`Rule ->${e}<- does not exist in this grammar.`)}return xR([r],n,this.tokenMatcher,this.maxLookahead)}getNextPossibleTokenTypes(e){const n=Zt(e.ruleStack);const r=this.getGAstProductions();const i=r[n];const a=new Yk(i,e).startWalking();return a}}const cc={description:"This Object indicates the Parser is during Recording Phase"};Object.freeze(cc);const ah=true;const sh=Math.pow(2,ir)-1;const QR=rr({name:"RECORDING_PHASE_TOKEN",pattern:ot.NA});us([QR]);const ZR=xp(QR,"This IToken indicates the Parser is in Recording Phase\n	See: https://chevrotain.io/docs/guide/internals.html#grammar-recording for details",-1,-1,-1,-1,-1,-1);Object.freeze(ZR);const Vb={name:"This CSTNode indicates the Parser is in Recording Phase\n	See: https://chevrotain.io/docs/guide/internals.html#grammar-recording for details",children:{}};class zb{initGastRecorder(e){this.recordingProdStack=[];this.RECORDING_PHASE=false}enableRecording(){this.RECORDING_PHASE=true;this.TRACE_INIT("Enable Recording",()=>{for(let e=0;e<10;e++){const n=e>0?e:"";this[`CONSUME${n}`]=function(r,i){return this.consumeInternalRecord(r,e,i)};this[`SUBRULE${n}`]=function(r,i){return this.subruleInternalRecord(r,e,i)};this[`OPTION${n}`]=function(r){return this.optionInternalRecord(r,e)};this[`OR${n}`]=function(r){return this.orInternalRecord(r,e)};this[`MANY${n}`]=function(r){this.manyInternalRecord(e,r)};this[`MANY_SEP${n}`]=function(r){this.manySepFirstInternalRecord(e,r)};this[`AT_LEAST_ONE${n}`]=function(r){this.atLeastOneInternalRecord(e,r)};this[`AT_LEAST_ONE_SEP${n}`]=function(r){this.atLeastOneSepFirstInternalRecord(e,r)}}this[`consume`]=function(e,n,r){return this.consumeInternalRecord(n,e,r)};this[`subrule`]=function(e,n,r){return this.subruleInternalRecord(n,e,r)};this[`option`]=function(e,n){return this.optionInternalRecord(n,e)};this[`or`]=function(e,n){return this.orInternalRecord(n,e)};this[`many`]=function(e,n){this.manyInternalRecord(e,n)};this[`atLeastOne`]=function(e,n){this.atLeastOneInternalRecord(e,n)};this.ACTION=this.ACTION_RECORD;this.BACKTRACK=this.BACKTRACK_RECORD;this.LA=this.LA_RECORD})}disableRecording(){this.RECORDING_PHASE=false;this.TRACE_INIT("Deleting Recording methods",()=>{const e=this;for(let n=0;n<10;n++){const r=n>0?n:"";delete e[`CONSUME${r}`];delete e[`SUBRULE${r}`];delete e[`OPTION${r}`];delete e[`OR${r}`];delete e[`MANY${r}`];delete e[`MANY_SEP${r}`];delete e[`AT_LEAST_ONE${r}`];delete e[`AT_LEAST_ONE_SEP${r}`]}delete e[`consume`];delete e[`subrule`];delete e[`option`];delete e[`or`];delete e[`many`];delete e[`atLeastOne`];delete e.ACTION;delete e.BACKTRACK;delete e.LA})}ACTION_RECORD(e){}BACKTRACK_RECORD(e,n){return()=>true}LA_RECORD(e){return Tu}topLevelRuleRecord(e,n){try{const r=new ni({definition:[],name:e});r.name=e;this.recordingProdStack.push(r);n.call(this);this.recordingProdStack.pop();return r}catch(r){if(r.KNOWN_RECORDER_ERROR!==true){try{r.message=r.message+'\n	 This error was thrown during the "grammar recording phase" For more info see:\n	https://chevrotain.io/docs/guide/internals.html#grammar-recording'}catch(i){throw r}}throw r}}optionInternalRecord(e,n){return ci.call(this,it,e,n)}atLeastOneInternalRecord(e,n){ci.call(this,Kt,n,e)}atLeastOneSepFirstInternalRecord(e,n){ci.call(this,Ft,n,e,ah)}manyInternalRecord(e,n){ci.call(this,De,n,e)}manySepFirstInternalRecord(e,n){ci.call(this,At,n,e,ah)}orInternalRecord(e,n){return Yb.call(this,e,n)}subruleInternalRecord(e,n,r){$u(n);if(!e||Q(e,"ruleName")===false){const o=new Error(`<SUBRULE${oh(n)}> argument is invalid expecting a Parser method reference but got: <${JSON.stringify(e)}>
 inside top level rule: <${this.recordingProdStack[0].name}>`);o.KNOWN_RECORDER_ERROR=true;throw o}const i=Vr(this.recordingProdStack);const a=e.ruleName;const s=new Rt({idx:n,nonTerminalName:a,label:r===null||r===void 0?void 0:r.LABEL,referencedRule:void 0});i.definition.push(s);return this.outputCst?Vb:cc}consumeInternalRecord(e,n,r){$u(n);if(!OR(e)){const s=new Error(`<CONSUME${oh(n)}> argument is invalid expecting a TokenType reference but got: <${JSON.stringify(e)}>
 inside top level rule: <${this.recordingProdStack[0].name}>`);s.KNOWN_RECORDER_ERROR=true;throw s}const i=Vr(this.recordingProdStack);const a=new Ee({idx:n,terminalType:e,label:r===null||r===void 0?void 0:r.LABEL});i.definition.push(a);return ZR}}function ci(t,e,n,r=false){$u(n);const i=Vr(this.recordingProdStack);const a=Hn(e)?e:e.DEF;const s=new t({definition:[],idx:n});if(r){s.separator=e.SEP}if(Q(e,"MAX_LOOKAHEAD")){s.maxLookahead=e.MAX_LOOKAHEAD}this.recordingProdStack.push(s);a.call(this);i.definition.push(s);this.recordingProdStack.pop();return cc}function Yb(t,e){$u(e);const n=Vr(this.recordingProdStack);const r=le(t)===false;const i=r===false?t:t.DEF;const a=new St({definition:[],idx:e,ignoreAmbiguities:r&&t.IGNORE_AMBIGUITIES===true});if(Q(t,"MAX_LOOKAHEAD")){a.maxLookahead=t.MAX_LOOKAHEAD}const s=$R(i,o=>Hn(o.GATE));a.hasPredicates=s;n.definition.push(a);Y(i,o=>{const l=new Ct({definition:[]});a.definition.push(l);if(Q(o,"IGNORE_AMBIGUITIES")){l.ignoreAmbiguities=o.IGNORE_AMBIGUITIES}else if(Q(o,"GATE")){l.ignoreAmbiguities=true}this.recordingProdStack.push(l);o.ALT.call(this);this.recordingProdStack.pop()});return cc}function oh(t){return t===0?"":`${t}`}function $u(t){if(t<0||t>sh){const e=new Error(`Invalid DSL Method idx value: <${t}>
	Idx value must be a none negative value smaller than ${sh+1}`);e.KNOWN_RECORDER_ERROR=true;throw e}}class Xb{initPerformanceTracer(e){if(Q(e,"traceInitPerf")){const n=e.traceInitPerf;const r=typeof n==="number";this.traceInitMaxIdent=r?n:Infinity;this.traceInitPerf=r?n>0:n}else{this.traceInitMaxIdent=0;this.traceInitPerf=Un.traceInitPerf}this.traceInitIndent=-1}TRACE_INIT(e,n){if(this.traceInitPerf===true){this.traceInitIndent++;const r=new Array(this.traceInitIndent+1).join("	");if(this.traceInitIndent<this.traceInitMaxIdent){console.log(`${r}--> <${e}>`)}const{time:i,value:a}=wR(n);const s=i>10?console.warn:console.log;if(this.traceInitIndent<this.traceInitMaxIdent){s(`${r}<-- <${e}> time: ${i}ms`)}this.traceInitIndent--;return a}else{return n()}}}function Jb(t,e){e.forEach(n=>{const r=n.prototype;Object.getOwnPropertyNames(r).forEach(i=>{if(i==="constructor"){return}const a=Object.getOwnPropertyDescriptor(r,i);if(a&&(a.get||a.set)){Object.defineProperty(t.prototype,i,a)}else{t.prototype[i]=n.prototype[i]}})})}const Tu=xp(Zn,"",NaN,NaN,NaN,NaN,NaN,NaN);Object.freeze(Tu);const Un=Object.freeze({recoveryEnabled:false,maxLookahead:3,dynamicTokensEnabled:false,outputCst:true,errorMessageProvider:Hr,nodeLocationTracking:"none",traceInitPerf:false,skipValidations:false});const Eu=Object.freeze({recoveryValueFunc:()=>void 0,resyncEnabled:true});var vt;(function(t){t[t["INVALID_RULE_NAME"]=0]="INVALID_RULE_NAME";t[t["DUPLICATE_RULE_NAME"]=1]="DUPLICATE_RULE_NAME";t[t["INVALID_RULE_OVERRIDE"]=2]="INVALID_RULE_OVERRIDE";t[t["DUPLICATE_PRODUCTIONS"]=3]="DUPLICATE_PRODUCTIONS";t[t["UNRESOLVED_SUBRULE_REF"]=4]="UNRESOLVED_SUBRULE_REF";t[t["LEFT_RECURSION"]=5]="LEFT_RECURSION";t[t["NONE_LAST_EMPTY_ALT"]=6]="NONE_LAST_EMPTY_ALT";t[t["AMBIGUOUS_ALTS"]=7]="AMBIGUOUS_ALTS";t[t["CONFLICT_TOKENS_RULES_NAMESPACE"]=8]="CONFLICT_TOKENS_RULES_NAMESPACE";t[t["INVALID_TOKEN_NAME"]=9]="INVALID_TOKEN_NAME";t[t["NO_NON_EMPTY_LOOKAHEAD"]=10]="NO_NON_EMPTY_LOOKAHEAD";t[t["AMBIGUOUS_PREFIX_ALTS"]=11]="AMBIGUOUS_PREFIX_ALTS";t[t["TOO_MANY_ALTS"]=12]="TOO_MANY_ALTS";t[t["CUSTOM_LOOKAHEAD_VALIDATION"]=13]="CUSTOM_LOOKAHEAD_VALIDATION"})(vt||(vt={}));function lh(t=void 0){return function(){return t}}let Up=class ev{static performSelfAnalysis(e){throw Error("The **static** `performSelfAnalysis` method has been deprecated.	\nUse the **instance** method with the same name instead.")}performSelfAnalysis(){this.TRACE_INIT("performSelfAnalysis",()=>{let e;this.selfAnalysisDone=true;const n=this.className;this.TRACE_INIT("toFastProps",()=>{CR(this)});this.TRACE_INIT("Grammar Recording",()=>{try{this.enableRecording();Y(this.definedRulesNames,i=>{const a=this[i];const s=a["originalGrammarAction"];let o;this.TRACE_INIT(`${i} Rule`,()=>{o=this.topLevelRuleRecord(i,s)});this.gastProductionsCache[i]=o})}finally{this.disableRecording()}});let r=[];this.TRACE_INIT("Grammar Resolving",()=>{r=Tb({rules:ze(this.gastProductionsCache)});this.definitionErrors=this.definitionErrors.concat(r)});this.TRACE_INIT("Grammar Validations",()=>{if(ge(r)&&this.skipValidations===false){const i=Eb({rules:ze(this.gastProductionsCache),tokenTypes:ze(this.tokensMap),errMsgProvider:Rr,grammarName:n});const a=sb({lookaheadStrategy:this.lookaheadStrategy,rules:ze(this.gastProductionsCache),tokenTypes:ze(this.tokensMap),grammarName:n});this.definitionErrors=this.definitionErrors.concat(i,a)}});if(ge(this.definitionErrors)){if(this.recoveryEnabled){this.TRACE_INIT("computeAllProdsFollows",()=>{const i=ak(ze(this.gastProductionsCache));this.resyncFollows=i})}this.TRACE_INIT("ComputeLookaheadFunctions",()=>{var i,a;(a=(i=this.lookaheadStrategy).initialize)===null||a===void 0?void 0:a.call(i,{rules:ze(this.gastProductionsCache)});this.preComputeLookaheadFunctions(ze(this.gastProductionsCache))})}if(!ev.DEFER_DEFINITION_ERRORS_HANDLING&&!ge(this.definitionErrors)){e=H(this.definitionErrors,i=>i.message);throw new Error(`Parser Definition Errors detected:
 ${e.join("\n-------------------------------\n")}`)}})}constructor(e,n){this.definitionErrors=[];this.selfAnalysisDone=false;const r=this;r.initErrorHandler(n);r.initLexerAdapter();r.initLooksAhead(n);r.initRecognizerEngine(e,n);r.initRecoverable(n);r.initTreeBuilder(n);r.initContentAssist();r.initGastRecorder(n);r.initPerformanceTracer(n);if(Q(n,"ignoredIssues")){throw new Error("The <ignoredIssues> IParserConfig property has been deprecated.\n	Please use the <IGNORE_AMBIGUITIES> flag on the relevant DSL method instead.\n	See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#IGNORING_AMBIGUITIES\n	For further details.")}this.skipValidations=Q(n,"skipValidations")?n.skipValidations:Un.skipValidations}};Up.DEFER_DEFINITION_ERRORS_HANDLING=false;Jb(Up,[kb,Pb,Gb,Hb,jb,qb,Bb,Wb,zb,Xb]);class tv extends Up{constructor(e,n=Un){const r=at(n);r.outputCst=false;super(e,r)}}function Yr(t,e,n){return`${t.name}_${e}_${n}`}const er=1;const Qb=2;const nv=4;const rv=5;const cs=7;const Zb=8;const eN=9;const tN=10;const nN=11;const iv=12;class Gp{constructor(e){this.target=e}isEpsilon(){return false}}class Hp extends Gp{constructor(e,n){super(e);this.tokenType=n}}class av extends Gp{constructor(e){super(e)}isEpsilon(){return true}}class qp extends Gp{constructor(e,n,r){super(e);this.rule=n;this.followState=r}isEpsilon(){return true}}function rN(t){const e={decisionMap:{},decisionStates:[],ruleToStartState:new Map,ruleToStopState:new Map,states:[]};iN(e,t);const n=t.length;for(let r=0;r<n;r++){const i=t[r];const a=Or(e,i,i);if(a===void 0){continue}hN(e,i,a)}return e}function iN(t,e){const n=e.length;for(let r=0;r<n;r++){const i=e[r];const a=Ye(t,i,void 0,{type:Qb});const s=Ye(t,i,void 0,{type:cs});a.stop=s;t.ruleToStartState.set(i,a);t.ruleToStopState.set(i,s)}}function sv(t,e,n){if(n instanceof Ee){return jp(t,e,n.terminalType,n)}else if(n instanceof Rt){return mN(t,e,n)}else if(n instanceof St){return uN(t,e,n)}else if(n instanceof it){return cN(t,e,n)}else if(n instanceof De){return aN(t,e,n)}else if(n instanceof At){return sN(t,e,n)}else if(n instanceof Kt){return oN(t,e,n)}else if(n instanceof Ft){return lN(t,e,n)}else{return Or(t,e,n)}}function aN(t,e,n){const r=Ye(t,e,n,{type:rv});ar(t,r);const i=ii(t,e,r,n,Or(t,e,n));return lv(t,e,n,i)}function sN(t,e,n){const r=Ye(t,e,n,{type:rv});ar(t,r);const i=ii(t,e,r,n,Or(t,e,n));const a=jp(t,e,n.separator,n);return lv(t,e,n,i,a)}function oN(t,e,n){const r=Ye(t,e,n,{type:nv});ar(t,r);const i=ii(t,e,r,n,Or(t,e,n));return ov(t,e,n,i)}function lN(t,e,n){const r=Ye(t,e,n,{type:nv});ar(t,r);const i=ii(t,e,r,n,Or(t,e,n));const a=jp(t,e,n.separator,n);return ov(t,e,n,i,a)}function uN(t,e,n){const r=Ye(t,e,n,{type:er});ar(t,r);const i=H(n.definition,s=>sv(t,e,s));const a=ii(t,e,r,n,...i);return a}function cN(t,e,n){const r=Ye(t,e,n,{type:er});ar(t,r);const i=ii(t,e,r,n,Or(t,e,n));return dN(t,e,n,i)}function Or(t,e,n){const r=Mt(H(n.definition,i=>sv(t,e,i)),i=>i!==void 0);if(r.length===1){return r[0]}else if(r.length===0){return void 0}else{return pN(t,r)}}function ov(t,e,n,r,i){const a=r.left;const s=r.right;const o=Ye(t,e,n,{type:nN});ar(t,o);const l=Ye(t,e,n,{type:iv});a.loopback=o;l.loopback=o;t.decisionMap[Yr(e,i?"RepetitionMandatoryWithSeparator":"RepetitionMandatory",n.idx)]=o;je(s,o);if(i===void 0){je(o,a);je(o,l)}else{je(o,l);je(o,i.left);je(i.right,a)}return{left:a,right:l}}function lv(t,e,n,r,i){const a=r.left;const s=r.right;const o=Ye(t,e,n,{type:tN});ar(t,o);const l=Ye(t,e,n,{type:iv});const u=Ye(t,e,n,{type:eN});o.loopback=u;l.loopback=u;je(o,a);je(o,l);je(s,u);if(i!==void 0){je(u,l);je(u,i.left);je(i.right,a)}else{je(u,o)}t.decisionMap[Yr(e,i?"RepetitionWithSeparator":"Repetition",n.idx)]=o;return{left:o,right:l}}function dN(t,e,n,r){const i=r.left;const a=r.right;je(i,a);t.decisionMap[Yr(e,"Option",n.idx)]=i;return r}function ar(t,e){t.decisionStates.push(e);e.decision=t.decisionStates.length-1;return e.decision}function ii(t,e,n,r,...i){const a=Ye(t,e,r,{type:Zb,start:n});n.end=a;for(const o of i){if(o!==void 0){je(n,o.left);je(o.right,a)}else{je(n,a)}}const s={left:n,right:a};t.decisionMap[Yr(e,fN(r),r.idx)]=n;return s}function fN(t){if(t instanceof St){return"Alternation"}else if(t instanceof it){return"Option"}else if(t instanceof De){return"Repetition"}else if(t instanceof At){return"RepetitionWithSeparator"}else if(t instanceof Kt){return"RepetitionMandatory"}else if(t instanceof Ft){return"RepetitionMandatoryWithSeparator"}else{throw new Error("Invalid production type encountered")}}function pN(t,e){const n=e.length;for(let a=0;a<n-1;a++){const s=e[a];let o;if(s.left.transitions.length===1){o=s.left.transitions[0]}const l=o instanceof qp;const u=o;const c=e[a+1].left;if(s.left.type===er&&s.right.type===er&&o!==void 0&&(l&&u.followState===s.right||o.target===s.right)){if(l){u.followState=c}else{o.target=c}yN(t,s.right)}else{je(s.right,c)}}const r=e[0];const i=e[n-1];return{left:r.left,right:i.right}}function jp(t,e,n,r){const i=Ye(t,e,r,{type:er});const a=Ye(t,e,r,{type:er});Bp(i,new Hp(a,n));return{left:i,right:a}}function mN(t,e,n){const r=n.referencedRule;const i=t.ruleToStartState.get(r);const a=Ye(t,e,n,{type:er});const s=Ye(t,e,n,{type:er});const o=new qp(i,r,s);Bp(a,o);return{left:a,right:s}}function hN(t,e,n){const r=t.ruleToStartState.get(e);je(r,n.left);const i=t.ruleToStopState.get(e);je(n.right,i);const a={left:r,right:i};return a}function je(t,e){const n=new av(e);Bp(t,n)}function Ye(t,e,n,r){const i=Object.assign({atn:t,production:n,epsilonOnlyTransitions:false,rule:e,transitions:[],nextTokenWithinRule:[],stateNumber:t.states.length},r);t.states.push(i);return i}function Bp(t,e){if(t.transitions.length===0){t.epsilonOnlyTransitions=e.isEpsilon()}t.transitions.push(e)}function yN(t,e){t.states.splice(t.states.indexOf(e),1)}const wu={};class ef{constructor(){this.map={};this.configs=[]}get size(){return this.configs.length}finalize(){this.map={}}add(e){const n=uv(e);if(!(n in this.map)){this.map[n]=this.configs.length;this.configs.push(e)}}get elements(){return this.configs}get alts(){return H(this.configs,e=>e.alt)}get key(){let e="";for(const n in this.map){e+=n+":"}return e}}function uv(t,e=true){return`${e?`a${t.alt}`:""}s${t.state.stateNumber}:${t.stack.map(n=>n.stateNumber.toString()).join("_")}`}function gN(t,e){const n={};return r=>{const i=r.toString();let a=n[i];if(a!==void 0){return a}else{a={atnStartState:t,decision:e,states:{}};n[i]=a;return a}}}class cv{constructor(){this.predicates=[]}is(e){return e>=this.predicates.length||this.predicates[e]}set(e,n){this.predicates[e]=n}toString(){let e="";const n=this.predicates.length;for(let r=0;r<n;r++){e+=this.predicates[r]===true?"1":"0"}return e}}const uh=new cv;class RN extends Fp{constructor(e){var n;super();this.logging=(n=e===null||e===void 0?void 0:e.logging)!==null&&n!==void 0?n:r=>console.log(r)}initialize(e){this.atn=rN(e.rules);this.dfas=vN(this.atn)}validateAmbiguousAlternationAlternatives(){return[]}validateEmptyOrAlternatives(){return[]}buildLookaheadForAlternation(e){const{prodOccurrence:n,rule:r,hasPredicates:i,dynamicTokensEnabled:a}=e;const s=this.dfas;const o=this.logging;const l=Yr(r,"Alternation",n);const u=this.atn.decisionMap[l];const c=u.decision;const d=H(th({maxLookahead:1,occurrence:n,prodType:"Alternation",rule:r}),f=>H(f,p=>p[0]));if(ch(d,false)&&!a){const f=gt(d,(p,y,v)=>{Y(y,k=>{if(k){p[k.tokenTypeIdx]=v;Y(k.categoryMatches,$=>{p[$]=v})}});return p},{});if(i){return function(p){var y;const v=this.LA(1);const k=f[v.tokenTypeIdx];if(p!==void 0&&k!==void 0){const $=(y=p[k])===null||y===void 0?void 0:y.GATE;if($!==void 0&&$.call(this)===false){return void 0}}return k}}else{return function(){const p=this.LA(1);return f[p.tokenTypeIdx]}}}else if(i){return function(f){const p=new cv;const y=f===void 0?0:f.length;for(let k=0;k<y;k++){const $=f===null||f===void 0?void 0:f[k].GATE;p.set(k,$===void 0||$.call(this))}const v=Sc.call(this,s,c,p,o);return typeof v==="number"?v:void 0}}else{return function(){const f=Sc.call(this,s,c,uh,o);return typeof f==="number"?f:void 0}}}buildLookaheadForOptional(e){const{prodOccurrence:n,rule:r,prodType:i,dynamicTokensEnabled:a}=e;const s=this.dfas;const o=this.logging;const l=Yr(r,i,n);const u=this.atn.decisionMap[l];const c=u.decision;const d=H(th({maxLookahead:1,occurrence:n,prodType:i,rule:r}),f=>{return H(f,p=>p[0])});if(ch(d)&&d[0][0]&&!a){const f=d[0];const p=jt(f);if(p.length===1&&ge(p[0].categoryMatches)){const y=p[0];const v=y.tokenTypeIdx;return function(){return this.LA(1).tokenTypeIdx===v}}else{const y=gt(p,(v,k)=>{if(k!==void 0){v[k.tokenTypeIdx]=true;Y(k.categoryMatches,$=>{v[$]=true})}return v},{});return function(){const v=this.LA(1);return y[v.tokenTypeIdx]===true}}}return function(){const f=Sc.call(this,s,c,uh,o);return typeof f==="object"?false:f===0}}}function ch(t,e=true){const n=new Set;for(const r of t){const i=new Set;for(const a of r){if(a===void 0){if(e){break}else{return false}}const s=[a.tokenTypeIdx].concat(a.categoryMatches);for(const o of s){if(n.has(o)){if(!i.has(o)){return false}}else{n.add(o);i.add(o)}}}}return true}function vN(t){const e=t.decisionStates.length;const n=Array(e);for(let r=0;r<e;r++){n[r]=gN(t.decisionStates[r],r)}return n}function Sc(t,e,n,r){const i=t[e](n);let a=i.start;if(a===void 0){const o=PN(i.atnStartState);a=fv(i,dv(o));i.start=a}const s=$N.apply(this,[i,a,n,r]);return s}function $N(t,e,n,r){let i=e;let a=1;const s=[];let o=this.LA(a++);while(true){let l=SN(i,o);if(l===void 0){l=TN.apply(this,[t,i,o,a,n,r])}if(l===wu){return AN(s,i,o)}if(l.isAcceptState===true){return l.prediction}i=l;s.push(o);o=this.LA(a++)}}function TN(t,e,n,r,i,a){const s=kN(e.configs,n,i);if(s.size===0){dh(t,e,n,wu);return wu}let o=dv(s);const l=NN(s,i);if(l!==void 0){o.isAcceptState=true;o.prediction=l;o.configs.uniqueAlt=l}else if(IN(s)){const u=FS(s.alts);o.isAcceptState=true;o.prediction=u;o.configs.uniqueAlt=u;EN.apply(this,[t,r,s.alts,a])}o=dh(t,e,n,o);return o}function EN(t,e,n,r){const i=[];for(let u=1;u<=e;u++){i.push(this.LA(u).tokenType)}const a=t.atnStartState;const s=a.rule;const o=a.production;const l=wN({topLevelRule:s,ambiguityIndices:n,production:o,prefixPath:i});r(l)}function wN(t){const e=H(t.prefixPath,i=>jr(i)).join(", ");const n=t.production.idx===0?"":t.production.idx;let r=`Ambiguous Alternatives Detected: <${t.ambiguityIndices.join(", ")}> in <${CN(t.production)}${n}> inside <${t.topLevelRule.name}> Rule,
<${e}> may appears as a prefix path in all these alternatives.
`;r=r+`See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#AMBIGUOUS_ALTERNATIVES
For Further details.`;return r}function CN(t){if(t instanceof Rt){return"SUBRULE"}else if(t instanceof it){return"OPTION"}else if(t instanceof St){return"OR"}else if(t instanceof Kt){return"AT_LEAST_ONE"}else if(t instanceof Ft){return"AT_LEAST_ONE_SEP"}else if(t instanceof At){return"MANY_SEP"}else if(t instanceof De){return"MANY"}else if(t instanceof Ee){return"CONSUME"}else{throw Error("non exhaustive match")}}function AN(t,e,n){const r=Lt(e.configs.elements,a=>a.state.transitions);const i=YS(r.filter(a=>a instanceof Hp).map(a=>a.tokenType),a=>a.tokenTypeIdx);return{actualToken:n,possibleTokenTypes:i,tokenPath:t}}function SN(t,e){return t.edges[e.tokenTypeIdx]}function kN(t,e,n){const r=new ef;const i=[];for(const s of t.elements){if(n.is(s.alt)===false){continue}if(s.state.type===cs){i.push(s);continue}const o=s.state.transitions.length;for(let l=0;l<o;l++){const u=s.state.transitions[l];const c=bN(u,e);if(c!==void 0){r.add({state:c,alt:s.alt,stack:s.stack})}}}let a;if(i.length===0&&r.size===1){a=r}if(a===void 0){a=new ef;for(const s of r.elements){Cu(s,a)}}if(i.length>0&&!DN(a)){for(const s of i){a.add(s)}}return a}function bN(t,e){if(t instanceof Hp&&LR(e,t.tokenType)){return t.target}return void 0}function NN(t,e){let n;for(const r of t.elements){if(e.is(r.alt)===true){if(n===void 0){n=r.alt}else if(n!==r.alt){return void 0}}}return n}function dv(t){return{configs:t,edges:{},isAcceptState:false,prediction:-1}}function dh(t,e,n,r){r=fv(t,r);e.edges[n.tokenTypeIdx]=r;return r}function fv(t,e){if(e===wu){return e}const n=e.configs.key;const r=t.states[n];if(r!==void 0){return r}e.configs.finalize();t.states[n]=e;return e}function PN(t){const e=new ef;const n=t.transitions.length;for(let r=0;r<n;r++){const i=t.transitions[r].target;const a={state:i,alt:r,stack:[]};Cu(a,e)}return e}function Cu(t,e){const n=t.state;if(n.type===cs){if(t.stack.length>0){const i=[...t.stack];const a=i.pop();const s={state:a,alt:t.alt,stack:i};Cu(s,e)}else{e.add(t)}return}if(!n.epsilonOnlyTransitions){e.add(t)}const r=n.transitions.length;for(let i=0;i<r;i++){const a=n.transitions[i];const s=_N(t,a);if(s!==void 0){Cu(s,e)}}}function _N(t,e){if(e instanceof av){return{state:e.target,alt:t.alt,stack:t.stack}}else if(e instanceof qp){const n=[...t.stack,e.followState];return{state:e.target,alt:t.alt,stack:n}}return void 0}function DN(t){for(const e of t.elements){if(e.state.type===cs){return true}}return false}function ON(t){for(const e of t.elements){if(e.state.type!==cs){return false}}return true}function IN(t){if(ON(t)){return true}const e=LN(t.elements);const n=xN(e)&&!MN(e);return n}function LN(t){const e=new Map;for(const n of t){const r=uv(n,false);let i=e.get(r);if(i===void 0){i={};e.set(r,i)}i[n.alt]=true}return e}function xN(t){for(const e of Array.from(t.values())){if(Object.keys(e).length>1){return true}}return false}function MN(t){for(const e of Array.from(t.values())){if(Object.keys(e).length===1){return true}}return false}var tf;(function(t){function e(n){return typeof n==="string"}t.is=e})(tf||(tf={}));var Au;(function(t){function e(n){return typeof n==="string"}t.is=e})(Au||(Au={}));var nf;(function(t){t.MIN_VALUE=-2147483648;t.MAX_VALUE=2147483647;function e(n){return typeof n==="number"&&t.MIN_VALUE<=n&&n<=t.MAX_VALUE}t.is=e})(nf||(nf={}));var Ha;(function(t){t.MIN_VALUE=0;t.MAX_VALUE=2147483647;function e(n){return typeof n==="number"&&t.MIN_VALUE<=n&&n<=t.MAX_VALUE}t.is=e})(Ha||(Ha={}));var ue;(function(t){function e(r,i){if(r===Number.MAX_VALUE){r=Ha.MAX_VALUE}if(i===Number.MAX_VALUE){i=Ha.MAX_VALUE}return{line:r,character:i}}t.create=e;function n(r){let i=r;return T.objectLiteral(i)&&T.uinteger(i.line)&&T.uinteger(i.character)}t.is=n})(ue||(ue={}));var ie;(function(t){function e(r,i,a,s){if(T.uinteger(r)&&T.uinteger(i)&&T.uinteger(a)&&T.uinteger(s)){return{start:ue.create(r,i),end:ue.create(a,s)}}else if(ue.is(r)&&ue.is(i)){return{start:r,end:i}}else{throw new Error(`Range#create called with invalid arguments[${r}, ${i}, ${a}, ${s}]`)}}t.create=e;function n(r){let i=r;return T.objectLiteral(i)&&ue.is(i.start)&&ue.is(i.end)}t.is=n})(ie||(ie={}));var qa;(function(t){function e(r,i){return{uri:r,range:i}}t.create=e;function n(r){let i=r;return T.objectLiteral(i)&&ie.is(i.range)&&(T.string(i.uri)||T.undefined(i.uri))}t.is=n})(qa||(qa={}));var rf;(function(t){function e(r,i,a,s){return{targetUri:r,targetRange:i,targetSelectionRange:a,originSelectionRange:s}}t.create=e;function n(r){let i=r;return T.objectLiteral(i)&&ie.is(i.targetRange)&&T.string(i.targetUri)&&ie.is(i.targetSelectionRange)&&(ie.is(i.originSelectionRange)||T.undefined(i.originSelectionRange))}t.is=n})(rf||(rf={}));var Su;(function(t){function e(r,i,a,s){return{red:r,green:i,blue:a,alpha:s}}t.create=e;function n(r){const i=r;return T.objectLiteral(i)&&T.numberRange(i.red,0,1)&&T.numberRange(i.green,0,1)&&T.numberRange(i.blue,0,1)&&T.numberRange(i.alpha,0,1)}t.is=n})(Su||(Su={}));var af;(function(t){function e(r,i){return{range:r,color:i}}t.create=e;function n(r){const i=r;return T.objectLiteral(i)&&ie.is(i.range)&&Su.is(i.color)}t.is=n})(af||(af={}));var sf;(function(t){function e(r,i,a){return{label:r,textEdit:i,additionalTextEdits:a}}t.create=e;function n(r){const i=r;return T.objectLiteral(i)&&T.string(i.label)&&(T.undefined(i.textEdit)||Jt.is(i))&&(T.undefined(i.additionalTextEdits)||T.typedArray(i.additionalTextEdits,Jt.is))}t.is=n})(sf||(sf={}));var of;(function(t){t.Comment="comment";t.Imports="imports";t.Region="region"})(of||(of={}));var lf;(function(t){function e(r,i,a,s,o,l){const u={startLine:r,endLine:i};if(T.defined(a)){u.startCharacter=a}if(T.defined(s)){u.endCharacter=s}if(T.defined(o)){u.kind=o}if(T.defined(l)){u.collapsedText=l}return u}t.create=e;function n(r){const i=r;return T.objectLiteral(i)&&T.uinteger(i.startLine)&&T.uinteger(i.startLine)&&(T.undefined(i.startCharacter)||T.uinteger(i.startCharacter))&&(T.undefined(i.endCharacter)||T.uinteger(i.endCharacter))&&(T.undefined(i.kind)||T.string(i.kind))}t.is=n})(lf||(lf={}));var ku;(function(t){function e(r,i){return{location:r,message:i}}t.create=e;function n(r){let i=r;return T.defined(i)&&qa.is(i.location)&&T.string(i.message)}t.is=n})(ku||(ku={}));var uf;(function(t){t.Error=1;t.Warning=2;t.Information=3;t.Hint=4})(uf||(uf={}));var cf;(function(t){t.Unnecessary=1;t.Deprecated=2})(cf||(cf={}));var df;(function(t){function e(n){const r=n;return T.objectLiteral(r)&&T.string(r.href)}t.is=e})(df||(df={}));var ja;(function(t){function e(r,i,a,s,o,l){let u={range:r,message:i};if(T.defined(a)){u.severity=a}if(T.defined(s)){u.code=s}if(T.defined(o)){u.source=o}if(T.defined(l)){u.relatedInformation=l}return u}t.create=e;function n(r){var i;let a=r;return T.defined(a)&&ie.is(a.range)&&T.string(a.message)&&(T.number(a.severity)||T.undefined(a.severity))&&(T.integer(a.code)||T.string(a.code)||T.undefined(a.code))&&(T.undefined(a.codeDescription)||T.string((i=a.codeDescription)===null||i===void 0?void 0:i.href))&&(T.string(a.source)||T.undefined(a.source))&&(T.undefined(a.relatedInformation)||T.typedArray(a.relatedInformation,ku.is))}t.is=n})(ja||(ja={}));var kr;(function(t){function e(r,i,...a){let s={title:r,command:i};if(T.defined(a)&&a.length>0){s.arguments=a}return s}t.create=e;function n(r){let i=r;return T.defined(i)&&T.string(i.title)&&T.string(i.command)}t.is=n})(kr||(kr={}));var Jt;(function(t){function e(a,s){return{range:a,newText:s}}t.replace=e;function n(a,s){return{range:{start:a,end:a},newText:s}}t.insert=n;function r(a){return{range:a,newText:""}}t.del=r;function i(a){const s=a;return T.objectLiteral(s)&&T.string(s.newText)&&ie.is(s.range)}t.is=i})(Jt||(Jt={}));var $r;(function(t){function e(r,i,a){const s={label:r};if(i!==void 0){s.needsConfirmation=i}if(a!==void 0){s.description=a}return s}t.create=e;function n(r){const i=r;return T.objectLiteral(i)&&T.string(i.label)&&(T.boolean(i.needsConfirmation)||i.needsConfirmation===void 0)&&(T.string(i.description)||i.description===void 0)}t.is=n})($r||($r={}));var nt;(function(t){function e(n){const r=n;return T.string(r)}t.is=e})(nt||(nt={}));var Pn;(function(t){function e(a,s,o){return{range:a,newText:s,annotationId:o}}t.replace=e;function n(a,s,o){return{range:{start:a,end:a},newText:s,annotationId:o}}t.insert=n;function r(a,s){return{range:a,newText:"",annotationId:s}}t.del=r;function i(a){const s=a;return Jt.is(s)&&($r.is(s.annotationId)||nt.is(s.annotationId))}t.is=i})(Pn||(Pn={}));var Ba;(function(t){function e(r,i){return{textDocument:r,edits:i}}t.create=e;function n(r){let i=r;return T.defined(i)&&Wa.is(i.textDocument)&&Array.isArray(i.edits)}t.is=n})(Ba||(Ba={}));var Xr;(function(t){function e(r,i,a){let s={kind:"create",uri:r};if(i!==void 0&&(i.overwrite!==void 0||i.ignoreIfExists!==void 0)){s.options=i}if(a!==void 0){s.annotationId=a}return s}t.create=e;function n(r){let i=r;return i&&i.kind==="create"&&T.string(i.uri)&&(i.options===void 0||(i.options.overwrite===void 0||T.boolean(i.options.overwrite))&&(i.options.ignoreIfExists===void 0||T.boolean(i.options.ignoreIfExists)))&&(i.annotationId===void 0||nt.is(i.annotationId))}t.is=n})(Xr||(Xr={}));var Jr;(function(t){function e(r,i,a,s){let o={kind:"rename",oldUri:r,newUri:i};if(a!==void 0&&(a.overwrite!==void 0||a.ignoreIfExists!==void 0)){o.options=a}if(s!==void 0){o.annotationId=s}return o}t.create=e;function n(r){let i=r;return i&&i.kind==="rename"&&T.string(i.oldUri)&&T.string(i.newUri)&&(i.options===void 0||(i.options.overwrite===void 0||T.boolean(i.options.overwrite))&&(i.options.ignoreIfExists===void 0||T.boolean(i.options.ignoreIfExists)))&&(i.annotationId===void 0||nt.is(i.annotationId))}t.is=n})(Jr||(Jr={}));var Qr;(function(t){function e(r,i,a){let s={kind:"delete",uri:r};if(i!==void 0&&(i.recursive!==void 0||i.ignoreIfNotExists!==void 0)){s.options=i}if(a!==void 0){s.annotationId=a}return s}t.create=e;function n(r){let i=r;return i&&i.kind==="delete"&&T.string(i.uri)&&(i.options===void 0||(i.options.recursive===void 0||T.boolean(i.options.recursive))&&(i.options.ignoreIfNotExists===void 0||T.boolean(i.options.ignoreIfNotExists)))&&(i.annotationId===void 0||nt.is(i.annotationId))}t.is=n})(Qr||(Qr={}));var bu;(function(t){function e(n){let r=n;return r&&(r.changes!==void 0||r.documentChanges!==void 0)&&(r.documentChanges===void 0||r.documentChanges.every(i=>{if(T.string(i.kind)){return Xr.is(i)||Jr.is(i)||Qr.is(i)}else{return Ba.is(i)}}))}t.is=e})(bu||(bu={}));class Hs{constructor(e,n){this.edits=e;this.changeAnnotations=n}insert(e,n,r){let i;let a;if(r===void 0){i=Jt.insert(e,n)}else if(nt.is(r)){a=r;i=Pn.insert(e,n,r)}else{this.assertChangeAnnotations(this.changeAnnotations);a=this.changeAnnotations.manage(r);i=Pn.insert(e,n,a)}this.edits.push(i);if(a!==void 0){return a}}replace(e,n,r){let i;let a;if(r===void 0){i=Jt.replace(e,n)}else if(nt.is(r)){a=r;i=Pn.replace(e,n,r)}else{this.assertChangeAnnotations(this.changeAnnotations);a=this.changeAnnotations.manage(r);i=Pn.replace(e,n,a)}this.edits.push(i);if(a!==void 0){return a}}delete(e,n){let r;let i;if(n===void 0){r=Jt.del(e)}else if(nt.is(n)){i=n;r=Pn.del(e,n)}else{this.assertChangeAnnotations(this.changeAnnotations);i=this.changeAnnotations.manage(n);r=Pn.del(e,i)}this.edits.push(r);if(i!==void 0){return i}}add(e){this.edits.push(e)}all(){return this.edits}clear(){this.edits.splice(0,this.edits.length)}assertChangeAnnotations(e){if(e===void 0){throw new Error(`Text edit change is not configured to manage change annotations.`)}}}class fh{constructor(e){this._annotations=e===void 0?Object.create(null):e;this._counter=0;this._size=0}all(){return this._annotations}get size(){return this._size}manage(e,n){let r;if(nt.is(e)){r=e}else{r=this.nextId();n=e}if(this._annotations[r]!==void 0){throw new Error(`Id ${r} is already in use.`)}if(n===void 0){throw new Error(`No annotation provided for id ${r}`)}this._annotations[r]=n;this._size++;return r}nextId(){this._counter++;return this._counter.toString()}}class KN{constructor(e){this._textEditChanges=Object.create(null);if(e!==void 0){this._workspaceEdit=e;if(e.documentChanges){this._changeAnnotations=new fh(e.changeAnnotations);e.changeAnnotations=this._changeAnnotations.all();e.documentChanges.forEach(n=>{if(Ba.is(n)){const r=new Hs(n.edits,this._changeAnnotations);this._textEditChanges[n.textDocument.uri]=r}})}else if(e.changes){Object.keys(e.changes).forEach(n=>{const r=new Hs(e.changes[n]);this._textEditChanges[n]=r})}}else{this._workspaceEdit={}}}get edit(){this.initDocumentChanges();if(this._changeAnnotations!==void 0){if(this._changeAnnotations.size===0){this._workspaceEdit.changeAnnotations=void 0}else{this._workspaceEdit.changeAnnotations=this._changeAnnotations.all()}}return this._workspaceEdit}getTextEditChange(e){if(Wa.is(e)){this.initDocumentChanges();if(this._workspaceEdit.documentChanges===void 0){throw new Error("Workspace edit is not configured for document changes.")}const n={uri:e.uri,version:e.version};let r=this._textEditChanges[n.uri];if(!r){const i=[];const a={textDocument:n,edits:i};this._workspaceEdit.documentChanges.push(a);r=new Hs(i,this._changeAnnotations);this._textEditChanges[n.uri]=r}return r}else{this.initChanges();if(this._workspaceEdit.changes===void 0){throw new Error("Workspace edit is not configured for normal text edit changes.")}let n=this._textEditChanges[e];if(!n){let r=[];this._workspaceEdit.changes[e]=r;n=new Hs(r);this._textEditChanges[e]=n}return n}}initDocumentChanges(){if(this._workspaceEdit.documentChanges===void 0&&this._workspaceEdit.changes===void 0){this._changeAnnotations=new fh;this._workspaceEdit.documentChanges=[];this._workspaceEdit.changeAnnotations=this._changeAnnotations.all()}}initChanges(){if(this._workspaceEdit.documentChanges===void 0&&this._workspaceEdit.changes===void 0){this._workspaceEdit.changes=Object.create(null)}}createFile(e,n,r){this.initDocumentChanges();if(this._workspaceEdit.documentChanges===void 0){throw new Error("Workspace edit is not configured for document changes.")}let i;if($r.is(n)||nt.is(n)){i=n}else{r=n}let a;let s;if(i===void 0){a=Xr.create(e,r)}else{s=nt.is(i)?i:this._changeAnnotations.manage(i);a=Xr.create(e,r,s)}this._workspaceEdit.documentChanges.push(a);if(s!==void 0){return s}}renameFile(e,n,r,i){this.initDocumentChanges();if(this._workspaceEdit.documentChanges===void 0){throw new Error("Workspace edit is not configured for document changes.")}let a;if($r.is(r)||nt.is(r)){a=r}else{i=r}let s;let o;if(a===void 0){s=Jr.create(e,n,i)}else{o=nt.is(a)?a:this._changeAnnotations.manage(a);s=Jr.create(e,n,i,o)}this._workspaceEdit.documentChanges.push(s);if(o!==void 0){return o}}deleteFile(e,n,r){this.initDocumentChanges();if(this._workspaceEdit.documentChanges===void 0){throw new Error("Workspace edit is not configured for document changes.")}let i;if($r.is(n)||nt.is(n)){i=n}else{r=n}let a;let s;if(i===void 0){a=Qr.create(e,r)}else{s=nt.is(i)?i:this._changeAnnotations.manage(i);a=Qr.create(e,r,s)}this._workspaceEdit.documentChanges.push(a);if(s!==void 0){return s}}}var ff;(function(t){function e(r){return{uri:r}}t.create=e;function n(r){let i=r;return T.defined(i)&&T.string(i.uri)}t.is=n})(ff||(ff={}));var pf;(function(t){function e(r,i){return{uri:r,version:i}}t.create=e;function n(r){let i=r;return T.defined(i)&&T.string(i.uri)&&T.integer(i.version)}t.is=n})(pf||(pf={}));var Wa;(function(t){function e(r,i){return{uri:r,version:i}}t.create=e;function n(r){let i=r;return T.defined(i)&&T.string(i.uri)&&(i.version===null||T.integer(i.version))}t.is=n})(Wa||(Wa={}));var mf;(function(t){function e(r,i,a,s){return{uri:r,languageId:i,version:a,text:s}}t.create=e;function n(r){let i=r;return T.defined(i)&&T.string(i.uri)&&T.string(i.languageId)&&T.integer(i.version)&&T.string(i.text)}t.is=n})(mf||(mf={}));var Nu;(function(t){t.PlainText="plaintext";t.Markdown="markdown";function e(n){const r=n;return r===t.PlainText||r===t.Markdown}t.is=e})(Nu||(Nu={}));var Zr;(function(t){function e(n){const r=n;return T.objectLiteral(n)&&Nu.is(r.kind)&&T.string(r.value)}t.is=e})(Zr||(Zr={}));var _n;(function(t){t.Text=1;t.Method=2;t.Function=3;t.Constructor=4;t.Field=5;t.Variable=6;t.Class=7;t.Interface=8;t.Module=9;t.Property=10;t.Unit=11;t.Value=12;t.Enum=13;t.Keyword=14;t.Snippet=15;t.Color=16;t.File=17;t.Reference=18;t.Folder=19;t.EnumMember=20;t.Constant=21;t.Struct=22;t.Event=23;t.Operator=24;t.TypeParameter=25})(_n||(_n={}));var hf;(function(t){t.PlainText=1;t.Snippet=2})(hf||(hf={}));var yf;(function(t){t.Deprecated=1})(yf||(yf={}));var gf;(function(t){function e(r,i,a){return{newText:r,insert:i,replace:a}}t.create=e;function n(r){const i=r;return i&&T.string(i.newText)&&ie.is(i.insert)&&ie.is(i.replace)}t.is=n})(gf||(gf={}));var Rf;(function(t){t.asIs=1;t.adjustIndentation=2})(Rf||(Rf={}));var vf;(function(t){function e(n){const r=n;return r&&(T.string(r.detail)||r.detail===void 0)&&(T.string(r.description)||r.description===void 0)}t.is=e})(vf||(vf={}));var $f;(function(t){function e(n){return{label:n}}t.create=e})($f||($f={}));var Tf;(function(t){function e(n,r){return{items:n?n:[],isIncomplete:!!r}}t.create=e})(Tf||(Tf={}));var Va;(function(t){function e(r){return r.replace(/[\\`*_{}[\]()#+\-.!]/g,"\\$&")}t.fromPlainText=e;function n(r){const i=r;return T.string(i)||T.objectLiteral(i)&&T.string(i.language)&&T.string(i.value)}t.is=n})(Va||(Va={}));var Ef;(function(t){function e(n){let r=n;return!!r&&T.objectLiteral(r)&&(Zr.is(r.contents)||Va.is(r.contents)||T.typedArray(r.contents,Va.is))&&(n.range===void 0||ie.is(n.range))}t.is=e})(Ef||(Ef={}));var wf;(function(t){function e(n,r){return r?{label:n,documentation:r}:{label:n}}t.create=e})(wf||(wf={}));var Cf;(function(t){function e(n,r,...i){let a={label:n};if(T.defined(r)){a.documentation=r}if(T.defined(i)){a.parameters=i}else{a.parameters=[]}return a}t.create=e})(Cf||(Cf={}));var Af;(function(t){t.Text=1;t.Read=2;t.Write=3})(Af||(Af={}));var Sf;(function(t){function e(n,r){let i={range:n};if(T.number(r)){i.kind=r}return i}t.create=e})(Sf||(Sf={}));var Dn;(function(t){t.File=1;t.Module=2;t.Namespace=3;t.Package=4;t.Class=5;t.Method=6;t.Property=7;t.Field=8;t.Constructor=9;t.Enum=10;t.Interface=11;t.Function=12;t.Variable=13;t.Constant=14;t.String=15;t.Number=16;t.Boolean=17;t.Array=18;t.Object=19;t.Key=20;t.Null=21;t.EnumMember=22;t.Struct=23;t.Event=24;t.Operator=25;t.TypeParameter=26})(Dn||(Dn={}));var kf;(function(t){t.Deprecated=1})(kf||(kf={}));var bf;(function(t){function e(n,r,i,a,s){let o={name:n,kind:r,location:{uri:a,range:i}};if(s){o.containerName=s}return o}t.create=e})(bf||(bf={}));var Nf;(function(t){function e(n,r,i,a){return a!==void 0?{name:n,kind:r,location:{uri:i,range:a}}:{name:n,kind:r,location:{uri:i}}}t.create=e})(Nf||(Nf={}));var Pf;(function(t){function e(r,i,a,s,o,l){let u={name:r,detail:i,kind:a,range:s,selectionRange:o};if(l!==void 0){u.children=l}return u}t.create=e;function n(r){let i=r;return i&&T.string(i.name)&&T.number(i.kind)&&ie.is(i.range)&&ie.is(i.selectionRange)&&(i.detail===void 0||T.string(i.detail))&&(i.deprecated===void 0||T.boolean(i.deprecated))&&(i.children===void 0||Array.isArray(i.children))&&(i.tags===void 0||Array.isArray(i.tags))}t.is=n})(Pf||(Pf={}));var _f;(function(t){t.Empty="";t.QuickFix="quickfix";t.Refactor="refactor";t.RefactorExtract="refactor.extract";t.RefactorInline="refactor.inline";t.RefactorRewrite="refactor.rewrite";t.Source="source";t.SourceOrganizeImports="source.organizeImports";t.SourceFixAll="source.fixAll"})(_f||(_f={}));var za;(function(t){t.Invoked=1;t.Automatic=2})(za||(za={}));var Df;(function(t){function e(r,i,a){let s={diagnostics:r};if(i!==void 0&&i!==null){s.only=i}if(a!==void 0&&a!==null){s.triggerKind=a}return s}t.create=e;function n(r){let i=r;return T.defined(i)&&T.typedArray(i.diagnostics,ja.is)&&(i.only===void 0||T.typedArray(i.only,T.string))&&(i.triggerKind===void 0||i.triggerKind===za.Invoked||i.triggerKind===za.Automatic)}t.is=n})(Df||(Df={}));var Of;(function(t){function e(r,i,a){let s={title:r};let o=true;if(typeof i==="string"){o=false;s.kind=i}else if(kr.is(i)){s.command=i}else{s.edit=i}if(o&&a!==void 0){s.kind=a}return s}t.create=e;function n(r){let i=r;return i&&T.string(i.title)&&(i.diagnostics===void 0||T.typedArray(i.diagnostics,ja.is))&&(i.kind===void 0||T.string(i.kind))&&(i.edit!==void 0||i.command!==void 0)&&(i.command===void 0||kr.is(i.command))&&(i.isPreferred===void 0||T.boolean(i.isPreferred))&&(i.edit===void 0||bu.is(i.edit))}t.is=n})(Of||(Of={}));var If;(function(t){function e(r,i){let a={range:r};if(T.defined(i)){a.data=i}return a}t.create=e;function n(r){let i=r;return T.defined(i)&&ie.is(i.range)&&(T.undefined(i.command)||kr.is(i.command))}t.is=n})(If||(If={}));var Lf;(function(t){function e(r,i){return{tabSize:r,insertSpaces:i}}t.create=e;function n(r){let i=r;return T.defined(i)&&T.uinteger(i.tabSize)&&T.boolean(i.insertSpaces)}t.is=n})(Lf||(Lf={}));var xf;(function(t){function e(r,i,a){return{range:r,target:i,data:a}}t.create=e;function n(r){let i=r;return T.defined(i)&&ie.is(i.range)&&(T.undefined(i.target)||T.string(i.target))}t.is=n})(xf||(xf={}));var Mf;(function(t){function e(r,i){return{range:r,parent:i}}t.create=e;function n(r){let i=r;return T.objectLiteral(i)&&ie.is(i.range)&&(i.parent===void 0||t.is(i.parent))}t.is=n})(Mf||(Mf={}));var Kf;(function(t){t["namespace"]="namespace";t["type"]="type";t["class"]="class";t["enum"]="enum";t["interface"]="interface";t["struct"]="struct";t["typeParameter"]="typeParameter";t["parameter"]="parameter";t["variable"]="variable";t["property"]="property";t["enumMember"]="enumMember";t["event"]="event";t["function"]="function";t["method"]="method";t["macro"]="macro";t["keyword"]="keyword";t["modifier"]="modifier";t["comment"]="comment";t["string"]="string";t["number"]="number";t["regexp"]="regexp";t["operator"]="operator";t["decorator"]="decorator"})(Kf||(Kf={}));var Ff;(function(t){t["declaration"]="declaration";t["definition"]="definition";t["readonly"]="readonly";t["static"]="static";t["deprecated"]="deprecated";t["abstract"]="abstract";t["async"]="async";t["modification"]="modification";t["documentation"]="documentation";t["defaultLibrary"]="defaultLibrary"})(Ff||(Ff={}));var Uf;(function(t){function e(n){const r=n;return T.objectLiteral(r)&&(r.resultId===void 0||typeof r.resultId==="string")&&Array.isArray(r.data)&&(r.data.length===0||typeof r.data[0]==="number")}t.is=e})(Uf||(Uf={}));var Gf;(function(t){function e(r,i){return{range:r,text:i}}t.create=e;function n(r){const i=r;return i!==void 0&&i!==null&&ie.is(i.range)&&T.string(i.text)}t.is=n})(Gf||(Gf={}));var Hf;(function(t){function e(r,i,a){return{range:r,variableName:i,caseSensitiveLookup:a}}t.create=e;function n(r){const i=r;return i!==void 0&&i!==null&&ie.is(i.range)&&T.boolean(i.caseSensitiveLookup)&&(T.string(i.variableName)||i.variableName===void 0)}t.is=n})(Hf||(Hf={}));var qf;(function(t){function e(r,i){return{range:r,expression:i}}t.create=e;function n(r){const i=r;return i!==void 0&&i!==null&&ie.is(i.range)&&(T.string(i.expression)||i.expression===void 0)}t.is=n})(qf||(qf={}));var jf;(function(t){function e(r,i){return{frameId:r,stoppedLocation:i}}t.create=e;function n(r){const i=r;return T.defined(i)&&ie.is(r.stoppedLocation)}t.is=n})(jf||(jf={}));var Pu;(function(t){t.Type=1;t.Parameter=2;function e(n){return n===1||n===2}t.is=e})(Pu||(Pu={}));var _u;(function(t){function e(r){return{value:r}}t.create=e;function n(r){const i=r;return T.objectLiteral(i)&&(i.tooltip===void 0||T.string(i.tooltip)||Zr.is(i.tooltip))&&(i.location===void 0||qa.is(i.location))&&(i.command===void 0||kr.is(i.command))}t.is=n})(_u||(_u={}));var Bf;(function(t){function e(r,i,a){const s={position:r,label:i};if(a!==void 0){s.kind=a}return s}t.create=e;function n(r){const i=r;return T.objectLiteral(i)&&ue.is(i.position)&&(T.string(i.label)||T.typedArray(i.label,_u.is))&&(i.kind===void 0||Pu.is(i.kind))&&i.textEdits===void 0||T.typedArray(i.textEdits,Jt.is)&&(i.tooltip===void 0||T.string(i.tooltip)||Zr.is(i.tooltip))&&(i.paddingLeft===void 0||T.boolean(i.paddingLeft))&&(i.paddingRight===void 0||T.boolean(i.paddingRight))}t.is=n})(Bf||(Bf={}));var Wf;(function(t){function e(n){return{kind:"snippet",value:n}}t.createSnippet=e})(Wf||(Wf={}));var Vf;(function(t){function e(n,r,i,a){return{insertText:n,filterText:r,range:i,command:a}}t.create=e})(Vf||(Vf={}));var zf;(function(t){function e(n){return{items:n}}t.create=e})(zf||(zf={}));var Yf;(function(t){t.Invoked=0;t.Automatic=1})(Yf||(Yf={}));var Xf;(function(t){function e(n,r){return{range:n,text:r}}t.create=e})(Xf||(Xf={}));var Jf;(function(t){function e(n,r){return{triggerKind:n,selectedCompletionInfo:r}}t.create=e})(Jf||(Jf={}));var Qf;(function(t){function e(n){const r=n;return T.objectLiteral(r)&&Au.is(r.uri)&&T.string(r.name)}t.is=e})(Qf||(Qf={}));const FN=["\n","\r\n","\r"];var Zf;(function(t){function e(a,s,o,l){return new UN(a,s,o,l)}t.create=e;function n(a){let s=a;return T.defined(s)&&T.string(s.uri)&&(T.undefined(s.languageId)||T.string(s.languageId))&&T.uinteger(s.lineCount)&&T.func(s.getText)&&T.func(s.positionAt)&&T.func(s.offsetAt)?true:false}t.is=n;function r(a,s){let o=a.getText();let l=i(s,(c,d)=>{let f=c.range.start.line-d.range.start.line;if(f===0){return c.range.start.character-d.range.start.character}return f});let u=o.length;for(let c=l.length-1;c>=0;c--){let d=l[c];let f=a.offsetAt(d.range.start);let p=a.offsetAt(d.range.end);if(p<=u){o=o.substring(0,f)+d.newText+o.substring(p,o.length)}else{throw new Error("Overlapping edit")}u=f}return o}t.applyEdits=r;function i(a,s){if(a.length<=1){return a}const o=a.length/2|0;const l=a.slice(0,o);const u=a.slice(o);i(l,s);i(u,s);let c=0;let d=0;let f=0;while(c<l.length&&d<u.length){let p=s(l[c],u[d]);if(p<=0){a[f++]=l[c++]}else{a[f++]=u[d++]}}while(c<l.length){a[f++]=l[c++]}while(d<u.length){a[f++]=u[d++]}return a}})(Zf||(Zf={}));let UN=class lI{constructor(e,n,r,i){this._uri=e;this._languageId=n;this._version=r;this._content=i;this._lineOffsets=void 0}get uri(){return this._uri}get languageId(){return this._languageId}get version(){return this._version}getText(e){if(e){let n=this.offsetAt(e.start);let r=this.offsetAt(e.end);return this._content.substring(n,r)}return this._content}update(e,n){this._content=e.text;this._version=n;this._lineOffsets=void 0}getLineOffsets(){if(this._lineOffsets===void 0){let e=[];let n=this._content;let r=true;for(let i=0;i<n.length;i++){if(r){e.push(i);r=false}let a=n.charAt(i);r=a==="\r"||a==="\n";if(a==="\r"&&i+1<n.length&&n.charAt(i+1)==="\n"){i++}}if(r&&n.length>0){e.push(n.length)}this._lineOffsets=e}return this._lineOffsets}positionAt(e){e=Math.max(Math.min(e,this._content.length),0);let n=this.getLineOffsets();let r=0,i=n.length;if(i===0){return ue.create(0,e)}while(r<i){let s=Math.floor((r+i)/2);if(n[s]>e){i=s}else{r=s+1}}let a=r-1;return ue.create(a,e-n[a])}offsetAt(e){let n=this.getLineOffsets();if(e.line>=n.length){return this._content.length}else if(e.line<0){return 0}let r=n[e.line];let i=e.line+1<n.length?n[e.line+1]:this._content.length;return Math.max(Math.min(r+e.character,i),r)}get lineCount(){return this.getLineOffsets().length}};var T;(function(t){const e=Object.prototype.toString;function n(p){return typeof p!=="undefined"}t.defined=n;function r(p){return typeof p==="undefined"}t.undefined=r;function i(p){return p===true||p===false}t.boolean=i;function a(p){return e.call(p)==="[object String]"}t.string=a;function s(p){return e.call(p)==="[object Number]"}t.number=s;function o(p,y,v){return e.call(p)==="[object Number]"&&y<=p&&p<=v}t.numberRange=o;function l(p){return e.call(p)==="[object Number]"&&-2147483648<=p&&p<=2147483647}t.integer=l;function u(p){return e.call(p)==="[object Number]"&&0<=p&&p<=2147483647}t.uinteger=u;function c(p){return e.call(p)==="[object Function]"}t.func=c;function d(p){return p!==null&&typeof p==="object"}t.objectLiteral=d;function f(p,y){return Array.isArray(p)&&p.every(y)}t.typedArray=f})(T||(T={}));var GN=Object.freeze({__proto__:null,get AnnotatedTextEdit(){return Pn},get ChangeAnnotation(){return $r},get ChangeAnnotationIdentifier(){return nt},get CodeAction(){return Of},get CodeActionContext(){return Df},get CodeActionKind(){return _f},get CodeActionTriggerKind(){return za},get CodeDescription(){return df},get CodeLens(){return If},get Color(){return Su},get ColorInformation(){return af},get ColorPresentation(){return sf},get Command(){return kr},get CompletionItem(){return $f},get CompletionItemKind(){return _n},get CompletionItemLabelDetails(){return vf},get CompletionItemTag(){return yf},get CompletionList(){return Tf},get CreateFile(){return Xr},get DeleteFile(){return Qr},get Diagnostic(){return ja},get DiagnosticRelatedInformation(){return ku},get DiagnosticSeverity(){return uf},get DiagnosticTag(){return cf},get DocumentHighlight(){return Sf},get DocumentHighlightKind(){return Af},get DocumentLink(){return xf},get DocumentSymbol(){return Pf},get DocumentUri(){return tf},EOL:FN,get FoldingRange(){return lf},get FoldingRangeKind(){return of},get FormattingOptions(){return Lf},get Hover(){return Ef},get InlayHint(){return Bf},get InlayHintKind(){return Pu},get InlayHintLabelPart(){return _u},get InlineCompletionContext(){return Jf},get InlineCompletionItem(){return Vf},get InlineCompletionList(){return zf},get InlineCompletionTriggerKind(){return Yf},get InlineValueContext(){return jf},get InlineValueEvaluatableExpression(){return qf},get InlineValueText(){return Gf},get InlineValueVariableLookup(){return Hf},get InsertReplaceEdit(){return gf},get InsertTextFormat(){return hf},get InsertTextMode(){return Rf},get Location(){return qa},get LocationLink(){return rf},get MarkedString(){return Va},get MarkupContent(){return Zr},get MarkupKind(){return Nu},get OptionalVersionedTextDocumentIdentifier(){return Wa},get ParameterInformation(){return wf},get Position(){return ue},get Range(){return ie},get RenameFile(){return Jr},get SelectedCompletionInfo(){return Xf},get SelectionRange(){return Mf},get SemanticTokenModifiers(){return Ff},get SemanticTokenTypes(){return Kf},get SemanticTokens(){return Uf},get SignatureInformation(){return Cf},get StringValue(){return Wf},get SymbolInformation(){return bf},get SymbolKind(){return Dn},get SymbolTag(){return kf},get TextDocument(){return Zf},get TextDocumentEdit(){return Ba},get TextDocumentIdentifier(){return ff},get TextDocumentItem(){return mf},get TextEdit(){return Jt},get URI(){return Au},get VersionedTextDocumentIdentifier(){return pf},WorkspaceChange:KN,get WorkspaceEdit(){return bu},get WorkspaceFolder(){return Qf},get WorkspaceSymbol(){return Nf},get integer(){return nf},get uinteger(){return Ha}});class HN{constructor(){this.nodeStack=[]}get current(){var e;return(e=this.nodeStack[this.nodeStack.length-1])!==null&&e!==void 0?e:this.rootNode}buildRootNode(e){this.rootNode=new mv(e);this.rootNode.root=this.rootNode;this.nodeStack=[this.rootNode];return this.rootNode}buildCompositeNode(e){const n=new Wp;n.grammarSource=e;n.root=this.rootNode;this.current.content.push(n);this.nodeStack.push(n);return n}buildLeafNode(e,n){const r=new ep(e.startOffset,e.image.length,xd(e),e.tokenType,!n);r.grammarSource=n;r.root=this.rootNode;this.current.content.push(r);return r}removeNode(e){const n=e.container;if(n){const r=n.content.indexOf(e);if(r>=0){n.content.splice(r,1)}}}addHiddenNodes(e){const n=[];for(const a of e){const s=new ep(a.startOffset,a.image.length,xd(a),a.tokenType,true);s.root=this.rootNode;n.push(s)}let r=this.current;let i=false;if(r.content.length>0){r.content.push(...n);return}while(r.container){const a=r.container.content.indexOf(r);if(a>0){r.container.content.splice(a,0,...n);i=true;break}r=r.container}if(!i){this.rootNode.content.unshift(...n)}}construct(e){const n=this.current;if(typeof e.$type==="string"){this.current.astNode=e}e.$cstNode=n;const r=this.nodeStack.pop();if((r===null||r===void 0?void 0:r.content.length)===0){this.removeNode(r)}}}class pv{get parent(){return this.container}get feature(){return this.grammarSource}get hidden(){return false}get astNode(){var e,n;const r=typeof((e=this._astNode)===null||e===void 0?void 0:e.$type)==="string"?this._astNode:(n=this.container)===null||n===void 0?void 0:n.astNode;if(!r){throw new Error("This node has no associated AST element")}return r}set astNode(e){this._astNode=e}get element(){return this.astNode}get text(){return this.root.fullText.substring(this.offset,this.end)}}class ep extends pv{get offset(){return this._offset}get length(){return this._length}get end(){return this._offset+this._length}get hidden(){return this._hidden}get tokenType(){return this._tokenType}get range(){return this._range}constructor(e,n,r,i,a=false){super();this._hidden=a;this._offset=e;this._tokenType=i;this._length=n;this._range=r}}class Wp extends pv{constructor(){super(...arguments);this.content=new Vp(this)}get children(){return this.content}get offset(){var e,n;return(n=(e=this.firstNonHiddenNode)===null||e===void 0?void 0:e.offset)!==null&&n!==void 0?n:0}get length(){return this.end-this.offset}get end(){var e,n;return(n=(e=this.lastNonHiddenNode)===null||e===void 0?void 0:e.end)!==null&&n!==void 0?n:0}get range(){const e=this.firstNonHiddenNode;const n=this.lastNonHiddenNode;if(e&&n){if(this._rangeCache===void 0){const{range:r}=e;const{range:i}=n;this._rangeCache={start:r.start,end:i.end.line<r.start.line?r.start:i.end}}return this._rangeCache}else{return{start:ue.create(0,0),end:ue.create(0,0)}}}get firstNonHiddenNode(){for(const e of this.content){if(!e.hidden){return e}}return this.content[0]}get lastNonHiddenNode(){for(let e=this.content.length-1;e>=0;e--){const n=this.content[e];if(!n.hidden){return n}}return this.content[this.content.length-1]}}class Vp extends Array{constructor(e){super();this.parent=e;Object.setPrototypeOf(this,Vp.prototype)}push(...e){this.addParents(e);return super.push(...e)}unshift(...e){this.addParents(e);return super.unshift(...e)}splice(e,n,...r){this.addParents(r);return super.splice(e,n,...r)}addParents(e){for(const n of e){n.container=this.parent}}}class mv extends Wp{get text(){return this._text.substring(this.offset,this.end)}get fullText(){return this._text}constructor(e){super();this._text="";this._text=e!==null&&e!==void 0?e:""}}const tp=Symbol("Datatype");function kc(t){return t.$type===tp}const ph="​";const hv=t=>t.endsWith(ph)?t:t+ph;class yv{constructor(e){this._unorderedGroups=new Map;this.allRules=new Map;this.lexer=e.parser.Lexer;const n=this.lexer.definition;const r=e.LanguageMetaData.mode==="production";this.wrapper=new VN(n,Object.assign(Object.assign({},e.parser.ParserConfig),{skipValidations:r,errorMessageProvider:e.parser.ParserErrorMessageProvider}))}alternatives(e,n){this.wrapper.wrapOr(e,n)}optional(e,n){this.wrapper.wrapOption(e,n)}many(e,n){this.wrapper.wrapMany(e,n)}atLeastOne(e,n){this.wrapper.wrapAtLeastOne(e,n)}getRule(e){return this.allRules.get(e)}isRecording(){return this.wrapper.IS_RECORDING}get unorderedGroups(){return this._unorderedGroups}getRuleStack(){return this.wrapper.RULE_STACK}finalize(){this.wrapper.wrapSelfAnalysis()}}class qN extends yv{get current(){return this.stack[this.stack.length-1]}constructor(e){super(e);this.nodeBuilder=new HN;this.stack=[];this.assignmentMap=new Map;this.linker=e.references.Linker;this.converter=e.parser.ValueConverter;this.astReflection=e.shared.AstReflection}rule(e,n){const r=this.computeRuleType(e);const i=this.wrapper.DEFINE_RULE(hv(e.name),this.startImplementation(r,n).bind(this));this.allRules.set(e.name,i);if(e.entry){this.mainRule=i}return i}computeRuleType(e){if(e.fragment){return void 0}else if(qg(e)){return tp}else{const n=ts(e);return n!==null&&n!==void 0?n:e.name}}parse(e,n={}){this.nodeBuilder.buildRootNode(e);const r=this.lexerResult=this.lexer.tokenize(e);this.wrapper.input=r.tokens;const i=n.rule?this.allRules.get(n.rule):this.mainRule;if(!i){throw new Error(n.rule?`No rule found with name '${n.rule}'`:"No main rule available.")}const a=i.call(this.wrapper,{});this.nodeBuilder.addHiddenNodes(r.hidden);this.unorderedGroups.clear();this.lexerResult=void 0;return{value:a,lexerErrors:r.errors,lexerReport:r.report,parserErrors:this.wrapper.errors}}startImplementation(e,n){return r=>{const i=!this.isRecording()&&e!==void 0;if(i){const s={$type:e};this.stack.push(s);if(e===tp){s.value=""}}let a;try{a=n(r)}catch(s){a=void 0}if(a===void 0&&i){a=this.construct()}return a}}extractHiddenTokens(e){const n=this.lexerResult.hidden;if(!n.length){return[]}const r=e.startOffset;for(let i=0;i<n.length;i++){const a=n[i];if(a.startOffset>r){return n.splice(0,i)}}return n.splice(0,n.length)}consume(e,n,r){const i=this.wrapper.wrapConsume(e,n);if(!this.isRecording()&&this.isValidToken(i)){const a=this.extractHiddenTokens(i);this.nodeBuilder.addHiddenNodes(a);const s=this.nodeBuilder.buildLeafNode(i,r);const{assignment:o,isCrossRef:l}=this.getAssignment(r);const u=this.current;if(o){const c=dn(r)?i.image:this.converter.convert(i.image,s);this.assign(o.operator,o.feature,c,s,l)}else if(kc(u)){let c=i.image;if(!dn(r)){c=this.converter.convert(c,s).toString()}u.value+=c}}}isValidToken(e){return!e.isInsertedInRecovery&&!isNaN(e.startOffset)&&typeof e.endOffset==="number"&&!isNaN(e.endOffset)}subrule(e,n,r,i,a){let s;if(!this.isRecording()&&!r){s=this.nodeBuilder.buildCompositeNode(i)}const o=this.wrapper.wrapSubrule(e,n,a);if(!this.isRecording()&&s&&s.length>0){this.performSubruleAssignment(o,i,s)}}performSubruleAssignment(e,n,r){const{assignment:i,isCrossRef:a}=this.getAssignment(n);if(i){this.assign(i.operator,i.feature,e,r,a)}else if(!i){const s=this.current;if(kc(s)){s.value+=e.toString()}else if(typeof e==="object"&&e){const o=this.assignWithoutOverride(e,s);const l=o;this.stack.pop();this.stack.push(l)}}}action(e,n){if(!this.isRecording()){let r=this.current;if(n.feature&&n.operator){r=this.construct();this.nodeBuilder.removeNode(r.$cstNode);const i=this.nodeBuilder.buildCompositeNode(n);i.content.push(r.$cstNode);const a={$type:e};this.stack.push(a);this.assign(n.operator,n.feature,r,r.$cstNode,false)}else{r.$type=e}}}construct(){if(this.isRecording()){return void 0}const e=this.current;B$(e);this.nodeBuilder.construct(e);this.stack.pop();if(kc(e)){return this.converter.convert(e.value,e.$cstNode)}else{Og(this.astReflection,e)}return e}getAssignment(e){if(!this.assignmentMap.has(e)){const n=In(e,cn);this.assignmentMap.set(e,{assignment:n,isCrossRef:n?es(n.terminal):false})}return this.assignmentMap.get(e)}assign(e,n,r,i,a){const s=this.current;let o;if(a&&typeof r==="string"){o=this.linker.buildReference(s,n,i,r)}else{o=r}switch(e){case"=":{s[n]=o;break}case"?=":{s[n]=true;break}case"+=":{if(!Array.isArray(s[n])){s[n]=[]}s[n].push(o)}}}assignWithoutOverride(e,n){for(const[i,a]of Object.entries(n)){const s=e[i];if(s===void 0){e[i]=a}else if(Array.isArray(s)&&Array.isArray(a)){a.push(...s);e[i]=a}}const r=e.$cstNode;if(r){r.astNode=void 0;e.$cstNode=void 0}return e}get definitionErrors(){return this.wrapper.definitionErrors}}class jN{buildMismatchTokenMessage(e){return Hr.buildMismatchTokenMessage(e)}buildNotAllInputParsedMessage(e){return Hr.buildNotAllInputParsedMessage(e)}buildNoViableAltMessage(e){return Hr.buildNoViableAltMessage(e)}buildEarlyExitMessage(e){return Hr.buildEarlyExitMessage(e)}}class gv extends jN{buildMismatchTokenMessage({expected:e,actual:n}){const r=e.LABEL?"`"+e.LABEL+"`":e.name.endsWith(":KW")?`keyword '${e.name.substring(0,e.name.length-3)}'`:`token of type '${e.name}'`;return`Expecting ${r} but found \`${n.image}\`.`}buildNotAllInputParsedMessage({firstRedundant:e}){return`Expecting end of file but found \`${e.image}\`.`}}class BN extends yv{constructor(){super(...arguments);this.tokens=[];this.elementStack=[];this.lastElementStack=[];this.nextTokenIndex=0;this.stackSize=0}action(){}construct(){return void 0}parse(e){this.resetState();const n=this.lexer.tokenize(e,{mode:"partial"});this.tokens=n.tokens;this.wrapper.input=[...this.tokens];this.mainRule.call(this.wrapper,{});this.unorderedGroups.clear();return{tokens:this.tokens,elementStack:[...this.lastElementStack],tokenIndex:this.nextTokenIndex}}rule(e,n){const r=this.wrapper.DEFINE_RULE(hv(e.name),this.startImplementation(n).bind(this));this.allRules.set(e.name,r);if(e.entry){this.mainRule=r}return r}resetState(){this.elementStack=[];this.lastElementStack=[];this.nextTokenIndex=0;this.stackSize=0}startImplementation(e){return n=>{const r=this.keepStackSize();try{e(n)}finally{this.resetStackSize(r)}}}removeUnexpectedElements(){this.elementStack.splice(this.stackSize)}keepStackSize(){const e=this.elementStack.length;this.stackSize=e;return e}resetStackSize(e){this.removeUnexpectedElements();this.stackSize=e}consume(e,n,r){this.wrapper.wrapConsume(e,n);if(!this.isRecording()){this.lastElementStack=[...this.elementStack,r];this.nextTokenIndex=this.currIdx+1}}subrule(e,n,r,i,a){this.before(i);this.wrapper.wrapSubrule(e,n,a);this.after(i)}before(e){if(!this.isRecording()){this.elementStack.push(e)}}after(e){if(!this.isRecording()){const n=this.elementStack.lastIndexOf(e);if(n>=0){this.elementStack.splice(n)}}}get currIdx(){return this.wrapper.currIdx}}const WN={recoveryEnabled:true,nodeLocationTracking:"full",skipValidations:true,errorMessageProvider:new gv};class VN extends tv{constructor(e,n){const r=n&&"maxLookahead"in n;super(e,Object.assign(Object.assign(Object.assign({},WN),{lookaheadStrategy:r?new Fp({maxLookahead:n.maxLookahead}):new RN({logging:n.skipValidations?()=>{}:void 0})}),n))}get IS_RECORDING(){return this.RECORDING_PHASE}DEFINE_RULE(e,n){return this.RULE(e,n)}wrapSelfAnalysis(){this.performSelfAnalysis()}wrapConsume(e,n){return this.consume(e,n)}wrapSubrule(e,n,r){return this.subrule(e,n,{ARGS:[r]})}wrapOr(e,n){this.or(e,n)}wrapOption(e,n){this.option(e,n)}wrapMany(e,n){this.many(e,n)}wrapAtLeastOne(e,n){this.atLeastOne(e,n)}}function Rv(t,e,n){const r={parser:e,tokens:n,ruleNames:new Map};zN(r,t);return e}function zN(t,e){const n=pp(e,false);const r=be(e.rules).filter(ct).filter(i=>n.has(i));for(const i of r){const a=Object.assign(Object.assign({},t),{consume:1,optional:1,subrule:1,many:1,or:1});t.parser.rule(i,br(a,i.definition))}}function br(t,e,n=false){let r;if(dn(e)){r=tP(t,e)}else if(Za(e)){r=YN(t,e)}else if(cn(e)){r=br(t,e.terminal)}else if(es(e)){r=vv(t,e)}else if(Mn(e)){r=XN(t,e)}else if(dp(e)){r=QN(t,e)}else if(fp(e)){r=ZN(t,e)}else if(wr(e)){r=eP(t,e)}else if(M$(e)){const i=t.consume++;r=()=>t.parser.consume(i,Zn,e)}else{throw new Sg(e.$cstNode,`Unexpected element type: ${e.$type}`)}return $v(t,n?void 0:Du(e),r,e.cardinality)}function YN(t,e){const n=Bu(e);return()=>t.parser.action(n,e)}function XN(t,e){const n=e.rule.ref;if(ct(n)){const r=t.subrule++;const i=n.fragment;const a=e.arguments.length>0?JN(n,e.arguments):()=>({});return s=>t.parser.subrule(r,Tv(t,n),i,e,a(s))}else if(tr(n)){const r=t.consume++;const i=np(t,n.name);return()=>t.parser.consume(r,i,e)}else if(!n){throw new Sg(e.$cstNode,`Undefined rule: ${e.rule.$refText}`)}else{Qa()}}function JN(t,e){const n=e.map(r=>On(r.value));return r=>{const i={};for(let a=0;a<n.length;a++){const s=t.parameters[a];const o=n[a];i[s.name]=o(r)}return i}}function On(t){if(_$(t)){const e=On(t.left);const n=On(t.right);return r=>e(r)||n(r)}else if(P$(t)){const e=On(t.left);const n=On(t.right);return r=>e(r)&&n(r)}else if(D$(t)){const e=On(t.value);return n=>!e(n)}else if(O$(t)){const e=t.parameter.ref.name;return n=>n!==void 0&&n[e]===true}else if(N$(t)){const e=Boolean(t.true);return()=>e}Qa()}function QN(t,e){if(e.elements.length===1){return br(t,e.elements[0])}else{const n=[];for(const i of e.elements){const a={ALT:br(t,i,true)};const s=Du(i);if(s){a.GATE=On(s)}n.push(a)}const r=t.or++;return i=>t.parser.alternatives(r,n.map(a=>{const s={ALT:()=>a.ALT(i)};const o=a.GATE;if(o){s.GATE=()=>o(i)}return s}))}}function ZN(t,e){if(e.elements.length===1){return br(t,e.elements[0])}const n=[];for(const o of e.elements){const l={ALT:br(t,o,true)};const u=Du(o);if(u){l.GATE=On(u)}n.push(l)}const r=t.or++;const i=(o,l)=>{const u=l.getRuleStack().join("-");return`uGroup_${o}_${u}`};const a=o=>t.parser.alternatives(r,n.map((l,u)=>{const c={ALT:()=>true};const d=t.parser;c.ALT=()=>{l.ALT(o);if(!d.isRecording()){const p=i(r,d);if(!d.unorderedGroups.get(p)){d.unorderedGroups.set(p,[])}const y=d.unorderedGroups.get(p);if(typeof(y===null||y===void 0?void 0:y[u])==="undefined"){y[u]=true}}};const f=l.GATE;if(f){c.GATE=()=>f(o)}else{c.GATE=()=>{const p=d.unorderedGroups.get(i(r,d));const y=!(p===null||p===void 0?void 0:p[u]);return y}}return c}));const s=$v(t,Du(e),a,"*");return o=>{s(o);if(!t.parser.isRecording()){t.parser.unorderedGroups.delete(i(r,t.parser))}}}function eP(t,e){const n=e.elements.map(r=>br(t,r));return r=>n.forEach(i=>i(r))}function Du(t){if(wr(t)){return t.guardCondition}return void 0}function vv(t,e,n=e.terminal){if(!n){if(!e.type.ref){throw new Error("Could not resolve reference to type: "+e.type.$refText)}const r=Gg(e.type.ref);const i=r===null||r===void 0?void 0:r.terminal;if(!i){throw new Error("Could not find name assignment for type: "+Bu(e.type.ref))}return vv(t,e,i)}else if(Mn(n)&&ct(n.rule.ref)){const r=n.rule.ref;const i=t.subrule++;return a=>t.parser.subrule(i,Tv(t,r),false,e,a)}else if(Mn(n)&&tr(n.rule.ref)){const r=t.consume++;const i=np(t,n.rule.ref.name);return()=>t.parser.consume(r,i,e)}else if(dn(n)){const r=t.consume++;const i=np(t,n.value);return()=>t.parser.consume(r,i,e)}else{throw new Error("Could not build cross reference parser")}}function tP(t,e){const n=t.consume++;const r=t.tokens[e.value];if(!r){throw new Error("Could not find token for keyword: "+e.value)}return()=>t.parser.consume(n,r,e)}function $v(t,e,n,r){const i=e&&On(e);if(!r){if(i){const a=t.or++;return s=>t.parser.alternatives(a,[{ALT:()=>n(s),GATE:()=>i(s)},{ALT:lh(),GATE:()=>!i(s)}])}else{return n}}if(r==="*"){const a=t.many++;return s=>t.parser.many(a,{DEF:()=>n(s),GATE:i?()=>i(s):void 0})}else if(r==="+"){const a=t.many++;if(i){const s=t.or++;return o=>t.parser.alternatives(s,[{ALT:()=>t.parser.atLeastOne(a,{DEF:()=>n(o)}),GATE:()=>i(o)},{ALT:lh(),GATE:()=>!i(o)}])}else{return s=>t.parser.atLeastOne(a,{DEF:()=>n(s)})}}else if(r==="?"){const a=t.optional++;return s=>t.parser.optional(a,{DEF:()=>n(s),GATE:i?()=>i(s):void 0})}else{Qa()}}function Tv(t,e){const n=nP(t,e);const r=t.parser.getRule(n);if(!r)throw new Error(`Rule "${n}" not found."`);return r}function nP(t,e){if(ct(e)){return e.name}else if(t.ruleNames.has(e)){return t.ruleNames.get(e)}else{let n=e;let r=n.$container;let i=e.$type;while(!ct(r)){if(wr(r)||dp(r)||fp(r)){const s=r.elements.indexOf(n);i=s.toString()+":"+i}n=r;r=r.$container}const a=r;i=a.name+":"+i;t.ruleNames.set(e,i);return i}}function np(t,e){const n=t.tokens[e];if(!n)throw new Error(`Token "${e}" not found."`);return n}function rP(t){const e=t.Grammar;const n=t.parser.Lexer;const r=new BN(t);Rv(e,r,n.definition);r.finalize();return r}function iP(t){const e=aP(t);e.finalize();return e}function aP(t){const e=t.Grammar;const n=t.parser.Lexer;const r=new qN(t);return Rv(e,r,n.definition)}class Ev{constructor(){this.diagnostics=[]}buildTokens(e,n){const r=be(pp(e,false));const i=this.buildTerminalTokens(r);const a=this.buildKeywordTokens(r,i,n);i.forEach(s=>{const o=s.PATTERN;if(typeof o==="object"&&o&&"test"in o&&pu(o)){a.unshift(s)}else{a.push(s)}});return a}flushLexingReport(e){return{diagnostics:this.popDiagnostics()}}popDiagnostics(){const e=[...this.diagnostics];this.diagnostics=[];return e}buildTerminalTokens(e){return e.filter(tr).filter(n=>!n.fragment).map(n=>this.buildTerminalToken(n)).toArray()}buildTerminalToken(e){const n=Wu(e);const r=this.requiresCustomPattern(n)?this.regexPatternFunction(n):n;const i={name:e.name,PATTERN:r};if(typeof r==="function"){i.LINE_BREAKS=true}if(e.hidden){i.GROUP=pu(n)?ot.SKIPPED:"hidden"}return i}requiresCustomPattern(e){if(e.flags.includes("u")||e.flags.includes("s")){return true}else if(e.source.includes("?<=")||e.source.includes("?<!")){return true}else{return false}}regexPatternFunction(e){const n=new RegExp(e,e.flags+"y");return(r,i)=>{n.lastIndex=i;const a=n.exec(r);return a}}buildKeywordTokens(e,n,r){return e.filter(ct).flatMap(i=>Nr(i).filter(dn)).distinct(i=>i.value).toArray().sort((i,a)=>a.value.length-i.value.length).map(i=>this.buildKeywordToken(i,n,Boolean(r===null||r===void 0?void 0:r.caseInsensitive)))}buildKeywordToken(e,n,r){const i=this.buildKeywordPattern(e,r);const a={name:e.value,PATTERN:i,LONGER_ALT:this.findLongerAlt(e,n)};if(typeof i==="function"){a.LINE_BREAKS=true}return a}buildKeywordPattern(e,n){return n?new RegExp(eT(e.value)):e.value}findLongerAlt(e,n){return n.reduce((r,i)=>{const a=i===null||i===void 0?void 0:i.PATTERN;if((a===null||a===void 0?void 0:a.source)&&tT("^"+a.source+"$",e.value)){r.push(i)}return r},[])}}class sP{convert(e,n){let r=n.grammarSource;if(es(r)){r=Mg(r)}if(Mn(r)){const i=r.rule.ref;if(!i){throw new Error("This cst node was not parsed by a rule.")}return this.runConverter(i,e,n)}return e}runConverter(e,n,r){var i;switch(e.name.toUpperCase()){case"INT":return bn.convertInt(n);case"STRING":return bn.convertString(n);case"ID":return bn.convertID(n)}switch((i=uT(e))===null||i===void 0?void 0:i.toLowerCase()){case"number":return bn.convertNumber(n);case"boolean":return bn.convertBoolean(n);case"bigint":return bn.convertBigint(n);case"date":return bn.convertDate(n);default:return n}}}var bn;(function(t){function e(u){let c="";for(let d=1;d<u.length-1;d++){const f=u.charAt(d);if(f==="\\"){const p=u.charAt(++d);c+=n(p)}else{c+=f}}return c}t.convertString=e;function n(u){switch(u){case"b":return"\b";case"f":return"\f";case"n":return"\n";case"r":return"\r";case"t":return"	";case"v":return"\v";case"0":return"\0";default:return u}}function r(u){if(u.charAt(0)==="^"){return u.substring(1)}else{return u}}t.convertID=r;function i(u){return parseInt(u)}t.convertInt=i;function a(u){return BigInt(u)}t.convertBigint=a;function s(u){return new Date(u)}t.convertDate=s;function o(u){return Number(u)}t.convertNumber=o;function l(u){return u.toLowerCase()==="true"}t.convertBoolean=l})(bn||(bn={}));function oP(t){if(t.__esModule)return t;var e=t.default;if(typeof e=="function"){var n=function r(){if(this instanceof r){return Reflect.construct(e,arguments,this.constructor)}return e.apply(this,arguments)};n.prototype=e.prototype}else n={};Object.defineProperty(n,"__esModule",{value:true});Object.keys(t).forEach(function(r){var i=Object.getOwnPropertyDescriptor(t,r);Object.defineProperty(n,r,i.get?i:{enumerable:true,get:function(){return t[r]}})});return n}var lr={};var qs={};var mh;function wv(){if(mh)return qs;mh=1;Object.defineProperty(qs,"__esModule",{value:true});let t;function e(){if(t===void 0){throw new Error(`No runtime abstraction layer installed`)}return t}(function(n){function r(i){if(i===void 0){throw new Error(`No runtime abstraction layer provided`)}t=i}n.install=r})(e);qs.default=e;return qs}var Je={};var hh;function lP(){if(hh)return Je;hh=1;Object.defineProperty(Je,"__esModule",{value:true});Je.stringArray=Je.array=Je.func=Je.error=Je.number=Je.string=Je.boolean=void 0;function t(o){return o===true||o===false}Je.boolean=t;function e(o){return typeof o==="string"||o instanceof String}Je.string=e;function n(o){return typeof o==="number"||o instanceof Number}Je.number=n;function r(o){return o instanceof Error}Je.error=r;function i(o){return typeof o==="function"}Je.func=i;function a(o){return Array.isArray(o)}Je.array=a;function s(o){return a(o)&&o.every(l=>e(l))}Je.stringArray=s;return Je}var ur={};var yh;function Cv(){if(yh)return ur;yh=1;Object.defineProperty(ur,"__esModule",{value:true});ur.Emitter=ur.Event=void 0;const t=wv();var e;(function(i){const a={dispose(){}};i.None=function(){return a}})(e||(ur.Event=e={}));class n{add(a,s=null,o){if(!this._callbacks){this._callbacks=[];this._contexts=[]}this._callbacks.push(a);this._contexts.push(s);if(Array.isArray(o)){o.push({dispose:()=>this.remove(a,s)})}}remove(a,s=null){if(!this._callbacks){return}let o=false;for(let l=0,u=this._callbacks.length;l<u;l++){if(this._callbacks[l]===a){if(this._contexts[l]===s){this._callbacks.splice(l,1);this._contexts.splice(l,1);return}else{o=true}}}if(o){throw new Error("When adding a listener with a context, you should remove it with the same context")}}invoke(...a){if(!this._callbacks){return[]}const s=[],o=this._callbacks.slice(0),l=this._contexts.slice(0);for(let u=0,c=o.length;u<c;u++){try{s.push(o[u].apply(l[u],a))}catch(d){(0,t.default)().console.error(d)}}return s}isEmpty(){return!this._callbacks||this._callbacks.length===0}dispose(){this._callbacks=void 0;this._contexts=void 0}}class r{constructor(a){this._options=a}get event(){if(!this._event){this._event=(a,s,o)=>{if(!this._callbacks){this._callbacks=new n}if(this._options&&this._options.onFirstListenerAdd&&this._callbacks.isEmpty()){this._options.onFirstListenerAdd(this)}this._callbacks.add(a,s);const l={dispose:()=>{if(!this._callbacks){return}this._callbacks.remove(a,s);l.dispose=r._noop;if(this._options&&this._options.onLastListenerRemove&&this._callbacks.isEmpty()){this._options.onLastListenerRemove(this)}}};if(Array.isArray(o)){o.push(l)}return l}}return this._event}fire(a){if(this._callbacks){this._callbacks.invoke.call(this._callbacks,a)}}dispose(){if(this._callbacks){this._callbacks.dispose();this._callbacks=void 0}}}ur.Emitter=r;r._noop=function(){};return ur}var gh;function uP(){if(gh)return lr;gh=1;Object.defineProperty(lr,"__esModule",{value:true});lr.CancellationTokenSource=lr.CancellationToken=void 0;const t=wv();const e=lP();const n=Cv();var r;(function(o){o.None=Object.freeze({isCancellationRequested:false,onCancellationRequested:n.Event.None});o.Cancelled=Object.freeze({isCancellationRequested:true,onCancellationRequested:n.Event.None});function l(u){const c=u;return c&&(c===o.None||c===o.Cancelled||e.boolean(c.isCancellationRequested)&&!!c.onCancellationRequested)}o.is=l})(r||(lr.CancellationToken=r={}));const i=Object.freeze(function(o,l){const u=(0,t.default)().timer.setTimeout(o.bind(l),0);return{dispose(){u.dispose()}}});class a{constructor(){this._isCancelled=false}cancel(){if(!this._isCancelled){this._isCancelled=true;if(this._emitter){this._emitter.fire(void 0);this.dispose()}}}get isCancellationRequested(){return this._isCancelled}get onCancellationRequested(){if(this._isCancelled){return i}if(!this._emitter){this._emitter=new n.Emitter}return this._emitter.event}dispose(){if(this._emitter){this._emitter.dispose();this._emitter=void 0}}}class s{get token(){if(!this._token){this._token=new a}return this._token}cancel(){if(!this._token){this._token=r.Cancelled}else{this._token.cancel()}}dispose(){if(!this._token){this._token=r.None}else if(this._token instanceof a){this._token.dispose()}}}lr.CancellationTokenSource=s;return lr}var ye=uP();function cP(){return new Promise(t=>{if(typeof setImmediate==="undefined"){setTimeout(t,0)}else{setImmediate(t)}})}let Jl=0;let dP=10;function fP(){Jl=performance.now();return new ye.CancellationTokenSource}const Ou=Symbol("OperationCancelled");function ds(t){return t===Ou}async function ht(t){if(t===ye.CancellationToken.None){return}const e=performance.now();if(e-Jl>=dP){Jl=e;await cP();Jl=performance.now()}if(t.isCancellationRequested){throw Ou}}class zp{constructor(){this.promise=new Promise((e,n)=>{this.resolve=r=>{e(r);return this};this.reject=r=>{n(r);return this}})}}class Ya{constructor(e,n,r,i){this._uri=e;this._languageId=n;this._version=r;this._content=i;this._lineOffsets=void 0}get uri(){return this._uri}get languageId(){return this._languageId}get version(){return this._version}getText(e){if(e){const n=this.offsetAt(e.start);const r=this.offsetAt(e.end);return this._content.substring(n,r)}return this._content}update(e,n){for(const r of e){if(Ya.isIncremental(r)){const i=Sv(r.range);const a=this.offsetAt(i.start);const s=this.offsetAt(i.end);this._content=this._content.substring(0,a)+r.text+this._content.substring(s,this._content.length);const o=Math.max(i.start.line,0);const l=Math.max(i.end.line,0);let u=this._lineOffsets;const c=Rh(r.text,false,a);if(l-o===c.length){for(let f=0,p=c.length;f<p;f++){u[f+o+1]=c[f]}}else{if(c.length<1e4){u.splice(o+1,l-o,...c)}else{this._lineOffsets=u=u.slice(0,o+1).concat(c,u.slice(l+1))}}const d=r.text.length-(s-a);if(d!==0){for(let f=o+1+c.length,p=u.length;f<p;f++){u[f]=u[f]+d}}}else if(Ya.isFull(r)){this._content=r.text;this._lineOffsets=void 0}else{throw new Error("Unknown change event received")}}this._version=n}getLineOffsets(){if(this._lineOffsets===void 0){this._lineOffsets=Rh(this._content,true)}return this._lineOffsets}positionAt(e){e=Math.max(Math.min(e,this._content.length),0);const n=this.getLineOffsets();let r=0,i=n.length;if(i===0){return{line:0,character:e}}while(r<i){const s=Math.floor((r+i)/2);if(n[s]>e){i=s}else{r=s+1}}const a=r-1;e=this.ensureBeforeEOL(e,n[a]);return{line:a,character:e-n[a]}}offsetAt(e){const n=this.getLineOffsets();if(e.line>=n.length){return this._content.length}else if(e.line<0){return 0}const r=n[e.line];if(e.character<=0){return r}const i=e.line+1<n.length?n[e.line+1]:this._content.length;const a=Math.min(r+e.character,i);return this.ensureBeforeEOL(a,r)}ensureBeforeEOL(e,n){while(e>n&&Av(this._content.charCodeAt(e-1))){e--}return e}get lineCount(){return this.getLineOffsets().length}static isIncremental(e){const n=e;return n!==void 0&&n!==null&&typeof n.text==="string"&&n.range!==void 0&&(n.rangeLength===void 0||typeof n.rangeLength==="number")}static isFull(e){const n=e;return n!==void 0&&n!==null&&typeof n.text==="string"&&n.range===void 0&&n.rangeLength===void 0}}var Iu;(function(t){function e(i,a,s,o){return new Ya(i,a,s,o)}t.create=e;function n(i,a,s){if(i instanceof Ya){i.update(a,s);return i}else{throw new Error("TextDocument.update: document must be created by TextDocument.create")}}t.update=n;function r(i,a){const s=i.getText();const o=rp(a.map(pP),(c,d)=>{const f=c.range.start.line-d.range.start.line;if(f===0){return c.range.start.character-d.range.start.character}return f});let l=0;const u=[];for(const c of o){const d=i.offsetAt(c.range.start);if(d<l){throw new Error("Overlapping edit")}else if(d>l){u.push(s.substring(l,d))}if(c.newText.length){u.push(c.newText)}l=i.offsetAt(c.range.end)}u.push(s.substr(l));return u.join("")}t.applyEdits=r})(Iu||(Iu={}));function rp(t,e){if(t.length<=1){return t}const n=t.length/2|0;const r=t.slice(0,n);const i=t.slice(n);rp(r,e);rp(i,e);let a=0;let s=0;let o=0;while(a<r.length&&s<i.length){const l=e(r[a],i[s]);if(l<=0){t[o++]=r[a++]}else{t[o++]=i[s++]}}while(a<r.length){t[o++]=r[a++]}while(s<i.length){t[o++]=i[s++]}return t}function Rh(t,e,n=0){const r=e?[n]:[];for(let i=0;i<t.length;i++){const a=t.charCodeAt(i);if(Av(a)){if(a===13&&i+1<t.length&&t.charCodeAt(i+1)===10){i++}r.push(n+i+1)}}return r}function Av(t){return t===13||t===10}function Sv(t){const e=t.start;const n=t.end;if(e.line>n.line||e.line===n.line&&e.character>n.character){return{start:n,end:e}}return t}function pP(t){const e=Sv(t.range);if(e!==t.range){return{newText:t.newText,range:e}}return t}var kv;(()=>{var t={470:i=>{function a(l){if("string"!=typeof l)throw new TypeError("Path must be a string. Received "+JSON.stringify(l))}function s(l,u){for(var c,d="",f=0,p=-1,y=0,v=0;v<=l.length;++v){if(v<l.length)c=l.charCodeAt(v);else{if(47===c)break;c=47}if(47===c){if(p===v-1||1===y);else if(p!==v-1&&2===y){if(d.length<2||2!==f||46!==d.charCodeAt(d.length-1)||46!==d.charCodeAt(d.length-2)){if(d.length>2){var k=d.lastIndexOf("/");if(k!==d.length-1){-1===k?(d="",f=0):f=(d=d.slice(0,k)).length-1-d.lastIndexOf("/"),p=v,y=0;continue}}else if(2===d.length||1===d.length){d="",f=0,p=v,y=0;continue}}u&&(d.length>0?d+="/..":d="..",f=2)}else d.length>0?d+="/"+l.slice(p+1,v):d=l.slice(p+1,v),f=v-p-1;p=v,y=0}else 46===c&&-1!==y?++y:y=-1}return d}var o={resolve:function(){for(var l,u="",c=false,d=arguments.length-1;d>=-1&&!c;d--){var f;d>=0?f=arguments[d]:(void 0===l&&(l=process.cwd()),f=l),a(f),0!==f.length&&(u=f+"/"+u,c=47===f.charCodeAt(0))}return u=s(u,!c),c?u.length>0?"/"+u:"/":u.length>0?u:"."},normalize:function(l){if(a(l),0===l.length)return".";var u=47===l.charCodeAt(0),c=47===l.charCodeAt(l.length-1);return 0!==(l=s(l,!u)).length||u||(l="."),l.length>0&&c&&(l+="/"),u?"/"+l:l},isAbsolute:function(l){return a(l),l.length>0&&47===l.charCodeAt(0)},join:function(){if(0===arguments.length)return".";for(var l,u=0;u<arguments.length;++u){var c=arguments[u];a(c),c.length>0&&(void 0===l?l=c:l+="/"+c)}return void 0===l?".":o.normalize(l)},relative:function(l,u){if(a(l),a(u),l===u)return"";if((l=o.resolve(l))===(u=o.resolve(u)))return"";for(var c=1;c<l.length&&47===l.charCodeAt(c);++c);for(var d=l.length,f=d-c,p=1;p<u.length&&47===u.charCodeAt(p);++p);for(var y=u.length-p,v=f<y?f:y,k=-1,$=0;$<=v;++$){if($===v){if(y>v){if(47===u.charCodeAt(p+$))return u.slice(p+$+1);if(0===$)return u.slice(p+$)}else f>v&&(47===l.charCodeAt(c+$)?k=$:0===$&&(k=0));break}var E=l.charCodeAt(c+$);if(E!==u.charCodeAt(p+$))break;47===E&&(k=$)}var C="";for($=c+k+1;$<=d;++$)$!==d&&47!==l.charCodeAt($)||(0===C.length?C+="..":C+="/..");return C.length>0?C+u.slice(p+k):(p+=k,47===u.charCodeAt(p)&&++p,u.slice(p))},_makeLong:function(l){return l},dirname:function(l){if(a(l),0===l.length)return".";for(var u=l.charCodeAt(0),c=47===u,d=-1,f=true,p=l.length-1;p>=1;--p)if(47===(u=l.charCodeAt(p))){if(!f){d=p;break}}else f=false;return-1===d?c?"/":".":c&&1===d?"//":l.slice(0,d)},basename:function(l,u){if(void 0!==u&&"string"!=typeof u)throw new TypeError('"ext" argument must be a string');a(l);var c,d=0,f=-1,p=true;if(void 0!==u&&u.length>0&&u.length<=l.length){if(u.length===l.length&&u===l)return"";var y=u.length-1,v=-1;for(c=l.length-1;c>=0;--c){var k=l.charCodeAt(c);if(47===k){if(!p){d=c+1;break}}else-1===v&&(p=false,v=c+1),y>=0&&(k===u.charCodeAt(y)?-1==--y&&(f=c):(y=-1,f=v))}return d===f?f=v:-1===f&&(f=l.length),l.slice(d,f)}for(c=l.length-1;c>=0;--c)if(47===l.charCodeAt(c)){if(!p){d=c+1;break}}else-1===f&&(p=false,f=c+1);return-1===f?"":l.slice(d,f)},extname:function(l){a(l);for(var u=-1,c=0,d=-1,f=true,p=0,y=l.length-1;y>=0;--y){var v=l.charCodeAt(y);if(47!==v)-1===d&&(f=false,d=y+1),46===v?-1===u?u=y:1!==p&&(p=1):-1!==u&&(p=-1);else if(!f){c=y+1;break}}return-1===u||-1===d||0===p||1===p&&u===d-1&&u===c+1?"":l.slice(u,d)},format:function(l){if(null===l||"object"!=typeof l)throw new TypeError('The "pathObject" argument must be of type Object. Received type '+typeof l);return function(u,c){var d=c.dir||c.root,f=c.base||(c.name||"")+(c.ext||"");return d?d===c.root?d+f:d+"/"+f:f}(0,l)},parse:function(l){a(l);var u={root:"",dir:"",base:"",ext:"",name:""};if(0===l.length)return u;var c,d=l.charCodeAt(0),f=47===d;f?(u.root="/",c=1):c=0;for(var p=-1,y=0,v=-1,k=true,$=l.length-1,E=0;$>=c;--$)if(47!==(d=l.charCodeAt($)))-1===v&&(k=false,v=$+1),46===d?-1===p?p=$:1!==E&&(E=1):-1!==p&&(E=-1);else if(!k){y=$+1;break}return-1===p||-1===v||0===E||1===E&&p===v-1&&p===y+1?-1!==v&&(u.base=u.name=0===y&&f?l.slice(1,v):l.slice(y,v)):(0===y&&f?(u.name=l.slice(1,p),u.base=l.slice(1,v)):(u.name=l.slice(y,p),u.base=l.slice(y,v)),u.ext=l.slice(p,v)),y>0?u.dir=l.slice(0,y-1):f&&(u.dir="/"),u},sep:"/",delimiter:":",win32:null,posix:null};o.posix=o,i.exports=o}},e={};function n(i){var a=e[i];if(void 0!==a)return a.exports;var s=e[i]={exports:{}};return t[i](s,s.exports,n),s.exports}n.d=(i,a)=>{for(var s in a)n.o(a,s)&&!n.o(i,s)&&Object.defineProperty(i,s,{enumerable:true,get:a[s]})},n.o=(i,a)=>Object.prototype.hasOwnProperty.call(i,a),n.r=i=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(i,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(i,"__esModule",{value:true})};var r={};(()=>{let i;if(n.r(r),n.d(r,{URI:()=>f,Utils:()=>de}),"object"==typeof process)i="win32"===process.platform;else if("object"==typeof navigator){let L=navigator.userAgent;i=L.indexOf("Windows")>=0}const a=/^\w[\w\d+.-]*$/,s=/^\//,o=/^\/\//;function l(L,w){if(!L.scheme&&w)throw new Error(`[UriError]: Scheme is missing: {scheme: "", authority: "${L.authority}", path: "${L.path}", query: "${L.query}", fragment: "${L.fragment}"}`);if(L.scheme&&!a.test(L.scheme))throw new Error("[UriError]: Scheme contains illegal characters.");if(L.path){if(L.authority){if(!s.test(L.path))throw new Error('[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character')}else if(o.test(L.path))throw new Error('[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")')}}const u="",c="/",d=/^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;class f{static isUri(w){return w instanceof f||!!w&&"string"==typeof w.authority&&"string"==typeof w.fragment&&"string"==typeof w.path&&"string"==typeof w.query&&"string"==typeof w.scheme&&"string"==typeof w.fsPath&&"function"==typeof w.with&&"function"==typeof w.toString}scheme;authority;path;query;fragment;constructor(w,g,b,M,O,x=false){"object"==typeof w?(this.scheme=w.scheme||u,this.authority=w.authority||u,this.path=w.path||u,this.query=w.query||u,this.fragment=w.fragment||u):(this.scheme=function(we,F){return we||F?we:"file"}(w,x),this.authority=g||u,this.path=function(we,F){switch(we){case"https":case"http":case"file":F?F[0]!==c&&(F=c+F):F=c}return F}(this.scheme,b||u),this.query=M||u,this.fragment=O||u,l(this,x))}get fsPath(){return E(this)}with(w){if(!w)return this;let{scheme:g,authority:b,path:M,query:O,fragment:x}=w;return void 0===g?g=this.scheme:null===g&&(g=u),void 0===b?b=this.authority:null===b&&(b=u),void 0===M?M=this.path:null===M&&(M=u),void 0===O?O=this.query:null===O&&(O=u),void 0===x?x=this.fragment:null===x&&(x=u),g===this.scheme&&b===this.authority&&M===this.path&&O===this.query&&x===this.fragment?this:new y(g,b,M,O,x)}static parse(w,g=false){const b=d.exec(w);return b?new y(b[2]||u,q(b[4]||u),q(b[5]||u),q(b[7]||u),q(b[9]||u),g):new y(u,u,u,u,u)}static file(w){let g=u;if(i&&(w=w.replace(/\\/g,c)),w[0]===c&&w[1]===c){const b=w.indexOf(c,2);-1===b?(g=w.substring(2),w=c):(g=w.substring(2,b),w=w.substring(b)||c)}return new y("file",g,w,u,u)}static from(w){const g=new y(w.scheme,w.authority,w.path,w.query,w.fragment);return l(g,true),g}toString(w=false){return C(this,w)}toJSON(){return this}static revive(w){if(w){if(w instanceof f)return w;{const g=new y(w);return g._formatted=w.external,g._fsPath=w._sep===p?w.fsPath:null,g}}return w}}const p=i?1:void 0;class y extends f{_formatted=null;_fsPath=null;get fsPath(){return this._fsPath||(this._fsPath=E(this)),this._fsPath}toString(w=false){return w?C(this,true):(this._formatted||(this._formatted=C(this,false)),this._formatted)}toJSON(){const w={$mid:1};return this._fsPath&&(w.fsPath=this._fsPath,w._sep=p),this._formatted&&(w.external=this._formatted),this.path&&(w.path=this.path),this.scheme&&(w.scheme=this.scheme),this.authority&&(w.authority=this.authority),this.query&&(w.query=this.query),this.fragment&&(w.fragment=this.fragment),w}}const v={58:"%3A",47:"%2F",63:"%3F",35:"%23",91:"%5B",93:"%5D",64:"%40",33:"%21",36:"%24",38:"%26",39:"%27",40:"%28",41:"%29",42:"%2A",43:"%2B",44:"%2C",59:"%3B",61:"%3D",32:"%20"};function k(L,w,g){let b,M=-1;for(let O=0;O<L.length;O++){const x=L.charCodeAt(O);if(x>=97&&x<=122||x>=65&&x<=90||x>=48&&x<=57||45===x||46===x||95===x||126===x||w&&47===x||g&&91===x||g&&93===x||g&&58===x)-1!==M&&(b+=encodeURIComponent(L.substring(M,O)),M=-1),void 0!==b&&(b+=L.charAt(O));else{void 0===b&&(b=L.substr(0,O));const we=v[x];void 0!==we?(-1!==M&&(b+=encodeURIComponent(L.substring(M,O)),M=-1),b+=we):-1===M&&(M=O)}}return-1!==M&&(b+=encodeURIComponent(L.substring(M))),void 0!==b?b:L}function $(L){let w;for(let g=0;g<L.length;g++){const b=L.charCodeAt(g);35===b||63===b?(void 0===w&&(w=L.substr(0,g)),w+=v[b]):void 0!==w&&(w+=L[g])}return void 0!==w?w:L}function E(L,w){let g;return g=L.authority&&L.path.length>1&&"file"===L.scheme?`//${L.authority}${L.path}`:47===L.path.charCodeAt(0)&&(L.path.charCodeAt(1)>=65&&L.path.charCodeAt(1)<=90||L.path.charCodeAt(1)>=97&&L.path.charCodeAt(1)<=122)&&58===L.path.charCodeAt(2)?L.path[1].toLowerCase()+L.path.substr(2):L.path,i&&(g=g.replace(/\//g,"\\")),g}function C(L,w){const g=w?$:k;let b="",{scheme:M,authority:O,path:x,query:we,fragment:F}=L;if(M&&(b+=M,b+=":"),(O||"file"===M)&&(b+=c,b+=c),O){let N=O.indexOf("@");if(-1!==N){const re=O.substr(0,N);O=O.substr(N+1),N=re.lastIndexOf(":"),-1===N?b+=g(re,false,false):(b+=g(re.substr(0,N),false,false),b+=":",b+=g(re.substr(N+1),false,true)),b+="@"}O=O.toLowerCase(),N=O.lastIndexOf(":"),-1===N?b+=g(O,false,true):(b+=g(O.substr(0,N),false,true),b+=O.substr(N))}if(x){if(x.length>=3&&47===x.charCodeAt(0)&&58===x.charCodeAt(2)){const N=x.charCodeAt(1);N>=65&&N<=90&&(x=`/${String.fromCharCode(N+32)}:${x.substr(3)}`)}else if(x.length>=2&&58===x.charCodeAt(1)){const N=x.charCodeAt(0);N>=65&&N<=90&&(x=`${String.fromCharCode(N+32)}:${x.substr(2)}`)}b+=g(x,true,false)}return we&&(b+="?",b+=g(we,false,false)),F&&(b+="#",b+=w?F:k(F,false,false)),b}function I(L){try{return decodeURIComponent(L)}catch{return L.length>3?L.substr(0,3)+I(L.substr(3)):L}}const X=/(%[0-9A-Za-z][0-9A-Za-z])+/g;function q(L){return L.match(X)?L.replace(X,w=>I(w)):L}var J=n(470);const ne=J.posix||J,ae="/";var de;!function(L){L.joinPath=function(w,...g){return w.with({path:ne.join(w.path,...g)})},L.resolvePath=function(w,...g){let b=w.path,M=false;b[0]!==ae&&(b=ae+b,M=true);let O=ne.resolve(b,...g);return M&&O[0]===ae&&!w.authority&&(O=O.substring(1)),w.with({path:O})},L.dirname=function(w){if(0===w.path.length||w.path===ae)return w;let g=ne.dirname(w.path);return 1===g.length&&46===g.charCodeAt(0)&&(g=""),w.with({path:g})},L.basename=function(w){return ne.basename(w.path)},L.extname=function(w){return ne.extname(w.path)}}(de||(de={}))})(),kv=r})();const{URI:lt,Utils:di}=kv;var Ge;(function(t){t.basename=di.basename;t.dirname=di.dirname;t.extname=di.extname;t.joinPath=di.joinPath;t.resolvePath=di.resolvePath;function e(i,a){return(i===null||i===void 0?void 0:i.toString())===(a===null||a===void 0?void 0:a.toString())}t.equals=e;function n(i,a){const s=typeof i==="string"?i:i.path;const o=typeof a==="string"?a:a.path;const l=s.split("/").filter(p=>p.length>0);const u=o.split("/").filter(p=>p.length>0);let c=0;for(;c<l.length;c++){if(l[c]!==u[c]){break}}const d="../".repeat(l.length-c);const f=u.slice(c).join("/");return d+f}t.relative=n;function r(i){return lt.parse(i.toString()).toString()}t.normalize=r})(Ge||(Ge={}));var z;(function(t){t[t["Changed"]=0]="Changed";t[t["Parsed"]=1]="Parsed";t[t["IndexedContent"]=2]="IndexedContent";t[t["ComputedScopes"]=3]="ComputedScopes";t[t["Linked"]=4]="Linked";t[t["IndexedReferences"]=5]="IndexedReferences";t[t["Validated"]=6]="Validated"})(z||(z={}));class bv{constructor(e){this.serviceRegistry=e.ServiceRegistry;this.textDocuments=e.workspace.TextDocuments;this.fileSystemProvider=e.workspace.FileSystemProvider}async fromUri(e,n=ye.CancellationToken.None){const r=await this.fileSystemProvider.readFile(e);return this.createAsync(e,r,n)}fromTextDocument(e,n,r){n=n!==null&&n!==void 0?n:lt.parse(e.uri);if(ye.CancellationToken.is(r)){return this.createAsync(n,e,r)}else{return this.create(n,e,r)}}fromString(e,n,r){if(ye.CancellationToken.is(r)){return this.createAsync(n,e,r)}else{return this.create(n,e,r)}}fromModel(e,n){return this.create(n,{$model:e})}create(e,n,r){if(typeof n==="string"){const i=this.parse(e,n,r);return this.createLangiumDocument(i,e,void 0,n)}else if("$model"in n){const i={value:n.$model,parserErrors:[],lexerErrors:[]};return this.createLangiumDocument(i,e)}else{const i=this.parse(e,n.getText(),r);return this.createLangiumDocument(i,e,n)}}async createAsync(e,n,r){if(typeof n==="string"){const i=await this.parseAsync(e,n,r);return this.createLangiumDocument(i,e,void 0,n)}else{const i=await this.parseAsync(e,n.getText(),r);return this.createLangiumDocument(i,e,n)}}createLangiumDocument(e,n,r,i){let a;if(r){a={parseResult:e,uri:n,state:z.Parsed,references:[],textDocument:r}}else{const s=this.createTextDocumentGetter(n,i);a={parseResult:e,uri:n,state:z.Parsed,references:[],get textDocument(){return s()}}}e.value.$document=a;return a}async update(e,n){var r,i;const a=(r=e.parseResult.value.$cstNode)===null||r===void 0?void 0:r.root.fullText;const s=(i=this.textDocuments)===null||i===void 0?void 0:i.get(e.uri.toString());const o=s?s.getText():await this.fileSystemProvider.readFile(e.uri);if(s){Object.defineProperty(e,"textDocument",{value:s})}else{const l=this.createTextDocumentGetter(e.uri,o);Object.defineProperty(e,"textDocument",{get:l})}if(a!==o){e.parseResult=await this.parseAsync(e.uri,o,n);e.parseResult.value.$document=e}e.state=z.Parsed;return e}parse(e,n,r){const i=this.serviceRegistry.getServices(e);return i.parser.LangiumParser.parse(n,r)}parseAsync(e,n,r){const i=this.serviceRegistry.getServices(e);return i.parser.AsyncParser.parse(n,r)}createTextDocumentGetter(e,n){const r=this.serviceRegistry;let i=void 0;return()=>{return i!==null&&i!==void 0?i:i=Iu.create(e.toString(),r.getServices(e).LanguageMetaData.languageId,0,n!==null&&n!==void 0?n:"")}}}class mP{constructor(e){this.documentMap=new Map;this.langiumDocumentFactory=e.workspace.LangiumDocumentFactory;this.serviceRegistry=e.ServiceRegistry}get all(){return be(this.documentMap.values())}addDocument(e){const n=e.uri.toString();if(this.documentMap.has(n)){throw new Error(`A document with the URI '${n}' is already present.`)}this.documentMap.set(n,e)}getDocument(e){const n=e.toString();return this.documentMap.get(n)}async getOrCreateDocument(e,n){let r=this.getDocument(e);if(r){return r}r=await this.langiumDocumentFactory.fromUri(e,n);this.addDocument(r);return r}createDocument(e,n,r){if(r){return this.langiumDocumentFactory.fromString(n,e,r).then(i=>{this.addDocument(i);return i})}else{const i=this.langiumDocumentFactory.fromString(n,e);this.addDocument(i);return i}}hasDocument(e){return this.documentMap.has(e.toString())}invalidateDocument(e){const n=e.toString();const r=this.documentMap.get(n);if(r){const i=this.serviceRegistry.getServices(e).references.Linker;i.unlink(r);r.state=z.Changed;r.precomputedScopes=void 0;r.diagnostics=void 0}return r}deleteDocument(e){const n=e.toString();const r=this.documentMap.get(n);if(r){r.state=z.Changed;this.documentMap.delete(n)}return r}}const bc=Symbol("ref_resolving");class hP{constructor(e){this.reflection=e.shared.AstReflection;this.langiumDocuments=()=>e.shared.workspace.LangiumDocuments;this.scopeProvider=e.references.ScopeProvider;this.astNodeLocator=e.workspace.AstNodeLocator}async link(e,n=ye.CancellationToken.None){for(const r of Xn(e.parseResult.value)){await ht(n);Dg(r).forEach(i=>this.doLink(i,e))}}doLink(e,n){var r;const i=e.reference;if(i._ref===void 0){i._ref=bc;try{const a=this.getCandidate(e);if(ql(a)){i._ref=a}else{i._nodeDescription=a;if(this.langiumDocuments().hasDocument(a.documentUri)){const s=this.loadAstNode(a);i._ref=s!==null&&s!==void 0?s:this.createLinkingError(e,a)}else{i._ref=void 0}}}catch(a){console.error(`An error occurred while resolving reference to '${i.$refText}':`,a);const s=(r=a.message)!==null&&r!==void 0?r:String(a);i._ref=Object.assign(Object.assign({},e),{message:`An error occurred while resolving reference to '${i.$refText}': ${s}`})}n.references.push(i)}}unlink(e){for(const n of e.references){delete n._ref;delete n._nodeDescription}e.references=[]}getCandidate(e){const n=this.scopeProvider.getScope(e);const r=n.getElement(e.reference.$refText);return r!==null&&r!==void 0?r:this.createLinkingError(e)}buildReference(e,n,r,i){const a=this;const s={$refNode:r,$refText:i,get ref(){var o;if(rt(this._ref)){return this._ref}else if(Rg(this._nodeDescription)){const l=a.loadAstNode(this._nodeDescription);this._ref=l!==null&&l!==void 0?l:a.createLinkingError({reference:s,container:e,property:n},this._nodeDescription)}else if(this._ref===void 0){this._ref=bc;const l=cu(e).$document;const u=a.getLinkedNode({reference:s,container:e,property:n});if(u.error&&l&&l.state<z.ComputedScopes){return this._ref=void 0}this._ref=(o=u.node)!==null&&o!==void 0?o:u.error;this._nodeDescription=u.descr;l===null||l===void 0?void 0:l.references.push(this)}else if(this._ref===bc){throw new Error(`Cyclic reference resolution detected: ${a.astNodeLocator.getAstNodePath(e)}/${n} (symbol '${i}')`)}return rt(this._ref)?this._ref:void 0},get $nodeDescription(){return this._nodeDescription},get error(){return ql(this._ref)?this._ref:void 0}};return s}getLinkedNode(e){var n;try{const r=this.getCandidate(e);if(ql(r)){return{error:r}}const i=this.loadAstNode(r);if(i){return{node:i,descr:r}}else{return{descr:r,error:this.createLinkingError(e,r)}}}catch(r){console.error(`An error occurred while resolving reference to '${e.reference.$refText}':`,r);const i=(n=r.message)!==null&&n!==void 0?n:String(r);return{error:Object.assign(Object.assign({},e),{message:`An error occurred while resolving reference to '${e.reference.$refText}': ${i}`})}}}loadAstNode(e){if(e.node){return e.node}const n=this.langiumDocuments().getDocument(e.documentUri);if(!n){return void 0}return this.astNodeLocator.getAstNode(n.parseResult.value,e.path)}createLinkingError(e,n){const r=cu(e.container).$document;if(r&&r.state<z.ComputedScopes){console.warn(`Attempted reference resolution before document reached ComputedScopes state (${r.uri}).`)}const i=this.reflection.getReferenceType(e);return Object.assign(Object.assign({},e),{message:`Could not resolve reference to ${i} named '${e.reference.$refText}'.`,targetDescription:n})}}function Nv(t){return typeof t.name==="string"}class Pv{getName(e){if(Nv(e)){return e.name}return void 0}getNameNode(e){return mp(e.$cstNode,"name")}}class _v{constructor(e){this.nameProvider=e.references.NameProvider;this.index=e.shared.workspace.IndexManager;this.nodeLocator=e.workspace.AstNodeLocator}findDeclaration(e){if(e){const n=sT(e);const r=e.astNode;if(n&&r){const i=r[n.feature];if(on(i)){return i.ref}else if(Array.isArray(i)){for(const a of i){if(on(a)&&a.$refNode&&a.$refNode.offset<=e.offset&&a.$refNode.end>=e.end){return a.ref}}}}if(r){const i=this.nameProvider.getNameNode(r);if(i&&(i===e||A$(e,i))){return r}}}return void 0}findDeclarationNode(e){const n=this.findDeclaration(e);if(n===null||n===void 0?void 0:n.$cstNode){const r=this.nameProvider.getNameNode(n);return r!==null&&r!==void 0?r:n.$cstNode}return void 0}findReferences(e,n){const r=[];if(n.includeDeclaration){const a=this.getReferenceToSelf(e);if(a){r.push(a)}}let i=this.index.findAllReferences(e,this.nodeLocator.getAstNodePath(e));if(n.documentUri){i=i.filter(a=>Ge.equals(a.sourceUri,n.documentUri))}r.push(...i);return be(r)}getReferenceToSelf(e){const n=this.nameProvider.getNameNode(e);if(n){const r=yt(e);const i=this.nodeLocator.getAstNodePath(e);return{sourceUri:r.uri,sourcePath:i,targetUri:r.uri,targetPath:i,segment:uu(n),local:true}}return void 0}}class Lu{constructor(e){this.map=new Map;if(e){for(const[n,r]of e){this.add(n,r)}}}get size(){return Ld.sum(be(this.map.values()).map(e=>e.length))}clear(){this.map.clear()}delete(e,n){if(n===void 0){return this.map.delete(e)}else{const r=this.map.get(e);if(r){const i=r.indexOf(n);if(i>=0){if(r.length===1){this.map.delete(e)}else{r.splice(i,1)}return true}}return false}}get(e){var n;return(n=this.map.get(e))!==null&&n!==void 0?n:[]}has(e,n){if(n===void 0){return this.map.has(e)}else{const r=this.map.get(e);if(r){return r.indexOf(n)>=0}return false}}add(e,n){if(this.map.has(e)){this.map.get(e).push(n)}else{this.map.set(e,[n])}return this}addAll(e,n){if(this.map.has(e)){this.map.get(e).push(...n)}else{this.map.set(e,Array.from(n))}return this}forEach(e){this.map.forEach((n,r)=>n.forEach(i=>e(i,r,this)))}[Symbol.iterator](){return this.entries().iterator()}entries(){return be(this.map.entries()).flatMap(([e,n])=>n.map(r=>[e,r]))}keys(){return be(this.map.keys())}values(){return be(this.map.values()).flat()}entriesGroupedByKey(){return be(this.map.entries())}}class vh{get size(){return this.map.size}constructor(e){this.map=new Map;this.inverse=new Map;if(e){for(const[n,r]of e){this.set(n,r)}}}clear(){this.map.clear();this.inverse.clear()}set(e,n){this.map.set(e,n);this.inverse.set(n,e);return this}get(e){return this.map.get(e)}getKey(e){return this.inverse.get(e)}delete(e){const n=this.map.get(e);if(n!==void 0){this.map.delete(e);this.inverse.delete(n);return true}return false}}class Dv{constructor(e){this.nameProvider=e.references.NameProvider;this.descriptions=e.workspace.AstNodeDescriptionProvider}async computeExports(e,n=ye.CancellationToken.None){return this.computeExportsForNode(e.parseResult.value,e,void 0,n)}async computeExportsForNode(e,n,r=Hu,i=ye.CancellationToken.None){const a=[];this.exportNode(e,a,n);for(const s of r(e)){await ht(i);this.exportNode(s,a,n)}return a}exportNode(e,n,r){const i=this.nameProvider.getName(e);if(i){n.push(this.descriptions.createDescription(e,i,r))}}async computeLocalScopes(e,n=ye.CancellationToken.None){const r=e.parseResult.value;const i=new Lu;for(const a of Nr(r)){await ht(n);this.processNode(a,e,i)}return i}processNode(e,n,r){const i=e.$container;if(i){const a=this.nameProvider.getName(e);if(a){r.add(i,this.descriptions.createDescription(e,a,n))}}}}class $h{constructor(e,n,r){var i;this.elements=e;this.outerScope=n;this.caseInsensitive=(i=r===null||r===void 0?void 0:r.caseInsensitive)!==null&&i!==void 0?i:false}getAllElements(){if(this.outerScope){return this.elements.concat(this.outerScope.getAllElements())}else{return this.elements}}getElement(e){const n=this.caseInsensitive?this.elements.find(r=>r.name.toLowerCase()===e.toLowerCase()):this.elements.find(r=>r.name===e);if(n){return n}if(this.outerScope){return this.outerScope.getElement(e)}return void 0}}class Ov{constructor(e,n,r){var i;this.elements=new Map;this.caseInsensitive=(i=r===null||r===void 0?void 0:r.caseInsensitive)!==null&&i!==void 0?i:false;for(const a of e){const s=this.caseInsensitive?a.name.toLowerCase():a.name;this.elements.set(s,a)}this.outerScope=n}getElement(e){const n=this.caseInsensitive?e.toLowerCase():e;const r=this.elements.get(n);if(r){return r}if(this.outerScope){return this.outerScope.getElement(e)}return void 0}getAllElements(){let e=be(this.elements.values());if(this.outerScope){e=e.concat(this.outerScope.getAllElements())}return e}}const yP={getElement(){return void 0},getAllElements(){return Tg}};class Iv{constructor(){this.toDispose=[];this.isDisposed=false}onDispose(e){this.toDispose.push(e)}dispose(){this.throwIfDisposed();this.clear();this.isDisposed=true;this.toDispose.forEach(e=>e.dispose())}throwIfDisposed(){if(this.isDisposed){throw new Error("This cache has already been disposed")}}}class gP extends Iv{constructor(){super(...arguments);this.cache=new Map}has(e){this.throwIfDisposed();return this.cache.has(e)}set(e,n){this.throwIfDisposed();this.cache.set(e,n)}get(e,n){this.throwIfDisposed();if(this.cache.has(e)){return this.cache.get(e)}else if(n){const r=n();this.cache.set(e,r);return r}else{return void 0}}delete(e){this.throwIfDisposed();return this.cache.delete(e)}clear(){this.throwIfDisposed();this.cache.clear()}}class Lv extends Iv{constructor(e){super();this.cache=new Map;this.converter=e!==null&&e!==void 0?e:n=>n}has(e,n){this.throwIfDisposed();return this.cacheForContext(e).has(n)}set(e,n,r){this.throwIfDisposed();this.cacheForContext(e).set(n,r)}get(e,n,r){this.throwIfDisposed();const i=this.cacheForContext(e);if(i.has(n)){return i.get(n)}else if(r){const a=r();i.set(n,a);return a}else{return void 0}}delete(e,n){this.throwIfDisposed();return this.cacheForContext(e).delete(n)}clear(e){this.throwIfDisposed();if(e){const n=this.converter(e);this.cache.delete(n)}else{this.cache.clear()}}cacheForContext(e){const n=this.converter(e);let r=this.cache.get(n);if(!r){r=new Map;this.cache.set(n,r)}return r}}class RP extends Lv{constructor(e,n){super(r=>r.toString());if(n){this.toDispose.push(e.workspace.DocumentBuilder.onDocumentPhase(n,r=>{this.clear(r.uri.toString())}));this.toDispose.push(e.workspace.DocumentBuilder.onUpdate((r,i)=>{for(const a of i){this.clear(a)}}))}else{this.toDispose.push(e.workspace.DocumentBuilder.onUpdate((r,i)=>{const a=r.concat(i);for(const s of a){this.clear(s)}}))}}}class vP extends gP{constructor(e,n){super();if(n){this.toDispose.push(e.workspace.DocumentBuilder.onBuildPhase(n,()=>{this.clear()}));this.toDispose.push(e.workspace.DocumentBuilder.onUpdate((r,i)=>{if(i.length>0){this.clear()}}))}else{this.toDispose.push(e.workspace.DocumentBuilder.onUpdate(()=>{this.clear()}))}}}class xv{constructor(e){this.reflection=e.shared.AstReflection;this.nameProvider=e.references.NameProvider;this.descriptions=e.workspace.AstNodeDescriptionProvider;this.indexManager=e.shared.workspace.IndexManager;this.globalScopeCache=new vP(e.shared)}getScope(e){const n=[];const r=this.reflection.getReferenceType(e);const i=yt(e.container).precomputedScopes;if(i){let s=e.container;do{const o=i.get(s);if(o.length>0){n.push(be(o).filter(l=>this.reflection.isSubtype(l.type,r)))}s=s.$container}while(s)}let a=this.getGlobalScope(r,e);for(let s=n.length-1;s>=0;s--){a=this.createScope(n[s],a)}return a}createScope(e,n,r){return new $h(be(e),n,r)}createScopeForNodes(e,n,r){const i=be(e).map(a=>{const s=this.nameProvider.getName(a);if(s){return this.descriptions.createDescription(a,s)}return void 0}).nonNullable();return new $h(i,n,r)}getGlobalScope(e,n){return this.globalScopeCache.get(e,()=>new Ov(this.indexManager.allElements(e)))}}function $P(t){return typeof t.$comment==="string"}function Th(t){return typeof t==="object"&&!!t&&("$ref"in t||"$error"in t)}class TP{constructor(e){this.ignoreProperties=new Set(["$container","$containerProperty","$containerIndex","$document","$cstNode"]);this.langiumDocuments=e.shared.workspace.LangiumDocuments;this.astNodeLocator=e.workspace.AstNodeLocator;this.nameProvider=e.references.NameProvider;this.commentProvider=e.documentation.CommentProvider}serialize(e,n){const r=n!==null&&n!==void 0?n:{};const i=n===null||n===void 0?void 0:n.replacer;const a=(o,l)=>this.replacer(o,l,r);const s=i?(o,l)=>i(o,l,a):a;try{this.currentDocument=yt(e);return JSON.stringify(e,s,n===null||n===void 0?void 0:n.space)}finally{this.currentDocument=void 0}}deserialize(e,n){const r=n!==null&&n!==void 0?n:{};const i=JSON.parse(e);this.linkNode(i,i,r);return i}replacer(e,n,{refText:r,sourceText:i,textRegions:a,comments:s,uriConverter:o}){var l,u,c,d;if(this.ignoreProperties.has(e)){return void 0}else if(on(n)){const f=n.ref;const p=r?n.$refText:void 0;if(f){const y=yt(f);let v="";if(this.currentDocument&&this.currentDocument!==y){if(o){v=o(y.uri,n)}else{v=y.uri.toString()}}const k=this.astNodeLocator.getAstNodePath(f);return{$ref:`${v}#${k}`,$refText:p}}else{return{$error:(u=(l=n.error)===null||l===void 0?void 0:l.message)!==null&&u!==void 0?u:"Could not resolve reference",$refText:p}}}else if(rt(n)){let f=void 0;if(a){f=this.addAstNodeRegionWithAssignmentsTo(Object.assign({},n));if((!e||n.$document)&&(f===null||f===void 0?void 0:f.$textRegion)){f.$textRegion.documentURI=(c=this.currentDocument)===null||c===void 0?void 0:c.uri.toString()}}if(i&&!e){f!==null&&f!==void 0?f:f=Object.assign({},n);f.$sourceText=(d=n.$cstNode)===null||d===void 0?void 0:d.text}if(s){f!==null&&f!==void 0?f:f=Object.assign({},n);const p=this.commentProvider.getComment(n);if(p){f.$comment=p.replace(/\r/g,"")}}return f!==null&&f!==void 0?f:n}else{return n}}addAstNodeRegionWithAssignmentsTo(e){const n=r=>({offset:r.offset,end:r.end,length:r.length,range:r.range});if(e.$cstNode){const r=e.$textRegion=n(e.$cstNode);const i=r.assignments={};Object.keys(e).filter(a=>!a.startsWith("$")).forEach(a=>{const s=Kg(e.$cstNode,a).map(n);if(s.length!==0){i[a]=s}});return e}return void 0}linkNode(e,n,r,i,a,s){for(const[l,u]of Object.entries(e)){if(Array.isArray(u)){for(let c=0;c<u.length;c++){const d=u[c];if(Th(d)){u[c]=this.reviveReference(e,l,n,d,r)}else if(rt(d)){this.linkNode(d,n,r,e,l,c)}}}else if(Th(u)){e[l]=this.reviveReference(e,l,n,u,r)}else if(rt(u)){this.linkNode(u,n,r,e,l)}}const o=e;o.$container=i;o.$containerProperty=a;o.$containerIndex=s}reviveReference(e,n,r,i,a){let s=i.$refText;let o=i.$error;if(i.$ref){const l=this.getRefNode(r,i.$ref,a.uriConverter);if(rt(l)){if(!s){s=this.nameProvider.getName(l)}return{$refText:s!==null&&s!==void 0?s:"",ref:l}}else{o=l}}if(o){const l={$refText:s!==null&&s!==void 0?s:""};l.error={container:e,property:n,message:o,reference:l};return l}else{return void 0}}getRefNode(e,n,r){try{const i=n.indexOf("#");if(i===0){const l=this.astNodeLocator.getAstNode(e,n.substring(1));if(!l){return"Could not resolve path: "+n}return l}if(i<0){const l=r?r(n):lt.parse(n);const u=this.langiumDocuments.getDocument(l);if(!u){return"Could not find document for URI: "+n}return u.parseResult.value}const a=r?r(n.substring(0,i)):lt.parse(n.substring(0,i));const s=this.langiumDocuments.getDocument(a);if(!s){return"Could not find document for URI: "+n}if(i===n.length-1){return s.parseResult.value}const o=this.astNodeLocator.getAstNode(s.parseResult.value,n.substring(i+1));if(!o){return"Could not resolve URI: "+n}return o}catch(i){return String(i)}}}class EP{get map(){return this.fileExtensionMap}constructor(e){this.languageIdMap=new Map;this.fileExtensionMap=new Map;this.textDocuments=e===null||e===void 0?void 0:e.workspace.TextDocuments}register(e){const n=e.LanguageMetaData;for(const r of n.fileExtensions){if(this.fileExtensionMap.has(r)){console.warn(`The file extension ${r} is used by multiple languages. It is now assigned to '${n.languageId}'.`)}this.fileExtensionMap.set(r,e)}this.languageIdMap.set(n.languageId,e);if(this.languageIdMap.size===1){this.singleton=e}else{this.singleton=void 0}}getServices(e){var n,r;if(this.singleton!==void 0){return this.singleton}if(this.languageIdMap.size===0){throw new Error("The service registry is empty. Use `register` to register the services of a language.")}const i=(r=(n=this.textDocuments)===null||n===void 0?void 0:n.get(e))===null||r===void 0?void 0:r.languageId;if(i!==void 0){const o=this.languageIdMap.get(i);if(o){return o}}const a=Ge.extname(e);const s=this.fileExtensionMap.get(a);if(!s){if(i){throw new Error(`The service registry contains no services for the extension '${a}' for language '${i}'.`)}else{throw new Error(`The service registry contains no services for the extension '${a}'.`)}}return s}hasServices(e){try{this.getServices(e);return true}catch(n){return false}}get all(){return Array.from(this.languageIdMap.values())}}function Ta(t){return{code:t}}var xu;(function(t){t.all=["fast","slow","built-in"]})(xu||(xu={}));class wP{constructor(e){this.entries=new Lu;this.entriesBefore=[];this.entriesAfter=[];this.reflection=e.shared.AstReflection}register(e,n=this,r="fast"){if(r==="built-in"){throw new Error("The 'built-in' category is reserved for lexer, parser, and linker errors.")}for(const[i,a]of Object.entries(e)){const s=a;if(Array.isArray(s)){for(const o of s){const l={check:this.wrapValidationException(o,n),category:r};this.addEntry(i,l)}}else if(typeof s==="function"){const o={check:this.wrapValidationException(s,n),category:r};this.addEntry(i,o)}else{Qa()}}}wrapValidationException(e,n){return async(r,i,a)=>{await this.handleException(()=>e.call(n,r,i,a),"An error occurred during validation",i,r)}}async handleException(e,n,r,i){try{await e()}catch(a){if(ds(a)){throw a}console.error(`${n}:`,a);if(a instanceof Error&&a.stack){console.error(a.stack)}const s=a instanceof Error?a.message:String(a);r("error",`${n}: ${s}`,{node:i})}}addEntry(e,n){if(e==="AstNode"){this.entries.add("AstNode",n);return}for(const r of this.reflection.getAllSubTypes(e)){this.entries.add(r,n)}}getChecks(e,n){let r=be(this.entries.get(e)).concat(this.entries.get("AstNode"));if(n){r=r.filter(i=>n.includes(i.category))}return r.map(i=>i.check)}registerBeforeDocument(e,n=this){this.entriesBefore.push(this.wrapPreparationException(e,"An error occurred during set-up of the validation",n))}registerAfterDocument(e,n=this){this.entriesAfter.push(this.wrapPreparationException(e,"An error occurred during tear-down of the validation",n))}wrapPreparationException(e,n,r){return async(i,a,s,o)=>{await this.handleException(()=>e.call(r,i,a,s,o),n,a,i)}}get checksBefore(){return this.entriesBefore}get checksAfter(){return this.entriesAfter}}class Mv{constructor(e){this.validationRegistry=e.validation.ValidationRegistry;this.metadata=e.LanguageMetaData}async validateDocument(e,n={},r=ye.CancellationToken.None){const i=e.parseResult;const a=[];await ht(r);if(!n.categories||n.categories.includes("built-in")){this.processLexingErrors(i,a,n);if(n.stopAfterLexingErrors&&a.some(s=>{var o;return((o=s.data)===null||o===void 0?void 0:o.code)===qt.LexingError})){return a}this.processParsingErrors(i,a,n);if(n.stopAfterParsingErrors&&a.some(s=>{var o;return((o=s.data)===null||o===void 0?void 0:o.code)===qt.ParsingError})){return a}this.processLinkingErrors(e,a,n);if(n.stopAfterLinkingErrors&&a.some(s=>{var o;return((o=s.data)===null||o===void 0?void 0:o.code)===qt.LinkingError})){return a}}try{a.push(...await this.validateAst(i.value,n,r))}catch(s){if(ds(s)){throw s}console.error("An error occurred during validation:",s)}await ht(r);return a}processLexingErrors(e,n,r){var i,a,s;const o=[...e.lexerErrors,...(a=(i=e.lexerReport)===null||i===void 0?void 0:i.diagnostics)!==null&&a!==void 0?a:[]];for(const l of o){const u=(s=l.severity)!==null&&s!==void 0?s:"error";const c={severity:Nc(u),range:{start:{line:l.line-1,character:l.column-1},end:{line:l.line-1,character:l.column+l.length-1}},message:l.message,data:AP(u),source:this.getSource()};n.push(c)}}processParsingErrors(e,n,r){for(const i of e.parserErrors){let a=void 0;if(isNaN(i.token.startOffset)){if("previousToken"in i){const s=i.previousToken;if(!isNaN(s.startOffset)){const o={line:s.endLine-1,character:s.endColumn};a={start:o,end:o}}else{const o={line:0,character:0};a={start:o,end:o}}}}else{a=xd(i.token)}if(a){const s={severity:Nc("error"),range:a,message:i.message,data:Ta(qt.ParsingError),source:this.getSource()};n.push(s)}}}processLinkingErrors(e,n,r){for(const i of e.references){const a=i.error;if(a){const s={node:a.container,property:a.property,index:a.index,data:{code:qt.LinkingError,containerType:a.container.$type,property:a.property,refText:a.reference.$refText}};n.push(this.toDiagnostic("error",a.message,s))}}}async validateAst(e,n,r=ye.CancellationToken.None){const i=[];const a=(s,o,l)=>{i.push(this.toDiagnostic(s,o,l))};await this.validateAstBefore(e,n,a,r);await this.validateAstNodes(e,n,a,r);await this.validateAstAfter(e,n,a,r);return i}async validateAstBefore(e,n,r,i=ye.CancellationToken.None){var a;const s=this.validationRegistry.checksBefore;for(const o of s){await ht(i);await o(e,r,(a=n.categories)!==null&&a!==void 0?a:[],i)}}async validateAstNodes(e,n,r,i=ye.CancellationToken.None){await Promise.all(Xn(e).map(async a=>{await ht(i);const s=this.validationRegistry.getChecks(a.$type,n.categories);for(const o of s){await o(a,r,i)}}))}async validateAstAfter(e,n,r,i=ye.CancellationToken.None){var a;const s=this.validationRegistry.checksAfter;for(const o of s){await ht(i);await o(e,r,(a=n.categories)!==null&&a!==void 0?a:[],i)}}toDiagnostic(e,n,r){return{message:n,range:CP(r),severity:Nc(e),code:r.code,codeDescription:r.codeDescription,tags:r.tags,relatedInformation:r.relatedInformation,data:r.data,source:this.getSource()}}getSource(){return this.metadata.languageId}}function CP(t){if(t.range){return t.range}let e;if(typeof t.property==="string"){e=mp(t.node.$cstNode,t.property,t.index)}else if(typeof t.keyword==="string"){e=Fg(t.node.$cstNode,t.keyword,t.index)}e!==null&&e!==void 0?e:e=t.node.$cstNode;if(!e){return{start:{line:0,character:0},end:{line:0,character:0}}}return e.range}function Nc(t){switch(t){case"error":return 1;case"warning":return 2;case"info":return 3;case"hint":return 4;default:throw new Error("Invalid diagnostic severity: "+t)}}function AP(t){switch(t){case"error":return Ta(qt.LexingError);case"warning":return Ta(qt.LexingWarning);case"info":return Ta(qt.LexingInfo);case"hint":return Ta(qt.LexingHint);default:throw new Error("Invalid diagnostic severity: "+t)}}var qt;(function(t){t.LexingError="lexing-error";t.LexingWarning="lexing-warning";t.LexingInfo="lexing-info";t.LexingHint="lexing-hint";t.ParsingError="parsing-error";t.LinkingError="linking-error"})(qt||(qt={}));class SP{constructor(e){this.astNodeLocator=e.workspace.AstNodeLocator;this.nameProvider=e.references.NameProvider}createDescription(e,n,r){const i=r!==null&&r!==void 0?r:yt(e);n!==null&&n!==void 0?n:n=this.nameProvider.getName(e);const a=this.astNodeLocator.getAstNodePath(e);if(!n){throw new Error(`Node at path ${a} has no name.`)}let s;const o=()=>{var l;return s!==null&&s!==void 0?s:s=uu((l=this.nameProvider.getNameNode(e))!==null&&l!==void 0?l:e.$cstNode)};return{node:e,name:n,get nameSegment(){return o()},selectionSegment:uu(e.$cstNode),type:e.$type,documentUri:i.uri,path:a}}}class kP{constructor(e){this.nodeLocator=e.workspace.AstNodeLocator}async createDescriptions(e,n=ye.CancellationToken.None){const r=[];const i=e.parseResult.value;for(const a of Xn(i)){await ht(n);Dg(a).filter(s=>!ql(s)).forEach(s=>{const o=this.createDescription(s);if(o){r.push(o)}})}return r}createDescription(e){const n=e.reference.$nodeDescription;const r=e.reference.$refNode;if(!n||!r){return void 0}const i=yt(e.container).uri;return{sourceUri:i,sourcePath:this.nodeLocator.getAstNodePath(e.container),targetUri:n.documentUri,targetPath:n.path,segment:uu(r),local:Ge.equals(n.documentUri,i)}}}class bP{constructor(){this.segmentSeparator="/";this.indexSeparator="@"}getAstNodePath(e){if(e.$container){const n=this.getAstNodePath(e.$container);const r=this.getPathSegment(e);const i=n+this.segmentSeparator+r;return i}return""}getPathSegment({$containerProperty:e,$containerIndex:n}){if(!e){throw new Error("Missing '$containerProperty' in AST node.")}if(n!==void 0){return e+this.indexSeparator+n}return e}getAstNode(e,n){const r=n.split(this.segmentSeparator);return r.reduce((i,a)=>{if(!i||a.length===0){return i}const s=a.indexOf(this.indexSeparator);if(s>0){const o=a.substring(0,s);const l=parseInt(a.substring(s+1));const u=i[o];return u===null||u===void 0?void 0:u[l]}return i[a]},e)}}var NP=Cv();class PP{constructor(e){this._ready=new zp;this.settings={};this.workspaceConfig=false;this.onConfigurationSectionUpdateEmitter=new NP.Emitter;this.serviceRegistry=e.ServiceRegistry}get ready(){return this._ready.promise}initialize(e){var n,r;this.workspaceConfig=(r=(n=e.capabilities.workspace)===null||n===void 0?void 0:n.configuration)!==null&&r!==void 0?r:false}async initialized(e){if(this.workspaceConfig){if(e.register){const n=this.serviceRegistry.all;e.register({section:n.map(r=>this.toSectionName(r.LanguageMetaData.languageId))})}if(e.fetchConfiguration){const n=this.serviceRegistry.all.map(i=>({section:this.toSectionName(i.LanguageMetaData.languageId)}));const r=await e.fetchConfiguration(n);n.forEach((i,a)=>{this.updateSectionConfiguration(i.section,r[a])})}}this._ready.resolve()}updateConfiguration(e){if(!e.settings){return}Object.keys(e.settings).forEach(n=>{const r=e.settings[n];this.updateSectionConfiguration(n,r);this.onConfigurationSectionUpdateEmitter.fire({section:n,configuration:r})})}updateSectionConfiguration(e,n){this.settings[e]=n}async getConfiguration(e,n){await this.ready;const r=this.toSectionName(e);if(this.settings[r]){return this.settings[r][n]}}toSectionName(e){return`${e}`}get onConfigurationSectionUpdate(){return this.onConfigurationSectionUpdateEmitter.event}}var xa;(function(t){function e(n){return{dispose:async()=>await n()}}t.create=e})(xa||(xa={}));class _P{constructor(e){this.updateBuildOptions={validation:{categories:["built-in","fast"]}};this.updateListeners=[];this.buildPhaseListeners=new Lu;this.documentPhaseListeners=new Lu;this.buildState=new Map;this.documentBuildWaiters=new Map;this.currentState=z.Changed;this.langiumDocuments=e.workspace.LangiumDocuments;this.langiumDocumentFactory=e.workspace.LangiumDocumentFactory;this.textDocuments=e.workspace.TextDocuments;this.indexManager=e.workspace.IndexManager;this.serviceRegistry=e.ServiceRegistry}async build(e,n={},r=ye.CancellationToken.None){var i,a;for(const s of e){const o=s.uri.toString();if(s.state===z.Validated){if(typeof n.validation==="boolean"&&n.validation){s.state=z.IndexedReferences;s.diagnostics=void 0;this.buildState.delete(o)}else if(typeof n.validation==="object"){const l=this.buildState.get(o);const u=(i=l===null||l===void 0?void 0:l.result)===null||i===void 0?void 0:i.validationChecks;if(u){const c=(a=n.validation.categories)!==null&&a!==void 0?a:xu.all;const d=c.filter(f=>!u.includes(f));if(d.length>0){this.buildState.set(o,{completed:false,options:{validation:Object.assign(Object.assign({},n.validation),{categories:d})},result:l.result});s.state=z.IndexedReferences}}}}else{this.buildState.delete(o)}}this.currentState=z.Changed;await this.emitUpdate(e.map(s=>s.uri),[]);await this.buildDocuments(e,n,r)}async update(e,n,r=ye.CancellationToken.None){this.currentState=z.Changed;for(const s of n){this.langiumDocuments.deleteDocument(s);this.buildState.delete(s.toString());this.indexManager.remove(s)}for(const s of e){const o=this.langiumDocuments.invalidateDocument(s);if(!o){const l=this.langiumDocumentFactory.fromModel({$type:"INVALID"},s);l.state=z.Changed;this.langiumDocuments.addDocument(l)}this.buildState.delete(s.toString())}const i=be(e).concat(n).map(s=>s.toString()).toSet();this.langiumDocuments.all.filter(s=>!i.has(s.uri.toString())&&this.shouldRelink(s,i)).forEach(s=>{const o=this.serviceRegistry.getServices(s.uri).references.Linker;o.unlink(s);s.state=Math.min(s.state,z.ComputedScopes);s.diagnostics=void 0});await this.emitUpdate(e,n);await ht(r);const a=this.sortDocuments(this.langiumDocuments.all.filter(s=>{var o;return s.state<z.Linked||!((o=this.buildState.get(s.uri.toString()))===null||o===void 0?void 0:o.completed)}).toArray());await this.buildDocuments(a,this.updateBuildOptions,r)}async emitUpdate(e,n){await Promise.all(this.updateListeners.map(r=>r(e,n)))}sortDocuments(e){let n=0;let r=e.length-1;while(n<r){while(n<e.length&&this.hasTextDocument(e[n])){n++}while(r>=0&&!this.hasTextDocument(e[r])){r--}if(n<r){[e[n],e[r]]=[e[r],e[n]]}}return e}hasTextDocument(e){var n;return Boolean((n=this.textDocuments)===null||n===void 0?void 0:n.get(e.uri))}shouldRelink(e,n){if(e.references.some(r=>r.error!==void 0)){return true}return this.indexManager.isAffected(e,n)}onUpdate(e){this.updateListeners.push(e);return xa.create(()=>{const n=this.updateListeners.indexOf(e);if(n>=0){this.updateListeners.splice(n,1)}})}async buildDocuments(e,n,r){this.prepareBuild(e,n);await this.runCancelable(e,z.Parsed,r,a=>this.langiumDocumentFactory.update(a,r));await this.runCancelable(e,z.IndexedContent,r,a=>this.indexManager.updateContent(a,r));await this.runCancelable(e,z.ComputedScopes,r,async a=>{const s=this.serviceRegistry.getServices(a.uri).references.ScopeComputation;a.precomputedScopes=await s.computeLocalScopes(a,r)});await this.runCancelable(e,z.Linked,r,a=>{const s=this.serviceRegistry.getServices(a.uri).references.Linker;return s.link(a,r)});await this.runCancelable(e,z.IndexedReferences,r,a=>this.indexManager.updateReferences(a,r));const i=e.filter(a=>this.shouldValidate(a));await this.runCancelable(i,z.Validated,r,a=>this.validate(a,r));for(const a of e){const s=this.buildState.get(a.uri.toString());if(s){s.completed=true}}}prepareBuild(e,n){for(const r of e){const i=r.uri.toString();const a=this.buildState.get(i);if(!a||a.completed){this.buildState.set(i,{completed:false,options:n,result:a===null||a===void 0?void 0:a.result})}}}async runCancelable(e,n,r,i){const a=e.filter(o=>o.state<n);for(const o of a){await ht(r);await i(o);o.state=n;await this.notifyDocumentPhase(o,n,r)}const s=e.filter(o=>o.state===n);await this.notifyBuildPhase(s,n,r);this.currentState=n}onBuildPhase(e,n){this.buildPhaseListeners.add(e,n);return xa.create(()=>{this.buildPhaseListeners.delete(e,n)})}onDocumentPhase(e,n){this.documentPhaseListeners.add(e,n);return xa.create(()=>{this.documentPhaseListeners.delete(e,n)})}waitUntil(e,n,r){let i=void 0;if(n&&"path"in n){i=n}else{r=n}r!==null&&r!==void 0?r:r=ye.CancellationToken.None;if(i){const a=this.langiumDocuments.getDocument(i);if(a&&a.state>e){return Promise.resolve(i)}}if(this.currentState>=e){return Promise.resolve(void 0)}else if(r.isCancellationRequested){return Promise.reject(Ou)}return new Promise((a,s)=>{const o=this.onBuildPhase(e,()=>{o.dispose();l.dispose();if(i){const u=this.langiumDocuments.getDocument(i);a(u===null||u===void 0?void 0:u.uri)}else{a(void 0)}});const l=r.onCancellationRequested(()=>{o.dispose();l.dispose();s(Ou)})})}async notifyDocumentPhase(e,n,r){const i=this.documentPhaseListeners.get(n);const a=i.slice();for(const s of a){try{await s(e,r)}catch(o){if(!ds(o)){throw o}}}}async notifyBuildPhase(e,n,r){if(e.length===0){return}const i=this.buildPhaseListeners.get(n);const a=i.slice();for(const s of a){await ht(r);await s(e,r)}}shouldValidate(e){return Boolean(this.getBuildOptions(e).validation)}async validate(e,n){var r,i;const a=this.serviceRegistry.getServices(e.uri).validation.DocumentValidator;const s=this.getBuildOptions(e).validation;const o=typeof s==="object"?s:void 0;const l=await a.validateDocument(e,o,n);if(e.diagnostics){e.diagnostics.push(...l)}else{e.diagnostics=l}const u=this.buildState.get(e.uri.toString());if(u){(r=u.result)!==null&&r!==void 0?r:u.result={};const c=(i=o===null||o===void 0?void 0:o.categories)!==null&&i!==void 0?i:xu.all;if(u.result.validationChecks){u.result.validationChecks.push(...c)}else{u.result.validationChecks=[...c]}}}getBuildOptions(e){var n,r;return(r=(n=this.buildState.get(e.uri.toString()))===null||n===void 0?void 0:n.options)!==null&&r!==void 0?r:{}}}class Kv{constructor(e){this.symbolIndex=new Map;this.symbolByTypeIndex=new Lv;this.referenceIndex=new Map;this.documents=e.workspace.LangiumDocuments;this.serviceRegistry=e.ServiceRegistry;this.astReflection=e.AstReflection}findAllReferences(e,n){const r=yt(e).uri;const i=[];this.referenceIndex.forEach(a=>{a.forEach(s=>{if(Ge.equals(s.targetUri,r)&&s.targetPath===n){i.push(s)}})});return be(i)}allElements(e,n){let r=be(this.symbolIndex.keys());if(n){r=r.filter(i=>!n||n.has(i))}return r.map(i=>this.getFileDescriptions(i,e)).flat()}getFileDescriptions(e,n){var r;if(!n){return(r=this.symbolIndex.get(e))!==null&&r!==void 0?r:[]}const i=this.symbolByTypeIndex.get(e,n,()=>{var a;const s=(a=this.symbolIndex.get(e))!==null&&a!==void 0?a:[];return s.filter(o=>this.astReflection.isSubtype(o.type,n))});return i}remove(e){const n=e.toString();this.symbolIndex.delete(n);this.symbolByTypeIndex.clear(n);this.referenceIndex.delete(n)}async updateContent(e,n=ye.CancellationToken.None){const r=this.serviceRegistry.getServices(e.uri);const i=await r.references.ScopeComputation.computeExports(e,n);const a=e.uri.toString();this.symbolIndex.set(a,i);this.symbolByTypeIndex.clear(a)}async updateReferences(e,n=ye.CancellationToken.None){const r=this.serviceRegistry.getServices(e.uri);const i=await r.workspace.ReferenceDescriptionProvider.createDescriptions(e,n);this.referenceIndex.set(e.uri.toString(),i)}isAffected(e,n){const r=this.referenceIndex.get(e.uri.toString());if(!r){return false}return r.some(i=>!i.local&&n.has(i.targetUri.toString()))}}class Fv{constructor(e){this.initialBuildOptions={};this._ready=new zp;this.serviceRegistry=e.ServiceRegistry;this.langiumDocuments=e.workspace.LangiumDocuments;this.documentBuilder=e.workspace.DocumentBuilder;this.fileSystemProvider=e.workspace.FileSystemProvider;this.mutex=e.workspace.WorkspaceLock}get ready(){return this._ready.promise}get workspaceFolders(){return this.folders}initialize(e){var n;this.folders=(n=e.workspaceFolders)!==null&&n!==void 0?n:void 0}initialized(e){return this.mutex.write(n=>{var r;return this.initializeWorkspace((r=this.folders)!==null&&r!==void 0?r:[],n)})}async initializeWorkspace(e,n=ye.CancellationToken.None){const r=await this.performStartup(e);await ht(n);await this.documentBuilder.build(r,this.initialBuildOptions,n)}async performStartup(e){const n=this.serviceRegistry.all.flatMap(a=>a.LanguageMetaData.fileExtensions);const r=[];const i=a=>{r.push(a);if(!this.langiumDocuments.hasDocument(a.uri)){this.langiumDocuments.addDocument(a)}};await this.loadAdditionalDocuments(e,i);await Promise.all(e.map(a=>[a,this.getRootFolder(a)]).map(async a=>this.traverseFolder(...a,n,i)));this._ready.resolve();return r}loadAdditionalDocuments(e,n){return Promise.resolve()}getRootFolder(e){return lt.parse(e.uri)}async traverseFolder(e,n,r,i){const a=await this.fileSystemProvider.readDirectory(n);await Promise.all(a.map(async s=>{if(this.includeEntry(e,s,r)){if(s.isDirectory){await this.traverseFolder(e,s.uri,r,i)}else if(s.isFile){const o=await this.langiumDocuments.getOrCreateDocument(s.uri);i(o)}}}))}includeEntry(e,n,r){const i=Ge.basename(n.uri);if(i.startsWith(".")){return false}if(n.isDirectory){return i!=="node_modules"&&i!=="out"}else if(n.isFile){const a=Ge.extname(n.uri);return r.includes(a)}return false}}class DP{buildUnexpectedCharactersMessage(e,n,r,i,a){return Vd.buildUnexpectedCharactersMessage(e,n,r,i,a)}buildUnableToPopLexerModeMessage(e){return Vd.buildUnableToPopLexerModeMessage(e)}}const OP={mode:"full"};class Uv{constructor(e){this.errorMessageProvider=e.parser.LexerErrorMessageProvider;this.tokenBuilder=e.parser.TokenBuilder;const n=this.tokenBuilder.buildTokens(e.Grammar,{caseInsensitive:e.LanguageMetaData.caseInsensitive});this.tokenTypes=this.toTokenTypeDictionary(n);const r=Eh(n)?Object.values(n):n;const i=e.LanguageMetaData.mode==="production";this.chevrotainLexer=new ot(r,{positionTracking:"full",skipValidations:i,errorMessageProvider:this.errorMessageProvider})}get definition(){return this.tokenTypes}tokenize(e,n=OP){var r,i,a;const s=this.chevrotainLexer.tokenize(e);return{tokens:s.tokens,errors:s.errors,hidden:(r=s.groups.hidden)!==null&&r!==void 0?r:[],report:(a=(i=this.tokenBuilder).flushLexingReport)===null||a===void 0?void 0:a.call(i,e)}}toTokenTypeDictionary(e){if(Eh(e))return e;const n=Gv(e)?Object.values(e.modes).flat():e;const r={};n.forEach(i=>r[i.name]=i);return r}}function IP(t){return Array.isArray(t)&&(t.length===0||"name"in t[0])}function Gv(t){return t&&"modes"in t&&"defaultMode"in t}function Eh(t){return!IP(t)&&!Gv(t)}function LP(t,e,n){let r;let i;if(typeof t==="string"){i=e;r=n}else{i=t.range.start;r=e}if(!i){i=ue.create(0,0)}const a=Hv(t);const s=Yp(r);const o=KP({lines:a,position:i,options:s});return qP({index:0,tokens:o,position:i})}function xP(t,e){const n=Yp(e);const r=Hv(t);if(r.length===0){return false}const i=r[0];const a=r[r.length-1];const s=n.start;const o=n.end;return Boolean(s===null||s===void 0?void 0:s.exec(i))&&Boolean(o===null||o===void 0?void 0:o.exec(a))}function Hv(t){let e="";if(typeof t==="string"){e=t}else{e=t.text}const n=e.split(Y$);return n}const wh=/\s*(@([\p{L}][\p{L}\p{N}]*)?)/uy;const MP=/\{(@[\p{L}][\p{L}\p{N}]*)(\s*)([^\r\n}]+)?\}/gu;function KP(t){var e,n,r;const i=[];let a=t.position.line;let s=t.position.character;for(let o=0;o<t.lines.length;o++){const l=o===0;const u=o===t.lines.length-1;let c=t.lines[o];let d=0;if(l&&t.options.start){const p=(e=t.options.start)===null||e===void 0?void 0:e.exec(c);if(p){d=p.index+p[0].length}}else{const p=(n=t.options.line)===null||n===void 0?void 0:n.exec(c);if(p){d=p.index+p[0].length}}if(u){const p=(r=t.options.end)===null||r===void 0?void 0:r.exec(c);if(p){c=c.substring(0,p.index)}}c=c.substring(0,HP(c));const f=ip(c,d);if(f>=c.length){if(i.length>0){const p=ue.create(a,s);i.push({type:"break",content:"",range:ie.create(p,p)})}}else{wh.lastIndex=d;const p=wh.exec(c);if(p){const y=p[0];const v=p[1];const k=ue.create(a,s+d);const $=ue.create(a,s+d+y.length);i.push({type:"tag",content:v,range:ie.create(k,$)});d+=y.length;d=ip(c,d)}if(d<c.length){const y=c.substring(d);const v=Array.from(y.matchAll(MP));i.push(...FP(v,y,a,s+d))}}a++;s=0}if(i.length>0&&i[i.length-1].type==="break"){return i.slice(0,-1)}return i}function FP(t,e,n,r){const i=[];if(t.length===0){const a=ue.create(n,r);const s=ue.create(n,r+e.length);i.push({type:"text",content:e,range:ie.create(a,s)})}else{let a=0;for(const o of t){const l=o.index;const u=e.substring(a,l);if(u.length>0){i.push({type:"text",content:e.substring(a,l),range:ie.create(ue.create(n,a+r),ue.create(n,l+r))})}let c=u.length+1;const d=o[1];i.push({type:"inline-tag",content:d,range:ie.create(ue.create(n,a+c+r),ue.create(n,a+c+d.length+r))});c+=d.length;if(o.length===4){c+=o[2].length;const f=o[3];i.push({type:"text",content:f,range:ie.create(ue.create(n,a+c+r),ue.create(n,a+c+f.length+r))})}else{i.push({type:"text",content:"",range:ie.create(ue.create(n,a+c+r),ue.create(n,a+c+r))})}a=l+o[0].length}const s=e.substring(a);if(s.length>0){i.push({type:"text",content:s,range:ie.create(ue.create(n,a+r),ue.create(n,a+r+s.length))})}}return i}const UP=/\S/;const GP=/\s*$/;function ip(t,e){const n=t.substring(e).match(UP);if(n){return e+n.index}else{return t.length}}function HP(t){const e=t.match(GP);if(e&&typeof e.index==="number"){return e.index}return void 0}function qP(t){var e,n,r,i;const a=ue.create(t.position.line,t.position.character);if(t.tokens.length===0){return new Ch([],ie.create(a,a))}const s=[];while(t.index<t.tokens.length){const u=jP(t,s[s.length-1]);if(u){s.push(u)}}const o=(n=(e=s[0])===null||e===void 0?void 0:e.range.start)!==null&&n!==void 0?n:a;const l=(i=(r=s[s.length-1])===null||r===void 0?void 0:r.range.end)!==null&&i!==void 0?i:a;return new Ch(s,ie.create(o,l))}function jP(t,e){const n=t.tokens[t.index];if(n.type==="tag"){return jv(t,false)}else if(n.type==="text"||n.type==="inline-tag"){return qv(t)}else{BP(n,e);t.index++;return void 0}}function BP(t,e){if(e){const n=new Wv("",t.range);if("inlines"in e){e.inlines.push(n)}else{e.content.inlines.push(n)}}}function qv(t){let e=t.tokens[t.index];const n=e;let r=e;const i=[];while(e&&e.type!=="break"&&e.type!=="tag"){i.push(WP(t));r=e;e=t.tokens[t.index]}return new ap(i,ie.create(n.range.start,r.range.end))}function WP(t){const e=t.tokens[t.index];if(e.type==="inline-tag"){return jv(t,true)}else{return Bv(t)}}function jv(t,e){const n=t.tokens[t.index++];const r=n.content.substring(1);const i=t.tokens[t.index];if((i===null||i===void 0?void 0:i.type)==="text"){if(e){const a=Bv(t);return new _c(r,new ap([a],a.range),e,ie.create(n.range.start,a.range.end))}else{const a=qv(t);return new _c(r,a,e,ie.create(n.range.start,a.range.end))}}else{const a=n.range;return new _c(r,new ap([],a),e,a)}}function Bv(t){const e=t.tokens[t.index++];return new Wv(e.content,e.range)}function Yp(t){if(!t){return Yp({start:"/**",end:"*/",line:"*"})}const{start:e,end:n,line:r}=t;return{start:Pc(e,true),end:Pc(n,false),line:Pc(r,true)}}function Pc(t,e){if(typeof t==="string"||typeof t==="object"){const n=typeof t==="string"?ju(t):t.source;if(e){return new RegExp(`^\\s*${n}`)}else{return new RegExp(`\\s*${n}\\s*$`)}}else{return t}}class Ch{constructor(e,n){this.elements=e;this.range=n}getTag(e){return this.getAllTags().find(n=>n.name===e)}getTags(e){return this.getAllTags().filter(n=>n.name===e)}getAllTags(){return this.elements.filter(e=>"name"in e)}toString(){let e="";for(const n of this.elements){if(e.length===0){e=n.toString()}else{const r=n.toString();e+=Ah(e)+r}}return e.trim()}toMarkdown(e){let n="";for(const r of this.elements){if(n.length===0){n=r.toMarkdown(e)}else{const i=r.toMarkdown(e);n+=Ah(n)+i}}return n.trim()}}class _c{constructor(e,n,r,i){this.name=e;this.content=n;this.inline=r;this.range=i}toString(){let e=`@${this.name}`;const n=this.content.toString();if(this.content.inlines.length===1){e=`${e} ${n}`}else if(this.content.inlines.length>1){e=`${e}
${n}`}if(this.inline){return`{${e}}`}else{return e}}toMarkdown(e){var n,r;return(r=(n=e===null||e===void 0?void 0:e.renderTag)===null||n===void 0?void 0:n.call(e,this))!==null&&r!==void 0?r:this.toMarkdownDefault(e)}toMarkdownDefault(e){const n=this.content.toMarkdown(e);if(this.inline){const a=VP(this.name,n,e!==null&&e!==void 0?e:{});if(typeof a==="string"){return a}}let r="";if((e===null||e===void 0?void 0:e.tag)==="italic"||(e===null||e===void 0?void 0:e.tag)===void 0){r="*"}else if((e===null||e===void 0?void 0:e.tag)==="bold"){r="**"}else if((e===null||e===void 0?void 0:e.tag)==="bold-italic"){r="***"}let i=`${r}@${this.name}${r}`;if(this.content.inlines.length===1){i=`${i} — ${n}`}else if(this.content.inlines.length>1){i=`${i}
${n}`}if(this.inline){return`{${i}}`}else{return i}}}function VP(t,e,n){var r,i;if(t==="linkplain"||t==="linkcode"||t==="link"){const a=e.indexOf(" ");let s=e;if(a>0){const l=ip(e,a);s=e.substring(l);e=e.substring(0,a)}if(t==="linkcode"||t==="link"&&n.link==="code"){s=`\`${s}\``}const o=(i=(r=n.renderLink)===null||r===void 0?void 0:r.call(n,e,s))!==null&&i!==void 0?i:zP(e,s);return o}return void 0}function zP(t,e){try{lt.parse(t,true);return`[${e}](${t})`}catch(n){return t}}class ap{constructor(e,n){this.inlines=e;this.range=n}toString(){let e="";for(let n=0;n<this.inlines.length;n++){const r=this.inlines[n];const i=this.inlines[n+1];e+=r.toString();if(i&&i.range.start.line>r.range.start.line){e+="\n"}}return e}toMarkdown(e){let n="";for(let r=0;r<this.inlines.length;r++){const i=this.inlines[r];const a=this.inlines[r+1];n+=i.toMarkdown(e);if(a&&a.range.start.line>i.range.start.line){n+="\n"}}return n}}class Wv{constructor(e,n){this.text=e;this.range=n}toString(){return this.text}toMarkdown(){return this.text}}function Ah(t){if(t.endsWith("\n")){return"\n"}else{return"\n\n"}}class Vv{constructor(e){this.indexManager=e.shared.workspace.IndexManager;this.commentProvider=e.documentation.CommentProvider}getDocumentation(e){const n=this.commentProvider.getComment(e);if(n&&xP(n)){const r=LP(n);return r.toMarkdown({renderLink:(i,a)=>{return this.documentationLinkRenderer(e,i,a)},renderTag:i=>{return this.documentationTagRenderer(e,i)}})}return void 0}documentationLinkRenderer(e,n,r){var i;const a=(i=this.findNameInPrecomputedScopes(e,n))!==null&&i!==void 0?i:this.findNameInGlobalScope(e,n);if(a&&a.nameSegment){const s=a.nameSegment.range.start.line+1;const o=a.nameSegment.range.start.character+1;const l=a.documentUri.with({fragment:`L${s},${o}`});return`[${r}](${l.toString()})`}else{return void 0}}documentationTagRenderer(e,n){return void 0}findNameInPrecomputedScopes(e,n){const r=yt(e);const i=r.precomputedScopes;if(!i){return void 0}let a=e;do{const s=i.get(a);const o=s.find(l=>l.name===n);if(o){return o}a=a.$container}while(a);return void 0}findNameInGlobalScope(e,n){const r=this.indexManager.allElements().find(i=>i.name===n);return r}}class YP{constructor(e){this.grammarConfig=()=>e.parser.GrammarConfig}getComment(e){var n;if($P(e)){return e.$comment}return(n=k$(e.$cstNode,this.grammarConfig().multilineCommentRules))===null||n===void 0?void 0:n.text}}class XP{constructor(e){this.syncParser=e.parser.LangiumParser}parse(e,n){return Promise.resolve(this.syncParser.parse(e))}}class JP{constructor(){this.previousTokenSource=new ye.CancellationTokenSource;this.writeQueue=[];this.readQueue=[];this.done=true}write(e){this.cancelWrite();const n=fP();this.previousTokenSource=n;return this.enqueue(this.writeQueue,e,n.token)}read(e){return this.enqueue(this.readQueue,e)}enqueue(e,n,r=ye.CancellationToken.None){const i=new zp;const a={action:n,deferred:i,cancellationToken:r};e.push(a);this.performNextOperation();return i.promise}async performNextOperation(){if(!this.done){return}const e=[];if(this.writeQueue.length>0){e.push(this.writeQueue.shift())}else if(this.readQueue.length>0){e.push(...this.readQueue.splice(0,this.readQueue.length))}else{return}this.done=false;await Promise.all(e.map(async({action:n,deferred:r,cancellationToken:i})=>{try{const a=await Promise.resolve().then(()=>n(i));r.resolve(a)}catch(a){if(ds(a)){r.resolve(void 0)}else{r.reject(a)}}}));this.done=true;this.performNextOperation()}cancelWrite(){this.previousTokenSource.cancel()}}class QP{constructor(e){this.grammarElementIdMap=new vh;this.tokenTypeIdMap=new vh;this.grammar=e.Grammar;this.lexer=e.parser.Lexer;this.linker=e.references.Linker}dehydrate(e){return{lexerErrors:e.lexerErrors,lexerReport:e.lexerReport?this.dehydrateLexerReport(e.lexerReport):void 0,parserErrors:e.parserErrors.map(n=>Object.assign(Object.assign({},n),{message:n.message})),value:this.dehydrateAstNode(e.value,this.createDehyrationContext(e.value))}}dehydrateLexerReport(e){return e}createDehyrationContext(e){const n=new Map;const r=new Map;for(const i of Xn(e)){n.set(i,{})}if(e.$cstNode){for(const i of lu(e.$cstNode)){r.set(i,{})}}return{astNodes:n,cstNodes:r}}dehydrateAstNode(e,n){const r=n.astNodes.get(e);r.$type=e.$type;r.$containerIndex=e.$containerIndex;r.$containerProperty=e.$containerProperty;if(e.$cstNode!==void 0){r.$cstNode=this.dehydrateCstNode(e.$cstNode,n)}for(const[i,a]of Object.entries(e)){if(i.startsWith("$")){continue}if(Array.isArray(a)){const s=[];r[i]=s;for(const o of a){if(rt(o)){s.push(this.dehydrateAstNode(o,n))}else if(on(o)){s.push(this.dehydrateReference(o,n))}else{s.push(o)}}}else if(rt(a)){r[i]=this.dehydrateAstNode(a,n)}else if(on(a)){r[i]=this.dehydrateReference(a,n)}else if(a!==void 0){r[i]=a}}return r}dehydrateReference(e,n){const r={};r.$refText=e.$refText;if(e.$refNode){r.$refNode=n.cstNodes.get(e.$refNode)}return r}dehydrateCstNode(e,n){const r=n.cstNodes.get(e);if($g(e)){r.fullText=e.fullText}else{r.grammarSource=this.getGrammarElementId(e.grammarSource)}r.hidden=e.hidden;r.astNode=n.astNodes.get(e.astNode);if(Tr(e)){r.content=e.content.map(i=>this.dehydrateCstNode(i,n))}else if(Ja(e)){r.tokenType=e.tokenType.name;r.offset=e.offset;r.length=e.length;r.startLine=e.range.start.line;r.startColumn=e.range.start.character;r.endLine=e.range.end.line;r.endColumn=e.range.end.character}return r}hydrate(e){const n=e.value;const r=this.createHydrationContext(n);if("$cstNode"in n){this.hydrateCstNode(n.$cstNode,r)}return{lexerErrors:e.lexerErrors,lexerReport:e.lexerReport,parserErrors:e.parserErrors,value:this.hydrateAstNode(n,r)}}createHydrationContext(e){const n=new Map;const r=new Map;for(const a of Xn(e)){n.set(a,{})}let i;if(e.$cstNode){for(const a of lu(e.$cstNode)){let s;if("fullText"in a){s=new mv(a.fullText);i=s}else if("content"in a){s=new Wp}else if("tokenType"in a){s=this.hydrateCstLeafNode(a)}if(s){r.set(a,s);s.root=i}}}return{astNodes:n,cstNodes:r}}hydrateAstNode(e,n){const r=n.astNodes.get(e);r.$type=e.$type;r.$containerIndex=e.$containerIndex;r.$containerProperty=e.$containerProperty;if(e.$cstNode){r.$cstNode=n.cstNodes.get(e.$cstNode)}for(const[i,a]of Object.entries(e)){if(i.startsWith("$")){continue}if(Array.isArray(a)){const s=[];r[i]=s;for(const o of a){if(rt(o)){s.push(this.setParent(this.hydrateAstNode(o,n),r))}else if(on(o)){s.push(this.hydrateReference(o,r,i,n))}else{s.push(o)}}}else if(rt(a)){r[i]=this.setParent(this.hydrateAstNode(a,n),r)}else if(on(a)){r[i]=this.hydrateReference(a,r,i,n)}else if(a!==void 0){r[i]=a}}return r}setParent(e,n){e.$container=n;return e}hydrateReference(e,n,r,i){return this.linker.buildReference(n,r,i.cstNodes.get(e.$refNode),e.$refText)}hydrateCstNode(e,n,r=0){const i=n.cstNodes.get(e);if(typeof e.grammarSource==="number"){i.grammarSource=this.getGrammarElement(e.grammarSource)}i.astNode=n.astNodes.get(e.astNode);if(Tr(i)){for(const a of e.content){const s=this.hydrateCstNode(a,n,r++);i.content.push(s)}}return i}hydrateCstLeafNode(e){const n=this.getTokenType(e.tokenType);const r=e.offset;const i=e.length;const a=e.startLine;const s=e.startColumn;const o=e.endLine;const l=e.endColumn;const u=e.hidden;const c=new ep(r,i,{start:{line:a,character:s},end:{line:o,character:l}},n,u);return c}getTokenType(e){return this.lexer.definition[e]}getGrammarElementId(e){if(!e){return void 0}if(this.grammarElementIdMap.size===0){this.createGrammarElementIdMap()}return this.grammarElementIdMap.get(e)}getGrammarElement(e){if(this.grammarElementIdMap.size===0){this.createGrammarElementIdMap()}const n=this.grammarElementIdMap.getKey(e);return n}createGrammarElementIdMap(){let e=0;for(const n of Xn(this.grammar)){if(kg(n)){this.grammarElementIdMap.set(n,e++)}}}}function zv(t){return{documentation:{CommentProvider:e=>new YP(e),DocumentationProvider:e=>new Vv(e)},parser:{AsyncParser:e=>new XP(e),GrammarConfig:e=>hT(e),LangiumParser:e=>iP(e),CompletionParser:e=>rP(e),ValueConverter:()=>new sP,TokenBuilder:()=>new Ev,Lexer:e=>new Uv(e),ParserErrorMessageProvider:()=>new gv,LexerErrorMessageProvider:()=>new DP},workspace:{AstNodeLocator:()=>new bP,AstNodeDescriptionProvider:e=>new SP(e),ReferenceDescriptionProvider:e=>new kP(e)},references:{Linker:e=>new hP(e),NameProvider:()=>new Pv,ScopeProvider:e=>new xv(e),ScopeComputation:e=>new Dv(e),References:e=>new _v(e)},serializer:{Hydrator:e=>new QP(e),JsonSerializer:e=>new TP(e)},validation:{DocumentValidator:e=>new Mv(e),ValidationRegistry:e=>new wP(e)},shared:()=>t.shared}}function Yv(t){return{ServiceRegistry:e=>new EP(e),workspace:{LangiumDocuments:e=>new mP(e),LangiumDocumentFactory:e=>new bv(e),DocumentBuilder:e=>new _P(e),IndexManager:e=>new Kv(e),WorkspaceManager:e=>new Fv(e),FileSystemProvider:e=>t.fileSystemProvider(e),WorkspaceLock:()=>new JP,ConfigurationProvider:e=>new PP(e)}}}var Mu;(function(t){t.merge=(e,n)=>Fu(Fu({},e),n)})(Mu||(Mu={}));function Ku(t,e,n,r,i,a,s,o,l){const u=[t,e,n,r,i,a,s,o,l].reduce(Fu,{});return Jv(u)}const Xv=Symbol("isProxy");function sp(t){if(t&&t[Xv]){for(const e of Object.values(t)){sp(e)}}return t}function Jv(t,e){const n=new Proxy({},{deleteProperty:()=>false,set:()=>{throw new Error("Cannot set property on injected service container")},get:(r,i)=>{if(i===Xv){return true}else{return kh(r,i,t,e||n)}},getOwnPropertyDescriptor:(r,i)=>(kh(r,i,t,e||n),Object.getOwnPropertyDescriptor(r,i)),has:(r,i)=>i in t,ownKeys:()=>[...Object.getOwnPropertyNames(t)]});return n}const Sh=Symbol();function kh(t,e,n,r){if(e in t){if(t[e]instanceof Error){throw new Error("Construction failure. Please make sure that your dependencies are constructable.",{cause:t[e]})}if(t[e]===Sh){throw new Error('Cycle detected. Please make "'+String(e)+'" lazy. Visit https://langium.org/docs/reference/configuration-services/#resolving-cyclic-dependencies')}return t[e]}else if(e in n){const i=n[e];t[e]=Sh;try{t[e]=typeof i==="function"?i(r):Jv(i,r)}catch(a){t[e]=a instanceof Error?a:void 0;throw a}return t[e]}else{return void 0}}function Fu(t,e){if(e){for(const[n,r]of Object.entries(e)){if(r!==void 0){const i=t[n];if(i!==null&&r!==null&&typeof i==="object"&&typeof r==="object"){t[n]=Fu(i,r)}else{t[n]=r}}}}return t}class ZP{readFile(){throw new Error("No file system is available.")}async readDirectory(){return[]}}const Qv={fileSystemProvider:()=>new ZP};const e_={Grammar:()=>void 0,LanguageMetaData:()=>({caseInsensitive:false,fileExtensions:[".langium"],languageId:"langium"})};const t_={AstReflection:()=>new _g};function n_(){const t=Ku(Yv(Qv),t_);const e=Ku(zv({shared:t}),e_);t.ServiceRegistry.register(e);return e}function r_(t){var e;const n=n_();const r=n.serializer.JsonSerializer.deserialize(t);n.shared.workspace.LangiumDocumentFactory.fromModel(r,lt.parse(`memory://${(e=r.name)!==null&&e!==void 0?e:"grammar"}.langium`));return r}var fi={};var pi={};var Rn={};var mi={};var hi={};var js={};var Dc={};var V={};var Qe={};var bh;function fs(){if(bh)return Qe;bh=1;Object.defineProperty(Qe,"__esModule",{value:true});Qe.stringArray=Qe.array=Qe.func=Qe.error=Qe.number=Qe.string=Qe.boolean=void 0;function t(o){return o===true||o===false}Qe.boolean=t;function e(o){return typeof o==="string"||o instanceof String}Qe.string=e;function n(o){return typeof o==="number"||o instanceof Number}Qe.number=n;function r(o){return o instanceof Error}Qe.error=r;function i(o){return typeof o==="function"}Qe.func=i;function a(o){return Array.isArray(o)}Qe.array=a;function s(o){return a(o)&&o.every(l=>e(l))}Qe.stringArray=s;return Qe}var Nh;function Zv(){if(Nh)return V;Nh=1;Object.defineProperty(V,"__esModule",{value:true});V.Message=V.NotificationType9=V.NotificationType8=V.NotificationType7=V.NotificationType6=V.NotificationType5=V.NotificationType4=V.NotificationType3=V.NotificationType2=V.NotificationType1=V.NotificationType0=V.NotificationType=V.RequestType9=V.RequestType8=V.RequestType7=V.RequestType6=V.RequestType5=V.RequestType4=V.RequestType3=V.RequestType2=V.RequestType1=V.RequestType=V.RequestType0=V.AbstractMessageSignature=V.ParameterStructures=V.ResponseError=V.ErrorCodes=void 0;const t=fs();var e;(function(w){w.ParseError=-32700;w.InvalidRequest=-32600;w.MethodNotFound=-32601;w.InvalidParams=-32602;w.InternalError=-32603;w.jsonrpcReservedErrorRangeStart=-32099;w.serverErrorStart=-32099;w.MessageWriteError=-32099;w.MessageReadError=-32098;w.PendingResponseRejected=-32097;w.ConnectionInactive=-32096;w.ServerNotInitialized=-32002;w.UnknownErrorCode=-32001;w.jsonrpcReservedErrorRangeEnd=-32e3;w.serverErrorEnd=-32e3})(e||(V.ErrorCodes=e={}));class n extends Error{constructor(g,b,M){super(b);this.code=t.number(g)?g:e.UnknownErrorCode;this.data=M;Object.setPrototypeOf(this,n.prototype)}toJson(){const g={code:this.code,message:this.message};if(this.data!==void 0){g.data=this.data}return g}}V.ResponseError=n;class r{constructor(g){this.kind=g}static is(g){return g===r.auto||g===r.byName||g===r.byPosition}toString(){return this.kind}}V.ParameterStructures=r;r.auto=new r("auto");r.byPosition=new r("byPosition");r.byName=new r("byName");class i{constructor(g,b){this.method=g;this.numberOfParams=b}get parameterStructures(){return r.auto}}V.AbstractMessageSignature=i;class a extends i{constructor(g){super(g,0)}}V.RequestType0=a;class s extends i{constructor(g,b=r.auto){super(g,1);this._parameterStructures=b}get parameterStructures(){return this._parameterStructures}}V.RequestType=s;class o extends i{constructor(g,b=r.auto){super(g,1);this._parameterStructures=b}get parameterStructures(){return this._parameterStructures}}V.RequestType1=o;class l extends i{constructor(g){super(g,2)}}V.RequestType2=l;class u extends i{constructor(g){super(g,3)}}V.RequestType3=u;class c extends i{constructor(g){super(g,4)}}V.RequestType4=c;class d extends i{constructor(g){super(g,5)}}V.RequestType5=d;class f extends i{constructor(g){super(g,6)}}V.RequestType6=f;class p extends i{constructor(g){super(g,7)}}V.RequestType7=p;class y extends i{constructor(g){super(g,8)}}V.RequestType8=y;class v extends i{constructor(g){super(g,9)}}V.RequestType9=v;class k extends i{constructor(g,b=r.auto){super(g,1);this._parameterStructures=b}get parameterStructures(){return this._parameterStructures}}V.NotificationType=k;class $ extends i{constructor(g){super(g,0)}}V.NotificationType0=$;class E extends i{constructor(g,b=r.auto){super(g,1);this._parameterStructures=b}get parameterStructures(){return this._parameterStructures}}V.NotificationType1=E;class C extends i{constructor(g){super(g,2)}}V.NotificationType2=C;class I extends i{constructor(g){super(g,3)}}V.NotificationType3=I;class X extends i{constructor(g){super(g,4)}}V.NotificationType4=X;class q extends i{constructor(g){super(g,5)}}V.NotificationType5=q;class J extends i{constructor(g){super(g,6)}}V.NotificationType6=J;class ne extends i{constructor(g){super(g,7)}}V.NotificationType7=ne;class ae extends i{constructor(g){super(g,8)}}V.NotificationType8=ae;class de extends i{constructor(g){super(g,9)}}V.NotificationType9=de;var L;(function(w){function g(O){const x=O;return x&&t.string(x.method)&&(t.string(x.id)||t.number(x.id))}w.isRequest=g;function b(O){const x=O;return x&&t.string(x.method)&&O.id===void 0}w.isNotification=b;function M(O){const x=O;return x&&(x.result!==void 0||!!x.error)&&(t.string(x.id)||t.number(x.id)||x.id===null)}w.isResponse=M})(L||(V.Message=L={}));return V}var vn={};var Ph;function e$(){if(Ph)return vn;Ph=1;var t;Object.defineProperty(vn,"__esModule",{value:true});vn.LRUCache=vn.LinkedMap=vn.Touch=void 0;var e;(function(i){i.None=0;i.First=1;i.AsOld=i.First;i.Last=2;i.AsNew=i.Last})(e||(vn.Touch=e={}));class n{constructor(){this[t]="LinkedMap";this._map=new Map;this._head=void 0;this._tail=void 0;this._size=0;this._state=0}clear(){this._map.clear();this._head=void 0;this._tail=void 0;this._size=0;this._state++}isEmpty(){return!this._head&&!this._tail}get size(){return this._size}get first(){return this._head?.value}get last(){return this._tail?.value}has(a){return this._map.has(a)}get(a,s=e.None){const o=this._map.get(a);if(!o){return void 0}if(s!==e.None){this.touch(o,s)}return o.value}set(a,s,o=e.None){let l=this._map.get(a);if(l){l.value=s;if(o!==e.None){this.touch(l,o)}}else{l={key:a,value:s,next:void 0,previous:void 0};switch(o){case e.None:this.addItemLast(l);break;case e.First:this.addItemFirst(l);break;case e.Last:this.addItemLast(l);break;default:this.addItemLast(l);break}this._map.set(a,l);this._size++}return this}delete(a){return!!this.remove(a)}remove(a){const s=this._map.get(a);if(!s){return void 0}this._map.delete(a);this.removeItem(s);this._size--;return s.value}shift(){if(!this._head&&!this._tail){return void 0}if(!this._head||!this._tail){throw new Error("Invalid list")}const a=this._head;this._map.delete(a.key);this.removeItem(a);this._size--;return a.value}forEach(a,s){const o=this._state;let l=this._head;while(l){if(s){a.bind(s)(l.value,l.key,this)}else{a(l.value,l.key,this)}if(this._state!==o){throw new Error(`LinkedMap got modified during iteration.`)}l=l.next}}keys(){const a=this._state;let s=this._head;const o={[Symbol.iterator]:()=>{return o},next:()=>{if(this._state!==a){throw new Error(`LinkedMap got modified during iteration.`)}if(s){const l={value:s.key,done:false};s=s.next;return l}else{return{value:void 0,done:true}}}};return o}values(){const a=this._state;let s=this._head;const o={[Symbol.iterator]:()=>{return o},next:()=>{if(this._state!==a){throw new Error(`LinkedMap got modified during iteration.`)}if(s){const l={value:s.value,done:false};s=s.next;return l}else{return{value:void 0,done:true}}}};return o}entries(){const a=this._state;let s=this._head;const o={[Symbol.iterator]:()=>{return o},next:()=>{if(this._state!==a){throw new Error(`LinkedMap got modified during iteration.`)}if(s){const l={value:[s.key,s.value],done:false};s=s.next;return l}else{return{value:void 0,done:true}}}};return o}[(t=Symbol.toStringTag,Symbol.iterator)](){return this.entries()}trimOld(a){if(a>=this.size){return}if(a===0){this.clear();return}let s=this._head;let o=this.size;while(s&&o>a){this._map.delete(s.key);s=s.next;o--}this._head=s;this._size=o;if(s){s.previous=void 0}this._state++}addItemFirst(a){if(!this._head&&!this._tail){this._tail=a}else if(!this._head){throw new Error("Invalid list")}else{a.next=this._head;this._head.previous=a}this._head=a;this._state++}addItemLast(a){if(!this._head&&!this._tail){this._head=a}else if(!this._tail){throw new Error("Invalid list")}else{a.previous=this._tail;this._tail.next=a}this._tail=a;this._state++}removeItem(a){if(a===this._head&&a===this._tail){this._head=void 0;this._tail=void 0}else if(a===this._head){if(!a.next){throw new Error("Invalid list")}a.next.previous=void 0;this._head=a.next}else if(a===this._tail){if(!a.previous){throw new Error("Invalid list")}a.previous.next=void 0;this._tail=a.previous}else{const s=a.next;const o=a.previous;if(!s||!o){throw new Error("Invalid list")}s.previous=o;o.next=s}a.next=void 0;a.previous=void 0;this._state++}touch(a,s){if(!this._head||!this._tail){throw new Error("Invalid list")}if(s!==e.First&&s!==e.Last){return}if(s===e.First){if(a===this._head){return}const o=a.next;const l=a.previous;if(a===this._tail){l.next=void 0;this._tail=l}else{o.previous=l;l.next=o}a.previous=void 0;a.next=this._head;this._head.previous=a;this._head=a;this._state++}else if(s===e.Last){if(a===this._tail){return}const o=a.next;const l=a.previous;if(a===this._head){o.previous=void 0;this._head=o}else{o.previous=l;l.next=o}a.next=void 0;a.previous=this._tail;this._tail.next=a;this._tail=a;this._state++}}toJSON(){const a=[];this.forEach((s,o)=>{a.push([o,s])});return a}fromJSON(a){this.clear();for(const[s,o]of a){this.set(s,o)}}}vn.LinkedMap=n;class r extends n{constructor(a,s=1){super();this._limit=a;this._ratio=Math.min(Math.max(0,s),1)}get limit(){return this._limit}set limit(a){this._limit=a;this.checkTrim()}get ratio(){return this._ratio}set ratio(a){this._ratio=Math.min(Math.max(0,a),1);this.checkTrim()}get(a,s=e.AsNew){return super.get(a,s)}peek(a){return super.get(a,e.None)}set(a,s){super.set(a,s,e.Last);this.checkTrim();return this}checkTrim(){if(this.size>this._limit){this.trimOld(Math.round(this._limit*this._ratio))}}}vn.LRUCache=r;return vn}var yi={};var _h;function i_(){if(_h)return yi;_h=1;Object.defineProperty(yi,"__esModule",{value:true});yi.Disposable=void 0;var t;(function(e){function n(r){return{dispose:r}}e.create=n})(t||(yi.Disposable=t={}));return yi}var cr={};var Bs={};var Dh;function Ir(){if(Dh)return Bs;Dh=1;Object.defineProperty(Bs,"__esModule",{value:true});let t;function e(){if(t===void 0){throw new Error(`No runtime abstraction layer installed`)}return t}(function(n){function r(i){if(i===void 0){throw new Error(`No runtime abstraction layer provided`)}t=i}n.install=r})(e);Bs.default=e;return Bs}var Oh;function ps(){if(Oh)return cr;Oh=1;Object.defineProperty(cr,"__esModule",{value:true});cr.Emitter=cr.Event=void 0;const t=Ir();var e;(function(i){const a={dispose(){}};i.None=function(){return a}})(e||(cr.Event=e={}));class n{add(a,s=null,o){if(!this._callbacks){this._callbacks=[];this._contexts=[]}this._callbacks.push(a);this._contexts.push(s);if(Array.isArray(o)){o.push({dispose:()=>this.remove(a,s)})}}remove(a,s=null){if(!this._callbacks){return}let o=false;for(let l=0,u=this._callbacks.length;l<u;l++){if(this._callbacks[l]===a){if(this._contexts[l]===s){this._callbacks.splice(l,1);this._contexts.splice(l,1);return}else{o=true}}}if(o){throw new Error("When adding a listener with a context, you should remove it with the same context")}}invoke(...a){if(!this._callbacks){return[]}const s=[],o=this._callbacks.slice(0),l=this._contexts.slice(0);for(let u=0,c=o.length;u<c;u++){try{s.push(o[u].apply(l[u],a))}catch(d){(0,t.default)().console.error(d)}}return s}isEmpty(){return!this._callbacks||this._callbacks.length===0}dispose(){this._callbacks=void 0;this._contexts=void 0}}class r{constructor(a){this._options=a}get event(){if(!this._event){this._event=(a,s,o)=>{if(!this._callbacks){this._callbacks=new n}if(this._options&&this._options.onFirstListenerAdd&&this._callbacks.isEmpty()){this._options.onFirstListenerAdd(this)}this._callbacks.add(a,s);const l={dispose:()=>{if(!this._callbacks){return}this._callbacks.remove(a,s);l.dispose=r._noop;if(this._options&&this._options.onLastListenerRemove&&this._callbacks.isEmpty()){this._options.onLastListenerRemove(this)}}};if(Array.isArray(o)){o.push(l)}return l}}return this._event}fire(a){if(this._callbacks){this._callbacks.invoke.call(this._callbacks,a)}}dispose(){if(this._callbacks){this._callbacks.dispose();this._callbacks=void 0}}}cr.Emitter=r;r._noop=function(){};return cr}var dr={};var Ih;function Xp(){if(Ih)return dr;Ih=1;Object.defineProperty(dr,"__esModule",{value:true});dr.CancellationTokenSource=dr.CancellationToken=void 0;const t=Ir();const e=fs();const n=ps();var r;(function(o){o.None=Object.freeze({isCancellationRequested:false,onCancellationRequested:n.Event.None});o.Cancelled=Object.freeze({isCancellationRequested:true,onCancellationRequested:n.Event.None});function l(u){const c=u;return c&&(c===o.None||c===o.Cancelled||e.boolean(c.isCancellationRequested)&&!!c.onCancellationRequested)}o.is=l})(r||(dr.CancellationToken=r={}));const i=Object.freeze(function(o,l){const u=(0,t.default)().timer.setTimeout(o.bind(l),0);return{dispose(){u.dispose()}}});class a{constructor(){this._isCancelled=false}cancel(){if(!this._isCancelled){this._isCancelled=true;if(this._emitter){this._emitter.fire(void 0);this.dispose()}}}get isCancellationRequested(){return this._isCancelled}get onCancellationRequested(){if(this._isCancelled){return i}if(!this._emitter){this._emitter=new n.Emitter}return this._emitter.event}dispose(){if(this._emitter){this._emitter.dispose();this._emitter=void 0}}}class s{get token(){if(!this._token){this._token=new a}return this._token}cancel(){if(!this._token){this._token=r.Cancelled}else{this._token.cancel()}}dispose(){if(!this._token){this._token=r.None}else if(this._token instanceof a){this._token.dispose()}}}dr.CancellationTokenSource=s;return dr}var fr={};var Lh;function a_(){if(Lh)return fr;Lh=1;Object.defineProperty(fr,"__esModule",{value:true});fr.SharedArrayReceiverStrategy=fr.SharedArraySenderStrategy=void 0;const t=Xp();var e;(function(s){s.Continue=0;s.Cancelled=1})(e||(e={}));class n{constructor(){this.buffers=new Map}enableCancellation(o){if(o.id===null){return}const l=new SharedArrayBuffer(4);const u=new Int32Array(l,0,1);u[0]=e.Continue;this.buffers.set(o.id,l);o.$cancellationData=l}async sendCancellation(o,l){const u=this.buffers.get(l);if(u===void 0){return}const c=new Int32Array(u,0,1);Atomics.store(c,0,e.Cancelled)}cleanup(o){this.buffers.delete(o)}dispose(){this.buffers.clear()}}fr.SharedArraySenderStrategy=n;class r{constructor(o){this.data=new Int32Array(o,0,1)}get isCancellationRequested(){return Atomics.load(this.data,0)===e.Cancelled}get onCancellationRequested(){throw new Error(`Cancellation over SharedArrayBuffer doesn't support cancellation events`)}}class i{constructor(o){this.token=new r(o)}cancel(){}dispose(){}}class a{constructor(){this.kind="request"}createCancellationTokenSource(o){const l=o.$cancellationData;if(l===void 0){return new t.CancellationTokenSource}return new i(l)}}fr.SharedArrayReceiverStrategy=a;return fr}var $n={};var gi={};var xh;function t$(){if(xh)return gi;xh=1;Object.defineProperty(gi,"__esModule",{value:true});gi.Semaphore=void 0;const t=Ir();class e{constructor(r=1){if(r<=0){throw new Error("Capacity must be greater than 0")}this._capacity=r;this._active=0;this._waiting=[]}lock(r){return new Promise((i,a)=>{this._waiting.push({thunk:r,resolve:i,reject:a});this.runNext()})}get active(){return this._active}runNext(){if(this._waiting.length===0||this._active===this._capacity){return}(0,t.default)().timer.setImmediate(()=>this.doRunNext())}doRunNext(){if(this._waiting.length===0||this._active===this._capacity){return}const r=this._waiting.shift();this._active++;if(this._active>this._capacity){throw new Error(`To many thunks active`)}try{const i=r.thunk();if(i instanceof Promise){i.then(a=>{this._active--;r.resolve(a);this.runNext()},a=>{this._active--;r.reject(a);this.runNext()})}else{this._active--;r.resolve(i);this.runNext()}}catch(i){this._active--;r.reject(i);this.runNext()}}}gi.Semaphore=e;return gi}var Mh;function s_(){if(Mh)return $n;Mh=1;Object.defineProperty($n,"__esModule",{value:true});$n.ReadableStreamMessageReader=$n.AbstractMessageReader=$n.MessageReader=void 0;const t=Ir();const e=fs();const n=ps();const r=t$();var i;(function(l){function u(c){let d=c;return d&&e.func(d.listen)&&e.func(d.dispose)&&e.func(d.onError)&&e.func(d.onClose)&&e.func(d.onPartialMessage)}l.is=u})(i||($n.MessageReader=i={}));class a{constructor(){this.errorEmitter=new n.Emitter;this.closeEmitter=new n.Emitter;this.partialMessageEmitter=new n.Emitter}dispose(){this.errorEmitter.dispose();this.closeEmitter.dispose()}get onError(){return this.errorEmitter.event}fireError(u){this.errorEmitter.fire(this.asError(u))}get onClose(){return this.closeEmitter.event}fireClose(){this.closeEmitter.fire(void 0)}get onPartialMessage(){return this.partialMessageEmitter.event}firePartialMessage(u){this.partialMessageEmitter.fire(u)}asError(u){if(u instanceof Error){return u}else{return new Error(`Reader received error. Reason: ${e.string(u.message)?u.message:"unknown"}`)}}}$n.AbstractMessageReader=a;var s;(function(l){function u(c){let d;let f;const p=new Map;let y;const v=new Map;if(c===void 0||typeof c==="string"){d=c??"utf-8"}else{d=c.charset??"utf-8";if(c.contentDecoder!==void 0){f=c.contentDecoder;p.set(f.name,f)}if(c.contentDecoders!==void 0){for(const k of c.contentDecoders){p.set(k.name,k)}}if(c.contentTypeDecoder!==void 0){y=c.contentTypeDecoder;v.set(y.name,y)}if(c.contentTypeDecoders!==void 0){for(const k of c.contentTypeDecoders){v.set(k.name,k)}}}if(y===void 0){y=(0,t.default)().applicationJson.decoder;v.set(y.name,y)}return{charset:d,contentDecoder:f,contentDecoders:p,contentTypeDecoder:y,contentTypeDecoders:v}}l.fromOptions=u})(s||(s={}));class o extends a{constructor(u,c){super();this.readable=u;this.options=s.fromOptions(c);this.buffer=(0,t.default)().messageBuffer.create(this.options.charset);this._partialMessageTimeout=1e4;this.nextMessageLength=-1;this.messageToken=0;this.readSemaphore=new r.Semaphore(1)}set partialMessageTimeout(u){this._partialMessageTimeout=u}get partialMessageTimeout(){return this._partialMessageTimeout}listen(u){this.nextMessageLength=-1;this.messageToken=0;this.partialMessageTimer=void 0;this.callback=u;const c=this.readable.onData(d=>{this.onData(d)});this.readable.onError(d=>this.fireError(d));this.readable.onClose(()=>this.fireClose());return c}onData(u){try{this.buffer.append(u);while(true){if(this.nextMessageLength===-1){const d=this.buffer.tryReadHeaders(true);if(!d){return}const f=d.get("content-length");if(!f){this.fireError(new Error(`Header must provide a Content-Length property.
${JSON.stringify(Object.fromEntries(d))}`));return}const p=parseInt(f);if(isNaN(p)){this.fireError(new Error(`Content-Length value must be a number. Got ${f}`));return}this.nextMessageLength=p}const c=this.buffer.tryReadBody(this.nextMessageLength);if(c===void 0){this.setPartialMessageTimer();return}this.clearPartialMessageTimer();this.nextMessageLength=-1;this.readSemaphore.lock(async()=>{const d=this.options.contentDecoder!==void 0?await this.options.contentDecoder.decode(c):c;const f=await this.options.contentTypeDecoder.decode(d,this.options);this.callback(f)}).catch(d=>{this.fireError(d)})}}catch(c){this.fireError(c)}}clearPartialMessageTimer(){if(this.partialMessageTimer){this.partialMessageTimer.dispose();this.partialMessageTimer=void 0}}setPartialMessageTimer(){this.clearPartialMessageTimer();if(this._partialMessageTimeout<=0){return}this.partialMessageTimer=(0,t.default)().timer.setTimeout((u,c)=>{this.partialMessageTimer=void 0;if(u===this.messageToken){this.firePartialMessage({messageToken:u,waitingTime:c});this.setPartialMessageTimer()}},this._partialMessageTimeout,this.messageToken,this._partialMessageTimeout)}}$n.ReadableStreamMessageReader=o;return $n}var Tn={};var Kh;function o_(){if(Kh)return Tn;Kh=1;Object.defineProperty(Tn,"__esModule",{value:true});Tn.WriteableStreamMessageWriter=Tn.AbstractMessageWriter=Tn.MessageWriter=void 0;const t=Ir();const e=fs();const n=t$();const r=ps();const i="Content-Length: ";const a="\r\n";var s;(function(c){function d(f){let p=f;return p&&e.func(p.dispose)&&e.func(p.onClose)&&e.func(p.onError)&&e.func(p.write)}c.is=d})(s||(Tn.MessageWriter=s={}));class o{constructor(){this.errorEmitter=new r.Emitter;this.closeEmitter=new r.Emitter}dispose(){this.errorEmitter.dispose();this.closeEmitter.dispose()}get onError(){return this.errorEmitter.event}fireError(d,f,p){this.errorEmitter.fire([this.asError(d),f,p])}get onClose(){return this.closeEmitter.event}fireClose(){this.closeEmitter.fire(void 0)}asError(d){if(d instanceof Error){return d}else{return new Error(`Writer received error. Reason: ${e.string(d.message)?d.message:"unknown"}`)}}}Tn.AbstractMessageWriter=o;var l;(function(c){function d(f){if(f===void 0||typeof f==="string"){return{charset:f??"utf-8",contentTypeEncoder:(0,t.default)().applicationJson.encoder}}else{return{charset:f.charset??"utf-8",contentEncoder:f.contentEncoder,contentTypeEncoder:f.contentTypeEncoder??(0,t.default)().applicationJson.encoder}}}c.fromOptions=d})(l||(l={}));class u extends o{constructor(d,f){super();this.writable=d;this.options=l.fromOptions(f);this.errorCount=0;this.writeSemaphore=new n.Semaphore(1);this.writable.onError(p=>this.fireError(p));this.writable.onClose(()=>this.fireClose())}async write(d){return this.writeSemaphore.lock(async()=>{const f=this.options.contentTypeEncoder.encode(d,this.options).then(p=>{if(this.options.contentEncoder!==void 0){return this.options.contentEncoder.encode(p)}else{return p}});return f.then(p=>{const y=[];y.push(i,p.byteLength.toString(),a);y.push(a);return this.doWrite(d,y,p)},p=>{this.fireError(p);throw p})})}async doWrite(d,f,p){try{await this.writable.write(f.join(""),"ascii");return this.writable.write(p)}catch(y){this.handleError(y,d);return Promise.reject(y)}}handleError(d,f){this.errorCount++;this.fireError(d,f,this.errorCount)}end(){this.writable.end()}}Tn.WriteableStreamMessageWriter=u;return Tn}var Ri={};var Fh;function l_(){if(Fh)return Ri;Fh=1;Object.defineProperty(Ri,"__esModule",{value:true});Ri.AbstractMessageBuffer=void 0;const t=13;const e=10;const n="\r\n";class r{constructor(a="utf-8"){this._encoding=a;this._chunks=[];this._totalLength=0}get encoding(){return this._encoding}append(a){const s=typeof a==="string"?this.fromString(a,this._encoding):a;this._chunks.push(s);this._totalLength+=s.byteLength}tryReadHeaders(a=false){if(this._chunks.length===0){return void 0}let s=0;let o=0;let l=0;let u=0;e:while(o<this._chunks.length){const p=this._chunks[o];l=0;while(l<p.length){const y=p[l];switch(y){case t:switch(s){case 0:s=1;break;case 2:s=3;break;default:s=0}break;case e:switch(s){case 1:s=2;break;case 3:s=4;l++;break e;default:s=0}break;default:s=0}l++}u+=p.byteLength;o++}if(s!==4){return void 0}const c=this._read(u+l);const d=new Map;const f=this.toString(c,"ascii").split(n);if(f.length<2){return d}for(let p=0;p<f.length-2;p++){const y=f[p];const v=y.indexOf(":");if(v===-1){throw new Error(`Message header must separate key and value using ':'
${y}`)}const k=y.substr(0,v);const $=y.substr(v+1).trim();d.set(a?k.toLowerCase():k,$)}return d}tryReadBody(a){if(this._totalLength<a){return void 0}return this._read(a)}get numberOfBytes(){return this._totalLength}_read(a){if(a===0){return this.emptyBuffer()}if(a>this._totalLength){throw new Error(`Cannot read so many bytes!`)}if(this._chunks[0].byteLength===a){const u=this._chunks[0];this._chunks.shift();this._totalLength-=a;return this.asNative(u)}if(this._chunks[0].byteLength>a){const u=this._chunks[0];const c=this.asNative(u,a);this._chunks[0]=u.slice(a);this._totalLength-=a;return c}const s=this.allocNative(a);let o=0;let l=0;while(a>0){const u=this._chunks[l];if(u.byteLength>a){const c=u.slice(0,a);s.set(c,o);o+=a;this._chunks[l]=u.slice(a);this._totalLength-=a;a-=a}else{s.set(u,o);o+=u.byteLength;this._chunks.shift();this._totalLength-=u.byteLength;a-=u.byteLength}}return s}}Ri.AbstractMessageBuffer=r;return Ri}var Oc={};var Uh;function u_(){if(Uh)return Oc;Uh=1;(function(t){Object.defineProperty(t,"__esModule",{value:true});t.createMessageConnection=t.ConnectionOptions=t.MessageStrategy=t.CancellationStrategy=t.CancellationSenderStrategy=t.CancellationReceiverStrategy=t.RequestCancellationReceiverStrategy=t.IdCancellationReceiverStrategy=t.ConnectionStrategy=t.ConnectionError=t.ConnectionErrors=t.LogTraceNotification=t.SetTraceNotification=t.TraceFormat=t.TraceValues=t.Trace=t.NullLogger=t.ProgressType=t.ProgressToken=void 0;const e=Ir();const n=fs();const r=Zv();const i=e$();const a=ps();const s=Xp();var o;(function(g){g.type=new r.NotificationType("$/cancelRequest")})(o||(o={}));var l;(function(g){function b(M){return typeof M==="string"||typeof M==="number"}g.is=b})(l||(t.ProgressToken=l={}));var u;(function(g){g.type=new r.NotificationType("$/progress")})(u||(u={}));class c{constructor(){}}t.ProgressType=c;var d;(function(g){function b(M){return n.func(M)}g.is=b})(d||(d={}));t.NullLogger=Object.freeze({error:()=>{},warn:()=>{},info:()=>{},log:()=>{}});var f;(function(g){g[g["Off"]=0]="Off";g[g["Messages"]=1]="Messages";g[g["Compact"]=2]="Compact";g[g["Verbose"]=3]="Verbose"})(f||(t.Trace=f={}));var p;(function(g){g.Off="off";g.Messages="messages";g.Compact="compact";g.Verbose="verbose"})(p||(t.TraceValues=p={}));(function(g){function b(O){if(!n.string(O)){return g.Off}O=O.toLowerCase();switch(O){case"off":return g.Off;case"messages":return g.Messages;case"compact":return g.Compact;case"verbose":return g.Verbose;default:return g.Off}}g.fromString=b;function M(O){switch(O){case g.Off:return"off";case g.Messages:return"messages";case g.Compact:return"compact";case g.Verbose:return"verbose";default:return"off"}}g.toString=M})(f||(t.Trace=f={}));var y;(function(g){g["Text"]="text";g["JSON"]="json"})(y||(t.TraceFormat=y={}));(function(g){function b(M){if(!n.string(M)){return g.Text}M=M.toLowerCase();if(M==="json"){return g.JSON}else{return g.Text}}g.fromString=b})(y||(t.TraceFormat=y={}));var v;(function(g){g.type=new r.NotificationType("$/setTrace")})(v||(t.SetTraceNotification=v={}));var k;(function(g){g.type=new r.NotificationType("$/logTrace")})(k||(t.LogTraceNotification=k={}));var $;(function(g){g[g["Closed"]=1]="Closed";g[g["Disposed"]=2]="Disposed";g[g["AlreadyListening"]=3]="AlreadyListening"})($||(t.ConnectionErrors=$={}));class E extends Error{constructor(b,M){super(M);this.code=b;Object.setPrototypeOf(this,E.prototype)}}t.ConnectionError=E;var C;(function(g){function b(M){const O=M;return O&&n.func(O.cancelUndispatched)}g.is=b})(C||(t.ConnectionStrategy=C={}));var I;(function(g){function b(M){const O=M;return O&&(O.kind===void 0||O.kind==="id")&&n.func(O.createCancellationTokenSource)&&(O.dispose===void 0||n.func(O.dispose))}g.is=b})(I||(t.IdCancellationReceiverStrategy=I={}));var X;(function(g){function b(M){const O=M;return O&&O.kind==="request"&&n.func(O.createCancellationTokenSource)&&(O.dispose===void 0||n.func(O.dispose))}g.is=b})(X||(t.RequestCancellationReceiverStrategy=X={}));var q;(function(g){g.Message=Object.freeze({createCancellationTokenSource(M){return new s.CancellationTokenSource}});function b(M){return I.is(M)||X.is(M)}g.is=b})(q||(t.CancellationReceiverStrategy=q={}));var J;(function(g){g.Message=Object.freeze({sendCancellation(M,O){return M.sendNotification(o.type,{id:O})},cleanup(M){}});function b(M){const O=M;return O&&n.func(O.sendCancellation)&&n.func(O.cleanup)}g.is=b})(J||(t.CancellationSenderStrategy=J={}));var ne;(function(g){g.Message=Object.freeze({receiver:q.Message,sender:J.Message});function b(M){const O=M;return O&&q.is(O.receiver)&&J.is(O.sender)}g.is=b})(ne||(t.CancellationStrategy=ne={}));var ae;(function(g){function b(M){const O=M;return O&&n.func(O.handleMessage)}g.is=b})(ae||(t.MessageStrategy=ae={}));var de;(function(g){function b(M){const O=M;return O&&(ne.is(O.cancellationStrategy)||C.is(O.connectionStrategy)||ae.is(O.messageStrategy))}g.is=b})(de||(t.ConnectionOptions=de={}));var L;(function(g){g[g["New"]=1]="New";g[g["Listening"]=2]="Listening";g[g["Closed"]=3]="Closed";g[g["Disposed"]=4]="Disposed"})(L||(L={}));function w(g,b,M,O){const x=M!==void 0?M:t.NullLogger;let we=0;let F=0;let N=0;const re="2.0";let kt=void 0;const bt=new Map;let Ce=void 0;const Nt=new Map;const me=new Map;let Pe;let Be=new i.LinkedMap;let Re=new Map;let j=new Set;let R=new Map;let S=f.Off;let B=y.Text;let A;let fe=L.New;const st=new a.Emitter;const zt=new a.Emitter;const Bn=new a.Emitter;const Wn=new a.Emitter;const Vn=new a.Emitter;const Tt=O&&O.cancellationStrategy?O.cancellationStrategy:ne.Message;function nn(h){if(h===null){throw new Error(`Can't send requests with id null since the response can't be correlated.`)}return"req-"+h.toString()}function Lr(h){if(h===null){return"res-unknown-"+(++N).toString()}else{return"res-"+h.toString()}}function hn(){return"not-"+(++F).toString()}function yn(h,D){if(r.Message.isRequest(D)){h.set(nn(D.id),D)}else if(r.Message.isResponse(D)){h.set(Lr(D.id),D)}else{h.set(hn(),D)}}function rn(h){return void 0}function Gt(){return fe===L.Listening}function P(){return fe===L.Closed}function _(){return fe===L.Disposed}function G(){if(fe===L.New||fe===L.Listening){fe=L.Closed;zt.fire(void 0)}}function Et(h){st.fire([h,void 0,void 0])}function dt(h){st.fire(h)}g.onClose(G);g.onError(Et);b.onClose(G);b.onError(dt);function sr(){if(Pe||Be.size===0){return}Pe=(0,e.default)().timer.setImmediate(()=>{Pe=void 0;hs()})}function si(h){if(r.Message.isRequest(h)){gs(h)}else if(r.Message.isNotification(h)){vs(h)}else if(r.Message.isResponse(h)){Rs(h)}else{$s(h)}}function hs(){if(Be.size===0){return}const h=Be.shift();try{const D=O?.messageStrategy;if(ae.is(D)){D.handleMessage(h,si)}else{si(h)}}finally{sr()}}const ys=h=>{try{if(r.Message.isNotification(h)&&h.method===o.type.method){const D=h.params.id;const K=nn(D);const W=Be.get(K);if(r.Message.isRequest(W)){const he=O?.connectionStrategy;const _e=he&&he.cancelUndispatched?he.cancelUndispatched(W,rn):rn(W);if(_e&&(_e.error!==void 0||_e.result!==void 0)){Be.delete(K);R.delete(D);_e.id=W.id;or(_e,h.method,Date.now());b.write(_e).catch(()=>x.error(`Sending response for canceled message failed.`));return}}const $e=R.get(D);if($e!==void 0){$e.cancel();xr(h);return}else{j.add(D)}}yn(Be,h)}finally{sr()}};function gs(h){if(_()){return}function D(se,Ae,pe){const We={jsonrpc:re,id:h.id};if(se instanceof r.ResponseError){We.error=se.toJson()}else{We.result=se===void 0?null:se}or(We,Ae,pe);b.write(We).catch(()=>x.error(`Sending response failed.`))}function K(se,Ae,pe){const We={jsonrpc:re,id:h.id,error:se.toJson()};or(We,Ae,pe);b.write(We).catch(()=>x.error(`Sending response failed.`))}function W(se,Ae,pe){if(se===void 0){se=null}const We={jsonrpc:re,id:h.id,result:se};or(We,Ae,pe);b.write(We).catch(()=>x.error(`Sending response failed.`))}ws(h);const $e=bt.get(h.method);let he;let _e;if($e){he=$e.type;_e=$e.handler}const Ke=Date.now();if(_e||kt){const se=h.id??String(Date.now());const Ae=I.is(Tt.receiver)?Tt.receiver.createCancellationTokenSource(se):Tt.receiver.createCancellationTokenSource(h);if(h.id!==null&&j.has(h.id)){Ae.cancel()}if(h.id!==null){R.set(se,Ae)}try{let pe;if(_e){if(h.params===void 0){if(he!==void 0&&he.numberOfParams!==0){K(new r.ResponseError(r.ErrorCodes.InvalidParams,`Request ${h.method} defines ${he.numberOfParams} params but received none.`),h.method,Ke);return}pe=_e(Ae.token)}else if(Array.isArray(h.params)){if(he!==void 0&&he.parameterStructures===r.ParameterStructures.byName){K(new r.ResponseError(r.ErrorCodes.InvalidParams,`Request ${h.method} defines parameters by name but received parameters by position`),h.method,Ke);return}pe=_e(...h.params,Ae.token)}else{if(he!==void 0&&he.parameterStructures===r.ParameterStructures.byPosition){K(new r.ResponseError(r.ErrorCodes.InvalidParams,`Request ${h.method} defines parameters by position but received parameters by name`),h.method,Ke);return}pe=_e(h.params,Ae.token)}}else if(kt){pe=kt(h.method,h.params,Ae.token)}const We=pe;if(!pe){R.delete(se);W(pe,h.method,Ke)}else if(We.then){We.then(ft=>{R.delete(se);D(ft,h.method,Ke)},ft=>{R.delete(se);if(ft instanceof r.ResponseError){K(ft,h.method,Ke)}else if(ft&&n.string(ft.message)){K(new r.ResponseError(r.ErrorCodes.InternalError,`Request ${h.method} failed with message: ${ft.message}`),h.method,Ke)}else{K(new r.ResponseError(r.ErrorCodes.InternalError,`Request ${h.method} failed unexpectedly without providing any details.`),h.method,Ke)}})}else{R.delete(se);D(pe,h.method,Ke)}}catch(pe){R.delete(se);if(pe instanceof r.ResponseError){D(pe,h.method,Ke)}else if(pe&&n.string(pe.message)){K(new r.ResponseError(r.ErrorCodes.InternalError,`Request ${h.method} failed with message: ${pe.message}`),h.method,Ke)}else{K(new r.ResponseError(r.ErrorCodes.InternalError,`Request ${h.method} failed unexpectedly without providing any details.`),h.method,Ke)}}}else{K(new r.ResponseError(r.ErrorCodes.MethodNotFound,`Unhandled method ${h.method}`),h.method,Ke)}}function Rs(h){if(_()){return}if(h.id===null){if(h.error){x.error(`Received response message without id: Error is: 
${JSON.stringify(h.error,void 0,4)}`)}else{x.error(`Received response message without id. No further error information provided.`)}}else{const D=h.id;const K=Re.get(D);Cs(h,K);if(K!==void 0){Re.delete(D);try{if(h.error){const W=h.error;K.reject(new r.ResponseError(W.code,W.message,W.data))}else if(h.result!==void 0){K.resolve(h.result)}else{throw new Error("Should never happen.")}}catch(W){if(W.message){x.error(`Response handler '${K.method}' failed with message: ${W.message}`)}else{x.error(`Response handler '${K.method}' failed unexpectedly.`)}}}}}function vs(h){if(_()){return}let D=void 0;let K;if(h.method===o.type.method){const W=h.params.id;j.delete(W);xr(h);return}else{const W=Nt.get(h.method);if(W){K=W.handler;D=W.type}}if(K||Ce){try{xr(h);if(K){if(h.params===void 0){if(D!==void 0){if(D.numberOfParams!==0&&D.parameterStructures!==r.ParameterStructures.byName){x.error(`Notification ${h.method} defines ${D.numberOfParams} params but received none.`)}}K()}else if(Array.isArray(h.params)){const W=h.params;if(h.method===u.type.method&&W.length===2&&l.is(W[0])){K({token:W[0],value:W[1]})}else{if(D!==void 0){if(D.parameterStructures===r.ParameterStructures.byName){x.error(`Notification ${h.method} defines parameters by name but received parameters by position`)}if(D.numberOfParams!==h.params.length){x.error(`Notification ${h.method} defines ${D.numberOfParams} params but received ${W.length} arguments`)}}K(...W)}}else{if(D!==void 0&&D.parameterStructures===r.ParameterStructures.byPosition){x.error(`Notification ${h.method} defines parameters by position but received parameters by name`)}K(h.params)}}else if(Ce){Ce(h.method,h.params)}}catch(W){if(W.message){x.error(`Notification handler '${h.method}' failed with message: ${W.message}`)}else{x.error(`Notification handler '${h.method}' failed unexpectedly.`)}}}else{Bn.fire(h)}}function $s(h){if(!h){x.error("Received empty message.");return}x.error(`Received message which is neither a response nor a notification message:
${JSON.stringify(h,null,4)}`);const D=h;if(n.string(D.id)||n.number(D.id)){const K=D.id;const W=Re.get(K);if(W){W.reject(new Error("The received response has neither a result nor an error property."))}}}function Yt(h){if(h===void 0||h===null){return void 0}switch(S){case f.Verbose:return JSON.stringify(h,null,4);case f.Compact:return JSON.stringify(h);default:return void 0}}function Ts(h){if(S===f.Off||!A){return}if(B===y.Text){let D=void 0;if((S===f.Verbose||S===f.Compact)&&h.params){D=`Params: ${Yt(h.params)}

`}A.log(`Sending request '${h.method} - (${h.id})'.`,D)}else{gn("send-request",h)}}function Es(h){if(S===f.Off||!A){return}if(B===y.Text){let D=void 0;if(S===f.Verbose||S===f.Compact){if(h.params){D=`Params: ${Yt(h.params)}

`}else{D="No parameters provided.\n\n"}}A.log(`Sending notification '${h.method}'.`,D)}else{gn("send-notification",h)}}function or(h,D,K){if(S===f.Off||!A){return}if(B===y.Text){let W=void 0;if(S===f.Verbose||S===f.Compact){if(h.error&&h.error.data){W=`Error data: ${Yt(h.error.data)}

`}else{if(h.result){W=`Result: ${Yt(h.result)}

`}else if(h.error===void 0){W="No result returned.\n\n"}}}A.log(`Sending response '${D} - (${h.id})'. Processing request took ${Date.now()-K}ms`,W)}else{gn("send-response",h)}}function ws(h){if(S===f.Off||!A){return}if(B===y.Text){let D=void 0;if((S===f.Verbose||S===f.Compact)&&h.params){D=`Params: ${Yt(h.params)}

`}A.log(`Received request '${h.method} - (${h.id})'.`,D)}else{gn("receive-request",h)}}function xr(h){if(S===f.Off||!A||h.method===k.type.method){return}if(B===y.Text){let D=void 0;if(S===f.Verbose||S===f.Compact){if(h.params){D=`Params: ${Yt(h.params)}

`}else{D="No parameters provided.\n\n"}}A.log(`Received notification '${h.method}'.`,D)}else{gn("receive-notification",h)}}function Cs(h,D){if(S===f.Off||!A){return}if(B===y.Text){let K=void 0;if(S===f.Verbose||S===f.Compact){if(h.error&&h.error.data){K=`Error data: ${Yt(h.error.data)}

`}else{if(h.result){K=`Result: ${Yt(h.result)}

`}else if(h.error===void 0){K="No result returned.\n\n"}}}if(D){const W=h.error?` Request failed: ${h.error.message} (${h.error.code}).`:"";A.log(`Received response '${D.method} - (${h.id})' in ${Date.now()-D.timerStart}ms.${W}`,K)}else{A.log(`Received response ${h.id} without active response promise.`,K)}}else{gn("receive-response",h)}}function gn(h,D){if(!A||S===f.Off){return}const K={isLSPMessage:true,type:h,message:D,timestamp:Date.now()};A.log(K)}function zn(){if(P()){throw new E($.Closed,"Connection is closed.")}if(_()){throw new E($.Disposed,"Connection is disposed.")}}function As(){if(Gt()){throw new E($.AlreadyListening,"Connection is already listening")}}function Ss(){if(!Gt()){throw new Error("Call listen() first.")}}function Yn(h){if(h===void 0){return null}else{return h}}function oi(h){if(h===null){return void 0}else{return h}}function m(h){return h!==void 0&&h!==null&&!Array.isArray(h)&&typeof h==="object"}function xe(h,D){switch(h){case r.ParameterStructures.auto:if(m(D)){return oi(D)}else{return[Yn(D)]}case r.ParameterStructures.byName:if(!m(D)){throw new Error(`Received parameters by name but param is not an object literal.`)}return oi(D);case r.ParameterStructures.byPosition:return[Yn(D)];default:throw new Error(`Unknown parameter structure ${h.toString()}`)}}function Me(h,D){let K;const W=h.numberOfParams;switch(W){case 0:K=void 0;break;case 1:K=xe(h.parameterStructures,D[0]);break;default:K=[];for(let $e=0;$e<D.length&&$e<W;$e++){K.push(Yn(D[$e]))}if(D.length<W){for(let $e=D.length;$e<W;$e++){K.push(null)}}break}return K}const ee={sendNotification:(h,...D)=>{zn();let K;let W;if(n.string(h)){K=h;const he=D[0];let _e=0;let Ke=r.ParameterStructures.auto;if(r.ParameterStructures.is(he)){_e=1;Ke=he}let se=D.length;const Ae=se-_e;switch(Ae){case 0:W=void 0;break;case 1:W=xe(Ke,D[_e]);break;default:if(Ke===r.ParameterStructures.byName){throw new Error(`Received ${Ae} parameters for 'by Name' notification parameter structure.`)}W=D.slice(_e,se).map(pe=>Yn(pe));break}}else{const he=D;K=h.method;W=Me(h,he)}const $e={jsonrpc:re,method:K,params:W};Es($e);return b.write($e).catch(he=>{x.error(`Sending notification failed.`);throw he})},onNotification:(h,D)=>{zn();let K;if(n.func(h)){Ce=h}else if(D){if(n.string(h)){K=h;Nt.set(h,{type:void 0,handler:D})}else{K=h.method;Nt.set(h.method,{type:h,handler:D})}}return{dispose:()=>{if(K!==void 0){Nt.delete(K)}else{Ce=void 0}}}},onProgress:(h,D,K)=>{if(me.has(D)){throw new Error(`Progress handler for token ${D} already registered`)}me.set(D,K);return{dispose:()=>{me.delete(D)}}},sendProgress:(h,D,K)=>{return ee.sendNotification(u.type,{token:D,value:K})},onUnhandledProgress:Wn.event,sendRequest:(h,...D)=>{zn();Ss();let K;let W;let $e=void 0;if(n.string(h)){K=h;const se=D[0];const Ae=D[D.length-1];let pe=0;let We=r.ParameterStructures.auto;if(r.ParameterStructures.is(se)){pe=1;We=se}let ft=D.length;if(s.CancellationToken.is(Ae)){ft=ft-1;$e=Ae}const an=ft-pe;switch(an){case 0:W=void 0;break;case 1:W=xe(We,D[pe]);break;default:if(We===r.ParameterStructures.byName){throw new Error(`Received ${an} parameters for 'by Name' request parameter structure.`)}W=D.slice(pe,ft).map(T$=>Yn(T$));break}}else{const se=D;K=h.method;W=Me(h,se);const Ae=h.numberOfParams;$e=s.CancellationToken.is(se[Ae])?se[Ae]:void 0}const he=we++;let _e;if($e){_e=$e.onCancellationRequested(()=>{const se=Tt.sender.sendCancellation(ee,he);if(se===void 0){x.log(`Received no promise from cancellation strategy when cancelling id ${he}`);return Promise.resolve()}else{return se.catch(()=>{x.log(`Sending cancellation messages for id ${he} failed`)})}})}const Ke={jsonrpc:re,id:he,method:K,params:W};Ts(Ke);if(typeof Tt.sender.enableCancellation==="function"){Tt.sender.enableCancellation(Ke)}return new Promise(async(se,Ae)=>{const pe=an=>{se(an);Tt.sender.cleanup(he);_e?.dispose()};const We=an=>{Ae(an);Tt.sender.cleanup(he);_e?.dispose()};const ft={method:K,timerStart:Date.now(),resolve:pe,reject:We};try{await b.write(Ke);Re.set(he,ft)}catch(an){x.error(`Sending request failed.`);ft.reject(new r.ResponseError(r.ErrorCodes.MessageWriteError,an.message?an.message:"Unknown reason"));throw an}})},onRequest:(h,D)=>{zn();let K=null;if(d.is(h)){K=void 0;kt=h}else if(n.string(h)){K=null;if(D!==void 0){K=h;bt.set(h,{handler:D,type:void 0})}}else{if(D!==void 0){K=h.method;bt.set(h.method,{type:h,handler:D})}}return{dispose:()=>{if(K===null){return}if(K!==void 0){bt.delete(K)}else{kt=void 0}}}},hasPendingResponse:()=>{return Re.size>0},trace:async(h,D,K)=>{let W=false;let $e=y.Text;if(K!==void 0){if(n.boolean(K)){W=K}else{W=K.sendNotification||false;$e=K.traceFormat||y.Text}}S=h;B=$e;if(S===f.Off){A=void 0}else{A=D}if(W&&!P()&&!_()){await ee.sendNotification(v.type,{value:f.toString(h)})}},onError:st.event,onClose:zt.event,onUnhandledNotification:Bn.event,onDispose:Vn.event,end:()=>{b.end()},dispose:()=>{if(_()){return}fe=L.Disposed;Vn.fire(void 0);const h=new r.ResponseError(r.ErrorCodes.PendingResponseRejected,"Pending response rejected since connection got disposed");for(const D of Re.values()){D.reject(h)}Re=new Map;R=new Map;j=new Set;Be=new i.LinkedMap;if(n.func(b.dispose)){b.dispose()}if(n.func(g.dispose)){g.dispose()}},listen:()=>{zn();As();fe=L.Listening;g.listen(ys)},inspect:()=>{(0,e.default)().console.log("inspect")}};ee.onNotification(k.type,h=>{if(S===f.Off||!A){return}const D=S===f.Verbose||S===f.Compact;A.log(h.message,D?h.verbose:void 0)});ee.onNotification(u.type,h=>{const D=me.get(h.token);if(D){D(h.value)}else{Wn.fire(h)}});return ee}t.createMessageConnection=w})(Oc);return Oc}var Gh;function op(){if(Gh)return Dc;Gh=1;(function(t){Object.defineProperty(t,"__esModule",{value:true});t.ProgressType=t.ProgressToken=t.createMessageConnection=t.NullLogger=t.ConnectionOptions=t.ConnectionStrategy=t.AbstractMessageBuffer=t.WriteableStreamMessageWriter=t.AbstractMessageWriter=t.MessageWriter=t.ReadableStreamMessageReader=t.AbstractMessageReader=t.MessageReader=t.SharedArrayReceiverStrategy=t.SharedArraySenderStrategy=t.CancellationToken=t.CancellationTokenSource=t.Emitter=t.Event=t.Disposable=t.LRUCache=t.Touch=t.LinkedMap=t.ParameterStructures=t.NotificationType9=t.NotificationType8=t.NotificationType7=t.NotificationType6=t.NotificationType5=t.NotificationType4=t.NotificationType3=t.NotificationType2=t.NotificationType1=t.NotificationType0=t.NotificationType=t.ErrorCodes=t.ResponseError=t.RequestType9=t.RequestType8=t.RequestType7=t.RequestType6=t.RequestType5=t.RequestType4=t.RequestType3=t.RequestType2=t.RequestType1=t.RequestType0=t.RequestType=t.Message=t.RAL=void 0;t.MessageStrategy=t.CancellationStrategy=t.CancellationSenderStrategy=t.CancellationReceiverStrategy=t.ConnectionError=t.ConnectionErrors=t.LogTraceNotification=t.SetTraceNotification=t.TraceFormat=t.TraceValues=t.Trace=void 0;const e=Zv();Object.defineProperty(t,"Message",{enumerable:true,get:function(){return e.Message}});Object.defineProperty(t,"RequestType",{enumerable:true,get:function(){return e.RequestType}});Object.defineProperty(t,"RequestType0",{enumerable:true,get:function(){return e.RequestType0}});Object.defineProperty(t,"RequestType1",{enumerable:true,get:function(){return e.RequestType1}});Object.defineProperty(t,"RequestType2",{enumerable:true,get:function(){return e.RequestType2}});Object.defineProperty(t,"RequestType3",{enumerable:true,get:function(){return e.RequestType3}});Object.defineProperty(t,"RequestType4",{enumerable:true,get:function(){return e.RequestType4}});Object.defineProperty(t,"RequestType5",{enumerable:true,get:function(){return e.RequestType5}});Object.defineProperty(t,"RequestType6",{enumerable:true,get:function(){return e.RequestType6}});Object.defineProperty(t,"RequestType7",{enumerable:true,get:function(){return e.RequestType7}});Object.defineProperty(t,"RequestType8",{enumerable:true,get:function(){return e.RequestType8}});Object.defineProperty(t,"RequestType9",{enumerable:true,get:function(){return e.RequestType9}});Object.defineProperty(t,"ResponseError",{enumerable:true,get:function(){return e.ResponseError}});Object.defineProperty(t,"ErrorCodes",{enumerable:true,get:function(){return e.ErrorCodes}});Object.defineProperty(t,"NotificationType",{enumerable:true,get:function(){return e.NotificationType}});Object.defineProperty(t,"NotificationType0",{enumerable:true,get:function(){return e.NotificationType0}});Object.defineProperty(t,"NotificationType1",{enumerable:true,get:function(){return e.NotificationType1}});Object.defineProperty(t,"NotificationType2",{enumerable:true,get:function(){return e.NotificationType2}});Object.defineProperty(t,"NotificationType3",{enumerable:true,get:function(){return e.NotificationType3}});Object.defineProperty(t,"NotificationType4",{enumerable:true,get:function(){return e.NotificationType4}});Object.defineProperty(t,"NotificationType5",{enumerable:true,get:function(){return e.NotificationType5}});Object.defineProperty(t,"NotificationType6",{enumerable:true,get:function(){return e.NotificationType6}});Object.defineProperty(t,"NotificationType7",{enumerable:true,get:function(){return e.NotificationType7}});Object.defineProperty(t,"NotificationType8",{enumerable:true,get:function(){return e.NotificationType8}});Object.defineProperty(t,"NotificationType9",{enumerable:true,get:function(){return e.NotificationType9}});Object.defineProperty(t,"ParameterStructures",{enumerable:true,get:function(){return e.ParameterStructures}});const n=e$();Object.defineProperty(t,"LinkedMap",{enumerable:true,get:function(){return n.LinkedMap}});Object.defineProperty(t,"LRUCache",{enumerable:true,get:function(){return n.LRUCache}});Object.defineProperty(t,"Touch",{enumerable:true,get:function(){return n.Touch}});const r=i_();Object.defineProperty(t,"Disposable",{enumerable:true,get:function(){return r.Disposable}});const i=ps();Object.defineProperty(t,"Event",{enumerable:true,get:function(){return i.Event}});Object.defineProperty(t,"Emitter",{enumerable:true,get:function(){return i.Emitter}});const a=Xp();Object.defineProperty(t,"CancellationTokenSource",{enumerable:true,get:function(){return a.CancellationTokenSource}});Object.defineProperty(t,"CancellationToken",{enumerable:true,get:function(){return a.CancellationToken}});const s=a_();Object.defineProperty(t,"SharedArraySenderStrategy",{enumerable:true,get:function(){return s.SharedArraySenderStrategy}});Object.defineProperty(t,"SharedArrayReceiverStrategy",{enumerable:true,get:function(){return s.SharedArrayReceiverStrategy}});const o=s_();Object.defineProperty(t,"MessageReader",{enumerable:true,get:function(){return o.MessageReader}});Object.defineProperty(t,"AbstractMessageReader",{enumerable:true,get:function(){return o.AbstractMessageReader}});Object.defineProperty(t,"ReadableStreamMessageReader",{enumerable:true,get:function(){return o.ReadableStreamMessageReader}});const l=o_();Object.defineProperty(t,"MessageWriter",{enumerable:true,get:function(){return l.MessageWriter}});Object.defineProperty(t,"AbstractMessageWriter",{enumerable:true,get:function(){return l.AbstractMessageWriter}});Object.defineProperty(t,"WriteableStreamMessageWriter",{enumerable:true,get:function(){return l.WriteableStreamMessageWriter}});const u=l_();Object.defineProperty(t,"AbstractMessageBuffer",{enumerable:true,get:function(){return u.AbstractMessageBuffer}});const c=u_();Object.defineProperty(t,"ConnectionStrategy",{enumerable:true,get:function(){return c.ConnectionStrategy}});Object.defineProperty(t,"ConnectionOptions",{enumerable:true,get:function(){return c.ConnectionOptions}});Object.defineProperty(t,"NullLogger",{enumerable:true,get:function(){return c.NullLogger}});Object.defineProperty(t,"createMessageConnection",{enumerable:true,get:function(){return c.createMessageConnection}});Object.defineProperty(t,"ProgressToken",{enumerable:true,get:function(){return c.ProgressToken}});Object.defineProperty(t,"ProgressType",{enumerable:true,get:function(){return c.ProgressType}});Object.defineProperty(t,"Trace",{enumerable:true,get:function(){return c.Trace}});Object.defineProperty(t,"TraceValues",{enumerable:true,get:function(){return c.TraceValues}});Object.defineProperty(t,"TraceFormat",{enumerable:true,get:function(){return c.TraceFormat}});Object.defineProperty(t,"SetTraceNotification",{enumerable:true,get:function(){return c.SetTraceNotification}});Object.defineProperty(t,"LogTraceNotification",{enumerable:true,get:function(){return c.LogTraceNotification}});Object.defineProperty(t,"ConnectionErrors",{enumerable:true,get:function(){return c.ConnectionErrors}});Object.defineProperty(t,"ConnectionError",{enumerable:true,get:function(){return c.ConnectionError}});Object.defineProperty(t,"CancellationReceiverStrategy",{enumerable:true,get:function(){return c.CancellationReceiverStrategy}});Object.defineProperty(t,"CancellationSenderStrategy",{enumerable:true,get:function(){return c.CancellationSenderStrategy}});Object.defineProperty(t,"CancellationStrategy",{enumerable:true,get:function(){return c.CancellationStrategy}});Object.defineProperty(t,"MessageStrategy",{enumerable:true,get:function(){return c.MessageStrategy}});const d=Ir();t.RAL=d.default})(Dc);return Dc}var Hh;function c_(){if(Hh)return js;Hh=1;Object.defineProperty(js,"__esModule",{value:true});const t=op();class e extends t.AbstractMessageBuffer{constructor(l="utf-8"){super(l);this.asciiDecoder=new TextDecoder("ascii")}emptyBuffer(){return e.emptyBuffer}fromString(l,u){return new TextEncoder().encode(l)}toString(l,u){if(u==="ascii"){return this.asciiDecoder.decode(l)}else{return new TextDecoder(u).decode(l)}}asNative(l,u){if(u===void 0){return l}else{return l.slice(0,u)}}allocNative(l){return new Uint8Array(l)}}e.emptyBuffer=new Uint8Array(0);class n{constructor(l){this.socket=l;this._onData=new t.Emitter;this._messageListener=u=>{const c=u.data;c.arrayBuffer().then(d=>{this._onData.fire(new Uint8Array(d))},()=>{(0,t.RAL)().console.error(`Converting blob to array buffer failed.`)})};this.socket.addEventListener("message",this._messageListener)}onClose(l){this.socket.addEventListener("close",l);return t.Disposable.create(()=>this.socket.removeEventListener("close",l))}onError(l){this.socket.addEventListener("error",l);return t.Disposable.create(()=>this.socket.removeEventListener("error",l))}onEnd(l){this.socket.addEventListener("end",l);return t.Disposable.create(()=>this.socket.removeEventListener("end",l))}onData(l){return this._onData.event(l)}}class r{constructor(l){this.socket=l}onClose(l){this.socket.addEventListener("close",l);return t.Disposable.create(()=>this.socket.removeEventListener("close",l))}onError(l){this.socket.addEventListener("error",l);return t.Disposable.create(()=>this.socket.removeEventListener("error",l))}onEnd(l){this.socket.addEventListener("end",l);return t.Disposable.create(()=>this.socket.removeEventListener("end",l))}write(l,u){if(typeof l==="string"){if(u!==void 0&&u!=="utf-8"){throw new Error(`In a Browser environments only utf-8 text encoding is supported. But got encoding: ${u}`)}this.socket.send(l)}else{this.socket.send(l)}return Promise.resolve()}end(){this.socket.close()}}const i=new TextEncoder;const a=Object.freeze({messageBuffer:Object.freeze({create:o=>new e(o)}),applicationJson:Object.freeze({encoder:Object.freeze({name:"application/json",encode:(o,l)=>{if(l.charset!=="utf-8"){throw new Error(`In a Browser environments only utf-8 text encoding is supported. But got encoding: ${l.charset}`)}return Promise.resolve(i.encode(JSON.stringify(o,void 0,0)))}}),decoder:Object.freeze({name:"application/json",decode:(o,l)=>{if(!(o instanceof Uint8Array)){throw new Error(`In a Browser environments only Uint8Arrays are supported.`)}return Promise.resolve(JSON.parse(new TextDecoder(l.charset).decode(o)))}})}),stream:Object.freeze({asReadableStream:o=>new n(o),asWritableStream:o=>new r(o)}),console,timer:Object.freeze({setTimeout(o,l,...u){const c=setTimeout(o,l,...u);return{dispose:()=>clearTimeout(c)}},setImmediate(o,...l){const u=setTimeout(o,0,...l);return{dispose:()=>clearTimeout(u)}},setInterval(o,l,...u){const c=setInterval(o,l,...u);return{dispose:()=>clearInterval(c)}}})});function s(){return a}(function(o){function l(){t.RAL.install(a)}o.install=l})(s);js.default=s;return js}var qh;function ai(){if(qh)return hi;qh=1;(function(t){var e=hi.__createBinding||(Object.create?function(l,u,c,d){if(d===void 0)d=c;var f=Object.getOwnPropertyDescriptor(u,c);if(!f||("get"in f?!u.__esModule:f.writable||f.configurable)){f={enumerable:true,get:function(){return u[c]}}}Object.defineProperty(l,d,f)}:function(l,u,c,d){if(d===void 0)d=c;l[d]=u[c]});var n=hi.__exportStar||function(l,u){for(var c in l)if(c!=="default"&&!Object.prototype.hasOwnProperty.call(u,c))e(u,l,c)};Object.defineProperty(t,"__esModule",{value:true});t.createMessageConnection=t.BrowserMessageWriter=t.BrowserMessageReader=void 0;const r=c_();r.default.install();const i=op();n(op(),t);class a extends i.AbstractMessageReader{constructor(u){super();this._onData=new i.Emitter;this._messageListener=c=>{this._onData.fire(c.data)};u.addEventListener("error",c=>this.fireError(c));u.onmessage=this._messageListener}listen(u){return this._onData.event(u)}}t.BrowserMessageReader=a;class s extends i.AbstractMessageWriter{constructor(u){super();this.port=u;this.errorCount=0;u.addEventListener("error",c=>this.fireError(c))}write(u){try{this.port.postMessage(u);return Promise.resolve()}catch(c){this.handleError(c,u);return Promise.reject(c)}}handleError(u,c){this.errorCount++;this.fireError(u,c,this.errorCount)}end(){}}t.BrowserMessageWriter=s;function o(l,u,c,d){if(c===void 0){c=i.NullLogger}if(i.ConnectionStrategy.is(d)){d={connectionStrategy:d}}return(0,i.createMessageConnection)(l,u,c,d)}t.createMessageConnection=o})(hi);return hi}var Ic;var jh;function Bh(){if(jh)return Ic;jh=1;Ic=ai();return Ic}var vi={};var Jp=oP(GN);var pt={};var Wh;function Ne(){if(Wh)return pt;Wh=1;Object.defineProperty(pt,"__esModule",{value:true});pt.ProtocolNotificationType=pt.ProtocolNotificationType0=pt.ProtocolRequestType=pt.ProtocolRequestType0=pt.RegistrationType=pt.MessageDirection=void 0;const t=ai();var e;(function(o){o["clientToServer"]="clientToServer";o["serverToClient"]="serverToClient";o["both"]="both"})(e||(pt.MessageDirection=e={}));class n{constructor(l){this.method=l}}pt.RegistrationType=n;class r extends t.RequestType0{constructor(l){super(l)}}pt.ProtocolRequestType0=r;class i extends t.RequestType{constructor(l){super(l,t.ParameterStructures.byName)}}pt.ProtocolRequestType=i;class a extends t.NotificationType0{constructor(l){super(l)}}pt.ProtocolNotificationType0=a;class s extends t.NotificationType{constructor(l){super(l,t.ParameterStructures.byName)}}pt.ProtocolNotificationType=s;return pt}var Lc={};var Fe={};var Vh;function Qp(){if(Vh)return Fe;Vh=1;Object.defineProperty(Fe,"__esModule",{value:true});Fe.objectLiteral=Fe.typedArray=Fe.stringArray=Fe.array=Fe.func=Fe.error=Fe.number=Fe.string=Fe.boolean=void 0;function t(u){return u===true||u===false}Fe.boolean=t;function e(u){return typeof u==="string"||u instanceof String}Fe.string=e;function n(u){return typeof u==="number"||u instanceof Number}Fe.number=n;function r(u){return u instanceof Error}Fe.error=r;function i(u){return typeof u==="function"}Fe.func=i;function a(u){return Array.isArray(u)}Fe.array=a;function s(u){return a(u)&&u.every(c=>e(c))}Fe.stringArray=s;function o(u,c){return Array.isArray(u)&&u.every(c)}Fe.typedArray=o;function l(u){return u!==null&&typeof u==="object"}Fe.objectLiteral=l;return Fe}var $i={};var zh;function d_(){if(zh)return $i;zh=1;Object.defineProperty($i,"__esModule",{value:true});$i.ImplementationRequest=void 0;const t=Ne();var e;(function(n){n.method="textDocument/implementation";n.messageDirection=t.MessageDirection.clientToServer;n.type=new t.ProtocolRequestType(n.method)})(e||($i.ImplementationRequest=e={}));return $i}var Ti={};var Yh;function f_(){if(Yh)return Ti;Yh=1;Object.defineProperty(Ti,"__esModule",{value:true});Ti.TypeDefinitionRequest=void 0;const t=Ne();var e;(function(n){n.method="textDocument/typeDefinition";n.messageDirection=t.MessageDirection.clientToServer;n.type=new t.ProtocolRequestType(n.method)})(e||(Ti.TypeDefinitionRequest=e={}));return Ti}var pr={};var Xh;function p_(){if(Xh)return pr;Xh=1;Object.defineProperty(pr,"__esModule",{value:true});pr.DidChangeWorkspaceFoldersNotification=pr.WorkspaceFoldersRequest=void 0;const t=Ne();var e;(function(r){r.method="workspace/workspaceFolders";r.messageDirection=t.MessageDirection.serverToClient;r.type=new t.ProtocolRequestType0(r.method)})(e||(pr.WorkspaceFoldersRequest=e={}));var n;(function(r){r.method="workspace/didChangeWorkspaceFolders";r.messageDirection=t.MessageDirection.clientToServer;r.type=new t.ProtocolNotificationType(r.method)})(n||(pr.DidChangeWorkspaceFoldersNotification=n={}));return pr}var Ei={};var Jh;function m_(){if(Jh)return Ei;Jh=1;Object.defineProperty(Ei,"__esModule",{value:true});Ei.ConfigurationRequest=void 0;const t=Ne();var e;(function(n){n.method="workspace/configuration";n.messageDirection=t.MessageDirection.serverToClient;n.type=new t.ProtocolRequestType(n.method)})(e||(Ei.ConfigurationRequest=e={}));return Ei}var mr={};var Qh;function h_(){if(Qh)return mr;Qh=1;Object.defineProperty(mr,"__esModule",{value:true});mr.ColorPresentationRequest=mr.DocumentColorRequest=void 0;const t=Ne();var e;(function(r){r.method="textDocument/documentColor";r.messageDirection=t.MessageDirection.clientToServer;r.type=new t.ProtocolRequestType(r.method)})(e||(mr.DocumentColorRequest=e={}));var n;(function(r){r.method="textDocument/colorPresentation";r.messageDirection=t.MessageDirection.clientToServer;r.type=new t.ProtocolRequestType(r.method)})(n||(mr.ColorPresentationRequest=n={}));return mr}var hr={};var Zh;function y_(){if(Zh)return hr;Zh=1;Object.defineProperty(hr,"__esModule",{value:true});hr.FoldingRangeRefreshRequest=hr.FoldingRangeRequest=void 0;const t=Ne();var e;(function(r){r.method="textDocument/foldingRange";r.messageDirection=t.MessageDirection.clientToServer;r.type=new t.ProtocolRequestType(r.method)})(e||(hr.FoldingRangeRequest=e={}));var n;(function(r){r.method=`workspace/foldingRange/refresh`;r.messageDirection=t.MessageDirection.serverToClient;r.type=new t.ProtocolRequestType0(r.method)})(n||(hr.FoldingRangeRefreshRequest=n={}));return hr}var wi={};var ey;function g_(){if(ey)return wi;ey=1;Object.defineProperty(wi,"__esModule",{value:true});wi.DeclarationRequest=void 0;const t=Ne();var e;(function(n){n.method="textDocument/declaration";n.messageDirection=t.MessageDirection.clientToServer;n.type=new t.ProtocolRequestType(n.method)})(e||(wi.DeclarationRequest=e={}));return wi}var Ci={};var ty;function R_(){if(ty)return Ci;ty=1;Object.defineProperty(Ci,"__esModule",{value:true});Ci.SelectionRangeRequest=void 0;const t=Ne();var e;(function(n){n.method="textDocument/selectionRange";n.messageDirection=t.MessageDirection.clientToServer;n.type=new t.ProtocolRequestType(n.method)})(e||(Ci.SelectionRangeRequest=e={}));return Ci}var En={};var ny;function v_(){if(ny)return En;ny=1;Object.defineProperty(En,"__esModule",{value:true});En.WorkDoneProgressCancelNotification=En.WorkDoneProgressCreateRequest=En.WorkDoneProgress=void 0;const t=ai();const e=Ne();var n;(function(a){a.type=new t.ProgressType;function s(o){return o===a.type}a.is=s})(n||(En.WorkDoneProgress=n={}));var r;(function(a){a.method="window/workDoneProgress/create";a.messageDirection=e.MessageDirection.serverToClient;a.type=new e.ProtocolRequestType(a.method)})(r||(En.WorkDoneProgressCreateRequest=r={}));var i;(function(a){a.method="window/workDoneProgress/cancel";a.messageDirection=e.MessageDirection.clientToServer;a.type=new e.ProtocolNotificationType(a.method)})(i||(En.WorkDoneProgressCancelNotification=i={}));return En}var wn={};var ry;function $_(){if(ry)return wn;ry=1;Object.defineProperty(wn,"__esModule",{value:true});wn.CallHierarchyOutgoingCallsRequest=wn.CallHierarchyIncomingCallsRequest=wn.CallHierarchyPrepareRequest=void 0;const t=Ne();var e;(function(i){i.method="textDocument/prepareCallHierarchy";i.messageDirection=t.MessageDirection.clientToServer;i.type=new t.ProtocolRequestType(i.method)})(e||(wn.CallHierarchyPrepareRequest=e={}));var n;(function(i){i.method="callHierarchy/incomingCalls";i.messageDirection=t.MessageDirection.clientToServer;i.type=new t.ProtocolRequestType(i.method)})(n||(wn.CallHierarchyIncomingCallsRequest=n={}));var r;(function(i){i.method="callHierarchy/outgoingCalls";i.messageDirection=t.MessageDirection.clientToServer;i.type=new t.ProtocolRequestType(i.method)})(r||(wn.CallHierarchyOutgoingCallsRequest=r={}));return wn}var mt={};var iy;function T_(){if(iy)return mt;iy=1;Object.defineProperty(mt,"__esModule",{value:true});mt.SemanticTokensRefreshRequest=mt.SemanticTokensRangeRequest=mt.SemanticTokensDeltaRequest=mt.SemanticTokensRequest=mt.SemanticTokensRegistrationType=mt.TokenFormat=void 0;const t=Ne();var e;(function(o){o.Relative="relative"})(e||(mt.TokenFormat=e={}));var n;(function(o){o.method="textDocument/semanticTokens";o.type=new t.RegistrationType(o.method)})(n||(mt.SemanticTokensRegistrationType=n={}));var r;(function(o){o.method="textDocument/semanticTokens/full";o.messageDirection=t.MessageDirection.clientToServer;o.type=new t.ProtocolRequestType(o.method);o.registrationMethod=n.method})(r||(mt.SemanticTokensRequest=r={}));var i;(function(o){o.method="textDocument/semanticTokens/full/delta";o.messageDirection=t.MessageDirection.clientToServer;o.type=new t.ProtocolRequestType(o.method);o.registrationMethod=n.method})(i||(mt.SemanticTokensDeltaRequest=i={}));var a;(function(o){o.method="textDocument/semanticTokens/range";o.messageDirection=t.MessageDirection.clientToServer;o.type=new t.ProtocolRequestType(o.method);o.registrationMethod=n.method})(a||(mt.SemanticTokensRangeRequest=a={}));var s;(function(o){o.method=`workspace/semanticTokens/refresh`;o.messageDirection=t.MessageDirection.serverToClient;o.type=new t.ProtocolRequestType0(o.method)})(s||(mt.SemanticTokensRefreshRequest=s={}));return mt}var Ai={};var ay;function E_(){if(ay)return Ai;ay=1;Object.defineProperty(Ai,"__esModule",{value:true});Ai.ShowDocumentRequest=void 0;const t=Ne();var e;(function(n){n.method="window/showDocument";n.messageDirection=t.MessageDirection.serverToClient;n.type=new t.ProtocolRequestType(n.method)})(e||(Ai.ShowDocumentRequest=e={}));return Ai}var Si={};var sy;function w_(){if(sy)return Si;sy=1;Object.defineProperty(Si,"__esModule",{value:true});Si.LinkedEditingRangeRequest=void 0;const t=Ne();var e;(function(n){n.method="textDocument/linkedEditingRange";n.messageDirection=t.MessageDirection.clientToServer;n.type=new t.ProtocolRequestType(n.method)})(e||(Si.LinkedEditingRangeRequest=e={}));return Si}var Ze={};var oy;function C_(){if(oy)return Ze;oy=1;Object.defineProperty(Ze,"__esModule",{value:true});Ze.WillDeleteFilesRequest=Ze.DidDeleteFilesNotification=Ze.DidRenameFilesNotification=Ze.WillRenameFilesRequest=Ze.DidCreateFilesNotification=Ze.WillCreateFilesRequest=Ze.FileOperationPatternKind=void 0;const t=Ne();var e;(function(l){l.file="file";l.folder="folder"})(e||(Ze.FileOperationPatternKind=e={}));var n;(function(l){l.method="workspace/willCreateFiles";l.messageDirection=t.MessageDirection.clientToServer;l.type=new t.ProtocolRequestType(l.method)})(n||(Ze.WillCreateFilesRequest=n={}));var r;(function(l){l.method="workspace/didCreateFiles";l.messageDirection=t.MessageDirection.clientToServer;l.type=new t.ProtocolNotificationType(l.method)})(r||(Ze.DidCreateFilesNotification=r={}));var i;(function(l){l.method="workspace/willRenameFiles";l.messageDirection=t.MessageDirection.clientToServer;l.type=new t.ProtocolRequestType(l.method)})(i||(Ze.WillRenameFilesRequest=i={}));var a;(function(l){l.method="workspace/didRenameFiles";l.messageDirection=t.MessageDirection.clientToServer;l.type=new t.ProtocolNotificationType(l.method)})(a||(Ze.DidRenameFilesNotification=a={}));var s;(function(l){l.method="workspace/didDeleteFiles";l.messageDirection=t.MessageDirection.clientToServer;l.type=new t.ProtocolNotificationType(l.method)})(s||(Ze.DidDeleteFilesNotification=s={}));var o;(function(l){l.method="workspace/willDeleteFiles";l.messageDirection=t.MessageDirection.clientToServer;l.type=new t.ProtocolRequestType(l.method)})(o||(Ze.WillDeleteFilesRequest=o={}));return Ze}var Cn={};var ly;function A_(){if(ly)return Cn;ly=1;Object.defineProperty(Cn,"__esModule",{value:true});Cn.MonikerRequest=Cn.MonikerKind=Cn.UniquenessLevel=void 0;const t=Ne();var e;(function(i){i.document="document";i.project="project";i.group="group";i.scheme="scheme";i.global="global"})(e||(Cn.UniquenessLevel=e={}));var n;(function(i){i.$import="import";i.$export="export";i.local="local"})(n||(Cn.MonikerKind=n={}));var r;(function(i){i.method="textDocument/moniker";i.messageDirection=t.MessageDirection.clientToServer;i.type=new t.ProtocolRequestType(i.method)})(r||(Cn.MonikerRequest=r={}));return Cn}var An={};var uy;function S_(){if(uy)return An;uy=1;Object.defineProperty(An,"__esModule",{value:true});An.TypeHierarchySubtypesRequest=An.TypeHierarchySupertypesRequest=An.TypeHierarchyPrepareRequest=void 0;const t=Ne();var e;(function(i){i.method="textDocument/prepareTypeHierarchy";i.messageDirection=t.MessageDirection.clientToServer;i.type=new t.ProtocolRequestType(i.method)})(e||(An.TypeHierarchyPrepareRequest=e={}));var n;(function(i){i.method="typeHierarchy/supertypes";i.messageDirection=t.MessageDirection.clientToServer;i.type=new t.ProtocolRequestType(i.method)})(n||(An.TypeHierarchySupertypesRequest=n={}));var r;(function(i){i.method="typeHierarchy/subtypes";i.messageDirection=t.MessageDirection.clientToServer;i.type=new t.ProtocolRequestType(i.method)})(r||(An.TypeHierarchySubtypesRequest=r={}));return An}var yr={};var cy;function k_(){if(cy)return yr;cy=1;Object.defineProperty(yr,"__esModule",{value:true});yr.InlineValueRefreshRequest=yr.InlineValueRequest=void 0;const t=Ne();var e;(function(r){r.method="textDocument/inlineValue";r.messageDirection=t.MessageDirection.clientToServer;r.type=new t.ProtocolRequestType(r.method)})(e||(yr.InlineValueRequest=e={}));var n;(function(r){r.method=`workspace/inlineValue/refresh`;r.messageDirection=t.MessageDirection.serverToClient;r.type=new t.ProtocolRequestType0(r.method)})(n||(yr.InlineValueRefreshRequest=n={}));return yr}var Sn={};var dy;function b_(){if(dy)return Sn;dy=1;Object.defineProperty(Sn,"__esModule",{value:true});Sn.InlayHintRefreshRequest=Sn.InlayHintResolveRequest=Sn.InlayHintRequest=void 0;const t=Ne();var e;(function(i){i.method="textDocument/inlayHint";i.messageDirection=t.MessageDirection.clientToServer;i.type=new t.ProtocolRequestType(i.method)})(e||(Sn.InlayHintRequest=e={}));var n;(function(i){i.method="inlayHint/resolve";i.messageDirection=t.MessageDirection.clientToServer;i.type=new t.ProtocolRequestType(i.method)})(n||(Sn.InlayHintResolveRequest=n={}));var r;(function(i){i.method=`workspace/inlayHint/refresh`;i.messageDirection=t.MessageDirection.serverToClient;i.type=new t.ProtocolRequestType0(i.method)})(r||(Sn.InlayHintRefreshRequest=r={}));return Sn}var Pt={};var fy;function N_(){if(fy)return Pt;fy=1;Object.defineProperty(Pt,"__esModule",{value:true});Pt.DiagnosticRefreshRequest=Pt.WorkspaceDiagnosticRequest=Pt.DocumentDiagnosticRequest=Pt.DocumentDiagnosticReportKind=Pt.DiagnosticServerCancellationData=void 0;const t=ai();const e=Qp();const n=Ne();var r;(function(l){function u(c){const d=c;return d&&e.boolean(d.retriggerRequest)}l.is=u})(r||(Pt.DiagnosticServerCancellationData=r={}));var i;(function(l){l.Full="full";l.Unchanged="unchanged"})(i||(Pt.DocumentDiagnosticReportKind=i={}));var a;(function(l){l.method="textDocument/diagnostic";l.messageDirection=n.MessageDirection.clientToServer;l.type=new n.ProtocolRequestType(l.method);l.partialResult=new t.ProgressType})(a||(Pt.DocumentDiagnosticRequest=a={}));var s;(function(l){l.method="workspace/diagnostic";l.messageDirection=n.MessageDirection.clientToServer;l.type=new n.ProtocolRequestType(l.method);l.partialResult=new t.ProgressType})(s||(Pt.WorkspaceDiagnosticRequest=s={}));var o;(function(l){l.method=`workspace/diagnostic/refresh`;l.messageDirection=n.MessageDirection.serverToClient;l.type=new n.ProtocolRequestType0(l.method)})(o||(Pt.DiagnosticRefreshRequest=o={}));return Pt}var Se={};var py;function P_(){if(py)return Se;py=1;Object.defineProperty(Se,"__esModule",{value:true});Se.DidCloseNotebookDocumentNotification=Se.DidSaveNotebookDocumentNotification=Se.DidChangeNotebookDocumentNotification=Se.NotebookCellArrayChange=Se.DidOpenNotebookDocumentNotification=Se.NotebookDocumentSyncRegistrationType=Se.NotebookDocument=Se.NotebookCell=Se.ExecutionSummary=Se.NotebookCellKind=void 0;const t=Jp;const e=Qp();const n=Ne();var r;(function(p){p.Markup=1;p.Code=2;function y(v){return v===1||v===2}p.is=y})(r||(Se.NotebookCellKind=r={}));var i;(function(p){function y($,E){const C={executionOrder:$};if(E===true||E===false){C.success=E}return C}p.create=y;function v($){const E=$;return e.objectLiteral(E)&&t.uinteger.is(E.executionOrder)&&(E.success===void 0||e.boolean(E.success))}p.is=v;function k($,E){if($===E){return true}if($===null||$===void 0||E===null||E===void 0){return false}return $.executionOrder===E.executionOrder&&$.success===E.success}p.equals=k})(i||(Se.ExecutionSummary=i={}));var a;(function(p){function y(E,C){return{kind:E,document:C}}p.create=y;function v(E){const C=E;return e.objectLiteral(C)&&r.is(C.kind)&&t.DocumentUri.is(C.document)&&(C.metadata===void 0||e.objectLiteral(C.metadata))}p.is=v;function k(E,C){const I=new Set;if(E.document!==C.document){I.add("document")}if(E.kind!==C.kind){I.add("kind")}if(E.executionSummary!==C.executionSummary){I.add("executionSummary")}if((E.metadata!==void 0||C.metadata!==void 0)&&!$(E.metadata,C.metadata)){I.add("metadata")}if((E.executionSummary!==void 0||C.executionSummary!==void 0)&&!i.equals(E.executionSummary,C.executionSummary)){I.add("executionSummary")}return I}p.diff=k;function $(E,C){if(E===C){return true}if(E===null||E===void 0||C===null||C===void 0){return false}if(typeof E!==typeof C){return false}if(typeof E!=="object"){return false}const I=Array.isArray(E);const X=Array.isArray(C);if(I!==X){return false}if(I&&X){if(E.length!==C.length){return false}for(let q=0;q<E.length;q++){if(!$(E[q],C[q])){return false}}}if(e.objectLiteral(E)&&e.objectLiteral(C)){const q=Object.keys(E);const J=Object.keys(C);if(q.length!==J.length){return false}q.sort();J.sort();if(!$(q,J)){return false}for(let ne=0;ne<q.length;ne++){const ae=q[ne];if(!$(E[ae],C[ae])){return false}}}return true}})(a||(Se.NotebookCell=a={}));var s;(function(p){function y(k,$,E,C){return{uri:k,notebookType:$,version:E,cells:C}}p.create=y;function v(k){const $=k;return e.objectLiteral($)&&e.string($.uri)&&t.integer.is($.version)&&e.typedArray($.cells,a.is)}p.is=v})(s||(Se.NotebookDocument=s={}));var o;(function(p){p.method="notebookDocument/sync";p.messageDirection=n.MessageDirection.clientToServer;p.type=new n.RegistrationType(p.method)})(o||(Se.NotebookDocumentSyncRegistrationType=o={}));var l;(function(p){p.method="notebookDocument/didOpen";p.messageDirection=n.MessageDirection.clientToServer;p.type=new n.ProtocolNotificationType(p.method);p.registrationMethod=o.method})(l||(Se.DidOpenNotebookDocumentNotification=l={}));var u;(function(p){function y(k){const $=k;return e.objectLiteral($)&&t.uinteger.is($.start)&&t.uinteger.is($.deleteCount)&&($.cells===void 0||e.typedArray($.cells,a.is))}p.is=y;function v(k,$,E){const C={start:k,deleteCount:$};if(E!==void 0){C.cells=E}return C}p.create=v})(u||(Se.NotebookCellArrayChange=u={}));var c;(function(p){p.method="notebookDocument/didChange";p.messageDirection=n.MessageDirection.clientToServer;p.type=new n.ProtocolNotificationType(p.method);p.registrationMethod=o.method})(c||(Se.DidChangeNotebookDocumentNotification=c={}));var d;(function(p){p.method="notebookDocument/didSave";p.messageDirection=n.MessageDirection.clientToServer;p.type=new n.ProtocolNotificationType(p.method);p.registrationMethod=o.method})(d||(Se.DidSaveNotebookDocumentNotification=d={}));var f;(function(p){p.method="notebookDocument/didClose";p.messageDirection=n.MessageDirection.clientToServer;p.type=new n.ProtocolNotificationType(p.method);p.registrationMethod=o.method})(f||(Se.DidCloseNotebookDocumentNotification=f={}));return Se}var ki={};var my;function __(){if(my)return ki;my=1;Object.defineProperty(ki,"__esModule",{value:true});ki.InlineCompletionRequest=void 0;const t=Ne();var e;(function(n){n.method="textDocument/inlineCompletion";n.messageDirection=t.MessageDirection.clientToServer;n.type=new t.ProtocolRequestType(n.method)})(e||(ki.InlineCompletionRequest=e={}));return ki}var hy;function D_(){if(hy)return Lc;hy=1;(function(t){Object.defineProperty(t,"__esModule",{value:true});t.WorkspaceSymbolRequest=t.CodeActionResolveRequest=t.CodeActionRequest=t.DocumentSymbolRequest=t.DocumentHighlightRequest=t.ReferencesRequest=t.DefinitionRequest=t.SignatureHelpRequest=t.SignatureHelpTriggerKind=t.HoverRequest=t.CompletionResolveRequest=t.CompletionRequest=t.CompletionTriggerKind=t.PublishDiagnosticsNotification=t.WatchKind=t.RelativePattern=t.FileChangeType=t.DidChangeWatchedFilesNotification=t.WillSaveTextDocumentWaitUntilRequest=t.WillSaveTextDocumentNotification=t.TextDocumentSaveReason=t.DidSaveTextDocumentNotification=t.DidCloseTextDocumentNotification=t.DidChangeTextDocumentNotification=t.TextDocumentContentChangeEvent=t.DidOpenTextDocumentNotification=t.TextDocumentSyncKind=t.TelemetryEventNotification=t.LogMessageNotification=t.ShowMessageRequest=t.ShowMessageNotification=t.MessageType=t.DidChangeConfigurationNotification=t.ExitNotification=t.ShutdownRequest=t.InitializedNotification=t.InitializeErrorCodes=t.InitializeRequest=t.WorkDoneProgressOptions=t.TextDocumentRegistrationOptions=t.StaticRegistrationOptions=t.PositionEncodingKind=t.FailureHandlingKind=t.ResourceOperationKind=t.UnregistrationRequest=t.RegistrationRequest=t.DocumentSelector=t.NotebookCellTextDocumentFilter=t.NotebookDocumentFilter=t.TextDocumentFilter=void 0;t.MonikerRequest=t.MonikerKind=t.UniquenessLevel=t.WillDeleteFilesRequest=t.DidDeleteFilesNotification=t.WillRenameFilesRequest=t.DidRenameFilesNotification=t.WillCreateFilesRequest=t.DidCreateFilesNotification=t.FileOperationPatternKind=t.LinkedEditingRangeRequest=t.ShowDocumentRequest=t.SemanticTokensRegistrationType=t.SemanticTokensRefreshRequest=t.SemanticTokensRangeRequest=t.SemanticTokensDeltaRequest=t.SemanticTokensRequest=t.TokenFormat=t.CallHierarchyPrepareRequest=t.CallHierarchyOutgoingCallsRequest=t.CallHierarchyIncomingCallsRequest=t.WorkDoneProgressCancelNotification=t.WorkDoneProgressCreateRequest=t.WorkDoneProgress=t.SelectionRangeRequest=t.DeclarationRequest=t.FoldingRangeRefreshRequest=t.FoldingRangeRequest=t.ColorPresentationRequest=t.DocumentColorRequest=t.ConfigurationRequest=t.DidChangeWorkspaceFoldersNotification=t.WorkspaceFoldersRequest=t.TypeDefinitionRequest=t.ImplementationRequest=t.ApplyWorkspaceEditRequest=t.ExecuteCommandRequest=t.PrepareRenameRequest=t.RenameRequest=t.PrepareSupportDefaultBehavior=t.DocumentOnTypeFormattingRequest=t.DocumentRangesFormattingRequest=t.DocumentRangeFormattingRequest=t.DocumentFormattingRequest=t.DocumentLinkResolveRequest=t.DocumentLinkRequest=t.CodeLensRefreshRequest=t.CodeLensResolveRequest=t.CodeLensRequest=t.WorkspaceSymbolResolveRequest=void 0;t.InlineCompletionRequest=t.DidCloseNotebookDocumentNotification=t.DidSaveNotebookDocumentNotification=t.DidChangeNotebookDocumentNotification=t.NotebookCellArrayChange=t.DidOpenNotebookDocumentNotification=t.NotebookDocumentSyncRegistrationType=t.NotebookDocument=t.NotebookCell=t.ExecutionSummary=t.NotebookCellKind=t.DiagnosticRefreshRequest=t.WorkspaceDiagnosticRequest=t.DocumentDiagnosticRequest=t.DocumentDiagnosticReportKind=t.DiagnosticServerCancellationData=t.InlayHintRefreshRequest=t.InlayHintResolveRequest=t.InlayHintRequest=t.InlineValueRefreshRequest=t.InlineValueRequest=t.TypeHierarchySupertypesRequest=t.TypeHierarchySubtypesRequest=t.TypeHierarchyPrepareRequest=void 0;const e=Ne();const n=Jp;const r=Qp();const i=d_();Object.defineProperty(t,"ImplementationRequest",{enumerable:true,get:function(){return i.ImplementationRequest}});const a=f_();Object.defineProperty(t,"TypeDefinitionRequest",{enumerable:true,get:function(){return a.TypeDefinitionRequest}});const s=p_();Object.defineProperty(t,"WorkspaceFoldersRequest",{enumerable:true,get:function(){return s.WorkspaceFoldersRequest}});Object.defineProperty(t,"DidChangeWorkspaceFoldersNotification",{enumerable:true,get:function(){return s.DidChangeWorkspaceFoldersNotification}});const o=m_();Object.defineProperty(t,"ConfigurationRequest",{enumerable:true,get:function(){return o.ConfigurationRequest}});const l=h_();Object.defineProperty(t,"DocumentColorRequest",{enumerable:true,get:function(){return l.DocumentColorRequest}});Object.defineProperty(t,"ColorPresentationRequest",{enumerable:true,get:function(){return l.ColorPresentationRequest}});const u=y_();Object.defineProperty(t,"FoldingRangeRequest",{enumerable:true,get:function(){return u.FoldingRangeRequest}});Object.defineProperty(t,"FoldingRangeRefreshRequest",{enumerable:true,get:function(){return u.FoldingRangeRefreshRequest}});const c=g_();Object.defineProperty(t,"DeclarationRequest",{enumerable:true,get:function(){return c.DeclarationRequest}});const d=R_();Object.defineProperty(t,"SelectionRangeRequest",{enumerable:true,get:function(){return d.SelectionRangeRequest}});const f=v_();Object.defineProperty(t,"WorkDoneProgress",{enumerable:true,get:function(){return f.WorkDoneProgress}});Object.defineProperty(t,"WorkDoneProgressCreateRequest",{enumerable:true,get:function(){return f.WorkDoneProgressCreateRequest}});Object.defineProperty(t,"WorkDoneProgressCancelNotification",{enumerable:true,get:function(){return f.WorkDoneProgressCancelNotification}});const p=$_();Object.defineProperty(t,"CallHierarchyIncomingCallsRequest",{enumerable:true,get:function(){return p.CallHierarchyIncomingCallsRequest}});Object.defineProperty(t,"CallHierarchyOutgoingCallsRequest",{enumerable:true,get:function(){return p.CallHierarchyOutgoingCallsRequest}});Object.defineProperty(t,"CallHierarchyPrepareRequest",{enumerable:true,get:function(){return p.CallHierarchyPrepareRequest}});const y=T_();Object.defineProperty(t,"TokenFormat",{enumerable:true,get:function(){return y.TokenFormat}});Object.defineProperty(t,"SemanticTokensRequest",{enumerable:true,get:function(){return y.SemanticTokensRequest}});Object.defineProperty(t,"SemanticTokensDeltaRequest",{enumerable:true,get:function(){return y.SemanticTokensDeltaRequest}});Object.defineProperty(t,"SemanticTokensRangeRequest",{enumerable:true,get:function(){return y.SemanticTokensRangeRequest}});Object.defineProperty(t,"SemanticTokensRefreshRequest",{enumerable:true,get:function(){return y.SemanticTokensRefreshRequest}});Object.defineProperty(t,"SemanticTokensRegistrationType",{enumerable:true,get:function(){return y.SemanticTokensRegistrationType}});const v=E_();Object.defineProperty(t,"ShowDocumentRequest",{enumerable:true,get:function(){return v.ShowDocumentRequest}});const k=w_();Object.defineProperty(t,"LinkedEditingRangeRequest",{enumerable:true,get:function(){return k.LinkedEditingRangeRequest}});const $=C_();Object.defineProperty(t,"FileOperationPatternKind",{enumerable:true,get:function(){return $.FileOperationPatternKind}});Object.defineProperty(t,"DidCreateFilesNotification",{enumerable:true,get:function(){return $.DidCreateFilesNotification}});Object.defineProperty(t,"WillCreateFilesRequest",{enumerable:true,get:function(){return $.WillCreateFilesRequest}});Object.defineProperty(t,"DidRenameFilesNotification",{enumerable:true,get:function(){return $.DidRenameFilesNotification}});Object.defineProperty(t,"WillRenameFilesRequest",{enumerable:true,get:function(){return $.WillRenameFilesRequest}});Object.defineProperty(t,"DidDeleteFilesNotification",{enumerable:true,get:function(){return $.DidDeleteFilesNotification}});Object.defineProperty(t,"WillDeleteFilesRequest",{enumerable:true,get:function(){return $.WillDeleteFilesRequest}});const E=A_();Object.defineProperty(t,"UniquenessLevel",{enumerable:true,get:function(){return E.UniquenessLevel}});Object.defineProperty(t,"MonikerKind",{enumerable:true,get:function(){return E.MonikerKind}});Object.defineProperty(t,"MonikerRequest",{enumerable:true,get:function(){return E.MonikerRequest}});const C=S_();Object.defineProperty(t,"TypeHierarchyPrepareRequest",{enumerable:true,get:function(){return C.TypeHierarchyPrepareRequest}});Object.defineProperty(t,"TypeHierarchySubtypesRequest",{enumerable:true,get:function(){return C.TypeHierarchySubtypesRequest}});Object.defineProperty(t,"TypeHierarchySupertypesRequest",{enumerable:true,get:function(){return C.TypeHierarchySupertypesRequest}});const I=k_();Object.defineProperty(t,"InlineValueRequest",{enumerable:true,get:function(){return I.InlineValueRequest}});Object.defineProperty(t,"InlineValueRefreshRequest",{enumerable:true,get:function(){return I.InlineValueRefreshRequest}});const X=b_();Object.defineProperty(t,"InlayHintRequest",{enumerable:true,get:function(){return X.InlayHintRequest}});Object.defineProperty(t,"InlayHintResolveRequest",{enumerable:true,get:function(){return X.InlayHintResolveRequest}});Object.defineProperty(t,"InlayHintRefreshRequest",{enumerable:true,get:function(){return X.InlayHintRefreshRequest}});const q=N_();Object.defineProperty(t,"DiagnosticServerCancellationData",{enumerable:true,get:function(){return q.DiagnosticServerCancellationData}});Object.defineProperty(t,"DocumentDiagnosticReportKind",{enumerable:true,get:function(){return q.DocumentDiagnosticReportKind}});Object.defineProperty(t,"DocumentDiagnosticRequest",{enumerable:true,get:function(){return q.DocumentDiagnosticRequest}});Object.defineProperty(t,"WorkspaceDiagnosticRequest",{enumerable:true,get:function(){return q.WorkspaceDiagnosticRequest}});Object.defineProperty(t,"DiagnosticRefreshRequest",{enumerable:true,get:function(){return q.DiagnosticRefreshRequest}});const J=P_();Object.defineProperty(t,"NotebookCellKind",{enumerable:true,get:function(){return J.NotebookCellKind}});Object.defineProperty(t,"ExecutionSummary",{enumerable:true,get:function(){return J.ExecutionSummary}});Object.defineProperty(t,"NotebookCell",{enumerable:true,get:function(){return J.NotebookCell}});Object.defineProperty(t,"NotebookDocument",{enumerable:true,get:function(){return J.NotebookDocument}});Object.defineProperty(t,"NotebookDocumentSyncRegistrationType",{enumerable:true,get:function(){return J.NotebookDocumentSyncRegistrationType}});Object.defineProperty(t,"DidOpenNotebookDocumentNotification",{enumerable:true,get:function(){return J.DidOpenNotebookDocumentNotification}});Object.defineProperty(t,"NotebookCellArrayChange",{enumerable:true,get:function(){return J.NotebookCellArrayChange}});Object.defineProperty(t,"DidChangeNotebookDocumentNotification",{enumerable:true,get:function(){return J.DidChangeNotebookDocumentNotification}});Object.defineProperty(t,"DidSaveNotebookDocumentNotification",{enumerable:true,get:function(){return J.DidSaveNotebookDocumentNotification}});Object.defineProperty(t,"DidCloseNotebookDocumentNotification",{enumerable:true,get:function(){return J.DidCloseNotebookDocumentNotification}});const ne=__();Object.defineProperty(t,"InlineCompletionRequest",{enumerable:true,get:function(){return ne.InlineCompletionRequest}});var ae;(function(m){function xe(Me){const ee=Me;return r.string(ee)||(r.string(ee.language)||r.string(ee.scheme)||r.string(ee.pattern))}m.is=xe})(ae||(t.TextDocumentFilter=ae={}));var de;(function(m){function xe(Me){const ee=Me;return r.objectLiteral(ee)&&(r.string(ee.notebookType)||r.string(ee.scheme)||r.string(ee.pattern))}m.is=xe})(de||(t.NotebookDocumentFilter=de={}));var L;(function(m){function xe(Me){const ee=Me;return r.objectLiteral(ee)&&(r.string(ee.notebook)||de.is(ee.notebook))&&(ee.language===void 0||r.string(ee.language))}m.is=xe})(L||(t.NotebookCellTextDocumentFilter=L={}));var w;(function(m){function xe(Me){if(!Array.isArray(Me)){return false}for(let ee of Me){if(!r.string(ee)&&!ae.is(ee)&&!L.is(ee)){return false}}return true}m.is=xe})(w||(t.DocumentSelector=w={}));var g;(function(m){m.method="client/registerCapability";m.messageDirection=e.MessageDirection.serverToClient;m.type=new e.ProtocolRequestType(m.method)})(g||(t.RegistrationRequest=g={}));var b;(function(m){m.method="client/unregisterCapability";m.messageDirection=e.MessageDirection.serverToClient;m.type=new e.ProtocolRequestType(m.method)})(b||(t.UnregistrationRequest=b={}));var M;(function(m){m.Create="create";m.Rename="rename";m.Delete="delete"})(M||(t.ResourceOperationKind=M={}));var O;(function(m){m.Abort="abort";m.Transactional="transactional";m.TextOnlyTransactional="textOnlyTransactional";m.Undo="undo"})(O||(t.FailureHandlingKind=O={}));var x;(function(m){m.UTF8="utf-8";m.UTF16="utf-16";m.UTF32="utf-32"})(x||(t.PositionEncodingKind=x={}));var we;(function(m){function xe(Me){const ee=Me;return ee&&r.string(ee.id)&&ee.id.length>0}m.hasId=xe})(we||(t.StaticRegistrationOptions=we={}));var F;(function(m){function xe(Me){const ee=Me;return ee&&(ee.documentSelector===null||w.is(ee.documentSelector))}m.is=xe})(F||(t.TextDocumentRegistrationOptions=F={}));var N;(function(m){function xe(ee){const h=ee;return r.objectLiteral(h)&&(h.workDoneProgress===void 0||r.boolean(h.workDoneProgress))}m.is=xe;function Me(ee){const h=ee;return h&&r.boolean(h.workDoneProgress)}m.hasWorkDoneProgress=Me})(N||(t.WorkDoneProgressOptions=N={}));var re;(function(m){m.method="initialize";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(re||(t.InitializeRequest=re={}));var kt;(function(m){m.unknownProtocolVersion=1})(kt||(t.InitializeErrorCodes=kt={}));var bt;(function(m){m.method="initialized";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolNotificationType(m.method)})(bt||(t.InitializedNotification=bt={}));var Ce;(function(m){m.method="shutdown";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType0(m.method)})(Ce||(t.ShutdownRequest=Ce={}));var Nt;(function(m){m.method="exit";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolNotificationType0(m.method)})(Nt||(t.ExitNotification=Nt={}));var me;(function(m){m.method="workspace/didChangeConfiguration";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolNotificationType(m.method)})(me||(t.DidChangeConfigurationNotification=me={}));var Pe;(function(m){m.Error=1;m.Warning=2;m.Info=3;m.Log=4;m.Debug=5})(Pe||(t.MessageType=Pe={}));var Be;(function(m){m.method="window/showMessage";m.messageDirection=e.MessageDirection.serverToClient;m.type=new e.ProtocolNotificationType(m.method)})(Be||(t.ShowMessageNotification=Be={}));var Re;(function(m){m.method="window/showMessageRequest";m.messageDirection=e.MessageDirection.serverToClient;m.type=new e.ProtocolRequestType(m.method)})(Re||(t.ShowMessageRequest=Re={}));var j;(function(m){m.method="window/logMessage";m.messageDirection=e.MessageDirection.serverToClient;m.type=new e.ProtocolNotificationType(m.method)})(j||(t.LogMessageNotification=j={}));var R;(function(m){m.method="telemetry/event";m.messageDirection=e.MessageDirection.serverToClient;m.type=new e.ProtocolNotificationType(m.method)})(R||(t.TelemetryEventNotification=R={}));var S;(function(m){m.None=0;m.Full=1;m.Incremental=2})(S||(t.TextDocumentSyncKind=S={}));var B;(function(m){m.method="textDocument/didOpen";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolNotificationType(m.method)})(B||(t.DidOpenTextDocumentNotification=B={}));var A;(function(m){function xe(ee){let h=ee;return h!==void 0&&h!==null&&typeof h.text==="string"&&h.range!==void 0&&(h.rangeLength===void 0||typeof h.rangeLength==="number")}m.isIncremental=xe;function Me(ee){let h=ee;return h!==void 0&&h!==null&&typeof h.text==="string"&&h.range===void 0&&h.rangeLength===void 0}m.isFull=Me})(A||(t.TextDocumentContentChangeEvent=A={}));var fe;(function(m){m.method="textDocument/didChange";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolNotificationType(m.method)})(fe||(t.DidChangeTextDocumentNotification=fe={}));var st;(function(m){m.method="textDocument/didClose";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolNotificationType(m.method)})(st||(t.DidCloseTextDocumentNotification=st={}));var zt;(function(m){m.method="textDocument/didSave";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolNotificationType(m.method)})(zt||(t.DidSaveTextDocumentNotification=zt={}));var Bn;(function(m){m.Manual=1;m.AfterDelay=2;m.FocusOut=3})(Bn||(t.TextDocumentSaveReason=Bn={}));var Wn;(function(m){m.method="textDocument/willSave";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolNotificationType(m.method)})(Wn||(t.WillSaveTextDocumentNotification=Wn={}));var Vn;(function(m){m.method="textDocument/willSaveWaitUntil";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(Vn||(t.WillSaveTextDocumentWaitUntilRequest=Vn={}));var Tt;(function(m){m.method="workspace/didChangeWatchedFiles";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolNotificationType(m.method)})(Tt||(t.DidChangeWatchedFilesNotification=Tt={}));var nn;(function(m){m.Created=1;m.Changed=2;m.Deleted=3})(nn||(t.FileChangeType=nn={}));var Lr;(function(m){function xe(Me){const ee=Me;return r.objectLiteral(ee)&&(n.URI.is(ee.baseUri)||n.WorkspaceFolder.is(ee.baseUri))&&r.string(ee.pattern)}m.is=xe})(Lr||(t.RelativePattern=Lr={}));var hn;(function(m){m.Create=1;m.Change=2;m.Delete=4})(hn||(t.WatchKind=hn={}));var yn;(function(m){m.method="textDocument/publishDiagnostics";m.messageDirection=e.MessageDirection.serverToClient;m.type=new e.ProtocolNotificationType(m.method)})(yn||(t.PublishDiagnosticsNotification=yn={}));var rn;(function(m){m.Invoked=1;m.TriggerCharacter=2;m.TriggerForIncompleteCompletions=3})(rn||(t.CompletionTriggerKind=rn={}));var Gt;(function(m){m.method="textDocument/completion";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(Gt||(t.CompletionRequest=Gt={}));var P;(function(m){m.method="completionItem/resolve";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(P||(t.CompletionResolveRequest=P={}));var _;(function(m){m.method="textDocument/hover";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(_||(t.HoverRequest=_={}));var G;(function(m){m.Invoked=1;m.TriggerCharacter=2;m.ContentChange=3})(G||(t.SignatureHelpTriggerKind=G={}));var Et;(function(m){m.method="textDocument/signatureHelp";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(Et||(t.SignatureHelpRequest=Et={}));var dt;(function(m){m.method="textDocument/definition";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(dt||(t.DefinitionRequest=dt={}));var sr;(function(m){m.method="textDocument/references";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(sr||(t.ReferencesRequest=sr={}));var si;(function(m){m.method="textDocument/documentHighlight";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(si||(t.DocumentHighlightRequest=si={}));var hs;(function(m){m.method="textDocument/documentSymbol";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(hs||(t.DocumentSymbolRequest=hs={}));var ys;(function(m){m.method="textDocument/codeAction";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(ys||(t.CodeActionRequest=ys={}));var gs;(function(m){m.method="codeAction/resolve";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(gs||(t.CodeActionResolveRequest=gs={}));var Rs;(function(m){m.method="workspace/symbol";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(Rs||(t.WorkspaceSymbolRequest=Rs={}));var vs;(function(m){m.method="workspaceSymbol/resolve";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(vs||(t.WorkspaceSymbolResolveRequest=vs={}));var $s;(function(m){m.method="textDocument/codeLens";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})($s||(t.CodeLensRequest=$s={}));var Yt;(function(m){m.method="codeLens/resolve";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(Yt||(t.CodeLensResolveRequest=Yt={}));var Ts;(function(m){m.method=`workspace/codeLens/refresh`;m.messageDirection=e.MessageDirection.serverToClient;m.type=new e.ProtocolRequestType0(m.method)})(Ts||(t.CodeLensRefreshRequest=Ts={}));var Es;(function(m){m.method="textDocument/documentLink";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(Es||(t.DocumentLinkRequest=Es={}));var or;(function(m){m.method="documentLink/resolve";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(or||(t.DocumentLinkResolveRequest=or={}));var ws;(function(m){m.method="textDocument/formatting";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(ws||(t.DocumentFormattingRequest=ws={}));var xr;(function(m){m.method="textDocument/rangeFormatting";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(xr||(t.DocumentRangeFormattingRequest=xr={}));var Cs;(function(m){m.method="textDocument/rangesFormatting";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(Cs||(t.DocumentRangesFormattingRequest=Cs={}));var gn;(function(m){m.method="textDocument/onTypeFormatting";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(gn||(t.DocumentOnTypeFormattingRequest=gn={}));var zn;(function(m){m.Identifier=1})(zn||(t.PrepareSupportDefaultBehavior=zn={}));var As;(function(m){m.method="textDocument/rename";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(As||(t.RenameRequest=As={}));var Ss;(function(m){m.method="textDocument/prepareRename";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(Ss||(t.PrepareRenameRequest=Ss={}));var Yn;(function(m){m.method="workspace/executeCommand";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(Yn||(t.ExecuteCommandRequest=Yn={}));var oi;(function(m){m.method="workspace/applyEdit";m.messageDirection=e.MessageDirection.serverToClient;m.type=new e.ProtocolRequestType("workspace/applyEdit")})(oi||(t.ApplyWorkspaceEditRequest=oi={}))})(Lc);return Lc}var bi={};var yy;function O_(){if(yy)return bi;yy=1;Object.defineProperty(bi,"__esModule",{value:true});bi.createProtocolConnection=void 0;const t=ai();function e(n,r,i,a){if(t.ConnectionStrategy.is(a)){a={connectionStrategy:a}}return(0,t.createMessageConnection)(n,r,i,a)}bi.createProtocolConnection=e;return bi}var gy;function I_(){if(gy)return vi;gy=1;(function(t){var e=vi.__createBinding||(Object.create?function(a,s,o,l){if(l===void 0)l=o;var u=Object.getOwnPropertyDescriptor(s,o);if(!u||("get"in u?!s.__esModule:u.writable||u.configurable)){u={enumerable:true,get:function(){return s[o]}}}Object.defineProperty(a,l,u)}:function(a,s,o,l){if(l===void 0)l=o;a[l]=s[o]});var n=vi.__exportStar||function(a,s){for(var o in a)if(o!=="default"&&!Object.prototype.hasOwnProperty.call(s,o))e(s,a,o)};Object.defineProperty(t,"__esModule",{value:true});t.LSPErrorCodes=t.createProtocolConnection=void 0;n(ai(),t);n(Jp,t);n(Ne(),t);n(D_(),t);var r=O_();Object.defineProperty(t,"createProtocolConnection",{enumerable:true,get:function(){return r.createProtocolConnection}});var i;(function(a){a.lspReservedErrorRangeStart=-32899;a.RequestFailed=-32803;a.ServerCancelled=-32802;a.ContentModified=-32801;a.RequestCancelled=-32800;a.lspReservedErrorRangeEnd=-32800})(i||(t.LSPErrorCodes=i={}))})(vi);return vi}var Ry;function qe(){if(Ry)return mi;Ry=1;(function(t){var e=mi.__createBinding||(Object.create?function(a,s,o,l){if(l===void 0)l=o;var u=Object.getOwnPropertyDescriptor(s,o);if(!u||("get"in u?!s.__esModule:u.writable||u.configurable)){u={enumerable:true,get:function(){return s[o]}}}Object.defineProperty(a,l,u)}:function(a,s,o,l){if(l===void 0)l=o;a[l]=s[o]});var n=mi.__exportStar||function(a,s){for(var o in a)if(o!=="default"&&!Object.prototype.hasOwnProperty.call(s,o))e(s,a,o)};Object.defineProperty(t,"__esModule",{value:true});t.createProtocolConnection=void 0;const r=Bh();n(Bh(),t);n(I_(),t);function i(a,s,o,l){return(0,r.createMessageConnection)(a,s,o,l)}t.createProtocolConnection=i})(mi);return mi}var vy;function n$(){if(vy)return Rn;vy=1;Object.defineProperty(Rn,"__esModule",{value:true});Rn.SemanticTokensBuilder=Rn.SemanticTokensDiff=Rn.SemanticTokensFeature=void 0;const t=qe();const e=i=>{return class extends i{get semanticTokens(){return{refresh:()=>{return this.connection.sendRequest(t.SemanticTokensRefreshRequest.type)},on:a=>{const s=t.SemanticTokensRequest.type;return this.connection.onRequest(s,(o,l)=>{return a(o,l,this.attachWorkDoneProgress(o),this.attachPartialResultProgress(s,o))})},onDelta:a=>{const s=t.SemanticTokensDeltaRequest.type;return this.connection.onRequest(s,(o,l)=>{return a(o,l,this.attachWorkDoneProgress(o),this.attachPartialResultProgress(s,o))})},onRange:a=>{const s=t.SemanticTokensRangeRequest.type;return this.connection.onRequest(s,(o,l)=>{return a(o,l,this.attachWorkDoneProgress(o),this.attachPartialResultProgress(s,o))})}}}}};Rn.SemanticTokensFeature=e;class n{constructor(a,s){this.originalSequence=a;this.modifiedSequence=s}computeDiff(){const a=this.originalSequence.length;const s=this.modifiedSequence.length;let o=0;while(o<s&&o<a&&this.originalSequence[o]===this.modifiedSequence[o]){o++}if(o<s&&o<a){let l=a-1;let u=s-1;while(l>=o&&u>=o&&this.originalSequence[l]===this.modifiedSequence[u]){l--;u--}if(l<o||u<o){l++;u++}const c=l-o+1;const d=this.modifiedSequence.slice(o,u+1);if(d.length===1&&d[0]===this.originalSequence[l]){return[{start:o,deleteCount:c-1}]}else{return[{start:o,deleteCount:c,data:d}]}}else if(o<s){return[{start:o,deleteCount:0,data:this.modifiedSequence.slice(o)}]}else if(o<a){return[{start:o,deleteCount:a-o}]}else{return[]}}}Rn.SemanticTokensDiff=n;class r{constructor(){this._prevData=void 0;this.initialize()}initialize(){this._id=Date.now();this._prevLine=0;this._prevChar=0;this._data=[];this._dataLen=0}push(a,s,o,l,u){let c=a;let d=s;if(this._dataLen>0){c-=this._prevLine;if(c===0){d-=this._prevChar}}this._data[this._dataLen++]=c;this._data[this._dataLen++]=d;this._data[this._dataLen++]=o;this._data[this._dataLen++]=l;this._data[this._dataLen++]=u;this._prevLine=a;this._prevChar=s}get id(){return this._id.toString()}previousResult(a){if(this.id===a){this._prevData=this._data}this.initialize()}build(){this._prevData=void 0;return{resultId:this.id,data:this._data}}canBuildEdits(){return this._prevData!==void 0}buildEdits(){if(this._prevData!==void 0){return{resultId:this.id,edits:new n(this._prevData,this._data).computeDiff()}}else{return this.build()}}}Rn.SemanticTokensBuilder=r;return Rn}var Ni={};var $y;function L_(){if($y)return Ni;$y=1;Object.defineProperty(Ni,"__esModule",{value:true});Ni.InlineCompletionFeature=void 0;const t=qe();const e=n=>{return class extends n{get inlineCompletion(){return{on:r=>{return this.connection.onRequest(t.InlineCompletionRequest.type,(i,a)=>{return r(i,a,this.attachWorkDoneProgress(i))})}}}}};Ni.InlineCompletionFeature=e;return Ni}var Pi={};var Ty;function r$(){if(Ty)return Pi;Ty=1;Object.defineProperty(Pi,"__esModule",{value:true});Pi.TextDocuments=void 0;const t=qe();class e{constructor(r){this._configuration=r;this._syncedDocuments=new Map;this._onDidChangeContent=new t.Emitter;this._onDidOpen=new t.Emitter;this._onDidClose=new t.Emitter;this._onDidSave=new t.Emitter;this._onWillSave=new t.Emitter}get onDidOpen(){return this._onDidOpen.event}get onDidChangeContent(){return this._onDidChangeContent.event}get onWillSave(){return this._onWillSave.event}onWillSaveWaitUntil(r){this._willSaveWaitUntil=r}get onDidSave(){return this._onDidSave.event}get onDidClose(){return this._onDidClose.event}get(r){return this._syncedDocuments.get(r)}all(){return Array.from(this._syncedDocuments.values())}keys(){return Array.from(this._syncedDocuments.keys())}listen(r){r.__textDocumentSync=t.TextDocumentSyncKind.Incremental;const i=[];i.push(r.onDidOpenTextDocument(a=>{const s=a.textDocument;const o=this._configuration.create(s.uri,s.languageId,s.version,s.text);this._syncedDocuments.set(s.uri,o);const l=Object.freeze({document:o});this._onDidOpen.fire(l);this._onDidChangeContent.fire(l)}));i.push(r.onDidChangeTextDocument(a=>{const s=a.textDocument;const o=a.contentChanges;if(o.length===0){return}const{version:l}=s;if(l===null||l===void 0){throw new Error(`Received document change event for ${s.uri} without valid version identifier`)}let u=this._syncedDocuments.get(s.uri);if(u!==void 0){u=this._configuration.update(u,o,l);this._syncedDocuments.set(s.uri,u);this._onDidChangeContent.fire(Object.freeze({document:u}))}}));i.push(r.onDidCloseTextDocument(a=>{let s=this._syncedDocuments.get(a.textDocument.uri);if(s!==void 0){this._syncedDocuments.delete(a.textDocument.uri);this._onDidClose.fire(Object.freeze({document:s}))}}));i.push(r.onWillSaveTextDocument(a=>{let s=this._syncedDocuments.get(a.textDocument.uri);if(s!==void 0){this._onWillSave.fire(Object.freeze({document:s,reason:a.reason}))}}));i.push(r.onWillSaveTextDocumentWaitUntil((a,s)=>{let o=this._syncedDocuments.get(a.textDocument.uri);if(o!==void 0&&this._willSaveWaitUntil){return this._willSaveWaitUntil(Object.freeze({document:o,reason:a.reason}),s)}else{return[]}}));i.push(r.onDidSaveTextDocument(a=>{let s=this._syncedDocuments.get(a.textDocument.uri);if(s!==void 0){this._onDidSave.fire(Object.freeze({document:s}))}}));return t.Disposable.create(()=>{i.forEach(a=>a.dispose())})}}Pi.TextDocuments=e;return Pi}var gr={};var Ey;function i$(){if(Ey)return gr;Ey=1;Object.defineProperty(gr,"__esModule",{value:true});gr.NotebookDocuments=gr.NotebookSyncFeature=void 0;const t=qe();const e=r$();const n=a=>{return class extends a{get synchronization(){return{onDidOpenNotebookDocument:s=>{return this.connection.onNotification(t.DidOpenNotebookDocumentNotification.type,o=>{s(o)})},onDidChangeNotebookDocument:s=>{return this.connection.onNotification(t.DidChangeNotebookDocumentNotification.type,o=>{s(o)})},onDidSaveNotebookDocument:s=>{return this.connection.onNotification(t.DidSaveNotebookDocumentNotification.type,o=>{s(o)})},onDidCloseNotebookDocument:s=>{return this.connection.onNotification(t.DidCloseNotebookDocumentNotification.type,o=>{s(o)})}}}}};gr.NotebookSyncFeature=n;class r{onDidOpenTextDocument(s){this.openHandler=s;return t.Disposable.create(()=>{this.openHandler=void 0})}openTextDocument(s){this.openHandler&&this.openHandler(s)}onDidChangeTextDocument(s){this.changeHandler=s;return t.Disposable.create(()=>{this.changeHandler=s})}changeTextDocument(s){this.changeHandler&&this.changeHandler(s)}onDidCloseTextDocument(s){this.closeHandler=s;return t.Disposable.create(()=>{this.closeHandler=void 0})}closeTextDocument(s){this.closeHandler&&this.closeHandler(s)}onWillSaveTextDocument(){return r.NULL_DISPOSE}onWillSaveTextDocumentWaitUntil(){return r.NULL_DISPOSE}onDidSaveTextDocument(){return r.NULL_DISPOSE}}r.NULL_DISPOSE=Object.freeze({dispose:()=>{}});class i{constructor(s){if(s instanceof e.TextDocuments){this._cellTextDocuments=s}else{this._cellTextDocuments=new e.TextDocuments(s)}this.notebookDocuments=new Map;this.notebookCellMap=new Map;this._onDidOpen=new t.Emitter;this._onDidChange=new t.Emitter;this._onDidSave=new t.Emitter;this._onDidClose=new t.Emitter}get cellTextDocuments(){return this._cellTextDocuments}getCellTextDocument(s){return this._cellTextDocuments.get(s.document)}getNotebookDocument(s){return this.notebookDocuments.get(s)}getNotebookCell(s){const o=this.notebookCellMap.get(s);return o&&o[0]}findNotebookDocumentForCell(s){const o=typeof s==="string"?s:s.document;const l=this.notebookCellMap.get(o);return l&&l[1]}get onDidOpen(){return this._onDidOpen.event}get onDidSave(){return this._onDidSave.event}get onDidChange(){return this._onDidChange.event}get onDidClose(){return this._onDidClose.event}listen(s){const o=new r;const l=[];l.push(this.cellTextDocuments.listen(o));l.push(s.notebooks.synchronization.onDidOpenNotebookDocument(u=>{this.notebookDocuments.set(u.notebookDocument.uri,u.notebookDocument);for(const c of u.cellTextDocuments){o.openTextDocument({textDocument:c})}this.updateCellMap(u.notebookDocument);this._onDidOpen.fire(u.notebookDocument)}));l.push(s.notebooks.synchronization.onDidChangeNotebookDocument(u=>{const c=this.notebookDocuments.get(u.notebookDocument.uri);if(c===void 0){return}c.version=u.notebookDocument.version;const d=c.metadata;let f=false;const p=u.change;if(p.metadata!==void 0){f=true;c.metadata=p.metadata}const y=[];const v=[];const k=[];const $=[];if(p.cells!==void 0){const q=p.cells;if(q.structure!==void 0){const J=q.structure.array;c.cells.splice(J.start,J.deleteCount,...J.cells!==void 0?J.cells:[]);if(q.structure.didOpen!==void 0){for(const ne of q.structure.didOpen){o.openTextDocument({textDocument:ne});y.push(ne.uri)}}if(q.structure.didClose){for(const ne of q.structure.didClose){o.closeTextDocument({textDocument:ne});v.push(ne.uri)}}}if(q.data!==void 0){const J=new Map(q.data.map(ne=>[ne.document,ne]));for(let ne=0;ne<=c.cells.length;ne++){const ae=J.get(c.cells[ne].document);if(ae!==void 0){const de=c.cells.splice(ne,1,ae);k.push({old:de[0],new:ae});J.delete(ae.document);if(J.size===0){break}}}}if(q.textContent!==void 0){for(const J of q.textContent){o.changeTextDocument({textDocument:J.document,contentChanges:J.changes});$.push(J.document.uri)}}}this.updateCellMap(c);const E={notebookDocument:c};if(f){E.metadata={old:d,new:c.metadata}}const C=[];for(const q of y){C.push(this.getNotebookCell(q))}const I=[];for(const q of v){I.push(this.getNotebookCell(q))}const X=[];for(const q of $){X.push(this.getNotebookCell(q))}if(C.length>0||I.length>0||k.length>0||X.length>0){E.cells={added:C,removed:I,changed:{data:k,textContent:X}}}if(E.metadata!==void 0||E.cells!==void 0){this._onDidChange.fire(E)}}));l.push(s.notebooks.synchronization.onDidSaveNotebookDocument(u=>{const c=this.notebookDocuments.get(u.notebookDocument.uri);if(c===void 0){return}this._onDidSave.fire(c)}));l.push(s.notebooks.synchronization.onDidCloseNotebookDocument(u=>{const c=this.notebookDocuments.get(u.notebookDocument.uri);if(c===void 0){return}this._onDidClose.fire(c);for(const d of u.cellTextDocuments){o.closeTextDocument({textDocument:d})}this.notebookDocuments.delete(u.notebookDocument.uri);for(const d of c.cells){this.notebookCellMap.delete(d.document)}}));return t.Disposable.create(()=>{l.forEach(u=>u.dispose())})}updateCellMap(s){for(const o of s.cells){this.notebookCellMap.set(o.document,[o,s])}}}gr.NotebookDocuments=i;return gr}var oe={};var Ue={};var wy;function a$(){if(wy)return Ue;wy=1;Object.defineProperty(Ue,"__esModule",{value:true});Ue.thenable=Ue.typedArray=Ue.stringArray=Ue.array=Ue.func=Ue.error=Ue.number=Ue.string=Ue.boolean=void 0;function t(u){return u===true||u===false}Ue.boolean=t;function e(u){return typeof u==="string"||u instanceof String}Ue.string=e;function n(u){return typeof u==="number"||u instanceof Number}Ue.number=n;function r(u){return u instanceof Error}Ue.error=r;function i(u){return typeof u==="function"}Ue.func=i;function a(u){return Array.isArray(u)}Ue.array=a;function s(u){return a(u)&&u.every(c=>e(c))}Ue.stringArray=s;function o(u,c){return Array.isArray(u)&&u.every(c)}Ue.typedArray=o;function l(u){return u&&i(u.then)}Ue.thenable=l;return Ue}var _t={};var Cy;function s$(){if(Cy)return _t;Cy=1;Object.defineProperty(_t,"__esModule",{value:true});_t.generateUuid=_t.parse=_t.isUUID=_t.v4=_t.empty=void 0;class t{constructor(l){this._value=l}asHex(){return this._value}equals(l){return this.asHex()===l.asHex()}}class e extends t{static _oneOf(l){return l[Math.floor(l.length*Math.random())]}static _randomHex(){return e._oneOf(e._chars)}constructor(){super([e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),"-",e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),"-","4",e._randomHex(),e._randomHex(),e._randomHex(),"-",e._oneOf(e._timeHighBits),e._randomHex(),e._randomHex(),e._randomHex(),"-",e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex()].join(""))}}e._chars=["0","1","2","3","4","5","6","6","7","8","9","a","b","c","d","e","f"];e._timeHighBits=["8","9","a","b"];_t.empty=new t("00000000-0000-0000-0000-000000000000");function n(){return new e}_t.v4=n;const r=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;function i(o){return r.test(o)}_t.isUUID=i;function a(o){if(!i(o)){throw new Error("invalid uuid")}return new t(o)}_t.parse=a;function s(){return n().asHex()}_t.generateUuid=s;return _t}var kn={};var Ay;function x_(){if(Ay)return kn;Ay=1;Object.defineProperty(kn,"__esModule",{value:true});kn.attachPartialResult=kn.ProgressFeature=kn.attachWorkDone=void 0;const t=qe();const e=s$();class n{constructor(f,p){this._connection=f;this._token=p;n.Instances.set(this._token,this)}begin(f,p,y,v){let k={kind:"begin",title:f,percentage:p,message:y,cancellable:v};this._connection.sendProgress(t.WorkDoneProgress.type,this._token,k)}report(f,p){let y={kind:"report"};if(typeof f==="number"){y.percentage=f;if(p!==void 0){y.message=p}}else{y.message=f}this._connection.sendProgress(t.WorkDoneProgress.type,this._token,y)}done(){n.Instances.delete(this._token);this._connection.sendProgress(t.WorkDoneProgress.type,this._token,{kind:"end"})}}n.Instances=new Map;class r extends n{constructor(f,p){super(f,p);this._source=new t.CancellationTokenSource}get token(){return this._source.token}done(){this._source.dispose();super.done()}cancel(){this._source.cancel()}}class i{constructor(){}begin(){}report(){}done(){}}class a extends i{constructor(){super();this._source=new t.CancellationTokenSource}get token(){return this._source.token}done(){this._source.dispose()}cancel(){this._source.cancel()}}function s(d,f){if(f===void 0||f.workDoneToken===void 0){return new i}const p=f.workDoneToken;delete f.workDoneToken;return new n(d,p)}kn.attachWorkDone=s;const o=d=>{return class extends d{constructor(){super();this._progressSupported=false}initialize(f){super.initialize(f);if(f?.window?.workDoneProgress===true){this._progressSupported=true;this.connection.onNotification(t.WorkDoneProgressCancelNotification.type,p=>{let y=n.Instances.get(p.token);if(y instanceof r||y instanceof a){y.cancel()}})}}attachWorkDoneProgress(f){if(f===void 0){return new i}else{return new n(this.connection,f)}}createWorkDoneProgress(){if(this._progressSupported){const f=(0,e.generateUuid)();return this.connection.sendRequest(t.WorkDoneProgressCreateRequest.type,{token:f}).then(()=>{const p=new r(this.connection,f);return p})}else{return Promise.resolve(new a)}}}};kn.ProgressFeature=o;var l;(function(d){d.type=new t.ProgressType})(l||(l={}));class u{constructor(f,p){this._connection=f;this._token=p}report(f){this._connection.sendProgress(l.type,this._token,f)}}function c(d,f){if(f===void 0||f.partialResultToken===void 0){return void 0}const p=f.partialResultToken;delete f.partialResultToken;return new u(d,p)}kn.attachPartialResult=c;return kn}var _i={};var Sy;function M_(){if(Sy)return _i;Sy=1;Object.defineProperty(_i,"__esModule",{value:true});_i.ConfigurationFeature=void 0;const t=qe();const e=a$();const n=r=>{return class extends r{getConfiguration(i){if(!i){return this._getConfiguration({})}else if(e.string(i)){return this._getConfiguration({section:i})}else{return this._getConfiguration(i)}}_getConfiguration(i){let a={items:Array.isArray(i)?i:[i]};return this.connection.sendRequest(t.ConfigurationRequest.type,a).then(s=>{if(Array.isArray(s)){return Array.isArray(i)?s:s[0]}else{return Array.isArray(i)?[]:null}})}}};_i.ConfigurationFeature=n;return _i}var Di={};var ky;function K_(){if(ky)return Di;ky=1;Object.defineProperty(Di,"__esModule",{value:true});Di.WorkspaceFoldersFeature=void 0;const t=qe();const e=n=>{return class extends n{constructor(){super();this._notificationIsAutoRegistered=false}initialize(r){super.initialize(r);let i=r.workspace;if(i&&i.workspaceFolders){this._onDidChangeWorkspaceFolders=new t.Emitter;this.connection.onNotification(t.DidChangeWorkspaceFoldersNotification.type,a=>{this._onDidChangeWorkspaceFolders.fire(a.event)})}}fillServerCapabilities(r){super.fillServerCapabilities(r);const i=r.workspace?.workspaceFolders?.changeNotifications;this._notificationIsAutoRegistered=i===true||typeof i==="string"}getWorkspaceFolders(){return this.connection.sendRequest(t.WorkspaceFoldersRequest.type)}get onDidChangeWorkspaceFolders(){if(!this._onDidChangeWorkspaceFolders){throw new Error("Client doesn't support sending workspace folder change events.")}if(!this._notificationIsAutoRegistered&&!this._unregistration){this._unregistration=this.connection.client.register(t.DidChangeWorkspaceFoldersNotification.type)}return this._onDidChangeWorkspaceFolders.event}}};Di.WorkspaceFoldersFeature=e;return Di}var Oi={};var by;function F_(){if(by)return Oi;by=1;Object.defineProperty(Oi,"__esModule",{value:true});Oi.CallHierarchyFeature=void 0;const t=qe();const e=n=>{return class extends n{get callHierarchy(){return{onPrepare:r=>{return this.connection.onRequest(t.CallHierarchyPrepareRequest.type,(i,a)=>{return r(i,a,this.attachWorkDoneProgress(i),void 0)})},onIncomingCalls:r=>{const i=t.CallHierarchyIncomingCallsRequest.type;return this.connection.onRequest(i,(a,s)=>{return r(a,s,this.attachWorkDoneProgress(a),this.attachPartialResultProgress(i,a))})},onOutgoingCalls:r=>{const i=t.CallHierarchyOutgoingCallsRequest.type;return this.connection.onRequest(i,(a,s)=>{return r(a,s,this.attachWorkDoneProgress(a),this.attachPartialResultProgress(i,a))})}}}}};Oi.CallHierarchyFeature=e;return Oi}var Ii={};var Ny;function U_(){if(Ny)return Ii;Ny=1;Object.defineProperty(Ii,"__esModule",{value:true});Ii.ShowDocumentFeature=void 0;const t=qe();const e=n=>{return class extends n{showDocument(r){return this.connection.sendRequest(t.ShowDocumentRequest.type,r)}}};Ii.ShowDocumentFeature=e;return Ii}var Li={};var Py;function G_(){if(Py)return Li;Py=1;Object.defineProperty(Li,"__esModule",{value:true});Li.FileOperationsFeature=void 0;const t=qe();const e=n=>{return class extends n{onDidCreateFiles(r){return this.connection.onNotification(t.DidCreateFilesNotification.type,i=>{r(i)})}onDidRenameFiles(r){return this.connection.onNotification(t.DidRenameFilesNotification.type,i=>{r(i)})}onDidDeleteFiles(r){return this.connection.onNotification(t.DidDeleteFilesNotification.type,i=>{r(i)})}onWillCreateFiles(r){return this.connection.onRequest(t.WillCreateFilesRequest.type,(i,a)=>{return r(i,a)})}onWillRenameFiles(r){return this.connection.onRequest(t.WillRenameFilesRequest.type,(i,a)=>{return r(i,a)})}onWillDeleteFiles(r){return this.connection.onRequest(t.WillDeleteFilesRequest.type,(i,a)=>{return r(i,a)})}}};Li.FileOperationsFeature=e;return Li}var xi={};var _y;function H_(){if(_y)return xi;_y=1;Object.defineProperty(xi,"__esModule",{value:true});xi.LinkedEditingRangeFeature=void 0;const t=qe();const e=n=>{return class extends n{onLinkedEditingRange(r){return this.connection.onRequest(t.LinkedEditingRangeRequest.type,(i,a)=>{return r(i,a,this.attachWorkDoneProgress(i),void 0)})}}};xi.LinkedEditingRangeFeature=e;return xi}var Mi={};var Dy;function q_(){if(Dy)return Mi;Dy=1;Object.defineProperty(Mi,"__esModule",{value:true});Mi.TypeHierarchyFeature=void 0;const t=qe();const e=n=>{return class extends n{get typeHierarchy(){return{onPrepare:r=>{return this.connection.onRequest(t.TypeHierarchyPrepareRequest.type,(i,a)=>{return r(i,a,this.attachWorkDoneProgress(i),void 0)})},onSupertypes:r=>{const i=t.TypeHierarchySupertypesRequest.type;return this.connection.onRequest(i,(a,s)=>{return r(a,s,this.attachWorkDoneProgress(a),this.attachPartialResultProgress(i,a))})},onSubtypes:r=>{const i=t.TypeHierarchySubtypesRequest.type;return this.connection.onRequest(i,(a,s)=>{return r(a,s,this.attachWorkDoneProgress(a),this.attachPartialResultProgress(i,a))})}}}}};Mi.TypeHierarchyFeature=e;return Mi}var Ki={};var Oy;function j_(){if(Oy)return Ki;Oy=1;Object.defineProperty(Ki,"__esModule",{value:true});Ki.InlineValueFeature=void 0;const t=qe();const e=n=>{return class extends n{get inlineValue(){return{refresh:()=>{return this.connection.sendRequest(t.InlineValueRefreshRequest.type)},on:r=>{return this.connection.onRequest(t.InlineValueRequest.type,(i,a)=>{return r(i,a,this.attachWorkDoneProgress(i))})}}}}};Ki.InlineValueFeature=e;return Ki}var Fi={};var Iy;function B_(){if(Iy)return Fi;Iy=1;Object.defineProperty(Fi,"__esModule",{value:true});Fi.FoldingRangeFeature=void 0;const t=qe();const e=n=>{return class extends n{get foldingRange(){return{refresh:()=>{return this.connection.sendRequest(t.FoldingRangeRefreshRequest.type)},on:r=>{const i=t.FoldingRangeRequest.type;return this.connection.onRequest(i,(a,s)=>{return r(a,s,this.attachWorkDoneProgress(a),this.attachPartialResultProgress(i,a))})}}}}};Fi.FoldingRangeFeature=e;return Fi}var Ui={};var Ly;function W_(){if(Ly)return Ui;Ly=1;Object.defineProperty(Ui,"__esModule",{value:true});Ui.InlayHintFeature=void 0;const t=qe();const e=n=>{return class extends n{get inlayHint(){return{refresh:()=>{return this.connection.sendRequest(t.InlayHintRefreshRequest.type)},on:r=>{return this.connection.onRequest(t.InlayHintRequest.type,(i,a)=>{return r(i,a,this.attachWorkDoneProgress(i))})},resolve:r=>{return this.connection.onRequest(t.InlayHintResolveRequest.type,(i,a)=>{return r(i,a)})}}}}};Ui.InlayHintFeature=e;return Ui}var Gi={};var xy;function V_(){if(xy)return Gi;xy=1;Object.defineProperty(Gi,"__esModule",{value:true});Gi.DiagnosticFeature=void 0;const t=qe();const e=n=>{return class extends n{get diagnostics(){return{refresh:()=>{return this.connection.sendRequest(t.DiagnosticRefreshRequest.type)},on:r=>{return this.connection.onRequest(t.DocumentDiagnosticRequest.type,(i,a)=>{return r(i,a,this.attachWorkDoneProgress(i),this.attachPartialResultProgress(t.DocumentDiagnosticRequest.partialResult,i))})},onWorkspace:r=>{return this.connection.onRequest(t.WorkspaceDiagnosticRequest.type,(i,a)=>{return r(i,a,this.attachWorkDoneProgress(i),this.attachPartialResultProgress(t.WorkspaceDiagnosticRequest.partialResult,i))})}}}}};Gi.DiagnosticFeature=e;return Gi}var Hi={};var My;function z_(){if(My)return Hi;My=1;Object.defineProperty(Hi,"__esModule",{value:true});Hi.MonikerFeature=void 0;const t=qe();const e=n=>{return class extends n{get moniker(){return{on:r=>{const i=t.MonikerRequest.type;return this.connection.onRequest(i,(a,s)=>{return r(a,s,this.attachWorkDoneProgress(a),this.attachPartialResultProgress(i,a))})}}}}};Hi.MonikerFeature=e;return Hi}var Ky;function Y_(){if(Ky)return oe;Ky=1;Object.defineProperty(oe,"__esModule",{value:true});oe.createConnection=oe.combineFeatures=oe.combineNotebooksFeatures=oe.combineLanguagesFeatures=oe.combineWorkspaceFeatures=oe.combineWindowFeatures=oe.combineClientFeatures=oe.combineTracerFeatures=oe.combineTelemetryFeatures=oe.combineConsoleFeatures=oe._NotebooksImpl=oe._LanguagesImpl=oe.BulkUnregistration=oe.BulkRegistration=oe.ErrorMessageTracker=void 0;const t=qe();const e=a$();const n=s$();const r=x_();const i=M_();const a=K_();const s=F_();const o=n$();const l=U_();const u=G_();const c=H_();const d=q_();const f=j_();const p=B_();const y=W_();const v=V_();const k=i$();const $=z_();function E(j){if(j===null){return void 0}return j}class C{constructor(){this._messages=Object.create(null)}add(R){let S=this._messages[R];if(!S){S=0}S++;this._messages[R]=S}sendErrors(R){Object.keys(this._messages).forEach(S=>{R.window.showErrorMessage(S)})}}oe.ErrorMessageTracker=C;class I{constructor(){}rawAttach(R){this._rawConnection=R}attach(R){this._connection=R}get connection(){if(!this._connection){throw new Error("Remote is not attached to a connection yet.")}return this._connection}fillServerCapabilities(R){}initialize(R){}error(R){this.send(t.MessageType.Error,R)}warn(R){this.send(t.MessageType.Warning,R)}info(R){this.send(t.MessageType.Info,R)}log(R){this.send(t.MessageType.Log,R)}debug(R){this.send(t.MessageType.Debug,R)}send(R,S){if(this._rawConnection){this._rawConnection.sendNotification(t.LogMessageNotification.type,{type:R,message:S}).catch(()=>{(0,t.RAL)().console.error(`Sending log message failed`)})}}}class X{constructor(){}attach(R){this._connection=R}get connection(){if(!this._connection){throw new Error("Remote is not attached to a connection yet.")}return this._connection}initialize(R){}fillServerCapabilities(R){}showErrorMessage(R,...S){let B={type:t.MessageType.Error,message:R,actions:S};return this.connection.sendRequest(t.ShowMessageRequest.type,B).then(E)}showWarningMessage(R,...S){let B={type:t.MessageType.Warning,message:R,actions:S};return this.connection.sendRequest(t.ShowMessageRequest.type,B).then(E)}showInformationMessage(R,...S){let B={type:t.MessageType.Info,message:R,actions:S};return this.connection.sendRequest(t.ShowMessageRequest.type,B).then(E)}}const q=(0,l.ShowDocumentFeature)((0,r.ProgressFeature)(X));var J;(function(j){function R(){return new ne}j.create=R})(J||(oe.BulkRegistration=J={}));class ne{constructor(){this._registrations=[];this._registered=new Set}add(R,S){const B=e.string(R)?R:R.method;if(this._registered.has(B)){throw new Error(`${B} is already added to this registration`)}const A=n.generateUuid();this._registrations.push({id:A,method:B,registerOptions:S||{}});this._registered.add(B)}asRegistrationParams(){return{registrations:this._registrations}}}var ae;(function(j){function R(){return new de(void 0,[])}j.create=R})(ae||(oe.BulkUnregistration=ae={}));class de{constructor(R,S){this._connection=R;this._unregistrations=new Map;S.forEach(B=>{this._unregistrations.set(B.method,B)})}get isAttached(){return!!this._connection}attach(R){this._connection=R}add(R){this._unregistrations.set(R.method,R)}dispose(){let R=[];for(let B of this._unregistrations.values()){R.push(B)}let S={unregisterations:R};this._connection.sendRequest(t.UnregistrationRequest.type,S).catch(()=>{this._connection.console.info(`Bulk unregistration failed.`)})}disposeSingle(R){const S=e.string(R)?R:R.method;const B=this._unregistrations.get(S);if(!B){return false}let A={unregisterations:[B]};this._connection.sendRequest(t.UnregistrationRequest.type,A).then(()=>{this._unregistrations.delete(S)},fe=>{this._connection.console.info(`Un-registering request handler for ${B.id} failed.`)});return true}}class L{attach(R){this._connection=R}get connection(){if(!this._connection){throw new Error("Remote is not attached to a connection yet.")}return this._connection}initialize(R){}fillServerCapabilities(R){}register(R,S,B){if(R instanceof ne){return this.registerMany(R)}else if(R instanceof de){return this.registerSingle1(R,S,B)}else{return this.registerSingle2(R,S)}}registerSingle1(R,S,B){const A=e.string(S)?S:S.method;const fe=n.generateUuid();let st={registrations:[{id:fe,method:A,registerOptions:B||{}}]};if(!R.isAttached){R.attach(this.connection)}return this.connection.sendRequest(t.RegistrationRequest.type,st).then(zt=>{R.add({id:fe,method:A});return R},zt=>{this.connection.console.info(`Registering request handler for ${A} failed.`);return Promise.reject(zt)})}registerSingle2(R,S){const B=e.string(R)?R:R.method;const A=n.generateUuid();let fe={registrations:[{id:A,method:B,registerOptions:S||{}}]};return this.connection.sendRequest(t.RegistrationRequest.type,fe).then(st=>{return t.Disposable.create(()=>{this.unregisterSingle(A,B).catch(()=>{this.connection.console.info(`Un-registering capability with id ${A} failed.`)})})},st=>{this.connection.console.info(`Registering request handler for ${B} failed.`);return Promise.reject(st)})}unregisterSingle(R,S){let B={unregisterations:[{id:R,method:S}]};return this.connection.sendRequest(t.UnregistrationRequest.type,B).catch(()=>{this.connection.console.info(`Un-registering request handler for ${R} failed.`)})}registerMany(R){let S=R.asRegistrationParams();return this.connection.sendRequest(t.RegistrationRequest.type,S).then(()=>{return new de(this._connection,S.registrations.map(B=>{return{id:B.id,method:B.method}}))},B=>{this.connection.console.info(`Bulk registration failed.`);return Promise.reject(B)})}}class w{constructor(){}attach(R){this._connection=R}get connection(){if(!this._connection){throw new Error("Remote is not attached to a connection yet.")}return this._connection}initialize(R){}fillServerCapabilities(R){}applyEdit(R){function S(A){return A&&!!A.edit}let B=S(R)?R:{edit:R};return this.connection.sendRequest(t.ApplyWorkspaceEditRequest.type,B)}}const g=(0,u.FileOperationsFeature)((0,a.WorkspaceFoldersFeature)((0,i.ConfigurationFeature)(w)));class b{constructor(){this._trace=t.Trace.Off}attach(R){this._connection=R}get connection(){if(!this._connection){throw new Error("Remote is not attached to a connection yet.")}return this._connection}initialize(R){}fillServerCapabilities(R){}set trace(R){this._trace=R}log(R,S){if(this._trace===t.Trace.Off){return}this.connection.sendNotification(t.LogTraceNotification.type,{message:R,verbose:this._trace===t.Trace.Verbose?S:void 0}).catch(()=>{})}}class M{constructor(){}attach(R){this._connection=R}get connection(){if(!this._connection){throw new Error("Remote is not attached to a connection yet.")}return this._connection}initialize(R){}fillServerCapabilities(R){}logEvent(R){this.connection.sendNotification(t.TelemetryEventNotification.type,R).catch(()=>{this.connection.console.log(`Sending TelemetryEventNotification failed`)})}}class O{constructor(){}attach(R){this._connection=R}get connection(){if(!this._connection){throw new Error("Remote is not attached to a connection yet.")}return this._connection}initialize(R){}fillServerCapabilities(R){}attachWorkDoneProgress(R){return(0,r.attachWorkDone)(this.connection,R)}attachPartialResultProgress(R,S){return(0,r.attachPartialResult)(this.connection,S)}}oe._LanguagesImpl=O;const x=(0,p.FoldingRangeFeature)((0,$.MonikerFeature)((0,v.DiagnosticFeature)((0,y.InlayHintFeature)((0,f.InlineValueFeature)((0,d.TypeHierarchyFeature)((0,c.LinkedEditingRangeFeature)((0,o.SemanticTokensFeature)((0,s.CallHierarchyFeature)(O)))))))));class we{constructor(){}attach(R){this._connection=R}get connection(){if(!this._connection){throw new Error("Remote is not attached to a connection yet.")}return this._connection}initialize(R){}fillServerCapabilities(R){}attachWorkDoneProgress(R){return(0,r.attachWorkDone)(this.connection,R)}attachPartialResultProgress(R,S){return(0,r.attachPartialResult)(this.connection,S)}}oe._NotebooksImpl=we;const F=(0,k.NotebookSyncFeature)(we);function N(j,R){return function(S){return R(j(S))}}oe.combineConsoleFeatures=N;function re(j,R){return function(S){return R(j(S))}}oe.combineTelemetryFeatures=re;function kt(j,R){return function(S){return R(j(S))}}oe.combineTracerFeatures=kt;function bt(j,R){return function(S){return R(j(S))}}oe.combineClientFeatures=bt;function Ce(j,R){return function(S){return R(j(S))}}oe.combineWindowFeatures=Ce;function Nt(j,R){return function(S){return R(j(S))}}oe.combineWorkspaceFeatures=Nt;function me(j,R){return function(S){return R(j(S))}}oe.combineLanguagesFeatures=me;function Pe(j,R){return function(S){return R(j(S))}}oe.combineNotebooksFeatures=Pe;function Be(j,R){function S(A,fe,st){if(A&&fe){return st(A,fe)}else if(A){return A}else{return fe}}let B={__brand:"features",console:S(j.console,R.console,N),tracer:S(j.tracer,R.tracer,kt),telemetry:S(j.telemetry,R.telemetry,re),client:S(j.client,R.client,bt),window:S(j.window,R.window,Ce),workspace:S(j.workspace,R.workspace,Nt),languages:S(j.languages,R.languages,me),notebooks:S(j.notebooks,R.notebooks,Pe)};return B}oe.combineFeatures=Be;function Re(j,R,S){const B=S&&S.console?new(S.console(I)):new I;const A=j(B);B.rawAttach(A);const fe=S&&S.tracer?new(S.tracer(b)):new b;const st=S&&S.telemetry?new(S.telemetry(M)):new M;const zt=S&&S.client?new(S.client(L)):new L;const Bn=S&&S.window?new(S.window(q)):new q;const Wn=S&&S.workspace?new(S.workspace(g)):new g;const Vn=S&&S.languages?new(S.languages(x)):new x;const Tt=S&&S.notebooks?new(S.notebooks(F)):new F;const nn=[B,fe,st,zt,Bn,Wn,Vn,Tt];function Lr(P){if(P instanceof Promise){return P}else if(e.thenable(P)){return new Promise((_,G)=>{P.then(Et=>_(Et),Et=>G(Et))})}else{return Promise.resolve(P)}}let hn=void 0;let yn=void 0;let rn=void 0;let Gt={listen:()=>A.listen(),sendRequest:(P,..._)=>A.sendRequest(e.string(P)?P:P.method,..._),onRequest:(P,_)=>A.onRequest(P,_),sendNotification:(P,_)=>{const G=e.string(P)?P:P.method;return A.sendNotification(G,_)},onNotification:(P,_)=>A.onNotification(P,_),onProgress:A.onProgress,sendProgress:A.sendProgress,onInitialize:P=>{yn=P;return{dispose:()=>{yn=void 0}}},onInitialized:P=>A.onNotification(t.InitializedNotification.type,P),onShutdown:P=>{hn=P;return{dispose:()=>{hn=void 0}}},onExit:P=>{rn=P;return{dispose:()=>{rn=void 0}}},get console(){return B},get telemetry(){return st},get tracer(){return fe},get client(){return zt},get window(){return Bn},get workspace(){return Wn},get languages(){return Vn},get notebooks(){return Tt},onDidChangeConfiguration:P=>A.onNotification(t.DidChangeConfigurationNotification.type,P),onDidChangeWatchedFiles:P=>A.onNotification(t.DidChangeWatchedFilesNotification.type,P),__textDocumentSync:void 0,onDidOpenTextDocument:P=>A.onNotification(t.DidOpenTextDocumentNotification.type,P),onDidChangeTextDocument:P=>A.onNotification(t.DidChangeTextDocumentNotification.type,P),onDidCloseTextDocument:P=>A.onNotification(t.DidCloseTextDocumentNotification.type,P),onWillSaveTextDocument:P=>A.onNotification(t.WillSaveTextDocumentNotification.type,P),onWillSaveTextDocumentWaitUntil:P=>A.onRequest(t.WillSaveTextDocumentWaitUntilRequest.type,P),onDidSaveTextDocument:P=>A.onNotification(t.DidSaveTextDocumentNotification.type,P),sendDiagnostics:P=>A.sendNotification(t.PublishDiagnosticsNotification.type,P),onHover:P=>A.onRequest(t.HoverRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(A,_),void 0)}),onCompletion:P=>A.onRequest(t.CompletionRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(A,_),(0,r.attachPartialResult)(A,_))}),onCompletionResolve:P=>A.onRequest(t.CompletionResolveRequest.type,P),onSignatureHelp:P=>A.onRequest(t.SignatureHelpRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(A,_),void 0)}),onDeclaration:P=>A.onRequest(t.DeclarationRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(A,_),(0,r.attachPartialResult)(A,_))}),onDefinition:P=>A.onRequest(t.DefinitionRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(A,_),(0,r.attachPartialResult)(A,_))}),onTypeDefinition:P=>A.onRequest(t.TypeDefinitionRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(A,_),(0,r.attachPartialResult)(A,_))}),onImplementation:P=>A.onRequest(t.ImplementationRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(A,_),(0,r.attachPartialResult)(A,_))}),onReferences:P=>A.onRequest(t.ReferencesRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(A,_),(0,r.attachPartialResult)(A,_))}),onDocumentHighlight:P=>A.onRequest(t.DocumentHighlightRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(A,_),(0,r.attachPartialResult)(A,_))}),onDocumentSymbol:P=>A.onRequest(t.DocumentSymbolRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(A,_),(0,r.attachPartialResult)(A,_))}),onWorkspaceSymbol:P=>A.onRequest(t.WorkspaceSymbolRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(A,_),(0,r.attachPartialResult)(A,_))}),onWorkspaceSymbolResolve:P=>A.onRequest(t.WorkspaceSymbolResolveRequest.type,P),onCodeAction:P=>A.onRequest(t.CodeActionRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(A,_),(0,r.attachPartialResult)(A,_))}),onCodeActionResolve:P=>A.onRequest(t.CodeActionResolveRequest.type,(_,G)=>{return P(_,G)}),onCodeLens:P=>A.onRequest(t.CodeLensRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(A,_),(0,r.attachPartialResult)(A,_))}),onCodeLensResolve:P=>A.onRequest(t.CodeLensResolveRequest.type,(_,G)=>{return P(_,G)}),onDocumentFormatting:P=>A.onRequest(t.DocumentFormattingRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(A,_),void 0)}),onDocumentRangeFormatting:P=>A.onRequest(t.DocumentRangeFormattingRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(A,_),void 0)}),onDocumentOnTypeFormatting:P=>A.onRequest(t.DocumentOnTypeFormattingRequest.type,(_,G)=>{return P(_,G)}),onRenameRequest:P=>A.onRequest(t.RenameRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(A,_),void 0)}),onPrepareRename:P=>A.onRequest(t.PrepareRenameRequest.type,(_,G)=>{return P(_,G)}),onDocumentLinks:P=>A.onRequest(t.DocumentLinkRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(A,_),(0,r.attachPartialResult)(A,_))}),onDocumentLinkResolve:P=>A.onRequest(t.DocumentLinkResolveRequest.type,(_,G)=>{return P(_,G)}),onDocumentColor:P=>A.onRequest(t.DocumentColorRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(A,_),(0,r.attachPartialResult)(A,_))}),onColorPresentation:P=>A.onRequest(t.ColorPresentationRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(A,_),(0,r.attachPartialResult)(A,_))}),onFoldingRanges:P=>A.onRequest(t.FoldingRangeRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(A,_),(0,r.attachPartialResult)(A,_))}),onSelectionRanges:P=>A.onRequest(t.SelectionRangeRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(A,_),(0,r.attachPartialResult)(A,_))}),onExecuteCommand:P=>A.onRequest(t.ExecuteCommandRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(A,_),void 0)}),dispose:()=>A.dispose()};for(let P of nn){P.attach(Gt)}A.onRequest(t.InitializeRequest.type,P=>{R.initialize(P);if(e.string(P.trace)){fe.trace=t.Trace.fromString(P.trace)}for(let _ of nn){_.initialize(P.capabilities)}if(yn){let _=yn(P,new t.CancellationTokenSource().token,(0,r.attachWorkDone)(A,P),void 0);return Lr(_).then(G=>{if(G instanceof t.ResponseError){return G}let Et=G;if(!Et){Et={capabilities:{}}}let dt=Et.capabilities;if(!dt){dt={};Et.capabilities=dt}if(dt.textDocumentSync===void 0||dt.textDocumentSync===null){dt.textDocumentSync=e.number(Gt.__textDocumentSync)?Gt.__textDocumentSync:t.TextDocumentSyncKind.None}else if(!e.number(dt.textDocumentSync)&&!e.number(dt.textDocumentSync.change)){dt.textDocumentSync.change=e.number(Gt.__textDocumentSync)?Gt.__textDocumentSync:t.TextDocumentSyncKind.None}for(let sr of nn){sr.fillServerCapabilities(dt)}return Et})}else{let _={capabilities:{textDocumentSync:t.TextDocumentSyncKind.None}};for(let G of nn){G.fillServerCapabilities(_.capabilities)}return _}});A.onRequest(t.ShutdownRequest.type,()=>{R.shutdownReceived=true;if(hn){return hn(new t.CancellationTokenSource().token)}else{return void 0}});A.onNotification(t.ExitNotification.type,()=>{try{if(rn){rn()}}finally{if(R.shutdownReceived){R.exit(0)}else{R.exit(1)}}});A.onNotification(t.SetTraceNotification.type,P=>{fe.trace=t.Trace.fromString(P.value)});return Gt}oe.createConnection=Re;return oe}var Fy;function Uy(){if(Fy)return pi;Fy=1;(function(t){var e=pi.__createBinding||(Object.create?function(l,u,c,d){if(d===void 0)d=c;var f=Object.getOwnPropertyDescriptor(u,c);if(!f||("get"in f?!u.__esModule:f.writable||f.configurable)){f={enumerable:true,get:function(){return u[c]}}}Object.defineProperty(l,d,f)}:function(l,u,c,d){if(d===void 0)d=c;l[d]=u[c]});var n=pi.__exportStar||function(l,u){for(var c in l)if(c!=="default"&&!Object.prototype.hasOwnProperty.call(u,c))e(u,l,c)};Object.defineProperty(t,"__esModule",{value:true});t.ProposedFeatures=t.NotebookDocuments=t.TextDocuments=t.SemanticTokensBuilder=void 0;const r=n$();Object.defineProperty(t,"SemanticTokensBuilder",{enumerable:true,get:function(){return r.SemanticTokensBuilder}});const i=L_();n(qe(),t);const a=r$();Object.defineProperty(t,"TextDocuments",{enumerable:true,get:function(){return a.TextDocuments}});const s=i$();Object.defineProperty(t,"NotebookDocuments",{enumerable:true,get:function(){return s.NotebookDocuments}});n(Y_(),t);var o;(function(l){l.all={__brand:"features",languages:i.InlineCompletionFeature}})(o||(t.ProposedFeatures=o={}))})(pi);return pi}var xc;var Gy;function X_(){if(Gy)return xc;Gy=1;xc=qe();return xc}var Hy;function o$(){if(Hy)return fi;Hy=1;(function(t){var e=fi.__createBinding||(Object.create?function(o,l,u,c){if(c===void 0)c=u;var d=Object.getOwnPropertyDescriptor(l,u);if(!d||("get"in d?!l.__esModule:d.writable||d.configurable)){d={enumerable:true,get:function(){return l[u]}}}Object.defineProperty(o,c,d)}:function(o,l,u,c){if(c===void 0)c=u;o[c]=l[u]});var n=fi.__exportStar||function(o,l){for(var u in o)if(u!=="default"&&!Object.prototype.hasOwnProperty.call(l,u))e(l,o,u)};Object.defineProperty(t,"__esModule",{value:true});t.createConnection=void 0;const r=Uy();n(X_(),t);n(Uy(),t);let i=false;const a={initialize:o=>{},get shutdownReceived(){return i},set shutdownReceived(o){i=o},exit:o=>{}};function s(o,l,u,c){let d;let f;let p;let y;if(o!==void 0&&o.__brand==="features"){d=o;o=l;l=u;u=c}if(r.ConnectionStrategy.is(o)||r.ConnectionOptions.is(o)){y=o}else{f=o;p=l;y=u}const v=k=>{return(0,r.createProtocolConnection)(f,p,k,y)};return(0,r.createConnection)(v,a,d)}t.createConnection=s})(fi);return fi}var U=o$();function qy(t,e){const n={stacks:t,tokens:e};J_(n);n.stacks.flat().forEach(i=>{i.property=void 0});const r=u$(n.stacks);return r.map(i=>i[i.length-1])}function Zp(t){const{next:e,cardinalities:n,visited:r,plus:i}=t;const a=[];const s=e.feature;if(r.has(s)){return[]}else if(!wr(s)){r.add(s)}let o;let l=s;while(l.$container){if(wr(l.$container)){o=l.$container;break}else if(kg(l.$container)){l=l.$container}else{break}}if(oT(l.cardinality)){const u=Br({next:{feature:l,type:e.type},cardinalities:n,visited:r,plus:i});for(const c of u){i.add(c.feature)}a.push(...u)}if(o){const u=o.elements.indexOf(l);if(u!==void 0&&u<o.elements.length-1){a.push(...l$({feature:o,type:e.type},u+1,n,r,i))}if(a.every(c=>Ma(c.feature.cardinality,c.feature)||Ma(n.get(c.feature))||i.has(c.feature))){a.push(...Zp({next:{feature:o,type:e.type},cardinalities:n,visited:r,plus:i}))}}return a}function lp(t){if(rt(t)){t={feature:t}}return Br({next:t,cardinalities:new Map,visited:new Set,plus:new Set})}function Br(t){var e,n,r;const{next:i,cardinalities:a,visited:s,plus:o}=t;if(i===void 0){return[]}const{feature:l,type:u}=i;if(wr(l)){if(s.has(l)){return[]}else{s.add(l)}return l$(i,0,a,s,o).map(c=>Ws(c,l.cardinality,a))}else if(dp(l)||fp(l)){return l.elements.flatMap(c=>Br({next:{feature:c,type:u,property:i.property},cardinalities:a,visited:s,plus:o})).map(c=>Ws(c,l.cardinality,a))}else if(cn(l)){const c={feature:l.terminal,type:u,property:(e=i.property)!==null&&e!==void 0?e:l.feature};return Br({next:c,cardinalities:a,visited:s,plus:o}).map(d=>Ws(d,l.cardinality,a))}else if(Za(l)){return Zp({next:{feature:l,type:Bu(l),property:(n=i.property)!==null&&n!==void 0?n:l.feature},cardinalities:a,visited:s,plus:o})}else if(Mn(l)&&ct(l.rule.ref)){const c=l.rule.ref;const d={feature:c.definition,type:c.fragment||c.dataType?void 0:(r=ts(c))!==null&&r!==void 0?r:c.name,property:i.property};return Br({next:d,cardinalities:a,visited:s,plus:o}).map(f=>Ws(f,l.cardinality,a))}else{return[i]}}function Ws(t,e,n){n.set(t.feature,e);return t}function l$(t,e,n,r,i){var a;const s=[];let o;while(e<t.feature.elements.length){const l=t.feature.elements[e++];o={feature:l,type:t.type};s.push(...Br({next:o,cardinalities:n,visited:r,plus:i}));if(!Ma((a=o.feature.cardinality)!==null&&a!==void 0?a:n.get(o.feature),o.feature)){break}}return s}function J_(t){for(const e of t.tokens){const n=u$(t.stacks,e);t.stacks=n}}function u$(t,e){const n=[];for(const r of t){n.push(...Q_(r,e))}return n}function Q_(t,e){const n=new Map;const r=new Set(t.map(a=>a.feature).filter(Z_));const i=[];while(t.length>0){const a=t.pop();const s=Zp({next:a,cardinalities:n,plus:r,visited:new Set}).filter(o=>e?em(o.feature,e):true);for(const o of s){i.push([...t,o])}if(!s.every(o=>Ma(o.feature.cardinality,o.feature)||Ma(n.get(o.feature)))){break}}return i}function Z_(t){if(t.cardinality==="+"){return true}const e=In(t,cn);if(e&&e.cardinality==="+"){return true}return false}function em(t,e){if(dn(t)){const n=t.value;return n===e.image}else if(Mn(t)){return eD(t.rule.ref,e)}else if(es(t)){const n=Mg(t);if(n){return em(n,e)}}return false}function eD(t,e){if(ct(t)){const n=lp(t.definition);return n.some(r=>em(r.feature,e))}else if(tr(t)){return Wu(t).test(e.image)}else{return false}}function tD(t){const e=Array.from(new Set(t.flatMap(r=>{var i;return(i=r===null||r===void 0?void 0:r.triggerCharacters)!==null&&i!==void 0?i:[]})));const n=Array.from(new Set(t.flatMap(r=>{var i;return(i=r===null||r===void 0?void 0:r.allCommitCharacters)!==null&&i!==void 0?i:[]})));return{triggerCharacters:e.length>0?e:void 0,allCommitCharacters:n.length>0?n:void 0}}class c${constructor(e){this.scopeProvider=e.references.ScopeProvider;this.grammar=e.Grammar;this.completionParser=e.parser.CompletionParser;this.nameProvider=e.references.NameProvider;this.lexer=e.parser.Lexer;this.nodeKindProvider=e.shared.lsp.NodeKindProvider;this.fuzzyMatcher=e.shared.lsp.FuzzyMatcher;this.grammarConfig=e.parser.GrammarConfig;this.astReflection=e.shared.AstReflection;this.documentationProvider=e.documentation.DocumentationProvider}async getCompletion(e,n,r){const i=[];const a=this.buildContexts(e,n.position);const s=(u,c)=>{const d=this.fillCompletionItem(u,c);if(d){i.push(d)}};const o=u=>{if(dn(u.feature)){return u.feature.value}else{return u.feature}};const l=[];for(const u of a){await Promise.all(be(u.features).distinct(o).exclude(l).map(c=>this.completionFor(u,c,s)));l.push(...u.features);if(!this.continueCompletion(i)){break}}return U.CompletionList.create(this.deduplicateItems(i),true)}deduplicateItems(e){return be(e).distinct(n=>`${n.kind}_${n.label}_${n.detail}`).toArray()}findFeaturesAt(e,n){const r=e.getText({start:U.Position.create(0,0),end:e.positionAt(n)});const i=this.completionParser.parse(r);const a=i.tokens;if(i.tokenIndex===0){const l=Fd(this.grammar);const u=lp({feature:l.definition,type:ts(l)});if(a.length>0){a.shift();return qy(u.map(c=>[c]),a)}else{return u}}const s=[...a].splice(i.tokenIndex);const o=qy([i.elementStack.map(l=>({feature:l}))],s);return o}*buildContexts(e,n){var r,i;const a=e.parseResult.value.$cstNode;if(!a){return}const s=e.textDocument;const o=s.getText();const l=s.offsetAt(n);const u={document:e,textDocument:s,offset:l,position:n};const c=this.findDataTypeRuleStart(a,l);if(c){const[E,C]=c;const I=(r=Md(a,E))===null||r===void 0?void 0:r.astNode;yield Object.assign(Object.assign({},u),{node:I,tokenOffset:E,tokenEndOffset:C,features:this.findFeaturesAt(s,E)})}const{nextTokenStart:d,nextTokenEnd:f,previousTokenStart:p,previousTokenEnd:y}=this.backtrackToAnyToken(o,l);let v=d;if(l<=d&&p!==void 0){v=p}const k=(i=Md(a,v))===null||i===void 0?void 0:i.astNode;let $=true;if(p!==void 0&&y!==void 0&&y===l){yield Object.assign(Object.assign({},u),{node:k,tokenOffset:p,tokenEndOffset:y,features:this.findFeaturesAt(s,p)});$=this.performNextTokenCompletion(e,o.substring(p,y),p,y);if($){yield Object.assign(Object.assign({},u),{node:k,tokenOffset:y,tokenEndOffset:y,features:this.findFeaturesAt(s,y)})}}if(!k){const E=Fd(this.grammar);if(!E){throw new Error("Missing entry parser rule")}yield Object.assign(Object.assign({},u),{tokenOffset:d,tokenEndOffset:f,features:lp(E.definition)})}else if($){yield Object.assign(Object.assign({},u),{node:k,tokenOffset:d,tokenEndOffset:f,features:this.findFeaturesAt(s,d)})}}performNextTokenCompletion(e,n,r,i){return/\P{L}$/u.test(n)}findDataTypeRuleStart(e,n){var r,i;let a=Er(e,n,this.grammarConfig.nameRegexp);let s=Boolean((r=In(a===null||a===void 0?void 0:a.grammarSource,ct))===null||r===void 0?void 0:r.dataType);if(s){while(s){a=a===null||a===void 0?void 0:a.container;s=Boolean((i=In(a===null||a===void 0?void 0:a.grammarSource,ct))===null||i===void 0?void 0:i.dataType)}if(a){return[a.offset,a.end]}}return void 0}continueCompletion(e){return e.length===0}backtrackToAnyToken(e,n){const r=this.lexer.tokenize(e).tokens;if(r.length===0){return{nextTokenStart:n,nextTokenEnd:n}}let i;for(const a of r){if(a.startOffset>=n){return{nextTokenStart:n,nextTokenEnd:n,previousTokenStart:i?i.startOffset:void 0,previousTokenEnd:i?i.endOffset+1:void 0}}if(a.endOffset>=n){return{nextTokenStart:a.startOffset,nextTokenEnd:a.endOffset+1,previousTokenStart:i?i.startOffset:void 0,previousTokenEnd:i?i.endOffset+1:void 0}}i=a}return{nextTokenStart:n,nextTokenEnd:n,previousTokenStart:i?i.startOffset:void 0,previousTokenEnd:i?i.endOffset+1:void 0}}completionFor(e,n,r){if(dn(n.feature)){return this.completionForKeyword(e,n.feature,r)}else if(es(n.feature)&&e.node){return this.completionForCrossReference(e,n,r)}}completionForCrossReference(e,n,r){const i=In(n.feature,cn);let a=e.node;if(i&&a){if(n.type){a={$type:n.type,$container:a,$containerProperty:n.property};Og(this.astReflection,a)}const s={reference:{$refText:""},container:a,property:i.feature};try{for(const o of this.getReferenceCandidates(s,e)){r(e,this.createReferenceCompletionItem(o))}}catch(o){console.error(o)}}}getReferenceCandidates(e,n){return this.scopeProvider.getScope(e).getAllElements()}createReferenceCompletionItem(e){const n=this.nodeKindProvider.getCompletionItemKind(e);const r=this.getReferenceDocumentation(e);return{nodeDescription:e,kind:n,documentation:r,detail:e.type,sortText:"0"}}getReferenceDocumentation(e){if(!e.node){return void 0}const n=this.documentationProvider.getDocumentation(e.node);if(!n){return void 0}return{kind:"markdown",value:n}}completionForKeyword(e,n,r){if(!this.filterKeyword(e,n)){return}r(e,{label:n.value,kind:this.getKeywordCompletionItemKind(n),detail:"Keyword",sortText:"1"})}getKeywordCompletionItemKind(e){return U.CompletionItemKind.Keyword}filterKeyword(e,n){return/\p{L}/u.test(n.value)}fillCompletionItem(e,n){var r,i;let a;if(typeof n.label==="string"){a=n.label}else if("node"in n){const u=this.nameProvider.getName(n.node);if(!u){return void 0}a=u}else if("nodeDescription"in n){a=n.nodeDescription.name}else{return void 0}let s;if(typeof((r=n.textEdit)===null||r===void 0?void 0:r.newText)==="string"){s=n.textEdit.newText}else if(typeof n.insertText==="string"){s=n.insertText}else{s=a}const o=(i=n.textEdit)!==null&&i!==void 0?i:this.buildCompletionTextEdit(e,a,s);if(!o){return void 0}const l={additionalTextEdits:n.additionalTextEdits,command:n.command,commitCharacters:n.commitCharacters,data:n.data,detail:n.detail,documentation:n.documentation,filterText:n.filterText,insertText:n.insertText,insertTextFormat:n.insertTextFormat,insertTextMode:n.insertTextMode,kind:n.kind,labelDetails:n.labelDetails,preselect:n.preselect,sortText:n.sortText,tags:n.tags,textEditText:n.textEditText,textEdit:o,label:a};return l}buildCompletionTextEdit(e,n,r){const i=e.textDocument.getText();const a=i.substring(e.tokenOffset,e.offset);if(this.fuzzyMatcher.match(a,n)){const s=e.textDocument.positionAt(e.tokenOffset);const o=e.position;return{newText:r,range:{start:s,end:o}}}else{return void 0}}}class nD{constructor(e){this.nameProvider=e.references.NameProvider;this.references=e.references.References;this.grammarConfig=e.parser.GrammarConfig}getDefinition(e,n,r){const i=e.parseResult.value;if(i.$cstNode){const a=i.$cstNode;const s=Er(a,e.textDocument.offsetAt(n.position),this.grammarConfig.nameRegexp);if(s){return this.collectLocationLinks(s,n)}}return void 0}collectLocationLinks(e,n){var r;const i=this.findLink(e);if(i){return[U.LocationLink.create(i.targetDocument.textDocument.uri,((r=i.target.astNode.$cstNode)!==null&&r!==void 0?r:i.target).range,i.target.range,i.source.range)]}return void 0}findLink(e){const n=this.references.findDeclarationNode(e);if(n===null||n===void 0?void 0:n.astNode){const r=yt(n.astNode);if(n&&r){return{source:e,target:n,targetDocument:r}}}return void 0}}class rD{constructor(e){this.references=e.references.References;this.nameProvider=e.references.NameProvider;this.grammarConfig=e.parser.GrammarConfig}getDocumentHighlight(e,n,r){const i=e.parseResult.value.$cstNode;if(!i){return void 0}const a=Er(i,e.textDocument.offsetAt(n.position),this.grammarConfig.nameRegexp);if(!a){return void 0}const s=this.references.findDeclaration(a);if(s){const o=Ge.equals(yt(s).uri,e.uri);const l={documentUri:e.uri,includeDeclaration:o};const u=this.references.findReferences(s,l);return u.map(c=>this.createDocumentHighlight(c)).toArray()}return void 0}createDocumentHighlight(e){return U.DocumentHighlight.create(e.segment.range)}}class iD{constructor(e){this.nameProvider=e.references.NameProvider;this.nodeKindProvider=e.shared.lsp.NodeKindProvider}getSymbols(e,n,r){return this.getSymbol(e,e.parseResult.value)}getSymbol(e,n){const r=n.$cstNode;const i=this.nameProvider.getNameNode(n);if(i&&r){const a=this.nameProvider.getName(n);return[{kind:this.nodeKindProvider.getSymbolKind(n),name:a||i.text,range:r.range,selectionRange:i.range,children:this.getChildSymbols(e,n)}]}else{return this.getChildSymbols(e,n)||[]}}getChildSymbols(e,n){const r=[];for(const i of Hu(n)){const a=this.getSymbol(e,i);r.push(...a)}if(r.length>0){return r}return void 0}}class d${constructor(e){this.workspaceManager=e.workspace.WorkspaceManager;this.documentBuilder=e.workspace.DocumentBuilder;this.workspaceLock=e.workspace.WorkspaceLock;this.serviceRegistry=e.ServiceRegistry;let n=false;e.lsp.LanguageServer.onInitialize(r=>{var i,a;n=Boolean((a=(i=r.capabilities.workspace)===null||i===void 0?void 0:i.didChangeWatchedFiles)===null||a===void 0?void 0:a.dynamicRegistration)});e.lsp.LanguageServer.onInitialized(r=>{if(n){this.registerFileWatcher(e)}})}registerFileWatcher(e){const n=be(e.ServiceRegistry.all).flatMap(r=>r.LanguageMetaData.fileExtensions).map(r=>r.startsWith(".")?r.substring(1):r).distinct().toArray();if(n.length>0){const r=e.lsp.Connection;const i={watchers:[{globPattern:n.length===1?`**/*.${n[0]}`:`**/*.{${n.join(",")}}`}]};r===null||r===void 0?void 0:r.client.register(U.DidChangeWatchedFilesNotification.type,i)}}fireDocumentUpdate(e,n){e=e.filter(r=>this.serviceRegistry.hasServices(r));this.workspaceManager.ready.then(()=>{this.workspaceLock.write(r=>this.documentBuilder.update(e,n,r))}).catch(r=>{console.error("Workspace initialization failed. Could not perform document update.",r)})}didChangeContent(e){this.fireDocumentUpdate([lt.parse(e.document.uri)],[])}didChangeWatchedFiles(e){const n=be(e.changes).filter(i=>i.type!==U.FileChangeType.Deleted).distinct(i=>i.uri).map(i=>lt.parse(i.uri)).toArray();const r=be(e.changes).filter(i=>i.type===U.FileChangeType.Deleted).distinct(i=>i.uri).map(i=>lt.parse(i.uri)).toArray();this.fireDocumentUpdate(n,r)}}class aD{constructor(e){this.commentNames=e.parser.GrammarConfig.multilineCommentRules}getFoldingRanges(e,n,r){const i=[];const a=s=>i.push(s);this.collectFolding(e,a);return i}collectFolding(e,n){var r;const i=(r=e.parseResult)===null||r===void 0?void 0:r.value;if(i){if(this.shouldProcessContent(i)){const a=Nr(i).iterator();let s;do{s=a.next();if(!s.done){const o=s.value;if(this.shouldProcess(o)){this.collectObjectFolding(e,o,n)}if(!this.shouldProcessContent(o)){a.prune()}}}while(!s.done)}this.collectCommentFolding(e,i,n)}}shouldProcess(e){return true}shouldProcessContent(e){return true}collectObjectFolding(e,n,r){const i=n.$cstNode;if(i){const a=this.toFoldingRange(e,i);if(a){r(a)}}}collectCommentFolding(e,n,r){const i=n.$cstNode;if(i){for(const a of C$(i)){if(this.commentNames.includes(a.tokenType.name)){const s=this.toFoldingRange(e,a,U.FoldingRangeKind.Comment);if(s){r(s)}}}}}toFoldingRange(e,n,r){const i=n.range;const a=i.start;let s=i.end;if(s.line-a.line<2){return void 0}if(!this.includeLastFoldingLine(n,r)){s=e.textDocument.positionAt(e.textDocument.offsetAt({line:s.line,character:0})-1)}return U.FoldingRange.create(a.line,s.line,a.character,s.character,r)}includeLastFoldingLine(e,n){if(n===U.FoldingRangeKind.Comment){return false}const r=e.text;const i=r.charAt(r.length-1);if(i==="}"||i===")"||i==="]"){return false}return true}}class sD{match(e,n){if(e.length===0){return true}let r=false;let i;let a=0;const s=n.length;for(let o=0;o<s;o++){const l=n.charCodeAt(o);const u=e.charCodeAt(a);if(l===u||this.toUpperCharCode(l)===this.toUpperCharCode(u)){r||(r=i===void 0||this.isWordTransition(i,l));if(r){a++}if(a===e.length){return true}}i=l}return false}isWordTransition(e,n){return jy<=e&&e<=By&&oD<=n&&n<=lD||e===Wy&&n!==Wy}toUpperCharCode(e){if(jy<=e&&e<=By){return e-32}return e}}const jy="a".charCodeAt(0);const By="z".charCodeAt(0);const oD="A".charCodeAt(0);const lD="Z".charCodeAt(0);const Wy="_".charCodeAt(0);class uD{constructor(e){this.references=e.references.References;this.grammarConfig=e.parser.GrammarConfig}getHoverContent(e,n){var r,i;const a=(i=(r=e.parseResult)===null||r===void 0?void 0:r.value)===null||i===void 0?void 0:i.$cstNode;if(a){const s=e.textDocument.offsetAt(n.position);const o=Er(a,s,this.grammarConfig.nameRegexp);if(o&&o.offset+o.length>s){const l=this.references.findDeclaration(o);if(l){return this.getAstNodeHoverContent(l)}}}return void 0}}class cD extends uD{constructor(e){super(e);this.documentationProvider=e.documentation.DocumentationProvider}getAstNodeHoverContent(e){const n=this.documentationProvider.getDocumentation(e);if(n){return{contents:{kind:"markdown",value:n}}}return void 0}}var vr=qe();const dD={[U.SemanticTokenTypes.class]:0,[U.SemanticTokenTypes.comment]:1,[U.SemanticTokenTypes.enum]:2,[U.SemanticTokenTypes.enumMember]:3,[U.SemanticTokenTypes.event]:4,[U.SemanticTokenTypes.function]:5,[U.SemanticTokenTypes.interface]:6,[U.SemanticTokenTypes.keyword]:7,[U.SemanticTokenTypes.macro]:8,[U.SemanticTokenTypes.method]:9,[U.SemanticTokenTypes.modifier]:10,[U.SemanticTokenTypes.namespace]:11,[U.SemanticTokenTypes.number]:12,[U.SemanticTokenTypes.operator]:13,[U.SemanticTokenTypes.parameter]:14,[U.SemanticTokenTypes.property]:15,[U.SemanticTokenTypes.regexp]:16,[U.SemanticTokenTypes.string]:17,[U.SemanticTokenTypes.struct]:18,[U.SemanticTokenTypes.type]:19,[U.SemanticTokenTypes.typeParameter]:20,[U.SemanticTokenTypes.variable]:21,[U.SemanticTokenTypes.decorator]:22};const fD={[U.SemanticTokenModifiers.abstract]:1<<0,[U.SemanticTokenModifiers.async]:1<<1,[U.SemanticTokenModifiers.declaration]:1<<2,[U.SemanticTokenModifiers.defaultLibrary]:1<<3,[U.SemanticTokenModifiers.definition]:1<<4,[U.SemanticTokenModifiers.deprecated]:1<<5,[U.SemanticTokenModifiers.documentation]:1<<6,[U.SemanticTokenModifiers.modification]:1<<7,[U.SemanticTokenModifiers.readonly]:1<<8,[U.SemanticTokenModifiers.static]:1<<9};function pD(t){const e=[];const n=[];let r=true;let i=true;let a=true;for(const s of t){if(!s){continue}s.legend.tokenTypes.forEach((o,l)=>{const u=e[l];if(u&&u!==o){throw new Error(`Cannot merge '${u}' and '${o}' token types. They use the same index ${l}.`)}else{e[l]=o}});s.legend.tokenModifiers.forEach((o,l)=>{const u=n[l];if(u&&u!==o){throw new Error(`Cannot merge '${u}' and '${o}' token modifier. They use the same index ${l}.`)}else{n[l]=o}});if(!s.full){r=false}else if(typeof s.full==="object"&&!s.full.delta){i=false}if(!s.range){a=false}}return{legend:{tokenTypes:e,tokenModifiers:n},full:r&&{delta:i},range:a}}class mD extends U.SemanticTokensBuilder{constructor(){super(...arguments);this._tokens=[]}push(e,n,r,i,a){this._tokens.push({line:e,char:n,length:r,tokenType:i,tokenModifiers:a})}build(){this.applyTokens();return super.build()}buildEdits(){this.applyTokens();return super.buildEdits()}flush(){this.previousResult(this.id)}applyTokens(){for(const e of this._tokens.sort(this.compareTokens)){super.push(e.line,e.char,e.length,e.tokenType,e.tokenModifiers)}this._tokens=[]}compareTokens(e,n){if(e.line===n.line){return e.char-n.char}return e.line-n.line}}class hD{constructor(e){this.tokensBuilders=new Map;e.shared.workspace.TextDocuments.onDidClose(n=>{this.tokensBuilders.delete(n.document.uri)});e.shared.lsp.LanguageServer.onInitialize(n=>{var r;this.initialize((r=n.capabilities.textDocument)===null||r===void 0?void 0:r.semanticTokens)})}initialize(e){this.clientCapabilities=e}get tokenTypes(){return dD}get tokenModifiers(){return fD}get semanticTokensOptions(){return{legend:{tokenTypes:Object.keys(this.tokenTypes),tokenModifiers:Object.keys(this.tokenModifiers)},full:{delta:true},range:true}}async semanticHighlight(e,n,r=ye.CancellationToken.None){this.currentRange=void 0;this.currentDocument=e;this.currentTokensBuilder=this.getDocumentTokensBuilder(e);this.currentTokensBuilder.flush();await this.computeHighlighting(e,this.createAcceptor(),r);return this.currentTokensBuilder.build()}async semanticHighlightRange(e,n,r=ye.CancellationToken.None){this.currentRange=n.range;this.currentDocument=e;this.currentTokensBuilder=this.getDocumentTokensBuilder(e);this.currentTokensBuilder.flush();await this.computeHighlighting(e,this.createAcceptor(),r);return this.currentTokensBuilder.build()}async semanticHighlightDelta(e,n,r=ye.CancellationToken.None){this.currentRange=void 0;this.currentDocument=e;this.currentTokensBuilder=this.getDocumentTokensBuilder(e);this.currentTokensBuilder.previousResult(n.previousResultId);await this.computeHighlighting(e,this.createAcceptor(),r);return this.currentTokensBuilder.buildEdits()}createAcceptor(){const e=n=>{if("line"in n){this.highlightToken({range:{start:{line:n.line,character:n.char},end:{line:n.line,character:n.char+n.length}},type:n.type,modifier:n.modifier})}else if("range"in n){this.highlightToken(n)}else if("keyword"in n){this.highlightKeyword(n)}else if("property"in n){this.highlightProperty(n)}else{this.highlightNode({node:n.cst,type:n.type,modifier:n.modifier})}};return e}getDocumentTokensBuilder(e){const n=this.tokensBuilders.get(e.uri.toString());if(n){return n}const r=new mD;this.tokensBuilders.set(e.uri.toString(),r);return r}async computeHighlighting(e,n,r){const i=e.parseResult.value;const a=Xn(i,{range:this.currentRange}).iterator();let s;do{s=a.next();if(!s.done){await ht(r);const o=s.value;if(this.highlightElement(o,n)==="prune"){a.prune()}}}while(!s.done)}highlightToken(e){var n;const{range:r,type:i}=e;let a=e.modifier;if(this.currentRange&&!Eg(r,this.currentRange)||!this.currentDocument||!this.currentTokensBuilder){return}const s=this.tokenTypes[i];let o=0;if(a!==void 0){if(typeof a==="string"){a=[a]}for(const c of a){const d=this.tokenModifiers[c];o|=d}}const l=r.start.line;const u=r.end.line;if(l===u){const c=r.start.character;const d=r.end.character-c;this.currentTokensBuilder.push(l,c,d,s,o)}else if((n=this.clientCapabilities)===null||n===void 0?void 0:n.multilineTokenSupport){const c=r.start.character;const d=this.currentDocument.textDocument.offsetAt(r.start);const f=this.currentDocument.textDocument.offsetAt(r.end);this.currentTokensBuilder.push(l,c,f-d,s,o)}else{const c=r.start;let d=this.currentDocument.textDocument.offsetAt({line:l+1,character:0});this.currentTokensBuilder.push(c.line,c.character,d-c.character-1,s,o);for(let f=l+1;f<u;f++){const p=d;d=this.currentDocument.textDocument.offsetAt({line:f+1,character:0});this.currentTokensBuilder.push(f,0,d-p-1,s,o)}this.currentTokensBuilder.push(u,0,r.end.character,s,o)}}highlightProperty(e){const n=[];if(typeof e.index==="number"){const a=mp(e.node.$cstNode,e.property,e.index);if(a){n.push(a)}}else{n.push(...Kg(e.node.$cstNode,e.property))}const{type:r,modifier:i}=e;for(const a of n){this.highlightNode({node:a,type:r,modifier:i})}}highlightKeyword(e){const{node:n,keyword:r,type:i,index:a,modifier:s}=e;const o=[];if(typeof a==="number"){const l=Fg(n.$cstNode,r,a);if(l){o.push(l)}}else{o.push(...aT(n.$cstNode,r))}for(const l of o){this.highlightNode({node:l,type:i,modifier:s})}}highlightNode(e){const{node:n,type:r,modifier:i}=e;const a=n.range;this.highlightToken({range:a,type:r,modifier:i})}}var Vy;(function(t){function e(r,i,a){const s=new Map;Object.entries(i).forEach(([u,c])=>s.set(c,u));let o=0;let l=0;return n(r.data,5).map(u=>{o+=u[0];if(u[0]!==0){l=0}l+=u[1];const c=u[2];const d=a.textDocument.offsetAt({line:o,character:l});return{offset:d,tokenType:s.get(u[3]),tokenModifiers:u[4],text:a.textDocument.getText({start:{line:o,character:l},end:{line:o,character:l+c}})}})}t.decode=e;function n(r,i){const a=[];for(let s=0;s<r.length;s+=i){const o=r.slice(s,s+i);a.push(o)}return a}})(Vy||(Vy={}));function yD(t){const e=[];const n=[];t.forEach(i=>{if(i===null||i===void 0?void 0:i.triggerCharacters){e.push(...i.triggerCharacters)}if(i===null||i===void 0?void 0:i.retriggerCharacters){n.push(...i.retriggerCharacters)}});const r={triggerCharacters:e.length>0?Array.from(new Set(e)).sort():void 0,retriggerCharacters:n.length>0?Array.from(new Set(n)).sort():void 0};return r.triggerCharacters?r:void 0}class gD{constructor(e){this.onInitializeEmitter=new vr.Emitter;this.onInitializedEmitter=new vr.Emitter;this.services=e}get onInitialize(){return this.onInitializeEmitter.event}get onInitialized(){return this.onInitializedEmitter.event}async initialize(e){this.eagerLoadServices();this.fireInitializeOnDefaultServices(e);this.onInitializeEmitter.fire(e);this.onInitializeEmitter.dispose();return this.buildInitializeResult(e)}eagerLoadServices(){sp(this.services);this.services.ServiceRegistry.all.forEach(e=>sp(e))}hasService(e){const n=this.services.ServiceRegistry.all;return n.some(r=>e(r)!==void 0)}buildInitializeResult(e){var n,r,i,a;const s=this.services.lsp.DocumentUpdateHandler;const o=(n=this.services.lsp.FileOperationHandler)===null||n===void 0?void 0:n.fileOperationOptions;const l=this.services.ServiceRegistry.all;const u=this.hasService(F=>{var N;return(N=F.lsp)===null||N===void 0?void 0:N.Formatter});const c=l.map(F=>{var N,re;return(re=(N=F.lsp)===null||N===void 0?void 0:N.Formatter)===null||re===void 0?void 0:re.formatOnTypeOptions}).find(F=>Boolean(F));const d=this.hasService(F=>{var N;return(N=F.lsp)===null||N===void 0?void 0:N.CodeActionProvider});const f=this.hasService(F=>{var N;return(N=F.lsp)===null||N===void 0?void 0:N.SemanticTokenProvider});const p=pD(l.map(F=>{var N,re;return(re=(N=F.lsp)===null||N===void 0?void 0:N.SemanticTokenProvider)===null||re===void 0?void 0:re.semanticTokensOptions}));const y=(i=(r=this.services.lsp)===null||r===void 0?void 0:r.ExecuteCommandHandler)===null||i===void 0?void 0:i.commands;const v=this.hasService(F=>{var N;return(N=F.lsp)===null||N===void 0?void 0:N.DocumentLinkProvider});const k=yD(l.map(F=>{var N,re;return(re=(N=F.lsp)===null||N===void 0?void 0:N.SignatureHelp)===null||re===void 0?void 0:re.signatureHelpOptions}));const $=this.hasService(F=>{var N;return(N=F.lsp)===null||N===void 0?void 0:N.TypeProvider});const E=this.hasService(F=>{var N;return(N=F.lsp)===null||N===void 0?void 0:N.ImplementationProvider});const C=this.hasService(F=>{var N;return(N=F.lsp)===null||N===void 0?void 0:N.CompletionProvider});const I=tD(l.map(F=>{var N,re;return(re=(N=F.lsp)===null||N===void 0?void 0:N.CompletionProvider)===null||re===void 0?void 0:re.completionOptions}));const X=this.hasService(F=>{var N;return(N=F.lsp)===null||N===void 0?void 0:N.ReferencesProvider});const q=this.hasService(F=>{var N;return(N=F.lsp)===null||N===void 0?void 0:N.DocumentSymbolProvider});const J=this.hasService(F=>{var N;return(N=F.lsp)===null||N===void 0?void 0:N.DefinitionProvider});const ne=this.hasService(F=>{var N;return(N=F.lsp)===null||N===void 0?void 0:N.DocumentHighlightProvider});const ae=this.hasService(F=>{var N;return(N=F.lsp)===null||N===void 0?void 0:N.FoldingRangeProvider});const de=this.hasService(F=>{var N;return(N=F.lsp)===null||N===void 0?void 0:N.HoverProvider});const L=this.hasService(F=>{var N;return(N=F.lsp)===null||N===void 0?void 0:N.RenameProvider});const w=this.hasService(F=>{var N;return(N=F.lsp)===null||N===void 0?void 0:N.CallHierarchyProvider});const g=this.hasService(F=>{var N;return(N=F.lsp)===null||N===void 0?void 0:N.TypeHierarchyProvider});const b=this.hasService(F=>{var N;return(N=F.lsp)===null||N===void 0?void 0:N.CodeLensProvider});const M=this.hasService(F=>{var N;return(N=F.lsp)===null||N===void 0?void 0:N.DeclarationProvider});const O=this.hasService(F=>{var N;return(N=F.lsp)===null||N===void 0?void 0:N.InlayHintProvider});const x=(a=this.services.lsp)===null||a===void 0?void 0:a.WorkspaceSymbolProvider;const we={capabilities:{workspace:{workspaceFolders:{supported:true},fileOperations:o},executeCommandProvider:y&&{commands:y},textDocumentSync:{change:vr.TextDocumentSyncKind.Incremental,openClose:true,save:Boolean(s.didSaveDocument),willSave:Boolean(s.willSaveDocument),willSaveWaitUntil:Boolean(s.willSaveDocumentWaitUntil)},completionProvider:C?I:void 0,referencesProvider:X,documentSymbolProvider:q,definitionProvider:J,typeDefinitionProvider:$,documentHighlightProvider:ne,codeActionProvider:d,documentFormattingProvider:u,documentRangeFormattingProvider:u,documentOnTypeFormattingProvider:c,foldingRangeProvider:ae,hoverProvider:de,renameProvider:L?{prepareProvider:true}:void 0,semanticTokensProvider:f?p:void 0,signatureHelpProvider:k,implementationProvider:E,callHierarchyProvider:w?{}:void 0,typeHierarchyProvider:g?{}:void 0,documentLinkProvider:v?{resolveProvider:false}:void 0,codeLensProvider:b?{resolveProvider:false}:void 0,declarationProvider:M,inlayHintProvider:O?{resolveProvider:false}:void 0,workspaceSymbolProvider:x?{resolveProvider:Boolean(x.resolveSymbol)}:void 0}};return we}initialized(e){this.fireInitializedOnDefaultServices(e);this.onInitializedEmitter.fire(e);this.onInitializedEmitter.dispose()}fireInitializeOnDefaultServices(e){this.services.workspace.ConfigurationProvider.initialize(e);this.services.workspace.WorkspaceManager.initialize(e)}fireInitializedOnDefaultServices(e){const n=this.services.lsp.Connection;const r=n?Object.assign(Object.assign({},e),{register:i=>n.client.register(vr.DidChangeConfigurationNotification.type,i),fetchConfiguration:i=>n.workspace.getConfiguration(i)}):e;this.services.workspace.ConfigurationProvider.initialized(r).catch(i=>console.error("Error in ConfigurationProvider initialization:",i));this.services.workspace.WorkspaceManager.initialized(e).catch(i=>console.error("Error in WorkspaceManager initialization:",i))}}function RD(t){const e=t.lsp.Connection;if(!e){throw new Error("Starting a language server requires the languageServer.Connection service to be set.")}vD(e,t);$D(e,t);TD(e,t);ED(e,t);wD(e,t);AD(e,t);SD(e,t);kD(e,t);bD(e,t);PD(e,t);DD(e,t);OD(e,t);CD(e,t);ID(e,t);_D(e,t);LD(e,t);xD(e,t);KD(e,t);UD(e,t);qD(e,t);jD(e,t);GD(e,t);FD(e,t);MD(e,t);ND(e,t);HD(e,t);e.onInitialize(r=>{return t.lsp.LanguageServer.initialize(r)});e.onInitialized(r=>{t.lsp.LanguageServer.initialized(r)});const n=t.workspace.TextDocuments;n.listen(e);e.listen()}function vD(t,e){const n=e.lsp.DocumentUpdateHandler;const r=e.workspace.TextDocuments;if(n.didOpenDocument){r.onDidOpen(i=>n.didOpenDocument(i))}if(n.didChangeContent){r.onDidChangeContent(i=>n.didChangeContent(i))}if(n.didCloseDocument){r.onDidClose(i=>n.didCloseDocument(i))}if(n.didSaveDocument){r.onDidSave(i=>n.didSaveDocument(i))}if(n.willSaveDocument){r.onWillSave(i=>n.willSaveDocument(i))}if(n.willSaveDocumentWaitUntil){r.onWillSaveWaitUntil(i=>n.willSaveDocumentWaitUntil(i))}if(n.didChangeWatchedFiles){t.onDidChangeWatchedFiles(i=>n.didChangeWatchedFiles(i))}}function $D(t,e){const n=e.lsp.FileOperationHandler;if(!n){return}if(n.didCreateFiles){t.workspace.onDidCreateFiles(r=>n.didCreateFiles(r))}if(n.didRenameFiles){t.workspace.onDidRenameFiles(r=>n.didRenameFiles(r))}if(n.didDeleteFiles){t.workspace.onDidDeleteFiles(r=>n.didDeleteFiles(r))}if(n.willCreateFiles){t.workspace.onWillCreateFiles(r=>n.willCreateFiles(r))}if(n.willRenameFiles){t.workspace.onWillRenameFiles(r=>n.willRenameFiles(r))}if(n.willDeleteFiles){t.workspace.onWillDeleteFiles(r=>n.willDeleteFiles(r))}}function TD(t,e){const n=e.workspace.DocumentBuilder;n.onUpdate(async(r,i)=>{for(const a of i){t.sendDiagnostics({uri:a.toString(),diagnostics:[]})}});n.onDocumentPhase(z.Validated,async r=>{if(r.diagnostics){t.sendDiagnostics({uri:r.uri.toString(),diagnostics:r.diagnostics})}})}function ED(t,e){t.onCompletion(ut((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.CompletionProvider)===null||o===void 0?void 0:o.getCompletion(r,i,a)},e,z.IndexedReferences))}function wD(t,e){t.onReferences(ut((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.ReferencesProvider)===null||o===void 0?void 0:o.findReferences(r,i,a)},e,z.IndexedReferences))}function CD(t,e){t.onCodeAction(ut((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.CodeActionProvider)===null||o===void 0?void 0:o.getCodeActions(r,i,a)},e,z.Validated))}function AD(t,e){t.onDocumentSymbol(ut((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.DocumentSymbolProvider)===null||o===void 0?void 0:o.getSymbols(r,i,a)},e,z.Parsed))}function SD(t,e){t.onDefinition(ut((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.DefinitionProvider)===null||o===void 0?void 0:o.getDefinition(r,i,a)},e,z.IndexedReferences))}function kD(t,e){t.onTypeDefinition(ut((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.TypeProvider)===null||o===void 0?void 0:o.getTypeDefinition(r,i,a)},e,z.IndexedReferences))}function bD(t,e){t.onImplementation(ut((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.ImplementationProvider)===null||o===void 0?void 0:o.getImplementation(r,i,a)},e,z.IndexedReferences))}function ND(t,e){t.onDeclaration(ut((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.DeclarationProvider)===null||o===void 0?void 0:o.getDeclaration(r,i,a)},e,z.IndexedReferences))}function PD(t,e){t.onDocumentHighlight(ut((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.DocumentHighlightProvider)===null||o===void 0?void 0:o.getDocumentHighlight(r,i,a)},e,z.IndexedReferences))}function _D(t,e){t.onHover(ut((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.HoverProvider)===null||o===void 0?void 0:o.getHoverContent(r,i,a)},e,z.IndexedReferences))}function DD(t,e){t.onFoldingRanges(ut((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.FoldingRangeProvider)===null||o===void 0?void 0:o.getFoldingRanges(r,i,a)},e,z.Parsed))}function OD(t,e){t.onDocumentFormatting(ut((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.Formatter)===null||o===void 0?void 0:o.formatDocument(r,i,a)},e,z.Parsed));t.onDocumentRangeFormatting(ut((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.Formatter)===null||o===void 0?void 0:o.formatDocumentRange(r,i,a)},e,z.Parsed));t.onDocumentOnTypeFormatting(ut((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.Formatter)===null||o===void 0?void 0:o.formatDocumentOnType(r,i,a)},e,z.Parsed))}function ID(t,e){t.onRenameRequest(ut((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.RenameProvider)===null||o===void 0?void 0:o.rename(r,i,a)},e,z.IndexedReferences));t.onPrepareRename(ut((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.RenameProvider)===null||o===void 0?void 0:o.prepareRename(r,i,a)},e,z.IndexedReferences))}function LD(t,e){t.languages.inlayHint.on(xn((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.InlayHintProvider)===null||o===void 0?void 0:o.getInlayHints(r,i,a)},e,z.IndexedReferences))}function xD(t,e){const n={data:[]};t.languages.semanticTokens.on(xn((r,i,a,s)=>{var o;if((o=r.lsp)===null||o===void 0?void 0:o.SemanticTokenProvider){return r.lsp.SemanticTokenProvider.semanticHighlight(i,a,s)}return n},e,z.IndexedReferences));t.languages.semanticTokens.onDelta(xn((r,i,a,s)=>{var o;if((o=r.lsp)===null||o===void 0?void 0:o.SemanticTokenProvider){return r.lsp.SemanticTokenProvider.semanticHighlightDelta(i,a,s)}return n},e,z.IndexedReferences));t.languages.semanticTokens.onRange(xn((r,i,a,s)=>{var o;if((o=r.lsp)===null||o===void 0?void 0:o.SemanticTokenProvider){return r.lsp.SemanticTokenProvider.semanticHighlightRange(i,a,s)}return n},e,z.IndexedReferences))}function MD(t,e){t.onDidChangeConfiguration(n=>{if(n.settings){e.workspace.ConfigurationProvider.updateConfiguration(n)}})}function KD(t,e){const n=e.lsp.ExecuteCommandHandler;if(n){t.onExecuteCommand(async(r,i)=>{var a;try{return await n.executeCommand(r.command,(a=r.arguments)!==null&&a!==void 0?a:[],i)}catch(s){return Gn(s)}})}}function FD(t,e){t.onDocumentLinks(xn((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.DocumentLinkProvider)===null||o===void 0?void 0:o.getDocumentLinks(r,i,a)},e,z.Parsed))}function UD(t,e){t.onSignatureHelp(xn((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.SignatureHelp)===null||o===void 0?void 0:o.provideSignatureHelp(r,i,a)},e,z.IndexedReferences))}function GD(t,e){t.onCodeLens(xn((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.CodeLensProvider)===null||o===void 0?void 0:o.provideCodeLens(r,i,a)},e,z.IndexedReferences))}function HD(t,e){var n;const r=e.lsp.WorkspaceSymbolProvider;if(r){const i=e.workspace.DocumentBuilder;t.onWorkspaceSymbol(async(s,o)=>{try{await i.waitUntil(z.IndexedContent,o);return await r.getSymbols(s,o)}catch(l){return Gn(l)}});const a=(n=r.resolveSymbol)===null||n===void 0?void 0:n.bind(r);if(a){t.onWorkspaceSymbolResolve(async(s,o)=>{try{await i.waitUntil(z.IndexedContent,o);return await a(s,o)}catch(l){return Gn(l)}})}}}function qD(t,e){t.languages.callHierarchy.onPrepare(xn(async(n,r,i,a)=>{var s;if((s=n.lsp)===null||s===void 0?void 0:s.CallHierarchyProvider){const o=await n.lsp.CallHierarchyProvider.prepareCallHierarchy(r,i,a);return o!==null&&o!==void 0?o:null}return null},e,z.IndexedReferences));t.languages.callHierarchy.onIncomingCalls(Uu(async(n,r,i)=>{var a;if((a=n.lsp)===null||a===void 0?void 0:a.CallHierarchyProvider){const s=await n.lsp.CallHierarchyProvider.incomingCalls(r,i);return s!==null&&s!==void 0?s:null}return null},e));t.languages.callHierarchy.onOutgoingCalls(Uu(async(n,r,i)=>{var a;if((a=n.lsp)===null||a===void 0?void 0:a.CallHierarchyProvider){const s=await n.lsp.CallHierarchyProvider.outgoingCalls(r,i);return s!==null&&s!==void 0?s:null}return null},e))}function jD(t,e){if(!e.ServiceRegistry.all.some(n=>{var r;return(r=n.lsp)===null||r===void 0?void 0:r.TypeHierarchyProvider})){return}t.languages.typeHierarchy.onPrepare(xn(async(n,r,i,a)=>{var s,o;const l=await((o=(s=n.lsp)===null||s===void 0?void 0:s.TypeHierarchyProvider)===null||o===void 0?void 0:o.prepareTypeHierarchy(r,i,a));return l!==null&&l!==void 0?l:null},e,z.IndexedReferences));t.languages.typeHierarchy.onSupertypes(Uu(async(n,r,i)=>{var a,s;const o=await((s=(a=n.lsp)===null||a===void 0?void 0:a.TypeHierarchyProvider)===null||s===void 0?void 0:s.supertypes(r,i));return o!==null&&o!==void 0?o:null},e));t.languages.typeHierarchy.onSubtypes(Uu(async(n,r,i)=>{var a,s;const o=await((s=(a=n.lsp)===null||a===void 0?void 0:a.TypeHierarchyProvider)===null||s===void 0?void 0:s.subtypes(r,i));return o!==null&&o!==void 0?o:null},e))}function Uu(t,e){const n=e.ServiceRegistry;return async(r,i)=>{const a=lt.parse(r.item.uri);const s=await tm(e,i,a,z.IndexedReferences);if(s){return s}if(!n.hasServices(a)){const l=`Could not find service instance for uri: '${a}'`;console.debug(l);return Gn(new Error(l))}const o=n.getServices(a);try{return await t(o,r,i)}catch(l){return Gn(l)}}}function xn(t,e,n){const r=e.workspace.LangiumDocuments;const i=e.ServiceRegistry;return async(a,s)=>{const o=lt.parse(a.textDocument.uri);const l=await tm(e,s,o,n);if(l){return l}if(!i.hasServices(o)){const c=`Could not find service instance for uri: '${o}'`;console.debug(c);return Gn(new Error(c))}const u=i.getServices(o);try{const c=await r.getOrCreateDocument(o);return await t(u,c,a,s)}catch(c){return Gn(c)}}}function ut(t,e,n){const r=e.workspace.LangiumDocuments;const i=e.ServiceRegistry;return async(a,s)=>{const o=lt.parse(a.textDocument.uri);const l=await tm(e,s,o,n);if(l){return l}if(!i.hasServices(o)){console.debug(`Could not find service instance for uri: '${o.toString()}'`);return null}const u=i.getServices(o);try{const c=await r.getOrCreateDocument(o);return await t(u,c,a,s)}catch(c){return Gn(c)}}}async function tm(t,e,n,r){if(r!==void 0){const i=t.workspace.DocumentBuilder;try{await i.waitUntil(r,n,e)}catch(a){return Gn(a)}}return void 0}function Gn(t){if(ds(t)){return new vr.ResponseError(vr.LSPErrorCodes.RequestCancelled,"The request has been cancelled.")}if(t instanceof vr.ResponseError){return t}throw t}class f${getSymbolKind(e){return U.SymbolKind.Field}getCompletionItemKind(e){return U.CompletionItemKind.Reference}}class BD{constructor(e){this.nameProvider=e.references.NameProvider;this.references=e.references.References;this.grammarConfig=e.parser.GrammarConfig}findReferences(e,n,r){const i=e.parseResult.value.$cstNode;if(!i){return[]}const a=Er(i,e.textDocument.offsetAt(n.position),this.grammarConfig.nameRegexp);if(!a){return[]}return this.getReferences(a,n,e)}getReferences(e,n,r){const i=[];const a=this.references.findDeclaration(e);if(a){const s={includeDeclaration:n.context.includeDeclaration};this.references.findReferences(a,s).forEach(o=>{i.push(U.Location.create(o.sourceUri.toString(),o.segment.range))})}return i}}class WD{constructor(e){this.references=e.references.References;this.nameProvider=e.references.NameProvider;this.grammarConfig=e.parser.GrammarConfig}async rename(e,n,r){const i={};const a=e.parseResult.value.$cstNode;if(!a)return void 0;const s=e.textDocument.offsetAt(n.position);const o=Er(a,s,this.grammarConfig.nameRegexp);if(!o)return void 0;const l=this.references.findDeclaration(o);if(!l)return void 0;const u={onlyLocal:false,includeDeclaration:true};const c=this.references.findReferences(l,u);c.forEach(d=>{const f=Jt.replace(d.segment.range,n.newName);const p=d.sourceUri.toString();if(i[p]){i[p].push(f)}else{i[p]=[f]}});return{changes:i}}prepareRename(e,n,r){return this.renameNodeRange(e,n.position)}renameNodeRange(e,n){const r=e.parseResult.value.$cstNode;const i=e.textDocument.offsetAt(n);if(r&&i){const a=Er(r,i,this.grammarConfig.nameRegexp);if(!a){return void 0}const s=this.references.findDeclaration(a);if(s||this.isNameNode(a)){return a.range}}return void 0}isNameNode(e){return(e===null||e===void 0?void 0:e.astNode)&&Nv(e.astNode)&&e===this.nameProvider.getNameNode(e.astNode)}}class VD{constructor(e){this.indexManager=e.workspace.IndexManager;this.nodeKindProvider=e.lsp.NodeKindProvider;this.fuzzyMatcher=e.lsp.FuzzyMatcher}async getSymbols(e,n=ye.CancellationToken.None){const r=[];const i=e.query.toLowerCase();for(const a of this.indexManager.allElements()){await ht(n);if(this.fuzzyMatcher.match(i,a.name)){const s=this.getWorkspaceSymbol(a);if(s){r.push(s)}}}return r}getWorkspaceSymbol(e){const n=e.nameSegment;if(n){return{kind:this.nodeKindProvider.getSymbolKind(e),name:e.name,location:{range:n.range,uri:e.documentUri.toString()}}}else{return void 0}}}class zD{constructor(e){this._configuration=e;this._syncedDocuments=new Map;this._onDidChangeContent=new U.Emitter;this._onDidOpen=new U.Emitter;this._onDidClose=new U.Emitter;this._onDidSave=new U.Emitter;this._onWillSave=new U.Emitter}get onDidOpen(){return this._onDidOpen.event}get onDidChangeContent(){return this._onDidChangeContent.event}get onWillSave(){return this._onWillSave.event}onWillSaveWaitUntil(e){this._willSaveWaitUntil=e}get onDidSave(){return this._onDidSave.event}get onDidClose(){return this._onDidClose.event}get(e){return this._syncedDocuments.get(Ge.normalize(e))}set(e){const n=Ge.normalize(e.uri);let r=true;if(this._syncedDocuments.has(n)){r=false}this._syncedDocuments.set(n,e);const i=Object.freeze({document:e});this._onDidOpen.fire(i);this._onDidChangeContent.fire(i);return r}delete(e){const n=Ge.normalize(typeof e==="object"&&"uri"in e?e.uri:e);const r=this._syncedDocuments.get(n);if(r!==void 0){this._syncedDocuments.delete(n);this._onDidClose.fire(Object.freeze({document:r}))}}all(){return Array.from(this._syncedDocuments.values())}keys(){return Array.from(this._syncedDocuments.keys())}listen(e){e.__textDocumentSync=U.TextDocumentSyncKind.Incremental;const n=[];n.push(e.onDidOpenTextDocument(r=>{const i=r.textDocument;const a=Ge.normalize(i.uri);const s=this._configuration.create(a,i.languageId,i.version,i.text);this._syncedDocuments.set(a,s);const o=Object.freeze({document:s});this._onDidOpen.fire(o);this._onDidChangeContent.fire(o)}));n.push(e.onDidChangeTextDocument(r=>{const i=r.textDocument;const a=r.contentChanges;if(a.length===0){return}const{version:s}=i;if(s===null||s===void 0){throw new Error(`Received document change event for ${i.uri} without valid version identifier`)}const o=Ge.normalize(i.uri);let l=this._syncedDocuments.get(o);if(l!==void 0){l=this._configuration.update(l,a,s);this._syncedDocuments.set(o,l);this._onDidChangeContent.fire(Object.freeze({document:l}))}}));n.push(e.onDidCloseTextDocument(r=>{const i=Ge.normalize(r.textDocument.uri);const a=this._syncedDocuments.get(i);if(a!==void 0){this._syncedDocuments.delete(i);this._onDidClose.fire(Object.freeze({document:a}))}}));n.push(e.onWillSaveTextDocument(r=>{const i=this._syncedDocuments.get(Ge.normalize(r.textDocument.uri));if(i!==void 0){this._onWillSave.fire(Object.freeze({document:i,reason:r.reason}))}}));n.push(e.onWillSaveTextDocumentWaitUntil((r,i)=>{const a=this._syncedDocuments.get(Ge.normalize(r.textDocument.uri));if(a!==void 0&&this._willSaveWaitUntil){return this._willSaveWaitUntil(Object.freeze({document:a,reason:r.reason}),i)}else{return[]}}));n.push(e.onDidSaveTextDocument(r=>{const i=this._syncedDocuments.get(Ge.normalize(r.textDocument.uri));if(i!==void 0){this._onDidSave.fire(Object.freeze({document:i}))}}));return U.Disposable.create(()=>{n.forEach(r=>r.dispose())})}}function YD(t){return Mu.merge(zv(t),XD(t))}function XD(t){return{lsp:{CompletionProvider:e=>new c$(e),DocumentSymbolProvider:e=>new iD(e),HoverProvider:e=>new cD(e),FoldingRangeProvider:e=>new aD(e),ReferencesProvider:e=>new BD(e),DefinitionProvider:e=>new nD(e),DocumentHighlightProvider:e=>new rD(e),RenameProvider:e=>new WD(e)},shared:()=>t.shared}}function JD(t){return Mu.merge(Yv(t),QD(t))}function QD(t){return{lsp:{Connection:()=>t.connection,LanguageServer:e=>new gD(e),DocumentUpdateHandler:e=>new d$(e),WorkspaceSymbolProvider:e=>new VD(e),NodeKindProvider:()=>new f$,FuzzyMatcher:()=>new sD},workspace:{TextDocuments:()=>new zD(Iu)}}}var Mc;var zy;function ZD(){if(zy)return Mc;zy=1;Mc=o$();return Mc}var nm=ZD();const Kc="AllocateAttribute";const Yy="Condition";const Xy="DataSpecificationDataListEntry";const Fc="DeclarationAttribute";const Uc="Directives";const Gc="DoType2";const Jy="EntryDescription";const Qy="Expression";const Zy="FormatItem";const Hc="GetStatement";const qc="InitialAttributeItem";const jc="InitialAttributeSpecificationIteration";const Ea="NamedElement";function eg(t){return Le.isInstance(t,Ea)}const Bc="NamedType";const tg="OptionsItem";const Wc="OrdinalType";const Kr="PackageLevelStatements";const Vc="ProcedureLevelStatement";const zc="PutStatement";const ng="TopLevelStatement";const Fr="Unit";const Vs="AddExpression";const zs="AFormatItem";const Ys="AllocateDimension";const Yc="AllocatedVariable";const Xs="AllocateLocationReference";const Js="AllocateStatement";const Qs="AllocateType";const Zs="AssertStatement";const eo="AssignmentStatement";const to="AttachStatement";const no="BeginStatement";const ro="BFormatItem";const io="BitAndExpression";const ao="BitOrExpression";const Xc="Bound";const so="CallStatement";const oo="CancelThreadStatement";const lo="CFormatItem";const uo="CloseStatement";const co="CMPATOptionsItem";const fo="ColumnFormatItem";const po="CompExpression";const Jc="CompilerOptions";const wa="ComputationDataAttribute";function eO(t){return Le.isInstance(t,wa)}const mo="ConcatExpression";const Qc="ConditionPrefix";const Zc="ConditionPrefixItem";const ed="DataSpecificationDataList";const ho="DataSpecificationDataListItem";const yo="DataSpecificationDataListItem3DO";const td="DataSpecificationOptions";const go="DateAttribute";const nd="DeclaredItem";const Ca="DeclaredVariable";function ei(t){return Le.isInstance(t,Ca)}const Aa="DeclareStatement";function tO(t){return Le.isInstance(t,Aa)}const rd="DefaultAttributeExpression";const id="DefaultAttributeExpressionNot";const ad="DefaultExpression";const sd="DefaultExpressionPart";const od="DefaultRangeIdentifierItem";const ld="DefaultRangeIdentifiers";const Ro="DefaultStatement";const Sa="DefineAliasStatement";function nO(t){return Le.isInstance(t,Sa)}const vo="DefinedAttribute";const $o="DefineOrdinalStatement";const To="DefineStructureStatement";const Eo="DelayStatement";const wo="DeleteStatement";const Co="DetachStatement";const ud="DimensionBound";const cd="Dimensions";const Ao="DimensionsDataAttribute";const So="DisplayStatement";const dd="DoSpecification";const qi="DoStatement";const ka="DoType3Variable";function p$(t){return Le.isInstance(t,ka)}const ko="DoUntil";const bo="DoWhile";const No="EFormatItem";const Ql="EndStatement";function rO(t){return Le.isInstance(t,Ql)}const ba="EntryAttribute";function iO(t){return Le.isInstance(t,ba)}const Po="EntryParameterDescription";const _o="EntryStatement";const Do="EntryUnionDescription";const Oo="EnvironmentAttribute";const fd="EnvironmentAttributeItem";const Io="ExecStatement";const rg="ExitStatement";const Lo="ExpExpression";const pd="Exports";const md="FetchEntry";const xo="FetchStatement";const Mo="FFormatItem";const Ko="FileReferenceCondition";const Fo="FlushStatement";const hd="FormatList";const yd="FormatListItem";const gd="FormatListItemLevel";const Uo="FormatStatement";const Go="FreeStatement";const Ho="GetFileStatement";const qo="GetStringStatement";const jo="GFormatItem";const Bo="GoToStatement";const Wo="HandleAttribute";const Vo="IfStatement";const Na="IncludeDirective";function aO(t){return Le.isInstance(t,Na)}const Rd="IncludeItem";const vd="InitAcrossExpression";const zo="InitialAttribute";const Yo="InitialAttributeExpression";const ig="InitialAttributeItemStar";const Xo="InitialAttributeSpecification";const Jo="InitialAttributeSpecificationIterationValue";const $d="InitialToContent";const Qo="IterateStatement";const Zo="KeywordCondition";const Pa="LabelPrefix";function Xa(t){return Le.isInstance(t,Pa)}const Zl="LabelReference";function sO(t){return Le.isInstance(t,Zl)}const el="LeaveStatement";const ag="LFormatItem";const tl="LikeAttribute";const nl="LineDirective";const rl="LineFormatItem";const il="LinkageOptionsItem";const _a="Literal";function oO(t){return Le.isInstance(t,_a)}const al="LocateStatement";const sl="LocatorCall";const eu="MemberCall";function lO(t){return Le.isInstance(t,eu)}const ol="MultExpression";const ll="NamedCondition";const ul="NoMapOptionsItem";const sg="NoPrintDirective";const cl="NoteDirective";const og="NullStatement";const tu="NumberLiteral";function uO(t){return Le.isInstance(t,tu)}const dl="OnStatement";const Td="OpenOptionsGroup";const fl="OpenStatement";const Ed="Options";const pl="OrdinalTypeAttribute";const wd="OrdinalValue";const Cd="OrdinalValueList";const Ad="OtherwiseStatement";const Da="Package";function lg(t){return Le.isInstance(t,Da)}const ug="PageDirective";const cg="PageFormatItem";const ml="PFormatItem";const hl="PictureAttribute";const Sd="PliProgram";const dg="PopDirective";const kd="PrefixedAttribute";const fg="PrintDirective";const nu="ProcedureCall";function cO(t){return Le.isInstance(t,nu)}const ru="ProcedureParameter";function dO(t){return Le.isInstance(t,ru)}const Gr="ProcedureStatement";function un(t){return Le.isInstance(t,Gr)}const yl="ProcessDirective";const gl="ProcincDirective";const pg="PushDirective";const Rl="PutFileStatement";const bd="PutItem";const vl="PutStringStatement";const $l="QualifyStatement";const Tl="ReadStatement";const iu="ReferenceItem";function fO(t){return Le.isInstance(t,iu)}const El="ReinitStatement";const wl="ReleaseStatement";const Nd="Reserves";const mg="ResignalStatement";const Cl="ReturnsAttribute";const Pd="ReturnsOption";const Al="ReturnStatement";const Sl="RevertStatement";const kl="RewriteStatement";const bl="RFormatItem";const Nl="SelectStatement";const Pl="SignalStatement";const Oa="SimpleOptionsItem";function pO(t){return Le.isInstance(t,Oa)}const _l="SkipDirective";const Dl="SkipFormatItem";const Ia="Statement";function mO(t){return Le.isInstance(t,Ia)}const hg="StopStatement";const au="StringLiteral";function hO(t){return Le.isInstance(t,au)}const _d="SubStructure";const Ol="TypeAttribute";const Il="UnaryExpression";const Ll="ValueAttribute";const Dd="ValueAttributeItem";const xl="ValueListAttribute";const Ml="ValueListFromAttribute";const Kl="ValueRangeAttribute";const yg="VFormatItem";const Fl="WaitStatement";const Od="WhenStatement";const Ul="WriteStatement";const Gl="XFormatItem";const Hl="DoType3";class m$ extends vg{getAllTypes(){return[zs,Vs,Kc,Ys,Xs,Js,Qs,Yc,Zs,eo,to,ro,no,io,ao,Xc,lo,co,so,oo,uo,fo,po,Jc,wa,mo,Yy,Qc,Zc,ed,Xy,ho,yo,td,go,Fc,Aa,nd,Ca,rd,id,ad,sd,od,ld,Ro,Sa,$o,To,vo,Eo,wo,Co,ud,cd,Ao,Uc,So,dd,qi,Gc,Hl,ka,ko,bo,No,Ql,ba,Jy,Po,_o,Do,Oo,fd,Io,rg,Lo,pd,Qy,Mo,md,xo,Ko,Fo,Zy,hd,yd,gd,Uo,Go,jo,Ho,Hc,qo,Bo,Wo,Vo,Na,Rd,vd,zo,Yo,qc,ig,Xo,jc,Jo,$d,Qo,Zo,ag,Pa,Zl,el,tl,nl,rl,il,_a,al,sl,eu,ol,ll,Ea,Bc,ul,sg,cl,og,tu,dl,Td,fl,Ed,tg,Wc,pl,wd,Cd,Ad,ml,Da,Kr,ug,cg,hl,Sd,dg,kd,fg,nu,Vc,ru,Gr,yl,gl,pg,Rl,bd,zc,vl,$l,bl,Tl,iu,El,wl,Nd,mg,Al,Cl,Pd,Sl,kl,Nl,Pl,Oa,_l,Dl,Ia,hg,au,_d,ng,Ol,Il,Fr,yg,Ll,Dd,xl,Ml,Kl,Fl,Od,Ul,Gl]}computeIsSubtype(e,n){switch(e){case Vs:case io:case ao:case po:case mo:case Lo:case _a:case sl:case ol:case Il:{return this.isSubtype(Qy,n)}case zs:case ro:case lo:case fo:case No:case Mo:case jo:case ag:case rl:case cg:case ml:case bl:case Dl:case yg:case Gl:{return this.isSubtype(Zy,n)}case Ys:case Xs:case Qs:{return this.isSubtype(Kc,n)}case Js:case Zs:case eo:case to:case no:case so:case oo:case uo:case Eo:case wo:case Co:case So:case qi:case _o:case Io:case rg:case xo:case Fo:case Uo:case Go:case Hc:case Bo:case Vo:case Qo:case el:case al:case og:case dl:case fl:case zc:case $l:case Tl:case El:case wl:case mg:case Al:case Sl:case kl:case Nl:case Pl:case hg:case Fl:case Ul:{return this.isSubtype(Fr,n)}case co:case il:case ul:case Oa:{return this.isSubtype(tg,n)}case wa:case go:case vo:case Ao:case ba:case Oo:case Wo:case tl:case pl:case hl:case Cl:case Ol:case Ll:case xl:case Ml:case Kl:{return this.isSubtype(Fc,n)}case ho:case yo:{return this.isSubtype(Xy,n)}case Ca:case ka:{return this.isSubtype(Ea,n)}case Aa:case Ro:case To:{return this.isSubtype(Kr,n)||this.isSubtype(Fr,n)}case Sa:{return this.isSubtype(Bc,n)||this.isSubtype(Kr,n)||this.isSubtype(Fr,n)}case $o:{return this.isSubtype(Wc,n)||this.isSubtype(Kr,n)||this.isSubtype(Fr,n)}case Uc:case Da:case Kr:{return this.isSubtype(ng,n)}case Gc:case Hl:{return this.isSubtype(qi,n)}case ko:case bo:{return this.isSubtype(Gc,n)}case Po:case Do:{return this.isSubtype(Jy,n)}case Ko:case Zo:case ll:{return this.isSubtype(Yy,n)}case Ho:case qo:{return this.isSubtype(Hc,n)}case Na:case nl:case sg:case cl:case ug:case dg:case fg:case yl:case gl:case pg:case _l:{return this.isSubtype(Uc,n)||this.isSubtype(Fr,n)}case zo:{return this.isSubtype(Kc,n)||this.isSubtype(Fc,n)}case Yo:case ig:{return this.isSubtype(qc,n)||this.isSubtype(jc,n)}case Xo:{return this.isSubtype(qc,n)}case Jo:{return this.isSubtype(jc,n)}case Gr:{return this.isSubtype(Ea,n)||this.isSubtype(Kr,n)||this.isSubtype(Vc,n)}case Rl:case vl:{return this.isSubtype(zc,n)}case Ia:{return this.isSubtype(Vc,n)}default:{return false}}}getReferenceType(e){const n=`${e.container.$type}:${e.property}`;switch(n){case"HandleAttribute:type":case"TypeAttribute:type":{return Bc}case"LabelReference:label":{return Pa}case"OrdinalTypeAttribute:type":{return Wc}case"ProcedureCall:procedure":{return Gr}case"ReferenceItem:ref":{return Ea}default:{throw new Error(`${n} is not a valid reference id.`)}}}getTypeMetaData(e){switch(e){case Vs:{return{name:Vs,properties:[{name:"left"},{name:"op"},{name:"right"}]}}case zs:{return{name:zs,properties:[{name:"fieldWidth"}]}}case Ys:{return{name:Ys,properties:[{name:"dimensions"}]}}case Yc:{return{name:Yc,properties:[{name:"attribute"},{name:"level"},{name:"var"}]}}case Xs:{return{name:Xs,properties:[{name:"area"},{name:"locatorVariable"}]}}case Js:{return{name:Js,properties:[{name:"variables",defaultValue:[]}]}}case Qs:{return{name:Qs,properties:[{name:"dimensions"},{name:"type"}]}}case Zs:{return{name:Zs,properties:[{name:"actual"},{name:"compare",defaultValue:false},{name:"displayExpression"},{name:"expected"},{name:"false",defaultValue:false},{name:"operator"},{name:"true",defaultValue:false},{name:"unreachable",defaultValue:false}]}}case eo:{return{name:eo,properties:[{name:"dimacrossExpr"},{name:"expression"},{name:"operator"},{name:"refs",defaultValue:[]}]}}case to:{return{name:to,properties:[{name:"environment",defaultValue:false},{name:"reference"},{name:"task"},{name:"tstack"}]}}case no:{return{name:no,properties:[{name:"end"},{name:"options"},{name:"order",defaultValue:false},{name:"recursive",defaultValue:false},{name:"reorder",defaultValue:false},{name:"statements",defaultValue:[]}]}}case ro:{return{name:ro,properties:[{name:"fieldWidth"}]}}case io:{return{name:io,properties:[{name:"left"},{name:"op"},{name:"right"}]}}case ao:{return{name:ao,properties:[{name:"left"},{name:"op"},{name:"right"}]}}case Xc:{return{name:Xc,properties:[{name:"expression"},{name:"refer"}]}}case so:{return{name:so,properties:[{name:"call"}]}}case oo:{return{name:oo,properties:[{name:"thread"}]}}case lo:{return{name:lo,properties:[{name:"item"}]}}case uo:{return{name:uo,properties:[{name:"files",defaultValue:[]}]}}case co:{return{name:co,properties:[{name:"value"}]}}case fo:{return{name:fo,properties:[{name:"characterPosition"}]}}case po:{return{name:po,properties:[{name:"left"},{name:"op"},{name:"right"}]}}case Jc:{return{name:Jc,properties:[{name:"value"}]}}case wa:{return{name:wa,properties:[{name:"dimensions"},{name:"type"}]}}case mo:{return{name:mo,properties:[{name:"left"},{name:"op"},{name:"right"}]}}case Qc:{return{name:Qc,properties:[{name:"items",defaultValue:[]}]}}case Zc:{return{name:Zc,properties:[{name:"conditions",defaultValue:[]}]}}case ed:{return{name:ed,properties:[{name:"items",defaultValue:[]}]}}case ho:{return{name:ho,properties:[{name:"value"}]}}case yo:{return{name:yo,properties:[{name:"do"},{name:"list"}]}}case td:{return{name:td,properties:[{name:"data",defaultValue:false},{name:"dataList"},{name:"dataListItems",defaultValue:[]},{name:"dataLists",defaultValue:[]},{name:"edit",defaultValue:false},{name:"formatLists",defaultValue:[]}]}}case go:{return{name:go,properties:[{name:"pattern"}]}}case nd:{return{name:nd,properties:[{name:"attributes",defaultValue:[]},{name:"element"},{name:"items",defaultValue:[]},{name:"level"}]}}case Ca:{return{name:Ca,properties:[{name:"name"}]}}case Aa:{return{name:Aa,properties:[{name:"items",defaultValue:[]},{name:"xDeclare",defaultValue:false}]}}case rd:{return{name:rd,properties:[{name:"items",defaultValue:[]},{name:"operators",defaultValue:[]}]}}case id:{return{name:id,properties:[{name:"not",defaultValue:false},{name:"value"}]}}case ad:{return{name:ad,properties:[{name:"attributes",defaultValue:[]},{name:"expression"}]}}case sd:{return{name:sd,properties:[{name:"expression"},{name:"identifiers"}]}}case od:{return{name:od,properties:[{name:"from"},{name:"to"}]}}case ld:{return{name:ld,properties:[{name:"identifiers",defaultValue:[]}]}}case Ro:{return{name:Ro,properties:[{name:"expressions",defaultValue:[]}]}}case Sa:{return{name:Sa,properties:[{name:"attributes",defaultValue:[]},{name:"name"},{name:"xDefine",defaultValue:false}]}}case vo:{return{name:vo,properties:[{name:"position"},{name:"reference"}]}}case $o:{return{name:$o,properties:[{name:"name"},{name:"ordinalValues"},{name:"precision"},{name:"signed",defaultValue:false},{name:"unsigned",defaultValue:false},{name:"xDefine",defaultValue:false}]}}case To:{return{name:To,properties:[{name:"level"},{name:"name"},{name:"substructures",defaultValue:[]},{name:"union",defaultValue:false},{name:"xDefine",defaultValue:false}]}}case Eo:{return{name:Eo,properties:[{name:"delay"}]}}case wo:{return{name:wo,properties:[{name:"file"},{name:"key"}]}}case Co:{return{name:Co,properties:[{name:"reference"}]}}case ud:{return{name:ud,properties:[{name:"bound1"},{name:"bound2"}]}}case cd:{return{name:cd,properties:[{name:"dimensions",defaultValue:[]}]}}case Ao:{return{name:Ao,properties:[{name:"dimensions"}]}}case So:{return{name:So,properties:[{name:"desc",defaultValue:[]},{name:"expression"},{name:"reply"},{name:"rout",defaultValue:[]}]}}case dd:{return{name:dd,properties:[{name:"by"},{name:"downthru"},{name:"exp1"},{name:"repeat"},{name:"to"},{name:"upthru"},{name:"whileOrUntil"}]}}case qi:{return{name:qi,properties:[{name:"end"},{name:"statements",defaultValue:[]}]}}case ka:{return{name:ka,properties:[{name:"name"}]}}case ko:{return{name:ko,properties:[{name:"until"},{name:"while"}]}}case bo:{return{name:bo,properties:[{name:"until"},{name:"while"}]}}case No:{return{name:No,properties:[{name:"fieldWidth"},{name:"fractionalDigits"},{name:"significantDigits"}]}}case Ql:{return{name:Ql,properties:[{name:"label"},{name:"labels",defaultValue:[]}]}}case ba:{return{name:ba,properties:[{name:"attributes",defaultValue:[]},{name:"environmentName",defaultValue:[]},{name:"limited",defaultValue:[]},{name:"options",defaultValue:[]},{name:"returns",defaultValue:[]},{name:"variable",defaultValue:[]}]}}case Po:{return{name:Po,properties:[{name:"attributes",defaultValue:[]},{name:"star",defaultValue:false}]}}case _o:{return{name:_o,properties:[{name:"environmentName",defaultValue:[]},{name:"limited",defaultValue:[]},{name:"options",defaultValue:[]},{name:"parameters",defaultValue:[]},{name:"returns",defaultValue:[]},{name:"variable",defaultValue:[]}]}}case Do:{return{name:Do,properties:[{name:"attributes",defaultValue:[]},{name:"init"},{name:"prefixedAttributes",defaultValue:[]}]}}case Oo:{return{name:Oo,properties:[{name:"items",defaultValue:[]}]}}case fd:{return{name:fd,properties:[{name:"args",defaultValue:[]},{name:"environment"}]}}case Io:{return{name:Io,properties:[{name:"query"}]}}case Lo:{return{name:Lo,properties:[{name:"left"},{name:"op"},{name:"right"}]}}case pd:{return{name:pd,properties:[{name:"all",defaultValue:false},{name:"procedures",defaultValue:[]}]}}case md:{return{name:md,properties:[{name:"name"},{name:"set"},{name:"title"}]}}case xo:{return{name:xo,properties:[{name:"entries",defaultValue:[]}]}}case Mo:{return{name:Mo,properties:[{name:"fieldWidth"},{name:"fractionalDigits"},{name:"scalingFactor"}]}}case Ko:{return{name:Ko,properties:[{name:"fileReference"},{name:"keyword"}]}}case Fo:{return{name:Fo,properties:[{name:"file"}]}}case hd:{return{name:hd,properties:[{name:"items",defaultValue:[]}]}}case yd:{return{name:yd,properties:[{name:"item"},{name:"level"},{name:"list"}]}}case gd:{return{name:gd,properties:[{name:"level"}]}}case Uo:{return{name:Uo,properties:[{name:"list"}]}}case Go:{return{name:Go,properties:[{name:"references",defaultValue:[]}]}}case Ho:{return{name:Ho,properties:[{name:"copy",defaultValue:false},{name:"copyReference"},{name:"dataSpecification"},{name:"file"},{name:"skip",defaultValue:false},{name:"skipExpression"}]}}case qo:{return{name:qo,properties:[{name:"dataSpecification"},{name:"expression"}]}}case jo:{return{name:jo,properties:[{name:"fieldWidth"}]}}case Bo:{return{name:Bo,properties:[{name:"label"}]}}case Wo:{return{name:Wo,properties:[{name:"size"},{name:"type"}]}}case Vo:{return{name:Vo,properties:[{name:"else"},{name:"expression"},{name:"unit"}]}}case Na:{return{name:Na,properties:[{name:"items",defaultValue:[]}]}}case Rd:{return{name:Rd,properties:[{name:"ddname",defaultValue:false},{name:"file"}]}}case vd:{return{name:vd,properties:[{name:"expressions",defaultValue:[]}]}}case zo:{return{name:zo,properties:[{name:"across",defaultValue:false},{name:"call",defaultValue:false},{name:"content"},{name:"direct",defaultValue:false},{name:"expressions",defaultValue:[]},{name:"items",defaultValue:[]},{name:"procedureCall"},{name:"to",defaultValue:false}]}}case Yo:{return{name:Yo,properties:[{name:"expression"}]}}case Xo:{return{name:Xo,properties:[{name:"expression"},{name:"item"},{name:"star",defaultValue:false}]}}case Jo:{return{name:Jo,properties:[{name:"items",defaultValue:[]}]}}case $d:{return{name:$d,properties:[{name:"type"},{name:"varying"}]}}case Qo:{return{name:Qo,properties:[{name:"label"}]}}case Zo:{return{name:Zo,properties:[{name:"keyword"}]}}case Pa:{return{name:Pa,properties:[{name:"name"}]}}case Zl:{return{name:Zl,properties:[{name:"label"}]}}case el:{return{name:el,properties:[{name:"label"}]}}case tl:{return{name:tl,properties:[{name:"reference"}]}}case nl:{return{name:nl,properties:[{name:"file"},{name:"line"}]}}case rl:{return{name:rl,properties:[{name:"lineNumber"}]}}case il:{return{name:il,properties:[{name:"value"}]}}case _a:{return{name:_a,properties:[{name:"multiplier"},{name:"value"}]}}case al:{return{name:al,properties:[{name:"file"},{name:"keyfrom"},{name:"set"},{name:"variable"}]}}case sl:{return{name:sl,properties:[{name:"element"},{name:"handle",defaultValue:false},{name:"pointer",defaultValue:false},{name:"previous"}]}}case eu:{return{name:eu,properties:[{name:"element"},{name:"previous"}]}}case ol:{return{name:ol,properties:[{name:"left"},{name:"op"},{name:"right"}]}}case ll:{return{name:ll,properties:[{name:"name"}]}}case ul:{return{name:ul,properties:[{name:"parameters",defaultValue:[]},{name:"type"}]}}case cl:{return{name:cl,properties:[{name:"code"},{name:"message"}]}}case tu:{return{name:tu,properties:[{name:"value"}]}}case dl:{return{name:dl,properties:[{name:"conditions",defaultValue:[]},{name:"onUnit"},{name:"snap",defaultValue:false},{name:"system",defaultValue:false}]}}case Td:{return{name:Td,properties:[{name:"buffered",defaultValue:false},{name:"direct",defaultValue:false},{name:"file"},{name:"input",defaultValue:false},{name:"keyed",defaultValue:false},{name:"lineSize"},{name:"output",defaultValue:false},{name:"pageSize"},{name:"print",defaultValue:false},{name:"record",defaultValue:false},{name:"sequential",defaultValue:false},{name:"stream",defaultValue:false},{name:"title"},{name:"unbuffered",defaultValue:false},{name:"update",defaultValue:false}]}}case fl:{return{name:fl,properties:[{name:"options",defaultValue:[]}]}}case Ed:{return{name:Ed,properties:[{name:"items",defaultValue:[]}]}}case pl:{return{name:pl,properties:[{name:"byvalue",defaultValue:false},{name:"type"}]}}case wd:{return{name:wd,properties:[{name:"name"},{name:"value"}]}}case Cd:{return{name:Cd,properties:[{name:"members",defaultValue:[]}]}}case Ad:{return{name:Ad,properties:[{name:"unit"}]}}case Da:{return{name:Da,properties:[{name:"end"},{name:"exports"},{name:"name"},{name:"options"},{name:"prefix"},{name:"reserves"},{name:"statements",defaultValue:[]}]}}case ml:{return{name:ml,properties:[{name:"specification"}]}}case hl:{return{name:hl,properties:[{name:"picture"}]}}case Sd:{return{name:Sd,properties:[{name:"statements",defaultValue:[]}]}}case kd:{return{name:kd,properties:[{name:"attribute"},{name:"level"}]}}case nu:{return{name:nu,properties:[{name:"args",defaultValue:[]},{name:"procedure"}]}}case ru:{return{name:ru,properties:[{name:"id"}]}}case Gr:{return{name:Gr,properties:[{name:"end"},{name:"environmentName",defaultValue:[]},{name:"labels",defaultValue:[]},{name:"options",defaultValue:[]},{name:"order",defaultValue:[]},{name:"parameters",defaultValue:[]},{name:"recursive",defaultValue:[]},{name:"returns",defaultValue:[]},{name:"scope",defaultValue:[]},{name:"statements",defaultValue:[]},{name:"xProc",defaultValue:false}]}}case yl:{return{name:yl,properties:[{name:"compilerOptions",defaultValue:[]}]}}case gl:{return{name:gl,properties:[{name:"datasetName"}]}}case Rl:{return{name:Rl,properties:[{name:"items",defaultValue:[]}]}}case bd:{return{name:bd,properties:[{name:"attribute"},{name:"expression"}]}}case vl:{return{name:vl,properties:[{name:"dataSpecification"},{name:"stringExpression"}]}}case $l:{return{name:$l,properties:[{name:"end"},{name:"statements",defaultValue:[]}]}}case Tl:{return{name:Tl,properties:[{name:"fileReference"},{name:"ignore"},{name:"intoRef"},{name:"key"},{name:"keyto"},{name:"set"}]}}case iu:{return{name:iu,properties:[{name:"dimensions"},{name:"ref"}]}}case El:{return{name:El,properties:[{name:"reference"}]}}case wl:{return{name:wl,properties:[{name:"references",defaultValue:[]},{name:"star",defaultValue:false}]}}case Nd:{return{name:Nd,properties:[{name:"all",defaultValue:false},{name:"variables",defaultValue:[]}]}}case Cl:{return{name:Cl,properties:[{name:"attrs",defaultValue:[]}]}}case Pd:{return{name:Pd,properties:[{name:"returnAttribute"}]}}case Al:{return{name:Al,properties:[{name:"expression"}]}}case Sl:{return{name:Sl,properties:[{name:"conditions",defaultValue:[]}]}}case kl:{return{name:kl,properties:[{name:"file"},{name:"from"},{name:"key"}]}}case bl:{return{name:bl,properties:[{name:"labelReference"}]}}case Nl:{return{name:Nl,properties:[{name:"end"},{name:"on"},{name:"statements",defaultValue:[]}]}}case Pl:{return{name:Pl,properties:[{name:"condition",defaultValue:[]}]}}case Oa:{return{name:Oa,properties:[{name:"value"}]}}case _l:{return{name:_l,properties:[{name:"lines"}]}}case Dl:{return{name:Dl,properties:[{name:"skip"}]}}case Ia:{return{name:Ia,properties:[{name:"condition"},{name:"labels",defaultValue:[]},{name:"value"}]}}case au:{return{name:au,properties:[{name:"value"}]}}case _d:{return{name:_d,properties:[{name:"attributes",defaultValue:[]},{name:"level"},{name:"name"}]}}case Ol:{return{name:Ol,properties:[{name:"type"}]}}case Il:{return{name:Il,properties:[{name:"expr"},{name:"op"}]}}case Ll:{return{name:Ll,properties:[{name:"items",defaultValue:[]},{name:"value"}]}}case Dd:{return{name:Dd,properties:[{name:"attributes",defaultValue:[]}]}}case xl:{return{name:xl,properties:[{name:"values",defaultValue:[]}]}}case Ml:{return{name:Ml,properties:[{name:"from"}]}}case Kl:{return{name:Kl,properties:[{name:"values",defaultValue:[]}]}}case Fl:{return{name:Fl,properties:[{name:"task"}]}}case Od:{return{name:Od,properties:[{name:"conditions",defaultValue:[]},{name:"unit"}]}}case Ul:{return{name:Ul,properties:[{name:"fileReference"},{name:"from"},{name:"keyfrom"},{name:"keyto"}]}}case Gl:{return{name:Gl,properties:[{name:"width"}]}}case Hl:{return{name:Hl,properties:[{name:"end"},{name:"specifications",defaultValue:[]},{name:"statements",defaultValue:[]},{name:"variable"}]}}default:{return{name:e,properties:[]}}}}}const Le=new m$;let gg;const yO=()=>gg??(gg=r_(`{
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
                "$ref": "#/rules@201"
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
                        "$ref": "#/rules@201"
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
                            "$ref": "#/rules@201"
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
                        "$ref": "#/rules@201"
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
                            "$ref": "#/rules@201"
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
                        "$ref": "#/rules@201"
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
                            "$ref": "#/rules@201"
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
                "$ref": "#/rules@201"
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
                "$ref": "#/rules@213"
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
                            "$ref": "#/rules@217"
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
            "value": "&="
          },
          {
            "$type": "Keyword",
            "value": "**="
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@204"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@202"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@207"
            },
            "arguments": []
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
                "$ref": "#/rules@201"
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
                    "$ref": "#/rules@201"
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
                "$ref": "#/rules@201"
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
                "$ref": "#/rules@200"
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
                    "$ref": "#/rules@213"
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
                "$ref": "#/rules@201"
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
                    "$ref": "#/rules@213"
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
                "$ref": "#/rules@213"
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
                "$ref": "#/rules@200"
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
                "$ref": "#/rules@213"
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
                    "$ref": "#/rules@213"
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
                        "$ref": "#/rules@213"
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
                        "$ref": "#/rules@213"
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
                            "$ref": "#/rules@213"
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
            "$ref": "#/rules@212"
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
                "$ref": "#/rules@211"
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
                "$ref": "#/rules@201"
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
                "$ref": "#/rules@213"
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
                "$ref": "#/rules@217"
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
                "$ref": "#/rules@201"
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
                                "$ref": "#/rules@201"
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
                    "$ref": "#/rules@217"
                  },
                  "arguments": []
                },
                {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@212"
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
                        "$ref": "#/rules@217"
                      },
                      "arguments": []
                    },
                    {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@212"
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
                    "$ref": "#/rules@213"
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
                    "$ref": "#/rules@217"
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
                "$ref": "#/rules@201"
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
                "$ref": "#/rules@201"
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
                        "$ref": "#/rules@201"
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
                            "$ref": "#/rules@201"
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
                "$ref": "#/rules@213"
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
            "$ref": "#/rules@212"
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
                    "$ref": "#/rules@217"
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
                "$ref": "#/rules@217"
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
                      "$ref": "#/rules@212"
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
                          "$ref": "#/rules@212"
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
                      "$ref": "#/rules@212"
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
                          "$ref": "#/rules@212"
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
                    "$ref": "#/rules@213"
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
                      "$ref": "#/rules@212"
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
                          "$ref": "#/rules@212"
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
                "$ref": "#/rules@212"
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
                "$ref": "#/rules@213"
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
                "$ref": "#/rules@213"
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
            "$ref": "#/rules@201"
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
                  "$ref": "#/rules@201"
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
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@205"
                      },
                      "arguments": []
                    },
                    {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@209"
                      },
                      "arguments": []
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
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@206"
                      },
                      "arguments": []
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
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@207"
                      },
                      "arguments": []
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
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@208"
                      },
                      "arguments": []
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
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@203"
                  },
                  "arguments": []
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
              "$ref": "#/rules@197"
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
                  "$ref": "#/rules@212"
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
              "$ref": "#/rules@212"
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
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@209"
                  },
                  "arguments": []
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
                    "$ref": "#/rules@213"
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
                    "$ref": "#/rules@198"
                  },
                  "arguments": []
                },
                {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@199"
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
            "$ref": "#/rules@217"
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
            "$ref": "#/rules@213"
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
              "$ref": "#/rules@212"
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
                  "$ref": "#/rules@212"
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
          "$ref": "#/rules@212"
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
      "name": "CONCAT_EQUAL",
      "definition": {
        "$type": "CharacterRange",
        "left": {
          "$type": "Keyword",
          "value": "||="
        }
      },
      "fragment": false,
      "hidden": false
    },
    {
      "$type": "TerminalRule",
      "name": "CONCAT_TOKEN",
      "definition": {
        "$type": "CharacterRange",
        "left": {
          "$type": "Keyword",
          "value": "||"
        }
      },
      "fragment": false,
      "hidden": false
    },
    {
      "$type": "TerminalRule",
      "name": "OR_EQUAL",
      "definition": {
        "$type": "CharacterRange",
        "left": {
          "$type": "Keyword",
          "value": "|="
        }
      },
      "fragment": false,
      "hidden": false
    },
    {
      "$type": "TerminalRule",
      "name": "OR_TOKEN",
      "definition": {
        "$type": "CharacterRange",
        "left": {
          "$type": "Keyword",
          "value": "|"
        }
      },
      "fragment": false,
      "hidden": false
    },
    {
      "$type": "TerminalRule",
      "name": "NOT_SMALLER",
      "definition": {
        "$type": "TerminalAlternatives",
        "elements": [
          {
            "$type": "CharacterRange",
            "left": {
              "$type": "Keyword",
              "value": "¬<"
            }
          },
          {
            "$type": "CharacterRange",
            "left": {
              "$type": "Keyword",
              "value": "^<"
            }
          }
        ]
      },
      "fragment": false,
      "hidden": false
    },
    {
      "$type": "TerminalRule",
      "name": "NOT_EQUAL",
      "definition": {
        "$type": "TerminalAlternatives",
        "elements": [
          {
            "$type": "CharacterRange",
            "left": {
              "$type": "Keyword",
              "value": "¬="
            }
          },
          {
            "$type": "CharacterRange",
            "left": {
              "$type": "Keyword",
              "value": "^="
            }
          }
        ]
      },
      "fragment": false,
      "hidden": false
    },
    {
      "$type": "TerminalRule",
      "name": "NOT_LARGER",
      "definition": {
        "$type": "TerminalAlternatives",
        "elements": [
          {
            "$type": "CharacterRange",
            "left": {
              "$type": "Keyword",
              "value": "¬>"
            }
          },
          {
            "$type": "CharacterRange",
            "left": {
              "$type": "Keyword",
              "value": "^>"
            }
          }
        ]
      },
      "fragment": false,
      "hidden": false
    },
    {
      "$type": "TerminalRule",
      "name": "NOT_TOKEN",
      "definition": {
        "$type": "TerminalAlternatives",
        "elements": [
          {
            "$type": "CharacterRange",
            "left": {
              "$type": "Keyword",
              "value": "¬"
            }
          },
          {
            "$type": "CharacterRange",
            "left": {
              "$type": "Keyword",
              "value": "^"
            }
          }
        ]
      },
      "fragment": false,
      "hidden": false
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
              "$ref": "#/rules@215"
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
              "$ref": "#/rules@214"
            }
          },
          {
            "$type": "TerminalRuleCall",
            "rule": {
              "$ref": "#/rules@216"
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
}`));const gO={languageId:"pli",fileExtensions:[".pli"],caseInsensitive:true,mode:"development"};const RO={AstReflection:()=>new m$};const vO={Grammar:()=>yO(),LanguageMetaData:()=>gO,parser:{}};function $O(t,e){const n=new Set;t.procedures.forEach((r,i)=>{if(!n.has(r)){n.add(r)}else{e("error",`The name '${r}' occurs more than once in the EXPORTS clause.`,{code:"IBM1324IE",node:t,property:"procedures",index:i})}})}function Gu(t){return t.toUpperCase()}function TO(t,e){return Gu(t)===Gu(e)}function EO(t,e){const n=t.options.flatMap(i=>i.items);const r=n.find(i=>pO(i)&&i.value.toUpperCase()==="NODESCRIPTOR");if(r){const i=new Set(t.parameters.map(s=>Gu(s.id)));const a=t.statements.filter(mO).map(s=>s.value).filter(tO).flatMap(s=>s.items).filter(s=>ei(s.element)&&i.has(Gu(s.element.name))).filter(s=>s.attributes.some(o=>eO(o)&&TO(o.type,"NONCONNECTED")));if(a.length>0){e("error","The NODESCRIPTOR attribute is invalid when any parameters have the NONCONNECTED attribute.",{code:"IBM1388IE",node:r,property:"value"})}}}function wO(t,e){if(!ei(t.element.ref.ref)){return}const n=t.element.ref.ref.$container;if(!n.attributes.some(o=>iO(o)&&o.returns)){return}const r=yt(t);const i=yt(n);if(r!==i){return}const a=t.$cstNode.offset;const s=n.$cstNode.offset;if(a>s){return}e("error","Function cannot be used before the function's descriptor list has been scanned.",{code:"IBM1747IS",node:t,property:"element"})}function CO(t){const e=t.validation.ValidationRegistry;const n=t.validation.Pl1Validator;const r={Exports:[$O],MemberCall:[wO],ProcedureStatement:[EO]};e.register(r,n)}class AO{}function SO(...t){return t.reduce((e,n)=>{return{issues:e.issues.concat(n.issues),options:{...e.options,...n.options}}},{issues:[],options:{}})}const up=rr({name:"comma",pattern:","});const h$=rr({name:"string",pattern:/'([^'\\]|\\.)*'/});const y$=rr({name:"value",pattern:/[\w\d\-+_]+/});const g$=rr({name:"parenOpen",pattern:"("});const R$=rr({name:"parenClose",pattern:")"});const kO=rr({name:"ws",pattern:/\s+/,group:ot.SKIPPED});const v$=[kO,up,h$,g$,R$,y$];const bO=new ot(v$,{positionTracking:"full"});class NO extends tv{constructor(){super(v$,{recoveryEnabled:true});this.performSelfAnalysis()}compilerOptions=this.RULE("compilerOptions",()=>{const e=[];this.MANY_SEP({SEP:up,DEF:()=>{let n=this.SUBRULE(this.compilerOption);if($$(n)){n={type:"option",name:n.value,token:n.token,values:[]}}e.push(n)}});return{options:e}},{recoveryValueFunc:()=>({options:[]})});compilerOption=this.RULE("compilerOption",()=>{const e=this.CONSUME(y$);const n=[];let r=false;this.MANY(()=>{r=true;this.CONSUME(g$);this.MANY_SEP({SEP:up,DEF:()=>{n.push(this.SUBRULE(this.compilerValue))}});this.CONSUME(R$)});if(r){return{type:"option",name:e.image,token:e,values:n}}else{return{type:"text",token:e,value:e.image}}},{recoveryValueFunc:()=>({type:"text",token:this.LA(1),value:""})});compilerValue=this.RULE("compilerValue",()=>{return this.OR([{ALT:()=>{const e=this.CONSUME(h$);return{type:"string",token:e,value:e.image.slice(1,-1)}}},{ALT:()=>{return this.SUBRULE(this.compilerOption)}},{ALT:()=>{return{type:"text",value:"",token:this.LA(1)}}}])},{recoveryValueFunc:()=>({type:"text",value:"",token:this.LA(1)})})}const Id=new NO;function PO(t){return"name"in t}function _O(t){return"type"in t&&t.type==="string"}function $$(t){return"type"in t&&t.type==="text"}function DO(t){const e=bO.tokenize(t);Id.input=e.tokens;const n=Id.compilerOptions();const r=[];for(const i of e.errors){r.push({message:i.message,range:{start:{line:i.line-1,character:i.column-1},end:{line:i.line-1,character:i.column+i.length-1}},severity:1})}for(const i of Id.errors){r.push({message:i.message,range:cp(i.token),severity:1})}return{options:n.options,issues:r}}function cp(t){return{start:{character:t.startColumn-1,line:t.startLine-1},end:{character:t.endColumn,line:t.endLine-1}}}class OO{options={};issues=[];rules=[];rule(e,n,r,i){this.rules.push({positive:e,negative:r,positiveTranslate:n,negativeTranslate:i})}flag(e,n,r){this.rules.push({positive:n,positiveTranslate:(i,a)=>{Xe(i,0,0);a[e]=true},negative:r,negativeTranslate:(i,a)=>{Xe(i,0,0);a[e]=false}})}translate(e){const n=e.name.toUpperCase();let r=false;try{for(const i of this.rules){if(i.positive&&i.positive.includes(n)){r=true;i.positiveTranslate?.(e,this.options);return}if(i.negative&&i.negative.includes(n)){r=true;i.negativeTranslate?.(e,this.options);return}}}catch(i){if(i instanceof Ie){this.issues.push({range:cp(i.token),message:i.message,severity:i.severity})}else{console.error("Encountered unexpected error during compiler options translation:",String(i))}}if(!r){this.issues.push({range:cp(e.token),message:`Unknown compiler option: ${e.name}`,severity:1})}}}class Ie{token;message;severity;constructor(e,n,r){this.token=e;this.message=n;this.severity=r}}function Xe(t,e,n){if(t.values.length<e||t.values.length>n){let r;if(e===n){r=`Expected ${e} arguments, but received ${t.values.length}.`}else{r=`Expected between ${e} and ${n} arguments, but received ${t.values.length}.`}throw new Ie(t.token,r,1)}}function He(t,e){if(PO(t)){if(e!=="option"){throw new Ie(t.token,`Expected a compiler option with arguments.`,1)}}else if($$(t)){if(e!=="plain"&&e!=="plainOrString"){throw new Ie(t.token,`Expected a plain text value.`,1)}}else if(_O(t)){if(e!=="string"&&e!=="plainOrString"){throw new Ie(t.token,`Expected a string compiler options argument.`,1)}}}const te=new OO;function ms(t){return(e,n)=>{Xe(e,1,1);const r=e.values[0];He(r,"string");t(n,r)}}function Ut(t,...e){return(n,r)=>{Xe(n,1,1);const i=n.values[0];He(i,"plain");if(e.length>0&&!e.includes(i.value)){throw new Ie(i.token,`Expected one of '${e.join("', '")}', but received '${i.value}'.`,1)}t(r,i)}}te.rule(["AGGREGATE","AG"],(t,e)=>{Xe(t,0,1);const n=t.values[0];if(n){He(n,"plain");const r=n.value;if(r==="DECIMAL"||r==="HEXADEC"){e.aggregate={offsets:r}}else{throw new Ie(n.token,"Invalid aggregate value. Expected DECIMAL or HEXADEC.",1)}}},["NOAGGREGATE","NAG"],(t,e)=>{e.aggregate=false});te.rule(["ARCH"],Ut((t,e)=>{t.arch=Number(e)},"10","11","12","13","14"));te.rule(["ASSERT"],Ut((t,e)=>{t.assert=e.value},"ENTRY","CONDITION"));te.rule(["ATTRIBUTES","A","NOATTRIBUTES","NA"],(t,e)=>{Xe(t,0,1);const n=t.name.startsWith("A");let r=void 0;const i=t.values[0];if(i){He(i,"plain");const a=i.value;if(a==="F"||a==="FULL"){r="FULL"}else if(a==="S"||a==="SHORT"){r="SHORT"}else{throw new Ie(i.token,"Invalid attribute value. Expected FULL or SHORT.",1)}}e.attributes={include:n,identifiers:r}});te.rule(["BACKREG"],Ut((t,e)=>{t.backreg=Number(e)},"5","11"));te.rule(["BIFPREC"],Ut((t,e)=>{t.bifprec=Number(e)},"31","15"));te.rule(["BLANK"],ms((t,e)=>{t.blank=e.value}));te.flag("blkoff",["BLKOFF"],["NOBLKOFF"]);te.rule(["BRACKETS"],ms((t,e)=>{const n=e.value.length;if(n!==2){throw new Ie(e.token,"Expected two characters.",1)}const r=e.value.charAt(0);const i=e.value.charAt(1);t.brackets=[r,i]}));te.rule(["CASE"],Ut((t,e)=>{t.case=e.value},"UPPER","ASIS"));te.rule(["CASERULES"],(t,e)=>{Xe(t,1,1);const n=t.values[0];He(n,"option");Xe(n,1,1);const r=n.values[0];He(r,"plain");e.caserules=r.value});te.rule(["CHECK"],Ut((t,e)=>{let n=e.value;if(n==="STG"){n="STORAGE"}else if(n==="NSTG"){n="NOSTORAGE"}t.check={storage:n}},"STORAGE","STG","NOSTORAGE","NSTG"));te.rule(["CMPAT","CMP"],Ut((t,e)=>{t.cmpat=e.value},"V1","V2","V3","LE"));te.rule(["CODEPAGE"],Ut((t,e)=>{t.codepage=e.value}));te.flag("common",["COMMON"],["NOCOMMON"]);te.rule(["COMPILE","C"],(t,e)=>{e.compile=true},["NOCOMPILE","NC"],(t,e)=>{Xe(t,0,1);const n=t.values[0];let r;if(n){He(n,"plain");const i=n.value;if(i==="S"){r="SEVERE"}else if(i==="W"){r="WARNING"}else if(i==="E"){r="ERROR"}else{throw new Ie(n.token,`Invalid severity value. Expected S, W or E, but received '${i}'`,1)}}e.compile={severity:r}});te.rule(["COPYRIGHT"],(t,e)=>{Xe(t,1,1);const n=t.values[0];He(n,"string");e.copyright=n.value},["NOCOPYRIGHT"],(t,e)=>{e.copyright=false});te.flag("csect",["CSECT"],["NOCSECT"]);te.rule(["CSECTCUT"],Ut((t,e)=>{if(!["0","1","2","3","4","5","6","7"].includes(e.value)){throw new Ie(e.token,`Invalid csectcut value. Expected a number between 0 and 7, but received '${e.value}'.`,1)}t.csectcut=Number(e)}));te.rule(["CURRENCY"],ms((t,e)=>{if(e.value.length===0){throw new Ie(e.token,"Currency character required.",1)}else if(e.value.length>1){throw new Ie(e.token,`Currency character must be a single character, but received '${e.value}'.`,1)}t.currency=e.value}));te.flag("dbcs",["DBCS"],["NODBCS"]);te.rule(["DBRMLIB"],(t,e)=>{Xe(t,0,1);const n=t.values[0];He(n,"string");e.dbrmlib=n.value},["NODBRMLIB"],(t,e)=>{e.dbrmlib=false});te.rule(["DD"],(t,e)=>{Xe(t,0,8);e.dd={};const n=["sysprint","sysin","syslib","syspunch","syslin","sysadata","sysxmlsd","sysdebug"];for(let r=0;r<t.values.length;r++){const i=t.values[r];He(i,"plain");if(!/^[a-z]+$/i.test(i.value)){throw new Ie(i.token,`Invalid DD name. Expected a text containing only letters, but received '${i.value}'.`,1)}e.dd[n[r]]=i.value}});te.rule(["DDSQL"],(t,e)=>{Xe(t,1,1);const n=t.values[0];He(n,"plainOrString");e.ddsql=n.value});te.rule(["DECIMAL"],(t,e)=>{e.decimal={};for(const n of t.values){He(n,"plain");const r=n.value;switch(r){case"CHECKFLOAT":e.decimal.checkfloat=true;break;case"NOCHECKFLOAT":e.decimal.checkfloat=false;break;case"FOFLONADD":e.decimal.foflonadd=true;break;case"NOFOFLONADD":e.decimal.foflonadd=false;break;case"FOFLONASGN":e.decimal.foflonasgn=true;break;case"NOFOFLONASGN":e.decimal.foflonasgn=false;break;case"FOFLONDIV":e.decimal.foflondiv=true;break;case"NOFOFLONDIV":e.decimal.foflondiv=false;break;case"FOFLONMULT":e.decimal.foflonmult=true;break;case"NOFOFLONMULT":e.decimal.foflonmult=false;break;case"FORCEDSIGN":e.decimal.forcedsign=true;break;case"NOFORCEDSIGN":e.decimal.forcedsign=false;break;case"KEEPMINUS":e.decimal.keepminus=true;break;case"NOKEEPMINUS":e.decimal.keepminus=false;break;case"TRUNCFLOAT":e.decimal.truncfloat=true;break;case"NOTRUNCFLOAT":e.decimal.truncfloat=false;break;default:throw new Ie(n.token,`Invalid decimal option. Expected one of 'CHECKFLOAT', 'NOCHECKFLOAT', 'FOFLONADD', 'NOFOFLONADD', 'FOFLONASGN', 'NOFOFLONASGN', 'FOFLONDIV', 'NOFOFLONDIV', 'FOFLONMULT', 'NOFOFLONMULT', 'FORCEDSIGN', 'NOFORCEDSIGN', 'KEEPMINUS', 'NOKEEPMINUS', 'TRUNCFLOAT', 'NOTRUNCFLOAT', but received '${r}'.`,1)}}});te.flag("decomp",["DECOMP"],["NODECOMP"]);te.rule(["DEFAULT"],(t,e)=>{const n=e.default={};for(const r of t.values){if(r.type==="text"){const i=r.value;switch(i){case"ALIGNED":n.aligned=true;break;case"UNALIGNED":n.aligned=false;break;case"IBM":case"ANS":n.architecture=i;break;case"EBCDIC":case"ASCII":n.encoding=i;break;case"ASSIGNABLE":n.assignable=true;break;case"NONASSIGNABLE":n.assignable=false;break;case"BIN1ARG":n.bin1arg=true;break;case"NOBIN1ARG":n.bin1arg=false;break;case"BYADDR":case"BYVALUE":n.allocator=i;break;case"CONNECTED":n.connected=true;break;case"NONCONNECTED":n.connected=false;break;case"DESCLIST":n.desc="LIST";break;case"DESCLOCATOR":n.desc="LOCATOR";break;case"DESCRIPTOR":n.descriptor=true;break;case"NODESCRIPTOR":n.descriptor=false;break;case"EVENDEC":n.evendec=true;break;case"NOEVENDEC":n.evendec=false;break;case"HEXADEC":case"IEEE":n.format=i;break;case"INLINE":n.inline=true;break;case"NOINLINE":n.inline=false;break;case"LAXQUAL":n.laxqual=true;break;case"NOLAXQUAL":n.laxqual=false;break;case"LOWERINC":case"UPPERINC":n.inc=i;break;case"NATIVE":n.native=true;break;case"NONNATIVE":n.native=false;break;case"NATIVEADDR":n.nativeAddr=true;break;case"NONNATIVEADDR":n.nativeAddr=false;break;case"NULLSYS":case"NULL370":n.nullsys=i;break;case"NULLSTRADDR":n.nullStrAddr=true;break;case"NONULLSTRADDR":n.nullStrAddr=false;break;case"ORDER":case"REORDER":n.order=i;break;case"OVERLAP":n.overlap=true;break;case"NOOVERLAP":n.overlap=false;break;case"PADDING":n.padding=true;break;case"NOPADDING":n.padding=false;break;case"PSEUDODUMMY":n.pseudodummy=true;break;case"NOPSEUDODUMMY":n.pseudodummy=false;break;case"RECURSIVE":n.recursive=true;break;case"NORECURSIVE":n.recursive=false;break;case"RETCODE":n.retcode=true;break;case"NORETCODE":n.retcode=false;break;default:throw new Ie(r.token,`Invalid default option value: ${i}`,1)}}}});te.rule(["DEPRECATE","DEPRECATENEXT"],(t,e)=>{const n=[];for(const r of t.values){He(r,"option");if(!["BUILTIN","ENTRY","INCLUDE","STMT","VARIABLE"].includes(r.name)){throw new Ie(r.token,`Invalid DEPRECATE option. Expected one of BUILTIN, ENTRY, INCLUDE, STMT or VARIABLE, but received '${r.name}'`,1)}Xe(r,0,1);const i=r.values[0];He(i,"plain");n.push({type:r.name,value:i.value})}if(t.name==="DEPRECATE"){e.deprecate={items:n}}else{e.deprecateNext={items:n}}});te.rule(["DISPLAY"],(t,e)=>{const n=e.display={};Xe(t,1,1);const r=t.values[0];if(r.type==="text"){if(r.value==="STD"){n.std=true}else if(r.value==="WTO"){n.wto=true}else{throw new Ie(r.token,`Invalid display value. Expected STD or WTO, but received '${r.value}'.`,1)}}else if(r.type==="option"){if(r.name!=="WTO"){throw new Ie(r.token,`Invalid display option. Expected WTO, but received '${r.name}'.`,1)}n.wto=true;for(const i of r.values){He(i,"option");const a=[];for(const s of i.values){He(s,"plain");a.push(s.value)}if(i.name==="ROUTCDE"){n.routcde=a}else if(i.name==="DESC"){n.desc=a}else if(i.name==="REPLY"){n.reply=a}else{throw new Ie(i.token,`Invalid display option. Expected ROUTCDE, DESC or REPLY, but received '${i.name}'.`,1)}}}else{throw new Ie(r.token,`Invalid display value. Expected a text or an option, but received '${r.type}'.`,1)}});te.flag("dll",["DLL"],["NODLL"]);te.flag("dllInit",["DLLINIT"],["NODLLINIT"]);te.rule(["EXIT"],(t,e)=>{Xe(t,0,1);const n=t.values[0];if(n){He(n,"string");e.exit={inparm:n.value}}else{e.exit={}}},["NOEXIT"],(t,e)=>{e.exit=false});te.flag("exportAll",["EXPORTALL"],["NOEXPORTALL"]);te.rule(["EXTRN"],Ut((t,e)=>{t.extrn=e.value},"FULL","SHORT"));te.rule(["FILEREF"],Ut((t,e)=>{t.fileRef={hash:e.value==="HASH"}},"HASH","NOHASH"),["NOFILEREF"],(t,e)=>{e.fileRef=false});te.rule(["FLAG","F"],(t,e)=>{Xe(t,0,1);const n=t.values[0];if(n){He(n,"plain");const r=n.value;if(r==="S"||r==="E"||r==="I"||r==="W"){e.flag=r}else{throw new Ie(n.token,`Invalid flag value. Expected S, E, I or W, but received '${r}'.`,1)}}});te.rule(["FLOAT"],Ut((t,e)=>{t.float={dfp:e.value==="DFP"}},"DFP","NODFP"));te.rule(["FLOATINMATH"],Ut((t,e)=>{t.floatInMath={type:e.value}},"ASIS","LONG","EXTENDED"));te.flag("goff",["GOFF"],["NOGOFF"]);te.rule(["MARGINS","MAR"],(t,e)=>{Xe(t,2,3);const n=t.values[0];const r=t.values[1];const i=t.values[2];He(n,"plain");He(r,"plain");let a=void 0;if(i){He(i,"plain");a=i.value}const s=n.value?Number(n.value):NaN;const o=r.value?Number(r.value):NaN;e.margins={m:s,n:o,c:a}},["NOMARGINS"],(t,e)=>{e.margins=false});te.rule(["NOT"],ms((t,e)=>{t.not=e.value}));te.rule(["OR"],ms((t,e)=>{t.or=e.value}));function IO(t){te.options={};te.issues=[...t.issues];for(const e of t.options){te.translate(e)}return{options:te.options,issues:te.issues}}const LO="\n".charCodeAt(0);class xO extends Uv{compilerOptions={issues:[],options:{}};uri;configStorage;constructor(e){super(e);this.configStorage=e.shared.workspace.PliConfigStorage}tokenize(e){const n=this.splitLines(e);this.fillCompilerOptions(n);this.tokenBuilder.or=this.compilerOptions.options.or||"|";this.tokenBuilder.not=this.compilerOptions.options.not||"^";const r=n.map(a=>this.adjustLine(a));const i=r.join("");return super.tokenize(i)}splitLines(e){const n=[];for(let r=0;r<e.length;r++){const i=r;while(r<e.length&&e.charCodeAt(r)!==LO){r++}n.push(e.substring(i,r+1))}return n}fillCompilerOptions(e){const n=Math.min(e.length,100);const r=this.configStorage.getCompilerOptions(this.uri);let i="";for(let a=0;a<n;a++){const s=e[a];const{length:o,eol:l}=this.getLineInfo(s);const u="*PROCESS";if(s.includes(u)){const c=s.indexOf(u);const d=c+u.length;let f=s.lastIndexOf(";");if(f<0){f=o}const p=s.substring(d,f);i+=" ".repeat(d)+p;const y=DO(i);this.compilerOptions=SO(r,IO(y));const v=" ".repeat(o)+l;e[a]=v;return this.compilerOptions}else{i+=" ".repeat(o)+l}}this.compilerOptions=r;return this.compilerOptions}adjustLine(e){const{length:n,eol:r}=this.getLineInfo(e);const i=1;if(n<i){return" ".repeat(n)+r}const a=72;const s=" ".repeat(i);let o="";if(n>a){o=" ".repeat(n-a)}return s+e.substring(i,Math.min(a,n))+o+r}getLineInfo(e){let n="";let r=e.length;if(e.endsWith("\r\n")){n="\r\n";r-=2}else if(e.endsWith("\n")){n="\n";r-=1}return{eol:n,length:r}}}class MO extends Ev{or="|";not="¬";static EXPERIMENTAL=true;buildTokens(e,n){const r=be(pp(e,false));const i=this.buildTerminalTokens(r);const a=this.buildKeywordTokens(r,i,n);const s=this.findToken(i,"ID");for(const l of a){if(/[a-zA-Z]/.test(l.name)){l.CATEGORIES=[s]}}i.forEach(l=>{const u=l.PATTERN;if(typeof u==="object"&&u&&"test"in u&&pu(u)||l.name==="ExecFragment"){a.unshift(l)}else{a.push(l)}});const o=this.findToken(a,"ExecFragment");o.START_CHARS_HINT=["S","C"];{this.overrideNotTokens(a);this.overrideOrTokens(a)}return a}overrideOrTokens(e){this.overrideToken(this.findToken(e,"OR_TOKEN"),"",()=>this.getOr());this.overrideToken(this.findToken(e,"OR_EQUAL"),"=",()=>this.getOr());this.overrideToken(this.findToken(e,"CONCAT_TOKEN"),"",()=>this.getOr(true));this.overrideToken(this.findToken(e,"CONCAT_EQUAL"),"=",()=>this.getOr(true))}overrideNotTokens(e){this.overrideToken(this.findToken(e,"NOT_TOKEN"),"",()=>this.getNot());this.overrideToken(this.findToken(e,"NOT_SMALLER"),"<",()=>this.getNot());this.overrideToken(this.findToken(e,"NOT_EQUAL"),"=",()=>this.getNot());this.overrideToken(this.findToken(e,"NOT_LARGER"),">",()=>this.getNot())}getOr(e){const n=this.or.charAt(0);return e?n+n:n}getNot(){return this.not.charAt(0)}findToken(e,n){return e.find(r=>r.name===n)}overrideToken(e,n,r){e.PATTERN=(i,a)=>{const s=r()+n;const o=i.substring(a,a+s.length);if(o===s){return[o]}else{return null}};e.START_CHARS_HINT=["!","|","^","¬"]}}class KO extends Dv{async computeExports(e,n=U.CancellationToken.None){return this.computeExportsForNode(e.parseResult.value,e,Nr,n)}processNode(e,n,r){const i=cu(e);if(i){const a=this.nameProvider.getName(e);if(a){r.add(i,this.descriptions.createDescription(e,a,n))}}}}class FO extends Mv{processLinkingErrors(e,n,r){for(const i of e.references){const a=i.error;if(a){const s={node:a.container,property:a.property,index:a.index,data:{code:qt.LinkingError,containerType:a.container.$type,property:a.property,refText:a.reference.$refText}};n.push(this.toDiagnostic("warning",a.message,s))}}}async validateDocument(e,n,r){const i=await super.validateDocument(e,n,r);const a=e;const s=a.compilerOptions;for(const o of s.issues){i.push({severity:o.severity,range:o.range,message:o.message})}return i}}class UO extends hD{highlightElement(e,n){if(fO(e)){const r=e.ref?.ref;n({node:e,property:"ref",type:un(r)?U.SemanticTokenTypes.function:U.SemanticTokenTypes.variable})}else if(ei(e)||p$(e)){n({node:e,property:"name",type:U.SemanticTokenTypes.variable})}else if(nO(e)){n({node:e,property:"name",type:U.SemanticTokenTypes.type})}else if(dO(e)){n({node:e,property:"id",type:U.SemanticTokenTypes.parameter})}else if(rO(e)){const r=e.$container;n({node:e,property:"label",type:un(r)?U.SemanticTokenTypes.function:U.SemanticTokenTypes.variable})}else if(sO(e)){n({node:e,property:"label",type:U.SemanticTokenTypes.variable})}else if(cO(e)){n({node:e,property:"procedure",type:U.SemanticTokenTypes.function})}else if(Xa(e)){const r=e.$container;n({node:e,property:"name",type:un(r)?U.SemanticTokenTypes.function:U.SemanticTokenTypes.variable})}else if(uO(e)){n({node:e,property:"value",type:U.SemanticTokenTypes.number})}else if(hO(e)){n({node:e,property:"value",type:U.SemanticTokenTypes.string})}else if(oO(e)){n({node:e,property:"multiplier",type:U.SemanticTokenTypes.number})}}}class GO extends Pv{getName(e){if(un(e)){const n=e.labels[0];return n?.name||void 0}else{return super.getName(e)}}getNameNode(e){if(un(e)){const n=e.labels[0];if(n){return this.getNameNode(n)}else{return void 0}}else{return super.getNameNode(e)}}}class HO extends _v{findReferences(e,n){if(Xa(e)&&un(e.$container)){return this.findReferences(e.$container,n)}else{return super.findReferences(e,n)}}}class qO extends xv{globalDocumentScopeCache;constructor(e){super(e);this.globalDocumentScopeCache=new RP(e.shared)}getGlobalScope(e,n){return this.globalDocumentScopeCache.get(yt(n.container).uri,e,()=>{const r=Xn(yt(n.container).parseResult.value).filter(aO);const i=this.getUrisFromIncludes(yt(n.container).uri,r.toArray());return new Ov(this.indexManager.allElements(e,i))})}getUrisFromIncludes(e,n){const r=new Set;r.add(e.toString());const i=Ge.dirname(e);for(const a of n){for(const s of a.items){const o=Ge.joinPath(i,s.file.substring(1,s.file.length-1));r.add(o.toString())}}r.add("pli-builtin:/builtins.pli");return r}getScope(e){if(e.property==="ref"){const n=In(e.container,lO);if(n?.previous){const r=n.previous.element.ref.ref;if(r&&ei(r)){return this.createScopeForNodes(this.findChildren(r))}else{return yP}}}return super.getScope(e)}findChildren(e){const n=e.$container;let r=Number(n.level);if(isNaN(r)||r<1){r=1}const i=[];const a=n.$container;const s=a.items.indexOf(n);for(let o=s+1;o<a.items.length;o++){const l=a.items[o];const u=Number(l.level);if(isNaN(u)||u<r){break}if(u===r+1){if(ei(l.element)){i.push(l.element)}}}return i}}class jO extends f${getSymbolKind(e){const n=this.getNode(e);if(!n){return Dn.Null}if(un(n)){return Dn.Function}else if(eg(n)){return Dn.Variable}else if(lg(n)){return Dn.Namespace}else if(Xa(n)){return Dn.Constant}else{return Dn.Variable}}getCompletionItemKind(e){const n=this.getNode(e);if(!n){return _n.Text}if(un(n)){return _n.Function}else if(eg(n)){return _n.Variable}else if(lg(n)){return _n.Module}else if(Xa(n)){return _n.Constant}return _n.Variable}getNode(e){if(Rg(e)){return e.node}return e}}class BO extends Vv{getDocumentation(e){if(ei(e)){const n=e.$container;let r=`\`\`\`
DECLARE ${e.name} `;for(const i of n.attributes){r+=`${i.$cstNode?.text} `}r+="\n```";return r}else if(Xa(e)&&un(e.$container)){return this.getProcedureHoverContent(e.$container)}else if(un(e)){return this.getProcedureHoverContent(e)}else if(p$(e)){return"```\nDECLARE"+e.name+"\n```"}return""}getProcedureHoverContent(e){let n="```\n";for(const r of e.labels){n+=`${r.name} `}n+="PROCEDURE ";if(e.parameters.length>0){n+="("+e.parameters.map(r=>r.id).join(", ")+") "}if(e.recursive.length>0){n+="RECURSIVE "}if(e.order.includes("ORDER")){n+="ORDER "}else if(e.order.includes("REORDER")){n+="REORDER "}if(e.options.length>0){n+=e.options.map(r=>r.$cstNode?.text).join(" ")}if(e.returns.length>0){n+=e.returns.map(r=>r.$cstNode?.text).join(" ")}n+="\n```";return n}}class WO extends c${createReferenceCompletionItem(e){let n=void 0;if(e.type==="ProcedureStatement"){n="PROCEDURE"}else if(e.type==="DeclaredVariable"||e.type==="DoType3Variable"){n="DECLARE"}else if(e.type==="LabelPrefix"){n="LABEL"}const r=this.nodeKindProvider.getCompletionItemKind(e);const i=this.getReferenceDocumentation(e);return{nodeDescription:e,kind:r,documentation:i,detail:n,sortText:"0"}}}class VO extends Kv{isAffected(e,n){return false}}const zO=` // Mathematical functions
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
 `;class YO extends Fv{factory;configStorage;constructor(e){super(e);this.factory=e.workspace.LangiumDocumentFactory;this.configStorage=e.workspace.PliConfigStorage}async loadAdditionalDocuments(e,n){const r=this.factory.fromString(zO,lt.parse("pli-builtin:///builtins.pli"));n(r);for(const i of e){const a=Ge.resolvePath(lt.parse(i.uri),"pgm_conf.json");try{const s=await this.fileSystemProvider.readFile(a);await this.configStorage.updateConfig(s,false)}catch{}}}traverseFolder(){return Promise.resolve()}}class XO extends d${didCloseDocument(e){const n=lt.parse(e.document.uri);if(n.scheme!=="pli-builtin"){this.fireDocumentUpdate([],[n])}}}class JO{documents;documentBuilder;compilerOptions;constructor(e){this.documentBuilder=e.workspace.DocumentBuilder;this.documents=e.workspace.LangiumDocuments;e.lsp.Connection?.onNotification("pli/pgmConfChanged",async n=>{await this.updateConfig(n.text)})}async updateConfig(e,n=true){try{const r=JSON.parse(e);this.compilerOptions=r;if(n){const i=this.documents.all.filter(a=>a.uri.scheme!=="pli-builtin").toArray();i.forEach(a=>{a.parseResult.value.$cstNode=void 0});await this.documentBuilder.update(i.map(a=>a.uri),[])}}catch(r){}}getCompilerOptions(e){return{options:this.compilerOptions??{},issues:[]}}}class QO extends bv{createLangiumDocument(e,n,r,i){const a=this.serviceRegistry.getServices(n).parser.Lexer;a.uri=n;const s=super.createLangiumDocument(e,n,r,i);s.compilerOptions=a.compilerOptions;return s}async update(e,n){const r=this.serviceRegistry.getServices(e.uri).parser.Lexer;r.uri=e.uri;const i=await super.update(e,n);const a=i;a.compilerOptions=r.compilerOptions;return a}}const ZO={documentation:{DocumentationProvider:t=>new BO(t)},validation:{Pl1Validator:()=>new AO,DocumentValidator:t=>new FO(t)},parser:{Lexer:t=>new xO(t),TokenBuilder:()=>new MO},references:{ScopeComputation:t=>new KO(t),NameProvider:()=>new GO,References:t=>new HO(t),ScopeProvider:t=>new qO(t)},lsp:{SemanticTokenProvider:t=>new UO(t),CompletionProvider:t=>new WO(t)}};const eI={lsp:{NodeKindProvider:()=>new jO,DocumentUpdateHandler:t=>new XO(t)},workspace:{LangiumDocumentFactory:t=>new QO(t),IndexManager:t=>new VO(t),WorkspaceManager:t=>new YO(t),PliConfigStorage:t=>new JO(t)}};function tI(t){const e=Ku(JD(t),RO,eI);const n=Ku(YD({shared:e}),vO,ZO);e.ServiceRegistry.register(n);CO(n);if(!t.connection){e.workspace.ConfigurationProvider.initialized({})}return{shared:e,pli:n}}const nI=new nm.BrowserMessageReader(self);const rI=new nm.BrowserMessageWriter(self);const iI=nm.createConnection(nI,rI);const{shared:aI}=tI({connection:iI,...Qv});RD(aI)});export default sI();
