import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { PresentationUnit } from '../../../../Models/PresentationUnit'
import { TypeOfMaintenanceItem } from '../../../../Models/TypeOfMaintenanceItem'
import { MaintenanceItem } from '../../../../Models/MaintenanceItem'
import { ResponseApi } from '../../../../Models/ResponseApi'
import { Category } from '../../../../Models/Category'
import { PricesByDealer } from '../../../../Models/PricesByDealer'
import { PricesByContract } from '../../../../Models/PricesByContract'
import { Tax } from 'src/app/Models/Tax'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class MaintenanceItemService {
  private URL_API = '/API_FleetService/api/MaintenanceItem/'
  private HttpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  }
  private presentationUnit: PresentationUnit
  private typeOfItem: TypeOfMaintenanceItem
  private item: MaintenanceItem
  private itemToUpdate: MaintenanceItem
  private category: Category
  constructor(private http: HttpClient) {}

  getCategorySelected(): Category {
    return this.category
  }

  setCategorySelected(pCategory: Category) {
    this.category = pCategory
  }

  getPresentationUnit(): PresentationUnit {
    return this.presentationUnit
  }

  setPresentationUnit(pPresentation: PresentationUnit) {
    this.presentationUnit = pPresentation
  }

  getTypeOfItem(): TypeOfMaintenanceItem {
    return this.typeOfItem
  }

  getItem(): MaintenanceItem {
    return this.item
  }

  setItem(pItem: MaintenanceItem) {
    this.item = pItem
  }

  settypeOfItem(pType: TypeOfMaintenanceItem) {
    this.typeOfItem = pType
  }

  getItemToUpdate(): MaintenanceItem {
    return this.itemToUpdate
  }

  setItemToUpdate(pItem: MaintenanceItem) {
    this.itemToUpdate = pItem
  }

  getMaintenanceItems(dealer_id: number): Observable<MaintenanceItem[]> {
    const urlGetMaintenanceItems = `${this.URL_API}/Get?dealer_id=${dealer_id}`
    return this.http.get<MaintenanceItem[]>(urlGetMaintenanceItems)
  }

  getMaintenanceItemById(pId: number): Observable<MaintenanceItem> {
    const urlGetMaintenanceItem = `${this.URL_API}/GetById?itemId=${pId}`
    return this.http.get<MaintenanceItem>(urlGetMaintenanceItem)
  }

  async getMaintenanceItemByType(pTypeId: number): Promise<MaintenanceItem[]> {
    const urlGetMaintenanceItem = `${this.URL_API}/GetByType?typeId=${pTypeId}`
    return this.http.get<MaintenanceItem[]>(urlGetMaintenanceItem).toPromise()
  }

  getItemsByVehicleModel(pVehicleModel_id: number) {
    const urlGetMaintenanceItems = `${this.URL_API}/GetItemsByVehicleModel?pVehicleModel_id=${pVehicleModel_id}`
    return this.http.get<MaintenanceItem[]>(urlGetMaintenanceItems)
  }

  async getPresentationUnits(): Promise<PresentationUnit[]> {
    const urlGetPresentationUnits = `${this.URL_API}/GetPresentationUnits`
    return this.http
      .get<PresentationUnit[]>(urlGetPresentationUnits)
      .toPromise()
  }

  async getCategories(): Promise<Category[]> {
    const urlCategory = `${this.URL_API}/GetCategories`
    return this.http.get<Category[]>(urlCategory).toPromise()
  }

  async getTypeOfMaintenanceItem(): Promise<TypeOfMaintenanceItem[]> {
    const urlTypeOfItem = `${this.URL_API}/getTypeOfMaintenanceItem`
    return this.http.get<TypeOfMaintenanceItem[]>(urlTypeOfItem).toPromise()
  }

  getPricesByDealer(pDealer_id: number): Observable<PricesByDealer> {
    const urlGetPrices = `${this.URL_API}/GetPricesByDealer?pDealer_id=${pDealer_id}`
    return this.http.get<PricesByDealer>(urlGetPrices)
  }

  async setPricesByDealer(
    pricesByDealer: PricesByDealer
  ): Promise<ResponseApi> {
    const urlSetPrices = `${this.URL_API}/SetPricesByDealer`
    return this.http
      .post<ResponseApi>(urlSetPrices, pricesByDealer, this.HttpOptions)
      .toPromise()
  }

  insert(pItem: MaintenanceItem): Observable<ResponseApi> {
    const urlInsert = `${this.URL_API}/Insert`
    return this.http.post<ResponseApi>(urlInsert, pItem, this.HttpOptions)
  }

  async getPricesByContract(pContract_id: number): Promise<PricesByContract> {
    const urlGetPrices = `${this.URL_API}/GetPricesByContract?pContract_id=${pContract_id}`
    return this.http.get<PricesByContract>(urlGetPrices).toPromise()
  }

  async setPricesByContract(
    pricesByContract: PricesByContract
  ): Promise<ResponseApi> {
    const urlSetPrices = `${this.URL_API}/SetPricesByContract`
    return this.http
      .post<ResponseApi>(urlSetPrices, pricesByContract, this.HttpOptions)
      .toPromise()
  }

  async getTaxesList(): Promise<Tax[]> {
    const urlListTaxes = `${this.URL_API}/GetTaxesList`
    return this.http.get<Tax[]>(urlListTaxes).toPromise()
  }

  update(pItem: MaintenanceItem): Observable<ResponseApi> {
    const urlUpdate = `${this.URL_API}/Update`
    return this.http.put<ResponseApi>(urlUpdate, pItem, this.HttpOptions)
  }

  delete(pItem: MaintenanceItem): Observable<ResponseApi> {
    const urlDelete = `${this.URL_API}/Delete?maintenanceItemId=${pItem.id}`
    return this.http.delete<ResponseApi>(urlDelete, this.HttpOptions)
  }

  calculateTaxes(referencePriceWithoutDiscount: number, lsTaxes: Tax[]) {
    let totalTaxes = 0
    if (lsTaxes.length > 0) {
      for (const tax of lsTaxes) {
        totalTaxes += Math.round(
          referencePriceWithoutDiscount * (tax.percentValue / 100)
        )
      }
    }
    return totalTaxes
  }

  calculateTotalByItem(
    referencePrice: number,
    discount: number,
    taxesValue: number
  ) {
    return Math.round(referencePrice - discount + taxesValue)
  }
}
