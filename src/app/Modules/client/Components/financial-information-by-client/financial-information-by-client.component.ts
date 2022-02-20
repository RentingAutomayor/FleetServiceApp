import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Client } from 'src/app/Models/Client';
import { LogTransaction } from 'src/app/Models/LogTransaction';
import { SharedFunction } from 'src/app/Models/SharedFunctions';
import { Transaction } from 'src/app/Models/Transaction';
import { TransactionState } from 'src/app/Models/TransactionState';
import { TransactionService } from 'src/app/SharedComponents/Services/Transaction/transaction.service';
import { ClientService } from 'src/app/Modules/client/Services/Client/client.service';

import { QuotaService } from 'src/app/Modules/quota-management/Services/Quota/quota.service';
import { FinancialInformation } from 'src/app/Models/FinancialInformation';

@Component({
  selector: 'app-financial-information-by-client',
  templateUrl: './financial-information-by-client.component.html',
  styleUrls: ['./financial-information-by-client.component.scss']
})
export class FinancialInformationByClientComponent implements OnInit {
  lsTransactionByClient: LogTransaction[];
  sharedFunctions: SharedFunction;
  isAwaiting: boolean;
  frmQuota: FormGroup;
  financialInformationByClient: FinancialInformation;
  currentPage = 1;
  workOrderTransactions: LogTransaction[] = [];

  client: Client;
  @Input('client')
  set setClient(client: Client){
    this.client = client;
    this.initComponents();
  }

  constructor(
    private clientService: ClientService,
    private transactionService: TransactionService,
    private quotaService: QuotaService
  ) {
    this.frmQuota = new FormGroup({
      txtApprovedQuota: new FormControl(''),
      txtCurrentQuota: new FormControl(''),
      txtConsumedQuota: new FormControl(''),
      txtInTransitQuota: new FormControl('')
    });

  }

  ngOnInit(): void {
    this.initComponents();
  }

  async initComponents(){
    this.isAwaiting = false;
    this.sharedFunctions = new SharedFunction();


    if (this.client != null){
      this.isAwaiting = true;
      this.getQuotaByClient(this.client.id);
      this.getTransactionsByClient( this.client.id);
      this.isAwaiting = false;
    }


  }

  async getTransactionsByClient(client_id: number){
    try {
        this.transactionService.getTransactionsByClient(client_id).then(logTrx => {
          this.lsTransactionByClient = logTrx;
          const movementWorkOrder = 4;
          this.workOrderTransactions = this.lsTransactionByClient.filter(trx => trx.transaction.movement.id == movementWorkOrder);
        });
    } catch (error) {
      console.warn(error);
    }
  }

  async getQuotaByClient(client_id: number){
    try {
      this.quotaService.getFinancialInformationByClient(client_id).then( infclient => {
        this.financialInformationByClient = infclient;
        if (this.financialInformationByClient){
          this.setFinancialInformationByClient(this.financialInformationByClient);
        }
      });
    } catch (error) {
      console.warn(error);
    }
  }

  setFinancialInformationByClient(financialInfo: FinancialInformation){
    const {txtApprovedQuota, txtCurrentQuota, txtConsumedQuota, txtInTransitQuota} = this.frmQuota.controls;
    txtApprovedQuota.setValue(this.sharedFunctions.formatNumberToString(financialInfo.approvedQuota));
    txtCurrentQuota.setValue(this.sharedFunctions.formatNumberToString(financialInfo.currentQuota));
    txtConsumedQuota.setValue(this.sharedFunctions.formatNumberToString(financialInfo.consumedQuota));
    txtInTransitQuota.setValue(this.sharedFunctions.formatNumberToString(financialInfo.inTransitQuota));
  }

  getState(trxState: TransactionState){
    if (trxState != null){
      return trxState.name;
    }else{
      return '';
    }
  }

  formatNumber(oData: number){
    return this.sharedFunctions.formatNumberToString(oData);
  }

  getResponsable(oTrx: Transaction){
    return '';
  }

  getBranch(oTrx: Transaction){
    return '';
  }
}
