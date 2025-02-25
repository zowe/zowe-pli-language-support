import{R as _,l as o,E as N,a as E,C as y,b as $}from"./index-ByDkoAuH.js";const A="*";const I=":";const M=".";const h="\\w+[-_\\w+]*";const b=`^${h}$`;const x=`^(${h}|\\*)(\\${M}${h})*(${I}${h})?$`;const B="^(\\s*(italic|bold|underline|strikethrough))*\\s*$";class f{constructor(e,r,n,c,s){this.foreground=e;this.bold=r;this.underline=n;this.strikethrough=c;this.italic=s}}(function(i){function e(t){return{_foreground:t.foreground===void 0?null:y.Format.CSS.formatHexA(t.foreground,true),_bold:t.bold===void 0?null:t.bold,_underline:t.underline===void 0?null:t.underline,_italic:t.italic===void 0?null:t.italic,_strikethrough:t.strikethrough===void 0?null:t.strikethrough}}i.toJSONObject=e;function r(t){if(t){const l=u=>typeof u==="boolean"?u:void 0;const d=u=>typeof u==="string"?y.fromHex(u):void 0;return new i(d(t._foreground),l(t._bold),l(t._underline),l(t._strikethrough),l(t._italic))}return void 0}i.fromJSONObject=r;function n(t,l){if(t===l){return true}return t!==void 0&&l!==void 0&&(t.foreground instanceof y?t.foreground.equals(l.foreground):l.foreground===void 0)&&t.bold===l.bold&&t.underline===l.underline&&t.strikethrough===l.strikethrough&&t.italic===l.italic}i.equals=n;function c(t){return t instanceof i}i.is=c;function s(t){return new i(t.foreground,t.bold,t.underline,t.strikethrough,t.italic)}i.fromData=s;function a(t,l,d,u,g,m){let k=void 0;if(t!==void 0){k=y.fromHex(t)}if(l!==void 0){d=m=u=g=false;const D=/italic|bold|underline|strikethrough/g;let T;while(T=D.exec(l)){switch(T[0]){case"bold":d=true;break;case"italic":m=true;break;case"underline":u=true;break;case"strikethrough":g=true;break}}}return new i(k,d,u,g,m)}i.fromSettings=a})(f);var O;(function(i){function e(s,a){if(a&&typeof a._selector==="string"&&a._style){const t=f.fromJSONObject(a._style);if(t){try{return{selector:s.parseTokenSelector(a._selector),style:t}}catch(l){}}}return void 0}i.fromJSONObject=e;function r(s){return{_selector:s.selector.id,_style:f.toJSONObject(s.style)}}i.toJSONObject=r;function n(s,a){if(s===a){return true}return s!==void 0&&a!==void 0&&s.selector&&a.selector&&s.selector.id===a.selector.id&&f.equals(s.style,a.style)}i.equals=n;function c(s){return s&&s.selector&&typeof s.selector.id==="string"&&f.is(s.style)}i.is=c})(O||(O={}));const j={TokenClassificationContribution:"base.contributions.tokenClassification"};class L{constructor(){this._onDidChangeSchema=new $;this.onDidChangeSchema=this._onDidChangeSchema.event;this.currentTypeNumber=0;this.currentModifierBit=1;this.tokenStylingDefaultRules=[];this.tokenStylingSchema={type:"object",properties:{},patternProperties:{[x]:S()},additionalProperties:false,definitions:{style:{type:"object",description:o(7082,"Colors and styles for the token."),properties:{foreground:{type:"string",description:o(7083,"Foreground color for the token."),format:"color-hex",default:"#ff0000"},background:{type:"string",deprecationMessage:o(7084,"Token background colors are currently not supported.")},fontStyle:{type:"string",description:o(7085,"Sets the all font styles of the rule: 'italic', 'bold', 'underline' or 'strikethrough' or a combination. All styles that are not listed are unset. The empty string unsets all styles."),pattern:B,patternErrorMessage:o(7086,"Font style must be 'italic', 'bold', 'underline' or 'strikethrough' or a combination. The empty string unsets all styles."),defaultSnippets:[{label:o(7087,"None (clear inherited style)"),bodyText:'""'},{body:"italic"},{body:"bold"},{body:"underline"},{body:"strikethrough"},{body:"italic bold"},{body:"italic underline"},{body:"italic strikethrough"},{body:"bold underline"},{body:"bold strikethrough"},{body:"underline strikethrough"},{body:"italic bold underline"},{body:"italic bold strikethrough"},{body:"italic underline strikethrough"},{body:"bold underline strikethrough"},{body:"italic bold underline strikethrough"}]},bold:{type:"boolean",description:o(7088,"Sets or unsets the font style to bold. Note, the presence of 'fontStyle' overrides this setting.")},italic:{type:"boolean",description:o(7089,"Sets or unsets the font style to italic. Note, the presence of 'fontStyle' overrides this setting.")},underline:{type:"boolean",description:o(7090,"Sets or unsets the font style to underline. Note, the presence of 'fontStyle' overrides this setting.")},strikethrough:{type:"boolean",description:o(7091,"Sets or unsets the font style to strikethrough. Note, the presence of 'fontStyle' overrides this setting.")}},defaultSnippets:[{body:{foreground:"${1:#FF0000}",fontStyle:"${2:bold}"}}]}}};this.tokenTypeById=Object.create(null);this.tokenModifierById=Object.create(null);this.typeHierarchy=Object.create(null)}registerTokenType(e,r,n,c){if(!e.match(b)){throw new Error("Invalid token type id.")}if(n&&!n.match(b)){throw new Error("Invalid token super type id.")}const s=this.currentTypeNumber++;const a={num:s,id:e,superType:n,description:r,deprecationMessage:c};this.tokenTypeById[e]=a;const t=S(r,c);this.tokenStylingSchema.properties[e]=t;this.typeHierarchy=Object.create(null)}registerTokenModifier(e,r,n){if(!e.match(b)){throw new Error("Invalid token modifier id.")}const c=this.currentModifierBit;this.currentModifierBit=this.currentModifierBit*2;const s={num:c,id:e,description:r,deprecationMessage:n};this.tokenModifierById[e]=s;this.tokenStylingSchema.properties[`*.${e}`]=S(r,n)}parseTokenSelector(e,r){const n=J(e,r);if(!n.type){return{match:()=>-1,id:"$invalid"}}return{match:(c,s,a)=>{let t=0;if(n.language!==void 0){if(n.language!==a){return-1}t+=10}if(n.type!==A){const l=this.getTypeHierarchy(c);const d=l.indexOf(n.type);if(d===-1){return-1}t+=100-d}for(const l of n.modifiers){if(s.indexOf(l)===-1){return-1}}return t+n.modifiers.length*100},id:`${[n.type,...n.modifiers.sort()].join(".")}${n.language!==void 0?":"+n.language:""}`}}registerTokenStyleDefault(e,r){this.tokenStylingDefaultRules.push({selector:e,defaults:r})}deregisterTokenStyleDefault(e){const r=e.id;this.tokenStylingDefaultRules=this.tokenStylingDefaultRules.filter(n=>n.selector.id!==r)}deregisterTokenType(e){delete this.tokenTypeById[e];delete this.tokenStylingSchema.properties[e];this.typeHierarchy=Object.create(null)}deregisterTokenModifier(e){delete this.tokenModifierById[e];delete this.tokenStylingSchema.properties[`*.${e}`]}getTokenTypes(){return Object.keys(this.tokenTypeById).map(e=>this.tokenTypeById[e])}getTokenModifiers(){return Object.keys(this.tokenModifierById).map(e=>this.tokenModifierById[e])}getTokenStylingSchema(){return this.tokenStylingSchema}getTokenStylingDefaultRules(){return this.tokenStylingDefaultRules}getTypeHierarchy(e){let r=this.typeHierarchy[e];if(!r){this.typeHierarchy[e]=r=[e];let n=this.tokenTypeById[e];while(n&&n.superType){r.push(n.superType);n=this.tokenTypeById[n.superType]}}return r}toString(){const e=(r,n)=>{const c=r.indexOf(".")===-1?0:1;const s=n.indexOf(".")===-1?0:1;if(c!==s){return c-s}return r.localeCompare(n)};return Object.keys(this.tokenTypeById).sort(e).map(r=>`- \`${r}\`: ${this.tokenTypeById[r].description}`).join("\n")}}const C=I.charCodeAt(0);const H=M.charCodeAt(0);function J(i,e){let r=i.length;let n=e;const c=[];for(let a=r-1;a>=0;a--){const t=i.charCodeAt(a);if(t===C||t===H){const l=i.substring(a+1,r);r=a;if(t===C){n=l}else{c.push(l)}}}const s=i.substring(0,r);return{type:s,modifiers:c,language:n}}const p=F();_.add(j.TokenClassificationContribution,p);function F(){const i=new L;function e(n,c,s=[],a,t){i.registerTokenType(n,c,a,t);if(s){r(n,s)}return n}function r(n,c){try{const s=i.parseTokenSelector(n);i.registerTokenStyleDefault(s,{scopesToProbe:c})}catch(s){console.log(s)}}e("comment",o(7092,"Style for comments."),[["comment"]]);e("string",o(7093,"Style for strings."),[["string"]]);e("keyword",o(7094,"Style for keywords."),[["keyword.control"]]);e("number",o(7095,"Style for numbers."),[["constant.numeric"]]);e("regexp",o(7096,"Style for expressions."),[["constant.regexp"]]);e("operator",o(7097,"Style for operators."),[["keyword.operator"]]);e("namespace",o(7098,"Style for namespaces."),[["entity.name.namespace"]]);e("type",o(7099,"Style for types."),[["entity.name.type"],["support.type"]]);e("struct",o(7100,"Style for structs."),[["entity.name.type.struct"]]);e("class",o(7101,"Style for classes."),[["entity.name.type.class"],["support.class"]]);e("interface",o(7102,"Style for interfaces."),[["entity.name.type.interface"]]);e("enum",o(7103,"Style for enums."),[["entity.name.type.enum"]]);e("typeParameter",o(7104,"Style for type parameters."),[["entity.name.type.parameter"]]);e("function",o(7105,"Style for functions"),[["entity.name.function"],["support.function"]]);e("member",o(7106,"Style for member functions"),[],"method","Deprecated use `method` instead");e("method",o(7107,"Style for method (member functions)"),[["entity.name.function.member"],["support.function"]]);e("macro",o(7108,"Style for macros."),[["entity.name.function.preprocessor"]]);e("variable",o(7109,"Style for variables."),[["variable.other.readwrite"],["entity.name.variable"]]);e("parameter",o(7110,"Style for parameters."),[["variable.parameter"]]);e("property",o(7111,"Style for properties."),[["variable.other.property"]]);e("enumMember",o(7112,"Style for enum members."),[["variable.other.enummember"]]);e("event",o(7113,"Style for events."),[["variable.other.event"]]);e("decorator",o(7114,"Style for decorators & annotations."),[["entity.name.decorator"],["entity.name.function"]]);e("label",o(7115,"Style for labels. "),void 0);i.registerTokenModifier("declaration",o(7116,"Style for all symbol declarations."),void 0);i.registerTokenModifier("documentation",o(7117,"Style to use for references in documentation."),void 0);i.registerTokenModifier("static",o(7118,"Style to use for symbols that are static."),void 0);i.registerTokenModifier("abstract",o(7119,"Style to use for symbols that are abstract."),void 0);i.registerTokenModifier("deprecated",o(7120,"Style to use for symbols that are deprecated."),void 0);i.registerTokenModifier("modification",o(7121,"Style to use for write accesses."),void 0);i.registerTokenModifier("async",o(7122,"Style to use for symbols that are async."),void 0);i.registerTokenModifier("readonly",o(7123,"Style to use for symbols that are read-only."),void 0);r("variable.readonly",[["variable.other.constant"]]);r("property.readonly",[["variable.other.constant.property"]]);r("type.defaultLibrary",[["support.type"]]);r("class.defaultLibrary",[["support.class"]]);r("interface.defaultLibrary",[["support.class"]]);r("variable.defaultLibrary",[["support.variable"],["support.other.variable"]]);r("variable.defaultLibrary.readonly",[["support.constant"]]);r("property.defaultLibrary",[["support.variable.property"]]);r("property.defaultLibrary.readonly",[["support.constant.property"]]);r("function.defaultLibrary",[["support.function"]]);r("member.defaultLibrary",[["support.function"]]);return i}function q(){return p}function S(i,e){return{description:i,deprecationMessage:e,defaultSnippets:[{body:"${1:#ff0000}"}],anyOf:[{type:"string",format:"color-hex"},{$ref:"#/definitions/style"}]}}const w="vscode://schemas/token-styling";const R=_.as(N.JSONContribution);R.registerSchema(w,p.getTokenStylingSchema());const v=new E(()=>R.notifySchemaChanged(w),200);p.onDidChangeSchema(()=>{if(!v.isScheduled()){v.schedule()}});export{O as S,f as T,b as a,q as g,J as p,w as t};
