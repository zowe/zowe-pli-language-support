var nv=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);var _I=nv((Nt,Pt)=>{function Ze(t){return typeof t==="object"&&t!==null&&typeof t.$type==="string"}function tn(t){return typeof t==="object"&&t!==null&&typeof t.$refText==="string"}function sg(t){return typeof t==="object"&&t!==null&&typeof t.name==="string"&&typeof t.type==="string"&&typeof t.path==="string"}function Ll(t){return typeof t==="object"&&t!==null&&Ze(t.container)&&tn(t.reference)&&typeof t.message==="string"}class og{constructor(){this.subtypes={};this.allSubtypes={}}isInstance(e,n){return Ze(e)&&this.isSubtype(e.$type,n)}isSubtype(e,n){if(e===n){return true}let r=this.subtypes[e];if(!r){r=this.subtypes[e]={}}const i=r[n];if(i!==void 0){return i}else{const a=this.computeIsSubtype(e,n);r[n]=a;return a}}getAllSubTypes(e){const n=this.allSubtypes[e];if(n){return n}else{const r=this.getAllTypes();const i=[];for(const a of r){if(this.isSubtype(a,e)){i.push(a)}}this.allSubtypes[e]=i;return i}}}function hr(t){return typeof t==="object"&&t!==null&&Array.isArray(t.content)}function Ba(t){return typeof t==="object"&&t!==null&&typeof t.tokenType==="object"}function lg(t){return hr(t)&&typeof t.fullText==="string"}class Je{constructor(e,n){this.startFn=e;this.nextFn=n}iterator(){const e={state:this.startFn(),next:()=>this.nextFn(e.state),[Symbol.iterator]:()=>e};return e}[Symbol.iterator](){return this.iterator()}isEmpty(){const e=this.iterator();return Boolean(e.next().done)}count(){const e=this.iterator();let n=0;let r=e.next();while(!r.done){n++;r=e.next()}return n}toArray(){const e=[];const n=this.iterator();let r;do{r=n.next();if(r.value!==void 0){e.push(r.value)}}while(!r.done);return e}toSet(){return new Set(this)}toMap(e,n){const r=this.map(i=>[e?e(i):i,n?n(i):i]);return new Map(r)}toString(){return this.join()}concat(e){return new Je(()=>({first:this.startFn(),firstDone:false,iterator:e[Symbol.iterator]()}),n=>{let r;if(!n.firstDone){do{r=this.nextFn(n.first);if(!r.done){return r}}while(!r.done);n.firstDone=true}do{r=n.iterator.next();if(!r.done){return r}}while(!r.done);return kt})}join(e=","){const n=this.iterator();let r="";let i;let a=false;do{i=n.next();if(!i.done){if(a){r+=e}r+=rv(i.value)}a=true}while(!i.done);return r}indexOf(e,n=0){const r=this.iterator();let i=0;let a=r.next();while(!a.done){if(i>=n&&a.value===e){return i}a=r.next();i++}return-1}every(e){const n=this.iterator();let r=n.next();while(!r.done){if(!e(r.value)){return false}r=n.next()}return true}some(e){const n=this.iterator();let r=n.next();while(!r.done){if(e(r.value)){return true}r=n.next()}return false}forEach(e){const n=this.iterator();let r=0;let i=n.next();while(!i.done){e(i.value,r);i=n.next();r++}}map(e){return new Je(this.startFn,n=>{const{done:r,value:i}=this.nextFn(n);if(r){return kt}else{return{done:false,value:e(i)}}})}filter(e){return new Je(this.startFn,n=>{let r;do{r=this.nextFn(n);if(!r.done&&e(r.value)){return r}}while(!r.done);return kt})}nonNullable(){return this.filter(e=>e!==void 0&&e!==null)}reduce(e,n){const r=this.iterator();let i=n;let a=r.next();while(!a.done){if(i===void 0){i=a.value}else{i=e(i,a.value)}a=r.next()}return i}reduceRight(e,n){return this.recursiveReduce(this.iterator(),e,n)}recursiveReduce(e,n,r){const i=e.next();if(i.done){return r}const a=this.recursiveReduce(e,n,r);if(a===void 0){return i.value}return n(a,i.value)}find(e){const n=this.iterator();let r=n.next();while(!r.done){if(e(r.value)){return r.value}r=n.next()}return void 0}findIndex(e){const n=this.iterator();let r=0;let i=n.next();while(!i.done){if(e(i.value)){return r}i=n.next();r++}return-1}includes(e){const n=this.iterator();let r=n.next();while(!r.done){if(r.value===e){return true}r=n.next()}return false}flatMap(e){return new Je(()=>({this:this.startFn()}),n=>{do{if(n.iterator){const a=n.iterator.next();if(a.done){n.iterator=void 0}else{return a}}const{done:r,value:i}=this.nextFn(n.this);if(!r){const a=e(i);if(Ql(a)){n.iterator=a[Symbol.iterator]()}else{return{done:false,value:a}}}}while(n.iterator);return kt})}flat(e){if(e===void 0){e=1}if(e<=0){return this}const n=e>1?this.flat(e-1):this;return new Je(()=>({this:n.startFn()}),r=>{do{if(r.iterator){const s=r.iterator.next();if(s.done){r.iterator=void 0}else{return s}}const{done:i,value:a}=n.nextFn(r.this);if(!i){if(Ql(a)){r.iterator=a[Symbol.iterator]()}else{return{done:false,value:a}}}}while(r.iterator);return kt})}head(){const e=this.iterator();const n=e.next();if(n.done){return void 0}return n.value}tail(e=1){return new Je(()=>{const n=this.startFn();for(let r=0;r<e;r++){const i=this.nextFn(n);if(i.done){return n}}return n},this.nextFn)}limit(e){return new Je(()=>({size:0,state:this.startFn()}),n=>{n.size++;if(n.size>e){return kt}return this.nextFn(n.state)})}distinct(e){return new Je(()=>({set:new Set,internalState:this.startFn()}),n=>{let r;do{r=this.nextFn(n.internalState);if(!r.done){const i=e?e(r.value):r.value;if(!n.set.has(i)){n.set.add(i);return r}}}while(!r.done);return kt})}exclude(e,n){const r=new Set;for(const i of e){const a=n?n(i):i;r.add(a)}return this.filter(i=>{const a=n?n(i):i;return!r.has(a)})}}function rv(t){if(typeof t==="string"){return t}if(typeof t==="undefined"){return"undefined"}if(typeof t.toString==="function"){return t.toString()}return Object.prototype.toString.call(t)}function Ql(t){return!!t&&typeof t[Symbol.iterator]==="function"}const ug=new Je(()=>void 0,()=>kt);const kt=Object.freeze({done:true,value:void 0});function be(...t){if(t.length===1){const e=t[0];if(e instanceof Je){return e}if(Ql(e)){return new Je(()=>e[Symbol.iterator](),n=>n.next())}if(typeof e.length==="number"){return new Je(()=>({index:0}),n=>{if(n.index<e.length){return{done:false,value:e[n.index++]}}else{return kt}})}}if(t.length>1){return new Je(()=>({collIndex:0,arrIndex:0}),e=>{do{if(e.iterator){const n=e.iterator.next();if(!n.done){return n}e.iterator=void 0}if(e.array){if(e.arrIndex<e.array.length){return{done:false,value:e.array[e.arrIndex++]}}e.array=void 0;e.arrIndex=0}if(e.collIndex<t.length){const n=t[e.collIndex++];if(Ql(n)){e.iterator=n[Symbol.iterator]()}else if(n&&typeof n.length==="number"){e.array=n}}}while(e.iterator||e.array||e.collIndex<t.length);return kt})}return ug}class Zl extends Je{constructor(e,n,r){super(()=>({iterators:(r===null||r===void 0?void 0:r.includeRoot)?[[e][Symbol.iterator]()]:[n(e)[Symbol.iterator]()],pruned:false}),i=>{if(i.pruned){i.iterators.pop();i.pruned=false}while(i.iterators.length>0){const a=i.iterators[i.iterators.length-1];const s=a.next();if(s.done){i.iterators.pop()}else{i.iterators.push(n(s.value)[Symbol.iterator]());return s}}return kt})}iterator(){const e={state:this.startFn(),next:()=>this.nextFn(e.state),prune:()=>{e.state.pruned=true},[Symbol.iterator]:()=>e};return e}}var Ad;(function(t){function e(a){return a.reduce((s,o)=>s+o,0)}t.sum=e;function n(a){return a.reduce((s,o)=>s*o,0)}t.product=n;function r(a){return a.reduce((s,o)=>Math.min(s,o))}t.min=r;function i(a){return a.reduce((s,o)=>Math.max(s,o))}t.max=i})(Ad||(Ad={}));function eu(t){return new Zl(t,e=>{if(hr(e)){return e.content}else{return[]}},{includeRoot:true})}function iv(t){return eu(t).filter(Ba)}function av(t,e){while(t.container){t=t.container;if(t===e){return true}}return false}function bd(t){return{start:{character:t.startColumn-1,line:t.startLine-1},end:{character:t.endColumn,line:t.endLine-1}}}function tu(t){if(!t){return void 0}const{offset:e,end:n,range:r}=t;return{range:r,offset:e,end:n,length:n-e}}var Cn;(function(t){t[t["Before"]=0]="Before";t[t["After"]=1]="After";t[t["OverlapFront"]=2]="OverlapFront";t[t["OverlapBack"]=3]="OverlapBack";t[t["Inside"]=4]="Inside";t[t["Outside"]=5]="Outside"})(Cn||(Cn={}));function sv(t,e){if(t.end.line<e.start.line||t.end.line===e.start.line&&t.end.character<=e.start.character){return Cn.Before}else if(t.start.line>e.end.line||t.start.line===e.end.line&&t.start.character>=e.end.character){return Cn.After}const n=t.start.line>e.start.line||t.start.line===e.start.line&&t.start.character>=e.start.character;const r=t.end.line<e.end.line||t.end.line===e.end.line&&t.end.character<=e.end.character;if(n&&r){return Cn.Inside}else if(n){return Cn.OverlapBack}else if(r){return Cn.OverlapFront}else{return Cn.Outside}}function cg(t,e){const n=sv(t,e);return n>Cn.After}const dg=/^[\w\p{L}]$/u;function yr(t,e,n=dg){if(t){if(e>0){const r=e-t.offset;const i=t.text.charAt(r);if(!n.test(i)){e--}}return fg(t,e)}return void 0}function ov(t,e){if(t){const n=lv(t,true);if(n&&Bp(n,e)){return n}if(lg(t)){const r=t.content.findIndex(i=>!i.hidden);for(let i=r-1;i>=0;i--){const a=t.content[i];if(Bp(a,e)){return a}}}}return void 0}function Bp(t,e){return Ba(t)&&e.includes(t.tokenType.name)}function fg(t,e){if(Ba(t)){return t}else if(hr(t)){const n=pg(t,e,false);if(n){return fg(n,e)}}return void 0}function kd(t,e){if(Ba(t)){return t}else if(hr(t)){const n=pg(t,e,true);if(n){return kd(n,e)}}return void 0}function pg(t,e,n){let r=0;let i=t.content.length-1;let a=void 0;while(r<=i){const s=Math.floor((r+i)/2);const o=t.content[s];if(o.offset<=e&&o.end>e){return o}if(o.end<=e){a=n?o:void 0;r=s+1}else{i=s-1}}return a}function lv(t,e=true){while(t.container){const n=t.container;let r=n.content.indexOf(t);while(r>0){r--;const i=n.content[r];if(e||!i.hidden){return i}}t=n}return void 0}class mg extends Error{constructor(e,n){super(e?`${n} at ${e.range.start.line}:${e.range.start.character}`:n)}}function Wa(t){throw new Error("Error! The input value was not handled.")}const Ts="AbstractRule";const ws="AbstractType";const rc="Condition";const Wp="TypeDefinition";const ic="ValueLiteral";const Ki="AbstractElement";function hg(t){return ue.isInstance(t,Ki)}const Es="ArrayLiteral";const Cs="ArrayType";const Fi="BooleanLiteral";function uv(t){return ue.isInstance(t,Fi)}const Ui="Conjunction";function cv(t){return ue.isInstance(t,Ui)}const Gi="Disjunction";function dv(t){return ue.isInstance(t,Gi)}const Ss="Grammar";const ac="GrammarImport";const Hi="InferredType";function yg(t){return ue.isInstance(t,Hi)}const qi="Interface";function gg(t){return ue.isInstance(t,qi)}const sc="NamedArgument";const ji="Negation";function fv(t){return ue.isInstance(t,ji)}const As="NumberLiteral";const bs="Parameter";const Bi="ParameterReference";function pv(t){return ue.isInstance(t,Bi)}const Wi="ParserRule";function it(t){return ue.isInstance(t,Wi)}const ks="ReferenceType";const xl="ReturnType";function mv(t){return ue.isInstance(t,xl)}const Vi="SimpleType";function hv(t){return ue.isInstance(t,Vi)}const Ns="StringLiteral";const Dr="TerminalRule";function Yn(t){return ue.isInstance(t,Dr)}const zi="Type";function Rg(t){return ue.isInstance(t,zi)}const oc="TypeAttribute";const Ps="UnionType";const Xi="Action";function Va(t){return ue.isInstance(t,Xi)}const Yi="Alternatives";function ep(t){return ue.isInstance(t,Yi)}const Ji="Assignment";function an(t){return ue.isInstance(t,Ji)}const Qi="CharacterRange";function yv(t){return ue.isInstance(t,Qi)}const Zi="CrossReference";function za(t){return ue.isInstance(t,Zi)}const ea="EndOfFile";function gv(t){return ue.isInstance(t,ea)}const ta="Group";function gr(t){return ue.isInstance(t,ta)}const na="Keyword";function sn(t){return ue.isInstance(t,na)}const ra="NegatedToken";function Rv(t){return ue.isInstance(t,ra)}const ia="RegexToken";function $v(t){return ue.isInstance(t,ia)}const aa="RuleCall";function Dn(t){return ue.isInstance(t,aa)}const sa="TerminalAlternatives";function vv(t){return ue.isInstance(t,sa)}const oa="TerminalGroup";function Tv(t){return ue.isInstance(t,oa)}const la="TerminalRuleCall";function wv(t){return ue.isInstance(t,la)}const ua="UnorderedGroup";function tp(t){return ue.isInstance(t,ua)}const ca="UntilToken";function Ev(t){return ue.isInstance(t,ca)}const da="Wildcard";function Cv(t){return ue.isInstance(t,da)}class $g extends og{getAllTypes(){return[Ki,Ts,ws,Xi,Yi,Es,Cs,Ji,Fi,Qi,rc,Ui,Zi,Gi,ea,Ss,ac,ta,Hi,qi,na,sc,ra,ji,As,bs,Bi,Wi,ks,ia,xl,aa,Vi,Ns,sa,oa,Dr,la,zi,oc,Wp,Ps,ua,ca,ic,da]}computeIsSubtype(e,n){switch(e){case Xi:case Yi:case Ji:case Qi:case Zi:case ea:case ta:case na:case ra:case ia:case aa:case sa:case oa:case la:case ua:case ca:case da:{return this.isSubtype(Ki,n)}case Es:case As:case Ns:{return this.isSubtype(ic,n)}case Cs:case ks:case Vi:case Ps:{return this.isSubtype(Wp,n)}case Fi:{return this.isSubtype(rc,n)||this.isSubtype(ic,n)}case Ui:case Gi:case ji:case Bi:{return this.isSubtype(rc,n)}case Hi:case qi:case zi:{return this.isSubtype(ws,n)}case Wi:{return this.isSubtype(Ts,n)||this.isSubtype(ws,n)}case Dr:{return this.isSubtype(Ts,n)}default:{return false}}}getReferenceType(e){const n=`${e.container.$type}:${e.property}`;switch(n){case"Action:type":case"CrossReference:type":case"Interface:superTypes":case"ParserRule:returnType":case"SimpleType:typeRef":{return ws}case"Grammar:hiddenTokens":case"ParserRule:hiddenTokens":case"RuleCall:rule":{return Ts}case"Grammar:usedGrammars":{return Ss}case"NamedArgument:parameter":case"ParameterReference:parameter":{return bs}case"TerminalRuleCall:rule":{return Dr}default:{throw new Error(`${n} is not a valid reference id.`)}}}getTypeMetaData(e){switch(e){case Ki:{return{name:Ki,properties:[{name:"cardinality"},{name:"lookahead"}]}}case Es:{return{name:Es,properties:[{name:"elements",defaultValue:[]}]}}case Cs:{return{name:Cs,properties:[{name:"elementType"}]}}case Fi:{return{name:Fi,properties:[{name:"true",defaultValue:false}]}}case Ui:{return{name:Ui,properties:[{name:"left"},{name:"right"}]}}case Gi:{return{name:Gi,properties:[{name:"left"},{name:"right"}]}}case Ss:{return{name:Ss,properties:[{name:"definesHiddenTokens",defaultValue:false},{name:"hiddenTokens",defaultValue:[]},{name:"imports",defaultValue:[]},{name:"interfaces",defaultValue:[]},{name:"isDeclared",defaultValue:false},{name:"name"},{name:"rules",defaultValue:[]},{name:"types",defaultValue:[]},{name:"usedGrammars",defaultValue:[]}]}}case ac:{return{name:ac,properties:[{name:"path"}]}}case Hi:{return{name:Hi,properties:[{name:"name"}]}}case qi:{return{name:qi,properties:[{name:"attributes",defaultValue:[]},{name:"name"},{name:"superTypes",defaultValue:[]}]}}case sc:{return{name:sc,properties:[{name:"calledByName",defaultValue:false},{name:"parameter"},{name:"value"}]}}case ji:{return{name:ji,properties:[{name:"value"}]}}case As:{return{name:As,properties:[{name:"value"}]}}case bs:{return{name:bs,properties:[{name:"name"}]}}case Bi:{return{name:Bi,properties:[{name:"parameter"}]}}case Wi:{return{name:Wi,properties:[{name:"dataType"},{name:"definesHiddenTokens",defaultValue:false},{name:"definition"},{name:"entry",defaultValue:false},{name:"fragment",defaultValue:false},{name:"hiddenTokens",defaultValue:[]},{name:"inferredType"},{name:"name"},{name:"parameters",defaultValue:[]},{name:"returnType"},{name:"wildcard",defaultValue:false}]}}case ks:{return{name:ks,properties:[{name:"referenceType"}]}}case xl:{return{name:xl,properties:[{name:"name"}]}}case Vi:{return{name:Vi,properties:[{name:"primitiveType"},{name:"stringType"},{name:"typeRef"}]}}case Ns:{return{name:Ns,properties:[{name:"value"}]}}case Dr:{return{name:Dr,properties:[{name:"definition"},{name:"fragment",defaultValue:false},{name:"hidden",defaultValue:false},{name:"name"},{name:"type"}]}}case zi:{return{name:zi,properties:[{name:"name"},{name:"type"}]}}case oc:{return{name:oc,properties:[{name:"defaultValue"},{name:"isOptional",defaultValue:false},{name:"name"},{name:"type"}]}}case Ps:{return{name:Ps,properties:[{name:"types",defaultValue:[]}]}}case Xi:{return{name:Xi,properties:[{name:"cardinality"},{name:"feature"},{name:"inferredType"},{name:"lookahead"},{name:"operator"},{name:"type"}]}}case Yi:{return{name:Yi,properties:[{name:"cardinality"},{name:"elements",defaultValue:[]},{name:"lookahead"}]}}case Ji:{return{name:Ji,properties:[{name:"cardinality"},{name:"feature"},{name:"lookahead"},{name:"operator"},{name:"terminal"}]}}case Qi:{return{name:Qi,properties:[{name:"cardinality"},{name:"left"},{name:"lookahead"},{name:"right"}]}}case Zi:{return{name:Zi,properties:[{name:"cardinality"},{name:"deprecatedSyntax",defaultValue:false},{name:"lookahead"},{name:"terminal"},{name:"type"}]}}case ea:{return{name:ea,properties:[{name:"cardinality"},{name:"lookahead"}]}}case ta:{return{name:ta,properties:[{name:"cardinality"},{name:"elements",defaultValue:[]},{name:"guardCondition"},{name:"lookahead"}]}}case na:{return{name:na,properties:[{name:"cardinality"},{name:"lookahead"},{name:"value"}]}}case ra:{return{name:ra,properties:[{name:"cardinality"},{name:"lookahead"},{name:"terminal"}]}}case ia:{return{name:ia,properties:[{name:"cardinality"},{name:"lookahead"},{name:"regex"}]}}case aa:{return{name:aa,properties:[{name:"arguments",defaultValue:[]},{name:"cardinality"},{name:"lookahead"},{name:"rule"}]}}case sa:{return{name:sa,properties:[{name:"cardinality"},{name:"elements",defaultValue:[]},{name:"lookahead"}]}}case oa:{return{name:oa,properties:[{name:"cardinality"},{name:"elements",defaultValue:[]},{name:"lookahead"}]}}case la:{return{name:la,properties:[{name:"cardinality"},{name:"lookahead"},{name:"rule"}]}}case ua:{return{name:ua,properties:[{name:"cardinality"},{name:"elements",defaultValue:[]},{name:"lookahead"}]}}case ca:{return{name:ca,properties:[{name:"cardinality"},{name:"lookahead"},{name:"terminal"}]}}case da:{return{name:da,properties:[{name:"cardinality"},{name:"lookahead"}]}}default:{return{name:e,properties:[]}}}}}const ue=new $g;function Sv(t){for(const[e,n]of Object.entries(t)){if(!e.startsWith("$")){if(Array.isArray(n)){n.forEach((r,i)=>{if(Ze(r)){r.$container=t;r.$containerProperty=e;r.$containerIndex=i}})}else if(Ze(n)){n.$container=t;n.$containerProperty=e}}}}function Nn(t,e){let n=t;while(n){if(e(n)){return n}n=n.$container}return void 0}function ct(t){const e=nu(t);const n=e.$document;if(!n){throw new Error("AST node has no document.")}return n}function nu(t){while(t.$container){t=t.$container}return t}function Ou(t,e){if(!t){throw new Error("Node must be an AstNode.")}const n=e===null||e===void 0?void 0:e.range;return new Je(()=>({keys:Object.keys(t),keyIndex:0,arrayIndex:0}),r=>{while(r.keyIndex<r.keys.length){const i=r.keys[r.keyIndex];if(!i.startsWith("$")){const a=t[i];if(Ze(a)){r.keyIndex++;if(Nd(a,n)){return{done:false,value:a}}}else if(Array.isArray(a)){while(r.arrayIndex<a.length){const s=r.arrayIndex++;const o=a[s];if(Ze(o)&&Nd(o,n)){return{done:false,value:o}}}r.arrayIndex=0}}r.keyIndex++}return kt})}function Er(t,e){if(!t){throw new Error("Root node must be an AstNode.")}return new Zl(t,n=>Ou(n,e))}function Bn(t,e){if(!t){throw new Error("Root node must be an AstNode.")}else if((e===null||e===void 0?void 0:e.range)&&!Nd(t,e.range)){return new Zl(t,()=>[])}return new Zl(t,n=>Ou(n,e),{includeRoot:true})}function Nd(t,e){var n;if(!e){return true}const r=(n=t.$cstNode)===null||n===void 0?void 0:n.range;if(!r){return false}return cg(r,e)}function vg(t){return new Je(()=>({keys:Object.keys(t),keyIndex:0,arrayIndex:0}),e=>{while(e.keyIndex<e.keys.length){const n=e.keys[e.keyIndex];if(!n.startsWith("$")){const r=t[n];if(tn(r)){e.keyIndex++;return{done:false,value:{reference:r,container:t,property:n}}}else if(Array.isArray(r)){while(e.arrayIndex<r.length){const i=e.arrayIndex++;const a=r[i];if(tn(a)){return{done:false,value:{reference:a,container:t,property:n,index:i}}}}e.arrayIndex=0}}e.keyIndex++}return kt})}function Tg(t,e){const n=t.getTypeMetaData(e.$type);const r=e;for(const i of n.properties){if(i.defaultValue!==void 0&&r[i.name]===void 0){r[i.name]=wg(i.defaultValue)}}}function wg(t){if(Array.isArray(t)){return[...t.map(wg)]}else{return t}}function Z(t){return t.charCodeAt(0)}function lc(t,e){if(Array.isArray(t)){t.forEach(function(n){e.push(n)})}else{e.push(t)}}function ei(t,e){if(t[e]===true){throw"duplicate flag "+e}t[e];t[e]=true}function _r(t){if(t===void 0){throw Error("Internal Error - Should never get here!")}return true}function Av(){throw Error("Internal Error - Should never get here!")}function Vp(t){return t["type"]==="Character"}const ru=[];for(let t=Z("0");t<=Z("9");t++){ru.push(t)}const iu=[Z("_")].concat(ru);for(let t=Z("a");t<=Z("z");t++){iu.push(t)}for(let t=Z("A");t<=Z("Z");t++){iu.push(t)}const zp=[Z(" "),Z("\f"),Z("\n"),Z("\r"),Z("	"),Z("\v"),Z("	"),Z(" "),Z(" "),Z(" "),Z(" "),Z(" "),Z(" "),Z(" "),Z(" "),Z(" "),Z(" "),Z(" "),Z(" "),Z(" "),Z("\u2028"),Z("\u2029"),Z(" "),Z(" "),Z("　"),Z("\uFEFF")];const bv=/[0-9a-fA-F]/;const _s=/[0-9]/;const kv=/[1-9]/;class Eg{constructor(){this.idx=0;this.input="";this.groupIdx=0}saveState(){return{idx:this.idx,input:this.input,groupIdx:this.groupIdx}}restoreState(e){this.idx=e.idx;this.input=e.input;this.groupIdx=e.groupIdx}pattern(e){this.idx=0;this.input=e;this.groupIdx=0;this.consumeChar("/");const n=this.disjunction();this.consumeChar("/");const r={type:"Flags",loc:{begin:this.idx,end:e.length},global:false,ignoreCase:false,multiLine:false,unicode:false,sticky:false};while(this.isRegExpFlag()){switch(this.popChar()){case"g":ei(r,"global");break;case"i":ei(r,"ignoreCase");break;case"m":ei(r,"multiLine");break;case"u":ei(r,"unicode");break;case"y":ei(r,"sticky");break}}if(this.idx!==this.input.length){throw Error("Redundant input: "+this.input.substring(this.idx))}return{type:"Pattern",flags:r,value:n,loc:this.loc(0)}}disjunction(){const e=[];const n=this.idx;e.push(this.alternative());while(this.peekChar()==="|"){this.consumeChar("|");e.push(this.alternative())}return{type:"Disjunction",value:e,loc:this.loc(n)}}alternative(){const e=[];const n=this.idx;while(this.isTerm()){e.push(this.term())}return{type:"Alternative",value:e,loc:this.loc(n)}}term(){if(this.isAssertion()){return this.assertion()}else{return this.atom()}}assertion(){const e=this.idx;switch(this.popChar()){case"^":return{type:"StartAnchor",loc:this.loc(e)};case"$":return{type:"EndAnchor",loc:this.loc(e)};case"\\":switch(this.popChar()){case"b":return{type:"WordBoundary",loc:this.loc(e)};case"B":return{type:"NonWordBoundary",loc:this.loc(e)}}throw Error("Invalid Assertion Escape");case"(":this.consumeChar("?");let n;switch(this.popChar()){case"=":n="Lookahead";break;case"!":n="NegativeLookahead";break}_r(n);const r=this.disjunction();this.consumeChar(")");return{type:n,value:r,loc:this.loc(e)}}return Av()}quantifier(e=false){let n=void 0;const r=this.idx;switch(this.popChar()){case"*":n={atLeast:0,atMost:Infinity};break;case"+":n={atLeast:1,atMost:Infinity};break;case"?":n={atLeast:0,atMost:1};break;case"{":const i=this.integerIncludingZero();switch(this.popChar()){case"}":n={atLeast:i,atMost:i};break;case",":let a;if(this.isDigit()){a=this.integerIncludingZero();n={atLeast:i,atMost:a}}else{n={atLeast:i,atMost:Infinity}}this.consumeChar("}");break}if(e===true&&n===void 0){return void 0}_r(n);break}if(e===true&&n===void 0){return void 0}if(_r(n)){if(this.peekChar(0)==="?"){this.consumeChar("?");n.greedy=false}else{n.greedy=true}n.type="Quantifier";n.loc=this.loc(r);return n}}atom(){let e;const n=this.idx;switch(this.peekChar()){case".":e=this.dotAll();break;case"\\":e=this.atomEscape();break;case"[":e=this.characterClass();break;case"(":e=this.group();break}if(e===void 0&&this.isPatternCharacter()){e=this.patternCharacter()}if(_r(e)){e.loc=this.loc(n);if(this.isQuantifier()){e.quantifier=this.quantifier()}return e}}dotAll(){this.consumeChar(".");return{type:"Set",complement:true,value:[Z("\n"),Z("\r"),Z("\u2028"),Z("\u2029")]}}atomEscape(){this.consumeChar("\\");switch(this.peekChar()){case"1":case"2":case"3":case"4":case"5":case"6":case"7":case"8":case"9":return this.decimalEscapeAtom();case"d":case"D":case"s":case"S":case"w":case"W":return this.characterClassEscape();case"f":case"n":case"r":case"t":case"v":return this.controlEscapeAtom();case"c":return this.controlLetterEscapeAtom();case"0":return this.nulCharacterAtom();case"x":return this.hexEscapeSequenceAtom();case"u":return this.regExpUnicodeEscapeSequenceAtom();default:return this.identityEscapeAtom()}}decimalEscapeAtom(){const e=this.positiveInteger();return{type:"GroupBackReference",value:e}}characterClassEscape(){let e;let n=false;switch(this.popChar()){case"d":e=ru;break;case"D":e=ru;n=true;break;case"s":e=zp;break;case"S":e=zp;n=true;break;case"w":e=iu;break;case"W":e=iu;n=true;break}if(_r(e)){return{type:"Set",value:e,complement:n}}}controlEscapeAtom(){let e;switch(this.popChar()){case"f":e=Z("\f");break;case"n":e=Z("\n");break;case"r":e=Z("\r");break;case"t":e=Z("	");break;case"v":e=Z("\v");break}if(_r(e)){return{type:"Character",value:e}}}controlLetterEscapeAtom(){this.consumeChar("c");const e=this.popChar();if(/[a-zA-Z]/.test(e)===false){throw Error("Invalid ")}const n=e.toUpperCase().charCodeAt(0)-64;return{type:"Character",value:n}}nulCharacterAtom(){this.consumeChar("0");return{type:"Character",value:Z("\0")}}hexEscapeSequenceAtom(){this.consumeChar("x");return this.parseHexDigits(2)}regExpUnicodeEscapeSequenceAtom(){this.consumeChar("u");return this.parseHexDigits(4)}identityEscapeAtom(){const e=this.popChar();return{type:"Character",value:Z(e)}}classPatternCharacterAtom(){switch(this.peekChar()){case"\n":case"\r":case"\u2028":case"\u2029":case"\\":case"]":throw Error("TBD");default:const e=this.popChar();return{type:"Character",value:Z(e)}}}characterClass(){const e=[];let n=false;this.consumeChar("[");if(this.peekChar(0)==="^"){this.consumeChar("^");n=true}while(this.isClassAtom()){const r=this.classAtom();r.type==="Character";if(Vp(r)&&this.isRangeDash()){this.consumeChar("-");const i=this.classAtom();i.type==="Character";if(Vp(i)){if(i.value<r.value){throw Error("Range out of order in character class")}e.push({from:r.value,to:i.value})}else{lc(r.value,e);e.push(Z("-"));lc(i.value,e)}}else{lc(r.value,e)}}this.consumeChar("]");return{type:"Set",complement:n,value:e}}classAtom(){switch(this.peekChar()){case"]":case"\n":case"\r":case"\u2028":case"\u2029":throw Error("TBD");case"\\":return this.classEscape();default:return this.classPatternCharacterAtom()}}classEscape(){this.consumeChar("\\");switch(this.peekChar()){case"b":this.consumeChar("b");return{type:"Character",value:Z("\b")};case"d":case"D":case"s":case"S":case"w":case"W":return this.characterClassEscape();case"f":case"n":case"r":case"t":case"v":return this.controlEscapeAtom();case"c":return this.controlLetterEscapeAtom();case"0":return this.nulCharacterAtom();case"x":return this.hexEscapeSequenceAtom();case"u":return this.regExpUnicodeEscapeSequenceAtom();default:return this.identityEscapeAtom()}}group(){let e=true;this.consumeChar("(");switch(this.peekChar(0)){case"?":this.consumeChar("?");this.consumeChar(":");e=false;break;default:this.groupIdx++;break}const n=this.disjunction();this.consumeChar(")");const r={type:"Group",capturing:e,value:n};if(e){r["idx"]=this.groupIdx}return r}positiveInteger(){let e=this.popChar();if(kv.test(e)===false){throw Error("Expecting a positive integer")}while(_s.test(this.peekChar(0))){e+=this.popChar()}return parseInt(e,10)}integerIncludingZero(){let e=this.popChar();if(_s.test(e)===false){throw Error("Expecting an integer")}while(_s.test(this.peekChar(0))){e+=this.popChar()}return parseInt(e,10)}patternCharacter(){const e=this.popChar();switch(e){case"\n":case"\r":case"\u2028":case"\u2029":case"^":case"$":case"\\":case".":case"*":case"+":case"?":case"(":case")":case"[":case"|":throw Error("TBD");default:return{type:"Character",value:Z(e)}}}isRegExpFlag(){switch(this.peekChar(0)){case"g":case"i":case"m":case"u":case"y":return true;default:return false}}isRangeDash(){return this.peekChar()==="-"&&this.isClassAtom(1)}isDigit(){return _s.test(this.peekChar(0))}isClassAtom(e=0){switch(this.peekChar(e)){case"]":case"\n":case"\r":case"\u2028":case"\u2029":return false;default:return true}}isTerm(){return this.isAtom()||this.isAssertion()}isAtom(){if(this.isPatternCharacter()){return true}switch(this.peekChar(0)){case".":case"\\":case"[":case"(":return true;default:return false}}isAssertion(){switch(this.peekChar(0)){case"^":case"$":return true;case"\\":switch(this.peekChar(1)){case"b":case"B":return true;default:return false}case"(":return this.peekChar(1)==="?"&&(this.peekChar(2)==="="||this.peekChar(2)==="!");default:return false}}isQuantifier(){const e=this.saveState();try{return this.quantifier(true)!==void 0}catch(n){return false}finally{this.restoreState(e)}}isPatternCharacter(){switch(this.peekChar()){case"^":case"$":case"\\":case".":case"*":case"+":case"?":case"(":case")":case"[":case"|":case"/":case"\n":case"\r":case"\u2028":case"\u2029":return false;default:return true}}parseHexDigits(e){let n="";for(let i=0;i<e;i++){const a=this.popChar();if(bv.test(a)===false){throw Error("Expecting a HexDecimal digits")}n+=a}const r=parseInt(n,16);return{type:"Character",value:r}}peekChar(e=0){return this.input[this.idx+e]}popChar(){const e=this.peekChar(0);this.consumeChar(void 0);return e}consumeChar(e){if(e!==void 0&&this.input[this.idx]!==e){throw Error("Expected: '"+e+"' but found: '"+this.input[this.idx]+"' at offset: "+this.idx)}if(this.idx>=this.input.length){throw Error("Unexpected end of input")}this.idx++}loc(e){return{begin:e,end:this.idx}}}class Lu{visitChildren(e){for(const n in e){const r=e[n];if(e.hasOwnProperty(n)){if(r.type!==void 0){this.visit(r)}else if(Array.isArray(r)){r.forEach(i=>{this.visit(i)},this)}}}}visit(e){switch(e.type){case"Pattern":this.visitPattern(e);break;case"Flags":this.visitFlags(e);break;case"Disjunction":this.visitDisjunction(e);break;case"Alternative":this.visitAlternative(e);break;case"StartAnchor":this.visitStartAnchor(e);break;case"EndAnchor":this.visitEndAnchor(e);break;case"WordBoundary":this.visitWordBoundary(e);break;case"NonWordBoundary":this.visitNonWordBoundary(e);break;case"Lookahead":this.visitLookahead(e);break;case"NegativeLookahead":this.visitNegativeLookahead(e);break;case"Character":this.visitCharacter(e);break;case"Set":this.visitSet(e);break;case"Group":this.visitGroup(e);break;case"GroupBackReference":this.visitGroupBackReference(e);break;case"Quantifier":this.visitQuantifier(e);break}this.visitChildren(e)}visitPattern(e){}visitFlags(e){}visitDisjunction(e){}visitAlternative(e){}visitStartAnchor(e){}visitEndAnchor(e){}visitWordBoundary(e){}visitNonWordBoundary(e){}visitLookahead(e){}visitNegativeLookahead(e){}visitCharacter(e){}visitSet(e){}visitGroup(e){}visitGroupBackReference(e){}visitQuantifier(e){}}const Nv=/\r?\n/gm;const Pv=new Eg;class _v extends Lu{constructor(){super(...arguments);this.isStarting=true;this.endRegexpStack=[];this.multiline=false}get endRegex(){return this.endRegexpStack.join("")}reset(e){this.multiline=false;this.regex=e;this.startRegexp="";this.isStarting=true;this.endRegexpStack=[]}visitGroup(e){if(e.quantifier){this.isStarting=false;this.endRegexpStack=[]}}visitCharacter(e){const n=String.fromCharCode(e.value);if(!this.multiline&&n==="\n"){this.multiline=true}if(e.quantifier){this.isStarting=false;this.endRegexpStack=[]}else{const r=xu(n);this.endRegexpStack.push(r);if(this.isStarting){this.startRegexp+=r}}}visitSet(e){if(!this.multiline){const n=this.regex.substring(e.loc.begin,e.loc.end);const r=new RegExp(n);this.multiline=Boolean("\n".match(r))}if(e.quantifier){this.isStarting=false;this.endRegexpStack=[]}else{const n=this.regex.substring(e.loc.begin,e.loc.end);this.endRegexpStack.push(n);if(this.isStarting){this.startRegexp+=n}}}visitChildren(e){if(e.type==="Group"){const n=e;if(n.quantifier){return}}super.visitChildren(e)}}const uc=new _v;function Dv(t){try{if(typeof t==="string"){t=new RegExp(t)}t=t.toString();uc.reset(t);uc.visit(Pv.pattern(t));return uc.multiline}catch(e){return false}}const Iv="\f\n\r	\v              \u2028\u2029  　\uFEFF".split("");function au(t){const e=typeof t==="string"?new RegExp(t):t;return Iv.some(n=>e.test(n))}function xu(t){return t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function Ov(t){return Array.prototype.map.call(t,e=>/\w/.test(e)?`[${e.toLowerCase()}${e.toUpperCase()}]`:xu(e)).join("")}function Lv(t,e){const n=xv(t);const r=e.match(n);return!!r&&r[0].length>0}function xv(t){if(typeof t==="string"){t=new RegExp(t)}const e=t,n=t.source;let r=0;function i(){let a="",s;function o(u){a+=n.substr(r,u);r+=u}function l(u){a+="(?:"+n.substr(r,u)+"|$)";r+=u}while(r<n.length){switch(n[r]){case"\\":switch(n[r+1]){case"c":l(3);break;case"x":l(4);break;case"u":if(e.unicode){if(n[r+2]==="{"){l(n.indexOf("}",r)-r+1)}else{l(6)}}else{l(2)}break;case"p":case"P":if(e.unicode){l(n.indexOf("}",r)-r+1)}else{l(2)}break;case"k":l(n.indexOf(">",r)-r+1);break;default:l(2);break}break;case"[":s=/\[(?:\\.|.)*?\]/g;s.lastIndex=r;s=s.exec(n)||[];l(s[0].length);break;case"|":case"^":case"$":case"*":case"+":case"?":o(1);break;case"{":s=/\{\d+,?\d*\}/g;s.lastIndex=r;s=s.exec(n);if(s){o(s[0].length)}else{l(1)}break;case"(":if(n[r+1]==="?"){switch(n[r+2]){case":":a+="(?:";r+=3;a+=i()+"|$)";break;case"=":a+="(?=";r+=3;a+=i()+")";break;case"!":s=r;r+=3;i();a+=n.substr(s,r-s);break;case"<":switch(n[r+3]){case"=":case"!":s=r;r+=4;i();a+=n.substr(s,r-s);break;default:o(n.indexOf(">",r)-r+1);a+=i()+"|$)";break}break}}else{o(1);a+=i()+"|$)"}break;case")":++r;return a;default:l(1);break}}return a}return new RegExp(i(),t.flags)}function Pd(t){return t.rules.find(e=>it(e)&&e.entry)}function Mv(t){return t.rules.filter(e=>Yn(e)&&e.hidden)}function np(t,e){const n=new Set;const r=Pd(t);if(!r){return new Set(t.rules)}const i=[r].concat(Mv(t));for(const s of i){Cg(s,n,e)}const a=new Set;for(const s of t.rules){if(n.has(s.name)||Yn(s)&&s.hidden){a.add(s)}}return a}function Cg(t,e,n){e.add(t.name);Er(t).forEach(r=>{if(Dn(r)||n){const i=r.rule.ref;if(i&&!e.has(i.name)){Cg(i,e,n)}}})}function Sg(t){if(t.terminal){return t.terminal}else if(t.type.ref){const e=Ng(t.type.ref);return e===null||e===void 0?void 0:e.terminal}return void 0}function Kv(t){return t.hidden&&!au(Ku(t))}function Ag(t,e){if(!t||!e){return[]}return ip(t,e,t.astNode,true)}function rp(t,e,n){if(!t||!e){return void 0}const r=ip(t,e,t.astNode,true);if(r.length===0){return void 0}if(n!==void 0){n=Math.max(0,Math.min(n,r.length-1))}else{n=0}return r[n]}function ip(t,e,n,r){if(!r){const i=Nn(t.grammarSource,an);if(i&&i.feature===e){return[t]}}if(hr(t)&&t.astNode===n){return t.content.flatMap(i=>ip(i,e,n,false))}return[]}function Fv(t,e){if(!t){return[]}return kg(t,e,t===null||t===void 0?void 0:t.astNode)}function bg(t,e,n){if(!t){return void 0}const r=kg(t,e,t===null||t===void 0?void 0:t.astNode);if(r.length===0){return void 0}if(n!==void 0){n=Math.max(0,Math.min(n,r.length-1))}else{n=0}return r[n]}function kg(t,e,n){if(t.astNode!==n){return[]}if(sn(t.grammarSource)&&t.grammarSource.value===e){return[t]}const r=eu(t).iterator();let i;const a=[];do{i=r.next();if(!i.done){const s=i.value;if(s.astNode===n){if(sn(s.grammarSource)&&s.grammarSource.value===e){a.push(s)}}else{r.prune()}}}while(!i.done);return a}function Uv(t){var e;const n=t.astNode;while(n===((e=t.container)===null||e===void 0?void 0:e.astNode)){const r=Nn(t.grammarSource,an);if(r){return r}t=t.container}return void 0}function Ng(t){let e=t;if(yg(e)){if(Va(e.$container)){e=e.$container.$container}else if(it(e.$container)){e=e.$container}else{Wa(e.$container)}}return Pg(t,e,new Map)}function Pg(t,e,n){var r;function i(a,s){let o=void 0;const l=Nn(a,an);if(!l){o=Pg(s,s,n)}n.set(t,o);return o}if(n.has(t)){return n.get(t)}n.set(t,void 0);for(const a of Er(e)){if(an(a)&&a.feature.toLowerCase()==="name"){n.set(t,a);return a}else if(Dn(a)&&it(a.rule.ref)){return i(a,a.rule.ref)}else if(hv(a)&&((r=a.typeRef)===null||r===void 0?void 0:r.ref)){return i(a,a.typeRef.ref)}}return void 0}function _a(t,e){return t==="?"||t==="*"||gr(e)&&Boolean(e.guardCondition)}function Gv(t){return t==="*"||t==="+"}function _g(t){return Dg(t,new Set)}function Dg(t,e){if(e.has(t)){return true}else{e.add(t)}for(const n of Er(t)){if(Dn(n)){if(!n.rule.ref){return false}if(it(n.rule.ref)&&!Dg(n.rule.ref,e)){return false}}else if(an(n)){return false}else if(Va(n)){return false}}return Boolean(t.definition)}function Xa(t){if(t.inferredType){return t.inferredType.name}else if(t.dataType){return t.dataType}else if(t.returnType){const e=t.returnType.ref;if(e){if(it(e)){return e.name}else if(gg(e)||Rg(e)){return e.name}}}return void 0}function Mu(t){var e;if(it(t)){return _g(t)?t.name:(e=Xa(t))!==null&&e!==void 0?e:t.name}else if(gg(t)||Rg(t)||mv(t)){return t.name}else if(Va(t)){const n=Hv(t);if(n){return n}}else if(yg(t)){return t.name}throw new Error("Cannot get name of Unknown Type")}function Hv(t){var e;if(t.inferredType){return t.inferredType.name}else if((e=t.type)===null||e===void 0?void 0:e.ref){return Mu(t.type.ref)}return void 0}function qv(t){var e,n,r;if(Yn(t)){return(n=(e=t.type)===null||e===void 0?void 0:e.name)!==null&&n!==void 0?n:"string"}else{return(r=Xa(t))!==null&&r!==void 0?r:t.name}}function Ku(t){const e={s:false,i:false,u:false};const n=Vr(t.definition,e);const r=Object.entries(e).filter(([,i])=>i).map(([i])=>i).join("");return new RegExp(n,r)}const ap=/[\s\S]/.source;function Vr(t,e){if(vv(t)){return jv(t)}else if(Tv(t)){return Bv(t)}else if(yv(t)){return zv(t)}else if(wv(t)){const n=t.rule.ref;if(!n){throw new Error("Missing rule reference.")}return Pn(Vr(n.definition),{cardinality:t.cardinality,lookahead:t.lookahead})}else if(Rv(t)){return Vv(t)}else if(Ev(t)){return Wv(t)}else if($v(t)){const n=t.regex.lastIndexOf("/");const r=t.regex.substring(1,n);const i=t.regex.substring(n+1);if(e){e.i=i.includes("i");e.s=i.includes("s");e.u=i.includes("u")}return Pn(r,{cardinality:t.cardinality,lookahead:t.lookahead,wrap:false})}else if(Cv(t)){return Pn(ap,{cardinality:t.cardinality,lookahead:t.lookahead})}else{throw new Error(`Invalid terminal element: ${t===null||t===void 0?void 0:t.$type}`)}}function jv(t){return Pn(t.elements.map(e=>Vr(e)).join("|"),{cardinality:t.cardinality,lookahead:t.lookahead})}function Bv(t){return Pn(t.elements.map(e=>Vr(e)).join(""),{cardinality:t.cardinality,lookahead:t.lookahead})}function Wv(t){return Pn(`${ap}*?${Vr(t.terminal)}`,{cardinality:t.cardinality,lookahead:t.lookahead})}function Vv(t){return Pn(`(?!${Vr(t.terminal)})${ap}*?`,{cardinality:t.cardinality,lookahead:t.lookahead})}function zv(t){if(t.right){return Pn(`[${cc(t.left)}-${cc(t.right)}]`,{cardinality:t.cardinality,lookahead:t.lookahead,wrap:false})}return Pn(cc(t.left),{cardinality:t.cardinality,lookahead:t.lookahead,wrap:false})}function cc(t){return xu(t.value)}function Pn(t,e){var n;if(e.wrap!==false||e.lookahead){t=`(${(n=e.lookahead)!==null&&n!==void 0?n:""}${t})`}if(e.cardinality){return`${t}${e.cardinality}`}return t}function Xv(t){const e=[];const n=t.Grammar;for(const r of n.rules){if(Yn(r)&&Kv(r)&&Dv(Ku(r))){e.push(r.name)}}return{multilineCommentRules:e,nameRegexp:dg}}var Ig=typeof global=="object"&&global&&global.Object===Object&&global;var Yv=typeof self=="object"&&self&&self.Object===Object&&self;var on=Ig||Yv||Function("return this")();var Ut=on.Symbol;var Og=Object.prototype;var Jv=Og.hasOwnProperty;var Qv=Og.toString;var ti=Ut?Ut.toStringTag:void 0;function Zv(t){var e=Jv.call(t,ti),n=t[ti];try{t[ti]=void 0;var r=true}catch(a){}var i=Qv.call(t);if(r){if(e){t[ti]=n}else{delete t[ti]}}return i}var eT=Object.prototype;var tT=eT.toString;function nT(t){return tT.call(t)}var rT="[object Null]";var iT="[object Undefined]";var Xp=Ut?Ut.toStringTag:void 0;function Jn(t){if(t==null){return t===void 0?iT:rT}return Xp&&Xp in Object(t)?Zv(t):nT(t)}function Vt(t){return t!=null&&typeof t=="object"}var aT="[object Symbol]";function Ya(t){return typeof t=="symbol"||Vt(t)&&Jn(t)==aT}function Fu(t,e){var n=-1,r=t==null?0:t.length,i=Array(r);while(++n<r){i[n]=e(t[n],n,t)}return i}var oe=Array.isArray;var Yp=Ut?Ut.prototype:void 0;var Jp=Yp?Yp.toString:void 0;function Lg(t){if(typeof t=="string"){return t}if(oe(t)){return Fu(t,Lg)+""}if(Ya(t)){return Jp?Jp.call(t):""}var e=t+"";return e=="0"&&1/t==-Infinity?"-0":e}var sT=/\s/;function oT(t){var e=t.length;while(e--&&sT.test(t.charAt(e))){}return e}var lT=/^\s+/;function uT(t){return t?t.slice(0,oT(t)+1).replace(lT,""):t}function Gt(t){var e=typeof t;return t!=null&&(e=="object"||e=="function")}var Qp=0/0;var cT=/^[-+]0x[0-9a-f]+$/i;var dT=/^0b[01]+$/i;var fT=/^0o[0-7]+$/i;var pT=parseInt;function mT(t){if(typeof t=="number"){return t}if(Ya(t)){return Qp}if(Gt(t)){var e=typeof t.valueOf=="function"?t.valueOf():t;t=Gt(e)?e+"":e}if(typeof t!="string"){return t===0?t:+t}t=uT(t);var n=dT.test(t);return n||fT.test(t)?pT(t.slice(2),n?2:8):cT.test(t)?Qp:+t}var hT=1/0;var yT=17976931348623157e292;function gT(t){if(!t){return t===0?t:0}t=mT(t);if(t===hT||t===-Infinity){var e=t<0?-1:1;return e*yT}return t===t?t:0}function Uu(t){var e=gT(t),n=e%1;return e===e?n?e-n:e:0}function Rr(t){return t}var RT="[object AsyncFunction]";var $T="[object Function]";var vT="[object GeneratorFunction]";var TT="[object Proxy]";function Mn(t){if(!Gt(t)){return false}var e=Jn(t);return e==$T||e==vT||e==RT||e==TT}var dc=on["__core-js_shared__"];var Zp=function(){var t=/[^.]+$/.exec(dc&&dc.keys&&dc.keys.IE_PROTO||"");return t?"Symbol(src)_1."+t:""}();function wT(t){return!!Zp&&Zp in t}var ET=Function.prototype;var CT=ET.toString;function Cr(t){if(t!=null){try{return CT.call(t)}catch(e){}try{return t+""}catch(e){}}return""}var ST=/[\\^$.*+?()[\]{}|]/g;var AT=/^\[object .+?Constructor\]$/;var bT=Function.prototype;var kT=Object.prototype;var NT=bT.toString;var PT=kT.hasOwnProperty;var _T=RegExp("^"+NT.call(PT).replace(ST,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");function DT(t){if(!Gt(t)||wT(t)){return false}var e=Mn(t)?_T:AT;return e.test(Cr(t))}function IT(t,e){return t==null?void 0:t[e]}function Sr(t,e){var n=IT(t,e);return DT(n)?n:void 0}var _d=Sr(on,"WeakMap");var em=Object.create;var OT=function(){function t(){}return function(e){if(!Gt(e)){return{}}if(em){return em(e)}t.prototype=e;var n=new t;t.prototype=void 0;return n}}();function LT(t,e,n){switch(n.length){case 0:return t.call(e);case 1:return t.call(e,n[0]);case 2:return t.call(e,n[0],n[1]);case 3:return t.call(e,n[0],n[1],n[2])}return t.apply(e,n)}function je(){}function xT(t,e){var n=-1,r=t.length;e||(e=Array(r));while(++n<r){e[n]=t[n]}return e}var MT=800;var KT=16;var FT=Date.now;function UT(t){var e=0,n=0;return function(){var r=FT(),i=KT-(r-n);n=r;if(i>0){if(++e>=MT){return arguments[0]}}else{e=0}return t.apply(void 0,arguments)}}function GT(t){return function(){return t}}var su=function(){try{var t=Sr(Object,"defineProperty");t({},"",{});return t}catch(e){}}();var HT=!su?Rr:function(t,e){return su(t,"toString",{"configurable":true,"enumerable":false,"value":GT(e),"writable":true})};var qT=UT(HT);function xg(t,e){var n=-1,r=t==null?0:t.length;while(++n<r){if(e(t[n],n,t)===false){break}}return t}function Mg(t,e,n,r){var i=t.length,a=n+-1;while(++a<i){if(e(t[a],a,t)){return a}}return-1}function jT(t){return t!==t}function BT(t,e,n){var r=n-1,i=t.length;while(++r<i){if(t[r]===e){return r}}return-1}function sp(t,e,n){return e===e?BT(t,e,n):Mg(t,jT,n)}function Kg(t,e){var n=t==null?0:t.length;return!!n&&sp(t,e,0)>-1}var WT=9007199254740991;var VT=/^(?:0|[1-9]\d*)$/;function Gu(t,e){var n=typeof t;e=e==null?WT:e;return!!e&&(n=="number"||n!="symbol"&&VT.test(t))&&(t>-1&&t%1==0&&t<e)}function op(t,e,n){if(e=="__proto__"&&su){su(t,e,{"configurable":true,"enumerable":true,"value":n,"writable":true})}else{t[e]=n}}function Ja(t,e){return t===e||t!==t&&e!==e}var zT=Object.prototype;var XT=zT.hasOwnProperty;function Hu(t,e,n){var r=t[e];if(!(XT.call(t,e)&&Ja(r,n))||n===void 0&&!(e in t)){op(t,e,n)}}function lp(t,e,n,r){var i=!n;n||(n={});var a=-1,s=e.length;while(++a<s){var o=e[a];var l=void 0;if(l===void 0){l=t[o]}if(i){op(n,o,l)}else{Hu(n,o,l)}}return n}var tm=Math.max;function YT(t,e,n){e=tm(e===void 0?t.length-1:e,0);return function(){var r=arguments,i=-1,a=tm(r.length-e,0),s=Array(a);while(++i<a){s[i]=r[e+i]}i=-1;var o=Array(e+1);while(++i<e){o[i]=r[i]}o[e]=n(s);return LT(t,this,o)}}function up(t,e){return qT(YT(t,e,Rr),t+"")}var JT=9007199254740991;function cp(t){return typeof t=="number"&&t>-1&&t%1==0&&t<=JT}function ln(t){return t!=null&&cp(t.length)&&!Mn(t)}function Fg(t,e,n){if(!Gt(n)){return false}var r=typeof e;if(r=="number"?ln(n)&&Gu(e,n.length):r=="string"&&e in n){return Ja(n[e],t)}return false}function QT(t){return up(function(e,n){var r=-1,i=n.length,a=i>1?n[i-1]:void 0,s=i>2?n[2]:void 0;a=t.length>3&&typeof a=="function"?(i--,a):void 0;if(s&&Fg(n[0],n[1],s)){a=i<3?void 0:a;i=1}e=Object(e);while(++r<i){var o=n[r];if(o){t(e,o,r,a)}}return e})}var ZT=Object.prototype;function Qa(t){var e=t&&t.constructor,n=typeof e=="function"&&e.prototype||ZT;return t===n}function ew(t,e){var n=-1,r=Array(t);while(++n<t){r[n]=e(n)}return r}var tw="[object Arguments]";function nm(t){return Vt(t)&&Jn(t)==tw}var Ug=Object.prototype;var nw=Ug.hasOwnProperty;var rw=Ug.propertyIsEnumerable;var qu=nm(function(){return arguments}())?nm:function(t){return Vt(t)&&nw.call(t,"callee")&&!rw.call(t,"callee")};function iw(){return false}var Gg=typeof Nt=="object"&&Nt&&!Nt.nodeType&&Nt;var rm=Gg&&typeof Pt=="object"&&Pt&&!Pt.nodeType&&Pt;var aw=rm&&rm.exports===Gg;var im=aw?on.Buffer:void 0;var sw=im?im.isBuffer:void 0;var Da=sw||iw;var ow="[object Arguments]";var lw="[object Array]";var uw="[object Boolean]";var cw="[object Date]";var dw="[object Error]";var fw="[object Function]";var pw="[object Map]";var mw="[object Number]";var hw="[object Object]";var yw="[object RegExp]";var gw="[object Set]";var Rw="[object String]";var $w="[object WeakMap]";var vw="[object ArrayBuffer]";var Tw="[object DataView]";var ww="[object Float32Array]";var Ew="[object Float64Array]";var Cw="[object Int8Array]";var Sw="[object Int16Array]";var Aw="[object Int32Array]";var bw="[object Uint8Array]";var kw="[object Uint8ClampedArray]";var Nw="[object Uint16Array]";var Pw="[object Uint32Array]";var ve={};ve[ww]=ve[Ew]=ve[Cw]=ve[Sw]=ve[Aw]=ve[bw]=ve[kw]=ve[Nw]=ve[Pw]=true;ve[ow]=ve[lw]=ve[vw]=ve[uw]=ve[Tw]=ve[cw]=ve[dw]=ve[fw]=ve[pw]=ve[mw]=ve[hw]=ve[yw]=ve[gw]=ve[Rw]=ve[$w]=false;function _w(t){return Vt(t)&&cp(t.length)&&!!ve[Jn(t)]}function ju(t){return function(e){return t(e)}}var Hg=typeof Nt=="object"&&Nt&&!Nt.nodeType&&Nt;var Na=Hg&&typeof Pt=="object"&&Pt&&!Pt.nodeType&&Pt;var Dw=Na&&Na.exports===Hg;var fc=Dw&&Ig.process;var Wn=function(){try{var t=Na&&Na.require&&Na.require("util").types;if(t){return t}return fc&&fc.binding&&fc.binding("util")}catch(e){}}();var am=Wn&&Wn.isTypedArray;var dp=am?ju(am):_w;var Iw=Object.prototype;var Ow=Iw.hasOwnProperty;function qg(t,e){var n=oe(t),r=!n&&qu(t),i=!n&&!r&&Da(t),a=!n&&!r&&!i&&dp(t),s=n||r||i||a,o=s?ew(t.length,String):[],l=o.length;for(var u in t){if((e||Ow.call(t,u))&&!(s&&(u=="length"||i&&(u=="offset"||u=="parent")||a&&(u=="buffer"||u=="byteLength"||u=="byteOffset")||Gu(u,l)))){o.push(u)}}return o}function jg(t,e){return function(n){return t(e(n))}}var Lw=jg(Object.keys,Object);var xw=Object.prototype;var Mw=xw.hasOwnProperty;function Bg(t){if(!Qa(t)){return Lw(t)}var e=[];for(var n in Object(t)){if(Mw.call(t,n)&&n!="constructor"){e.push(n)}}return e}function Ht(t){return ln(t)?qg(t):Bg(t)}var Kw=Object.prototype;var Fw=Kw.hasOwnProperty;var Dt=QT(function(t,e){if(Qa(e)||ln(e)){lp(e,Ht(e),t);return}for(var n in e){if(Fw.call(e,n)){Hu(t,n,e[n])}}});function Uw(t){var e=[];if(t!=null){for(var n in Object(t)){e.push(n)}}return e}var Gw=Object.prototype;var Hw=Gw.hasOwnProperty;function qw(t){if(!Gt(t)){return Uw(t)}var e=Qa(t),n=[];for(var r in t){if(!(r=="constructor"&&(e||!Hw.call(t,r)))){n.push(r)}}return n}function Wg(t){return ln(t)?qg(t,true):qw(t)}var jw=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;var Bw=/^\w*$/;function fp(t,e){if(oe(t)){return false}var n=typeof t;if(n=="number"||n=="symbol"||n=="boolean"||t==null||Ya(t)){return true}return Bw.test(t)||!jw.test(t)||e!=null&&t in Object(e)}var Ia=Sr(Object,"create");function Ww(){this.__data__=Ia?Ia(null):{};this.size=0}function Vw(t){var e=this.has(t)&&delete this.__data__[t];this.size-=e?1:0;return e}var zw="__lodash_hash_undefined__";var Xw=Object.prototype;var Yw=Xw.hasOwnProperty;function Jw(t){var e=this.__data__;if(Ia){var n=e[t];return n===zw?void 0:n}return Yw.call(e,t)?e[t]:void 0}var Qw=Object.prototype;var Zw=Qw.hasOwnProperty;function eE(t){var e=this.__data__;return Ia?e[t]!==void 0:Zw.call(e,t)}var tE="__lodash_hash_undefined__";function nE(t,e){var n=this.__data__;this.size+=this.has(t)?0:1;n[t]=Ia&&e===void 0?tE:e;return this}function $r(t){var e=-1,n=t==null?0:t.length;this.clear();while(++e<n){var r=t[e];this.set(r[0],r[1])}}$r.prototype.clear=Ww;$r.prototype["delete"]=Vw;$r.prototype.get=Jw;$r.prototype.has=eE;$r.prototype.set=nE;function rE(){this.__data__=[];this.size=0}function Bu(t,e){var n=t.length;while(n--){if(Ja(t[n][0],e)){return n}}return-1}var iE=Array.prototype;var aE=iE.splice;function sE(t){var e=this.__data__,n=Bu(e,t);if(n<0){return false}var r=e.length-1;if(n==r){e.pop()}else{aE.call(e,n,1)}--this.size;return true}function oE(t){var e=this.__data__,n=Bu(e,t);return n<0?void 0:e[n][1]}function lE(t){return Bu(this.__data__,t)>-1}function uE(t,e){var n=this.__data__,r=Bu(n,t);if(r<0){++this.size;n.push([t,e])}else{n[r][1]=e}return this}function Kn(t){var e=-1,n=t==null?0:t.length;this.clear();while(++e<n){var r=t[e];this.set(r[0],r[1])}}Kn.prototype.clear=rE;Kn.prototype["delete"]=sE;Kn.prototype.get=oE;Kn.prototype.has=lE;Kn.prototype.set=uE;var Oa=Sr(on,"Map");function cE(){this.size=0;this.__data__={"hash":new $r,"map":new(Oa||Kn),"string":new $r}}function dE(t){var e=typeof t;return e=="string"||e=="number"||e=="symbol"||e=="boolean"?t!=="__proto__":t===null}function Wu(t,e){var n=t.__data__;return dE(e)?n[typeof e=="string"?"string":"hash"]:n.map}function fE(t){var e=Wu(this,t)["delete"](t);this.size-=e?1:0;return e}function pE(t){return Wu(this,t).get(t)}function mE(t){return Wu(this,t).has(t)}function hE(t,e){var n=Wu(this,t),r=n.size;n.set(t,e);this.size+=n.size==r?0:1;return this}function Fn(t){var e=-1,n=t==null?0:t.length;this.clear();while(++e<n){var r=t[e];this.set(r[0],r[1])}}Fn.prototype.clear=cE;Fn.prototype["delete"]=fE;Fn.prototype.get=pE;Fn.prototype.has=mE;Fn.prototype.set=hE;var yE="Expected a function";function pp(t,e){if(typeof t!="function"||e!=null&&typeof e!="function"){throw new TypeError(yE)}var n=function(){var r=arguments,i=e?e.apply(this,r):r[0],a=n.cache;if(a.has(i)){return a.get(i)}var s=t.apply(this,r);n.cache=a.set(i,s)||a;return s};n.cache=new(pp.Cache||Fn);return n}pp.Cache=Fn;var gE=500;function RE(t){var e=pp(t,function(r){if(n.size===gE){n.clear()}return r});var n=e.cache;return e}var $E=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;var vE=/\\(\\)?/g;var TE=RE(function(t){var e=[];if(t.charCodeAt(0)===46){e.push("")}t.replace($E,function(n,r,i,a){e.push(i?a.replace(vE,"$1"):r||n)});return e});function wE(t){return t==null?"":Lg(t)}function Vu(t,e){if(oe(t)){return t}return fp(t,e)?[t]:TE(wE(t))}function Za(t){if(typeof t=="string"||Ya(t)){return t}var e=t+"";return e=="0"&&1/t==-Infinity?"-0":e}function mp(t,e){e=Vu(e,t);var n=0,r=e.length;while(t!=null&&n<r){t=t[Za(e[n++])]}return n&&n==r?t:void 0}function EE(t,e,n){var r=t==null?void 0:mp(t,e);return r===void 0?n:r}function hp(t,e){var n=-1,r=e.length,i=t.length;while(++n<r){t[i+n]=e[n]}return t}var sm=Ut?Ut.isConcatSpreadable:void 0;function CE(t){return oe(t)||qu(t)||!!(sm&&t&&t[sm])}function yp(t,e,n,r,i){var a=-1,s=t.length;n||(n=CE);i||(i=[]);while(++a<s){var o=t[a];if(n(o)){{hp(i,o)}}else if(!r){i[i.length]=o}}return i}function Ft(t){var e=t==null?0:t.length;return e?yp(t):[]}var Vg=jg(Object.getPrototypeOf,Object);function zg(t,e,n){var r=-1,i=t.length;if(e<0){e=-e>i?0:i+e}n=n>i?i:n;if(n<0){n+=i}i=e>n?0:n-e>>>0;e>>>=0;var a=Array(i);while(++r<i){a[r]=t[r+e]}return a}function SE(t,e,n,r){var i=-1,a=t==null?0:t.length;if(r&&a){n=t[++i]}while(++i<a){n=e(n,t[i],i,t)}return n}function AE(){this.__data__=new Kn;this.size=0}function bE(t){var e=this.__data__,n=e["delete"](t);this.size=e.size;return n}function kE(t){return this.__data__.get(t)}function NE(t){return this.__data__.has(t)}var PE=200;function _E(t,e){var n=this.__data__;if(n instanceof Kn){var r=n.__data__;if(!Oa||r.length<PE-1){r.push([t,e]);this.size=++n.size;return this}n=this.__data__=new Fn(r)}n.set(t,e);this.size=n.size;return this}function nn(t){var e=this.__data__=new Kn(t);this.size=e.size}nn.prototype.clear=AE;nn.prototype["delete"]=bE;nn.prototype.get=kE;nn.prototype.has=NE;nn.prototype.set=_E;function DE(t,e){return t&&lp(e,Ht(e),t)}var Xg=typeof Nt=="object"&&Nt&&!Nt.nodeType&&Nt;var om=Xg&&typeof Pt=="object"&&Pt&&!Pt.nodeType&&Pt;var IE=om&&om.exports===Xg;var lm=IE?on.Buffer:void 0;var um=lm?lm.allocUnsafe:void 0;function OE(t,e){var n=t.length,r=um?um(n):new t.constructor(n);t.copy(r);return r}function gp(t,e){var n=-1,r=t==null?0:t.length,i=0,a=[];while(++n<r){var s=t[n];if(e(s,n,t)){a[i++]=s}}return a}function Yg(){return[]}var LE=Object.prototype;var xE=LE.propertyIsEnumerable;var cm=Object.getOwnPropertySymbols;var Rp=!cm?Yg:function(t){if(t==null){return[]}t=Object(t);return gp(cm(t),function(e){return xE.call(t,e)})};function ME(t,e){return lp(t,Rp(t),e)}var KE=Object.getOwnPropertySymbols;var FE=!KE?Yg:function(t){var e=[];while(t){hp(e,Rp(t));t=Vg(t)}return e};function Jg(t,e,n){var r=e(t);return oe(t)?r:hp(r,n(t))}function Dd(t){return Jg(t,Ht,Rp)}function UE(t){return Jg(t,Wg,FE)}var Id=Sr(on,"DataView");var Od=Sr(on,"Promise");var Lr=Sr(on,"Set");var dm="[object Map]";var GE="[object Object]";var fm="[object Promise]";var pm="[object Set]";var mm="[object WeakMap]";var hm="[object DataView]";var HE=Cr(Id);var qE=Cr(Oa);var jE=Cr(Od);var BE=Cr(Lr);var WE=Cr(_d);var Mt=Jn;if(Id&&Mt(new Id(new ArrayBuffer(1)))!=hm||Oa&&Mt(new Oa)!=dm||Od&&Mt(Od.resolve())!=fm||Lr&&Mt(new Lr)!=pm||_d&&Mt(new _d)!=mm){Mt=function(t){var e=Jn(t),n=e==GE?t.constructor:void 0,r=n?Cr(n):"";if(r){switch(r){case HE:return hm;case qE:return dm;case jE:return fm;case BE:return pm;case WE:return mm}}return e}}var VE=Object.prototype;var zE=VE.hasOwnProperty;function XE(t){var e=t.length,n=new t.constructor(e);if(e&&typeof t[0]=="string"&&zE.call(t,"index")){n.index=t.index;n.input=t.input}return n}var ou=on.Uint8Array;function YE(t){var e=new t.constructor(t.byteLength);new ou(e).set(new ou(t));return e}function JE(t,e){var n=t.buffer;return new t.constructor(n,t.byteOffset,t.byteLength)}var QE=/\w*$/;function ZE(t){var e=new t.constructor(t.source,QE.exec(t));e.lastIndex=t.lastIndex;return e}var ym=Ut?Ut.prototype:void 0;var gm=ym?ym.valueOf:void 0;function eC(t){return gm?Object(gm.call(t)):{}}function tC(t,e){var n=t.buffer;return new t.constructor(n,t.byteOffset,t.length)}var nC="[object Boolean]";var rC="[object Date]";var iC="[object Map]";var aC="[object Number]";var sC="[object RegExp]";var oC="[object Set]";var lC="[object String]";var uC="[object Symbol]";var cC="[object ArrayBuffer]";var dC="[object DataView]";var fC="[object Float32Array]";var pC="[object Float64Array]";var mC="[object Int8Array]";var hC="[object Int16Array]";var yC="[object Int32Array]";var gC="[object Uint8Array]";var RC="[object Uint8ClampedArray]";var $C="[object Uint16Array]";var vC="[object Uint32Array]";function TC(t,e,n){var r=t.constructor;switch(e){case cC:return YE(t);case nC:case rC:return new r(+t);case dC:return JE(t);case fC:case pC:case mC:case hC:case yC:case gC:case RC:case $C:case vC:return tC(t);case iC:return new r;case aC:case lC:return new r(t);case sC:return ZE(t);case oC:return new r;case uC:return eC(t)}}function wC(t){return typeof t.constructor=="function"&&!Qa(t)?OT(Vg(t)):{}}var EC="[object Map]";function CC(t){return Vt(t)&&Mt(t)==EC}var Rm=Wn&&Wn.isMap;var SC=Rm?ju(Rm):CC;var AC="[object Set]";function bC(t){return Vt(t)&&Mt(t)==AC}var $m=Wn&&Wn.isSet;var kC=$m?ju($m):bC;var Qg="[object Arguments]";var NC="[object Array]";var PC="[object Boolean]";var _C="[object Date]";var DC="[object Error]";var Zg="[object Function]";var IC="[object GeneratorFunction]";var OC="[object Map]";var LC="[object Number]";var eR="[object Object]";var xC="[object RegExp]";var MC="[object Set]";var KC="[object String]";var FC="[object Symbol]";var UC="[object WeakMap]";var GC="[object ArrayBuffer]";var HC="[object DataView]";var qC="[object Float32Array]";var jC="[object Float64Array]";var BC="[object Int8Array]";var WC="[object Int16Array]";var VC="[object Int32Array]";var zC="[object Uint8Array]";var XC="[object Uint8ClampedArray]";var YC="[object Uint16Array]";var JC="[object Uint32Array]";var Re={};Re[Qg]=Re[NC]=Re[GC]=Re[HC]=Re[PC]=Re[_C]=Re[qC]=Re[jC]=Re[BC]=Re[WC]=Re[VC]=Re[OC]=Re[LC]=Re[eR]=Re[xC]=Re[MC]=Re[KC]=Re[FC]=Re[zC]=Re[XC]=Re[YC]=Re[JC]=true;Re[DC]=Re[Zg]=Re[UC]=false;function Ml(t,e,n,r,i,a){var s;if(s!==void 0){return s}if(!Gt(t)){return t}var o=oe(t);if(o){s=XE(t);{return xT(t,s)}}else{var l=Mt(t),u=l==Zg||l==IC;if(Da(t)){return OE(t)}if(l==eR||l==Qg||u&&!i){s=u?{}:wC(t);{return ME(t,DE(s,t))}}else{if(!Re[l]){return i?t:{}}s=TC(t,l)}}a||(a=new nn);var c=a.get(t);if(c){return c}a.set(t,s);if(kC(t)){t.forEach(function(p){s.add(Ml(p,e,n,p,t,a))})}else if(SC(t)){t.forEach(function(p,y){s.set(y,Ml(p,e,n,y,t,a))})}var d=Dd;var f=o?void 0:d(t);xg(f||t,function(p,y){if(f){y=p;p=t[y]}Hu(s,y,Ml(p,e,n,y,t,a))});return s}var QC=4;function tt(t){return Ml(t,QC)}function es(t){var e=-1,n=t==null?0:t.length,r=0,i=[];while(++e<n){var a=t[e];if(a){i[r++]=a}}return i}var ZC="__lodash_hash_undefined__";function eS(t){this.__data__.set(t,ZC);return this}function tS(t){return this.__data__.has(t)}function Kr(t){var e=-1,n=t==null?0:t.length;this.__data__=new Fn;while(++e<n){this.add(t[e])}}Kr.prototype.add=Kr.prototype.push=eS;Kr.prototype.has=tS;function tR(t,e){var n=-1,r=t==null?0:t.length;while(++n<r){if(e(t[n],n,t)){return true}}return false}function $p(t,e){return t.has(e)}var nS=1;var rS=2;function nR(t,e,n,r,i,a){var s=n&nS,o=t.length,l=e.length;if(o!=l&&!(s&&l>o)){return false}var u=a.get(t);var c=a.get(e);if(u&&c){return u==e&&c==t}var d=-1,f=true,p=n&rS?new Kr:void 0;a.set(t,e);a.set(e,t);while(++d<o){var y=t[d],v=e[d];if(r){var b=s?r(v,y,d,e,t,a):r(y,v,d,t,e,a)}if(b!==void 0){if(b){continue}f=false;break}if(p){if(!tR(e,function($,w){if(!$p(p,w)&&(y===$||i(y,$,n,r,a))){return p.push(w)}})){f=false;break}}else if(!(y===v||i(y,v,n,r,a))){f=false;break}}a["delete"](t);a["delete"](e);return f}function iS(t){var e=-1,n=Array(t.size);t.forEach(function(r,i){n[++e]=[i,r]});return n}function vp(t){var e=-1,n=Array(t.size);t.forEach(function(r){n[++e]=r});return n}var aS=1;var sS=2;var oS="[object Boolean]";var lS="[object Date]";var uS="[object Error]";var cS="[object Map]";var dS="[object Number]";var fS="[object RegExp]";var pS="[object Set]";var mS="[object String]";var hS="[object Symbol]";var yS="[object ArrayBuffer]";var gS="[object DataView]";var vm=Ut?Ut.prototype:void 0;var pc=vm?vm.valueOf:void 0;function RS(t,e,n,r,i,a,s){switch(n){case gS:if(t.byteLength!=e.byteLength||t.byteOffset!=e.byteOffset){return false}t=t.buffer;e=e.buffer;case yS:if(t.byteLength!=e.byteLength||!a(new ou(t),new ou(e))){return false}return true;case oS:case lS:case dS:return Ja(+t,+e);case uS:return t.name==e.name&&t.message==e.message;case fS:case mS:return t==e+"";case cS:var o=iS;case pS:var l=r&aS;o||(o=vp);if(t.size!=e.size&&!l){return false}var u=s.get(t);if(u){return u==e}r|=sS;s.set(t,e);var c=nR(o(t),o(e),r,i,a,s);s["delete"](t);return c;case hS:if(pc){return pc.call(t)==pc.call(e)}}return false}var $S=1;var vS=Object.prototype;var TS=vS.hasOwnProperty;function wS(t,e,n,r,i,a){var s=n&$S,o=Dd(t),l=o.length,u=Dd(e),c=u.length;if(l!=c&&!s){return false}var d=l;while(d--){var f=o[d];if(!(s?f in e:TS.call(e,f))){return false}}var p=a.get(t);var y=a.get(e);if(p&&y){return p==e&&y==t}var v=true;a.set(t,e);a.set(e,t);var b=s;while(++d<l){f=o[d];var $=t[f],w=e[f];if(r){var C=s?r(w,$,f,e,t,a):r($,w,f,t,e,a)}if(!(C===void 0?$===w||i($,w,n,r,a):C)){v=false;break}b||(b=f=="constructor")}if(v&&!b){var O=t.constructor,Y=e.constructor;if(O!=Y&&("constructor"in t&&"constructor"in e)&&!(typeof O=="function"&&O instanceof O&&typeof Y=="function"&&Y instanceof Y)){v=false}}a["delete"](t);a["delete"](e);return v}var ES=1;var Tm="[object Arguments]";var wm="[object Array]";var Ds="[object Object]";var CS=Object.prototype;var Em=CS.hasOwnProperty;function SS(t,e,n,r,i,a){var s=oe(t),o=oe(e),l=s?wm:Mt(t),u=o?wm:Mt(e);l=l==Tm?Ds:l;u=u==Tm?Ds:u;var c=l==Ds,d=u==Ds,f=l==u;if(f&&Da(t)){if(!Da(e)){return false}s=true;c=false}if(f&&!c){a||(a=new nn);return s||dp(t)?nR(t,e,n,r,i,a):RS(t,e,l,n,r,i,a)}if(!(n&ES)){var p=c&&Em.call(t,"__wrapped__"),y=d&&Em.call(e,"__wrapped__");if(p||y){var v=p?t.value():t,b=y?e.value():e;a||(a=new nn);return i(v,b,n,r,a)}}if(!f){return false}a||(a=new nn);return wS(t,e,n,r,i,a)}function Tp(t,e,n,r,i){if(t===e){return true}if(t==null||e==null||!Vt(t)&&!Vt(e)){return t!==t&&e!==e}return SS(t,e,n,r,Tp,i)}var AS=1;var bS=2;function kS(t,e,n,r){var i=n.length,a=i;if(t==null){return!a}t=Object(t);while(i--){var s=n[i];if(s[2]?s[1]!==t[s[0]]:!(s[0]in t)){return false}}while(++i<a){s=n[i];var o=s[0],l=t[o],u=s[1];if(s[2]){if(l===void 0&&!(o in t)){return false}}else{var c=new nn;var d;if(!(d===void 0?Tp(u,l,AS|bS,r,c):d)){return false}}}return true}function rR(t){return t===t&&!Gt(t)}function NS(t){var e=Ht(t),n=e.length;while(n--){var r=e[n],i=t[r];e[n]=[r,i,rR(i)]}return e}function iR(t,e){return function(n){if(n==null){return false}return n[t]===e&&(e!==void 0||t in Object(n))}}function PS(t){var e=NS(t);if(e.length==1&&e[0][2]){return iR(e[0][0],e[0][1])}return function(n){return n===t||kS(n,t,e)}}function _S(t,e){return t!=null&&e in Object(t)}function aR(t,e,n){e=Vu(e,t);var r=-1,i=e.length,a=false;while(++r<i){var s=Za(e[r]);if(!(a=t!=null&&n(t,s))){break}t=t[s]}if(a||++r!=i){return a}i=t==null?0:t.length;return!!i&&cp(i)&&Gu(s,i)&&(oe(t)||qu(t))}function DS(t,e){return t!=null&&aR(t,e,_S)}var IS=1;var OS=2;function LS(t,e){if(fp(t)&&rR(e)){return iR(Za(t),e)}return function(n){var r=EE(n,t);return r===void 0&&r===e?DS(n,t):Tp(e,r,IS|OS)}}function xS(t){return function(e){return e==null?void 0:e[t]}}function MS(t){return function(e){return mp(e,t)}}function KS(t){return fp(t)?xS(Za(t)):MS(t)}function Xt(t){if(typeof t=="function"){return t}if(t==null){return Rr}if(typeof t=="object"){return oe(t)?LS(t[0],t[1]):PS(t)}return KS(t)}function FS(t,e,n,r){var i=-1,a=t==null?0:t.length;while(++i<a){var s=t[i];e(r,s,n(s),t)}return r}function US(t){return function(e,n,r){var i=-1,a=Object(e),s=r(e),o=s.length;while(o--){var l=s[++i];if(n(a[l],l,a)===false){break}}return e}}var GS=US();function HS(t,e){return t&&GS(t,e,Ht)}function qS(t,e){return function(n,r){if(n==null){return n}if(!ln(n)){return t(n,r)}var i=n.length,a=-1,s=Object(n);while(++a<i){if(r(s[a],a,s)===false){break}}return n}}var Ar=qS(HS);function jS(t,e,n,r){Ar(t,function(i,a,s){e(r,i,n(i),s)});return r}function BS(t,e){return function(n,r){var i=oe(n)?FS:jS,a=e?e():{};return i(n,t,Xt(r),a)}}var sR=Object.prototype;var WS=sR.hasOwnProperty;var wp=up(function(t,e){t=Object(t);var n=-1;var r=e.length;var i=r>2?e[2]:void 0;if(i&&Fg(e[0],e[1],i)){r=1}while(++n<r){var a=e[n];var s=Wg(a);var o=-1;var l=s.length;while(++o<l){var u=s[o];var c=t[u];if(c===void 0||Ja(c,sR[u])&&!WS.call(t,u)){t[u]=a[u]}}}return t});function Cm(t){return Vt(t)&&ln(t)}var VS=200;function zS(t,e,n,r){var i=-1,a=Kg,s=true,o=t.length,l=[],u=e.length;if(!o){return l}if(e.length>=VS){a=$p;s=false;e=new Kr(e)}e:while(++i<o){var c=t[i],d=c;c=c!==0?c:0;if(s&&d===d){var f=u;while(f--){if(e[f]===d){continue e}}l.push(c)}else if(!a(e,d,r)){l.push(c)}}return l}var zu=up(function(t,e){return Cm(t)?zS(t,yp(e,1,Cm,true)):[]});function Fr(t){var e=t==null?0:t.length;return e?t[e-1]:void 0}function Ye(t,e,n){var r=t==null?0:t.length;if(!r){return[]}e=e===void 0?1:Uu(e);return zg(t,e<0?0:e,r)}function La(t,e,n){var r=t==null?0:t.length;if(!r){return[]}e=e===void 0?1:Uu(e);e=r-e;return zg(t,0,e<0?0:e)}function XS(t){return typeof t=="function"?t:Rr}function X(t,e){var n=oe(t)?xg:Ar;return n(t,XS(e))}function YS(t,e){var n=-1,r=t==null?0:t.length;while(++n<r){if(!e(t[n],n,t)){return false}}return true}function JS(t,e){var n=true;Ar(t,function(r,i,a){n=!!e(r,i,a);return n});return n}function Bt(t,e,n){var r=oe(t)?YS:JS;return r(t,Xt(e))}function oR(t,e){var n=[];Ar(t,function(r,i,a){if(e(r,i,a)){n.push(r)}});return n}function It(t,e){var n=oe(t)?gp:oR;return n(t,Xt(e))}function QS(t){return function(e,n,r){var i=Object(e);if(!ln(e)){var a=Xt(n);e=Ht(e);n=function(o){return a(i[o],o,i)}}var s=t(e,n,r);return s>-1?i[a?e[s]:s]:void 0}}var ZS=Math.max;function eA(t,e,n){var r=t==null?0:t.length;if(!r){return-1}var i=n==null?0:Uu(n);if(i<0){i=ZS(r+i,0)}return Mg(t,Xt(e),i)}var Ur=QS(eA);function zt(t){return t&&t.length?t[0]:void 0}function tA(t,e){var n=-1,r=ln(t)?Array(t.length):[];Ar(t,function(i,a,s){r[++n]=e(i,a,s)});return r}function H(t,e){var n=oe(t)?Fu:tA;return n(t,Xt(e))}function _t(t,e){return yp(H(t,e))}var nA=Object.prototype;var rA=nA.hasOwnProperty;var iA=BS(function(t,e,n){if(rA.call(t,n)){t[n].push(e)}else{op(t,n,[e])}});var aA=Object.prototype;var sA=aA.hasOwnProperty;function oA(t,e){return t!=null&&sA.call(t,e)}function Q(t,e){return t!=null&&aR(t,e,oA)}var lA="[object String]";function $t(t){return typeof t=="string"||!oe(t)&&Vt(t)&&Jn(t)==lA}function uA(t,e){return Fu(e,function(n){return t[n]})}function Be(t){return t==null?[]:uA(t,Ht(t))}var cA=Math.max;function ht(t,e,n,r){t=ln(t)?t:Be(t);n=n&&true?Uu(n):0;var i=t.length;if(n<0){n=cA(i+n,0)}return $t(t)?n<=i&&t.indexOf(e,n)>-1:!!i&&sp(t,e,n)>-1}function Sm(t,e,n){var r=t==null?0:t.length;if(!r){return-1}var i=0;return sp(t,e,i)}var dA="[object Map]";var fA="[object Set]";var pA=Object.prototype;var mA=pA.hasOwnProperty;function ye(t){if(t==null){return true}if(ln(t)&&(oe(t)||typeof t=="string"||typeof t.splice=="function"||Da(t)||dp(t)||qu(t))){return!t.length}var e=Mt(t);if(e==dA||e==fA){return!t.size}if(Qa(t)){return!Bg(t).length}for(var n in t){if(mA.call(t,n)){return false}}return true}var hA="[object RegExp]";function yA(t){return Vt(t)&&Jn(t)==hA}var Am=Wn&&Wn.isRegExp;var In=Am?ju(Am):yA;function On(t){return t===void 0}function gA(t,e){return t<e}function RA(t,e,n){var r=-1,i=t.length;while(++r<i){var a=t[r],s=e(a);if(s!=null&&(o===void 0?s===s&&!Ya(s):n(s,o))){var o=s,l=a}}return l}function $A(t){return t&&t.length?RA(t,Rr,gA):void 0}var vA="Expected a function";function TA(t){if(typeof t!="function"){throw new TypeError(vA)}return function(){var e=arguments;switch(e.length){case 0:return!t.call(this);case 1:return!t.call(this,e[0]);case 2:return!t.call(this,e[0],e[1]);case 3:return!t.call(this,e[0],e[1],e[2])}return!t.apply(this,e)}}function wA(t,e,n,r){if(!Gt(t)){return t}e=Vu(e,t);var i=-1,a=e.length,s=a-1,o=t;while(o!=null&&++i<a){var l=Za(e[i]),u=n;if(l==="__proto__"||l==="constructor"||l==="prototype"){return t}if(i!=s){var c=o[l];u=void 0;if(u===void 0){u=Gt(c)?c:Gu(e[i+1])?[]:{}}}Hu(o,l,u);o=o[l]}return t}function EA(t,e,n){var r=-1,i=e.length,a={};while(++r<i){var s=e[r],o=mp(t,s);if(n(o,s)){wA(a,Vu(s,t),o)}}return a}function Yt(t,e){if(t==null){return{}}var n=Fu(UE(t),function(r){return[r]});e=Xt(e);return EA(t,n,function(r,i){return e(r,i[0])})}function CA(t,e,n,r,i){i(t,function(a,s,o){n=r?(r=false,a):e(n,a,s,o)});return n}function ft(t,e,n){var r=oe(t)?SE:CA,i=arguments.length<3;return r(t,Xt(e),n,i,Ar)}function Xu(t,e){var n=oe(t)?gp:oR;return n(t,TA(Xt(e)))}function SA(t,e){var n;Ar(t,function(r,i,a){n=e(r,i,a);return!n});return!!n}function lR(t,e,n){var r=oe(t)?tR:SA;return r(t,Xt(e))}var AA=1/0;var bA=!(Lr&&1/vp(new Lr([,-0]))[1]==AA)?je:function(t){return new Lr(t)};var kA=200;function uR(t,e,n){var r=-1,i=Kg,a=t.length,s=true,o=[],l=o;if(a>=kA){var u=e?null:bA(t);if(u){return vp(u)}s=false;i=$p;l=new Kr}else{l=e?[]:o}e:while(++r<a){var c=t[r],d=e?e(c):c;c=c!==0?c:0;if(s&&d===d){var f=l.length;while(f--){if(l[f]===d){continue e}}if(e){l.push(d)}o.push(c)}else if(!i(l,d,n)){if(l!==o){l.push(d)}o.push(c)}}return o}function Ep(t){return t&&t.length?uR(t):[]}function NA(t,e){return t&&t.length?uR(t,Xt(e)):[]}function Ld(t){if(console&&console.error){console.error(`Error: ${t}`)}}function cR(t){if(console&&console.warn){console.warn(`Warning: ${t}`)}}function dR(t){const e=new Date().getTime();const n=t();const r=new Date().getTime();const i=r-e;return{time:i,value:n}}function fR(t){function e(){}e.prototype=t;const n=new e;function r(){return typeof n.bar}r();r();return t}function PA(t){if(_A(t)){return t.LABEL}else{return t.name}}function _A(t){return $t(t.LABEL)&&t.LABEL!==""}class un{get definition(){return this._definition}set definition(e){this._definition=e}constructor(e){this._definition=e}accept(e){e.visit(this);X(this.definition,n=>{n.accept(e)})}}class pt extends un{constructor(e){super([]);this.idx=1;Dt(this,Yt(e,n=>n!==void 0))}set definition(e){}get definition(){if(this.referencedRule!==void 0){return this.referencedRule.definition}return[]}accept(e){e.visit(this)}}class zr extends un{constructor(e){super(e.definition);this.orgText="";Dt(this,Yt(e,n=>n!==void 0))}}class vt extends un{constructor(e){super(e.definition);this.ignoreAmbiguities=false;Dt(this,Yt(e,n=>n!==void 0))}}class et extends un{constructor(e){super(e.definition);this.idx=1;Dt(this,Yt(e,n=>n!==void 0))}}class Ot extends un{constructor(e){super(e.definition);this.idx=1;Dt(this,Yt(e,n=>n!==void 0))}}class Lt extends un{constructor(e){super(e.definition);this.idx=1;Dt(this,Yt(e,n=>n!==void 0))}}class _e extends un{constructor(e){super(e.definition);this.idx=1;Dt(this,Yt(e,n=>n!==void 0))}}class Tt extends un{constructor(e){super(e.definition);this.idx=1;Dt(this,Yt(e,n=>n!==void 0))}}class wt extends un{get definition(){return this._definition}set definition(e){this._definition=e}constructor(e){super(e.definition);this.idx=1;this.ignoreAmbiguities=false;this.hasPredicates=false;Dt(this,Yt(e,n=>n!==void 0))}}class Te{constructor(e){this.idx=1;Dt(this,Yt(e,n=>n!==void 0))}accept(e){e.visit(this)}}function DA(t){return H(t,Kl)}function Kl(t){function e(n){return H(n,Kl)}if(t instanceof pt){const n={type:"NonTerminal",name:t.nonTerminalName,idx:t.idx};if($t(t.label)){n.label=t.label}return n}else if(t instanceof vt){return{type:"Alternative",definition:e(t.definition)}}else if(t instanceof et){return{type:"Option",idx:t.idx,definition:e(t.definition)}}else if(t instanceof Ot){return{type:"RepetitionMandatory",idx:t.idx,definition:e(t.definition)}}else if(t instanceof Lt){return{type:"RepetitionMandatoryWithSeparator",idx:t.idx,separator:Kl(new Te({terminalType:t.separator})),definition:e(t.definition)}}else if(t instanceof Tt){return{type:"RepetitionWithSeparator",idx:t.idx,separator:Kl(new Te({terminalType:t.separator})),definition:e(t.definition)}}else if(t instanceof _e){return{type:"Repetition",idx:t.idx,definition:e(t.definition)}}else if(t instanceof wt){return{type:"Alternation",idx:t.idx,definition:e(t.definition)}}else if(t instanceof Te){const n={type:"Terminal",name:t.terminalType.name,label:PA(t.terminalType),idx:t.idx};if($t(t.label)){n.terminalLabel=t.label}const r=t.terminalType.PATTERN;if(t.terminalType.PATTERN){n.pattern=In(r)?r.source:r}return n}else if(t instanceof zr){return{type:"Rule",name:t.name,orgText:t.orgText,definition:e(t.definition)}}else{throw Error("non exhaustive match")}}class Xr{visit(e){const n=e;switch(n.constructor){case pt:return this.visitNonTerminal(n);case vt:return this.visitAlternative(n);case et:return this.visitOption(n);case Ot:return this.visitRepetitionMandatory(n);case Lt:return this.visitRepetitionMandatoryWithSeparator(n);case Tt:return this.visitRepetitionWithSeparator(n);case _e:return this.visitRepetition(n);case wt:return this.visitAlternation(n);case Te:return this.visitTerminal(n);case zr:return this.visitRule(n);default:throw Error("non exhaustive match")}}visitNonTerminal(e){}visitAlternative(e){}visitOption(e){}visitRepetition(e){}visitRepetitionMandatory(e){}visitRepetitionMandatoryWithSeparator(e){}visitRepetitionWithSeparator(e){}visitAlternation(e){}visitTerminal(e){}visitRule(e){}}function IA(t){return t instanceof vt||t instanceof et||t instanceof _e||t instanceof Ot||t instanceof Lt||t instanceof Tt||t instanceof Te||t instanceof zr}function lu(t,e=[]){const n=t instanceof et||t instanceof _e||t instanceof Tt;if(n){return true}if(t instanceof wt){return lR(t.definition,r=>{return lu(r,e)})}else if(t instanceof pt&&ht(e,t)){return false}else if(t instanceof un){if(t instanceof pt){e.push(t)}return Bt(t.definition,r=>{return lu(r,e)})}else{return false}}function OA(t){return t instanceof wt}function en(t){if(t instanceof pt){return"SUBRULE"}else if(t instanceof et){return"OPTION"}else if(t instanceof wt){return"OR"}else if(t instanceof Ot){return"AT_LEAST_ONE"}else if(t instanceof Lt){return"AT_LEAST_ONE_SEP"}else if(t instanceof Tt){return"MANY_SEP"}else if(t instanceof _e){return"MANY"}else if(t instanceof Te){return"CONSUME"}else{throw Error("non exhaustive match")}}class Yu{walk(e,n=[]){X(e.definition,(r,i)=>{const a=Ye(e.definition,i+1);if(r instanceof pt){this.walkProdRef(r,a,n)}else if(r instanceof Te){this.walkTerminal(r,a,n)}else if(r instanceof vt){this.walkFlat(r,a,n)}else if(r instanceof et){this.walkOption(r,a,n)}else if(r instanceof Ot){this.walkAtLeastOne(r,a,n)}else if(r instanceof Lt){this.walkAtLeastOneSep(r,a,n)}else if(r instanceof Tt){this.walkManySep(r,a,n)}else if(r instanceof _e){this.walkMany(r,a,n)}else if(r instanceof wt){this.walkOr(r,a,n)}else{throw Error("non exhaustive match")}})}walkTerminal(e,n,r){}walkProdRef(e,n,r){}walkFlat(e,n,r){const i=n.concat(r);this.walk(e,i)}walkOption(e,n,r){const i=n.concat(r);this.walk(e,i)}walkAtLeastOne(e,n,r){const i=[new et({definition:e.definition})].concat(n,r);this.walk(e,i)}walkAtLeastOneSep(e,n,r){const i=bm(e,n,r);this.walk(e,i)}walkMany(e,n,r){const i=[new et({definition:e.definition})].concat(n,r);this.walk(e,i)}walkManySep(e,n,r){const i=bm(e,n,r);this.walk(e,i)}walkOr(e,n,r){const i=n.concat(r);X(e.definition,a=>{const s=new vt({definition:[a]});this.walk(s,i)})}}function bm(t,e,n){const r=[new et({definition:[new Te({terminalType:t.separator})].concat(t.definition)})];const i=r.concat(e,n);return i}function ts(t){if(t instanceof pt){return ts(t.referencedRule)}else if(t instanceof Te){return MA(t)}else if(IA(t)){return LA(t)}else if(OA(t)){return xA(t)}else{throw Error("non exhaustive match")}}function LA(t){let e=[];const n=t.definition;let r=0;let i=n.length>r;let a;let s=true;while(i&&s){a=n[r];s=lu(a);e=e.concat(ts(a));r=r+1;i=n.length>r}return Ep(e)}function xA(t){const e=H(t.definition,n=>{return ts(n)});return Ep(Ft(e))}function MA(t){return[t.terminalType]}const pR="_~IN~_";class KA extends Yu{constructor(e){super();this.topProd=e;this.follows={}}startWalking(){this.walk(this.topProd);return this.follows}walkTerminal(e,n,r){}walkProdRef(e,n,r){const i=UA(e.referencedRule,e.idx)+this.topProd.name;const a=n.concat(r);const s=new vt({definition:a});const o=ts(s);this.follows[i]=o}}function FA(t){const e={};X(t,n=>{const r=new KA(n).startWalking();Dt(e,r)});return e}function UA(t,e){return t.name+e+pR}let Fl={};const GA=new Eg;function Ju(t){const e=t.toString();if(Fl.hasOwnProperty(e)){return Fl[e]}else{const n=GA.pattern(e);Fl[e]=n;return n}}function HA(){Fl={}}const mR="Complement Sets are not supported for first char optimization";const uu='Unable to use "first char" lexer optimizations:\n';function qA(t,e=false){try{const n=Ju(t);const r=xd(n.value,{},n.flags.ignoreCase);return r}catch(n){if(n.message===mR){if(e){cR(`${uu}	Unable to optimize: < ${t.toString()} >
	Complement Sets cannot be automatically optimized.
	This will disable the lexer's first char optimizations.
	See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#COMPLEMENT for details.`)}}else{let r="";if(e){r="\n	This will disable the lexer's first char optimizations.\n	See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#REGEXP_PARSING for details."}Ld(`${uu}
	Failed parsing: < ${t.toString()} >
	Using the @chevrotain/regexp-to-ast library
	Please open an issue at: https://github.com/chevrotain/chevrotain/issues`+r)}}return[]}function xd(t,e,n){switch(t.type){case"Disjunction":for(let i=0;i<t.value.length;i++){xd(t.value[i],e,n)}break;case"Alternative":const r=t.value;for(let i=0;i<r.length;i++){const a=r[i];switch(a.type){case"EndAnchor":case"GroupBackReference":case"Lookahead":case"NegativeLookahead":case"StartAnchor":case"WordBoundary":case"NonWordBoundary":continue}const s=a;switch(s.type){case"Character":Is(s.value,e,n);break;case"Set":if(s.complement===true){throw Error(mR)}X(s.value,l=>{if(typeof l==="number"){Is(l,e,n)}else{const u=l;if(n===true){for(let c=u.from;c<=u.to;c++){Is(c,e,n)}}else{for(let c=u.from;c<=u.to&&c<pa;c++){Is(c,e,n)}if(u.to>=pa){const c=u.from>=pa?u.from:pa;const d=u.to;const f=Vn(c);const p=Vn(d);for(let y=f;y<=p;y++){e[y]=y}}}}});break;case"Group":xd(s.value,e,n);break;default:throw Error("Non Exhaustive Match")}const o=s.quantifier!==void 0&&s.quantifier.atLeast===0;if(s.type==="Group"&&Md(s)===false||s.type!=="Group"&&o===false){break}}break;default:throw Error("non exhaustive match!")}return Be(e)}function Is(t,e,n){const r=Vn(t);e[r]=r;if(n===true){jA(t,e)}}function jA(t,e){const n=String.fromCharCode(t);const r=n.toUpperCase();if(r!==n){const i=Vn(r.charCodeAt(0));e[i]=i}else{const i=n.toLowerCase();if(i!==n){const a=Vn(i.charCodeAt(0));e[a]=a}}}function km(t,e){return Ur(t.value,n=>{if(typeof n==="number"){return ht(e,n)}else{const r=n;return Ur(e,i=>r.from<=i&&i<=r.to)!==void 0}})}function Md(t){const e=t.quantifier;if(e&&e.atLeast===0){return true}if(!t.value){return false}return oe(t.value)?Bt(t.value,Md):Md(t.value)}class BA extends Lu{constructor(e){super();this.targetCharCodes=e;this.found=false}visitChildren(e){if(this.found===true){return}switch(e.type){case"Lookahead":this.visitLookahead(e);return;case"NegativeLookahead":this.visitNegativeLookahead(e);return}super.visitChildren(e)}visitCharacter(e){if(ht(this.targetCharCodes,e.value)){this.found=true}}visitSet(e){if(e.complement){if(km(e,this.targetCharCodes)===void 0){this.found=true}}else{if(km(e,this.targetCharCodes)!==void 0){this.found=true}}}}function Cp(t,e){if(e instanceof RegExp){const n=Ju(e);const r=new BA(t);r.visit(n);return r.found}else{return Ur(e,n=>{return ht(t,n.charCodeAt(0))})!==void 0}}const vr="PATTERN";const fa="defaultMode";const Os="modes";let hR=typeof new RegExp("(?:)").sticky==="boolean";function WA(t,e){e=wp(e,{useSticky:hR,debug:false,safeMode:false,positionTracking:"full",lineTerminatorCharacters:["\r","\n"],tracer:(w,C)=>C()});const n=e.tracer;n("initCharCodeToOptimizedIndexMap",()=>{hb()});let r;n("Reject Lexer.NA",()=>{r=Xu(t,w=>{return w[vr]===Rt.NA})});let i=false;let a;n("Transform Patterns",()=>{i=false;a=H(r,w=>{const C=w[vr];if(In(C)){const O=C.source;if(O.length===1&&O!=="^"&&O!=="$"&&O!=="."&&!C.ignoreCase){return O}else if(O.length===2&&O[0]==="\\"&&!ht(["d","D","s","S","t","r","n","t","0","c","b","B","f","v","w","W"],O[1])){return O[1]}else{return e.useSticky?Pm(C):Nm(C)}}else if(Mn(C)){i=true;return{exec:C}}else if(typeof C==="object"){i=true;return C}else if(typeof C==="string"){if(C.length===1){return C}else{const O=C.replace(/[\\^$.*+?()[\]{}|]/g,"\\$&");const Y=new RegExp(O);return e.useSticky?Pm(Y):Nm(Y)}}else{throw Error("non exhaustive match")}})});let s;let o;let l;let u;let c;n("misc mapping",()=>{s=H(r,w=>w.tokenTypeIdx);o=H(r,w=>{const C=w.GROUP;if(C===Rt.SKIPPED){return void 0}else if($t(C)){return C}else if(On(C)){return false}else{throw Error("non exhaustive match")}});l=H(r,w=>{const C=w.LONGER_ALT;if(C){const O=oe(C)?H(C,Y=>Sm(r,Y)):[Sm(r,C)];return O}});u=H(r,w=>w.PUSH_MODE);c=H(r,w=>Q(w,"POP_MODE"))});let d;n("Line Terminator Handling",()=>{const w=RR(e.lineTerminatorCharacters);d=H(r,C=>false);if(e.positionTracking!=="onlyOffset"){d=H(r,C=>{if(Q(C,"LINE_BREAKS")){return!!C.LINE_BREAKS}else{return gR(C,w)===false&&Cp(w,C.PATTERN)}})}});let f;let p;let y;let v;n("Misc Mapping #2",()=>{f=H(r,yR);p=H(a,fb);y=ft(r,(w,C)=>{const O=C.GROUP;if($t(O)&&!(O===Rt.SKIPPED)){w[O]=[]}return w},{});v=H(a,(w,C)=>{return{pattern:a[C],longerAlt:l[C],canLineTerminator:d[C],isCustom:f[C],short:p[C],group:o[C],push:u[C],pop:c[C],tokenTypeIdx:s[C],tokenType:r[C]}})});let b=true;let $=[];if(!e.safeMode){n("First Char Optimization",()=>{$=ft(r,(w,C,O)=>{if(typeof C.PATTERN==="string"){const Y=C.PATTERN.charCodeAt(0);const q=Vn(Y);mc(w,q,v[O])}else if(oe(C.START_CHARS_HINT)){let Y;X(C.START_CHARS_HINT,q=>{const J=typeof q==="string"?q.charCodeAt(0):q;const te=Vn(J);if(Y!==te){Y=te;mc(w,te,v[O])}})}else if(In(C.PATTERN)){if(C.PATTERN.unicode){b=false;if(e.ensureOptimizations){Ld(`${uu}	Unable to analyze < ${C.PATTERN.toString()} > pattern.
	The regexp unicode flag is not currently supported by the regexp-to-ast library.
	This will disable the lexer's first char optimizations.
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#UNICODE_OPTIMIZE`)}}else{const Y=qA(C.PATTERN,e.ensureOptimizations);if(ye(Y)){b=false}X(Y,q=>{mc(w,q,v[O])})}}else{if(e.ensureOptimizations){Ld(`${uu}	TokenType: <${C.name}> is using a custom token pattern without providing <start_chars_hint> parameter.
	This will disable the lexer's first char optimizations.
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#CUSTOM_OPTIMIZE`)}b=false}return w},[])})}return{emptyGroups:y,patternIdxToConfig:v,charCodeToPatternIdxToConfig:$,hasCustom:i,canBeOptimized:b}}function VA(t,e){let n=[];const r=XA(t);n=n.concat(r.errors);const i=YA(r.valid);const a=i.valid;n=n.concat(i.errors);n=n.concat(zA(a));n=n.concat(ib(a));n=n.concat(ab(a,e));n=n.concat(sb(a));return n}function zA(t){let e=[];const n=It(t,r=>In(r[vr]));e=e.concat(QA(n));e=e.concat(tb(n));e=e.concat(nb(n));e=e.concat(rb(n));e=e.concat(ZA(n));return e}function XA(t){const e=It(t,i=>{return!Q(i,vr)});const n=H(e,i=>{return{message:"Token Type: ->"+i.name+"<- missing static 'PATTERN' property",type:De.MISSING_PATTERN,tokenTypes:[i]}});const r=zu(t,e);return{errors:n,valid:r}}function YA(t){const e=It(t,i=>{const a=i[vr];return!In(a)&&!Mn(a)&&!Q(a,"exec")&&!$t(a)});const n=H(e,i=>{return{message:"Token Type: ->"+i.name+"<- static 'PATTERN' can only be a RegExp, a Function matching the {CustomPatternMatcherFunc} type or an Object matching the {ICustomPattern} interface.",type:De.INVALID_PATTERN,tokenTypes:[i]}});const r=zu(t,e);return{errors:n,valid:r}}const JA=/[^\\][$]/;function QA(t){class e extends Lu{constructor(){super(...arguments);this.found=false}visitEndAnchor(a){this.found=true}}const n=It(t,i=>{const a=i.PATTERN;try{const s=Ju(a);const o=new e;o.visit(s);return o.found}catch(s){return JA.test(a.source)}});const r=H(n,i=>{return{message:"Unexpected RegExp Anchor Error:\n	Token Type: ->"+i.name+"<- static 'PATTERN' cannot contain end of input anchor '$'\n	See chevrotain.io/docs/guide/resolving_lexer_errors.html#ANCHORS	for details.",type:De.EOI_ANCHOR_FOUND,tokenTypes:[i]}});return r}function ZA(t){const e=It(t,r=>{const i=r.PATTERN;return i.test("")});const n=H(e,r=>{return{message:"Token Type: ->"+r.name+"<- static 'PATTERN' must not match an empty string",type:De.EMPTY_MATCH_PATTERN,tokenTypes:[r]}});return n}const eb=/[^\\[][\^]|^\^/;function tb(t){class e extends Lu{constructor(){super(...arguments);this.found=false}visitStartAnchor(a){this.found=true}}const n=It(t,i=>{const a=i.PATTERN;try{const s=Ju(a);const o=new e;o.visit(s);return o.found}catch(s){return eb.test(a.source)}});const r=H(n,i=>{return{message:"Unexpected RegExp Anchor Error:\n	Token Type: ->"+i.name+"<- static 'PATTERN' cannot contain start of input anchor '^'\n	See https://chevrotain.io/docs/guide/resolving_lexer_errors.html#ANCHORS	for details.",type:De.SOI_ANCHOR_FOUND,tokenTypes:[i]}});return r}function nb(t){const e=It(t,r=>{const i=r[vr];return i instanceof RegExp&&(i.multiline||i.global)});const n=H(e,r=>{return{message:"Token Type: ->"+r.name+"<- static 'PATTERN' may NOT contain global('g') or multiline('m')",type:De.UNSUPPORTED_FLAGS_FOUND,tokenTypes:[r]}});return n}function rb(t){const e=[];let n=H(t,a=>{return ft(t,(s,o)=>{if(a.PATTERN.source===o.PATTERN.source&&!ht(e,o)&&o.PATTERN!==Rt.NA){e.push(o);s.push(o);return s}return s},[])});n=es(n);const r=It(n,a=>{return a.length>1});const i=H(r,a=>{const s=H(a,l=>{return l.name});const o=zt(a).PATTERN;return{message:`The same RegExp pattern ->${o}<-has been used in all of the following Token Types: ${s.join(", ")} <-`,type:De.DUPLICATE_PATTERNS_FOUND,tokenTypes:a}});return i}function ib(t){const e=It(t,r=>{if(!Q(r,"GROUP")){return false}const i=r.GROUP;return i!==Rt.SKIPPED&&i!==Rt.NA&&!$t(i)});const n=H(e,r=>{return{message:"Token Type: ->"+r.name+"<- static 'GROUP' can only be Lexer.SKIPPED/Lexer.NA/A String",type:De.INVALID_GROUP_TYPE_FOUND,tokenTypes:[r]}});return n}function ab(t,e){const n=It(t,i=>{return i.PUSH_MODE!==void 0&&!ht(e,i.PUSH_MODE)});const r=H(n,i=>{const a=`Token Type: ->${i.name}<- static 'PUSH_MODE' value cannot refer to a Lexer Mode ->${i.PUSH_MODE}<-which does not exist`;return{message:a,type:De.PUSH_MODE_DOES_NOT_EXIST,tokenTypes:[i]}});return r}function sb(t){const e=[];const n=ft(t,(r,i,a)=>{const s=i.PATTERN;if(s===Rt.NA){return r}if($t(s)){r.push({str:s,idx:a,tokenType:i})}else if(In(s)&&lb(s)){r.push({str:s.source,idx:a,tokenType:i})}return r},[]);X(t,(r,i)=>{X(n,({str:a,idx:s,tokenType:o})=>{if(i<s&&ob(a,r.PATTERN)){const l=`Token: ->${o.name}<- can never be matched.
Because it appears AFTER the Token Type ->${r.name}<-in the lexer's definition.
See https://chevrotain.io/docs/guide/resolving_lexer_errors.html#UNREACHABLE`;e.push({message:l,type:De.UNREACHABLE_PATTERN,tokenTypes:[r,o]})}})});return e}function ob(t,e){if(In(e)){const n=e.exec(t);return n!==null&&n.index===0}else if(Mn(e)){return e(t,0,[],{})}else if(Q(e,"exec")){return e.exec(t,0,[],{})}else if(typeof e==="string"){return e===t}else{throw Error("non exhaustive match")}}function lb(t){const e=[".","\\","[","]","|","^","$","(",")","?","*","+","{"];return Ur(e,n=>t.source.indexOf(n)!==-1)===void 0}function Nm(t){const e=t.ignoreCase?"i":"";return new RegExp(`^(?:${t.source})`,e)}function Pm(t){const e=t.ignoreCase?"iy":"y";return new RegExp(`${t.source}`,e)}function ub(t,e,n){const r=[];if(!Q(t,fa)){r.push({message:"A MultiMode Lexer cannot be initialized without a <"+fa+"> property in its definition\n",type:De.MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE})}if(!Q(t,Os)){r.push({message:"A MultiMode Lexer cannot be initialized without a <"+Os+"> property in its definition\n",type:De.MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY})}if(Q(t,Os)&&Q(t,fa)&&!Q(t.modes,t.defaultMode)){r.push({message:`A MultiMode Lexer cannot be initialized with a ${fa}: <${t.defaultMode}>which does not exist
`,type:De.MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST})}if(Q(t,Os)){X(t.modes,(i,a)=>{X(i,(s,o)=>{if(On(s)){r.push({message:`A Lexer cannot be initialized using an undefined Token Type. Mode:<${a}> at index: <${o}>
`,type:De.LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED})}else if(Q(s,"LONGER_ALT")){const l=oe(s.LONGER_ALT)?s.LONGER_ALT:[s.LONGER_ALT];X(l,u=>{if(!On(u)&&!ht(i,u)){r.push({message:`A MultiMode Lexer cannot be initialized with a longer_alt <${u.name}> on token <${s.name}> outside of mode <${a}>
`,type:De.MULTI_MODE_LEXER_LONGER_ALT_NOT_IN_CURRENT_MODE})}})}})})}return r}function cb(t,e,n){const r=[];let i=false;const a=es(Ft(Be(t.modes)));const s=Xu(a,l=>l[vr]===Rt.NA);const o=RR(n);if(e){X(s,l=>{const u=gR(l,o);if(u!==false){const c=mb(l,u);const d={message:c,type:u.issue,tokenType:l};r.push(d)}else{if(Q(l,"LINE_BREAKS")){if(l.LINE_BREAKS===true){i=true}}else{if(Cp(o,l.PATTERN)){i=true}}}})}if(e&&!i){r.push({message:"Warning: No LINE_BREAKS Found.\n	This Lexer has been defined to track line and column information,\n	But none of the Token Types can be identified as matching a line terminator.\n	See https://chevrotain.io/docs/guide/resolving_lexer_errors.html#LINE_BREAKS \n	for details.",type:De.NO_LINE_BREAKS_FLAGS})}return r}function db(t){const e={};const n=Ht(t);X(n,r=>{const i=t[r];if(oe(i)){e[r]=[]}else{throw Error("non exhaustive match")}});return e}function yR(t){const e=t.PATTERN;if(In(e)){return false}else if(Mn(e)){return true}else if(Q(e,"exec")){return true}else if($t(e)){return false}else{throw Error("non exhaustive match")}}function fb(t){if($t(t)&&t.length===1){return t.charCodeAt(0)}else{return false}}const pb={test:function(t){const e=t.length;for(let n=this.lastIndex;n<e;n++){const r=t.charCodeAt(n);if(r===10){this.lastIndex=n+1;return true}else if(r===13){if(t.charCodeAt(n+1)===10){this.lastIndex=n+2}else{this.lastIndex=n+1}return true}}return false},lastIndex:0};function gR(t,e){if(Q(t,"LINE_BREAKS")){return false}else{if(In(t.PATTERN)){try{Cp(e,t.PATTERN)}catch(n){return{issue:De.IDENTIFY_TERMINATOR,errMsg:n.message}}return false}else if($t(t.PATTERN)){return false}else if(yR(t)){return{issue:De.CUSTOM_LINE_BREAK}}else{throw Error("non exhaustive match")}}}function mb(t,e){if(e.issue===De.IDENTIFY_TERMINATOR){return`Warning: unable to identify line terminator usage in pattern.
	The problem is in the <${t.name}> Token Type
	 Root cause: ${e.errMsg}.
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#IDENTIFY_TERMINATOR`}else if(e.issue===De.CUSTOM_LINE_BREAK){return`Warning: A Custom Token Pattern should specify the <line_breaks> option.
	The problem is in the <${t.name}> Token Type
	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#CUSTOM_LINE_BREAK`}else{throw Error("non exhaustive match")}}function RR(t){const e=H(t,n=>{if($t(n)){return n.charCodeAt(0)}else{return n}});return e}function mc(t,e,n){if(t[e]===void 0){t[e]=[n]}else{t[e].push(n)}}const pa=256;let Ul=[];function Vn(t){return t<pa?t:Ul[t]}function hb(){if(ye(Ul)){Ul=new Array(65536);for(let t=0;t<65536;t++){Ul[t]=t>255?255+~~(t/255):t}}}function ns(t,e){const n=t.tokenTypeIdx;if(n===e.tokenTypeIdx){return true}else{return e.isParent===true&&e.categoryMatchesMap[n]===true}}function cu(t,e){return t.tokenTypeIdx===e.tokenTypeIdx}let _m=1;const $R={};function rs(t){const e=yb(t);gb(e);$b(e);Rb(e);X(e,n=>{n.isParent=n.categoryMatches.length>0})}function yb(t){let e=tt(t);let n=t;let r=true;while(r){n=es(Ft(H(n,a=>a.CATEGORIES)));const i=zu(n,e);e=e.concat(i);if(ye(i)){r=false}else{n=i}}return e}function gb(t){X(t,e=>{if(!TR(e)){$R[_m]=e;e.tokenTypeIdx=_m++}if(Dm(e)&&!oe(e.CATEGORIES)){e.CATEGORIES=[e.CATEGORIES]}if(!Dm(e)){e.CATEGORIES=[]}if(!vb(e)){e.categoryMatches=[]}if(!Tb(e)){e.categoryMatchesMap={}}})}function Rb(t){X(t,e=>{e.categoryMatches=[];X(e.categoryMatchesMap,(n,r)=>{e.categoryMatches.push($R[r].tokenTypeIdx)})})}function $b(t){X(t,e=>{vR([],e)})}function vR(t,e){X(t,n=>{e.categoryMatchesMap[n.tokenTypeIdx]=true});X(e.CATEGORIES,n=>{const r=t.concat(e);if(!ht(r,n)){vR(r,n)}})}function TR(t){return Q(t,"tokenTypeIdx")}function Dm(t){return Q(t,"CATEGORIES")}function vb(t){return Q(t,"categoryMatches")}function Tb(t){return Q(t,"categoryMatchesMap")}function wb(t){return Q(t,"tokenTypeIdx")}const Kd={buildUnableToPopLexerModeMessage(t){return`Unable to pop Lexer Mode after encountering Token ->${t.image}<- The Mode Stack is empty`},buildUnexpectedCharactersMessage(t,e,n,r,i){return`unexpected character: ->${t.charAt(e)}<- at offset: ${e}, skipped ${n} characters.`}};var De;(function(t){t[t["MISSING_PATTERN"]=0]="MISSING_PATTERN";t[t["INVALID_PATTERN"]=1]="INVALID_PATTERN";t[t["EOI_ANCHOR_FOUND"]=2]="EOI_ANCHOR_FOUND";t[t["UNSUPPORTED_FLAGS_FOUND"]=3]="UNSUPPORTED_FLAGS_FOUND";t[t["DUPLICATE_PATTERNS_FOUND"]=4]="DUPLICATE_PATTERNS_FOUND";t[t["INVALID_GROUP_TYPE_FOUND"]=5]="INVALID_GROUP_TYPE_FOUND";t[t["PUSH_MODE_DOES_NOT_EXIST"]=6]="PUSH_MODE_DOES_NOT_EXIST";t[t["MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE"]=7]="MULTI_MODE_LEXER_WITHOUT_DEFAULT_MODE";t[t["MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY"]=8]="MULTI_MODE_LEXER_WITHOUT_MODES_PROPERTY";t[t["MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST"]=9]="MULTI_MODE_LEXER_DEFAULT_MODE_VALUE_DOES_NOT_EXIST";t[t["LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED"]=10]="LEXER_DEFINITION_CANNOT_CONTAIN_UNDEFINED";t[t["SOI_ANCHOR_FOUND"]=11]="SOI_ANCHOR_FOUND";t[t["EMPTY_MATCH_PATTERN"]=12]="EMPTY_MATCH_PATTERN";t[t["NO_LINE_BREAKS_FLAGS"]=13]="NO_LINE_BREAKS_FLAGS";t[t["UNREACHABLE_PATTERN"]=14]="UNREACHABLE_PATTERN";t[t["IDENTIFY_TERMINATOR"]=15]="IDENTIFY_TERMINATOR";t[t["CUSTOM_LINE_BREAK"]=16]="CUSTOM_LINE_BREAK";t[t["MULTI_MODE_LEXER_LONGER_ALT_NOT_IN_CURRENT_MODE"]=17]="MULTI_MODE_LEXER_LONGER_ALT_NOT_IN_CURRENT_MODE"})(De||(De={}));const ma={deferDefinitionErrorsHandling:false,positionTracking:"full",lineTerminatorsPattern:/\n|\r\n?/g,lineTerminatorCharacters:["\n","\r"],ensureOptimizations:false,safeMode:false,errorMessageProvider:Kd,traceInitPerf:false,skipValidations:false,recoveryEnabled:true};Object.freeze(ma);class Rt{constructor(e,n=ma){this.lexerDefinition=e;this.lexerDefinitionErrors=[];this.lexerDefinitionWarning=[];this.patternIdxToConfig={};this.charCodeToPatternIdxToConfig={};this.modes=[];this.emptyGroups={};this.trackStartLines=true;this.trackEndLines=true;this.hasCustom=false;this.canModeBeOptimized={};this.TRACE_INIT=(i,a)=>{if(this.traceInitPerf===true){this.traceInitIndent++;const s=new Array(this.traceInitIndent+1).join("	");if(this.traceInitIndent<this.traceInitMaxIdent){console.log(`${s}--> <${i}>`)}const{time:o,value:l}=dR(a);const u=o>10?console.warn:console.log;if(this.traceInitIndent<this.traceInitMaxIdent){u(`${s}<-- <${i}> time: ${o}ms`)}this.traceInitIndent--;return l}else{return a()}};if(typeof n==="boolean"){throw Error("The second argument to the Lexer constructor is now an ILexerConfig Object.\na boolean 2nd argument is no longer supported")}this.config=Dt({},ma,n);const r=this.config.traceInitPerf;if(r===true){this.traceInitMaxIdent=Infinity;this.traceInitPerf=true}else if(typeof r==="number"){this.traceInitMaxIdent=r;this.traceInitPerf=true}this.traceInitIndent=-1;this.TRACE_INIT("Lexer Constructor",()=>{let i;let a=true;this.TRACE_INIT("Lexer Config handling",()=>{if(this.config.lineTerminatorsPattern===ma.lineTerminatorsPattern){this.config.lineTerminatorsPattern=pb}else{if(this.config.lineTerminatorCharacters===ma.lineTerminatorCharacters){throw Error("Error: Missing <lineTerminatorCharacters> property on the Lexer config.\n	For details See: https://chevrotain.io/docs/guide/resolving_lexer_errors.html#MISSING_LINE_TERM_CHARS")}}if(n.safeMode&&n.ensureOptimizations){throw Error('"safeMode" and "ensureOptimizations" flags are mutually exclusive.')}this.trackStartLines=/full|onlyStart/i.test(this.config.positionTracking);this.trackEndLines=/full/i.test(this.config.positionTracking);if(oe(e)){i={modes:{defaultMode:tt(e)},defaultMode:fa}}else{a=false;i=tt(e)}});if(this.config.skipValidations===false){this.TRACE_INIT("performRuntimeChecks",()=>{this.lexerDefinitionErrors=this.lexerDefinitionErrors.concat(ub(i,this.trackStartLines,this.config.lineTerminatorCharacters))});this.TRACE_INIT("performWarningRuntimeChecks",()=>{this.lexerDefinitionWarning=this.lexerDefinitionWarning.concat(cb(i,this.trackStartLines,this.config.lineTerminatorCharacters))})}i.modes=i.modes?i.modes:{};X(i.modes,(o,l)=>{i.modes[l]=Xu(o,u=>On(u))});const s=Ht(i.modes);X(i.modes,(o,l)=>{this.TRACE_INIT(`Mode: <${l}> processing`,()=>{this.modes.push(l);if(this.config.skipValidations===false){this.TRACE_INIT(`validatePatterns`,()=>{this.lexerDefinitionErrors=this.lexerDefinitionErrors.concat(VA(o,s))})}if(ye(this.lexerDefinitionErrors)){rs(o);let u;this.TRACE_INIT(`analyzeTokenTypes`,()=>{u=WA(o,{lineTerminatorCharacters:this.config.lineTerminatorCharacters,positionTracking:n.positionTracking,ensureOptimizations:n.ensureOptimizations,safeMode:n.safeMode,tracer:this.TRACE_INIT})});this.patternIdxToConfig[l]=u.patternIdxToConfig;this.charCodeToPatternIdxToConfig[l]=u.charCodeToPatternIdxToConfig;this.emptyGroups=Dt({},this.emptyGroups,u.emptyGroups);this.hasCustom=u.hasCustom||this.hasCustom;this.canModeBeOptimized[l]=u.canBeOptimized}})});this.defaultMode=i.defaultMode;if(!ye(this.lexerDefinitionErrors)&&!this.config.deferDefinitionErrorsHandling){const o=H(this.lexerDefinitionErrors,u=>{return u.message});const l=o.join("-----------------------\n");throw new Error("Errors detected in definition of Lexer:\n"+l)}X(this.lexerDefinitionWarning,o=>{cR(o.message)});this.TRACE_INIT("Choosing sub-methods implementations",()=>{if(hR){this.chopInput=Rr;this.match=this.matchWithTest}else{this.updateLastIndex=je;this.match=this.matchWithExec}if(a){this.handleModes=je}if(this.trackStartLines===false){this.computeNewColumn=Rr}if(this.trackEndLines===false){this.updateTokenEndLineColumnLocation=je}if(/full/i.test(this.config.positionTracking)){this.createTokenInstance=this.createFullToken}else if(/onlyStart/i.test(this.config.positionTracking)){this.createTokenInstance=this.createStartOnlyToken}else if(/onlyOffset/i.test(this.config.positionTracking)){this.createTokenInstance=this.createOffsetOnlyToken}else{throw Error(`Invalid <positionTracking> config option: "${this.config.positionTracking}"`)}if(this.hasCustom){this.addToken=this.addTokenUsingPush;this.handlePayload=this.handlePayloadWithCustom}else{this.addToken=this.addTokenUsingMemberAccess;this.handlePayload=this.handlePayloadNoCustom}});this.TRACE_INIT("Failed Optimization Warnings",()=>{const o=ft(this.canModeBeOptimized,(l,u,c)=>{if(u===false){l.push(c)}return l},[]);if(n.ensureOptimizations&&!ye(o)){throw Error(`Lexer Modes: < ${o.join(", ")} > cannot be optimized.
	 Disable the "ensureOptimizations" lexer config flag to silently ignore this and run the lexer in an un-optimized mode.
	 Or inspect the console log for details on how to resolve these issues.`)}});this.TRACE_INIT("clearRegExpParserCache",()=>{HA()});this.TRACE_INIT("toFastProperties",()=>{fR(this)})})}tokenize(e,n=this.defaultMode){if(!ye(this.lexerDefinitionErrors)){const r=H(this.lexerDefinitionErrors,a=>{return a.message});const i=r.join("-----------------------\n");throw new Error("Unable to Tokenize because Errors detected in definition of Lexer:\n"+i)}return this.tokenizeInternal(e,n)}tokenizeInternal(e,n){let r,i,a,s,o,l,u,c,d,f,p,y,v,b,$;const w=e;const C=w.length;let O=0;let Y=0;const q=this.hasCustom?0:Math.floor(e.length/10);const J=new Array(q);const te=[];let ie=this.trackStartLines?1:void 0;let ce=this.trackStartLines?1:void 0;const L=db(this.emptyGroups);const E=this.trackStartLines;const g=this.config.lineTerminatorsPattern;let k=0;let M=[];let I=[];const x=[];const we=[];Object.freeze(we);let F;function N(){return M}function ne(pe){const Ne=Vn(pe);const He=I[Ne];if(He===void 0){return we}else{return He}}const Et=pe=>{if(x.length===1&&pe.tokenType.PUSH_MODE===void 0){const Ne=this.config.errorMessageProvider.buildUnableToPopLexerModeMessage(pe);te.push({offset:pe.startOffset,line:pe.startLine,column:pe.startColumn,length:pe.image.length,message:Ne})}else{x.pop();const Ne=Fr(x);M=this.patternIdxToConfig[Ne];I=this.charCodeToPatternIdxToConfig[Ne];k=M.length;const He=this.canModeBeOptimized[Ne]&&this.config.safeMode===false;if(I&&He){F=ne}else{F=N}}};function Ct(pe){x.push(pe);I=this.charCodeToPatternIdxToConfig[pe];M=this.patternIdxToConfig[pe];k=M.length;k=M.length;const Ne=this.canModeBeOptimized[pe]&&this.config.safeMode===false;if(I&&Ne){F=ne}else{F=N}}Ct.call(this,n);let Ee;const St=this.config.recoveryEnabled;while(O<C){l=null;const pe=w.charCodeAt(O);const Ne=F(pe);const He=Ne.length;for(r=0;r<He;r++){Ee=Ne[r];const ge=Ee.pattern;u=null;const j=Ee.short;if(j!==false){if(pe===j){l=ge}}else if(Ee.isCustom===true){$=ge.exec(w,O,J,L);if($!==null){l=$[0];if($.payload!==void 0){u=$.payload}}else{l=null}}else{this.updateLastIndex(ge,O);l=this.match(ge,e,O)}if(l!==null){o=Ee.longerAlt;if(o!==void 0){const R=o.length;for(a=0;a<R;a++){const A=M[o[a]];const B=A.pattern;c=null;if(A.isCustom===true){$=B.exec(w,O,J,L);if($!==null){s=$[0];if($.payload!==void 0){c=$.payload}}else{s=null}}else{this.updateLastIndex(B,O);s=this.match(B,e,O)}if(s&&s.length>l.length){l=s;u=c;Ee=A;break}}}break}}if(l!==null){d=l.length;f=Ee.group;if(f!==void 0){p=Ee.tokenTypeIdx;y=this.createTokenInstance(l,O,p,Ee.tokenType,ie,ce,d);this.handlePayload(y,u);if(f===false){Y=this.addToken(J,Y,y)}else{L[f].push(y)}}e=this.chopInput(e,d);O=O+d;ce=this.computeNewColumn(ce,d);if(E===true&&Ee.canLineTerminator===true){let ge=0;let j;let R;g.lastIndex=0;do{j=g.test(l);if(j===true){R=g.lastIndex-1;ge++}}while(j===true);if(ge!==0){ie=ie+ge;ce=d-R;this.updateTokenEndLineColumnLocation(y,f,R,ge,ie,ce,d)}}this.handleModes(Ee,Et,Ct,y)}else{const ge=O;const j=ie;const R=ce;let A=St===false;while(A===false&&O<C){e=this.chopInput(e,1);O++;for(i=0;i<k;i++){const B=M[i];const S=B.pattern;const de=B.short;if(de!==false){if(w.charCodeAt(O)===de){A=true}}else if(B.isCustom===true){A=S.exec(w,O,J,L)!==null}else{this.updateLastIndex(S,O);A=S.exec(e)!==null}if(A===true){break}}}v=O-ge;ce=this.computeNewColumn(ce,v);b=this.config.errorMessageProvider.buildUnexpectedCharactersMessage(w,ge,v,j,R);te.push({offset:ge,line:j,column:R,length:v,message:b});if(St===false){break}}}if(!this.hasCustom){J.length=Y}return{tokens:J,groups:L,errors:te}}handleModes(e,n,r,i){if(e.pop===true){const a=e.push;n(i);if(a!==void 0){r.call(this,a)}}else if(e.push!==void 0){r.call(this,e.push)}}chopInput(e,n){return e.substring(n)}updateLastIndex(e,n){e.lastIndex=n}updateTokenEndLineColumnLocation(e,n,r,i,a,s,o){let l,u;if(n!==void 0){l=r===o-1;u=l?-1:0;if(!(i===1&&l===true)){e.endLine=a+u;e.endColumn=s-1+-u}}}computeNewColumn(e,n){return e+n}createOffsetOnlyToken(e,n,r,i){return{image:e,startOffset:n,tokenTypeIdx:r,tokenType:i}}createStartOnlyToken(e,n,r,i,a,s){return{image:e,startOffset:n,startLine:a,startColumn:s,tokenTypeIdx:r,tokenType:i}}createFullToken(e,n,r,i,a,s,o){return{image:e,startOffset:n,endOffset:n+o-1,startLine:a,endLine:a,startColumn:s,endColumn:s+o-1,tokenTypeIdx:r,tokenType:i}}addTokenUsingPush(e,n,r){e.push(r);return n}addTokenUsingMemberAccess(e,n,r){e[n]=r;n++;return n}handlePayloadNoCustom(e,n){}handlePayloadWithCustom(e,n){if(n!==null){e.payload=n}}matchWithTest(e,n,r){const i=e.test(n);if(i===true){return n.substring(r,e.lastIndex)}return null}matchWithExec(e,n){const r=e.exec(n);return r!==null?r[0]:null}}Rt.SKIPPED="This marks a skipped Token pattern, this means each token identified by it willbe consumed and then thrown into oblivion, this can be used to for example to completely ignore whitespace.";Rt.NA=/NOT_APPLICABLE/;function xr(t){if(wR(t)){return t.LABEL}else{return t.name}}function wR(t){return $t(t.LABEL)&&t.LABEL!==""}const Eb="parent";const Im="categories";const Om="label";const Lm="group";const xm="push_mode";const Mm="pop_mode";const Km="longer_alt";const Fm="line_breaks";const Um="start_chars_hint";function ER(t){return Cb(t)}function Cb(t){const e=t.pattern;const n={};n.name=t.name;if(!On(e)){n.PATTERN=e}if(Q(t,Eb)){throw"The parent property is no longer supported.\nSee: https://github.com/chevrotain/chevrotain/issues/564#issuecomment-349062346 for details."}if(Q(t,Im)){n.CATEGORIES=t[Im]}rs([n]);if(Q(t,Om)){n.LABEL=t[Om]}if(Q(t,Lm)){n.GROUP=t[Lm]}if(Q(t,Mm)){n.POP_MODE=t[Mm]}if(Q(t,xm)){n.PUSH_MODE=t[xm]}if(Q(t,Km)){n.LONGER_ALT=t[Km]}if(Q(t,Fm)){n.LINE_BREAKS=t[Fm]}if(Q(t,Um)){n.START_CHARS_HINT=t[Um]}return n}const zn=ER({name:"EOF",pattern:Rt.NA});rs([zn]);function Sp(t,e,n,r,i,a,s,o){return{image:e,startOffset:n,endOffset:r,startLine:i,endLine:a,startColumn:s,endColumn:o,tokenTypeIdx:t.tokenTypeIdx,tokenType:t}}function CR(t,e){return ns(t,e)}const Or={buildMismatchTokenMessage({expected:t,actual:e,previous:n,ruleName:r}){const i=wR(t);const a=i?`--> ${xr(t)} <--`:`token of type --> ${t.name} <--`;const s=`Expecting ${a} but found --> '${e.image}' <--`;return s},buildNotAllInputParsedMessage({firstRedundant:t,ruleName:e}){return"Redundant input, expecting EOF but found: "+t.image},buildNoViableAltMessage({expectedPathsPerAlt:t,actual:e,previous:n,customUserDescription:r,ruleName:i}){const a="Expecting: ";const s=zt(e).image;const o="\nbut found: '"+s+"'";if(r){return a+r+o}else{const l=ft(t,(f,p)=>f.concat(p),[]);const u=H(l,f=>`[${H(f,p=>xr(p)).join(", ")}]`);const c=H(u,(f,p)=>`  ${p+1}. ${f}`);const d=`one of these possible Token sequences:
${c.join("\n")}`;return a+d+o}},buildEarlyExitMessage({expectedIterationPaths:t,actual:e,customUserDescription:n,ruleName:r}){const i="Expecting: ";const a=zt(e).image;const s="\nbut found: '"+a+"'";if(n){return i+n+s}else{const o=H(t,u=>`[${H(u,c=>xr(c)).join(",")}]`);const l=`expecting at least one iteration which starts with one of these possible Token sequences::
  <${o.join(" ,")}>`;return i+l+s}}};Object.freeze(Or);const Sb={buildRuleNotFoundError(t,e){const n="Invalid grammar, reference to a rule which is not defined: ->"+e.nonTerminalName+"<-\ninside top level rule: ->"+t.name+"<-";return n}};const fr={buildDuplicateFoundError(t,e){function n(c){if(c instanceof Te){return c.terminalType.name}else if(c instanceof pt){return c.nonTerminalName}else{return""}}const r=t.name;const i=zt(e);const a=i.idx;const s=en(i);const o=n(i);const l=a>0;let u=`->${s}${l?a:""}<- ${o?`with argument: ->${o}<-`:""}
                  appears more than once (${e.length} times) in the top level rule: ->${r}<-.                  
                  For further details see: https://chevrotain.io/docs/FAQ.html#NUMERICAL_SUFFIXES 
                  `;u=u.replace(/[ \t]+/g," ");u=u.replace(/\s\s+/g,"\n");return u},buildNamespaceConflictError(t){const e=`Namespace conflict found in grammar.
The grammar has both a Terminal(Token) and a Non-Terminal(Rule) named: <${t.name}>.
To resolve this make sure each Terminal and Non-Terminal names are unique
This is easy to accomplish by using the convention that Terminal names start with an uppercase letter
and Non-Terminal names start with a lower case letter.`;return e},buildAlternationPrefixAmbiguityError(t){const e=H(t.prefixPath,i=>xr(i)).join(", ");const n=t.alternation.idx===0?"":t.alternation.idx;const r=`Ambiguous alternatives: <${t.ambiguityIndices.join(" ,")}> due to common lookahead prefix
in <OR${n}> inside <${t.topLevelRule.name}> Rule,
<${e}> may appears as a prefix path in all these alternatives.
See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#COMMON_PREFIX
For Further details.`;return r},buildAlternationAmbiguityError(t){const e=H(t.prefixPath,i=>xr(i)).join(", ");const n=t.alternation.idx===0?"":t.alternation.idx;let r=`Ambiguous Alternatives Detected: <${t.ambiguityIndices.join(" ,")}> in <OR${n}> inside <${t.topLevelRule.name}> Rule,
<${e}> may appears as a prefix path in all these alternatives.
`;r=r+`See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#AMBIGUOUS_ALTERNATIVES
For Further details.`;return r},buildEmptyRepetitionError(t){let e=en(t.repetition);if(t.repetition.idx!==0){e+=t.repetition.idx}const n=`The repetition <${e}> within Rule <${t.topLevelRule.name}> can never consume any tokens.
This could lead to an infinite loop.`;return n},buildTokenNameError(t){return"deprecated"},buildEmptyAlternationError(t){const e=`Ambiguous empty alternative: <${t.emptyChoiceIdx+1}> in <OR${t.alternation.idx}> inside <${t.topLevelRule.name}> Rule.
Only the last alternative may be an empty alternative.`;return e},buildTooManyAlternativesError(t){const e=`An Alternation cannot have more than 256 alternatives:
<OR${t.alternation.idx}> inside <${t.topLevelRule.name}> Rule.
 has ${t.alternation.definition.length+1} alternatives.`;return e},buildLeftRecursionError(t){const e=t.topLevelRule.name;const n=H(t.leftRecursionPath,a=>a.name);const r=`${e} --> ${n.concat([e]).join(" --> ")}`;const i=`Left Recursion found in grammar.
rule: <${e}> can be invoked from itself (directly or indirectly)
without consuming any Tokens. The grammar path that causes this is: 
 ${r}
 To fix this refactor your grammar to remove the left recursion.
see: https://en.wikipedia.org/wiki/LL_parser#Left_factoring.`;return i},buildInvalidRuleNameError(t){return"deprecated"},buildDuplicateRuleNameError(t){let e;if(t.topLevelRule instanceof zr){e=t.topLevelRule.name}else{e=t.topLevelRule}const n=`Duplicate definition, rule: ->${e}<- is already defined in the grammar: ->${t.grammarName}<-`;return n}};function Ab(t,e){const n=new bb(t,e);n.resolveRefs();return n.errors}class bb extends Xr{constructor(e,n){super();this.nameToTopRule=e;this.errMsgProvider=n;this.errors=[]}resolveRefs(){X(Be(this.nameToTopRule),e=>{this.currTopLevel=e;e.accept(this)})}visitNonTerminal(e){const n=this.nameToTopRule[e.nonTerminalName];if(!n){const r=this.errMsgProvider.buildRuleNotFoundError(this.currTopLevel,e);this.errors.push({message:r,type:mt.UNRESOLVED_SUBRULE_REF,ruleName:this.currTopLevel.name,unresolvedRefName:e.nonTerminalName})}else{e.referencedRule=n}}}class kb extends Yu{constructor(e,n){super();this.topProd=e;this.path=n;this.possibleTokTypes=[];this.nextProductionName="";this.nextProductionOccurrence=0;this.found=false;this.isAtEndOfPath=false}startWalking(){this.found=false;if(this.path.ruleStack[0]!==this.topProd.name){throw Error("The path does not start with the walker's top Rule!")}this.ruleStack=tt(this.path.ruleStack).reverse();this.occurrenceStack=tt(this.path.occurrenceStack).reverse();this.ruleStack.pop();this.occurrenceStack.pop();this.updateExpectedNext();this.walk(this.topProd);return this.possibleTokTypes}walk(e,n=[]){if(!this.found){super.walk(e,n)}}walkProdRef(e,n,r){if(e.referencedRule.name===this.nextProductionName&&e.idx===this.nextProductionOccurrence){const i=n.concat(r);this.updateExpectedNext();this.walk(e.referencedRule,i)}}updateExpectedNext(){if(ye(this.ruleStack)){this.nextProductionName="";this.nextProductionOccurrence=0;this.isAtEndOfPath=true}else{this.nextProductionName=this.ruleStack.pop();this.nextProductionOccurrence=this.occurrenceStack.pop()}}}class Nb extends kb{constructor(e,n){super(e,n);this.path=n;this.nextTerminalName="";this.nextTerminalOccurrence=0;this.nextTerminalName=this.path.lastTok.name;this.nextTerminalOccurrence=this.path.lastTokOccurrence}walkTerminal(e,n,r){if(this.isAtEndOfPath&&e.terminalType.name===this.nextTerminalName&&e.idx===this.nextTerminalOccurrence&&!this.found){const i=n.concat(r);const a=new vt({definition:i});this.possibleTokTypes=ts(a);this.found=true}}}class Qu extends Yu{constructor(e,n){super();this.topRule=e;this.occurrence=n;this.result={token:void 0,occurrence:void 0,isEndOfRule:void 0}}startWalking(){this.walk(this.topRule);return this.result}}class Pb extends Qu{walkMany(e,n,r){if(e.idx===this.occurrence){const i=zt(n.concat(r));this.result.isEndOfRule=i===void 0;if(i instanceof Te){this.result.token=i.terminalType;this.result.occurrence=i.idx}}else{super.walkMany(e,n,r)}}}class Gm extends Qu{walkManySep(e,n,r){if(e.idx===this.occurrence){const i=zt(n.concat(r));this.result.isEndOfRule=i===void 0;if(i instanceof Te){this.result.token=i.terminalType;this.result.occurrence=i.idx}}else{super.walkManySep(e,n,r)}}}class _b extends Qu{walkAtLeastOne(e,n,r){if(e.idx===this.occurrence){const i=zt(n.concat(r));this.result.isEndOfRule=i===void 0;if(i instanceof Te){this.result.token=i.terminalType;this.result.occurrence=i.idx}}else{super.walkAtLeastOne(e,n,r)}}}class Hm extends Qu{walkAtLeastOneSep(e,n,r){if(e.idx===this.occurrence){const i=zt(n.concat(r));this.result.isEndOfRule=i===void 0;if(i instanceof Te){this.result.token=i.terminalType;this.result.occurrence=i.idx}}else{super.walkAtLeastOneSep(e,n,r)}}}function Fd(t,e,n=[]){n=tt(n);let r=[];let i=0;function a(o){return o.concat(Ye(t,i+1))}function s(o){const l=Fd(a(o),e,n);return r.concat(l)}while(n.length<e&&i<t.length){const o=t[i];if(o instanceof vt){return s(o.definition)}else if(o instanceof pt){return s(o.definition)}else if(o instanceof et){r=s(o.definition)}else if(o instanceof Ot){const l=o.definition.concat([new _e({definition:o.definition})]);return s(l)}else if(o instanceof Lt){const l=[new vt({definition:o.definition}),new _e({definition:[new Te({terminalType:o.separator})].concat(o.definition)})];return s(l)}else if(o instanceof Tt){const l=o.definition.concat([new _e({definition:[new Te({terminalType:o.separator})].concat(o.definition)})]);r=s(l)}else if(o instanceof _e){const l=o.definition.concat([new _e({definition:o.definition})]);r=s(l)}else if(o instanceof wt){X(o.definition,l=>{if(ye(l.definition)===false){r=s(l.definition)}});return r}else if(o instanceof Te){n.push(o.terminalType)}else{throw Error("non exhaustive match")}i++}r.push({partialPath:n,suffixDef:Ye(t,i)});return r}function SR(t,e,n,r){const i="EXIT_NONE_TERMINAL";const a=[i];const s="EXIT_ALTERNATIVE";let o=false;const l=e.length;const u=l-r-1;const c=[];const d=[];d.push({idx:-1,def:t,ruleStack:[],occurrenceStack:[]});while(!ye(d)){const f=d.pop();if(f===s){if(o&&Fr(d).idx<=u){d.pop()}continue}const p=f.def;const y=f.idx;const v=f.ruleStack;const b=f.occurrenceStack;if(ye(p)){continue}const $=p[0];if($===i){const w={idx:y,def:Ye(p),ruleStack:La(v),occurrenceStack:La(b)};d.push(w)}else if($ instanceof Te){if(y<l-1){const w=y+1;const C=e[w];if(n(C,$.terminalType)){const O={idx:w,def:Ye(p),ruleStack:v,occurrenceStack:b};d.push(O)}}else if(y===l-1){c.push({nextTokenType:$.terminalType,nextTokenOccurrence:$.idx,ruleStack:v,occurrenceStack:b});o=true}else{throw Error("non exhaustive match")}}else if($ instanceof pt){const w=tt(v);w.push($.nonTerminalName);const C=tt(b);C.push($.idx);const O={idx:y,def:$.definition.concat(a,Ye(p)),ruleStack:w,occurrenceStack:C};d.push(O)}else if($ instanceof et){const w={idx:y,def:Ye(p),ruleStack:v,occurrenceStack:b};d.push(w);d.push(s);const C={idx:y,def:$.definition.concat(Ye(p)),ruleStack:v,occurrenceStack:b};d.push(C)}else if($ instanceof Ot){const w=new _e({definition:$.definition,idx:$.idx});const C=$.definition.concat([w],Ye(p));const O={idx:y,def:C,ruleStack:v,occurrenceStack:b};d.push(O)}else if($ instanceof Lt){const w=new Te({terminalType:$.separator});const C=new _e({definition:[w].concat($.definition),idx:$.idx});const O=$.definition.concat([C],Ye(p));const Y={idx:y,def:O,ruleStack:v,occurrenceStack:b};d.push(Y)}else if($ instanceof Tt){const w={idx:y,def:Ye(p),ruleStack:v,occurrenceStack:b};d.push(w);d.push(s);const C=new Te({terminalType:$.separator});const O=new _e({definition:[C].concat($.definition),idx:$.idx});const Y=$.definition.concat([O],Ye(p));const q={idx:y,def:Y,ruleStack:v,occurrenceStack:b};d.push(q)}else if($ instanceof _e){const w={idx:y,def:Ye(p),ruleStack:v,occurrenceStack:b};d.push(w);d.push(s);const C=new _e({definition:$.definition,idx:$.idx});const O=$.definition.concat([C],Ye(p));const Y={idx:y,def:O,ruleStack:v,occurrenceStack:b};d.push(Y)}else if($ instanceof wt){for(let w=$.definition.length-1;w>=0;w--){const C=$.definition[w];const O={idx:y,def:C.definition.concat(Ye(p)),ruleStack:v,occurrenceStack:b};d.push(O);d.push(s)}}else if($ instanceof vt){d.push({idx:y,def:$.definition.concat(Ye(p)),ruleStack:v,occurrenceStack:b})}else if($ instanceof zr){d.push(Db($,y,v,b))}else{throw Error("non exhaustive match")}}return c}function Db(t,e,n,r){const i=tt(n);i.push(t.name);const a=tt(r);a.push(1);return{idx:e,def:t.definition,ruleStack:i,occurrenceStack:a}}var Ae;(function(t){t[t["OPTION"]=0]="OPTION";t[t["REPETITION"]=1]="REPETITION";t[t["REPETITION_MANDATORY"]=2]="REPETITION_MANDATORY";t[t["REPETITION_MANDATORY_WITH_SEPARATOR"]=3]="REPETITION_MANDATORY_WITH_SEPARATOR";t[t["REPETITION_WITH_SEPARATOR"]=4]="REPETITION_WITH_SEPARATOR";t[t["ALTERNATION"]=5]="ALTERNATION"})(Ae||(Ae={}));function Ap(t){if(t instanceof et||t==="Option"){return Ae.OPTION}else if(t instanceof _e||t==="Repetition"){return Ae.REPETITION}else if(t instanceof Ot||t==="RepetitionMandatory"){return Ae.REPETITION_MANDATORY}else if(t instanceof Lt||t==="RepetitionMandatoryWithSeparator"){return Ae.REPETITION_MANDATORY_WITH_SEPARATOR}else if(t instanceof Tt||t==="RepetitionWithSeparator"){return Ae.REPETITION_WITH_SEPARATOR}else if(t instanceof wt||t==="Alternation"){return Ae.ALTERNATION}else{throw Error("non exhaustive match")}}function qm(t){const{occurrence:e,rule:n,prodType:r,maxLookahead:i}=t;const a=Ap(r);if(a===Ae.ALTERNATION){return Zu(e,n,i)}else{return ec(e,n,a,i)}}function Ib(t,e,n,r,i,a){const s=Zu(t,e,n);const o=kR(s)?cu:ns;return a(s,r,o,i)}function Ob(t,e,n,r,i,a){const s=ec(t,e,i,n);const o=kR(s)?cu:ns;return a(s[0],o,r)}function Lb(t,e,n,r){const i=t.length;const a=Bt(t,s=>{return Bt(s,o=>{return o.length===1})});if(e){return function(s){const o=H(s,l=>l.GATE);for(let l=0;l<i;l++){const u=t[l];const c=u.length;const d=o[l];if(d!==void 0&&d.call(this)===false){continue}e:for(let f=0;f<c;f++){const p=u[f];const y=p.length;for(let v=0;v<y;v++){const b=this.LA(v+1);if(n(b,p[v])===false){continue e}}return l}}return void 0}}else if(a&&!r){const s=H(t,l=>{return Ft(l)});const o=ft(s,(l,u,c)=>{X(u,d=>{if(!Q(l,d.tokenTypeIdx)){l[d.tokenTypeIdx]=c}X(d.categoryMatches,f=>{if(!Q(l,f)){l[f]=c}})});return l},{});return function(){const l=this.LA(1);return o[l.tokenTypeIdx]}}else{return function(){for(let s=0;s<i;s++){const o=t[s];const l=o.length;e:for(let u=0;u<l;u++){const c=o[u];const d=c.length;for(let f=0;f<d;f++){const p=this.LA(f+1);if(n(p,c[f])===false){continue e}}return s}}return void 0}}}function xb(t,e,n){const r=Bt(t,a=>{return a.length===1});const i=t.length;if(r&&!n){const a=Ft(t);if(a.length===1&&ye(a[0].categoryMatches)){const s=a[0];const o=s.tokenTypeIdx;return function(){return this.LA(1).tokenTypeIdx===o}}else{const s=ft(a,(o,l,u)=>{o[l.tokenTypeIdx]=true;X(l.categoryMatches,c=>{o[c]=true});return o},[]);return function(){const o=this.LA(1);return s[o.tokenTypeIdx]===true}}}else{return function(){e:for(let a=0;a<i;a++){const s=t[a];const o=s.length;for(let l=0;l<o;l++){const u=this.LA(l+1);if(e(u,s[l])===false){continue e}}return true}return false}}}class Mb extends Yu{constructor(e,n,r){super();this.topProd=e;this.targetOccurrence=n;this.targetProdType=r}startWalking(){this.walk(this.topProd);return this.restDef}checkIsTarget(e,n,r,i){if(e.idx===this.targetOccurrence&&this.targetProdType===n){this.restDef=r.concat(i);return true}return false}walkOption(e,n,r){if(!this.checkIsTarget(e,Ae.OPTION,n,r)){super.walkOption(e,n,r)}}walkAtLeastOne(e,n,r){if(!this.checkIsTarget(e,Ae.REPETITION_MANDATORY,n,r)){super.walkOption(e,n,r)}}walkAtLeastOneSep(e,n,r){if(!this.checkIsTarget(e,Ae.REPETITION_MANDATORY_WITH_SEPARATOR,n,r)){super.walkOption(e,n,r)}}walkMany(e,n,r){if(!this.checkIsTarget(e,Ae.REPETITION,n,r)){super.walkOption(e,n,r)}}walkManySep(e,n,r){if(!this.checkIsTarget(e,Ae.REPETITION_WITH_SEPARATOR,n,r)){super.walkOption(e,n,r)}}}class AR extends Xr{constructor(e,n,r){super();this.targetOccurrence=e;this.targetProdType=n;this.targetRef=r;this.result=[]}checkIsTarget(e,n){if(e.idx===this.targetOccurrence&&this.targetProdType===n&&(this.targetRef===void 0||e===this.targetRef)){this.result=e.definition}}visitOption(e){this.checkIsTarget(e,Ae.OPTION)}visitRepetition(e){this.checkIsTarget(e,Ae.REPETITION)}visitRepetitionMandatory(e){this.checkIsTarget(e,Ae.REPETITION_MANDATORY)}visitRepetitionMandatoryWithSeparator(e){this.checkIsTarget(e,Ae.REPETITION_MANDATORY_WITH_SEPARATOR)}visitRepetitionWithSeparator(e){this.checkIsTarget(e,Ae.REPETITION_WITH_SEPARATOR)}visitAlternation(e){this.checkIsTarget(e,Ae.ALTERNATION)}}function jm(t){const e=new Array(t);for(let n=0;n<t;n++){e[n]=[]}return e}function hc(t){let e=[""];for(let n=0;n<t.length;n++){const r=t[n];const i=[];for(let a=0;a<e.length;a++){const s=e[a];i.push(s+"_"+r.tokenTypeIdx);for(let o=0;o<r.categoryMatches.length;o++){const l="_"+r.categoryMatches[o];i.push(s+l)}}e=i}return e}function Kb(t,e,n){for(let r=0;r<t.length;r++){if(r===n){continue}const i=t[r];for(let a=0;a<e.length;a++){const s=e[a];if(i[s]===true){return false}}}return true}function bR(t,e){const n=H(t,s=>Fd([s],1));const r=jm(n.length);const i=H(n,s=>{const o={};X(s,l=>{const u=hc(l.partialPath);X(u,c=>{o[c]=true})});return o});let a=n;for(let s=1;s<=e;s++){const o=a;a=jm(o.length);for(let l=0;l<o.length;l++){const u=o[l];for(let c=0;c<u.length;c++){const d=u[c].partialPath;const f=u[c].suffixDef;const p=hc(d);const y=Kb(i,p,l);if(y||ye(f)||d.length===e){const v=r[l];if(Ud(v,d)===false){v.push(d);for(let b=0;b<p.length;b++){const $=p[b];i[l][$]=true}}}else{const v=Fd(f,s+1,d);a[l]=a[l].concat(v);X(v,b=>{const $=hc(b.partialPath);X($,w=>{i[l][w]=true})})}}}}return r}function Zu(t,e,n,r){const i=new AR(t,Ae.ALTERNATION,r);e.accept(i);return bR(i.result,n)}function ec(t,e,n,r){const i=new AR(t,n);e.accept(i);const a=i.result;const s=new Mb(e,t,n);const o=s.startWalking();const l=new vt({definition:a});const u=new vt({definition:o});return bR([l,u],r)}function Ud(t,e){e:for(let n=0;n<t.length;n++){const r=t[n];if(r.length!==e.length){continue}for(let i=0;i<r.length;i++){const a=e[i];const s=r[i];const o=a===s||s.categoryMatchesMap[a.tokenTypeIdx]!==void 0;if(o===false){continue e}}return true}return false}function Fb(t,e){return t.length<e.length&&Bt(t,(n,r)=>{const i=e[r];return n===i||i.categoryMatchesMap[n.tokenTypeIdx]})}function kR(t){return Bt(t,e=>Bt(e,n=>Bt(n,r=>ye(r.categoryMatches))))}function Ub(t){const e=t.lookaheadStrategy.validate({rules:t.rules,tokenTypes:t.tokenTypes,grammarName:t.grammarName});return H(e,n=>Object.assign({type:mt.CUSTOM_LOOKAHEAD_VALIDATION},n))}function Gb(t,e,n,r){const i=_t(t,l=>Hb(l,n));const a=ek(t,e,n);const s=_t(t,l=>Yb(l,n));const o=_t(t,l=>Bb(l,t,r,n));return i.concat(a,s,o)}function Hb(t,e){const n=new jb;t.accept(n);const r=n.allProductions;const i=iA(r,qb);const a=Yt(i,o=>{return o.length>1});const s=H(Be(a),o=>{const l=zt(o);const u=e.buildDuplicateFoundError(t,o);const c=en(l);const d={message:u,type:mt.DUPLICATE_PRODUCTIONS,ruleName:t.name,dslName:c,occurrence:l.idx};const f=NR(l);if(f){d.parameter=f}return d});return s}function qb(t){return`${en(t)}_#_${t.idx}_#_${NR(t)}`}function NR(t){if(t instanceof Te){return t.terminalType.name}else if(t instanceof pt){return t.nonTerminalName}else{return""}}class jb extends Xr{constructor(){super(...arguments);this.allProductions=[]}visitNonTerminal(e){this.allProductions.push(e)}visitOption(e){this.allProductions.push(e)}visitRepetitionWithSeparator(e){this.allProductions.push(e)}visitRepetitionMandatory(e){this.allProductions.push(e)}visitRepetitionMandatoryWithSeparator(e){this.allProductions.push(e)}visitRepetition(e){this.allProductions.push(e)}visitAlternation(e){this.allProductions.push(e)}visitTerminal(e){this.allProductions.push(e)}}function Bb(t,e,n,r){const i=[];const a=ft(e,(s,o)=>{if(o.name===t.name){return s+1}return s},0);if(a>1){const s=r.buildDuplicateRuleNameError({topLevelRule:t,grammarName:n});i.push({message:s,type:mt.DUPLICATE_RULE_NAME,ruleName:t.name})}return i}function Wb(t,e,n){const r=[];let i;if(!ht(e,t)){i=`Invalid rule override, rule: ->${t}<- cannot be overridden in the grammar: ->${n}<-as it is not defined in any of the super grammars `;r.push({message:i,type:mt.INVALID_RULE_OVERRIDE,ruleName:t})}return r}function PR(t,e,n,r=[]){const i=[];const a=Gl(e.definition);if(ye(a)){return[]}else{const s=t.name;const o=ht(a,t);if(o){i.push({message:n.buildLeftRecursionError({topLevelRule:t,leftRecursionPath:r}),type:mt.LEFT_RECURSION,ruleName:s})}const l=zu(a,r.concat([t]));const u=_t(l,c=>{const d=tt(r);d.push(c);return PR(t,c,n,d)});return i.concat(u)}}function Gl(t){let e=[];if(ye(t)){return e}const n=zt(t);if(n instanceof pt){e.push(n.referencedRule)}else if(n instanceof vt||n instanceof et||n instanceof Ot||n instanceof Lt||n instanceof Tt||n instanceof _e){e=e.concat(Gl(n.definition))}else if(n instanceof wt){e=Ft(H(n.definition,a=>Gl(a.definition)))}else if(n instanceof Te);else{throw Error("non exhaustive match")}const r=lu(n);const i=t.length>1;if(r&&i){const a=Ye(t);return e.concat(Gl(a))}else{return e}}class bp extends Xr{constructor(){super(...arguments);this.alternations=[]}visitAlternation(e){this.alternations.push(e)}}function Vb(t,e){const n=new bp;t.accept(n);const r=n.alternations;const i=_t(r,a=>{const s=La(a.definition);return _t(s,(o,l)=>{const u=SR([o],[],ns,1);if(ye(u)){return[{message:e.buildEmptyAlternationError({topLevelRule:t,alternation:a,emptyChoiceIdx:l}),type:mt.NONE_LAST_EMPTY_ALT,ruleName:t.name,occurrence:a.idx,alternative:l+1}]}else{return[]}})});return i}function zb(t,e,n){const r=new bp;t.accept(r);let i=r.alternations;i=Xu(i,s=>s.ignoreAmbiguities===true);const a=_t(i,s=>{const o=s.idx;const l=s.maxLookahead||e;const u=Zu(o,t,l,s);const c=Qb(u,s,t,n);const d=Zb(u,s,t,n);return c.concat(d)});return a}class Xb extends Xr{constructor(){super(...arguments);this.allProductions=[]}visitRepetitionWithSeparator(e){this.allProductions.push(e)}visitRepetitionMandatory(e){this.allProductions.push(e)}visitRepetitionMandatoryWithSeparator(e){this.allProductions.push(e)}visitRepetition(e){this.allProductions.push(e)}}function Yb(t,e){const n=new bp;t.accept(n);const r=n.alternations;const i=_t(r,a=>{if(a.definition.length>255){return[{message:e.buildTooManyAlternativesError({topLevelRule:t,alternation:a}),type:mt.TOO_MANY_ALTS,ruleName:t.name,occurrence:a.idx}]}else{return[]}});return i}function Jb(t,e,n){const r=[];X(t,i=>{const a=new Xb;i.accept(a);const s=a.allProductions;X(s,o=>{const l=Ap(o);const u=o.maxLookahead||e;const c=o.idx;const d=ec(c,i,l,u);const f=d[0];if(ye(Ft(f))){const p=n.buildEmptyRepetitionError({topLevelRule:i,repetition:o});r.push({message:p,type:mt.NO_NON_EMPTY_LOOKAHEAD,ruleName:i.name})}})});return r}function Qb(t,e,n,r){const i=[];const a=ft(t,(o,l,u)=>{if(e.definition[u].ignoreAmbiguities===true){return o}X(l,c=>{const d=[u];X(t,(f,p)=>{if(u!==p&&Ud(f,c)&&e.definition[p].ignoreAmbiguities!==true){d.push(p)}});if(d.length>1&&!Ud(i,c)){i.push(c);o.push({alts:d,path:c})}});return o},[]);const s=H(a,o=>{const l=H(o.alts,c=>c+1);const u=r.buildAlternationAmbiguityError({topLevelRule:n,alternation:e,ambiguityIndices:l,prefixPath:o.path});return{message:u,type:mt.AMBIGUOUS_ALTS,ruleName:n.name,occurrence:e.idx,alternatives:o.alts}});return s}function Zb(t,e,n,r){const i=ft(t,(s,o,l)=>{const u=H(o,c=>{return{idx:l,path:c}});return s.concat(u)},[]);const a=es(_t(i,s=>{const o=e.definition[s.idx];if(o.ignoreAmbiguities===true){return[]}const l=s.idx;const u=s.path;const c=It(i,f=>{return e.definition[f.idx].ignoreAmbiguities!==true&&f.idx<l&&Fb(f.path,u)});const d=H(c,f=>{const p=[f.idx+1,l+1];const y=e.idx===0?"":e.idx;const v=r.buildAlternationPrefixAmbiguityError({topLevelRule:n,alternation:e,ambiguityIndices:p,prefixPath:f.path});return{message:v,type:mt.AMBIGUOUS_PREFIX_ALTS,ruleName:n.name,occurrence:y,alternatives:p}});return d}));return a}function ek(t,e,n){const r=[];const i=H(e,a=>a.name);X(t,a=>{const s=a.name;if(ht(i,s)){const o=n.buildNamespaceConflictError(a);r.push({message:o,type:mt.CONFLICT_TOKENS_RULES_NAMESPACE,ruleName:s})}});return r}function tk(t){const e=wp(t,{errMsgProvider:Sb});const n={};X(t.rules,r=>{n[r.name]=r});return Ab(n,e.errMsgProvider)}function nk(t){t=wp(t,{errMsgProvider:fr});return Gb(t.rules,t.tokenTypes,t.errMsgProvider,t.grammarName)}const _R="MismatchedTokenException";const DR="NoViableAltException";const IR="EarlyExitException";const OR="NotAllInputParsedException";const LR=[_R,DR,IR,OR];Object.freeze(LR);function du(t){return ht(LR,t.name)}class tc extends Error{constructor(e,n){super(e);this.token=n;this.resyncedTokens=[];Object.setPrototypeOf(this,new.target.prototype);if(Error.captureStackTrace){Error.captureStackTrace(this,this.constructor)}}}class xR extends tc{constructor(e,n,r){super(e,n);this.previousToken=r;this.name=_R}}class rk extends tc{constructor(e,n,r){super(e,n);this.previousToken=r;this.name=DR}}class ik extends tc{constructor(e,n){super(e,n);this.name=OR}}class ak extends tc{constructor(e,n,r){super(e,n);this.previousToken=r;this.name=IR}}const yc={};const MR="InRuleRecoveryException";class sk extends Error{constructor(e){super(e);this.name=MR}}class ok{initRecoverable(e){this.firstAfterRepMap={};this.resyncFollows={};this.recoveryEnabled=Q(e,"recoveryEnabled")?e.recoveryEnabled:Ln.recoveryEnabled;if(this.recoveryEnabled){this.attemptInRepetitionRecovery=lk}}getTokenToInsert(e){const n=Sp(e,"",NaN,NaN,NaN,NaN,NaN,NaN);n.isInsertedInRecovery=true;return n}canTokenTypeBeInsertedInRecovery(e){return true}canTokenTypeBeDeletedInRecovery(e){return true}tryInRepetitionRecovery(e,n,r,i){const a=this.findReSyncTokenType();const s=this.exportLexerState();const o=[];let l=false;const u=this.LA(1);let c=this.LA(1);const d=()=>{const f=this.LA(0);const p=this.errorMessageProvider.buildMismatchTokenMessage({expected:i,actual:u,previous:f,ruleName:this.getCurrRuleFullName()});const y=new xR(p,u,this.LA(0));y.resyncedTokens=La(o);this.SAVE_ERROR(y)};while(!l){if(this.tokenMatcher(c,i)){d();return}else if(r.call(this)){d();e.apply(this,n);return}else if(this.tokenMatcher(c,a)){l=true}else{c=this.SKIP_TOKEN();this.addToResyncTokens(c,o)}}this.importLexerState(s)}shouldInRepetitionRecoveryBeTried(e,n,r){if(r===false){return false}if(this.tokenMatcher(this.LA(1),e)){return false}if(this.isBackTracking()){return false}if(this.canPerformInRuleRecovery(e,this.getFollowsForInRuleRecovery(e,n))){return false}return true}getFollowsForInRuleRecovery(e,n){const r=this.getCurrentGrammarPath(e,n);const i=this.getNextPossibleTokenTypes(r);return i}tryInRuleRecovery(e,n){if(this.canRecoverWithSingleTokenInsertion(e,n)){const r=this.getTokenToInsert(e);return r}if(this.canRecoverWithSingleTokenDeletion(e)){const r=this.SKIP_TOKEN();this.consumeToken();return r}throw new sk("sad sad panda")}canPerformInRuleRecovery(e,n){return this.canRecoverWithSingleTokenInsertion(e,n)||this.canRecoverWithSingleTokenDeletion(e)}canRecoverWithSingleTokenInsertion(e,n){if(!this.canTokenTypeBeInsertedInRecovery(e)){return false}if(ye(n)){return false}const r=this.LA(1);const i=Ur(n,a=>{return this.tokenMatcher(r,a)})!==void 0;return i}canRecoverWithSingleTokenDeletion(e){if(!this.canTokenTypeBeDeletedInRecovery(e)){return false}const n=this.tokenMatcher(this.LA(2),e);return n}isInCurrentRuleReSyncSet(e){const n=this.getCurrFollowKey();const r=this.getFollowSetFromFollowKey(n);return ht(r,e)}findReSyncTokenType(){const e=this.flattenFollowSet();let n=this.LA(1);let r=2;while(true){const i=Ur(e,a=>{const s=CR(n,a);return s});if(i!==void 0){return i}n=this.LA(r);r++}}getCurrFollowKey(){if(this.RULE_STACK.length===1){return yc}const e=this.getLastExplicitRuleShortName();const n=this.getLastExplicitRuleOccurrenceIndex();const r=this.getPreviousExplicitRuleShortName();return{ruleName:this.shortRuleNameToFullName(e),idxInCallingRule:n,inRule:this.shortRuleNameToFullName(r)}}buildFullFollowKeyStack(){const e=this.RULE_STACK;const n=this.RULE_OCCURRENCE_STACK;return H(e,(r,i)=>{if(i===0){return yc}return{ruleName:this.shortRuleNameToFullName(r),idxInCallingRule:n[i],inRule:this.shortRuleNameToFullName(e[i-1])}})}flattenFollowSet(){const e=H(this.buildFullFollowKeyStack(),n=>{return this.getFollowSetFromFollowKey(n)});return Ft(e)}getFollowSetFromFollowKey(e){if(e===yc){return[zn]}const n=e.ruleName+e.idxInCallingRule+pR+e.inRule;return this.resyncFollows[n]}addToResyncTokens(e,n){if(!this.tokenMatcher(e,zn)){n.push(e)}return n}reSyncTo(e){const n=[];let r=this.LA(1);while(this.tokenMatcher(r,e)===false){r=this.SKIP_TOKEN();this.addToResyncTokens(r,n)}return La(n)}attemptInRepetitionRecovery(e,n,r,i,a,s,o){}getCurrentGrammarPath(e,n){const r=this.getHumanReadableRuleStack();const i=tt(this.RULE_OCCURRENCE_STACK);const a={ruleStack:r,occurrenceStack:i,lastTok:e,lastTokOccurrence:n};return a}getHumanReadableRuleStack(){return H(this.RULE_STACK,e=>this.shortRuleNameToFullName(e))}}function lk(t,e,n,r,i,a,s){const o=this.getKeyForAutomaticLookahead(r,i);let l=this.firstAfterRepMap[o];if(l===void 0){const f=this.getCurrRuleFullName();const p=this.getGAstProductions()[f];const y=new a(p,i);l=y.startWalking();this.firstAfterRepMap[o]=l}let u=l.token;let c=l.occurrence;const d=l.isEndOfRule;if(this.RULE_STACK.length===1&&d&&u===void 0){u=zn;c=1}if(u===void 0||c===void 0){return}if(this.shouldInRepetitionRecoveryBeTried(u,c,s)){this.tryInRepetitionRecovery(t,e,n,u)}}const uk=4;const Qn=8;const KR=1<<Qn;const FR=2<<Qn;const Gd=3<<Qn;const Hd=4<<Qn;const qd=5<<Qn;const Hl=6<<Qn;function gc(t,e,n){return n|e|t}class kp{constructor(e){var n;this.maxLookahead=(n=e===null||e===void 0?void 0:e.maxLookahead)!==null&&n!==void 0?n:Ln.maxLookahead}validate(e){const n=this.validateNoLeftRecursion(e.rules);if(ye(n)){const r=this.validateEmptyOrAlternatives(e.rules);const i=this.validateAmbiguousAlternationAlternatives(e.rules,this.maxLookahead);const a=this.validateSomeNonEmptyLookaheadPath(e.rules,this.maxLookahead);const s=[...n,...r,...i,...a];return s}return n}validateNoLeftRecursion(e){return _t(e,n=>PR(n,n,fr))}validateEmptyOrAlternatives(e){return _t(e,n=>Vb(n,fr))}validateAmbiguousAlternationAlternatives(e,n){return _t(e,r=>zb(r,n,fr))}validateSomeNonEmptyLookaheadPath(e,n){return Jb(e,n,fr)}buildLookaheadForAlternation(e){return Ib(e.prodOccurrence,e.rule,e.maxLookahead,e.hasPredicates,e.dynamicTokensEnabled,Lb)}buildLookaheadForOptional(e){return Ob(e.prodOccurrence,e.rule,e.maxLookahead,e.dynamicTokensEnabled,Ap(e.prodType),xb)}}class ck{initLooksAhead(e){this.dynamicTokensEnabled=Q(e,"dynamicTokensEnabled")?e.dynamicTokensEnabled:Ln.dynamicTokensEnabled;this.maxLookahead=Q(e,"maxLookahead")?e.maxLookahead:Ln.maxLookahead;this.lookaheadStrategy=Q(e,"lookaheadStrategy")?e.lookaheadStrategy:new kp({maxLookahead:this.maxLookahead});this.lookAheadFuncsCache=new Map}preComputeLookaheadFunctions(e){X(e,n=>{this.TRACE_INIT(`${n.name} Rule Lookahead`,()=>{const{alternation:r,repetition:i,option:a,repetitionMandatory:s,repetitionMandatoryWithSeparator:o,repetitionWithSeparator:l}=fk(n);X(r,u=>{const c=u.idx===0?"":u.idx;this.TRACE_INIT(`${en(u)}${c}`,()=>{const d=this.lookaheadStrategy.buildLookaheadForAlternation({prodOccurrence:u.idx,rule:n,maxLookahead:u.maxLookahead||this.maxLookahead,hasPredicates:u.hasPredicates,dynamicTokensEnabled:this.dynamicTokensEnabled});const f=gc(this.fullRuleNameToShort[n.name],KR,u.idx);this.setLaFuncCache(f,d)})});X(i,u=>{this.computeLookaheadFunc(n,u.idx,Gd,"Repetition",u.maxLookahead,en(u))});X(a,u=>{this.computeLookaheadFunc(n,u.idx,FR,"Option",u.maxLookahead,en(u))});X(s,u=>{this.computeLookaheadFunc(n,u.idx,Hd,"RepetitionMandatory",u.maxLookahead,en(u))});X(o,u=>{this.computeLookaheadFunc(n,u.idx,Hl,"RepetitionMandatoryWithSeparator",u.maxLookahead,en(u))});X(l,u=>{this.computeLookaheadFunc(n,u.idx,qd,"RepetitionWithSeparator",u.maxLookahead,en(u))})})})}computeLookaheadFunc(e,n,r,i,a,s){this.TRACE_INIT(`${s}${n===0?"":n}`,()=>{const o=this.lookaheadStrategy.buildLookaheadForOptional({prodOccurrence:n,rule:e,maxLookahead:a||this.maxLookahead,dynamicTokensEnabled:this.dynamicTokensEnabled,prodType:i});const l=gc(this.fullRuleNameToShort[e.name],r,n);this.setLaFuncCache(l,o)})}getKeyForAutomaticLookahead(e,n){const r=this.getLastExplicitRuleShortName();return gc(r,e,n)}getLaFuncFromCache(e){return this.lookAheadFuncsCache.get(e)}setLaFuncCache(e,n){this.lookAheadFuncsCache.set(e,n)}}class dk extends Xr{constructor(){super(...arguments);this.dslMethods={option:[],alternation:[],repetition:[],repetitionWithSeparator:[],repetitionMandatory:[],repetitionMandatoryWithSeparator:[]}}reset(){this.dslMethods={option:[],alternation:[],repetition:[],repetitionWithSeparator:[],repetitionMandatory:[],repetitionMandatoryWithSeparator:[]}}visitOption(e){this.dslMethods.option.push(e)}visitRepetitionWithSeparator(e){this.dslMethods.repetitionWithSeparator.push(e)}visitRepetitionMandatory(e){this.dslMethods.repetitionMandatory.push(e)}visitRepetitionMandatoryWithSeparator(e){this.dslMethods.repetitionMandatoryWithSeparator.push(e)}visitRepetition(e){this.dslMethods.repetition.push(e)}visitAlternation(e){this.dslMethods.alternation.push(e)}}const Ls=new dk;function fk(t){Ls.reset();t.accept(Ls);const e=Ls.dslMethods;Ls.reset();return e}function Bm(t,e){if(isNaN(t.startOffset)===true){t.startOffset=e.startOffset;t.endOffset=e.endOffset}else if(t.endOffset<e.endOffset===true){t.endOffset=e.endOffset}}function Wm(t,e){if(isNaN(t.startOffset)===true){t.startOffset=e.startOffset;t.startColumn=e.startColumn;t.startLine=e.startLine;t.endOffset=e.endOffset;t.endColumn=e.endColumn;t.endLine=e.endLine}else if(t.endOffset<e.endOffset===true){t.endOffset=e.endOffset;t.endColumn=e.endColumn;t.endLine=e.endLine}}function pk(t,e,n){if(t.children[n]===void 0){t.children[n]=[e]}else{t.children[n].push(e)}}function mk(t,e,n){if(t.children[e]===void 0){t.children[e]=[n]}else{t.children[e].push(n)}}const hk="name";function UR(t,e){Object.defineProperty(t,hk,{enumerable:false,configurable:true,writable:false,value:e})}function yk(t,e){const n=Ht(t);const r=n.length;for(let i=0;i<r;i++){const a=n[i];const s=t[a];const o=s.length;for(let l=0;l<o;l++){const u=s[l];if(u.tokenTypeIdx===void 0){this[u.name](u.children,e)}}}}function gk(t,e){const n=function(){};UR(n,t+"BaseSemantics");const r={visit:function(i,a){if(oe(i)){i=i[0]}if(On(i)){return void 0}return this[i.name](i.children,a)},validateVisitor:function(){const i=$k(this,e);if(!ye(i)){const a=H(i,s=>s.msg);throw Error(`Errors Detected in CST Visitor <${this.constructor.name}>:
	${a.join("\n\n").replace(/\n/g,"\n	")}`)}}};n.prototype=r;n.prototype.constructor=n;n._RULE_NAMES=e;return n}function Rk(t,e,n){const r=function(){};UR(r,t+"BaseSemanticsWithDefaults");const i=Object.create(n.prototype);X(e,a=>{i[a]=yk});r.prototype=i;r.prototype.constructor=r;return r}var jd;(function(t){t[t["REDUNDANT_METHOD"]=0]="REDUNDANT_METHOD";t[t["MISSING_METHOD"]=1]="MISSING_METHOD"})(jd||(jd={}));function $k(t,e){const n=vk(t,e);return n}function vk(t,e){const n=It(e,i=>{return Mn(t[i])===false});const r=H(n,i=>{return{msg:`Missing visitor method: <${i}> on ${t.constructor.name} CST Visitor.`,type:jd.MISSING_METHOD,methodName:i}});return es(r)}class Tk{initTreeBuilder(e){this.CST_STACK=[];this.outputCst=e.outputCst;this.nodeLocationTracking=Q(e,"nodeLocationTracking")?e.nodeLocationTracking:Ln.nodeLocationTracking;if(!this.outputCst){this.cstInvocationStateUpdate=je;this.cstFinallyStateUpdate=je;this.cstPostTerminal=je;this.cstPostNonTerminal=je;this.cstPostRule=je}else{if(/full/i.test(this.nodeLocationTracking)){if(this.recoveryEnabled){this.setNodeLocationFromToken=Wm;this.setNodeLocationFromNode=Wm;this.cstPostRule=je;this.setInitialNodeLocation=this.setInitialNodeLocationFullRecovery}else{this.setNodeLocationFromToken=je;this.setNodeLocationFromNode=je;this.cstPostRule=this.cstPostRuleFull;this.setInitialNodeLocation=this.setInitialNodeLocationFullRegular}}else if(/onlyOffset/i.test(this.nodeLocationTracking)){if(this.recoveryEnabled){this.setNodeLocationFromToken=Bm;this.setNodeLocationFromNode=Bm;this.cstPostRule=je;this.setInitialNodeLocation=this.setInitialNodeLocationOnlyOffsetRecovery}else{this.setNodeLocationFromToken=je;this.setNodeLocationFromNode=je;this.cstPostRule=this.cstPostRuleOnlyOffset;this.setInitialNodeLocation=this.setInitialNodeLocationOnlyOffsetRegular}}else if(/none/i.test(this.nodeLocationTracking)){this.setNodeLocationFromToken=je;this.setNodeLocationFromNode=je;this.cstPostRule=je;this.setInitialNodeLocation=je}else{throw Error(`Invalid <nodeLocationTracking> config option: "${e.nodeLocationTracking}"`)}}}setInitialNodeLocationOnlyOffsetRecovery(e){e.location={startOffset:NaN,endOffset:NaN}}setInitialNodeLocationOnlyOffsetRegular(e){e.location={startOffset:this.LA(1).startOffset,endOffset:NaN}}setInitialNodeLocationFullRecovery(e){e.location={startOffset:NaN,startLine:NaN,startColumn:NaN,endOffset:NaN,endLine:NaN,endColumn:NaN}}setInitialNodeLocationFullRegular(e){const n=this.LA(1);e.location={startOffset:n.startOffset,startLine:n.startLine,startColumn:n.startColumn,endOffset:NaN,endLine:NaN,endColumn:NaN}}cstInvocationStateUpdate(e){const n={name:e,children:Object.create(null)};this.setInitialNodeLocation(n);this.CST_STACK.push(n)}cstFinallyStateUpdate(){this.CST_STACK.pop()}cstPostRuleFull(e){const n=this.LA(0);const r=e.location;if(r.startOffset<=n.startOffset===true){r.endOffset=n.endOffset;r.endLine=n.endLine;r.endColumn=n.endColumn}else{r.startOffset=NaN;r.startLine=NaN;r.startColumn=NaN}}cstPostRuleOnlyOffset(e){const n=this.LA(0);const r=e.location;if(r.startOffset<=n.startOffset===true){r.endOffset=n.endOffset}else{r.startOffset=NaN}}cstPostTerminal(e,n){const r=this.CST_STACK[this.CST_STACK.length-1];pk(r,n,e);this.setNodeLocationFromToken(r.location,n)}cstPostNonTerminal(e,n){const r=this.CST_STACK[this.CST_STACK.length-1];mk(r,n,e);this.setNodeLocationFromNode(r.location,e.location)}getBaseCstVisitorConstructor(){if(On(this.baseCstVisitorConstructor)){const e=gk(this.className,Ht(this.gastProductionsCache));this.baseCstVisitorConstructor=e;return e}return this.baseCstVisitorConstructor}getBaseCstVisitorConstructorWithDefaults(){if(On(this.baseCstVisitorWithDefaultsConstructor)){const e=Rk(this.className,Ht(this.gastProductionsCache),this.getBaseCstVisitorConstructor());this.baseCstVisitorWithDefaultsConstructor=e;return e}return this.baseCstVisitorWithDefaultsConstructor}getLastExplicitRuleShortName(){const e=this.RULE_STACK;return e[e.length-1]}getPreviousExplicitRuleShortName(){const e=this.RULE_STACK;return e[e.length-2]}getLastExplicitRuleOccurrenceIndex(){const e=this.RULE_OCCURRENCE_STACK;return e[e.length-1]}}class wk{initLexerAdapter(){this.tokVector=[];this.tokVectorLength=0;this.currIdx=-1}set input(e){if(this.selfAnalysisDone!==true){throw Error(`Missing <performSelfAnalysis> invocation at the end of the Parser's constructor.`)}this.reset();this.tokVector=e;this.tokVectorLength=e.length}get input(){return this.tokVector}SKIP_TOKEN(){if(this.currIdx<=this.tokVector.length-2){this.consumeToken();return this.LA(1)}else{return pu}}LA(e){const n=this.currIdx+e;if(n<0||this.tokVectorLength<=n){return pu}else{return this.tokVector[n]}}consumeToken(){this.currIdx++}exportLexerState(){return this.currIdx}importLexerState(e){this.currIdx=e}resetLexerState(){this.currIdx=-1}moveToTerminatedState(){this.currIdx=this.tokVector.length-1}getLexerPosition(){return this.exportLexerState()}}class Ek{ACTION(e){return e.call(this)}consume(e,n,r){return this.consumeInternal(n,e,r)}subrule(e,n,r){return this.subruleInternal(n,e,r)}option(e,n){return this.optionInternal(n,e)}or(e,n){return this.orInternal(n,e)}many(e,n){return this.manyInternal(e,n)}atLeastOne(e,n){return this.atLeastOneInternal(e,n)}CONSUME(e,n){return this.consumeInternal(e,0,n)}CONSUME1(e,n){return this.consumeInternal(e,1,n)}CONSUME2(e,n){return this.consumeInternal(e,2,n)}CONSUME3(e,n){return this.consumeInternal(e,3,n)}CONSUME4(e,n){return this.consumeInternal(e,4,n)}CONSUME5(e,n){return this.consumeInternal(e,5,n)}CONSUME6(e,n){return this.consumeInternal(e,6,n)}CONSUME7(e,n){return this.consumeInternal(e,7,n)}CONSUME8(e,n){return this.consumeInternal(e,8,n)}CONSUME9(e,n){return this.consumeInternal(e,9,n)}SUBRULE(e,n){return this.subruleInternal(e,0,n)}SUBRULE1(e,n){return this.subruleInternal(e,1,n)}SUBRULE2(e,n){return this.subruleInternal(e,2,n)}SUBRULE3(e,n){return this.subruleInternal(e,3,n)}SUBRULE4(e,n){return this.subruleInternal(e,4,n)}SUBRULE5(e,n){return this.subruleInternal(e,5,n)}SUBRULE6(e,n){return this.subruleInternal(e,6,n)}SUBRULE7(e,n){return this.subruleInternal(e,7,n)}SUBRULE8(e,n){return this.subruleInternal(e,8,n)}SUBRULE9(e,n){return this.subruleInternal(e,9,n)}OPTION(e){return this.optionInternal(e,0)}OPTION1(e){return this.optionInternal(e,1)}OPTION2(e){return this.optionInternal(e,2)}OPTION3(e){return this.optionInternal(e,3)}OPTION4(e){return this.optionInternal(e,4)}OPTION5(e){return this.optionInternal(e,5)}OPTION6(e){return this.optionInternal(e,6)}OPTION7(e){return this.optionInternal(e,7)}OPTION8(e){return this.optionInternal(e,8)}OPTION9(e){return this.optionInternal(e,9)}OR(e){return this.orInternal(e,0)}OR1(e){return this.orInternal(e,1)}OR2(e){return this.orInternal(e,2)}OR3(e){return this.orInternal(e,3)}OR4(e){return this.orInternal(e,4)}OR5(e){return this.orInternal(e,5)}OR6(e){return this.orInternal(e,6)}OR7(e){return this.orInternal(e,7)}OR8(e){return this.orInternal(e,8)}OR9(e){return this.orInternal(e,9)}MANY(e){this.manyInternal(0,e)}MANY1(e){this.manyInternal(1,e)}MANY2(e){this.manyInternal(2,e)}MANY3(e){this.manyInternal(3,e)}MANY4(e){this.manyInternal(4,e)}MANY5(e){this.manyInternal(5,e)}MANY6(e){this.manyInternal(6,e)}MANY7(e){this.manyInternal(7,e)}MANY8(e){this.manyInternal(8,e)}MANY9(e){this.manyInternal(9,e)}MANY_SEP(e){this.manySepFirstInternal(0,e)}MANY_SEP1(e){this.manySepFirstInternal(1,e)}MANY_SEP2(e){this.manySepFirstInternal(2,e)}MANY_SEP3(e){this.manySepFirstInternal(3,e)}MANY_SEP4(e){this.manySepFirstInternal(4,e)}MANY_SEP5(e){this.manySepFirstInternal(5,e)}MANY_SEP6(e){this.manySepFirstInternal(6,e)}MANY_SEP7(e){this.manySepFirstInternal(7,e)}MANY_SEP8(e){this.manySepFirstInternal(8,e)}MANY_SEP9(e){this.manySepFirstInternal(9,e)}AT_LEAST_ONE(e){this.atLeastOneInternal(0,e)}AT_LEAST_ONE1(e){return this.atLeastOneInternal(1,e)}AT_LEAST_ONE2(e){this.atLeastOneInternal(2,e)}AT_LEAST_ONE3(e){this.atLeastOneInternal(3,e)}AT_LEAST_ONE4(e){this.atLeastOneInternal(4,e)}AT_LEAST_ONE5(e){this.atLeastOneInternal(5,e)}AT_LEAST_ONE6(e){this.atLeastOneInternal(6,e)}AT_LEAST_ONE7(e){this.atLeastOneInternal(7,e)}AT_LEAST_ONE8(e){this.atLeastOneInternal(8,e)}AT_LEAST_ONE9(e){this.atLeastOneInternal(9,e)}AT_LEAST_ONE_SEP(e){this.atLeastOneSepFirstInternal(0,e)}AT_LEAST_ONE_SEP1(e){this.atLeastOneSepFirstInternal(1,e)}AT_LEAST_ONE_SEP2(e){this.atLeastOneSepFirstInternal(2,e)}AT_LEAST_ONE_SEP3(e){this.atLeastOneSepFirstInternal(3,e)}AT_LEAST_ONE_SEP4(e){this.atLeastOneSepFirstInternal(4,e)}AT_LEAST_ONE_SEP5(e){this.atLeastOneSepFirstInternal(5,e)}AT_LEAST_ONE_SEP6(e){this.atLeastOneSepFirstInternal(6,e)}AT_LEAST_ONE_SEP7(e){this.atLeastOneSepFirstInternal(7,e)}AT_LEAST_ONE_SEP8(e){this.atLeastOneSepFirstInternal(8,e)}AT_LEAST_ONE_SEP9(e){this.atLeastOneSepFirstInternal(9,e)}RULE(e,n,r=mu){if(ht(this.definedRulesNames,e)){const a=fr.buildDuplicateRuleNameError({topLevelRule:e,grammarName:this.className});const s={message:a,type:mt.DUPLICATE_RULE_NAME,ruleName:e};this.definitionErrors.push(s)}this.definedRulesNames.push(e);const i=this.defineRule(e,n,r);this[e]=i;return i}OVERRIDE_RULE(e,n,r=mu){const i=Wb(e,this.definedRulesNames,this.className);this.definitionErrors=this.definitionErrors.concat(i);const a=this.defineRule(e,n,r);this[e]=a;return a}BACKTRACK(e,n){return function(){this.isBackTrackingStack.push(1);const r=this.saveRecogState();try{e.apply(this,n);return true}catch(i){if(du(i)){return false}else{throw i}}finally{this.reloadRecogState(r);this.isBackTrackingStack.pop()}}}getGAstProductions(){return this.gastProductionsCache}getSerializedGastProductions(){return DA(Be(this.gastProductionsCache))}}class Ck{initRecognizerEngine(e,n){this.className=this.constructor.name;this.shortRuleNameToFull={};this.fullRuleNameToShort={};this.ruleShortNameIdx=256;this.tokenMatcher=cu;this.subruleIdx=0;this.definedRulesNames=[];this.tokensMap={};this.isBackTrackingStack=[];this.RULE_STACK=[];this.RULE_OCCURRENCE_STACK=[];this.gastProductionsCache={};if(Q(n,"serializedGrammar")){throw Error("The Parser's configuration can no longer contain a <serializedGrammar> property.\n	See: https://chevrotain.io/docs/changes/BREAKING_CHANGES.html#_6-0-0\n	For Further details.")}if(oe(e)){if(ye(e)){throw Error("A Token Vocabulary cannot be empty.\n	Note that the first argument for the parser constructor\n	is no longer a Token vector (since v4.0).")}if(typeof e[0].startOffset==="number"){throw Error("The Parser constructor no longer accepts a token vector as the first argument.\n	See: https://chevrotain.io/docs/changes/BREAKING_CHANGES.html#_4-0-0\n	For Further details.")}}if(oe(e)){this.tokensMap=ft(e,(a,s)=>{a[s.name]=s;return a},{})}else if(Q(e,"modes")&&Bt(Ft(Be(e.modes)),wb)){const a=Ft(Be(e.modes));const s=Ep(a);this.tokensMap=ft(s,(o,l)=>{o[l.name]=l;return o},{})}else if(Gt(e)){this.tokensMap=tt(e)}else{throw new Error("<tokensDictionary> argument must be An Array of Token constructors, A dictionary of Token constructors or an IMultiModeLexerDefinition")}this.tokensMap["EOF"]=zn;const r=Q(e,"modes")?Ft(Be(e.modes)):Be(e);const i=Bt(r,a=>ye(a.categoryMatches));this.tokenMatcher=i?cu:ns;rs(Be(this.tokensMap))}defineRule(e,n,r){if(this.selfAnalysisDone){throw Error(`Grammar rule <${e}> may not be defined after the 'performSelfAnalysis' method has been called'
Make sure that all grammar rule definitions are done before 'performSelfAnalysis' is called.`)}const i=Q(r,"resyncEnabled")?r.resyncEnabled:mu.resyncEnabled;const a=Q(r,"recoveryValueFunc")?r.recoveryValueFunc:mu.recoveryValueFunc;const s=this.ruleShortNameIdx<<uk+Qn;this.ruleShortNameIdx++;this.shortRuleNameToFull[s]=e;this.fullRuleNameToShort[e]=s;let o;if(this.outputCst===true){o=function u(...c){try{this.ruleInvocationStateUpdate(s,e,this.subruleIdx);n.apply(this,c);const d=this.CST_STACK[this.CST_STACK.length-1];this.cstPostRule(d);return d}catch(d){return this.invokeRuleCatch(d,i,a)}finally{this.ruleFinallyStateUpdate()}}}else{o=function u(...c){try{this.ruleInvocationStateUpdate(s,e,this.subruleIdx);return n.apply(this,c)}catch(d){return this.invokeRuleCatch(d,i,a)}finally{this.ruleFinallyStateUpdate()}}}const l=Object.assign(o,{ruleName:e,originalGrammarAction:n});return l}invokeRuleCatch(e,n,r){const i=this.RULE_STACK.length===1;const a=n&&!this.isBackTracking()&&this.recoveryEnabled;if(du(e)){const s=e;if(a){const o=this.findReSyncTokenType();if(this.isInCurrentRuleReSyncSet(o)){s.resyncedTokens=this.reSyncTo(o);if(this.outputCst){const l=this.CST_STACK[this.CST_STACK.length-1];l.recoveredNode=true;return l}else{return r(e)}}else{if(this.outputCst){const l=this.CST_STACK[this.CST_STACK.length-1];l.recoveredNode=true;s.partialCstResult=l}throw s}}else if(i){this.moveToTerminatedState();return r(e)}else{throw s}}else{throw e}}optionInternal(e,n){const r=this.getKeyForAutomaticLookahead(FR,n);return this.optionInternalLogic(e,n,r)}optionInternalLogic(e,n,r){let i=this.getLaFuncFromCache(r);let a;if(typeof e!=="function"){a=e.DEF;const s=e.GATE;if(s!==void 0){const o=i;i=()=>{return s.call(this)&&o.call(this)}}}else{a=e}if(i.call(this)===true){return a.call(this)}return void 0}atLeastOneInternal(e,n){const r=this.getKeyForAutomaticLookahead(Hd,e);return this.atLeastOneInternalLogic(e,n,r)}atLeastOneInternalLogic(e,n,r){let i=this.getLaFuncFromCache(r);let a;if(typeof n!=="function"){a=n.DEF;const s=n.GATE;if(s!==void 0){const o=i;i=()=>{return s.call(this)&&o.call(this)}}}else{a=n}if(i.call(this)===true){let s=this.doSingleRepetition(a);while(i.call(this)===true&&s===true){s=this.doSingleRepetition(a)}}else{throw this.raiseEarlyExitException(e,Ae.REPETITION_MANDATORY,n.ERR_MSG)}this.attemptInRepetitionRecovery(this.atLeastOneInternal,[e,n],i,Hd,e,_b)}atLeastOneSepFirstInternal(e,n){const r=this.getKeyForAutomaticLookahead(Hl,e);this.atLeastOneSepFirstInternalLogic(e,n,r)}atLeastOneSepFirstInternalLogic(e,n,r){const i=n.DEF;const a=n.SEP;const s=this.getLaFuncFromCache(r);if(s.call(this)===true){i.call(this);const o=()=>{return this.tokenMatcher(this.LA(1),a)};while(this.tokenMatcher(this.LA(1),a)===true){this.CONSUME(a);i.call(this)}this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal,[e,a,o,i,Hm],o,Hl,e,Hm)}else{throw this.raiseEarlyExitException(e,Ae.REPETITION_MANDATORY_WITH_SEPARATOR,n.ERR_MSG)}}manyInternal(e,n){const r=this.getKeyForAutomaticLookahead(Gd,e);return this.manyInternalLogic(e,n,r)}manyInternalLogic(e,n,r){let i=this.getLaFuncFromCache(r);let a;if(typeof n!=="function"){a=n.DEF;const o=n.GATE;if(o!==void 0){const l=i;i=()=>{return o.call(this)&&l.call(this)}}}else{a=n}let s=true;while(i.call(this)===true&&s===true){s=this.doSingleRepetition(a)}this.attemptInRepetitionRecovery(this.manyInternal,[e,n],i,Gd,e,Pb,s)}manySepFirstInternal(e,n){const r=this.getKeyForAutomaticLookahead(qd,e);this.manySepFirstInternalLogic(e,n,r)}manySepFirstInternalLogic(e,n,r){const i=n.DEF;const a=n.SEP;const s=this.getLaFuncFromCache(r);if(s.call(this)===true){i.call(this);const o=()=>{return this.tokenMatcher(this.LA(1),a)};while(this.tokenMatcher(this.LA(1),a)===true){this.CONSUME(a);i.call(this)}this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal,[e,a,o,i,Gm],o,qd,e,Gm)}}repetitionSepSecondInternal(e,n,r,i,a){while(r()){this.CONSUME(n);i.call(this)}this.attemptInRepetitionRecovery(this.repetitionSepSecondInternal,[e,n,r,i,a],r,Hl,e,a)}doSingleRepetition(e){const n=this.getLexerPosition();e.call(this);const r=this.getLexerPosition();return r>n}orInternal(e,n){const r=this.getKeyForAutomaticLookahead(KR,n);const i=oe(e)?e:e.DEF;const a=this.getLaFuncFromCache(r);const s=a.call(this,i);if(s!==void 0){const o=i[s];return o.ALT.call(this)}this.raiseNoAltException(n,e.ERR_MSG)}ruleFinallyStateUpdate(){this.RULE_STACK.pop();this.RULE_OCCURRENCE_STACK.pop();this.cstFinallyStateUpdate();if(this.RULE_STACK.length===0&&this.isAtEndOfInput()===false){const e=this.LA(1);const n=this.errorMessageProvider.buildNotAllInputParsedMessage({firstRedundant:e,ruleName:this.getCurrRuleFullName()});this.SAVE_ERROR(new ik(n,e))}}subruleInternal(e,n,r){let i;try{const a=r!==void 0?r.ARGS:void 0;this.subruleIdx=n;i=e.apply(this,a);this.cstPostNonTerminal(i,r!==void 0&&r.LABEL!==void 0?r.LABEL:e.ruleName);return i}catch(a){throw this.subruleInternalError(a,r,e.ruleName)}}subruleInternalError(e,n,r){if(du(e)&&e.partialCstResult!==void 0){this.cstPostNonTerminal(e.partialCstResult,n!==void 0&&n.LABEL!==void 0?n.LABEL:r);delete e.partialCstResult}throw e}consumeInternal(e,n,r){let i;try{const a=this.LA(1);if(this.tokenMatcher(a,e)===true){this.consumeToken();i=a}else{this.consumeInternalError(e,a,r)}}catch(a){i=this.consumeInternalRecovery(e,n,a)}this.cstPostTerminal(r!==void 0&&r.LABEL!==void 0?r.LABEL:e.name,i);return i}consumeInternalError(e,n,r){let i;const a=this.LA(0);if(r!==void 0&&r.ERR_MSG){i=r.ERR_MSG}else{i=this.errorMessageProvider.buildMismatchTokenMessage({expected:e,actual:n,previous:a,ruleName:this.getCurrRuleFullName()})}throw this.SAVE_ERROR(new xR(i,n,a))}consumeInternalRecovery(e,n,r){if(this.recoveryEnabled&&r.name==="MismatchedTokenException"&&!this.isBackTracking()){const i=this.getFollowsForInRuleRecovery(e,n);try{return this.tryInRuleRecovery(e,i)}catch(a){if(a.name===MR){throw r}else{throw a}}}else{throw r}}saveRecogState(){const e=this.errors;const n=tt(this.RULE_STACK);return{errors:e,lexerState:this.exportLexerState(),RULE_STACK:n,CST_STACK:this.CST_STACK}}reloadRecogState(e){this.errors=e.errors;this.importLexerState(e.lexerState);this.RULE_STACK=e.RULE_STACK}ruleInvocationStateUpdate(e,n,r){this.RULE_OCCURRENCE_STACK.push(r);this.RULE_STACK.push(e);this.cstInvocationStateUpdate(n)}isBackTracking(){return this.isBackTrackingStack.length!==0}getCurrRuleFullName(){const e=this.getLastExplicitRuleShortName();return this.shortRuleNameToFull[e]}shortRuleNameToFullName(e){return this.shortRuleNameToFull[e]}isAtEndOfInput(){return this.tokenMatcher(this.LA(1),zn)}reset(){this.resetLexerState();this.subruleIdx=0;this.isBackTrackingStack=[];this.errors=[];this.RULE_STACK=[];this.CST_STACK=[];this.RULE_OCCURRENCE_STACK=[]}}class Sk{initErrorHandler(e){this._errors=[];this.errorMessageProvider=Q(e,"errorMessageProvider")?e.errorMessageProvider:Ln.errorMessageProvider}SAVE_ERROR(e){if(du(e)){e.context={ruleStack:this.getHumanReadableRuleStack(),ruleOccurrenceStack:tt(this.RULE_OCCURRENCE_STACK)};this._errors.push(e);return e}else{throw Error("Trying to save an Error which is not a RecognitionException")}}get errors(){return tt(this._errors)}set errors(e){this._errors=e}raiseEarlyExitException(e,n,r){const i=this.getCurrRuleFullName();const a=this.getGAstProductions()[i];const s=ec(e,a,n,this.maxLookahead);const o=s[0];const l=[];for(let c=1;c<=this.maxLookahead;c++){l.push(this.LA(c))}const u=this.errorMessageProvider.buildEarlyExitMessage({expectedIterationPaths:o,actual:l,previous:this.LA(0),customUserDescription:r,ruleName:i});throw this.SAVE_ERROR(new ak(u,this.LA(1),this.LA(0)))}raiseNoAltException(e,n){const r=this.getCurrRuleFullName();const i=this.getGAstProductions()[r];const a=Zu(e,i,this.maxLookahead);const s=[];for(let u=1;u<=this.maxLookahead;u++){s.push(this.LA(u))}const o=this.LA(0);const l=this.errorMessageProvider.buildNoViableAltMessage({expectedPathsPerAlt:a,actual:s,previous:o,customUserDescription:n,ruleName:this.getCurrRuleFullName()});throw this.SAVE_ERROR(new rk(l,this.LA(1),o))}}class Ak{initContentAssist(){}computeContentAssist(e,n){const r=this.gastProductionsCache[e];if(On(r)){throw Error(`Rule ->${e}<- does not exist in this grammar.`)}return SR([r],n,this.tokenMatcher,this.maxLookahead)}getNextPossibleTokenTypes(e){const n=zt(e.ruleStack);const r=this.getGAstProductions();const i=r[n];const a=new Nb(i,e).startWalking();return a}}const nc={description:"This Object indicates the Parser is during Recording Phase"};Object.freeze(nc);const Vm=true;const zm=Math.pow(2,Qn)-1;const GR=ER({name:"RECORDING_PHASE_TOKEN",pattern:Rt.NA});rs([GR]);const HR=Sp(GR,"This IToken indicates the Parser is in Recording Phase\n	See: https://chevrotain.io/docs/guide/internals.html#grammar-recording for details",-1,-1,-1,-1,-1,-1);Object.freeze(HR);const bk={name:"This CSTNode indicates the Parser is in Recording Phase\n	See: https://chevrotain.io/docs/guide/internals.html#grammar-recording for details",children:{}};class kk{initGastRecorder(e){this.recordingProdStack=[];this.RECORDING_PHASE=false}enableRecording(){this.RECORDING_PHASE=true;this.TRACE_INIT("Enable Recording",()=>{for(let e=0;e<10;e++){const n=e>0?e:"";this[`CONSUME${n}`]=function(r,i){return this.consumeInternalRecord(r,e,i)};this[`SUBRULE${n}`]=function(r,i){return this.subruleInternalRecord(r,e,i)};this[`OPTION${n}`]=function(r){return this.optionInternalRecord(r,e)};this[`OR${n}`]=function(r){return this.orInternalRecord(r,e)};this[`MANY${n}`]=function(r){this.manyInternalRecord(e,r)};this[`MANY_SEP${n}`]=function(r){this.manySepFirstInternalRecord(e,r)};this[`AT_LEAST_ONE${n}`]=function(r){this.atLeastOneInternalRecord(e,r)};this[`AT_LEAST_ONE_SEP${n}`]=function(r){this.atLeastOneSepFirstInternalRecord(e,r)}}this[`consume`]=function(e,n,r){return this.consumeInternalRecord(n,e,r)};this[`subrule`]=function(e,n,r){return this.subruleInternalRecord(n,e,r)};this[`option`]=function(e,n){return this.optionInternalRecord(n,e)};this[`or`]=function(e,n){return this.orInternalRecord(n,e)};this[`many`]=function(e,n){this.manyInternalRecord(e,n)};this[`atLeastOne`]=function(e,n){this.atLeastOneInternalRecord(e,n)};this.ACTION=this.ACTION_RECORD;this.BACKTRACK=this.BACKTRACK_RECORD;this.LA=this.LA_RECORD})}disableRecording(){this.RECORDING_PHASE=false;this.TRACE_INIT("Deleting Recording methods",()=>{const e=this;for(let n=0;n<10;n++){const r=n>0?n:"";delete e[`CONSUME${r}`];delete e[`SUBRULE${r}`];delete e[`OPTION${r}`];delete e[`OR${r}`];delete e[`MANY${r}`];delete e[`MANY_SEP${r}`];delete e[`AT_LEAST_ONE${r}`];delete e[`AT_LEAST_ONE_SEP${r}`]}delete e[`consume`];delete e[`subrule`];delete e[`option`];delete e[`or`];delete e[`many`];delete e[`atLeastOne`];delete e.ACTION;delete e.BACKTRACK;delete e.LA})}ACTION_RECORD(e){}BACKTRACK_RECORD(e,n){return()=>true}LA_RECORD(e){return pu}topLevelRuleRecord(e,n){try{const r=new zr({definition:[],name:e});r.name=e;this.recordingProdStack.push(r);n.call(this);this.recordingProdStack.pop();return r}catch(r){if(r.KNOWN_RECORDER_ERROR!==true){try{r.message=r.message+'\n	 This error was thrown during the "grammar recording phase" For more info see:\n	https://chevrotain.io/docs/guide/internals.html#grammar-recording'}catch(i){throw r}}throw r}}optionInternalRecord(e,n){return ni.call(this,et,e,n)}atLeastOneInternalRecord(e,n){ni.call(this,Ot,n,e)}atLeastOneSepFirstInternalRecord(e,n){ni.call(this,Lt,n,e,Vm)}manyInternalRecord(e,n){ni.call(this,_e,n,e)}manySepFirstInternalRecord(e,n){ni.call(this,Tt,n,e,Vm)}orInternalRecord(e,n){return Nk.call(this,e,n)}subruleInternalRecord(e,n,r){fu(n);if(!e||Q(e,"ruleName")===false){const o=new Error(`<SUBRULE${Xm(n)}> argument is invalid expecting a Parser method reference but got: <${JSON.stringify(e)}>
 inside top level rule: <${this.recordingProdStack[0].name}>`);o.KNOWN_RECORDER_ERROR=true;throw o}const i=Fr(this.recordingProdStack);const a=e.ruleName;const s=new pt({idx:n,nonTerminalName:a,label:r===null||r===void 0?void 0:r.LABEL,referencedRule:void 0});i.definition.push(s);return this.outputCst?bk:nc}consumeInternalRecord(e,n,r){fu(n);if(!TR(e)){const s=new Error(`<CONSUME${Xm(n)}> argument is invalid expecting a TokenType reference but got: <${JSON.stringify(e)}>
 inside top level rule: <${this.recordingProdStack[0].name}>`);s.KNOWN_RECORDER_ERROR=true;throw s}const i=Fr(this.recordingProdStack);const a=new Te({idx:n,terminalType:e,label:r===null||r===void 0?void 0:r.LABEL});i.definition.push(a);return HR}}function ni(t,e,n,r=false){fu(n);const i=Fr(this.recordingProdStack);const a=Mn(e)?e:e.DEF;const s=new t({definition:[],idx:n});if(r){s.separator=e.SEP}if(Q(e,"MAX_LOOKAHEAD")){s.maxLookahead=e.MAX_LOOKAHEAD}this.recordingProdStack.push(s);a.call(this);i.definition.push(s);this.recordingProdStack.pop();return nc}function Nk(t,e){fu(e);const n=Fr(this.recordingProdStack);const r=oe(t)===false;const i=r===false?t:t.DEF;const a=new wt({definition:[],idx:e,ignoreAmbiguities:r&&t.IGNORE_AMBIGUITIES===true});if(Q(t,"MAX_LOOKAHEAD")){a.maxLookahead=t.MAX_LOOKAHEAD}const s=lR(i,o=>Mn(o.GATE));a.hasPredicates=s;n.definition.push(a);X(i,o=>{const l=new vt({definition:[]});a.definition.push(l);if(Q(o,"IGNORE_AMBIGUITIES")){l.ignoreAmbiguities=o.IGNORE_AMBIGUITIES}else if(Q(o,"GATE")){l.ignoreAmbiguities=true}this.recordingProdStack.push(l);o.ALT.call(this);this.recordingProdStack.pop()});return nc}function Xm(t){return t===0?"":`${t}`}function fu(t){if(t<0||t>zm){const e=new Error(`Invalid DSL Method idx value: <${t}>
	Idx value must be a none negative value smaller than ${zm+1}`);e.KNOWN_RECORDER_ERROR=true;throw e}}class Pk{initPerformanceTracer(e){if(Q(e,"traceInitPerf")){const n=e.traceInitPerf;const r=typeof n==="number";this.traceInitMaxIdent=r?n:Infinity;this.traceInitPerf=r?n>0:n}else{this.traceInitMaxIdent=0;this.traceInitPerf=Ln.traceInitPerf}this.traceInitIndent=-1}TRACE_INIT(e,n){if(this.traceInitPerf===true){this.traceInitIndent++;const r=new Array(this.traceInitIndent+1).join("	");if(this.traceInitIndent<this.traceInitMaxIdent){console.log(`${r}--> <${e}>`)}const{time:i,value:a}=dR(n);const s=i>10?console.warn:console.log;if(this.traceInitIndent<this.traceInitMaxIdent){s(`${r}<-- <${e}> time: ${i}ms`)}this.traceInitIndent--;return a}else{return n()}}}function _k(t,e){e.forEach(n=>{const r=n.prototype;Object.getOwnPropertyNames(r).forEach(i=>{if(i==="constructor"){return}const a=Object.getOwnPropertyDescriptor(r,i);if(a&&(a.get||a.set)){Object.defineProperty(t.prototype,i,a)}else{t.prototype[i]=n.prototype[i]}})})}const pu=Sp(zn,"",NaN,NaN,NaN,NaN,NaN,NaN);Object.freeze(pu);const Ln=Object.freeze({recoveryEnabled:false,maxLookahead:3,dynamicTokensEnabled:false,outputCst:true,errorMessageProvider:Or,nodeLocationTracking:"none",traceInitPerf:false,skipValidations:false});const mu=Object.freeze({recoveryValueFunc:()=>void 0,resyncEnabled:true});var mt;(function(t){t[t["INVALID_RULE_NAME"]=0]="INVALID_RULE_NAME";t[t["DUPLICATE_RULE_NAME"]=1]="DUPLICATE_RULE_NAME";t[t["INVALID_RULE_OVERRIDE"]=2]="INVALID_RULE_OVERRIDE";t[t["DUPLICATE_PRODUCTIONS"]=3]="DUPLICATE_PRODUCTIONS";t[t["UNRESOLVED_SUBRULE_REF"]=4]="UNRESOLVED_SUBRULE_REF";t[t["LEFT_RECURSION"]=5]="LEFT_RECURSION";t[t["NONE_LAST_EMPTY_ALT"]=6]="NONE_LAST_EMPTY_ALT";t[t["AMBIGUOUS_ALTS"]=7]="AMBIGUOUS_ALTS";t[t["CONFLICT_TOKENS_RULES_NAMESPACE"]=8]="CONFLICT_TOKENS_RULES_NAMESPACE";t[t["INVALID_TOKEN_NAME"]=9]="INVALID_TOKEN_NAME";t[t["NO_NON_EMPTY_LOOKAHEAD"]=10]="NO_NON_EMPTY_LOOKAHEAD";t[t["AMBIGUOUS_PREFIX_ALTS"]=11]="AMBIGUOUS_PREFIX_ALTS";t[t["TOO_MANY_ALTS"]=12]="TOO_MANY_ALTS";t[t["CUSTOM_LOOKAHEAD_VALIDATION"]=13]="CUSTOM_LOOKAHEAD_VALIDATION"})(mt||(mt={}));function Ym(t=void 0){return function(){return t}}class is{static performSelfAnalysis(e){throw Error("The **static** `performSelfAnalysis` method has been deprecated.	\nUse the **instance** method with the same name instead.")}performSelfAnalysis(){this.TRACE_INIT("performSelfAnalysis",()=>{let e;this.selfAnalysisDone=true;const n=this.className;this.TRACE_INIT("toFastProps",()=>{fR(this)});this.TRACE_INIT("Grammar Recording",()=>{try{this.enableRecording();X(this.definedRulesNames,i=>{const a=this[i];const s=a["originalGrammarAction"];let o;this.TRACE_INIT(`${i} Rule`,()=>{o=this.topLevelRuleRecord(i,s)});this.gastProductionsCache[i]=o})}finally{this.disableRecording()}});let r=[];this.TRACE_INIT("Grammar Resolving",()=>{r=tk({rules:Be(this.gastProductionsCache)});this.definitionErrors=this.definitionErrors.concat(r)});this.TRACE_INIT("Grammar Validations",()=>{if(ye(r)&&this.skipValidations===false){const i=nk({rules:Be(this.gastProductionsCache),tokenTypes:Be(this.tokensMap),errMsgProvider:fr,grammarName:n});const a=Ub({lookaheadStrategy:this.lookaheadStrategy,rules:Be(this.gastProductionsCache),tokenTypes:Be(this.tokensMap),grammarName:n});this.definitionErrors=this.definitionErrors.concat(i,a)}});if(ye(this.definitionErrors)){if(this.recoveryEnabled){this.TRACE_INIT("computeAllProdsFollows",()=>{const i=FA(Be(this.gastProductionsCache));this.resyncFollows=i})}this.TRACE_INIT("ComputeLookaheadFunctions",()=>{var i,a;(a=(i=this.lookaheadStrategy).initialize)===null||a===void 0?void 0:a.call(i,{rules:Be(this.gastProductionsCache)});this.preComputeLookaheadFunctions(Be(this.gastProductionsCache))})}if(!is.DEFER_DEFINITION_ERRORS_HANDLING&&!ye(this.definitionErrors)){e=H(this.definitionErrors,i=>i.message);throw new Error(`Parser Definition Errors detected:
 ${e.join("\n-------------------------------\n")}`)}})}constructor(e,n){this.definitionErrors=[];this.selfAnalysisDone=false;const r=this;r.initErrorHandler(n);r.initLexerAdapter();r.initLooksAhead(n);r.initRecognizerEngine(e,n);r.initRecoverable(n);r.initTreeBuilder(n);r.initContentAssist();r.initGastRecorder(n);r.initPerformanceTracer(n);if(Q(n,"ignoredIssues")){throw new Error("The <ignoredIssues> IParserConfig property has been deprecated.\n	Please use the <IGNORE_AMBIGUITIES> flag on the relevant DSL method instead.\n	See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#IGNORING_AMBIGUITIES\n	For further details.")}this.skipValidations=Q(n,"skipValidations")?n.skipValidations:Ln.skipValidations}}is.DEFER_DEFINITION_ERRORS_HANDLING=false;_k(is,[ok,ck,Tk,wk,Ck,Ek,Sk,Ak,kk,Pk]);class Dk extends is{constructor(e,n=Ln){const r=tt(n);r.outputCst=false;super(e,r)}}function Gr(t,e,n){return`${t.name}_${e}_${n}`}const Xn=1;const Ik=2;const qR=4;const jR=5;const as=7;const Ok=8;const Lk=9;const xk=10;const Mk=11;const BR=12;class Np{constructor(e){this.target=e}isEpsilon(){return false}}class Pp extends Np{constructor(e,n){super(e);this.tokenType=n}}class WR extends Np{constructor(e){super(e)}isEpsilon(){return true}}class _p extends Np{constructor(e,n,r){super(e);this.rule=n;this.followState=r}isEpsilon(){return true}}function Kk(t){const e={decisionMap:{},decisionStates:[],ruleToStartState:new Map,ruleToStopState:new Map,states:[]};Fk(e,t);const n=t.length;for(let r=0;r<n;r++){const i=t[r];const a=br(e,i,i);if(a===void 0){continue}Yk(e,i,a)}return e}function Fk(t,e){const n=e.length;for(let r=0;r<n;r++){const i=e[r];const a=We(t,i,void 0,{type:Ik});const s=We(t,i,void 0,{type:as});a.stop=s;t.ruleToStartState.set(i,a);t.ruleToStopState.set(i,s)}}function VR(t,e,n){if(n instanceof Te){return Dp(t,e,n.terminalType,n)}else if(n instanceof pt){return Xk(t,e,n)}else if(n instanceof wt){return jk(t,e,n)}else if(n instanceof et){return Bk(t,e,n)}else if(n instanceof _e){return Uk(t,e,n)}else if(n instanceof Tt){return Gk(t,e,n)}else if(n instanceof Ot){return Hk(t,e,n)}else if(n instanceof Lt){return qk(t,e,n)}else{return br(t,e,n)}}function Uk(t,e,n){const r=We(t,e,n,{type:jR});Zn(t,r);const i=Yr(t,e,r,n,br(t,e,n));return XR(t,e,n,i)}function Gk(t,e,n){const r=We(t,e,n,{type:jR});Zn(t,r);const i=Yr(t,e,r,n,br(t,e,n));const a=Dp(t,e,n.separator,n);return XR(t,e,n,i,a)}function Hk(t,e,n){const r=We(t,e,n,{type:qR});Zn(t,r);const i=Yr(t,e,r,n,br(t,e,n));return zR(t,e,n,i)}function qk(t,e,n){const r=We(t,e,n,{type:qR});Zn(t,r);const i=Yr(t,e,r,n,br(t,e,n));const a=Dp(t,e,n.separator,n);return zR(t,e,n,i,a)}function jk(t,e,n){const r=We(t,e,n,{type:Xn});Zn(t,r);const i=H(n.definition,s=>VR(t,e,s));const a=Yr(t,e,r,n,...i);return a}function Bk(t,e,n){const r=We(t,e,n,{type:Xn});Zn(t,r);const i=Yr(t,e,r,n,br(t,e,n));return Wk(t,e,n,i)}function br(t,e,n){const r=It(H(n.definition,i=>VR(t,e,i)),i=>i!==void 0);if(r.length===1){return r[0]}else if(r.length===0){return void 0}else{return zk(t,r)}}function zR(t,e,n,r,i){const a=r.left;const s=r.right;const o=We(t,e,n,{type:Mk});Zn(t,o);const l=We(t,e,n,{type:BR});a.loopback=o;l.loopback=o;t.decisionMap[Gr(e,i?"RepetitionMandatoryWithSeparator":"RepetitionMandatory",n.idx)]=o;Ge(s,o);if(i===void 0){Ge(o,a);Ge(o,l)}else{Ge(o,l);Ge(o,i.left);Ge(i.right,a)}return{left:a,right:l}}function XR(t,e,n,r,i){const a=r.left;const s=r.right;const o=We(t,e,n,{type:xk});Zn(t,o);const l=We(t,e,n,{type:BR});const u=We(t,e,n,{type:Lk});o.loopback=u;l.loopback=u;Ge(o,a);Ge(o,l);Ge(s,u);if(i!==void 0){Ge(u,l);Ge(u,i.left);Ge(i.right,a)}else{Ge(u,o)}t.decisionMap[Gr(e,i?"RepetitionWithSeparator":"Repetition",n.idx)]=o;return{left:o,right:l}}function Wk(t,e,n,r){const i=r.left;const a=r.right;Ge(i,a);t.decisionMap[Gr(e,"Option",n.idx)]=i;return r}function Zn(t,e){t.decisionStates.push(e);e.decision=t.decisionStates.length-1;return e.decision}function Yr(t,e,n,r,...i){const a=We(t,e,r,{type:Ok,start:n});n.end=a;for(const o of i){if(o!==void 0){Ge(n,o.left);Ge(o.right,a)}else{Ge(n,a)}}const s={left:n,right:a};t.decisionMap[Gr(e,Vk(r),r.idx)]=n;return s}function Vk(t){if(t instanceof wt){return"Alternation"}else if(t instanceof et){return"Option"}else if(t instanceof _e){return"Repetition"}else if(t instanceof Tt){return"RepetitionWithSeparator"}else if(t instanceof Ot){return"RepetitionMandatory"}else if(t instanceof Lt){return"RepetitionMandatoryWithSeparator"}else{throw new Error("Invalid production type encountered")}}function zk(t,e){const n=e.length;for(let a=0;a<n-1;a++){const s=e[a];let o;if(s.left.transitions.length===1){o=s.left.transitions[0]}const l=o instanceof _p;const u=o;const c=e[a+1].left;if(s.left.type===Xn&&s.right.type===Xn&&o!==void 0&&(l&&u.followState===s.right||o.target===s.right)){if(l){u.followState=c}else{o.target=c}Jk(t,s.right)}else{Ge(s.right,c)}}const r=e[0];const i=e[n-1];return{left:r.left,right:i.right}}function Dp(t,e,n,r){const i=We(t,e,r,{type:Xn});const a=We(t,e,r,{type:Xn});Ip(i,new Pp(a,n));return{left:i,right:a}}function Xk(t,e,n){const r=n.referencedRule;const i=t.ruleToStartState.get(r);const a=We(t,e,n,{type:Xn});const s=We(t,e,n,{type:Xn});const o=new _p(i,r,s);Ip(a,o);return{left:a,right:s}}function Yk(t,e,n){const r=t.ruleToStartState.get(e);Ge(r,n.left);const i=t.ruleToStopState.get(e);Ge(n.right,i);const a={left:r,right:i};return a}function Ge(t,e){const n=new WR(e);Ip(t,n)}function We(t,e,n,r){const i=Object.assign({atn:t,production:n,epsilonOnlyTransitions:false,rule:e,transitions:[],nextTokenWithinRule:[],stateNumber:t.states.length},r);t.states.push(i);return i}function Ip(t,e){if(t.transitions.length===0){t.epsilonOnlyTransitions=e.isEpsilon()}t.transitions.push(e)}function Jk(t,e){t.states.splice(t.states.indexOf(e),1)}const hu={};class Bd{constructor(){this.map={};this.configs=[]}get size(){return this.configs.length}finalize(){this.map={}}add(e){const n=YR(e);if(!(n in this.map)){this.map[n]=this.configs.length;this.configs.push(e)}}get elements(){return this.configs}get alts(){return H(this.configs,e=>e.alt)}get key(){let e="";for(const n in this.map){e+=n+":"}return e}}function YR(t,e=true){return`${e?`a${t.alt}`:""}s${t.state.stateNumber}:${t.stack.map(n=>n.stateNumber.toString()).join("_")}`}function Qk(t,e){const n={};return r=>{const i=r.toString();let a=n[i];if(a!==void 0){return a}else{a={atnStartState:t,decision:e,states:{}};n[i]=a;return a}}}class JR{constructor(){this.predicates=[]}is(e){return e>=this.predicates.length||this.predicates[e]}set(e,n){this.predicates[e]=n}toString(){let e="";const n=this.predicates.length;for(let r=0;r<n;r++){e+=this.predicates[r]===true?"1":"0"}return e}}const Jm=new JR;class Zk extends kp{constructor(e){var n;super();this.logging=(n=e===null||e===void 0?void 0:e.logging)!==null&&n!==void 0?n:r=>console.log(r)}initialize(e){this.atn=Kk(e.rules);this.dfas=eN(this.atn)}validateAmbiguousAlternationAlternatives(){return[]}validateEmptyOrAlternatives(){return[]}buildLookaheadForAlternation(e){const{prodOccurrence:n,rule:r,hasPredicates:i,dynamicTokensEnabled:a}=e;const s=this.dfas;const o=this.logging;const l=Gr(r,"Alternation",n);const u=this.atn.decisionMap[l];const c=u.decision;const d=H(qm({maxLookahead:1,occurrence:n,prodType:"Alternation",rule:r}),f=>H(f,p=>p[0]));if(Qm(d,false)&&!a){const f=ft(d,(p,y,v)=>{X(y,b=>{if(b){p[b.tokenTypeIdx]=v;X(b.categoryMatches,$=>{p[$]=v})}});return p},{});if(i){return function(p){var y;const v=this.LA(1);const b=f[v.tokenTypeIdx];if(p!==void 0&&b!==void 0){const $=(y=p[b])===null||y===void 0?void 0:y.GATE;if($!==void 0&&$.call(this)===false){return void 0}}return b}}else{return function(){const p=this.LA(1);return f[p.tokenTypeIdx]}}}else if(i){return function(f){const p=new JR;const y=f===void 0?0:f.length;for(let b=0;b<y;b++){const $=f===null||f===void 0?void 0:f[b].GATE;p.set(b,$===void 0||$.call(this))}const v=Rc.call(this,s,c,p,o);return typeof v==="number"?v:void 0}}else{return function(){const f=Rc.call(this,s,c,Jm,o);return typeof f==="number"?f:void 0}}}buildLookaheadForOptional(e){const{prodOccurrence:n,rule:r,prodType:i,dynamicTokensEnabled:a}=e;const s=this.dfas;const o=this.logging;const l=Gr(r,i,n);const u=this.atn.decisionMap[l];const c=u.decision;const d=H(qm({maxLookahead:1,occurrence:n,prodType:i,rule:r}),f=>{return H(f,p=>p[0])});if(Qm(d)&&d[0][0]&&!a){const f=d[0];const p=Ft(f);if(p.length===1&&ye(p[0].categoryMatches)){const y=p[0];const v=y.tokenTypeIdx;return function(){return this.LA(1).tokenTypeIdx===v}}else{const y=ft(p,(v,b)=>{if(b!==void 0){v[b.tokenTypeIdx]=true;X(b.categoryMatches,$=>{v[$]=true})}return v},{});return function(){const v=this.LA(1);return y[v.tokenTypeIdx]===true}}}return function(){const f=Rc.call(this,s,c,Jm,o);return typeof f==="object"?false:f===0}}}function Qm(t,e=true){const n=new Set;for(const r of t){const i=new Set;for(const a of r){if(a===void 0){if(e){break}else{return false}}const s=[a.tokenTypeIdx].concat(a.categoryMatches);for(const o of s){if(n.has(o)){if(!i.has(o)){return false}}else{n.add(o);i.add(o)}}}}return true}function eN(t){const e=t.decisionStates.length;const n=Array(e);for(let r=0;r<e;r++){n[r]=Qk(t.decisionStates[r],r)}return n}function Rc(t,e,n,r){const i=t[e](n);let a=i.start;if(a===void 0){const o=dN(i.atnStartState);a=ZR(i,QR(o));i.start=a}const s=tN.apply(this,[i,a,n,r]);return s}function tN(t,e,n,r){let i=e;let a=1;const s=[];let o=this.LA(a++);while(true){let l=oN(i,o);if(l===void 0){l=nN.apply(this,[t,i,o,a,n,r])}if(l===hu){return sN(s,i,o)}if(l.isAcceptState===true){return l.prediction}i=l;s.push(o);o=this.LA(a++)}}function nN(t,e,n,r,i,a){const s=lN(e.configs,n,i);if(s.size===0){Zm(t,e,n,hu);return hu}let o=QR(s);const l=cN(s,i);if(l!==void 0){o.isAcceptState=true;o.prediction=l;o.configs.uniqueAlt=l}else if(hN(s)){const u=$A(s.alts);o.isAcceptState=true;o.prediction=u;o.configs.uniqueAlt=u;rN.apply(this,[t,r,s.alts,a])}o=Zm(t,e,n,o);return o}function rN(t,e,n,r){const i=[];for(let u=1;u<=e;u++){i.push(this.LA(u).tokenType)}const a=t.atnStartState;const s=a.rule;const o=a.production;const l=iN({topLevelRule:s,ambiguityIndices:n,production:o,prefixPath:i});r(l)}function iN(t){const e=H(t.prefixPath,i=>xr(i)).join(", ");const n=t.production.idx===0?"":t.production.idx;let r=`Ambiguous Alternatives Detected: <${t.ambiguityIndices.join(", ")}> in <${aN(t.production)}${n}> inside <${t.topLevelRule.name}> Rule,
<${e}> may appears as a prefix path in all these alternatives.
`;r=r+`See: https://chevrotain.io/docs/guide/resolving_grammar_errors.html#AMBIGUOUS_ALTERNATIVES
For Further details.`;return r}function aN(t){if(t instanceof pt){return"SUBRULE"}else if(t instanceof et){return"OPTION"}else if(t instanceof wt){return"OR"}else if(t instanceof Ot){return"AT_LEAST_ONE"}else if(t instanceof Lt){return"AT_LEAST_ONE_SEP"}else if(t instanceof Tt){return"MANY_SEP"}else if(t instanceof _e){return"MANY"}else if(t instanceof Te){return"CONSUME"}else{throw Error("non exhaustive match")}}function sN(t,e,n){const r=_t(e.configs.elements,a=>a.state.transitions);const i=NA(r.filter(a=>a instanceof Pp).map(a=>a.tokenType),a=>a.tokenTypeIdx);return{actualToken:n,possibleTokenTypes:i,tokenPath:t}}function oN(t,e){return t.edges[e.tokenTypeIdx]}function lN(t,e,n){const r=new Bd;const i=[];for(const s of t.elements){if(n.is(s.alt)===false){continue}if(s.state.type===as){i.push(s);continue}const o=s.state.transitions.length;for(let l=0;l<o;l++){const u=s.state.transitions[l];const c=uN(u,e);if(c!==void 0){r.add({state:c,alt:s.alt,stack:s.stack})}}}let a;if(i.length===0&&r.size===1){a=r}if(a===void 0){a=new Bd;for(const s of r.elements){yu(s,a)}}if(i.length>0&&!pN(a)){for(const s of i){a.add(s)}}return a}function uN(t,e){if(t instanceof Pp&&CR(e,t.tokenType)){return t.target}return void 0}function cN(t,e){let n;for(const r of t.elements){if(e.is(r.alt)===true){if(n===void 0){n=r.alt}else if(n!==r.alt){return void 0}}}return n}function QR(t){return{configs:t,edges:{},isAcceptState:false,prediction:-1}}function Zm(t,e,n,r){r=ZR(t,r);e.edges[n.tokenTypeIdx]=r;return r}function ZR(t,e){if(e===hu){return e}const n=e.configs.key;const r=t.states[n];if(r!==void 0){return r}e.configs.finalize();t.states[n]=e;return e}function dN(t){const e=new Bd;const n=t.transitions.length;for(let r=0;r<n;r++){const i=t.transitions[r].target;const a={state:i,alt:r,stack:[]};yu(a,e)}return e}function yu(t,e){const n=t.state;if(n.type===as){if(t.stack.length>0){const i=[...t.stack];const a=i.pop();const s={state:a,alt:t.alt,stack:i};yu(s,e)}else{e.add(t)}return}if(!n.epsilonOnlyTransitions){e.add(t)}const r=n.transitions.length;for(let i=0;i<r;i++){const a=n.transitions[i];const s=fN(t,a);if(s!==void 0){yu(s,e)}}}function fN(t,e){if(e instanceof WR){return{state:e.target,alt:t.alt,stack:t.stack}}else if(e instanceof _p){const n=[...t.stack,e.followState];return{state:e.target,alt:t.alt,stack:n}}return void 0}function pN(t){for(const e of t.elements){if(e.state.type===as){return true}}return false}function mN(t){for(const e of t.elements){if(e.state.type!==as){return false}}return true}function hN(t){if(mN(t)){return true}const e=yN(t.elements);const n=gN(e)&&!RN(e);return n}function yN(t){const e=new Map;for(const n of t){const r=YR(n,false);let i=e.get(r);if(i===void 0){i={};e.set(r,i)}i[n.alt]=true}return e}function gN(t){for(const e of Array.from(t.values())){if(Object.keys(e).length>1){return true}}return false}function RN(t){for(const e of Array.from(t.values())){if(Object.keys(e).length===1){return true}}return false}var Wd;(function(t){function e(n){return typeof n==="string"}t.is=e})(Wd||(Wd={}));var gu;(function(t){function e(n){return typeof n==="string"}t.is=e})(gu||(gu={}));var Vd;(function(t){t.MIN_VALUE=-2147483648;t.MAX_VALUE=2147483647;function e(n){return typeof n==="number"&&t.MIN_VALUE<=n&&n<=t.MAX_VALUE}t.is=e})(Vd||(Vd={}));var xa;(function(t){t.MIN_VALUE=0;t.MAX_VALUE=2147483647;function e(n){return typeof n==="number"&&t.MIN_VALUE<=n&&n<=t.MAX_VALUE}t.is=e})(xa||(xa={}));var le;(function(t){function e(r,i){if(r===Number.MAX_VALUE){r=xa.MAX_VALUE}if(i===Number.MAX_VALUE){i=xa.MAX_VALUE}return{line:r,character:i}}t.create=e;function n(r){let i=r;return T.objectLiteral(i)&&T.uinteger(i.line)&&T.uinteger(i.character)}t.is=n})(le||(le={}));var re;(function(t){function e(r,i,a,s){if(T.uinteger(r)&&T.uinteger(i)&&T.uinteger(a)&&T.uinteger(s)){return{start:le.create(r,i),end:le.create(a,s)}}else if(le.is(r)&&le.is(i)){return{start:r,end:i}}else{throw new Error(`Range#create called with invalid arguments[${r}, ${i}, ${a}, ${s}]`)}}t.create=e;function n(r){let i=r;return T.objectLiteral(i)&&le.is(i.start)&&le.is(i.end)}t.is=n})(re||(re={}));var Ma;(function(t){function e(r,i){return{uri:r,range:i}}t.create=e;function n(r){let i=r;return T.objectLiteral(i)&&re.is(i.range)&&(T.string(i.uri)||T.undefined(i.uri))}t.is=n})(Ma||(Ma={}));var zd;(function(t){function e(r,i,a,s){return{targetUri:r,targetRange:i,targetSelectionRange:a,originSelectionRange:s}}t.create=e;function n(r){let i=r;return T.objectLiteral(i)&&re.is(i.targetRange)&&T.string(i.targetUri)&&re.is(i.targetSelectionRange)&&(re.is(i.originSelectionRange)||T.undefined(i.originSelectionRange))}t.is=n})(zd||(zd={}));var Ru;(function(t){function e(r,i,a,s){return{red:r,green:i,blue:a,alpha:s}}t.create=e;function n(r){const i=r;return T.objectLiteral(i)&&T.numberRange(i.red,0,1)&&T.numberRange(i.green,0,1)&&T.numberRange(i.blue,0,1)&&T.numberRange(i.alpha,0,1)}t.is=n})(Ru||(Ru={}));var Xd;(function(t){function e(r,i){return{range:r,color:i}}t.create=e;function n(r){const i=r;return T.objectLiteral(i)&&re.is(i.range)&&Ru.is(i.color)}t.is=n})(Xd||(Xd={}));var Yd;(function(t){function e(r,i,a){return{label:r,textEdit:i,additionalTextEdits:a}}t.create=e;function n(r){const i=r;return T.objectLiteral(i)&&T.string(i.label)&&(T.undefined(i.textEdit)||Wt.is(i))&&(T.undefined(i.additionalTextEdits)||T.typedArray(i.additionalTextEdits,Wt.is))}t.is=n})(Yd||(Yd={}));var Jd;(function(t){t.Comment="comment";t.Imports="imports";t.Region="region"})(Jd||(Jd={}));var Qd;(function(t){function e(r,i,a,s,o,l){const u={startLine:r,endLine:i};if(T.defined(a)){u.startCharacter=a}if(T.defined(s)){u.endCharacter=s}if(T.defined(o)){u.kind=o}if(T.defined(l)){u.collapsedText=l}return u}t.create=e;function n(r){const i=r;return T.objectLiteral(i)&&T.uinteger(i.startLine)&&T.uinteger(i.startLine)&&(T.undefined(i.startCharacter)||T.uinteger(i.startCharacter))&&(T.undefined(i.endCharacter)||T.uinteger(i.endCharacter))&&(T.undefined(i.kind)||T.string(i.kind))}t.is=n})(Qd||(Qd={}));var $u;(function(t){function e(r,i){return{location:r,message:i}}t.create=e;function n(r){let i=r;return T.defined(i)&&Ma.is(i.location)&&T.string(i.message)}t.is=n})($u||($u={}));var Zd;(function(t){t.Error=1;t.Warning=2;t.Information=3;t.Hint=4})(Zd||(Zd={}));var ef;(function(t){t.Unnecessary=1;t.Deprecated=2})(ef||(ef={}));var tf;(function(t){function e(n){const r=n;return T.objectLiteral(r)&&T.string(r.href)}t.is=e})(tf||(tf={}));var Ka;(function(t){function e(r,i,a,s,o,l){let u={range:r,message:i};if(T.defined(a)){u.severity=a}if(T.defined(s)){u.code=s}if(T.defined(o)){u.source=o}if(T.defined(l)){u.relatedInformation=l}return u}t.create=e;function n(r){var i;let a=r;return T.defined(a)&&re.is(a.range)&&T.string(a.message)&&(T.number(a.severity)||T.undefined(a.severity))&&(T.integer(a.code)||T.string(a.code)||T.undefined(a.code))&&(T.undefined(a.codeDescription)||T.string((i=a.codeDescription)===null||i===void 0?void 0:i.href))&&(T.string(a.source)||T.undefined(a.source))&&(T.undefined(a.relatedInformation)||T.typedArray(a.relatedInformation,$u.is))}t.is=n})(Ka||(Ka={}));var Tr;(function(t){function e(r,i,...a){let s={title:r,command:i};if(T.defined(a)&&a.length>0){s.arguments=a}return s}t.create=e;function n(r){let i=r;return T.defined(i)&&T.string(i.title)&&T.string(i.command)}t.is=n})(Tr||(Tr={}));var Wt;(function(t){function e(a,s){return{range:a,newText:s}}t.replace=e;function n(a,s){return{range:{start:a,end:a},newText:s}}t.insert=n;function r(a){return{range:a,newText:""}}t.del=r;function i(a){const s=a;return T.objectLiteral(s)&&T.string(s.newText)&&re.is(s.range)}t.is=i})(Wt||(Wt={}));var mr;(function(t){function e(r,i,a){const s={label:r};if(i!==void 0){s.needsConfirmation=i}if(a!==void 0){s.description=a}return s}t.create=e;function n(r){const i=r;return T.objectLiteral(i)&&T.string(i.label)&&(T.boolean(i.needsConfirmation)||i.needsConfirmation===void 0)&&(T.string(i.description)||i.description===void 0)}t.is=n})(mr||(mr={}));var Qe;(function(t){function e(n){const r=n;return T.string(r)}t.is=e})(Qe||(Qe={}));var Sn;(function(t){function e(a,s,o){return{range:a,newText:s,annotationId:o}}t.replace=e;function n(a,s,o){return{range:{start:a,end:a},newText:s,annotationId:o}}t.insert=n;function r(a,s){return{range:a,newText:"",annotationId:s}}t.del=r;function i(a){const s=a;return Wt.is(s)&&(mr.is(s.annotationId)||Qe.is(s.annotationId))}t.is=i})(Sn||(Sn={}));var Fa;(function(t){function e(r,i){return{textDocument:r,edits:i}}t.create=e;function n(r){let i=r;return T.defined(i)&&Ua.is(i.textDocument)&&Array.isArray(i.edits)}t.is=n})(Fa||(Fa={}));var Hr;(function(t){function e(r,i,a){let s={kind:"create",uri:r};if(i!==void 0&&(i.overwrite!==void 0||i.ignoreIfExists!==void 0)){s.options=i}if(a!==void 0){s.annotationId=a}return s}t.create=e;function n(r){let i=r;return i&&i.kind==="create"&&T.string(i.uri)&&(i.options===void 0||(i.options.overwrite===void 0||T.boolean(i.options.overwrite))&&(i.options.ignoreIfExists===void 0||T.boolean(i.options.ignoreIfExists)))&&(i.annotationId===void 0||Qe.is(i.annotationId))}t.is=n})(Hr||(Hr={}));var qr;(function(t){function e(r,i,a,s){let o={kind:"rename",oldUri:r,newUri:i};if(a!==void 0&&(a.overwrite!==void 0||a.ignoreIfExists!==void 0)){o.options=a}if(s!==void 0){o.annotationId=s}return o}t.create=e;function n(r){let i=r;return i&&i.kind==="rename"&&T.string(i.oldUri)&&T.string(i.newUri)&&(i.options===void 0||(i.options.overwrite===void 0||T.boolean(i.options.overwrite))&&(i.options.ignoreIfExists===void 0||T.boolean(i.options.ignoreIfExists)))&&(i.annotationId===void 0||Qe.is(i.annotationId))}t.is=n})(qr||(qr={}));var jr;(function(t){function e(r,i,a){let s={kind:"delete",uri:r};if(i!==void 0&&(i.recursive!==void 0||i.ignoreIfNotExists!==void 0)){s.options=i}if(a!==void 0){s.annotationId=a}return s}t.create=e;function n(r){let i=r;return i&&i.kind==="delete"&&T.string(i.uri)&&(i.options===void 0||(i.options.recursive===void 0||T.boolean(i.options.recursive))&&(i.options.ignoreIfNotExists===void 0||T.boolean(i.options.ignoreIfNotExists)))&&(i.annotationId===void 0||Qe.is(i.annotationId))}t.is=n})(jr||(jr={}));var vu;(function(t){function e(n){let r=n;return r&&(r.changes!==void 0||r.documentChanges!==void 0)&&(r.documentChanges===void 0||r.documentChanges.every(i=>{if(T.string(i.kind)){return Hr.is(i)||qr.is(i)||jr.is(i)}else{return Fa.is(i)}}))}t.is=e})(vu||(vu={}));class xs{constructor(e,n){this.edits=e;this.changeAnnotations=n}insert(e,n,r){let i;let a;if(r===void 0){i=Wt.insert(e,n)}else if(Qe.is(r)){a=r;i=Sn.insert(e,n,r)}else{this.assertChangeAnnotations(this.changeAnnotations);a=this.changeAnnotations.manage(r);i=Sn.insert(e,n,a)}this.edits.push(i);if(a!==void 0){return a}}replace(e,n,r){let i;let a;if(r===void 0){i=Wt.replace(e,n)}else if(Qe.is(r)){a=r;i=Sn.replace(e,n,r)}else{this.assertChangeAnnotations(this.changeAnnotations);a=this.changeAnnotations.manage(r);i=Sn.replace(e,n,a)}this.edits.push(i);if(a!==void 0){return a}}delete(e,n){let r;let i;if(n===void 0){r=Wt.del(e)}else if(Qe.is(n)){i=n;r=Sn.del(e,n)}else{this.assertChangeAnnotations(this.changeAnnotations);i=this.changeAnnotations.manage(n);r=Sn.del(e,i)}this.edits.push(r);if(i!==void 0){return i}}add(e){this.edits.push(e)}all(){return this.edits}clear(){this.edits.splice(0,this.edits.length)}assertChangeAnnotations(e){if(e===void 0){throw new Error(`Text edit change is not configured to manage change annotations.`)}}}class eh{constructor(e){this._annotations=e===void 0?Object.create(null):e;this._counter=0;this._size=0}all(){return this._annotations}get size(){return this._size}manage(e,n){let r;if(Qe.is(e)){r=e}else{r=this.nextId();n=e}if(this._annotations[r]!==void 0){throw new Error(`Id ${r} is already in use.`)}if(n===void 0){throw new Error(`No annotation provided for id ${r}`)}this._annotations[r]=n;this._size++;return r}nextId(){this._counter++;return this._counter.toString()}}class $N{constructor(e){this._textEditChanges=Object.create(null);if(e!==void 0){this._workspaceEdit=e;if(e.documentChanges){this._changeAnnotations=new eh(e.changeAnnotations);e.changeAnnotations=this._changeAnnotations.all();e.documentChanges.forEach(n=>{if(Fa.is(n)){const r=new xs(n.edits,this._changeAnnotations);this._textEditChanges[n.textDocument.uri]=r}})}else if(e.changes){Object.keys(e.changes).forEach(n=>{const r=new xs(e.changes[n]);this._textEditChanges[n]=r})}}else{this._workspaceEdit={}}}get edit(){this.initDocumentChanges();if(this._changeAnnotations!==void 0){if(this._changeAnnotations.size===0){this._workspaceEdit.changeAnnotations=void 0}else{this._workspaceEdit.changeAnnotations=this._changeAnnotations.all()}}return this._workspaceEdit}getTextEditChange(e){if(Ua.is(e)){this.initDocumentChanges();if(this._workspaceEdit.documentChanges===void 0){throw new Error("Workspace edit is not configured for document changes.")}const n={uri:e.uri,version:e.version};let r=this._textEditChanges[n.uri];if(!r){const i=[];const a={textDocument:n,edits:i};this._workspaceEdit.documentChanges.push(a);r=new xs(i,this._changeAnnotations);this._textEditChanges[n.uri]=r}return r}else{this.initChanges();if(this._workspaceEdit.changes===void 0){throw new Error("Workspace edit is not configured for normal text edit changes.")}let n=this._textEditChanges[e];if(!n){let r=[];this._workspaceEdit.changes[e]=r;n=new xs(r);this._textEditChanges[e]=n}return n}}initDocumentChanges(){if(this._workspaceEdit.documentChanges===void 0&&this._workspaceEdit.changes===void 0){this._changeAnnotations=new eh;this._workspaceEdit.documentChanges=[];this._workspaceEdit.changeAnnotations=this._changeAnnotations.all()}}initChanges(){if(this._workspaceEdit.documentChanges===void 0&&this._workspaceEdit.changes===void 0){this._workspaceEdit.changes=Object.create(null)}}createFile(e,n,r){this.initDocumentChanges();if(this._workspaceEdit.documentChanges===void 0){throw new Error("Workspace edit is not configured for document changes.")}let i;if(mr.is(n)||Qe.is(n)){i=n}else{r=n}let a;let s;if(i===void 0){a=Hr.create(e,r)}else{s=Qe.is(i)?i:this._changeAnnotations.manage(i);a=Hr.create(e,r,s)}this._workspaceEdit.documentChanges.push(a);if(s!==void 0){return s}}renameFile(e,n,r,i){this.initDocumentChanges();if(this._workspaceEdit.documentChanges===void 0){throw new Error("Workspace edit is not configured for document changes.")}let a;if(mr.is(r)||Qe.is(r)){a=r}else{i=r}let s;let o;if(a===void 0){s=qr.create(e,n,i)}else{o=Qe.is(a)?a:this._changeAnnotations.manage(a);s=qr.create(e,n,i,o)}this._workspaceEdit.documentChanges.push(s);if(o!==void 0){return o}}deleteFile(e,n,r){this.initDocumentChanges();if(this._workspaceEdit.documentChanges===void 0){throw new Error("Workspace edit is not configured for document changes.")}let i;if(mr.is(n)||Qe.is(n)){i=n}else{r=n}let a;let s;if(i===void 0){a=jr.create(e,r)}else{s=Qe.is(i)?i:this._changeAnnotations.manage(i);a=jr.create(e,r,s)}this._workspaceEdit.documentChanges.push(a);if(s!==void 0){return s}}}var nf;(function(t){function e(r){return{uri:r}}t.create=e;function n(r){let i=r;return T.defined(i)&&T.string(i.uri)}t.is=n})(nf||(nf={}));var rf;(function(t){function e(r,i){return{uri:r,version:i}}t.create=e;function n(r){let i=r;return T.defined(i)&&T.string(i.uri)&&T.integer(i.version)}t.is=n})(rf||(rf={}));var Ua;(function(t){function e(r,i){return{uri:r,version:i}}t.create=e;function n(r){let i=r;return T.defined(i)&&T.string(i.uri)&&(i.version===null||T.integer(i.version))}t.is=n})(Ua||(Ua={}));var af;(function(t){function e(r,i,a,s){return{uri:r,languageId:i,version:a,text:s}}t.create=e;function n(r){let i=r;return T.defined(i)&&T.string(i.uri)&&T.string(i.languageId)&&T.integer(i.version)&&T.string(i.text)}t.is=n})(af||(af={}));var Tu;(function(t){t.PlainText="plaintext";t.Markdown="markdown";function e(n){const r=n;return r===t.PlainText||r===t.Markdown}t.is=e})(Tu||(Tu={}));var Br;(function(t){function e(n){const r=n;return T.objectLiteral(n)&&Tu.is(r.kind)&&T.string(r.value)}t.is=e})(Br||(Br={}));var An;(function(t){t.Text=1;t.Method=2;t.Function=3;t.Constructor=4;t.Field=5;t.Variable=6;t.Class=7;t.Interface=8;t.Module=9;t.Property=10;t.Unit=11;t.Value=12;t.Enum=13;t.Keyword=14;t.Snippet=15;t.Color=16;t.File=17;t.Reference=18;t.Folder=19;t.EnumMember=20;t.Constant=21;t.Struct=22;t.Event=23;t.Operator=24;t.TypeParameter=25})(An||(An={}));var sf;(function(t){t.PlainText=1;t.Snippet=2})(sf||(sf={}));var of;(function(t){t.Deprecated=1})(of||(of={}));var lf;(function(t){function e(r,i,a){return{newText:r,insert:i,replace:a}}t.create=e;function n(r){const i=r;return i&&T.string(i.newText)&&re.is(i.insert)&&re.is(i.replace)}t.is=n})(lf||(lf={}));var uf;(function(t){t.asIs=1;t.adjustIndentation=2})(uf||(uf={}));var cf;(function(t){function e(n){const r=n;return r&&(T.string(r.detail)||r.detail===void 0)&&(T.string(r.description)||r.description===void 0)}t.is=e})(cf||(cf={}));var df;(function(t){function e(n){return{label:n}}t.create=e})(df||(df={}));var ff;(function(t){function e(n,r){return{items:n?n:[],isIncomplete:!!r}}t.create=e})(ff||(ff={}));var Ga;(function(t){function e(r){return r.replace(/[\\`*_{}[\]()#+\-.!]/g,"\\$&")}t.fromPlainText=e;function n(r){const i=r;return T.string(i)||T.objectLiteral(i)&&T.string(i.language)&&T.string(i.value)}t.is=n})(Ga||(Ga={}));var pf;(function(t){function e(n){let r=n;return!!r&&T.objectLiteral(r)&&(Br.is(r.contents)||Ga.is(r.contents)||T.typedArray(r.contents,Ga.is))&&(n.range===void 0||re.is(n.range))}t.is=e})(pf||(pf={}));var mf;(function(t){function e(n,r){return r?{label:n,documentation:r}:{label:n}}t.create=e})(mf||(mf={}));var hf;(function(t){function e(n,r,...i){let a={label:n};if(T.defined(r)){a.documentation=r}if(T.defined(i)){a.parameters=i}else{a.parameters=[]}return a}t.create=e})(hf||(hf={}));var yf;(function(t){t.Text=1;t.Read=2;t.Write=3})(yf||(yf={}));var gf;(function(t){function e(n,r){let i={range:n};if(T.number(r)){i.kind=r}return i}t.create=e})(gf||(gf={}));var bn;(function(t){t.File=1;t.Module=2;t.Namespace=3;t.Package=4;t.Class=5;t.Method=6;t.Property=7;t.Field=8;t.Constructor=9;t.Enum=10;t.Interface=11;t.Function=12;t.Variable=13;t.Constant=14;t.String=15;t.Number=16;t.Boolean=17;t.Array=18;t.Object=19;t.Key=20;t.Null=21;t.EnumMember=22;t.Struct=23;t.Event=24;t.Operator=25;t.TypeParameter=26})(bn||(bn={}));var Rf;(function(t){t.Deprecated=1})(Rf||(Rf={}));var $f;(function(t){function e(n,r,i,a,s){let o={name:n,kind:r,location:{uri:a,range:i}};if(s){o.containerName=s}return o}t.create=e})($f||($f={}));var vf;(function(t){function e(n,r,i,a){return a!==void 0?{name:n,kind:r,location:{uri:i,range:a}}:{name:n,kind:r,location:{uri:i}}}t.create=e})(vf||(vf={}));var Tf;(function(t){function e(r,i,a,s,o,l){let u={name:r,detail:i,kind:a,range:s,selectionRange:o};if(l!==void 0){u.children=l}return u}t.create=e;function n(r){let i=r;return i&&T.string(i.name)&&T.number(i.kind)&&re.is(i.range)&&re.is(i.selectionRange)&&(i.detail===void 0||T.string(i.detail))&&(i.deprecated===void 0||T.boolean(i.deprecated))&&(i.children===void 0||Array.isArray(i.children))&&(i.tags===void 0||Array.isArray(i.tags))}t.is=n})(Tf||(Tf={}));var wf;(function(t){t.Empty="";t.QuickFix="quickfix";t.Refactor="refactor";t.RefactorExtract="refactor.extract";t.RefactorInline="refactor.inline";t.RefactorRewrite="refactor.rewrite";t.Source="source";t.SourceOrganizeImports="source.organizeImports";t.SourceFixAll="source.fixAll"})(wf||(wf={}));var Ha;(function(t){t.Invoked=1;t.Automatic=2})(Ha||(Ha={}));var Ef;(function(t){function e(r,i,a){let s={diagnostics:r};if(i!==void 0&&i!==null){s.only=i}if(a!==void 0&&a!==null){s.triggerKind=a}return s}t.create=e;function n(r){let i=r;return T.defined(i)&&T.typedArray(i.diagnostics,Ka.is)&&(i.only===void 0||T.typedArray(i.only,T.string))&&(i.triggerKind===void 0||i.triggerKind===Ha.Invoked||i.triggerKind===Ha.Automatic)}t.is=n})(Ef||(Ef={}));var Cf;(function(t){function e(r,i,a){let s={title:r};let o=true;if(typeof i==="string"){o=false;s.kind=i}else if(Tr.is(i)){s.command=i}else{s.edit=i}if(o&&a!==void 0){s.kind=a}return s}t.create=e;function n(r){let i=r;return i&&T.string(i.title)&&(i.diagnostics===void 0||T.typedArray(i.diagnostics,Ka.is))&&(i.kind===void 0||T.string(i.kind))&&(i.edit!==void 0||i.command!==void 0)&&(i.command===void 0||Tr.is(i.command))&&(i.isPreferred===void 0||T.boolean(i.isPreferred))&&(i.edit===void 0||vu.is(i.edit))}t.is=n})(Cf||(Cf={}));var Sf;(function(t){function e(r,i){let a={range:r};if(T.defined(i)){a.data=i}return a}t.create=e;function n(r){let i=r;return T.defined(i)&&re.is(i.range)&&(T.undefined(i.command)||Tr.is(i.command))}t.is=n})(Sf||(Sf={}));var Af;(function(t){function e(r,i){return{tabSize:r,insertSpaces:i}}t.create=e;function n(r){let i=r;return T.defined(i)&&T.uinteger(i.tabSize)&&T.boolean(i.insertSpaces)}t.is=n})(Af||(Af={}));var bf;(function(t){function e(r,i,a){return{range:r,target:i,data:a}}t.create=e;function n(r){let i=r;return T.defined(i)&&re.is(i.range)&&(T.undefined(i.target)||T.string(i.target))}t.is=n})(bf||(bf={}));var kf;(function(t){function e(r,i){return{range:r,parent:i}}t.create=e;function n(r){let i=r;return T.objectLiteral(i)&&re.is(i.range)&&(i.parent===void 0||t.is(i.parent))}t.is=n})(kf||(kf={}));var Nf;(function(t){t["namespace"]="namespace";t["type"]="type";t["class"]="class";t["enum"]="enum";t["interface"]="interface";t["struct"]="struct";t["typeParameter"]="typeParameter";t["parameter"]="parameter";t["variable"]="variable";t["property"]="property";t["enumMember"]="enumMember";t["event"]="event";t["function"]="function";t["method"]="method";t["macro"]="macro";t["keyword"]="keyword";t["modifier"]="modifier";t["comment"]="comment";t["string"]="string";t["number"]="number";t["regexp"]="regexp";t["operator"]="operator";t["decorator"]="decorator"})(Nf||(Nf={}));var Pf;(function(t){t["declaration"]="declaration";t["definition"]="definition";t["readonly"]="readonly";t["static"]="static";t["deprecated"]="deprecated";t["abstract"]="abstract";t["async"]="async";t["modification"]="modification";t["documentation"]="documentation";t["defaultLibrary"]="defaultLibrary"})(Pf||(Pf={}));var _f;(function(t){function e(n){const r=n;return T.objectLiteral(r)&&(r.resultId===void 0||typeof r.resultId==="string")&&Array.isArray(r.data)&&(r.data.length===0||typeof r.data[0]==="number")}t.is=e})(_f||(_f={}));var Df;(function(t){function e(r,i){return{range:r,text:i}}t.create=e;function n(r){const i=r;return i!==void 0&&i!==null&&re.is(i.range)&&T.string(i.text)}t.is=n})(Df||(Df={}));var If;(function(t){function e(r,i,a){return{range:r,variableName:i,caseSensitiveLookup:a}}t.create=e;function n(r){const i=r;return i!==void 0&&i!==null&&re.is(i.range)&&T.boolean(i.caseSensitiveLookup)&&(T.string(i.variableName)||i.variableName===void 0)}t.is=n})(If||(If={}));var Of;(function(t){function e(r,i){return{range:r,expression:i}}t.create=e;function n(r){const i=r;return i!==void 0&&i!==null&&re.is(i.range)&&(T.string(i.expression)||i.expression===void 0)}t.is=n})(Of||(Of={}));var Lf;(function(t){function e(r,i){return{frameId:r,stoppedLocation:i}}t.create=e;function n(r){const i=r;return T.defined(i)&&re.is(r.stoppedLocation)}t.is=n})(Lf||(Lf={}));var wu;(function(t){t.Type=1;t.Parameter=2;function e(n){return n===1||n===2}t.is=e})(wu||(wu={}));var Eu;(function(t){function e(r){return{value:r}}t.create=e;function n(r){const i=r;return T.objectLiteral(i)&&(i.tooltip===void 0||T.string(i.tooltip)||Br.is(i.tooltip))&&(i.location===void 0||Ma.is(i.location))&&(i.command===void 0||Tr.is(i.command))}t.is=n})(Eu||(Eu={}));var xf;(function(t){function e(r,i,a){const s={position:r,label:i};if(a!==void 0){s.kind=a}return s}t.create=e;function n(r){const i=r;return T.objectLiteral(i)&&le.is(i.position)&&(T.string(i.label)||T.typedArray(i.label,Eu.is))&&(i.kind===void 0||wu.is(i.kind))&&i.textEdits===void 0||T.typedArray(i.textEdits,Wt.is)&&(i.tooltip===void 0||T.string(i.tooltip)||Br.is(i.tooltip))&&(i.paddingLeft===void 0||T.boolean(i.paddingLeft))&&(i.paddingRight===void 0||T.boolean(i.paddingRight))}t.is=n})(xf||(xf={}));var Mf;(function(t){function e(n){return{kind:"snippet",value:n}}t.createSnippet=e})(Mf||(Mf={}));var Kf;(function(t){function e(n,r,i,a){return{insertText:n,filterText:r,range:i,command:a}}t.create=e})(Kf||(Kf={}));var Ff;(function(t){function e(n){return{items:n}}t.create=e})(Ff||(Ff={}));var Uf;(function(t){t.Invoked=0;t.Automatic=1})(Uf||(Uf={}));var Gf;(function(t){function e(n,r){return{range:n,text:r}}t.create=e})(Gf||(Gf={}));var Hf;(function(t){function e(n,r){return{triggerKind:n,selectedCompletionInfo:r}}t.create=e})(Hf||(Hf={}));var qf;(function(t){function e(n){const r=n;return T.objectLiteral(r)&&gu.is(r.uri)&&T.string(r.name)}t.is=e})(qf||(qf={}));const vN=["\n","\r\n","\r"];var jf;(function(t){function e(a,s,o,l){return new TN(a,s,o,l)}t.create=e;function n(a){let s=a;return T.defined(s)&&T.string(s.uri)&&(T.undefined(s.languageId)||T.string(s.languageId))&&T.uinteger(s.lineCount)&&T.func(s.getText)&&T.func(s.positionAt)&&T.func(s.offsetAt)?true:false}t.is=n;function r(a,s){let o=a.getText();let l=i(s,(c,d)=>{let f=c.range.start.line-d.range.start.line;if(f===0){return c.range.start.character-d.range.start.character}return f});let u=o.length;for(let c=l.length-1;c>=0;c--){let d=l[c];let f=a.offsetAt(d.range.start);let p=a.offsetAt(d.range.end);if(p<=u){o=o.substring(0,f)+d.newText+o.substring(p,o.length)}else{throw new Error("Overlapping edit")}u=f}return o}t.applyEdits=r;function i(a,s){if(a.length<=1){return a}const o=a.length/2|0;const l=a.slice(0,o);const u=a.slice(o);i(l,s);i(u,s);let c=0;let d=0;let f=0;while(c<l.length&&d<u.length){let p=s(l[c],u[d]);if(p<=0){a[f++]=l[c++]}else{a[f++]=u[d++]}}while(c<l.length){a[f++]=l[c++]}while(d<u.length){a[f++]=u[d++]}return a}})(jf||(jf={}));let TN=class II{constructor(e,n,r,i){this._uri=e;this._languageId=n;this._version=r;this._content=i;this._lineOffsets=void 0}get uri(){return this._uri}get languageId(){return this._languageId}get version(){return this._version}getText(e){if(e){let n=this.offsetAt(e.start);let r=this.offsetAt(e.end);return this._content.substring(n,r)}return this._content}update(e,n){this._content=e.text;this._version=n;this._lineOffsets=void 0}getLineOffsets(){if(this._lineOffsets===void 0){let e=[];let n=this._content;let r=true;for(let i=0;i<n.length;i++){if(r){e.push(i);r=false}let a=n.charAt(i);r=a==="\r"||a==="\n";if(a==="\r"&&i+1<n.length&&n.charAt(i+1)==="\n"){i++}}if(r&&n.length>0){e.push(n.length)}this._lineOffsets=e}return this._lineOffsets}positionAt(e){e=Math.max(Math.min(e,this._content.length),0);let n=this.getLineOffsets();let r=0,i=n.length;if(i===0){return le.create(0,e)}while(r<i){let s=Math.floor((r+i)/2);if(n[s]>e){i=s}else{r=s+1}}let a=r-1;return le.create(a,e-n[a])}offsetAt(e){let n=this.getLineOffsets();if(e.line>=n.length){return this._content.length}else if(e.line<0){return 0}let r=n[e.line];let i=e.line+1<n.length?n[e.line+1]:this._content.length;return Math.max(Math.min(r+e.character,i),r)}get lineCount(){return this.getLineOffsets().length}};var T;(function(t){const e=Object.prototype.toString;function n(p){return typeof p!=="undefined"}t.defined=n;function r(p){return typeof p==="undefined"}t.undefined=r;function i(p){return p===true||p===false}t.boolean=i;function a(p){return e.call(p)==="[object String]"}t.string=a;function s(p){return e.call(p)==="[object Number]"}t.number=s;function o(p,y,v){return e.call(p)==="[object Number]"&&y<=p&&p<=v}t.numberRange=o;function l(p){return e.call(p)==="[object Number]"&&-2147483648<=p&&p<=2147483647}t.integer=l;function u(p){return e.call(p)==="[object Number]"&&0<=p&&p<=2147483647}t.uinteger=u;function c(p){return e.call(p)==="[object Function]"}t.func=c;function d(p){return p!==null&&typeof p==="object"}t.objectLiteral=d;function f(p,y){return Array.isArray(p)&&p.every(y)}t.typedArray=f})(T||(T={}));var wN=Object.freeze({__proto__:null,get AnnotatedTextEdit(){return Sn},get ChangeAnnotation(){return mr},get ChangeAnnotationIdentifier(){return Qe},get CodeAction(){return Cf},get CodeActionContext(){return Ef},get CodeActionKind(){return wf},get CodeActionTriggerKind(){return Ha},get CodeDescription(){return tf},get CodeLens(){return Sf},get Color(){return Ru},get ColorInformation(){return Xd},get ColorPresentation(){return Yd},get Command(){return Tr},get CompletionItem(){return df},get CompletionItemKind(){return An},get CompletionItemLabelDetails(){return cf},get CompletionItemTag(){return of},get CompletionList(){return ff},get CreateFile(){return Hr},get DeleteFile(){return jr},get Diagnostic(){return Ka},get DiagnosticRelatedInformation(){return $u},get DiagnosticSeverity(){return Zd},get DiagnosticTag(){return ef},get DocumentHighlight(){return gf},get DocumentHighlightKind(){return yf},get DocumentLink(){return bf},get DocumentSymbol(){return Tf},get DocumentUri(){return Wd},EOL:vN,get FoldingRange(){return Qd},get FoldingRangeKind(){return Jd},get FormattingOptions(){return Af},get Hover(){return pf},get InlayHint(){return xf},get InlayHintKind(){return wu},get InlayHintLabelPart(){return Eu},get InlineCompletionContext(){return Hf},get InlineCompletionItem(){return Kf},get InlineCompletionList(){return Ff},get InlineCompletionTriggerKind(){return Uf},get InlineValueContext(){return Lf},get InlineValueEvaluatableExpression(){return Of},get InlineValueText(){return Df},get InlineValueVariableLookup(){return If},get InsertReplaceEdit(){return lf},get InsertTextFormat(){return sf},get InsertTextMode(){return uf},get Location(){return Ma},get LocationLink(){return zd},get MarkedString(){return Ga},get MarkupContent(){return Br},get MarkupKind(){return Tu},get OptionalVersionedTextDocumentIdentifier(){return Ua},get ParameterInformation(){return mf},get Position(){return le},get Range(){return re},get RenameFile(){return qr},get SelectedCompletionInfo(){return Gf},get SelectionRange(){return kf},get SemanticTokenModifiers(){return Pf},get SemanticTokenTypes(){return Nf},get SemanticTokens(){return _f},get SignatureInformation(){return hf},get StringValue(){return Mf},get SymbolInformation(){return $f},get SymbolKind(){return bn},get SymbolTag(){return Rf},get TextDocument(){return jf},get TextDocumentEdit(){return Fa},get TextDocumentIdentifier(){return nf},get TextDocumentItem(){return af},get TextEdit(){return Wt},get URI(){return gu},get VersionedTextDocumentIdentifier(){return rf},WorkspaceChange:$N,get WorkspaceEdit(){return vu},get WorkspaceFolder(){return qf},get WorkspaceSymbol(){return vf},get integer(){return Vd},get uinteger(){return xa}});class EN{constructor(){this.nodeStack=[]}get current(){var e;return(e=this.nodeStack[this.nodeStack.length-1])!==null&&e!==void 0?e:this.rootNode}buildRootNode(e){this.rootNode=new t$(e);this.rootNode.root=this.rootNode;this.nodeStack=[this.rootNode];return this.rootNode}buildCompositeNode(e){const n=new Op;n.grammarSource=e;n.root=this.rootNode;this.current.content.push(n);this.nodeStack.push(n);return n}buildLeafNode(e,n){const r=new Bf(e.startOffset,e.image.length,bd(e),e.tokenType,!n);r.grammarSource=n;r.root=this.rootNode;this.current.content.push(r);return r}removeNode(e){const n=e.container;if(n){const r=n.content.indexOf(e);if(r>=0){n.content.splice(r,1)}}}addHiddenNodes(e){const n=[];for(const a of e){const s=new Bf(a.startOffset,a.image.length,bd(a),a.tokenType,true);s.root=this.rootNode;n.push(s)}let r=this.current;let i=false;if(r.content.length>0){r.content.push(...n);return}while(r.container){const a=r.container.content.indexOf(r);if(a>0){r.container.content.splice(a,0,...n);i=true;break}r=r.container}if(!i){this.rootNode.content.unshift(...n)}}construct(e){const n=this.current;if(typeof e.$type==="string"){this.current.astNode=e}e.$cstNode=n;const r=this.nodeStack.pop();if((r===null||r===void 0?void 0:r.content.length)===0){this.removeNode(r)}}}class e${get parent(){return this.container}get feature(){return this.grammarSource}get hidden(){return false}get astNode(){var e,n;const r=typeof((e=this._astNode)===null||e===void 0?void 0:e.$type)==="string"?this._astNode:(n=this.container)===null||n===void 0?void 0:n.astNode;if(!r){throw new Error("This node has no associated AST element")}return r}set astNode(e){this._astNode=e}get element(){return this.astNode}get text(){return this.root.fullText.substring(this.offset,this.end)}}class Bf extends e${get offset(){return this._offset}get length(){return this._length}get end(){return this._offset+this._length}get hidden(){return this._hidden}get tokenType(){return this._tokenType}get range(){return this._range}constructor(e,n,r,i,a=false){super();this._hidden=a;this._offset=e;this._tokenType=i;this._length=n;this._range=r}}class Op extends e${constructor(){super(...arguments);this.content=new Lp(this)}get children(){return this.content}get offset(){var e,n;return(n=(e=this.firstNonHiddenNode)===null||e===void 0?void 0:e.offset)!==null&&n!==void 0?n:0}get length(){return this.end-this.offset}get end(){var e,n;return(n=(e=this.lastNonHiddenNode)===null||e===void 0?void 0:e.end)!==null&&n!==void 0?n:0}get range(){const e=this.firstNonHiddenNode;const n=this.lastNonHiddenNode;if(e&&n){if(this._rangeCache===void 0){const{range:r}=e;const{range:i}=n;this._rangeCache={start:r.start,end:i.end.line<r.start.line?r.start:i.end}}return this._rangeCache}else{return{start:le.create(0,0),end:le.create(0,0)}}}get firstNonHiddenNode(){for(const e of this.content){if(!e.hidden){return e}}return this.content[0]}get lastNonHiddenNode(){for(let e=this.content.length-1;e>=0;e--){const n=this.content[e];if(!n.hidden){return n}}return this.content[this.content.length-1]}}class Lp extends Array{constructor(e){super();this.parent=e;Object.setPrototypeOf(this,Lp.prototype)}push(...e){this.addParents(e);return super.push(...e)}unshift(...e){this.addParents(e);return super.unshift(...e)}splice(e,n,...r){this.addParents(r);return super.splice(e,n,...r)}addParents(e){for(const n of e){n.container=this.parent}}}class t$ extends Op{get text(){return this._text.substring(this.offset,this.end)}get fullText(){return this._text}constructor(e){super();this._text="";this._text=e!==null&&e!==void 0?e:""}}const Wf=Symbol("Datatype");function $c(t){return t.$type===Wf}const th="​";const n$=t=>t.endsWith(th)?t:t+th;class r${constructor(e){this._unorderedGroups=new Map;this.allRules=new Map;this.lexer=e.parser.Lexer;const n=this.lexer.definition;const r=e.LanguageMetaData.mode==="production";this.wrapper=new kN(n,Object.assign(Object.assign({},e.parser.ParserConfig),{skipValidations:r,errorMessageProvider:e.parser.ParserErrorMessageProvider}))}alternatives(e,n){this.wrapper.wrapOr(e,n)}optional(e,n){this.wrapper.wrapOption(e,n)}many(e,n){this.wrapper.wrapMany(e,n)}atLeastOne(e,n){this.wrapper.wrapAtLeastOne(e,n)}getRule(e){return this.allRules.get(e)}isRecording(){return this.wrapper.IS_RECORDING}get unorderedGroups(){return this._unorderedGroups}getRuleStack(){return this.wrapper.RULE_STACK}finalize(){this.wrapper.wrapSelfAnalysis()}}class CN extends r${get current(){return this.stack[this.stack.length-1]}constructor(e){super(e);this.nodeBuilder=new EN;this.stack=[];this.assignmentMap=new Map;this.linker=e.references.Linker;this.converter=e.parser.ValueConverter;this.astReflection=e.shared.AstReflection}rule(e,n){const r=this.computeRuleType(e);const i=this.wrapper.DEFINE_RULE(n$(e.name),this.startImplementation(r,n).bind(this));this.allRules.set(e.name,i);if(e.entry){this.mainRule=i}return i}computeRuleType(e){if(e.fragment){return void 0}else if(_g(e)){return Wf}else{const n=Xa(e);return n!==null&&n!==void 0?n:e.name}}parse(e,n={}){this.nodeBuilder.buildRootNode(e);const r=this.lexerResult=this.lexer.tokenize(e);this.wrapper.input=r.tokens;const i=n.rule?this.allRules.get(n.rule):this.mainRule;if(!i){throw new Error(n.rule?`No rule found with name '${n.rule}'`:"No main rule available.")}const a=i.call(this.wrapper,{});this.nodeBuilder.addHiddenNodes(r.hidden);this.unorderedGroups.clear();this.lexerResult=void 0;return{value:a,lexerErrors:r.errors,lexerReport:r.report,parserErrors:this.wrapper.errors}}startImplementation(e,n){return r=>{const i=!this.isRecording()&&e!==void 0;if(i){const s={$type:e};this.stack.push(s);if(e===Wf){s.value=""}}let a;try{a=n(r)}catch(s){a=void 0}if(a===void 0&&i){a=this.construct()}return a}}extractHiddenTokens(e){const n=this.lexerResult.hidden;if(!n.length){return[]}const r=e.startOffset;for(let i=0;i<n.length;i++){const a=n[i];if(a.startOffset>r){return n.splice(0,i)}}return n.splice(0,n.length)}consume(e,n,r){const i=this.wrapper.wrapConsume(e,n);if(!this.isRecording()&&this.isValidToken(i)){const a=this.extractHiddenTokens(i);this.nodeBuilder.addHiddenNodes(a);const s=this.nodeBuilder.buildLeafNode(i,r);const{assignment:o,isCrossRef:l}=this.getAssignment(r);const u=this.current;if(o){const c=sn(r)?i.image:this.converter.convert(i.image,s);this.assign(o.operator,o.feature,c,s,l)}else if($c(u)){let c=i.image;if(!sn(r)){c=this.converter.convert(c,s).toString()}u.value+=c}}}isValidToken(e){return!e.isInsertedInRecovery&&!isNaN(e.startOffset)&&typeof e.endOffset==="number"&&!isNaN(e.endOffset)}subrule(e,n,r,i,a){let s;if(!this.isRecording()&&!r){s=this.nodeBuilder.buildCompositeNode(i)}const o=this.wrapper.wrapSubrule(e,n,a);if(!this.isRecording()&&s&&s.length>0){this.performSubruleAssignment(o,i,s)}}performSubruleAssignment(e,n,r){const{assignment:i,isCrossRef:a}=this.getAssignment(n);if(i){this.assign(i.operator,i.feature,e,r,a)}else if(!i){const s=this.current;if($c(s)){s.value+=e.toString()}else if(typeof e==="object"&&e){const o=this.assignWithoutOverride(e,s);const l=o;this.stack.pop();this.stack.push(l)}}}action(e,n){if(!this.isRecording()){let r=this.current;if(n.feature&&n.operator){r=this.construct();this.nodeBuilder.removeNode(r.$cstNode);const i=this.nodeBuilder.buildCompositeNode(n);i.content.push(r.$cstNode);const a={$type:e};this.stack.push(a);this.assign(n.operator,n.feature,r,r.$cstNode,false)}else{r.$type=e}}}construct(){if(this.isRecording()){return void 0}const e=this.current;Sv(e);this.nodeBuilder.construct(e);this.stack.pop();if($c(e)){return this.converter.convert(e.value,e.$cstNode)}else{Tg(this.astReflection,e)}return e}getAssignment(e){if(!this.assignmentMap.has(e)){const n=Nn(e,an);this.assignmentMap.set(e,{assignment:n,isCrossRef:n?za(n.terminal):false})}return this.assignmentMap.get(e)}assign(e,n,r,i,a){const s=this.current;let o;if(a&&typeof r==="string"){o=this.linker.buildReference(s,n,i,r)}else{o=r}switch(e){case"=":{s[n]=o;break}case"?=":{s[n]=true;break}case"+=":{if(!Array.isArray(s[n])){s[n]=[]}s[n].push(o)}}}assignWithoutOverride(e,n){for(const[i,a]of Object.entries(n)){const s=e[i];if(s===void 0){e[i]=a}else if(Array.isArray(s)&&Array.isArray(a)){a.push(...s);e[i]=a}}const r=e.$cstNode;if(r){r.astNode=void 0;e.$cstNode=void 0}return e}get definitionErrors(){return this.wrapper.definitionErrors}}class SN{buildMismatchTokenMessage(e){return Or.buildMismatchTokenMessage(e)}buildNotAllInputParsedMessage(e){return Or.buildNotAllInputParsedMessage(e)}buildNoViableAltMessage(e){return Or.buildNoViableAltMessage(e)}buildEarlyExitMessage(e){return Or.buildEarlyExitMessage(e)}}class i$ extends SN{buildMismatchTokenMessage({expected:e,actual:n}){const r=e.LABEL?"`"+e.LABEL+"`":e.name.endsWith(":KW")?`keyword '${e.name.substring(0,e.name.length-3)}'`:`token of type '${e.name}'`;return`Expecting ${r} but found \`${n.image}\`.`}buildNotAllInputParsedMessage({firstRedundant:e}){return`Expecting end of file but found \`${e.image}\`.`}}class AN extends r${constructor(){super(...arguments);this.tokens=[];this.elementStack=[];this.lastElementStack=[];this.nextTokenIndex=0;this.stackSize=0}action(){}construct(){return void 0}parse(e){this.resetState();const n=this.lexer.tokenize(e,{mode:"partial"});this.tokens=n.tokens;this.wrapper.input=[...this.tokens];this.mainRule.call(this.wrapper,{});this.unorderedGroups.clear();return{tokens:this.tokens,elementStack:[...this.lastElementStack],tokenIndex:this.nextTokenIndex}}rule(e,n){const r=this.wrapper.DEFINE_RULE(n$(e.name),this.startImplementation(n).bind(this));this.allRules.set(e.name,r);if(e.entry){this.mainRule=r}return r}resetState(){this.elementStack=[];this.lastElementStack=[];this.nextTokenIndex=0;this.stackSize=0}startImplementation(e){return n=>{const r=this.keepStackSize();try{e(n)}finally{this.resetStackSize(r)}}}removeUnexpectedElements(){this.elementStack.splice(this.stackSize)}keepStackSize(){const e=this.elementStack.length;this.stackSize=e;return e}resetStackSize(e){this.removeUnexpectedElements();this.stackSize=e}consume(e,n,r){this.wrapper.wrapConsume(e,n);if(!this.isRecording()){this.lastElementStack=[...this.elementStack,r];this.nextTokenIndex=this.currIdx+1}}subrule(e,n,r,i,a){this.before(i);this.wrapper.wrapSubrule(e,n,a);this.after(i)}before(e){if(!this.isRecording()){this.elementStack.push(e)}}after(e){if(!this.isRecording()){const n=this.elementStack.lastIndexOf(e);if(n>=0){this.elementStack.splice(n)}}}get currIdx(){return this.wrapper.currIdx}}const bN={recoveryEnabled:true,nodeLocationTracking:"full",skipValidations:true,errorMessageProvider:new i$};class kN extends Dk{constructor(e,n){const r=n&&"maxLookahead"in n;super(e,Object.assign(Object.assign(Object.assign({},bN),{lookaheadStrategy:r?new kp({maxLookahead:n.maxLookahead}):new Zk({logging:n.skipValidations?()=>{}:void 0})}),n))}get IS_RECORDING(){return this.RECORDING_PHASE}DEFINE_RULE(e,n){return this.RULE(e,n)}wrapSelfAnalysis(){this.performSelfAnalysis()}wrapConsume(e,n){return this.consume(e,n)}wrapSubrule(e,n,r){return this.subrule(e,n,{ARGS:[r]})}wrapOr(e,n){this.or(e,n)}wrapOption(e,n){this.option(e,n)}wrapMany(e,n){this.many(e,n)}wrapAtLeastOne(e,n){this.atLeastOne(e,n)}}function a$(t,e,n){const r={parser:e,tokens:n,ruleNames:new Map};NN(r,t);return e}function NN(t,e){const n=np(e,false);const r=be(e.rules).filter(it).filter(i=>n.has(i));for(const i of r){const a=Object.assign(Object.assign({},t),{consume:1,optional:1,subrule:1,many:1,or:1});t.parser.rule(i,wr(a,i.definition))}}function wr(t,e,n=false){let r;if(sn(e)){r=xN(t,e)}else if(Va(e)){r=PN(t,e)}else if(an(e)){r=wr(t,e.terminal)}else if(za(e)){r=s$(t,e)}else if(Dn(e)){r=_N(t,e)}else if(ep(e)){r=IN(t,e)}else if(tp(e)){r=ON(t,e)}else if(gr(e)){r=LN(t,e)}else if(gv(e)){const i=t.consume++;r=()=>t.parser.consume(i,zn,e)}else{throw new mg(e.$cstNode,`Unexpected element type: ${e.$type}`)}return o$(t,n?void 0:Cu(e),r,e.cardinality)}function PN(t,e){const n=Mu(e);return()=>t.parser.action(n,e)}function _N(t,e){const n=e.rule.ref;if(it(n)){const r=t.subrule++;const i=n.fragment;const a=e.arguments.length>0?DN(n,e.arguments):()=>({});return s=>t.parser.subrule(r,l$(t,n),i,e,a(s))}else if(Yn(n)){const r=t.consume++;const i=Vf(t,n.name);return()=>t.parser.consume(r,i,e)}else if(!n){throw new mg(e.$cstNode,`Undefined rule: ${e.rule.$refText}`)}else{Wa()}}function DN(t,e){const n=e.map(r=>kn(r.value));return r=>{const i={};for(let a=0;a<n.length;a++){const s=t.parameters[a];const o=n[a];i[s.name]=o(r)}return i}}function kn(t){if(dv(t)){const e=kn(t.left);const n=kn(t.right);return r=>e(r)||n(r)}else if(cv(t)){const e=kn(t.left);const n=kn(t.right);return r=>e(r)&&n(r)}else if(fv(t)){const e=kn(t.value);return n=>!e(n)}else if(pv(t)){const e=t.parameter.ref.name;return n=>n!==void 0&&n[e]===true}else if(uv(t)){const e=Boolean(t.true);return()=>e}Wa()}function IN(t,e){if(e.elements.length===1){return wr(t,e.elements[0])}else{const n=[];for(const i of e.elements){const a={ALT:wr(t,i,true)};const s=Cu(i);if(s){a.GATE=kn(s)}n.push(a)}const r=t.or++;return i=>t.parser.alternatives(r,n.map(a=>{const s={ALT:()=>a.ALT(i)};const o=a.GATE;if(o){s.GATE=()=>o(i)}return s}))}}function ON(t,e){if(e.elements.length===1){return wr(t,e.elements[0])}const n=[];for(const o of e.elements){const l={ALT:wr(t,o,true)};const u=Cu(o);if(u){l.GATE=kn(u)}n.push(l)}const r=t.or++;const i=(o,l)=>{const u=l.getRuleStack().join("-");return`uGroup_${o}_${u}`};const a=o=>t.parser.alternatives(r,n.map((l,u)=>{const c={ALT:()=>true};const d=t.parser;c.ALT=()=>{l.ALT(o);if(!d.isRecording()){const p=i(r,d);if(!d.unorderedGroups.get(p)){d.unorderedGroups.set(p,[])}const y=d.unorderedGroups.get(p);if(typeof(y===null||y===void 0?void 0:y[u])==="undefined"){y[u]=true}}};const f=l.GATE;if(f){c.GATE=()=>f(o)}else{c.GATE=()=>{const p=d.unorderedGroups.get(i(r,d));const y=!(p===null||p===void 0?void 0:p[u]);return y}}return c}));const s=o$(t,Cu(e),a,"*");return o=>{s(o);if(!t.parser.isRecording()){t.parser.unorderedGroups.delete(i(r,t.parser))}}}function LN(t,e){const n=e.elements.map(r=>wr(t,r));return r=>n.forEach(i=>i(r))}function Cu(t){if(gr(t)){return t.guardCondition}return void 0}function s$(t,e,n=e.terminal){if(!n){if(!e.type.ref){throw new Error("Could not resolve reference to type: "+e.type.$refText)}const r=Ng(e.type.ref);const i=r===null||r===void 0?void 0:r.terminal;if(!i){throw new Error("Could not find name assignment for type: "+Mu(e.type.ref))}return s$(t,e,i)}else if(Dn(n)&&it(n.rule.ref)){const r=n.rule.ref;const i=t.subrule++;return a=>t.parser.subrule(i,l$(t,r),false,e,a)}else if(Dn(n)&&Yn(n.rule.ref)){const r=t.consume++;const i=Vf(t,n.rule.ref.name);return()=>t.parser.consume(r,i,e)}else if(sn(n)){const r=t.consume++;const i=Vf(t,n.value);return()=>t.parser.consume(r,i,e)}else{throw new Error("Could not build cross reference parser")}}function xN(t,e){const n=t.consume++;const r=t.tokens[e.value];if(!r){throw new Error("Could not find token for keyword: "+e.value)}return()=>t.parser.consume(n,r,e)}function o$(t,e,n,r){const i=e&&kn(e);if(!r){if(i){const a=t.or++;return s=>t.parser.alternatives(a,[{ALT:()=>n(s),GATE:()=>i(s)},{ALT:Ym(),GATE:()=>!i(s)}])}else{return n}}if(r==="*"){const a=t.many++;return s=>t.parser.many(a,{DEF:()=>n(s),GATE:i?()=>i(s):void 0})}else if(r==="+"){const a=t.many++;if(i){const s=t.or++;return o=>t.parser.alternatives(s,[{ALT:()=>t.parser.atLeastOne(a,{DEF:()=>n(o)}),GATE:()=>i(o)},{ALT:Ym(),GATE:()=>!i(o)}])}else{return s=>t.parser.atLeastOne(a,{DEF:()=>n(s)})}}else if(r==="?"){const a=t.optional++;return s=>t.parser.optional(a,{DEF:()=>n(s),GATE:i?()=>i(s):void 0})}else{Wa()}}function l$(t,e){const n=MN(t,e);const r=t.parser.getRule(n);if(!r)throw new Error(`Rule "${n}" not found."`);return r}function MN(t,e){if(it(e)){return e.name}else if(t.ruleNames.has(e)){return t.ruleNames.get(e)}else{let n=e;let r=n.$container;let i=e.$type;while(!it(r)){if(gr(r)||ep(r)||tp(r)){const s=r.elements.indexOf(n);i=s.toString()+":"+i}n=r;r=r.$container}const a=r;i=a.name+":"+i;t.ruleNames.set(e,i);return i}}function Vf(t,e){const n=t.tokens[e];if(!n)throw new Error(`Token "${e}" not found."`);return n}function KN(t){const e=t.Grammar;const n=t.parser.Lexer;const r=new AN(t);a$(e,r,n.definition);r.finalize();return r}function FN(t){const e=UN(t);e.finalize();return e}function UN(t){const e=t.Grammar;const n=t.parser.Lexer;const r=new CN(t);return a$(e,r,n.definition)}class u${constructor(){this.diagnostics=[]}buildTokens(e,n){const r=be(np(e,false));const i=this.buildTerminalTokens(r);const a=this.buildKeywordTokens(r,i,n);i.forEach(s=>{const o=s.PATTERN;if(typeof o==="object"&&o&&"test"in o&&au(o)){a.unshift(s)}else{a.push(s)}});return a}flushLexingReport(e){return{diagnostics:this.popDiagnostics()}}popDiagnostics(){const e=[...this.diagnostics];this.diagnostics=[];return e}buildTerminalTokens(e){return e.filter(Yn).filter(n=>!n.fragment).map(n=>this.buildTerminalToken(n)).toArray()}buildTerminalToken(e){const n=Ku(e);const r=this.requiresCustomPattern(n)?this.regexPatternFunction(n):n;const i={name:e.name,PATTERN:r};if(typeof r==="function"){i.LINE_BREAKS=true}if(e.hidden){i.GROUP=au(n)?Rt.SKIPPED:"hidden"}return i}requiresCustomPattern(e){if(e.flags.includes("u")||e.flags.includes("s")){return true}else if(e.source.includes("?<=")||e.source.includes("?<!")){return true}else{return false}}regexPatternFunction(e){const n=new RegExp(e,e.flags+"y");return(r,i)=>{n.lastIndex=i;const a=n.exec(r);return a}}buildKeywordTokens(e,n,r){return e.filter(it).flatMap(i=>Er(i).filter(sn)).distinct(i=>i.value).toArray().sort((i,a)=>a.value.length-i.value.length).map(i=>this.buildKeywordToken(i,n,Boolean(r===null||r===void 0?void 0:r.caseInsensitive)))}buildKeywordToken(e,n,r){const i=this.buildKeywordPattern(e,r);const a={name:e.value,PATTERN:i,LONGER_ALT:this.findLongerAlt(e,n)};if(typeof i==="function"){a.LINE_BREAKS=true}return a}buildKeywordPattern(e,n){return n?new RegExp(Ov(e.value)):e.value}findLongerAlt(e,n){return n.reduce((r,i)=>{const a=i===null||i===void 0?void 0:i.PATTERN;if((a===null||a===void 0?void 0:a.source)&&Lv("^"+a.source+"$",e.value)){r.push(i)}return r},[])}}class GN{convert(e,n){let r=n.grammarSource;if(za(r)){r=Sg(r)}if(Dn(r)){const i=r.rule.ref;if(!i){throw new Error("This cst node was not parsed by a rule.")}return this.runConverter(i,e,n)}return e}runConverter(e,n,r){var i;switch(e.name.toUpperCase()){case"INT":return En.convertInt(n);case"STRING":return En.convertString(n);case"ID":return En.convertID(n)}switch((i=qv(e))===null||i===void 0?void 0:i.toLowerCase()){case"number":return En.convertNumber(n);case"boolean":return En.convertBoolean(n);case"bigint":return En.convertBigint(n);case"date":return En.convertDate(n);default:return n}}}var En;(function(t){function e(u){let c="";for(let d=1;d<u.length-1;d++){const f=u.charAt(d);if(f==="\\"){const p=u.charAt(++d);c+=n(p)}else{c+=f}}return c}t.convertString=e;function n(u){switch(u){case"b":return"\b";case"f":return"\f";case"n":return"\n";case"r":return"\r";case"t":return"	";case"v":return"\v";case"0":return"\0";default:return u}}function r(u){if(u.charAt(0)==="^"){return u.substring(1)}else{return u}}t.convertID=r;function i(u){return parseInt(u)}t.convertInt=i;function a(u){return BigInt(u)}t.convertBigint=a;function s(u){return new Date(u)}t.convertDate=s;function o(u){return Number(u)}t.convertNumber=o;function l(u){return u.toLowerCase()==="true"}t.convertBoolean=l})(En||(En={}));function HN(t){if(t.__esModule)return t;var e=t.default;if(typeof e=="function"){var n=function r(){if(this instanceof r){return Reflect.construct(e,arguments,this.constructor)}return e.apply(this,arguments)};n.prototype=e.prototype}else n={};Object.defineProperty(n,"__esModule",{value:true});Object.keys(t).forEach(function(r){var i=Object.getOwnPropertyDescriptor(t,r);Object.defineProperty(n,r,i.get?i:{enumerable:true,get:function(){return t[r]}})});return n}var nr={};var Ms={};var nh;function c$(){if(nh)return Ms;nh=1;Object.defineProperty(Ms,"__esModule",{value:true});let t;function e(){if(t===void 0){throw new Error(`No runtime abstraction layer installed`)}return t}(function(n){function r(i){if(i===void 0){throw new Error(`No runtime abstraction layer provided`)}t=i}n.install=r})(e);Ms.default=e;return Ms}var Ve={};var rh;function qN(){if(rh)return Ve;rh=1;Object.defineProperty(Ve,"__esModule",{value:true});Ve.stringArray=Ve.array=Ve.func=Ve.error=Ve.number=Ve.string=Ve.boolean=void 0;function t(o){return o===true||o===false}Ve.boolean=t;function e(o){return typeof o==="string"||o instanceof String}Ve.string=e;function n(o){return typeof o==="number"||o instanceof Number}Ve.number=n;function r(o){return o instanceof Error}Ve.error=r;function i(o){return typeof o==="function"}Ve.func=i;function a(o){return Array.isArray(o)}Ve.array=a;function s(o){return a(o)&&o.every(l=>e(l))}Ve.stringArray=s;return Ve}var rr={};var ih;function d$(){if(ih)return rr;ih=1;Object.defineProperty(rr,"__esModule",{value:true});rr.Emitter=rr.Event=void 0;const t=c$();var e;(function(i){const a={dispose(){}};i.None=function(){return a}})(e||(rr.Event=e={}));class n{add(a,s=null,o){if(!this._callbacks){this._callbacks=[];this._contexts=[]}this._callbacks.push(a);this._contexts.push(s);if(Array.isArray(o)){o.push({dispose:()=>this.remove(a,s)})}}remove(a,s=null){if(!this._callbacks){return}let o=false;for(let l=0,u=this._callbacks.length;l<u;l++){if(this._callbacks[l]===a){if(this._contexts[l]===s){this._callbacks.splice(l,1);this._contexts.splice(l,1);return}else{o=true}}}if(o){throw new Error("When adding a listener with a context, you should remove it with the same context")}}invoke(...a){if(!this._callbacks){return[]}const s=[],o=this._callbacks.slice(0),l=this._contexts.slice(0);for(let u=0,c=o.length;u<c;u++){try{s.push(o[u].apply(l[u],a))}catch(d){(0,t.default)().console.error(d)}}return s}isEmpty(){return!this._callbacks||this._callbacks.length===0}dispose(){this._callbacks=void 0;this._contexts=void 0}}class r{constructor(a){this._options=a}get event(){if(!this._event){this._event=(a,s,o)=>{if(!this._callbacks){this._callbacks=new n}if(this._options&&this._options.onFirstListenerAdd&&this._callbacks.isEmpty()){this._options.onFirstListenerAdd(this)}this._callbacks.add(a,s);const l={dispose:()=>{if(!this._callbacks){return}this._callbacks.remove(a,s);l.dispose=r._noop;if(this._options&&this._options.onLastListenerRemove&&this._callbacks.isEmpty()){this._options.onLastListenerRemove(this)}}};if(Array.isArray(o)){o.push(l)}return l}}return this._event}fire(a){if(this._callbacks){this._callbacks.invoke.call(this._callbacks,a)}}dispose(){if(this._callbacks){this._callbacks.dispose();this._callbacks=void 0}}}rr.Emitter=r;r._noop=function(){};return rr}var ah;function jN(){if(ah)return nr;ah=1;Object.defineProperty(nr,"__esModule",{value:true});nr.CancellationTokenSource=nr.CancellationToken=void 0;const t=c$();const e=qN();const n=d$();var r;(function(o){o.None=Object.freeze({isCancellationRequested:false,onCancellationRequested:n.Event.None});o.Cancelled=Object.freeze({isCancellationRequested:true,onCancellationRequested:n.Event.None});function l(u){const c=u;return c&&(c===o.None||c===o.Cancelled||e.boolean(c.isCancellationRequested)&&!!c.onCancellationRequested)}o.is=l})(r||(nr.CancellationToken=r={}));const i=Object.freeze(function(o,l){const u=(0,t.default)().timer.setTimeout(o.bind(l),0);return{dispose(){u.dispose()}}});class a{constructor(){this._isCancelled=false}cancel(){if(!this._isCancelled){this._isCancelled=true;if(this._emitter){this._emitter.fire(void 0);this.dispose()}}}get isCancellationRequested(){return this._isCancelled}get onCancellationRequested(){if(this._isCancelled){return i}if(!this._emitter){this._emitter=new n.Emitter}return this._emitter.event}dispose(){if(this._emitter){this._emitter.dispose();this._emitter=void 0}}}class s{get token(){if(!this._token){this._token=new a}return this._token}cancel(){if(!this._token){this._token=r.Cancelled}else{this._token.cancel()}}dispose(){if(!this._token){this._token=r.None}else if(this._token instanceof a){this._token.dispose()}}}nr.CancellationTokenSource=s;return nr}var he=jN();function BN(){return new Promise(t=>{if(typeof setImmediate==="undefined"){setTimeout(t,0)}else{setImmediate(t)}})}let ql=0;let WN=10;function VN(){ql=performance.now();return new he.CancellationTokenSource}const Su=Symbol("OperationCancelled");function ss(t){return t===Su}async function ut(t){if(t===he.CancellationToken.None){return}const e=performance.now();if(e-ql>=WN){ql=e;await BN();ql=performance.now()}if(t.isCancellationRequested){throw Su}}class xp{constructor(){this.promise=new Promise((e,n)=>{this.resolve=r=>{e(r);return this};this.reject=r=>{n(r);return this}})}}class qa{constructor(e,n,r,i){this._uri=e;this._languageId=n;this._version=r;this._content=i;this._lineOffsets=void 0}get uri(){return this._uri}get languageId(){return this._languageId}get version(){return this._version}getText(e){if(e){const n=this.offsetAt(e.start);const r=this.offsetAt(e.end);return this._content.substring(n,r)}return this._content}update(e,n){for(const r of e){if(qa.isIncremental(r)){const i=p$(r.range);const a=this.offsetAt(i.start);const s=this.offsetAt(i.end);this._content=this._content.substring(0,a)+r.text+this._content.substring(s,this._content.length);const o=Math.max(i.start.line,0);const l=Math.max(i.end.line,0);let u=this._lineOffsets;const c=sh(r.text,false,a);if(l-o===c.length){for(let f=0,p=c.length;f<p;f++){u[f+o+1]=c[f]}}else{if(c.length<1e4){u.splice(o+1,l-o,...c)}else{this._lineOffsets=u=u.slice(0,o+1).concat(c,u.slice(l+1))}}const d=r.text.length-(s-a);if(d!==0){for(let f=o+1+c.length,p=u.length;f<p;f++){u[f]=u[f]+d}}}else if(qa.isFull(r)){this._content=r.text;this._lineOffsets=void 0}else{throw new Error("Unknown change event received")}}this._version=n}getLineOffsets(){if(this._lineOffsets===void 0){this._lineOffsets=sh(this._content,true)}return this._lineOffsets}positionAt(e){e=Math.max(Math.min(e,this._content.length),0);const n=this.getLineOffsets();let r=0,i=n.length;if(i===0){return{line:0,character:e}}while(r<i){const s=Math.floor((r+i)/2);if(n[s]>e){i=s}else{r=s+1}}const a=r-1;e=this.ensureBeforeEOL(e,n[a]);return{line:a,character:e-n[a]}}offsetAt(e){const n=this.getLineOffsets();if(e.line>=n.length){return this._content.length}else if(e.line<0){return 0}const r=n[e.line];if(e.character<=0){return r}const i=e.line+1<n.length?n[e.line+1]:this._content.length;const a=Math.min(r+e.character,i);return this.ensureBeforeEOL(a,r)}ensureBeforeEOL(e,n){while(e>n&&f$(this._content.charCodeAt(e-1))){e--}return e}get lineCount(){return this.getLineOffsets().length}static isIncremental(e){const n=e;return n!==void 0&&n!==null&&typeof n.text==="string"&&n.range!==void 0&&(n.rangeLength===void 0||typeof n.rangeLength==="number")}static isFull(e){const n=e;return n!==void 0&&n!==null&&typeof n.text==="string"&&n.range===void 0&&n.rangeLength===void 0}}var Au;(function(t){function e(i,a,s,o){return new qa(i,a,s,o)}t.create=e;function n(i,a,s){if(i instanceof qa){i.update(a,s);return i}else{throw new Error("TextDocument.update: document must be created by TextDocument.create")}}t.update=n;function r(i,a){const s=i.getText();const o=zf(a.map(zN),(c,d)=>{const f=c.range.start.line-d.range.start.line;if(f===0){return c.range.start.character-d.range.start.character}return f});let l=0;const u=[];for(const c of o){const d=i.offsetAt(c.range.start);if(d<l){throw new Error("Overlapping edit")}else if(d>l){u.push(s.substring(l,d))}if(c.newText.length){u.push(c.newText)}l=i.offsetAt(c.range.end)}u.push(s.substr(l));return u.join("")}t.applyEdits=r})(Au||(Au={}));function zf(t,e){if(t.length<=1){return t}const n=t.length/2|0;const r=t.slice(0,n);const i=t.slice(n);zf(r,e);zf(i,e);let a=0;let s=0;let o=0;while(a<r.length&&s<i.length){const l=e(r[a],i[s]);if(l<=0){t[o++]=r[a++]}else{t[o++]=i[s++]}}while(a<r.length){t[o++]=r[a++]}while(s<i.length){t[o++]=i[s++]}return t}function sh(t,e,n=0){const r=e?[n]:[];for(let i=0;i<t.length;i++){const a=t.charCodeAt(i);if(f$(a)){if(a===13&&i+1<t.length&&t.charCodeAt(i+1)===10){i++}r.push(n+i+1)}}return r}function f$(t){return t===13||t===10}function p$(t){const e=t.start;const n=t.end;if(e.line>n.line||e.line===n.line&&e.character>n.character){return{start:n,end:e}}return t}function zN(t){const e=p$(t.range);if(e!==t.range){return{newText:t.newText,range:e}}return t}var m$;(()=>{var t={470:i=>{function a(l){if("string"!=typeof l)throw new TypeError("Path must be a string. Received "+JSON.stringify(l))}function s(l,u){for(var c,d="",f=0,p=-1,y=0,v=0;v<=l.length;++v){if(v<l.length)c=l.charCodeAt(v);else{if(47===c)break;c=47}if(47===c){if(p===v-1||1===y);else if(p!==v-1&&2===y){if(d.length<2||2!==f||46!==d.charCodeAt(d.length-1)||46!==d.charCodeAt(d.length-2)){if(d.length>2){var b=d.lastIndexOf("/");if(b!==d.length-1){-1===b?(d="",f=0):f=(d=d.slice(0,b)).length-1-d.lastIndexOf("/"),p=v,y=0;continue}}else if(2===d.length||1===d.length){d="",f=0,p=v,y=0;continue}}u&&(d.length>0?d+="/..":d="..",f=2)}else d.length>0?d+="/"+l.slice(p+1,v):d=l.slice(p+1,v),f=v-p-1;p=v,y=0}else 46===c&&-1!==y?++y:y=-1}return d}var o={resolve:function(){for(var l,u="",c=false,d=arguments.length-1;d>=-1&&!c;d--){var f;d>=0?f=arguments[d]:(void 0===l&&(l=process.cwd()),f=l),a(f),0!==f.length&&(u=f+"/"+u,c=47===f.charCodeAt(0))}return u=s(u,!c),c?u.length>0?"/"+u:"/":u.length>0?u:"."},normalize:function(l){if(a(l),0===l.length)return".";var u=47===l.charCodeAt(0),c=47===l.charCodeAt(l.length-1);return 0!==(l=s(l,!u)).length||u||(l="."),l.length>0&&c&&(l+="/"),u?"/"+l:l},isAbsolute:function(l){return a(l),l.length>0&&47===l.charCodeAt(0)},join:function(){if(0===arguments.length)return".";for(var l,u=0;u<arguments.length;++u){var c=arguments[u];a(c),c.length>0&&(void 0===l?l=c:l+="/"+c)}return void 0===l?".":o.normalize(l)},relative:function(l,u){if(a(l),a(u),l===u)return"";if((l=o.resolve(l))===(u=o.resolve(u)))return"";for(var c=1;c<l.length&&47===l.charCodeAt(c);++c);for(var d=l.length,f=d-c,p=1;p<u.length&&47===u.charCodeAt(p);++p);for(var y=u.length-p,v=f<y?f:y,b=-1,$=0;$<=v;++$){if($===v){if(y>v){if(47===u.charCodeAt(p+$))return u.slice(p+$+1);if(0===$)return u.slice(p+$)}else f>v&&(47===l.charCodeAt(c+$)?b=$:0===$&&(b=0));break}var w=l.charCodeAt(c+$);if(w!==u.charCodeAt(p+$))break;47===w&&(b=$)}var C="";for($=c+b+1;$<=d;++$)$!==d&&47!==l.charCodeAt($)||(0===C.length?C+="..":C+="/..");return C.length>0?C+u.slice(p+b):(p+=b,47===u.charCodeAt(p)&&++p,u.slice(p))},_makeLong:function(l){return l},dirname:function(l){if(a(l),0===l.length)return".";for(var u=l.charCodeAt(0),c=47===u,d=-1,f=true,p=l.length-1;p>=1;--p)if(47===(u=l.charCodeAt(p))){if(!f){d=p;break}}else f=false;return-1===d?c?"/":".":c&&1===d?"//":l.slice(0,d)},basename:function(l,u){if(void 0!==u&&"string"!=typeof u)throw new TypeError('"ext" argument must be a string');a(l);var c,d=0,f=-1,p=true;if(void 0!==u&&u.length>0&&u.length<=l.length){if(u.length===l.length&&u===l)return"";var y=u.length-1,v=-1;for(c=l.length-1;c>=0;--c){var b=l.charCodeAt(c);if(47===b){if(!p){d=c+1;break}}else-1===v&&(p=false,v=c+1),y>=0&&(b===u.charCodeAt(y)?-1==--y&&(f=c):(y=-1,f=v))}return d===f?f=v:-1===f&&(f=l.length),l.slice(d,f)}for(c=l.length-1;c>=0;--c)if(47===l.charCodeAt(c)){if(!p){d=c+1;break}}else-1===f&&(p=false,f=c+1);return-1===f?"":l.slice(d,f)},extname:function(l){a(l);for(var u=-1,c=0,d=-1,f=true,p=0,y=l.length-1;y>=0;--y){var v=l.charCodeAt(y);if(47!==v)-1===d&&(f=false,d=y+1),46===v?-1===u?u=y:1!==p&&(p=1):-1!==u&&(p=-1);else if(!f){c=y+1;break}}return-1===u||-1===d||0===p||1===p&&u===d-1&&u===c+1?"":l.slice(u,d)},format:function(l){if(null===l||"object"!=typeof l)throw new TypeError('The "pathObject" argument must be of type Object. Received type '+typeof l);return function(u,c){var d=c.dir||c.root,f=c.base||(c.name||"")+(c.ext||"");return d?d===c.root?d+f:d+"/"+f:f}(0,l)},parse:function(l){a(l);var u={root:"",dir:"",base:"",ext:"",name:""};if(0===l.length)return u;var c,d=l.charCodeAt(0),f=47===d;f?(u.root="/",c=1):c=0;for(var p=-1,y=0,v=-1,b=true,$=l.length-1,w=0;$>=c;--$)if(47!==(d=l.charCodeAt($)))-1===v&&(b=false,v=$+1),46===d?-1===p?p=$:1!==w&&(w=1):-1!==p&&(w=-1);else if(!b){y=$+1;break}return-1===p||-1===v||0===w||1===w&&p===v-1&&p===y+1?-1!==v&&(u.base=u.name=0===y&&f?l.slice(1,v):l.slice(y,v)):(0===y&&f?(u.name=l.slice(1,p),u.base=l.slice(1,v)):(u.name=l.slice(y,p),u.base=l.slice(y,v)),u.ext=l.slice(p,v)),y>0?u.dir=l.slice(0,y-1):f&&(u.dir="/"),u},sep:"/",delimiter:":",win32:null,posix:null};o.posix=o,i.exports=o}},e={};function n(i){var a=e[i];if(void 0!==a)return a.exports;var s=e[i]={exports:{}};return t[i](s,s.exports,n),s.exports}n.d=(i,a)=>{for(var s in a)n.o(a,s)&&!n.o(i,s)&&Object.defineProperty(i,s,{enumerable:true,get:a[s]})},n.o=(i,a)=>Object.prototype.hasOwnProperty.call(i,a),n.r=i=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(i,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(i,"__esModule",{value:true})};var r={};(()=>{let i;if(n.r(r),n.d(r,{URI:()=>f,Utils:()=>ce}),"object"==typeof process)i="win32"===process.platform;else if("object"==typeof navigator){let L=navigator.userAgent;i=L.indexOf("Windows")>=0}const a=/^\w[\w\d+.-]*$/,s=/^\//,o=/^\/\//;function l(L,E){if(!L.scheme&&E)throw new Error(`[UriError]: Scheme is missing: {scheme: "", authority: "${L.authority}", path: "${L.path}", query: "${L.query}", fragment: "${L.fragment}"}`);if(L.scheme&&!a.test(L.scheme))throw new Error("[UriError]: Scheme contains illegal characters.");if(L.path){if(L.authority){if(!s.test(L.path))throw new Error('[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character')}else if(o.test(L.path))throw new Error('[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")')}}const u="",c="/",d=/^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;class f{static isUri(E){return E instanceof f||!!E&&"string"==typeof E.authority&&"string"==typeof E.fragment&&"string"==typeof E.path&&"string"==typeof E.query&&"string"==typeof E.scheme&&"string"==typeof E.fsPath&&"function"==typeof E.with&&"function"==typeof E.toString}scheme;authority;path;query;fragment;constructor(E,g,k,M,I,x=false){"object"==typeof E?(this.scheme=E.scheme||u,this.authority=E.authority||u,this.path=E.path||u,this.query=E.query||u,this.fragment=E.fragment||u):(this.scheme=function(we,F){return we||F?we:"file"}(E,x),this.authority=g||u,this.path=function(we,F){switch(we){case"https":case"http":case"file":F?F[0]!==c&&(F=c+F):F=c}return F}(this.scheme,k||u),this.query=M||u,this.fragment=I||u,l(this,x))}get fsPath(){return w(this)}with(E){if(!E)return this;let{scheme:g,authority:k,path:M,query:I,fragment:x}=E;return void 0===g?g=this.scheme:null===g&&(g=u),void 0===k?k=this.authority:null===k&&(k=u),void 0===M?M=this.path:null===M&&(M=u),void 0===I?I=this.query:null===I&&(I=u),void 0===x?x=this.fragment:null===x&&(x=u),g===this.scheme&&k===this.authority&&M===this.path&&I===this.query&&x===this.fragment?this:new y(g,k,M,I,x)}static parse(E,g=false){const k=d.exec(E);return k?new y(k[2]||u,q(k[4]||u),q(k[5]||u),q(k[7]||u),q(k[9]||u),g):new y(u,u,u,u,u)}static file(E){let g=u;if(i&&(E=E.replace(/\\/g,c)),E[0]===c&&E[1]===c){const k=E.indexOf(c,2);-1===k?(g=E.substring(2),E=c):(g=E.substring(2,k),E=E.substring(k)||c)}return new y("file",g,E,u,u)}static from(E){const g=new y(E.scheme,E.authority,E.path,E.query,E.fragment);return l(g,true),g}toString(E=false){return C(this,E)}toJSON(){return this}static revive(E){if(E){if(E instanceof f)return E;{const g=new y(E);return g._formatted=E.external,g._fsPath=E._sep===p?E.fsPath:null,g}}return E}}const p=i?1:void 0;class y extends f{_formatted=null;_fsPath=null;get fsPath(){return this._fsPath||(this._fsPath=w(this)),this._fsPath}toString(E=false){return E?C(this,true):(this._formatted||(this._formatted=C(this,false)),this._formatted)}toJSON(){const E={$mid:1};return this._fsPath&&(E.fsPath=this._fsPath,E._sep=p),this._formatted&&(E.external=this._formatted),this.path&&(E.path=this.path),this.scheme&&(E.scheme=this.scheme),this.authority&&(E.authority=this.authority),this.query&&(E.query=this.query),this.fragment&&(E.fragment=this.fragment),E}}const v={58:"%3A",47:"%2F",63:"%3F",35:"%23",91:"%5B",93:"%5D",64:"%40",33:"%21",36:"%24",38:"%26",39:"%27",40:"%28",41:"%29",42:"%2A",43:"%2B",44:"%2C",59:"%3B",61:"%3D",32:"%20"};function b(L,E,g){let k,M=-1;for(let I=0;I<L.length;I++){const x=L.charCodeAt(I);if(x>=97&&x<=122||x>=65&&x<=90||x>=48&&x<=57||45===x||46===x||95===x||126===x||E&&47===x||g&&91===x||g&&93===x||g&&58===x)-1!==M&&(k+=encodeURIComponent(L.substring(M,I)),M=-1),void 0!==k&&(k+=L.charAt(I));else{void 0===k&&(k=L.substr(0,I));const we=v[x];void 0!==we?(-1!==M&&(k+=encodeURIComponent(L.substring(M,I)),M=-1),k+=we):-1===M&&(M=I)}}return-1!==M&&(k+=encodeURIComponent(L.substring(M))),void 0!==k?k:L}function $(L){let E;for(let g=0;g<L.length;g++){const k=L.charCodeAt(g);35===k||63===k?(void 0===E&&(E=L.substr(0,g)),E+=v[k]):void 0!==E&&(E+=L[g])}return void 0!==E?E:L}function w(L,E){let g;return g=L.authority&&L.path.length>1&&"file"===L.scheme?`//${L.authority}${L.path}`:47===L.path.charCodeAt(0)&&(L.path.charCodeAt(1)>=65&&L.path.charCodeAt(1)<=90||L.path.charCodeAt(1)>=97&&L.path.charCodeAt(1)<=122)&&58===L.path.charCodeAt(2)?L.path[1].toLowerCase()+L.path.substr(2):L.path,i&&(g=g.replace(/\//g,"\\")),g}function C(L,E){const g=E?$:b;let k="",{scheme:M,authority:I,path:x,query:we,fragment:F}=L;if(M&&(k+=M,k+=":"),(I||"file"===M)&&(k+=c,k+=c),I){let N=I.indexOf("@");if(-1!==N){const ne=I.substr(0,N);I=I.substr(N+1),N=ne.lastIndexOf(":"),-1===N?k+=g(ne,false,false):(k+=g(ne.substr(0,N),false,false),k+=":",k+=g(ne.substr(N+1),false,true)),k+="@"}I=I.toLowerCase(),N=I.lastIndexOf(":"),-1===N?k+=g(I,false,true):(k+=g(I.substr(0,N),false,true),k+=I.substr(N))}if(x){if(x.length>=3&&47===x.charCodeAt(0)&&58===x.charCodeAt(2)){const N=x.charCodeAt(1);N>=65&&N<=90&&(x=`/${String.fromCharCode(N+32)}:${x.substr(3)}`)}else if(x.length>=2&&58===x.charCodeAt(1)){const N=x.charCodeAt(0);N>=65&&N<=90&&(x=`${String.fromCharCode(N+32)}:${x.substr(2)}`)}k+=g(x,true,false)}return we&&(k+="?",k+=g(we,false,false)),F&&(k+="#",k+=E?F:b(F,false,false)),k}function O(L){try{return decodeURIComponent(L)}catch{return L.length>3?L.substr(0,3)+O(L.substr(3)):L}}const Y=/(%[0-9A-Za-z][0-9A-Za-z])+/g;function q(L){return L.match(Y)?L.replace(Y,E=>O(E)):L}var J=n(470);const te=J.posix||J,ie="/";var ce;!function(L){L.joinPath=function(E,...g){return E.with({path:te.join(E.path,...g)})},L.resolvePath=function(E,...g){let k=E.path,M=false;k[0]!==ie&&(k=ie+k,M=true);let I=te.resolve(k,...g);return M&&I[0]===ie&&!E.authority&&(I=I.substring(1)),E.with({path:I})},L.dirname=function(E){if(0===E.path.length||E.path===ie)return E;let g=te.dirname(E.path);return 1===g.length&&46===g.charCodeAt(0)&&(g=""),E.with({path:g})},L.basename=function(E){return te.basename(E.path)},L.extname=function(E){return te.extname(E.path)}}(ce||(ce={}))})(),m$=r})();const{URI:dt,Utils:ri}=m$;var Ue;(function(t){t.basename=ri.basename;t.dirname=ri.dirname;t.extname=ri.extname;t.joinPath=ri.joinPath;t.resolvePath=ri.resolvePath;function e(i,a){return(i===null||i===void 0?void 0:i.toString())===(a===null||a===void 0?void 0:a.toString())}t.equals=e;function n(i,a){const s=typeof i==="string"?i:i.path;const o=typeof a==="string"?a:a.path;const l=s.split("/").filter(p=>p.length>0);const u=o.split("/").filter(p=>p.length>0);let c=0;for(;c<l.length;c++){if(l[c]!==u[c]){break}}const d="../".repeat(l.length-c);const f=u.slice(c).join("/");return d+f}t.relative=n;function r(i){return dt.parse(i.toString()).toString()}t.normalize=r})(Ue||(Ue={}));var z;(function(t){t[t["Changed"]=0]="Changed";t[t["Parsed"]=1]="Parsed";t[t["IndexedContent"]=2]="IndexedContent";t[t["ComputedScopes"]=3]="ComputedScopes";t[t["Linked"]=4]="Linked";t[t["IndexedReferences"]=5]="IndexedReferences";t[t["Validated"]=6]="Validated"})(z||(z={}));class XN{constructor(e){this.serviceRegistry=e.ServiceRegistry;this.textDocuments=e.workspace.TextDocuments;this.fileSystemProvider=e.workspace.FileSystemProvider}async fromUri(e,n=he.CancellationToken.None){const r=await this.fileSystemProvider.readFile(e);return this.createAsync(e,r,n)}fromTextDocument(e,n,r){n=n!==null&&n!==void 0?n:dt.parse(e.uri);if(he.CancellationToken.is(r)){return this.createAsync(n,e,r)}else{return this.create(n,e,r)}}fromString(e,n,r){if(he.CancellationToken.is(r)){return this.createAsync(n,e,r)}else{return this.create(n,e,r)}}fromModel(e,n){return this.create(n,{$model:e})}create(e,n,r){if(typeof n==="string"){const i=this.parse(e,n,r);return this.createLangiumDocument(i,e,void 0,n)}else if("$model"in n){const i={value:n.$model,parserErrors:[],lexerErrors:[]};return this.createLangiumDocument(i,e)}else{const i=this.parse(e,n.getText(),r);return this.createLangiumDocument(i,e,n)}}async createAsync(e,n,r){if(typeof n==="string"){const i=await this.parseAsync(e,n,r);return this.createLangiumDocument(i,e,void 0,n)}else{const i=await this.parseAsync(e,n.getText(),r);return this.createLangiumDocument(i,e,n)}}createLangiumDocument(e,n,r,i){let a;if(r){a={parseResult:e,uri:n,state:z.Parsed,references:[],textDocument:r}}else{const s=this.createTextDocumentGetter(n,i);a={parseResult:e,uri:n,state:z.Parsed,references:[],get textDocument(){return s()}}}e.value.$document=a;return a}async update(e,n){var r,i;const a=(r=e.parseResult.value.$cstNode)===null||r===void 0?void 0:r.root.fullText;const s=(i=this.textDocuments)===null||i===void 0?void 0:i.get(e.uri.toString());const o=s?s.getText():await this.fileSystemProvider.readFile(e.uri);if(s){Object.defineProperty(e,"textDocument",{value:s})}else{const l=this.createTextDocumentGetter(e.uri,o);Object.defineProperty(e,"textDocument",{get:l})}if(a!==o){e.parseResult=await this.parseAsync(e.uri,o,n);e.parseResult.value.$document=e}e.state=z.Parsed;return e}parse(e,n,r){const i=this.serviceRegistry.getServices(e);return i.parser.LangiumParser.parse(n,r)}parseAsync(e,n,r){const i=this.serviceRegistry.getServices(e);return i.parser.AsyncParser.parse(n,r)}createTextDocumentGetter(e,n){const r=this.serviceRegistry;let i=void 0;return()=>{return i!==null&&i!==void 0?i:i=Au.create(e.toString(),r.getServices(e).LanguageMetaData.languageId,0,n!==null&&n!==void 0?n:"")}}}class YN{constructor(e){this.documentMap=new Map;this.langiumDocumentFactory=e.workspace.LangiumDocumentFactory;this.serviceRegistry=e.ServiceRegistry}get all(){return be(this.documentMap.values())}addDocument(e){const n=e.uri.toString();if(this.documentMap.has(n)){throw new Error(`A document with the URI '${n}' is already present.`)}this.documentMap.set(n,e)}getDocument(e){const n=e.toString();return this.documentMap.get(n)}async getOrCreateDocument(e,n){let r=this.getDocument(e);if(r){return r}r=await this.langiumDocumentFactory.fromUri(e,n);this.addDocument(r);return r}createDocument(e,n,r){if(r){return this.langiumDocumentFactory.fromString(n,e,r).then(i=>{this.addDocument(i);return i})}else{const i=this.langiumDocumentFactory.fromString(n,e);this.addDocument(i);return i}}hasDocument(e){return this.documentMap.has(e.toString())}invalidateDocument(e){const n=e.toString();const r=this.documentMap.get(n);if(r){const i=this.serviceRegistry.getServices(e).references.Linker;i.unlink(r);r.state=z.Changed;r.precomputedScopes=void 0;r.diagnostics=void 0}return r}deleteDocument(e){const n=e.toString();const r=this.documentMap.get(n);if(r){r.state=z.Changed;this.documentMap.delete(n)}return r}}const vc=Symbol("ref_resolving");class JN{constructor(e){this.reflection=e.shared.AstReflection;this.langiumDocuments=()=>e.shared.workspace.LangiumDocuments;this.scopeProvider=e.references.ScopeProvider;this.astNodeLocator=e.workspace.AstNodeLocator}async link(e,n=he.CancellationToken.None){for(const r of Bn(e.parseResult.value)){await ut(n);vg(r).forEach(i=>this.doLink(i,e))}}doLink(e,n){var r;const i=e.reference;if(i._ref===void 0){i._ref=vc;try{const a=this.getCandidate(e);if(Ll(a)){i._ref=a}else{i._nodeDescription=a;if(this.langiumDocuments().hasDocument(a.documentUri)){const s=this.loadAstNode(a);i._ref=s!==null&&s!==void 0?s:this.createLinkingError(e,a)}else{i._ref=void 0}}}catch(a){console.error(`An error occurred while resolving reference to '${i.$refText}':`,a);const s=(r=a.message)!==null&&r!==void 0?r:String(a);i._ref=Object.assign(Object.assign({},e),{message:`An error occurred while resolving reference to '${i.$refText}': ${s}`})}n.references.push(i)}}unlink(e){for(const n of e.references){delete n._ref;delete n._nodeDescription}e.references=[]}getCandidate(e){const n=this.scopeProvider.getScope(e);const r=n.getElement(e.reference.$refText);return r!==null&&r!==void 0?r:this.createLinkingError(e)}buildReference(e,n,r,i){const a=this;const s={$refNode:r,$refText:i,get ref(){var o;if(Ze(this._ref)){return this._ref}else if(sg(this._nodeDescription)){const l=a.loadAstNode(this._nodeDescription);this._ref=l!==null&&l!==void 0?l:a.createLinkingError({reference:s,container:e,property:n},this._nodeDescription)}else if(this._ref===void 0){this._ref=vc;const l=nu(e).$document;const u=a.getLinkedNode({reference:s,container:e,property:n});if(u.error&&l&&l.state<z.ComputedScopes){return this._ref=void 0}this._ref=(o=u.node)!==null&&o!==void 0?o:u.error;this._nodeDescription=u.descr;l===null||l===void 0?void 0:l.references.push(this)}else if(this._ref===vc){throw new Error(`Cyclic reference resolution detected: ${a.astNodeLocator.getAstNodePath(e)}/${n} (symbol '${i}')`)}return Ze(this._ref)?this._ref:void 0},get $nodeDescription(){return this._nodeDescription},get error(){return Ll(this._ref)?this._ref:void 0}};return s}getLinkedNode(e){var n;try{const r=this.getCandidate(e);if(Ll(r)){return{error:r}}const i=this.loadAstNode(r);if(i){return{node:i,descr:r}}else{return{descr:r,error:this.createLinkingError(e,r)}}}catch(r){console.error(`An error occurred while resolving reference to '${e.reference.$refText}':`,r);const i=(n=r.message)!==null&&n!==void 0?n:String(r);return{error:Object.assign(Object.assign({},e),{message:`An error occurred while resolving reference to '${e.reference.$refText}': ${i}`})}}}loadAstNode(e){if(e.node){return e.node}const n=this.langiumDocuments().getDocument(e.documentUri);if(!n){return void 0}return this.astNodeLocator.getAstNode(n.parseResult.value,e.path)}createLinkingError(e,n){const r=nu(e.container).$document;if(r&&r.state<z.ComputedScopes){console.warn(`Attempted reference resolution before document reached ComputedScopes state (${r.uri}).`)}const i=this.reflection.getReferenceType(e);return Object.assign(Object.assign({},e),{message:`Could not resolve reference to ${i} named '${e.reference.$refText}'.`,targetDescription:n})}}function h$(t){return typeof t.name==="string"}class y${getName(e){if(h$(e)){return e.name}return void 0}getNameNode(e){return rp(e.$cstNode,"name")}}class g${constructor(e){this.nameProvider=e.references.NameProvider;this.index=e.shared.workspace.IndexManager;this.nodeLocator=e.workspace.AstNodeLocator}findDeclaration(e){if(e){const n=Uv(e);const r=e.astNode;if(n&&r){const i=r[n.feature];if(tn(i)){return i.ref}else if(Array.isArray(i)){for(const a of i){if(tn(a)&&a.$refNode&&a.$refNode.offset<=e.offset&&a.$refNode.end>=e.end){return a.ref}}}}if(r){const i=this.nameProvider.getNameNode(r);if(i&&(i===e||av(e,i))){return r}}}return void 0}findDeclarationNode(e){const n=this.findDeclaration(e);if(n===null||n===void 0?void 0:n.$cstNode){const r=this.nameProvider.getNameNode(n);return r!==null&&r!==void 0?r:n.$cstNode}return void 0}findReferences(e,n){const r=[];if(n.includeDeclaration){const a=this.getReferenceToSelf(e);if(a){r.push(a)}}let i=this.index.findAllReferences(e,this.nodeLocator.getAstNodePath(e));if(n.documentUri){i=i.filter(a=>Ue.equals(a.sourceUri,n.documentUri))}r.push(...i);return be(r)}getReferenceToSelf(e){const n=this.nameProvider.getNameNode(e);if(n){const r=ct(e);const i=this.nodeLocator.getAstNodePath(e);return{sourceUri:r.uri,sourcePath:i,targetUri:r.uri,targetPath:i,segment:tu(n),local:true}}return void 0}}class bu{constructor(e){this.map=new Map;if(e){for(const[n,r]of e){this.add(n,r)}}}get size(){return Ad.sum(be(this.map.values()).map(e=>e.length))}clear(){this.map.clear()}delete(e,n){if(n===void 0){return this.map.delete(e)}else{const r=this.map.get(e);if(r){const i=r.indexOf(n);if(i>=0){if(r.length===1){this.map.delete(e)}else{r.splice(i,1)}return true}}return false}}get(e){var n;return(n=this.map.get(e))!==null&&n!==void 0?n:[]}has(e,n){if(n===void 0){return this.map.has(e)}else{const r=this.map.get(e);if(r){return r.indexOf(n)>=0}return false}}add(e,n){if(this.map.has(e)){this.map.get(e).push(n)}else{this.map.set(e,[n])}return this}addAll(e,n){if(this.map.has(e)){this.map.get(e).push(...n)}else{this.map.set(e,Array.from(n))}return this}forEach(e){this.map.forEach((n,r)=>n.forEach(i=>e(i,r,this)))}[Symbol.iterator](){return this.entries().iterator()}entries(){return be(this.map.entries()).flatMap(([e,n])=>n.map(r=>[e,r]))}keys(){return be(this.map.keys())}values(){return be(this.map.values()).flat()}entriesGroupedByKey(){return be(this.map.entries())}}class oh{get size(){return this.map.size}constructor(e){this.map=new Map;this.inverse=new Map;if(e){for(const[n,r]of e){this.set(n,r)}}}clear(){this.map.clear();this.inverse.clear()}set(e,n){this.map.set(e,n);this.inverse.set(n,e);return this}get(e){return this.map.get(e)}getKey(e){return this.inverse.get(e)}delete(e){const n=this.map.get(e);if(n!==void 0){this.map.delete(e);this.inverse.delete(n);return true}return false}}class R${constructor(e){this.nameProvider=e.references.NameProvider;this.descriptions=e.workspace.AstNodeDescriptionProvider}async computeExports(e,n=he.CancellationToken.None){return this.computeExportsForNode(e.parseResult.value,e,void 0,n)}async computeExportsForNode(e,n,r=Ou,i=he.CancellationToken.None){const a=[];this.exportNode(e,a,n);for(const s of r(e)){await ut(i);this.exportNode(s,a,n)}return a}exportNode(e,n,r){const i=this.nameProvider.getName(e);if(i){n.push(this.descriptions.createDescription(e,i,r))}}async computeLocalScopes(e,n=he.CancellationToken.None){const r=e.parseResult.value;const i=new bu;for(const a of Er(r)){await ut(n);this.processNode(a,e,i)}return i}processNode(e,n,r){const i=e.$container;if(i){const a=this.nameProvider.getName(e);if(a){r.add(i,this.descriptions.createDescription(e,a,n))}}}}class lh{constructor(e,n,r){var i;this.elements=e;this.outerScope=n;this.caseInsensitive=(i=r===null||r===void 0?void 0:r.caseInsensitive)!==null&&i!==void 0?i:false}getAllElements(){if(this.outerScope){return this.elements.concat(this.outerScope.getAllElements())}else{return this.elements}}getElement(e){const n=this.caseInsensitive?this.elements.find(r=>r.name.toLowerCase()===e.toLowerCase()):this.elements.find(r=>r.name===e);if(n){return n}if(this.outerScope){return this.outerScope.getElement(e)}return void 0}}class $${constructor(e,n,r){var i;this.elements=new Map;this.caseInsensitive=(i=r===null||r===void 0?void 0:r.caseInsensitive)!==null&&i!==void 0?i:false;for(const a of e){const s=this.caseInsensitive?a.name.toLowerCase():a.name;this.elements.set(s,a)}this.outerScope=n}getElement(e){const n=this.caseInsensitive?e.toLowerCase():e;const r=this.elements.get(n);if(r){return r}if(this.outerScope){return this.outerScope.getElement(e)}return void 0}getAllElements(){let e=be(this.elements.values());if(this.outerScope){e=e.concat(this.outerScope.getAllElements())}return e}}const QN={getElement(){return void 0},getAllElements(){return ug}};class v${constructor(){this.toDispose=[];this.isDisposed=false}onDispose(e){this.toDispose.push(e)}dispose(){this.throwIfDisposed();this.clear();this.isDisposed=true;this.toDispose.forEach(e=>e.dispose())}throwIfDisposed(){if(this.isDisposed){throw new Error("This cache has already been disposed")}}}class ZN extends v${constructor(){super(...arguments);this.cache=new Map}has(e){this.throwIfDisposed();return this.cache.has(e)}set(e,n){this.throwIfDisposed();this.cache.set(e,n)}get(e,n){this.throwIfDisposed();if(this.cache.has(e)){return this.cache.get(e)}else if(n){const r=n();this.cache.set(e,r);return r}else{return void 0}}delete(e){this.throwIfDisposed();return this.cache.delete(e)}clear(){this.throwIfDisposed();this.cache.clear()}}class T$ extends v${constructor(e){super();this.cache=new Map;this.converter=e!==null&&e!==void 0?e:n=>n}has(e,n){this.throwIfDisposed();return this.cacheForContext(e).has(n)}set(e,n,r){this.throwIfDisposed();this.cacheForContext(e).set(n,r)}get(e,n,r){this.throwIfDisposed();const i=this.cacheForContext(e);if(i.has(n)){return i.get(n)}else if(r){const a=r();i.set(n,a);return a}else{return void 0}}delete(e,n){this.throwIfDisposed();return this.cacheForContext(e).delete(n)}clear(e){this.throwIfDisposed();if(e){const n=this.converter(e);this.cache.delete(n)}else{this.cache.clear()}}cacheForContext(e){const n=this.converter(e);let r=this.cache.get(n);if(!r){r=new Map;this.cache.set(n,r)}return r}}class eP extends T${constructor(e,n){super(r=>r.toString());if(n){this.toDispose.push(e.workspace.DocumentBuilder.onDocumentPhase(n,r=>{this.clear(r.uri.toString())}));this.toDispose.push(e.workspace.DocumentBuilder.onUpdate((r,i)=>{for(const a of i){this.clear(a)}}))}else{this.toDispose.push(e.workspace.DocumentBuilder.onUpdate((r,i)=>{const a=r.concat(i);for(const s of a){this.clear(s)}}))}}}class tP extends ZN{constructor(e,n){super();if(n){this.toDispose.push(e.workspace.DocumentBuilder.onBuildPhase(n,()=>{this.clear()}));this.toDispose.push(e.workspace.DocumentBuilder.onUpdate((r,i)=>{if(i.length>0){this.clear()}}))}else{this.toDispose.push(e.workspace.DocumentBuilder.onUpdate(()=>{this.clear()}))}}}class w${constructor(e){this.reflection=e.shared.AstReflection;this.nameProvider=e.references.NameProvider;this.descriptions=e.workspace.AstNodeDescriptionProvider;this.indexManager=e.shared.workspace.IndexManager;this.globalScopeCache=new tP(e.shared)}getScope(e){const n=[];const r=this.reflection.getReferenceType(e);const i=ct(e.container).precomputedScopes;if(i){let s=e.container;do{const o=i.get(s);if(o.length>0){n.push(be(o).filter(l=>this.reflection.isSubtype(l.type,r)))}s=s.$container}while(s)}let a=this.getGlobalScope(r,e);for(let s=n.length-1;s>=0;s--){a=this.createScope(n[s],a)}return a}createScope(e,n,r){return new lh(be(e),n,r)}createScopeForNodes(e,n,r){const i=be(e).map(a=>{const s=this.nameProvider.getName(a);if(s){return this.descriptions.createDescription(a,s)}return void 0}).nonNullable();return new lh(i,n,r)}getGlobalScope(e,n){return this.globalScopeCache.get(e,()=>new $$(this.indexManager.allElements(e)))}}function nP(t){return typeof t.$comment==="string"}function uh(t){return typeof t==="object"&&!!t&&("$ref"in t||"$error"in t)}class rP{constructor(e){this.ignoreProperties=new Set(["$container","$containerProperty","$containerIndex","$document","$cstNode"]);this.langiumDocuments=e.shared.workspace.LangiumDocuments;this.astNodeLocator=e.workspace.AstNodeLocator;this.nameProvider=e.references.NameProvider;this.commentProvider=e.documentation.CommentProvider}serialize(e,n){const r=n!==null&&n!==void 0?n:{};const i=n===null||n===void 0?void 0:n.replacer;const a=(o,l)=>this.replacer(o,l,r);const s=i?(o,l)=>i(o,l,a):a;try{this.currentDocument=ct(e);return JSON.stringify(e,s,n===null||n===void 0?void 0:n.space)}finally{this.currentDocument=void 0}}deserialize(e,n){const r=n!==null&&n!==void 0?n:{};const i=JSON.parse(e);this.linkNode(i,i,r);return i}replacer(e,n,{refText:r,sourceText:i,textRegions:a,comments:s,uriConverter:o}){var l,u,c,d;if(this.ignoreProperties.has(e)){return void 0}else if(tn(n)){const f=n.ref;const p=r?n.$refText:void 0;if(f){const y=ct(f);let v="";if(this.currentDocument&&this.currentDocument!==y){if(o){v=o(y.uri,n)}else{v=y.uri.toString()}}const b=this.astNodeLocator.getAstNodePath(f);return{$ref:`${v}#${b}`,$refText:p}}else{return{$error:(u=(l=n.error)===null||l===void 0?void 0:l.message)!==null&&u!==void 0?u:"Could not resolve reference",$refText:p}}}else if(Ze(n)){let f=void 0;if(a){f=this.addAstNodeRegionWithAssignmentsTo(Object.assign({},n));if((!e||n.$document)&&(f===null||f===void 0?void 0:f.$textRegion)){f.$textRegion.documentURI=(c=this.currentDocument)===null||c===void 0?void 0:c.uri.toString()}}if(i&&!e){f!==null&&f!==void 0?f:f=Object.assign({},n);f.$sourceText=(d=n.$cstNode)===null||d===void 0?void 0:d.text}if(s){f!==null&&f!==void 0?f:f=Object.assign({},n);const p=this.commentProvider.getComment(n);if(p){f.$comment=p.replace(/\r/g,"")}}return f!==null&&f!==void 0?f:n}else{return n}}addAstNodeRegionWithAssignmentsTo(e){const n=r=>({offset:r.offset,end:r.end,length:r.length,range:r.range});if(e.$cstNode){const r=e.$textRegion=n(e.$cstNode);const i=r.assignments={};Object.keys(e).filter(a=>!a.startsWith("$")).forEach(a=>{const s=Ag(e.$cstNode,a).map(n);if(s.length!==0){i[a]=s}});return e}return void 0}linkNode(e,n,r,i,a,s){for(const[l,u]of Object.entries(e)){if(Array.isArray(u)){for(let c=0;c<u.length;c++){const d=u[c];if(uh(d)){u[c]=this.reviveReference(e,l,n,d,r)}else if(Ze(d)){this.linkNode(d,n,r,e,l,c)}}}else if(uh(u)){e[l]=this.reviveReference(e,l,n,u,r)}else if(Ze(u)){this.linkNode(u,n,r,e,l)}}const o=e;o.$container=i;o.$containerProperty=a;o.$containerIndex=s}reviveReference(e,n,r,i,a){let s=i.$refText;let o=i.$error;if(i.$ref){const l=this.getRefNode(r,i.$ref,a.uriConverter);if(Ze(l)){if(!s){s=this.nameProvider.getName(l)}return{$refText:s!==null&&s!==void 0?s:"",ref:l}}else{o=l}}if(o){const l={$refText:s!==null&&s!==void 0?s:""};l.error={container:e,property:n,message:o,reference:l};return l}else{return void 0}}getRefNode(e,n,r){try{const i=n.indexOf("#");if(i===0){const l=this.astNodeLocator.getAstNode(e,n.substring(1));if(!l){return"Could not resolve path: "+n}return l}if(i<0){const l=r?r(n):dt.parse(n);const u=this.langiumDocuments.getDocument(l);if(!u){return"Could not find document for URI: "+n}return u.parseResult.value}const a=r?r(n.substring(0,i)):dt.parse(n.substring(0,i));const s=this.langiumDocuments.getDocument(a);if(!s){return"Could not find document for URI: "+n}if(i===n.length-1){return s.parseResult.value}const o=this.astNodeLocator.getAstNode(s.parseResult.value,n.substring(i+1));if(!o){return"Could not resolve URI: "+n}return o}catch(i){return String(i)}}}class iP{get map(){return this.fileExtensionMap}constructor(e){this.languageIdMap=new Map;this.fileExtensionMap=new Map;this.textDocuments=e===null||e===void 0?void 0:e.workspace.TextDocuments}register(e){const n=e.LanguageMetaData;for(const r of n.fileExtensions){if(this.fileExtensionMap.has(r)){console.warn(`The file extension ${r} is used by multiple languages. It is now assigned to '${n.languageId}'.`)}this.fileExtensionMap.set(r,e)}this.languageIdMap.set(n.languageId,e);if(this.languageIdMap.size===1){this.singleton=e}else{this.singleton=void 0}}getServices(e){var n,r;if(this.singleton!==void 0){return this.singleton}if(this.languageIdMap.size===0){throw new Error("The service registry is empty. Use `register` to register the services of a language.")}const i=(r=(n=this.textDocuments)===null||n===void 0?void 0:n.get(e))===null||r===void 0?void 0:r.languageId;if(i!==void 0){const o=this.languageIdMap.get(i);if(o){return o}}const a=Ue.extname(e);const s=this.fileExtensionMap.get(a);if(!s){if(i){throw new Error(`The service registry contains no services for the extension '${a}' for language '${i}'.`)}else{throw new Error(`The service registry contains no services for the extension '${a}'.`)}}return s}hasServices(e){try{this.getServices(e);return true}catch(n){return false}}get all(){return Array.from(this.languageIdMap.values())}}function ha(t){return{code:t}}var ku;(function(t){t.all=["fast","slow","built-in"]})(ku||(ku={}));class aP{constructor(e){this.entries=new bu;this.entriesBefore=[];this.entriesAfter=[];this.reflection=e.shared.AstReflection}register(e,n=this,r="fast"){if(r==="built-in"){throw new Error("The 'built-in' category is reserved for lexer, parser, and linker errors.")}for(const[i,a]of Object.entries(e)){const s=a;if(Array.isArray(s)){for(const o of s){const l={check:this.wrapValidationException(o,n),category:r};this.addEntry(i,l)}}else if(typeof s==="function"){const o={check:this.wrapValidationException(s,n),category:r};this.addEntry(i,o)}else{Wa()}}}wrapValidationException(e,n){return async(r,i,a)=>{await this.handleException(()=>e.call(n,r,i,a),"An error occurred during validation",i,r)}}async handleException(e,n,r,i){try{await e()}catch(a){if(ss(a)){throw a}console.error(`${n}:`,a);if(a instanceof Error&&a.stack){console.error(a.stack)}const s=a instanceof Error?a.message:String(a);r("error",`${n}: ${s}`,{node:i})}}addEntry(e,n){if(e==="AstNode"){this.entries.add("AstNode",n);return}for(const r of this.reflection.getAllSubTypes(e)){this.entries.add(r,n)}}getChecks(e,n){let r=be(this.entries.get(e)).concat(this.entries.get("AstNode"));if(n){r=r.filter(i=>n.includes(i.category))}return r.map(i=>i.check)}registerBeforeDocument(e,n=this){this.entriesBefore.push(this.wrapPreparationException(e,"An error occurred during set-up of the validation",n))}registerAfterDocument(e,n=this){this.entriesAfter.push(this.wrapPreparationException(e,"An error occurred during tear-down of the validation",n))}wrapPreparationException(e,n,r){return async(i,a,s,o)=>{await this.handleException(()=>e.call(r,i,a,s,o),n,a,i)}}get checksBefore(){return this.entriesBefore}get checksAfter(){return this.entriesAfter}}class E${constructor(e){this.validationRegistry=e.validation.ValidationRegistry;this.metadata=e.LanguageMetaData}async validateDocument(e,n={},r=he.CancellationToken.None){const i=e.parseResult;const a=[];await ut(r);if(!n.categories||n.categories.includes("built-in")){this.processLexingErrors(i,a,n);if(n.stopAfterLexingErrors&&a.some(s=>{var o;return((o=s.data)===null||o===void 0?void 0:o.code)===Kt.LexingError})){return a}this.processParsingErrors(i,a,n);if(n.stopAfterParsingErrors&&a.some(s=>{var o;return((o=s.data)===null||o===void 0?void 0:o.code)===Kt.ParsingError})){return a}this.processLinkingErrors(e,a,n);if(n.stopAfterLinkingErrors&&a.some(s=>{var o;return((o=s.data)===null||o===void 0?void 0:o.code)===Kt.LinkingError})){return a}}try{a.push(...await this.validateAst(i.value,n,r))}catch(s){if(ss(s)){throw s}console.error("An error occurred during validation:",s)}await ut(r);return a}processLexingErrors(e,n,r){var i,a,s;const o=[...e.lexerErrors,...(a=(i=e.lexerReport)===null||i===void 0?void 0:i.diagnostics)!==null&&a!==void 0?a:[]];for(const l of o){const u=(s=l.severity)!==null&&s!==void 0?s:"error";const c={severity:Tc(u),range:{start:{line:l.line-1,character:l.column-1},end:{line:l.line-1,character:l.column+l.length-1}},message:l.message,data:oP(u),source:this.getSource()};n.push(c)}}processParsingErrors(e,n,r){for(const i of e.parserErrors){let a=void 0;if(isNaN(i.token.startOffset)){if("previousToken"in i){const s=i.previousToken;if(!isNaN(s.startOffset)){const o={line:s.endLine-1,character:s.endColumn};a={start:o,end:o}}else{const o={line:0,character:0};a={start:o,end:o}}}}else{a=bd(i.token)}if(a){const s={severity:Tc("error"),range:a,message:i.message,data:ha(Kt.ParsingError),source:this.getSource()};n.push(s)}}}processLinkingErrors(e,n,r){for(const i of e.references){const a=i.error;if(a){const s={node:a.container,property:a.property,index:a.index,data:{code:Kt.LinkingError,containerType:a.container.$type,property:a.property,refText:a.reference.$refText}};n.push(this.toDiagnostic("error",a.message,s))}}}async validateAst(e,n,r=he.CancellationToken.None){const i=[];const a=(s,o,l)=>{i.push(this.toDiagnostic(s,o,l))};await this.validateAstBefore(e,n,a,r);await this.validateAstNodes(e,n,a,r);await this.validateAstAfter(e,n,a,r);return i}async validateAstBefore(e,n,r,i=he.CancellationToken.None){var a;const s=this.validationRegistry.checksBefore;for(const o of s){await ut(i);await o(e,r,(a=n.categories)!==null&&a!==void 0?a:[],i)}}async validateAstNodes(e,n,r,i=he.CancellationToken.None){await Promise.all(Bn(e).map(async a=>{await ut(i);const s=this.validationRegistry.getChecks(a.$type,n.categories);for(const o of s){await o(a,r,i)}}))}async validateAstAfter(e,n,r,i=he.CancellationToken.None){var a;const s=this.validationRegistry.checksAfter;for(const o of s){await ut(i);await o(e,r,(a=n.categories)!==null&&a!==void 0?a:[],i)}}toDiagnostic(e,n,r){return{message:n,range:sP(r),severity:Tc(e),code:r.code,codeDescription:r.codeDescription,tags:r.tags,relatedInformation:r.relatedInformation,data:r.data,source:this.getSource()}}getSource(){return this.metadata.languageId}}function sP(t){if(t.range){return t.range}let e;if(typeof t.property==="string"){e=rp(t.node.$cstNode,t.property,t.index)}else if(typeof t.keyword==="string"){e=bg(t.node.$cstNode,t.keyword,t.index)}e!==null&&e!==void 0?e:e=t.node.$cstNode;if(!e){return{start:{line:0,character:0},end:{line:0,character:0}}}return e.range}function Tc(t){switch(t){case"error":return 1;case"warning":return 2;case"info":return 3;case"hint":return 4;default:throw new Error("Invalid diagnostic severity: "+t)}}function oP(t){switch(t){case"error":return ha(Kt.LexingError);case"warning":return ha(Kt.LexingWarning);case"info":return ha(Kt.LexingInfo);case"hint":return ha(Kt.LexingHint);default:throw new Error("Invalid diagnostic severity: "+t)}}var Kt;(function(t){t.LexingError="lexing-error";t.LexingWarning="lexing-warning";t.LexingInfo="lexing-info";t.LexingHint="lexing-hint";t.ParsingError="parsing-error";t.LinkingError="linking-error"})(Kt||(Kt={}));class lP{constructor(e){this.astNodeLocator=e.workspace.AstNodeLocator;this.nameProvider=e.references.NameProvider}createDescription(e,n,r){const i=r!==null&&r!==void 0?r:ct(e);n!==null&&n!==void 0?n:n=this.nameProvider.getName(e);const a=this.astNodeLocator.getAstNodePath(e);if(!n){throw new Error(`Node at path ${a} has no name.`)}let s;const o=()=>{var l;return s!==null&&s!==void 0?s:s=tu((l=this.nameProvider.getNameNode(e))!==null&&l!==void 0?l:e.$cstNode)};return{node:e,name:n,get nameSegment(){return o()},selectionSegment:tu(e.$cstNode),type:e.$type,documentUri:i.uri,path:a}}}class uP{constructor(e){this.nodeLocator=e.workspace.AstNodeLocator}async createDescriptions(e,n=he.CancellationToken.None){const r=[];const i=e.parseResult.value;for(const a of Bn(i)){await ut(n);vg(a).filter(s=>!Ll(s)).forEach(s=>{const o=this.createDescription(s);if(o){r.push(o)}})}return r}createDescription(e){const n=e.reference.$nodeDescription;const r=e.reference.$refNode;if(!n||!r){return void 0}const i=ct(e.container).uri;return{sourceUri:i,sourcePath:this.nodeLocator.getAstNodePath(e.container),targetUri:n.documentUri,targetPath:n.path,segment:tu(r),local:Ue.equals(n.documentUri,i)}}}class cP{constructor(){this.segmentSeparator="/";this.indexSeparator="@"}getAstNodePath(e){if(e.$container){const n=this.getAstNodePath(e.$container);const r=this.getPathSegment(e);const i=n+this.segmentSeparator+r;return i}return""}getPathSegment({$containerProperty:e,$containerIndex:n}){if(!e){throw new Error("Missing '$containerProperty' in AST node.")}if(n!==void 0){return e+this.indexSeparator+n}return e}getAstNode(e,n){const r=n.split(this.segmentSeparator);return r.reduce((i,a)=>{if(!i||a.length===0){return i}const s=a.indexOf(this.indexSeparator);if(s>0){const o=a.substring(0,s);const l=parseInt(a.substring(s+1));const u=i[o];return u===null||u===void 0?void 0:u[l]}return i[a]},e)}}var dP=d$();class fP{constructor(e){this._ready=new xp;this.settings={};this.workspaceConfig=false;this.onConfigurationSectionUpdateEmitter=new dP.Emitter;this.serviceRegistry=e.ServiceRegistry}get ready(){return this._ready.promise}initialize(e){var n,r;this.workspaceConfig=(r=(n=e.capabilities.workspace)===null||n===void 0?void 0:n.configuration)!==null&&r!==void 0?r:false}async initialized(e){if(this.workspaceConfig){if(e.register){const n=this.serviceRegistry.all;e.register({section:n.map(r=>this.toSectionName(r.LanguageMetaData.languageId))})}if(e.fetchConfiguration){const n=this.serviceRegistry.all.map(i=>({section:this.toSectionName(i.LanguageMetaData.languageId)}));const r=await e.fetchConfiguration(n);n.forEach((i,a)=>{this.updateSectionConfiguration(i.section,r[a])})}}this._ready.resolve()}updateConfiguration(e){if(!e.settings){return}Object.keys(e.settings).forEach(n=>{const r=e.settings[n];this.updateSectionConfiguration(n,r);this.onConfigurationSectionUpdateEmitter.fire({section:n,configuration:r})})}updateSectionConfiguration(e,n){this.settings[e]=n}async getConfiguration(e,n){await this.ready;const r=this.toSectionName(e);if(this.settings[r]){return this.settings[r][n]}}toSectionName(e){return`${e}`}get onConfigurationSectionUpdate(){return this.onConfigurationSectionUpdateEmitter.event}}var Pa;(function(t){function e(n){return{dispose:async()=>await n()}}t.create=e})(Pa||(Pa={}));class pP{constructor(e){this.updateBuildOptions={validation:{categories:["built-in","fast"]}};this.updateListeners=[];this.buildPhaseListeners=new bu;this.documentPhaseListeners=new bu;this.buildState=new Map;this.documentBuildWaiters=new Map;this.currentState=z.Changed;this.langiumDocuments=e.workspace.LangiumDocuments;this.langiumDocumentFactory=e.workspace.LangiumDocumentFactory;this.textDocuments=e.workspace.TextDocuments;this.indexManager=e.workspace.IndexManager;this.serviceRegistry=e.ServiceRegistry}async build(e,n={},r=he.CancellationToken.None){var i,a;for(const s of e){const o=s.uri.toString();if(s.state===z.Validated){if(typeof n.validation==="boolean"&&n.validation){s.state=z.IndexedReferences;s.diagnostics=void 0;this.buildState.delete(o)}else if(typeof n.validation==="object"){const l=this.buildState.get(o);const u=(i=l===null||l===void 0?void 0:l.result)===null||i===void 0?void 0:i.validationChecks;if(u){const c=(a=n.validation.categories)!==null&&a!==void 0?a:ku.all;const d=c.filter(f=>!u.includes(f));if(d.length>0){this.buildState.set(o,{completed:false,options:{validation:Object.assign(Object.assign({},n.validation),{categories:d})},result:l.result});s.state=z.IndexedReferences}}}}else{this.buildState.delete(o)}}this.currentState=z.Changed;await this.emitUpdate(e.map(s=>s.uri),[]);await this.buildDocuments(e,n,r)}async update(e,n,r=he.CancellationToken.None){this.currentState=z.Changed;for(const s of n){this.langiumDocuments.deleteDocument(s);this.buildState.delete(s.toString());this.indexManager.remove(s)}for(const s of e){const o=this.langiumDocuments.invalidateDocument(s);if(!o){const l=this.langiumDocumentFactory.fromModel({$type:"INVALID"},s);l.state=z.Changed;this.langiumDocuments.addDocument(l)}this.buildState.delete(s.toString())}const i=be(e).concat(n).map(s=>s.toString()).toSet();this.langiumDocuments.all.filter(s=>!i.has(s.uri.toString())&&this.shouldRelink(s,i)).forEach(s=>{const o=this.serviceRegistry.getServices(s.uri).references.Linker;o.unlink(s);s.state=Math.min(s.state,z.ComputedScopes);s.diagnostics=void 0});await this.emitUpdate(e,n);await ut(r);const a=this.sortDocuments(this.langiumDocuments.all.filter(s=>{var o;return s.state<z.Linked||!((o=this.buildState.get(s.uri.toString()))===null||o===void 0?void 0:o.completed)}).toArray());await this.buildDocuments(a,this.updateBuildOptions,r)}async emitUpdate(e,n){await Promise.all(this.updateListeners.map(r=>r(e,n)))}sortDocuments(e){let n=0;let r=e.length-1;while(n<r){while(n<e.length&&this.hasTextDocument(e[n])){n++}while(r>=0&&!this.hasTextDocument(e[r])){r--}if(n<r){[e[n],e[r]]=[e[r],e[n]]}}return e}hasTextDocument(e){var n;return Boolean((n=this.textDocuments)===null||n===void 0?void 0:n.get(e.uri))}shouldRelink(e,n){if(e.references.some(r=>r.error!==void 0)){return true}return this.indexManager.isAffected(e,n)}onUpdate(e){this.updateListeners.push(e);return Pa.create(()=>{const n=this.updateListeners.indexOf(e);if(n>=0){this.updateListeners.splice(n,1)}})}async buildDocuments(e,n,r){this.prepareBuild(e,n);await this.runCancelable(e,z.Parsed,r,a=>this.langiumDocumentFactory.update(a,r));await this.runCancelable(e,z.IndexedContent,r,a=>this.indexManager.updateContent(a,r));await this.runCancelable(e,z.ComputedScopes,r,async a=>{const s=this.serviceRegistry.getServices(a.uri).references.ScopeComputation;a.precomputedScopes=await s.computeLocalScopes(a,r)});await this.runCancelable(e,z.Linked,r,a=>{const s=this.serviceRegistry.getServices(a.uri).references.Linker;return s.link(a,r)});await this.runCancelable(e,z.IndexedReferences,r,a=>this.indexManager.updateReferences(a,r));const i=e.filter(a=>this.shouldValidate(a));await this.runCancelable(i,z.Validated,r,a=>this.validate(a,r));for(const a of e){const s=this.buildState.get(a.uri.toString());if(s){s.completed=true}}}prepareBuild(e,n){for(const r of e){const i=r.uri.toString();const a=this.buildState.get(i);if(!a||a.completed){this.buildState.set(i,{completed:false,options:n,result:a===null||a===void 0?void 0:a.result})}}}async runCancelable(e,n,r,i){const a=e.filter(o=>o.state<n);for(const o of a){await ut(r);await i(o);o.state=n;await this.notifyDocumentPhase(o,n,r)}const s=e.filter(o=>o.state===n);await this.notifyBuildPhase(s,n,r);this.currentState=n}onBuildPhase(e,n){this.buildPhaseListeners.add(e,n);return Pa.create(()=>{this.buildPhaseListeners.delete(e,n)})}onDocumentPhase(e,n){this.documentPhaseListeners.add(e,n);return Pa.create(()=>{this.documentPhaseListeners.delete(e,n)})}waitUntil(e,n,r){let i=void 0;if(n&&"path"in n){i=n}else{r=n}r!==null&&r!==void 0?r:r=he.CancellationToken.None;if(i){const a=this.langiumDocuments.getDocument(i);if(a&&a.state>e){return Promise.resolve(i)}}if(this.currentState>=e){return Promise.resolve(void 0)}else if(r.isCancellationRequested){return Promise.reject(Su)}return new Promise((a,s)=>{const o=this.onBuildPhase(e,()=>{o.dispose();l.dispose();if(i){const u=this.langiumDocuments.getDocument(i);a(u===null||u===void 0?void 0:u.uri)}else{a(void 0)}});const l=r.onCancellationRequested(()=>{o.dispose();l.dispose();s(Su)})})}async notifyDocumentPhase(e,n,r){const i=this.documentPhaseListeners.get(n);const a=i.slice();for(const s of a){try{await s(e,r)}catch(o){if(!ss(o)){throw o}}}}async notifyBuildPhase(e,n,r){if(e.length===0){return}const i=this.buildPhaseListeners.get(n);const a=i.slice();for(const s of a){await ut(r);await s(e,r)}}shouldValidate(e){return Boolean(this.getBuildOptions(e).validation)}async validate(e,n){var r,i;const a=this.serviceRegistry.getServices(e.uri).validation.DocumentValidator;const s=this.getBuildOptions(e).validation;const o=typeof s==="object"?s:void 0;const l=await a.validateDocument(e,o,n);if(e.diagnostics){e.diagnostics.push(...l)}else{e.diagnostics=l}const u=this.buildState.get(e.uri.toString());if(u){(r=u.result)!==null&&r!==void 0?r:u.result={};const c=(i=o===null||o===void 0?void 0:o.categories)!==null&&i!==void 0?i:ku.all;if(u.result.validationChecks){u.result.validationChecks.push(...c)}else{u.result.validationChecks=[...c]}}}getBuildOptions(e){var n,r;return(r=(n=this.buildState.get(e.uri.toString()))===null||n===void 0?void 0:n.options)!==null&&r!==void 0?r:{}}}class C${constructor(e){this.symbolIndex=new Map;this.symbolByTypeIndex=new T$;this.referenceIndex=new Map;this.documents=e.workspace.LangiumDocuments;this.serviceRegistry=e.ServiceRegistry;this.astReflection=e.AstReflection}findAllReferences(e,n){const r=ct(e).uri;const i=[];this.referenceIndex.forEach(a=>{a.forEach(s=>{if(Ue.equals(s.targetUri,r)&&s.targetPath===n){i.push(s)}})});return be(i)}allElements(e,n){let r=be(this.symbolIndex.keys());if(n){r=r.filter(i=>!n||n.has(i))}return r.map(i=>this.getFileDescriptions(i,e)).flat()}getFileDescriptions(e,n){var r;if(!n){return(r=this.symbolIndex.get(e))!==null&&r!==void 0?r:[]}const i=this.symbolByTypeIndex.get(e,n,()=>{var a;const s=(a=this.symbolIndex.get(e))!==null&&a!==void 0?a:[];return s.filter(o=>this.astReflection.isSubtype(o.type,n))});return i}remove(e){const n=e.toString();this.symbolIndex.delete(n);this.symbolByTypeIndex.clear(n);this.referenceIndex.delete(n)}async updateContent(e,n=he.CancellationToken.None){const r=this.serviceRegistry.getServices(e.uri);const i=await r.references.ScopeComputation.computeExports(e,n);const a=e.uri.toString();this.symbolIndex.set(a,i);this.symbolByTypeIndex.clear(a)}async updateReferences(e,n=he.CancellationToken.None){const r=this.serviceRegistry.getServices(e.uri);const i=await r.workspace.ReferenceDescriptionProvider.createDescriptions(e,n);this.referenceIndex.set(e.uri.toString(),i)}isAffected(e,n){const r=this.referenceIndex.get(e.uri.toString());if(!r){return false}return r.some(i=>!i.local&&n.has(i.targetUri.toString()))}}class S${constructor(e){this.initialBuildOptions={};this._ready=new xp;this.serviceRegistry=e.ServiceRegistry;this.langiumDocuments=e.workspace.LangiumDocuments;this.documentBuilder=e.workspace.DocumentBuilder;this.fileSystemProvider=e.workspace.FileSystemProvider;this.mutex=e.workspace.WorkspaceLock}get ready(){return this._ready.promise}get workspaceFolders(){return this.folders}initialize(e){var n;this.folders=(n=e.workspaceFolders)!==null&&n!==void 0?n:void 0}initialized(e){return this.mutex.write(n=>{var r;return this.initializeWorkspace((r=this.folders)!==null&&r!==void 0?r:[],n)})}async initializeWorkspace(e,n=he.CancellationToken.None){const r=await this.performStartup(e);await ut(n);await this.documentBuilder.build(r,this.initialBuildOptions,n)}async performStartup(e){const n=this.serviceRegistry.all.flatMap(a=>a.LanguageMetaData.fileExtensions);const r=[];const i=a=>{r.push(a);if(!this.langiumDocuments.hasDocument(a.uri)){this.langiumDocuments.addDocument(a)}};await this.loadAdditionalDocuments(e,i);await Promise.all(e.map(a=>[a,this.getRootFolder(a)]).map(async a=>this.traverseFolder(...a,n,i)));this._ready.resolve();return r}loadAdditionalDocuments(e,n){return Promise.resolve()}getRootFolder(e){return dt.parse(e.uri)}async traverseFolder(e,n,r,i){const a=await this.fileSystemProvider.readDirectory(n);await Promise.all(a.map(async s=>{if(this.includeEntry(e,s,r)){if(s.isDirectory){await this.traverseFolder(e,s.uri,r,i)}else if(s.isFile){const o=await this.langiumDocuments.getOrCreateDocument(s.uri);i(o)}}}))}includeEntry(e,n,r){const i=Ue.basename(n.uri);if(i.startsWith(".")){return false}if(n.isDirectory){return i!=="node_modules"&&i!=="out"}else if(n.isFile){const a=Ue.extname(n.uri);return r.includes(a)}return false}}class mP{buildUnexpectedCharactersMessage(e,n,r,i,a){return Kd.buildUnexpectedCharactersMessage(e,n,r,i,a)}buildUnableToPopLexerModeMessage(e){return Kd.buildUnableToPopLexerModeMessage(e)}}const hP={mode:"full"};class A${constructor(e){this.errorMessageProvider=e.parser.LexerErrorMessageProvider;this.tokenBuilder=e.parser.TokenBuilder;const n=this.tokenBuilder.buildTokens(e.Grammar,{caseInsensitive:e.LanguageMetaData.caseInsensitive});this.tokenTypes=this.toTokenTypeDictionary(n);const r=ch(n)?Object.values(n):n;const i=e.LanguageMetaData.mode==="production";this.chevrotainLexer=new Rt(r,{positionTracking:"full",skipValidations:i,errorMessageProvider:this.errorMessageProvider})}get definition(){return this.tokenTypes}tokenize(e,n=hP){var r,i,a;const s=this.chevrotainLexer.tokenize(e);return{tokens:s.tokens,errors:s.errors,hidden:(r=s.groups.hidden)!==null&&r!==void 0?r:[],report:(a=(i=this.tokenBuilder).flushLexingReport)===null||a===void 0?void 0:a.call(i,e)}}toTokenTypeDictionary(e){if(ch(e))return e;const n=b$(e)?Object.values(e.modes).flat():e;const r={};n.forEach(i=>r[i.name]=i);return r}}function yP(t){return Array.isArray(t)&&(t.length===0||"name"in t[0])}function b$(t){return t&&"modes"in t&&"defaultMode"in t}function ch(t){return!yP(t)&&!b$(t)}function gP(t,e,n){let r;let i;if(typeof t==="string"){i=e;r=n}else{i=t.range.start;r=e}if(!i){i=le.create(0,0)}const a=k$(t);const s=Mp(r);const o=vP({lines:a,position:i,options:s});return SP({index:0,tokens:o,position:i})}function RP(t,e){const n=Mp(e);const r=k$(t);if(r.length===0){return false}const i=r[0];const a=r[r.length-1];const s=n.start;const o=n.end;return Boolean(s===null||s===void 0?void 0:s.exec(i))&&Boolean(o===null||o===void 0?void 0:o.exec(a))}function k$(t){let e="";if(typeof t==="string"){e=t}else{e=t.text}const n=e.split(Nv);return n}const dh=/\s*(@([\p{L}][\p{L}\p{N}]*)?)/uy;const $P=/\{(@[\p{L}][\p{L}\p{N}]*)(\s*)([^\r\n}]+)?\}/gu;function vP(t){var e,n,r;const i=[];let a=t.position.line;let s=t.position.character;for(let o=0;o<t.lines.length;o++){const l=o===0;const u=o===t.lines.length-1;let c=t.lines[o];let d=0;if(l&&t.options.start){const p=(e=t.options.start)===null||e===void 0?void 0:e.exec(c);if(p){d=p.index+p[0].length}}else{const p=(n=t.options.line)===null||n===void 0?void 0:n.exec(c);if(p){d=p.index+p[0].length}}if(u){const p=(r=t.options.end)===null||r===void 0?void 0:r.exec(c);if(p){c=c.substring(0,p.index)}}c=c.substring(0,CP(c));const f=Xf(c,d);if(f>=c.length){if(i.length>0){const p=le.create(a,s);i.push({type:"break",content:"",range:re.create(p,p)})}}else{dh.lastIndex=d;const p=dh.exec(c);if(p){const y=p[0];const v=p[1];const b=le.create(a,s+d);const $=le.create(a,s+d+y.length);i.push({type:"tag",content:v,range:re.create(b,$)});d+=y.length;d=Xf(c,d)}if(d<c.length){const y=c.substring(d);const v=Array.from(y.matchAll($P));i.push(...TP(v,y,a,s+d))}}a++;s=0}if(i.length>0&&i[i.length-1].type==="break"){return i.slice(0,-1)}return i}function TP(t,e,n,r){const i=[];if(t.length===0){const a=le.create(n,r);const s=le.create(n,r+e.length);i.push({type:"text",content:e,range:re.create(a,s)})}else{let a=0;for(const o of t){const l=o.index;const u=e.substring(a,l);if(u.length>0){i.push({type:"text",content:e.substring(a,l),range:re.create(le.create(n,a+r),le.create(n,l+r))})}let c=u.length+1;const d=o[1];i.push({type:"inline-tag",content:d,range:re.create(le.create(n,a+c+r),le.create(n,a+c+d.length+r))});c+=d.length;if(o.length===4){c+=o[2].length;const f=o[3];i.push({type:"text",content:f,range:re.create(le.create(n,a+c+r),le.create(n,a+c+f.length+r))})}else{i.push({type:"text",content:"",range:re.create(le.create(n,a+c+r),le.create(n,a+c+r))})}a=l+o[0].length}const s=e.substring(a);if(s.length>0){i.push({type:"text",content:s,range:re.create(le.create(n,a+r),le.create(n,a+r+s.length))})}}return i}const wP=/\S/;const EP=/\s*$/;function Xf(t,e){const n=t.substring(e).match(wP);if(n){return e+n.index}else{return t.length}}function CP(t){const e=t.match(EP);if(e&&typeof e.index==="number"){return e.index}return void 0}function SP(t){var e,n,r,i;const a=le.create(t.position.line,t.position.character);if(t.tokens.length===0){return new fh([],re.create(a,a))}const s=[];while(t.index<t.tokens.length){const u=AP(t,s[s.length-1]);if(u){s.push(u)}}const o=(n=(e=s[0])===null||e===void 0?void 0:e.range.start)!==null&&n!==void 0?n:a;const l=(i=(r=s[s.length-1])===null||r===void 0?void 0:r.range.end)!==null&&i!==void 0?i:a;return new fh(s,re.create(o,l))}function AP(t,e){const n=t.tokens[t.index];if(n.type==="tag"){return P$(t,false)}else if(n.type==="text"||n.type==="inline-tag"){return N$(t)}else{bP(n,e);t.index++;return void 0}}function bP(t,e){if(e){const n=new D$("",t.range);if("inlines"in e){e.inlines.push(n)}else{e.content.inlines.push(n)}}}function N$(t){let e=t.tokens[t.index];const n=e;let r=e;const i=[];while(e&&e.type!=="break"&&e.type!=="tag"){i.push(kP(t));r=e;e=t.tokens[t.index]}return new Yf(i,re.create(n.range.start,r.range.end))}function kP(t){const e=t.tokens[t.index];if(e.type==="inline-tag"){return P$(t,true)}else{return _$(t)}}function P$(t,e){const n=t.tokens[t.index++];const r=n.content.substring(1);const i=t.tokens[t.index];if((i===null||i===void 0?void 0:i.type)==="text"){if(e){const a=_$(t);return new Ec(r,new Yf([a],a.range),e,re.create(n.range.start,a.range.end))}else{const a=N$(t);return new Ec(r,a,e,re.create(n.range.start,a.range.end))}}else{const a=n.range;return new Ec(r,new Yf([],a),e,a)}}function _$(t){const e=t.tokens[t.index++];return new D$(e.content,e.range)}function Mp(t){if(!t){return Mp({start:"/**",end:"*/",line:"*"})}const{start:e,end:n,line:r}=t;return{start:wc(e,true),end:wc(n,false),line:wc(r,true)}}function wc(t,e){if(typeof t==="string"||typeof t==="object"){const n=typeof t==="string"?xu(t):t.source;if(e){return new RegExp(`^\\s*${n}`)}else{return new RegExp(`\\s*${n}\\s*$`)}}else{return t}}class fh{constructor(e,n){this.elements=e;this.range=n}getTag(e){return this.getAllTags().find(n=>n.name===e)}getTags(e){return this.getAllTags().filter(n=>n.name===e)}getAllTags(){return this.elements.filter(e=>"name"in e)}toString(){let e="";for(const n of this.elements){if(e.length===0){e=n.toString()}else{const r=n.toString();e+=ph(e)+r}}return e.trim()}toMarkdown(e){let n="";for(const r of this.elements){if(n.length===0){n=r.toMarkdown(e)}else{const i=r.toMarkdown(e);n+=ph(n)+i}}return n.trim()}}class Ec{constructor(e,n,r,i){this.name=e;this.content=n;this.inline=r;this.range=i}toString(){let e=`@${this.name}`;const n=this.content.toString();if(this.content.inlines.length===1){e=`${e} ${n}`}else if(this.content.inlines.length>1){e=`${e}
${n}`}if(this.inline){return`{${e}}`}else{return e}}toMarkdown(e){var n,r;return(r=(n=e===null||e===void 0?void 0:e.renderTag)===null||n===void 0?void 0:n.call(e,this))!==null&&r!==void 0?r:this.toMarkdownDefault(e)}toMarkdownDefault(e){const n=this.content.toMarkdown(e);if(this.inline){const a=NP(this.name,n,e!==null&&e!==void 0?e:{});if(typeof a==="string"){return a}}let r="";if((e===null||e===void 0?void 0:e.tag)==="italic"||(e===null||e===void 0?void 0:e.tag)===void 0){r="*"}else if((e===null||e===void 0?void 0:e.tag)==="bold"){r="**"}else if((e===null||e===void 0?void 0:e.tag)==="bold-italic"){r="***"}let i=`${r}@${this.name}${r}`;if(this.content.inlines.length===1){i=`${i} — ${n}`}else if(this.content.inlines.length>1){i=`${i}
${n}`}if(this.inline){return`{${i}}`}else{return i}}}function NP(t,e,n){var r,i;if(t==="linkplain"||t==="linkcode"||t==="link"){const a=e.indexOf(" ");let s=e;if(a>0){const l=Xf(e,a);s=e.substring(l);e=e.substring(0,a)}if(t==="linkcode"||t==="link"&&n.link==="code"){s=`\`${s}\``}const o=(i=(r=n.renderLink)===null||r===void 0?void 0:r.call(n,e,s))!==null&&i!==void 0?i:PP(e,s);return o}return void 0}function PP(t,e){try{dt.parse(t,true);return`[${e}](${t})`}catch(n){return t}}class Yf{constructor(e,n){this.inlines=e;this.range=n}toString(){let e="";for(let n=0;n<this.inlines.length;n++){const r=this.inlines[n];const i=this.inlines[n+1];e+=r.toString();if(i&&i.range.start.line>r.range.start.line){e+="\n"}}return e}toMarkdown(e){let n="";for(let r=0;r<this.inlines.length;r++){const i=this.inlines[r];const a=this.inlines[r+1];n+=i.toMarkdown(e);if(a&&a.range.start.line>i.range.start.line){n+="\n"}}return n}}class D${constructor(e,n){this.text=e;this.range=n}toString(){return this.text}toMarkdown(){return this.text}}function ph(t){if(t.endsWith("\n")){return"\n"}else{return"\n\n"}}class I${constructor(e){this.indexManager=e.shared.workspace.IndexManager;this.commentProvider=e.documentation.CommentProvider}getDocumentation(e){const n=this.commentProvider.getComment(e);if(n&&RP(n)){const r=gP(n);return r.toMarkdown({renderLink:(i,a)=>{return this.documentationLinkRenderer(e,i,a)},renderTag:i=>{return this.documentationTagRenderer(e,i)}})}return void 0}documentationLinkRenderer(e,n,r){var i;const a=(i=this.findNameInPrecomputedScopes(e,n))!==null&&i!==void 0?i:this.findNameInGlobalScope(e,n);if(a&&a.nameSegment){const s=a.nameSegment.range.start.line+1;const o=a.nameSegment.range.start.character+1;const l=a.documentUri.with({fragment:`L${s},${o}`});return`[${r}](${l.toString()})`}else{return void 0}}documentationTagRenderer(e,n){return void 0}findNameInPrecomputedScopes(e,n){const r=ct(e);const i=r.precomputedScopes;if(!i){return void 0}let a=e;do{const s=i.get(a);const o=s.find(l=>l.name===n);if(o){return o}a=a.$container}while(a);return void 0}findNameInGlobalScope(e,n){const r=this.indexManager.allElements().find(i=>i.name===n);return r}}class _P{constructor(e){this.grammarConfig=()=>e.parser.GrammarConfig}getComment(e){var n;if(nP(e)){return e.$comment}return(n=ov(e.$cstNode,this.grammarConfig().multilineCommentRules))===null||n===void 0?void 0:n.text}}class DP{constructor(e){this.syncParser=e.parser.LangiumParser}parse(e,n){return Promise.resolve(this.syncParser.parse(e))}}class IP{constructor(){this.previousTokenSource=new he.CancellationTokenSource;this.writeQueue=[];this.readQueue=[];this.done=true}write(e){this.cancelWrite();const n=VN();this.previousTokenSource=n;return this.enqueue(this.writeQueue,e,n.token)}read(e){return this.enqueue(this.readQueue,e)}enqueue(e,n,r=he.CancellationToken.None){const i=new xp;const a={action:n,deferred:i,cancellationToken:r};e.push(a);this.performNextOperation();return i.promise}async performNextOperation(){if(!this.done){return}const e=[];if(this.writeQueue.length>0){e.push(this.writeQueue.shift())}else if(this.readQueue.length>0){e.push(...this.readQueue.splice(0,this.readQueue.length))}else{return}this.done=false;await Promise.all(e.map(async({action:n,deferred:r,cancellationToken:i})=>{try{const a=await Promise.resolve().then(()=>n(i));r.resolve(a)}catch(a){if(ss(a)){r.resolve(void 0)}else{r.reject(a)}}}));this.done=true;this.performNextOperation()}cancelWrite(){this.previousTokenSource.cancel()}}class OP{constructor(e){this.grammarElementIdMap=new oh;this.tokenTypeIdMap=new oh;this.grammar=e.Grammar;this.lexer=e.parser.Lexer;this.linker=e.references.Linker}dehydrate(e){return{lexerErrors:e.lexerErrors,lexerReport:e.lexerReport?this.dehydrateLexerReport(e.lexerReport):void 0,parserErrors:e.parserErrors.map(n=>Object.assign(Object.assign({},n),{message:n.message})),value:this.dehydrateAstNode(e.value,this.createDehyrationContext(e.value))}}dehydrateLexerReport(e){return e}createDehyrationContext(e){const n=new Map;const r=new Map;for(const i of Bn(e)){n.set(i,{})}if(e.$cstNode){for(const i of eu(e.$cstNode)){r.set(i,{})}}return{astNodes:n,cstNodes:r}}dehydrateAstNode(e,n){const r=n.astNodes.get(e);r.$type=e.$type;r.$containerIndex=e.$containerIndex;r.$containerProperty=e.$containerProperty;if(e.$cstNode!==void 0){r.$cstNode=this.dehydrateCstNode(e.$cstNode,n)}for(const[i,a]of Object.entries(e)){if(i.startsWith("$")){continue}if(Array.isArray(a)){const s=[];r[i]=s;for(const o of a){if(Ze(o)){s.push(this.dehydrateAstNode(o,n))}else if(tn(o)){s.push(this.dehydrateReference(o,n))}else{s.push(o)}}}else if(Ze(a)){r[i]=this.dehydrateAstNode(a,n)}else if(tn(a)){r[i]=this.dehydrateReference(a,n)}else if(a!==void 0){r[i]=a}}return r}dehydrateReference(e,n){const r={};r.$refText=e.$refText;if(e.$refNode){r.$refNode=n.cstNodes.get(e.$refNode)}return r}dehydrateCstNode(e,n){const r=n.cstNodes.get(e);if(lg(e)){r.fullText=e.fullText}else{r.grammarSource=this.getGrammarElementId(e.grammarSource)}r.hidden=e.hidden;r.astNode=n.astNodes.get(e.astNode);if(hr(e)){r.content=e.content.map(i=>this.dehydrateCstNode(i,n))}else if(Ba(e)){r.tokenType=e.tokenType.name;r.offset=e.offset;r.length=e.length;r.startLine=e.range.start.line;r.startColumn=e.range.start.character;r.endLine=e.range.end.line;r.endColumn=e.range.end.character}return r}hydrate(e){const n=e.value;const r=this.createHydrationContext(n);if("$cstNode"in n){this.hydrateCstNode(n.$cstNode,r)}return{lexerErrors:e.lexerErrors,lexerReport:e.lexerReport,parserErrors:e.parserErrors,value:this.hydrateAstNode(n,r)}}createHydrationContext(e){const n=new Map;const r=new Map;for(const a of Bn(e)){n.set(a,{})}let i;if(e.$cstNode){for(const a of eu(e.$cstNode)){let s;if("fullText"in a){s=new t$(a.fullText);i=s}else if("content"in a){s=new Op}else if("tokenType"in a){s=this.hydrateCstLeafNode(a)}if(s){r.set(a,s);s.root=i}}}return{astNodes:n,cstNodes:r}}hydrateAstNode(e,n){const r=n.astNodes.get(e);r.$type=e.$type;r.$containerIndex=e.$containerIndex;r.$containerProperty=e.$containerProperty;if(e.$cstNode){r.$cstNode=n.cstNodes.get(e.$cstNode)}for(const[i,a]of Object.entries(e)){if(i.startsWith("$")){continue}if(Array.isArray(a)){const s=[];r[i]=s;for(const o of a){if(Ze(o)){s.push(this.setParent(this.hydrateAstNode(o,n),r))}else if(tn(o)){s.push(this.hydrateReference(o,r,i,n))}else{s.push(o)}}}else if(Ze(a)){r[i]=this.setParent(this.hydrateAstNode(a,n),r)}else if(tn(a)){r[i]=this.hydrateReference(a,r,i,n)}else if(a!==void 0){r[i]=a}}return r}setParent(e,n){e.$container=n;return e}hydrateReference(e,n,r,i){return this.linker.buildReference(n,r,i.cstNodes.get(e.$refNode),e.$refText)}hydrateCstNode(e,n,r=0){const i=n.cstNodes.get(e);if(typeof e.grammarSource==="number"){i.grammarSource=this.getGrammarElement(e.grammarSource)}i.astNode=n.astNodes.get(e.astNode);if(hr(i)){for(const a of e.content){const s=this.hydrateCstNode(a,n,r++);i.content.push(s)}}return i}hydrateCstLeafNode(e){const n=this.getTokenType(e.tokenType);const r=e.offset;const i=e.length;const a=e.startLine;const s=e.startColumn;const o=e.endLine;const l=e.endColumn;const u=e.hidden;const c=new Bf(r,i,{start:{line:a,character:s},end:{line:o,character:l}},n,u);return c}getTokenType(e){return this.lexer.definition[e]}getGrammarElementId(e){if(!e){return void 0}if(this.grammarElementIdMap.size===0){this.createGrammarElementIdMap()}return this.grammarElementIdMap.get(e)}getGrammarElement(e){if(this.grammarElementIdMap.size===0){this.createGrammarElementIdMap()}const n=this.grammarElementIdMap.getKey(e);return n}createGrammarElementIdMap(){let e=0;for(const n of Bn(this.grammar)){if(hg(n)){this.grammarElementIdMap.set(n,e++)}}}}function O$(t){return{documentation:{CommentProvider:e=>new _P(e),DocumentationProvider:e=>new I$(e)},parser:{AsyncParser:e=>new DP(e),GrammarConfig:e=>Xv(e),LangiumParser:e=>FN(e),CompletionParser:e=>KN(e),ValueConverter:()=>new GN,TokenBuilder:()=>new u$,Lexer:e=>new A$(e),ParserErrorMessageProvider:()=>new i$,LexerErrorMessageProvider:()=>new mP},workspace:{AstNodeLocator:()=>new cP,AstNodeDescriptionProvider:e=>new lP(e),ReferenceDescriptionProvider:e=>new uP(e)},references:{Linker:e=>new JN(e),NameProvider:()=>new y$,ScopeProvider:e=>new w$(e),ScopeComputation:e=>new R$(e),References:e=>new g$(e)},serializer:{Hydrator:e=>new OP(e),JsonSerializer:e=>new rP(e)},validation:{DocumentValidator:e=>new E$(e),ValidationRegistry:e=>new aP(e)},shared:()=>t.shared}}function L$(t){return{ServiceRegistry:e=>new iP(e),workspace:{LangiumDocuments:e=>new YN(e),LangiumDocumentFactory:e=>new XN(e),DocumentBuilder:e=>new pP(e),IndexManager:e=>new C$(e),WorkspaceManager:e=>new S$(e),FileSystemProvider:e=>t.fileSystemProvider(e),WorkspaceLock:()=>new IP,ConfigurationProvider:e=>new fP(e)}}}var Nu;(function(t){t.merge=(e,n)=>_u(_u({},e),n)})(Nu||(Nu={}));function Pu(t,e,n,r,i,a,s,o,l){const u=[t,e,n,r,i,a,s,o,l].reduce(_u,{});return M$(u)}const x$=Symbol("isProxy");function Jf(t){if(t&&t[x$]){for(const e of Object.values(t)){Jf(e)}}return t}function M$(t,e){const n=new Proxy({},{deleteProperty:()=>false,set:()=>{throw new Error("Cannot set property on injected service container")},get:(r,i)=>{if(i===x$){return true}else{return hh(r,i,t,e||n)}},getOwnPropertyDescriptor:(r,i)=>(hh(r,i,t,e||n),Object.getOwnPropertyDescriptor(r,i)),has:(r,i)=>i in t,ownKeys:()=>[...Object.getOwnPropertyNames(t)]});return n}const mh=Symbol();function hh(t,e,n,r){if(e in t){if(t[e]instanceof Error){throw new Error("Construction failure. Please make sure that your dependencies are constructable.",{cause:t[e]})}if(t[e]===mh){throw new Error('Cycle detected. Please make "'+String(e)+'" lazy. Visit https://langium.org/docs/reference/configuration-services/#resolving-cyclic-dependencies')}return t[e]}else if(e in n){const i=n[e];t[e]=mh;try{t[e]=typeof i==="function"?i(r):M$(i,r)}catch(a){t[e]=a instanceof Error?a:void 0;throw a}return t[e]}else{return void 0}}function _u(t,e){if(e){for(const[n,r]of Object.entries(e)){if(r!==void 0){const i=t[n];if(i!==null&&r!==null&&typeof i==="object"&&typeof r==="object"){t[n]=_u(i,r)}else{t[n]=r}}}}return t}class LP{readFile(){throw new Error("No file system is available.")}async readDirectory(){return[]}}const K$={fileSystemProvider:()=>new LP};const xP={Grammar:()=>void 0,LanguageMetaData:()=>({caseInsensitive:false,fileExtensions:[".langium"],languageId:"langium"})};const MP={AstReflection:()=>new $g};function KP(){const t=Pu(L$(K$),MP);const e=Pu(O$({shared:t}),xP);t.ServiceRegistry.register(e);return e}function FP(t){var e;const n=KP();const r=n.serializer.JsonSerializer.deserialize(t);n.shared.workspace.LangiumDocumentFactory.fromModel(r,dt.parse(`memory://${(e=r.name)!==null&&e!==void 0?e:"grammar"}.langium`));return r}var ii={};var ai={};var pn={};var si={};var oi={};var Ks={};var Cc={};var V={};var ze={};var yh;function os(){if(yh)return ze;yh=1;Object.defineProperty(ze,"__esModule",{value:true});ze.stringArray=ze.array=ze.func=ze.error=ze.number=ze.string=ze.boolean=void 0;function t(o){return o===true||o===false}ze.boolean=t;function e(o){return typeof o==="string"||o instanceof String}ze.string=e;function n(o){return typeof o==="number"||o instanceof Number}ze.number=n;function r(o){return o instanceof Error}ze.error=r;function i(o){return typeof o==="function"}ze.func=i;function a(o){return Array.isArray(o)}ze.array=a;function s(o){return a(o)&&o.every(l=>e(l))}ze.stringArray=s;return ze}var gh;function F$(){if(gh)return V;gh=1;Object.defineProperty(V,"__esModule",{value:true});V.Message=V.NotificationType9=V.NotificationType8=V.NotificationType7=V.NotificationType6=V.NotificationType5=V.NotificationType4=V.NotificationType3=V.NotificationType2=V.NotificationType1=V.NotificationType0=V.NotificationType=V.RequestType9=V.RequestType8=V.RequestType7=V.RequestType6=V.RequestType5=V.RequestType4=V.RequestType3=V.RequestType2=V.RequestType1=V.RequestType=V.RequestType0=V.AbstractMessageSignature=V.ParameterStructures=V.ResponseError=V.ErrorCodes=void 0;const t=os();var e;(function(E){E.ParseError=-32700;E.InvalidRequest=-32600;E.MethodNotFound=-32601;E.InvalidParams=-32602;E.InternalError=-32603;E.jsonrpcReservedErrorRangeStart=-32099;E.serverErrorStart=-32099;E.MessageWriteError=-32099;E.MessageReadError=-32098;E.PendingResponseRejected=-32097;E.ConnectionInactive=-32096;E.ServerNotInitialized=-32002;E.UnknownErrorCode=-32001;E.jsonrpcReservedErrorRangeEnd=-32e3;E.serverErrorEnd=-32e3})(e||(V.ErrorCodes=e={}));class n extends Error{constructor(g,k,M){super(k);this.code=t.number(g)?g:e.UnknownErrorCode;this.data=M;Object.setPrototypeOf(this,n.prototype)}toJson(){const g={code:this.code,message:this.message};if(this.data!==void 0){g.data=this.data}return g}}V.ResponseError=n;class r{constructor(g){this.kind=g}static is(g){return g===r.auto||g===r.byName||g===r.byPosition}toString(){return this.kind}}V.ParameterStructures=r;r.auto=new r("auto");r.byPosition=new r("byPosition");r.byName=new r("byName");class i{constructor(g,k){this.method=g;this.numberOfParams=k}get parameterStructures(){return r.auto}}V.AbstractMessageSignature=i;class a extends i{constructor(g){super(g,0)}}V.RequestType0=a;class s extends i{constructor(g,k=r.auto){super(g,1);this._parameterStructures=k}get parameterStructures(){return this._parameterStructures}}V.RequestType=s;class o extends i{constructor(g,k=r.auto){super(g,1);this._parameterStructures=k}get parameterStructures(){return this._parameterStructures}}V.RequestType1=o;class l extends i{constructor(g){super(g,2)}}V.RequestType2=l;class u extends i{constructor(g){super(g,3)}}V.RequestType3=u;class c extends i{constructor(g){super(g,4)}}V.RequestType4=c;class d extends i{constructor(g){super(g,5)}}V.RequestType5=d;class f extends i{constructor(g){super(g,6)}}V.RequestType6=f;class p extends i{constructor(g){super(g,7)}}V.RequestType7=p;class y extends i{constructor(g){super(g,8)}}V.RequestType8=y;class v extends i{constructor(g){super(g,9)}}V.RequestType9=v;class b extends i{constructor(g,k=r.auto){super(g,1);this._parameterStructures=k}get parameterStructures(){return this._parameterStructures}}V.NotificationType=b;class $ extends i{constructor(g){super(g,0)}}V.NotificationType0=$;class w extends i{constructor(g,k=r.auto){super(g,1);this._parameterStructures=k}get parameterStructures(){return this._parameterStructures}}V.NotificationType1=w;class C extends i{constructor(g){super(g,2)}}V.NotificationType2=C;class O extends i{constructor(g){super(g,3)}}V.NotificationType3=O;class Y extends i{constructor(g){super(g,4)}}V.NotificationType4=Y;class q extends i{constructor(g){super(g,5)}}V.NotificationType5=q;class J extends i{constructor(g){super(g,6)}}V.NotificationType6=J;class te extends i{constructor(g){super(g,7)}}V.NotificationType7=te;class ie extends i{constructor(g){super(g,8)}}V.NotificationType8=ie;class ce extends i{constructor(g){super(g,9)}}V.NotificationType9=ce;var L;(function(E){function g(I){const x=I;return x&&t.string(x.method)&&(t.string(x.id)||t.number(x.id))}E.isRequest=g;function k(I){const x=I;return x&&t.string(x.method)&&I.id===void 0}E.isNotification=k;function M(I){const x=I;return x&&(x.result!==void 0||!!x.error)&&(t.string(x.id)||t.number(x.id)||x.id===null)}E.isResponse=M})(L||(V.Message=L={}));return V}var mn={};var Rh;function U$(){if(Rh)return mn;Rh=1;var t;Object.defineProperty(mn,"__esModule",{value:true});mn.LRUCache=mn.LinkedMap=mn.Touch=void 0;var e;(function(i){i.None=0;i.First=1;i.AsOld=i.First;i.Last=2;i.AsNew=i.Last})(e||(mn.Touch=e={}));class n{constructor(){this[t]="LinkedMap";this._map=new Map;this._head=void 0;this._tail=void 0;this._size=0;this._state=0}clear(){this._map.clear();this._head=void 0;this._tail=void 0;this._size=0;this._state++}isEmpty(){return!this._head&&!this._tail}get size(){return this._size}get first(){return this._head?.value}get last(){return this._tail?.value}has(a){return this._map.has(a)}get(a,s=e.None){const o=this._map.get(a);if(!o){return void 0}if(s!==e.None){this.touch(o,s)}return o.value}set(a,s,o=e.None){let l=this._map.get(a);if(l){l.value=s;if(o!==e.None){this.touch(l,o)}}else{l={key:a,value:s,next:void 0,previous:void 0};switch(o){case e.None:this.addItemLast(l);break;case e.First:this.addItemFirst(l);break;case e.Last:this.addItemLast(l);break;default:this.addItemLast(l);break}this._map.set(a,l);this._size++}return this}delete(a){return!!this.remove(a)}remove(a){const s=this._map.get(a);if(!s){return void 0}this._map.delete(a);this.removeItem(s);this._size--;return s.value}shift(){if(!this._head&&!this._tail){return void 0}if(!this._head||!this._tail){throw new Error("Invalid list")}const a=this._head;this._map.delete(a.key);this.removeItem(a);this._size--;return a.value}forEach(a,s){const o=this._state;let l=this._head;while(l){if(s){a.bind(s)(l.value,l.key,this)}else{a(l.value,l.key,this)}if(this._state!==o){throw new Error(`LinkedMap got modified during iteration.`)}l=l.next}}keys(){const a=this._state;let s=this._head;const o={[Symbol.iterator]:()=>{return o},next:()=>{if(this._state!==a){throw new Error(`LinkedMap got modified during iteration.`)}if(s){const l={value:s.key,done:false};s=s.next;return l}else{return{value:void 0,done:true}}}};return o}values(){const a=this._state;let s=this._head;const o={[Symbol.iterator]:()=>{return o},next:()=>{if(this._state!==a){throw new Error(`LinkedMap got modified during iteration.`)}if(s){const l={value:s.value,done:false};s=s.next;return l}else{return{value:void 0,done:true}}}};return o}entries(){const a=this._state;let s=this._head;const o={[Symbol.iterator]:()=>{return o},next:()=>{if(this._state!==a){throw new Error(`LinkedMap got modified during iteration.`)}if(s){const l={value:[s.key,s.value],done:false};s=s.next;return l}else{return{value:void 0,done:true}}}};return o}[(t=Symbol.toStringTag,Symbol.iterator)](){return this.entries()}trimOld(a){if(a>=this.size){return}if(a===0){this.clear();return}let s=this._head;let o=this.size;while(s&&o>a){this._map.delete(s.key);s=s.next;o--}this._head=s;this._size=o;if(s){s.previous=void 0}this._state++}addItemFirst(a){if(!this._head&&!this._tail){this._tail=a}else if(!this._head){throw new Error("Invalid list")}else{a.next=this._head;this._head.previous=a}this._head=a;this._state++}addItemLast(a){if(!this._head&&!this._tail){this._head=a}else if(!this._tail){throw new Error("Invalid list")}else{a.previous=this._tail;this._tail.next=a}this._tail=a;this._state++}removeItem(a){if(a===this._head&&a===this._tail){this._head=void 0;this._tail=void 0}else if(a===this._head){if(!a.next){throw new Error("Invalid list")}a.next.previous=void 0;this._head=a.next}else if(a===this._tail){if(!a.previous){throw new Error("Invalid list")}a.previous.next=void 0;this._tail=a.previous}else{const s=a.next;const o=a.previous;if(!s||!o){throw new Error("Invalid list")}s.previous=o;o.next=s}a.next=void 0;a.previous=void 0;this._state++}touch(a,s){if(!this._head||!this._tail){throw new Error("Invalid list")}if(s!==e.First&&s!==e.Last){return}if(s===e.First){if(a===this._head){return}const o=a.next;const l=a.previous;if(a===this._tail){l.next=void 0;this._tail=l}else{o.previous=l;l.next=o}a.previous=void 0;a.next=this._head;this._head.previous=a;this._head=a;this._state++}else if(s===e.Last){if(a===this._tail){return}const o=a.next;const l=a.previous;if(a===this._head){o.previous=void 0;this._head=o}else{o.previous=l;l.next=o}a.next=void 0;a.previous=this._tail;this._tail.next=a;this._tail=a;this._state++}}toJSON(){const a=[];this.forEach((s,o)=>{a.push([o,s])});return a}fromJSON(a){this.clear();for(const[s,o]of a){this.set(s,o)}}}mn.LinkedMap=n;class r extends n{constructor(a,s=1){super();this._limit=a;this._ratio=Math.min(Math.max(0,s),1)}get limit(){return this._limit}set limit(a){this._limit=a;this.checkTrim()}get ratio(){return this._ratio}set ratio(a){this._ratio=Math.min(Math.max(0,a),1);this.checkTrim()}get(a,s=e.AsNew){return super.get(a,s)}peek(a){return super.get(a,e.None)}set(a,s){super.set(a,s,e.Last);this.checkTrim();return this}checkTrim(){if(this.size>this._limit){this.trimOld(Math.round(this._limit*this._ratio))}}}mn.LRUCache=r;return mn}var li={};var $h;function UP(){if($h)return li;$h=1;Object.defineProperty(li,"__esModule",{value:true});li.Disposable=void 0;var t;(function(e){function n(r){return{dispose:r}}e.create=n})(t||(li.Disposable=t={}));return li}var ir={};var Fs={};var vh;function kr(){if(vh)return Fs;vh=1;Object.defineProperty(Fs,"__esModule",{value:true});let t;function e(){if(t===void 0){throw new Error(`No runtime abstraction layer installed`)}return t}(function(n){function r(i){if(i===void 0){throw new Error(`No runtime abstraction layer provided`)}t=i}n.install=r})(e);Fs.default=e;return Fs}var Th;function ls(){if(Th)return ir;Th=1;Object.defineProperty(ir,"__esModule",{value:true});ir.Emitter=ir.Event=void 0;const t=kr();var e;(function(i){const a={dispose(){}};i.None=function(){return a}})(e||(ir.Event=e={}));class n{add(a,s=null,o){if(!this._callbacks){this._callbacks=[];this._contexts=[]}this._callbacks.push(a);this._contexts.push(s);if(Array.isArray(o)){o.push({dispose:()=>this.remove(a,s)})}}remove(a,s=null){if(!this._callbacks){return}let o=false;for(let l=0,u=this._callbacks.length;l<u;l++){if(this._callbacks[l]===a){if(this._contexts[l]===s){this._callbacks.splice(l,1);this._contexts.splice(l,1);return}else{o=true}}}if(o){throw new Error("When adding a listener with a context, you should remove it with the same context")}}invoke(...a){if(!this._callbacks){return[]}const s=[],o=this._callbacks.slice(0),l=this._contexts.slice(0);for(let u=0,c=o.length;u<c;u++){try{s.push(o[u].apply(l[u],a))}catch(d){(0,t.default)().console.error(d)}}return s}isEmpty(){return!this._callbacks||this._callbacks.length===0}dispose(){this._callbacks=void 0;this._contexts=void 0}}class r{constructor(a){this._options=a}get event(){if(!this._event){this._event=(a,s,o)=>{if(!this._callbacks){this._callbacks=new n}if(this._options&&this._options.onFirstListenerAdd&&this._callbacks.isEmpty()){this._options.onFirstListenerAdd(this)}this._callbacks.add(a,s);const l={dispose:()=>{if(!this._callbacks){return}this._callbacks.remove(a,s);l.dispose=r._noop;if(this._options&&this._options.onLastListenerRemove&&this._callbacks.isEmpty()){this._options.onLastListenerRemove(this)}}};if(Array.isArray(o)){o.push(l)}return l}}return this._event}fire(a){if(this._callbacks){this._callbacks.invoke.call(this._callbacks,a)}}dispose(){if(this._callbacks){this._callbacks.dispose();this._callbacks=void 0}}}ir.Emitter=r;r._noop=function(){};return ir}var ar={};var wh;function Kp(){if(wh)return ar;wh=1;Object.defineProperty(ar,"__esModule",{value:true});ar.CancellationTokenSource=ar.CancellationToken=void 0;const t=kr();const e=os();const n=ls();var r;(function(o){o.None=Object.freeze({isCancellationRequested:false,onCancellationRequested:n.Event.None});o.Cancelled=Object.freeze({isCancellationRequested:true,onCancellationRequested:n.Event.None});function l(u){const c=u;return c&&(c===o.None||c===o.Cancelled||e.boolean(c.isCancellationRequested)&&!!c.onCancellationRequested)}o.is=l})(r||(ar.CancellationToken=r={}));const i=Object.freeze(function(o,l){const u=(0,t.default)().timer.setTimeout(o.bind(l),0);return{dispose(){u.dispose()}}});class a{constructor(){this._isCancelled=false}cancel(){if(!this._isCancelled){this._isCancelled=true;if(this._emitter){this._emitter.fire(void 0);this.dispose()}}}get isCancellationRequested(){return this._isCancelled}get onCancellationRequested(){if(this._isCancelled){return i}if(!this._emitter){this._emitter=new n.Emitter}return this._emitter.event}dispose(){if(this._emitter){this._emitter.dispose();this._emitter=void 0}}}class s{get token(){if(!this._token){this._token=new a}return this._token}cancel(){if(!this._token){this._token=r.Cancelled}else{this._token.cancel()}}dispose(){if(!this._token){this._token=r.None}else if(this._token instanceof a){this._token.dispose()}}}ar.CancellationTokenSource=s;return ar}var sr={};var Eh;function GP(){if(Eh)return sr;Eh=1;Object.defineProperty(sr,"__esModule",{value:true});sr.SharedArrayReceiverStrategy=sr.SharedArraySenderStrategy=void 0;const t=Kp();var e;(function(s){s.Continue=0;s.Cancelled=1})(e||(e={}));class n{constructor(){this.buffers=new Map}enableCancellation(o){if(o.id===null){return}const l=new SharedArrayBuffer(4);const u=new Int32Array(l,0,1);u[0]=e.Continue;this.buffers.set(o.id,l);o.$cancellationData=l}async sendCancellation(o,l){const u=this.buffers.get(l);if(u===void 0){return}const c=new Int32Array(u,0,1);Atomics.store(c,0,e.Cancelled)}cleanup(o){this.buffers.delete(o)}dispose(){this.buffers.clear()}}sr.SharedArraySenderStrategy=n;class r{constructor(o){this.data=new Int32Array(o,0,1)}get isCancellationRequested(){return Atomics.load(this.data,0)===e.Cancelled}get onCancellationRequested(){throw new Error(`Cancellation over SharedArrayBuffer doesn't support cancellation events`)}}class i{constructor(o){this.token=new r(o)}cancel(){}dispose(){}}class a{constructor(){this.kind="request"}createCancellationTokenSource(o){const l=o.$cancellationData;if(l===void 0){return new t.CancellationTokenSource}return new i(l)}}sr.SharedArrayReceiverStrategy=a;return sr}var hn={};var ui={};var Ch;function G$(){if(Ch)return ui;Ch=1;Object.defineProperty(ui,"__esModule",{value:true});ui.Semaphore=void 0;const t=kr();class e{constructor(r=1){if(r<=0){throw new Error("Capacity must be greater than 0")}this._capacity=r;this._active=0;this._waiting=[]}lock(r){return new Promise((i,a)=>{this._waiting.push({thunk:r,resolve:i,reject:a});this.runNext()})}get active(){return this._active}runNext(){if(this._waiting.length===0||this._active===this._capacity){return}(0,t.default)().timer.setImmediate(()=>this.doRunNext())}doRunNext(){if(this._waiting.length===0||this._active===this._capacity){return}const r=this._waiting.shift();this._active++;if(this._active>this._capacity){throw new Error(`To many thunks active`)}try{const i=r.thunk();if(i instanceof Promise){i.then(a=>{this._active--;r.resolve(a);this.runNext()},a=>{this._active--;r.reject(a);this.runNext()})}else{this._active--;r.resolve(i);this.runNext()}}catch(i){this._active--;r.reject(i);this.runNext()}}}ui.Semaphore=e;return ui}var Sh;function HP(){if(Sh)return hn;Sh=1;Object.defineProperty(hn,"__esModule",{value:true});hn.ReadableStreamMessageReader=hn.AbstractMessageReader=hn.MessageReader=void 0;const t=kr();const e=os();const n=ls();const r=G$();var i;(function(l){function u(c){let d=c;return d&&e.func(d.listen)&&e.func(d.dispose)&&e.func(d.onError)&&e.func(d.onClose)&&e.func(d.onPartialMessage)}l.is=u})(i||(hn.MessageReader=i={}));class a{constructor(){this.errorEmitter=new n.Emitter;this.closeEmitter=new n.Emitter;this.partialMessageEmitter=new n.Emitter}dispose(){this.errorEmitter.dispose();this.closeEmitter.dispose()}get onError(){return this.errorEmitter.event}fireError(u){this.errorEmitter.fire(this.asError(u))}get onClose(){return this.closeEmitter.event}fireClose(){this.closeEmitter.fire(void 0)}get onPartialMessage(){return this.partialMessageEmitter.event}firePartialMessage(u){this.partialMessageEmitter.fire(u)}asError(u){if(u instanceof Error){return u}else{return new Error(`Reader received error. Reason: ${e.string(u.message)?u.message:"unknown"}`)}}}hn.AbstractMessageReader=a;var s;(function(l){function u(c){let d;let f;const p=new Map;let y;const v=new Map;if(c===void 0||typeof c==="string"){d=c??"utf-8"}else{d=c.charset??"utf-8";if(c.contentDecoder!==void 0){f=c.contentDecoder;p.set(f.name,f)}if(c.contentDecoders!==void 0){for(const b of c.contentDecoders){p.set(b.name,b)}}if(c.contentTypeDecoder!==void 0){y=c.contentTypeDecoder;v.set(y.name,y)}if(c.contentTypeDecoders!==void 0){for(const b of c.contentTypeDecoders){v.set(b.name,b)}}}if(y===void 0){y=(0,t.default)().applicationJson.decoder;v.set(y.name,y)}return{charset:d,contentDecoder:f,contentDecoders:p,contentTypeDecoder:y,contentTypeDecoders:v}}l.fromOptions=u})(s||(s={}));class o extends a{constructor(u,c){super();this.readable=u;this.options=s.fromOptions(c);this.buffer=(0,t.default)().messageBuffer.create(this.options.charset);this._partialMessageTimeout=1e4;this.nextMessageLength=-1;this.messageToken=0;this.readSemaphore=new r.Semaphore(1)}set partialMessageTimeout(u){this._partialMessageTimeout=u}get partialMessageTimeout(){return this._partialMessageTimeout}listen(u){this.nextMessageLength=-1;this.messageToken=0;this.partialMessageTimer=void 0;this.callback=u;const c=this.readable.onData(d=>{this.onData(d)});this.readable.onError(d=>this.fireError(d));this.readable.onClose(()=>this.fireClose());return c}onData(u){try{this.buffer.append(u);while(true){if(this.nextMessageLength===-1){const d=this.buffer.tryReadHeaders(true);if(!d){return}const f=d.get("content-length");if(!f){this.fireError(new Error(`Header must provide a Content-Length property.
${JSON.stringify(Object.fromEntries(d))}`));return}const p=parseInt(f);if(isNaN(p)){this.fireError(new Error(`Content-Length value must be a number. Got ${f}`));return}this.nextMessageLength=p}const c=this.buffer.tryReadBody(this.nextMessageLength);if(c===void 0){this.setPartialMessageTimer();return}this.clearPartialMessageTimer();this.nextMessageLength=-1;this.readSemaphore.lock(async()=>{const d=this.options.contentDecoder!==void 0?await this.options.contentDecoder.decode(c):c;const f=await this.options.contentTypeDecoder.decode(d,this.options);this.callback(f)}).catch(d=>{this.fireError(d)})}}catch(c){this.fireError(c)}}clearPartialMessageTimer(){if(this.partialMessageTimer){this.partialMessageTimer.dispose();this.partialMessageTimer=void 0}}setPartialMessageTimer(){this.clearPartialMessageTimer();if(this._partialMessageTimeout<=0){return}this.partialMessageTimer=(0,t.default)().timer.setTimeout((u,c)=>{this.partialMessageTimer=void 0;if(u===this.messageToken){this.firePartialMessage({messageToken:u,waitingTime:c});this.setPartialMessageTimer()}},this._partialMessageTimeout,this.messageToken,this._partialMessageTimeout)}}hn.ReadableStreamMessageReader=o;return hn}var yn={};var Ah;function qP(){if(Ah)return yn;Ah=1;Object.defineProperty(yn,"__esModule",{value:true});yn.WriteableStreamMessageWriter=yn.AbstractMessageWriter=yn.MessageWriter=void 0;const t=kr();const e=os();const n=G$();const r=ls();const i="Content-Length: ";const a="\r\n";var s;(function(c){function d(f){let p=f;return p&&e.func(p.dispose)&&e.func(p.onClose)&&e.func(p.onError)&&e.func(p.write)}c.is=d})(s||(yn.MessageWriter=s={}));class o{constructor(){this.errorEmitter=new r.Emitter;this.closeEmitter=new r.Emitter}dispose(){this.errorEmitter.dispose();this.closeEmitter.dispose()}get onError(){return this.errorEmitter.event}fireError(d,f,p){this.errorEmitter.fire([this.asError(d),f,p])}get onClose(){return this.closeEmitter.event}fireClose(){this.closeEmitter.fire(void 0)}asError(d){if(d instanceof Error){return d}else{return new Error(`Writer received error. Reason: ${e.string(d.message)?d.message:"unknown"}`)}}}yn.AbstractMessageWriter=o;var l;(function(c){function d(f){if(f===void 0||typeof f==="string"){return{charset:f??"utf-8",contentTypeEncoder:(0,t.default)().applicationJson.encoder}}else{return{charset:f.charset??"utf-8",contentEncoder:f.contentEncoder,contentTypeEncoder:f.contentTypeEncoder??(0,t.default)().applicationJson.encoder}}}c.fromOptions=d})(l||(l={}));class u extends o{constructor(d,f){super();this.writable=d;this.options=l.fromOptions(f);this.errorCount=0;this.writeSemaphore=new n.Semaphore(1);this.writable.onError(p=>this.fireError(p));this.writable.onClose(()=>this.fireClose())}async write(d){return this.writeSemaphore.lock(async()=>{const f=this.options.contentTypeEncoder.encode(d,this.options).then(p=>{if(this.options.contentEncoder!==void 0){return this.options.contentEncoder.encode(p)}else{return p}});return f.then(p=>{const y=[];y.push(i,p.byteLength.toString(),a);y.push(a);return this.doWrite(d,y,p)},p=>{this.fireError(p);throw p})})}async doWrite(d,f,p){try{await this.writable.write(f.join(""),"ascii");return this.writable.write(p)}catch(y){this.handleError(y,d);return Promise.reject(y)}}handleError(d,f){this.errorCount++;this.fireError(d,f,this.errorCount)}end(){this.writable.end()}}yn.WriteableStreamMessageWriter=u;return yn}var ci={};var bh;function jP(){if(bh)return ci;bh=1;Object.defineProperty(ci,"__esModule",{value:true});ci.AbstractMessageBuffer=void 0;const t=13;const e=10;const n="\r\n";class r{constructor(a="utf-8"){this._encoding=a;this._chunks=[];this._totalLength=0}get encoding(){return this._encoding}append(a){const s=typeof a==="string"?this.fromString(a,this._encoding):a;this._chunks.push(s);this._totalLength+=s.byteLength}tryReadHeaders(a=false){if(this._chunks.length===0){return void 0}let s=0;let o=0;let l=0;let u=0;e:while(o<this._chunks.length){const p=this._chunks[o];l=0;while(l<p.length){const y=p[l];switch(y){case t:switch(s){case 0:s=1;break;case 2:s=3;break;default:s=0}break;case e:switch(s){case 1:s=2;break;case 3:s=4;l++;break e;default:s=0}break;default:s=0}l++}u+=p.byteLength;o++}if(s!==4){return void 0}const c=this._read(u+l);const d=new Map;const f=this.toString(c,"ascii").split(n);if(f.length<2){return d}for(let p=0;p<f.length-2;p++){const y=f[p];const v=y.indexOf(":");if(v===-1){throw new Error(`Message header must separate key and value using ':'
${y}`)}const b=y.substr(0,v);const $=y.substr(v+1).trim();d.set(a?b.toLowerCase():b,$)}return d}tryReadBody(a){if(this._totalLength<a){return void 0}return this._read(a)}get numberOfBytes(){return this._totalLength}_read(a){if(a===0){return this.emptyBuffer()}if(a>this._totalLength){throw new Error(`Cannot read so many bytes!`)}if(this._chunks[0].byteLength===a){const u=this._chunks[0];this._chunks.shift();this._totalLength-=a;return this.asNative(u)}if(this._chunks[0].byteLength>a){const u=this._chunks[0];const c=this.asNative(u,a);this._chunks[0]=u.slice(a);this._totalLength-=a;return c}const s=this.allocNative(a);let o=0;let l=0;while(a>0){const u=this._chunks[l];if(u.byteLength>a){const c=u.slice(0,a);s.set(c,o);o+=a;this._chunks[l]=u.slice(a);this._totalLength-=a;a-=a}else{s.set(u,o);o+=u.byteLength;this._chunks.shift();this._totalLength-=u.byteLength;a-=u.byteLength}}return s}}ci.AbstractMessageBuffer=r;return ci}var Sc={};var kh;function BP(){if(kh)return Sc;kh=1;(function(t){Object.defineProperty(t,"__esModule",{value:true});t.createMessageConnection=t.ConnectionOptions=t.MessageStrategy=t.CancellationStrategy=t.CancellationSenderStrategy=t.CancellationReceiverStrategy=t.RequestCancellationReceiverStrategy=t.IdCancellationReceiverStrategy=t.ConnectionStrategy=t.ConnectionError=t.ConnectionErrors=t.LogTraceNotification=t.SetTraceNotification=t.TraceFormat=t.TraceValues=t.Trace=t.NullLogger=t.ProgressType=t.ProgressToken=void 0;const e=kr();const n=os();const r=F$();const i=U$();const a=ls();const s=Kp();var o;(function(g){g.type=new r.NotificationType("$/cancelRequest")})(o||(o={}));var l;(function(g){function k(M){return typeof M==="string"||typeof M==="number"}g.is=k})(l||(t.ProgressToken=l={}));var u;(function(g){g.type=new r.NotificationType("$/progress")})(u||(u={}));class c{constructor(){}}t.ProgressType=c;var d;(function(g){function k(M){return n.func(M)}g.is=k})(d||(d={}));t.NullLogger=Object.freeze({error:()=>{},warn:()=>{},info:()=>{},log:()=>{}});var f;(function(g){g[g["Off"]=0]="Off";g[g["Messages"]=1]="Messages";g[g["Compact"]=2]="Compact";g[g["Verbose"]=3]="Verbose"})(f||(t.Trace=f={}));var p;(function(g){g.Off="off";g.Messages="messages";g.Compact="compact";g.Verbose="verbose"})(p||(t.TraceValues=p={}));(function(g){function k(I){if(!n.string(I)){return g.Off}I=I.toLowerCase();switch(I){case"off":return g.Off;case"messages":return g.Messages;case"compact":return g.Compact;case"verbose":return g.Verbose;default:return g.Off}}g.fromString=k;function M(I){switch(I){case g.Off:return"off";case g.Messages:return"messages";case g.Compact:return"compact";case g.Verbose:return"verbose";default:return"off"}}g.toString=M})(f||(t.Trace=f={}));var y;(function(g){g["Text"]="text";g["JSON"]="json"})(y||(t.TraceFormat=y={}));(function(g){function k(M){if(!n.string(M)){return g.Text}M=M.toLowerCase();if(M==="json"){return g.JSON}else{return g.Text}}g.fromString=k})(y||(t.TraceFormat=y={}));var v;(function(g){g.type=new r.NotificationType("$/setTrace")})(v||(t.SetTraceNotification=v={}));var b;(function(g){g.type=new r.NotificationType("$/logTrace")})(b||(t.LogTraceNotification=b={}));var $;(function(g){g[g["Closed"]=1]="Closed";g[g["Disposed"]=2]="Disposed";g[g["AlreadyListening"]=3]="AlreadyListening"})($||(t.ConnectionErrors=$={}));class w extends Error{constructor(k,M){super(M);this.code=k;Object.setPrototypeOf(this,w.prototype)}}t.ConnectionError=w;var C;(function(g){function k(M){const I=M;return I&&n.func(I.cancelUndispatched)}g.is=k})(C||(t.ConnectionStrategy=C={}));var O;(function(g){function k(M){const I=M;return I&&(I.kind===void 0||I.kind==="id")&&n.func(I.createCancellationTokenSource)&&(I.dispose===void 0||n.func(I.dispose))}g.is=k})(O||(t.IdCancellationReceiverStrategy=O={}));var Y;(function(g){function k(M){const I=M;return I&&I.kind==="request"&&n.func(I.createCancellationTokenSource)&&(I.dispose===void 0||n.func(I.dispose))}g.is=k})(Y||(t.RequestCancellationReceiverStrategy=Y={}));var q;(function(g){g.Message=Object.freeze({createCancellationTokenSource(M){return new s.CancellationTokenSource}});function k(M){return O.is(M)||Y.is(M)}g.is=k})(q||(t.CancellationReceiverStrategy=q={}));var J;(function(g){g.Message=Object.freeze({sendCancellation(M,I){return M.sendNotification(o.type,{id:I})},cleanup(M){}});function k(M){const I=M;return I&&n.func(I.sendCancellation)&&n.func(I.cleanup)}g.is=k})(J||(t.CancellationSenderStrategy=J={}));var te;(function(g){g.Message=Object.freeze({receiver:q.Message,sender:J.Message});function k(M){const I=M;return I&&q.is(I.receiver)&&J.is(I.sender)}g.is=k})(te||(t.CancellationStrategy=te={}));var ie;(function(g){function k(M){const I=M;return I&&n.func(I.handleMessage)}g.is=k})(ie||(t.MessageStrategy=ie={}));var ce;(function(g){function k(M){const I=M;return I&&(te.is(I.cancellationStrategy)||C.is(I.connectionStrategy)||ie.is(I.messageStrategy))}g.is=k})(ce||(t.ConnectionOptions=ce={}));var L;(function(g){g[g["New"]=1]="New";g[g["Listening"]=2]="Listening";g[g["Closed"]=3]="Closed";g[g["Disposed"]=4]="Disposed"})(L||(L={}));function E(g,k,M,I){const x=M!==void 0?M:t.NullLogger;let we=0;let F=0;let N=0;const ne="2.0";let Et=void 0;const Ct=new Map;let Ee=void 0;const St=new Map;const pe=new Map;let Ne;let He=new i.LinkedMap;let ge=new Map;let j=new Set;let R=new Map;let A=f.Off;let B=y.Text;let S;let de=L.New;const nt=new a.Emitter;const qt=new a.Emitter;const Un=new a.Emitter;const Gn=new a.Emitter;const Hn=new a.Emitter;const yt=I&&I.cancellationStrategy?I.cancellationStrategy:te.Message;function Jt(h){if(h===null){throw new Error(`Can't send requests with id null since the response can't be correlated.`)}return"req-"+h.toString()}function Nr(h){if(h===null){return"res-unknown-"+(++N).toString()}else{return"res-"+h.toString()}}function cn(){return"not-"+(++F).toString()}function dn(h,D){if(r.Message.isRequest(D)){h.set(Jt(D.id),D)}else if(r.Message.isResponse(D)){h.set(Nr(D.id),D)}else{h.set(cn(),D)}}function Qt(h){return void 0}function xt(){return de===L.Listening}function P(){return de===L.Closed}function _(){return de===L.Disposed}function G(){if(de===L.New||de===L.Listening){de=L.Closed;qt.fire(void 0)}}function gt(h){nt.fire([h,void 0,void 0])}function at(h){nt.fire(h)}g.onClose(G);g.onError(gt);k.onClose(G);k.onError(at);function er(){if(Ne||He.size===0){return}Ne=(0,e.default)().timer.setImmediate(()=>{Ne=void 0;us()})}function Qr(h){if(r.Message.isRequest(h)){ds(h)}else if(r.Message.isNotification(h)){ps(h)}else if(r.Message.isResponse(h)){fs(h)}else{ms(h)}}function us(){if(He.size===0){return}const h=He.shift();try{const D=I?.messageStrategy;if(ie.is(D)){D.handleMessage(h,Qr)}else{Qr(h)}}finally{er()}}const cs=h=>{try{if(r.Message.isNotification(h)&&h.method===o.type.method){const D=h.params.id;const K=Jt(D);const W=He.get(K);if(r.Message.isRequest(W)){const me=I?.connectionStrategy;const Pe=me&&me.cancelUndispatched?me.cancelUndispatched(W,Qt):Qt(W);if(Pe&&(Pe.error!==void 0||Pe.result!==void 0)){He.delete(K);R.delete(D);Pe.id=W.id;tr(Pe,h.method,Date.now());k.write(Pe).catch(()=>x.error(`Sending response for canceled message failed.`));return}}const $e=R.get(D);if($e!==void 0){$e.cancel();Pr(h);return}else{j.add(D)}}dn(He,h)}finally{er()}};function ds(h){if(_()){return}function D(ae,Ce,fe){const qe={jsonrpc:ne,id:h.id};if(ae instanceof r.ResponseError){qe.error=ae.toJson()}else{qe.result=ae===void 0?null:ae}tr(qe,Ce,fe);k.write(qe).catch(()=>x.error(`Sending response failed.`))}function K(ae,Ce,fe){const qe={jsonrpc:ne,id:h.id,error:ae.toJson()};tr(qe,Ce,fe);k.write(qe).catch(()=>x.error(`Sending response failed.`))}function W(ae,Ce,fe){if(ae===void 0){ae=null}const qe={jsonrpc:ne,id:h.id,result:ae};tr(qe,Ce,fe);k.write(qe).catch(()=>x.error(`Sending response failed.`))}gs(h);const $e=Ct.get(h.method);let me;let Pe;if($e){me=$e.type;Pe=$e.handler}const xe=Date.now();if(Pe||Et){const ae=h.id??String(Date.now());const Ce=O.is(yt.receiver)?yt.receiver.createCancellationTokenSource(ae):yt.receiver.createCancellationTokenSource(h);if(h.id!==null&&j.has(h.id)){Ce.cancel()}if(h.id!==null){R.set(ae,Ce)}try{let fe;if(Pe){if(h.params===void 0){if(me!==void 0&&me.numberOfParams!==0){K(new r.ResponseError(r.ErrorCodes.InvalidParams,`Request ${h.method} defines ${me.numberOfParams} params but received none.`),h.method,xe);return}fe=Pe(Ce.token)}else if(Array.isArray(h.params)){if(me!==void 0&&me.parameterStructures===r.ParameterStructures.byName){K(new r.ResponseError(r.ErrorCodes.InvalidParams,`Request ${h.method} defines parameters by name but received parameters by position`),h.method,xe);return}fe=Pe(...h.params,Ce.token)}else{if(me!==void 0&&me.parameterStructures===r.ParameterStructures.byPosition){K(new r.ResponseError(r.ErrorCodes.InvalidParams,`Request ${h.method} defines parameters by position but received parameters by name`),h.method,xe);return}fe=Pe(h.params,Ce.token)}}else if(Et){fe=Et(h.method,h.params,Ce.token)}const qe=fe;if(!fe){R.delete(ae);W(fe,h.method,xe)}else if(qe.then){qe.then(st=>{R.delete(ae);D(st,h.method,xe)},st=>{R.delete(ae);if(st instanceof r.ResponseError){K(st,h.method,xe)}else if(st&&n.string(st.message)){K(new r.ResponseError(r.ErrorCodes.InternalError,`Request ${h.method} failed with message: ${st.message}`),h.method,xe)}else{K(new r.ResponseError(r.ErrorCodes.InternalError,`Request ${h.method} failed unexpectedly without providing any details.`),h.method,xe)}})}else{R.delete(ae);D(fe,h.method,xe)}}catch(fe){R.delete(ae);if(fe instanceof r.ResponseError){D(fe,h.method,xe)}else if(fe&&n.string(fe.message)){K(new r.ResponseError(r.ErrorCodes.InternalError,`Request ${h.method} failed with message: ${fe.message}`),h.method,xe)}else{K(new r.ResponseError(r.ErrorCodes.InternalError,`Request ${h.method} failed unexpectedly without providing any details.`),h.method,xe)}}}else{K(new r.ResponseError(r.ErrorCodes.MethodNotFound,`Unhandled method ${h.method}`),h.method,xe)}}function fs(h){if(_()){return}if(h.id===null){if(h.error){x.error(`Received response message without id: Error is: 
${JSON.stringify(h.error,void 0,4)}`)}else{x.error(`Received response message without id. No further error information provided.`)}}else{const D=h.id;const K=ge.get(D);Rs(h,K);if(K!==void 0){ge.delete(D);try{if(h.error){const W=h.error;K.reject(new r.ResponseError(W.code,W.message,W.data))}else if(h.result!==void 0){K.resolve(h.result)}else{throw new Error("Should never happen.")}}catch(W){if(W.message){x.error(`Response handler '${K.method}' failed with message: ${W.message}`)}else{x.error(`Response handler '${K.method}' failed unexpectedly.`)}}}}}function ps(h){if(_()){return}let D=void 0;let K;if(h.method===o.type.method){const W=h.params.id;j.delete(W);Pr(h);return}else{const W=St.get(h.method);if(W){K=W.handler;D=W.type}}if(K||Ee){try{Pr(h);if(K){if(h.params===void 0){if(D!==void 0){if(D.numberOfParams!==0&&D.parameterStructures!==r.ParameterStructures.byName){x.error(`Notification ${h.method} defines ${D.numberOfParams} params but received none.`)}}K()}else if(Array.isArray(h.params)){const W=h.params;if(h.method===u.type.method&&W.length===2&&l.is(W[0])){K({token:W[0],value:W[1]})}else{if(D!==void 0){if(D.parameterStructures===r.ParameterStructures.byName){x.error(`Notification ${h.method} defines parameters by name but received parameters by position`)}if(D.numberOfParams!==h.params.length){x.error(`Notification ${h.method} defines ${D.numberOfParams} params but received ${W.length} arguments`)}}K(...W)}}else{if(D!==void 0&&D.parameterStructures===r.ParameterStructures.byPosition){x.error(`Notification ${h.method} defines parameters by position but received parameters by name`)}K(h.params)}}else if(Ee){Ee(h.method,h.params)}}catch(W){if(W.message){x.error(`Notification handler '${h.method}' failed with message: ${W.message}`)}else{x.error(`Notification handler '${h.method}' failed unexpectedly.`)}}}else{Un.fire(h)}}function ms(h){if(!h){x.error("Received empty message.");return}x.error(`Received message which is neither a response nor a notification message:
${JSON.stringify(h,null,4)}`);const D=h;if(n.string(D.id)||n.number(D.id)){const K=D.id;const W=ge.get(K);if(W){W.reject(new Error("The received response has neither a result nor an error property."))}}}function jt(h){if(h===void 0||h===null){return void 0}switch(A){case f.Verbose:return JSON.stringify(h,null,4);case f.Compact:return JSON.stringify(h);default:return void 0}}function hs(h){if(A===f.Off||!S){return}if(B===y.Text){let D=void 0;if((A===f.Verbose||A===f.Compact)&&h.params){D=`Params: ${jt(h.params)}

`}S.log(`Sending request '${h.method} - (${h.id})'.`,D)}else{fn("send-request",h)}}function ys(h){if(A===f.Off||!S){return}if(B===y.Text){let D=void 0;if(A===f.Verbose||A===f.Compact){if(h.params){D=`Params: ${jt(h.params)}

`}else{D="No parameters provided.\n\n"}}S.log(`Sending notification '${h.method}'.`,D)}else{fn("send-notification",h)}}function tr(h,D,K){if(A===f.Off||!S){return}if(B===y.Text){let W=void 0;if(A===f.Verbose||A===f.Compact){if(h.error&&h.error.data){W=`Error data: ${jt(h.error.data)}

`}else{if(h.result){W=`Result: ${jt(h.result)}

`}else if(h.error===void 0){W="No result returned.\n\n"}}}S.log(`Sending response '${D} - (${h.id})'. Processing request took ${Date.now()-K}ms`,W)}else{fn("send-response",h)}}function gs(h){if(A===f.Off||!S){return}if(B===y.Text){let D=void 0;if((A===f.Verbose||A===f.Compact)&&h.params){D=`Params: ${jt(h.params)}

`}S.log(`Received request '${h.method} - (${h.id})'.`,D)}else{fn("receive-request",h)}}function Pr(h){if(A===f.Off||!S||h.method===b.type.method){return}if(B===y.Text){let D=void 0;if(A===f.Verbose||A===f.Compact){if(h.params){D=`Params: ${jt(h.params)}

`}else{D="No parameters provided.\n\n"}}S.log(`Received notification '${h.method}'.`,D)}else{fn("receive-notification",h)}}function Rs(h,D){if(A===f.Off||!S){return}if(B===y.Text){let K=void 0;if(A===f.Verbose||A===f.Compact){if(h.error&&h.error.data){K=`Error data: ${jt(h.error.data)}

`}else{if(h.result){K=`Result: ${jt(h.result)}

`}else if(h.error===void 0){K="No result returned.\n\n"}}}if(D){const W=h.error?` Request failed: ${h.error.message} (${h.error.code}).`:"";S.log(`Received response '${D.method} - (${h.id})' in ${Date.now()-D.timerStart}ms.${W}`,K)}else{S.log(`Received response ${h.id} without active response promise.`,K)}}else{fn("receive-response",h)}}function fn(h,D){if(!S||A===f.Off){return}const K={isLSPMessage:true,type:h,message:D,timestamp:Date.now()};S.log(K)}function qn(){if(P()){throw new w($.Closed,"Connection is closed.")}if(_()){throw new w($.Disposed,"Connection is disposed.")}}function $s(){if(xt()){throw new w($.AlreadyListening,"Connection is already listening")}}function vs(){if(!xt()){throw new Error("Call listen() first.")}}function jn(h){if(h===void 0){return null}else{return h}}function Zr(h){if(h===null){return void 0}else{return h}}function m(h){return h!==void 0&&h!==null&&!Array.isArray(h)&&typeof h==="object"}function Oe(h,D){switch(h){case r.ParameterStructures.auto:if(m(D)){return Zr(D)}else{return[jn(D)]}case r.ParameterStructures.byName:if(!m(D)){throw new Error(`Received parameters by name but param is not an object literal.`)}return Zr(D);case r.ParameterStructures.byPosition:return[jn(D)];default:throw new Error(`Unknown parameter structure ${h.toString()}`)}}function Le(h,D){let K;const W=h.numberOfParams;switch(W){case 0:K=void 0;break;case 1:K=Oe(h.parameterStructures,D[0]);break;default:K=[];for(let $e=0;$e<D.length&&$e<W;$e++){K.push(jn(D[$e]))}if(D.length<W){for(let $e=D.length;$e<W;$e++){K.push(null)}}break}return K}const ee={sendNotification:(h,...D)=>{qn();let K;let W;if(n.string(h)){K=h;const me=D[0];let Pe=0;let xe=r.ParameterStructures.auto;if(r.ParameterStructures.is(me)){Pe=1;xe=me}let ae=D.length;const Ce=ae-Pe;switch(Ce){case 0:W=void 0;break;case 1:W=Oe(xe,D[Pe]);break;default:if(xe===r.ParameterStructures.byName){throw new Error(`Received ${Ce} parameters for 'by Name' notification parameter structure.`)}W=D.slice(Pe,ae).map(fe=>jn(fe));break}}else{const me=D;K=h.method;W=Le(h,me)}const $e={jsonrpc:ne,method:K,params:W};ys($e);return k.write($e).catch(me=>{x.error(`Sending notification failed.`);throw me})},onNotification:(h,D)=>{qn();let K;if(n.func(h)){Ee=h}else if(D){if(n.string(h)){K=h;St.set(h,{type:void 0,handler:D})}else{K=h.method;St.set(h.method,{type:h,handler:D})}}return{dispose:()=>{if(K!==void 0){St.delete(K)}else{Ee=void 0}}}},onProgress:(h,D,K)=>{if(pe.has(D)){throw new Error(`Progress handler for token ${D} already registered`)}pe.set(D,K);return{dispose:()=>{pe.delete(D)}}},sendProgress:(h,D,K)=>{return ee.sendNotification(u.type,{token:D,value:K})},onUnhandledProgress:Gn.event,sendRequest:(h,...D)=>{qn();vs();let K;let W;let $e=void 0;if(n.string(h)){K=h;const ae=D[0];const Ce=D[D.length-1];let fe=0;let qe=r.ParameterStructures.auto;if(r.ParameterStructures.is(ae)){fe=1;qe=ae}let st=D.length;if(s.CancellationToken.is(Ce)){st=st-1;$e=Ce}const Zt=st-fe;switch(Zt){case 0:W=void 0;break;case 1:W=Oe(qe,D[fe]);break;default:if(qe===r.ParameterStructures.byName){throw new Error(`Received ${Zt} parameters for 'by Name' request parameter structure.`)}W=D.slice(fe,st).map(tv=>jn(tv));break}}else{const ae=D;K=h.method;W=Le(h,ae);const Ce=h.numberOfParams;$e=s.CancellationToken.is(ae[Ce])?ae[Ce]:void 0}const me=we++;let Pe;if($e){Pe=$e.onCancellationRequested(()=>{const ae=yt.sender.sendCancellation(ee,me);if(ae===void 0){x.log(`Received no promise from cancellation strategy when cancelling id ${me}`);return Promise.resolve()}else{return ae.catch(()=>{x.log(`Sending cancellation messages for id ${me} failed`)})}})}const xe={jsonrpc:ne,id:me,method:K,params:W};hs(xe);if(typeof yt.sender.enableCancellation==="function"){yt.sender.enableCancellation(xe)}return new Promise(async(ae,Ce)=>{const fe=Zt=>{ae(Zt);yt.sender.cleanup(me);Pe?.dispose()};const qe=Zt=>{Ce(Zt);yt.sender.cleanup(me);Pe?.dispose()};const st={method:K,timerStart:Date.now(),resolve:fe,reject:qe};try{await k.write(xe);ge.set(me,st)}catch(Zt){x.error(`Sending request failed.`);st.reject(new r.ResponseError(r.ErrorCodes.MessageWriteError,Zt.message?Zt.message:"Unknown reason"));throw Zt}})},onRequest:(h,D)=>{qn();let K=null;if(d.is(h)){K=void 0;Et=h}else if(n.string(h)){K=null;if(D!==void 0){K=h;Ct.set(h,{handler:D,type:void 0})}}else{if(D!==void 0){K=h.method;Ct.set(h.method,{type:h,handler:D})}}return{dispose:()=>{if(K===null){return}if(K!==void 0){Ct.delete(K)}else{Et=void 0}}}},hasPendingResponse:()=>{return ge.size>0},trace:async(h,D,K)=>{let W=false;let $e=y.Text;if(K!==void 0){if(n.boolean(K)){W=K}else{W=K.sendNotification||false;$e=K.traceFormat||y.Text}}A=h;B=$e;if(A===f.Off){S=void 0}else{S=D}if(W&&!P()&&!_()){await ee.sendNotification(v.type,{value:f.toString(h)})}},onError:nt.event,onClose:qt.event,onUnhandledNotification:Un.event,onDispose:Hn.event,end:()=>{k.end()},dispose:()=>{if(_()){return}de=L.Disposed;Hn.fire(void 0);const h=new r.ResponseError(r.ErrorCodes.PendingResponseRejected,"Pending response rejected since connection got disposed");for(const D of ge.values()){D.reject(h)}ge=new Map;R=new Map;j=new Set;He=new i.LinkedMap;if(n.func(k.dispose)){k.dispose()}if(n.func(g.dispose)){g.dispose()}},listen:()=>{qn();$s();de=L.Listening;g.listen(cs)},inspect:()=>{(0,e.default)().console.log("inspect")}};ee.onNotification(b.type,h=>{if(A===f.Off||!S){return}const D=A===f.Verbose||A===f.Compact;S.log(h.message,D?h.verbose:void 0)});ee.onNotification(u.type,h=>{const D=pe.get(h.token);if(D){D(h.value)}else{Gn.fire(h)}});return ee}t.createMessageConnection=E})(Sc);return Sc}var Nh;function Qf(){if(Nh)return Cc;Nh=1;(function(t){Object.defineProperty(t,"__esModule",{value:true});t.ProgressType=t.ProgressToken=t.createMessageConnection=t.NullLogger=t.ConnectionOptions=t.ConnectionStrategy=t.AbstractMessageBuffer=t.WriteableStreamMessageWriter=t.AbstractMessageWriter=t.MessageWriter=t.ReadableStreamMessageReader=t.AbstractMessageReader=t.MessageReader=t.SharedArrayReceiverStrategy=t.SharedArraySenderStrategy=t.CancellationToken=t.CancellationTokenSource=t.Emitter=t.Event=t.Disposable=t.LRUCache=t.Touch=t.LinkedMap=t.ParameterStructures=t.NotificationType9=t.NotificationType8=t.NotificationType7=t.NotificationType6=t.NotificationType5=t.NotificationType4=t.NotificationType3=t.NotificationType2=t.NotificationType1=t.NotificationType0=t.NotificationType=t.ErrorCodes=t.ResponseError=t.RequestType9=t.RequestType8=t.RequestType7=t.RequestType6=t.RequestType5=t.RequestType4=t.RequestType3=t.RequestType2=t.RequestType1=t.RequestType0=t.RequestType=t.Message=t.RAL=void 0;t.MessageStrategy=t.CancellationStrategy=t.CancellationSenderStrategy=t.CancellationReceiverStrategy=t.ConnectionError=t.ConnectionErrors=t.LogTraceNotification=t.SetTraceNotification=t.TraceFormat=t.TraceValues=t.Trace=void 0;const e=F$();Object.defineProperty(t,"Message",{enumerable:true,get:function(){return e.Message}});Object.defineProperty(t,"RequestType",{enumerable:true,get:function(){return e.RequestType}});Object.defineProperty(t,"RequestType0",{enumerable:true,get:function(){return e.RequestType0}});Object.defineProperty(t,"RequestType1",{enumerable:true,get:function(){return e.RequestType1}});Object.defineProperty(t,"RequestType2",{enumerable:true,get:function(){return e.RequestType2}});Object.defineProperty(t,"RequestType3",{enumerable:true,get:function(){return e.RequestType3}});Object.defineProperty(t,"RequestType4",{enumerable:true,get:function(){return e.RequestType4}});Object.defineProperty(t,"RequestType5",{enumerable:true,get:function(){return e.RequestType5}});Object.defineProperty(t,"RequestType6",{enumerable:true,get:function(){return e.RequestType6}});Object.defineProperty(t,"RequestType7",{enumerable:true,get:function(){return e.RequestType7}});Object.defineProperty(t,"RequestType8",{enumerable:true,get:function(){return e.RequestType8}});Object.defineProperty(t,"RequestType9",{enumerable:true,get:function(){return e.RequestType9}});Object.defineProperty(t,"ResponseError",{enumerable:true,get:function(){return e.ResponseError}});Object.defineProperty(t,"ErrorCodes",{enumerable:true,get:function(){return e.ErrorCodes}});Object.defineProperty(t,"NotificationType",{enumerable:true,get:function(){return e.NotificationType}});Object.defineProperty(t,"NotificationType0",{enumerable:true,get:function(){return e.NotificationType0}});Object.defineProperty(t,"NotificationType1",{enumerable:true,get:function(){return e.NotificationType1}});Object.defineProperty(t,"NotificationType2",{enumerable:true,get:function(){return e.NotificationType2}});Object.defineProperty(t,"NotificationType3",{enumerable:true,get:function(){return e.NotificationType3}});Object.defineProperty(t,"NotificationType4",{enumerable:true,get:function(){return e.NotificationType4}});Object.defineProperty(t,"NotificationType5",{enumerable:true,get:function(){return e.NotificationType5}});Object.defineProperty(t,"NotificationType6",{enumerable:true,get:function(){return e.NotificationType6}});Object.defineProperty(t,"NotificationType7",{enumerable:true,get:function(){return e.NotificationType7}});Object.defineProperty(t,"NotificationType8",{enumerable:true,get:function(){return e.NotificationType8}});Object.defineProperty(t,"NotificationType9",{enumerable:true,get:function(){return e.NotificationType9}});Object.defineProperty(t,"ParameterStructures",{enumerable:true,get:function(){return e.ParameterStructures}});const n=U$();Object.defineProperty(t,"LinkedMap",{enumerable:true,get:function(){return n.LinkedMap}});Object.defineProperty(t,"LRUCache",{enumerable:true,get:function(){return n.LRUCache}});Object.defineProperty(t,"Touch",{enumerable:true,get:function(){return n.Touch}});const r=UP();Object.defineProperty(t,"Disposable",{enumerable:true,get:function(){return r.Disposable}});const i=ls();Object.defineProperty(t,"Event",{enumerable:true,get:function(){return i.Event}});Object.defineProperty(t,"Emitter",{enumerable:true,get:function(){return i.Emitter}});const a=Kp();Object.defineProperty(t,"CancellationTokenSource",{enumerable:true,get:function(){return a.CancellationTokenSource}});Object.defineProperty(t,"CancellationToken",{enumerable:true,get:function(){return a.CancellationToken}});const s=GP();Object.defineProperty(t,"SharedArraySenderStrategy",{enumerable:true,get:function(){return s.SharedArraySenderStrategy}});Object.defineProperty(t,"SharedArrayReceiverStrategy",{enumerable:true,get:function(){return s.SharedArrayReceiverStrategy}});const o=HP();Object.defineProperty(t,"MessageReader",{enumerable:true,get:function(){return o.MessageReader}});Object.defineProperty(t,"AbstractMessageReader",{enumerable:true,get:function(){return o.AbstractMessageReader}});Object.defineProperty(t,"ReadableStreamMessageReader",{enumerable:true,get:function(){return o.ReadableStreamMessageReader}});const l=qP();Object.defineProperty(t,"MessageWriter",{enumerable:true,get:function(){return l.MessageWriter}});Object.defineProperty(t,"AbstractMessageWriter",{enumerable:true,get:function(){return l.AbstractMessageWriter}});Object.defineProperty(t,"WriteableStreamMessageWriter",{enumerable:true,get:function(){return l.WriteableStreamMessageWriter}});const u=jP();Object.defineProperty(t,"AbstractMessageBuffer",{enumerable:true,get:function(){return u.AbstractMessageBuffer}});const c=BP();Object.defineProperty(t,"ConnectionStrategy",{enumerable:true,get:function(){return c.ConnectionStrategy}});Object.defineProperty(t,"ConnectionOptions",{enumerable:true,get:function(){return c.ConnectionOptions}});Object.defineProperty(t,"NullLogger",{enumerable:true,get:function(){return c.NullLogger}});Object.defineProperty(t,"createMessageConnection",{enumerable:true,get:function(){return c.createMessageConnection}});Object.defineProperty(t,"ProgressToken",{enumerable:true,get:function(){return c.ProgressToken}});Object.defineProperty(t,"ProgressType",{enumerable:true,get:function(){return c.ProgressType}});Object.defineProperty(t,"Trace",{enumerable:true,get:function(){return c.Trace}});Object.defineProperty(t,"TraceValues",{enumerable:true,get:function(){return c.TraceValues}});Object.defineProperty(t,"TraceFormat",{enumerable:true,get:function(){return c.TraceFormat}});Object.defineProperty(t,"SetTraceNotification",{enumerable:true,get:function(){return c.SetTraceNotification}});Object.defineProperty(t,"LogTraceNotification",{enumerable:true,get:function(){return c.LogTraceNotification}});Object.defineProperty(t,"ConnectionErrors",{enumerable:true,get:function(){return c.ConnectionErrors}});Object.defineProperty(t,"ConnectionError",{enumerable:true,get:function(){return c.ConnectionError}});Object.defineProperty(t,"CancellationReceiverStrategy",{enumerable:true,get:function(){return c.CancellationReceiverStrategy}});Object.defineProperty(t,"CancellationSenderStrategy",{enumerable:true,get:function(){return c.CancellationSenderStrategy}});Object.defineProperty(t,"CancellationStrategy",{enumerable:true,get:function(){return c.CancellationStrategy}});Object.defineProperty(t,"MessageStrategy",{enumerable:true,get:function(){return c.MessageStrategy}});const d=kr();t.RAL=d.default})(Cc);return Cc}var Ph;function WP(){if(Ph)return Ks;Ph=1;Object.defineProperty(Ks,"__esModule",{value:true});const t=Qf();class e extends t.AbstractMessageBuffer{constructor(l="utf-8"){super(l);this.asciiDecoder=new TextDecoder("ascii")}emptyBuffer(){return e.emptyBuffer}fromString(l,u){return new TextEncoder().encode(l)}toString(l,u){if(u==="ascii"){return this.asciiDecoder.decode(l)}else{return new TextDecoder(u).decode(l)}}asNative(l,u){if(u===void 0){return l}else{return l.slice(0,u)}}allocNative(l){return new Uint8Array(l)}}e.emptyBuffer=new Uint8Array(0);class n{constructor(l){this.socket=l;this._onData=new t.Emitter;this._messageListener=u=>{const c=u.data;c.arrayBuffer().then(d=>{this._onData.fire(new Uint8Array(d))},()=>{(0,t.RAL)().console.error(`Converting blob to array buffer failed.`)})};this.socket.addEventListener("message",this._messageListener)}onClose(l){this.socket.addEventListener("close",l);return t.Disposable.create(()=>this.socket.removeEventListener("close",l))}onError(l){this.socket.addEventListener("error",l);return t.Disposable.create(()=>this.socket.removeEventListener("error",l))}onEnd(l){this.socket.addEventListener("end",l);return t.Disposable.create(()=>this.socket.removeEventListener("end",l))}onData(l){return this._onData.event(l)}}class r{constructor(l){this.socket=l}onClose(l){this.socket.addEventListener("close",l);return t.Disposable.create(()=>this.socket.removeEventListener("close",l))}onError(l){this.socket.addEventListener("error",l);return t.Disposable.create(()=>this.socket.removeEventListener("error",l))}onEnd(l){this.socket.addEventListener("end",l);return t.Disposable.create(()=>this.socket.removeEventListener("end",l))}write(l,u){if(typeof l==="string"){if(u!==void 0&&u!=="utf-8"){throw new Error(`In a Browser environments only utf-8 text encoding is supported. But got encoding: ${u}`)}this.socket.send(l)}else{this.socket.send(l)}return Promise.resolve()}end(){this.socket.close()}}const i=new TextEncoder;const a=Object.freeze({messageBuffer:Object.freeze({create:o=>new e(o)}),applicationJson:Object.freeze({encoder:Object.freeze({name:"application/json",encode:(o,l)=>{if(l.charset!=="utf-8"){throw new Error(`In a Browser environments only utf-8 text encoding is supported. But got encoding: ${l.charset}`)}return Promise.resolve(i.encode(JSON.stringify(o,void 0,0)))}}),decoder:Object.freeze({name:"application/json",decode:(o,l)=>{if(!(o instanceof Uint8Array)){throw new Error(`In a Browser environments only Uint8Arrays are supported.`)}return Promise.resolve(JSON.parse(new TextDecoder(l.charset).decode(o)))}})}),stream:Object.freeze({asReadableStream:o=>new n(o),asWritableStream:o=>new r(o)}),console,timer:Object.freeze({setTimeout(o,l,...u){const c=setTimeout(o,l,...u);return{dispose:()=>clearTimeout(c)}},setImmediate(o,...l){const u=setTimeout(o,0,...l);return{dispose:()=>clearTimeout(u)}},setInterval(o,l,...u){const c=setInterval(o,l,...u);return{dispose:()=>clearInterval(c)}}})});function s(){return a}(function(o){function l(){t.RAL.install(a)}o.install=l})(s);Ks.default=s;return Ks}var _h;function Jr(){if(_h)return oi;_h=1;(function(t){var e=oi.__createBinding||(Object.create?function(l,u,c,d){if(d===void 0)d=c;var f=Object.getOwnPropertyDescriptor(u,c);if(!f||("get"in f?!u.__esModule:f.writable||f.configurable)){f={enumerable:true,get:function(){return u[c]}}}Object.defineProperty(l,d,f)}:function(l,u,c,d){if(d===void 0)d=c;l[d]=u[c]});var n=oi.__exportStar||function(l,u){for(var c in l)if(c!=="default"&&!Object.prototype.hasOwnProperty.call(u,c))e(u,l,c)};Object.defineProperty(t,"__esModule",{value:true});t.createMessageConnection=t.BrowserMessageWriter=t.BrowserMessageReader=void 0;const r=WP();r.default.install();const i=Qf();n(Qf(),t);class a extends i.AbstractMessageReader{constructor(u){super();this._onData=new i.Emitter;this._messageListener=c=>{this._onData.fire(c.data)};u.addEventListener("error",c=>this.fireError(c));u.onmessage=this._messageListener}listen(u){return this._onData.event(u)}}t.BrowserMessageReader=a;class s extends i.AbstractMessageWriter{constructor(u){super();this.port=u;this.errorCount=0;u.addEventListener("error",c=>this.fireError(c))}write(u){try{this.port.postMessage(u);return Promise.resolve()}catch(c){this.handleError(c,u);return Promise.reject(c)}}handleError(u,c){this.errorCount++;this.fireError(u,c,this.errorCount)}end(){}}t.BrowserMessageWriter=s;function o(l,u,c,d){if(c===void 0){c=i.NullLogger}if(i.ConnectionStrategy.is(d)){d={connectionStrategy:d}}return(0,i.createMessageConnection)(l,u,c,d)}t.createMessageConnection=o})(oi);return oi}var Ac;var Dh;function Ih(){if(Dh)return Ac;Dh=1;Ac=Jr();return Ac}var di={};var Fp=HN(wN);var ot={};var Oh;function ke(){if(Oh)return ot;Oh=1;Object.defineProperty(ot,"__esModule",{value:true});ot.ProtocolNotificationType=ot.ProtocolNotificationType0=ot.ProtocolRequestType=ot.ProtocolRequestType0=ot.RegistrationType=ot.MessageDirection=void 0;const t=Jr();var e;(function(o){o["clientToServer"]="clientToServer";o["serverToClient"]="serverToClient";o["both"]="both"})(e||(ot.MessageDirection=e={}));class n{constructor(l){this.method=l}}ot.RegistrationType=n;class r extends t.RequestType0{constructor(l){super(l)}}ot.ProtocolRequestType0=r;class i extends t.RequestType{constructor(l){super(l,t.ParameterStructures.byName)}}ot.ProtocolRequestType=i;class a extends t.NotificationType0{constructor(l){super(l)}}ot.ProtocolNotificationType0=a;class s extends t.NotificationType{constructor(l){super(l,t.ParameterStructures.byName)}}ot.ProtocolNotificationType=s;return ot}var bc={};var Me={};var Lh;function Up(){if(Lh)return Me;Lh=1;Object.defineProperty(Me,"__esModule",{value:true});Me.objectLiteral=Me.typedArray=Me.stringArray=Me.array=Me.func=Me.error=Me.number=Me.string=Me.boolean=void 0;function t(u){return u===true||u===false}Me.boolean=t;function e(u){return typeof u==="string"||u instanceof String}Me.string=e;function n(u){return typeof u==="number"||u instanceof Number}Me.number=n;function r(u){return u instanceof Error}Me.error=r;function i(u){return typeof u==="function"}Me.func=i;function a(u){return Array.isArray(u)}Me.array=a;function s(u){return a(u)&&u.every(c=>e(c))}Me.stringArray=s;function o(u,c){return Array.isArray(u)&&u.every(c)}Me.typedArray=o;function l(u){return u!==null&&typeof u==="object"}Me.objectLiteral=l;return Me}var fi={};var xh;function VP(){if(xh)return fi;xh=1;Object.defineProperty(fi,"__esModule",{value:true});fi.ImplementationRequest=void 0;const t=ke();var e;(function(n){n.method="textDocument/implementation";n.messageDirection=t.MessageDirection.clientToServer;n.type=new t.ProtocolRequestType(n.method)})(e||(fi.ImplementationRequest=e={}));return fi}var pi={};var Mh;function zP(){if(Mh)return pi;Mh=1;Object.defineProperty(pi,"__esModule",{value:true});pi.TypeDefinitionRequest=void 0;const t=ke();var e;(function(n){n.method="textDocument/typeDefinition";n.messageDirection=t.MessageDirection.clientToServer;n.type=new t.ProtocolRequestType(n.method)})(e||(pi.TypeDefinitionRequest=e={}));return pi}var or={};var Kh;function XP(){if(Kh)return or;Kh=1;Object.defineProperty(or,"__esModule",{value:true});or.DidChangeWorkspaceFoldersNotification=or.WorkspaceFoldersRequest=void 0;const t=ke();var e;(function(r){r.method="workspace/workspaceFolders";r.messageDirection=t.MessageDirection.serverToClient;r.type=new t.ProtocolRequestType0(r.method)})(e||(or.WorkspaceFoldersRequest=e={}));var n;(function(r){r.method="workspace/didChangeWorkspaceFolders";r.messageDirection=t.MessageDirection.clientToServer;r.type=new t.ProtocolNotificationType(r.method)})(n||(or.DidChangeWorkspaceFoldersNotification=n={}));return or}var mi={};var Fh;function YP(){if(Fh)return mi;Fh=1;Object.defineProperty(mi,"__esModule",{value:true});mi.ConfigurationRequest=void 0;const t=ke();var e;(function(n){n.method="workspace/configuration";n.messageDirection=t.MessageDirection.serverToClient;n.type=new t.ProtocolRequestType(n.method)})(e||(mi.ConfigurationRequest=e={}));return mi}var lr={};var Uh;function JP(){if(Uh)return lr;Uh=1;Object.defineProperty(lr,"__esModule",{value:true});lr.ColorPresentationRequest=lr.DocumentColorRequest=void 0;const t=ke();var e;(function(r){r.method="textDocument/documentColor";r.messageDirection=t.MessageDirection.clientToServer;r.type=new t.ProtocolRequestType(r.method)})(e||(lr.DocumentColorRequest=e={}));var n;(function(r){r.method="textDocument/colorPresentation";r.messageDirection=t.MessageDirection.clientToServer;r.type=new t.ProtocolRequestType(r.method)})(n||(lr.ColorPresentationRequest=n={}));return lr}var ur={};var Gh;function QP(){if(Gh)return ur;Gh=1;Object.defineProperty(ur,"__esModule",{value:true});ur.FoldingRangeRefreshRequest=ur.FoldingRangeRequest=void 0;const t=ke();var e;(function(r){r.method="textDocument/foldingRange";r.messageDirection=t.MessageDirection.clientToServer;r.type=new t.ProtocolRequestType(r.method)})(e||(ur.FoldingRangeRequest=e={}));var n;(function(r){r.method=`workspace/foldingRange/refresh`;r.messageDirection=t.MessageDirection.serverToClient;r.type=new t.ProtocolRequestType0(r.method)})(n||(ur.FoldingRangeRefreshRequest=n={}));return ur}var hi={};var Hh;function ZP(){if(Hh)return hi;Hh=1;Object.defineProperty(hi,"__esModule",{value:true});hi.DeclarationRequest=void 0;const t=ke();var e;(function(n){n.method="textDocument/declaration";n.messageDirection=t.MessageDirection.clientToServer;n.type=new t.ProtocolRequestType(n.method)})(e||(hi.DeclarationRequest=e={}));return hi}var yi={};var qh;function e_(){if(qh)return yi;qh=1;Object.defineProperty(yi,"__esModule",{value:true});yi.SelectionRangeRequest=void 0;const t=ke();var e;(function(n){n.method="textDocument/selectionRange";n.messageDirection=t.MessageDirection.clientToServer;n.type=new t.ProtocolRequestType(n.method)})(e||(yi.SelectionRangeRequest=e={}));return yi}var gn={};var jh;function t_(){if(jh)return gn;jh=1;Object.defineProperty(gn,"__esModule",{value:true});gn.WorkDoneProgressCancelNotification=gn.WorkDoneProgressCreateRequest=gn.WorkDoneProgress=void 0;const t=Jr();const e=ke();var n;(function(a){a.type=new t.ProgressType;function s(o){return o===a.type}a.is=s})(n||(gn.WorkDoneProgress=n={}));var r;(function(a){a.method="window/workDoneProgress/create";a.messageDirection=e.MessageDirection.serverToClient;a.type=new e.ProtocolRequestType(a.method)})(r||(gn.WorkDoneProgressCreateRequest=r={}));var i;(function(a){a.method="window/workDoneProgress/cancel";a.messageDirection=e.MessageDirection.clientToServer;a.type=new e.ProtocolNotificationType(a.method)})(i||(gn.WorkDoneProgressCancelNotification=i={}));return gn}var Rn={};var Bh;function n_(){if(Bh)return Rn;Bh=1;Object.defineProperty(Rn,"__esModule",{value:true});Rn.CallHierarchyOutgoingCallsRequest=Rn.CallHierarchyIncomingCallsRequest=Rn.CallHierarchyPrepareRequest=void 0;const t=ke();var e;(function(i){i.method="textDocument/prepareCallHierarchy";i.messageDirection=t.MessageDirection.clientToServer;i.type=new t.ProtocolRequestType(i.method)})(e||(Rn.CallHierarchyPrepareRequest=e={}));var n;(function(i){i.method="callHierarchy/incomingCalls";i.messageDirection=t.MessageDirection.clientToServer;i.type=new t.ProtocolRequestType(i.method)})(n||(Rn.CallHierarchyIncomingCallsRequest=n={}));var r;(function(i){i.method="callHierarchy/outgoingCalls";i.messageDirection=t.MessageDirection.clientToServer;i.type=new t.ProtocolRequestType(i.method)})(r||(Rn.CallHierarchyOutgoingCallsRequest=r={}));return Rn}var lt={};var Wh;function r_(){if(Wh)return lt;Wh=1;Object.defineProperty(lt,"__esModule",{value:true});lt.SemanticTokensRefreshRequest=lt.SemanticTokensRangeRequest=lt.SemanticTokensDeltaRequest=lt.SemanticTokensRequest=lt.SemanticTokensRegistrationType=lt.TokenFormat=void 0;const t=ke();var e;(function(o){o.Relative="relative"})(e||(lt.TokenFormat=e={}));var n;(function(o){o.method="textDocument/semanticTokens";o.type=new t.RegistrationType(o.method)})(n||(lt.SemanticTokensRegistrationType=n={}));var r;(function(o){o.method="textDocument/semanticTokens/full";o.messageDirection=t.MessageDirection.clientToServer;o.type=new t.ProtocolRequestType(o.method);o.registrationMethod=n.method})(r||(lt.SemanticTokensRequest=r={}));var i;(function(o){o.method="textDocument/semanticTokens/full/delta";o.messageDirection=t.MessageDirection.clientToServer;o.type=new t.ProtocolRequestType(o.method);o.registrationMethod=n.method})(i||(lt.SemanticTokensDeltaRequest=i={}));var a;(function(o){o.method="textDocument/semanticTokens/range";o.messageDirection=t.MessageDirection.clientToServer;o.type=new t.ProtocolRequestType(o.method);o.registrationMethod=n.method})(a||(lt.SemanticTokensRangeRequest=a={}));var s;(function(o){o.method=`workspace/semanticTokens/refresh`;o.messageDirection=t.MessageDirection.serverToClient;o.type=new t.ProtocolRequestType0(o.method)})(s||(lt.SemanticTokensRefreshRequest=s={}));return lt}var gi={};var Vh;function i_(){if(Vh)return gi;Vh=1;Object.defineProperty(gi,"__esModule",{value:true});gi.ShowDocumentRequest=void 0;const t=ke();var e;(function(n){n.method="window/showDocument";n.messageDirection=t.MessageDirection.serverToClient;n.type=new t.ProtocolRequestType(n.method)})(e||(gi.ShowDocumentRequest=e={}));return gi}var Ri={};var zh;function a_(){if(zh)return Ri;zh=1;Object.defineProperty(Ri,"__esModule",{value:true});Ri.LinkedEditingRangeRequest=void 0;const t=ke();var e;(function(n){n.method="textDocument/linkedEditingRange";n.messageDirection=t.MessageDirection.clientToServer;n.type=new t.ProtocolRequestType(n.method)})(e||(Ri.LinkedEditingRangeRequest=e={}));return Ri}var Xe={};var Xh;function s_(){if(Xh)return Xe;Xh=1;Object.defineProperty(Xe,"__esModule",{value:true});Xe.WillDeleteFilesRequest=Xe.DidDeleteFilesNotification=Xe.DidRenameFilesNotification=Xe.WillRenameFilesRequest=Xe.DidCreateFilesNotification=Xe.WillCreateFilesRequest=Xe.FileOperationPatternKind=void 0;const t=ke();var e;(function(l){l.file="file";l.folder="folder"})(e||(Xe.FileOperationPatternKind=e={}));var n;(function(l){l.method="workspace/willCreateFiles";l.messageDirection=t.MessageDirection.clientToServer;l.type=new t.ProtocolRequestType(l.method)})(n||(Xe.WillCreateFilesRequest=n={}));var r;(function(l){l.method="workspace/didCreateFiles";l.messageDirection=t.MessageDirection.clientToServer;l.type=new t.ProtocolNotificationType(l.method)})(r||(Xe.DidCreateFilesNotification=r={}));var i;(function(l){l.method="workspace/willRenameFiles";l.messageDirection=t.MessageDirection.clientToServer;l.type=new t.ProtocolRequestType(l.method)})(i||(Xe.WillRenameFilesRequest=i={}));var a;(function(l){l.method="workspace/didRenameFiles";l.messageDirection=t.MessageDirection.clientToServer;l.type=new t.ProtocolNotificationType(l.method)})(a||(Xe.DidRenameFilesNotification=a={}));var s;(function(l){l.method="workspace/didDeleteFiles";l.messageDirection=t.MessageDirection.clientToServer;l.type=new t.ProtocolNotificationType(l.method)})(s||(Xe.DidDeleteFilesNotification=s={}));var o;(function(l){l.method="workspace/willDeleteFiles";l.messageDirection=t.MessageDirection.clientToServer;l.type=new t.ProtocolRequestType(l.method)})(o||(Xe.WillDeleteFilesRequest=o={}));return Xe}var $n={};var Yh;function o_(){if(Yh)return $n;Yh=1;Object.defineProperty($n,"__esModule",{value:true});$n.MonikerRequest=$n.MonikerKind=$n.UniquenessLevel=void 0;const t=ke();var e;(function(i){i.document="document";i.project="project";i.group="group";i.scheme="scheme";i.global="global"})(e||($n.UniquenessLevel=e={}));var n;(function(i){i.$import="import";i.$export="export";i.local="local"})(n||($n.MonikerKind=n={}));var r;(function(i){i.method="textDocument/moniker";i.messageDirection=t.MessageDirection.clientToServer;i.type=new t.ProtocolRequestType(i.method)})(r||($n.MonikerRequest=r={}));return $n}var vn={};var Jh;function l_(){if(Jh)return vn;Jh=1;Object.defineProperty(vn,"__esModule",{value:true});vn.TypeHierarchySubtypesRequest=vn.TypeHierarchySupertypesRequest=vn.TypeHierarchyPrepareRequest=void 0;const t=ke();var e;(function(i){i.method="textDocument/prepareTypeHierarchy";i.messageDirection=t.MessageDirection.clientToServer;i.type=new t.ProtocolRequestType(i.method)})(e||(vn.TypeHierarchyPrepareRequest=e={}));var n;(function(i){i.method="typeHierarchy/supertypes";i.messageDirection=t.MessageDirection.clientToServer;i.type=new t.ProtocolRequestType(i.method)})(n||(vn.TypeHierarchySupertypesRequest=n={}));var r;(function(i){i.method="typeHierarchy/subtypes";i.messageDirection=t.MessageDirection.clientToServer;i.type=new t.ProtocolRequestType(i.method)})(r||(vn.TypeHierarchySubtypesRequest=r={}));return vn}var cr={};var Qh;function u_(){if(Qh)return cr;Qh=1;Object.defineProperty(cr,"__esModule",{value:true});cr.InlineValueRefreshRequest=cr.InlineValueRequest=void 0;const t=ke();var e;(function(r){r.method="textDocument/inlineValue";r.messageDirection=t.MessageDirection.clientToServer;r.type=new t.ProtocolRequestType(r.method)})(e||(cr.InlineValueRequest=e={}));var n;(function(r){r.method=`workspace/inlineValue/refresh`;r.messageDirection=t.MessageDirection.serverToClient;r.type=new t.ProtocolRequestType0(r.method)})(n||(cr.InlineValueRefreshRequest=n={}));return cr}var Tn={};var Zh;function c_(){if(Zh)return Tn;Zh=1;Object.defineProperty(Tn,"__esModule",{value:true});Tn.InlayHintRefreshRequest=Tn.InlayHintResolveRequest=Tn.InlayHintRequest=void 0;const t=ke();var e;(function(i){i.method="textDocument/inlayHint";i.messageDirection=t.MessageDirection.clientToServer;i.type=new t.ProtocolRequestType(i.method)})(e||(Tn.InlayHintRequest=e={}));var n;(function(i){i.method="inlayHint/resolve";i.messageDirection=t.MessageDirection.clientToServer;i.type=new t.ProtocolRequestType(i.method)})(n||(Tn.InlayHintResolveRequest=n={}));var r;(function(i){i.method=`workspace/inlayHint/refresh`;i.messageDirection=t.MessageDirection.serverToClient;i.type=new t.ProtocolRequestType0(i.method)})(r||(Tn.InlayHintRefreshRequest=r={}));return Tn}var At={};var ey;function d_(){if(ey)return At;ey=1;Object.defineProperty(At,"__esModule",{value:true});At.DiagnosticRefreshRequest=At.WorkspaceDiagnosticRequest=At.DocumentDiagnosticRequest=At.DocumentDiagnosticReportKind=At.DiagnosticServerCancellationData=void 0;const t=Jr();const e=Up();const n=ke();var r;(function(l){function u(c){const d=c;return d&&e.boolean(d.retriggerRequest)}l.is=u})(r||(At.DiagnosticServerCancellationData=r={}));var i;(function(l){l.Full="full";l.Unchanged="unchanged"})(i||(At.DocumentDiagnosticReportKind=i={}));var a;(function(l){l.method="textDocument/diagnostic";l.messageDirection=n.MessageDirection.clientToServer;l.type=new n.ProtocolRequestType(l.method);l.partialResult=new t.ProgressType})(a||(At.DocumentDiagnosticRequest=a={}));var s;(function(l){l.method="workspace/diagnostic";l.messageDirection=n.MessageDirection.clientToServer;l.type=new n.ProtocolRequestType(l.method);l.partialResult=new t.ProgressType})(s||(At.WorkspaceDiagnosticRequest=s={}));var o;(function(l){l.method=`workspace/diagnostic/refresh`;l.messageDirection=n.MessageDirection.serverToClient;l.type=new n.ProtocolRequestType0(l.method)})(o||(At.DiagnosticRefreshRequest=o={}));return At}var Se={};var ty;function f_(){if(ty)return Se;ty=1;Object.defineProperty(Se,"__esModule",{value:true});Se.DidCloseNotebookDocumentNotification=Se.DidSaveNotebookDocumentNotification=Se.DidChangeNotebookDocumentNotification=Se.NotebookCellArrayChange=Se.DidOpenNotebookDocumentNotification=Se.NotebookDocumentSyncRegistrationType=Se.NotebookDocument=Se.NotebookCell=Se.ExecutionSummary=Se.NotebookCellKind=void 0;const t=Fp;const e=Up();const n=ke();var r;(function(p){p.Markup=1;p.Code=2;function y(v){return v===1||v===2}p.is=y})(r||(Se.NotebookCellKind=r={}));var i;(function(p){function y($,w){const C={executionOrder:$};if(w===true||w===false){C.success=w}return C}p.create=y;function v($){const w=$;return e.objectLiteral(w)&&t.uinteger.is(w.executionOrder)&&(w.success===void 0||e.boolean(w.success))}p.is=v;function b($,w){if($===w){return true}if($===null||$===void 0||w===null||w===void 0){return false}return $.executionOrder===w.executionOrder&&$.success===w.success}p.equals=b})(i||(Se.ExecutionSummary=i={}));var a;(function(p){function y(w,C){return{kind:w,document:C}}p.create=y;function v(w){const C=w;return e.objectLiteral(C)&&r.is(C.kind)&&t.DocumentUri.is(C.document)&&(C.metadata===void 0||e.objectLiteral(C.metadata))}p.is=v;function b(w,C){const O=new Set;if(w.document!==C.document){O.add("document")}if(w.kind!==C.kind){O.add("kind")}if(w.executionSummary!==C.executionSummary){O.add("executionSummary")}if((w.metadata!==void 0||C.metadata!==void 0)&&!$(w.metadata,C.metadata)){O.add("metadata")}if((w.executionSummary!==void 0||C.executionSummary!==void 0)&&!i.equals(w.executionSummary,C.executionSummary)){O.add("executionSummary")}return O}p.diff=b;function $(w,C){if(w===C){return true}if(w===null||w===void 0||C===null||C===void 0){return false}if(typeof w!==typeof C){return false}if(typeof w!=="object"){return false}const O=Array.isArray(w);const Y=Array.isArray(C);if(O!==Y){return false}if(O&&Y){if(w.length!==C.length){return false}for(let q=0;q<w.length;q++){if(!$(w[q],C[q])){return false}}}if(e.objectLiteral(w)&&e.objectLiteral(C)){const q=Object.keys(w);const J=Object.keys(C);if(q.length!==J.length){return false}q.sort();J.sort();if(!$(q,J)){return false}for(let te=0;te<q.length;te++){const ie=q[te];if(!$(w[ie],C[ie])){return false}}}return true}})(a||(Se.NotebookCell=a={}));var s;(function(p){function y(b,$,w,C){return{uri:b,notebookType:$,version:w,cells:C}}p.create=y;function v(b){const $=b;return e.objectLiteral($)&&e.string($.uri)&&t.integer.is($.version)&&e.typedArray($.cells,a.is)}p.is=v})(s||(Se.NotebookDocument=s={}));var o;(function(p){p.method="notebookDocument/sync";p.messageDirection=n.MessageDirection.clientToServer;p.type=new n.RegistrationType(p.method)})(o||(Se.NotebookDocumentSyncRegistrationType=o={}));var l;(function(p){p.method="notebookDocument/didOpen";p.messageDirection=n.MessageDirection.clientToServer;p.type=new n.ProtocolNotificationType(p.method);p.registrationMethod=o.method})(l||(Se.DidOpenNotebookDocumentNotification=l={}));var u;(function(p){function y(b){const $=b;return e.objectLiteral($)&&t.uinteger.is($.start)&&t.uinteger.is($.deleteCount)&&($.cells===void 0||e.typedArray($.cells,a.is))}p.is=y;function v(b,$,w){const C={start:b,deleteCount:$};if(w!==void 0){C.cells=w}return C}p.create=v})(u||(Se.NotebookCellArrayChange=u={}));var c;(function(p){p.method="notebookDocument/didChange";p.messageDirection=n.MessageDirection.clientToServer;p.type=new n.ProtocolNotificationType(p.method);p.registrationMethod=o.method})(c||(Se.DidChangeNotebookDocumentNotification=c={}));var d;(function(p){p.method="notebookDocument/didSave";p.messageDirection=n.MessageDirection.clientToServer;p.type=new n.ProtocolNotificationType(p.method);p.registrationMethod=o.method})(d||(Se.DidSaveNotebookDocumentNotification=d={}));var f;(function(p){p.method="notebookDocument/didClose";p.messageDirection=n.MessageDirection.clientToServer;p.type=new n.ProtocolNotificationType(p.method);p.registrationMethod=o.method})(f||(Se.DidCloseNotebookDocumentNotification=f={}));return Se}var $i={};var ny;function p_(){if(ny)return $i;ny=1;Object.defineProperty($i,"__esModule",{value:true});$i.InlineCompletionRequest=void 0;const t=ke();var e;(function(n){n.method="textDocument/inlineCompletion";n.messageDirection=t.MessageDirection.clientToServer;n.type=new t.ProtocolRequestType(n.method)})(e||($i.InlineCompletionRequest=e={}));return $i}var ry;function m_(){if(ry)return bc;ry=1;(function(t){Object.defineProperty(t,"__esModule",{value:true});t.WorkspaceSymbolRequest=t.CodeActionResolveRequest=t.CodeActionRequest=t.DocumentSymbolRequest=t.DocumentHighlightRequest=t.ReferencesRequest=t.DefinitionRequest=t.SignatureHelpRequest=t.SignatureHelpTriggerKind=t.HoverRequest=t.CompletionResolveRequest=t.CompletionRequest=t.CompletionTriggerKind=t.PublishDiagnosticsNotification=t.WatchKind=t.RelativePattern=t.FileChangeType=t.DidChangeWatchedFilesNotification=t.WillSaveTextDocumentWaitUntilRequest=t.WillSaveTextDocumentNotification=t.TextDocumentSaveReason=t.DidSaveTextDocumentNotification=t.DidCloseTextDocumentNotification=t.DidChangeTextDocumentNotification=t.TextDocumentContentChangeEvent=t.DidOpenTextDocumentNotification=t.TextDocumentSyncKind=t.TelemetryEventNotification=t.LogMessageNotification=t.ShowMessageRequest=t.ShowMessageNotification=t.MessageType=t.DidChangeConfigurationNotification=t.ExitNotification=t.ShutdownRequest=t.InitializedNotification=t.InitializeErrorCodes=t.InitializeRequest=t.WorkDoneProgressOptions=t.TextDocumentRegistrationOptions=t.StaticRegistrationOptions=t.PositionEncodingKind=t.FailureHandlingKind=t.ResourceOperationKind=t.UnregistrationRequest=t.RegistrationRequest=t.DocumentSelector=t.NotebookCellTextDocumentFilter=t.NotebookDocumentFilter=t.TextDocumentFilter=void 0;t.MonikerRequest=t.MonikerKind=t.UniquenessLevel=t.WillDeleteFilesRequest=t.DidDeleteFilesNotification=t.WillRenameFilesRequest=t.DidRenameFilesNotification=t.WillCreateFilesRequest=t.DidCreateFilesNotification=t.FileOperationPatternKind=t.LinkedEditingRangeRequest=t.ShowDocumentRequest=t.SemanticTokensRegistrationType=t.SemanticTokensRefreshRequest=t.SemanticTokensRangeRequest=t.SemanticTokensDeltaRequest=t.SemanticTokensRequest=t.TokenFormat=t.CallHierarchyPrepareRequest=t.CallHierarchyOutgoingCallsRequest=t.CallHierarchyIncomingCallsRequest=t.WorkDoneProgressCancelNotification=t.WorkDoneProgressCreateRequest=t.WorkDoneProgress=t.SelectionRangeRequest=t.DeclarationRequest=t.FoldingRangeRefreshRequest=t.FoldingRangeRequest=t.ColorPresentationRequest=t.DocumentColorRequest=t.ConfigurationRequest=t.DidChangeWorkspaceFoldersNotification=t.WorkspaceFoldersRequest=t.TypeDefinitionRequest=t.ImplementationRequest=t.ApplyWorkspaceEditRequest=t.ExecuteCommandRequest=t.PrepareRenameRequest=t.RenameRequest=t.PrepareSupportDefaultBehavior=t.DocumentOnTypeFormattingRequest=t.DocumentRangesFormattingRequest=t.DocumentRangeFormattingRequest=t.DocumentFormattingRequest=t.DocumentLinkResolveRequest=t.DocumentLinkRequest=t.CodeLensRefreshRequest=t.CodeLensResolveRequest=t.CodeLensRequest=t.WorkspaceSymbolResolveRequest=void 0;t.InlineCompletionRequest=t.DidCloseNotebookDocumentNotification=t.DidSaveNotebookDocumentNotification=t.DidChangeNotebookDocumentNotification=t.NotebookCellArrayChange=t.DidOpenNotebookDocumentNotification=t.NotebookDocumentSyncRegistrationType=t.NotebookDocument=t.NotebookCell=t.ExecutionSummary=t.NotebookCellKind=t.DiagnosticRefreshRequest=t.WorkspaceDiagnosticRequest=t.DocumentDiagnosticRequest=t.DocumentDiagnosticReportKind=t.DiagnosticServerCancellationData=t.InlayHintRefreshRequest=t.InlayHintResolveRequest=t.InlayHintRequest=t.InlineValueRefreshRequest=t.InlineValueRequest=t.TypeHierarchySupertypesRequest=t.TypeHierarchySubtypesRequest=t.TypeHierarchyPrepareRequest=void 0;const e=ke();const n=Fp;const r=Up();const i=VP();Object.defineProperty(t,"ImplementationRequest",{enumerable:true,get:function(){return i.ImplementationRequest}});const a=zP();Object.defineProperty(t,"TypeDefinitionRequest",{enumerable:true,get:function(){return a.TypeDefinitionRequest}});const s=XP();Object.defineProperty(t,"WorkspaceFoldersRequest",{enumerable:true,get:function(){return s.WorkspaceFoldersRequest}});Object.defineProperty(t,"DidChangeWorkspaceFoldersNotification",{enumerable:true,get:function(){return s.DidChangeWorkspaceFoldersNotification}});const o=YP();Object.defineProperty(t,"ConfigurationRequest",{enumerable:true,get:function(){return o.ConfigurationRequest}});const l=JP();Object.defineProperty(t,"DocumentColorRequest",{enumerable:true,get:function(){return l.DocumentColorRequest}});Object.defineProperty(t,"ColorPresentationRequest",{enumerable:true,get:function(){return l.ColorPresentationRequest}});const u=QP();Object.defineProperty(t,"FoldingRangeRequest",{enumerable:true,get:function(){return u.FoldingRangeRequest}});Object.defineProperty(t,"FoldingRangeRefreshRequest",{enumerable:true,get:function(){return u.FoldingRangeRefreshRequest}});const c=ZP();Object.defineProperty(t,"DeclarationRequest",{enumerable:true,get:function(){return c.DeclarationRequest}});const d=e_();Object.defineProperty(t,"SelectionRangeRequest",{enumerable:true,get:function(){return d.SelectionRangeRequest}});const f=t_();Object.defineProperty(t,"WorkDoneProgress",{enumerable:true,get:function(){return f.WorkDoneProgress}});Object.defineProperty(t,"WorkDoneProgressCreateRequest",{enumerable:true,get:function(){return f.WorkDoneProgressCreateRequest}});Object.defineProperty(t,"WorkDoneProgressCancelNotification",{enumerable:true,get:function(){return f.WorkDoneProgressCancelNotification}});const p=n_();Object.defineProperty(t,"CallHierarchyIncomingCallsRequest",{enumerable:true,get:function(){return p.CallHierarchyIncomingCallsRequest}});Object.defineProperty(t,"CallHierarchyOutgoingCallsRequest",{enumerable:true,get:function(){return p.CallHierarchyOutgoingCallsRequest}});Object.defineProperty(t,"CallHierarchyPrepareRequest",{enumerable:true,get:function(){return p.CallHierarchyPrepareRequest}});const y=r_();Object.defineProperty(t,"TokenFormat",{enumerable:true,get:function(){return y.TokenFormat}});Object.defineProperty(t,"SemanticTokensRequest",{enumerable:true,get:function(){return y.SemanticTokensRequest}});Object.defineProperty(t,"SemanticTokensDeltaRequest",{enumerable:true,get:function(){return y.SemanticTokensDeltaRequest}});Object.defineProperty(t,"SemanticTokensRangeRequest",{enumerable:true,get:function(){return y.SemanticTokensRangeRequest}});Object.defineProperty(t,"SemanticTokensRefreshRequest",{enumerable:true,get:function(){return y.SemanticTokensRefreshRequest}});Object.defineProperty(t,"SemanticTokensRegistrationType",{enumerable:true,get:function(){return y.SemanticTokensRegistrationType}});const v=i_();Object.defineProperty(t,"ShowDocumentRequest",{enumerable:true,get:function(){return v.ShowDocumentRequest}});const b=a_();Object.defineProperty(t,"LinkedEditingRangeRequest",{enumerable:true,get:function(){return b.LinkedEditingRangeRequest}});const $=s_();Object.defineProperty(t,"FileOperationPatternKind",{enumerable:true,get:function(){return $.FileOperationPatternKind}});Object.defineProperty(t,"DidCreateFilesNotification",{enumerable:true,get:function(){return $.DidCreateFilesNotification}});Object.defineProperty(t,"WillCreateFilesRequest",{enumerable:true,get:function(){return $.WillCreateFilesRequest}});Object.defineProperty(t,"DidRenameFilesNotification",{enumerable:true,get:function(){return $.DidRenameFilesNotification}});Object.defineProperty(t,"WillRenameFilesRequest",{enumerable:true,get:function(){return $.WillRenameFilesRequest}});Object.defineProperty(t,"DidDeleteFilesNotification",{enumerable:true,get:function(){return $.DidDeleteFilesNotification}});Object.defineProperty(t,"WillDeleteFilesRequest",{enumerable:true,get:function(){return $.WillDeleteFilesRequest}});const w=o_();Object.defineProperty(t,"UniquenessLevel",{enumerable:true,get:function(){return w.UniquenessLevel}});Object.defineProperty(t,"MonikerKind",{enumerable:true,get:function(){return w.MonikerKind}});Object.defineProperty(t,"MonikerRequest",{enumerable:true,get:function(){return w.MonikerRequest}});const C=l_();Object.defineProperty(t,"TypeHierarchyPrepareRequest",{enumerable:true,get:function(){return C.TypeHierarchyPrepareRequest}});Object.defineProperty(t,"TypeHierarchySubtypesRequest",{enumerable:true,get:function(){return C.TypeHierarchySubtypesRequest}});Object.defineProperty(t,"TypeHierarchySupertypesRequest",{enumerable:true,get:function(){return C.TypeHierarchySupertypesRequest}});const O=u_();Object.defineProperty(t,"InlineValueRequest",{enumerable:true,get:function(){return O.InlineValueRequest}});Object.defineProperty(t,"InlineValueRefreshRequest",{enumerable:true,get:function(){return O.InlineValueRefreshRequest}});const Y=c_();Object.defineProperty(t,"InlayHintRequest",{enumerable:true,get:function(){return Y.InlayHintRequest}});Object.defineProperty(t,"InlayHintResolveRequest",{enumerable:true,get:function(){return Y.InlayHintResolveRequest}});Object.defineProperty(t,"InlayHintRefreshRequest",{enumerable:true,get:function(){return Y.InlayHintRefreshRequest}});const q=d_();Object.defineProperty(t,"DiagnosticServerCancellationData",{enumerable:true,get:function(){return q.DiagnosticServerCancellationData}});Object.defineProperty(t,"DocumentDiagnosticReportKind",{enumerable:true,get:function(){return q.DocumentDiagnosticReportKind}});Object.defineProperty(t,"DocumentDiagnosticRequest",{enumerable:true,get:function(){return q.DocumentDiagnosticRequest}});Object.defineProperty(t,"WorkspaceDiagnosticRequest",{enumerable:true,get:function(){return q.WorkspaceDiagnosticRequest}});Object.defineProperty(t,"DiagnosticRefreshRequest",{enumerable:true,get:function(){return q.DiagnosticRefreshRequest}});const J=f_();Object.defineProperty(t,"NotebookCellKind",{enumerable:true,get:function(){return J.NotebookCellKind}});Object.defineProperty(t,"ExecutionSummary",{enumerable:true,get:function(){return J.ExecutionSummary}});Object.defineProperty(t,"NotebookCell",{enumerable:true,get:function(){return J.NotebookCell}});Object.defineProperty(t,"NotebookDocument",{enumerable:true,get:function(){return J.NotebookDocument}});Object.defineProperty(t,"NotebookDocumentSyncRegistrationType",{enumerable:true,get:function(){return J.NotebookDocumentSyncRegistrationType}});Object.defineProperty(t,"DidOpenNotebookDocumentNotification",{enumerable:true,get:function(){return J.DidOpenNotebookDocumentNotification}});Object.defineProperty(t,"NotebookCellArrayChange",{enumerable:true,get:function(){return J.NotebookCellArrayChange}});Object.defineProperty(t,"DidChangeNotebookDocumentNotification",{enumerable:true,get:function(){return J.DidChangeNotebookDocumentNotification}});Object.defineProperty(t,"DidSaveNotebookDocumentNotification",{enumerable:true,get:function(){return J.DidSaveNotebookDocumentNotification}});Object.defineProperty(t,"DidCloseNotebookDocumentNotification",{enumerable:true,get:function(){return J.DidCloseNotebookDocumentNotification}});const te=p_();Object.defineProperty(t,"InlineCompletionRequest",{enumerable:true,get:function(){return te.InlineCompletionRequest}});var ie;(function(m){function Oe(Le){const ee=Le;return r.string(ee)||(r.string(ee.language)||r.string(ee.scheme)||r.string(ee.pattern))}m.is=Oe})(ie||(t.TextDocumentFilter=ie={}));var ce;(function(m){function Oe(Le){const ee=Le;return r.objectLiteral(ee)&&(r.string(ee.notebookType)||r.string(ee.scheme)||r.string(ee.pattern))}m.is=Oe})(ce||(t.NotebookDocumentFilter=ce={}));var L;(function(m){function Oe(Le){const ee=Le;return r.objectLiteral(ee)&&(r.string(ee.notebook)||ce.is(ee.notebook))&&(ee.language===void 0||r.string(ee.language))}m.is=Oe})(L||(t.NotebookCellTextDocumentFilter=L={}));var E;(function(m){function Oe(Le){if(!Array.isArray(Le)){return false}for(let ee of Le){if(!r.string(ee)&&!ie.is(ee)&&!L.is(ee)){return false}}return true}m.is=Oe})(E||(t.DocumentSelector=E={}));var g;(function(m){m.method="client/registerCapability";m.messageDirection=e.MessageDirection.serverToClient;m.type=new e.ProtocolRequestType(m.method)})(g||(t.RegistrationRequest=g={}));var k;(function(m){m.method="client/unregisterCapability";m.messageDirection=e.MessageDirection.serverToClient;m.type=new e.ProtocolRequestType(m.method)})(k||(t.UnregistrationRequest=k={}));var M;(function(m){m.Create="create";m.Rename="rename";m.Delete="delete"})(M||(t.ResourceOperationKind=M={}));var I;(function(m){m.Abort="abort";m.Transactional="transactional";m.TextOnlyTransactional="textOnlyTransactional";m.Undo="undo"})(I||(t.FailureHandlingKind=I={}));var x;(function(m){m.UTF8="utf-8";m.UTF16="utf-16";m.UTF32="utf-32"})(x||(t.PositionEncodingKind=x={}));var we;(function(m){function Oe(Le){const ee=Le;return ee&&r.string(ee.id)&&ee.id.length>0}m.hasId=Oe})(we||(t.StaticRegistrationOptions=we={}));var F;(function(m){function Oe(Le){const ee=Le;return ee&&(ee.documentSelector===null||E.is(ee.documentSelector))}m.is=Oe})(F||(t.TextDocumentRegistrationOptions=F={}));var N;(function(m){function Oe(ee){const h=ee;return r.objectLiteral(h)&&(h.workDoneProgress===void 0||r.boolean(h.workDoneProgress))}m.is=Oe;function Le(ee){const h=ee;return h&&r.boolean(h.workDoneProgress)}m.hasWorkDoneProgress=Le})(N||(t.WorkDoneProgressOptions=N={}));var ne;(function(m){m.method="initialize";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(ne||(t.InitializeRequest=ne={}));var Et;(function(m){m.unknownProtocolVersion=1})(Et||(t.InitializeErrorCodes=Et={}));var Ct;(function(m){m.method="initialized";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolNotificationType(m.method)})(Ct||(t.InitializedNotification=Ct={}));var Ee;(function(m){m.method="shutdown";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType0(m.method)})(Ee||(t.ShutdownRequest=Ee={}));var St;(function(m){m.method="exit";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolNotificationType0(m.method)})(St||(t.ExitNotification=St={}));var pe;(function(m){m.method="workspace/didChangeConfiguration";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolNotificationType(m.method)})(pe||(t.DidChangeConfigurationNotification=pe={}));var Ne;(function(m){m.Error=1;m.Warning=2;m.Info=3;m.Log=4;m.Debug=5})(Ne||(t.MessageType=Ne={}));var He;(function(m){m.method="window/showMessage";m.messageDirection=e.MessageDirection.serverToClient;m.type=new e.ProtocolNotificationType(m.method)})(He||(t.ShowMessageNotification=He={}));var ge;(function(m){m.method="window/showMessageRequest";m.messageDirection=e.MessageDirection.serverToClient;m.type=new e.ProtocolRequestType(m.method)})(ge||(t.ShowMessageRequest=ge={}));var j;(function(m){m.method="window/logMessage";m.messageDirection=e.MessageDirection.serverToClient;m.type=new e.ProtocolNotificationType(m.method)})(j||(t.LogMessageNotification=j={}));var R;(function(m){m.method="telemetry/event";m.messageDirection=e.MessageDirection.serverToClient;m.type=new e.ProtocolNotificationType(m.method)})(R||(t.TelemetryEventNotification=R={}));var A;(function(m){m.None=0;m.Full=1;m.Incremental=2})(A||(t.TextDocumentSyncKind=A={}));var B;(function(m){m.method="textDocument/didOpen";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolNotificationType(m.method)})(B||(t.DidOpenTextDocumentNotification=B={}));var S;(function(m){function Oe(ee){let h=ee;return h!==void 0&&h!==null&&typeof h.text==="string"&&h.range!==void 0&&(h.rangeLength===void 0||typeof h.rangeLength==="number")}m.isIncremental=Oe;function Le(ee){let h=ee;return h!==void 0&&h!==null&&typeof h.text==="string"&&h.range===void 0&&h.rangeLength===void 0}m.isFull=Le})(S||(t.TextDocumentContentChangeEvent=S={}));var de;(function(m){m.method="textDocument/didChange";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolNotificationType(m.method)})(de||(t.DidChangeTextDocumentNotification=de={}));var nt;(function(m){m.method="textDocument/didClose";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolNotificationType(m.method)})(nt||(t.DidCloseTextDocumentNotification=nt={}));var qt;(function(m){m.method="textDocument/didSave";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolNotificationType(m.method)})(qt||(t.DidSaveTextDocumentNotification=qt={}));var Un;(function(m){m.Manual=1;m.AfterDelay=2;m.FocusOut=3})(Un||(t.TextDocumentSaveReason=Un={}));var Gn;(function(m){m.method="textDocument/willSave";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolNotificationType(m.method)})(Gn||(t.WillSaveTextDocumentNotification=Gn={}));var Hn;(function(m){m.method="textDocument/willSaveWaitUntil";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(Hn||(t.WillSaveTextDocumentWaitUntilRequest=Hn={}));var yt;(function(m){m.method="workspace/didChangeWatchedFiles";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolNotificationType(m.method)})(yt||(t.DidChangeWatchedFilesNotification=yt={}));var Jt;(function(m){m.Created=1;m.Changed=2;m.Deleted=3})(Jt||(t.FileChangeType=Jt={}));var Nr;(function(m){function Oe(Le){const ee=Le;return r.objectLiteral(ee)&&(n.URI.is(ee.baseUri)||n.WorkspaceFolder.is(ee.baseUri))&&r.string(ee.pattern)}m.is=Oe})(Nr||(t.RelativePattern=Nr={}));var cn;(function(m){m.Create=1;m.Change=2;m.Delete=4})(cn||(t.WatchKind=cn={}));var dn;(function(m){m.method="textDocument/publishDiagnostics";m.messageDirection=e.MessageDirection.serverToClient;m.type=new e.ProtocolNotificationType(m.method)})(dn||(t.PublishDiagnosticsNotification=dn={}));var Qt;(function(m){m.Invoked=1;m.TriggerCharacter=2;m.TriggerForIncompleteCompletions=3})(Qt||(t.CompletionTriggerKind=Qt={}));var xt;(function(m){m.method="textDocument/completion";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(xt||(t.CompletionRequest=xt={}));var P;(function(m){m.method="completionItem/resolve";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(P||(t.CompletionResolveRequest=P={}));var _;(function(m){m.method="textDocument/hover";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(_||(t.HoverRequest=_={}));var G;(function(m){m.Invoked=1;m.TriggerCharacter=2;m.ContentChange=3})(G||(t.SignatureHelpTriggerKind=G={}));var gt;(function(m){m.method="textDocument/signatureHelp";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(gt||(t.SignatureHelpRequest=gt={}));var at;(function(m){m.method="textDocument/definition";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(at||(t.DefinitionRequest=at={}));var er;(function(m){m.method="textDocument/references";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(er||(t.ReferencesRequest=er={}));var Qr;(function(m){m.method="textDocument/documentHighlight";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(Qr||(t.DocumentHighlightRequest=Qr={}));var us;(function(m){m.method="textDocument/documentSymbol";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(us||(t.DocumentSymbolRequest=us={}));var cs;(function(m){m.method="textDocument/codeAction";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(cs||(t.CodeActionRequest=cs={}));var ds;(function(m){m.method="codeAction/resolve";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(ds||(t.CodeActionResolveRequest=ds={}));var fs;(function(m){m.method="workspace/symbol";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(fs||(t.WorkspaceSymbolRequest=fs={}));var ps;(function(m){m.method="workspaceSymbol/resolve";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(ps||(t.WorkspaceSymbolResolveRequest=ps={}));var ms;(function(m){m.method="textDocument/codeLens";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(ms||(t.CodeLensRequest=ms={}));var jt;(function(m){m.method="codeLens/resolve";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(jt||(t.CodeLensResolveRequest=jt={}));var hs;(function(m){m.method=`workspace/codeLens/refresh`;m.messageDirection=e.MessageDirection.serverToClient;m.type=new e.ProtocolRequestType0(m.method)})(hs||(t.CodeLensRefreshRequest=hs={}));var ys;(function(m){m.method="textDocument/documentLink";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(ys||(t.DocumentLinkRequest=ys={}));var tr;(function(m){m.method="documentLink/resolve";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(tr||(t.DocumentLinkResolveRequest=tr={}));var gs;(function(m){m.method="textDocument/formatting";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(gs||(t.DocumentFormattingRequest=gs={}));var Pr;(function(m){m.method="textDocument/rangeFormatting";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(Pr||(t.DocumentRangeFormattingRequest=Pr={}));var Rs;(function(m){m.method="textDocument/rangesFormatting";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(Rs||(t.DocumentRangesFormattingRequest=Rs={}));var fn;(function(m){m.method="textDocument/onTypeFormatting";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(fn||(t.DocumentOnTypeFormattingRequest=fn={}));var qn;(function(m){m.Identifier=1})(qn||(t.PrepareSupportDefaultBehavior=qn={}));var $s;(function(m){m.method="textDocument/rename";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})($s||(t.RenameRequest=$s={}));var vs;(function(m){m.method="textDocument/prepareRename";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(vs||(t.PrepareRenameRequest=vs={}));var jn;(function(m){m.method="workspace/executeCommand";m.messageDirection=e.MessageDirection.clientToServer;m.type=new e.ProtocolRequestType(m.method)})(jn||(t.ExecuteCommandRequest=jn={}));var Zr;(function(m){m.method="workspace/applyEdit";m.messageDirection=e.MessageDirection.serverToClient;m.type=new e.ProtocolRequestType("workspace/applyEdit")})(Zr||(t.ApplyWorkspaceEditRequest=Zr={}))})(bc);return bc}var vi={};var iy;function h_(){if(iy)return vi;iy=1;Object.defineProperty(vi,"__esModule",{value:true});vi.createProtocolConnection=void 0;const t=Jr();function e(n,r,i,a){if(t.ConnectionStrategy.is(a)){a={connectionStrategy:a}}return(0,t.createMessageConnection)(n,r,i,a)}vi.createProtocolConnection=e;return vi}var ay;function y_(){if(ay)return di;ay=1;(function(t){var e=di.__createBinding||(Object.create?function(a,s,o,l){if(l===void 0)l=o;var u=Object.getOwnPropertyDescriptor(s,o);if(!u||("get"in u?!s.__esModule:u.writable||u.configurable)){u={enumerable:true,get:function(){return s[o]}}}Object.defineProperty(a,l,u)}:function(a,s,o,l){if(l===void 0)l=o;a[l]=s[o]});var n=di.__exportStar||function(a,s){for(var o in a)if(o!=="default"&&!Object.prototype.hasOwnProperty.call(s,o))e(s,a,o)};Object.defineProperty(t,"__esModule",{value:true});t.LSPErrorCodes=t.createProtocolConnection=void 0;n(Jr(),t);n(Fp,t);n(ke(),t);n(m_(),t);var r=h_();Object.defineProperty(t,"createProtocolConnection",{enumerable:true,get:function(){return r.createProtocolConnection}});var i;(function(a){a.lspReservedErrorRangeStart=-32899;a.RequestFailed=-32803;a.ServerCancelled=-32802;a.ContentModified=-32801;a.RequestCancelled=-32800;a.lspReservedErrorRangeEnd=-32800})(i||(t.LSPErrorCodes=i={}))})(di);return di}var sy;function Fe(){if(sy)return si;sy=1;(function(t){var e=si.__createBinding||(Object.create?function(a,s,o,l){if(l===void 0)l=o;var u=Object.getOwnPropertyDescriptor(s,o);if(!u||("get"in u?!s.__esModule:u.writable||u.configurable)){u={enumerable:true,get:function(){return s[o]}}}Object.defineProperty(a,l,u)}:function(a,s,o,l){if(l===void 0)l=o;a[l]=s[o]});var n=si.__exportStar||function(a,s){for(var o in a)if(o!=="default"&&!Object.prototype.hasOwnProperty.call(s,o))e(s,a,o)};Object.defineProperty(t,"__esModule",{value:true});t.createProtocolConnection=void 0;const r=Ih();n(Ih(),t);n(y_(),t);function i(a,s,o,l){return(0,r.createMessageConnection)(a,s,o,l)}t.createProtocolConnection=i})(si);return si}var oy;function H$(){if(oy)return pn;oy=1;Object.defineProperty(pn,"__esModule",{value:true});pn.SemanticTokensBuilder=pn.SemanticTokensDiff=pn.SemanticTokensFeature=void 0;const t=Fe();const e=i=>{return class extends i{get semanticTokens(){return{refresh:()=>{return this.connection.sendRequest(t.SemanticTokensRefreshRequest.type)},on:a=>{const s=t.SemanticTokensRequest.type;return this.connection.onRequest(s,(o,l)=>{return a(o,l,this.attachWorkDoneProgress(o),this.attachPartialResultProgress(s,o))})},onDelta:a=>{const s=t.SemanticTokensDeltaRequest.type;return this.connection.onRequest(s,(o,l)=>{return a(o,l,this.attachWorkDoneProgress(o),this.attachPartialResultProgress(s,o))})},onRange:a=>{const s=t.SemanticTokensRangeRequest.type;return this.connection.onRequest(s,(o,l)=>{return a(o,l,this.attachWorkDoneProgress(o),this.attachPartialResultProgress(s,o))})}}}}};pn.SemanticTokensFeature=e;class n{constructor(a,s){this.originalSequence=a;this.modifiedSequence=s}computeDiff(){const a=this.originalSequence.length;const s=this.modifiedSequence.length;let o=0;while(o<s&&o<a&&this.originalSequence[o]===this.modifiedSequence[o]){o++}if(o<s&&o<a){let l=a-1;let u=s-1;while(l>=o&&u>=o&&this.originalSequence[l]===this.modifiedSequence[u]){l--;u--}if(l<o||u<o){l++;u++}const c=l-o+1;const d=this.modifiedSequence.slice(o,u+1);if(d.length===1&&d[0]===this.originalSequence[l]){return[{start:o,deleteCount:c-1}]}else{return[{start:o,deleteCount:c,data:d}]}}else if(o<s){return[{start:o,deleteCount:0,data:this.modifiedSequence.slice(o)}]}else if(o<a){return[{start:o,deleteCount:a-o}]}else{return[]}}}pn.SemanticTokensDiff=n;class r{constructor(){this._prevData=void 0;this.initialize()}initialize(){this._id=Date.now();this._prevLine=0;this._prevChar=0;this._data=[];this._dataLen=0}push(a,s,o,l,u){let c=a;let d=s;if(this._dataLen>0){c-=this._prevLine;if(c===0){d-=this._prevChar}}this._data[this._dataLen++]=c;this._data[this._dataLen++]=d;this._data[this._dataLen++]=o;this._data[this._dataLen++]=l;this._data[this._dataLen++]=u;this._prevLine=a;this._prevChar=s}get id(){return this._id.toString()}previousResult(a){if(this.id===a){this._prevData=this._data}this.initialize()}build(){this._prevData=void 0;return{resultId:this.id,data:this._data}}canBuildEdits(){return this._prevData!==void 0}buildEdits(){if(this._prevData!==void 0){return{resultId:this.id,edits:new n(this._prevData,this._data).computeDiff()}}else{return this.build()}}}pn.SemanticTokensBuilder=r;return pn}var Ti={};var ly;function g_(){if(ly)return Ti;ly=1;Object.defineProperty(Ti,"__esModule",{value:true});Ti.InlineCompletionFeature=void 0;const t=Fe();const e=n=>{return class extends n{get inlineCompletion(){return{on:r=>{return this.connection.onRequest(t.InlineCompletionRequest.type,(i,a)=>{return r(i,a,this.attachWorkDoneProgress(i))})}}}}};Ti.InlineCompletionFeature=e;return Ti}var wi={};var uy;function q$(){if(uy)return wi;uy=1;Object.defineProperty(wi,"__esModule",{value:true});wi.TextDocuments=void 0;const t=Fe();class e{constructor(r){this._configuration=r;this._syncedDocuments=new Map;this._onDidChangeContent=new t.Emitter;this._onDidOpen=new t.Emitter;this._onDidClose=new t.Emitter;this._onDidSave=new t.Emitter;this._onWillSave=new t.Emitter}get onDidOpen(){return this._onDidOpen.event}get onDidChangeContent(){return this._onDidChangeContent.event}get onWillSave(){return this._onWillSave.event}onWillSaveWaitUntil(r){this._willSaveWaitUntil=r}get onDidSave(){return this._onDidSave.event}get onDidClose(){return this._onDidClose.event}get(r){return this._syncedDocuments.get(r)}all(){return Array.from(this._syncedDocuments.values())}keys(){return Array.from(this._syncedDocuments.keys())}listen(r){r.__textDocumentSync=t.TextDocumentSyncKind.Incremental;const i=[];i.push(r.onDidOpenTextDocument(a=>{const s=a.textDocument;const o=this._configuration.create(s.uri,s.languageId,s.version,s.text);this._syncedDocuments.set(s.uri,o);const l=Object.freeze({document:o});this._onDidOpen.fire(l);this._onDidChangeContent.fire(l)}));i.push(r.onDidChangeTextDocument(a=>{const s=a.textDocument;const o=a.contentChanges;if(o.length===0){return}const{version:l}=s;if(l===null||l===void 0){throw new Error(`Received document change event for ${s.uri} without valid version identifier`)}let u=this._syncedDocuments.get(s.uri);if(u!==void 0){u=this._configuration.update(u,o,l);this._syncedDocuments.set(s.uri,u);this._onDidChangeContent.fire(Object.freeze({document:u}))}}));i.push(r.onDidCloseTextDocument(a=>{let s=this._syncedDocuments.get(a.textDocument.uri);if(s!==void 0){this._syncedDocuments.delete(a.textDocument.uri);this._onDidClose.fire(Object.freeze({document:s}))}}));i.push(r.onWillSaveTextDocument(a=>{let s=this._syncedDocuments.get(a.textDocument.uri);if(s!==void 0){this._onWillSave.fire(Object.freeze({document:s,reason:a.reason}))}}));i.push(r.onWillSaveTextDocumentWaitUntil((a,s)=>{let o=this._syncedDocuments.get(a.textDocument.uri);if(o!==void 0&&this._willSaveWaitUntil){return this._willSaveWaitUntil(Object.freeze({document:o,reason:a.reason}),s)}else{return[]}}));i.push(r.onDidSaveTextDocument(a=>{let s=this._syncedDocuments.get(a.textDocument.uri);if(s!==void 0){this._onDidSave.fire(Object.freeze({document:s}))}}));return t.Disposable.create(()=>{i.forEach(a=>a.dispose())})}}wi.TextDocuments=e;return wi}var dr={};var cy;function j$(){if(cy)return dr;cy=1;Object.defineProperty(dr,"__esModule",{value:true});dr.NotebookDocuments=dr.NotebookSyncFeature=void 0;const t=Fe();const e=q$();const n=a=>{return class extends a{get synchronization(){return{onDidOpenNotebookDocument:s=>{return this.connection.onNotification(t.DidOpenNotebookDocumentNotification.type,o=>{s(o)})},onDidChangeNotebookDocument:s=>{return this.connection.onNotification(t.DidChangeNotebookDocumentNotification.type,o=>{s(o)})},onDidSaveNotebookDocument:s=>{return this.connection.onNotification(t.DidSaveNotebookDocumentNotification.type,o=>{s(o)})},onDidCloseNotebookDocument:s=>{return this.connection.onNotification(t.DidCloseNotebookDocumentNotification.type,o=>{s(o)})}}}}};dr.NotebookSyncFeature=n;class r{onDidOpenTextDocument(s){this.openHandler=s;return t.Disposable.create(()=>{this.openHandler=void 0})}openTextDocument(s){this.openHandler&&this.openHandler(s)}onDidChangeTextDocument(s){this.changeHandler=s;return t.Disposable.create(()=>{this.changeHandler=s})}changeTextDocument(s){this.changeHandler&&this.changeHandler(s)}onDidCloseTextDocument(s){this.closeHandler=s;return t.Disposable.create(()=>{this.closeHandler=void 0})}closeTextDocument(s){this.closeHandler&&this.closeHandler(s)}onWillSaveTextDocument(){return r.NULL_DISPOSE}onWillSaveTextDocumentWaitUntil(){return r.NULL_DISPOSE}onDidSaveTextDocument(){return r.NULL_DISPOSE}}r.NULL_DISPOSE=Object.freeze({dispose:()=>{}});class i{constructor(s){if(s instanceof e.TextDocuments){this._cellTextDocuments=s}else{this._cellTextDocuments=new e.TextDocuments(s)}this.notebookDocuments=new Map;this.notebookCellMap=new Map;this._onDidOpen=new t.Emitter;this._onDidChange=new t.Emitter;this._onDidSave=new t.Emitter;this._onDidClose=new t.Emitter}get cellTextDocuments(){return this._cellTextDocuments}getCellTextDocument(s){return this._cellTextDocuments.get(s.document)}getNotebookDocument(s){return this.notebookDocuments.get(s)}getNotebookCell(s){const o=this.notebookCellMap.get(s);return o&&o[0]}findNotebookDocumentForCell(s){const o=typeof s==="string"?s:s.document;const l=this.notebookCellMap.get(o);return l&&l[1]}get onDidOpen(){return this._onDidOpen.event}get onDidSave(){return this._onDidSave.event}get onDidChange(){return this._onDidChange.event}get onDidClose(){return this._onDidClose.event}listen(s){const o=new r;const l=[];l.push(this.cellTextDocuments.listen(o));l.push(s.notebooks.synchronization.onDidOpenNotebookDocument(u=>{this.notebookDocuments.set(u.notebookDocument.uri,u.notebookDocument);for(const c of u.cellTextDocuments){o.openTextDocument({textDocument:c})}this.updateCellMap(u.notebookDocument);this._onDidOpen.fire(u.notebookDocument)}));l.push(s.notebooks.synchronization.onDidChangeNotebookDocument(u=>{const c=this.notebookDocuments.get(u.notebookDocument.uri);if(c===void 0){return}c.version=u.notebookDocument.version;const d=c.metadata;let f=false;const p=u.change;if(p.metadata!==void 0){f=true;c.metadata=p.metadata}const y=[];const v=[];const b=[];const $=[];if(p.cells!==void 0){const q=p.cells;if(q.structure!==void 0){const J=q.structure.array;c.cells.splice(J.start,J.deleteCount,...J.cells!==void 0?J.cells:[]);if(q.structure.didOpen!==void 0){for(const te of q.structure.didOpen){o.openTextDocument({textDocument:te});y.push(te.uri)}}if(q.structure.didClose){for(const te of q.structure.didClose){o.closeTextDocument({textDocument:te});v.push(te.uri)}}}if(q.data!==void 0){const J=new Map(q.data.map(te=>[te.document,te]));for(let te=0;te<=c.cells.length;te++){const ie=J.get(c.cells[te].document);if(ie!==void 0){const ce=c.cells.splice(te,1,ie);b.push({old:ce[0],new:ie});J.delete(ie.document);if(J.size===0){break}}}}if(q.textContent!==void 0){for(const J of q.textContent){o.changeTextDocument({textDocument:J.document,contentChanges:J.changes});$.push(J.document.uri)}}}this.updateCellMap(c);const w={notebookDocument:c};if(f){w.metadata={old:d,new:c.metadata}}const C=[];for(const q of y){C.push(this.getNotebookCell(q))}const O=[];for(const q of v){O.push(this.getNotebookCell(q))}const Y=[];for(const q of $){Y.push(this.getNotebookCell(q))}if(C.length>0||O.length>0||b.length>0||Y.length>0){w.cells={added:C,removed:O,changed:{data:b,textContent:Y}}}if(w.metadata!==void 0||w.cells!==void 0){this._onDidChange.fire(w)}}));l.push(s.notebooks.synchronization.onDidSaveNotebookDocument(u=>{const c=this.notebookDocuments.get(u.notebookDocument.uri);if(c===void 0){return}this._onDidSave.fire(c)}));l.push(s.notebooks.synchronization.onDidCloseNotebookDocument(u=>{const c=this.notebookDocuments.get(u.notebookDocument.uri);if(c===void 0){return}this._onDidClose.fire(c);for(const d of u.cellTextDocuments){o.closeTextDocument({textDocument:d})}this.notebookDocuments.delete(u.notebookDocument.uri);for(const d of c.cells){this.notebookCellMap.delete(d.document)}}));return t.Disposable.create(()=>{l.forEach(u=>u.dispose())})}updateCellMap(s){for(const o of s.cells){this.notebookCellMap.set(o.document,[o,s])}}}dr.NotebookDocuments=i;return dr}var se={};var Ke={};var dy;function B$(){if(dy)return Ke;dy=1;Object.defineProperty(Ke,"__esModule",{value:true});Ke.thenable=Ke.typedArray=Ke.stringArray=Ke.array=Ke.func=Ke.error=Ke.number=Ke.string=Ke.boolean=void 0;function t(u){return u===true||u===false}Ke.boolean=t;function e(u){return typeof u==="string"||u instanceof String}Ke.string=e;function n(u){return typeof u==="number"||u instanceof Number}Ke.number=n;function r(u){return u instanceof Error}Ke.error=r;function i(u){return typeof u==="function"}Ke.func=i;function a(u){return Array.isArray(u)}Ke.array=a;function s(u){return a(u)&&u.every(c=>e(c))}Ke.stringArray=s;function o(u,c){return Array.isArray(u)&&u.every(c)}Ke.typedArray=o;function l(u){return u&&i(u.then)}Ke.thenable=l;return Ke}var bt={};var fy;function W$(){if(fy)return bt;fy=1;Object.defineProperty(bt,"__esModule",{value:true});bt.generateUuid=bt.parse=bt.isUUID=bt.v4=bt.empty=void 0;class t{constructor(l){this._value=l}asHex(){return this._value}equals(l){return this.asHex()===l.asHex()}}class e extends t{static _oneOf(l){return l[Math.floor(l.length*Math.random())]}static _randomHex(){return e._oneOf(e._chars)}constructor(){super([e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),"-",e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),"-","4",e._randomHex(),e._randomHex(),e._randomHex(),"-",e._oneOf(e._timeHighBits),e._randomHex(),e._randomHex(),e._randomHex(),"-",e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex(),e._randomHex()].join(""))}}e._chars=["0","1","2","3","4","5","6","6","7","8","9","a","b","c","d","e","f"];e._timeHighBits=["8","9","a","b"];bt.empty=new t("00000000-0000-0000-0000-000000000000");function n(){return new e}bt.v4=n;const r=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;function i(o){return r.test(o)}bt.isUUID=i;function a(o){if(!i(o)){throw new Error("invalid uuid")}return new t(o)}bt.parse=a;function s(){return n().asHex()}bt.generateUuid=s;return bt}var wn={};var py;function R_(){if(py)return wn;py=1;Object.defineProperty(wn,"__esModule",{value:true});wn.attachPartialResult=wn.ProgressFeature=wn.attachWorkDone=void 0;const t=Fe();const e=W$();class n{constructor(f,p){this._connection=f;this._token=p;n.Instances.set(this._token,this)}begin(f,p,y,v){let b={kind:"begin",title:f,percentage:p,message:y,cancellable:v};this._connection.sendProgress(t.WorkDoneProgress.type,this._token,b)}report(f,p){let y={kind:"report"};if(typeof f==="number"){y.percentage=f;if(p!==void 0){y.message=p}}else{y.message=f}this._connection.sendProgress(t.WorkDoneProgress.type,this._token,y)}done(){n.Instances.delete(this._token);this._connection.sendProgress(t.WorkDoneProgress.type,this._token,{kind:"end"})}}n.Instances=new Map;class r extends n{constructor(f,p){super(f,p);this._source=new t.CancellationTokenSource}get token(){return this._source.token}done(){this._source.dispose();super.done()}cancel(){this._source.cancel()}}class i{constructor(){}begin(){}report(){}done(){}}class a extends i{constructor(){super();this._source=new t.CancellationTokenSource}get token(){return this._source.token}done(){this._source.dispose()}cancel(){this._source.cancel()}}function s(d,f){if(f===void 0||f.workDoneToken===void 0){return new i}const p=f.workDoneToken;delete f.workDoneToken;return new n(d,p)}wn.attachWorkDone=s;const o=d=>{return class extends d{constructor(){super();this._progressSupported=false}initialize(f){super.initialize(f);if(f?.window?.workDoneProgress===true){this._progressSupported=true;this.connection.onNotification(t.WorkDoneProgressCancelNotification.type,p=>{let y=n.Instances.get(p.token);if(y instanceof r||y instanceof a){y.cancel()}})}}attachWorkDoneProgress(f){if(f===void 0){return new i}else{return new n(this.connection,f)}}createWorkDoneProgress(){if(this._progressSupported){const f=(0,e.generateUuid)();return this.connection.sendRequest(t.WorkDoneProgressCreateRequest.type,{token:f}).then(()=>{const p=new r(this.connection,f);return p})}else{return Promise.resolve(new a)}}}};wn.ProgressFeature=o;var l;(function(d){d.type=new t.ProgressType})(l||(l={}));class u{constructor(f,p){this._connection=f;this._token=p}report(f){this._connection.sendProgress(l.type,this._token,f)}}function c(d,f){if(f===void 0||f.partialResultToken===void 0){return void 0}const p=f.partialResultToken;delete f.partialResultToken;return new u(d,p)}wn.attachPartialResult=c;return wn}var Ei={};var my;function $_(){if(my)return Ei;my=1;Object.defineProperty(Ei,"__esModule",{value:true});Ei.ConfigurationFeature=void 0;const t=Fe();const e=B$();const n=r=>{return class extends r{getConfiguration(i){if(!i){return this._getConfiguration({})}else if(e.string(i)){return this._getConfiguration({section:i})}else{return this._getConfiguration(i)}}_getConfiguration(i){let a={items:Array.isArray(i)?i:[i]};return this.connection.sendRequest(t.ConfigurationRequest.type,a).then(s=>{if(Array.isArray(s)){return Array.isArray(i)?s:s[0]}else{return Array.isArray(i)?[]:null}})}}};Ei.ConfigurationFeature=n;return Ei}var Ci={};var hy;function v_(){if(hy)return Ci;hy=1;Object.defineProperty(Ci,"__esModule",{value:true});Ci.WorkspaceFoldersFeature=void 0;const t=Fe();const e=n=>{return class extends n{constructor(){super();this._notificationIsAutoRegistered=false}initialize(r){super.initialize(r);let i=r.workspace;if(i&&i.workspaceFolders){this._onDidChangeWorkspaceFolders=new t.Emitter;this.connection.onNotification(t.DidChangeWorkspaceFoldersNotification.type,a=>{this._onDidChangeWorkspaceFolders.fire(a.event)})}}fillServerCapabilities(r){super.fillServerCapabilities(r);const i=r.workspace?.workspaceFolders?.changeNotifications;this._notificationIsAutoRegistered=i===true||typeof i==="string"}getWorkspaceFolders(){return this.connection.sendRequest(t.WorkspaceFoldersRequest.type)}get onDidChangeWorkspaceFolders(){if(!this._onDidChangeWorkspaceFolders){throw new Error("Client doesn't support sending workspace folder change events.")}if(!this._notificationIsAutoRegistered&&!this._unregistration){this._unregistration=this.connection.client.register(t.DidChangeWorkspaceFoldersNotification.type)}return this._onDidChangeWorkspaceFolders.event}}};Ci.WorkspaceFoldersFeature=e;return Ci}var Si={};var yy;function T_(){if(yy)return Si;yy=1;Object.defineProperty(Si,"__esModule",{value:true});Si.CallHierarchyFeature=void 0;const t=Fe();const e=n=>{return class extends n{get callHierarchy(){return{onPrepare:r=>{return this.connection.onRequest(t.CallHierarchyPrepareRequest.type,(i,a)=>{return r(i,a,this.attachWorkDoneProgress(i),void 0)})},onIncomingCalls:r=>{const i=t.CallHierarchyIncomingCallsRequest.type;return this.connection.onRequest(i,(a,s)=>{return r(a,s,this.attachWorkDoneProgress(a),this.attachPartialResultProgress(i,a))})},onOutgoingCalls:r=>{const i=t.CallHierarchyOutgoingCallsRequest.type;return this.connection.onRequest(i,(a,s)=>{return r(a,s,this.attachWorkDoneProgress(a),this.attachPartialResultProgress(i,a))})}}}}};Si.CallHierarchyFeature=e;return Si}var Ai={};var gy;function w_(){if(gy)return Ai;gy=1;Object.defineProperty(Ai,"__esModule",{value:true});Ai.ShowDocumentFeature=void 0;const t=Fe();const e=n=>{return class extends n{showDocument(r){return this.connection.sendRequest(t.ShowDocumentRequest.type,r)}}};Ai.ShowDocumentFeature=e;return Ai}var bi={};var Ry;function E_(){if(Ry)return bi;Ry=1;Object.defineProperty(bi,"__esModule",{value:true});bi.FileOperationsFeature=void 0;const t=Fe();const e=n=>{return class extends n{onDidCreateFiles(r){return this.connection.onNotification(t.DidCreateFilesNotification.type,i=>{r(i)})}onDidRenameFiles(r){return this.connection.onNotification(t.DidRenameFilesNotification.type,i=>{r(i)})}onDidDeleteFiles(r){return this.connection.onNotification(t.DidDeleteFilesNotification.type,i=>{r(i)})}onWillCreateFiles(r){return this.connection.onRequest(t.WillCreateFilesRequest.type,(i,a)=>{return r(i,a)})}onWillRenameFiles(r){return this.connection.onRequest(t.WillRenameFilesRequest.type,(i,a)=>{return r(i,a)})}onWillDeleteFiles(r){return this.connection.onRequest(t.WillDeleteFilesRequest.type,(i,a)=>{return r(i,a)})}}};bi.FileOperationsFeature=e;return bi}var ki={};var $y;function C_(){if($y)return ki;$y=1;Object.defineProperty(ki,"__esModule",{value:true});ki.LinkedEditingRangeFeature=void 0;const t=Fe();const e=n=>{return class extends n{onLinkedEditingRange(r){return this.connection.onRequest(t.LinkedEditingRangeRequest.type,(i,a)=>{return r(i,a,this.attachWorkDoneProgress(i),void 0)})}}};ki.LinkedEditingRangeFeature=e;return ki}var Ni={};var vy;function S_(){if(vy)return Ni;vy=1;Object.defineProperty(Ni,"__esModule",{value:true});Ni.TypeHierarchyFeature=void 0;const t=Fe();const e=n=>{return class extends n{get typeHierarchy(){return{onPrepare:r=>{return this.connection.onRequest(t.TypeHierarchyPrepareRequest.type,(i,a)=>{return r(i,a,this.attachWorkDoneProgress(i),void 0)})},onSupertypes:r=>{const i=t.TypeHierarchySupertypesRequest.type;return this.connection.onRequest(i,(a,s)=>{return r(a,s,this.attachWorkDoneProgress(a),this.attachPartialResultProgress(i,a))})},onSubtypes:r=>{const i=t.TypeHierarchySubtypesRequest.type;return this.connection.onRequest(i,(a,s)=>{return r(a,s,this.attachWorkDoneProgress(a),this.attachPartialResultProgress(i,a))})}}}}};Ni.TypeHierarchyFeature=e;return Ni}var Pi={};var Ty;function A_(){if(Ty)return Pi;Ty=1;Object.defineProperty(Pi,"__esModule",{value:true});Pi.InlineValueFeature=void 0;const t=Fe();const e=n=>{return class extends n{get inlineValue(){return{refresh:()=>{return this.connection.sendRequest(t.InlineValueRefreshRequest.type)},on:r=>{return this.connection.onRequest(t.InlineValueRequest.type,(i,a)=>{return r(i,a,this.attachWorkDoneProgress(i))})}}}}};Pi.InlineValueFeature=e;return Pi}var _i={};var wy;function b_(){if(wy)return _i;wy=1;Object.defineProperty(_i,"__esModule",{value:true});_i.FoldingRangeFeature=void 0;const t=Fe();const e=n=>{return class extends n{get foldingRange(){return{refresh:()=>{return this.connection.sendRequest(t.FoldingRangeRefreshRequest.type)},on:r=>{const i=t.FoldingRangeRequest.type;return this.connection.onRequest(i,(a,s)=>{return r(a,s,this.attachWorkDoneProgress(a),this.attachPartialResultProgress(i,a))})}}}}};_i.FoldingRangeFeature=e;return _i}var Di={};var Ey;function k_(){if(Ey)return Di;Ey=1;Object.defineProperty(Di,"__esModule",{value:true});Di.InlayHintFeature=void 0;const t=Fe();const e=n=>{return class extends n{get inlayHint(){return{refresh:()=>{return this.connection.sendRequest(t.InlayHintRefreshRequest.type)},on:r=>{return this.connection.onRequest(t.InlayHintRequest.type,(i,a)=>{return r(i,a,this.attachWorkDoneProgress(i))})},resolve:r=>{return this.connection.onRequest(t.InlayHintResolveRequest.type,(i,a)=>{return r(i,a)})}}}}};Di.InlayHintFeature=e;return Di}var Ii={};var Cy;function N_(){if(Cy)return Ii;Cy=1;Object.defineProperty(Ii,"__esModule",{value:true});Ii.DiagnosticFeature=void 0;const t=Fe();const e=n=>{return class extends n{get diagnostics(){return{refresh:()=>{return this.connection.sendRequest(t.DiagnosticRefreshRequest.type)},on:r=>{return this.connection.onRequest(t.DocumentDiagnosticRequest.type,(i,a)=>{return r(i,a,this.attachWorkDoneProgress(i),this.attachPartialResultProgress(t.DocumentDiagnosticRequest.partialResult,i))})},onWorkspace:r=>{return this.connection.onRequest(t.WorkspaceDiagnosticRequest.type,(i,a)=>{return r(i,a,this.attachWorkDoneProgress(i),this.attachPartialResultProgress(t.WorkspaceDiagnosticRequest.partialResult,i))})}}}}};Ii.DiagnosticFeature=e;return Ii}var Oi={};var Sy;function P_(){if(Sy)return Oi;Sy=1;Object.defineProperty(Oi,"__esModule",{value:true});Oi.MonikerFeature=void 0;const t=Fe();const e=n=>{return class extends n{get moniker(){return{on:r=>{const i=t.MonikerRequest.type;return this.connection.onRequest(i,(a,s)=>{return r(a,s,this.attachWorkDoneProgress(a),this.attachPartialResultProgress(i,a))})}}}}};Oi.MonikerFeature=e;return Oi}var Ay;function __(){if(Ay)return se;Ay=1;Object.defineProperty(se,"__esModule",{value:true});se.createConnection=se.combineFeatures=se.combineNotebooksFeatures=se.combineLanguagesFeatures=se.combineWorkspaceFeatures=se.combineWindowFeatures=se.combineClientFeatures=se.combineTracerFeatures=se.combineTelemetryFeatures=se.combineConsoleFeatures=se._NotebooksImpl=se._LanguagesImpl=se.BulkUnregistration=se.BulkRegistration=se.ErrorMessageTracker=void 0;const t=Fe();const e=B$();const n=W$();const r=R_();const i=$_();const a=v_();const s=T_();const o=H$();const l=w_();const u=E_();const c=C_();const d=S_();const f=A_();const p=b_();const y=k_();const v=N_();const b=j$();const $=P_();function w(j){if(j===null){return void 0}return j}class C{constructor(){this._messages=Object.create(null)}add(R){let A=this._messages[R];if(!A){A=0}A++;this._messages[R]=A}sendErrors(R){Object.keys(this._messages).forEach(A=>{R.window.showErrorMessage(A)})}}se.ErrorMessageTracker=C;class O{constructor(){}rawAttach(R){this._rawConnection=R}attach(R){this._connection=R}get connection(){if(!this._connection){throw new Error("Remote is not attached to a connection yet.")}return this._connection}fillServerCapabilities(R){}initialize(R){}error(R){this.send(t.MessageType.Error,R)}warn(R){this.send(t.MessageType.Warning,R)}info(R){this.send(t.MessageType.Info,R)}log(R){this.send(t.MessageType.Log,R)}debug(R){this.send(t.MessageType.Debug,R)}send(R,A){if(this._rawConnection){this._rawConnection.sendNotification(t.LogMessageNotification.type,{type:R,message:A}).catch(()=>{(0,t.RAL)().console.error(`Sending log message failed`)})}}}class Y{constructor(){}attach(R){this._connection=R}get connection(){if(!this._connection){throw new Error("Remote is not attached to a connection yet.")}return this._connection}initialize(R){}fillServerCapabilities(R){}showErrorMessage(R,...A){let B={type:t.MessageType.Error,message:R,actions:A};return this.connection.sendRequest(t.ShowMessageRequest.type,B).then(w)}showWarningMessage(R,...A){let B={type:t.MessageType.Warning,message:R,actions:A};return this.connection.sendRequest(t.ShowMessageRequest.type,B).then(w)}showInformationMessage(R,...A){let B={type:t.MessageType.Info,message:R,actions:A};return this.connection.sendRequest(t.ShowMessageRequest.type,B).then(w)}}const q=(0,l.ShowDocumentFeature)((0,r.ProgressFeature)(Y));var J;(function(j){function R(){return new te}j.create=R})(J||(se.BulkRegistration=J={}));class te{constructor(){this._registrations=[];this._registered=new Set}add(R,A){const B=e.string(R)?R:R.method;if(this._registered.has(B)){throw new Error(`${B} is already added to this registration`)}const S=n.generateUuid();this._registrations.push({id:S,method:B,registerOptions:A||{}});this._registered.add(B)}asRegistrationParams(){return{registrations:this._registrations}}}var ie;(function(j){function R(){return new ce(void 0,[])}j.create=R})(ie||(se.BulkUnregistration=ie={}));class ce{constructor(R,A){this._connection=R;this._unregistrations=new Map;A.forEach(B=>{this._unregistrations.set(B.method,B)})}get isAttached(){return!!this._connection}attach(R){this._connection=R}add(R){this._unregistrations.set(R.method,R)}dispose(){let R=[];for(let B of this._unregistrations.values()){R.push(B)}let A={unregisterations:R};this._connection.sendRequest(t.UnregistrationRequest.type,A).catch(()=>{this._connection.console.info(`Bulk unregistration failed.`)})}disposeSingle(R){const A=e.string(R)?R:R.method;const B=this._unregistrations.get(A);if(!B){return false}let S={unregisterations:[B]};this._connection.sendRequest(t.UnregistrationRequest.type,S).then(()=>{this._unregistrations.delete(A)},de=>{this._connection.console.info(`Un-registering request handler for ${B.id} failed.`)});return true}}class L{attach(R){this._connection=R}get connection(){if(!this._connection){throw new Error("Remote is not attached to a connection yet.")}return this._connection}initialize(R){}fillServerCapabilities(R){}register(R,A,B){if(R instanceof te){return this.registerMany(R)}else if(R instanceof ce){return this.registerSingle1(R,A,B)}else{return this.registerSingle2(R,A)}}registerSingle1(R,A,B){const S=e.string(A)?A:A.method;const de=n.generateUuid();let nt={registrations:[{id:de,method:S,registerOptions:B||{}}]};if(!R.isAttached){R.attach(this.connection)}return this.connection.sendRequest(t.RegistrationRequest.type,nt).then(qt=>{R.add({id:de,method:S});return R},qt=>{this.connection.console.info(`Registering request handler for ${S} failed.`);return Promise.reject(qt)})}registerSingle2(R,A){const B=e.string(R)?R:R.method;const S=n.generateUuid();let de={registrations:[{id:S,method:B,registerOptions:A||{}}]};return this.connection.sendRequest(t.RegistrationRequest.type,de).then(nt=>{return t.Disposable.create(()=>{this.unregisterSingle(S,B).catch(()=>{this.connection.console.info(`Un-registering capability with id ${S} failed.`)})})},nt=>{this.connection.console.info(`Registering request handler for ${B} failed.`);return Promise.reject(nt)})}unregisterSingle(R,A){let B={unregisterations:[{id:R,method:A}]};return this.connection.sendRequest(t.UnregistrationRequest.type,B).catch(()=>{this.connection.console.info(`Un-registering request handler for ${R} failed.`)})}registerMany(R){let A=R.asRegistrationParams();return this.connection.sendRequest(t.RegistrationRequest.type,A).then(()=>{return new ce(this._connection,A.registrations.map(B=>{return{id:B.id,method:B.method}}))},B=>{this.connection.console.info(`Bulk registration failed.`);return Promise.reject(B)})}}class E{constructor(){}attach(R){this._connection=R}get connection(){if(!this._connection){throw new Error("Remote is not attached to a connection yet.")}return this._connection}initialize(R){}fillServerCapabilities(R){}applyEdit(R){function A(S){return S&&!!S.edit}let B=A(R)?R:{edit:R};return this.connection.sendRequest(t.ApplyWorkspaceEditRequest.type,B)}}const g=(0,u.FileOperationsFeature)((0,a.WorkspaceFoldersFeature)((0,i.ConfigurationFeature)(E)));class k{constructor(){this._trace=t.Trace.Off}attach(R){this._connection=R}get connection(){if(!this._connection){throw new Error("Remote is not attached to a connection yet.")}return this._connection}initialize(R){}fillServerCapabilities(R){}set trace(R){this._trace=R}log(R,A){if(this._trace===t.Trace.Off){return}this.connection.sendNotification(t.LogTraceNotification.type,{message:R,verbose:this._trace===t.Trace.Verbose?A:void 0}).catch(()=>{})}}class M{constructor(){}attach(R){this._connection=R}get connection(){if(!this._connection){throw new Error("Remote is not attached to a connection yet.")}return this._connection}initialize(R){}fillServerCapabilities(R){}logEvent(R){this.connection.sendNotification(t.TelemetryEventNotification.type,R).catch(()=>{this.connection.console.log(`Sending TelemetryEventNotification failed`)})}}class I{constructor(){}attach(R){this._connection=R}get connection(){if(!this._connection){throw new Error("Remote is not attached to a connection yet.")}return this._connection}initialize(R){}fillServerCapabilities(R){}attachWorkDoneProgress(R){return(0,r.attachWorkDone)(this.connection,R)}attachPartialResultProgress(R,A){return(0,r.attachPartialResult)(this.connection,A)}}se._LanguagesImpl=I;const x=(0,p.FoldingRangeFeature)((0,$.MonikerFeature)((0,v.DiagnosticFeature)((0,y.InlayHintFeature)((0,f.InlineValueFeature)((0,d.TypeHierarchyFeature)((0,c.LinkedEditingRangeFeature)((0,o.SemanticTokensFeature)((0,s.CallHierarchyFeature)(I)))))))));class we{constructor(){}attach(R){this._connection=R}get connection(){if(!this._connection){throw new Error("Remote is not attached to a connection yet.")}return this._connection}initialize(R){}fillServerCapabilities(R){}attachWorkDoneProgress(R){return(0,r.attachWorkDone)(this.connection,R)}attachPartialResultProgress(R,A){return(0,r.attachPartialResult)(this.connection,A)}}se._NotebooksImpl=we;const F=(0,b.NotebookSyncFeature)(we);function N(j,R){return function(A){return R(j(A))}}se.combineConsoleFeatures=N;function ne(j,R){return function(A){return R(j(A))}}se.combineTelemetryFeatures=ne;function Et(j,R){return function(A){return R(j(A))}}se.combineTracerFeatures=Et;function Ct(j,R){return function(A){return R(j(A))}}se.combineClientFeatures=Ct;function Ee(j,R){return function(A){return R(j(A))}}se.combineWindowFeatures=Ee;function St(j,R){return function(A){return R(j(A))}}se.combineWorkspaceFeatures=St;function pe(j,R){return function(A){return R(j(A))}}se.combineLanguagesFeatures=pe;function Ne(j,R){return function(A){return R(j(A))}}se.combineNotebooksFeatures=Ne;function He(j,R){function A(S,de,nt){if(S&&de){return nt(S,de)}else if(S){return S}else{return de}}let B={__brand:"features",console:A(j.console,R.console,N),tracer:A(j.tracer,R.tracer,Et),telemetry:A(j.telemetry,R.telemetry,ne),client:A(j.client,R.client,Ct),window:A(j.window,R.window,Ee),workspace:A(j.workspace,R.workspace,St),languages:A(j.languages,R.languages,pe),notebooks:A(j.notebooks,R.notebooks,Ne)};return B}se.combineFeatures=He;function ge(j,R,A){const B=A&&A.console?new(A.console(O)):new O;const S=j(B);B.rawAttach(S);const de=A&&A.tracer?new(A.tracer(k)):new k;const nt=A&&A.telemetry?new(A.telemetry(M)):new M;const qt=A&&A.client?new(A.client(L)):new L;const Un=A&&A.window?new(A.window(q)):new q;const Gn=A&&A.workspace?new(A.workspace(g)):new g;const Hn=A&&A.languages?new(A.languages(x)):new x;const yt=A&&A.notebooks?new(A.notebooks(F)):new F;const Jt=[B,de,nt,qt,Un,Gn,Hn,yt];function Nr(P){if(P instanceof Promise){return P}else if(e.thenable(P)){return new Promise((_,G)=>{P.then(gt=>_(gt),gt=>G(gt))})}else{return Promise.resolve(P)}}let cn=void 0;let dn=void 0;let Qt=void 0;let xt={listen:()=>S.listen(),sendRequest:(P,..._)=>S.sendRequest(e.string(P)?P:P.method,..._),onRequest:(P,_)=>S.onRequest(P,_),sendNotification:(P,_)=>{const G=e.string(P)?P:P.method;return S.sendNotification(G,_)},onNotification:(P,_)=>S.onNotification(P,_),onProgress:S.onProgress,sendProgress:S.sendProgress,onInitialize:P=>{dn=P;return{dispose:()=>{dn=void 0}}},onInitialized:P=>S.onNotification(t.InitializedNotification.type,P),onShutdown:P=>{cn=P;return{dispose:()=>{cn=void 0}}},onExit:P=>{Qt=P;return{dispose:()=>{Qt=void 0}}},get console(){return B},get telemetry(){return nt},get tracer(){return de},get client(){return qt},get window(){return Un},get workspace(){return Gn},get languages(){return Hn},get notebooks(){return yt},onDidChangeConfiguration:P=>S.onNotification(t.DidChangeConfigurationNotification.type,P),onDidChangeWatchedFiles:P=>S.onNotification(t.DidChangeWatchedFilesNotification.type,P),__textDocumentSync:void 0,onDidOpenTextDocument:P=>S.onNotification(t.DidOpenTextDocumentNotification.type,P),onDidChangeTextDocument:P=>S.onNotification(t.DidChangeTextDocumentNotification.type,P),onDidCloseTextDocument:P=>S.onNotification(t.DidCloseTextDocumentNotification.type,P),onWillSaveTextDocument:P=>S.onNotification(t.WillSaveTextDocumentNotification.type,P),onWillSaveTextDocumentWaitUntil:P=>S.onRequest(t.WillSaveTextDocumentWaitUntilRequest.type,P),onDidSaveTextDocument:P=>S.onNotification(t.DidSaveTextDocumentNotification.type,P),sendDiagnostics:P=>S.sendNotification(t.PublishDiagnosticsNotification.type,P),onHover:P=>S.onRequest(t.HoverRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),void 0)}),onCompletion:P=>S.onRequest(t.CompletionRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),(0,r.attachPartialResult)(S,_))}),onCompletionResolve:P=>S.onRequest(t.CompletionResolveRequest.type,P),onSignatureHelp:P=>S.onRequest(t.SignatureHelpRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),void 0)}),onDeclaration:P=>S.onRequest(t.DeclarationRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),(0,r.attachPartialResult)(S,_))}),onDefinition:P=>S.onRequest(t.DefinitionRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),(0,r.attachPartialResult)(S,_))}),onTypeDefinition:P=>S.onRequest(t.TypeDefinitionRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),(0,r.attachPartialResult)(S,_))}),onImplementation:P=>S.onRequest(t.ImplementationRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),(0,r.attachPartialResult)(S,_))}),onReferences:P=>S.onRequest(t.ReferencesRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),(0,r.attachPartialResult)(S,_))}),onDocumentHighlight:P=>S.onRequest(t.DocumentHighlightRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),(0,r.attachPartialResult)(S,_))}),onDocumentSymbol:P=>S.onRequest(t.DocumentSymbolRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),(0,r.attachPartialResult)(S,_))}),onWorkspaceSymbol:P=>S.onRequest(t.WorkspaceSymbolRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),(0,r.attachPartialResult)(S,_))}),onWorkspaceSymbolResolve:P=>S.onRequest(t.WorkspaceSymbolResolveRequest.type,P),onCodeAction:P=>S.onRequest(t.CodeActionRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),(0,r.attachPartialResult)(S,_))}),onCodeActionResolve:P=>S.onRequest(t.CodeActionResolveRequest.type,(_,G)=>{return P(_,G)}),onCodeLens:P=>S.onRequest(t.CodeLensRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),(0,r.attachPartialResult)(S,_))}),onCodeLensResolve:P=>S.onRequest(t.CodeLensResolveRequest.type,(_,G)=>{return P(_,G)}),onDocumentFormatting:P=>S.onRequest(t.DocumentFormattingRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),void 0)}),onDocumentRangeFormatting:P=>S.onRequest(t.DocumentRangeFormattingRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),void 0)}),onDocumentOnTypeFormatting:P=>S.onRequest(t.DocumentOnTypeFormattingRequest.type,(_,G)=>{return P(_,G)}),onRenameRequest:P=>S.onRequest(t.RenameRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),void 0)}),onPrepareRename:P=>S.onRequest(t.PrepareRenameRequest.type,(_,G)=>{return P(_,G)}),onDocumentLinks:P=>S.onRequest(t.DocumentLinkRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),(0,r.attachPartialResult)(S,_))}),onDocumentLinkResolve:P=>S.onRequest(t.DocumentLinkResolveRequest.type,(_,G)=>{return P(_,G)}),onDocumentColor:P=>S.onRequest(t.DocumentColorRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),(0,r.attachPartialResult)(S,_))}),onColorPresentation:P=>S.onRequest(t.ColorPresentationRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),(0,r.attachPartialResult)(S,_))}),onFoldingRanges:P=>S.onRequest(t.FoldingRangeRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),(0,r.attachPartialResult)(S,_))}),onSelectionRanges:P=>S.onRequest(t.SelectionRangeRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),(0,r.attachPartialResult)(S,_))}),onExecuteCommand:P=>S.onRequest(t.ExecuteCommandRequest.type,(_,G)=>{return P(_,G,(0,r.attachWorkDone)(S,_),void 0)}),dispose:()=>S.dispose()};for(let P of Jt){P.attach(xt)}S.onRequest(t.InitializeRequest.type,P=>{R.initialize(P);if(e.string(P.trace)){de.trace=t.Trace.fromString(P.trace)}for(let _ of Jt){_.initialize(P.capabilities)}if(dn){let _=dn(P,new t.CancellationTokenSource().token,(0,r.attachWorkDone)(S,P),void 0);return Nr(_).then(G=>{if(G instanceof t.ResponseError){return G}let gt=G;if(!gt){gt={capabilities:{}}}let at=gt.capabilities;if(!at){at={};gt.capabilities=at}if(at.textDocumentSync===void 0||at.textDocumentSync===null){at.textDocumentSync=e.number(xt.__textDocumentSync)?xt.__textDocumentSync:t.TextDocumentSyncKind.None}else if(!e.number(at.textDocumentSync)&&!e.number(at.textDocumentSync.change)){at.textDocumentSync.change=e.number(xt.__textDocumentSync)?xt.__textDocumentSync:t.TextDocumentSyncKind.None}for(let er of Jt){er.fillServerCapabilities(at)}return gt})}else{let _={capabilities:{textDocumentSync:t.TextDocumentSyncKind.None}};for(let G of Jt){G.fillServerCapabilities(_.capabilities)}return _}});S.onRequest(t.ShutdownRequest.type,()=>{R.shutdownReceived=true;if(cn){return cn(new t.CancellationTokenSource().token)}else{return void 0}});S.onNotification(t.ExitNotification.type,()=>{try{if(Qt){Qt()}}finally{if(R.shutdownReceived){R.exit(0)}else{R.exit(1)}}});S.onNotification(t.SetTraceNotification.type,P=>{de.trace=t.Trace.fromString(P.value)});return xt}se.createConnection=ge;return se}var by;function ky(){if(by)return ai;by=1;(function(t){var e=ai.__createBinding||(Object.create?function(l,u,c,d){if(d===void 0)d=c;var f=Object.getOwnPropertyDescriptor(u,c);if(!f||("get"in f?!u.__esModule:f.writable||f.configurable)){f={enumerable:true,get:function(){return u[c]}}}Object.defineProperty(l,d,f)}:function(l,u,c,d){if(d===void 0)d=c;l[d]=u[c]});var n=ai.__exportStar||function(l,u){for(var c in l)if(c!=="default"&&!Object.prototype.hasOwnProperty.call(u,c))e(u,l,c)};Object.defineProperty(t,"__esModule",{value:true});t.ProposedFeatures=t.NotebookDocuments=t.TextDocuments=t.SemanticTokensBuilder=void 0;const r=H$();Object.defineProperty(t,"SemanticTokensBuilder",{enumerable:true,get:function(){return r.SemanticTokensBuilder}});const i=g_();n(Fe(),t);const a=q$();Object.defineProperty(t,"TextDocuments",{enumerable:true,get:function(){return a.TextDocuments}});const s=j$();Object.defineProperty(t,"NotebookDocuments",{enumerable:true,get:function(){return s.NotebookDocuments}});n(__(),t);var o;(function(l){l.all={__brand:"features",languages:i.InlineCompletionFeature}})(o||(t.ProposedFeatures=o={}))})(ai);return ai}var kc;var Ny;function D_(){if(Ny)return kc;Ny=1;kc=Fe();return kc}var Py;function V$(){if(Py)return ii;Py=1;(function(t){var e=ii.__createBinding||(Object.create?function(o,l,u,c){if(c===void 0)c=u;var d=Object.getOwnPropertyDescriptor(l,u);if(!d||("get"in d?!l.__esModule:d.writable||d.configurable)){d={enumerable:true,get:function(){return l[u]}}}Object.defineProperty(o,c,d)}:function(o,l,u,c){if(c===void 0)c=u;o[c]=l[u]});var n=ii.__exportStar||function(o,l){for(var u in o)if(u!=="default"&&!Object.prototype.hasOwnProperty.call(l,u))e(l,o,u)};Object.defineProperty(t,"__esModule",{value:true});t.createConnection=void 0;const r=ky();n(D_(),t);n(ky(),t);let i=false;const a={initialize:o=>{},get shutdownReceived(){return i},set shutdownReceived(o){i=o},exit:o=>{}};function s(o,l,u,c){let d;let f;let p;let y;if(o!==void 0&&o.__brand==="features"){d=o;o=l;l=u;u=c}if(r.ConnectionStrategy.is(o)||r.ConnectionOptions.is(o)){y=o}else{f=o;p=l;y=u}const v=b=>{return(0,r.createProtocolConnection)(f,p,b,y)};return(0,r.createConnection)(v,a,d)}t.createConnection=s})(ii);return ii}var U=V$();function _y(t,e){const n={stacks:t,tokens:e};I_(n);n.stacks.flat().forEach(i=>{i.property=void 0});const r=X$(n.stacks);return r.map(i=>i[i.length-1])}function Gp(t){const{next:e,cardinalities:n,visited:r,plus:i}=t;const a=[];const s=e.feature;if(r.has(s)){return[]}else if(!gr(s)){r.add(s)}let o;let l=s;while(l.$container){if(gr(l.$container)){o=l.$container;break}else if(hg(l.$container)){l=l.$container}else{break}}if(Gv(l.cardinality)){const u=Mr({next:{feature:l,type:e.type},cardinalities:n,visited:r,plus:i});for(const c of u){i.add(c.feature)}a.push(...u)}if(o){const u=o.elements.indexOf(l);if(u!==void 0&&u<o.elements.length-1){a.push(...z$({feature:o,type:e.type},u+1,n,r,i))}if(a.every(c=>_a(c.feature.cardinality,c.feature)||_a(n.get(c.feature))||i.has(c.feature))){a.push(...Gp({next:{feature:o,type:e.type},cardinalities:n,visited:r,plus:i}))}}return a}function Zf(t){if(Ze(t)){t={feature:t}}return Mr({next:t,cardinalities:new Map,visited:new Set,plus:new Set})}function Mr(t){var e,n,r;const{next:i,cardinalities:a,visited:s,plus:o}=t;if(i===void 0){return[]}const{feature:l,type:u}=i;if(gr(l)){if(s.has(l)){return[]}else{s.add(l)}return z$(i,0,a,s,o).map(c=>Us(c,l.cardinality,a))}else if(ep(l)||tp(l)){return l.elements.flatMap(c=>Mr({next:{feature:c,type:u,property:i.property},cardinalities:a,visited:s,plus:o})).map(c=>Us(c,l.cardinality,a))}else if(an(l)){const c={feature:l.terminal,type:u,property:(e=i.property)!==null&&e!==void 0?e:l.feature};return Mr({next:c,cardinalities:a,visited:s,plus:o}).map(d=>Us(d,l.cardinality,a))}else if(Va(l)){return Gp({next:{feature:l,type:Mu(l),property:(n=i.property)!==null&&n!==void 0?n:l.feature},cardinalities:a,visited:s,plus:o})}else if(Dn(l)&&it(l.rule.ref)){const c=l.rule.ref;const d={feature:c.definition,type:c.fragment||c.dataType?void 0:(r=Xa(c))!==null&&r!==void 0?r:c.name,property:i.property};return Mr({next:d,cardinalities:a,visited:s,plus:o}).map(f=>Us(f,l.cardinality,a))}else{return[i]}}function Us(t,e,n){n.set(t.feature,e);return t}function z$(t,e,n,r,i){var a;const s=[];let o;while(e<t.feature.elements.length){const l=t.feature.elements[e++];o={feature:l,type:t.type};s.push(...Mr({next:o,cardinalities:n,visited:r,plus:i}));if(!_a((a=o.feature.cardinality)!==null&&a!==void 0?a:n.get(o.feature),o.feature)){break}}return s}function I_(t){for(const e of t.tokens){const n=X$(t.stacks,e);t.stacks=n}}function X$(t,e){const n=[];for(const r of t){n.push(...O_(r,e))}return n}function O_(t,e){const n=new Map;const r=new Set(t.map(a=>a.feature).filter(L_));const i=[];while(t.length>0){const a=t.pop();const s=Gp({next:a,cardinalities:n,plus:r,visited:new Set}).filter(o=>e?Hp(o.feature,e):true);for(const o of s){i.push([...t,o])}if(!s.every(o=>_a(o.feature.cardinality,o.feature)||_a(n.get(o.feature)))){break}}return i}function L_(t){if(t.cardinality==="+"){return true}const e=Nn(t,an);if(e&&e.cardinality==="+"){return true}return false}function Hp(t,e){if(sn(t)){const n=t.value;return n===e.image}else if(Dn(t)){return x_(t.rule.ref,e)}else if(za(t)){const n=Sg(t);if(n){return Hp(n,e)}}return false}function x_(t,e){if(it(t)){const n=Zf(t.definition);return n.some(r=>Hp(r.feature,e))}else if(Yn(t)){return Ku(t).test(e.image)}else{return false}}function M_(t){const e=Array.from(new Set(t.flatMap(r=>{var i;return(i=r===null||r===void 0?void 0:r.triggerCharacters)!==null&&i!==void 0?i:[]})));const n=Array.from(new Set(t.flatMap(r=>{var i;return(i=r===null||r===void 0?void 0:r.allCommitCharacters)!==null&&i!==void 0?i:[]})));return{triggerCharacters:e.length>0?e:void 0,allCommitCharacters:n.length>0?n:void 0}}class Y${constructor(e){this.scopeProvider=e.references.ScopeProvider;this.grammar=e.Grammar;this.completionParser=e.parser.CompletionParser;this.nameProvider=e.references.NameProvider;this.lexer=e.parser.Lexer;this.nodeKindProvider=e.shared.lsp.NodeKindProvider;this.fuzzyMatcher=e.shared.lsp.FuzzyMatcher;this.grammarConfig=e.parser.GrammarConfig;this.astReflection=e.shared.AstReflection;this.documentationProvider=e.documentation.DocumentationProvider}async getCompletion(e,n,r){const i=[];const a=this.buildContexts(e,n.position);const s=(u,c)=>{const d=this.fillCompletionItem(u,c);if(d){i.push(d)}};const o=u=>{if(sn(u.feature)){return u.feature.value}else{return u.feature}};const l=[];for(const u of a){await Promise.all(be(u.features).distinct(o).exclude(l).map(c=>this.completionFor(u,c,s)));l.push(...u.features);if(!this.continueCompletion(i)){break}}return U.CompletionList.create(this.deduplicateItems(i),true)}deduplicateItems(e){return be(e).distinct(n=>`${n.kind}_${n.label}_${n.detail}`).toArray()}findFeaturesAt(e,n){const r=e.getText({start:U.Position.create(0,0),end:e.positionAt(n)});const i=this.completionParser.parse(r);const a=i.tokens;if(i.tokenIndex===0){const l=Pd(this.grammar);const u=Zf({feature:l.definition,type:Xa(l)});if(a.length>0){a.shift();return _y(u.map(c=>[c]),a)}else{return u}}const s=[...a].splice(i.tokenIndex);const o=_y([i.elementStack.map(l=>({feature:l}))],s);return o}*buildContexts(e,n){var r,i;const a=e.parseResult.value.$cstNode;if(!a){return}const s=e.textDocument;const o=s.getText();const l=s.offsetAt(n);const u={document:e,textDocument:s,offset:l,position:n};const c=this.findDataTypeRuleStart(a,l);if(c){const[w,C]=c;const O=(r=kd(a,w))===null||r===void 0?void 0:r.astNode;yield Object.assign(Object.assign({},u),{node:O,tokenOffset:w,tokenEndOffset:C,features:this.findFeaturesAt(s,w)})}const{nextTokenStart:d,nextTokenEnd:f,previousTokenStart:p,previousTokenEnd:y}=this.backtrackToAnyToken(o,l);let v=d;if(l<=d&&p!==void 0){v=p}const b=(i=kd(a,v))===null||i===void 0?void 0:i.astNode;let $=true;if(p!==void 0&&y!==void 0&&y===l){yield Object.assign(Object.assign({},u),{node:b,tokenOffset:p,tokenEndOffset:y,features:this.findFeaturesAt(s,p)});$=this.performNextTokenCompletion(e,o.substring(p,y),p,y);if($){yield Object.assign(Object.assign({},u),{node:b,tokenOffset:y,tokenEndOffset:y,features:this.findFeaturesAt(s,y)})}}if(!b){const w=Pd(this.grammar);if(!w){throw new Error("Missing entry parser rule")}yield Object.assign(Object.assign({},u),{tokenOffset:d,tokenEndOffset:f,features:Zf(w.definition)})}else if($){yield Object.assign(Object.assign({},u),{node:b,tokenOffset:d,tokenEndOffset:f,features:this.findFeaturesAt(s,d)})}}performNextTokenCompletion(e,n,r,i){return/\P{L}$/u.test(n)}findDataTypeRuleStart(e,n){var r,i;let a=yr(e,n,this.grammarConfig.nameRegexp);let s=Boolean((r=Nn(a===null||a===void 0?void 0:a.grammarSource,it))===null||r===void 0?void 0:r.dataType);if(s){while(s){a=a===null||a===void 0?void 0:a.container;s=Boolean((i=Nn(a===null||a===void 0?void 0:a.grammarSource,it))===null||i===void 0?void 0:i.dataType)}if(a){return[a.offset,a.end]}}return void 0}continueCompletion(e){return e.length===0}backtrackToAnyToken(e,n){const r=this.lexer.tokenize(e).tokens;if(r.length===0){return{nextTokenStart:n,nextTokenEnd:n}}let i;for(const a of r){if(a.startOffset>=n){return{nextTokenStart:n,nextTokenEnd:n,previousTokenStart:i?i.startOffset:void 0,previousTokenEnd:i?i.endOffset+1:void 0}}if(a.endOffset>=n){return{nextTokenStart:a.startOffset,nextTokenEnd:a.endOffset+1,previousTokenStart:i?i.startOffset:void 0,previousTokenEnd:i?i.endOffset+1:void 0}}i=a}return{nextTokenStart:n,nextTokenEnd:n,previousTokenStart:i?i.startOffset:void 0,previousTokenEnd:i?i.endOffset+1:void 0}}completionFor(e,n,r){if(sn(n.feature)){return this.completionForKeyword(e,n.feature,r)}else if(za(n.feature)&&e.node){return this.completionForCrossReference(e,n,r)}}completionForCrossReference(e,n,r){const i=Nn(n.feature,an);let a=e.node;if(i&&a){if(n.type){a={$type:n.type,$container:a,$containerProperty:n.property};Tg(this.astReflection,a)}const s={reference:{$refText:""},container:a,property:i.feature};try{for(const o of this.getReferenceCandidates(s,e)){r(e,this.createReferenceCompletionItem(o))}}catch(o){console.error(o)}}}getReferenceCandidates(e,n){return this.scopeProvider.getScope(e).getAllElements()}createReferenceCompletionItem(e){const n=this.nodeKindProvider.getCompletionItemKind(e);const r=this.getReferenceDocumentation(e);return{nodeDescription:e,kind:n,documentation:r,detail:e.type,sortText:"0"}}getReferenceDocumentation(e){if(!e.node){return void 0}const n=this.documentationProvider.getDocumentation(e.node);if(!n){return void 0}return{kind:"markdown",value:n}}completionForKeyword(e,n,r){if(!this.filterKeyword(e,n)){return}r(e,{label:n.value,kind:this.getKeywordCompletionItemKind(n),detail:"Keyword",sortText:"1"})}getKeywordCompletionItemKind(e){return U.CompletionItemKind.Keyword}filterKeyword(e,n){return/\p{L}/u.test(n.value)}fillCompletionItem(e,n){var r,i;let a;if(typeof n.label==="string"){a=n.label}else if("node"in n){const u=this.nameProvider.getName(n.node);if(!u){return void 0}a=u}else if("nodeDescription"in n){a=n.nodeDescription.name}else{return void 0}let s;if(typeof((r=n.textEdit)===null||r===void 0?void 0:r.newText)==="string"){s=n.textEdit.newText}else if(typeof n.insertText==="string"){s=n.insertText}else{s=a}const o=(i=n.textEdit)!==null&&i!==void 0?i:this.buildCompletionTextEdit(e,a,s);if(!o){return void 0}const l={additionalTextEdits:n.additionalTextEdits,command:n.command,commitCharacters:n.commitCharacters,data:n.data,detail:n.detail,documentation:n.documentation,filterText:n.filterText,insertText:n.insertText,insertTextFormat:n.insertTextFormat,insertTextMode:n.insertTextMode,kind:n.kind,labelDetails:n.labelDetails,preselect:n.preselect,sortText:n.sortText,tags:n.tags,textEditText:n.textEditText,textEdit:o,label:a};return l}buildCompletionTextEdit(e,n,r){const i=e.textDocument.getText();const a=i.substring(e.tokenOffset,e.offset);if(this.fuzzyMatcher.match(a,n)){const s=e.textDocument.positionAt(e.tokenOffset);const o=e.position;return{newText:r,range:{start:s,end:o}}}else{return void 0}}}class K_{constructor(e){this.nameProvider=e.references.NameProvider;this.references=e.references.References;this.grammarConfig=e.parser.GrammarConfig}getDefinition(e,n,r){const i=e.parseResult.value;if(i.$cstNode){const a=i.$cstNode;const s=yr(a,e.textDocument.offsetAt(n.position),this.grammarConfig.nameRegexp);if(s){return this.collectLocationLinks(s,n)}}return void 0}collectLocationLinks(e,n){var r;const i=this.findLink(e);if(i){return[U.LocationLink.create(i.targetDocument.textDocument.uri,((r=i.target.astNode.$cstNode)!==null&&r!==void 0?r:i.target).range,i.target.range,i.source.range)]}return void 0}findLink(e){const n=this.references.findDeclarationNode(e);if(n===null||n===void 0?void 0:n.astNode){const r=ct(n.astNode);if(n&&r){return{source:e,target:n,targetDocument:r}}}return void 0}}class F_{constructor(e){this.references=e.references.References;this.nameProvider=e.references.NameProvider;this.grammarConfig=e.parser.GrammarConfig}getDocumentHighlight(e,n,r){const i=e.parseResult.value.$cstNode;if(!i){return void 0}const a=yr(i,e.textDocument.offsetAt(n.position),this.grammarConfig.nameRegexp);if(!a){return void 0}const s=this.references.findDeclaration(a);if(s){const o=Ue.equals(ct(s).uri,e.uri);const l={documentUri:e.uri,includeDeclaration:o};const u=this.references.findReferences(s,l);return u.map(c=>this.createDocumentHighlight(c)).toArray()}return void 0}createDocumentHighlight(e){return U.DocumentHighlight.create(e.segment.range)}}class U_{constructor(e){this.nameProvider=e.references.NameProvider;this.nodeKindProvider=e.shared.lsp.NodeKindProvider}getSymbols(e,n,r){return this.getSymbol(e,e.parseResult.value)}getSymbol(e,n){const r=n.$cstNode;const i=this.nameProvider.getNameNode(n);if(i&&r){const a=this.nameProvider.getName(n);return[{kind:this.nodeKindProvider.getSymbolKind(n),name:a||i.text,range:r.range,selectionRange:i.range,children:this.getChildSymbols(e,n)}]}else{return this.getChildSymbols(e,n)||[]}}getChildSymbols(e,n){const r=[];for(const i of Ou(n)){const a=this.getSymbol(e,i);r.push(...a)}if(r.length>0){return r}return void 0}}class J${constructor(e){this.workspaceManager=e.workspace.WorkspaceManager;this.documentBuilder=e.workspace.DocumentBuilder;this.workspaceLock=e.workspace.WorkspaceLock;this.serviceRegistry=e.ServiceRegistry;let n=false;e.lsp.LanguageServer.onInitialize(r=>{var i,a;n=Boolean((a=(i=r.capabilities.workspace)===null||i===void 0?void 0:i.didChangeWatchedFiles)===null||a===void 0?void 0:a.dynamicRegistration)});e.lsp.LanguageServer.onInitialized(r=>{if(n){this.registerFileWatcher(e)}})}registerFileWatcher(e){const n=be(e.ServiceRegistry.all).flatMap(r=>r.LanguageMetaData.fileExtensions).map(r=>r.startsWith(".")?r.substring(1):r).distinct().toArray();if(n.length>0){const r=e.lsp.Connection;const i={watchers:[{globPattern:n.length===1?`**/*.${n[0]}`:`**/*.{${n.join(",")}}`}]};r===null||r===void 0?void 0:r.client.register(U.DidChangeWatchedFilesNotification.type,i)}}fireDocumentUpdate(e,n){e=e.filter(r=>this.serviceRegistry.hasServices(r));this.workspaceManager.ready.then(()=>{this.workspaceLock.write(r=>this.documentBuilder.update(e,n,r))}).catch(r=>{console.error("Workspace initialization failed. Could not perform document update.",r)})}didChangeContent(e){this.fireDocumentUpdate([dt.parse(e.document.uri)],[])}didChangeWatchedFiles(e){const n=be(e.changes).filter(i=>i.type!==U.FileChangeType.Deleted).distinct(i=>i.uri).map(i=>dt.parse(i.uri)).toArray();const r=be(e.changes).filter(i=>i.type===U.FileChangeType.Deleted).distinct(i=>i.uri).map(i=>dt.parse(i.uri)).toArray();this.fireDocumentUpdate(n,r)}}class G_{constructor(e){this.commentNames=e.parser.GrammarConfig.multilineCommentRules}getFoldingRanges(e,n,r){const i=[];const a=s=>i.push(s);this.collectFolding(e,a);return i}collectFolding(e,n){var r;const i=(r=e.parseResult)===null||r===void 0?void 0:r.value;if(i){if(this.shouldProcessContent(i)){const a=Er(i).iterator();let s;do{s=a.next();if(!s.done){const o=s.value;if(this.shouldProcess(o)){this.collectObjectFolding(e,o,n)}if(!this.shouldProcessContent(o)){a.prune()}}}while(!s.done)}this.collectCommentFolding(e,i,n)}}shouldProcess(e){return true}shouldProcessContent(e){return true}collectObjectFolding(e,n,r){const i=n.$cstNode;if(i){const a=this.toFoldingRange(e,i);if(a){r(a)}}}collectCommentFolding(e,n,r){const i=n.$cstNode;if(i){for(const a of iv(i)){if(this.commentNames.includes(a.tokenType.name)){const s=this.toFoldingRange(e,a,U.FoldingRangeKind.Comment);if(s){r(s)}}}}}toFoldingRange(e,n,r){const i=n.range;const a=i.start;let s=i.end;if(s.line-a.line<2){return void 0}if(!this.includeLastFoldingLine(n,r)){s=e.textDocument.positionAt(e.textDocument.offsetAt({line:s.line,character:0})-1)}return U.FoldingRange.create(a.line,s.line,a.character,s.character,r)}includeLastFoldingLine(e,n){if(n===U.FoldingRangeKind.Comment){return false}const r=e.text;const i=r.charAt(r.length-1);if(i==="}"||i===")"||i==="]"){return false}return true}}class H_{match(e,n){if(e.length===0){return true}let r=false;let i;let a=0;const s=n.length;for(let o=0;o<s;o++){const l=n.charCodeAt(o);const u=e.charCodeAt(a);if(l===u||this.toUpperCharCode(l)===this.toUpperCharCode(u)){r||(r=i===void 0||this.isWordTransition(i,l));if(r){a++}if(a===e.length){return true}}i=l}return false}isWordTransition(e,n){return Dy<=e&&e<=Iy&&q_<=n&&n<=j_||e===Oy&&n!==Oy}toUpperCharCode(e){if(Dy<=e&&e<=Iy){return e-32}return e}}const Dy="a".charCodeAt(0);const Iy="z".charCodeAt(0);const q_="A".charCodeAt(0);const j_="Z".charCodeAt(0);const Oy="_".charCodeAt(0);class B_{constructor(e){this.references=e.references.References;this.grammarConfig=e.parser.GrammarConfig}getHoverContent(e,n){var r,i;const a=(i=(r=e.parseResult)===null||r===void 0?void 0:r.value)===null||i===void 0?void 0:i.$cstNode;if(a){const s=e.textDocument.offsetAt(n.position);const o=yr(a,s,this.grammarConfig.nameRegexp);if(o&&o.offset+o.length>s){const l=this.references.findDeclaration(o);if(l){return this.getAstNodeHoverContent(l)}}}return void 0}}class W_ extends B_{constructor(e){super(e);this.documentationProvider=e.documentation.DocumentationProvider}getAstNodeHoverContent(e){const n=this.documentationProvider.getDocumentation(e);if(n){return{contents:{kind:"markdown",value:n}}}return void 0}}var pr=Fe();const V_={[U.SemanticTokenTypes.class]:0,[U.SemanticTokenTypes.comment]:1,[U.SemanticTokenTypes.enum]:2,[U.SemanticTokenTypes.enumMember]:3,[U.SemanticTokenTypes.event]:4,[U.SemanticTokenTypes.function]:5,[U.SemanticTokenTypes.interface]:6,[U.SemanticTokenTypes.keyword]:7,[U.SemanticTokenTypes.macro]:8,[U.SemanticTokenTypes.method]:9,[U.SemanticTokenTypes.modifier]:10,[U.SemanticTokenTypes.namespace]:11,[U.SemanticTokenTypes.number]:12,[U.SemanticTokenTypes.operator]:13,[U.SemanticTokenTypes.parameter]:14,[U.SemanticTokenTypes.property]:15,[U.SemanticTokenTypes.regexp]:16,[U.SemanticTokenTypes.string]:17,[U.SemanticTokenTypes.struct]:18,[U.SemanticTokenTypes.type]:19,[U.SemanticTokenTypes.typeParameter]:20,[U.SemanticTokenTypes.variable]:21,[U.SemanticTokenTypes.decorator]:22};const z_={[U.SemanticTokenModifiers.abstract]:1<<0,[U.SemanticTokenModifiers.async]:1<<1,[U.SemanticTokenModifiers.declaration]:1<<2,[U.SemanticTokenModifiers.defaultLibrary]:1<<3,[U.SemanticTokenModifiers.definition]:1<<4,[U.SemanticTokenModifiers.deprecated]:1<<5,[U.SemanticTokenModifiers.documentation]:1<<6,[U.SemanticTokenModifiers.modification]:1<<7,[U.SemanticTokenModifiers.readonly]:1<<8,[U.SemanticTokenModifiers.static]:1<<9};function X_(t){const e=[];const n=[];let r=true;let i=true;let a=true;for(const s of t){if(!s){continue}s.legend.tokenTypes.forEach((o,l)=>{const u=e[l];if(u&&u!==o){throw new Error(`Cannot merge '${u}' and '${o}' token types. They use the same index ${l}.`)}else{e[l]=o}});s.legend.tokenModifiers.forEach((o,l)=>{const u=n[l];if(u&&u!==o){throw new Error(`Cannot merge '${u}' and '${o}' token modifier. They use the same index ${l}.`)}else{n[l]=o}});if(!s.full){r=false}else if(typeof s.full==="object"&&!s.full.delta){i=false}if(!s.range){a=false}}return{legend:{tokenTypes:e,tokenModifiers:n},full:r&&{delta:i},range:a}}class Y_ extends U.SemanticTokensBuilder{constructor(){super(...arguments);this._tokens=[]}push(e,n,r,i,a){this._tokens.push({line:e,char:n,length:r,tokenType:i,tokenModifiers:a})}build(){this.applyTokens();return super.build()}buildEdits(){this.applyTokens();return super.buildEdits()}flush(){this.previousResult(this.id)}applyTokens(){for(const e of this._tokens.sort(this.compareTokens)){super.push(e.line,e.char,e.length,e.tokenType,e.tokenModifiers)}this._tokens=[]}compareTokens(e,n){if(e.line===n.line){return e.char-n.char}return e.line-n.line}}class J_{constructor(e){this.tokensBuilders=new Map;e.shared.workspace.TextDocuments.onDidClose(n=>{this.tokensBuilders.delete(n.document.uri)});e.shared.lsp.LanguageServer.onInitialize(n=>{var r;this.initialize((r=n.capabilities.textDocument)===null||r===void 0?void 0:r.semanticTokens)})}initialize(e){this.clientCapabilities=e}get tokenTypes(){return V_}get tokenModifiers(){return z_}get semanticTokensOptions(){return{legend:{tokenTypes:Object.keys(this.tokenTypes),tokenModifiers:Object.keys(this.tokenModifiers)},full:{delta:true},range:true}}async semanticHighlight(e,n,r=he.CancellationToken.None){this.currentRange=void 0;this.currentDocument=e;this.currentTokensBuilder=this.getDocumentTokensBuilder(e);this.currentTokensBuilder.flush();await this.computeHighlighting(e,this.createAcceptor(),r);return this.currentTokensBuilder.build()}async semanticHighlightRange(e,n,r=he.CancellationToken.None){this.currentRange=n.range;this.currentDocument=e;this.currentTokensBuilder=this.getDocumentTokensBuilder(e);this.currentTokensBuilder.flush();await this.computeHighlighting(e,this.createAcceptor(),r);return this.currentTokensBuilder.build()}async semanticHighlightDelta(e,n,r=he.CancellationToken.None){this.currentRange=void 0;this.currentDocument=e;this.currentTokensBuilder=this.getDocumentTokensBuilder(e);this.currentTokensBuilder.previousResult(n.previousResultId);await this.computeHighlighting(e,this.createAcceptor(),r);return this.currentTokensBuilder.buildEdits()}createAcceptor(){const e=n=>{if("line"in n){this.highlightToken({range:{start:{line:n.line,character:n.char},end:{line:n.line,character:n.char+n.length}},type:n.type,modifier:n.modifier})}else if("range"in n){this.highlightToken(n)}else if("keyword"in n){this.highlightKeyword(n)}else if("property"in n){this.highlightProperty(n)}else{this.highlightNode({node:n.cst,type:n.type,modifier:n.modifier})}};return e}getDocumentTokensBuilder(e){const n=this.tokensBuilders.get(e.uri.toString());if(n){return n}const r=new Y_;this.tokensBuilders.set(e.uri.toString(),r);return r}async computeHighlighting(e,n,r){const i=e.parseResult.value;const a=Bn(i,{range:this.currentRange}).iterator();let s;do{s=a.next();if(!s.done){await ut(r);const o=s.value;if(this.highlightElement(o,n)==="prune"){a.prune()}}}while(!s.done)}highlightToken(e){var n;const{range:r,type:i}=e;let a=e.modifier;if(this.currentRange&&!cg(r,this.currentRange)||!this.currentDocument||!this.currentTokensBuilder){return}const s=this.tokenTypes[i];let o=0;if(a!==void 0){if(typeof a==="string"){a=[a]}for(const c of a){const d=this.tokenModifiers[c];o|=d}}const l=r.start.line;const u=r.end.line;if(l===u){const c=r.start.character;const d=r.end.character-c;this.currentTokensBuilder.push(l,c,d,s,o)}else if((n=this.clientCapabilities)===null||n===void 0?void 0:n.multilineTokenSupport){const c=r.start.character;const d=this.currentDocument.textDocument.offsetAt(r.start);const f=this.currentDocument.textDocument.offsetAt(r.end);this.currentTokensBuilder.push(l,c,f-d,s,o)}else{const c=r.start;let d=this.currentDocument.textDocument.offsetAt({line:l+1,character:0});this.currentTokensBuilder.push(c.line,c.character,d-c.character-1,s,o);for(let f=l+1;f<u;f++){const p=d;d=this.currentDocument.textDocument.offsetAt({line:f+1,character:0});this.currentTokensBuilder.push(f,0,d-p-1,s,o)}this.currentTokensBuilder.push(u,0,r.end.character,s,o)}}highlightProperty(e){const n=[];if(typeof e.index==="number"){const a=rp(e.node.$cstNode,e.property,e.index);if(a){n.push(a)}}else{n.push(...Ag(e.node.$cstNode,e.property))}const{type:r,modifier:i}=e;for(const a of n){this.highlightNode({node:a,type:r,modifier:i})}}highlightKeyword(e){const{node:n,keyword:r,type:i,index:a,modifier:s}=e;const o=[];if(typeof a==="number"){const l=bg(n.$cstNode,r,a);if(l){o.push(l)}}else{o.push(...Fv(n.$cstNode,r))}for(const l of o){this.highlightNode({node:l,type:i,modifier:s})}}highlightNode(e){const{node:n,type:r,modifier:i}=e;const a=n.range;this.highlightToken({range:a,type:r,modifier:i})}}var Ly;(function(t){function e(r,i,a){const s=new Map;Object.entries(i).forEach(([u,c])=>s.set(c,u));let o=0;let l=0;return n(r.data,5).map(u=>{o+=u[0];if(u[0]!==0){l=0}l+=u[1];const c=u[2];const d=a.textDocument.offsetAt({line:o,character:l});return{offset:d,tokenType:s.get(u[3]),tokenModifiers:u[4],text:a.textDocument.getText({start:{line:o,character:l},end:{line:o,character:l+c}})}})}t.decode=e;function n(r,i){const a=[];for(let s=0;s<r.length;s+=i){const o=r.slice(s,s+i);a.push(o)}return a}})(Ly||(Ly={}));function Q_(t){const e=[];const n=[];t.forEach(i=>{if(i===null||i===void 0?void 0:i.triggerCharacters){e.push(...i.triggerCharacters)}if(i===null||i===void 0?void 0:i.retriggerCharacters){n.push(...i.retriggerCharacters)}});const r={triggerCharacters:e.length>0?Array.from(new Set(e)).sort():void 0,retriggerCharacters:n.length>0?Array.from(new Set(n)).sort():void 0};return r.triggerCharacters?r:void 0}class Z_{constructor(e){this.onInitializeEmitter=new pr.Emitter;this.onInitializedEmitter=new pr.Emitter;this.services=e}get onInitialize(){return this.onInitializeEmitter.event}get onInitialized(){return this.onInitializedEmitter.event}async initialize(e){this.eagerLoadServices();this.fireInitializeOnDefaultServices(e);this.onInitializeEmitter.fire(e);this.onInitializeEmitter.dispose();return this.buildInitializeResult(e)}eagerLoadServices(){Jf(this.services);this.services.ServiceRegistry.all.forEach(e=>Jf(e))}hasService(e){const n=this.services.ServiceRegistry.all;return n.some(r=>e(r)!==void 0)}buildInitializeResult(e){var n,r,i,a;const s=this.services.lsp.DocumentUpdateHandler;const o=(n=this.services.lsp.FileOperationHandler)===null||n===void 0?void 0:n.fileOperationOptions;const l=this.services.ServiceRegistry.all;const u=this.hasService(F=>{var N;return(N=F.lsp)===null||N===void 0?void 0:N.Formatter});const c=l.map(F=>{var N,ne;return(ne=(N=F.lsp)===null||N===void 0?void 0:N.Formatter)===null||ne===void 0?void 0:ne.formatOnTypeOptions}).find(F=>Boolean(F));const d=this.hasService(F=>{var N;return(N=F.lsp)===null||N===void 0?void 0:N.CodeActionProvider});const f=this.hasService(F=>{var N;return(N=F.lsp)===null||N===void 0?void 0:N.SemanticTokenProvider});const p=X_(l.map(F=>{var N,ne;return(ne=(N=F.lsp)===null||N===void 0?void 0:N.SemanticTokenProvider)===null||ne===void 0?void 0:ne.semanticTokensOptions}));const y=(i=(r=this.services.lsp)===null||r===void 0?void 0:r.ExecuteCommandHandler)===null||i===void 0?void 0:i.commands;const v=this.hasService(F=>{var N;return(N=F.lsp)===null||N===void 0?void 0:N.DocumentLinkProvider});const b=Q_(l.map(F=>{var N,ne;return(ne=(N=F.lsp)===null||N===void 0?void 0:N.SignatureHelp)===null||ne===void 0?void 0:ne.signatureHelpOptions}));const $=this.hasService(F=>{var N;return(N=F.lsp)===null||N===void 0?void 0:N.TypeProvider});const w=this.hasService(F=>{var N;return(N=F.lsp)===null||N===void 0?void 0:N.ImplementationProvider});const C=this.hasService(F=>{var N;return(N=F.lsp)===null||N===void 0?void 0:N.CompletionProvider});const O=M_(l.map(F=>{var N,ne;return(ne=(N=F.lsp)===null||N===void 0?void 0:N.CompletionProvider)===null||ne===void 0?void 0:ne.completionOptions}));const Y=this.hasService(F=>{var N;return(N=F.lsp)===null||N===void 0?void 0:N.ReferencesProvider});const q=this.hasService(F=>{var N;return(N=F.lsp)===null||N===void 0?void 0:N.DocumentSymbolProvider});const J=this.hasService(F=>{var N;return(N=F.lsp)===null||N===void 0?void 0:N.DefinitionProvider});const te=this.hasService(F=>{var N;return(N=F.lsp)===null||N===void 0?void 0:N.DocumentHighlightProvider});const ie=this.hasService(F=>{var N;return(N=F.lsp)===null||N===void 0?void 0:N.FoldingRangeProvider});const ce=this.hasService(F=>{var N;return(N=F.lsp)===null||N===void 0?void 0:N.HoverProvider});const L=this.hasService(F=>{var N;return(N=F.lsp)===null||N===void 0?void 0:N.RenameProvider});const E=this.hasService(F=>{var N;return(N=F.lsp)===null||N===void 0?void 0:N.CallHierarchyProvider});const g=this.hasService(F=>{var N;return(N=F.lsp)===null||N===void 0?void 0:N.TypeHierarchyProvider});const k=this.hasService(F=>{var N;return(N=F.lsp)===null||N===void 0?void 0:N.CodeLensProvider});const M=this.hasService(F=>{var N;return(N=F.lsp)===null||N===void 0?void 0:N.DeclarationProvider});const I=this.hasService(F=>{var N;return(N=F.lsp)===null||N===void 0?void 0:N.InlayHintProvider});const x=(a=this.services.lsp)===null||a===void 0?void 0:a.WorkspaceSymbolProvider;const we={capabilities:{workspace:{workspaceFolders:{supported:true},fileOperations:o},executeCommandProvider:y&&{commands:y},textDocumentSync:{change:pr.TextDocumentSyncKind.Incremental,openClose:true,save:Boolean(s.didSaveDocument),willSave:Boolean(s.willSaveDocument),willSaveWaitUntil:Boolean(s.willSaveDocumentWaitUntil)},completionProvider:C?O:void 0,referencesProvider:Y,documentSymbolProvider:q,definitionProvider:J,typeDefinitionProvider:$,documentHighlightProvider:te,codeActionProvider:d,documentFormattingProvider:u,documentRangeFormattingProvider:u,documentOnTypeFormattingProvider:c,foldingRangeProvider:ie,hoverProvider:ce,renameProvider:L?{prepareProvider:true}:void 0,semanticTokensProvider:f?p:void 0,signatureHelpProvider:b,implementationProvider:w,callHierarchyProvider:E?{}:void 0,typeHierarchyProvider:g?{}:void 0,documentLinkProvider:v?{resolveProvider:false}:void 0,codeLensProvider:k?{resolveProvider:false}:void 0,declarationProvider:M,inlayHintProvider:I?{resolveProvider:false}:void 0,workspaceSymbolProvider:x?{resolveProvider:Boolean(x.resolveSymbol)}:void 0}};return we}initialized(e){this.fireInitializedOnDefaultServices(e);this.onInitializedEmitter.fire(e);this.onInitializedEmitter.dispose()}fireInitializeOnDefaultServices(e){this.services.workspace.ConfigurationProvider.initialize(e);this.services.workspace.WorkspaceManager.initialize(e)}fireInitializedOnDefaultServices(e){const n=this.services.lsp.Connection;const r=n?Object.assign(Object.assign({},e),{register:i=>n.client.register(pr.DidChangeConfigurationNotification.type,i),fetchConfiguration:i=>n.workspace.getConfiguration(i)}):e;this.services.workspace.ConfigurationProvider.initialized(r).catch(i=>console.error("Error in ConfigurationProvider initialization:",i));this.services.workspace.WorkspaceManager.initialized(e).catch(i=>console.error("Error in WorkspaceManager initialization:",i))}}function eD(t){const e=t.lsp.Connection;if(!e){throw new Error("Starting a language server requires the languageServer.Connection service to be set.")}tD(e,t);nD(e,t);rD(e,t);iD(e,t);aD(e,t);oD(e,t);lD(e,t);uD(e,t);cD(e,t);fD(e,t);mD(e,t);hD(e,t);sD(e,t);yD(e,t);pD(e,t);gD(e,t);RD(e,t);vD(e,t);wD(e,t);SD(e,t);AD(e,t);ED(e,t);TD(e,t);$D(e,t);dD(e,t);CD(e,t);e.onInitialize(r=>{return t.lsp.LanguageServer.initialize(r)});e.onInitialized(r=>{t.lsp.LanguageServer.initialized(r)});const n=t.workspace.TextDocuments;n.listen(e);e.listen()}function tD(t,e){const n=e.lsp.DocumentUpdateHandler;const r=e.workspace.TextDocuments;if(n.didOpenDocument){r.onDidOpen(i=>n.didOpenDocument(i))}if(n.didChangeContent){r.onDidChangeContent(i=>n.didChangeContent(i))}if(n.didCloseDocument){r.onDidClose(i=>n.didCloseDocument(i))}if(n.didSaveDocument){r.onDidSave(i=>n.didSaveDocument(i))}if(n.willSaveDocument){r.onWillSave(i=>n.willSaveDocument(i))}if(n.willSaveDocumentWaitUntil){r.onWillSaveWaitUntil(i=>n.willSaveDocumentWaitUntil(i))}if(n.didChangeWatchedFiles){t.onDidChangeWatchedFiles(i=>n.didChangeWatchedFiles(i))}}function nD(t,e){const n=e.lsp.FileOperationHandler;if(!n){return}if(n.didCreateFiles){t.workspace.onDidCreateFiles(r=>n.didCreateFiles(r))}if(n.didRenameFiles){t.workspace.onDidRenameFiles(r=>n.didRenameFiles(r))}if(n.didDeleteFiles){t.workspace.onDidDeleteFiles(r=>n.didDeleteFiles(r))}if(n.willCreateFiles){t.workspace.onWillCreateFiles(r=>n.willCreateFiles(r))}if(n.willRenameFiles){t.workspace.onWillRenameFiles(r=>n.willRenameFiles(r))}if(n.willDeleteFiles){t.workspace.onWillDeleteFiles(r=>n.willDeleteFiles(r))}}function rD(t,e){const n=e.workspace.DocumentBuilder;n.onUpdate(async(r,i)=>{for(const a of i){t.sendDiagnostics({uri:a.toString(),diagnostics:[]})}});n.onDocumentPhase(z.Validated,async r=>{if(r.diagnostics){t.sendDiagnostics({uri:r.uri.toString(),diagnostics:r.diagnostics})}})}function iD(t,e){t.onCompletion(rt((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.CompletionProvider)===null||o===void 0?void 0:o.getCompletion(r,i,a)},e,z.IndexedReferences))}function aD(t,e){t.onReferences(rt((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.ReferencesProvider)===null||o===void 0?void 0:o.findReferences(r,i,a)},e,z.IndexedReferences))}function sD(t,e){t.onCodeAction(rt((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.CodeActionProvider)===null||o===void 0?void 0:o.getCodeActions(r,i,a)},e,z.Validated))}function oD(t,e){t.onDocumentSymbol(rt((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.DocumentSymbolProvider)===null||o===void 0?void 0:o.getSymbols(r,i,a)},e,z.Parsed))}function lD(t,e){t.onDefinition(rt((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.DefinitionProvider)===null||o===void 0?void 0:o.getDefinition(r,i,a)},e,z.IndexedReferences))}function uD(t,e){t.onTypeDefinition(rt((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.TypeProvider)===null||o===void 0?void 0:o.getTypeDefinition(r,i,a)},e,z.IndexedReferences))}function cD(t,e){t.onImplementation(rt((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.ImplementationProvider)===null||o===void 0?void 0:o.getImplementation(r,i,a)},e,z.IndexedReferences))}function dD(t,e){t.onDeclaration(rt((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.DeclarationProvider)===null||o===void 0?void 0:o.getDeclaration(r,i,a)},e,z.IndexedReferences))}function fD(t,e){t.onDocumentHighlight(rt((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.DocumentHighlightProvider)===null||o===void 0?void 0:o.getDocumentHighlight(r,i,a)},e,z.IndexedReferences))}function pD(t,e){t.onHover(rt((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.HoverProvider)===null||o===void 0?void 0:o.getHoverContent(r,i,a)},e,z.IndexedReferences))}function mD(t,e){t.onFoldingRanges(rt((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.FoldingRangeProvider)===null||o===void 0?void 0:o.getFoldingRanges(r,i,a)},e,z.Parsed))}function hD(t,e){t.onDocumentFormatting(rt((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.Formatter)===null||o===void 0?void 0:o.formatDocument(r,i,a)},e,z.Parsed));t.onDocumentRangeFormatting(rt((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.Formatter)===null||o===void 0?void 0:o.formatDocumentRange(r,i,a)},e,z.Parsed));t.onDocumentOnTypeFormatting(rt((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.Formatter)===null||o===void 0?void 0:o.formatDocumentOnType(r,i,a)},e,z.Parsed))}function yD(t,e){t.onRenameRequest(rt((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.RenameProvider)===null||o===void 0?void 0:o.rename(r,i,a)},e,z.IndexedReferences));t.onPrepareRename(rt((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.RenameProvider)===null||o===void 0?void 0:o.prepareRename(r,i,a)},e,z.IndexedReferences))}function gD(t,e){t.languages.inlayHint.on(_n((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.InlayHintProvider)===null||o===void 0?void 0:o.getInlayHints(r,i,a)},e,z.IndexedReferences))}function RD(t,e){const n={data:[]};t.languages.semanticTokens.on(_n((r,i,a,s)=>{var o;if((o=r.lsp)===null||o===void 0?void 0:o.SemanticTokenProvider){return r.lsp.SemanticTokenProvider.semanticHighlight(i,a,s)}return n},e,z.IndexedReferences));t.languages.semanticTokens.onDelta(_n((r,i,a,s)=>{var o;if((o=r.lsp)===null||o===void 0?void 0:o.SemanticTokenProvider){return r.lsp.SemanticTokenProvider.semanticHighlightDelta(i,a,s)}return n},e,z.IndexedReferences));t.languages.semanticTokens.onRange(_n((r,i,a,s)=>{var o;if((o=r.lsp)===null||o===void 0?void 0:o.SemanticTokenProvider){return r.lsp.SemanticTokenProvider.semanticHighlightRange(i,a,s)}return n},e,z.IndexedReferences))}function $D(t,e){t.onDidChangeConfiguration(n=>{if(n.settings){e.workspace.ConfigurationProvider.updateConfiguration(n)}})}function vD(t,e){const n=e.lsp.ExecuteCommandHandler;if(n){t.onExecuteCommand(async(r,i)=>{var a;try{return await n.executeCommand(r.command,(a=r.arguments)!==null&&a!==void 0?a:[],i)}catch(s){return xn(s)}})}}function TD(t,e){t.onDocumentLinks(_n((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.DocumentLinkProvider)===null||o===void 0?void 0:o.getDocumentLinks(r,i,a)},e,z.Parsed))}function wD(t,e){t.onSignatureHelp(_n((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.SignatureHelp)===null||o===void 0?void 0:o.provideSignatureHelp(r,i,a)},e,z.IndexedReferences))}function ED(t,e){t.onCodeLens(_n((n,r,i,a)=>{var s,o;return(o=(s=n.lsp)===null||s===void 0?void 0:s.CodeLensProvider)===null||o===void 0?void 0:o.provideCodeLens(r,i,a)},e,z.IndexedReferences))}function CD(t,e){var n;const r=e.lsp.WorkspaceSymbolProvider;if(r){const i=e.workspace.DocumentBuilder;t.onWorkspaceSymbol(async(s,o)=>{try{await i.waitUntil(z.IndexedContent,o);return await r.getSymbols(s,o)}catch(l){return xn(l)}});const a=(n=r.resolveSymbol)===null||n===void 0?void 0:n.bind(r);if(a){t.onWorkspaceSymbolResolve(async(s,o)=>{try{await i.waitUntil(z.IndexedContent,o);return await a(s,o)}catch(l){return xn(l)}})}}}function SD(t,e){t.languages.callHierarchy.onPrepare(_n(async(n,r,i,a)=>{var s;if((s=n.lsp)===null||s===void 0?void 0:s.CallHierarchyProvider){const o=await n.lsp.CallHierarchyProvider.prepareCallHierarchy(r,i,a);return o!==null&&o!==void 0?o:null}return null},e,z.IndexedReferences));t.languages.callHierarchy.onIncomingCalls(Du(async(n,r,i)=>{var a;if((a=n.lsp)===null||a===void 0?void 0:a.CallHierarchyProvider){const s=await n.lsp.CallHierarchyProvider.incomingCalls(r,i);return s!==null&&s!==void 0?s:null}return null},e));t.languages.callHierarchy.onOutgoingCalls(Du(async(n,r,i)=>{var a;if((a=n.lsp)===null||a===void 0?void 0:a.CallHierarchyProvider){const s=await n.lsp.CallHierarchyProvider.outgoingCalls(r,i);return s!==null&&s!==void 0?s:null}return null},e))}function AD(t,e){if(!e.ServiceRegistry.all.some(n=>{var r;return(r=n.lsp)===null||r===void 0?void 0:r.TypeHierarchyProvider})){return}t.languages.typeHierarchy.onPrepare(_n(async(n,r,i,a)=>{var s,o;const l=await((o=(s=n.lsp)===null||s===void 0?void 0:s.TypeHierarchyProvider)===null||o===void 0?void 0:o.prepareTypeHierarchy(r,i,a));return l!==null&&l!==void 0?l:null},e,z.IndexedReferences));t.languages.typeHierarchy.onSupertypes(Du(async(n,r,i)=>{var a,s;const o=await((s=(a=n.lsp)===null||a===void 0?void 0:a.TypeHierarchyProvider)===null||s===void 0?void 0:s.supertypes(r,i));return o!==null&&o!==void 0?o:null},e));t.languages.typeHierarchy.onSubtypes(Du(async(n,r,i)=>{var a,s;const o=await((s=(a=n.lsp)===null||a===void 0?void 0:a.TypeHierarchyProvider)===null||s===void 0?void 0:s.subtypes(r,i));return o!==null&&o!==void 0?o:null},e))}function Du(t,e){const n=e.ServiceRegistry;return async(r,i)=>{const a=dt.parse(r.item.uri);const s=await qp(e,i,a,z.IndexedReferences);if(s){return s}if(!n.hasServices(a)){const l=`Could not find service instance for uri: '${a}'`;console.debug(l);return xn(new Error(l))}const o=n.getServices(a);try{return await t(o,r,i)}catch(l){return xn(l)}}}function _n(t,e,n){const r=e.workspace.LangiumDocuments;const i=e.ServiceRegistry;return async(a,s)=>{const o=dt.parse(a.textDocument.uri);const l=await qp(e,s,o,n);if(l){return l}if(!i.hasServices(o)){const c=`Could not find service instance for uri: '${o}'`;console.debug(c);return xn(new Error(c))}const u=i.getServices(o);try{const c=await r.getOrCreateDocument(o);return await t(u,c,a,s)}catch(c){return xn(c)}}}function rt(t,e,n){const r=e.workspace.LangiumDocuments;const i=e.ServiceRegistry;return async(a,s)=>{const o=dt.parse(a.textDocument.uri);const l=await qp(e,s,o,n);if(l){return l}if(!i.hasServices(o)){console.debug(`Could not find service instance for uri: '${o.toString()}'`);return null}const u=i.getServices(o);try{const c=await r.getOrCreateDocument(o);return await t(u,c,a,s)}catch(c){return xn(c)}}}async function qp(t,e,n,r){if(r!==void 0){const i=t.workspace.DocumentBuilder;try{await i.waitUntil(r,n,e)}catch(a){return xn(a)}}return void 0}function xn(t){if(ss(t)){return new pr.ResponseError(pr.LSPErrorCodes.RequestCancelled,"The request has been cancelled.")}if(t instanceof pr.ResponseError){return t}throw t}class Q${getSymbolKind(e){return U.SymbolKind.Field}getCompletionItemKind(e){return U.CompletionItemKind.Reference}}class bD{constructor(e){this.nameProvider=e.references.NameProvider;this.references=e.references.References;this.grammarConfig=e.parser.GrammarConfig}findReferences(e,n,r){const i=e.parseResult.value.$cstNode;if(!i){return[]}const a=yr(i,e.textDocument.offsetAt(n.position),this.grammarConfig.nameRegexp);if(!a){return[]}return this.getReferences(a,n,e)}getReferences(e,n,r){const i=[];const a=this.references.findDeclaration(e);if(a){const s={includeDeclaration:n.context.includeDeclaration};this.references.findReferences(a,s).forEach(o=>{i.push(U.Location.create(o.sourceUri.toString(),o.segment.range))})}return i}}class kD{constructor(e){this.references=e.references.References;this.nameProvider=e.references.NameProvider;this.grammarConfig=e.parser.GrammarConfig}async rename(e,n,r){const i={};const a=e.parseResult.value.$cstNode;if(!a)return void 0;const s=e.textDocument.offsetAt(n.position);const o=yr(a,s,this.grammarConfig.nameRegexp);if(!o)return void 0;const l=this.references.findDeclaration(o);if(!l)return void 0;const u={onlyLocal:false,includeDeclaration:true};const c=this.references.findReferences(l,u);c.forEach(d=>{const f=Wt.replace(d.segment.range,n.newName);const p=d.sourceUri.toString();if(i[p]){i[p].push(f)}else{i[p]=[f]}});return{changes:i}}prepareRename(e,n,r){return this.renameNodeRange(e,n.position)}renameNodeRange(e,n){const r=e.parseResult.value.$cstNode;const i=e.textDocument.offsetAt(n);if(r&&i){const a=yr(r,i,this.grammarConfig.nameRegexp);if(!a){return void 0}const s=this.references.findDeclaration(a);if(s||this.isNameNode(a)){return a.range}}return void 0}isNameNode(e){return(e===null||e===void 0?void 0:e.astNode)&&h$(e.astNode)&&e===this.nameProvider.getNameNode(e.astNode)}}class ND{constructor(e){this.indexManager=e.workspace.IndexManager;this.nodeKindProvider=e.lsp.NodeKindProvider;this.fuzzyMatcher=e.lsp.FuzzyMatcher}async getSymbols(e,n=he.CancellationToken.None){const r=[];const i=e.query.toLowerCase();for(const a of this.indexManager.allElements()){await ut(n);if(this.fuzzyMatcher.match(i,a.name)){const s=this.getWorkspaceSymbol(a);if(s){r.push(s)}}}return r}getWorkspaceSymbol(e){const n=e.nameSegment;if(n){return{kind:this.nodeKindProvider.getSymbolKind(e),name:e.name,location:{range:n.range,uri:e.documentUri.toString()}}}else{return void 0}}}class PD{constructor(e){this._configuration=e;this._syncedDocuments=new Map;this._onDidChangeContent=new U.Emitter;this._onDidOpen=new U.Emitter;this._onDidClose=new U.Emitter;this._onDidSave=new U.Emitter;this._onWillSave=new U.Emitter}get onDidOpen(){return this._onDidOpen.event}get onDidChangeContent(){return this._onDidChangeContent.event}get onWillSave(){return this._onWillSave.event}onWillSaveWaitUntil(e){this._willSaveWaitUntil=e}get onDidSave(){return this._onDidSave.event}get onDidClose(){return this._onDidClose.event}get(e){return this._syncedDocuments.get(Ue.normalize(e))}set(e){const n=Ue.normalize(e.uri);let r=true;if(this._syncedDocuments.has(n)){r=false}this._syncedDocuments.set(n,e);const i=Object.freeze({document:e});this._onDidOpen.fire(i);this._onDidChangeContent.fire(i);return r}delete(e){const n=Ue.normalize(typeof e==="object"&&"uri"in e?e.uri:e);const r=this._syncedDocuments.get(n);if(r!==void 0){this._syncedDocuments.delete(n);this._onDidClose.fire(Object.freeze({document:r}))}}all(){return Array.from(this._syncedDocuments.values())}keys(){return Array.from(this._syncedDocuments.keys())}listen(e){e.__textDocumentSync=U.TextDocumentSyncKind.Incremental;const n=[];n.push(e.onDidOpenTextDocument(r=>{const i=r.textDocument;const a=Ue.normalize(i.uri);const s=this._configuration.create(a,i.languageId,i.version,i.text);this._syncedDocuments.set(a,s);const o=Object.freeze({document:s});this._onDidOpen.fire(o);this._onDidChangeContent.fire(o)}));n.push(e.onDidChangeTextDocument(r=>{const i=r.textDocument;const a=r.contentChanges;if(a.length===0){return}const{version:s}=i;if(s===null||s===void 0){throw new Error(`Received document change event for ${i.uri} without valid version identifier`)}const o=Ue.normalize(i.uri);let l=this._syncedDocuments.get(o);if(l!==void 0){l=this._configuration.update(l,a,s);this._syncedDocuments.set(o,l);this._onDidChangeContent.fire(Object.freeze({document:l}))}}));n.push(e.onDidCloseTextDocument(r=>{const i=Ue.normalize(r.textDocument.uri);const a=this._syncedDocuments.get(i);if(a!==void 0){this._syncedDocuments.delete(i);this._onDidClose.fire(Object.freeze({document:a}))}}));n.push(e.onWillSaveTextDocument(r=>{const i=this._syncedDocuments.get(Ue.normalize(r.textDocument.uri));if(i!==void 0){this._onWillSave.fire(Object.freeze({document:i,reason:r.reason}))}}));n.push(e.onWillSaveTextDocumentWaitUntil((r,i)=>{const a=this._syncedDocuments.get(Ue.normalize(r.textDocument.uri));if(a!==void 0&&this._willSaveWaitUntil){return this._willSaveWaitUntil(Object.freeze({document:a,reason:r.reason}),i)}else{return[]}}));n.push(e.onDidSaveTextDocument(r=>{const i=this._syncedDocuments.get(Ue.normalize(r.textDocument.uri));if(i!==void 0){this._onDidSave.fire(Object.freeze({document:i}))}}));return U.Disposable.create(()=>{n.forEach(r=>r.dispose())})}}function _D(t){return Nu.merge(O$(t),DD(t))}function DD(t){return{lsp:{CompletionProvider:e=>new Y$(e),DocumentSymbolProvider:e=>new U_(e),HoverProvider:e=>new W_(e),FoldingRangeProvider:e=>new G_(e),ReferencesProvider:e=>new bD(e),DefinitionProvider:e=>new K_(e),DocumentHighlightProvider:e=>new F_(e),RenameProvider:e=>new kD(e)},shared:()=>t.shared}}function ID(t){return Nu.merge(L$(t),OD(t))}function OD(t){return{lsp:{Connection:()=>t.connection,LanguageServer:e=>new Z_(e),DocumentUpdateHandler:e=>new J$(e),WorkspaceSymbolProvider:e=>new ND(e),NodeKindProvider:()=>new Q$,FuzzyMatcher:()=>new H_},workspace:{TextDocuments:()=>new PD(Au)}}}var Nc;var xy;function LD(){if(xy)return Nc;xy=1;Nc=V$();return Nc}var jp=LD();const Pc="AllocateAttribute";const My="Condition";const Ky="ConstantExpression";const Fy="DataSpecificationDataListEntry";const _c="DeclarationAttribute";const Dc="Directives";const Ic="DoType2";const Uy="EntryDescription";const Oc="Expression";const Gy="FormatItem";const Lc="GetStatement";const xc="InitialAttributeItem";const Mc="InitialAttributeSpecificationIteration";const ya="NamedElement";function Hy(t){return Ie.isInstance(t,ya)}const Kc="NamedType";const qy="OptionsItem";const Li="PackageLevelStatements";const Fc="ProcedureLevelStatement";const Uc="PutStatement";const jy="TopLevelStatement";const xi="Unit";const Gs="AddExpression";const Hs="AFormatItem";const qs="AllocateDimension";const Gc="AllocatedVariable";const js="AllocateLocationReference";const Bs="AllocateStatement";const Ws="AllocateType";const Vs="AssertStatement";const zs="AssignmentStatement";const Xs="AttachStatement";const Ys="BeginStatement";const Js="BFormatItem";const Qs="BitAndExpression";const Zs="BitOrExpression";const Hc="Bound";const eo="CallStatement";const to="CancelThreadStatement";const no="CFormatItem";const ro="CloseStatement";const io="CMPATOptionsItem";const ao="ColumnFormatItem";const so="CompExpression";const qc="CompilerOptions";const ga="ComputationDataAttribute";function xD(t){return Ie.isInstance(t,ga)}const oo="ConcatExpression";const jc="ConditionPrefix";const Bc="ConditionPrefixItem";const Wc="DataSpecificationDataList";const lo="DataSpecificationDataListItem";const uo="DataSpecificationDataListItem3DO";const Vc="DataSpecificationOptions";const co="DateAttribute";const zc="DeclaredItem";const Ra="DeclaredVariable";function Wr(t){return Ie.isInstance(t,Ra)}const $a="DeclareStatement";function MD(t){return Ie.isInstance(t,$a)}const Xc="DefaultAttributeExpression";const Yc="DefaultAttributeExpressionNot";const Jc="DefaultExpression";const Qc="DefaultExpressionPart";const Zc="DefaultRangeIdentifierItem";const ed="DefaultRangeIdentifiers";const fo="DefaultStatement";const va="DefineAliasStatement";function KD(t){return Ie.isInstance(t,va)}const po="DefinedAttribute";const mo="DefineOrdinalStatement";const ho="DefineStructureStatement";const yo="DelayStatement";const go="DeleteStatement";const Ro="DetachStatement";const td="DimensionBound";const nd="Dimensions";const $o="DimensionsDataAttribute";const vo="DisplayStatement";const rd="DoSpecification";const Mi="DoStatement";const Ta="DoType3Variable";function Z$(t){return Ie.isInstance(t,Ta)}const To="DoUntil";const wo="DoWhile";const Eo="EFormatItem";const jl="EndStatement";function FD(t){return Ie.isInstance(t,jl)}const wa="EntryAttribute";function UD(t){return Ie.isInstance(t,wa)}const Co="EntryParameterDescription";const So="EntryStatement";const Ao="EntryUnionDescription";const bo="EnvironmentAttribute";const id="EnvironmentAttributeItem";const ko="ExecStatement";const By="ExitStatement";const No="ExpExpression";const ad="Exports";const sd="FetchEntry";const Po="FetchStatement";const _o="FFormatItem";const Do="FileReferenceCondition";const Io="FlushStatement";const od="FormatList";const ld="FormatListItem";const ud="FormatListItemLevel";const Oo="FormatStatement";const Lo="FreeStatement";const xo="GetFileStatement";const Mo="GetStringStatement";const Ko="GFormatItem";const Fo="GoToStatement";const Uo="HandleAttribute";const Go="IfStatement";const Ea="IncludeDirective";function GD(t){return Ie.isInstance(t,Ea)}const cd="IncludeItem";const dd="InitAcrossExpression";const Ho="InitialAttribute";const qo="InitialAttributeExpression";const Wy="InitialAttributeItemStar";const jo="InitialAttributeSpecification";const Bo="InitialAttributeSpecificationIterationValue";const fd="InitialToContent";const Wo="IterateStatement";const Vo="KeywordCondition";const Ca="LabelPrefix";function ja(t){return Ie.isInstance(t,Ca)}const Bl="LabelReference";function HD(t){return Ie.isInstance(t,Bl)}const zo="LeaveStatement";const Vy="LFormatItem";const Xo="LikeAttribute";const Yo="LineDirective";const Jo="LineFormatItem";const Qo="LinkageOptionsItem";const Sa="Literal";function qD(t){return Ie.isInstance(t,Sa)}const Zo="LocateStatement";const el="LocatorCall";const Wl="MemberCall";function jD(t){return Ie.isInstance(t,Wl)}const tl="MultExpression";const nl="NamedCondition";const rl="NoMapOptionsItem";const zy="NoPrintDirective";const il="NoteDirective";const Xy="NullStatement";const Vl="NumberLiteral";function BD(t){return Ie.isInstance(t,Vl)}const al="OnStatement";const pd="OpenOptionsGroup";const sl="OpenStatement";const md="Options";const hd="OrdinalValue";const yd="OrdinalValueList";const gd="OtherwiseStatement";const Aa="Package";function Yy(t){return Ie.isInstance(t,Aa)}const Jy="PageDirective";const Qy="PageFormatItem";const ol="PFormatItem";const ll="PictureAttribute";const Rd="PliProgram";const Zy="PopDirective";const $d="PrefixedAttribute";const eg="PrintDirective";const zl="ProcedureCall";function WD(t){return Ie.isInstance(t,zl)}const Xl="ProcedureParameter";function VD(t){return Ie.isInstance(t,Xl)}const Ir="ProcedureStatement";function rn(t){return Ie.isInstance(t,Ir)}const ul="ProcessDirective";const cl="ProcincDirective";const tg="PushDirective";const dl="PutFileStatement";const vd="PutItem";const fl="PutStringStatement";const pl="QualifyStatement";const ml="ReadStatement";const Yl="ReferenceItem";function zD(t){return Ie.isInstance(t,Yl)}const hl="ReinitStatement";const yl="ReleaseStatement";const Td="Reserves";const ng="ResignalStatement";const wd="ReturnsOption";const gl="ReturnStatement";const Rl="RevertStatement";const $l="RewriteStatement";const vl="RFormatItem";const Tl="SelectStatement";const wl="SignalStatement";const ba="SimpleOptionsItem";function XD(t){return Ie.isInstance(t,ba)}const El="SkipDirective";const Cl="SkipFormatItem";const ka="Statement";function YD(t){return Ie.isInstance(t,ka)}const rg="StopStatement";const Jl="StringLiteral";function JD(t){return Ie.isInstance(t,Jl)}const Ed="SubStructure";const Sl="TypeAttribute";const Al="UnaryExpression";const bl="ValueAttribute";const Cd="ValueAttributeItem";const kl="ValueListAttribute";const Nl="ValueListFromAttribute";const Pl="ValueRangeAttribute";const ig="VFormatItem";const _l="WaitStatement";const Sd="WhenStatement";const Dl="WriteStatement";const Il="XFormatItem";const Ol="DoType3";class ev extends og{getAllTypes(){return[Hs,Gs,Pc,qs,js,Bs,Ws,Gc,Vs,zs,Xs,Js,Ys,Qs,Zs,Hc,no,io,eo,to,ro,ao,so,qc,ga,oo,My,jc,Bc,Ky,Wc,Fy,lo,uo,Vc,co,_c,$a,zc,Ra,Xc,Yc,Jc,Qc,Zc,ed,fo,va,mo,ho,po,yo,go,Ro,td,nd,$o,Dc,vo,rd,Mi,Ic,Ol,Ta,To,wo,Eo,jl,wa,Uy,Co,So,Ao,bo,id,ko,By,No,ad,Oc,_o,sd,Po,Do,Io,Gy,od,ld,ud,Oo,Lo,Ko,xo,Lc,Mo,Fo,Uo,Go,Ea,cd,dd,Ho,qo,xc,Wy,jo,Mc,Bo,fd,Wo,Vo,Vy,Ca,Bl,zo,Xo,Yo,Jo,Qo,Sa,Zo,el,Wl,tl,nl,ya,Kc,rl,zy,il,Xy,Vl,al,pd,sl,md,qy,hd,yd,gd,ol,Aa,Li,Jy,Qy,ll,Rd,Zy,$d,eg,zl,Fc,Xl,Ir,ul,cl,tg,dl,vd,Uc,fl,pl,vl,ml,Yl,hl,yl,Td,ng,gl,wd,Rl,$l,Tl,wl,ba,El,Cl,ka,rg,Jl,Ed,jy,Sl,Al,xi,ig,bl,Cd,kl,Nl,Pl,_l,Sd,Dl,Il]}computeIsSubtype(e,n){switch(e){case Gs:case Qs:case Zs:case so:case oo:case No:case el:case tl:case Al:{return this.isSubtype(Oc,n)}case Hs:case Js:case no:case ao:case Eo:case _o:case Ko:case Vy:case Jo:case Qy:case ol:case vl:case Cl:case ig:case Il:{return this.isSubtype(Gy,n)}case qs:case js:case Ws:{return this.isSubtype(Pc,n)}case Bs:case Vs:case zs:case Xs:case Ys:case eo:case to:case ro:case yo:case go:case Ro:case vo:case Mi:case So:case ko:case By:case Po:case Io:case Oo:case Lo:case Lc:case Fo:case Go:case Wo:case zo:case Zo:case Xy:case al:case sl:case Uc:case pl:case ml:case hl:case yl:case ng:case gl:case Rl:case $l:case Tl:case wl:case rg:case _l:case Dl:{return this.isSubtype(xi,n)}case io:case Qo:case rl:case ba:{return this.isSubtype(qy,n)}case ga:case co:case po:case $o:case wa:case bo:case Uo:case Xo:case ll:case Sl:case bl:case kl:case Nl:case Pl:{return this.isSubtype(_c,n)}case lo:case uo:{return this.isSubtype(Fy,n)}case Ra:case Ta:{return this.isSubtype(ya,n)}case $a:case fo:case mo:case ho:{return this.isSubtype(Li,n)||this.isSubtype(xi,n)}case va:{return this.isSubtype(Kc,n)||this.isSubtype(Li,n)||this.isSubtype(xi,n)}case Dc:case Aa:case Li:{return this.isSubtype(jy,n)}case Ic:case Ol:{return this.isSubtype(Mi,n)}case To:case wo:{return this.isSubtype(Ic,n)}case Co:case Ao:{return this.isSubtype(Uy,n)}case Do:case Vo:case nl:{return this.isSubtype(My,n)}case xo:case Mo:{return this.isSubtype(Lc,n)}case Ea:case Yo:case zy:case il:case Jy:case Zy:case eg:case ul:case cl:case tg:case El:{return this.isSubtype(Dc,n)||this.isSubtype(xi,n)}case Ho:{return this.isSubtype(Pc,n)||this.isSubtype(_c,n)}case qo:case Wy:{return this.isSubtype(xc,n)||this.isSubtype(Mc,n)}case jo:{return this.isSubtype(xc,n)}case Bo:{return this.isSubtype(Mc,n)}case Sa:{return this.isSubtype(Ky,n)||this.isSubtype(Oc,n)}case Ir:{return this.isSubtype(ya,n)||this.isSubtype(Li,n)||this.isSubtype(Fc,n)}case dl:case fl:{return this.isSubtype(Uc,n)}case ka:{return this.isSubtype(Fc,n)}default:{return false}}}getReferenceType(e){const n=`${e.container.$type}:${e.property}`;switch(n){case"HandleAttribute:type":case"TypeAttribute:type":{return Kc}case"LabelReference:label":{return Ca}case"ProcedureCall:procedure":{return Ir}case"ReferenceItem:ref":{return ya}default:{throw new Error(`${n} is not a valid reference id.`)}}}getTypeMetaData(e){switch(e){case Gs:{return{name:Gs,properties:[{name:"left"},{name:"op"},{name:"right"}]}}case Hs:{return{name:Hs,properties:[{name:"fieldWidth"}]}}case qs:{return{name:qs,properties:[{name:"dimensions"}]}}case Gc:{return{name:Gc,properties:[{name:"attribute"},{name:"level"},{name:"var"}]}}case js:{return{name:js,properties:[{name:"area"},{name:"locatorVariable"}]}}case Bs:{return{name:Bs,properties:[{name:"variables",defaultValue:[]}]}}case Ws:{return{name:Ws,properties:[{name:"dimensions"},{name:"type"}]}}case Vs:{return{name:Vs,properties:[{name:"actual"},{name:"compare",defaultValue:false},{name:"displayExpression"},{name:"expected"},{name:"false",defaultValue:false},{name:"operator"},{name:"true",defaultValue:false},{name:"unreachable",defaultValue:false}]}}case zs:{return{name:zs,properties:[{name:"dimacrossExpr"},{name:"expression"},{name:"operator"},{name:"refs",defaultValue:[]}]}}case Xs:{return{name:Xs,properties:[{name:"environment",defaultValue:false},{name:"reference"},{name:"task"},{name:"tstack"}]}}case Ys:{return{name:Ys,properties:[{name:"end"},{name:"options"},{name:"order",defaultValue:false},{name:"recursive",defaultValue:false},{name:"reorder",defaultValue:false},{name:"statements",defaultValue:[]}]}}case Js:{return{name:Js,properties:[{name:"fieldWidth"}]}}case Qs:{return{name:Qs,properties:[{name:"left"},{name:"op"},{name:"right"}]}}case Zs:{return{name:Zs,properties:[{name:"left"},{name:"op"},{name:"right"}]}}case Hc:{return{name:Hc,properties:[{name:"expression"},{name:"refer"}]}}case eo:{return{name:eo,properties:[{name:"call"}]}}case to:{return{name:to,properties:[{name:"thread"}]}}case no:{return{name:no,properties:[{name:"item"}]}}case ro:{return{name:ro,properties:[{name:"files",defaultValue:[]}]}}case io:{return{name:io,properties:[{name:"value"}]}}case ao:{return{name:ao,properties:[{name:"characterPosition"}]}}case so:{return{name:so,properties:[{name:"left"},{name:"op"},{name:"right"}]}}case qc:{return{name:qc,properties:[{name:"value"}]}}case ga:{return{name:ga,properties:[{name:"dimensions"},{name:"type"}]}}case oo:{return{name:oo,properties:[{name:"left"},{name:"op"},{name:"right"}]}}case jc:{return{name:jc,properties:[{name:"items",defaultValue:[]}]}}case Bc:{return{name:Bc,properties:[{name:"conditions",defaultValue:[]}]}}case Wc:{return{name:Wc,properties:[{name:"items",defaultValue:[]}]}}case lo:{return{name:lo,properties:[{name:"value"}]}}case uo:{return{name:uo,properties:[{name:"do"},{name:"list"}]}}case Vc:{return{name:Vc,properties:[{name:"data",defaultValue:false},{name:"dataList"},{name:"dataListItems",defaultValue:[]},{name:"dataLists",defaultValue:[]},{name:"edit",defaultValue:false},{name:"formatLists",defaultValue:[]}]}}case co:{return{name:co,properties:[{name:"pattern"}]}}case zc:{return{name:zc,properties:[{name:"attributes",defaultValue:[]},{name:"element"},{name:"items",defaultValue:[]},{name:"level"}]}}case Ra:{return{name:Ra,properties:[{name:"name"}]}}case $a:{return{name:$a,properties:[{name:"items",defaultValue:[]},{name:"xDeclare",defaultValue:false}]}}case Xc:{return{name:Xc,properties:[{name:"items",defaultValue:[]},{name:"operators",defaultValue:[]}]}}case Yc:{return{name:Yc,properties:[{name:"not",defaultValue:false},{name:"value"}]}}case Jc:{return{name:Jc,properties:[{name:"attributes",defaultValue:[]},{name:"expression"}]}}case Qc:{return{name:Qc,properties:[{name:"expression"},{name:"identifiers"}]}}case Zc:{return{name:Zc,properties:[{name:"from"},{name:"to"}]}}case ed:{return{name:ed,properties:[{name:"identifiers",defaultValue:[]}]}}case fo:{return{name:fo,properties:[{name:"expressions",defaultValue:[]}]}}case va:{return{name:va,properties:[{name:"attributes",defaultValue:[]},{name:"name"},{name:"xDefine",defaultValue:false}]}}case po:{return{name:po,properties:[{name:"position"},{name:"reference"}]}}case mo:{return{name:mo,properties:[{name:"name"},{name:"ordinalValues"},{name:"precision"},{name:"signed",defaultValue:false},{name:"unsigned",defaultValue:false},{name:"xDefine",defaultValue:false}]}}case ho:{return{name:ho,properties:[{name:"level"},{name:"name"},{name:"substructures",defaultValue:[]},{name:"union",defaultValue:false},{name:"xDefine",defaultValue:false}]}}case yo:{return{name:yo,properties:[{name:"delay"}]}}case go:{return{name:go,properties:[{name:"file"},{name:"key"}]}}case Ro:{return{name:Ro,properties:[{name:"reference"}]}}case td:{return{name:td,properties:[{name:"bound1"},{name:"bound2"}]}}case nd:{return{name:nd,properties:[{name:"dimensions",defaultValue:[]}]}}case $o:{return{name:$o,properties:[{name:"dimensions"}]}}case vo:{return{name:vo,properties:[{name:"desc",defaultValue:[]},{name:"expression"},{name:"reply"},{name:"rout",defaultValue:[]}]}}case rd:{return{name:rd,properties:[{name:"by"},{name:"downthru"},{name:"exp1"},{name:"repeat"},{name:"to"},{name:"upthru"},{name:"whileOrUntil"}]}}case Mi:{return{name:Mi,properties:[{name:"end"},{name:"statements",defaultValue:[]}]}}case Ta:{return{name:Ta,properties:[{name:"name"}]}}case To:{return{name:To,properties:[{name:"until"},{name:"while"}]}}case wo:{return{name:wo,properties:[{name:"until"},{name:"while"}]}}case Eo:{return{name:Eo,properties:[{name:"fieldWidth"},{name:"fractionalDigits"},{name:"significantDigits"}]}}case jl:{return{name:jl,properties:[{name:"label"},{name:"labels",defaultValue:[]}]}}case wa:{return{name:wa,properties:[{name:"attributes",defaultValue:[]},{name:"environmentName",defaultValue:[]},{name:"limited",defaultValue:[]},{name:"options",defaultValue:[]},{name:"returns",defaultValue:[]},{name:"variable",defaultValue:[]}]}}case Co:{return{name:Co,properties:[{name:"attributes",defaultValue:[]},{name:"star",defaultValue:false}]}}case So:{return{name:So,properties:[{name:"environmentName",defaultValue:[]},{name:"limited",defaultValue:[]},{name:"options",defaultValue:[]},{name:"parameters",defaultValue:[]},{name:"returns",defaultValue:[]},{name:"variable",defaultValue:[]}]}}case Ao:{return{name:Ao,properties:[{name:"attributes",defaultValue:[]},{name:"init"},{name:"prefixedAttributes",defaultValue:[]}]}}case bo:{return{name:bo,properties:[{name:"items",defaultValue:[]}]}}case id:{return{name:id,properties:[{name:"args",defaultValue:[]},{name:"environment"}]}}case ko:{return{name:ko,properties:[{name:"query"}]}}case No:{return{name:No,properties:[{name:"left"},{name:"op"},{name:"right"}]}}case ad:{return{name:ad,properties:[{name:"all",defaultValue:false},{name:"procedures",defaultValue:[]}]}}case sd:{return{name:sd,properties:[{name:"name"},{name:"set"},{name:"title"}]}}case Po:{return{name:Po,properties:[{name:"entries",defaultValue:[]}]}}case _o:{return{name:_o,properties:[{name:"fieldWidth"},{name:"fractionalDigits"},{name:"scalingFactor"}]}}case Do:{return{name:Do,properties:[{name:"fileReference"},{name:"keyword"}]}}case Io:{return{name:Io,properties:[{name:"file"}]}}case od:{return{name:od,properties:[{name:"items",defaultValue:[]}]}}case ld:{return{name:ld,properties:[{name:"item"},{name:"level"},{name:"list"}]}}case ud:{return{name:ud,properties:[{name:"level"}]}}case Oo:{return{name:Oo,properties:[{name:"list"}]}}case Lo:{return{name:Lo,properties:[{name:"references",defaultValue:[]}]}}case xo:{return{name:xo,properties:[{name:"copy",defaultValue:false},{name:"copyReference"},{name:"dataSpecification"},{name:"file"},{name:"skip",defaultValue:false},{name:"skipExpression"}]}}case Mo:{return{name:Mo,properties:[{name:"dataSpecification"},{name:"expression"}]}}case Ko:{return{name:Ko,properties:[{name:"fieldWidth"}]}}case Fo:{return{name:Fo,properties:[{name:"label"}]}}case Uo:{return{name:Uo,properties:[{name:"size"},{name:"type"}]}}case Go:{return{name:Go,properties:[{name:"else"},{name:"expression"},{name:"unit"}]}}case Ea:{return{name:Ea,properties:[{name:"items",defaultValue:[]}]}}case cd:{return{name:cd,properties:[{name:"ddname",defaultValue:false},{name:"file"}]}}case dd:{return{name:dd,properties:[{name:"expressions",defaultValue:[]}]}}case Ho:{return{name:Ho,properties:[{name:"across",defaultValue:false},{name:"call",defaultValue:false},{name:"content"},{name:"direct",defaultValue:false},{name:"expressions",defaultValue:[]},{name:"items",defaultValue:[]},{name:"procedureCall"},{name:"to",defaultValue:false}]}}case qo:{return{name:qo,properties:[{name:"expression"}]}}case jo:{return{name:jo,properties:[{name:"expression"},{name:"item"},{name:"star",defaultValue:false}]}}case Bo:{return{name:Bo,properties:[{name:"items",defaultValue:[]}]}}case fd:{return{name:fd,properties:[{name:"type"},{name:"varying"}]}}case Wo:{return{name:Wo,properties:[{name:"label"}]}}case Vo:{return{name:Vo,properties:[{name:"keyword"}]}}case Ca:{return{name:Ca,properties:[{name:"name"}]}}case Bl:{return{name:Bl,properties:[{name:"label"}]}}case zo:{return{name:zo,properties:[{name:"label"}]}}case Xo:{return{name:Xo,properties:[{name:"reference"}]}}case Yo:{return{name:Yo,properties:[{name:"file"},{name:"line"}]}}case Jo:{return{name:Jo,properties:[{name:"lineNumber"}]}}case Qo:{return{name:Qo,properties:[{name:"value"}]}}case Sa:{return{name:Sa,properties:[{name:"multiplier"},{name:"value"}]}}case Zo:{return{name:Zo,properties:[{name:"file"},{name:"keyfrom"},{name:"set"},{name:"variable"}]}}case el:{return{name:el,properties:[{name:"element"},{name:"handle",defaultValue:false},{name:"pointer",defaultValue:false},{name:"previous"}]}}case Wl:{return{name:Wl,properties:[{name:"element"},{name:"previous"}]}}case tl:{return{name:tl,properties:[{name:"left"},{name:"op"},{name:"right"}]}}case nl:{return{name:nl,properties:[{name:"name"}]}}case rl:{return{name:rl,properties:[{name:"parameters",defaultValue:[]},{name:"type"}]}}case il:{return{name:il,properties:[{name:"code"},{name:"message"}]}}case Vl:{return{name:Vl,properties:[{name:"value"}]}}case al:{return{name:al,properties:[{name:"conditions",defaultValue:[]},{name:"onUnit"},{name:"snap",defaultValue:false},{name:"system",defaultValue:false}]}}case pd:{return{name:pd,properties:[{name:"buffered",defaultValue:false},{name:"direct",defaultValue:false},{name:"file"},{name:"input",defaultValue:false},{name:"keyed",defaultValue:false},{name:"lineSize"},{name:"output",defaultValue:false},{name:"pageSize"},{name:"print",defaultValue:false},{name:"record",defaultValue:false},{name:"sequential",defaultValue:false},{name:"stream",defaultValue:false},{name:"title"},{name:"unbuffered",defaultValue:false},{name:"update",defaultValue:false}]}}case sl:{return{name:sl,properties:[{name:"options",defaultValue:[]}]}}case md:{return{name:md,properties:[{name:"items",defaultValue:[]}]}}case hd:{return{name:hd,properties:[{name:"name"},{name:"value"}]}}case yd:{return{name:yd,properties:[{name:"members",defaultValue:[]}]}}case gd:{return{name:gd,properties:[{name:"unit"}]}}case Aa:{return{name:Aa,properties:[{name:"end"},{name:"exports"},{name:"name"},{name:"options"},{name:"prefix"},{name:"reserves"},{name:"statements",defaultValue:[]}]}}case ol:{return{name:ol,properties:[{name:"specification"}]}}case ll:{return{name:ll,properties:[{name:"picture"}]}}case Rd:{return{name:Rd,properties:[{name:"statements",defaultValue:[]}]}}case $d:{return{name:$d,properties:[{name:"attribute"},{name:"level"}]}}case zl:{return{name:zl,properties:[{name:"args",defaultValue:[]},{name:"procedure"}]}}case Xl:{return{name:Xl,properties:[{name:"id"}]}}case Ir:{return{name:Ir,properties:[{name:"end"},{name:"environmentName",defaultValue:[]},{name:"labels",defaultValue:[]},{name:"options",defaultValue:[]},{name:"order",defaultValue:[]},{name:"parameters",defaultValue:[]},{name:"recursive",defaultValue:[]},{name:"returns",defaultValue:[]},{name:"scope",defaultValue:[]},{name:"statements",defaultValue:[]},{name:"xProc",defaultValue:false}]}}case ul:{return{name:ul,properties:[{name:"compilerOptions",defaultValue:[]}]}}case cl:{return{name:cl,properties:[{name:"datasetName"}]}}case dl:{return{name:dl,properties:[{name:"items",defaultValue:[]}]}}case vd:{return{name:vd,properties:[{name:"attribute"},{name:"expression"}]}}case fl:{return{name:fl,properties:[{name:"dataSpecification"},{name:"stringExpression"}]}}case pl:{return{name:pl,properties:[{name:"end"},{name:"statements",defaultValue:[]}]}}case ml:{return{name:ml,properties:[{name:"fileReference"},{name:"ignore"},{name:"intoRef"},{name:"key"},{name:"keyto"},{name:"set"}]}}case Yl:{return{name:Yl,properties:[{name:"dimensions"},{name:"ref"}]}}case hl:{return{name:hl,properties:[{name:"reference"}]}}case yl:{return{name:yl,properties:[{name:"references",defaultValue:[]},{name:"star",defaultValue:false}]}}case Td:{return{name:Td,properties:[{name:"all",defaultValue:false},{name:"variables",defaultValue:[]}]}}case wd:{return{name:wd,properties:[{name:"returnAttribute"}]}}case gl:{return{name:gl,properties:[{name:"expression"}]}}case Rl:{return{name:Rl,properties:[{name:"conditions",defaultValue:[]}]}}case $l:{return{name:$l,properties:[{name:"file"},{name:"from"},{name:"key"}]}}case vl:{return{name:vl,properties:[{name:"labelReference"}]}}case Tl:{return{name:Tl,properties:[{name:"end"},{name:"on"},{name:"statements",defaultValue:[]}]}}case wl:{return{name:wl,properties:[{name:"condition",defaultValue:[]}]}}case ba:{return{name:ba,properties:[{name:"value"}]}}case El:{return{name:El,properties:[{name:"lines"}]}}case Cl:{return{name:Cl,properties:[{name:"skip"}]}}case ka:{return{name:ka,properties:[{name:"condition"},{name:"labels",defaultValue:[]},{name:"value"}]}}case Jl:{return{name:Jl,properties:[{name:"value"}]}}case Ed:{return{name:Ed,properties:[{name:"attributes",defaultValue:[]},{name:"level"},{name:"name"}]}}case Sl:{return{name:Sl,properties:[{name:"type"}]}}case Al:{return{name:Al,properties:[{name:"expr"},{name:"op"}]}}case bl:{return{name:bl,properties:[{name:"items",defaultValue:[]},{name:"value"}]}}case Cd:{return{name:Cd,properties:[{name:"attributes",defaultValue:[]}]}}case kl:{return{name:kl,properties:[{name:"values",defaultValue:[]}]}}case Nl:{return{name:Nl,properties:[{name:"from"}]}}case Pl:{return{name:Pl,properties:[{name:"values",defaultValue:[]}]}}case _l:{return{name:_l,properties:[{name:"task"}]}}case Sd:{return{name:Sd,properties:[{name:"conditions",defaultValue:[]},{name:"unit"}]}}case Dl:{return{name:Dl,properties:[{name:"fileReference"},{name:"from"},{name:"keyfrom"},{name:"keyto"}]}}case Il:{return{name:Il,properties:[{name:"width"}]}}case Ol:{return{name:Ol,properties:[{name:"end"},{name:"specifications",defaultValue:[]},{name:"statements",defaultValue:[]},{name:"variable"}]}}default:{return{name:e,properties:[]}}}}}const Ie=new ev;let ag;const QD=()=>ag??(ag=FP(`{
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
                "$ref": "#/rules@200"
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
                        "$ref": "#/rules@200"
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
                            "$ref": "#/rules@200"
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
                        "$ref": "#/rules@200"
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
                            "$ref": "#/rules@200"
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
                        "$ref": "#/rules@200"
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
                            "$ref": "#/rules@200"
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
                "$ref": "#/rules@200"
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
                "$ref": "#/rules@204"
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
                            "$ref": "#/rules@208"
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
                "$ref": "#/rules@200"
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
                    "$ref": "#/rules@200"
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
                "$ref": "#/rules@200"
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
                "$ref": "#/rules@199"
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
                    "$ref": "#/rules@204"
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
                "$ref": "#/rules@200"
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
                    "$ref": "#/rules@204"
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
                "$ref": "#/rules@204"
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
                "$ref": "#/rules@204"
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
                    "$ref": "#/rules@204"
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
                        "$ref": "#/rules@204"
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
                        "$ref": "#/rules@204"
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
                            "$ref": "#/rules@204"
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
            "$ref": "#/rules@203"
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
                "$ref": "#/rules@200"
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
                "$ref": "#/rules@204"
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
                "$ref": "#/rules@208"
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
                "$ref": "#/rules@200"
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
                                "$ref": "#/rules@200"
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
                    "$ref": "#/rules@208"
                  },
                  "arguments": []
                },
                {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@203"
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
                        "$ref": "#/rules@208"
                      },
                      "arguments": []
                    },
                    {
                      "$type": "RuleCall",
                      "rule": {
                        "$ref": "#/rules@203"
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
                    "$ref": "#/rules@204"
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
                    "$ref": "#/rules@208"
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
                "$ref": "#/rules@200"
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
                "$ref": "#/rules@200"
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
                        "$ref": "#/rules@200"
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
                            "$ref": "#/rules@200"
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
                "$ref": "#/rules@204"
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
            "$ref": "#/rules@203"
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
                    "$ref": "#/rules@208"
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
                "$ref": "#/rules@208"
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
                      "$ref": "#/rules@203"
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
                          "$ref": "#/rules@203"
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
                    "$ref": "#/rules@204"
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
                      "$ref": "#/rules@203"
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
                          "$ref": "#/rules@203"
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
                "$ref": "#/rules@203"
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
                "$ref": "#/rules@204"
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
                "$ref": "#/rules@204"
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
            "$ref": "#/rules@200"
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
                  "$ref": "#/rules@200"
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
              "$ref": "#/rules@196"
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
                  "$ref": "#/rules@203"
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
              "$ref": "#/rules@203"
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
      "name": "ConstantExpression",
      "definition": {
        "$type": "RuleCall",
        "rule": {
          "$ref": "#/rules@196"
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
                    "$ref": "#/rules@204"
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
                    "$ref": "#/rules@197"
                  },
                  "arguments": []
                },
                {
                  "$type": "RuleCall",
                  "rule": {
                    "$ref": "#/rules@198"
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
            "$ref": "#/rules@208"
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
            "$ref": "#/rules@204"
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
              "$ref": "#/rules@203"
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
                  "$ref": "#/rules@203"
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
          "$ref": "#/rules@203"
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
              "$ref": "#/rules@206"
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
              "$ref": "#/rules@205"
            }
          },
          {
            "$type": "TerminalRuleCall",
            "rule": {
              "$ref": "#/rules@207"
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
}`));const ZD={languageId:"pli",fileExtensions:[".pli"],caseInsensitive:true,mode:"development"};const eI={AstReflection:()=>new ev};const tI={Grammar:()=>QD(),LanguageMetaData:()=>ZD,parser:{}};function nI(t,e){const n=new Set;t.procedures.forEach((r,i)=>{if(!n.has(r)){n.add(r)}else{e("error",`The name '${r}' occurs more than once in the EXPORTS clause.`,{code:"IBM1324IE",node:t,property:"procedures",index:i})}})}function Iu(t){return t.toUpperCase()}function rI(t,e){return Iu(t)===Iu(e)}function iI(t,e){const n=t.options.flatMap(i=>i.items);const r=n.find(i=>XD(i)&&i.value.toUpperCase()==="NODESCRIPTOR");if(r){const i=new Set(t.parameters.map(s=>Iu(s.id)));const a=t.statements.filter(YD).map(s=>s.value).filter(MD).flatMap(s=>s.items).filter(s=>Wr(s.element)&&i.has(Iu(s.element.name))).filter(s=>s.attributes.some(o=>xD(o)&&rI(o.type,"NONCONNECTED")));if(a.length>0){e("error","The NODESCRIPTOR attribute is invalid when any parameters have the NONCONNECTED attribute.",{code:"IBM1388IE",node:r,property:"value"})}}}function aI(t,e){if(!Wr(t.element.ref.ref)){return}const n=t.element.ref.ref.$container;if(!n.attributes.some(o=>UD(o)&&o.returns)){return}const r=ct(t);const i=ct(n);if(r!==i){return}const a=t.$cstNode.offset;const s=n.$cstNode.offset;if(a>s){return}e("error","Function cannot be used before the function's descriptor list has been scanned.",{code:"IBM1747IS",node:t,property:"element"})}function sI(t){const e=t.validation.ValidationRegistry;const n=t.validation.Pl1Validator;const r={Exports:[nI],MemberCall:[aI],ProcedureStatement:[iI]};e.register(r,n)}class oI{}const lI="\n".charCodeAt(0);class uI extends A${tokenize(e){const n=this.splitLines(e);const r=n.map(a=>this.adjustLine(a));const i=r.join("");return super.tokenize(i)}splitLines(e){const n=[];for(let r=0;r<e.length;r++){const i=r;while(r<e.length&&e.charCodeAt(r)!==lI){r++}n.push(e.substring(i,r+1))}return n}adjustLine(e){let n="";if(e.endsWith("\r\n")){n="\r\n"}else if(e.endsWith("\n")){n="\n"}const r=1;const i=e.length-n.length;if(i<r){return" ".repeat(i)+n}const a=72;const s=" ".repeat(r);let o="";if(i>a){o=" ".repeat(i-a)}return s+e.substring(r,Math.min(a,i))+o+n}}class cI extends u${buildTokens(e,n){const r=be(np(e,false));const i=this.buildTerminalTokens(r);const a=this.buildKeywordTokens(r,i,n);const s=i.find(l=>l.name==="ID");for(const l of a){if(/[a-zA-Z]/.test(l.name)){l.CATEGORIES=[s]}}i.forEach(l=>{const u=l.PATTERN;if(typeof u==="object"&&u&&"test"in u&&au(u)||l.name==="ExecFragment"){a.unshift(l)}else{a.push(l)}});const o=a.find(l=>l.name==="ExecFragment");o.START_CHARS_HINT=["S","C"];return a}}class dI extends R${async computeExports(e,n=U.CancellationToken.None){return this.computeExportsForNode(e.parseResult.value,e,Er,n)}processNode(e,n,r){const i=nu(e);if(i){const a=this.nameProvider.getName(e);if(a){r.add(i,this.descriptions.createDescription(e,a,n))}}}}class fI extends E${processLinkingErrors(e,n,r){for(const i of e.references){const a=i.error;if(a){const s={node:a.container,property:a.property,index:a.index,data:{code:Kt.LinkingError,containerType:a.container.$type,property:a.property,refText:a.reference.$refText}};n.push(this.toDiagnostic("warning",a.message,s))}}}}class pI extends J_{highlightElement(e,n){if(zD(e)){const r=e.ref?.ref;n({node:e,property:"ref",type:rn(r)?U.SemanticTokenTypes.function:U.SemanticTokenTypes.variable})}else if(Wr(e)||Z$(e)){n({node:e,property:"name",type:U.SemanticTokenTypes.variable})}else if(KD(e)){n({node:e,property:"name",type:U.SemanticTokenTypes.type})}else if(VD(e)){n({node:e,property:"id",type:U.SemanticTokenTypes.parameter})}else if(FD(e)){const r=e.$container;n({node:e,property:"label",type:rn(r)?U.SemanticTokenTypes.function:U.SemanticTokenTypes.variable})}else if(HD(e)){n({node:e,property:"label",type:U.SemanticTokenTypes.variable})}else if(WD(e)){n({node:e,property:"procedure",type:U.SemanticTokenTypes.function})}else if(ja(e)){const r=e.$container;n({node:e,property:"name",type:rn(r)?U.SemanticTokenTypes.function:U.SemanticTokenTypes.variable})}else if(BD(e)){n({node:e,property:"value",type:U.SemanticTokenTypes.number})}else if(JD(e)){n({node:e,property:"value",type:U.SemanticTokenTypes.string})}else if(qD(e)){n({node:e,property:"multiplier",type:U.SemanticTokenTypes.number})}}}class mI extends y${getName(e){if(rn(e)){const n=e.labels[0];return n?.name||void 0}else{return super.getName(e)}}getNameNode(e){if(rn(e)){const n=e.labels[0];if(n){return this.getNameNode(n)}else{return void 0}}else{return super.getNameNode(e)}}}class hI extends g${findReferences(e,n){if(ja(e)&&rn(e.$container)){return this.findReferences(e.$container,n)}else{return super.findReferences(e,n)}}}class yI extends w${constructor(e){super(e);this.globalDocumentScopeCache=new eP(e.shared)}getGlobalScope(e,n){return this.globalDocumentScopeCache.get(ct(n.container).uri,e,()=>{const r=Bn(ct(n.container).parseResult.value).filter(GD);const i=this.getUrisFromIncludes(ct(n.container).uri,r.toArray());return new $$(this.indexManager.allElements(e,i))})}getUrisFromIncludes(e,n){const r=new Set;r.add(e.toString());const i=Ue.dirname(e);for(const a of n){for(const s of a.items){const o=Ue.joinPath(i,s.file.substring(1,s.file.length-1));r.add(o.toString())}}r.add("pli-builtin:/builtins.pli");return r}getScope(e){if(e.property==="ref"){const n=Nn(e.container,jD);if(n?.previous){const r=n.previous.element.ref.ref;if(r&&Wr(r)){return this.createScopeForNodes(this.findChildren(r))}else{return QN}}}return super.getScope(e)}findChildren(e){const n=e.$container;let r=Number(n.level);if(isNaN(r)||r<1){r=1}const i=[];const a=n.$container;const s=a.items.indexOf(n);for(let o=s+1;o<a.items.length;o++){const l=a.items[o];const u=Number(l.level);if(isNaN(u)||u<r){break}if(u===r+1){if(Wr(l.element)){i.push(l.element)}}}return i}}class gI extends Q${getSymbolKind(e){const n=this.getNode(e);if(!n){return bn.Null}if(rn(n)){return bn.Function}else if(Hy(n)){return bn.Variable}else if(Yy(n)){return bn.Namespace}else if(ja(n)){return bn.Constant}else{return bn.Variable}}getCompletionItemKind(e){const n=this.getNode(e);if(!n){return An.Text}if(rn(n)){return An.Function}else if(Hy(n)){return An.Variable}else if(Yy(n)){return An.Module}else if(ja(n)){return An.Constant}return An.Variable}getNode(e){if(sg(e)){return e.node}return e}}class RI extends I${getDocumentation(e){if(Wr(e)){const n=e.$container;let r=`\`\`\`
DECLARE ${e.name} `;for(const i of n.attributes){r+=`${i.$cstNode?.text} `}r+="\n```";return r}else if(ja(e)&&rn(e.$container)){return this.getProcedureHoverContent(e.$container)}else if(rn(e)){return this.getProcedureHoverContent(e)}else if(Z$(e)){return"```\nDECLARE"+e.name+"\n```"}return""}getProcedureHoverContent(e){let n="```\n";for(const r of e.labels){n+=`${r.name} `}n+="PROCEDURE ";if(e.parameters.length>0){n+="("+e.parameters.map(r=>r.id).join(", ")+") "}if(e.recursive.length>0){n+="RECURSIVE "}if(e.order.includes("ORDER")){n+="ORDER "}else if(e.order.includes("REORDER")){n+="REORDER "}if(e.options.length>0){n+=e.options.map(r=>r.$cstNode?.text).join(" ")}if(e.returns.length>0){n+=e.returns.map(r=>r.$cstNode?.text).join(" ")}n+="\n```";return n}}class $I extends Y${createReferenceCompletionItem(e){let n=void 0;if(e.type==="ProcedureStatement"){n="PROCEDURE"}else if(e.type==="DeclaredVariable"||e.type==="DoType3Variable"){n="DECLARE"}else if(e.type==="LabelPrefix"){n="LABEL"}const r=this.nodeKindProvider.getCompletionItemKind(e);const i=this.getReferenceDocumentation(e);return{nodeDescription:e,kind:r,documentation:i,detail:n,sortText:"0"}}}class vI extends C${isAffected(e,n){return false}}const TI=` // Mathematical functions
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
 `;class wI extends S${constructor(e){super(e);this.factory=e.workspace.LangiumDocumentFactory}async loadAdditionalDocuments(e,n){const r=this.factory.fromString(TI,dt.parse("pli-builtin:///builtins.pli"));n(r)}traverseFolder(){return Promise.resolve()}}class EI extends J${didCloseDocument(e){const n=dt.parse(e.document.uri);if(n.scheme!=="pli-builtin"){this.fireDocumentUpdate([],[n])}}}const CI={documentation:{DocumentationProvider:t=>new RI(t)},validation:{Pl1Validator:()=>new oI,DocumentValidator:t=>new fI(t)},parser:{Lexer:t=>new uI(t),TokenBuilder:()=>new cI},references:{ScopeComputation:t=>new dI(t),NameProvider:()=>new mI,References:t=>new hI(t),ScopeProvider:t=>new yI(t)},lsp:{SemanticTokenProvider:t=>new pI(t),CompletionProvider:t=>new $I(t)}};const SI={lsp:{NodeKindProvider:()=>new gI,DocumentUpdateHandler:t=>new EI(t)},workspace:{IndexManager:t=>new vI(t),WorkspaceManager:t=>new wI(t)}};function AI(t){const e=Pu(ID(t),eI,SI);const n=Pu(_D({shared:e}),tI,CI);e.ServiceRegistry.register(n);sI(n);if(!t.connection){e.workspace.ConfigurationProvider.initialized({})}return{shared:e,pli:n}}const bI=new jp.BrowserMessageReader(self);const kI=new jp.BrowserMessageWriter(self);const NI=jp.createConnection(bI,kI);const{shared:PI}=AI({connection:NI,...K$});eD(PI)});export default _I();
