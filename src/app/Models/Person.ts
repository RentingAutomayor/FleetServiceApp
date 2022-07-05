import { City } from './City'
import { IContactType } from './IContactType'
import { JobTitle } from './JobTitle'

export interface Person {
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
  types?: IContactType[] | undefined
  mustNotify?: boolean | undefined
}
