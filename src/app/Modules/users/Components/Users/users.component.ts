import {
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewChild,
  } from '@angular/core'
  import { User } from 'src/app/Models/User'
  import { UserService } from '../../Services/Users/users.service'
  import { ActivatedRoute, Router } from '@angular/router'
  import { ActionType } from 'src/app/Models/ActionType'
  import { getFromStorage } from 'src/app/Utils/storage'
  import { MatVerticalStepper, MatStep } from '@angular/material/stepper'
import { ConfigPersonComponent } from 'src/app/Models/ConfigPersonComponent'
import { PersonService } from 'src/app/SharedComponents/Services/Person/person.service'
import { Person } from 'src/app/Models/Person'
  
  @Component({
    selector: 'app-user',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
  })
  export class UsersComponent implements OnInit {
    oConfigPersonComp: ConfigPersonComponent
    bFormHasError: boolean
    errorMessage: string
    isAwaiting: boolean
    oPersonToUpdate: Person
    areVisibleButtonsForBasicData = false
    user: User = {
      id: 0,
      document: '',
      name: '',
      lastname: '',
      phone: '',
      cellphone: '',
      address: '',
      email: '',
      website: '',
      id_user: 0,
      lastName: '',
      user: '',
      id_group: 0,
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
    }
    oDataIsToUpdate: boolean
    sReturnPath: string
    ROUTE_MASTER_CLIENT = '/MasterUsers'
    oIsToUser: boolean
    oUserWasSaved: boolean
    blockFormUser = false
    action: ActionType
    // Refactor component
    userID: string
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
      private userService: UserService,
      private router: ActivatedRoute,
      private routerService: Router
    ) {
      this.user = null
      this.bFormHasError = false
      this.errorMessage = ''
      this.isAwaiting = false
      this.oDataIsToUpdate = false
      this.oIsToUser = true
      this.oUserWasSaved = false
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
        this.userID = params.get('id')
        if (this.userID) {
          this.userService
            .getUserById(parseInt(this.userID))
            .then((user) => {
              if (user != null) {
                this.user = user
                this.oDataIsToUpdate = true
              }
            })
        } else {
          this.user = {
            id: 0,
            document: '',
            name: '',
            lastname: '',
            phone: '',
            cellphone: '',
            address: '',
            email: '',
            website: '',
            id_user: 0,
            lastName: '',
            user: '',
            id_group: 0,
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
        this.blockFormUser = true
        this.isButtonSaveClientVisible = false
      } else {
        this.blockFormUser = false
        this.isButtonSaveClientVisible = true
      }
    }
  
    getPersonInformation(): void {
      this.getPersonInfo = true
    }

    configurePersonComponent(): void {
      this.oConfigPersonComp = new ConfigPersonComponent()
      this.oConfigPersonComp.nameIsVisible = true
      this.oConfigPersonComp.lastNameIsVisible = true
    }

    async setPersonInfo() {
      this.user = this.personService.getPerson()
      this.isBasicDataCompleted = true
      await setTimeout(() => {
        this.stepper.next()
      }, 100)
    }
  
    prevStepContractualInfo() {
      const btnPrevStep = document.getElementById(
        'btn-prev-step-contractual-info'
      )
      btnPrevStep.click()
    }
  
    saveUser() {
      this.isAwaiting = true
      this.user.user = this.user.user
      this.user.name = this.user.name
      this.user.lastName = this.user.lastName
      this.user.id_group = this.user.id_group
  
      if (this.action == ActionType.CREATE) {
        this.userService.insertUser(this.user).subscribe(
          (rta) => {
            if (rta.response) {
              alert(rta.message)
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
        this.userService.updateUser(this.user).subscribe(
          (rta) => {
            if (rta.response) {
              alert(rta.message)
              this.isAwaiting = false
              this.routerService.navigate([this.ROUTE_MASTER_CLIENT])
            }
          },
          (err) => {
            this.isErrorVisible = true
            this.isAwaiting = false
            this.errorTitle = 'Ocurrió un error intentando Actualizar el usuario'
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
  