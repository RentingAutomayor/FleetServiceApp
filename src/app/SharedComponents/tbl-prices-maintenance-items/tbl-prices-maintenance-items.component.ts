import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core'
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem'
import { MaintenanceItemService } from 'src/app/Modules/items-and-routines/Services/MaintenanceItem/maintenance-item.service'
import { DealerService } from 'src/app/Modules/dealer/Services/Dealer/dealer.service'
import { Dealer } from 'src/app/Models/Dealer'
import { PricesByDealer } from 'src/app/Models/PricesByDealer'
import { SecurityValidators } from 'src/app/Models/SecurityValidators'
import { Company } from 'src/app/Models/Company'
import { InputValidator } from 'src/app/Utils/InputValidator'
import { SharedFunction } from 'src/app/Models/SharedFunctions'
import { FormControl } from '@angular/forms'
import { BehaviorSubject } from 'rxjs'
import { MaintenanceItemManagerService } from 'src/app/SharedComponents/Services/MaintenanceItemManager/maintenance-item-manager.service'

@Component({
  selector: 'app-tbl-prices-maintenance-items',
  templateUrl: './tbl-prices-maintenance-items.component.html',
  styleUrls: ['./tbl-prices-maintenance-items.component.scss'],
})
export class TblPricesMaintenanceItemsComponent implements OnInit {
  pag = 1
  companyStorage: Company
  sharedFunction: SharedFunction
  txtFilter: FormControl
  isDataFilted: boolean
  descriptionToFilter: string | null = null
  lsMaintenanceItems: MaintenanceItem[] = []
  lsMaintenanceItemsFiltered: MaintenanceItem[] = []
  maintenanceItemsChange: BehaviorSubject<MaintenanceItem[]> =
    new BehaviorSubject<MaintenanceItem[]>([])
  lsMaintenanceItems$ = this.maintenanceItemsChange.asObservable()

  isFormBlocked: boolean = false
  @Input('isFormBlocked')
  set setIsFormBlocked(value: boolean) {
    this.isFormBlocked = value
  }

  lsMaintenanceItemsReference: MaintenanceItem[] = []
  @Input('itemsReference')
  set setLsMaintenanceItemsReference(items: MaintenanceItem[]) {
    this.lsMaintenanceItemsReference = items
    this.lsMaintenanceItems = this.maintenanceItemManagerService.updatePrices(
      this.lsMaintenanceItemsReference,
      this.lsMaintenanceItemsWithPrice
    )
    this.maintenanceItemsChange.next(this.lsMaintenanceItemsReference)
  }

  lsMaintenanceItemsWithPrice: MaintenanceItem[] = []
  @Input('itemsWithPrice')
  set setLsMaintenanceWithPrice(items: MaintenanceItem[]) {
    this.lsMaintenanceItemsWithPrice = items
    this.lsMaintenanceItems = this.maintenanceItemManagerService.updatePrices(
      this.lsMaintenanceItemsReference,
      this.lsMaintenanceItemsWithPrice
    )
    this.maintenanceItemsChange.next(this.lsMaintenanceItems)
  }

  @Output()
  onItemsWereModified = new EventEmitter<MaintenanceItem[]>()

  constructor(
    private maintenanceItemManagerService: MaintenanceItemManagerService
  ) {
    this.sharedFunction = new SharedFunction()
    this.txtFilter = new FormControl()
    this.isDataFilted = false

    this.lsMaintenanceItems$.subscribe((maintenanceItems) => {
      this.lsMaintenanceItemsFiltered = maintenanceItems
    })

    this.txtFilter.valueChanges.subscribe((description) => {
      this.descriptionToFilter = description
      this.lsMaintenanceItemsFiltered = this.filterItemsByDescription(
        this.descriptionToFilter
      )
      this.maintenanceItemsChange.next(this.lsMaintenanceItemsFiltered)
    })
  }

  filterItemsByDescription(description: string): MaintenanceItem[] {
    return this.lsMaintenanceItems.filter((item) => {
      if (description != null) {
        this.isDataFilted = true
        return (
          item.code.toUpperCase().includes(description.toUpperCase()) ||
          item.name.toUpperCase().includes(description.toUpperCase())
        )
      } else {
        this.isDataFilted = false
        return null
      }
    })
  }

  ngOnInit(): void {
    this.initComponents()
  }

  initComponents(): void {
    this.validateCompany()
  }

  validateCompany() {
    try {
      this.companyStorage = SecurityValidators.validateUserAndCompany()
    } catch (error) {
      console.warn(error)
    }
  }

  validateTyping(event: any) {
    InputValidator.validateTyping(event, 'numbers')
  }

  formatNumber(event: any) {
    let numberToTransform = event.target.value.toString().replace(/\,/g, '')
    numberToTransform = numberToTransform != '' ? numberToTransform : 0
    event.target.value =
      this.sharedFunction.formatNumberToString(numberToTransform)
  }

  formatStringToNumber(numberFormated: string): number {
    return Math.round(parseInt(numberFormated.replace(/\,/g, '')))
  }

  removeFilter(): void {
    this.txtFilter.setValue(null)
    this.lsMaintenanceItemsFiltered = this.lsMaintenanceItems
    this.maintenanceItemsChange.next(this.lsMaintenanceItemsFiltered)
  }

  setReferencePriceByItem(event: any, item: MaintenanceItem) {
    const itemToUpdate = this.lsMaintenanceItems.find(
      (itm) => itm.id == item.id
    )
    itemToUpdate.referencePrice = this.formatStringToNumber(event.target.value)
    const indexItemToUpdate = this.lsMaintenanceItems.findIndex(
      (itm) => itm.id == itemToUpdate.id
    )
    this.lsMaintenanceItems[indexItemToUpdate] = itemToUpdate

    if (this.isDataFilted) {
      this.lsMaintenanceItemsFiltered = this.filterItemsByDescription(
        this.descriptionToFilter
      )
    } else {
      this.lsMaintenanceItemsFiltered = this.lsMaintenanceItems
    }

    this.maintenanceItemsChange.next(this.lsMaintenanceItemsFiltered)
    this.onItemsWereModified.emit(this.lsMaintenanceItems)
  }
}
