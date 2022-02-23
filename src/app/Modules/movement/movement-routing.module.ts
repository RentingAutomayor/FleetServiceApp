import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { LayoutComponent } from '../../layout/layout.component'
import { MovementComponent } from './Components/movement/movement.component'
import { TblMovementsComponent } from './Components/tbl-movements/tbl-movements.component'

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: TblMovementsComponent },
      { path: 'Movement', component: MovementComponent },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MovementRoutingModule {}
