import { Injectable } from '@angular/core'
import { forEach } from 'lodash'
import { Contract } from 'src/app/Models/Contract'
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem'
import { MaintenanceItemManagerService } from '../MaintenanceItemManager/maintenance-item-manager.service'
import { CalculateTotalPricePipe } from '../../Pipes/calculate-total-price.pipe'
import { CalculateTaxesPipe } from '../../Pipes/calculate-taxes.pipe'

@Injectable({
  providedIn: 'root',
})
export class MaintenanceRoutineManagerService {
  constructor(
    private maintenanceItemManagerService: MaintenanceItemManagerService
  ) {}

  calculateTotalPriceByAmount(maintenanceItems: MaintenanceItem[]): number {
    let totalPriceByAmount = 0
    maintenanceItems.forEach((mi) => {
      totalPriceByAmount +=
        this.maintenanceItemManagerService.calculatePriceByAmount(
          mi.referencePrice,
          mi.amount
        )
    })
    return totalPriceByAmount
  }

  calculateTotalDiscount(
    maintenanceItems: MaintenanceItem[],
    contract: Contract
  ) {
    let totalDiscount = 0
    maintenanceItems.forEach((mi) => {
      totalDiscount +=
        this.maintenanceItemManagerService.calculateDiscountByItem(
          mi.referencePrice,
          mi.amount,
          contract
        )
    })
    return totalDiscount
  }

  calculateTotalTaxes(
    maintenanceItems: MaintenanceItem[],
    contract?: Contract
  ): number {
    let totalTaxes = 0

    maintenanceItems.forEach((mi) => {
      const priceByAmoutn =
        this.maintenanceItemManagerService.calculatePriceByAmount(
          mi.referencePrice,
          mi.amount
        )
      const discountByItem =
        this.maintenanceItemManagerService.calculateDiscountByItem(
          mi.referencePrice,
          mi.amount,
          contract
        )
      const priceLessDiscount =
        this.maintenanceItemManagerService.calculatePriceWithDiscount(
          priceByAmoutn,
          discountByItem
        )
      totalTaxes += this.maintenanceItemManagerService.calculateTaxesByItem(
        mi,
        priceLessDiscount
      )
    })

    console.log(`Taxes By routine -> ${totalTaxes}`)
    return totalTaxes
  }
}
