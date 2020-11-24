import { Component, Input, OnChanges, SimpleChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { VehicleModel } from 'src/app/Models/VehicleModel';
import { VehicleType } from 'src/app/Models/VehicleType';
import { VehicleService } from '../../Services/vehicle.service';

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
  @Output() vehicleModelsWasSetted = new EventEmitter<boolean>();

  constructor(
    private vehicleService: VehicleService
  ) {
    //console.log("[Debería entrar acá primero]");
    //this.getLsVehicleModels();
   
   
  }

  async ngOnChanges(changes: SimpleChanges) {
    console.warn("Puede que entre primero aca");  
    for (let change in changes) {
      if (change == "countChanges") {
        this.lsVehicleTypesSelected = this.vehicleService.getListVehicleTypeSelected();
        console.log(this.lsVehicleTypesSelected);

        if (this.lsVehicleTypesSelected != null && this.lsVehicleTypesSelected != undefined) {
          if (this.lsVehicleTypesSelected.length > 0) {
            this.enableAndDisableVehicleModels(this.lsVehicleTypesSelected);
          }
          else{           
            this.disableCheckBox();
          }
          //this.showVehicleModelsByContainer();

        } else {    
         
          this.disableCheckBox();     
          //this.showVehicleModelsByContainer();
         
        }

        this.lsVehicleModelsSelected = this.vehicleService.getListVehicleModelsSelected();
        if (this.lsVehicleModelsSelected != null && this.lsVehicleModelsSelected != undefined) {
          this.setDataInForm(this.lsVehicleModelsSelected);
        } else {
          this.clearDataForm();
        }
      }
    }
  }

  ngOnInit(): void {
    this.initComponents();
  }

  initComponents() {
    
    console.warn("init component");
    this.lsVehicleModels = [];
    this.countChanges = 0;
    //draw container by type 
    this.getLsVehicleTypes();
    this.getLsVehicleModels();   
    this.showVehicleModelsByContainer(); 
    this.disableCheckBox();
    
  }

  async showVehicleModelsByContainer() {
    await setTimeout(() => {
      this.validateContainerTypes(); 
      this.disableCheckBox();     
    }, 800);
    
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
          //console.log(`[element_id]: ${idElement}`);
          //console.log(`[container_id]: ${idContainer}`);
          let divContainer: HTMLDivElement = document.querySelector(idContainer);
          let divElement: HTMLDivElement = document.querySelector(idElement);
          divContainer.appendChild(divElement);

        });
      }

    } catch (error) {
      setTimeout(() => {
        this.validateContainerTypes();
      }, 800);
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
      this.disableCheckBox();
      console.log("[chek vehiclke model] - ", pLsVehicleTypes);
      this.lsVehicleModelEnabled = await this.vehicleService.getVehicleModelByTypes(pLsVehicleTypes);
      this.enableCheckBox(this.lsVehicleTypesSelected, this.lsVehicleModelEnabled);

    } catch (error) {
      console.error(error);
    }
  }

  setVehicleModel(event: any, pVehicleModel: VehicleModel) {

    if (event.checked) {
      if(this.lsVehicleModelsSelected == null && this.lsVehicleModelsSelected == undefined){
        this.lsVehicleModelsSelected = [];
      }
      this.lsVehicleModelsSelected.push(pVehicleModel);
      
    } else {
      let oVmTmp = this.lsVehicleModelsSelected.find(item => item.id == pVehicleModel.id);
      let index = this.lsVehicleModelsSelected.indexOf(oVmTmp);
      if(index != -1){
        this.lsVehicleModelsSelected.splice(index,1);
      }
      
    }

    console.log("[componen check vehicle models]: ", this.lsVehicleModelsSelected);
    this.vehicleService.setListVehicleModelsSelected(this.lsVehicleModelsSelected);
    this.vehicleModelsWasSetted.emit(true);
  }

  setDataInForm(lsVehicleModel: VehicleModel[]) {
    try {
      console.log("[Líneas a seleccionar]:", lsVehicleModel)
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
        let lsTempVM = this.lsVehicleModels.filter(vm => vm.type.id == vType.id);
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

  disableCheckBox() {
    try {
      this.lsVehicleModels.forEach(item => {
        let idCheck = `#${this.getIdChk(item.id)}`;
        let checkVM: HTMLInputElement = document.querySelector(idCheck);
        checkVM.disabled = true;
      });
    } catch (error) {
      console.warn("[Puede que no exista una lista de líneas de vehículo aún]");
    }
  }
}
