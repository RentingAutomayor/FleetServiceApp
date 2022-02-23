import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core'
import { Brand } from 'src/app/Models/Brand'
import { VehicleModel } from 'src/app/Models/VehicleModel'
import { VehicleType } from 'src/app/Models/VehicleType'
import { VehicleService } from '../../Modules/client/Services/Vehicle/vehicle.service'
import { FormGroup, FormControl } from '@angular/forms'
import { Vehicle } from 'src/app/Models/Vehicle'
@Component({
  selector: 'app-vehicle-model',
  templateUrl: './vehicle-model.component.html',
  styleUrls: ['./vehicle-model.component.scss'],
})
export class VehicleModelComponent implements OnInit {
  lsVehicleModel: VehicleModel[] = []
  lsVehicleModelFiltered: VehicleModel[] = []
  frmVehicleModel: FormGroup
  @Output() VehicleModelWasSelected = new EventEmitter<VehicleModel>()

  disableControls: boolean
  @Input('disableControls')
  set setDisableControls(value: boolean) {
    this.disableControls = value
    if (this.disableControls) {
      this.frmVehicleModel.disable()
    } else {
      this.frmVehicleModel.enable()
    }
  }

  vehicleModelSelected: VehicleModel = null
  @Input('vehicleModel')
  set setVehicleModelSelected(vehicleModel: VehicleModel) {
    this.vehicleModelSelected = vehicleModel
    this.setDataInFields(this.vehicleModelSelected)
  }

  brandSelected: Brand = null
  @Input('brand')
  set setBrandSelected(brand: Brand) {
    this.brandSelected = brand
    if (!this.vehicleModelSelected) {
      this.filterVehicleModels(this.brandSelected, this.vehicleTypeSelected)
    }
    this.setDataInFields(this.vehicleModelSelected)
  }

  vehicleTypeSelected: VehicleType = null
  @Input('vehicleType')
  set setVehicleType(type: VehicleType) {
    this.vehicleTypeSelected = type
    if (!this.vehicleModelSelected) {
      this.filterVehicleModels(this.brandSelected, this.vehicleTypeSelected)
    }
    this.setDataInFields(this.vehicleModelSelected)
  }

  constructor(private vehicleService: VehicleService) {
    this.frmVehicleModel = new FormGroup({
      cmbVehicleModel: new FormControl('Seleccione ...'),
    })
  }

  ngOnInit(): void {
    this.initComponents()
  }

  initComponents(): void {
    this.getDataToLists(0, 0)
  }

  getDataToLists(brandId: number, typeId: number): void {
    try {
      this.vehicleService
        .getVehicleModelByBrandAndType(brandId, typeId)
        .subscribe((vehicleModels) => {
          this.lsVehicleModel = vehicleModels
          this.lsVehicleModelFiltered = vehicleModels
        })
    } catch (error) {
      console.error(error)
    }
  }

  filterVehicleModels(pBrand: Brand, pVehicleType: VehicleType): void {
    const idBrand = pBrand ? pBrand.id : 0
    const idType = pVehicleType ? pVehicleType.id : 0

    if (idBrand != 0 && idType != 0) {
      this.lsVehicleModelFiltered = this.lsVehicleModel.filter((model) => {
        return model.brand.id == idBrand && model.type.id == idType
      })
    } else {
      this.lsVehicleModelFiltered = this.lsVehicleModel
    }
  }

  setVehicleModel(event: any): void {
    const vehicleModel = this.lsVehicleModel.find((vm) => vm.id == event.value)
    if (vehicleModel != null) {
      this.VehicleModelWasSelected.emit(vehicleModel)
    } else {
      this.VehicleModelWasSelected.emit(null)
    }
  }

  setDataInFields(pVehicleModel: VehicleModel): void {
    const { cmbVehicleModel } = this.frmVehicleModel.controls
    if (pVehicleModel) {
      cmbVehicleModel.setValue(pVehicleModel.id)
    } else {
      this.clearDataFields()
    }
  }

  clearDataFields() {
    this.frmVehicleModel.controls.cmbVehicleModel.setValue(0)
  }
}
