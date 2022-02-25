import { Component, Input, OnInit } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Client } from 'src/app/Models/Client'
import { Movement } from 'src/app/Models/Movement'
import { SharedFunction } from 'src/app/Models/SharedFunctions'
import { Transaction } from 'src/app/Models/Transaction'
import { TransactionService } from '../../../../SharedComponents/Services/Transaction/transaction.service'
import { MovementService } from '../../../movement/Services/Movement/movement.service'
import { TransactionDetail } from 'src/app/Models/TransactionDetail'
import { TransactionObservation } from 'src/app/Models/TransactionObservation'
import { SessionUser } from 'src/app/Models/SessionUser'
import { SecurityValidators } from 'src/app/Models/SecurityValidators'

@Component({
  selector: 'app-dashboard-client',
  templateUrl: './dashboard-client.component.html',
  styleUrls: ['./dashboard-client.component.scss'],
})
export class DashboardClientComponent implements OnInit {
  isAwaiting: boolean
  lsTransactionsToApprove: Transaction[]
  client: Client
  sharedFunctions: SharedFunction
  frmApprovedTrx: FormGroup
  frmCancelTrx: FormGroup

  lsMovements: Movement[]
  APROBACION_ORDEN_DE_TRABAJO = 5
  CANCELACION_ORDEN_DE_TRABAJO = 6
  trx_id: number
  transactionSelected: Transaction

  constructor(
    private transactionService: TransactionService,
    private movementService: MovementService
  ) {
    this.frmApprovedTrx = new FormGroup({
      txtObservationApprobation: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
      ]),
    })

    this.frmCancelTrx = new FormGroup({
      txtObservationCancelation: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
      ]),
    })

    this.trx_id = 0
    this.client = {} as Client
  }

  ngOnInit(): void {
    this.initComponents()
  }

  initComponents() {
    this.isAwaiting = false

    // TODO CHANGE THIS FOR THE CLIENT LOGGED
    this.client.id = this.getClientId()

    this.sharedFunctions = new SharedFunction()
    this.getMovementList()
    this.getTransactionsToApprove(this.client.id)
  }

  getClientId(): number {
    const userSession: SessionUser = JSON.parse(
      sessionStorage.getItem('sessionUser')
    )
    return userSession.company.id
  }

  getTransactionsToApprove(client_id: number) {
    this.isAwaiting = true
    this.transactionService
      .getTransactionsToApprove(client_id)
      .subscribe((lsTrx) => {
        this.lsTransactionsToApprove = lsTrx
        this.isAwaiting = false
      })
  }

  async getMovementList() {
    try {
      this.movementService.getMovements().then((lsMov) => {
        this.lsMovements = lsMov
      })
    } catch (error) {
      console.warn(error)
    }
  }

  closePopUp(idPopUp) {
    const popUp = document.getElementById(idPopUp)
    popUp.style.display = 'none'
  }

  openPopUp(idPopUp) {
    const popUp = document.getElementById(idPopUp)
    popUp.style.display = 'block'
  }

  formatNumberToString(oData: number) {
    return this.sharedFunctions.formatNumberToString(oData)
  }

  setTransaction(trx: Transaction) {
    this.transactionSelected = trx
    this.trx_id = trx.id
  }

  approveWorkOrder() {
    this.isAwaiting = true
    const movement = this.lsMovements.find(
      (mv) => mv.id == this.APROBACION_ORDEN_DE_TRABAJO
    )
    const { txtObservationApprobation } = this.frmApprovedTrx.controls
    const trxApproveWorkOrder = this.setDataTransaction(
      this.transactionSelected,
      movement,
      txtObservationApprobation.value
    )
    this.transactionService
      .processTransaction(trxApproveWorkOrder)
      .subscribe((rta) => {
        if (rta.response) {
          alert(rta.message)
          this.getTransactionsToApprove(this.client.id)
          this.closePopUp('container__Approbation')
        }
      })
    this.isAwaiting = false
  }

  async cancelWorkOrder() {
    try {
      this.isAwaiting = true
      const movement = this.lsMovements.find(
        (mv) => mv.id == this.CANCELACION_ORDEN_DE_TRABAJO
      )
      const { txtObservationCancelation } = this.frmCancelTrx.controls
      const trxApproveWorkOrder = this.setDataTransaction(
        this.transactionSelected,
        movement,
        txtObservationCancelation.value
      )
      this.transactionService
        .processTransaction(trxApproveWorkOrder)
        .subscribe((rta) => {
          if (rta.response) {
            alert(rta.message)
            this.getTransactionsToApprove(this.client.id)
            this.closePopUp('container__Cancelation')
          }
        })
      this.isAwaiting = false
    } catch (error) {
      console.warn(error)
    }
  }

  setDataTransaction(
    trxRelated: Transaction,
    movement: Movement,
    observation: string
  ) {
    const trxApprove = new Transaction()
    trxApprove.movement = movement
    trxApprove.value = trxRelated.value
    trxApprove.usu_id = SecurityValidators.validateUserLogged()
    trxApprove.client = trxRelated.client

    trxApprove.headerDetails = new TransactionDetail()
    trxApprove.headerDetails.relatedTransaction = trxRelated

    const trxObservation = new TransactionObservation()
    trxObservation.usu_id = SecurityValidators.validateUserLogged()
    trxObservation.description = observation

    const lsObservation = []
    if (observation != null) {
      lsObservation.push(trxObservation)
    }

    trxApprove.lsObservations = lsObservation

    return trxApprove
  }

  clearForms() {
    this.frmApprovedTrx.reset()
    this.frmCancelTrx.reset()
  }

  setTransactionToShow(trx: Transaction) {
    this.setTransaction(trx)
    this.openPopUp('container__resume')
  }

  setTransactionToApprove(trx: Transaction) {
    this.setTransaction(trx)
    this.openPopUp('container__Approbation')
  }

  setTransactionToDenied(trx: Transaction) {
    this.setTransaction(trx)
    this.openPopUp('container__Cancelation')
  }
}
