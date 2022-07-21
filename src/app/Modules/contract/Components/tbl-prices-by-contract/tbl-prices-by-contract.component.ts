import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { Contract } from 'src/app/Models/Contract'
import { Dealer } from 'src/app/Models/Dealer'
import { DiscountType, DiscountTypes } from 'src/app/Models/DiscountType'
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem'
import { PricesByContract } from 'src/app/Models/PricesByContract'
import { PricesByDealer } from 'src/app/Models/PricesByDealer'
import { SharedFunction } from 'src/app/Models/SharedFunctions'
import { MaintenanceItemManagerService } from 'src/app/SharedComponents/Services/MaintenanceItemManager/maintenance-item-manager.service'
import { MaintenanceItemService } from '../../../items-and-routines/Services/MaintenanceItem/maintenance-item.service'
import { ContractStateService } from '../../Services/contract-state.service'
import { ContractService } from '../../Services/Contract/contract.service'

@Component({
  selector: 'app-tbl-prices-by-contract',
  templateUrl: './tbl-prices-by-contract.component.html',
  styleUrls: ['./tbl-prices-by-contract.component.scss'],
})
export class TblPricesByContractComponent implements OnInit {
  pricesByContract: PricesByContract
  pricesByDealer: PricesByDealer
  lsMaintenanceItems: MaintenanceItem[]
  lsMaintenanceItemsWithPrice: MaintenanceItem[]
  isAwaiting: boolean
  isCheckboxVisible: boolean = false
  dealerSelected: Dealer
  contractSelected: Contract
  @Input() getPricesOfContract: number
  @Input() changeDealer: number

  @Output() lsMaintenanceItemsWasSetted = new EventEmitter<MaintenanceItem[]>()
  sharedFunction: SharedFunction
  maintencesItemsPersonalized: MaintenanceItem[] = []

  dealer: Dealer | undefined = undefined
  discountType: DiscountType | undefined = undefined
  discountValue: number = 0
  p: number = 1

  constructor(
    private maintenanceItemService: MaintenanceItemService,
    private contractService: ContractService,
    private contracStateService: ContractStateService,
    private maintenanceItemManagerService: MaintenanceItemManagerService
  ) {
    this.lsMaintenanceItems = []
    this.pricesByDealer = new PricesByDealer()
    this.pricesByDealer.lsMaintenanceItems = []
    this.discountValue = 0
    this.discountType = new DiscountType()
    this.sharedFunction = new SharedFunction()
    this.lsMaintenanceItemsWithPrice = []

    this.contracStateService.dealer$.subscribe((dealer) => {
      this.dealer = dealer
      if (dealer) {
        this.getInfoToShowTable()
      }
    })

    this.contracStateService.discountType$.subscribe((discount) => {
      this.discountType = discount
      if (
        discount?.id === DiscountTypes.PORCENTAJE_POR_REPUESTOS ||
        discount?.id === DiscountTypes.VALOR_FIJO_POR_REPUESTOS
      )
        this.isCheckboxVisible = true
      else this.isCheckboxVisible = false
      this.getTypeDiscount()
      this.calculateDiscountAndTaxes()
    })

    this.contracStateService.discountValue$.subscribe((value) => {
      this.discountValue = value
      this.calculateDiscountAndTaxes()
    })
  }

  ngOnInit(): void {
    this.initComponents()
  }

  initComponents() {
    this.getPricesOfContract = 0
    this.changeDealer = 0
    this.isAwaiting = false
    this.dealerSelected = this.dealer
    if (this.dealerSelected) {
      this.getInfoToShowTable()
    }
  }

  getInfoToShowTable() {
    this.getListMaintenanceItems()
    this.getPricesByDealer()
    this.getPricesByContract()
  }

  getListMaintenanceItems() {
    try {
      this.isAwaiting = true
      const dealer_id = this.dealerSelected != null ? this.dealerSelected.id : 0
      this.maintenanceItemService
        .getMaintenanceItems(dealer_id)
        .subscribe((maintenaceItems) => {
          this.lsMaintenanceItems = maintenaceItems
        })
      this.isAwaiting = false
    } catch (error) {
      console.warn(error)
    }
  }

  getPricesByDealer() {
    try {
      this.dealerSelected = this.dealer
      this.isAwaiting = true
      const dealer_id = this.dealerSelected?.id ?? 0
      this.maintenanceItemService
        .getPricesByDealer(dealer_id)
        .subscribe((itemsByDealer) => {
          this.pricesByDealer = itemsByDealer
          this.lsMaintenanceItems =
            this.maintenanceItemManagerService.updatePrices(
              this.lsMaintenanceItems,
              this.pricesByDealer.lsMaintenanceItems
            )
          this.calculateDiscountAndTaxes()
          this.isAwaiting = false
        })
    } catch (error) {
      console.warn(error)
    }
  }

  getPricesByContract() {
    try {
      this.contractSelected = this.contractService.getContract()
      const contract_id = this.contractSelected?.id ?? 0
      if (contract_id != 0) {
        this.isAwaiting = true
        this.maintenanceItemService
          .getPricesByContract(contract_id)
          .subscribe((pricesByCntr) => {
            this.pricesByContract = pricesByCntr
            this.maintenanceItemManagerService.updatePrices(
              this.lsMaintenanceItems,
              this.pricesByContract.lsMaintenanceItems
            )
            this.calculateDiscountAndTaxes()
            this.isAwaiting = false
          })
      }
    } catch (error) {
      console.warn(error)
    }
  }

  calculateDiscount(item: MaintenanceItem): MaintenanceItem {
    item.amount = 1
    let discountValue = 0
    if (this.discountType) {
      if (
        this.discountType.id ==
          DiscountTypes.PORCENTAJE_POR__TOTAL_MANTENIMIENTO ||
        this.discountType.id == DiscountTypes.PORCENTAJE_POR_REPUESTOS
      ) {
        discountValue = this.calculateDiscountPerPercentage(
          item.referencePrice,
          this.isCheckboxVisible
            ? this.getValueDiscount(item)
            : this.discountValue
        )
      } else {
        discountValue = this.isCheckboxVisible
          ? this.getValueDiscount(item)
          : this.discountValue
      }
    }
    const valueWithoutDiscount = item.referencePrice - discountValue

    const taxesValue = this.maintenanceItemManagerService.calculateTaxesByItem(
      item,
      valueWithoutDiscount
    )

    return {
      id: item.id,
      code: item.code,
      name: item.name,
      presentationUnit: {
        longName: item.presentationUnit.longName,
      },
      handleTax: item.handleTax,
      lsTaxes: item.lsTaxes,
      referencePrice: item.referencePrice,
      discountValue,
      taxesValue,
      valueDiscount: item.valueDiscount,
    } as MaintenanceItem
  }

  getValueDiscount(maintenceItem: MaintenanceItem): number {
    return maintenceItem.valueDiscount ?? 0
  }

  getTypeDiscount(): string {
    return this.discountType?.id === DiscountTypes.PORCENTAJE_POR_REPUESTOS ||
      this.discountType?.id ===
        DiscountTypes.PORCENTAJE_POR__TOTAL_MANTENIMIENTO
      ? 'Descuento por porcentaje'
      : 'Descuento por valor fijo'
  }

  calculateDiscountPerPercentage(totalWithoutTaxes, discountValue): number {
    return Math.round(totalWithoutTaxes * (discountValue / 100))
  }

  calculateDiscountAndTaxes() {
    this.lsMaintenanceItems = this.lsMaintenanceItems.map((item) => {
      return this.calculateDiscount(item)
    })
    this.contracStateService.setMaintenanceItems(this.lsMaintenanceItems)
  }

  savePersonalized(event: any, maintenceItem: MaintenanceItem): void {
    const discountValue = +event.target.value
    const index = this.lsMaintenanceItems.findIndex(
      (item) => item.id === maintenceItem.id
    )
    maintenceItem.valueDiscount = discountValue
    this.lsMaintenanceItems[index] = this.calculateDiscount(maintenceItem)
  }
}
