import { Injectable } from '@angular/core'
import { Contract } from 'src/app/Models/Contract'
import { DiscountTypes } from 'src/app/Models/DiscountType'
import { TypeOfMaintenanceItems } from 'src/app/Models/enumPresentationUnit'
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
          lsMaintenanceItemsReferece[indexItem].valueDiscount =
            itemNew.valueDiscount
        } catch (err) {
          if (itemNew != null && itemNew != undefined) {
            lsMaintenanceItemsReferece.push(itemNew)
          }
        }
      })
    }
    return lsMaintenanceItemsReferece
  }

  calculatePriceByAmount(referencePrice: number, amount: number): number {
    return Math.round(referencePrice * amount)
  }

  calculateDiscountByItem(
    referencePrice: number,
    amount: number,
    contract: Contract,
    item?: MaintenanceItem
  ): number {
    let totalWithoutTaxes = referencePrice * amount

    let totalDiscount = 0
    try {
      if (item.type.id != TypeOfMaintenanceItems.ADMIN_RA) {
        if (contract) {
          console.log(contract)
          switch (contract.discountType.id) {
            case DiscountTypes.PORCENTAJE_POR_REPUESTOS:
              totalDiscount = Math.round(
                totalWithoutTaxes * (item.valueDiscount / 100)
              )
              break
            case DiscountTypes.VALOR_FIJO_POR_REPUESTOS:
              totalDiscount = Math.round(item.valueDiscount)
              break
            case DiscountTypes.PORCENTAJE_POR__TOTAL_MANTENIMIENTO:
              totalDiscount = Math.round(
                totalWithoutTaxes * (contract.discountValue / 100)
              )
              break
            case DiscountTypes.VALOR_FIJO_POR_TOTAL_MANTENIMIENTO:
              totalDiscount = Math.round(contract.discountValue)
              break
          }
        }
      }

      return totalDiscount
    } catch (error) {
      return 0
    }
  }

  calculatePriceWithDiscount(referencePrice: number, totalDiscount: number) {
    return referencePrice - totalDiscount
  }

  calculateTaxesByItem(item: MaintenanceItem, priceLessDiscount: number) {
    let taxValue = 0
    //priceLessDiscount this price alreaday was calculated by price and amount
    if (item.handleTax) {
      for (const tax of item.lsTaxes) {
        const taxTmp = Math.round(priceLessDiscount * (tax.percentValue / 100))
        taxValue += taxTmp
      }
    }
    return taxValue
  }

  calculateTotalByItem(priceWithoutDiscount: number, taxes: number) {
    return priceWithoutDiscount + taxes
  }
}
