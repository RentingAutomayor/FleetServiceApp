import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { Role } from 'src/app/Modules/role/models/role'
import { ParameterService } from 'src/app/Modules/role/services/parameter.service'
import { RoleService } from 'src/app/Modules/role/services/role.service'
import { AlertService } from 'src/app/services/alert.service'
import { Company } from '../../models/company'
import { User } from '../../models/user'
import { UserService } from '../../services/user.service'

@Component({
  selector: 'app-user-form',
  templateUrl: './form-user.component.html',
  styleUrls: ['./form-user.component.scss'],
})
export class FormUser implements OnInit {
  userForm!: FormGroup

  roles: Role[] = []
  companies: Company[] = []
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
    this.getUserIdFromUrl()
    this.getCompanies()
    this.getRoles()
  }

  initForm(): void {
    this.userForm = this.fb.group({
      id: 0,
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      companyId: ['', Validators.required],
      roleId: ['', Validators.required],
      status: ['', Validators.required],
    })
  }

  getUserById(userId: number): void {
    this.isLoading = true
    this._user.getById(userId).subscribe(
      (result) => {
        this.isLoading = false
        const { company, ...user } = result
        const formUser = { companyId: company.id, ...user }
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

  getRoles(): void {
    this._role.getAll().subscribe(
      (result) => {
        this.roles = result
      },
      (badRequest) => this._alert.error(badRequest.error.Message)
    )
  }

  submit(): void {
    this.isLoading = true
    const isEdit = this.userForm.get('id').value === 0
    const { companyId, ...user } = this.userForm.getRawValue();
    const company = { id: companyId }
    this._user[isEdit ? 'save' : 'update']({ ...user, company }).subscribe(
      () => {
        this.createOnFirebase(user);
        this._alert.succes(
          `Usuario ${isEdit ? 'creado' : 'actualizado'} con exito`
        )
        this.isLoading = false
        this.router.navigateByUrl('/MasterUsers')
      },
      (badRequest) => this._alert.error(badRequest.error.Message)
    )
  }

  createOnFirebase(user: User): void {
    this._user
      .isExistsInFirebase(user.email)
      .then((result) => {
        if(result.length == 0)
          this._user.create(user)
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
