import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Client } from 'src/app/Models/Client';
import { Movement } from 'src/app/Models/Movement';
import { SharedFunction } from 'src/app/Models/SharedFunctions';
import { Transaction } from 'src/app/Models/Transaction';
import { TransactionService } from '../../../../SharedComponents/Services/Transaction/transaction.service';
import { MovementService } from '../../../movement/Services/Movement/movement.service';
import { TransactionDetail } from 'src/app/Models/TransactionDetail';
import { TransactionObservation } from 'src/app/Models/TransactionObservation';
import { SessionUser } from 'src/app/Models/SessionUser';

@Component({
  selector: 'app-dashboard-client',
  templateUrl: './dashboard-client.component.html',
  styleUrls: ['./dashboard-client.component.scss']
})
export class DashboardClientComponent implements OnInit {
  isAwaiting:boolean;
  lsTransactionsToApprove: Transaction[];
  client:Client;
  sharedFunctions: SharedFunction;
  frmApprovedTrx: FormGroup;
  frmCancelTrx:FormGroup;
  transactionSelected: Transaction;
  lsMovements: Movement[];
  APROBACION_ORDEN_DE_TRABAJO = 5;
  CANCELACION_ORDEN_DE_TRABAJO = 6;
  trx_id: number;

  

  constructor(
    private transactionService: TransactionService,
    private movementService: MovementService
  ) { 
    this.frmApprovedTrx = new FormGroup({
      txtObservationApprobation: new FormControl('')
    });

    this.frmCancelTrx = new FormGroup({
      txtObservationCancelation: new FormControl('')
    })

    this.trx_id = 0;
  }

  ngOnInit(): void {
    this.initComponents();
  }

  initComponents(){
    this.isAwaiting = false;

    //TODO CHANGE THIS FOR THE CLIENT LOGGED
    this.client = new Client();
    this.client.id = this.getClientId();   

    this.sharedFunctions = new SharedFunction();
    this.getMovementList();
    this.getTransactionsToApprove(this.client.id);
  }

  getClientId():number{
    let userSession :SessionUser = JSON.parse(sessionStorage.getItem('sessionUser'));
    return userSession.company.id;
  }

  async getTransactionsToApprove(client_id: number){
    try {
      this.transactionService.getTransactionsToApprove(client_id).then( 
        lsTrx => {
          this.lsTransactionsToApprove = lsTrx;
        });
    } catch (error) {
      console.warn(error);
    }
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

  closePopUp(idPopUp) {
    let popUp = document.getElementById(idPopUp);
    popUp.style.display = 'none';
  }

  openPopUp(idPopUp) {
    let popUp = document.getElementById(idPopUp);
    popUp.style.display = 'block';
  }

  formatNumberToString(oData:number){
    return this.sharedFunctions.formatNumberToString(oData);
  }

  setTransaction(trx: Transaction){
    this.transactionSelected = trx;
    this.trx_id = trx.id;    
  }

  async approveWorkOrder(){
    try {
      this.isAwaiting = true;
      let movement = this.lsMovements.find(mv => mv.id == this.APROBACION_ORDEN_DE_TRABAJO);
      let {txtObservationApprobation} = this.frmApprovedTrx.controls;
      let trxApproveWorkOrder = this.setDataTransaction(this.transactionSelected,movement,txtObservationApprobation.value);
      console.log(trxApproveWorkOrder);
      this.transactionService.processTransaction(trxApproveWorkOrder)
      .then(rta =>{
        if(rta.response){
          alert(rta.message);
          this.getTransactionsToApprove(this.client.id);
          this.closePopUp('container__Approbation');
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
      let movement = this.lsMovements.find(mv => mv.id == this.CANCELACION_ORDEN_DE_TRABAJO);
      let {txtObservationCancelation} = this.frmCancelTrx.controls;
      let trxApproveWorkOrder = this.setDataTransaction(this.transactionSelected,movement,txtObservationCancelation.value);
      console.log(trxApproveWorkOrder);
      this.transactionService.processTransaction(trxApproveWorkOrder)
      .then(rta =>{
        if(rta.response){
          alert(rta.message);
          this.getTransactionsToApprove(this.client.id);
          this.closePopUp('container__Cancelation');
        }
      });
      this.isAwaiting = false;
    } catch (error) {
      console.warn(error);
    }
  }

  setDataTransaction(trxRelated: Transaction, movement:Movement, observation: string){
    
    let trxApprove = new Transaction();
    trxApprove.movement = movement;
    trxApprove.value = trxRelated.value;
    trxApprove.usu_id = 0;
    trxApprove.client = trxRelated.client;

    trxApprove.headerDetails = new TransactionDetail();
    trxApprove.headerDetails.relatedTransaction = trxRelated;

    let trxObservation = new TransactionObservation();
    trxObservation.usu_id = 0;
    trxObservation.description = observation;

    let lsObservation = [];
    lsObservation.push(trxObservation);

    trxApprove.lsObservations = lsObservation;

    return trxApprove;
  }

}
