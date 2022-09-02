import { Component, OnInit } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { AlertService } from 'src/app/services/alert.service'

declare var google: any

@Component({
  selector: 'app-dialog-save',
  templateUrl: './dialog-save.component.html',
  styleUrls: ['./dialog-save.component.scss'],
})
export class DialogSaveComponent implements OnInit {
  CLIENT_SECRET = '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'
  API_KEY = 'AIzaSyCOeVa-lkYlzDhlvpBPmNcBrNOzVsDR21c'
  CLIENT_ID =
    '178335121856-o618n3pj8kprqnus5n07a8ekhtsn9mf0.apps.googleusercontent.com'
  DISCOVERY_DOCS = [
    'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
  ]
  SCOPES = 'https://www.googleapis.com/auth/drive.metadata'
  googleAuth: any = null
  fileUpload: any
  constructor(
    private dialogRef: MatDialogRef<DialogSaveComponent>,
    private _alert: AlertService
  ) {}

  ngOnInit(): void {
    this.getConnection()
  }

  async getConnection() {
    window.gapi.load('client', () => {
      window.gapi.client.init({
        apiKey: this.API_KEY,
        discoveryDocs: this.DISCOVERY_DOCS,
      })
    })
    this.getToken()
  }

  getToken() {
    this.googleAuth = google.accounts.oauth2.initTokenClient({
      client_id: this.CLIENT_ID,
      scope: this.SCOPES,
      callback: '',
    })
  }

  login() {
    this.googleAuth.callback = async (resp) => {
      if (resp.error !== undefined) this._alert.error(resp)
      this.uploadFile()
    }
    if (window.gapi.client.getToken() === null) {
      this.googleAuth.requestAccessToken({ prompt: 'consent' })
    } else {
      this.googleAuth.requestAccessToken({ prompt: '' })
    }
  }

  async uploadFile() {
    let response
    try {
      var reader = new FileReader()
      reader.readAsBinaryString(this.fileUpload)
      reader.onload = (data) => {
        const contentType = this.fileUpload?.type
        const metadata = { title: this.fileUpload?.name, mimeType: contentType }
      }
      response = await window.gapi.client['drive'].files.create({
        resource: this.fileUpload,
        fields: 'files(id, name, mimeType, url)',
      })
    } catch (err) {
      this._alert.error(err)
    }
  }

  closeDialog(): void {
    this.dialogRef.close()
  }

  getFile(file: any): void {
    this.fileUpload = file
  }
}
