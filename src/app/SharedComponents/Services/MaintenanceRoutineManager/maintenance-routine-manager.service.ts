import { Injectable } from '@angular/core'
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem'
import { CalculateTotalPricePipe } from 'src/app/SharedComponents/Pipes/calculate-total-price.pipe'

@Injectable({
  providedIn: 'root',
})
export class MaintenanceRoutineManagerService {
  constructor(private calculateTotalPricePipe: CalculateTotalPricePipe) {}

  calculateTotal(maintenanceItems: MaintenanceItem[]): number {
    let totalRoutine = 0
    maintenanceItems.forEach((item) => {
      totalRoutine += this.calculateTotalPricePipe.transform(
        item,
        item.referencePrice,
        item.amount
      )
    })
    return totalRoutine
  }
}
