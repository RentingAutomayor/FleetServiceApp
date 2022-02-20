import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Branch } from '../../../Models/Branch';
import { ResponseApi } from '../../../Models/ResponseApi';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  private URL_API =  '/API_FleetService/api/Branch/';
  private  HttpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private branchSelected: Branch;

  constructor(
    private http: HttpClient
  ) {

  }

  getBranchs(pOwner_id: number, pKinOfOwner: string): Observable<Branch[]>{
    const urlGetBranchs = `${this.URL_API}/Get?pOwner_id=${pOwner_id}&pKindOfOwner=${pKinOfOwner}`;
    return this.http.get<Branch[]>(urlGetBranchs);
  }

  insert(pBranch: Branch): Observable<Branch>{
    const urlInsertBranch = `${this.URL_API}/Insert`;
    return this.http.post<Branch>(urlInsertBranch, pBranch, this.HttpOptions);
  }

  update(pBranch: Branch): Observable<Branch>{
    const urlUpdateBranch = `${this.URL_API}/Update`;
    return this.http.post<Branch>(urlUpdateBranch, pBranch, this.HttpOptions);
  }

  delete(pBranch: Branch): Observable<ResponseApi>{
    const urlDeleteBranch = `${this.URL_API}/Delete`;
    return this.http.post<ResponseApi>(urlDeleteBranch, pBranch, this.HttpOptions);
  }

  setBranchSelected(pBranch: Branch){
    this.branchSelected = pBranch;
  }

  getBranchSelected(): Branch{
    return this.branchSelected;
  }
}
