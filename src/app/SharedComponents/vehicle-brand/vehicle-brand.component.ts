import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'
import { Brand } from 'src/app/Models/Brand'
import { VehicleService } from '../../Modules/client/Services/Vehicle/vehicle.service'

@Component({
  selector: 'app-vehicle-brand',
  templateUrl: './vehicle-brand.component.html',
  styleUrls: ['./vehicle-brand.component.scss'],
})
export class VehicleBrandComponent implements OnInit {
  frmBrand: FormGroup
  lsBrand: Brand[]
  oBrand: Brand

  @Output() vehicleBrandWasSetted = new EventEmitter<boolean>()
  @Input() defaultBrandId = 0

  brandSelected: Brand = null
  @Input('brand')
  set setBrandSelected(brand: Brand) {
    this.brandSelected = brand
    this.setDataInForm(this.brandSelected)
  }

  disableControls: boolean
  @Input('disableControls')
  set setDisableControls(value: boolean) {
    this.disableControls = value
    if (this.disableControls) {
      this.frmBrand.disable()
    } else {
      this.frmBrand.enable()
    }
  }

  @Output() onBrandWasSelected = new EventEmitter<Brand>()

  constructor(private vehicleService: VehicleService) {
    this.frmBrand = new FormGroup({
      cmbBrand: new FormControl('Seleccione ...'),
    })
  }

  ngOnInit(): void {
    this.initComponents()
  }

  async initComponents() {
    try {
      this.vehicleService.getBrands().subscribe((brands) => {
        this.lsBrand = brands

        if (this.defaultBrandId !== 0) {
          this.frmBrand.controls.cmbBrand.setValue(this.defaultBrandId)
        } else {
          this.frmBrand.controls.cmbBrand.setValue(0)
        }
      })
    } catch (error) {
      console.error(error.Message)
    }
  }

  setBrand(event: any) {
    const oBrand = this.lsBrand.find((br) => br.id == event.value)
    this.vehicleService.setBrandSelected(oBrand)
    this.vehicleBrandWasSetted.emit(true)
    this.onBrandWasSelected.emit(oBrand)
  }

  setDataInForm(pBrand: Brand) {
    if (pBrand) {
      this.frmBrand.controls.cmbBrand.setValue(pBrand.id)
    } else {
      this.frmBrand.controls.cmbBrand.setValue(0)
    }
  }

  clearDataForm() {
    const defaultValue = this.defaultBrandId !== 0 ? this.defaultBrandId : 0
    this.frmBrand.controls.cmbBrand.setValue(defaultValue)
    if (defaultValue !== 0) {
      const oBrand = this.lsBrand.find((br) => br.id == defaultValue)
      this.vehicleBrandWasSetted.emit(true)
    }
  }
}
