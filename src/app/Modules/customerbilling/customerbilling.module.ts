import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerbillingComponent } from './customerbilling/customerbilling.component';
import { CustomerBillingRoutingModule } from './customerbilling-routing.module';

@NgModule({
  declarations: [
    CustomerbillingComponent,
  ],
  imports: [
    CommonModule,
    CustomerBillingRoutingModule
  ]
})
export class CustomerbillingModule { }
