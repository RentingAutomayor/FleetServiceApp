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
  @Output() userWasCanceled = new EventEmitter<string>();
  formUser: FormGroup;
  
  constructor(private router: Router) { 
    this.formUser = new FormGroup({
      txtName: new FormControl(''),
      txtDescription: new FormControl('')
    });
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

    objUser.grp_name = this.formUser.controls.txtName.value;
    objUser.grp_description = this.formUser.controls.txtDescription.value;

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

}
 