import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './Components/home/home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from 'src/app/SharedComponents/shared.module';
import { ChartsModule } from 'ng2-charts';
import { ReportTrxByStateComponent } from './Components/report-trx-by-state/report-trx-by-state.component';
import { ReportTrxByVehicleComponent } from './Components/report-trx-by-vehicle/report-trx-by-vehicle.component';
import { ReportWorkordersValueByMonthComponent } from './Components/report-workorders-value-by-month/report-workorders-value-by-month.component';
import { ReportAmountWorkordersByClientOrByDealerComponent } from './Components/report-amount-workorders-by-client-or-by-dealer/report-amount-workorders-by-client-or-by-dealer.component';



@NgModule({
  declarations: [
    HomeComponent,
    ReportTrxByStateComponent,
    ReportTrxByVehicleComponent,
    ReportWorkordersValueByMonthComponent,
    ReportAmountWorkordersByClientOrByDealerComponent
  ],
  imports: [
    CommonModule,  
    ChartsModule ,
    HomeRoutingModule,
    SharedModule 
  ]
})
export class HomeModule { }
