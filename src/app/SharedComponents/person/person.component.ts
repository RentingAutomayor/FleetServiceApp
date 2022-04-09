import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ConfigPersonComponent } from 'src/app/Models/ConfigPersonComponent'
import { Person } from 'src/app/Models/Person'
import { PersonService } from '../Services/Person/person.service'
import { CityService } from '../Services/City/city.service'
import { JobTitleService } from '../Services/JobTitle/job-title.service'
import { City } from 'src/app/Models/City'
import { Router } from '@angular/router'
import { JobTitle } from 'src/app/Models/JobTitle'
import { InputValidator } from 'src/app/Utils/InputValidator'
import { ThemePalette } from '@angular/material/core'
import { IContactType } from 'src/app/Models/IContactType'

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss'],
})
export class PersonComponent implements OnInit {
  @Input() isRequiredDataComponent: boolean
  @Input() formHasError: boolean
  @Input() error: string
  @Input() oCountChanges: number
  @Input() returnPath: string
  @Output() personWasSetted = new EventEmitter<boolean>()
  @Output() personWasCanceled = new EventEmitter<boolean>()
  formPerson: FormGroup

  oJobTitleSelected: JobTitle
  oInputvalidator: InputValidator

  @Input()
  isFormContact: boolean = false

  personToUpdate: Person = {
    id: 0,
    document: '',
    name: '',
    lastname: '',
    phone: '',
    cellphone: '',
    address: '',
    email: '',
    website: '',
    city: null,
    jobTitle: null,
    state: false,
    registrationDate: new Date(),
    updateDate: new Date(),
    deleteDate: new Date(),
    type: undefined,
    mustNotify: false,
  }

  jobTitleSelected: JobTitle = null

  frmPersonMustBeBlocked = false
  @Input('frmPersonMustBeBlocked')
  set setFrmPersonMustBeBlocked(value: boolean) {
    this.frmPersonMustBeBlocked = value
    this.enableDisableForm(this.frmPersonMustBeBlocked)
  }

  @Input('personToUpdate')
  set setPersonToUpdate(person: Person) {
    if (person) {
      this.personToUpdate = person
      console.log(this.personToUpdate)
      this.jobTitleSelected = this.personToUpdate.jobTitle
      this.selectedCity = this.personToUpdate.city
      this.contactTypeSelected = person.type
      console.log('Type selected')
      console.log(this.contactTypeSelected)
      this.setDataInForm(this.personToUpdate)
      this.enableDisableForm(this.frmPersonMustBeBlocked)
    } else {
      this.cleanFormData()
    }
  }

  configRenderComponent: ConfigPersonComponent
  @Input('configRenderComponent')
  set setConfigRenderComponent(config: ConfigPersonComponent) {
    this.configRenderComponent = config
  }

  areVisibleButtonActions = false
  @Input('areVisibleButtonActions')
  set setAreVisibleButtonActions(value: boolean) {
    console.log(`buttons are visibles ${value}`)
    this.areVisibleButtonActions = value
  }

  selectedCity: City = null

  // getInfoComponent:boolean = false;
  // @Input('getInfoComponent')
  // set setGetInfoComponent(value:boolean){
  //   this.getInfoComponent = value;
  //   if(this.getInfoComponent){
  //     this.getInformationComponent()
  //   }
  // }
  configComponent: ConfigPersonComponent = null
  @Input('configComponent')
  set setConfigComponent(config: ConfigPersonComponent) {
    this.configComponent = config
    this.buildPersonForm(this.configComponent)
  }

  @Output() onNextStepClicked = new EventEmitter<boolean>()

  color: ThemePalette = 'primary'
  checked = false
  disabled = false

  contactType: IContactType | undefined = undefined

  contactTypeSelected: IContactType | undefined = undefined

  isErrorInNotifyValidation: boolean = false

  constructor(
    private personService: PersonService,
    private cityService: CityService,
    private jobTitleService: JobTitleService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.configComponent = new ConfigPersonComponent()
    this.configRenderComponent = new ConfigPersonComponent()
    this.isRequiredDataComponent = false
    this.formHasError = false
  }

  buildPersonForm(configComponent: ConfigPersonComponent) {
    try {
      if (configComponent.documentIsVisible) {
        this.formPerson = this.formBuilder.group({
          document: [
            '',
            [
              Validators.required,
              Validators.minLength(8),
              Validators.maxLength(10),
            ],
          ],
          name: ['', [Validators.required]],
          lastname: [''],
          phone: [''],
          cellphone: ['', [Validators.minLength(10), Validators.maxLength(10)]],
          email: ['', [Validators.email]],
          website: [''],
          address: [''],
          mustNotify: [false],
        })

        this.formPerson.get('document').valueChanges.subscribe((val) => {
          // console.log(val)
          // console.log(this.documentField.errors);
        })
      } else {
        this.formPerson = this.formBuilder.group({
          document: [''],
          name: ['', [Validators.required]],
          lastname: [''],
          phone: [''],
          cellphone: ['', [Validators.minLength(10), Validators.maxLength(10)]],
          email: ['', [Validators.email]],
          website: [''],
          address: [''],
          mustNotify: [false],
        })
      }

      let email: string = ''
      let musNotifyValue: boolean = false

      this.formPerson.controls.email.valueChanges.subscribe((data) => {
        email = data ? data : ''

        if (musNotifyValue) {
          if (this.formPerson.controls.email.invalid || email == '') {
            this.isErrorInNotifyValidation = true
          } else {
            this.isErrorInNotifyValidation = false
          }
        } else {
          this.isErrorInNotifyValidation = false
        }
      })

      this.formPerson.controls.mustNotify.valueChanges.subscribe((value) => {
        console.log(`check notify: ${value}`)
        musNotifyValue = value
        if (value) {
          if (email.trim() == '') {
            this.isErrorInNotifyValidation = true
          } else {
            this.isErrorInNotifyValidation = false
          }
        } else {
          this.isErrorInNotifyValidation = false
        }
      })
    } catch (error) {
      console.warn(
        'No se ha detectado una consiguración para el componente de persona'
      )
    }
  }

  enableDisableForm(formIsBlocked: boolean) {
    try {
      if (formIsBlocked) {
        this.formPerson.disable()
      } else {
        this.formPerson.enable()
      }
    } catch (error) {
      console.log(error)
    }
  }

  ngOnInit(): void {}

  get documentField() {
    return this.formPerson.get('document')
  }

  get nameField() {
    return this.formPerson.get('name')
  }

  get lastnameField() {
    return this.formPerson.get('lastname')
  }

  get phoneField() {
    return this.formPerson.get('phone')
  }

  get cellphoneField() {
    return this.formPerson.get('cellphone')
  }

  get emailField() {
    return this.formPerson.get('email')
  }

  setDataInForm(pPerson: Person) {
    if (pPerson) {
      this.formPerson.patchValue(pPerson)
    } else {
      this.formPerson.reset()
    }
  }

  cleanFormData() {
    this.formPerson.reset()
    this.oJobTitleSelected = new JobTitle()
    this.oJobTitleSelected.id = 0
    this.oJobTitleSelected.description = ''
    this.selectedCity = null
    this.jobTitleSelected = null
  }

  setDataPerson(event: any) {
    event.preventDefault()
    const objPerson = this.getDataPersonForm()
    this.personService.setPerson(objPerson)
    this.personWasSetted.emit(true)
    this.cleanFormData()
  }

  setSelectedCity(city: City) {
    this.selectedCity = city
  }

  getDataPersonForm(): Person {
    let objPerson: Person

    objPerson = this.formPerson.value

    if (this.personToUpdate != null) {
      objPerson.id = this.personToUpdate.id
      console.warn('Detecta información de cliente para actualizar')
    }

    if (this.configComponent.cityIsVisible) {
      objPerson.city = this.selectedCity
    }

    if (this.configComponent.jobTitleIsVisible) {
      objPerson.jobTitle = this.jobTitleService.getJobTitleSelected()

      if (objPerson.jobTitle == null) {
        objPerson.jobTitle = this.jobTitleService.getJobTitleByInput()
      }
    }

    if (this.isFormContact) {
      objPerson.mustNotify = this.formPerson.controls.mustNotify.value
      objPerson.type = this.contactType
    } else {
      objPerson.mustNotify = false
      objPerson.type = undefined
    }

    return objPerson
  }

  getInformationComponent() {
    const objPerson = this.getDataPersonForm()
    this.personService.setPerson(objPerson)
    this.personWasSetted.emit(true)
    this.onNextStepClicked.emit(true)
  }

  comeBack() {
    this.formPerson.reset()
    if (this.returnPath != null) {
      this.router.navigate([this.returnPath])
    }
    this.personWasCanceled.emit(true)
  }

  validateTyping(event: any, type: string) {
    InputValidator.validateTyping(event, type)
  }

  setContactType(type: IContactType) {
    this.contactType = type
  }
}
