import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Branch } from 'src/app/Models/Branch';
import { City } from 'src/app/Models/City';
import { Client } from 'src/app/Models/Client';
import { ConfigPersonComponent } from 'src/app/Models/ConfigPersonComponent';
import { Person } from 'src/app/Models/Person';
import { ResponseApi } from 'src/app/Models/ResponseApi';
import { BranchService } from '../Services/Branch/branch.service';
import { ClientService } from '../../Modules/client/Services/Client/client.service';
import { PersonService } from '../Services/Person/person.service';
import { CityService } from '../Services/City/city.service';
import { Dealer } from 'src/app/Models/Dealer';
import { DealerService } from '../../Modules/dealer/Services/Dealer/dealer.service';
import { ActionType } from 'src/app/Models/ActionType';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss']
})
export class BranchComponent implements OnInit, OnChanges {
  oConfigPersonComp: ConfigPersonComponent;
  oContainerFormBranch: HTMLElement;
  lsBranchs: Branch[];
  client: Client;
  dealer: Dealer;
  //pagination
  p: number = 1;
  isAwaiting: boolean;
  isToInsert: boolean;
  btnAddBranch: HTMLButtonElement;
  containerErrorBranch: HTMLElement;
  @Input() isToClient: boolean;
  @Input() clientWasSaved: boolean;
  @Input() isToDealer: boolean;
  @Input() dealerWasSaved: boolean;
  oPersonToUpdate: Person;
  oCountBranch: number;
  oCountChangesCity:number;
  @Input()disableActionButtons: boolean;
  @Input() action: ActionType;
  buttonAddIsVisible:boolean;


  constructor(
    private branchService: BranchService,
    private clientService: ClientService,
    private personService: PersonService,
    private cityService: CityService,
    private dealerService: DealerService
  ) {

    this.disableActionButtons = false;
    this.buttonAddIsVisible = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (let change in changes) {
      if (change == "clientWasSaved") {

        if (changes["clientWasSaved"].currentValue == true) {

          this.activateButtonAdd();
          this.removeContainerError();
          this.client = this.clientService.getClientToUpdate();
          this.updateTitleComponent();
        }else{
          this.disableButtonAdd();
          this.addContainerError();
        }
      }

      if (change == "dealerWasSaved") {

        if (changes["dealerWasSaved"].currentValue == true) {

          this.activateButtonAdd();
          this.removeContainerError();
          this.dealer = this.dealerService.getDealerToUpdate();
          this.updateTitleComponent();
        }else{
          this.disableButtonAdd();
          this.addContainerError();
        }
      }
    }

    setTimeout(()=>{
      //await this time because the btn it's no ready yet
      this.validateIfButtonAddMustVisible();
    },1500);
  }

  ngOnInit(): void {
    this.initComponents();
  }

  initComponents() {
    this.oCountChangesCity = 0;
    this.isToInsert = false;
    this.isAwaiting = false;
    this.oCountBranch = 0;
    this.configureComponentToShowDataBranch();
    this.oContainerFormBranch = document.querySelector("#container__formBranch");
    this.showTableBranchs();

    setTimeout(()=>{
      //await this time because the btn it's no ready yet
      this.validateIfButtonAddMustVisible();
    },1500);
  }

  async showTableBranchs() {
    try {
      this.isAwaiting = true;
      setTimeout(() => {
        if (this.isToClient) {
          this.getListOfBranchByClient();
        }

        if (this.isToDealer) {
          this.getListOfBranchByDealer();
        }
      },1500);
      this.isAwaiting = false;
    } catch (error) {
      alert(error.error.Message);
      console.warn(error.error.Message);
    }
  }

  async getListOfBranchByClient() {

    this.client = this.clientService.getClientToUpdate();
    if (this.client != null) {
      this.updateTitleComponent();

      this.lsBranchs = await this.branchService.getBranchs(this.client.id, "client");

      this.activateButtonAdd();
      this.removeContainerError();
    } else {
      this.disableButtonAdd();
      this.addContainerError();
    }
  }

  async getListOfBranchByDealer() {

    this.dealer = this.dealerService.getDealerToUpdate();
    if (this.dealer != null) {
      this.updateTitleComponent();

      this.lsBranchs = await this.branchService.getBranchs(this.dealer.id, "dealer");

      this.activateButtonAdd();
      this.removeContainerError();
    } else {
      this.disableButtonAdd();
      this.addContainerError();
    }
  }

  activateButtonAdd() {
    try {
      this.btnAddBranch = document.querySelector('#btnAddBranch');
      this.btnAddBranch.disabled = false;
      this.btnAddBranch.classList.remove("error");
    } catch (error) {
      console.warn(error.message);
    }
  }

  removeContainerError(){
    try {
      this.containerErrorBranch = document.querySelector('#cont_error_add_branch');
      this.containerErrorBranch.style.display = 'none';
    } catch (error) {
      console.warn(error.message);
    }
  }

  disableButtonAdd() {
    try {
      this.btnAddBranch = document.querySelector('#btnAddBranch');
      this.btnAddBranch.disabled = true;
      this.btnAddBranch.className += `${this.btnAddBranch.className} error`;
    } catch (error) {
      console.warn(error.message);
    }
  }

  addContainerError(){
    try {
      this.containerErrorBranch = document.querySelector('#cont_error_add_branch');
      this.containerErrorBranch.style.display = 'block';
    } catch (error) {
      console.warn(error.message);
    }
  }

  validateNameOfOwner(): string {
    if (this.client != null) {
      return this.client.name.toLowerCase();
    }
    if (this.dealer != null) {
      return this.dealer.name.toLowerCase();
    }
    return '';
  }

  updateTitleComponent() {
    let titleComp: HTMLElement = document.querySelector("#titleComponentBranch");
    titleComp.innerHTML = `Sucursales de: ${this.validateNameOfOwner()}`
  }

  configureComponentToShowDataBranch() {
    this.oConfigPersonComp = new ConfigPersonComponent();
    this.oConfigPersonComp.nameIsVisible = true;
    this.oConfigPersonComp.phoneIsVisible = true;
    this.oConfigPersonComp.cellphoneIsVisible = true;
    this.oConfigPersonComp.addressIsVisible = true;
    this.oConfigPersonComp.cityIsVisible = true;
  }

  showFormBranch() {
    this.oContainerFormBranch.style.display = 'block';
  }

  hideFormBranch() {
    this.oContainerFormBranch.style.display = 'none';
  }

  insertBranch() {
    this.oPersonToUpdate = null;
    this.isToInsert = true;
    this.oCountBranch += 1;
    this.oCountChangesCity += 1;
    this.personService.setPersonToUpdate(null);
    this.cityService.setSelectedCity(null);
    this.showFormBranch();
  }

  updateContact(pBranch: Branch) {
    this.isToInsert = false;
    this.oCountBranch += 1;
    this.oCountChangesCity += 1;

    this.setDataToUpdatBranch(pBranch);
    this.showFormBranch();
  }


  comeBackToTable() {
    this.hideFormBranch();
    this.oCountChangesCity += 1;
    this.personService.setPersonToUpdate(null);
    this.cityService.setSelectedCity(null);
  }

  async saveBranch() {
    try {
      let oPerson :Person
      oPerson = this.personService.getPerson();
      let oBranch = new Branch();
      oBranch = this.setDataBranch(oPerson);

      if (this.isToClient) {
        oBranch = this.setDataClient_id(oBranch);
      }
      if(this.isToDealer){
        oBranch = this.setDataDealer_id(oBranch);
      }

      if(oBranch != null){
        let rta = await this.saveData(oBranch);
      }

    } catch (err) {
      console.warn(err.error.Message);
      alert(err.error.Message)
    }
  }

  setDataClient_id(pBranch: Branch): Branch {
    if (this.client != null) {
      pBranch.Client_id = this.client.id;
    } else {
      alert("No se puede guardar la sucursal hasta que no se haya guardado los datos básicos del cliente.");
      return null;
    }
    return pBranch;
  }

  setDataDealer_id(pBranch: Branch): Branch {
    if (this.dealer != null) {
      pBranch.Dealer_id = this.dealer.id;
    } else {
      alert("No se puede guardar la sucursal hasta que no se haya guardado los datos básicos del concesionario.");
      return null;
    }
    return pBranch;
  }

  async saveData(pBranch: Branch): Promise<ResponseApi> {
    let rta = new ResponseApi();
    this.isAwaiting = true;
    if (this.isToInsert) {

      //rta = await this.branchService.insert(pBranch);
    } else {

      //rta = await this.branchService.update(pBranch);
    }

    this.isAwaiting = false;
    if (rta.response) {
      alert("Sucursal guardada exitosamente en la base de datos");
      this.comeBackToTable();
      this.showTableBranchs();
      this.cityService.setSelectedCity(null);
    } else {
      alert("Pasó algo");
    }

    return rta;

  }

  setDataBranch(pPerson: Person): Branch {
    let oBranch = new Branch();
    oBranch.id = pPerson.id;
    oBranch.name = pPerson.name;
    oBranch.address = pPerson.address;
    oBranch.phone = pPerson.phone;
    oBranch.cellphone = pPerson.cellphone;
    oBranch.city = pPerson.city;
    return oBranch;
  }

  validateCityName(pCity: City): string {
    if (pCity != null) {
      return pCity.name.toLowerCase();
    }
    return '';
  }

  async deleteBranch(pBranch: Branch) {
    try {
      if (confirm("¿Está seguro que desea eliminar esta sucursal?")) {
        this.isAwaiting = true;
        let rta = await this.branchService.delete(pBranch);
        this.isAwaiting = false;
        if (rta.response) {
          alert(rta.message);
          this.showTableBranchs();
        }
      }
    } catch (err) {
      console.warn(err.error.Message);
      alert(err.error.Message)
    }
  }


  setDataToUpdatBranch(pBranch: Branch) {
    this.oPersonToUpdate.id = pBranch.id;
    this.oPersonToUpdate.name = pBranch.name;
    this.oPersonToUpdate.phone = pBranch.phone;
    this.oPersonToUpdate.cellphone = pBranch.cellphone;
    this.oPersonToUpdate.address = (pBranch.address != null) ? pBranch.address.toLowerCase() : "";
    this.oPersonToUpdate.city = pBranch.city;

    this.personService.setPersonToUpdate(this.oPersonToUpdate);
  }


  getErrorDescription():string{
    if(this.isToClient){
      return 'No se pueden agregar sucursales hasta que se guarde la información básica del cliente';
    }

    if(this.isToDealer){
      return 'No se pueden agregar sucursales hasta que se guarde la información básica del concesionario';
    }
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

    this.validateData();
  }

  validateData(){

    if((this.client != null && this.client != undefined) || ( this.dealer != null && this.dealer != undefined)){

      this.activateButtonAdd();
      this.removeContainerError();
    }else{

      this.disableButtonAdd();
      this.addContainerError();
    }
  }
}
