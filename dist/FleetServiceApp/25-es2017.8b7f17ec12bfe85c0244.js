(window.webpackJsonp=window.webpackJsonp||[]).push([[25],{"1tnI":function(t,e,i){"use strict";i.r(e),i.d(e,"SettingsModule",(function(){return k}));var s=i("ofXK"),c=i("tyNb"),n=i("uswQ"),r=i("fXoL"),a=i("ua6w"),o=i("2Vo4"),l=i("AytR"),b=i("tk/3");let p=(()=>{class t{constructor(t){this.http=t,this.brands=new o.a([]),this.types=new o.a([]),this.models=new o.a([]),this.URL_API=l.a.apiUrl+"/settings",this.URL=l.a.apiUrl}updateTables(t){return this.http.post(this.URL_API+"/UpdateTables",t)}deleteByDomainAndId(t,e){return this.http.delete(`${this.URL_API}/Delete?domain=${t}&rowId=${e}`)}updateEmail(t){return this.http.post(this.URL_API+"/Update",t)}getSettings(){return this.http.get(this.URL_API+"/GetSettings")}getDataForReport(t){return this.http.get(`${this.URL}/${t}`)}}return t.\u0275fac=function(e){return new(e||t)(r.fc(b.a))},t.\u0275prov=r.Rb({token:t,factory:t.\u0275fac}),t})();var u=i("3LUQ"),d=i("wZkO"),m=i("aIEI"),h=i("QgiH"),f=i("oOf3");function g(t,e){if(1&t&&(r.bc(0,"th"),r.Mc(1),r.ac()),2&t){const t=e.$implicit;r.Jb(1),r.Nc(t)}}function v(t,e){if(1&t){const t=r.cc();r.bc(0,"tr"),r.bc(1,"td"),r.Mc(2),r.ac(),r.bc(3,"td"),r.Mc(4),r.ac(),r.bc(5,"td"),r.bc(6,"i",2),r.ic("click",(function(){r.Dc(t);const i=e.$implicit;return r.mc().delete(i.id)})),r.ac(),r.ac(),r.ac()}if(2&t){const t=e.$implicit;r.Jb(2),r.Nc(t.id),r.Jb(2),r.Nc(t.name)}}const y=function(t){return{itemsPerPage:10,currentPage:t}};let _=(()=>{class t{constructor(t,e){this._settings=t,this._alert=e,this.item="",this.table={columns:["Codigo","Nombre","Acciones"]},this.p=1}ngOnInit(){this.setRows()}setRows(){const t=this.isBrand()?"brands":this.isType()?"types":"models";this._settings[t].subscribe(t=>this.table.rows=t)}isBrand(){return this.item.toUpperCase()==="Marcas".toUpperCase()}isType(){return this.item.toUpperCase()==="tipos".toUpperCase()}delete(t){this._alert.confirmDelete().then(e=>{if(e.isConfirmed){const e=this.isBrand()?"brands":this.isType()?"types":"models";this._settings.deleteByDomainAndId(e,t).subscribe(()=>{this._alert.succes("Elemento eliminado con exito"),this.table.rows=this.table.rows.filter(e=>e.id!==t)},()=>this._alert.error(m.a))}})}}return t.\u0275fac=function(e){return new(e||t)(r.Vb(p),r.Vb(u.a))},t.\u0275cmp=r.Pb({type:t,selectors:[["app-table"]],inputs:{item:"item"},decls:7,vars:7,consts:[[1,"table","table-striped"],[4,"ngFor","ngForOf"],["title","Eliminar",1,"fas","fa-trash-alt","text-danger","pointer",3,"click"]],template:function(t,e){1&t&&(r.bc(0,"table",0),r.bc(1,"thead"),r.bc(2,"tr"),r.Lc(3,g,2,1,"th",1),r.ac(),r.ac(),r.bc(4,"tbody"),r.Lc(5,v,7,2,"tr",1),r.nc(6,"paginate"),r.ac(),r.ac()),2&t&&(r.Jb(3),r.uc("ngForOf",e.table.columns),r.Jb(2),r.uc("ngForOf",r.pc(6,2,e.table.rows,r.xc(5,y,e.p))))},directives:[s.n],pipes:[f.b],styles:[".pointer[_ngcontent-%COMP%]{cursor:pointer}"]}),t})(),w=(()=>{class t{constructor(t,e,i){this._settings=t,this._parameter=e,this._alert=i,this.item=""}loadData(t){h.a.convertExcelToArray(t.target.files[0],t=>{const e=x[this.item];this._settings.updateTables({domain:e,rows:t}).subscribe(()=>{e==x.Marcas?this.getBrands():this.getTypes(),this._alert.succes(this.item+" cargados con exito")},()=>this._alert.error(m.a))})}getBrands(){this._parameter.getBrands().subscribe(t=>{this._settings.brands.next(t)},()=>this._alert.error(m.a))}getTypes(){this._parameter.getVehiculeType().subscribe(t=>{this._settings.types.next(t)},()=>this._alert.error(m.a))}}return t.\u0275fac=function(e){return new(e||t)(r.Vb(p),r.Vb(a.a),r.Vb(u.a))},t.\u0275cmp=r.Pb({type:t,selectors:[["app-unique-setting"]],inputs:{item:"item"},decls:8,vars:3,consts:[[1,"mt-2","d-flex","justify-content-between","align-items-center"],[1,"btn","btn-success",3,"click"],["type","file","accept",".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel","hidden","",3,"change"],["file",""],[3,"item"]],template:function(t,e){if(1&t){const t=r.cc();r.bc(0,"div",0),r.bc(1,"h1"),r.Mc(2),r.ac(),r.bc(3,"button",1),r.ic("click",(function(){return r.Dc(t),r.Cc(6).click()})),r.Mc(4),r.ac(),r.bc(5,"input",2,3),r.ic("change",(function(t){return e.loadData(t)})),r.ac(),r.ac(),r.Wb(7,"app-table",4)}2&t&&(r.Jb(2),r.Nc(e.item),r.Jb(2),r.Oc(" Cargar ",e.item," "),r.Jb(3),r.uc("item",e.item))},directives:[_],styles:[""]}),t})();var x=function(t){return t.Marcas="brands",t.Tipos="types",t}({}),M=i("3Pt+");function F(t,e){if(1&t&&(r.bc(0,"option",17),r.Mc(1),r.ac()),2&t){const t=e.$implicit;r.uc("value",t.id),r.Jb(1),r.Oc(" ",t.name," ")}}function C(t,e){if(1&t&&(r.bc(0,"option",17),r.Mc(1),r.ac()),2&t){const t=e.$implicit;r.uc("value",t.id),r.Jb(1),r.Oc(" ",t.name," ")}}let O=(()=>{class t{constructor(t,e,i,s){this._parameter=t,this._alert=e,this._settings=i,this.fb=s,this.brands=[],this.types=[],this.initForm()}initForm(){this.modelsForm=this.fb.group({brandId:["",M.z.required],typeId:["",M.z.required]})}ngOnInit(){this.getFilters()}getFilters(){this._settings.brands.subscribe(t=>this.brands=t),this._settings.types.subscribe(t=>this.types=t)}search(){const{brandId:t,typeId:e}=this.modelsForm.value;this._parameter.getVehiculeModel(t,e).subscribe(t=>{this._settings.models.next(t)},()=>this._alert.error(m.a))}loadData(t){h.a.convertExcelToArray(t.target.files[0],t=>{const e=Object.assign({domain:"models",rows:t},this.modelsForm.value);this._settings.updateTables(e).subscribe(()=>{this._alert.succes("Modelos cargados con exito"),this.search()},()=>this._alert.error(m.a))})}}return t.\u0275fac=function(e){return new(e||t)(r.Vb(a.a),r.Vb(u.a),r.Vb(p),r.Vb(M.f))},t.\u0275cmp=r.Pb({type:t,selectors:[["app-vehicule-model"]],decls:30,vars:5,consts:[[1,"mt-2","d-flex","justify-content-between","align-items-center"],[1,"btn","btn-success",3,"disabled","click"],["type","file","hidden","","accept",".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",3,"change"],["file",""],[3,"formGroup","ngSubmit"],[1,"row"],[1,"col-lg-8","row"],[1,"col-6"],[1,"form-group"],["formControlName","brandId",1,"form-control"],["value",""],[3,"value",4,"ngFor","ngForOf"],[1,"col-lg-6"],["formControlName","typeId",1,"form-control"],[1,"col-4","text-center","mt-4"],["type","submit",1,"btn","btn-primary",3,"disabled"],["item","models"],[3,"value"]],template:function(t,e){if(1&t){const t=r.cc();r.bc(0,"div",0),r.bc(1,"h1"),r.Mc(2,"Lineas de vehiculos"),r.ac(),r.bc(3,"button",1),r.ic("click",(function(){return r.Dc(t),r.Cc(6).click()})),r.Mc(4," Cargar modelos "),r.ac(),r.bc(5,"input",2,3),r.ic("change",(function(t){return e.loadData(t)})),r.ac(),r.ac(),r.bc(7,"form",4),r.ic("ngSubmit",(function(){return e.search()})),r.bc(8,"div",5),r.bc(9,"div",6),r.bc(10,"div",7),r.bc(11,"div",8),r.bc(12,"label"),r.Mc(13,"Marcas"),r.ac(),r.bc(14,"select",9),r.bc(15,"option",10),r.Mc(16,"Seleccione..."),r.ac(),r.Lc(17,F,2,2,"option",11),r.ac(),r.ac(),r.ac(),r.bc(18,"div",12),r.bc(19,"div",8),r.bc(20,"label"),r.Mc(21,"Tipos"),r.ac(),r.bc(22,"select",13),r.bc(23,"option",10),r.Mc(24,"Seleccione..."),r.ac(),r.Lc(25,C,2,2,"option",11),r.ac(),r.ac(),r.ac(),r.ac(),r.bc(26,"div",14),r.bc(27,"button",15),r.Mc(28," Buscar "),r.ac(),r.ac(),r.ac(),r.ac(),r.Wb(29,"app-table",16)}2&t&&(r.Jb(3),r.uc("disabled",e.modelsForm.invalid),r.Jb(4),r.uc("formGroup",e.modelsForm),r.Jb(10),r.uc("ngForOf",e.brands),r.Jb(8),r.uc("ngForOf",e.types),r.Jb(2),r.uc("disabled",e.modelsForm.invalid))},directives:[M.B,M.r,M.k,M.x,M.q,M.i,M.u,M.A,s.n,_],styles:[""]}),t})(),V=(()=>{class t{constructor(t,e,i){this._settings=t,this._alert=e,this.fb=i,this.isVisibility=!1,this.initForm()}initForm(){this.notificacionsForm=this.fb.group({id:"",email:["",M.z.required],password:["",M.z.required]})}ngOnInit(){this.getSettings()}toggleVisibility(){this.isVisibility=!this.isVisibility}update(){this._settings.updateEmail(this.notificacionsForm.value).subscribe(()=>this._alert.succes("Parametros actualizados con exito"),()=>this._alert.error(m.a))}getSettings(){this._settings.getSettings().subscribe(t=>this.notificacionsForm.setValue(t),()=>this._alert.error(m.a))}}return t.\u0275fac=function(e){return new(e||t)(r.Vb(p),r.Vb(u.a),r.Vb(M.f))},t.\u0275cmp=r.Pb({type:t,selectors:[["app-notifications"]],decls:21,vars:4,consts:[[1,"mt-3"],[1,"container-fluid",3,"formGroup","ngSubmit"],[1,"row"],[1,"col-lg-10","row"],[1,"col-lg-6"],[1,"form-group"],["type","text","formControlName","email",1,"form-control"],[1,"input-group","mb-3"],["formControlName","password",1,"form-control",3,"type"],[1,"input-group-text","material-symbols-outlined","pointer",3,"click"],[1,"col-lg-2","text-center"],["type","submit",1,"btn","btn-success","mt-4",3,"disabled"]],template:function(t,e){1&t&&(r.bc(0,"h1",0),r.Mc(1,"Notificaciones"),r.ac(),r.bc(2,"form",1),r.ic("ngSubmit",(function(){return e.update()})),r.bc(3,"div",2),r.bc(4,"div",3),r.bc(5,"div",4),r.bc(6,"div",5),r.bc(7,"label"),r.Mc(8,"Correo electronico"),r.ac(),r.Wb(9,"input",6),r.ac(),r.ac(),r.bc(10,"div",4),r.bc(11,"div",5),r.bc(12,"label"),r.Mc(13,"Contrase\xf1a"),r.ac(),r.bc(14,"div",7),r.Wb(15,"input",8),r.bc(16,"span",9),r.ic("click",(function(){return e.toggleVisibility()})),r.Mc(17),r.ac(),r.ac(),r.ac(),r.ac(),r.ac(),r.bc(18,"div",10),r.bc(19,"button",11),r.Mc(20," Actualizar "),r.ac(),r.ac(),r.ac(),r.ac()),2&t&&(r.Jb(2),r.uc("formGroup",e.notificacionsForm),r.Jb(13),r.uc("type",e.isVisibility?"text":"password"),r.Jb(2),r.Nc(e.isVisibility?"visibility_off":"visibility"),r.Jb(2),r.uc("disabled",e.notificacionsForm.invalid))},directives:[M.B,M.r,M.k,M.c,M.q,M.i],styles:[""]}),t})();var P=i("XNiG");function I(t,e){if(1&t&&(r.bc(0,"option",8),r.Mc(1),r.ac()),2&t){const t=e.$implicit;r.uc("value",t.id),r.Jb(1),r.Oc(" ",t.name," ")}}let J=(()=>{class t{constructor(t,e,i,s){this._parameter=t,this._alert=e,this._settings=i,this.fb=s,this.reports=[],this.subject=new P.a,this.initForm()}initForm(){this.fieldForm=this.fb.group({name:["",M.z.required]})}ngOnInit(){this.getReports()}getReports(){this._parameter.getReports().subscribe(t=>this.reports=t)}downloadReport(){const t=+this.fieldForm.get("name").value,e=this.reports.find(e=>e.id===t);switch(e.method){case"downloadClient":this.downloadClient(e)}}downloadClient(t){this.getArrayForExcel(t.service),this.subject.subscribe(e=>{const i=e.map(t=>{var e;return{Nombre:t.name,Apellido:t.lastName,Documento:t.document,Celular:t.cellphone,Telefono:t.phone,Direccion:t.address,SitioWeb:t.website,Ciudad:null===(e=t.city)||void 0===e?void 0:e.name,Contactos:t.contacts.map(t=>`${this.notNull(t.name)} ${this.notNull(t.phone)}`).toString(),Vehiculos:t.vehicles.map(t=>t.licensePlate).toString()}});h.a.convertArrayToFile(i,t.name.trim())})}notNull(t){return null!=t?t:""}getArrayForExcel(t){return this._settings.getDataForReport(t).subscribe(t=>this.subject.next(t),()=>this._alert.error(m.a)),this.subject.asObservable()}}return t.\u0275fac=function(e){return new(e||t)(r.Vb(a.a),r.Vb(u.a),r.Vb(p),r.Vb(M.f))},t.\u0275cmp=r.Pb({type:t,selectors:[["app-reports"]],decls:14,vars:3,consts:[[1,"mt-2"],[3,"formGroup","ngSubmit"],[1,"text-right"],["type","submit",1,"btn","btn-success",3,"disabled"],[1,"form-group"],["formControlName","name",1,"form-control"],["value",""],[3,"value",4,"ngFor","ngForOf"],[3,"value"]],template:function(t,e){1&t&&(r.bc(0,"h1",0),r.Mc(1,"Reportes"),r.ac(),r.bc(2,"div"),r.bc(3,"form",1),r.ic("ngSubmit",(function(){return e.downloadReport()})),r.bc(4,"div",2),r.bc(5,"button",3),r.Mc(6," Descargar excel "),r.ac(),r.ac(),r.bc(7,"div",4),r.bc(8,"label"),r.Mc(9,"Reporte"),r.ac(),r.bc(10,"select",5),r.bc(11,"option",6),r.Mc(12,"Seleccione..."),r.ac(),r.Lc(13,I,2,2,"option",7),r.ac(),r.ac(),r.ac(),r.ac()),2&t&&(r.Jb(3),r.uc("formGroup",e.fieldForm),r.Jb(2),r.uc("disabled",e.fieldForm.invalid),r.Jb(8),r.uc("ngForOf",e.reports))},directives:[M.B,M.r,M.k,M.x,M.q,M.i,M.u,M.A,s.n],styles:["ul[_ngcontent-%COMP%]{display:contents;list-style:none}"]}),t})();const T=[{path:"",component:n.a,children:[{path:"",component:(()=>{class t{constructor(t,e,i){this._parameter=t,this._settings=e,this._alert=i}ngOnInit(){this.getBrands(),this.getTypes()}getBrands(){this._parameter.getBrands().subscribe(t=>{this._settings.brands.next(t)},t=>this._alert.error(t.error.Message))}getTypes(){this._parameter.getVehiculeType().subscribe(t=>{this._settings.types.next(t)},t=>this._alert.error(t.error.Message))}}return t.\u0275fac=function(e){return new(e||t)(r.Vb(a.a),r.Vb(p),r.Vb(u.a))},t.\u0275cmp=r.Pb({type:t,selectors:[["app-list-settings"]],decls:14,vars:0,consts:[["id","container__content"],["mat-align-tabs","start"],["label","Marcas"],["item","Marcas"],["label","Tipos de vehiculos"],["item","Tipos"],["label","Lineas de vehiculos"],["label","Notificaciones"],["label","Reportes"]],template:function(t,e){1&t&&(r.bc(0,"div",0),r.bc(1,"h1"),r.Mc(2,"Configuraciones"),r.ac(),r.bc(3,"mat-tab-group",1),r.bc(4,"mat-tab",2),r.Wb(5,"app-unique-setting",3),r.ac(),r.bc(6,"mat-tab",4),r.Wb(7,"app-unique-setting",5),r.ac(),r.bc(8,"mat-tab",6),r.Wb(9,"app-vehicule-model"),r.ac(),r.bc(10,"mat-tab",7),r.Wb(11,"app-notifications"),r.ac(),r.bc(12,"mat-tab",8),r.Wb(13,"app-reports"),r.ac(),r.ac(),r.ac())},directives:[d.b,d.a,w,O,V,J],styles:["i[_ngcontent-%COMP%]{margin:0 3px;cursor:pointer}.col-number[_ngcontent-%COMP%]{max-width:50px;width:50px}table[_ngcontent-%COMP%]{cursor:pointer}.container-filter[_ngcontent-%COMP%]{display:flex;flex-direction:row;margin-bottom:30px}.container-filter[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{width:150px;cursor:pointer;margin-left:10px}.btn-add[_ngcontent-%COMP%]{border-radius:50%;width:50px;height:50px;cursor:pointer;position:relative;left:93%;margin-bottom:20px;top:15px;outline:none;text-align:center;font-size:24px;border:none;z-index:55}#container__content[_ngcontent-%COMP%]{transition:margin-left 1s;padding:20px 50px;margin-left:250px}@media only screen and (max-width:600px){.col-mobile-hide[_ngcontent-%COMP%]{display:none}.btn-add[_ngcontent-%COMP%]{left:80vw}}"]}),t})()}]}];let R=(()=>{class t{}return t.\u0275mod=r.Tb({type:t}),t.\u0275inj=r.Sb({factory:function(e){return new(e||t)},imports:[[c.f.forChild(T)],c.f]}),t})();var S=i("xHqg"),N=i("Z/wE");let k=(()=>{class t{}return t.\u0275mod=r.Tb({type:t}),t.\u0275inj=r.Sb({factory:function(e){return new(e||t)},providers:[p],imports:[[s.c,S.c,N.a,M.w,R,d.c]]}),t})()},aIEI:function(t,e,i){"use strict";i.d(e,"a",(function(){return s}));const s="Se ha presentado un error. Intente en otra ocasi\xf3n"}}]);