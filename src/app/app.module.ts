import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PersonComponent } from '../app/Components/person/person.component';
import { CityComponent } from '../app/Components/city/city.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JobTitleComponent } from './Components/job-title/job-title.component';
import { ClientComponent } from './Modules/client/client.component';
import { ContactComponent } from './Modules/contact/contact.component';
import { ImgLoadingComponent } from './Components/img-loading/img-loading.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { TblClientComponent } from './Modules/tbl-client/tbl-client.component';
import { BranchComponent } from './Modules/branch/branch.component';
import { NavigationComponent } from './Modules/navigation/navigation.component';
import { TblDealerComponent } from './Modules/tbl-dealer/tbl-dealer.component';
import { DealerComponent } from './Modules/dealer/dealer.component';
import { VehicleModelComponent } from './Components/vehicle-model/vehicle-model.component';
import { VehicleComponent } from './Components/vehicle/vehicle.component';
import { VehicleStateComponent } from './Components/vehicle-state/vehicle-state.component';
import { VehiclesByCLientComponent } from './Modules/vehicles-by-client/vehicles-by-client.component';
import { MaintenanceItemComponent } from './Components/maintenance-item/maintenance-item.component';
import { TypeOfMaintenanceItemComponent } from './Components/type-of-maintenance-item/type-of-maintenance-item.component';
import { PresentationUnitComponent } from './Components/presentation-unit/presentation-unit.component';
import { TblMaintenanceItemComponent } from './Modules/tbl-maintenance-item/tbl-maintenance-item.component';
import { ItemsAndRoutinesComponent } from './Modules/items-and-routines/items-and-routines.component';
import { MaintenanceRoutineComponent } from './Components/maintenance-routine/maintenance-routine.component';
import { FrequencyComponent } from './Components/frequency/frequency.component';
import { TblMaintenanceRoutinesComponent } from './Modules/tbl-maintenance-routines/tbl-maintenance-routines.component';
import { VehicleTypeComponent } from './Components/vehicle-type/vehicle-type.component';
import { VehicleBrandComponent } from './Components/vehicle-brand/vehicle-brand.component';
import { MaintenanceItemCategoryComponent } from './Components/maintenance-item-category/maintenance-item-category.component';
import { CheckListVehicleTypeComponent } from './Components/check-list-vehicle-type/check-list-vehicle-type.component';
import { CheckListVehicleModelComponent } from './Components/check-list-vehicle-model/check-list-vehicle-model.component';
import { TblMaintenanceMatrixComponent } from './Components/tbl-maintenance-matrix/tbl-maintenance-matrix.component';
import { ContractComponent } from './Modules/contract/contract.component';
import { ContractStateComponent } from './Components/contract-state/contract-state.component';
import { ContractDiscountTypeComponent } from './Components/contract-discount-type/contract-discount-type.component';
import { InputSearchClientComponent } from './Components/input-search-client/input-search-client.component';
import { InputSearchDealerComponent } from './Components/input-search-dealer/input-search-dealer.component';
import { TblCheckVehiclesComponent } from './Components/tbl-check-vehicles/tbl-check-vehicles.component';
import { DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TblContractComponent } from './Modules/tbl-contract/tbl-contract.component';
import { TblPricesByDealerComponent } from './Components/tbl-prices-by-dealer/tbl-prices-by-dealer.component';
import { LoginComponent } from './Components/login/login.component';



@NgModule({
  declarations: [
    AppComponent,
    PersonComponent,
    CityComponent,
    JobTitleComponent,
    ClientComponent,
    ContactComponent,
    ImgLoadingComponent,
    TblClientComponent,
    BranchComponent,
    NavigationComponent,
    TblDealerComponent,
    DealerComponent,
    VehicleModelComponent,
    VehicleComponent,
    VehicleStateComponent,
    VehiclesByCLientComponent,
    MaintenanceItemComponent,
    TypeOfMaintenanceItemComponent,
    PresentationUnitComponent,
    TblMaintenanceItemComponent,
    ItemsAndRoutinesComponent,
    MaintenanceRoutineComponent,
    FrequencyComponent,
    TblMaintenanceRoutinesComponent,
    VehicleTypeComponent,
    VehicleBrandComponent,
    MaintenanceItemCategoryComponent,
    CheckListVehicleTypeComponent,
    CheckListVehicleModelComponent,
    TblMaintenanceMatrixComponent,
    ContractComponent,
    ContractStateComponent,
    ContractDiscountTypeComponent,
    InputSearchClientComponent,
    InputSearchDealerComponent,
    TblCheckVehiclesComponent,
    TblContractComponent,
    TblPricesByDealerComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
  ],
  providers: [
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
