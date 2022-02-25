import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { DashboardClientComponent } from './Components/dashboard-client/dashboard-client.component'
import { DashboardClientRoutingModule } from './dashboardClient-routing.module'
import { SharedModule } from 'src/app/SharedComponents/shared.module'
import { CardTrxDetailComponent } from './Components/card-trx-detail/card-trx-detail.component'
import { MatCardModule } from '@angular/material/card'
import { MatProgressBarModule } from '@angular/material/progress-bar'

@NgModule({
  declarations: [DashboardClientComponent, CardTrxDetailComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DashboardClientRoutingModule,
    MatCardModule,
    MatProgressBarModule,
  ],
})
export class DashboardClientModule {}
