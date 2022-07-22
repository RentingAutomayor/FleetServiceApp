import { Pipe, PipeTransform } from '@angular/core'
import { Contract } from 'src/app/Models/Contract'
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem'
import { MaintenanceItemManagerService } from '../Services/MaintenanceItemManager/maintenance-item-manager.service'

@Pipe({
  name: 'calculateDiscount',
})
export class CalculateDiscountPipe implements PipeTransform {
  constructor(
    private maintenanceItemManagerService: MaintenanceItemManagerService
  ) {}
  transform(
    item: MaintenanceItem,
    referencePrice?: number,
    amount?: number,
    contract?: Contract
  ): number {
    let discount = 0

    if (contract != null) {
      discount = this.maintenanceItemManagerService.calculateDiscountByItem(
        referencePrice,
        amount,
        contract,
        item
      )
    }
    return discount
  }
}
