import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { variable } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private URL_API = '/API_FleetService/api/Users/GetAuthenticate';

  constructor(private http: HttpClient) { }

  // tslint:disable-next-line: typedef
  testConection(){
    return this.http.get(`${this.URL_API}/values`);
  }

  // tslint:disable-next-line: typedef
  loginUser(user: any){
    return this.http.post<any>(this.URL_API, user);
  }
}
