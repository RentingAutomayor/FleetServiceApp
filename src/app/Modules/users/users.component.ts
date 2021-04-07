import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/Services/admin.service';
import { values } from 'lodash';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  @Input() returnPath: string;
  @Input() lsGroups: any[];
  @Input() lsClient: any[];
  @Input() lsDealer: any[];
  @Input() lsComp: any[];
  @Input() UserToUpdate: {};
  @Input() userToView: {};
  @Input() userToCreate: {};

  @Output() userWasSetted = new EventEmitter<any>();
  @Output() userWasCanceled = new EventEmitter<string>();

  isAwaiting:boolean;

  // profiles
  lsProfiles: any[] = [ 'Admin', 'Cliente', 'Compañia', 'Dealer' ];
  
  // guardamos la lista de las opciones seguns ea el perfil
  lsProfileCDC: any[] = [] ;
 
  // habilita el combo de los tipos de perfiles
  profileSelected = false;

  // guarda la configuracion del select
  dropdownSettings = {};
  dropdownSettingsProf = {};
  dropdownSettingsProfile = {};

  // setObject
  user: any = {} ;
  actualizar:boolean = false;
  mostrar:boolean = false;

  // text profile
  tipoPerfil: string = '';

  // opciones select 
  opcionesSeleccionadas: any[] = [];
  opcionesSeleccionadasProf: any[] = [];
  opcionesSeleccionadasProfile: any[] = [];

  ngOnChanges(){   
    this.refresUser();

    if (this.userToCreate != undefined) {
      this.refresUser();
    }  

    if (Object.entries(this.userToView).length != 0) {      
      this.opcionesSeleccionadas = [] ;
      this.opcionesSeleccionadasProf = [] ;
      this.opcionesSeleccionadasProfile = [] ;

      this.user = this.userToView;  

      if (this.user.groupLoad != null) {        
        this.opcionesSeleccionadas.push(this.user.groupLoad);
        this.loadgroup();
      }

      let profile = this.user.profile.split('-');
      this.opcionesSeleccionadasProfile.push(profile[0]);

      if (profile.length > 1) {
        this.loadProfile();
        let pfroSlected = this.lsProfileCDC.find(prf => prf.id == profile[1]) ;
        this.opcionesSeleccionadasProf.push(pfroSlected);
      }

      this.mostrar = true;
    }    

    if (Object.entries(this.UserToUpdate).length != 0) {
      this.opcionesSeleccionadas = [] ;
      this.opcionesSeleccionadasProf = [] ;
      this.opcionesSeleccionadasProfile = [] ;

      this.user = this.UserToUpdate;  

      if (this.user.groupLoad != null) {        
        this.opcionesSeleccionadas.push(this.user.groupLoad);
        this.loadgroup();
      }

      let profile = this.user.profile.split('-');
      this.opcionesSeleccionadasProfile.push(profile[0]);

      if (profile.length > 1) {
        this.loadProfile();
        let pfroSlected = this.lsProfileCDC.find(prf => prf.id == profile[1]) ;
        this.opcionesSeleccionadasProf.push(pfroSlected);
      }

      this.actualizar = true;
    }    
  }
  
  constructor(private router: Router,private adminService: AdminService) {    
    this.refresUser();
    this.loadSettingsDrop();    
  }

  // actualizar el usuario a modificar
  updateFile(file: any){ 
    switch (file.id) {
        case "usr_names":
            this.user.usr_names = file.value;
            break;    
        case "usr_last_names":
            this.user.usr_last_names = file.value;
            break; 
        case "usr_user":
            this.user.usr_user = file.value;
            break;  
        case "usr_pass":
            this.user.usr_pass = file.value;
            break;  
        case "usr_pass_confirm":
            this.user.usr_pass_confirm = file.value;

            let passlen = file.value.length; 
            let passWord = this.user.usr_pass.substr(0,passlen);

            if(passWord != file.value){
              alert("las contraseñas no coinciden, validar")
              this.user.usr_pass = "";
              this.user.usr_pass_confirm = "";
            }
            break; 
        case "usr_email":
            this.user.usr_email = file.value;
            break;    
        default:            
            break;
    }
  }

  loadSettingsDrop(){
    this.dropdownSettings = { 
      singleSelection: true, 
      idField: 'id_group',
      textField: 'groupName',
      closeDropDownOnSelection: true,
      classes:"myclass custom-class"
    }; 

    this.dropdownSettingsProfile = { 
      singleSelection: true, 
      idField: 'idProfile',
      textField: 'nameProfile',
      closeDropDownOnSelection: true,
      classes:"myclass custom-class"
    }; 

    this.dropdownSettingsProf = { 
      singleSelection: true, 
      idField: 'id',
      textField: 'name',
      closeDropDownOnSelection: true,
      classes:"myclass custom-class"
    }; 
  }

  ngOnInit(): void {
  }

  setDataUser() {
    let flag = false;
    let passflag = false;

    if (this.opcionesSeleccionadas.length == 0) {
      alert("Asocie un grupo de permisos.")
    }else{
      if (this.opcionesSeleccionadasProfile.length > 0 ) {
        if (this.opcionesSeleccionadasProfile[0] != 'Admin' ) {
          if (this.opcionesSeleccionadasProf.length > 0) {
            switch (this.opcionesSeleccionadasProfile[0]) {
              case 'Cliente':
                this.user.cli_id = this.opcionesSeleccionadasProf[0].id;
                break;
              case 'Compañia':
                this.user.cpn_id = this.opcionesSeleccionadasProf[0].id;
                break;
              case 'Dealer':
                this.user.deal_id = this.opcionesSeleccionadasProf[0].id;
                break;
              default:
                break;
            };
  
            flag = true;
          }else{
            alert("Asocie un cliente, compañia o dealer a su perfil.")
          }            
        }else{
          flag = true ;
        }
       
      }else{
        alert("Seleccione un tipo de perfil");
        
      }
    }

    if (this.user.usr_pass == this.user.usr_pass_confirm) {
      passflag = true ;
    }else{
      alert("Las contraseñas no coinciden")
    }

    if (flag && passflag) {
      this.isAwaiting = true;

      this.adminService.insertUser(this.user).then( data => {
        let serviceResponse: any = {
          state : data.response,
          message : data.message
        }
        this.isAwaiting = false;
        this.userWasSetted.emit(serviceResponse);        
      }).catch( err => {
        let serviceResponse: any = {
          state : false,
          message : err.error.Message
        }
  
        this.isAwaiting = false;
        this.userWasSetted.emit(serviceResponse);  
      });    
    
      this.comeBack();
      
    }

    
  }

  updateDataUser() {
    let flag = false;
    let passflag = false;

    if (this.opcionesSeleccionadasProfile.length > 0 ) {
      if (this.opcionesSeleccionadasProfile[0] != 'Admin' ) {
        if (this.opcionesSeleccionadasProf.length > 0) {
          switch (this.opcionesSeleccionadasProfile[0]) {
            case 'Cliente':
              this.user.cli_id = this.opcionesSeleccionadasProf[0].id;
              break;
            case 'Compañia':
              this.user.cpn_id = this.opcionesSeleccionadasProf[0].id;
              break;
            case 'Dealer':
              this.user.deal_id = this.opcionesSeleccionadasProf[0].id;
              break;
            default:
              break;
          };

          flag = true;
        }else{
          alert("Asocie un cliente, compañia o deales a su perfil.")
        }            
      }else{
        flag = true;
      }
     
    }else{
      alert("Seleccione un tipo de perfil");      
    }

    if (this.user.usr_pass == this.user.usr_pass_confirm) {
      passflag = true ;
    }else{
      alert("Las contraseñas no coinciden")
    }

    if (flag && passflag) {
      this.isAwaiting = true;

      this.adminService.updateUser(this.user).then( data => {
        let serviceResponse: any = {
          state : data.response,
          message : data.message
        }
        this.isAwaiting = false;
        this.userWasSetted.emit(serviceResponse);        
      }).catch( err => {
        let serviceResponse: any = {
          state : false,
          message : err.error.Message
        }
  
        this.isAwaiting = false;
        this.userWasSetted.emit(serviceResponse);  
      });    
      
      this.comeBack();
    }
  }

  refresUser(){
    this.actualizar = false;    
    this.mostrar = false;
    this.profileSelected = false;
    this.user = {};
    this.opcionesSeleccionadas = [] ;
    this.opcionesSeleccionadasProf = [];
    this.opcionesSeleccionadasProfile = [];
  }

  comeBack() {
    if (this.returnPath != null) {
      console.log("[retorno]:", this.returnPath);
      this.router.navigate([this.returnPath]);
    }
    this.refresUser();
    this.userWasCanceled.emit('users');
  }

  loadgroup(){
    if (this.opcionesSeleccionadas.length > 0) {
      this.user.group = this.opcionesSeleccionadas[0].id_group ;
    }else{
      this.user.group = 0 ;
    }
  }

  loadProfile(){
    this.tipoPerfil = '' ;
    this.user.cli_id = 0 ;
    this.user.deal_id = 0 ;
    this.user.cpn_id = 0 ;

    this.opcionesSeleccionadasProf = [];
    this.profileSelected = false ;
    if (this.opcionesSeleccionadasProfile.length > 0) {
      switch (this.opcionesSeleccionadasProfile[0]) {
        case 'Admin':       
          this.lsProfileCDC = this.lsClient ;
          this.profileSelected = false ;
          break;      
        case 'Cliente':   
          this.lsProfileCDC = this.lsClient ;
          this.profileSelected = true ;
          break;      
        case 'Compañia':       
          this.lsProfileCDC = this.lsComp ;
          this.profileSelected = true ;
          break;     
        case 'Dealer':      
          this.lsProfileCDC = this.lsDealer ;
          this.profileSelected = true ;
          break;      
        default:
          break;
      }

      this.tipoPerfil = this.opcionesSeleccionadasProfile[0] ;
    }
    
  }

}
 