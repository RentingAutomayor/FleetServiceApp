import { City } from './City'
import { JobTitle } from './JobTitle'
import { Person } from './Person'

export class Branch implements Person {
  id: number
  document: string
  name: string
  lastname: string
  phone: string
  cellphone: string
  address: string
  email: string
  website: string
  city: City
  jobTitle: JobTitle
  state: boolean
  registrationDate: Date
  updateDate: Date
  deleteDate: Date
  public isMain: boolean
  public Client_id: number
  public Dealer_id: number
}
