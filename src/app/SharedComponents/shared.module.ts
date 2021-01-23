import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import { BranchComponent } from './branch/branch.component';
import { CheckListVehicleModelComponent } from './check-list-vehicle-model/check-list-vehicle-model.component'; 
import { CheckListVehicleTypeComponent } from './check-list-vehicle-type/check-list-vehicle-type.component';
import { CityComponent } from './city/city.component'
import { ContactComponent } from './contact/contact.component';
import { ImgLoadingComponent } from './img-loading/img-loading.component';
import { InputSearchClientComponent } from './input-search-client/input-search-client.component';
import { InputSearchDealerComponent } from './input-search-dealer/input-search-dealer.component';
import { InputSearchVehicleComponent } from './input-search-vehicle/input-search-vehicle.component';
import { JobTitleComponent } from './job-title/job-title.component';
import { PersonComponent } from './person/person.component';
import { VehicleBrandComponent } from './vehicle-brand/vehicle-brand.component';
import { VehicleModelComponent } from './vehicle-model/vehicle-model.component';
import { VehicleTypeComponent } from './vehicle-type/vehicle-type.component';


@NgModule({
  declarations: [
    BranchComponent,
    CheckListVehicleModelComponent,
    CheckListVehicleTypeComponent,
    CityComponent,
    ContactComponent,
    ImgLoadingComponent,
    InputSearchClientComponent,
    InputSearchDealerComponent,
    InputSearchVehicleComponent,
    JobTitleComponent,
    PersonComponent,
    VehicleBrandComponent,
    VehicleModelComponent,
    VehicleTypeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  exports:[
    BranchComponent,
    CheckListVehicleModelComponent,
    CheckListVehicleTypeComponent,
    CityComponent,
    ContactComponent,
    ImgLoadingComponent,
    InputSearchClientComponent,
    InputSearchDealerComponent,
    InputSearchVehicleComponent,
    JobTitleComponent,
    PersonComponent,
    VehicleBrandComponent,
    VehicleModelComponent,
    VehicleTypeComponent,
    NgxPaginationModule
  ],
  
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class SharedModule { }
