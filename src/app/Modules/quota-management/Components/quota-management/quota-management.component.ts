import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Client } from 'src/app/Models/Client';
import { Movement } from 'src/app/Models/Movement';
import { Transaction } from 'src/app/Models/Transaction';
import { TransactionDetail } from 'src/app/Models/TransactionDetail';
import { TransactionObservation } from 'src/app/Models/TransactionObservation';
import { TransactionState } from 'src/app/Models/TransactionState';
import { TransactionService } from '../../../../SharedComponents/Services/Transaction/transaction.service';
import { QuotaService } from '../../Services/Quota/quota.service';
import { MovementService } from '../../../movement/Services/Movement/movement.service';
import { FinancialInformation } from 'src/app/Models/FinancialInformation';
import { SharedFunction } from 'src/app/Models/SharedFunctions';
import { SecurityValidators } from 'src/app/Models/SecurityValidators'


@Component({
  selector: 'app-quota-management',
  templateUrl: './quota-management.component.html',
  styleUrls: ['./quota-management.component.scss']
})
export class QuotaManagementComponent implements OnInit {
  isAwaiting: boolean;
  lsClientsWithoutQuota: Client[];
  lsClientsWithQuota: FinancialInformation[];
  lsTodayTransactions: Transaction[];

  lsMovements: Movement[];
  clientSelected: Client;
  frmApprovedQuota: FormGroup;
  frmFreeUpQuota: FormGroup;
  frmAddQuota: FormGroup;
  frmCancelQuota: FormGroup;

  CREACION_DE_CUPO = 1;
  ADICION_DE_CUPO = 2;
  CANCELACION_DE_CUPO = 3;
  LIBERACION_DE_CUPO = 7;

  sharedFunction: SharedFunction;
  transactionSelected: Transaction;
  trx_id:number;    

  constructor(
    private quotaService: QuotaService,
    private movementService: MovementService,
    private trxService: TransactionService
  ) {
    this.frmApprovedQuota = new FormGroup({
      txtApprovedQuotaClient: new FormControl(''),
      txtApprovedQuota: new FormControl(''),
      txtApprovedQuotaObservation: new FormControl('')
    });

    this.frmFreeUpQuota = new FormGroup({
      txtFreeUpQuotaClient: new FormControl(''),
      txtFreeUpQuota: new FormControl(''),
      txtFreeUpQuotaObservation: new FormControl('')
    });

    this.frmAddQuota = new FormGroup({
      txtAddQuotaClient: new FormControl(''),
      txtAddQuota: new FormControl(''),
      txtAddQuotaObservation: new FormControl(''),
    });

    this.frmCancelQuota = new FormGroup({
      txtCancelQuotaClient: new FormControl(''),
      txtCancelQuotaObservation: new FormControl(''),
    });

    this.transactionSelected = new Transaction();
    this.transactionSelected.consecutive = 0;
    this.transactionSelected.code = null;
    this.transactionSelected.movement = new Movement();
    this.trx_id = 0;    
  }

  ngOnInit(): void {

    this.initComponents();

  }

  initComponents() {
    this.sharedFunction = new SharedFunction();
    this.isAwaiting = true;
    this.lsClientsWithoutQuota = [];
    this.getLsClientsWithoutQuota();
    this.getLsClientsWithQuota();
    this.getTodayTransactions();
    this.getLsMovements();
    this.isAwaiting = false;
  }

  async getLsClientsWithoutQuota() {
    try {
      this.lsClientsWithoutQuota = await this.quotaService.getClientsWithoutQuota();
    } catch (error) {
      console.warn(error);
    }
  }

  async getLsClientsWithQuota() {
    try {
      this.lsClientsWithQuota = await this.quotaService.getClientsWithQuota();
      console.log(this.lsClientsWithQuota);
      setTimeout(() => {
        this.formatQuantities(this.lsClientsWithQuota);
      }, 500)

    } catch (error) {
      console.warn(error);
    }
  }

  async getTodayTransactions() {
    try {
      this.lsTodayTransactions = await this.trxService.getTodayTransactions();
      console.log(this.lsTodayTransactions);    

    } catch (error) {
      console.warn(error);
    }
  }
  async getLsMovements() {
    try {
      this.lsMovements = await this.movementService.getMovements();
    } catch (error) {
      console.warn(error);
    }
  }

  closePopUp(idPopUp) {
    let popUp = document.getElementById(idPopUp);
    this.clearFormQuotaApproved();
    this.clearFormFreeUpQuota();
    this.clearFormAddQuota();
    this.clearFormCancelQuota();
    popUp.style.display = 'none';
  }

  openPopUp(idPopUp) {
    let popUp = document.getElementById(idPopUp);
    popUp.style.display = 'block';
  }

  setClientInformation(idPopUp: string, pClient: Client) {
    this.clientSelected = pClient;

    if (idPopUp == 'container__QuotaManager') {
      let { txtApprovedQuotaClient } = this.frmApprovedQuota.controls;
      txtApprovedQuotaClient.setValue(pClient.name);
    }

    if (idPopUp == 'container__freeUpQuota') {
      let { txtFreeUpQuotaClient } = this.frmFreeUpQuota.controls;
      txtFreeUpQuotaClient.setValue(pClient.name);
    }

    if (idPopUp == 'container__addQuota') {
      let { txtAddQuotaClient } = this.frmAddQuota.controls;
      txtAddQuotaClient.setValue(pClient.name);
    }

    if (idPopUp == 'container__cancelQuota') {
      let { txtCancelQuotaClient } = this.frmCancelQuota.controls;
      txtCancelQuotaClient.setValue(pClient.name);
    }
  }

  saveApprovedQuota() {
    let { txtApprovedQuota, txtApprovedQuotaObservation } = this.frmApprovedQuota.controls;
    let trxApprovedQuota = new Transaction();

    let oClient = this.clientSelected;
    let value = txtApprovedQuota.value;
    let observation = txtApprovedQuotaObservation.value;
    let movement = this.lsMovements.find(mv => mv.id == this.CREACION_DE_CUPO);
    let lsObs: TransactionObservation[] = [];
    value = value.toString().replace(/\,/g, '');

    if (observation != '') {
      let trxObservation = new TransactionObservation();
      trxObservation.description = observation;
      lsObs.push(trxObservation);
    }

    trxApprovedQuota = this.setDataTransaction(oClient, movement, value, null, null, lsObs, null);

    console.log(trxApprovedQuota);

    this.saveTransaction(trxApprovedQuota).then((rta) => {
      if (rta) {
        this.closePopUp('container__QuotaManager');
        this.getLsClientsWithoutQuota();
        this.getLsClientsWithQuota();
        this.getTodayTransactions();
      }
    });


  }

  setDataTransaction(pClient: Client, pMovement: Movement, pValue: number,
    pState: TransactionState = null, pHeaderDetails: TransactionDetail = null,
    pListObservations: TransactionObservation[] = null, usu_id: number = null): Transaction {

    let trx = new Transaction();
    trx.client = pClient;
    trx.movement = pMovement;
    trx.value = pValue;
    trx.transactionState = pState;
    trx.headerDetails = pHeaderDetails;
    trx.lsObservations = pListObservations;
    trx.usu_id = SecurityValidators.validateUserLogged();;
    return trx;
  }

  async saveTransaction(trx: Transaction): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        this.isAwaiting = true;
        let rta = await this.trxService.processTransaction(trx);
        this.isAwaiting = false;
        if (rta.response) {
          alert(rta.message);
          resolve(true);
        } else {
          reject(false);
        }
      } catch (error) {
        console.warn(error);
      }
    });
  }

  clearFormQuotaApproved() {
    let { txtApprovedQuota, txtApprovedQuotaObservation } = this.frmApprovedQuota.controls;
    txtApprovedQuota.setValue('');
    txtApprovedQuotaObservation.setValue('');
  }

  clearFormFreeUpQuota() {
    let { txtFreeUpQuota, txtFreeUpQuotaObservation } = this.frmFreeUpQuota.controls;
    txtFreeUpQuota.setValue('');
    txtFreeUpQuotaObservation.setValue('');
  }

  clearFormAddQuota() {
    let { txtAddQuota, txtAddQuotaObservation } = this.frmAddQuota.controls;
    txtAddQuota.setValue('');
    txtAddQuotaObservation.setValue('');
  }
  clearFormCancelQuota() {
    let { txtCancelQuotaObservation } = this.frmCancelQuota.controls;
    txtCancelQuotaObservation.setValue('');
  }

  showElements(container_description: string) {
    this.hideElements();
    let idIndicator = `indicator__${container_description}`;
    let idContainer = `container__${container_description}`;

    let indicator = document.getElementById(idIndicator);
    let container = document.getElementById(idContainer);

    indicator.setAttribute("style", "display:block");
    container.setAttribute("style", "display:block");
  }

  hideElements() {
    let aElementsToHide = document.getElementsByClassName('element-to-hide');
    for (let i = 0; i < aElementsToHide.length; i++) {
      aElementsToHide[i].setAttribute("style", "display:none");
    }
  }

  getStringHour(trxDate: Date): string {
    let strHour = trxDate.toLocaleString();
    //console.log(strHour.substr(11,8));
    return strHour.substr(11, 8);
  }

  formatQuantities(lsFinancialInformationByClient: FinancialInformation[]) {

    for (let finInfo of lsFinancialInformationByClient) {
      try {
        let idApprovedQuota = this.getElementId('approvedQuota', finInfo.client.id);
        let elementApprovedQuota = document.getElementById(idApprovedQuota);
        let approvedQuotaFormated = this.formatNumberToString(finInfo.approvedQuota);
        elementApprovedQuota.innerText = approvedQuotaFormated;


        let idCurrentQuota = this.getElementId('currentQuota', finInfo.client.id);
        let elementCurrentQuota = document.getElementById(idCurrentQuota);
        let CurrentQuotaFormated = this.formatNumberToString(finInfo.currentQuota);
        elementCurrentQuota.innerText = CurrentQuotaFormated;


        let idConsumedQuota = this.getElementId('consumedQuota', finInfo.client.id);
        let elementConsumedQuota = document.getElementById(idConsumedQuota);
        let ConsumedQuotaFormated = this.formatNumberToString(finInfo.consumedQuota);
        elementConsumedQuota.innerText = ConsumedQuotaFormated;


        let idInTransitQuota = this.getElementId('inTransitQuota', finInfo.client.id);
        let elementInTransitQuota = document.getElementById(idInTransitQuota);
        let InTransitQuotaFormated = this.formatNumberToString(finInfo.inTransitQuota);
        elementInTransitQuota.innerText = InTransitQuotaFormated;

      } catch (ex) {
        console.warn(ex);
      }

    }
  }



  formatNumber(event: any) {
    let { txtApprovedQuota } = this.frmApprovedQuota.controls;
    console.log(event);
    let numberToTransform = event.target.value.toString().replace(/\,/g, '');
    console.log(this.formatNumberToString(numberToTransform));

    event.target.value = this.formatNumberToString(numberToTransform);
  }

  formatNumberToString(oNumber: Number): string {
    return this.sharedFunction.formatNumberToString(oNumber);
  }

  getElementId(field: string, id: number) {
    return `${field}_${id}`;
  }

  saveFreeUpQuota() {
    let { txtFreeUpQuota, txtFreeUpQuotaObservation } = this.frmFreeUpQuota.controls;
    let trxFreeUpQuota = new Transaction();

    let oClient = this.clientSelected;
    let value = txtFreeUpQuota.value;
    value = value.toString().replace(/\,/g, '');

    let observation = txtFreeUpQuotaObservation.value;
    let movement = this.lsMovements.find(mv => mv.id == this.LIBERACION_DE_CUPO);
    let lsObs: TransactionObservation[] = [];

    this.validatePayment(oClient, value).then(response => {
      if (response) {
        if (observation != '') {
          let trxObservation = new TransactionObservation();
          trxObservation.description = observation;
          lsObs.push(trxObservation);
        }

        trxFreeUpQuota = this.setDataTransaction(oClient, movement, value, null, null, lsObs, null);

        console.log(trxFreeUpQuota);

        this.saveTransaction(trxFreeUpQuota).then((rta) => {
          if (rta) {
            this.closePopUp('container__freeUpQuota');
            this.getLsClientsWithoutQuota();
            this.getLsClientsWithQuota();
            this.getTodayTransactions();
          }
        });
      }
    });
  }

  saveAddQuota() {
    let { txtAddQuota, txtAddQuotaObservation } = this.frmAddQuota.controls;
    let trxAddQuota = new Transaction();

    let oClient = this.clientSelected;
    let value = txtAddQuota.value;
    let observation = txtAddQuotaObservation.value;
    let movement = this.lsMovements.find(mv => mv.id == this.ADICION_DE_CUPO);
    let lsObs: TransactionObservation[] = [];
    value = value.toString().replace(/\,/g, '');

    if (observation != '') {
      let trxObservation = new TransactionObservation();
      trxObservation.description = observation;
      lsObs.push(trxObservation);
    }

    trxAddQuota = this.setDataTransaction(oClient, movement, value, null, null, lsObs, null);

    console.log(trxAddQuota);

    this.saveTransaction(trxAddQuota).then((rta) => {
      if (rta) {
        this.closePopUp('container__addQuota');
        this.getLsClientsWithoutQuota();
        this.getLsClientsWithQuota();
        this.getTodayTransactions();
      }
    });
  }


  async validatePayment(pClient: Client, paymentValue: Number): Promise<boolean> {
    try {
      return new Promise(async (resolve, reject) => {
        this.isAwaiting = true;
        let rta = await this.quotaService.validatePaymentVsConsumedQuota(pClient.id, paymentValue);
        if (!rta.response) {
          alert(rta.message);
          resolve(false);
        } else {
          resolve(true);
          console.log(rta.message);
        }
        this.isAwaiting = false;
        return rta.response;
      });


    } catch (error) {
      console.warn(error);
    }
  }

  cancelQuota() {
    let oClient = this.clientSelected;
    if (confirm(`¿Está seguro de anular el cupo para el cliente ${oClient.name}?`)) {
      let value = 0;
      let { txtCancelQuotaObservation } = this.frmCancelQuota.controls;
      let trxCancelQuota = new Transaction();

      let observation = txtCancelQuotaObservation.value;
      let movement = this.lsMovements.find(mv => mv.id == this.CANCELACION_DE_CUPO);
      let lsObs: TransactionObservation[] = [];      

      if (observation != '') {
        let trxObservation = new TransactionObservation();
        trxObservation.description = observation;
        lsObs.push(trxObservation);
      }

      trxCancelQuota = this.setDataTransaction(oClient, movement, value, null, null, lsObs, null);

      console.log(trxCancelQuota);

      this.saveTransaction(trxCancelQuota).then((rta) => {
        if (rta) {
          this.closePopUp('container__cancelQuota');
          this.getLsClientsWithoutQuota();
          this.getLsClientsWithQuota();
          this.getTodayTransactions();
        }
      });
    }
  }


  setTransaction(trx: Transaction){
    this.transactionSelected = trx;
    this.trx_id = trx.id;    
  }
}
