import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Client } from '../../../../Models/Client'
import { FinancialInformation } from '../../../../Models/FinancialInformation'
import { ResponseApi } from '../../../../Models/ResponseApi'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class QuotaService {
  private URL_API = `${environment.apiUrl}/FinancialInformation`
  private HttpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  }
  constructor(private http: HttpClient) {}
  async getClientsWithQuota(): Promise<FinancialInformation[]> {
    const urlClientsWithQuota = `${this.URL_API}/GetClientsWithQuota`
    return this.http
      .get<FinancialInformation[]>(urlClientsWithQuota)
      .toPromise()
  }
  getClientsWithoutQuota(): Observable<Client[]> {
    const urlClientsWithoutQuota = `${this.URL_API}/GetClientsWithoutQuota`
    return this.http.get<Client[]>(urlClientsWithoutQuota)
  }

  getFinancialInformationByClient(
    client_id: number
  ): Observable<FinancialInformation> {
    const urlGetFinancialInformation = `${this.URL_API}/GetFinancialInformationByClient?client_id=${client_id}`
    return this.http.get<FinancialInformation>(urlGetFinancialInformation)
  }

  async validatePaymentVsConsumedQuota(
    pClient_id: Number,
    paymentValue: Number
  ): Promise<ResponseApi> {
    const urlValidatePayment = `${this.URL_API}/ValidatePaymentVsConsumedQuota?pClient_id=${pClient_id}&paymentValue=${paymentValue}`
    return this.http.get<ResponseApi>(urlValidatePayment).toPromise()
  }
}
