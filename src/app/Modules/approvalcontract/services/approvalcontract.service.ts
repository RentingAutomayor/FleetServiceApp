import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/Models/User';


@Injectable({
  providedIn: 'root'
})
export class ApprovalContractService {
  private URL_API = '/API_FleetService/api/Contract/'
  private URL_API_USER = '/API_FleetService/api/Users/'

  constructor(private http: HttpClient) { }

  public GetUserWithDealer(usr_id : number) {
    const url = `${this.URL_API_USER}/GetUserByDealer?usr_id=${usr_id}`
    return this.http.get<User>(url);
  }

  public updateStateContract(contract_id : number,state: boolean ){
    const url = `${this.URL_API}/ChangeStateContract`
    return this.http.post(url,{contract_id,state});
  }



}
