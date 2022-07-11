import {
  Component,
  Input,
  Output,
  OnChanges,
  OnInit,
  SimpleChanges,
  EventEmitter,
} from '@angular/core'
import { ChartType, ChartDataSets, ChartOptions, ChartColor } from 'chart.js'
import { Label } from 'ng2-charts'
import * as pluginDataLabels from 'chart.js'
import { ReportService } from '../../Services/report.service'
import { Color } from 'angular-bootstrap-md'
import { Company } from 'src/app/Models/Company'
import { CompanyType } from 'src/app/Models/CompanyType'

@Component({
  selector: 'app-report-workorders-value-by-month',
  templateUrl: './report-workorders-value-by-month.component.html',
  styleUrls: ['./report-workorders-value-by-month.component.scss'],
})
export class ReportWorkordersValueByMonthComponent
  implements OnInit, OnChanges
{
  public chartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      yAxes: [
        {
          ticks: {
            min: 0,
            max: 5000000,
            stepSize: 500000,
          },
        },
      ],
      xAxes: [{}],
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  }

  public chartLabels: Label[] = []
  public chartType: ChartType = 'bar'
  public chartLegend = true
  public chartPlugin = [pluginDataLabels]
  public chartData: ChartDataSets[] = []
  public chartColors: Color[] = [{ backgroundColor: '#ade498' }]

  @Input() company: Company
  public typeOfReport: string
  isMainCompanyLogged: boolean
  dealer_to_filter: number
  client_to_filter: number
  filterData: any = { startDate: null, endDate: null }
  @Output() dataWasLoad = new EventEmitter<boolean>()

  constructor(private reportService: ReportService) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.dataWasLoad.emit(false)
    this.getDataToReport()
  }

  getDataToFilter(): void {
    this.reportService.filterDate.subscribe((data) => {
      this.filterData = data
      this.getDataToReport()
    })
  }

  ngOnInit(): void {
    this.getDataToFilter()
    this.initDataToGetReport()
    this.getDataToReport()
  }

  initDataToGetReport() {
    console.warn('[initDataToGetReport]', this.company)
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

  async getDataToReport() {
    console.warn(
      this.client_to_filter,
      this.dealer_to_filter,
      this.filterData.startDate,
      this.filterData.endDate
    )
    await this.reportService
      .GetWorkOrdersValueByMonth(
        this.client_to_filter,
        this.dealer_to_filter,
        this.filterData.startDate,
        this.filterData.endDate
      )
      .then((data) => {
        let aLabels = []

        data.forEach((row) => {
          const labelTmp = `${row.Mes}`
          aLabels = this.validateLabels(aLabels, labelTmp)
        })

        this.chartLabels = aLabels
        this.validateDataSets(data)
        this.dataWasLoad.emit(true)
      })
  }

  validateLabels(aLabels: string[], label: string): string[] {
    let labelExists = false
    aLabels.forEach((aLabel) => {
      if (aLabel == label) {
        labelExists = true
      }
    })

    if (!labelExists) {
      aLabels.push(label)
    }
    return aLabels
  }

  validateDataSets(data: any): any {
    this.chartData = []

    let aAnios: string[] = []
    data.forEach((row) => {
      aAnios = this.validateAniosOfDataSet(aAnios, row.Anio)
    })

    aAnios.forEach((anio) => {
      const aDataFiltered = data.filter((row) => row.Anio == anio)
      const aDataByAnio = []

      this.chartLabels.forEach((labelAmount) => {
        aDataByAnio.push(0)
      })

      aDataFiltered.forEach((row) => {
        // TODO: VALIDATE TAG

        const index = this.chartLabels.indexOf(`${row.Mes}`)

        aDataByAnio.splice(index, 1, row.Valor)
      })

      const dataSet = { data: aDataByAnio, label: anio }
      this.chartData.push(dataSet)
    })
  }

  validateAniosOfDataSet(aAnio: string[], anio: any): string[] {
    let anioExists = false
    aAnio.forEach((anioTmp) => {
      if (anioTmp == anio) {
        anioExists = true
      }
    })

    if (!anioExists) {
      aAnio.push(anio)
    }
    return aAnio
  }
}
