import { Component, OnInit } from '@angular/core';
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem';
import { ResponseApi } from 'src/app/Models/ResponseApi';
import { VehicleModel } from 'src/app/Models/VehicleModel';
import { MaintenanceItemService } from 'src/app/Modules/items-and-routines/Services/MaintenanceItem/maintenance-item.service';
import { VehicleService } from 'src/app/Modules/client/Services/Vehicle/vehicle.service';
import { CompanyType } from 'src/app/Models/CompanyType';
import { TypeOfMaintenanceItem } from 'src/app/Models/TypeOfMaintenanceItem';


@Component({
  selector: 'app-tbl-maintenance-item',
  templateUrl: './tbl-maintenance-item.component.html',
  styleUrls: ['./tbl-maintenance-item.component.scss', '../../../../../assets/styles/app.scss']
})

export class TblMaintenanceItemComponent implements OnInit {
  isAwaiting: boolean;
  pag: Number = 1;
  oCountChanges: number;
  lsMaintenanceItems: MaintenanceItem[];
  lsMaintenanceItemsTmp: MaintenanceItem[];
  isToUpdate: boolean;
  dealer_id: number;


  constructor(
    private vehicleService: VehicleService,
    private maintenanceItemService: MaintenanceItemService
  ) {

  }

  ngOnInit(): void {
    this.initComponents();
  }

  async initComponents() {
    this.validateUserCompany();
    this.oCountChanges = 0;
    this.isToUpdate = false;
    this.isAwaiting = false;
    this.showTableItems();
  }

  validateUserCompany() {
    try {
      let userSession = JSON.parse(sessionStorage.getItem('sessionUser'));
      if (userSession.company.type == CompanyType.DEALER) {
        this.dealer_id = userSession.company.id;
      }else{
        this.dealer_id = 0;
      }

    } catch (error) {
      console.warn(error);
    }
  }

  async showTableItems() {
    try {
      this.isAwaiting = true;
      this.lsMaintenanceItems = await this.maintenanceItemService.getMaintenanceItems(this.dealer_id);
      this.lsMaintenanceItemsTmp = this.lsMaintenanceItems;
      this.isAwaiting = false;
    } catch (err) {
      console.error(err.error.Message);
      alert(err.error.Message);
      this.isAwaiting = false;
    }
  }


  insertMaintenanceItem() {
    this.isToUpdate = false;
    this.oCountChanges += 1;
    this.maintenanceItemService.setItemToUpdate(null);
    this.vehicleService.setBrandSelected(null);
    this.vehicleService.setVehicleTypeSelected(null);
    this.vehicleService.setVehicleModelSelected(null);
    this.showPopUp();
    this.hideTable();
  }

  showTable() {
    let containerTable = document.getElementById('container__table_items');
    containerTable.setAttribute("style", "display:block");
  }

  hideTable() {
    let containerTable = document.getElementById('container__table_items');
    containerTable.setAttribute("style", "display:none");
  }

  async updateMaintenanceItem(pItem: MaintenanceItem) {
    this.isToUpdate = true;
    let oMaintenanceItemDB = await this.maintenanceItemService.getMaintenanceItemById(pItem.id);
    //console.log("[tbl-maintence-item]: ", oMaintenanceItemDB);
    this.maintenanceItemService.setItemToUpdate(oMaintenanceItemDB);
    this.oCountChanges += 1;
    this.showPopUp();
    this.hideTable();
  }

  async deleteMaintenanceItem(pItem: MaintenanceItem) {
    try {
      if (confirm("¿Está seguro que desea eliminar este artículo de mantenimiento?")) {
        this.isAwaiting = true;
        let rta = await this.maintenanceItemService.delete(pItem);
        if (rta.response) {
          alert(rta.message);
          this.showTableItems();
        }
        this.isAwaiting = false;
      }
    } catch (err) {
      this.isAwaiting = false;
      console.error(err.error.Message);
      alert(err.error.Message);

    }
  }

  comeBackToTable() {
    this.oCountChanges += 1;
    this.maintenanceItemService.setItemToUpdate(null);
    this.hidePopUp();
    this.showTable();
  }

  async saveMaintenanceItem() {
    try {
      let oItem = this.maintenanceItemService.getItem();

      this.saveDataInDB(oItem);
    } catch (err) {
      console.error(err.error.Message);
      alert(err.error.Message);
      this.isAwaiting = false;
    }
  }

  async saveDataInDB(oItem: MaintenanceItem) {

    try {
      let rta = new ResponseApi();
      this.isAwaiting = true;
      if (this.isToUpdate) {
        rta = await this.maintenanceItemService.update(oItem);
      } else {
        rta = await this.maintenanceItemService.insert(oItem);
      }
      this.isAwaiting = false;
      if (rta.response) {
        alert(rta.message);
        this.vehicleService.setListVehicleTypeSelected(null);
        this.vehicleService.setListVehicleModelsSelected(null);
        this.hidePopUp();
        this.showTableItems();
        this.showTable();
      }
    } catch (error) {
      alert(error.error.Message);
      this.isAwaiting = false;
    }

  }

  showPopUp() {
    let containerForm = document.getElementById("container__formMaintenanceItem");
    containerForm.setAttribute("style", "display:block");
  }

  hidePopUp() {
    let containerForm = document.getElementById("container__formMaintenanceItem");
    containerForm.setAttribute("style", "display:none");
  }
  getVehicleModel(vehicleModel: VehicleModel) {
    if (vehicleModel == null) {
      return 'GENÉRICO';
    } else {
      return vehicleModel.shortName;
    }
  }

  filterItems(typeOfItem: TypeOfMaintenanceItem) {
     this.lsMaintenanceItems = this.lsMaintenanceItemsTmp;
     this.lsMaintenanceItems = this.lsMaintenanceItems.filter(mi => mi.type.id == typeOfItem.id);
  }

  filterItemsByDescription(event: any) {
    let value = event.target.value;


    this.lsMaintenanceItems = this.lsMaintenanceItemsTmp;
    this.lsMaintenanceItems = this.lsMaintenanceItems.filter(mi => (mi.code.toLowerCase().includes(value.toLowerCase()) || mi.name.toLowerCase().includes(value.toLowerCase())));
  }

}
