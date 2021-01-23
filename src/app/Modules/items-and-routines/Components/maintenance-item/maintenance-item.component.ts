import { Component, EventEmitter, OnInit, Output, OnChanges, SimpleChange, Input, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Brand } from 'src/app/Models/Brand';
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem';
import { MaintenanceItemService } from '../../Services/MaintenanceItem/maintenance-item.service';
import { VehicleService } from '../../../client/Services/Vehicle/vehicle.service';
import { Tax } from 'src/app/Models/Tax';
import { CompanyType } from 'src/app/Models/CompanyType'
import { Dealer } from 'src/app/Models/Dealer';
import { SharedFunction } from 'src/app/Models/SharedFunctions';


@Component({
  selector: 'app-maintenance-item',
  templateUrl: './maintenance-item.component.html',
  styleUrls: ['./maintenance-item.component.scss', '../../../../../assets/styles/app.scss', '../../../../../assets/styles/checkbox.scss']
})
export class MaintenanceItemComponent implements OnInit, OnChanges {
  frmMaintenanceItem: FormGroup;
  item: MaintenanceItem;
  itemToUpdate: MaintenanceItem;
  lsTaxesSelected: Tax[];
  itemHandleTax: Boolean;
  @Output() maintenanceItemWasSetted = new EventEmitter<boolean>();
  @Output() maintenanceItemWasCanceled = new EventEmitter<boolean>();
  @Input() countChanges: number;
  sharedFunction: SharedFunction;
  presentationUnitIsInvalid: boolean;
  typeIsInvalid:boolean;

  constructor(
    private maintenanceItemService: MaintenanceItemService,
    private vehicleService: VehicleService,
    private formBuilder: FormBuilder
  ) {
    this.buildFormMaintenanceItem();
    this.item = new MaintenanceItem();
    this.itemHandleTax = false;
    this.lsTaxesSelected = [];
    this.presentationUnitIsInvalid = false;
    this.typeIsInvalid = false;
  }


  buildFormMaintenanceItem() {
    this.sharedFunction = new SharedFunction();
    this.frmMaintenanceItem = this.formBuilder.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: [''],
      referencePrice: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (let change in changes) {
      if (change == "countChanges") {
        this.itemToUpdate = this.maintenanceItemService.getItemToUpdate();
        if (this.itemToUpdate != null) {
          console.log("[on changes]", this.itemToUpdate);
          this.setDataInForm(this.itemToUpdate);
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
    this.itemToUpdate = this.maintenanceItemService.getItemToUpdate();
    this.itemHandleTax = false;        
  } 

  setDataMaintenanceItem(event: any) {
    event.preventDefault();
    this.item = this.setDataToItem();
    console.log("[Maintenance item]: ", this.item);
    this.maintenanceItemService.setItem(this.item);
    this.clearDataForm();
    this.maintenanceItemWasSetted.emit(true);
  }

  setDataToItem(): MaintenanceItem {
    try {
      let oItem = new MaintenanceItem();

      oItem = this.frmMaintenanceItem.value;

      if (this.itemToUpdate != null) {
        oItem.id = this.itemToUpdate.id;
      }
      if(this.lsTaxesSelected.length > 0){        
        oItem.handleTax = true;
        oItem.lsTaxes = this.lsTaxesSelected;
      }else{
        oItem.handleTax = false;
        oItem.lsTaxes = [];
      }
      
      oItem.presentationUnit = this.maintenanceItemService.getPresentationUnit();
      oItem.type = this.maintenanceItemService.getTypeOfItem();
      oItem.category = this.maintenanceItemService.getCategorySelected();
      oItem.lsVehicleType = (this.vehicleService.getListVehicleTypeSelected() != null) ? this.vehicleService.getListVehicleTypeSelected() : [];
      oItem.lsVehicleModel = (this.vehicleService.getListVehicleModelsSelected() != null) ? this.vehicleService.getListVehicleModelsSelected() : [];

      oItem = this.setDealerToItem(oItem);
      console.log("[item component]: ", oItem);
      return oItem;
    } catch (error) {
      console.warn(error);
    }

  }

  setDealerToItem(oItem: MaintenanceItem) {
    let session = JSON.parse(sessionStorage.getItem('sessionUser'));

    if (session.company.type == CompanyType.DEALER) {
      oItem.dealer = new Dealer();
      oItem.dealer.id = session.company.id;
    }

    return oItem;
  }

  setDataInForm(pItem: MaintenanceItem) {

    this.frmMaintenanceItem.patchValue(pItem);
    this.maintenanceItemService.setPresentationUnit(pItem.presentationUnit);
    this.maintenanceItemService.settypeOfItem(pItem.type);

    let oBrandTmp = new Brand();

    if (pItem.lsVehicleModel.length > 0) {
      if (pItem.lsVehicleModel[0].brand != null && pItem.lsVehicleModel[0].brand != undefined) {
        console.log(pItem.lsVehicleModel);
        oBrandTmp = pItem.lsVehicleModel[0].brand;

      } else {
        oBrandTmp.id = 1;
        oBrandTmp.name = "CHEVROLET";
      }
    } else {
      oBrandTmp.id = 1;
      oBrandTmp.name = "CHEVROLET";
    }

    if(pItem.handleTax){
      this.itemHandleTax = true;
      this.lsTaxesSelected = pItem.lsTaxes;
      this.calculateTaxesByItem(this.lsTaxesSelected);
    }else{
      this.itemHandleTax = false;
      this.lsTaxesSelected = [];
    }

    this.vehicleService.setBrandSelected(oBrandTmp);
    this.maintenanceItemService.setCategorySelected(pItem.category);

    this.vehicleService.setListVehicleTypeSelected(pItem.lsVehicleType);
    this.vehicleService.setListVehicleModelsSelected(pItem.lsVehicleModel);

  }

  clearDataForm() {
    this.frmMaintenanceItem.reset();
    this.lsTaxesSelected = [];
    this.maintenanceItemService.setPresentationUnit(null);
    this.maintenanceItemService.settypeOfItem(null);
    this.vehicleService.setVehicleModelSelected(null);
    this.vehicleService.setBrandSelected(null);
    this.maintenanceItemService.setCategorySelected(null);
    this.vehicleService.setListVehicleTypeSelected(null);
    this.vehicleService.setListVehicleModelsSelected(null);
    this.itemHandleTax = false;
    this.lsTaxesSelected = [];
    let txtTaxesValue: HTMLInputElement = document.querySelector('#taxesValue');
    let txtTotalValue: HTMLInputElement = document.querySelector('#totalValue');
    txtTaxesValue.value = ''
    txtTotalValue.value = ''
  }

  comeBack() {
    this.maintenanceItemWasCanceled.emit(true);
  }
  setBrand() {
    this.countChanges += 1;
  }

  setVehiclType() {
    this.countChanges += 1;
  }

  setListVehicleTypes() {
    this.countChanges += 1;
  }

  setLisVehicleModels() {

  }
 
  calculateTaxesByItem(lsTaxesSelected: Tax[]) {
    console.log("[Maintenance item]",lsTaxesSelected);
    
    this.lsTaxesSelected = lsTaxesSelected;

    let {referencePrice} = this.frmMaintenanceItem.controls;
    let value = (referencePrice.value != null)?referencePrice.value:0;
    var totalTaxes = 0;
    if(lsTaxesSelected.length > 0){
      for (let tax of lsTaxesSelected) {
        totalTaxes += value * (tax.percentValue / 100);
      }
    }
   
    console.log(totalTaxes);

    let txtTaxesValue: HTMLInputElement = document.querySelector('#taxesValue');
    let txtTotalValue: HTMLInputElement = document.querySelector('#totalValue');
    txtTaxesValue.value = totalTaxes.toString();
    txtTotalValue.value = (parseFloat(value.toString()) + parseFloat(totalTaxes.toString())).toString();
    return totalTaxes;
  }

  validatePresentationUnit(){
    let presentationTmp = this.maintenanceItemService.getPresentationUnit();
    console.log("[validatePresentationUnit]");
    console.log(presentationTmp);

    if(presentationTmp == null || presentationTmp == undefined){
      this.presentationUnitIsInvalid = true;
    }else{
      this.presentationUnitIsInvalid = false;
    }
  }

  validateTypeOfMaintenanceItem(){
    let typeTmp = this.maintenanceItemService.getTypeOfItem();
    if(typeTmp == null || typeTmp == undefined){
      this.typeIsInvalid = true;
    }else{
      this.typeIsInvalid = false;
    }
  }

  get fieldCode() {
    return this.frmMaintenanceItem.get('code');
  }

  get fieldName() {
    return this.frmMaintenanceItem.get('name');
  }

  get fieldReferencePrice() {
    return this.frmMaintenanceItem.get('referencePrice');
  }
}
