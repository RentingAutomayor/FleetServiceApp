import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import { Client } from 'src/app/Models/Client';
import { Contract } from 'src/app/Models/Contract';
import { ContractState } from 'src/app/Models/ContractState';
import { VehicleModel } from 'src/app/Models/VehicleModel';
import { ClientService } from '../../Services/client.service';
import { VehicleService } from '../../Services/vehicle.service';
import { Dealer } from 'src/app/Models/Dealer';
import { DealerService } from '../../Services/dealer.service';
import { ContractService } from '../../Services/contract.service';
import { ResponseApi } from 'src/app/Models/ResponseAPI';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit {
  frmContract: FormGroup;
  @Input() countChanges: number;
  @Output() contractWasSetted = new EventEmitter<boolean>();

  contract: Contract;
  contractToUpdate:Contract;
  lsVehicleModelsTemp: VehicleModel[] = [];
  dtStartingDate:Date;
  dtEndingDate:Date;
  isToUpdate:boolean;
  

  isAwaiting:boolean;
  constructor(
    private clientService: ClientService,
    private vehicleService: VehicleService,
    private dealerService: DealerService,
    private datePipe: DatePipe,
    private contractService:ContractService
  ) {
    let now = new Date();
    let monthfuture = new Date(now.getFullYear(),now.getMonth() + 1,now.getDay());
    this.dtStartingDate = now;
    this.dtEndingDate = now;
    this.frmContract = new FormGroup({
      txtContractName: new FormControl(''),
      txtAmountOfMaintenances: new FormControl(''),
      txtDuration: new FormControl(''),
      txtStartingDate: new FormControl(now,[]),
      txtEndingDate: new FormControl(monthfuture,[]),
      txtDiscountValue: new FormControl(''),
      txtObservation: new FormControl(''),
      txtAmountVehicles : new FormControl('')
    });
  }

  ngOnInit(): void {
    this.initComponents();
  }

  async initComponents() {
    this.isToUpdate = false;
    this.isAwaiting = false;
    this.contract = new Contract();
    this.countChanges = 0;
    this.hideContainerTabs();
    this.validateContractToUpdate();
  }

  validateContractToUpdate(){
    this.contractToUpdate = this.contractService.getContract();
    if(this.contractToUpdate != null && this.contractToUpdate != undefined){
      this.isToUpdate = true;
    }else{
      this.isToUpdate = false;
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

    ////console.log(containerToShow);

    containerToShow.setAttribute("style", "display:blick");
  }

  hideContainerTabs() {
    let containers = document.getElementsByClassName("tab_inactive");
    for (let i = 0; i < containers.length; i++) {
      containers[i].setAttribute("style", "display:none");
    }
  }

  moveContent(event: any) {
    ////console.log(event);
    let containerContent: HTMLDivElement = document.querySelector("#container__content");

    if (event) {
      containerContent.style.marginLeft = "250px";
    } else {
      containerContent.style.marginLeft = "60px";
    }

  }

  setVehiclType() {
    this.countChanges += 1;
  }

  setListVehicleTypes() {
    this.countChanges += 1;
  }

  setLisVehicleModels() {
    this.countChanges += 1;
    this.contract.lsVehicleModels = this.vehicleService.getListVehicleModelsSelected();
    //console.log("[contract component - lsModels] :", this.contract.lsVehicleModels);
  }

  setClientSelected() {
    this.contract.client = new Client();
    this.contract.client = this.clientService.getClientSelected();    
    this.vehicleService.setListVehicleTypeSelected(null);
    this.vehicleService.setListVehicleModelsSelected(null);
    this.countChanges += 1;

  }

  setDealerSelected(){
    this.contract.dealer = new Dealer();
    this.contract.dealer = this.dealerService.getDealerSelected();
  }

  calculateEndingDate(){
    let { txtDuration,txtStartingDate ,txtEndingDate} = this.frmContract.controls;
    
    console.log("Si está reconociendo el evento");
    console.log(txtStartingDate.value);

    let pStartingDate = txtStartingDate.value;
    console.log("[contract-component]: ",pStartingDate);
    let duration = txtDuration.value;
    
    
    let endingDate = new Date(pStartingDate.getFullYear(),pStartingDate.getMonth(),(pStartingDate.getDate()));    
    endingDate.setMonth(endingDate.getMonth() + duration);
   
     let strEndDate = endingDate.toISOString().substring(0,10);
     this.dtEndingDate = endingDate;
     console.log(strEndDate,endingDate); 
   
  }


  saveContract(){
    let {txtContractName, txtAmountOfMaintenances,txtDuration,txtStartingDate,txtEndingDate,txtObservation,txtDiscountValue, txtAmountVehicles} = this.frmContract.controls;
    this.contract.client = new Client();
    this.contract.client = this.clientService.getClientSelected();

    this.contract.dealer = new Dealer();
    this.contract.dealer = this.dealerService.getDealerSelected();

    this.contract.name = txtContractName.value;
    this.contract.amountOfMaintenances = txtAmountOfMaintenances.value;
    this.contract.amountVehicles = txtAmountVehicles.value;
    this.contract.duration = txtDuration.value;
    this.contract.startingDate = txtStartingDate.value;
    this.contract.endingDate = txtEndingDate.value;
    this.contract.discountValue = txtDiscountValue.value;
    this.contract.observation = txtObservation.value;

    this.contract.contractState = this.contractService.getContractStateSelected();
    this.contract.discountType = this.contractService.getDiscountTypeSelected();
    this.contract.lsVehicleModels = this.vehicleService.getListVehicleModelsSelected();
    this.contract.lsVehicles = this.vehicleService.getListVehiclesSelected();

    console.warn("[Contrato a guardar]");
    //console.log(this.contract);

    this.saveData(this.contract);    
  } 

  async saveData(pContract:Contract){
    try {
      this.isAwaiting = true;
      let rta = new ResponseApi();
      if(this.isToUpdate){
        rta = await this.contractService.update(pContract);
      }else{
        rta = await this.contractService.insert(pContract);
      }
      this.isAwaiting = false;
      if (rta.response){
        alert(rta.message);
      }
    } catch (error) {
      this.isAwaiting = false;
      console.error(error);
    }
  }
}
