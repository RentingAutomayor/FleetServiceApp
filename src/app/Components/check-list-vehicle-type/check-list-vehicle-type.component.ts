import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { VehicleType } from 'src/app/Models/VehicleType';
import { VehicleService } from '../../Services/vehicle.service';

@Component({
  selector: 'app-check-list-vehicle-type',
  templateUrl: './check-list-vehicle-type.component.html',
  styleUrls: ['./check-list-vehicle-type.component.scss', '../../../assets/styles/checkbox.scss']
})
export class CheckListVehicleTypeComponent implements OnInit,OnChanges {
  lsVehicleTypeSelected: VehicleType[] = [];
  lsVehicleTypes: VehicleType[];
  @Input() countChanges:number;
  @Output() vehicleTypeWasSelected = new EventEmitter<boolean>();

  constructor(
    private vehicleService: VehicleService
  ) { }
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
    console.log(event.checked);
    console.log("[Vehicle type component Antes]", this.lsVehicleTypeSelected);
    if(event.checked){
      if( this.lsVehicleTypeSelected == null &&  this.lsVehicleTypeSelected == undefined){
        this.lsVehicleTypeSelected = [];
      }       
      this.lsVehicleTypeSelected.push(pVehicleType);
      
      
    }else{
      let oVehicleTypeTmp = this.lsVehicleTypeSelected.find(item => item.id == pVehicleType.id)
      let index = this.lsVehicleTypeSelected.indexOf(oVehicleTypeTmp);  
      if(index != -1){
        console.log("index element to delete: ",index);
        this.lsVehicleTypeSelected.splice(index,1);
      }  
     
    }
    console.log("[Vehicle type component Después]", this.lsVehicleTypeSelected);
   
    this.vehicleService.setListVehicleTypeSelected(this.lsVehicleTypeSelected);
   
    
    this.vehicleTypeWasSelected.emit(true);
  }

  showDataInForm(lsVehicleSelected: VehicleType[]){
    try{
      lsVehicleSelected.forEach(item => {
        let idCheck = `#${this.getIdChk(item.id)}`;
        let oCheckBox: HTMLInputElement = document.querySelector(idCheck);
        oCheckBox.checked = true;
      });
    }
    catch(error){
      console.error(error);
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

 
}
