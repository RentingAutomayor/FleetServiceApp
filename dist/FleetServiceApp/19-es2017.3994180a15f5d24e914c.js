(window.webpackJsonp=window.webpackJsonp||[]).push([[19],{aouF:function(t,e,n){"use strict";n.d(e,"a",(function(){return s}));var o=n("tk/3"),i=n("AytR"),c=n("fXoL");let s=(()=>{class t{constructor(t){this.http=t,this.URL_API=i.a.apiUrl+"/Movement",this.HttpOptions={headers:new o.c({"Content-Type":"application/json"})}}getMovementTypeSelected(){return this.movementTypeSelected}setMovementTypeSelected(t){this.movementTypeSelected=t}getMovementToUpdate(){return this.movementToUpdate}setMovementToUpdate(t){this.movementToUpdate=t}async getMovementTypes(){return this.http.get(this.URL_API+"/GetTypes").toPromise()}async getMovements(){return this.http.get(this.URL_API+"/Get").toPromise()}async getMovementById(t){return this.http.get(`${this.URL_API}/GetById?pMovement_id=${t}`).toPromise()}async insert(t){return this.http.post(this.URL_API+"/Insert",t,this.HttpOptions).toPromise()}async update(t){return this.http.post(this.URL_API+"/Update",t,this.HttpOptions).toPromise()}async delete(t){return this.http.post(this.URL_API+"/Delete",t,this.HttpOptions).toPromise()}}return t.\u0275fac=function(e){return new(e||t)(c.fc(o.a))},t.\u0275prov=c.Rb({token:t,factory:t.\u0275fac,providedIn:"root"}),t})()},jvTp:function(t,e,n){"use strict";n.d(e,"a",(function(){return o})),n.d(e,"b",(function(){return i}));class o{}var i=function(t){return t[t.CREACION_DE_CUPO=1]="CREACION_DE_CUPO",t[t.ADICION_DE_CUPO=2]="ADICION_DE_CUPO",t[t.CANCELACION_DE_CUPO=3]="CANCELACION_DE_CUPO",t[t.ORDEN_DE_TRABAJO=4]="ORDEN_DE_TRABAJO",t[t.APROBACION_DE_ORDEN_DE_TRABAJO=5]="APROBACION_DE_ORDEN_DE_TRABAJO",t[t.CANCELACION_DE_ORDEN_DE_TRABAJO=6]="CANCELACION_DE_ORDEN_DE_TRABAJO",t[t.LIBERACION_DE_CUPO=7]="LIBERACION_DE_CUPO",t[t.FINALIZACION_ORDEN_DE_TRABAJO=8]="FINALIZACION_ORDEN_DE_TRABAJO",t[t.ANULACION_ORDEN_DE_TRABAJO=9]="ANULACION_ORDEN_DE_TRABAJO",t}({})},xVXS:function(t,e,n){"use strict";n.r(e),n.d(e,"MovementModule",(function(){return T}));var o=n("ofXK"),i=n("3Pt+"),c=n("Z/wE"),s=n("tyNb"),a=n("uswQ"),r=n("jvTp");class m{}var l=n("PSD3"),p=n.n(l),d=n("fXoL"),v=n("aouF");function u(t,e){if(1&t&&(d.bc(0,"option",2),d.Mc(1),d.nc(2,"titlecase"),d.ac()),2&t){const t=e.$implicit;d.uc("value",t.id),d.Jb(1),d.Oc(" ",d.oc(2,2,t.name),"")}}let h=(()=>{class t{constructor(t){this.movementService=t,this.frmMovementType=new i.j({cmbMovementType:new i.g("Seleccione...")})}ngOnChanges(t){for(const e in t)"countChanges"==e&&this.validateMovementTypeSelected()}ngOnInit(){this.initComponents()}initComponents(){this.getMovementTypeList()}async getMovementTypeList(){try{this.lsMovementType=await this.movementService.getMovementTypes(),this.validateMovementTypeSelected()}catch(t){console.warn(t)}}validateMovementTypeSelected(){this.movementTypeSelected=this.movementService.getMovementTypeSelected(),null!=this.movementTypeSelected&&null!=this.movementTypeSelected?this.setDataInForm(this.movementTypeSelected):this.clearDataInForm()}setMovementType(t){const e=this.lsMovementType.find(e=>e.id==t.value);this.movementService.setMovementTypeSelected(e)}setDataInForm(t){const{cmbMovementType:e}=this.frmMovementType.controls;setTimeout(()=>{e.setValue(t.id),this.movementService.setMovementTypeSelected(t)},300)}clearDataInForm(){const{cmbMovementType:t}=this.frmMovementType.controls;t.setValue(0)}}return t.\u0275fac=function(e){return new(e||t)(d.Vb(v.a))},t.\u0275cmp=d.Pb({type:t,selectors:[["app-movement-type"]],inputs:{countChanges:"countChanges"},features:[d.Hb],decls:7,vars:3,consts:[[3,"formGroup"],["formControlName","cmbMovementType",1,"browser-default","custom-select",3,"change"],[3,"value"],[3,"value",4,"ngFor","ngForOf"]],template:function(t,e){1&t&&(d.bc(0,"form",0),d.bc(1,"label"),d.Mc(2,"Tipo de movimiento"),d.ac(),d.bc(3,"select",1),d.ic("change",(function(t){return e.setMovementType(t.target)})),d.bc(4,"option",2),d.Mc(5,"Seleccione ..."),d.ac(),d.Lc(6,u,3,4,"option",3),d.ac(),d.ac()),2&t&&(d.uc("formGroup",e.frmMovementType),d.Jb(4),d.uc("value",0),d.Jb(2),d.uc("ngForOf",e.lsMovementType))},directives:[i.B,i.r,i.k,i.x,i.q,i.i,i.u,i.A,o.n],pipes:[o.x],styles:[""]}),t})();var b=n("9Wwi");function g(t,e){1&t&&d.Wb(0,"app-img-loading")}let _=(()=>{class t{constructor(t,e){this.router=t,this.movementService=e,this.frmMovement=new i.j({txtName:new i.g(""),txtDescription:new i.g("")})}ngOnChanges(t){for(const e in t)"countChanges"==e&&this.validateMovementToUpdate()}ngOnInit(){this.initComponents()}initComponents(){this.validateMovementToUpdate()}validateMovementToUpdate(){this.movementToUpdate=this.movementService.getMovementToUpdate(),null!=this.movementToUpdate&&null!=this.movementToUpdate?(this.isToUpdate=!0,this.setDataInForm(this.movementToUpdate)):(this.isToUpdate=!1,this.clearDataInForm())}comeBackTable(){this.router.navigate(["/MasterMovements"])}getDataForm(){const{txtName:t,txtDescription:e}=this.frmMovement.controls,n=new r.a;return null!=this.movementToUpdate&&null!=this.movementToUpdate&&(n.id=this.movementToUpdate.id),n.name=t.value,n.name=n.name.toUpperCase(),n.description=e.value,n.description=n.description.toUpperCase(),n.type=this.movementService.getMovementTypeSelected(),n}setDataInForm(t){const{txtName:e,txtDescription:n}=this.frmMovement.controls;e.setValue(t.name.toLocaleLowerCase()),n.setValue(t.description.toLocaleLowerCase()),this.movementService.setMovementTypeSelected(t.type),this.countChanges+=1}clearDataInForm(){const{txtName:t,txtDescription:e}=this.frmMovement.controls;t.setValue(""),e.setValue(""),this.movementService.setMovementTypeSelected(null),this.countChanges+=1}async saveMovement(){try{const t=this.getDataForm();let e=new m;this.isAwaiting=!0,e=this.isToUpdate?await this.movementService.update(t):await this.movementService.insert(t),this.isAwaiting=!1,e.response&&(p.a.fire({position:"center",icon:"success",title:e.message,showConfirmButton:!0}),this.router.navigate(["/MasterMovements"]))}catch(t){console.warn(t)}}openTab(t,e){const n=document.getElementsByClassName("tab_link");for(let i=0;i<n.length;i++)n[i].classList.remove("active");t.target.className+=" active";const o=document.getElementsByClassName("tab_content");for(let i=0;i<o.length;i++)o[i].setAttribute("style","display:none");document.getElementById("container__"+e).setAttribute("style","display:blick")}hideContainerTabs(){const t=document.getElementsByClassName("tab_inactive");for(let e=0;e<t.length;e++)t[e].setAttribute("style","display:none")}}return t.\u0275fac=function(e){return new(e||t)(d.Vb(s.b),d.Vb(v.a))},t.\u0275cmp=d.Pb({type:t,selectors:[["app-movement"]],inputs:{countChanges:"countChanges"},features:[d.Hb],decls:24,vars:3,consts:[["id","container__content"],[1,"container__tabPanel"],[1,"container__titles"],[1,"tab_link","active",3,"click"],[3,"formGroup"],["id","container__basicData",1,"tab_content"],[1,"row__container"],[1,"col"],["type","text","formControlName","txtName","placeholder","Nombre ...",1,"form-control"],[3,"countChanges"],[1,"row__container__single"],["formControlName","txtDescription","cols","10","rows","2",1,"form-control"],["id","container__buttons",1,"buttons__container"],["type","button",1,"btn","btn-danger",3,"click"],["type","button",1,"btn","btn-success",3,"click"],[4,"ngIf"]],template:function(t,e){1&t&&(d.bc(0,"div",0),d.bc(1,"div",1),d.bc(2,"div",2),d.bc(3,"button",3),d.ic("click",(function(t){return e.openTab(t,"basicData")})),d.Mc(4,"Datos del movimiento"),d.ac(),d.ac(),d.ac(),d.bc(5,"form",4),d.bc(6,"div",5),d.bc(7,"div",6),d.bc(8,"div",7),d.bc(9,"label"),d.Mc(10,"Nombre"),d.ac(),d.Wb(11,"input",8),d.ac(),d.bc(12,"div",7),d.Wb(13,"app-movement-type",9),d.ac(),d.ac(),d.bc(14,"div",10),d.bc(15,"label"),d.Mc(16,"Descripci\xf3n"),d.ac(),d.Wb(17,"textarea",11),d.ac(),d.ac(),d.ac(),d.bc(18,"div",12),d.bc(19,"button",13),d.ic("click",(function(){return e.comeBackTable()})),d.Mc(20,"Cancelar"),d.ac(),d.bc(21,"button",14),d.ic("click",(function(){return e.saveMovement()})),d.Mc(22,"Guardar"),d.ac(),d.ac(),d.ac(),d.Lc(23,g,1,0,"app-img-loading",15)),2&t&&(d.Jb(5),d.uc("formGroup",e.frmMovement),d.Jb(8),d.uc("countChanges",e.countChanges),d.Jb(10),d.uc("ngIf",e.isAwaiting))},directives:[i.B,i.r,i.k,i.c,i.q,i.i,h,o.o,b.a],styles:[".container__row[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr 1fr;grid-row:1fr}.container__col[_ngcontent-%COMP%], .container__observation[_ngcontent-%COMP%], .container__vehicleModel[_ngcontent-%COMP%]{padding:10px}.buttons__container[_ngcontent-%COMP%]{display:flex;justify-content:flex-end}.buttons__container[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{width:200px;margin-left:10px;margin-top:20px}.card-body[_ngcontent-%COMP%]{padding:10px}.container__titles[_ngcontent-%COMP%]{overflow:hidden;border:1px solid #ccc;background-color:#f1f1f1}.container__titles[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{background-color:inherit;float:left;border:none;outline:none;cursor:pointer;padding:14px 16px;transition:.3s;font-size:20px}.container__titles[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover{background-color:#ddd}.container__titles[_ngcontent-%COMP%]   button.active[_ngcontent-%COMP%]{background-color:#ccc}.tab_content[_ngcontent-%COMP%]{padding:20px 50px;border:1px solid #ccc;border-top:none}#container__content[_ngcontent-%COMP%]{transition:margin-left 1s;padding:20px;margin-left:250px}.row__container[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr}.row__container__single[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr;grid-template-rows:1fr;margin-top:10px;padding:5px 10px}"]}),t})();var f=n("QgiH");function M(t,e){if(1&t){const t=d.cc();d.bc(0,"tr"),d.bc(1,"td"),d.Mc(2),d.ac(),d.bc(3,"td"),d.Mc(4),d.nc(5,"titlecase"),d.ac(),d.bc(6,"td"),d.Mc(7),d.nc(8,"titlecase"),d.ac(),d.bc(9,"td",8),d.Mc(10),d.nc(11,"titlecase"),d.ac(),d.bc(12,"td"),d.Wb(13,"i",9),d.bc(14,"i",10),d.ic("click",(function(){d.Dc(t);const n=e.$implicit;return d.mc().updateMovement(n.id)})),d.ac(),d.bc(15,"i",11),d.ic("click",(function(){d.Dc(t);const n=e.$implicit;return d.mc().deleteMovement(n)})),d.ac(),d.ac(),d.ac()}if(2&t){const t=e.$implicit,n=e.index;d.Jb(2),d.Nc(n+1),d.Jb(2),d.Nc(d.oc(5,5,t.name)),d.Jb(3),d.Nc(d.oc(8,7,t.description)),d.Jb(2),d.uc("title",t.type.description),d.Jb(1),d.Oc(" ",d.oc(11,9,t.type.name)," ")}}function y(t,e){1&t&&d.Wb(0,"app-img-loading")}const C=[{path:"",component:a.a,children:[{path:"",component:(()=>{class t{constructor(t,e){this.movementService=t,this.router=e}ngOnInit(){this.initComponents()}initComponents(){this.countChanges=0,this.isAwaiting=!1,this.getMovementList()}async getMovementList(){try{this.isAwaiting=!0,this.movementService.getMovements().then(t=>this.lsMovements=t),this.isAwaiting=!1}catch(t){console.warn(t)}}insertMovement(){this.movementService.setMovementToUpdate(null),this.countChanges+=1,this.router.navigate(["/MasterMovements/Movement"])}async updateMovement(t){try{const e=await this.movementService.getMovementById(t);this.movementService.setMovementToUpdate(e),this.router.navigate(["/MasterMovements/Movement"])}catch(e){console.warn(e)}}async deleteMovement(t){try{if(confirm("\xbfEst\xe1 seguro que desea eliminar este movimiento?")){this.isAwaiting=!0;const e=await this.movementService.delete(t);this.isAwaiting=!1,e.response&&(p.a.fire({position:"center",icon:"success",title:e.message,showConfirmButton:!0}),this.getMovementList())}}catch(e){console.warn(e)}}downloadExcel(){const t=this.lsMovements.map(t=>{var e;return{Nombre:t.name,Descripcion:t.description,Tipo:null===(e=t.type)||void 0===e?void 0:e.name}});f.a.convertArrayToFile(t,"Movimientos")}}return t.\u0275fac=function(e){return new(e||t)(d.Vb(v.a),d.Vb(s.b))},t.\u0275cmp=d.Pb({type:t,selectors:[["app-tbl-movements"]],decls:23,vars:2,consts:[["id","container__content"],[1,"text-right"],[1,"btn","btn-primary",3,"click"],[1,"btn-add","btn-info",3,"click"],[1,"fas","fa-plus"],[1,"table","table-striped"],[4,"ngFor","ngForOf"],[4,"ngIf"],[3,"title"],["title","M\xe1s informaci\xf3n",1,"fas","fa-info-circle","text-info"],["title","Modificar",1,"fas","fa-edit","text-warning",3,"click"],["title","Eliminar",1,"fas","fa-trash-alt","text-danger",3,"click"]],template:function(t,e){1&t&&(d.bc(0,"div",0),d.bc(1,"h1"),d.Mc(2,"Movimientos"),d.ac(),d.bc(3,"div",1),d.bc(4,"button",2),d.ic("click",(function(){return e.downloadExcel()})),d.Mc(5," Descargar Excel "),d.ac(),d.ac(),d.bc(6,"button",3),d.ic("click",(function(){return e.insertMovement()})),d.Wb(7,"i",4),d.ac(),d.bc(8,"table",5),d.bc(9,"thead"),d.bc(10,"th"),d.Mc(11,"#"),d.ac(),d.bc(12,"th"),d.Mc(13,"Nombre"),d.ac(),d.bc(14,"th"),d.Mc(15,"Descripci\xf3n"),d.ac(),d.bc(16,"th"),d.Mc(17,"Tipo"),d.ac(),d.bc(18,"th"),d.Mc(19,"Acciones"),d.ac(),d.ac(),d.bc(20,"tbody"),d.Lc(21,M,16,11,"tr",6),d.ac(),d.ac(),d.ac(),d.Lc(22,y,1,0,"app-img-loading",7)),2&t&&(d.Jb(21),d.uc("ngForOf",e.lsMovements),d.Jb(1),d.uc("ngIf",e.isAwaiting))},directives:[o.n,o.o,b.a],pipes:[o.x],styles:[".btn-add[_ngcontent-%COMP%]{border-radius:50%;width:50px;height:50px;cursor:pointer;position:relative;left:93%;margin-bottom:20px;top:10px;outline:none;text-align:center;font-size:24px;border:none;z-index:55}#container__content[_ngcontent-%COMP%]{transition:margin-left 1s;padding:20px 50px;margin-left:250px}i[_ngcontent-%COMP%]{margin:0 3px;cursor:pointer}"]}),t})()},{path:"Movement",component:_}]}];let O=(()=>{class t{}return t.\u0275mod=d.Tb({type:t}),t.\u0275inj=d.Sb({factory:function(e){return new(e||t)},imports:[[s.f.forChild(C)],s.f]}),t})(),T=(()=>{class t{}return t.\u0275mod=d.Tb({type:t}),t.\u0275inj=d.Sb({factory:function(e){return new(e||t)},imports:[[o.c,i.l,i.w,c.a,O]]}),t})()}}]);