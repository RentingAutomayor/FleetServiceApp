import { Component, OnInit } from '@angular/core'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { AlertService } from 'src/app/services/alert.service'
import { File } from '../../models/file'
import { FileService } from '../../services/files.service'
import { DialogSaveComponent } from '../dialog-save/dialog-save.component'

declare var google: any

@Component({
  selector: 'app-drive-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  files: File[] = []
  CLIENT_SECRET = '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'
  API_KEY = 'AIzaSyCOeVa-lkYlzDhlvpBPmNcBrNOzVsDR21c'
  CLIENT_ID =
    '178335121856-o618n3pj8kprqnus5n07a8ekhtsn9mf0.apps.googleusercontent.com'
  DISCOVERY_DOCS = [
    'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
  ]
  SCOPES = 'https://www.googleapis.com/auth/drive.metadata'
  APP_ID = 'fleetdrive'
  googleAuth: any = null
  token: any = null
  mimeTypes: string =
    'application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/x-vnd.oasis.opendocument.spreadsheet'
  constructor(
    private _alert: AlertService,
    private _file: FileService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getFiles()
    this.getConnection()
  }

  getFiles(): void {
    const userId = JSON.parse(sessionStorage.getItem('sessionUser')).id_user
    this._file.getByUser(userId).subscribe(
      (files) => (this.files = files),
      (badRequest) => this._alert.error(badRequest.error.Message)
    )
  }

  save(): void {
    const userId = JSON.parse(sessionStorage.getItem('sessionUser')).id_user
    const files = this.files.map((file) => {
      return {
        ...file,
        userId,
      }
    })
    this._file.save(files).subscribe(
      () => this._alert.succes('Archivos guardados con exito'),
      (badRequest) => this._alert.error(badRequest.error.Message)
    )
  }

  goModal(): void {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.width = '400px'
    this.dialog.open(DialogSaveComponent, dialogConfig)
  }

  delete(fileId: number) {
    this._file.deleteById(fileId).subscribe(
      () => {
        this._alert.succes('Documento eliminado con exito')
        this.files = this.files.filter((f) => f.id !== fileId)
      },
      (badRequest) => this._alert.error(badRequest.error.Message)
    )
  }

  async getConnection() {
    await window.gapi.load('picker', () => {})
    // window.gapi.client
    //   .init({
    //     apiKey: this.API_KEY,
    //     discoveryDocs: this.DISCOVERY_DOCS,
    //   })
    //   .catch((badRequest) => console.log(badRequest))
  }

  login(): void {
    this.googleAuth = google.accounts.oauth2.initTokenClient({
      client_id: this.CLIENT_ID,
      scope: this.SCOPES,
      callback: '',
    })
    this.googleAuth.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw resp
      }
      this.token = resp.access_token
      await this.createPicker()
      //this.getFiles()
    }
    if (this.token === null)
      this.googleAuth.requestAccessToken({ prompt: 'consent' })
    else this.googleAuth.requestAccessToken({ prompt: '' })
    // if (window.gapi.client.getToken() === null)
    //   this.googleAuth.requestAccessToken({ prompt: 'consent' })
    // else this.googleAuth.requestAccessToken({ prompt: '' })
  }

  createPicker() {
    const view = new google.picker.View(google.picker.ViewId.DOCS)
    view.setMimeTypes(this.mimeTypes)
    const picker = new google.picker.PickerBuilder()
      .enableFeature(google.picker.Feature.NAV_HIDDEN)
      .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
      .setDeveloperKey(this.API_KEY)
      .setAppId(this.APP_ID)
      .setOAuthToken(this.token)
      .addView(view)
      .addView(new google.picker.DocsUploadView())
      .setCallback((data) => this.files.push(data?.docs[0]))
      .build()
    picker.setVisible(true)
  }

  // async getFiles() {
  //   let response
  //   try {
  //     response = await window.gapi?.client['drive'].files.list({
  //       pageSize: 20,
  //       fields: 'files(id, name, mimeType)',
  //     })
  //   } catch (err) {
  //     this._alert.error(err)
  //   }
  //   this.files = response.result.files
  //   this.cdr.detectChanges()
  // }
}
