import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { UserRoutingModule } from './user-routing.module'
import { UserService } from './services/user.service'
import { SharedModule } from 'src/app/SharedComponents/shared.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ListUser } from './components/list-user/list-user.component'
import { FormUser } from './components/form-user/form-user.component'
import { MatStepperModule } from '@angular/material/stepper'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule } from '@angular/material/dialog'

@NgModule({
  declarations: [ListUser, FormUser],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    UserRoutingModule,
    MatStepperModule,
    MatButtonModule,
    MatDialogModule,
  ],
  providers: [UserService],
})
export class UserModule {}
