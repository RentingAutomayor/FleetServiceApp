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

  private URL_API =  "/API_FleetService/api/Dealer/";
  private  HttpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private dealerToUpdate:Dealer;
  private dealerSelected:Dealer;
  constructor(
    private http: HttpClient
  ) { }

  async getDealers():Promise<Dealer[]>{
    let urlGetDelaers = `${this.URL_API}/Get`;
    return this.http.get<Dealer[]>(urlGetDelaers).toPromise();
  }

  async getDealerById(pId:number):Promise<Dealer>{
    let urlGetDealerById = `${this.URL_API}/GetById?pId=${pId}`;
    return this.http.get<Dealer>(urlGetDealerById).toPromise();
  }

  async getDealersByDocument(pDocument:string):Promise<Dealer>{
    let urlGetDealerByDocument = `${this.URL_API}/GetByDocument?pDocument=${pDocument}`;
    return this.http.get<Dealer>(urlGetDealerByDocument).toPromise();
  }

  getDealersByDescription(sDescription:string):Observable<Dealer[]>{
    if (!sDescription.trim()) {
      return of([]);
    }
    let urlDealerByDesc = `${this.URL_API}/GetByDescription?sDescription=${sDescription}`;    
    return this.http.get<Dealer[]>(urlDealerByDesc)
      .pipe(
        catchError(this.handleError<Dealer[]>('getClientsByDescriptions', []))
      );
  }

  async insertDealer(pDealer:Dealer):Promise<ResponseApi>{
    let urlInsertDealer = `${this.URL_API}/Insert`
    return this.http.post<ResponseApi>(urlInsertDealer,pDealer,this.HttpOptions).toPromise();    
  }

  async updateDealer(pDealer:Dealer):Promise<ResponseApi>{
    let urlUpdateDealer = `${this.URL_API}/Update`;
    return this.http.post<ResponseApi>(urlUpdateDealer,pDealer,this.HttpOptions).toPromise();   
  }

  async deleteDealer(pDealer:Dealer):Promise<ResponseApi>{
    let urlDeleteDealer = `${this.URL_API}/Delete`;
    return this.http.post<ResponseApi>(urlDeleteDealer,pDealer,this.HttpOptions).toPromise();   
  }

  setDealerToUpdate(pDealer:Dealer){
    this.dealerToUpdate = pDealer;
  }

  getDealerToUpdate():Dealer{
    return this.dealerToUpdate;
  }

  setDealerSelected(pDealer:Dealer){
    this.dealerSelected = pDealer;
  }

  getDealerSelected():Dealer{
    return this.dealerSelected;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    }
  }
}
