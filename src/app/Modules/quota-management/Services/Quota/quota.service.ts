import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Client } from '../../../../Models/Client';
import { FinancialInformation } from '../../../../Models/FinancialInformation';
import { ResponseApi } from '../../../../Models/ResponseApi';

@Injectable({
  providedIn: 'root'
})
export class QuotaService {
  private URL_API =  "/API_FleetService/api/FinancialInformation";
  private HttpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(
    private http: HttpClient
  ) {

   }
   async getClientsWithQuota():Promise<FinancialInformation[]>{
     let urlClientsWithQuota = `${this.URL_API}/GetClientsWithQuota`;
     return this.http.get<FinancialInformation[]>(urlClientsWithQuota).toPromise();
   }
   async getClientsWithoutQuota():Promise<Client[]>{
     let urlClientsWithoutQuota = `${this.URL_API}/GetClientsWithoutQuota`;
     return this.http.get<Client[]>(urlClientsWithoutQuota).toPromise();
   }

   async getFinancialInformationByClient(client_id: number): Promise<FinancialInformation>{
    let urlGetFinancialInformation = `${this.URL_API}/GetFinancialInformationByClient?client_id=${client_id}`; 
    return this.http.get<FinancialInformation>(urlGetFinancialInformation).toPromise();
   }

   async validatePaymentVsConsumedQuota(pClient_id:Number,  paymentValue: Number):Promise<ResponseApi>{
     let urlValidatePayment = `${this.URL_API}/ValidatePaymentVsConsumedQuota?pClient_id=${pClient_id}&paymentValue=${paymentValue}`
     return this.http.get<ResponseApi>(urlValidatePayment).toPromise();
   }
}
