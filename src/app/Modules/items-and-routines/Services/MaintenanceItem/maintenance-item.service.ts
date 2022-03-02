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
  private URL_API = '/API_FleetService/api/MaintenanceItem'
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

  getMaintenanceItemById(itemId: number): Observable<MaintenanceItem> {
    const urlGetMaintenanceItem = `${this.URL_API}/GetById?itemId=${itemId}`
    return this.http.get<MaintenanceItem>(urlGetMaintenanceItem)
  }

  getItemsByVehicleModel(pVehicleModel_id: number) {
    const urlGetMaintenanceItems = `${this.URL_API}/GetItemsByVehicleModel?vehicleModel_id=${pVehicleModel_id}`
    return this.http.get<MaintenanceItem[]>(urlGetMaintenanceItems)
  }

  getPresentationUnits(): Observable<PresentationUnit[]> {
    const urlGetPresentationUnits = `${this.URL_API}/GetPresentationUnits`
    return this.http.get<PresentationUnit[]>(urlGetPresentationUnits)
  }

  getCategories(): Observable<Category[]> {
    const urlCategory = `${this.URL_API}/GetCategories`
    return this.http.get<Category[]>(urlCategory)
  }

  getTypeOfMaintenanceItem(): Observable<TypeOfMaintenanceItem[]> {
    const urlTypeOfItem = `${this.URL_API}/getTypeOfMaintenanceItem`
    return this.http.get<TypeOfMaintenanceItem[]>(urlTypeOfItem)
  }

  getPricesByDealer(pDealer_id: number): Observable<PricesByDealer> {
    const urlGetPrices = `${this.URL_API}/GetPricesByDealer?dealer_id=${pDealer_id}`
    return this.http.get<PricesByDealer>(urlGetPrices)
  }

  setPricesByDealer(pricesByDealer: PricesByDealer): Observable<ResponseApi> {
    const urlSetPrices = `${this.URL_API}/SetPricesByDealer`
    return this.http.post<ResponseApi>(
      urlSetPrices,
      pricesByDealer,
      this.HttpOptions
    )
  }

  getPricesByContract(contract_id: number): Observable<PricesByContract> {
    const urlGetPrices = `${this.URL_API}/GetPricesByContract?contract_id=${contract_id}`
    return this.http.get<PricesByContract>(urlGetPrices)
  }

  setPricesByContract(
    pricesByContract: PricesByContract
  ): Observable<ResponseApi> {
    const urlSetPrices = `${this.URL_API}/SetPricesByContract`
    return this.http.post<ResponseApi>(
      urlSetPrices,
      pricesByContract,
      this.HttpOptions
    )
  }

  getTaxesList(): Observable<Tax[]> {
    const urlListTaxes = `${this.URL_API}/GetTaxesList`
    return this.http.get<Tax[]>(urlListTaxes)
  }

  insert(item: MaintenanceItem): Observable<ResponseApi> {
    const urlInsert = `${this.URL_API}/Insert`
    return this.http.post<ResponseApi>(urlInsert, item, this.HttpOptions)
  }

  update(item: MaintenanceItem): Observable<ResponseApi> {
    const urlUpdate = `${this.URL_API}/Update`
    return this.http.put<ResponseApi>(urlUpdate, item, this.HttpOptions)
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

  getItemRAAdministration(): Observable<MaintenanceItem> {
    const typeAdminRA = 3
    const url = `${this.URL_API}/GetByTypeId?typeId=${typeAdminRA}`
    return this.http.get<MaintenanceItem>(url)
  }
}
