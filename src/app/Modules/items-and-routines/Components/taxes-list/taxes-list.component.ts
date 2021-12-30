
import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges, AfterContentChecked, AfterContentInit } from '@angular/core';
import { Tax } from 'src/app/Models/Tax';
import { MaintenanceItemService } from '../../Services/MaintenanceItem/maintenance-item.service';
import { ItemHandleTaxes } from 'src/app/Models/ItemHandleTaxes';


@Component({
  selector: 'app-taxes-list',
  templateUrl: './taxes-list.component.html',
  styleUrls: ['./taxes-list.component.scss', '../../../../../assets/styles/checkbox.scss']
})
export class TaxesListComponent implements OnInit, OnChanges, AfterContentInit {
  lsTaxes: Tax[];
  lsTaxesSelected: Tax[];
  itemHandleTax: boolean;
  prefixTaxContainer: string;
  @Input() itmHandleTax: boolean;
  @Input() inpLsTaxSelected: Tax[];
  @Output() taxWasSelected = new EventEmitter<ItemHandleTaxes>();
  modelItemHadleTaxes: ItemHandleTaxes = {} as ItemHandleTaxes
  taxesAreInvalid: boolean;


  constructor(
    private maintenanceItemService: MaintenanceItemService
  ) {
    this.itemHandleTax = false;
    this.prefixTaxContainer = 'chk_tax_';
    this.lsTaxesSelected = [];
    this.taxesAreInvalid = true;
  }

  ngAfterContentInit(): void {
    this.activateTaxes(this.itmHandleTax);
    if(this.itmHandleTax){
      this.checkTaxButton(this.inpLsTaxSelected);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnInit(): void {
    //console.log("ngOnInit Taxes")
    this.getTaxesList();
    this.activateTaxes(this.itmHandleTax);
  }

  async getTaxesList() {
    try {
      await this.maintenanceItemService.getTaxesList().then(taxes => {
        this.lsTaxes = taxes;
      });
    } catch (error) {
      console.warn(error);
    }
  }

  activateTaxes(value: boolean) {
    try {
      let inputYes: HTMLInputElement = document.querySelector("#chkYes");
      let inputNo: HTMLInputElement = document.querySelector("#chkNo");
        if (value) {
          inputYes.checked = true;
          inputNo.checked = false;
          this.itemHandleTax = true;
          this.modelItemHadleTaxes  = {
            handleTaxes: this.itemHandleTax,
            lsTaxes: this.lsTaxesSelected
          }
          this.taxesAreInvalid = (this.lsTaxesSelected.length>0)?false:true
          this.taxWasSelected.emit(this.modelItemHadleTaxes);
        } else {
          this.lsTaxesSelected = [];
          inputYes.checked = false;
          inputNo.checked = true;
          this.itemHandleTax = false;
          this.modelItemHadleTaxes  = {
            handleTaxes: this.itemHandleTax,
            lsTaxes: this.lsTaxesSelected
          }
          this.taxesAreInvalid = false
          this.taxWasSelected.emit(this.modelItemHadleTaxes);
        }


    } catch (error) {
      console.warn(error);
    }
  }

  getTaxContainerId(id: number) {
    return `${this.prefixTaxContainer}${id}`;
  }

  AddOrRemoveTaxToList(event: any, tax: Tax) {
    if (event.target.checked) {
      this.lsTaxesSelected.push(tax);

    } else {
      let taxTemp = this.lsTaxesSelected.find(tx => tx.id == tax.id);
      let index = this.lsTaxesSelected.indexOf(taxTemp);

      this.lsTaxesSelected.splice(index, 1);
    }

    this.taxesAreInvalid  = (this.lsTaxesSelected.length>0)? false : true;
    this.modelItemHadleTaxes  = {
      handleTaxes: this.itemHandleTax,
      lsTaxes: this.lsTaxesSelected
    }
    this.taxWasSelected.emit(this.modelItemHadleTaxes);
  }


  checkTaxButton(lsTaxes: Tax[]) {
    try {
      setTimeout(() => {
        this.disableChecks();

          this.lsTaxesSelected =  lsTaxes;
          if(lsTaxes.length > 0){
            for (const tax of lsTaxes) {
              let idCheck = `#${this.getTaxContainerId(tax.id)}`;
              let checkTax: HTMLInputElement = document.querySelector(idCheck);
              checkTax.checked = true;
            }
          }
      }, 600)
    } catch (error) {
      console.warn(error);
    }

  }

  disableChecks(){
    try {
      for (const tax of this.lsTaxes) {
        let idCheck = `#${this.getTaxContainerId(tax.id)}`;
        let checkTax: HTMLInputElement = document.querySelector(idCheck);
        checkTax.checked = false;
      }
    } catch (error) {
      console.warn(error);
    }

  }

}
