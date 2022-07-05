import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayproviderComponent } from './payprovider/payprovider.component';
import { PayproviderRoutingModule } from './payprovier-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from 'src/app/SharedComponents/shared.module';
import { TblPayproviderComponent } from './tbl-payprovider/tbl-payprovider.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { TableFilterPipe } from 'src/app/pipes/table-filter.pipe';
import { TableBillFilterPipe } from 'src/app/pipes/table-bill-filter.pipe';
import { TblBillComponent } from './tbl-bill/tbl-bill.component';
import { TblPayregisterComponent } from './tbl-payregister/tbl-payregister.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';

//MODAL
import { ModalBillComponent } from 'src/app/Modules/payprovider/modal-bill/modal-bill.component';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    PayproviderComponent,
    TblPayproviderComponent,
    TableFilterPipe,
    TableBillFilterPipe,
    TblBillComponent,
    TblPayregisterComponent,
    ModalBillComponent,
  ],
  imports: [
    CommonModule,
    PayproviderRoutingModule,
    MatDialogModule,
    MatTabsModule,
    MatFormFieldModule,
    SharedModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    BsDatepickerModule.forRoot(),
  ],
  entryComponents: [ModalBillComponent]

})
export class PayproviderModule { }
