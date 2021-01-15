import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PersonComponent } from './SharedComponents/person/person.component';
import { CityComponent } from './SharedComponents/city/city.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JobTitleComponent } from './SharedComponents/job-title/job-title.component';
import { ClientComponent } from './Modules/client/Components/Client/client.component';
import { ContactComponent } from './SharedComponents/contact/contact.component';
import { ImgLoadingComponent } from './SharedComponents/img-loading/img-loading.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { TblClientComponent } from './Modules/client/Components/tbl-client/tbl-client.component';
import { BranchComponent } from './SharedComponents/branch/branch.component';

import { TblDealerComponent } from './Modules/dealer/Componets/tbl-dealer/tbl-dealer.component';
import { DealerComponent } from './Modules/dealer/Componets/dealer/dealer.component';
import { VehicleModelComponent } from './SharedComponents/vehicle-model/vehicle-model.component';
import { VehicleComponent } from './Modules/client/Components/vehicle/vehicle.component';
import { VehicleStateComponent } from './Modules/client/Components/vehicle-state/vehicle-state.component';
import { VehiclesByCLientComponent } from './Modules/client/Components/vehicles-by-client/vehicles-by-client.component';
import { MaintenanceItemComponent } from './Modules/items-and-routines/Components/maintenance-item/maintenance-item.component';
import { TypeOfMaintenanceItemComponent } from './Modules/items-and-routines/Components/type-of-maintenance-item/type-of-maintenance-item.component';
import { PresentationUnitComponent } from './Modules/items-and-routines/Components/presentation-unit/presentation-unit.component';
import { TblMaintenanceItemComponent } from './Modules/items-and-routines/Components/tbl-maintenance-item/tbl-maintenance-item.component';
import { ItemsAndRoutinesComponent } from './Modules/items-and-routines/Components/items-and-routines/items-and-routines.component';
import { MaintenanceRoutineComponent } from './Modules/items-and-routines/Components/maintenance-routine/maintenance-routine.component';
import { FrequencyComponent } from './Modules/items-and-routines/Components/frequency/frequency.component';
import { TblMaintenanceRoutinesComponent } from './Modules/items-and-routines/Components/tbl-maintenance-routines/tbl-maintenance-routines.component';
import { VehicleTypeComponent } from './SharedComponents/vehicle-type/vehicle-type.component';
import { VehicleBrandComponent } from './SharedComponents/vehicle-brand/vehicle-brand.component';
import { MaintenanceItemCategoryComponent } from './Modules/items-and-routines/Components/maintenance-item-category/maintenance-item-category.component';
import { CheckListVehicleTypeComponent } from './SharedComponents/check-list-vehicle-type/check-list-vehicle-type.component';
import { CheckListVehicleModelComponent } from './SharedComponents/check-list-vehicle-model/check-list-vehicle-model.component';
import { TblMaintenanceMatrixComponent } from './Modules/items-and-routines/Components/tbl-maintenance-matrix/tbl-maintenance-matrix.component';
import { ContractComponent } from './Modules/contract/Components/Contract/contract.component';
import { ContractStateComponent } from './Modules/contract/Components/contract-state/contract-state.component';
import { ContractDiscountTypeComponent } from './Modules/contract/Components/contract-discount-type/contract-discount-type.component';
import { InputSearchClientComponent } from './SharedComponents/input-search-client/input-search-client.component';
import { InputSearchDealerComponent } from './SharedComponents/input-search-dealer/input-search-dealer.component';
import { TblCheckVehiclesComponent } from './Modules/contract/Components/tbl-check-vehicles/tbl-check-vehicles.component';
import { DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TblContractComponent } from './Modules/contract/Components/tbl-contract/tbl-contract.component';
import { TblPricesByDealerComponent } from './Modules/dealer/Componets/tbl-prices-by-dealer/tbl-prices-by-dealer.component';
import { TblPricesByContractComponent } from './Modules/contract/Components/tbl-prices-by-contract/tbl-prices-by-contract.component';
import { MovementTypeComponent } from './Modules/movement/Components/movement-type/movement-type.component';
import { MovementComponent } from './Modules/movement/Components/movement/movement.component';
import { TblMovementsComponent } from './Modules/movement/Components/tbl-movements/tbl-movements.component';
import { QuotaManagementComponent } from './Modules/quota-management/Components/quota-management/quota-management.component';
import { WorkOrderComponent } from './Modules/work-order-manager/Components/work-order/work-order.component';
import { WorkOrderManagerComponent } from './Modules/work-order-manager/Components/work-order-manager/work-order-manager.component';
import { InputSearchVehicleComponent } from './SharedComponents/input-search-vehicle/input-search-vehicle.component';
import { BranchByDealerComponent } from './Modules/work-order-manager/Components/branch-by-dealer/branch-by-dealer.component';
import { RoutinesByVehicleModelComponent } from './Modules/work-order-manager/Components/routines-by-vehicle-model/routines-by-vehicle-model.component';
import { DashboardClientComponent } from './Modules/dashboard-client/Components/dashboard-client/dashboard-client.component';
import { LoginComponent } from './Modules/Login/Components/login/login.component';
import { FinancialInformationByClientComponent } from './Modules/client/Components/financial-information-by-client/financial-information-by-client.component';
import { LayoutComponent } from './layout/layout.component';

import { NavigationComponent } from './Modules/navigation/Components/navigation/navigation.component';
import { HomeComponent } from './Modules/home/home.component';



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
    LoginComponent,
    TblPricesByContractComponent,
    MovementTypeComponent,
    MovementComponent,
    TblMovementsComponent,
    QuotaManagementComponent,
    WorkOrderComponent,
    WorkOrderManagerComponent,
    InputSearchVehicleComponent,
    BranchByDealerComponent,
    RoutinesByVehicleModelComponent,
    DashboardClientComponent,
    LoginComponent,
    FinancialInformationByClientComponent,
    LayoutComponent,
    HomeComponent
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
