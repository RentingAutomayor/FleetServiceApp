import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Observable, Subject } from 'rxjs'
import { ParameterService } from 'src/app/Modules/role/services/parameter.service'
import { AlertService } from 'src/app/services/alert.service'
import { Excel } from 'src/app/Utils/excel'
import { BAD_REQUEST } from 'src/app/Utils/general-error'
import { Report } from '../../models/report'
import { SettingsService } from '../../services/settings.service'

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  fieldForm!: FormGroup
  reports: Report[] = []
  subject = new Subject<any[]>()
  constructor(
    private _parameter: ParameterService,
    private _alert: AlertService,
    private _settings: SettingsService,
    private fb: FormBuilder
  ) {
    this.initForm()
  }

  initForm(): void {
    this.fieldForm = this.fb.group({
      name: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.getReports()
  }

  getReports(): void {
    this._parameter
      .getReports()
      .subscribe((reports) => (this.reports = reports))
  }

  downloadReport(): void {
    const reportId = +this.fieldForm.get('name').value
    const report: Report = this.reports.find((r) => r.id === reportId)
    switch (report.method) {
      case 'downloadClient':
        this.downloadClient(report)
        break
    }
  }

  downloadClient(report: Report): void {
    this.getArrayForExcel(report.service)
    this.subject.subscribe((result) => {
      const array = result.map((client) => {
        return {
          Nombre: client.name,
          Apellido: client.lastName,
          Documento: client.document,
          Celular: client.cellphone,
          Telefono: client.phone,
          Direccion: client.address,
          SitioWeb: client.website,
          Ciudad: client.city?.name,
          Contactos: client.contacts
            .map(
              (contact) =>
                `${this.notNull(contact.name)} ${this.notNull(contact.phone)}`
            )
            .toString(),
          Vehiculos: client.vehicles
            .map((vehicle) => vehicle.licensePlate)
            .toString(),
        }
      })
      Excel.convertArrayToFile(array, report.name.trim())
    })
  }

  notNull(item: string): string {
    return item ?? ''
  }

  getArrayForExcel(url: string): Observable<any[]> {
    this._settings.getDataForReport(url).subscribe(
      (result) => this.subject.next(result),
      () => this._alert.error(BAD_REQUEST)
    )
    return this.subject.asObservable()
  }
}
