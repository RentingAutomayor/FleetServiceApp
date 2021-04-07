import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Action } from 'src/app/Models/Action';
import { AdminService } from '../../Services/admin.service';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {
  @Input() returnPath: string;
  @Input() actionToUpdate: Action;
  @Input() actionToCreate: Action;
  @Input() actionToView: Action;
  @Output() actionWasSetted = new EventEmitter<any>();
  @Output() actionWasCanceled = new EventEmitter<string>();
  
  isAwaiting:boolean;
  actualizar:boolean = false;
  mostrar:boolean = false;

  action = new Action();

  ngOnChanges(){   
    this.actualizar = false;
    this.mostrar = false;
    
    if (this.actionToCreate != undefined) {
      this.actualizar = false;
      this.mostrar = false;
    }   

    if (Object.entries(this.actionToUpdate).length != 0) {
      this.action = this.actionToUpdate;
      this.actualizar = true;
    }  
    
    if (Object.entries(this.actionToView).length != 0) {
      this.action = this.actionToView;
      this.mostrar = true;
    } 
  }


  constructor(private router: Router, private adminService: AdminService) {     
    this.actualizar = false;
    this.mostrar = false;
  }

  ngOnInit(): void {
  }

  
  setDataAction() {

    this.isAwaiting = true;    
        
    this.adminService.insertAction(this.action).then( data => {
      let serviceResponse: any = {
        state : data.response,
        message : data.message
      }
      this.isAwaiting = false;
      this.actionWasSetted.emit(serviceResponse);        
    }).catch( err => {
      let serviceResponse: any = {
        state : false,
        message : err.error.Message
      }

      this.isAwaiting = false;
      this.actionWasSetted.emit(serviceResponse);  
    });

    this.comeBack();
  }

  updateDataAction() {

    this.isAwaiting = true;    
        
    this.adminService.updateAction(this.action).then( data => {
      let serviceResponse: any = {
        state : data.response,
        message : data.message
      }
      this.isAwaiting = false;
      this.actionWasSetted.emit(serviceResponse);        
    }).catch( err => {
      let serviceResponse: any = {
        state : false,
        message : err.error.Message
      }

      this.isAwaiting = false;
      this.actionWasSetted.emit(serviceResponse);  
    });

    this.comeBack();
  }

  refresAction(){
    this.actualizar = false;
    this.action = new Action();
  }

  comeBack() {    
    if (this.returnPath != null) {
      console.log("[retorno]:", this.returnPath);
      this.router.navigate([this.returnPath]);
    }
    this.refresAction();
    this.actionWasCanceled.emit('actions');
  }

  // actualizar el usuario a modificar
  updateFile(file: any){ 
    switch (file.id) {
        case "act_name":
            this.action.act_name = file.value;
            break;    
        case "act_description":
            this.action.act_description = file.value;
            break; 
        default:            
            break;
    }
  }

}
