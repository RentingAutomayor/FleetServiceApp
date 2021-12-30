import { Component, OnInit } from '@angular/core';
import { Frequency } from 'src/app/Models/Frequency';
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem';
import { MaintenanceRoutine } from 'src/app/Models/MaintenanceRoutine';
import { MaintenanceRoutineService } from 'src/app/Modules/items-and-routines/Services/MaintenanceRoutine/maintenance-routine.service';
import { MaintenanceItemService } from '../../Services/MaintenanceItem/maintenance-item.service';
import { VehicleService } from '../../../client/Services/Vehicle/vehicle.service';

@Component({
  selector: 'app-tbl-maintenance-matrix',
  templateUrl: './tbl-maintenance-matrix.component.html',
  styleUrls: ['./tbl-maintenance-matrix.component.scss', '../../../../../assets/styles/checkbox.scss']
})
export class TblMaintenanceMatrixComponent implements OnInit {
  isAwaiting: boolean;
  lsFrequency: Frequency[];
  lsMaintenanceItems: MaintenanceItem[];
  countChanges: number;
  lsMaintenanceRoutinesByModel: MaintenanceRoutine[];
  TIPO_MANO_DE_OBRA = 2;

  constructor(
    private maintenanceRoutineService: MaintenanceRoutineService,
    private maintenanceItemService: MaintenanceItemService,
    private vehicleService: VehicleService
  ) { }

  ngOnInit(): void {
    this.initComponents();
  }


  async initComponents() {
    try {
      this.isAwaiting = false;
      const MANO_DE_OBRA = 2;
      this.countChanges = 0;
      this.lsFrequency = await this.maintenanceRoutineService.getFrequency();
      this.lsMaintenanceItems = await this.maintenanceItemService.getMaintenanceItemByType(MANO_DE_OBRA);
    } catch (error) {
      console.error(error);
    }

  }

  getChkId(idItem: number, idFrequency: number) {
    return `chk_item_${idItem}_${idFrequency}`;
  }

  setBrand() {
    this.clearCheckBoxSelected();
    this.countChanges += 1;
  }

  setVehiclType() {
    this.vehicleService.setVehicleModelSelected(null);
    this.clearCheckBoxSelected();
    this.countChanges += 1;
  }

  async setVehicleModel() {
    let oVehicleModel = this.vehicleService.getVehicleModelSelected();

    this.isAwaiting = true;
    this.lsMaintenanceRoutinesByModel = await this.getRoutinesByModel(oVehicleModel.id);

    this.clearCheckBoxSelected();
    this.checkItemsByRoutines(this.lsMaintenanceRoutinesByModel);
    this.isAwaiting = false;
  }

  async getRoutinesByModel(modelId: number): Promise<MaintenanceRoutine[]>
  {
    try {
      return this.maintenanceRoutineService.getMaintenanceRoutineByModel(modelId);
    } catch (error) {
      console.error(error);
    }
  }

  checkItemsByRoutines(lsRoutines:MaintenanceRoutine[]){
    lsRoutines.forEach( routine => {
      try {
        routine.lsItems.forEach(item => {
          try{

            if(item.type.id == this.TIPO_MANO_DE_OBRA){
              let idCheck = this.getChkId(item.id,routine.frequency.id);

              let itemCheck: HTMLInputElement = document.querySelector(`#${idCheck}`);
              itemCheck.checked = true;
            }
          }catch(error){
            console.warn(error);
          }
        });
      } catch (error) {
        console.warn(error);
      }

    });
  }

  clearCheckBoxSelected(){
    try{
      this.lsMaintenanceItems.forEach(item => {
        this.lsFrequency.forEach(frequency => {
          if(item.type.id == this.TIPO_MANO_DE_OBRA){
            let idCheck = `#${this.getChkId(item.id,frequency.id)}`;

            let itemCheck: HTMLInputElement = document.querySelector(idCheck);
            itemCheck.checked = false;
          }
        });
      });
    }catch(error){
      setTimeout(()=> { this.clearCheckBoxSelected() },800);
    }

  }

  getClass(frequency:string): string{
    let frequencyNumber = parseInt(frequency);
    let className = (frequencyNumber>50)?'col_frequency inactive':'col_frequency active';
    return className;
  }

  showOtherRoutines(){
    let aColum = document.getElementsByClassName('col_frequency');;

    for(let i = 0 ; i < aColum.length; i++){
        if(aColum[i].classList.contains('inactive')){
          aColum[i].classList.remove('inactive');
          aColum[i].classList.add('active');
        }else{
          aColum[i].classList.remove('active');
          aColum[i].classList.add('inactive');
        }
    }
  }



}
