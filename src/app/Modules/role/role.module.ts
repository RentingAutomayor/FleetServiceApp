import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule } from '@angular/material/dialog'
import { MatStepperModule } from '@angular/material/stepper'
import { SharedModule } from 'src/app/SharedComponents/shared.module'
import { FormRoleComponent } from './components/form-role/form-role.component'
import { ListRolesComponent } from './components/list-roles/list-roles.component'
import { ViewDetailComponent } from './components/view-detail/view-detail.component'
import { RoleRoutingModule } from './role-routing.module'

@NgModule({
  declarations: [ListRolesComponent, FormRoleComponent, ViewDetailComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    RoleRoutingModule,
    MatStepperModule,
    MatButtonModule,
    MatDialogModule
  ]
})
export class RoleModule {}
