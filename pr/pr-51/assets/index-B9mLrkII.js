import{_ as I,c as h,I as L,d as y,e as K,f as U,g as Y,h as J,i as q,j as $,k as j,m as b,n as X,o as z,p as P,q as i,S as N,s as Q,t as w,u as Z,D as V,b as E,T as x,v as tt,w as A,x as T,y as et,z as it,A as ot,B as st,F as R,G as k,H as S,J as nt,K as rt,L as dt,M as H}from"./index-DVBOSnPw.js";function t(){throw new Error("unsupported")}var _;class ht{constructor(){this.selectedEditors=[];this.isSelected=()=>false;this.setSelection=t;this.isTransient=()=>false;this.windowId=P.vscodeWindowId;this.createEditorActions=t;this.onDidFocus=i.None;this.onDidOpenEditorFail=i.None;this.whenRestored=Promise.resolve();this.disposed=false;this.setActive=t;this.notifyIndexChanged=t;this.relayout=t;this.dispose=t;this.toJSON=t;this.minimumWidth=0;this.maximumWidth=Number.POSITIVE_INFINITY;this.minimumHeight=0;this.maximumHeight=Number.POSITIVE_INFINITY;this.onDidChange=i.None;this.layout=t;this.onDidModelChange=i.None;this.onWillDispose=i.None;this.onDidActiveEditorChange=i.None;this.onWillCloseEditor=i.None;this.onDidCloseEditor=i.None;this.onWillMoveEditor=i.None;this.onWillOpenEditor=i.None;this.id=0;this.index=0;this.label="main";this.ariaLabel="main";this.activeEditorPane=void 0;this.activeEditor=null;this.previewEditor=null;this.count=0;this.isEmpty=false;this.isLocked=false;this.stickyCount=0;this.editors=[];this.getEditors=()=>[];this.findEditors=()=>[];this.getEditorByIndex=()=>void 0;this.getIndexOfEditor=t;this.openEditor=t;this.openEditors=t;this.isPinned=()=>false;this.isSticky=()=>false;this.isActive=()=>false;this.contains=()=>false;this.moveEditor=t;this.moveEditors=t;this.copyEditor=t;this.copyEditors=t;this.closeEditor=t;this.closeEditors=t;this.closeAllEditors=t;this.replaceEditors=t;this.pinEditor=()=>{};this.stickEditor=()=>{};this.unstickEditor=()=>{};this.lock=()=>{};this.isFirst=t;this.isLast=t}get groupsView(){return t()}notifyLabelChanged(){}get titleHeight(){return t()}get element(){return t()}get scopedContextKeyService(){return N.get(z)}focus(){}}const G=new ht;class at{constructor(o){this.editor=o;this.onDidChangeControl=i.None;this.onDidChangeSizeConstraints=i.None;this.onDidFocus=i.None;this.onDidBlur=i.None;this.input=void 0;this.options=void 0;this.group=G;this.scopedContextKeyService=void 0;this.getViewState=t;this.isVisible=t;this.hasFocus=t;this.getId=t;this.getTitle=t;this.focus=t}get minimumWidth(){return R.width}get maximumWidth(){return k.width}get minimumHeight(){return R.height}get maximumHeight(){return k.height}getControl(){return this.editor}}function ut(u,o,a){async function l(s,d,c){const e=T(s)?d:s.options;if(et(d)){c=d}const n=it(s)||T(s)?s.resource:void 0;if(n==null||!u.canHandleResource(n)){return await o(s,d,c)}let r;const v=N.get(w).listCodeEditors();r=v.find(p=>p instanceof A&&p.getModel()!=null&&p.getModel().uri.toString()===n.toString());if(r==null){const p=await o(s,d,c);if(p!=null){return p}const g=await u.createModelReference(n);r=await a?.(g,e,c===ot);if(r==null){g.dispose();return void 0}}if(e!=null){st(e,r,1)}if(!(e?.preserveFocus??false)){r.focus();r.getContainerDomNode().scrollIntoView()}return new at(r)}return l}let W=class gt extends Q{constructor(o,a,l,s,d,c,e,n,r,v,p,g,f){super(void 0,l,s,d,c,e,n,r,v,p,g);this._isEditorPartVisible=a;this.openEditor=ut(f,this.openEditor.bind(this),o)}get activeTextEditorControl(){const o=N.get(w).getFocusedCodeEditor();if(o!=null&&o instanceof Z){return o}return super.activeTextEditorControl}async openEditor(o,a,l){if(!this._isEditorPartVisible()){return void 0}return await super.openEditor(o,a,l)}};W=I([h(2,L),h(3,y),h(4,K),h(5,U),h(6,Y),h(7,J),h(8,q),h(9,$),h(10,j),h(11,b),h(12,X)],W);class F{constructor(o,a,l){this.editor=o;this.input=a;this.group=l;this.onDidChangeControl=i.None;this.options=void 0;this.minimumWidth=0;this.maximumWidth=Number.POSITIVE_INFINITY;this.minimumHeight=0;this.maximumHeight=Number.POSITIVE_INFINITY;this.onDidChangeSizeConstraints=i.None;this.scopedContextKeyService=void 0;this.onDidFocus=this.editor.onDidFocusEditorWidget;this.onDidBlur=this.editor.onDidBlurEditorWidget}getControl(){return this.editor}getViewState(){return void 0}isVisible(){return true}hasFocus(){return this.editor.hasWidgetFocus()}getId(){return this.editor.getId()}getTitle(){return void 0}focus(){this.editor.focus()}}let C=_=class Et extends V{constructor(o,a,l){super();this.editor=o;this.scopedContextKeyService=l;this.active=false;this.selectedEditors=[];this.isSelected=()=>false;this.setSelection=t;this.isTransient=()=>false;this.windowId=P.vscodeWindowId;this.onDidFocus=this.editor.onDidFocusEditorWidget;this.onDidOpenEditorFail=i.None;this.whenRestored=Promise.resolve();this.disposed=false;this.notifyIndexChanged=t;this.relayout=t;this.toJSON=t;this.minimumWidth=0;this.maximumWidth=Number.POSITIVE_INFINITY;this.minimumHeight=0;this.maximumHeight=Number.POSITIVE_INFINITY;this.onDidChange=this.editor.onDidLayoutChange;this.layout=()=>this.editor.layout();this._onDidModelChange=new E;this.onDidModelChange=this._onDidModelChange.event;this.onWillDispose=this.editor.onDidDispose;this._onDidActiveEditorChange=new E;this.onDidActiveEditorChange=this._onDidActiveEditorChange.event;this.onWillCloseEditor=i.None;this._onDidCloseEditor=new E;this.onDidCloseEditor=this._onDidCloseEditor.event;this.onWillMoveEditor=i.None;this._onWillOpenEditor=new E;this.onWillOpenEditor=this._onWillOpenEditor.event;this.id=--_.idCounter;this.index=-1;this.label=`standalone editor ${-this.id}`;this.ariaLabel=`standalone editor ${-this.id}`;this.previewEditor=null;this.isLocked=true;this.stickyCount=0;this.getEditors=()=>this.editors;this.findEditors=e=>this.pane!=null&&e.toString()===this.pane.input.resource.toString()?[this.pane.input]:[];this.getEditorByIndex=e=>this.pane!=null&&e===0?this.pane.input:void 0;this.getIndexOfEditor=e=>this.pane!=null&&this.pane.input===e?0:-1;this.openEditor=async e=>{if(e.isDisposed()){return void 0}if(e instanceof x&&e.resource.toString()===this.pane?.input.resource.toString()){this.focus();return this.pane}return void 0};this.openEditors=async e=>{if(e.length===1){return await this.openEditor(e[0].editor)}return void 0};this.isPinned=()=>false;this.isSticky=()=>false;this.isActive=()=>this.editor.hasWidgetFocus();this.contains=e=>{return this.pane!=null&&this.pane.input===e};this.moveEditor=t;this.moveEditors=t;this.copyEditor=t;this.copyEditors=t;this.closeEditor=t;this.closeEditors=t;this.closeAllEditors=t;this.replaceEditors=t;this.pinEditor=()=>{};this.stickEditor=()=>{};this.unstickEditor=()=>{};this.lock=()=>{};this.isFirst=t;this.isLast=t;const s=e=>{const n=a.createInstance(x,e,void 0,void 0,void 0,void 0);this._onWillOpenEditor.fire({editor:n,groupId:this.id});this.pane=new F(o,n,this);this._onDidModelChange.fire({kind:5,editor:n,editorIndex:0});this._onDidActiveEditorChange.fire({editor:n})};const d=e=>{if(this.pane!=null&&this.pane.input.resource.toString()===e.toString()){const n=this.pane;this.pane=void 0;this._onDidModelChange.fire({kind:6,editorIndex:0});this._onDidActiveEditorChange.fire({editor:void 0});this._onDidCloseEditor.fire({context:tt.UNKNOWN,editor:n.input,groupId:this.id,index:0,sticky:false})}};o.onDidChangeModel(e=>{if(e.oldModelUrl!=null){d(e.oldModelUrl)}if(e.newModelUrl!=null){s(e.newModelUrl)}});this._register({dispose:()=>{const e=o.getModel();if(e!=null){d(e.uri)}}});const c=o.getModel();if(c!=null){const e=a.createInstance(x,c.uri,void 0,void 0,void 0,void 0);this.pane=new F(o,e,this)}}get groupsView(){return t()}notifyLabelChanged(){}createEditorActions(){return{actions:{primary:[],secondary:[]},onDidChange:i.None}}get titleHeight(){return t()}setActive(o){this.active=o}get element(){return this.editor.getContainerDomNode()}get activeEditorPane(){return this.pane}get activeEditor(){return this.pane?.input??null}get count(){return this.pane!=null?1:0}get isEmpty(){return this.pane==null}get editors(){return this.pane!=null?[this.pane.input]:[]}focus(){this.editor.focus();this.editor.getContainerDomNode().scrollIntoView()}};C.idCounter=0;C=_=I([h(1,y),h(2,z)],C);let O=class vt extends V{constructor(o,a,l){super();this.delegate=o;this.instantiationService=l;this._serviceBrand=void 0;this.additionalGroups=[];this.activeGroupOverride=void 0;this.onDidCreateAuxiliaryEditorPart=this.delegate.onDidCreateAuxiliaryEditorPart;this.onDidChangeGroupMaximized=this.delegate.onDidChangeGroupMaximized;this._onDidChangeActiveGroup=new E;this.onDidChangeActiveGroup=i.any(this._onDidChangeActiveGroup.event,this.delegate.onDidChangeActiveGroup);this._onDidAddGroup=new E;this.onDidAddGroup=i.any(this._onDidAddGroup.event,this.delegate.onDidAddGroup);this._onDidRemoveGroup=new E;this.onDidRemoveGroup=i.any(this._onDidRemoveGroup.event,this.delegate.onDidRemoveGroup);this.onDidMoveGroup=this.delegate.onDidMoveGroup;this.onDidActivateGroup=this.delegate.onDidActivateGroup;this.onDidChangeGroupIndex=this.delegate.onDidChangeGroupIndex;this.onDidChangeGroupLocked=this.delegate.onDidChangeGroupLocked;this.getLayout=()=>{return this.delegate.getLayout()};this.getGroups=s=>{return[...this.delegate.getGroups(s),...this.additionalGroups]};this.getGroup=s=>{return this.delegate.getGroup(s)??this.additionalGroups.find(d=>d.id===s)};this.activateGroup=(...s)=>{return this.delegate.activateGroup(...s)};this.getSize=(...s)=>{return this.delegate.getSize(...s)};this.setSize=(...s)=>{return this.delegate.setSize(...s)};this.arrangeGroups=(...s)=>{return this.delegate.arrangeGroups(...s)};this.applyLayout=(...s)=>{return this.delegate.applyLayout(...s)};this.setGroupOrientation=(...s)=>{return this.delegate.setGroupOrientation(...s)};this.findGroup=(...s)=>{return this.delegate.findGroup(...s)};this.addGroup=(...s)=>{return this.delegate.addGroup(...s)};this.removeGroup=(...s)=>{return this.delegate.removeGroup(...s)};this.moveGroup=(...s)=>{return this.delegate.moveGroup(...s)};this.mergeGroup=(...s)=>{return this.delegate.mergeGroup(...s)};this.mergeAllGroups=(...s)=>{return this.delegate.mergeAllGroups(...s)};this.copyGroup=(...s)=>{return this.delegate.copyGroup(...s)};this.onDidChangeEditorPartOptions=this.delegate.onDidChangeEditorPartOptions;setTimeout(()=>{const s=N.get(w);const d=e=>{if(e instanceof A){let n;const r=m=>{const D=m!=null?this.additionalGroups.find(B=>B.editor===m):void 0;if(this.activeGroupOverride!==D){this.activeGroupOverride=D;this._onDidChangeActiveGroup.fire(this.activeGroup)}};const v=m=>{if(!a&&this.activeGroupOverride===this.additionalGroups.find(D=>D.editor===m)){r(void 0)}};const p=()=>{if(n!=null)window.clearTimeout(n);r(e)};const g=()=>{if(n!=null)window.clearTimeout(n);n=window.setTimeout(()=>{n=void 0;v(e)},100)};e.onDidDispose(()=>{v(e)});e.onDidFocusEditorText(p);e.onDidFocusEditorWidget(p);e.onDidBlurEditorText(g);e.onDidBlurEditorWidget(g);if(e.hasWidgetFocus()){p()}const f=l.createInstance(C,e);this.additionalGroups.push(f);this._onDidAddGroup.fire(f)}};const c=e=>{if(e instanceof A){const n=this.additionalGroups.find(r=>r.editor===e);if(n!=null){n.dispose();if(this.activeGroupOverride===n){this.activeGroupOverride=void 0;this._onDidChangeActiveGroup.fire(this.activeGroup)}this.additionalGroups=this.additionalGroups.filter(r=>r!==n);this._onDidRemoveGroup.fire(n)}}};this._register(s.onCodeEditorAdd(d));this._register(s.onCodeEditorRemove(c));s.listCodeEditors().forEach(d)})}getScopedInstantiationService(){return this.instantiationService}registerContextKeyProvider(o){return this.delegate.registerContextKeyProvider(o)}saveWorkingSet(o){return this.delegate.saveWorkingSet(o)}getWorkingSets(){return this.delegate.getWorkingSets()}applyWorkingSet(o){return this.delegate.applyWorkingSet(o)}deleteWorkingSet(o){return this.delegate.deleteWorkingSet(o)}get isReady(){return this.delegate.isReady}get whenReady(){return this.delegate.whenReady}get whenRestored(){return this.delegate.whenRestored}get hasRestorableState(){return this.delegate.hasRestorableState}get parts(){return this.delegate.parts}createAuxiliaryEditorPart(o){return this.delegate.createAuxiliaryEditorPart(o)}get mainPart(){return this.delegate.mainPart}getPart(o){return this.delegate.getPart(o)}toggleMaximizeGroup(o){return this.delegate.toggleMaximizeGroup(o)}toggleExpandGroup(o){return this.delegate.toggleExpandGroup(o)}createEditorDropTarget(o,a){return this.delegate.createEditorDropTarget(o,a)}get groups(){return[...this.additionalGroups,...this.delegate.groups]}get activeGroup(){return this.activeGroupOverride??this.delegate.activeGroup}get sideGroup(){return this.delegate.sideGroup}get count(){return this.delegate.count+this.additionalGroups.length}get orientation(){return this.delegate.orientation}get partOptions(){return this.delegate.partOptions}};O=I([h(2,y)],O);class lt{constructor(){this.onWillDispose=i.None;this.hasMaximizedGroup=()=>false;this.windowId=P.vscodeWindowId;this.onDidLayout=i.None;this.onDidScroll=i.None;this.isReady=true;this.whenReady=Promise.resolve();this.whenRestored=Promise.resolve();this.hasRestorableState=false;this.centerLayout=t;this.isLayoutCentered=t;this.enforcePartOptions=t;this.onDidChangeActiveGroup=i.None;this.onDidAddGroup=i.None;this.onDidRemoveGroup=i.None;this.onDidMoveGroup=i.None;this.onDidActivateGroup=i.None;this.onDidChangeGroupIndex=i.None;this.onDidChangeGroupLocked=i.None;this.onDidChangeGroupMaximized=i.None;this.activeGroup=G;this.groups=[G];this.count=0;this.orientation=0;this.getGroups=()=>[];this.getGroup=()=>void 0;this.activateGroup=t;this.getSize=t;this.setSize=t;this.arrangeGroups=t;this.toggleMaximizeGroup=t;this.toggleExpandGroup=t;this.applyLayout=t;this.getLayout=t;this.setGroupOrientation=t;this.findGroup=()=>void 0;this.addGroup=t;this.removeGroup=t;this.moveGroup=t;this.mergeGroup=t;this.mergeAllGroups=t;this.copyGroup=t;this.partOptions=H;this.onDidChangeEditorPartOptions=i.None;this.createEditorDropTarget=t}get contentDimension(){return t()}get sideGroup(){return t()}}class pt{constructor(){this.getScopedInstantiationService=t;this.registerContextKeyProvider=t;this.saveWorkingSet=t;this.getWorkingSets=t;this.applyWorkingSet=t;this.deleteWorkingSet=t;this.onDidCreateAuxiliaryEditorPart=i.None;this.mainPart=new lt;this.activePart=this.mainPart;this.parts=[this.mainPart];this.getPart=t;this.createAuxiliaryEditorPart=t;this.onDidChangeGroupMaximized=i.None;this.toggleMaximizeGroup=t;this.toggleExpandGroup=t;this.partOptions=H;this.createEditorDropTarget=t;this._serviceBrand=void 0;this.getLayout=t;this.onDidChangeActiveGroup=i.None;this.onDidAddGroup=i.None;this.onDidRemoveGroup=i.None;this.onDidMoveGroup=i.None;this.onDidActivateGroup=i.None;this.onDidLayout=i.None;this.onDidScroll=i.None;this.onDidChangeGroupIndex=i.None;this.onDidChangeGroupLocked=i.None;this.activeGroup=G;this.groups=[G];this.count=0;this.orientation=0;this.isReady=false;this.whenReady=Promise.resolve();this.whenRestored=Promise.resolve();this.hasRestorableState=false;this.getGroups=()=>[];this.getGroup=()=>void 0;this.activateGroup=t;this.getSize=t;this.setSize=t;this.arrangeGroups=t;this.applyLayout=t;this.centerLayout=t;this.isLayoutCentered=()=>false;this.setGroupOrientation=t;this.findGroup=()=>void 0;this.addGroup=t;this.removeGroup=t;this.moveGroup=t;this.mergeGroup=t;this.mergeAllGroups=t;this.copyGroup=t;this.onDidChangeEditorPartOptions=i.None;this.enforcePartOptions=t}get contentDimension(){return t()}get sideGroup(){return t()}}let M=class Gt extends O{constructor(o){super(o.createInstance(pt),true,o)}};M=I([h(0,y)],M);function ft(u){return{[w.toString()]:new S(nt,void 0,true),[rt.toString()]:new S(W,[u,()=>false],true),[b.toString()]:new S(dt,[],false),[L.toString()]:new S(M)}}export{W as MonacoEditorService,ft as default};
