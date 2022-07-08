import { Component, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { CompanyType } from 'src/app/Models/CompanyType'
import { Dealer } from 'src/app/Models/Dealer'
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem'
import { TypeOfMaintenanceItem } from 'src/app/Models/TypeOfMaintenanceItem'
import { VehicleModel } from 'src/app/Models/VehicleModel'
import { VehicleService } from 'src/app/Modules/client/Services/Vehicle/vehicle.service'
import { MaintenanceItemService } from 'src/app/Modules/items-and-routines/Services/MaintenanceItem/maintenance-item.service'
import { Excel } from '../../../../Utils/excel'
import Swal from 'sweetalert2'
import { AlertService } from 'src/app/services/alert.service'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { DialogLoadComponent } from '../dialog-load/dialog-load.component'
import { CurrencyPipe } from '@angular/common'
import { CalculateTaxesPipe } from 'src/app/SharedComponents/Pipes/calculate-taxes.pipe'
import { CalculateTotalPricePipe } from 'src/app/SharedComponents/Pipes/calculate-total-price.pipe'

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
    private maintenanceItemService: MaintenanceItemService,
    private _alert: AlertService,
    private dialog: MatDialog,
    private currency: CurrencyPipe,
    private taxesPipe: CalculateTaxesPipe,
    private calculatePipe: CalculateTotalPricePipe
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
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: rta.message,
            showConfirmButton: true,
          })
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
      const oItemWithDealer = this.setDealerToItem(oItem)
      this.saveDataInDB(oItemWithDealer)
    } catch (err) {
      console.error(err.error.Message)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.error.Message,
        footer: '</a>Consulte con Soporte el problema</a>',
      })
      this.isAwaiting = false
    }
  }

  saveDataInDB(oItem: MaintenanceItem) {
    this.isAwaiting = true
    if (this.isToUpdate) {
      this.maintenanceItemService.update(oItem).subscribe(
        (rta) => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: rta.message,
            showConfirmButton: true,
          })
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
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: rta.message,
            showConfirmButton: true,
          })
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

  setDealerToItem(oItem: MaintenanceItem) {
    const session = JSON.parse(sessionStorage.getItem('sessionUser'))
    let dealerTmp: Dealer | null = {} as Dealer
    if (!this.isToUpdate) {
      if (session.company.type == CompanyType.DEALER) {
        dealerTmp.id = session.company.id
      } else {
        dealerTmp = null
      }
    } else {
      dealerTmp = this.maintenanceItemSelected.dealer
    }
    oItem.dealer = dealerTmp
    return oItem
  }

  getFile(e): void {
    const dialogConfig = new MatDialogConfig()
    const file = e.target.files[0]
    Excel.convertExcelToArray(file, (result) => {
      dialogConfig.data = result
      dialogConfig.width = '800px'
      this.dialog
        .open(DialogLoadComponent, dialogConfig)
        .beforeClosed()
        .subscribe(() => this.showTableItems())
    })
  }

  downloaExcel(): void {
    const data = this.lsMaintenanceItems.map((maintenceItem) => {
      return {
        Codigo: maintenceItem.code,
        Nombre: maintenceItem.name,
        Tipo: maintenceItem.type['name'],
        Presentacion: maintenceItem.presentationUnit.longName,
        ValorSinImpuestos: this.getCurrency(maintenceItem.referencePrice),
        ValorImpuestos: this.getCurrency(
          this.taxesPipe.transform(
            maintenceItem,
            maintenceItem.referencePrice,
            1
          )
        ),
        ValorConImpuestos: this.getCurrency(
          this.calculatePipe.transform(
            maintenceItem,
            maintenceItem.referencePrice,
            1
          )
        ),
      }
    })
    Excel.convertArrayToFile(data, 'Articulos de mantenimiento')
  }

  getCurrency(value: number | string): string {
    return this.currency.transform(value)
  }
}
