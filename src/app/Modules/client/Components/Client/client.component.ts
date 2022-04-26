import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core'
import { Client } from 'src/app/Models/Client'
import { ConfigPersonComponent } from 'src/app/Models/ConfigPersonComponent'
import { PersonService } from '../../../../SharedComponents/Services/Person/person.service'
import { ClientService } from '../../Services/Client/client.service'
import { Person } from 'src/app/Models/Person'
import { ActivatedRoute, Router } from '@angular/router'
import { CityService } from '../../../../SharedComponents/Services/City/city.service'
import { ActionType } from 'src/app/Models/ActionType'
import { Contact } from 'src/app/Models/Contact'
import { getFromStorage } from 'src/app/Utils/storage'
import { Branch } from 'src/app/Models/Branch'
import { Vehicle } from 'src/app/Models/Vehicle'
import { ContractualInformation } from 'src/app/Models/ContractualInformation'
import { MatVerticalStepper, MatStep } from '@angular/material/stepper'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
})
export class ClientComponent implements OnInit {
  oConfigPersonComp: ConfigPersonComponent
  bFormHasError: boolean
  errorMessage: string
  isAwaiting: boolean
  oPersonToUpdate: Person
  areVisibleButtonsForBasicData = false
  client: Client = {
    id: 0,
    document: '',
    name: '',
    lastname: '',
    phone: '',
    cellphone: '',
    address: '',
    email: '',
    website: '',
    city: {
      id: 0,
      name: '',
      departmentId: 0,
      state: false,
    },
    jobTitle: {
      id: 0,
      description: '',
      state: false,
    },
    state: false,
    registrationDate: null,
    updateDate: null,
    deleteDate: null,
    contacts: [],
    branchs: [],
    vehicles: [],
    contractualInformation: null,
    financialInformation: null,
  }
  lsContacts: Contact[] = []
  lsBranchs: Branch[] = []
  lsVehicles: Vehicle[] = []
  contractualInformation: ContractualInformation = null
  oDataIsToUpdate: boolean
  sReturnPath: string
  ROUTE_MASTER_CLIENT = '/MasterClients'
  oIsToClient: boolean
  oClientWasSaved: boolean
  blockFormClient = false
  action: ActionType
  // Refactor component
  clientID: string
  getPersonInfo = false
  isLinear = true
  isBasicDataCompleted = false
  areContactCompleted = true
  areBranchCompleted = true
  areVehiclesCompleted = true
  isContractualInfoSetted = false
  isButtonSaveClientVisible = true
  quotaApproved: Number = 0
  @ViewChild(MatVerticalStepper)
  stepper: MatVerticalStepper

  isErrorVisible = false
  errorTitle = ''
  errorMessageApi = ''

  constructor(
    private personService: PersonService,
    private clientService: ClientService,
    private cityService: CityService,
    private router: ActivatedRoute,
    private routerService: Router
  ) {
    this.client = null
    this.bFormHasError = false
    this.errorMessage = ''
    this.isAwaiting = false
    this.oDataIsToUpdate = false
    this.oIsToClient = true
    this.oClientWasSaved = false
    this.sReturnPath = this.ROUTE_MASTER_CLIENT
  }

  ngOnInit(): void {
    this.initComponents()
    this.configurePersonComponent()
    this.extractDataFromParams()
  }

  extractDataFromParams() {
    this.isAwaiting = true
    this.router.paramMap.subscribe((params) => {
      this.clientID = params.get('id')
      if (this.clientID) {
        this.clientService
          .getClientById(parseInt(this.clientID))
          .then((client) => {
            if (client != null) {
              this.client = client
              this.lsContacts = this.client.contacts ? this.client.contacts : []
              this.lsBranchs = this.client.branchs ? this.client.branchs : []
              this.lsVehicles = this.client.vehicles ? this.client.vehicles : []
              this.contractualInformation = this.client.contractualInformation
              this.quotaApproved =
                this.client.financialInformation.approvedQuota
              this.oDataIsToUpdate = true
            }
          })
      } else {
        this.client = {
          id: 0,
          document: '',
          name: '',
          lastname: '',
          phone: '',
          cellphone: '',
          address: '',
          email: '',
          website: '',
          city: {
            id: 0,
            name: '',
            departmentId: 0,
            state: false,
          },
          jobTitle: {
            id: 0,
            description: '',
            state: false,
          },
          state: false,
          registrationDate: null,
          updateDate: null,
          deleteDate: null,
          contacts: [],
          branchs: [],
          vehicles: [],
          contractualInformation: null,
          financialInformation: null,
        }
        this.oDataIsToUpdate = false
      }
    })
    this.isAwaiting = false
  }

  initComponents(): void {
    const actionToPerform = getFromStorage('actionToPerform')
    this.action = parseInt(actionToPerform)
    this.validateActionToDo(this.action)
    this.isErrorVisible = false
    this.errorTitle = ''
    this.errorMessageApi = ''
  }

  validateActionToDo(action: ActionType): void {
    if (action === ActionType.READ) {
      this.blockFormClient = true
      this.isButtonSaveClientVisible = false
    } else {
      this.blockFormClient = false
      this.isButtonSaveClientVisible = true
    }
  }

  configurePersonComponent(): void {
    this.oConfigPersonComp = new ConfigPersonComponent()
    this.oConfigPersonComp.documentIsVisible = true
    this.oConfigPersonComp.nameIsVisible = true
    this.oConfigPersonComp.phoneIsVisible = true
    this.oConfigPersonComp.cellphoneIsVisible = true
    this.oConfigPersonComp.addressIsVisible = true
    this.oConfigPersonComp.websiteIsVisible = true
    this.oConfigPersonComp.cityIsVisible = true
  }

  async setPersonInfo() {
    this.client = this.personService.getPerson()
    this.isBasicDataCompleted = true
    await setTimeout(() => {
      this.stepper.next()
    }, 100)
  }

  updateContactsToClient(contacts: Contact[]): void {
    this.lsContacts = contacts
  }

  updateBranchsToClient(branchs: Branch[]): void {
    this.lsBranchs = branchs
  }

  updateVehiclesToClient(vehicles: Vehicle[]): void {
    this.lsVehicles = vehicles
  }

  async updateContractualInformation(contractualInfo: ContractualInformation) {
    const idContractualInformation = this.contractualInformation
      ? this.contractualInformation.id
      : 0
    this.contractualInformation = contractualInfo
    this.contractualInformation.id = idContractualInformation
    this.isContractualInfoSetted = true
    await setTimeout(() => {
      this.stepper.next()
    }, 100)
  }

  getPersonInformation(): void {
    this.getPersonInfo = true
  }

  prevStepContractualInfo() {
    const btnPrevStep = document.getElementById(
      'btn-prev-step-contractual-info'
    )
    btnPrevStep.click()
  }

  saveClient() {
    this.isAwaiting = true
    this.client.contacts = this.lsContacts
    this.client.branchs = this.lsBranchs
    this.client.vehicles = this.lsVehicles
    this.client.contractualInformation = this.contractualInformation
    console.log(this.client)

    if (this.action == ActionType.CREATE) {
      this.clientService.insertClient(this.client).subscribe(
        (rta) => {
          if (rta.response) {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: rta.message,
              showConfirmButton: true,
            })
            this.isAwaiting = false
            this.routerService.navigate([this.ROUTE_MASTER_CLIENT])
          }
        },
        (err) => {
          this.isErrorVisible = true
          this.isAwaiting = false
          this.errorTitle = 'Ocurrió un error intentando Insertar el cliente'
          this.errorMessageApi = err.error.Message
        }
      )
    } else if (this.action == ActionType.UPDATE) {
      this.clientService.updateClient(this.client).subscribe(
        (rta) => {
          if (rta.response) {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: rta.message,
              showConfirmButton: true,
            })
            this.isAwaiting = false
            this.routerService.navigate([this.ROUTE_MASTER_CLIENT])
          }
        },
        (err) => {
          this.isErrorVisible = true
          this.isAwaiting = false
          this.errorTitle = 'Ocurrió un error intentando Actualizar el cliente'
          this.errorMessageApi = err.error.Message
        }
      )
    }
  }

  comeBack(): void {
    if (this.action !== ActionType.READ) {
      if (confirm('¿Está seguro de salir sin haber guardado cambios?')) {
        this.routerService.navigate([this.ROUTE_MASTER_CLIENT])
      }
    } else {
      this.routerService.navigate([this.ROUTE_MASTER_CLIENT])
    }
  }

  closeErrorMessage() {
    this.isErrorVisible = false
  }
}
