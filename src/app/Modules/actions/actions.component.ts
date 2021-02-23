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
  @Output() actionWasSetted = new EventEmitter<any>();
  @Output() actionWasCanceled = new EventEmitter<string>();
  
  isAwaiting:boolean;
  actualizar:boolean = false;

  action = new Action();

  ngOnChanges(){   
    if (Object.entries(this.actionToUpdate).length != 0) {
      this.action = this.actionToUpdate;
      this.actualizar = true;
    }    
  }


  constructor(private router: Router, private adminService: AdminService) {     
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
    this.actionWasCanceled.emit('Action');
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
