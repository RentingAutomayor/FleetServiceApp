import { Pipe, PipeTransform } from '@angular/core'
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem'

@Pipe({
  name: 'calculatePriceByAmount',
})
export class CalculatePriceByAmountPipe implements PipeTransform {
  transform(
    item: MaintenanceItem,
    referencePrice?: number,
    amout?: number
  ): number {
    let priceByItem = referencePrice * amout
    return priceByItem
  }
}
