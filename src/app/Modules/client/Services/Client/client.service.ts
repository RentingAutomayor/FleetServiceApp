import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseApi } from '../../../../Models/ResponseApi';
import { Client } from '../../../../Models/Client';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ActionType } from 'src/app/Models/ActionType';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private URL_API =  '/API_FleetService/api/Client/';
  private  HttpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private clientToUpdate: Client;
  private clientSelected: Client;
  private blockFormClient: boolean;
  private action: ActionType;

  constructor(
    private http: HttpClient
  ) { }

  async getClients(): Promise<Client[]>{
    const urlGetClients = `${this.URL_API}/Get`;
    return this.http.get<Client[]>(urlGetClients).toPromise();
  }

  async getClientById(pId: number): Promise<Client>{
    const urlGetClientById = `${this.URL_API}/GetById?pId=${pId}`;
    return this.http.get<Client>(urlGetClientById).toPromise();
  }

  async getClientByDocument(pDocument: string): Promise<Client>{
    const urlGetClientByDocument = `${this.URL_API}/GetByDocument?pDocument=${pDocument}`;
    return this.http.get<Client>(urlGetClientByDocument).toPromise();
  }

  getClientsByDescriptions(sDescription: string): Observable<Client[]>{
    if (!sDescription.trim()) {
      return of([]);
    }
    const urlClientsByDesc = `${this.URL_API}/GetByDescription?sDescription=${sDescription}`  ;
    return this.http.get<Client[]>(urlClientsByDesc)
      .pipe(
        catchError(this.handleError<Client[]>('getClientsByDescriptions', []))
      );
  }

  insertClient(pClient: Client): Observable<ResponseApi>{
    const urlInsertClient = `${this.URL_API}/Insert`;
    return this.http.post<ResponseApi>(urlInsertClient, pClient, this.HttpOptions);
  }

  updateClient(client: Client): Observable<ResponseApi>{
    const urlUpdateClient = `${this.URL_API}/Update`;
    return this.http.post<ResponseApi>(urlUpdateClient, client, this.HttpOptions);
  }

  async deleteClient(pClient: Client): Promise<ResponseApi>{
    const urlDeleteClient = `${this.URL_API}/Delete`;
    return this.http.post<ResponseApi>(urlDeleteClient, pClient, this.HttpOptions).toPromise();
  }

  setClientToUpdate(pClient: Client){
    this.clientToUpdate = pClient;
  }

  getClientToUpdate(): Client{
    return this.clientToUpdate;
  }

  setClientSelected(pClient: Client){
    this.clientSelected = pClient;
  }

  getClientSelected(): Client{
    return this.clientSelected;
  }

  getBlockFormClient(): boolean{
    return this.blockFormClient;
  }
  setBlockFormClient(value: boolean){
    this.blockFormClient = value;
  }

  getAction(): ActionType{
    return this.action;
  }

  setAction(value: ActionType){
    this.action = value;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
