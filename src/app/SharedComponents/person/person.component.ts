import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfigPersonComponent } from 'src/app/Models/ConfigPersonComponent';
import { Person } from 'src/app/Models/Person';
import { PersonService } from '../Services/Person/person.service';
import { CityService } from '../Services/City/city.service';
import { JobTitleService } from '../Services/JobTitle/job-title.service';
import { City } from 'src/app/Models/City';
import { Event, Router } from '@angular/router';
import { JobTitle } from 'src/app/Models/JobTitle';
import { InputValidator } from 'src/app/Utils/InputValidator';


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
  @Input() personToUpdate: Person;
  @Input() returnPath: string;
  @Input() countContact: number;
  
  @Input() configRenderComponent: ConfigPersonComponent;
  @Output() personWasSetted = new EventEmitter<boolean>();
  @Output() personWasCanceled = new EventEmitter<boolean>();
  formPerson: FormGroup;
  oCity: City;
  oJobTitleSelected: JobTitle;
  oInputvalidator: InputValidator;
  
  isContact:boolean = true;

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
          console.log(val)
          console.log(this.documentField.errors);
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
    this.buildPersonForm(this.configComponent);
    for (let change in changes) {
      try {
        console.log(changes);
        if (change == "configRenderComponent") {
          this.configComponent = this.configRenderComponent;
          this.renderComponent();
        }

        if (change == 'configComponent') {
          this.buildPersonForm(this.configComponent);
        }

        if (change == "countContact") {
          this.cleanFormData();
          this.personToUpdate = this.personService.getPersonToUpdate();
          if (this.personToUpdate != null) {
            this.setDataInForm(this.personToUpdate);
          } else {
            this.cleanFormData();
            this.oCity = null;
          }
        }

      } catch (err) {
        console.error(err);
        continue;
      }
    }
  }


  ngOnInit(): void {
    this.initComponents();
  }

  initComponents() {
    this.oCountChanges = 0;
    this.cleanFormData();
    this.renderComponent();
    if (this.personToUpdate != null) {
      console.log("Existe algo en memoria");
      console.log(this.personToUpdate);
      this.setDataInForm(this.personToUpdate);
    }    
  }


  renderComponent() {
    let containerDocument = document.querySelector("#container__document");
    let containerName = document.querySelector("#container__name");
    let containerPhone = document.querySelector("#container__phone");
    let containerEmail = document.querySelector("#container__email");
    let containerAddress = document.querySelector("#container__address");

    console.log(this.configComponent);

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

       console.log(containerEmail);
    }

    if (!this.configComponent.addressIsVisible || !this.configComponent.jobTitleIsVisible) {
      containerAddress.classList.remove("row__container");
      containerAddress.classList.add("row__container_single");
    }
  }

  setDataInForm(pPerson: Person) {       
    this.formPerson.patchValue(pPerson);
    if(pPerson.city != null){
      this.oCity = pPerson.city;
    }else{
      this.oCity = null;
    }
    
    this.cityService.setSelectedCity(this.oCity);
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

    console.log(objPerson);

    this.personService.setPerson(objPerson);
    this.personWasSetted.emit(true);
  }

  comeBack() {
    if (this.returnPath != null) {
      console.log("[retorno]:", this.returnPath);
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
