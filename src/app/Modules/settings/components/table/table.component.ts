import { Component, Input, OnInit } from '@angular/core'
import { AlertService } from 'src/app/services/alert.service'
import { Table } from '../../models/table'
import { SettingsService } from '../../services/settings.service'

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input('item') item: string = ''
  table: Table = { columns: ['Codigo', 'Nombre', 'Acciones'] }
  p = 1

  constructor(
    private _settings: SettingsService,
    private _alert: AlertService
  ) {}

  ngOnInit(): void {
    this.setRows()
  }

  setRows(): void {
    const item = this.isBrand() ? 'brands' : this.isType() ? 'types' : 'models'
    this._settings[item].subscribe((items) => (this.table.rows = items))
  }

  isBrand(): boolean {
    return this.item.toUpperCase() === 'Marcas'.toUpperCase()
  }

  isType(): boolean {
    return this.item.toUpperCase() === 'tipos'.toUpperCase()
  }

  delete(rowId: number) {
    this._alert.confirmDelete().then((result) => {
      if (result.isConfirmed) {
        const domain = this.isBrand()
          ? 'brands'
          : this.isType()
          ? 'types'
          : 'models'
        this._settings.deleteByDomainAndId(domain, rowId).subscribe(
          () => {
            this._alert.succes('Elemento eliminado con exito')
            this.table.rows = this.table.rows.filter((row) => row.id !== rowId)
          },
          (badRequest) => this._alert.error(badRequest.error.Message)
        )
      }
    })
  }
}
