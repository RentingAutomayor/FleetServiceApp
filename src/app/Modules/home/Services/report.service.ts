import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private URL_API =  "/API_FleetService/api/Report";
  private  HttpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient
  ) { }

  public GetTotalCountWorkOrdersByDealerAndClient(dealer_id:number = null,client_id:number=null,init_date:Date=null,end_date:Date=null ): Promise<any>{
    let urlReport = `${this.URL_API}/getTotalWorkOrderByDealerAndClient?dealer_id=${dealer_id}&client_id=${client_id}&init_date=${init_date}&end_date=${end_date}`;
    return this.http.get<any>(urlReport).toPromise();
  }

  public GetWorkOrderApprovedByVehicle(client_id: number = null, license_plate: string = null,init_date:Date=null,end_date:Date=null): Promise<any>{
    let urlReport = `${this.URL_API}/getWorkOrderApprovedByVehicle?client_id=${client_id}&license_plate${license_plate}&init_date=${init_date}&end_date=${end_date}`;
    return this.http.get<any>(urlReport).toPromise();
  }

  public GetWorkOrderCanceledByVehicle(client_id: number = null, license_plate: string = null,init_date:Date=null,end_date:Date=null): Promise<any>{
    let urlReport = `${this.URL_API}/getWorkOrderCanceledByVehicle?client_id=${client_id}&license_plate${license_plate}&init_date=${init_date}&end_date=${end_date}`;
    return this.http.get<any>(urlReport).toPromise();
  }

  public GetWorkOrdersValueByMonth(client_id: number = null, dealer_id: number = null,init_date:Date=null,end_date:Date=null): Promise<any>{
    let urlReport = `${this.URL_API}/getWorkOrdersValueByMonth?client_id=${client_id}&dealer_id${dealer_id}&init_date=${init_date}&end_date=${end_date}`;
    return this.http.get<any>(urlReport).toPromise();
  }
}
