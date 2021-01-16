import { HttpHeaders,HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Movement } from '../../../../Models/Movement';
import { MovementType } from '../../../../Models/MovementType';
import { ResponseApi } from '../../../../Models/ResponseApi';

@Injectable({
  providedIn: 'root'
})
export class MovementService {
  private URL_API =  "/API_FleetService/api/Movement";
  private  HttpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private movementTypeSelected: MovementType;
  private movementToUpdate:Movement;

  constructor(
    private http : HttpClient
  ) { 

  }

  getMovementTypeSelected():MovementType{
    return this.movementTypeSelected;
  }

  setMovementTypeSelected(pMovementType:MovementType){
    this.movementTypeSelected = pMovementType;
  }

  getMovementToUpdate():Movement{
    return this.movementToUpdate;
  }

  setMovementToUpdate(pMovement:Movement){
    this.movementToUpdate = pMovement;
  }

  async getMovementTypes():Promise<MovementType[]>{
    let urlGetTypes = `${this.URL_API}/GetTypes`;
    return this.http.get<MovementType[]>(urlGetTypes).toPromise();
  }

  async getMovements():Promise<Movement[]>{
    let urlGetMovements = `${this.URL_API}/Get`;
    return this.http.get<Movement[]>(urlGetMovements).toPromise();
  }


  async getMovementById(pMovement_id):Promise<Movement>{
    let urlGetMovementById = `${this.URL_API}/GetById?pMovement_id=${pMovement_id}`;
    return this.http.get<Movement>(urlGetMovementById).toPromise();
  }

  async insert(pMovement:Movement):Promise<ResponseApi>{
    let urlInsert = `${this.URL_API}/Insert`;
    return this.http.post<ResponseApi>(urlInsert,pMovement,this.HttpOptions).toPromise();
  }

  async update(pMovement:Movement):Promise<ResponseApi>{
    let urlUpdate = `${this.URL_API}/Update`;
    return this.http.post<ResponseApi>(urlUpdate,pMovement,this.HttpOptions).toPromise();
  }

  async delete(pMovement:Movement):Promise<ResponseApi>{
    let urlDelete = `${this.URL_API}/Delete`;
    return this.http.post<ResponseApi>(urlDelete,pMovement,this.HttpOptions).toPromise();
  }
}
