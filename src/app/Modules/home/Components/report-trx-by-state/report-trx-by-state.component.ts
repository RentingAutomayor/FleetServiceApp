import { Component, Input, OnInit } from '@angular/core';
import { ReportService } from '../../Services/report.service';
import { Label, SingleDataSet } from 'ng2-charts';
import { ChartColor, ChartType } from 'chart.js';
import { Color } from 'angular-bootstrap-md';
import { Company } from 'src/app/Models/Company';
import { CompanyType } from "src/app/Models/CompanyType";

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
  
  @Input() company: Company;
  public typeOfReport: string;
  isMainCompanyLogged: boolean;
  dealer_to_filter: number;
  client_to_filter: number;
  init_date: Date;
  end_date: Date;

  constructor(
    private reportService:ReportService
  ) { }

  ngOnInit(): void {
    this.initDataToGetReport();
    this.chartDataset = this.getData();
  }
  
  initDataToGetReport() {
    switch(this.company.type){
      case CompanyType.CLIENT:
         this.typeOfReport = "dealer";
         this.isMainCompanyLogged = false;
         this.client_to_filter = this.company.id;
         this.dealer_to_filter = null;
        break;
       case CompanyType.DEALER:
         this.typeOfReport = "client";
         this.isMainCompanyLogged = false;
         this.dealer_to_filter = this.company.id;
         this.client_to_filter = null;
         break;
       case CompanyType.MAIN_COMPANY:
         this.typeOfReport = "client";
         this.isMainCompanyLogged = true;
         this.client_to_filter = null;
         this.dealer_to_filter = null;
         break;
    }
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
    await this.reportService.GetTotalCountWorkOrdersByDealerAndClient(this.client_to_filter,this.dealer_to_filter,this.init_date,this.end_date)
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
