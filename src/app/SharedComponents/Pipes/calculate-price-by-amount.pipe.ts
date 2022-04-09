import { Pipe, PipeTransform } from '@angular/core'
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem'
import { MaintenanceItemManagerService } from '../Services/MaintenanceItemManager/maintenance-item-manager.service'

@Pipe({
  name: 'calculatePriceByAmount',
})
export class CalculatePriceByAmountPipe implements PipeTransform {
  constructor(
    private maintenanceItemManagerService: MaintenanceItemManagerService
  ) {}

  transform(
    item: MaintenanceItem,
    referencePrice?: number,
    amount?: number
  ): number {
    return this.maintenanceItemManagerService.calculatePriceByAmount(
      referencePrice,
      amount
    )
  }
}