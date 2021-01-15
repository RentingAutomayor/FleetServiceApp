import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Client } from 'src/app/Models/Client';
import { ConfigPersonComponent } from 'src/app/Models/ConfigPersonComponent';
import { PersonService } from '../Services/Person/person.service';
import { ContactService } from '../Services/Contact/contact.service';
import { ClientService } from 'src/app/Modules/client/Services/Client/client.service';
import { Person } from 'src/app/Models/Person';
import { Contact } from 'src/app/Models/Contact';
import { ResponseApi } from 'src/app/Models/ResponseAPI';
import { JobTitle } from 'src/app/Models/JobTitle';
import { JobTitleService } from '../Services/JobTitle/job-title.service';
import { Dealer } from 'src/app/Models/Dealer';
import { DealerService } from '../../Modules/dealer/Services/Dealer/dealer.service';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnChanges {
  isAwaiting: boolean;
  lsContacts: Contact[];
  oConfigPersonComp: ConfigPersonComponent;
  client: Client;
  dealer:Dealer;
  oCountContact: number;
  oPersonToUpdate: Person;
  isToInsert: boolean;
  btnAddContact: HTMLButtonElement;
  containerErrorAdd: HTMLElement;
  sOwnerName:string;

  //pagination
  p: number = 1;
  @Input() isToClient: boolean;
  @Input() isToDealer: boolean;
  @Input() clientWasSaved: boolean;
  @Input() dealerWasSaved: boolean;
  

  constructor(
    private personService: PersonService,
    private contactService: ContactService,
    private clientService: ClientService,
    private jobtitleService: JobTitleService,
    private dealerService: DealerService
  ) {
    this.sOwnerName="";
  }

  ngOnInit(): void {
    this.initComponents();
  }

  ngOnChanges(changes: SimpleChanges) {
    
    for (let change in changes) {
      if (change == "clientWasSaved") {
        //console.log("[clientWasSaved]: ", changes["clientWasSaved"].currentValue)
        if (changes["clientWasSaved"].currentValue == true) {
          //console.log("Se ha guardado el cliente ...");
          this.activateButtonAdd();
          this.client = this.clientService.getClientToUpdate();  
          this.updateTitleComponent();        
        }
      }

      if (change == "dealerWasSaved") {
        console.log("[dealerWasSaved]: ", changes["dealerWasSaved"].currentValue)
        if (changes["dealerWasSaved"].currentValue == true) {
          console.log("Se ha guardado el concesionario ...");
          this.activateButtonAdd();
          this.dealer = this.dealerService.getDealerToUpdate();  
          this.updateTitleComponent();        
        }
      }
    }
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
    let titleComp:HTMLElement = document.querySelector("#titleComponent");
    titleComp.innerHTML = `Contactos de: ${this.validateNameOfOwner()}`
  }

  initComponents() {    
    this.btnAddContact = document.querySelector("#btnAddContact");
    this.containerErrorAdd = document.querySelector("#cont_error_add_contact")
    this.isAwaiting = false;
    this.isToInsert = false;
    this.oCountContact = 0;
    this.showTableContacts();
    this.configurePersonComponent();
  }

  async showTableContacts() { 
    if (this.isToClient) {
      this.getListOfContactsByClient();
    }
    if(this.isToDealer){
      this.getListOfContactsByDealer();
    }   
  }

  async getListOfContactsByClient(){
    console.log("Validando configuración para clientes");
    this.client = this.clientService.getClientToUpdate();
    if (this.client != null) {
      this.updateTitleComponent();
      console.log("validando contactos para el cliente: " + this.client.name);
      this.lsContacts = await this.contactService.getContacts(this.client.id, "client");
      console.log(this.lsContacts);
      this.activateButtonAdd();
    } else {
      this.disableButtonAdd();
    }
  }

  async getListOfContactsByDealer(){
    console.log("Validando configuración para concesionarios");
    this.dealer = this.dealerService.getDealerToUpdate();
    if(this.dealer != null){
      this.updateTitleComponent();
      console.log("validando contactos para el concesionario: " + this.dealer.name);
      this.lsContacts = await this.contactService.getContacts(this.dealer.id, "dealer");
      console.log(this.lsContacts);
      this.activateButtonAdd();
    } else {
      this.disableButtonAdd();
    }
  }

  activateButtonAdd() {
    this.btnAddContact.disabled = false;
    this.btnAddContact.classList.remove("error");
    this.containerErrorAdd.style.display = 'none';
  }

  disableButtonAdd() {
    this.btnAddContact.disabled = true;
    this.btnAddContact.className += `${this.btnAddContact.className} error`;
    this.containerErrorAdd.style.display = 'block';
  }

  configurePersonComponent() {
    this.oConfigPersonComp = new ConfigPersonComponent();
    this.oConfigPersonComp.nameIsVisible = true;
    this.oConfigPersonComp.lastNameIsVisible = true;
    this.oConfigPersonComp.phoneIsVisible = true;
    this.oConfigPersonComp.cellphoneIsVisible = true;
    this.oConfigPersonComp.emailIsVisible = true;
    this.oConfigPersonComp.addressIsVisible = true;
    this.oConfigPersonComp.jobTitleIsVisible = true;

  }

  insertContact() {
    this.isToInsert = true;
    this.oCountContact += 1;
    this.personService.setPersonToUpdate(null);
    this.jobtitleService.setJobTitleSelected(null);
    this.showPopUp();
  }

  updateContact(pContact: Contact) {
    this.isToInsert = false;
    this.oCountContact += 1;
    console.log("[contact component]:");
    console.log(pContact);
    this.setDataToUpdatContact(pContact);
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

  async saveContact() {
    try {
      let oPerson = new Person();
      oPerson = this.personService.getPerson();
      let oContact = new Contact();
      oContact = this.setDataContact(oPerson);

      if (this.isToClient) {
        oContact = this.setDataClient_id(oContact);
      }

      if (this.isToDealer) {
        oContact = this.setDataDealer_id(oContact);
      }

      if(oContact != null){
        let rta = await this.saveData(oContact);
      }      

    } catch (err) {
      console.error(err.error.Message);
      alert(err.error.Message)
    }

  }

  setDataClient_id(oContact:Contact):Contact{    
    if (this.client != null) {
      oContact.Client_id = this.client.id;     
    } else {
      alert("No se puede guardar contacto hasta que no se haya guardado los datos básicos del cliente.");
      return null;
    } 
    return oContact;
  }

  setDataDealer_id(oContact:Contact): Contact{
    if (this.dealer != null) {
      oContact.Dealer_id = this.dealer.id;     
    } else {
      alert("No se puede guardar contacto hasta que no se haya guardado los datos básicos del concesionario.");
      return null;
    } 
    return oContact; 
  }

  async saveData(oContact: Contact):Promise<ResponseApi>{
    let rta = new ResponseApi();
    this.isAwaiting = true;
    if (this.isToInsert) {
      console.warn("[Contacto para insertar] : ", oContact);
      rta = await this.contactService.insert(oContact);
    } else {
      console.warn("[Contacto para update] : ", oContact);
      rta = await this.contactService.update(oContact);
    }
    this.isAwaiting = false;
    if (rta.response) {
      alert("Contacto guardado exitosamente en la base de datos");
      this.hidePopUp();
      this.showTableContacts();
    } else {
      alert("Pasó algo");
    }
    
    return rta;
      
  }

  setDataContact(oPerson: Person): Contact {
    let oContact = new Contact();
    oContact.id = oPerson.id;
    oContact.name = oPerson.name;
    oContact.lastname = oPerson.lastname;
    oContact.phone = oPerson.phone;
    oContact.cellphone = oPerson.cellphone;
    oContact.email = oPerson.email;
    oContact.address = oPerson.address;
    oContact.jobTitle = oPerson.jobTitle;
    oContact.city = oPerson.city;
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

  async deleteContact(pContact: Contact) {
    try {
      if (confirm("¿Está seguro que desea eliminar este contacto?")) {
        this.isAwaiting = true;
        let rta = await this.contactService.delete(pContact);
        this.isAwaiting = false;
        if (rta.response) {
          alert(rta.message);
          this.showTableContacts();
        }
      }
    } catch (err) {
      console.error(err.error.Message);
      alert(err.error.Message)
    }
  }


  setDataToUpdatContact(pContact: Contact) {
    this.oPersonToUpdate = new Person();
    this.oPersonToUpdate.id = pContact.id;
    this.oPersonToUpdate.document = "0";
    this.oPersonToUpdate.name = pContact.name;
    this.oPersonToUpdate.lastname = pContact.lastname;
    this.oPersonToUpdate.phone = pContact.phone;
    this.oPersonToUpdate.cellphone = pContact.cellphone;
    this.oPersonToUpdate.email = pContact.email;
    this.oPersonToUpdate.address = (pContact.address != null) ? pContact.address.toLowerCase() : "";
    this.oPersonToUpdate.website = (pContact.website != null) ? pContact.website.toLowerCase() : "";
    this.oPersonToUpdate.city = pContact.city;
    this.oPersonToUpdate.jobTitle = pContact.jobTitle;
    console.log("[Person component setted person]");
    this.personService.setPersonToUpdate(this.oPersonToUpdate);
    this.jobtitleService.setJobTitleSelected(pContact.jobTitle);
  }

  getErrorDescription():string{
    if(this.isToClient){
      return 'No se pueden agregar contactos hasta que se guarde la información básica del cliente';
    }

    if(this.isToDealer){
      return 'No se pueden agregar contactos hasta que se guarde la información básica del concesionario';
    }
  }
}
