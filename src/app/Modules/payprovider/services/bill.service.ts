import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Bill } from 'src/app/Models/Bill';
import { BillDTO } from 'src/app/Models/BillDTO';
import { OrderWork } from 'src/app/Models/OrderWork';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  public reloadTable = new BehaviorSubject<string>("");
  private URL_API = '/API_FleetService/api/Bill/'
  private URL_API_BILLSTATE = '/API_FleetService/api/BillState/'

  constructor(private http: HttpClient) { }

  //ORDERS WORKS FINISHED
  getordersfinished() : Observable<OrderWork[]> {
    const urlGetOrderWork = `${this.URL_API}getAllOrderWorksToBill`
    return this.http.get<OrderWork[]>(urlGetOrderWork)
  }

  //getbills
  getbills(): Observable<Bill[]> {
    const urlGetBill = `${this.URL_API}Get`
    return this.http.get<Bill[]>(urlGetBill);
  }

  paybill(bill: BillDTO) {
    return this.http.post(this.URL_API + 'PayBill',bill)
  }

  // insert bill
  insertbill(bill: BillDTO) {
    return this.http.post(this.URL_API + 'Insert', bill)
  }

  // update bill
  updatebill(bill: BillDTO) {
    return this.http.post(this.URL_API + 'UpdateBill', bill)
  }

  // delete bill
  deletebillbyID(billID : number)  {
    const urlDeleteBill = `${this.URL_API}delete?bill_id=${billID}`
    return this.http.delete(urlDeleteBill);
  }


  // get bill state
  getbillstate() {
    return this.http.get(this.URL_API_BILLSTATE + 'Get')
  }

  //GET BY ID BILL STATE
  getbillstatebyid(Tid: number) {
    return this.http.get(this.URL_API_BILLSTATE + 'GetById?Tid='+Tid)
  }


}
