!function(){function t(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function e(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function n(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}(window.webpackJsonp=window.webpackJsonp||[]).push([[25],{"1tnI":function(e,i,c){"use strict";c.r(i),c.d(i,"SettingsModule",(function(){return G}));var r,a=c("ofXK"),o=c("tyNb"),s=c("uswQ"),u=c("fXoL"),l=c("ua6w"),b=c("2Vo4"),p=c("AytR"),f=c("tk/3"),d=((r=function(){function e(n){t(this,e),this.http=n,this.brands=new b.a([]),this.types=new b.a([]),this.models=new b.a([]),this.URL_API=p.a.apiUrl+"/settings",this.URL=p.a.apiUrl}return n(e,[{key:"updateTables",value:function(t){return this.http.post(this.URL_API+"/UpdateTables",t)}},{key:"deleteByDomainAndId",value:function(t,e){return this.http.delete("".concat(this.URL_API,"/Delete?domain=").concat(t,"&rowId=").concat(e))}},{key:"updateEmail",value:function(t){return this.http.post(this.URL_API+"/Update",t)}},{key:"getSettings",value:function(){return this.http.get(this.URL_API+"/GetSettings")}},{key:"getDataForReport",value:function(t){return this.http.get("".concat(this.URL,"/").concat(t))}}]),e}()).\u0275fac=function(t){return new(t||r)(u.fc(f.a))},r.\u0275prov=u.Rb({token:r,factory:r.\u0275fac}),r),m=c("3LUQ"),h=c("wZkO"),g=c("aIEI"),v=c("QgiH"),y=c("oOf3");function _(t,e){if(1&t&&(u.bc(0,"th"),u.Mc(1),u.ac()),2&t){var n=e.$implicit;u.Jb(1),u.Nc(n)}}function w(t,e){if(1&t){var n=u.cc();u.bc(0,"tr"),u.bc(1,"td"),u.Mc(2),u.ac(),u.bc(3,"td"),u.Mc(4),u.ac(),u.bc(5,"td"),u.bc(6,"i",2),u.ic("click",(function(){u.Dc(n);var t=e.$implicit;return u.mc().delete(t.id)})),u.ac(),u.ac(),u.ac()}if(2&t){var i=e.$implicit;u.Jb(2),u.Nc(i.id),u.Jb(2),u.Nc(i.name)}}var x,k,M=function(t){return{itemsPerPage:10,currentPage:t}},F=((k=function(){function e(n,i){t(this,e),this._settings=n,this._alert=i,this.item="",this.table={columns:["Codigo","Nombre","Acciones"]},this.p=1}return n(e,[{key:"ngOnInit",value:function(){this.setRows()}},{key:"setRows",value:function(){var t=this,e=this.isBrand()?"brands":this.isType()?"types":"models";this._settings[e].subscribe((function(e){return t.table.rows=e}))}},{key:"isBrand",value:function(){return this.item.toUpperCase()==="Marcas".toUpperCase()}},{key:"isType",value:function(){return this.item.toUpperCase()==="tipos".toUpperCase()}},{key:"delete",value:function(t){var e=this;this._alert.confirmDelete().then((function(n){if(n.isConfirmed){var i=e.isBrand()?"brands":e.isType()?"types":"models";e._settings.deleteByDomainAndId(i,t).subscribe((function(){e._alert.succes("Elemento eliminado con exito"),e.table.rows=e.table.rows.filter((function(e){return e.id!==t}))}),(function(){return e._alert.error(g.a)}))}}))}}]),e}()).\u0275fac=function(t){return new(t||k)(u.Vb(d),u.Vb(m.a))},k.\u0275cmp=u.Pb({type:k,selectors:[["app-table"]],inputs:{item:"item"},decls:7,vars:7,consts:[[1,"table","table-striped"],[4,"ngFor","ngForOf"],["title","Eliminar",1,"fas","fa-trash-alt","text-danger","pointer",3,"click"]],template:function(t,e){1&t&&(u.bc(0,"table",0),u.bc(1,"thead"),u.bc(2,"tr"),u.Lc(3,_,2,1,"th",1),u.ac(),u.ac(),u.bc(4,"tbody"),u.Lc(5,w,7,2,"tr",1),u.nc(6,"paginate"),u.ac(),u.ac()),2&t&&(u.Jb(3),u.uc("ngForOf",e.table.columns),u.Jb(2),u.uc("ngForOf",u.pc(6,2,e.table.rows,u.xc(5,M,e.p))))},directives:[a.n],pipes:[y.b],styles:[".pointer[_ngcontent-%COMP%]{cursor:pointer}"]}),k),C=((x=function(){function e(n,i,c){t(this,e),this._settings=n,this._parameter=i,this._alert=c,this.item=""}return n(e,[{key:"loadData",value:function(t){var e=this;v.a.convertExcelToArray(t.target.files[0],(function(t){var n=O[e.item];e._settings.updateTables({domain:n,rows:t}).subscribe((function(){n==O.Marcas?e.getBrands():e.getTypes(),e._alert.succes(e.item+" cargados con exito")}),(function(){return e._alert.error(g.a)}))}))}},{key:"getBrands",value:function(){var t=this;this._parameter.getBrands().subscribe((function(e){t._settings.brands.next(e)}),(function(){return t._alert.error(g.a)}))}},{key:"getTypes",value:function(){var t=this;this._parameter.getVehiculeType().subscribe((function(e){t._settings.types.next(e)}),(function(){return t._alert.error(g.a)}))}}]),e}()).\u0275fac=function(t){return new(t||x)(u.Vb(d),u.Vb(l.a),u.Vb(m.a))},x.\u0275cmp=u.Pb({type:x,selectors:[["app-unique-setting"]],inputs:{item:"item"},decls:8,vars:3,consts:[[1,"mt-2","d-flex","justify-content-between","align-items-center"],[1,"btn","btn-success",3,"click"],["type","file","accept",".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel","hidden","",3,"change"],["file",""],[3,"item"]],template:function(t,e){if(1&t){var n=u.cc();u.bc(0,"div",0),u.bc(1,"h1"),u.Mc(2),u.ac(),u.bc(3,"button",1),u.ic("click",(function(){return u.Dc(n),u.Cc(6).click()})),u.Mc(4),u.ac(),u.bc(5,"input",2,3),u.ic("change",(function(t){return e.loadData(t)})),u.ac(),u.ac(),u.Wb(7,"app-table",4)}2&t&&(u.Jb(2),u.Nc(e.item),u.Jb(2),u.Oc(" Cargar ",e.item," "),u.Jb(3),u.uc("item",e.item))},directives:[F],styles:[""]}),x),O=function(t){return t.Marcas="brands",t.Tipos="types",t}({}),V=c("3Pt+");function P(t,e){if(1&t&&(u.bc(0,"option",17),u.Mc(1),u.ac()),2&t){var n=e.$implicit;u.uc("value",n.id),u.Jb(1),u.Oc(" ",n.name," ")}}function I(t,e){if(1&t&&(u.bc(0,"option",17),u.Mc(1),u.ac()),2&t){var n=e.$implicit;u.uc("value",n.id),u.Jb(1),u.Oc(" ",n.name," ")}}var J,T,R=((T=function(){function e(n,i,c,r){t(this,e),this._parameter=n,this._alert=i,this._settings=c,this.fb=r,this.brands=[],this.types=[],this.initForm()}return n(e,[{key:"initForm",value:function(){this.modelsForm=this.fb.group({brandId:["",V.z.required],typeId:["",V.z.required]})}},{key:"ngOnInit",value:function(){this.getFilters()}},{key:"getFilters",value:function(){var t=this;this._settings.brands.subscribe((function(e){return t.brands=e})),this._settings.types.subscribe((function(e){return t.types=e}))}},{key:"search",value:function(){var t=this,e=this.modelsForm.value,n=e.brandId,i=e.typeId;this._parameter.getVehiculeModel(n,i).subscribe((function(e){t._settings.models.next(e)}),(function(){return t._alert.error(g.a)}))}},{key:"loadData",value:function(t){var e=this;v.a.convertExcelToArray(t.target.files[0],(function(t){var n=Object.assign({domain:"models",rows:t},e.modelsForm.value);e._settings.updateTables(n).subscribe((function(){e._alert.succes("Modelos cargados con exito"),e.search()}),(function(){return e._alert.error(g.a)}))}))}}]),e}()).\u0275fac=function(t){return new(t||T)(u.Vb(l.a),u.Vb(m.a),u.Vb(d),u.Vb(V.f))},T.\u0275cmp=u.Pb({type:T,selectors:[["app-vehicule-model"]],decls:30,vars:5,consts:[[1,"mt-2","d-flex","justify-content-between","align-items-center"],[1,"btn","btn-success",3,"disabled","click"],["type","file","hidden","","accept",".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",3,"change"],["file",""],[3,"formGroup","ngSubmit"],[1,"row"],[1,"col-lg-8","row"],[1,"col-6"],[1,"form-group"],["formControlName","brandId",1,"form-control"],["value",""],[3,"value",4,"ngFor","ngForOf"],[1,"col-lg-6"],["formControlName","typeId",1,"form-control"],[1,"col-4","text-center","mt-4"],["type","submit",1,"btn","btn-primary",3,"disabled"],["item","models"],[3,"value"]],template:function(t,e){if(1&t){var n=u.cc();u.bc(0,"div",0),u.bc(1,"h1"),u.Mc(2,"Lineas de vehiculos"),u.ac(),u.bc(3,"button",1),u.ic("click",(function(){return u.Dc(n),u.Cc(6).click()})),u.Mc(4," Cargar modelos "),u.ac(),u.bc(5,"input",2,3),u.ic("change",(function(t){return e.loadData(t)})),u.ac(),u.ac(),u.bc(7,"form",4),u.ic("ngSubmit",(function(){return e.search()})),u.bc(8,"div",5),u.bc(9,"div",6),u.bc(10,"div",7),u.bc(11,"div",8),u.bc(12,"label"),u.Mc(13,"Marcas"),u.ac(),u.bc(14,"select",9),u.bc(15,"option",10),u.Mc(16,"Seleccione..."),u.ac(),u.Lc(17,P,2,2,"option",11),u.ac(),u.ac(),u.ac(),u.bc(18,"div",12),u.bc(19,"div",8),u.bc(20,"label"),u.Mc(21,"Tipos"),u.ac(),u.bc(22,"select",13),u.bc(23,"option",10),u.Mc(24,"Seleccione..."),u.ac(),u.Lc(25,I,2,2,"option",11),u.ac(),u.ac(),u.ac(),u.ac(),u.bc(26,"div",14),u.bc(27,"button",15),u.Mc(28," Buscar "),u.ac(),u.ac(),u.ac(),u.ac(),u.Wb(29,"app-table",16)}2&t&&(u.Jb(3),u.uc("disabled",e.modelsForm.invalid),u.Jb(4),u.uc("formGroup",e.modelsForm),u.Jb(10),u.uc("ngForOf",e.brands),u.Jb(8),u.uc("ngForOf",e.types),u.Jb(2),u.uc("disabled",e.modelsForm.invalid))},directives:[V.B,V.r,V.k,V.x,V.q,V.i,V.u,V.A,a.n,F],styles:[""]}),T),S=((J=function(){function e(n,i,c){t(this,e),this._settings=n,this._alert=i,this.fb=c,this.isVisibility=!1,this.initForm()}return n(e,[{key:"initForm",value:function(){this.notificacionsForm=this.fb.group({id:"",email:["",V.z.required],password:["",V.z.required]})}},{key:"ngOnInit",value:function(){this.getSettings()}},{key:"toggleVisibility",value:function(){this.isVisibility=!this.isVisibility}},{key:"update",value:function(){var t=this;this._settings.updateEmail(this.notificacionsForm.value).subscribe((function(){return t._alert.succes("Parametros actualizados con exito")}),(function(){return t._alert.error(g.a)}))}},{key:"getSettings",value:function(){var t=this;this._settings.getSettings().subscribe((function(e){return t.notificacionsForm.setValue(e)}),(function(){return t._alert.error(g.a)}))}}]),e}()).\u0275fac=function(t){return new(t||J)(u.Vb(d),u.Vb(m.a),u.Vb(V.f))},J.\u0275cmp=u.Pb({type:J,selectors:[["app-notifications"]],decls:21,vars:4,consts:[[1,"mt-3"],[1,"container-fluid",3,"formGroup","ngSubmit"],[1,"row"],[1,"col-lg-10","row"],[1,"col-lg-6"],[1,"form-group"],["type","text","formControlName","email",1,"form-control"],[1,"input-group","mb-3"],["formControlName","password",1,"form-control",3,"type"],[1,"input-group-text","material-symbols-outlined","pointer",3,"click"],[1,"col-lg-2","text-center"],["type","submit",1,"btn","btn-success","mt-4",3,"disabled"]],template:function(t,e){1&t&&(u.bc(0,"h1",0),u.Mc(1,"Notificaciones"),u.ac(),u.bc(2,"form",1),u.ic("ngSubmit",(function(){return e.update()})),u.bc(3,"div",2),u.bc(4,"div",3),u.bc(5,"div",4),u.bc(6,"div",5),u.bc(7,"label"),u.Mc(8,"Correo electronico"),u.ac(),u.Wb(9,"input",6),u.ac(),u.ac(),u.bc(10,"div",4),u.bc(11,"div",5),u.bc(12,"label"),u.Mc(13,"Contrase\xf1a"),u.ac(),u.bc(14,"div",7),u.Wb(15,"input",8),u.bc(16,"span",9),u.ic("click",(function(){return e.toggleVisibility()})),u.Mc(17),u.ac(),u.ac(),u.ac(),u.ac(),u.ac(),u.bc(18,"div",10),u.bc(19,"button",11),u.Mc(20," Actualizar "),u.ac(),u.ac(),u.ac(),u.ac()),2&t&&(u.Jb(2),u.uc("formGroup",e.notificacionsForm),u.Jb(13),u.uc("type",e.isVisibility?"text":"password"),u.Jb(2),u.Nc(e.isVisibility?"visibility_off":"visibility"),u.Jb(2),u.uc("disabled",e.notificacionsForm.invalid))},directives:[V.B,V.r,V.k,V.c,V.q,V.i],styles:[""]}),J),N=c("XNiG");function A(t,e){if(1&t&&(u.bc(0,"option",8),u.Mc(1),u.ac()),2&t){var n=e.$implicit;u.uc("value",n.id),u.Jb(1),u.Oc(" ",n.name," ")}}var D,L,U,B,q=((D=function(){function e(n,i,c,r){t(this,e),this._parameter=n,this._alert=i,this._settings=c,this.fb=r,this.reports=[],this.subject=new N.a,this.initForm()}return n(e,[{key:"initForm",value:function(){this.fieldForm=this.fb.group({name:["",V.z.required]})}},{key:"ngOnInit",value:function(){this.getReports()}},{key:"getReports",value:function(){var t=this;this._parameter.getReports().subscribe((function(e){return t.reports=e}))}},{key:"downloadReport",value:function(){var t=+this.fieldForm.get("name").value,e=this.reports.find((function(e){return e.id===t}));switch(e.method){case"downloadClient":this.downloadClient(e)}}},{key:"downloadClient",value:function(t){var e=this;this.getArrayForExcel(t.service),this.subject.subscribe((function(n){var i=n.map((function(t){var n;return{Nombre:t.name,Apellido:t.lastName,Documento:t.document,Celular:t.cellphone,Telefono:t.phone,Direccion:t.address,SitioWeb:t.website,Ciudad:null===(n=t.city)||void 0===n?void 0:n.name,Contactos:t.contacts.map((function(t){return"".concat(e.notNull(t.name)," ").concat(e.notNull(t.phone))})).toString(),Vehiculos:t.vehicles.map((function(t){return t.licensePlate})).toString()}}));v.a.convertArrayToFile(i,t.name.trim())}))}},{key:"notNull",value:function(t){return null!=t?t:""}},{key:"getArrayForExcel",value:function(t){var e=this;return this._settings.getDataForReport(t).subscribe((function(t){return e.subject.next(t)}),(function(){return e._alert.error(g.a)})),this.subject.asObservable()}}]),e}()).\u0275fac=function(t){return new(t||D)(u.Vb(l.a),u.Vb(m.a),u.Vb(d),u.Vb(V.f))},D.\u0275cmp=u.Pb({type:D,selectors:[["app-reports"]],decls:14,vars:3,consts:[[1,"mt-2"],[3,"formGroup","ngSubmit"],[1,"text-right"],["type","submit",1,"btn","btn-success",3,"disabled"],[1,"form-group"],["formControlName","name",1,"form-control"],["value",""],[3,"value",4,"ngFor","ngForOf"],[3,"value"]],template:function(t,e){1&t&&(u.bc(0,"h1",0),u.Mc(1,"Reportes"),u.ac(),u.bc(2,"div"),u.bc(3,"form",1),u.ic("ngSubmit",(function(){return e.downloadReport()})),u.bc(4,"div",2),u.bc(5,"button",3),u.Mc(6," Descargar excel "),u.ac(),u.ac(),u.bc(7,"div",4),u.bc(8,"label"),u.Mc(9,"Reporte"),u.ac(),u.bc(10,"select",5),u.bc(11,"option",6),u.Mc(12,"Seleccione..."),u.ac(),u.Lc(13,A,2,2,"option",7),u.ac(),u.ac(),u.ac(),u.ac()),2&t&&(u.Jb(3),u.uc("formGroup",e.fieldForm),u.Jb(2),u.uc("disabled",e.fieldForm.invalid),u.Jb(8),u.uc("ngForOf",e.reports))},directives:[V.B,V.r,V.k,V.x,V.q,V.i,V.u,V.A,a.n],styles:["ul[_ngcontent-%COMP%]{display:contents;list-style:none}"]}),D),E=[{path:"",component:s.a,children:[{path:"",component:(L=function(){function e(n,i,c){t(this,e),this._parameter=n,this._settings=i,this._alert=c}return n(e,[{key:"ngOnInit",value:function(){this.getBrands(),this.getTypes()}},{key:"getBrands",value:function(){var t=this;this._parameter.getBrands().subscribe((function(e){t._settings.brands.next(e)}),(function(e){return t._alert.error(e.error.Message)}))}},{key:"getTypes",value:function(){var t=this;this._parameter.getVehiculeType().subscribe((function(e){t._settings.types.next(e)}),(function(e){return t._alert.error(e.error.Message)}))}}]),e}(),L.\u0275fac=function(t){return new(t||L)(u.Vb(l.a),u.Vb(d),u.Vb(m.a))},L.\u0275cmp=u.Pb({type:L,selectors:[["app-list-settings"]],decls:14,vars:0,consts:[["id","container__content"],["mat-align-tabs","start"],["label","Marcas"],["item","Marcas"],["label","Tipos de vehiculos"],["item","Tipos"],["label","Lineas de vehiculos"],["label","Notificaciones"],["label","Reportes"]],template:function(t,e){1&t&&(u.bc(0,"div",0),u.bc(1,"h1"),u.Mc(2,"Configuraciones"),u.ac(),u.bc(3,"mat-tab-group",1),u.bc(4,"mat-tab",2),u.Wb(5,"app-unique-setting",3),u.ac(),u.bc(6,"mat-tab",4),u.Wb(7,"app-unique-setting",5),u.ac(),u.bc(8,"mat-tab",6),u.Wb(9,"app-vehicule-model"),u.ac(),u.bc(10,"mat-tab",7),u.Wb(11,"app-notifications"),u.ac(),u.bc(12,"mat-tab",8),u.Wb(13,"app-reports"),u.ac(),u.ac(),u.ac())},directives:[h.b,h.a,C,R,S,q],styles:["i[_ngcontent-%COMP%]{margin:0 3px;cursor:pointer}.col-number[_ngcontent-%COMP%]{max-width:50px;width:50px}table[_ngcontent-%COMP%]{cursor:pointer}.container-filter[_ngcontent-%COMP%]{display:flex;flex-direction:row;margin-bottom:30px}.container-filter[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{width:150px;cursor:pointer;margin-left:10px}.btn-add[_ngcontent-%COMP%]{border-radius:50%;width:50px;height:50px;cursor:pointer;position:relative;left:93%;margin-bottom:20px;top:15px;outline:none;text-align:center;font-size:24px;border:none;z-index:55}#container__content[_ngcontent-%COMP%]{transition:margin-left 1s;padding:20px 50px;margin-left:250px}@media only screen and (max-width:600px){.col-mobile-hide[_ngcontent-%COMP%]{display:none}.btn-add[_ngcontent-%COMP%]{left:80vw}}"]}),L)}]}],j=((U=function e(){t(this,e)}).\u0275mod=u.Tb({type:U}),U.\u0275inj=u.Sb({factory:function(t){return new(t||U)},imports:[[o.f.forChild(E)],o.f]}),U),W=c("xHqg"),z=c("Z/wE"),G=((B=function e(){t(this,e)}).\u0275mod=u.Tb({type:B}),B.\u0275inj=u.Sb({factory:function(t){return new(t||B)},providers:[d],imports:[[a.c,W.c,z.a,V.w,j,h.c]]}),B)},aIEI:function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));var i="Se ha presentado un error. Intente en otra ocasi\xf3n"}}])}();