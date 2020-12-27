import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/Services/client.service';
import { VehicleService } from 'src/app/Services/vehicle.service';
import { ContractService } from 'src/app/Services/contract.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Dealer } from 'src/app/Models/Dealer';
import { Branch } from 'src/app/Models/Branch';
import { BranchService } from 'src/app/Services/branch.service';
import { VehicleModel } from 'src/app/Models/VehicleModel';
import { MaintenanceRoutine } from 'src/app/Models/MaintenanceRoutine';
import { MaintenanceRoutineService } from '../../Services/maintenance-routine.service';
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem';
import { PricesByContract } from 'src/app/Models/PricesByContract';
import { MaintenanceItemService } from 'src/app/Services/maintenance-item.service';
import { Contract } from 'src/app/Models/Contract';
import { SharedFunction } from 'src/app/Models/SharedFunctions';
import { Transaction } from 'src/app/Models/Transaction';
import { MovementService } from '../../Services/movement.service';
import { Movement } from 'src/app/Models/Movement';
import { TransactionDetail } from 'src/app/Models/transactionDetail';
import { Vehicle } from 'src/app/Models/Vehicle';
import { TransactionService } from '../../Services/transaction.service';
import { TransactionObservation } from 'src/app/Models/TransactionObservation';
import { QuotaService } from '../../Services/quota.service';


@Component({
  selector: 'app-work-order',
  templateUrl: './work-order.component.html',
  styleUrls: ['./work-order.component.scss', '../../../assets/styles/checkbox.scss']
})
export class WorkOrderComponent implements OnInit {
  oCountChanges:number;
  frmWorkOrder: FormGroup;
  dealer: Dealer;
  branchSelected: Branch;
  contractSelected: Contract;
  vehicleModelSelected:VehicleModel;
  routineSelected: MaintenanceRoutine;
  lsMaintenanceItems: MaintenanceItem[];
  pricesByContract: PricesByContract;
  sharedFunctions: SharedFunction;
  lsMaintenanceItemsSelected: MaintenanceItem[];
  totalRoutine: number;
  lsMovements: Movement[];
  vehicleSelected:Vehicle;
  ORDEN_DE_TRABAJO = 4;
  isAwaiting: boolean;

  constructor(
    private ClientService: ClientService,
    private vehicleService: VehicleService,
    private contractService:ContractService,
    private branchService:BranchService,
    private maintenanceRoutineService: MaintenanceRoutineService,
    private maintenanceItemService :MaintenanceItemService ,
    private movementService:MovementService,
    private transactionService: TransactionService,
    private quotaService:QuotaService
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

    this.dealer = new Dealer();
    this.dealer.id = 1;
    this.dealer.document = "123456789";
    this.dealer.name ="Autoniza";
  }

  ngOnInit(): void {
    this.initComponents();
  }

  initComponents(){
    this.oCountChanges = 0;
    this.isAwaiting = false;
    this.sharedFunctions = new SharedFunction();
    this.frmWorkOrder.controls.txtDealer.setValue(this.dealer.name.toUpperCase());
    this.getLsMovements();
  }

  getPricesByContract(contract_id:number){
    try {      
      this.maintenanceItemService.getPricesByContract(contract_id).then(
        pricesByContract => {
          this.pricesByContract = pricesByContract;
          console.log('Precios para el contrato: '+contract_id);
          console.log(this.pricesByContract);
          this.updateAmountsAndPrices(this.lsMaintenanceItems, this.pricesByContract)
        }
      )
    } catch (error) {
      console.warn(error);
    }
  }

  getLsMovements(){
    try {
      this.movementService.getMovements().then( dataMovements => { this.lsMovements = dataMovements });
    } catch (error) {
      console.warn(error);
    }
  }

  updateAmountsAndPrices(lsMaintenanceItems: MaintenanceItem[], pricesByContract: PricesByContract){
    console.log(lsMaintenanceItems);   
    this.totalRoutine = 0;    
    lsMaintenanceItems.forEach(mItem =>{
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

  updateLabelTotalRoutine(totalRoutine:string){
    let lblTotalRoutine: HTMLElement = document.querySelector('#lbl-total-routine');
    lblTotalRoutine.innerText = totalRoutine;
  }


  async searchVehicleOwner(client_id: number){
    try{
      this.ClientService.getClientById(client_id).then( data =>{
        let oClient = data;
        console.log(oClient);
      });
    }catch(error){
      console.warn(error);
    }
  }

  async SetDataInForm(){    
    let { txtYear,txtMileage,txtBrand,txtVehicleType,txtVehicleModel, txtClient,
         txtClientDocument, txtContract, txtCurrentQuota, txtConsumedQuota,txtInTransitQuota} = this.frmWorkOrder.controls;
    
    this.resetItemsToRoutine();
    this.resetMaintenanceItems();
    this.calculateTotalRoutine(this.lsMaintenanceItemsSelected);   

    this.vehicleSelected = this.vehicleService.getVehicle();
    console.log(this.vehicleSelected);  

    this.contractService.getContractByVehicleId(this.vehicleSelected.id).then(dataContract =>{
      this.contractSelected = dataContract;

      if( this.contractSelected != null){
        console.log( this.contractSelected);
        txtYear.setValue(this.vehicleSelected.year);
        txtMileage.setValue(this.sharedFunctions.formatNumberToString(this.vehicleSelected.mileage));
        txtBrand.setValue(this.vehicleSelected.vehicleModel.brand.name.toUpperCase());
        txtVehicleType.setValue(this.vehicleSelected.vehicleModel.type.name.toUpperCase());
        txtVehicleModel.setValue(this.vehicleSelected.vehicleModel.shortName.toUpperCase());
        txtClientDocument.setValue( this.contractSelected.client.document);
        txtClient.setValue( this.contractSelected.client.name.toUpperCase());
        let contractDescription = `${ this.contractSelected.code} - ${ this.contractSelected.name}`;
        txtContract.setValue(contractDescription);  
        this.vehicleModelSelected = this.vehicleSelected.vehicleModel;   
        
        this.quotaService.getFinancialInformationByClient(this.contractSelected.client.id).then(
          data => {
            let financialInformation = data;
            txtCurrentQuota.setValue(this.sharedFunctions.formatNumberToString(parseFloat(financialInformation.currentQuota.toString())));
            txtConsumedQuota.setValue(this.sharedFunctions.formatNumberToString(parseFloat(financialInformation.consumedQuota.toString())));
            txtInTransitQuota.setValue(this.sharedFunctions.formatNumberToString(parseFloat(financialInformation.inTransitQuota.toString())));
          }
        );

      }else{
        this.clearFrmWorkOrder();
        this.resetItemsToRoutine();
        this.resetMaintenanceItems();
        this.resetMaintenanceRoutines();
        alert("El vehículo que ingresó no tienen un contrato vínculado, por favor comuniquese con el administrador")
      }      
    });

   
  }

  setBranchSelected(){
    this.branchSelected = this.branchService.getBranchSelected();
  }

  showMaintenanceItems(){
    this.resetItemsToRoutine();
    this.routineSelected = this.maintenanceRoutineService.getRoutine();
    this.lsMaintenanceItems = this.routineSelected.lsItems;
    this.getPricesByContract(this.contractSelected.id);
    console.log(this.routineSelected);
  }

  getTextAmountId(pId: number) {
    return `txt_${pId}`;
  }

  getCheckBoxId(pId: number) {
    return `chk_${pId}`;
  }

  getLabelId(pId: number) {
    return 'lbl_price_' + pId.toString();
  }

  getPriceId(pId:number){
    return `lbl_price_contract_${pId}`;
  }

  pickItem(event:any,pItem: MaintenanceItem) {    
    if(event.checked){
      this.addItemToRoutine(pItem);
      this.enableTxtAmount(pItem);
    }else{
      this.deleteItemToRoutine(pItem);
      this.disableTxtAmount(pItem);
    }
    this.calculateTotalRoutine(this.lsMaintenanceItemsSelected);
  }

  enableTxtAmount(pItem:MaintenanceItem){
    let idTxt = `#${this.getTextAmountId(pItem.id)}`;
    let idLblByItem = `#${this.getLabelId(pItem.id )}`;
    let txtAmount: HTMLInputElement = document.querySelector(idTxt);
    let lblPrice: HTMLElement = document.querySelector(idLblByItem);
    txtAmount.value = pItem.amount.toString();
    txtAmount.disabled = false;
    let totalByItem = pItem.referencePrice * pItem.amount;
    lblPrice.innerText = this.sharedFunctions.formatNumberToString(totalByItem);

  }

  disableTxtAmount(pItem){
    let idTxt = `#${this.getTextAmountId(pItem.id)}`;
    let idLblByItem = `#${this.getLabelId(pItem.id )}`;
    let txtAmount: HTMLInputElement = document.querySelector(idTxt);
    let lblPrice: HTMLElement = document.querySelector(idLblByItem);
    txtAmount.value = '0';
    txtAmount.disabled = true;
    lblPrice.innerText = '';
  }

  turnOnCheckbox(pItem:MaintenanceItem){
    let idChkItem = `#${this.getCheckBoxId(pItem.id)}`;
    let chkItem:HTMLInputElement = document.querySelector(idChkItem); 
    chkItem.checked = true;   
  }

  resetItemsToRoutine(){
    this.lsMaintenanceItemsSelected = [];
  }

  resetMaintenanceItems(){
    this.lsMaintenanceItems = [];
  }

  resetMaintenanceRoutines(){
    this.vehicleModelSelected = new VehicleModel();
    this.vehicleModelSelected.id = 0;
    this.vehicleService.setVehicleModelSelected(null);
  }

 

  addItemToRoutine(item:MaintenanceItem){
    // console.log("addIteToRotine");
    // console.log(this.lsMaintenanceItemsSelected);
    if(this.lsMaintenanceItemsSelected == null || this.lsMaintenanceItemsSelected == undefined ){
      this.resetItemsToRoutine();
    }
    this.lsMaintenanceItemsSelected.push(item);
    console.log(this.lsMaintenanceItemsSelected);
  }

  deleteItemToRoutine(item: MaintenanceItem){
    console.log("addIteToRotine");
    console.log(this.lsMaintenanceItemsSelected);
    let itemTMP = this.lsMaintenanceItemsSelected.find(it => it.id == item.id);
    let indexOfItem = this.lsMaintenanceItemsSelected.indexOf(itemTMP);
    this.lsMaintenanceItemsSelected.splice(indexOfItem, 1);
    console.log(this.lsMaintenanceItemsSelected);
  }

  updateAmountByItem(event: any, pItem:MaintenanceItem){    
    this.lsMaintenanceItemsSelected.find(item => item.id == pItem.id).amount = event.value;
    let mItem = this.lsMaintenanceItemsSelected.find(item => item.id == pItem.id);
    this.updateLabelTotalItem(mItem);
    this.calculateTotalRoutine(this.lsMaintenanceItemsSelected);
  }

  updateLabelTotalItem(mItem:MaintenanceItem){
    let totalByItem = (mItem.amount * mItem.referencePrice) ;
    let idTotalByItem = this.getLabelId(mItem.id);
    let labelTotalByItem: HTMLElement = document.querySelector(`#${idTotalByItem}`);
    labelTotalByItem.innerText = this.sharedFunctions.formatNumberToString(totalByItem);
  }
  
  clearFrmWorkOrder(){
    let { txtYear,txtMileage,txtBrand,txtVehicleType,txtVehicleModel, txtClient,
      txtClientDocument, txtContract,  txtCurrentQuota, txtConsumedQuota,txtInTransitQuota } = this.frmWorkOrder.controls;
    txtYear.setValue('');
    txtMileage.setValue('');
    txtBrand.setValue('');
    txtVehicleType.setValue('');
    txtVehicleModel.setValue('');
    txtClientDocument.setValue('');
    txtClient.setValue('');
    txtContract.setValue('');
    txtCurrentQuota.setValue(''),
    txtConsumedQuota.setValue(''),
    txtInTransitQuota.setValue('');
  }

  formatNumberToString(oNumber:number){
    return this.sharedFunctions.formatNumberToString(oNumber);
  }

  

  calculateTotalRoutine(lsMaintenanceItems:MaintenanceItem[]){
    this.totalRoutine =  0;
    lsMaintenanceItems.forEach(item => {
      this.totalRoutine += (item.referencePrice * item.amount);
    });
    this.updateLabelTotalRoutine(this.sharedFunctions.formatNumberToString(this.totalRoutine));
  }

  async saveWorkOrder(){
    try{
      if(confirm("¿Está seguro de guardar los datos de esta órden de trabajo?")){       
        this.isAwaiting = true;
        let trxWorkOrder = this.setDataToWorkOrder();        
        let financialInformationByClient = await this.quotaService.getFinancialInformationByClient(trxWorkOrder.client.id);
        let trxWillBePorcesed = (( parseFloat(financialInformationByClient.currentQuota.toString()) - trxWorkOrder.value) > 0) ? true:false;
        if(trxWillBePorcesed){
          console.log(trxWorkOrder);        
          this.transactionService.processTransaction(trxWorkOrder).then(response => {  
            let rta = response;
            if(rta.response){
              alert(rta.message);
            }
          });         
        }else{
          alert("¡No se puede procesar esta órden de trabajo puesto que el cliente no cuenta con el suficiente cupo disponible!");
        }
        this.isAwaiting = false;      
      }  

    }
    catch(error){
      console.warn(error);
    }
  }

  setDataToWorkOrder():Transaction{
    let {txtObservation, txtMileage} = this.frmWorkOrder.controls;
    let trxWorkOrder = new Transaction();
    trxWorkOrder.movement = this.lsMovements.find(mv => mv.id == this.ORDEN_DE_TRABAJO);
    trxWorkOrder.value = this.totalRoutine;
    trxWorkOrder.client = this.contractSelected.client;
    trxWorkOrder.usu_id = 0;

    let trxDetail = new TransactionDetail();
    trxDetail.dealer = this.dealer;
    trxDetail.branch = this.branchSelected;
    trxDetail.vehicle = this.vehicleSelected;
    let currentMileage = txtMileage.value
    trxDetail.vehicle.mileage = currentMileage.replace(/\,/g,'') ;
    trxDetail.maintenanceRoutine = this.routineSelected;
    trxDetail.contract = this.contractSelected;    

    trxWorkOrder.headerDetails = trxDetail;
    trxWorkOrder.lsItems = this.lsMaintenanceItemsSelected;

    let aObservation = [];
    let observation = new TransactionObservation()
    observation.description = txtObservation.value;
    observation.usu_id = 0;    
    aObservation.push(observation);
    trxWorkOrder.lsObservations = aObservation;
    

    return trxWorkOrder;
  }

  formatMileageToString(event: any){
    let numberToTransform = event.target.value.toString().replace(/\,/g, '');
    console.log(this.formatNumberToString(numberToTransform));
    event.target.value = this.formatNumberToString(numberToTransform);
  }


}
