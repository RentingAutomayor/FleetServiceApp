import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Client } from 'src/app/Models/Client'
import { Contract } from 'src/app/Models/Contract'
import { ContractState, ConstractStates } from 'src/app/Models/ContractState'
import { VehicleModel } from 'src/app/Models/VehicleModel'
import { ClientService } from 'src/app/Modules/client/Services/Client/client.service'
import { Dealer } from 'src/app/Models/Dealer'
import { DealerService } from '../../../dealer/Services/Dealer/dealer.service'
import { ContractService } from '../../Services/Contract/contract.service'
import { ActivatedRoute, Router } from '@angular/router'
import { SecurityValidators } from 'src/app/Models/SecurityValidators'
import { Company } from 'src/app/Models/Company'
import { CompanyType } from 'src/app/Models/CompanyType'
import { InputValidator } from 'src/app/Utils/InputValidator'
import { DiscountType, DiscountTypes } from 'src/app/Models/DiscountType'
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem'
import { ActionType } from 'src/app/Models/ActionType'
import { ContractStateService } from '../../Services/contract-state.service'
import { Vehicle } from 'src/app/Models/Vehicle'
import { getFromStorage } from 'src/app/Utils/storage'
import { Action } from 'rxjs/internal/scheduler/Action'
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss'],
})
export class ContractComponent implements OnInit, OnChanges {
  frmContract: FormGroup
  @Input() countChanges: number
  @Input() contractIsToUpdate: boolean
  @Output() contractWasSetted = new EventEmitter<boolean>()

  oChangeDealer: number

  contract: Contract
  contractToUpdate: Contract
  lsVehicleModelsTemp: VehicleModel[] = []
  dtStartingDate: Date
  dtEndingDate: Date
  isToUpdate: boolean
  oGetPricesOfContract: number
  disableDealerField: boolean
  company: Company
  clientFieldIsInvalid: boolean
  dealerFieldIsInvalid: boolean
  contracStateFieldIsInvalid: boolean
  discountFieldIsInvalid: boolean

  lsMaintenanceItemsTemp: MaintenanceItem[]
  disableClientField: boolean
  disableTypeOfDiscoutnField: boolean
  disableVehicleTypesAndVehicleModels: boolean
  disableVehicles: boolean
  buttonSaveIsDisable: boolean
  disableCmbState: boolean
  isAwaiting: boolean
  action: ActionType

  modelsToFilter: VehicleModel[] = []
  clientToFilter: Client | undefined = undefined

  client: Client | undefined = undefined
  dealer: Dealer | undefined = undefined
  contractState: ContractState 
  discountType: DiscountType | undefined = undefined
  discountValue: number = 0
  vehicles: Vehicle[] = []
  maintenanceItems: MaintenanceItem[] = []

  isErrorVisible: boolean = false
  errorTitle: string = ''
  errorDescription: string = ''

  constructor(
    private clientService: ClientService,
    private dealerService: DealerService,
    private contractService: ContractService,
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private contracStateService: ContractStateService
  ) {
    const now = new Date()
    const monthfuture = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      now.getDay()
    )
    this.dtStartingDate = now
    this.dtEndingDate = now
    this.buildContractForm()
    this.clientFieldIsInvalid = false
    this.dealerFieldIsInvalid = false
    this.contracStateFieldIsInvalid = false
    this.discountFieldIsInvalid = false
    this.lsMaintenanceItemsTemp = []
    this.disableClientField = false
    this.disableTypeOfDiscoutnField = false
    this.disableVehicles = false
    this.buttonSaveIsDisable = false
    this.disableCmbState = false

    this.contracStateService.client$.subscribe((client) => {
      this.client = client
      if (this.client) {
        this.clientFieldIsInvalid = false
      } else {
        this.clientFieldIsInvalid = true
      }
    })

    this.contracStateService.dealer$.subscribe((dealer) => {
      this.dealer = dealer
      if (this.dealer) {
        this.dealerFieldIsInvalid = false
      } else {
        this.dealerFieldIsInvalid = true
      }
    })

    this.contracStateService.contractState$.subscribe((state) => {
      this.contractState = state
    })

    this.contracStateService.discountType$.subscribe((type) => {
      this.discountType = type
      this.validateDiscountValues()
    })

    this.contracStateService.discountValue$.subscribe((value) => {
      this.discountValue = value
    })

    this.contracStateService.vehicleModel$.subscribe((vehicleModels) => {
      this.modelsToFilter = vehicleModels
    })

    this.contracStateService.vehicles$.subscribe((vechicle) => {
      this.vehicles = vechicle
    })

    this.contracStateService.maintenanceItems$.subscribe((items) => {
      this.maintenanceItems = items
    })

    this.frmContract.controls.discountValue.valueChanges.subscribe((value) => {
      this.contracStateService.setDiscountValue(value)
      this.validateDiscountValues()
    })
  }

  buildContractForm() {
    this.frmContract = this.formBuilder.group({
      name: [''],
      duration: ['', [Validators.required]],
      startingDate: ['', [Validators.required]],
      endingDate: ['', [Validators.required]],
      discountValue: ['', [Validators.required]],
      observation: [''],
      amountVehicles: ['', [Validators.required]],
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.validateCompanyLogged()
  }

  ngOnInit(): void {
    this.extractParamsFromURL()
    this.getInitContractState();
    this.initComponents()
  }

  extractParamsFromURL() {
    try {
      this.activatedRoute.params.subscribe((params) => {
        console.log(`parametros`)
        console.log(params)
        const keys = Object.keys(params)
        if (keys.length > 0) {
          const contractID = params['id']
          this.getContractByID(contractID)
        } else {
          console.log('No debe buscar nada y debe resetear valores')
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  getContractByID(contractID: number) {
    this.isAwaiting = true
    this.contractService.getContractByID(contractID).subscribe({
      next: (contractData) => {
        this.contractToUpdate = contractData
        console.log(`getContractByID`)
        console.log(this.contractToUpdate)
        if (this.contractToUpdate) {
          this.contracStateService.setClientToContract(
            this.contractToUpdate.client
          )

          this.contracStateService.setDealerToContract(
            this.contractToUpdate.dealer
          )


          this.contracStateService.setDiscountType(
            this.contractToUpdate.discountType
          )

          this.contracStateService.setDiscountValue(
            this.contractToUpdate.discountValue
          )

          this.contractToUpdate.lsVehicleModels.forEach((veicleModel) => {
            this.contracStateService.addVehicleModelToList(veicleModel)
          })

          this.contractToUpdate.lsVehicles.forEach((veh) =>
            this.contracStateService.addVehicleToList(veh)
          )
          this.validateContractToUpdate()
        }
        this.isAwaiting = false
      },
      error: (err) => {
        this.isAwaiting = false
        this.isErrorVisible = true
        this.errorTitle = `Ocurrió un error intentando consultar el contrato`
        this.errorDescription = `${err.error.Message}`
      },
    })
  }

  get contractNameField() {
    return this.frmContract.get('name')
  }

  get durationField() {
    return this.frmContract.get('duration')
  }

  get startingDateField() {
    return this.frmContract.get('startingDate')
  }

  get endingDateField() {
    return this.frmContract.get('endingDate')
  }

  get discountValueField() {
    return this.frmContract.get('discountValue')
  }

  get observationField() {
    return this.frmContract.get('observation')
  }

  get amountVehiclesField() {
    return this.frmContract.get('amountVehicles')
  }

  initComponents() {
    const actionToPerform = getFromStorage('actionToPerform')
    this.action = parseInt(actionToPerform)

    this.validateCompanyLogged()
    this.oChangeDealer = 0

    this.isAwaiting = false
    this.contract = new Contract()

    this.enableOrDisableForm()
  }

  async getInitContractState(){
    //malisima practica - cambiar
    this.contractService.getContractinitState().subscribe(data => {
      this.contractState = data
      console.log(this.contractState)
    })
  }

  async validateCompanyLogged() {
    try {
      this.company = SecurityValidators.validateUserAndCompany()
      switch (this.company.type) {
        case CompanyType.DEALER:
          this.disableDealerField = true
          this.dealerService
            .getDealerById(this.company.id)
            .subscribe((dataDealer) => {
              this.dealerService.setDealerSelected(dataDealer)
            })

          break
        case CompanyType.CLIENT:
          break
        default:
          this.disableDealerField = false

          break
      }
    } catch (error) {
      console.warn(error)
    }
  }

  validateContractToUpdate() {
    if (this.contractToUpdate != null && this.contractToUpdate != undefined) {
      this.isToUpdate = true
      this.setDataInForm(this.contractToUpdate)
    } else {
      this.resetContractData()
    }
  }

  setClientSelected() {
    this.contract.client = this.clientService.getClientSelected()
    this.clientToFilter = this.contract.client
    this.contracStateService.setClientToContract(this.clientToFilter)

    if (this.contract.client == null || this.contract.client == undefined) {
      this.clientFieldIsInvalid = true
    } else {
      this.clientFieldIsInvalid = false
    }
  }

  setDealerSelected() {
    this.contract.dealer = this.dealerService.getDealerSelected()
    this.contracStateService.setDealerToContract(this.contract.dealer)

    if (this.contract.dealer == null || this.contract.dealer == undefined) {
      this.dealerFieldIsInvalid = true
    } else {
      this.dealerFieldIsInvalid = false
    }
  }

  calculateEndingDate() {
    const { duration, startingDate, endingDate } = this.frmContract.controls
    let dTmp = startingDate.value
    let pStartingDate = null

    try {
      pStartingDate = this.formatDate(dTmp.toISOString().substring(0, 10))
    } catch (error) {
      dTmp = `${startingDate.value}`

      pStartingDate = this.formatDate(dTmp.substr(0, 10))
    }

    const durationTmp = duration.value

    const endingDateTmp = new Date(
      pStartingDate.getFullYear(),
      pStartingDate.getMonth() - 1,
      pStartingDate.getDate()
    )
    endingDateTmp.setMonth(endingDateTmp.getMonth() + durationTmp)

    const strEndDate = endingDateTmp.toISOString().substring(0, 10)
    this.dtEndingDate = endingDateTmp
  }

  setDataInForm(pContract: Contract) {
    this.frmContract.patchValue(pContract)

    this.dtStartingDate = this.formatDate(
      pContract.startingDate.toString().substr(0, 10)
    )
    this.dtEndingDate = this.formatDate(
      pContract.endingDate.toString().substr(0, 10)
    )
  }

  saveContract() {
    const {
      name,
      startingDate,
      endingDate,
      amountVehicles,
      duration,
      observation,
    } = this.frmContract.controls
    try {
      if (this.frmContract.valid) {
        this.contract = new Contract()
        this.contract.name = name.value
        this.contract.startingDate = startingDate.value
        this.contract.endingDate = endingDate.value
        this.contract.amountVehicles = amountVehicles.value
        this.contract.duration = duration.value
        this.contract.observation = observation.value

        if (
          confirm(
            '¿Está seguro que desea guardar los datos asociados a este contrato?'
          )
        ) {
          if (
            this.contractToUpdate != null &&
            this.contractToUpdate != undefined
          ) {
            this.contract.id = this.contractToUpdate.id
            this.contract.code = this.contractToUpdate.code
            this.contract.consecutive = this.contractToUpdate.consecutive
          }

          this.contract.client = this.client

          if (
            this.contract.client == null ||
            this.contract.client == undefined
          ) {
            this.clientFieldIsInvalid = true
            throw new Error('Se debe seleccionar un cliente')
          }

          this.contract.dealer = this.dealer

          if (
            this.contract.dealer == null ||
            this.contract.dealer == undefined
          ) {
            this.dealerFieldIsInvalid = true
            throw new Error('Se debe seleccionar un concesionario')
          }

          this.contract.contractState = this.contractState
          this.contract.discountType = this.discountType
          this.contract.discountValue = this.discountValue
          this.contract.lsVehicleModels = this.modelsToFilter
          this.contract.lsVehicles = this.vehicles

          if (this.contract.lsVehicles.length > this.contract.amountVehicles) {
            throw new Error(
              `Verifique que la cantidad de vehículos seleccionados no exceda la cantidad de vehiculos contratados.
                Cantidad de vehículos permitida: ${this.contract.amountVehicles} Cantidad de vehículos seleccionados: ${this.contract.lsVehicles.length}`
            )
          }

          this.contract.lsMaintenanceItems = this.maintenanceItems

          //console.log(this.contract)
          this.saveData(this.contract)
        }
      }
    } catch (error) {
      this.isErrorVisible = true
      this.errorTitle = `Se ha encontrado una inconsistencia dentro de la información del contrato.`
      this.errorDescription = `${error}`
      this.isAwaiting = false
    }
  }

  saveData(pContract: Contract) {
    console.warn('[saveData - Contract]', pContract)
    this.isAwaiting = true
    if (this.isToUpdate) {
      this.contractService.update(pContract).subscribe({
        next: (rta) => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: rta.message,
            showConfirmButton: true,
          })
          this.isAwaiting = false
          this.contracStateService.resetContractInformation()
          this.router.navigate(['/MasterContracts'])
        },
        error: (err) => {
          this.isAwaiting = false
          this.isErrorVisible = true
          this.errorTitle = `Error actualizando contrato`
          this.errorDescription = `Se ha producido un error intentando actualizar el contrato. ${err.error.Message}`
        },
      })
    } else {
      this.contractService.insert(pContract).subscribe({
        next: (rta) => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: rta.message,
            showConfirmButton: true,
          })
          this.isAwaiting = false
          this.contracStateService.resetContractInformation()
          this.router.navigate(['/MasterContracts'])
        },
        error: (err) => {
          this.isAwaiting = false
          this.isErrorVisible = true
          this.errorTitle = `Error creando contrato`
          this.errorDescription = `Se ha producido un error intentando guardar el contrato en la base de datos.  ${err.error.Message}`
        },
      })
    }
  }

  comeBackTable() {
    this.resetContractData()
    this.router.navigate(['/MasterContracts'])
  }

  formatDate(sDate: string): Date {
    const year = parseInt(sDate.substring(0, 4))
    const month = parseInt(sDate.substring(5, 7))
    const day = parseInt(sDate.substring(8, 10))
    const dateToReturn = new Date(year, month, day)
    return dateToReturn
  }

  validateNumbers(event: any) {
    return InputValidator.validateTyping(event, 'numbers')
  }


  validateInputDate(event: any) {
    event.preventDefault()
    return null
  }

  setDiscountType(discountType: DiscountType) {
    if (discountType == null || discountType == undefined) {
      this.discountFieldIsInvalid = true
    } else {
      this.discountType = discountType
      this.discountFieldIsInvalid = false
    }
    this.contracStateService.setDiscountType(this.discountType)
  }

  setItemsByContract(lsMaintenanceItems: MaintenanceItem[]) {
    try {
      this.contract.lsMaintenanceItems =
        lsMaintenanceItems != null && lsMaintenanceItems != undefined
          ? lsMaintenanceItems
          : []
    } catch (error) {
      console.warn(error)
    }
  }

  disableContract(contractState: ContractState) {
    const {
      name,
      duration,
      startingDate,
      endingDate,
      discountValue,
      observation,
      amountVehicles,
    } = this.frmContract.controls

    if (contractState.id != ConstractStates.EN_NEGOCIACION) {
      name.disable()
      duration.disable()
      startingDate.disable()
      discountValue.disable()
      observation.disable()
      amountVehicles.disable()
      this.disableClientField = true
      this.disableDealerField = true
      this.disableTypeOfDiscoutnField = true
      this.disableVehicleTypesAndVehicleModels = true
      this.disableVehicles = true
    } else {
      name.enable()
      duration.enable()
      startingDate.enable()
      discountValue.enable()
      observation.enable()
      amountVehicles.enable()
      this.disableClientField = false
      this.disableDealerField = false
      this.disableTypeOfDiscoutnField = false
      this.disableVehicleTypesAndVehicleModels = false
      this.disableVehicles = false
    }
  }

  enableOrDisableForm() {
    try {
      const isFormToEdit = this.contractService.getContractIsToEdit()

      switch (this.action) {
        case ActionType.CREATE:
          this.disableClientField = false
          this.disableDealerField = false
          this.disableTypeOfDiscoutnField = false
          this.frmContract.enable()
          this.buttonSaveIsDisable = false
          this.disableCmbState = false
          this.disableVehicleTypesAndVehicleModels = false
          this.disableVehicles = false
          break
        case ActionType.READ:
          this.disableClientField = true
          this.disableDealerField = true
          this.disableTypeOfDiscoutnField = true
          this.frmContract.disable()
          this.buttonSaveIsDisable = true
          this.disableCmbState = true
          this.disableVehicleTypesAndVehicleModels = true
          this.disableVehicles = true
          break
        case ActionType.UPDATE:
          if (isFormToEdit || this.action == ActionType.UPDATE) {
            this.disableCmbState = false
          }
          break
      }
    } catch (error) {
      console.warn('[Enable or diable form]', error)
    }
  }

  resetContractData() {
    this.isToUpdate = false
    this.contracStateService.resetContractInformation()
  }

  closeError() {
    this.isErrorVisible = false
  }

  validateDiscountValues() {
    if (this.discountType) {
      if (
        this.discountType.id == DiscountTypes.PORCENTAJE_POR_REPUESTOS ||
        this.discountType.id ==
          DiscountTypes.PORCENTAJE_POR__TOTAL_MANTENIMIENTO
      ) {
        if (this.discountValue > 100) {
          this.frmContract.controls.discountValue.setErrors({
            maxValueAllowed: true,
          })
        } else {
          this.frmContract.controls.discountValue.setErrors(null)
        }
      } else {
        this.frmContract.controls.discountValue.setErrors(null)
      }
    }
  }
}
