import { Component, Input, OnInit } from '@angular/core';
import { ChartType, ChartDataSets, ChartOptions, ChartColor } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chart.js';
import { ReportService } from '../../Services/report.service';
import { Color } from 'angular-bootstrap-md';
import { Company } from 'src/app/Models/Company';
import { CompanyType } from "src/app/Models/CompanyType";

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
    },
    {
      data: [],
      label: 'Pendientes',
    },
    {
      data: [],
      label: 'Finalizadas',
    },
    {
      data: [],
      label: 'Anuladas',
    }


  ];

  // public chartColors: Array<any> = [
  //   { backgroundColor: ['#ade498','#ea2c62'] }
  // ];

  public chartColors: Color[] = [
    { backgroundColor: '#ade498' },
    { backgroundColor: '#ea2c62' },
    { backgroundColor: '#f0e050'},
    { backgroundColor: '#469627'},
    { backgroundColor:'#7e0c2c'}
  ]

  //{ data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' }, -> Example

  @Input() company: Company;
  public typeOfReport: string;
  isMainCompanyLogged: boolean;
  dealer_to_filter: number;
  client_to_filter: number;
  license_plate_to_filter:string;
  init_date: Date;
  end_date: Date;


  constructor(
    private reportService: ReportService
  ) { 
    this.dealer_to_filter = null;
    this.client_to_filter = null;  
    this.license_plate_to_filter = null;
    this.init_date = null;
    this.end_date = null;
  }

  ngOnInit(): void {
    this.initDataToGetReport();
    this.initRepot();
   
  }

  async initRepot(){
    await this.getWorkOrdersApproved();
    await this.getWorkOrdersCanceled();
    await this.getWorkOrdersPending();
    await this.getWorkOrdersFinished();
    await this.getWorkOrdersAnnul();
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

  async getWorkOrdersApproved() {
    console.log("[getWorkOrdersApproved]",this.client_to_filter, this.dealer_to_filter,this.license_plate_to_filter, this.init_date, this.end_date)
    await this.reportService.GetWorkOrderApprovedByVehicle(this.client_to_filter,this.dealer_to_filter, this.license_plate_to_filter, this.init_date, this.end_date)
      .then(data => {
        console.log(data);
        data.forEach(item => {
          this.chartLabels.push(item.Placa);
          this.chartData[0].data.push(item.Cantidad);
        });

       
        
      })
  }

  async getWorkOrdersCanceled() {
    console.log("[GetWorkOrderCanceledByVehicle]",this.client_to_filter, this.dealer_to_filter, this.license_plate_to_filter, this.init_date, this.end_date)
    await this.reportService.GetWorkOrderCanceledByVehicle(this.client_to_filter,this.dealer_to_filter, this.license_plate_to_filter, this.init_date, this.end_date)
      .then(data => {
        console.log(data);
        data.forEach(item => {
          //TODO: find index of vehicle to asign the correct value 
          //IF No exist approbation by vehicle add new data     
          let indexLicensePlate = this.chartLabels.indexOf(item.Placa);

          if(indexLicensePlate >= 0){
            this.chartData[1].data.splice(indexLicensePlate,1,item.Cantidad);
          }else{
            this.chartLabels.push(item.Placa);
            indexLicensePlate = this.chartLabels.indexOf(item.Placa);
            this.chartData[1].data.splice(indexLicensePlate,1,item.Cantidad);
          }        
         

          console.log(this.chartData);
          
        });
      })
  }

  async getWorkOrdersPending() {
    console.log("[getWorkOrdersPending]",this.client_to_filter, this.dealer_to_filter, this.license_plate_to_filter, this.init_date, this.end_date)
    await this.reportService.GetWorkOrderPendingByVehicle(this.client_to_filter, this.dealer_to_filter, this.license_plate_to_filter, this.init_date, this.end_date)
      .then(data => {
        console.log(data);
        data.forEach(item => {
          //TODO: find index of vehicle to asign the correct value 
          //IF No exist approbation by vehicle add new data     
          let indexLicensePlate = this.chartLabels.indexOf(item.Placa);

          if(indexLicensePlate >= 0){
            this.chartData[2].data.splice(indexLicensePlate,1,item.Cantidad);
          }else{
            this.chartLabels.push(item.Placa);
            indexLicensePlate = this.chartLabels.indexOf(item.Placa);
            this.chartData[2].data.splice(indexLicensePlate,1,item.Cantidad);
          }         

          console.log(this.chartData);
        });
      })
  }

  async getWorkOrdersFinished() {
    console.log("[getWorkOrdersFinished]",this.client_to_filter, this.dealer_to_filter, this.license_plate_to_filter, this.init_date, this.end_date)
    await this.reportService.GetWorkOrderFinishedByVehicle(this.client_to_filter, this.dealer_to_filter, this.license_plate_to_filter, this.init_date, this.end_date)
      .then(data => {
        console.log(data);
        data.forEach(item => {
          //TODO: find index of vehicle to asign the correct value 
          //IF No exist approbation by vehicle add new data     
          let indexLicensePlate = this.chartLabels.indexOf(item.Placa);

          if(indexLicensePlate >= 0){
            this.chartData[3].data.splice(indexLicensePlate,1,item.Cantidad);
          }else{
            this.chartLabels.push(item.Placa);
            indexLicensePlate = this.chartLabels.indexOf(item.Placa);
            this.chartData[3].data.splice(indexLicensePlate,1,item.Cantidad);
          }         

          console.log(this.chartData);
        });
      })
  }

  async getWorkOrdersAnnul() {
    console.log("[getWorkOrdersAnnul]",this.client_to_filter, this.dealer_to_filter, this.license_plate_to_filter, this.init_date, this.end_date)
    await this.reportService.GetWorkOrderAnnulByVehicle(this.client_to_filter, this.dealer_to_filter, this.license_plate_to_filter, this.init_date, this.end_date)
      .then(data => {
        console.log(data);
        data.forEach(item => {
          //TODO: find index of vehicle to asign the correct value 
          //IF No exist approbation by vehicle add new data     
          let indexLicensePlate = this.chartLabels.indexOf(item.Placa);

          if(indexLicensePlate >= 0){
            this.chartData[4].data.splice(indexLicensePlate,1,item.Cantidad);
          }else{
            this.chartLabels.push(item.Placa);
            indexLicensePlate = this.chartLabels.indexOf(item.Placa);
            this.chartData[4].data.splice(indexLicensePlate,1,item.Cantidad);
          }         

          console.log(this.chartData);
        });
      })
  }

}
