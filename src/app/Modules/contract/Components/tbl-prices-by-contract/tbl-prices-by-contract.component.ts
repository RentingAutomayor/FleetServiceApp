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
  sharedFunction: SharedFunction

  constructor(
    private maintenanceItemService: MaintenanceItemService,
    private dealerService: DealerService,
    private contractService: ContractService
  ) { 
    this.lsMaintenanceItems = [];
    this.pricesByDealer = new PricesByDealer()
    this.pricesByDealer.lsMaintenanceItems = [];
    this.discountValue = 0;
    this.discountType = new DiscountType();
    this.sharedFunction = new SharedFunction();
    this.lsMaintenanceItemsWithPrice = [];
  }


  ngOnChanges(changes: SimpleChanges): void {

    console.log("[CHANGES TBL PRICES BY CONTRACT]")
    console.log(changes);
    for (let change in changes) {

      switch(change){
        case "getPricesOfContract":
          this.setPricesByContract();
          break;
        case "changeDealer":
            this.dealerSelected = this.dealerService.getDealerSelected();
            if (this.dealerSelected != null && this.dealerSelected != undefined) {
              this.getInfoToShowTable();
            }
          break;
        case "discountValue":
        case "discountType":
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

  getLabeTaxesId(idItem:number):string{
    return `lbl_taxes_${idItem}`;
  }

  getLabeTotalId(idItem:number):string{
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
      let dealer_id = (this.dealerSelected != null)? this.dealerSelected.id:0;
      this.lsMaintenanceItems = await this.maintenanceItemService.getMaintenanceItems(dealer_id);
      this.isAwaiting = false;
    } catch (error) {
      console.warn(error);
    }
  }

  async getPricesByDealer() {
    try {
      this.dealerSelected = this.dealerService.getDealerSelected();
      this.isAwaiting = true;
      let dealer_id = (this.dealerSelected != null)? this.dealerSelected.id:0;
      this.pricesByDealer = await this.maintenanceItemService.getPricesByDealer(dealer_id);
      console.log("[prices by contract-- prices by dealer] : ", this.pricesByDealer);     
      this.isAwaiting = false;
    } catch (error) {
      console.warn(error);
    }
  }

  setValuesIntoTable(){
    try {
      setTimeout(() =>{
        this.lsMaintenanceItemsWithPrice = [];
        this.lsMaintenanceItems.forEach(item => {
          let itemTmp:MaintenanceItem = item;
          let contractPrice = this.getContractPrice(item.id);
          let discValue = this.calculateDiscount(parseFloat(contractPrice));         
          let priceWithoutDiscount = parseFloat(contractPrice) - discValue;

          let taxesValue = 0;
          if(item.handleTax){
            if(item.lsTaxes.length > 0){
              taxesValue = this.calculateTaxes(priceWithoutDiscount,item.lsTaxes);
            }
          }         

          let totalByItem =  priceWithoutDiscount + taxesValue;

          itemTmp.referencePrice = parseFloat(contractPrice);
          itemTmp.discountValue = discValue;
          itemTmp.taxesValue = taxesValue;

          this.setContractPrice(item.id,priceWithoutDiscount);
          this.setDiscoutValue(item.id,discValue);
          this.setTaxesValue(item.id, taxesValue);
          this.setTotalValue(item.id,totalByItem)

          this.lsMaintenanceItemsWithPrice.push(itemTmp);

        })

        this.contractService.setItemsWithPrice(this.lsMaintenanceItemsWithPrice);
      },1500);
    } catch (error) {
      console.warn("[setValuesIntoTable]", error);      
    }
  }

  async getPricesByContract() {
    try {
   
      this.contractSelected = this.contractService.getContract();
      let contract_id = (this.contractSelected != null && this.contractSelected != undefined)? this.contractSelected.id : 0;
      this.isAwaiting = true;
      this.pricesByContract = await this.maintenanceItemService.getPricesByContract(contract_id);
      console.log("[prices by contract] : ", this.pricesByContract);
      this.isAwaiting = false;
    } catch (error) {
      console.warn(error);
    }
  }


  setDealerPriceIntoTable(itemId: number): string {
    try {
      let referencePrice = '0';

      if (this.pricesByDealer.lsMaintenanceItems != null && this.pricesByDealer.lsMaintenanceItems != undefined && this.pricesByDealer.lsMaintenanceItems.length > 0) {
        //Reference price by dealer
        let itemDealer = this.pricesByDealer.lsMaintenanceItems.find(item => item.id == itemId);
        let valueToShow = '0';
        if(itemDealer == null){
          //This case appear when someone create a new product
          let item = this.lsMaintenanceItems.find(mi => mi.id == itemId);
          valueToShow = (item != null)?item.referencePrice.toString():'0';
        }else{
          valueToShow = itemDealer.referencePrice.toString();
        }
        referencePrice = valueToShow;
      } else {
        //Reference price by item
        if (this.lsMaintenanceItems != null && this.lsMaintenanceItems != undefined) {
          let item = this.lsMaintenanceItems.find(item => item.id == itemId);
          referencePrice = item.referencePrice.toString();
        }
      }
      return referencePrice;
    } catch (error) {
      console.log(error);
    }

  }

  getContractPrice(itemId: number) {
    try {
      let contractPrice = '0';

      if (this.pricesByDealer.lsMaintenanceItems != null && this.pricesByDealer.lsMaintenanceItems != undefined && this.pricesByDealer.lsMaintenanceItems.length > 0) {
        //Reference price by dealer
        let itemDealer = this.pricesByDealer.lsMaintenanceItems.find(item => item.id == itemId);
        let valueToShow = '0';
        if(itemDealer == null){
          //This case appear when someone create a new product
          let item = this.lsMaintenanceItems.find(mi => mi.id == itemId);
          valueToShow = (item != null)?item.referencePrice.toString():'0';
        }else{
          valueToShow = itemDealer.referencePrice.toString();
        }
        contractPrice = valueToShow;
      } else {
        //Reference price by item
        if (this.lsMaintenanceItems != null && this.lsMaintenanceItems != undefined) {
          let item = this.lsMaintenanceItems.find(item => item.id == itemId);
          contractPrice = item.referencePrice.toString();
        }
      }
     
      return contractPrice;
    } catch (error) {
      console.log(error)
    }
  }

  setContractPrice(item_id:number,contractPrice:number){
    try {
      let idInputPrice = `#${this.getLabelContractPrice(item_id)}`;
      let inputPrice: HTMLSpanElement = document.querySelector(idInputPrice);
      let contractPriceFormatted = this.sharedFunction.formatNumberToString(parseFloat(contractPrice.toFixed(2)))
      inputPrice.innerText = contractPriceFormatted;
    } catch (error) {
      console.warn(error);
    }
  }

  
  setDiscoutValue(item_id:number,discountValue:number){
    try {
      let idlblDiscount = `#${this.getLabelDiscount(item_id)}`;
      let labelDiscount: HTMLSpanElement = document.querySelector(idlblDiscount);
      let discountFormatted = this.sharedFunction.formatNumberToString(parseFloat(discountValue.toFixed(2)))
      labelDiscount.innerText = discountFormatted;
    } catch (error) {
      console.warn(error);
    }
  }

  setTaxesValue(item_id:number,taxesValue:number){
    try {
      let idLblTaxes = `#${this.getLabeTaxesId(item_id)}`;
      let labelTaxes: HTMLSpanElement  = document.querySelector(idLblTaxes);
      let taxesFormatted = this.sharedFunction.formatNumberToString(parseFloat(taxesValue.toFixed(2)))
      labelTaxes.innerText = taxesFormatted;
    } catch (error) {
      console.warn(error);
    }
  }

  setTotalValue(item_id:number,totalValue:number){
    try {
      //console.log(`[setTotalValue] : ${totalValue}`);
      let idLblTotal = `#${this.getLabeTotalId(item_id)}`;
      let labelTotal: HTMLSpanElement  = document.querySelector(idLblTotal);

      let totalFormatted = this.sharedFunction.formatNumberToString(parseFloat(totalValue.toFixed(2)))
      labelTotal.innerText = totalFormatted;
    } catch (error) {
      console.warn(error);
    }
  }


  calculateDiscount(contractPrice:number):number{
    let discount = 0;
    try {
      switch(this.discountType.id){
        case DiscountTypes.PORCENTAJE_POR_REPUESTOS:
          discount = contractPrice * (this.discountValue / 100);
          break;
        case DiscountTypes.VALOR_FIJO_POR_REPUESTOS:
          discount = this.discountValue;
          break;
      }
      //console.log(`[calculateDiscount] ContractPrice =  ${contractPrice} DiscountValue = ${this.discountValue}  DiscountType = ${this.discountType.name}`);
      //console.log(discount)
      return discount;
    } catch (error) {
      return 0;
    }
   
  }

  calculateTotalByItem(contractPrice:number, item: MaintenanceItem){
    
    let valueWithoutDiscount = contractPrice
    //let taxesClue = this.calculateTaxes()
  }


 

  calculateTaxes(referencePrice: number, lsTaxes: Tax[]): number {
    let taxValue = 0;
    for (const tax of lsTaxes) {
      let taxTmp = referencePrice * (tax.percentValue / 100);
      taxValue += taxTmp;
    }                                                                                                                                                                 
    return taxValue
  }              
                                                         

  async setPricesByContract() {

    try {
      this.pricesByContract = new PricesByContract();

      this.pricesByContract.contract = this.contractService.getContract();
      this.pricesByContract.lsMaintenanceItems = cloneDeep(this.lsMaintenanceItems);

      this.pricesByContract.lsMaintenanceItems.forEach(item => {
        let idElement = `#${this.getLabelContractPrice(item.id)}`;
        let inputElement: HTMLSpanElement = document.querySelector(idElement);
        let valueFormmated = inputElement.innerText.toString().replace(/,/g,'');
        item.referencePrice = parseFloat(valueFormmated);
      });

      console.log(this.pricesByContract);
      //this.lsMaintenanceItemsWasSetted.emit(this.pricesByContract.lsMaintenanceItems)

    } catch (error) {
      console.log(error)
    }


  }
}
