import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { File } from '../models/file'

@Injectable({
  providedIn: 'root',
})
export class FileService {
  URL_API = '/API_FleetService/api/file'
  constructor(private http: HttpClient) {}

  save(file: File[]) {
    return this.http.post(`${this.URL_API}/Save`, file)
  }

  getByUser(userId: number) {
    return this.http.get<File[]>(`${this.URL_API}/GetFilesByUser/${userId}`)
  }

  deleteById(fileId: number) {
    return this.http.delete(`${this.URL_API}/DeleteById/${fileId}`)
  }
}
