import { Component, EventEmitter, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { ClientService } from 'src/app/Modules/client/Services/Client/client.service';
import { VehicleService } from 'src/app/Modules/client/Services/Vehicle/vehicle.service';
import { ContractService } from 'src/app/Modules/contract/Services/Contract/contract.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Dealer } from 'src/app/Models/Dealer';
import { Branch } from 'src/app/Models/Branch';
import { BranchService } from 'src/app/SharedComponents/Services/Branch/branch.service';
import { VehicleModel } from 'src/app/Models/VehicleModel';
import { MaintenanceRoutine } from 'src/app/Models/MaintenanceRoutine';
import { MaintenanceRoutineService } from '../../../items-and-routines/Services/MaintenanceRoutine/maintenance-routine.service';
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem';
import { PricesByContract } from 'src/app/Models/PricesByContract';
import { MaintenanceItemService } from 'src/app/Modules/items-and-routines/Services/MaintenanceItem/maintenance-item.service';
import { Contract } from 'src/app/Models/Contract';
import { SharedFunction } from 'src/app/Models/SharedFunctions';
import { Transaction } from 'src/app/Models/Transaction';
import { MovementService } from '../../../movement/Services/Movement/movement.service';
import { Movement } from 'src/app/Models/Movement';
import { TransactionDetail } from 'src/app/Models/TransactionDetail';
import { Vehicle } from 'src/app/Models/Vehicle';
import { TransactionService } from '../../../../SharedComponents/Services/Transaction/transaction.service';
import { TransactionObservation } from 'src/app/Models/TransactionObservation';
import { QuotaService } from '../../../quota-management/Services/Quota/quota.service';
import { SessionUser } from 'src/app/Models/SessionUser';
import { DealerService } from 'src/app/Modules/dealer/Services/Dealer/dealer.service';
import { Tax } from 'src/app/Models/Tax';
import { SecurityValidators } from 'src/app/Models/SecurityValidators';





@Component({
  selector: 'app-work-order',
  templateUrl: './work-order.component.html',
  styleUrls: ['./work-order.component.scss', '../../../../../assets/styles/checkbox.scss']
})
export class WorkOrderComponent implements OnInit, OnChanges {
  oCountChanges: number;
  frmWorkOrder: FormGroup;
  dealer: Dealer;
  branchSelected: Branch;
  contractSelected: Contract;
  vehicleModelSelected: VehicleModel;
  routineSelected: MaintenanceRoutine;
  lsMaintenanceItems: MaintenanceItem[];
  pricesByContract: PricesByContract;
  sharedFunctions: SharedFunction;
  lsMaintenanceItemsSelected: MaintenanceItem[];
  totalRoutine: number;
  totalTaxes:number;
  totalWithoutTaxes:number;
  lsMovements: Movement[];
  vehicleSelected: Vehicle;
  ORDEN_DE_TRABAJO = 4;
  isAwaiting: boolean;
  @Output() workOrderWasCanceled = new EventEmitter<boolean>();
  @Output() workOrderWasSaved = new EventEmitter<boolean>();

  fieldBranchIsInvalid: boolean;
  fieldMaintenanceRoutineIsInvalid: boolean;

  constructor(
    private ClientService: ClientService,
    private vehicleService: VehicleService,
    private contractService: ContractService,
    private branchService: BranchService,
    private maintenanceRoutineService: MaintenanceRoutineService,
    private maintenanceItemService: MaintenanceItemService,
    private movementService: MovementService,
    private transactionService: TransactionService,
    private quotaService: QuotaService,
    private dealerService: DealerService
  ) {
    this.frmWorkOrder = new FormGroup({
      txtYear: new FormControl(''),
      txtMileage: new FormControl(''),
      txtBrand: new FormControl(''),
      txtVehicleType: new FormControl(''),
      txtVehicleModel: new FormControl(''),
      txtClientDocument: new FormControl(''),
      txtClient: new FormControl(''),
      txtContract: new FormControl(''),
      txtDealer: new FormControl(''),
      txtObservation: new FormControl(''),
      txtCurrentQuota: new FormControl(''),
      txtConsumedQuota: new FormControl(''),
      txtInTransitQuota: new FormControl('')
    });

    this.totalTaxes = 0;
    this.totalWithoutTaxes = 0;
    this.fieldBranchIsInvalid = true;
    this.fieldMaintenanceRoutineIsInvalid = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getDealer();
  }

  ngOnInit(): void {
    this.getDealer();
    this.initComponents();
  }
  getLabeTaxesId(idItem:number):string{
    return `lbl_taxes_${idItem}`;
  }

  getLabeTotalId(idItem:number):string{
    return `lbl_total_${idItem}`;
  }

  getLabePriceByAmountId(idItem:number){
    return `lbl_price_amount_${idItem}`
  }


  getDealer() {
    let userSession: SessionUser = JSON.parse(sessionStorage.getItem('sessionUser'));
    this.dealerService.getDealerById(userSession.company.id)
      .then(dealer => {
        this.dealer = dealer;
        this.frmWorkOrder.controls.txtDealer.setValue(this.dealer.name.toUpperCase());
      });
  }

  initComponents() {
    this.oCountChanges = 0;
    this.isAwaiting = false;
    this.sharedFunctions = new SharedFunction();
    this.getLsMovements();
  }

  getPricesByContract(contract_id: number) {
    try {
      this.maintenanceItemService.getPricesByContract(contract_id).then(
        pricesByContract => {
          this.pricesByContract = pricesByContract;
          console.log('Precios para el contrato: ' + contract_id);
          console.log(this.pricesByContract);
          this.updateAmountsAndPrices(this.lsMaintenanceItems, this.pricesByContract)
        }
      )
    } catch (error) {
      console.warn(error);
    }
  }

  getLsMovements() {
    try {
      this.movementService.getMovements().then(dataMovements => { this.lsMovements = dataMovements });
    } catch (error) {
      console.warn(error);
    }
  }

  updateAmountsAndPrices(lsMaintenanceItems: MaintenanceItem[], pricesByContract: PricesByContract) {
    console.log(lsMaintenanceItems);
    this.totalRoutine = 0;
    lsMaintenanceItems.forEach(mItem => {
      try {
        let priceContract = pricesByContract.lsMaintenanceItems.find(mi => mi.id == mItem.id);
        //console.log(`Precio de referencia: ${mItem.referencePrice} Precio de contrato: ${priceContract.referencePrice}`);
        mItem.referencePrice = priceContract.referencePrice;       
      

        this.updateLabelTotalItem(mItem);
        this.turnOnCheckbox(mItem);
        this.addItemToRoutine(mItem);
      } catch (error) {
        console.warn(error);
      }
    });
    this.calculateTotalRoutine(this.lsMaintenanceItemsSelected);
  }

  updateLabelTotalRoutine(totalRoutine: number) {
    let totalFormatted = totalRoutine.toFixed(2);
    let lblTotalRoutine: HTMLElement = document.querySelector('#lbl-total-routine');
    lblTotalRoutine.innerText =  this.sharedFunctions.formatNumberToString(parseFloat(totalFormatted));;
  }

  updateLabelWithoutTaxes(totalWithoutTaxes:number){
    let totalFormatted = totalWithoutTaxes.toFixed(2);
    let lblTotalWithoutTaxes: HTMLSpanElement = document.querySelector('#lbl-total-without_taxes');
    lblTotalWithoutTaxes.innerText = this.sharedFunctions.formatNumberToString(parseFloat(totalFormatted));
  }

  updateLabelTotalTaxes(totalTaxes:number){
    let totalFormatted = totalTaxes.toFixed(2);
    let lblTotalTaxes: HTMLSpanElement = document.querySelector('#lbl-total-taxes');
    lblTotalTaxes.innerText = this.sharedFunctions.formatNumberToString(parseFloat(totalFormatted));
  }


  async searchVehicleOwner(client_id: number) {
    try {
      this.ClientService.getClientById(client_id).then(data => {
        let oClient = data;
        console.log(oClient);
      });
    } catch (error) {
      console.warn(error);
    }
  }

  async SetDataInForm() {
    try {
      let { txtYear, txtMileage, txtBrand, txtVehicleType, txtVehicleModel, txtClient,
        txtClientDocument, txtContract, txtCurrentQuota, txtConsumedQuota, txtInTransitQuota } = this.frmWorkOrder.controls;

      this.resetItemsToRoutine();
      this.resetMaintenanceItems();
      this.calculateTotalRoutine(this.lsMaintenanceItemsSelected);

      this.vehicleSelected = this.vehicleService.getVehicle();
      console.log(this.vehicleSelected);

      this.contractService.getContractByVehicleId(this.vehicleSelected.id).then(dataContract => {
        this.contractSelected = dataContract;

        if (this.contractSelected != null) {
          console.log(this.contractSelected);
          txtYear.setValue(this.vehicleSelected.year);
          txtMileage.setValue(this.sharedFunctions.formatNumberToString(this.vehicleSelected.mileage));
          txtBrand.setValue(this.vehicleSelected.vehicleModel.brand.name.toUpperCase());
          txtVehicleType.setValue(this.vehicleSelected.vehicleModel.type.name.toUpperCase());
          txtVehicleModel.setValue(this.vehicleSelected.vehicleModel.shortName.toUpperCase());
          txtClientDocument.setValue(this.contractSelected.client.document);
          txtClient.setValue(this.contractSelected.client.name.toUpperCase());
          let contractDescription = `${this.contractSelected.code} - ${this.contractSelected.name}`;
          txtContract.setValue(contractDescription);
          this.vehicleModelSelected = this.vehicleSelected.vehicleModel;

          this.quotaService.getFinancialInformationByClient(this.contractSelected.client.id).then(
            data => {
              if (data == null || data == undefined) {
                throw ("El cliente no tiene un cupo asignado aún, por favor comuniquese con el administrador para que se realice la correspondiente gestión.")
              } else {
                let financialInformation = data;
                txtCurrentQuota.setValue(this.sharedFunctions.formatNumberToString(parseFloat(financialInformation.currentQuota.toString())));
                txtConsumedQuota.setValue(this.sharedFunctions.formatNumberToString(parseFloat(financialInformation.consumedQuota.toString())));
                txtInTransitQuota.setValue(this.sharedFunctions.formatNumberToString(parseFloat(financialInformation.inTransitQuota.toString())));
              }

            }
          ).catch((error) => {
            this.clearFrmWorkOrder();
            this.resetItemsToRoutine();
            this.resetMaintenanceItems();
            this.resetMaintenanceRoutines();
            alert(error);
          });;

        } else {
          throw ("El vehículo que ingresó no tienen un contrato vínculado, por favor comuniquese con el administrador")
        }
      }).catch((error) => {
        this.clearFrmWorkOrder();
        this.resetItemsToRoutine();
        this.resetMaintenanceItems();
        this.resetMaintenanceRoutines();
        alert(error);
      });
    } catch (error) {
      console.warn(error);
    }



  }

  setBranchSelected() {
    this.branchSelected = this.branchService.getBranchSelected();
    if(this.branchSelected == null || this.branchSelected == undefined){
      this.fieldBranchIsInvalid = true;
    }else{
      this.fieldBranchIsInvalid = false;
    }
  }

  showMaintenanceItems() {
    this.resetItemsToRoutine();
    this.routineSelected = this.maintenanceRoutineService.getRoutine();
    if(this.routineSelected == null || this.routineSelected == undefined){
      this.fieldMaintenanceRoutineIsInvalid = true;
    }else{
      this.fieldMaintenanceRoutineIsInvalid = false;
      this.lsMaintenanceItems = this.routineSelected.lsItems;
      this.getPricesByContract(this.contractSelected.id);
      console.log(this.routineSelected);
    }   
  }

  getTextAmountId(pId: number) {
    return `txt_${pId}`;
  }

  getCheckBoxId(pId: number) {
    return `chk_${pId}`;
  }

  getPriceId(pId: number) {
    return `lbl_price_contract_${pId}`;
  }

  pickItem(event: any, pItem: MaintenanceItem) {
    if (event.checked) {
      this.addItemToRoutine(pItem);
      this.enableTxtAmount(pItem);
    } else {
      this.deleteItemToRoutine(pItem);
      this.disableTxtAmount(pItem);
    }
    this.calculateTotalRoutine(this.lsMaintenanceItemsSelected);
  }

  enableTxtAmount(pItem: MaintenanceItem) {
    let idTxt = `#${this.getTextAmountId(pItem.id)}`;
    let txtAmount: HTMLInputElement = document.querySelector(idTxt);
    txtAmount.value = pItem.amount.toString();
    txtAmount.disabled = false;

    let totalByItemWithoutTaxes = (pItem.amount * pItem.referencePrice);

    let taxValue = 0;
    if(pItem.handleTax){
      taxValue = this.calculateTaxes(totalByItemWithoutTaxes, pItem.lsTaxes);
    }  

    let idLabelPriceByAmount = `#${this.getLabePriceByAmountId(pItem.id)}`;
    let labelPriceByAmount: HTMLSpanElement = document.querySelector(idLabelPriceByAmount);
    let totalWithoutTaxesFormatted = totalByItemWithoutTaxes.toFixed(2);
    labelPriceByAmount.innerText = this.sharedFunctions.formatNumberToString(parseFloat(totalWithoutTaxesFormatted));

    let idLabelTax = `#${this.getLabeTaxesId(pItem.id)}` ;
    let labelTax: HTMLSpanElement = document.querySelector(idLabelTax);
    let taxesFormatted = taxValue.toFixed(2)
    labelTax.innerText = this.sharedFunctions.formatNumberToString(parseFloat(taxesFormatted));


    let idLblTotalByItem = `#${this.getLabeTotalId(pItem.id)}`;    
    let lblPriceTotalByItem: HTMLElement = document.querySelector(idLblTotalByItem); 

    let totalByItem = totalByItemWithoutTaxes + taxValue;
    let totalFormatted = totalByItem.toFixed(2);
    lblPriceTotalByItem.innerText = this.sharedFunctions.formatNumberToString(parseFloat(totalFormatted));

  }

  disableTxtAmount(pItem) {
    let idTxt = `#${this.getTextAmountId(pItem.id)}`; 
    let txtAmount: HTMLInputElement = document.querySelector(idTxt);
    txtAmount.value = '0';
    txtAmount.disabled = true;

    let idLabelPriceByAmount = `#${this.getLabePriceByAmountId(pItem.id)}`;
    let labelPriceByAmount: HTMLSpanElement = document.querySelector(idLabelPriceByAmount);
    labelPriceByAmount.innerText = '';

    let idLabelTax = `#${this.getLabeTaxesId(pItem.id)}` ;
    let labelTax: HTMLSpanElement = document.querySelector(idLabelTax);
    labelTax.innerText = '';  

    let idLabelTotal = `#${this.getLabeTotalId(pItem.id)}`;
    let lblPriceWithTaxes: HTMLElement = document.querySelector(idLabelTotal);  
    lblPriceWithTaxes.innerText = '';
  }

  turnOnCheckbox(pItem: MaintenanceItem) {
    let idChkItem = `#${this.getCheckBoxId(pItem.id)}`;
    let chkItem: HTMLInputElement = document.querySelector(idChkItem);
    chkItem.checked = true;
  }

  resetItemsToRoutine() {
    this.lsMaintenanceItemsSelected = [];
  }

  resetMaintenanceItems() {
    this.lsMaintenanceItems = [];
  }

  resetMaintenanceRoutines() {
    this.vehicleModelSelected = new VehicleModel();
    this.vehicleModelSelected.id = 0;
    this.vehicleService.setVehicleModelSelected(null);
  }



  addItemToRoutine(item: MaintenanceItem) {
    // console.log("addIteToRotine");
    // console.log(this.lsMaintenanceItemsSelected);
    if (this.lsMaintenanceItemsSelected == null || this.lsMaintenanceItemsSelected == undefined) {
      this.resetItemsToRoutine();
    }

    let totalByItemWithoutTaxes = (item.amount * item.referencePrice);

    let taxValue = 0;
    if(item.handleTax){
      taxValue = this.calculateTaxes(totalByItemWithoutTaxes, item.lsTaxes);
    }   

    item.taxesValue = parseFloat(taxValue.toFixed(2));

    this.lsMaintenanceItemsSelected.push(item);
    console.log(this.lsMaintenanceItemsSelected);
  }

  deleteItemToRoutine(item: MaintenanceItem) {
    console.log("addIteToRotine");
    console.log(this.lsMaintenanceItemsSelected);
    let itemTMP = this.lsMaintenanceItemsSelected.find(it => it.id == item.id);
    let indexOfItem = this.lsMaintenanceItemsSelected.indexOf(itemTMP);
    this.lsMaintenanceItemsSelected.splice(indexOfItem, 1);
    console.log(this.lsMaintenanceItemsSelected);
  }

  updateAmountByItem(event: any, pItem: MaintenanceItem) {
    this.lsMaintenanceItemsSelected.find(item => item.id == pItem.id).amount = event.value;
    let mItem = this.lsMaintenanceItemsSelected.find(item => item.id == pItem.id);
    this.updateLabelTotalItem(mItem);
    this.calculateTotalRoutine(this.lsMaintenanceItemsSelected);
  }

  updateLabelTotalItem(mItem: MaintenanceItem) {
    let totalByItemWithoutTaxes = (mItem.amount * mItem.referencePrice);

    let taxValue = 0;
    if(mItem.handleTax){
      taxValue = this.calculateTaxes(totalByItemWithoutTaxes, mItem.lsTaxes);
    }      

    this.setTaxesValue(mItem.id,taxValue);

    console.log(`Total by  Item Without: ${totalByItemWithoutTaxes} Total taxes: ${taxValue}`);

    let totalByItem = parseFloat(totalByItemWithoutTaxes.toString()) + parseFloat(taxValue.toString());
    
    let idTotalWithoutTaxes = `#${this.getLabePriceByAmountId(mItem.id)}`;
    let labelTotalWithoutTaxes: HTMLSpanElement = document.querySelector(idTotalWithoutTaxes);
    let totalwithoutTaxesFormatted = totalByItemWithoutTaxes.toFixed(2);
    labelTotalWithoutTaxes.innerText = this.sharedFunctions.formatNumberToString(parseFloat(totalwithoutTaxesFormatted));

    let idTotalByItem = this.getLabeTotalId(mItem.id);
    let labelTotalByItem: HTMLElement = document.querySelector(`#${idTotalByItem}`);

    let TotalFormatted = totalByItem.toFixed(2)
    labelTotalByItem.innerText = this.sharedFunctions.formatNumberToString(parseFloat(TotalFormatted));
  }

  clearFrmWorkOrder() {
    this.frmWorkOrder.reset();
    this.fieldBranchIsInvalid = true;
    this.fieldMaintenanceRoutineIsInvalid = true;
  }

  formatNumberToString(oNumber: number) {
    return this.sharedFunctions.formatNumberToString(oNumber);
  }



  calculateTotalRoutine(lsMaintenanceItems: MaintenanceItem[]) {
    this.totalRoutine = 0;
    this.totalTaxes = 0;
    this.totalWithoutTaxes = 0;

    lsMaintenanceItems.forEach(item => {
      let idSpanWithoutTaxes = `#${this.getLabePriceByAmountId(item.id)}`;
      let spanWithoutTaxes: HTMLSpanElement = document.querySelector(idSpanWithoutTaxes);

      let idItemReference = `#${this.getLabeTotalId(item.id)}`;
      let spanElemt: HTMLSpanElement = document.querySelector(idItemReference);

      let idSpanTax = `#${this.getLabeTaxesId(item.id)}`;
      let spanTaxes: HTMLSpanElement = document.querySelector(idSpanTax);

     
      let valueWithoutTaxes = spanWithoutTaxes.innerText.replace(/,/g,'');
      let valueTaxesByItem = spanTaxes.innerText.replace(/,/g,'');
      let valueTotalByItem = spanElemt.innerText.replace(/,/g,'');
      

      this.totalWithoutTaxes += parseFloat(valueWithoutTaxes);
      this.totalTaxes += parseFloat(valueTaxesByItem);
      this.totalRoutine += parseFloat(valueTotalByItem);
    });
    this.updateLabelWithoutTaxes(this.totalWithoutTaxes);
    this.updateLabelTotalTaxes(this.totalTaxes);
    this.updateLabelTotalRoutine(this.totalRoutine);    
  }

  async saveWorkOrder() {
    try {
      if (confirm("¿Está seguro de guardar los datos de esta órden de trabajo?")) {
        this.isAwaiting = true;
        let trxWorkOrder = this.setDataToWorkOrder();
        console.log("[SAVE WORK ORDER]");
        console.log(trxWorkOrder);

        let financialInformationByClient = await this.quotaService.getFinancialInformationByClient(trxWorkOrder.client.id);
        let trxWillBePorcesed = ((parseFloat(financialInformationByClient.currentQuota.toString()) - trxWorkOrder.value) > 0) ? true : false;
        if (trxWillBePorcesed) {
          console.log(trxWorkOrder);
          this.isAwaiting = true;
          await this.transactionService.processTransaction(trxWorkOrder).then(response => {
            let rta = response;
            if (rta.response) {
              alert(rta.message);
              this.workOrderWasSaved.emit(true);
            }
          });
          this.isAwaiting = true;
        } else {
          alert("¡No se puede procesar esta órden de trabajo puesto que el cliente no cuenta con el suficiente cupo disponible!");
        }
        this.isAwaiting = false;
      }

    }
    catch (error) {
      console.warn(error);
    }
  }

  setDataToWorkOrder(): Transaction {
    try {
      let { txtObservation, txtMileage } = this.frmWorkOrder.controls;
      let trxWorkOrder = new Transaction();
      trxWorkOrder.movement = this.lsMovements.find(mv => mv.id == this.ORDEN_DE_TRABAJO);
      trxWorkOrder.valueWithoutTaxes = this.totalWithoutTaxes;
      trxWorkOrder.taxesValue = this.totalTaxes;
      trxWorkOrder.value = this.totalRoutine;
      trxWorkOrder.client = this.contractSelected.client;
      trxWorkOrder.usu_id = SecurityValidators.validateUserLogged();

      let trxDetail = new TransactionDetail();
      trxDetail.dealer = this.dealer;
      
      if(this.branchSelected == null || this.branchSelected == undefined){
        throw("La sucursal es un dato obligatorio para poder cerrar la orden de trabajo");
      }else{
        trxDetail.branch = this.branchSelected;
      }

      if(this.vehicleSelected == null || this.vehicleSelected == undefined){
        throw("El vehículo ingresado no es válido, por favor rectifique la placa");
      }else{
        trxDetail.vehicle = this.vehicleSelected;
        let currentMileage = txtMileage.value
        trxDetail.vehicle.mileage = currentMileage.replace(/\,/g, '');
      }
      

      if(this.routineSelected == null || this.routineSelected == undefined){
        this.fieldMaintenanceRoutineIsInvalid = true;
      }else{
        trxDetail.maintenanceRoutine = this.routineSelected;        
      }

      trxDetail.contract = this.contractSelected;
     

      trxWorkOrder.headerDetails = trxDetail;
      trxWorkOrder.lsItems = this.lsMaintenanceItemsSelected;

      let aObservation = [];
      let observation = new TransactionObservation()
      observation.description = txtObservation.value;
      observation.usu_id = SecurityValidators.validateUserLogged();;
      aObservation.push(observation);
      trxWorkOrder.lsObservations = aObservation;


      return trxWorkOrder;
    } catch (error) {      
      alert(error);
      return null;
    }

  }

  formatMileageToString(event: any) {
    let numberToTransform = event.target.value.toString().replace(/\,/g, '');
    console.log(this.formatNumberToString(numberToTransform));
    event.target.value = this.formatNumberToString(numberToTransform);
  }

  closeWorkOrder() {
    if (confirm("¿está seguro que desea cerrar la orden de trabajo?, sí lo realiza se perderan todos los cambios consignados acá")) {
      this.clearFrmWorkOrder();
      this.workOrderWasCanceled.emit(true);
    }
  }


  calculateTaxes(referencePrice: number,lsTaxes: Tax[]): number {
    let taxValue = 0;
    for (const tax of lsTaxes) {
      let taxTmp = referencePrice * (tax.percentValue / 100);
      taxValue += taxTmp;
    }                                                                                                                                                                 
    return taxValue
  }  
  
  
  
  setTaxesValue(item_id:number,taxesValue:number){
    try {
      let idLblTaxes = `#${this.getLabeTaxesId(item_id)}`;
      let labelTaxes: HTMLSpanElement  = document.querySelector(idLblTaxes);
      let taxesFormatted = this.sharedFunctions.formatNumberToString(parseFloat(taxesValue.toFixed(2)))
      labelTaxes.innerText = taxesFormatted;
    } catch (error) {
      console.warn(error);
    }
  }


  setTotalValue(item_id:number,totalValue:number){
    try {
      //console.log(`[setTotalValue] : ${totalValue}`);
      let idLblTotal = `#${this.getLabeTotalId(item_id)}`;
      let labelTotal: HTMLSpanElement  = document.querySelector(idLblTotal);

      let totalFormatted = this.sharedFunctions.formatNumberToString(parseFloat(totalValue.toFixed(2)))
      labelTotal.innerText = totalFormatted;
    } catch (error) {
      console.warn(error);
    }
  }


}
