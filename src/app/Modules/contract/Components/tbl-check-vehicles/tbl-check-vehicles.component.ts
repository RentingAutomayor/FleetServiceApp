import { Component, Input, OnInit, SimpleChanges } from '@angular/core'
import { Client } from 'src/app/Models/Client'
import { Vehicle } from 'src/app/Models/Vehicle'
import { VehicleModel } from 'src/app/Models/VehicleModel'
import { VehicleService } from '../../../client/Services/Vehicle/vehicle.service'
import { ClientService } from 'src/app/Modules/client/Services/Client/client.service'
import { Contract } from 'src/app/Models/Contract'
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
  lsVehicles: Vehicle[]
  lsVehiclesSelected: Vehicle[] = []

  clientToFilter: Client | undefined = undefined
  @Input('clientToFilter')
  set setClientToFilter(client: Client) {
    console.log(`CLIENT TO FILTER`)
    console.log(client)
    this.clientToFilter = client
  }

  _vehicleModels: VehicleModel[] = []
  @Input('vehicleModels')
  set setVehicleModels(models: VehicleModel[]) {
    this._vehicleModels = models
    console.log(this._vehicleModels)
    this.setModelsString(this._vehicleModels)
    this.getVehicles()
  }

  _amountAllowed: number = 0
  @Input('amountAllowed')
  set setAmountAllowed(amount: number) {
    this._amountAllowed = amount
    this.getVehiclesSelected()
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

  constructor(private vehicleService: VehicleService) {
    this.clientToFilter = null
    this.sModels = ''
    this.disableChecks = false
  }

  getVehiclesSelected() {
    this.lsVehiclesSelected = this.vehicleService.getListVehiclesSelected()
    if (
      this.lsVehiclesSelected != null &&
      this.lsVehiclesSelected != undefined
    ) {
      this.checkVehiclesSelected(this.lsVehiclesSelected)
      this.lsVehiclesEmty = false
    } else {
      this.lsVehiclesEmty = true
    }
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   try {
  //     console.log(changes)
  //     //this.vehicleModels = changes['vehicleModels'].currentValue
  //     //console.log(this.vehicleModels)
  //   } catch (error) {
  //     console.log(error)
  //   }

  //   // for (const change in changes) {
  //   //   switch (change) {
  //   //     case 'countChanges':
  //   //       this.sModels = ''
  //   //       this.clientToFilter = this.clientService.getClientSelected()

  //   //       this.lsVehiclesSelected =
  //   //         this.vehicleService.getListVehiclesSelected()
  //   //       if (
  //   //         this.lsVehiclesSelected != null &&
  //   //         this.lsVehiclesSelected != undefined
  //   //       ) {
  //   //         this.checkVehiclesSelected(this.lsVehiclesSelected)
  //   //         this.lsVehiclesEmty = false
  //   //       } else {
  //   //         this.lsVehiclesEmty = true
  //   //       }

  //   //       break
  //   //     case 'amountAllowed':
  //   //       this.lsVehiclesSelected =
  //   //         this.vehicleService.getListVehiclesSelected()
  //   //       if (
  //   //         this.lsVehiclesSelected != null &&
  //   //         this.lsVehiclesSelected != undefined
  //   //       ) {
  //   //         this.checkVehiclesSelected(this.lsVehiclesSelected)
  //   //         this.lsVehiclesEmty = false
  //   //       } else {
  //   //         this.lsVehiclesEmty = true
  //   //       }
  //   //       break
  //   //     case 'contractToFilter':
  //   //       this.lsVehiclesSelected =
  //   //         this.vehicleService.getListVehiclesSelected()
  //   //       if (
  //   //         this.lsVehiclesSelected != null &&
  //   //         this.lsVehiclesSelected != undefined
  //   //       ) {
  //   //         this.checkVehiclesSelected(this.lsVehiclesSelected)
  //   //         this.lsVehiclesEmty = false
  //   //       } else {
  //   //         this.lsVehiclesEmty = true
  //   //       }
  //   //       this.getVehicles()
  //   //       break
  //   //     case 'disableChecks':
  //   //       this.lsVehiclesSelected =
  //   //         this.vehicleService.getListVehiclesSelected()
  //   //       if (
  //   //         this.lsVehiclesSelected != null &&
  //   //         this.lsVehiclesSelected != undefined
  //   //       ) {
  //   //         this.checkVehiclesSelected(this.lsVehiclesSelected)
  //   //         this.lsVehiclesEmty = false
  //   //       } else {
  //   //         this.lsVehiclesEmty = true
  //   //       }
  //   //       this.toggleChecks()
  //   //       break
  //   //   }
  //   // }
  //   // this.getVehicles()
  // }

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
    console.log(`client to filter: `)
    console.log(this.clientToFilter)

    console.log(`contract to filter: `)
    console.log(this.contractToFilter)
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
            this.lsVehicles = vehiclesData

            setTimeout(() => {
              this.toggleChecks()
            }, 800)
          },
        })
    } else {
      this.lsVehicles = []
    }
  }

  getIdChk(idVehicle: number): string {
    return `chk_vehicle_${idVehicle}`
  }

  setVehicleToContract(event: any, pVehicle: Vehicle) {
    if (event.target.checked) {
      if (
        this.lsVehiclesSelected == null &&
        this.lsVehiclesSelected == undefined
      ) {
        this.lsVehiclesSelected = []
      }
      if (this.lsVehiclesSelected.length < this._amountAllowed) {
        this.lsVehiclesSelected.push(pVehicle)
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `No se puede adicionar este vehículo, puesto que el contrato sólo tiene configurado un máximo de ${this._amountAllowed} vehículos`
        })
        event.preventDefault()
      }
    } else {
      const vehicle = this.lsVehiclesSelected.find((vh) => vh.id == pVehicle.id)
      const index = this.lsVehiclesSelected.indexOf(vehicle)
      if (index != -1) {
        this.lsVehiclesSelected.splice(index, 1)
      }
    }
    this.vehicleService.setListVehiclesSelected(this.lsVehiclesSelected)
  }

  checkVehiclesSelected(lsVehicles: Vehicle[]) {
    setTimeout(() => {
      lsVehicles.forEach((vh) => {
        try {
          const idCheck = `#${this.getIdChk(vh.id)}`
          console.warn('[checkVehiclesSelected]', idCheck)
          const vehicleCheckbox: HTMLInputElement =
            document.querySelector(idCheck)
          vehicleCheckbox.checked = true
        } catch (error) {
          console.warn(error)
        }
      })
    }, 1500)
  }

  toggleChecks() {
    try {
      setTimeout(() => {
        this.lsVehicles.forEach((vehicle) => {
          const idCheck = `#${this.getIdChk(vehicle.id)}`
          const vehicleCheckbox: HTMLInputElement =
            document.querySelector(idCheck)
          vehicleCheckbox.disabled = this.disableChecks
        })
      }, 800)
    } catch (error) {
      console.warn('[toggleChecks VEHI]', error)
    }
  }
}
