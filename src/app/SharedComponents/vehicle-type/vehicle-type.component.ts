import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { VehicleType } from 'src/app/Models/VehicleType';
import { VehicleService } from '../../Modules/client/Services/Vehicle/vehicle.service';

@Component({
  selector: 'app-vehicle-type',
  templateUrl: './vehicle-type.component.html',
  styleUrls: ['./vehicle-type.component.scss']
})
export class VehicleTypeComponent implements OnInit,OnChanges {
  lsVehicleType: VehicleType[];
  frmVehicleType: FormGroup;
  oType: VehicleType;
  @Input() countChanges:number;
  @Output() vehicleTypeWasSetted = new EventEmitter<boolean>();

  constructor(
    private vehicleService: VehicleService
  ) { 
    this.frmVehicleType = new FormGroup({
      cmbType: new FormControl('Seleccione ...')
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    for (let change in changes) {
      //console.log("[componente vehicle Model]: ", change);
      if (change == "countChanges") {
       this.oType = this.vehicleService.getVehicleTypeSelected();
        if (this.oType != null) {         
          this.setDataInForm(this.oType);
        } else {
          this.clearDataForm();
        }
      }
    }
  }

  ngOnInit(): void {
    this.initComponents();
  }

  async initComponents(){
    try {
      this.countChanges = 0;
      this.frmVehicleType.controls.cmbType.setValue(0);   
      this.lsVehicleType = await this.vehicleService.getVehicleTypes();
    } catch (error) {
      console.error(error);
    }
      
  }

  setType(event:any){
    let oType = this.lsVehicleType.find(tp => tp.id == event.value);
    this.vehicleService.setVehicleTypeSelected(oType);
    this.vehicleTypeWasSetted.emit(true);
  }

  setDataInForm(pType:VehicleType){
    this.frmVehicleType.controls.cmbType.setValue(pType.id);
  }

  clearDataForm(){
    this.frmVehicleType.controls.cmbType.setValue(0);
  }

}
