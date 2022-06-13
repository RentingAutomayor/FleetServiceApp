import { Component, OnInit } from '@angular/core'
import { LoginService } from '../../Services/Login/login.service'
import { Router } from '@angular/router'
import { AngularFireAuth } from '@angular/fire/auth'
import { AlertService } from 'src/app/services/alert.service'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { RecoverPasswordComponent } from '../recover-password/recover-password.component'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginUserData = { user: '', password: '' }
  isAwaiting: boolean = false;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private _auth: AngularFireAuth,
    private _alert: AlertService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  loginUser() {
    this.isAwaiting = true;
    this._auth
      .signInWithEmailAndPassword(
        this.loginUserData.user,
        this.loginUserData.password
      )
      .then((userCredential) => {
        this.loginService
          .loginUser(this.loginUserData)
          .subscribe((user: any) => {
            if (user != null) {
              this.isAwaiting = false;
              sessionStorage.setItem('sessionUser', JSON.stringify(user))
              sessionStorage.setItem('sessionFire', JSON.stringify(userCredential.user));
              this.router.navigate(['/Home'])
            } else {
              this.isAwaiting = false;
              this._alert.error('El usuario no fue encontrado');
            }
          })
      })
      .catch((badRequest) => {
        this._alert.error(badRequest.message);
        this.isAwaiting = false;
      })
  }

  recoverPassword(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    this.dialog.open(RecoverPasswordComponent, dialogConfig);
  }
}
