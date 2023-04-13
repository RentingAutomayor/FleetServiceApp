!function(){function t(t,c){if(!(t instanceof c))throw new TypeError("Cannot call a class as a function")}function c(t,c){for(var a=0;a<c.length;a++){var n=c[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function a(t,a,n){return a&&c(t.prototype,a),n&&c(t,n),t}(window.webpackJsonp=window.webpackJsonp||[]).push([[26],{Y2t2:function(c,n,e){"use strict";e.r(n),e.d(n,"ApprovalcontractModule",(function(){return J}));var i,o,r=e("ofXK"),s=e("tyNb"),b=e("uswQ"),l=e("7I7t"),d=e("0IaG"),p=e("fXoL"),u=(e("cRgG"),e("Wp6s")),f=e("kmnG"),g=e("bTqV"),m=((i=function(){function c(a,n){t(this,c),this.dialogRef=a,this.data=n}return a(c,[{key:"onNoClick",value:function(){this.dialogRef.close()}}]),c}()).\u0275fac=function(t){return new(t||i)(p.Vb(d.h),p.Vb(d.a))},i.\u0275cmp=p.Pb({type:i,selectors:[["dialog-approvalcontract"]],decls:79,vars:14,consts:[[1,"content"],[1,"title"],["mat-dialog-title",""],[1,"content-data"],[1,"img"],["mat-card-image","","src","../../../../assets/images/contract.svg","alt","Contract"],[1,"info"],["mat-dialog-content",""],["matInput","",3,"disabled","value"],["mat-dialog-actions","","align","center"],["mat-raised-button","","mat-dialog-close","","color","warn",3,"click"]],template:function(t,c){1&t&&(p.bc(0,"div",0),p.bc(1,"div",1),p.bc(2,"h1",2),p.Mc(3,"Informacion del Contrato"),p.ac(),p.ac(),p.bc(4,"div",3),p.bc(5,"div",4),p.Wb(6,"img",5),p.ac(),p.bc(7,"div",6),p.bc(8,"div",7),p.bc(9,"ul"),p.bc(10,"li"),p.bc(11,"b"),p.Mc(12,"Codigo Interno: "),p.ac(),p.bc(13,"span"),p.Mc(14),p.ac(),p.ac(),p.bc(15,"li"),p.bc(16,"b"),p.Mc(17,"C\xf3digo referencia: "),p.ac(),p.bc(18,"span"),p.Mc(19),p.ac(),p.ac(),p.bc(20,"li"),p.bc(21,"b"),p.Mc(22,"Cliente: "),p.ac(),p.bc(23,"span"),p.Mc(24),p.ac(),p.ac(),p.bc(25,"li"),p.bc(26,"b"),p.Mc(27,"Concesionario: "),p.ac(),p.bc(28,"span"),p.Mc(29),p.ac(),p.ac(),p.bc(30,"li"),p.bc(31,"b"),p.Mc(32,"Plazo en meses: "),p.ac(),p.bc(33,"span"),p.Mc(34),p.ac(),p.ac(),p.bc(35,"li"),p.bc(36,"b"),p.Mc(37,"Veh. contratados: "),p.ac(),p.bc(38,"span"),p.Mc(39),p.ac(),p.ac(),p.bc(40,"li"),p.bc(41,"b"),p.Mc(42,"Estado: "),p.ac(),p.bc(43,"span"),p.Mc(44),p.ac(),p.ac(),p.bc(45,"li"),p.bc(46,"b"),p.Mc(47,"Tipo De Descuento: "),p.ac(),p.bc(48,"span"),p.Mc(49),p.ac(),p.ac(),p.bc(50,"li"),p.bc(51,"b"),p.Mc(52,"Valor Del Descuento: "),p.ac(),p.bc(53,"span"),p.Mc(54),p.ac(),p.ac(),p.bc(55,"li"),p.bc(56,"b"),p.Mc(57,"Fecha Registro Contrato: "),p.ac(),p.bc(58,"span"),p.Mc(59),p.ac(),p.ac(),p.bc(60,"li"),p.bc(61,"b"),p.Mc(62,"Fecha Inicio Contrato: "),p.ac(),p.bc(63,"span"),p.Mc(64),p.ac(),p.ac(),p.bc(65,"li"),p.bc(66,"b"),p.Mc(67,"Fecha Fin Contrato: "),p.ac(),p.bc(68,"span"),p.Mc(69),p.ac(),p.ac(),p.bc(70,"li"),p.bc(71,"mat-label"),p.bc(72,"b"),p.Mc(73,"Observaciones Del Contrato:"),p.ac(),p.ac(),p.Wb(74,"br"),p.Wb(75,"textarea",8),p.ac(),p.ac(),p.ac(),p.ac(),p.ac(),p.bc(76,"div",9),p.bc(77,"button",10),p.ic("click",(function(){return c.onNoClick()})),p.Mc(78,"Cancelar"),p.ac(),p.ac(),p.ac()),2&t&&(p.Jb(14),p.Nc(c.data.code),p.Jb(5),p.Nc(c.data.name),p.Jb(5),p.Nc(c.data.client.name),p.Jb(5),p.Nc(c.data.dealer.name),p.Jb(5),p.Nc(c.data.duration),p.Jb(5),p.Nc(c.data.amountVehicles),p.Jb(5),p.Nc(c.data.contractState.name),p.Jb(5),p.Nc(c.data.discountType.name),p.Jb(5),p.Nc(c.data.discountValue),p.Jb(5),p.Nc(c.data.registrationDate),p.Jb(5),p.Nc(c.data.startingDate),p.Jb(5),p.Nc(c.data.endingDate),p.Jb(6),p.uc("disabled",!0)("value",c.data.observation))},directives:[d.i,u.g,d.f,f.f,d.c,g.a,d.d],styles:[".content[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;flex-direction:column}.content[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%]{height:100%;font-weight:700}.content[_ngcontent-%COMP%]   .content-data[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;flex-direction:row;justify-content:space-between}.content[_ngcontent-%COMP%]   .content-data[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]{margin-left:20px;margin-bottom:20px}.content[_ngcontent-%COMP%]   .content-data[_ngcontent-%COMP%]   .img[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{padding:5px;box-shadow:0 2px 5px -1px rgba(50,50,93,.25),0 1px 3px -1px rgba(0,0,0,.3);border-radius:20px;width:400px}"]}),i),v=e("AytR"),h=e("tk/3"),C=((o=function(){function c(a){t(this,c),this.http=a,this.URL_API=v.a.apiUrl+"Contract/",this.URL_API_USER=v.a.apiUrl+"/Users/"}return a(c,[{key:"GetUserWithDealer",value:function(t){return this.http.get("".concat(this.URL_API_USER,"/GetUserByDealer?usr_id=").concat(t))}},{key:"updateStateContract",value:function(t,c){return this.http.post(this.URL_API+"/ChangeStateContract",{contract_id:t,state:c})}}]),c}()).\u0275fac=function(t){return new(t||o)(p.fc(h.a))},o.\u0275prov=p.Rb({token:o,factory:o.\u0275fac,providedIn:"root"}),o),M=e("2jix"),y=e("3LUQ"),_=e("f0Cb"),k=e("bv9b");function P(t,c){if(1&t){var a=p.cc();p.bc(0,"mat-card",4),p.bc(1,"mat-card-header"),p.bc(2,"div",5),p.ic("click",(function(){p.Dc(a);var t=c.$implicit;return p.mc().openDialog(t.id)})),p.ac(),p.bc(3,"mat-card-title"),p.Mc(4),p.ac(),p.bc(5,"mat-card-subtitle"),p.Mc(6),p.ac(),p.ac(),p.Wb(7,"mat-divider",1),p.Wb(8,"br"),p.bc(9,"mat-card-content"),p.bc(10,"ul"),p.bc(11,"li"),p.bc(12,"b"),p.Mc(13,"Cliente: "),p.ac(),p.bc(14,"span"),p.Mc(15),p.ac(),p.ac(),p.bc(16,"li"),p.bc(17,"b"),p.Mc(18,"Concesionario: "),p.ac(),p.bc(19,"span"),p.Mc(20),p.ac(),p.ac(),p.ac(),p.ac(),p.bc(21,"mat-card-actions",6),p.bc(22,"button",7),p.ic("click",(function(){p.Dc(a);var t=c.$implicit;return p.mc().approveContract(t.id)})),p.Mc(23,"Aceptar"),p.ac(),p.bc(24,"button",8),p.ic("click",(function(){p.Dc(a);var t=c.$implicit;return p.mc().declineContract(t.id)})),p.Mc(25,"Cancelar"),p.ac(),p.ac(),p.bc(26,"mat-card-footer"),p.Wb(27,"mat-progress-bar",9),p.ac(),p.ac()}if(2&t){var n=c.$implicit;p.Jb(4),p.Nc(n.code),p.Jb(2),p.Nc(n.name),p.Jb(9),p.Nc(n.client.name),p.Jb(5),p.Nc(n.dealer.name)}}var x,O,w,D=[{path:"",component:b.a,children:[{path:"",component:(x=function(){function c(a,n,e,i){t(this,c),this.dialog=a,this.approvalContractService=n,this.contractService=e,this.alertService=i,this.contractsToApprove=[],this.contractDialog=null}return a(c,[{key:"openDialog",value:function(t){this.contractDialog=this.contractsToApprove.find((function(c){return c.id==t})),this.dialog.open(m,{disableClose:!0,data:this.contractDialog})}},{key:"ngOnInit",value:function(){this.initdata()}},{key:"initdata",value:function(){this.setCompany(),this.setDealerid()}},{key:"setDealerid",value:function(){var t=this;this.approvalContractService.GetUserWithDealer(this.company.usr_id).subscribe((function(c){console.log(),3==(null==c?void 0:c.id_group)&&null!=(null==c?void 0:c.dealerid)&&(t.dealerID=null==c?void 0:c.dealerid,t.getContractsToList())}))}},{key:"getContractsToList",value:function(){var t=this;this.contractService.getContractPending(this.dealerID).subscribe((function(c){t.contractsToApprove=c}))}},{key:"setCompany",value:function(){this.company=l.a.validateUserAndCompany()}},{key:"approveContract",value:function(t){var c=this;this.alertService.confirm("\xbfEst\xe1 seguro de aprobar el contrato?",(function(){c.approvalContractService.updateStateContract(t,!0).subscribe((function(t){console.log(t),c.getContractsToList()}))}))}},{key:"declineContract",value:function(t){var c=this;this.alertService.confirm("\xbfEst\xe1 seguro de Cancelar el contrato?",(function(){c.approvalContractService.updateStateContract(t,!1).subscribe((function(t){console.log(t),c.getContractsToList()}))}))}}]),c}(),x.\u0275fac=function(t){return new(t||x)(p.Vb(d.b),p.Vb(C),p.Vb(M.a),p.Vb(y.a))},x.\u0275cmp=p.Pb({type:x,selectors:[["app-approvalcontract"]],decls:6,vars:1,consts:[["id","container__content"],["inset",""],[1,"cards"],["class","contract-card",4,"ngFor","ngForOf"],[1,"contract-card"],["mat-card-avatar","",1,"infobtn",3,"click"],["align","center"],["mat-raised-button","","color","primary",3,"click"],["mat-raised-button","","color","warn",3,"click"],["mode","indeterminate","color","primary"]],template:function(t,c){1&t&&(p.bc(0,"div",0),p.bc(1,"h1"),p.Mc(2,"APROBACION DE CONTRATOS"),p.ac(),p.Wb(3,"mat-divider",1),p.bc(4,"div",2),p.Lc(5,P,28,4,"mat-card",3),p.ac(),p.ac()),2&t&&(p.Jb(5),p.uc("ngForOf",c.contractsToApprove))},directives:[_.a,r.n,u.a,u.f,u.c,u.j,u.i,u.d,u.b,g.a,u.e,k.a],styles:["#container__content[_ngcontent-%COMP%]{transition:margin-left 1s;padding:20px;margin-left:250px}#container__content[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{text-align:center}.cards[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr))}.contract-card[_ngcontent-%COMP%]{max-width:250px;margin-top:10px}.infobtn[_ngcontent-%COMP%]{background-image:url(info.344998574b2e0b46ef3b.svg);background-size:cover}li[_ngcontent-%COMP%]{list-style:none}"]}),x)}]}],N=((w=function c(){t(this,c)}).\u0275mod=p.Tb({type:w}),w.\u0275inj=p.Sb({factory:function(t){return new(t||w)},imports:[[s.f.forChild(D)],s.f]}),w),J=((O=function c(){t(this,c)}).\u0275mod=p.Tb({type:O}),O.\u0275inj=p.Sb({factory:function(t){return new(t||O)},imports:[[r.c,u.h,g.b,N,k.b,d.g,_.b,f.e]]}),O)}}])}();