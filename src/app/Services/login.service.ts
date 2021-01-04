import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Md5 } from 'ts-md5/dist/md5';


import { Observable } from 'rxjs';
import { variable } from '@angular/compiler/src/output/output_ast';



@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private URL_API = 'https://localhost:44318/api/Users/GetAuthenticate';
  
  constructor(private http: HttpClient) { }

  // tslint:disable-next-line: typedef
  testConection(){
    return this.http.get(`${this.URL_API}/values`);
  }

  // tslint:disable-next-line: typedef
  loginUser(user: any){
    user.password = btoa(user.password);
    return this.http.post<any>(this.URL_API, user);
  }
}

