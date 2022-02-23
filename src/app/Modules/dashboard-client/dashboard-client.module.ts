import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { DashboardClientComponent } from './Components/dashboard-client/dashboard-client.component'

import { DashboardClientRoutingModule } from './dashboardClient-routing.module'

import { SharedModule } from 'src/app/SharedComponents/shared.module'

@NgModule({
  declarations: [DashboardClientComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DashboardClientRoutingModule,
  ],
})
export class DashboardClientModule {}
