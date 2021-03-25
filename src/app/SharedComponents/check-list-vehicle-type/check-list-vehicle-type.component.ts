import { createOfflineCompileUrlResolver } from '@angular/compiler';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { VehicleType } from 'src/app/Models/VehicleType';
import { VehicleService } from '../../Modules/client/Services/Vehicle/vehicle.service';

@Component({
  selector: 'app-check-list-vehicle-type',
  templateUrl: './check-list-vehicle-type.component.html',
  styleUrls: ['./check-list-vehicle-type.component.scss', '../../../assets/styles/checkbox.scss']
})
export class CheckListVehicleTypeComponent implements OnInit,OnChanges {
  lsVehicleTypeSelected: VehicleType[] = [];
  lsVehicleTypes: VehicleType[];
  @Input() countChanges:number;
  @Input() disableChecks: boolean;
  @Output() vehicleTypeWasSelected = new EventEmitter<boolean>();

  constructor(
    private vehicleService: VehicleService
  ) {
    this.disableChecks = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (let change in changes) {
      if (change == "countChanges") {  
        this.lsVehicleTypeSelected = this.vehicleService.getListVehicleTypeSelected();
        if(this.lsVehicleTypeSelected != null && this.lsVehicleTypeSelected != undefined){
          if (this.lsVehicleTypeSelected.length > 0) {
            this.showDataInForm(this.lsVehicleTypeSelected);
          } else {
            this.clearDataForm();
          }
        }else{
          this.clearDataForm();
        }
        
      }else if(change == "disableChecks"){
        this.toggleChecks();
      }
    }
  }

  ngOnInit(): void {
    
    this.lsVehicleTypeSelected =[]
    this.countChanges = 0;
    this.getVehicleTypes();
  }

  async getVehicleTypes(){
    try {
      this.lsVehicleTypes = await this.vehicleService.getVehicleTypes();      
    } catch (error) {
      console.error(error);
    }
  }

  getIdChk(id:number):string{
    return `chk_vehicleType_${id}`;
  }

  setVehicleType(event:any, pVehicleType: VehicleType){
    //console.log(event.checked);
    //console.log("[Vehicle type component Antes]", this.lsVehicleTypeSelected);
    if(event.checked){
      if( this.lsVehicleTypeSelected == null &&  this.lsVehicleTypeSelected == undefined){
        this.lsVehicleTypeSelected = [];
      }       
      this.lsVehicleTypeSelected.push(pVehicleType);
      
      
    }else{
      let oVehicleTypeTmp = this.lsVehicleTypeSelected.find(item => item.id == pVehicleType.id)
      let index = this.lsVehicleTypeSelected.indexOf(oVehicleTypeTmp);  
      if(index != -1){
        //console.log("index element to delete: ",index);
        this.lsVehicleTypeSelected.splice(index,1);
      }  
     
    }
    //console.log("[Vehicle type component Después]", this.lsVehicleTypeSelected);
   
    this.vehicleService.setListVehicleTypeSelected(this.lsVehicleTypeSelected);
   
    
    this.vehicleTypeWasSelected.emit(true);
  }

  async showDataInForm(lsVehicleSelected: VehicleType[]){
    try{
      await lsVehicleSelected.forEach(item => {
        let idCheck = `#${this.getIdChk(item.id)}`;
        let oCheckBox: HTMLInputElement = document.querySelector(idCheck);
        oCheckBox.checked = true;        
      });

      this.toggleChecks();
    }
    catch(error){
      console.warn("[Puede que no exista una lista de tipo de vehículos aún]");
      setTimeout(() => {
        this.lsVehicleTypeSelected = this.vehicleService.getListVehicleTypeSelected();
        //console.warn("Intenta de nuevo mostrar información", this.lsVehicleTypeSelected);        
        this.showDataInForm(this.lsVehicleTypeSelected);
        this.toggleChecks();
      },800);
    }
  }

  clearDataForm(){
    try {
      this.lsVehicleTypes.forEach(item => {
        let idCheck = `#${this.getIdChk(item.id)}`;
        let oCheckBox: HTMLInputElement = document.querySelector(idCheck);
        oCheckBox.checked = false;
      });
    } catch (error) {
      console.warn("[No hay una lista de tipo de vehículo aún]");
    }
   
  }

  toggleChecks(){    
    try {
      console.log("[toggleChecks]",this.disableChecks);

      this.lsVehicleTypes.forEach(vehicleType =>{
        let idCheck = `#${this.getIdChk(vehicleType.id)}`;
        let oCheckBox: HTMLInputElement = document.querySelector(idCheck);
        oCheckBox.disabled = this.disableChecks;    
      })
    
    } catch (error) {
      console.warn(error);
    }
    
  }

 
}
