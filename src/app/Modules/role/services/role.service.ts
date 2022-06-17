import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Module } from "../models/module";
import { Role } from "../models/role";

@Injectable({ providedIn: 'root' })
export class RoleService{
    URL_API = '/API_FleetService/api/role';

    constructor(private http: HttpClient){}

    getAll(){
        return this.http.get<Role[]>(`${this.URL_API}/GetAll`);
    }

    getById(roleId: number){
        return this.http.get<Role>(`${this.URL_API}/GetById/${roleId}`);
    }

    getModulesByRoleId(roleId: number){
        return this.http.get<Module[]>(`${this.URL_API}/GetModuleByRole/${roleId}`);
    }

    save(role: Role){
        return this.http.post(`${this.URL_API}/Save`, role);
    }

    update(role: Role){
        return this.http.put(`${this.URL_API}/Update`, role);
    }

    deleteById(roleId: number){
        return this.http.delete(`${this.URL_API}/DeleteById/${roleId}`);
    }
}