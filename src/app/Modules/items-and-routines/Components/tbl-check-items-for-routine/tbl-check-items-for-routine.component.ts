import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem'
import { MaintenanceRoutineManagerService } from 'src/app/SharedComponents/Services/MaintenanceRoutineManager/maintenance-routine-manager.service'

@Component({
  selector: 'app-tbl-check-items-for-routine',
  templateUrl: './tbl-check-items-for-routine.component.html',
  styleUrls: [
    './tbl-check-items-for-routine.component.scss',
    '../../../../../assets/styles/checkbox.scss',
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
  }

  lsMaintenanceItemsSelected: MaintenanceItem[] = []
  @Input('maintenanceItemsSelected')
  set setLsMaintenanceItemsSelected(itemsSelected: MaintenanceItem[]) {
    this.lsMaintenanceItemsSelected = itemsSelected
    console.log(itemsSelected)
    this.checkItemsSelected(itemsSelected)
  }

  disableControls: boolean = false
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
    const amount = itemSelected ? itemSelected.amount.toString() : '0'

    if (isChecked) {
      txtAmount.disabled = false
      this.addOrUpdateMaintenanceItemIntoList(item)
    } else {
      txtAmount.disabled = true
      this.calculateRoutinePrice()
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
    this.itemsWereChanged.next(this.lsMaintenanceItems)
  }

  addOrUpdateMaintenanceItemIntoList(item: MaintenanceItem) {
    const indexItem = this.lsMaintenanceItemsSelected.findIndex(
      (mi) => mi.id == item.id
    )
    if (indexItem >= 0) {
      this.lsMaintenanceItemsSelected[indexItem] = item
    } else {
      this.lsMaintenanceItemsSelected.push(item)
    }
    this.calculateRoutinePrice()
    this.onItemsWereSelected.emit(this.lsMaintenanceItemsSelected)
  }

  deleteMaintenanceItemToList(item: MaintenanceItem) {
    const indexItem = this.lsMaintenanceItemsSelected.findIndex(
      (mi) => mi.id == item.id
    )
    this.lsMaintenanceItemsSelected.splice(indexItem, 1)
    this.onItemsWereSelected.emit(this.lsMaintenanceItemsSelected)
  }

  calculateRoutinePrice() {
    this.totalRoutine = this.maintenanceRoutineManagerService.calculateTotal(
      this.lsMaintenanceItemsSelected
    )
    this.onRoutineWasCalculated.emit(this.totalRoutine)
  }

  async checkItemsSelected(itemsSelected: MaintenanceItem[]) {
    await setTimeout(() => {
      itemsSelected.forEach((item) => {
        try {
          const idCheck = `#${this.getCheckBoxId(item.id)}`
          const chekbox: HTMLInputElement = document.querySelector(idCheck)
          chekbox.click()
        } catch (error) {
          console.log('continua...')
        }
      })
    }, 1000)
  }
}
