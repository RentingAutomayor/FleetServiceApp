import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem';
import { MaintenanceItemService } from '../../Services/maintenance-item.service';
import { DealerService } from '../../Services/dealer.service';
import { Dealer } from 'src/app/Models/Dealer';
import { PricesByDealer } from 'src/app/Models/PricesByDealer';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-tbl-prices-by-dealer',
  templateUrl: './tbl-prices-by-dealer.component.html',
  styleUrls: ['./tbl-prices-by-dealer.component.scss']
})
export class TblPricesByDealerComponent implements OnInit,OnChanges {
  lsMaintenanceItems: MaintenanceItem[];
  lsPricesByItem:MaintenanceItemService[];
  isAwaiting: boolean;
  dealerSelected: Dealer;
  priceByDealer:PricesByDealer;
  @Input() countChanges:number;
  @Output() pricesWasCanceled = new EventEmitter<boolean>();
  pag: number = 1;

  constructor(
    private maintenanceItemService: MaintenanceItemService,
    private dealerService: DealerService
  ) { }
  
  ngOnChanges(changes: SimpleChanges): void {
    for(let change in changes)  {
      if(change == "countChanges"){
        this.dealerSelected = this.dealerService.getDealerToUpdate();
      }
    }
  }

  ngOnInit(): void {
    this.initComponents();
  }

  initComponents(){
    this.dealerSelected = this.dealerService.getDealerToUpdate();
    console.log("[prices by dealer - dealer]:",this.dealerSelected);
    
    if(this.dealerSelected != null || this.dealerSelected != undefined){
      this.getListMaintenanceItems();
      this.getPricesByDealer(this.dealerSelected.id);     
    }
    
  }

 

  async getListMaintenanceItems(){
    try {
      this.isAwaiting = true;
      this.lsMaintenanceItems = await this.maintenanceItemService.getMaintenanceItems();
      this.isAwaiting = false;
    } catch (error) {
      console.warn(error);
    }
  }

  async getPricesByDealer(pDealer_id:number){
    try {
      this.isAwaiting = true;
      this.priceByDealer = await this.maintenanceItemService.getPricesByDealer(pDealer_id);
      console.log("[price by dealer response ]:", this.priceByDealer);
      this.isAwaiting = false;

      if(this.priceByDealer.lsMaintenanceItems != null 
        && this.priceByDealer.lsMaintenanceItems != undefined 
        && this.priceByDealer.lsMaintenanceItems.length > 0){

        console.log(this.priceByDealer.lsMaintenanceItems);
        setTimeout(()=>{
          this.setPriceByItemIntoTable(this.lsMaintenanceItems,this.priceByDealer.lsMaintenanceItems);
        },1000);

      }else{
        setTimeout(()=>{
          this.setPriceByItemIntoTable(this.lsMaintenanceItems,null);
        },1000);
      }

    } catch (error) {
      console.warn(error);
    }
  }

  diableScrollBehaviorOnInputs(){
    let aElements = document.querySelectorAll("input[type=number]"); 
    //console.log("[prices by dealer]",aElements);   
    for (let i = 0; i < aElements.length; i++) {
      aElements[i].addEventListener('wheel', function(event){
        //console.log(event.target);
        event.preventDefault();
      });    
    }
  }

  getInputId(idItem:number):string{
    return `txtPrice_${idItem}`;
  }

  setPriceByItemIntoTable(lsItemReference: MaintenanceItem[],lsItemPrice: MaintenanceItem[]){
    if(lsItemPrice == null || lsItemPrice == undefined){
      lsItemReference.forEach(item => {
        let idTxt = `#${this.getInputId(item.id)}`;
        console.log(idTxt);
        let inputItem: HTMLInputElement = document.querySelector(idTxt);
        inputItem.value = item.referencePrice.toString();
      });
    }else{
      lsItemReference.forEach(item => {
        let priceByDealer = lsItemPrice.find(it => it.id == item.id);
        let idTxt = `#${this.getInputId(item.id)}`;
        console.log(idTxt);
        let inputItem: HTMLInputElement = document.querySelector(idTxt);
        inputItem.value = (priceByDealer != null)?priceByDealer.referencePrice.toString():'0';
      });
    }
  }

  async savePrices(){
    //Clone the ls items
    let pricesByDealer = new PricesByDealer();
    pricesByDealer.dealer = this.dealerSelected;

    let lsNewPrices = cloneDeep(this.lsMaintenanceItems);

    lsNewPrices.forEach( item => {
      let idTxt = `#${this.getInputId(item.id)}`;
      let txtPrice: HTMLInputElement = document.querySelector(idTxt);
      item.referencePrice = parseFloat(txtPrice.value);
    });

    pricesByDealer.lsMaintenanceItems = lsNewPrices;

    try{
      this.isAwaiting = true;
      let rta = await this.maintenanceItemService.setPricesByDealer(pricesByDealer);
      this.isAwaiting = false;
      if(rta.response){
        alert(rta.message);       
      }
      
    } catch(error){
      console.warn(error);
    }

  }


  cancelPrices(){
    if(confirm("¿Está seguro que desea cancelar?, si lo hace puede que pierda la información consignada acá")){
      this.pricesWasCanceled.emit(true);
    }
  }

}
