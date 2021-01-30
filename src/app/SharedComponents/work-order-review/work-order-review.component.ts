import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Transaction } from 'src/app/Models/Transaction';
import { TransactionService } from '../Services/Transaction/transaction.service';

@Component({
  selector: 'app-work-order-review',
  templateUrl: './work-order-review.component.html',
  styleUrls: ['./work-order-review.component.scss']
})
export class WorkOrderReviewComponent implements OnInit, OnChanges {
  frmWorkOrder: FormGroup;
  workOrder: Transaction;
  @Input() workOrder_id:number;

  
  constructor(
    private transactionService:TransactionService
  ) { 
    this.workOrder_id = 0;
    this.workOrder = new Transaction();
    this.frmWorkOrder = new FormGroup({});
  }

  ngOnChanges(changes: SimpleChanges): void {
    for(let change in changes){
      switch(change){
        case "workOrder_id":
          this.getTransactionById(this.workOrder_id);
          break;
      }
    }
  }

  ngOnInit(): void {
    this.getTransactionById(this.workOrder_id);
  }

  async getTransactionById(trx_id: number){
    try {
      this.transactionService.getTransactionById(trx_id)
      .then(trx => {
        this.workOrder = trx;
        console.log(this.workOrder);
      })
    } catch (error) {
      console.warn(error);
    }
  }

}
