import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/SharedComponents/shared.module';
import { DealerComponent } from './Componets/dealer/dealer.component';
import { TblDealerComponent } from './Componets/tbl-dealer/tbl-dealer.component';
import { TblPricesByDealerComponent } from './Componets/tbl-prices-by-dealer/tbl-prices-by-dealer.component';
import { DealerRoutingModule } from './dealer-routing.module';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    DealerComponent,
    TblDealerComponent,
    TblPricesByDealerComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DealerRoutingModule,
    MatStepperModule,
    MatButtonModule
  ], schemas: [
    CUSTOM_ELEMENTS_SCHEMA
],
})
export class DealerModule { }
