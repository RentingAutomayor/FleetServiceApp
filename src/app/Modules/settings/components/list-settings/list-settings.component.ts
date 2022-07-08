import { Component, OnInit } from '@angular/core'
import { ParameterService } from 'src/app/Modules/role/services/parameter.service'
import { AlertService } from 'src/app/services/alert.service'
import { SettingsService } from '../../services/settings.service'

@Component({
  selector: 'app-list-settings',
  templateUrl: './list-settings.component.html',
  styleUrls: ['./list-settings.component.scss'],
})
export class ListSettingsComponent implements OnInit {
  constructor(
    private _parameter: ParameterService,
    public _settings: SettingsService,
    private _alert: AlertService
  ) {}

  ngOnInit(): void {
    this.getBrands()
    this.getTypes()
  }

  getBrands(): void {
    this._parameter.getBrands().subscribe(
      (brands) => {
        this._settings.brands.next(brands)
      },
      (badRequest) => this._alert.error(badRequest.error.Message)
    )
  }

  getTypes(): void {
    this._parameter.getVehiculeType().subscribe(
      (types) => {
        this._settings.types.next(types)
      },
      (badRequest) => this._alert.error(badRequest.error.Message)
    )
  }
}
