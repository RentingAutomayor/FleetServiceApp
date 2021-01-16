import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { Router } from '@angular/router';
import { Movement } from 'src/app/Models/Movement';
import { ResponseApi } from 'src/app/Models/ResponseApi';
import { MovementService } from '../../Services/Movement/movement.service';

@Component({
  selector: 'app-movement',
  templateUrl: './movement.component.html',
  styleUrls: ['./movement.component.scss']
})
export class MovementComponent implements OnInit, OnChanges {
  isAwaiting: boolean;
  frmMovement: FormGroup;
  movementToUpdate: Movement;
  isToUpdate: boolean;
  @Input() countChanges: number;

  constructor(
    private router: Router,
    private movementService: MovementService
  ) {
    this.frmMovement = new FormGroup({
      txtName: new FormControl(''),
      txtDescription: new FormControl('')
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (let change in changes) {
      if (change == "countChanges") {
        this.validateMovementToUpdate();
      }
    }
  }

  ngOnInit(): void {
    this.initComponents();
  }

  initComponents() {
    this.validateMovementToUpdate();
  }

  validateMovementToUpdate() {
    this.movementToUpdate = this.movementService.getMovementToUpdate();
    if (this.movementToUpdate != null && this.movementToUpdate != undefined) {
      this.isToUpdate = true;
      this.setDataInForm(this.movementToUpdate);
    } else {
      this.isToUpdate = false;
      this.clearDataInForm();
    }
  }

  comeBackTable() {
    this.router.navigate(['/MasterMovements']);
  }

  getDataForm(): Movement {

    let { txtName, txtDescription } = this.frmMovement.controls;
    let oMovement = new Movement();

    if (this.movementToUpdate != null && this.movementToUpdate != undefined) {
      oMovement.id = this.movementToUpdate.id;
    }

    oMovement.name = txtName.value;
    oMovement.name =  oMovement.name.toUpperCase();
    oMovement.description = txtDescription.value;
    oMovement.description = oMovement.description.toUpperCase();
    oMovement.type = this.movementService.getMovementTypeSelected();

    return oMovement;
  }

  setDataInForm(pMovement: Movement) {
    let { txtName, txtDescription } = this.frmMovement.controls;
    txtName.setValue(pMovement.name.toLocaleLowerCase());
    txtDescription.setValue(pMovement.description.toLocaleLowerCase());
    this.movementService.setMovementTypeSelected(pMovement.type);
    this.countChanges += 1;
  }

  clearDataInForm() {
    let { txtName, txtDescription } = this.frmMovement.controls;
    txtName.setValue('');
    txtDescription.setValue('');
    this.movementService.setMovementTypeSelected(null);
    this.countChanges += 1;
  }

  async saveMovement() {
    try {
      let oMovement = this.getDataForm();
      let rta = new ResponseApi();
      console.log(oMovement);

      this.isAwaiting = true;

      if (this.isToUpdate) {
        rta = await this.movementService.update(oMovement);
      } else {
        rta = await this.movementService.insert(oMovement);
      }

      this.isAwaiting = false;

      if (rta.response) {
        alert(rta.message);
        this.router.navigate(['/MasterMovements']);
      }
    } catch (error) {
      console.warn(error);
    }
  }

  openTab(oButton: any, container: string) {
    let tabLinks = document.getElementsByClassName("tab_link");

    for (let i = 0; i < tabLinks.length; i++) {
      tabLinks[i].classList.remove("active");
    }
    oButton.target.className += " active";
    let containerTabs = document.getElementsByClassName("tab_content");

    for (let i = 0; i < containerTabs.length; i++) {
      containerTabs[i].setAttribute("style", "display:none");
    }

    let containerToShow_id = `container__${container}`;
    let containerToShow = document.getElementById(containerToShow_id);

    ////console.log(containerToShow);

    containerToShow.setAttribute("style", "display:blick");
  }

  hideContainerTabs() {
    let containers = document.getElementsByClassName("tab_inactive");
    for (let i = 0; i < containers.length; i++) {
      containers[i].setAttribute("style", "display:none");
    }
  }

}
