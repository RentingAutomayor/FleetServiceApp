import { Component, OnInit,OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { from } from 'rxjs';
import { Brand } from 'src/app/Models/Brand';
import { VehicleService } from '../../Modules/client/Services/Vehicle/vehicle.service';

@Component({
  selector: 'app-vehicle-brand',
  templateUrl: './vehicle-brand.component.html',
  styleUrls: ['./vehicle-brand.component.scss']
})
export class VehicleBrandComponent implements OnInit, OnChanges {
  frmBrand : FormGroup;
  lsBrand: Brand[];
  oBrand: Brand;
  @Input() countChanges:number;
  @Output() vehicleBrandWasSetted = new EventEmitter<boolean>();
  @Input() defaultBrandId: number = 0

  constructor(
    private vehicleService: VehicleService
  ) {
    this.frmBrand = new FormGroup({
      cmbBrand: new FormControl('Seleccione ...')
    });
   }

  ngOnChanges(changes: SimpleChanges): void {
    for (let change in changes) {

      if (change == "countChanges") {
        this.oBrand = this.vehicleService.getBrandSelected();
        if (this.oBrand != null) {
          this.setDataInForm(this.oBrand);
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
    try{
      this.countChanges = 0;
      if(this.defaultBrandId !== 0){
        this.frmBrand.controls.cmbBrand.setValue(this.defaultBrandId);
      }else{
        this.frmBrand.controls.cmbBrand.setValue(0);
      }

      this.lsBrand = await this.vehicleService.getBrands();
    }catch(error){
      console.error(error.Message);
    }
  }

  setBrand(event:any){
    let oBrand = this.lsBrand.find(br => br.id == event.value);
    this.vehicleService.setBrandSelected(oBrand);
    this.vehicleBrandWasSetted.emit(true);
  }

  setDataInForm(pBrand: Brand){
    this.frmBrand.controls.cmbBrand.setValue(pBrand.id);
  }

  clearDataForm(){
    const defaultValue = (this.defaultBrandId!==0)?this.defaultBrandId:0
    this.frmBrand.controls.cmbBrand.setValue(defaultValue);
    if(defaultValue!==0){
      let oBrand = this.lsBrand.find(br => br.id == defaultValue);
      this.vehicleService.setBrandSelected(oBrand);
      this.vehicleBrandWasSetted.emit(true);
    }
  }
}
