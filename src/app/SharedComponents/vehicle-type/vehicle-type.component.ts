import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'
import { VehicleType } from 'src/app/Models/VehicleType'
import { VehicleService } from '../../Modules/client/Services/Vehicle/vehicle.service'

@Component({
  selector: 'app-vehicle-type',
  templateUrl: './vehicle-type.component.html',
  styleUrls: ['./vehicle-type.component.scss'],
})
export class VehicleTypeComponent implements OnInit {
  lsVehicleType: VehicleType[]
  frmVehicleType: FormGroup

  disableControls: boolean
  @Input('disableControls')
  set setDisableControls(value: boolean) {
    this.disableControls = value
    if (this.disableControls) {
      this.frmVehicleType.disable()
    } else {
      this.frmVehicleType.enable()
    }
  }

  vehicleTypeSelected: VehicleType = null
  @Input('vehicleType')
  set setVehicleTypeSelected(type: VehicleType) {
    this.vehicleTypeSelected = type
    if (this.vehicleTypeSelected) {
      this.setDataInForm(this.vehicleTypeSelected)
    } else {
      this.clearDataForm()
    }
  }

  @Output() onVehicleTypeWasModified = new EventEmitter<VehicleType>()

  constructor(private vehicleService: VehicleService) {
    this.frmVehicleType = new FormGroup({
      cmbType: new FormControl('Seleccione ...'),
    })
  }

  ngOnInit(): void {
    this.initComponents()
  }

  initComponents(): void {
    try {
      this.clearDataForm()
      this.vehicleService.getVehicleTypes().subscribe((vehicleTypes) => {
        this.lsVehicleType = vehicleTypes
      })
    } catch (error) {
      console.error(error)
    }
  }

  setType(event: any): any {
    const oType = this.lsVehicleType.find((tp) => tp.id == event.value)
    this.onVehicleTypeWasModified.emit(oType)
  }

  setDataInForm(pType: VehicleType): void {
    this.frmVehicleType.controls.cmbType.setValue(pType.id)
  }

  clearDataForm(): void {
    this.frmVehicleType.controls.cmbType.setValue(0)
  }
}
