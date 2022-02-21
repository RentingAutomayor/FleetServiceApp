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
import { SecurityValidators } from 'src/app/Models/SecurityValidators';


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
  trx_id: number;

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
      // console.log(this.lsClientsWithQuota);
      setTimeout(() => {
        this.formatQuantities(this.lsClientsWithQuota);
      }, 500);

    } catch (error) {
      console.warn(error);
    }
  }

  async getTodayTransactions() {
    try {
      this.lsTodayTransactions = await this.trxService.getTodayTransactions();
      // console.log(this.lsTodayTransactions);

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
    const popUp = document.getElementById(idPopUp);
    this.clearFormQuotaApproved();
    this.clearFormFreeUpQuota();
    this.clearFormAddQuota();
    this.clearFormCancelQuota();
    popUp.style.display = 'none';
  }

  openPopUp(idPopUp) {
    const popUp = document.getElementById(idPopUp);
    popUp.style.display = 'block';
  }

  setClientInformation(idPopUp: string, pClient: Client) {
    this.clientSelected = pClient;

    if (idPopUp == 'container__QuotaManager') {
      const { txtApprovedQuotaClient } = this.frmApprovedQuota.controls;
      txtApprovedQuotaClient.setValue(pClient.name);
    }

    if (idPopUp == 'container__freeUpQuota') {
      const { txtFreeUpQuotaClient } = this.frmFreeUpQuota.controls;
      txtFreeUpQuotaClient.setValue(pClient.name);
    }

    if (idPopUp == 'container__addQuota') {
      const { txtAddQuotaClient } = this.frmAddQuota.controls;
      txtAddQuotaClient.setValue(pClient.name);
    }

    if (idPopUp == 'container__cancelQuota') {
      const { txtCancelQuotaClient } = this.frmCancelQuota.controls;
      txtCancelQuotaClient.setValue(pClient.name);
    }
  }

  saveApprovedQuota() {
    const { txtApprovedQuota, txtApprovedQuotaObservation } = this.frmApprovedQuota.controls;
    let trxApprovedQuota = new Transaction();

    const oClient = this.clientSelected;
    let value = txtApprovedQuota.value;
    const observation = txtApprovedQuotaObservation.value;
    const movement = this.lsMovements.find(mv => mv.id == this.CREACION_DE_CUPO);
    const lsObs: TransactionObservation[] = [];
    value = value.toString().replace(/\,/g, '');

    if (observation != '') {
      const trxObservation = new TransactionObservation();
      trxObservation.description = observation;
      lsObs.push(trxObservation);
    }

    trxApprovedQuota = this.setDataTransaction(oClient, movement, value, null, null, lsObs, null);



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

    const trx = new Transaction();
    trx.client = pClient;
    trx.movement = pMovement;
    trx.value = pValue;
    trx.transactionState = pState;
    trx.headerDetails = pHeaderDetails;
    trx.lsObservations = pListObservations;
    trx.usu_id = SecurityValidators.validateUserLogged();
    return trx;
  }

  async saveTransaction(trx: Transaction): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        this.isAwaiting = true;
        const rta = await this.trxService.processTransaction(trx);
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
    const { txtApprovedQuota, txtApprovedQuotaObservation } = this.frmApprovedQuota.controls;
    txtApprovedQuota.setValue('');
    txtApprovedQuotaObservation.setValue('');
  }

  clearFormFreeUpQuota() {
    const { txtFreeUpQuota, txtFreeUpQuotaObservation } = this.frmFreeUpQuota.controls;
    txtFreeUpQuota.setValue('');
    txtFreeUpQuotaObservation.setValue('');
  }

  clearFormAddQuota() {
    const { txtAddQuota, txtAddQuotaObservation } = this.frmAddQuota.controls;
    txtAddQuota.setValue('');
    txtAddQuotaObservation.setValue('');
  }
  clearFormCancelQuota() {
    const { txtCancelQuotaObservation } = this.frmCancelQuota.controls;
    txtCancelQuotaObservation.setValue('');
  }

  showElements(container_description: string) {
    this.hideElements();
    const idIndicator = `indicator__${container_description}`;
    const idContainer = `container__${container_description}`;

    const indicator = document.getElementById(idIndicator);
    const container = document.getElementById(idContainer);

    indicator.setAttribute('style', 'display:block');
    container.setAttribute('style', 'display:block');
  }

  hideElements() {
    const aElementsToHide = document.getElementsByClassName('element-to-hide');
    for (let i = 0; i < aElementsToHide.length; i++) {
      aElementsToHide[i].setAttribute('style', 'display:none');
    }
  }

  getStringHour(trxDate: Date): string {
    const strHour = trxDate.toLocaleString();
    return strHour.substr(11, 8);
  }

  formatQuantities(lsFinancialInformationByClient: FinancialInformation[]) {

    for (const finInfo of lsFinancialInformationByClient) {
      try {
        const idApprovedQuota = this.getElementId('approvedQuota', finInfo.client.id);
        const elementApprovedQuota = document.getElementById(idApprovedQuota);
        const approvedQuotaFormated = this.formatNumberToString(finInfo.approvedQuota);
        elementApprovedQuota.innerText = approvedQuotaFormated;


        const idCurrentQuota = this.getElementId('currentQuota', finInfo.client.id);
        const elementCurrentQuota = document.getElementById(idCurrentQuota);
        const CurrentQuotaFormated = this.formatNumberToString(finInfo.currentQuota);
        elementCurrentQuota.innerText = CurrentQuotaFormated;


        const idConsumedQuota = this.getElementId('consumedQuota', finInfo.client.id);
        const elementConsumedQuota = document.getElementById(idConsumedQuota);
        const ConsumedQuotaFormated = this.formatNumberToString(finInfo.consumedQuota);
        elementConsumedQuota.innerText = ConsumedQuotaFormated;


        const idInTransitQuota = this.getElementId('inTransitQuota', finInfo.client.id);
        const elementInTransitQuota = document.getElementById(idInTransitQuota);
        const InTransitQuotaFormated = this.formatNumberToString(finInfo.inTransitQuota);
        elementInTransitQuota.innerText = InTransitQuotaFormated;

      } catch (ex) {
        console.warn(ex);
      }

    }
  }



  formatNumber(event: any) {
    const { txtApprovedQuota } = this.frmApprovedQuota.controls;

    const numberToTransform = event.target.value.toString().replace(/\,/g, '');


    event.target.value = this.formatNumberToString(numberToTransform);
  }

  formatNumberToString(oNumber: number): string {
    return this.sharedFunction.formatNumberToString(oNumber);
  }

  getElementId(field: string, id: number) {
    return `${field}_${id}`;
  }

  saveFreeUpQuota() {
    const { txtFreeUpQuota, txtFreeUpQuotaObservation } = this.frmFreeUpQuota.controls;
    let trxFreeUpQuota = new Transaction();

    const oClient = this.clientSelected;
    let value = txtFreeUpQuota.value;
    value = value.toString().replace(/\,/g, '');

    const observation = txtFreeUpQuotaObservation.value;
    const movement = this.lsMovements.find(mv => mv.id == this.LIBERACION_DE_CUPO);
    const lsObs: TransactionObservation[] = [];

    this.validatePayment(oClient, value).then(response => {
      if (response) {
        if (observation != '') {
          const trxObservation = new TransactionObservation();
          trxObservation.description = observation;
          lsObs.push(trxObservation);
        }

        trxFreeUpQuota = this.setDataTransaction(oClient, movement, value, null, null, lsObs, null);



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
    const { txtAddQuota, txtAddQuotaObservation } = this.frmAddQuota.controls;
    let trxAddQuota = new Transaction();

    const oClient = this.clientSelected;
    let value = txtAddQuota.value;
    const observation = txtAddQuotaObservation.value;
    const movement = this.lsMovements.find(mv => mv.id == this.ADICION_DE_CUPO);
    const lsObs: TransactionObservation[] = [];
    value = value.toString().replace(/\,/g, '');

    if (observation != '') {
      const trxObservation = new TransactionObservation();
      trxObservation.description = observation;
      lsObs.push(trxObservation);
    }

    trxAddQuota = this.setDataTransaction(oClient, movement, value, null, null, lsObs, null);



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
        const rta = await this.quotaService.validatePaymentVsConsumedQuota(pClient.id, paymentValue);
        if (!rta.response) {
          alert(rta.message);
          resolve(false);
        } else {
          resolve(true);

        }
        this.isAwaiting = false;
        return rta.response;
      });


    } catch (error) {
      console.warn(error);
    }
  }

  cancelQuota() {
    const oClient = this.clientSelected;
    if (confirm(`¿Está seguro de anular el cupo para el cliente ${oClient.name}?`)) {
      const value = 0;
      const { txtCancelQuotaObservation } = this.frmCancelQuota.controls;
      let trxCancelQuota = new Transaction();

      const observation = txtCancelQuotaObservation.value;
      const movement = this.lsMovements.find(mv => mv.id == this.CANCELACION_DE_CUPO);
      const lsObs: TransactionObservation[] = [];

      if (observation != '') {
        const trxObservation = new TransactionObservation();
        trxObservation.description = observation;
        lsObs.push(trxObservation);
      }

      trxCancelQuota = this.setDataTransaction(oClient, movement, value, null, null, lsObs, null);



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
