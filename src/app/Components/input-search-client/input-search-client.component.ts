import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup , FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Client } from 'src/app/Models/Client';
import { ClientService } from '../../Services/client.service';

@Component({
  selector: 'app-input-search-client',
  templateUrl: './input-search-client.component.html',
  styleUrls: ['./input-search-client.component.scss','../../../assets/styles/searchList.scss']
})
export class InputSearchClientComponent implements OnInit {
  frmSearchClient: FormGroup;
  lsClientSuggestion$: Observable<Client[]>;
  listIsvisible:boolean;
  private description = new  Subject<string>();
  @Output() clientWasSetted = new EventEmitter<boolean>();

  constructor(
    private clientService: ClientService
  ) { 
    this.frmSearchClient = new FormGroup({
      txtClient: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.initComponents();
  }

  async initComponents(){
    this.listIsvisible = false;
    this.lsClientSuggestion$ = this.description.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((desc: string) => this.clientService.getClientsByDescriptions(desc)),
    )
  }

  searchBydescription(sDescription:string){
    console.log(sDescription);
    this.listIsvisible = true;
    this.description.next(sDescription);
    
  }

  getClientDescription(pClient:Client): string{
    return `${pClient.document} | ${pClient.name.toUpperCase()}`;
  }

  setClient(pClient:Client){
    let {txtClient} = this.frmSearchClient.controls;
    console.log(pClient);
    txtClient.setValue(this.getClientDescription(pClient));
    this.listIsvisible = false;
    this.clientService.setClientSelected(pClient);
    this.clientWasSetted.emit(true);
  }
}
