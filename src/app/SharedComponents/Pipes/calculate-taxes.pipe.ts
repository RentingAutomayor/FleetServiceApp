import { Pipe, PipeTransform } from '@angular/core'
import { Contract } from 'src/app/Models/Contract'
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem'
import { MaintenanceItemManagerService } from '../Services/MaintenanceItemManager/maintenance-item-manager.service'

@Pipe({
  name: 'calculateTaxes',
})
export class CalculateTaxesPipe implements PipeTransform {
  constructor(
    private maintenanceItemManagerService: MaintenanceItemManagerService
  ) {}
  transform(
    item: MaintenanceItem,
    referencePrice?: number,
    amount?: number,
    contract?: Contract
  ): number {
    let taxes = 0
    amount = amount ? amount : 0
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
            contract
          )
      }

      let totalWithoutTaxesAndWithDiscount =
        this.maintenanceItemManagerService.calculatePriceWithDiscount(
          valueByAmount,
          totalDiscount
        )

      taxes = this.maintenanceItemManagerService.calculateTaxesByItem(
        item,
        totalWithoutTaxesAndWithDiscount
      )
    }
    return taxes
  }
}
