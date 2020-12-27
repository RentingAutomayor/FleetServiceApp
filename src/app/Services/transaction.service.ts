import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http'; 
import { Transaction } from '../Models/Transaction';
import { ResponseApi } from '../Models/ResponseAPI';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private URL_API =  "/API_FleetService/api/Transaction";
  private HttpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(
    private http: HttpClient
  ) {

   }

  async processTransaction(trx: Transaction): Promise<ResponseApi>{
     let urlProcessTrx = `${this.URL_API}/ProcessTransaction`;
     return this.http.post<ResponseApi>(urlProcessTrx,trx,this.HttpOptions).toPromise();
  }

  async getTodayTransactions(): Promise<Transaction[]>{
    let urlTodaytransactions = `${this.URL_API}/GetTodayTransactions`;
    return this.http.get<Transaction[]>(urlTodaytransactions).toPromise();
  }

  async getTransactionsToApprove(client_id:number): Promise<Transaction[]>{
    let urlGetTransactions = `${this.URL_API}/GetTransactionsToApproveByClient?client_id=${client_id}`;
    return this.http.get<Transaction[]>(urlGetTransactions).toPromise();
  }
  
}
