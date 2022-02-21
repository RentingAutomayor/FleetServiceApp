import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { Dealer } from 'src/app/Models/Dealer';
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem';
import { MaintenanceItemService } from '../../../items-and-routines/Services/MaintenanceItem/maintenance-item.service';
import { DealerService } from '../../../dealer/Services/Dealer/dealer.service';
import { PricesByDealer } from 'src/app/Models/PricesByDealer';
import { PricesByContract } from 'src/app/Models/PricesByContract';
import { ContractService } from '../../Services/Contract/contract.service';
import { Contract } from 'src/app/Models/Contract';
import { cloneDeep } from 'lodash';
import { DiscountType, DiscountTypes } from 'src/app/Models/DiscountType';
import { Tax } from 'src/app/Models/Tax';
import { SharedFunction } from 'src/app/Models/SharedFunctions';

@Component({
  selector: 'app-tbl-prices-by-contract',
  templateUrl: './tbl-prices-by-contract.component.html',
  styleUrls: ['./tbl-prices-by-contract.component.scss']
})
export class TblPricesByContractComponent implements OnInit, OnChanges {
  pricesByContract: PricesByContract;
  pricesByDealer: PricesByDealer;
  lsMaintenanceItems: MaintenanceItem[];
  lsMaintenanceItemsWithPrice: MaintenanceItem[];
  isAwaiting: boolean;
  dealerSelected: Dealer;
  contractSelected: Contract;
  @Input() getPricesOfContract: number;
  @Input() changeDealer: number;
  @Input() discountType: DiscountType;
  @Input() discountValue: number;
  @Output() lsMaintenanceItemsWasSetted = new EventEmitter<MaintenanceItem[]>();
  sharedFunction: SharedFunction;

  constructor(
    private maintenanceItemService: MaintenanceItemService,
    private dealerService: DealerService,
    private contractService: ContractService
  ) {
    this.lsMaintenanceItems = [];
    this.pricesByDealer = new PricesByDealer();
    this.pricesByDealer.lsMaintenanceItems = [];
    this.discountValue = 0;
    this.discountType = new DiscountType();
    this.sharedFunction = new SharedFunction();
    this.lsMaintenanceItemsWithPrice = [];
  }


  ngOnChanges(changes: SimpleChanges): void {
    for (const change in changes) {
      switch (change){
        case 'getPricesOfContract':
          this.setPricesByContract();
          break;
        case 'changeDealer':
            this.dealerSelected = this.dealerService.getDealerSelected();
            if (this.dealerSelected != null && this.dealerSelected != undefined) {
              this.getInfoToShowTable();
            }
            break;
        case 'discountValue':
        case 'discountType':
          this.getInfoToShowTable();
          break;
      }

    }
  }

  ngOnInit(): void {
    this.initComponents();
  }

  initComponents() {
    this.getPricesOfContract = 0;
    this.changeDealer = 0;
    this.isAwaiting = false;
    this.dealerSelected = this.dealerService.getDealerSelected();
    if (this.dealerSelected != null && this.dealerSelected != undefined) {
      this.getInfoToShowTable();
    }
  }


  getLabelContractPrice(idItem: number): string {
    return `lbl_price_${idItem}`;
  }

  getLabelDiscount(idItem: number): string {
    return `lbl_discount_${idItem}`;
  }

  getLabeTaxesId(idItem: number): string{
    return `lbl_taxes_${idItem}`;
  }

  getLabeTotalId(idItem: number): string{
    return `lbl_total_${idItem}`;
  }

  async getInfoToShowTable() {
    await this.getListMaintenanceItems();
    await this.getPricesByDealer();
    await this.getPricesByContract();
    await this.setValuesIntoTable();
  }

  async getListMaintenanceItems() {
    /*
    Here, we need to bring the maintenance items of dealer setted into a contract
    */
    try {
      this.isAwaiting = true;
      const dealer_id = (this.dealerSelected != null) ? this.dealerSelected.id : 0;
      this.maintenanceItemService.getMaintenanceItems(dealer_id)
      .subscribe(maintenaceItems => {
        this.lsMaintenanceItems = maintenaceItems;
      })
      this.isAwaiting = false;
    } catch (error) {
      console.warn(error);
    }
  }

  getPricesByDealer() {
    try {
      this.dealerSelected = this.dealerService.getDealerSelected();
      this.isAwaiting = true;
      const dealer_id = (this.dealerSelected != null) ? this.dealerSelected.id : 0;
      this.maintenanceItemService.getPricesByDealer(dealer_id)
      .subscribe(itemsByDealer => {
        this.pricesByDealer = itemsByDealer;
      });
      this.isAwaiting = false;
    } catch (error) {
      console.warn(error);
    }
  }

  setValuesIntoTable(){
    try {
      setTimeout(() => {
        this.lsMaintenanceItemsWithPrice = [];
        this.lsMaintenanceItems.forEach(item => {
          const itemTmp: MaintenanceItem = item;
          const contractPrice = this.getContractPrice(item.id);
          const discValue = this.calculateDiscount(parseFloat(contractPrice));
          const priceWithoutDiscount = parseFloat(contractPrice) - discValue;

          let taxesValue = 0;
          if (item.handleTax){
            if (item.lsTaxes.length > 0){
              taxesValue = this.calculateTaxes(priceWithoutDiscount, item.lsTaxes);
            }
          }

          const totalByItem =  priceWithoutDiscount + taxesValue;

          itemTmp.referencePrice = parseFloat(contractPrice);
          itemTmp.discountValue = discValue;
          itemTmp.taxesValue = taxesValue;

          this.setContractPrice(item.id, priceWithoutDiscount);
          this.setDiscoutValue(item.id, discValue);
          this.setTaxesValue(item.id, taxesValue);
          this.setTotalValue(item.id, totalByItem);

          this.lsMaintenanceItemsWithPrice.push(itemTmp);

        });

        this.contractService.setItemsWithPrice(this.lsMaintenanceItemsWithPrice);
      }, 1500);
    } catch (error) {
      console.warn('[setValuesIntoTable]', error);
    }
  }

  async getPricesByContract() {
    try {

      this.contractSelected = this.contractService.getContract();
      const contract_id = (this.contractSelected != null && this.contractSelected != undefined) ? this.contractSelected.id : 0;
      this.isAwaiting = true;
      this.pricesByContract = await this.maintenanceItemService.getPricesByContract(contract_id);
      this.isAwaiting = false;
    } catch (error) {
      console.warn(error);
    }
  }


  setDealerPriceIntoTable(itemId: number): string {
    try {
      let referencePrice = '0';

      if (this.pricesByDealer.lsMaintenanceItems != null && this.pricesByDealer.lsMaintenanceItems != undefined && this.pricesByDealer.lsMaintenanceItems.length > 0) {
        // Reference price by dealer
        const itemDealer = this.pricesByDealer.lsMaintenanceItems.find(item => item.id == itemId);
        let valueToShow = '0';
        if (itemDealer == null){
          // This case appear when someone create a new product
          const item = this.lsMaintenanceItems.find(mi => mi.id == itemId);
          valueToShow = (item != null) ? item.referencePrice.toString() : '0';
        }else{
          valueToShow = itemDealer.referencePrice.toString();
        }
        referencePrice = valueToShow;
      } else {
        // Reference price by item
        if (this.lsMaintenanceItems != null && this.lsMaintenanceItems != undefined) {
          const item = this.lsMaintenanceItems.find(item => item.id == itemId);
          referencePrice = item.referencePrice.toString();
        }
      }
      return referencePrice;
    } catch (error) {
      // console.log(error);
    }

  }

  getContractPrice(itemId: number) {
    try {
      let contractPrice = '0';

      if (this.pricesByDealer.lsMaintenanceItems != null && this.pricesByDealer.lsMaintenanceItems != undefined && this.pricesByDealer.lsMaintenanceItems.length > 0) {
        // Reference price by dealer
        const itemDealer = this.pricesByDealer.lsMaintenanceItems.find(item => item.id == itemId);
        let valueToShow = '0';
        if (itemDealer == null){
          // This case appear when someone create a new product
          const item = this.lsMaintenanceItems.find(mi => mi.id == itemId);
          valueToShow = (item != null) ? item.referencePrice.toString() : '0';
        }else{
          valueToShow = itemDealer.referencePrice.toString();
        }
        contractPrice = valueToShow;
      } else {
        // Reference price by item
        if (this.lsMaintenanceItems != null && this.lsMaintenanceItems != undefined) {
          const item = this.lsMaintenanceItems.find(item => item.id == itemId);
          contractPrice = item.referencePrice.toString();
        }
      }

      return contractPrice;
    } catch (error) {
      console.warn(error);
    }
  }

  setContractPrice(item_id: number, contractPrice: number){
    try {
      const idInputPrice = `#${this.getLabelContractPrice(item_id)}`;
      const inputPrice: HTMLSpanElement = document.querySelector(idInputPrice);
      const contractPriceFormatted = this.sharedFunction.formatNumberToString(parseFloat(contractPrice.toFixed(2)));
      inputPrice.innerText = contractPriceFormatted;
    } catch (error) {
      console.warn(error);
    }
  }


  setDiscoutValue(item_id: number, discountValue: number){
    try {
      const idlblDiscount = `#${this.getLabelDiscount(item_id)}`;
      const labelDiscount: HTMLSpanElement = document.querySelector(idlblDiscount);
      const discountFormatted = this.sharedFunction.formatNumberToString(parseFloat(discountValue.toFixed(2)));
      labelDiscount.innerText = discountFormatted;
    } catch (error) {
      console.warn(error);
    }
  }

  setTaxesValue(item_id: number, taxesValue: number){
    try {
      const idLblTaxes = `#${this.getLabeTaxesId(item_id)}`;
      const labelTaxes: HTMLSpanElement  = document.querySelector(idLblTaxes);
      const taxesFormatted = this.sharedFunction.formatNumberToString(parseFloat(taxesValue.toFixed(2)));
      labelTaxes.innerText = taxesFormatted;
    } catch (error) {
      console.warn(error);
    }
  }

  setTotalValue(item_id: number, totalValue: number){
    try {
      const idLblTotal = `#${this.getLabeTotalId(item_id)}`;
      const labelTotal: HTMLSpanElement  = document.querySelector(idLblTotal);

      const totalFormatted = this.sharedFunction.formatNumberToString(parseFloat(totalValue.toFixed(2)));
      labelTotal.innerText = totalFormatted;
    } catch (error) {
      console.warn(error);
    }
  }


  calculateDiscount(contractPrice: number): number{
    let discount = 0;
    try {
      switch (this.discountType.id){
        case DiscountTypes.PORCENTAJE_POR_REPUESTOS:
          discount = contractPrice * (this.discountValue / 100);
          break;
        case DiscountTypes.VALOR_FIJO_POR_REPUESTOS:
          discount = this.discountValue;
          break;
      }
      return discount;
    } catch (error) {
      return 0;
    }

  }

  calculateTotalByItem(contractPrice: number, item: MaintenanceItem){
    const valueWithoutDiscount = contractPrice;
  }

  calculateTaxes(referencePrice: number, lsTaxes: Tax[]): number {
    let taxValue = 0;
    for (const tax of lsTaxes) {
      const taxTmp = referencePrice * (tax.percentValue / 100);
      taxValue += taxTmp;
    }
    return taxValue;
  }


  async setPricesByContract() {

    try {
      this.pricesByContract = new PricesByContract();

      this.pricesByContract.contract = this.contractService.getContract();
      this.pricesByContract.lsMaintenanceItems = cloneDeep(this.lsMaintenanceItems);

      this.pricesByContract.lsMaintenanceItems.forEach(item => {
        const idElement = `#${this.getLabelContractPrice(item.id)}`;
        const inputElement: HTMLSpanElement = document.querySelector(idElement);
        const valueFormmated = inputElement.innerText.toString().replace(/,/g, '');
        item.referencePrice = parseFloat(valueFormmated);
      });



    } catch (error) {
      console.warn(error);
    }


  }
}
