import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Frequency } from '../../../../Models/Frequency';
import { ResponseApi } from '../../../../Models/ResponseApi';
import { MaintenanceRoutine } from '../../../../Models/MaintenanceRoutine';
@Injectable({
  providedIn: 'root'
})
export class MaintenanceRoutineService {
  private URL_API = "/API_FleetService/api/MaintenanceRoutine";
  private HttpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private frecuencySelected: Frequency;
  private routine: MaintenanceRoutine;
  constructor(
    private http: HttpClient
  ) {

  }
  getFrecuencySelected(): Frequency {
    return this.frecuencySelected;
  }

  setFrecuencySelected(pFrequency: Frequency) {
    this.frecuencySelected = pFrequency;
  }

  getRoutine(): MaintenanceRoutine {
    return this.routine;
  }

  setRoutine(pRoutine: MaintenanceRoutine) {
    this.routine = pRoutine;
  }

  async getFrequency(): Promise<Frequency[]> {
    let urGetFrequency = `${this.URL_API}/GetFrequency`;
    return this.http.get<Frequency[]>(urGetFrequency).toPromise();
  }

  async getMaintenanceRoutines(vehicleModel_id:number = 0,frequency_id: number = 0): Promise<MaintenanceRoutine[]> {
    let urGetRoutines = `${this.URL_API}/GetMaintenanceRoutines?vehicleModel_id=${vehicleModel_id}&frequency_id=${frequency_id}`;
    return this.http.get<MaintenanceRoutine[]>(urGetRoutines).toPromise();
  }

  async getMaintenanceRoutineByID(pRoutine_id:number): Promise<MaintenanceRoutine> {
    let urGetRoutine = `${this.URL_API}/GetMaintenanceRoutineById?pRoutine_id=${pRoutine_id}`;
    return this.http.get<MaintenanceRoutine>(urGetRoutine).toPromise();
  }

  async getMaintenanceRoutineByModel(pModel_id:number): Promise<MaintenanceRoutine[]> {
    let urGetRoutines = `${this.URL_API}/GetMaintenanceRoutineByModelId?model_id=${pModel_id}`;
    return this.http.get<MaintenanceRoutine[]>(urGetRoutines).toPromise();
  }

  async ValidateRoutineAndFrequency(vehicleModel_id:number,frequency_id:number): Promise<ResponseApi>{
    let urlValidateRoutine = `${this.URL_API}/ValidateRoutineAndFrequency?vehicleModel_id=${vehicleModel_id}&frequency_id=${frequency_id}`;
    return this.http.get<ResponseApi>(urlValidateRoutine).toPromise();
  }

  async insert(pRoutine: MaintenanceRoutine): Promise<ResponseApi> {
    let urlInsertRoutine = `${this.URL_API}/Insert`;
    return this.http.post<ResponseApi>(urlInsertRoutine, pRoutine, this.HttpOptions).toPromise();
  }

  async update(pRoutine: MaintenanceRoutine): Promise<ResponseApi> {
    let urlUpdateRoutine = `${this.URL_API}/Update`;
    return this.http.post<ResponseApi>(urlUpdateRoutine, pRoutine, this.HttpOptions).toPromise();
  }

  async delete(pRoutine: MaintenanceRoutine): Promise<ResponseApi> {
    let urlDeleteRoutine = `${this.URL_API}/Delete`;
    return this.http.post<ResponseApi>(urlDeleteRoutine, pRoutine, this.HttpOptions).toPromise();
  }
}
