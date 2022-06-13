import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { User } from '../models/user'
// import { AngularFireAuth } from '@angular/fire/compat/auth'
// import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

@Injectable()
export class UserService {
  URL_API = '/API_FleetService/api/auth'

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<User[]>(`${this.URL_API}/GetAll`)
  }

  getById(userId: number) {
    return this.http.get<User>(`${this.URL_API}/GetById/${userId}`)
  }

  save(user: User) {
    return this.http.post(`${this.URL_API}/Save`, user)
  }

  update(user: User) {
    return this.http.put(`${this.URL_API}/Update`, user)
  }

  deleteById(userId: number) {
    return this.http.delete(`${this.URL_API}/DeleteById/${userId}`)
  }

//   create(user: User) {
//     const auth = getAuth()
//     return createUserWithEmailAndPassword(
//       auth,
//       `${user.userName}@gmail.com`,
//       user.password
//     )
//   }
}
