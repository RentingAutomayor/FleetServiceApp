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
import { MaintenanceRoutineService } from '../../../items-and-routines/Services/MaintenanceRoutine/maintenance-routine.service'

@Component({
  selector: 'app-routines-by-vehicle-model',
  templateUrl: './routines-by-vehicle-model.component.html',
  styleUrls: ['./routines-by-vehicle-model.component.scss'],
})
export class RoutinesByVehicleModelComponent implements OnInit, OnChanges {
  frmRoutineByVehicleModel: FormGroup
  lsRoutine: MaintenanceRoutine[]
  maintenanceRoutineSelected: MaintenanceRoutine
  @Input() vehicleModel: VehicleModel
  @Input() countChanges: Number
  @Output() routineWasSetted = new EventEmitter<boolean>()

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

  ngOnInit(): void {
    this.initComponents()
  }

  initComponents() {
    this.getListMaintenanceRoutines(this.vehicleModel.id)
  }

  getListMaintenanceRoutines(model_id: number) {
    try {
      this.maintenanceRoutineService
        .getMaintenanceRoutineByModel(model_id)
        .subscribe((data) => {
          this.lsRoutine = data
        })
    } catch (error) {
      console.warn(error)
    }
  }

  setRoutine(event: any) {
    const oRoutine = this.lsRoutine.find((rt) => rt.id == event.value)
    this.maintenanceRoutineService.setRoutine(oRoutine)
    this.routineWasSetted.emit(true)
  }
}
