import { Client } from './Client'

export class FinancialInformation {
  public id: number
  public client: Client
  public approvedQuota: number
  public consumedQuota: number
  public currentQuota: number
  public inTransitQuota: number
  public state: boolean
  public registrationDate: Date
  public updateDate: Date
}
