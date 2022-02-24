import { Component, OnInit } from '@angular/core'
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem'
import { ResponseApi } from 'src/app/Models/ResponseApi'
import { VehicleModel } from 'src/app/Models/VehicleModel'
import { MaintenanceItemService } from 'src/app/Modules/items-and-routines/Services/MaintenanceItem/maintenance-item.service'
import { VehicleService } from 'src/app/Modules/client/Services/Vehicle/vehicle.service'
import { CompanyType } from 'src/app/Models/CompanyType'
import { TypeOfMaintenanceItem } from 'src/app/Models/TypeOfMaintenanceItem'
import { findLastIndex } from 'lodash'
import { FormControl } from '@angular/forms'
import { retry } from 'rxjs/operators'

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
  isDetailVisible: boolean = false

  isErrorVisible = false
  errorTitle = ''
  errorMessageApi = ''

  isTableVisible = true
  isMaintenanceItemVisible = false

  typeFiltered: TypeOfMaintenanceItem = null
  txtDescription: FormControl = new FormControl()

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

    this.txtDescription.valueChanges.subscribe((desc) => {
      if (desc != '') {
        this.descriptionFiltered = desc
        this.filterMaintenanceItems(desc, this.typeFiltered)
      } else {
        this.lsMaintenanceItemsFiltered = this.lsMaintenanceItems
      }
    })
  }

  ngOnInit(): void {
    this.initComponents()
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

  showTableItems() {
    this.clearFilter()
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
    this.maintenanceItemSelected = null
    this.hideTable()
  }

  showTable() {
    this.isTableVisible = true
    this.isMaintenanceItemVisible = false
  }

  hideTable() {
    this.isTableVisible = false
    this.isMaintenanceItemVisible = true
  }

  updateMaintenanceItem(pItem: MaintenanceItem) {
    this.disableControls = false
    this.isToUpdate = true
    this.isAwaiting = true
    this.maintenanceItemService
      .getMaintenanceItemById(pItem.id)
      .subscribe((item) => {
        this.maintenanceItemSelected = item
        this.showTableItems()
        this.isAwaiting = false
        this.hideTable()
      })
  }

  deleteMaintenanceItem(item: MaintenanceItem) {
    if (
      confirm('¿Está seguro que desea eliminar este artículo de mantenimiento?')
    ) {
      this.isAwaiting = true
      this.maintenanceItemService.delete(item).subscribe(
        (rta) => {
          alert(rta.message)
          this.showTableItems()
          this.isAwaiting = false
        },
        (err) => {
          this.isErrorVisible = true
          this.errorTitle =
            'Ocurrió un error intentando Eliminar el artículo de mantenimiento'
          this.errorMessageApi = err.message
          this.isAwaiting = false
        }
      )

      this.showTableItems()
    }
    this.isAwaiting = false
  }

  comeBackToTable() {
    this.showTable()
  }

  saveMaintenanceItem() {
    try {
      const oItem = this.maintenanceItemService.getItem()

      this.saveDataInDB(oItem)
    } catch (err) {
      console.error(err.error.Message)
      alert(err.error.Message)
      this.isAwaiting = false
    }
  }

  saveDataInDB(oItem: MaintenanceItem) {
    this.isAwaiting = true
    if (this.isToUpdate) {
      this.maintenanceItemService.update(oItem).subscribe(
        (rta) => {
          alert(rta.message)
          this.isAwaiting = false
          this.showTable()
          this.showTableItems()
          this.isAwaiting = false
        },
        (err) => {
          this.isErrorVisible = true
          this.errorTitle =
            'Ocurrió un error intentando Actualizar el item de mantenimiento'
          this.errorMessageApi = err.Message
          this.isAwaiting = false
        }
      )
    } else {
      this.maintenanceItemService.insert(oItem).subscribe(
        (rta) => {
          alert(rta.message)
          this.isAwaiting = false
          this.showTable()
        },
        (err) => {
          this.isErrorVisible = true
          this.errorTitle =
            'Ocurrió un error intentando Insertar el item de mantenimiento'
          this.errorMessageApi = err.Message
          this.isAwaiting = false
        }
      )
    }
  }

  getVehicleModel(vehicleModel: VehicleModel) {
    if (vehicleModel == null) {
      return 'GENÉRICO'
    } else {
      return vehicleModel.shortName
    }
  }

  filterItems(typeOfItem: TypeOfMaintenanceItem) {
    this.typeOfItemId = typeOfItem.id
    this.filterMaintenanceItems(this.descriptionFiltered, typeOfItem)
  }

  filterMaintenanceItems(description: string, typeOfMi: TypeOfMaintenanceItem) {
    this.lsMaintenanceItemsFiltered = this.lsMaintenanceItems.filter((mi) => {
      if (description != null && typeOfMi != null) {
        return (
          mi.code.toLowerCase().includes(this.descriptionFiltered) ||
          (mi.name.toLowerCase().includes(this.descriptionFiltered) &&
            mi.type.id == typeOfMi.id)
        )
      } else {
        if (typeOfMi != null) {
          return mi.type.id == typeOfMi.id
        } else {
          return (
            mi.code.toLowerCase().includes(description) ||
            mi.name.toLowerCase().includes(description)
          )
        }
      }
    })
  }

  seeDetailsMaintenanceItem(maintenanceItem: MaintenanceItem) {
    this.disableControls = true
    this.isAwaiting = true
    this.maintenanceItemService
      .getMaintenanceItemById(maintenanceItem.id)
      .subscribe((item) => {
        this.maintenanceItemSelected = item
        this.isAwaiting = false
        this.hideTable()
      })
  }

  clearFilter() {
    this.typeFiltered = null
    this.txtDescription.setValue(null)
    this.lsMaintenanceItemsFiltered = this.lsMaintenanceItems
  }
}
