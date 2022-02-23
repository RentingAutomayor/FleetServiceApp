import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { setTime } from 'ngx-bootstrap/chronos/utils/date-setters'
import { MovementType } from 'src/app/Models/MovementType'
import { MovementService } from '../../Services/Movement/movement.service'

@Component({
  selector: 'app-movement-type',
  templateUrl: './movement-type.component.html',
  styleUrls: ['./movement-type.component.scss'],
})
export class MovementTypeComponent implements OnInit, OnChanges {
  lsMovementType: MovementType[]
  frmMovementType: FormGroup
  movementTypeSelected: MovementType
  @Input() countChanges: number

  constructor(private movementService: MovementService) {
    this.frmMovementType = new FormGroup({
      cmbMovementType: new FormControl('Seleccione...'),
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const change in changes) {
      if (change == 'countChanges') {
        this.validateMovementTypeSelected()
      }
    }
  }

  ngOnInit(): void {
    this.initComponents()
  }

  initComponents() {
    this.getMovementTypeList()
  }

  async getMovementTypeList() {
    try {
      this.lsMovementType = await this.movementService.getMovementTypes()
      this.validateMovementTypeSelected()
    } catch (error) {
      console.warn(error)
    }
  }

  validateMovementTypeSelected() {
    this.movementTypeSelected = this.movementService.getMovementTypeSelected()
    if (
      this.movementTypeSelected != null &&
      this.movementTypeSelected != undefined
    ) {
      this.setDataInForm(this.movementTypeSelected)
    } else {
      this.clearDataInForm()
    }
  }

  setMovementType(event: any) {
    const oMovementType = this.lsMovementType.find((mt) => mt.id == event.value)

    this.movementService.setMovementTypeSelected(oMovementType)
  }

  setDataInForm(movementType: MovementType) {
    const { cmbMovementType } = this.frmMovementType.controls

    setTimeout(() => {
      cmbMovementType.setValue(movementType.id)
      this.movementService.setMovementTypeSelected(movementType)
    }, 300)
  }

  clearDataInForm() {
    const { cmbMovementType } = this.frmMovementType.controls
    cmbMovementType.setValue(0)
  }
}
