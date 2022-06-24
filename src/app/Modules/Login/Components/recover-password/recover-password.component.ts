import { Component } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
import { MatDialogRef } from '@angular/material/dialog'
import { AlertService } from 'src/app/services/alert.service'

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
})
export class RecoverPasswordComponent {
  email: string = ''
  constructor(
    private dialogRef: MatDialogRef<RecoverPasswordComponent>,
    private _auth: AngularFireAuth,
    private _alert: AlertService
  ) {}

  closeDialog(): void {
    this.dialogRef.close()
  }

  sendEmail(): void {
    this._auth
      .sendPasswordResetEmail(this.email)
      .then(() => {
        this._alert.succes(
          `Se ha enviado un correo a ${this.email} para recuperar la contraseña`
        )
        this.closeDialog()
      })
      .catch(() => this._alert.error('Hemos presentado incovenientes'))
  }
}
