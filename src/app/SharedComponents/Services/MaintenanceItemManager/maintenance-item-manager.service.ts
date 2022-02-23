import { Injectable } from '@angular/core'
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem'

@Injectable({
  providedIn: 'root',
})
export class MaintenanceItemManagerService {
  constructor() {}

  updatePrices(
    lsMaintenanceItemsReferece: MaintenanceItem[],
    lsMaintenanceItemsWithNewPrices: MaintenanceItem[]
  ): MaintenanceItem[] {
    if (
      lsMaintenanceItemsWithNewPrices != null &&
      lsMaintenanceItemsWithNewPrices != null
    ) {
      lsMaintenanceItemsWithNewPrices.forEach((itemNew) => {
        try {
          const indexItem = lsMaintenanceItemsReferece.findIndex(
            (item) => item.id == itemNew.id
          )
          lsMaintenanceItemsReferece[indexItem].referencePrice = Math.round(
            itemNew.referencePrice
          )
        } catch (err) {
          console.log(
            `No se encontro item: ${itemNew.name} - ${itemNew.code} - se agregara a la lista`
          )
          lsMaintenanceItemsReferece.push(itemNew)
        }
      })
    }
    return lsMaintenanceItemsReferece
  }
}
