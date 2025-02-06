import{O as y,D as S,P as m,_ as I,c as _,Q as C,U as w,V as E,$ as i,W as h,C as f,X as c,Y as L,Z as v,a0 as b,a1 as x,a2 as N,a3 as z,a4 as H,a5 as M,a6 as D,a7 as T,a8 as A,a9 as W,aa as $,ab as B}from"./index-8AeE9Fdf.js";var O=".monaco-editor .tokens-inspect-widget{background-color:var(--vscode-editorHoverWidget-background);border:1px solid var(--vscode-editorHoverWidget-border);color:var(--vscode-editorHoverWidget-foreground);padding:10px;user-select:text;-webkit-user-select:text;z-index:50}.monaco-editor.hc-black .tokens-inspect-widget,.monaco-editor.hc-light .tokens-inspect-widget{border-width:2px}.monaco-editor .tokens-inspect-widget .tokens-inspect-separator{background-color:var(--vscode-editorHoverWidget-border);border:0;height:1px}.monaco-editor .tokens-inspect-widget .tm-token{font-family:var(--monaco-monospace-font)}.monaco-editor .tokens-inspect-widget .tm-token-length{float:right;font-size:60%;font-weight:400}.monaco-editor .tokens-inspect-widget .tm-metadata-table{width:100%}.monaco-editor .tokens-inspect-widget .tm-metadata-value{font-family:var(--monaco-monospace-font);text-align:right}.monaco-editor .tokens-inspect-widget .tm-token-type{font-family:var(--monaco-monospace-font)}";y(O,{});var k;let l=class G extends S{static{k=this}static{this.ID="editor.contrib.inspectTokens"}static get(t){return t.getContribution(k.ID)}constructor(t,e,o){super();this._editor=t;this._languageService=o;this._widget=null;this._register(this._editor.onDidChangeModel(n=>this.stop()));this._register(this._editor.onDidChangeModelLanguage(n=>this.stop()));this._register(m.onDidChange(n=>this.stop()));this._register(this._editor.onKeyUp(n=>n.keyCode===9&&this.stop()))}dispose(){this.stop();super.dispose()}launch(){if(this._widget){return}if(!this._editor.hasModel()){return}this._widget=new p(this._editor,this._languageService)}stop(){if(this._widget){this._widget.dispose();this._widget=null}}};l=k=I([_(1,C),_(2,w)],l);class P extends b{constructor(){super({id:"editor.action.inspectTokens",label:x.inspectTokensAction,alias:"Developer: Inspect Tokens",precondition:void 0})}run(t,e){const o=l.get(e);o?.launch()}}function R(d){let t="";for(let e=0,o=d.length;e<o;e++){const n=d.charCodeAt(e);switch(n){case 9:t+="→";break;case 32:t+="·";break;default:t+=String.fromCharCode(n)}}return t}function F(d,t){const e=m.get(t);if(e){return e}const o=d.encodeLanguageId(t);return{getInitialState:()=>N,tokenize:(n,g,r)=>z(t,r),tokenizeEncoded:(n,g,r)=>H(o,r)}}class p extends S{static{this._ID="editor.contrib.inspectTokensWidget"}constructor(t,e){super();this.allowEditorOverflow=true;this._editor=t;this._languageService=e;this._model=this._editor.getModel();this._domNode=document.createElement("div");this._domNode.className="tokens-inspect-widget";this._tokenizationSupport=F(this._languageService.languageIdCodec,this._model.getLanguageId());this._compute(this._editor.getPosition());this._register(this._editor.onDidChangeCursorPosition(o=>this._compute(this._editor.getPosition())));this._editor.addContentWidget(this)}dispose(){this._editor.removeContentWidget(this);super.dispose()}getId(){return p._ID}_compute(t){const e=this._getTokensAtLine(t.lineNumber);let o=0;for(let a=e.tokens1.length-1;a>=0;a--){const u=e.tokens1[a];if(t.column-1>=u.offset){o=a;break}}let n=0;for(let a=e.tokens2.length>>>1;a>=0;a--){if(t.column-1>=e.tokens2[a<<1]){n=a;break}}const g=this._model.getLineContent(t.lineNumber);let r="";if(o<e.tokens1.length){const a=e.tokens1[o].offset;const u=o+1<e.tokens1.length?e.tokens1[o+1].offset:g.length;r=g.substring(a,u)}E(this._domNode,i("h2.tm-token",void 0,R(r),i("span.tm-token-length",void 0,`${r.length} ${r.length===1?"char":"chars"}`)));h(this._domNode,i("hr.tokens-inspect-separator",{"style":"clear:both"}));const s=(n<<1)+1<e.tokens2.length?this._decodeMetadata(e.tokens2[(n<<1)+1]):null;h(this._domNode,i("table.tm-metadata-table",void 0,i("tbody",void 0,i("tr",void 0,i("td.tm-metadata-key",void 0,"language"),i("td.tm-metadata-value",void 0,`${s?s.languageId:"-?-"}`)),i("tr",void 0,i("td.tm-metadata-key",void 0,"token type"),i("td.tm-metadata-value",void 0,`${s?this._tokenTypeToString(s.tokenType):"-?-"}`)),i("tr",void 0,i("td.tm-metadata-key",void 0,"font style"),i("td.tm-metadata-value",void 0,`${s?this._fontStyleToString(s.fontStyle):"-?-"}`)),i("tr",void 0,i("td.tm-metadata-key",void 0,"foreground"),i("td.tm-metadata-value",void 0,`${s?f.Format.CSS.formatHex(s.foreground):"-?-"}`)),i("tr",void 0,i("td.tm-metadata-key",void 0,"background"),i("td.tm-metadata-value",void 0,`${s?f.Format.CSS.formatHex(s.background):"-?-"}`)))));h(this._domNode,i("hr.tokens-inspect-separator"));if(o<e.tokens1.length){h(this._domNode,i("span.tm-token-type",void 0,e.tokens1[o].type))}this._editor.layoutContentWidget(this)}_decodeMetadata(t){const e=m.getColorMap();const o=c.getLanguageId(t);const n=c.getTokenType(t);const g=c.getFontStyle(t);const r=c.getForeground(t);const s=c.getBackground(t);return{languageId:this._languageService.languageIdCodec.decodeLanguageId(o),tokenType:n,fontStyle:g,foreground:e[r],background:e[s]}}_tokenTypeToString(t){switch(t){case 0:return"Other";case 1:return"Comment";case 2:return"String";case 3:return"RegEx";default:return"??"}}_fontStyleToString(t){let e="";if(t&1){e+="italic "}if(t&2){e+="bold "}if(t&4){e+="underline "}if(t&8){e+="strikethrough "}if(e.length===0){e="---"}return e}_getTokensAtLine(t){const e=this._getStateBeforeLine(t);const o=this._tokenizationSupport.tokenize(this._model.getLineContent(t),true,e);const n=this._tokenizationSupport.tokenizeEncoded(this._model.getLineContent(t),true,e);return{startState:e,tokens1:o.tokens,tokens2:n.tokens,endState:o.endState}}_getStateBeforeLine(t){let e=this._tokenizationSupport.getInitialState();for(let o=1;o<t;o++){const n=this._tokenizationSupport.tokenize(this._model.getLineContent(o),true,e);e=n.endState}return e}getDomNode(){return this._domNode}getPosition(){return{position:this._editor.getPosition(),preference:[2,1]}}}L(l.ID,l,4);v(P);class K extends b{constructor(){super({id:"editor.action.toggleHighContrast",label:M.toggleHighContrast,alias:"Toggle High Contrast Theme",precondition:void 0});this._originalThemeName=null}run(t,e){const o=t.get(C);const n=o.getColorTheme();if(D(n.type)){o.setTheme(this._originalThemeName||(T(n.type)?A:W));this._originalThemeName=null}else{o.setTheme(T(n.type)?$:B);this._originalThemeName=n.themeName}}}v(K);function U(){return{}}export{U as default};
