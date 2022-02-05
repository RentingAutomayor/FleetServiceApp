import { Pipe, PipeTransform } from '@angular/core';
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem';

@Pipe({
  name: 'calculateTaxes'
})
export class CalculateTaxesPipe implements PipeTransform {

  transform(item: MaintenanceItem): number {

    let taxValue = 0;

    if(item.handleTax){
      for (const tax of item.lsTaxes) {
        let taxTmp = Math.round(item.referencePrice * (tax.percentValue / 100));
        taxValue += taxTmp;
      }
    }

    return taxValue;
  }

}
