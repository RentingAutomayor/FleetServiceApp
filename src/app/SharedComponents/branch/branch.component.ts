import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Branch } from 'src/app/Models/Branch';
import { City } from 'src/app/Models/City';
import { Client } from 'src/app/Models/Client';
import { ConfigPersonComponent } from 'src/app/Models/ConfigPersonComponent';
import { Person } from 'src/app/Models/Person';
import { PersonService } from '../Services/Person/person.service';
import { Dealer } from 'src/app/Models/Dealer';
import { ActionType } from 'src/app/Models/ActionType';
import { BranchService } from '../Services/Branch/branch.service';

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
  branchToUpdate: Person = null;
  @Input()disableActionButtons: boolean;

  buttonAddIsVisible: boolean;

  client: Client = null;
  @Input('client')
  set setClient(client: Client){
    this.client = client;
  }

  dealer: Dealer = null;
  @Input('dealer')
  set setDealer(dealer: Dealer){
    this.dealer = dealer;
  }

  lsBranchs: Branch[] = [];
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
  isErrorVisible: boolean = false;
  errorTitle: string = '';
  errorMessageApi: string = '';
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onBranchsWereModified = new EventEmitter<Branch[]>();


  constructor(
    private personService: PersonService,
    private branchService: BranchService
  ) {
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
    this.isErrorVisible = false;
    this.errorTitle = '';
    this.errorMessageApi = '';
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
    this.branchToUpdate = null;
    this.isToInsert = true;
    this.isFormBlocked = false;
    this.showPopUp();
  }

  getDetailsOfBranch(branchId: number){
    this.isToInsert = false;
    this.branchToUpdate = this.lsBranchs.find(branch => branch.id == branchId);
    console.log('getDetailsOfBranch');
    console.log(this.branchToUpdate);
    this.isFormBlocked = true;
    this.showPopUp();
  }

  updateBranch(branchId: number) {
    this.isToInsert = false;
    this.branchToUpdate = this.lsBranchs.find(branch => branch.id == branchId);
    this.isFormBlocked = false;
    this.showPopUp();
  }

  comeBackToTable() {
    this.branchToUpdate = null;
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
    const branchDB = this.completeBranchInformationWithOwner(branch);
    if (this.isToInsert) {
      if (branchDB.Client_id == 0 || branchDB.Dealer_id == 0){
        this.lsBranchs.unshift(branchDB);
      }else{
        this.isAwaiting = true;
        this.branchService.insert(branchDB)
        .subscribe(newBranch => {
          this.lsBranchs.unshift(newBranch);
          this.isAwaiting = false;
        }, err =>{
          this.isErrorVisible = true;
          this.isAwaiting = false;
          this.errorTitle = 'Ocurrió un error intentando Insertar la sucursal';
          this.errorMessageApi = err.error.Message;
        });
      }
    } else {
      if (branchDB.Client_id == 0|| branchDB.Dealer_id == 0){
        const branchIndex = this.lsBranchs.findIndex(br => br.id == branch.id);
        this.lsBranchs[branchIndex] = branch;
      }else{
        this.isAwaiting = true;
        this.branchService.update(branchDB)
        .subscribe(branchUpdated => {
          const branchIndex = this.lsBranchs.findIndex(br => br.id == branch.id);
          this.lsBranchs[branchIndex] = branchUpdated;
          this.isAwaiting = false;
        }, err =>{
          this.isErrorVisible = true;
          this.isAwaiting = false;
          this.errorTitle = 'Ocurrió un error intentando Actualizar la sucursal';
          this.errorMessageApi = err.error.Message;
        });
      }
    }
    this.hidePopUp();
    this.onBranchsWereModified.emit(this.lsBranchs);
  }

  deleteBranch(branchId: number) {
    try {
      if (confirm('¿Está seguro que desea eliminar esta sucursal?')) {
        this.isAwaiting = true;
        const branchTmp= this.lsBranchs.find(branch => branch.id == branchId);
        const branchToDelete = this.completeBranchInformationWithOwner(branchTmp)
        if (branchToDelete.Client_id == 0 || branchToDelete.Dealer_id == 0){
          const branchIndex = this.lsBranchs.findIndex(branch => branch.id == branchId);
          this.lsBranchs.splice(branchIndex, 1);
        }else{
          this.branchService.delete(branchToDelete)
          .subscribe(rta => {
            const branchIndex = this.lsBranchs.findIndex(branch => branch.id == branchId);
            this.lsBranchs.splice(branchIndex, 1);
            this.isAwaiting = false;
          }, err =>{
            this.isErrorVisible = true;
            this.isAwaiting = false;
            this.errorTitle = 'Ocurrió un error intentando Eliminar la sucursal';
            this.errorMessageApi = err.error.Message;
          });
        }
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
    return oBranch;
  }


  completeBranchInformationWithOwner(branch: Branch): Branch {
    if(this.client != null){
      branch.Client_id = this.client.id;
    }

    if(this.dealer != null){
      branch.Dealer_id = this.dealer.id;
    }

    return branch;
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

  closeErrorMessage(){
    this.isErrorVisible = false;
  }
}
