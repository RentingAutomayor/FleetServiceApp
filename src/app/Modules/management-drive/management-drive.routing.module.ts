import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { LayoutComponent } from 'src/app/layout/layout.component'
import { ListComponent } from './components/list/list.component'

const ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: '', component: ListComponent }],
  },
]

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class ManagementDriveRouting {}
