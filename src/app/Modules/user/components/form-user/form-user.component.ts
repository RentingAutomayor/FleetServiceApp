import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { Role } from 'src/app/Modules/role/models/role'
import { ParameterService } from 'src/app/Modules/role/services/parameter.service'
import { RoleService } from 'src/app/Modules/role/services/role.service'
import { AlertService } from 'src/app/services/alert.service'
import { Basic } from '../../models/basic'
import { Company } from '../../models/company'
import { User } from '../../models/user'
import { UserService } from '../../services/user.service'

@Component({
  selector: 'app-user-form',
  templateUrl: './form-user.component.html',
  styleUrls: ['./form-user.component.scss'],
})
export class FormUser implements OnInit {
  isVisibility: boolean = false
  userForm!: FormGroup

  roles: Role[] = []
  companies: Company[] = []
  users: Basic[] = []
  isLoading = false

  constructor(
    private _user: UserService,
    private _role: RoleService,
    private _parameter: ParameterService,
    private _alert: AlertService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initForm()
  }

  ngOnInit(): void {
    this.getRoles()
    this.getUserIdFromUrl()
    this.getCompanies()
  }

  initForm(): void {
    this.userForm = this.fb.group({
      id: 0,
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      companyId: [{ value: '', disabled: true }],
      roleId: ['', Validators.required],
      status: ['', Validators.required],
      typeUser: [{ value: '', disabled: true }],
    })
  }

  getUserById(userId: number): void {
    this.isLoading = true
    this._user.getById(userId).subscribe(
      (result) => {
        this.isLoading = false
        const { company, dealerId, clientId, ...user } = result
        const role = this.roles.find((r) => r.id === +user.roleId)
        const formUser = {
          ...user,
          companyId: role.name === UserRoles.RENTING ? company.id : '',
          typeUser:
            role.name === UserRoles.DEALER
              ? dealerId
              : role.name === UserRoles.CLIENT
              ? clientId
              : '',
        }
        this.userForm.setValue(formUser)
        this.userForm.get('password').disable()
        if (user.email) this.userForm.get('email').disable()
      },
      (badRequest) => this._alert.error(badRequest.error.Message)
    )
  }

  getCompanies(): void {
    this._parameter.getCompanies().subscribe(
      (result) => {
        this.companies = result
      },
      (badRequest) => this._alert.error(badRequest.error.Message)
    )
  }

  getClientOrDealer(typeUser: string): void {
    this._parameter[
      typeUser === 'client' ? 'getClient' : 'getDealer'
    ]().subscribe(
      (result) => {
        this.users = result
      },
      (badRequest) => this._alert.error(badRequest.error.Message)
    )
  }

  getRoles(): void {
    this._role.getAll().subscribe(
      (result) => {
        this.roles = result
      },
      (badRequest) => this._alert.error(badRequest.error.Message)
    )
  }

  validRole(): void {
    const companyKey = 'companyId'
    const typeKey = 'typeUser'
    const roleId = +this.userForm.get('roleId').value
    const role = this.roles.find((r) => r.id === roleId)
    if (role.name !== UserRoles.RENTING) {
      this.userForm.get(companyKey).disable()
      this.userForm.get(companyKey).setValue('')
    } else {
      this.enableField(companyKey)
      this.userForm.get(companyKey).setValidators(Validators.required)
    }
    if (role.name === UserRoles.CLIENT || role.name === UserRoles.DEALER)
      this.enableField(typeKey)
    else {
      this.disableField(typeKey)
      this.userForm.get(typeKey).setValue('')
    }
    if (role.name === UserRoles.CLIENT) this.getClientOrDealer('client')
    if (role.name === UserRoles.DEALER) this.getClientOrDealer('dealer')
  }

  enableField(key: string): void {
    this.userForm.get(key).enable()
  }

  disableField(key: string): void {
    this.userForm.get(key).disable()
  }

  submit(): void {
    this.isLoading = true
    const isEdit = this.userForm.get('id').value === 0
    const { companyId, ...user } = this.userForm.getRawValue()
    const company = { id: companyId }
    const userBody = this.buildUser(user, company)
    this._user[isEdit ? 'save' : 'update'](userBody).subscribe(
      () => {
        this.createOnFirebase(user)
        this._alert.succes(
          `Usuario ${isEdit ? 'creado' : 'actualizado'} con exito`
        )
        this.isLoading = false
        this.router.navigateByUrl('/MasterUsers')
      },
      (badRequest) => {
        this._alert.error(badRequest.error.Message)
        this.isLoading = false
      }
    )
  }

  buildUser(user: any, company: Company | any): User {
    const role = this.roles.find((r) => r.id === +user.roleId)
    const isRenting = role.name === UserRoles.RENTING
    const isDealer = role.name === UserRoles.DEALER
    const isClient = role.name === UserRoles.CLIENT
    return {
      ...user,
      company: isRenting ? company : null,
      clientId: isClient ? user.typeUser : null,
      dealerId: isDealer ? user.typeUser : null,
    }
  }

  toggleVisibility(): void {
    this.isVisibility = !this.isVisibility
  }

  createOnFirebase(user: User): void {
    this._user
      .isExistsInFirebase(user.email)
      .then((result) => {
        if (result.length == 0)
          this._user
            .create(user)
            .catch((badRequest) => this._alert.error(badRequest.message))
      })
      .catch((badRequest) => this._alert.error(badRequest.message))
  }

  getUserIdFromUrl(): void {
    this.route.queryParams.subscribe((params) => {
      const userId = params.userId
      if (userId) this.getUserById(userId)
    })
  }
}

enum UserRoles {
  ADMIN = 'TEC-SOP',
  CLIENT = 'USU-CLIENT',
  DEALER = 'USU-DEALER',
  RENTING = 'USU-RENTING',
}
