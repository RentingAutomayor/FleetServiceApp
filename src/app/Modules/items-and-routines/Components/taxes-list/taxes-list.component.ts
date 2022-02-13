
import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges} from '@angular/core';
import { Tax } from 'src/app/Models/Tax';
import { MaintenanceItemService } from '../../Services/MaintenanceItem/maintenance-item.service';
import { ItemHandleTaxes } from 'src/app/Models/ItemHandleTaxes';

@Component({
  selector: 'app-taxes-list',
  templateUrl: './taxes-list.component.html',
  styleUrls: ['./taxes-list.component.scss', '../../../../../assets/styles/checkbox.scss']
})
export class TaxesListComponent implements OnInit, OnChanges {
  lsTaxes: Tax[];
  lsTaxesSelected: Tax[];
  prefixTaxContainer: string;
  @Input() itemHandleTax: boolean;
  @Input() inpLsTaxSelected: Tax[];
  @Output() taxWasSelected = new EventEmitter<ItemHandleTaxes>();
  modelItemHadleTaxes: ItemHandleTaxes = {} as ItemHandleTaxes;
  taxesAreInvalid: boolean;

  disableControls: boolean;
  @Input('disableControls')
  set setDisableControls(value: boolean){
    this.disableControls = value;
  }


  constructor(
    private maintenanceItemService: MaintenanceItemService
  ) {
    this.prefixTaxContainer = 'chk_tax_';
    this.lsTaxesSelected = [];
    this.taxesAreInvalid = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    try {
      this.activateTaxes(this.itemHandleTax);
      if (this.itemHandleTax){
        this.checkTaxButton(this.inpLsTaxSelected);
      }
    } catch (error) {
      //// console.warn(error)
    }

  }

  ngOnInit(): void {
    this.getTaxesList();
  }

  async getTaxesList() {
    try {
      this.maintenanceItemService.getTaxesList()
      .then(taxes => {
        this.lsTaxes = taxes;

      });
    } catch (error) {
      // console.warn(error);
    }
  }

  activateTaxes(value: boolean) {
    try {
      const inputYes: HTMLInputElement = document.querySelector('#chkYes');
      const inputNo: HTMLInputElement = document.querySelector('#chkNo');
      this.itemHandleTax = value;
      if (value) {
        inputYes.checked = true;
        inputNo.checked = false;
        this.modelItemHadleTaxes  = {
          handleTaxes: this.itemHandleTax,
          lsTaxes: this.lsTaxesSelected
        };
        this.taxesAreInvalid = (this.lsTaxesSelected.length > 0) ? false : true;
        this.taxWasSelected.emit(this.modelItemHadleTaxes);
      } else {
        this.lsTaxesSelected = [];
        inputYes.checked = false;
        inputNo.checked = true;
        this.modelItemHadleTaxes  = {
          handleTaxes: this.itemHandleTax,
          lsTaxes: this.lsTaxesSelected
        };
        this.taxesAreInvalid = false;
        this.taxWasSelected.emit(this.modelItemHadleTaxes);
      }


    } catch (error) {
      // console.warn(error);
    }
  }

  getTaxContainerId(id: number) {
    return `${this.prefixTaxContainer}${id}`;
  }

  AddOrRemoveTaxToList(event: any, tax: Tax) {
    if (event.target.checked) {
      this.lsTaxesSelected.push(tax);
    } else {
      const taxTemp = this.lsTaxesSelected.find(tx => tx.id == tax.id);
      const index = this.lsTaxesSelected.indexOf(taxTemp);
      this.lsTaxesSelected.splice(index, 1);
    }

    this.taxesAreInvalid  = (this.lsTaxesSelected.length > 0) ? false : true;
    this.modelItemHadleTaxes  = {
      handleTaxes: this.itemHandleTax,
      lsTaxes: this.lsTaxesSelected
    };
    this.taxWasSelected.emit(this.modelItemHadleTaxes);
  }


  async checkTaxButton(lsTaxes: Tax[]) {
    try {
      this.disableChecks();
      await setTimeout(() => {
        this.lsTaxesSelected =  lsTaxes;
        if (lsTaxes.length > 0){
          this.taxesAreInvalid = false;
          for (const tax of lsTaxes) {
            const idCheck = `#${this.getTaxContainerId(tax.id)}`;
            const checkTax: HTMLInputElement = document.querySelector(idCheck);
            checkTax.checked = true;
            this.modelItemHadleTaxes  = {
              handleTaxes: this.itemHandleTax,
              lsTaxes: this.lsTaxesSelected
            };
            this.taxWasSelected.emit(this.modelItemHadleTaxes);
          }
        }else{
          this.taxesAreInvalid = true;
        }
      }, 100);


    } catch (error) {
      // console.warn(error);
    }

  }

  disableChecks(){
    try {
      for (const tax of this.lsTaxes) {
        const idCheck = `#${this.getTaxContainerId(tax.id)}`;
        const checkTax: HTMLInputElement = document.querySelector(idCheck);
        checkTax.checked = false;
      }
    } catch (error) {
      // console.warn(error);
    }

  }

}
