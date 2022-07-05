import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { BillService } from '../services/bill.service';
import { OrderWork } from 'src/app/Models/OrderWork';
import { getClassState } from 'src/app/Utils/getClassState';
import { MatDialog } from '@angular/material/dialog';
import { dataFormBillModal, ModalBillComponent } from '../modal-bill/modal-bill.component';



@Component({
  selector: 'app-tbl-payprovider',
  templateUrl: './tbl-payprovider.component.html',
  styleUrls: ['./tbl-payprovider.component.scss']
})
export class TblPayproviderComponent implements OnInit {

  init_date: string;
  end_date: string;
  isAllChecked: boolean = false;
  lsOrderWork: OrderWork [];
  selectedOrderWorks : OrderWork [] = [];
  //@Input() dataForm : ModalBillComponent;

  txtfilter = new FormGroup(
    {
      code              : new FormControl(''),
      txtdate_init      : new FormControl(''),
      txtdate_end       : new FormControl(''),
      txtCliente        : new FormControl(''),
      txtConcesionario  : new FormControl(''),
      txtPlaca          : new FormControl(''),
    }
  )

  constructor(
    private BillService: BillService,
    private alertService: AlertService,
    public dialog: MatDialog
  ) { }


  ngOnInit(): void {
    this.initComponents();
    this.listenerObservable();
  }

  async initComponents(){
    await this.getDataTransactions();
  }

  resetFilter() {
    this.txtfilter.reset();
  }


  toogleAll() {
    this.isAllChecked = !this.isAllChecked;
    this.lsOrderWork.forEach(e => {
      e.isChecked = this.isAllChecked;
    }
    );
  }

  checkWorkOrder(orderWork: OrderWork) {
    orderWork.isChecked = !orderWork.isChecked;
    if (orderWork.isChecked) {
      this.selectedOrderWorks.push(orderWork);
    }
    else {
      this.selectedOrderWorks.splice(this.selectedOrderWorks.indexOf(orderWork), 1);
    }

  }

  /*
  getSelectedOrders() {
    this.selectedOrderWorks = this.lsOrderWork.filter(e => e.isChecked);
  }
*/
  /*
  async registerBill() {
    this.getSelectedOrders();
    console.log(this.selectedOrderWorks);
    if(this.selectedOrderWorks.length > 0){

      const bill = new BillDTO();
      bill.bill_state = new BillStateDto();
      bill.bill_state.id = 1;
      bill.idUpdates = this.selectedOrderWorks.map(e => e.trx_id);

      console.log(bill);

      this.BillService.insertbill(bill).subscribe(data => {
        this.alertService.success("Factura registrada correctamente");
        this.getDataTransactions();
      })

    }else{
      this.alertService.error('Debe seleccionar al menos una orden de trabajo');
    }
  }
  */

  async getDataTransactions() {

    try{
      this.BillService.getordersfinished()
      .subscribe(data => {
        this.lsOrderWork = data;
        this.lsOrderWork = this.lsOrderWork.filter(e => e.trx_bill_status != true);
      })
    }catch (e){
      console.warn(e)
    }
  }

  getClass(name : string){
    return getClassState(name);
  }

  listenerObservable(): void {
    this.BillService.reloadTable.subscribe(result => {
      if(result === "bill") this.getDataTransactions();
    })
  }

  //transform date to yyyy/mm/dd
  transformDate(date: Date){
    let d = new Date(date);
    return d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
  }

  openDialog( OrderWork : OrderWork): void{
    let data : dataFormBillModal = {
      state: OrderWork?.order_state.name,
      fecha: (OrderWork?.trx_updateDate != null) ?
        this.transformDate(OrderWork?.trx_updateDate)  :
        this.transformDate(OrderWork?.trx_registrationDate) ,
      code : OrderWork?.trx_code,
      valuebeforeiva : OrderWork?.beforeiva,
      iva : OrderWork?.iva,
      value : OrderWork?.trx_value,
      codeFac : '',
      trx_id : OrderWork?.trx_id
    }

    const dialogRef = this.dialog.open(ModalBillComponent, {
      width: '600px',
      height: '700px',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getDataTransactions();
      this.BillService.reloadTable.next("payprovider");
    });


  }




}
