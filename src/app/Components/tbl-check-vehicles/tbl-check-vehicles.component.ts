import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Client } from 'src/app/Models/Client';
import { Vehicle } from 'src/app/Models/Vehicle';
import { VehicleModel } from 'src/app/Models/VehicleModel';
import { VehicleService } from '../../Services/vehicle.service';
import { ClientService } from '../../Services/client.service';
import { setTime } from 'ngx-bootstrap/chronos/utils/date-setters';

@Component({
  selector: 'app-tbl-check-vehicles',
  templateUrl: './tbl-check-vehicles.component.html',
  styleUrls: ['./tbl-check-vehicles.component.scss', '../../../assets/styles/checkbox.scss']
})
export class TblCheckVehiclesComponent implements OnInit, OnChanges {
  lsVehicles: Vehicle[];
  lsVehiclesSelected: Vehicle[] = [];
  @Input() clientToFilter:Client;
  @Input() lsVehicleModelsToFilter: VehicleModel[]=[];
  @Input() countChanges:number;
  sModels:string;

  
  constructor(
    private vehicleService: VehicleService,
    private clientService: ClientService
  ) { 
    this.clientToFilter = new Client();
    this.sModels = "";
  }

  ngOnChanges(changes: SimpleChanges): void {
    for(let change in changes){      
      switch(change){
        case "countChanges":
          this.sModels = "";
          this.clientToFilter = this.clientService.getClientSelected(); 
          this.lsVehicleModelsToFilter = this.vehicleService.getListVehicleModelsSelected();
          this.setModelsString(); 
          this.lsVehiclesSelected =this.vehicleService.getListVehiclesSelected();    
          if(this.lsVehiclesSelected != null && this.lsVehiclesSelected != undefined){
            this.checkVehiclesSelected(this.lsVehiclesSelected);
          }              
          break;
      }    

    }
    console.log(this.clientToFilter);
    console.log(this.lsVehicleModelsToFilter);
    this.getVehicles();
    console.log(this.sModels)
  }

  ngOnInit(): void {
    this.initComponents();
  }

  async initComponents(){
    this.countChanges = 0;
   this.getVehicles();
  }

  setModelsString(){
    try {
      if(this.lsVehicleModelsToFilter != null && this.lsVehicleModelsToFilter != undefined){
        this.lsVehicleModelsToFilter.forEach(vm => this.sModels += `${vm.id},`);
        this.sModels = this.sModels.substr(0,(this.sModels.length -1));
        if(this.sModels == ""){
          this.sModels = "0";
        }
        console.log(this.sModels);
      }
      
    } catch (error) {
      console.warn(error);
      
    }
  }

  async getVehicles(){
    try{
      if(this.clientToFilter != null && this.clientToFilter != undefined && this.sModels != ""){
        this.lsVehicles = await this.vehicleService.getVehiclesByClientAndModel(this.clientToFilter.id,this.sModels);
        console.log("[tbl-chk-veh -- lsVehicles]:",this.lsVehicles);
      }else{
        this.lsVehicles = [];
      }      
    }catch(error){
      console.error(error);
    }
  }

  getIdChk(idVehicle:number):string{    
    return `chk_vehicle_${idVehicle}`;
  }

  setVehicleToContract(event: any,pVehicle:Vehicle){
    if(event.checked){
      if(this.lsVehiclesSelected == null && this.lsVehiclesSelected  == undefined){
        this.lsVehiclesSelected = [];
      }
      this.lsVehiclesSelected.push(pVehicle);
    }else{
      let vehicle = this.lsVehiclesSelected.find(vh => vh.id == pVehicle.id);
      let index = this.lsVehiclesSelected.indexOf(vehicle);
      if(index != -1){
        this.lsVehiclesSelected.splice(index,1);
      }
    }
    console.log(this.lsVehiclesSelected);

    this.vehicleService.setListVehiclesSelected(this.lsVehiclesSelected);
  }

  checkVehiclesSelected(lsVehicles:Vehicle[]){
    try {
      lsVehicles.forEach(vh => {
        let idCheck = `#${this.getIdChk(vh.id)}`;
        let vehicleCheckbox: HTMLInputElement = document.querySelector(idCheck);
        vehicleCheckbox.checked = true;
      });
    } catch (error) {
      console.warn(error);
      // setTimeout(() => {
      //   this.lsVehiclesSelected = this.vehicleService.getListVehiclesSelected();
      //   this.checkVehiclesSelected(this.lsVehiclesSelected);
      // },800);
    }    
  }


}
