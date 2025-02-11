var v$=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);var rI=v$((Ot,It)=>{function rt(t){return typeof t==="object"&&t!==null&&typeof t.$type==="string"}function on(t){return typeof t==="object"&&t!==null&&typeof t.$refText==="string"}function mg(t){return typeof t==="object"&&t!==null&&typeof t.name==="string"&&typeof t.type==="string"&&typeof t.path==="string"}function Gl(t){return typeof t==="object"&&t!==null&&rt(t.container)&&on(t.reference)&&typeof t.message==="string"}class hg{constructor(){this.subtypes={};this.allSubtypes={}}isInstance(e,n){return rt(e)&&this.isSubtype(e.$type,n)}isSubtype(e,n){if(e===n){return true}let r=this.subtypes[e];if(!r){r=this.subtypes[e]={}}const i=r[n];if(i!==void 0){return i}else{const a=this.computeIsSubtype(e,n);r[n]=a;return a}}getAllSubTypes(e){const n=this.allSubtypes[e];if(n){return n}else{const r=this.getAllTypes();const i=[];for(const a of r){if(this.isSubtype(a,e)){i.push(a)}}this.allSubtypes[e]=i;return i}}}function Tr(t){return typeof t==="object"&&t!==null&&Array.isArray(t.content)}function Ja(t){return typeof t==="object"&&t!==null&&typeof t.tokenType==="object"}function yg(t){return Tr(t)&&typeof t.fullText==="string"}class tt{constructor(e,n){this.startFn=e;this.nextFn=n}iterator(){const e={state:this.startFn(),next:()=>this.nextFn(e.state),[Symbol.iterator]:()=>e};return e}[Symbol.iterator](){return this.iterator()}isEmpty(){const e=this.iterator();return Boolean(e.next().done)}count(){const e=this.iterator();let n=0;let r=e.next();while(!r.done){n++;r=e.next()}return n}toArray(){const e=[];const n=this.iterator();let r;do{r=n.next();if(r.value!==void 0){e.push(r.value)}}while(!r.done);return e}toSet(){return new Set(this)}toMap(e,n){const r=this.map(i=>[e?e(i):i,n?n(i):i]);return new Map(r)}toString(){return this.join()}concat(e){return new tt(()=>({first:this.startFn(),firstDone:false,iterator:e[Symbol.iterator]()}),n=>{let r;if(!n.firstDone){do{r=this.nextFn(n.first);if(!r.done){return r}}while(!r.done);n.firstDone=true}do{r=n.iterator.next();if(!r.done){return r}}while(!r.done);return Dt})}join(e=","){const n=this.iterator();let r="";let i;let a=false;do{i=n.next();if(!i.done){if(a){r+=e}r+=$$(i.value)}a=true}while(!i.done);return r}indexOf(e,n=0){const r=this.iterator();let i=0;let a=r.next();while(!a.done){if(i>=n&&a.value===e){return i}a=r.next();i++}return-1}every(e){const n=this.iterator();let r=n.next();while(!r.done){if(!e(r.value)){return false}r=n.next()}return true}some(e){const n=this.iterator();let r=n.next();while(!r.done){if(e(r.value)){return true}r=n.next()}return false}forEach(e){const n=this.iterator();let r=0;let i=n.next();while(!i.done){e(i.value,r);i=n.next();r++}}map(e){return new tt(this.startFn,n=>{const{done:r,value:i}=this.nextFn(n);if(r){return Dt}else{return{done:false,value:e(i)}}})}filter(e){return new tt(this.startFn,n=>{let r;do{r=this.nextFn(n);if(!r.done&&e(r.value)){return r}}while(!r.done);return Dt})}nonNullable(){return this.filter(e=>e!==void 0&&e!==null)}reduce(e,n){const r=this.iterator();let i=n;let a=r.next();while(!a.done){if(i===void 0){i=a.value}else{i=e(i,a.value)}a=r.next()}return i}reduceRight(e,n){return this.recursiveReduce(this.iterator(),e,n)}recursiveReduce(e,n,r){const i=e.next();if(i.done){return r}const a=this.recursiveReduce(e,n,r);if(a===void 0){return i.value}return n(a,i.value)}find(e){const n=this.iterator();let r=n.next();while(!r.done){if(e(r.value)){return r.value}r=n.next()}return void 0}findIndex(e){const n=this.iterator();let r=0;let i=n.next();while(!i.done){if(e(i.value)){return r}i=n.next();r++}return-1}includes(e){const n=this.iterator();let r=n.next();while(!r.done){if(r.value===e){return true}r=n.next()}return false}flatMap(e){return new tt(()=>({this:this.startFn()}),n=>{do{if(n.iterator){const a=n.iterator.next();if(a.done){n.iterator=void 0}else{return a}}const{done:r,value:i}=this.nextFn(n.this);if(!r){const a=e(i);if(iu(a)){n.iterator=a[Symbol.iterator]()}else{return{done:false,value:a}}}}while(n.iterator);return Dt})}flat(e){if(e===void 0){e=1}if(e<=0){return this}const n=e>1?this.flat(e-1):this;return new tt(()=>({this:n.startFn()}),r=>{do{if(r.iterator){const s=r.iterator.next();if(s.done){r.iterator=void 0}else{return s}}const{done:i,value:a}=n.nextFn(r.this);if(!i){if(iu(a)){r.iterator=a[Symbol.iterator]()}else{return{done:false,value:a}}}}while(r.iterator);return Dt})}head(){const e=this.iterator();const n=e.next();if(n.done){return void 0}return n.value}tail(e=1){return new tt(()=>{const n=this.startFn();for(let r=0;r<e;r++){const i=this.nextFn(n);if(i.done){return n}}return n},this.nextFn)}limit(e){return new tt(()=>({size:0,state:this.startFn()}),n=>{n.size++;if(n.size>e){return Dt}return this.nextFn(n.state)})}distinct(e){return new tt(()=>({set:new Set,internalState:this.startFn()}),n=>{let r;do{r=this.nextFn(n.internalState);if(!r.done){const i=e?e(r.value):r.value;if(!n.set.has(i)){n.set.add(i);return r}}}while(!r.done);return Dt})}exclude(e,n){const r=new Set;for(const i of e){const a=n?n(i):i;r.add(a)}return this.filter(i=>{const a=n?n(i):i;return!r.has(a)})}}function $$(t){if(typeof t==="string"){return t}if(typeof t==="undefined"){return"undefined"}if(typeof t.toString==="function"){return t.toString()}return Object.prototype.toString.call(t)}function iu(t){return!!t&&typeof t[Symbol.iterator]==="function"}const gg=new tt(()=>void 0,()=>Dt);const Dt=Object.freeze({done:true,value:void 0});function be(...t){if(t.length===1){const e=t[0];if(e instanceof tt){return e}if(iu(e)){return new tt(()=>e[Symbol.iterator](),n=>n.next())}if(typeof e.length==="number"){return new tt(()=>({index:0}),n=>{if(n.index<e.length){return{done:false,value:e[n.index++]}}else{return Dt}})}}if(t.length>1){return new tt(()=>({collIndex:0,arrIndex:0}),e=>{do{if(e.iterator){const n=e.iterator.next();if(!n.done){return n}e.iterator=void 0}if(e.array){if(e.arrIndex<e.array.length){return{done:false,value:e.array[e.arrIndex++]}}e.array=void 0;e.arrIndex=0}if(e.collIndex<t.length){const n=t[e.collIndex++];if(iu(n)){e.iterator=n[Symbol.iterator]()}else if(n&&typeof n.length==="number"){e.array=n}}}while(e.iterator||e.array||e.collIndex<t.length);return Dt})}return gg}class au extends tt{constructor(e,n,r){super(()=>({iterators:(r===null||r===void 0?void 0:r.includeRoot)?[[e][Symbol.iterator]()]:[n(e)[Symbol.iterator]()],pruned:false}),i=>{if(i.pruned){i.iterators.pop();i.pruned=false}while(i.iterators.length>0){const a=i.iterators[i.iterators.length-1];const s=a.next();if(s.done){i.iterators.pop()}else{i.iterators.push(n(s.value)[Symbol.iterator]());return s}}return Dt})}iterator(){const e={state:this.startFn(),next:()=>this.nextFn(e.state),prune:()=>{e.state.pruned=true},[Symbol.iterator]:()=>e};return e}}var Dd;(function(t){function e(a){return a.reduce((s,o)=>s+o,0)}t.sum=e;function n(a){return a.reduce((s,o)=>s*o,0)}t.product=n;function r(a){return a.reduce((s,o)=>Math.min(s,o))}t.min=r;function i(a){return a.reduce((s,o)=>Math.max(s,o))}t.max=i})(Dd||(Dd={}));function su(t){return new au(t,e=>{if(Tr(e)){return e.content}else{return[]}},{includeRoot:true})}function T$(t){return su(t).filter(Ja)}function E$(t,e){while(t.container){t=t.container;if(t===e){return true}}return false}function Od(t){return{start:{character:t.startColumn-1,line:t.startLine-1},end:{character:t.endColumn,line:t.endLine-1}}}function ou(t){if(!t){return void 0}const{offset:e,end:n,range:r}=t;return{range:r,offset:e,end:n,length:n-e}}var Nn;(function(t){t[t["Before"]=0]="Before";t[t["After"]=1]="After";t[t["OverlapFront"]=2]="OverlapFront";t[t["OverlapBack"]=3]="OverlapBack";t[t["Inside"]=4]="Inside";t[t["Outside"]=5]="Outside"})(Nn||(Nn={}));function w$(t,e){if(t.end.line<e.start.line||t.end.line===e.start.line&&t.end.character<=e.start.character){return Nn.Before}else if(t.start.line>e.end.line||t.start.line===e.end.line&&t.start.character>=e.end.character){return Nn.After}const n=t.start.line>e.start.line||t.start.line===e.start.line&&t.start.character>=e.start.character;const r=t.end.line<e.end.line||t.end.line===e.end.line&&t.end.character<=e.end.character;if(n&&r){return Nn.Inside}else if(n){return Nn.OverlapBack}else if(r){return Nn.OverlapFront}else{return Nn.Outside}}function Rg(t,e){const n=w$(t,e);return n>Nn.After}const vg=/^[\w\p{L}]$/u;function Er(t,e,n=vg){if(t){if(e>0){const r=e-t.offset;const i=t.text.charAt(r);if(!n.test(i)){e--}}return $g(t,e)}return void 0}function C$(t,e){if(t){const n=S$(t,true);if(n&&Zp(n,e)){return n}if(yg(t)){const r=t.content.findIndex(i=>!i.hidden);for(let i=r-1;i>=0;i--){const a=t.content[i];if(Zp(a,e)){return a}}}}return void 0}function Zp(t,e){return Ja(t)&&e.includes(t.tokenType.name)}function $g(t,e){if(Ja(t)){return t}else if(Tr(t)){const n=Tg(t,e,false);if(n){return $g(n,e)}}return void 0}function Id(t,e){if(Ja(t)){return t}else if(Tr(t)){const n=Tg(t,e,true);if(n){return Id(n,e)}}return void 0}function Tg(t,e,n){let r=0;let i=t.content.length-1;let a=void 0;while(r<=i){const s=Math.floor((r+i)/2);const o=t.content[s];if(o.offset<=e&&o.end>e){return o}if(o.end<=e){a=n?o:void 0;r=s+1}else{i=s-1}}return a}function S$(t,e=true){while(t.container){const n=t.container;let r=n.content.indexOf(t);while(r>0){r--;const i=n.content[r];if(e||!i.hidden){return i}}t=n}return void 0}class Eg extends Error{constructor(e,n){super(e?`${n} at ${e.range.start.line}:${e.range.start.character}`:n)}}function Qa(t){throw new Error("Error! The input value was not handled.")}const ks="AbstractRule";const bs="AbstractType";const uc="Condition";const em="TypeDefinition";const cc="ValueLiteral";const ji="AbstractElement";function wg(t){return ce.isInstance(t,ji)}const Ns="ArrayLiteral";const Ps="ArrayType";const Bi="BooleanLiteral";function A$(t){return ce.isInstance(t,Bi)}const Wi="Conjunction";function k$(t){return ce.isInstance(t,Wi)}const Vi="Disjunction";function b$(t){return ce.isInstance(t,Vi)}const _s="Grammar";const dc="GrammarImport";const zi="InferredType";function Cg(t){return ce.isInstance(t,zi)}const Xi="Interface";function Sg(t){return ce.isInstance(t,Xi)}const fc="NamedArgument";const Yi="Negation";function N$(t){return ce.isInstance(t,Yi)}const Ds="NumberLiteral";const Os="Parameter";const Ji="ParameterReference";function P$(t){return ce.isInstance(t,Ji)}const Qi="ParserRule";function ct(t){return ce.isInstance(t,Qi)}const Is="ReferenceType";const Hl="ReturnType";function _$(t){return ce.isInstance(t,Hl)}const Zi="SimpleType";function D$(t){return ce.isInstance(t,Zi)}const Ls="StringLiteral";const Fr="TerminalRule";function tr(t){return ce.isInstance(t,Fr)}const ea="Type";function Ag(t){return ce.isInstance(t,ea)}const pc="TypeAttribute";const xs="UnionType";const ta="Action";function Za(t){return ce.isInstance(t,ta)}const na="Alternatives";function op(t){return ce.isInstance(t,na)}const ra="Assignment";function cn(t){return ce.isInstance(t,ra)}const ia="CharacterRange";function O$(t){return ce.isInstance(t,ia)}const aa="CrossReference";function es(t){return ce.isInstance(t,aa)}const sa="EndOfFile";function I$(t){return ce.isInstance(t,sa)}const oa="Group";function wr(t){return ce.isInstance(t,oa)}const la="Keyword";function dn(t){return ce.isInstance(t,la)}const ua="NegatedToken";function L$(t){return ce.isInstance(t,ua)}const ca="RegexToken";function x$(t){return ce.isInstance(t,ca)}const da="RuleCall";function Mn(t){return ce.isInstance(t,da)}const fa="TerminalAlternatives";function M$(t){return ce.isInstance(t,fa)}const pa="TerminalGroup";function F$(t){return ce.isInstance(t,pa)}const ma="TerminalRuleCall";function K$(t){return ce.isInstance(t,ma)}const ha="UnorderedGroup";function lp(t){return ce.isInstance(t,ha)}const ya="UntilToken";function U$(t){return ce.isInstance(t,ya)}const ga="Wildcard";function G$(t){return ce.isInstance(t,ga)}class kg extends hg{getAllTypes(){return[ji,ks,bs,ta,na,Ns,Ps,ra,Bi,ia,uc,Wi,aa,Vi,sa,_s,dc,oa,zi,Xi,la,fc,ua,Yi,Ds,Os,Ji,Qi,Is,ca,Hl,da,Zi,Ls,fa,pa,Fr,ma,ea,pc,em,xs,ha,ya,cc,ga]}computeIsSubtype(e,n){switch(e){case ta:case na:case ra:case ia:case aa:case sa:case oa:case la:case ua:case ca:case da:case fa:case pa:case ma:case ha:case ya:case ga:{return this.isSubtype(ji,n)}case Ns:case Ds:case Ls:{return this.isSubtype(cc,n)}case Ps:case Is:case Zi:case xs:{return this.isSubtype(em,n)}case Bi:{return this.isSubtype(uc,n)||this.isSubtype(cc,n)}case Wi:case Vi:case Yi:case Ji:{return this.isSubtype(uc,n)}case zi:case Xi:case ea:{return this.isSubtype(bs,n)}case Qi:{return this.isSubtype(ks,n)||this.isSubtype(bs,n)}case Fr:{return this.isSubtype(ks,n)}default:{return false}}}getReferenceType(e){const n=`${e.container.$type}:${e.property}`;switch(n){case"Action:type":case"CrossReference:type":case"Interface:superTypes":case"ParserRule:returnType":case"SimpleType:typeRef":{return bs}case"Grammar:hiddenTokens":case"ParserRule:hiddenTokens":case"RuleCall:rule":{return ks}case"Grammar:usedGrammars":{return _s}case"NamedArgument:parameter":case"ParameterReference:parameter":{return Os}case"TerminalRuleCall:rule":{return Fr}default:{throw new Error(`${n} is not a valid reference id.`)}}}getTypeMetaData(e){switch(e){case ji:{return{name:ji,properties:[{name:"cardinality"},{name:"lookahead"}]}}case Ns:{return{name:Ns,properties:[{name:"elements",defaultValue:[]}]}}case Ps:{return{name:Ps,properties:[{name:"elementType"}]}}case Bi:{return{name:Bi,properties:[{name:"true",defaultValue:false}]}}case Wi:{return{name:Wi,properties:[{name:"left"},{name:"right"}]}}case Vi:{return{name:Vi,properties:[{name:"left"},{name:"right"}]}}case _s:{return{name:_s,properties:[{name:"definesHiddenTokens",defaultValue:false},{name:"hiddenTokens",defaultValue:[]},{name:"imports",defaultValue:[]},{name:"interfaces",defaultValue:[]},{name:"isDeclared",defaultValue:false},{name:"name"},{name:"rules",defaultValue:[]},{name:"types",defaultValue:[]},{name:"usedGrammars",defaultValue:[]}]}}case dc:{return{name:dc,properties:[{name:"path"}]}}case zi:{return{name:zi,properties:[{name:"name"}]}}case Xi:{return{name:Xi,properties:[{name:"attributes",defaultValue:[]},{name:"name"},{name:"superTypes",defaultValue:[]}]}}case fc:{return{name:fc,properties:[{name:"calledByName",defaultValue:false},{name:"parameter"},{name:"value"}]}}case Yi:{return{name:Yi,properties:[{name:"value"}]}}case Ds:{return{name:Ds,properties:[{name:"value"}]}}case Os:{return{name:Os,properties:[{name:"name"}]}}case Ji:{return{name:Ji,properties:[{name:"parameter"}]}}case Qi:{return{name:Qi,properties:[{name:"dataType"},{name:"definesHiddenTokens",defaultValue:false},{name:"definition"},{name:"entry",defaultValue:false},{name:"fragment",defaultValue:false},{name:"hiddenTokens",defaultValue:[]},{name:"inferredType"},{name:"name"},{name:"parameters",defaultValue:[]},{name:"returnType"},{name:"wildcard",defaultValue:false}]}}case Is:{return{name:Is,properties:[{name:"referenceType"}]}}case Hl:{return{name:Hl,properties:[{name:"name"}]}}case Zi:{return{name:Zi,properties:[{name:"primitiveType"},{name:"stringType"},{name:"typeRef"}]}}case Ls:{return{name:Ls,properties:[{name:"value"}]}}case Fr:{return{name:Fr,properties:[{name:"definition"},{name:"fragment",defaultValue:false},{name:"hidden",defaultValue:false},{name:"name"},{name:"type"}]}}case ea:{return{name:ea,properties:[{name:"name"},{name:"type"}]}}case pc:{return{name:pc,properties:[{name:"defaultValue"},{name:"isOptional",defaultValue:false},{name:"name"},{name:"type"}]}}case xs:{return{name:xs,properties:[{name:"types",defaultValue:[]}]}}case ta:{return{name:ta,properties:[{name:"cardinality"},{name:"feature"},{name:"inferredType"},{name:"lookahead"},{name:"operator"},{name:"type"}]}}case na:{return{name:na,properties:[{name:"cardinality"},{name:"elements",defaultValue:[]},{name:"lookahead"}]}}case ra:{return{name:ra,properties:[{name:"cardinality"},{name:"feature"},{name:"lookahead"},{name:"operator"},{name:"terminal"}]}}case ia:{return{name:ia,properties:[{name:"cardinality"},{name:"left"},{name:"lookahead"},{name:"right"}]}}case aa:{return{name:aa,properties:[{name:"cardinality"},{name:"deprecatedSyntax",defaultValue:false},{name:"lookahead"},{name:"terminal"},{name:"type"}]}}case sa:{return{name:sa,properties:[{name:"cardinality"},{name:"lookahead"}]}}case oa:{return{name:oa,properties:[{name:"cardinality"},{name:"elements",defaultValue:[]},{name:"guardCondition"},{name:"lookahead"}]}}case la:{return{name:la,properties:[{name:"cardinality"},{name:"lookahead"},{name:"value"}]}}case ua:{return{name:ua,properties:[{name:"cardinality"},{name:"lookahead"},{name:"terminal"}]}}case ca:{return{name:ca,properties:[{name:"cardinality"},{name:"lookahead"},{name:"regex"}]}}case da:{return{name:da,properties:[{name:"arguments",defaultValue:[]},{name:"cardinality"},{name:"lookahead"},{name:"rule"}]}}case fa:{return{name:fa,properties:[{name:"cardinality"},{name:"elements",defaultValue:[]},{name:"lookahead"}]}}case pa:{return{name:pa,properties:[{name:"cardinality"},{name:"elements",defaultValue:[]},{name:"lookahead"}]}}case ma:{return{name:ma,properties:[{name:"cardinality"},{name:"lookahead"},{name:"rule"}]}}case ha:{return{name:ha,properties:[{name:"cardinality"},{name:"elements",defaultValue:[]},{name:"lookahead"}]}}case ya:{return{name:ya,properties:[{name:"cardinality"},{name:"lookahead"},{name:"terminal"}]}}case ga:{return{name:ga,properties:[{name:"cardinality"},{name:"lookahead"}]}}default:{return{name:e,properties:[]}}}}}const ce=new kg;function H$(t){for(const[e,n]of Object.entries(t)){if(!e.startsWith("$")){if(Array.isArray(n)){n.forEach((r,i)=>{if(rt(r)){r.$container=t;r.$containerProperty=e;r.$containerIndex=i}})}else if(rt(n)){n.$container=t;n.$containerProperty=e}}}}function In(t,e){let n=t;while(n){if(e(n)){return n}n=n.$container}return void 0}function yt(t){const e=lu(t);const n=e.$document;if(!n){throw new Error("AST node has no document.")}return n}function lu(t){while(t.$container){t=t.$container}return t}function Uu(t,e){if(!t){throw new Error("Node must be an AstNode.")}const n=e===null||e===void 0?void 0:e.range;return new tt(()=>({keys:Object.keys(t),keyIndex:0,arrayIndex:0}),r=>{while(r.keyIndex<r.keys.length){const i=r.keys[r.keyIndex];if(!i.startsWith("$")){const a=t[i];if(rt(a)){r.keyIndex++;if(Ld(a,n)){return{done:false,value:a}}}else if(Array.isArray(a)){while(r.arrayIndex<a.length){const s=r.arrayIndex++;const o=a[s];if(rt(o)&&Ld(o,n)){return{done:false,value:o}}}r.arrayIndex=0}}r.keyIndex++}return Dt})}function Nr(t,e){if(!t){throw new Error("Root node must be an AstNode.")}return new au(t,n=>Uu(n,e))}function Yn(t,e){if(!t){throw new Error("Root node must be an AstNode.")}else if((e===null||e===void 0?void 0:e.range)&&!Ld(t,e.range)){return new au(t,()=>[])}return new au(t,n=>Uu(n,e),{includeRoot:true})}function Ld(t,e){var n;if(!e){return true}const r=(n=t.$cstNode)===null||n===void 0?void 0:n.range;if(!r){return false}return Rg(r,e)}function bg(t){return new tt(()=>({keys:Object.keys(t),keyIndex:0,arrayIndex:0}),e=>{while(e.keyIndex<e.keys.length){const n=e.keys[e.keyIndex];if(!n.startsWith("$")){const r=t[n];if(on(r)){e.keyIndex++;return{done:false,value:{reference:r,container:t,property:n}}}else if(Array.isArray(r)){while(e.arrayIndex<r.length){const i=e.arrayIndex++;const a=r[i];if(on(a)){return{done:false,value:{reference:a,container:t,property:n,index:i}}}}e.arrayIndex=0}}e.keyIndex++}return Dt})}function Ng(t,e){const n=t.getTypeMetaData(e.$type);const r=e;for(const i of n.properties){if(i.defaultValue!==void 0&&r[i.name]===void 0){r[i.name]=Pg(i.defaultValue)}}}function Pg(t){if(Array.isArray(t)){return[...t.map(Pg)]}else{return t}}function Z(t){return t.charCodeAt(0)}function mc(t,e){if(Array.isArray(t)){t.forEach(function(n){e.push(n)})}else{e.push(t)}}function si(t,e){if(t[e]===true){throw"duplicate flag "+e}t[e];t[e]=true}function Mr(t){if(t===void 0){throw Error("Internal Error - Should never get here!")}return true}function q$(){throw Error("Internal Error - Should never get here!")}function tm(t){return t["type"]==="Character"}const uu=[];for(let t=Z("0");t<=Z("9");t++){uu.push(t)}const cu=[Z("_")].concat(uu);for(let t=Z("a");t<=Z("z");t++){cu.push(t)}for(let t=Z("A");t<=Z("Z");t++){cu.push(t)}const nm=[Z(" "),Z("\f"),Z("\n"),Z("\r"),Z("	"),Z("\v"),Z("	"),Z(" "),Z(" "),Z(" "),Z(" "),Z(" "),Z(" "),Z(" "),Z(" "),Z(" "),Z(" "),Z(" "),Z(" "),Z(" "),Z("\u2028"),Z("\u2029"),Z(" "),Z(" "),Z("　"),Z("\uFEFF")];const j$=/[0-9a-fA-F]/;const Ms=/[0-9]/;const B$=/[1-9]/;class _g{constructor(){this.idx=0;this.input="";this.groupIdx=0}saveState(){return{idx:this.idx,input:this.input,groupIdx:this.groupIdx}}restoreState(e){this.idx=e.idx;this.input=e.input;this.groupIdx=e.groupIdx}pattern(e){this.idx=0;this.input=e;this.groupIdx=0;this.consumeChar("/");const n=this.disjunction();this.consumeChar("/");const r={type:"Flags",loc:{begin:this.idx,end:e.length},global:false,ignoreCase:false,multiLine:false,unicode:false,sticky:false};while(this.isRegExpFlag()){switch(this.popChar()){case"g":si(r,"global");break;case"i":si(r,"ignoreCase");break;case"m":si(r,"multiLine");break;case"u":si(r,"unicode");break;case"y":si(r,"sticky");break}}if(this.idx!==this.input.length){throw Error("Redundant input: "+this.input.substring(this.idx))}return{type:"Pattern",flags:r,value:n,loc:this.loc(0)}}disjunction(){const e=[];const n=this.idx;e.push(this.alternative());while(this.peekChar()==="|"){this.consumeChar("|");e.push(this.alternative())}return{type:"Disjunction",value:e,loc:this.loc(n)}}alternative(){const e=[];const n=this.idx;while(this.isTerm()){e.push(this.term())}return{type:"Alternative",value:e,loc:this.loc(n)}}term(){if(this.isAssertion()){return this.assertion()}else{return this.atom()}}assertion(){const e=this.idx;switch(this.popChar()){case"^":return{type:"StartAnchor",loc:this.loc(e)};case"$":return{type:"EndAnchor",loc:this.loc(e)};case"\\":switch(this.popChar()){case"b":return{type:"WordBoundary",loc:this.loc(e)};case"B":return{type:"NonWordBoundary",loc:this.loc(e)}}throw Error("Invalid Assertion Escape");case"(":this.consumeChar("?");let n;switch(this.popChar()){case"=":n="Lookahead";break;case"!":n="NegativeLookahead";break}Mr(n);const r=this.disjunction();this.consumeChar(")");return{type:n,value:r,loc:this.loc(e)}}return q$()}quantifier(e=false){let n=void 0;const r=this.idx;switch(this.popChar()){case"*":n={atLeast:0,atMost:Infinity};break;case"+":n={atLeast:1,atMost:Infinity};break;case"?":n={atLeast:0,atMost:1};break;case"{":const i=this.integerIncludingZero();switch(this.popChar()){case"}":n={atLeast:i,atMost:i};break;case",":let a;if(this.isDigit()){a=this.integerIncludingZero();n={atLeast:i,atMost:a}}else{n={atLeast:i,atMost:Infinity}}this.consumeChar("}");break}if(e===true&&n===void 0){return void 0}Mr(n);break}if(e===true&&n===void 0){return void 0}if(Mr(n)){if(this.peekChar(0)==="?"){this.consumeChar("?");n.greedy=false}else{n.greedy=true}n.type="Quantifier";n.loc=this.loc(r);return n}}atom(){let e;const n=this.idx;switch(this.peekChar()){case".":e=this.dotAll();break;case"\\":e=this.atomEscape();break;case"[":e=this.characterClass();break;case"(":e=this.group();break}if(e===void 0&&this.isPatternCharacter()){e=this.patternCharacter()}if(Mr(e)){e.loc=this.loc(n);if(this.isQuantifier()){e.quantifier=this.quantifier()}return e}}dotAll(){this.consumeChar(".");return{type:"Set",complement:true,value:[Z("\n"),Z("\r"),Z("\u2028"),Z("\u2029")]}}atomEscape(){this.consumeChar("\\");switch(this.peekChar()){case"1":case"2":case"3":case"4":case"5":case"6":case"7":case"8":case"9":return this.decimalEscapeAtom();case"d":case"D":case"s":case"S":case"w":case"W":return this.characterClassEscape();case"f":case"n":case"r":case"t":case"v":return this.controlEscapeAtom();case"c":return this.controlLetterEscapeAtom();case"0":return this.nulCharacterAtom();case"x":return this.hexEscapeSequenceAtom();case"u":return this.regExpUnicodeEscapeSequenceAtom();default:return this.identityEscapeAtom()}}decimalEscapeAtom(){const e=this.positiveInteger();return{type:"GroupBackReference",value:e}}characterClassEscape(){let e;let n=false;switch(this.popChar()){case"d":e=uu;break;case"D":e=uu;n=true;break;case"s":e=nm;break;case"S":e=nm;n=true;break;case"w":e=cu;break;case"W":e=cu;n=true;break}if(Mr(e)){return{type:"Set",value:e,complement:n}}}controlEscapeAtom(){let e;switch(this.popChar()){case"f":e=Z("\f");break;case"n":e=Z("\n");break;case"r":e=Z("\r");break;case"t":e=Z("	");break;case"v":e=Z("\v");break}if(Mr(e)){return{type:"Character",value:e}}}controlLetterEscapeAtom(){this.consumeChar("c");const e=this.popChar();if(/[a-zA-Z]/.test(e)===false){throw Error("Invalid ")}const n=e.toUpperCase().charCodeAt(0)-64;return{type:"Character",value:n}}nulCharacterAtom(){this.consumeChar("0");return{type:"Character",value:Z("\0")}}hexEscapeSequenceAtom(){this.consumeChar("x");return this.parseHexDigits(2)}regExpUnicodeEscapeSequenceAtom(){this.consumeChar("u");return this.parseHexDigits(4)}identityEscapeAtom(){const e=this.popChar();return{type:"Character",value:Z(e)}}classPatternCharacterAtom(){switch(this.peekChar()){case"\n":case"\r":case"\u2028":case"\u2029":case"\\":case"]":throw Error("TBD");default:const e=this.popChar();return{type:"Character",value:Z(e)}}}characterClass(){const e=[];let n=false;this.consumeChar("[");if(this.peekChar(0)==="^"){this.consumeChar("^");n=true}while(this.isClassAtom()){const r=this.classAtom();r.type==="Character";if(tm(r)&&this.isRangeDash()){this.consumeChar("-");const i=this.classAtom();i.type==="Character";if(tm(i)){if(i.value<r.value){throw Error("Range out of order in character class")}e.push({from:r.value,to:i.value})}else{mc(r.value,e);e.push(Z("-"));mc(i.value,e)}}else{mc(r.value,e)}}this.consumeChar("]");return{type:"Set",complement:n,value:e}}classAtom(){switch(this.peekChar()){case"]":case"\n":case"\r":case"\u2028":case"\u2029":throw Error("TBD");case"\\":return this.classEscape();default:return this.classPatternCharacterAtom()}}classEscape(){this.consumeChar("\\");switch(this.peekChar()){case"b":this.consumeChar("b");return{type:"Character",value:Z("\b")};case"d":case"D":case"s":case"S":case"w":case"W":return this.characterClassEscape();case"f":case"n":case"r":case"t":case"v":return this.controlEscapeAtom();case"c":return this.controlLetterEscapeAtom();case"0":return this.nulCharacterAtom();case"x":return this.hexEscapeSequenceAtom();case"u":return this.regExpUnicodeEscapeSequenceAtom();default:return this.identityEscapeAtom()}}group(){let e=true;this.consumeChar("(");switch(this.peekChar(0)){case"?":this.consumeChar("?");this.consumeChar(":");e=false;break;default:this.groupIdx++;break}const n=this.disjunction();this.consumeChar(")");const r={type:"Group",capturing:e,value:n};if(e){r["idx"]=this.groupIdx}return r}positiveInteger(){let e=this.popChar();if(B$.test(e)===false){throw Error("Expecting a positive integer")}while(Ms.test(this.peekChar(0))){e+=this.popChar()}return parseInt(e,10)}integerIncludingZero(){let e=this.popChar();if(Ms.test(e)===false){throw Error("Expecting an integer")}while(Ms.test(this.peekChar(0))){e+=this.popChar()}return parseInt(e,10)}patternCharacter(){const e=this.popChar();switch(e){case"\n":case"\r":case"\u2028":case"\u2029":case"^":case"$":case"\\":case".":case"*":case"+":case"?":case"(":case")":case"[":case"|":throw Error("TBD");default:return{type:"Character",value:Z(e)}}}isRegExpFlag(){switch(this.peekChar(0)){case"g":case"i":case"m":case"u":case"y":return true;default:return false}}isRangeDash(){return this.peekChar()==="-"&&this.isClassAtom(1)}isDigit(){return Ms.test(this.peekChar(0))}isClassAtom(e=0){switch(this.peekChar(e)){case"]":case"\n":case"\r":case"\u2028":case"\u2029":return false;default:return true}}isTerm(){return this.isAtom()||this.isAssertion()}isAtom(){if(this.isPatternCharacter()){return true}switch(this.peekChar(0)){case".":case"\\":case"[":case"(":return true;default:return false}}isAssertion(){switch(this.peekChar(0)){case"^":case"$":return true;case"\\":switch(this.peekChar(1)){case"b":case"B":return true;default:return false}case"(":return this.peekChar(1)==="?"&&(this.peekChar(2)==="="||this.peekChar(2)==="!");default:return false}}isQuantifier(){const e=this.saveState();try{return this.quantifier(true)!==void 0}catch(n){return false}finally{this.restoreState(e)}}isPatternCharacter(){switch(this.peekChar()){case"^":case"$":case"\\":case".":case"*":case"+":case"?":case"(":case")":case"[":case"|":case"/":case"\n":case"\r":case"\u2028":case"\u2029":return false;default:return true}}parseHexDigits(e){let n="";for(let i=0;i<e;i++){const a=this.popChar();if(j$.test(a)===false){throw Error("Expecting a HexDecimal digits")}n+=a}const r=parseInt(n,16);return{type:"Character",value:r}}peekChar(e=0){return this.input[this.idx+e]}popChar(){const e=this.peekChar(0);this.consumeChar(void 0);return e}consumeChar(e){if(e!==void 0&&this.input[this.idx]!==e){throw Error("Expected: '"+e+"' but found: '"+this.input[this.idx]+"' at offset: "+this.idx)}if(this.idx>=this.input.length){throw Error("Unexpected end of input")}this.idx++}loc(e){return{begin:e,end:this.idx}}}class Gu{visitChildren(e){for(const n in e){const r=e[n];if(e.hasOwnProperty(n)){if(r.type!==void 0){this.visit(r)}else if(Array.isArray(r)){r.forEach(i=>{this.visit(i)},this)}}}}visit(e){switch(e.type){case"Pattern":this.visitPattern(e);break;case"Flags":this.visitFlags(e);break;case"Disjunction":this.visitDisjunction(e);break;case"Alternative":this.visitAlternative(e);break;case"StartAnchor":this.visitStartAnchor(e);break;case"EndAnchor":this.visitEndAnchor(e);break;case"WordBoundary":this.visitWordBoundary(e);break;case"NonWordBoundary":this.visitNonWordBoundary(e);break;case"Lookahead":this.visitLookahead(e);break;case"NegativeLookahead":this.visitNegativeLookahead(e);break;case"Character":this.visitCharacter(e);break;case"Set":this.visitSet(e);break;case"Group":this.visitGroup(e);break;case"GroupBackReference":this.visitGroupBackReference(e);break;case"Quantifier":this.visitQuantifier(e);break}this.visitChildren(e)}visitPattern(e){}visitFlags(e){}visitDisjunction(e){}visitAlternative(e){}visitStartAnchor(e){}visitEndAnchor(e){}visitWordBoundary(e){}visitNonWordBoundary(e){}visitLookahead(e){}visitNegativeLookahead(e){}visitCharacter(e){}visitSet(e){}visitGroup(e){}visitGroupBackReference(e){}visitQuantifier(e){}}const W$=/\r?\n/gm;const V$=new _g;class z$ extends Gu{constructor(){super(...arguments);this.isStarting=true;this.endRegexpStack=[];this.multiline=false}get endRegex(){return this.endRegexpStack.join("")}reset(e){this.multiline=false;this.regex=e;this.startRegexp="";this.isStarting=true;this.endRegexpStack=[]}visitGroup(e){if(e.quantifier){this.isStarting=false;this.endRegexpStack=[]}}visitCharacter(e){const n=String.fromCharCode(e.value);if(!this.multiline&&n==="\n"){this.multiline=true}if(e.quantifier){this.isStarting=false;this.endRegexpStack=[]}else{const r=Hu(n);this.endRegexpStack.push(r);if(this.isStarting){this.startRegexp+=r}}}visitSet(e){if(!this.multiline){const n=this.regex.substring(e.loc.begin,e.loc.end);const r=new RegExp(n);this.multiline=Boolean("\n".match(r))}if(e.quantifier){this.isStarting=false;this.endRegexpStack=[]}else{const n=this.regex.substring(e.loc.begin,e.loc.end);this.endRegexpStack.push(n);if(this.isStarting){this.startRegexp+=n}}}visitChildren(e){if(e.type==="Group"){const n=e;if(n.quantifier){return}}super.visitChildren(e)}}const hc=new z$;function X$(t){try{if(typeof t==="string"){t=new RegExp(t)}t=t.toString();hc.reset(t);hc.visit(V$.pattern(t));return hc.multiline}catch(e){return false}}const Y$="\f\n\r	\v              \u2028\u2029  　\uFEFF".split("");function du(t){const e=typeof t==="string"?new RegExp(t):t;return Y$.some(n=>e.test(n))}function Hu(t){return t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function J$(t){return Array.prototype.map.call(t,e=>/\w/.test(e)?`[${e.toLowerCase()}${e.toUpperCase()}]`:Hu(e)).join("")}function Q$(t,e){const n=Z$(t);const r=e.match(n);return!!r&&r[0].length>0}function Z$(t){if(typeof t==="string"){t=new RegExp(t)}const e=t,n=t.source;let r=0;function i(){let a="",s;function o(u){a+=n.substr(r,u);r+=u}function l(u){a+="(?:"+n.substr(r,u)+"|$)";r+=u}while(r<n.length){switch(n[r]){case"\\":switch(n[r+1]){case"c":l(3);break;case"x":l(4);break;case"u":if(e.unicode){if(n[r+2]==="{"){l(n.indexOf("}",r)-r+1)}else{l(6)}}else{l(2)}break;case"p":case"P":if(e.unicode){l(n.indexOf("}",r)-r+1)}else{l(2)}break;case"k":l(n.indexOf(">",r)-r+1);break;default:l(2);break}break;case"[":s=/\[(?:\\.|.)*?\]/g;s.lastIndex=r;s=s.exec(n)||[];l(s[0].length);break;case"|":case"^":case"$":case"*":case"+":case"?":o(1);break;case"{":s=/\{\d+,?\d*\}/g;s.lastIndex=r;s=s.exec(n);if(s){o(s[0].length)}else{l(1)}break;case"(":if(n[r+1]==="?"){switch(n[r+2]){case":":a+="(?:";r+=3;a+=i()+"|$)";break;case"=":a+="(?=";r+=3;a+=i()+")";break;case"!":s=r;r+=3;i();a+=n.substr(s,r-s);break;case"<":switch(n[r+3]){case"=":case"!":s=r;r+=4;i();a+=n.substr(s,r-s);break;default:o(n.indexOf(">",r)-r+1);a+=i()+"|$)";break}break}}else{o(1);a+=i()+"|$)"}break;case")":++r;return a;default:l(1);break}}return a}return new RegExp(i(),t.flags)}function xd(t){return t.rules.find(e=>ct(e)&&e.entry)}function eT(t){return t.rules.filter(e=>tr(e)&&e.hidden)}function up(t,e){const n=new Set;const r=xd(t);if(!r){return new Set(t.rules)}const i=[r].concat(eT(t));for(const s of i){Dg(s,n,e)}const a=new Set;for(const s of t.rules){if(n.has(s.name)||tr(s)&&s.hidden){a.add(s)}}return a}function Dg(t,e,n){e.add(t.name);Nr(t).forEach(r=>{if(Mn(r)||n){const i=r.rule.ref;if(i&&!e.has(i.name)){Dg(i,e,n)}}})}function Og(t){if(t.terminal){return t.terminal}else if(t.type.ref){const e=Mg(t.type.ref);return e===null||e===void 0?void 0:e.terminal}return void 0}function tT(t){return t.hidden&&!du(ju(t))}function Ig(t,e){if(!t||!e){return[]}return dp(t,e,t.astNode,true)}function cp(t,e,n){if(!t||!e){return void 0}const r=dp(t,e,t.astNode,true);if(r.length===0){return void 0}if(n!==void 0){n=Math.max(0,Math.min(n,r.length-1))}else{n=0}return r[n]}function dp(t,e,n,r){if(!r){const i=In(t.grammarSource,cn);if(i&&i.feature===e){return[t]}}if(Tr(t)&&t.astNode===n){return t.content.flatMap(i=>dp(i,e,n,false))}return[]}function nT(t,e){if(!t){return[]}return xg(t,e,t===null||t===void 0?void 0:t.astNode)}function Lg(t,e,n){if(!t){return void 0}const r=xg(t,e,t===null||t===void 0?void 0:t.astNode);if(r.length===0){return void 0}if(n!==void 0){n=Math.max(0,Math.min(n,r.length-1))}else{n=0}return r[n]}function xg(t,e,n){if(t.astNode!==n){return[]}if(dn(t.grammarSource)&&t.grammarSource.value===e){return[t]}const r=su(t).iterator();let i;const a=[];do{i=r.next();if(!i.done){const s=i.value;if(s.astNode===n){if(dn(s.grammarSource)&&s.grammarSource.value===e){a.push(s)}}else{r.prune()}}}while(!i.done);return a}function rT(t){var e;const n=t.astNode;while(n===((e=t.container)===null||e===void 0?void 0:e.astNode)){const r=In(t.grammarSource,cn);if(r){return r}t=t.container}return void 0}function Mg(t){let e=t;if(Cg(e)){if(Za(e.$container)){e=e.$container.$container}else if(ct(e.$container)){e=e.$container}else{Qa(e.$container)}}return Fg(t,e,new Map)}function Fg(t,e,n){var r;function i(a,s){let o=void 0;const l=In(a,cn);if(!l){o=Fg(s,s,n)}n.set(t,o);return o}if(n.has(t)){return n.get(t)}n.set(t,void 0);for(const a of Nr(e)){if(cn(a)&&a.feature.toLowerCase()==="name"){n.set(t,a);return a}else if(Mn(a)&&ct(a.rule.ref)){return i(a,a.rule.ref)}else if(D$(a)&&((r=a.typeRef)===null||r===void 0?void 0:r.ref)){return i(a,a.typeRef.ref)}}return void 0}function Ma(t,e){return t==="?"||t==="*"||wr(e)&&Boolean(e.guardCondition)}function iT(t){return t==="*"||t==="+"}function Kg(t){return Ug(t,new Set)}function Ug(t,e){if(e.has(t)){return true}else{e.add(t)}for(const n of Nr(t)){if(Mn(n)){if(!n.rule.ref){return false}if(ct(n.rule.ref)&&!Ug(n.rule.ref,e)){return false}}else if(cn(n)){return false}else if(Za(n)){return false}}return Boolean(t.definition)}function ts(t){if(t.inferredType){return t.inferredType.name}else if(t.dataType){return t.dataType}else if(t.returnType){const e=t.returnType.ref;if(e){if(ct(e)){return e.name}else if(Sg(e)||Ag(e)){return e.name}}}return void 0}function qu(t){var e;if(ct(t)){return Kg(t)?t.name:(e=ts(t))!==null&&e!==void 0?e:t.name}else if(Sg(t)||Ag(t)||_$(t)){return t.name}else if(Za(t)){const n=aT(t);if(n){return n}}else if(Cg(t)){return t.name}throw new Error("Cannot get name of Unknown Type")}function aT(t){var e;if(t.inferredType){return t.inferredType.name}else if((e=t.type)===null||e===void 0?void 0:e.ref){return qu(t.type.ref)}return void 0}function sT(t){var e,n,r;if(tr(t)){return(n=(e=t.type)===null||e===void 0?void 0:e.name)!==null&&n!==void 0?n:"string"}else{return(r=ts(t))!==null&&r!==void 0?r:t.name}}function ju(t){const e={s:false,i:false,u:false};const n=Zr(t.definition,e);const r=Object.entries(e).filter(([,i])=>i).map(([i])=>i).join("");return new RegExp(n,r)}const fp=/[\s\S]/.source;function Zr(t,e){if(M$(t)){return oT(t)}else if(F$(t)){return lT(t)}else if(O$(t)){return dT(t)}else if(K$(t)){const n=t.rule.ref;if(!n){throw new Error("Missing rule reference.")}return Ln(Zr(n.definition),{cardinality:t.cardinality,lookahead:t.lookahead})}else if(L$(t)){return cT(t)}else if(U$(t)){return uT(t)}else if(x$(t)){const n=t.regex.lastIndexOf("/");const r=t.regex.substring(1,n);const i=t.regex.substring(n+1);if(e){e.i=i.includes("i");e.s=i.includes("s");e.u=i.includes("u")}return Ln(r,{cardinality:t.cardinality,lookahead:t.lookahead,wrap:false})}else if(G$(t)){return Ln(fp,{cardinality:t.cardinality,lookahead:t.lookahead})}else{throw new Error(`Invalid terminal element: ${t===null||t===void 0?void 0:t.$type}`)}}function oT(t){return Ln(t.elements.map(e=>Zr(e)).join("|"),{cardinality:t.cardinality,lookahead:t.lookahead})}function lT(t){return Ln(t.elements.map(e=>Zr(e)).join(""),{cardinality:t.cardinality,lookahead:t.lookahead})}function uT(t){return Ln(`${fp}*?${Zr(t.terminal)}`,{cardinality:t.cardinality,lookahead:t.lookahead})}function cT(t){return Ln(`(?!${Zr(t.terminal)})${fp}*?`,{cardinality:t.cardinality,lookahead:t.lookahead})}function dT(t){if(t.right){return Ln(`[${yc(t.left)}-${yc(t.right)}]`,{cardinality:t.cardinality,lookahead:t.lookahead,wrap:false})}return Ln(yc(t.left),{cardinality:t.cardinality,lookahead:t.lookahead,wrap:false})}function yc(t){return Hu(t.value)}function Ln(t,e){var n;if(e.wrap!==false||e.lookahead){t=`(${(n=e.lookahead)!==null&&n!==void 0?n:""}${t})`}if(e.cardinality){return`${t}${e.cardinality}`}return t}function fT(t){const e=[];const n=t.Grammar;for(const r of n.rules){if(tr(r)&&tT(r)&&X$(ju(r))){e.push(r.name)}}return{multilineCommentRules:e,nameRegexp:vg}}var Gg=typeof global=="object"&&global&&global.Object===Object&&global;var pT=typeof self=="object"&&self&&self.Object===Object&&self;var fn=Gg||pT||Function("return this")();var Bt=fn.Symbol;var Hg=Object.prototype;var mT=Hg.hasOwnProperty;var hT=Hg.toString;var oi=Bt?Bt.toStringTag:void 0;function yT(t){var e=mT.call(t,oi),n=t[oi];try{t[oi]=void 0;var r=true}catch(a){}var i=hT.call(t);if(r){if(e){t[oi]=n}else{delete t[oi]}}return i}var gT=Object.prototype;var RT=gT.toString;function vT(t){return RT.call(t)}var $T="[object Null]";var TT="[object Undefined]";var rm=Bt?Bt.toStringTag:void 0;function nr(t){if(t==null){return t===void 0?TT:$T}return rm&&rm in Object(t)?yT(t):vT(t)}function Qt(t){return t!=null&&typeof t=="object"}var ET="[object Symbol]";function ns(t){return typeof t=="symbol"||Qt(t)&&nr(t)==ET}function Bu(t,e){var n=-1,r=t==null?0:t.length,i=Array(r);while(++n<r){i[n]=e(t[n],n,t)}return i}var le=Array.isArray;var im=Bt?Bt.prototype:void 0;var am=im?im.toString:void 0;function qg(t){if(typeof t=="string"){return t}if(le(t)){return Bu(t,qg)+""}if(ns(t)){return am?am.call(t):""}var e=t+"";return e=="0"&&1/t==-Infinity?"-0":e}var wT=/\s/;function CT(t){var e=t.length;while(e--&&wT.test(t.charAt(e))){}return e}var ST=/^\s+/;function AT(t){return t?t.slice(0,CT(t)+1).replace(ST,""):t}function Wt(t){var e=typeof t;return t!=null&&(e=="object"||e=="function")}var sm=0/0;var kT=/^[-+]0x[0-9a-f]+$/i;var bT=/^0b[01]+$/i;var NT=/^0o[0-7]+$/i;var PT=parseInt;function _T(t){if(typeof t=="number"){return t}if(ns(t)){return sm}if(Wt(t)){var e=typeof t.valueOf=="function"?t.valueOf():t;t=Wt(e)?e+"":e}if(typeof t!="string"){return t===0?t:+t}t=AT(t);var n=bT.test(t);return n||NT.test(t)?PT(t.slice(2),n?2:8):kT.test(t)?sm:+t}var DT=1/0;var OT=17976931348623157e292;function IT(t){if(!t){return t===0?t:0}t=_T(t);if(t===DT||t===-Infinity){var e=t<0?-1:1;return e*OT}return t===t?t:0}function Wu(t){var e=IT(t),n=e%1;return e===e?n?e-n:e:0}function Cr(t){return t}var LT="[object AsyncFunction]";var xT="[object Function]";var MT="[object GeneratorFunction]";var FT="[object Proxy]";function Hn(t){if(!Wt(t)){return false}var e=nr(t);return e==xT||e==MT||e==LT||e==FT}var gc=fn["__core-js_shared__"];var om=function(){var t=/[^.]+$/.exec(gc&&gc.keys&&gc.keys.IE_PROTO||"");return t?"Symbol(src)_1."+t:""}();function KT(t){return!!om&&om in t}var UT=Function.prototype;var GT=UT.toString;function Pr(t){if(t!=null){try{return GT.call(t)}catch(e){}try{return t+""}catch(e){}}return""}var HT=/[\\^$.*+?()[\]{}|]/g;var qT=/^\[object .+?Constructor\]$/;var jT=Function.prototype;var BT=Object.prototype;var WT=jT.toString;var VT=BT.hasOwnProperty;var zT=RegExp("^"+WT.call(VT).replace(HT,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");function XT(t){if(!Wt(t)||KT(t)){return false}var e=Hn(t)?zT:qT;return e.test(Pr(t))}function YT(t,e){return t==null?void 0:t[e]}function _r(t,e){var n=YT(t,e);return XT(n)?n:void 0}var Md=_r(fn,"WeakMap");var lm=Object.create;var JT=function(){function t(){}return function(e){if(!Wt(e)){return{}}if(lm){return lm(e)}t.prototype=e;var n=new t;t.prototype=void 0;return n}}();function QT(t,e,n){switch(n.length){case 0:return t.call(e);case 1:return t.call(e,n[0]);case 2:return t.call(e,n[0],n[1]);case 3:return t.call(e,n[0],n[1],n[2])}return t.apply(e,n)}function We(){}function ZT(t,e){var n=-1,r=t.length;e||(e=Array(r));while(++n<r){e[n]=t[n]}return e}var eE=800;var tE=16;var nE=Date.now;function rE(t){var e=0,n=0;return function(){var r=nE(),i=tE-(r-n);n=r;if(i>0){if(++e>=eE){return arguments[0]}}else{e=0}return t.apply(void 0,arguments)}}function iE(t){return function(){return t}}var fu=function(){try{var t=_r(Object,"defineProperty");t({},"",{});return t}catch(e){}}();var aE=!fu?Cr:function(t,e){return fu(t,"toString",{"configurable":true,"enumerable":false,"value":iE(e),"writable":true})};var sE=rE(aE);function jg(t,e){var n=-1,r=t==null?0:t.length;while(++n<r){if(e(t[n],n,t)===false){break}}return t}function Bg(t,e,n,r){var i=t.length,a=n+-1;while(++a<i){if(e(t[a],a,t)){return a}}return-1}function oE(t){return t!==t}function lE(t,e,n){var r=n-1,i=t.length;while(++r<i){if(t[r]===e){return r}}return-1}function pp(t,e,n){return e===e?lE(t,e,n):Bg(t,oE,n)}function Wg(t,e){var n=t==null?0:t.length;return!!n&&pp(t,e,0)>-1}var uE=9007199254740991;var cE=/^(?:0|[1-9]\d*)$/;function Vu(t,e){var n=typeof t;e=e==null?uE:e;return!!e&&(n=="number"||n!="symbol"&&cE.test(t))&&(t>-1&&t%1==0&&t<e)}function mp(t,e,n){if(e=="__proto__"&&fu){fu(t,e,{"configurable":true,"enumerable":true,"value":n,"writable":true})}else{t[e]=n}}function rs(t,e){return t===e||t!==t&&e!==e}var dE=Object.prototype;var fE=dE.hasOwnProperty;function zu(t,e,n){var r=t[e];if(!(fE.call(t,e)&&rs(r,n))||n===void 0&&!(e in t)){mp(t,e,n)}}function hp(t,e,n,r){var i=!n;n||(n={});var a=-1,s=e.length;while(++a<s){var o=e[a];var l=void 0;if(l===void 0){l=t[o]}if(i){mp(n,o,l)}else{zu(n,o,l)}}return n}var um=Math.max;function pE(t,e,n){e=um(e===void 0?t.length-1:e,0);return function(){var r=arguments,i=-1,a=um(r.length-e,0),s=Array(a);while(++i<a){s[i]=r[e+i]}i=-1;var o=Array(e+1);while(++i<e){o[i]=r[i]}o[e]=n(s);return QT(t,this,o)}}function yp(t,e){return sE(pE(t,e,Cr),t+"")}var mE=9007199254740991;function gp(t){return typeof t=="number"&&t>-1&&t%1==0&&t<=mE}function pn(t){return t!=null&&gp(t.length)&&!Hn(t)}function Vg(t,e,n){if(!Wt(n)){return false}var r=typeof e;if(r=="number"?pn(n)&&Vu(e,n.length):r=="string"&&e in n){return rs(n[e],t)}return false}function hE(t){return yp(function(e,n){var r=-1,i=n.length,a=i>1?n[i-1]:void 0,s=i>2?n[2]:void 0;a=t.length>3&&typeof a=="function"?(i--,a):void 0;if(s&&Vg(n[0],n[1],s)){a=i<3?void 0:a;i=1}e=Object(e);while(++r<i){var o=n[r];if(o){t(e,o,r,a)}}return e})}var yE=Object.prototype;function is(t){var e=t&&t.constructor,n=typeof e=="function"&&e.prototype||yE;return t===n}function gE(t,e){var n=-1,r=Array(t);while(++n<t){r[n]=e(n)}return r}var RE="[object Arguments]";function cm(t){return Qt(t)&&nr(t)==RE}var zg=Object.prototype;var vE=zg.hasOwnProperty;var $E=zg.propertyIsEnumerable;var Xu=cm(function(){return arguments}())?cm:function(t){return Qt(t)&&vE.call(t,"callee")&&!$E.call(t,"callee")};function TE(){return false}var Xg=typeof Ot=="object"&&Ot&&!Ot.nodeType&&Ot;var dm=Xg&&typeof It=="object"&&It&&!It.nodeType&&It;var EE=dm&&dm.exports===Xg;var fm=EE?fn.Buffer:void 0;var wE=fm?fm.isBuffer:void 0;var Fa=wE||TE;var CE="[object Arguments]";var SE="[object Array]";var AE="[object Boolean]";var kE="[object Date]";var bE="[object Error]";var NE="[object Function]";var PE="[object Map]";var _E="[object Number]";var DE="[object Object]";var OE="[object RegExp]";var IE="[object Set]";var LE="[object String]";var xE="[object WeakMap]";var ME="[object ArrayBuffer]";var FE="[object DataView]";var KE="[object Float32Array]";var UE="[object Float64Array]";var GE="[object Int8Array]";var HE="[object Int16Array]";var qE="[object Int32Array]";var jE="[object Uint8Array]";var BE="[object Uint8ClampedArray]";var WE="[object Uint16Array]";var VE="[object Uint32Array]";var Te={};Te[KE]=Te[UE]=Te[GE]=Te[HE]=Te[qE]=Te[jE]=Te[BE]=Te[WE]=Te[VE]=true;Te[CE]=Te[SE]=Te[ME]=Te[AE]=Te[FE]=Te[kE]=Te[bE]=Te[NE]=Te[PE]=Te[_E]=Te[DE]=Te[OE]=Te[IE]=Te[LE]=Te[xE]=false;function zE(t){return Qt(t)&&gp(t.length)&&!!Te[nr(t)]}function Yu(t){return function(e){return t(e)}}var Yg=typeof Ot=="object"&&Ot&&!Ot.nodeType&&Ot;var La=Yg&&typeof It=="object"&&It&&!It.nodeType&&It;var XE=La&&La.exports===Yg;var Rc=XE&&Gg.process;var Jn=function(){try{var t=La&&La.require&&La.require("util").types;if(t){return t}return Rc&&Rc.binding&&Rc.binding("util")}catch(e){}}();var pm=Jn&&Jn.isTypedArray;var Rp=pm?Yu(pm):zE;var YE=Object.prototype;var JE=YE.hasOwnProperty;function Jg(t,e){var n=le(t),r=!n&&Xu(t),i=!n&&!r&&Fa(t),a=!n&&!r&&!i&&Rp(t),s=n||r||i||a,o=s?gE(t.length,String):[],l=o.length;for(var u in t){if((e||JE.call(t,u))&&!(s&&(u=="length"||i&&(u=="offset"||u=="parent")||a&&(u=="buffer"||u=="byteLength"||u=="byteOffset")||Vu(u,l)))){o.push(u)}}return o}function Qg(t,e){return function(n){return t(e(n))}}var QE=Qg(Object.keys,Object);var ZE=Object.prototype;var ew=ZE.hasOwnProperty;function Zg(t){if(!is(t)){return QE(t)}var e=[];for(var n in Object(t)){if(ew.call(t,n)&&n!="constructor"){e.push(n)}}return e}function Vt(t){return pn(t)?Jg(t):Zg(t)}var tw=Object.prototype;var nw=tw.hasOwnProperty;var xt=hE(function(t,e){if(is(e)||pn(e)){hp(e,Vt(e),t);return}for(var n in e){if(nw.call(e,n)){zu(t,n,e[n])}}});function rw(t){var e=[];if(t!=null){for(var n in Object(t)){e.push(n)}}return e}var iw=Object.prototype;var aw=iw.hasOwnProperty;function sw(t){if(!Wt(t)){return rw(t)}var e=is(t),n=[];for(var r in t){if(!(r=="constructor"&&(e||!aw.call(t,r)))){n.push(r)}}return n}function eR(t){return pn(t)?Jg(t,true):sw(t)}var ow=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;var lw=/^\w*$/;function vp(t,e){if(le(t)){return false}var n=typeof t;if(n=="number"||n=="symbol"||n=="boolean"||t==null||ns(t)){return true}return lw.test(t)||!ow.test(t)||e!=null&&t in Object(e)}var Ka=_r(Object,"create");function uw(){this.__data__=Ka?Ka(null):{};this.size=0}function cw(t){var e=this.has(t)&&delete this.__data__[t];this.size-=e?1:0;return e}var dw="__lodash_hash_undefined__";var fw=Object.prototype;var pw=fw.hasOwnProperty;function mw(t){var e=this.__data__;if(Ka){var n=e[t];return n===dw?void 0:n}return pw.call(e,t)?e[t]:void 0}var hw=Object.prototype;var yw=hw.hasOwnProperty;function gw(t){var e=this.__data__;return Ka?e[t]!==void 0:yw.call(e,t)}var Rw="__lodash_hash_undefined__";function vw(t,e){var n=this.__data__;this.size+=this.has(t)?0:1;n[t]=Ka&&e===void 0?Rw:e;return this}function Sr(t){var e=-1,n=t==null?0:t.length;this.clear();while(++e<n){var r=t[e];this.set(r[0],r[1])}}Sr.prototype.clear=uw;Sr.prototype["delete"]=cw;Sr.prototype.get=mw;Sr.prototype.has=gw;Sr.prototype.set=vw;function $w(){this.__data__=[];this.size=0}function Ju(t,e){var n=t.length;while(n--){if(rs(t[n][0],e)){return n}}return-1}var Tw=Array.prototype;var Ew=Tw.splice;function ww(t){var e=this.__data__,n=Ju(e,t);if(n<0){return false}var r=e.length-1;if(n==r){e.pop()}else{Ew.call(e,n,1)}--this.size;return true}function Cw(t){var e=this.__data__,n=Ju(e,t);return n<0?void 0:e[n][1]}function Sw(t){return Ju(this.__data__,t)>-1}function Aw(t,e){var n=this.__data__,r=Ju(n,t);if(r<0){++this.size;n.push([t,e])}else{n[r][1]=e}return this}function qn(t){var e=-1,n=t==null?0:t.length;this.clear();while(++e<n){var r=t[e];this.set(r[0],r[1])}}qn.prototype.clear=$w;qn.prototype["delete"]=ww;qn.prototype.get=Cw;qn.prototype.has=Sw;qn.prototype.set=Aw;var Ua=_r(fn,"Map");function kw(){this.size=0;this.__data__={"hash":new Sr,"map":new(Ua||qn),"string":new Sr}}function bw(t){var e=typeof t;return e=="string"||e=="number"||e=="symbol"||e=="boolean"?t!=="__proto__":t===null}function Qu(t,e){var n=t.__data__;return bw(e)?n[typeof e=="string"?"string":"hash"]:n.map}function Nw(t){var e=Qu(this,t)["delete"](t);this.size-=e?1:0;return e}function Pw(t){return Qu(this,t).get(t)}function _w(t){return Qu(this,t).has(t)}function Dw(t,e){var n=Qu(this,t),r=n.size;n.set(t,e);this.size+=n.size==r?0:1;return this}function jn(t){var e=-1,n=t==null?0:t.length;this.clear();while(++e<n){var r=t[e];this.set(r[0],r[1])}}jn.prototype.clear=kw;jn.prototype["delete"]=Nw;jn.prototype.get=Pw;jn.prototype.has=_w;jn.prototype.set=Dw;var Ow="Expected a function";function $p(t,e){if(typeof t!="function"||e!=null&&typeof e!="function"){throw new TypeError(Ow)}var n=function(){var r=arguments,i=e?e.apply(this,r):r[0],a=n.cache;if(a.has(i)){return a.get(i)}var s=t.apply(this,r);n.cache=a.set(i,s)||a;return s};n.cache=new($p.Cache||jn);return n}$p.Cache=jn;var Iw=500;function Lw(t){var e=$p(t,function(r){if(n.size===Iw){n.clear()}return r});var n=e.cache;return e}var xw=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;var Mw=/\\(\\)?/g;var Fw=Lw(function(t){var e=[];if(t.charCodeAt(0)===46){e.push("")}t.replace(xw,function(n,r,i,a){e.push(i?a.replace(Mw,"$1"):r||n)});return e});function Kw(t){return t==null?"":qg(t)}function Zu(t,e){if(le(t)){return t}return vp(t,e)?[t]:Fw(Kw(t))}function as(t){if(typeof t=="string"||ns(t)){return t}var e=t+"";return e=="0"&&1/t==-Infinity?"-0":e}function Tp(t,e){e=Zu(e,t);var n=0,r=e.length;while(t!=null&&n<r){t=t[as(e[n++])]}return n&&n==r?t:void 0}function Uw(t,e,n){var r=t==null?void 0:Tp(t,e);return r===void 0?n:r}function Ep(t,e){var n=-1,r=e.length,i=t.length;while(++n<r){t[i+n]=e[n]}return t}var mm=Bt?Bt.isConcatSpreadable:void 0;function Gw(t){return le(t)||Xu(t)||!!(mm&&t&&t[mm])}function wp(t,e,n,r,i){var a=-1,s=t.length;n||(n=Gw);i||(i=[]);while(++a<s){var o=t[a];if(n(o)){{Ep(i,o)}}else if(!r){i[i.length]=o}}return i}function jt(t){var e=t==null?0:t.length;return e?wp(t):[]}var tR=Qg(Object.getPrototypeOf,Object);function nR(t,e,n){var r=-1,i=t.length;if(e<0){e=-e>i?0:i+e}n=n>i?i:n;if(n<0){n+=i}i=e>n?0:n-e>>>0;e>>>=0;var a=Array(i);while(++r<i){a[r]=t[r+e]}return a}function Hw(t,e,n,r){var i=-1,a=t==null?0:t.length;if(r&&a){n=t[++i]}while(++i<a){n=e(n,t[i],i,t)}return n}function qw(){this.__data__=new qn;this.size=0}function jw(t){var e=this.__data__,n=e["delete"](t);this.size=e.size;return n}function Bw(t){return this.__data__.get(t)}function Ww(t){return this.__data__.has(t)}var Vw=200;function zw(t,e){var n=this.__data__;if(n instanceof qn){var r=n.__data__;if(!Ua||r.length<Vw-1){r.push([t,e]);this.size=++n.size;return this}n=this.__data__=new jn(r)}n.set(t,e);this.size=n.size;return this}function ln(t){var e=this.__data__=new qn(t);this.size=e.size}ln.prototype.clear=qw;ln.prototype["delete"]=jw;ln.prototype.get=Bw;ln.prototype.has=Ww;ln.prototype.set=zw;function Xw(t,e){return t&&hp(e,Vt(e),t)}var rR=typeof Ot=="object"&&Ot&&!Ot.nodeType&&Ot;var hm=rR&&typeof It=="object"&&It&&!It.nodeType&&It;var Yw=hm&&hm.exports===rR;var ym=Yw?fn.Buffer:void 0;var gm=ym?ym.allocUnsafe:void 0;function Jw(t,e){var n=t.length,r=gm?gm(n):new t.constructor(n);t.copy(r);return r}function Cp(t,e){var n=-1,r=t==null?0:t.length,i=0,a=[];while(++n<r){var s=t[n];if(e(s,n,t)){a[i++]=s}}return a}function iR(){return[]}var Qw=Object.prototype;var Zw=Qw.propertyIsEnumerable;var Rm=Object.getOwnPropertySymbols;var Sp=!Rm?iR:function(t){if(t==null){return[]}t=Object(t);return Cp(Rm(t),function(e){return Zw.call(t,e)})};function eC(t,e){return hp(t,Sp(t),e)}var tC=Object.getOwnPropertySymbols;var nC=!tC?iR:function(t){var e=[];while(t){Ep(e,Sp(t));t=tR(t)}return e};function aR(t,e,n){var r=e(t);return le(t)?r:Ep(r,n(t))}function Fd(t){return aR(t,Vt,Sp)}function rC(t){return aR(t,eR,nC)}var Kd=_r(fn,"DataView");var Ud=_r(fn,"Promise");var Gr=_r(fn,"Set");var vm="[object Map]";var iC="[object Object]";var $m="[object Promise]";var Tm="[object Set]";var Em="[object WeakMap]";var wm="[object DataView]";var aC=Pr(Kd);var sC=Pr(Ua);var oC=Pr(Ud);var lC=Pr(Gr);var uC=Pr(Md);var Ht=nr;if(Kd&&Ht(new Kd(new ArrayBuffer(1)))!=wm||Ua&&Ht(new Ua)!=vm||Ud&&Ht(Ud.resolve())!=$m||Gr&&Ht(new Gr)!=Tm||Md&&Ht(new Md)!=Em){Ht=function(t){var e=nr(t),n=e==iC?t.constructor:void 0,r=n?Pr(n):"";if(r){switch(r){case aC:return wm;case sC:return vm;case oC:return $m;case lC:return Tm;case uC:return Em}}return e}}var cC=Object.prototype;var dC=cC.hasOwnProperty;function fC(t){var e=t.length,n=new t.constructor(e);if(e&&typeof t[0]=="string"&&dC.call(t,"index")){n.index=t.index;n.input=t.input}return n}var pu=fn.Uint8Array;function pC(t){var e=new t.constructor(t.byteLength);new pu(e).set(new pu(t));return e}function mC(t,e){var n=t.buffer;return new t.constructor(n,t.byteOffset,t.byteLength)}var hC=/\w*$/;function yC(t){var e=new t.constructor(t.source,hC.exec(t));e.lastIndex=t.lastIndex;return e}var Cm=Bt?Bt.prototype:void 0;var Sm=Cm?Cm.valueOf:void 0;function gC(t){return Sm?Object(Sm.call(t)):{}}function RC(t,e){var n=t.buffer;return new t.constructor(n,t.byteOffset,t.length)}var vC="[object Boolean]";var $C="[object Date]";var TC="[object Map]";var EC="[object Number]";var wC="[object RegExp]";var CC="[object Set]";var SC="[object String]";var AC="[object Symbol]";var kC="[object ArrayBuffer]";var bC="[object DataView]";var NC="[object Float32Array]";var PC="[object Float64Array]";var _C="[object Int8Array]";var DC="[object Int16Array]";var OC="[object Int32Array]";var IC="[object Uint8Array]";var LC="[object Uint8ClampedArray]";var xC="[object Uint16Array]";var MC="[object Uint32Array]";function FC(t,e,n){var r=t.constructor;switch(e){case kC:return pC(t);case vC:case $C:return new r(+t);case bC:return mC(t);case NC:case PC:case _C:case DC:case OC:case IC:case LC:case xC:case MC:return RC(t);case TC:return new r;case EC:case SC:return new r(t);case wC:return yC(t);case CC:return new r;case AC:return gC(t)}}function KC(t){return typeof t.constructor=="function"&&!is(t)?JT(tR(t)):{}}var UC="[object Map]";function GC(t){return Qt(t)&&Ht(t)==UC}var Am=Jn&&Jn.isMap;var HC=Am?Yu(Am):GC;var qC="[object Set]";function jC(t){return Qt(t)&&Ht(t)==qC}var km=Jn&&Jn.isSet;var BC=km?Yu(km):jC;var sR="[object Arguments]";var WC="[object Array]";var VC="[object Boolean]";var zC="[object Date]";var XC="[object Error]";var oR="[object Function]";var YC="[object GeneratorFunction]";var JC="[object Map]";var QC="[object Number]";var lR="[object Object]";var ZC="[object RegExp]";var eS="[object Set]";var tS="[object String]";var nS="[object Symbol]";var rS="[object WeakMap]";var iS="[object ArrayBuffer]";var aS="[object DataView]";var sS="[object Float32Array]";var oS="[object Float64Array]";var lS="[object Int8Array]";var uS="[object Int16Array]";var cS="[object Int32Array]";var dS="[object Uint8Array]";var fS="[object Uint8ClampedArray]";var pS="[object Uint16Array]";var mS="[object Uint32Array]";var ve={};ve[sR]=ve[WC]=ve[iS]=ve[aS]=ve[VC]=ve[zC]=ve[sS]=ve[oS]=ve[lS]=ve[uS]=ve[cS]=ve[JC]=ve[QC]=ve[lR]=ve[ZC]=ve[eS]=ve[tS]=ve[nS]=ve[dS]=ve[fS]=ve[pS]=ve[mS]=true;ve[XC]=ve[oR]=ve[rS]=false;function ql(t,e,n,r,i,a){var s;if(s!==void 0){return s}if(!Wt(t)){return t}var o=le(t);if(o){s=fC(t);{return ZT(t,s)}}else{var l=Ht(t),u=l==oR||l==YC;if(Fa(t)){return Jw(t)}if(l==lR||l==sR||u&&!i){s=u?{}:KC(t);{return eC(t,Xw(s,t))}}else{if(!ve[l]){return i?t:{}}s=FC(t,l)}}a||(a=new ln);var c=a.get(t);if(c){return c}a.set(t,s);if(BC(t)){t.forEach(function(p){s.add(ql(p,e,n,p,t,a))})}else if(HC(t)){t.forEach(function(p,y){s.set(y,ql(p,e,n,y,t,a))})}var d=Fd;var f=o?void 0:d(t);jg(f||t,function(p,y){if(f){y=p;p=t[y]}zu(s,y,ql(p,e,n,y,t,a))});return s}var hS=4;function at(t){return ql(t,hS)}function ss(t){var e=-1,n=t==null?0:t.length,r=0,i=[];while(++e<n){var a=t[e];if(a){i[r++]=a}}return i}var yS="__lodash_hash_undefined__";function gS(t){this.__data__.set(t,yS);return this}function RS(t){return this.__data__.has(t)}function jr(t){var e=-1,n=t==null?0:t.length;this.__data__=new jn;while(++e<n){this.add(t[e])}}jr.prototype.add=jr.prototype.push=gS;jr.prototype.has=RS;function uR(t,e){var n=-1,r=t==null?0:t.length;while(++n<r){if(e(t[n],n,t)){return true}}return false}function Ap(t,e){return t.has(e)}var vS=1;var $S=2;function cR(t,e,n,r,i,a){var s=n&vS,o=t.length,l=e.length;if(o!=l&&!(s&&l>o)){return false}var u=a.get(t);var c=a.get(e);if(u&&c){return u==e&&c==t}var d=-1,f=true,p=n&$S?new jr:void 0;a.set(t,e);a.set(e,t);while(++d<o){var y=t[d],v=e[d];if(r){var k=s?r(v,y,d,e,t,a):r(y,v,d,t,e,a)}if(k!==void 0){if(k){continue}f=false;break}if(p){if(!uR(e,function($,E){if(!Ap(p,E)&&(y===$||i(y,$,n,r,a))){return p.push(E)}})){f=false;break}}else if(!(y===v||i(y,v,n,r,a))){f=false;break}}a["delete"](t);a["delete"](e);return f}function TS(t){var e=-1,n=Array(t.size);t.forEach(function(r,i){n[++e]=[i,r]});return n}function kp(t){var e=-1,n=Array(t.size);t.forEach(function(r){n[++e]=r});return n}var ES=1;var wS=2;var CS="[object Boolean]";var SS="[object Date]";var AS="[object Error]";var kS="[object Map]";var bS="[object Number]";var NS="[object RegExp]";var PS="[object Set]";var _S="[object String]";var DS="[object Symbol]";var OS="[object ArrayBuffer]";var IS="[object DataView]";var bm=Bt?Bt.prototype:void 0;var vc=bm?bm.valueOf:void 0;function LS(t,e,n,r,i,a,s){switch(n){case IS:if(t.byteLength!=e.byteLength||t.byteOffset!=e.byteOffset){return false}t=t.buffer;e=e.buffer;case OS:if(t.byteLength!=e.byteLength||!a(new pu(t),new pu(e))){return false}return true;case CS:case SS:case bS:return rs(+t,+e);case AS:return t.name==e.name&&t.message==e.message;case NS:case _S:return t==e+"";case kS:var o=TS;case PS:var l=r&ES;o||(o=kp);if(t.size!=e.size&&!l){return false}var u=s.get(t);if(u){return u==e}r|=wS;s.set(t,e);var c=cR(o(t),o(e),r,i,a,s);s["delete"](t);return c;case DS:if(vc){return vc.call(t)==vc.call(e)}}return false}var xS=1;var MS=Object.prototype;var FS=MS.hasOwnProperty;function KS(t,e,n,r,i,a){var s=n&xS,o=Fd(t),l=o.length,u=Fd(e),c=u.length;if(l!=c&&!s){return false}var d=l;while(d--){var f=o[d];if(!(s?f in e:FS.call(e,f))){return false}}var p=a.get(t);var y=a.get(e);if(p&&y){return p==e&&y==t}var v=true;a.set(t,e);a.set(e,t);var k=s;while(++d<l){f=o[d];var $=t[f],E=e[f];if(r){var C=s?r(E,$,f,e,t,a):r($,E,f,t,e,a)}if(!(C===void 0?$===E||i($,E,n,r,a):C)){v=false;break}k||(k=f=="constructor")}if(v&&!k){var I=t.constructor,Y=e.constructor;if(I!=Y&&("constructor"in t&&"constructor"in e)&&!(typeof I=="function"&&I instanceof I&&typeof Y=="function"&&Y instanceof Y)){v=false}}a["delete"](t);a["delete"](e);return v}var US=1;var Nm="[object Arguments]";var Pm="[object Array]";var Fs="[object Object]";var GS=Object.prototype;var _m=GS.hasOwnProperty;function HS(t,e,n,r,i,a){var s=le(t),o=le(e),l=s?Pm:Ht(t),u=o?Pm:Ht(e);l=l==Nm?Fs:l;u=u==Nm?Fs:u;var c=l==Fs,d=u==Fs,f=l==u;if(f&&Fa(t)){if(!Fa(e)){return false}s=true;c=false}if(f&&!c){a||(a=new ln);return s||Rp(t)?cR(t,e,n,r,i,a):LS(t,e,l,n,r,i,a)}if(!(n&US)){var p=c&&_m.call(t,"__wrapped__"),y=d&&_m.call(e,"__wrapped__");if(p||y){var v=p?t.value():t,k=y?e.value():e;a||(a=new ln);return i(v,k,n,r,a)}}if(!f){return false}a||(a=new ln);return KS(t,e,n,r,i,a)}function bp(t,e,n,r,i){if(t===e){return true}if(t==null||e==null||!Qt(t)&&!Qt(e)){return t!==t&&e!==e}return HS(t,e,n,r,bp,i)}var qS=1;var jS=2;function BS(t,e,n,r){var i=n.length,a=i;if(t==null){return!a}t=Object(t);while(i--){var s=n[i];if(s[2]?s[1]!==t[s[0]]:!(s[0]in t)){return false}}while(++i<a){s=n[i];var o=s[0],l=t[o],u=s[1];if(s[2]){if(l===void 0&&!(o in t)){return false}}else{var c=new ln;var d;if(!(d===void 0?bp(u,l,qS|jS,r,c):d)){return false}}}return true}function dR(t){return t===t&&!Wt(t)}function WS(t){var e=Vt(t),n=e.length;while(n--){var r=e[n],i=t[r];e[n]=[r,i,dR(i)]}return e}function fR(t,e){return function(n){if(n==null){return false}return n[t]===e&&(e!==void 0||t in Object(n))}}function VS(t){var e=WS(t);if(e.length==1&&e[0][2]){return fR(e[0][0],e[0][1])}return function(n){return n===t||BS(n,t,e)}}function zS(t,e){return t!=null&&e in Object(t)}function pR(t,e,n){e=Zu(e,t);var r=-1,i=e.length,a=false;while(++r<i){var s=as(e[r]);if(!(a=t!=null&&n(t,s))){break}t=t[s]}if(a||++r!=i){return a}i=t==null?0:t.length;return!!i&&gp(i)&&Vu(s,i)&&(le(t)||Xu(t))}function XS(t,e){return t!=null&&pR(t,e,zS)}var YS=1;var JS=2;function QS(t,e){if(vp(t)&&dR(e)){return fR(as(t),e)}return function(n){var r=Uw(n,t);return r===void 0&&r===e?XS(n,t):bp(e,r,YS|JS)}}function ZS(t){return function(e){return e==null?void 0:e[t]}}function eA(t){return function(e){return Tp(e,t)}}function tA(t){return vp(t)?ZS(as(t)):eA(t)}function en(t){if(typeof t=="function"){return t}if(t==null){return Cr}if(typeof t=="object"){return le(t)?QS(t[0],t[1]):VS(t)}return tA(t)}function nA(t,e,n,r){var i=-1,a=t==null?0:t.length;while(++i<a){var s=t[i];e(r,s,n(s),t)}return r}function rA(t){return function(e,n,r){var i=-1,a=Object(e),s=r(e),o=s.length;while(o--){var l=s[++i];if(n(a[l],l,a)===false){break}}return e}}var iA=rA();function aA(t,e){return t&&iA(t,e,Vt)}function sA(t,e){return function(n,r){if(n==null){return n}if(!pn(n)){return t(n,r)}var i=n.length,a=-1,s=Object(n);while(++a<i){if(r(s[a],a,s)===false){break}}return n}}var Dr=sA(aA);function oA(t,e,n,r){Dr(t,function(i,a,s){e(r,i,n(i),s)});return r}function lA(t,e){return function(n,r){var i=le(n)?nA:oA,a=e?e():{};return i(n,t,en(r),a)}}var mR=Object.prototype;var uA=mR.hasOwnProperty;var Np=yp(function(t,e){t=Object(t);var n=-1;var r=e.length;var i=r>2?e[2]:void 0;if(i&&Vg(e[0],e[1],i)){r=1}while(++n<r){var a=e[n];var s=eR(a);var o=-1;var l=s.length;while(++o<l){var u=s[o];var c=t[u];if(c===void 0||rs(c,mR[u])&&!uA.call(t,u)){t[u]=a[u]}}}return t});function Dm(t){return Qt(t)&&pn(t)}var cA=200;function dA(t,e,n,r){var i=-1,a=Wg,s=true,o=t.length,l=[],u=e.length;if(!o){return l}if(e.length>=cA){a=Ap;s=false;e=new jr(e)}e:while(++i<o){var c=t[i],d=c;c=c!==0?c:0;if(s&&d===d){var f=u;while(f--){if(e[f]===d){continue e}}l.push(c)}else if(!a(e,d,r)){l.push(c)}}return l}var ec=yp(function(t,e){return Dm(t)?dA(t,wp(e,1,Dm,true)):[]});function Br(t){var e=t==null?0:t.length;return e?t[e-1]:void 0}function et(t,e,n){var r=t==null?0:t.length;if(!r){return[]}e=e===void 0?1:Wu(e);return nR(t,e<0?0:e,r)}function Ga(t,e,n){var r=t==null?0:t.length;if(!r){return[]}e=e===void 0?1:Wu(e);e=r-e;return nR(t,0,e<0?0:e)}function fA(t){return typeof t=="function"?t:Cr}function X(t,e){var n=le(t)?jg:Dr;return n(t,fA(e))}function pA(t,e){var n=-1,r=t==null?0:t.length;while(++n<r){if(!e(t[n],n,t)){return false}}return true}function mA(t,e){var n=true;Dr(t,function(r,i,a){n=!!e(r,i,a);return n});return n}function Yt(t,e,n){var r=le(t)?pA:mA;return r(t,en(e))}function hR(t,e){var n=[];Dr(t,function(r,i,a){if(e(r,i,a)){n.push(r)}});return n}function Mt(t,e){var n=le(t)?Cp:hR;return n(t,en(e))}function hA(t){return function(e,n,r){var i=Object(e);if(!pn(e)){var a=en(n);e=Vt(e);n=function(o){return a(i[o],o,i)}}var s=t(e,n,r);return s>-1?i[a?e[s]:s]:void 0}}var yA=Math.max;function gA(t,e,n){var r=t==null?0:t.length;if(!r){return-1}var i=n==null?0:Wu(n);if(i<0){i=yA(r+i,0)}return Bg(t,en(e),i)}var Wr=hA(gA);function Zt(t){return t&&t.length?t[0]:void 0}function RA(t,e){var n=-1,r=pn(t)?Array(t.length):[];Dr(t,function(i,a,s){r[++n]=e(i,a,s)});return r}function H(t,e){var n=le(t)?Bu:RA;return n(t,en(e))}function Lt(t,e){return wp(H(t,e))}var vA=Object.prototype;var $A=vA.hasOwnProperty;var TA=lA(function(t,e,n){if($A.call(t,n)){t[n].push(e)}else{mp(t,n,[e])}});var EA=Object.prototype;var wA=EA.hasOwnProperty;function CA(t,e){return t!=null&&wA.call(t,e)}function Q(t,e){return t!=null&&pR(t,e,CA)}var SA="[object String]";function wt(t){return typeof t=="string"||!le(t)&&Qt(t)&&nr(t)==SA}function AA(t,e){return Bu(e,function(n){return t[n]})}function Ve(t){return t==null?[]:AA(t,Vt(t))}var kA=Math.max;function $t(t,e,n,r){t=pn(t)?t:Ve(t);n=n&&true?Wu(n):0;var i=t.length;if(n<0){n=kA(i+n,0)}return wt(t)?n<=i&&t.indexOf(e,n)>-1:!!i&&pp(t,e,n)>-1}function Om(t,e,n){var r=t==null?0:t.length;if(!r){return-1}var i=0;return pp(t,e,i)}var bA="[object Map]";var NA="[object Set]";var PA=Object.prototype;var _A=PA.hasOwnProperty;function ge(t){if(t==null){return true}if(pn(t)&&(le(t)||typeof t=="string"||typeof t.splice=="function"||Fa(t)||Rp(t)||Xu(t))){return!t.length}var e=Ht(t);if(e==bA||e==NA){return!t.size}if(is(t)){return!Zg(t).length}for(var n in t){if(_A.call(t,n)){return false}}return true}var DA="[object RegExp]";function OA(t){return Qt(t)&&nr(t)==DA}var Im=Jn&&Jn.isRegExp;var Fn=Im?Yu(Im):OA;function Kn(t){return t===void 0}function IA(t,e){return t<e}function LA(t,e,n){var r=-1,i=t.length;while(++r<i){var a=t[r],s=e(a);if(s!=null&&(o===void 0?s===s&&!ns(s):n(s,o))){var o=s,l=a}}return l}function xA(t){return t&&t.length?LA(t,Cr,IA):void 0}var MA="Expected a function";function FA(t){if(typeof t!="function"){throw new TypeError(MA)}return function(){var e=arguments;switch(e.length){case 0:return!t.call(this);case 1:return!t.call(this,e[0]);case 2:return!t.call(this,e[0],e[1]);case 3:return!t.call(this,e[0],e[1],e[2])}return!t.apply(this,e)}}function KA(t,e,n,r){if(!Wt(t)){return t}e=Zu(e,t);var i=-1,a=e.length,s=a-1,o=t;while(o!=null&&++i<a){var l=as(e[i]),u=n;if(l==="__proto__"||l==="constructor"||l==="prototype"){return t}if(i!=s){var c=o[l];u=void 0;if(u===void 0){u=Wt(c)?c:Vu(e[i+1])?[]:{}}}zu(o,l,u);o=o[l]}return t}function UA(t,e,n){var r=-1,i=e.length,a={};while(++r<i){var s=e[r],o=Tp(t,s);if(n(o,s)){KA(a,Zu(s,t),o)}}return a}function tn(t,e){if(t==null){return{}}var n=Bu(rC(t),function(r){return[r]});e=en(e);return UA(t,n,function(r,i){return e(r,i[0])})}function GA(t,e,n,r,i){i(t,function(a,s,o){n=r?(r=false,a):e(n,a,s,o)});return n}function gt(t,e,n){var r=le(t)?Hw:GA,i=arguments.length<3;return r(t,en(e),n,i,Dr)}function tc(t,e){var n=le(t)?Cp:hR;return n(t,FA(en(e)))}function HA(t,e){var n;Dr(t,function(r,i,a){n=e(r,i,a);return!n});return!!n}function yR(t,e,n){var r=le(t)?uR:HA;return r(t,en(e))}var qA=1/0;var jA=!(Gr&&1/kp(new Gr([,-0]))[1]==qA)?We:function(t){return new Gr(t)};var BA=200;function gR(t,e,n){var r=-1,i=Wg,a=t.length,s=true,o=[],l=o;if(a>=BA){var u=e?null:jA(t);if(u){return kp(u)}s=false;i=Ap;l=new jr}else{l=e?[]:o}e:while(++r<a){var c=t[r],d=e?e(c):c;c=c!==0?c:0;if(s&&d===d){var f=l.length;while(f--){if(l[f]===d){continue e}}if(e){l.push(d)}o.push(c)}else if(!i(l,d,n)){if(l!==o){l.push(d)}o.push(c)}}return o}function Pp(t){return t&&t.length?gR(t):[]}function WA(t,e){return t&&t.length?gR(t,en(e)):[]}function Gd(t){if(console&&console.error){console.error(`Error: ${t}`)}}function RR(t){if(console&&console.warn){console.warn(`Warning: ${t}`)}}function vR(t){const e=new Date().getTime();const n=t();const r=new Date().getTime();const i=r-e;return{time:i,value:n}}function $R(t){function e(){}e.prototype=t;const n=new e;function r(){return typeof n.bar}r();r();return t}function VA(t){if(zA(t)){return t.LABEL}else{return t.name}}function zA(t){return wt(t.LABEL)&&t.LABEL!==""}class mn{get definition(){return this._definition}set definition(e){this._definition=e}constructor(e){this._definition=e}accept(e){e.visit(this);X(this.definition,n=>{n.accept(e)})}}class Rt extends mn{constructor(e){super([]);this.idx=1;xt(this,tn(e,n=>n!==void 0))}set definition(e){}get definition(){if(this.referencedRule!==void 0){return this.referencedRule.definition}return[]}accept(e){e.visit(this)}}class ei extends mn{constructor(e){super(e.definition);this.orgText="";xt(this,tn(e,n=>n!==void 0))}}class Ct extends mn{constructor(e){super(e.definition);this.ignoreAmbiguities=false;xt(this,tn(e,n=>n!==void 0))}}class it extends mn{constructor(e){super(e.definition);this.idx=1;xt(this,tn(e,n=>n!==void 0))}}class Ft extends mn{constructor(e){super(e.definition);this.idx=1;xt(this,tn(e,n=>n!==void 0))}}class Kt extends mn{constructor(e){super(e.definition);this.idx=1;xt(this,tn(e,n=>n!==void 0))}}class De extends mn{constructor(e){super(e.definition);this.idx=1;xt(this,tn(e,n=>n!==void 0))}}class St extends mn{constructor(e){super(e.definition);this.idx=1;xt(this,tn(e,n=>n!==void 0))}}class At extends mn{get definition(){return this._definition}set definition(e){this._definition=e}constructor(e){super(e.definition);this.idx=1;this.ignoreAmbiguities=false;this.hasPredicates=false;xt(this,tn(e,n=>n!==void 0))}}class Ee{constructor(e){this.idx=1;xt(this,tn(e,n=>n!==void 0))}accept(e){e.visit(this)}}function XA(t){return H(t,jl)}function jl(t){function e(n){return H(n,jl)}if(t instanceof Rt){const n={type:"NonTerminal",name:t.nonTerminalName,idx:t.idx};if(wt(t.label)){n.label=t.label}return n}else if(t instanceof Ct){return{type:"Alternative",definition:e(t.definition)}}else if(t instanceof it){return{type:"Option",idx:t.idx,definition:e(t.definition)}}else if(t instanceof Ft){return{type:"RepetitionMandatory",idx:t.idx,definition:e(t.definition)}}else if(t instanceof Kt){return{type:"RepetitionMandatoryWithSeparator",idx:t.idx,separator:jl(new Ee({terminalType:t.separator})),definition:e(t.definition)}}else if(t instanceof St){return{type:"RepetitionWithSeparator",idx:t.idx,separator:jl(new Ee({terminalType:t.separator})),definition:e(t.definition)}}else if(t instanceof De){return{type:"Repetition",idx:t.idx,definition:e(t.definition)}}else if(t instanceof At){return{type:"Alternation",idx:t.idx,definition:e(t.definition)}}else if(t instanceof Ee){const n={type:"Terminal",name:t.terminalType.name,label:VA(t.terminalType),idx:t.idx};if(wt(t.label)){n.terminalLabel=t.label}const r=t.terminalType.PATTERN;if(t.terminalType.PATTERN){n.pattern=Fn(r)?r.source:r}return n}else if(t instanceof ei){return{type:"Rule",name:t.name,orgText:t.orgText,definition:e(t.definition)}}else{throw Error("non exhaustive match")}}class ti{visit(e){const n=e;switch(n.constructor){case Rt:return this.visitNonTerminal(n);case Ct:return this.visitAlternative(n);case it:return this.visitOption(n);case Ft:return this.visitRepetitionMandatory(n);case Kt:return this.visitRepetitionMandatoryWithSeparator(n);case St:return this.visitRepetitionWithSeparator(n);case De:return this.visitRepetition(n);case At:return this.visitAlternation(n);case Ee:return this.visitTerminal(n);case ei:return this.visitRule(n);default:throw Error("non exhaustive match")}}visitNonTerminal(e){}visitAlternative(e){}visitOption(e){}visitRepetition(e){}visitRepetitionMandatory(e){}visitRepetitionMandatoryWithSeparator(e){}visitRepetitionWithSeparator(e){}visitAlternation(e){}visitTerminal(e){}visitRule(e){}}function YA(t){return t instanceof Ct||t instanceof it||t instanceof De||t instanceof Ft||t instanceof Kt||t instanceof St||t instanceof Ee||t instanceof ei}function mu(t,e=[]){const n=t instanceof it||t instanceof De||t instanceof St;if(n){return true}if(t instanceof At){return yR(t.definition,r=>{return mu(r,e)})}else if(t instanceof Rt&&$t(e,t)){return false}else if(t instanceof mn){if(t instanceof Rt){e.push(t)}return Yt(t.definition,r=>{return mu(r,e)})}else{return false}}function JA(t){return t instanceof At}function sn(t){if(t instanceof Rt){return"SUBRULE"}else if(t instanceof it){return"OPTION"}else if(t instanceof At){return"OR"}else if(t instanceof Ft){return"AT_LEAST_ONE"}else if(t instanceof Kt){return"AT_LEAST_ONE_SEP"}else if(t instanceof St){return"MANY_SEP"}else if(t instanceof De){return"MANY"}else if(t instanceof Ee){return"CONSUME"}else{throw Error("non exhaustive match")}}class nc{walk(e,n=[]){X(e.definition,(r,i)=>{const a=et(e.definition,i+1);if(r instanceof Rt){this.walkProdRef(r,a,n)}else if(r instanceof Ee){this.walkTerminal(r,a,n)}else if(r instanceof Ct){this.walkFlat(r,a,n)}else if(r instanceof it){this.walkOption(r,a,n)}else if(r instanceof Ft){this.walkAtLeastOne(r,a,n)}else if(r instanceof Kt){this.walkAtLeastOneSep(r,a,n)}else if(r instanceof St){this.walkManySep(r,a,n)}else if(r instanceof De){this.walkMany(r,a,n)}else if(r instanceof At){this.walkOr(r,a,n)}else{throw Error("non exhaustive match")}})}walkTerminal(e,n,r){}walkProdRef(e,n,r){}walkFlat(e,n,r){const i=n.concat(r);this.walk(e,i)}walkOption(e,n,r){const i=n.concat(r);this.walk(e,i)}walkAtLeastOne(e,n,r){const i=[new it({definition:e.definition})].concat(n,r);this.walk(e,i)}walkAtLeastOneSep(e,n,r){const i=Lm(e,n,r);this.walk(e,i)}walkMany(e,n,r){const i=[new it({definition:e.definition})].concat(n,r);this.walk(e,i)}walkManySep(e,n,r){const i=Lm(e,n,r);this.walk(e,i)}walkOr(e,n,r){const i=n.concat(r);X(e.definition,a=>{const s=new Ct({definition:[a]});this.walk(s,i)})}}function Lm(t,e,n){const r=[new it({definition:[new Ee({terminalType:t.separator})].concat(t.definition)})];const i=r.concat(e,n);return i}function os(t){if(t instanceof Rt){return os(t.referencedRule)}else if(t instanceof Ee){return ek(t)}else if(YA(t)){return QA(t)}else if(JA(t)){return ZA(t)}else{throw Error("non exhaustive match")}}function QA(t){let e=[];const n=t.definition;let r=0;let i=n.length>r;let a;let s=true;while(i&&s){a=n[r];s=mu(a);e=e.concat(os(a));r=r+1;i=n.length>r}return Pp(e)}function ZA(t){const e=H(t.definition,n=>{return os(n)});return Pp(jt(e))}function ek(t){return[t.terminalType]}const TR="_~IN~_";class tk extends nc{constructor(e){super();this.topProd=e;this.follows={}}startWalking(){this.walk(this.topProd);return this.follows}walkTerminal(e,n,r){}walkProdRef(e,n,r){const i=rk(e.referencedRule,e.idx)+this.topProd.name;const a=n.concat(r);const s=new Ct({definition:a});const o=os(s);this.follows[i]=o}}function nk(t){const e={};X(t,n=>{const r=new tk(n).startWalking();xt(e,r)});return e}function rk(t,e){return t.name+e+TR}let Bl={};const ik=new _g;function rc(t){const e=t.toString();if(Bl.hasOwnProperty(e)){return Bl[e]}else{const n=ik.pattern(e);Bl[e]=n;return n}}function ak(){Bl={}}const ER="Complement Sets are not supported for first char optimization";const hu='Unable to use "first char" lexer optimizations:\n';function sk(t,e=false){try{const n=rc(t);const r=Hd(n.value,{},n.flags.ignoreCase);return r}catch(n){if(n.message===ER){if(e){RR(`${hu}	Unable to optimize: < ${t.toString()} >
	Complement Sets cannot be automatically optimized.
	This will disable the lexer's first char optimizations.
	See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#COMPLEMENT for details.`)}}else{let r="";if(e){r="\n	This will disable the lexer's first char optimizations.\n	See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#REGEXP_PARSING for details."}Gd(`${hu}
	Failed parsing: < ${t.toString()} >
	Using the @chevrotain/regexp-to-ast library
	Please open an issue at: https://github.com/chevrotain/chevrotain/issues`+r)}}return[]}function Hd(t,e,n){switch(t.type){case"Disjunction":for(let i=0;i<t.value.length;i++){Hd(t.value[i],e,n)}break;case"Alternative":const r=t.value;for(let i=0;i<r.length;i++){const a=r[i];switch(a.type){case"EndAnchor":case"GroupBackReference":case"Lookahead":case"NegativeLookahead":case"StartAnchor":case"WordBoundary":case"NonWordBoundary":continue}const s=a;switch(s.type){case"Character":Ks(s.value,e,n);break;case"Set":if(s.complement===true){throw Error(ER)}X(s.value,l=>{if(typeof l==="number"){Ks(l,e,n)}else{const u=l;if(n===true){for(let c=u.from;c<=u.to;c++){Ks(c,e,n)}}else{for(let c=u.from;c<=u.to&&c<va;c++){Ks(c,e,n)}if(u.to>=va){const c=u.from>=va?u.from:va;const d=u.to;const f=Qn(c);const p=Qn(d);for(let y=f;y<=p;y++){e[y]=y}}}}});break;case"Group":Hd(s.value,e,n);break;default:throw Error("Non Exhaustive Match")}const o=s.quantifier!==void 0&&s.quantifier.atLeast===0;if(s.type==="Group"&&qd(s)===false||s.type!=="Group"&&o===false){break}}break;default:throw Error("non exhaustive match!")}return Ve(e)}function Ks(t,e,n){const r=Qn(t);e[r]=r;if(n===true){ok(t,e)}}function ok(t,e){const n=String.fromCharCode(t);const r=n.toUpperCase();if(r!==n){const i=Qn(r.charCodeAt(0));e[i]=i}else{const i=n.toLowerCase();if(i!==n){const a=Qn(i.charCodeAt(0));e[a]=a}}}function xm(t,e){return Wr(t.value,n=>{if(typeof n==="number"){return $t(e,n)}else{const r=n;return Wr(e,i=>r.from<=i&&i<=r.to)!==void 0}})}function qd(t){const e=t.quantifier;if(e&&e.atLeast===0){return true}if(!t.value){return false}return le(t.value)?Yt(t.value,qd):qd(t.value)}class lk extends Gu{constructor(e){super();this.targetCharCodes=e;this.found=false}visitChildren(e){if(this.found===true){return}switch(e.type){case"Lookahead":this.visitLookahead(e);return;case"NegativeLookahead":this.visitNegativeLookahead(e);return}super.visitChildren(e)}visitCharacter(e){if($t(this.targetCharCodes,e.value)){this.found=true}}visitSet(e){if(e.complement){if(xm(e,this.targetCharCodes)===void 0){this.found=true}}else{if(xm(e,this.targetCharCodes)!==void 0){this.found=true}}}}function _p(t,e){if(e instanceof RegExp){const n=rc(e);const r=new lk(t);r.visit(n);return r.found}else{return Wr(e,n=>{return $t(t,n.charCodeAt(0))})!==void 0}}const Ar="PATTERN";const Ra="defaultMode";const Us="modes";let wR=typeof new RegExp("(?:)").sticky==="boolean";function uk(t,e){e=Np(e,{useSticky:wR,debug:false,safeMode:false,positionTracking:"full",lineTerminatorCharacters:["\r","\n"],tracer:(E,C)=>C()});const n=e.tracer;n("initCharCodeToOptimizedIndexMap",()=>{Dk()});let r;n("Reject Lexer.NA",()=>{r=tc(t,E=>{return E[Ar]===ot.NA})});let i=false;let a;n("Transform Patterns",()=>{i=false;a=H(r,E=>{const C=E[Ar];if(Fn(C)){const I=C.source;if(I.length===1&&I!=="^"&&I!=="$"&&I!=="."&&!C.ignoreCase){return I}else if(I.length===2&&I[0]==="\\"&&!$t(["d","D","s","S","t","r","n","t","0","c","b","B","f","v","w","W"],I[1])){return I[1]}else{return e.useSticky?Fm(C):Mm(C)}}else if(Hn(C)){i=true;return{exec:C}}else if(typeof C==="object"){i=true;return C}else if(typeof C==="string"){if(C.length===1){return C}else{const I=C.replace(/[\\^$.*+?()[\]{}|]/g,"\\$&");const Y=new RegExp(I);return e.useSticky?Fm(Y):Mm(Y)}}else{throw Error("non exhaustive match")}})});let s;let o;let l;let u;let c;n("misc mapping",()=>{s=H(r,E=>E.tokenTypeIdx);o=H(r,E=>{const C=E.GROUP;if(C===ot.SKIPPED){return void 0}else if(wt(C)){return C}else if(Kn(C)){return false}else{throw Error("non exhaustive match")}});l=H(r,E=>{const C=E.LONGER_ALT;if(C){const I=le(C)?H(C,Y=>Om(r,Y)):[Om(r,C)];return I}});u=H(r,E=>E.PUSH_MODE);c=H(r,E=>Q(E,"POP_MODE"))});let d;n("Line Terminator Handling",()=>{const E=AR(e.lineTerminatorCharacters);d=H(r,C=>false);if(e.positionTracking!=="onlyOffset"){d=H(r,C=>{if(Q(C,"LINE_BREAKS")){return!!C.LINE_BREAKS}else{return SR(C,E)===false&&_p(E,C.PATTERN)}})}});let f;let p;let y;let v;n("Misc Mapping #2",()=>{f=H(r,CR);p=H(a,Nk);y=gt(r,(E,C)=>{const I=C.GROUP;if(wt(I)&&!(I===ot.SKIPPED)){E[I]=[]}return E},{});v=H(a,(E,C)=>{return{pattern:a[C],longerAlt:l[C],canLineTerminator:d[C],isCustom:f[C],short:p[C],group:o[C],push:u[C],pop:c[C],tokenTypeIdx:s[C],tokenType:r[C]}})});let k=true;let $=[];if(!e.safeMode){n("First Char Optimization",()=>{$=gt(r,(E,C,I)=>{if(typeof C.PATTERN==="string"){const Y=C.PATTERN.charCodeAt(0);const q=Qn(Y);$c(E,q,v[I])}else if(le(C.START_CHARS_HINT)){let Y;X(C.START_CHARS_HINT,q=>{const J=typeof q==="string"?q.charCodeAt(0):q;const ne=Qn(J);if(Y!==ne){Y=ne;$c(E,ne,v[I])}})}else if(Fn(C.PATTERN)){if(C.PATTERN.unicode){k=false;if(e.ensureOptimizations){Gd(`${hu}	Unable to analyze < ${C.PATTERN.toString()} > pattern.
	The regexp unicode flag is not currently supported by the regexp-to-ast library.
	This will disable the lexer's first char optimizations.
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#UNICODE_OPTIMIZE`)}}else{const Y=sk(C.PATTERN,e.ensureOptimizations);if(ge(Y)){k=false}X(Y,q=>{$c(E,q,v[I])})}}else{if(e.ensureOptimizations){Gd(`${hu}	TokenType: <${C.name}> is using a custom token pattern without providing <start_chars_hint> parameter.
	This will disable the lexer's first char optimizations.
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#CUSTOM_OPTIMIZE`)}k=false}return E},[])})}return{emptyGroups:y,patternIdxToConfig:v,charCodeToPatternIdxToConfig:$,hasCustom:i,canBeOptimized:k}}function ck(t,e){let n=[];const r=fk(t);n=n.concat(r.errors);const i=pk(r.valid);const a=i.valid;n=n.concat(i.errors);n=n.concat(dk(a));n=n.concat(Tk(a));n=n.concat(Ek(a,e));n=n.concat(wk(a));return n}function dk(t){let e=[];const n=Mt(t,r=>Fn(r[Ar]));e=e.concat(hk(n));e=e.concat(Rk(n));e=e.concat(vk(n));e=e.concat($k(n));e=e.concat(yk(n));return e}function fk(t){const e=Mt(t,i=>{return!Q(i,Ar)});const n=H(e,i=>{return{message:"Token Type: ->"+i.name+"<- missing static 'PATTERN' property",type:Oe.MISSING_PATTERN,tokenTypes:[i]}});const r=ec(t,e);return{errors:n,valid:r}}function pk(t){const e=Mt(t,i=>{const a=i[Ar];return!Fn(a)&&!Hn(a)&&!Q(a,"exec")&&!wt(a)});const n=H(e,i=>{return{message:"Token Type: ->"+i.name+"<- static 'PATTERN' can only be a RegExp, a Function matching the {CustomPatternMatcherFunc} type or an Object matching the {ICustomPattern} interface.",type:Oe.INVALID_PATTERN,tokenTypes:[i]}});const r=ec(t,e);return{errors:n,valid:r}}const mk=/[^\\][$]/;function hk(t){class e extends Gu{constructor(){super(...arguments);this.found=false}visitEndAnchor(a){this.found=true}}const n=Mt(t,i=>{const a=i.PATTERN;try{const s=rc(a);const o=new e;o.visit(s);return o.found}catch(s){return mk.test(a.source)}});const r=H(n,i=>{return{message:"Unexpected RegExp Anchor Error:\n	Token Type: ->"+i.name+"<- static 'PATTERN' cannot contain end of input anchor '$'\n	See chevrotain.io/docs/guide/resolving_lexer_errors.html#ANCHORS	for details.",type:Oe.EOI_ANCHOR_FOUND,tokenTypes:[i]}});return r}function yk(t){const e=Mt(t,r=>{const i=r.PATTERN;return i.test("")});const n=H(e,r=>{return{message:"Token Type: ->"+r.name+"<- static 'PATTERN' must not match an empty string",type:Oe.EMPTY_MATCH_PATTERN,tokenTypes:[r]}});return n}const gk=/[^\\[][\^]|^\^/;function Rk(t){class e extends Gu{constructor(){super(...arguments);this.found=false}visitStartAnchor(a){this.found=true}}const n=Mt(t,i=>{const a=i.PATTERN;try{const s=rc(a);const o=new e;o.visit(s);return o.found}catch(s){return gk.test(a.source)}});const r=H(n,i=>{return{message:"Unexpected RegExp Anchor Error:\n	Token Type: ->"+i.name+"<- static 'PATTERN' cannot contain start of input anchor '^'\n	See https://chevrotain.io/docs/guide/resolving_lexer_errors.html#ANCHORS	for details.",type:Oe.SOI_ANCHOR_FOUND,tokenTypes:[i]}});return r}function vk(t){const e=Mt(t,r=>{const i=r[Ar];return i instanceof RegExp&&(i.multiline||i.global)});const n=H(e,r=>{return{message:"Token Type: ->"+r.name+"<- static 'PATTERN' may NOT contain global('g') or multiline('m')",type:Oe.UNSUPPORTED_FLAGS_FOUND,tokenTypes:[r]}});return n}function $k(t){const e=[];let n=H(t,a=>{return gt(t,(s,o)=>{if(a.PATTERN.source===o.PATTERN.source&&!$t(e,o)&&o.PATTERN!==ot.NA){e.push(o);s.push(o);return s}return s},[])});n=ss(n);const r=Mt(n,a=>{return a.length>1});const i=H(r,a=>{const s=H(a,l=>{return l.name});const o=Zt(a).PATTERN;return{message:`The same RegExp pattern ->${o}<-has been used in all of the following Token Types: ${s.join(", ")} <-`,type:Oe.DUPLICATE_PATTERNS_FOUND,tokenTypes:a}});return i}function Tk(t){const e=Mt(t,r=>{if(!Q(r,"GROUP")){return false}const i=r.GROUP;return i!==ot.SKIPPED&&i!==ot.NA&&!wt(i)});const n=H(e,r=>{return{message:"Token Type: ->"+r.name+"<- static 'GROUP' can only be Lexer.SKIPPED/Lexer.NA/A String",type:Oe.INVALID_GROUP_TYPE_FOUND,tokenTypes:[r]}});return n}function Ek(t,e){const n=Mt(t,i=>{return i.PUSH_MODE!==void 0&&!$t(e,i.PUSH_MODE)});const r=H(n,i=>{const a=`Token Type: ->${i.name}<- static 'PUSH_MODE' value cannot refer to a Lexer Mode ->${i.PUSH_MODE}<-which does not exist`;return{message:a,type:Oe.PUSH_MODE_DOES_NOT_EXIST,tokenTypes:[i]}});return r}function wk(t){const e=[];const n=gt(t,(r,i,a)=>{const s=i.PATTERN;if(s===ot.NA){return r}if(wt(s)){r.push({str:s,idx:a,tokenType:i})}else if(Fn(s)&&Sk(s)){r.push({str:s.source,idx:a,tokenType:i})}return r},[]);X(t,(r,i)=>{X(n,({str:a,idx:s,tokenType:o})=>{if(i<s&&Ck(a,r.PATTERN)){const l=`Token: ->${o.name}<- can never be matched.
Because it appears AFTER the Token Type ->${r.name}<-in the lexer's definition.
See https://chevrotain.io/docs/guide/resolving_lexer_errors.html#UNREACHABLE`;e.push({message:l,type:Oe.UNREACHABLE_PATTERN,tokenTypes:[r,o]})}})});return e}function Ck(t,e){if(Fn(e)){const n=e.exec(t);return n!==null&&n.index===0}else if(Hn(e)){return e(t,0,[],{})}else if(Q(e,"exec")){return e.exec(t,0,[],{})}else if(typeof e==="string"){return e===t}else{throw Error("non exhaustive match")}}function Sk(t){const e=[".","\\","[","]","|","^","$","(",")","?","*","+","{"];return Wr(e,n=>t.source.indexOf(n)!==-1)===void 0}function Mm(t){const e=t.ignoreCase?"i":"";return new RegExp(`^(?:${t.source})`,e)}function Fm(t){const e=t.ignoreCase?"iy":"y";return new RegExp(`${t.source}`,e)}function Ak(t,e,n){const r=[];if(!Q(t,Ra)){r.push({message:"A MultiMode Lexer cannot be initialized without a <"+Ra+"> property in its definition\n",type:Oe.MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE})}if(!Q(t,Us)){r.push({message:"A MultiMode Lexer cannot be initialized without a <"+Us+"> property in its definition\n",type:Oe.MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY})}if(Q(t,Us)&&Q(t,Ra)&&!Q(t.modes,t.defaultMode)){r.push({message:`A MultiMode Lexer cannot be initialized with a ${Ra}: <${t.defaultMode}>which does not exist
`,type:Oe.MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST})}if(Q(t,Us)){X(t.modes,(i,a)=>{X(i,(s,o)=>{if(Kn(s)){r.push({message:`A Lexer cannot be initialized using an undefined Token Type. Mode:<${a}> at index: <${o}>
`,type:Oe.LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED})}else if(Q(s,"LONGER_ALT")){const l=le(s.LONGER_ALT)?s.LONGER_ALT:[s.LONGER_ALT];X(l,u=>{if(!Kn(u)&&!$t(i,u)){r.push({message:`A MultiMode Lexer cannot be initialized with a longer_alt <${u.name}> on token <${s.name}> outside of mode <${a}>
`,type:Oe.MULTI_MODE_LEXER_LONGER_ALT_NOT_IN_CURRENT_MODE})}})}})})}return r}function kk(t,e,n){const r=[];let i=false;const a=ss(jt(Ve(t.modes)));const s=tc(a,l=>l[Ar]===ot.NA);const o=AR(n);if(e){X(s,l=>{const u=SR(l,o);if(u!==false){const c=_k(l,u);const d={message:c,type:u.issue,tokenType:l};r.push(d)}else{if(Q(l,"LINE_BREAKS")){if(l.LINE_BREAKS===true){i=true}}else{if(_p(o,l.PATTERN)){i=true}}}})}if(e&&!i){r.push({message:"Warning: No LINE_BREAKS Found.\n	This Lexer has been defined to track line and column information,\n	But none of the Token Types can be identified as matching a line terminator.\n	See https://chevrotain.io/docs/guide/resolving_lexer_errors.html#LINE_BREAKS \n	for details.",type:Oe.NO_LINE_BREAKS_FLAGS})}return r}function bk(t){const e={};const n=Vt(t);X(n,r=>{const i=t[r];if(le(i)){e[r]=[]}else{throw Error("non exhaustive match")}});return e}function CR(t){const e=t.PATTERN;if(Fn(e)){return false}else if(Hn(e)){return true}else if(Q(e,"exec")){return true}else if(wt(e)){return false}else{throw Error("non exhaustive match")}}function Nk(t){if(wt(t)&&t.length===1){return t.charCodeAt(0)}else{return false}}const Pk={test:function(t){const e=t.length;for(let n=this.lastIndex;n<e;n++){const r=t.charCodeAt(n);if(r===10){this.lastIndex=n+1;return true}else if(r===13){if(t.charCodeAt(n+1)===10){this.lastIndex=n+2}else{this.lastIndex=n+1}return true}}return false},lastIndex:0};function SR(t,e){if(Q(t,"LINE_BREAKS")){return false}else{if(Fn(t.PATTERN)){try{_p(e,t.PATTERN)}catch(n){return{issue:Oe.IDENTIFY_TERMINATOR,errMsg:n.message}}return false}else if(wt(t.PATTERN)){return false}else if(CR(t)){return{issue:Oe.CUSTOM_LINE_BREAK}}else{throw Error("non exhaustive match")}}}function _k(t,e){if(e.issue===Oe.IDENTIFY_TERMINATOR){return`Warning: unable to identify line terminator usage in pattern.
	The problem is in the <${t.name}> Token Type
	 Root cause: ${e.errMsg}.
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#IDENTIFY_TERMINATOR`}else if(e.issue===Oe.CUSTOM_LINE_BREAK){return`Warning: A Custom Token Pattern should specify the <line_breaks> option.
	The problem is in the <${t.name}> Token Type
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#CUSTOM_LINE_BREAK`}else{throw Error("non exhaustive match")}}function AR(t){const e=H(t,n=>{if(wt(n)){return n.charCodeAt(0)}else{return n}});return e}function $c(t,e,n){if(t[e]===void 0){t[e]=[n]}else{t[e].push(n)}}const va=256;let Wl=[];function Qn(t){return t<va?t:Wl[t]}function Dk(){if(ge(Wl)){Wl=new Array(65536);for(let t=0;t<65536;t++){Wl[t]=t>255?255+~~(t/255):t}}}function ls(t,e){const n=t.tokenTypeIdx;if(n===e.tokenTypeIdx){return true}else{return e.isParent===true&&e.categoryMatchesMap[n]===true}}function yu(t,e){return t.tokenTypeIdx===e.tokenTypeIdx}let Km=1;const kR={};function us(t){const e=Ok(t);Ik(e);xk(e);Lk(e);X(e,n=>{n.isParent=n.categoryMatches.length>0})}function Ok(t){let e=at(t);let n=t;let r=true;while(r){n=ss(jt(H(n,a=>a.CATEGORIES)));const i=ec(n,e);e=e.concat(i);if(ge(i)){r=false}else{n=i}}return e}function Ik(t){X(t,e=>{if(!NR(e)){kR[Km]=e;e.tokenTypeIdx=Km++}if(Um(e)&&!le(e.CATEGORIES)){e.CATEGORIES=[e.CATEGORIES]}if(!Um(e)){e.CATEGORIES=[]}if(!Mk(e)){e.categoryMatches=[]}if(!Fk(e)){e.categoryMatchesMap={}}})}function Lk(t){X(t,e=>{e.categoryMatches=[];X(e.categoryMatchesMap,(n,r)=>{e.categoryMatches.push(kR[r].tokenTypeIdx)})})}function xk(t){X(t,e=>{bR([],e)})}function bR(t,e){X(t,n=>{e.categoryMatchesMap[n.tokenTypeIdx]=true});X(e.CATEGORIES,n=>{const r=t.concat(e);if(!$t(r,n)){bR(r,n)}})}function NR(t){return Q(t,"tokenTypeIdx")}function Um(t){return Q(t,"CATEGORIES")}function Mk(t){return Q(t,"categoryMatches")}function Fk(t){return Q(t,"categoryMatchesMap")}function Kk(t){return Q(t,"tokenTypeIdx")}const jd={buildUnableToPopLexerModeMessage(t){return`Unable to pop Lexer Mode after encountering Token ->${t.image}<- The Mode Stack is empty`},buildUnexpectedCharactersMessage(t,e,n,r,i){return`unexpected character: ->${t.charAt(e)}<- at offset: ${e}, skipped ${n} characters.`}};var Oe;(function(t){t[t["MISSING_PATTERN"]=0]="MISSING_PATTERN";t[t["INVALID_PATTERN"]=1]="INVALID_PATTERN";t[t["EOI_ANCHOR_FOUND"]=2]="EOI_ANCHOR_FOUND";t[t["UNSUPPORTED_FLAGS_FOUND"]=3]="UNSUPPORTED_FLAGS_FOUND";t[t["DUPLICATE_PATTERNS_FOUND"]=4]="DUPLICATE_PATTERNS_FOUND";t[t["INVALID_GROUP_TYPE_FOUND"]=5]="INVALID_GROUP_TYPE_FOUND";t[t["PUSH_MODE_DOES_NOT_EXIST"]=6]="PUSH_MODE_DOES_NOT_EXIST";t[t["MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE"]=7]="MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE";t[t["MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY"]=8]="MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY";t[t["MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST"]=9]="MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST";t[t["LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED"]=10]="LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED";t[t["SOI_ANCHOR_FOUND"]=11]="SOI_ANCHOR_FOUND";t[t["EMPTY_MATCH_PATTERN"]=12]="EMPTY_MATCH_PATTERN";t[t["NO_LINE_BREAKS_FLAGS"]=13]="NO_LINE_BREAKS_FLAGS";t[t["UNREACHABLE_PATTERN"]=14]="UNREACHABLE_PATTERN";t[t["IDENTIFY_TERMINATOR"]=15]="IDENTIFY_TERMINATOR";t[t["CUSTOM_LINE_BREAK"]=16]="CUSTOM_LINE_BREAK";t[t["MULTI_MODE_LEXER_LONGER_ALT_NOT_IN_CURRENT_MODE"]=17]="MULTI_MODE_LEXER_LONGER_ALT_NOT_IN_CURRENT_MODE"})(Oe||(Oe={}));const $a={deferDefinitionErrorsHandling:false,positionTracking:"full",lineTerminatorsPattern:/\n|\r\n?/g,lineTerminatorCharacters:["\n","\r"],ensureOptimizations:false,safeMode:false,errorMessageProvider:jd,traceInitPerf:false,skipValidations:false,recoveryEnabled:true};Object.freeze($a);class ot{constructor(e,n=$a){this.lexerDefinition=e;this.lexerDefinitionErrors=[];this.lexerDefinitionWarning=[];this.patternIdxToConfig={};this.charCodeToPatternIdxToConfig={};this.modes=[];this.emptyGroups={};this.trackStartLines=true;this.trackEndLines=true;this.hasCustom=false;this.canModeBeOptimized={};this.TRACE_INIT=(i,a)=>{if(this.traceInitPerf===true){this.traceInitIndent++;const s=new Array(this.traceInitIndent+1).join("	");if(this.traceInitIndent<this.traceInitMaxIdent){console.log(`${s}--> <${i}>`)}const{time:o,value:l}=vR(a);const u=o>10?console.warn:console.log;if(this.traceInitIndent<this.traceInitMaxIdent){u(`${s}<-- <${i}> time: ${o}ms`)}this.traceInitIndent--;return l}else{return a()}};if(typeof n==="boolean"){throw Error("The second argument to the Lexer constructor is now an ILexerConfig Object.\na boolean 2nd argument is no longer supported")}this.config=xt({},$a,n);const r=this.config.traceInitPerf;if(r===true){this.traceInitMaxIdent=Infinity;this.traceInitPerf=true}else if(typeof r==="number"){this.traceInitMaxIdent=r;this.traceInitPerf=true}this.traceInitIndent=-1;this.TRACE_INIT("Lexer Constructor",()=>{let i;let a=true;this.TRACE_INIT("Lexer Config handling",()=>{if(this.config.lineTerminatorsPattern===$a.lineTerminatorsPattern){this.config.lineTerminatorsPattern=Pk}else{if(this.config.lineTerminatorCharacters===$a.lineTerminatorCharacters){throw Error("Error: Missing <lineTerminatorCharacters> property on the Lexer config.\n	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#MISSING_LINE_TERM_CHARS")}}if(n.safeMode&&n.ensureOptimizations){throw Error('"safeMode" and "ensureOptimizations" flags are mutually exclusive.')}this.trackStartLines=/full|onlyStart/i.test(this.config.positionTracking);this.trackEndLines=/full/i.test(this.config.positionTracking);if(le(e)){i={modes:{defaultMode:at(e)},defaultMode:Ra}}else{a=false;i=at(e)}});if(this.config.skipValidations===false){this.TRACE_INIT("performRuntimeChecks",()=>{this.lexerDefinitionErrors=this.lexerDefinitionErrors.concat(Ak(i,this.trackStartLines,this.config.lineTerminatorCharacters))});this.TRACE_INIT("performWarningRuntimeChecks",()=>{this.lexerDefinitionWarning=this.lexerDefinitionWarning.concat(kk(i,this.trackStartLines,this.config.lineTerminatorCharacters))})}i.modes=i.modes?i.modes:{};X(i.modes,(o,l)=>{i.modes[l]=tc(o,u=>Kn(u))});const s=Vt(i.modes);X(i.modes,(o,l)=>{this.TRACE_INIT(`Mode: <${l}> processing`,()=>{this.modes.push(l);if(this.config.skipValidations===false){this.TRACE_INIT(`validatePatterns`,()=>{this.lexerDefinitionErrors=this.lexerDefinitionErrors.concat(ck(o,s))})}if(ge(this.lexerDefinitionErrors)){us(o);let u;this.TRACE_INIT(`analyzeTokenTypes`,()=>{u=uk(o,{lineTerminatorCharacters:this.config.lineTerminatorCharacters,positionTracking:n.positionTracking,ensureOptimizations:n.ensureOptimizations,safeMode:n.safeMode,tracer:this.TRACE_INIT})});this.patternIdxToConfig[l]=u.patternIdxToConfig;this.charCodeToPatternIdxToConfig[l]=u.charCodeToPatternIdxToConfig;this.emptyGroups=xt({},this.emptyGroups,u.emptyGroups);this.hasCustom=u.hasCustom||this.hasCustom;this.canModeBeOptimized[l]=u.canBeOptimized}})});this.defaultMode=i.defaultMode;if(!ge(this.lexerDefinitionErrors)&&!this.config.deferDefinitionErrorsHandling){const o=H(this.lexerDefinitionErrors,u=>{return u.message});const l=o.join("-----------------------\n");throw new Error("Errors detected in definition of Lexer:\n"+l)}X(this.lexerDefinitionWarning,o=>{RR(o.message)});this.TRACE_INIT("Choosing sub-methods implementations",()=>{if(wR){this.chopInput=Cr;this.match=this.matchWithTest}else{this.updateLastIndex=We;this.match=this.matchWithExec}if(a){this.handleModes=We}if(this.trackStartLines===false){this.computeNewColumn=Cr}if(this.trackEndLines===false){this.updateTokenEndLineColumnLocation=We}if(/full/i.test(this.config.positionTracking)){this.createTokenInstance=this.createFullToken}else if(/onlyStart/i.test(this.config.positionTracking)){this.createTokenInstance=this.createStartOnlyToken}else if(/onlyOffset/i.test(this.config.positionTracking)){this.createTokenInstance=this.createOffsetOnlyToken}else{throw Error(`Invalid <positionTracking> config option: "${this.config.positionTracking}"`)}if(this.hasCustom){this.addToken=this.addTokenUsingPush;this.handlePayload=this.handlePayloadWithCustom}else{this.addToken=this.addTokenUsingMemberAccess;this.handlePayload=this.handlePayloadNoCustom}});this.TRACE_INIT("Failed Optimization Warnings",()=>{const o=gt(this.canModeBeOptimized,(l,u,c)=>{if(u===false){l.push(c)}return l},[]);if(n.ensureOptimizations&&!ge(o)){throw Error(`Lexer Modes: < ${o.join(", ")} > cannot be optimized.
	 Disable the "ensureOptimizations" lexer config flag to silently ignore this and run the lexer in an un-optimized mode.
	 Or inspect the console log for details on how to resolve these issues.`)}});this.TRACE_INIT("clearRegExpParserCache",()=>{ak()});this.TRACE_INIT("toFastProperties",()=>{$R(this)})})}tokenize(e,n=this.defaultMode){if(!ge(this.lexerDefinitionErrors)){const r=H(this.lexerDefinitionErrors,a=>{return a.message});const i=r.join("-----------------------\n");throw new Error("Unable to Tokenize because Errors detected in definition of Lexer:\n"+i)}return this.tokenizeInternal(e,n)}tokenizeInternal(e,n){let r,i,a,s,o,l,u,c,d,f,p,y,v,k,$;const E=e;const C=E.length;let I=0;let Y=0;const q=this.hasCustom?0:Math.floor(e.length/10);const J=new Array(q);const ne=[];let ae=this.trackStartLines?1:void 0;let de=this.trackStartLines?1:void 0;const L=bk(this.emptyGroups);const w=this.trackStartLines;const g=this.config.lineTerminatorsPattern;let b=0;let M=[];let O=[];const x=[];const we=[];Object.freeze(we);let K;function N(){return M}function re(me){const Pe=Qn(me);const je=O[Pe];if(je===void 0){return we}else{return je}}const kt=me=>{if(x.length===1&&me.tokenType.PUSH_MODE===void 0){const Pe=this.config.errorMessageProvider.buildUnableToPopLexerModeMessage(me);ne.push({offset:me.startOffset,line:me.startLine,column:me.startColumn,length:me.image.length,message:Pe})}else{x.pop();const Pe=Br(x);M=this.patternIdxToConfig[Pe];O=this.charCodeToPatternIdxToConfig[Pe];b=M.length;const je=this.canModeBeOptimized[Pe]&&this.config.safeMode===false;if(O&&je){K=re}else{K=N}}};function bt(me){x.push(me);O=this.charCodeToPatternIdxToConfig[me];M=this.patternIdxToConfig[me];b=M.length;b=M.length;const Pe=this.canModeBeOptimized[me]&&this.config.safeMode===false;if(O&&Pe){K=re}else{K=N}}bt.call(this,n);let Ce;const Nt=this.config.recoveryEnabled;while(I<C){l=null;const me=E.charCodeAt(I);const Pe=K(me);const je=Pe.length;for(r=0;r<je;r++){Ce=Pe[r];const Re=Ce.pattern;u=null;const j=Ce.short;if(j!==false){if(me===j){l=Re}}else if(Ce.isCustom===true){$=Re.exec(E,I,J,L);if($!==null){l=$[0];if($.payload!==void 0){u=$.payload}}else{l=null}}else{this.updateLastIndex(Re,I);l=this.match(Re,e,I)}if(l!==null){o=Ce.longerAlt;if(o!==void 0){const R=o.length;for(a=0;a<R;a++){const A=M[o[a]];const B=A.pattern;c=null;if(A.isCustom===true){$=B.exec(E,I,J,L);if($!==null){s=$[0];if($.payload!==void 0){c=$.payload}}else{s=null}}else{this.updateLastIndex(B,I);s=this.match(B,e,I)}if(s&&s.length>l.length){l=s;u=c;Ce=A;break}}}break}}if(l!==null){d=l.length;f=Ce.group;if(f!==void 0){p=Ce.tokenTypeIdx;y=this.createTokenInstance(l,I,p,Ce.tokenType,ae,de,d);this.handlePayload(y,u);if(f===false){Y=this.addToken(J,Y,y)}else{L[f].push(y)}}e=this.chopInput(e,d);I=I+d;de=this.computeNewColumn(de,d);if(w===true&&Ce.canLineTerminator===true){let Re=0;let j;let R;g.lastIndex=0;do{j=g.test(l);if(j===true){R=g.lastIndex-1;Re++}}while(j===true);if(Re!==0){ae=ae+Re;de=d-R;this.updateTokenEndLineColumnLocation(y,f,R,Re,ae,de,d)}}this.handleModes(Ce,kt,bt,y)}else{const Re=I;const j=ae;const R=de;let A=Nt===false;while(A===false&&I<C){e=this.chopInput(e,1);I++;for(i=0;i<b;i++){const B=M[i];const S=B.pattern;const fe=B.short;if(fe!==false){if(E.charCodeAt(I)===fe){A=true}}else if(B.isCustom===true){A=S.exec(E,I,J,L)!==null}else{this.updateLastIndex(S,I);A=S.exec(e)!==null}if(A===true){break}}}v=I-Re;de=this.computeNewColumn(de,v);k=this.config.errorMessageProvider.buildUnexpectedCharactersMessage(E,Re,v,j,R);ne.push({offset:Re,line:j,column:R,length:v,message:k});if(Nt===false){break}}}if(!this.hasCustom){J.length=Y}return{tokens:J,groups:L,errors:ne}}handleModes(e,n,r,i){if(e.pop===true){const a=e.push;n(i);if(a!==void 0){r.call(this,a)}}else if(e.push!==void 0){r.call(this,e.push)}}chopInput(e,n){return e.substring(n)}updateLastIndex(e,n){e.lastIndex=n}updateTokenEndLineColumnLocation(e,n,r,i,a,s,o){let l,u;if(n!==void 0){l=r===o-1;u=l?-1:0;if(!(i===1&&l===true)){e.endLine=a+u;e.endColumn=s-1+-u}}}computeNewColumn(e,n){return e+n}createOffsetOnlyToken(e,n,r,i){return{image:e,startOffset:n,tokenTypeIdx:r,tokenType:i}}createStartOnlyToken(e,n,r,i,a,s){return{image:e,startOffset:n,startLine:a,startColumn:s,tokenTypeIdx:r,tokenType:i}}createFullToken(e,n,r,i,a,s,o){return{image:e,startOffset:n,endOffset:n+o-1,startLine:a,endLine:a,startColumn:s,endColumn:s+o-1,tokenTypeIdx:r,tokenType:i}}addTokenUsingPush(e,n,r){e.push(r);return n}addTokenUsingMemberAccess(e,n,r){e[n]=r;n++;return n}handlePayloadNoCustom(e,n){}handlePayloadWithCustom(e,n){if(n!==null){e.payload=n}}matchWithTest(e,n,r){const i=e.test(n);if(i===true){return n.substring(r,e.lastIndex)}return null}matchWithExec(e,n){const r=e.exec(n);return r!==null?r[0]:null}}ot.SKIPPED="This marks a skipped Token pattern, this means each token identified by it willbe consumed and then thrown into oblivion, this can be used to for example to completely ignore whitespace.";ot.NA=/NOT_APPLICABLE/;function Hr(t){if(PR(t)){return t.LABEL}else{return t.name}}function PR(t){return wt(t.LABEL)&&t.LABEL!==""}const Uk="parent";const Gm="categories";const Hm="label";const qm="group";const jm="push_mode";const Bm="pop_mode";const Wm="longer_alt";const Vm="line_breaks";const zm="start_chars_hint";function rr(t){return Gk(t)}function Gk(t){const e=t.pattern;const n={};n.name=t.name;if(!Kn(e)){n.PATTERN=e}if(Q(t,Uk)){throw"The parent property is no longer supported.\nSee: https://github.com/chevrotain/chevrotain/issues/564#issuecomment-349062346 for details."}if(Q(t,Gm)){n.CATEGORIES=t[Gm]}us([n]);if(Q(t,Hm)){n.LABEL=t[Hm]}if(Q(t,qm)){n.GROUP=t[qm]}if(Q(t,Bm)){n.POP_MODE=t[Bm]}if(Q(t,jm)){n.PUSH_MODE=t[jm]}if(Q(t,Wm)){n.LONGER_ALT=t[Wm]}if(Q(t,Vm)){n.LINE_BREAKS=t[Vm]}if(Q(t,zm)){n.START_CHARS_HINT=t[zm]}return n}const Zn=rr({name:"EOF",pattern:ot.NA});us([Zn]);function Dp(t,e,n,r,i,a,s,o){return{image:e,startOffset:n,endOffset:r,startLine:i,endLine:a,startColumn:s,endColumn:o,tokenTypeIdx:t.tokenTypeIdx,tokenType:t}}function _R(t,e){return ls(t,e)}const Ur={buildMismatchTokenMessage({expected:t,actual:e,previous:n,ruleName:r}){const i=PR(t);const a=i?`--> ${Hr(t)} <--`:`token of type --> ${t.name} <--`;const s=`Expecting ${a} but found --> '${e.image}' <--`;return s},buildNotAllInputParsedMessage({firstRedundant:t,ruleName:e}){return"Redundant input, expecting EOF but found: "+t.image},buildNoViableAltMessage({expectedPathsPerAlt:t,actual:e,previous:n,customUserDescription:r,ruleName:i}){const a="Expecting: ";const s=Zt(e).image;const o="\nbut found: '"+s+"'";if(r){return a+r+o}else{const l=gt(t,(f,p)=>f.concat(p),[]);const u=H(l,f=>`[${H(f,p=>Hr(p)).join(", ")}]`);const c=H(u,(f,p)=>`  ${p+1}. ${f}`);const d=`one of these possible Token sequences:
${c.join("\n")}`;return a+d+o}},buildEarlyExitMessage({expectedIterationPaths:t,actual:e,customUserDescription:n,ruleName:r}){const i="Expecting: ";const a=Zt(e).image;const s="\nbut found: '"+a+"'";if(n){return i+n+s}else{const o=H(t,u=>`[${H(u,c=>Hr(c)).join(",")}]`);const l=`expecting at least one iteration which starts with one of these possible Token sequences::
  <${o.join(" ,")}>`;return i+l+s}}};Object.freeze(Ur);const Hk={buildRuleNotFoundError(t,e){const n="Invalid grammar, reference to a rule which is not defined: ->"+e.nonTerminalName+"<-\ninside top level rule: ->"+t.name+"<-";return n}};const Rr={buildDuplicateFoundError(t,e){function n(c){if(c instanceof Ee){return c.terminalType.name}else if(c instanceof Rt){return c.nonTerminalName}else{return""}}const r=t.name;const i=Zt(e);const a=i.idx;const s=sn(i);const o=n(i);const l=a>0;let u=`->${s}${l?a:""}<- ${o?`with argument: ->${o}<-`:""}
                  appears more than once (${e.length} times) in the top level rule: ->${r}<-.                  
                  For further details see: https://chevrotain.io/docs/FAQ.html#NUMERICAL_SUFFIXES 
                  `;u=u.replace(/[ \t]+/g," ");u=u.replace(/\s\s+/g,"\n");return u},buildNamespaceConflictError(t){const e=`Namespace conflict found in grammar.
The grammar has both a Terminal(Token) and a Non-Terminal(Rule) named: <${t.name}>.
To resolve this make sure each Terminal and Non-Terminal names are unique
This is easy to accomplish by using the convention that Terminal names start with an uppercase letter
and Non-Terminal names start with a lower case letter.`;return e},buildAlternationPrefixAmbiguityError(t){const e=H(t.prefixPath,i=>Hr(i)).join(", ");const n=t.alternation.idx===0?"":t.alternation.idx;const r=`Ambiguous alternatives: <${t.ambiguityIndices.join(" ,")}> due to common lookahead prefix
in <OR${n}> inside <${t.topLevelRule.name}> Rule,
<${e}> may appears as a prefix path in all these alternatives.
See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#COMMON_PREFIX
For Further details.`;return r},buildAlternationAmbiguityError(t){const e=H(t.prefixPath,i=>Hr(i)).join(", ");const n=t.alternation.idx===0?"":t.alternation.idx;let r=`Ambiguous Alternatives Detected: <${t.ambiguityIndices.join(" ,")}> in <OR${n}> inside <${t.topLevelRule.name}> Rule,
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
see: https://en.wikipedia.org/wiki/LL_parser#Left_factoring.`;return i},buildInvalidRuleNameError(t){return"deprecated"},buildDuplicateRuleNameError(t){let e;if(t.topLevelRule instanceof ei){e=t.topLevelRule.name}else{e=t.topLevelRule}const n=`Duplicate definition, rule: ->${e}<- is already defined in the grammar: ->${t.grammarName}<-`;return n}};function qk(t,e){const n=new jk(t,e);n.resolveRefs();return n.errors}class jk extends ti{constructor(e,n){super();this.nameToTopRule=e;this.errMsgProvider=n;this.errors=[]}resolveRefs(){X(Ve(this.nameToTopRule),e=>{this.currTopLevel=e;e.accept(this)})}visitNonTerminal(e){const n=this.nameToTopRule[e.nonTerminalName];if(!n){const r=this.errMsgProvider.buildRuleNotFoundError(this.currTopLevel,e);this.errors.push({message:r,type:vt.UNRESOLVED_SUBRULE_REF,ruleName:this.currTopLevel.name,unresolvedRefName:e.nonTerminalName})}else{e.referencedRule=n}}}class Bk extends nc{constructor(e,n){super();this.topProd=e;this.path=n;this.possibleTokTypes=[];this.nextProductionName="";this.nextProductionOccurrence=0;this.found=false;this.isAtEndOfPath=false}startWalking(){this.found=false;if(this.path.ruleStack[0]!==this.topProd.name){throw Error("The path does not start with the walker's top Rule!")}this.ruleStack=at(this.path.ruleStack).reverse();this.occurrenceStack=at(this.path.occurrenceStack).reverse();this.ruleStack.pop();this.occurrenceStack.pop();this.updateExpectedNext();this.walk(this.topProd);return this.possibleTokTypes}walk(e,n=[]){if(!this.found){super.walk(e,n)}}walkProdRef(e,n,r){if(e.referencedRule.name===this.nextProductionName&&e.idx===this.nextProductionOccurrence){const i=n.concat(r);this.updateExpectedNext();this.walk(e.referencedRule,i)}}updateExpectedNext(){if(ge(this.ruleStack)){this.nextProductionName="";this.nextProductionOccurrence=0;this.isAtEndOfPath=true}else{this.nextProductionName=this.ruleStack.pop();this.nextProductionOccurrence=this.occurrenceStack.pop()}}}class Wk extends Bk{constructor(e,n){super(e,n);this.path=n;this.nextTerminalName="";this.nextTerminalOccurrence=0;this.nextTerminalName=this.path.lastTok.name;this.nextTerminalOccurrence=this.path.lastTokOccurrence}walkTerminal(e,n,r){if(this.isAtEndOfPath&&e.terminalType.name===this.nextTerminalName&&e.idx===this.nextTerminalOccurrence&&!this.found){const i=n.concat(r);const a=new Ct({definition:i});this.possibleTokTypes=os(a);this.found=true}}}class ic extends nc{constructor(e,n){super();this.topRule=e;this.occurrence=n;this.result={token:void 0,occurrence:void 0,isEndOfRule:void 0}}startWalking(){this.walk(this.topRule);return this.result}}class Vk extends ic{walkMany(e,n,r){if(e.idx===this.occurrence){const i=Zt(n.concat(r));this.result.isEndOfRule=i===void 0;if(i instanceof Ee){this.result.token=i.terminalType;this.result.occurrence=i.idx}}else{super.walkMany(e,n,r)}}}class Xm extends ic{walkManySep(e,n,r){if(e.idx===this.occurrence){const i=Zt(n.concat(r));this.result.isEndOfRule=i===void 0;if(i instanceof Ee){this.result.token=i.terminalType;this.result.occurrence=i.idx}}else{super.walkManySep(e,n,r)}}}class zk extends ic{walkAtLeastOne(e,n,r){if(e.idx===this.occurrence){const i=Zt(n.concat(r));this.result.isEndOfRule=i===void 0;if(i instanceof Ee){this.result.token=i.terminalType;this.result.occurrence=i.idx}}else{super.walkAtLeastOne(e,n,r)}}}class Ym extends ic{walkAtLeastOneSep(e,n,r){if(e.idx===this.occurrence){const i=Zt(n.concat(r));this.result.isEndOfRule=i===void 0;if(i instanceof Ee){this.result.token=i.terminalType;this.result.occurrence=i.idx}}else{super.walkAtLeastOneSep(e,n,r)}}}function Bd(t,e,n=[]){n=at(n);let r=[];let i=0;function a(o){return o.concat(et(t,i+1))}function s(o){const l=Bd(a(o),e,n);return r.concat(l)}while(n.length<e&&i<t.length){const o=t[i];if(o instanceof Ct){return s(o.definition)}else if(o instanceof Rt){return s(o.definition)}else if(o instanceof it){r=s(o.definition)}else if(o instanceof Ft){const l=o.definition.concat([new De({definition:o.definition})]);return s(l)}else if(o instanceof Kt){const l=[new Ct({definition:o.definition}),new De({definition:[new Ee({terminalType:o.separator})].concat(o.definition)})];return s(l)}else if(o instanceof St){const l=o.definition.concat([new De({definition:[new Ee({terminalType:o.separator})].concat(o.definition)})]);r=s(l)}else if(o instanceof De){const l=o.definition.concat([new De({definition:o.definition})]);r=s(l)}else if(o instanceof At){X(o.definition,l=>{if(ge(l.definition)===false){r=s(l.definition)}});return r}else if(o instanceof Ee){n.push(o.terminalType)}else{throw Error("non exhaustive match")}i++}r.push({partialPath:n,suffixDef:et(t,i)});return r}function DR(t,e,n,r){const i="EXIT_NONE_TERMINAL";const a=[i];const s="EXIT_ALTERNATIVE";let o=false;const l=e.length;const u=l-r-1;const c=[];const d=[];d.push({idx:-1,def:t,ruleStack:[],occurrenceStack:[]});while(!ge(d)){const f=d.pop();if(f===s){if(o&&Br(d).idx<=u){d.pop()}continue}const p=f.def;const y=f.idx;const v=f.ruleStack;const k=f.occurrenceStack;if(ge(p)){continue}const $=p[0];if($===i){const E={idx:y,def:et(p),ruleStack:Ga(v),occurrenceStack:Ga(k)};d.push(E)}else if($ instanceof Ee){if(y<l-1){const E=y+1;const C=e[E];if(n(C,$.terminalType)){const I={idx:E,def:et(p),ruleStack:v,occurrenceStack:k};d.push(I)}}else if(y===l-1){c.push({nextTokenType:$.terminalType,nextTokenOccurrence:$.idx,ruleStack:v,occurrenceStack:k});o=true}else{throw Error("non exhaustive match")}}else if($ instanceof Rt){const E=at(v);E.push($.nonTerminalName);const C=at(k);C.push($.idx);const I={idx:y,def:$.definition.concat(a,et(p)),ruleStack:E,occurrenceStack:C};d.push(I)}else if($ instanceof it){const E={idx:y,def:et(p),ruleStack:v,occurrenceStack:k};d.push(E);d.push(s);const C={idx:y,def:$.definition.concat(et(p)),ruleStack:v,occurrenceStack:k};d.push(C)}else if($ instanceof Ft){const E=new De({definition:$.definition,idx:$.idx});const C=$.definition.concat([E],et(p));const I={idx:y,def:C,ruleStack:v,occurrenceStack:k};d.push(I)}else if($ instanceof Kt){const E=new Ee({terminalType:$.separator});const C=new De({definition:[E].concat($.definition),idx:$.idx});const I=$.definition.concat([C],et(p));const Y={idx:y,def:I,ruleStack:v,occurrenceStack:k};d.push(Y)}else if($ instanceof St){const E={idx:y,def:et(p),ruleStack:v,occurrenceStack:k};d.push(E);d.push(s);const C=new Ee({terminalType:$.separator});const I=new De({definition:[C].concat($.definition),idx:$.idx});const Y=$.definition.concat([I],et(p));const q={idx:y,def:Y,ruleStack:v,occurrenceStack:k};d.push(q)}else if($ instanceof De){const E={idx:y,def:et(p),ruleStack:v,occurrenceStack:k};d.push(E);d.push(s);const C=new De({definition:$.definition,idx:$.idx});const I=$.definition.concat([C],et(p));const Y={idx:y,def:I,ruleStack:v,occurrenceStack:k};d.push(Y)}else if($ instanceof At){for(let E=$.definition.length-1;E>=0;E--){const C=$.definition[E];const I={idx:y,def:C.definition.concat(et(p)),ruleStack:v,occurrenceStack:k};d.push(I);d.push(s)}}else if($ instanceof Ct){d.push({idx:y,def:$.definition.concat(et(p)),ruleStack:v,occurrenceStack:k})}else if($ instanceof ei){d.push(Xk($,y,v,k))}else{throw Error("non exhaustive match")}}return c}function Xk(t,e,n,r){const i=at(n);i.push(t.name);const a=at(r);a.push(1);return{idx:e,def:t.definition,ruleStack:i,occurrenceStack:a}}var ke;(function(t){t[t["OPTION"]=0]="OPTION";t[t["REPETITION"]=1]="REPETITION";t[t["REPETITION_MANDATORY"]=2]="REPETITION_MANDATORY";t[t["REPETITION_MANDATORY_WITH_SEPARATOR"]=3]="REPETITION_MANDATORY_WITH_SEPARATOR";t[t["REPETITION_WITH_SEPARATOR"]=4]="REPETITION_WITH_SEPARATOR";t[t["ALTERNATION"]=5]="ALTERNATION"})(ke||(ke={}));function Op(t){if(t instanceof it||t==="Option"){return ke.OPTION}else if(t instanceof De||t==="Repetition"){return ke.REPETITION}else if(t instanceof Ft||t==="RepetitionMandatory"){return ke.REPETITION_MANDATORY}else if(t instanceof Kt||t==="RepetitionMandatoryWithSeparator"){return ke.REPETITION_MANDATORY_WITH_SEPARATOR}else if(t instanceof St||t==="RepetitionWithSeparator"){return ke.REPETITION_WITH_SEPARATOR}else if(t instanceof At||t==="Alternation"){return ke.ALTERNATION}else{throw Error("non exhaustive match")}}function Jm(t){const{occurrence:e,rule:n,prodType:r,maxLookahead:i}=t;const a=Op(r);if(a===ke.ALTERNATION){return ac(e,n,i)}else{return sc(e,n,a,i)}}function Yk(t,e,n,r,i,a){const s=ac(t,e,n);const o=LR(s)?yu:ls;return a(s,r,o,i)}function Jk(t,e,n,r,i,a){const s=sc(t,e,i,n);const o=LR(s)?yu:ls;return a(s[0],o,r)}function Qk(t,e,n,r){const i=t.length;const a=Yt(t,s=>{return Yt(s,o=>{return o.length===1})});if(e){return function(s){const o=H(s,l=>l.GATE);for(let l=0;l<i;l++){const u=t[l];const c=u.length;const d=o[l];if(d!==void 0&&d.call(this)===false){continue}e:for(let f=0;f<c;f++){const p=u[f];const y=p.length;for(let v=0;v<y;v++){const k=this.LA(v+1);if(n(k,p[v])===false){continue e}}return l}}return void 0}}else if(a&&!r){const s=H(t,l=>{return jt(l)});const o=gt(s,(l,u,c)=>{X(u,d=>{if(!Q(l,d.tokenTypeIdx)){l[d.tokenTypeIdx]=c}X(d.categoryMatches,f=>{if(!Q(l,f)){l[f]=c}})});return l},{});return function(){const l=this.LA(1);return o[l.tokenTypeIdx]}}else{return function(){for(let s=0;s<i;s++){const o=t[s];const l=o.length;e:for(let u=0;u<l;u++){const c=o[u];const d=c.length;for(let f=0;f<d;f++){const p=this.LA(f+1);if(n(p,c[f])===false){continue e}}return s}}return void 0}}}function Zk(t,e,n){const r=Yt(t,a=>{return a.length===1});const i=t.length;if(r&&!n){const a=jt(t);if(a.length===1&&ge(a[0].categoryMatches)){const s=a[0];const o=s.tokenTypeIdx;return function(){return this.LA(1).tokenTypeIdx===o}}else{const s=gt(a,(o,l,u)=>{o[l.tokenTypeIdx]=true;X(l.categoryMatches,c=>{o[c]=true});return o},[]);return function(){const o=this.LA(1);return s[o.tokenTypeIdx]===true}}}else{return function(){e:for(let a=0;a<i;a++){const s=t[a];const o=s.length;for(let l=0;l<o;l++){const u=this.LA(l+1);if(e(u,s[l])===false){continue e}}return true}return false}}}class eb extends nc{constructor(e,n,r){super();this.topProd=e;this.targetOccurrence=n;this.targetProdType=r}startWalking(){this.walk(this.topProd);return this.restDef}checkIsTarget(e,n,r,i){if(e.idx===this.targetOccurrence&&this.targetProdType===n){this.restDef=r.concat(i);return true}return false}walkOption(e,n,r){if(!this.checkIsTarget(e,ke.OPTION,n,r)){super.walkOption(e,n,r)}}walkAtLeastOne(e,n,r){if(!this.checkIsTarget(e,ke.REPETITION_MANDATORY,n,r)){super.walkOption(e,n,r)}}walkAtLeastOneSep(e,n,r){if(!this.checkIsTarget(e,ke.REPETITION_MANDATORY_WITH_SEPARATOR,n,r)){super.walkOption(e,n,r)}}walkMany(e,n,r){if(!this.checkIsTarget(e,ke.REPETITION,n,r)){super.walkOption(e,n,r)}}walkManySep(e,n,r){if(!this.checkIsTarget(e,ke.REPETITION_WITH_SEPARATOR,n,r)){super.walkOption(e,n,r)}}}class OR extends ti{constructor(e,n,r){super();this.targetOccurrence=e;this.targetProdType=n;this.targetRef=r;this.result=[]}checkIsTarget(e,n){if(e.idx===this.targetOccurrence&&this.targetProdType===n&&(this.targetRef===void 0||e===this.targetRef)){this.result=e.definition}}visitOption(e){this.checkIsTarget(e,ke.OPTION)}visitRepetition(e){this.checkIsTarget(e,ke.REPETITION)}visitRepetitionMandatory(e){this.checkIsTarget(e,ke.REPETITION_MANDATORY)}visitRepetitionMandatoryWithSeparator(e){this.checkIsTarget(e,ke.REPETITION_MANDATORY_WITH_SEPARATOR)}visitRepetitionWithSeparator(e){this.checkIsTarget(e,ke.REPETITION_WITH_SEPARATOR)}visitAlternation(e){this.checkIsTarget(e,ke.ALTERNATION)}}function Qm(t){const e=new Array(t);for(let n=0;n<t;n++){e[n]=[]}return e}function Tc(t){let e=[""];for(let n=0;n<t.length;n++){const r=t[n];const i=[];for(let a=0;a<e.length;a++){const s=e[a];i.push(s+"_"+r.tokenTypeIdx);for(let o=0;o<r.categoryMatches.length;o++){const l="_"+r.categoryMatches[o];i.push(s+l)}}e=i}return e}function tb(t,e,n){for(let r=0;r<t.length;r++){if(r===n){continue}const i=t[r];for(let a=0;a<e.length;a++){const s=e[a];if(i[s]===true){return false}}}return true}function IR(t,e){const n=H(t,s=>Bd([s],1));const r=Qm(n.length);const i=H(n,s=>{const o={};X(s,l=>{const u=Tc(l.partialPath);X(u,c=>{o[c]=true})});return o});let a=n;for(let s=1;s<=e;s++){const o=a;a=Qm(o.length);for(let l=0;l<o.length;l++){const u=o[l];for(let c=0;c<u.length;c++){const d=u[c].partialPath;const f=u[c].suffixDef;const p=Tc(d);const y=tb(i,p,l);if(y||ge(f)||d.length===e){const v=r[l];if(Wd(v,d)===false){v.push(d);for(let k=0;k<p.length;k++){const $=p[k];i[l][$]=true}}}else{const v=Bd(f,s+1,d);a[l]=a[l].concat(v);X(v,k=>{const $=Tc(k.partialPath);X($,E=>{i[l][E]=true})})}}}}return r}function ac(t,e,n,r){const i=new OR(t,ke.ALTERNATION,r);e.accept(i);return IR(i.result,n)}function sc(t,e,n,r){const i=new OR(t,n);e.accept(i);const a=i.result;const s=new eb(e,t,n);const o=s.startWalking();const l=new Ct({definition:a});const u=new Ct({definition:o});return IR([l,u],r)}function Wd(t,e){e:for(let n=0;n<t.length;n++){const r=t[n];if(r.length!==e.length){continue}for(let i=0;i<r.length;i++){const a=e[i];const s=r[i];const o=a===s||s.categoryMatchesMap[a.tokenTypeIdx]!==void 0;if(o===false){continue e}}return true}return false}function nb(t,e){return t.length<e.length&&Yt(t,(n,r)=>{const i=e[r];return n===i||i.categoryMatchesMap[n.tokenTypeIdx]})}function LR(t){return Yt(t,e=>Yt(e,n=>Yt(n,r=>ge(r.categoryMatches))))}function rb(t){const e=t.lookaheadStrategy.validate({rules:t.rules,tokenTypes:t.tokenTypes,grammarName:t.grammarName});return H(e,n=>Object.assign({type:vt.CUSTOM_LOOKAHEAD_VALIDATION},n))}function ib(t,e,n,r){const i=Lt(t,l=>ab(l,n));const a=gb(t,e,n);const s=Lt(t,l=>pb(l,n));const o=Lt(t,l=>lb(l,t,r,n));return i.concat(a,s,o)}function ab(t,e){const n=new ob;t.accept(n);const r=n.allProductions;const i=TA(r,sb);const a=tn(i,o=>{return o.length>1});const s=H(Ve(a),o=>{const l=Zt(o);const u=e.buildDuplicateFoundError(t,o);const c=sn(l);const d={message:u,type:vt.DUPLICATE_PRODUCTIONS,ruleName:t.name,dslName:c,occurrence:l.idx};const f=xR(l);if(f){d.parameter=f}return d});return s}function sb(t){return`${sn(t)}_#_${t.idx}_#_${xR(t)}`}function xR(t){if(t instanceof Ee){return t.terminalType.name}else if(t instanceof Rt){return t.nonTerminalName}else{return""}}class ob extends ti{constructor(){super(...arguments);this.allProductions=[]}visitNonTerminal(e){this.allProductions.push(e)}visitOption(e){this.allProductions.push(e)}visitRepetitionWithSeparator(e){this.allProductions.push(e)}visitRepetitionMandatory(e){this.allProductions.push(e)}visitRepetitionMandatoryWithSeparator(e){this.allProductions.push(e)}visitRepetition(e){this.allProductions.push(e)}visitAlternation(e){this.allProductions.push(e)}visitTerminal(e){this.allProductions.push(e)}}function lb(t,e,n,r){const i=[];const a=gt(e,(s,o)=>{if(o.name===t.name){return s+1}return s},0);if(a>1){const s=r.buildDuplicateRuleNameError({topLevelRule:t,grammarName:n});i.push({message:s,type:vt.DUPLICATE_RULE_NAME,ruleName:t.name})}return i}function ub(t,e,n){const r=[];let i;if(!$t(e,t)){i=`Invalid rule override, rule: ->${t}<- cannot be overridden in the grammar: ->${n}<-as it is not defined in any of the super grammars `;r.push({message:i,type:vt.INVALID_RULE_OVERRIDE,ruleName:t})}return r}function MR(t,e,n,r=[]){const i=[];const a=Vl(e.definition);if(ge(a)){return[]}else{const s=t.name;const o=$t(a,t);if(o){i.push({message:n.buildLeftRecursionError({topLevelRule:t,leftRecursionPath:r}),type:vt.LEFT_RECURSION,ruleName:s})}const l=ec(a,r.concat([t]));const u=Lt(l,c=>{const d=at(r);d.push(c);return MR(t,c,n,d)});return i.concat(u)}}function Vl(t){let e=[];if(ge(t)){return e}const n=Zt(t);if(n instanceof Rt){e.push(n.referencedRule)}else if(n instanceof Ct||n instanceof it||n instanceof Ft||n instanceof Kt||n instanceof St||n instanceof De){e=e.concat(Vl(n.definition))}else if(n instanceof At){e=jt(H(n.definition,a=>Vl(a.definition)))}else if(n instanceof Ee);else{throw Error("non exhaustive match")}const r=mu(n);const i=t.length>1;if(r&&i){const a=et(t);return e.concat(Vl(a))}else{return e}}class Ip extends ti{constructor(){super(...arguments);this.alternations=[]}visitAlternation(e){this.alternations.push(e)}}function cb(t,e){const n=new Ip;t.accept(n);const r=n.alternations;const i=Lt(r,a=>{const s=Ga(a.definition);return Lt(s,(o,l)=>{const u=DR([o],[],ls,1);if(ge(u)){return[{message:e.buildEmptyAlternationError({topLevelRule:t,alternation:a,emptyChoiceIdx:l}),type:vt.NONE_LAST_EMPTY_ALT,ruleName:t.name,occurrence:a.idx,alternative:l+1}]}else{return[]}})});return i}function db(t,e,n){const r=new Ip;t.accept(r);let i=r.alternations;i=tc(i,s=>s.ignoreAmbiguities===true);const a=Lt(i,s=>{const o=s.idx;const l=s.maxLookahead||e;const u=ac(o,t,l,s);const c=hb(u,s,t,n);const d=yb(u,s,t,n);return c.concat(d)});return a}class fb extends ti{constructor(){super(...arguments);this.allProductions=[]}visitRepetitionWithSeparator(e){this.allProductions.push(e)}visitRepetitionMandatory(e){this.allProductions.push(e)}visitRepetitionMandatoryWithSeparator(e){this.allProductions.push(e)}visitRepetition(e){this.allProductions.push(e)}}function pb(t,e){const n=new Ip;t.accept(n);const r=n.alternations;const i=Lt(r,a=>{if(a.definition.length>255){return[{message:e.buildTooManyAlternativesError({topLevelRule:t,alternation:a}),type:vt.TOO_MANY_ALTS,ruleName:t.name,occurrence:a.idx}]}else{return[]}});return i}function mb(t,e,n){const r=[];X(t,i=>{const a=new fb;i.accept(a);const s=a.allProductions;X(s,o=>{const l=Op(o);const u=o.maxLookahead||e;const c=o.idx;const d=sc(c,i,l,u);const f=d[0];if(ge(jt(f))){const p=n.buildEmptyRepetitionError({topLevelRule:i,repetition:o});r.push({message:p,type:vt.NO_NON_EMPTY_LOOKAHEAD,ruleName:i.name})}})});return r}function hb(t,e,n,r){const i=[];const a=gt(t,(o,l,u)=>{if(e.definition[u].ignoreAmbiguities===true){return o}X(l,c=>{const d=[u];X(t,(f,p)=>{if(u!==p&&Wd(f,c)&&e.definition[p].ignoreAmbiguities!==true){d.push(p)}});if(d.length>1&&!Wd(i,c)){i.push(c);o.push({alts:d,path:c})}});return o},[]);const s=H(a,o=>{const l=H(o.alts,c=>c+1);const u=r.buildAlternationAmbiguityError({topLevelRule:n,alternation:e,ambiguityIndices:l,prefixPath:o.path});return{message:u,type:vt.AMBIGUOUS_ALTS,ruleName:n.name,occurrence:e.idx,alternatives:o.alts}});return s}function yb(t,e,n,r){const i=gt(t,(s,o,l)=>{const u=H(o,c=>{return{idx:l,path:c}});return s.concat(u)},[]);const a=ss(Lt(i,s=>{const o=e.definition[s.idx];if(o.ignoreAmbiguities===true){return[]}const l=s.idx;const u=s.path;const c=Mt(i,f=>{return e.definition[f.idx].ignoreAmbiguities!==true&&f.idx<l&&nb(f.path,u)});const d=H(c,f=>{const p=[f.idx+1,l+1];const y=e.idx===0?"":e.idx;const v=r.buildAlternationPrefixAmbiguityError({topLevelRule:n,alternation:e,ambiguityIndices:p,prefixPath:f.path});return{message:v,type:vt.AMBIGUOUS_PREFIX_ALTS,ruleName:n.name,occurrence:y,alternatives:p}});return d}));return a}function gb(t,e,n){const r=[];const i=H(e,a=>a.name);X(t,a=>{const s=a.name;if($t(i,s)){const o=n.buildNamespaceConflictError(a);r.push({message:o,type:vt.CONFLICT_TOKENS_RULES_NAMESPACE,ruleName:s})}});return r}function Rb(t){const e=Np(t,{errMsgProvider:Hk});const n={};X(t.rules,r=>{n[r.name]=r});return qk(n,e.errMsgProvider)}function vb(t){t=Np(t,{errMsgProvider:Rr});return ib(t.rules,t.tokenTypes,t.errMsgProvider,t.grammarName)}const FR="MismatchedTokenException";const KR="NoViableAltException";const UR="EarlyExitException";const GR="NotAllInputParsedException";const HR=[FR,KR,UR,GR];Object.freeze(HR);function gu(t){return $t(HR,t.name)}class oc extends Error{constructor(e,n){super(e);this.token=n;this.resyncedTokens=[];Object.setPrototypeOf(this,new.target.prototype);if(Error.captureStackTrace){Error.captureStackTrace(this,this.constructor)}}}class qR extends oc{constructor(e,n,r){super(e,n);this.previousToken=r;this.name=FR}}class $b extends oc{constructor(e,n,r){super(e,n);this.previousToken=r;this.name=KR}}class Tb extends oc{constructor(e,n){super(e,n);this.name=GR}}class Eb extends oc{constructor(e,n,r){super(e,n);this.previousToken=r;this.name=UR}}const Ec={};const jR="InRuleRecoveryException";class wb extends Error{constructor(e){super(e);this.name=jR}}class Cb{initRecoverable(e){this.firstAfterRepMap={};this.resyncFollows={};this.recoveryEnabled=Q(e,"recoveryEnabled")?e.recoveryEnabled:Un.recoveryEnabled;if(this.recoveryEnabled){this.attemptInRepetitionRecovery=Sb}}getTokenToInsert(e){const n=Dp(e,"",NaN,NaN,NaN,NaN,NaN,NaN);n.isInsertedInRecovery=true;return n}canTokenTypeBeInsertedInRecovery(e){return true}canTokenTypeBeDeletedInRecovery(e){return true}tryInRepetitionRecovery(e,n,r,i){const a=this.findReSyncTokenType();const s=this.exportLexerState();const o=[];let l=false;const u=this.LA(1);let c=this.LA(1);const d=()=>{const f=this.LA(0);const p=this.errorMessageProvider.buildMismatchTokenMessage({expected:i,actual:u,previous:f,ruleName:this.getCurrRuleFullName()});const y=new qR(p,u,this.LA(0));y.resyncedTokens=Ga(o);this.SAVE_ERROR(y)};while(!l){if(this.tokenMatcher(c,i)){d();return}else if(r.call(this)){d();e.apply(this,n);return}else if(this.tokenMatcher(c,a)){l=true}else{c=this.SKIP_TOKEN();this.addToResyncTokens(c,o)}}this.importLexerState(s)}shouldInRepetitionRecoveryBeTried(e,n,r){if(r===false){return false}if(this.tokenMatcher(this.LA(1),e)){return false}if(this.isBackTracking()){return false}if(this.canPerformInRuleRecovery(e,this.getFollowsForInRuleRecovery(e,n))){return false}return true}getFollowsForInRuleRecovery(e,n){const r=this.getCurrentGrammarPath(e,n);const i=this.getNextPossibleTokenTypes(r);return i}tryInRuleRecovery(e,n){if(this.canRecoverWithSingleTokenInsertion(e,n)){const r=this.getTokenToInsert(e);return r}if(this.canRecoverWithSingleTokenDeletion(e)){const r=this.SKIP_TOKEN();this.consumeToken();return r}throw new wb("sad sad panda")}canPerformInRuleRecovery(e,n){return this.canRecoverWithSingleTokenInsertion(e,n)||this.canRecoverWithSingleTokenDeletion(e)}canRecoverWithSingleTokenInsertion(e,n){if(!this.canTokenTypeBeInsertedInRecovery(e)){return false}if(ge(n)){return false}const r=this.LA(1);const i=Wr(n,a=>{return this.tokenMatcher(r,a)})!==void 0;return i}canRecoverWithSingleTokenDeletion(e){if(!this.canTokenTypeBeDeletedInRecovery(e)){return false}const n=this.tokenMatcher(this.LA(2),e);return n}isInCurrentRuleReSyncSet(e){const n=this.getCurrFollowKey();const r=this.getFollowSetFromFollowKey(n);return $t(r,e)}findReSyncTokenType(){const e=this.flattenFollowSet();let n=this.LA(1);let r=2;while(true){const i=Wr(e,a=>{const s=_R(n,a);return s});if(i!==void 0){return i}n=this.LA(r);r++}}getCurrFollowKey(){if(this.RULE_STACK.length===1){return Ec}const e=this.getLastExplicitRuleShortName();const n=this.getLastExplicitRuleOccurrenceIndex();const r=this.getPreviousExplicitRuleShortName();return{ruleName:this.shortRuleNameToFullName(e),idxInCallingRule:n,inRule:this.shortRuleNameToFullName(r)}}buildFullFollowKeyStack(){const e=this.RULE_STACK;const n=this.RULE_OCCURRENCE_STACK;return H(e,(r,i)=>{if(i===0){return Ec}return{ruleName:this.shortRuleNameToFullName(r),idxInCallingRule:n[i],inRule:this.shortRuleNameToFullName(e[i-1])}})}flattenFollowSet(){const e=H(this.buildFullFollowKeyStack(),n=>{return this.getFollowSetFromFollowKey(n)});return jt(e)}getFollowSetFromFollowKey(e){if(e===Ec){return[Zn]}const n=e.ruleName+e.idxInCallingRule+TR+e.inRule;return this.resyncFollows[n]}addToResyncTokens(e,n){if(!this.tokenMatcher(e,Zn)){n.push(e)}return n}reSyncTo(e){const n=[];let r=this.LA(1);while(this.tokenMatcher(r,e)===false){r=this.SKIP_TOKEN();this.addToResyncTokens(r,n)}return Ga(n)}attemptInRepetitionRecovery(e,n,r,i,a,s,o){}getCurrentGrammarPath(e,n){const r=this.getHumanReadableRuleStack();const i=at(this.RULE_OCCURRENCE_STACK);const a={ruleStack:r,occurrenceStack:i,lastTok:e,lastTokOccurrence:n};return a}getHumanReadableRuleStack(){return H(this.RULE_STACK,e=>this.shortRuleNameToFullName(e))}}function Sb(t,e,n,r,i,a,s){const o=this.getKeyForAutomaticLookahead(r,i);let l=this.firstAfterRepMap[o];if(l===void 0){const f=this.getCurrRuleFullName();const p=this.getGAstProductions()[f];const y=new a(p,i);l=y.startWalking();this.firstAfterRepMap[o]=l}let u=l.token;let c=l.occurrence;const d=l.isEndOfRule;if(this.RULE_STACK.length===1&&d&&u===void 0){u=Zn;c=1}if(u===void 0||c===void 0){return}if(this.shouldInRepetitionRecoveryBeTried(u,c,s)){this.tryInRepetitionRecovery(t,e,n,u)}}const Ab=4;const ir=8;const BR=1<<ir;const WR=2<<ir;const Vd=3<<ir;const zd=4<<ir;const Xd=5<<ir;const zl=6<<ir;function wc(t,e,n){return n|e|t}class Lp{constructor(e){var n;this.maxLookahead=(n=e===null||e===void 0?void 0:e.maxLookahead)!==null&&n!==void 0?n:Un.maxLookahead}validate(e){const n=this.validateNoLeftRecursion(e.rules);if(ge(n)){const r=this.validateEmptyOrAlternatives(e.rules);const i=this.validateAmbiguousAlternationAlternatives(e.rules,this.maxLookahead);const a=this.validateSomeNonEmptyLookaheadPath(e.rules,this.maxLookahead);const s=[...n,...r,...i,...a];return s}return n}validateNoLeftRecursion(e){return Lt(e,n=>MR(n,n,Rr))}validateEmptyOrAlternatives(e){return Lt(e,n=>cb(n,Rr))}validateAmbiguousAlternationAlternatives(e,n){return Lt(e,r=>db(r,n,Rr))}validateSomeNonEmptyLookaheadPath(e,n){return mb(e,n,Rr)}buildLookaheadForAlternation(e){return Yk(e.prodOccurrence,e.rule,e.maxLookahead,e.hasPredicates,e.dynamicTokensEnabled,Qk)}buildLookaheadForOptional(e){return Jk(e.prodOccurrence,e.rule,e.maxLookahead,e.dynamicTokensEnabled,Op(e.prodType),Zk)}}class kb{initLooksAhead(e){this.dynamicTokensEnabled=Q(e,"dynamicTokensEnabled")?e.dynamicTokensEnabled:Un.dynamicTokensEnabled;this.maxLookahead=Q(e,"maxLookahead")?e.maxLookahead:Un.maxLookahead;this.lookaheadStrategy=Q(e,"lookaheadStrategy")?e.lookaheadStrategy:new Lp({maxLookahead:this.maxLookahead});this.lookAheadFuncsCache=new Map}preComputeLookaheadFunctions(e){X(e,n=>{this.TRACE_INIT(`${n.name} Rule Lookahead`,()=>{const{alternation:r,repetition:i,option:a,repetitionMandatory:s,repetitionMandatoryWithSeparator:o,repetitionWithSeparator:l}=Nb(n);X(r,u=>{const c=u.idx===0?"":u.idx;this.TRACE_INIT(`${sn(u)}${c}`,()=>{const d=this.lookaheadStrategy.buildLookaheadForAlternation({prodOccurrence:u.idx,rule:n,maxLookahead:u.maxLookahead||this.maxLookahead,hasPredicates:u.hasPredicates,dynamicTokensEnabled:this.dynamicTokensEnabled});const f=wc(this.fullRuleNameToShort[n.name],BR,u.idx);this.setLaFuncCache(f,d)})});X(i,u=>{this.computeLookaheadFunc(n,u.idx,Vd,"Repetition",u.maxLookahead,sn(u))});X(a,u=>{this.computeLookaheadFunc(n,u.idx,WR,"Option",u.maxLookahead,sn(u))});X(s,u=>{this.computeLookaheadFunc(n,u.idx,zd,"RepetitionMandatory",u.maxLookahead,sn(u))});X(o,u=>{this.computeLookaheadFunc(n,u.idx,zl,"RepetitionMandatoryWithSeparator",u.maxLookahead,sn(u))});X(l,u=>{this.computeLookaheadFunc(n,u.idx,Xd,"RepetitionWithSeparator",u.maxLookahead,sn(u))})})})}computeLookaheadFunc(e,n,r,i,a,s){this.TRACE_INIT(`${s}${n===0?"":n}`,()=>{const o=this.lookaheadStrategy.buildLookaheadForOptional({prodOccurrence:n,rule:e,maxLookahead:a||this.maxLookahead,dynamicTokensEnabled:this.dynamicTokensEnabled,prodType:i});const l=wc(this.fullRuleNameToShort[e.name],r,n);this.setLaFuncCache(l,o)})}getKeyForAutomaticLookahead(e,n){const r=this.getLastExplicitRuleShortName();return wc(r,e,n)}getLaFuncFromCache(e){return this.lookAheadFuncsCache.get(e)}setLaFuncCache(e,n){this.lookAheadFuncsCache.set(e,n)}}class bb extends ti{constructor(){super(...arguments);this.dslMethods={option:[],alternation:[],repetition:[],repetitionWithSeparator:[],repetitionMandatory:[],repetitionMandatoryWithSeparator:[]}}reset(){this.dslMethods={option:[],alternation:[],repetition:[],repetitionWithSeparator:[],repetitionMandatory:[],repetitionMandatoryWithSeparator:[]}}visitOption(e){this.dslMethods.option.push(e)}visitRepetitionWithSeparator(e){this.dslMethods.repetitionWithSeparator.push(e)}visitRepetitionMandatory(e){this.dslMethods.repetitionMandatory.push(e)}visitRepetitionMandatoryWithSeparator(e){this.dslMethods.repetitionMandatoryWithSeparator.push(e)}visitRepetition(e){this.dslMethods.repetition.push(e)}visitAlternation(e){this.dslMethods.alternation.push(e)}}const Gs=new bb;function Nb(t){Gs.reset();t.accept(Gs);const e=Gs.dslMethods;Gs.reset();return e}function Zm(t,e){if(isNaN(t.startOffset)===true){t.startOffset=e.startOffset;t.endOffset=e.endOffset}else if(t.endOffset<e.endOffset===true){t.endOffset=e.endOffset}}function eh(t,e){if(isNaN(t.startOffset)===true){t.startOffset=e.startOffset;t.startColumn=e.startColumn;t.startLine=e.startLine;t.endOffset=e.endOffset;t.endColumn=e.endColumn;t.endLine=e.endLine}else if(t.endOffset<e.endOffset===true){t.endOffset=e.endOffset;t.endColumn=e.endColumn;t.endLine=e.endLine}}function Pb(t,e,n){if(t.children[n]===void 0){t.children[n]=[e]}else{t.children[n].push(e)}}function _b(t,e,n){if(t.children[e]===void 0){t.children[e]=[n]}else{t.children[e].push(n)}}const Db="name";function VR(t,e){Object.defineProperty(t,Db,{enumerable:false,configurable:true,writable:false,value:e})}function Ob(t,e){const n=Vt(t);const r=n.length;for(let i=0;i<r;i++){const a=n[i];const s=t[a];const o=s.length;for(let l=0;l<o;l++){const u=s[l];if(u.tokenTypeIdx===void 0){this[u.name](u.children,e)}}}}function Ib(t,e){const n=function(){};VR(n,t+"BaseSemantics");const r={visit:function(i,a){if(le(i)){i=i[0]}if(Kn(i)){return void 0}return this[i.name](i.children,a)},validateVisitor:function(){const i=xb(this,e);if(!ge(i)){const a=H(i,s=>s.msg);throw Error(`Errors Detected in CST Visitor <${this.constructor.name}>:
	${a.join("\n\n").replace(/\n/g,"\n	")}`)}}};n.prototype=r;n.prototype.constructor=n;n._RULE_NAMES=e;return n}function Lb(t,e,n){const r=function(){};VR(r,t+"BaseSemanticsWithDefaults");const i=Object.create(n.prototype);X(e,a=>{i[a]=Ob});r.prototype=i;r.prototype.constructor=r;return r}var Yd;(function(t){t[t["REDUNDANT_METHOD"]=0]="REDUNDANT_METHOD";t[t["MISSING_METHOD"]=1]="MISSING_METHOD"})(Yd||(Yd={}));function xb(t,e){const n=Mb(t,e);return n}function Mb(t,e){const n=Mt(e,i=>{return Hn(t[i])===false});const r=H(n,i=>{return{msg:`Missing visitor method: <${i}> on ${t.constructor.name} CST Visitor.`,type:Yd.MISSING_METHOD,methodName:i}});return ss(r)}class Fb{initTreeBuilder(e){this.CST_STACK=[];this.outputCst=e.outputCst;this.nodeLocationTracking=Q(e,"nodeLocationTracking")?e.nodeLocationTracking:Un.nodeLocationTracking;if(!this.outputCst){this.cstInvocationStateUpdate=We;this.cstFinallyStateUpdate=We;this.cstPostTerminal=We;this.cstPostNonTerminal=We;this.cstPostRule=We}else{if(/full/i.test(this.nodeLocationTracking)){if(this.recoveryEnabled){this.setNodeLocationFromToken=eh;this.setNodeLocationFromNode=eh;this.cstPostRule=We;this.setInitialNodeLocation=this.setInitialNodeLocationFullRecovery}else{this.setNodeLocationFromToken=We;this.setNodeLocationFromNode=We;this.cstPostRule=this.cstPostRuleFull;this.setInitialNodeLocation=this.setInitialNodeLocationFullRegular}}else if(/onlyOffset/i.test(this.nodeLocationTracking)){if(this.recoveryEnabled){this.setNodeLocationFromToken=Zm;this.setNodeLocationFromNode=Zm;this.cstPostRule=We;this.setInitialNodeLocation=this.setInitialNodeLocationOnlyOffsetRecovery}else{this.setNodeLocationFromToken=We;this.setNodeLocationFromNode=We;this.cstPostRule=this.cstPostRuleOnlyOffset;this.setInitialNodeLocation=this.setInitialNodeLocationOnlyOffsetRegular}}else if(/none/i.test(this.nodeLocationTracking)){this.setNodeLocationFromToken=We;this.setNodeLocationFromNode=We;this.cstPostRule=We;this.setInitialNodeLocation=We}else{throw Error(`Invalid <nodeLocationTracking> config option: "${e.nodeLocationTracking}"`)}}}setInitialNodeLocationOnlyOffsetRecovery(e){e.location={startOffset:NaN,endOffset:NaN}}setInitialNodeLocationOnlyOffsetRegular(e){e.location={startOffset:this.LA(1).startOffset,endOffset:NaN}}setInitialNodeLocationFullRecovery(e){e.location={startOffset:NaN,startLine:NaN,startColumn:NaN,endOffset:NaN,endLine:NaN,endColumn:NaN}}setInitialNodeLocationFullRegular(e){const n=this.LA(1);e.location={startOffset:n.startOffset,startLine:n.startLine,startColumn:n.startColumn,endOffset:NaN,endLine:NaN,endColumn:NaN}}cstInvocationStateUpdate(e){const n={name:e,children:Object.create(null)};this.setInitialNodeLocation(n);this.CST_STACK.push(n)}cstFinallyStateUpdate(){this.CST_STACK.pop()}cstPostRuleFull(e){const n=this.LA(0);const r=e.location;if(r.startOffset<=n.startOffset===true){r.endOffset=n.endOffset;r.endLine=n.endLine;r.endColumn=n.endColumn}else{r.startOffset=NaN;r.startLine=NaN;r.startColumn=NaN}}cstPostRuleOnlyOffset(e){const n=this.LA(0);const r=e.location;if(r.startOffset<=n.startOffset===true){r.endOffset=n.endOffset}else{r.startOffset=NaN}}cstPostTerminal(e,n){const r=this.CST_STACK[this.CST_STACK.length-1];Pb(r,n,e);this.setNodeLocationFromToken(r.location,n)}cstPostNonTerminal(e,n){const r=this.CST_STACK[this.CST_STACK.length-1];_b(r,n,e);this.setNodeLocationFromNode(r.location,e.location)}getBaseCstVisitorConstructor(){if(Kn(this.baseCstVisitorConstructor)){const e=Ib(this.className,Vt(this.gastProductionsCache));this.baseCstVisitorConstructor=e;return e}return this.baseCstVisitorConstructor}getBaseCstVisitorConstructorWithDefaults(){if(Kn(this.baseCstVisitorWithDefaultsConstructor)){const e=Lb(this.className,Vt(this.gastProductionsCache),this.getBaseCstVisitorConstructor());this.baseCstVisitorWithDefaultsConstructor=e;return e}return this.baseCstVisitorWithDefaultsConstructor}getLastExplicitRuleShortName(){const e=this.RULE_STACK;return e[e.length-1]}getPreviousExplicitRuleShortName(){const e=this.RULE_STACK;return e[e.length-2]}getLastExplicitRuleOccurrenceIndex(){const e=this.RULE_OCCURRENCE_STACK;return e[e.length-1]}}class Kb{initLexerAdapter(){this.tokVector=[];this.tokVectorLength=0;this.currIdx=-1}set input(e){if(this.selfAnalysisDone!==true){throw Error(`Missing <performSelfAnalysis> invocation at the end of the Parser's constructor.`)}this.reset();this.tokVector=e;this.tokVectorLength=e.length}get input(){return this.tokVector}SKIP_TOKEN(){if(this.currIdx<=this.tokVector.length-2){this.consumeToken();return this.LA(1)}else{return vu}}LA(e){const n=this.currIdx+e;if(n<0||this.tokVectorLength<=n){return vu}else{return this.tokVector[n]}}consumeToken(){this.currIdx++}exportLexerState(){return this.currIdx}importLexerState(e){this.currIdx=e}resetLexerState(){this.currIdx=-1}moveToTerminatedState(){this.currIdx=this.tokVector.length-1}getLexerPosition(){return this.exportLexerState()}}class Ub{ACTION(e){return e.call(this)}consume(e,n,r){return this.consumeInternal(n,e,r)}subrule(e,n,r){return this.subruleInternal(n,e,r)}option(e,n){return this.optionInternal(n,e)}or(e,n){return this.orInternal(n,e)}many(e,n){return this.manyInternal(e,n)}atLeastOne(e,n){return this.atLeastOneInternal(e,n)}CONSUME(e,n){return this.consumeInternal(e,0,n)}CONSUME1(e,n){return this.consumeInternal(e,1,n)}CONSUME2(e,n){return this.consumeInternal(e,2,n)}CONSUME3(e,n){return this.consumeInternal(e,3,n)}CONSUME4(e,n){return this.consumeInternal(e,4,n)}CONSUME5(e,n){return this.consumeInternal(e,5,n)}CONSUME6(e,n){return this.consumeInternal(e,6,n)}CONSUME7(e,n){return this.consumeInternal(e,7,n)}CONSUME8(e,n){return this.consumeInternal(e,8,n)}CONSUME9(e,n){return this.consumeInternal(e,9,n)}SUBRULE(e,n){return this.subruleInternal(e,0,n)}SUBRULE1(e,n){return this.subruleInternal(e,1,n)}SUBRULE2(e,n){return this.subruleInternal(e,2,n)}SUBRULE3(e,n){return this.subruleInternal(e,3,n)}SUBRULE4(e,n){return this.subruleInternal(e,4,n)}SUBRULE5(e,n){return this.subruleInternal(e,5,n)}SUBRULE6(e,n){return this.subruleInternal(e,6,n)}SUBRULE7(e,n){return this.subruleInternal(e,7,n)}SUBRULE8(e,n){return this.subruleInternal(e,8,n)}SUBRULE9(e,n){return this.subruleInternal(e,9,n)}OPTION(e){return this.optionInternal(e,0)}OPTION1(e){return this.optionInternal(e,1)}OPTION2(e){return this.optionInternal(e,2)}OPTION3(e){return this.optionInternal(e,3)}OPTION4(e){return this.optionInternal(e,4)}OPTION5(e){return this.optionInternal(e,5)}OPTION6(e){return this.optionInternal(e,6)}OPTION7(e){return this.optionInternal(e,7)}OPTION8(e){return this.optionInternal(e,8)}OPTION9(e){return this.optionInternal(e,9)}OR(e){return this.orInternal(e,0)}OR1(e){return this.orInternal(e,1)}OR2(e){return this.orInternal(e,2)}OR3(e){return this.orInternal(e,3)}OR4(e){return this.orInternal(e,4)}OR5(e){return this.orInternal(e,5)}OR6(e){return this.orInternal(e,6)}OR7(e){return this.orInternal(e,7)}OR8(e){return this.orInternal(e,8)}OR9(e){return this.orInternal(e,9)}MANY(e){this.manyInternal(0,e)}MANY1(e){this.manyInternal(1,e)}MANY2(e){this.manyInternal(2,e)}MANY3(e){this.manyInternal(3,e)}MANY4(e){this.manyInternal(4,e)}MANY5(e){this.manyInternal(5,e)}MANY6(e){this.manyInternal(6,e)}MANY7(e){this.manyInternal(7,e)}MANY8(e){this.manyInternal(8,e)}MANY9(e){this.manyInternal(9,e)}MANY_SEP(e){this.manySepFirstInternal(0,e)}MANY_SEP1(e){this.manySepFirstInternal(1,e)}MANY_SEP2(e){this.manySepFirstInternal(2,e)}MANY_SEP3(e){this.manySepFirstInternal(3,e)}MANY_SEP4(e){this.manySepFirstInternal(4,e)}MANY_SEP5(e){this.manySepFirstInternal(5,e)}MANY_SEP6(e){this.manySepFirstInternal(6,e)}MANY_SEP7(e){this.manySepFirstInternal(7,e)}MANY_SEP8(e){this.manySepFirstInternal(8,e)}MANY_SEP9(e){this.manySepFirstInternal(9,e)}AT_LEAST_ONE(e){this.atLeastOneInternal(0,e)}AT_LEAST_ONE1(e){return this.atLeastOneInternal(1,e)}AT_LEAST_ONE2(e){this.atLeastOneInternal(2,e)}AT_LEAST_ONE3(e){this.atLeastOneInternal(3,e)}AT_LEAST_ONE4(e){this.atLeastOneInternal(4,e)}AT_LEAST_ONE5(e){this.atLeastOneInternal(5,e)}AT_LEAST_ONE6(e){this.atLeastOneInternal(6,e)}AT_LEAST_ONE7(e){this.atLeastOneInternal(7,e)}AT_LEAST_ONE8(e){this.atLeastOneInternal(8,e)}AT_LEAST_ONE9(e){this.atLeastOneInternal(9,e)}AT_LEAST_ONE_SEP(e){this.atLeastOneSepFirstInternal(0,e)}AT_LEAST_ONE_SEP1(e){this.atLeastOneSepFirstInternal(1,e)}AT_LEAST_ONE_SEP2(e){this.atLeastOneSepFirstInternal(2,e)}AT_LEAST_ONE_SEP3(e){this.atLeastOneSepFirstInternal(3,e)}AT_LEAST_ONE_SEP4(e){this.atLeastOneSepFirstInternal(4,e)}AT_LEAST_ONE_SEP5(e){this.atLeastOneSepFirstInternal(5,e)}AT_LEAST_ONE_SEP6(e){this.atLeastOneSepFirstInternal(6,e)}AT_LEAST_ONE_SEP7(e){this.atLeastOneSepFirstInternal(7,e)}AT_LEAST_ONE_SEP8(e){this.atLeastOneSepFirstInternal(8,e)}AT_LEAST_ONE_SEP9(e){this.atLeastOneSepFirstInternal(9,e)}RULE(e,n,r=$u){if($t(this.definedRulesNames,e)){const a=Rr.buildDuplicateRuleNameError({topLevelRule:e,grammarName:this.className});const s={message:a,type:vt.DUPLICATE_RULE_NAME,ruleName:e};this.definitionErrors.push(s)}this.definedRulesNames.push(e);const i=this.defineRule(e,n,r);this[e]=i;return i}OVERRIDE_RULE(e,n,r=$u){const i=ub(e,this.definedRulesNames,this.className);this.definitionErrors=this.definitionErrors.concat(i);const a=this.defineRule(e,n,r);this[e]=a;return a}BACKTRACK(e,n){return function(){this.isBackTrackingStack.push(1);const r=this.saveRecogState();try{e.apply(this,n);return true}catch(i){if(gu(i)){return false}else{throw i}}finally{this.reloadRecogState(r);this.isBackTrackingStack.pop()}}}getGAstProductions(){return this.gastProductionsCache}getSerializedGastProductions(){return XA(Ve(this.gastProductionsCache))}}class Gb{initRecognizerEngine(e,n){this.className=this.constructor.name;this.shortRuleNameToFull={};this.fullRuleNameToShort={};this.ruleShortNameIdx=256;this.tokenMatcher=yu;this.subruleIdx=0;this.definedRulesNames=[];this.tokensMap={};this.isBackTrackingStack=[];this.RULE_STACK=[];this.RULE_OCCURRENCE_STACK=[];this.gastProductionsCache={};if(Q(n,"serializedGrammar")){throw Error("The Parser's configuration can no longer contain a <serializedGrammar> property.\n	See: https://chevrotain.io/docs/changes/BREAKING_CHANGES.html#_6-0-0\n	For Further details.")}if(le(e)){if(ge(e)){throw Error("A Token Vocabulary cannot be empty.\n	Note that the first argument for the parser constructor\n	is no longer a Token vector (since v4.0).")}if(typeof e[0].startOffset==="number"){throw Error("The Parser constructor no longer accepts a token vector as the first argument.\n	See: https://chevrotain.io/docs/changes/BREAKING_CHANGES.html#_4-0-0\n	For Further details.")}}if(le(e)){this.tokensMap=gt(e,(a,s)=>{a[s.name]=s;return a},{})}else if(Q(e,"modes")&&Yt(jt(Ve(e.modes)),Kk)){const a=jt(Ve(e.modes));const s=Pp(a);this.tokensMap=gt(s,(o,l)=>{o[l.name]=l;return o},{})}else if(Wt(e)){this.tokensMap=at(e)}else{throw new Error("<tokensDictionary> argument must be An Array of Token constructors, A dictionary of Token constructors or an IMultiModeLexerDefinition")}this.tokensMap["EOF"]=Zn;const r=Q(e,"modes")?jt(Ve(e.modes)):Ve(e);const i=Yt(r,a=>ge(a.categoryMatches));this.tokenMatcher=i?yu:ls;us(Ve(this.tokensMap))}defineRule(e,n,r){if(this.selfAnalysisDone){throw Error(`Grammar rule <${e}> may not be defined after the 'performSelfAnalysis' method has been called'
Make sure that all grammar rule definitions are done before 'performSelfAnalysis' is called.`)}const i=Q(r,"resyncEnabled")?r.resyncEnabled:$u.resyncEnabled;const a=Q(r,"recoveryValueFunc")?r.recoveryValueFunc:$u.recoveryValueFunc;const s=this.ruleShortNameIdx<<Ab+ir;this.ruleShortNameIdx++;this.shortRuleNameToFull[s]=e;this.fullRuleNameToShort[e]=s;let o;if(this.outputCst===true){o=function u(...c){try{this.ruleInvocationStateUpdate(s,e,this.subruleIdx);n.apply(this,c);const d=this.CST_STACK[this.CST_STACK.length-1];this.cstPostRule(d);return d}catch(d){return this.invokeRuleCatch(d,i,a)}finally{this.ruleFinallyStateUpdate()}}}else{o=function u(...c){try{this.ruleInvocationStateUpdate(s,e,this.subruleIdx);return n.apply(this,c)}catch(d){return this.invokeRuleCatch(d,i,a)}finally{this.ruleFinallyStateUpdate()}}}const l=Object.assign(o,{ruleName:e,originalGrammarAction:n});return l}invokeRuleCatch(e,n,r){const i=this.RULE_STACK.length===1;const a=n&&!this.isBackTracking()&&this.recoveryEnabled;if(gu(e)){const s=e;if(a){const o=this.findReSyncTokenType();if(this.isInCurrentRuleReSyncSet(o)){s.resyncedTokens=this.reSyncTo(o);if(this.outputCst){const l=this.CST_STACK[this.CST_STACK.length-1];l.recoveredNode=true;return l}else{return r(e)}}else{if(this.outputCst){const l=this.CST_STACK[this.CST_STACK.length-1];l.recoveredNode=true;s.partialCstResult=l}throw s}}else if(i){this.moveToTerminatedState();return r(e)}else{throw s}}else{throw e}}optionInternal(e,n){const r=this.getKeyForAutomaticLookahead(WR,n);return this.optionInternalLogic(e,n,r)}optionInternalLogic(e,n,r){let i=this.getLaFuncFromCache(r);let a;if(typeof e!=="function"){a=e.DEF;const s=e.GATE;if(s!==void 0){const o=i;i=()=>{return s.call(this)&&o.call(this)}}}else{a=e}if(i.call(this)===true){return a.call(this)}return void 0}atLeastOneInternal(e,n){const r=this.getKeyForAutomaticLookahead(zd,e);return this.atLeastOneInternalLogic(e,n,r)}atLeastOneInternalLogic(e,n,r){let i=this.getLaFuncFromCache(r);let a;if(typeof n!=="function"){a=n.DEF;const s=n.GATE;if(s!==void 0){const o=i;i=()=>{return s.call(this)&&o.call(this)}}}else{a=n}if(i.call(this)===true){let s=this.doSingleRepetition(a);while(i.call(this)===true&&s===true){s=this.doSingleRepetition(a)}}else{throw this.raiseEarlyExitException(e,ke.REPETITION_MANDATORY,n.ERR_MSG)}this.attemptInRepetitionRecovery(this.atLeastOneInternal,[e,n],i,zd,e,zk)}atLeastOneSepFirstInternal(e,n){const r=this.getKeyForAutomaticLookahead(zl,e);this.atLeastOneSepFirstInternalLogic(e,n,r)}atLeastOneSepFirstInternalLogic(e,n,r){const i=n.DEF;const a=n.SEP;const s=this.getLaFuncFromCache(r);if(s.call(this)===true){i.call(this);const o=()=>{return this.tokenMatcher(this.LA(1),a)};while(this.tokenMatcher(this.LA(1),a)===true){this.CONSUME(a);i.call(this)}this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal,[e,a,o,i,Ym],o,zl,e,Ym)}else{throw this.raiseEarlyExitException(e,ke.REPETITION_MANDATORY_WITH_SEPARATOR,n.ERR_MSG)}}manyInternal(e,n){const r=this.getKeyForAutomaticLookahead(Vd,e);return this.manyInternalLogic(e,n,r)}manyInternalLogic(e,n,r){let i=this.getLaFuncFromCache(r);let a;if(typeof n!=="function"){a=n.DEF;const o=n.GATE;if(o!==void 0){const l=i;i=()=>{return o.call(this)&&l.call(this)}}}else{a=n}let s=true;while(i.call(this)===true&&s===true){s=this.doSingleRepetition(a)}this.attemptInRepetitionRecovery(this.manyInternal,[e,n],i,Vd,e,Vk,s)}manySepFirstInternal(e,n){const r=this.getKeyForAutomaticLookahead(Xd,e);this.manySepFirstInternalLogic(e,n,r)}manySepFirstInternalLogic(e,n,r){const i=n.DEF;const a=n.SEP;const s=this.getLaFuncFromCache(r);if(s.call(this)===true){i.call(this);const o=()=>{return this.tokenMatcher(this.LA(1),a)};while(this.tokenMatcher(this.LA(1),a)===true){this.CONSUME(a);i.call(this)}this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal,[e,a,o,i,Xm],o,Xd,e,Xm)}}repetitionSepSecondInternal(e,n,r,i,a){while(r()){this.CONSUME(n);i.call(this)}this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal,[e,n,r,i,a],r,zl,e,a)}doSingleRepetition(e){const n=this.getLexerPosition();e.call(this);const r=this.getLexerPosition();return r>n}orInternal(e,n){const r=this.getKeyForAutomaticLookahead(BR,n);const i=le(e)?e:e.DEF;const a=this.getLaFuncFromCache(r);const s=a.call(this,i);if(s!==void 0){const o=i[s];return o.ALT.call(this)}this.raiseNoAltException(n,e.ERR_MSG)}ruleFinallyStateUpdate(){this.RULE_STACK.pop();this.RULE_OCCURRENCE_STACK.pop();this.cstFinallyStateUpdate();if(this.RULE_STACK.length===0&&this.isAtEndOfInput()===false){const e=this.LA(1);const n=this.errorMessageProvider.buildNotAllInputParsedMessage({firstRedundant:e,ruleName:this.getCurrRuleFullName()});this.SAVE_ERROR(new Tb(n,e))}}subruleInternal(e,n,r){let i;try{const a=r!==void 0?r.ARGS:void 0;this.subruleIdx=n;i=e.apply(this,a);this.cstPostNonTerminal(i,r!==void 0&&r.LABEL!==void 0?r.LABEL:e.ruleName);return i}catch(a){throw this.subruleInternalError(a,r,e.ruleName)}}subruleInternalError(e,n,r){if(gu(e)&&e.partialCstResult!==void 0){this.cstPostNonTerminal(e.partialCstResult,n!==void 0&&n.LABEL!==void 0?n.LABEL:r);delete e.partialCstResult}throw e}consumeInternal(e,n,r){let i;try{const a=this.LA(1);if(this.tokenMatcher(a,e)===true){this.consumeToken();i=a}else{this.consumeInternalError(e,a,r)}}catch(a){i=this.consumeInternalRecovery(e,n,a)}this.cstPostTerminal(r!==void 0&&r.LABEL!==void 0?r.LABEL:e.name,i);return i}consumeInternalError(e,n,r){let i;const a=this.LA(0);if(r!==void 0&&r.ERR_MSG){i=r.ERR_MSG}else{i=this.errorMessageProvider.buildMismatchTokenMessage({expected:e,actual:n,previous:a,ruleName:this.getCurrRuleFullName()})}throw this.SAVE_ERROR(new qR(i,n,a))}consumeInternalRecovery(e,n,r){if(this.recoveryEnabled&&r.name==="MismatchedTokenException"&&!this.isBackTracking()){const i=this.getFollowsForInRuleRecovery(e,n);try{return this.tryInRuleRecovery(e,i)}catch(a){if(a.name===jR){throw r}else{throw a}}}else{throw r}}saveRecogState(){const e=this.errors;const n=at(this.RULE_STACK);return{errors:e,lexerState:this.exportLexerState(),RULE_STACK:n,CST_STACK:this.CST_STACK}}reloadRecogState(e){this.errors=e.errors;this.importLexerState(e.lexerState);this.RULE_STACK=e.RULE_STACK}ruleInvocationStateUpdate(e,n,r){this.RULE_OCCURRENCE_STACK.push(r);this.RULE_STACK.push(e);this.cstInvocationStateUpdate(n)}isBackTracking(){return this.isBackTrackingStack.length!==0}getCurrRuleFullName(){const e=this.getLastExplicitRuleShortName();return this.shortRuleNameToFull[e]}shortRuleNameToFullName(e){return this.shortRuleNameToFull[e]}isAtEndOfInput(){return this.tokenMatcher(this.LA(1),Zn)}reset(){this.resetLexerState();this.subruleIdx=0;this.isBackTrackingStack=[];this.errors=[];this.RULE_STACK=[];this.CST_STACK=[];this.RULE_OCCURRENCE_STACK=[]}}class Hb{initErrorHandler(e){this._errors=[];this.errorMessageProvider=Q(e,"errorMessageProvider")?e.errorMessageProvider:Un.errorMessageProvider}SAVE_ERROR(e){if(gu(e)){e.context={ruleStack:this.getHumanReadableRuleStack(),ruleOccurrenceStack:at(this.RULE_OCCURRENCE_STACK)};this._errors.push(e);return e}else{throw Error("Trying to save an Error which is not a RecognitionException")}}get errors(){return at(this._errors)}set errors(e){this._errors=e}raiseEarlyExitException(e,n,r){const i=this.getCurrRuleFullName();const a=this.getGAstProductions()[i];const s=sc(e,a,n,this.maxLookahead);const o=s[0];const l=[];for(let c=1;c<=this.maxLookahead;c++){l.push(this.LA(c))}const u=this.errorMessageProvider.buildEarlyExitMessage({expectedIterationPaths:o,actual:l,previous:this.LA(0),customUserDescription:r,ruleName:i});throw this.SAVE_ERROR(new Eb(u,this.LA(1),this.LA(0)))}raiseNoAltException(e,n){const r=this.getCurrRuleFullName();const i=this.getGAstProductions()[r];const a=ac(e,i,this.maxLookahead);const s=[];for(let u=1;u<=this.maxLookahead;u++){s.push(this.LA(u))}const o=this.LA(0);const l=this.errorMessageProvider.buildNoViableAltMessage({expectedPathsPerAlt:a,actual:s,previous:o,customUserDescription:n,ruleName:this.getCurrRuleFullName()});throw this.SAVE_ERROR(new $b(l,this.LA(1),o))}}class qb{initContentAssist(){}computeContentAssist(e,n){const r=this.gastProductionsCache[e];if(Kn(r)){throw Error(`Rule ->${e}<- does not exist in this grammar.`)}return DR([r],n,this.tokenMatcher,this.maxLookahead)}getNextPossibleTokenTypes(e){const n=Zt(e.ruleStack);const r=this.getGAstProductions();const i=r[n];const a=new Wk(i,e).startWalking();return a}}const lc={description:"This Object indicates the Parser is during Recording Phase"};Object.freeze(lc);const th=true;const nh=Math.pow(2,ir)-1;const zR=rr({name:"RECORDING_PHASE_TOKEN",pattern:ot.NA});us([zR]);const XR=Dp(zR,"This IToken indicates the Parser is in Recording Phase\n	See: https://chevrotain.io/docs/guide/internals.html#grammar-recording for details",-1,-1,-1,-1,-1,-1);Object.freeze(XR);const jb={name:"This CSTNode indicates the Parser is in Recording Phase\n	See: https://chevrotain.io/docs/guide/internals.html#grammar-recording for details",children:{}};class Bb{initGastRecorder(e){this.recordingProdStack=[];this.RECORDING_PHASE=false}enableRecording(){this.RECORDING_PHASE=true;this.TRACE_INIT("Enable Recording",()=>{for(let e=0;e<10;e++){const n=e>0?e:"";this[`CONSUME${n}`]=function(r,i){return this.consumeInternalRecord(r,e,i)};this[`SUBRULE${n}`]=function(r,i){return this.subruleInternalRecord(r,e,i)};this[`OPTION${n}`]=function(r){return this.optionInternalRecord(r,e)};this[`OR${n}`]=function(r){return this.orInternalRecord(r,e)};this[`MANY${n}`]=function(r){this.manyInternalRecord(e,r)};this[`MANY_SEP${n}`]=function(r){this.manySepFirstInternalRecord(e,r)};this[`AT_LEAST_ONE${n}`]=function(r){this.atLeastOneInternalRecord(e,r)};this[`AT_LEAST_ONE_SEP${n}`]=function(r){this.atLeastOneSepFirstInternalRecord(e,r)}}this[`consume`]=function(e,n,r){return this.consumeInternalRecord(n,e,r)};this[`subrule`]=function(e,n,r){return this.subruleInternalRecord(n,e,r)};this[`option`]=function(e,n){return this.optionInternalRecord(n,e)};this[`or`]=function(e,n){return this.orInternalRecord(n,e)};this[`many`]=function(e,n){this.manyInternalRecord(e,n)};this[`atLeastOne`]=function(e,n){this.atLeastOneInternalRecord(e,n)};this.ACTION=this.ACTION_RECORD;this.BACKTRACK=this.BACKTRACK_RECORD;this.LA=this.LA_RECORD})}disableRecording(){this.RECORDING_PHASE=false;this.TRACE_INIT("Deleting Recording methods",()=>{const e=this;for(let n=0;n<10;n++){const r=n>0?n:"";delete e[`CONSUME${r}`];delete e[`SUBRULE${r}`];delete e[`OPTION${r}`];delete e[`OR${r}`];delete e[`MANY${r}`];delete e[`MANY_SEP${r}`];delete e[`AT_LEAST_ONE${r}`];delete e[`AT_LEAST_ONE_SEP${r}`]}delete e[`consume`];delete e[`subrule`];delete e[`option`];delete e[`or`];delete e[`many`];delete e[`atLeastOne`];delete e.ACTION;delete e.BACKTRACK;delete e.LA})}ACTION_RECORD(e){}BACKTRACK_RECORD(e,n){return()=>true}LA_RECORD(e){return vu}topLevelRuleRecord(e,n){try{const r=new ei({definition:[],name:e});r.name=e;this.recordingProdStack.push(r);n.call(this);this.recordingProdStack.pop();return r}catch(r){if(r.KNOWN_RECORDER_ERROR!==true){try{r.message=r.message+'\n	 This error was thrown during the "grammar recording phase" For more info see:\n	https://chevrotain.io/docs/guide/internals.html#grammar-recording'}catch(i){throw r}}throw r}}optionInternalRecord(e,n){return li.call(this,it,e,n)}atLeastOneInternalRecord(e,n){li.call(this,Ft,n,e)}atLeastOneSepFirstInternalRecord(e,n){li.call(this,Kt,n,e,th)}manyInternalRecord(e,n){li.call(this,De,n,e)}manySepFirstInternalRecord(e,n){li.call(this,St,n,e,th)}orInternalRecord(e,n){return Wb.call(this,e,n)}subruleInternalRecord(e,n,r){Ru(n);if(!e||Q(e,"ruleName")===false){const o=new Error(`<SUBRULE${rh(n)}> argument is invalid expecting a Parser method reference but got: <${JSON.stringify(e)}>
 inside top level rule: <${this.recordingProdStack[0].name}>`);o.KNOWN_RECORDER_ERROR=true;throw o}const i=Br(this.recordingProdStack);const a=e.ruleName;const s=new Rt({idx:n,nonTerminalName:a,label:r===null||r===void 0?void 0:r.LABEL,referencedRule:void 0});i.definition.push(s);return this.outputCst?jb:lc}consumeInternalRecord(e,n,r){Ru(n);if(!NR(e)){const s=new Error(`<CONSUME${rh(n)}> argument is invalid expecting a TokenType reference but got: <${JSON.stringify(e)}>
 inside top level rule: <${this.recordingProdStack[0].name}>`);s.KNOWN_RECORDER_ERROR=true;throw s}const i=Br(this.recordingProdStack);const a=new Ee({idx:n,terminalType:e,label:r===null||r===void 0?void 0:r.LABEL});i.definition.push(a);return XR}}function li(t,e,n,r=false){Ru(n);const i=Br(this.recordingProdStack);const a=Hn(e)?e:e.DEF;const s=new t({definition:[],idx:n});if(r){s.separator=e.SEP}if(Q(e,"MAX_LOOKAHEAD")){s.maxLookahead=e.MAX_LOOKAHEAD}this.recordingProdStack.push(s);a.call(this);i.definition.push(s);this.recordingProdStack.pop();return lc}function Wb(t,e){Ru(e);const n=Br(this.recordingProdStack);const r=le(t)===false;const i=r===false?t:t.DEF;const a=new At({definition:[],idx:e,ignoreAmbiguities:r&&t.IGNORE_AMBIGUITIES===true});if(Q(t,"MAX_LOOKAHEAD")){a.maxLookahead=t.MAX_LOOKAHEAD}const s=yR(i,o=>Hn(o.GATE));a.hasPredicates=s;n.definition.push(a);X(i,o=>{const l=new Ct({definition:[]});a.definition.push(l);if(Q(o,"IGNORE_AMBIGUITIES")){l.ignoreAmbiguities=o.IGNORE_AMBIGUITIES}else if(Q(o,"GATE")){l.ignoreAmbiguities=true}this.recordingProdStack.push(l);o.ALT.call(this);this.recordingProdStack.pop()});return lc}function rh(t){return t===0?"":`${t}`}function Ru(t){if(t<0||t>nh){const e=new Error(`Invalid DSL Method idx value: <${t}>
	Idx value must be a none negative value smaller than ${nh+1}`);e.KNOWN_RECORDER_ERROR=true;throw e}}class Vb{initPerformanceTracer(e){if(Q(e,"traceInitPerf")){const n=e.traceInitPerf;const r=typeof n==="number";this.traceInitMaxIdent=r?n:Infinity;this.traceInitPerf=r?n>0:n}else{this.traceInitMaxIdent=0;this.traceInitPerf=Un.traceInitPerf}this.traceInitIndent=-1}TRACE_INIT(e,n){if(this.traceInitPerf===true){this.traceInitIndent++;const r=new Array(this.traceInitIndent+1).join("	");if(this.traceInitIndent<this.traceInitMaxIdent){console.log(`${r}--> <${e}>`)}const{time:i,value:a}=vR(n);const s=i>10?console.warn:console.log;if(this.traceInitIndent<this.traceInitMaxIdent){s(`${r}<-- <${e}> time: ${i}ms`)}this.traceInitIndent--;return a}else{return n()}}}function zb(t,e){e.forEach(n=>{const r=n.prototype;Object.getOwnPropertyNames(r).forEach(i=>{if(i==="constructor"){return}const a=Object.getOwnPropertyDescriptor(r,i);if(a&&(a.get||a.set)){Object.defineProperty(t.prototype,i,a)}else{t.prototype[i]=n.prototype[i]}})})}const vu=Dp(Zn,"",NaN,NaN,NaN,NaN,NaN,NaN);Object.freeze(vu);const Un=Object.freeze({recoveryEnabled:false,maxLookahead:3,dynamicTokensEnabled:false,outputCst:true,errorMessageProvider:Ur,nodeLocationTracking:"none",traceInitPerf:false,skipValidations:false});const $u=Object.freeze({recoveryValueFunc:()=>void 0,resyncEnabled:true});var vt;(function(t){t[t["INVALID_RULE_NAME"]=0]="INVALID_RULE_NAME";t[t["DUPLICATE_RULE_NAME"]=1]="DUPLICATE_RULE_NAME";t[t["INVALID_RULE_OVERRIDE"]=2]="INVALID_RULE_OVERRIDE";t[t["DUPLICATE_PRODUCTIONS"]=3]="DUPLICATE_PRODUCTIONS";t[t["UNRESOLVED_SUBRULE_REF"]=4]="UNRESOLVED_SUBRULE_REF";t[t["LEFT_RECURSION"]=5]="LEFT_RECURSION";t[t["NONE_LAST_EMPTY_ALT"]=6]="NONE_LAST_EMPTY_ALT";t[t["AMBIGUOUS_ALTS"]=7]="AMBIGUOUS_ALTS";t[t["CONFLICT_TOKENS_RULES_NAMESPACE"]=8]="CONFLICT_TOKENS_RULES_NAMESPACE";t[t["INVALID_TOKEN_NAME"]=9]="INVALID_TOKEN_NAME";t[t["NO_NON_EMPTY_LOOKAHEAD"]=10]="NO_NON_EMPTY_LOOKAHEAD";t[t["AMBIGUOUS_PREFIX_ALTS"]=11]="AMBIGUOUS_PREFIX_ALTS";t[t["TOO_MANY_ALTS"]=12]="TOO_MANY_ALTS";t[t["CUSTOM_LOOKAHEAD_VALIDATION"]=13]="CUSTOM_LOOKAHEAD_VALIDATION"})(vt||(vt={}));function ih(t=void 0){return function(){return t}}let xp=class YR{static performSelfAnalysis(e){throw Error("The **static** `performSelfAnalysis` method has been deprecated.	\nUse the **instance** method with the same name instead.")}performSelfAnalysis(){this.TRACE_INIT("performSelfAnalysis",()=>{let e;this.selfAnalysisDone=true;const n=this.className;this.TRACE_INIT("toFastProps",()=>{$R(this)});this.TRACE_INIT("Grammar Recording",()=>{try{this.enableRecording();X(this.definedRulesNames,i=>{const a=this[i];const s=a["originalGrammarAction"];let o;this.TRACE_INIT(`${i} Rule`,()=>{o=this.topLevelRuleRecord(i,s)});this.gastProductionsCache[i]=o})}finally{this.disableRecording()}});let r=[];this.TRACE_INIT("Grammar Resolving",()=>{r=Rb({rules:Ve(this.gastProductionsCache)});this.definitionErrors=this.definitionErrors.concat(r)});this.TRACE_INIT("Grammar Validations",()=>{if(ge(r)&&this.skipValidations===false){const i=vb({rules:Ve(this.gastProductionsCache),tokenTypes:Ve(this.tokensMap),errMsgProvider:Rr,grammarName:n});const a=rb({lookaheadStrategy:this.lookaheadStrategy,rules:Ve(this.gastProductionsCache),tokenTypes:Ve(this.tokensMap),grammarName:n});this.definitionErrors=this.definitionErrors.concat(i,a)}});if(ge(this.definitionErrors)){if(this.recoveryEnabled){this.TRACE_INIT("computeAllProdsFollows",()=>{const i=nk(Ve(this.gastProductionsCache));this.resyncFollows=i})}this.TRACE_INIT("ComputeLookaheadFunctions",()=>{var i,a;(a=(i=this.lookaheadStrategy).initialize)===null||a===void 0?void 0:a.call(i,{rules:Ve(this.gastProductionsCache)});this.preComputeLookaheadFunctions(Ve(this.gastProductionsCache))})}if(!YR.DEFER_DEFINITION_ERRORS_HANDLING&&!ge(this.definitionErrors)){e=H(this.definitionErrors,i=>i.message);throw new Error(`Parser Definition Errors detected:
 ${e.join("\n-------------------------------\n")}`)}})}constructor(e,n){this.definitionErrors=[];this.selfAnalysisDone=false;const r=this;r.initErrorHandler(n);r.initLexerAdapter();r.initLooksAhead(n);r.initRecognizerEngine(e,n);r.initRecoverable(n);r.initTreeBuilder(n);r.initContentAssist();r.initGastRecorder(n);r.initPerformanceTracer(n);if(Q(n,"ignoredIssues")){throw new Error("The <ignoredIssues> IParserConfig property has been deprecated.\n	Please use the <IGNORE_AMBIGUITIES> flag on the relevant DSL method instead.\n	See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#IGNORING_AMBIGUITIES\n	For further details.")}this.skipValidations=Q(n,"skipValidations")?n.skipValidations:Un.skipValidations}};xp.DEFER_DEFINITION_ERRORS_HANDLING=false;zb(xp,[Cb,kb,Fb,Kb,Gb,Ub,Hb,qb,Bb,Vb]);class JR extends xp{constructor(e,n=Un){const r=at(n);r.outputCst=false;super(e,r)}}function Vr(t,e,n){return`${t.name}_${e}_${n}`}const er=1;const Xb=2;const QR=4;const ZR=5;const cs=7;const Yb=8;const Jb=9;const Qb=10;const Zb=11;const ev=12;class Mp{constructor(e){this.target=e}isEpsilon(){return false}}class Fp extends Mp{constructor(e,n){super(e);this.tokenType=n}}class tv extends Mp{constructor(e){super(e)}isEpsilon(){return true}}class Kp extends Mp{constructor(e,n,r){super(e);this.rule=n;this.followState=r}isEpsilon(){return true}}function eN(t){const e={decisionMap:{},decisionStates:[],ruleToStartState:new Map,ruleToStopState:new Map,states:[]};tN(e,t);const n=t.length;for(let r=0;r<n;r++){const i=t[r];const a=Or(e,i,i);if(a===void 0){continue}fN(e,i,a)}return e}function tN(t,e){const n=e.length;for(let r=0;r<n;r++){const i=e[r];const a=Xe(t,i,void 0,{type:Xb});const s=Xe(t,i,void 0,{type:cs});a.stop=s;t.ruleToStartState.set(i,a);t.ruleToStopState.set(i,s)}}function nv(t,e,n){if(n instanceof Ee){return Up(t,e,n.terminalType,n)}else if(n instanceof Rt){return dN(t,e,n)}else if(n instanceof At){return sN(t,e,n)}else if(n instanceof it){return oN(t,e,n)}else if(n instanceof De){return nN(t,e,n)}else if(n instanceof St){return rN(t,e,n)}else if(n instanceof Ft){return iN(t,e,n)}else if(n instanceof Kt){return aN(t,e,n)}else{return Or(t,e,n)}}function nN(t,e,n){const r=Xe(t,e,n,{type:ZR});ar(t,r);const i=ni(t,e,r,n,Or(t,e,n));return iv(t,e,n,i)}function rN(t,e,n){const r=Xe(t,e,n,{type:ZR});ar(t,r);const i=ni(t,e,r,n,Or(t,e,n));const a=Up(t,e,n.separator,n);return iv(t,e,n,i,a)}function iN(t,e,n){const r=Xe(t,e,n,{type:QR});ar(t,r);const i=ni(t,e,r,n,Or(t,e,n));return rv(t,e,n,i)}function aN(t,e,n){const r=Xe(t,e,n,{type:QR});ar(t,r);const i=ni(t,e,r,n,Or(t,e,n));const a=Up(t,e,n.separator,n);return rv(t,e,n,i,a)}function sN(t,e,n){const r=Xe(t,e,n,{type:er});ar(t,r);const i=H(n.definition,s=>nv(t,e,s));const a=ni(t,e,r,n,...i);return a}function oN(t,e,n){const r=Xe(t,e,n,{type:er});ar(t,r);const i=ni(t,e,r,n,Or(t,e,n));return lN(t,e,n,i)}function Or(t,e,n){const r=Mt(H(n.definition,i=>nv(t,e,i)),i=>i!==void 0);if(r.length===1){return r[0]}else if(r.length===0){return void 0}else{return cN(t,r)}}function rv(t,e,n,r,i){const a=r.left;const s=r.right;const o=Xe(t,e,n,{type:Zb});ar(t,o);const l=Xe(t,e,n,{type:ev});a.loopback=o;l.loopback=o;t.decisionMap[Vr(e,i?"RepetitionMandatoryWithSeparator":"RepetitionMandatory",n.idx)]=o;qe(s,o);if(i===void 0){qe(o,a);qe(o,l)}else{qe(o,l);qe(o,i.left);qe(i.right,a)}return{left:a,right:l}}function iv(t,e,n,r,i){const a=r.left;const s=r.right;const o=Xe(t,e,n,{type:Qb});ar(t,o);const l=Xe(t,e,n,{type:ev});const u=Xe(t,e,n,{type:Jb});o.loopback=u;l.loopback=u;qe(o,a);qe(o,l);qe(s,u);if(i!==void 0){qe(u,l);qe(u,i.left);qe(i.right,a)}else{qe(u,o)}t.decisionMap[Vr(e,i?"RepetitionWithSeparator":"Repetition",n.idx)]=o;return{left:o,right:l}}function lN(t,e,n,r){const i=r.left;const a=r.right;qe(i,a);t.decisionMap[Vr(e,"Option",n.idx)]=i;return r}function ar(t,e){t.decisionStates.push(e);e.decision=t.decisionStates.length-1;return e.decision}function ni(t,e,n,r,...i){const a=Xe(t,e,r,{type:Yb,start:n});n.end=a;for(const o of i){if(o!==void 0){qe(n,o.left);qe(o.right,a)}else{qe(n,a)}}const s={left:n,right:a};t.decisionMap[Vr(e,uN(r),r.idx)]=n;return s}function uN(t){if(t instanceof At){return"Alternation"}else if(t instanceof it){return"Option"}else if(t instanceof De){return"Repetition"}else if(t instanceof St){return"RepetitionWithSeparator"}else if(t instanceof Ft){return"RepetitionMandatory"}else if(t instanceof Kt){return"RepetitionMandatoryWithSeparator"}else{throw new Error("Invalid production type encountered")}}function cN(t,e){const n=e.length;for(let a=0;a<n-1;a++){const s=e[a];let o;if(s.left.transitions.length===1){o=s.left.transitions[0]}const l=o instanceof Kp;const u=o;const c=e[a+1].left;if(s.left.type===er&&s.right.type===er&&o!==void 0&&(l&&u.followState===s.right||o.target===s.right)){if(l){u.followState=c}else{o.target=c}pN(t,s.right)}else{qe(s.right,c)}}const r=e[0];const i=e[n-1];return{left:r.left,right:i.right}}function Up(t,e,n,r){const i=Xe(t,e,r,{type:er});const a=Xe(t,e,r,{type:er});Gp(i,new Fp(a,n));return{left:i,right:a}}function dN(t,e,n){const r=n.referencedRule;const i=t.ruleToStartState.get(r);const a=Xe(t,e,n,{type:er});const s=Xe(t,e,n,{type:er});const o=new Kp(i,r,s);Gp(a,o);return{left:a,right:s}}function fN(t,e,n){const r=t.ruleToStartState.get(e);qe(r,n.left);const i=t.ruleToStopState.get(e);qe(n.right,i);const a={left:r,right:i};return a}function qe(t,e){const n=new tv(e);Gp(t,n)}function Xe(t,e,n,r){const i=Object.assign({atn:t,production:n,epsilonOnlyTransitions:false,rule:e,transitions:[],nextTokenWithinRule:[],stateNumber:t.states.length},r);t.states.push(i);return i}function Gp(t,e){if(t.transitions.length===0){t.epsilonOnlyTransitions=e.isEpsilon()}t.transitions.push(e)}function pN(t,e){t.states.splice(t.states.indexOf(e),1)}const Tu={};class Jd{constructor(){this.map={};this.configs=[]}get size(){return this.configs.length}finalize(){this.map={}}add(e){const n=av(e);if(!(n in this.map)){this.map[n]=this.configs.length;this.configs.push(e)}}get elements(){return this.configs}get alts(){return H(this.configs,e=>e.alt)}get key(){let e="";for(const n in this.map){e+=n+":"}return e}}function av(t,e=true){return`${e?`a${t.alt}`:""}s${t.state.stateNumber}:${t.stack.map(n=>n.stateNumber.toString()).join("_")}`}function mN(t,e){const n={};return r=>{const i=r.toString();let a=n[i];if(a!==void 0){return a}else{a={atnStartState:t,decision:e,states:{}};n[i]=a;return a}}}class sv{constructor(){this.predicates=[]}is(e){return e>=this.predicates.length||this.predicates[e]}set(e,n){this.predicates[e]=n}toString(){let e="";const n=this.predicates.length;for(let r=0;r<n;r++){e+=this.predicates[r]===true?"1":"0"}return e}}const ah=new sv;class hN extends Lp{constructor(e){var n;super();this.logging=(n=e===null||e===void 0?void 0:e.logging)!==null&&n!==void 0?n:r=>console.log(r)}initialize(e){this.atn=eN(e.rules);this.dfas=yN(this.atn)}validateAmbiguousAlternationAlternatives(){return[]}validateEmptyOrAlternatives(){return[]}buildLookaheadForAlternation(e){const{prodOccurrence:n,rule:r,hasPredicates:i,dynamicTokensEnabled:a}=e;const s=this.dfas;const o=this.logging;const l=Vr(r,"Alternation",n);const u=this.atn.decisionMap[l];const c=u.decision;const d=H(Jm({maxLookahead:1,occurrence:n,prodType:"Alternation",rule:r}),f=>H(f,p=>p[0]));if(sh(d,false)&&!a){const f=gt(d,(p,y,v)=>{X(y,k=>{if(k){p[k.tokenTypeIdx]=v;X(k.categoryMatches,$=>{p[$]=v})}});return p},{});if(i){return function(p){var y;const v=this.LA(1);const k=f[v.tokenTypeIdx];if(p!==void 0&&k!==void 0){const $=(y=p[k])===null||y===void 0?void 0:y.GATE;if($!==void 0&&$.call(this)===false){return void 0}}return k}}else{return function(){const p=this.LA(1);return f[p.tokenTypeIdx]}}}else if(i){return function(f){const p=new sv;const y=f===void 0?0:f.length;for(let k=0;k<y;k++){const $=f===null||f===void 0?void 0:f[k].GATE;p.set(k,$===void 0||$.call(this))}const v=Cc.call(this,s,c,p,o);return typeof v==="number"?v:void 0}}else{return function(){const f=Cc.call(this,s,c,ah,o);return typeof f==="number"?f:void 0}}}buildLookaheadForOptional(e){const{prodOccurrence:n,rule:r,prodType:i,dynamicTokensEnabled:a}=e;const s=this.dfas;const o=this.logging;const l=Vr(r,i,n);const u=this.atn.decisionMap[l];const c=u.decision;const d=H(Jm({maxLookahead:1,occurrence:n,prodType:i,rule:r}),f=>{return H(f,p=>p[0])});if(sh(d)&&d[0][0]&&!a){const f=d[0];const p=jt(f);if(p.length===1&&ge(p[0].categoryMatches)){const y=p[0];const v=y.tokenTypeIdx;return function(){return this.LA(1).tokenTypeIdx===v}}else{const y=gt(p,(v,k)=>{if(k!==void 0){v[k.tokenTypeIdx]=true;X(k.categoryMatches,$=>{v[$]=true})}return v},{});return function(){const v=this.LA(1);return y[v.tokenTypeIdx]===true}}}return function(){const f=Cc.call(this,s,c,ah,o);return typeof f==="object"?false:f===0}}}function sh(t,e=true){const n=new Set;for(const r of t){const i=new Set;for(const a of r){if(a===void 0){if(e){break}else{return false}}const s=[a.tokenTypeIdx].concat(a.categoryMatches);for(const o of s){if(n.has(o)){if(!i.has(o)){return false}}else{n.add(o);i.add(o)}}}}return true}function yN(t){const e=t.decisionStates.length;const n=Array(e);for(let r=0;r<e;r++){n[r]=mN(t.decisionStates[r],r)}return n}function Cc(t,e,n,r){const i=t[e](n);let a=i.start;if(a===void 0){const o=kN(i.atnStartState);a=lv(i,ov(o));i.start=a}const s=gN.apply(this,[i,a,n,r]);return s}function gN(t,e,n,r){let i=e;let a=1;const s=[];let o=this.LA(a++);while(true){let l=wN(i,o);if(l===void 0){l=RN.apply(this,[t,i,o,a,n,r])}if(l===Tu){return EN(s,i,o)}if(l.isAcceptState===true){return l.prediction}i=l;s.push(o);o=this.LA(a++)}}function RN(t,e,n,r,i,a){const s=CN(e.configs,n,i);if(s.size===0){oh(t,e,n,Tu);return Tu}let o=ov(s);const l=AN(s,i);if(l!==void 0){o.isAcceptState=true;o.prediction=l;o.configs.uniqueAlt=l}else if(_N(s)){const u=xA(s.alts);o.isAcceptState=true;o.prediction=u;o.configs.uniqueAlt=u;vN.apply(this,[t,r,s.alts,a])}o=oh(t,e,n,o);return o}function vN(t,e,n,r){const i=[];for(let u=1;u<=e;u++){i.push(this.LA(u).tokenType)}const a=t.atnStartState;const s=a.rule;const o=a.production;const l=$N({topLevelRule:s,ambiguityIndices:n,production:o,prefixPath:i});r(l)}function $N(t){const e=H(t.prefixPath,i=>Hr(i)).join(", ");const n=t.production.idx===0?"":t.production.idx;let r=`Ambiguous Alternatives Detected: <${t.ambiguityIndices.join(", ")}> in <${TN(t.production)}${n}> inside <${t.topLevelRule.name}> Rule,
<${e}> may appears as a prefix path in all these alternatives.
`;r=r+`See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#AMBIGUOUS_ALTERNATIVES
For Further details.`;return r}function TN(t){if(t instanceof Rt){return"SUBRULE"}else if(t instanceof it){return"OPTION"}else if(t instanceof At){return"OR"}else if(t instanceof Ft){return"AT_LEAST_ONE"}else if(t instanceof Kt){return"AT_LEAST_ONE_SEP"}else if(t instanceof St){return"MANY_SEP"}else if(t instanceof De){return"MANY"}else if(t instanceof Ee){return"CONSUME"}else{throw Error("non exhaustive match")}}function EN(t,e,n){const r=Lt(e.configs.elements,a=>a.state.transitions);const i=WA(r.filter(a=>a instanceof Fp).map(a=>a.tokenType),a=>a.tokenTypeIdx);return{actualToken:n,possibleTokenTypes:i,tokenPath:t}}function wN(t,e){return t.edges[e.tokenTypeIdx]}function CN(t,e,n){const r=new Jd;const i=[];for(const s of t.elements){if(n.is(s.alt)===false){continue}if(s.state.type===cs){i.push(s);continue}const o=s.state.transitions.length;for(let l=0;l<o;l++){const u=s.state.transitions[l];const c=SN(u,e);if(c!==void 0){r.add({state:c,alt:s.alt,stack:s.stack})}}}let a;if(i.length===0&&r.size===1){a=r}if(a===void 0){a=new Jd;for(const s of r.elements){Eu(s,a)}}if(i.length>0&&!NN(a)){for(const s of i){a.add(s)}}return a}function SN(t,e){if(t instanceof Fp&&_R(e,t.tokenType)){return t.target}return void 0}function AN(t,e){let n;for(const r of t.elements){if(e.is(r.alt)===true){if(n===void 0){n=r.alt}else if(n!==r.alt){return void 0}}}return n}function ov(t){return{configs:t,edges:{},isAcceptState:false,prediction:-1}}function oh(t,e,n,r){r=lv(t,r);e.edges[n.tokenTypeIdx]=r;return r}function lv(t,e){if(e===Tu){return e}const n=e.configs.key;const r=t.states[n];if(r!==void 0){return r}e.configs.finalize();t.states[n]=e;return e}function kN(t){const e=new Jd;const n=t.transitions.length;for(let r=0;r<n;r++){const i=t.transitions[r].target;const a={state:i,alt:r,stack:[]};Eu(a,e)}return e}function Eu(t,e){const n=t.state;if(n.type===cs){if(t.stack.length>0){const i=[...t.stack];const a=i.pop();const s={state:a,alt:t.alt,stack:i};Eu(s,e)}else{e.add(t)}return}if(!n.epsilonOnlyTransitions){e.add(t)}const r=n.transitions.length;for(let i=0;i<r;i++){const a=n.transitions[i];const s=bN(t,a);if(s!==void 0){Eu(s,e)}}}function bN(t,e){if(e instanceof tv){return{state:e.target,alt:t.alt,stack:t.stack}}else if(e instanceof Kp){const n=[...t.stack,e.followState];return{state:e.target,alt:t.alt,stack:n}}return void 0}function NN(t){for(const e of t.elements){if(e.state.type===cs){return true}}return false}function PN(t){for(const e of t.elements){if(e.state.type!==cs){return false}}return true}function _N(t){if(PN(t)){return true}const e=DN(t.elements);const n=ON(e)&&!IN(e);return n}function DN(t){const e=new Map;for(const n of t){const r=av(n,false);let i=e.get(r);if(i===void 0){i={};e.set(r,i)}i[n.alt]=true}return e}function ON(t){for(const e of Array.from(t.values())){if(Object.keys(e).length>1){return true}}return false}function IN(t){for(const e of Array.from(t.values())){if(Object.keys(e).length===1){return true}}return false}var Qd;(function(t){function e(n){return typeof n==="string"}t.is=e})(Qd||(Qd={}));var wu;(function(t){function e(n){return typeof n==="string"}t.is=e})(wu||(wu={}));var Zd;(function(t){t.MIN_VALUE=-2147483648;t.MAX_VALUE=2147483647;function e(n){return typeof n==="number"&&t.MIN_VALUE<=n&&n<=t.MAX_VALUE}t.is=e})(Zd||(Zd={}));var Ha;(function(t){t.MIN_VALUE=0;t.MAX_VALUE=2147483647;function e(n){return typeof n==="number"&&t.MIN_VALUE<=n&&n<=t.MAX_VALUE}t.is=e})(Ha||(Ha={}));var ue;(function(t){function e(r,i){if(r===Number.MAX_VALUE){r=Ha.MAX_VALUE}if(i===Number.MAX_VALUE){i=Ha.MAX_VALUE}return{line:r,character:i}}t.create=e;function n(r){let i=r;return T.objectLiteral(i)&&T.uinteger(i.line)&&T.uinteger(i.character)}t.is=n})(ue||(ue={}));var ie;(function(t){function e(r,i,a,s){if(T.uinteger(r)&&T.uinteger(i)&&T.uinteger(a)&&T.uinteger(s)){return{start:ue.create(r,i),end:ue.create(a,s)}}else if(ue.is(r)&&ue.is(i)){return{start:r,end:i}}else{throw new Error(`Range#create called with invalid arguments[${r}, ${i}, ${a}, ${s}]`)}}t.create=e;function n(r){let i=r;return T.objectLiteral(i)&&ue.is(i.start)&&ue.is(i.end)}t.is=n})(ie||(ie={}));var qa;(function(t){function e(r,i){return{uri:r,range:i}}t.create=e;function n(r){let i=r;return T.objectLiteral(i)&&ie.is(i.range)&&(T.string(i.uri)||T.undefined(i.uri))}t.is=n})(qa||(qa={}));var ef;(function(t){function e(r,i,a,s){return{targetUri:r,targetRange:i,targetSelectionRange:a,originSelectionRange:s}}t.create=e;function n(r){let i=r;return T.objectLiteral(i)&&ie.is(i.targetRange)&&T.string(i.targetUri)&&ie.is(i.targetSelectionRange)&&(ie.is(i.originSelectionRange)||T.undefined(i.originSelectionRange))}t.is=n})(ef||(ef={}));var Cu;(function(t){function e(r,i,a,s){return{red:r,green:i,blue:a,alpha:s}}t.create=e;function n(r){const i=r;return T.objectLiteral(i)&&T.numberRange(i.red,0,1)&&T.numberRange(i.green,0,1)&&T.numberRange(i.blue,0,1)&&T.numberRange(i.alpha,0,1)}t.is=n})(Cu||(Cu={}));var tf;(function(t){function e(r,i){return{range:r,color:i}}t.create=e;function n(r){const i=r;return T.objectLiteral(i)&&ie.is(i.range)&&Cu.is(i.color)}t.is=n})(tf||(tf={}));var nf;(function(t){function e(r,i,a){return{label:r,textEdit:i,additionalTextEdits:a}}t.create=e;function n(r){const i=r;return T.objectLiteral(i)&&T.string(i.label)&&(T.undefined(i.textEdit)||Jt.is(i))&&(T.undefined(i.additionalTextEdits)||T.typedArray(i.additionalTextEdits,Jt.is))}t.is=n})(nf||(nf={}));var rf;(function(t){t.Comment="comment";t.Imports="imports";t.Region="region"})(rf||(rf={}));var af;(function(t){function e(r,i,a,s,o,l){const u={startLine:r,endLine:i};if(T.defined(a)){u.startCharacter=a}if(T.defined(s)){u.endCharacter=s}if(T.defined(o)){u.kind=o}if(T.defined(l)){u.collapsedText=l}return u}t.create=e;function n(r){const i=r;return T.objectLiteral(i)&&T.uinteger(i.startLine)&&T.uinteger(i.startLine)&&(T.undefined(i.startCharacter)||T.uinteger(i.startCharacter))&&(T.undefined(i.endCharacter)||T.uinteger(i.endCharacter))&&(T.undefined(i.kind)||T.string(i.kind))}t.is=n})(af||(af={}));var Su;(function(t){function e(r,i){return{location:r,message:i}}t.create=e;function n(r){let i=r;return T.defined(i)&&qa.is(i.location)&&T.string(i.message)}t.is=n})(Su||(Su={}));var sf;(function(t){t.Error=1;t.Warning=2;t.Information=3;t.Hint=4})(sf||(sf={}));var of;(function(t){t.Unnecessary=1;t.Deprecated=2})(of||(of={}));var lf;(function(t){function e(n){const r=n;return T.objectLiteral(r)&&T.string(r.href)}t.is=e})(lf||(lf={}));var ja;(function(t){function e(r,i,a,s,o,l){let u={range:r,message:i};if(T.defined(a)){u.severity=a}if(T.defined(s)){u.code=s}if(T.defined(o)){u.source=o}if(T.defined(l)){u.relatedInformation=l}return u}t.create=e;function n(r){var i;let a=r;return T.defined(a)&&ie.is(a.range)&&T.string(a.message)&&(T.number(a.severity)||T.undefined(a.severity))&&(T.integer(a.code)||T.string(a.code)||T.undefined(a.code))&&(T.undefined(a.codeDescription)||T.string((i=a.codeDescription)===null||i===void 0?void 0:i.href))&&(T.string(a.source)||T.undefined(a.source))&&(T.undefined(a.relatedInformation)||T.typedArray(a.relatedInformation,Su.is))}t.is=n})(ja||(ja={}));var kr;(function(t){function e(r,i,...a){let s={title:r,command:i};if(T.defined(a)&&a.length>0){s.arguments=a}return s}t.create=e;function n(r){let i=r;return T.defined(i)&&T.string(i.title)&&T.string(i.command)}t.is=n})(kr||(kr={}));var Jt;(function(t){function e(a,s){return{range:a,newText:s}}t.replace=e;function n(a,s){return{range:{start:a,end:a},newText:s}}t.insert=n;function r(a){return{range:a,newText:""}}t.del=r;function i(a){const s=a;return T.objectLiteral(s)&&T.string(s.newText)&&ie.is(s.range)}t.is=i})(Jt||(Jt={}));var $r;(function(t){function e(r,i,a){const s={label:r};if(i!==void 0){s.needsConfirmation=i}if(a!==void 0){s.description=a}return s}t.create=e;function n(r){const i=r;return T.objectLiteral(i)&&T.string(i.label)&&(T.boolean(i.needsConfirmation)||i.needsConfirmation===void 0)&&(T.string(i.description)||i.description===void 0)}t.is=n})($r||($r={}));var nt;(function(t){function e(n){const r=n;return T.string(r)}t.is=e})(nt||(nt={}));var Pn;(function(t){function e(a,s,o){return{range:a,newText:s,annotationId:o}}t.replace=e;function n(a,s,o){return{range:{start:a,end:a},newText:s,annotationId:o}}t.insert=n;function r(a,s){return{range:a,newText:"",annotationId:s}}t.del=r;function i(a){const s=a;return Jt.is(s)&&($r.is(s.annotationId)||nt.is(s.annotationId))}t.is=i})(Pn||(Pn={}));var Ba;(function(t){function e(r,i){return{textDocument:r,edits:i}}t.create=e;function n(r){let i=r;return T.defined(i)&&Wa.is(i.textDocument)&&Array.isArray(i.edits)}t.is=n})(Ba||(Ba={}));var zr;(function(t){function e(r,i,a){let s={kind:"create",uri:r};if(i!==void 0&&(i.overwrite!==void 0||i.ignoreIfExists!==void 0)){s.options=i}if(a!==void 0){s.annotationId=a}return s}t.create=e;function n(r){let i=r;return i&&i.kind==="create"&&T.string(i.uri)&&(i.options===void 0||(i.options.overwrite===void 0||T.boolean(i.options.overwrite))&&(i.options.ignoreIfExists===void 0||T.boolean(i.options.ignoreIfExists)))&&(i.annotationId===void 0||nt.is(i.annotationId))}t.is=n})(zr||(zr={}));var Xr;(function(t){function e(r,i,a,s){let o={kind:"rename",oldUri:r,newUri:i};if(a!==void 0&&(a.overwrite!==void 0||a.ignoreIfExists!==void 0)){o.options=a}if(s!==void 0){o.annotationId=s}return o}t.create=e;function n(r){let i=r;return i&&i.kind==="rename"&&T.string(i.oldUri)&&T.string(i.newUri)&&(i.options===void 0||(i.options.overwrite===void 0||T.boolean(i.options.overwrite))&&(i.options.ignoreIfExists===void 0||T.boolean(i.options.ignoreIfExists)))&&(i.annotationId===void 0||nt.is(i.annotationId))}t.is=n})(Xr||(Xr={}));var Yr;(function(t){function e(r,i,a){let s={kind:"delete",uri:r};if(i!==void 0&&(i.recursive!==void 0||i.ignoreIfNotExists!==void 0)){s.options=i}if(a!==void 0){s.annotationId=a}return s}t.create=e;function n(r){let i=r;return i&&i.kind==="delete"&&T.string(i.uri)&&(i.options===void 0||(i.options.recursive===void 0||T.boolean(i.options.recursive))&&(i.options.ignoreIfNotExists===void 0||T.boolean(i.options.ignoreIfNotExists)))&&(i.annotationId===void 0||nt.is(i.annotationId))}t.is=n})(Yr||(Yr={}));var Au;(function(t){function e(n){let r=n;return r&&(r.changes!==void 0||r.documentChanges!==void 0)&&(r.documentChanges===void 0||r.documentChanges.every(i=>{if(T.string(i.kind)){return zr.is(i)||Xr.is(i)||Yr.is(i)}else{return Ba.is(i)}}))}t.is=e})(Au||(Au={}));class Hs{constructor(e,n){this.edits=e;this.changeAnnotations=n}insert(e,n,r){let i;let a;if(r===void 0){i=Jt.insert(e,n)}else if(nt.is(r)){a=r;i=Pn.insert(e,n,r)}else{this.assertChangeAnnotations(this.changeAnnotations);a=this.changeAnnotations.manage(r);i=Pn.insert(e,n,a)}this.edits.push(i);if(a!==void 0){return a}}replace(e,n,r){let i;let a;if(r===void 0){i=Jt.replace(e,n)}else if(nt.is(r)){a=r;i=Pn.replace(e,n,r)}else{this.assertChangeAnnotations(this.changeAnnotations);a=this.changeAnnotations.manage(r);i=Pn.replace(e,n,a)}this.edits.push(i);if(a!==void 0){return a}}delete(e,n){let r;let i;if(n===void 0){r=Jt.del(e)}else if(nt.is(n)){i=n;r=Pn.del(e,n)}else{this.assertChangeAnnotations(this.changeAnnotations);i=this.changeAnnotations.manage(n);r=Pn.del(e,i)}this.edits.push(r);if(i!==void 0){return i}}add(e){this.edits.push(e)}all(){return this.edits}clear(){this.edits.splice(0,this.edits.length)}assertChangeAnnotations(e){if(e===void 0){throw new Error(`Text edit change is not configured to manage change annotations.`)}}}class lh{constructor(e){this._annotations=e===void 0?Object.create(null):e;this._counter=0;this._size=0}all(){return this._annotations}get size(){return this._size}manage(e,n){let r;if(nt.is(e)){r=e}else{r=this.nextId();n=e}if(this._annotations[r]!==void 0){throw new Error(`Id ${r} is already in use.`)}if(n===void 0){throw new Error(`No annotation provided for id ${r}`)}this._annotations[r]=n;this._size++;return r}nextId(){this._counter++;return this._counter.toString()}}class LN{constructor(e){this._textEditChanges=Object.create(null);if(e!==void 0){this._workspaceEdit=e;if(e.documentChanges){this._changeAnnotations=new lh(e.changeAnnotations);e.changeAnnotations=this._changeAnnotations.all();e.documentChanges.forEach(n=>{if(Ba.is(n)){const r=new Hs(n.edits,this._changeAnnotations);this._textEditChanges[n.textDocument.uri]=r}})}else if(e.changes){Object.keys(e.changes).forEach(n=>{const r=new Hs(e.changes[n]);this._textEditChanges[n]=r})}}else{this._workspaceEdit={}}}get edit(){this.initDocumentChanges();if(this._changeAnnotations!==void 0){if(this._changeAnnotations.size===0){this._workspaceEdit.changeAnnotations=void 0}else{this._workspaceEdit.changeAnnotations=this._changeAnnotations.all()}}return this._workspaceEdit}getTextEditChange(e){if(Wa.is(e)){this.initDocumentChanges();if(this._workspaceEdit.documentChanges===void 0){throw new Error("Workspace edit is not configured for document changes.")}const n={uri:e.uri,version:e.version};let r=this._textEditChanges[n.uri];if(!r){const i=[];const a={textDocument:n,edits:i};this._workspaceEdit.documentChanges.push(a);r=new Hs(i,this._changeAnnotations);this._textEditChanges[n.uri]=r}return r}else{this.initChanges();if(this._workspaceEdit.changes===void 0){throw new Error("Workspace edit is not configured for normal text edit changes.")}let n=this._textEditChanges[e];if(!n){let r=[];this._workspaceEdit.changes[e]=r;n=new Hs(r);this._textEditChanges[e]=n}return n}}initDocumentChanges(){if(this._workspaceEdit.documentChanges===void 0&&this._workspaceEdit.changes===void 0){this._changeAnnotations=new lh;this._workspaceEdit.documentChanges=[];this._workspaceEdit.changeAnnotations=this._changeAnnotations.all()}}initChanges(){if(this._workspaceEdit.documentChanges===void 0&&this._workspaceEdit.changes===void 0){this._workspaceEdit.changes=Object.create(null)}}createFile(e,n,r){this.initDocumentChanges();if(this._workspaceEdit.documentChanges===void 0){throw new Error("Workspace edit is not configured for document changes.")}let i;if($r.is(n)||nt.is(n)){i=n}else{r=n}let a;let s;if(i===void 0){a=zr.create(e,r)}else{s=nt.is(i)?i:this._changeAnnotations.manage(i);a=zr.create(e,r,s)}this._workspaceEdit.documentChanges.push(a);if(s!==void 0){return s}}renameFile(e,n,r,i){this.initDocumentChanges();if(this._workspaceEdit.documentChanges===void 0){throw new Error("Workspace edit is not configured for document changes.")}let a;if($r.is(r)||nt.is(r)){a=r}else{i=r}let s;let o;if(a===void 0){s=Xr.create(e,n,i)}else{o=nt.is(a)?a:this._changeAnnotations.manage(a);s=Xr.create(e,n,i,o)}this._workspaceEdit.documentChanges.push(s);if(o!==void 0){return o}}deleteFile(e,n,r){this.initDocumentChanges();if(this._workspaceEdit.documentChanges===void 0){throw new Error("Workspace edit is not configured for document changes.")}let i;if($r.is(n)||nt.is(n)){i=n}else{r=n}let a;let s;if(i===void 0){a=Yr.create(e,r)}else{s=nt.is(i)?i:this._changeAnnotations.manage(i);a=Yr.create(e,r,s)}this._workspaceEdit.documentChanges.push(a);if(s!==void 0){return s}}}var uf;(function(t){function e(r){return{uri:r}}t.create=e;function n(r){let i=r;return T.defined(i)&&T.string(i.uri)}t.is=n})(uf||(uf={}));var cf;(function(t){function e(r,i){return{uri:r,version:i}}t.create=e;function n(r){let i=r;return T.defined(i)&&T.string(i.uri)&&T.integer(i.version)}t.is=n})(cf||(cf={}));var Wa;(function(t){function e(r,i){return{uri:r,version:i}}t.create=e;function n(r){let i=r;return T.defined(i)&&T.string(i.uri)&&(i.version===null||T.integer(i.version))}t.is=n})(Wa||(Wa={}));var df;(function(t){function e(r,i,a,s){return{uri:r,languageId:i,version:a,text:s}}t.create=e;function n(r){let i=r;return T.defined(i)&&T.string(i.uri)&&T.string(i.languageId)&&T.integer(i.version)&&T.string(i.text)}t.is=n})(df||(df={}));var ku;(function(t){t.PlainText="plaintext";t.Markdown="markdown";function e(n){const r=n;return r===t.PlainText||r===t.Markdown}t.is=e})(ku||(ku={}));var Jr;(function(t){function e(n){const r=n;return T.objectLiteral(n)&&ku.is(r.kind)&&T.string(r.value)}t.is=e})(Jr||(Jr={}));var _n;(function(t){t.Text=1;t.Method=2;t.Function=3;t.Constructor=4;t.Field=5;t.Variable=6;t.Class=7;t.Interface=8;t.Module=9;t.Property=10;t.Unit=11;t.Value=12;t.Enum=13;t.Keyword=14;t.Snippet=15;t.Color=16;t.File=17;t.Reference=18;t.Folder=19;t.EnumMember=20;t.Constant=21;t.Struct=22;t.Event=23;t.Operator=24;t.TypeParameter=25})(_n||(_n={}));var ff;(function(t){t.PlainText=1;t.Snippet=2})(ff||(ff={}));var pf;(function(t){t.Deprecated=1})(pf||(pf={}));var mf;(function(t){function e(r,i,a){return{newText:r,insert:i,replace:a}}t.create=e;function n(r){const i=r;return i&&T.string(i.newText)&&ie.is(i.insert)&&ie.is(i.replace)}t.is=n})(mf||(mf={}));var hf;(function(t){t.asIs=1;t.adjustIndentation=2})(hf||(hf={}));var yf;(function(t){function e(n){const r=n;return r&&(T.string(r.detail)||r.detail===void 0)&&(T.string(r.description)||r.description===void 0)}t.is=e})(yf||(yf={}));var gf;(function(t){function e(n){return{label:n}}t.create=e})(gf||(gf={}));var Rf;(function(t){function e(n,r){return{items:n?n:[],isIncomplete:!!r}}t.create=e})(Rf||(Rf={}));var Va;(function(t){function e(r){return r.replace(/[\\`*_{}[\]()#+\-.!]/g,"\\$&")}t.fromPlainText=e;function n(r){const i=r;return T.string(i)||T.objectLiteral(i)&&T.string(i.language)&&T.string(i.value)}t.is=n})(Va||(Va={}));var vf;(function(t){function e(n){let r=n;return!!r&&T.objectLiteral(r)&&(Jr.is(r.contents)||Va.is(r.contents)||T.typedArray(r.contents,Va.is))&&(n.range===void 0||ie.is(n.range))}t.is=e})(vf||(vf={}));var $f;(function(t){function e(n,r){return r?{label:n,documentation:r}:{label:n}}t.create=e})($f||($f={}));var Tf;(function(t){function e(n,r,...i){let a={label:n};if(T.defined(r)){a.documentation=r}if(T.defined(i)){a.parameters=i}else{a.parameters=[]}return a}t.create=e})(Tf||(Tf={}));var Ef;(function(t){t.Text=1;t.Read=2;t.Write=3})(Ef||(Ef={}));var wf;(function(t){function e(n,r){let i={range:n};if(T.number(r)){i.kind=r}return i}t.create=e})(wf||(wf={}));var Dn;(function(t){t.File=1;t.Module=2;t.Namespace=3;t.Package=4;t.Class=5;t.Method=6;t.Property=7;t.Field=8;t.Constructor=9;t.Enum=10;t.Interface=11;t.Function=12;t.Variable=13;t.Constant=14;t.String=15;t.Number=16;t.Boolean=17;t.Array=18;t.Object=19;t.Key=20;t.Null=21;t.EnumMember=22;t.Struct=23;t.Event=24;t.Operator=25;t.TypeParameter=26})(Dn||(Dn={}));var Cf;(function(t){t.Deprecated=1})(Cf||(Cf={}));var Sf;(function(t){function e(n,r,i,a,s){let o={name:n,kind:r,location:{uri:a,range:i}};if(s){o.containerName=s}return o}t.create=e})(Sf||(Sf={}));var Af;(function(t){function e(n,r,i,a){return a!==void 0?{name:n,kind:r,location:{uri:i,range:a}}:{name:n,kind:r,location:{uri:i}}}t.create=e})(Af||(Af={}));var kf;(function(t){function e(r,i,a,s,o,l){let u={name:r,detail:i,kind:a,range:s,selectionRange:o};if(l!==void 0){u.children=l}return u}t.create=e;function n(r){let i=r;return i&&T.string(i.name)&&T.number(i.kind)&&ie.is(i.range)&&ie.is(i.selectionRange)&&(i.detail===void 0||T.string(i.detail))&&(i.deprecated===void 0||T.boolean(i.deprecated))&&(i.children===void 0||Array.isArray(i.children))&&(i.tags===void 0||Array.isArray(i.tags))}t.is=n})(kf||(kf={}));var bf;(function(t){t.Empty="";t.QuickFix="quickfix";t.Refactor="refactor";t.RefactorExtract="refactor.extract";t.RefactorInline="refactor.inline";t.RefactorRewrite="refactor.rewrite";t.Source="source";t.SourceOrganizeImports="source.organizeImports";t.SourceFixAll="source.fixAll"})(bf||(bf={}));var za;(function(t){t.Invoked=1;t.Automatic=2})(za||(za={}));var Nf;(function(t){function e(r,i,a){let s={diagnostics:r};if(i!==void 0&&i!==null){s.only=i}if(a!==void 0&&a!==null){s.triggerKind=a}return s}t.create=e;function n(r){let i=r;return T.defined(i)&&T.typedArray(i.diagnostics,ja.is)&&(i.only===void 0||T.typedArray(i.only,T.string))&&(i.triggerKind===void 0||i.triggerKind===za.Invoked||i.triggerKind===za.Automatic)}t.is=n})(Nf||(Nf={}));var Pf;(function(t){function e(r,i,a){let s={title:r};let o=true;if(typeof i==="string"){o=false;s.kind=i}else if(kr.is(i)){s.command=i}else{s.edit=i}if(o&&a!==void 0){s.kind=a}return s}t.create=e;function n(r){let i=r;return i&&T.string(i.title)&&(i.diagnostics===void 0||T.typedArray(i.diagnostics,ja.is))&&(i.kind===void 0||T.string(i.kind))&&(i.edit!==void 0||i.command!==void 0)&&(i.command===void 0||kr.is(i.command))&&(i.isPreferred===void 0||T.boolean(i.isPreferred))&&(i.edit===void 0||Au.is(i.edit))}t.is=n})(Pf||(Pf={}));var _f;(function(t){function e(r,i){let a={range:r};if(T.defined(i)){a.data=i}return a}t.create=e;function n(r){let i=r;return T.defined(i)&&ie.is(i.range)&&(T.undefined(i.command)||kr.is(i.command))}t.is=n})(_f||(_f={}));var Df;(function(t){function e(r,i){return{tabSize:r,insertSpaces:i}}t.create=e;function n(r){let i=r;return T.defined(i)&&T.uinteger(i.tabSize)&&T.boolean(i.insertSpaces)}t.is=n})(Df||(Df={}));var Of;(function(t){function e(r,i,a){return{range:r,target:i,data:a}}t.create=e;function n(r){let i=r;return T.defined(i)&&ie.is(i.range)&&(T.undefined(i.target)||T.string(i.target))}t.is=n})(Of||(Of={}));var If;(function(t){function e(r,i){return{range:r,parent:i}}t.create=e;function n(r){let i=r;return T.objectLiteral(i)&&ie.is(i.range)&&(i.parent===void 0||t.is(i.parent))}t.is=n})(If||(If={}));var Lf;(function(t){t["namespace"]="namespace";t["type"]="type";t["class"]="class";t["enum"]="enum";t["interface"]="interface";t["struct"]="struct";t["typeParameter"]="typeParameter";t["parameter"]="parameter";t["variable"]="variable";t["property"]="property";t["enumMember"]="enumMember";t["event"]="event";t["function"]="function";t["method"]="method";t["macro"]="macro";t["keyword"]="keyword";t["modifier"]="modifier";t["comment"]="comment";t["string"]="string";t["number"]="number";t["regexp"]="regexp";t["operator"]="operator";t["decorator"]="decorator"})(Lf||(Lf={}));var xf;(function(t){t["declaration"]="declaration";t["definition"]="definition";t["readonly"]="readonly";t["static"]="static";t["deprecated"]="deprecated";t["abstract"]="abstract";t["async"]="async";t["modification"]="modification";t["documentation"]="documentation";t["defaultLibrary"]="defaultLibrary"})(xf||(xf={}));var Mf;(function(t){function e(n){const r=n;return T.objectLiteral(r)&&(r.resultId===void 0||typeof r.resultId==="string")&&Array.isArray(r.data)&&(r.data.length===0||typeof r.data[0]==="number")}t.is=e})(Mf||(Mf={}));var Ff;(function(t){function e(r,i){return{range:r,text:i}}t.create=e;function n(r){const i=r;return i!==void 0&&i!==null&&ie.is(i.range)&&T.string(i.text)}t.is=n})(Ff||(Ff={}));var Kf;(function(t){function e(r,i,a){return{range:r,variableName:i,caseSensitiveLookup:a}}t.create=e;function n(r){const i=r;return i!==void 0&&i!==null&&ie.is(i.range)&&T.boolean(i.caseSensitiveLookup)&&(T.string(i.variableName)||i.variableName===void 0)}t.is=n})(Kf||(Kf={}));var Uf;(function(t){function e(r,i){return{range:r,expression:i}}t.create=e;function n(r){const i=r;return i!==void 0&&i!==null&&ie.is(i.range)&&(T.string(i.expression)||i.expression===void 0)}t.is=n})(Uf||(Uf={}));var Gf;(function(t){function e(r,i){return{frameId:r,stoppedLocation:i}}t.create=e;function n(r){const i=r;return T.defined(i)&&ie.is(r.stoppedLocation)}t.is=n})(Gf||(Gf={}));var bu;(function(t){t.Type=1;t.Parameter=2;function e(n){return n===1||n===2}t.is=e})(bu||(bu={}));var Nu;(function(t){function e(r){return{value:r}}t.create=e;function n(r){const i=r;return T.objectLiteral(i)&&(i.tooltip===void 0||T.string(i.tooltip)||Jr.is(i.tooltip))&&(i.location===void 0||qa.is(i.location))&&(i.command===void 0||kr.is(i.command))}t.is=n})(Nu||(Nu={}));var Hf;(function(t){function e(r,i,a){const s={position:r,label:i};if(a!==void 0){s.kind=a}return s}t.create=e;function n(r){const i=r;return T.objectLiteral(i)&&ue.is(i.position)&&(T.string(i.label)||T.typedArray(i.label,Nu.is))&&(i.kind===void 0||bu.is(i.kind))&&i.textEdits===void 0||T.typedArray(i.textEdits,Jt.is)&&(i.tooltip===void 0||T.string(i.tooltip)||Jr.is(i.tooltip))&&(i.paddingLeft===void 0||T.boolean(i.paddingLeft))&&(i.paddingRight===void 0||T.boolean(i.paddingRight))}t.is=n})(Hf||(Hf={}));var qf;(function(t){function e(n){return{kind:"snippet",value:n}}t.createSnippet=e})(qf||(qf={}));var jf;(function(t){function e(n,r,i,a){return{insertText:n,filterText:r,range:i,command:a}}t.create=e})(jf||(jf={}));var Bf;(function(t){function e(n){return{items:n}}t.create=e})(Bf||(Bf={}));var Wf;(function(t){t.Invoked=0;t.Automatic=1})(Wf||(Wf={}));var Vf;(function(t){function e(n,r){return{range:n,text:r}}t.create=e})(Vf||(Vf={}));var zf;(function(t){function e(n,r){return{triggerKind:n,selectedCompletionInfo:r}}t.create=e})(zf||(zf={}));var Xf;(function(t){function e(n){const r=n;return T.objectLiteral(r)&&wu.is(r.uri)&&T.string(r.name)}t.is=e})(Xf||(Xf={}));const xN=["\n","\r\n","\r"];var Yf;(function(t){function e(a,s,o,l){return new MN(a,s,o,l)}t.create=e;function n(a){let s=a;return T.defined(s)&&T.string(s.uri)&&(T.undefined(s.languageId)||T.string(s.languageId))&&T.uinteger(s.lineCount)&&T.func(s.getText)&&T.func(s.positionAt)&&T.func(s.offsetAt)?true:false}t.is=n;function r(a,s){let o=a.getText();let l=i(s,(c,d)=>{let f=c.range.start.line-d.range.start.line;if(f===0){return c.range.start.character-d.range.start.character}return f});let u=o.length;for(let c=l.length-1;c>=0;c--){let d=l[c];let f=a.offsetAt(d.range.start);let p=a.offsetAt(d.range.end);if(p<=u){o=o.substring(0,f)+d.newText+o.substring(p,o.length)}else{throw new Error("Overlapping edit")}u=f}return o}t.applyEdits=r;function i(a,s){if(a.length<=1){return a}const o=a.length/2|0;const l=a.slice(0,o);const u=a.slice(o);i(l,s);i(u,s);let c=0;let d=0;let f=0;while(c<l.length&&d<u.length){let p=s(l[c],u[d]);if(p<=0){a[f++]=l[c++]}else{a[f++]=u[d++]}}while(c<l.length){a[f++]=l[c++]}while(d<u.length){a[f++]=u[d++]}return a}})(Yf||(Yf={}));let MN=class aI{constructor(e,n,r,i){this._uri=e;this._languageId=n;this._version=r;this._content=i;this._lineOffsets=void 0}get uri(){return this._uri}get languageId(){return this._languageId}get version(){return this._version}getText(e){if(e){let n=this.offsetAt(e.start);let r=this.offsetAt(e.end);return this._content.substring(n,r)}return this._content}update(e,n){this._content=e.text;this._version=n;this._lineOffsets=void 0}getLineOffsets(){if(this._lineOffsets===void 0){let e=[];let n=this._content;let r=true;for(let i=0;i<n.length;i++){if(r){e.push(i);r=false}let a=n.charAt(i);r=a==="\r"||a==="\n";if(a==="\r"&&i+1<n.length&&n.charAt(i+1)==="\n"){i++}}if(r&&n.length>0){e.push(n.length)}this._lineOffsets=e}return this._lineOffsets}positionAt(e){e=Math.max(Math.min(e,this._content.length),0);let n=this.getLineOffsets();let r=0,i=n.length;if(i===0){return ue.create(0,e)}while(r<i){let s=Math.floor((r+i)/2);if(n[s]>e){i=s}else{r=s+1}}let a=r-1;return ue.create(a,e-n[a])}offsetAt(e){let n=this.getLineOffsets();if(e.line>=n.length){return this._content.length}else if(e.line<0){return 0}let r=n[e.line];let i=e.line+1<n.length?n[e.line+1]:this._content.length;return Math.max(Math.min(r+e.character,i),r)}get lineCount(){return this.getLineOffsets().length}};var T;(function(t){const e=Object.prototype.toString;function n(p){return typeof p!=="undefined"}t.defined=n;function r(p){return typeof p==="undefined"}t.undefined=r;function i(p){return p===true||p===false}t.boolean=i;function a(p){return e.call(p)==="[object String]"}t.string=a;function s(p){return e.call(p)==="[object Number]"}t.number=s;function o(p,y,v){return e.call(p)==="[object Number]"&&y<=p&&p<=v}t.numberRange=o;function l(p){return e.call(p)==="[object Number]"&&-2147483648<=p&&p<=2147483647}t.integer=l;function u(p){return e.call(p)==="[object Number]"&&0<=p&&p<=2147483647}t.uinteger=u;function c(p){return e.call(p)==="[object Function]"}t.func=c;function d(p){return p!==null&&typeof p==="object"}t.objectLiteral=d;function f(p,y){return Array.isArray(p)&&p.every(y)}t.typedArray=f})(T||(T={}));var FN=Object.freeze({__proto__:null,get AnnotatedTextEdit(){return Pn},get ChangeAnnotation(){return $r},get ChangeAnnotationIdentifier(){return nt},get CodeAction(){return Pf},get CodeActionContext(){return Nf},get CodeActionKind(){return bf},get CodeActionTriggerKind(){return za},get CodeDescription(){return lf},get CodeLens(){return _f},get Color(){return Cu},get ColorInformation(){return tf},get ColorPresentation(){return nf},get Command(){return kr},get CompletionItem(){return gf},get CompletionItemKind(){return _n},get CompletionItemLabelDetails(){return yf},get CompletionItemTag(){return pf},get CompletionList(){return Rf},get CreateFile(){return zr},get DeleteFile(){return Yr},get Diagnostic(){return ja},get DiagnosticRelatedInformation(){return Su},get DiagnosticSeverity(){return sf},get DiagnosticTag(){return of},get DocumentHighlight(){return wf},get DocumentHighlightKind(){return Ef},get DocumentLink(){return Of},get DocumentSymbol(){return kf},get DocumentUri(){return Qd},EOL:xN,get FoldingRange(){return af},get FoldingRangeKind(){return rf},get FormattingOptions(){return Df},get Hover(){return vf},get InlayHint(){return Hf},get InlayHintKind(){return bu},get InlayHintLabelPart(){return Nu},get InlineCompletionContext(){return zf},get InlineCompletionItem(){return jf},get InlineCompletionList(){return Bf},get InlineCompletionTriggerKind(){return Wf},get InlineValueContext(){return Gf},get InlineValueEvaluatableExpression(){return Uf},get InlineValueText(){return Ff},get InlineValueVariableLookup(){return Kf},get InsertReplaceEdit(){return mf},get InsertTextFormat(){return ff},get InsertTextMode(){return hf},get Location(){return qa},get LocationLink(){return ef},get MarkedString(){return Va},get MarkupContent(){return Jr},get MarkupKind(){return ku},get OptionalVersionedTextDocumentIdentifier(){return Wa},get ParameterInformation(){return $f},get Position(){return ue},get Range(){return ie},get RenameFile(){return Xr},get SelectedCompletionInfo(){return Vf},get SelectionRange(){return If},get SemanticTokenModifiers(){return xf},get SemanticTokenTypes(){return Lf},get SemanticTokens(){return Mf},get SignatureInformation(){return Tf},get StringValue(){return qf},get SymbolInformation(){return Sf},get SymbolKind(){return Dn},get SymbolTag(){return Cf},get TextDocument(){return Yf},get TextDocumentEdit(){return Ba},get TextDocumentIdentifier(){return uf},get TextDocumentItem(){return df},get TextEdit(){return Jt},get URI(){return wu},get VersionedTextDocumentIdentifier(){return cf},WorkspaceChange:LN,get WorkspaceEdit(){return Au},get WorkspaceFolder(){return Xf},get WorkspaceSymbol(){return Af},get integer(){return Zd},get uinteger(){return Ha}});class KN{constructor(){this.nodeStack=[]}get current(){var e;return(e=this.nodeStack[this.nodeStack.length-1])!==null&&e!==void 0?e:this.rootNode}buildRootNode(e){this.rootNode=new cv(e);this.rootNode.root=this.rootNode;this.nodeStack=[this.rootNode];return this.rootNode}buildCompositeNode(e){const n=new Hp;n.grammarSource=e;n.root=this.rootNode;this.current.content.push(n);this.nodeStack.push(n);return n}buildLeafNode(e,n){const r=new Jf(e.startOffset,e.image.length,Od(e),e.tokenType,!n);r.grammarSource=n;r.root=this.rootNode;this.current.content.push(r);return r}removeNode(e){const n=e.container;if(n){const r=n.content.indexOf(e);if(r>=0){n.content.splice(r,1)}}}addHiddenNodes(e){const n=[];for(const a of e){const s=new Jf(a.startOffset,a.image.length,Od(a),a.tokenType,true);s.root=this.rootNode;n.push(s)}let r=this.current;let i=false;if(r.content.length>0){r.content.push(...n);return}while(r.container){const a=r.container.content.indexOf(r);if(a>0){r.container.content.splice(a,0,...n);i=true;break}r=r.container}if(!i){this.rootNode.content.unshift(...n)}}construct(e){const n=this.current;if(typeof e.$type==="string"){this.current.astNode=e}e.$cstNode=n;const r=this.nodeStack.pop();if((r===null||r===void 0?void 0:r.content.length)===0){this.removeNode(r)}}}class uv{get parent(){return this.container}get feature(){return this.grammarSource}get hidden(){return false}get astNode(){var e,n;const r=typeof((e=this._astNode)===null||e===void 0?void 0:e.$type)==="string"?this._astNode:(n=this.container)===null||n===void 0?void 0:n.astNode;if(!r){throw new Error("This node has no associated AST element")}return r}set astNode(e){this._astNode=e}get element(){return this.astNode}get text(){return this.root.fullText.substring(this.offset,this.end)}}class Jf extends uv{get offset(){return this._offset}get length(){return this._length}get end(){return this._offset+this._length}get hidden(){return this._hidden}get tokenType(){return this._tokenType}get range(){return this._range}constructor(e,n,r,i,a=false){super();this._hidden=a;this._offset=e;this._tokenType=i;this._length=n;this._range=r}}class Hp extends uv{constructor(){super(...arguments);this.content=new qp(this)}get children(){return this.content}get offset(){var e,n;return(n=(e=this.firstNonHiddenNode)===null||e===void 0?void 0:e.offset)!==null&&n!==void 0?n:0}get length(){return this.end-this.offset}get end(){var e,n;return(n=(e=this.lastNonHiddenNode)===null||e===void 0?void 0:e.end)!==null&&n!==void 0?n:0}get range(){const e=this.firstNonHiddenNode;const n=this.lastNonHiddenNode;if(e&&n){if(this._rangeCache===void 0){const{range:r}=e;const{range:i}=n;this._rangeCache={start:r.start,end:i.end.line<r.start.line?r.start:i.end}}return this._rangeCache}else{return{start:ue.create(0,0),end:ue.create(0,0)}}}get firstNonHiddenNode(){for(const e of this.content){if(!e.hidden){return e}}return this.content[0]}get lastNonHiddenNode(){for(let e=this.content.length-1;e>=0;e--){const n=this.content[e];if(!n.hidden){return n}}return this.content[this.content.length-1]}}class qp extends Array{constructor(e){super();this.parent=e;Object.setPrototypeOf(this,qp.prototype)}push(...e){this.addParents(e);return super.push(...e)}unshift(...e){this.addParents(e);return super.unshift(...e)}splice(e,n,...r){this.addParents(r);return super.splice(e,n,...r)}addParents(e){for(const n of e){n.container=this.parent}}}class cv extends Hp{get text(){return this._text.substring(this.offset,this.end)}get fullText(){return this._text}constructor(e){super();this._text="";this._text=e!==null&&e!==void 0?e:""}}const Qf=Symbol("Datatype");function Sc(t){return t.$type===Qf}const uh="​";const dv=t=>t.endsWith(uh)?t:t+uh;class fv{constructor(e){this._unorderedGroups=new Map;this.allRules=new Map;this.lexer=e.parser.Lexer;const n=this.lexer.definition;const r=e.LanguageMetaData.mode==="production";this.wrapper=new jN(n,Object.assign(Object.assign({},e.parser.ParserConfig),{skipValidations:r,errorMessageProvider:e.parser.ParserErrorMessageProvider}))}alternatives(e,n){this.wrapper.wrapOr(e,n)}optional(e,n){this.wrapper.wrapOption(e,n)}many(e,n){this.wrapper.wrapMany(e,n)}atLeastOne(e,n){this.wrapper.wrapAtLeastOne(e,n)}getRule(e){return this.allRules.get(e)}isRecording(){return this.wrapper.IS_RECORDING}get unorderedGroups(){return this._unorderedGroups}getRuleStack(){return this.wrapper.RULE_STACK}finalize(){this.wrapper.wrapSelfAnalysis()}}class UN extends fv{get current(){return this.stack[this.stack.length-1]}constructor(e){super(e);this.nodeBuilder=new KN;this.stack=[];this.assignmentMap=new Map;this.linker=e.references.Linker;this.converter=e.parser.ValueConverter;this.astReflection=e.shared.AstReflection}rule(e,n){const r=this.computeRuleType(e);const i=this.wrapper.DEFINE_RULE(dv(e.name),this.startImplementation(r,n).bind(this));this.allRules.set(e.name,i);if(e.entry){this.mainRule=i}return i}computeRuleType(e){if(e.fragment){return void 0}else if(Kg(e)){return Qf}else{const n=ts(e);return n!==null&&n!==void 0?n:e.name}}parse(e,n={}){this.nodeBuilder.buildRootNode(e);const r=this.lexerResult=this.lexer.tokenize(e);this.wrapper.input=r.tokens;const i=n.rule?this.allRules.get(n.rule):this.mainRule;if(!i){throw new Error(n.rule?`No rule found with name '${n.rule}'`:"No main rule available.")}const a=i.call(this.wrapper,{});this.nodeBuilder.addHiddenNodes(r.hidden);this.unorderedGroups.clear();this.lexerResult=void 0;return{value:a,lexerErrors:r.errors,lexerReport:r.report,parserErrors:this.wrapper.errors}}startImplementation(e,n){return r=>{const i=!this.isRecording()&&e!==void 0;if(i){const s={$type:e};this.stack.push(s);if(e===Qf){s.value=""}}let a;try{a=n(r)}catch(s){a=void 0}if(a===void 0&&i){a=this.construct()}return a}}extractHiddenTokens(e){const n=this.lexerResult.hidden;if(!n.length){return[]}const r=e.startOffset;for(let i=0;i<n.length;i++){const a=n[i];if(a.startOffset>r){return n.splice(0,i)}}return n.splice(0,n.length)}consume(e,n,r){const i=this.wrapper.wrapConsume(e,n);if(!this.isRecording()&&this.isValidToken(i)){const a=this.extractHiddenTokens(i);this.nodeBuilder.addHiddenNodes(a);const s=this.nodeBuilder.buildLeafNode(i,r);const{assignment:o,isCrossRef:l}=this.getAssignment(r);const u=this.current;if(o){const c=dn(r)?i.image:this.converter.convert(i.image,s);this.assign(o.operator,o.feature,c,s,l)}else if(Sc(u)){let c=i.image;if(!dn(r)){c=this.converter.convert(c,s).toString()}u.value+=c}}}isValidToken(e){return!e.isInsertedInRecovery&&!isNaN(e.startOffset)&&typeof e.endOffset==="number"&&!isNaN(e.endOffset)}subrule(e,n,r,i,a){let s;if(!this.isRecording()&&!r){s=this.nodeBuilder.buildCompositeNode(i)}const o=this.wrapper.wrapSubrule(e,n,a);if(!this.isRecording()&&s&&s.length>0){this.performSubruleAssignment(o,i,s)}}performSubruleAssignment(e,n,r){const{assignment:i,isCrossRef:a}=this.getAssignment(n);if(i){this.assign(i.operator,i.feature,e,r,a)}else if(!i){const s=this.current;if(Sc(s)){s.value+=e.toString()}else if(typeof e==="object"&&e){const o=this.assignWithoutOverride(e,s);const l=o;this.stack.pop();this.stack.push(l)}}}action(e,n){if(!this.isRecording()){let r=this.current;if(n.feature&&n.operator){r=this.construct();this.nodeBuilder.removeNode(r.$cstNode);const i=this.nodeBuilder.buildCompositeNode(n);i.content.push(r.$cstNode);const a={$type:e};this.stack.push(a);this.assign(n.operator,n.feature,r,r.$cstNode,false)}else{r.$type=e}}}construct(){if(this.isRecording()){return void 0}const e=this.current;H$(e);this.nodeBuilder.construct(e);this.stack.pop();if(Sc(e)){return this.converter.convert(e.value,e.$cstNode)}else{Ng(this.astReflection,e)}return e}getAssignment(e){if(!this.assignmentMap.has(e)){const n=In(e,cn);this.assignmentMap.set(e,{assignment:n,isCrossRef:n?es(n.terminal):false})}return this.assignmentMap.get(e)}assign(e,n,r,i,a){const s=this.current;let o;if(a&&typeof r==="string"){o=this.linker.buildReference(s,n,i,r)}else{o=r}switch(e){case"=":{s[n]=o;break}case"?=":{s[n]=true;break}case"+=":{if(!Array.isArray(s[n])){s[n]=[]}s[n].push(o)}}}assignWithoutOverride(e,n){for(const[i,a]of Object.entries(n)){const s=e[i];if(s===void 0){e[i]=a}else if(Array.isArray(s)&&Array.isArray(a)){a.push(...s);e[i]=a}}const r=e.$cstNode;if(r){r.astNode=void 0;e.$cstNode=void 0}return e}get definitionErrors(){return this.wrapper.definitionErrors}}class GN{buildMismatchTokenMessage(e){return Ur.buildMismatchTokenMessage(e)}buildNotAllInputParsedMessage(e){return Ur.buildNotAllInputParsedMessage(e)}buildNoViableAltMessage(e){return Ur.buildNoViableAltMessage(e)}buildEarlyExitMessage(e){return Ur.buildEarlyExitMessage(e)}}class pv extends GN{buildMismatchTokenMessage({expected:e,actual:n}){const r=e.LABEL?"`"+e.LABEL+"`":e.name.endsWith(":KW")?`keyword '${e.name.substring(0,e.name.length-3)}'`:`token of type '${e.name}'`;return`Expecting ${r} but found \`${n.image}\`.`}buildNotAllInputParsedMessage({firstRedundant:e}){return`Expecting end of file but found \`${e.image}\`.`}}class HN extends fv{constructor(){super(...arguments);this.tokens=[];this.elementStack=[];this.lastElementStack=[];this.nextTokenIndex=0;this.stackSize=0}action(){}construct(){return void 0}parse(e){this.resetState();const n=this.lexer.tokenize(e,{mode:"partial"});this.tokens=n.tokens;this.wrapper.input=[...this.tokens];this.mainRule.call(this.wrapper,{});this.unorderedGroups.clear();return{tokens:this.tokens,elementStack:[...this.lastElementStack],tokenIndex:this.nextTokenIndex}}rule(e,n){const r=this.wrapper.DEFINE_RULE(dv(e.name),this.startImplementation(n).bind(this));this.allRules.set(e.name,r);if(e.entry){this.mainRule=r}return r}resetState(){this.elementStack=[];this.lastElementStack=[];this.nextTokenIndex=0;this.stackSize=0}startImplementation(e){return n=>{const r=this.keepStackSize();try{e(n)}finally{this.resetStackSize(r)}}}removeUnexpectedElements(){this.elementStack.splice(this.stackSize)}keepStackSize(){const e=this.elementStack.length;this.stackSize=e;return e}resetStackSize(e){this.removeUnexpectedElements();this.stackSize=e}consume(e,n,r){this.wrapper.wrapConsume(e,n);if(!this.isRecording()){this.lastElementStack=[...this.elementStack,r];this.nextTokenIndex=this.currIdx+1}}subrule(e,n,r,i,a){this.before(i);this.wrapper.wrapSubrule(e,n,a);this.after(i)}before(e){if(!this.isRecording()){this.elementStack.push(e)}}after(e){if(!this.isRecording()){const n=this.elementStack.lastIndexOf(e);if(n>=0){this.elementStack.splice(n)}}}get currIdx(){return this.wrapper.currIdx}}const qN={recoveryEnabled:true,nodeLocationTracking:"full",skipValidations:true,errorMessageProvider:new pv};class jN extends JR{constructor(e,n){const r=n&&"maxLookahead"in n;super(e,Object.assign(Object.assign(Object.assign({},qN),{lookaheadStrategy:r?new Lp({maxLookahead:n.maxLookahead}):new hN({logging:n.skipValidations?()=>{}:void 0})}),n))}get IS_RECORDING(){return this.RECORDING_PHASE}DEFINE_RULE(e,n){return this.RULE(e,n)}wrapSelfAnalysis(){this.performSelfAnalysis()}wrapConsume(e,n){return this.consume(e,n)}wrapSubrule(e,n,r){return this.subrule(e,n,{ARGS:[r]})}wrapOr(e,n){this.or(e,n)}wrapOption(e,n){this.option(e,n)}wrapMany(e,n){this.many(e,n)}wrapAtLeastOne(e,n){this.atLeastOne(e,n)}}function mv(t,e,n){const r={parser:e,tokens:n,ruleNames:new Map};BN(r,t);return e}function BN(t,e){const n=up(e,false);const r=be(e.rules).filter(ct).filter(i=>n.has(i));for(const i of r){const a=Object.assign(Object.assign({},t),{consume:1,optional:1,subrule:1,many:1,or:1});t.parser.rule(i,br(a,i.definition))}}function br(t,e,n=false){let r;if(dn(e)){r=QN(t,e)}else if(Za(e)){r=WN(t,e)}else if(cn(e)){r=br(t,e.terminal)}else if(es(e)){r=hv(t,e)}else if(Mn(e)){r=VN(t,e)}else if(op(e)){r=XN(t,e)}else if(lp(e)){r=YN(t,e)}else if(wr(e)){r=JN(t,e)}else if(I$(e)){const i=t.consume++;r=()=>t.parser.consume(i,Zn,e)}else{throw new Eg(e.$cstNode,`Unexpected element type: ${e.$type}`)}return yv(t,n?void 0:Pu(e),r,e.cardinality)}function WN(t,e){const n=qu(e);return()=>t.parser.action(n,e)}function VN(t,e){const n=e.rule.ref;if(ct(n)){const r=t.subrule++;const i=n.fragment;const a=e.arguments.length>0?zN(n,e.arguments):()=>({});return s=>t.parser.subrule(r,gv(t,n),i,e,a(s))}else if(tr(n)){const r=t.consume++;const i=Zf(t,n.name);return()=>t.parser.consume(r,i,e)}else if(!n){throw new Eg(e.$cstNode,`Undefined rule: ${e.rule.$refText}`)}else{Qa()}}function zN(t,e){const n=e.map(r=>On(r.value));return r=>{const i={};for(let a=0;a<n.length;a++){const s=t.parameters[a];const o=n[a];i[s.name]=o(r)}return i}}function On(t){if(b$(t)){const e=On(t.left);const n=On(t.right);return r=>e(r)||n(r)}else if(k$(t)){const e=On(t.left);const n=On(t.right);return r=>e(r)&&n(r)}else if(N$(t)){const e=On(t.value);return n=>!e(n)}else if(P$(t)){const e=t.parameter.ref.name;return n=>n!==void 0&&n[e]===true}else if(A$(t)){const e=Boolean(t.true);return()=>e}Qa()}function XN(t,e){if(e.elements.length===1){return br(t,e.elements[0])}else{const n=[];for(const i of e.elements){const a={ALT:br(t,i,true)};const s=Pu(i);if(s){a.GATE=On(s)}n.push(a)}const r=t.or++;return i=>t.parser.alternatives(r,n.map(a=>{const s={ALT:()=>a.ALT(i)};const o=a.GATE;if(o){s.GATE=()=>o(i)}return s}))}}function YN(t,e){if(e.elements.length===1){return br(t,e.elements[0])}const n=[];for(const o of e.elements){const l={ALT:br(t,o,true)};const u=Pu(o);if(u){l.GATE=On(u)}n.push(l)}const r=t.or++;const i=(o,l)=>{const u=l.getRuleStack().join("-");return`uGroup_${o}_${u}`};const a=o=>t.parser.alternatives(r,n.map((l,u)=>{const c={ALT:()=>true};const d=t.parser;c.ALT=()=>{l.ALT(o);if(!d.isRecording()){const p=i(r,d);if(!d.unorderedGroups.get(p)){d.unorderedGroups.set(p,[])}const y=d.unorderedGroups.get(p);if(typeof(y===null||y===void 0?void 0:y[u])==="undefined"){y[u]=true}}};const f=l.GATE;if(f){c.GATE=()=>f(o)}else{c.GATE=()=>{const p=d.unorderedGroups.get(i(r,d));const y=!(p===null||p===void 0?void 0:p[u]);return y}}return c}));const s=yv(t,Pu(e),a,"*");return o=>{s(o);if(!t.parser.isRecording()){t.parser.unorderedGroups.delete(i(r,t.parser))}}}function JN(t,e){const n=e.elements.map(r=>br(t,r));return r=>n.forEach(i=>i(r))}function Pu(t){if(wr(t)){return t.guardCondition}return void 0}function hv(t,e,n=e.terminal){if(!n){if(!e.type.ref){throw new Error("Could not resolve reference to type: "+e.type.$refText)}const r=Mg(e.type.ref);const i=r===null||r===void 0?void 0:r.terminal;if(!i){throw new Error("Could not find name assignment for type: "+qu(e.type.ref))}return hv(t,e,i)}else if(Mn(n)&&ct(n.rule.ref)){const r=n.rule.ref;const i=t.subrule++;return a=>t.parser.subrule(i,gv(t,r),false,e,a)}else if(Mn(n)&&tr(n.rule.ref)){const r=t.consume++;const i=Zf(t,n.rule.ref.name);return()=>t.parser.consume(r,i,e)}else if(dn(n)){const r=t.consume++;const i=Zf(t,n.value);return()=>t.parser.consume(r,i,e)}else{throw new Error("Could not build cross reference parser")}}function QN(t,e){const n=t.consume++;const r=t.tokens[e.value];if(!r){throw new Error("Could not find token for keyword: "+e.value)}return()=>t.parser.consume(n,r,e)}function yv(t,e,n,r){const i=e&&On(e);if(!r){if(i){const a=t.or++;return s=>t.parser.alternatives(a,[{ALT:()=>n(s),GATE:()=>i(s)},{ALT:ih(),GATE:()=>!i(s)}])}else{return n}}if(r==="*"){const a=t.many++;return s=>t.parser.many(a,{DEF:()=>n(s),GATE:i?()=>i(s):void 0})}else if(r==="+"){const a=t.many++;if(i){const s=t.or++;return o=>t.parser.alternatives(s,[{ALT:()=>t.parser.atLeastOne(a,{DEF:()=>n(o)}),GATE:()=>i(o)},{ALT:ih(),GATE:()=>!i(o)}])}else{return s=>t.parser.atLeastOne(a,{DEF:()=>n(s)})}}else if(r==="?"){const a=t.optional++;return s=>t.parser.optional(a,{DEF:()=>n(s),GATE:i?()=>i(s):void 0})}else{Qa()}}function gv(t,e){const n=ZN(t,e);const r=t.parser.getRule(n);if(!r)throw new Error(`Rule "${n}" not found."`);return r}function ZN(t,e){if(ct(e)){return e.name}else if(t.ruleNames.has(e)){return t.ruleNames.get(e)}else{let n=e;let r=n.$container;let i=e.$type;while(!ct(r)){if(wr(r)||op(r)||lp(r)){const s=r.elements.indexOf(n);i=s.toString()+":"+i}n=r;r=r.$container}const a=r;i=a.name+":"+i;t.ruleNames.set(e,i);return i}}function Zf(t,e){const n=t.tokens[e];if(!n)throw new Error(`Token "${e}" not found."`);return n}function eP(t){const e=t.Grammar;const n=t.parser.Lexer;const r=new HN(t);mv(e,r,n.definition);r.finalize();return r}function tP(t){const e=nP(t);e.finalize();return e}function nP(t){const e=t.Grammar;const n=t.parser.Lexer;const r=new UN(t);return mv(e,r,n.definition)}class Rv{constructor(){this.diagnostics=[]}buildTokens(e,n){const r=be(up(e,false));const i=this.buildTerminalTokens(r);const a=this.buildKeywordTokens(r,i,n);i.forEach(s=>{const o=s.PATTERN;if(typeof o==="object"&&o&&"test"in o&&du(o)){a.unshift(s)}else{a.push(s)}});return a}flushLexingReport(e){return{diagnostics:this.popDiagnostics()}}popDiagnostics(){const e=[...this.diagnostics];this.diagnostics=[];return e}buildTerminalTokens(e){return e.filter(tr).filter(n=>!n.fragment).map(n=>this.buildTerminalToken(n)).toArray()}buildTerminalToken(e){const n=ju(e);const r=this.requiresCustomPattern(n)?this.regexPatternFunction(n):n;const i={name:e.name,PATTERN:r};if(typeof r==="function"){i.LINE_BREAKS=true}if(e.hidden){i.GROUP=du(n)?ot.SKIPPED:"hidden"}return i}requiresCustomPattern(e){if(e.flags.includes("u")||e.flags.includes("s")){return true}else if(e.source.includes("?<=")||e.source.includes("?<!")){return true}else{return false}}regexPatternFunction(e){const n=new RegExp(e,e.flags+"y");return(r,i)=>{n.lastIndex=i;const a=n.exec(r);return a}}buildKeywordTokens(e,n,r){return e.filter(ct).flatMap(i=>Nr(i).filter(dn)).distinct(i=>i.value).toArray().sort((i,a)=>a.value.length-i.value.length).map(i=>this.buildKeywordToken(i,n,Boolean(r===null||r===void 0?void 0:r.caseInsensitive)))}buildKeywordToken(e,n,r){const i=this.buildKeywordPattern(e,r);const a={name:e.value,PATTERN:i,LONGER_ALT:this.findLongerAlt(e,n)};if(typeof i==="function"){a.LINE_BREAKS=true}return a}buildKeywordPattern(e,n){return n?new RegExp(J$(e.value)):e.value}findLongerAlt(e,n){return n.reduce((r,i)=>{const a=i===null||i===void 0?void 0:i.PATTERN;if((a===null||a===void 0?void 0:a.source)&&Q$("^"+a.source+"$",e.value)){r.push(i)}return r},[])}}class rP{convert(e,n){let r=n.grammarSource;if(es(r)){r=Og(r)}if(Mn(r)){const i=r.rule.ref;if(!i){throw new Error("This cst node was not parsed by a rule.")}return this.runConverter(i,e,n)}return e}runConverter(e,n,r){var i;switch(e.name.toUpperCase()){case"INT":return bn.convertInt(n);case"STRING":return bn.convertString(n);case"ID":return bn.convertID(n)}switch((i=sT(e))===null||i===void 0?void 0:i.toLowerCase()){case"number":return bn.convertNumber(n);case"boolean":return bn.convertBoolean(n);case"bigint":return bn.convertBigint(n);case"date":return bn.convertDate(n);default:return n}}}var bn;(function(t){function e(u){let c="";for(let d=1;d<u.length-1;d++){const f=u.charAt(d);if(f==="\\"){const p=u.charAt(++d);c+=n(p)}else{c+=f}}return c}t.convertString=e;function n(u){switch(u){case"b":return"\b";case"f":return"\f";case"n":return"\n";case"r":return"\r";case"t":return"	";case"v":return"\v";case"0":return"\0";default:return u}}function r(u){if(u.charAt(0)==="^"){return u.substring(1)}else{return u}}t.convertID=r;function i(u){return parseInt(u)}t.convertInt=i;function a(u){return BigInt(u)}t.convertBigint=a;function s(u){return new Date(u)}t.convertDate=s;function o(u){return Number(u)}t.convertNumber=o;function l(u){return u.toLowerCase()==="true"}t.convertBoolean=l})(bn||(bn={}));function iP(t){if(t.__esModule)return t;var e=t.default;if(typeof e=="function"){var n=function r(){if(this instanceof r){return Reflect.construct(e,arguments,this.constructor)}return e.apply(this,arguments)};n.prototype=e.prototype}else n={};Object.defineProperty(n,"__esModule",{value:true});Object.keys(t).forEach(function(r){var i=Object.getOwnPropertyDescriptor(t,r);Object.defineProperty(n,r,i.get?i:{enumerable:true,get:function(){return t[r]}})});return n}var lr={};var qs={};var ch;function vv(){if(ch)return qs;ch=1;Object.defineProperty(qs,"__esModule",{value:true});let t;function e(){if(t===void 0){throw new Error(`No runtime abstraction layer installed`)}return t}(function(n){function r(i){if(i===void 0){throw new Error(`No runtime abstraction layer provided`)}t=i}n.install=r})(e);qs.default=e;return qs}var Je={};var dh;function aP(){if(dh)return Je;dh=1;Object.defineProperty(Je,"__esModule",{value:true});Je.stringArray=Je.array=Je.func=Je.error=Je.number=Je.string=Je.boolean=void 0;function t(o){return o===true||o===false}Je.boolean=t;function e(o){return typeof o==="string"||o instanceof String}Je.string=e;function n(o){return typeof o==="number"||o instanceof Number}Je.number=n;function r(o){return o instanceof Error}Je.error=r;function i(o){return typeof o==="function"}Je.func=i;function a(o){return Array.isArray(o)}Je.array=a;function s(o){return a(o)&&o.every(l=>e(l))}Je.stringArray=s;return Je}var ur={};var fh;function $v(){if(fh)return ur;fh=1;Object.defineProperty(ur,"__esModule",{value:true});ur.Emitter=ur.Event=void 0;const t=vv();var e;(function(i){const a={dispose(){}};i.None=function(){return a}})(e||(ur.Event=e={}));class n{add(a,s=null,o){if(!this._callbacks){this._callbacks=[];this._contexts=[]}this._callbacks.push(a);this._contexts.push(s);if(Array.isArray(o)){o.push({dispose:()=>this.remove(a,s)})}}remove(a,s=null){if(!this._callbacks){return}let o=false;for(let l=0,u=this._callbacks.length;l<u;l++){if(this._callbacks[l]===a){if(this._contexts[l]===s){this._callbacks.splice(l,1);this._contexts.splice(l,1);return}else{o=true}}}if(o){throw new Error("When adding a listener with a context, you should remove it with the same context")}}invoke(...a){if(!this._callbacks){return[]}const s=[],o=this._callbacks.slice(0),l=this._contexts.slice(0);for(let u=0,c=o.length;u<c;u++){try{s.push(o[u].apply(l[u],a))}catch(d){(0,t.default)().console.error(d)}}return s}isEmpty(){return!this._callbacks||this._callbacks.length===0}dispose(){this._callbacks=void 0;this._contexts=void 0}}class r{constructor(a){this._options=a}get event(){if(!this._event){this._event=(a,s,o)=>{if(!this._callbacks){this._callbacks=new n}if(this._options&&this._options.onFirstListenerAdd&&this._callbacks.isEmpty()){this._options.onFirstListenerAdd(this)}this._callbacks.add(a,s);const l={dispose:()=>{if(!this._callbacks){return}this._callbacks.remove(a,s);l.dispose=r._noop;if(this._options&&this._options.onLastListenerRemove&&this._callbacks.isEmpty()){this._options.onLastListenerRemove(this)}}};if(Array.isArray(o)){o.push(l)}return l}}return this._event}fire(a){if(this._callbacks){this._callbacks.invoke.call(this._callbacks,a)}}dispose(){if(this._callbacks){this._callbacks.dispose();this._callbacks=void 0}}}ur.Emitter=r;r._noop=function(){};return ur}var ph;function sP(){if(ph)return lr;ph=1;Object.defineProperty(lr,"__esModule",{value:true});lr.CancellationTokenSource=lr.CancellationToken=void 0;const t=vv();const e=aP();const n=$v();var r;(function(o){o.None=Object.freeze({isCancellationRequested:false,onCancellationRequested:n.Event.None});o.Cancelled=Object.freeze({isCancellationRequested:true,onCancellationRequested:n.Event.None});function l(u){const c=u;return c&&(c===o.None||c===o.Cancelled||e.boolean(c.isCancellationRequested)&&!!c.onCancellationRequested)}o.is=l})(r||(lr.CancellationToken=r={}));const i=Object.freeze(function(o,l){const u=(0,t.default)().timer.setTimeout(o.bind(l),0);return{dispose(){u.dispose()}}});class a{constructor(){this._isCancelled=false}cancel(){if(!this._isCancelled){this._isCancelled=true;if(this._emitter){this._emitter.fire(void 0);this.dispose()}}}get isCancellationRequested(){return this._isCancelled}get onCancellationRequested(){if(this._isCancelled){return i}if(!this._emitter){this._emitter=new n.Emitter}return this._emitter.event}dispose(){if(this._emitter){this._emitter.dispose();this._emitter=void 0}}}class s{get token(){if(!this._token){this._token=new a}return this._token}cancel(){if(!this._token){this._token=r.Cancelled}else{this._token.cancel()}}dispose(){if(!this._token){this._token=r.None}else if(this._token instanceof a){this._token.dispose()}}}lr.CancellationTokenSource=s;return lr}var ye=sP();function oP(){return new Promise(t=>{if(typeof setImmediate==="undefined"){setTimeout(t,0)}else{setImmediate(t)}})}let Xl=0;let lP=10;function uP(){Xl=performance.now();return new ye.CancellationTokenSource}const _u=Symbol("OperationCancelled");function ds(t){return t===_u}async function ht(t){if(t===ye.CancellationToken.None){return}const e=performance.now();if(e-Xl>=lP){Xl=e;await oP();Xl=performance.now()}if(t.isCancellationRequested){throw _u}}class jp{constructor(){this.promise=new Promise((e,n)=>{this.resolve=r=>{e(r);return this};this.reject=r=>{n(r);return this}})}}class Xa{constructor(e,n,r,i){this._uri=e;this._languageId=n;this._version=r;this._content=i;this._lineOffsets=void 0}get uri(){return this._uri}get languageId(){return this._languageId}get version(){return this._version}getText(e){if(e){const n=this.offsetAt(e.start);const r=this.offsetAt(e.end);return this._content.substring(n,r)}return this._content}update(e,n){for(const r of e){if(Xa.isIncremental(r)){const i=Ev(r.range);const a=this.offsetAt(i.start);const s=this.offsetAt(i.end);this._content=this._content.substring(0,a)+r.text+this._content.substring(s,this._content.length);const o=Math.max(i.start.line,0);const l=Math.max(i.end.line,0);let u=this._lineOffsets;const c=mh(r.text,false,a);if(l-o===c.length){for(let f=0,p=c.length;f<p;f++){u[f+o+1]=c[f]}}else{if(c.length<1e4){u.splice(o+1,l-o,...c)}else{this._lineOffsets=u=u.slice(0,o+1).concat(c,u.slice(l+1))}}const d=r.text.length-(s-a);if(d!==0){for(let f=o+1+c.length,p=u.length;f<p;f++){u[f]=u[f]+d}}}else if(Xa.isFull(r)){this._content=r.text;this._lineOffsets=void 0}else{throw new Error("Unknown change event received")}}this._version=n}getLineOffsets(){if(this._lineOffsets===void 0){this._lineOffsets=mh(this._content,true)}return this._lineOffsets}positionAt(e){e=Math.max(Math.min(e,this._content.length),0);const n=this.getLineOffsets();let r=0,i=n.length;if(i===0){return{line:0,character:e}}while(r<i){const s=Math.floor((r+i)/2);if(n[s]>e){i=s}else{r=s+1}}const a=r-1;e=this.ensureBeforeEOL(e,n[a]);return{line:a,character:e-n[a]}}offsetAt(e){const n=this.getLineOffsets();if(e.line>=n.length){return this._content.length}else if(e.line<0){return 0}const r=n[e.line];if(e.character<=0){return r}const i=e.line+1<n.length?n[e.line+1]:this._content.length;const a=Math.min(r+e.character,i);return this.ensureBeforeEOL(a,r)}ensureBeforeEOL(e,n){while(e>n&&Tv(this._content.charCodeAt(e-1))){e--}return e}get lineCount(){return this.getLineOffsets().length}static isIncremental(e){const n=e;return n!==void 0&&n!==null&&typeof n.text==="string"&&n.range!==void 0&&(n.rangeLength===void 0||typeof n.rangeLength==="number")}static isFull(e){const n=e;return n!==void 0&&n!==null&&typeof n.text==="string"&&n.range===void 0&&n.rangeLength===void 0}}var Du;(function(t){function e(i,a,s,o){return new Xa(i,a,s,o)}t.create=e;function n(i,a,s){if(i instanceof Xa){i.update(a,s);return i}else{throw new Error("TextDocument.update: document must be created by TextDocument.create")}}t.update=n;function r(i,a){const s=i.getText();const o=ep(a.map(cP),(c,d)=>{const f=c.range.start.line-d.range.start.line;if(f===0){return c.range.start.character-d.range.start.character}return f});let l=0;const u=[];for(const c of o){const d=i.offsetAt(c.range.start);if(d<l){throw new Error("Overlapping edit")}else if(d>l){u.push(s.substring(l,d))}if(c.newText.length){u.push(c.newText)}l=i.offsetAt(c.range.end)}u.push(s.substr(l));return u.join("")}t.applyEdits=r})(Du||(Du={}));function ep(t,e){if(t.length<=1){return t}const n=t.length/2|0;const r=t.slice(0,n);const i=t.slice(n);ep(r,e);ep(i,e);let a=0;let s=0;let o=0;while(a<r.length&&s<i.length){const l=e(r[a],i[s]);if(l<=0){t[o++]=r[a++]}else{t[o++]=i[s++]}}while(a<r.length){t[o++]=r[a++]}while(s<i.length){t[o++]=i[s++]}return t}function mh(t,e,n=0){const r=e?[n]:[];for(let i=0;i<t.length;i++){const a=t.charCodeAt(i);if(Tv(a)){if(a===13&&i+1<t.length&&t.charCodeAt(i+1)===10){i++}r.push(n+i+1)}}return r}function Tv(t){return t===13||t===10}function Ev(t){const e=t.start;const n=t.end;if(e.line>n.line||e.line===n.line&&e.character>n.character){return{start:n,end:e}}return t}function cP(t){const e=Ev(t.range);if(e!==t.range){return{newText:t.newText,range:e}}return t}var wv;(()=>{var t={470:i=>{function a(l){if("string"!=typeof l)throw new TypeError("Path must be a string. Received "+JSON.stringify(l))}function s(l,u){for(var c,d="",f=0,p=-1,y=0,v=0;v<=l.length;++v){if(v<l.length)c=l.charCodeAt(v);else{if(47===c)break;c=47}if(47===c){if(p===v-1||1===y);else if(p!==v-1&&2===y){if(d.length<2||2!==f||46!==d.charCodeAt(d.length-1)||46!==d.charCodeAt(d.length-2)){if(d.length>2){var k=d.lastIndexOf("/");if(k!==d.length-1){-1===k?(d="",f=0):f=(d=d.slice(0,k)).length-1-d.lastIndexOf("/"),p=v,y=0;continue}}else if(2===d.length||1===d.length){d="",f=0,p=v,y=0;continue}}u&&(d.length>0?d+="/..":d="..",f=2)}else d.length>0?d+="/"+l.slice(p+1,v):d=l.slice(p+1,v),f=v-p-1;p=v,y=0}else 46===c&&-1!==y?++y:y=-1}return d}var o={resolve:function(){for(var l,u="",c=false,d=arguments.length-1;d>=-1&&!c;d--){var f;d>=0?f=arguments[d]:(void 0===l&&(l=process.cwd()),f=l),a(f),0!==f.length&&(u=f+"/"+u,c=47===f.charCodeAt(0))}return u=s(u,!c),c?u.length>0?"/"+u:"/":u.length>0?u:"."},normalize:function(l){if(a(l),0===l.length)return".";var u=47===l.charCodeAt(0),c=47===l.charCodeAt(l.length-1);return 0!==(l=s(l,!u)).length||u||(l="."),l.length>0&&c&&(l+="/"),u?"/"+l:l},isAbsolute:function(l){return a(l),l.length>0&&47===l.charCodeAt(0)},join:function(){if(0===arguments.length)return".";for(var l,u=0;u<arguments.length;++u){var c=arguments[u];a(c),c.length>0&&(void 0===l?l=c:l+="/"+c)}return void 0===l?".":o.normalize(l)},relative:function(l,u){if(a(l),a(u),l===u)return"";if((l=o.resolve(l))===(u=o.resolve(u)))return"";for(var c=1;c<l.length&&47===l.charCodeAt(c);++c);for(var d=l.length,f=d-c,p=1;p<u.length&&47===u.charCodeAt(p);++p);for(var y=u.length-p,v=f<y?f:y,k=-1,$=0;$<=v;++$){if($===v){if(y>v){if(47===u.charCodeAt(p+$))return u.slice(p+$+1);if(0===$)return u.slice(p+$)}else f>v&&(47===l.charCodeAt(c+$)?k=$:0===$&&(k=0));break}var E=l.charCodeAt(c+$);if(E!==u.charCodeAt(p+$))break;47===E&&(k=$)}var C="";for($=c+k+1;$<=d;++$)$!==d&&47!==l.charCodeAt($)||(0===C.length?C+="..":C+="/..");return C.length>0?C+u.slice(p+k):(p+=k,47===u.charCodeAt(p)&&++p,u.slice(p))},_makeLong:function(l){return l},dirname:function(l){if(a(l),0===l.length)return".";for(var u=l.charCodeAt(0),c=47===u,d=-1,f=true,p=l.length-1;p>=1;--p)if(47===(u=l.charCodeAt(p))){if(!f){d=p;break}}else f=false;return-1===d?c?"/":".":c&&1===d?"//":l.slice(0,d)},basename:function(l,u){if(void 0!==u&&"string"!=typeof u)throw new TypeError('"ext" argument must be a string');a(l);var c,d=0,f=-1,p=true;if(void 0!==u&&u.length>0&&u.length<=l.length){if(u.length===l.length&&u===l)return"";var y=u.length-1,v=-1;for(c=l.length-1;c>=0;--c){var k=l.charCodeAt(c);if(47===k){if(!p){d=c+1;break}}else-1===v&&(p=false,v=c+1),y>=0&&(k===u.charCodeAt(y)?-1==--y&&(f=c):(y=-1,f=v))}return d===f?f=v:-1===f&&(f=l.length),l.slice(d,f)}for(c=l.length-1;c>=0;--c)if(47===l.charCodeAt(c)){if(!p){d=c+1;break}}else-1===f&&(p=false,f=c+1);return-1===f?"":l.slice(d,f)},extname:function(l){a(l);for(var u=-1,c=0,d=-1,f=true,p=0,y=l.length-1;y>=0;--y){var v=l.charCodeAt(y);if(47!==v)-1===d&&(f=false,d=y+1),46===v?-1===u?u=y:1!==p&&(p=1):-1!==u&&(p=-1);else if(!f){c=y+1;break}}return-1===u||-1===d||0===p||1===p&&u===d-1&&u===c+1?"":l.slice(u,d)},format:function(l){if(null===l||"object"!=typeof l)throw new TypeError('The "pathObject" argument must be of type Object. Received type '+typeof l);return function(u,c){var d=c.dir||c.root,f=c.base||(c.name||"")+(c.ext||"");return d?d===c.root?d+f:d+"/"+f:f}(0,l)},parse:function(l){a(l);var u={root:"",dir:"",base:"",ext:"",name:""};if(0===l.length)return u;var c,d=l.charCodeAt(0),f=47===d;f?(u.root="/",c=1):c=0;for(var p=-1,y=0,v=-1,k=true,$=l.length-1,E=0;$>=c;--$)if(47!==(d=l.charCodeAt($)))-1===v&&(k=false,v=$+1),46===d?-1===p?p=$:1!==E&&(E=1):-1!==p&&(E=-1);else if(!k){y=$+1;break}return-1===p||-1===v||0===E||1===E&&p===v-1&&p===y+1?-1!==v&&(u.base=u.name=0===y&&f?l.slice(1,v):l.slice(y,v)):(0===y&&f?(u.name=l.slice(1,p),u.base=l.slice(1,v)):(u.name=l.slice(y,p),u.base=l.slice(y,v)),u.ext=l.slice(p,v)),y>0?u.dir=l.slice(0,y-1):f&&(u.dir="/"),u},sep:"/",delimiter:":",win32:null,posix:null};o.posix=o,i.exports=o}},e={};function n(i){var a=e[i];if(void 0!==a)return a.exports;var s=e[i]={exports:{}};return t[i](s,s.exports,n),s.exports}n.d=(i,a)=>{for(var s in a)n.o(a,s)&&!n.o(i,s)&&Object.defineProperty(i,s,{enumerable:true,get:a[s]})},n.o=(i,a)=>Object.prototype.hasOwnProperty.call(i,a),n.r=i=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(i,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(i,"__esModule",{value:true})};var r={};(()=>{let i;if(n.r(r),n.d(r,{URI:()=>f,Utils:()=>de}),"object"==typeof process)i="win32"===process.platform;else if("object"==typeof navigator){let L=navigator.userAgent;i=L.indexOf("Windows")>=0}const a=/^\w[\w\d+.-]*$/,s=/^\//,o=/^\/\//;function l(L,w){if(!L.scheme&&w)throw new Error(`[UriError]: Scheme is missing: {scheme: "", authority: "${L.authority}", path: "${L.path}", query: "${L.query}", fragment: "${L.fragment}"}`);if(L.scheme&&!a.test(L.scheme))throw new Error("[UriError]: Scheme contains illegal characters.");if(L.path){if(L.authority){if(!s.test(L.path))throw new Error('[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character')}else if(o.test(L.path))throw new Error('[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")')}}const u="",c="/",d=/^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;class f{static isUri(w){return w instanceof f||!!w&&"string"==typeof w.authority&&"string"==typeof w.fragment&&"string"==typeof w.path&&"string"==typeof w.query&&"string"==typeof w.scheme&&"string"==typeof w.fsPath&&"function"==typeof w.with&&"function"==typeof w.toString}scheme;authority;path;query;fragment;constructor(w,g,b,M,O,x=false){"object"==typeof w?(this.scheme=w.scheme||u,this.authority=w.authority||u,this.path=w.path||u,this.query=w.query||u,this.fragment=w.fragment||u):(this.scheme=function(we,K){return we||K?we:"file"}(w,x),this.authority=g||u,this.path=function(we,K){switch(we){case"https":case"http":case"file":K?K[0]!==c&&(K=c+K):K=c}return K}(this.scheme,b||u),this.query=M||u,this.fragment=O||u,l(this,x))}get fsPath(){return E(this)}with(w){if(!w)return this;let{scheme:g,authority:b,path:M,query:O,fragment:x}=w;return void 0===g?g=this.scheme:null===g&&(g=u),void 0===b?b=this.authority:null===b&&(b=u),void 0===M?M=this.path:null===M&&(M=u),void 0===O?O=this.query:null===O&&(O=u),void 0===x?x=this.fragment:null===x&&(x=u),g===this.scheme&&b===this.authority&&M===this.path&&O===this.query&&x===this.fragment?this:new y(g,b,M,O,x)}static parse(w,g=false){const b=d.exec(w);return b?new y(b[2]||u,q(b[4]||u),q(b[5]||u),q(b[7]||u),q(b[9]||u),g):new y(u,u,u,u,u)}static file(w){let g=u;if(i&&(w=w.replace(/\\/g,c)),w[0]===c&&w[1]===c){const b=w.indexOf(c,2);-1===b?(g=w.substring(2),w=c):(g=w.substring(2,b),w=w.substring(b)||c)}return new y("file",g,w,u,u)}static from(w){const g=new y(w.scheme,w.authority,w.path,w.query,w.fragment);return l(g,true),g}toString(w=false){return C(this,w)}toJSON(){return this}static revive(w){if(w){if(w instanceof f)return w;{const g=new y(w);return g._formatted=w.external,g._fsPath=w._sep===p?w.fsPath:null,g}}return w}}const p=i?1:void 0;class y extends f{_formatted=null;_fsPath=null;get fsPath(){return this._fsPath||(this._fsPath=E(this)),this._fsPath}toString(w=false){return w?C(this,true):(this._formatted||(this._formatted=C(this,false)),this._formatted)}toJSON(){const w={$mid:1};return this._fsPath&&(w.fsPath=this._fsPath,w._sep=p),this._formatted&&(w.external=this._formatted),this.path&&(w.path=this.path),this.scheme&&(w.scheme=this.scheme),this.authority&&(w.authority=this.authority),this.query&&(w.query=this.query),this.fragment&&(w.fragment=this.fragment),w}}const v={58:"%3A",47:"%2F",63:"%3F",35:"%23",91:"%5B",93:"%5D",64:"%40",33:"%21",36:"%24",38:"%26",39:"%27",40:"%28",41:"%29",42:"%2A",43:"%2B",44:"%2C",59:"%3B",61:"%3D",32:"%20"};function k(L,w,g){let b,M=-1;for(let O=0;O<L.length;O++){const x=L.charCodeAt(O);if(x>=97&&x<=122||x>=65&&x<=90||x>=48&&x<=57||45===x||46===x||95===x||126===x||w&&47===x||g&&91===x||g&&93===x||g&&58===x)-1!==M&&(b+=encodeURIComponent(L.substring(M,O)),M=-1),void 0!==b&&(b+=L.charAt(O));else{void 0===b&&(b=L.substr(0,O));const we=v[x];void 0!==we?(-1!==M&&(b+=encodeURIComponent(L.substring(M,O)),M=-1),b+=we):-1===M&&(M=O)}}return-1!==M&&(b+=encodeURIComponent(L.substring(M))),void 0!==b?b:L}function $(L){let w;for(let g=0;g<L.length;g++){const b=L.charCodeAt(g);35===b||63===b?(void 0===w&&(w=L.substr(0,g)),w+=v[b]):void 0!==w&&(w+=L[g])}return void 0!==w?w:L}function E(L,w){let g;return g=L.authority&&L.path.length>1&&"file"===L.scheme?`//${L.authority}${L.path}`:47===L.path.charCodeAt(0)&&(L.path.charCodeAt(1)>=65&&L.path.charCodeAt(1)<=90||L.path.charCodeAt(1)>=97&&L.path.charCodeAt(1)<=122)&&58===L.path.charCodeAt(2)?L.path[1].toLowerCase()+L.path.substr(2):L.path,i&&(g=g.replace(/\//g,"\\")),g}function C(L,w){const g=w?$:k;let b="",{scheme:M,authority:O,path:x,query:we,fragment:K}=L;if(M&&(b+=M,b+=":"),(O||"file"===M)&&(b+=c,b+=c),O){let N=O.indexOf("@");if(-1!==N){const re=O.substr(0,N);O=O.substr(N+1),N=re.lastIndexOf(":"),-1===N?b+=g(re,false,false):(b+=g(re.substr(0,N),false,false),b+=":",b+=g(re.substr(N+1),false,true)),b+="@"}O=O.toLowerCase(),N=O.lastIndexOf(":"),-1===N?b+=g(O,false,true):(b+=g(O.substr(0,N),false,true),b+=O.substr(N))}if(x){if(x.length>=3&&47===x.charCodeAt(0)&&58===x.charCodeAt(2)){const N=x.charCodeAt(1);N>=65&&N<=90&&(x=`/${String.fromCharCode(N+32)}:${x.substr(3)}`)}else if(x.length>=2&&58===x.charCodeAt(1)){const N=x.charCodeAt(0);N>=65&&N<=90&&(x=`${String.fromCharCode(N+32)}:${x.substr(2)}`)}b+=g(x,true,false)}return we&&(b+="?",b+=g(we,false,false)),K&&(b+="#",b+=w?K:k(K,false,false)),b}function I(L){try{return decodeURIComponent(L)}catch{return L.length>3?L.substr(0,3)+I(L.substr(3)):L}}const Y=/(%[0-9A-Za-z][0-9A-Za-z])+/g;function q(L){return L.match(Y)?L.replace(Y,w=>I(w)):L}var J=n(470);const ne=J.posix||J,ae="/";var de;!function(L){L.joinPath=function(w,...g){return w.with({path:ne.join(w.path,...g)})},L.resolvePath=function(w,...g){let b=w.path,M=false;b[0]!==ae&&(b=ae+b,M=true);let O=ne.resolve(b,...g);return M&&O[0]===ae&&!w.authority&&(O=O.substring(1)),w.with({path:O})},L.dirname=function(w){if(0===w.path.length||w.path===ae)return w;let g=ne.dirname(w.path);return 1===g.length&&46===g.charCodeAt(0)&&(g=""),w.with({path:g})},L.basename=function(w){return ne.basename(w.path)},L.extname=function(w){return ne.extname(w.path)}}(de||(de={}))})(),wv=r})();const{URI:lt,Utils:ui}=wv;var Ue;(function(t){t.basename=ui.basename;t.dirname=ui.dirname;t.extname=ui.extname;t.joinPath=ui.joinPath;t.resolvePath=ui.resolvePath;function e(i,a){return(i===null||i===void 0?void 0:i.toString())===(a===null||a===void 0?void 0:a.toString())}t.equals=e;function n(i,a){const s=typeof i==="string"?i:i.path;const o=typeof a==="string"?a:a.path;const l=s.split("/").filter(p=>p.length>0);const u=o.split("/").filter(p=>p.length>0);let c=0;for(;c<l.length;c++){if(l[c]!==u[c]){break}}const d="../".repeat(l.length-c);const f=u.slice(c).join("/");return d+f}t.relative=n;function r(i){return lt.parse(i.toString()).toString()}t.normalize=r})(Ue||(Ue={}));var z;(function(t){t[t["Changed"]=0]="Changed";t[t["Parsed"]=1]="Parsed";t[t["IndexedContent"]=2]="IndexedContent";t[t["ComputedScopes"]=3]="ComputedScopes";t[t["Linked"]=4]="Linked";t[t["IndexedReferences"]=5]="IndexedReferences";t[t["Validated"]=6]="Validated"})(z||(z={}));class Cv{constructor(e){this.serviceRegistry=e.ServiceRegistry;this.textDocuments=e.workspace.TextDocuments;this.fileSystemProvider=e.workspace.FileSystemProvider}async fromUri(e,n=ye.CancellationToken.None){const r=await this.fileSystemProvider.readFile(e);return this.createAsync(e,r,n)}fromTextDocument(e,n,r){n=n!==null&&n!==void 0?n:lt.parse(e.uri);if(ye.CancellationToken.is(r)){return this.createAsync(n,e,r)}else{return this.create(n,e,r)}}fromString(e,n,r){if(ye.CancellationToken.is(r)){return this.createAsync(n,e,r)}else{return this.create(n,e,r)}}fromModel(e,n){return this.create(n,{$model:e})}create(e,n,r){if(typeof n==="string"){const i=this.parse(e,n,r);return this.createLangiumDocument(i,e,void 0,n)}else if("$model"in n){const i={value:n.$model,parserErrors:[],lexerErrors:[]};return this.createLangiumDocument(i,e)}else{const i=this.parse(e,n.getText(),r);return this.createLangiumDocument(i,e,n)}}async createAsync(e,n,r){if(typeof n==="string"){const i=await this.parseAsync(e,n,r);return this.createLangiumDocument(i,e,void 0,n)}else{const i=await this.parseAsync(e,n.getText(),r);return this.createLangiumDocument(i,e,n)}}createLangiumDocument(e,n,r,i){let a;if(r){a={parseResult:e,uri:n,state:z.Parsed,references:[],textDocument:r}}else{const s=this.createTextDocumentGetter(n,i);a={parseResult:e,uri:n,state:z.Parsed,references:[],get textDocument(){return s()}}}e.value.$document=a;return a}async update(e,n){var r,i;const a=(r=e.parseResult.value.$cstNode)===null||r===void 0?void 0:r.root.fullText;const s=(i=this.textDocuments)===null||i===void 0?void 0:i.get(e.uri.toString());const o=s?s.getText():await this.fileSystemProvider.readFile(e.uri);if(s){Object.defineProperty(e,"textDocument",{value:s})}else{const l=this.createTextDocumentGetter(e.uri,o);Object.defineProperty(e,"textDocument",{get:l})}if(a!==o){e.parseResult=await this.parseAsync(e.uri,o,n);e.parseResult.value.$document=e}e.state=z.Parsed;return e}parse(e,n,r){const i=this.serviceRegistry.getServices(e);return i.parser.LangiumParser.parse(n,r)}parseAsync(e,n,r){const i=this.serviceRegistry.getServices(e);return i.parser.AsyncParser.parse(n,r)}createTextDocumentGetter(e,n){const r=this.serviceRegistry;let i=void 0;return()=>{return i!==null&&i!==void 0?i:i=Du.create(e.toString(),r.getServices(e).LanguageMetaData.languageId,0,n!==null&&n!==void 0?n:"")}}}class dP{constructor(e){this.documentMap=new Map;this.langiumDocumentFactory=e.workspace.LangiumDocumentFactory;this.serviceRegistry=e.ServiceRegistry}get all(){return be(this.documentMap.values())}addDocument(e){const n=e.uri.toString();if(this.documentMap.has(n)){throw new Error(`A document with the URI '${n}' is already present.`)}this.documentMap.set(n,e)}getDocument(e){const n=e.toString();return this.documentMap.get(n)}async getOrCreateDocument(e,n){let r=this.getDocument(e);if(r){return r}r=await this.langiumDocumentFactory.fromUri(e,n);this.addDocument(r);return r}createDocument(e,n,r){if(r){return this.langiumDocumentFactory.fromString(n,e,r).then(i=>{this.addDocument(i);return i})}else{const i=this.langiumDocumentFactory.fromString(n,e);this.addDocument(i);return i}}hasDocument(e){return this.documentMap.has(e.toString())}invalidateDocument(e){const n=e.toString();const r=this.documentMap.get(n);if(r){const i=this.serviceRegistry.getServices(e).references.Linker;i.unlink(r);r.state=z.Changed;r.precomputedScopes=void 0;r.diagnostics=void 0}return r}deleteDocument(e){const n=e.toString();const r=this.documentMap.get(n);if(r){r.state=z.Changed;this.documentMap.delete(n)}return r}}const Ac=Symbol("ref_resolving");class fP{constructor(e){this.reflection=e.shared.AstReflection;this.langiumDocuments=()=>e.shared.workspace.LangiumDocuments;this.scopeProvider=e.references.ScopeProvider;this.astNodeLocator=e.workspace.AstNodeLocator}async link(e,n=ye.CancellationToken.None){for(const r of Yn(e.parseResult.value)){await ht(n);bg(r).forEach(i=>this.doLink(i,e))}}doLink(e,n){var r;const i=e.reference;if(i._ref===void 0){i._ref=Ac;try{const a=this.getCandidate(e);if(Gl(a)){i._ref=a}else{i._nodeDescription=a;if(this.langiumDocuments().hasDocument(a.documentUri)){const s=this.loadAstNode(a);i._ref=s!==null&&s!==void 0?s:this.createLinkingError(e,a)}else{i._ref=void 0}}}catch(a){console.error(`An error occurred while resolving reference to '${i.$refText}':`,a);const s=(r=a.message)!==null&&r!==void 0?r:String(a);i._ref=Object.assign(Object.assign({},e),{message:`An error occurred while resolving reference to '${i.$refText}': ${s}`})}n.references.push(i)}}unlink(e){for(const n of e.references){delete n._ref;delete n._nodeDescription}e.references=[]}getCandidate(e){const n=this.scopeProvider.getScope(e);const r=n.getElement(e.reference.$refText);return r!==null&&r!==void 0?r:this.createLinkingError(e)}buildReference(e,n,r,i){const a=this;const s={$refNode:r,$refText:i,get ref(){var o;if(rt(this._ref)){return this._ref}else if(mg(this._nodeDescription)){const l=a.loadAstNode(this._nodeDescription);this._ref=l!==null&&l!==void 0?l:a.createLinkingError({reference:s,container:e,property:n},this._nodeDescription)}else if(this._ref===void 0){this._ref=Ac;const l=lu(e).$document;const u=a.getLinkedNode({reference:s,container:e,property:n});if(u.error&&l&&l.state<z.ComputedScopes){return this._ref=void 0}this._ref=(o=u.node)!==null&&o!==void 0?o:u.error;this._nodeDescription=u.descr;l===null||l===void 0?void 0:l.references.push(this)}else if(this._ref===Ac){throw new Error(`Cyclic reference resolution detected: ${a.astNodeLocator.getAstNodePath(e)}/${n} (symbol '${i}')`)}return rt(this._ref)?this._ref:void 0},get $nodeDescription(){return this._nodeDescription},get error(){return Gl(this._ref)?this._ref:void 0}};return s}getLinkedNode(e){var n;try{const r=this.getCandidate(e);if(Gl(r)){return{error:r}}const i=this.loadAstNode(r);if(i){return{node:i,descr:r}}else{return{descr:r,error:this.createLinkingError(e,r)}}}catch(r){console.error(`An error occurred while resolving reference to '${e.reference.$refText}':`,r);const i=(n=r.message)!==null&&n!==void 0?n:String(r);return{error:Object.assign(Object.assign({},e),{message:`An error occurred while resolving reference to '${e.reference.$refText}': ${i}`})}}}loadAstNode(e){if(e.node){return e.node}const n=this.langiumDocuments().getDocument(e.documentUri);if(!n){return void 0}return this.astNodeLocator.getAstNode(n.parseResult.value,e.path)}createLinkingError(e,n){const r=lu(e.container).$document;if(r&&r.state<z.ComputedScopes){console.warn(`Attempted reference resolution before document reached ComputedScopes state (${r.uri}).`)}const i=this.reflection.getReferenceType(e);return Object.assign(Object.assign({},e),{message:`Could not resolve reference to ${i} named '${e.reference.$refText}'.`,targetDescription:n})}}function Sv(t){return typeof t.name==="string"}class Av{getName(e){if(Sv(e)){return e.name}return void 0}getNameNode(e){return cp(e.$cstNode,"name")}}class kv{constructor(e){this.nameProvider=e.references.NameProvider;this.index=e.shared.workspace.IndexManager;this.nodeLocator=e.workspace.AstNodeLocator}findDeclaration(e){if(e){const n=rT(e);const r=e.astNode;if(n&&r){const i=r[n.feature];if(on(i)){return i.ref}else if(Array.isArray(i)){for(const a of i){if(on(a)&&a.$refNode&&a.$refNode.offset<=e.offset&&a.$refNode.end>=e.end){return a.ref}}}}if(r){const i=this.nameProvider.getNameNode(r);if(i&&(i===e||E$(e,i))){return r}}}return void 0}findDeclarationNode(e){const n=this.findDeclaration(e);if(n===null||n===void 0?void 0:n.$cstNode){const r=this.nameProvider.getNameNode(n);return r!==null&&r!==void 0?r:n.$cstNode}return void 0}findReferences(e,n){const r=[];if(n.includeDeclaration){const a=this.getReferenceToSelf(e);if(a){r.push(a)}}let i=this.index.findAllReferences(e,this.nodeLocator.getAstNodePath(e));if(n.documentUri){i=i.filter(a=>Ue.equals(a.sourceUri,n.documentUri))}r.push(...i);return be(r)}getReferenceToSelf(e){const n=this.nameProvider.getNameNode(e);if(n){const r=yt(e);const i=this.nodeLocator.getAstNodePath(e);return{sourceUri:r.uri,sourcePath:i,targetUri:r.uri,targetPath:i,segment:ou(n),local:true}}return void 0}}class Ou{constructor(e){this.map=new Map;if(e){for(const[n,r]of e){this.add(n,r)}}}get size(){return Dd.sum(be(this.map.values()).map(e=>e.length))}clear(){this.map.clear()}delete(e,n){if(n===void 0){return this.map.delete(e)}else{const r=this.map.get(e);if(r){const i=r.indexOf(n);if(i>=0){if(r.length===1){this.map.delete(e)}else{r.splice(i,1)}return true}}return false}}get(e){var n;return(n=this.map.get(e))!==null&&n!==void 0?n:[]}has(e,n){if(n===void 0){return this.map.has(e)}else{const r=this.map.get(e);if(r){return r.indexOf(n)>=0}return false}}add(e,n){if(this.map.has(e)){this.map.get(e).push(n)}else{this.map.set(e,[n])}return this}addAll(e,n){if(this.map.has(e)){this.map.get(e).push(...n)}else{this.map.set(e,Array.from(n))}return this}forEach(e){this.map.forEach((n,r)=>n.forEach(i=>e(i,r,this)))}[Symbol.iterator](){return this.entries().iterator()}entries(){return be(this.map.entries()).flatMap(([e,n])=>n.map(r=>[e,r]))}keys(){return be(this.map.keys())}values(){return be(this.map.values()).flat()}entriesGroupedByKey(){return be(this.map.entries())}}class hh{get size(){return this.map.size}constructor(e){this.map=new Map;this.inverse=new Map;if(e){for(const[n,r]of e){this.set(n,r)}}}clear(){this.map.clear();this.inverse.clear()}set(e,n){this.map.set(e,n);this.inverse.set(n,e);return this}get(e){return this.map.get(e)}getKey(e){return this.inverse.get(e)}delete(e){const n=this.map.get(e);if(n!==void 0){this.map.delete(e);this.inverse.delete(n);return true}return false}}class bv{constructor(e){this.nameProvider=e.references.NameProvider;this.descriptions=e.workspace.AstNodeDescriptionProvider}async computeExports(e,n=ye.CancellationToken.None){return this.computeExportsForNode(e.parseResult.value,e,void 0,n)}async computeExportsForNode(e,n,r=Uu,i=ye.CancellationToken.None){const a=[];this.exportNode(e,a,n);for(const s of r(e)){await ht(i);this.exportNode(s,a,n)}return a}exportNode(e,n,r){const i=this.nameProvider.getName(e);if(i){n.push(this.descriptions.createDescription(e,i,r))}}async computeLocalScopes(e,n=ye.CancellationToken.None){const r=e.parseResult.value;const i=new Ou;for(const a of Nr(r)){await ht(n);this.processNode(a,e,i)}return i}processNode(e,n,r){const i=e.$container;if(i){const a=this.nameProvider.getName(e);if(a){r.add(i,this.descriptions.createDescription(e,a,n))}}}}class yh{constructor(e,n,r){var i;this.elements=e;this.outerScope=n;this.caseInsensitive=(i=r===null||r===void 0?void 0:r.caseInsensitive)!==null&&i!==void 0?i:false}getAllElements(){if(this.outerScope){return this.elements.concat(this.outerScope.getAllElements())}else{return this.elements}}getElement(e){const n=this.caseInsensitive?this.elements.find(r=>r.name.toLowerCase()===e.toLowerCase()):this.elements.find(r=>r.name===e);if(n){return n}if(this.outerScope){return this.outerScope.getElement(e)}return void 0}}class Nv{constructor(e,n,r){var i;this.elements=new Map;this.caseInsensitive=(i=r===null||r===void 0?void 0:r.caseInsensitive)!==null&&i!==void 0?i:false;for(const a of e){const s=this.caseInsensitive?a.name.toLowerCase():a.name;this.elements.set(s,a)}this.outerScope=n}getElement(e){const n=this.caseInsensitive?e.toLowerCase():e;const r=this.elements.get(n);if(r){return r}if(this.outerScope){return this.outerScope.getElement(e)}return void 0}getAllElements(){let e=be(this.elements.values());if(this.outerScope){e=e.concat(this.outerScope.getAllElements())}return e}}const pP={getElement(){return void 0},getAllElements(){return gg}};class Pv{constructor(){this.toDispose=[];this.isDisposed=false}onDispose(e){this.toDispose.push(e)}dispose(){this.throwIfDisposed();this.clear();this.isDisposed=true;this.toDispose.forEach(e=>e.dispose())}throwIfDisposed(){if(this.isDisposed){throw new Error("This cache has already been disposed")}}}class mP extends Pv{constructor(){super(...arguments);this.cache=new Map}has(e){this.throwIfDisposed();return this.cache.has(e)}set(e,n){this.throwIfDisposed();this.cache.set(e,n)}get(e,n){this.throwIfDisposed();if(this.cache.has(e)){return this.cache.get(e)}else if(n){const r=n();this.cache.set(e,r);return r}else{return void 0}}delete(e){this.throwIfDisposed();return this.cache.delete(e)}clear(){this.throwIfDisposed();this.cache.clear()}}class _v extends Pv{constructor(e){super();this.cache=new Map;this.converter=e!==null&&e!==void 0?e:n=>n}has(e,n){this.throwIfDisposed();return this.cacheForContext(e).has(n)}set(e,n,r){this.throwIfDisposed();this.cacheForContext(e).set(n,r)}get(e,n,r){this.throwIfDisposed();const i=this.cacheForContext(e);if(i.has(n)){return i.get(n)}else if(r){const a=r();i.set(n,a);return a}else{return void 0}}delete(e,n){this.throwIfDisposed();return this.cacheForContext(e).delete(n)}clear(e){this.throwIfDisposed();if(e){const n=this.converter(e);this.cache.delete(n)}else{this.cache.clear()}}cacheForContext(e){const n=this.converter(e);let r=this.cache.get(n);if(!r){r=new Map;this.cache.set(n,r)}return r}}class hP extends _v{constructor(e,n){super(r=>r.toString());if(n){this.toDispose.push(e.workspace.DocumentBuilder.onDocumentPhase(n,r=>{this.clear(r.uri.toString())}));this.toDispose.push(e.workspace.DocumentBuilder.onUpdate((r,i)=>{for(const a of i){this.clear(a)}}))}else{this.toDispose.push(e.workspace.DocumentBuilder.onUpdate((r,i)=>{const a=r.concat(i);for(const s of a){this.clear(s)}}))}}}class yP extends mP{constructor(e,n){super();if(n){this.toDispose.push(e.workspace.DocumentBuilder.onBuildPhase(n,()=>{this.clear()}));this.toDispose.push(e.workspace.DocumentBuilder.onUpdate((r,i)=>{if(i.length>0){this.clear()}}))}else{this.toDispose.push(e.workspace.DocumentBuilder.onUpdate(()=>{this.clear()}))}}}class Dv{constructor(e){this.reflection=e.shared.AstReflection;this.nameProvider=e.references.NameProvider;this.descriptions=e.workspace.AstNodeDescriptionProvider;this.indexManager=e.shared.workspace.IndexManager;this.globalScopeCache=new yP(e.shared)}getScope(e){const n=[];const r=this.reflection.getReferenceType(e);const i=yt(e.container).precomputedScopes;if(i){let s=e.container;do{const o=i.get(s);if(o.length>0){n.push(be(o).filter(l=>this.reflection.isSubtype(l.type,r)))}s=s.$container}while(s)}let a=this.getGlobalScope(r,e);for(let s=n.length-1;s>=0;s--){a=this.createScope(n[s],a)}return a}createScope(e,n,r){return new yh(be(e),n,r)}createScopeForNodes(e,n,r){const i=be(e).map(a=>{const s=this.nameProvider.getName(a);if(s){return this.descriptions.createDescription(a,s)}return void 0}).nonNullable();return new yh(i,n,r)}getGlobalScope(e,n){return this.globalScopeCache.get(e,()=>new Nv(this.indexManager.allElements(e)))}}function gP(t){return typeof t.$comment==="string"}function gh(t){return typeof t==="object"&&!!t&&("$ref"in t||"$error"in t)}class RP{constructor(e){this.ignoreProperties=new Set(["$container","$containerProperty","$containerIndex","$document","$cstNode"]);this.langiumDocuments=e.shared.workspace.LangiumDocuments;this.astNodeLocator=e.workspace.AstNodeLocator;this.nameProvider=e.references.NameProvider;this.commentProvider=e.documentation.CommentProvider}serialize(e,n){const r=n!==null&&n!==void 0?n:{};const i=n===null||n===void 0?void 0:n.replacer;const a=(o,l)=>this.replacer(o,l,r);const s=i?(o,l)=>i(o,l,a):a;try{this.currentDocument=yt(e);return JSON.stringify(e,s,n===null||n===void 0?void 0:n.space)}finally{this.currentDocument=void 0}}deserialize(e,n){const r=n!==null&&n!==void 0?n:{};const i=JSON.parse(e);this.linkNode(i,i,r);return i}replacer(e,n,{refText:r,sourceText:i,textRegions:a,comments:s,uriConverter:o}){var l,u,c,d;if(this.ignoreProperties.has(e)){return void 0}else if(on(n)){const f=n.ref;const p=r?n.$refText:void 0;if(f){const y=yt(f);let v="";if(this.currentDocument&&this.currentDocument!==y){if(o){v=o(y.uri,n)}else{v=y.uri.toString()}}const k=this.astNodeLocator.getAstNodePath(f);return{$ref:`${v}#${k}`,$refText:p}}else{return{$error:(u=(l=n.error)===null||l===void 0?void 0:l.message)!==null&&u!==void 0?u:"Could not resolve reference",$refText:p}}}else if(rt(n)){let f=void 0;if(a){f=this.addAstNodeRegionWithAssignmentsTo(Object.assign({},n));if((!e||n.$document)&&(f===null||f===void 0?void 0:f.$textRegion)){f.$textRegion.documentURI=(c=this.currentDocument)===null||c===void 0?void 0:c.uri.toString()}}if(i&&!e){f!==null&&f!==void 0?f:f=Object.assign({},n);f.$sourceText=(d=n.$cstNode)===null||d===void 0?void 0:d.text}if(s){f!==null&&f!==void 0?f:f=Object.assign({},n);const p=this.commentProvider.getComment(n);if(p){f.$comment=p.replace(/\r/g,"")}}return f!==null&&f!==void 0?f:n}else{return n}}addAstNodeRegionWithAssignmentsTo(e){const n=r=>({offset:r.offset,end:r.end,length:r.length,range:r.range});if(e.$cstNode){const r=e.$textRegion=n(e.$cstNode);const i=r.assignments={};Object.keys(e).filter(a=>!a.startsWith("$")).forEach(a=>{const s=Ig(e.$cstNode,a).map(n);if(s.length!==0){i[a]=s}});return e}return void 0}linkNode(e,n,r,i,a,s){for(const[l,u]of Object.entries(e)){if(Array.isArray(u)){for(let c=0;c<u.length;c++){const d=u[c];if(gh(d)){u[c]=this.reviveReference(e,l,n,d,r)}else if(rt(d)){this.linkNode(d,n,r,e,l,c)}}}else if(gh(u)){e[l]=this.reviveReference(e,l,n,u,r)}else if(rt(u)){this.linkNode(u,n,r,e,l)}}const o=e;o.$container=i;o.$containerProperty=a;o.$containerIndex=s}reviveReference(e,n,r,i,a){let s=i.$refText;let o=i.$error;if(i.$ref){const l=this.getRefNode(r,i.$ref,a.uriConverter);if(rt(l)){if(!s){s=this.nameProvider.getName(l)}return{$refText:s!==null&&s!==void 0?s:"",ref:l}}else{o=l}}if(o){const l={$refText:s!==null&&s!==void 0?s:""};l.error={container:e,property:n,message:o,reference:l};return l}else{return void 0}}getRefNode(e,n,r){try{const i=n.indexOf("#");if(i===0){const l=this.astNodeLocator.getAstNode(e,n.substring(1));if(!l){return"Could not resolve path: "+n}return l}if(i<0){const l=r?r(n):lt.parse(n);const u=this.langiumDocuments.getDocument(l);if(!u){return"Could not find document for URI: "+n}return u.parseResult.value}const a=r?r(n.substring(0,i)):lt.parse(n.substring(0,i));const s=this.langiumDocuments.getDocument(a);if(!s){return"Could not find document for URI: "+n}if(i===n.length-1){return s.parseResult.value}const o=this.astNodeLocator.getAstNode(s.parseResult.value,n.substring(i+1));if(!o){return"Could not resolve URI: "+n}return o}catch(i){return String(i)}}}class vP{get map(){return this.fileExtensionMap}constructor(e){this.languageIdMap=new Map;this.fileExtensionMap=new Map;this.textDocuments=e===null||e===void 0?void 0:e.workspace.TextDocuments}register(e){const n=e.LanguageMetaData;for(const r of n.fileExtensions){if(this.fileExtensionMap.has(r)){console.warn(`The file extension ${r} is used by multiple languages. It is now assigned to '${n.languageId}'.`)}this.fileExtensionMap.set(r,e)}this.languageIdMap.set(n.languageId,e);if(this.languageIdMap.size===1){this.singleton=e}else{this.singleton=void 0}}getServices(e){var n,r;if(this.singleton!==void 0){return this.singleton}if(this.languageIdMap.size===0){throw new Error("The service registry is empty. Use `register` to register the services of a language.")}const i=(r=(n=this.textDocuments)===null||n===void 0?void 0:n.get(e))===null||r===void 0?void 0:r.languageId;if(i!==void 0){const o=this.languageIdMap.get(i);if(o){return o}}const a=Ue.extname(e);const s=this.fileExtensionMap.get(a);if(!s){if(i){throw new Error(`The service registry contains no services for the extension '${a}' for language '${i}'.`)}else{throw new Error(`The service registry contains no services for the extension '${a}'.`)}}return s}hasServices(e){try{this.getServices(e);return true}catch(n){return false}}get all(){return Array.from(this.languageIdMap.values())}}function Ta(t){return{code:t}}var Iu;(function(t){t.all=["fast","slow","built-in"]})(Iu||(Iu={}));class $P{constructor(e){this.entries=new Ou;this.entriesBefore=[];this.entriesAfter=[];this.reflection=e.shared.AstReflection}register(e,n=this,r="fast"){if(r==="built-in"){throw new Error("The 'built-in' category is reserved for lexer, parser, and linker errors.")}for(const[i,a]of Object.entries(e)){const s=a;if(Array.isArray(s)){for(const o of s){const l={check:this.wrapValidationException(o,n),category:r};this.addEntry(i,l)}}else if(typeof s==="function"){const o={check:this.wrapValidationException(s,n),category:r};this.addEntry(i,o)}else{Qa()}}}wrapValidationException(e,n){return async(r,i,a)=>{await this.handleException(()=>e.call(n,r,i,a),"An error occurred during validation",i,r)}}async handleException(e,n,r,i){try{await e()}catch(a){if(ds(a)){throw a}console.error(`${n}:`,a);if(a instanceof Error&&a.stack){console.error(a.stack)}const s=a instanceof Error?a.message:String(a);r("error",`${n}: ${s}`,{node:i})}}addEntry(e,n){if(e==="AstNode"){this.entries.add("AstNode",n);return}for(const r of this.reflection.getAllSubTypes(e)){this.entries.add(r,n)}}getChecks(e,n){let r=be(this.entries.get(e)).concat(this.entries.get("AstNode"));if(n){r=r.filter(i=>n.includes(i.category))}return r.map(i=>i.check)}registerBeforeDocument(e,n=this){this.entriesBefore.push(this.wrapPreparationException(e,"An error occurred during set-up of the validation",n))}registerAfterDocument(e,n=this){this.entriesAfter.push(this.wrapPreparationException(e,"An error occurred during tear-down of the validation",n))}wrapPreparationException(e,n,r){return async(i,a,s,o)=>{await this.handleException(()=>e.call(r,i,a,s,o),n,a,i)}}get checksBefore(){return this.entriesBefore}get checksAfter(){return this.entriesAfter}}class Ov{constructor(e){this.validationRegistry=e.validation.ValidationRegistry;this.metadata=e.LanguageMetaData}async validateDocument(e,n={},r=ye.CancellationToken.None){const i=e.parseResult;const a=[];await ht(r);if(!n.categories||n.categories.includes("built-in")){this.processLexingErrors(i,a,n);if(n.stopAfterLexingErrors&&a.some(s=>{var o;return((o=s.data)===null||o===void 0?void 0:o.code)===qt.LexingError})){return a}this.processParsingErrors(i,a,n);if(n.stopAfterParsingErrors&&a.some(s=>{var o;return((o=s.data)===null||o===void 0?void 0:o.code)===qt.ParsingError})){return a}this.processLinkingErrors(e,a,n);if(n.stopAfterLinkingErrors&&a.some(s=>{var o;return((o=s.data)===null||o===void 0?void 0:o.code)===qt.LinkingError})){return a}}try{a.push(...await this.validateAst(i.value,n,r))}catch(s){if(ds(s)){throw s}console.error("An error occurred during validation:",s)}await ht(r);return a}processLexingErrors(e,n,r){var i,a,s;const o=[...e.lexerErrors,...(a=(i=e.lexerReport)===null||i===void 0?void 0:i.diagnostics)!==null&&a!==void 0?a:[]];for(const l of o){const u=(s=l.severity)!==null&&s!==void 0?s:"error";const c={severity:kc(u),range:{start:{line:l.line-1,character:l.column-1},end:{line:l.line-1,character:l.column+l.length-1}},message:l.message,data:EP(u),source:this.getSource()};n.push(c)}}processParsingErrors(e,n,r){for(const i of e.parserErrors){let a=void 0;if(isNaN(i.token.startOffset)){if("previousToken"in i){const s=i.previousToken;if(!isNaN(s.startOffset)){const o={line:s.endLine-1,character:s.endColumn};a={start:o,end:o}}else{const o={line:0,character:0};a={start:o,end:o}}}}else{a=Od(i.token)}if(a){const s={severity:kc("error"),range:a,message:i.message,data:Ta(qt.ParsingError),source:this.getSource()};n.push(s)}}}processLinkingErrors(e,n,r){for(const i of e.references){const a=i.error;if(a){const s={node:a.container,property:a.property,index:a.index,data:{code:qt.LinkingError,containerType:a.container.$type,property:a.property,refText:a.reference.$refText}};n.push(this.toDiagnostic("error",a.message,s))}}}async validateAst(e,n,r=ye.CancellationToken.None){const i=[];const a=(s,o,l)=>{i.push(this.toDiagnostic(s,o,l))};await this.validateAstBefore(e,n,a,r);await this.validateAstNodes(e,n,a,r);await this.validateAstAfter(e,n,a,r);return i}async validateAstBefore(e,n,r,i=ye.CancellationToken.None){var a;const s=this.validationRegistry.checksBefore;for(const o of s){await ht(i);await o(e,r,(a=n.categories)!==null&&a!==void 0?a:[],i)}}async validateAstNodes(e,n,r,i=ye.CancellationToken.None){await Promise.all(Yn(e).map(async a=>{await ht(i);const s=this.validationRegistry.getChecks(a.$type,n.categories);for(const o of s){await o(a,r,i)}}))}async validateAstAfter(e,n,r,i=ye.CancellationToken.None){var a;const s=this.validationRegistry.checksAfter;for(const o of s){await ht(i);await o(e,r,(a=n.categories)!==null&&a!==void 0?a:[],i)}}toDiagnostic(e,n,r){return{message:n,range:TP(r),severity:kc(e),code:r.code,codeDescription:r.codeDescription,tags:r.tags,relatedInformation:r.relatedInformation,data:r.data,source:this.getSource()}}getSource(){return this.metadata.languageId}}function TP(t){if(t.range){return t.range}let e;if(typeof t.property==="string"){e=cp(t.node.$cstNode,t.property,t.index)}else if(typeof t.keyword==="string"){e=Lg(t.node.$cstNode,t.keyword,t.index)}e!==null&&e!==void 0?e:e=t.node.$cstNode;if(!e){return{start:{line:0,character:0},end:{line:0,character:0}}}return e.range}function kc(t){switch(t){case"error":return 1;case"warning":return 2;case"info":return 3;case"hint":return 4;default:throw new Error("Invalid diagnostic severity: "+t)}}function EP(t){switch(t){case"error":return Ta(qt.LexingError);case"warning":return Ta(qt.LexingWarning);case"info":return Ta(qt.LexingInfo);case"hint":return Ta(qt.LexingHint);default:throw new Error("Invalid diagnostic severity: "+t)}}var qt;(function(t){t.LexingError="lexing-error";t.LexingWarning="lexing-warning";t.LexingInfo="lexing-info";t.LexingHint="lexing-hint";t.ParsingError="parsing-error";t.LinkingError="linking-error"})(qt||(qt={}));class wP{constructor(e){this.astNodeLocator=e.workspace.AstNodeLocator;this.nameProvider=e.references.NameProvider}createDescription(e,n,r){const i=r!==null&&r!==void 0?r:yt(e);n!==null&&n!==void 0?n:n=this.nameProvider.getName(e);const a=this.astNodeLocator.getAstNodePath(e);if(!n){throw new Error(`Node at path ${a} has no name.`)}let s;const o=()=>{var l;return s!==null&&s!==void 0?s:s=ou((l=this.nameProvider.getNameNode(e))!==null&&l!==void 0?l:e.$cstNode)};return{node:e,name:n,get nameSegment(){return o()},selectionSegment:ou(e.$cstNode),type:e.$type,documentUri:i.uri,path:a}}}class CP{constructor(e){this.nodeLocator=e.workspace.AstNodeLocator}async createDescriptions(e,n=ye.CancellationToken.None){const r=[];const i=e.parseResult.value;for(const a of Yn(i)){await ht(n);bg(a).filter(s=>!Gl(s)).forEach(s=>{const o=this.createDescription(s);if(o){r.push(o)}})}return r}createDescription(e){const n=e.reference.$nodeDescription;const r=e.reference.$refNode;if(!n||!r){return void 0}const i=yt(e.container).uri;return{sourceUri:i,sourcePath:this.nodeLocator.getAstNodePath(e.container),targetUri:n.documentUri,targetPath:n.path,segment:ou(r),local:Ue.equals(n.documentUri,i)}}}class SP{constructor(){this.segmentSeparator="/";this.indexSeparator="@"}getAstNodePath(e){if(e.$container){const n=this.getAstNodePath(e.$container);const r=this.getPathSegment(e);const i=n+this.segmentSeparator+r;return i}return""}getPathSegment({$containerProperty:e,$containerIndex:n}){if(!e){throw new Error("Missing '$containerProperty' in AST node.")}if(n!==void 0){return e+this.indexSeparator+n}return e}getAstNode(e,n){const r=n.split(this.segmentSeparator);return r.reduce((i,a)=>{if(!i||a.length===0){return i}const s=a.indexOf(this.indexSeparator);if(s>0){const o=a.substring(0,s);const l=parseInt(a.substring(s+1));const u=i[o];return u===null||u===void 0?void 0:u[l]}return i[a]},e)}}var AP=$v();class kP{constructor(e){this._ready=new jp;this.settings={};this.workspaceConfig=false;this.onConfigurationSectionUpdateEmitter=new AP.Emitter;this.serviceRegistry=e.ServiceRegistry}get ready(){return this._ready.promise}initialize(e){var n,r;this.workspaceConfig=(r=(n=e.capabilities.workspace)===null||n===void 0?void 0:n.configuration)!==null&&r!==void 0?r:false}async initialized(e){if(this.workspaceConfig){if(e.register){const n=this.serviceRegistry.all;e.register({section:n.map(r=>this.toSectionName(r.LanguageMetaData.languageId))})}if(e.fetchConfiguration){const n=this.serviceRegistry.all.map(i=>({section:this.toSectionName(i.LanguageMetaData.languageId)}));const r=await e.fetchConfiguration(n);n.forEach((i,a)=>{this.updateSectionConfiguration(i.section,r[a])})}}this._ready.resolve()}updateConfiguration(e){if(!e.settings){return}Object.keys(e.settings).forEach(n=>{const r=e.settings[n];this.updateSectionConfiguration(n,r);this.onConfigurationSectionUpdateEmitter.fire({section:n,configuration:r})})}updateSectionConfiguration(e,n){this.settings[e]=n}async getConfiguration(e,n){await this.ready;const r=this.toSectionName(e);if(this.settings[r]){return this.settings[r][n]}}toSectionName(e){return`${e}`}get onConfigurationSectionUpdate(){return this.onConfigurationSectionUpdateEmitter.event}}var xa;(function(t){function e(n){return{dispose:async()=>await n()}}t.create=e})(xa||(xa={}));class bP{constructor(e){this.updateBuildOptions={validation:{categories:["built-in","fast"]}};this.updateListeners=[];this.buildPhaseListeners=new Ou;this.documentPhaseListeners=new Ou;this.buildState=new Map;this.documentBuildWaiters=new Map;this.currentState=z.Changed;this.langiumDocuments=e.workspace.LangiumDocuments;this.langiumDocumentFactory=e.workspace.LangiumDocumentFactory;this.textDocuments=e.workspace.TextDocuments;this.indexManager=e.workspace.IndexManager;this.serviceRegistry=e.ServiceRegistry}async build(e,n={},r=ye.CancellationToken.None){var i,a;for(const s of e){const o=s.uri.toString();if(s.state===z.Validated){if(typeof n.validation==="boolean"&&n.validation){s.state=z.IndexedReferences;s.diagnostics=void 0;this.buildState.delete(o)}else if(typeof n.validation==="object"){const l=this.buildState.get(o);const u=(i=l===null||l===void 0?void 0:l.result)===null||i===void 0?void 0:i.validationChecks;if(u){const c=(a=n.validation.categories)!==null&&a!==void 0?a:Iu.all;const d=c.filter(f=>!u.includes(f));if(d.length>0){this.buildState.set(o,{completed:false,options:{validation:Object.assign(Object.assign({},n.validation),{categories:d})},result:l.result});s.state=z.IndexedReferences}}}}else{this.buildState.delete(o)}}this.currentState=z.Changed;await this.emitUpdate(e.map(s=>s.uri),[]);await this.buildDocuments(e,n,r)}async update(e,n,r=ye.CancellationToken.None){this.currentState=z.Changed;for(const s of n){this.langiumDocuments.deleteDocument(s);this.buildState.delete(s.toString());this.indexManager.remove(s)}for(const s of e){const o=this.langiumDocuments.invalidateDocument(s);if(!o){const l=this.langiumDocumentFactory.fromModel({$type:"INVALID"},s);l.state=z.Changed;this.langiumDocuments.addDocument(l)}this.buildState.delete(s.toString())}const i=be(e).concat(n).map(s=>s.toString()).toSet();this.langiumDocuments.all.filter(s=>!i.has(s.uri.toString())&&this.shouldRelink(s,i)).forEach(s=>{const o=this.serviceRegistry.getServices(s.uri).references.Linker;o.unlink(s);s.state=Math.min(s.state,z.ComputedScopes);s.diagnostics=void 0});await this.emitUpdate(e,n);await ht(r);const a=this.sortDocuments(this.langiumDocuments.all.filter(s=>{var o;return s.state<z.Linked||!((o=this.buildState.get(s.uri.toString()))===null||o===void 0?void 0:o.completed)}).toArray());await this.buildDocuments(a,this.updateBuildOptions,r)}async emitUpdate(e,n){await Promise.all(this.updateListeners.map(r=>r(e,n)))}sortDocuments(e){let n=0;let r=e.length-1;while(n<r){while(n<e.length&&this.hasTextDocument(e[n])){n++}while(r>=0&&!this.hasTextDocument(e[r])){r--}if(n<r){[e[n],e[r]]=[e[r],e[n]]}}return e}hasTextDocument(e){var n;return Boolean((n=this.textDocuments)===null||n===void 0?void 0:n.get(e.uri))}shouldRelink(e,n){if(e.references.some(r=>r.error!==void 0)){return true}return this.indexManager.isAffected(e,n)}onUpdate(e){this.updateListeners.push(e);return xa.create(()=>{const n=this.updateListeners.indexOf(e);if(n>=0){this.updateListeners.splice(n,1)}})}async buildDocuments(e,n,r){this.prepareBuild(e,n);await this.runCancelable(e,z.Parsed,r,a=>this.langiumDocumentFactory.update(a,r));await this.runCancelable(e,z.IndexedContent,r,a=>this.indexManager.updateContent(a,r));await this.runCancelable(e,z.ComputedScopes,r,async a=>{const s=this.serviceRegistry.getServices(a.uri).references.ScopeComputation;a.precomputedScopes=await s.computeLocalScopes(a,r)});await this.runCancelable(e,z.Linked,r,a=>{const s=this.serviceRegistry.getServices(a.uri).references.Linker;return s.link(a,r)});await this.runCancelable(e,z.IndexedReferences,r,a=>this.indexManager.updateReferences(a,r));const i=e.filter(a=>this.shouldValidate(a));await this.runCancelable(i,z.Validated,r,a=>this.validate(a,r));for(const a of e){const s=this.buildState.get(a.uri.toString());if(s){s.completed=true}}}prepareBuild(e,n){for(const r of e){const i=r.uri.toString();const a=this.buildState.get(i);if(!a||a.completed){this.buildState.set(i,{completed:false,options:n,result:a===null||a===void 0?void 0:a.result})}}}async runCancelable(e,n,r,i){const a=e.filter(o=>o.state<n);for(const o of a){await ht(r);await i(o);o.state=n;await this.notifyDocumentPhase(o,n,r)}const s=e.filter(o=>o.state===n);await this.notifyBuildPhase(s,n,r);this.currentState=n}onBuildPhase(e,n){this.buildPhaseListeners.add(e,n);return xa.create(()=>{this.buildPhaseListeners.delete(e,n)})}onDocumentPhase(e,n){this.documentPhaseListeners.add(e,n);return xa.create(()=>{this.documentPhaseListeners.delete(e,n)})}waitUntil(e,n,r){let i=void 0;if(n&&"path"in n){i=n}else{r=n}r!==null&&r!==void 0?r:r=ye.CancellationToken.None;if(i){const a=this.langiumDocuments.getDocument(i);if(a&&a.state>e){return Promise.resolve(i)}}if(this.currentState>=e){return Promise.resolve(void 0)}else if(r.isCancellationRequested){return Promise.reject(_u)}return new Promise((a,s)=>{const o=this.onBuildPhase(e,()=>{o.dispose();l.dispose();if(i){const u=this.langiumDocuments.getDocument(i);a(u===null||u===void 0?void 0:u.uri)}else{a(void 0)}});const l=r.onCancellationRequested(()=>{o.dispose();l.dispose();s(_u)})})}async notifyDocumentPhase(e,n,r){const i=this.documentPhaseListeners.get(n);const a=i.slice();for(const s of a){try{await s(e,r)}catch(o){if(!ds(o)){throw o}}}}async notifyBuildPhase(e,n,r){if(e.length===0){return}const i=this.buildPhaseListeners.get(n);const a=i.slice();for(const s of a){await ht(r);await s(e,r)}}shouldValidate(e){return Boolean(this.getBuildOptions(e).validation)}async validate(e,n){var r,i;const a=this.serviceRegistry.getServices(e.uri).validation.DocumentValidator;const s=this.getBuildOptions(e).validation;const o=typeof s==="object"?s:void 0;const l=await a.validateDocument(e,o,n);if(e.diagnostics){e.diagnostics.push(...l)}else{e.diagnostics=l}const u=this.buildState.get(e.uri.toString());if(u){(r=u.result)!==null&&r!==void 0?r:u.result={};const c=(i=o===null||o===void 0?void 0:o.categories)!==null&&i!==void 0?i:Iu.all;if(u.result.validationChecks){u.result.validationChecks.push(...c)}else{u.result.validationChecks=[...c]}}}getBuildOptions(e){var n,r;return(r=(n=this.buildState.get(e.uri.toString()))===null||n===void 0?void 0:n.options)!==null&&r!==void 0?r:{}}}class Iv{constructor(e){this.symbolIndex=new Map;this.symbolByTypeIndex=new _v;this.referenceIndex=new Map;this.documents=e.workspace.LangiumDocuments;this.serviceRegistry=e.ServiceRegistry;this.astReflection=e.AstReflection}findAllReferences(e,n){const r=yt(e).uri;const i=[];this.referenceIndex.forEach(a=>{a.forEach(s=>{if(Ue.equals(s.targetUri,r)&&s.targetPath===n){i.push(s)}})});return be(i)}allElements(e,n){let r=be(this.symbolIndex.keys());if(n){r=r.filter(i=>!n||n.has(i))}return r.map(i=>this.getFileDescriptions(i,e)).flat()}getFileDescriptions(e,n){var r;if(!n){return(r=this.symbolIndex.get(e))!==null&&r!==void 0?r:[]}const i=this.symbolByTypeIndex.get(e,n,()=>{var a;const s=(a=this.symbolIndex.get(e))!==null&&a!==void 0?a:[];return s.filter(o=>this.astReflection.isSubtype(o.type,n))});return i}remove(e){const n=e.toString();this.symbolIndex.delete(n);this.symbolByTypeIndex.clear(n);this.referenceIndex.delete(n)}async updateContent(e,n=ye.CancellationToken.None){const r=this.serviceRegistry.getServices(e.uri);const i=await r.references.ScopeComputation.computeExports(e,n);const a=e.uri.toString();this.symbolIndex.set(a,i);this.symbolByTypeIndex.clear(a)}async updateReferences(e,n=ye.CancellationToken.None){const r=this.serviceRegistry.getServices(e.uri);const i=await r.workspace.ReferenceDescriptionProvider.createDescriptions(e,n);this.referenceIndex.set(e.uri.toString(),i)}isAffected(e,n){const r=this.referenceIndex.get(e.uri.toString());if(!r){return false}return r.some(i=>!i.local&&n.has(i.targetUri.toString()))}}class Lv{constructor(e){this.initialBuildOptions={};this._ready=new jp;this.serviceRegistry=e.ServiceRegistry;this.langiumDocuments=e.workspace.LangiumDocuments;this.documentBuilder=e.workspace.DocumentBuilder;this.fileSystemProvider=e.workspace.FileSystemProvider;this.mutex=e.workspace.WorkspaceLock}get ready(){return this._ready.promise}get workspaceFolders(){return this.folders}initialize(e){var n;this.folders=(n=e.workspaceFolders)!==null&&n!==void 0?n:void 0}initialized(e){return this.mutex.write(n=>{var r;return this.initializeWorkspace((r=this.folders)!==null&&r!==void 0?r:[],n)})}async initializeWorkspace(e,n=ye.CancellationToken.None){const r=await this.performStartup(e);await ht(n);await this.documentBuilder.build(r,this.initialBuildOptions,n)}async performStartup(e){const n=this.serviceRegistry.all.flatMap(a=>a.LanguageMetaData.fileExtensions);const r=[];const i=a=>{r.push(a);if(!this.langiumDocuments.hasDocument(a.uri)){this.langiumDocuments.addDocument(a)}};await this.loadAdditionalDocuments(e,i);await Promise.all(e.map(a=>[a,this.getRootFolder(a)]).map(async a=>this.traverseFolder(...a,n,i)));this._ready.resolve();return r}loadAdditionalDocuments(e,n){return Promise.resolve()}getRootFolder(e){return lt.parse(e.uri)}async traverseFolder(e,n,r,i){const a=await this.fileSystemProvider.readDirectory(n);await Promise.all(a.map(async s=>{if(this.includeEntry(e,s,r)){if(s.isDirectory){await this.traverseFolder(e,s.uri,r,i)}else if(s.isFile){const o=await this.langiumDocuments.getOrCreateDocument(s.uri);i(o)}}}))}includeEntry(e,n,r){const i=Ue.basename(n.uri);if(i.startsWith(".")){return false}if(n.isDirectory){return i!=="node_modules"&&i!=="out"}else if(n.isFile){const a=Ue.extname(n.uri);return r.includes(a)}return false}}class NP{buildUnexpectedCharactersMessage(e,n,r,i,a){return jd.buildUnexpectedCharactersMessage(e,n,r,i,a)}buildUnableToPopLexerModeMessage(e){return jd.buildUnableToPopLexerModeMessage(e)}}const PP={mode:"full"};class xv{constructor(e){this.errorMessageProvider=e.parser.LexerErrorMessageProvider;this.tokenBuilder=e.parser.TokenBuilder;const n=this.tokenBuilder.buildTokens(e.Grammar,{caseInsensitive:e.LanguageMetaData.caseInsensitive});this.tokenTypes=this.toTokenTypeDictionary(n);const r=Rh(n)?Object.values(n):n;const i=e.LanguageMetaData.mode==="production";this.chevrotainLexer=new ot(r,{positionTracking:"full",skipValidations:i,errorMessageProvider:this.errorMessageProvider})}get definition(){return this.tokenTypes}tokenize(e,n=PP){var r,i,a;const s=this.chevrotainLexer.tokenize(e);return{tokens:s.tokens,errors:s.errors,hidden:(r=s.groups.hidden)!==null&&r!==void 0?r:[],report:(a=(i=this.tokenBuilder).flushLexingReport)===null||a===void 0?void 0:a.call(i,e)}}toTokenTypeDictionary(e){if(Rh(e))return e;const n=Mv(e)?Object.values(e.modes).flat():e;const r={};n.forEach(i=>r[i.name]=i);return r}}function _P(t){return Array.isArray(t)&&(t.length===0||"name"in t[0])}function Mv(t){return t&&"modes"in t&&"defaultMode"in t}function Rh(t){return!_P(t)&&!Mv(t)}function DP(t,e,n){let r;let i;if(typeof t==="string"){i=e;r=n}else{i=t.range.start;r=e}if(!i){i=ue.create(0,0)}const a=Fv(t);const s=Bp(r);const o=LP({lines:a,position:i,options:s});return UP({index:0,tokens:o,position:i})}function OP(t,e){const n=Bp(e);const r=Fv(t);if(r.length===0){return false}const i=r[0];const a=r[r.length-1];const s=n.start;const o=n.end;return Boolean(s===null||s===void 0?void 0:s.exec(i))&&Boolean(o===null||o===void 0?void 0:o.exec(a))}function Fv(t){let e="";if(typeof t==="string"){e=t}else{e=t.text}const n=e.split(W$);return n}const vh=/\s*(@([\p{L}][\p{L}\p{N}]*)?)/uy;const IP=/\{(@[\p{L}][\p{L}\p{N}]*)(\s*)([^\r\n}]+)?\}/gu;function LP(t){var e,n,r;const i=[];let a=t.position.line;let s=t.position.character;for(let o=0;o<t.lines.length;o++){const l=o===0;const u=o===t.lines.length-1;let c=t.lines[o];let d=0;if(l&&t.options.start){const p=(e=t.options.start)===null||e===void 0?void 0:e.exec(c);if(p){d=p.index+p[0].length}}else{const p=(n=t.options.line)===null||n===void 0?void 0:n.exec(c);if(p){d=p.index+p[0].length}}if(u){const p=(r=t.options.end)===null||r===void 0?void 0:r.exec(c);if(p){c=c.substring(0,p.index)}}c=c.substring(0,KP(c));const f=tp(c,d);if(f>=c.length){if(i.length>0){const p=ue.create(a,s);i.push({type:"break",content:"",range:ie.create(p,p)})}}else{vh.lastIndex=d;const p=vh.exec(c);if(p){const y=p[0];const v=p[1];const k=ue.create(a,s+d);const $=ue.create(a,s+d+y.length);i.push({type:"tag",content:v,range:ie.create(k,$)});d+=y.length;d=tp(c,d)}if(d<c.length){const y=c.substring(d);const v=Array.from(y.matchAll(IP));i.push(...xP(v,y,a,s+d))}}a++;s=0}if(i.length>0&&i[i.length-1].type==="break"){return i.slice(0,-1)}return i}function xP(t,e,n,r){const i=[];if(t.length===0){const a=ue.create(n,r);const s=ue.create(n,r+e.length);i.push({type:"text",content:e,range:ie.create(a,s)})}else{let a=0;for(const o of t){const l=o.index;const u=e.substring(a,l);if(u.length>0){i.push({type:"text",content:e.substring(a,l),range:ie.create(ue.create(n,a+r),ue.create(n,l+r))})}let c=u.length+1;const d=o[1];i.push({type:"inline-tag",content:d,range:ie.create(ue.create(n,a+c+r),ue.create(n,a+c+d.length+r))});c+=d.length;if(o.length===4){c+=o[2].length;const f=o[3];i.push({type:"text",content:f,range:ie.create(ue.create(n,a+c+r),ue.create(n,a+c+f.length+r))})}else{i.push({type:"text",content:"",range:ie.create(ue.create(n,a+c+r),ue.create(n,a+c+r))})}a=l+o[0].length}const s=e.substring(a);if(s.length>0){i.push({type:"text",content:s,range:ie.create(ue.create(n,a+r),ue.create(n,a+r+s.length))})}}return i}const MP=/\S/;const FP=/\s*$/;function tp(t,e){const n=t.substring(e).match(MP);if(n){return e+n.index}else{return t.length}}function KP(t){const e=t.match(FP);if(e&&typeof e.index==="number"){return e.index}return void 0}function UP(t){var e,n,r,i;const a=ue.create(t.position.line,t.position.character);if(t.tokens.length===0){return new $h([],ie.create(a,a))}const s=[];while(t.index<t.tokens.length){const u=GP(t,s[s.length-1]);if(u){s.push(u)}}const o=(n=(e=s[0])===null||e===void 0?void 0:e.range.start)!==null&&n!==void 0?n:a;const l=(i=(r=s[s.length-1])===null||r===void 0?void 0:r.range.end)!==null&&i!==void 0?i:a;return new $h(s,ie.create(o,l))}function GP(t,e){const n=t.tokens[t.index];if(n.type==="tag"){return Uv(t,false)}else if(n.type==="text"||n.type==="inline-tag"){return Kv(t)}else{HP(n,e);t.index++;return void 0}}function HP(t,e){if(e){const n=new Hv("",t.range);if("inlines"in e){e.inlines.push(n)}else{e.content.inlines.push(n)}}}function Kv(t){let e=t.tokens[t.index];const n=e;let r=e;const i=[];while(e&&e.type!=="break"&&e.type!=="tag"){i.push(qP(t));r=e;e=t.tokens[t.index]}return new np(i,ie.create(n.range.start,r.range.end))}function qP(t){const e=t.tokens[t.index];if(e.type==="inline-tag"){return Uv(t,true)}else{return Gv(t)}}function Uv(t,e){const n=t.tokens[t.index++];const r=n.content.substring(1);const i=t.tokens[t.index];if((i===null||i===void 0?void 0:i.type)==="text"){if(e){const a=Gv(t);return new Nc(r,new np([a],a.range),e,ie.create(n.range.start,a.range.end))}else{const a=Kv(t);return new Nc(r,a,e,ie.create(n.range.start,a.range.end))}}else{const a=n.range;return new Nc(r,new np([],a),e,a)}}function Gv(t){const e=t.tokens[t.index++];return new Hv(e.content,e.range)}function Bp(t){if(!t){return Bp({start:"/**",end:"*/",line:"*"})}const{start:e,end:n,line:r}=t;return{start:bc(e,true),end:bc(n,false),line:bc(r,true)}}function bc(t,e){if(typeof t==="string"||typeof t==="object"){const n=typeof t==="string"?Hu(t):t.source;if(e){return new RegExp(`^\\s*${n}`)}else{return new RegExp(`\\s*${n}\\s*$`)}}else{return t}}class $h{constructor(e,n){this.elements=e;this.range=n}getTag(e){return this.getAllTags().find(n=>n.name===e)}getTags(e){return this.getAllTags().filter(n=>n.name===e)}getAllTags(){return this.elements.filter(e=>"name"in e)}toString(){let e="";for(const n of this.elements){if(e.length===0){e=n.toString()}else{const r=n.toString();e+=Th(e)+r}}return e.trim()}toMarkdown(e){let n="";for(const r of this.elements){if(n.length===0){n=r.toMarkdown(e)}else{const i=r.toMarkdown(e);n+=Th(n)+i}}return n.trim()}}class Nc{constructor(e,n,r,i){this.name=e;this.content=n;this.inline=r;this.range=i}toString(){let e=`@${this.name}`;const n=this.content.toString();if(this.content.inlines.length===1){e=`${e} ${n}`}else if(this.content.inlines.length>1){e=`${e}
${n}`}if(this.inline){return`{${e}}`}else{return e}}toMarkdown(e){var n,r;return(r=(n=e===null||e===void 0?void 0:e.renderTag)===null||n===void 0?void 0:n.call(e,this))!==null&&r!==void 0?r:this.toMarkdownDefault(e)}toMarkdownDefault(e){const n=this.content.toMarkdown(e);if(this.inline){const a=jP(this.name,n,e!==null&&e!==void 0?e:{});if(typeof a==="string"){return a}}let r="";if((e===null||e===void 0?void 0:e.tag)==="italic"||(e===null||e===void 0?void 0:e.tag)===void 0){r="*"}else if((e===null||e===void 0?void 0:e.tag)==="bold"){r="**"}else if((e===null||e===void 0?void 0:e.tag)==="bold-italic"){r="***"}let i=`${r}@${this.name}${r}`;if(this.content.inlines.length===1){i=`${i} — ${n}`}else if(this.content.inlines.length>1){i=`${i}
${n}`}if(this.inline){return`{${i}}`}else{return i}}}function jP(t,e,n){var r,i;if(t==="linkplain"||t==="linkcode"||t==="link"){const a=e.indexOf(" ");let s=e;if(a>0){const l=tp(e,a);s=e.substring(l);e=e.substring(0,a)}if(t==="linkcode"||t==="link"&&n.link==="code"){s=`\`${s}\``}const o=(i=(r=n.renderLink)===null||r===void 0?void 0:r.call(n,e,s))!==null&&i!==void 0?i:BP(e,s);return o}return void 0}function BP(t,e){try{lt.parse(t,true);return`[${e}](${t})`}catch(n){return t}}class np{constructor(e,n){this.inlines=e;this.range=n}toString(){let e="";for(let n=0;n<this.inlines.length;n++){const r=this.inlines[n];const i=this.inlines[n+1];e+=r.toString();if(i&&i.range.start.line>r.range.start.line){e+="\n"}}return e}toMarkdown(e){let n="";for(let r=0;r<this.inlines.length;r++){const i=this.inlines[r];const a=this.inlines[r+1];n+=i.toMarkdown(e);if(a&&a.range.start.line>i.range.start.line){n+="\n"}}return n}}class Hv{constructor(e,n){this.text=e;this.range=n}toString(){return this.text}toMarkdown(){return this.text}}function Th(t){if(t.endsWith("\n")){return"\n"}else{return"\n\n"}}class qv{constructor(e){this.indexManager=e.shared.workspace.IndexManager;this.commentProvider=e.documentation.CommentProvider}getDocumentation(e){const n=this.commentProvider.getComment(e);if(n&&OP(n)){const r=DP(n);return r.toMarkdown({renderLink:(i,a)=>{return this.documentationLinkRenderer(e,i,a)},renderTag:i=>{return this.documentationTagRenderer(e,i)}})}return void 0}documentationLinkRenderer(e,n,r){var i;const a=(i=this.findNameInPrecomputedScopes(e,n))!==null&&i!==void 0?i:this.findNameInGlobalScope(e,n);if(a&&a.nameSegment){const s=a.nameSegment.range.start.line+1;const o=a.nameSegment.range.start.character+1;const l=a.documentUri.with({fragment:`L${s},${o}`});return`[${r}](${l.toString()})`}else{return void 0}}documentationTagRenderer(e,n){return void 0}findNameInPrecomputedScopes(e,n){const r=yt(e);const i=r.precomputedScopes;if(!i){return void 0}let a=e;do{const s=i.get(a);const o=s.find(l=>l.name===n);if(o){return o}a=a.$container}while(a);return void 0}findNameInGlobalScope(e,n){const r=this.indexManager.allElements().find(i=>i.name===n);return r}}class WP{constructor(e){this.grammarConfig=()=>e.parser.GrammarConfig}getComment(e){var n;if(gP(e)){return e.$comment}return(n=C$(e.$cstNode,this.grammarConfig().multilineCommentRules))===null||n===void 0?void 0:n.text}}class VP{constructor(e){this.syncParser=e.parser.LangiumParser}parse(e,n){return Promise.resolve(this.syncParser.parse(e))}}class zP{constructor(){this.previousTokenSource=new ye.CancellationTokenSource;this.writeQueue=[];this.readQueue=[];this.done=true}write(e){this.cancelWrite();const n=uP();this.previousTokenSource=n;return this.enqueue(this.writeQueue,e,n.token)}read(e){return this.enqueue(this.readQueue,e)}enqueue(e,n,r=ye.CancellationToken.None){const i=new jp;const a={action:n,deferred:i,cancellationToken:r};e.push(a);this.performNextOperation();return i.promise}async performNextOperation(){if(!this.done){return}const e=[];if(this.writeQueue.length>0){e.push(this.writeQueue.shift())}else if(this.readQueue.length>0){e.push(...this.readQueue.splice(0,this.readQueue.length))}else{return}this.done=false;await Promise.all(e.map(async({action:n,deferred:r,cancellationToken:i})=>{try{const a=await Promise.resolve().then(()=>n(i));r.resolve(a)}catch(a){if(ds(a)){r.resolve(void 0)}else{r.reject(a)}}}));this.done=true;this.performNextOperation()}cancelWrite(){this.previousTokenSource.cancel()}}class XP{constructor(e){this.grammarElementIdMap=new hh;this.tokenTypeIdMap=new hh;this.grammar=e.Grammar;this.lexer=e.parser.Lexer;this.linker=e.references.Linker}dehydrate(e){return{lexerErrors:e.lexerErrors,lexerReport:e.lexerReport?this.dehydrateLexerReport(e.lexerReport):void 0,parserErrors:e.parserErrors.map(n=>Object.assign(Object.assign({},n),{message:n.message})),value:this.dehydrateAstNode(e.value,this.createDehyrationContext(e.value))}}dehydrateLexerReport(e){return e}createDehyrationContext(e){const n=new Map;const r=new Map;for(const i of Yn(e)){n.set(i,{})}if(e.$cstNode){for(const i of su(e.$cstNode)){r.set(i,{})}}return{astNodes:n,cstNodes:r}}dehydrateAstNode(e,n){const r=n.astNodes.get(e);r.$type=e.$type;r.$containerIndex=e.$containerIndex;r.$containerProperty=e.$containerProperty;if(e.$cstNode!==void 0){r.$cstNode=this.dehydrateCstNode(e.$cstNode,n)}for(const[i,a]of Object.entries(e)){if(i.startsWith("$")){continue}if(Array.isArray(a)){const s=[];r[i]=s;for(const o of a){if(rt(o)){s.push(this.dehydrateAstNode(o,n))}else if(on(o)){s.push(this.dehydrateReference(o,n))}else{s.push(o)}}}else if(rt(a)){r[i]=this.dehydrateAstNode(a,n)}else if(on(a)){r[i]=this.dehydrateReference(a,n)}else if(a!==void 0){r[i]=a}}return r}dehydrateReference(e,n){const r={};r.$refText=e.$refText;if(e.$refNode){r.$refNode=n.cstNodes.get(e.$refNode)}return r}dehydrateCstNode(e,n){const r=n.cstNodes.get(e);if(yg(e)){r.fullText=e.fullText}else{r.grammarSource=this.getGrammarElementId(e.grammarSource)}r.hidden=e.hidden;r.astNode=n.astNodes.get(e.astNode);if(Tr(e)){r.content=e.content.map(i=>this.dehydrateCstNode(i,n))}else if(Ja(e)){r.tokenType=e.tokenType.name;r.offset=e.offset;r.length=e.length;r.startLine=e.range.start.line;r.startColumn=e.range.start.character;r.endLine=e.range.end.line;r.endColumn=e.range.end.character}return r}hydrate(e){const n=e.value;const r=this.createHydrationContext(n);if("$cstNode"in n){this.hydrateCstNode(n.$cstNode,r)}return{lexerErrors:e.lexerErrors,lexerReport:e.lexerReport,parserErrors:e.parserErrors,value:this.hydrateAstNode(n,r)}}createHydrationContext(e){const n=new Map;const r=new Map;for(const a of Yn(e)){n.set(a,{})}let i;if(e.$cstNode){for(const a of su(e.$cstNode)){let s;if("fullText"in a){s=new cv(a.fullText);i=s}else if("content"in a){s=new Hp}else if("tokenType"in a){s=this.hydrateCstLeafNode(a)}if(s){r.set(a,s);s.root=i}}}return{astNodes:n,cstNodes:r}}hydrateAstNode(e,n){const r=n.astNodes.get(e);r.$type=e.$type;r.$containerIndex=e.$containerIndex;r.$containerProperty=e.$containerProperty;if(e.$cstNode){r.$cstNode=n.cstNodes.get(e.$cstNode)}for(const[i,a]of Object.entries(e)){if(i.startsWith("$")){continue}if(Array.isArray(a)){const s=[];r[i]=s;for(const o of a){if(rt(o)){s.push(this.setParent(this.hydrateAstNode(o,n),r))}else if(on(o)){s.push(this.hydrateReference(o,r,i,n))}else{s.push(o)}}}else if(rt(a)){r[i]=this.setParent(this.hydrateAstNode(a,n),r)}else if(on(a)){r[i]=this.hydrateReference(a,r,i,n)}else if(a!==void 0){r[i]=a}}return r}setParent(e,n){e.$container=n;return e}hydrateReference(e,n,r,i){return this.linker.buildReference(n,r,i.cstNodes.get(e.$refNode),e.$refText)}hydrateCstNode(e,n,r=0){const i=n.cstNodes.get(e);if(typeof e.grammarSource==="number"){i.grammarSource=this.getGrammarElement(e.grammarSource)}i.astNode=n.astNodes.get(e.astNode);if(Tr(i)){for(const a of e.content){const s=this.hydrateCstNode(a,n,r++);i.content.push(s)}}return i}hydrateCstLeafNode(e){const n=this.getTokenType(e.tokenType);const r=e.offset;const i=e.length;const a=e.startLine;const s=e.startColumn;const o=e.endLine;const l=e.endColumn;const u=e.hidden;const c=new Jf(r,i,{start:{line:a,character:s},end:{line:o,character:l}},n,u);return c}getTokenType(e){return this.lexer.definition[e]}getGrammarElementId(e){if(!e){return void 0}if(this.grammarElementIdMap.size===0){this.createGrammarElementIdMap()}return this.grammarElementIdMap.get(e)}getGrammarElement(e){if(this.grammarElementIdMap.size===0){this.createGrammarElementIdMap()}const n=this.grammarElementIdMap.getKey(e);return n}createGrammarElementIdMap(){let e=0;for(const n of Yn(this.grammar)){if(wg(n)){this.grammarElementIdMap.set(n,e++)}}}}function jv(t){return{documentation:{CommentProvider:e=>new WP(e),DocumentationProvider:e=>new qv(e)},parser:{AsyncParser:e=>new VP(e),GrammarConfig:e=>fT(e),LangiumParser:e=>tP(e),CompletionParser:e=>eP(e),ValueConverter:()=>new rP,TokenBuilder:()=>new Rv,Lexer:e=>new xv(e),ParserErrorMessageProvider:()=>new pv,LexerErrorMessageProvider:()=>new NP},workspace:{AstNodeLocator:()=>new SP,AstNodeDescriptionProvider:e=>new wP(e),ReferenceDescriptionProvider:e=>new CP(e)},references:{Linker:e=>new fP(e),NameProvider:()=>new Av,ScopeProvider:e=>new Dv(e),ScopeComputation:e=>new bv(e),References:e=>new kv(e)},serializer:{Hydrator:e=>new XP(e),JsonSerializer:e=>new RP(e)},validation:{DocumentValidator:e=>new Ov(e),ValidationRegistry:e=>new $P(e)},shared:()=>t.shared}}function Bv(t){return{ServiceRegistry:e=>new vP(e),workspace:{LangiumDocuments:e=>new dP(e),LangiumDocumentFactory:e=>new Cv(e),DocumentBuilder:e=>new bP(e),IndexManager:e=>new Iv(e),WorkspaceManager:e=>new Lv(e),FileSystemProvider:e=>t.fileSystemProvider(e),WorkspaceLock:()=>new zP,ConfigurationProvider:e=>new kP(e)}}}var Lu;(function(t){t.merge=(e,n)=>Mu(Mu({},e),n)})(Lu||(Lu={}));function xu(t,e,n,r,i,a,s,o,l){const u=[t,e,n,r,i,a,s,o,l].reduce(Mu,{});return Vv(u)}const Wv=Symbol("isProxy");function rp(t){if(t&&t[Wv]){for(const e of Object.values(t)){rp(e)}}return t}function Vv(t,e){const n=new Proxy({},{deleteProperty:()=>false,set:()=>{throw new Error("Cannot set property on injected service container")},get:(r,i)=>{if(i===Wv){return true}else{return wh(r,i,t,e||n)}},getOwnPropertyDescriptor:(r,i)=>(wh(r,i,t,e||n),Object.getOwnPropertyDescriptor(r,i)),has:(r,i)=>i in t,ownKeys:()=>[...Object.getOwnPropertyNames(t)]});return n}const Eh=Symbol();function wh(t,e,n,r){if(e in t){if(t[e]instanceof Error){throw new Error("Construction failure. Please make sure that your dependencies are constructable.",{cause:t[e]})}if(t[e]===Eh){throw new Error('Cycle detected. Please make "'+String(e)+'" lazy. Visit https://langium.org/docs/reference/configuration-services/#resolving-cyclic-dependencies')}return t[e]}else if(e in n){const i=n[e];t[e]=Eh;try{t[e]=typeof i==="function"?i(r):Vv(i,r)}catch(a){t[e]=a instanceof Error?a:void 0;throw a}return t[e]}else{return void 0}}function Mu(t,e){if(e){for(const[n,r]of Object.entries(e)){if(r!==void 0){const i=t[n];if(i!==null&&r!==null&&typeof i==="object"&&typeof r==="object"){t[n]=Mu(i,r)}else{t[n]=r}}}}return t}class YP{readFile(){throw new Error("No file system is available.")}async readDirectory(){return[]}}const zv={fileSystemProvider:()=>new YP};const JP={Grammar:()=>void 0,LanguageMetaData:()=>({caseInsensitive:false,fileExtensions:[".langium"],languageId:"langium"})};const QP={AstReflection:()=>new kg};function ZP(){const t=xu(Bv(zv),QP);const e=xu(jv({shared:t}),JP);t.ServiceRegistry.register(e);return e}function e_(t){var e;const n=ZP();const r=n.serializer.JsonSerializer.deserialize(t);n.shared.workspace.LangiumDocumentFactory.fromModel(r,lt.parse(`memory://${(e=r.name)!==null&&e!==void 0?e:"grammar"}.langium`));return r}var ci={};var di={};var Rn={};var fi={};var pi={};var js={};var Pc={};var V={};var Qe={};var Ch;function fs(){if(Ch)return Qe;Ch=1;Object.defineProperty(Qe,"__esModule",{value:true});Qe.stringArray=Qe.array=Qe.func=Qe.error=Qe.number=Qe.string=Qe.boolean=void 0;function t(o){return o===true||o===false}Qe.boolean=t;function e(o){return typeof o==="string"||o instanceof String}Qe.string=e;function n(o){return typeof o==="number"||o instanceof Number}Qe.number=n;function r(o){return o instanceof Error}Qe.error=r;function i(o){return typeof o==="function"}Qe.func=i;function a(o){return Array.isArray(o)}Qe.array=a;function s(o){return a(o)&&o.every(l=>e(l))}Qe.stringArray=s;return Qe}var Sh;function Xv(){if(Sh)return V;Sh=1;Object.defineProperty(V,"__esModule",{value:true});V.Message=V.NotificationType9=V.NotificationType8=V.NotificationType7=V.NotificationType6=V.NotificationType5=V.NotificationType4=V.NotificationType3=V.NotificationType2=V.NotificationType1=V.NotificationType0=V.NotificationType=V.RequestType9=V.RequestType8=V.RequestType7=V.RequestType6=V.RequestType5=V.RequestType4=V.RequestType3=V.RequestType2=V.RequestType1=V.RequestType=V.RequestType0=V.AbstractMessageSignature=V.ParameterStructures=V.ResponseError=V.ErrorCodes=void 0;const t=fs();var e;(function(w){w.ParseError=-32700;w.InvalidRequest=-32600;w.MethodNotFound=-32601;w.InvalidParams=-32602;w.InternalError=-32603;w.jsonrpcReservedErrorRangeStart=-32099;w.serverErrorStart=-32099;w.MessageWriteError=-32099;w.MessageReadError=-32098;w.PendingResponseRejected=-32097;w.ConnectionInactive=-32096;w.ServerNotInitialized=-32002;w.UnknownErrorCode=-32001;w.jsonrpcReservedErrorRangeEnd=-32e3;w.serverErrorEnd=-32e3})(e||(V.ErrorCodes=e={}));class n extends Error{constructor(g,b,M){super(b);this.code=t.number(g)?g:e.UnknownErrorCode;this.data=M;Object.setPrototypeOf(this,n.prototype)}toJson(){const g={code:this.code,message:this.message};if(this.data!==void 0){g.data=this.data}return g}}V.ResponseError=n;class r{constructor(g){this.kind=g}static is(g){return g===r.auto||g===r.byName||g===r.byPosition}toString(){return this.kind}}V.ParameterStructures=r;r.auto=new r("auto");r.byPosition=new r("byPosition");r.byName=new r("byName");class i{constructor(g,b){this.method=g;this.numberOfParams=b}get parameterStructures(){return r.auto}}V.AbstractMessageSignature=i;class a extends i{constructor(g){super(g,0)}}V.RequestType0=a;class s extends i{constructor(g,b=r.auto){super(g,1);this._parameterStructures=b}get parameterStructures(){return this._parameterStructures}}V.RequestType=s;class o extends i{constructor(g,b=r.auto){super(g,1);this._parameterStructures=b}get parameterStructures(){return this._parameterStructures}}V.RequestType1=o;class l extends i{constructor(g){super(g,2)}}V.RequestType2=l;class u extends i{constructor(g){super(g,3)}}V.RequestType3=u;class c extends i{constructor(g){super(g,4)}}V.RequestType4=c;class d extends i{constructor(g){super(g,5)}}V.RequestType5=d;class f extends i{constructor(g){super(g,6)}}V.RequestType6=f;class p extends i{constructor(g){super(g,7)}}V.RequestType7=p;class y extends i{constructor(g){super(g,8)}}V.RequestType8=y;class v extends i{constructor(g){super(g,9)}}V.RequestType9=v;class k extends i{constructor(g,b=r.auto){super(g,1);this._parameterStructures=b}get parameterStructures(){return this._parameterStructures}}V.NotificationType=k;class $ extends i{constructor(g){super(g,0)}}V.NotificationType0=$;class E extends i{constructor(g,b=r.auto){super(g,1);this._parameterStructures=b}get parameterStructures(){return this._parameterStructures}}V.NotificationType1=E;class C extends i{constructor(g){super(g,2)}}V.NotificationType2=C;class I extends i{constructor(g){super(g,3)}}V.NotificationType3=I;class Y extends i{constructor(g){super(g,4)}}V.NotificationType4=Y;class q extends i{constructor(g){super(g,5)}}V.NotificationType5=q;class J extends i{constructor(g){super(g,6)}}V.NotificationType6=J;class ne extends i{constructor(g){super(g,7)}}V.NotificationType7=ne;class ae extends i{constructor(g){super(g,8)}}V.NotificationType8=ae;class de extends i{constructor(g){super(g,9)}}V.NotificationType9=de;var L;(function(w){function g(O){const x=O;return x&&t.string(x.method)&&(t.string(x.id)||t.number(x.id))}w.isRequest=g;function b(O){const x=O;return x&&t.string(x.method)&&O.id===void 0}w.isNotification=b;function M(O){const x=O;return x&&(x.result!==void 0||!!x.error)&&(t.string(x.id)||t.number(x.id)||x.id===null)}w.isResponse=M})(L||(V.Message=L={}));return V}var vn={};var Ah;function Yv(){if(Ah)return vn;Ah=1;var t;Object.defineProperty(vn,"__esModule",{value:true});vn.LRUCache=vn.LinkedMap=vn.Touch=void 0;var e;(function(i){i.None=0;i.First=1;i.AsOld=i.First;i.Last=2;i.AsNew=i.Last})(e||(vn.Touch=e={}));class n{constructor(){this[t]="LinkedMap";this._map=new Map;this._head=void 0;this._tail=void 0;this._size=0;this._state=0}clear(){this._map.clear();this._head=void 0;this._tail=void 0;this._size=0;this._state++}isEmpty(){return!this._head&&!this._tail}get size(){return this._size}get first(){return this._head?.value}get last(){return this._tail?.value}has(a){return this._map.has(a)}get(a,s=e.None){const o=this._map.get(a);if(!o){return void 0}if(s!==e.None){this.touch(o,s)}return o.value}set(a,s,o=e.None){let l=this._map.get(a);if(l){l.value=s;if(o!==e.None){this.touch(l,o)}}else{l={key:a,value:s,next:void 0,previous:void 0};switch(o){case e.None:this.addItemLast(l);break;case e.First:this.addItemFirst(l);break;case e.Last:this.addItemLast(l);break;default:this.addItemLast(l);break}this._map.set(a,l);this._size++}return this}delete(a){return!!this.remove(a)}remove(a){const s=this._map.get(a);if(!s){return void 0}this._map.delete(a);this.removeItem(s);this._size--;return s.value}shift(){if(!this._head&&!this._tail){return void 0}if(!this._head||!this._tail){throw new Error("Invalid list")}const a=this._head;this._map.delete(a.key);this.removeItem(a);this._size--;return a.value}forEach(a,s){const o=this._state;let l=this._head;while(l){if(s){a.bind(s)(l.value,l.key,this)}else{a(l.value,l.key,this)}if(this._state!==o){throw new Error(`LinkedMap got modified during iteration.`)}l=l.next}}keys(){const a=this._state;let s=this._head;const o={[Symbol.iterator]:()=>{return o},next:()=>{if(this._state!==a){throw new Error(`LinkedMap got modified during iteration.`)}if(s){const l={value:s.key,done:false};s=s.next;return l}else{return{value:void 0,done:true}}}};return o}values(){const a=this._state;let s=this._head;const o={[Symbol.iterator]:()=>{return o},next:()=>{if(this._state!==a){throw new Error(`LinkedMap got modified during iteration.`)}if(s){const l={value:s.value,done:false};s=s.next;return l}else{return{value:void 0,done:true}}}};return o}entries(){const a=this._state;let s=this._head;const o={[Symbol.iterator]:()=>{return o},next:()=>{if(this._state!==a){throw new Error(`LinkedMap got modified during iteration.`)}if(s){const l={value:[s.key,s.value],done:false};s=s.next;return l}else{return{value:void 0,done:true}}}};return o}[(t=Symbol.toStringTag,Symbol.iterator)](){return this.entries()}trimOld(a){if(a>=this.size){return}if(a===0){this.clear();return}let s=this._head;let o=this.size;while(s&&o>a){this._map.delete(s.key);s=s.next;o--}this._head=s;this._size=o;if(s){s.previous=void 0}this._state++}addItemFirst(a){if(!this._head&&!this._tail){this._tail=a}else if(!this._head){throw new Error("Invalid list")}else{a.next=this._head;this._head.previous=a}this._head=a;this._state++}addItemLast(a){if(!this._head&&!this._tail){this._head=a}else if(!this._tail){throw new Error("Invalid list")}else{a.previous=this._tail;this._tail.next=a}this._tail=a;this._state++}removeItem(a){if(a===this._head&&a===this._tail){this._head=void 0;this._tail=void 0}else if(a===this._head){if(!a.next){throw new Error("Invalid list")}a.next.previous=void 0;this._head=a.next}else if(a===this._tail){if(!a.previous){throw new Error("Invalid list")}a.previous.next=void 0;this._tail=a.previous}else{const s=a.next;const o=a.previous;if(!s||!o){throw new Error("Invalid list")}s.previous=o;o.next=s}a.next=void 0;a.previous=void 0;this._state++}touch(a,s){if(!this._head||!this._tail){throw new Error("Invalid list")}if(s!==e.First&&s!==e.Last){return}if(s===e.First){if(a===this._head){return}const o=a.next;const l=a.previous;if(a===this._tail){l.next=void 0;this._tail=l}else{o.previous=l;l.next=o}a.previous=void 0;a.next=this._head;this._head.previous=a;this._head=a;this._state++}else if(s===e.Last){if(a===this._tail){return}const o=a.next;const l=a.previous;if(a===this._head){o.previous=void 0;this._head=o}else{o.previous=l;l.next=o}a.next=void 0;a.previous=this._tail;this._tail.next=a;this._tail=a;this._state++}}toJSON(){const a=[];this.forEach((s,o)=>{a.push([o,s])});return a}fromJSON(a){this.clear();for(const[s,o]of a){this.set(s,o)}}}vn.LinkedMap=n;class r extends n{constructor(a,s=1){super();this._limit=a;this._ratio=Math.min(Math.max(0,s),1)}get limit(){return this._limit}set limit(a){this._limit=a;this.checkTrim()}get ratio(){return this._ratio}set ratio(a){this._ratio=Math.min(Math.max(0,a),1);this.checkTrim()}get(a,s=e.AsNew){return super.get(a,s)}peek(a){return super.get(a,e.None)}set(a,s){super.set(a,s,e.Last);this.checkTrim();return this}checkTrim(){if(this.size>this._limit){this.trimOld(Math.round(this._limit*this._ratio))}}}vn.LRUCache=r;return vn}var mi={};var kh;function t_(){if(kh)return mi;kh=1;Object.defineProperty(mi,"__esModule",{value:true});mi.Disposable=void 0;var t;(function(e){function n(r){return{dispose:r}}e.create=n})(t||(mi.Disposable=t={}));return mi}var cr={};var Bs={};var bh;function Ir(){if(bh)return Bs;bh=1;Object.defineProperty(Bs,"__esModule",{value:true});let t;function e(){if(t===void 0){throw new Error(`No runtime abstraction layer installed`)}return t}(function(n){function r(i){if(i===void 0){throw new Error(`No runtime abstraction layer provided`)}t=i}n.install=r})(e);Bs.default=e;return Bs}var Nh;function ps(){if(Nh)return cr;Nh=1;Object.defineProperty(cr,"__esModule",{value:true});cr.Emitter=cr.Event=void 0;const t=Ir();var e;(function(i){const a={dispose(){}};i.None=function(){return a}})(e||(cr.Event=e={}));class n{add(a,s=null,o){if(!this._callbacks){this._callbacks=[];this._contexts=[]}this._callbacks.push(a);this._contexts.push(s);if(Array.isArray(o)){o.push({dispose:()=>this.remove(a,s)})}}remove(a,s=null){if(!this._callbacks){return}let o=false;for(let l=0,u=this._callbacks.length;l<u;l++){if(this._callbacks[l]===a){if(this._contexts[l]===s){this._callbacks.splice(l,1);this._contexts.splice(l,1);return}else{o=true}}}if(o){throw new Error("When adding a listener with a context, you should remove it with the same context")}}invoke(...a){if(!this._callbacks){return[]}const s=[],o=this._callbacks.slice(0),l=this._contexts.slice(0);for(let u=0,c=o.length;u<c;u++){try{s.push(o[u].apply(l[u],a))}catch(d){(0,t.default)().console.error(d)}}return s}isEmpty(){return!this._callbacks||this._callbacks.length===0}dispose(){this._callbacks=void 0;this._contexts=void 0}}class r{constructor(a){this._options=a}get event(){if(!this._event){this._event=(a,s,o)=>{if(!this._callbacks){this._callbacks=new n}if(this._options&&this._options.onFirstListenerAdd&&this._callbacks.isEmpty()){this._options.onFirstListenerAdd(this)}this._callbacks.add(a,s);const l={dispose:()=>{if(!this._callbacks){return}this._callbacks.remove(a,s);l.dispose=r._noop;if(this._options&&this._options.onLastListenerRemove&&this._callbacks.isEmpty()){this._options.onLastListenerRemove(this)}}};if(Array.isArray(o)){o.push(l)}return l}}return this._event}fire(a){if(this._callbacks){this._callbacks.invoke.call(this._callbacks,a)}}dispose(){if(this._callbacks){this._callbacks.dispose();this._callbacks=void 0}}}cr.Emitter=r;r._noop=function(){};return cr}var dr={};var Ph;function Wp(){if(Ph)return dr;Ph=1;Object.defineProperty(dr,"__esModule",{value:true});dr.CancellationTokenSource=dr.CancellationToken=void 0;const t=Ir();const e=fs();const n=ps();var r;(function(o){o.None=Object.freeze({isCancellationRequested:false,onCancellationRequested:n.Event.None});o.Cancelled=Object.freeze({isCancellationRequested:true,onCancellationRequested:n.Event.None});function l(u){const c=u;return c&&(c===o.None||c===o.Cancelled||e.boolean(c.isCancellationRequested)&&!!c.onCancellationRequested)}o.is=l})(r||(dr.CancellationToken=r={}));const i=Object.freeze(function(o,l){const u=(0,t.default)().timer.setTimeout(o.bind(l),0);return{dispose(){u.dispose()}}});class a{constructor(){this._isCancelled=false}cancel(){if(!this._isCancelled){this._isCancelled=true;if(this._emitter){this._emitter.fire(void 0);this.dispose()}}}get isCancellationRequested(){return this._isCancelled}get onCancellationRequested(){if(this._isCancelled){return i}if(!this._emitter){this._emitter=new n.Emitter}return this._emitter.event}dispose(){if(this._emitter){this._emitter.dispose();this._emitter=void 0}}}class s{get token(){if(!this._token){this._token=new a}return this._token}cancel(){if(!this._token){this._token=r.Cancelled}else{this._token.cancel()}}dispose(){if(!this._token){this._token=r.None}else if(this._token instanceof a){this._token.dispose()}}}dr.CancellationTokenSource=s;return dr}var fr={};var _h;function n_(){if(_h)return fr;_h=1;Object.defineProperty(fr,"__esModule",{value:true});fr.SharedArrayReceiverStrategy=fr.SharedArraySenderStrategy=void 0;const t=Wp();var e;(function(s){s.Continue=0;s.Cancelled=1})(e||(e={}));class n{constructor(){this.buffers=new Map}enableCancellation(o){if(o.id===null){return}const l=new SharedArrayBuffer(4);const u=new Int32Array(l,0,1);u[0]=e.Continue;this.buffers.set(o.id,l);o.$cancellationData=l}async sendCancellation(o,l){const u=this.buffers.get(l);if(u===void 0){return}const c=new Int32Array(u,0,1);Atomics.store(c,0,e.Cancelled)}cleanup(o){this.buffers.delete(o)}dispose(){this.buffers.clear()}}fr.SharedArraySenderStrategy=n;class r{constructor(o){this.data=new Int32Array(o,0,1)}get isCancellationRequested(){return Atomics.load(this.data,0)===e.Cancelled}get onCancellationRequested(){throw new Error(`Cancellation over SharedArrayBuffer doesn't support cancellation events`)}}class i{constructor(o){this.token=new r(o)}cancel(){}dispose(){}}class a{constructor(){this.kind="request"}createCancellationTokenSource(o){const l=o.$cancellationData;if(l===void 0){return new t.CancellationTokenSource}return new i(l)}}fr.SharedArrayReceiverStrategy=a;return fr}var $n={};var hi={};var Dh;function Jv(){if(Dh)return hi;Dh=1;Object.defineProperty(hi,"__esModule",{value:true});hi.Semaphore=void 0;const t=Ir();class e{constructor(r=1){if(r<=0){throw new Error("Capacity must be greater than 0")}this._capacity=r;this._active=0;this._waiting=[]}lock(r){return new Promise((i,a)=>{this._waiting.push({thunk:r,resolve:i,reject:a});this.runNext()})}get active(){return this._active}runNext(){if(this._waiting.length===0||this._active===this._capacity){return}(0,t.default)().timer.setImmediate(()=>this.doRunNext())}doRunNext(){if(this._waiting.length===0||this._active===this._capacity){return}const r=this._waiting.shift();this._active++;if(this._active>this._capacity){throw new Error(`To many thunks active`)}try{const i=r.thunk();if(i instanceof Promise){i.then(a=>{this._active--;r.resolve(a);this.runNext()},a=>{this._active--;r.reject(a);this.runNext()})}else{this._active--;r.resolve(i);this.runNext()}}catch(i){this._active--;r.reject(i);this.runNext()}}}hi.Semaphore=e;return hi}var Oh;function r_(){if(Oh)return $n;Oh=1;Object.defineProperty($n,"__esModule",{value:true});$n.ReadableStreamMessageReader=$n.AbstractMessageReader=$n.MessageReader=void 0;const t=Ir();const e=fs();const n=ps();const r=Jv();var i;(function(l){function u(c){let d=c;return d&&e.func(d.listen)&&e.func(d.dispose)&&e.func(d.onError)&&e.func(d.onClose)&&e.func(d.onPartialMessage)}l.is=u})(i||($n.MessageReader=i={}));class a{constructor(){this.errorEmitter=new n.Emitter;this.closeEmitter=new n.Emitter;this.partialMessageEmitter=new n.Emitter}dispose(){this.errorEmitter.dispose();this.closeEmitter.dispose()}get onError(){return this.errorEmitter.event}fireError(u){this.errorEmitter.fire(this.asError(u))}get onClose(){return this.closeEmitter.event}fireClose(){this.closeEmitter.fire(void 0)}get onPartialMessage(){return this.partialMessageEmitter.event}firePartialMessage(u){this.partialMessageEmitter.fire(u)}asError(u){if(u instanceof Error){return u}else{return new Error(`Reader received error. Reason: ${e.string(u.message)?u.message:"unknown"}`)}}}$n.AbstractMessageReader=a;var s;(function(l){function u(c){let d;let f;const p=new Map;let y;const v=new Map;if(c===void 0||typeof c==="string"){d=c??"utf-8"}else{d=c.charset??"utf-8";if(c.contentDecoder!==void 0){f=c.contentDecoder;p.set(f.name,f)}if(c.contentDecoders!==void 0){for(const k of c.contentDecoders){p.set(k.name,k)}}if(c.contentTypeDecoder!==void 0){y=c.contentTypeDecoder;v.set(y.name,y)}if(c.contentTypeDecoders!==void 0){for(const k of c.contentTypeDecoders){v.set(k.name,k)}}}if(y===void 0){y=(0,t.default)().applicationJson.decoder;v.set(y.name,y)}return{charset:d,contentDecoder:f,contentDecoders:p,contentTypeDecoder:y,contentTypeDecoders:v}}l.fromOptions=u})(s||(s={}));class o extends a{constructor(u,c){super();this.readable=u;this.options=s.fromOptions(c);this.buffer=(0,t.default)().messageBuffer.create(this.options.charset);this._partialMessageTimeout=1e4;this.nextMessageLength=-1;this.messageToken=0;this.readSemaphore=new r.Semaphore(1)}set partialMessageTimeout(u){this._partialMessageTimeout=u}get partialMessageTimeout(){return this._partialMessageTimeout}listen(u){this.nextMessageLength=-1;this.messageToken=0;this.partialMessageTimer=void 0;this.callback=u;const c=this.readable.onData(d=>{this.onData(d)});this.readable.onError(d=>this.fireError(d));this.readable.onClose(()=>this.fireClose());return c}onData(u){try{this.buffer.append(u);while(true){if(this.nextMessageLength===-1){const d=this.buffer.tryReadHeaders(true);if(!d){return}const f=d.get("content-length");if(!f){this.fireError(new Error(`Header must provide a Content-Length property.
${JSON.stringify(Object.fromEntries(d))}`));return}const p=parseInt(f);if(isNaN(p)){this.fireError(new Error(`Content-Length value must be a number. Got ${f}`));return}this.nextMessageLength=p}const c=this.buffer.tryReadBody(this.nextMessageLength);if(c===void 0){this.setPartialMessageTimer();return}this.clearPartialMessageTimer();this.nextMessageLength=-1;this.readSemaphore.lock(async()=>{const d=this.options.contentDecoder!==void 0?await this.options.contentDecoder.decode(c):c;const f=await this.options.contentTypeDecoder.decode(d,this.options);this.callback(f)}).catch(d=>{this.fireError(d)})}}catch(c){this.fireError(c)}}clearPartialMessageTimer(){if(this.partialMessageTimer){this.partialMessageTimer.dispose();this.partialMessageTimer=void 0}}setPartialMessageTimer(){this.clearPartialMessageTimer();if(this._partialMessageTimeout<=0){return}this.partialMessageTimer=(0,t.default)().timer.setTimeout((u,c)=>{this.partialMessageTimer=void 0;if(u===this.messageToken){this.firePartialMessage({messageToken:u,waitingTime:c});this.setPartialMessageTimer()}},this._partialMessageTimeout,this.messageToken,this._partialMessageTimeout)}}$n.ReadableStreamMessageReader=o;return $n}var Tn={};var Ih;function i_(){if(Ih)return Tn;Ih=1;Object.defineProperty(Tn,"__esModule",{value:true});Tn.WriteableStreamMessageWriter=Tn.AbstractMessageWriter=Tn.MessageWriter=void 0;const t=Ir();const e=fs();const n=Jv();const r=ps();const i="Content-Length: ";const a="\r\n";var s;(function(c){function d(f){let p=f;return p&&e.func(p.dispose)&&e.func(p.onClose)&&e.func(p.onError)&&e.func(p.write)}c.is=d})(s||(Tn.MessageWriter=s={}));class o{constructor(){this.errorEmitter=new r.Emitter;this.closeEmitter=new r.Emitter}dispose(){this.errorEmitter.dispose();this.closeEmitter.dispose()}get onError(){return this.errorEmitter.event}fireError(d,f,p){this.errorEmitter.fire([this.asError(d),f,p])}get onClose(){return this.closeEmitter.event}fireClose(){this.closeEmitter.fire(void 0)}asError(d){if(d instanceof Error){return d}else{return new Error(`Writer received error. Reason: ${e.string(d.message)?d.message:"unknown"}`)}}}Tn.AbstractMessageWriter=o;var l;(function(c){function d(f){if(f===void 0||typeof f==="string"){return{charset:f??"utf-8",contentTypeEncoder:(0,t.default)().applicationJson.encoder}}else{return{charset:f.charset??"utf-8",contentEncoder:f.contentEncoder,contentTypeEncoder:f.contentTypeEncoder??(0,t.default)().applicationJson.encoder}}}c.fromOptions=d})(l||(l={}));class u extends o{constructor(d,f){super();this.writable=d;this.options=l.fromOptions(f);this.errorCount=0;this.writeSemaphore=new n.Semaphore(1);this.writable.onError(p=>this.fireError(p));this.writable.onClose(()=>this.fireClose())}async write(d){return this.writeSemaphore.lock(async()=>{const f=this.options.contentTypeEncoder.encode(d,this.options).then(p=>{if(this.options.contentEncoder!==void 0){return this.options.contentEncoder.encode(p)}else{return p}});return f.then(p=>{const y=[];y.push(i,p.byteLength.toString(),a);y.push(a);return this.doWrite(d,y,p)},p=>{this.fireError(p);throw p})})}async doWrite(d,f,p){try{await this.writable.write(f.join(""),"ascii");return this.writable.write(p)}catch(y){this.handleError(y,d);return Promise.reject(y)}}handleError(d,f){this.errorCount++;this.fireError(d,f,this.errorCount)}end(){this.writable.end()}}Tn.WriteableStreamMessageWriter=u;return Tn}var yi={};var Lh;function a_(){if(Lh)return yi;Lh=1;Object.defineProperty(yi,"__esModule",{value:true});yi.AbstractMessageBuffer=void 0;const t=13;const e=10;const n="\r\n";class r{constructor(a="utf-8"){this._encoding=a;this._chunks=[];this._totalLength=0}get encoding(){return this._encoding}append(a){const s=typeof a==="string"?this.fromString(a,this._encoding):a;this._chunks.push(s);this._totalLength+=s.byteLength}tryReadHeaders(a=false){if(this._chunks.length===0){return void 0}let s=0;let o=0;let l=0;let u=0;e:while(o<this._chunks.length){const p=this._chunks[o];l=0;while(l<p.length){const y=p[l];switch(y){case t:switch(s){case 0:s=1;break;case 2:s=3;break;default:s=0}break;case e:switch(s){case 1:s=2;break;case 3:s=4;l++;break e;default:s=0}break;default:s=0}l++}u+=p.byteLength;o++}if(s!==4){return void 0}const c=this._read(u+l);const d=new Map;const f=this.toString(c,"ascii").split(n);if(f.length<2){return d}for(let p=0;p<f.length-2;p++){const y=f[p];const v=y.indexOf(":");if(v===-1){throw new Error(`Message header must separate key and value using ':'
${y}`)}const k=y.substr(0,v);const $=y.substr(v+1).trim();d.set(a?k.toLowerCase():k,$)}return d}tryReadBody(a){if(this._totalLength<a){return void 0}return this._read(a)}get numberOfBytes(){return this._totalLength}_read(a){if(a===0){return this.emptyBuffer()}if(a>this._totalLength){throw new Error(`Cannot read so many bytes!`)}if(this._chunks[0].byteLength===a){const u=this._chunks[0];this._chunks.shift();this._totalLength-=a;return this.asNative(u)}if(this._chunks[0].byteLength>a){const u=this._chunks[0];const c=this.asNative(u,a);this._chunks[0]=u.slice(a);this._totalLength-=a;return c}const s=this.allocNative(a);let o=0;let l=0;while(a>0){const u=this._chunks[l];if(u.byteLength>a){const c=u.slice(0,a);s.set(c,o);o+=a;this._chunks[l]=u.slice(a);this._totalLength-=a;a-=a}else{s.set(u,o);o+=u.byteLength;this._chunks.shift();this._totalLength-=u.byteLength;a-=u.byteLength}}return s}}yi.AbstractMessageBuffer=r;return yi}var _c={};var xh;function s_(){if(xh)return _c;xh=1;(function(t){Object.defineProperty(t,"__esModule",{value:true});t.createMessageConnection=t.ConnectionOptions=t.MessageStrategy=t.CancellationStrategy=t.CancellationSenderStrategy=t.CancellationReceiverStrategy=t.RequestCancellationReceiverStrategy=t.IdCancellationReceiverStrategy=t.ConnectionStrategy=t.ConnectionError=t.ConnectionErrors=t.LogTraceNotification=t.SetTraceNotification=t.TraceFormat=t.TraceValues=t.Trace=t.NullLogger=t.ProgressType=t.ProgressToken=void 0;const e=Ir();const n=fs();const r=Xv();const i=Yv();const a=ps();const s=Wp();var o;(function(g){g.type=new r.NotificationType("$/cancelRequest")})(o||(o={}));var l;(function(g){function b(M){return typeof M==="string"||typeof M==="number"}g.is=b})(l||(t.ProgressToken=l={}));var u;(function(g){g.type=new r.NotificationType("$/progress")})(u||(u={}));class c{constructor(){}}t.ProgressType=c;var d;(function(g){function b(M){return n.func(M)}g.is=b})(d||(d={}));t.NullLogger=Object.freeze({error:()=>{},warn:()=>{},info:()=>{},log:()=>{}});var f;(function(g){g[g["Off"]=0]="Off";g[g["Messages"]=1]="Messages";g[g["Compact"]=2]="Compact";g[g["Verbose"]=3]="Verbose"})(f||(t.Trace=f={}));var p;(function(g){g.Off="off";g.Messages="messages";g.Compact="compact";g.Verbose="verbose"})(p||(t.TraceValues=p={}));(function(g){function b(O){if(!n.string(O)){return g.Off}O=O.toLowerCase();switch(O){case"off":return g.Off;case"messages":return g.Messages;case"compact":return g.Compact;case"verbose":return g.Verbose;default:return g.Off}}g.fromString=b;function M(O){switch(O){case g.Off:return"off";case g.Messages:return"messages";case g.Compact:return"compact";case g.Verbose:return"verbose";default:return"off"}}g.toString=M})(f||(t.Trace=f={}));var y;(function(g){g["Text"]="text";g["JSON"]="json"})(y||(t.TraceFormat=y={}));(function(g){function b(M){if(!n.string(M)){return g.Text}M=M.toLowerCase();if(M==="json"){return g.JSON}else{return g.Text}}g.fromString=b})(y||(t.TraceFormat=y={}));var v;(function(g){g.type=new r.NotificationType("$/setTrace")})(v||(t.SetTraceNotification=v={}));var k;(function(g){g.type=new r.NotificationType("$/logTrace")})(k||(t.LogTraceNotification=k={}));var $;(function(g){g[g["Closed"]=1]="Closed";g[g["Disposed"]=2]="Disposed";g[g["AlreadyListening"]=3]="AlreadyListening"})($||(t.ConnectionErrors=$={}));class E extends Error{constructor(b,M){super(M);this.code=b;Object.setPrototypeOf(this,E.prototype)}}t.ConnectionError=E;var C;(function(g){function b(M){const O=M;return O&&n.func(O.cancelUndispatched)}g.is=b})(C||(t.ConnectionStrategy=C={}));var I;(function(g){function b(M){const O=M;return O&&(O.kind===void 0||O.kind==="id")&&n.func(O.createCancellationTokenSource)&&(O.dispose===void 0||n.func(O.dispose))}g.is=b})(I||(t.IdCancellationReceiverStrategy=I={}));var Y;(function(g){function b(M){const O=M;return O&&O.kind==="request"&&n.func(O.createCancellationTokenSource)&&(O.dispose===void 0||n.func(O.dispose))}g.is=b})(Y||(t.RequestCancellationReceiverStrategy=Y={}));var q;(function(g){g.Message=Object.freeze({createCancellationTokenSource(M){return new s.CancellationTokenSource}});function b(M){return I.is(M)||Y.is(M)}g.is=b})(q||(t.CancellationReceiverStrategy=q={}));var J;(function(g){g.Message=Object.freeze({sendCancellation(M,O){return M.sendNotification(o.type,{id:O})},cleanup(M){}});function b(M){const O=M;return O&&n.func(O.sendCancellation)&&n.func(O.cleanup)}g.is=b})(J||(t.CancellationSenderStrategy=J={}));var ne;(function(g){g.Message=Object.freeze({receiver:q.Message,sender:J.Message});function b(M){const O=M;return O&&q.is(O.receiver)&&J.is(O.sender)}g.is=b})(ne||(t.CancellationStrategy=ne={}));var ae;(function(g){function b(M){const O=M;return O&&n.func(O.handleMessage)}g.is=b})(ae||(t.MessageStrategy=ae={}));var de;(function(g){function b(M){const O=M;return O&&(ne.is(O.cancellationStrategy)||C.is(O.connectionStrategy)||ae.is(O.messageStrategy))}g.is=b})(de||(t.ConnectionOptions=de={}));var L;(function(g){g[g["New"]=1]="New";g[g["Listening"]=2]="Listening";g[g["Closed"]=3]="Closed";g[g["Disposed"]=4]="Disposed"})(L||(L={}));function w(g,b,M,O){const x=M!==void 0?M:t.NullLogger;let we=0;let K=0;let N=0;const re="2.0";let kt=void 0;const bt=new Map;let Ce=void 0;const Nt=new Map;const me=new Map;let Pe;let je=new i.LinkedMap;let Re=new Map;let j=new Set;let R=new Map;let A=f.Off;let B=y.Text;let S;let fe=L.New;const st=new a.Emitter;const zt=new a.Emitter;const Bn=new a.Emitter;const Wn=new a.Emitter;const Vn=new a.Emitter;const Tt=O&&O.cancellationStrategy?O.cancellationStrategy:ne.Message;function nn(h){if(h===null){throw new Error(`Can't send requests with id null since the response can't be correlated.`)}return"req-"+h.toString()}function Lr(h){if(h===null){return"res-unknown-"+(++N).toString()}else{return"res-"+h.toString()}}function hn(){return"not-"+(++K).toString()}function yn(h,D){if(r.Message.isRequest(D)){h.set(nn(D.id),D)}else if(r.Message.isResponse(D)){h.set(Lr(D.id),D)}else{h.set(hn(),D)}}function rn(h){return void 0}function Gt(){return fe===L.Listening}function P(){return fe===L.Closed}function _(){return fe===L.Disposed}function G(){if(fe===L.New||fe===L.Listening){fe=L.Closed;zt.fire(void 0)}}function Et(h){st.fire([h,void 0,void 0])}function dt(h){st.fire(h)}g.onClose(G);g.onError(Et);b.onClose(G);b.onError(dt);function sr(){if(Pe||je.size===0){return}Pe=(0,e.default)().timer.setImmediate(()=>{Pe=void 0;hs()})}function ii(h){if(r.Message.isRequest(h)){gs(h)}else if(r.Message.isNotification(h)){vs(h)}else if(r.Message.isResponse(h)){Rs(h)}else{$s(h)}}function hs(){if(je.size===0){return}const h=je.shift();try{const D=O?.messageStrategy;if(ae.is(D)){D.handleMessage(h,ii)}else{ii(h)}}finally{sr()}}const ys=h=>{try{if(r.Message.isNotification(h)&&h.method===o.type.method){const D=h.params.id;const F=nn(D);const W=je.get(F);if(r.Message.isRequest(W)){const he=O?.connectionStrategy;const _e=he&&he.cancelUndispatched?he.cancelUndispatched(W,rn):rn(W);if(_e&&(_e.error!==void 0||_e.result!==void 0)){je.delete(F);R.delete(D);_e.id=W.id;or(_e,h.method,Date.now());b.write(_e).catch(()=>x.error(`Sending response for canceled message failed.`));return}}const $e=R.get(D);if($e!==void 0){$e.cancel();xr(h);return}else{j.add(D)}}yn(je,h)}finally{sr()}};function gs(h){if(_()){return}function D(se,Se,pe){const Be={jsonrpc:re,id:h.id};if(se instanceof r.ResponseError){Be.error=se.toJson()}else{Be.result=se===void 0?null:se}or(Be,Se,pe);b.write(Be).catch(()=>x.error(`Sending response failed.`))}function F(se,Se,pe){const Be={jsonrpc:re,id:h.id,error:se.toJson()};or(Be,Se,pe);b.write(Be).catch(()=>x.error(`Sending response failed.`))}function W(se,Se,pe){if(se===void 0){se=null}const Be={jsonrpc:re,id:h.id,result:se};or(Be,Se,pe);b.write(Be).catch(()=>x.error(`Sending response failed.`))}ws(h);const $e=bt.get(h.method);let he;let _e;if($e){he=$e.type;_e=$e.handler}const Me=Date.now();if(_e||kt){const se=h.id??String(Date.now());const Se=I.is(Tt.receiver)?Tt.receiver.createCancellationTokenSource(se):Tt.receiver.createCancellationTokenSource(h);if(h.id!==null&&j.has(h.id)){Se.cancel()}if(h.id!==null){R.set(se,Se)}try{let pe;if(_e){if(h.params===void 0){if(he!==void 0&&he.numberOfParams!==0){F(new r.ResponseError(r.ErrorCodes.InvalidParams,`Request ${h.method} defines ${he.numberOfParams} params but received none.`),h.method,Me);return}pe=_e(Se.token)}else if(Array.isArray(h.params)){if(he!==void 0&&he.parameterStructures===r.ParameterStructures.byName){F(new r.ResponseError(r.ErrorCodes.InvalidParams,`Request ${h.method} defines parameters by name but received parameters by position`),h.method,Me);return}pe=_e(...h.params,Se.token)}else{if(he!==void 0&&he.parameterStructures===r.ParameterStructures.byPosition){F(new r.ResponseError(r.ErrorCodes.InvalidParams,`Request ${h.method} defines parameters by position but received parameters by name`),h.method,Me);return}pe=_e(h.params,Se.token)}}else if(kt){pe=kt(h.method,h.params,Se.token)}const Be=pe;if(!pe){R.delete(se);W(pe,h.method,Me)}else if(Be.then){Be.then(ft=>{R.delete(se);D(ft,h.method,Me)},ft=>{R.delete(se);if(ft instanceof r.ResponseError){F(ft,h.method,Me)}else if(ft&&n.string(ft.message)){F(new r.ResponseError(r.ErrorCodes.InternalError,`Request ${h.method} failed with message: ${ft.message}`),h.method,Me)}else{F(new r.ResponseError(r.ErrorCodes.InternalError,`Request ${h.method} failed unexpectedly without providing any details.`),h.method,Me)}})}else{R.delete(se);D(pe,h.method,Me)}}catch(pe){R.delete(se);if(pe instanceof r.ResponseError){D(pe,h.method,Me)}else if(pe&&n.string(pe.message)){F(new r.ResponseError(r.ErrorCodes.InternalError,`Request ${h.method} failed with message: ${pe.message}`),h.method,Me)}else{F(new r.ResponseError(r.ErrorCodes.InternalError,`Request ${h.method} failed unexpectedly without providing any details.`),h.method,Me)}}}else{F(new r.ResponseError(r.ErrorCodes.MethodNotFound,`Unhandled method ${h.method}`),h.method,Me)}}function Rs(h){if(_()){return}if(h.id===null){if(h.error){x.error(`Received response message without id: Error is: 
${JSON.stringify(h.error,void 0,4)}`)}else{x.error(`Received response message without id. No further error information provided.`)}}else{const D=h.id;const F=Re.get(D);Cs(h,F);if(F!==void 0){Re.delete(D);try{if(h.error){const W=h.error;F.reject(new r.ResponseError(W.code,W.message,W.data))}else if(h.result!==void 0){F.resolve(h.result)}else{throw new Error("Should never happen.")}}catch(W){if(W.message){x.error(`Response handler '${F.method}' failed with message: ${W.message}`)}else{x.error(`Response handler '${F.method}' failed unexpectedly.`)}}}}}function vs(h){if(_()){return}let D=void 0;let F;if(h.method===o.type.method){const W=h.params.id;j.delete(W);xr(h);return}else{const W=Nt.get(h.method);if(W){F=W.handler;D=W.type}}if(F||Ce){try{xr(h);if(F){if(h.params===void 0){if(D!==void 0){if(D.numberOfParams!==0&&D.parameterStructures!==r.ParameterStructures.byName){x.error(`Notification ${h.method} defines ${D.numberOfParams} params but received none.`)}}F()}else if(Array.isArray(h.params)){const W=h.params;if(h.method===u.type.method&&W.length===2&&l.is(W[0])){F({token:W[0],value:W[1]})}else{if(D!==void 0){if(D.parameterStructures===r.ParameterStructures.byName){x.error(`Notification ${h.method} defines parameters by name but received parameters by position`)}if(D.numberOfParams!==h.params.length){x.error(`Notification ${h.method} defines ${D.numberOfParams} params but received ${W.length} arguments`)}}F(...W)}}else{if(D!==void 0&&D.parameterStructures===r.ParameterStructures.byPosition){x.error(`Notification ${h.method} defines parameters by position but received parameters by name`)}F(h.params)}}else if(Ce){Ce(h.method,h.params)}}catch(W){if(W.message){x.error(`Notification handler '${h.method}' failed with message: ${W.message}`)}else{x.error(`Notification handler '${h.method}' failed unexpectedly.`)}}}else{Bn.fire(h)}}function $s(h){if(!h){x.error("Received empty message.");return}x.error(`Received message which is neither a response nor a notification message:
${JSON.stringify(h,null,4)}`);const D=h;if(n.string(D.id)||n.number(D.id)){const F=D.id;const W=Re.get(F);if(W){W.reject(new Error("The received response has neither a result nor an error property."))}}}function Xt(h){if(h===void 0||h===null){return void 0}switch(A){case f.Verbose:return JSON.stringify(h,null,4);case f.Compact:return JSON.stringify(h);default:return void 0}}function Ts(h){if(A===f.Off||!S){return}if(B===y.Text){let D=void 0;if((A===f.Verbose||A===f.Compact)&&h.params){D=`Params: ${Xt(h.params)}

`}S.log(`Sending request '${h.method} - (${h.id})'.`,D)}else{gn("send-request",h)}}function Es(h){if(A===f.Off||!S){return}if(B===y.Text){let D=void 0;if(A===f.Verbose||A===f.Compact){if(h.params){D=`Params: ${Xt(h.params)}

`}else{D="No parameters provided.\n\n"}}S.log(`Sending notification '${h.method}'.`,D)}else{gn("send-notification",h)}}function or(h,D,F){if(A===f.Off||!S){return}if(B===y.Text){let W=void 0;if(A===f.Verbose||A===f.Compact){if(h.error&&h.error.data){W=`Error data: ${Xt(h.error.data)}

`}else{if(h.result){W=`Result: ${Xt(h.result)}

`}else if(h.error===void 0){W="No result returned.\n\n"}}}S.log(`Sending response '${D} - (${h.id})'. Processing request took ${Date.now()-F}ms`,W)}else{gn("send-response",h)}}function ws(h){if(A===f.Off||!S){return}if(B===y.Text){let D=void 0;if((A===f.Verbose||A===f.Compact)&&h.params){D=`Params: ${Xt(h.params)}

`}S.log(`Received request '${h.method} - (${h.id})'.`,D)}else{gn("receive-request",h)}}function xr(h){if(A===f.Off||!S||h.method===k.type.method){return}if(B===y.Text){let D=void 0;if(A===f.Verbose||A===f.Compact){if(h.params){D=`Params: ${Xt(h.params)}

`}else{D="No parameters provided.\n\n"}}S.log(`Received notification '${h.method}'.`,D)}else{gn("receive-notification",h)}}function Cs(h,D){if(A===f.Off||!S){return}if(B===y.Text){let F=void 0;if(A===f.Verbose||A===f.Compact){if(h.error&&h.error.data){F=`Error data: ${Xt(h.error.data)}

`}else{if(h.result){F=`Result: ${Xt(h.result)}

`}else if(h.error===void 0){F="No result returned.\n\n"}}}if(D){const W=h.error?` Request failed: ${h.error.message} (${h.error.code}).`:"";S.log(`Received response '${D.method} - (${h.id})' in ${Date.now()-D.timerStart}ms.${W}`,F)}else{S.log(`Received response ${h.id} without active response promise.`,F)}}else{gn("receive-response",h)}}function gn(h,D){if(!S||A===f.Off){return}const F={isLSPMessage:true,type:h,message:D,timestamp:Date.now()};S.log(F)}function zn(){if(P()){throw new E($.Closed,"Connection is closed.")}if(_()){throw new E($.Disposed,"Connection is disposed.")}}function Ss(){if(Gt()){throw new E($.AlreadyListening,"Connection is already listening")}}function As(){if(!Gt()){throw new Error("Call listen() first.")}}function Xn(h){if(h===void 0){return null}else{return h}}function ai(h){if(h===null){return void 0}else{return h}}function m(h){return h!==void 0&&h!==null&&!Array.isArray(h)&&typeof h==="object"}function Le(h,D){switch(h){case r.ParameterStructures.auto:if(m(D)){return ai(D)}else{return[Xn(D)]}case r.ParameterStructures.byName:if(!m(D)){throw new Error(`Received parameters by name but param is not an object literal.`)}return ai(D);case r.ParameterStructures.byPosition:return[Xn(D)];default:throw new Error(`Unknown parameter structure ${h.toString()}`)}}function xe(h,D){let F;const W=h.numberOfParams;switch(W){case 0:F=void 0;break;case 1:F=Le(h.parameterStructures,D[0]);break;default:F=[];for(let $e=0;$e<D.length&&$e<W;$e++){F.push(Xn(D[$e]))}if(D.length<W){for(let $e=D.length;$e<W;$e++){F.push(null)}}break}return F}const ee={sendNotification:(h,...D)=>{zn();let F;let W;if(n.string(h)){F=h;const he=D[0];let _e=0;let Me=r.ParameterStructures.auto;if(r.ParameterStructures.is(he)){_e=1;Me=he}let se=D.length;const Se=se-_e;switch(Se){case 0:W=void 0;break;case 1:W=Le(Me,D[_e]);break;default:if(Me===r.ParameterStructures.byName){throw new Error(`Received ${Se} parameters for 'by Name' notification parameter structure.`)}W=D.slice(_e,se).map(pe=>Xn(pe));break}}else{const he=D;F=h.method;W=xe(h,he)}const $e={jsonrpc:re,method:F,params:W};Es($e);return b.write($e).catch(he=>{x.error(`Sending notification failed.`);throw he})},onNotification:(h,D)=>{zn();let F;if(n.func(h)){Ce=h}else if(D){if(n.string(h)){F=h;Nt.set(h,{type:void 0,handler:D})}else{F=h.method;Nt.set(h.method,{type:h,handler:D})}}return{dispose:()=>{if(F!==void 0){Nt.delete(F)}else{Ce=void 0}}}},onProgress:(h,D,F)=>{if(me.has(D)){throw new Error(`Progress handler for token ${D} already registered`)}me.set(D,F);return{dispose:()=>{me.delete(D)}}},sendProgress:(h,D,F)=>{return ee.sendNotification(u.type,{token:D,value:F})},onUnhandledProgress:Wn.event,sendRequest:(h,...D)=>{zn();As();let F;let W;let $e=void 0;if(n.string(h)){F=h;const se=D[0];const Se=D[D.length-1];let pe=0;let Be=r.ParameterStructures.auto;if(r.ParameterStructures.is(se)){pe=1;Be=se}let ft=D.length;if(s.CancellationToken.is(Se)){ft=ft-1;$e=Se}const an=ft-pe;switch(an){case 0:W=void 0;break;case 1:W=Le(Be,D[pe]);break;default:if(Be===r.ParameterStructures.byName){throw new Error(`Received ${an} parameters for 'by Name' request parameter structure.`)}W=D.slice(pe,ft).map(R$=>Xn(R$));break}}else{const se=D;F=h.method;W=xe(h,se);const Se=h.numberOfParams;$e=s.CancellationToken.is(se[Se])?se[Se]:void 0}const he=we++;let _e;if($e){_e=$e.onCancellationRequested(()=>{const se=Tt.sender.sendCancellation(ee,he);if(se===void 0){x.log(`Received no promise from cancellation strategy when cancelling id ${he}`);return Promise.resolve()}else{return se.catch(()=>{x.log(`Sending cancellation messages for id ${he} failed`)})}})}const Me={jsonrpc:re,id:he,method:F,params:W};Ts(Me);if(typeof Tt.sender.enableCancellation==="function"){Tt.sender.enableCancellation(Me)}return new Promise(async(se,Se)=>{const pe=an=>{se(an);Tt.sender.cleanup(he);_e?.dispose()};const Be=an=>{Se(an);Tt.sender.cleanup(he);_e?.dispose()};const ft={method:F,timerStart:Date.now(),resolve:pe,reject:Be};try{await b.write(Me);Re.set(he,ft)}catch(an){x.error(`Sending request failed.`);ft.reject(new r.ResponseError(r.ErrorCodes.MessageWriteError,an.message?an.message:"Unknown reason"));throw an}})},onRequest:(h,D)=>{zn();let F=null;if(d.is(h)){F=void 0;kt=h}else if(n.string(h)){F=null;if(D!==void 0){F=h;bt.set(h,{handler:D,type:void 0})}}else{if(D!==void 0){F=h.method;bt.set(h.method,{type:h,handler:D})}}return{dispose:()=>{if(F===null){return}if(F!==void 0){bt.delete(F)}else{kt=void 0}}}},hasPendingResponse:()=>{return Re.size>0},trace:async(h,D,F)=>{let W=false;let $e=y.Text;if(F!==void 0){if(n.boolean(F)){W=F}else{W=F.sendNotification||false;$e=F.traceFormat||y.Text}}A=h;B=$e;if(A===f.Off){S=void 0}else{S=D}if(W&&!P()&&!_()){await ee.sendNotification(v.type,{value:f.toString(h)})}},onError:st.event,onClose:zt.event,onUnhandledNotification:Bn.event,onDispose:Vn.event,end:()=>{b.end()},dispose:()=>{if(_()){return}fe=L.Disposed;Vn.fire(void 0);const h=new r.ResponseError(r.ErrorCodes.PendingResponseRejected,"Pending response rejected since connection got disposed");for(const D of Re.values()){D.reject(h)}Re=new Map;R=new Map;j=new Set;je=new i.LinkedMap;if(n.func(b.dispose)){b.dispose()}if(n.func(g.dispose)){g.dispose()}},listen:()=>{zn();Ss();fe=L.Listening;g.listen(ys)},inspect:()=>{(0,e.default)().console.log("inspect")}};ee.onNotification(k.type,h=>{if(A===f.Off||!S){return}const D=A===f.Verbose||A===f.Compact;S.log(h.message,D?h.verbose:void 0)});ee.onNotification(u.type,h=>{const D=me.get(h.token);if(D){D(h.value)}else{Wn.fire(h)}});return ee}t.createMessageConnection=w})(_c);return _c}var Mh;function ip(){if(Mh)return Pc;Mh=1;(function(t){Object.defineProperty(t,"__esModule",{value:true});t.ProgressType=t.ProgressToken=t.createMessageConnection=t.NullLogger=t.ConnectionOptions=t.ConnectionStrategy=t.AbstractMessageBuffer=t.WriteableStreamMessageWriter=t.AbstractMessageWriter=t.MessageWriter=t.ReadableStreamMessageReader=t.AbstractMessageReader=t.MessageReader=t.SharedArrayReceiverStrategy=t.SharedArraySenderStrategy=t.CancellationToken=t.CancellationTokenSource=t.Emitter=t.Event=t.Disposable=t.LRUCache=t.Touch=t.LinkedMap=t.ParameterStructures=t.NotificationType9=t.NotificationType8=t.NotificationType7=t.NotificationType6=t.NotificationType5=t.NotificationType4=t.NotificationType3=t.NotificationType2=t.NotificationType1=t.NotificationType0=t.NotificationType=t.ErrorCodes=t.ResponseError=t.RequestType9=t.RequestType8=t.RequestType7=t.RequestType6=t.RequestType5=t.RequestType4=t.RequestType3=t.RequestType2=t.RequestType1=t.RequestType0=t.RequestType=t.Message=t.RAL=void 0;t.MessageStrategy=t.CancellationStrategy=t.CancellationSenderStrategy=t.CancellationReceiverStrategy=t.ConnectionError=t.ConnectionErrors=t.LogTraceNotification=t.SetTraceNotification=t.TraceFormat=t.TraceValues=t.Trace=void 0;const e=Xv();Object.defineProperty(t,"Message",{enumerable:true,get:function(){return e.Message}});Object.defineProperty(t,"RequestType",{enumerable:true,get:function(){return e.RequestType}});Object.defineProperty(t,"RequestType0",{enumerable:true,get:function(){return e.RequestType0}});Object.defineProperty(t,"RequestType1",{enumerable:true,get:function(){return e.RequestType1}});Object.defineProperty(t,"RequestType2",{enumerable:true,get:function(){return e.RequestType2}});Object.defineProperty(t,"RequestType3",{enumerable:true,get:function(){return e.RequestType3}});Object.defineProperty(t,"RequestType4",{enumerable:true,get:function(){return e.RequestType4}});Object.defineProperty(t,"RequestType5",{enumerable:true,get:function(){return e.RequestType5}});Object.defineProperty(t,"RequestType6",{enumerable:true,get:function(){return e.RequestType6}});Object.defineProperty(t,"RequestType7",{enumerable:true,get:function(){return e.RequestType7}});Object.defineProperty(t,"RequestType8",{enumerable:true,get:function(){return e.RequestType8}});Object.defineProperty(t,"RequestType9",{enumerable:true,get:function(){return e.RequestType9}});Object.defineProperty(t,"ResponseError",{enumerable:true,get:function(){return e.ResponseError}});Object.defineProperty(t,"ErrorCodes",{enumerable:true,get:function(){return e.ErrorCodes}});Object.defineProperty(t,"NotificationType",{enumerable:true,get:function(){return e.NotificationType}});Object.defineProperty(t,"NotificationType0",{enumerable:true,get:function(){return e.NotificationType0}});Object.defineProperty(t,"NotificationType1",{enumerable:true,get:function(){return e.NotificationType1}});Object.defineProperty(t,"NotificationType2",{enumerable:true,get:function(){return e.NotificationType2}});Object.defineProperty(t,"NotificationType3",{enumerable:true,get:function(){return e.NotificationType3}});Object.defineProperty(t,"NotificationType4",{enumerable:true,get:function(){return e.NotificationType4}});Object.defineProperty(t,"NotificationType5",{enumerable:true,get:function(){return e.NotificationType5}});Object.defineProperty(t,"NotificationType6",{enumerable:true,get:function(){return e.NotificationType6}});Object.defineProperty(t,"NotificationType7",{enumerable:true,get:function(){return e.NotificationType7}});Object.defineProperty(t,"NotificationType8",{enumerable:true,get:function(){return e.NotificationType8}});Object.defineProperty(t,"NotificationType9",{enumerable:true,get:function(){return e.NotificationType9}});Object.defineProperty(t,"ParameterStructures",{enumerable:true,get:function(){return e.ParameterStructures}});const n=Yv();Object.defineProperty(t,"LinkedMap",{enumerable:true,get:function(){return n.LinkedMap}});Object.defineProperty(t,"LRUCache",{enumerable:true,get:function(){return n.LRUCache}});Object.defineProperty(t,"Touch",{enumerable:true,get:function(){return n.Touch}});const r=t_();Object.defineProperty(t,"Disposable",{enumerable:true,get:function(){return r.Disposable}});const i=ps();Object.defineProperty(t,"Event",{enumerable:true,get:function(){return i.Event}});Object.defineProperty(t,"Emitter",{enumerable:true,get:function(){return i.Emitter}});const a=Wp();Object.defineProperty(t,"CancellationTokenSource",{enumerable:true,get:function(){return a.CancellationTokenSource}});Object.defineProperty(t,"CancellationToken",{enumerable:true,get:function(){return a.CancellationToken}});const s=n_();Object.defineProperty(t,"SharedArraySenderStrategy",{enumerable:true,get:function(){return s.SharedArraySenderStrategy}});Object.defineProperty(t,"SharedArrayReceiverStrategy",{enumerable:true,get:function(){return s.SharedArrayReceiverStrategy}});const o=r_();Object.defineProperty(t,"MessageReader",{enumerable:true,get:function(){return o.MessageReader}});Object.defineProperty(t,"AbstractMessageReader",{enumerable:true,get:function(){return o.AbstractMessageReader}});Object.defineProperty(t,"ReadableStreamMessageReader",{enumerable:true,get:function(){return o.ReadableStreamMessageReader}});const l=i_();Object.defineProperty(t,"MessageWriter",{enumerable:true,get:function(){return l.MessageWriter}});Object.defineProperty(t,"AbstractMessageWriter",{enumerable:true,get:function(){return l.AbstractMessageWriter}});Object.defineProperty(t,"WriteableStreamMessageWriter",{enumerable:true,get:function(){return l.WriteableStreamMessageWriter}});const u=a_();Object.defineProperty(t,"AbstractMessageBuffer",{enumerable:true,get:function(){return u.AbstractMessageBuffer}});const c=s_();Object.defineProperty(t,"ConnectionStrategy",{enumerable:true,get:function(){return c.ConnectionStrategy}});Object.defineProperty(t,"ConnectionOptions",{enumerable:true,get:function(){return c.ConnectionOptions}});Object.defineProperty(t,"NullLogger",{enumerable:true,get:function(){return c.NullLogger}});Object.defineProperty(t,"createMessageConnection",{enumerable:true,get:function(){return c.createMessageConnection}});Object.defineProperty(t,"ProgressToken",{enumerable:true,get:function(){return c.ProgressToken}});Object.defineProperty(t,"ProgressType",{enumerable:true,get:function(){return c.ProgressType}});Object.defineProperty(t,"Trace",{enumerable:true,get:function(){return c.Trace}});Object.defineProperty(t,"TraceValues",{enumerable:true,get:function(){return c.TraceValues}});Object.defineProperty(t,"TraceFormat",{enumerable:true,get:function(){return c.TraceFormat}});Object.defineProperty(t,"SetTraceNotification",{enumerable:true,get:function(){return c.SetTraceNotification}});Object.defineProperty(t,"LogTraceNotification",{enumerable:true,get:function(){return c.LogTraceNotification}});Object.defineProperty(t,"ConnectionErrors",{enumerable:true,get:function(){return c.ConnectionErrors}});Object.defineProperty(t,"ConnectionError",{enumerable:true,get:function(){return c.ConnectionError}});Object.defineProperty(t,"CancellationReceiverStrategy",{enumerable:true,get:function(){return c.CancellationReceiverStrategy}});Object.defineProperty(t,"CancellationSenderStrategy",{enumerable:true,get:function(){return c.CancellationSenderStrategy}});Object.defineProperty(t,"CancellationStrategy",{enumerable:true,get:function(){return c.CancellationStrategy}});Object.defineProperty(t,"MessageStrategy",{enumerable:true,get:function(){return c.MessageStrategy}});const d=Ir();t.RAL=d.default})(Pc);return Pc}var Fh;function o_(){if(Fh)return js;Fh=1;Object.defineProperty(js,"__esModule",{value:true});const t=ip();class e extends t.AbstractMessageBuffer{constructor(l="utf-8"){super(l);this.asciiDecoder=new TextDecoder("ascii")}emptyBuffer(){return e.emptyBuffer}fromString(l,u){return new TextEncoder().encode(l)}toString(l,u){if(u==="ascii"){return this.asciiDecoder.decode(l)}else{return new TextDecoder(u).decode(l)}}asNative(l,u){if(u===void 0){return l}else{return l.slice(0,u)}}allocNative(l){return new Uint8Array(l)}}e.emptyBuffer=new Uint8Array(0);class n{constructor(l){this.socket=l;this._onData=new t.Emitter;this._messageListener=u=>{const c=u.data;c.arrayBuffer().then(d=>{this._onData.fire(new Uint8Array(d))},()=>{(0,t.RAL)().console.error(`Converting blob to array buffer failed.`)})};this.socket.addEventListener("message",this._messageListener)}onClose(l){this.socket.addEventListener("close",l);return t.Disposable.create(()=>this.socket.removeEventListener("close",l))}onError(l){this.socket.addEventListener("error",l);return t.Disposable.create(()=>this.socket.removeEventListener("error",l))}onEnd(l){this.socket.addEventListener("end",l);return t.Disposable.create(()=>this.socket.removeEventListener("end",l))}onData(l){return this._onData.event(l)}}class r{constructor(l){this.socket=l}onClose(l){this.socket.addEventListener("close",l);return t.Disposable.create(()=>this.socket.removeEventListener("close",l))}onError(l){this.socket.addEventListener("error",l);return t.Disposable.create(()=>this.socket.removeEventListener("error",l))}onEnd(l){this.socket.addEventListener("end",l);return t.Disposable.create(()=>this.socket.removeEventListener("end",l))}write(l,u){if(typeof l==="string"){if(u!==void 0&&u!=="utf-8"){throw new Error(`In a Browser environments only utf-8 text encoding is supported. But got encoding: ${u}`)}this.socket.send(l)}else{this.socket.send(l)}return Promise.resolve()}end(){this.socket.close()}}const i=new TextEncoder;const a=Object.freeze({messageBuffer:Object.freeze({create:o=>new e(o)}),applicationJson:Object.freeze({encoder:Object.freeze({name:"application/json",encode:(o,l)=>{if(l.charset!=="utf-8"){throw new Error(`In a Browser environments only utf-8 text encoding is supported. But got encoding: ${l.charset}`)}return Promise.resolve(i.encode(JSON.stringify(o,void 0,0)))}}),decoder:Object.freeze({name:"application/json",decode:(o,l)=>{if(!(o instanceof Uint8Array)){throw new Error(`In a Browser environments only Uint8Arrays are supported.`)}return Promise.resolve(JSON.parse(new TextDecoder(l.charset).decode(o)))}})}),stream:Object.freeze({asReadableStream:o=>new n(o),asWritableStream:o=>new r(o)}),console,timer:Object.freeze({setTimeout(o,l,...u){const c=setTimeout(o,l,...u);return{dispose:()=>clearTimeout(c)}},setImmediate(o,...l){const u=setTimeout(o,0,...l);return{dispose:()=>clearTimeout(u)}},setInterval(o,l,...u){const c=setInterval(o,l,...u);return{dispose:()=>clearInterval(c)}}})});function s(){return a}(function(o){function l(){t.RAL.install(a)}o.install=l})(s);js.default=s;return js}var Kh;function ri(){if(Kh)return pi;Kh=1;(function(t){var e=pi.__createBinding||(Object.create?function(l,u,c,d){if(d===void 0)d=c;var f=Object.getOwnPropertyDescriptor(u,c);if(!f||("get"in f?!u.__esModule:f.writable||f.configurable)){f={enumerable:true,get:function(){return u[c]}}}Object.defineProperty(l,d,f)}:function(l,u,c,d){if(d===void 0)d=c;l[d]=u[c]});var n=pi.__exportStar||function(l,u){for(var c in l)if(c!=="default"&&!Object.prototype.hasOwnProperty.call(u,c))e(u,l,c)};Object.defineProperty(t,"__esModule",{value:true});t.createMessageConnection=t.BrowserMessageWriter=t.BrowserMessageReader=void 0;const r=o_();r.default.install();const i=ip();n(ip(),t);class a extends i.AbstractMessageReader{constructor(u){super();this._onData=new i.Emitter;this._messageListener=c=>{this._onData.fire(c.data)};u.addEventListener("error",c=>this.fireError(c));u.onmessage=this._messageListener}listen(u){return this._onData.event(u)}}t.BrowserMessageReader=a;class s extends i.AbstractMessageWriter{constructor(u){super();this.port=u;this.errorCount=0;u.addEventListener("error",c=>this.fireError(c))}write(u){try{this.port.postMessage(u);return Promise.resolve()}catch(c){this.handleError(c,u);return Promise.reject(c)}}handleError(u,c){this.errorCount++;this.fireError(u,c,this.errorCount)}end(){}}t.BrowserMessageWriter=s;function o(l,u,c,d){if(c===void 0){c=i.NullLogger}if(i.ConnectionStrategy.is(d)){d={connectionStrategy:d}}return(0,i.createMessageConnection)(l,u,c,d)}t.createMessageConnection=o})(pi);return pi}var Dc;var Uh;function Gh(){if(Uh)return Dc;Uh=1;Dc=ri();return Dc}var gi={};var Vp=iP(FN);var pt={};var Hh;function Ne(){if(Hh)return pt;Hh=1;Object.defineProperty(pt,"__esModule",{value:true});pt.ProtocolNotificationType=pt.ProtocolNotificationType0=pt.ProtocolRequestType=pt.ProtocolRequestType0=pt.RegistrationType=pt.MessageDirection=void 0;const t=ri();var e;(function(o){o["clientToServer"]="clientToServer";o["serverToClient"]="serverToClient";o["both"]="both"})(e||(pt.MessageDirection=e={}));class n{constructor(l){this.method=l}}pt.RegistrationType=n;class r extends t.RequestType0{constructor(l){super(l)}}pt.ProtocolRequestType0=r;class i extends t.RequestType{constructor(l){super(l,t.ParameterStructures.byName)}}pt.ProtocolRequestType=i;class a extends t.NotificationType0{constructor(l){super(l)}}pt.ProtocolNotificationType0=a;class s extends t.NotificationType{constructor(l){super(l,t.ParameterStructures.byName)}}pt.ProtocolNotificationType=s;return pt}var Oc={};var Fe={};var qh;function zp(){if(qh)return Fe;qh=1;Object.defineProperty(Fe,"__esModule",{value:true});Fe.objectLiteral=Fe.typedArray=Fe.stringArray=Fe.array=Fe.func=Fe.error=Fe.number=Fe.string=Fe.boolean=void 0;function t(u){return u===true||u===false}Fe.boolean=t;function e(u){return typeof u==="string"||u instanceof String}Fe.string=e;function n(u){return typeof u==="number"||u instanceof Number}Fe.number=n;function r(u){return u instanceof Error}Fe.error=r;function i(u){return typeof u==="function"}Fe.func=i;function a(u){return Array.isArray(u)}Fe.array=a;function s(u){return a(u)&&u.every(c=>e(c))}Fe.stringArray=s;function o(u,c){return Array.isArray(u)&&u.every(c)}Fe.typedArray=o;function l(u){return u!==null&&typeof u==="object"}Fe.objectLiteral=l;return Fe}var Ri={};var jh;function l_(){if(jh)return Ri;jh=1;Object.defineProperty(Ri,"__esModule",{value:true});Ri.ImplementationRequest=void 0;const t=Ne();var e;(function(n){n.method="textDocument/implementation";n.messageDirection=t.MessageDirection.clientToServer;n.type=new t.ProtocolRequestType(n.method)})(e||(Ri.ImplementationRequest=e={}));return Ri}var vi={};var Bh;function u_(){if(Bh)return vi;Bh=1;Object.defineProperty(vi,"__esModule",{value:true});vi.TypeDefinitionRequest=void 0;const t=Ne();var e;(function(n){n.method="textDocument/typeDefinition";n.messageDirection=t.MessageDirection.clientToServer;n.type=new t.ProtocolRequestType(n.method)})(e||(vi.TypeDefinitionRequest=e={}));return vi}var pr={};var Wh;function c_(){if(Wh)return pr;Wh=1;Object.defineProperty(pr,"__esModule",{value:true});pr.DidChangeWorkspaceFoldersNotification=pr.WorkspaceFoldersRequest=void 0;const t=Ne();var e;(function(r){r.method="workspace/workspaceFolders";r.messageDirection=t.MessageDirection.serverToClient;r.type=new t.ProtocolRequestType0(r.method)})(e||(pr.WorkspaceFoldersRequest=e={}));var n;(function(r){r.method="workspace/didChangeWorkspaceFolders";r.messageDirection=t.MessageDirection.clientToServer;r.type=new t.ProtocolNotificationType(r.method)})(n||(pr.DidChangeWorkspaceFoldersNotification=n={}));return pr}var $i={};var Vh;function d_(){if(Vh)return $i;Vh=1;Object.defineProperty($i,"__esModule",{value:true});$i.ConfigurationRequest=void 0;const t=Ne();var e;(function(n){n.method="workspace/configuration";n.messageDirection=t.MessageDirection.serverToClient;n.type=new t.ProtocolRequestType(n.method)})(e||($i.ConfigurationRequest=e={}));return $i}var mr={};var zh;function f_(){if(zh)return mr;zh=1;Object.defineProperty(mr,"__esModule",{value:true});mr.ColorPresentationRequest=mr.DocumentColorRequest=void 0;const t=Ne();var e;(function(r){r.method="textDocument/documentColor";r.messageDirection=t.MessageDirection.clientToServer;r.type=new t.ProtocolRequestType(r.method)})(e||(mr.DocumentColorRequest=e={}));var n;(function(r){r.method="textDocument/colorPresentation";r.messageDirection=t.MessageDirection.clientToServer;r.type=new t.ProtocolRequestType(r.method)})(n||(mr.ColorPresentationRequest=n={}));return mr}var hr={};var Xh;function p_(){if(Xh)return hr;Xh=1;Object.defineProperty(hr,"__esModule",{value:true});hr.FoldingRangeRefreshRequest=hr.FoldingRangeRequest=void 0;const t=Ne();var e;(function(r){r.method="textDocument/foldingRange";r.messageDirection=t.MessageDirection.clientToServer;r.type=new t.ProtocolRequestType(r.method)})(e||(hr.FoldingRangeRequest=e={}));var n;(function(r){r.method=`workspace/foldingRange/refresh`;r.messageDirection=t.MessageDirection.serverToClient;r.type=new t.ProtocolRequestType0(r.method)})(n||(hr.FoldingRangeRefreshRequest=n={}));return hr}var Ti={};var Yh;function m_(){if(Yh)return Ti;Yh=1;Object.defineProperty(Ti,"__esModule",{value:true});Ti.DeclarationRequest=void 0;const t=Ne();var e;(function(n){n.method="textDocument/declaration";n.messageDirection=t.MessageDirection.clientToServer;n.type=new t.ProtocolRequestType(n.method)})(e||(Ti.DeclarationRequest=e={}));return Ti}var Ei={};var Jh;function h_(){if(Jh)return Ei;Jh=1;Object.defineProperty(Ei,"__esModule",{value:true});Ei.SelectionRangeRequest=void 0;const t=Ne();var e;(function(n){n.method="textDocument/selectionRange";n.messageDirection=t.MessageDirection.clientToServer;n.type=new t.ProtocolRequestType(n.method)})(e||(Ei.SelectionRangeRequest=e={}));return Ei}var En={};var Qh;function y_(){if(Qh)return En;Qh=1;Object.defineProperty(En,"__esModule",{value:true});En.WorkDoneProgressCancelNotification=En.WorkDoneProgressCreateRequest=En.WorkDoneProgress=void 0;const t=ri();const e=Ne();var n;(function(a){a.type=new t.ProgressType;function s(o){return o===a.type}a.is=s})(n||(En.WorkDoneProgress=n={}));var r;(function(a){a.method="window/workDoneProgress/create";a.messageDirection=e.MessageDirection.serverToClient;a.type=new e.ProtocolRequestType(a.method)})(r||(En.WorkDoneProgressCreateRequest=r={}));var i;(function(a){a.method="window/workDoneProgress/cancel";a.messageDirection=e.MessageDirection.clientToServer;a.type=new e.ProtocolNotificationType(a.method)})(i||(En.WorkDoneProgressCancelNotification=i={}));return En}var wn={};var Zh;function g_(){if(Zh)return wn;Zh=1;Object.defineProperty(wn,"__esModule",{value:true});wn.CallHierarchyOutgoingCallsRequest=wn.CallHierarchyIncomingCallsRequest=wn.CallHierarchyPrepareRequest=void 0;const t=Ne();var e;(function(i){i.method="textDocument/prepareCallHierarchy";i.messageDirection=t.MessageDirection.clientToServer;i.type=new t.ProtocolRequestType(i.method)})(e||(wn.CallHierarchyPrepareRequest=e={}));var n;(function(i){i.method="callHierarchy/incomingCalls";i.messageDirection=t.MessageDirection.clientToServer;i.type=new t.ProtocolRequestType(i.method)})(n||(wn.CallHierarchyIncomingCallsRequest=n={}));var r;(function(i){i.method="callHierarchy/outgoingCalls";i.messageDirection=t.MessageDirection.clientToServer;i.type=new t.ProtocolRequestType(i.method)})(r||(wn.CallHierarchyOutgoingCallsRequest=r={}));return wn}var mt={};var ey;function R_(){if(ey)return mt;ey=1;Object.defineProperty(mt,"__esModule",{value:true});mt.SemanticTokensRefreshRequest=mt.SemanticTokensRangeRequest=mt.SemanticTokensDeltaRequest=mt.SemanticTokensRequest=mt.SemanticTokensRegistrationType=mt.TokenFormat=void 0;const t=Ne();var e;(function(o){o.Relative="relative"})(e||(mt.TokenFormat=e={}));var n;(function(o){o.method="textDocument/semanticTokens";o.type=new t.RegistrationType(o.method)})(n||(mt.SemanticTokensRegistrationType=n={}));var r;(function(o){o.method="textDocument/semanticTokens/full";o.messageDirection=t.MessageDirection.clientToServer;o.type=new t.ProtocolRequestType(o.method);o.registrationMethod=n.method})(r||(mt.SemanticTokensRequest=r={}));var i;(function(o){o.method="textDocument/semanticTokens/full/delta";o.messageDirection=t.MessageDirection.clientToServer;o.type=new t.ProtocolRequestType(o.method);o.registrationMethod=n.method})(i||(mt.SemanticTokensDeltaRequest=i={}));var a;(function(o){o.method="textDocument/semanticTokens/range";o.messageDirection=t.MessageDirection.clientToServer;o.type=new t.ProtocolRequestType(o.method);o.registrationMethod=n.method})(a||(mt.SemanticTokensRangeRequest=a={}));var s;(function(o){o.method=`workspace/semanticTokens/refresh`;o.messageDirection=t.MessageDirection.serverToClient;o.type=new t.ProtocolRequestType0(o.method)})(s||(mt.SemanticTokensRefreshRequest=s={}));return mt}var wi={};var ty;function v_(){if(ty)return wi;ty=1;Object.defineProperty(wi,"__esModule",{value:true});wi.ShowDocumentRequest=void 0;const t=Ne();var e;(function(n){n.method="window/showDocument";n.messageDirection=t.MessageDirection.serverToClient;n.type=new t.ProtocolRequestType(n.method)})(e||(wi.ShowDocumentRequest=e={}));return wi}var Ci={};var ny;function $_(){if(ny)return Ci;ny=1;Object.defineProperty(Ci,"__esModule",{value:true});Ci.LinkedEditingRangeRequest=void 0;const t=Ne();var e;(function(n){n.method="textDocument/linkedEditingRange";n.messageDirection=t.MessageDirection.clientToServer;n.type=new t.ProtocolRequestType(n.method)})(e||(Ci.LinkedEditingRangeRequest=e={}));return Ci}var Ze={};var ry;function T_(){if(ry)return Ze;ry=1;Object.defineProperty(Ze,"__esModule",{value:true});Ze.WillDeleteFilesRequest=Ze.DidDeleteFilesNotification=Ze.DidRenameFilesNotification=Ze.WillRenameFilesRequest=Ze.DidCreateFilesNotification=Ze.WillCreateFilesRequest=Ze.FileOperationPatternKind=void 0;const t=Ne();var e;(function(l){l.file="file";l.folder="folder"})(e||(Ze.FileOperationPatternKind=e={}));var n;(function(l){l.method="workspace/willCreateFiles";l.messageDirection=t.MessageDirection.clientToServer;l.type=new t.ProtocolRequestType(l.method)})(n||(Ze.WillCreateFilesRequest=n={}));var r;(function(l){l.method="workspace/didCreateFiles";l.messageDirection=t.MessageDirection.clientToServer;l.type=new t.ProtocolNotificationType(l.method)})(r||(Ze.DidCreateFilesNotification=r={}));var i;(function(l){l.method="workspace/willRenameFiles";l.messageDirection=t.MessageDirection.clientToServer;l.type=new t.ProtocolRequestType(l.method)})(i||(Ze.WillRenameFilesRequest=i={}));var a;(function(l){l.method="workspace/didRenameFiles";l.messageDirection=t.MessageDirection.clientToServer;l.type=new t.ProtocolNotificationType(l.method)})(a||(Ze.DidRenameFilesNotification=a={}));var s;(function(l){l.method="workspace/didDeleteFiles";l.messageDirection=t.MessageDirection.clientToServer;l.type=new t.ProtocolNotificationType(l.method)})(s||(Ze.DidDeleteFilesNotification=s={}));var o;(function(l){l.method="workspace/willDeleteFiles";l.messageDirection=t.MessageDirection.clientToServer;l.type=new t.ProtocolRequestType(l.method)})(o||(Ze.WillDeleteFilesRequest=o={}));return Ze}var Cn={};var iy;function E_(){if(iy)return Cn;iy=1;Object.defineProperty(Cn,"__esModule",{value:true});Cn.MonikerRequest=Cn.MonikerKind=Cn.UniquenessLevel=void 0;const t=Ne();var e;(function(i){i.document="document";i.project="project";i.group="group";i.scheme="scheme";i.global="global"})(e||(Cn.UniquenessLevel=e={}));var n;(function(i){i.$import="import";i.$export="export";i.local="local"})(n||(Cn.MonikerKind=n={}));var r;(function(i){i.method="textDocument/moniker";i.messageDirection=t.MessageDirection.clientToServer;i.type=new t.ProtocolRequestType(i.method)})(r||(Cn.MonikerRequest=r={}));return Cn}var Sn={};var ay;function w_(){if(ay)return Sn;ay=1;Object.defineProperty(Sn,"__esModule",{value:true});Sn.TypeHierarchySubtypesRequest=Sn.TypeHierarchySupertypesRequest=Sn.TypeHierarchyPrepareRequest=void 0;const t=Ne();var e;(function(i){i.method="textDocument/prepareTypeHierarchy";i.messageDirection=t.MessageDirection.clientToServer;i.type=new t.ProtocolRequestType(i.method)})(e||(Sn.TypeHierarchyPrepareRequest=e={}));var n;(function(i){i.method="typeHierarchy/supertypes";i.messageDirection=t.MessageDirection.clientToServer;i.type=new t.ProtocolRequestType(i.method)})(n||(Sn.TypeHierarchySupertypesRequest=n={}));var r;(function(i){i.method="typeHierarchy/subtypes";i.messageDirection=t.MessageDirection.clientToServer;i.type=new t.ProtocolRequestType(i.method)})(r||(Sn.TypeHierarchySubtypesRequest=r={}));return Sn}var yr={};var sy;function C_(){if(sy)return yr;sy=1;Object.defineProperty(yr,"__esModule",{value:true});yr.InlineValueRefreshRequest=yr.InlineValueRequest=void 0;const t=Ne();var e;(function(r){r.method="textDocument/inlineValue";r.messageDirection=t.MessageDirection.clientToServer;r.type=new t.ProtocolRequestType(r.method)})(e||(yr.InlineValueRequest=e={}));var n;(function(r){r.method=`workspace/inlineValue/refresh`;r.messageDirection=t.MessageDirection.serverToClient;r.type=new t.ProtocolRequestType0(r.method)})(n||(yr.InlineValueRefreshRequest=n={}));return yr}var An={};var oy;function S_(){if(oy)return An;oy=1;Object.defineProperty(An,"__esModule",{value:true});An.InlayHintRefreshRequest=An.InlayHintResolveRequest=An.InlayHintRequest=void 0;const t=Ne();var e;(function(i){i.method="textDocument/inlayHint";i.messageDirection=t.MessageDirection.clientToServer;i.type=new t.ProtocolRequestType(i.method)})(e||(An.InlayHintRequest=e={}));var n;(function(i){i.method="inlayHint/resolve";i.messageDirection=t.MessageDirection.clientToServer;i.type=new t.ProtocolRequestType(i.method)})(n||(An.InlayHintResolveRequest=n={}));var r;(function(i){i.method=`workspace/inlayHint/refresh`;i.messageDirection=t.MessageDirection.serverToClient;i.type=new t.ProtocolRequestType0(i.method)})(r||(An.InlayHintRefreshRequest=r={}));return An}var Pt={};var ly;function A_(){if(ly)return Pt;ly=1;Object.defineProperty(Pt,"__esModule",{value:true});Pt.DiagnosticRefreshRequest=Pt.WorkspaceDiagnosticRequest=Pt.DocumentDiagnosticRequest=Pt.DocumentDiagnosticReportKind=Pt.DiagnosticServerCancellationData=void 0;const t=ri();const e=zp();const n=Ne();var r;(function(l){function u(c){const d=c;return d&&e.boolean(d.retriggerRequest)}l.is=u})(r||(Pt.DiagnosticServerCancellationData=r={}));var i;(function(l){l.Full="full";l.Unchanged="unchanged"})(i||(Pt.DocumentDiagnosticReportKind=i={}));var a;(function(l){l.method="textDocument/diagnostic";l.messageDirection=n.MessageDirection.clientToServer;l.type=new n.ProtocolRequestType(l.method);l.partialResult=new t.ProgressType})(a||(Pt.DocumentDiagnosticRequest=a={}));var s;(function(l){l.method="workspace/diagnostic";l.messageDirection=n.MessageDirection.clientToServer;l.type=new n.ProtocolRequestType(l.method);l.partialResult=new t.ProgressType})(s||(Pt.WorkspaceDiagnosticRequest=s={}));var o;(function(l){l.method=`workspace/diagnostic/refresh`;l.messageDirection=n.MessageDirection.serverToClient;l.type=new n.ProtocolRequestType0(l.method)})(o||(Pt.DiagnosticRefreshRequest=o={}));return Pt}var Ae={};var uy;function k_(){if(uy)return Ae;uy=1;Object.defineProperty(Ae,"__esModule",{value:true});Ae.DidCloseNotebookDocumentNotification=Ae.DidSaveNotebookDocumentNotification=Ae.DidChangeNotebookDocumentNotification=Ae.NotebookCellArrayChange=Ae.DidOpenNotebookDocumentNotification=Ae.NotebookDocumentSyncRegistrationType=Ae.NotebookDocument=Ae.NotebookCell=Ae.ExecutionSummary=Ae.NotebookCellKind=void 0;const t=Vp;const e=zp();const n=Ne();var r;(function(p){p.Markup=1;p.Code=2;function y(v){return v===1||v===2}p.is=y})(r||(Ae.NotebookCellKind=r={}));var i;(function(p){function y($,E){const C={executionOrder:$};if(E===true||E===false){C.success=E}return C}p.create=y;function v($){const E=$;return e.objectLiteral(E)&&t.uinteger.is(E.executionOrder)&&(E.success===void 0||e.boolean(E.success))}p.is=v;function k($,E){if($===E){return true}if($===null||$===void 0||E===null||E===void 0){return false}return $.executionOrder===E.executionOrder&&$.success===E.success}p.equals=k})(i||(Ae.ExecutionSummary=i={}));var a;(function(p){function y(E,C){return{kind:E,document:C}}p.create=y;function v(E){const C=E;return e.objectLiteral(C)&&r.is(C.kind)&&t.DocumentUri.is(C.document)&&(C.metadata===void 0||e.objectLiteral(C.metadata))}p.is=v;function k(E,C){const I=new Set;if(E.document!==C.document){I.add("document")}if(E.kind!==C.kind){I.add("kind")}if(E.executionSummary!==C.executionSummary){I.add("executionSummary")}if((E.metadata!==void 0||C.metadata!==void 0)&&!$(E.metadata,C.metadata)){I.add("metadata")}if((E.executionSummary!==void 0||C.executionSummary!==void 0)&&!i.equals(E.executionSummary,C.executionSummary)){I.add("executionSummary")}return I}p.diff=k;function $(E,C){if(E===C){return true}if(E===null||E===void 0||C===null||C===void 0){return false}if(typeof E!==typeof C){return false}if(typeof E!=="object"){return false}const I=Array.isArray(E);const Y=Array.isArray(C);if(I!==Y){return false}if(I&&Y){if(E.length!==C.length){return false}for(let q=0;q<E.length;q++){if(!$(E[q],C[q])){return false}}}if(e.objectLiteral(E)&&e.objectLiteral(C)){const q=Object.keys(E);const J=Object.keys(C);if(q.length!==J.length){return false}q.sort();J.sort();if(!$(q,J)){return false}for(let ne=0;ne<q.length;ne++){const ae=q[ne];if(!$(E[ae],C[ae])){return false}}}return true}})(a||(Ae.NotebookCell=a={}));var s;(function(p){function y(k,$,E,C){return{uri:k,notebookType:$,version:E,cells:C}}p.create=y;function v(k){const $=k;return e.objectLiteral($)&&e.string($.uri)&&t.integer.is($.version)&&e.typedArray($.cells,a.is)}p.is=v})(s||(Ae.NotebookDocument=s={}));var o;(function(p){p.method="notebookDocument/sync";p.messageDirection=n.MessageDirection.clientToServer;p.type=new n.RegistrationType(p.method)})(o||(Ae.NotebookDocumentSyncRegistrationType=o={}));var l;(function(p){p.method="notebookDocument/didOpen";p.messageDirection=n.MessageDirection.clientToServer;p.type=new n.ProtocolNotificationType(p.method);p.registrationMethod=o.method})(l||(Ae.DidOpenNotebookDocumentNotification=l={}));var u;(function(p){function y(k){const $=k;return e.objectLiteral($)&&t.uinteger.is($.start)&&t.uinteger.is($.deleteCount)&&($.cells===void 0||e.typedArray($.cells,a.is))}p.is=y;function v(k,$,E){const C={start:k,deleteCount:$};if(E!==void 0){C.cells=E}return C}p.create=v})(u||(Ae.NotebookCellArrayChange=u={}));var c;(function(p){p.method="notebookDocument/didChange";p.messageDirection=n.MessageDirection.clientToServer;p.type=new n.ProtocolNotificationType(p.method);p.registrationMethod=o.method})(c||(Ae.DidChangeNotebookDocumentNotification=c={}));var d;(function(p){p.method="notebookDocument/didSave";p.messageDirection=n.MessageDirection.clientToServer;p.type=new n.ProtocolNotificationType(p.method);p.registrationMethod=o.method})(d||(Ae.DidSaveNotebookDocumentNotification=d={}));var f;(function(p){p.method="notebookDocument/didClose";p.messageDirection=n.MessageDirection.clientToServer;p.type=new n.ProtocolNotificationType(p.method);p.registrationMethod=o.method})(f||(Ae.DidCloseNotebookDocumentNotification=f={}));return Ae}var Si={};var cy;function b_(){if(cy)return Si;cy=1;Object.defineProperty(Si,"__esModule",{value:true});Si.InlineCompletionRequest=void 0;const t=Ne();var e;(function(n){n.method="textDocument/inlineCompletion";n.messageDirection=t.MessageDirection.clientToServer;n.type=new t.ProtocolRequestType(n.method)})(e||(Si.InlineCompletionRequest=e={}));return Si}var dy;function N_(){if(dy)return Oc;dy=1;(function(t){Object.defineProperty(t,"__esModule",{value:true});t.WorkspaceSymbolRequest=t.CodeActionResolveRequest=t.CodeActionRequest=t.DocumentSymbolRequest=t.DocumentHighlightRequest=t.ReferencesRequest=t.DefinitionRequest=t.SignatureHelpRequest=t.SignatureHelpTriggerKind=t.HoverRequest=t.CompletionResolveRequest=t.CompletionRequest=t.CompletionTriggerKind=t.PublishDiagnosticsNotification=t.WatchKind=t.RelativePattern=t.FileChangeType=t.DidChangeWatchedFilesNotification=t.WillSaveTextDocumentWaitUntilRequest=t.WillSaveTextDocumentNotification=t.TextDocumentSaveReason=t.DidSaveTextDocumentNotification=t.DidCloseTextDocumentNotification=t.DidChangeTextDocumentNotification=t.TextDocumentContentChangeEvent=t.DidOpenTextDocumentNotification=t.TextDocumentSyncKind=t.TelemetryEventNotification=t.LogMessageNotification=t.ShowMessageRequest=t.ShowMessageNotification=t.MessageType=t.DidChangeConfigurationNotification=t.ExitNotification=t.ShutdownRequest=t.InitializedNotification=t.InitializeErrorCodes=t.InitializeRequest=t.WorkDoneProgressOptions=t.TextDocumentRegistrationOptions=t.StaticRegistrationOptions=t.PositionEncodingKind=t.FailureHandlingKind=t.ResourceOperationKind=t.UnregistrationRequest=t.RegistrationRequest=t.DocumentSelector=t.NotebookCellTextDocumentFilter=t.NotebookDocumentFilter=t.TextDocumentFilter=void 0;t.MonikerRequest=t.MonikerKind=t.UniquenessLevel=t.WillDeleteFilesRequest=t.DidDeleteFilesNotification=t.WillRenameFilesRequest=t.DidRenameFilesNotification=t.WillCreateFilesRequest=t.DidCreateFilesNotification=t.FileOperationPatternKind=t.LinkedEditingRangeRequest=t.ShowDocumentRequest=t.SemanticTokensRegistrationType=t.SemanticTokensRefreshRequest=t.SemanticTokensRangeRequest=t.SemanticTokensDeltaRequest=t.SemanticTokensRequest=t.TokenFormat=t.CallHierarchyPrepareRequest=t.CallHierarchyOutgoingCallsRequest=t.CallHierarchyIncomingCallsRequest=t.WorkDoneProgressCancelNotification=t.WorkDoneProgressCreateRequest=t.WorkDoneProgress=t.SelectionRangeRequest=t.DeclarationRequest=t.FoldingRangeRefreshRequest=t.FoldingRangeRequest=t.ColorPresentationRequest=t.DocumentColorRequest=t.ConfigurationRequest=t.DidChangeWorkspaceFoldersNotification=t.WorkspaceFoldersRequest=t.TypeDefinitionRequest=t.ImplementationRequest=t.ApplyWorkspaceEditRequest=t.ExecuteCommandRequest=t.PrepareRenameRequest=t.RenameRequest=t.PrepareSupportDefaultBehavior=t.DocumentOnTypeFormattingRequest=t.DocumentRangesFormattingRequest=t.DocumentRangeFormattingRequest=t.DocumentFormattingRequest=t.DocumentLinkResolveRequest=t.DocumentLinkRequest=t.CodeLensRefreshRequest=t.CodeLensResolveRequest=t.CodeLensRequest=t.WorkspaceSymbolResolveRequest=void 0;t.InlineCompletionRequest=t.DidCloseNotebookDocumentNotification=t.DidSaveNotebookDocumentNotification=t.DidChangeNotebookDocumentNotification=t.NotebookCellArrayChange=t.DidOpenNotebookDocumentNotification=t.NotebookDocumentSyncRegistrationType=t.NotebookDocument=t.NotebookCell=t.ExecutionSummary=t.NotebookCellKind=t.DiagnosticRefreshRequest=t.WorkspaceDiagnosticRequest=t.DocumentDiagnosticRequest=t.DocumentDiagnosticReportKind=t.DiagnosticServerCancellationData=t.InlayHintRefreshRequest=t.InlayHintResolveRequest=t.InlayHintRequest=t.InlineValueRefreshRequest=t.InlineValueRequest=t.TypeHierarchySupertypesRequest=t.TypeHierarchySubtypesRequest=t.TypeHierarchyPrepareRequest=void 0;const e=Ne();const n=Vp;const r=zp();const i=l_();Object.defineProperty(t,"ImplementationRequest",{enumerable:true,get:function(){return i.ImplementationRequest}});const a=u_();Object.defineProperty(t,"TypeDefinitionRequest",{enumerable:true,get:function(){return a.TypeDefinitionRequest}});const s=c_();Object.defineProperty(t,"WorkspaceFoldersRequest",{enumerable:true,get:function(){return s.WorkspaceFoldersRequest}});Object.defineProperty(t,"DidChangeWorkspaceFoldersNotification",{enumerable:true,get:function(){return s.DidChangeWorkspaceFoldersNotification}});const o=d_();Object.defineProperty(t,"ConfigurationRequest",{enumerable:true,get:function(){return o.ConfigurationRequest}});const l=f_();Object.defineProperty(t,"DocumentColorRequest",{enumerable:true,get:function(){return l.DocumentColorRequest}});Object.defineProperty(t,"ColorPresentationRequest",{enumerable:true,get:function(){return l.ColorPresentationRequest}});const u=p_();Object.defineProperty(t,"FoldingRangeRequest",{enumerable:true,get:function(){return u.FoldingRangeRequest}});Object.defineProperty(t,"FoldingRangeRefreshRequest",{enumerable:true,get:function(){return u.FoldingRangeRefreshRequest}});const c=m_();Object.defineProperty(t,"DeclarationRequest",{enumerable:true,get:function(){return c.DeclarationRequest}});const d=h_();Object.defineProperty(t,"SelectionRangeRequest",{enumerable:true,get:function(){return d.SelectionRangeRequest}});const f=y_();Object.defineProperty(t,"WorkDoneProgress",{enumerable:true,get:function(){return f.WorkDoneProgress}});Object.defineProperty(t,"WorkDoneProgressCreateRequest",{enumerable:true,get:function(){return f.WorkDoneProgressCreateRequest}});Object.defineProperty(t,"WorkDoneProgressCancelNotification",{enumerable:true,get:function(){return f.WorkDoneProgressCancelNotification}});const p=g_();Object.defineProperty(t,"CallHierarchyIncomingCallsRequest",{enumerable:true,get:function(){return p.CallHierarchyIncomingCallsRequest}});Object.defineProperty(t,"CallHierarchyOutgoingCallsRequest",{enumerable:true,get:function(){return p.CallHierarchyOutgoingCallsRequest}});Object.defineProperty(t,"CallHierarchyPrepareRequest",{enumerable:true,get:function(){return p.CallHierarchyPrepareRequest}});const y=R_();Object.defineProperty(t,"TokenFormat",{enumerable:true,get:function(){return y.TokenFormat}});Object.defineProperty(t,"SemanticTokensRequest",{enumerable:true,get:function(){return y.SemanticTokensRequest}});Object.defineProperty(t,"SemanticTokensDeltaRequest",{enumerable:true,get:function(){return y.SemanticTokensDeltaRequest}});Object.defineProperty(t,"SemanticTokensRangeRequest",{enumerable:true,get:function(){return y.SemanticTokensRangeRequest}});Object.defineProperty(t,"SemanticTokensRefreshRequest",{enumerable:true,get:function(){return y.SemanticTokensRefreshRequest}});Object.defineProperty(t,"SemanticTokensRegistrationType",{enumerable:true,get:function(){return y.SemanticTokensRegistrationType}});const v=v_();Object.defineProperty(t,"ShowDocumentRequest",{enumerable:true,get:function(){return v.ShowDocumentRequest}});const k=$_();Object.defineProperty(t,"LinkedEditingRangeRequest",{enumerable:true,get:function(){return k.LinkedEditingRangeRequest}});const $=T_();Object.defineProperty(t,"FileOperationPatternKind",{enumerable:true,get:function(){return $.FileOperationPatternKind}});Object.defineProperty(t,"DidCreateFilesNotification",{enumerable:true,get:function(){return $.DidCreateFilesNotification}});Object.defineProperty(t,"WillCreateFilesRequest",{enumerable:true,get:function(){return $.WillCreateFilesRequest}});Object.defineProperty(t,"DidRenameFilesNotification",{enumerable:true,get:function(){return $.DidRenameFilesNotification}});Object.defineProperty(t,"WillRenameFilesRequest",{enumerable:true,get:function(){return $.WillRenameFilesRequest}});Object.defineProperty(t,"DidDeleteFilesNotification",{enumerable:true,get:function(){return $.DidDeleteFilesNotification}});Object.defineProperty(t,"WillDeleteFilesRequest",{enumerable:true,get:function(){return $.WillDeleteFilesRequest}});const E=E_();Object.defineProperty(t,"UniquenessLevel",{enumerable:true,get:function(){return E.UniquenessLevel}});Object.defineProperty(t,"MonikerKind",{enumerable:true,get:function(){return E.MonikerKind}});Object.defineProperty(t,"MonikerRequest",{enumerable:true,get:function(){return E.MonikerRequest}});const C=w_();Object.defineProperty(t,"TypeHierarchyPrepareRequest",{enumerable:true,get:function(){return C.TypeHierarchyPrepareRequest}});Object.defineProperty(t,"TypeHierarchySubtypesRequest",{enumerable:true,get:function(){return C.TypeHierarchySubtypesRequest}});Object.defineProperty(t,"TypeHierarchySupertypesRequest",{enumerable:true,get:function(){return C.TypeHierarchySupertypesRequest}});const I=C_();Object.defineProperty(t,"InlineValueRequest",{enumerable:true,get:function(){return I.InlineValueRequest}});Object.defineProperty(t,"InlineValueRefreshRequest",{enumerable:true,get:function(){return I.InlineValueRefreshRequest}});const Y=S_();Object.defineProperty(t,"InlayHintRequest",{enumerable:true,get:function(){return Y.InlayHintRequest}});Object.defineProperty(t,"InlayHintResolveRequest",{enumerable:true,get:function(){return Y.InlayHintResolveRequest}});Object.defineProperty(t,"InlayHintRefreshRequest",{enumerable:true,get:function(){return Y.InlayHintRefreshRequest}});const q=A_();Object.defineProperty(t,"DiagnosticServerCancellationData",{enumerable:true,get:function(){return q.DiagnosticServerCancellationData}});Object.defineProperty(t,"DocumentDiagnosticReportKind",{enumerable:true,get:function(){return q.DocumentDiagnosticReportKind}});Object.defineProperty(t,"DocumentDiagnosticRequest",{enumerable:true,get:function(){return q.DocumentDiagnosticRequest}});Object.defineProperty(t,"WorkspaceDiagnosticRequest",{enumerable:true,get:function(){return q.WorkspaceDiagnosticRequest}});Object.defineProperty(t,"DiagnosticRefreshRequest",{enumerable:true,get:function(){return q.DiagnosticRefreshRequest}});const J=k_();Object.defineProperty(t,"NotebookCellKind",{enumerable:true,get:function(){return J.NotebookCellKind}});Object.defineProperty(t,"ExecutionSummary",{enumerable:true,get:function(){return J.ExecutionSummary}});Object.defineProperty(t,"NotebookCell",{enumerable:true,get:function(){return J.NotebookCell}});Object.defineProperty(t,"NotebookDocument",{enumerable:true,get:function(){return J.NotebookDocument}});Object.defineProperty(t,"NotebookDocumentSyncRegistrationType",{enumerable:true,get:function(){return J.NotebookDocumentSyncRegistrationType}});Object.defineProperty(t,"DidOpenNotebookDocumentNotification",{enumerable:true,get:function(){return J.DidOpenNotebookDocumentNotification}});Object.defineProperty(t,"NotebookCellArrayChange",{enumerable:true,get:function(){return J.NotebookCellArrayChange}});Object.defineProperty(t,"DidChangeNotebookDocumentNotification",{enumerable:true,get:function(){return J.DidChangeNotebookDocumentNotification}});Object.defineProperty(t,"DidSaveNotebookDocumentNotification",{enumerable:true,get:function(){return J.DidSaveNotebookDocumentNotification}});Object.defineProperty(t,"DidCloseNotebookDocumentNotification",{enumerable:true,get:function(){return J.DidCloseNotebookDocumentNotification}});const ne=b_();Object.defineProperty(t,"InlineCompletionRequest",{enumerable:true,get:function(){return ne.InlineCompletionRequest}});var ae;(function(m){function Le(xe){const ee=xe;return r.string(ee)||(r.string(ee.language)||r.string(ee.scheme)||r.string(ee.pattern))}m.is=Le})(ae||(t.TextDocumentFilter=ae={}));var de;(function(m){function Le(xe){const ee=xe;return r.objectLiteral(ee)&&(r.string(ee.notebookType)||r.string(ee.scheme)||r.string(ee.pattern))}m.is=Le})(de||(t.NotebookDocumentFilter=de={}));var L;(function(m){function Le(xe){const ee=xe;return r.objectLiteral(ee)&&(r.string(ee.notebook)||de.is(ee.notebook))&&(ee.language===void 0||r.string(ee.language))}m.is=Le})(L||(t.NotebookCellTextDocumentFilter=L={}));var w;(function(m){function Le(xe){if(!Array.isArray(xe)){return false}for(let ee of xe){if(!r.string(ee)&&!ae.is(ee)&&!L.is(ee)){return false}}return true}m.is=Le})(w||(t.DocumentSelector=w={}));var g;(function(m){m.method="client/registerCapability";m.messageDirection=e.MessageDirection.serverToClient;m.type=new e.ProtocolRequestType(m.method)})(g||(t.RegistrationRequest=g={}));var b;(function(m){m.method="client/unregisterCapability";m.messageDirection=e.MessageDirection.serverToClient;m.type=new e.ProtocolRequestType(m.method)})(b||(t.UnregistrationRequest=b={}));var M;(function(m){m.Create="create";m.Rename="rename";m.Delete="delete"})(M||(t.ResourceOperationKind=M={}));var O;(function(m){m.Abort="abort";m.Transactional="transactional";m.TextOnlyTransactional="textOnlyTransactional";m.Undo="undo"})(O||(t.FailureHandlingKind=O={}));var x;(function(m){m.UTF8="utf-8";m.UTF16="utf-16";m.UTF32="utf-32"})(x||(t.PositionEncodingKind=x={}));var we;(function(m){function Le(xe){const ee=xe;return ee&&r.string(ee.id)&&ee.id.length>0}m.hasId=Le})(we||(t.StaticRegistrationOptions=we={}));var K;(function(m){function Le(xe){const ee=xe;return ee&&(ee.documentSelector===null||w.is(ee.documentSelector))}m.is=Le})(K||(t.TextDocumentRegistrationOptions=K={}));var N;(function(m){function Le(ee){const h=ee;return r.objectLiteral(h)&&(h.workDoneProgress===void 0||r.boolean(h.workDoneProgress))}m.is=Le;function xe(ee){const h=ee;return h&&r.boolean(h.workDoneProgress)}m.hasWorkDoneProgress=xe})(N||(t.WorkDoneProgressOptions=N={}));var re;(function(m){m.method="initialize";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(re||(t.InitializeRequest=re={}));var kt;(function(m){m.unknownProtocolVersion=1})(kt||(t.InitializeErrorCodes=kt={}));var bt;(function(m){m.method="initialized";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolNotificationType(m.method)})(bt||(t.InitializedNotification=bt={}));var Ce;(function(m){m.method="shutdown";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType0(m.method)})(Ce||(t.ShutdownRequest=Ce={}));var Nt;(function(m){m.method="exit";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolNotificationType0(m.method)})(Nt||(t.ExitNotification=Nt={}));var me;(function(m){m.method="workspace/didChangeConfiguration";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolNotificationType(m.method)})(me||(t.DidChangeConfigurationNotification=me={}));var Pe;(function(m){m.Error=1;m.Warning=2;m.Info=3;m.Log=4;m.Debug=5})(Pe||(t.MessageType=Pe={}));var je;(function(m){m.method="window/showMessage";m.messageDirection=e.MessageDirection.serverToClient;m.type=new e.ProtocolNotificationType(m.method)})(je||(t.ShowMessageNotification=je={}));var Re;(function(m){m.method="window/showMessageRequest";m.messageDirection=e.MessageDirection.serverToClient;m.type=new e.ProtocolRequestType(m.method)})(Re||(t.ShowMessageRequest=Re={}));var j;(function(m){m.method="window/logMessage";m.messageDirection=e.MessageDirection.serverToClient;m.type=new e.ProtocolNotificationType(m.method)})(j||(t.LogMessageNotification=j={}));var R;(function(m){m.method="telemetry/event";m.messageDirection=e.MessageDirection.serverToClient;m.type=new e.ProtocolNotificationType(m.method)})(R||(t.TelemetryEventNotification=R={}));var A;(function(m){m.None=0;m.Full=1;m.Incremental=2})(A||(t.TextDocumentSyncKind=A={}));var B;(function(m){m.method="textDocument/didOpen";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolNotificationType(m.method)})(B||(t.DidOpenTextDocumentNotification=B={}));var S;(function(m){function Le(ee){let h=ee;return h!==void 0&&h!==null&&typeof h.text==="string"&&h.range!==void 0&&(h.rangeLength===void 0||typeof h.rangeLength==="number")}m.isIncremental=Le;function xe(ee){let h=ee;return h!==void 0&&h!==null&&typeof h.text==="string"&&h.range===void 0&&h.rangeLength===void 0}m.isFull=xe})(S||(t.TextDocumentContentChangeEvent=S={}));var fe;(function(m){m.method="textDocument/didChange";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolNotificationType(m.method)})(fe||(t.DidChangeTextDocumentNotification=fe={}));var st;(function(m){m.method="textDocument/didClose";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolNotificationType(m.method)})(st||(t.DidCloseTextDocumentNotification=st={}));var zt;(function(m){m.method="textDocument/didSave";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolNotificationType(m.method)})(zt||(t.DidSaveTextDocumentNotification=zt={}));var Bn;(function(m){m.Manual=1;m.AfterDelay=2;m.FocusOut=3})(Bn||(t.TextDocumentSaveReason=Bn={}));var Wn;(function(m){m.method="textDocument/willSave";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolNotificationType(m.method)})(Wn||(t.WillSaveTextDocumentNotification=Wn={}));var Vn;(function(m){m.method="textDocument/willSaveWaitUntil";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(Vn||(t.WillSaveTextDocumentWaitUntilRequest=Vn={}));var Tt;(function(m){m.method="workspace/didChangeWatchedFiles";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolNotificationType(m.method)})(Tt||(t.DidChangeWatchedFilesNotification=Tt={}));var nn;(function(m){m.Created=1;m.Changed=2;m.Deleted=3})(nn||(t.FileChangeType=nn={}));var Lr;(function(m){function Le(xe){const ee=xe;return r.objectLiteral(ee)&&(n.URI.is(ee.baseUri)||n.WorkspaceFolder.is(ee.baseUri))&&r.string(ee.pattern)}m.is=Le})(Lr||(t.RelativePattern=Lr={}));var hn;(function(m){m.Create=1;m.Change=2;m.Delete=4})(hn||(t.WatchKind=hn={}));var yn;(function(m){m.method="textDocument/publishDiagnostics";m.messageDirection=e.MessageDirection.serverToClient;m.type=new e.ProtocolNotificationType(m.method)})(yn||(t.PublishDiagnosticsNotification=yn={}));var rn;(function(m){m.Invoked=1;m.TriggerCharacter=2;m.TriggerForIncompleteCompletions=3})(rn||(t.CompletionTriggerKind=rn={}));var Gt;(function(m){m.method="textDocument/completion";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(Gt||(t.CompletionRequest=Gt={}));var P;(function(m){m.method="completionItem/resolve";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(P||(t.CompletionResolveRequest=P={}));var _;(function(m){m.method="textDocument/hover";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(_||(t.HoverRequest=_={}));var G;(function(m){m.Invoked=1;m.TriggerCharacter=2;m.ContentChange=3})(G||(t.SignatureHelpTriggerKind=G={}));var Et;(function(m){m.method="textDocument/signatureHelp";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(Et||(t.SignatureHelpRequest=Et={}));var dt;(function(m){m.method="textDocument/definition";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(dt||(t.DefinitionRequest=dt={}));var sr;(function(m){m.method="textDocument/references";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(sr||(t.ReferencesRequest=sr={}));var ii;(function(m){m.method="textDocument/documentHighlight";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(ii||(t.DocumentHighlightRequest=ii={}));var hs;(function(m){m.method="textDocument/documentSymbol";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(hs||(t.DocumentSymbolRequest=hs={}));var ys;(function(m){m.method="textDocument/codeAction";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(ys||(t.CodeActionRequest=ys={}));var gs;(function(m){m.method="codeAction/resolve";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(gs||(t.CodeActionResolveRequest=gs={}));var Rs;(function(m){m.method="workspace/symbol";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(Rs||(t.WorkspaceSymbolRequest=Rs={}));var vs;(function(m){m.method="workspaceSymbol/resolve";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(vs||(t.WorkspaceSymbolResolveRequest=vs={}));var $s;(function(m){m.method="textDocument/codeLens";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})($s||(t.CodeLensRequest=$s={}));var Xt;(function(m){m.method="codeLens/resolve";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(Xt||(t.CodeLensResolveRequest=Xt={}));var Ts;(function(m){m.method=`workspace/codeLens/refresh`;m.messageDirection=e.MessageDirection.serverToClient;m.type=new e.ProtocolRequestType0(m.method)})(Ts||(t.CodeLensRefreshRequest=Ts={}));var Es;(function(m){m.method="textDocument/documentLink";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(Es||(t.DocumentLinkRequest=Es={}));var or;(function(m){m.method="documentLink/resolve";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(or||(t.DocumentLinkResolveRequest=or={}));var ws;(function(m){m.method="textDocument/formatting";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(ws||(t.DocumentFormattingRequest=ws={}));var xr;(function(m){m.method="textDocument/rangeFormatting";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(xr||(t.DocumentRangeFormattingRequest=xr={}));var Cs;(function(m){m.method="textDocument/rangesFormatting";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(Cs||(t.DocumentRangesFormattingRequest=Cs={}));var gn;(function(m){m.method="textDocument/onTypeFormatting";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(gn||(t.DocumentOnTypeFormattingRequest=gn={}));var zn;(function(m){m.Identifier=1})(zn||(t.PrepareSupportDefaultBehavior=zn={}));var Ss;(function(m){m.method="textDocument/rename";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(Ss||(t.RenameRequest=Ss={}));var As;(function(m){m.method="textDocument/prepareRename";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(As||(t.PrepareRenameRequest=As={}));var Xn;(function(m){m.method="workspace/executeCommand";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(Xn||(t.ExecuteCommandRequest=Xn={}));var ai;(function(m){m.method="workspace/applyEdit";m.messageDirection=e.MessageDirection.serverToClient;m.type=new e.ProtocolRequestType("workspace/applyEdit")})(ai||(t.ApplyWorkspaceEditRequest=ai={}))})(Oc);return Oc}var Ai={};var fy;function P_(){if(fy)return Ai;fy=1;Object.defineProperty(Ai,"__esModule",{value:true});Ai.createProtocolConnection=void 0;const t=ri();function e(n,r,i,a){if(t.ConnectionStrategy.is(a)){a={connectionStrategy:a}}return(0,t.createMessageConnection)(n,r,i,a)}Ai.createProtocolConnection=e;return Ai}var py;function __(){if(py)return gi;py=1;(function(t){var e=gi.__createBinding||(Object.create?function(a,s,o,l){if(l===void 0)l=o;var u=Object.getOwnPropertyDescriptor(s,o);if(!u||("get"in u?!s.__esModule:u.writable||u.configurable)){u={enumerable:true,get:function(){return s[o]}}}Object.defineProperty(a,l,u)}:function(a,s,o,l){if(l===void 0)l=o;a[l]=s[o]});var n=gi.__exportStar||function(a,s){for(var o in a)if(o!=="default"&&!Object.prototype.hasOwnProperty.call(s,o))e(s,a,o)};Object.defineProperty(t,"__esModule",{value:true});t.LSPErrorCodes=t.createProtocolConnection=void 0;n(ri(),t);n(Vp,t);n(Ne(),t);n(N_(),t);var r=P_();Object.defineProperty(t,"createProtocolConnection",{enumerable:true,get:function(){return r.createProtocolConnection}});var i;(function(a){a.lspReservedErrorRangeStart=-32899;a.RequestFailed=-32803;a.ServerCancelled=-32802;a.ContentModified=-32801;a.RequestCancelled=-32800;a.lspReservedErrorRangeEnd=-32800})(i||(t.LSPErrorCodes=i={}))})(gi);return gi}var my;function He(){if(my)return fi;my=1;(function(t){var e=fi.__createBinding||(Object.create?function(a,s,o,l){if(l===void 0)l=o;var u=Object.getOwnPropertyDescriptor(s,o);if(!u||("get"in u?!s.__esModule:u.writable||u.configurable)){u={enumerable:true,get:function(){return s[o]}}}Object.defineProperty(a,l,u)}:function(a,s,o,l){if(l===void 0)l=o;a[l]=s[o]});var n=fi.__exportStar||function(a,s){for(var o in a)if(o!=="default"&&!Object.prototype.hasOwnProperty.call(s,o))e(s,a,o)};Object.defineProperty(t,"__esModule",{value:true});t.createProtocolConnection=void 0;const r=Gh();n(Gh(),t);n(__(),t);function i(a,s,o,l){return(0,r.createMessageConnection)(a,s,o,l)}t.createProtocolConnection=i})(fi);return fi}var hy;function Qv(){if(hy)return Rn;hy=1;Object.defineProperty(Rn,"__esModule",{value:true});Rn.SemanticTokensBuilder=Rn.SemanticTokensDiff=Rn.SemanticTokensFeature=void 0;const t=He();const e=i=>{return class extends i{get semanticTokens(){return{refresh:()=>{return this.connection.sendRequest(t.SemanticTokensRefreshRequest.type)},on:a=>{const s=t.SemanticTokensRequest.type;return this.connection.onRequest(s,(o,l)=>{return a(o,l,this.attachWorkDoneProgress(o),this.attachPartialResultProgress(s,o))})},onDelta:a=>{const s=t.SemanticTokensDeltaRequest.type;return this.connection.onRequest(s,(o,l)=>{return a(o,l,this.attachWorkDoneProgress(o),this.attachPartialResultProgress(s,o))})},onRange:a=>{const s=t.SemanticTokensRangeRequest.type;return this.connection.onRequest(s,(o,l)=>{return a(o,l,this.attachWorkDoneProgress(o),this.attachPartialResultProgress(s,o))})}}}}};Rn.SemanticTokensFeature=e;class n{constructor(a,s){this.originalSequence=a;this.modifiedSequence=s}computeDiff(){const a=this.originalSequence.length;const s=this.modifiedSequence.length;let o=0;while(o<s&&o<a&&this.originalSequence[o]===this.modifiedSequence[o]){o++}if(o<s&&o<a){let l=a-1;let u=s-1;while(l>=o&&u>=o&&this.originalSequence[l]===this.modifiedSequence[u]){l--;u--}if(l<o||u<o){l++;u++}const c=l-o+1;const d=this.modifiedSequence.slice(o,u+1);if(d.length===1&&d[0]===this.originalSequence[l]){return[{start:o,deleteCount:c-1}]}else{return[{start:o,deleteCount:c,data:d}]}}else if(o<s){return[{start:o,deleteCount:0,data:this.modifiedSequence.slice(o)}]}else if(o<a){return[{start:o,deleteCount:a-o}]}else{return[]}}}Rn.SemanticTokensDiff=n;class r{constructor(){this._prevData=void 0;this.initialize()}initialize(){this._id=Date.now();this._prevLine=0;this._prevChar=0;this._data=[];this._dataLen=0}push(a,s,o,l,u){let c=a;let d=s;if(this._dataLen>0){c-=this._prevLine;if(c===0){d-=this._prevChar}}this._data[this._dataLen++]=c;this._data[this._dataLen++]=d;this._data[this._dataLen++]=o;this._data[this._dataLen++]=l;this._data[this._dataLen++]=u;this._prevLine=a;this._prevChar=s}get id(){return this._id.toString()}previousResult(a){if(this.id===a){this._prevData=this._data}this.initialize()}build(){this._prevData=void 0;return{resultId:this.id,data:this._data}}canBuildEdits(){return this._prevData!==void 0}buildEdits(){if(this._prevData!==void 0){return{resultId:this.id,edits:new n(this._prevData,this._data).computeDiff()}}else{return this.build()}}}Rn.SemanticTokensBuilder=r;return Rn}var ki={};var yy;function D_(){if(yy)return ki;yy=1;Object.defineProperty(ki,"__esModule",{value:true});ki.InlineCompletionFeature=void 0;const t=He();const e=n=>{return class extends n{get inlineCompletion(){return{on:r=>{return this.connection.onRequest(t.InlineCompletionRequest.type,(i,a)=>{return r(i,a,this.attachWorkDoneProgress(i))})}}}}};ki.InlineCompletionFeature=e;return ki}var bi={};var gy;function Zv(){if(gy)return bi;gy=1;Object.defineProperty(bi,"__esModule",{value:true});bi.TextDocuments=void 0;const t=He();class e{constructor(r){this._configuration=r;this._syncedDocuments=new Map;this._onDidChangeContent=new t.Emitter;this._onDidOpen=new t.Emitter;this._onDidClose=new t.Emitter;this._onDidSave=new t.Emitter;this._onWillSave=new t.Emitter}get onDidOpen(){return this._onDidOpen.event}get onDidChangeContent(){return this._onDidChangeContent.event}get onWillSave(){return this._onWillSave.event}onWillSaveWaitUntil(r){this._willSaveWaitUntil=r}get onDidSave(){return this._onDidSave.event}get onDidClose(){return this._onDidClose.event}get(r){return this._syncedDocuments.get(r)}all(){return Array.from(this._syncedDocuments.values())}keys(){return Array.from(this._syncedDocuments.keys())}listen(r){r.__textDocumentSync=t.TextDocumentSyncKind.Incremental;const i=[];i.push(r.onDidOpenTextDocument(a=>{const s=a.textDocument;const o=this._configuration.create(s.uri,s.languageId,s.version,s.text);this._syncedDocuments.set(s.uri,o);const l=Object.freeze({document:o});this._onDidOpen.fire(l);this._onDidChangeContent.fire(l)}));i.push(r.onDidChangeTextDocument(a=>{const s=a.textDocument;const o=a.contentChanges;if(o.length===0){return}const{version:l}=s;if(l===null||l===void 0){throw new Error(`Received document change event for ${s.uri} without valid version identifier`)}let u=this._syncedDocuments.get(s.uri);if(u!==void 0){u=this._configuration.update(u,o,l);this._syncedDocuments.set(s.uri,u);this._onDidChangeContent.fire(Object.freeze({document:u}))}}));i.push(r.onDidCloseTextDocument(a=>{let s=this._syncedDocuments.get(a.textDocument.uri);if(s!==void 0){this._syncedDocuments.delete(a.textDocument.uri);this._onDidClose.fire(Object.freeze({document:s}))}}));i.push(r.onWillSaveTextDocument(a=>{let s=this._syncedDocuments.get(a.textDocument.uri);if(s!==void 0){this._onWillSave.fire(Object.freeze({document:s,reason:a.reason}))}}));i.push(r.onWillSaveTextDocumentWaitUntil((a,s)=>{let o=this._syncedDocuments.get(a.textDocument.uri);if(o!==void 0&&this._willSaveWaitUntil){return this._willSaveWaitUntil(Object.freeze({document:o,reason:a.reason}),s)}else{return[]}}));i.push(r.onDidSaveTextDocument(a=>{let s=this._syncedDocuments.get(a.textDocument.uri);if(s!==void 0){this._onDidSave.fire(Object.freeze({document:s}))}}));return t.Disposable.create(()=>{i.forEach(a=>a.dispose())})}}bi.TextDocuments=e;return bi}var gr={};var Ry;function e$(){if(Ry)return gr;Ry=1;Object.defineProperty(gr,"__esModule",{value:true});gr.NotebookDocuments=gr.NotebookSyncFeature=void 0;const t=He();const e=Zv();const n=a=>{return class extends a{get synchronization(){return{onDidOpenNotebookDocument:s=>{return this.connection.onNotification(t.DidOpenNotebookDocumentNotification.type,o=>{s(o)})},onDidChangeNotebookDocument:s=>{return this.connection.onNotification(t.DidChangeNotebookDocumentNotification.type,o=>{s(o)})},onDidSaveNotebookDocument:s=>{return this.connection.onNotification(t.DidSaveNotebookDocumentNotification.type,o=>{s(o)})},onDidCloseNotebookDocument:s=>{return this.connection.onNotification(t.DidCloseNotebookDocumentNotification.type,o=>{s(o)})}}}}};gr.NotebookSyncFeature=n;class r{onDidOpenTextDocument(s){this.openHandler=s;return t.Disposable.create(()=>{this.openHandler=void 0})}openTextDocument(s){this.openHandler&&this.openHandler(s)}onDidChangeTextDocument(s){this.changeHandler=s;return t.Disposable.create(()=>{this.changeHandler=s})}changeTextDocument(s){this.changeHandler&&this.changeHandler(s)}onDidCloseTextDocument(s){this.closeHandler=s;return t.Disposable.create(()=>{this.closeHandler=void 0})}closeTextDocument(s){this.closeHandler&&this.closeHandler(s)}onWillSaveTextDocument(){return r.NULL_DISPOSE}onWillSaveTextDocumentWaitUntil(){return r.NULL_DISPOSE}onDidSaveTextDocument(){return r.NULL_DISPOSE}}r.NULL_DISPOSE=Object.freeze({dispose:()=>{}});class i{constructor(s){if(s instanceof e.TextDocuments){this._cellTextDocuments=s}else{this._cellTextDocuments=new e.TextDocuments(s)}this.notebookDocuments=new Map;this.notebookCellMap=new Map;this._onDidOpen=new t.Emitter;this._onDidChange=new t.Emitter;this._onDidSave=new t.Emitter;this._onDidClose=new t.Emitter}get cellTextDocuments(){return this._cellTextDocuments}getCellTextDocument(s){return this._cellTextDocuments.get(s.document)}getNotebookDocument(s){return this.notebookDocuments.get(s)}getNotebookCell(s){const o=this.notebookCellMap.get(s);return o&&o[0]}findNotebookDocumentForCell(s){const o=typeof s==="string"?s:s.document;const l=this.notebookCellMap.get(o);return l&&l[1]}get onDidOpen(){return this._onDidOpen.event}get onDidSave(){return this._onDidSave.event}get onDidChange(){return this._onDidChange.event}get onDidClose(){return this._onDidClose.event}listen(s){const o=new r;const l=[];l.push(this.cellTextDocuments.listen(o));l.push(s.notebooks.synchronization.onDidOpenNotebookDocument(u=>{this.notebookDocuments.set(u.notebookDocument.uri,u.notebookDocument);for(const c of u.cellTextDocuments){o.openTextDocument({textDocument:c})}this.updateCellMap(u.notebookDocument);this._onDidOpen.fire(u.notebookDocument)}));l.push(s.notebooks.synchronization.onDidChangeNotebookDocument(u=>{const c=this.notebookDocuments.get(u.notebookDocument.uri);if(c===void 0){return}c.version=u.notebookDocument.version;const d=c.metadata;let f=false;const p=u.change;if(p.metadata!==void 0){f=true;c.metadata=p.metadata}const y=[];const v=[];const k=[];const $=[];if(p.cells!==void 0){const q=p.cells;if(q.structure!==void 0){const J=q.structure.array;c.cells.splice(J.start,J.deleteCount,...J.cells!==void 0?J.cells:[]);if(q.structure.didOpen!==void 0){for(const ne of q.structure.didOpen){o.openTextDocument({textDocument:ne});y.push(ne.uri)}}if(q.structure.didClose){for(const ne of q.structure.didClose){o.closeTextDocument({textDocument:ne});v.push(ne.uri)}}}if(q.data!==void 0){const J=new Map(q.data.map(ne=>[ne.document,ne]));for(let ne=0;ne<=c.cells.length;ne++){const ae=J.get(c.cells[ne].document);if(ae!==void 0){const de=c.cells.splice(ne,1,ae);k.push({old:de[0],new:ae});J.delete(ae.document);if(J.size===0){break}}}}if(q.textContent!==void 0){for(const J of q.textContent){o.changeTextDocument({textDocument:J.document,contentChanges:J.changes});$.push(J.document.uri)}}}this.updateCellMap(c);const E={notebookDocument:c};if(f){E.metadata={old:d,new:c.metadata}}const C=[];for(const q of y){C.push(this.getNotebookCell(q))}const I=[];for(const q of v){I.push(this.getNotebookCell(q))}const Y=[];for(const q of $){Y.push(this.getNotebookCell(q))}if(C.length>0||I.length>0||k.length>0||Y.length>0){E.cells={added:C,removed:I,changed:{data:k,textContent:Y}}}if(E.metadata!==void 0||E.cells!==void 0){this._onDidChange.fire(E)}}));l.push(s.notebooks.synchronization.onDidSaveNotebookDocument(u=>{const c=this.notebookDocuments.get(u.notebookDocument.uri);if(c===void 0){return}this._onDidSave.fire(c)}));l.push(s.notebooks.synchronization.onDidCloseNotebookDocument(u=>{const c=this.notebookDocuments.get(u.notebookDocument.uri);if(c===void 0){return}this._onDidClose.fire(c);for(const d of u.cellTextDocuments){o.closeTextDocument({textDocument:d})}this.notebookDocuments.delete(u.notebookDocument.uri);for(const d of c.cells){this.notebookCellMap.delete(d.document)}}));return t.Disposable.create(()=>{l.forEach(u=>u.dispose())})}updateCellMap(s){for(const o of s.cells){this.notebookCellMap.set(o.document,[o,s])}}}gr.NotebookDocuments=i;return gr}var oe={};var Ke={};var vy;function t$(){if(vy)return Ke;vy=1;Object.defineProperty(Ke,"__esModule",{value:true});Ke.thenable=Ke.typedArray=Ke.stringArray=Ke.array=Ke.func=Ke.error=Ke.number=Ke.string=Ke.boolean=void 0;function t(u){return u===true||u===false}Ke.boolean=t;function e(u){return typeof u==="string"||u instanceof String}Ke.string=e;function n(u){return typeof u==="number"||u instanceof Number}Ke.number=n;function r(u){return u instanceof Error}Ke.error=r;function i(u){return typeof u==="function"}Ke.func=i;function a(u){return Array.isArray(u)}Ke.array=a;function s(u){return a(u)&&u.every(c=>e(c))}Ke.stringArray=s;function o(u,c){return Array.isArray(u)&&u.every(c)}Ke.typedArray=o;function l(u){return u&&i(u.then)}Ke.thenable=l;return Ke}var _t={};var $y;function n$(){if($y)return _t;$y=1;Object.defineProperty(_t,"__esModule",{value:true});_t.generateUuid=_t.parse=_t.isUUID=_t.v4=_t.empty=void 0;class t{constructor(l){this._value=l}asHex(){return this._value}equals(l){return this.asHex()===l.asHex()}}class e extends t{static _oneOf(l){return l[Math.floor(l.length*Math.random())]}static _randomHex(){return e._oneOf(e._chars)}constructor(){super([e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),"-",e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),"-","4",e._randomHex(),e._randomHex(),e._randomHex(),"-",e._oneOf(e._timeHighBits),e._randomHex(),e._randomHex(),e._randomHex(),"-",e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex()].join(""))}}e._chars=["0","1","2","3","4","5","6","6","7","8","9","a","b","c","d","e","f"];e._timeHighBits=["8","9","a","b"];_t.empty=new t("00000000-0000-0000-0000-000000000000");function n(){return new e}_t.v4=n;const r=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;function i(o){return r.test(o)}_t.isUUID=i;function a(o){if(!i(o)){throw new Error("invalid uuid")}return new t(o)}_t.parse=a;function s(){return n().asHex()}_t.generateUuid=s;return _t}var kn={};var Ty;function O_(){if(Ty)return kn;Ty=1;Object.defineProperty(kn,"__esModule",{value:true});kn.attachPartialResult=kn.ProgressFeature=kn.attachWorkDone=void 0;const t=He();const e=n$();class n{constructor(f,p){this._connection=f;this._token=p;n.Instances.set(this._token,this)}begin(f,p,y,v){let k={kind:"begin",title:f,percentage:p,message:y,cancellable:v};this._connection.sendProgress(t.WorkDoneProgress.type,this._token,k)}report(f,p){let y={kind:"report"};if(typeof f==="number"){y.percentage=f;if(p!==void 0){y.message=p}}else{y.message=f}this._connection.sendProgress(t.WorkDoneProgress.type,this._token,y)}done(){n.Instances.delete(this._token);this._connection.sendProgress(t.WorkDoneProgress.type,this._token,{kind:"end"})}}n.Instances=new Map;class r extends n{constructor(f,p){super(f,p);this._source=new t.CancellationTokenSource}get token(){return this._source.token}done(){this._source.dispose();super.done()}cancel(){this._source.cancel()}}class i{constructor(){}begin(){}report(){}done(){}}class a extends i{constructor(){super();this._source=new t.CancellationTokenSource}get token(){return this._source.token}done(){this._source.dispose()}cancel(){this._source.cancel()}}function s(d,f){if(f===void 0||f.workDoneToken===void 0){return new i}const p=f.workDoneToken;delete f.workDoneToken;return new n(d,p)}kn.attachWorkDone=s;const o=d=>{return class extends d{constructor(){super();this._progressSupported=false}initialize(f){super.initialize(f);if(f?.window?.workDoneProgress===true){this._progressSupported=true;this.connection.onNotification(t.WorkDoneProgressCancelNotification.type,p=>{let y=n.Instances.get(p.token);if(y instanceof r||y instanceof a){y.cancel()}})}}attachWorkDoneProgress(f){if(f===void 0){return new i}else{return new n(this.connection,f)}}createWorkDoneProgress(){if(this._progressSupported){const f=(0,e.generateUuid)();return this.connection.sendRequest(t.WorkDoneProgressCreateRequest.type,{token:f}).then(()=>{const p=new r(this.connection,f);return p})}else{return Promise.resolve(new a)}}}};kn.ProgressFeature=o;var l;(function(d){d.type=new t.ProgressType})(l||(l={}));class u{constructor(f,p){this._connection=f;this._token=p}report(f){this._connection.sendProgress(l.type,this._token,f)}}function c(d,f){if(f===void 0||f.partialResultToken===void 0){return void 0}const p=f.partialResultToken;delete f.partialResultToken;return new u(d,p)}kn.attachPartialResult=c;return kn}var Ni={};var Ey;function I_(){if(Ey)return Ni;Ey=1;Object.defineProperty(Ni,"__esModule",{value:true});Ni.ConfigurationFeature=void 0;const t=He();const e=t$();const n=r=>{return class extends r{getConfiguration(i){if(!i){return this._getConfiguration({})}else if(e.string(i)){return this._getConfiguration({section:i})}else{return this._getConfiguration(i)}}_getConfiguration(i){let a={items:Array.isArray(i)?i:[i]};return this.connection.sendRequest(t.ConfigurationRequest.type,a).then(s=>{if(Array.isArray(s)){return Array.isArray(i)?s:s[0]}else{return Array.isArray(i)?[]:null}})}}};Ni.ConfigurationFeature=n;return Ni}var Pi={};var wy;function L_(){if(wy)return Pi;wy=1;Object.defineProperty(Pi,"__esModule",{value:true});Pi.WorkspaceFoldersFeature=void 0;const t=He();const e=n=>{return class extends n{constructor(){super();this._notificationIsAutoRegistered=false}initialize(r){super.initialize(r);let i=r.workspace;if(i&&i.workspaceFolders){this._onDidChangeWorkspaceFolders=new t.Emitter;this.connection.onNotification(t.DidChangeWorkspaceFoldersNotification.type,a=>{this._onDidChangeWorkspaceFolders.fire(a.event)})}}fillServerCapabilities(r){super.fillServerCapabilities(r);const i=r.workspace?.workspaceFolders?.changeNotifications;this._notificationIsAutoRegistered=i===true||typeof i==="string"}getWorkspaceFolders(){return this.connection.sendRequest(t.WorkspaceFoldersRequest.type)}get onDidChangeWorkspaceFolders(){if(!this._onDidChangeWorkspaceFolders){throw new Error("Client doesn't support sending workspace folder change events.")}if(!this._notificationIsAutoRegistered&&!this._unregistration){this._unregistration=this.connection.client.register(t.DidChangeWorkspaceFoldersNotification.type)}return this._onDidChangeWorkspaceFolders.event}}};Pi.WorkspaceFoldersFeature=e;return Pi}var _i={};var Cy;function x_(){if(Cy)return _i;Cy=1;Object.defineProperty(_i,"__esModule",{value:true});_i.CallHierarchyFeature=void 0;const t=He();const e=n=>{return class extends n{get callHierarchy(){return{onPrepare:r=>{return this.connection.onRequest(t.CallHierarchyPrepareRequest.type,(i,a)=>{return r(i,a,this.attachWorkDoneProgress(i),void 0)})},onIncomingCalls:r=>{const i=t.CallHierarchyIncomingCallsRequest.type;return this.connection.onRequest(i,(a,s)=>{return r(a,s,this.attachWorkDoneProgress(a),this.attachPartialResultProgress(i,a))})},onOutgoingCalls:r=>{const i=t.CallHierarchyOutgoingCallsRequest.type;return this.connection.onRequest(i,(a,s)=>{return r(a,s,this.attachWorkDoneProgress(a),this.attachPartialResultProgress(i,a))})}}}}};_i.CallHierarchyFeature=e;return _i}var Di={};var Sy;function M_(){if(Sy)return Di;Sy=1;Object.defineProperty(Di,"__esModule",{value:true});Di.ShowDocumentFeature=void 0;const t=He();const e=n=>{return class extends n{showDocument(r){return this.connection.sendRequest(t.ShowDocumentRequest.type,r)}}};Di.ShowDocumentFeature=e;return Di}var Oi={};var Ay;function F_(){if(Ay)return Oi;Ay=1;Object.defineProperty(Oi,"__esModule",{value:true});Oi.FileOperationsFeature=void 0;const t=He();const e=n=>{return class extends n{onDidCreateFiles(r){return this.connection.onNotification(t.DidCreateFilesNotification.type,i=>{r(i)})}onDidRenameFiles(r){return this.connection.onNotification(t.DidRenameFilesNotification.type,i=>{r(i)})}onDidDeleteFiles(r){return this.connection.onNotification(t.DidDeleteFilesNotification.type,i=>{r(i)})}onWillCreateFiles(r){return this.connection.onRequest(t.WillCreateFilesRequest.type,(i,a)=>{return r(i,a)})}onWillRenameFiles(r){return this.connection.onRequest(t.WillRenameFilesRequest.type,(i,a)=>{return r(i,a)})}onWillDeleteFiles(r){return this.connection.onRequest(t.WillDeleteFilesRequest.type,(i,a)=>{return r(i,a)})}}};Oi.FileOperationsFeature=e;return Oi}var Ii={};var ky;function K_(){if(ky)return Ii;ky=1;Object.defineProperty(Ii,"__esModule",{value:true});Ii.LinkedEditingRangeFeature=void 0;const t=He();const e=n=>{return class extends n{onLinkedEditingRange(r){return this.connection.onRequest(t.LinkedEditingRangeRequest.type,(i,a)=>{return r(i,a,this.attachWorkDoneProgress(i),void 0)})}}};Ii.LinkedEditingRangeFeature=e;return Ii}var Li={};var by;function U_(){if(by)return Li;by=1;Object.defineProperty(Li,"__esModule",{value:true});Li.TypeHierarchyFeature=void 0;const t=He();const e=n=>{return class extends n{get typeHierarchy(){return{onPrepare:r=>{return this.connection.onRequest(t.TypeHierarchyPrepareRequest.type,(i,a)=>{return r(i,a,this.attachWorkDoneProgress(i),void 0)})},onSupertypes:r=>{const i=t.TypeHierarchySupertypesRequest.type;return this.connection.onRequest(i,(a,s)=>{return r(a,s,this.attachWorkDoneProgress(a),this.attachPartialResultProgress(i,a))})},onSubtypes:r=>{const i=t.TypeHierarchySubtypesRequest.type;return this.connection.onRequest(i,(a,s)=>{return r(a,s,this.attachWorkDoneProgress(a),this.attachPartialResultProgress(i,a))})}}}}};Li.TypeHierarchyFeature=e;return Li}var xi={};var Ny;function G_(){if(Ny)return xi;Ny=1;Object.defineProperty(xi,"__esModule",{value:true});xi.InlineValueFeature=void 0;const t=He();const e=n=>{return class extends n{get inlineValue(){return{refresh:()=>{return this.connection.sendRequest(t.InlineValueRefreshRequest.type)},on:r=>{return this.connection.onRequest(t.InlineValueRequest.type,(i,a)=>{return r(i,a,this.attachWorkDoneProgress(i))})}}}}};xi.InlineValueFeature=e;return xi}var Mi={};var Py;function H_(){if(Py)return Mi;Py=1;Object.defineProperty(Mi,"__esModule",{value:true});Mi.FoldingRangeFeature=void 0;const t=He();const e=n=>{return class extends n{get foldingRange(){return{refresh:()=>{return this.connection.sendRequest(t.FoldingRangeRefreshRequest.type)},on:r=>{const i=t.FoldingRangeRequest.type;return this.connection.onRequest(i,(a,s)=>{return r(a,s,this.attachWorkDoneProgress(a),this.attachPartialResultProgress(i,a))})}}}}};Mi.FoldingRangeFeature=e;return Mi}var Fi={};var _y;function q_(){if(_y)return Fi;_y=1;Object.defineProperty(Fi,"__esModule",{value:true});Fi.InlayHintFeature=void 0;const t=He();const e=n=>{return class extends n{get inlayHint(){return{refresh:()=>{return this.connection.sendRequest(t.InlayHintRefreshRequest.type)},on:r=>{return this.connection.onRequest(t.InlayHintRequest.type,(i,a)=>{return r(i,a,this.attachWorkDoneProgress(i))})},resolve:r=>{return this.connection.onRequest(t.InlayHintResolveRequest.type,(i,a)=>{return r(i,a)})}}}}};Fi.InlayHintFeature=e;return Fi}var Ki={};var Dy;function j_(){if(Dy)return Ki;Dy=1;Object.defineProperty(Ki,"__esModule",{value:true});Ki.DiagnosticFeature=void 0;const t=He();const e=n=>{return class extends n{get diagnostics(){return{refresh:()=>{return this.connection.sendRequest(t.DiagnosticRefreshRequest.type)},on:r=>{return this.connection.onRequest(t.DocumentDiagnosticRequest.type,(i,a)=>{return r(i,a,this.attachWorkDoneProgress(i),this.attachPartialResultProgress(t.DocumentDiagnosticRequest.partialResult,i))})},onWorkspace:r=>{return this.connection.onRequest(t.WorkspaceDiagnosticRequest.type,(i,a)=>{return r(i,a,this.attachWorkDoneProgress(i),this.attachPartialResultProgress(t.WorkspaceDiagnosticRequest.partialResult,i))})}}}}};Ki.DiagnosticFeature=e;return Ki}var Ui={};var Oy;function B_(){if(Oy)return Ui;Oy=1;Object.defineProperty(Ui,"__esModule",{value:true});Ui.MonikerFeature=void 0;const t=He();const e=n=>{return class extends n{get moniker(){return{on:r=>{const i=t.MonikerRequest.type;return this.connection.onRequest(i,(a,s)=>{return r(a,s,this.attachWorkDoneProgress(a),this.attachPartialResultProgress(i,a))})}}}}};Ui.MonikerFeature=e;return Ui}var Iy;function W_(){if(Iy)return oe;Iy=1;Object.defineProperty(oe,"__esModule",{value:true});oe.createConnection=oe.combineFeatures=oe.combineNotebooksFeatures=oe.combineLanguagesFeatures=oe.combineWorkspaceFeatures=oe.combineWindowFeatures=oe.combineClientFeatures=oe.combineTracerFeatures=oe.combineTelemetryFeatures=oe.combineConsoleFeatures=oe._NotebooksImpl=oe._LanguagesImpl=oe.BulkUnregistration=oe.BulkRegistration=oe.ErrorMessageTracker=void 0;const t=He();const e=t$();const n=n$();const r=O_();const i=I_();const a=L_();const s=x_();const o=Qv();const l=M_();const u=F_();const c=K_();const d=U_();const f=G_();const p=H_();const y=q_();const v=j_();const k=e$();const $=B_();function E(j){if(j===null){return void 0}return j}class C{constructor(){this._messages=Object.create(null)}add(R){let A=this._messages[R];if(!A){A=0}A++;this._messages[R]=A}sendErrors(R){Object.keys(this._messages).forEach(A=>{R.window.showErrorMessage(A)})}}oe.ErrorMessageTracker=C;class I{constructor(){}rawAttach(R){this._rawConnection=R}attach(R){this._connection=R}get connection(){if(!this._connection){throw new Error("Remote is not attached to a connection yet.")}return this._connection}fillServerCapabilities(R){}initialize(R){}error(R){this.send(t.MessageType.Error,R)}warn(R){this.send(t.MessageType.Warning,R)}info(R){this.send(t.MessageType.Info,R)}log(R){this.send(t.MessageType.Log,R)}debug(R){this.send(t.MessageType.Debug,R)}send(R,A){if(this._rawConnection){this._rawConnection.sendNotification(t.LogMessageNotification.type,{type:R,message:A}).catch(()=>{(0,t.RAL)().console.error(`Sending log message failed`)})}}}class Y{constructor(){}attach(R){this._connection=R}get connection(){if(!this._connection){throw new Error("Remote is not attached to a connection yet.")}return this._connection}initialize(R){}fillServerCapabilities(R){}showErrorMessage(R,...A){let B={type:t.MessageType.Error,message:R,actions:A};return this.connection.sendRequest(t.ShowMessageRequest.type,B).then(E)}showWarningMessage(R,...A){let B={type:t.MessageType.Warning,message:R,actions:A};return this.connection.sendRequest(t.ShowMessageRequest.type,B).then(E)}showInformationMessage(R,...A){let B={type:t.MessageType.Info,message:R,actions:A};return this.connection.sendRequest(t.ShowMessageRequest.type,B).then(E)}}const q=(0,l.ShowDocumentFeature)((0,r.ProgressFeature)(Y));var J;(function(j){function R(){return new ne}j.create=R})(J||(oe.BulkRegistration=J={}));class ne{constructor(){this._registrations=[];this._registered=new Set}add(R,A){const B=e.string(R)?R:R.method;if(this._registered.has(B)){throw new Error(`${B} is already added to this registration`)}const S=n.generateUuid();this._registrations.push({id:S,method:B,registerOptions:A||{}});this._registered.add(B)}asRegistrationParams(){return{registrations:this._registrations}}}var ae;(function(j){function R(){return new de(void 0,[])}j.create=R})(ae||(oe.BulkUnregistration=ae={}));class de{constructor(R,A){this._connection=R;this._unregistrations=new Map;A.forEach(B=>{this._unregistrations.set(B.method,B)})}get isAttached(){return!!this._connection}attach(R){this._connection=R}add(R){this._unregistrations.set(R.method,R)}dispose(){let R=[];for(let B of this._unregistrations.values()){R.push(B)}let A={unregisterations:R};this._connection.sendRequest(t.UnregistrationRequest.type,A).catch(()=>{this._connection.console.info(`Bulk unregistration failed.`)})}disposeSingle(R){const A=e.string(R)?R:R.method;const B=this._unregistrations.get(A);if(!B){return false}let S={unregisterations:[B]};this._connection.sendRequest(t.UnregistrationRequest.type,S).then(()=>{this._unregistrations.delete(A)},fe=>{this._connection.console.info(`Un-registering request handler for ${B.id} failed.`)});return true}}class L{attach(R){this._connection=R}get connection(){if(!this._connection){throw new Error("Remote is not attached to a connection yet.")}return this._connection}initialize(R){}fillServerCapabilities(R){}register(R,A,B){if(R instanceof ne){return this.registerMany(R)}else if(R instanceof de){return this.registerSingle1(R,A,B)}else{return this.registerSingle2(R,A)}}registerSingle1(R,A,B){const S=e.string(A)?A:A.method;const fe=n.generateUuid();let st={registrations:[{id:fe,method:S,registerOptions:B||{}}]};if(!R.isAttached){R.attach(this.connection)}return this.connection.sendRequest(t.RegistrationRequest.type,st).then(zt=>{R.add({id:fe,method:S});return R},zt=>{this.connection.console.info(`Registering request handler for ${S} failed.`);return Promise.reject(zt)})}registerSingle2(R,A){const B=e.string(R)?R:R.method;const S=n.generateUuid();let fe={registrations:[{id:S,method:B,registerOptions:A||{}}]};return this.connection.sendRequest(t.RegistrationRequest.type,fe).then(st=>{return t.Disposable.create(()=>{this.unregisterSingle(S,B).catch(()=>{this.connection.console.info(`Un-registering capability with id ${S} failed.`)})})},st=>{this.connection.console.info(`Registering request handler for ${B} failed.`);return Promise.reject(st)})}unregisterSingle(R,A){let B={unregisterations:[{id:R,method:A}]};return this.connection.sendRequest(t.UnregistrationRequest.type,B).catch(()=>{this.connection.console.info(`Un-registering request handler for ${R} failed.`)})}registerMany(R){let A=R.asRegistrationParams();return this.connection.sendRequest(t.RegistrationRequest.type,A).then(()=>{return new de(this._connection,A.registrations.map(B=>{return{id:B.id,method:B.method}}))},B=>{this.connection.console.info(`Bulk registration failed.`);return Promise.reject(B)})}}class w{constructor(){}attach(R){this._connection=R}get connection(){if(!this._connection){throw new Error("Remote is not attached to a connection yet.")}return this._connection}initialize(R){}fillServerCapabilities(R){}applyEdit(R){function A(S){return S&&!!S.edit}let B=A(R)?R:{edit:R};return this.connection.sendRequest(t.ApplyWorkspaceEditRequest.type,B)}}const g=(0,u.FileOperationsFeature)((0,a.WorkspaceFoldersFeature)((0,i.ConfigurationFeature)(w)));class b{constructor(){this._trace=t.Trace.Off}attach(R){this._connection=R}get connection(){if(!this._connection){throw new Error("Remote is not attached to a connection yet.")}return this._connection}initialize(R){}fillServerCapabilities(R){}set trace(R){this._trace=R}log(R,A){if(this._trace===t.Trace.Off){return}this.connection.sendNotification(t.LogTraceNotification.type,{message:R,verbose:this._trace===t.Trace.Verbose?A:void 0}).catch(()=>{})}}class M{constructor(){}attach(R){this._connection=R}get connection(){if(!this._connection){throw new Error("Remote is not attached to a connection yet.")}return this._connection}initialize(R){}fillServerCapabilities(R){}logEvent(R){this.connection.sendNotification(t.TelemetryEventNotification.type,R).catch(()=>{this.connection.console.log(`Sending TelemetryEventNotification failed`)})}}class O{constructor(){}attach(R){this._connection=R}get connection(){if(!this._connection){throw new Error("Remote is not attached to a connection yet.")}return this._connection}initialize(R){}fillServerCapabilities(R){}attachWorkDoneProgress(R){return(0,r.attachWorkDone)(this.connection,R)}attachPartialResultProgress(R,A){return(0,r.attachPartialResult)(this.connection,A)}}oe._LanguagesImpl=O;const x=(0,p.FoldingRangeFeature)((0,$.MonikerFeature)((0,v.DiagnosticFeature)((0,y.InlayHintFeature)((0,f.InlineValueFeature)((0,d.TypeHierarchyFeature)((0,c.LinkedEditingRangeFeature)((0,o.SemanticTokensFeature)((0,s.CallHierarchyFeature)(O)))))))));class we{constructor(){}attach(R){this._connection=R}get connection(){if(!this._connection){throw new Error("Remote is not attached to a connection yet.")}return this._connection}initialize(R){}fillServerCapabilities(R){}attachWorkDoneProgress(R){return(0,r.attachWorkDone)(this.connection,R)}attachPartialResultProgress(R,A){return(0,r.attachPartialResult)(this.connection,A)}}oe._NotebooksImpl=we;const K=(0,k.NotebookSyncFeature)(we);function N(j,R){return function(A){return R(j(A))}}oe.combineConsoleFeatures=N;function re(j,R){return function(A){return R(j(A))}}oe.combineTelemetryFeatures=re;function kt(j,R){return function(A){return R(j(A))}}oe.combineTracerFeatures=kt;function bt(j,R){return function(A){return R(j(A))}}oe.combineClientFeatures=bt;function Ce(j,R){return function(A){return R(j(A))}}oe.combineWindowFeatures=Ce;function Nt(j,R){return function(A){return R(j(A))}}oe.combineWorkspaceFeatures=Nt;function me(j,R){return function(A){return R(j(A))}}oe.combineLanguagesFeatures=me;function Pe(j,R){return function(A){return R(j(A))}}oe.combineNotebooksFeatures=Pe;function je(j,R){function A(S,fe,st){if(S&&fe){return st(S,fe)}else if(S){return S}else{return fe}}let B={__brand:"features",console:A(j.console,R.console,N),tracer:A(j.tracer,R.tracer,kt),telemetry:A(j.telemetry,R.telemetry,re),client:A(j.client,R.client,bt),window:A(j.window,R.window,Ce),workspace:A(j.workspace,R.workspace,Nt),languages:A(j.languages,R.languages,me),notebooks:A(j.notebooks,R.notebooks,Pe)};return B}oe.combineFeatures=je;function Re(j,R,A){const B=A&&A.console?new(A.console(I)):new I;const S=j(B);B.rawAttach(S);const fe=A&&A.tracer?new(A.tracer(b)):new b;const st=A&&A.telemetry?new(A.telemetry(M)):new M;const zt=A&&A.client?new(A.client(L)):new L;const Bn=A&&A.window?new(A.window(q)):new q;const Wn=A&&A.workspace?new(A.workspace(g)):new g;const Vn=A&&A.languages?new(A.languages(x)):new x;const Tt=A&&A.notebooks?new(A.notebooks(K)):new K;const nn=[B,fe,st,zt,Bn,Wn,Vn,Tt];function Lr(P){if(P instanceof Promise){return P}else if(e.thenable(P)){return new Promise((_,G)=>{P.then(Et=>_(Et),Et=>G(Et))})}else{return Promise.resolve(P)}}let hn=void 0;let yn=void 0;let rn=void 0;let Gt={listen:()=>S.listen(),sendRequest:(P,..._)=>S.sendRequest(e.string(P)?P:P.method,..._),onRequest:(P,_)=>S.onRequest(P,_),sendNotification:(P,_)=>{const G=e.string(P)?P:P.method;return S.sendNotification(G,_)},onNotification:(P,_)=>S.onNotification(P,_),onProgress:S.onProgress,sendProgress:S.sendProgress,onInitialize:P=>{yn=P;return{dispose:()=>{yn=void 0}}},onInitialized:P=>S.onNotification(t.InitializedNotification.type,P),onShutdown:P=>{hn=P;return{dispose:()=>{hn=void 0}}},onExit:P=>{rn=P;return{dispose:()=>{rn=void 0}}},get console(){return B},get telemetry(){return st},get tracer(){return fe},get client(){return zt},get window(){return Bn},get workspace(){return Wn},get languages(){return Vn},get notebooks(){return Tt},onDidChangeConfiguration:P=>S.onNotification(t.DidChangeConfigurationNotification.type,P),onDidChangeWatchedFiles:P=>S.onNotification(t.DidChangeWatchedFilesNotification.type,P),__textDocumentSync:void 0,onDidOpenTextDocument:P=>S.onNotification(t.DidOpenTextDocumentNotification.type,P),onDidChangeTextDocument:P=>S.onNotification(t.DidChangeTextDocumentNotification.type,P),onDidCloseTextDocument:P=>S.onNotification(t.DidCloseTextDocumentNotification.type,P),onWillSaveTextDocument:P=>S.onNotification(t.WillSaveTextDocumentNotification.type,P),onWillSaveTextDocumentWaitUntil:P=>S.onRequest(t.WillSaveTextDocumentWaitUntilRequest.type,P),onDidSaveTextDocument:P=>S.onNotification(t.DidSaveTextDocumentNotification.type,P),sendDiagnostics:P=>S.sendNotification(t.PublishDiagnosticsNotification.type,P),onHover:P=>S.onRequest(t.HoverRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),void 0)}),onCompletion:P=>S.onRequest(t.CompletionRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),(0,r.attachPartialResult)(S,_))}),onCompletionResolve:P=>S.onRequest(t.CompletionResolveRequest.type,P),onSignatureHelp:P=>S.onRequest(t.SignatureHelpRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),void 0)}),onDeclaration:P=>S.onRequest(t.DeclarationRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),(0,r.attachPartialResult)(S,_))}),onDefinition:P=>S.onRequest(t.DefinitionRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),(0,r.attachPartialResult)(S,_))}),onTypeDefinition:P=>S.onRequest(t.TypeDefinitionRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),(0,r.attachPartialResult)(S,_))}),onImplementation:P=>S.onRequest(t.ImplementationRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),(0,r.attachPartialResult)(S,_))}),onReferences:P=>S.onRequest(t.ReferencesRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),(0,r.attachPartialResult)(S,_))}),onDocumentHighlight:P=>S.onRequest(t.DocumentHighlightRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),(0,r.attachPartialResult)(S,_))}),onDocumentSymbol:P=>S.onRequest(t.DocumentSymbolRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),(0,r.attachPartialResult)(S,_))}),onWorkspaceSymbol:P=>S.onRequest(t.WorkspaceSymbolRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),(0,r.attachPartialResult)(S,_))}),onWorkspaceSymbolResolve:P=>S.onRequest(t.WorkspaceSymbolResolveRequest.type,P),onCodeAction:P=>S.onRequest(t.CodeActionRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),(0,r.attachPartialResult)(S,_))}),onCodeActionResolve:P=>S.onRequest(t.CodeActionResolveRequest.type,(_,G)=>{return P(_,G)}),onCodeLens:P=>S.onRequest(t.CodeLensRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),(0,r.attachPartialResult)(S,_))}),onCodeLensResolve:P=>S.onRequest(t.CodeLensResolveRequest.type,(_,G)=>{return P(_,G)}),onDocumentFormatting:P=>S.onRequest(t.DocumentFormattingRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),void 0)}),onDocumentRangeFormatting:P=>S.onRequest(t.DocumentRangeFormattingRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),void 0)}),onDocumentOnTypeFormatting:P=>S.onRequest(t.DocumentOnTypeFormattingRequest.type,(_,G)=>{return P(_,G)}),onRenameRequest:P=>S.onRequest(t.RenameRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),void 0)}),onPrepareRename:P=>S.onRequest(t.PrepareRenameRequest.type,(_,G)=>{return P(_,G)}),onDocumentLinks:P=>S.onRequest(t.DocumentLinkRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),(0,r.attachPartialResult)(S,_))}),onDocumentLinkResolve:P=>S.onRequest(t.DocumentLinkResolveRequest.type,(_,G)=>{return P(_,G)}),onDocumentColor:P=>S.onRequest(t.DocumentColorRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),(0,r.attachPartialResult)(S,_))}),onColorPresentation:P=>S.onRequest(t.ColorPresentationRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),(0,r.attachPartialResult)(S,_))}),onFoldingRanges:P=>S.onRequest(t.FoldingRangeRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),(0,r.attachPartialResult)(S,_))}),onSelectionRanges:P=>S.onRequest(t.SelectionRangeRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),(0,r.attachPartialResult)(S,_))}),onExecuteCommand:P=>S.onRequest(t.ExecuteCommandRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),void 0)}),dispose:()=>S.dispose()};for(let P of nn){P.attach(Gt)}S.onRequest(t.InitializeRequest.type,P=>{R.initialize(P);if(e.string(P.trace)){fe.trace=t.Trace.fromString(P.trace)}for(let _ of nn){_.initialize(P.capabilities)}if(yn){let _=yn(P,new t.CancellationTokenSource().token,(0,r.attachWorkDone)(S,P),void 0);return Lr(_).then(G=>{if(G instanceof t.ResponseError){return G}let Et=G;if(!Et){Et={capabilities:{}}}let dt=Et.capabilities;if(!dt){dt={};Et.capabilities=dt}if(dt.textDocumentSync===void 0||dt.textDocumentSync===null){dt.textDocumentSync=e.number(Gt.__textDocumentSync)?Gt.__textDocumentSync:t.TextDocumentSyncKind.None}else if(!e.number(dt.textDocumentSync)&&!e.number(dt.textDocumentSync.change)){dt.textDocumentSync.change=e.number(Gt.__textDocumentSync)?Gt.__textDocumentSync:t.TextDocumentSyncKind.None}for(let sr of nn){sr.fillServerCapabilities(dt)}return Et})}else{let _={capabilities:{textDocumentSync:t.TextDocumentSyncKind.None}};for(let G of nn){G.fillServerCapabilities(_.capabilities)}return _}});S.onRequest(t.ShutdownRequest.type,()=>{R.shutdownReceived=true;if(hn){return hn(new t.CancellationTokenSource().token)}else{return void 0}});S.onNotification(t.ExitNotification.type,()=>{try{if(rn){rn()}}finally{if(R.shutdownReceived){R.exit(0)}else{R.exit(1)}}});S.onNotification(t.SetTraceNotification.type,P=>{fe.trace=t.Trace.fromString(P.value)});return Gt}oe.createConnection=Re;return oe}var Ly;function xy(){if(Ly)return di;Ly=1;(function(t){var e=di.__createBinding||(Object.create?function(l,u,c,d){if(d===void 0)d=c;var f=Object.getOwnPropertyDescriptor(u,c);if(!f||("get"in f?!u.__esModule:f.writable||f.configurable)){f={enumerable:true,get:function(){return u[c]}}}Object.defineProperty(l,d,f)}:function(l,u,c,d){if(d===void 0)d=c;l[d]=u[c]});var n=di.__exportStar||function(l,u){for(var c in l)if(c!=="default"&&!Object.prototype.hasOwnProperty.call(u,c))e(u,l,c)};Object.defineProperty(t,"__esModule",{value:true});t.ProposedFeatures=t.NotebookDocuments=t.TextDocuments=t.SemanticTokensBuilder=void 0;const r=Qv();Object.defineProperty(t,"SemanticTokensBuilder",{enumerable:true,get:function(){return r.SemanticTokensBuilder}});const i=D_();n(He(),t);const a=Zv();Object.defineProperty(t,"TextDocuments",{enumerable:true,get:function(){return a.TextDocuments}});const s=e$();Object.defineProperty(t,"NotebookDocuments",{enumerable:true,get:function(){return s.NotebookDocuments}});n(W_(),t);var o;(function(l){l.all={__brand:"features",languages:i.InlineCompletionFeature}})(o||(t.ProposedFeatures=o={}))})(di);return di}var Ic;var My;function V_(){if(My)return Ic;My=1;Ic=He();return Ic}var Fy;function r$(){if(Fy)return ci;Fy=1;(function(t){var e=ci.__createBinding||(Object.create?function(o,l,u,c){if(c===void 0)c=u;var d=Object.getOwnPropertyDescriptor(l,u);if(!d||("get"in d?!l.__esModule:d.writable||d.configurable)){d={enumerable:true,get:function(){return l[u]}}}Object.defineProperty(o,c,d)}:function(o,l,u,c){if(c===void 0)c=u;o[c]=l[u]});var n=ci.__exportStar||function(o,l){for(var u in o)if(u!=="default"&&!Object.prototype.hasOwnProperty.call(l,u))e(l,o,u)};Object.defineProperty(t,"__esModule",{value:true});t.createConnection=void 0;const r=xy();n(V_(),t);n(xy(),t);let i=false;const a={initialize:o=>{},get shutdownReceived(){return i},set shutdownReceived(o){i=o},exit:o=>{}};function s(o,l,u,c){let d;let f;let p;let y;if(o!==void 0&&o.__brand==="features"){d=o;o=l;l=u;u=c}if(r.ConnectionStrategy.is(o)||r.ConnectionOptions.is(o)){y=o}else{f=o;p=l;y=u}const v=k=>{return(0,r.createProtocolConnection)(f,p,k,y)};return(0,r.createConnection)(v,a,d)}t.createConnection=s})(ci);return ci}var U=r$();function Ky(t,e){const n={stacks:t,tokens:e};z_(n);n.stacks.flat().forEach(i=>{i.property=void 0});const r=a$(n.stacks);return r.map(i=>i[i.length-1])}function Xp(t){const{next:e,cardinalities:n,visited:r,plus:i}=t;const a=[];const s=e.feature;if(r.has(s)){return[]}else if(!wr(s)){r.add(s)}let o;let l=s;while(l.$container){if(wr(l.$container)){o=l.$container;break}else if(wg(l.$container)){l=l.$container}else{break}}if(iT(l.cardinality)){const u=qr({next:{feature:l,type:e.type},cardinalities:n,visited:r,plus:i});for(const c of u){i.add(c.feature)}a.push(...u)}if(o){const u=o.elements.indexOf(l);if(u!==void 0&&u<o.elements.length-1){a.push(...i$({feature:o,type:e.type},u+1,n,r,i))}if(a.every(c=>Ma(c.feature.cardinality,c.feature)||Ma(n.get(c.feature))||i.has(c.feature))){a.push(...Xp({next:{feature:o,type:e.type},cardinalities:n,visited:r,plus:i}))}}return a}function ap(t){if(rt(t)){t={feature:t}}return qr({next:t,cardinalities:new Map,visited:new Set,plus:new Set})}function qr(t){var e,n,r;const{next:i,cardinalities:a,visited:s,plus:o}=t;if(i===void 0){return[]}const{feature:l,type:u}=i;if(wr(l)){if(s.has(l)){return[]}else{s.add(l)}return i$(i,0,a,s,o).map(c=>Ws(c,l.cardinality,a))}else if(op(l)||lp(l)){return l.elements.flatMap(c=>qr({next:{feature:c,type:u,property:i.property},cardinalities:a,visited:s,plus:o})).map(c=>Ws(c,l.cardinality,a))}else if(cn(l)){const c={feature:l.terminal,type:u,property:(e=i.property)!==null&&e!==void 0?e:l.feature};return qr({next:c,cardinalities:a,visited:s,plus:o}).map(d=>Ws(d,l.cardinality,a))}else if(Za(l)){return Xp({next:{feature:l,type:qu(l),property:(n=i.property)!==null&&n!==void 0?n:l.feature},cardinalities:a,visited:s,plus:o})}else if(Mn(l)&&ct(l.rule.ref)){const c=l.rule.ref;const d={feature:c.definition,type:c.fragment||c.dataType?void 0:(r=ts(c))!==null&&r!==void 0?r:c.name,property:i.property};return qr({next:d,cardinalities:a,visited:s,plus:o}).map(f=>Ws(f,l.cardinality,a))}else{return[i]}}function Ws(t,e,n){n.set(t.feature,e);return t}function i$(t,e,n,r,i){var a;const s=[];let o;while(e<t.feature.elements.length){const l=t.feature.elements[e++];o={feature:l,type:t.type};s.push(...qr({next:o,cardinalities:n,visited:r,plus:i}));if(!Ma((a=o.feature.cardinality)!==null&&a!==void 0?a:n.get(o.feature),o.feature)){break}}return s}function z_(t){for(const e of t.tokens){const n=a$(t.stacks,e);t.stacks=n}}function a$(t,e){const n=[];for(const r of t){n.push(...X_(r,e))}return n}function X_(t,e){const n=new Map;const r=new Set(t.map(a=>a.feature).filter(Y_));const i=[];while(t.length>0){const a=t.pop();const s=Xp({next:a,cardinalities:n,plus:r,visited:new Set}).filter(o=>e?Yp(o.feature,e):true);for(const o of s){i.push([...t,o])}if(!s.every(o=>Ma(o.feature.cardinality,o.feature)||Ma(n.get(o.feature)))){break}}return i}function Y_(t){if(t.cardinality==="+"){return true}const e=In(t,cn);if(e&&e.cardinality==="+"){return true}return false}function Yp(t,e){if(dn(t)){const n=t.value;return n===e.image}else if(Mn(t)){return J_(t.rule.ref,e)}else if(es(t)){const n=Og(t);if(n){return Yp(n,e)}}return false}function J_(t,e){if(ct(t)){const n=ap(t.definition);return n.some(r=>Yp(r.feature,e))}else if(tr(t)){return ju(t).test(e.image)}else{return false}}function Q_(t){const e=Array.from(new Set(t.flatMap(r=>{var i;return(i=r===null||r===void 0?void 0:r.triggerCharacters)!==null&&i!==void 0?i:[]})));const n=Array.from(new Set(t.flatMap(r=>{var i;return(i=r===null||r===void 0?void 0:r.allCommitCharacters)!==null&&i!==void 0?i:[]})));return{triggerCharacters:e.length>0?e:void 0,allCommitCharacters:n.length>0?n:void 0}}class s${constructor(e){this.scopeProvider=e.references.ScopeProvider;this.grammar=e.Grammar;this.completionParser=e.parser.CompletionParser;this.nameProvider=e.references.NameProvider;this.lexer=e.parser.Lexer;this.nodeKindProvider=e.shared.lsp.NodeKindProvider;this.fuzzyMatcher=e.shared.lsp.FuzzyMatcher;this.grammarConfig=e.parser.GrammarConfig;this.astReflection=e.shared.AstReflection;this.documentationProvider=e.documentation.DocumentationProvider}async getCompletion(e,n,r){const i=[];const a=this.buildContexts(e,n.position);const s=(u,c)=>{const d=this.fillCompletionItem(u,c);if(d){i.push(d)}};const o=u=>{if(dn(u.feature)){return u.feature.value}else{return u.feature}};const l=[];for(const u of a){await Promise.all(be(u.features).distinct(o).exclude(l).map(c=>this.completionFor(u,c,s)));l.push(...u.features);if(!this.continueCompletion(i)){break}}return U.CompletionList.create(this.deduplicateItems(i),true)}deduplicateItems(e){return be(e).distinct(n=>`${n.kind}_${n.label}_${n.detail}`).toArray()}findFeaturesAt(e,n){const r=e.getText({start:U.Position.create(0,0),end:e.positionAt(n)});const i=this.completionParser.parse(r);const a=i.tokens;if(i.tokenIndex===0){const l=xd(this.grammar);const u=ap({feature:l.definition,type:ts(l)});if(a.length>0){a.shift();return Ky(u.map(c=>[c]),a)}else{return u}}const s=[...a].splice(i.tokenIndex);const o=Ky([i.elementStack.map(l=>({feature:l}))],s);return o}*buildContexts(e,n){var r,i;const a=e.parseResult.value.$cstNode;if(!a){return}const s=e.textDocument;const o=s.getText();const l=s.offsetAt(n);const u={document:e,textDocument:s,offset:l,position:n};const c=this.findDataTypeRuleStart(a,l);if(c){const[E,C]=c;const I=(r=Id(a,E))===null||r===void 0?void 0:r.astNode;yield Object.assign(Object.assign({},u),{node:I,tokenOffset:E,tokenEndOffset:C,features:this.findFeaturesAt(s,E)})}const{nextTokenStart:d,nextTokenEnd:f,previousTokenStart:p,previousTokenEnd:y}=this.backtrackToAnyToken(o,l);let v=d;if(l<=d&&p!==void 0){v=p}const k=(i=Id(a,v))===null||i===void 0?void 0:i.astNode;let $=true;if(p!==void 0&&y!==void 0&&y===l){yield Object.assign(Object.assign({},u),{node:k,tokenOffset:p,tokenEndOffset:y,features:this.findFeaturesAt(s,p)});$=this.performNextTokenCompletion(e,o.substring(p,y),p,y);if($){yield Object.assign(Object.assign({},u),{node:k,tokenOffset:y,tokenEndOffset:y,features:this.findFeaturesAt(s,y)})}}if(!k){const E=xd(this.grammar);if(!E){throw new Error("Missing entry parser rule")}yield Object.assign(Object.assign({},u),{tokenOffset:d,tokenEndOffset:f,features:ap(E.definition)})}else if($){yield Object.assign(Object.assign({},u),{node:k,tokenOffset:d,tokenEndOffset:f,features:this.findFeaturesAt(s,d)})}}performNextTokenCompletion(e,n,r,i){return/\P{L}$/u.test(n)}findDataTypeRuleStart(e,n){var r,i;let a=Er(e,n,this.grammarConfig.nameRegexp);let s=Boolean((r=In(a===null||a===void 0?void 0:a.grammarSource,ct))===null||r===void 0?void 0:r.dataType);if(s){while(s){a=a===null||a===void 0?void 0:a.container;s=Boolean((i=In(a===null||a===void 0?void 0:a.grammarSource,ct))===null||i===void 0?void 0:i.dataType)}if(a){return[a.offset,a.end]}}return void 0}continueCompletion(e){return e.length===0}backtrackToAnyToken(e,n){const r=this.lexer.tokenize(e).tokens;if(r.length===0){return{nextTokenStart:n,nextTokenEnd:n}}let i;for(const a of r){if(a.startOffset>=n){return{nextTokenStart:n,nextTokenEnd:n,previousTokenStart:i?i.startOffset:void 0,previousTokenEnd:i?i.endOffset+1:void 0}}if(a.endOffset>=n){return{nextTokenStart:a.startOffset,nextTokenEnd:a.endOffset+1,previousTokenStart:i?i.startOffset:void 0,previousTokenEnd:i?i.endOffset+1:void 0}}i=a}return{nextTokenStart:n,nextTokenEnd:n,previousTokenStart:i?i.startOffset:void 0,previousTokenEnd:i?i.endOffset+1:void 0}}completionFor(e,n,r){if(dn(n.feature)){return this.completionForKeyword(e,n.feature,r)}else if(es(n.feature)&&e.node){return this.completionForCrossReference(e,n,r)}}completionForCrossReference(e,n,r){const i=In(n.feature,cn);let a=e.node;if(i&&a){if(n.type){a={$type:n.type,$container:a,$containerProperty:n.property};Ng(this.astReflection,a)}const s={reference:{$refText:""},container:a,property:i.feature};try{for(const o of this.getReferenceCandidates(s,e)){r(e,this.createReferenceCompletionItem(o))}}catch(o){console.error(o)}}}getReferenceCandidates(e,n){return this.scopeProvider.getScope(e).getAllElements()}createReferenceCompletionItem(e){const n=this.nodeKindProvider.getCompletionItemKind(e);const r=this.getReferenceDocumentation(e);return{nodeDescription:e,kind:n,documentation:r,detail:e.type,sortText:"0"}}getReferenceDocumentation(e){if(!e.node){return void 0}const n=this.documentationProvider.getDocumentation(e.node);if(!n){return void 0}return{kind:"markdown",value:n}}completionForKeyword(e,n,r){if(!this.filterKeyword(e,n)){return}r(e,{label:n.value,kind:this.getKeywordCompletionItemKind(n),detail:"Keyword",sortText:"1"})}getKeywordCompletionItemKind(e){return U.CompletionItemKind.Keyword}filterKeyword(e,n){return/\p{L}/u.test(n.value)}fillCompletionItem(e,n){var r,i;let a;if(typeof n.label==="string"){a=n.label}else if("node"in n){const u=this.nameProvider.getName(n.node);if(!u){return void 0}a=u}else if("nodeDescription"in n){a=n.nodeDescription.name}else{return void 0}let s;if(typeof((r=n.textEdit)===null||r===void 0?void 0:r.newText)==="string"){s=n.textEdit.newText}else if(typeof n.insertText==="string"){s=n.insertText}else{s=a}const o=(i=n.textEdit)!==null&&i!==void 0?i:this.buildCompletionTextEdit(e,a,s);if(!o){return void 0}const l={additionalTextEdits:n.additionalTextEdits,command:n.command,commitCharacters:n.commitCharacters,data:n.data,detail:n.detail,documentation:n.documentation,filterText:n.filterText,insertText:n.insertText,insertTextFormat:n.insertTextFormat,insertTextMode:n.insertTextMode,kind:n.kind,labelDetails:n.labelDetails,preselect:n.preselect,sortText:n.sortText,tags:n.tags,textEditText:n.textEditText,textEdit:o,label:a};return l}buildCompletionTextEdit(e,n,r){const i=e.textDocument.getText();const a=i.substring(e.tokenOffset,e.offset);if(this.fuzzyMatcher.match(a,n)){const s=e.textDocument.positionAt(e.tokenOffset);const o=e.position;return{newText:r,range:{start:s,end:o}}}else{return void 0}}}class Z_{constructor(e){this.nameProvider=e.references.NameProvider;this.references=e.references.References;this.grammarConfig=e.parser.GrammarConfig}getDefinition(e,n,r){const i=e.parseResult.value;if(i.$cstNode){const a=i.$cstNode;const s=Er(a,e.textDocument.offsetAt(n.position),this.grammarConfig.nameRegexp);if(s){return this.collectLocationLinks(s,n)}}return void 0}collectLocationLinks(e,n){var r;const i=this.findLink(e);if(i){return[U.LocationLink.create(i.targetDocument.textDocument.uri,((r=i.target.astNode.$cstNode)!==null&&r!==void 0?r:i.target).range,i.target.range,i.source.range)]}return void 0}findLink(e){const n=this.references.findDeclarationNode(e);if(n===null||n===void 0?void 0:n.astNode){const r=yt(n.astNode);if(n&&r){return{source:e,target:n,targetDocument:r}}}return void 0}}class eD{constructor(e){this.references=e.references.References;this.nameProvider=e.references.NameProvider;this.grammarConfig=e.parser.GrammarConfig}getDocumentHighlight(e,n,r){const i=e.parseResult.value.$cstNode;if(!i){return void 0}const a=Er(i,e.textDocument.offsetAt(n.position),this.grammarConfig.nameRegexp);if(!a){return void 0}const s=this.references.findDeclaration(a);if(s){const o=Ue.equals(yt(s).uri,e.uri);const l={documentUri:e.uri,includeDeclaration:o};const u=this.references.findReferences(s,l);return u.map(c=>this.createDocumentHighlight(c)).toArray()}return void 0}createDocumentHighlight(e){return U.DocumentHighlight.create(e.segment.range)}}class tD{constructor(e){this.nameProvider=e.references.NameProvider;this.nodeKindProvider=e.shared.lsp.NodeKindProvider}getSymbols(e,n,r){return this.getSymbol(e,e.parseResult.value)}getSymbol(e,n){const r=n.$cstNode;const i=this.nameProvider.getNameNode(n);if(i&&r){const a=this.nameProvider.getName(n);return[{kind:this.nodeKindProvider.getSymbolKind(n),name:a||i.text,range:r.range,selectionRange:i.range,children:this.getChildSymbols(e,n)}]}else{return this.getChildSymbols(e,n)||[]}}getChildSymbols(e,n){const r=[];for(const i of Uu(n)){const a=this.getSymbol(e,i);r.push(...a)}if(r.length>0){return r}return void 0}}class o${constructor(e){this.workspaceManager=e.workspace.WorkspaceManager;this.documentBuilder=e.workspace.DocumentBuilder;this.workspaceLock=e.workspace.WorkspaceLock;this.serviceRegistry=e.ServiceRegistry;let n=false;e.lsp.LanguageServer.onInitialize(r=>{var i,a;n=Boolean((a=(i=r.capabilities.workspace)===null||i===void 0?void 0:i.didChangeWatchedFiles)===null||a===void 0?void 0:a.dynamicRegistration)});e.lsp.LanguageServer.onInitialized(r=>{if(n){this.registerFileWatcher(e)}})}registerFileWatcher(e){const n=be(e.ServiceRegistry.all).flatMap(r=>r.LanguageMetaData.fileExtensions).map(r=>r.startsWith(".")?r.substring(1):r).distinct().toArray();if(n.length>0){const r=e.lsp.Connection;const i={watchers:[{globPattern:n.length===1?`**/*.${n[0]}`:`**/*.{${n.join(",")}}`}]};r===null||r===void 0?void 0:r.client.register(U.DidChangeWatchedFilesNotification.type,i)}}fireDocumentUpdate(e,n){e=e.filter(r=>this.serviceRegistry.hasServices(r));this.workspaceManager.ready.then(()=>{this.workspaceLock.write(r=>this.documentBuilder.update(e,n,r))}).catch(r=>{console.error("Workspace initialization failed. Could not perform document update.",r)})}didChangeContent(e){this.fireDocumentUpdate([lt.parse(e.document.uri)],[])}didChangeWatchedFiles(e){const n=be(e.changes).filter(i=>i.type!==U.FileChangeType.Deleted).distinct(i=>i.uri).map(i=>lt.parse(i.uri)).toArray();const r=be(e.changes).filter(i=>i.type===U.FileChangeType.Deleted).distinct(i=>i.uri).map(i=>lt.parse(i.uri)).toArray();this.fireDocumentUpdate(n,r)}}class nD{constructor(e){this.commentNames=e.parser.GrammarConfig.multilineCommentRules}getFoldingRanges(e,n,r){const i=[];const a=s=>i.push(s);this.collectFolding(e,a);return i}collectFolding(e,n){var r;const i=(r=e.parseResult)===null||r===void 0?void 0:r.value;if(i){if(this.shouldProcessContent(i)){const a=Nr(i).iterator();let s;do{s=a.next();if(!s.done){const o=s.value;if(this.shouldProcess(o)){this.collectObjectFolding(e,o,n)}if(!this.shouldProcessContent(o)){a.prune()}}}while(!s.done)}this.collectCommentFolding(e,i,n)}}shouldProcess(e){return true}shouldProcessContent(e){return true}collectObjectFolding(e,n,r){const i=n.$cstNode;if(i){const a=this.toFoldingRange(e,i);if(a){r(a)}}}collectCommentFolding(e,n,r){const i=n.$cstNode;if(i){for(const a of T$(i)){if(this.commentNames.includes(a.tokenType.name)){const s=this.toFoldingRange(e,a,U.FoldingRangeKind.Comment);if(s){r(s)}}}}}toFoldingRange(e,n,r){const i=n.range;const a=i.start;let s=i.end;if(s.line-a.line<2){return void 0}if(!this.includeLastFoldingLine(n,r)){s=e.textDocument.positionAt(e.textDocument.offsetAt({line:s.line,character:0})-1)}return U.FoldingRange.create(a.line,s.line,a.character,s.character,r)}includeLastFoldingLine(e,n){if(n===U.FoldingRangeKind.Comment){return false}const r=e.text;const i=r.charAt(r.length-1);if(i==="}"||i===")"||i==="]"){return false}return true}}class rD{match(e,n){if(e.length===0){return true}let r=false;let i;let a=0;const s=n.length;for(let o=0;o<s;o++){const l=n.charCodeAt(o);const u=e.charCodeAt(a);if(l===u||this.toUpperCharCode(l)===this.toUpperCharCode(u)){r||(r=i===void 0||this.isWordTransition(i,l));if(r){a++}if(a===e.length){return true}}i=l}return false}isWordTransition(e,n){return Uy<=e&&e<=Gy&&iD<=n&&n<=aD||e===Hy&&n!==Hy}toUpperCharCode(e){if(Uy<=e&&e<=Gy){return e-32}return e}}const Uy="a".charCodeAt(0);const Gy="z".charCodeAt(0);const iD="A".charCodeAt(0);const aD="Z".charCodeAt(0);const Hy="_".charCodeAt(0);class sD{constructor(e){this.references=e.references.References;this.grammarConfig=e.parser.GrammarConfig}getHoverContent(e,n){var r,i;const a=(i=(r=e.parseResult)===null||r===void 0?void 0:r.value)===null||i===void 0?void 0:i.$cstNode;if(a){const s=e.textDocument.offsetAt(n.position);const o=Er(a,s,this.grammarConfig.nameRegexp);if(o&&o.offset+o.length>s){const l=this.references.findDeclaration(o);if(l){return this.getAstNodeHoverContent(l)}}}return void 0}}class oD extends sD{constructor(e){super(e);this.documentationProvider=e.documentation.DocumentationProvider}getAstNodeHoverContent(e){const n=this.documentationProvider.getDocumentation(e);if(n){return{contents:{kind:"markdown",value:n}}}return void 0}}var vr=He();const lD={[U.SemanticTokenTypes.class]:0,[U.SemanticTokenTypes.comment]:1,[U.SemanticTokenTypes.enum]:2,[U.SemanticTokenTypes.enumMember]:3,[U.SemanticTokenTypes.event]:4,[U.SemanticTokenTypes.function]:5,[U.SemanticTokenTypes.interface]:6,[U.SemanticTokenTypes.keyword]:7,[U.SemanticTokenTypes.macro]:8,[U.SemanticTokenTypes.method]:9,[U.SemanticTokenTypes.modifier]:10,[U.SemanticTokenTypes.namespace]:11,[U.SemanticTokenTypes.number]:12,[U.SemanticTokenTypes.operator]:13,[U.SemanticTokenTypes.parameter]:14,[U.SemanticTokenTypes.property]:15,[U.SemanticTokenTypes.regexp]:16,[U.SemanticTokenTypes.string]:17,[U.SemanticTokenTypes.struct]:18,[U.SemanticTokenTypes.type]:19,[U.SemanticTokenTypes.typeParameter]:20,[U.SemanticTokenTypes.variable]:21,[U.SemanticTokenTypes.decorator]:22};const uD={[U.SemanticTokenModifiers.abstract]:1<<0,[U.SemanticTokenModifiers.async]:1<<1,[U.SemanticTokenModifiers.declaration]:1<<2,[U.SemanticTokenModifiers.defaultLibrary]:1<<3,[U.SemanticTokenModifiers.definition]:1<<4,[U.SemanticTokenModifiers.deprecated]:1<<5,[U.SemanticTokenModifiers.documentation]:1<<6,[U.SemanticTokenModifiers.modification]:1<<7,[U.SemanticTokenModifiers.readonly]:1<<8,[U.SemanticTokenModifiers.static]:1<<9};function cD(t){const e=[];const n=[];let r=true;let i=true;let a=true;for(const s of t){if(!s){continue}s.legend.tokenTypes.forEach((o,l)=>{const u=e[l];if(u&&u!==o){throw new Error(`Cannot merge '${u}' and '${o}' token types. They use the same index ${l}.`)}else{e[l]=o}});s.legend.tokenModifiers.forEach((o,l)=>{const u=n[l];if(u&&u!==o){throw new Error(`Cannot merge '${u}' and '${o}' token modifier. They use the same index ${l}.`)}else{n[l]=o}});if(!s.full){r=false}else if(typeof s.full==="object"&&!s.full.delta){i=false}if(!s.range){a=false}}return{legend:{tokenTypes:e,tokenModifiers:n},full:r&&{delta:i},range:a}}class dD extends U.SemanticTokensBuilder{constructor(){super(...arguments);this._tokens=[]}push(e,n,r,i,a){this._tokens.push({line:e,char:n,length:r,tokenType:i,tokenModifiers:a})}build(){this.applyTokens();return super.build()}buildEdits(){this.applyTokens();return super.buildEdits()}flush(){this.previousResult(this.id)}applyTokens(){for(const e of this._tokens.sort(this.compareTokens)){super.push(e.line,e.char,e.length,e.tokenType,e.tokenModifiers)}this._tokens=[]}compareTokens(e,n){if(e.line===n.line){return e.char-n.char}return e.line-n.line}}class fD{constructor(e){this.tokensBuilders=new Map;e.shared.workspace.TextDocuments.onDidClose(n=>{this.tokensBuilders.delete(n.document.uri)});e.shared.lsp.LanguageServer.onInitialize(n=>{var r;this.initialize((r=n.capabilities.textDocument)===null||r===void 0?void 0:r.semanticTokens)})}initialize(e){this.clientCapabilities=e}get tokenTypes(){return lD}get tokenModifiers(){return uD}get semanticTokensOptions(){return{legend:{tokenTypes:Object.keys(this.tokenTypes),tokenModifiers:Object.keys(this.tokenModifiers)},full:{delta:true},range:true}}async semanticHighlight(e,n,r=ye.CancellationToken.None){this.currentRange=void 0;this.currentDocument=e;this.currentTokensBuilder=this.getDocumentTokensBuilder(e);this.currentTokensBuilder.flush();await this.computeHighlighting(e,this.createAcceptor(),r);return this.currentTokensBuilder.build()}async semanticHighlightRange(e,n,r=ye.CancellationToken.None){this.currentRange=n.range;this.currentDocument=e;this.currentTokensBuilder=this.getDocumentTokensBuilder(e);this.currentTokensBuilder.flush();await this.computeHighlighting(e,this.createAcceptor(),r);return this.currentTokensBuilder.build()}async semanticHighlightDelta(e,n,r=ye.CancellationToken.None){this.currentRange=void 0;this.currentDocument=e;this.currentTokensBuilder=this.getDocumentTokensBuilder(e);this.currentTokensBuilder.previousResult(n.previousResultId);await this.computeHighlighting(e,this.createAcceptor(),r);return this.currentTokensBuilder.buildEdits()}createAcceptor(){const e=n=>{if("line"in n){this.highlightToken({range:{start:{line:n.line,character:n.char},end:{line:n.line,character:n.char+n.length}},type:n.type,modifier:n.modifier})}else if("range"in n){this.highlightToken(n)}else if("keyword"in n){this.highlightKeyword(n)}else if("property"in n){this.highlightProperty(n)}else{this.highlightNode({node:n.cst,type:n.type,modifier:n.modifier})}};return e}getDocumentTokensBuilder(e){const n=this.tokensBuilders.get(e.uri.toString());if(n){return n}const r=new dD;this.tokensBuilders.set(e.uri.toString(),r);return r}async computeHighlighting(e,n,r){const i=e.parseResult.value;const a=Yn(i,{range:this.currentRange}).iterator();let s;do{s=a.next();if(!s.done){await ht(r);const o=s.value;if(this.highlightElement(o,n)==="prune"){a.prune()}}}while(!s.done)}highlightToken(e){var n;const{range:r,type:i}=e;let a=e.modifier;if(this.currentRange&&!Rg(r,this.currentRange)||!this.currentDocument||!this.currentTokensBuilder){return}const s=this.tokenTypes[i];let o=0;if(a!==void 0){if(typeof a==="string"){a=[a]}for(const c of a){const d=this.tokenModifiers[c];o|=d}}const l=r.start.line;const u=r.end.line;if(l===u){const c=r.start.character;const d=r.end.character-c;this.currentTokensBuilder.push(l,c,d,s,o)}else if((n=this.clientCapabilities)===null||n===void 0?void 0:n.multilineTokenSupport){const c=r.start.character;const d=this.currentDocument.textDocument.offsetAt(r.start);const f=this.currentDocument.textDocument.offsetAt(r.end);this.currentTokensBuilder.push(l,c,f-d,s,o)}else{const c=r.start;let d=this.currentDocument.textDocument.offsetAt({line:l+1,character:0});this.currentTokensBuilder.push(c.line,c.character,d-c.character-1,s,o);for(let f=l+1;f<u;f++){const p=d;d=this.currentDocument.textDocument.offsetAt({line:f+1,character:0});this.currentTokensBuilder.push(f,0,d-p-1,s,o)}this.currentTokensBuilder.push(u,0,r.end.character,s,o)}}highlightProperty(e){const n=[];if(typeof e.index==="number"){const a=cp(e.node.$cstNode,e.property,e.index);if(a){n.push(a)}}else{n.push(...Ig(e.node.$cstNode,e.property))}const{type:r,modifier:i}=e;for(const a of n){this.highlightNode({node:a,type:r,modifier:i})}}highlightKeyword(e){const{node:n,keyword:r,type:i,index:a,modifier:s}=e;const o=[];if(typeof a==="number"){const l=Lg(n.$cstNode,r,a);if(l){o.push(l)}}else{o.push(...nT(n.$cstNode,r))}for(const l of o){this.highlightNode({node:l,type:i,modifier:s})}}highlightNode(e){const{node:n,type:r,modifier:i}=e;const a=n.range;this.highlightToken({range:a,type:r,modifier:i})}}var qy;(function(t){function e(r,i,a){const s=new Map;Object.entries(i).forEach(([u,c])=>s.set(c,u));let o=0;let l=0;return n(r.data,5).map(u=>{o+=u[0];if(u[0]!==0){l=0}l+=u[1];const c=u[2];const d=a.textDocument.offsetAt({line:o,character:l});return{offset:d,tokenType:s.get(u[3]),tokenModifiers:u[4],text:a.textDocument.getText({start:{line:o,character:l},end:{line:o,character:l+c}})}})}t.decode=e;function n(r,i){const a=[];for(let s=0;s<r.length;s+=i){const o=r.slice(s,s+i);a.push(o)}return a}})(qy||(qy={}));function pD(t){const e=[];const n=[];t.forEach(i=>{if(i===null||i===void 0?void 0:i.triggerCharacters){e.push(...i.triggerCharacters)}if(i===null||i===void 0?void 0:i.retriggerCharacters){n.push(...i.retriggerCharacters)}});const r={triggerCharacters:e.length>0?Array.from(new Set(e)).sort():void 0,retriggerCharacters:n.length>0?Array.from(new Set(n)).sort():void 0};return r.triggerCharacters?r:void 0}class mD{constructor(e){this.onInitializeEmitter=new vr.Emitter;this.onInitializedEmitter=new vr.Emitter;this.services=e}get onInitialize(){return this.onInitializeEmitter.event}get onInitialized(){return this.onInitializedEmitter.event}async initialize(e){this.eagerLoadServices();this.fireInitializeOnDefaultServices(e);this.onInitializeEmitter.fire(e);this.onInitializeEmitter.dispose();return this.buildInitializeResult(e)}eagerLoadServices(){rp(this.services);this.services.ServiceRegistry.all.forEach(e=>rp(e))}hasService(e){const n=this.services.ServiceRegistry.all;return n.some(r=>e(r)!==void 0)}buildInitializeResult(e){var n,r,i,a;const s=this.services.lsp.DocumentUpdateHandler;const o=(n=this.services.lsp.FileOperationHandler)===null||n===void 0?void 0:n.fileOperationOptions;const l=this.services.ServiceRegistry.all;const u=this.hasService(K=>{var N;return(N=K.lsp)===null||N===void 0?void 0:N.Formatter});const c=l.map(K=>{var N,re;return(re=(N=K.lsp)===null||N===void 0?void 0:N.Formatter)===null||re===void 0?void 0:re.formatOnTypeOptions}).find(K=>Boolean(K));const d=this.hasService(K=>{var N;return(N=K.lsp)===null||N===void 0?void 0:N.CodeActionProvider});const f=this.hasService(K=>{var N;return(N=K.lsp)===null||N===void 0?void 0:N.SemanticTokenProvider});const p=cD(l.map(K=>{var N,re;return(re=(N=K.lsp)===null||N===void 0?void 0:N.SemanticTokenProvider)===null||re===void 0?void 0:re.semanticTokensOptions}));const y=(i=(r=this.services.lsp)===null||r===void 0?void 0:r.ExecuteCommandHandler)===null||i===void 0?void 0:i.commands;const v=this.hasService(K=>{var N;return(N=K.lsp)===null||N===void 0?void 0:N.DocumentLinkProvider});const k=pD(l.map(K=>{var N,re;return(re=(N=K.lsp)===null||N===void 0?void 0:N.SignatureHelp)===null||re===void 0?void 0:re.signatureHelpOptions}));const $=this.hasService(K=>{var N;return(N=K.lsp)===null||N===void 0?void 0:N.TypeProvider});const E=this.hasService(K=>{var N;return(N=K.lsp)===null||N===void 0?void 0:N.ImplementationProvider});const C=this.hasService(K=>{var N;return(N=K.lsp)===null||N===void 0?void 0:N.CompletionProvider});const I=Q_(l.map(K=>{var N,re;return(re=(N=K.lsp)===null||N===void 0?void 0:N.CompletionProvider)===null||re===void 0?void 0:re.completionOptions}));const Y=this.hasService(K=>{var N;return(N=K.lsp)===null||N===void 0?void 0:N.ReferencesProvider});const q=this.hasService(K=>{var N;return(N=K.lsp)===null||N===void 0?void 0:N.DocumentSymbolProvider});const J=this.hasService(K=>{var N;return(N=K.lsp)===null||N===void 0?void 0:N.DefinitionProvider});const ne=this.hasService(K=>{var N;return(N=K.lsp)===null||N===void 0?void 0:N.DocumentHighlightProvider});const ae=this.hasService(K=>{var N;return(N=K.lsp)===null||N===void 0?void 0:N.FoldingRangeProvider});const de=this.hasService(K=>{var N;return(N=K.lsp)===null||N===void 0?void 0:N.HoverProvider});const L=this.hasService(K=>{var N;return(N=K.lsp)===null||N===void 0?void 0:N.RenameProvider});const w=this.hasService(K=>{var N;return(N=K.lsp)===null||N===void 0?void 0:N.CallHierarchyProvider});const g=this.hasService(K=>{var N;return(N=K.lsp)===null||N===void 0?void 0:N.TypeHierarchyProvider});const b=this.hasService(K=>{var N;return(N=K.lsp)===null||N===void 0?void 0:N.CodeLensProvider});const M=this.hasService(K=>{var N;return(N=K.lsp)===null||N===void 0?void 0:N.DeclarationProvider});const O=this.hasService(K=>{var N;return(N=K.lsp)===null||N===void 0?void 0:N.InlayHintProvider});const x=(a=this.services.lsp)===null||a===void 0?void 0:a.WorkspaceSymbolProvider;const we={capabilities:{workspace:{workspaceFolders:{supported:true},fileOperations:o},executeCommandProvider:y&&{commands:y},textDocumentSync:{change:vr.TextDocumentSyncKind.Incremental,openClose:true,save:Boolean(s.didSaveDocument),willSave:Boolean(s.willSaveDocument),willSaveWaitUntil:Boolean(s.willSaveDocumentWaitUntil)},completionProvider:C?I:void 0,referencesProvider:Y,documentSymbolProvider:q,definitionProvider:J,typeDefinitionProvider:$,documentHighlightProvider:ne,codeActionProvider:d,documentFormattingProvider:u,documentRangeFormattingProvider:u,documentOnTypeFormattingProvider:c,foldingRangeProvider:ae,hoverProvider:de,renameProvider:L?{prepareProvider:true}:void 0,semanticTokensProvider:f?p:void 0,signatureHelpProvider:k,implementationProvider:E,callHierarchyProvider:w?{}:void 0,typeHierarchyProvider:g?{}:void 0,documentLinkProvider:v?{resolveProvider:false}:void 0,codeLensProvider:b?{resolveProvider:false}:void 0,declarationProvider:M,inlayHintProvider:O?{resolveProvider:false}:void 0,workspaceSymbolProvider:x?{resolveProvider:Boolean(x.resolveSymbol)}:void 0}};return we}initialized(e){this.fireInitializedOnDefaultServices(e);this.onInitializedEmitter.fire(e);this.onInitializedEmitter.dispose()}fireInitializeOnDefaultServices(e){this.services.workspace.ConfigurationProvider.initialize(e);this.services.workspace.WorkspaceManager.initialize(e)}fireInitializedOnDefaultServices(e){const n=this.services.lsp.Connection;const r=n?Object.assign(Object.assign({},e),{register:i=>n.client.register(vr.DidChangeConfigurationNotification.type,i),fetchConfiguration:i=>n.workspace.getConfiguration(i)}):e;this.services.workspace.ConfigurationProvider.initialized(r).catch(i=>console.error("Error in ConfigurationProvider initialization:",i));this.services.workspace.WorkspaceManager.initialized(e).catch(i=>console.error("Error in WorkspaceManager initialization:",i))}}function hD(t){const e=t.lsp.Connection;if(!e){throw new Error("Starting a language server requires the languageServer.Connection service to be set.")}yD(e,t);gD(e,t);RD(e,t);vD(e,t);$D(e,t);ED(e,t);wD(e,t);CD(e,t);SD(e,t);kD(e,t);ND(e,t);PD(e,t);TD(e,t);_D(e,t);bD(e,t);DD(e,t);OD(e,t);LD(e,t);MD(e,t);UD(e,t);GD(e,t);FD(e,t);xD(e,t);ID(e,t);AD(e,t);KD(e,t);e.onInitialize(r=>{return t.lsp.LanguageServer.initialize(r)});e.onInitialized(r=>{t.lsp.LanguageServer.initialized(r)});const n=t.workspace.TextDocuments;n.listen(e);e.listen()}function yD(t,e){const n=e.lsp.DocumentUpdateHandler;const r=e.workspace.TextDocuments;if(n.didOpenDocument){r.onDidOpen(i=>n.didOpenDocument(i))}if(n.didChangeContent){r.onDidChangeContent(i=>n.didChangeContent(i))}if(n.didCloseDocument){r.onDidClose(i=>n.didCloseDocument(i))}if(n.didSaveDocument){r.onDidSave(i=>n.didSaveDocument(i))}if(n.willSaveDocument){r.onWillSave(i=>n.willSaveDocument(i))}if(n.willSaveDocumentWaitUntil){r.onWillSaveWaitUntil(i=>n.willSaveDocumentWaitUntil(i))}if(n.didChangeWatchedFiles){t.onDidChangeWatchedFiles(i=>n.didChangeWatchedFiles(i))}}function gD(t,e){const n=e.lsp.FileOperationHandler;if(!n){return}if(n.didCreateFiles){t.workspace.onDidCreateFiles(r=>n.didCreateFiles(r))}if(n.didRenameFiles){t.workspace.onDidRenameFiles(r=>n.didRenameFiles(r))}if(n.didDeleteFiles){t.workspace.onDidDeleteFiles(r=>n.didDeleteFiles(r))}if(n.willCreateFiles){t.workspace.onWillCreateFiles(r=>n.willCreateFiles(r))}if(n.willRenameFiles){t.workspace.onWillRenameFiles(r=>n.willRenameFiles(r))}if(n.willDeleteFiles){t.workspace.onWillDeleteFiles(r=>n.willDeleteFiles(r))}}function RD(t,e){const n=e.workspace.DocumentBuilder;n.onUpdate(async(r,i)=>{for(const a of i){t.sendDiagnostics({uri:a.toString(),diagnostics:[]})}});n.onDocumentPhase(z.Validated,async r=>{if(r.diagnostics){t.sendDiagnostics({uri:r.uri.toString(),diagnostics:r.diagnostics})}})}function vD(t,e){t.onCompletion(ut((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.CompletionProvider)===null||o===void 0?void 0:o.getCompletion(r,i,a)},e,z.IndexedReferences))}function $D(t,e){t.onReferences(ut((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.ReferencesProvider)===null||o===void 0?void 0:o.findReferences(r,i,a)},e,z.IndexedReferences))}function TD(t,e){t.onCodeAction(ut((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.CodeActionProvider)===null||o===void 0?void 0:o.getCodeActions(r,i,a)},e,z.Validated))}function ED(t,e){t.onDocumentSymbol(ut((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.DocumentSymbolProvider)===null||o===void 0?void 0:o.getSymbols(r,i,a)},e,z.Parsed))}function wD(t,e){t.onDefinition(ut((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.DefinitionProvider)===null||o===void 0?void 0:o.getDefinition(r,i,a)},e,z.IndexedReferences))}function CD(t,e){t.onTypeDefinition(ut((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.TypeProvider)===null||o===void 0?void 0:o.getTypeDefinition(r,i,a)},e,z.IndexedReferences))}function SD(t,e){t.onImplementation(ut((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.ImplementationProvider)===null||o===void 0?void 0:o.getImplementation(r,i,a)},e,z.IndexedReferences))}function AD(t,e){t.onDeclaration(ut((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.DeclarationProvider)===null||o===void 0?void 0:o.getDeclaration(r,i,a)},e,z.IndexedReferences))}function kD(t,e){t.onDocumentHighlight(ut((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.DocumentHighlightProvider)===null||o===void 0?void 0:o.getDocumentHighlight(r,i,a)},e,z.IndexedReferences))}function bD(t,e){t.onHover(ut((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.HoverProvider)===null||o===void 0?void 0:o.getHoverContent(r,i,a)},e,z.IndexedReferences))}function ND(t,e){t.onFoldingRanges(ut((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.FoldingRangeProvider)===null||o===void 0?void 0:o.getFoldingRanges(r,i,a)},e,z.Parsed))}function PD(t,e){t.onDocumentFormatting(ut((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.Formatter)===null||o===void 0?void 0:o.formatDocument(r,i,a)},e,z.Parsed));t.onDocumentRangeFormatting(ut((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.Formatter)===null||o===void 0?void 0:o.formatDocumentRange(r,i,a)},e,z.Parsed));t.onDocumentOnTypeFormatting(ut((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.Formatter)===null||o===void 0?void 0:o.formatDocumentOnType(r,i,a)},e,z.Parsed))}function _D(t,e){t.onRenameRequest(ut((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.RenameProvider)===null||o===void 0?void 0:o.rename(r,i,a)},e,z.IndexedReferences));t.onPrepareRename(ut((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.RenameProvider)===null||o===void 0?void 0:o.prepareRename(r,i,a)},e,z.IndexedReferences))}function DD(t,e){t.languages.inlayHint.on(xn((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.InlayHintProvider)===null||o===void 0?void 0:o.getInlayHints(r,i,a)},e,z.IndexedReferences))}function OD(t,e){const n={data:[]};t.languages.semanticTokens.on(xn((r,i,a,s)=>{var o;if((o=r.lsp)===null||o===void 0?void 0:o.SemanticTokenProvider){return r.lsp.SemanticTokenProvider.semanticHighlight(i,a,s)}return n},e,z.IndexedReferences));t.languages.semanticTokens.onDelta(xn((r,i,a,s)=>{var o;if((o=r.lsp)===null||o===void 0?void 0:o.SemanticTokenProvider){return r.lsp.SemanticTokenProvider.semanticHighlightDelta(i,a,s)}return n},e,z.IndexedReferences));t.languages.semanticTokens.onRange(xn((r,i,a,s)=>{var o;if((o=r.lsp)===null||o===void 0?void 0:o.SemanticTokenProvider){return r.lsp.SemanticTokenProvider.semanticHighlightRange(i,a,s)}return n},e,z.IndexedReferences))}function ID(t,e){t.onDidChangeConfiguration(n=>{if(n.settings){e.workspace.ConfigurationProvider.updateConfiguration(n)}})}function LD(t,e){const n=e.lsp.ExecuteCommandHandler;if(n){t.onExecuteCommand(async(r,i)=>{var a;try{return await n.executeCommand(r.command,(a=r.arguments)!==null&&a!==void 0?a:[],i)}catch(s){return Gn(s)}})}}function xD(t,e){t.onDocumentLinks(xn((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.DocumentLinkProvider)===null||o===void 0?void 0:o.getDocumentLinks(r,i,a)},e,z.Parsed))}function MD(t,e){t.onSignatureHelp(xn((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.SignatureHelp)===null||o===void 0?void 0:o.provideSignatureHelp(r,i,a)},e,z.IndexedReferences))}function FD(t,e){t.onCodeLens(xn((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.CodeLensProvider)===null||o===void 0?void 0:o.provideCodeLens(r,i,a)},e,z.IndexedReferences))}function KD(t,e){var n;const r=e.lsp.WorkspaceSymbolProvider;if(r){const i=e.workspace.DocumentBuilder;t.onWorkspaceSymbol(async(s,o)=>{try{await i.waitUntil(z.IndexedContent,o);return await r.getSymbols(s,o)}catch(l){return Gn(l)}});const a=(n=r.resolveSymbol)===null||n===void 0?void 0:n.bind(r);if(a){t.onWorkspaceSymbolResolve(async(s,o)=>{try{await i.waitUntil(z.IndexedContent,o);return await a(s,o)}catch(l){return Gn(l)}})}}}function UD(t,e){t.languages.callHierarchy.onPrepare(xn(async(n,r,i,a)=>{var s;if((s=n.lsp)===null||s===void 0?void 0:s.CallHierarchyProvider){const o=await n.lsp.CallHierarchyProvider.prepareCallHierarchy(r,i,a);return o!==null&&o!==void 0?o:null}return null},e,z.IndexedReferences));t.languages.callHierarchy.onIncomingCalls(Fu(async(n,r,i)=>{var a;if((a=n.lsp)===null||a===void 0?void 0:a.CallHierarchyProvider){const s=await n.lsp.CallHierarchyProvider.incomingCalls(r,i);return s!==null&&s!==void 0?s:null}return null},e));t.languages.callHierarchy.onOutgoingCalls(Fu(async(n,r,i)=>{var a;if((a=n.lsp)===null||a===void 0?void 0:a.CallHierarchyProvider){const s=await n.lsp.CallHierarchyProvider.outgoingCalls(r,i);return s!==null&&s!==void 0?s:null}return null},e))}function GD(t,e){if(!e.ServiceRegistry.all.some(n=>{var r;return(r=n.lsp)===null||r===void 0?void 0:r.TypeHierarchyProvider})){return}t.languages.typeHierarchy.onPrepare(xn(async(n,r,i,a)=>{var s,o;const l=await((o=(s=n.lsp)===null||s===void 0?void 0:s.TypeHierarchyProvider)===null||o===void 0?void 0:o.prepareTypeHierarchy(r,i,a));return l!==null&&l!==void 0?l:null},e,z.IndexedReferences));t.languages.typeHierarchy.onSupertypes(Fu(async(n,r,i)=>{var a,s;const o=await((s=(a=n.lsp)===null||a===void 0?void 0:a.TypeHierarchyProvider)===null||s===void 0?void 0:s.supertypes(r,i));return o!==null&&o!==void 0?o:null},e));t.languages.typeHierarchy.onSubtypes(Fu(async(n,r,i)=>{var a,s;const o=await((s=(a=n.lsp)===null||a===void 0?void 0:a.TypeHierarchyProvider)===null||s===void 0?void 0:s.subtypes(r,i));return o!==null&&o!==void 0?o:null},e))}function Fu(t,e){const n=e.ServiceRegistry;return async(r,i)=>{const a=lt.parse(r.item.uri);const s=await Jp(e,i,a,z.IndexedReferences);if(s){return s}if(!n.hasServices(a)){const l=`Could not find service instance for uri: '${a}'`;console.debug(l);return Gn(new Error(l))}const o=n.getServices(a);try{return await t(o,r,i)}catch(l){return Gn(l)}}}function xn(t,e,n){const r=e.workspace.LangiumDocuments;const i=e.ServiceRegistry;return async(a,s)=>{const o=lt.parse(a.textDocument.uri);const l=await Jp(e,s,o,n);if(l){return l}if(!i.hasServices(o)){const c=`Could not find service instance for uri: '${o}'`;console.debug(c);return Gn(new Error(c))}const u=i.getServices(o);try{const c=await r.getOrCreateDocument(o);return await t(u,c,a,s)}catch(c){return Gn(c)}}}function ut(t,e,n){const r=e.workspace.LangiumDocuments;const i=e.ServiceRegistry;return async(a,s)=>{const o=lt.parse(a.textDocument.uri);const l=await Jp(e,s,o,n);if(l){return l}if(!i.hasServices(o)){console.debug(`Could not find service instance for uri: '${o.toString()}'`);return null}const u=i.getServices(o);try{const c=await r.getOrCreateDocument(o);return await t(u,c,a,s)}catch(c){return Gn(c)}}}async function Jp(t,e,n,r){if(r!==void 0){const i=t.workspace.DocumentBuilder;try{await i.waitUntil(r,n,e)}catch(a){return Gn(a)}}return void 0}function Gn(t){if(ds(t)){return new vr.ResponseError(vr.LSPErrorCodes.RequestCancelled,"The request has been cancelled.")}if(t instanceof vr.ResponseError){return t}throw t}class l${getSymbolKind(e){return U.SymbolKind.Field}getCompletionItemKind(e){return U.CompletionItemKind.Reference}}class HD{constructor(e){this.nameProvider=e.references.NameProvider;this.references=e.references.References;this.grammarConfig=e.parser.GrammarConfig}findReferences(e,n,r){const i=e.parseResult.value.$cstNode;if(!i){return[]}const a=Er(i,e.textDocument.offsetAt(n.position),this.grammarConfig.nameRegexp);if(!a){return[]}return this.getReferences(a,n,e)}getReferences(e,n,r){const i=[];const a=this.references.findDeclaration(e);if(a){const s={includeDeclaration:n.context.includeDeclaration};this.references.findReferences(a,s).forEach(o=>{i.push(U.Location.create(o.sourceUri.toString(),o.segment.range))})}return i}}class qD{constructor(e){this.references=e.references.References;this.nameProvider=e.references.NameProvider;this.grammarConfig=e.parser.GrammarConfig}async rename(e,n,r){const i={};const a=e.parseResult.value.$cstNode;if(!a)return void 0;const s=e.textDocument.offsetAt(n.position);const o=Er(a,s,this.grammarConfig.nameRegexp);if(!o)return void 0;const l=this.references.findDeclaration(o);if(!l)return void 0;const u={onlyLocal:false,includeDeclaration:true};const c=this.references.findReferences(l,u);c.forEach(d=>{const f=Jt.replace(d.segment.range,n.newName);const p=d.sourceUri.toString();if(i[p]){i[p].push(f)}else{i[p]=[f]}});return{changes:i}}prepareRename(e,n,r){return this.renameNodeRange(e,n.position)}renameNodeRange(e,n){const r=e.parseResult.value.$cstNode;const i=e.textDocument.offsetAt(n);if(r&&i){const a=Er(r,i,this.grammarConfig.nameRegexp);if(!a){return void 0}const s=this.references.findDeclaration(a);if(s||this.isNameNode(a)){return a.range}}return void 0}isNameNode(e){return(e===null||e===void 0?void 0:e.astNode)&&Sv(e.astNode)&&e===this.nameProvider.getNameNode(e.astNode)}}class jD{constructor(e){this.indexManager=e.workspace.IndexManager;this.nodeKindProvider=e.lsp.NodeKindProvider;this.fuzzyMatcher=e.lsp.FuzzyMatcher}async getSymbols(e,n=ye.CancellationToken.None){const r=[];const i=e.query.toLowerCase();for(const a of this.indexManager.allElements()){await ht(n);if(this.fuzzyMatcher.match(i,a.name)){const s=this.getWorkspaceSymbol(a);if(s){r.push(s)}}}return r}getWorkspaceSymbol(e){const n=e.nameSegment;if(n){return{kind:this.nodeKindProvider.getSymbolKind(e),name:e.name,location:{range:n.range,uri:e.documentUri.toString()}}}else{return void 0}}}class BD{constructor(e){this._configuration=e;this._syncedDocuments=new Map;this._onDidChangeContent=new U.Emitter;this._onDidOpen=new U.Emitter;this._onDidClose=new U.Emitter;this._onDidSave=new U.Emitter;this._onWillSave=new U.Emitter}get onDidOpen(){return this._onDidOpen.event}get onDidChangeContent(){return this._onDidChangeContent.event}get onWillSave(){return this._onWillSave.event}onWillSaveWaitUntil(e){this._willSaveWaitUntil=e}get onDidSave(){return this._onDidSave.event}get onDidClose(){return this._onDidClose.event}get(e){return this._syncedDocuments.get(Ue.normalize(e))}set(e){const n=Ue.normalize(e.uri);let r=true;if(this._syncedDocuments.has(n)){r=false}this._syncedDocuments.set(n,e);const i=Object.freeze({document:e});this._onDidOpen.fire(i);this._onDidChangeContent.fire(i);return r}delete(e){const n=Ue.normalize(typeof e==="object"&&"uri"in e?e.uri:e);const r=this._syncedDocuments.get(n);if(r!==void 0){this._syncedDocuments.delete(n);this._onDidClose.fire(Object.freeze({document:r}))}}all(){return Array.from(this._syncedDocuments.values())}keys(){return Array.from(this._syncedDocuments.keys())}listen(e){e.__textDocumentSync=U.TextDocumentSyncKind.Incremental;const n=[];n.push(e.onDidOpenTextDocument(r=>{const i=r.textDocument;const a=Ue.normalize(i.uri);const s=this._configuration.create(a,i.languageId,i.version,i.text);this._syncedDocuments.set(a,s);const o=Object.freeze({document:s});this._onDidOpen.fire(o);this._onDidChangeContent.fire(o)}));n.push(e.onDidChangeTextDocument(r=>{const i=r.textDocument;const a=r.contentChanges;if(a.length===0){return}const{version:s}=i;if(s===null||s===void 0){throw new Error(`Received document change event for ${i.uri} without valid version identifier`)}const o=Ue.normalize(i.uri);let l=this._syncedDocuments.get(o);if(l!==void 0){l=this._configuration.update(l,a,s);this._syncedDocuments.set(o,l);this._onDidChangeContent.fire(Object.freeze({document:l}))}}));n.push(e.onDidCloseTextDocument(r=>{const i=Ue.normalize(r.textDocument.uri);const a=this._syncedDocuments.get(i);if(a!==void 0){this._syncedDocuments.delete(i);this._onDidClose.fire(Object.freeze({document:a}))}}));n.push(e.onWillSaveTextDocument(r=>{const i=this._syncedDocuments.get(Ue.normalize(r.textDocument.uri));if(i!==void 0){this._onWillSave.fire(Object.freeze({document:i,reason:r.reason}))}}));n.push(e.onWillSaveTextDocumentWaitUntil((r,i)=>{const a=this._syncedDocuments.get(Ue.normalize(r.textDocument.uri));if(a!==void 0&&this._willSaveWaitUntil){return this._willSaveWaitUntil(Object.freeze({document:a,reason:r.reason}),i)}else{return[]}}));n.push(e.onDidSaveTextDocument(r=>{const i=this._syncedDocuments.get(Ue.normalize(r.textDocument.uri));if(i!==void 0){this._onDidSave.fire(Object.freeze({document:i}))}}));return U.Disposable.create(()=>{n.forEach(r=>r.dispose())})}}function WD(t){return Lu.merge(jv(t),VD(t))}function VD(t){return{lsp:{CompletionProvider:e=>new s$(e),DocumentSymbolProvider:e=>new tD(e),HoverProvider:e=>new oD(e),FoldingRangeProvider:e=>new nD(e),ReferencesProvider:e=>new HD(e),DefinitionProvider:e=>new Z_(e),DocumentHighlightProvider:e=>new eD(e),RenameProvider:e=>new qD(e)},shared:()=>t.shared}}function zD(t){return Lu.merge(Bv(t),XD(t))}function XD(t){return{lsp:{Connection:()=>t.connection,LanguageServer:e=>new mD(e),DocumentUpdateHandler:e=>new o$(e),WorkspaceSymbolProvider:e=>new jD(e),NodeKindProvider:()=>new l$,FuzzyMatcher:()=>new rD},workspace:{TextDocuments:()=>new BD(Du)}}}var Lc;var jy;function YD(){if(jy)return Lc;jy=1;Lc=r$();return Lc}var Qp=YD();const xc="AllocateAttribute";const By="Condition";const Wy="DataSpecificationDataListEntry";const Mc="DeclarationAttribute";const Fc="Directives";const Kc="DoType2";const Vy="EntryDescription";const zy="Expression";const Xy="FormatItem";const Uc="GetStatement";const Gc="InitialAttributeItem";const Hc="InitialAttributeSpecificationIteration";const Ea="NamedElement";function Yy(t){return Ie.isInstance(t,Ea)}const qc="NamedType";const Jy="OptionsItem";const Gi="PackageLevelStatements";const jc="ProcedureLevelStatement";const Bc="PutStatement";const Qy="TopLevelStatement";const Hi="Unit";const Vs="AddExpression";const zs="AFormatItem";const Xs="AllocateDimension";const Wc="AllocatedVariable";const Ys="AllocateLocationReference";const Js="AllocateStatement";const Qs="AllocateType";const Zs="AssertStatement";const eo="AssignmentStatement";const to="AttachStatement";const no="BeginStatement";const ro="BFormatItem";const io="BitAndExpression";const ao="BitOrExpression";const Vc="Bound";const so="CallStatement";const oo="CancelThreadStatement";const lo="CFormatItem";const uo="CloseStatement";const co="CMPATOptionsItem";const fo="ColumnFormatItem";const po="CompExpression";const zc="CompilerOptions";const wa="ComputationDataAttribute";function JD(t){return Ie.isInstance(t,wa)}const mo="ConcatExpression";const Xc="ConditionPrefix";const Yc="ConditionPrefixItem";const Jc="DataSpecificationDataList";const ho="DataSpecificationDataListItem";const yo="DataSpecificationDataListItem3DO";const Qc="DataSpecificationOptions";const go="DateAttribute";const Zc="DeclaredItem";const Ca="DeclaredVariable";function Qr(t){return Ie.isInstance(t,Ca)}const Sa="DeclareStatement";function QD(t){return Ie.isInstance(t,Sa)}const ed="DefaultAttributeExpression";const td="DefaultAttributeExpressionNot";const nd="DefaultExpression";const rd="DefaultExpressionPart";const id="DefaultRangeIdentifierItem";const ad="DefaultRangeIdentifiers";const Ro="DefaultStatement";const Aa="DefineAliasStatement";function ZD(t){return Ie.isInstance(t,Aa)}const vo="DefinedAttribute";const $o="DefineOrdinalStatement";const To="DefineStructureStatement";const Eo="DelayStatement";const wo="DeleteStatement";const Co="DetachStatement";const sd="DimensionBound";const od="Dimensions";const So="DimensionsDataAttribute";const Ao="DisplayStatement";const ld="DoSpecification";const qi="DoStatement";const ka="DoType3Variable";function u$(t){return Ie.isInstance(t,ka)}const ko="DoUntil";const bo="DoWhile";const No="EFormatItem";const Yl="EndStatement";function eO(t){return Ie.isInstance(t,Yl)}const ba="EntryAttribute";function tO(t){return Ie.isInstance(t,ba)}const Po="EntryParameterDescription";const _o="EntryStatement";const Do="EntryUnionDescription";const Oo="EnvironmentAttribute";const ud="EnvironmentAttributeItem";const Io="ExecStatement";const Zy="ExitStatement";const Lo="ExpExpression";const cd="Exports";const dd="FetchEntry";const xo="FetchStatement";const Mo="FFormatItem";const Fo="FileReferenceCondition";const Ko="FlushStatement";const fd="FormatList";const pd="FormatListItem";const md="FormatListItemLevel";const Uo="FormatStatement";const Go="FreeStatement";const Ho="GetFileStatement";const qo="GetStringStatement";const jo="GFormatItem";const Bo="GoToStatement";const Wo="HandleAttribute";const Vo="IfStatement";const Na="IncludeDirective";function nO(t){return Ie.isInstance(t,Na)}const hd="IncludeItem";const yd="InitAcrossExpression";const zo="InitialAttribute";const Xo="InitialAttributeExpression";const eg="InitialAttributeItemStar";const Yo="InitialAttributeSpecification";const Jo="InitialAttributeSpecificationIterationValue";const gd="InitialToContent";const Qo="IterateStatement";const Zo="KeywordCondition";const Pa="LabelPrefix";function Ya(t){return Ie.isInstance(t,Pa)}const Jl="LabelReference";function rO(t){return Ie.isInstance(t,Jl)}const el="LeaveStatement";const tg="LFormatItem";const tl="LikeAttribute";const nl="LineDirective";const rl="LineFormatItem";const il="LinkageOptionsItem";const _a="Literal";function iO(t){return Ie.isInstance(t,_a)}const al="LocateStatement";const sl="LocatorCall";const Ql="MemberCall";function aO(t){return Ie.isInstance(t,Ql)}const ol="MultExpression";const ll="NamedCondition";const ul="NoMapOptionsItem";const ng="NoPrintDirective";const cl="NoteDirective";const rg="NullStatement";const Zl="NumberLiteral";function sO(t){return Ie.isInstance(t,Zl)}const dl="OnStatement";const Rd="OpenOptionsGroup";const fl="OpenStatement";const vd="Options";const $d="OrdinalValue";const Td="OrdinalValueList";const Ed="OtherwiseStatement";const Da="Package";function ig(t){return Ie.isInstance(t,Da)}const ag="PageDirective";const sg="PageFormatItem";const pl="PFormatItem";const ml="PictureAttribute";const wd="PliProgram";const og="PopDirective";const Cd="PrefixedAttribute";const lg="PrintDirective";const eu="ProcedureCall";function oO(t){return Ie.isInstance(t,eu)}const tu="ProcedureParameter";function lO(t){return Ie.isInstance(t,tu)}const Kr="ProcedureStatement";function un(t){return Ie.isInstance(t,Kr)}const hl="ProcessDirective";const yl="ProcincDirective";const ug="PushDirective";const gl="PutFileStatement";const Sd="PutItem";const Rl="PutStringStatement";const vl="QualifyStatement";const $l="ReadStatement";const nu="ReferenceItem";function uO(t){return Ie.isInstance(t,nu)}const Tl="ReinitStatement";const El="ReleaseStatement";const Ad="Reserves";const cg="ResignalStatement";const kd="ReturnsOption";const wl="ReturnStatement";const Cl="RevertStatement";const Sl="RewriteStatement";const Al="RFormatItem";const kl="SelectStatement";const bl="SignalStatement";const Oa="SimpleOptionsItem";function cO(t){return Ie.isInstance(t,Oa)}const Nl="SkipDirective";const Pl="SkipFormatItem";const Ia="Statement";function dO(t){return Ie.isInstance(t,Ia)}const dg="StopStatement";const ru="StringLiteral";function fO(t){return Ie.isInstance(t,ru)}const bd="SubStructure";const _l="TypeAttribute";const Dl="UnaryExpression";const Ol="ValueAttribute";const Nd="ValueAttributeItem";const Il="ValueListAttribute";const Ll="ValueListFromAttribute";const xl="ValueRangeAttribute";const fg="VFormatItem";const Ml="WaitStatement";const Pd="WhenStatement";const Fl="WriteStatement";const Kl="XFormatItem";const Ul="DoType3";class c$ extends hg{getAllTypes(){return[zs,Vs,xc,Xs,Ys,Js,Qs,Wc,Zs,eo,to,ro,no,io,ao,Vc,lo,co,so,oo,uo,fo,po,zc,wa,mo,By,Xc,Yc,Jc,Wy,ho,yo,Qc,go,Mc,Sa,Zc,Ca,ed,td,nd,rd,id,ad,Ro,Aa,$o,To,vo,Eo,wo,Co,sd,od,So,Fc,Ao,ld,qi,Kc,Ul,ka,ko,bo,No,Yl,ba,Vy,Po,_o,Do,Oo,ud,Io,Zy,Lo,cd,zy,Mo,dd,xo,Fo,Ko,Xy,fd,pd,md,Uo,Go,jo,Ho,Uc,qo,Bo,Wo,Vo,Na,hd,yd,zo,Xo,Gc,eg,Yo,Hc,Jo,gd,Qo,Zo,tg,Pa,Jl,el,tl,nl,rl,il,_a,al,sl,Ql,ol,ll,Ea,qc,ul,ng,cl,rg,Zl,dl,Rd,fl,vd,Jy,$d,Td,Ed,pl,Da,Gi,ag,sg,ml,wd,og,Cd,lg,eu,jc,tu,Kr,hl,yl,ug,gl,Sd,Bc,Rl,vl,Al,$l,nu,Tl,El,Ad,cg,wl,kd,Cl,Sl,kl,bl,Oa,Nl,Pl,Ia,dg,ru,bd,Qy,_l,Dl,Hi,fg,Ol,Nd,Il,Ll,xl,Ml,Pd,Fl,Kl]}computeIsSubtype(e,n){switch(e){case Vs:case io:case ao:case po:case mo:case Lo:case _a:case sl:case ol:case Dl:{return this.isSubtype(zy,n)}case zs:case ro:case lo:case fo:case No:case Mo:case jo:case tg:case rl:case sg:case pl:case Al:case Pl:case fg:case Kl:{return this.isSubtype(Xy,n)}case Xs:case Ys:case Qs:{return this.isSubtype(xc,n)}case Js:case Zs:case eo:case to:case no:case so:case oo:case uo:case Eo:case wo:case Co:case Ao:case qi:case _o:case Io:case Zy:case xo:case Ko:case Uo:case Go:case Uc:case Bo:case Vo:case Qo:case el:case al:case rg:case dl:case fl:case Bc:case vl:case $l:case Tl:case El:case cg:case wl:case Cl:case Sl:case kl:case bl:case dg:case Ml:case Fl:{return this.isSubtype(Hi,n)}case co:case il:case ul:case Oa:{return this.isSubtype(Jy,n)}case wa:case go:case vo:case So:case ba:case Oo:case Wo:case tl:case ml:case _l:case Ol:case Il:case Ll:case xl:{return this.isSubtype(Mc,n)}case ho:case yo:{return this.isSubtype(Wy,n)}case Ca:case ka:{return this.isSubtype(Ea,n)}case Sa:case Ro:case $o:case To:{return this.isSubtype(Gi,n)||this.isSubtype(Hi,n)}case Aa:{return this.isSubtype(qc,n)||this.isSubtype(Gi,n)||this.isSubtype(Hi,n)}case Fc:case Da:case Gi:{return this.isSubtype(Qy,n)}case Kc:case Ul:{return this.isSubtype(qi,n)}case ko:case bo:{return this.isSubtype(Kc,n)}case Po:case Do:{return this.isSubtype(Vy,n)}case Fo:case Zo:case ll:{return this.isSubtype(By,n)}case Ho:case qo:{return this.isSubtype(Uc,n)}case Na:case nl:case ng:case cl:case ag:case og:case lg:case hl:case yl:case ug:case Nl:{return this.isSubtype(Fc,n)||this.isSubtype(Hi,n)}case zo:{return this.isSubtype(xc,n)||this.isSubtype(Mc,n)}case Xo:case eg:{return this.isSubtype(Gc,n)||this.isSubtype(Hc,n)}case Yo:{return this.isSubtype(Gc,n)}case Jo:{return this.isSubtype(Hc,n)}case Kr:{return this.isSubtype(Ea,n)||this.isSubtype(Gi,n)||this.isSubtype(jc,n)}case gl:case Rl:{return this.isSubtype(Bc,n)}case Ia:{return this.isSubtype(jc,n)}default:{return false}}}getReferenceType(e){const n=`${e.container.$type}:${e.property}`;switch(n){case"HandleAttribute:type":case"TypeAttribute:type":{return qc}case"LabelReference:label":{return Pa}case"ProcedureCall:procedure":{return Kr}case"ReferenceItem:ref":{return Ea}default:{throw new Error(`${n} is not a valid reference id.`)}}}getTypeMetaData(e){switch(e){case Vs:{return{name:Vs,properties:[{name:"left"},{name:"op"},{name:"right"}]}}case zs:{return{name:zs,properties:[{name:"fieldWidth"}]}}case Xs:{return{name:Xs,properties:[{name:"dimensions"}]}}case Wc:{return{name:Wc,properties:[{name:"attribute"},{name:"level"},{name:"var"}]}}case Ys:{return{name:Ys,properties:[{name:"area"},{name:"locatorVariable"}]}}case Js:{return{name:Js,properties:[{name:"variables",defaultValue:[]}]}}case Qs:{return{name:Qs,properties:[{name:"dimensions"},{name:"type"}]}}case Zs:{return{name:Zs,properties:[{name:"actual"},{name:"compare",defaultValue:false},{name:"displayExpression"},{name:"expected"},{name:"false",defaultValue:false},{name:"operator"},{name:"true",defaultValue:false},{name:"unreachable",defaultValue:false}]}}case eo:{return{name:eo,properties:[{name:"dimacrossExpr"},{name:"expression"},{name:"operator"},{name:"refs",defaultValue:[]}]}}case to:{return{name:to,properties:[{name:"environment",defaultValue:false},{name:"reference"},{name:"task"},{name:"tstack"}]}}case no:{return{name:no,properties:[{name:"end"},{name:"options"},{name:"order",defaultValue:false},{name:"recursive",defaultValue:false},{name:"reorder",defaultValue:false},{name:"statements",defaultValue:[]}]}}case ro:{return{name:ro,properties:[{name:"fieldWidth"}]}}case io:{return{name:io,properties:[{name:"left"},{name:"op"},{name:"right"}]}}case ao:{return{name:ao,properties:[{name:"left"},{name:"op"},{name:"right"}]}}case Vc:{return{name:Vc,properties:[{name:"expression"},{name:"refer"}]}}case so:{return{name:so,properties:[{name:"call"}]}}case oo:{return{name:oo,properties:[{name:"thread"}]}}case lo:{return{name:lo,properties:[{name:"item"}]}}case uo:{return{name:uo,properties:[{name:"files",defaultValue:[]}]}}case co:{return{name:co,properties:[{name:"value"}]}}case fo:{return{name:fo,properties:[{name:"characterPosition"}]}}case po:{return{name:po,properties:[{name:"left"},{name:"op"},{name:"right"}]}}case zc:{return{name:zc,properties:[{name:"value"}]}}case wa:{return{name:wa,properties:[{name:"dimensions"},{name:"type"}]}}case mo:{return{name:mo,properties:[{name:"left"},{name:"op"},{name:"right"}]}}case Xc:{return{name:Xc,properties:[{name:"items",defaultValue:[]}]}}case Yc:{return{name:Yc,properties:[{name:"conditions",defaultValue:[]}]}}case Jc:{return{name:Jc,properties:[{name:"items",defaultValue:[]}]}}case ho:{return{name:ho,properties:[{name:"value"}]}}case yo:{return{name:yo,properties:[{name:"do"},{name:"list"}]}}case Qc:{return{name:Qc,properties:[{name:"data",defaultValue:false},{name:"dataList"},{name:"dataListItems",defaultValue:[]},{name:"dataLists",defaultValue:[]},{name:"edit",defaultValue:false},{name:"formatLists",defaultValue:[]}]}}case go:{return{name:go,properties:[{name:"pattern"}]}}case Zc:{return{name:Zc,properties:[{name:"attributes",defaultValue:[]},{name:"element"},{name:"items",defaultValue:[]},{name:"level"}]}}case Ca:{return{name:Ca,properties:[{name:"name"}]}}case Sa:{return{name:Sa,properties:[{name:"items",defaultValue:[]},{name:"xDeclare",defaultValue:false}]}}case ed:{return{name:ed,properties:[{name:"items",defaultValue:[]},{name:"operators",defaultValue:[]}]}}case td:{return{name:td,properties:[{name:"not",defaultValue:false},{name:"value"}]}}case nd:{return{name:nd,properties:[{name:"attributes",defaultValue:[]},{name:"expression"}]}}case rd:{return{name:rd,properties:[{name:"expression"},{name:"identifiers"}]}}case id:{return{name:id,properties:[{name:"from"},{name:"to"}]}}case ad:{return{name:ad,properties:[{name:"identifiers",defaultValue:[]}]}}case Ro:{return{name:Ro,properties:[{name:"expressions",defaultValue:[]}]}}case Aa:{return{name:Aa,properties:[{name:"attributes",defaultValue:[]},{name:"name"},{name:"xDefine",defaultValue:false}]}}case vo:{return{name:vo,properties:[{name:"position"},{name:"reference"}]}}case $o:{return{name:$o,properties:[{name:"name"},{name:"ordinalValues"},{name:"precision"},{name:"signed",defaultValue:false},{name:"unsigned",defaultValue:false},{name:"xDefine",defaultValue:false}]}}case To:{return{name:To,properties:[{name:"level"},{name:"name"},{name:"substructures",defaultValue:[]},{name:"union",defaultValue:false},{name:"xDefine",defaultValue:false}]}}case Eo:{return{name:Eo,properties:[{name:"delay"}]}}case wo:{return{name:wo,properties:[{name:"file"},{name:"key"}]}}case Co:{return{name:Co,properties:[{name:"reference"}]}}case sd:{return{name:sd,properties:[{name:"bound1"},{name:"bound2"}]}}case od:{return{name:od,properties:[{name:"dimensions",defaultValue:[]}]}}case So:{return{name:So,properties:[{name:"dimensions"}]}}case Ao:{return{name:Ao,properties:[{name:"desc",defaultValue:[]},{name:"expression"},{name:"reply"},{name:"rout",defaultValue:[]}]}}case ld:{return{name:ld,properties:[{name:"by"},{name:"downthru"},{name:"exp1"},{name:"repeat"},{name:"to"},{name:"upthru"},{name:"whileOrUntil"}]}}case qi:{return{name:qi,properties:[{name:"end"},{name:"statements",defaultValue:[]}]}}case ka:{return{name:ka,properties:[{name:"name"}]}}case ko:{return{name:ko,properties:[{name:"until"},{name:"while"}]}}case bo:{return{name:bo,properties:[{name:"until"},{name:"while"}]}}case No:{return{name:No,properties:[{name:"fieldWidth"},{name:"fractionalDigits"},{name:"significantDigits"}]}}case Yl:{return{name:Yl,properties:[{name:"label"},{name:"labels",defaultValue:[]}]}}case ba:{return{name:ba,properties:[{name:"attributes",defaultValue:[]},{name:"environmentName",defaultValue:[]},{name:"limited",defaultValue:[]},{name:"options",defaultValue:[]},{name:"returns",defaultValue:[]},{name:"variable",defaultValue:[]}]}}case Po:{return{name:Po,properties:[{name:"attributes",defaultValue:[]},{name:"star",defaultValue:false}]}}case _o:{return{name:_o,properties:[{name:"environmentName",defaultValue:[]},{name:"limited",defaultValue:[]},{name:"options",defaultValue:[]},{name:"parameters",defaultValue:[]},{name:"returns",defaultValue:[]},{name:"variable",defaultValue:[]}]}}case Do:{return{name:Do,properties:[{name:"attributes",defaultValue:[]},{name:"init"},{name:"prefixedAttributes",defaultValue:[]}]}}case Oo:{return{name:Oo,properties:[{name:"items",defaultValue:[]}]}}case ud:{return{name:ud,properties:[{name:"args",defaultValue:[]},{name:"environment"}]}}case Io:{return{name:Io,properties:[{name:"query"}]}}case Lo:{return{name:Lo,properties:[{name:"left"},{name:"op"},{name:"right"}]}}case cd:{return{name:cd,properties:[{name:"all",defaultValue:false},{name:"procedures",defaultValue:[]}]}}case dd:{return{name:dd,properties:[{name:"name"},{name:"set"},{name:"title"}]}}case xo:{return{name:xo,properties:[{name:"entries",defaultValue:[]}]}}case Mo:{return{name:Mo,properties:[{name:"fieldWidth"},{name:"fractionalDigits"},{name:"scalingFactor"}]}}case Fo:{return{name:Fo,properties:[{name:"fileReference"},{name:"keyword"}]}}case Ko:{return{name:Ko,properties:[{name:"file"}]}}case fd:{return{name:fd,properties:[{name:"items",defaultValue:[]}]}}case pd:{return{name:pd,properties:[{name:"item"},{name:"level"},{name:"list"}]}}case md:{return{name:md,properties:[{name:"level"}]}}case Uo:{return{name:Uo,properties:[{name:"list"}]}}case Go:{return{name:Go,properties:[{name:"references",defaultValue:[]}]}}case Ho:{return{name:Ho,properties:[{name:"copy",defaultValue:false},{name:"copyReference"},{name:"dataSpecification"},{name:"file"},{name:"skip",defaultValue:false},{name:"skipExpression"}]}}case qo:{return{name:qo,properties:[{name:"dataSpecification"},{name:"expression"}]}}case jo:{return{name:jo,properties:[{name:"fieldWidth"}]}}case Bo:{return{name:Bo,properties:[{name:"label"}]}}case Wo:{return{name:Wo,properties:[{name:"size"},{name:"type"}]}}case Vo:{return{name:Vo,properties:[{name:"else"},{name:"expression"},{name:"unit"}]}}case Na:{return{name:Na,properties:[{name:"items",defaultValue:[]}]}}case hd:{return{name:hd,properties:[{name:"ddname",defaultValue:false},{name:"file"}]}}case yd:{return{name:yd,properties:[{name:"expressions",defaultValue:[]}]}}case zo:{return{name:zo,properties:[{name:"across",defaultValue:false},{name:"call",defaultValue:false},{name:"content"},{name:"direct",defaultValue:false},{name:"expressions",defaultValue:[]},{name:"items",defaultValue:[]},{name:"procedureCall"},{name:"to",defaultValue:false}]}}case Xo:{return{name:Xo,properties:[{name:"expression"}]}}case Yo:{return{name:Yo,properties:[{name:"expression"},{name:"item"},{name:"star",defaultValue:false}]}}case Jo:{return{name:Jo,properties:[{name:"items",defaultValue:[]}]}}case gd:{return{name:gd,properties:[{name:"type"},{name:"varying"}]}}case Qo:{return{name:Qo,properties:[{name:"label"}]}}case Zo:{return{name:Zo,properties:[{name:"keyword"}]}}case Pa:{return{name:Pa,properties:[{name:"name"}]}}case Jl:{return{name:Jl,properties:[{name:"label"}]}}case el:{return{name:el,properties:[{name:"label"}]}}case tl:{return{name:tl,properties:[{name:"reference"}]}}case nl:{return{name:nl,properties:[{name:"file"},{name:"line"}]}}case rl:{return{name:rl,properties:[{name:"lineNumber"}]}}case il:{return{name:il,properties:[{name:"value"}]}}case _a:{return{name:_a,properties:[{name:"multiplier"},{name:"value"}]}}case al:{return{name:al,properties:[{name:"file"},{name:"keyfrom"},{name:"set"},{name:"variable"}]}}case sl:{return{name:sl,properties:[{name:"element"},{name:"handle",defaultValue:false},{name:"pointer",defaultValue:false},{name:"previous"}]}}case Ql:{return{name:Ql,properties:[{name:"element"},{name:"previous"}]}}case ol:{return{name:ol,properties:[{name:"left"},{name:"op"},{name:"right"}]}}case ll:{return{name:ll,properties:[{name:"name"}]}}case ul:{return{name:ul,properties:[{name:"parameters",defaultValue:[]},{name:"type"}]}}case cl:{return{name:cl,properties:[{name:"code"},{name:"message"}]}}case Zl:{return{name:Zl,properties:[{name:"value"}]}}case dl:{return{name:dl,properties:[{name:"conditions",defaultValue:[]},{name:"onUnit"},{name:"snap",defaultValue:false},{name:"system",defaultValue:false}]}}case Rd:{return{name:Rd,properties:[{name:"buffered",defaultValue:false},{name:"direct",defaultValue:false},{name:"file"},{name:"input",defaultValue:false},{name:"keyed",defaultValue:false},{name:"lineSize"},{name:"output",defaultValue:false},{name:"pageSize"},{name:"print",defaultValue:false},{name:"record",defaultValue:false},{name:"sequential",defaultValue:false},{name:"stream",defaultValue:false},{name:"title"},{name:"unbuffered",defaultValue:false},{name:"update",defaultValue:false}]}}case fl:{return{name:fl,properties:[{name:"options",defaultValue:[]}]}}case vd:{return{name:vd,properties:[{name:"items",defaultValue:[]}]}}case $d:{return{name:$d,properties:[{name:"name"},{name:"value"}]}}case Td:{return{name:Td,properties:[{name:"members",defaultValue:[]}]}}case Ed:{return{name:Ed,properties:[{name:"unit"}]}}case Da:{return{name:Da,properties:[{name:"end"},{name:"exports"},{name:"name"},{name:"options"},{name:"prefix"},{name:"reserves"},{name:"statements",defaultValue:[]}]}}case pl:{return{name:pl,properties:[{name:"specification"}]}}case ml:{return{name:ml,properties:[{name:"picture"}]}}case wd:{return{name:wd,properties:[{name:"statements",defaultValue:[]}]}}case Cd:{return{name:Cd,properties:[{name:"attribute"},{name:"level"}]}}case eu:{return{name:eu,properties:[{name:"args",defaultValue:[]},{name:"procedure"}]}}case tu:{return{name:tu,properties:[{name:"id"}]}}case Kr:{return{name:Kr,properties:[{name:"end"},{name:"environmentName",defaultValue:[]},{name:"labels",defaultValue:[]},{name:"options",defaultValue:[]},{name:"order",defaultValue:[]},{name:"parameters",defaultValue:[]},{name:"recursive",defaultValue:[]},{name:"returns",defaultValue:[]},{name:"scope",defaultValue:[]},{name:"statements",defaultValue:[]},{name:"xProc",defaultValue:false}]}}case hl:{return{name:hl,properties:[{name:"compilerOptions",defaultValue:[]}]}}case yl:{return{name:yl,properties:[{name:"datasetName"}]}}case gl:{return{name:gl,properties:[{name:"items",defaultValue:[]}]}}case Sd:{return{name:Sd,properties:[{name:"attribute"},{name:"expression"}]}}case Rl:{return{name:Rl,properties:[{name:"dataSpecification"},{name:"stringExpression"}]}}case vl:{return{name:vl,properties:[{name:"end"},{name:"statements",defaultValue:[]}]}}case $l:{return{name:$l,properties:[{name:"fileReference"},{name:"ignore"},{name:"intoRef"},{name:"key"},{name:"keyto"},{name:"set"}]}}case nu:{return{name:nu,properties:[{name:"dimensions"},{name:"ref"}]}}case Tl:{return{name:Tl,properties:[{name:"reference"}]}}case El:{return{name:El,properties:[{name:"references",defaultValue:[]},{name:"star",defaultValue:false}]}}case Ad:{return{name:Ad,properties:[{name:"all",defaultValue:false},{name:"variables",defaultValue:[]}]}}case kd:{return{name:kd,properties:[{name:"returnAttribute"}]}}case wl:{return{name:wl,properties:[{name:"expression"}]}}case Cl:{return{name:Cl,properties:[{name:"conditions",defaultValue:[]}]}}case Sl:{return{name:Sl,properties:[{name:"file"},{name:"from"},{name:"key"}]}}case Al:{return{name:Al,properties:[{name:"labelReference"}]}}case kl:{return{name:kl,properties:[{name:"end"},{name:"on"},{name:"statements",defaultValue:[]}]}}case bl:{return{name:bl,properties:[{name:"condition",defaultValue:[]}]}}case Oa:{return{name:Oa,properties:[{name:"value"}]}}case Nl:{return{name:Nl,properties:[{name:"lines"}]}}case Pl:{return{name:Pl,properties:[{name:"skip"}]}}case Ia:{return{name:Ia,properties:[{name:"condition"},{name:"labels",defaultValue:[]},{name:"value"}]}}case ru:{return{name:ru,properties:[{name:"value"}]}}case bd:{return{name:bd,properties:[{name:"attributes",defaultValue:[]},{name:"level"},{name:"name"}]}}case _l:{return{name:_l,properties:[{name:"type"}]}}case Dl:{return{name:Dl,properties:[{name:"expr"},{name:"op"}]}}case Ol:{return{name:Ol,properties:[{name:"items",defaultValue:[]},{name:"value"}]}}case Nd:{return{name:Nd,properties:[{name:"attributes",defaultValue:[]}]}}case Il:{return{name:Il,properties:[{name:"values",defaultValue:[]}]}}case Ll:{return{name:Ll,properties:[{name:"from"}]}}case xl:{return{name:xl,properties:[{name:"values",defaultValue:[]}]}}case Ml:{return{name:Ml,properties:[{name:"task"}]}}case Pd:{return{name:Pd,properties:[{name:"conditions",defaultValue:[]},{name:"unit"}]}}case Fl:{return{name:Fl,properties:[{name:"fileReference"},{name:"from"},{name:"keyfrom"},{name:"keyto"}]}}case Kl:{return{name:Kl,properties:[{name:"width"}]}}case Ul:{return{name:Ul,properties:[{name:"end"},{name:"specifications",defaultValue:[]},{name:"statements",defaultValue:[]},{name:"variable"}]}}default:{return{name:e,properties:[]}}}}}const Ie=new c$;let pg;const pO=()=>pg??(pg=e_(`{
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
                "$ref": "#/rules@199"
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
                        "$ref": "#/rules@199"
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
                            "$ref": "#/rules@199"
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
                        "$ref": "#/rules@199"
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
                            "$ref": "#/rules@199"
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
                        "$ref": "#/rules@199"
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
                            "$ref": "#/rules@199"
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
                        "$ref": "#/rules@179"
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
                            "$ref": "#/rules@179"
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
                    "$ref": "#/rules@174"
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
                            "$ref": "#/rules@181"
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
                "$ref": "#/rules@199"
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
                        "$ref": "#/rules@179"
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
                            "$ref": "#/rules@179"
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
                            "$ref": "#/rules@181"
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
                    "$ref": "#/rules@174"
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
                "$ref": "#/rules@211"
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
                "$ref": "#/rules@180"
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
                    "$ref": "#/rules@191"
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
                        "$ref": "#/rules@191"
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
                    "$ref": "#/rules@191"
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
            "$ref": "#/rules@168"
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
                "$ref": "#/rules@168"
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
                        "$ref": "#/rules@181"
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
                        "$ref": "#/rules@181"
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
                        "$ref": "#/rules@181"
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
                        "feature": "operator",
                        "operator": "=",
                        "terminal": {
                          "$type": "RuleCall",
                          "rule": {
                            "$ref": "#/rules@215"
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
                    "$ref": "#/rules@181"
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
                "$ref": "#/rules@191"
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
                    "$ref": "#/rules@191"
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
                            "$ref": "#/rules@181"
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
              "$ref": "#/rules@202"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@200"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@205"
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
                "$ref": "#/rules@191"
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
                    "$ref": "#/rules@191"
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
                        "$ref": "#/rules@181"
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
                "$ref": "#/rules@193"
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
                "$ref": "#/rules@192"
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
                "$ref": "#/rules@191"
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
                    "$ref": "#/rules@190"
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
                        "$ref": "#/rules@190"
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
                "$ref": "#/rules@199"
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
                    "$ref": "#/rules@199"
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
                "$ref": "#/rules@199"
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
                "$ref": "#/rules@198"
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
                    "$ref": "#/rules@211"
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
                "$ref": "#/rules@199"
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
                    "$ref": "#/rules@211"
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
                "$ref": "#/rules@211"
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
                "$ref": "#/rules@198"
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
                "$ref": "#/rules@211"
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
                "$ref": "#/rules@199"
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
                "$ref": "#/rules@181"
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
                "$ref": "#/rules@191"
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
                    "$ref": "#/rules@181"
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
                "$ref": "#/rules@191"
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
                "$ref": "#/rules@181"
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
                    "$ref": "#/rules@191"
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
                    "$ref": "#/rules@211"
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
                        "$ref": "#/rules@211"
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
                        "$ref": "#/rules@211"
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
                            "$ref": "#/rules@211"
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
                "$ref": "#/rules@181"
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
                    "$ref": "#/rules@181"
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
                "$ref": "#/rules@181"
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
                    "$ref": "#/rules@181"
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
                "$ref": "#/rules@181"
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
                        "value": "BY"
                      },
                      {
                        "$type": "Assignment",
                        "feature": "by",
                        "operator": "=",
                        "terminal": {
                          "$type": "RuleCall",
                          "rule": {
                            "$ref": "#/rules@181"
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
                        "value": "TO"
                      },
                      {
                        "$type": "Assignment",
                        "feature": "to",
                        "operator": "=",
                        "terminal": {
                          "$type": "RuleCall",
                          "rule": {
                            "$ref": "#/rules@181"
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
                        "$ref": "#/rules@181"
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
                        "$ref": "#/rules@181"
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
                        "$ref": "#/rules@181"
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
                "$ref": "#/rules@209"
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
                "$ref": "#/rules@199"
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
                    "$ref": "#/rules@191"
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
                    "$ref": "#/rules@181"
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
                    "$ref": "#/rules@191"
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
                "$ref": "#/rules@211"
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
                    "$ref": "#/rules@181"
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
                    "$ref": "#/rules@181"
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
                    "$ref": "#/rules@181"
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
                "feature": "fractionalDigits",
                "operator": "=",
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
                    "feature": "scalingFactor",
                    "operator": "=",
                    "terminal": {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@181"
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
                "$ref": "#/rules@181"
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
                "feature": "significantDigits",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@181"
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
                "$ref": "#/rules@215"
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
                "$ref": "#/rules@181"
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
                    "$ref": "#/rules@181"
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
                "$ref": "#/rules@181"
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
                "$ref": "#/rules@199"
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
                    "$ref": "#/rules@181"
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
                "$ref": "#/rules@181"
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
                "$ref": "#/rules@191"
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
                    "$ref": "#/rules@191"
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
                            "$ref": "#/rules@181"
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
                                "$ref": "#/rules@199"
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
                                "$ref": "#/rules@181"
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
                        "$ref": "#/rules@181"
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
                "$ref": "#/rules@181"
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
                    "$ref": "#/rules@215"
                  },
                  "arguments": []
                },
                {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@210"
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
                        "$ref": "#/rules@215"
                      },
                      "arguments": []
                    },
                    {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@210"
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
                "$ref": "#/rules@193"
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
                "$ref": "#/rules@193"
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
                    "$ref": "#/rules@211"
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
                    "$ref": "#/rules@215"
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
                "$ref": "#/rules@191"
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
                "$ref": "#/rules@180"
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
                    "$ref": "#/rules@191"
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
                    "$ref": "#/rules@181"
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
                "feature": "code",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@181"
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
                "$ref": "#/rules@199"
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
                    "$ref": "#/rules@180"
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
                "$ref": "#/rules@180"
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
                    "$ref": "#/rules@181"
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
                    "$ref": "#/rules@181"
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
                    "$ref": "#/rules@181"
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
                "$ref": "#/rules@199"
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
                            "$ref": "#/rules@181"
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
                    "$ref": "#/rules@181"
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
            "$ref": "#/rules@181"
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
                "$ref": "#/rules@191"
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
                        "$ref": "#/rules@181"
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
                                "$ref": "#/rules@191"
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
                                "$ref": "#/rules@191"
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
                                "$ref": "#/rules@181"
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
                                "$ref": "#/rules@191"
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
                "$ref": "#/rules@191"
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
                        "$ref": "#/rules@199"
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
                            "$ref": "#/rules@199"
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
                    "$ref": "#/rules@181"
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
                "$ref": "#/rules@191"
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
                    "$ref": "#/rules@191"
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
                    "$ref": "#/rules@181"
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
                    "$ref": "#/rules@181"
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
                "feature": "conditions",
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
                    "$ref": "#/rules@181"
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
                "$ref": "#/rules@191"
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
                "$ref": "#/rules@191"
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
                "$ref": "#/rules@191"
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
                        "$ref": "#/rules@181"
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
                        "$ref": "#/rules@191"
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
                            "$ref": "#/rules@192"
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
                "feature": "expressions",
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
            "$ref": "#/rules@181"
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
                    "$ref": "#/rules@181"
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
                "$ref": "#/rules@211"
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
              "$ref": "#/rules@167"
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
              "$ref": "#/rules@171"
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
              "$ref": "#/rules@160"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@163"
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
              "$ref": "#/rules@164"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@159"
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
              "$ref": "#/rules@166"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@158"
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
                    "$ref": "#/rules@215"
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
                    "$ref": "#/rules@190"
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
                        "$ref": "#/rules@190"
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
                    "$ref": "#/rules@181"
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
                "$ref": "#/rules@215"
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
                "$ref": "#/rules@168"
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
                      "$ref": "#/rules@210"
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
                          "$ref": "#/rules@210"
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
                "$ref": "#/rules@165"
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
                "$ref": "#/rules@168"
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
                        "$ref": "#/rules@161"
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
                            "$ref": "#/rules@161"
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
                    "$ref": "#/rules@181"
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
                    "feature": "values",
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
        ]
      },
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
                "$ref": "#/rules@191"
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
                    "feature": "values",
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
        ]
      },
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
                "$ref": "#/rules@191"
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
                    "$ref": "#/rules@211"
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
                      "$ref": "#/rules@210"
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
                          "$ref": "#/rules@210"
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
                    "$ref": "#/rules@169"
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
                        "$ref": "#/rules@169"
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
                "$ref": "#/rules@170"
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
                    "$ref": "#/rules@170"
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
                        "$ref": "#/rules@191"
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
                "$ref": "#/rules@172"
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
                "$ref": "#/rules@210"
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
          }
        ]
      },
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
                    "$ref": "#/rules@175"
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
                        "$ref": "#/rules@175"
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
                    "$ref": "#/rules@174"
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
                            "$ref": "#/rules@181"
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
              "$ref": "#/rules@176"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@177"
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
                "$ref": "#/rules@211"
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
                "$ref": "#/rules@178"
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
                "$ref": "#/rules@211"
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
            "$ref": "#/rules@199"
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
                  "$ref": "#/rules@199"
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
                "$ref": "#/rules@168"
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
          "$ref": "#/rules@182"
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
              "$ref": "#/rules@183"
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
                        "$ref": "#/rules@203"
                      },
                      "arguments": []
                    },
                    {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@207"
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
                    "$ref": "#/rules@183"
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
              "$ref": "#/rules@184"
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
                    "$ref": "#/rules@184"
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
                        "$ref": "#/rules@204"
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
                        "$ref": "#/rules@205"
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
                        "$ref": "#/rules@206"
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
                    "$ref": "#/rules@201"
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
              "$ref": "#/rules@195"
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
                  "$ref": "#/rules@181"
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
              "$ref": "#/rules@194"
            },
            "arguments": []
          },
          {
            "$type": "RuleCall",
            "rule": {
              "$ref": "#/rules@191"
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
                "$ref": "#/rules@180"
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
                    "$ref": "#/rules@180"
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
                "$ref": "#/rules@190"
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
                  "$ref": "#/rules@210"
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
                            "$ref": "#/rules@181"
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
                                "$ref": "#/rules@181"
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
              "$ref": "#/rules@210"
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
                    "$ref": "#/rules@207"
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
                "$ref": "#/rules@181"
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
                    "$ref": "#/rules@211"
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
                    "$ref": "#/rules@196"
                  },
                  "arguments": []
                },
                {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@197"
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
            "$ref": "#/rules@215"
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
            "$ref": "#/rules@211"
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
              "$ref": "#/rules@210"
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
                  "$ref": "#/rules@210"
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
          "$ref": "#/rules@210"
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
              "$ref": "#/rules@213"
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
              "$ref": "#/rules@212"
            }
          },
          {
            "$type": "TerminalRuleCall",
            "rule": {
              "$ref": "#/rules@214"
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
        "regex": "/(\\"(\\"\\"|\\\\\\\\.|[^\\"\\\\\\\\])*\\"|'(''|\\\\\\\\.|[^'\\\\\\\\])*')([xX]|[aA]|[eE]|[xX][uU]|[xX][nN]|[bB]4|[bB]3|[bB][xX]|[bB]|[gG][xX]|[gG]|[uU][xX]|[wW][xX]|[xX]|[iI])*/"
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
    }
  ],
  "definesHiddenTokens": false,
  "hiddenTokens": [],
  "imports": [],
  "interfaces": [],
  "usedGrammars": [],
  "$comment": "/**\\n * This program and the accompanying materials are made available under the terms of the\\n * Eclipse Public License v2.0 which accompanies this distribution, and is available at\\n * https://www.eclipse.org/legal/epl-v20.html\\n *\\n * SPDX-License-Identifier: EPL-2.0\\n *\\n * Copyright Contributors to the Zowe Project.\\n *\\n */"
}`));const mO={languageId:"pli",fileExtensions:[".pli"],caseInsensitive:true,mode:"development"};const hO={AstReflection:()=>new c$};const yO={Grammar:()=>pO(),LanguageMetaData:()=>mO,parser:{}};function gO(t,e){const n=new Set;t.procedures.forEach((r,i)=>{if(!n.has(r)){n.add(r)}else{e("error",`The name '${r}' occurs more than once in the EXPORTS clause.`,{code:"IBM1324IE",node:t,property:"procedures",index:i})}})}function Ku(t){return t.toUpperCase()}function RO(t,e){return Ku(t)===Ku(e)}function vO(t,e){const n=t.options.flatMap(i=>i.items);const r=n.find(i=>cO(i)&&i.value.toUpperCase()==="NODESCRIPTOR");if(r){const i=new Set(t.parameters.map(s=>Ku(s.id)));const a=t.statements.filter(dO).map(s=>s.value).filter(QD).flatMap(s=>s.items).filter(s=>Qr(s.element)&&i.has(Ku(s.element.name))).filter(s=>s.attributes.some(o=>JD(o)&&RO(o.type,"NONCONNECTED")));if(a.length>0){e("error","The NODESCRIPTOR attribute is invalid when any parameters have the NONCONNECTED attribute.",{code:"IBM1388IE",node:r,property:"value"})}}}function $O(t,e){if(!Qr(t.element.ref.ref)){return}const n=t.element.ref.ref.$container;if(!n.attributes.some(o=>tO(o)&&o.returns)){return}const r=yt(t);const i=yt(n);if(r!==i){return}const a=t.$cstNode.offset;const s=n.$cstNode.offset;if(a>s){return}e("error","Function cannot be used before the function's descriptor list has been scanned.",{code:"IBM1747IS",node:t,property:"element"})}function TO(t){const e=t.validation.ValidationRegistry;const n=t.validation.Pl1Validator;const r={Exports:[gO],MemberCall:[$O],ProcedureStatement:[vO]};e.register(r,n)}class EO{}function wO(...t){return t.reduce((e,n)=>{return{issues:e.issues.concat(n.issues),options:{...e.options,...n.options}}},{issues:[],options:{}})}const sp=rr({name:"comma",pattern:","});const d$=rr({name:"string",pattern:/'([^'\\]|\\.)*'/});const f$=rr({name:"value",pattern:/[\w\d\-+_]+/});const p$=rr({name:"parenOpen",pattern:"("});const m$=rr({name:"parenClose",pattern:")"});const CO=rr({name:"ws",pattern:/\s+/,group:ot.SKIPPED});const h$=[CO,sp,d$,p$,m$,f$];const SO=new ot(h$,{positionTracking:"full"});class AO extends JR{constructor(){super(h$,{recoveryEnabled:true});this.performSelfAnalysis()}compilerOptions=this.RULE("compilerOptions",()=>{const e=[];this.MANY_SEP({SEP:sp,DEF:()=>{let n=this.SUBRULE(this.compilerOption);if(y$(n)){n={type:"option",name:n.value,token:n.token,values:[]}}e.push(n)}});return{options:e}},{recoveryValueFunc:()=>({options:[]})});compilerOption=this.RULE("compilerOption",()=>{const e=this.CONSUME(f$);const n=[];let r=false;this.MANY(()=>{r=true;this.CONSUME(p$);this.MANY_SEP({SEP:sp,DEF:()=>{n.push(this.SUBRULE(this.compilerValue))}});this.CONSUME(m$)});if(r){return{type:"option",name:e.image,token:e,values:n}}else{return{type:"text",token:e,value:e.image}}},{recoveryValueFunc:()=>({type:"text",token:this.LA(1),value:""})});compilerValue=this.RULE("compilerValue",()=>{return this.OR([{ALT:()=>{const e=this.CONSUME(d$);return{type:"string",token:e,value:e.image.slice(1,-1)}}},{ALT:()=>{return this.SUBRULE(this.compilerOption)}},{ALT:()=>{return{type:"text",value:"",token:this.LA(1)}}}])},{recoveryValueFunc:()=>({type:"text",value:"",token:this.LA(1)})})}const _d=new AO;function kO(t){return"name"in t}function bO(t){return"type"in t&&t.type==="string"}function y$(t){return"type"in t&&t.type==="text"}function NO(t){const e=SO.tokenize(t);_d.input=e.tokens;const n=_d.compilerOptions();const r=[];for(const i of e.errors){r.push({message:i.message,range:{start:{line:i.line-1,character:i.column-1},end:{line:i.line-1,character:i.column+i.length-1}},severity:1})}for(const i of _d.errors){r.push({message:i.message,range:g$(i.token),severity:1})}return{options:n.options,issues:r}}function g$(t){return{start:{character:t.startColumn-1,line:t.startLine-1},end:{character:t.endColumn,line:t.endLine-1}}}class PO{options={};issues=[];rules=[];rule(e,n,r,i){this.rules.push({positive:e,negative:r,positiveTranslate:n,negativeTranslate:i})}flag(e,n,r){this.rules.push({positive:n,positiveTranslate:(i,a)=>{Ye(i,0,0);a[e]=true},negative:r,negativeTranslate:(i,a)=>{Ye(i,0,0);a[e]=false}})}translate(e){const n=e.name.toUpperCase();try{for(const r of this.rules){if(r.positive&&r.positive.includes(n)){r.positiveTranslate?.(e,this.options);return}if(r.negative&&r.negative.includes(n)){r.negativeTranslate?.(e,this.options);return}}}catch(r){if(r instanceof ze){this.issues.push({range:g$(r.token),message:r.message,severity:r.severity})}else{console.error("Encountered unexpected error during compiler options translation:",String(r))}}}}class ze{token;message;severity;constructor(e,n,r){this.token=e;this.message=n;this.severity=r}}function Ye(t,e,n){if(t.values.length<e||t.values.length>n){let r;if(e===n){r=`Expected ${e} arguments, but received ${t.values.length}.`}else{r=`Expected between ${e} and ${n} arguments, but received ${t.values.length}.`}throw new ze(t.token,r,1)}}function Ge(t,e){let n;if(kO(t)){n="option"}else if(y$(t)){n="plain";if(e==="plainOrString"){return}}else if(bO(t)){n="string";if(e==="plainOrString"){return}}else{n="empty"}if(e!==n){throw new ze(t.token,`Expected a ${e}, received ${n}.`,1)}}const te=new PO;function ms(t){return(e,n)=>{Ye(e,1,1);const r=e.values[0];Ge(r,"string");t(n,r)}}function Ut(t,...e){return(n,r)=>{Ye(n,1,1);const i=n.values[0];Ge(i,"plain");if(e.length>0&&!e.includes(i.value)){throw new ze(i.token,`Expected one of '${e.join("', '")}', but received '${i.value}'.`,1)}t(r,i)}}te.rule(["AGGREGATE","AG"],(t,e)=>{Ye(t,0,1);const n=t.values[0];if(n){Ge(n,"plain");const r=n.value;if(r==="DECIMAL"||r==="HEXADEC"){e.aggregate={offsets:r}}else{throw new ze(n.token,"Invalid aggregate value. Expected DECIMAL or HEXADEC",1)}}},["NOAGGREGATE","NAG"],(t,e)=>{e.aggregate=false});te.rule(["ARCH"],Ut((t,e)=>{t.arch=Number(e)},"10","11","12","13","14"));te.rule(["ASSERT"],Ut((t,e)=>{t.assert=e.value},"ENTRY","CONDITION"));te.rule(["ATTRIBUTES","A","NOATTRIBUTES","NA"],(t,e)=>{Ye(t,0,1);const n=t.name.startsWith("A");let r=void 0;const i=t.values[0];if(i){Ge(i,"plain");const a=i.value;if(a==="F"||a==="FULL"){r="FULL"}else if(a==="S"||a==="SHORT"){r="SHORT"}else{throw new ze(i.token,"Invalid attribute value. Expected FULL or SHORT",1)}}e.attributes={include:n,identifiers:r}});te.rule(["BACKREG"],Ut((t,e)=>{t.backreg=Number(e)},"5","11"));te.rule(["BIFPREC"],Ut((t,e)=>{t.bifprec=Number(e)},"31","15"));te.rule(["BIFPREC"],ms((t,e)=>{t.blank=e.value}));te.flag("blkoff",["BLKOFF"],["NOBLKOFF"]);te.rule(["BRACKETS"],ms((t,e)=>{const n=e.value.length;if(n!==2){throw new ze(e.token,"Expected two characters",1)}const r=e.value.charAt(0);const i=e.value.charAt(1);t.brackets=[r,i]}));te.rule(["CASE"],Ut((t,e)=>{t.case=e.value},"UPPER","ASIS"));te.rule(["CASERULES"],(t,e)=>{Ye(t,1,1);const n=t.values[0];Ge(n,"option");Ye(n,1,1);const r=n.values[0];Ge(r,"plain");e.caserules=r.value});te.rule(["CHECK"],Ut((t,e)=>{let n=e.value;if(n==="STG"){n="STORAGE"}else if(n==="NSTG"){n="NOSTORAGE"}t.check={storage:n}},"STORAGE","STG","NOSTORAGE","NSTG"));te.rule(["CMPAT","CMP"],Ut((t,e)=>{t.cmpat=e.value},"V1","V2","V3","LE"));te.rule(["CODEPAGE"],Ut((t,e)=>{t.codepage=e.value}));te.flag("common",["COMMON"],["NOCOMMON"]);te.rule(["COMPILE","C"],(t,e)=>{e.compile=true},["NOCOMPILE","NC"],(t,e)=>{Ye(t,0,1);const n=t.values[0];let r;if(n){Ge(n,"plain");const i=n.value;if(i==="S"){r="SEVERE"}else if(i==="W"){r="WARNING"}else if(i==="E"){r="ERROR"}else{throw new ze(n.token,`Invalid severity value. Expected S, W or E, but received '${i}'`,1)}}e.compile={severity:r}});te.rule(["COPYRIGHT"],(t,e)=>{Ye(t,1,1);const n=t.values[0];Ge(n,"string");e.copyright=n.value},["NOCOPYRIGHT"],(t,e)=>{e.copyright=false});te.flag("csect",["CSECT"],["NOCSECT"]);te.rule(["CSECTCUT"],Ut((t,e)=>{if(!["0","1","2","3","4","5","6","7"].includes(e.value)){throw new ze(e.token,`Invalid csectcut value. Expected a number between 0 and 7, but received '${e.value}'.`,1)}t.csectcut=Number(e)}));te.rule(["CURRENCY"],ms((t,e)=>{if(e.value.length===0){throw new ze(e.token,"Currency character required",1)}else if(e.value.length>1){throw new ze(e.token,`Currency character must be a single character, but received '${e.value}'.`,1)}t.currency=e.value}));te.flag("dbcs",["DBCS"],["NODBCS"]);te.rule(["DBRMLIB"],(t,e)=>{Ye(t,0,1);const n=t.values[0];Ge(n,"string");e.dbrmlib=n.value},["NODBRMLIB"],(t,e)=>{e.dbrmlib=false});te.rule(["DD"],(t,e)=>{Ye(t,0,8);e.dd={};const n=["sysprint","sysin","syslib","syspunch","syslin","sysadata","sysxmlsd","sysdebug"];for(let r=0;r<t.values.length;r++){const i=t.values[r];Ge(i,"plain");e.dd[n[r]]=i.value}});te.rule(["DDSQL"],(t,e)=>{Ye(t,1,1);const n=t.values[0];Ge(n,"plainOrString");e.ddsql=n.value});te.rule(["DECIMAL"],(t,e)=>{e.decimal={};for(const n of t.values){Ge(n,"plain");const r=n.value;switch(r){case"CHECKFLOAT":e.decimal.checkfloat=true;break;case"NOCHECKFLOAT":e.decimal.checkfloat=false;break;case"FOFLONADD":e.decimal.foflonadd=true;break;case"NOFOFLONADD":e.decimal.foflonadd=false;break;case"FOFLONASGN":e.decimal.foflonasgn=true;break;case"NOFOFLONASGN":e.decimal.foflonasgn=false;break;case"FOFLONDIV":e.decimal.foflondiv=true;break;case"NOFOFLONDIV":e.decimal.foflondiv=false;break;case"FOFLONMULT":e.decimal.foflonmult=true;break;case"NOFOFLONMULT":e.decimal.foflonmult=false;break;case"FORCEDSIGN":e.decimal.forcedsign=true;break;case"NOFORCEDSIGN":e.decimal.forcedsign=false;break;case"KEEPMINUS":e.decimal.keepminus=true;break;case"NOKEEPMINUS":e.decimal.keepminus=false;break;case"TRUNCFLOAT":e.decimal.truncfloat=true;break;case"NOTRUNCFLOAT":e.decimal.truncfloat=false;break;default:throw new ze(n.token,`Invalid decimal option. Expected one of 'CHECKFLOAT', 'NOCHECKFLOAT', 'FOFLONADD', 'NOFOFLONADD', 'FOFLONASGN', 'NOFOFLONASGN', 'FOFLONDIV', 'NOFOFLONDIV', 'FOFLONMULT', 'NOFOFLONMULT', 'FORCEDSIGN', 'NOFORCEDSIGN', 'KEEPMINUS', 'NOKEEPMINUS', 'TRUNCFLOAT', 'NOTRUNCFLOAT', but received '${r}'.`,1)}}});te.flag("decomp",["DECOMP"],["NODECOMP"]);te.rule(["DEFAULT"],(t,e)=>{const n=e.default={};for(const r of t.values){if(r.type==="text"){const i=r.value;switch(i){case"ALIGNED":n.aligned=true;break;case"UNALIGNED":n.aligned=false;break;case"IBM":case"ANS":n.architecture=i;break;case"EBCDIC":case"ASCII":n.encoding=i;break;case"ASSIGNABLE":n.assignable=true;break;case"NONASSIGNABLE":n.assignable=false;break;case"BIN1ARG":n.bin1arg=true;break;case"NOBIN1ARG":n.bin1arg=false;break;case"BYADDR":case"BYVALUE":n.allocator=i;break;case"CONNECTED":n.connected=true;break;case"NONCONNECTED":n.connected=false;break;case"DESCLIST":n.desc="LIST";break;case"DESCLOCATOR":n.desc="LOCATOR";break;case"DESCRIPTOR":n.descriptor=true;break;case"NODESCRIPTOR":n.descriptor=false;break;case"EVENDEC":n.evendec=true;break;case"NOEVENDEC":n.evendec=false;break;case"HEXADEC":case"IEEE":n.format=i;break;case"INLINE":n.inline=true;break;case"NOINLINE":n.inline=false;break;case"LAXQUAL":n.laxqual=true;break;case"NOLAXQUAL":n.laxqual=false;break;case"LOWERINC":case"UPPERINC":n.inc=i;break;case"NATIVE":n.native=true;break;case"NONNATIVE":n.native=false;break;case"NATIVEADDR":n.nativeAddr=true;break;case"NONNATIVEADDR":n.nativeAddr=false;break;case"NULLSYS":case"NULL370":n.nullsys=i;break;case"NULLSTRADDR":n.nullStrAddr=true;break;case"NONULLSTRADDR":n.nullStrAddr=false;break;case"ORDER":case"REORDER":n.order=i;break;case"OVERLAP":n.overlap=true;break;case"NOOVERLAP":n.overlap=false;break;case"PADDING":n.padding=true;break;case"NOPADDING":n.padding=false;break;case"PSEUDODUMMY":n.pseudodummy=true;break;case"NOPSEUDODUMMY":n.pseudodummy=false;break;case"RECURSIVE":n.recursive=true;break;case"NORECURSIVE":n.recursive=false;break;case"RETCODE":n.retcode=true;break;case"NORETCODE":n.retcode=false;break;default:throw new ze(r.token,`Invalid default option value: ${i}`,1)}}}});te.rule(["DEPRECATE","DEPRECATENEXT"],(t,e)=>{const n=[];for(const r of t.values){Ge(r,"option");if(!["BUILTIN","ENTRY","INCLUDE","STMT","VARIABLE"].includes(r.name)){throw new ze(r.token,`Expected BUILTIN, ENTRY, INCLUDE, STMT or VARIABLE, but received '${r.name}'`,1)}Ye(r,0,1);const i=r.values[0];Ge(i,"plain");n.push({type:r.name,value:i.value})}if(t.name==="DEPRECATE"){e.deprecate={items:n}}else{e.deprecateNext={items:n}}});te.rule(["DISPLAY"],(t,e)=>{const n=e.display={};Ye(t,1,1);const r=t.values[0];if(r.type==="text"){if(r.value==="STD"){n.std=true}else if(r.value==="WTO"){n.wto=true}else{throw new ze(r.token,`Invalid display value. Expected STD or WTO, but received '${r.value}'.`,1)}}else if(r.type==="option"){if(r.name!=="WTO"){throw new ze(r.token,`Invalid display option. Expected WTO, but received '${r.name}'.`,1)}n.wto=true;for(const i of r.values){Ge(i,"option");const a=[];for(const s of i.values){Ge(s,"plain");a.push(s.value)}if(i.name==="ROUTCDE"){n.routcde=a}else if(i.name==="DESC"){n.desc=a}else if(i.name==="REPLY"){n.reply=a}else{throw new ze(i.token,`Invalid display option. Expected ROUTCDE, DESC or REPLY, but received '${i.name}'.`,1)}}}else{throw new ze(r.token,`Invalid display value. Expected a text or an option, but received '${r.type}'.`,1)}});te.flag("dll",["DLL"],["NODLL"]);te.flag("dllInit",["DLLINIT"],["NODLLINIT"]);te.rule(["EXIT"],(t,e)=>{Ye(t,0,1);const n=t.values[0];if(n){Ge(n,"string");e.exit={inparm:n.value}}else{e.exit={}}},["NOEXIT"],(t,e)=>{e.exit=false});te.flag("exportAll",["EXPORTALL"],["NOEXPORTALL"]);te.rule(["EXTRN"],Ut((t,e)=>{t.extrn=e.value},"FULL","SHORT"));te.rule(["FILEREF"],Ut((t,e)=>{t.fileRef={hash:e.value==="HASH"}},"HASH","NOHASH"),["NOFILEREF"],(t,e)=>{e.fileRef=false});te.rule(["FLAG","F"],(t,e)=>{Ye(t,0,1);const n=t.values[0];if(n){Ge(n,"plain");const r=n.value;if(r==="S"||r==="E"||r==="I"||r==="W"){e.flag=r}else{throw new ze(n.token,`Invalid flag value. Expected S, E, I or W, but received '${r}'.`,1)}}});te.rule(["FLOAT"],Ut((t,e)=>{t.float={dfp:e.value==="DFP"}},"DFP","NODFP"));te.rule(["FLOATINMATH"],Ut((t,e)=>{t.floatInMath={type:e.value}},"ASIS","LONG","EXTENDED"));te.flag("goff",["GOFF"],["NOGOFF"]);te.rule(["MARGINS","MAR"],(t,e)=>{Ye(t,2,3);const n=t.values[0];const r=t.values[1];const i=t.values[2];Ge(n,"plain");Ge(r,"plain");let a=void 0;if(i){Ge(i,"plain");a=i.value}const s=n.value?Number(n.value):NaN;const o=r.value?Number(r.value):NaN;e.margins={m:s,n:o,c:a}},["NOMARGINS"],(t,e)=>{e.margins=false});te.rule(["NOT"],ms((t,e)=>{t.not=e.value}));te.rule(["OR"],ms((t,e)=>{t.or=e.value}));function _O(t){te.options={};te.issues=[...t.issues];for(const e of t.options){te.translate(e)}return{options:te.options,issues:te.issues}}const DO="\n".charCodeAt(0);class OO extends xv{compilerOptions={issues:[],options:{}};uri;configStorage;constructor(e){super(e);this.configStorage=e.shared.workspace.PliConfigStorage}tokenize(e){const n=this.splitLines(e);this.fillCompilerOptions(n);this.tokenBuilder.or=this.compilerOptions.options.or||"|";this.tokenBuilder.not=this.compilerOptions.options.not||"^";const r=n.map(a=>this.adjustLine(a));const i=r.join("");return super.tokenize(i)}splitLines(e){const n=[];for(let r=0;r<e.length;r++){const i=r;while(r<e.length&&e.charCodeAt(r)!==DO){r++}n.push(e.substring(i,r+1))}return n}fillCompilerOptions(e){const n=Math.min(e.length,100);const r=this.configStorage.getCompilerOptions(this.uri);let i="";for(let a=0;a<n;a++){const s=e[a];const{length:o,eol:l}=this.getLineInfo(s);const u="*PROCESS";if(s.includes(u)){const c=s.indexOf(u);const d=c+u.length;let f=s.lastIndexOf(";");if(f<0){f=o}const p=s.substring(d,f);i+=" ".repeat(d)+p;const y=NO(i);this.compilerOptions=wO(r,_O(y));const v=" ".repeat(o)+l;e[a]=v;return this.compilerOptions}else{i+=" ".repeat(o)+l}}this.compilerOptions=r;return this.compilerOptions}adjustLine(e){const{length:n,eol:r}=this.getLineInfo(e);const i=1;if(n<i){return" ".repeat(n)+r}const a=72;const s=" ".repeat(i);let o="";if(n>a){o=" ".repeat(n-a)}return s+e.substring(i,Math.min(a,n))+o+r}getLineInfo(e){let n="";let r=e.length;if(e.endsWith("\r\n")){n="\r\n";r-=2}else if(e.endsWith("\n")){n="\n";r-=1}return{eol:n,length:r}}}class IO extends Rv{or="|";not="¬";static EXPERIMENTAL=true;buildTokens(e,n){const r=be(up(e,false));const i=this.buildTerminalTokens(r);const a=this.buildKeywordTokens(r,i,n);const s=this.findToken(i,"ID");for(const l of a){if(/[a-zA-Z]/.test(l.name)){l.CATEGORIES=[s]}}i.forEach(l=>{const u=l.PATTERN;if(typeof u==="object"&&u&&"test"in u&&du(u)||l.name==="ExecFragment"){a.unshift(l)}else{a.push(l)}});const o=this.findToken(a,"ExecFragment");o.START_CHARS_HINT=["S","C"];{this.overrideNotTokens(a);this.overrideOrTokens(a)}return a}overrideOrTokens(e){this.overrideToken(this.findToken(e,"OR_TOKEN"),"",()=>this.getOr());this.overrideToken(this.findToken(e,"OR_EQUAL"),"=",()=>this.getOr());this.overrideToken(this.findToken(e,"CONCAT_TOKEN"),"",()=>this.getOr(true));this.overrideToken(this.findToken(e,"CONCAT_EQUAL"),"=",()=>this.getOr(true))}overrideNotTokens(e){this.overrideToken(this.findToken(e,"NOT_TOKEN"),"",()=>this.getNot());this.overrideToken(this.findToken(e,"NOT_SMALLER"),"<",()=>this.getNot());this.overrideToken(this.findToken(e,"NOT_EQUAL"),"=",()=>this.getNot());this.overrideToken(this.findToken(e,"NOT_LARGER"),">",()=>this.getNot())}getOr(e){const n=this.or.charAt(0);return e?n+n:n}getNot(){return this.not.charAt(0)}findToken(e,n){return e.find(r=>r.name===n)}overrideToken(e,n,r){e.PATTERN=(i,a)=>{const s=r()+n;const o=i.substring(a,a+s.length);if(o===s){return[o]}else{return null}};e.START_CHARS_HINT=["!","|","^","¬"]}}class LO extends bv{async computeExports(e,n=U.CancellationToken.None){return this.computeExportsForNode(e.parseResult.value,e,Nr,n)}processNode(e,n,r){const i=lu(e);if(i){const a=this.nameProvider.getName(e);if(a){r.add(i,this.descriptions.createDescription(e,a,n))}}}}class xO extends Ov{processLinkingErrors(e,n,r){for(const i of e.references){const a=i.error;if(a){const s={node:a.container,property:a.property,index:a.index,data:{code:qt.LinkingError,containerType:a.container.$type,property:a.property,refText:a.reference.$refText}};n.push(this.toDiagnostic("warning",a.message,s))}}}async validateDocument(e,n,r){const i=await super.validateDocument(e,n,r);const a=e;const s=a.compilerOptions;for(const o of s.issues){i.push({severity:o.severity,range:o.range,message:o.message})}return i}}class MO extends fD{highlightElement(e,n){if(uO(e)){const r=e.ref?.ref;n({node:e,property:"ref",type:un(r)?U.SemanticTokenTypes.function:U.SemanticTokenTypes.variable})}else if(Qr(e)||u$(e)){n({node:e,property:"name",type:U.SemanticTokenTypes.variable})}else if(ZD(e)){n({node:e,property:"name",type:U.SemanticTokenTypes.type})}else if(lO(e)){n({node:e,property:"id",type:U.SemanticTokenTypes.parameter})}else if(eO(e)){const r=e.$container;n({node:e,property:"label",type:un(r)?U.SemanticTokenTypes.function:U.SemanticTokenTypes.variable})}else if(rO(e)){n({node:e,property:"label",type:U.SemanticTokenTypes.variable})}else if(oO(e)){n({node:e,property:"procedure",type:U.SemanticTokenTypes.function})}else if(Ya(e)){const r=e.$container;n({node:e,property:"name",type:un(r)?U.SemanticTokenTypes.function:U.SemanticTokenTypes.variable})}else if(sO(e)){n({node:e,property:"value",type:U.SemanticTokenTypes.number})}else if(fO(e)){n({node:e,property:"value",type:U.SemanticTokenTypes.string})}else if(iO(e)){n({node:e,property:"multiplier",type:U.SemanticTokenTypes.number})}}}class FO extends Av{getName(e){if(un(e)){const n=e.labels[0];return n?.name||void 0}else{return super.getName(e)}}getNameNode(e){if(un(e)){const n=e.labels[0];if(n){return this.getNameNode(n)}else{return void 0}}else{return super.getNameNode(e)}}}class KO extends kv{findReferences(e,n){if(Ya(e)&&un(e.$container)){return this.findReferences(e.$container,n)}else{return super.findReferences(e,n)}}}class UO extends Dv{globalDocumentScopeCache;constructor(e){super(e);this.globalDocumentScopeCache=new hP(e.shared)}getGlobalScope(e,n){return this.globalDocumentScopeCache.get(yt(n.container).uri,e,()=>{const r=Yn(yt(n.container).parseResult.value).filter(nO);const i=this.getUrisFromIncludes(yt(n.container).uri,r.toArray());return new Nv(this.indexManager.allElements(e,i))})}getUrisFromIncludes(e,n){const r=new Set;r.add(e.toString());const i=Ue.dirname(e);for(const a of n){for(const s of a.items){const o=Ue.joinPath(i,s.file.substring(1,s.file.length-1));r.add(o.toString())}}r.add("pli-builtin:/builtins.pli");return r}getScope(e){if(e.property==="ref"){const n=In(e.container,aO);if(n?.previous){const r=n.previous.element.ref.ref;if(r&&Qr(r)){return this.createScopeForNodes(this.findChildren(r))}else{return pP}}}return super.getScope(e)}findChildren(e){const n=e.$container;let r=Number(n.level);if(isNaN(r)||r<1){r=1}const i=[];const a=n.$container;const s=a.items.indexOf(n);for(let o=s+1;o<a.items.length;o++){const l=a.items[o];const u=Number(l.level);if(isNaN(u)||u<r){break}if(u===r+1){if(Qr(l.element)){i.push(l.element)}}}return i}}class GO extends l${getSymbolKind(e){const n=this.getNode(e);if(!n){return Dn.Null}if(un(n)){return Dn.Function}else if(Yy(n)){return Dn.Variable}else if(ig(n)){return Dn.Namespace}else if(Ya(n)){return Dn.Constant}else{return Dn.Variable}}getCompletionItemKind(e){const n=this.getNode(e);if(!n){return _n.Text}if(un(n)){return _n.Function}else if(Yy(n)){return _n.Variable}else if(ig(n)){return _n.Module}else if(Ya(n)){return _n.Constant}return _n.Variable}getNode(e){if(mg(e)){return e.node}return e}}class HO extends qv{getDocumentation(e){if(Qr(e)){const n=e.$container;let r=`\`\`\`
DECLARE ${e.name} `;for(const i of n.attributes){r+=`${i.$cstNode?.text} `}r+="\n```";return r}else if(Ya(e)&&un(e.$container)){return this.getProcedureHoverContent(e.$container)}else if(un(e)){return this.getProcedureHoverContent(e)}else if(u$(e)){return"```\nDECLARE"+e.name+"\n```"}return""}getProcedureHoverContent(e){let n="```\n";for(const r of e.labels){n+=`${r.name} `}n+="PROCEDURE ";if(e.parameters.length>0){n+="("+e.parameters.map(r=>r.id).join(", ")+") "}if(e.recursive.length>0){n+="RECURSIVE "}if(e.order.includes("ORDER")){n+="ORDER "}else if(e.order.includes("REORDER")){n+="REORDER "}if(e.options.length>0){n+=e.options.map(r=>r.$cstNode?.text).join(" ")}if(e.returns.length>0){n+=e.returns.map(r=>r.$cstNode?.text).join(" ")}n+="\n```";return n}}class qO extends s${createReferenceCompletionItem(e){let n=void 0;if(e.type==="ProcedureStatement"){n="PROCEDURE"}else if(e.type==="DeclaredVariable"||e.type==="DoType3Variable"){n="DECLARE"}else if(e.type==="LabelPrefix"){n="LABEL"}const r=this.nodeKindProvider.getCompletionItemKind(e);const i=this.getReferenceDocumentation(e);return{nodeDescription:e,kind:r,documentation:i,detail:n,sortText:"0"}}}class jO extends Iv{isAffected(e,n){return false}}const BO=` // Mathematical functions
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
 `;class WO extends Lv{factory;configStorage;constructor(e){super(e);this.factory=e.workspace.LangiumDocumentFactory;this.configStorage=e.workspace.PliConfigStorage}async loadAdditionalDocuments(e,n){const r=this.factory.fromString(BO,lt.parse("pli-builtin:///builtins.pli"));n(r);for(const i of e){const a=Ue.resolvePath(lt.parse(i.uri),"pgm_conf.json");try{const s=await this.fileSystemProvider.readFile(a);await this.configStorage.updateConfig(s,false)}catch{}}}traverseFolder(){return Promise.resolve()}}class VO extends o${didCloseDocument(e){const n=lt.parse(e.document.uri);if(n.scheme!=="pli-builtin"){this.fireDocumentUpdate([],[n])}}}class zO{documents;documentBuilder;compilerOptions;constructor(e){this.documentBuilder=e.workspace.DocumentBuilder;this.documents=e.workspace.LangiumDocuments;e.lsp.Connection?.onNotification("pli/pgmConfChanged",async n=>{await this.updateConfig(n.text)})}async updateConfig(e,n=true){try{const r=JSON.parse(e);this.compilerOptions=r;if(n){const i=this.documents.all.filter(a=>a.uri.scheme!=="pli-builtin").toArray();i.forEach(a=>{a.parseResult.value.$cstNode=void 0});await this.documentBuilder.update(i.map(a=>a.uri),[])}}catch(r){}}getCompilerOptions(e){return{options:this.compilerOptions??{},issues:[]}}}class XO extends Cv{createLangiumDocument(e,n,r,i){const a=this.serviceRegistry.getServices(n).parser.Lexer;a.uri=n;const s=super.createLangiumDocument(e,n,r,i);s.compilerOptions=a.compilerOptions;return s}async update(e,n){const r=this.serviceRegistry.getServices(e.uri).parser.Lexer;r.uri=e.uri;const i=await super.update(e,n);const a=i;a.compilerOptions=r.compilerOptions;return a}}const YO={documentation:{DocumentationProvider:t=>new HO(t)},validation:{Pl1Validator:()=>new EO,DocumentValidator:t=>new xO(t)},parser:{Lexer:t=>new OO(t),TokenBuilder:()=>new IO},references:{ScopeComputation:t=>new LO(t),NameProvider:()=>new FO,References:t=>new KO(t),ScopeProvider:t=>new UO(t)},lsp:{SemanticTokenProvider:t=>new MO(t),CompletionProvider:t=>new qO(t)}};const JO={lsp:{NodeKindProvider:()=>new GO,DocumentUpdateHandler:t=>new VO(t)},workspace:{LangiumDocumentFactory:t=>new XO(t),IndexManager:t=>new jO(t),WorkspaceManager:t=>new WO(t),PliConfigStorage:t=>new zO(t)}};function QO(t){const e=xu(zD(t),hO,JO);const n=xu(WD({shared:e}),yO,YO);e.ServiceRegistry.register(n);TO(n);if(!t.connection){e.workspace.ConfigurationProvider.initialized({})}return{shared:e,pli:n}}const ZO=new Qp.BrowserMessageReader(self);const eI=new Qp.BrowserMessageWriter(self);const tI=Qp.createConnection(ZO,eI);const{shared:nI}=QO({connection:tI,...zv});hD(nI)});export default rI();
