import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { MaintenanceRoutine } from 'src/app/Models/MaintenanceRoutine'
import { Vehicle } from 'src/app/Models/Vehicle'
import { VehicleModel } from 'src/app/Models/VehicleModel'
import { TblCheckItemsForRoutineComponent } from 'src/app/SharedComponents/tbl-check-items-for-routine/tbl-check-items-for-routine.component'
import { MaintenanceRoutineService } from '../../../items-and-routines/Services/MaintenanceRoutine/maintenance-routine.service'

@Component({
  selector: 'app-routines-by-vehicle-model',
  templateUrl: './routines-by-vehicle-model.component.html',
  styleUrls: ['./routines-by-vehicle-model.component.scss'],
})
export class RoutinesByVehicleModelComponent implements OnInit, OnChanges {
  frmRoutineByVehicleModel: FormGroup
  lsRoutine: MaintenanceRoutine[] = []
  lsRoutinesFiltered: MaintenanceRoutine[] = []
  maintenanceRoutineSelected: MaintenanceRoutine[] = []

  vehicleModel: VehicleModel = null
  @Input('vehicleModel')
  set setVehicleModel(model: VehicleModel) {
    this.vehicleModel = model
    if (this.vehicleModel) {
      this.getListMaintenanceRoutines(this.vehicleModel.id)
    }
  }

  @Input() countChanges: Number
  @Output() routineWasSetted = new EventEmitter<boolean>()

  areRoutineFiltered: boolean = false
  @Input('areRoutineFiltered')
  set setRoutineFiltered(value: boolean) {
    this.areRoutineFiltered = value
    if (this.areRoutineFiltered) {
      this.lsRoutinesFiltered = this.filterRoutinesWithoutItems(this.lsRoutine)
    }
  }

  @Output()
  onRoutineWasChanged = new EventEmitter<MaintenanceRoutine>()

  constructor(private maintenanceRoutineService: MaintenanceRoutineService) {
    this.frmRoutineByVehicleModel = new FormGroup({
      cmbRoutineByVehicleModel: new FormControl('Seleccione'),
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const change in changes) {
      if (change == 'vehicleModel') {
        if (this.vehicleModel == null) {
          this.frmRoutineByVehicleModel.controls.cmbRoutineByVehicleModel.setValue(
            0
          )
        } else {
          this.getListMaintenanceRoutines(this.vehicleModel.id)
        }
      }
    }
  }

  ngOnInit(): void {}

  getListMaintenanceRoutines(model_id: number) {
    try {
      this.maintenanceRoutineService
        .getMaintenanceRoutineByModel(model_id)
        .subscribe((data) => {
          this.lsRoutine = data
          this.lsRoutinesFiltered = this.lsRoutine

          if (this.areRoutineFiltered) {
            this.lsRoutinesFiltered = this.filterRoutinesWithoutItems(
              this.lsRoutine
            )
          }
        })
    } catch (error) {
      console.warn(error)
    }
  }

  setRoutine(event: any) {
    const oRoutine = this.lsRoutine.find((rt) => rt.id == event.value)
    this.maintenanceRoutineService.setRoutine(oRoutine)
    this.routineWasSetted.emit(true)
    this.onRoutineWasChanged.emit(oRoutine)
  }

  filterRoutinesWithoutItems(
    routines: MaintenanceRoutine[]
  ): MaintenanceRoutine[] {
    let routinesFiltered = []
    if (routines != null) {
      routinesFiltered = routines.filter(
        (routine) => routine.lsItems != null && routine.lsItems.length > 0
      )

      console.log(`filterRoutinesWithoutItems`)
      console.log(routines)

      const CorrectiveRoutine = routines.find(
        (routine) => routine.frequency.id == 21
      )

      if (CorrectiveRoutine != null) {
        routinesFiltered.push(CorrectiveRoutine)
      }
    }

    return routinesFiltered
  }
}
