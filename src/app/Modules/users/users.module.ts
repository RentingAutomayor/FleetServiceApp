import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'

import { TblUsersComponent } from './Components/tbl_users/tbl-users.component'
import { UsersComponent } from './Components/Users/users.component'

import { UserRoutingModule } from './users-routing.module'
import { SharedModule } from 'src/app/SharedComponents/shared.module'
import { MatStepperModule } from '@angular/material/stepper'
import { MatButtonModule } from '@angular/material/button'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'

@NgModule({
  declarations: [
    UsersComponent,
    TblUsersComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    UserRoutingModule,
    MatStepperModule,
    MatButtonModule,
    BsDatepickerModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UsersModule {}
