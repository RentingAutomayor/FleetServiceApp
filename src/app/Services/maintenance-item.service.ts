import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { PresentationUnit } from '../Models/PresentationUnit';
import { TypeOfMaintenanceItem } from '../Models/TypeOfMaintenanceItem';
import { MaintenanceItem } from '../Models/MaintenanceItem';
import { ResponseApi } from '../Models/ResponseAPI';
import { Category } from '../Models/Category';
import { PricesByDealer } from '../Models/PricesByDealer';
import { PricesByContract } from '../Models/PricesByContract';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceItemService {
  private URL_API =  "/API_FleetService/api/MaintenanceItem/";
  private  HttpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private presentationUnit:PresentationUnit;
  private typeOfItem: TypeOfMaintenanceItem;
  private item: MaintenanceItem;
  private itemToUpdate: MaintenanceItem;
  private category: Category;
  constructor(
    private http: HttpClient
  ) { }

  getCategorySelected():Category{
    return this.category;
  }

  setCategorySelected(pCategory:Category){
    this.category = pCategory;
  }
  
  getPresentationUnit():PresentationUnit{
    return this.presentationUnit;
  }

  setPresentationUnit(pPresentation:PresentationUnit){
    this.presentationUnit = pPresentation;
  }

  getTypeOfItem():TypeOfMaintenanceItem{
    return this.typeOfItem;
  }

  getItem():MaintenanceItem{
    return this.item;
  }

  setItem(pItem:MaintenanceItem){
    this.item = pItem;
  }

  settypeOfItem(pType: TypeOfMaintenanceItem){
    this.typeOfItem = pType;
  }

  getItemToUpdate():MaintenanceItem{
    return this.itemToUpdate;
  } 

  setItemToUpdate(pItem:MaintenanceItem){
    this.itemToUpdate = pItem;
  }

  async getMaintenanceItems():Promise<MaintenanceItem[]>{
    let urlGetMaintenanceItems = `${this.URL_API}/Get`;
    return this.http.get<MaintenanceItem[]>(urlGetMaintenanceItems).toPromise();
  }

  async getMaintenanceItemById(pId:number):Promise<MaintenanceItem>{
    let urlGetMaintenanceItem = `${this.URL_API}/GetById?itemId=${pId}`;
    return this.http.get<MaintenanceItem>(urlGetMaintenanceItem).toPromise();
  }

  async getMaintenanceItemByType(pTypeId:number):Promise<MaintenanceItem[]>{
    let urlGetMaintenanceItem = `${this.URL_API}/GetByType?typeId=${pTypeId}`;
    return this.http.get<MaintenanceItem[]>(urlGetMaintenanceItem).toPromise();
  }

  async getItemsByVehicleModel(pVehicleModel_id:number):Promise<MaintenanceItem[]>{
    let urlGetMaintenanceItems = `${this.URL_API}/GetItemsByVehicleModel?pVehicleModel_id=${pVehicleModel_id}`;
    return await this.http.get<MaintenanceItem[]>(urlGetMaintenanceItems).toPromise();
  }

  async getPresentationUnits():Promise<PresentationUnit[]>{
    let urlGetPresentationUnits = `${this.URL_API}/GetPresentationUnits`;
    return this.http.get<PresentationUnit[]>(urlGetPresentationUnits).toPromise();
  }

  async getCategories():Promise<Category[]>{
    let urlCategory = `${this.URL_API}/GetCategories`;
    return this.http.get<Category[]>(urlCategory).toPromise();
  }

  async getTypeOfMaintenanceItem():Promise<TypeOfMaintenanceItem[]>{
    let urlTypeOfItem = `${this.URL_API}/getTypeOfMaintenanceItem`;
    return this.http.get<TypeOfMaintenanceItem[]>(urlTypeOfItem).toPromise();
  }

  async getPricesByDealer(pDealer_id:number):Promise<PricesByDealer>{
    let urlGetPrices = `${this.URL_API}/GetPricesByDealer?pDealer_id=${pDealer_id}`;
    return this.http.get<PricesByDealer>(urlGetPrices).toPromise();
  }

  async setPricesByDealer(pricesByDealer:PricesByDealer):Promise<ResponseApi>{
    let urlSetPrices = `${this.URL_API}/SetPricesByDealer`;
    return this.http.post<ResponseApi>(urlSetPrices,pricesByDealer,this.HttpOptions).toPromise();
  }

  async insert(pItem:MaintenanceItem):Promise<ResponseApi>{
    let urlInsert = `${this.URL_API}/Insert`;
    return this.http.post<ResponseApi>(urlInsert,pItem,this.HttpOptions).toPromise();
  }


  async getPricesByContract(pContract_id:number):Promise<PricesByContract>{
    let urlGetPrices = `${this.URL_API}/GetPricesByContract?pContract_id=${pContract_id}`;
    return this.http.get<PricesByContract>(urlGetPrices).toPromise();
  }

  async setPricesByContract(pricesByContract:PricesByContract):Promise<ResponseApi>{
    let urlSetPrices = `${this.URL_API}/SetPricesByContract`;
    return this.http.post<ResponseApi>(urlSetPrices,pricesByContract,this.HttpOptions).toPromise();
  }

  async update(pItem:MaintenanceItem):Promise<ResponseApi>{
    let urlUpdate = `${this.URL_API}/Update`;
    return this.http.post<ResponseApi>(urlUpdate,pItem,this.HttpOptions).toPromise();
  }

  async delete(pItem:MaintenanceItem):Promise<ResponseApi>{
    let urlDelete = `${this.URL_API}/Delete`;
    return this.http.post<ResponseApi>(urlDelete,pItem,this.HttpOptions).toPromise();
  }

}
