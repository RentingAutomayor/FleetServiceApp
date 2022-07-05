import { ContactType } from './../../Models/ContactType';
import { BehaviorSubject, Observable } from 'rxjs';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { IContactType } from 'src/app/Models/IContactType'
import { ContactService } from '../Services/Contact/contact.service'
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms'
import {MatListModule} from '@angular/material/list';
import { ContactTypeService } from '../Services/ContactType/contacttype.service';

@Component({
  selector: 'app-contact-type',
  templateUrl: './contact-type.component.html',
  styleUrls: ['./contact-type.component.scss'],
})
export class ContactTypeComponent implements OnInit {
  
  isDisabled: boolean = false
  contactTypeSelected: IContactType | undefined 
  types: IContactType[] = [] // todos los tipos de contacto de la base de datos
  cmbTypes: FormControl = new FormControl()
  typemodel : FormGroup;
  
  constructor(
    private contactService: ContactService,
    private ContactTypeService : ContactTypeService,
    fb : FormBuilder)
  {
    this.cmbTypes.valueChanges.subscribe((value) => {
      const contacType: IContactType = this.types?.find((ct) => ct.id == value)
      this.onTypeChanged.emit(contacType)
      //console.log("valuechanges",value);
      //console.log("contactypevaluechanges",contacType);
    })
    
    this.typemodel = fb.group({
      selectedTypes : new FormArray([])      
    });
  }


  ngOnInit(): void {
    this.contactService.getContactTypes().subscribe((data) => {
      this.types = data
      this.resetCheck();
    })
  }

  

  @Input('isDisabled')
  set setIsDidabled(value: boolean) {
    this.isDisabled = value
    if (this.isDisabled) {
      this.cmbTypes.disable()
    } else {
      this.cmbTypes.enable()
    }
  }
  
  
  @Input('persontype')
  set setPersontype(type: IContactType[]) {
    this.resetCheck();
    for(let i = 0; i < type.length; i++){
      if(this.types[i].id == type[i].id){
        this.types[i].Bcheked = true;
      }else{
        this.types[i].Bcheked = false;
      }
    }
  }

  resetCheck(){
    for(let i=0; i < this.types.length; i++){
      this.types[i].Bcheked = false;
    }
  }

  
  
  @Input('contactTypeSelected')
  set setContactTypeSelected(type: IContactType) {
    this.contactTypeSelected = type
    if (this.contactTypeSelected) {
      this.cmbTypes.setValue(this.contactTypeSelected.id)
    } else {
      this.cmbTypes.setValue(0)
    }
  }

  
  @Output()
  onTypeChanged = new EventEmitter<IContactType>()

  onCheckboxChange(id: number, name: string, event: any) {
    const selectedTypes = (this.typemodel.controls.selectedTypes as FormArray);
    if (event.checked) {
      selectedTypes.push(new FormControl({
        "id" : id,
        "name": name,
        "checked": true
      }));
    } else {
      const index = selectedTypes.controls
      .findIndex(x => x.value === name);
      selectedTypes.removeAt(index);
    }
    this.sendData(selectedTypes);
  }
  
  sendData(selectedTypes : FormArray) {
    this.ContactTypeService.dispContactType.emit({selectedTypes});
  }

  submit(){
    this.isDisabled = !this.isDisabled
  }




}
