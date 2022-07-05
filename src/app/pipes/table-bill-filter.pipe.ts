import { Pipe, PipeTransform } from '@angular/core';
import { Filtertable } from '../Models/filtertable';
import { Bill } from '../Models/Bill';

@Pipe({
  name: 'tableFilterBill'
})
export class TableBillFilterPipe implements PipeTransform {

  transform(items: Bill[], filter: Filtertable): any {
    if (!items || !filter) {
      return items;
    }
    return items.filter(item => this.applyFilter(item, filter));
  }

  applyFilter(item: Bill, filter: Filtertable): boolean {
    let isMatch = false;
    if (filter.code && item.bill_code.toLowerCase().indexOf(filter.code.toLowerCase()) === -1) {
      isMatch = false;
    }
    else if (filter.txtState && item.BillStateDto.name.toLowerCase().indexOf(filter.txtCliente.toLowerCase()) === -1) {
      isMatch = false;
    }
    else if (filter.txtCliente && item.name_client.toLowerCase().indexOf(filter.txtConcesionario.toLowerCase()) === -1) {
      isMatch = false;
    }
    else {
      isMatch = true;
    }
    return isMatch;
  }
}


