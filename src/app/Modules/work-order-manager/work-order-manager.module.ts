import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BranchByDealerComponent } from './Components/branch-by-dealer/branch-by-dealer.component';
import { RoutinesByVehicleModelComponent } from './Components/routines-by-vehicle-model/routines-by-vehicle-model.component';
import { WorkOrderComponent } from './Components/work-order/work-order.component';
import { WorkOrderManagerComponent } from './Components/work-order-manager/work-order-manager.component';

import { SharedModule } from 'src/app/SharedComponents/shared.module';
import { WorkOrderManagerRoutingModule } from './workOrderManager-routing.module';


@NgModule({
  declarations: [
    BranchByDealerComponent,
    RoutinesByVehicleModelComponent,
    WorkOrderComponent,
    WorkOrderManagerComponent,
  ],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    SharedModule,
    WorkOrderManagerRoutingModule
  ]
})
export class WorkOrderManagerModule { }
