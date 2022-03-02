import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { QuotaManagementComponent } from './Components/quota-management/quota-management.component'
import { SharedModule } from 'src/app/SharedComponents/shared.module'
import { QuotaManagementRoutingModule } from './quotaManagement-routing.module'
import { ClientModule } from '../client/client.module'

@NgModule({
  declarations: [QuotaManagementComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    QuotaManagementRoutingModule,
    ClientModule,
  ],
})
export class QuotaManagementModule {}
