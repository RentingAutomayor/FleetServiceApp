import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Report } from '../../settings/models/report'
import { Basic } from '../../user/models/basic'
import { Company } from '../../user/models/company'
import { Module } from '../models/module'

@Injectable({ providedIn: 'root' })
export class ParameterService {
  URL_API = '/API_FleetService/api/parameter'
  constructor(private http: HttpClient) {}

  getCompanies() {
    return this.http.get<Company[]>(`${this.URL_API}/GetCompanies`)
  }

  getModules() {
    return this.http.get<Module[]>(`${this.URL_API}/GetModules`)
  }

  getClient() {
    return this.http.get<Basic[]>(`${this.URL_API}/GetClients`)
  }

  getDealer() {
    return this.http.get<Basic[]>(`${this.URL_API}/GetDealers`)
  }

  getBrands() {
    return this.http.get<Basic[]>(`${this.URL_API}/GetBrands`)
  }

  getVehiculeType() {
    return this.http.get<Basic[]>(`${this.URL_API}/GetVehiculeType`)
  }

  getVehiculeModel(brandId: number, typeId: number) {
    return this.http.get<Basic[]>(
      `${this.URL_API}/GetVehiculeModel?brandId=${brandId}&typeId=${typeId}`
    )
  }

  getReportFields() {
    return this.http.get<Basic[]>(`${this.URL_API}/GetReportFields`)
  }

  getFieldByModule(module: string) {
    return this.http.get<Basic[]>(
      `${this.URL_API}/GetFieldsByModule?module=${module}`
    )
  }

  getReports() {
    return this.http.get<Report[]>(`${this.URL_API}/GetReports`)
  }
}
