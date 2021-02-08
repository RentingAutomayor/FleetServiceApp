import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Action } from 'src/app/Models/Action';
import { AdminService } from 'src/app/Services/admin.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  @Input() returnPath: string;
  @Input() actions: any[] ;
  lsModules: any[];
  lsActionsSlected: any[] = []  ;
  isAwaiting:boolean;

  @Output() groupWasSetted = new EventEmitter<any>();
  @Output() groupWasCanceled = new EventEmitter<string>();
  
  formgGroup: FormGroup;

  // 

  // guarda la configuracion del select
  dropdownSettings = {};

  // opciones select 
  opcionesSeleccionadas: number[] = [];

  // modulo seleccionado
  modulosSeleccionado: string = "0";

  constructor(private router: Router, private adminService: AdminService) {          
    this.formgGroup = new FormGroup({
      txtName: new FormControl(''),
      txtDescription: new FormControl('')
    });    

    this.dropdownSettings = { 
      singleSelection: false, 
      idField: 'act_id',
      textField: 'act_name',
      selectAllText:'Seleccionar Todos',
      unSelectAllText:'Desmarcar Todos',
      enableSearchFilter: true,
      classes:"myclass custom-class"
    };  
  }

  ngOnInit(): void {
    this.initComponents();    
  }

  async initComponents(){    
    try{       
      this.lsModules = await this.adminService.getModules();
    }catch(err){
      console.error(err.error.Message);
      alert(err.error.Message);
    }
  }

  addModule(file: any){
    if (file.value == "0") {
      alert("debe seleccionar un modulo.")
    }else{
      if (this.opcionesSeleccionadas.length == 0) {
        alert("debe asociar minimo 1 accion.")
      }else{        
        this.lsActionsSlected.push({
          id_module : file.value,          
          name_module : this.lsModules.find(m => m.id_module == file.value).moduleName,
          actions: this.opcionesSeleccionadas
        });

        this.opcionesSeleccionadas = [] ;
        this.modulosSeleccionado = "0";
      }
    }
  }

  deleteModule(item:any){  
    console.log(item);
    this.lsActionsSlected.splice(item,1);
  }

  setDataGroup() {
    
    this.isAwaiting = true;
    // let objAction = new Action();
    let objGroup: any = {};

    objGroup.name = this.formgGroup.controls.txtName.value;
    objGroup.description = this.formgGroup.controls.txtDescription.value;
    objGroup.moduleAction = this.lsActionsSlected;

    // if(this.personToUpdate != null){
    //   objPerson.id = this.personToUpdate.id;
    //   console.warn("Detecta información de cliente para actualizar");
    // }

    this.adminService.insertGroup(objGroup).then( data => {
      let serviceResponse: any = {
        state : data.response,
        message : data.message
      }
      this.isAwaiting = false;
      this.groupWasSetted.emit(serviceResponse);        
    }).catch( err => {
      let serviceResponse: any = {
        state : false,
        message : err.error.Message
      }

      this.isAwaiting = false;
      this.groupWasSetted.emit(serviceResponse);  
    });
  }

  comeBack() {
    if (this.returnPath != null) {
      console.log("[retorno]:", this.returnPath);
      this.router.navigate([this.returnPath]);
    }
    this.groupWasCanceled.emit('Group');
  }

}
