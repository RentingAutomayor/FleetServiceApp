import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { environment } from 'src/environments/environment'
import { Basic } from '../../user/models/basic'
import { Email } from '../models/email'
import { Settings } from '../models/settings'

@Injectable()
export class SettingsService {
  public brands: BehaviorSubject<Basic[]> = new BehaviorSubject([])
  public types: BehaviorSubject<Basic[]> = new BehaviorSubject([])
  public models: BehaviorSubject<Basic[]> = new BehaviorSubject([])

  URL_API = `${environment.apiUrl}/settings`
  URL = environment.apiUrl

  constructor(private http: HttpClient) {}

  updateTables(settings: Settings) {
    return this.http.post(`${this.URL_API}/UpdateTables`, settings)
  }

  deleteByDomainAndId(domain: string, rowId: number) {
    return this.http.delete(
      `${this.URL_API}/Delete?domain=${domain}&rowId=${rowId}`
    )
  }

  updateEmail(email: Email) {
    return this.http.post(`${this.URL_API}/Update`, email)
  }

  getSettings() {
    return this.http.get<Email>(`${this.URL_API}/GetSettings`)
  }

  getDataForReport(url: string) {
    return this.http.get<any[]>(`${this.URL}/${url}`)
  }
}
