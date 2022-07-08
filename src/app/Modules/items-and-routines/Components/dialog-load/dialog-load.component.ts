import { Component, Inject, OnInit } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Category } from 'src/app/Models/Category'
import { PresentationUnit } from 'src/app/Models/PresentationUnit'
import { TypeOfMaintenanceItem } from 'src/app/Models/TypeOfMaintenanceItem'
import { Rows } from 'src/app/Modules/settings/models/settings'
import { AlertService } from 'src/app/services/alert.service'
import { MaintenanceItemService } from '../../Services/MaintenanceItem/maintenance-item.service'

@Component({
  selector: 'app-dialog-load',
  templateUrl: './dialog-load.component.html',
  styleUrls: ['./dialog-load.component.scss'],
})
export class DialogLoadComponent implements OnInit {
  maintanceForm!: FormGroup
  types: TypeOfMaintenanceItem[] = []
  presentations: PresentationUnit[] = []
  categories: Category[] = []

  constructor(
    @Inject(MAT_DIALOG_DATA) public maintances: Rows[],
    private dialogRef: MatDialogRef<DialogLoadComponent>,
    private _maintance: MaintenanceItemService,
    private _alert: AlertService
  ) {}

  ngOnInit(): void {
    this.getTypes()
    this.getCategories()
    this.getPresentations()
  }

  getTypes(): void {
    this._maintance
      .getTypeOfMaintenanceItem()
      .subscribe((types) => (this.types = types))
  }

  getCategories(): void {
    this._maintance
      .getCategories()
      .subscribe((categories) => (this.categories = categories))
  }

  getPresentations(): void {
    this._maintance
      .getPresentationUnits()
      .subscribe((presentations) => (this.presentations = presentations))
  }

  updateTable(): void {
    const categories = this.getValues(
      document.getElementsByClassName('categories')
    )
    const types = this.getValues(document.getElementsByClassName('types'))
    const presentations = this.getValues(
      document.getElementsByClassName('presentations')
    )
    const rows = this.maintances.map((maintence, index) => {
      return {
        ...maintence,
        categoryId: categories[index],
        unitId: presentations[index],
        typeId: types[index],
      }
    })
    this._maintance.updateMaintence({ rows }).subscribe(
      () => {
        this._alert.succes('Articulos de mantemiento cargados con exito')
        this.closeDialog()
      },
      (badRequest) => this._alert.error(badRequest.error.Message)
    )
  }

  convertToArray(htmlCollection) {
    return Array.prototype.slice.call(htmlCollection)
  }

  getValues(htmlCollection): number[] {
    const values = this.convertToArray(htmlCollection)
    return values.map((item) => +item.value)
  }

  closeDialog(): void {
    this.dialogRef.close()
  }
}
