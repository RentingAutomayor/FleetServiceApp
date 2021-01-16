import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseApi } from '../../../../Models/ResponseApi';
import { Client } from '../../../../Models/Client';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private URL_API =  "/API_FleetService/api/Client/";
  private  HttpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private clientToUpdate:Client;
  private clientSelected:Client;
  constructor(
    private http: HttpClient
  ) { }

  async getClients():Promise<Client[]>{
    let urlGetClients = `${this.URL_API}/Get`;
    return this.http.get<Client[]>(urlGetClients).toPromise();
  }

  async getClientById(pId:number):Promise<Client>{
    let urlGetClientById = `${this.URL_API}/GetById?pId=${pId}`;
    return this.http.get<Client>(urlGetClientById).toPromise();
  }

  async getClientByDocument(pDocument:string):Promise<Client>{
    let urlGetClientByDocument = `${this.URL_API}/GetByDocument?pDocument=${pDocument}`;
    return this.http.get<Client>(urlGetClientByDocument).toPromise();
  }

  getClientsByDescriptions(sDescription:string): Observable<Client[]>{
    if (!sDescription.trim()) {
      return of([]);
    }
    let urlClientsByDesc = `${this.URL_API}/GetByDescription?sDescription=${sDescription}`  ;
    //console.log(urlClientsByDesc);
    return this.http.get<Client[]>(urlClientsByDesc)
      .pipe(
        catchError(this.handleError<Client[]>('getClientsByDescriptions', []))
      );
  } 

  async insertClient(pClient:Client):Promise<ResponseApi>{
    let urlInsertClient = `${this.URL_API}/Insert`
    return this.http.post<ResponseApi>(urlInsertClient,pClient,this.HttpOptions).toPromise();    
  }

  async updateClient(pClient:Client):Promise<ResponseApi>{
    let urlUpdateClient = `${this.URL_API}/Update`;
    return this.http.post<ResponseApi>(urlUpdateClient,pClient,this.HttpOptions).toPromise();   
  }

  async deleteClient(pClient:Client):Promise<ResponseApi>{
    let urlDeleteClient = `${this.URL_API}/Delete`;
    return this.http.post<ResponseApi>(urlDeleteClient,pClient,this.HttpOptions).toPromise();   
  }

  setClientToUpdate(pClient:Client){
    this.clientToUpdate = pClient;
  }

  getClientToUpdate():Client{
    return this.clientToUpdate;
  }

  setClientSelected(pClient:Client){
    this.clientSelected = pClient;
  }

  getClientSelected():Client{
    return this.clientSelected;
  }


 
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    }
  }
}
