import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ConfigPersonComponent } from 'src/app/Models/ConfigPersonComponent';
import { Dealer } from 'src/app/Models/Dealer';
import { Person } from 'src/app/Models/Person';
import { ResponseApi } from '../../../../Models/ResponseApi';
import { DealerService } from '../../Services/Dealer/dealer.service';
import { PersonService } from '../../../../SharedComponents/Services/Person/person.service';
import { Router } from '@angular/router';
import { ActionType } from 'src/app/Models/ActionType';
import { NavigationService } from 'src/app/SharedComponents/Services/navigation.service';


@Component({
  selector: 'app-dealer',
  templateUrl: './dealer.component.html',
  styleUrls: ['./dealer.component.scss']
})
export class DealerComponent implements OnInit, OnChanges {
  oConfigPersonComp: ConfigPersonComponent
  isAwaiting: boolean;
  oDataIsToUpdate: boolean;
  sReturnPath:string;
  oPersonToUpdate: Person;
  oDealerToUpdate: Dealer;
  errorMessage: string;
  bFormHasError:boolean;
  oIsToDealer:boolean;
  oDealerWasSaved:boolean;
  action: ActionType;

  constructor(
    private dealerService: DealerService,
    private personService: PersonService,
    private navigationService:NavigationService,
    private router:Router
  ) {
    this.sReturnPath = "/MasterDealers";
    this.oIsToDealer = true;
   }

  ngOnChanges(changes: SimpleChanges): void {
    this.validateActionToDo();
  }

  ngOnInit(): void {
    this.validateActionToDo();
    this.initComponents();

  }

  initComponents() {
    this.configurePersonComponent();
    this.hideContainerTabs();
    this.isAwaiting = false;
    this.oDataIsToUpdate = false;
    this.errorMessage = "";
    this.bFormHasError = false;
    this.oDealerWasSaved = false;
    this.validateDealerToUpdate();
  }

  validateActionToDo(): void {
    this.action = this.navigationService.getAction();
  }

  validateDealerToUpdate(){
    this.oDealerToUpdate = this.dealerService.getDealerToUpdate();
    if(this.oDealerToUpdate != null){
      this.setDataToUpdateDealer(this.oDealerToUpdate);
      this.oDataIsToUpdate = true;
    }
  }

  configurePersonComponent() {
    this.oConfigPersonComp = new ConfigPersonComponent();
    this.oConfigPersonComp.documentIsVisible = true;
    this.oConfigPersonComp.nameIsVisible = true;
  }

  SetDataToSaveDealer() {
    let oDealer = new Dealer();
    oDealer = this.personService.getPerson();
    this.saveDealer(oDealer);
  }

  async saveDealer(pDealer: Dealer) {
    try {
      pDealer = this.personService.getPerson();
      let rta = new ResponseApi();
      this.isAwaiting = true;
      if (this.oDataIsToUpdate) {
        rta = await this.dealerService.updateDealer(pDealer);
      } else {
        rta = await this.dealerService.insertDealer(pDealer);
      }
      this.isAwaiting = false;

      if(rta.response){
        alert(rta.message);
        let dealerTmp = await this.dealerService.getDealersByDocument(pDealer.document);
        this.dealerService.setDealerToUpdate(dealerTmp);
        this.oDealerWasSaved = true;
      }
    } catch (err) {
      console.warn(err.error.Message);
      this.bFormHasError = true;
      this.errorMessage = err.error.Message;
      this.isAwaiting = false;
    }
  }

  openTab(oButton: any, container: string) {
    let tabLinks = document.getElementsByClassName("tab_link");

    for (let i = 0; i < tabLinks.length; i++) {
      tabLinks[i].classList.remove("active");
    }
    oButton.target.className += " active";
    let containerTabs = document.getElementsByClassName("tab_content");

    for (let i = 0; i < containerTabs.length; i++) {
      containerTabs[i].setAttribute("style", "display:none");
    }

    let containerToShow_id = `container__${container}`;
    let containerToShow = document.getElementById(containerToShow_id);
    containerToShow.setAttribute("style", "display:blick");
  }

  hideContainerTabs() {
    let containers = document.getElementsByClassName("tab_inactive");
    for (let i = 0; i < containers.length; i++) {
      containers[i].setAttribute("style", "display:none");
    }
  }


  moveContent(event: any) {
    let containerContent: HTMLDivElement = document.querySelector("#container__content");

    if (event) {
      containerContent.style.marginLeft = "250px";
    } else {
      containerContent.style.marginLeft = "60px";
    }
  }

  setDataToUpdateDealer(pDealer: Dealer){
    this.oPersonToUpdate = new Person();
    this.oPersonToUpdate.id = pDealer.id;
    this.oPersonToUpdate.document = pDealer.document;
    this.oPersonToUpdate.name = pDealer.name.toLocaleLowerCase();
  }

  returnToTable(){
    this.router.navigate([this.sReturnPath]);
  }


}
