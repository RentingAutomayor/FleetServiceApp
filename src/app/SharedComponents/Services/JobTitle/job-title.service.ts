import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { JobTitle } from '../../../Models/JobTitle';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JobTitleService {
  private URL_API = "/API_FleetService/api/JobTitle/";
  private oJobTitleSelected: JobTitle;
  private oJobTitleInput: JobTitle;
  constructor(
    private http: HttpClient
  ) { }

  getJobTitlesByDescription(description:string):Observable<JobTitle[]>{
    if(!description.trim()){
      return of([]);
    }

    let urlGetJobTitleByDescription = `${this.URL_API}/getJobTitleByDescription?pDescription=${description}`;
    return this.http.get<JobTitle[]>(urlGetJobTitleByDescription).pipe(
      catchError(this.handleError<JobTitle[]>('getJobTitlesByDescription', []))
    );
  }

  setJobTitleSelected(jobTile:JobTitle){
    this.oJobTitleSelected = jobTile;
  }

  getJobTitleSelected():JobTitle{
    return this.oJobTitleSelected;
  }

  setJobTitleByInput(pJobTitle:JobTitle){
    this.oJobTitleInput = pJobTitle;
  }
  
  getJobTitleByInput():JobTitle{
    return this.oJobTitleInput;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    }
  }
}
