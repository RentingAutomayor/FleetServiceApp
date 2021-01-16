import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MovementComponent } from './Components/movement/movement.component';
import { MovementTypeComponent } from './Components/movement-type/movement-type.component';
import { TblMovementsComponent } from './Components/tbl-movements/tbl-movements.component';

import { SharedModule } from 'src/app/SharedComponents/shared.module';
import { MovementRoutingModule } from './movement-routing.module';


@NgModule({
  declarations: [
    MovementComponent,
    MovementTypeComponent,
    TblMovementsComponent
  ],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule, 
    SharedModule,
    MovementRoutingModule
  ]
})
export class MovementModule { }
