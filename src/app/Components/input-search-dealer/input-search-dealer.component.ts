import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Dealer } from 'src/app/Models/Dealer';
import { DealerService } from '../../Services/dealer.service';

@Component({
  selector: 'app-input-search-dealer',
  templateUrl: './input-search-dealer.component.html',
  styleUrls: ['./input-search-dealer.component.scss','../../../assets/styles/searchList.scss']
})
export class InputSearchDealerComponent implements OnInit {
  lsDealerSuggestion$: Observable<Dealer[]>;
  private description = new Subject<string>();
  frmSearchDealer: FormGroup;
  listIsvisible: boolean;
  @Output() dealerWasSetted = new EventEmitter<boolean>();

  constructor(
    private dealerService: DealerService
  ) {
    this.frmSearchDealer = new FormGroup({
      txtDealer: new FormControl('')
    });
   }

  ngOnInit(): void {
    this.initComponents();
  }

  async initComponents(){
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
    let {txtDealer} = this.frmSearchDealer.controls;
    txtDealer.setValue(this.getDealerDescription(pDealer));
    this.dealerService.setDealerSelected(pDealer);
    this.listIsvisible = false;
    this.dealerWasSetted.emit(true);
  }
}
