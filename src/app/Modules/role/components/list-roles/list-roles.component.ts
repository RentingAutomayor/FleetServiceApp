import { Component, OnInit } from '@angular/core'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { AlertService } from 'src/app/services/alert.service'
import { Excel } from 'src/app/Utils/excel'
import { Role } from '../../models/role'
import { RoleService } from '../../services/role.service'
import { ViewDetailComponent } from '../view-detail/view-detail.component'

@Component({
  selector: 'app-list-roles',
  templateUrl: './list-roles.component.html',
  styleUrls: ['./list-roles.component.scss'],
})
export class ListRolesComponent implements OnInit {
  email: string = ''
  roles: Role[] = []
  originalRoles: Role[] = []
  p = 1
  isLoading: boolean = false

  constructor(
    private _role: RoleService,
    private _alert: AlertService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getRoles()
  }

  getRoles(): void {
    this.isLoading = true
    this._role.getAll().subscribe(
      (result) => {
        this.roles = result
        this.originalRoles = result
        this.isLoading = false
      },
      (badRequest) => this._alert.error(badRequest.error.Message)
    )
  }

  filter(): void {
    if (this.email.length !== 0)
      this.roles = this.roles.filter((user) => {
        if (user.name) return user.name.includes(this.email)
      })
    else this.roles = this.originalRoles
  }

  delete(roleId: number): void {
    this._alert.confirmDelete().then((result) => {
      if (result.isConfirmed) {
        this._role.deleteById(roleId).subscribe(
          () => {
            this._alert.succes('Rol eliminado con exito')
            this.roles = this.roles.filter((role) => role.id !== roleId)
          },
          (badRequest) => this._alert.error(badRequest.error.Message)
        )
      }
    })
  }

  viewDetail(role: Role): void {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = role
    dialogConfig.width = '800px'
    this.dialog.open(ViewDetailComponent, dialogConfig)
  }

  clearFilter(): void {
    this.email = ''
    this.roles = this.originalRoles
  }

  downloadExcel(): void {
    const roles = this.roles.map((role) => {
      return {
        Nombre: role.name,
        Descripcion: role.description,
      }
    })
    Excel.convertArrayToFile(roles, 'Roles')
  }
}
