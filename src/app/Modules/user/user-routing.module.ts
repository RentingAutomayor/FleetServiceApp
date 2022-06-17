import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { LayoutComponent } from 'src/app/layout/layout.component'
import { FormUser } from './components/form-user/form-user.component'
import { ListUser } from './components/list-user/list-user.component'

const ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: ListUser },
      { path: 'form', component: FormUser },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
