import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { VehicleService } from '../../Services/Vehicle/vehicle.service';
import { FormGroup, FormControl } from '@angular/forms';
import { VehicleState } from 'src/app/Models/VehicleState';
import { Vehicle } from 'src/app/Models/Vehicle';

@Component({
  selector: 'app-vehicle-state',
  templateUrl: './vehicle-state.component.html',
  styleUrls: ['./vehicle-state.component.scss']
})
export class VehicleStateComponent implements OnInit , OnChanges{
  lsStates: VehicleState[];
  frmVehicleState: FormGroup;
  vehicleToUpdate: Vehicle;
  stateSelected: VehicleState;

  @Input() countChanges: number;
  constructor(
    private vehicleService: VehicleService
  ) {
    this.frmVehicleState = new FormGroup({
      cmbState : new FormControl('Seleccione ...')
    });
   }

   ngOnChanges(changes: SimpleChanges): void {
    for (const change in changes) {
      if (change == 'countChanges') {
        this.stateSelected = this.vehicleService.getVehicleStateSelected();
        if (this.stateSelected != null) {
          this.setDataInFields(this.stateSelected);
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

  setState(event: any){
    const vehicleState = this.lsStates.find(st => st.id == event.value);
    this.vehicleService.setVehicleStateSelected(vehicleState);
  }

  async setDataInFields(vehicleState: VehicleState){
    this.vehicleService.getVehicleStates()
    .then( data => {
      this.lsStates = data;
      setTimeout(() => {
        this.frmVehicleState.controls.cmbState.setValue(vehicleState.id);
      }, 500);
    });
  }

  clearDataFields(){
    this.frmVehicleState.controls.cmbState.setValue(0);
  }

}
