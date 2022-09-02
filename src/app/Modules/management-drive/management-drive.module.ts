import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ListComponent } from './components/list/list.component'
import { ManagementDriveRouting } from './management-drive.routing.module'
import { SafePipe } from './pipes/safe.pipe'

@NgModule({
  declarations: [ListComponent, SafePipe],
  imports: [CommonModule, ManagementDriveRouting],
})
export class ManagementDriveModule {}
