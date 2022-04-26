import { Component, Input, OnInit, SimpleChanges } from '@angular/core'
import { Client } from 'src/app/Models/Client'
import { Vehicle } from 'src/app/Models/Vehicle'
import { VehicleModel } from 'src/app/Models/VehicleModel'
import { VehicleService } from '../../../client/Services/Vehicle/vehicle.service'
import { Contract } from 'src/app/Models/Contract'
import { ContractStateService } from '../../Services/contract-state.service'
import { BehaviorSubject } from 'rxjs'
import { IVehicleStatus } from 'src/app/Models/IVehicleStatus'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-tbl-check-vehicles',
  templateUrl: './tbl-check-vehicles.component.html',
  styleUrls: [
    './tbl-check-vehicles.component.scss',
    '../../../../../assets/styles/checkbox.scss',
  ],
})
export class TblCheckVehiclesComponent implements OnInit {
  lsVehiclesSelected: Vehicle[] = []

  lsVehicles: IVehicleStatus[] = []
  vehiclesObserver = new BehaviorSubject<IVehicleStatus[]>([])
  vehicles$ = this.vehiclesObserver.asObservable()

  clientToFilter: Client | undefined = undefined
  @Input('clientToFilter')
  set setClientToFilter(client: Client) {
    this.clientToFilter = client
  }

  _vehicleModels: VehicleModel[] = []
  @Input('vehicleModels')
  set setVehicleModels(models: VehicleModel[]) {
    this._vehicleModels = models
    console.log(`Models to filter`)
    console.log(this._vehicleModels)
    this.setModelsString(this._vehicleModels)
    this.getVehicles()
  }

  _amountAllowed: number = 0
  @Input('amountAllowed')
  set setAmountAllowed(amount: number) {
    this._amountAllowed = amount
  }

  contractToFilter: Contract | undefined = undefined
  @Input('contractToFilter')
  set setContractToFilter(contract: Contract) {
    this.contractToFilter = contract
  }

  disableChecks: boolean = false
  @Input('disableChecks')
  set setDisableChecks(value: boolean) {
    this.disableChecks = value
  }

  sModels: string
  lsVehiclesEmty: boolean

  constructor(
    private vehicleService: VehicleService,
    private contractStateService: ContractStateService
  ) {
    this.clientToFilter = null
    this.sModels = ''
    this.disableChecks = false

    this.contractStateService.client$.subscribe((client) => {
      this.clientToFilter = client
    })

    this.vehicles$.subscribe((vehicles) => {
      this.lsVehicles = vehicles
    })

    this.contractStateService.vehicleModel$.subscribe(
      (vehicleModelsToFilter) => {
        //console.log(vehicleModelsToFilter)
        try {
          this.setModelsString(vehicleModelsToFilter)
          this.getVehicles()
        } catch (error) {
          console.info(error)
        }
      }
    )
  }

  updateVehiclesSelected() {
    this.contractStateService.vehicles$.subscribe((vehicles) => {
      this.lsVehiclesSelected = vehicles

      this.lsVehiclesSelected.forEach((veh) => {
        this.updateVehicleStatus(veh, true)
      })
    })
  }

  ngOnInit(): void {
    this.initComponents()
  }

  initComponents() {
    this.getVehicles()
  }

  setModelsString(modelsToFilter: VehicleModel[]) {
    try {
      this.sModels = ''
      if (modelsToFilter != null && modelsToFilter != undefined) {
        modelsToFilter.forEach((vm) => (this.sModels += `${vm.id},`))
        this.sModels = this.sModels.substring(0, this.sModels.length - 1)
        if (this.sModels == '') {
          this.sModels = '0'
        }
      }
    } catch (error) {
      console.warn(error)
    }
  }

  getVehicles() {
    if (
      this.clientToFilter != null &&
      this.clientToFilter != undefined &&
      this.sModels != ''
    ) {
      const contract_id =
        this.contractToFilter != null && this.contractToFilter != undefined
          ? this.contractToFilter.id
          : 0

      this.vehicleService
        .getVehiclesByClientAndModel(
          this.clientToFilter.id,
          this.sModels,
          contract_id
        )
        .subscribe({
          next: (vehiclesData) => {
            if (vehiclesData.length > 0) {
              let vehStatus = vehiclesData.map((vh) => {
                return { vehicle: vh, status: false }
              })

              this.vehiclesObserver.next(vehStatus)

              this.updateVehiclesSelected()
            }
          },
        })
    } else {
      this.lsVehicles = []
    }
  }

  setVehicleToContract(isToAdd: boolean, vehicle: Vehicle) {
    if (isToAdd) {
      this.contractStateService.addVehicleToList(vehicle)
    } else {
      this.contractStateService.removeVehicleFromList(vehicle)
    }
  }

  updateVehicleStatus(vehicle: Vehicle, isChecked: boolean) {
    try {
      const vhStaus = this.lsVehicles

      const indexItem = vhStaus.findIndex((vhs) => vehicle.id == vhs.vehicle.id)

      if (indexItem >= 0) {
        vhStaus[indexItem].status = isChecked
      }

      this.vehiclesObserver.next(vhStaus)
    } catch (error) {
      console.info(error)
    }
  }
}
