import { Component, OnInit } from '@angular/core';
import { ChartType, ChartDataSets, ChartOptions, ChartColor } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chart.js';
import { ReportService } from '../../Services/report.service';
import { Color } from 'angular-bootstrap-md';

@Component({
  selector: 'app-report-trx-by-vehicle',
  templateUrl: './report-trx-by-vehicle.component.html',
  styleUrls: ['./report-trx-by-vehicle.component.scss']
})
export class ReportTrxByVehicleComponent implements OnInit {

  public chartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [{
        ticks: {
          min: 0, 
          max : 5 ,
          stepSize: 1
        }
      }]
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  }

  public chartLabels: Label[] = [];
  public chartType: ChartType = 'horizontalBar';
  public chartLegend = true;
  public chartPlugin = [pluginDataLabels];
  public chartData: ChartDataSets[] = [
    {
      data: [],
      label: 'Aprobadas',
    },
    {
      data: [],
      label: 'Rechazadas',
    }
  ];

  // public chartColors: Array<any> = [
  //   { backgroundColor: ['#ade498','#ea2c62'] }
  // ];

  public chartColors: Color[] = [
    { backgroundColor: '#ade498' },
    { backgroundColor: '#ea2c62' },
  ]

  //{ data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' }, -> Example


  constructor(
    private reportService: ReportService
  ) { }

  ngOnInit(): void {
    this.getWorkOrdersApproved();
    this.getWorkOrdersCanceled();
  }

  async getWorkOrdersApproved() {
    await this.reportService.GetWorkOrderApprovedByVehicle()
      .then(data => {
        console.log(data);
        data.forEach(item => {
          this.chartLabels.push(item.Placa);
          this.chartData[0].data.push(item.Cantidad);
        });
      })
  }

  async getWorkOrdersCanceled() {
    await this.reportService.GetWorkOrderCanceledByVehicle()
      .then(data => {
        console.log(data);
        data.forEach(item => {
          //TODO: find index of vehicle to asign the correct value 
          //IF No exist approbation by vehicle add new data       
          this.chartData[1].data.push(item.Cantidad);

          console.log(this.chartData);
        });
      })
  }

}
