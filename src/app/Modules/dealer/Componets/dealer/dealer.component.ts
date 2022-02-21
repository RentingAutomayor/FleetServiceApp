import { Component, Input, OnInit, ViewChild, } from '@angular/core';
import { ConfigPersonComponent } from 'src/app/Models/ConfigPersonComponent';
import { Dealer, DealerDTO } from 'src/app/Models/Dealer';
import { Person } from 'src/app/Models/Person';
import { ResponseApi } from '../../../../Models/ResponseApi';
import { DealerService } from '../../Services/Dealer/dealer.service';
import { PersonService } from '../../../../SharedComponents/Services/Person/person.service';
import { Router , ActivatedRoute} from '@angular/router';
import { ActionType } from 'src/app/Models/ActionType';
import { NavigationService } from 'src/app/SharedComponents/Services/navigation.service';
import { MatVerticalStepper, MatStep } from '@angular/material/stepper'
import { Contact } from 'src/app/Models/Contact';
import { Branch } from 'src/app/Models/Branch';
import { getFromStorage } from 'src/app/Utils/storage';

@Component({
  selector: 'app-dealer',
  templateUrl: './dealer.component.html',
  styleUrls: ['./dealer.component.scss']
})
export class DealerComponent implements OnInit {
  oConfigPersonComp: ConfigPersonComponent;
  isAwaiting: boolean;

  sReturnPath: string;

  oDealerToUpdate: Dealer;

  errorMessage: string;
  bFormHasError: boolean;
  oIsToDealer: boolean;
  oDealerWasSaved: boolean;
  action: ActionType;

  //ft-0202
  lsContacts: Contact[] = [];
  lsBranches: Branch[] = [];
  dealerID: string = '';
  blockFormDealer: boolean = false;

  @ViewChild(MatVerticalStepper)
  stepper: MatVerticalStepper;

  constructor(
    private dealerService: DealerService,
    private personService: PersonService,
    private navigationService: NavigationService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {
    this.sReturnPath = '/MasterDealers';
    this.oIsToDealer = true;
   }



  ngOnInit(): void {
    this.action = parseInt(getFromStorage('actionToPerform'));
    this.validateActionToDo(this.action);
    this.initComponents();
    this.extractDataFromParams();

  }

  initComponents() {
    this.configurePersonComponent();
    this.isAwaiting = false;

    this.errorMessage = '';
    this.bFormHasError = false;
    this.oDealerWasSaved = false;
  }

  extractDataFromParams(): void{
    this.isAwaiting = true;
    this.activeRoute.paramMap
    .subscribe(params => {
      this.dealerID = params.get('id');
      if (this.dealerID){
        this.dealerService.getDealerById(parseInt(this.dealerID))
        .subscribe(dealer =>{
          this.oDealerToUpdate = dealer;
          this.lsContacts = dealer.contacts;
          this.lsBranches = dealer.branches;
        });
      }else{
        this.oDealerToUpdate = {
          id: 0,
          document: '',
          name: '',
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
          contacts: [],
          branches: [],
          state: false,
          registrationDate: null,
          updateDate: null,
          deleteDate: null,
        }
      }

      this.isAwaiting = false;
    });
  }
  validateActionToDo(action: ActionType): void {
    if (action == ActionType.READ){
      this.blockFormDealer = true;
      //this.isButtonSaveClientVisible = false;
    }else{
      this.blockFormDealer = false;
      //this.isButtonSaveClientVisible = true;
    }
  }



  configurePersonComponent(): void {
    this.oConfigPersonComp = new ConfigPersonComponent();
    this.oConfigPersonComp.documentIsVisible = true;
    this.oConfigPersonComp.nameIsVisible = true;
  }



  async saveDealer(pDealer: DealerDTO) {
    //try {
      // pDealer = this.personService.getPerson();
      // let rta = new ResponseApi();
      // this.isAwaiting = true;
      // if (this.oDataIsToUpdate) {
      //   rta = await this.dealerService.updateDealer(pDealer);
      // } else {
      //   rta = await this.dealerService.insertDealer(pDealer);
      // }
      // this.isAwaiting = false;

      // if (rta.response){
      //   alert(rta.message);
      //   const dealerTmp = await this.dealerService.getDealersByDocument(pDealer.document);
      //   this.dealerService.setDealerToUpdate(dealerTmp);
      //   this.oDealerWasSaved = true;
      // }
    // } catch (err) {
    //   console.warn(err.error.Message);
    //   this.bFormHasError = true;
    //   this.errorMessage = err.error.Message;
    //   this.isAwaiting = false;
    // }
  }



  setDataToUpdateDealer(pDealer: Dealer){
    // this.oPersonToUpdate.id = pDealer.id;
    // this.oPersonToUpdate.document = pDealer.document;
    // this.oPersonToUpdate.name = pDealer.name.toLocaleLowerCase();
  }

  setDataInForm(dealer: Dealer){
   //this.oPersonToUpdate = dealer;
  }

  returnToTable(){
    this.router.navigate([this.sReturnPath]);
  }

  updateContactsToDealer(contacts: Contact[]){
    this.lsContacts = contacts;
  }

  updateBranchesToDealer(branches: Branch[]){
    this.lsBranches = branches;
  }

  SetDataToSaveDealer(){}

  async setPersonInfo() {
    this.oDealerToUpdate =  this.personService.getPerson();
    //this.isBasicDataCompleted = true;
    await setTimeout(() => {
      this.stepper.next();
    }, 100);
  }


}
