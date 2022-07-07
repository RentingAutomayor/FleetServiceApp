import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SettingsRoutingModule } from './settings-routing.module'
import { MatStepperModule } from '@angular/material/stepper'
import { SharedModule } from 'src/app/SharedComponents/shared.module'
import { ListSettingsComponent } from './components/list-settings/list-settings.component'
import { MatTabsModule } from '@angular/material/tabs'
import { TableComponent } from './components/table/table.component'
import { UniqueSettingComponent } from './components/unique-setting/unique-setting.component'
import { SettingsService } from './services/settings.service'
import { VehiculeModelComponent } from './components/vehicule-model/vehicule-model.component'
import { ReactiveFormsModule } from '@angular/forms';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ReportsComponent } from './components/reports/reports.component'

@NgModule({
  declarations: [
    ListSettingsComponent,
    TableComponent,
    UniqueSettingComponent,
    VehiculeModelComponent,
    NotificationsComponent,
    ReportsComponent,
  ],
  imports: [
    CommonModule,
    MatStepperModule,
    SharedModule,
    ReactiveFormsModule,
    SettingsRoutingModule,
    MatTabsModule,
  ],
  providers: [SettingsService],
})
export class SettingsModule {}
