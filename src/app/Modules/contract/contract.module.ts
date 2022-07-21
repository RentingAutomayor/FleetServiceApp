import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { MatTabsModule } from '@angular/material/tabs'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { SharedModule } from 'src/app/SharedComponents/shared.module'
import { ContractDiscountTypeComponent } from './Components/contract-discount-type/contract-discount-type.component'
import { ContractComponent } from './Components/Contract/contract.component'
import { TblCheckVehiclesComponent } from './Components/tbl-check-vehicles/tbl-check-vehicles.component'
import { TblContractComponent } from './Components/tbl-contract/tbl-contract.component'
import { TblPricesByContractComponent } from './Components/tbl-prices-by-contract/tbl-prices-by-contract.component'
import { ContractRoutingModule } from './contract-routing.module'

@NgModule({
  declarations: [
    ContractComponent,
    ContractDiscountTypeComponent,
    TblCheckVehiclesComponent,
    TblContractComponent,
    TblPricesByContractComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ContractRoutingModule,
    BsDatepickerModule.forRoot(),
    MatTabsModule,
  ],
})
export class ContractModule {}
