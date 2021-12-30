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
export class CheckListVehicleModelComponent implements OnInit, OnChanges {
  lsVehicleType: VehicleType[];
  lsVehicleModels: VehicleModel[];
  //Vehicle Type Selected
  lsVehicleTypesSelected: VehicleType[] = [];
  lsVehicleModelsSelected: VehicleModel[] = [];
  lsVehicleModelEnabled: VehicleModel[] = [];

  prefixContainerType: string = 'container_type_';
  prefixContainerModel: string = 'container_model_';

  @Input() countChanges: number;
  @Input() disableChecks: boolean;
  @Output() vehicleModelsWasSetted = new EventEmitter<boolean>();

  count: number = 0;

  constructor(
    private vehicleService: VehicleService
  ) {

    this.disableChecks = false;

  }

  async ngOnChanges(changes: SimpleChanges) {

    for (let change in changes) {
      if (change == "countChanges") {
        this.lsVehicleTypesSelected = this.vehicleService.getListVehicleTypeSelected();


        if (this.lsVehicleTypesSelected != null && this.lsVehicleTypesSelected != undefined) {
          if (this.lsVehicleTypesSelected.length > 0) {
            this.enableAndDisableVehicleModels(this.lsVehicleTypesSelected);
          }
          else {
            this.disableCheckBox(this.lsVehicleTypesSelected);
          }

        } else {
          this.disableCheckBox(this.lsVehicleTypesSelected);
        }

        this.lsVehicleModelsSelected = this.vehicleService.getListVehicleModelsSelected();
        if (this.lsVehicleModelsSelected != null && this.lsVehicleModelsSelected != undefined) {
          this.setDataInForm(this.lsVehicleModelsSelected);
        } else {
          this.clearDataForm();
        }
      } else if (change == "disableChecks") {
        this.toggleChecks();
      }
    }
  }

  ngOnInit(): void {
    this.initComponents();
  }

  initComponents() {

    this.lsVehicleModels = [];
    this.countChanges = 0;

    this.getLsVehicleTypes();
    this.getLsVehicleModels().then(() => {
      this.disableCheckBox(this.lsVehicleTypesSelected);
      this.toggleChecks();
    });



  }

  showVehicleModelsByContainer(last: boolean) {

    this.validateContainerTypes();

  }

  async getLsVehicleModels() {
    try {
      this.lsVehicleModels = await this.vehicleService.getVehicleModelByBrandAndType(0, 0);
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
      this.disableCheckBox(pLsVehicleTypes);

      this.lsVehicleModelEnabled = await this.vehicleService.getVehicleModelByTypes(pLsVehicleTypes);
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
    this.vehicleService.setListVehicleModelsSelected(this.lsVehicleModelsSelected);
    this.vehicleModelsWasSetted.emit(true);
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
