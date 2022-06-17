import { Component, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { User } from '../../models/user'

@Component({
  selector: 'app-user-view',
  templateUrl: './view-detail.component.html',
})
export class ViewDetailComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public user: User,
    private dialogRef: MatDialogRef<ViewDetailComponent>
  ) {}

  closeDialog(): void {
    this.dialogRef.close()
  }
}
