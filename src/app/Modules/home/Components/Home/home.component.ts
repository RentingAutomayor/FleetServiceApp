import { DatePipe } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Company } from 'src/app/Models/Company'
import { CompanyType } from 'src/app/Models/CompanyType'
import { Transaction } from 'src/app/Models/Transaction'
import { TransactionState } from 'src/app/Models/TransactionState'
import { DealerService } from 'src/app/Modules/dealer/Services/Dealer/dealer.service'
import { AlertService } from 'src/app/services/alert.service'
import { TransactionService } from 'src/app/SharedComponents/Services/Transaction/transaction.service'
import { ReportService } from '../../Services/report.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', '../../../../../assets/styles/app.scss'],
})
export class HomeComponent implements OnInit {
  status: TransactionState[] = []
  company: Company
  formFilter: FormGroup
  dtStartingDate: Date
  dtEndingDate: Date
  btnSearchIsDisabled: boolean
  datesAreInvalid: boolean
  filterInitDate: Date
  filterEndDate: Date
  transactions: Transaction[] = []
  countChanges: number
  isDealer: Boolean
  isMainCompany: Boolean

  isAwaiting: boolean
  constructor(
    private _transaction: TransactionService,
    private _report: ReportService,
    private _alert: AlertService,
    private dealerService: DealerService,
    private datePipe: DatePipe,
    private fb: FormBuilder
  ) {
    this.dtStartingDate = null
    this.dtEndingDate = null
    this.btnSearchIsDisabled = true
    this.datesAreInvalid = false
    this.company = JSON.parse(sessionStorage.getItem('sessionUser')).company
    this.initForm()
  }

  initForm(): void {
    this.formFilter = this.fb.group({
      code: '',
      licencePlate: '',
      startDate: [this.filterInitDate, Validators.required],
      endDate: [this.filterEndDate, Validators.required],
      status: ['', Validators.required],
      dealer: '',
    })
  }

  ngOnInit(): void {
    this.getStatues()
    this.countChanges += 1
    this.validTypeUser()
  }

  getStatues(): void {
    this._transaction
      .getTransactionStates()
      .then((result) => (this.status = result))
  }

  filterData() {
    const filters = this.formFilter.value
    this._report.filterDate.next(filters)
    this._transaction
      .getTransactionsByDealerOrClient(
        filters.dealer,
        null,
        this.datePipe.transform(filters.startDate, 'yyyy/MM/dd'),
        this.datePipe.transform(filters.endDate, 'yyyy/MM/dd'),
        filters.code,
        filters.licencePlate,
        filters.status
      )
      .subscribe(
        (data) => {
          this.transactions = data
        },
        (badRequest) => this._alert.error(badRequest.error.Message)
      )
  }

  setDealerToFilter(): void {
    const dealerSelected = this.dealerService.getDealerSelected()
    if (dealerSelected != null) {
      this.formFilter.get('dealer').setValue(dealerSelected.id)
    } else {
      this.formFilter.get('dealer').setValue(null)
    }
  }

  validTypeUser(): void {
    switch (this.company.type) {
      case CompanyType.CLIENT:
        this.isDealer = false
        break
      case CompanyType.DEALER:
        this.isDealer = true
        break
      case CompanyType.MAIN_COMPANY:
        this.isDealer = true
        this.isMainCompany = true
        break
    }
  }

  dataWasLoadReportAmmountWorkOrdersByClientOrDealer(dataWasLoad: boolean) {
    if (!dataWasLoad) {
      this.isAwaiting = true
    } else {
      this.isAwaiting = false
    }
  }

  dataWasLoadReportTrxByState(dataWasLoad: boolean) {
    if (!dataWasLoad) {
      this.isAwaiting = true
    } else {
      this.isAwaiting = false
    }
  }

  dataWasLoadReportTrxByVehicle(dataWasLoad: boolean) {
    if (!dataWasLoad) {
      this.isAwaiting = true
    } else {
      this.isAwaiting = false
    }
  }

  dataWasLoadReportValuesByMonth(dataWasLoad: boolean) {
    if (!dataWasLoad) {
      this.isAwaiting = true
    } else {
      this.isAwaiting = false
    }
  }
}
