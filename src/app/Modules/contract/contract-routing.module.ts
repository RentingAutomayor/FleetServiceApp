import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { LayoutComponent } from '../../layout/layout.component'
import { ContractComponent } from './Components/Contract/contract.component'
import { TblContractComponent } from './Components/tbl-contract/tbl-contract.component'

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: TblContractComponent },
      { path: 'Contract', component: ContractComponent },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContractRoutingModule {}
