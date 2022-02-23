import { VehicleModel } from './VehicleModel'
import { VehicleState } from './VehicleState'

export class Vehicle {
  public id: number
  public licensePlate: string
  public chasisCode: string
  public vehicleState: VehicleState
  public vehicleModel: VehicleModel
  public year: string
  public mileage: number
  public state: boolean
  public registrationDate: Date
  public Client_id: number
}
