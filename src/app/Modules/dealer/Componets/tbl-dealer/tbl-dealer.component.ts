import { Component, OnInit } from '@angular/core'
import { City } from 'src/app/Models/City'
import { Dealer } from 'src/app/Models/Dealer'
import { Router } from '@angular/router'
import { DealerService } from '../../Services/Dealer/dealer.service'
import { ActionType } from 'src/app/Models/ActionType'
import { NavigationService } from 'src/app/SharedComponents/Services/navigation.service'
import { FormControl } from '@angular/forms'
import { saveInStorage } from 'src/app/Utils/storage'
import Swal from 'sweetalert2'
import { Excel } from 'src/app/Utils/excel'

@Component({
  selector: 'app-tbl-dealer',
  templateUrl: './tbl-dealer.component.html',
  styleUrls: ['./tbl-dealer.component.scss'],
})
export class TblDealerComponent implements OnInit {
  lsDealer: Dealer[] = []
  lsDealerFiltered: Dealer[] = []
  isAwaiting: boolean
  // pagination
  p = 1
  action: ActionType

  txtFilter: FormControl
  isErrorVisible: boolean = false
  errorTitle: string = ''
  errorMessageApi: string = ''

  constructor(
    private router: Router,
    private dealerService: DealerService,
    private navigationService: NavigationService
  ) {
    this.txtFilter = new FormControl()
    this.txtFilter.valueChanges.subscribe((description) => {
      this.lsDealerFiltered = this.lsDealer.filter((dealer) => {
        if (description != null) {
          return (
            dealer.document.includes(description) ||
            dealer.name.toUpperCase().includes(description.toUpperCase())
          )
        }
      })
    })
  }

  ngOnInit(): void {
    this.initComponents()
  }

  initComponents() {
    this.showTableDealers()
  }

  showTableDealers() {
    try {
      this.isAwaiting = true
      this.dealerService.getDealers().subscribe((dealers) => {
        this.lsDealer = dealers
        this.lsDealerFiltered = dealers
      })
      this.isAwaiting = false
    } catch (err) {
      console.error(err.error.Message)
    }
  }

  updateDealer(id: number): void {
    this.action = ActionType.UPDATE
    saveInStorage('actionToPerform', this.action)
    this.router.navigate(['/MasterDealers/Dealer', id])
  }

  getDetailsByDealer(id: number): void {
    this.action = ActionType.READ
    saveInStorage('actionToPerform', this.action)
    this.router.navigate(['/MasterDealers/Dealer', id])
  }

  deleteDealer(dealer: Dealer) {
    if (confirm('¿Está seguro que desea eliminar este concesionario?')) {
      this.isAwaiting = true
      this.dealerService.deleteDealer(dealer).subscribe(
        (rta) => {
          const indexDealerDeleted = this.lsDealer.findIndex(
            (dl) => dl.id == dealer.id
          )
          this.lsDealer.splice(indexDealerDeleted, 1)
          this.lsDealerFiltered = this.lsDealer
          this.isAwaiting = false
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: rta.message,
            showConfirmButton: true,
          })
        },
        (err) => {
          this.isErrorVisible = true
          this.isAwaiting = false
          this.errorTitle =
            'Ocurrió un error intentando Actualizar el concesionario'
          this.errorMessageApi = err.error.Message
        }
      )
    }
  }

  insertDealer() {
    this.action = ActionType.CREATE
    saveInStorage('actionToPerform', this.action)
    this.router.navigate(['/MasterDealers/Dealer'])
  }

  validateCityName(pCity: City): string {
    return ''
  }

  removeFilter(): void {
    this.txtFilter.setValue(null)
    this.lsDealerFiltered = this.lsDealer
  }

  closeErrorMessage() {
    this.isErrorVisible = false
  }

  downloadExcel(): void {
    const data = this.lsDealer.map((dealer) => {
      return {
        Documento: dealer.document,
        RazonSocial: dealer.name,
      }
    })
    Excel.convertArrayToFile(data, 'Concesionarios')
  }
}
