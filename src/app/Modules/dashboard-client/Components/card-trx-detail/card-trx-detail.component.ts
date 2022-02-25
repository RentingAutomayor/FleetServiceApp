import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { Transaction } from 'src/app/Models/Transaction'

@Component({
  selector: 'app-card-trx-detail',
  templateUrl: './card-trx-detail.component.html',
  styleUrls: ['./card-trx-detail.component.scss'],
})
export class CardTrxDetailComponent implements OnInit {
  transactionSelected: Transaction = null
  @Input('transaction')
  set setTransactionSelected(trx: Transaction) {
    this.transactionSelected = trx
  }

  @Output()
  onShowDetailTrx = new EventEmitter<Transaction>()

  @Output()
  onApproveTrx = new EventEmitter<Transaction>()

  @Output()
  onDeniedTrx = new EventEmitter<Transaction>()

  constructor() {}

  ngOnInit(): void {}

  showDetailTrx() {
    this.onShowDetailTrx.emit(this.transactionSelected)
  }

  approveTrx() {
    this.onApproveTrx.emit(this.transactionSelected)
  }

  deniedTrx() {
    this.onDeniedTrx.emit(this.transactionSelected)
  }
}
