import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { LayoutComponent } from 'src/app/layout/layout.component'
import { ListSettingsComponent } from './components/list-settings/list-settings.component'

const ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: '', component: ListSettingsComponent }],
  },
]

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
