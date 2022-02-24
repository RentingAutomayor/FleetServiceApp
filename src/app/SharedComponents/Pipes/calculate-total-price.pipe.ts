import { Pipe, PipeTransform } from '@angular/core'
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem'

@Pipe({
  name: 'calculateTotalPrice',
})
export class CalculateTotalPricePipe implements PipeTransform {
  transform(item: MaintenanceItem, price?: number, amount?: number): number {
    let totalPrice = 0
    let taxValue = 0
    let amoutByItem = item.amount ? item.amount : 0
    let referencePrice = item.referencePrice * amoutByItem

    if (item.handleTax) {
      for (const tax of item.lsTaxes) {
        const taxTmp = Math.round(referencePrice * (tax.percentValue / 100))
        taxValue += taxTmp
      }
    }

    totalPrice += referencePrice + taxValue
    return totalPrice
  }
}
