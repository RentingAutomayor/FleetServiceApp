import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NullTemplateVisitor } from '@angular/compiler';

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

  public GetTotalCountWorkOrdersByDealerAndClient(client_id:number=null,dealer_id:number = null,init_date:Date=null,end_date:Date=null ): Promise<any>{
   const initDateFormatted = (init_date!==null)?new Date(init_date).toISOString().split('T')[0]:null;
    const endDateFormatted = (end_date!==null)?new Date(end_date).toISOString().split('T')[0]:null;
    let urlReport = `${this.URL_API}/getTotalWorkOrderByDealerAndClient?dealer_id=${dealer_id}&client_id=${client_id}&init_date=${initDateFormatted}&end_date=${endDateFormatted}`;
    return this.http.get<any>(urlReport).toPromise();
  }

  public GetWorkOrderApprovedByVehicle(client_id: number = null,dealer_id:number= null, license_plate: string = null,init_date:Date=null,end_date:Date=null): Promise<any>{
   const initDateFormatted = (init_date!==null)?new Date(init_date).toISOString().split('T')[0]:null;
    const endDateFormatted = (end_date!==null)?new Date(end_date).toISOString().split('T')[0]:null;
    let urlReport = `${this.URL_API}/getWorkOrderApprovedByVehicle?client_id=${client_id}&dealer_id=${dealer_id}&license_plate=${license_plate}&init_date=${initDateFormatted}&end_date=${endDateFormatted}`;
    return this.http.get<any>(urlReport).toPromise();
  }

  public GetWorkOrderCanceledByVehicle(client_id: number = null,dealer_id:number = null, license_plate: string = null,init_date:Date=null,end_date:Date=null): Promise<any>{
   const initDateFormatted = (init_date!==null)?new Date(init_date).toISOString().split('T')[0]:null;
    const endDateFormatted = (end_date!==null)?new Date(end_date).toISOString().split('T')[0]:null;
    let urlReport = `${this.URL_API}/getWorkOrderCanceledByVehicle?client_id=${client_id}&dealer_id=${dealer_id}&license_plate=${license_plate}&init_date=${initDateFormatted}&end_date=${endDateFormatted}`;
    return this.http.get<any>(urlReport).toPromise();
  }

  public GetWorkOrderPendingByVehicle(client_id: number = null,dealer_id:number = null, license_plate: string = null,init_date:Date=null,end_date:Date=null): Promise<any>{
   const initDateFormatted = (init_date!==null)?new Date(init_date).toISOString().split('T')[0]:null;
    const endDateFormatted = (end_date!==null)?new Date(end_date).toISOString().split('T')[0]:null;
    let urlReport = `${this.URL_API}/getWorkOrderPendingByVehicle?client_id=${client_id}&dealer_id=${dealer_id}&license_plate=${license_plate}&init_date=${initDateFormatted}&end_date=${endDateFormatted}`;
    return this.http.get<any>(urlReport).toPromise();
  }

  public GetWorkOrderFinishedByVehicle(client_id: number = null,dealer_id:number = null, license_plate: string = null,init_date:Date=null,end_date:Date=null): Promise<any>{
   const initDateFormatted = (init_date!==null)?new Date(init_date).toISOString().split('T')[0]:null;
    const endDateFormatted = (end_date!==null)?new Date(end_date).toISOString().split('T')[0]:null;
    let urlReport = `${this.URL_API}/getWorkOrderFinishedByVehicle?client_id=${client_id}&dealer_id=${dealer_id}&license_plate=${license_plate}&init_date=${initDateFormatted}&end_date=${endDateFormatted}`;
    return this.http.get<any>(urlReport).toPromise();
  }

  public GetWorkOrderAnnulByVehicle(client_id: number = null,dealer_id:number = null, license_plate: string = null,init_date:Date=null,end_date:Date=null): Promise<any>{
   const initDateFormatted = (init_date!==null)?new Date(init_date).toISOString().split('T')[0]:null;
    const endDateFormatted = (end_date!==null)?new Date(end_date).toISOString().split('T')[0]:null;
    let urlReport = `${this.URL_API}/getWorkOrderAnnulByVehicle?client_id=${client_id}&dealer_id=${dealer_id}&license_plate=${license_plate}&init_date=${initDateFormatted}&end_date=${endDateFormatted}`;
    return this.http.get<any>(urlReport).toPromise();
  }

  public GetWorkOrdersValueByMonth(client_id: number = null, dealer_id: number = null,init_date:Date=null,end_date:Date=null): Promise<any>{
   const initDateFormatted = (init_date!==null)?new Date(init_date).toISOString().split('T')[0]:null;
    const endDateFormatted = (end_date!==null)?new Date(end_date).toISOString().split('T')[0]:null;
    let urlReport = `${this.URL_API}/getWorkOrdersValueByMonth?client_id=${client_id}&dealer_id=${dealer_id}&init_date=${initDateFormatted}&end_date=${endDateFormatted}`;
    return this.http.get<any>(urlReport).toPromise();
  }



  public GetAmountWorkOrdersByClientAndMonth(client_id: number = null, dealer_id: number = null,init_date:Date=null,end_date:Date=null): Promise<any>{
   const initDateFormatted = (init_date!==null)?new Date(init_date).toISOString().split('T')[0]:null;
    const endDateFormatted = (end_date!==null)?new Date(end_date).toISOString().split('T')[0]:null;
    let urlReport = `${this.URL_API}/getAmountWorkOrdersByClientAndMonth?client_id=${client_id}&dealer_id=${dealer_id}&init_date=${initDateFormatted}&end_date=${endDateFormatted}`;
    return this.http.get<any>(urlReport).toPromise();
  }

  public GetAmountWorkOrdersByDealerAndMonth(client_id: number = null, dealer_id: number = null,init_date:Date=null,end_date:Date=null): Promise<any>{
    const initDateFormatted = (init_date!==null)?new Date(init_date).toISOString().split('T')[0]:null;
    const endDateFormatted = (end_date!==null)?new Date(end_date).toISOString().split('T')[0]:null;
    let urlReport = `${this.URL_API}/getAmountWorkOrdersByDealerAndMonth?client_id=${client_id}&dealer_id=${dealer_id}&init_date=${initDateFormatted}&end_date=${endDateFormatted}`;
    return this.http.get<any>(urlReport).toPromise();
  }

}
