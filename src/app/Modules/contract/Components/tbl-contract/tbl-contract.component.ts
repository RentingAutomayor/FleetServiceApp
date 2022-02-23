import { Component, OnInit } from '@angular/core'
import { Contract } from 'src/app/Models/Contract'
import { ContractService } from '../../Services/Contract/contract.service'
import { Router } from '@angular/router'
import { ResponseApi } from 'src/app/Models/ResponseApi'
import { SecurityValidators } from 'src/app/Models/SecurityValidators'
import { Company } from 'src/app/Models/Company'
import { CompanyType } from 'src/app/Models/CompanyType'
import { FasDirective } from 'angular-bootstrap-md'
import { ActionType } from 'src/app/Models/ActionType'

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
    private router: Router
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

  async getListContracts() {
    try {
      this.isAwaiting = true

      switch (this.companyStorage.type) {
        case CompanyType.DEALER:
          this.lsContracts = await this.contractService.getContracts(
            this.companyStorage.id
          )
          this.hideButtonAdd = true
          this.enableButtonsEditAndDelete = false
          break
        case CompanyType.CLIENT:
          this.lsContracts = await this.contractService.getContracts(
            0,
            this.companyStorage.id
          )
          this.hideButtonAdd = true
          this.enableButtonsEditAndDelete = false
          break
        default:
          this.lsContracts = await this.contractService.getContracts()
          this.hideButtonAdd = false
          this.enableButtonsEditAndDelete = true
          break
      }

      this.isAwaiting = false
    } catch (error) {
      console.error(error)
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
    this.isToUpdate = false
    this.contractService.setContract(null)
    this.contractService.setAction(ActionType.CREATE)
    this.router.navigate(['/MasterContracts/Contract'])
  }

  async getDetailsContract(pContract: Contract) {
    try {
      this.isAwaiting = true
      const oContractDetails = await this.contractService.getContractByID(
        pContract.id
      )
      this.isAwaiting = false
      this.contractService.setAction(ActionType.READ)
      this.contractService.setContract(oContractDetails)
      this.router.navigate(['/MasterContracts/Contract'])
    } catch (error) {
      console.error(error)
    }
  }

  async updateContract(pContract: Contract) {
    try {
      this.isAwaiting = true
      const oContractToUpdate = await this.contractService.getContractByID(
        pContract.id
      )
      this.isAwaiting = false
      this.contractService.setAction(ActionType.UPDATE)
      this.contractService.setContract(oContractToUpdate)
      this.router.navigate(['/MasterContracts/Contract'])
    } catch (error) {
      console.error(error)
    }
  }

  async deleteContract(pContract: Contract) {
    try {
      if (
        confirm(
          '¿Está seguro que desea elminar este contrato?, al hacerlo se eliminará toda la información relacionada'
        )
      ) {
        this.isAwaiting = true
        const rta = await this.contractService.delete(pContract)
        this.isAwaiting = false
        if (rta.response) {
          alert(rta.message)
          this.getListContracts()
        }
      }
    } catch (error) {
      console.error(error)
      alert(error)
    }
  }
}
