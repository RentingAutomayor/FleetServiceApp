import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { element } from 'protractor';
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
  @Input() GroupToUpdate: {};
  @Input() groupToView: {};
  @Input() groupToCreate: {};
  lsModules: any[];
  lsActionsSlected: any[] = []  ;
  isAwaiting:boolean;

  @Output() groupWasSetted = new EventEmitter<any>();
  @Output() groupWasCanceled = new EventEmitter<string>();

  group: any = {} ;
  actualizar:boolean = false;
  mostrar:boolean = false;

  // 

  // guarda la configuracion del select
  dropdownSettings = {};

  // opciones select 
  opcionesSeleccionadas: number[] = [];

  // modulo seleccionado
  modulosSeleccionado: string = "0";

  ngOnChanges(){   
    this.actualizar = false;
    this.mostrar = false;
    
    if (this.groupToCreate != undefined) {
      this.actualizar = false;
      this.mostrar = false;
      this.lsActionsSlected = [] ;
    }  

    if (Object.entries(this.GroupToUpdate).length != 0) {
      this.lsActionsSlected = [] ;
      this.group = this.GroupToUpdate;
      this.group.modules.forEach(element => {
        let module = {
          id_module : element.id_module,          
          name_module : element.moduleName,
          actions: []
        }

        element.actions.forEach(act => {
          debugger; 
          if (act != undefined) {
            let action = {
              act_id: act.id_action,
              act_name: act.actionName
            } 
            module.actions.push(action);
          }    
        });

        this.lsActionsSlected.push(module);
      });        
      this.actualizar = true;
    }    

    if (Object.entries(this.groupToView).length != 0) {
      this.lsActionsSlected = [] ;
      this.group = this.groupToView;
      this.group.modules.forEach(element => {
        let module = {
          id_module : element.id_module,          
          name_module : element.moduleName,
          actions: []
        }

        element.actions.forEach(act => {
          debugger; 
          if (act != undefined) {
            let action = {
              act_id: act.id_action,
              act_name: act.actionName
            } 
            module.actions.push(action);
          }          
        });

        this.lsActionsSlected.push(module);
      });        
      this.mostrar = true;
    } 
  }

  constructor(private router: Router, private adminService: AdminService) {          
    
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
        debugger;
        if(this.lsActionsSlected.find(f => f.id_module == file.value)){

          let actions : any = {} ;
          actions = this.lsActionsSlected.find(f => f.id_module == file.value).actions ;

          this.opcionesSeleccionadas.forEach((elementI : any) => {
            debugger;
            let action: any = {};
            action = actions.find(e => e.act_id == elementI.act_id);
            if (action == null) {           
              this.lsActionsSlected.find(f => f.id_module == file.value).actions.push(elementI);
            }
            action = {} ;

          });


        }else{
          this.lsActionsSlected.push({
            id_module : file.value,          
            name_module : this.lsModules.find(m => m.id_module == file.value).moduleName,
            actions: this.opcionesSeleccionadas
          });
        }
        // if(this.opcionesSeleccionadas.find(a => parseInt(a.act_id) == parseInt(file.value)))
        //   {

        // }else{
        //   this.lsActionsSlected.push({
        //     id_module : file.value,          
        //     name_module : this.lsModules.find(m => m.id_module == file.value).moduleName,
        //     actions: this.opcionesSeleccionadas
        //   });
        // }   
        
        
        

        this.opcionesSeleccionadas = [] ;
        this.modulosSeleccionado = "0";
      }
    }
  }

  deleteModule(item:any){ 

    for( var i = 0; i < this.lsActionsSlected.length; i++){ 
                                   
      if ( this.lsActionsSlected[i].id_module === item.id_module) { 
        this.lsActionsSlected.splice(i, 1); 
          i--; 
      }
    }

    //this.lsActionsSlected.splice(item);
    console.log(this.lsActionsSlected);
  }

  setDataGroup() {

    let flagGroup = false;
    let flagModule = false;
    
    this.isAwaiting = true;
    
    if (this.lsActionsSlected.length == 0) {
      flagGroup = false;
      alert("Debe seleccionar minimo un modulo al grupo.");
    }else{
      flagModule = true;
    }

    if(this.group.groupName == undefined || this.group.groupName == ''){
      flagGroup = false;
      alert("El nombre es obligatorio.");
    }else{
      flagGroup = true;
    }
    
    if(flagGroup == true && flagModule == true)
    {
      this.group.moduleAction = this.lsActionsSlected;

      this.adminService.insertGroup(this.group).then( data => {
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

      this.comeBack();
    } 
  }

  updateDataGroup() {

    let flagGroupModule = false;
    let flagGroupName = false;
    
    this.isAwaiting = true;
    
    if (this.lsActionsSlected.length == 0) {
      flagGroupModule = false;
      alert("Debe seleccionar minimo un modulo al grupo.");
    }else{
      flagGroupModule = true;
    }

    if(this.group.groupName == undefined || this.group.groupName == ''){
      flagGroupName = false;
      alert("El nombre es obligatorio.");
    }else{
      flagGroupName = true;
    }
    
    if(flagGroupModule == true && flagGroupName == true)
    {
      this.group.moduleAction = this.lsActionsSlected;

      this.adminService.updateGroup(this.group).then( data => {
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

      this.comeBack();
    } 
  }

  refresGroup(){
    this.actualizar = false;
    this.group = {};
    this.lsActionsSlected = [];
  }

  comeBack() {
    if (this.returnPath != null) {
      debugger;
      console.log("[retorno]:", this.returnPath);
      this.router.navigate([this.returnPath]);
    }
    this.refresGroup();
    this.groupWasCanceled.emit('groups');
  }

   // actualizar el grupo a modificar
   updateFile(file: any){ 
    switch (file.id) {
        case "groupName":
            this.group.groupName = file.value;
            break;    
        case "description":
            this.group.description = file.value;
            break; 
        default:            
            break;
    }
  }

}
