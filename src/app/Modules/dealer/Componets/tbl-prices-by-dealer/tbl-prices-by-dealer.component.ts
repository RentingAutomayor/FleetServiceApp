import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
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

import { SharedFunction }  from 'src/app/Models/SharedFunctions';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-tbl-prices-by-dealer',
  templateUrl: './tbl-prices-by-dealer.component.html',
  styleUrls: ['./tbl-prices-by-dealer.component.scss']
})
export class TblPricesByDealerComponent implements OnInit {

  lsMaintenanceItems: MaintenanceItem[] = [];
  lsMaintenanceItemsFiltered: MaintenanceItem[] = [];


  maintenanceItemsChange: BehaviorSubject<MaintenanceItem[]> = new  BehaviorSubject<MaintenanceItem[]> ([]);
  lsMaintenanceItems$ = this.maintenanceItemsChange.asObservable();

  lsPricesByItem: MaintenanceItemService[];
  isAwaiting: boolean;

  priceByDealer: PricesByDealer;
  @Input() countChanges: number;
  @Output() pricesWasCanceled = new EventEmitter<boolean>();
  pag = 1;
  companyStorage: Company;
  sharedFunction: SharedFunction;

  //ft-0202
  dealerSelected: Dealer;
  @Input('dealer')
  set setDealerSelected(dealer: Dealer){
    this.dealerSelected = dealer;
    this.getListMaintenanceItems(this.dealerSelected.id);
  }

  txtFilter: FormControl;
  isDataFilted: boolean ;
  descriptionToFilter :string|null = null;

  constructor(
    private maintenanceItemService: MaintenanceItemService,
    private dealerService: DealerService
  ) {
    this.sharedFunction = new SharedFunction();
    this.txtFilter = new FormControl();
    this.isDataFilted = false;

    this.lsMaintenanceItems$.subscribe(maintenanceItems => {
      this.lsMaintenanceItemsFiltered = maintenanceItems;
    });

    this.txtFilter.valueChanges
    .subscribe(description => {
      this.descriptionToFilter = description;
      this.lsMaintenanceItemsFiltered = this.filterItemsByDescription(this.descriptionToFilter);
      this.maintenanceItemsChange.next(this.lsMaintenanceItemsFiltered);
    });
  }

  filterItemsByDescription( description: string): MaintenanceItem[]{
    return this.lsMaintenanceItems.filter(item =>{
      if (description != null){
        this.isDataFilted = true;
        return item.code.toUpperCase().includes(description.toUpperCase()) ||
        item.name.toUpperCase().includes(description.toUpperCase());
      }else{
        this.isDataFilted = false;
        return null;
      }
    });
  }

  ngOnInit(): void {
    this.initComponents();
  }

  initComponents(): void{
    this.validateCompany();
    if (this.dealerSelected != null || this.dealerSelected != undefined) {
      this.getPricesByDealer(this.dealerSelected.id);
    }

  }


  validateCompany() {
    try {
      this.companyStorage = SecurityValidators.validateUserAndCompany();
    } catch (error) {
      console.warn(error);
    }
  }

  getListMaintenanceItems(dealer_id: number) {
    try {
      this.isAwaiting = true;
      this.maintenanceItemService.getMaintenanceItems(dealer_id)
      .subscribe(maintenanceItems => {
        this.lsMaintenanceItems = maintenanceItems;
        this.maintenanceItemsChange.next(this.lsMaintenanceItems);
      });
      this.isAwaiting = false;
    } catch (error) {
      console.warn(error);
    }
  }

  getPricesByDealer(pDealer_id: number) {
    try {
      this.isAwaiting = true;
      this.maintenanceItemService.getPricesByDealer(pDealer_id)
      .subscribe(itemsByDealer => {
        this.priceByDealer = itemsByDealer;
      });
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

  setPriceByItemIntoTable(lsItemReference: MaintenanceItem[], lsItemPrice: MaintenanceItem[]) {

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
    let numberToTransform = event.target.value.toString().replace(/\,/g, '');
    numberToTransform = (numberToTransform != '') ? numberToTransform : 0;
    event.target.value = this.sharedFunction.formatNumberToString(numberToTransform);
  }

  removeFilter(){
    this.txtFilter.setValue(null);
    this.lsMaintenanceItemsFiltered = this.lsMaintenanceItems;
    this.maintenanceItemsChange.next(this.lsMaintenanceItemsFiltered);
  }

  setReferencePriceByItem(event: any, item: MaintenanceItem){
    const itemToUpdate = this.lsMaintenanceItems.find(itm => itm.id == item.id);
    itemToUpdate.referencePrice = this.formatStringToNumber(event.target.value);

    const indexItemToUpdate = this.lsMaintenanceItems.findIndex(itm => itm.id == itemToUpdate.id);
    this.lsMaintenanceItems[indexItemToUpdate] = itemToUpdate;

    if(this.isDataFilted){
      this.lsMaintenanceItemsFiltered = this.filterItemsByDescription(this.descriptionToFilter);
    }else{
      this.lsMaintenanceItemsFiltered =  this.lsMaintenanceItems;
    }

    this.maintenanceItemsChange.next( this.lsMaintenanceItemsFiltered );
  }

  formatStringToNumber(numberFormated: string): number{
    return Math.round( parseInt( numberFormated.replace(/\,/g, '') ) );
  }

}
