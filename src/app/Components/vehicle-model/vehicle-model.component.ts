import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Brand } from 'src/app/Models/Brand';
import { VehicleModel } from 'src/app/Models/VehicleModel';
import { VehicleType } from 'src/app/Models/VehicleType';
import { VehicleService } from '../../Services/vehicle.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Vehicle } from 'src/app/Models/Vehicle';
@Component({
  selector: 'app-vehicle-model',
  templateUrl: './vehicle-model.component.html',
  styleUrls: ['./vehicle-model.component.scss']
})
export class VehicleModelComponent implements OnInit, OnChanges { 
  lsVehicleModel: VehicleModel[];
  oBrand: Brand;
  oVehicleType: VehicleType;
  frmVehicleModel: FormGroup;
  vehicleModelToUpdate: VehicleModel;
  vehicleToUpdate: Vehicle;
  @Input() countChanges: number;
  @Output() vehicleModelWasSetted = new EventEmitter<boolean>();

  constructor(
    private vehicleService: VehicleService
  ) {

    this.frmVehicleModel = new FormGroup({
      cmbVehicleModel: new FormControl('Seleccione ...'),
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    for (let change in changes) {
      //console.log("[componente vehicle Model]: ", change);
      if (change == "countChanges") {              
        this.oBrand = this.vehicleService.getBrandSelected();
        this.oVehicleType = this.vehicleService.getVehicleTypeSelected();
        this.filterVehicleModels( this.oBrand, this.oVehicleType);      
        this.vehicleModelToUpdate = this.vehicleService.getVehicleModelSelected();       
        if (this.vehicleModelToUpdate != null) {         
          this.setDataInFields(this.vehicleModelToUpdate);
        } else {
          this.clearDataFields();
        }        
      }
    }
  }

  ngOnInit(): void {
    this.initComponents();
  }

  initComponents() {  
    this.countChanges = 0;
    this.clearDataFields();
    this.getDataToLists( 0, 0);   
  }

  async getDataToLists(brandId:number,typeId:number) {
    try {
      this.lsVehicleModel = await this.vehicleService.getVehicleModelByBrandAndType(brandId,typeId);
    } catch (error) {
      console.error(error);
    }
    
  }

  filterVehicleModels(pBrand: Brand, pVehicleType:VehicleType){
    let idBrand = (pBrand !== null && pBrand !== undefined)? pBrand.id: 0;
    let idType = (pVehicleType !== null && pVehicleType !== undefined)?pVehicleType.id: 0;
    this.getDataToLists(idBrand,idType);
  }
 
  setVehicleModel(event: any) {
    let vehicleModel = this.lsVehicleModel.find(vm => vm.id == event.value);
    console.log(vehicleModel);

    if(vehicleModel != null){
      this.vehicleService.setVehicleModelSelected(vehicleModel);
      this.vehicleModelWasSetted.emit(true);
    }else{
      this.vehicleService.setVehicleModelSelected(null);
    }   
  }

  async setDataInFields(pVehicleModel: VehicleModel) {
     let { cmbVehicleModel } = this.frmVehicleModel.controls;    
     cmbVehicleModel.setValue(pVehicleModel.id);
     this.vehicleModelWasSetted.emit(true);
  }

  clearDataFields() {  
    this.frmVehicleModel.controls.cmbVehicleModel.setValue(0);
  }


}
