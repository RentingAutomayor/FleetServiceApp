import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core'
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem'
import { MaintenanceRoutine } from 'src/app/Models/MaintenanceRoutine'
import { VehicleModel } from 'src/app/Models/VehicleModel'
import { MaintenanceItemService } from '../../Services/MaintenanceItem/maintenance-item.service'
import { MaintenanceRoutineService } from '../../Services/MaintenanceRoutine/maintenance-routine.service'
import { VehicleService } from '../../../client/Services/Vehicle/vehicle.service'
import { SharedFunction } from 'src/app/Models/SharedFunctions'
import { Frequency } from 'src/app/Models/Frequency'
import { Brand } from 'src/app/Models/Brand'
import { VehicleType } from 'src/app/Models/VehicleType'
import { BehaviorSubject } from 'rxjs'

@Component({
  selector: 'app-maintenance-routine',
  templateUrl: './maintenance-routine.component.html',
  styleUrls: [
    './maintenance-routine.component.scss',
    '../../../../../assets/styles/app.scss',
  ],
})
export class MaintenanceRoutineComponent implements OnInit {
  frmMaintenanceRoutine: FormGroup

  lsMaintenanceItems: MaintenanceItem[] = []
  lsItemsSelected: MaintenanceItem[] = []

  @Output() routinewasCanceled = new EventEmitter<boolean>()
  @Input() countChanges: number

  sharedFunction: SharedFunction
  frequency_id: number
  vehicleModel_id: number
  routineIsValid: boolean
  msgRoutineDuplicated: string
  initialRoutine: number

  maintenanceRoutineSelected: MaintenanceRoutine = null
  @Input('maintenanceRoutine')
  set setMaintenanceRoutineSelected(mr: MaintenanceRoutine) {
    this.maintenanceRoutineSelected = mr
    if (this.maintenanceRoutineSelected) {
      this.setDataInForm(this.maintenanceRoutineSelected)
      this.brandSelected = mr.vehicleModel.brand
      this.vehicleTypeSelected = mr.vehicleModel.type
      this.vehicleModelSelected = mr.vehicleModel
    } else {
      this.clearDataForm()
      this.brandSelected = null
      this.vehicleTypeSelected = null
      this.vehicleModelSelected = null
    }
  }

  disableControls: boolean
  @Input('disableControls')
  set setDisableControls(value: boolean) {
    this.disableControls = value
    if (this.disableControls) {
      this.frmMaintenanceRoutine.controls.name.disable()
    } else {
      this.frmMaintenanceRoutine.controls.name.enable()
    }
  }

  brandSelected: Brand = null
  vehicleTypeSelected: VehicleType = null
  vehicleModelSelected: VehicleModel = null
  frequencySelected: Frequency = null
  isAwaiting: boolean = false

  get fieldName() {
    return this.frmMaintenanceRoutine.get('name')
  }

  //ft-0202
  itemsWereChanged: BehaviorSubject<MaintenanceItem[]> = new BehaviorSubject<
    MaintenanceItem[]
  >([])
  maintenanceItems$ = this.itemsWereChanged.asObservable()

  totalRoutine: string = '0'

  @Output() routineWasSaved: EventEmitter<MaintenanceRoutine> =
    new EventEmitter<MaintenanceRoutine>()

  constructor(
    private maintenanceItemService: MaintenanceItemService,
    private vehicleService: VehicleService,
    private maintenanceRoutineService: MaintenanceRoutineService,
    private formBuilder: FormBuilder
  ) {
    this.frmMaintenanceRoutine = this.formBuilder.group({
      name: ['', [Validators.required]],
      referencePrice: [''],
    })
    this.sharedFunction = new SharedFunction()
    this.routineIsValid = true
    this.initialRoutine = 0
    this.vehicleModel_id = 0
    this.frequency_id = 0
    this.msgRoutineDuplicated = ''
  }

  ngOnInit(): void {
    this.initComponents()
  }

  initComponents() {
    this.lsMaintenanceItems = []
    this.lsItemsSelected = []
  }

  setDataInForm(pRoutine: MaintenanceRoutine) {
    this.frmMaintenanceRoutine.patchValue(pRoutine)
    this.brandSelected = pRoutine.vehicleModel.brand
    this.vehicleTypeSelected = pRoutine.vehicleModel.type
    this.frequencySelected = pRoutine.frequency
    this.lsItemsSelected = pRoutine.lsItems

    this.totalRoutine = this.sharedFunction.formatNumberToString(
      pRoutine.referencePrice
    )
    this.maintenanceItemService
      .getItemsByVehicleModel(pRoutine.vehicleModel.id)
      .subscribe((data) => {
        this.lsMaintenanceItems = data
      })
  }

  clearDataForm() {
    this.frmMaintenanceRoutine.reset()
    this.brandSelected = null
    this.vehicleTypeSelected = null
    this.frequencySelected = null
    this.lsMaintenanceItems = []
    this.lsItemsSelected = []
    this.totalRoutine = '0'
  }

  setBrand(brand: Brand) {
    this.brandSelected = brand
  }

  setVehiclType(type: VehicleType) {
    this.vehicleTypeSelected = type
  }

  setFrequency(frequency: Frequency) {
    this.frequencySelected = frequency
    if (frequency != null && frequency != undefined) {
      this.frequency_id = frequency.id
    } else {
      this.frequency_id = 0
    }

    if (this.initialRoutine != this.frequency_id) {
      this.validateRoutineAndFrequency(this.vehicleModel_id, this.frequency_id)
    } else {
      this.routineIsValid = true
      this.msgRoutineDuplicated = ''
    }
  }

  setVehicleModel(vehicleModel: VehicleModel) {
    this.vehicleModelSelected = vehicleModel
    if (vehicleModel != null && vehicleModel != undefined) {
      this.vehicleModel_id = vehicleModel.id
    } else {
      this.vehicleModel_id = 0
    }

    this.GetItemsByVehicleModel(this.vehicleModel_id)
    if (this.maintenanceRoutineSelected != null) {
      if (vehicleModel.id != this.maintenanceRoutineSelected.vehicleModel.id) {
        if (
          confirm(
            '¿Está seguro que desea modificar la línea?, al hacer eso perderá todos los cambios registrados hasta el momento'
          )
        ) {
          this.GetItemsByVehicleModel(this.vehicleModel_id)
          this.lsItemsSelected = []
          this.totalRoutine = '0'
        } else {
          this.GetItemsByVehicleModel(this.vehicleModel_id)
        }
      }
    } else {
      this.GetItemsByVehicleModel(this.vehicleModel_id)
    }
    this.GetItemsByVehicleModel(this.vehicleModel_id)
    this.validateRoutineAndFrequency(this.vehicleModel_id, this.frequency_id)
  }

  async validateRoutineAndFrequency(routine_id: number, frequency_id: number) {
    this.maintenanceRoutineService
      .ValidateRoutineAndFrequency(routine_id, frequency_id)
      .then((rta) => {
        this.routineIsValid = rta.response
        this.msgRoutineDuplicated = rta.message
      })
  }

  setItemsToRoutine(itemsSelected: MaintenanceItem[]) {
    this.lsItemsSelected = itemsSelected
  }

  setTotalRoutine(total: number) {
    this.totalRoutine = this.sharedFunction.formatNumberToString(total)
  }

  GetItemsByVehicleModel(vehicleModelId: number) {
    this.isAwaiting = true
    this.maintenanceItemService
      .getItemsByVehicleModel(vehicleModelId)
      .subscribe((maintenanceItems) => {
        this.lsMaintenanceItems = maintenanceItems
        this.itemsWereChanged.next(this.lsMaintenanceItems)
        this.isAwaiting = false
      })
  }

  saveMaintenanceRoutine() {
    try {
      const { name } = this.frmMaintenanceRoutine.controls
      const oMaintenenceRoutine = new MaintenanceRoutine()
      if (this.maintenanceRoutineSelected != null) {
        oMaintenenceRoutine.id = this.maintenanceRoutineSelected.id
      } else {
        oMaintenenceRoutine.id = 0
      }
      oMaintenenceRoutine.name = name.value
      oMaintenenceRoutine.description = name.value
      oMaintenenceRoutine.referencePrice = parseInt(
        this.totalRoutine.replace(/,/g, '')
      )
      oMaintenenceRoutine.vehicleModel = this.vehicleModelSelected
      oMaintenenceRoutine.frequency = this.frequencySelected
      oMaintenenceRoutine.lsItems = this.lsItemsSelected
      this.routineWasSaved.emit(oMaintenenceRoutine)
    } catch (error) {
      console.warn(error)
    }
  }

  cancelRoutine() {
    this.routinewasCanceled.emit(true)
  }
}
