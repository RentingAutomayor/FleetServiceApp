import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem';
import { MaintenanceItemService } from '../../../items-and-routines/Services/MaintenanceItem/maintenance-item.service';
import { DealerService } from '../../Services/Dealer/dealer.service';
import { Dealer } from 'src/app/Models/Dealer';
import { PricesByDealer } from 'src/app/Models/PricesByDealer';
import { cloneDeep } from 'lodash';
import { SecurityValidators } from 'src/app/Models/SecurityValidators';
import { Company } from 'src/app/Models/Company';
import { CompanyType } from 'src/app/Models/CompanyType';
import { InputValidator } from 'src/app/Utils/InputValidator';
import { Tax } from 'src/app/Models/Tax';
import { SharedFunction }  from 'src/app/Models/SharedFunctions';
@Component({
  selector: 'app-tbl-prices-by-dealer',
  templateUrl: './tbl-prices-by-dealer.component.html',
  styleUrls: ['./tbl-prices-by-dealer.component.scss']
})
export class TblPricesByDealerComponent implements OnInit, OnChanges {
  lsMaintenanceItems: MaintenanceItem[];
  lsPricesByItem: MaintenanceItemService[];
  isAwaiting: boolean;
  dealerSelected: Dealer;
  priceByDealer: PricesByDealer;
  @Input() countChanges: number;
  @Output() pricesWasCanceled = new EventEmitter<boolean>();
  pag = 1;
  companyStorage: Company;
  sharedFunction: SharedFunction;

  constructor(
    private maintenanceItemService: MaintenanceItemService,
    private dealerService: DealerService
  ) {
    this.sharedFunction = new SharedFunction();
   }

  ngOnChanges(changes: SimpleChanges): void {
    for (const change in changes) {
      if (change == 'countChanges') {
        this.dealerSelected = this.dealerService.getDealerToUpdate();
      }
    }
  }

  ngOnInit(): void {
    this.initComponents();
  }

  initComponents() {
    this.validateCompany();
    this.dealerSelected = this.dealerService.getDealerToUpdate();

    if (this.dealerSelected != null || this.dealerSelected != undefined) {
      this.getListMaintenanceItems(this.companyStorage.id);
      this.getPricesByDealer(this.dealerSelected.id);
    }

  }

  getLabelTaxesId(idItem: number) {
    return `lbl_taxes_${idItem}`;
  }

  getLabelTotalId(idItem: number){
    return `lbl_total_${idItem}`;
  }

  validateCompany() {
    try {
      this.companyStorage = SecurityValidators.validateUserAndCompany();
    } catch (error) {
      console.warn(error);
    }
  }



  async getListMaintenanceItems(dealer_id: number) {
    try {
      this.isAwaiting = true;
      this.lsMaintenanceItems = await this.maintenanceItemService.getMaintenanceItems(dealer_id);
      this.isAwaiting = false;
    } catch (error) {
      console.warn(error);
    }
  }

  async getPricesByDealer(pDealer_id: number) {
    try {
      this.isAwaiting = true;
      this.priceByDealer = await this.maintenanceItemService.getPricesByDealer(pDealer_id);
      this.isAwaiting = false;

      if (this.priceByDealer.lsMaintenanceItems != null
        && this.priceByDealer.lsMaintenanceItems != undefined
        && this.priceByDealer.lsMaintenanceItems.length > 0) {

        setTimeout(() => {
          this.setPriceByItemIntoTable(this.lsMaintenanceItems, this.priceByDealer.lsMaintenanceItems);
        }, 1000);

      } else {
        setTimeout(() => {
          this.setPriceByItemIntoTable(this.lsMaintenanceItems, null);
        }, 1000);
      }

    } catch (error) {
      console.warn(error);
    }
  }

  diableScrollBehaviorOnInputs() {
    const aElements = document.querySelectorAll('input[type=number]');

    for (let i = 0; i < aElements.length; i++) {
      aElements[i].addEventListener('wheel', function(event) {
        event.preventDefault();
      });
    }
  }

  getInputId(idItem: number): string {
    return `txtPrice_${idItem}`;
  }

  setPriceByItemIntoTable(lsItemReference: MaintenanceItem[], lsItemPrice: MaintenanceItem[]) {
    try {
      if (lsItemPrice == null || lsItemPrice == undefined) {
        lsItemReference.forEach(item => {
          const idTxt = `#${this.getInputId(item.id)}`;
          const inputItem: HTMLInputElement = document.querySelector(idTxt);


          const valueFormated = this.sharedFunction.formatNumberToString(parseFloat(item.referencePrice.toFixed(2)));
          inputItem.value = valueFormated;
          this.showTaxesAndTotal(valueFormated, item);
        });
      } else {
        lsItemReference.forEach(item => {
          const priceByDealer = lsItemPrice.find(it => it.id == item.id);
          const idTxt = `#${this.getInputId(item.id)}`;
          const inputItem: HTMLInputElement = document.querySelector(idTxt);
          const valueToShow =   (priceByDealer != null) ? priceByDealer.referencePrice.toString() : item.referencePrice;

          const valueFormatedToShow = parseFloat(valueToShow.toString());
          const numToShow = this.sharedFunction.formatNumberToString(parseFloat(valueFormatedToShow.toString()));
          const valueFormated = numToShow;

          inputItem.value = valueFormated;
          this.showTaxesAndTotal(valueFormated, item);
        });
      }
    } catch (error) {
      console.warn(error);
    }

  }

  async savePrices() {
    // Clone the ls items
    const pricesByDealer = new PricesByDealer();
    pricesByDealer.dealer = this.dealerSelected;

    const lsNewPrices = cloneDeep(this.lsMaintenanceItems);

    lsNewPrices.forEach(item => {
      const idTxt = `#${this.getInputId(item.id)}`;
      const txtPrice: HTMLInputElement = document.querySelector(idTxt);

      const valueFormmated = txtPrice.value.replace(/,/g, '');
      item.referencePrice = parseFloat(valueFormmated);
    });

    pricesByDealer.lsMaintenanceItems = lsNewPrices;

    try {
      this.isAwaiting = true;
      const rta = await this.maintenanceItemService.setPricesByDealer(pricesByDealer);
      this.isAwaiting = false;
      if (rta.response) {
        alert(rta.message);
      }

    } catch (error) {
      console.warn(error);
    }

  }


  cancelPrices() {
    if (confirm('¿Está seguro que desea cancelar?, si lo hace puede que pierda la información consignada acá')) {
      this.pricesWasCanceled.emit(true);
    }
  }

  validateTyping(event: any) {
    InputValidator.validateTyping(event, 'numbers');
  }

  formatNumber(event: any){
    const numberToTransform = event.target.value.toString().replace(/\,/g, '');
    event.target.value = this.sharedFunction.formatNumberToString(numberToTransform);
  }

  showTaxesAndTotal(price: string, item: MaintenanceItem) {
    try {
      const newPrice = parseFloat(price.replace(/\,/g, ''));
      let taxesValue = 0;
      let total = 0;

      if (item.handleTax) {
        if (item.lsTaxes.length > 0){
          taxesValue = this.calculateTaxes(newPrice, item.lsTaxes);
        }
      }
      total = parseFloat(newPrice.toString()) + parseFloat(taxesValue.toString());

      this.printTaxesAndTotal(item.id, taxesValue, total);

    } catch (error) {
      console.warn(error);
    }
  }

  printTaxesAndTotal(idItem: number , taxes: number, total: number){
    try {
      const idSpanTax = `#${this.getLabelTaxesId(idItem)}`;
      const spanElementTax: HTMLSpanElement = document.querySelector(idSpanTax);
      const taxesFormmated = taxes.toFixed(2);
      spanElementTax.innerText = this.sharedFunction.formatNumberToString(parseFloat(taxesFormmated));

      const idSpantotal = `#${this.getLabelTotalId(idItem)}`;
      const spanElementTotal: HTMLSpanElement = document.querySelector(idSpantotal);
      const totalFormmaed = total.toFixed(2);
      spanElementTotal.innerText = this.sharedFunction.formatNumberToString(parseFloat(totalFormmaed));

    } catch (error) {
      console.warn(error);
    }

  }

  calculateTaxes(referencePrice: number, lsTaxes: Tax[]): number {
    let taxValue = 0;
    for (const tax of lsTaxes) {
      const taxTmp = referencePrice * (tax.percentValue / 100);
      taxValue += taxTmp;
    }
    return taxValue;
  }

}
