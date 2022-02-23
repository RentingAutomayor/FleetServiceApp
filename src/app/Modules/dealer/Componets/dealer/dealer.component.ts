import { Component, Input, OnInit, ViewChild, } from '@angular/core';
import { ConfigPersonComponent } from 'src/app/Models/ConfigPersonComponent';
import { Dealer, DealerDTO } from 'src/app/Models/Dealer';
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
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem';


@Component({
  selector: 'app-dealer',
  templateUrl: './dealer.component.html',
  styleUrls: ['./dealer.component.scss']
})
export class DealerComponent implements OnInit {
  oConfigPersonComp: ConfigPersonComponent;
  isAwaiting: boolean = true;
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
  lsMaintenanceItems: MaintenanceItem[] = [];
  dealerID: string = '';
  blockFormDealer: boolean = false;

  @ViewChild(MatVerticalStepper)
  stepper: MatVerticalStepper;

  isErrorVisible: boolean = false;
  errorTitle: string = '';
  errorMessageApi: string = '';

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
          this.lsMaintenanceItems = dealer.maintenanceItems;
          this.isAwaiting = false;
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

        this.lsContacts = [];
        this.lsBranches = [];
        this.lsMaintenanceItems = [];
        this.isAwaiting = false;
      }


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

  updateContactsToDealer(contacts: Contact[]){
    this.lsContacts = contacts;
  }

  updateBranchesToDealer(branches: Branch[]){
    this.lsBranches = branches;
  }

  setMaintenanceItemsByDealer(maintenanceItems: MaintenanceItem[]){
    this.lsMaintenanceItems = maintenanceItems;
  }

  async setPersonInfo() {
    this.oDealerToUpdate =  this.personService.getPerson();
    //this.isBasicDataCompleted = true;
    await setTimeout(() => {
      this.stepper.next();
    }, 100);
  }


  comeBack(): void{
    if(this.action == ActionType.READ){
      this.router.navigate([this.sReturnPath]);
    }else{
      if ( confirm('¿Está seguro que desea regresar? , al hacerlo perderá los cambios consignados acá.') ){
        this.router.navigate([this.sReturnPath]);
      }
    }
  }

  saveDealer(){
    this.isAwaiting = true;
    const dealer = this.oDealerToUpdate;
    dealer.contacts = this.lsContacts;
    dealer.branches = this.lsBranches;
    dealer.maintenanceItems = this.lsMaintenanceItems;
    if(this.action == ActionType.CREATE){
      this.dealerService.insertDealer(dealer)
      .subscribe(newDealer => {
        alert(`El concesionario ha sido insertado de manera correcta en la base de datos`);
        this.isAwaiting = false;
        this.router.navigate([this.sReturnPath]);
      }, err => {
        this.isErrorVisible = true;
        this.isAwaiting = false;
        this.errorTitle = 'Ocurrió un error intentando Insertar el concesionario';
        this.errorMessageApi = err.error.Message;
      });
    }else if (this.action == ActionType.UPDATE){
      this.dealerService.updateDealer(dealer)
      .subscribe(dealerUpdated => {
        alert(`El concesionario ha sido actualizado de manera correcta`);
        this.isAwaiting = false;
        this.router.navigate([this.sReturnPath]);
      }, err => {
        this.isErrorVisible = true;
        this.isAwaiting = false;
        this.errorTitle = 'Ocurrió un error intentando Actualizar el concesionario';
        this.errorMessageApi = err.error.Message;
      });
    }
  }

  closeErrorMessage(){
    this.isErrorVisible = false;
  }

}
