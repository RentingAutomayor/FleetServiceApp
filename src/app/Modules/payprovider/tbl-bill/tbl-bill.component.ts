import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Bill } from 'src/app/Models/Bill';
import { BillService } from '../services/bill.service';
import { AlertService } from 'src/app/services/alert.service';
import { getClassState } from 'src/app/Utils/getClassState';
import { BillDTO } from 'src/app/Models/BillDTO';
import { BillStateDto } from 'src/app/Models/BillStateDTO';
@Component({
  selector: 'app-tbl-bill',
  templateUrl: './tbl-bill.component.html',
  styleUrls: ['./tbl-bill.component.scss']
})
export class TblBillComponent implements OnInit {


  lsbill : Bill [] = [];
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
    private alertService: AlertService,
  ) {}

  ngOnInit(): void {
    this.initComponents();
    this.listenerObservable();
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
          console.log("array de bills", this.lsbill)
        }
      );


    }catch (e){
      console.warn(e)
    }
  }


  getBillSelected() : number[]{
    let bills_id : number[] = [];
    this.lsbill.forEach(bill => {
      if(bill?.isChecked){
        bills_id.push(bill?.bill_id);
      }
    })
    console.log(bills_id)
    return bills_id;
  }

  //pay bill
  async payBill(){
    let billdto : BillDTO = new BillDTO();
    billdto.BILL_ID = this.getBillSelected();
    billdto.STATE = new BillStateDto(2);

    try{
      this.BillService.paybill(billdto).subscribe(
        () => {
          this.alertService.succes("Factura pagada");
          this.getDataTransactions();
        }
      );
    }catch (e){
      console.warn(e)
    }

  }


  async deletebill(bill : Bill){
  this.alertService.confirm('¿Está seguro de eliminar la factura?',
    async () => {
      try{
        await this.BillService.deletebillbyID(bill?.bill_id).subscribe(
          () => {
            this.alertService.succes("Factura eliminada correctamente");
            this.getDataTransactions();
            this.BillService.reloadTable.next("bill");
          }
        );
      }catch (e){
        console.warn(e)
      }
    });
  }

  resetFilter() {
    this.txtfilter.reset();
  }

  checkBill(bill : Bill) {
      bill.isChecked = !bill.isChecked;
      if (bill.isChecked) {
        this.selecttedBills.push(bill);
      }
      else {
        this.selecttedBills.splice(this.selecttedBills.indexOf(bill), 1);
      }
  }

  listenerObservable(): void {
    this.BillService.reloadTable.subscribe(result => {
      if(result === "payprovider") this.getDataTransactions();
    })
  }

  toogleAll(){
    this.isAllChecked = !this.isAllChecked;
    this.lsbill.forEach(bill => {
      bill.isChecked = this.isAllChecked;
    }
    )
  }


  getClass(name: string){
    return getClassState(name);
  }
}
