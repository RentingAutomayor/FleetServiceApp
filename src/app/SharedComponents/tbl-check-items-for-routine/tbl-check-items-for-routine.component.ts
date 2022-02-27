import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { Contract } from 'src/app/Models/Contract'
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem'
import { MaintenanceRoutineManagerService } from 'src/app/SharedComponents/Services/MaintenanceRoutineManager/maintenance-routine-manager.service'

@Component({
  selector: 'app-tbl-check-items-for-routine',
  templateUrl: './tbl-check-items-for-routine.component.html',
  styleUrls: [
    './tbl-check-items-for-routine.component.scss',
    '../../../assets/styles/checkbox.scss',
  ],
})
export class TblCheckItemsForRoutineComponent implements OnInit {
  itemsWereChanged: BehaviorSubject<MaintenanceItem[]> = new BehaviorSubject<
    MaintenanceItem[]
  >([])
  maintenanceItems$ = this.itemsWereChanged.asObservable()

  lsMaintenanceItems: MaintenanceItem[] = []
  @Input('maintenanceItems')
  set setLsMaintenanceItems(items: MaintenanceItem[]) {
    this.lsMaintenanceItems = items
    this.itemsWereChanged.next(this.lsMaintenanceItems)
    this.checkItemsSelected(this.lsMaintenanceItemsSelected)
  }

  lsMaintenanceItemsSelected: MaintenanceItem[] = []
  @Input('maintenanceItemsSelected')
  set setLsMaintenanceItemsSelected(itemsSelected: MaintenanceItem[]) {
    this.lsMaintenanceItemsSelected = itemsSelected
    //console.log(itemsSelected)
    this.checkItemsSelected(this.lsMaintenanceItemsSelected)
  }

  contract: Contract = null
  @Input('contract')
  set setContract(contractSelected: Contract) {
    this.contract = contractSelected
  }

  disableControls: boolean = false
  totalPriceByAmount = 0
  totalDiscount = 0
  totalLessDiscount = 0
  totalTaxes = 0
  totalRoutine = 0

  @Output()
  onItemsWereSelected = new EventEmitter<MaintenanceItem[]>()

  @Output()
  onRoutineWasCalculated = new EventEmitter<number>()

  constructor(
    private maintenanceRoutineManagerService: MaintenanceRoutineManagerService
  ) {}

  ngOnInit(): void {}

  getCheckBoxId(id: number) {
    return `chk_${id}`
  }

  getTextAmountId(pId: number) {
    return `txt_${pId}`
  }

  pickItem(isChecked: boolean, item: MaintenanceItem) {
    const idTxt = `#txt_${item.id}`
    const txtAmount: HTMLInputElement = document.querySelector(idTxt)

    const itemSelected = this.lsMaintenanceItemsSelected.find(
      (mi) => mi.id == item.id
    )
    const amount = '0'

    if (isChecked) {
      txtAmount.disabled = false
      this.addOrUpdateMaintenanceItemIntoList(item)
    } else {
      txtAmount.disabled = true
      this.deleteMaintenanceItemToList(item)
    }
    txtAmount.value = amount
    const amountFloat = parseFloat(amount)
    this.updateAmoutByItem(amountFloat, item)
  }

  validateTyping(event: any, item: MaintenanceItem) {
    const amountValue = event.target.value
    if (amountValue < 0) {
      event.target.value = 0
      this.updateAmoutByItem(0, item)
      alert('No se permiten cantidades negativas')
    }
    this.updateAmoutByItem(amountValue, item)
  }

  updateAmoutByItem(amount: number, item: any) {
    const indexItem = this.lsMaintenanceItems.findIndex(
      (mi) => item.id == mi.id
    )
    item.amount = amount
    this.lsMaintenanceItems[indexItem] = item
    this.addOrUpdateMaintenanceItemIntoList(item)
  }

  addOrUpdateMaintenanceItemIntoList(item: MaintenanceItem) {
    //Index de los items seleccionados pero no estan en la tabla que se muestra
    const indexItem = this.lsMaintenanceItemsSelected.findIndex(
      (mi) => mi.id == item.id
    )
    if (indexItem >= 0) {
      this.lsMaintenanceItemsSelected[indexItem] = item
    } else {
      this.lsMaintenanceItemsSelected.push(item)
    }

    this.calculateTotals(this.lsMaintenanceItemsSelected)

    this.onItemsWereSelected.emit(this.lsMaintenanceItemsSelected)
  }

  updateAmountByIntoReferenceList(item: MaintenanceItem) {
    const idesItemToShow = this.lsMaintenanceItems.findIndex(
      (mi) => mi.id == item.id
    )

    if (idesItemToShow >= 0) {
      this.lsMaintenanceItems[idesItemToShow] = item
    } else {
      this.lsMaintenanceItems.push(item)
    }

    this.itemsWereChanged.next(this.lsMaintenanceItems)
  }

  deleteMaintenanceItemToList(item: MaintenanceItem) {
    const indexItem = this.lsMaintenanceItemsSelected.findIndex(
      (mi) => mi.id == item.id
    )
    this.lsMaintenanceItemsSelected.splice(indexItem, 1)
    this.calculateTotals(this.lsMaintenanceItemsSelected)
    this.onItemsWereSelected.emit(this.lsMaintenanceItemsSelected)
  }

  calculateTotalPriceByAmount(itemsSelected: MaintenanceItem[]) {
    this.totalPriceByAmount =
      this.maintenanceRoutineManagerService.calculateTotalPriceByAmount(
        itemsSelected
      )
  }

  calculateTotalDiscount(itemsSelected: MaintenanceItem[]) {
    this.totalDiscount =
      this.maintenanceRoutineManagerService.calculateTotalDiscount(
        itemsSelected,
        this.contract
      )
  }

  calculatePriceLessDiscount() {
    this.totalLessDiscount = this.totalPriceByAmount - this.totalDiscount
  }

  calculateTotalTaxes(itemsSelected: MaintenanceItem[]) {
    this.totalTaxes = 0
    this.totalTaxes = this.maintenanceRoutineManagerService.calculateTotalTaxes(
      itemsSelected,
      this.contract
    )
  }

  calculateRoutinePrice() {
    this.totalRoutine = this.totalLessDiscount + this.totalTaxes
    this.onRoutineWasCalculated.emit(this.totalRoutine)
  }

  checkItemsSelected(itemsSelected: MaintenanceItem[]) {
    if (itemsSelected) {
      //debugger
      itemsSelected.forEach((mi) => {
        this.updateAmountByIntoReferenceList(mi)
        try {
          //check the input for the maintenance Item
          const idCheck = `#${this.getCheckBoxId(mi.id)}`
          const chekbox: HTMLInputElement = document.querySelector(idCheck)
          chekbox.checked = true
          //enable the checkbox
          const idTxt = `#${this.getTextAmountId(mi.id)}`
          const txtAmount: HTMLInputElement = document.querySelector(idTxt)
          txtAmount.disabled = false
        } catch (error) {
          console.log(`${mi.name} -> no existe checkbox ... continua`)
        }
      })

      this.calculateTotals(itemsSelected)
    }
  }

  calculateTotals(itemsSelected: MaintenanceItem[]) {
    this.calculateTotalPriceByAmount(itemsSelected)
    this.calculateTotalDiscount(itemsSelected)
    this.calculatePriceLessDiscount()
    this.calculateTotalTaxes(itemsSelected)
    this.calculateRoutinePrice()
  }
}
