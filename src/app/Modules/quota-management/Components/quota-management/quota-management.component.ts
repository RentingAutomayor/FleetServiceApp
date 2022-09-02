import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Client } from 'src/app/Models/Client'
import { Movement } from 'src/app/Models/Movement'
import { Transaction } from 'src/app/Models/Transaction'
import { TransactionDetail } from 'src/app/Models/TransactionDetail'
import { TransactionObservation } from 'src/app/Models/TransactionObservation'
import { TransactionState } from 'src/app/Models/TransactionState'
import { TransactionService } from '../../../../SharedComponents/Services/Transaction/transaction.service'
import { QuotaService } from '../../Services/Quota/quota.service'
import { MovementService } from '../../../movement/Services/Movement/movement.service'
import { FinancialInformation } from 'src/app/Models/FinancialInformation'
import { SharedFunction } from 'src/app/Models/SharedFunctions'
import { SecurityValidators } from 'src/app/Models/SecurityValidators'
import { ContractualInformation } from 'src/app/Models/ContractualInformation'
import { InputValidator } from 'src/app/Utils/InputValidator'
import Swal from 'sweetalert2'
import { Excel } from 'src/app/Utils/excel'
import { CurrencyPipe } from '@angular/common'
import { AlertService } from 'src/app/services/alert.service'

@Component({
  selector: 'app-quota-management',
  templateUrl: './quota-management.component.html',
  styleUrls: ['./quota-management.component.scss'],
})
export class QuotaManagementComponent implements OnInit {
  isAwaiting: boolean
  lsClientsWithoutQuota: Client[] = []
  lsClientsWithQuota: FinancialInformation[] = []
  lsTodayTransactions: Transaction[] = []
  lsTodayTransactionsFilter: Transaction[] = []

  lsMovements: Movement[] = []
  clientSelected: Client
  frmApprovedQuota: FormGroup
  frmFreeUpQuota: FormGroup
  frmAddQuota: FormGroup
  frmCancelQuota: FormGroup

  txtFilter: FormControl = new FormControl()

  CREACION_DE_CUPO = 1
  ADICION_DE_CUPO = 2
  CANCELACION_DE_CUPO = 3
  LIBERACION_DE_CUPO = 7

  sharedFunction: SharedFunction
  transactionSelected: Transaction
  trx_id: number
  contractualInformationSelected: ContractualInformation = null

  constructor(
    private quotaService: QuotaService,
    private movementService: MovementService,
    private trxService: TransactionService,
    private currency: CurrencyPipe,
    private alertService : AlertService
  ) {
    this.txtFilter.valueChanges.subscribe((text) => {
      let tempText: string
      tempText = text
      console.log('soy', text)
      this.lsTodayTransactionsFilter = this.lsTodayTransactions.filter((trx) =>
        trx.client.name.toLocaleUpperCase().match(tempText.toLocaleUpperCase())
      )
    })
    this.frmApprovedQuota = new FormGroup({
      txtApprovedQuotaClient: new FormControl(''),
      txtApprovedQuota: new FormControl('', [Validators.required]),
      txtApprovedQuotaObservation: new FormControl(''),
    })

    this.frmFreeUpQuota = new FormGroup({
      txtFreeUpQuotaClient: new FormControl(''),
      txtFreeUpQuota: new FormControl(''),
      txtFreeUpQuotaObservation: new FormControl(''),
    })

    this.frmAddQuota = new FormGroup({
      txtAddQuotaClient: new FormControl(''),
      txtAddQuota: new FormControl(''),
      txtAddQuotaObservation: new FormControl(''),
    })

    this.frmCancelQuota = new FormGroup({
      txtCancelQuotaClient: new FormControl(''),
      txtCancelQuotaObservation: new FormControl(''),
    })

    this.transactionSelected = new Transaction()
    this.transactionSelected.consecutive = 0
    this.transactionSelected.code = null
    this.transactionSelected.movement = new Movement()
    this.trx_id = 0
  }

  ngOnInit(): void {
    this.initComponents()
  }

  initComponents() {
    this.sharedFunction = new SharedFunction()
    this.isAwaiting = true
    this.lsClientsWithoutQuota = []
    this.getLsClientsWithoutQuota()
    this.getLsClientsWithQuota()
    this.getTodayTransactions()
    this.getLsMovements()
    this.isAwaiting = false
  }

  cleanFilter() {
    this.txtFilter.setValue('')
    this.lsTodayTransactionsFilter = this.lsTodayTransactions
  }

  getLsClientsWithoutQuota() {
    this.quotaService.getClientsWithoutQuota().subscribe((clients) => {
      this.lsClientsWithoutQuota = clients
    })
  }

  async getLsClientsWithQuota() {
    try {
      this.lsClientsWithQuota = await this.quotaService.getClientsWithQuota()
      // console.log(this.lsClientsWithQuota);
      setTimeout(() => {
        this.formatQuantities(this.lsClientsWithQuota)
      }, 500)
    } catch (error) {
      console.warn(error)
    }
  }

  async getTodayTransactions() {
    try {
      this.lsTodayTransactions = await this.trxService.getTodayTransactions()
      // console.log(this.lsTodayTransactions);
    } catch (error) {
      console.warn(error)
    }
  }
  async getLsMovements() {
    try {
      this.lsMovements = await this.movementService.getMovements()
    } catch (error) {
      console.warn(error)
    }
  }

  closePopUp(idPopUp) {
    const popUp = document.getElementById(idPopUp)
    this.clearFormQuotaApproved()
    this.clearFormFreeUpQuota()
    this.clearFormAddQuota()
    this.clearFormCancelQuota()
    popUp.style.display = 'none'
  }

  openPopUp(idPopUp) {
    const popUp = document.getElementById(idPopUp)
    popUp.style.display = 'block'
  }

  setClientInformation(idPopUp: string, pClient: Client) {
    this.clientSelected = pClient
    this.contractualInformationSelected = pClient.contractualInformation

    if (idPopUp == 'container__QuotaManager') {
      const { txtApprovedQuotaClient } = this.frmApprovedQuota.controls
      txtApprovedQuotaClient.setValue(pClient.name)
    }

    if (idPopUp == 'container__freeUpQuota') {
      const { txtFreeUpQuotaClient } = this.frmFreeUpQuota.controls
      txtFreeUpQuotaClient.setValue(pClient.name)
    }

    if (idPopUp == 'container__addQuota') {
      const { txtAddQuotaClient } = this.frmAddQuota.controls
      txtAddQuotaClient.setValue(pClient.name)
    }

    if (idPopUp == 'container__cancelQuota') {
      const { txtCancelQuotaClient } = this.frmCancelQuota.controls
      txtCancelQuotaClient.setValue(pClient.name)
    }
  }

  saveApprovedQuota() {
    const { txtApprovedQuota, txtApprovedQuotaObservation } =
      this.frmApprovedQuota.controls
    let trxApprovedQuota = new Transaction()

    const oClient = this.clientSelected
    let value = txtApprovedQuota.value
    const observation = txtApprovedQuotaObservation.value
    const movement = this.lsMovements.find(
      (mv) => mv.id == this.CREACION_DE_CUPO
    )
    const lsObs: TransactionObservation[] = []
    value = value.toString().replace(/\,/g, '')

    if (observation != '') {
      const trxObservation = new TransactionObservation()
      trxObservation.description = observation
      lsObs.push(trxObservation)
    }

    trxApprovedQuota = this.setDataTransaction(
      oClient,
      movement,
      value,
      null,
      null,
      lsObs,
      null
    )

    this.saveTransaction(trxApprovedQuota)
  }

  setDataTransaction(
    pClient: Client,
    pMovement: Movement,
    pValue: number,
    pState: TransactionState = null,
    pHeaderDetails: TransactionDetail = null,
    pListObservations: TransactionObservation[] = null,
    usu_id: number = null
  ): Transaction {
    const trx = new Transaction()
    trx.client = pClient
    trx.movement = pMovement
    trx.value = pValue
    trx.transactionState = pState
    trx.headerDetails = pHeaderDetails
    trx.lsObservations = pListObservations
    trx.usu_id = SecurityValidators.validateUserLogged()
    return trx
  }

  saveTransaction(trx: Transaction) {
    this.isAwaiting = true
    this.trxService.processTransaction(trx).subscribe((rta) => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: rta.message,
        showConfirmButton: true,
      })
      this.isAwaiting = false

      this.closePopUp('container__freeUpQuota')
      this.closePopUp('container__addQuota')
      this.closePopUp('container__cancelQuota')
      this.closePopUp('container__QuotaManager')

      this.getLsClientsWithoutQuota()
      this.getLsClientsWithQuota()
      this.getTodayTransactions()
    })
  }

  clearFormQuotaApproved() {
    const { txtApprovedQuota, txtApprovedQuotaObservation } =
      this.frmApprovedQuota.controls
    txtApprovedQuota.setValue('')
    txtApprovedQuotaObservation.setValue('')
  }

  clearFormFreeUpQuota() {
    const { txtFreeUpQuota, txtFreeUpQuotaObservation } =
      this.frmFreeUpQuota.controls
    txtFreeUpQuota.setValue('')
    txtFreeUpQuotaObservation.setValue('')
  }

  clearFormAddQuota() {
    const { txtAddQuota, txtAddQuotaObservation } = this.frmAddQuota.controls
    txtAddQuota.setValue('')
    txtAddQuotaObservation.setValue('')
  }
  clearFormCancelQuota() {
    const { txtCancelQuotaObservation } = this.frmCancelQuota.controls
    txtCancelQuotaObservation.setValue('')
  }

  showElements(container_description: string) {
    this.hideElements()
    const idIndicator = `indicator__${container_description}`
    const idContainer = `container__${container_description}`

    const indicator = document.getElementById(idIndicator)
    const container = document.getElementById(idContainer)

    indicator.setAttribute('style', 'display:block')
    container.setAttribute('style', 'display:block')
  }

  hideElements() {
    const aElementsToHide = document.getElementsByClassName('element-to-hide')
    for (let i = 0; i < aElementsToHide.length; i++) {
      aElementsToHide[i].setAttribute('style', 'display:none')
    }
  }

  getStringHour(trxDate: Date): string {
    const strHour = trxDate.toLocaleString()
    return strHour.substr(11, 8)
  }

  formatQuantities(lsFinancialInformationByClient: FinancialInformation[]) {
    for (const finInfo of lsFinancialInformationByClient) {
      try {
        const idApprovedQuota = this.getElementId(
          'approvedQuota',
          finInfo.client.id
        )
        const elementApprovedQuota = document.getElementById(idApprovedQuota)
        const approvedQuotaFormated = this.formatNumberToString(
          finInfo.approvedQuota
        )
        elementApprovedQuota.innerText = approvedQuotaFormated

        const idCurrentQuota = this.getElementId(
          'currentQuota',
          finInfo.client.id
        )
        const elementCurrentQuota = document.getElementById(idCurrentQuota)
        const CurrentQuotaFormated = this.formatNumberToString(
          finInfo.currentQuota
        )
        elementCurrentQuota.innerText = CurrentQuotaFormated

        const idConsumedQuota = this.getElementId(
          'consumedQuota',
          finInfo.client.id
        )
        const elementConsumedQuota = document.getElementById(idConsumedQuota)
        const ConsumedQuotaFormated = this.formatNumberToString(
          finInfo.consumedQuota
        )
        elementConsumedQuota.innerText = ConsumedQuotaFormated

        const idInTransitQuota = this.getElementId(
          'inTransitQuota',
          finInfo.client.id
        )
        const elementInTransitQuota = document.getElementById(idInTransitQuota)
        const InTransitQuotaFormated = this.formatNumberToString(
          finInfo.inTransitQuota
        )
        elementInTransitQuota.innerText = InTransitQuotaFormated
      } catch (ex) {
        console.warn(ex)
      }
    }
  }

  valideTyping(event: any) {
    InputValidator.validateTyping(event, 'numbers')
  }

  formatNumber(event: any) {
    const { txtApprovedQuota } = this.frmApprovedQuota.controls
    const numberToTransform = event.target.value.toString().replace(/\,/g, '')
    const num = this.formatNumberToString(numberToTransform)
    txtApprovedQuota.setValue(num)
  }

  formatNumberToString(oNumber: number): string {
    return this.sharedFunction.formatNumberToString(oNumber)
  }

  getElementId(field: string, id: number) {
    return `${field}_${id}`
  }

  saveFreeUpQuota() {

    const { txtFreeUpQuota, txtFreeUpQuotaObservation } =
      this.frmFreeUpQuota.controls

    if(txtFreeUpQuota.value == ''){
      this.alertService.error('Debe ingresar una cantidad')
      this.closePopUp('container__freeUpQuota')
    }else{

      let trxFreeUpQuota = new Transaction()
  
      const oClient = this.clientSelected
      let value = txtFreeUpQuota.value
      value = value.toString().replace(/\,/g, '')
  
      const observation = txtFreeUpQuotaObservation.value
      const movement = this.lsMovements.find(
        (mv) => mv.id == this.LIBERACION_DE_CUPO
      )
      const lsObs: TransactionObservation[] = []
  
      this.validatePayment(oClient, value).then((response) => {
        if (response) {
          if (observation != '') {
            const trxObservation = new TransactionObservation()
            trxObservation.description = observation
            lsObs.push(trxObservation)
          }
  
          trxFreeUpQuota = this.setDataTransaction(
            oClient,
            movement,
            value,
            null,
            null,
            lsObs,
            null
          )
  
          this.saveTransaction(trxFreeUpQuota)
        }
      })
    }

  }

  saveAddQuota() {
    const { txtAddQuota, txtAddQuotaObservation } = this.frmAddQuota.controls
    let trxAddQuota = new Transaction()

    const oClient = this.clientSelected
    let value = txtAddQuota.value
    const observation = txtAddQuotaObservation.value
    const movement = this.lsMovements.find(
      (mv) => mv.id == this.ADICION_DE_CUPO
    )
    const lsObs: TransactionObservation[] = []
    value = value.toString().replace(/\,/g, '')

    if (observation != '') {
      const trxObservation = new TransactionObservation()
      trxObservation.description = observation
      lsObs.push(trxObservation)
    }

    trxAddQuota = this.setDataTransaction(
      oClient,
      movement,
      value,
      null,
      null,
      lsObs,
      null
    )

    this.saveTransaction(trxAddQuota)
  }

  async validatePayment(
    pClient: Client,
    paymentValue: Number
  ): Promise<boolean> {
    try {
      return new Promise(async (resolve, reject) => {
        this.isAwaiting = true
        const rta = await this.quotaService.validatePaymentVsConsumedQuota(
          pClient.id,
          paymentValue
        )
        if (!rta.response) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: rta.message,
            showConfirmButton: true,
          })
          resolve(false)
        } else {
          resolve(true)
        }
        this.isAwaiting = false
        return rta.response
      })
    } catch (error) {
      console.warn(error)
    }
  }

  cancelQuota() {
    const oClient = this.clientSelected
    if (
      confirm(`¿Está seguro de anular el cupo para el cliente ${oClient.name}?`)
    ) {
      const value = 0
      const { txtCancelQuotaObservation } = this.frmCancelQuota.controls
      let trxCancelQuota = new Transaction()

      const observation = txtCancelQuotaObservation.value
      const movement = this.lsMovements.find(
        (mv) => mv.id == this.CANCELACION_DE_CUPO
      )
      const lsObs: TransactionObservation[] = []

      if (observation != '') {
        const trxObservation = new TransactionObservation()
        trxObservation.description = observation
        lsObs.push(trxObservation)
      }

      trxCancelQuota = this.setDataTransaction(
        oClient,
        movement,
        value,
        null,
        null,
        lsObs,
        null
      )

      this.saveTransaction(trxCancelQuota)
    }
  }

  setTransaction(trx: Transaction) {
    this.transactionSelected = trx
    this.trx_id = trx.id
  }

  downloadExcel(type: string): void {
    let data = []
    let fileName = ''
    if (type === 'clientWithQuota') {
      fileName = 'Clientes con cupo'
      data = this.lsClientsWithQuota.map((item) => {
        return {
          Nombre: item.client.name,
          CupoAprobado: this.getCurrency(item.approvedQuota),
          CupoDisponible: this.getCurrency(item.currentQuota),
          CupoConsumido: this.getCurrency(item.consumedQuota),
          CupoEnTransito: this.getCurrency(item.inTransitQuota),
        }
      })
    } else if (type === 'clientWithOutQuota') {
      fileName = 'Clientes sin cupo'
      data = this.lsClientsWithoutQuota.map((item) => {
        return {
          Documento: item.document,
          RazonSocial: item.name,
          Telefono: item.phone,
          Celular: item.cellphone,
          Direccion: item.address,
        }
      })
    } else {
      fileName = 'Transacciones'
      data = this.lsTodayTransactionsFilter.map((item) => {
        return {
          Codigo: item.code,
          Movimiento: item.movement,
          Cliente: item.client?.name,
          Valor: this.getCurrency(item.value),
          Hora: '',
          Usuario: `${item.user?.name} ${item.user?.lastName}`,
        }
      })
    }
    Excel.convertArrayToFile(data, fileName)
  }

  getCurrency(value: string | number): string {
    return this.currency.transform(value)
  }
}
