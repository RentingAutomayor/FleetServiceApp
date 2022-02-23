import { Component, OnInit } from '@angular/core'
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem'
import { ResponseApi } from 'src/app/Models/ResponseApi'
import { VehicleModel } from 'src/app/Models/VehicleModel'
import { MaintenanceItemService } from 'src/app/Modules/items-and-routines/Services/MaintenanceItem/maintenance-item.service'
import { VehicleService } from 'src/app/Modules/client/Services/Vehicle/vehicle.service'
import { CompanyType } from 'src/app/Models/CompanyType'
import { TypeOfMaintenanceItem } from 'src/app/Models/TypeOfMaintenanceItem'

@Component({
  selector: 'app-tbl-maintenance-item',
  templateUrl: './tbl-maintenance-item.component.html',
  styleUrls: [
    './tbl-maintenance-item.component.scss',
    '../../../../../assets/styles/app.scss',
  ],
})
export class TblMaintenanceItemComponent implements OnInit {
  isAwaiting: boolean
  pag: Number = 1

  lsMaintenanceItems: MaintenanceItem[] = []
  lsMaintenanceItemsFiltered: MaintenanceItem[] = []
  lsMaintenanceItemsTmp: MaintenanceItem[]
  isToUpdate: boolean
  dealer_id: number
  maintenanceItemSelected: MaintenanceItem
  disableControls: boolean

  //feature/ft-0202
  descriptionFiltered: string = ''
  typeOfItemId: number = 0

  constructor(
    private vehicleService: VehicleService,
    private maintenanceItemService: MaintenanceItemService
  ) {
    this.maintenanceItemSelected = {
      id: 0,
      code: '',
      name: '',
      description: '',
      category: {
        id: 1,
        name: '',
        state: true,
        registrationDate: null,
      },
      type: {
        id: 1,
        code: '',
        state: true,
        registrationDate: null,
      },
      presentationUnit: {
        id: 1,
        shortName: '',
        longName: '',
        state: true,
        registrationDate: null,
      },
      referencePrice: 0,
      lsVehicleModel: [],
      lsVehicleType: [],
      lsTaxes: [],
      valueWithDiscountWithoutTaxes: 0,
      taxesValue: 0,
      discountValue: 0,
      valueWithoutDiscount: 0,
      amount: 0,
      handleTax: false,
      state: true,
      registrationDate: null,
    }
    this.disableControls = false
  }

  ngOnInit(): void {
    // this.initComponents();
  }

  async initComponents() {
    this.validateUserCompany()

    this.isToUpdate = false
    this.isAwaiting = false
    this.showTableItems()
  }

  validateUserCompany() {
    try {
      const userSession = JSON.parse(sessionStorage.getItem('sessionUser'))
      if (userSession.company.type == CompanyType.DEALER) {
        this.dealer_id = userSession.company.id
      } else {
        this.dealer_id = 0
      }
    } catch (error) {
      console.warn(error)
    }
  }

  async showTableItems() {
    this.isAwaiting = true
    this.maintenanceItemService
      .getMaintenanceItems(this.dealer_id)
      .subscribe((maintenanceItems) => {
        this.lsMaintenanceItems = maintenanceItems
        this.lsMaintenanceItemsFiltered = maintenanceItems
      })
    this.lsMaintenanceItemsTmp = this.lsMaintenanceItems
    this.isAwaiting = false
  }

  insertMaintenanceItem() {
    this.disableControls = false
    this.isToUpdate = false

    this.maintenanceItemService.setItemToUpdate(null)
    this.vehicleService.setBrandSelected(null)
    this.vehicleService.setVehicleTypeSelected(null)
    this.vehicleService.setVehicleModelSelected(null)
    this.showPopUp()
    this.hideTable()
  }

  showTable() {
    const containerTable = document.getElementById('container__table_items')
    containerTable.setAttribute('style', 'display:block')
  }

  hideTable() {
    const containerTable = document.getElementById('container__table_items')
    containerTable.setAttribute('style', 'display:none')
  }

  updateMaintenanceItem(pItem: MaintenanceItem) {
    this.disableControls = false
    this.isToUpdate = true

    this.maintenanceItemService
      .getMaintenanceItemById(pItem.id)
      .then((item) => {
        this.maintenanceItemSelected = item
        this.showPopUp()
        this.hideTable()
      })
  }

  async deleteMaintenanceItem(pItem: MaintenanceItem) {
    try {
      if (
        confirm(
          '¿Está seguro que desea eliminar este artículo de mantenimiento?'
        )
      ) {
        this.isAwaiting = true
        const rta = await this.maintenanceItemService.delete(pItem)
        if (rta.response) {
          alert(rta.message)
          this.showTableItems()
        }
        this.isAwaiting = false
      }
    } catch (err) {
      this.isAwaiting = false
      console.error(err.error.Message)
      alert(err.error.Message)
    }
  }

  comeBackToTable() {
    this.hidePopUp()
    this.showTable()
  }

  async saveMaintenanceItem() {
    try {
      const oItem = this.maintenanceItemService.getItem()

      this.saveDataInDB(oItem)
    } catch (err) {
      console.error(err.error.Message)
      alert(err.error.Message)
      this.isAwaiting = false
    }
  }

  async saveDataInDB(oItem: MaintenanceItem) {
    try {
      let rta = new ResponseApi()
      this.isAwaiting = true
      if (this.isToUpdate) {
        rta = await this.maintenanceItemService.update(oItem)
      } else {
        rta = await this.maintenanceItemService.insert(oItem)
      }
      this.isAwaiting = false
      if (rta.response) {
        alert(rta.message)
        this.vehicleService.setListVehicleTypeSelected(null)
        this.vehicleService.setListVehicleModelsSelected(null)
        this.hidePopUp()
        this.showTableItems()
        this.showTable()
      }
    } catch (error) {
      alert(error.error.Message)
      this.isAwaiting = false
    }
  }

  showPopUp() {
    const containerForm = document.getElementById(
      'container__formMaintenanceItem'
    )
    containerForm.setAttribute('style', 'display:block')
  }

  hidePopUp() {
    const containerForm = document.getElementById(
      'container__formMaintenanceItem'
    )
    containerForm.setAttribute('style', 'display:none')
  }
  getVehicleModel(vehicleModel: VehicleModel) {
    if (vehicleModel == null) {
      return 'GENÉRICO'
    } else {
      return vehicleModel.shortName
    }
  }

  filterItems(typeOfItem: TypeOfMaintenanceItem) {
    if (typeOfItem) {
      this.typeOfItemId = typeOfItem.id
      this.filterMaintenanceItems()
    }
  }

  filterItemsByDescription(event: any) {
    this.descriptionFiltered = event.target.value.toLowerCase()
    this.filterMaintenanceItems()
  }

  filterMaintenanceItems() {
    this.lsMaintenanceItemsFiltered = this.lsMaintenanceItems.filter((mi) => {
      return (
        (mi.code.toLowerCase().includes(this.descriptionFiltered) ||
          mi.name.toLowerCase().includes(this.descriptionFiltered)) &&
        mi.type.id == this.typeOfItemId
      )
    })
  }

  seeDetailsMaintenanceItem(maintenanceItem: MaintenanceItem) {
    this.disableControls = true
    this.maintenanceItemService
      .getMaintenanceItemById(maintenanceItem.id)
      .then((item) => {
        this.maintenanceItemSelected = item
        this.showPopUp()
        this.hideTable()
      })
  }
}
