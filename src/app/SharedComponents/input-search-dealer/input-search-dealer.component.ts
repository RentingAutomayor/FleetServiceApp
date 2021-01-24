import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Dealer } from 'src/app/Models/Dealer';
import { DealerService } from '../../Modules/dealer/Services/Dealer/dealer.service';

@Component({
  selector: 'app-input-search-dealer',
  templateUrl: './input-search-dealer.component.html',
  styleUrls: ['./input-search-dealer.component.scss','../../../assets/styles/searchList.scss']
})
export class InputSearchDealerComponent implements OnInit,OnChanges {
  lsDealerSuggestion$: Observable<Dealer[]>;
  private description = new Subject<string>();
  frmSearchDealer: FormGroup;
  listIsvisible: boolean;
  dealerSelected: Dealer;
  @Input() countChanges:number;
  @Input() disableField: boolean;
  @Output() dealerWasSetted = new EventEmitter<boolean>();

  constructor(
    private dealerService: DealerService
  ) {
    this.frmSearchDealer = new FormGroup({
      txtDealer: new FormControl('')
    });

    this.disableField = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (let change in changes) {
      console.log("[DisabledFieldDealer]",this.disableField);
      if(change == "countChanges"){
        this.dealerSelected = this.dealerService.getDealerSelected();
        if(this.dealerSelected != null && this.dealerSelected != undefined){
          this.setDataInForm(this.dealerSelected);
        }
      }      
    }
  }

  ngOnInit(): void {
    this.initComponents();
  }

  async initComponents(){
    if(this.disableField){
      this.frmSearchDealer.controls.txtDealer.disable();
    }
    this.countChanges = 0;
    this.listIsvisible = false;
    this.lsDealerSuggestion$ = this.description.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((desc:string) => this.dealerService.getDealersByDescription(desc))
    )
  }

  searchBydescription(sDescription:string){
    this.listIsvisible = true;
    this.description.next(sDescription);
  }

  getDealerDescription(pDealer: Dealer){
    return `${pDealer.document} | ${pDealer.name.toUpperCase()} `
  }

  setDealer(pDealer: Dealer){
    this.setDataInForm(pDealer);
    this.dealerService.setDealerSelected(pDealer);
    this.listIsvisible = false;
    this.dealerWasSetted.emit(true);
  }

  setDataInForm(pDealer: Dealer){
    let {txtDealer} = this.frmSearchDealer.controls;
    txtDealer.setValue(this.getDealerDescription(pDealer));
  }
}
