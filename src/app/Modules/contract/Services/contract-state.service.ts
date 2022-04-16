import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { Client } from 'src/app/Models/Client'
import { Contract } from 'src/app/Models/Contract'
import { Dealer } from 'src/app/Models/Dealer'
import { DiscountType } from 'src/app/Models/DiscountType'
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem'
import { Vehicle } from 'src/app/Models/Vehicle'
import { VehicleModel } from 'src/app/Models/VehicleModel'

@Injectable({
  providedIn: 'root',
})
export class ContractStateService {
  private client: Client | undefined = undefined
  private clientObserver = new BehaviorSubject<Client>(undefined)
  client$ = this.clientObserver.asObservable()

  private dealer: Dealer | undefined = undefined
  private dealerObserver = new BehaviorSubject<Dealer>(undefined)
  dealer$ = this.dealerObserver.asObservable()

  private vehicleModels: VehicleModel[] = []
  private vehicleModelsObserver = new BehaviorSubject<VehicleModel[]>([])
  vehicleModel$ = this.vehicleModelsObserver.asObservable()

  private vehicles: Vehicle[] = []
  private vehiclesObserver = new BehaviorSubject<Vehicle[]>([])
  vehicles$ = this.vehiclesObserver.asObservable()

  private discountType: DiscountType | undefined = undefined
  private discountTypeObserver = new BehaviorSubject<DiscountType>(undefined)
  discountType$ = this.discountTypeObserver.asObservable()

  private discountValue: number = 0
  private discountValueObserver = new BehaviorSubject<number>(0)
  discountValue$ = this.discountValueObserver.asObservable()

  private maintenanceItems: MaintenanceItem[] = []
  private maintenanceItemsObserver = new BehaviorSubject<MaintenanceItem[]>([])
  maintenanceItems$ = this.maintenanceItemsObserver.asObservable()

  addVehicleModelToList(vehicleModel: VehicleModel) {
    const indexModel = this.vehicleModels.findIndex(
      (vm) => vm.id == vehicleModel.id
    )
    if (indexModel >= 0) {
      this.vehicleModels[indexModel] = vehicleModel
    } else {
      this.vehicleModels.push(vehicleModel)
    }

    this.vehicleModelsObserver.next(this.vehicleModels)
  }

  removeVehicleModelFromList(vehicleModel: VehicleModel) {
    const indexModel = this.vehicleModels.findIndex(
      (vm) => vm.id == vehicleModel.id
    )
    if (indexModel >= 0) {
      this.vehicleModels.splice(indexModel, 1)
    }

    this.vehicleModelsObserver.next(this.vehicleModels)
  }

  setClientToContract(client: Client) {
    this.client = client
    console.log(`Client`)
    console.log(this.client)
    this.clientObserver.next(this.client)
  }

  setDealerToContract(dealer: Dealer) {
    this.dealer = dealer
    this.dealerObserver.next(this.dealer)
  }

  addVehicleToList(vehicle: Vehicle) {
    const indexItem = this.vehicles.findIndex((vh) => vh.id == vehicle.id)
    if (indexItem >= 0) {
      this.vehicles[indexItem] = vehicle
    } else {
      this.vehicles.push(vehicle)
    }

    this.vehiclesObserver.next(this.vehicles)
  }

  removeVehicleFromList(vehicle: Vehicle) {
    const indexItem = this.vehicles.findIndex((vh) => vh.id == vehicle.id)
    if (indexItem >= 0) {
      this.vehicles.splice(indexItem, 1)
    }

    this.vehiclesObserver.next(this.vehicles)
  }

  resetVehicleModelList() {
    this.vehicleModelsObserver.next([])
  }

  resetVehicleList() {
    this.vehiclesObserver.next([])
  }

  setDiscountType(type: DiscountType) {
    this.discountType = type
    this.discountTypeObserver.next(this.discountType)
  }

  resetDiscountType() {
    this.discountTypeObserver.next(undefined)
  }

  setDiscountValue(value: number) {
    this.discountValue = value
    this.discountValueObserver.next(this.discountValue)
  }

  resetDiscountValue() {
    this.discountValue = 0
    this.discountValueObserver.next(0)
  }

  setMaintenanceItems(maintenanceItems: MaintenanceItem[]) {
    this.maintenanceItems = maintenanceItems
    this.maintenanceItemsObserver.next(this.maintenanceItems)
  }
}
