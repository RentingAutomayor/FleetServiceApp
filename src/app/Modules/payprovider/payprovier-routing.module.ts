import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { LayoutComponent } from '../../layout/layout.component'
import { PayproviderComponent } from './payprovider/payprovider.component'

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: '', component: PayproviderComponent}],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayproviderRoutingModule {}
