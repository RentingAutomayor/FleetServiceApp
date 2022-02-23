import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
  Input,
} from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'
import { Observable, Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators'
import { Client } from 'src/app/Models/Client'
import { ClientService } from 'src/app/Modules/client/Services/Client/client.service'

@Component({
  selector: 'app-input-search-client',
  templateUrl: './input-search-client.component.html',
  styleUrls: [
    './input-search-client.component.scss',
    '../../../assets/styles/searchList.scss',
  ],
})
export class InputSearchClientComponent implements OnInit, OnChanges {
  frmSearchClient: FormGroup
  lsClientSuggestion$: Observable<Client[]>
  listIsvisible: boolean
  clientSelected: Client
  private description = new Subject<string>()
  @Input() countChanges: number
  @Input() disableField: boolean
  @Output() clientWasSetted = new EventEmitter<boolean>()

  constructor(private clientService: ClientService) {
    this.frmSearchClient = new FormGroup({
      txtClient: new FormControl(''),
    })

    this.disableField = false
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const change in changes) {
      if (change == 'countChanges') {
        this.clientSelected = this.clientService.getClientSelected()
        if (this.clientSelected != null && this.clientSelected != undefined) {
          this.setDataInForm(this.clientSelected)
        } else {
          this.frmSearchClient.reset()
        }
      } else if (change == 'disableField') {
        this.toggleClientField()
      }
    }
  }

  ngOnInit(): void {
    this.initComponents()
  }

  async initComponents() {
    this.toggleClientField()
    this.countChanges = 0
    this.listIsvisible = false
    this.lsClientSuggestion$ = this.description.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((desc: string) =>
        this.clientService.getClientsByDescriptions(desc)
      )
    )
  }

  searchBydescription(sDescription: string) {
    if (sDescription == '') {
      this.clientService.setClientSelected(null)
    }
    this.listIsvisible = true
    this.description.next(sDescription)
  }

  getClientDescription(pClient: Client): string {
    return `${pClient.document} | ${pClient.name.toUpperCase()}`
  }

  setClient(pClient: Client) {
    this.clientSelected = pClient
    this.setDataInForm(pClient)
    this.listIsvisible = false
    this.clientService.setClientSelected(pClient)
    this.clientWasSetted.emit(true)
  }

  setDataInForm(pClient: Client) {
    const { txtClient } = this.frmSearchClient.controls
    txtClient.setValue(this.getClientDescription(pClient))
  }

  loseFocus() {
    this.clientWasSetted.emit(true)
  }

  toggleClientField() {
    const { txtClient } = this.frmSearchClient.controls
    if (this.disableField) {
      txtClient.disable()
    } else {
      txtClient.enable()
    }
  }
}
