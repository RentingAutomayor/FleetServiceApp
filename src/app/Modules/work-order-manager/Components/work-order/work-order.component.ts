import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core'
import { ClientService } from 'src/app/Modules/client/Services/Client/client.service'
import { VehicleService } from 'src/app/Modules/client/Services/Vehicle/vehicle.service'
import { ContractService } from 'src/app/Modules/contract/Services/Contract/contract.service'
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'
import { Dealer } from 'src/app/Models/Dealer'
import { Branch } from 'src/app/Models/Branch'
import { BranchService } from 'src/app/SharedComponents/Services/Branch/branch.service'
import { VehicleModel } from 'src/app/Models/VehicleModel'
import { MaintenanceRoutine } from 'src/app/Models/MaintenanceRoutine'
import { MaintenanceRoutineService } from '../../../items-and-routines/Services/MaintenanceRoutine/maintenance-routine.service'
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem'
import { PricesByContract } from 'src/app/Models/PricesByContract'
import { MaintenanceItemService } from 'src/app/Modules/items-and-routines/Services/MaintenanceItem/maintenance-item.service'
import { Contract } from 'src/app/Models/Contract'
import { SharedFunction } from 'src/app/Models/SharedFunctions'
import { Transaction } from 'src/app/Models/Transaction'
import { MovementService } from '../../../movement/Services/Movement/movement.service'
import { Movement } from 'src/app/Models/Movement'
import { TransactionDetail } from 'src/app/Models/TransactionDetail'
import { Vehicle } from 'src/app/Models/Vehicle'
import { TransactionService } from '../../../../SharedComponents/Services/Transaction/transaction.service'
import { TransactionObservation } from 'src/app/Models/TransactionObservation'
import { QuotaService } from '../../../quota-management/Services/Quota/quota.service'
import { SessionUser } from 'src/app/Models/SessionUser'
import { DealerService } from 'src/app/Modules/dealer/Services/Dealer/dealer.service'
import { Tax } from 'src/app/Models/Tax'
import { SecurityValidators } from 'src/app/Models/SecurityValidators'
import { DiscountType, DiscountTypes } from 'src/app/Models/DiscountType'
import { ConstractStates } from 'src/app/Models/ContractState'

@Component({
  selector: 'app-work-order',
  templateUrl: './work-order.component.html',
  styleUrls: [
    './work-order.component.scss',
    '../../../../../assets/styles/checkbox.scss',
    '../../../../../assets/styles/app.scss',
  ],
})
export class WorkOrderComponent implements OnInit, OnChanges {
  oCountChanges: number
  frmWorkOrder: FormGroup
  dealer: Dealer
  branchSelected: Branch
  contractSelected: Contract
  vehicleModelSelected: VehicleModel
  routineSelected: MaintenanceRoutine
  lsMaintenanceItems: MaintenanceItem[]
  pricesByContract: PricesByContract
  sharedFunctions: SharedFunction
  lsMaintenanceItemsSelected: MaintenanceItem[]
  totalRoutine: number
  totalTaxes: number
  totalWithoutTaxes: number
  totalWithoutTaxesAndDiscount: number
  totalDiscount: number
  lsMovements: Movement[]
  vehicleSelected: Vehicle
  ORDEN_DE_TRABAJO = 4
  isAwaiting: boolean
  @Output() workOrderWasCanceled = new EventEmitter<boolean>()
  @Output() workOrderWasSaved = new EventEmitter<boolean>()

  fieldBranchIsInvalid: boolean
  fieldMaintenanceRoutineIsInvalid: boolean

  constructor(
    private ClientService: ClientService,
    private vehicleService: VehicleService,
    private contractService: ContractService,
    private branchService: BranchService,
    private maintenanceRoutineService: MaintenanceRoutineService,
    private maintenanceItemService: MaintenanceItemService,
    private movementService: MovementService,
    private transactionService: TransactionService,
    private quotaService: QuotaService,
    private dealerService: DealerService
  ) {
    this.frmWorkOrder = new FormGroup({
      txtYear: new FormControl(''),
      txtMileage: new FormControl(''),
      txtBrand: new FormControl(''),
      txtVehicleType: new FormControl(''),
      txtVehicleModel: new FormControl(''),
      txtClientDocument: new FormControl(''),
      txtClient: new FormControl(''),
      txtContract: new FormControl(''),
      txtDealer: new FormControl(''),
      txtObservation: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
      ]),
      txtCurrentQuota: new FormControl(''),
      txtConsumedQuota: new FormControl(''),
      txtInTransitQuota: new FormControl(''),
    })

    // this.setTotalWithoutTaxesByItem = this.setTotalWithoutTaxesByItem.bind(this);

    this.totalTaxes = 0
    this.totalWithoutTaxes = 0
    this.totalWithoutTaxesAndDiscount = 0
    this.totalDiscount = 0
    this.fieldBranchIsInvalid = true
    this.fieldMaintenanceRoutineIsInvalid = true
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.clearBufferForm()
    this.getDealer()
  }

  clearBufferForm() {
    this.frmWorkOrder.reset()
    this.vehicleSelected = null
    this.vehicleModelSelected = null
    this.branchSelected = null
    this.contractSelected = null
    this.routineSelected = null
    this.lsMaintenanceItems = []
    this.lsMaintenanceItemsSelected = []
    this.updateLabelTotalRoutine(0)
    this.updateLabelTotalTaxes(0)
    this.updateLabelWithoutTaxes(0)
    this.getDealer()
  }

  ngOnInit(): void {
    this.getDealer()
    this.initComponents()
  }
  getLabeTaxesId(idItem: number): string {
    return `lbl_taxes_${idItem}`
  }

  getLabeTotalId(idItem: number): string {
    return `lbl_total_${idItem}`
  }

  getLabePriceByAmountId(idItem: number) {
    return `lbl_price_amount_${idItem}`
  }

  getLabePriceByAmountLessDiscountId(idItem: number) {
    return `lbl_price_amount_less_discount_${idItem}`
  }

  getLabelDiscountId(idItem: number) {
    return `lbl_discount_${idItem}`
  }

  getDealer() {
    const userSession: SessionUser = JSON.parse(
      sessionStorage.getItem('sessionUser')
    )
    this.dealerService
      .getDealerById(userSession.company.id)
      .subscribe((dealer) => {
        this.dealer = dealer
        this.frmWorkOrder.controls.txtDealer.setValue(
          this.dealer.name.toUpperCase()
        )
      })
  }

  initComponents() {
    this.oCountChanges = 0
    this.isAwaiting = false
    this.sharedFunctions = new SharedFunction()
    this.getLsMovements()
  }

  getPricesByContract(contract_id: number) {
    try {
      this.maintenanceItemService
        .getPricesByContract(contract_id)
        .then((pricesByContract) => {
          this.pricesByContract = pricesByContract

          this.updateAmountsAndPrices(
            this.lsMaintenanceItems,
            this.pricesByContract
          )
        })
    } catch (error) {
      console.warn(error)
    }
  }

  getLsMovements() {
    try {
      this.movementService.getMovements().then((dataMovements) => {
        this.lsMovements = dataMovements
      })
    } catch (error) {
      console.warn(error)
    }
  }

  updateAmountsAndPrices(
    lsMaintenanceItems: MaintenanceItem[],
    pricesByContract: PricesByContract
  ) {
    this.totalRoutine = 0
    lsMaintenanceItems.forEach((mItem) => {
      try {
        const priceContract = pricesByContract.lsMaintenanceItems.find(
          (mi) => mi.id == mItem.id
        )

        mItem.referencePrice = priceContract.referencePrice

        this.updateLabelPriceByAmount(mItem)
        this.turnOnCheckbox(mItem)
        this.addItemToRoutine(mItem)
      } catch (error) {
        console.warn(error)
      }
    })

    this.calculateTotalRoutine(this.lsMaintenanceItemsSelected)
  }

  updateLabelTotalRoutine(totalRoutine: number) {
    const totalFormatted = totalRoutine.toFixed(2)
    const lblTotalRoutine: HTMLElement =
      document.querySelector('#lbl-total-routine')
    lblTotalRoutine.innerText = this.sharedFunctions.formatNumberToString(
      parseFloat(totalFormatted)
    )
  }

  updateLabelWithoutTaxes(totalWithoutTaxes: number) {
    const totalFormatted = totalWithoutTaxes.toFixed(2)
    const lblTotalWithoutTaxes: HTMLSpanElement = document.querySelector(
      '#lbl-total-without-taxes'
    )
    lblTotalWithoutTaxes.innerText = this.sharedFunctions.formatNumberToString(
      parseFloat(totalFormatted)
    )
  }

  updateLabelTotalTaxes(totalTaxes: number) {
    const totalFormatted = totalTaxes.toFixed(2)
    const lblTotalTaxes: HTMLSpanElement =
      document.querySelector('#lbl-total-taxes')
    lblTotalTaxes.innerText = this.sharedFunctions.formatNumberToString(
      parseFloat(totalFormatted)
    )
  }

  async searchVehicleOwner(client_id: number) {
    try {
      this.ClientService.getClientById(client_id).then((data) => {
        const oClient = data
      })
    } catch (error) {
      console.warn(error)
    }
  }

  async SetDataInForm() {
    try {
      const {
        txtYear,
        txtMileage,
        txtBrand,
        txtVehicleType,
        txtVehicleModel,
        txtClient,
        txtClientDocument,
        txtContract,
        txtCurrentQuota,
        txtConsumedQuota,
        txtInTransitQuota,
      } = this.frmWorkOrder.controls

      this.resetItemsToRoutine()
      this.resetMaintenanceItems()
      this.calculateTotalRoutine(this.lsMaintenanceItemsSelected)

      this.vehicleSelected = this.vehicleService.getVehicle()

      const VEHICLE_STATE_ACTIVE = 1
      if (!(this.vehicleSelected.vehicleState.id == VEHICLE_STATE_ACTIVE)) {
        throw new Error(
          'El vehículo que seleccionó se encuentra en un estado INACTIVO, por favor comuniquese con el administrador'
        )
      }

      this.contractService
        .getContractByVehicleId(this.vehicleSelected.id)
        .then((dataContract) => {
          this.contractSelected = dataContract

          if (this.contractSelected != null) {
            if (
              this.contractSelected.contractState.id != ConstractStates.ACTIVO
            ) {
              throw new Error(
                `El vehículo que intenta asociar cuenta con un contrato en estado: ${this.contractSelected.contractState.name} , por tal motivo, NO se puede generar una orden de trabajo. Por favor comuniquese con el administrador.`
              )
            }

            txtYear.setValue(this.vehicleSelected.year)
            txtMileage.setValue(
              this.sharedFunctions.formatNumberToString(
                this.vehicleSelected.mileage
              )
            )
            txtBrand.setValue(
              this.vehicleSelected.vehicleModel.brand.name.toUpperCase()
            )
            txtVehicleType.setValue(
              this.vehicleSelected.vehicleModel.type.name.toUpperCase()
            )
            txtVehicleModel.setValue(
              this.vehicleSelected.vehicleModel.shortName.toUpperCase()
            )
            txtClientDocument.setValue(this.contractSelected.client.document)
            txtClient.setValue(this.contractSelected.client.name.toUpperCase())
            const contractDescription = `${this.contractSelected.code} - ${this.contractSelected.name}`
            txtContract.setValue(contractDescription)
            this.vehicleModelSelected = this.vehicleSelected.vehicleModel

            this.quotaService
              .getFinancialInformationByClient(this.contractSelected.client.id)
              .then((data) => {
                if (data == null || data == undefined) {
                  throw new Error(
                    'El cliente no tiene un cupo asignado aún, por favor comuniquese con el administrador para que se realice la correspondiente gestión.'
                  )
                } else {
                  const financialInformation = data
                  txtCurrentQuota.setValue(
                    this.sharedFunctions.formatNumberToString(
                      parseFloat(financialInformation.currentQuota.toString())
                    )
                  )
                  txtConsumedQuota.setValue(
                    this.sharedFunctions.formatNumberToString(
                      parseFloat(financialInformation.consumedQuota.toString())
                    )
                  )
                  txtInTransitQuota.setValue(
                    this.sharedFunctions.formatNumberToString(
                      parseFloat(financialInformation.inTransitQuota.toString())
                    )
                  )
                }
              })
              .catch((error) => {
                this.clearFrmWorkOrder()
                this.resetItemsToRoutine()
                this.resetMaintenanceItems()
                this.resetMaintenanceRoutines()
                alert(error)
              })
          } else {
            throw new Error(
              'El vehículo que ingresó no tienen un contrato vínculado, por favor comuniquese con el administrador'
            )
          }
        })
        .catch((error) => {
          this.clearFrmWorkOrder()
          this.resetItemsToRoutine()
          this.resetMaintenanceItems()
          this.resetMaintenanceRoutines()
          alert(error)
        })
    } catch (error) {
      console.warn(error)
      alert(error)
    }
  }

  setBranchSelected() {
    this.branchSelected = this.branchService.getBranchSelected()
    if (this.branchSelected == null || this.branchSelected == undefined) {
      this.fieldBranchIsInvalid = true
    } else {
      this.fieldBranchIsInvalid = false
    }
  }

  showMaintenanceItems() {
    this.resetItemsToRoutine()
    this.routineSelected = this.maintenanceRoutineService.getRoutine()
    if (this.routineSelected == null || this.routineSelected == undefined) {
      this.fieldMaintenanceRoutineIsInvalid = true
    } else {
      this.fieldMaintenanceRoutineIsInvalid = false
      this.lsMaintenanceItems = this.routineSelected.lsItems
      this.getPricesByContract(this.contractSelected.id)
    }
  }

  getTextAmountId(pId: number) {
    return `txt_${pId}`
  }

  getCheckBoxId(pId: number) {
    return `chk_${pId}`
  }

  getPriceId(pId: number) {
    return `lbl_price_contract_${pId}`
  }

  pickItem(event: any, pItem: MaintenanceItem) {
    if (event.checked) {
      this.addItemToRoutine(pItem)
      this.enableTxtAmount(pItem)
    } else {
      this.deleteItemToRoutine(pItem)
      this.disableTxtAmount(pItem)
    }

    this.calculateTotalRoutine(this.lsMaintenanceItemsSelected)
  }

  enableTxtAmount(pItem: MaintenanceItem) {
    const idTxt = `#${this.getTextAmountId(pItem.id)}`
    const txtAmount: HTMLInputElement = document.querySelector(idTxt)
    txtAmount.value = pItem.amount.toString()
    txtAmount.disabled = false

    const totalByItemWithoutTaxes = pItem.amount * pItem.referencePrice

    let taxValue = 0
    if (pItem.handleTax) {
      taxValue = this.calculateTaxes(totalByItemWithoutTaxes, pItem.lsTaxes)
    }

    const idLabelPriceByAmount = `#${this.getLabePriceByAmountId(pItem.id)}`
    const labelPriceByAmount: HTMLSpanElement =
      document.querySelector(idLabelPriceByAmount)
    const totalWithoutTaxesFormatted = totalByItemWithoutTaxes.toFixed(2)
    labelPriceByAmount.innerText = this.sharedFunctions.formatNumberToString(
      parseFloat(totalWithoutTaxesFormatted)
    )

    const idLabelTax = `#${this.getLabeTaxesId(pItem.id)}`
    const labelTax: HTMLSpanElement = document.querySelector(idLabelTax)
    const taxesFormatted = taxValue.toFixed(2)
    labelTax.innerText = this.sharedFunctions.formatNumberToString(
      parseFloat(taxesFormatted)
    )

    const idLblTotalByItem = `#${this.getLabeTotalId(pItem.id)}`
    const lblPriceTotalByItem: HTMLElement =
      document.querySelector(idLblTotalByItem)

    const totalByItem = totalByItemWithoutTaxes + taxValue
    const totalFormatted = totalByItem.toFixed(2)
    lblPriceTotalByItem.innerText = this.sharedFunctions.formatNumberToString(
      parseFloat(totalFormatted)
    )
  }

  disableTxtAmount(pItem) {
    const idTxt = `#${this.getTextAmountId(pItem.id)}`
    const txtAmount: HTMLInputElement = document.querySelector(idTxt)
    txtAmount.value = '0'
    txtAmount.disabled = true

    const idLabelPriceByAmount = `#${this.getLabePriceByAmountId(pItem.id)}`
    const labelPriceByAmount: HTMLSpanElement =
      document.querySelector(idLabelPriceByAmount)
    labelPriceByAmount.innerText = ''

    const idLabelDiscount = `#${this.getLabelDiscountId(pItem.id)}`
    const labelDiscount: HTMLSpanElement =
      document.querySelector(idLabelDiscount)
    labelDiscount.innerText = ''

    const idLabelPriceWithoutDiscount = `#${this.getLabePriceByAmountLessDiscountId(
      pItem.id
    )}`
    const LabelPriceWithoutDiscount: HTMLSpanElement = document.querySelector(
      idLabelPriceWithoutDiscount
    )
    LabelPriceWithoutDiscount.innerText = ''

    const idLabelTax = `#${this.getLabeTaxesId(pItem.id)}`
    const labelTax: HTMLSpanElement = document.querySelector(idLabelTax)
    labelTax.innerText = ''

    const idLabelTotal = `#${this.getLabeTotalId(pItem.id)}`
    const lblPriceWithTaxes: HTMLElement = document.querySelector(idLabelTotal)
    lblPriceWithTaxes.innerText = ''
  }

  turnOnCheckbox(pItem: MaintenanceItem) {
    const idChkItem = `#${this.getCheckBoxId(pItem.id)}`
    const chkItem: HTMLInputElement = document.querySelector(idChkItem)
    chkItem.checked = true
  }

  resetItemsToRoutine() {
    this.lsMaintenanceItemsSelected = []
  }

  resetMaintenanceItems() {
    this.lsMaintenanceItems = []
  }

  resetMaintenanceRoutines() {
    this.vehicleModelSelected = new VehicleModel()
    this.vehicleModelSelected.id = 0
    this.vehicleService.setVehicleModelSelected(null)
  }

  addItemToRoutine(item: MaintenanceItem) {
    if (
      this.lsMaintenanceItemsSelected == null ||
      this.lsMaintenanceItemsSelected == undefined
    ) {
      this.resetItemsToRoutine()
    }
    const totalByItemWithoutTaxes = item.amount * item.referencePrice
    let taxValue = 0
    if (item.handleTax) {
      taxValue = this.calculateTaxes(totalByItemWithoutTaxes, item.lsTaxes)
    }
    item.taxesValue = parseFloat(taxValue.toFixed(2))
    this.lsMaintenanceItemsSelected.push(item)
  }

  deleteItemToRoutine(item: MaintenanceItem) {
    const itemTMP = this.lsMaintenanceItemsSelected.find(
      (it) => it.id == item.id
    )
    const indexOfItem = this.lsMaintenanceItemsSelected.indexOf(itemTMP)
    this.lsMaintenanceItemsSelected.splice(indexOfItem, 1)
  }

  updateAmountByItem(event: any, pItem: MaintenanceItem) {
    const amount = event.target.value
    if (amount < 0.1) {
      alert('La cantidad ingresada no es válida')
      event.target.value = 0.1
      event.preventDefault()
      return false
    } else {
      this.lsMaintenanceItemsSelected.find(
        (item) => item.id == pItem.id
      ).amount = amount
      const mItem = this.lsMaintenanceItemsSelected.find(
        (item) => item.id == pItem.id
      )
      this.updateLabelTotalItem(mItem)
      this.calculateTotalRoutine(this.lsMaintenanceItemsSelected)
    }
  }

  updateLabelPriceByAmount(mItem: MaintenanceItem) {
    const totalByItemWithoutTaxes = mItem.amount * mItem.referencePrice
    this.setTotalWithoutTaxesByItem(mItem.id, totalByItemWithoutTaxes)
  }

  updateLabelTotalItem(mItem: MaintenanceItem) {
    const totalByItemWithoutTaxes = mItem.amount * mItem.referencePrice
    this.setTotalWithoutTaxesByItem(mItem.id, totalByItemWithoutTaxes)
  }

  clearFrmWorkOrder() {
    this.frmWorkOrder.reset()
    this.fieldBranchIsInvalid = true
    this.fieldMaintenanceRoutineIsInvalid = true
  }

  formatNumberToString(oNumber: number) {
    return this.sharedFunctions.formatNumberToString(oNumber)
  }

  getValueWithoutTaxesByItem(idItem: number): number {
    try {
      const idSpanWithoutTaxes = `#${this.getLabePriceByAmountId(idItem)}`
      const spanWithoutTaxes: HTMLSpanElement =
        document.querySelector(idSpanWithoutTaxes)
      return parseFloat(spanWithoutTaxes.innerText.replace(/,/g, ''))
    } catch (error) {
      console.warn('[getValueWithoutTaxesByItem]', error)
    }
  }

  getValueTaxesByItem(idItem: number): number {
    try {
      const idSpanTax = `#${this.getLabeTaxesId(idItem)}`
      const spanTaxes: HTMLSpanElement = document.querySelector(idSpanTax)
      return parseFloat(spanTaxes.innerText.replace(/,/g, ''))
    } catch (error) {
      console.warn('[getValueTaxesByItem]', error)
    }
  }

  getValueTotalByItem(idItem: number): number {
    try {
      const idItemReference = `#${this.getLabeTotalId(idItem)}`
      const spanElemt: HTMLSpanElement = document.querySelector(idItemReference)
      return parseFloat(spanElemt.innerText.replace(/,/g, ''))
    } catch (error) {
      console.warn('[getValueTotalByItem]', error)
    }
  }

  calculateTotalRoutine(lsMaintenanceItemsSelected: MaintenanceItem[]) {
    try {
      this.totalRoutine = 0
      this.totalTaxes = 0
      this.totalWithoutTaxes = 0
      this.totalWithoutTaxesAndDiscount = 0
      this.totalDiscount = 0

      lsMaintenanceItemsSelected.forEach((item) => {
        const valueWithoutTaxes = this.getValueWithoutTaxesByItem(item.id)
        this.totalWithoutTaxes += valueWithoutTaxes
      })
      this.updateLabelWithoutTaxes(this.totalWithoutTaxes)

      this.calculateDiscount(this.lsMaintenanceItemsSelected)
    } catch (error) {
      console.warn(error)
    }
  }

  async saveWorkOrder() {
    try {
      if (
        confirm('¿Está seguro de guardar los datos de esta órden de trabajo?')
      ) {
        const trxWorkOrder = this.setDataToWorkOrder()

        this.isAwaiting = true
        const financialInformationByClient =
          await this.quotaService.getFinancialInformationByClient(
            trxWorkOrder.client.id
          )
        const trxWillBePorcesed =
          parseFloat(financialInformationByClient.currentQuota.toString()) -
            trxWorkOrder.value >
          0
            ? true
            : false
        if (trxWillBePorcesed) {
          await this.transactionService
            .processTransaction(trxWorkOrder)
            .subscribe((response) => {
              const rta = response
              if (rta.response) {
                alert(rta.message)
                this.clearBufferForm()
                this.workOrderWasSaved.emit(true)
              }
            })
        } else {
          alert(
            '¡No se puede procesar esta órden de trabajo puesto que el cliente no cuenta con el suficiente cupo disponible!'
          )
        }
        this.isAwaiting = false
      }
    } catch (error) {
      console.warn(error)
    }
  }

  setDataToWorkOrder(): Transaction {
    try {
      const { txtObservation, txtMileage } = this.frmWorkOrder.controls
      const trxWorkOrder = new Transaction()
      trxWorkOrder.movement = this.lsMovements.find(
        (mv) => mv.id == this.ORDEN_DE_TRABAJO
      )

      trxWorkOrder.valueWithoutDiscount = this.totalWithoutTaxes
      trxWorkOrder.discountValue = this.totalDiscount
      trxWorkOrder.valueWithDiscountWithoutTaxes =
        this.totalWithoutTaxesAndDiscount
      trxWorkOrder.taxesValue = this.totalTaxes
      trxWorkOrder.value = this.totalRoutine
      trxWorkOrder.client = this.contractSelected.client
      trxWorkOrder.usu_id = SecurityValidators.validateUserLogged()

      const trxDetail = new TransactionDetail()
      trxDetail.dealer = this.dealer

      if (this.branchSelected == null || this.branchSelected == undefined) {
        throw new Error(
          'La sucursal es un dato obligatorio para poder cerrar la orden de trabajo'
        )
      } else {
        trxDetail.branch = this.branchSelected
      }

      if (this.vehicleSelected == null || this.vehicleSelected == undefined) {
        throw new Error(
          'El vehículo ingresado no es válido, por favor rectifique la placa'
        )
      } else {
        trxDetail.vehicle = this.vehicleSelected
        const currentMileage = txtMileage.value
        trxDetail.vehicle.mileage = currentMileage.replace(/\,/g, '')
      }

      if (this.routineSelected == null || this.routineSelected == undefined) {
        this.fieldMaintenanceRoutineIsInvalid = true
      } else {
        trxDetail.maintenanceRoutine = this.routineSelected
      }

      trxDetail.contract = this.contractSelected

      trxWorkOrder.headerDetails = trxDetail
      trxWorkOrder.lsItems = this.lsMaintenanceItemsSelected

      const aObservation = []

      const observation = new TransactionObservation()
      const observationDesc = txtObservation.value

      if (observationDesc.toString().trim() != '') {
        observation.description = observationDesc
        observation.usu_id = SecurityValidators.validateUserLogged()
        aObservation.push(observation)
      }

      trxWorkOrder.lsObservations = aObservation

      return trxWorkOrder
    } catch (error) {
      alert(error)
      return null
    }
  }

  formatMileageToString(event: any) {
    const numberToTransform = event.target.value.toString().replace(/\,/g, '')

    event.target.value = this.formatNumberToString(numberToTransform)
  }

  closeWorkOrder() {
    if (
      confirm(
        '¿está seguro que desea cerrar la orden de trabajo?, sí lo realiza se perderan todos los cambios consignados acá'
      )
    ) {
      this.clearFrmWorkOrder()
      this.clearBufferForm()
      this.workOrderWasCanceled.emit(true)
    }
  }

  calculateTaxes(referencePrice: number, lsTaxes: Tax[]): number {
    let taxValue = 0
    for (const tax of lsTaxes) {
      const taxTmp = referencePrice * (tax.percentValue / 100)
      taxValue += taxTmp
    }
    return taxValue
  }

  setTaxesValue(item_id: number, taxesValue: number) {
    try {
      const idLblTaxes = `#${this.getLabeTaxesId(item_id)}`
      const labelTaxes: HTMLSpanElement = document.querySelector(idLblTaxes)
      const taxesFormatted = this.sharedFunctions.formatNumberToString(
        parseFloat(taxesValue.toFixed(2))
      )
      labelTaxes.innerText = taxesFormatted
    } catch (error) {
      console.warn(error)
    }
  }

  setTotalValue(item_id: number, totalValue: number) {
    try {
      const idLblTotal = `#${this.getLabeTotalId(item_id)}`
      const labelTotal: HTMLSpanElement = document.querySelector(idLblTotal)

      const totalFormatted = this.sharedFunctions.formatNumberToString(
        parseFloat(totalValue.toFixed(2))
      )
      labelTotal.innerText = totalFormatted
    } catch (error) {
      console.warn(error)
    }
  }

  closePopUp(idPopUp) {
    const popUp = document.getElementById(idPopUp)
    popUp.style.display = 'none'
  }

  openPopUp(idPopUp) {
    this.oCountChanges += 1
    const popUp = document.getElementById(idPopUp)
    popUp.style.display = 'block'
  }

  goToUp() {
    window.scroll(0, 0)
  }

  addNewMaintenanceItemsToRoutine(maintenanceItemsToAdd: MaintenanceItem[]) {
    maintenanceItemsToAdd.forEach((newItem) => {
      try {
        const exitsItem = this.lsMaintenanceItemsSelected.find(
          (it) => it.id == newItem.id
        )
        if (exitsItem) {
          console.warn(
            '[addNewMaintenanceItemsToRoutine]: Ya existe el item seleccionado en la rutina'
          )
        } else {
          newItem.amount = 1
          this.lsMaintenanceItems.push(newItem)
          setTimeout(() => {
            this.addItemToRoutine(newItem)
            this.enableTxtAmount(newItem)
            this.turnOnCheckbox(newItem)
            this.calculateTotalRoutine(this.lsMaintenanceItemsSelected)
          }, 300)
        }
      } catch (error) {
        console.warn(error)
      }
    })

    window.scroll(0, 1000)
    this.closePopUp('container__addItems')
  }

  getTotalWithoutTaxes() {
    let totalWithoutTaxes = 0
    const lblTotalWithoutTaxes: HTMLSpanElement = document.querySelector(
      '#lbl-total-without-taxes'
    )
    totalWithoutTaxes = parseFloat(
      lblTotalWithoutTaxes.innerText.replace(/,/g, '')
    )
    return totalWithoutTaxes
  }

  calculateDiscount(lsItemsSelected: MaintenanceItem[]) {
    try {
      this.totalDiscount = 0
      const totalWithoutTaxes = this.getTotalWithoutTaxes()

      switch (this.contractSelected.discountType.id) {
        case DiscountTypes.PORCENTAJE_POR__TOTAL_MANTENIMIENTO:
          this.totalDiscount =
            totalWithoutTaxes * (this.contractSelected.discountValue / 100)
          break
        case DiscountTypes.VALOR_FIJO_POR_TOTAL_MANTENIMIENTO:
          this.totalDiscount = this.contractSelected.discountValue
          break
      }

      this.updateLabelDiscount(this.totalDiscount)
      this.calculateDiscountAndTaxesByItem(
        totalWithoutTaxes,
        this.totalDiscount
      )

      this.totalRoutine = this.totalWithoutTaxesAndDiscount + this.totalTaxes

      this.updateLabelTotalRoutine(this.totalRoutine)
    } catch (error) {
      console.warn(error)
    }
  }

  calculateDiscountAndTaxesByItem(
    totalWithoutTaxes: number,
    totalDiscount: number
  ) {
    try {
      let valueWithoutTaxesAndDiscount = 0
      let valueTotaTaxes = 0

      this.lsMaintenanceItemsSelected.forEach((item) => {
        let discountByItem = 0
        const valueWithoutTaxesByItem = item.referencePrice * item.amount
        item.valueWithoutDiscount = valueWithoutTaxesByItem

        if (totalDiscount > 0) {
          const participationPercent =
            valueWithoutTaxesByItem / totalWithoutTaxes

          discountByItem = participationPercent * totalDiscount
        }
        item.discountValue = discountByItem
        this.setDiscountByItem(item.id, discountByItem)

        const totalWithoutTaxesAndDiscountByItem =
          valueWithoutTaxesByItem - discountByItem
        item.valueWithDiscountWithoutTaxes = totalWithoutTaxesAndDiscountByItem
        valueWithoutTaxesAndDiscount += totalWithoutTaxesAndDiscountByItem
        this.setTotalWithoutTaxesAndDiscountByItem(
          item.id,
          totalWithoutTaxesAndDiscountByItem
        )

        let taxValue = 0
        if (item.handleTax) {
          taxValue = this.calculateTaxes(
            totalWithoutTaxesAndDiscountByItem,
            item.lsTaxes
          )
        }
        item.taxesValue = taxValue
        valueTotaTaxes += taxValue
        this.setTaxesValue(item.id, taxValue)

        const totalByItem = totalWithoutTaxesAndDiscountByItem + taxValue
        this.setTotalByItem(item.id, totalByItem)
      })

      this.totalTaxes = valueTotaTaxes
      this.totalWithoutTaxesAndDiscount = valueWithoutTaxesAndDiscount
      this.updateLabelWithoutTaxesAndDiscount(valueWithoutTaxesAndDiscount)
      this.updateLabelTotalTaxes(this.totalTaxes)
    } catch (error) {
      console.warn(error)
    }
  }

  setTotalWithoutTaxesByItem(idItem: number, totalByItemWithoutTaxes: number) {
    try {
      const idTotalWithoutTaxes = `#${this.getLabePriceByAmountId(idItem)}`
      const labelTotalWithoutTaxes: HTMLSpanElement =
        document.querySelector(idTotalWithoutTaxes)
      const totalwithoutTaxesFormatted = totalByItemWithoutTaxes.toFixed(2)
      labelTotalWithoutTaxes.innerText =
        this.sharedFunctions.formatNumberToString(
          parseFloat(totalwithoutTaxesFormatted)
        )
    } catch (error) {
      console.warn(error)
    }
  }

  setDiscountByItem(idItem: number, discount: number) {
    try {
      const idDiscountByItem = `#${this.getLabelDiscountId(idItem)}`
      const labelDiscountByItem: HTMLSpanElement =
        document.querySelector(idDiscountByItem)
      const discountFormatted = discount.toFixed(2)
      labelDiscountByItem.innerText = this.sharedFunctions.formatNumberToString(
        parseFloat(discountFormatted)
      )
    } catch (error) {
      console.warn(error)
    }
  }

  setTotalWithoutTaxesAndDiscountByItem(
    idItem: number,
    totalByItemWithoutTaxesAndDiscount: number
  ) {
    try {
      const idTotalWithoutTaxesAndDiscount = `#${this.getLabePriceByAmountLessDiscountId(
        idItem
      )}`
      const labelTotalWithoutTaxesAndDiscount: HTMLSpanElement =
        document.querySelector(idTotalWithoutTaxesAndDiscount)
      const totalByItemWithoutTaxesAndDiscountFormatted =
        totalByItemWithoutTaxesAndDiscount.toFixed(2)
      labelTotalWithoutTaxesAndDiscount.innerText =
        this.sharedFunctions.formatNumberToString(
          parseFloat(totalByItemWithoutTaxesAndDiscountFormatted)
        )
    } catch (error) {
      console.warn(error)
    }
  }

  setTotalByItem(idItem: number, totalByItem: number) {
    try {
      const idTotalByItem = this.getLabeTotalId(idItem)
      const labelTotalByItem: HTMLElement = document.querySelector(
        `#${idTotalByItem}`
      )
      const TotalFormatted = totalByItem.toFixed(2)
      labelTotalByItem.innerText = this.sharedFunctions.formatNumberToString(
        parseFloat(TotalFormatted)
      )
    } catch (error) {
      console.warn(error)
    }
  }

  updateLabelDiscount(totalDiscount: number) {
    const totalDiscountFormatted = totalDiscount.toFixed(2)
    const lblTotalDiscount: HTMLSpanElement = document.querySelector(
      '#lbl-total-discount'
    )
    lblTotalDiscount.innerText = `-${this.sharedFunctions.formatNumberToString(
      parseFloat(totalDiscountFormatted)
    )}`
  }

  updateLabelWithoutTaxesAndDiscount(totalWithoutTaxesAndDiscount: number) {
    const totalWithoutTaxesAndDiscountFormatted =
      totalWithoutTaxesAndDiscount.toFixed(2)
    const lblTotalWithoutTaxesDiscount: HTMLSpanElement =
      document.querySelector('#lbl-total-without-taxes-and-discount')
    lblTotalWithoutTaxesDiscount.innerText =
      this.sharedFunctions.formatNumberToString(
        parseFloat(totalWithoutTaxesAndDiscountFormatted)
      )
  }
}
