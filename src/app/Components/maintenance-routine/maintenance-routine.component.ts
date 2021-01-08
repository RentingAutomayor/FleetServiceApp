import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem';
import { MaintenanceRoutine } from 'src/app/Models/MaintenanceRoutine';
import { VehicleModel } from 'src/app/Models/VehicleModel';
import { MaintenanceItemService } from '../../Services/maintenance-item.service';
import { MaintenanceRoutineService } from '../../Services/maintenance-routine.service';
import { VehicleService } from '../../Services/vehicle.service';


@Component({
  selector: 'app-maintenance-routine',
  templateUrl: './maintenance-routine.component.html',
  styleUrls: ['./maintenance-routine.component.scss', '../../../assets/styles/app.scss', '../../../assets/styles/checkbox.scss']
})
export class MaintenanceRoutineComponent implements OnInit, OnChanges {
  frmMaintenanceRoutine: FormGroup;
  lsMaintenanceItems: MaintenanceItem[];
  lsItemsSelected: MaintenanceItem[];
  @Output() routineWasSaved = new EventEmitter<boolean>();
  @Output() routinewasCanceled = new EventEmitter<boolean>();
  @Input() countChanges: number;
  routineToUpdate: MaintenanceRoutine;



  constructor(
    private maintenanceItemService: MaintenanceItemService,
    private vehicleService: VehicleService,
    private maintenanceRoutineService: MaintenanceRoutineService
  ) {
    this.frmMaintenanceRoutine = new FormGroup({
      txtName: new FormControl(''),
      txtReferencePrice: new FormControl(0)
    });

  }
  ngOnChanges(changes: SimpleChanges): void {
    for (let change in changes) {
      if (change == "countChanges") {
        this.routineToUpdate = this.maintenanceRoutineService.getRoutine();
        if (this.routineToUpdate != null) {
          this.setDataInForm(this.routineToUpdate);
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

  calculatePriceByItem(event: any, pItem: MaintenanceItem) {
    let idSpan = 'lbl_price_' + pItem.id.toString();
    let spanPrice: HTMLSpanElement = document.getElementById(idSpan);
    let price = event.value * pItem.referencePrice;
    console.log("[Precio por item]: ", price);
    spanPrice.innerText = price.toString();
    this.calculateRoutinePrice();
    this.updateAmountOfItem(pItem, event.value);
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

  calculateRoutinePrice() {
    let { txtReferencePrice } = this.frmMaintenanceRoutine.controls;
    let lblTotalPrice: HTMLSpanElement = document.querySelector("#lbl-total-routine")
    let aLblPrice = document.getElementsByClassName("lbl-total-price");
    let totalPrice = 0;
    //console.log(aLblPrice);
    for (let i = 0; i < aLblPrice.length; i++) {
      let priceItem = aLblPrice[i].textContent;
      if (priceItem.trim() != '') {
        totalPrice += parseFloat(priceItem);
      }
    }
    txtReferencePrice.setValue(totalPrice);
    lblTotalPrice.textContent = totalPrice.toString();
  }


  async saveMaintenanceRoutine() {
    this.calculateRoutinePrice();
    let { txtName, txtReferencePrice } = this.frmMaintenanceRoutine.controls;
    let oMaintenenceRoutine = new MaintenanceRoutine();
    if (this.routineToUpdate != null) {
      oMaintenenceRoutine.id = this.routineToUpdate.id;
    }
    oMaintenenceRoutine.name = txtName.value;
    oMaintenenceRoutine.referencePrice = txtReferencePrice.value;
    oMaintenenceRoutine.vehicleModel = this.vehicleService.getVehicleModelSelected();
    oMaintenenceRoutine.frequency = this.maintenanceRoutineService.getFrecuencySelected();
    oMaintenenceRoutine.lsItems = this.lsItemsSelected;
    console.log(oMaintenenceRoutine);
    this.maintenanceRoutineService.setRoutine(oMaintenenceRoutine);
    this.routineWasSaved.emit(true);
  }

  cancelRoutine() {
    this.routinewasCanceled.emit(true);
  }

  async setDataInForm(pRoutine: MaintenanceRoutine) {
    let { txtName, txtReferencePrice } = this.frmMaintenanceRoutine.controls;
    txtName.setValue(pRoutine.name);
    txtReferencePrice.setValue(pRoutine.referencePrice);

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
      let idLabelPrice = `#${this.getLabelId(pItem.id)}`;

      console.log("[Checkbox id]", idChechBox);

      let chkItem: HTMLInputElement = document.querySelector(idChechBox);
      let txtAmount: HTMLInputElement = document.querySelector(idTextBoxAmount);
      let lblPrice: HTMLSpanElement = document.querySelector(idLabelPrice);
      chkItem.checked = true;
      txtAmount.disabled = false;
      txtAmount.value = pItem.amount.toString();
      lblPrice.textContent = (parseFloat(pItem.referencePrice.toString()) * parseFloat(pItem.amount.toString())).toString();
    } catch (error) {
      console.error(error);
    }

  }

  clearDataForm() {
    let { txtName, txtReferencePrice } = this.frmMaintenanceRoutine.controls;
    txtName.setValue('');
    txtReferencePrice.setValue('');
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
          let { txtReferencePrice } = this.frmMaintenanceRoutine.controls;
          let lblTotalPrice: HTMLSpanElement = document.querySelector("#lbl-total-routine");
          txtReferencePrice.setValue(0);
          lblTotalPrice.textContent = '';
        }else{
          this.GetItemsByVehicleModel();
        }
      }
      this.validateItemsToRoutine(this.routineToUpdate.lsItems);     
    }
    else {
      this.GetItemsByVehicleModel();
    }

  }

  setBrand(){
    this.countChanges += 1;
  }

  setVehiclType(){
    this.countChanges += 1;+
    console.log("cambia el tipo");
  }

}
