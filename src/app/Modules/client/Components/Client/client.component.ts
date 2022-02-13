import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Client } from 'src/app/Models/Client';
import { ConfigPersonComponent } from 'src/app/Models/ConfigPersonComponent';
import { PersonService } from '../../../../SharedComponents/Services/Person/person.service';
import { ClientService } from '../../Services/Client/client.service';
import { ResponseApi } from 'src/app/Models/ResponseApi';
import { Person } from 'src/app/Models/Person';
import { ActivatedRoute } from '@angular/router';
import { CityService } from '../../../../SharedComponents/Services/City/city.service';
import { ActionType } from 'src/app/Models/ActionType';
import { Contact } from 'src/app/Models/Contact';
import { getFromStorage } from 'src/app/Utils/storage';
import { Branch } from 'src/app/Models/Branch';



@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {
  oConfigPersonComp: ConfigPersonComponent;
  bFormHasError: boolean;
  errorMessage: string;
  isAwaiting: boolean;
  oPersonToUpdate: Person;
  areVisibleButtonsForBasicData = false;
  client: Client = {
    id : 0,
    document: '',
    name: '',
    lastname: '',
    phone: '',
    cellphone: '',
    address: '',
    email: '',
    website: '',
    city: {
      id: 0,
      name : '',
      departmentId: 0,
      state: false
    },
    jobTitle: {
      id: 0,
      description: '',
      state: false
    },
    state: false,
    registrationDate: null,
    updateDate: null,
    deleteDate: null,
    contacts: [],
    branchs: []
  };
  lsContacts: Contact[] = [];
  lsBranchs: Branch[] = [];
  oDataIsToUpdate: boolean;
  sReturnPath: string;
  ROUTE_MASTER_CLIENT = '/MasterClients';
  oIsToClient: boolean;
  oClientWasSaved: boolean;
  blockFormClient = false;
  action: ActionType;
  // Refactor component
  clientID: string;
  getPersonInfo = false;

  constructor(
    private personService: PersonService,
    private ClientService: ClientService,
    private cityService: CityService,
    private router: ActivatedRoute,

  ) {
    this.client;
    this.bFormHasError = false;
    this.errorMessage = '';
    this.isAwaiting = false;
    this.oDataIsToUpdate = false;
    this.oIsToClient = true;
    this.oClientWasSaved = false;
    this.sReturnPath = this.ROUTE_MASTER_CLIENT;

  }

  ngOnInit(): void {
    this.initComponents();
    this.configurePersonComponent();
    this.extractDataFromParams();

  }

  extractDataFromParams(){
    this.isAwaiting = true;
    this.router.paramMap
    .subscribe(params => {
      this.clientID = params.get('id');
      if (this.clientID){
        this.ClientService.getClientById(parseInt(this.clientID))
        .then(client => {
          if (client != null){
            this.client = client;
            this.lsContacts = this.client.contacts;
            this.lsBranchs = this.client.branchs;
            this.oDataIsToUpdate = true;
          }
        });
      }else{
        this.client = null;
        this.oDataIsToUpdate = false;
      }
    });
    this.isAwaiting = false;
  }

  initComponents(){
    // this.hideContainerTabs();
    const actionToPerform = getFromStorage('actionToPerform');
    this.action = parseInt(actionToPerform);
    this.validateActionToDo(this.action);
  }

  validateActionToDo(action: ActionType){
    if (action === ActionType.READ){
      this.blockFormClient = true;
    }else{
      this.blockFormClient = false;
    }
  }

  configurePersonComponent(){
    this.oConfigPersonComp = new ConfigPersonComponent();
    this.oConfigPersonComp.documentIsVisible = true;
    this.oConfigPersonComp.nameIsVisible = true;
    this.oConfigPersonComp.phoneIsVisible = true;
    this.oConfigPersonComp.cellphoneIsVisible = true;
    this.oConfigPersonComp.addressIsVisible = true;
    this.oConfigPersonComp.websiteIsVisible = true;
    this.oConfigPersonComp.cityIsVisible = true;
  }

  async SetDataToSaveClient(){
    this.isAwaiting = true;
    try{
      const oClient =  this.personService.getPerson();
      const rta = new ResponseApi();

      if (this.oDataIsToUpdate){
       // rta = await this.ClientService.updateClient(oClient);
        this.cityService.setSelectedCity(null);
      }else{
       // rta = await this.ClientService.insertClient(oClient);
      }

      if (rta.response){
        alert(rta.message);
        const clientTmp = await this.ClientService.getClientByDocument(oClient.document);
        this.ClientService.setClientToUpdate(clientTmp);
        this.oClientWasSaved = true;

      }
    }catch (err){
      this.bFormHasError = true;
      this.errorMessage = err.error.Message;
    }
    this.isAwaiting = false;
  }


  openTab(oButton: any, container: string){
    const tabLinks = document.getElementsByClassName('tab_link');

    for (let i = 0 ; i < tabLinks.length; i ++){
      tabLinks[i].classList.remove('active');
    }
    oButton.target.className += ' active';
    const containerTabs = document.getElementsByClassName('tab_content');

    for (let i = 0 ; i < containerTabs.length; i ++){
      containerTabs[i].setAttribute('style', 'display:none');
    }

    const containerToShow_id = `container__${container}`;
    const containerToShow = document.getElementById(containerToShow_id);

    containerToShow.setAttribute('style', 'display:blick');
  }

  hideContainerTabs(){
    const containers = document.getElementsByClassName('tab_inactive');
    for (let i = 0 ; i < containers.length; i ++){
      containers[i].setAttribute('style', 'display:none');
    }
  }


  moveContent(event: any){
    const containerContent: HTMLDivElement  = document.querySelector('#container__content');

    if (event){
      containerContent.style.marginLeft = '250px';
    }else{
      containerContent.style.marginLeft = '60px';
    }

  }

  updateContactsToClient(contacts: Contact[]){
    this.client.contacts = contacts;
  }

  updateBranchsToClient(branchs: Branch[]){
    this.client.branchs = branchs;
  }

  getPersonInformation(){
    this.getPersonInfo = true;
  }

  nextStepBasicData(){
    const btnNextStep = document.getElementById('btn-next-step-basic-data');
    btnNextStep.click();
  }

}
