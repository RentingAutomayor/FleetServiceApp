import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/Models/Transaction';
import { TransactionState } from 'src/app/Models/TransactionState';
import { TransactionService } from '../../../../SharedComponents/Services/Transaction/transaction.service';
import { SessionUser } from 'src/app/Models/SessionUser';

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

  constructor(
    private transactionService: TransactionService
  ) { 
    this.transactionSelected = new Transaction();
    this.trx_id = 0;
  }

  ngOnInit(): void {
    this.initComponents();
  }

  async initComponents() {
    this.isAwaiting = false;
    let dealer_id = this.getDealerId();
    this.getTransactionByDealer(dealer_id);
  }

  getDealerId():number{
    let userSession :SessionUser = JSON.parse(sessionStorage.getItem('sessionUser'));
    return userSession.company.id;
  }

  async getTransactionByDealer(dealer_id: number) {
    try {    
      this.isAwaiting = true;
      await this.transactionService.getTransactionsByDealer(dealer_id)
      .then(dataTrx => { 
        this.lsWorkOrderByDealer = dataTrx;
        console.log(this.lsWorkOrderByDealer) ;
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
        case "RECHAZADA":
          spanState.classList.add("tag-error");
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
    this.getTransactionByDealer(this.getDealerId());
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
}
