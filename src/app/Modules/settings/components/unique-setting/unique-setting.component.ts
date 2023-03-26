import { Component, Input } from '@angular/core'
import { ParameterService } from 'src/app/Modules/role/services/parameter.service'
import { AlertService } from 'src/app/services/alert.service'
import { BAD_REQUEST } from 'src/app/Utils/general-error'
import { Excel } from '../../../../Utils/excel'
import { SettingsService } from '../../services/settings.service'

@Component({
  selector: 'app-unique-setting',
  templateUrl: './unique-setting.component.html',
  styleUrls: ['./unique-setting.component.scss'],
})
export class UniqueSettingComponent {
  @Input() item: string = ''

  constructor(
    private _settings: SettingsService,
    private _parameter: ParameterService,
    private _alert: AlertService
  ) {}

  loadData(event): void {
    const file = event.target.files[0]
    Excel.convertExcelToArray(file, (result) => {
      const domain = Domain[this.item]
      const settings = { domain, rows: result }
      this._settings.updateTables(settings).subscribe(
        () => {
          if (domain == Domain.Marcas) this.getBrands()
          else this.getTypes()
          this._alert.succes(`${this.item} cargados con exito`)
        },
        () => this._alert.error(BAD_REQUEST)
      )
    })
  }

  getBrands(): void {
    this._parameter.getBrands().subscribe(
      (brands) => {
        this._settings.brands.next(brands)
      },
      () => this._alert.error(BAD_REQUEST)
    )
  }
  getTypes(): void {
    this._parameter.getVehiculeType().subscribe(
      (types) => {
        this._settings.types.next(types)
      },
      () => this._alert.error(BAD_REQUEST)
    )
  }
}

enum Domain {
  Marcas = 'brands',
  Tipos = 'types',
}
