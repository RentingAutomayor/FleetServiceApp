import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ContractComponent } from './Components/Contract/contract.component';
import { ContractDiscountTypeComponent } from './Components/contract-discount-type/contract-discount-type.component';
import { ContractStateComponent } from './Components/contract-state/contract-state.component';
import { TblCheckVehiclesComponent } from './Components/tbl-check-vehicles/tbl-check-vehicles.component';
import { TblContractComponent } from './Components/tbl-contract/tbl-contract.component';
import { TblPricesByContractComponent } from './Components/tbl-prices-by-contract/tbl-prices-by-contract.component';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { SharedModule } from 'src/app/SharedComponents/shared.module';
import { ContractRoutingModule } from './contract-routing.module';

@NgModule({
  declarations: [
    ContractComponent,
    ContractDiscountTypeComponent,
    ContractStateComponent,
    TblCheckVehiclesComponent,
    TblContractComponent,
    TblPricesByContractComponent    
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule, 
    ReactiveFormsModule,
    ContractRoutingModule,
    BsDatepickerModule.forRoot(),
    
  ]
})
export class ContractModule { }
