import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Transaction } from '../../../Models/Transaction'
import { ResponseApi } from '../../../Models/ResponseApi'
import { LogTransaction } from '../../../Models/LogTransaction'
import { TransactionState } from 'src/app/Models/TransactionState'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private URL_API = '/API_FleetService/api/Transaction'
  private HttpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  }
  constructor(private http: HttpClient) {}

  processTransaction(trx: Transaction): Observable<ResponseApi> {
    const urlProcessTrx = `${this.URL_API}/ProcessTransaction`
    return this.http.post<ResponseApi>(urlProcessTrx, trx, this.HttpOptions)
  }

  async getTodayTransactions(): Promise<Transaction[]> {
    const urlTodaytransactions = `${this.URL_API}/GetTodayTransactions`
    return this.http.get<Transaction[]>(urlTodaytransactions).toPromise()
  }

  getTransactionsToApprove(client_id: number): Observable<Transaction[]> {
    const urlGetTransactions = `${this.URL_API}/GetTransactionsToApproveByClient?client_id=${client_id}`
    return this.http.get<Transaction[]>(urlGetTransactions)
  }

  getTransactionsByDealerOrClient(
    dealer_id: number = null,
    client_id: number = null,
    init_date: string = null,
    end_date: string = null,
    code: string = null,
    license_plate: string = null,
    state_trx: number = null
  ): Observable<Transaction[]> {
    const urlGetTransactions = `${this.URL_API}/GetTransactionsByDealerOrClient?dealer_id=${dealer_id}&client_id=${client_id}&init_date=${init_date}&end_date=${end_date}&code=${code}&license_plate=${license_plate}&state_trx=${state_trx}`
    return this.http.get<Transaction[]>(urlGetTransactions)
  }

  async getTransactionsByClient(client_id: number): Promise<LogTransaction[]> {
    const urlGetTransactions = `${this.URL_API}/GetTransactionsByClient?client_id=${client_id}`
    return this.http.get<LogTransaction[]>(urlGetTransactions).toPromise()
  }

  async getTransactionById(trx_id: number): Promise<Transaction> {
    const urlGetTransaction = `${this.URL_API}/GetTransactionById?trx_id=${trx_id}`
    return this.http.get<Transaction>(urlGetTransaction).toPromise()
  }

  async getTransactionStates(): Promise<TransactionState[]> {
    const urlGetTransactionStates = `${this.URL_API}/getTransactionStates`
    return this.http
      .get<TransactionState[]>(urlGetTransactionStates)
      .toPromise()
  }
}
