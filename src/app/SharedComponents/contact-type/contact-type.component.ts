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

  typemodel : FormGroup;





  @Input('isDisabled')
  set setIsDidabled(value: boolean) {
    this.isDisabled = value
    if (this.isDisabled) {
      this.cmbTypes.disable()
    } else {
      this.cmbTypes.enable()
    }
  }

  contactTypeSelected: IContactType | undefined = undefined

  @Input('contactTypeSelected')
  set setContactTypeSelected(type: IContactType) {
    this.contactTypeSelected = type
    if (this.contactTypeSelected) {
      this.cmbTypes.setValue(this.contactTypeSelected.id)
    } else {
      this.cmbTypes.setValue(0)
    }
  }

  cmbTypes: FormControl = new FormControl()

  types: IContactType[] = []

  @Output()
  onTypeChanged = new EventEmitter<IContactType>()

  constructor(
    private contactService: ContactService,
    private ContactTypeService : ContactTypeService,
    fb : FormBuilder)
  {
    this.cmbTypes.valueChanges.subscribe((value) => {
      const contacType: IContactType = this.types.find((ct) => ct.id == value)
      this.onTypeChanged.emit(contacType)
    })

    this.typemodel = fb.group({
      selectedTypes : new FormArray([])
    });


  }

  onCheckboxChange(id: number, name: string, event: any) {
    const selectedTypes = (this.typemodel.controls.selectedTypes as FormArray);
    if (event.checked) {
      selectedTypes.push(new FormControl({
        "id" : id,
        "name": name,
        "checked": true
      }));
      this.sendData(selectedTypes);
    } else {
      const index = selectedTypes.controls
      .findIndex(x => x.value === name);
      selectedTypes.removeAt(index);
      this.sendData(selectedTypes);
    }
  }

  sendData(selectedTypes : FormArray) {
    this.ContactTypeService.dispContactType.emit({selectedTypes});
  }

  submit(){
    this.isDisabled = !this.isDisabled
  }

  ngOnInit(): void {
    this.contactService.getContactTypes().subscribe((data) => {
      this.types = data
      console.log(this.types)
    })
  }

  updateAllComplete(){

  }


}
