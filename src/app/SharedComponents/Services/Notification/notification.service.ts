import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmailBody } from 'src/app/Models/Emailbody';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private URL_API = 'API_FleetService/api/SenderMail'

  constructor(private http: HttpClient) {}

  sendMail(emailbody : EmailBody ) {
    const urlSendMail = `${this.URL_API}/send`
    return this.http.post<any>(urlSendMail, emailbody);
  }


}
