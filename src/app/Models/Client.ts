import { Person } from './Person'
import { ContractualInformation } from './ContractualInformation'
import { Contact } from './Contact'
import { Branch } from './Branch'
import { Vehicle } from './Vehicle'
import { extend } from 'lodash'
import { City } from './City'
import { JobTitle } from './JobTitle'
import { FinancialInformation } from './FinancialInformation'

export interface Client extends Person, ClientComplement {}

export interface ClientComplement {
  contacts?: Contact[]
  branchs?: Branch[]
  vehicles?: Vehicle[]
  contractualInformation?: ContractualInformation
  financialInformation?: FinancialInformation
}
