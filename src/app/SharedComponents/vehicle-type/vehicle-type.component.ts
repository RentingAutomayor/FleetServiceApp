import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { VehicleType } from 'src/app/Models/VehicleType';
import { VehicleService } from '../../Modules/client/Services/Vehicle/vehicle.service';

@Component({
  selector: 'app-vehicle-type',
  templateUrl: './vehicle-type.component.html',
  styleUrls: ['./vehicle-type.component.scss']
})
export class VehicleTypeComponent implements OnInit, OnChanges {
  lsVehicleType: VehicleType[];
  frmVehicleType: FormGroup;
  oType: VehicleType;
  @Input() countChanges: number;
  @Output() vehicleTypeWasSetted = new EventEmitter<boolean>();

  disableControls: boolean;
  @Input('disableControls')
  set setDisableControls(value: boolean){
    this.disableControls = value;
    if (this.disableControls){
      this.frmVehicleType.disable();
    }else{
      this.frmVehicleType.enable();
    }
  }


  constructor(
    private vehicleService: VehicleService
  ) {
    this.frmVehicleType = new FormGroup({
      cmbType: new FormControl('Seleccione ...')
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    for (const change in changes) {

      if (change == 'countChanges') {
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

  setType(event: any){
    const oType = this.lsVehicleType.find(tp => tp.id == event.value);
    this.vehicleService.setVehicleTypeSelected(oType);
    this.vehicleTypeWasSetted.emit(true);
  }

  setDataInForm(pType: VehicleType){
    this.frmVehicleType.controls.cmbType.setValue(pType.id);
  }

  clearDataForm(){
    this.frmVehicleType.controls.cmbType.setValue(0);
  }

}
