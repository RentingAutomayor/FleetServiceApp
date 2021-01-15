import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Brand } from '../../../../Models/Brand';
import { VehicleType } from '../../../../Models/VehicleType';
import { VehicleModel } from '../../../../Models/VehicleModel';
import { VehicleState } from '../../../../Models/VehicleState';
import { ResponseApi } from '../../../../Models/ResponseAPI';
import { Vehicle } from '../../../../Models/Vehicle';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private URL_API = "/API_FleetService/api/Vehicle";
  private brandSelected: Brand;
  private vehicleTypeSelected: VehicleType;
  private lsVehicleTypeSelected: VehicleType[];
  private vehicleModelSelected: VehicleModel;
  private lsVehicleModelsSelected: VehicleModel[];
  private lsVehiclesSelected: Vehicle[];

  private vehicleState: VehicleState;
  private vehicle: Vehicle;
  private vehicleToUpdate: Vehicle;
  private HttpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(
    private http: HttpClient
  ) {
  }


  async getBrands(): Promise<Brand[]> {
    let urlGetBrands = `${this.URL_API}/GetBrands`;
    return this.http.get<Brand[]>(urlGetBrands).toPromise();
  }

  async getVehicleTypes(): Promise<VehicleType[]> {
    let urlGetVehicleTypes = `${this.URL_API}/GetVehicleType`;
    return this.http.get<VehicleType[]>(urlGetVehicleTypes).toPromise();
  }

  async getVehicleStates(): Promise<VehicleState[]> {
    let urlGetVehicleStates = `${this.URL_API}/GetVehicleStates`;
    return this.http.get<VehicleState[]>(urlGetVehicleStates).toPromise();
  }

  async getVehicleModelByBrandAndType(pId_brand: number, pId_VehicleType: number): Promise<VehicleModel[]> {
    let urlGetVehicleModelByBrandAndType = `${this.URL_API}/GetVehicleModelByBrandAndType?pId_brand=${pId_brand}&pId_VehicleType=${pId_VehicleType}`;
    return this.http.get<VehicleModel[]>(urlGetVehicleModelByBrandAndType).toPromise();
  }

  async getVehicleModelByTypes(pLstypes: VehicleType[]): Promise<VehicleModel[]> {
    let sTypes = '';
    pLstypes.forEach(tp => sTypes+=`${tp.id},`);
    sTypes = sTypes.substr(0,sTypes.length - 1);
    let urlGetVehicleModelByTypes = `${this.URL_API}/GetVehicleModelsByTypes?sLsTypes=${sTypes}`;    
    return this.http.get<VehicleModel[]>(urlGetVehicleModelByTypes).toPromise();
  }

  async getVehiclesByClient(pClient_id: number): Promise<Vehicle[]> {
    let urlGetVehiclesByClient = `${this.URL_API}/GetVehiclesByClient?pClient_id=${pClient_id}`;
    return this.http.get<Vehicle[]>(urlGetVehiclesByClient).toPromise();
  }

  async getVehiclesByClientAndModel(pClient_id: number,sModels:string): Promise<Vehicle[]>{  
    let urlVehiclesByClientAndModel = `${this.URL_API}/GetVehiclesByClientAndModel?pClient_id=${pClient_id}&sModels=${sModels}`;
    return this.http.get<Vehicle[]>(urlVehiclesByClientAndModel).toPromise();     
  }

  async Insert(pVehicle: Vehicle): Promise<ResponseApi> {
    let urlInsertVehicle = `${this.URL_API}/Insert`;
    return this.http.post<ResponseApi>(urlInsertVehicle, pVehicle, this.HttpOptions).toPromise();
  }

  async Update(pVehicle: Vehicle): Promise<ResponseApi> {
    let urlUpdateVehicle = `${this.URL_API}/Update`;
    return this.http.post<ResponseApi>(urlUpdateVehicle, pVehicle, this.HttpOptions).toPromise();
  }

  async Delete(pVehicle: Vehicle): Promise<ResponseApi> {
    let urlDeleteVehicle = `${this.URL_API}/Delete`;
    return this.http.post<ResponseApi>(urlDeleteVehicle, pVehicle, this.HttpOptions).toPromise();
  }


  getVehiclesByLicensePlate(licensePlate:string): Observable<Vehicle[]>{
    if (!licensePlate.trim()) {
      return of([]);
    }
    let urlGetVehiclesByLicensePlate = `${this.URL_API}/GetVehiclesByLicensePlate?pLicensePlate=${licensePlate}`;

    return this.http.get<Vehicle[]>(urlGetVehiclesByLicensePlate)
      .pipe(
        catchError(this.handleError<Vehicle[]>('getVehiclesByLicensePlate', []))
      );
  }

  setListVehicleTypeSelected(pLsTypes: VehicleType[]) {
    this.lsVehicleTypeSelected = pLsTypes;
  }

  getListVehicleTypeSelected():VehicleType[]{
    return this.lsVehicleTypeSelected;
  }


  setVehicleModelSelected(pVehicleModel: VehicleModel) {
    this.vehicleModelSelected = pVehicleModel;
  }

  getVehicleModelSelected(): VehicleModel {
    return this.vehicleModelSelected;
  }

  setVehicleStateSelected(pVehicleState: VehicleState) {
    this.vehicleState = pVehicleState;
  }

  getVehicleStateSelected(): VehicleState {
    return this.vehicleState;
  }

  setVehicle(pVehicle: Vehicle) {
    this.vehicle = pVehicle;
  }

  getVehicle(): Vehicle {
    return this.vehicle;
  }

  setVehicleToUpdate(pVehicle: Vehicle) {
    this.vehicleToUpdate = pVehicle;
  }

  getVehicleToUpdate(): Vehicle {
    return this.vehicleToUpdate;
  }

  setBrandSelected(pBrand: Brand) {
    this.brandSelected = pBrand;
  }

  getBrandSelected(): Brand {
    return this.brandSelected;
  }

  setVehicleTypeSelected(pVehicleType: VehicleType) {
    this.vehicleTypeSelected = pVehicleType;
  }

  getVehicleTypeSelected(): VehicleType {
    return this.vehicleTypeSelected;
  }


  getListVehicleModelsSelected():VehicleModel[]{
    return this.lsVehicleModelsSelected;
  }

  setListVehicleModelsSelected(pLsVehiclesModel: VehicleModel[]){
    this.lsVehicleModelsSelected = pLsVehiclesModel;
  }

  getListVehiclesSelected():Vehicle[]{
    return this.lsVehiclesSelected;
  }

  setListVehiclesSelected(pVehicle: Vehicle[]){
    this.lsVehiclesSelected = pVehicle;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    }
  }


}
