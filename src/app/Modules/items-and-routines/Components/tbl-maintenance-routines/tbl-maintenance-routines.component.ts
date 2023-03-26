import { CurrencyPipe } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { Frequency } from 'src/app/Models/Frequency'
import { MaintenanceRoutine } from 'src/app/Models/MaintenanceRoutine'
import { VehicleModel } from 'src/app/Models/VehicleModel'
import { AlertService } from 'src/app/services/alert.service'
import { Excel } from 'src/app/Utils/excel'
import Swal from 'sweetalert2'
import { MaintenanceRoutineService } from '../../Services/MaintenanceRoutine/maintenance-routine.service'

@Component({
  selector: 'app-tbl-maintenance-routines',
  templateUrl: './tbl-maintenance-routines.component.html',
  styleUrls: [
    './tbl-maintenance-routines.component.scss',
    '../../../../../assets/styles/app.scss',
  ],
})
export class TblMaintenanceRoutinesComponent implements OnInit {
  lsMaintenanceRoutines: MaintenanceRoutine[] = []
  lsMaintenanceRoutinesFiltered: MaintenanceRoutine[] = []
  isAwaiting: boolean
  p = 1
  containerTable: HTMLDivElement
  containerFromRoutine: HTMLDivElement
  isToUpdate: boolean
  oCountChanges: number
  frequency_id: number
  vehicleModel_id: number
  disableControls: boolean
  frequencySelected: Frequency = null
  vehicleModelFilterSelected: VehicleModel = null

  vehicleModelIdFiltered: number = 0
  frequencyIdFiltered: number = 0
  isRoutineVisible: boolean = false
  isTableVisible: boolean = true
  maintenanceRoutineSelected: MaintenanceRoutine = null

  isErrorVisible = false
  errorTitle = ''
  errorMessageApi = ''

  constructor(
    private maintenanceRoutineService: MaintenanceRoutineService,
    private currency: CurrencyPipe,
    private _alert: AlertService
  ) {
    this.frequency_id = 0
    this.vehicleModel_id = 0
  }

  ngOnInit(): void {
    this.initComponents()
  }

  initComponents() {
    this.oCountChanges = 0
    this.isAwaiting = false
    this.isToUpdate = false
    this.containerTable = document.querySelector('#container__table')
    this.containerFromRoutine = document.querySelector(
      '#container__maintenanceRoutine'
    )
    this.showTableRoutines()
  }

  showTableRoutines() {
    this.isAwaiting = true

    this.maintenanceRoutineService
      .getMaintenanceRoutines()
      .subscribe((routines) => {
        this.lsMaintenanceRoutines = routines
        this.lsMaintenanceRoutinesFiltered = this.lsMaintenanceRoutines
        this.isAwaiting = false
      })
  }

  insertRoutine() {
    this.disableControls = false
    this.isToUpdate = false
    this.maintenanceRoutineSelected = null
    this.hideTable()
  }

  hideTable() {
    this.isRoutineVisible = true
    this.isTableVisible = false
  }

  showTable() {
    this.isTableVisible = true
    this.isRoutineVisible = false
  }

  saveDataRoutine(routine: MaintenanceRoutine) {
    console.log('saveDataRoutine')
    console.log(routine)
    this.saveDataInDB(routine)
    this.showTable()
  }

  saveDataInDB(routine: MaintenanceRoutine) {
    this.isAwaiting = true
    if (this.isToUpdate) {
      this.maintenanceRoutineService.update(routine).subscribe(
        (rta) => {
          this._alert.succes(rta.message)
          this.isAwaiting = false
          const indexRoutine = this.lsMaintenanceRoutinesFiltered.findIndex(
            (mr) => mr.id == routine.id
          )
          this.lsMaintenanceRoutinesFiltered[indexRoutine] = routine
        },
        (err) => {
          this.isErrorVisible = true
          this.errorTitle =
            'Ocurrió un error intentando Actualizar la rutina de mantenimiento'
          this.errorMessageApi = err.Message
        }
      )
    } else {
      this.maintenanceRoutineService.insert(routine).subscribe(
        (rta) => {
          this._alert.succes(rta.message)
          this.isAwaiting = false
          try {
            this.lsMaintenanceRoutinesFiltered.push(routine)
          } catch {
            this.showTableRoutines()
          }
        },
        (err) => {
          this.isErrorVisible = true
          this.errorTitle =
            'Ocurrió un error intentando Insertar la rutina de mantenimiento'
          this.errorMessageApi = err.Message
        }
      )
    }
    //this.showTableRoutines()
  }

  cancelRoutine() {
    if (
      confirm(
        '¿Está seguro de querer cerrar esta ventana?, al cerrar esta ventana se perdera toda la infromación consignada acá'
      )
    ) {
      this.showTable()
    }
  }

  seeDetailsRoutine(pRoutine: MaintenanceRoutine) {
    this.disableControls = true
    this.isToUpdate = false
    this.isAwaiting = true

    this.maintenanceRoutineService
      .getMaintenanceRoutineByID(pRoutine.id)
      .subscribe((mr) => {
        this.maintenanceRoutineSelected = mr
        this.isAwaiting = false
      })

    this.hideTable()
  }

  updateRoutine(pRoutine: MaintenanceRoutine) {
    this.disableControls = false
    this.isToUpdate = true
    this.isAwaiting = true

    this.maintenanceRoutineService
      .getMaintenanceRoutineByID(pRoutine.id)
      .subscribe((mr) => {
        this.maintenanceRoutineSelected = mr
        this.maintenanceRoutineService.setRoutine(mr)
        this.isAwaiting = false
      })

    this.hideTable()
  }

  deleteRoutine(pRoutine: MaintenanceRoutine) {
    const DELETE_MESSAGE = 'Rutina de mantenimiento eliminada con éxito'
    if (
      confirm('¿Está seguro que desea eliminar esta rutina de mantenimiento?')
    ) {
      this.isAwaiting = true
      this.maintenanceRoutineService.delete(pRoutine).subscribe((rta) => {
        this.isAwaiting = false
        this._alert.succes(DELETE_MESSAGE)
        this.showTableRoutines()
      })
    }
  }

  filterByVehicleModel(vehicleModel: VehicleModel) {
    this.vehicleModelIdFiltered = vehicleModel != null ? vehicleModel.id : 0
    this.vehicleModelFilterSelected = vehicleModel
    this.filterRoutines(this.vehicleModelIdFiltered, this.frequencyIdFiltered)
  }

  filterByFrequency(frequency: Frequency) {
    this.frequencyIdFiltered = frequency != null ? frequency.id : 0
    this.frequencySelected = frequency
    this.filterRoutines(this.vehicleModelIdFiltered, this.frequencyIdFiltered)
  }

  filterRoutines(vehicleModelId, FrequencyId) {
    if (vehicleModelId > 0 && FrequencyId > 0) {
      this.lsMaintenanceRoutinesFiltered = this.lsMaintenanceRoutines.filter(
        (mr) => {
          return (
            mr.frequency.id == FrequencyId &&
            mr.vehicleModel.id == vehicleModelId
          )
        }
      )
    } else {
      if (vehicleModelId == 0 && FrequencyId == 0) {
        this.lsMaintenanceRoutinesFiltered = this.lsMaintenanceRoutines
        this.frequencySelected = null
        this.vehicleModelFilterSelected = null
      } else {
        this.lsMaintenanceRoutinesFiltered = this.lsMaintenanceRoutines.filter(
          (mr) => {
            return (
              mr.vehicleModel.id == vehicleModelId ||
              mr.frequency.id == FrequencyId
            )
          }
        )
      }
    }
  }

  clearFilter() {
    this.frequencySelected = null
    this.vehicleModelFilterSelected = null
    this.filterRoutines(0, 0)
  }

  closeErrorMessage() {
    this.isErrorVisible = false
  }

  downloaExcel(): void {
    const data = this.lsMaintenanceRoutinesFiltered.map((maintenceRoutine) => {
      return {
        Nombre: maintenceRoutine.name,
        Linea: maintenceRoutine.vehicleModel.shortName,
        KilometrajeDeLaRutina: maintenceRoutine.frequency.name,
        PrecioDeLaFrecuenciaConImpuestos: this.currency.transform(
          maintenceRoutine.referencePrice
        ),
      }
    })
    Excel.convertArrayToFile(data, 'Rutinas de mantenimiento')
  }
}
