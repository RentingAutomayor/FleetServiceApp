import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Frequency } from '../../../../Models/Frequency'
import { ResponseApi } from '../../../../Models/ResponseApi'
import { MaintenanceRoutine } from '../../../../Models/MaintenanceRoutine'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
@Injectable({
  providedIn: 'root',
})
export class MaintenanceRoutineService {
  private URL_API = `${environment.apiUrl}/MaintenanceRoutine`
  private HttpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  }
  private frecuencySelected: Frequency
  private routine: MaintenanceRoutine
  constructor(private http: HttpClient) {}
  getFrecuencySelected(): Frequency {
    return this.frecuencySelected
  }

  setFrecuencySelected(pFrequency: Frequency) {
    this.frecuencySelected = pFrequency
  }

  getRoutine(): MaintenanceRoutine {
    return this.routine
  }

  setRoutine(pRoutine: MaintenanceRoutine) {
    this.routine = pRoutine
  }

  getFrequency(): Observable<Frequency[]> {
    const urGetFrequency = `${this.URL_API}/GetFrequency`
    return this.http.get<Frequency[]>(urGetFrequency)
  }

  getMaintenanceRoutines(
    vehicleModel_id: number = 0,
    frequency_id: number = 0
  ) {
    const urGetRoutines = `${this.URL_API}/GetMaintenanceRoutines?vehicleModel_id=${vehicleModel_id}&frequency_id=${frequency_id}`
    return this.http.get<MaintenanceRoutine[]>(urGetRoutines)
  }

  getMaintenanceRoutineByID(pRoutine_id: number) {
    const urGetRoutine = `${this.URL_API}/GetMaintenanceRoutineById?pRoutine_id=${pRoutine_id}`
    return this.http.get<MaintenanceRoutine>(urGetRoutine)
  }

  getMaintenanceRoutineByModel(pModel_id: number) {
    const urGetRoutines = `${this.URL_API}/GetMaintenanceRoutineByModelId?model_id=${pModel_id}`
    return this.http.get<MaintenanceRoutine[]>(urGetRoutines)
  }

  async ValidateRoutineAndFrequency(
    vehicleModel_id: number,
    frequency_id: number
  ): Promise<ResponseApi> {
    const urlValidateRoutine = `${this.URL_API}/ValidateRoutineAndFrequency?vehicleModel_id=${vehicleModel_id}&frequency_id=${frequency_id}`
    return this.http.get<ResponseApi>(urlValidateRoutine).toPromise()
  }

  insert(routine: MaintenanceRoutine): Observable<ResponseApi> {
    const urlInsertRoutine = `${this.URL_API}/Insert`
    return this.http.post<ResponseApi>(
      urlInsertRoutine,
      routine,
      this.HttpOptions
    )
  }

  update(routine: MaintenanceRoutine): Observable<ResponseApi> {
    const urlUpdateRoutine = `${this.URL_API}/Update`
    return this.http.put<ResponseApi>(
      urlUpdateRoutine,
      routine,
      this.HttpOptions
    )
  }

  delete(pRoutine: MaintenanceRoutine) {
    const urlDeleteRoutine = `${this.URL_API}/Delete?routineId=${pRoutine.id}`
    return this.http.delete<ResponseApi>(urlDeleteRoutine)
  }
}
