import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { LayoutComponent } from '../../layout/layout.component'
import { UsersComponent } from './Components/Users/users.component'
import { TblUsersComponent } from './Components/tbl_users/tbl-users.component'

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: TblUsersComponent },
      { path: 'User', component: UsersComponent },
      { path: 'User/:id', component: UsersComponent },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
