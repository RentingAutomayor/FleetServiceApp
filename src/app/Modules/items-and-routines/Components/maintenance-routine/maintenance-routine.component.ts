import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem';
import { MaintenanceRoutine } from 'src/app/Models/MaintenanceRoutine';
import { VehicleModel } from 'src/app/Models/VehicleModel';
import { MaintenanceItemService } from '../../Services/MaintenanceItem/maintenance-item.service';
import { MaintenanceRoutineService } from '../../Services/MaintenanceRoutine/maintenance-routine.service';
import { VehicleService } from '../../../client/Services/Vehicle/vehicle.service';
import { SharedFunction } from 'src/app/Models/SharedFunctions';
import { Frequency } from 'src/app/Models/Frequency';
import { Brand } from 'src/app/Models/Brand';

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
  msgRoutineDuplicated: string;
  initialRoutine: number;

  disableControls: boolean;
  @Input('disableControls')
  set setDisableControls(value: boolean){
    this.disableControls = value;
    if (this.disableControls){
      this.frmMaintenanceRoutine.controls.name.disable();
    }else{
      this.frmMaintenanceRoutine.controls.name.enable();
    }
  }

  brandSelected: Brand  = null;


  constructor(
    private maintenanceItemService: MaintenanceItemService,
    private vehicleService: VehicleService,
    private maintenanceRoutineService: MaintenanceRoutineService,
    private formBuilder: FormBuilder
  ) {
    this.frmMaintenanceRoutine = this.formBuilder.group({
      name: ['', [Validators.required]],
      referencePrice: ['', ]
    });

    this.sharedFunction = new SharedFunction();
    this.routineIsValid = true;
    this.initialRoutine = 0;
    this.vehicleModel_id = 0;
    this.frequency_id = 0;
    this.msgRoutineDuplicated = '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const change in changes) {
      if (change == 'countChanges') {
        this.routineToUpdate = this.maintenanceRoutineService.getRoutine();
        if (this.routineToUpdate != null) {
          this.setDataInForm(this.routineToUpdate);

          this.routineIsValid = true;
          this.vehicleModel_id = this.routineToUpdate.vehicleModel.id;
          this.frequency_id = this.routineToUpdate.frequency.id;
          this.initialRoutine =  this.routineToUpdate.frequency.id;
        } else {
          this.clearDataForm();
        }
      }
    }
  }

  ngOnInit(): void {
    this.initComponents();
  }

  async initComponents() {
    this.lsMaintenanceItems = [];
    this.lsItemsSelected = [];
  }

  async GetItemsByVehicleModel() {
    const oVehicleModel = this.vehicleService.getVehicleModelSelected();
    this.lsMaintenanceItems = await this.maintenanceItemService.getItemsByVehicleModel(oVehicleModel.id);
  }

  getVehicleModelName(pVehicleModel: VehicleModel) {
    if (pVehicleModel != null) {
      return pVehicleModel.shortName;
    } else {
      return 'Genérico';
    }
  }

  validateAmountByItem(event: any, pItem: MaintenanceItem) {
    try {
      const amountValue = event.target.value;
      if (amountValue < 0) {
        event.target.value = 0;
        throw new Error(('No se permiten cantidades negativas'));
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
      const price = amount * item.referencePrice;
      const taxes = parseFloat(this.calculateTaxesByItem(item, amount));
      const totalByItem = Math.round((price + taxes));
      this.showInfoItemIntoRow(item.id, price, taxes, totalByItem);

    } catch (error) {
      console.warn(error);
    }

  }

  showInfoItemIntoRow(item_id: number, priceWothoutTaxes: number, taxes: number, priceWithTaxes: number) {
    try {
      const idSpan = 'lbl_price_' + item_id.toString();
      const spanPrice: HTMLSpanElement = document.getElementById(idSpan);

      const idSpanTaxes = `#${this.getLabelTaxesId(item_id)}`;
      const spanTaxes: HTMLSpanElement = document.querySelector(idSpanTaxes);

      const idSpanTotalWithTaxes = `#${this.getLabelTotalWithTaxes(item_id)}`;
      const spanTotalByItem: HTMLSpanElement = document.querySelector(idSpanTotalWithTaxes);

      priceWothoutTaxes = Math.round(parseFloat(priceWothoutTaxes.toFixed(2)));
      taxes = Math.round(parseFloat(taxes.toFixed(2)));
      priceWithTaxes = Math.round(parseFloat(priceWithTaxes.toFixed(2)));

      spanPrice.innerText = this.sharedFunction.formatNumberToString(priceWothoutTaxes);
      spanTaxes.innerText = this.sharedFunction.formatNumberToString(taxes);
      spanTotalByItem.innerText = this.sharedFunction.formatNumberToString(priceWithTaxes);
    } catch (error) {
      console.warn(error);
    }
  }

  pickItem(event: any, pItem: MaintenanceItem) {

    const idTxt = `#txt_${pItem.id}`;
    const txtAmount: HTMLInputElement = document.querySelector(idTxt);
    const idSpanPrice = `#lbl_price_${pItem.id}`;
    const spanPrice: HTMLSpanElement = document.querySelector(idSpanPrice);

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
    const oItemTmp = this.lsItemsSelected.find(item => item.id == pItem.id);
    const indexElement = this.lsItemsSelected.indexOf(oItemTmp);

    this.lsItemsSelected[indexElement].amount = amount;
  }

  addOrUpdateMaintenanceItemIntoList(pItem: MaintenanceItem) {
    const oItem = this.lsItemsSelected.find(item => item.id == pItem.id);
    if (oItem != null) {
      const indexItem = this.lsItemsSelected.indexOf(oItem);
      this.lsItemsSelected[indexItem] = pItem;
    } else {
      this.lsItemsSelected.push(pItem);
    }

  }

  deleteMaintenanceItemToList(pItem: MaintenanceItem) {
    const indexElement = this.lsItemsSelected.indexOf(pItem);
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
      const { referencePrice } = this.frmMaintenanceRoutine.controls;
      const lblTotalPrice: HTMLSpanElement = document.querySelector('#lbl-total-routine');
      const aTotalByItem = document.getElementsByClassName('lbl-total-price-with-taxes');
      let totalPrice = 0;

      for (let i = 0; i < aTotalByItem.length; i++) {
        const priceItem = aTotalByItem[i].textContent;
        if (priceItem.trim() != '') {
          const priceFormated = priceItem.replace(/,/g, '');
          totalPrice += Math.round(parseFloat(priceFormated));
        }
      }

      const nTotalPrice = Math.round(parseFloat(totalPrice.toFixed(2)));
      const totalFormated = this.sharedFunction.formatNumberToString(nTotalPrice);

      referencePrice.setValue(totalFormated);
      lblTotalPrice.innerText = totalFormated;

    } catch (error) {
      console.warn(error);
    }

  }

  calculateTaxesByItem(item: MaintenanceItem, amount: number) {
    try {
      const priceWithoutTaxes = item.referencePrice * amount;
      let taxesValue = 0;
      if (item.handleTax) {
        for (const tax of item.lsTaxes) {
          taxesValue += Math.round(priceWithoutTaxes * (tax.percentValue / 100));
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
      const { name, referencePrice } = this.frmMaintenanceRoutine.controls;
      const oMaintenenceRoutine = new MaintenanceRoutine();
      if (this.routineToUpdate != null) {
        oMaintenenceRoutine.id = this.routineToUpdate.id;
      }
      oMaintenenceRoutine.name = name.value;
      const totalPrice = parseFloat(referencePrice.value.replace(/,/g, ''));
      oMaintenenceRoutine.referencePrice = totalPrice;
      oMaintenenceRoutine.vehicleModel = this.vehicleService.getVehicleModelSelected();
      oMaintenenceRoutine.frequency = this.maintenanceRoutineService.getFrecuencySelected();
      oMaintenenceRoutine.lsItems = this.lsItemsSelected;

      this.maintenanceRoutineService.setRoutine(oMaintenenceRoutine);
      this.routineWasSaved.emit(true);
    } catch (error) {
      console.warn(error);
    }

  }

  cancelRoutine() {
    this.routinewasCanceled.emit(true);
  }

  setDataInForm(pRoutine: MaintenanceRoutine) {

    this.frmMaintenanceRoutine.patchValue(pRoutine);
    this.maintenanceRoutineService.setFrecuencySelected(pRoutine.frequency);


    this.brandSelected = pRoutine.vehicleModel.brand;
    this.vehicleService.setVehicleTypeSelected(pRoutine.vehicleModel.type);
    this.vehicleService.setVehicleModelSelected(pRoutine.vehicleModel);

    this.maintenanceItemService.getItemsByVehicleModel(pRoutine.vehicleModel.id)
      .then((data) => {
        this.lsMaintenanceItems = data;

        setTimeout(() => {

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

    console.warn('[item selected tmp]: ', this.lsItemsSelected);
  }

  setDataInItemRow(pItem: MaintenanceItem) {
    try {
      const idChechBox = `#${this.getCheckBoxId(pItem.id)}`;
      const idTextBoxAmount = `#${this.getTextAmountId(pItem.id)}`;


      const chkItem: HTMLInputElement = document.querySelector(idChechBox);
      const txtAmount: HTMLInputElement = document.querySelector(idTextBoxAmount);

      chkItem.checked = true;
      txtAmount.disabled = this.disableControls;
      txtAmount.value = pItem.amount.toString();

      this.calculatePriceByItem(pItem.amount, pItem);

    } catch (error) {
      console.error(error);
    }

  }

  clearDataForm() {
    this.frmMaintenanceRoutine.reset();
    this.brandSelected = null;

    this.maintenanceRoutineService.setFrecuencySelected(null);
    this.vehicleService.setVehicleModelSelected(null);
    this.vehicleService.setVehicleTypeSelected(null);

    this.lsMaintenanceItems = [];
    const lblTotalPrice: HTMLSpanElement = document.querySelector('#lbl-total-routine');
    lblTotalPrice.textContent = '';
  }

  vehicleWasChanged() {
    if (this.routineToUpdate != null) {
      const oVehicleModelSelected = this.vehicleService.getVehicleModelSelected();
      if (oVehicleModelSelected.id != this.routineToUpdate.vehicleModel.id) {
        if (confirm('¿Está seguro que desea modificar la línea?, al hacer eso perderá todos los cambios registrados hasta el momento')) {
          this.GetItemsByVehicleModel();
          this.lsItemsSelected = [];
          this.routineToUpdate.lsItems = [];
          const { referencePrice } = this.frmMaintenanceRoutine.controls;
          const lblTotalPrice: HTMLSpanElement = document.querySelector('#lbl-total-routine');
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

  setBrand(brand: Brand) {
    this.brandSelected = brand;
  }

  setVehiclType() {
    this.countChanges += 1;

  }

  setFrequency(frequency: Frequency){

    if (frequency != null && frequency != undefined){
      this.frequency_id = frequency.id;
    }else{
      this.frequency_id = 0;
    }

    if (this.initialRoutine != this.frequency_id){
      this.validateRoutineAndFrequency(this.vehicleModel_id, this.frequency_id);
    }else{
      this.routineIsValid = true;
      this.msgRoutineDuplicated = '';
    }

  }

  setVehicleModel(vehicleModel: VehicleModel){
    if (vehicleModel != null && vehicleModel != undefined){
      this.vehicleModel_id = vehicleModel.id;
    }else{
      this.vehicleModel_id = 0;
    }

    this.validateRoutineAndFrequency(this.vehicleModel_id, this.frequency_id);
  }

  async validateRoutineAndFrequency(routine_id: number, frequency_id: number){

    this.maintenanceRoutineService.ValidateRoutineAndFrequency(routine_id, frequency_id)
    .then( rta => {

      this.routineIsValid = rta.response;
      this.msgRoutineDuplicated = rta.message;
    });
  }

  get fieldName(){
    return this.frmMaintenanceRoutine.get('name');
  }
}
