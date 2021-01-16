import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { TblClientComponent } from './Components/tbl-client/tbl-client.component';
import { ClientComponent } from './Components/Client/client.component';
import { FinancialInformationByClientComponent } from './Components/financial-information-by-client/financial-information-by-client.component';
import { VehicleComponent } from './Components/vehicle/vehicle.component';
import { VehiclesByCLientComponent } from './Components/vehicles-by-client/vehicles-by-client.component';
import { VehicleStateComponent } from './Components/vehicle-state/vehicle-state.component';


import { ClientRoutingModule } from './client-routing.module';
import { SharedModule } from 'src/app/SharedComponents/shared.module';

@NgModule({
    declarations: [
        ClientComponent,
        TblClientComponent,      
        FinancialInformationByClientComponent,
        VehicleComponent,
        VehiclesByCLientComponent,
        VehicleStateComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        ClientRoutingModule,
    ], schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
})


export class ClientModule {

}