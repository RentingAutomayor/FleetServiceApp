import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { Dealer } from 'src/app/Models/Dealer';
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem';
import { MaintenanceItemService } from '../../Services/maintenance-item.service';
import { DealerService } from '../../Services/dealer.service';
import { PricesByDealer } from 'src/app/Models/PricesByDealer';
import { PricesByContract } from 'src/app/Models/PricesByContract';
import { ContractService } from '../../Services/contract.service';
import { Contract } from 'src/app/Models/Contract';
import { cloneDeep } from 'lodash';
import { identifierModuleUrl } from '@angular/compiler';

@Component({
  selector: 'app-tbl-prices-by-contract',
  templateUrl: './tbl-prices-by-contract.component.html',
  styleUrls: ['./tbl-prices-by-contract.component.scss']
})
export class TblPricesByContractComponent implements OnInit, OnChanges {
  pricesByContract: PricesByContract;
  pricesByDealer: PricesByDealer;
  lsMaintenanceItems: MaintenanceItem[];
  isAwaiting: boolean;
  dealerSelected: Dealer;
  contractSelected: Contract;
  @Input() getPricesOfContract: number;
  @Input() changeDealer:number;

  constructor(
    private maintenanceItemService: MaintenanceItemService,
    private dealerService: DealerService,
    private contractService: ContractService
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    for (let change in changes) {
      if(change == "getPricesOfContract"){
        this.setPricesByContract();
      } 
      
      if(change == "changeDealer"){
        this.dealerSelected = this.dealerService.getDealerSelected();
        if(this.dealerSelected != null && this.dealerSelected != undefined){
          this.getInfoToShowTable();
        }        
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
    if(this.dealerSelected != null && this.dealerSelected != undefined){
     this.getInfoToShowTable();
    }    
  }


  getInputId(idItem: number): string {
    return `txtPrice_${idItem}`;
  }

  getInfoToShowTable(){
    this.getPricesByDealer();
    this.getListMaintenanceItems();    
    this.getPricesByContract();
  }

  async getListMaintenanceItems() {
    try {
      this.isAwaiting = true;
      this.lsMaintenanceItems = await this.maintenanceItemService.getMaintenanceItems();
      this.isAwaiting = false;
    } catch (error) {
      console.warn(error);
    }
  }



  async getPricesByDealer() {
    try {
      this.dealerSelected = this.dealerService.getDealerSelected();
      this.isAwaiting = true;
      this.pricesByDealer = await this.maintenanceItemService.getPricesByDealer(this.dealerSelected.id);
      console.log("[prices by contract-- prices by dealer] : ", this.pricesByDealer);
      this.isAwaiting = false;
    } catch (error) {
      console.warn(error);
    }
  }


  setDealerPriceIntoTable(itemId: number): string {
    let referencePrice = '0';
    if (this.pricesByDealer.lsMaintenanceItems != null && this.pricesByDealer.lsMaintenanceItems != undefined && this.pricesByDealer.lsMaintenanceItems.length > 0) {
      //Reference price by dealer
      let item = this.pricesByDealer.lsMaintenanceItems.find(item => item.id == itemId);
      referencePrice = item.referencePrice.toString();
    } else {
      //Reference price by item
      if (this.lsMaintenanceItems != null && this.lsMaintenanceItems != undefined) {
        let item = this.lsMaintenanceItems.find(item => item.id == itemId);
        referencePrice = item.referencePrice.toString();
      }
    }
    return referencePrice;
  }

  setContractPriceIntoTable(itemId: number) {
    try {
      let contractPrice = '0';
      if (this.pricesByContract.lsMaintenanceItems != null && this.pricesByContract.lsMaintenanceItems != undefined && this.pricesByContract.lsMaintenanceItems.length > 0) {
        let item = this.pricesByContract.lsMaintenanceItems.find(item => item.id == itemId);
        contractPrice = item.referencePrice.toString();
      } else {
        if (this.pricesByDealer.lsMaintenanceItems != null && this.pricesByDealer.lsMaintenanceItems != undefined && this.pricesByDealer.lsMaintenanceItems.length > 0) {
          //Reference price by dealer
          let item = this.pricesByDealer.lsMaintenanceItems.find(item => item.id == itemId);
          contractPrice = item.referencePrice.toString();
        } else {
          if (this.lsMaintenanceItems != null && this.lsMaintenanceItems != undefined) {
            let item = this.lsMaintenanceItems.find(item => item.id == itemId);
            contractPrice = item.referencePrice.toString();
          }
        }
      }
      return contractPrice;
    } catch (error) {
      console.log(error)
    }
  }

  async getPricesByContract() {
    try {
      this.contractSelected = this.contractService.getContract();
      this.isAwaiting = true;
      this.pricesByContract = await this.maintenanceItemService.getPricesByContract(this.contractSelected.id);
      console.log("[prices by contract] : ", this.pricesByContract);
      this.isAwaiting = false;
    } catch (error) {
      console.warn(error);
    }
  }

  setPricesByContract(){

    this.pricesByContract = new PricesByContract();

    this.pricesByContract.contract = this.contractService.getContract();
    this.pricesByContract.lsMaintenanceItems = cloneDeep(this.lsMaintenanceItems);

    this.pricesByContract.lsMaintenanceItems.forEach( item => {
      let idElement = `#${this.getInputId(item.id)}`;
      let inputElement : HTMLInputElement = document.querySelector(idElement);
      item.referencePrice = parseFloat(inputElement.value);
    });

    console.log(this.pricesByContract);

    this.savePricesInDB(this.pricesByContract);
    
  }

  async savePricesInDB(priceBycontract: PricesByContract){
    try {
      this.isAwaiting = true;
      let rta = await this.maintenanceItemService.setPricesByContract(priceBycontract);
      this.isAwaiting = false;
      if(rta.response){
        alert("Se ha guardado la información del contrato: "+ priceBycontract.contract.code);
      }
    } catch (error) {
      console.warn(error);
    }
  }

}
