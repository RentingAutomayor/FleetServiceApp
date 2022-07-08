import { Component, OnInit } from '@angular/core'
import { Contract } from 'src/app/Models/Contract'
import { ContractService } from '../../Services/Contract/contract.service'
import { Router } from '@angular/router'
import { SecurityValidators } from 'src/app/Models/SecurityValidators'
import { Company } from 'src/app/Models/Company'
import { CompanyType } from 'src/app/Models/CompanyType'
import { ActionType } from 'src/app/Models/ActionType'
import { ContractStateService } from '../../Services/contract-state.service'
import { saveInStorage } from 'src/app/Utils/storage'
import { FormControl } from '@angular/forms'
import Swal from 'sweetalert2'
import { Excel } from 'src/app/Utils/excel'

@Component({
  selector: 'app-tbl-contract',
  templateUrl: './tbl-contract.component.html',
  styleUrls: ['./tbl-contract.component.scss'],
})
export class TblContractComponent implements OnInit {
  isAwaiting: boolean
  p = 1
  lsContracts: Contract[] = []
  lsContractsFiltered: Contract[] = []
  isToUpdate: boolean
  companyStorage: Company
  hideButtonAdd: boolean
  enableButtonsEditAndDelete: boolean
  action: ActionType
  txtFilter: FormControl = new FormControl()

  constructor(
    private contractService: ContractService,
    private router: Router,
    private contracStateService: ContractStateService
  ) {
    this.hideButtonAdd = false
    this.txtFilter.valueChanges.subscribe((desc) => {
      this.filterContracts(desc)
    })
  }

  ngOnInit(): void {
    this.enableButtonsEditAndDelete = true
    this.initComponents()
  }

  validateCompany() {
    try {
      this.companyStorage = SecurityValidators.validateUserAndCompany()
    } catch (error) {
      console.warn(error)
    }
  }

  async initComponents() {
    this.validateCompany()
    this.isToUpdate = false
    this.isAwaiting = false
    this.getListContracts()
  }

  getListContracts() {
    this.isAwaiting = true
    switch (this.companyStorage.type) {
      case CompanyType.DEALER:
        this.contractService
          .getContracts(this.companyStorage.id)
          .subscribe((contracts) => {
            this.lsContracts = contracts
            this.lsContractsFiltered = this.lsContracts
            this.isAwaiting = false
          })
        this.hideButtonAdd = true
        this.enableButtonsEditAndDelete = false
        break
      case CompanyType.CLIENT:
        this.contractService
          .getContracts(0, this.companyStorage.id)
          .subscribe((contracts) => {
            this.lsContracts = contracts
            this.lsContractsFiltered = this.lsContracts
            this.isAwaiting = false
          })
        this.hideButtonAdd = true
        this.enableButtonsEditAndDelete = false
        break
      default:
        this.contractService.getContracts().subscribe((contracts) => {
          this.lsContracts = contracts
          this.lsContractsFiltered = this.lsContracts
          this.isAwaiting = false
        })
        this.hideButtonAdd = false
        this.enableButtonsEditAndDelete = true
        break
    }
  }

  moveContent(event: any) {
    const containerContent: HTMLDivElement = document.querySelector(
      '#container__content'
    )

    if (event) {
      containerContent.style.marginLeft = '250px'
    } else {
      containerContent.style.marginLeft = '0px'
    }
  }

  insertContract() {
    this.resetContractState()
    this.isToUpdate = false
    this.contractService.setContract(null)
    saveInStorage('actionToPerform', ActionType.CREATE)
    this.router.navigate(['/MasterContracts/Contract'])
  }

  getDetailsContract(pContract: Contract) {
    this.resetContractState()
    saveInStorage('actionToPerform', ActionType.READ)
    this.router.navigate([`/MasterContracts/Contract/${pContract.id}`])
  }

  updateContract(pContract: Contract) {
    this.resetContractState()
    saveInStorage('actionToPerform', ActionType.UPDATE)
    this.router.navigate([`/MasterContracts/Contract/${pContract.id}`])
  }

  deleteContract(pContract: Contract) {
    if (
      confirm(
        '¿Está seguro que desea elminar este contrato?, al hacerlo se eliminará toda la información relacionada'
      )
    ) {
      this.isAwaiting = true
      this.contractService.delete(pContract).subscribe((rta) => {
        if (rta.response) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: rta.message,
            showConfirmButton: true,
          })
          this.getListContracts()
        }
        this.isAwaiting = false
      })
    }
  }

  resetContractState() {
    this.contracStateService.resetContractInformation()
  }

  filterContracts(description) {
    try {
      this.lsContractsFiltered = this.lsContracts.filter((contract) => {
        return (
          contract.code
            .toLocaleLowerCase()
            .includes(description.toLocaleLowerCase()) ||
          contract.name
            .toLocaleLowerCase()
            .includes(description.toLocaleLowerCase()) ||
          contract.consecutive == parseInt(description) ||
          contract.client.name
            .toLocaleLowerCase()
            .includes(description.toLocaleLowerCase()) ||
          contract.dealer.name
            .toLocaleLowerCase()
            .includes(description.toLocaleLowerCase())
        )
      })
    } catch (ex) {
      console.log(ex)
    }
  }

  removeFilter() {
    this.txtFilter.setValue(null)
    this.lsContractsFiltered = this.lsContracts
  }

  downloadExcel(): void {
    const data = this.lsContractsFiltered.map((contract) => {
      return {
        CodigoInterno: contract.code,
        CodigoReferencia: contract.name,
        Cliente: contract.client?.name,
        Concesionario: contract.dealer?.name,
        PlazoEnMeses: contract.duration,
        VehiculosContratados: contract.amountVehicles,
        Estado: contract.contractState.name,
      }
    })
    Excel.convertArrayToFile(data, 'Contratos')
  }
}
