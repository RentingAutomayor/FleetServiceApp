import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contact } from '../Models/Contact';
import { ResponseApi } from '../Models/ResponseAPI';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private URL_API =  "/API_FleetService/api/Contact/";
  private  HttpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(
    private http:HttpClient
  ) { 

  }

  async getContacts(pOwner_id:number,pKinOfOwner:string):Promise<Contact[]>{
    let urlGetContacts = `${this.URL_API}/Get?pOwner_id=${pOwner_id}&pKindOfOwner=${pKinOfOwner}`;
    return this.http.get<Contact[]>(urlGetContacts).toPromise();
  }

  async insert(pContact:Contact):Promise<ResponseApi>{
    let urlInsertContacts = `${this.URL_API}/Insert`;
    return this.http.post<ResponseApi>(urlInsertContacts,pContact,this.HttpOptions).toPromise();
  }

  async update(pContact:Contact):Promise<ResponseApi>{
    let urlUpdateContacts = `${this.URL_API}/Update`;
    return this.http.post<ResponseApi>(urlUpdateContacts,pContact,this.HttpOptions).toPromise();
  }

  async delete(pContact:Contact):Promise<ResponseApi>{
    let urlDeletetContacts = `${this.URL_API}/Delete`;
    return this.http.post<ResponseApi>(urlDeletetContacts,pContact,this.HttpOptions).toPromise();
  }
 
}
