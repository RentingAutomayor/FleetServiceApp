import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private URL_API = `${environment.apiUrl}/Users/GetAuthenticate`

  constructor(private http: HttpClient) {}

  // tslint:disable-next-line: typedef
  testConection() {
    return this.http.get(`${this.URL_API}/values`)
  }

  // tslint:disable-next-line: typedef
  loginUser(user: any) {
    return this.http.post<any>(this.URL_API, user)
  }
}
