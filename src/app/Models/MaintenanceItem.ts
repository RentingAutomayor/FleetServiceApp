import { Category } from './Category'
import { Dealer } from './Dealer'
import { PresentationUnit } from './PresentationUnit'
import { Tax } from './Tax'
import { TypeOfMaintenanceItem } from './TypeOfMaintenanceItem'
import { VehicleModel } from './VehicleModel'
import { VehicleType } from './VehicleType'

export class MaintenanceItem {
  public id: number
  public code: string
  public name: string
  public description: string
  public type: TypeOfMaintenanceItem
  public presentationUnit: PresentationUnit
  public category: Category
  public lsVehicleType: VehicleType[]
  public lsVehicleModel: VehicleModel[]
  public referencePrice: number
  public valueWithoutDiscount: number
  public discountValue: number
  public valueWithDiscountWithoutTaxes: number
  public taxesValue: number
  public amount: number
  public state: boolean
  public handleTax: boolean
  public lsTaxes: Tax[]
  public dealer?: Dealer
  public registrationDate: Date
}
