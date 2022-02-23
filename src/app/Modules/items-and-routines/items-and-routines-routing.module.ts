import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { LayoutComponent } from '../../layout/layout.component'
import { ItemsAndRoutinesComponent } from './Components/items-and-routines/items-and-routines.component'

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: '', component: ItemsAndRoutinesComponent }],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemsAndRoutinesRoutingModule {}
