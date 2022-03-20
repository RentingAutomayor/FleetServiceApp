import { Component, OnInit } from '@angular/core'
import { UserService } from '../../Services/Users/users.service'
import { Router } from '@angular/router'
import { NavigationService } from '../../../navigation/Services/Navigation/navigation.service'
import { SecurityValidators } from 'src/app/Models/SecurityValidators'
import { ActionType } from 'src/app/Models/ActionType'
import { saveInStorage } from 'src/app/Utils/storage'
import { FormControl } from '@angular/forms'
import { User } from 'src/app/Models/User'

@Component({
  selector: 'app-tbl-users',
  templateUrl: './tbl-users.component.html',
  styleUrls: ['./tbl-users.component.scss'],
})
export class TblUsersComponent implements OnInit {
  lsUser: User[] = []
  lsUserFiltered: User[] = []
  isAwaiting: boolean
  enableButtonsEditAndDelete: boolean
  // pagination
  p = 1
  action: ActionType
  txtFilter: FormControl

  constructor(
    private userService: UserService,
    private router: Router,
    private navigationService: NavigationService
  ) {
    this.isAwaiting = false
    this.txtFilter = new FormControl()
    this.txtFilter.valueChanges.subscribe((description) => {
      this.lsUserFiltered = this.lsUser.filter((user) => {
        if (description != null) {
          return (
            user.user.includes(description) ||
            user.name.toUpperCase().includes(description.toUpperCase())
          )
        }
      })
    })
  }

  ngOnInit(): void {
    this.enableButtonsEditAndDelete = true
    this.initComponents()
  }

  async initComponents() {
    this.navigationService.setItemActive('client')
    this.isAwaiting = true
    this.userService.setUserToUpdate(null)
    try {
      this.userService.getUsers().subscribe((users) => {
        console.log(users)
        this.lsUser = users
        this.lsUserFiltered = this.lsUser
        this.isAwaiting = false
      })
    } catch (err) {
      console.error(err.error.Message)
      alert(err.error.Message)
    }
  }

  getDetailsUser(pId: number) {
    try {
      this.action = ActionType.READ
      this.userService.setAction(this.action)
      saveInStorage('actionToPerform', this.action)
      this.router.navigate(['/MasterUsers/User', pId])
    } catch (err) {
      console.error(err.error.Message)
      alert(err.error.Message)
    }
  }

  updateUser(pId: number) {
    try {
      this.action = ActionType.UPDATE
      this.userService.setAction(this.action)
      saveInStorage('actionToPerform', this.action)
      this.router.navigate(['/MasterUsers/User', pId])
    } catch (err) {
      console.error(err.error.Message)
      alert(err.error.Message)
    }
  }

  deleteUser(pUser: User) {
    try {
      if (confirm('¿Está seguro que desea eliminar este usuario?')) {
        this.isAwaiting = true
        this.userService.deleteUser(pUser).then((response) => {
          const rta = response
          this.isAwaiting = false
          if (rta.response) {
            alert(rta.message)
            this.initComponents()
          }
        })
      }
    } catch (err) {
      console.error(err.error.Message)
      alert(err.error.Message)
    }
  }

  insertUser() {
    this.action = ActionType.CREATE
    this.userService.setAction(this.action)
    saveInStorage('actionToPerform', this.action)
    this.router.navigate(['/MasterUsers/User'])
  }

  moveContent(event: any) {
    const containerContent: HTMLDivElement = document.querySelector(
      '#container__content'
    )
    if (event) {
      containerContent.style.marginLeft = '250px'
    } else {
      containerContent.style.marginLeft = '0px'
    }
  }

  removeFilter() {
    this.txtFilter.setValue(null)
    this.lsUserFiltered = this.lsUser
  }
}
