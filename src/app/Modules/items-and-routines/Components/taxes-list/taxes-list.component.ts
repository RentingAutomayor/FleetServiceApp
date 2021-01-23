
import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { setTime } from 'ngx-bootstrap/chronos/utils/date-setters';
import { Tax } from 'src/app/Models/Tax';
import { MaintenanceItemService } from '../../Services/MaintenanceItem/maintenance-item.service';

@Component({
  selector: 'app-taxes-list',
  templateUrl: './taxes-list.component.html',
  styleUrls: ['./taxes-list.component.scss', '../../../../../assets/styles/checkbox.scss']
})
export class TaxesListComponent implements OnInit, OnChanges {
  lsTaxes: Tax[];
  lsTaxesSelected: Tax[];
  itemHandleTax: boolean;
  prefixTaxContainer: string;
  @Input() itmHandleTax: boolean;
  @Input() inpLsTaxSelected: Tax[];
  @Output() taxWasSelected = new EventEmitter<Tax[]>();
  

  constructor(
    private maintenanceItemService: MaintenanceItemService
  ) {
    this.itemHandleTax = false;
    this.prefixTaxContainer = 'chk_tax_';
    this.lsTaxesSelected = [];
  }
  ngOnChanges(changes: SimpleChanges): void {

    for (const change in changes) {
      console.log("[taxt list component]")
      console.log(change);
      switch(change){
        case "itmHandleTax":
          this.activateTaxes(this.itmHandleTax);
          break;
        case "inpLsTaxSelected":
          this.checkTaxButton(this.inpLsTaxSelected);
          break;
      } 
    }
    
  }

  ngOnInit(): void {
    this.getTaxesList();
    this.activateTaxes(this.itmHandleTax);
  }



  async getTaxesList() {
    try {
      this.lsTaxes = await this.maintenanceItemService.getTaxesList();
      console.log(this.lsTaxes);
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
        } else {
          this.lsTaxesSelected = [];
          inputYes.checked = false;
          inputNo.checked = true;
          this.itemHandleTax = false;
          this.taxWasSelected.emit(this.lsTaxesSelected);
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
      console.log("Agrega impuesto");
    } else {
      let taxTemp = this.lsTaxesSelected.find(tx => tx.id == tax.id);
      let index = this.lsTaxesSelected.indexOf(taxTemp);
      console.log("Elimina impuesto: ", index);
      this.lsTaxesSelected.splice(index, 1);
    }
    console.log(this.lsTaxesSelected);
    this.taxWasSelected.emit(this.lsTaxesSelected);
  }


  checkTaxButton(lsTaxes: Tax[]) {
    try {
      setTimeout(() => {
        this.disableChecks();

        console.log("[checkTaxButton]");
        console.log(lsTaxes);

        this.lsTaxesSelected =  lsTaxes;
        if(lsTaxes.length > 0){
          for (const tax of lsTaxes) {
            let idCheck = `#${this.getTaxContainerId(tax.id)}`;
            let checkTax: HTMLInputElement = document.querySelector(idCheck);
            checkTax.checked = true;
          }
        }              
      }, 300)
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
