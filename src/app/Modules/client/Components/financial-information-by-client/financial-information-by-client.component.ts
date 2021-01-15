import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/Models/Client';
import { LogTransaction } from 'src/app/Models/LogTransaction';
import { SharedFunction } from 'src/app/Models/SharedFunctions';
import { Transaction } from 'src/app/Models/Transaction';
import { TransactionState } from 'src/app/Models/TransactionState';
import { TransactionService } from 'src/app/SharedComponents/Services/Transaction/transaction.service';
import { ClientService } from 'src/app/Modules/client/Services/Client/client.service';
import { FormGroup, FormControl } from '@angular/forms';
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
  isAwaiting:boolean;
  oClient: Client;
  frmQuota: FormGroup;
  financialInformationByClient: FinancialInformation;

  constructor(
    private clientService:ClientService,
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
    
    this.oClient = this.clientService.getClientToUpdate();
    this.sharedFunctions = new SharedFunction();
    
    this.isAwaiting = true;
    this.getQuotaByClient(this.oClient.id);
    this.getTransactionsByClient( this.oClient.id);    
    this.isAwaiting = false;
  }

  async getTransactionsByClient(client_id : number){
    try {
        this.transactionService.getTransactionsByClient(client_id).then(logTrx => {
          this.lsTransactionByClient = logTrx;
          console.log(this.lsTransactionByClient);
        })
    } catch (error) {
      console.warn(error);
    }
  }

  async getQuotaByClient(client_id: number){
    try {
      this.quotaService.getFinancialInformationByClient(client_id).then( infoClient => {
        this.financialInformationByClient = infoClient;
        this.setFinancialInformationByClient(this.financialInformationByClient);
      });
    } catch (error) {
      console.warn(error);
    }
  }

  setFinancialInformationByClient(financialInfo: FinancialInformation){
    let {txtApprovedQuota,txtCurrentQuota,txtConsumedQuota,txtInTransitQuota} = this.frmQuota.controls;
    txtApprovedQuota.setValue(this.sharedFunctions.formatNumberToString(financialInfo.approvedQuota));
    txtCurrentQuota.setValue(this.sharedFunctions.formatNumberToString(financialInfo.currentQuota));
    txtConsumedQuota.setValue(this.sharedFunctions.formatNumberToString(financialInfo.consumedQuota));
    txtInTransitQuota.setValue(this.sharedFunctions.formatNumberToString(financialInfo.inTransitQuota));
  }

  getState(trxState:TransactionState){
    if(trxState != null){
      return trxState.name;
    }else{
      return '';
    }
  }

  formatNumber(oData:number){
    return this.sharedFunctions.formatNumberToString(oData);
  }

  getResponsable(oTrx:Transaction){
    return '';
  }

  getBranch(oTrx:Transaction){
    return '';
  }
}
