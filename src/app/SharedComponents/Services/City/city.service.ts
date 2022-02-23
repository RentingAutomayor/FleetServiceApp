import { Injectable } from '@angular/core'
import { City } from '../../../Models/City'
import { Department } from '../../../Models/Department'
// Imports necesarios para consumos de API
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class CityService {
  private lsDepartment: Department[]
  private lsCities: City[]
  private oSelectedCity: City
  private URL_API = '/API_FleetService/api/City/'
  constructor(private http: HttpClient) {}

  async getDepartments(): Promise<Department[]> {
    const urlDepartment = `${this.URL_API}/GetDepartments`
    return this.http.get<Department[]>(urlDepartment).toPromise()
  }

  async getCitiesByDepartmentId(department_id: number): Promise<City[]> {
    const urlCities = `${this.URL_API}/GetCitiesByDepartmentId?pDepartment_id=${department_id}`
    return this.http.get<City[]>(urlCities).toPromise()
  }

  getCities(): Observable<City[]> {
    const urlCities = `${this.URL_API}/Get`
    return this.http.get<City[]>(urlCities)
  }

  setSelectedCity(pCity: City) {
    this.oSelectedCity = pCity
  }

  getSelectedCity(): City {
    return this.oSelectedCity
  }
}
