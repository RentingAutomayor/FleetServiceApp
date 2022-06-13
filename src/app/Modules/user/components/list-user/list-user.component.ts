import { Component, OnInit } from '@angular/core'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { AlertService } from 'src/app/services/alert.service'
import { User } from '../../models/user'
import { UserService } from '../../services/user.service'
import { ViewDetailComponent } from '../view-detail/view-detail.component'

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss'],
})
export class ListUser implements OnInit {
  users: User[] = []
  originalUsers: User[] = []
  email: string = ''
  p = 1
  isLoading: boolean = false
  constructor(
    private _user: UserService, 
    private _alert: AlertService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getUsers()
  }

  getUsers(): void {
    this.isLoading = true
    this._user.getAll().subscribe(
      (result) => {
        this.users = result
        this.originalUsers = result
        this.isLoading = false
      },
      () => {
        this._alert.error('Se ha presentado un error')
        this.isLoading = false
      }
    )
  }

  filter(): void {
    if (this.email.length !== 0)
      this.users = this.users.filter((user) => {
        if (user.email) return user.email.includes(this.email)
      })
    else this.users = this.originalUsers
  }

  delete(userId: number): void {
    this._alert.confirmDelete().then((result) => {
      if (result.isConfirmed) {
        this._user.deleteById(userId).subscribe(
          () => {
            this.users = this.users.filter((user) => user.id !== userId)
            this._alert.succes('Usuario ha sido eliminado con exito')
          },
          (badRequest) => {
            this._alert.error(badRequest.error.Message)
          }
        )
      }
    })
  }

  viewDetail(user: User): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = user;
    this.dialog.open(ViewDetailComponent, dialogConfig);
  }

  clearFilter(): void {
    this.email = ''
    this.users = this.originalUsers
  }
}
