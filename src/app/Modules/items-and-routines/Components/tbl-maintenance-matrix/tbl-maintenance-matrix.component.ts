import { Component, OnInit } from '@angular/core'
import { Frequency } from 'src/app/Models/Frequency'
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem'
import { MaintenanceRoutine } from 'src/app/Models/MaintenanceRoutine'
import { MaintenanceRoutineService } from 'src/app/Modules/items-and-routines/Services/MaintenanceRoutine/maintenance-routine.service'
import { MaintenanceItemService } from '../../Services/MaintenanceItem/maintenance-item.service'
import { VehicleService } from '../../../client/Services/Vehicle/vehicle.service'
import { Brand } from 'src/app/Models/Brand'
import { VehicleType } from 'src/app/Models/VehicleType'
import { VehicleModel } from 'src/app/Models/VehicleModel'

@Component({
  selector: 'app-tbl-maintenance-matrix',
  templateUrl: './tbl-maintenance-matrix.component.html',
  styleUrls: [
    './tbl-maintenance-matrix.component.scss',
    '../../../../../assets/styles/checkbox.scss',
  ],
})
export class TblMaintenanceMatrixComponent implements OnInit {
  isAwaiting: boolean
  lsFrequency: Frequency[] = []
  lsMaintenanceItemsFiltered: MaintenanceItem[] = []
  lsMaintenanceItems: MaintenanceItem[] = []
  countChanges: number
  lsMaintenanceRoutinesByModel: MaintenanceRoutine[]
  TIPO_MANO_DE_OBRA = 2
  brandSelected: Brand = null
  vehicleTypeSelected: VehicleType = null

  constructor(
    private maintenanceRoutineService: MaintenanceRoutineService,
    private maintenanceItemService: MaintenanceItemService,
    private vehicleService: VehicleService
  ) {}

  ngOnInit(): void {
    this.initComponents()
  }

  initComponents() {
    this.isAwaiting = true

    this.countChanges = 0
    //TODO: Change that filter to don't call the API
    this.maintenanceRoutineService.getFrequency().subscribe((frequencies) => {
      this.lsFrequency = frequencies.filter((fq) => fq.shortName != '0')
      this.isAwaiting = false
    })
    this.isAwaiting = true
    this.maintenanceItemService
      .getMaintenanceItems(0)
      .subscribe((maintenanceItems) => {
        this.lsMaintenanceItems = maintenanceItems
        this.lsMaintenanceItemsFiltered = maintenanceItems
        const MANO_DE_OBRA = 2
        this.filterByType(MANO_DE_OBRA)
        this.isAwaiting = false
      })
  }

  getChkId(idItem: number, idFrequency: number) {
    return `chk_item_${idItem}_${idFrequency}`
  }

  setBrand(brand: Brand) {
    this.clearCheckBoxSelected()
    this.brandSelected = brand
  }

  setVehicleType(type: VehicleType) {
    this.vehicleTypeSelected = type
    this.vehicleService.setVehicleModelSelected(null)
    this.clearCheckBoxSelected()
    this.countChanges += 1
  }

  setVehicleModel(vehicleModel: VehicleModel) {
    this.getRoutinesByModel(vehicleModel.id)
    this.clearCheckBoxSelected()
  }

  getRoutinesByModel(modelId: number) {
    this.isAwaiting = true
    this.maintenanceRoutineService
      .getMaintenanceRoutineByModel(modelId)
      .subscribe((maintenanceItems) => {
        this.lsMaintenanceRoutinesByModel = maintenanceItems
        this.checkItemsByRoutines(this.lsMaintenanceRoutinesByModel)
        this.isAwaiting = false
      })
  }

  checkItemsByRoutines(lsRoutines: MaintenanceRoutine[]) {
    lsRoutines.forEach((routine) => {
      try {
        routine.lsItems.forEach((item) => {
          try {
            if (item.type.id == this.TIPO_MANO_DE_OBRA) {
              const idCheck = this.getChkId(item.id, routine.frequency.id)

              const itemCheck: HTMLInputElement = document.querySelector(
                `#${idCheck}`
              )
              itemCheck.checked = true
            }
          } catch (error) {
            console.warn(error)
          }
        })
      } catch (error) {
        console.warn(error)
      }
    })
  }

  clearCheckBoxSelected() {
    try {
      this.lsMaintenanceItems.forEach((item) => {
        this.lsFrequency.forEach((frequency) => {
          if (item.type.id == this.TIPO_MANO_DE_OBRA) {
            const idCheck = `#${this.getChkId(item.id, frequency.id)}`

            const itemCheck: HTMLInputElement = document.querySelector(idCheck)
            itemCheck.checked = false
          }
        })
      })
    } catch (error) {
      //setTimeout(() => { this.clearCheckBoxSelected(); }, 800);
    }
  }

  getClass(frequency: string): string {
    const frequencyNumber = parseInt(frequency)
    const className =
      frequencyNumber > 50 ? 'col_frequency inactive' : 'col_frequency active'
    return className
  }

  showOtherRoutines() {
    const aColum = document.getElementsByClassName('col_frequency')

    for (let i = 0; i < aColum.length; i++) {
      if (aColum[i].classList.contains('inactive')) {
        aColum[i].classList.remove('inactive')
        aColum[i].classList.add('active')
      } else {
        aColum[i].classList.remove('active')
        aColum[i].classList.add('inactive')
      }
    }
  }

  filterByType(typeId: number) {
    this.lsMaintenanceItemsFiltered = this.lsMaintenanceItems.filter(
      (mi) => mi.type.id == typeId
    )
  }
}
