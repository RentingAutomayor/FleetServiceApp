import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/Models/Transaction';
import { TransactionState } from 'src/app/Models/TransactionState';
import { TransactionService } from '../../../../SharedComponents/Services/Transaction/transaction.service';

@Component({
  selector: 'app-work-order-manager',
  templateUrl: './work-order-manager.component.html',
  styleUrls: ['./work-order-manager.component.scss', '../../../../../assets/styles/app.scss']
})
export class WorkOrderManagerComponent implements OnInit {
  isAwaiting: boolean;
  lsWorkOrderByDealer: Transaction[];

  constructor(
    private transactionService: TransactionService
  ) { }

  ngOnInit(): void {
    this.initComponents();
  }

  async initComponents() {
    this.isAwaiting = false;
    this.getTransactionByDealer(1);
  }

  async getTransactionByDealer(dealer_id: number) {
    try {
      let idDealer = 1;
      this.isAwaiting = true;
      this.transactionService.getTransactionsByDealer(idDealer).then(dataTrx => { this.lsWorkOrderByDealer = dataTrx });
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
    this.getTransactionByDealer(1);
    this.closeWorkOrder();
  }
}
