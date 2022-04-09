import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { NgxPaginationModule } from 'ngx-pagination'

import { BranchComponent } from './branch/branch.component'
import { CheckListVehicleModelComponent } from './check-list-vehicle-model/check-list-vehicle-model.component'
import { CheckListVehicleTypeComponent } from './check-list-vehicle-type/check-list-vehicle-type.component'
import { CityComponent } from './city/city.component'
import { ContactComponent } from './contact/contact.component'
import { ImgLoadingComponent } from './img-loading/img-loading.component'
import { InputSearchClientComponent } from './input-search-client/input-search-client.component'
import { InputSearchDealerComponent } from './input-search-dealer/input-search-dealer.component'
import { InputSearchVehicleComponent } from './input-search-vehicle/input-search-vehicle.component'
import { JobTitleComponent } from './job-title/job-title.component'
import { PersonComponent } from './person/person.component'
import { VehicleBrandComponent } from './vehicle-brand/vehicle-brand.component'
import { VehicleModelComponent } from './vehicle-model/vehicle-model.component'
import { VehicleTypeComponent } from './vehicle-type/vehicle-type.component'
import { TransactionReviewComponent } from './transaction-review/transaction-review.component'
import { MatButtonModule } from '@angular/material/button'
import { AlertErrorComponent } from './alert-error/alert-error.component'
import { CalculateTaxesPipe } from './Pipes/calculate-taxes.pipe'
import { CalculateTotalPricePipe } from './Pipes/calculate-total-price.pipe'
import { TblPricesMaintenanceItemsComponent } from './tbl-prices-maintenance-items/tbl-prices-maintenance-items.component'
import { CalculatePriceByAmountPipe } from './Pipes/calculate-price-by-amount.pipe'
import { TblCheckItemsForRoutineComponent } from './tbl-check-items-for-routine/tbl-check-items-for-routine.component'
import { CalculateDiscountPipe } from './Pipes/calculate-discount.pipe'
import { CalculatePriceWithoutDiscountPipe } from './Pipes/calculate-price-without-discount.pipe'
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ContactTypeComponent } from './contact-type/contact-type.component'

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
    VehicleTypeComponent,
    TransactionReviewComponent,
    AlertErrorComponent,
    CalculateTaxesPipe,
    CalculateTotalPricePipe,
    TblPricesMaintenanceItemsComponent,
    CalculatePriceByAmountPipe,
    TblCheckItemsForRoutineComponent,
    CalculateDiscountPipe,
    CalculatePriceWithoutDiscountPipe,
    ContactTypeComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MatButtonModule,
    MatSlideToggleModule,
  ],
  exports: [
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
    NgxPaginationModule,
    TransactionReviewComponent,
    AlertErrorComponent,
    CalculateTaxesPipe,
    CalculateTotalPricePipe,
    TblPricesMaintenanceItemsComponent,
    CalculatePriceByAmountPipe,
    TblCheckItemsForRoutineComponent,
    CalculateDiscountPipe,
    CalculatePriceWithoutDiscountPipe,
  ],
  providers: [CalculateTotalPricePipe],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
