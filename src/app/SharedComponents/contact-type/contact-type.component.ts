import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { IContactType } from 'src/app/Models/IContactType'
import { ContactService } from '../Services/Contact/contact.service'
import { FormControl } from '@angular/forms'

@Component({
  selector: 'app-contact-type',
  templateUrl: './contact-type.component.html',
  styleUrls: ['./contact-type.component.scss'],
})
export class ContactTypeComponent implements OnInit {
  isDisabled: boolean = false

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

  constructor(private contactService: ContactService) {
    this.cmbTypes.valueChanges.subscribe((value) => {
      const contacType: IContactType = this.types.find((ct) => ct.id == value)
      this.onTypeChanged.emit(contacType)
    })
  }

  ngOnInit(): void {
    this.contactService.getContactTypes().subscribe((data) => {
      this.types = data
    })
  }
}
