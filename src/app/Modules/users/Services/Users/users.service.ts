import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ResponseApi } from '../../../../Models/ResponseApi'
import { User } from '../../../../Models/User'
import { Observable, of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { ActionType } from 'src/app/Models/ActionType'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private URL_API = '/API_FleetService/api/Users/'
  private HttpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  }
  private userToUpdate: User
  private userSelected: User
  private blockFormClient: boolean
  private action: ActionType

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    const urlGetUsers = `${this.URL_API}/Get`
    return this.http.get<User[]>(urlGetUsers)
  }

  async getUserById(pId: number): Promise<User> {
    const urlGetUserById = `${this.URL_API}/GetById?pId=${pId}`
    return this.http.get<User>(urlGetUserById).toPromise()
  }

  async getUserByDocument(pDocument: string): Promise<User> {
    const urlGetUserByDocument = `${this.URL_API}/GetByDocument?pDocument=${pDocument}`
    return this.http.get<User>(urlGetUserByDocument).toPromise()
  }

  getUsersByDescriptions(sDescription: string): Observable<User[]> {
    if (!sDescription.trim()) {
      return of([])
    }
    const urlUsersByDesc = `${this.URL_API}/GetByDescription?sDescription=${sDescription}`
    return this.http
      .get<User[]>(urlUsersByDesc)
      .pipe(
        catchError(this.handleError<User[]>('getClientsByDescriptions', []))
      )
  }

  insertUser(pUser: User): Observable<ResponseApi> {
    const urlInsertUser = `${this.URL_API}/Insert`
    return this.http.post<ResponseApi>(
      urlInsertUser,
      pUser,
      this.HttpOptions
    )
  }

  updateUser(user: User): Observable<ResponseApi> {
    const urlUpdateUser = `${this.URL_API}/Update`
    return this.http.post<ResponseApi>(
      urlUpdateUser,
      user,
      this.HttpOptions
    )
  }

  async deleteUser(pUser: User): Promise<ResponseApi> {
    const urlDeleteUser = `${this.URL_API}/Delete`
    return this.http
      .post<ResponseApi>(urlDeleteUser, pUser, this.HttpOptions)
      .toPromise()
  }

  setUserToUpdate(pUser: User) {
    this.userToUpdate = pUser
  }

  getUserToUpdate(): User {
    return this.userToUpdate
  }

  setUserSelected(pUser: User) {
    this.userSelected = pUser
  }

  getUserSelected(): User {
    return this.userSelected
  }

  getBlockFormClient(): boolean {
    return this.blockFormClient
  }
  setBlockFormClient(value: boolean) {
    this.blockFormClient = value
  }

  getAction(): ActionType {
    return this.action
  }

  setAction(value: ActionType) {
    this.action = value
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error)
      return of(result as T)
    }
  }
}
