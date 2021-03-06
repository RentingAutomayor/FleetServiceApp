import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Transaction } from 'src/app/Models/Transaction';
import { TransactionState } from 'src/app/Models/TransactionState';
import { TransactionService } from '../../../../SharedComponents/Services/Transaction/transaction.service';
import { SessionUser } from 'src/app/Models/SessionUser';
import { SecurityValidators } from 'src/app/Models/SecurityValidators';
import { Company } from 'src/app/Models/Company';
import { CompanyType } from "src/app/Models/CompanyType";
import { DatePipe } from '@angular/common'
import { DealerService } from 'src/app/Modules/dealer/Services/Dealer/dealer.service';
import { ClientService } from 'src/app/Modules/client/Services/Client/client.service';
import { Movement,Movements } from 'src/app/Models/Movement';
import { MovementService } from '../../../movement/Services/Movement/movement.service';
import { TransactionDetail } from 'src/app/Models/TransactionDetail';
import { TransactionObservation } from 'src/app/Models/TransactionObservation';

@Component({
  selector: 'app-work-order-manager',
  templateUrl: './work-order-manager.component.html',
  styleUrls: ['./work-order-manager.component.scss']
})
export class WorkOrderManagerComponent implements OnInit {
  isAwaiting: boolean;
  lsWorkOrderByDealer: Transaction[];
  transactionSelected: Transaction;
  trx_id:number;
  frm_filter: FormGroup;
  countChanges:number;
 
  public typeOfReport: string;
  company: Company;
  isMainCompanyLogged: boolean;
  dealer_to_filter: number;
  client_to_filter: number;
  init_date: string;
  end_date: string;
  code_to_filter:string;
  license_plate_toFilter:string;
  state_to_filter:number;


  isDealer: Boolean;
  isMainCompany: Boolean;

  isFiltered:boolean;

  lsTransactionStates: TransactionState[];
  lsMovements: Movement[];

  frmApprovedTrx: FormGroup;
  frmCancelTrx:FormGroup;

  constructor(
    private transactionService: TransactionService,
    private datePipe:DatePipe,
    private dealerService:DealerService,
    private clientService:ClientService,
    private movementService:MovementService

  ) { 
    this.transactionSelected = new Transaction();
    this.trx_id = 0;
    this.isDealer = false;
    this.isMainCompany = false;
    this.isFiltered = false;
    this.countChanges = 0;

    this.frm_filter = new FormGroup({
      txtCode: new FormControl(''),
      txtLicense_plate: new FormControl(''),
      txtInit_date: new FormControl(''),
      txtEnd_date : new FormControl(''),
      cmbState: new FormControl('')
    });

    this.frmApprovedTrx = new FormGroup({
      txtObservationApprobation: new FormControl('')
    });

    this.frmCancelTrx = new FormGroup({
      txtObservationCancelation: new FormControl('')
    })
  }

  ngOnInit(): void {
    this.initComponents();
  }

  async initComponents() {
    this.dealerService.setDealerSelected(null);
    this.clientService.setClientSelected(null);
    this.countChanges += 1;
    this.isAwaiting = false;
    this.getCompany();
    this.lsTransactionStates = await this.transactionService.getTransactionStates();
    this.getMovementList();
    await this.initDataToGetReport();    
    await this.getDataTransactions();
  }

  async getMovementList(){
    try {
      this.movementService.getMovements().then(lsMov =>{
        this.lsMovements = lsMov;
      })
    } catch (error) {
      console.warn(error);
    }
  }

  getCompany(){    
     this.company = SecurityValidators.validateUserAndCompany();   
  }

  async initDataToGetReport() {
    console.warn("[initDataToGetReport]",this.company);
    switch(this.company.type){
      case CompanyType.CLIENT:
         this.typeOfReport = "dealer";
         this.isMainCompanyLogged = false;
         this.client_to_filter = this.company.id;
         this.dealer_to_filter = null;
         this.isDealer = false;
        break;
       case CompanyType.DEALER:
         this.typeOfReport = "client";
         this.isMainCompanyLogged = false;
         this.dealer_to_filter = this.company.id;
         this.client_to_filter = null;
         this.isDealer = true;
         break;
       case CompanyType.MAIN_COMPANY:
         this.typeOfReport = "client";
         this.isMainCompanyLogged = true;
         this.client_to_filter = null;
         this.dealer_to_filter = null;
         this.isDealer = true;
         this.isMainCompany = true;
         break;
    }

   }

  async getDataTransactions() {
    try {    
      this.isAwaiting = true;
      await this.transactionService.getTransactionsByDealerOrClient(this.dealer_to_filter,this.client_to_filter,
          this.init_date, this.end_date, this.code_to_filter,this.license_plate_toFilter, this.state_to_filter)
      .then(dataTrx => { 
        this.lsWorkOrderByDealer = dataTrx;
        console.log(this.lsWorkOrderByDealer);
      });
      this.isAwaiting = false;
    } catch (error) {
      console.warn(error);
    }
  }

  validateState(transactionState: TransactionState, transaction_id: number) {
    let idElement = `#${this.getSpanStateId(transaction_id)}`;
    let spanState: HTMLSpanElement = document.querySelector(idElement);

    if (transactionState != null) {
      switch (transactionState.name.toUpperCase()) {
        case "APROBADA":
          spanState.classList.add("tag-active");
          break;         
        case "FINALIZADA":
          spanState.classList.add("tag-ending");
          break;
        case "RECHAZADA":
          spanState.classList.add("tag-error");
          break;
        case "ANULADA":
          spanState.classList.add("tag-canceled");
          break;
        default:
          spanState.classList.add("tag-pending");
          break;
      }
    } else {
      spanState.classList.add("tag-pending");
    }

    return (transactionState != null) ? transactionState.name : "PENDIENTE";
  }

  getSpanStateId(transaction_id: number) {
    return `stateTrx_${transaction_id}`;
  }

  openWorkOrder() {
    let idContainerTable = '#container__table_workOrder';
    let containerTable: HTMLDivElement = document.querySelector(idContainerTable);

    let idContainerWorkOrder = '#container__workOrder';
    let containerWorkOrder: HTMLDivElement = document.querySelector(idContainerWorkOrder);

    containerTable.setAttribute("style", "display:none");
    containerWorkOrder.setAttribute("style", "display:block");
  }

  closeWorkOrder() {

    let idContainerTable = '#container__table_workOrder';
    let containerTable: HTMLDivElement = document.querySelector(idContainerTable);

    let idContainerWorkOrder = '#container__workOrder';
    let containerWorkOrder: HTMLDivElement = document.querySelector(idContainerWorkOrder);

    containerTable.setAttribute("style", "display:block");
    containerWorkOrder.setAttribute("style", "display:none");

  }

  getListWorkOrders(){
    //TODO: change this for the user logged configuration;
    this.getDataTransactions();
    this.closeWorkOrder();
  }

  closePopUp(idPopUp) {
    let popUp = document.getElementById(idPopUp);
    popUp.style.display = 'none';
  }

  openPopUp(idPopUp) {
    let popUp = document.getElementById(idPopUp);
    popUp.style.display = 'block';
  }

  setTransaction(trx: Transaction){
    this.transactionSelected = trx;
    this.trx_id = trx.id;    
  }

  async toggleBtnFilter(){
    this.isAwaiting = true;
    if(this.isFiltered){
      this.frm_filter.reset();
      this.dealerService.setDealerSelected(null);
      this.clientService.setClientSelected(null);
      this.countChanges += 1;
      this.initDataToGetReport();
    }
    this.isFiltered = !this.isFiltered;   
    await this.setDataToFilters();
    this.isAwaiting = false;
  }

  async setDataToFilters(){
    let {txtCode, txtLicense_plate, txtInit_date, txtEnd_date, cmbState} = this.frm_filter.controls;
    this.code_to_filter = txtCode.value;
    this.license_plate_toFilter = txtLicense_plate.value;
    this.init_date = this.datePipe.transform(txtInit_date.value, 'yyyy/MM/dd');
    this.end_date = this.datePipe.transform(txtEnd_date.value, 'yyyy/MM/dd');
    this.state_to_filter = cmbState.value;

    this.getDataTransactions();
  }

  setDealerToFilter(){
    let dealerSelected = this.dealerService.getDealerSelected();
    if(dealerSelected != null){
      this.dealer_to_filter = dealerSelected.id;
    }else{
      this.dealer_to_filter = null;
    }    
  }


  setClientToFilter(){
    let clientSelected = this.clientService.getClientSelected();
    if(clientSelected != null){
      this.client_to_filter = clientSelected.id;
    }else{
      this.client_to_filter = null;
    }
  }

  async finalizeWorkOrder(){
    try {
      this.isAwaiting = true;
      let movement = this.lsMovements.find(mv => mv.id == Movements.FINALIZACION_ORDEN_DE_TRABAJO);
      let {txtObservationApprobation} = this.frmApprovedTrx.controls;
      let trxApproveWorkOrder = this.setDataTransaction(this.transactionSelected,movement,txtObservationApprobation.value);
      console.log(trxApproveWorkOrder);
      this.transactionService.processTransaction(trxApproveWorkOrder)
      .then(rta =>{
        if(rta.response){
          alert(rta.message);
          this.getDataTransactions();
          this.closePopUp('container__FinalizeWorkOrder');
        }
      });
      this.isAwaiting = false;
    } catch (error) {
      console.warn(error);
    }
  }

  async cancelWorkOrder(){
    try {
      this.isAwaiting = true;
      let movement = this.lsMovements.find(mv => mv.id == Movements.ANULACION_ORDEN_DE_TRABAJO);
      let {txtObservationCancelation} = this.frmCancelTrx.controls;
      let trxApproveWorkOrder = this.setDataTransaction(this.transactionSelected,movement,txtObservationCancelation.value);
      console.log(trxApproveWorkOrder);
      this.transactionService.processTransaction(trxApproveWorkOrder)
      .then(rta =>{
        if(rta.response){
          alert(rta.message);
          this.getDataTransactions();
          this.closePopUp('container__Cancelation');
        }
      });
      this.isAwaiting = false;
    } catch (error) {
      console.warn(error);
    }
  }


  setDataTransaction(trxRelated: Transaction, movement:Movement, observation: string){    
    let trx= new Transaction();
    trx.movement = movement;
    trx.value = trxRelated.value;
    trx.usu_id = SecurityValidators.validateUserLogged();;
    trx.client = trxRelated.client;

    trx.headerDetails = new TransactionDetail();
    trx.headerDetails.relatedTransaction = trxRelated;

    let trxObservation = new TransactionObservation();
    trxObservation.usu_id = SecurityValidators.validateUserLogged();
    trxObservation.description = observation;

    let lsObservation = [];

    if(observation != ''){
      lsObservation.push(trxObservation);
    }
    

    trx.lsObservations = lsObservation;

    return trx;
  }

  
  clearForms(){
     this.frmApprovedTrx.reset();
     this.frmCancelTrx.reset();
  }

  validateContainerControls(workOrder: Transaction): boolean{
    let response = false;

    if(workOrder.transactionState.name.toUpperCase() == "APROBADA"){
      response = true;
    }

    return response;
  }
}


