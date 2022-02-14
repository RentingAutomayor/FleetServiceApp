import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Branch } from 'src/app/Models/Branch';
import { City } from 'src/app/Models/City';
import { Client } from 'src/app/Models/Client';
import { ConfigPersonComponent } from 'src/app/Models/ConfigPersonComponent';
import { Person } from 'src/app/Models/Person';
import { PersonService } from '../Services/Person/person.service';
import { Dealer } from 'src/app/Models/Dealer';
import { ActionType } from 'src/app/Models/ActionType';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss']
})
export class BranchComponent implements OnInit {
  oConfigPersonComp: ConfigPersonComponent;
  oContainerFormBranch: HTMLElement;
  btnAddContact: HTMLButtonElement;
  // pagination
  p = 1;
  isAwaiting: boolean;
  isToInsert: boolean;
  btnAddBranch: HTMLButtonElement;
  containerErrorBranch: HTMLElement;
  oPersonToUpdate: Person;
  @Input()disableActionButtons: boolean;

  buttonAddIsVisible: boolean;

  client: Client;
  @Input('client')
  set setClient(client: Client){
    this.client = client;
  }

  dealer: Dealer;
  @Input('dealer')
  set setDealer(dealer: Dealer){
    this.dealer = dealer;
  }

  lsBranchs: Branch[];
  @Input('branchs')
  set setLsBranchs(branchs: Branch[]){
    this.lsBranchs = branchs;
  }

  action: ActionType;
  @Input('action')
  set setAction(action: ActionType){
    this.action = action;
    this.validateIfButtonAddMustVisible(this.action);
  }

  buttonsAreVisibles = true;
  isFormBlocked = false;
  idTemp: number = 0;

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onBranchsWereModified = new EventEmitter<Branch[]>();


  constructor(
    private personService: PersonService
  ) {
    this.lsBranchs = [];
    this.disableActionButtons = false;
    this.buttonAddIsVisible = false;
  }

  ngOnInit(): void {
    this.initComponents();
  }

  initComponents() {
    this.configureComponentToShowDataBranch();
    this.isToInsert = false;
    this.isAwaiting = false;
  }

  configureComponentToShowDataBranch() {
    this.oConfigPersonComp = new ConfigPersonComponent();
    this.oConfigPersonComp.nameIsVisible = true;
    this.oConfigPersonComp.phoneIsVisible = true;
    this.oConfigPersonComp.cellphoneIsVisible = true;
    this.oConfigPersonComp.addressIsVisible = true;
    this.oConfigPersonComp.cityIsVisible = true;
  }

  showPopUp() {
    const containerForm = document.getElementById('container__formBranch');
    containerForm.setAttribute('style', 'display:block');
  }

  hidePopUp() {
    const containerForm = document.getElementById('container__formBranch');
    containerForm.setAttribute('style', 'display:none');
  }

  insertBranch() {
    this.oPersonToUpdate = null;
    this.isToInsert = true;
    this.isFormBlocked = false;
    this.showPopUp();
  }

  getDetailsOfBranch(branchId: number){
    this.isToInsert = false;
    this.oPersonToUpdate = this.lsBranchs.find(branch => branch.id == branchId);
    this.isFormBlocked = true;
    this.showPopUp();
  }

  updateBranch(branchId: number) {
    this.isToInsert = false;
    this.oPersonToUpdate = this.lsBranchs.find(branch => branch.id == branchId);
    this.isFormBlocked = false;
    this.showPopUp();
  }

  comeBackToTable() {
    this.hidePopUp();
  }

  saveBranch() {
    try {
      let oPerson: Person;
      oPerson = this.personService.getPerson();
      const oBranch = this.setDataBranch(oPerson);
      if (this.isToInsert){
        oBranch.id = this.idTemp;
        this.idTemp--;
      }else{
        oBranch.id = oPerson.id;
      }

      if (oBranch != null){
        this.saveData(oBranch);
      }
    } catch (err) {
      console.warn(err.error.Message);
      alert(err.error.Message);
    }
  }

  saveData(branch: Branch){
    this.isAwaiting = true;
    if (this.isToInsert) {
      this.lsBranchs.unshift(branch);
    } else {
      const branchIndex = this.lsBranchs.findIndex(br => br.id == branch.id);
      this.lsBranchs[branchIndex] = branch;
    }
    this.isAwaiting = false;
    this.hidePopUp();
    this.onBranchsWereModified.emit(this.lsBranchs);
  }

  deleteBranch(branchId: number) {
    try {
      if (confirm('¿Está seguro que desea eliminar esta sucursal?')) {
        this.isAwaiting = true;
        const branchIndex = this.lsBranchs.findIndex(branch => branch.id == branchId);
        this.lsBranchs.splice(branchIndex, 1);
        this.isAwaiting = false;
        this.onBranchsWereModified.emit(this.lsBranchs);
      }
    } catch (err) {
      console.warn(err.error.Message);
      alert(err.error.Message);
    }
  }

  setDataBranch(pPerson: Person): Branch {
    const oBranch = new Branch();
    oBranch.id = pPerson.id;
    oBranch.name = pPerson.name;
    oBranch.address = pPerson.address;
    oBranch.phone = pPerson.phone;
    oBranch.cellphone = pPerson.cellphone;
    oBranch.city = pPerson.city;
    oBranch.Dealer_id = (this.dealer != null) ? this.dealer.id : null;
    oBranch.Client_id = (this.client != null) ? this.client.id : null;
    return oBranch;
  }

  validateCityName(pCity: City): string {
    if (pCity != null) {
      return pCity.name.toLowerCase();
    }
    return '';
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

    this.validateData();
  }

  validateData(){
    if ((this.client != null && this.client != undefined) || ( this.dealer != null && this.dealer != undefined)){
      this.activateButtonAdd();
    }
  }

  activateButtonAdd() {
    try{
      this.btnAddContact = document.querySelector('#btnAddContact');
      this.btnAddContact.disabled = false;
      this.btnAddContact.classList.remove('error');
    }catch (error){
      console.warn(error.message);
    }
  }
}
