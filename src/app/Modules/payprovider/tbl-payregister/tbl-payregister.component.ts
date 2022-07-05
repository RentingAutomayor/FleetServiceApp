import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Bill } from 'src/app/Models/Bill';
import { BillStateDto } from 'src/app/Models/BillStateDTO';
import { getClassState } from 'src/app/Utils/getClassState';
import { BillService } from '../services/bill.service';

@Component({
  selector: 'app-tbl-payregister',
  templateUrl: './tbl-payregister.component.html',
  styleUrls: ['./tbl-payregister.component.scss']
})
export class TblPayregisterComponent implements OnInit {
  init_date : string;
  end_date : string;
  lsbill : Bill [];
  isAllChecked = false;
  selecttedBills : Bill [] = [];

  txtfilter = new FormGroup(
    {
      code           : new FormControl(''),
      date_init      : new FormControl(''),
      txtCliente        : new FormControl(''),
      date_end       : new FormControl(''),
      txtState          : new FormControl(''),
      Concesionario  : new FormControl(''),
    }
  )

  constructor(
    private BillService: BillService,
    ) {

     }

  ngOnInit(): void {
    this.initComponents();
  }

  async initComponents(){
    await this.getDataTransactions();
  }

  async getDataTransactions() {

    try{
      this.BillService.getbills().subscribe(
        (data) => {
          console.log(data)
          this.lsbill = data;
          //fitrar solo por factura pagada
          this.lsbill = this.lsbill.filter(x => x.BillStateDto.name == "PAGADA");
          console.log("array de bills", this.lsbill)
        }
      );


    }catch (e){
      console.warn(e)
    }
  }

  resetFilter() {
    this.txtfilter.reset();
  }

  getClass(name: string){
    return getClassState(name);
  }





}
