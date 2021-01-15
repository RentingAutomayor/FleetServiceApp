import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http'
import { Branch } from '../../../Models/Branch';
import { ResponseApi } from '../../../Models/ResponseAPI';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  private URL_API =  "/API_FleetService/api/Branch/";
  private  HttpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private branchSelected: Branch;

  constructor(
    private http:HttpClient
  ) { 

  }

  async getBranchs(pOwner_id:number,pKinOfOwner:string):Promise<Branch[]>{
    let urlGetBranchs = `${this.URL_API}/Get?pOwner_id=${pOwner_id}&pKindOfOwner=${pKinOfOwner}`;
    return this.http.get<Branch[]>(urlGetBranchs).toPromise();
  }

  async insert(pBranch:Branch):Promise<ResponseApi>{
    let urlInsertBranch = `${this.URL_API}/Insert`;
    return this.http.post<ResponseApi>(urlInsertBranch,pBranch,this.HttpOptions).toPromise();
  }

  async update(pBranch:Branch):Promise<ResponseApi>{
    let urlUpdateBranch = `${this.URL_API}/Update`;
    return this.http.post<ResponseApi>(urlUpdateBranch,pBranch,this.HttpOptions).toPromise();
  }

  async delete(pBranch:Branch):Promise<ResponseApi>{
    let urlDeleteBranch = `${this.URL_API}/Delete`;
    return this.http.post<ResponseApi>(urlDeleteBranch,pBranch,this.HttpOptions).toPromise();
  }

  setBranchSelected(pBranch:Branch){
    this.branchSelected = pBranch;
  }

  getBranchSelected():Branch{
    return this.branchSelected;
  }
}
