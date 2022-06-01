import { Branch } from './Branch'
import { IContactType } from './IContactType'
import { Person } from './Person'

export interface Contact extends Person {
  discountType: any
  branch?: Branch
  mustNotify: boolean
}

export interface CreateContactDTO extends Omit<Contact, 'id'> {
  Client_id?: number
  Dealer_id?: number
}

export interface UpdateContactDTO extends Partial<Contact> {
  Client_id: number
  Dealer_id: number
}
