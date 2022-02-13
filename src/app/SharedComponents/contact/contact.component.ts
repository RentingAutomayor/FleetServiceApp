import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Client } from 'src/app/Models/Client';
import { ConfigPersonComponent } from 'src/app/Models/ConfigPersonComponent';
import { PersonService } from '../Services/Person/person.service';
import { ContactService } from '../Services/Contact/contact.service';

import { Person } from 'src/app/Models/Person';
import { Contact, CreateContactDTO, UpdateContactDTO } from 'src/app/Models/Contact';

import { JobTitle } from 'src/app/Models/JobTitle';
import { JobTitleService } from '../Services/JobTitle/job-title.service';
import { Dealer } from 'src/app/Models/Dealer';

import { ActionType } from 'src/app/Models/ActionType';



@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  isAwaiting: boolean;
  oConfigPersonComp: ConfigPersonComponent;
  oPersonToUpdate: Person;
  isToInsert: boolean;
  btnAddContact: HTMLButtonElement;
  sOwnerName:string;
  titleComponent: string = 'Contactos';
  actionsAreVisible: boolean = true;
  isFormBlocked: boolean = false;
  buttonsAreVisibles: boolean = true;
  //pagination
  p: number = 1;

  @Input() disableActionButtons:boolean;

  buttonAddIsVisible:boolean;
  action: ActionType = ActionType.READ;

  @Input('action')
  set setAction(action: ActionType){
    this.action = action;
    this.validateIfButtonAddMustVisible(this.action)
  }

  lsContacts: Contact[] = [];
  @Input('contacts')
  set setLsContacts(contacts: Contact[]){
    this.lsContacts = contacts
  }

  client: Client;
  @Input('client')
  set setClient(client:Client){
    this.client = client
    if(this.client){
      this.updateTitleComponent();
    }
  }

  dealer:Dealer;
  @Input('dealer')
  set setDealer(dealer: Dealer){
    this.dealer = dealer;
    if(this.dealer){
      this.updateTitleComponent();
    }
  }

  @Output() onContactsWereModified = new EventEmitter<Contact[]>()


  constructor(
    private personService: PersonService,
    private jobtitleService: JobTitleService,

  ) {
    this.sOwnerName="";
    this.disableActionButtons = false;
    this.buttonAddIsVisible = false;

  }

  ngOnInit(): void {
    this.initComponents();
  }

  validateNameOfOwner():string{
    if(this.client != null){
      return this.client.name.toLowerCase();
    }

    if(this.dealer != null){
      return this.dealer.name.toLowerCase();
    }
    return '';
  }

  updateTitleComponent(){
    this.titleComponent = `Contactos de: ${this.validateNameOfOwner()}`
  }

  initComponents() {
    this.isAwaiting = false;
    this.isToInsert = false;
    this.configurePersonComponent();
  }

  activateButtonAdd() {
    try{
      this.btnAddContact = document.querySelector("#btnAddContact");
      this.btnAddContact.disabled = false;
      this.btnAddContact.classList.remove("error");
    }catch(error){
      console.warn(error.message)
    }
  }

  configurePersonComponent() {
    this.oConfigPersonComp = new ConfigPersonComponent();
    this.oConfigPersonComp.nameIsVisible = true;
    this.oConfigPersonComp.lastNameIsVisible = true;
    this.oConfigPersonComp.phoneIsVisible = true;
    this.oConfigPersonComp.cellphoneIsVisible = true;
    this.oConfigPersonComp.emailIsVisible = true;
    this.oConfigPersonComp.websiteIsVisible = false;
    this.oConfigPersonComp.addressIsVisible = true;
    this.oConfigPersonComp.jobTitleIsVisible = true;
  }

  insertContact() {
    this.isToInsert = true;
    this.oPersonToUpdate = null;
    this.isFormBlocked = false;
    this.showPopUp();
  }

  getDetailsOfContant(contactId:number){
    this.oPersonToUpdate  = this.lsContacts.find(contact => contact.id === contactId);
    this.isFormBlocked = true;
    this.showPopUp();
  }

  updateContact(contactId:number) {
    this.isToInsert = false;
    this.oPersonToUpdate  = this.lsContacts.find(contact => contact.id === contactId);
    this.isFormBlocked = false;
    this.showPopUp();
  }

  showPopUp() {
    let containerForm = document.getElementById("container__formContact");
    containerForm.setAttribute("style", "display:block");
  }

  hidePopUp() {
    let containerForm = document.getElementById("container__formContact");
    containerForm.setAttribute("style", "display:none");
  }

  saveContact() {
    try {
      let oPerson = this.personService.getPerson();
      let oContact = null
      if(this.isToInsert){
        oContact = this.setDataToContact(oPerson);
        oContact.id = 0;
      }else{
        oContact = this.setDataToContact(oPerson);
        oContact.id = oPerson.id;
      }

      if(oContact != null){
        this.saveData(oContact);
      }

    } catch (err) {
      console.error(err.error.Message);
      alert(err.error.Message)
    }

  }

  saveData(oContact: Contact){
    this.isAwaiting = true;
    if (this.isToInsert) {
      this.lsContacts.unshift(oContact);
      this.hidePopUp();
      this.isAwaiting = false;
    } else {
      const contactIndex = this.lsContacts.findIndex(cnt => cnt.id == oContact.id)
      this.lsContacts[contactIndex] = oContact;
      this.hidePopUp();
      this.isAwaiting =false;
    }
    this.onContactsWereModified.emit(this.lsContacts)

  }

  deleteContact(pContact: Contact) {
    try {
      if (confirm("¿Está seguro que desea eliminar este contacto?")) {
        this.isAwaiting = true;
        const contactIndex = this.lsContacts.findIndex(cnt => cnt.id == pContact.id)
        this.lsContacts.splice(contactIndex,1);
        this.isAwaiting = false;
        this.onContactsWereModified.emit(this.lsContacts)
      }
    } catch (err) {
      console.error(err.error.Message);
      alert(err.error.Message)
    }
  }

  setDataToContact(oPerson: Person): CreateContactDTO {
    let oContact = {} as CreateContactDTO
    oContact.name = oPerson.name;
    oContact.lastname = oPerson.lastname;
    oContact.phone = oPerson.phone;
    oContact.cellphone = oPerson.cellphone;
    oContact.email = oPerson.email;
    oContact.address = oPerson.address;
    oContact.jobTitle = oPerson.jobTitle;
    oContact.city = oPerson.city;
    oContact.Dealer_id = (this.dealer != null)?this.dealer.id:null;
    oContact.Client_id = (this.client != null)?this.client.id:null;
    return oContact;
  }

  validateJobTitle(pJobTitle: JobTitle): string {
    if (pJobTitle != null) {
      return pJobTitle.description;
    }
    return "";
  }

  comeBackToTable() {
    this.hidePopUp();
  }

  validateIfButtonAddMustVisible(action: ActionType){
    switch(action){
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
    }
  }
}
