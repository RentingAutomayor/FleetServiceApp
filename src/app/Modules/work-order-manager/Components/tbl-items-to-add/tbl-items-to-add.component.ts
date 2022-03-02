import {
  Component,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
  EventEmitter,
} from '@angular/core'
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem'

@Component({
  selector: 'app-tbl-items-to-add',
  templateUrl: './tbl-items-to-add.component.html',
  styleUrls: [
    './tbl-items-to-add.component.scss',
    '../../../../../assets/styles/checkbox.scss',
    '../../../../../assets/styles/app.scss',
  ],
})
export class TblItemsToAddComponent implements OnInit {
  lsMaintenanceItemsTemp: MaintenanceItem[]

  lsMaintenanceItems: MaintenanceItem[]
  @Input('lsMaintenanceItems')
  set setLsMaintenanceItems(items: MaintenanceItem[]) {
    this.lsMaintenanceItems = items
    this.turnOffCheckBoxes()
    this.lsItemsToAddSelected = []
    this.lsMaintenanceItemsTemp = this.lsMaintenanceItems
  }
  @Input() countChanges: number
  lsItemsToAddSelected: MaintenanceItem[]
  @Output() newItemsWasSetted = new EventEmitter<MaintenanceItem[]>()
  @Output() addItemsWasCanceled = new EventEmitter<boolean>()
  p = 1
  clearFilterIsVisible: boolean

  constructor() {
    this.clearFilterIsVisible = false
    this.lsItemsToAddSelected = []
    this.countChanges = 0
  }

  ngOnInit(): void {
    this.lsMaintenanceItemsTemp = this.lsMaintenanceItems
  }

  pickItemToAdd(event: any, item: MaintenanceItem) {
    if (event.checked) {
      this.lsItemsToAddSelected.push(item)
    } else {
      const itemTmp = this.lsItemsToAddSelected.find((it) => it.id == item.id)
      const index = this.lsItemsToAddSelected.indexOf(itemTmp)
      this.lsItemsToAddSelected.splice(index, 1)
    }
  }

  getCheckBoxId(pId: number) {
    return `chk_add_${pId}`
  }

  filterItems(event: any) {
    try {
      this.validateItemsChecked()
      const valueToFilter = event.target.value.toString().toLowerCase()

      if (valueToFilter.trim() != '') {
        this.clearFilterIsVisible = true
        this.lsMaintenanceItemsTemp = this.lsMaintenanceItems.filter(
          (item) =>
            item.code.toLowerCase().includes(valueToFilter) ||
            item.name.toLowerCase().includes(valueToFilter)
        )
      } else {
        this.clearFilter()
      }
    } catch (error) {
      console.warn(error)
    }
  }

  clearFilter() {
    try {
      this.validateItemsChecked()
      this.lsMaintenanceItemsTemp = this.lsMaintenanceItems
      const inputFilter: HTMLInputElement = document.querySelector('#txtFilter')
      inputFilter.value = ''
      this.clearFilterIsVisible = false
      this.p = 1
    } catch (error) {}
  }

  validateItemsChecked() {
    setTimeout(() => {
      this.lsItemsToAddSelected.forEach((item) => {
        try {
          const idCheckbox = `#${this.getCheckBoxId(item.id)}`
          const checkElement: HTMLInputElement =
            document.querySelector(idCheckbox)
          checkElement.checked = true
        } catch (error) {
          // console.warn(error);
        }
      })
    }, 300)
  }

  addItemsToWorkOrder() {
    this.newItemsWasSetted.emit(this.lsItemsToAddSelected)
  }

  cancelAddItems() {
    if (
      confirm(
        '¿Está seguro que desea cancelar la adición de items?, sí lo hace perdera todo el avance registrado'
      )
    ) {
      this.lsItemsToAddSelected = []
      this.addItemsWasCanceled.emit(true)
    }
  }

  turnOffCheckBoxes() {
    this.lsItemsToAddSelected.forEach((item) => {
      try {
        const idCheckbox = `#${this.getCheckBoxId(item.id)}`
        const checkElement: HTMLInputElement =
          document.querySelector(idCheckbox)
        checkElement.checked = false
      } catch (error) {
        // console.warn(error);
      }
    })
  }
}
