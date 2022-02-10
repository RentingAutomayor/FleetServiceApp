import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfigPersonComponent } from 'src/app/Models/ConfigPersonComponent';
import { Person } from 'src/app/Models/Person';
import { PersonService } from '../Services/Person/person.service';
import { CityService } from '../Services/City/city.service';
import { JobTitleService } from '../Services/JobTitle/job-title.service';
import { City } from 'src/app/Models/City';
import { Router } from '@angular/router';
import { JobTitle } from 'src/app/Models/JobTitle';
import { InputValidator } from 'src/app/Utils/InputValidator';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit, OnChanges {
  @Input() configComponent: ConfigPersonComponent;
  @Input() isRequiredDataComponent: boolean;
  @Input() formHasError: boolean;
  @Input() error: string;
  @Input() oCountChanges:number;
  @Input() returnPath: string;
  @Input() countContact: number;


  @Output() personWasSetted = new EventEmitter<boolean>();
  @Output() personWasCanceled = new EventEmitter<boolean>();
  formPerson: FormGroup;
  oCity: City;
  oJobTitleSelected: JobTitle;
  oInputvalidator: InputValidator;

  isContact:boolean = true;

  frmPersonMustBeBlocked: boolean = false;
  @Input('frmPersonMustBeBlocked')
  set setFrmPersonMustBeBlocked(value:boolean){
    this.frmPersonMustBeBlocked = value
    this.enableDisableForm(this.frmPersonMustBeBlocked)
  }

  personToUpdate: Person = {
    id:0,
    document:'',
    name:'',
    lastname:'',
    phone:'',
    cellphone:'',
    address:'',
    email:'',
    website:'',
    city: null,
    jobTitle:null,
    state:false,
    registrationDate: new Date()
  };

  @Input('personToUpdate')
  set setPersonToUpdate(person: Person){
    if(person){
      this.personToUpdate = person
      this.setDataInForm(this.personToUpdate)
      this.enableDisableForm(this.frmPersonMustBeBlocked)
    }
  }

  configRenderComponent: ConfigPersonComponent;
  @Input('configRenderComponent')
  set setConfigRenderComponent(config: ConfigPersonComponent){
    this.configRenderComponent = config;
    this.renderComponent();
  }

  constructor(
    private personService: PersonService,
    private cityService: CityService,
    private jobTitleService: JobTitleService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.configComponent = new ConfigPersonComponent();
    this.configRenderComponent = new ConfigPersonComponent();
    this.isRequiredDataComponent = false;
    this.formHasError = false;
    this.buildPersonForm(this.configComponent);
  }

  buildPersonForm(configComponent:ConfigPersonComponent){
    try {
      if(configComponent.documentIsVisible){
        this.formPerson = this.formBuilder.group({
          document : ['',[ Validators.required, Validators.minLength(8), Validators.maxLength(10) ]],
          name: ['', [Validators.required]],
          lastname:[''],
          phone: [''],
          cellphone: ['',[ Validators.minLength(10), Validators.maxLength(10) ]],
          email: ['',[ Validators.email ]],
          website: [''],
          address: ['']
        });

        this.formPerson.get('document').valueChanges.subscribe(val => {
          //console.log(val)
          //console.log(this.documentField.errors);
        });
      }else{
        this.formPerson = this.formBuilder.group({
          name: ['', [Validators.required]],
          lastname:[''],
          phone: [''],
          cellphone: ['',[ Validators.minLength(10), Validators.maxLength(10) ]],
          email: ['',[ Validators.email ]],
          website: [''],
          address: ['']
        });
      }
    } catch (error) {
      console.warn('No se ha detectado una consiguración para el componente de persona');
    }

  }

  ngOnChanges(changes: SimpleChanges) {

    for (let change in changes) {
      try {
        if (change == 'configComponent') {
          this.buildPersonForm(this.configComponent);
        }

      } catch (err) {
        console.error(err);
        continue;
      }
    }
  }

  enableDisableForm(formIsBlocked:boolean){
    if(formIsBlocked){
      this.formPerson.disable();
    }else{
      this.formPerson.enable();
    }
  }


  ngOnInit(): void {
    this.initComponents();
  }

  initComponents() {
    this.oCountChanges = 0;
    this.cleanFormData();
    this.renderComponent();
  }



  renderComponent() {
    let containerDocument = document.querySelector("#container__document");
    let containerName = document.querySelector("#container__name");
    let containerPhone = document.querySelector("#container__phone");
    let containerEmail = document.querySelector("#container__email");
    let containerAddress = document.querySelector("#container__address");



    if (!this.configComponent.kindOfDocumentIsVisible || !this.configComponent.documentIsVisible) {
      containerDocument.classList.remove("row__container");
      containerDocument.classList.add("row__container_single");
    }

    if (!this.configComponent.nameIsVisible || !this.configComponent.lastNameIsVisible) {
      containerName.classList.remove("row__container");
      containerName.classList.add("row__container_single");
    }

    if (!this.configComponent.phoneIsVisible || !this.configComponent.cellphoneIsVisible) {
      containerPhone.classList.remove("row__container");
      containerPhone.classList.add("row__container_single");
    }


    if (this.configComponent.websiteIsVisible && this.configComponent.emailIsVisible) {
       console.warn("Validación de visibilidad de container Email");
       console.warn(` email: ${this.configComponent.emailIsVisible}  website: ${this.configComponent.websiteIsVisible }`)
       containerEmail.classList.remove("row__container_single" );
       containerEmail.classList.add("row__container");


    }

    if (!this.configComponent.addressIsVisible || !this.configComponent.jobTitleIsVisible) {
      containerAddress.classList.remove("row__container");
      containerAddress.classList.add("row__container_single");
    }
  }

  setDataInForm(pPerson: Person) {
    if(pPerson){
      this.formPerson.patchValue(pPerson);
      if(pPerson.city != null){
        this.oCity = pPerson.city;
      }else{
        this.oCity = null;
      }
    }else{
      this.formPerson.reset()
    }
  }

  cleanFormData() {
    this.formPerson.reset();
    this.cityService.setSelectedCity(null);
    this.oJobTitleSelected = new JobTitle();
    this.oJobTitleSelected.id = 0;
    this.oJobTitleSelected.description = '';
  }

  setDataPerson(event:any) {
    event.preventDefault();

    let objPerson: Person;

    objPerson = this.formPerson.value;

     if(this.personToUpdate != null){
      objPerson.id = this.personToUpdate.id;
      console.warn("Detecta información de cliente para actualizar");
    }

    if (this.configComponent.cityIsVisible) {
      objPerson.city = this.cityService.getSelectedCity();
    }

    if (this.configComponent.jobTitleIsVisible) {
      objPerson.jobTitle = this.jobTitleService.getJobTitleSelected();

      if (objPerson.jobTitle == null) {
        objPerson.jobTitle = this.jobTitleService.getJobTitleByInput();
      }
    }



    this.personService.setPerson(objPerson);
    this.personWasSetted.emit(true);
  }

  comeBack() {
    if (this.returnPath != null) {

      this.router.navigate([this.returnPath]);
    }
    this.personWasCanceled.emit(true);

  }

  get documentField(){
    return this.formPerson.get('document');
  }

  get nameField(){
    return this.formPerson.get('name');
  }

  get lastnameField(){
    return this.formPerson.get('lastname');
  }

  get phoneField(){
    return this.formPerson.get('phone');
  }

  get cellphoneField(){
    return this.formPerson.get('cellphone');
  }

  get emailField(){
    return this.formPerson.get('email');
  }

  validateTyping(event:any, type:string){
    InputValidator.validateTyping(event,type);
  }
}
