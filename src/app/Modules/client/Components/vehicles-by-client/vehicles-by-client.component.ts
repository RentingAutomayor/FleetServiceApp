import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { ResponseApi } from 'src/app/Models/ResponseApi';
import { Vehicle } from 'src/app/Models/Vehicle';
import { VehicleService } from '../../Services/Vehicle/vehicle.service';
import { ClientService } from '../../Services//Client/client.service';
import { Client } from 'src/app/Models/Client';
import { ActionType } from 'src/app/Models/ActionType';
import { Action } from 'rxjs/internal/scheduler/Action';

@Component({
  selector: 'app-vehicles-by-client',
  templateUrl: './vehicles-by-client.component.html',
  styleUrls: ['./vehicles-by-client.component.scss']
})
export class VehiclesByCLientComponent implements OnInit, OnChanges {
  lsVehicles: Vehicle[];
  isAwaiting: boolean;
  isToUpdate: boolean;
  btnAddVehicle: HTMLButtonElement;
  containerErrorAdd: HTMLElement;
  oClient: Client;
  //pagination
  p: number = 1;
  @Input() clientWasSaved: boolean;
  oCountVehicle: number;
  @Input() disableActionButtons:boolean;
  @Input() action: ActionType;
  buttonAddIsVisible:boolean;

  constructor(
    private vehicleService: VehicleService,
    private clientService: ClientService
  ) { 
    this.disableActionButtons = false;
    this.buttonAddIsVisible = false;
  }

  ngOnInit(): void {
    this.initComponents();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let change in changes) {
      if (change == "clientWasSaved") { 
        setTimeout(()=>{
          //await this time because the btn it's no ready jet      
          this.validateIfButtonAddMustVisible();
        },1500);
      }
    }
  }

  initComponents() {
    this.isAwaiting = false;
    this.isToUpdate = false;
    this.oClient = this.clientService.getClientToUpdate();
    this.showTableVehicles();
    this.oCountVehicle = 0;
    //console.log("[initComponents] - action: ", this.action);
  }

  async showTableVehicles() {
    //console.warn("[showTableVehicles]",this.oClient);
    if (this.oClient != null  && this.oClient != undefined) {
      this.lsVehicles = await this.vehicleService.getVehiclesByClient(this.oClient.id);     
    }
    
    setTimeout(()=>{
      //await this time because the btn it's no ready jet
      this.validateIfButtonAddMustVisible();
    },1500);
  }

  insertVehicle() {
    this.vehicleService.setVehicleToUpdate(null);
    this.oCountVehicle += 1;
    this.isToUpdate = false;    
    this.showPopUp();    
  }

  getErrorDescription(): string {
    return 'No se pueden agregar vehículos hasta que se guarde la información básica del cliente';
  }



  async saveVehicle() {
    try {
      let rta = new ResponseApi();
      let oVehicle = this.vehicleService.getVehicle();
      oVehicle.Client_id = this.oClient.id;
      this.isAwaiting = true;
      if (this.isToUpdate) {
        rta = await this.vehicleService.Update(oVehicle);
      } else {
        rta = await this.vehicleService.Insert(oVehicle);
      }
      this.isAwaiting = false;

      if (rta.response) {
        alert(rta.message);
        this.showTableVehicles();
        this.hidePopUp();
        this.vehicleService.setVehicle(null);
        this.vehicleService.setVehicleToUpdate(null);
      }

    } catch (err) {
      //console.error(err.error.Message);
      alert(err.error.Message);
      this.isAwaiting = false;

    }


  }

  comeBackToTable() {
    this.vehicleService.setVehicleToUpdate(null);
    this.vehicleService.setVehicleStateSelected(null);
    this.vehicleService.setVehicleModelSelected(null);
    this.hidePopUp();
  }

  showPopUp() {
    let containerForm = document.getElementById("container__formVehicle");
    containerForm.setAttribute("style", "display:block");
  }

  hidePopUp() {
    let containerForm = document.getElementById("container__formVehicle");
    containerForm.setAttribute("style", "display:none");
  }


  activateButtonAdd() {
    try {
      this.btnAddVehicle = document.querySelector('#btnAddVehicle');      
      this.btnAddVehicle.disabled = false;
      this.btnAddVehicle.classList.remove("error");    
      
    } catch (error) {
      //console.warn(error.message);
    }
  
  }

  removeContainerError(){
    try{
      this.containerErrorAdd = document.querySelector('#cont_error_add_vehicle');
      this.containerErrorAdd.style.display = 'none';
    }catch(error){
      //console.log(error.message);
    }
  }
 
  disableButtonAdd() {
    try{
      this.btnAddVehicle = document.querySelector('#btnAddVehicle');
      this.btnAddVehicle.disabled = true;
      this.btnAddVehicle.className += `${this.btnAddVehicle.className} error`;     
    }catch(error){
      //console.warn(error.message);
    }      
  }

  addContainerError(){
    try{
      this.containerErrorAdd = document.querySelector('#cont_error_add_vehicle');
      this.containerErrorAdd.style.display = 'block';
    }catch(error){
      //console.log(error.message);
    }
    
  }

  

  updateVehicle(pVehicle: Vehicle) {
    this.isToUpdate = true;
    ////console.log("[Vehicle to uodate]", pVehicle);
    this.vehicleService.setVehicleToUpdate(pVehicle);
    this.oCountVehicle += 1;
    this.showPopUp();
  }

  async deleteVehicle(pVehicle: Vehicle) {
    if (confirm("¿Está seguro que desea eliminar este vehículo?")) {
      this.isAwaiting = true;
      let rta = await this.vehicleService.Delete(pVehicle);
      if (rta.response) {
        alert(rta.message);
        this.showTableVehicles();
      }
      this.isAwaiting = false;
    }
  }

  getStateID(vehicle_id:number):string{
    return `state_${vehicle_id}`;

  }

  validateTag(state_name:string,vehicle_id: number):string{
    let idElement = `#state_${vehicle_id}`;
    let tag: HTMLElement = document.querySelector(idElement);
    switch(state_name.toUpperCase()){
      case 'INACTIVO':
        tag.classList.add("tag-error");
        break;
        case 'ACTIVO':
          tag.classList.add("tag-active");
          break;
    }
    return state_name;

  }

  validateIfButtonAddMustVisible(){
    switch(this.action){
      case ActionType.READ:
          this.buttonAddIsVisible = false;
        break;
      case ActionType.UPDATE:
      case ActionType.CREATE:
          this.buttonAddIsVisible = true;
        break;
    }  
    this.validateDataClient();  
  }

  validateDataClient(){
    //console.warn("[validateDataClient]",this.oClient);
    if(this.oClient != null && this.oClient != undefined){
      //console.warn("[validateDataClient] -> Activa botón");
      this.activateButtonAdd();
      this.removeContainerError();
    }else{
      //console.warn("[validateDataClient] -> Inactiva botón");
      this.disableButtonAdd();
      this.addContainerError();
    }
  }

}
