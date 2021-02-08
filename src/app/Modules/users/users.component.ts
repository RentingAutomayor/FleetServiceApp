import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

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
  @Output() userWasCanceled = new EventEmitter<string>();

  // profiles
  lsProfiles: any[] = [ 'Admin', 'Cliente', 'Compañia', 'Dealer' ];
  
  // guardamos la lista de las opciones seguns ea el perfil
  lsProfileCDC: any[] = [] ;

  // guarda la configuracion del select
  dropdownSettings = {};
  dropdownSettingsProf = {};
  dropdownSettingsProfile = {};

  // formulario de envio
  formUser: FormGroup;

  // opciones select 
  opcionesSeleccionadas: any[] = [];
  opcionesSeleccionadasProf: any[] = [];
  opcionesSeleccionadasProfile: any[] = [];
  
  constructor(private router: Router) { 
    
    this.loadSettingsDrop();

    this.formUser = new FormGroup({
      txtNames: new FormControl(''),
      txtLastNames: new FormControl(''),
      txtUser: new FormControl(''),
      txtPass: new FormControl(''),
      txtEmail: new FormControl('')      
    });   


    
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

    // let objAction = new Action();
    let objUser: any;

    // if(this.personToUpdate != null){
    //   objPerson.id = this.personToUpdate.id;
    //   console.warn("Detecta información de cliente para actualizar");
    // }

    objUser.grp_names = this.formUser.controls.txtNames.value;
    objUser.grp_last_names = this.formUser.controls.txtLastNames.value;
    objUser.grp_user = this.formUser.controls.txtUser.value;
    objUser.grp_pass = this.formUser.controls.txtPass.value;
    objUser.grp_email = this.formUser.controls.txtEmail.value;
    // objUser.grp_group = this.formUser.controls.txtGroup.value;
    // objUser.grp_profile = this.formUser.controls.txtProfile.value;

    console.log(objUser);

    //this.personService.setPerson(objPerson);
    //this.personWasSetted.emit(true);
  }

  comeBack() {
    if (this.returnPath != null) {
      console.log("[retorno]:", this.returnPath);
      this.router.navigate([this.returnPath]);
    }
    this.userWasCanceled.emit('User');
  }

  loadProfile(){
    if (this.opcionesSeleccionadasProfile.length > 0) {
      switch (this.opcionesSeleccionadasProfile[0]) {
        case 'admin':          
          break;      
        case 'Cliente':   
          this.lsProfileCDC = this.lsClient ;
          break;      
        case 'Compañia':          
          this.lsProfileCDC = this.lsComp ;
          break;     
        case 'Dealer':          
        this.lsProfileCDC = this.lsDealer ;
          break;      
        default:
          break;
      }
      console.log(this.opcionesSeleccionadasProfile[0]);  
    }
    
  }

}
 