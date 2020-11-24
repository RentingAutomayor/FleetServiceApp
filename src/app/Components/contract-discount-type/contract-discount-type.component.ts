import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DiscountType } from 'src/app/Models/DiscountType';
import { ContractService} from '../../Services/contract.service';

@Component({
  selector: 'app-contract-discount-type',
  templateUrl: './contract-discount-type.component.html',
  styleUrls: ['./contract-discount-type.component.scss']
})
export class ContractDiscountTypeComponent implements OnInit {
  frmDiscountType  : FormGroup;
  lsDiscount: DiscountType[];

  constructor(
    private contractService: ContractService
  ) {
    this.frmDiscountType = new FormGroup({
      cmbDiscount : new  FormControl('Seleccione ...')
    });
   }

  ngOnInit(): void {
    this.initComponents();
  }

  async initComponents(){
    try {
      this.lsDiscount = await this.contractService.getDiscountTypes();
    } catch (error) {
      console.error(error);
    }
  }

  setDiscountType(event:any){
    let oDiscountTmp = this.lsDiscount.find(ds => ds.id == event.value);
    this.contractService.setDiscountTypeSelected(oDiscountTmp);
  }
}
