import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  @Input() returnPath: string;
  @Output() groupWasCanceled = new EventEmitter<string>();
  formGroup: FormGroup;

  constructor(private router: Router) { 
    this.formGroup = new FormGroup({
      txtName: new FormControl(''),
      txtDescription: new FormControl('')
    });
  }

  ngOnInit(): void {
  }

  setDataGroup() {

    // let objAction = new Action();
    let objGroup: any;

    // if(this.personToUpdate != null){
    //   objPerson.id = this.personToUpdate.id;
    //   console.warn("Detecta información de cliente para actualizar");
    // }

    objGroup.grp_name = this.formGroup.controls.txtName.value;
    objGroup.grp_description = this.formGroup.controls.txtDescription.value;

    console.log(objGroup);

    //this.personService.setPerson(objPerson);
    //this.personWasSetted.emit(true);
  }

  comeBack() {
    if (this.returnPath != null) {
      console.log("[retorno]:", this.returnPath);
      this.router.navigate([this.returnPath]);
    }
    this.groupWasCanceled.emit('Group');
  }

}
