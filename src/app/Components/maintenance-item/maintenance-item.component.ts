import { Component, EventEmitter, OnInit, Output, OnChanges, SimpleChange, Input, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Brand } from 'src/app/Models/Brand';
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem';
import { MaintenanceItemService } from '../../Services/maintenance-item.service';
import { VehicleService } from '../../Services/vehicle.service';

@Component({
  selector: 'app-maintenance-item',
  templateUrl: './maintenance-item.component.html',
  styleUrls: ['./maintenance-item.component.scss', '../../../assets/styles/app.scss']
})
export class MaintenanceItemComponent implements OnInit, OnChanges {
  frmMaintenanceItem: FormGroup;
  item: MaintenanceItem;
  itemToUpdate: MaintenanceItem;
  @Output() maintenanceItemWasSetted = new EventEmitter<boolean>();
  @Output() maintenanceItemWasCanceled = new EventEmitter<boolean>();
  @Input() countChanges: number;


  constructor(
    private maintenanceItemService: MaintenanceItemService,
    private vehicleService: VehicleService
  ) {
    this.frmMaintenanceItem = new FormGroup({
      txtCode: new FormControl(''),
      txtName: new FormControl(''),
      txtDescription: new FormControl(''),
      txtReferencePrice: new FormControl('')
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (let change in changes) {
      if (change == "countChanges") {
        this.itemToUpdate = this.maintenanceItemService.getItemToUpdate();
        if (this.itemToUpdate != null) {
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
  }

  setDataMaintenanceItem() {
    this.item = this.setDataToItem();
    console.log("[Maintenance item]: ", this.item);
    this.maintenanceItemService.setItem(this.item);
    this.maintenanceItemWasSetted.emit(true);
  }

  setDataToItem(): MaintenanceItem {
    let oItem = new MaintenanceItem();
    let { txtCode, txtName, txtDescription, txtReferencePrice } = this.frmMaintenanceItem.controls;
    if (this.itemToUpdate != null) {
      oItem.id = this.itemToUpdate.id;
    }
    oItem.code = txtCode.value;
    oItem.name = txtName.value;
    oItem.description = txtDescription.value;
    oItem.presentationUnit = this.maintenanceItemService.getPresentationUnit();
    oItem.type = this.maintenanceItemService.getTypeOfItem();
    oItem.referencePrice = txtReferencePrice.value;
    oItem.category = this.maintenanceItemService.getCategorySelected();

    oItem.lsVehicleType = this.vehicleService.getListVehicleTypeSelected();
    oItem.lsVehicleModel = this.vehicleService.getListVehicleModelsSelected();
    
    console.log("[item component]: ", oItem);
    return oItem;
  }

  setDataInForm(pItem: MaintenanceItem) {
    let { txtCode, txtName, txtDescription, txtReferencePrice } = this.frmMaintenanceItem.controls;
    txtCode.setValue(pItem.code);
    txtName.setValue(pItem.name);
    txtDescription.setValue(pItem.description);
    txtReferencePrice.setValue(pItem.referencePrice);
    this.maintenanceItemService.setPresentationUnit(pItem.presentationUnit);
    this.maintenanceItemService.settypeOfItem(pItem.type);
    
    let oBrandTmp = new Brand();

    if(pItem.lsVehicleModel.length > 0){     
      if(pItem.lsVehicleModel[0].brand != null && pItem.lsVehicleModel[0].brand != undefined){
        console.log(pItem.lsVehicleModel);
        oBrandTmp = pItem.lsVehicleModel[0].brand;

      }else{
        oBrandTmp.id = 1;
        oBrandTmp.name = "CHEVROLET";
      }     
    }else{
      oBrandTmp.id = 1;
      oBrandTmp.name = "CHEVROLET";
    }
    
    this.vehicleService.setBrandSelected(oBrandTmp);
    this.maintenanceItemService.setCategorySelected(pItem.category);
    
    this.vehicleService.setListVehicleTypeSelected(pItem.lsVehicleType);
    this.vehicleService.setListVehicleModelsSelected(pItem.lsVehicleModel);
   
  }

  clearDataForm() {
    let { txtCode, txtName, txtDescription, txtReferencePrice } = this.frmMaintenanceItem.controls;
    txtCode.setValue('');
    txtName.setValue('');
    txtDescription.setValue('');
    txtReferencePrice.setValue('');
    this.maintenanceItemService.setPresentationUnit(null);
    this.maintenanceItemService.settypeOfItem(null);
    this.vehicleService.setVehicleModelSelected(null);

    this.vehicleService.setBrandSelected(null);
    this.maintenanceItemService.setCategorySelected(null);
    this.vehicleService.setListVehicleTypeSelected(null);
    this.vehicleService.setListVehicleModelsSelected(null);
  }

  comeBack() {
    this.maintenanceItemWasCanceled.emit(true);
  }
  setBrand(){
    this.countChanges += 1;
  }

  setVehiclType(){
    this.countChanges += 1;
  }

  setListVehicleTypes(){
    this.countChanges += 1;
  }

  setLisVehicleModels(){
    
  }
}
