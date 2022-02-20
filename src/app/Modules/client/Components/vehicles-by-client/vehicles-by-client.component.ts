import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ResponseApi } from 'src/app/Models/ResponseApi';
import { Vehicle } from 'src/app/Models/Vehicle';
import { VehicleService } from '../../Services/Vehicle/vehicle.service';
import { ClientService } from '../../Services//Client/client.service';
import { Client } from 'src/app/Models/Client';
import { ActionType } from 'src/app/Models/ActionType';


@Component({
  selector: 'app-vehicles-by-client',
  templateUrl: './vehicles-by-client.component.html',
  styleUrls: ['./vehicles-by-client.component.scss']
})
export class VehiclesByCLientComponent implements OnInit {

  isAwaiting: boolean;
  isToInsert: boolean;
  btnAddVehicle: HTMLButtonElement;
  containerErrorAdd: HTMLElement;
  p = 1;
  @Input() clientWasSaved: boolean;
  @Input() disableActionButtons: boolean;

  buttonAddIsVisible: boolean;

  action: ActionType;
  @Input('action')
  set setAction(action: ActionType){
    this.action = action;
    this.validateIfButtonAddMustVisible(this.action);
  }

  client: Client;
  @Input('client')
  set setClient(client: Client){
    this.client = client;
  }

  lsVehicles: Vehicle[];
  @Input('vehicles')
  set setLsVehicles(vehicles: Vehicle[]){
    this.lsVehicles = vehicles;
  }

  vehicleSelected: Vehicle = null;
  isFormBlocked: Boolean = null;
  idTemp: number = 0;

  isErrorVisible: boolean = false;
  errorTitle: string = '';
  errorMessageApi: string = '';

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onVehiclesWereModified = new EventEmitter<Vehicle[]>();

  constructor(
    private vehicleService: VehicleService,
  ) {
    this.disableActionButtons = false;
    this.buttonAddIsVisible = false;
  }

  ngOnInit(): void {
    this.initComponents();
  }

  initComponents(): void {
    this.isAwaiting = false;
    this.isToInsert = false;
    this.isErrorVisible = false;
    this.errorTitle = '';
    this.errorMessageApi = '';
  }

  insertVehicle() {
    this.vehicleSelected = null;
    this.isToInsert = true;
    this.isFormBlocked = false;
    this.showPopUp();
  }

  getDetailsByVehicle(vehicleId: number): void{
    this.vehicleSelected = this.lsVehicles.find(vh => vh.id === vehicleId);
    this.isToInsert = false;
    this.isFormBlocked = true;
    this.showPopUp();
  }

  updateVehicle(vehicleId: number): void {
    this.vehicleSelected = this.lsVehicles.find(veh => veh.id === vehicleId);
    this.isToInsert = false;
    this.isFormBlocked = false;
    this.showPopUp();
  }

  deleteVehicle(vehicle: Vehicle): void {
    if (confirm('¿Está seguro que desea eliminar este vehículo?')) {
      if(this.client.id == 0){
        const vehicleIndex = this.lsVehicles.findIndex(veh => veh.id === vehicle.id);
        this.lsVehicles.splice(vehicleIndex, 1);
      }else{
        this.vehicleService.Delete(vehicle)
        .subscribe(rta =>{
          const vehicleIndex = this.lsVehicles.findIndex(veh => veh.id === vehicle.id);
          this.lsVehicles.splice(vehicleIndex, 1);
        }, err => {
          this.isErrorVisible = true;
          this.isAwaiting = false;
          this.errorTitle = 'Ocurrió un error intentando Eliminar el vehículo';
          this.errorMessageApi = (err.error.Message) ? err.error.Message : err;
        });
      }
      this.isAwaiting = true;

      this.isAwaiting = false;
      this.onVehiclesWereModified.emit(this.lsVehicles);
    }
  }

  saveVehicle(vehicle: Vehicle): void {
    if (this.isToInsert){
      vehicle.id = this.idTemp;
      if (this.client.id == 0){
        this.lsVehicles.unshift(vehicle);
      }else{
        vehicle.Client_id = this.client.id;
        this.vehicleService.Insert(vehicle)
        .subscribe(newVehicle => {
          this.lsVehicles.unshift(newVehicle);
        }, err => {
          this.isErrorVisible = true;
          this.isAwaiting = false;
          this.errorTitle = 'Ocurrió un error intentando Insertar el vehículo';
          this.errorMessageApi = (err.error.Message) ? err.error.Message : err;
        });
      }
      this.idTemp--;
    }else{
      if (this.client.id == 0){
        vehicle.id = this.vehicleSelected.id;
        const vehicleIndex = this.lsVehicles.findIndex(veh => veh.id === vehicle.id);
        this.lsVehicles[vehicleIndex] = vehicle;
      }else{
        vehicle.Client_id = this.client.id;
        this.vehicleService.Update(vehicle)
        .subscribe(vehicleUpdated => {
          const vehicleIndex = this.lsVehicles.findIndex(veh => veh.id === vehicle.id);
          this.lsVehicles[vehicleIndex] = vehicleUpdated;
        }, err => {
          this.isErrorVisible = true;
          this.isAwaiting = false;
          this.errorTitle = 'Ocurrió un error intentando Actualizar el vehículo';
          this.errorMessageApi = err.error.Message;
        });
      }
    }
    this.hidePopUp();
    this.onVehiclesWereModified.emit(this.lsVehicles);
  }

  comeBackToTable(): void {
    this.vehicleSelected = null;
    this.hidePopUp();
  }

  showPopUp() {
    const containerForm = document.getElementById('container__formVehicle');
    containerForm.setAttribute('style', 'display:block');
  }

  hidePopUp() {
    const containerForm = document.getElementById('container__formVehicle');
    containerForm.setAttribute('style', 'display:none');
  }


  activateButtonAdd() {
    try {
      this.btnAddVehicle = document.querySelector('#btnAddVehicle');
      this.btnAddVehicle.disabled = false;
      this.btnAddVehicle.classList.remove('error');

    } catch (error) {
      console.warn(error.message);
    }

  }



  disableButtonAdd() {
    try{
      this.btnAddVehicle = document.querySelector('#btnAddVehicle');
      this.btnAddVehicle.disabled = true;
      this.btnAddVehicle.className += `${this.btnAddVehicle.className} error`;
    }catch (error){
      console.warn(error.message);
    }
  }


  getStateID(vehicle_id: number): string{
    return `state_${vehicle_id}`;

  }

  validateTag(state_name: string, vehicle_id: number): string{
    const idElement = `#state_${vehicle_id}`;
    const tag: HTMLElement = document.querySelector(idElement);
    switch (state_name.toUpperCase()){
      case 'INACTIVO':
        tag.classList.add('tag-error');
        break;
        case 'ACTIVO':
          tag.classList.add('tag-active');
          break;
    }
    return state_name;

  }

  validateIfButtonAddMustVisible(action: ActionType){
    switch (action){
      case ActionType.READ:
          this.buttonAddIsVisible = false;
          break;
      case ActionType.UPDATE:
      case ActionType.CREATE:
          this.buttonAddIsVisible = true;
          break;
    }
  }

  closeErrorMessage(){
    this.isErrorVisible = false;
  }

}
