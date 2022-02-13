import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FrequencyComponent } from './Components/frequency/frequency.component';
import { ItemsAndRoutinesComponent } from './Components/items-and-routines/items-and-routines.component';
import { MaintenanceItemComponent } from './Components/maintenance-item/maintenance-item.component';
import { MaintenanceItemCategoryComponent } from './Components/maintenance-item-category/maintenance-item-category.component';
import { MaintenanceRoutineComponent } from './Components/maintenance-routine/maintenance-routine.component';
import { PresentationUnitComponent } from './Components/presentation-unit/presentation-unit.component';
import { TblMaintenanceItemComponent } from './Components/tbl-maintenance-item/tbl-maintenance-item.component';
import { TblMaintenanceMatrixComponent } from './Components/tbl-maintenance-matrix/tbl-maintenance-matrix.component';
import { TblMaintenanceRoutinesComponent } from './Components/tbl-maintenance-routines/tbl-maintenance-routines.component';
import { TypeOfMaintenanceItemComponent } from './Components/type-of-maintenance-item/type-of-maintenance-item.component';

import { SharedModule } from 'src/app/SharedComponents/shared.module';
import { ItemsAndRoutinesRoutingModule } from './items-and-routines-routing.module';
import { CalculateTaxesPipe } from './pipes/calculate-taxes.pipe';
import { CalculateTotalPricePipe } from './pipes/calculate-total-price.pipe';
import { TaxesListComponent } from './Components/taxes-list/taxes-list.component';

@NgModule({
  declarations: [
    FrequencyComponent,
    ItemsAndRoutinesComponent,
    MaintenanceItemComponent,
    MaintenanceItemCategoryComponent,
    MaintenanceRoutineComponent,
    PresentationUnitComponent,
    TblMaintenanceItemComponent,
    TblMaintenanceMatrixComponent,
    TblMaintenanceRoutinesComponent,
    TypeOfMaintenanceItemComponent,
    CalculateTaxesPipe,
    CalculateTotalPricePipe,
    TaxesListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ItemsAndRoutinesRoutingModule
  ],
})
export class ItemsAndRoutinesModule { }
