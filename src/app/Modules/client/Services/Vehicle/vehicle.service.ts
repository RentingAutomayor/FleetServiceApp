import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Brand } from '../../../../Models/Brand';
import { VehicleType } from '../../../../Models/VehicleType';
import { VehicleModel } from '../../../../Models/VehicleModel';
import { VehicleState } from '../../../../Models/VehicleState';
import { ResponseApi } from '../../../../Models/ResponseApi';
import { Vehicle } from '../../../../Models/Vehicle';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private URL_API = '/API_FleetService/api/Vehicle';
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


  getBrands(): Observable<Brand[]> {
    const urlGetBrands = `${this.URL_API}/GetBrands`;
    return this.http.get<Brand[]>(urlGetBrands);
  }

  getVehicleTypes(): Observable<VehicleType[]> {
    const urlGetVehicleTypes = `${this.URL_API}/GetVehicleType`;
    return this.http.get<VehicleType[]>(urlGetVehicleTypes);
  }

  getVehicleStates(): Observable <VehicleState[]> {
    const urlGetVehicleStates = `${this.URL_API}/GetVehicleStates`;
    return this.http.get<VehicleState[]>(urlGetVehicleStates);
  }

  getVehicleModelByBrandAndType(pId_brand: number, pId_VehicleType: number): Observable<VehicleModel[]> {
    const urlGetVehicleModelByBrandAndType = `${this.URL_API}/GetVehicleModelByBrandAndType?pId_brand=${pId_brand}&pId_VehicleType=${pId_VehicleType}`;
    return this.http.get<VehicleModel[]>(urlGetVehicleModelByBrandAndType);
  }

  async getVehicleModelByTypes(pLstypes: VehicleType[]): Promise<VehicleModel[]> {
    let sTypes = '';
    pLstypes.forEach(tp => sTypes += `${tp.id},`);
    sTypes = sTypes.substr(0, sTypes.length - 1);
    const urlGetVehicleModelByTypes = `${this.URL_API}/GetVehicleModelsByTypes?sLsTypes=${sTypes}`;
    return this.http.get<VehicleModel[]>(urlGetVehicleModelByTypes).toPromise();
  }

  async getVehiclesByClient(pClient_id: number): Promise<Vehicle[]> {
    const urlGetVehiclesByClient = `${this.URL_API}/GetVehiclesByClient?pClient_id=${pClient_id}`;
    return this.http.get<Vehicle[]>(urlGetVehiclesByClient).toPromise();
  }

  async getVehiclesByClientAndModel(pClient_id: number, sModels: string, contract_id: number = 0): Promise<Vehicle[]>{
    const urlVehiclesByClientAndModel = `${this.URL_API}/GetVehiclesByClientAndModel?pClient_id=${pClient_id}&sModels=${sModels}&contract_id=${contract_id}`;
    return this.http.get<Vehicle[]>(urlVehiclesByClientAndModel).toPromise();
  }

  Insert(pVehicle: Vehicle): Observable<Vehicle> {
    const urlInsertVehicle = `${this.URL_API}/Insert`;
    return this.http.post<Vehicle>(urlInsertVehicle, pVehicle, this.HttpOptions);
  }

  Update(pVehicle: Vehicle): Observable<Vehicle> {
    const urlUpdateVehicle = `${this.URL_API}/Update`;
    return this.http.put<Vehicle>(urlUpdateVehicle, pVehicle, this.HttpOptions);
  }

  Delete(pVehicle: Vehicle): Observable<ResponseApi> {
    const urlDeleteVehicle = `${this.URL_API}/Delete?vehicleId=${pVehicle.id}`;
    return this.http.delete<ResponseApi>(urlDeleteVehicle, this.HttpOptions);
  }


  getVehiclesByLicensePlate(licensePlate: string): Observable<Vehicle[]>{
    if (!licensePlate.trim()) {
      return of([]);
    }
    const urlGetVehiclesByLicensePlate = `${this.URL_API}/GetVehiclesByLicensePlate?pLicensePlate=${licensePlate}`;

    return this.http.get<Vehicle[]>(urlGetVehiclesByLicensePlate)
      .pipe(
        catchError(this.handleError<Vehicle[]>('getVehiclesByLicensePlate', []))
      );
  }

  setListVehicleTypeSelected(pLsTypes: VehicleType[]) {
    this.lsVehicleTypeSelected = pLsTypes;
  }

  getListVehicleTypeSelected(): VehicleType[]{
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


  getListVehicleModelsSelected(): VehicleModel[]{
    return this.lsVehicleModelsSelected;
  }

  setListVehicleModelsSelected(pLsVehiclesModel: VehicleModel[]){
    this.lsVehicleModelsSelected = pLsVehiclesModel;
  }

  getListVehiclesSelected(): Vehicle[]{
    return this.lsVehiclesSelected;
  }

  setListVehiclesSelected(pVehicle: Vehicle[]){
    this.lsVehiclesSelected = pVehicle;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }


}
