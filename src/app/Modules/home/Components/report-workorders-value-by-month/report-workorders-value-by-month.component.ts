import { Component, OnInit } from '@angular/core';
import { ChartType, ChartDataSets, ChartOptions, ChartColor } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chart.js';
import { ReportService } from '../../Services/report.service';
import { Color } from 'angular-bootstrap-md';

@Component({
  selector: 'app-report-workorders-value-by-month',
  templateUrl: './report-workorders-value-by-month.component.html',
  styleUrls: ['./report-workorders-value-by-month.component.scss']
})
export class ReportWorkordersValueByMonthComponent implements OnInit {
  public chartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      yAxes: [{
        ticks: {
          min: 0, 
          max : 5000000 ,
          stepSize: 500000
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
  }

  public chartLabels: Label[] = [];
  public chartType: ChartType = 'bar';
  public chartLegend = true;
  public chartPlugin = [pluginDataLabels];
  public chartData: ChartDataSets[] = [];
  public chartColors: Color[] = [
    { backgroundColor: '#ade498' },
  ]

  constructor(
    private reportService:ReportService
  ) { }

  ngOnInit(): void {
    this.getDataToReport();
  }

  async getDataToReport(){
    await this.reportService.GetWorkOrdersValueByMonth()
    .then(data => {
      let aLabels = [];
      console.log("[getDataToReport]",data);
      data.forEach(row => {       
        let labelTmp = `${row.Mes}`;
        aLabels = this.validateLabels(aLabels,labelTmp);        
      });       

      console.log(aLabels);
      this.chartLabels = aLabels;
      this.validateDataSets(data);
    })
  }

  validateLabels(aLabels:string[], label:string):string[]{
    let labelExists = false;
    aLabels.forEach(aLabel => {
      if(aLabel == label){
        labelExists = true;
      }
    });

    if(!labelExists){
      aLabels.push(label);
    }
    return aLabels;
  }

  validateDataSets(data:any):any{
    // {
    //   data: [],
    //   label: 'Aprobadas',
    // },

    this.chartData = [];

    let aAnios:string[] = [];
    data.forEach(row => { 
      aAnios = this.validateAniosOfDataSet(aAnios,row.Anio);     
    });  

    aAnios.forEach(anio => {
      let aDataFiltered = data.filter(row => row.Anio == anio);
      let aDataByAnio = [];
      
      this.chartLabels.forEach(labelAmount =>{
        aDataByAnio.push(0);
      })

      aDataFiltered.forEach(row => {
        //TODO: VALIDATE TAG
        console.log("[chartLabels]", this.chartLabels)
        let index  = this.chartLabels.indexOf(`${row.Mes}`);
        console.log("[aDataFiltered]",index, this.chartLabels , `${row.Mes}-${row.Anio}`);
        aDataByAnio.splice(index,1,row.Valor);
      });
      console.log("[validateDataSets - Validate data by anio]",aDataByAnio);
      let dataSet = { data: aDataByAnio, label:anio }
      this.chartData.push(dataSet);
    });

    //console.log("[validateDataSets]",aAnios);
    console.log("[validateDataSets]",this.chartData);
  }

  validateAniosOfDataSet(aAnio: string[], anio:any): string[]{
    let anioExists = false;
    aAnio.forEach(anioTmp => {
      if(anioTmp == anio){
        anioExists = true;
      }
    });

    if(!anioExists){
      aAnio.push(anio);
    }
    return aAnio;
  }

}
