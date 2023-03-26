import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { AlertService } from 'src/app/services/alert.service'
import { Module } from '../../models/module'
import { ParameterService } from '../../services/parameter.service'
import { RoleService } from '../../services/role.service'

@Component({
  selector: 'app-form-role',
  templateUrl: './form-role.component.html',
  styleUrls: ['./form-role.component.scss'],
})
export class FormRoleComponent implements OnInit {
  roleForm!: FormGroup
  modules: Module[] = []
  constructor(
    private fb: FormBuilder,
    private _alert: AlertService,
    private _role: RoleService,
    private _parameter: ParameterService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initForm()
  }

  ngOnInit(): void {
    this.getRoleFromUrl()
    this.getModules()
  }

  initForm(): void {
    this.roleForm = this.fb.group({
      id: 0,
      name: ['', Validators.required],
      description: [''],
      modulesIds: ['', Validators.required],
    })
  }

  getRoleById(roleId: number): void {
    this._role.getById(roleId).subscribe(
      (result) => {
        this.roleForm.setValue(result)
      },
      (badRequest) => this._alert.error(badRequest.error.Message)
    )
  }

  getModules(): void {
    this._parameter.getModules().subscribe(
      (result) => {
        this.modules = result
      },
      (badRequest) => this._alert.error(badRequest.error.Message)
    )
  }

  getRoleFromUrl(): void {
    this.route.queryParams.subscribe((params) => {
      const roleId = params.roleId
      if (roleId) this.getRoleById(roleId)
    })
  }

  submit(): void {
    const isEdit = this.roleForm.get('id').value == 0
    this._role[isEdit ? 'save' : 'update'](this.roleForm.value).subscribe(
      () => {
        this._alert.succes(`Rol ${isEdit ? 'creado' : 'actualizado'} con éxito`)
        this.router.navigateByUrl('/MasterRoles')
      },
      (badRequest) => this._alert.error(badRequest.error.Message)
    )
  }
}
