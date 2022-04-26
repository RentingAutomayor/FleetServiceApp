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
import { MaintenanceItemManagerService } from 'src/app/SharedComponents/Services/MaintenanceItemManager/maintenance-item-manager.service'
import { Router } from '@angular/router'
import { ITransactionValues } from 'src/app/Models/transactionValues.model'
import { NotificationService } from 'src/app/SharedComponents/Services/Notification/notification.service'
import { EmailBody } from 'src/app/Models/Emailbody'
import { Client } from 'src/app/Models/Client'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-work-order',
  templateUrl: './work-order.component.html',
  styleUrls: [
    './work-order.component.scss',
    '../../../../../assets/styles/app.scss',
  ],
})
export class WorkOrderComponent implements OnInit, OnChanges {
  oCountChanges: number
  frmWorkOrder: FormGroup
  dealer: Dealer
  branchSelected: Branch

  vehicleModelSelected: VehicleModel
  routineSelected: MaintenanceRoutine

  pricesByContract: PricesByContract
  sharedFunctions: SharedFunction

  lsMaintenanceItems: MaintenanceItem[] = []
  lsMaintenanceItemsSelected: MaintenanceItem[] = []

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

  contractSelected: Contract

  isErrorVisible = false
  errorTitle = ''
  errorMessageApi = ''

  constructor(
    private ClientService: ClientService,
    private vehicleService: VehicleService,
    private contractService: ContractService,
    private branchService: BranchService,
    private maintenanceRoutineService: MaintenanceRoutineService,
    private maintenanceItemService: MaintenanceItemService,
    private notificationService: NotificationService,
    private movementService: MovementService,
    private transactionService: TransactionService,
    private quotaService: QuotaService,
    private dealerService: DealerService,
    private maintenanceItemManagerService: MaintenanceItemManagerService,
    private router: Router
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
    this.getDealer()
  }

  ngOnInit(): void {
    this.getDealer()
    this.initComponents()
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
    this.maintenanceItemService
      .getPricesByContract(contract_id)
      .subscribe((pricesByContract) => {
        this.pricesByContract = pricesByContract

        try {
          const contractualInformationByClient =
            this.contractSelected.client.contractualInformation

          if (!contractualInformationByClient) {
            throw Error(
              'El cliente aún no tiene configurado un contrato con Renting Automayor, por favor comuniquese con el administrador de la plataforma.'
            )
          }
        } catch (error) {
          this.clearFrmWorkOrder()
          this.resetItemsToRoutine()
          this.resetMaintenanceItems()
          this.resetMaintenanceRoutines()
          this.isErrorVisible = true
          this.errorTitle =
            'Error validando la información del cliente asociado a la placa'
          this.errorMessageApi = error
        }
      })
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

            this.getPricesByContract(this.contractSelected.id)

            this.quotaService
              .getFinancialInformationByClient(this.contractSelected.client.id)
              .subscribe(
                (data) => {
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
                        parseFloat(
                          financialInformation.consumedQuota.toString()
                        )
                      )
                    )
                    txtInTransitQuota.setValue(
                      this.sharedFunctions.formatNumberToString(
                        parseFloat(
                          financialInformation.inTransitQuota.toString()
                        )
                      )
                    )
                  }
                },
                (err) => {
                  this.clearFrmWorkOrder()
                  this.resetItemsToRoutine()
                  this.resetMaintenanceItems()
                  this.resetMaintenanceRoutines()
                  this.isErrorVisible = true
                  this.errorTitle =
                    'Error validando la información del cliente.'
                  this.errorMessageApi = err
                }
              )
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
          this.isErrorVisible = true
          this.errorTitle = 'Error validando la información del vehículo'
          this.errorMessageApi = error
        })
    } catch (error) {
      console.warn(error)
      this.isErrorVisible = true
      this.errorTitle = 'Error validando la información del vehículo'
      this.errorMessageApi = error
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

  showMaintenanceItems(maintenanceRoutine: MaintenanceRoutine) {
    this.resetItemsToRoutine()
    this.routineSelected = maintenanceRoutine
    if (this.routineSelected == null || this.routineSelected == undefined) {
      this.fieldMaintenanceRoutineIsInvalid = true
      this.lsMaintenanceItems = []
      this.lsMaintenanceItemsSelected = []
    } else {
      let ItemRA = null
      this.maintenanceItemService
        .getItemRAAdministration()
        .subscribe((itemRa) => {
          ItemRA = itemRa
          this.fieldMaintenanceRoutineIsInvalid = false
          this.lsMaintenanceItems = maintenanceRoutine.lsItems
          this.lsMaintenanceItems.push(ItemRA)
          this.lsMaintenanceItemsSelected = this.lsMaintenanceItems

          this.updateReferencePrices(
            this.lsMaintenanceItems,
            this.pricesByContract.lsMaintenanceItems
          )
        })
    }
  }

  updateReferencePrices(
    referenceItems: MaintenanceItem[],
    contractItems: MaintenanceItem[]
  ) {
    const itemsContractFiltered = []

    referenceItems.forEach((itr) => {
      try {
        const itemByCntr = contractItems.find((mi) => mi.id == itr.id)
        itemsContractFiltered.push(itemByCntr)
      } catch {
        console.log(`no se encontro item
        para actualizar precio`)
      }
    })

    console.log(`updateReferencePrices`)
    console.log(itemsContractFiltered)

    this.lsMaintenanceItems = this.maintenanceItemManagerService.updatePrices(
      referenceItems,
      itemsContractFiltered
    )
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
    this.lsMaintenanceItemsSelected.push(item)
  }

  deleteItemToRoutine(item: MaintenanceItem) {
    const itemTMP = this.lsMaintenanceItemsSelected.find(
      (it) => it.id == item.id
    )
    const indexOfItem = this.lsMaintenanceItemsSelected.indexOf(itemTMP)
    this.lsMaintenanceItemsSelected.splice(indexOfItem, 1)
  }

  clearFrmWorkOrder() {
    this.frmWorkOrder.reset()
    this.fieldBranchIsInvalid = true
    this.fieldMaintenanceRoutineIsInvalid = true
  }

  formatNumberToString(oNumber: number) {
    return this.sharedFunctions.formatNumberToString(oNumber)
  }


  async sendEmail(args? : Transaction) {

    const {contacts} : Client = await this.ClientService.getClientById(this.contractSelected.client.id);

    const trxresptmp : Transaction[] = await this.transactionService.getTransactionsByDealerOrClient(
      args.headerDetails.dealer.id,
      null,
      null,
      null,
      null,
      null,
      null
      ).toPromise();

    const emailBody : EmailBody = {
      nameMessage: 'Fleet Service',
      emailReceiver: contacts.filter (c => c.mustNotify == true).map (c => c.email),
      typemessage: args.movement.id,
      nOrderwork: trxresptmp[0].code,
      nDealer: args.headerDetails.dealer.name
    };

    if(emailBody.emailReceiver.length > 0){
      this.notificationService.sendMail(emailBody).subscribe((res) =>{
      });
    }
  }

  async saveWorkOrder() {
    try {
      if (
        confirm('¿Está seguro de guardar los datos de esta órden de trabajo?')
      ) {
        const trxWorkOrder = this.setDataToWorkOrder()

        this.isAwaiting = true

        this.quotaService
          .getFinancialInformationByClient(trxWorkOrder.client.id)
          .subscribe((finInfo) => {
            const trxWillBePorcesed =
              parseFloat(finInfo.currentQuota.toString()) - trxWorkOrder.value >
              0
                ? true
                : false

            if (trxWillBePorcesed) {
              this.transactionService
                .processTransaction(trxWorkOrder)
                .subscribe((response) => {
                  const rta = response
                  if (rta.response) {
                    this.sendEmail(trxWorkOrder);
                    Swal.fire({
                      position: 'center',
                      icon: 'success',
                      title: rta.message,
                      showConfirmButton: true,
                    })
                    this.clearBufferForm()
                    this.isAwaiting = false
                    this.workOrderWasSaved.emit(true)
                  }
                })
            } else {
              this.isAwaiting = false
              this.isErrorVisible = true
              this.errorTitle = 'Error intentando procesar la órden de trabajo'
              this.errorMessageApi =
                '¡No se puede procesar esta órden de trabajo puesto que el cliente no cuenta con el suficiente cupo disponible!'
            }
          })
      }
    } catch (error) {
      console.warn(error)
      this.isErrorVisible = true
      this.errorTitle = 'Error intentando procesar la órden de trabajo'
      this.errorMessageApi = error
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
      this.isErrorVisible = true
      this.errorTitle = 'Error inentando procesar la órden de trabajo.'
      this.errorMessageApi = error
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
        const exitsItem = this.lsMaintenanceItems.find(
          (it) => it.id == newItem.id
        )
        if (exitsItem) {
          console.warn(
            '[addNewMaintenanceItemsToRoutine]: Ya existe el item seleccionado en la rutina'
          )
        } else {
          newItem.amount = 0
          this.lsMaintenanceItems.unshift(newItem)
        }
      } catch (error) {
        console.warn(error)
      }
    })

    window.scroll(0, 1000)
    this.closePopUp('container__addItems')
  }

  calculateDiscount(lsItemsSelected: MaintenanceItem[]) {}

  setItemsToRoutine(maintenanceItems: MaintenanceItem[]) {
    this.lsMaintenanceItemsSelected = maintenanceItems
    console.log(`Items selecccionados para la rutina`)
    console.log(this.lsMaintenanceItemsSelected)
  }

  setTotalRoutine(transactionValues: ITransactionValues) {
    this.totalWithoutTaxesAndDiscount =
      transactionValues.valueWithDiscountWithoutTaxes
    this.totalWithoutTaxes = transactionValues.valueWithoutDiscount
    this.totalTaxes = transactionValues.taxesValue
    this.totalDiscount = transactionValues.discountValue
    this.totalRoutine = transactionValues.value
  }

  closeErrorMessage() {
    this.isErrorVisible = false
    this.workOrderWasCanceled.emit(true)
  }
}
