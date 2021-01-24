import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ContractState } from '../../../../Models/ContractState';
import { DiscountType } from '../../../../Models/DiscountType';
import { ResponseApi } from '../../../../Models/ResponseApi';
import { Contract } from '../../../../Models/Contract';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private URL_API = "/API_FleetService/api/Contract";
  private HttpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private contractStateSelected: ContractState;
  private discoutSelected: DiscountType;
  private contract: Contract;

  constructor(
    private http: HttpClient
  ) { }

  getContractStates(): Promise<ContractState[]> {
    let urlGetStates = `${this.URL_API}/GetContractStates`;
    return this.http.get<ContractState[]>(urlGetStates).toPromise();
  }

  getDiscountTypes(): Promise<DiscountType[]> {
    let urlGetDiscounts = `${this.URL_API}/GetDiscountTypes`;
    return this.http.get<DiscountType[]>(urlGetDiscounts).toPromise();
  }

  async getContracts(dealer_id:number = 0,client_id:number = 0): Promise<Contract[]>{
    let urlGetContracts = `${this.URL_API}/Get?dealer_id=${dealer_id}&client_id=${client_id}`;
    return this.http.get<Contract[]>(urlGetContracts).toPromise();
  }

  async getContractByID(contract_id:number):Promise<Contract>{
    let urlGetById = `${this.URL_API}/GetById?pContract_id=${contract_id}`;
    return this.http.get<Contract>(urlGetById).toPromise();
  }

  async getLastContractByClientAndDealer(pClient_id:number,pDealer_id: number){
    let urlGetLastContract = `${this.URL_API}/getLastContractByClientAndDealer?pClient_id=${pClient_id}&pDealer_id=${pDealer_id}`;
    return this.http.get<Contract>(urlGetLastContract).toPromise();
  }

  async getContractByVehicleId(pVehicle_id:number):Promise<Contract>{
    let urlGetContractByVehicle = `${this.URL_API}/GetContractByVehicleId?vehicle_id=${pVehicle_id}`;
    return this.http.get<Contract>(urlGetContractByVehicle).toPromise();
  }

  async getContractByClientId(client_id:number): Promise<Contract[]>{
    let urlGetContractByClient = `${this.URL_API}/GetContractsByClient?client_id=${client_id}`;
    return this.http.get<Contract[]>(urlGetContractByClient).toPromise();
  }

  async insert(pContract: Contract): Promise<ResponseApi> {
    let urlInsert = `${this.URL_API}/Insert`;
    return this.http.post<ResponseApi>(urlInsert, pContract, this.HttpOptions).toPromise();
  }

  async update(pContract: Contract): Promise<ResponseApi> {
    let urlUpdate = `${this.URL_API}/Update`;
    return this.http.post<ResponseApi>(urlUpdate, pContract, this.HttpOptions).toPromise();
  }

  async delete(pContract:Contract): Promise<ResponseApi>{
    let urlDelete = `${this.URL_API}/Delete`;
    return this.http.post<ResponseApi>(urlDelete,pContract,this.HttpOptions).toPromise();
  }

  

  getContractStateSelected(): ContractState {
    return this.contractStateSelected;
  }

  setContractStateSelected(pState: ContractState) {
    this.contractStateSelected = pState;
  }

  getDiscountTypeSelected(): DiscountType {
    return this.discoutSelected;
  }

  setDiscountTypeSelected(pDiscount:DiscountType){
    this.discoutSelected = pDiscount;
  }

  setContract(pContract:Contract){
    this.contract = pContract;
  }

  getContract():Contract{
    return this.contract;
  }
}
