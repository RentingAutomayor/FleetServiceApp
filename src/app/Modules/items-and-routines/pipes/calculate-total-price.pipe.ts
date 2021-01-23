import { Pipe, PipeTransform } from '@angular/core';
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem';

@Pipe({
  name: 'calculateTotalPrice'
})
export class CalculateTotalPricePipe implements PipeTransform {

  transform(item: MaintenanceItem): number {
    let totalPrice = 0;
    let taxValue = 0;

    if(item.handleTax){
      for (const tax of item.lsTaxes) {
        let taxTmp = item.referencePrice * (tax.percentValue / 100);
        taxValue += taxTmp;
      }
    }  

    totalPrice += item.referencePrice + taxValue;
    return totalPrice;
  }
}
