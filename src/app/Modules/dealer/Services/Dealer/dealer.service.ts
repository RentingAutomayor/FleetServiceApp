import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Dealer } from '../../../../Models/Dealer';
import { ResponseApi } from '../../../../Models/ResponseApi';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DealerService {

  private URL_API =  '/API_FleetService/api/Dealer/';
  private  HttpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private dealerToUpdate: Dealer;
  private dealerSelected: Dealer;
  constructor(
    private http: HttpClient
  ) { }

  getDealers(): Observable<Dealer[]>{
    const urlGetDelaers = `${this.URL_API}/Get`;
    return this.http.get<Dealer[]>(urlGetDelaers);
  }

  getDealerById(pId: number): Observable<Dealer>{
    const urlGetDealerById = `${this.URL_API}/GetById?dealerId=${pId}`;
    return this.http.get<Dealer>(urlGetDealerById);
  }

  async getDealersByDocument(pDocument: string): Promise<Dealer>{
    const urlGetDealerByDocument = `${this.URL_API}/GetByDocument?pDocument=${pDocument}`;
    return this.http.get<Dealer>(urlGetDealerByDocument).toPromise();
  }

  getDealersByDescription(sDescription: string): Observable<Dealer[]>{
    if (!sDescription.trim()) {
      return of([]);
    }
    const urlDealerByDesc = `${this.URL_API}/GetByDescription?sDescription=${sDescription}`;
    return this.http.get<Dealer[]>(urlDealerByDesc)
      .pipe(
        catchError(this.handleError<Dealer[]>('getClientsByDescriptions', []))
      );
  }

  insertDealer(pDealer: Dealer): Observable<Dealer>{
    const urlInsertDealer = `${this.URL_API}/Insert`;
    return this.http.post<Dealer>(urlInsertDealer, pDealer, this.HttpOptions);
  }

  updateDealer(pDealer: Dealer): Observable<Dealer>{
    const urlUpdateDealer = `${this.URL_API}/Update`;
    return this.http.put<Dealer>(urlUpdateDealer, pDealer, this.HttpOptions);
  }

  deleteDealer(pDealer: Dealer): Observable<ResponseApi>{
    const urlDeleteDealer = `${this.URL_API}/Delete?dealerId=${pDealer.id}`;
    return this.http.delete<ResponseApi>(urlDeleteDealer, this.HttpOptions);
  }

  setDealerToUpdate(pDealer: Dealer){
    this.dealerToUpdate = pDealer;
  }

  getDealerToUpdate(): Dealer{
    return this.dealerToUpdate;
  }

  setDealerSelected(pDealer: Dealer){
    this.dealerSelected = pDealer;
  }

  getDealerSelected(): Dealer{
    return this.dealerSelected;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
