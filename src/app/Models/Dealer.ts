import { Branch } from './Branch'
import { Contact } from './Contact'
import { MaintenanceItem } from './MaintenanceItem'
import { Person } from './Person'

export interface Dealer extends Omit<Person, 'lastname' | 'jobTitle'> {
  contacts?: Contact[]
  branches?: Branch[]
  maintenanceItems?: MaintenanceItem[]
}

export interface DealerDTO extends Partial<Dealer> {
  contacts: Contact[]
  branches: Branch[]
}
