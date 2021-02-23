import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/Services/admin.service';

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

  // opciones select 
  opcionesSeleccionadas: any[] = [];
  opcionesSeleccionadasProf: any[] = [];
  opcionesSeleccionadasProfile: any[] = [];

  ngOnChanges(){   
    if (Object.entries(this.UserToUpdate).length != 0) {
      this.opcionesSeleccionadas = [] ;
      this.opcionesSeleccionadasProf = [] ;
      this.opcionesSeleccionadasProfile = [] ;

      this.user = this.UserToUpdate;      
      console.log(this.UserToUpdate);
      console.log(this.user);

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
        flag = true ;
      }
     
    }else{
      alert("Seleccione un tipo de perfil");
      
    }

    if (flag) {
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
    debugger;
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

    if (flag) {
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
    this.userWasCanceled.emit('User');
  }

  loadgroup(){
    if (this.opcionesSeleccionadas.length > 0) {
      this.user.group = this.opcionesSeleccionadas[0].id_group ;
    }else{
      this.user.group = 0 ;
    }
  }

  loadProfile(){
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
    }
    
  }

}
 