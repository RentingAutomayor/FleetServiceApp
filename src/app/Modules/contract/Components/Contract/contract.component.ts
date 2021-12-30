import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Client } from 'src/app/Models/Client';
import { Contract } from 'src/app/Models/Contract';
import { ContractState, ConstractStates } from 'src/app/Models/ContractState';
import { VehicleModel } from 'src/app/Models/VehicleModel';
import { ClientService } from 'src/app/Modules/client/Services/Client/client.service';
import { VehicleService } from '../../../client/Services/Vehicle/vehicle.service';
import { Dealer } from 'src/app/Models/Dealer';
import { DealerService } from '../../../dealer/Services/Dealer/dealer.service';
import { ContractService } from '../../Services/Contract/contract.service';
import { ResponseApi } from 'src/app/Models/ResponseApi';
import { Router } from '@angular/router';
import { VehicleType } from 'src/app/Models/VehicleType';
import { SecurityValidators } from 'src/app/Models/SecurityValidators';
import { Company } from 'src/app/Models/Company';
import { CompanyType } from 'src/app/Models/CompanyType';
import { InputValidator } from 'src/app/Utils/InputValidator';
import { DiscountType } from 'src/app/Models/DiscountType';
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem';
import { ActionType } from 'src/app/Models/ActionType';
import { Action } from 'rxjs/internal/scheduler/Action';


@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit, OnChanges {

  frmContract: FormGroup;
  @Input() countChanges: number;
  @Input() contractIsToUpdate:boolean;
  @Output() contractWasSetted = new EventEmitter<boolean>();

  oChangeDealer: number;

  contract: Contract;
  contractToUpdate: Contract;
  lsVehicleModelsTemp: VehicleModel[] = [];
  dtStartingDate: Date;
  dtEndingDate: Date;
  isToUpdate: boolean;
  oGetPricesOfContract: number;
  disableDealerField: boolean;
  company: Company;
  clientFieldIsInvalid: boolean;
  dealerFieldIsInvalid: boolean;
  contracStateFieldIsInvalid: boolean;
  discountFieldIsInvalid: boolean;
  discountType: DiscountType;
  lsMaintenanceItemsTemp: MaintenanceItem[];
  disableClientField: boolean;
  disableTypeOfDiscoutnField: boolean;
  disableVehicleTypesAndVehicleModels: boolean;
  disableVehicles: boolean;
  buttonSaveIsDisable:boolean;
  disableCmbState:boolean;
  isAwaiting: boolean;
  action:ActionType;

  constructor(
    private clientService: ClientService,
    private vehicleService: VehicleService,
    private dealerService: DealerService,
    private datePipe: DatePipe,
    private contractService: ContractService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    let now = new Date();
    let monthfuture = new Date(now.getFullYear(), now.getMonth() + 1, now.getDay());
    this.dtStartingDate = now;
    this.dtEndingDate = now;
    this.buildContractForm();
    this.clientFieldIsInvalid = false;
    this.dealerFieldIsInvalid = false;
    this.contracStateFieldIsInvalid = false;
    this.discountFieldIsInvalid = false;
    this.lsMaintenanceItemsTemp = [];
    this.disableClientField = false;
    this.disableTypeOfDiscoutnField = false;
    this.disableVehicles = false;
    this.buttonSaveIsDisable = false;
    this.disableCmbState = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.validateCompanyLogged();
  }

  ngOnInit(): void {
    this.initComponents();
  }

  buildContractForm() {
    this.frmContract = this.formBuilder.group({
      name: [''],
      duration: ['', [Validators.required]],
      startingDate: ['', [Validators.required]],
      endingDate: ['', [Validators.required]],
      discountValue: ['', [Validators.required]],
      observation: [''],
      amountVehicles: ['', [Validators.required]]
    });
  }

  get contractNameField() {
    return this.frmContract.get('name');
  }

  get durationField() {
    return this.frmContract.get('duration');
  }

  get startingDateField() {
    return this.frmContract.get('startingDate');
  }

  get endingDateField() {
    return this.frmContract.get('endingDate');
  }

  get discountValueField() {
    return this.frmContract.get('discountValue');
  }

  get observationField() {
    return this.frmContract.get('observation');
  }

  get amountVehiclesField() {
    return this.frmContract.get('amountVehicles');
  }

  async initComponents() {
    this.action = this.contractService.getAction();
    this.validateCompanyLogged();
    this.oChangeDealer = 0;
    this.oGetPricesOfContract = 0;
    this.isToUpdate = false;
    this.isAwaiting = false;
    this.contract = new Contract();
    this.countChanges = 0;
    this.hideContainerTabs();
    this.validateContractToUpdate();
    this.enableOrDisableForm();

  }

  async validateCompanyLogged() {
    try {
      this.company = SecurityValidators.validateUserAndCompany();
      switch (this.company.type) {
        case CompanyType.DEALER:
          this.disableDealerField = true;
          this.dealerService.getDealerById(this.company.id)
            .then(dataDealer => {
              this.dealerService.setDealerSelected(dataDealer);
              this.countChanges += 1;
            });

          break
        case CompanyType.CLIENT:

          break;
        default:
          this.disableDealerField = false;

          break;
      }
    } catch (error) {
      console.warn(error);
    }
  }

  validateContractToUpdate() {
    this.contractToUpdate = this.contractService.getContract();
    if (this.contractToUpdate != null && this.contractToUpdate != undefined) {
      this.isToUpdate = true;
      this.setDataInForm(this.contractToUpdate);
    } else {
      this.isToUpdate = false;
      this.clientService.setClientSelected(null);
      this.dealerService.setDealerSelected(null);
      this.contractService.setContractStateSelected(null);
      this.contractService.setDiscountTypeSelected(null);
      this.vehicleService.setListVehicleTypeSelected(null);
      this.vehicleService.setListVehicleModelsSelected(null);
      this.vehicleService.setListVehiclesSelected(null);
    }
  }

  openTab(oButton: any, container: string) {
    let tabLinks = document.getElementsByClassName("tab_link");

    for (let i = 0; i < tabLinks.length; i++) {
      tabLinks[i].classList.remove("active");
    }
    oButton.target.className += " active";
    let containerTabs = document.getElementsByClassName("tab_content");

    for (let i = 0; i < containerTabs.length; i++) {
      containerTabs[i].setAttribute("style", "display:none");
    }

    let containerToShow_id = `container__${container}`;
    let containerToShow = document.getElementById(containerToShow_id);
    containerToShow.setAttribute("style", "display:blick");
  }

  hideContainerTabs() {
    let containers = document.getElementsByClassName("tab_inactive");
    for (let i = 0; i < containers.length; i++) {
      containers[i].setAttribute("style", "display:none");
    }
  }

  moveContent(event: any) {
    let containerContent: HTMLDivElement = document.querySelector("#container__content");

    if (event) {
      containerContent.style.marginLeft = "250px";
    } else {
      containerContent.style.marginLeft = "60px";
    }

  }

  setVehiclType() {
    this.countChanges += 1;
  }

  setListVehicleTypes() {
    this.countChanges += 1;
  }

  setLisVehicleModels() {
    this.countChanges += 1;
    this.contract.lsVehicleModels = this.vehicleService.getListVehicleModelsSelected();
  }

  setClientSelected() {
    this.contract.client = new Client();
    this.contract.client = this.clientService.getClientSelected();
    this.vehicleService.setListVehicleTypeSelected(null);
    this.vehicleService.setListVehicleModelsSelected(null);
    if (this.contract.client == null || this.contract.client == undefined) {
      this.clientFieldIsInvalid = true;
    } else {
      this.clientFieldIsInvalid = false;
    }
    this.countChanges += 1;

  }

  setDealerSelected() {
    this.contract.dealer = new Dealer();
    this.contract.dealer = this.dealerService.getDealerSelected();

    if (this.contract.dealer == null || this.contract.dealer == undefined) {
      this.dealerFieldIsInvalid = true;
    } else {
      this.dealerFieldIsInvalid = false;
    }

    this.oChangeDealer += 1;
  }

  calculateEndingDate() {
    let { duration, startingDate, endingDate } = this.frmContract.controls;
    let dTmp = startingDate.value;
    let pStartingDate = null;

    try {
      pStartingDate = this.formatDate(dTmp.toISOString().substring(0, 10));
    } catch (error) {

      dTmp = `${startingDate.value}`;

      pStartingDate = this.formatDate(dTmp.substr(0, 10));
    }

    let durationTmp = duration.value;

    let endingDateTmp = new Date(pStartingDate.getFullYear(), (pStartingDate.getMonth() - 1), (pStartingDate.getDate()));
    endingDateTmp.setMonth(endingDateTmp.getMonth() + durationTmp);

    let strEndDate = endingDateTmp.toISOString().substring(0, 10);
    this.dtEndingDate = endingDateTmp;

  }

  setDataInForm(pContract: Contract) {

    this.frmContract.patchValue(pContract);
    this.dtStartingDate = this.formatDate(pContract.startingDate.toString().substr(0, 10));
    this.dtEndingDate = this.formatDate(pContract.endingDate.toString().substr(0, 10));
    let lsVehicleType = this.getVehicletypesByContract(pContract.lsVehicleModels);
    this.clientService.setClientSelected(pContract.client);
    this.dealerService.setDealerSelected(pContract.dealer);
    this.contractService.setContractStateSelected(pContract.contractState);
    this.contractService.setDiscountTypeSelected(pContract.discountType);
    this.vehicleService.setListVehicleTypeSelected(lsVehicleType);
    this.vehicleService.setListVehicleModelsSelected(pContract.lsVehicleModels);
    this.vehicleService.setListVehiclesSelected(pContract.lsVehicles);

    this.countChanges += 1;
  }

  getVehicletypesByContract(lsVehicleModel: VehicleModel[]): VehicleType[] {
    let lsVehicletype: VehicleType[] = [];

    lsVehicleModel.forEach(vm => {
      let vehicleType = vm.type;
      let existsType = lsVehicletype.find(vt => vt.id == vehicleType.id);

      if (!existsType) {
        lsVehicletype.push(vehicleType);
      }
    });
    return lsVehicletype;
  }


  async saveContract() {
    let { name, startingDate, endingDate, amountVehicles, duration, discountValue, observation } = this.frmContract.controls;
    try {

      this.isAwaiting = true;
      if (this.frmContract.valid) {
        this.contract = new Contract();
        this.contract.name = name.value;
        this.contract.startingDate = startingDate.value;
        this.contract.endingDate = endingDate.value;
        this.contract.amountVehicles = amountVehicles.value;
        this.contract.duration = duration.value;
        this.contract.discountValue = discountValue.value;
        this.contract.observation = observation.value;

        this.oGetPricesOfContract += 1;

        if (confirm("¿Está seguro que desea guardar los datos asociados a este contrato?")) {


          if (this.contractToUpdate != null && this.contractToUpdate != undefined) {
            this.contract.id = this.contractToUpdate.id;
            this.contract.code = this.contractToUpdate.code;
            this.contract.consecutive = this.contractToUpdate.consecutive;
          }

          this.contract.client = new Client();
          this.contract.client = this.clientService.getClientSelected();

          if (this.contract.client == null || this.contract.client == undefined) {
            this.clientFieldIsInvalid = true;
            throw ("Error guardando el contrato. Se debe seleccionar un cliente");
          }

          this.contract.dealer = new Dealer();
          this.contract.dealer = this.dealerService.getDealerSelected();

          if (this.contract.dealer == null || this.contract.dealer == undefined) {
            this.dealerFieldIsInvalid = true;
            throw ("Error guardando el contrato. Se debe seleccionar un concesionario");
          }

          this.contract.contractState = this.contractService.getContractStateSelected();
          this.contract.discountType = this.contractService.getDiscountTypeSelected();


          this.contract.lsVehicleModels = (this.vehicleService.getListVehicleModelsSelected() != null) ? this.vehicleService.getListVehicleModelsSelected() : [];
          this.contract.lsVehicles = (this.vehicleService.getListVehiclesSelected() != null) ? this.vehicleService.getListVehiclesSelected() : [];

          if (this.contract.lsVehicles.length > this.contract.amountVehicles) {
            throw ("No se puede guardar el contrato. verifique la cantidad de vehículos seleccionados dentro del mismo");
          }

          this.contract.lsMaintenanceItems = this.contractService.getItemsWithPrice();
          this.saveData(this.contract);

        }
        this.isAwaiting = false;
      }
    } catch (error) {
      console.warn(error);
      alert(error);
    }



  }

  async saveData(pContract: Contract) {
    try {
      console.warn("[saveData - Contract]", pContract);
      this.isAwaiting = true;
      let rta = new ResponseApi();
      if (this.isToUpdate) {
        rta = await this.contractService.update(pContract);
      } else {
        rta = await this.contractService.insert(pContract);
        let lastContract = await this.contractService.getLastContractByClientAndDealer(pContract.client.id, pContract.dealer.id);
        this.contractService.setContract(lastContract);
      }

      if (rta.response) {
        alert(rta.message);

        this.router.navigate(['/MasterContracts']);
        this.isAwaiting = false;
      }
    } catch (error) {
      this.isAwaiting = false;
      console.error(error);
      alert(`Se ha producido un error guardando el contrato: ${error}`);
    }
  }

  comeBackTable() {
    this.router.navigate(['/MasterContracts']);
  }

  formatDate(sDate: string): Date {
    let year = parseInt(sDate.substring(0, 4));
    let month = parseInt(sDate.substring(5, 7));
    let day = parseInt(sDate.substring(8, 10));
    let dateToReturn = new Date(year, month, day);
    return dateToReturn;
  }

  validateNumbers(event: any) {
    return InputValidator.validateTyping(event, 'numbers');
  }

  setContractState(contractState: ContractState) {
    if (contractState == null || contractState == undefined) {
      this.contracStateFieldIsInvalid = true;
    } else {
      this.disableContract(contractState);
      this.contracStateFieldIsInvalid = false;
    }
  }

  validateInputDate(event: any) {
    event.preventDefault();
    return null;
  }

  setDiscountType(discountType: DiscountType) {
    if (discountType == null || discountType == undefined) {
      this.discountFieldIsInvalid = true;
    } else {
      this.discountType = discountType;
      this.discountFieldIsInvalid = false;
    }
  }

  setItemsByContract(lsMaintenanceItems: MaintenanceItem[]) {
    try {
      this.contract.lsMaintenanceItems = (lsMaintenanceItems != null && lsMaintenanceItems != undefined) ? lsMaintenanceItems : [];
    } catch (error) {
      console.warn(error);
    }
  }

  disableContract(contractState: ContractState) {
    let { name, duration, startingDate, endingDate, discountValue, observation, amountVehicles } = this.frmContract.controls;

    if (contractState.id != ConstractStates.EN_NEGOCIACION) {
      name.disable();
      duration.disable();
      startingDate.disable();
      discountValue.disable();
      observation.disable();
      amountVehicles.disable();
      this.disableClientField = true;
      this.disableDealerField = true;
      this.disableTypeOfDiscoutnField = true;
      this.disableVehicleTypesAndVehicleModels = true;
      this.disableVehicles = true;
    } else {
      name.enable();
      duration.enable();
      startingDate.enable();
      discountValue.enable();
      observation.enable();
      amountVehicles.enable();
      this.disableClientField = false;
      this.disableDealerField = false;
      this.disableTypeOfDiscoutnField = false;
      this.disableVehicleTypesAndVehicleModels = false;
      this.disableVehicles = false;
    }

  }


  enableOrDisableForm(){
    try{
      let isFormToEdit = this.contractService.getContractIsToEdit();
      if(isFormToEdit  || this.action == ActionType.UPDATE){
        this.disableCmbState = false;
      }else{
      }

      if(this.action == ActionType.READ){
        this.buttonSaveIsDisable = true;
        this.disableCmbState = true;
      }

    }catch(error){
      console.warn("[Enable or diable form]", error);
    }
  }
}
