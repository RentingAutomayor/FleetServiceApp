import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Company } from "../../user/models/company";
import { Module } from "../models/module";

@Injectable({ providedIn: 'root' })
export class ParameterService{
    URL_API = '/API_FleetService/api/parameter';
    constructor(private http: HttpClient){}

    getCompanies(){
        return this.http.get<Company[]>(`${this.URL_API}/GetCompanies`);
    }

    getModules(){
        return this.http.get<Module[]>(`${this.URL_API}/GetModules`);
    }
}