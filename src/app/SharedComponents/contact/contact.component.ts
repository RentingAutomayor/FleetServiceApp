import { variable } from '@angular/compiler/src/output/output_ast';
import { ContactWithTypeDTO } from 'src/app/Models/ContactWithTypeDTO';
import { ContactType } from './../../Models/ContactType';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { Client } from 'src/app/Models/Client'
import { ConfigPersonComponent } from 'src/app/Models/ConfigPersonComponent'
import { PersonService } from '../Services/Person/person.service'
import { Person } from 'src/app/Models/Person'
import { Contact, CreateContactDTO } from 'src/app/Models/Contact'
import { JobTitle } from 'src/app/Models/JobTitle'
import { Dealer } from 'src/app/Models/Dealer'
import { ActionType } from 'src/app/Models/ActionType'
import { ContactService } from '../Services/Contact/contact.service'
import Swal from 'sweetalert2'
import { ContactTypeService } from '../Services/ContactType/contacttype.service'

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  isAwaiting: boolean
  oConfigPersonComp: ConfigPersonComponent
  oPersonToUpdate: Person
  isToInsert: boolean
  btnAddContact: HTMLButtonElement
  sOwnerName: string
  titleComponent = 'Contactos'
  actionsAreVisible = true
  isFormBlocked = false
  buttonsAreVisibles = true
  // pagination
  p = 1
  selectedContactTypes: ContactType[] = []

  @Input() disableActionButtons: boolean

  buttonAddIsVisible: boolean
  action: ActionType = ActionType.READ

  @Input('action')
  set setAction(action: ActionType) {
    this.action = action
    this.validateIfButtonAddMustVisible(this.action)
  }

  lsContacts: Contact[] = []
  @Input('contacts')
  set setLsContacts(contacts: Contact[]) {
    this.lsContacts = contacts
  }

  client: Client
  @Input('client')
  set setClient(client: Client) {
    this.client = client
  }

  dealer: Dealer
  @Input('dealer')
  set setDealer(dealer: Dealer) {
    this.dealer = dealer
  }

  @Output() onContactsWereModified = new EventEmitter<Contact[]>()

  idTemp: number = -1

  isErrorVisible: boolean = false
  errorTitle: string = ''
  errorMessageApi: string = ''

  constructor(
    private personService: PersonService,
    private contactService: ContactService,
    private ContactTypeService : ContactTypeService

  ) {
    this.sOwnerName = ''
    this.disableActionButtons = false
    this.buttonAddIsVisible = false
    this.lsContacts = []
  }

  ngOnInit(): void {
    this.initComponents()
    this.ContactTypeService.dispContactType.subscribe( data => {
      console.log(data.selectedTypes.value)
      this.selectedContactTypes = data.selectedTypes.value;
    })
  }

  initComponents() {
    this.isAwaiting = false
    this.isToInsert = false
    this.configurePersonComponent()
    this.isErrorVisible = false
    this.errorTitle = ''
    this.errorMessageApi = ''
  }

  activateButtonAdd() {
    try {
      this.btnAddContact = document.querySelector('#btnAddContact')
      this.btnAddContact.disabled = false
      this.btnAddContact.classList.remove('error')
    } catch (error) {
      console.warn(error.message)
    }
  }

  configurePersonComponent() {
    this.oConfigPersonComp = new ConfigPersonComponent()
    this.oConfigPersonComp.nameIsVisible = true
    this.oConfigPersonComp.lastNameIsVisible = true
    this.oConfigPersonComp.phoneIsVisible = true
    this.oConfigPersonComp.cellphoneIsVisible = true
    this.oConfigPersonComp.emailIsVisible = true
    this.oConfigPersonComp.websiteIsVisible = false
    this.oConfigPersonComp.addressIsVisible = true
    this.oConfigPersonComp.jobTitleIsVisible = true
  }

  insertContact() {
    this.isToInsert = true
    this.oPersonToUpdate = null
    this.isFormBlocked = false
    this.showPopUp()
  }

  getDetailsOfContant(contactId: number) {
    this.oPersonToUpdate = this.lsContacts.find(
      (contact) => contact.id === contactId
    )
    this.isFormBlocked = true
    console.log(this.oPersonToUpdate)
    this.showPopUp()
  }

  updateContact(contactId: number) {
    this.isToInsert = false
    this.oPersonToUpdate = this.lsContacts.find(
      (contact) => contact.id === contactId
    )
    this.isFormBlocked = false
    this.showPopUp()
  }

  showPopUp() {
    const containerForm = document.getElementById('container__formContact')
    containerForm.setAttribute('style', 'display:block')
  }

  hidePopUp() {
    const containerForm = document.getElementById('container__formContact')
    containerForm.setAttribute('style', 'display:none')
  }

  saveContact() {
    try {
      const oPerson = this.personService.getPerson()
      let oContact = null
      if (this.isToInsert) {
        oContact = this.setDataToContact(oPerson)
        oContact.id = this.idTemp
        this.idTemp--
      } else {
        oContact = this.setDataToContact(oPerson)
        oContact.id = oPerson.id
      }

      if (oContact != null) {
        this.saveData(oContact)
      }
    } catch (err) {
      console.error(err.error.Message)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.error.Message,
        footer: '</a>Consulte con Soporte el problema</a>'
      })
    }
  }

  saveData(oContact: Contact) {
    const contactToDB = this.completeContactInformationWithOwner(oContact)
    console.log(contactToDB)

    if (this.isToInsert) {
      //this case happens when is a new client or dealer
      if (contactToDB.Client_id == 0 || contactToDB.Dealer_id == 0) {
        this.lsContacts.unshift(oContact)
      } else {
        this.isAwaiting = true
        //This case happens when exist a client or a dealer
        this.contactService.insert(contactToDB).subscribe(
          (newContact) => {
            this.lsContacts.unshift(newContact)
            this.isAwaiting = false
            this.saveContactWithType(newContact, this.selectedContactTypes);
          },
          (err) => {
            this.isErrorVisible = true
            this.isAwaiting = false
            this.errorTitle = 'Ocurrió un error intentando Insertar el contacto'
            this.errorMessageApi = err.error.Message
          }
        )
      }
    } else {
      if (contactToDB.Client_id == 0 || contactToDB.Dealer_id == 0) {
        //this case happens when is a new client or dealer
        const contactIndex = this.lsContacts.findIndex(
          (cnt) => cnt.id == oContact.id
        )
        this.lsContacts[contactIndex] = oContact
      } else {
        this.contactService.update(contactToDB).subscribe(
          (contactUpdated) => {
            const contactIndex = this.lsContacts.findIndex(
              (cnt) => cnt.id == contactUpdated.id
            )
            this.lsContacts[contactIndex] = contactUpdated
            this.isAwaiting = false
          },
          (err) => {
            this.isErrorVisible = true
            this.isAwaiting = false
            this.errorTitle =
              'Ocurrió un error intentando Actualizar el contacto'
            this.errorMessageApi = err.error.Message
          }
        )
      }
    }
    this.hidePopUp()

    this.onContactsWereModified.emit(this.lsContacts)
  }

  saveContactWithType(contact : CreateContactDTO, selectedContactTypes : ContactType[]) {

    const tempContact = new ContactWithTypeDTO()
    tempContact.contact = contact
    tempContact.contactType = selectedContactTypes
    console.log(JSON.stringify(tempContact))
    this.contactService.insertContactWithType(tempContact).subscribe(
       (newContact) => {
         console.log(newContact)
       }
     ),(err: any) => {
        console.log(err)
     }

  }

  completeContactInformationWithOwner(
    contact: CreateContactDTO
  ): CreateContactDTO {
    if (this.client != null) {
      contact.Client_id = this.client.id
    }

    if (this.dealer != null) {
      contact.Dealer_id = this.dealer.id
    }

    return contact
  }

  deleteContact(pContact: Contact) {
    try {
      if (confirm('¿Está seguro que desea eliminar este contacto?')) {
        this.isAwaiting = true
        const contactToDB = this.completeContactInformationWithOwner(pContact)
        if (contactToDB.Client_id == 0 || contactToDB.Dealer_id == 0) {
          const contactIndex = this.lsContacts.findIndex(
            (cnt) => cnt.id == pContact.id
          )
          this.lsContacts.splice(contactIndex, 1)
        } else {
          this.contactService.delete(pContact.id).subscribe(
            (rta) => {
              const contactIndex = this.lsContacts.findIndex(
                (cnt) => cnt.id == pContact.id
              )
              this.lsContacts.splice(contactIndex, 1)
            },
            (err) => {
              this.isErrorVisible = true
              this.isAwaiting = false
              this.errorTitle =
                'Ocurrió un error intentando Eliminar el contacto'
              this.errorMessageApi = err.error.Message
            }
          )
        }

        this.isAwaiting = false
        this.onContactsWereModified.emit(this.lsContacts)
      }
    } catch (err) {
      console.error(err.error.Message)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.error.Message,
        footer: '</a>Consulte con Soporte el problema</a>'
      })
    }
  }

  setDataToContact(oPerson: Person): CreateContactDTO {
    const oContact = {} as CreateContactDTO
    oContact.name = oPerson.name
    oContact.lastname = oPerson.lastname
    oContact.phone = oPerson.phone
    oContact.cellphone = oPerson.cellphone
    oContact.email = oPerson.email
    oContact.address = oPerson.address
    oContact.jobTitle = oPerson.jobTitle != null ? oPerson.jobTitle : null
    oContact.city = oPerson.city != null ? oPerson.city : null
    oContact.Dealer_id = this.dealer != null ? this.dealer.id : null
    oContact.Client_id = this.client != null ? this.client.id : null
    oContact.mustNotify = oPerson.mustNotify

    return oContact
  }

  validateJobTitle(pJobTitle: JobTitle): string {
    if (pJobTitle != null) {
      return pJobTitle.description
    }
    return ''
  }

  comeBackToTable() {
    this.oPersonToUpdate = null
    this.hidePopUp()
  }

  validateIfButtonAddMustVisible(action: ActionType) {
    switch (action) {
      case ActionType.READ:
        this.buttonAddIsVisible = false
        break
      case ActionType.UPDATE:
      case ActionType.CREATE:
        this.buttonAddIsVisible = true
        break
    }
    this.validateData()
  }

  validateData() {
    if (
      (this.client != null && this.client != undefined) ||
      (this.dealer != null && this.dealer != undefined)
    ) {
      this.activateButtonAdd()
    }
  }

  closeErrorMessage() {
    this.isErrorVisible = false
  }
}
