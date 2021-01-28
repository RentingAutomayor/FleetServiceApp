import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action } from '../Models/Action';
import { ResponseApi } from '../Models/ResponseAPI';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private URL_API_actions =  "https://localhost:44318/api/Actions";
  private URL_API_group =  "https://localhost:44318/api/Group";
  private URL_API_users =  "https://localhost:44318/api/Users";

  private  HttpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private actionToUpdate:Action;
  private actionSelected:Action;
  
  constructor(
    private http: HttpClient
  ) { }

  // metodos administrativos para la parte de acciones

  async getActions():Promise<Action[]>{
    let urlGetActions = `${this.URL_API_actions}/Get`;
    return this.http.get<Action[]>(urlGetActions).toPromise();
  }

  async deleteAction(pAction:any):Promise<ResponseApi>{
    let urlDeleteAction = `${this.URL_API_actions}/Delete`;
    return this.http.post<ResponseApi>(urlDeleteAction,pAction,this.HttpOptions).toPromise();   
  }

  async insertAction(pAction: Action):Promise<ResponseApi>{
    let urlInsertAction = `${this.URL_API_actions}/Insert`;
    return this.http.post<ResponseApi>(urlInsertAction,pAction,this.HttpOptions).toPromise();
  }

  // ----------------------------------------------------------------------------------------  //

  // metodos administrativos para la parte de a grupos 
  
  async getGroups():Promise<any[]>{
    let urlGetGroups = `${this.URL_API_group}/Get`;
    return this.http.get<any[]>(urlGetGroups).toPromise();
  }

  async deleteGroup(pGroup:any):Promise<ResponseApi>{
    let urlDeleteGroup = `${this.URL_API_group}/Delete`;
    return this.http.post<ResponseApi>(urlDeleteGroup,pGroup,this.HttpOptions).toPromise();   
  }

  // ----------------------------------------------------------------------------------------  //

  // metodos administrativos para la parte de a usuarios

  async getUsers():Promise<any[]>{
    let urlGetUsers = `${this.URL_API_users}/Get`;
    return this.http.get<any[]>(urlGetUsers).toPromise();
  }

  async deleteUser(pUser:any):Promise<ResponseApi>{
    let urlDeleteUser = `${this.URL_API_users}/Delete`;
    return this.http.post<ResponseApi>(urlDeleteUser,pUser,this.HttpOptions).toPromise();   
  }

  // ----------------------------------------------------------------------------------------  //
}
