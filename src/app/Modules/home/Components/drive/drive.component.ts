import { Component, OnInit } from '@angular/core'

declare var google: any

@Component({
  selector: 'app-drive',
  templateUrl: './drive.component.html',
})
export class DriveComponent implements OnInit {
  CLIENT_SECRET = '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'
  API_KEY = 'AIzaSyCOeVa-lkYlzDhlvpBPmNcBrNOzVsDR21c'
  CLIENT_ID =
    '178335121856-o618n3pj8kprqnus5n07a8ekhtsn9mf0.apps.googleusercontent.com'
  DISCOVERY_DOCS = [
    'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
  ]
  SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly'
  googleAuth: any = null

  ngOnInit(): void {
    this.getConnection()
  }

  async getConnection() {
    await window.gapi.load('client:auth2', () => {
      window.gapi.client
        .init({
          apiKey: this.API_KEY,
          discoveryDocs: this.DISCOVERY_DOCS,
        })
        .catch((badRequest) => console.log(badRequest))
    })
  }

  gisLoaded(): void {
    this.googleAuth = google.accounts.oauth2.initTokenClient({
      client_id: this.CLIENT_ID,
      scope: this.SCOPES,
      callback: '',
    })
    this.googleAuth.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw resp
      }
      this.listFiles()
      this.listFolders()
    }
    if (window.gapi.client.getToken() === null)
      this.googleAuth.requestAccessToken({ prompt: 'consent' })
    else this.googleAuth.requestAccessToken({ prompt: '' })
  }

  async listFiles() {
    let response
    try {
      response = await window.gapi?.client['drive'].files.list({
        pageSize: 20,
        fields: 'files(id, name)',
      })
    } catch (err) {
      console.log(err)
    }
    const files = response.result.files
    console.log(files)
  }

  async listFolders() {
    let response
    try {
      response = await window.gapi.client['drive'].files.list({
        pageSize: 58,
        q: "mimeType='application/vnd.google-apps.folder' and trashed=false",
        fields: 'nextPageToken, files(id, name)',
      })
    } catch (err) {
      console.log(err)
    }
    const files = response.result.files
    console.log(files)
  }
}
