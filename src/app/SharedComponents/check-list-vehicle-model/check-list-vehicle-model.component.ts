import { Component, Input, OnChanges, SimpleChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { setTime } from 'ngx-bootstrap/chronos/utils/date-setters';
import { VehicleModel } from 'src/app/Models/VehicleModel';
import { VehicleType } from 'src/app/Models/VehicleType';
import { VehicleService } from '../../Modules/client/Services/Vehicle/vehicle.service';

@Component({
  selector: 'app-check-list-vehicle-model',
  templateUrl: './check-list-vehicle-model.component.html',
  styleUrls: ['./check-list-vehicle-model.component.scss', '../../../assets/styles/checkbox.scss']
})
export class CheckListVehicleModelComponent implements OnInit {
  lsVehicleType: VehicleType[];
  lsVehicleModels: VehicleModel[];
  lsVehicleModelEnabled: VehicleModel[] = [];

  prefixContainerType: string = 'container_type_';
  prefixContainerModel: string = 'container_model_';

  @Input() disableChecks: boolean;
  @Output() onVehicleModelsWasSetted = new EventEmitter<VehicleModel[]>();

  lsVehicleTypesSelected: VehicleType[] = [];
  @Input('lsVehicleTypesSelected')
  set setLsVehicleTypeSelected(lsTypes: VehicleType[]){
    this.lsVehicleTypesSelected = (lsTypes !== null && lsTypes !== undefined)?lsTypes:[];
    if(!(this.lsVehicleTypesSelected.length > 0)){
      this.clearDataForm();
    }
    this.enableAndDisableVehicleModels(this.lsVehicleTypesSelected)
  }

  lsVehicleModelsSelected: VehicleModel[] = [];
  @Input('lsVehicleModelsSelected')
  set setLsVehicleModelsSelected(vehicleModels:  VehicleModel[]){
    this.lsVehicleModelsSelected = (vehicleModels !== null && vehicleModels !== undefined)?vehicleModels:[];
    if(this.lsVehicleModelsSelected.length > 0){
      this.setDataInForm(this.lsVehicleModelsSelected);
    }else{
      this.clearDataForm();
    }
  }

  countChanges: number;
  @Input('countChanges')
  set setCountChanges(value:number){
    this.countChanges = value;
    this.enableAndDisableVehicleModels(this.lsVehicleTypesSelected);
  }


  disableControls:boolean
  @Input('disableControls')
  set setDisableControls(value:boolean){
    this.disableControls = value;
  }

  constructor(
    private vehicleService: VehicleService
  ) {
    this.disableChecks = false;
  }

  ngOnInit(): void {
    this.initComponents();
  }

  initComponents() {
    this.lsVehicleModels = [];
    this.getLsVehicleTypes();
    this.getLsVehicleModels()
    this.disableCheckBox([]);
    //this.toggleChecks();
  }

  showVehicleModelsByContainer(last: boolean) {
    this.validateContainerTypes();
  }

  getLsVehicleModels() {
    try {
      this.vehicleService.getVehicleModelByBrandAndType(0, 0)
      .then(vehicleModels=>{
        this.lsVehicleModels = vehicleModels;
      });
    } catch (error) {
      console.error(error);
    }
  }

  async getLsVehicleTypes() {
    try {
      this.lsVehicleType = await this.vehicleService.getVehicleTypes();
    } catch (error) {
      console.error(error);
    }
  }

  validateContainerTypes() {
    try {
      if (this.lsVehicleModels != null && this.lsVehicleModels != undefined) {
        this.lsVehicleModels.forEach(element => {
          let idElement = `#${this.prefixContainerModel}${element.id}`;
          let idContainer = `#${this.prefixContainerType}${element.type.id}`;
          let divContainer: HTMLDivElement = document.querySelector(idContainer);
          let divElement: HTMLDivElement = document.querySelector(idElement);
          divContainer.appendChild(divElement);
        });
      }
    } catch (error) {
      console.warn(error);
    }

  }

  getIdChk(id: number) {
    return `chk_vehicle_model_${id}`;
  }

  getContainerTypeId(id: number) {
    return `${this.prefixContainerType}${id}`;
  }

  getContainerModelId(id: number) {
    return `${this.prefixContainerModel}${id}`;
  }

  async enableAndDisableVehicleModels(pLsVehicleTypes: VehicleType[]) {
    try {
      let lsTypes = (pLsVehicleTypes !== null && pLsVehicleTypes !== undefined)?pLsVehicleTypes:[];
      this.disableCheckBox(pLsVehicleTypes);
      if(lsTypes.length>0){
        this.lsVehicleModelEnabled = await this.vehicleService.getVehicleModelByTypes(pLsVehicleTypes);
      }else{
        this.lsVehicleModelEnabled = [];
      }
      this.enableCheckBox(this.lsVehicleTypesSelected, this.lsVehicleModelEnabled);

    } catch (error) {
      console.warn(error);
    }
  }

  setVehicleModel(event: any, pVehicleModel: VehicleModel) {
    if (event.checked) {
      if (this.lsVehicleModelsSelected == null && this.lsVehicleModelsSelected == undefined) {
        this.lsVehicleModelsSelected = [];
      }
      this.lsVehicleModelsSelected.push(pVehicleModel);

    } else {
      let oVmTmp = this.lsVehicleModelsSelected.find(item => item.id == pVehicleModel.id);
      let index = this.lsVehicleModelsSelected.indexOf(oVmTmp);
      if (index != -1) {
        this.lsVehicleModelsSelected.splice(index, 1);
      }

    }
    this.onVehicleModelsWasSetted.emit(this.lsVehicleModelsSelected);
  }

  async setDataInForm(lsVehicleModel: VehicleModel[]) {
    try {
      setTimeout(() => {
        lsVehicleModel.forEach(item => {
          let idCheck = `#${this.getIdChk(item.id)}`;
          let oCheckBox: HTMLInputElement = document.querySelector(idCheck);
          oCheckBox.checked = true;
        });
      }, 800);
    } catch (error) {
      console.warn("[Puede que no exista una lista de lineas actualmente]");
    }

  }

  clearDataForm() {
    try {
      this.lsVehicleModels.forEach(item => {
        let idCheck = `#${this.getIdChk(item.id)}`;
        let oCheckBox: HTMLInputElement = document.querySelector(idCheck);
        oCheckBox.checked = false;
      });
    } catch (error) {
      console.warn("[Puede que no exista una lista de lineas actualmente]");
    }

  }

  enableCheckBox(lsVehicleType: VehicleType[], lsVehicleModel: VehicleModel[]) {
    try {
      lsVehicleType.forEach(vType => {

        let lsTempVM = lsVehicleModel.filter(vm => vm.type.id == vType.id);
        lsTempVM.forEach(item => {
          let idCheck = `#${this.getIdChk(item.id)}`;
          let checkVM: HTMLInputElement = document.querySelector(idCheck);
          checkVM.disabled = false;
        });
      });
    } catch (error) {
      console.warn(error);

    }

  }

  disableCheckBox(lsTypesToAvoid: VehicleType[]) {
    try {
      this.lsVehicleModels.forEach(item => {
        let idCheck = `#${this.getIdChk(item.id)}`;
        let checkVM: HTMLInputElement = document.querySelector(idCheck);
        checkVM.disabled = true;

        if (lsTypesToAvoid != null && lsTypesToAvoid != undefined) {
          let itemHasVehicleType = lsTypesToAvoid.find(tp => tp.id == item.type.id);

          if (!itemHasVehicleType) {
            checkVM.checked = false;
            this.removeVehicleModelFromSelected(item);
          }
        }

      });
    } catch (error) {
      console.warn(error);
    }
  }


  removeVehicleModelFromSelected(pVehicleModel: VehicleModel) {
    if (this.lsVehicleModelsSelected != null && this.lsVehicleTypesSelected != undefined) {

      let oVmTmp = this.lsVehicleModelsSelected.find(item => item.id == pVehicleModel.id);
      let index = this.lsVehicleModelsSelected.indexOf(oVmTmp);
      if (index != -1) {

        this.lsVehicleModelsSelected.splice(index, 1);
        this.vehicleService.setListVehicleModelsSelected(this.lsVehicleModelsSelected);

      }
    }
  }


  toggleChecks() {
    try {
      setTimeout(() => {

        this.lsVehicleModels.forEach(vehicleModel => {
          let idCheck = `#${this.getIdChk(vehicleModel.id)}`;
          let checkVM: HTMLInputElement = document.querySelector(idCheck);
          checkVM.disabled = this.disableChecks;
        })
      }, 800);
    } catch (error) {
      console.warn("[toggleChecks VM]", error);
    }
  }



}
