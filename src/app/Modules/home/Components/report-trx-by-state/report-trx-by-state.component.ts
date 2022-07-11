import { DatePipe } from '@angular/common'
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core'
import { ChartType } from 'chart.js'
import { Label, SingleDataSet } from 'ng2-charts'
import { Company } from 'src/app/Models/Company'
import { CompanyType } from 'src/app/Models/CompanyType'
import { ReportService } from '../../Services/report.service'

@Component({
  selector: 'app-report-trx-by-state',
  templateUrl: './report-trx-by-state.component.html',
  styleUrls: ['./report-trx-by-state.component.scss'],
})
export class ReportTrxByStateComponent implements OnInit, OnChanges {
  public chartLabels: Label[] = [
    'APROBADA',
    'PENDIENTE',
    'RECHAZADA',
    'FINALIZADA',
    'ANULADA',
  ]
  public chartDataset: SingleDataSet = []
  public charType: ChartType = 'pie'
  public chartColors: Array<any> = [
    {
      backgroundColor: ['#ade498', '#f0e050', '#ea2c62', '#469627', '#7e0c2c'],
    },
  ]

  @Input() company: Company
  public typeOfReport: string
  isMainCompanyLogged: boolean
  dealer_to_filter: number
  client_to_filter: number
  filterData: any = { startDate: null, endDate: null, status: 0 }
  @Output() dataWasLoad = new EventEmitter<boolean>()

  constructor(
    private reportService: ReportService,
    private datePipe: DatePipe
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.dataWasLoad.emit(false)
    this.chartDataset = []
    this.chartDataset = this.getData()
  }

  getDataToFilter(): void {
    this.reportService.filterDate.subscribe((data) => {
      this.filterData = data
      this.chartDataset = this.getData()
    })
  }

  ngOnInit(): void {
    this.getDataToFilter()
    this.initDataToGetReport()
    this.chartDataset = this.getData()
  }

  initDataToGetReport() {
    switch (this.company?.type) {
      case CompanyType.CLIENT:
        this.typeOfReport = 'dealer'
        this.isMainCompanyLogged = false
        this.client_to_filter = this.company.id
        this.dealer_to_filter = null
        break
      case CompanyType.DEALER:
        this.typeOfReport = 'client'
        this.isMainCompanyLogged = false
        this.dealer_to_filter = this.company.id
        this.client_to_filter = null
        break
      case CompanyType.MAIN_COMPANY:
        this.typeOfReport = 'client'
        this.isMainCompanyLogged = true
        this.client_to_filter = null
        this.dealer_to_filter = null
        break
    }
  }

  getData(): number[] {
    const aToReturn = []
    this.getDataToPresent().then((arrayData) => {
      arrayData.forEach((item) => {
        aToReturn.push(item)
      })
    })
    this.dataWasLoad.emit(true)
    return aToReturn
  }

  async getDataToPresent() {
    const arrayData = [0, 0, 0, 0, 0]
    await this.reportService
      .GetTotalCountWorkOrdersByDealerAndClient(
        this.client_to_filter,
        this.dealer_to_filter,
        this.datePipe.transform(this.filterData.startDate, 'yyyy/MM/dd'),
        this.datePipe.transform(this.filterData.endDate, 'yyyy/MM/dd')
      )
      .then((data) => {
        data.forEach((item) => {
          switch (item.Estado) {
            case 'APROBADA':
              arrayData.splice(0, 1, item.Cantidad)
              break
            case 'PENDIENTE':
              arrayData.splice(1, 1, item.Cantidad)
              break
            case 'RECHAZADA':
              arrayData.splice(2, 1, item.Cantidad)
              break
            case 'FINALIZADA':
              arrayData.splice(3, 1, item.Cantidad)
              break
            case 'ANULADA':
              arrayData.splice(4, 1, item.Cantidad)
              break
          }
        })
      })
    return arrayData
  }
}
