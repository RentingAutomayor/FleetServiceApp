import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ParameterService } from 'src/app/Modules/role/services/parameter.service'
import { Basic } from 'src/app/Modules/user/models/basic'
import { AlertService } from 'src/app/services/alert.service'
import { Excel } from 'src/app/Utils/excel'
import { BAD_REQUEST } from 'src/app/Utils/general-error'
import { SettingsService } from '../../services/settings.service'

@Component({
  selector: 'app-vehicule-model',
  templateUrl: './vehicule-model.component.html',
  styleUrls: ['./vehicule-model.component.scss'],
})
export class VehiculeModelComponent implements OnInit {
  modelsForm!: FormGroup
  brands: Basic[] = []
  types: Basic[] = []
  constructor(
    private _parameter: ParameterService,
    private _alert: AlertService,
    private _settings: SettingsService,
    private fb: FormBuilder
  ) {
    this.initForm()
  }

  initForm(): void {
    this.modelsForm = this.fb.group({
      brandId: ['', Validators.required],
      typeId: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.getFilters()
  }

  getFilters(): void {
    this._settings.brands.subscribe((brands) => (this.brands = brands))
    this._settings.types.subscribe((types) => (this.types = types))
  }

  search(): void {
    const { brandId, typeId } = this.modelsForm.value
    this._parameter.getVehiculeModel(brandId, typeId).subscribe(
      (models) => {
        this._settings.models.next(models)
      },
      () => this._alert.error(BAD_REQUEST)
    )
  }

  loadData(event): void {
    const file = event.target.files[0]
    Excel.convertExcelToArray(file, (result) => {
      const settings = {
        domain: 'models',
        rows: result,
        ...this.modelsForm.value,
      }
      this._settings.updateTables(settings).subscribe(
        () => {
          this._alert.succes('Modelos cargados con exito')
          this.search()
        },
        () => this._alert.error(BAD_REQUEST)
      )
    })
  }
}
