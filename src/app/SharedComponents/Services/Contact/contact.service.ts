import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ContactWithTypeDTO } from 'src/app/Models/ContactWithTypeDTO'
import { IContactType } from 'src/app/Models/IContactType'
import {
  Contact,
  CreateContactDTO,
  UpdateContactDTO,
} from '../../../Models/Contact'
import { ResponseApi } from '../../../Models/ResponseApi'

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private URL_API = '/API_FleetService/api/Contact/'
  private URL_API2 = '/API_FleetService/api/ContactsWithTypes'
  private HttpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  }
  constructor(private http: HttpClient) {}

  async getContacts(
    pOwner_id: number,
    pKinOfOwner: string
  ): Promise<Contact[]> {
    const urlGetContacts = `${this.URL_API}/Get?pOwner_id=${pOwner_id}&pKindOfOwner=${pKinOfOwner}`
    return this.http.get<Contact[]>(urlGetContacts).toPromise()
  }

  insert(contact: CreateContactDTO): Observable<Contact> {
    const urlInsertContacts = `${this.URL_API}/Insert`
    return this.http.post<Contact>(urlInsertContacts, contact, this.HttpOptions)
  }

  insertContactWithType(contactWithType: ContactWithTypeDTO): Observable<Contact> {
    const urlInsertContactsWithType = `${this.URL_API2}/Insert`
    return this.http.post<Contact>(urlInsertContactsWithType, contactWithType, this.HttpOptions)
  }

  update(pContact: UpdateContactDTO | CreateContactDTO): Observable<Contact> {
    const urlUpdateContacts = `${this.URL_API}/Update`
    return this.http.put<Contact>(urlUpdateContacts, pContact, this.HttpOptions)
  }

  delete(contactId: number): Observable<ResponseApi> {
    const urlDeletetContacts = `${this.URL_API}/Delete?contactId=${contactId}`
    return this.http.delete<ResponseApi>(urlDeletetContacts)
  }

  getContactTypes(): Observable<IContactType[]> {
    const urlGEtTypes = `${this.URL_API}/getContactTypes`
    return this.http.get<IContactType[]>(urlGEtTypes)
  }
}
