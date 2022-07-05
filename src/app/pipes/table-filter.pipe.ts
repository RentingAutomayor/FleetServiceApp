import { Pipe, PipeTransform } from '@angular/core';
import { Transaction } from '../Models/Transaction';
import { Filtertable } from '../Models/filtertable';
import { OrderWork } from '../Models/OrderWork';

@Pipe({
  name: 'tableFilter'
})
export class TableFilterPipe implements PipeTransform {

  transform(items: OrderWork[], filter: Filtertable): any {
    if (!items || !filter) {
      return items;
    }
    return items.filter(item => this.applyFilter(item, filter));
  }

  applyFilter(item: OrderWork, filter: Filtertable): boolean {
    let isMatch = false;
    if (filter.code && item.trx_code.toLowerCase().indexOf(filter.code.toLowerCase()) === -1) {
      isMatch = false;
    }
    else if (filter.txtCliente && item.cli_name.toLowerCase().indexOf(filter.txtCliente.toLowerCase()) === -1) {
      isMatch = false;
    }
    else if (filter.txtConcesionario && item.deal_name.toLowerCase().indexOf(filter.txtConcesionario.toLowerCase()) === -1) {
      isMatch = false;
    }
    else if (filter.txtPlaca && item.veh_licensePlate.toLowerCase().indexOf(filter.txtPlaca.toLowerCase()) === -1) {
      isMatch = false;
    }
    else {
      isMatch = true;
    }
    return isMatch;
  }
}


