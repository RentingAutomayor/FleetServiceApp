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

@Component({
  selector: 'app-tbl-contract',
  templateUrl: './tbl-contract.component.html',
  styleUrls: ['./tbl-contract.component.scss'],
})
export class TblContractComponent implements OnInit {
  isAwaiting: boolean
  p = 1
  lsContracts: Contract[]
  isToUpdate: boolean
  companyStorage: Company
  hideButtonAdd: boolean
  enableButtonsEditAndDelete: boolean
  action: ActionType

  constructor(
    private contractService: ContractService,
    private router: Router,
    private contracStateService: ContractStateService
  ) {
    this.hideButtonAdd = false
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
            this.isAwaiting = false
          })
        this.hideButtonAdd = true
        this.enableButtonsEditAndDelete = false
        break
      default:
        this.contractService.getContracts().subscribe((contracts) => {
          this.lsContracts = contracts
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
          alert(rta.message)
          this.getListContracts()
        }
        this.isAwaiting = false
      })
    }
  }

  resetContractState() {
    this.contracStateService.resetContractInformation()
  }
}
