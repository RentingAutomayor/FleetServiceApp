import { Component, OnInit } from '@angular/core'
import { SecurityValidators } from 'src/app/Models/SecurityValidators'
import { Company } from 'src/app/Models/Company'
import { FormGroup, FormControl, Validators } from '@angular/forms'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', '../../../../../assets/styles/app.scss'],
})
export class HomeComponent implements OnInit {
  company: Company
  frmFilter: FormGroup
  dtStartingDate: Date
  dtEndingDate: Date
  btnSearchIsDisabled: boolean
  datesAreInvalid: boolean
  filterInitDate: Date
  filterEndDate: Date

  isAwaiting: boolean
  constructor() {
    this.dtStartingDate = null
    this.dtEndingDate = null
    this.btnSearchIsDisabled = true
    this.datesAreInvalid = false
    this.datefilter.valueChanges.subscribe(() => {
      if (this.datefilter.valid) {
        this.btnSearchIsDisabled = false
      }
      else {
        this.btnSearchIsDisabled = true
      }
    })
  }


  ngOnInit(): void {

  }

  datefilter = new FormGroup(
    {
      date_init      : new FormControl('', Validators.required),
      date_end       : new FormControl('', Validators.required),
    }
  )

  filterData() {
    this.filterInitDate = this.datefilter.value.date_init
    this.filterEndDate = this.datefilter.value.date_end
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
