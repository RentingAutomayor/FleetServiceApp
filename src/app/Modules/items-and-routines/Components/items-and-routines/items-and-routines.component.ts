import { Component, OnInit } from '@angular/core'
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem'
import { ResponseApi } from 'src/app/Models/ResponseApi'
import { VehicleModel } from 'src/app/Models/VehicleModel'
import { MaintenanceItemService } from '../../Services/MaintenanceItem/maintenance-item.service'
import { VehicleService } from '../../../client/Services/Vehicle/vehicle.service'

@Component({
  selector: 'app-items-and-routines',
  templateUrl: './items-and-routines.component.html',
  styleUrls: ['./items-and-routines.component.scss'],
})
export class ItemsAndRoutinesComponent implements OnInit {
  isAwaiting: boolean
  p: Number = 1
  lsMaintenanceItems: MaintenanceItem[]
  isToUpdate: boolean
  constructor() {}

  ngOnInit(): void {
    this.initComponents()
  }

  initComponents() {}
}
