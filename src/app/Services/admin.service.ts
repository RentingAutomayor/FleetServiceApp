import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action } from '../Models/Action';
import { ResponseApi } from '../Models/ResponseAPI';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private URL_API_base =  "https://localhost:44318/api";
  private URL_API_actions =  this.URL_API_base + "/Actions";
  private URL_API_group =  this.URL_API_base + "/Group";
  private URL_API_users =  this.URL_API_base + "/Users";

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

  async updateAction(pAction: Action):Promise<ResponseApi>{
    let urlUpdateAction = `${this.URL_API_actions}/Update`;
    return this.http.post<ResponseApi>(urlUpdateAction,pAction,this.HttpOptions).toPromise();
  }

  async getActionById(pId:number):Promise<Action>{
    let urlGetActionById = `${this.URL_API_actions}/GetById?pId=${pId}`;
    return this.http.get<Action>(urlGetActionById).toPromise();
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

  async insertGroup(pGroup: any):Promise<ResponseApi>{
    let urlInsertGroup = `${this.URL_API_group}/Insert`;
    return this.http.post<ResponseApi>(urlInsertGroup,pGroup,this.HttpOptions).toPromise();
  }

  async updateGroup(pGroup: any):Promise<ResponseApi>{
    let urlUpdateGroup = `${this.URL_API_group}/Update`;
    return this.http.post<ResponseApi>(urlUpdateGroup,pGroup,this.HttpOptions).toPromise();
  }

  async getGroupById(pId:number):Promise<any>{
    let urlGetGroupById = `${this.URL_API_group}/GetById?pId=${pId}`;
    return this.http.get<any>(urlGetGroupById).toPromise();
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

  async insertUser(pUser: any):Promise<ResponseApi>{
    let urlInsertUser = `${this.URL_API_users}/Insert`;
    return this.http.post<ResponseApi>(urlInsertUser,pUser,this.HttpOptions).toPromise();
  }

  async updateUser(pUser: any):Promise<ResponseApi>{
    let urlUpdateUser = `${this.URL_API_users}/Update`;
    return this.http.post<ResponseApi>(urlUpdateUser,pUser,this.HttpOptions).toPromise();
  }

  async getUserById(pId:number):Promise<any>{
    let urlGetUserById = `${this.URL_API_users}/GetById?pId=${pId}`;
    return this.http.get<any>(urlGetUserById).toPromise();
  }

  // ----------------------------------------------------------------------------------------  //

  // otros

  async getModules():Promise<any[]>{
    let urlGetModules = `${this.URL_API_group}/Modules`;
    return this.http.get<any[]>(urlGetModules).toPromise();
  }

  async getClients():Promise<any[]>{
    let urlGetModules = `${this.URL_API_base}/Client/Get`;
    return this.http.get<any[]>(urlGetModules).toPromise();
  }

  async getDealers():Promise<any[]>{
    let urlGetModules = `${this.URL_API_base}/Dealer/Get`;
    return this.http.get<any[]>(urlGetModules).toPromise();
  }

  async getCompanies():Promise<any[]>{
    let urlGetCompanies = `${this.URL_API_base}/Company/Get`;
    return this.http.get<any[]>(urlGetCompanies).toPromise();
  }

  


  // ----------------------------------------------------------------------------------------  //
}
