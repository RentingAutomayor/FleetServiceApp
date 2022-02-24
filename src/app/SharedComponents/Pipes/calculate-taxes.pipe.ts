import { Pipe, PipeTransform } from '@angular/core'
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem'

@Pipe({
  name: 'calculateTaxes',
})
export class CalculateTaxesPipe implements PipeTransform {
  transform(item: MaintenanceItem, price?: number, amout?: number): number {
    let taxValue = 0
    let referencePrice = price * amout

    if (item.handleTax) {
      for (const tax of item.lsTaxes) {
        const taxTmp = Math.round(referencePrice * (tax.percentValue / 100))
        taxValue += taxTmp
      }
    }

    return taxValue
  }
}
