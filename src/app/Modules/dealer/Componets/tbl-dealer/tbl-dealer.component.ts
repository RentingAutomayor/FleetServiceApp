import { Component, OnInit } from '@angular/core';
import { City } from 'src/app/Models/City';
import { Dealer } from 'src/app/Models/Dealer';
import { Router } from '@angular/router';
import { DealerService } from '../../Services/Dealer/dealer.service';

@Component({
  selector: 'app-tbl-dealer',
  templateUrl: './tbl-dealer.component.html',
  styleUrls: ['./tbl-dealer.component.scss']
})
export class TblDealerComponent implements OnInit {
  lsDealer: Dealer[];
  isAwaiting:boolean;
  //pagination
  p:number = 1;
  private oDealerToUpdate : Dealer;

  constructor(
    private router:Router,
    private dealerService: DealerService
  ) { }

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
      this.lsDealer = await this.dealerService.getDealers();
      this.isAwaiting = false;
    } catch (err) {
      console.error(err.error.Message);
    }
  }

  async updateDealer(pId:number){
    try{
      this.isAwaiting = true;
      let oDealerDB = await this.dealerService.getDealerById(pId);
      this.dealerService.setDealerToUpdate(oDealerDB);
      this.isAwaiting = false;
      this.router.navigate(["/MasterDealers/Dealer"]);
    }catch(err){
      console.error(err.error.Message);
      alert(err.error.Message);
    }
  }

  async deleteDealer(pDealer:Dealer){
    try{
      if(confirm("¿Está seguro que desea eliminar este concesionario?")){
        this.isAwaiting = true;
        let rta = await this.dealerService.deleteDealer(pDealer);
        this.isAwaiting = false;
        if(rta.response){
          alert(rta.message);
          this.initComponents();
        }
      }
    }catch(err){
      console.error(err.error.Message);
      alert(err.error.Message);
    }

  }

  moveContent(event:any){
    let containerContent:HTMLDivElement  = document.querySelector("#container__content");

    if(event){
      containerContent.style.marginLeft = "250px";
    }else{
      containerContent.style.marginLeft = "0px";
    }

  }

  insertDealer(){
    this.dealerService.setDealerToUpdate(null);
    this.router.navigate(["/MasterDealers/Dealer"]);
  }

  validateCityName(pCity:City):string{
    return '';
  }

}
