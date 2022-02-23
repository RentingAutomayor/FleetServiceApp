import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { VehicleService } from '../../Services/Vehicle/vehicle.service'
import { FormGroup, FormControl } from '@angular/forms'
import { VehicleState } from 'src/app/Models/VehicleState'
import { Vehicle } from 'src/app/Models/Vehicle'

@Component({
  selector: 'app-vehicle-state',
  templateUrl: './vehicle-state.component.html',
  styleUrls: ['./vehicle-state.component.scss'],
})
export class VehicleStateComponent implements OnInit {
  lsStates: VehicleState[]
  frmVehicleState: FormGroup

  stateSelected: VehicleState = null
  @Input('state')
  set setSelectedState(state: VehicleState) {
    this.stateSelected = state
    this.setDataInForm(this.stateSelected)
  }

  isFormDisable = false
  @Input('isFormDisable')
  set setIsFormDisable(value: boolean) {
    this.isFormDisable = value
    this.enableOrDisbaleField(this.isFormDisable)
  }

  @Output() onSetState = new EventEmitter<VehicleState>()

  constructor(private vehicleService: VehicleService) {
    this.frmVehicleState = new FormGroup({
      cmbState: new FormControl('Seleccione ...'),
    })
  }

  ngOnInit(): void {
    this.initComponent()
  }

  initComponent(): void {
    this.vehicleService.getVehicleStates().subscribe((states) => {
      this.lsStates = states
    })
  }

  setState(event: any): void {
    // tslint:disable-next-line: triple-equals
    const vehicleState = this.lsStates.find((st) => st.id == event.value)
    this.onSetState.emit(vehicleState)
  }

  setDataInForm(state: VehicleState): void {
    if (state) {
      this.frmVehicleState.controls.cmbState.setValue(state.id)
    } else {
      this.frmVehicleState.controls.cmbState.setValue(0)
    }
  }

  enableOrDisbaleField(isBlocked: boolean): void {
    if (isBlocked) {
      this.frmVehicleState.disable()
    } else {
      this.frmVehicleState.enable()
    }
  }
}
