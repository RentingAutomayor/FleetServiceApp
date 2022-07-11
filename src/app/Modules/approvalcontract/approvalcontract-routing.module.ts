import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { LayoutComponent } from '../../layout/layout.component'
import { ApprovalcontractComponent } from './approvalcontract/approvalcontract.component'

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: '', component: ApprovalcontractComponent}],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApprovalContractRoutingModule {}
