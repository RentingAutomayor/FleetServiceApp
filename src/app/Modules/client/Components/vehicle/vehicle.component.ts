import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChange,
  SimpleChanges,
} from '@angular/core'
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidatorFn,
  ValidationErrors,
} from '@angular/forms'
import { Vehicle } from 'src/app/Models/Vehicle'
import { VehicleModel } from 'src/app/Models/VehicleModel'
import { VehicleService } from '../../Services/Vehicle/vehicle.service'
import { InputValidator } from 'src/app/Utils/InputValidator'
import { SharedFunction } from 'src/app/Models/SharedFunctions'
import { VehicleState } from 'src/app/Models/VehicleState'
import { Brand } from 'src/app/Models/Brand'
import { VehicleType } from 'src/app/Models/VehicleType'

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss'],
})
export class VehicleComponent implements OnInit {
  frmVehicle: FormGroup
  error: string
  formHasError: boolean
  sharedFunction: SharedFunction
  idTemp: number = 0

  vehicle: Vehicle = null
  @Input('vehicle')
  set setVehicle(vehicle: Vehicle) {
    this.vehicle = vehicle
    this.setDataInForm(this.vehicle)
  }

  isFormBlocked: boolean = false
  @Input('isFormBlocked')
  set setIsFormBlocked(value: boolean) {
    this.isFormBlocked = value
    this.enableOrDisableForm(this.isFormBlocked)
  }

  isToInsert: boolean
  @Input('isToInsert')
  set setIsToInsert(value: boolean) {
    this.isToInsert = value
  }

  vehicleStateSelected: VehicleState = null
  brandSelected: Brand = null
  vehicleTypeSelected: VehicleType = null
  vehicleModelSelected: VehicleModel = null
  initLicensePlate: string = null

  @Output() vehicleWasSaved = new EventEmitter<Vehicle>()
  @Output() vehicleWasCancel = new EventEmitter<boolean>()

  get licensePlateField(): AbstractControl {
    return this.frmVehicle.get('licensePlate')
  }

  get chasisCodeField(): AbstractControl {
    return this.frmVehicle.get('chasisCode')
  }

  get yearField(): AbstractControl {
    return this.frmVehicle.get('year')
  }

  get mileageField(): AbstractControl {
    return this.frmVehicle.get('mileage')
  }

  constructor(
    private formBuilder: FormBuilder,
    private vehicleService: VehicleService
  ) {
    this.buildFormVehicle()
    this.sharedFunction = new SharedFunction()
  }

  buildFormVehicle(): void {
    this.frmVehicle = this.formBuilder.group({
      licensePlate: [
        '',
        [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      ],
      chasisCode: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(17),
        ],
      ],
      year: [''],
      mileage: [''],
    })

    this.configureObservableToLicenseplate()
  }

  ngOnInit(): void {
    this.initComponents()
  }

  getVehicleByLicensePlate(licensePlate: string) {
    console.log(this.initLicensePlate)
    this.vehicleService
      .getVehiclesByLicensePlate(licensePlate)
      .subscribe((vehicles) => {
        console.log(vehicles)
        if (vehicles.length > 0) {
          if (this.isToInsert) {
            this.frmVehicle.controls.licensePlate.setErrors({
              vehicleExists: true,
            })
          } else {
            console.log(
              `${this.initLicensePlate.toUpperCase().trim()} - ${licensePlate
                .toUpperCase()
                .trim()}`
            )
            if (
              this.initLicensePlate.toUpperCase().trim() !=
              licensePlate.toUpperCase().trim()
            ) {
              this.frmVehicle.controls.licensePlate.setErrors({
                vehicleExists: true,
              })
            } else {
              this.frmVehicle.controls.licensePlate.errors.remove(
                'vehicleExists'
              )
            }
          }
        } else {
          this.frmVehicle.controls.licensePlate.errors.remove('vehicleExists')
        }
      })
  }

  enableOrDisableForm(isBlocked: boolean): void {
    if (isBlocked) {
      this.frmVehicle.disable()
    } else {
      this.frmVehicle.enable()
    }
  }

  initComponents(): void {
    this.formHasError = false
    this.error = ''
  }

  setVehicleState(state: VehicleState): void {
    this.vehicleStateSelected = state
  }

  saveVehicle(): void {
    const oVehicle = this.setDataVehicle()
    if (this.isToInsert) {
      oVehicle.id = this.idTemp
      this.idTemp--
    } else {
      oVehicle.id = this.vehicle.id
    }
    this.saveData(oVehicle)
    this.cleanFormData()
  }

  setDataVehicle(): Vehicle {
    const oVehicle = new Vehicle()
    let partialVehicle: Partial<Vehicle>
    partialVehicle = this.frmVehicle.value
    oVehicle.licensePlate = partialVehicle.licensePlate.toUpperCase()
    oVehicle.chasisCode = partialVehicle.chasisCode
    oVehicle.year = partialVehicle.year
    oVehicle.mileage = partialVehicle.mileage
    oVehicle.vehicleState = this.vehicleStateSelected
    oVehicle.vehicleModel = this.vehicleModelSelected
    return oVehicle
  }

  saveData(pVehicle: Vehicle): void {
    this.vehicleWasSaved.emit(pVehicle)
  }

  setDataInForm(vehicle: Vehicle): void {
    this.frmVehicle.patchValue(vehicle)
    this.vehicleStateSelected = vehicle.vehicleState
    this.brandSelected = vehicle.vehicleModel.brand
    this.vehicleTypeSelected = vehicle.vehicleModel.type
    this.vehicleModelSelected = vehicle.vehicleModel
    //this initLicensePlate is to identify if the license plata has changes to avoid
    //ser error of vehicle exists with the same license plate
    this.initLicensePlate = vehicle.licensePlate
  }

  cleanFormData(): void {
    this.frmVehicle.reset()
    this.vehicleStateSelected = null
    this.brandSelected = null
    this.vehicleTypeSelected = null
    this.vehicleModelSelected = null
  }

  setBrand(brand: Brand): void {
    this.brandSelected = brand
  }

  setVehiclType(type: VehicleType): void {
    this.vehicleTypeSelected = type
  }

  setVehicleModel(vehicleModel: VehicleModel): void {
    this.vehicleModelSelected = vehicleModel
  }

  comeBack(): void {
    this.cleanFormData()
    this.vehicleWasCancel.emit(true)
  }

  valitateTyping(event: any, type: string): void {
    InputValidator.validateTyping(event, type)
  }

  configureObservableToLicenseplate() {
    this.frmVehicle.controls.licensePlate.valueChanges.subscribe(
      (licensePlate) => {
        if (licensePlate.length == 6) {
          this.getVehicleByLicensePlate(licensePlate)
        }
      }
    )
  }
}
