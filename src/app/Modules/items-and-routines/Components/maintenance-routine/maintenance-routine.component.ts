import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder,Validators } from '@angular/forms';
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem';
import { MaintenanceRoutine } from 'src/app/Models/MaintenanceRoutine';
import { VehicleModel } from 'src/app/Models/VehicleModel';
import { MaintenanceItemService } from '../../Services/MaintenanceItem/maintenance-item.service';
import { MaintenanceRoutineService } from '../../Services/MaintenanceRoutine/maintenance-routine.service';
import { VehicleService } from '../../../client/Services/Vehicle/vehicle.service';
import { SharedFunction } from 'src/app/Models/SharedFunctions';
import { Frequency } from 'src/app/Models/Frequency';

@Component({
  selector: 'app-maintenance-routine',
  templateUrl: './maintenance-routine.component.html',
  styleUrls: ['./maintenance-routine.component.scss', '../../../../../assets/styles/app.scss', '../../../../../assets/styles/checkbox.scss']
})

export class MaintenanceRoutineComponent implements OnInit, OnChanges {
  frmMaintenanceRoutine: FormGroup;
  lsMaintenanceItems: MaintenanceItem[];
  lsItemsSelected: MaintenanceItem[];
  @Output() routineWasSaved = new EventEmitter<boolean>();
  @Output() routinewasCanceled = new EventEmitter<boolean>();
  @Input() countChanges: number;
  routineToUpdate: MaintenanceRoutine;
  sharedFunction: SharedFunction;
  frequency_id: number;
  vehicleModel_id: number;
  routineIsValid: boolean;
  msgRoutineDuplicated:string;
  initialRoutine: number;


  constructor(
    private maintenanceItemService: MaintenanceItemService,
    private vehicleService: VehicleService,
    private maintenanceRoutineService: MaintenanceRoutineService,
    private formBuilder: FormBuilder
  ) {
    this.frmMaintenanceRoutine = this.formBuilder.group({
      name: ['',[Validators.required]],
      referencePrice: ['',]
    }); 

    this.sharedFunction = new SharedFunction();
    this.routineIsValid = true;
    this.initialRoutine = 0;
    this.vehicleModel_id = 0;
    this.frequency_id = 0;
    this.msgRoutineDuplicated = "";
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (let change in changes) {
      if (change == "countChanges") {
        this.routineToUpdate = this.maintenanceRoutineService.getRoutine();
        if (this.routineToUpdate != null) {
          this.setDataInForm(this.routineToUpdate);

          this.routineIsValid = true;
          this.vehicleModel_id = this.routineToUpdate.vehicleModel.id;
          this.frequency_id = this.routineToUpdate.frequency.id;
          this.initialRoutine =  this.routineToUpdate.frequency.id;

          console.log("[routineIsValid]",this.routineIsValid);
          console.log("[fieldName.invalid]",this.fieldName.invalid);
          console.log("[initialRoutine]",this.initialRoutine);
          console.log((this.fieldName.invalid || !this.routineIsValid))


        } else {
          this.clearDataForm();
        }
      }
    }
  }

  ngOnInit(): void {
    this.initComponents();
    console.log("[routineIsValid]",this.routineIsValid);
    console.log("[fieldName.invalid]",this.fieldName.invalid);
  }

  async initComponents() {
    this.lsMaintenanceItems = [];
    this.lsItemsSelected = [];
  }

  async GetItemsByVehicleModel() {
    let oVehicleModel = this.vehicleService.getVehicleModelSelected();
    console.log("[Vehicle model id]", oVehicleModel.id);
    this.lsMaintenanceItems = await this.maintenanceItemService.getItemsByVehicleModel(oVehicleModel.id);
  }

  getVehicleModelName(pVehicleModel: VehicleModel) {
    if (pVehicleModel != null) {
      return pVehicleModel.shortName;
    } else {
      return 'Genérico'
    }
  }

  validateAmountByItem(event: any, pItem: MaintenanceItem) {
    try {
      let amountValue = event.target.value;
      if (amountValue < 0) {
        event.target.value = 0;
        throw ("No se permiten cantidades negativas");
      }
      this.calculatePriceByItem(amountValue, pItem);
      this.calculateRoutinePrice();
      this.updateAmountOfItem(pItem, amountValue);
    } catch (error) {
      alert(error);
    }

  }

  calculatePriceByItem(amount: number, item: MaintenanceItem) {
    try {
      let price = amount * item.referencePrice;
      let taxes = parseFloat(this.calculateTaxesByItem(item, amount));
      let totalByItem = (price + taxes);

      console.log("[Precio por item]: ", price);
      console.log("[Impuestos por item]", taxes);
      console.log("[Total + item]"), totalByItem;
      this.showInfoItemIntoRow(item.id, price, taxes, totalByItem);

    } catch (error) {
      console.warn(error);
    }

  }

  showInfoItemIntoRow(item_id: number, priceWothoutTaxes: number, taxes: number, priceWithTaxes: number) {
    try {
      let idSpan = 'lbl_price_' + item_id.toString();
      let spanPrice: HTMLSpanElement = document.getElementById(idSpan);

      let idSpanTaxes = `#${this.getLabelTaxesId(item_id)}`;
      let spanTaxes: HTMLSpanElement = document.querySelector(idSpanTaxes);

      let idSpanTotalWithTaxes = `#${this.getLabelTotalWithTaxes(item_id)}`;
      let spanTotalByItem: HTMLSpanElement = document.querySelector(idSpanTotalWithTaxes);

      priceWothoutTaxes = parseFloat(priceWothoutTaxes.toFixed(2));
      taxes = parseFloat(taxes.toFixed(2));
      priceWithTaxes = parseFloat(priceWithTaxes.toFixed(2));

      spanPrice.innerText = this.sharedFunction.formatNumberToString(priceWothoutTaxes);
      spanTaxes.innerText = this.sharedFunction.formatNumberToString(taxes);
      spanTotalByItem.innerText = this.sharedFunction.formatNumberToString(priceWithTaxes);
    } catch (error) {
      console.warn(error);
    }
  }

  pickItem(event: any, pItem: MaintenanceItem) {
    console.log("[pick item]", event.checked, pItem.id);
    let idTxt = `#txt_${pItem.id}`;
    let txtAmount: HTMLInputElement = document.querySelector(idTxt);
    let idSpanPrice = `#lbl_price_${pItem.id}`;
    let spanPrice: HTMLSpanElement = document.querySelector(idSpanPrice);

    if (event.checked) {
      txtAmount.disabled = false;
      this.addOrUpdateMaintenanceItemIntoList(pItem);
    } else {
      txtAmount.value = '0';
      spanPrice.innerText = '';
      txtAmount.disabled = true;
      this.calculateRoutinePrice();
      this.deleteMaintenanceItemToList(pItem);
    }
  }

  updateAmountOfItem(pItem: MaintenanceItem, amount: number) {
    let oItemTmp = this.lsItemsSelected.find(item => item.id == pItem.id);
    let indexElement = this.lsItemsSelected.indexOf(oItemTmp);
    console.log("[index of " + pItem.name + "]", indexElement)
    this.lsItemsSelected[indexElement].amount = amount;
  }

  addOrUpdateMaintenanceItemIntoList(pItem: MaintenanceItem) {
    let oItem = this.lsItemsSelected.find(item => item.id == pItem.id);
    if (oItem != null) {
      let indexItem = this.lsItemsSelected.indexOf(oItem);
      this.lsItemsSelected[indexItem] = pItem;
    } else {
      this.lsItemsSelected.push(pItem);
    }

  }

  deleteMaintenanceItemToList(pItem: MaintenanceItem) {
    let indexElement = this.lsItemsSelected.indexOf(pItem);
    this.lsItemsSelected.splice(indexElement);
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

  getLabelTaxesId(pId: number) {
    return 'lbl_taxes_' + pId.toString();
  }

  getLabelTotalWithTaxes(pId: number) {
    return 'lbl_total_with_taxes_' + pId.toString();
  }

  calculateRoutinePrice() {
    try {
      let { referencePrice } = this.frmMaintenanceRoutine.controls;
      let lblTotalPrice: HTMLSpanElement = document.querySelector("#lbl-total-routine")
      let aTotalByItem = document.getElementsByClassName("lbl-total-price-with-taxes");
      let totalPrice = 0;

      for (let i = 0; i < aTotalByItem.length; i++) {
        let priceItem = aTotalByItem[i].textContent;
        if (priceItem.trim() != '') {
          let priceFormated = priceItem.replace(/,/g, '');
          totalPrice += parseFloat(priceFormated);
        }
      }

      let nTotalPrice = parseFloat(totalPrice.toFixed(2));
      let totalFormated = this.sharedFunction.formatNumberToString(nTotalPrice);
      console.log(nTotalPrice);
      referencePrice.setValue(totalFormated);
      lblTotalPrice.innerText = totalFormated;

    } catch (error) {
      console.warn(error);
    }

  }

  calculateTaxesByItem(item: MaintenanceItem, amount: number) {
    try {
      let priceWithoutTaxes = item.referencePrice * amount;
      let taxesValue = 0
      if (item.handleTax) {
        for (const tax of item.lsTaxes) {
          taxesValue += priceWithoutTaxes * (tax.percentValue / 100);
        }
      }
      return taxesValue.toFixed(2);
    } catch (error) {
      console.warn(error);
    }
  }


  async saveMaintenanceRoutine() {
    try {
      this.calculateRoutinePrice();
      let { name, referencePrice } = this.frmMaintenanceRoutine.controls;
      let oMaintenenceRoutine = new MaintenanceRoutine();
      if (this.routineToUpdate != null) {
        oMaintenenceRoutine.id = this.routineToUpdate.id;
      }
      oMaintenenceRoutine.name = name.value;
      let totalPrice = parseFloat(referencePrice.value.replace(/,/g, ''))
      oMaintenenceRoutine.referencePrice = totalPrice;
      oMaintenenceRoutine.vehicleModel = this.vehicleService.getVehicleModelSelected();
      oMaintenenceRoutine.frequency = this.maintenanceRoutineService.getFrecuencySelected();
      oMaintenenceRoutine.lsItems = this.lsItemsSelected;
      console.log(oMaintenenceRoutine);
      this.maintenanceRoutineService.setRoutine(oMaintenenceRoutine);
      this.routineWasSaved.emit(true);
    } catch (error) {
      console.warn(error);
    }

  }

  cancelRoutine() {
    this.routinewasCanceled.emit(true);
  }

  async setDataInForm(pRoutine: MaintenanceRoutine) {

    this.frmMaintenanceRoutine.patchValue(pRoutine);    
    this.maintenanceRoutineService.setFrecuencySelected(pRoutine.frequency);
    this.vehicleService.setBrandSelected(pRoutine.vehicleModel.brand);
    this.vehicleService.setVehicleTypeSelected(pRoutine.vehicleModel.type);
    this.vehicleService.setVehicleModelSelected(pRoutine.vehicleModel);

    this.maintenanceItemService.getItemsByVehicleModel(pRoutine.vehicleModel.id)
      .then((data) => {
        this.lsMaintenanceItems = data;

        setTimeout(() => {
          console.log(pRoutine.lsItems);
          if (pRoutine.lsItems != null) {
            this.validateItemsToRoutine(pRoutine.lsItems);
            this.calculateRoutinePrice();
          }
        }, 500);

      });

  }

  validateItemsToRoutine(pLsItems: MaintenanceItem[]) {
    pLsItems.forEach(item => {
      this.addOrUpdateMaintenanceItemIntoList(item);
      this.setDataInItemRow(item);
    });

    console.warn("[item selected tmp]: ", this.lsItemsSelected);
  }

  setDataInItemRow(pItem: MaintenanceItem) {
    try {
      let idChechBox = `#${this.getCheckBoxId(pItem.id)}`;
      let idTextBoxAmount = `#${this.getTextAmountId(pItem.id)}`;
      console.log("[Checkbox id]", idChechBox);

      let chkItem: HTMLInputElement = document.querySelector(idChechBox);
      let txtAmount: HTMLInputElement = document.querySelector(idTextBoxAmount);

      chkItem.checked = true;
      txtAmount.disabled = false;
      txtAmount.value = pItem.amount.toString();

      this.calculatePriceByItem(pItem.amount, pItem);

    } catch (error) {
      console.error(error);
    }

  }

  clearDataForm() {
    this.frmMaintenanceRoutine.reset();
    this.maintenanceRoutineService.setFrecuencySelected(null);
    this.vehicleService.setVehicleModelSelected(null);

    this.vehicleService.setBrandSelected(null);
    this.vehicleService.setVehicleTypeSelected(null);

    this.lsMaintenanceItems = [];
    let lblTotalPrice: HTMLSpanElement = document.querySelector("#lbl-total-routine");
    lblTotalPrice.textContent = '';
  }

  vehicleWasChanged() {
    if (this.routineToUpdate != null) {
      let oVehicleModelSelected = this.vehicleService.getVehicleModelSelected();
      if (oVehicleModelSelected.id != this.routineToUpdate.vehicleModel.id) {
        if (confirm("¿Está seguro que desea modificar la línea?, al hacer eso perderá todos los cambios registrados hasta el momento")) {
          this.GetItemsByVehicleModel();
          this.lsItemsSelected = [];
          this.routineToUpdate.lsItems = [];
          let { referencePrice } = this.frmMaintenanceRoutine.controls;
          let lblTotalPrice: HTMLSpanElement = document.querySelector("#lbl-total-routine");
          referencePrice.setValue(0);
          lblTotalPrice.textContent = '';
        } else {
          this.GetItemsByVehicleModel();
        }
      }
      this.validateItemsToRoutine(this.routineToUpdate.lsItems);
    }
    else {
      this.GetItemsByVehicleModel();
    }
  }

  setBrand() {
    this.countChanges += 1;
  }

  setVehiclType() {
    this.countChanges += 1; +
      console.log("cambia el tipo");
  }

  setFrequency(frequency:Frequency){

    if(frequency != null && frequency != undefined){
      this.frequency_id = frequency.id;
    }else{
      this.frequency_id = 0;
    }
    
    if(this.initialRoutine != this.frequency_id){
      this.validateRoutineAndFrequency(this.vehicleModel_id,this.frequency_id);
    }else{
      this.routineIsValid = true;
      this.msgRoutineDuplicated = "";
    }
    
  }

  setVehicleModel(vehicleModel:VehicleModel){
    if(vehicleModel != null && vehicleModel != undefined){
      this.vehicleModel_id = vehicleModel.id;
    }else{
      this.vehicleModel_id = 0;
    }

    this.validateRoutineAndFrequency(this.vehicleModel_id,this.frequency_id);
  }

  async validateRoutineAndFrequency(routine_id:number,frequency_id: number){
    console.log(routine_id,frequency_id);
    this.maintenanceRoutineService.ValidateRoutineAndFrequency(routine_id,frequency_id)
    .then( rta => {
      console.log("[validateRoutineAndFrequency]");
      console.log(rta.response);
      console.log(rta.message);
      this.routineIsValid = rta.response;
      this.msgRoutineDuplicated = rta.message;
    });
  }

  get fieldName(){
    return this.frmMaintenanceRoutine.get('name');
  }
}
