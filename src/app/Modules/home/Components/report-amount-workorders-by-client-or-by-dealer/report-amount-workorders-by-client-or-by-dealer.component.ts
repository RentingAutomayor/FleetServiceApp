import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ChartType, ChartDataSets, ChartOptions, ChartColor } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chart.js';
import { ReportService } from '../../Services/report.service';
import { Color } from 'angular-bootstrap-md';
import { Company } from 'src/app/Models/Company';
import { CompanyType } from 'src/app/Models/CompanyType';


@Component({
  selector: 'app-report-amount-workorders-by-client-or-by-dealer',
  templateUrl: './report-amount-workorders-by-client-or-by-dealer.component.html',
  styleUrls: ['./report-amount-workorders-by-client-or-by-dealer.component.scss']
})
export class ReportAmountWorkordersByClientOrByDealerComponent implements OnInit, OnChanges {
  public chartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      yAxes: [{
        ticks: {
          min: 0,
          max : 10 ,
          stepSize: 1
        }

      }],
      xAxes: [{}]

    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };

  public chartLabels: Label[] = [];
  public chartType: ChartType = 'line';
  public chartLegend = true;
  public chartPlugin = [pluginDataLabels];
  public chartData: ChartDataSets[] = [];
  public typeOfReport: string;

  @Input() company: Company;
  isMainCompanyLogged: boolean;
  dealer_to_filter: number;
  client_to_filter: number;
  @Input() init_date: Date;
  @Input() end_date: Date;
  @Output() dataWasLoad = new EventEmitter<boolean>();


  constructor(
    private reportService: ReportService
  ) {
    this.isMainCompanyLogged = false;
    this.dealer_to_filter = null;
    this.client_to_filter = null;
    this.init_date = null;
    this.end_date = null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataWasLoad.emit(false);
    this.getDataToReport();
  }

  ngOnInit(): void {
    this.initDataToGetReport();
    this.getDataToReport();
  }


  initDataToGetReport() {
   switch (this.company.type){
     case CompanyType.CLIENT:
        this.typeOfReport = 'dealer';
        this.isMainCompanyLogged = false;
        this.client_to_filter = this.company.id;
        this.dealer_to_filter = null;
        break;
      case CompanyType.DEALER:
        this.typeOfReport = 'client';
        this.isMainCompanyLogged = false;
        this.dealer_to_filter = this.company.id;
        this.client_to_filter = null;
        break;
      case CompanyType.MAIN_COMPANY:
        this.typeOfReport = 'client';
        this.isMainCompanyLogged = true;
        this.client_to_filter = null;
        this.dealer_to_filter = null;
        break;
   }
  }



  async getDataToReport() {
    console.warn('[getDataToReport]', this.client_to_filter, this.dealer_to_filter, this.init_date, this.end_date);
    if (this.typeOfReport ==  'client'){
      await this.reportService.GetAmountWorkOrdersByClientAndMonth(this.client_to_filter, this.dealer_to_filter, this.init_date, this.end_date)
      .then(data => {
        let aLabels = [];
        data.forEach(row => {
          const labelTmp = `${row.Mes}-${row.Anio}`;
          aLabels = this.validateLabels (aLabels, labelTmp);
        });
        this.chartLabels = aLabels;
        this.validateDataSets(data);
      });
    }else if (this.typeOfReport == 'dealer'){
      await this.reportService.GetAmountWorkOrdersByDealerAndMonth(this.client_to_filter, this.dealer_to_filter, this.init_date, this.end_date)
      .then(data => {
        let aLabels = [];
        data.forEach(row => {
          const labelTmp = `${row.Mes}-${row.Anio}`;
          aLabels = this.validateLabels (aLabels, labelTmp);
        });
        this.chartLabels = aLabels;
        this.validateDataSets(data);
      });
    }
    this.dataWasLoad.emit(true);
  }

  validateLabels(aLabels: string[], label: string): string[]{
    let labelExists = false;
    aLabels.forEach(aLabel => {
      if (aLabel == label){
        labelExists = true;
      }
    });

    if (!labelExists){
      aLabels.push(label);
    }
    return aLabels;
  }


  validateDataSets(data: any){
    console.log('validateDataSets');
    console.table(data);
    const aDataSet = [];
    let clientExist = false;
    let dealerExist = false;

    data.forEach(row => {
      if (this.typeOfReport == 'client'){
        clientExist = false;
        aDataSet.forEach(client => {
          if (client == row.Cliente){
            clientExist = true;
          }
        });

        if (!clientExist){
          aDataSet.push(row.Cliente);
        }
      }else if (this.typeOfReport == 'dealer'){
        dealerExist = false;
        aDataSet.forEach(dealer => {
          if (dealer == row.Concesionario){
            dealerExist = true;
          }
        });

        if (!dealerExist){
          aDataSet.push(row.Concesionario);
        }
      }

    });

    this.chartData = [];

    aDataSet.forEach(dts => {
      const dt = {data: [], label: dts};

      this.chartData.push(dt);
    });

    this.validateDataPosition(data);

  }


  validateDataPosition(data: any){
    let indexClient = 0;
    let indexDealer = 0;
    let indexMonth = 0;

    // INIT char data In 0
    this.chartData.forEach(dataReport => {
      this.chartLabels.forEach(lbl => {
        dataReport.data.push(0);
      });
    });

    data.forEach(row => {
      const labelTmp = `${row.Mes}-${row.Anio}`;
      indexMonth = this.chartLabels.indexOf(labelTmp);


      if (this.typeOfReport == 'client'){
        indexClient = this.chartData.findIndex(dt => dt.label == row.Cliente);
        this.chartData[indexClient].data.splice(indexMonth, 1, row.Cantidad);

      }else if (this.typeOfReport == 'dealer'){
        indexDealer = this.chartData.findIndex(dt => dt.label == row.Concesionario);
        this.chartData[indexDealer].data.splice(indexMonth, 1, row.Cantidad);

      }

    });


  }


  changeDataByClient(){
    this.typeOfReport = 'client';
    this.getDataToReport();
  }

  changeDataByDealer(){
    this.typeOfReport = 'dealer';
    this.getDataToReport();
  }



}
