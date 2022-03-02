import { Pipe, PipeTransform } from '@angular/core'
import { Contract } from 'src/app/Models/Contract'
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem'
import { MaintenanceItemManagerService } from '../Services/MaintenanceItemManager/maintenance-item-manager.service'

@Pipe({
  name: 'calculateTotalPrice',
})
export class CalculateTotalPricePipe implements PipeTransform {
  constructor(
    private maintenanceItemManagerService: MaintenanceItemManagerService
  ) {}

  transform(
    item: MaintenanceItem,
    referencePrice?: number,
    amount?: number,
    contract?: Contract
  ): number {
    amount = amount ? amount : 0
    let valueTotalByItem = 0
    if (item != null && item != undefined) {
      let valueByAmount =
        this.maintenanceItemManagerService.calculatePriceByAmount(
          referencePrice,
          amount
        )

      let totalDiscount = 0
      if (contract != null) {
        totalDiscount =
          this.maintenanceItemManagerService.calculateDiscountByItem(
            referencePrice,
            amount,
            contract,
            item
          )
      }

      let totalWithoutTaxesAndWithDiscount = valueByAmount - totalDiscount

      let taxes = this.maintenanceItemManagerService.calculateTaxesByItem(
        item,
        totalWithoutTaxesAndWithDiscount
      )

      valueTotalByItem = totalWithoutTaxesAndWithDiscount + taxes
    }
    return valueTotalByItem
  }
}
