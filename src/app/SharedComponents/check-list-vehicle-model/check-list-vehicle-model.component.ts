import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core'
import { VehicleModel } from 'src/app/Models/VehicleModel'
import { VehicleService } from '../../Modules/client/Services/Vehicle/vehicle.service'
import { vehicleTypes } from 'src/app/Models/VehicleTypes'
import { IVehicleModelStatus } from 'src/app/Models/IVehicleModelStatus'
import { BehaviorSubject } from 'rxjs'
import { ContractStateService } from 'src/app/Modules/contract/Services/contract-state.service'

@Component({
  selector: 'app-check-list-vehicle-model',
  templateUrl: './check-list-vehicle-model.component.html',
  styleUrls: [
    './check-list-vehicle-model.component.scss',
    '../../../assets/styles/checkbox.scss',
  ],
})
export class CheckListVehicleModelComponent implements OnInit {
  lsVehicleModels: VehicleModel[] = []

  lsVehicleModeslObserver = new BehaviorSubject<IVehicleModelStatus[]>([])
  lsVehicleModes$ = this.lsVehicleModeslObserver.asObservable()

  lsAllVehicleModelStatus: IVehicleModelStatus[] = []
  lsVehicleModelAutomovil: IVehicleModelStatus[] = []
  lsVehicleModelCamioneta: IVehicleModelStatus[] = []
  lsVehicleModelCarga: IVehicleModelStatus[] = []

  lsCargaModels: VehicleModel[] = []

  @Input() disableChecks: boolean = false

  @Output() onVehicleModelsWasSetted = new EventEmitter<VehicleModel[]>()

  lsVehicleModelsSelected: VehicleModel[] = []
  @Input('lsVehicleModelsSelected')
  set setLsVehicleModelsSelected(vehicleModels: VehicleModel[]) {
    this.lsVehicleModelsSelected =
      vehicleModels != null && vehicleModels != undefined ? vehicleModels : []
  }

  disableControls!: boolean
  @Input('disableControls')
  set setDisableControls(value: boolean) {
    this.disableControls = value
  }

  constructor(
    private vehicleService: VehicleService,
    private contractStateService: ContractStateService
  ) {
    this.contractStateService.vehicleModel$.subscribe((modelsSelected) => {
      this.lsVehicleModelsSelected = modelsSelected
    })

    this.lsVehicleModes$.subscribe((vmStatus) => {
      this.lsAllVehicleModelStatus = vmStatus
      this.splitVehicleModelsByType(vmStatus)
    })
    this.disableChecks = false
  }

  splitVehicleModelsByType(vehicleModelStatus: IVehicleModelStatus[]) {
    vehicleModelStatus.forEach((vms) => {
      let indexItem = -1
      switch (vms.vehicleModel.type.id) {
        case vehicleTypes.AUTOMOVIl:
          indexItem = this.lsVehicleModelAutomovil.findIndex(
            (vmsa) => vmsa.vehicleModel.id == vms.vehicleModel.id
          )
          if (indexItem >= 0) {
            this.lsVehicleModelAutomovil[indexItem] = vms
          } else {
            this.lsVehicleModelAutomovil.push(vms)
          }
          break

        case vehicleTypes.CAMIONETA:
          indexItem = this.lsVehicleModelCamioneta.findIndex(
            (vmsc) => vmsc.vehicleModel.id == vms.vehicleModel.id
          )
          if (indexItem >= 0) {
            this.lsVehicleModelCamioneta[indexItem] = vms
          } else {
            this.lsVehicleModelCamioneta.push(vms)
          }
          break

        case vehicleTypes.CARGA:
          indexItem = this.lsVehicleModelCarga.findIndex(
            (vmscg) => vmscg.vehicleModel.id == vms.vehicleModel.id
          )
          if (indexItem >= 0) {
            this.lsVehicleModelCarga[indexItem] = vms
          } else {
            this.lsVehicleModelCarga.push(vms)
          }
          break
      }
    })
  }

  ngOnInit(): void {
    this.initComponents()
  }

  initComponents() {
    this.getLsVehicleModels()
  }

  getLsVehicleModels() {
    this.vehicleService
      .getVehicleModelByBrandAndType(0, 0)
      .subscribe((vehicleModels) => {
        let vehicleModelStatus: IVehicleModelStatus[] = vehicleModels.map(
          (vm) => {
            return {
              vehicleModel: vm,
              status: false,
            } as IVehicleModelStatus
          }
        )

        this.lsVehicleModeslObserver.next(vehicleModelStatus)

        this.updateVehicleModelsSelected()
      })
  }

  toogleItems(isChecked: boolean, vehicleModel: VehicleModel) {
    if (isChecked) {
      this.contractStateService.addVehicleModelToList(vehicleModel)
    } else {
      this.contractStateService.removeVehicleModelFromList(vehicleModel)
    }
  }

  updateVehicleModelsSelected() {
    let vehicleModelStatus: IVehicleModelStatus[] = this.lsAllVehicleModelStatus
    this.contractStateService.vehicleModel$.subscribe(
      (vehicleModelsSelected) => {
        if (vehicleModelsSelected.length > 0) {
          vehicleModelsSelected.forEach((vm) => {
            //Update status to check input
            vehicleModelStatus = this.updateStatusByModel(
              vehicleModelStatus,
              vm,
              true
            )
          })
        } else {
          this.resetAllStatus()
        }
      }
    )
    this.lsVehicleModeslObserver.next(vehicleModelStatus)
  }

  updateStatusByModel(
    vehicleModelStatus: IVehicleModelStatus[],
    vehicleModel: VehicleModel,
    isChecked: boolean
  ) {
    vehicleModelStatus.find(
      (vms) => vms.vehicleModel.id == vehicleModel.id
    ).status = isChecked
    return vehicleModelStatus
  }

  resetAllStatus() {
    const stateTMP = this.lsAllVehicleModelStatus
    stateTMP.forEach((vms) => {
      this.lsAllVehicleModelStatus = this.updateStatusByModel(
        stateTMP,
        vms.vehicleModel,
        false
      )
    })
    this.lsVehicleModelAutomovil = []
    this.lsVehicleModelCamioneta = []
    this.lsVehicleModelCarga = []
    this.splitVehicleModelsByType(this.lsAllVehicleModelStatus)
  }
}
