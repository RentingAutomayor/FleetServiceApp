import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { Contract } from 'src/app/Models/Contract'
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem'
import { MaintenanceRoutineManagerService } from 'src/app/SharedComponents/Services/MaintenanceRoutineManager/maintenance-routine-manager.service'
import { MaintenanceItemManagerService } from 'src/app/SharedComponents/Services/MaintenanceItemManager/maintenance-item-manager.service'
import { ITransactionValues } from 'src/app/Models/transactionValues.model'
import Swal from 'sweetalert2'

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

  itemsSelectedWereModified: BehaviorSubject<MaintenanceItem[]> =
    new BehaviorSubject<MaintenanceItem[]>([])

  maintenanceItemsSelected$ = this.itemsSelectedWereModified.asObservable()

  totalRoutineLessDiscountWasModified: BehaviorSubject<number> =
    new BehaviorSubject<number>(0)
  totalRoutineLessDiscount$ =
    this.totalRoutineLessDiscountWasModified.asObservable()

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
    this.itemsSelectedWereModified.next(this.lsMaintenanceItemsSelected)
  }

  contract: Contract = null
  @Input('contract')
  set setContract(contractSelected: Contract) {
    this.contract = contractSelected
  }

  isAmountEditable: boolean = false
  @Input('isAmountEditable')
  set setIsAmountEditable(value: boolean) {
    this.isAmountEditable = value
  }

  disableControls: boolean = false
  totalPriceByAmount = 0
  totalDiscount = 0
  totalLessDiscount = 0
  totalTaxes = 0
  totalRoutine = 0

  totalLeesDiscountAndLessRaItem = 0
  totalTaxesLeesRaItem = 0

  @Output()
  onItemsWereSelected = new EventEmitter<MaintenanceItem[]>()

  @Output()
  onRoutineWasCalculated = new EventEmitter<ITransactionValues>()

  AdministrationRAItemCode = 'RAADMIN'

  constructor(
    private maintenanceRoutineManagerService: MaintenanceRoutineManagerService,
    private maintenanceItemManagerService: MaintenanceItemManagerService
  ) {
    this.maintenanceItemsSelected$.subscribe((itemsSelected) => {
      this.lsMaintenanceItemsSelected = itemsSelected

      let itemsFiltered = this.lsMaintenanceItemsSelected.filter(
        (mi) => mi.code != this.AdministrationRAItemCode
      )
      // console.log(`Items Selected changed`)
      // console.log(itemsFiltered)
      this.totalLeesDiscountAndLessRaItem = 0
      this.calculateTotals(itemsFiltered)

      //Calculate taxex only Item RA
      try {
        //this.calculatePriceOfRAAdmin()
        //debugger
        const itemRa = this.lsMaintenanceItemsSelected.find(
          (mi) => mi.code == this.AdministrationRAItemCode
        )

        if (itemRa) {
          this.updateAmountByIntoReferenceList(itemRa)

          let taxesItemRa =
            this.maintenanceItemManagerService.calculateTaxesByItem(
              itemRa,
              itemRa.referencePrice
            )

          this.totalPriceByAmount += itemRa.referencePrice
          this.totalLessDiscount =
            this.totalLeesDiscountAndLessRaItem + itemRa.referencePrice
          this.totalTaxes = this.totalTaxesLeesRaItem + taxesItemRa
          this.calculateRoutinePrice()
        }
      } catch (error) {
        console.log(error)
      }

      // console.log(`Observable it's working`)
      // console.log(itemsSelected)
      this.updateDataPerItemSelected()
      this.onItemsWereSelected.emit(this.lsMaintenanceItemsSelected)

      let transactionValues: ITransactionValues = {} as ITransactionValues
      transactionValues.valueWithDiscountWithoutTaxes = this.totalLessDiscount
      transactionValues.valueWithoutDiscount = this.totalPriceByAmount
      transactionValues.discountValue = this.totalDiscount
      transactionValues.taxesValue = this.totalTaxes
      transactionValues.value = this.totalRoutine

      this.onRoutineWasCalculated.emit(transactionValues)
    })

    let valPrev = 0
    this.totalRoutineLessDiscount$.subscribe((val) => {
      //console.log(`Valor anterior: ${valPrev} -> Valor rutina: ${val}`)
      if (valPrev != val) {
        valPrev = val
        this.calculatePriceOfRAAdmin()
      }
    })
  }

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
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No se permiten cantidades negativas'
      })
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

    this.itemsSelectedWereModified.next(this.lsMaintenanceItemsSelected)
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
    this.itemsSelectedWereModified.next(this.lsMaintenanceItemsSelected)
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
    this.totalLeesDiscountAndLessRaItem = 0
    this.totalLeesDiscountAndLessRaItem =
      this.totalPriceByAmount - this.totalDiscount
    this.totalRoutineLessDiscountWasModified.next(
      this.totalLeesDiscountAndLessRaItem
    )
  }

  calculateTotalTaxes(itemsSelected: MaintenanceItem[]) {
    this.totalTaxes = 0
    this.totalTaxesLeesRaItem = 0
    this.totalTaxesLeesRaItem =
      this.maintenanceRoutineManagerService.calculateTotalTaxes(
        itemsSelected,
        this.contract
      )
  }

  calculateRoutinePrice() {
    this.totalRoutine = this.totalLessDiscount + this.totalTaxes
  }

  checkItemsSelected(itemsSelected: MaintenanceItem[]) {
    if (itemsSelected) {
      //debugger
      itemsSelected.forEach((mi) => {
        this.updateAmountByIntoReferenceList(mi)
      })

      setTimeout(() => {
        itemsSelected.forEach((mi) => {
          try {
            if (
              mi.code.toUpperCase() ==
              this.AdministrationRAItemCode.toUpperCase()
            ) {
              this.disableItemAdminRA(mi.id)
            } else {
              //check the input for the maintenance Item
              const idCheck = `#${this.getCheckBoxId(mi.id)}`
              const chekbox: HTMLInputElement = document.querySelector(idCheck)
              chekbox.checked = true
              //enable the checkbox
              const idTxt = `#${this.getTextAmountId(mi.id)}`
              const txtAmount: HTMLInputElement = document.querySelector(idTxt)
              txtAmount.disabled = false
            }
          } catch (error) {
            console.log(`${mi.name} -> no existe checkbox ... continua`)
          }
        })
      }, 1000)
    }
  }

  calculateTotals(itemsSelected: MaintenanceItem[]) {
    this.calculateTotalPriceByAmount(itemsSelected)
    this.calculateTotalDiscount(itemsSelected)
    this.calculatePriceLessDiscount()
    this.calculateTotalTaxes(itemsSelected)
    this.calculateRoutinePrice()
  }

  disableItemAdminRA(itemId: number) {
    const idCheck = `#${this.getCheckBoxId(itemId)}`
    const chekbox: HTMLInputElement = document.querySelector(idCheck)
    const idTxt = `#${this.getTextAmountId(itemId)}`
    const txtAmount: HTMLInputElement = document.querySelector(idTxt)
    txtAmount.value = '1'
    chekbox.checked = true
    txtAmount.disabled = true
    chekbox.disabled = true
  }

  calculatePriceOfRAAdmin() {
    try {
      const itemAdmRA = this.lsMaintenanceItems.find(
        (mi) => mi.code == this.AdministrationRAItemCode
      )

      const adminPercentage =
        this.contract.client.contractualInformation.adminPercentage / 100
      const totalAdminPercentage = Math.round(
        this.totalLeesDiscountAndLessRaItem * adminPercentage
      )

      itemAdmRA.referencePrice = totalAdminPercentage
      itemAdmRA.amount = 1
      //this.updateAmountByIntoReferenceList(itemAdmRA)
      //this.addOrUpdateMaintenanceItemIntoList(itemAdmRA)
    } catch (error) {
      console.log(error)
    }
  }

  updateDataPerItemSelected() {
    this.lsMaintenanceItemsSelected.forEach((mi) => {
      let valueDiscountByItem =
        this.maintenanceItemManagerService.calculateDiscountByItem(
          mi.referencePrice,
          mi.amount,
          this.contract,
          mi
        )

      let priceLessDiscount =
        mi.referencePrice * mi.amount - valueDiscountByItem

      let taxesByItem = 0
      taxesByItem = this.maintenanceItemManagerService.calculateTaxesByItem(
        mi,
        priceLessDiscount
      )

      mi.valueWithoutDiscount = mi.referencePrice * mi.amount
      mi.discountValue = valueDiscountByItem
      mi.valueWithDiscountWithoutTaxes = priceLessDiscount
      mi.taxesValue = taxesByItem
    })
  }
}
