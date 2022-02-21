import { Component, OnInit } from '@angular/core';
import { City } from 'src/app/Models/City';
import { Dealer } from 'src/app/Models/Dealer';
import { Router } from '@angular/router';
import { DealerService } from '../../Services/Dealer/dealer.service';
import { ActionType } from 'src/app/Models/ActionType';
import { NavigationService } from 'src/app/SharedComponents/Services/navigation.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-tbl-dealer',
  templateUrl: './tbl-dealer.component.html',
  styleUrls: ['./tbl-dealer.component.scss']
})
export class TblDealerComponent implements OnInit {
  lsDealer: Dealer[] = [];
  lsDealerFiltered: Dealer[] = [];
  isAwaiting: boolean;
  // pagination
  p = 1;
  action: ActionType;
  private oDealerToUpdate: Dealer;

  txtFilter: FormControl;

  constructor(
    private router: Router,
    private dealerService: DealerService,
    private navigationService: NavigationService
  ) {
    this.txtFilter = new FormControl();
    this.txtFilter.valueChanges
    .subscribe(description => {
      this.lsDealerFiltered = this.lsDealer.filter(dealer =>{
        if(description != null){
          return dealer.document.includes(description) ||
          dealer.name.toUpperCase().includes(description.toUpperCase());
        }
      });
    })
  }

  ngOnInit(): void {
    this.initComponents();
  }

  initComponents(){
    this.dealerService.setDealerToUpdate(null);
    this.showTableDealers();
  }

  async showTableDealers(){
    try {
      this.isAwaiting = true;
      this.dealerService.getDealers()
      .subscribe(dealers => {
        this.lsDealer = dealers;
        this.lsDealerFiltered = dealers;
      });
      this.isAwaiting = false;
    } catch (err) {
      console.error(err.error.Message);
    }
  }

  async updateDealer(pId: number){
    try{
      this.isAwaiting = true;
      this.navigationService.setAction(ActionType.UPDATE);
      const oDealerDB = await this.dealerService.getDealerById(pId);
      this.dealerService.setDealerToUpdate(oDealerDB);
      this.isAwaiting = false;
      this.router.navigate(['/MasterDealers/Dealer']);
    }catch (err){
      console.error(err.error.Message);
      alert(err.error.Message);
    }
  }

  async deleteDealer(pDealer: Dealer){
    try{
      if (confirm('¿Está seguro que desea eliminar este concesionario?')){
        this.isAwaiting = true;
        const rta = await this.dealerService.deleteDealer(pDealer);
        this.isAwaiting = false;
        if (rta.response){
          alert(rta.message);
          this.initComponents();
        }
      }
    }catch (err){
      console.error(err.error.Message);
      alert(err.error.Message);
    }

  }

  moveContent(event: any){
    const containerContent: HTMLDivElement  = document.querySelector('#container__content');

    if (event){
      containerContent.style.marginLeft = '250px';
    }else{
      containerContent.style.marginLeft = '0px';
    }

  }

  insertDealer(){
    this.dealerService.setDealerToUpdate(null);
    this.navigationService.setAction(ActionType.CREATE);
    this.router.navigate(['/MasterDealers/Dealer']);
  }

  validateCityName(pCity: City): string{
    return '';
  }

  removeFilter(): void{
    this.txtFilter.setValue(null);
    this.lsDealerFiltered = this.lsDealer;
  }

}
