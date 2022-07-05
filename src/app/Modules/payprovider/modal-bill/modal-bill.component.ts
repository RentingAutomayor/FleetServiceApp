import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { BillStateDto } from 'src/app/Models/BillStateDTO';
import { BillDTO } from 'src/app/Models/BillDTO';
import { BillService } from '../services/bill.service';

export interface dataFormBillModal{
  state : string;
  fecha: string;
  code: string;
  valuebeforeiva: number;
  iva: number;
  value : number;
  codeFac : string;
  trx_id : number // quitar
}

@Component({
  selector: 'app-modal-bill',
  templateUrl: './modal-bill.component.html',
  styleUrls: ['./modal-bill.component.scss']
})
export class ModalBillComponent implements OnInit {

  constructor(
    public dialogRef : MatDialogRef<ModalBillComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dataFormBillModal,
    private alertService: AlertService,
    private billService: BillService,
  ) {}




  txtForm = new FormGroup({
    state: new FormControl('')  ,
    fecha: new FormControl('')  ,
    code: new FormControl('')   ,
    valuebeforeIva: new FormControl(''),
    valueiva: new FormControl(''),
    value: new FormControl(''),
    codfac: new FormControl(''),
    trx_id: new FormControl(''),
  });

  ngOnInit(): void {
    this.initComponets()
  }


  disabled = true;

  initComponets() {
    this.txtForm.setValue({
      state: this.data.state,
      fecha: this.data.fecha,
      code: this.data.code,
      valuebeforeIva: this.data.valuebeforeiva,
      valueiva: this.data.iva,
      value: this.data.value,
      codfac: this.data.codeFac,
      trx_id : this.data.trx_id
    });
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  async registerFac(){
    this.alertService.confirm('¿Está seguro de registrar la factura?',
      () => {
        this.registerBill()
        this.dialogRef.close();
      }
    );

  }


  async registerBill() {

      const bill = new BillDTO();
      bill.STATE = new BillStateDto(1);
      bill.CODE = this.txtForm.value.codfac
      bill.trx_id = this.txtForm.value.trx_id
      bill.value = this.txtForm.value.value
      console.log(bill);

      this.billService.insertbill(bill).subscribe(data => {
        this.alertService.succes("Factura registrada correctamente");
      })
  }



}
