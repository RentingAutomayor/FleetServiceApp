import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { BranchByDealerComponent } from './Components/branch-by-dealer/branch-by-dealer.component'
import { RoutinesByVehicleModelComponent } from './Components/routines-by-vehicle-model/routines-by-vehicle-model.component'
import { WorkOrderComponent } from './Components/work-order/work-order.component'
import { WorkOrderManagerComponent } from './Components/work-order-manager/work-order-manager.component'

import { SharedModule } from 'src/app/SharedComponents/shared.module'
import { WorkOrderManagerRoutingModule } from './workOrderManager-routing.module'
import { TblItemsToAddComponent } from './Components/tbl-items-to-add/tbl-items-to-add.component'

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'

@NgModule({
  declarations: [
    BranchByDealerComponent,
    RoutinesByVehicleModelComponent,
    WorkOrderComponent,
    WorkOrderManagerComponent,
    TblItemsToAddComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    WorkOrderManagerRoutingModule,
    BsDatepickerModule.forRoot(),
  ],
})
export class WorkOrderManagerModule {}
