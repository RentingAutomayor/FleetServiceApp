import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { VehicleService } from '../../Services/vehicle.service';
import { FormGroup, FormControl } from '@angular/forms';
import { VehicleState } from 'src/app/Models/VehicleState';
import { Vehicle } from 'src/app/Models/Vehicle';

@Component({
  selector: 'app-vehicle-state',
  templateUrl: './vehicle-state.component.html',
  styleUrls: ['./vehicle-state.component.scss']
})
export class VehicleStateComponent implements OnInit ,OnChanges{
  lsStates: VehicleState[];
  frmVehicleState: FormGroup;
  vehicleToUpdate:Vehicle;
  @Input() countChanges: number;
  constructor(
    private vehicleService:VehicleService
  ) {
    this.frmVehicleState = new FormGroup({
      cmbState : new FormControl('Seleccione ...')
    });
   }

   ngOnChanges(changes: SimpleChanges): void {
    for (let change in changes) {
      //console.log("[componente vehicle Model]: ", change);
      if (change == "countChanges") {
        this.vehicleToUpdate = this.vehicleService.getVehicleToUpdate();
        if (this.vehicleToUpdate != null) {         
          this.setDataInFields();
        } else {
          this.clearDataFields();
        }
      }
    }
  }

  ngOnInit(): void {
    this.initComponent();
  }

  async initComponent(){
    this.lsStates = await this.vehicleService.getVehicleStates();
  }

  setState(event:any){
    let vehicleState = this.lsStates.find(st => st.id == event.value);
    this.vehicleService.setVehicleStateSelected(vehicleState);
  }

  async setDataInFields(){
    this.lsStates = await this.vehicleService.getVehicleStates();
    this.frmVehicleState.controls.cmbState.setValue(this.vehicleToUpdate.vehicleState.id);
  }

  clearDataFields(){
    this.frmVehicleState.controls.cmbState.setValue(0);
  }

}
