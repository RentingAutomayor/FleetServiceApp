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
  @Output() actionWasSetted = new EventEmitter<any>();
  @Output() actionWasCanceled = new EventEmitter<string>();
  formAction: FormGroup;
  isAwaiting:boolean;

  constructor(private router: Router, private adminService: AdminService) { 
    this.formAction = new FormGroup({
      txtName: new FormControl(''),
      txtDescription: new FormControl('')
    });
  }

  ngOnInit(): void {
  }

  
  setDataAction() {

    this.isAwaiting = true;

    let objAction = new Action();

    // if(this.personToUpdate != null){
    //   objPerson.id = this.personToUpdate.id;
    //   console.warn("Detecta información de cliente para actualizar");
    // }

    objAction.act_name = this.formAction.controls.txtName.value;
    objAction.act_description = this.formAction.controls.txtDescription.value;
    
    
    this.adminService.insertAction(objAction).then( data => {
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
  }

  comeBack() {
    if (this.returnPath != null) {
      console.log("[retorno]:", this.returnPath);
      this.router.navigate([this.returnPath]);
    }
    this.actionWasCanceled.emit('Action');
  }

}
