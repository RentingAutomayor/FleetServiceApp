import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core'
import { Dealer } from 'src/app/Models/Dealer'
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem'
import { PricesByDealer } from 'src/app/Models/PricesByDealer'
import { MaintenanceItemService } from 'src/app/Modules/items-and-routines/Services/MaintenanceItem/maintenance-item.service'

@Component({
  selector: 'app-tbl-prices-by-dealer',
  templateUrl: './tbl-prices-by-dealer.component.html',
  styleUrls: ['./tbl-prices-by-dealer.component.scss'],
})
export class TblPricesByDealerComponent implements OnInit {
  dealerSelected: Dealer
  isAwaiting: boolean

  @Input('dealer')
  set setDealerSelected(dealer: Dealer) {
    this.dealerSelected = dealer
    this.getListMaintenanceItems(this.dealerSelected.id)
    this.getPricesByDealer(this.dealerSelected.id)
  }

  isFormBlocked: boolean = false
  @Input()
  set setIsFormBlocked(value: boolean) {
    this.isFormBlocked = value
  }

  priceByDealer: PricesByDealer
  lsMaintenanceItemsReference: MaintenanceItem[] = []
  lsMaintenanceItemsWithPrices: MaintenanceItem[] = []

  @Output()
  onItemsWereModified = new EventEmitter<MaintenanceItem[]>()

  constructor(private maintenanceItemService: MaintenanceItemService) {}

  ngOnInit(): void {}

  getListMaintenanceItems(dealerId: number) {
    try {
      this.isAwaiting = true
      this.maintenanceItemService
        .getMaintenanceItems(dealerId)
        .subscribe((maintenanceItems) => {
          this.lsMaintenanceItemsReference = maintenanceItems
          this.isAwaiting = false
        })
    } catch (error) {
      this.isAwaiting = false
      console.warn(error)
    }
  }

  getPricesByDealer(dealerId: number) {
    try {
      this.isAwaiting = true
      this.maintenanceItemService
        .getPricesByDealer(dealerId)
        .subscribe((itemsByDealer) => {
          this.priceByDealer = itemsByDealer
          this.lsMaintenanceItemsWithPrices =
            this.priceByDealer.lsMaintenanceItems
          this.isAwaiting = false
        })
    } catch (error) {
      this.isAwaiting = false
      console.warn(error)
    }
  }

  setPricesByDealer(items: MaintenanceItem[]) {
    this.onItemsWereModified.emit(items)
  }
}
