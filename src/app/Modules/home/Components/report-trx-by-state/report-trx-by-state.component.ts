import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../Services/report.service';
import { Label, SingleDataSet } from 'ng2-charts';
import { ChartColor, ChartType } from 'chart.js';
import { Color } from 'angular-bootstrap-md';

@Component({
  selector: 'app-report-trx-by-state',
  templateUrl: './report-trx-by-state.component.html',
  styleUrls: ['./report-trx-by-state.component.scss']
})
export class ReportTrxByStateComponent implements OnInit {

  public chartLabels: Label[] = ["APROBADA","PENDIENTE","RECHAZADA"];
  public chartDataset: SingleDataSet = [];
  public charType: ChartType = 'pie';
  public chartColors: Array<any> = [ 
    { backgroundColor: ['#ade498','#f0e050','#ea2c62'] }
  ];
  

  constructor(
    private reportService:ReportService
  ) { }

  ngOnInit(): void {
    this.chartDataset = this.getData();
  }

  getData():number[]{
    let aToReturn = [];
    this.getDataToPresent().then(arrayData =>{
      arrayData.forEach(item => {
        aToReturn.push(item);
      })
    });
  
    return aToReturn;
  }

  async getDataToPresent(){
    let arrayData = [0,0,0];
    await this.reportService.GetTotalCountWorkOrdersByDealerAndClient()
    .then(data => {
      data.forEach(item => {

        switch (item.Estado) {
          case "APROBADA":
            arrayData.splice(0, 0, item.Cantidad);
            break;
          case "PENDIENTE":
            arrayData.splice(1, 0, item.Cantidad);
            break;
          case "RECHAZADA":
            arrayData.splice(2, 0, item.Cantidad);
            break;
        }        
        console.log("[Home-Component]", item);
      })
     
    });
    return arrayData;
  }

}
