import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ConfigPersonComponent } from 'src/app/Models/ConfigPersonComponent';
import { Person } from 'src/app/Models/Person';
import { PersonService } from '../Services/Person/person.service';
import { CityService } from '../Services/City/city.service';
import { JobTitleService } from '../Services/JobTitle/job-title.service';
import { City } from 'src/app/Models/City';
import { Router } from '@angular/router';
import { JobTitle } from 'src/app/Models/JobTitle';

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
  @Output() personWasSetted = new EventEmitter<boolean>();
  @Output() personWasCanceled = new EventEmitter<boolean>();
  formPerson: FormGroup;
  oCity: City;
  oJobTitleSelected: JobTitle;


  constructor(
    private personService: PersonService,
    private cityService: CityService,
    private jobTitleService: JobTitleService,
    private router: Router
  ) {
    this.formPerson = new FormGroup({
      cmboKindOfDocument: new FormControl('Seleccione ...'),
      txtDocument: new FormControl(''),
      txtName: new FormControl(''),
      txtLastName: new FormControl(''),
      txtPhone: new FormControl(''),
      txtCellPhone: new FormControl(''),
      txtEmail: new FormControl(''),
      txtWebsite: new FormControl(''),
      txtAddress: new FormControl('')
    });

    this.configComponent = new ConfigPersonComponent();
    this.isRequiredDataComponent = false;
    this.formHasError = false;

  }

  ngOnChanges(changes: SimpleChanges) {

    for (let change in changes) {
      try {
       //console.log(changes);
        if (change == "countContact") {
          this.cleanFormData();
          this.personToUpdate = this.personService.getPersonToUpdate();
          if(this.personToUpdate != null){
            this.setDataInForm(this.personToUpdate);
          } else{
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

    if (!this.configComponent.emailIsVisible || !this.configComponent.websiteIsVisible) {
      containerEmail.classList.remove("row__container");
      containerEmail.classList.add("row__container_single");
    }

    if (!this.configComponent.addressIsVisible || !this.configComponent.jobTitleIsVisible) {
      containerAddress.classList.remove("row__container");
      containerAddress.classList.add("row__container_single");
    }
  }

  setDataInForm(pPerson: Person) {
    console.warn(pPerson);    
    this.formPerson.controls.txtDocument.setValue(pPerson.document);        
    this.formPerson.controls.txtName.setValue(pPerson.name);
    this.formPerson.controls.txtLastName.setValue(pPerson.lastname);
    this.formPerson.controls.txtPhone.setValue(pPerson.phone);
    this.formPerson.controls.txtCellPhone.setValue(pPerson.cellphone);
    this.formPerson.controls.txtEmail.setValue(pPerson.email);
    this.formPerson.controls.txtWebsite.setValue(pPerson.website);
    this.formPerson.controls.txtAddress.setValue(pPerson.address);
    if(pPerson.city != null){
      this.oCity = pPerson.city;
    }else{
      this.oCity = null;
    }
    
    this.cityService.setSelectedCity(this.oCity);
  }

  cleanFormData() {
    this.formPerson.controls.txtDocument.setValue("");
    this.formPerson.controls.txtName.setValue("");
    this.formPerson.controls.txtLastName.setValue("");
    this.formPerson.controls.txtPhone.setValue("");
    this.formPerson.controls.txtCellPhone.setValue("");
    this.formPerson.controls.txtEmail.setValue("");
    this.formPerson.controls.txtWebsite.setValue("");
    this.formPerson.controls.txtAddress.setValue("");
    this.cityService.setSelectedCity(null);
    this.oJobTitleSelected = new JobTitle();
    this.oJobTitleSelected.id = 0;
    this.oJobTitleSelected.description = '';
  }

  setDataPerson() {
    this.formHasError = false;
    this.error = "";

    let objPerson = new Person();

    if(this.personToUpdate != null){
      objPerson.id = this.personToUpdate.id;
      console.warn("Detecta información de cliente para actualizar");
    }

    if (this.configComponent.documentIsVisible) {
      objPerson.document = this.formPerson.controls.txtDocument.value;
    }

    if (this.configComponent.nameIsVisible) {
      objPerson.name = this.formPerson.controls.txtName.value;
    }

    if (this.configComponent.lastNameIsVisible) {
      objPerson.lastname = this.formPerson.controls.txtLastName.value;
    }

    if (this.configComponent.phoneIsVisible) {
      objPerson.phone = this.formPerson.controls.txtPhone.value;
    }

    if (this.configComponent.cellphoneIsVisible) {
      objPerson.cellphone = this.formPerson.controls.txtCellPhone.value;
    }

    if (this.configComponent.emailIsVisible) {
      objPerson.email = this.formPerson.controls.txtEmail.value;
    }

    if (this.configComponent.websiteIsVisible) {
      objPerson.website = this.formPerson.controls.txtWebsite.value;
    }

    if (this.configComponent.addressIsVisible) {
      objPerson.address = this.formPerson.controls.txtAddress.value;
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
  searchPerson(value: any) {

  }

  pasteEvent(event, data) {

  }

}
