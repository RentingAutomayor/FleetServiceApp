import { Component, OnInit } from '@angular/core';
import { Frequency } from 'src/app/Models/Frequency';
import { MaintenanceRoutine } from 'src/app/Models/MaintenanceRoutine';
import { ResponseApi } from 'src/app/Models/ResponseApi';
import { VehicleModel } from 'src/app/Models/VehicleModel';
import { MaintenanceRoutineService } from '../../Services/MaintenanceRoutine/maintenance-routine.service';

@Component({
  selector: 'app-tbl-maintenance-routines',
  templateUrl: './tbl-maintenance-routines.component.html',
  styleUrls: ['./tbl-maintenance-routines.component.scss', '../../../../../assets/styles/app.scss']
})
export class TblMaintenanceRoutinesComponent implements OnInit {
  lsMaintenanceRoutines: MaintenanceRoutine[];
  isAwaiting: boolean;
  p: number = 1;
  containerTable: HTMLDivElement;
  containerFromRoutine: HTMLDivElement;
  isToUpdate: boolean;
  oCountChanges:number;
  frequency_id: number;
  vehicleModel_id: number;
  disableControls: boolean;

  constructor(
    private maintenanceRoutineService: MaintenanceRoutineService
  ) {
    this.frequency_id = 0;
    this.vehicleModel_id = 0;
  }

  ngOnInit(): void {
    this.initComponents();
  }

  initComponents() {
    this.oCountChanges = 0;
    this.isAwaiting = false;
    this.isToUpdate = false;
    this.containerTable = document.querySelector("#container__table");
    this.containerFromRoutine = document.querySelector("#container__maintenanceRoutine");
    this.showTableRoutines();
  }

  async showTableRoutines() {
    try {
      this.isAwaiting = true;
      this.lsMaintenanceRoutines = await this.maintenanceRoutineService.getMaintenanceRoutines();
      this.isAwaiting = false;
    } catch (err) {
      this.isAwaiting = false;
      console.error(err.error.Message);
      alert(err.error.Message);
    }
  }

  insertRoutine() {
    this.disableControls = false;
    this.isToUpdate = false;
    this.oCountChanges += 1;
    this.maintenanceRoutineService.setRoutine(null);
    this.hideTable();
  }

  hideTable() {
    this.containerTable.style.display = "none";
    this.containerFromRoutine.style.display = "block";
  }

  showTable() {
    this.containerTable.style.display = "block";
    this.containerFromRoutine.style.display = "none";
  }


  saveDataRoutine() {
    this.saveDataInDB();
    this.showTable();
  }

  async saveDataInDB() {
    try {
      let rta = new ResponseApi();
      let oMaintenanceRoutine = this.maintenanceRoutineService.getRoutine();
      this.isAwaiting = true;
      if (this.isToUpdate) {
        rta = await this.maintenanceRoutineService.update(oMaintenanceRoutine);
      } else {
        rta = await this.maintenanceRoutineService.insert(oMaintenanceRoutine);
      }
      this.isAwaiting = false;

      if (rta.response) {
        alert(rta.message);
        this.showTableRoutines();
      }
    } catch (err) {
      this.isAwaiting = false;
      console.error(err.error.Message);
      alert(err.error.Message);
    }
  }

  cancelRoutine() {
    if (confirm("¿Está seguro de querer cerrar esta ventana?, al cerrar esta ventana se perdera toda la infromación consignada acá")) {
      this.showTable();
    }
  }

  async seeDetailsRoutine(pRoutine:MaintenanceRoutine){
    this.disableControls = true;
    this.isToUpdate = false;
    this.isAwaiting = true;
    let routineToUpdate = await this.maintenanceRoutineService.getMaintenanceRoutineByID(pRoutine.id);
    this.isAwaiting = false;
    this.maintenanceRoutineService.setRoutine(routineToUpdate);
    this.oCountChanges += 1;
    this.hideTable();
  }

  async updateRoutine(pRoutine:MaintenanceRoutine){
    this.disableControls = false;
    this.isToUpdate = true;
    this.isAwaiting = true;
    let routineToUpdate = await this.maintenanceRoutineService.getMaintenanceRoutineByID(pRoutine.id);

    this.isAwaiting = false;
    this.maintenanceRoutineService.setRoutine(routineToUpdate);
    this.oCountChanges += 1;
    this.hideTable();
  }

  async deleteRoutine(pRoutine: MaintenanceRoutine) {
    try {
      if (confirm("¿Está seguro que desea eliminar esta rutina de mantenimiento?")) {
        this.isAwaiting = true;
        let rta = await this.maintenanceRoutineService.delete(pRoutine);
        this.isAwaiting = false;
        if (rta.response) {
          alert(rta.message);
          this.showTableRoutines();
        }
      }
    } catch (err) {
      console.error(err.error.Message);
      alert(err.error.Message);
    }
  }

  async filterByVehicleModel(vehicleModel:VehicleModel){
    try{
      this.isAwaiting = true;

      if(vehicleModel != null){
        this.vehicleModel_id = vehicleModel.id;
      }else{
        this.vehicleModel_id = 0;
      }

      this.maintenanceRoutineService.getMaintenanceRoutines( this.vehicleModel_id )
      .then( lsMaintenanceRoutines =>{
        this.lsMaintenanceRoutines = lsMaintenanceRoutines
        this.isAwaiting = false;
      })

    }catch(error){
      console.warn(error);
    }

  }

  async filterByFrequency(frequency: Frequency){
    try {
      this.isAwaiting = true;

      if(frequency != null){
        this.frequency_id = frequency.id;
      }else{
        this.frequency_id = 0;
      }

      this.maintenanceRoutineService.getMaintenanceRoutines(0 , this.frequency_id)
      .then( lsMaintenanceRoutines =>{
        this.lsMaintenanceRoutines = lsMaintenanceRoutines
        this.isAwaiting = false;
      })
    } catch (error) {
      console.warn(error);
    }
  }
}
