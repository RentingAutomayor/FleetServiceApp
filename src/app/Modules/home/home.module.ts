import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HomeComponent } from './Components/home/home.component'
import { HomeRoutingModule } from './home-routing.module'
import { SharedModule } from 'src/app/SharedComponents/shared.module'
import { ChartsModule } from 'ng2-charts'
import { ReportTrxByStateComponent } from './Components/report-trx-by-state/report-trx-by-state.component'
import { ReportTrxByVehicleComponent } from './Components/report-trx-by-vehicle/report-trx-by-vehicle.component'
import { ReportWorkordersValueByMonthComponent } from './Components/report-workorders-value-by-month/report-workorders-value-by-month.component'
import { ReportAmountWorkordersByClientOrByDealerComponent } from './Components/report-amount-workorders-by-client-or-by-dealer/report-amount-workorders-by-client-or-by-dealer.component'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import {MatDatepickerModule, } from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core'


@NgModule({
  declarations: [
    HomeComponent,
    ReportTrxByStateComponent,
    ReportTrxByVehicleComponent,
    ReportWorkordersValueByMonthComponent,
    ReportAmountWorkordersByClientOrByDealerComponent,

  ],
  imports: [
    CommonModule,
    ChartsModule,
    HomeRoutingModule,
    SharedModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
  ],
})
export class HomeModule {}
