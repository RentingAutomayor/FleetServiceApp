import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { LayoutComponent } from 'src/app/layout/layout.component'
import { FormRoleComponent } from './components/form-role/form-role.component'
import { ListRolesComponent } from './components/list-roles/list-roles.component'

const ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: ListRolesComponent },
      { path: 'form', component: FormRoleComponent },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class RoleRoutingModule {}
