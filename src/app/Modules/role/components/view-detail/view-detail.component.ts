import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { AlertService } from 'src/app/services/alert.service'
import { Module } from '../../models/module'
import { Role } from '../../models/role'
import { RoleService } from '../../services/role.service'

@Component({
  selector: 'app-view-detail',
  templateUrl: './view-detail.component.html',
  styleUrls: ['./view-detail.component.scss'],
})
export class ViewDetailComponent implements OnInit {
  modules: Module[] = []
  constructor(
    @Inject(MAT_DIALOG_DATA) public role: Role,
    private dialogRef: MatDialogRef<ViewDetailComponent>,
    private _role: RoleService,
    private _alert: AlertService
  ) {}

  ngOnInit(): void {
    this.getModules()
  }

  getModules(): void {
    this._role.getModulesByRoleId(this.role.id).subscribe(
      (result) => {
        this.modules = result
      },
      (badRequest) => this._alert.error(badRequest.error.Message)
    )
  }

  closeDialog(): void {
    this.dialogRef.close()
  }
}
