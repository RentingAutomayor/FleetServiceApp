import {
   Component,
   EventEmitter,
   Input,
   OnInit,
   Output,
   OnChanges,
   SimpleChanges,
   AfterViewInit
} from '@angular/core';
import { VehicleType } from 'src/app/Models/VehicleType';
import { VehicleService } from '../../Modules/client/Services/Vehicle/vehicle.service';

@Component({
  selector: 'app-check-list-vehicle-type',
  templateUrl: './check-list-vehicle-type.component.html',
  styleUrls: ['./check-list-vehicle-type.component.scss', '../../../assets/styles/checkbox.scss']
})
export class CheckListVehicleTypeComponent implements OnInit {
  lsVehicleTypeSelected?: VehicleType[];
  lsVehicleTypes: VehicleType[];


  @Output() onVehicleTypeWasSelected = new EventEmitter<VehicleType[]>();

  noItemSelected: boolean ;

  @Input('lsTypes')
  set setVehicleTypesSelected(lsTypes: VehicleType[]){
    this.lsVehicleTypeSelected = (lsTypes !== null && lsTypes !== undefined) ? lsTypes : [];
    if ( this.lsVehicleTypeSelected.length > 0){
      this.showDataInForm(this.lsVehicleTypeSelected);
    }else{
      this.clearDataForm();
    }
    this.toogleError(this.lsVehicleTypeSelected);
    this.onVehicleTypeWasSelected.emit(this.lsVehicleTypeSelected);
  }

  disableChecks: boolean;
  @Input('disableChecks')
  set setDisableChecks(value: boolean){
    this.disableChecks = value;
    if (this.disableChecks){
      this.toggleChecks();
    }
  }

  disableControls: boolean;
  @Input('disableControls')
  set setDisableControls(value: boolean){
    this.disableControls = value;
  }

  constructor(
    private vehicleService: VehicleService
  ) {
    this.disableChecks = false;
    this.noItemSelected = false;
    this.lsVehicleTypeSelected = [];
  }

  ngOnInit(): void {
    this.lsVehicleTypeSelected = [];
    this.getVehicleTypes();
  }

  async getVehicleTypes(){
    try {
      this.lsVehicleTypes = await this.vehicleService.getVehicleTypes();
    } catch (error) {
      console.error(error);
    }
  }

  getIdChk(id: number): string{
    return `chk_vehicleType_${id}`;
  }

  setVehicleType(event: any, pVehicleType: VehicleType){
    if (event.checked){
      if ( this.lsVehicleTypeSelected == null &&  this.lsVehicleTypeSelected == undefined){
        this.lsVehicleTypeSelected = [];
      }
      this.lsVehicleTypeSelected.push(pVehicleType);
    }else{
      const oVehicleTypeTmp = this.lsVehicleTypeSelected.find(item => item.id == pVehicleType.id);
      const index = this.lsVehicleTypeSelected.indexOf(oVehicleTypeTmp);
      if (index != -1){
        this.lsVehicleTypeSelected.splice(index, 1);
      }
    }
    this.toogleError(this.lsVehicleTypeSelected);
    this.onVehicleTypeWasSelected.emit(this.lsVehicleTypeSelected);
  }

  toogleError(lsVehicleType): void{
    if (lsVehicleType.length > 0){
      this.noItemSelected = false;
    }else{
      this.noItemSelected = true;
    }
  }

  showDataInForm(lsVehicleSelected: VehicleType[]){
    try{
      lsVehicleSelected.forEach(item => {
        const idCheck = `#${this.getIdChk(item.id)}`;
        const oCheckBox: HTMLInputElement = document.querySelector(idCheck);
        oCheckBox.checked = true;
      });

      // this.toggleChecks();
    }
    catch (error){
      // console.warn("[Puede que no exista una lista de tipo de vehículos aún]");
      // setTimeout(() => {
      //   this.lsVehicleTypeSelected = this.vehicleService.getListVehicleTypeSelected();
      //   //console.warn("Intenta de nuevo mostrar información", this.lsVehicleTypeSelected);
      //   this.showDataInForm(this.lsVehicleTypeSelected);
      //   this.toggleChecks();
      // },800);
    }
  }

  clearDataForm(){
    try {
      this.lsVehicleTypes.forEach(item => {
        const idCheck = `#${this.getIdChk(item.id)}`;
        const oCheckBox: HTMLInputElement = document.querySelector(idCheck);
        oCheckBox.checked = false;
      });
    } catch (error) {
      console.warn('[No hay una lista de tipo de vehículo aún]');
    }

  }

  toggleChecks(){
    try {
      // console.log("[toggleChecks]",this.disableChecks);

      this.lsVehicleTypes.forEach(vehicleType => {
        const idCheck = `#${this.getIdChk(vehicleType.id)}`;
        const oCheckBox: HTMLInputElement = document.querySelector(idCheck);
        oCheckBox.disabled = this.disableChecks;
      });

    } catch (error) {
      console.warn(error);
    }

  }


}
