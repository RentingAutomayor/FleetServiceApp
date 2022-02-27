import { Pipe, PipeTransform } from '@angular/core'
import { Contract } from 'src/app/Models/Contract'
import { DiscountTypes } from 'src/app/Models/DiscountType'
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem'
import { MaintenanceItemManagerService } from '../Services/MaintenanceItemManager/maintenance-item-manager.service'

@Pipe({
  name: 'calculatePriceWithoutDiscount',
})
export class CalculatePriceWithoutDiscountPipe implements PipeTransform {
  constructor(
    private maintenanceItemManagerService: MaintenanceItemManagerService
  ) {}

  transform(
    item: MaintenanceItem,
    referencePrice?: number,
    amount?: number,
    contract?: Contract
  ): number {
    let valueByAmount =
      this.maintenanceItemManagerService.calculatePriceByAmount(
        referencePrice,
        amount
      )
    let totalDiscount = 0
    if (contract) {
      totalDiscount =
        this.maintenanceItemManagerService.calculateDiscountByItem(
          referencePrice,
          amount,
          contract
        )
    }

    let totalWithoutTaxesAndWithDiscount =
      this.maintenanceItemManagerService.calculatePriceWithDiscount(
        valueByAmount,
        totalDiscount
      )
    return totalWithoutTaxesAndWithDiscount
  }
}
