import { Component } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { AlertService } from 'src/app/services/alert.service'
import { LoginService } from '../../Services/Login/login.service'
import { RecoverPasswordComponent } from '../recover-password/recover-password.component'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm!: FormGroup
  isAwaiting: boolean = false
  isVisibility: boolean = false

  constructor(
    private loginService: LoginService,
    private router: Router,
    private _auth: AngularFireAuth,
    private _alert: AlertService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.initForm()
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      user: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  loginUser() {
    const userForm = this.loginForm.value
    this.isAwaiting = true
    this._auth
      .signInWithEmailAndPassword(userForm.user, userForm.password)
      .then((userCredential) => {
        this.loginService.loginUser(userForm).subscribe(
          (user: any) => {
            if (user != null) {
              this.isAwaiting = false
              sessionStorage.setItem('sessionUser', JSON.stringify(user))
              sessionStorage.setItem(
                'sessionFire',
                JSON.stringify(userCredential.user)
              )
              this._alert.succes(`Bienvenid@ ${user.name}`)
              this.router.navigate(['/Home'])
            } else {
              this.isAwaiting = false
              this._alert.error('El usuario no fue encontrado')
            }
          },
          (badRequest) => {
            this._alert.error(badRequest.error.Message)
            this.isAwaiting = false
          }
        )
      })
      .catch(() => {
        this._alert.error('El correo electronico o la contraseña es incorrecta')
        this.isAwaiting = false
      })
  }

  recoverPassword(): void {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.width = '500px'
    this.dialog.open(RecoverPasswordComponent, dialogConfig)
  }

  isRequired(key: string): boolean {
    return (
      (this.loginForm.get(key).dirty || this.loginForm.get(key).touched) &&
      this.loginForm.get(key).invalid
    )
  }

  toggleVisibility(): void {
    this.isVisibility = !this.isVisibility
  }
}
