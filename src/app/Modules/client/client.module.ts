import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


import { TblClientComponent } from './Components/tbl-client/tbl-client.component';
import { ClientComponent } from './Components/Client/client.component';
import { FinancialInformationByClientComponent } from './Components/financial-information-by-client/financial-information-by-client.component';
import { VehicleComponent } from './Components/vehicle/vehicle.component';
import { VehiclesByCLientComponent } from './Components/vehicles-by-client/vehicles-by-client.component';
import { VehicleStateComponent } from './Components/vehicle-state/vehicle-state.component';
import { TblContractsByClientComponent } from './Components/tbl-contracts-by-client/tbl-contracts-by-client.component';

import { ClientRoutingModule } from './client-routing.module';
import { SharedModule } from 'src/app/SharedComponents/shared.module';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { ContractualInformationComponent } from './Components/contractual-information/contractual-information.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
    declarations: [
        ClientComponent,
        TblClientComponent,
        FinancialInformationByClientComponent,
        VehicleComponent,
        VehiclesByCLientComponent,
        VehicleStateComponent,
        TblContractsByClientComponent,
        ContractualInformationComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        ClientRoutingModule,
        MatStepperModule,
        MatButtonModule,
        BsDatepickerModule
    ], schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
})


export class ClientModule {

}
