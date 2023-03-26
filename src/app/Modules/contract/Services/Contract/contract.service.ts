import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ContractState } from '../../../../Models/ContractState'
import { DiscountType } from '../../../../Models/DiscountType'
import { ResponseApi } from '../../../../Models/ResponseApi'
import { Contract } from '../../../../Models/Contract'
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem'
import { ActionType } from 'src/app/Models/ActionType'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  private URL_API = `${environment.apiUrl}/Contract`
  private HttpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  }
  private contractStateSelected: ContractState
  private discoutSelected: DiscountType
  private contract: Contract
  private lsMaintenanceItems: MaintenanceItem[]
  private contractIsToEdit: boolean
  private action: ActionType

  constructor(private http: HttpClient) {}

  getContractStates(): Promise<ContractState[]> {
    const urlGetStates = `${this.URL_API}/GetContractStates`
    return this.http.get<ContractState[]>(urlGetStates).toPromise()
  }

  getDiscountTypes(): Promise<DiscountType[]> {
    const urlGetDiscounts = `${this.URL_API}/GetDiscountTypes`
    return this.http.get<DiscountType[]>(urlGetDiscounts).toPromise()
  }

  getContractinitState() {
    const urlGetStates = `${this.URL_API}/GetinitContract`
    return this.http.get<ContractState>(urlGetStates)
  }

  getContractPending(deal_id: number) {
    const urlGetContractPending = `${this.URL_API}/GetContractPending?deal_id=${deal_id}`
    return this.http.get<Contract[]>(urlGetContractPending)
  }

  getContracts(
    dealer_id: number = 0,
    client_id: number = 0
  ): Observable<Contract[]> {
    const urlGetContracts = `${this.URL_API}/Get?dealer_id=${dealer_id}&client_id=${client_id}`
    return this.http.get<Contract[]>(urlGetContracts)
  }

  getContractByID(contract_id: number): Observable<Contract> {
    const urlGetById = `${this.URL_API}/GetById?pContract_id=${contract_id}`
    return this.http.get<Contract>(urlGetById)
  }

  async getLastContractByClientAndDealer(
    pClient_id: number,
    pDealer_id: number
  ) {
    const urlGetLastContract = `${this.URL_API}/getLastContractByClientAndDealer?pClient_id=${pClient_id}&pDealer_id=${pDealer_id}`
    return this.http.get<Contract>(urlGetLastContract).toPromise()
  }

  async getContractByVehicleId(pVehicle_id: number): Promise<Contract> {
    const urlGetContractByVehicle = `${this.URL_API}/GetContractByVehicleId?vehicle_id=${pVehicle_id}`
    return this.http.get<Contract>(urlGetContractByVehicle).toPromise()
  }

  async getContractByClientId(client_id: number): Promise<Contract[]> {
    const urlGetContractByClient = `${this.URL_API}/GetContractsByClient?client_id=${client_id}`
    return this.http.get<Contract[]>(urlGetContractByClient).toPromise()
  }

  insert(pContract: Contract): Observable<ResponseApi> {
    const urlInsert = `${this.URL_API}/Insert`
    return this.http.post<ResponseApi>(urlInsert, pContract, this.HttpOptions)
  }

  update(pContract: Contract): Observable<ResponseApi> {
    const urlUpdate = `${this.URL_API}/Update`
    return this.http.post<ResponseApi>(urlUpdate, pContract, this.HttpOptions)
  }

  delete(pContract: Contract): Observable<ResponseApi> {
    const urlDelete = `${this.URL_API}/Delete`
    return this.http.post<ResponseApi>(urlDelete, pContract, this.HttpOptions)
  }

  getContractStateSelected(): ContractState {
    return this.contractStateSelected
  }

  setContractStateSelected(pState: ContractState) {
    this.contractStateSelected = pState
  }

  getDiscountTypeSelected(): DiscountType {
    return this.discoutSelected
  }

  setDiscountTypeSelected(pDiscount: DiscountType) {
    this.discoutSelected = pDiscount
  }

  setContract(pContract: Contract) {
    this.contract = pContract
  }

  getContract(): Contract {
    return this.contract
  }

  setItemsWithPrice(MaintenanceItems: MaintenanceItem[]) {
    this.lsMaintenanceItems = MaintenanceItems
  }

  getItemsWithPrice(): MaintenanceItem[] {
    return this.lsMaintenanceItems
  }

  setContractIsToEdit(value: boolean) {
    this.contractIsToEdit = value
  }

  getContractIsToEdit(): boolean {
    return this.contractIsToEdit
  }

  setAction(value: ActionType) {
    this.action = value
  }

  getAction(): ActionType {
    return this.action
  }
}
