import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AlertService } from 'src/app/services/alert.service'
import { BAD_REQUEST } from 'src/app/Utils/general-error'
import { SettingsService } from '../../services/settings.service'

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  notificacionsForm!: FormGroup

  isVisibility: boolean = false
  constructor(
    private _settings: SettingsService,
    private _alert: AlertService,
    private fb: FormBuilder
  ) {
    this.initForm()
  }

  initForm(): void {
    this.notificacionsForm = this.fb.group({
      id: '',
      email: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.getSettings()
  }

  toggleVisibility(): void {
    this.isVisibility = !this.isVisibility
  }

  update(): void {
    this._settings.updateEmail(this.notificacionsForm.value).subscribe(
      () => this._alert.succes('Parametros actualizados con exito'),
      () => this._alert.error(BAD_REQUEST)
    )
  }

  getSettings(): void {
    this._settings.getSettings().subscribe(
      (result) => this.notificacionsForm.setValue(result),
      () => this._alert.error(BAD_REQUEST)
    )
  }
}
