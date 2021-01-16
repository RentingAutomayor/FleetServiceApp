import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import { Client } from 'src/app/Models/Client';
import { Contract } from 'src/app/Models/Contract';
import { ContractState } from 'src/app/Models/ContractState';
import { VehicleModel } from 'src/app/Models/VehicleModel';
import { ClientService } from 'src/app/Modules/client/Services/Client/client.service';
import { VehicleService } from '../../../client/Services/Vehicle/vehicle.service';
import { Dealer } from 'src/app/Models/Dealer';
import { DealerService } from '../../../dealer/Services/Dealer/dealer.service';
import { ContractService } from '../../Services/Contract/contract.service';
import { ResponseApi } from 'src/app/Models/ResponseApi';
import { Router } from '@angular/router';
import { VehicleType } from 'src/app/Models/VehicleType';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit {
  frmContract: FormGroup;
  @Input() countChanges: number;
  @Output() contractWasSetted = new EventEmitter<boolean>();
  oChangeDealer:number;

  contract: Contract;
  contractToUpdate:Contract;
  lsVehicleModelsTemp: VehicleModel[] = [];
  dtStartingDate:Date;
  dtEndingDate:Date;
  isToUpdate:boolean;
  oGetPricesOfContract:number;
  

  isAwaiting:boolean;
  constructor(
    private clientService: ClientService,
    private vehicleService: VehicleService,
    private dealerService: DealerService,
    private datePipe: DatePipe,
    private contractService:ContractService,
    private router:Router
  ) {
    let now = new Date();
    let monthfuture = new Date(now.getFullYear(),now.getMonth() + 1,now.getDay());
    this.dtStartingDate = now;
    this.dtEndingDate = now;
    this.frmContract = new FormGroup({
      txtContractName: new FormControl(''),
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
    this.oChangeDealer = 0;
    this.oGetPricesOfContract = 0;
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
      this.setDataInForm(this.contractToUpdate);
    }else{
      this.isToUpdate = false;
      this.clientService.setClientSelected(null);
      this.dealerService.setDealerSelected(null);
      this.contractService.setContractStateSelected(null);
      this.contractService.setDiscountTypeSelected(null);
      this.vehicleService.setListVehicleTypeSelected(null);
      this.vehicleService.setListVehicleModelsSelected(null);
      this.vehicleService.setListVehiclesSelected(null);
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
    this.oChangeDealer += 1;
  }

  calculateEndingDate(){
    let { txtDuration,txtStartingDate ,txtEndingDate} = this.frmContract.controls;
    
    console.log("Si está reconociendo el evento");
    console.log(txtStartingDate.value);

    let dTmp = txtStartingDate.value;
    console.log("Sin formato",dTmp)
    let pStartingDate = null;

    try {
      console.log("Sin error");
      console.log(dTmp.toISOString().substring(0,10));
      pStartingDate = this.formatDate(dTmp.toISOString().substring(0,10));
    } catch (error) {
      console.log("Con error");
      dTmp = `${txtStartingDate.value}`;
      console.log(dTmp.substr(0,10));
      pStartingDate = this.formatDate(dTmp.substr(0,10));
    }
      
    //let pStartingDate = txtStartingDate.value;
    console.log("Con formato",pStartingDate);

    console.log("[contract-component]: ",pStartingDate);
    let duration = txtDuration.value;
    
    let endingDate = new Date(pStartingDate.getFullYear(),(pStartingDate.getMonth() - 1),(pStartingDate.getDate()));    
    endingDate.setMonth(endingDate.getMonth() + duration);
   
     let strEndDate = endingDate.toISOString().substring(0,10);
     this.dtEndingDate = endingDate;
     console.log(strEndDate,endingDate); 
   
  }

  setDataInForm(pContract:Contract){
    let {txtContractName,txtDuration,txtStartingDate,txtEndingDate,txtObservation,txtDiscountValue, txtAmountVehicles} = this.frmContract.controls;    txtContractName.setValue(pContract.name);
    
    txtDuration.setValue(pContract.duration);
    txtStartingDate.setValue(pContract.startingDate);
    
    this.dtStartingDate = this.formatDate(pContract.startingDate.toString().substr(0,10));
    txtEndingDate.setValue(pContract.endingDate);
    this.dtEndingDate =  this.formatDate(pContract.endingDate.toString().substr(0,10));

    txtObservation.setValue(pContract.observation);
    txtDiscountValue.setValue(pContract.discountValue);
    txtAmountVehicles.setValue(pContract.amountVehicles);
    let lsVehicleType = this.getVehicletypesByContract(pContract.lsVehicleModels);
    this.clientService.setClientSelected(pContract.client);
    this.dealerService.setDealerSelected(pContract.dealer);

    this.contractService.setContractStateSelected(pContract.contractState);
    this.contractService.setDiscountTypeSelected(pContract.discountType);


    this.vehicleService.setListVehicleTypeSelected(lsVehicleType);
    this.vehicleService.setListVehicleModelsSelected(pContract.lsVehicleModels);
    this.vehicleService.setListVehiclesSelected(pContract.lsVehicles);

    this.countChanges += 1;
  }

  getVehicletypesByContract(lsVehicleModel:VehicleModel[]):VehicleType[]{
    let lsVehicletype: VehicleType[] = [];

    lsVehicleModel.forEach(vm => {
      let vehicleType = vm.type;
      let existsType  = lsVehicletype.find(vt => vt.id == vehicleType.id);

      if(!existsType){
        console.log("Añade tipo de vehículo");
        lsVehicletype.push(vehicleType);
      }
    });

    console.log(lsVehicletype);
    return lsVehicletype;
  }


  saveContract(){
    let {txtContractName,txtDuration,txtStartingDate,txtEndingDate,txtObservation,txtDiscountValue, txtAmountVehicles} = this.frmContract.controls;
    
    if(this.contractToUpdate != null && this.contractToUpdate != undefined){
      this.contract.id = this.contractToUpdate.id;
      this.contract.code = this.contractToUpdate.code;
      this.contract.consecutive = this.contractToUpdate.consecutive;
    }
    
    this.contract.client = new Client();
    this.contract.client = this.clientService.getClientSelected();

    this.contract.dealer = new Dealer();
    this.contract.dealer = this.dealerService.getDealerSelected();

    this.contract.name = txtContractName.value;
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
        let lastContract = await this.contractService.getLastContractByClientAndDealer(pContract.client.id,pContract.dealer.id);
        this.contractService.setContract(lastContract);
      }

      
      this.isAwaiting = false;
      if (rta.response){
        //alert(rta.message);
        this.oGetPricesOfContract += 1; 
        //this.router.navigate(['/MasterContracts']);
      }
    } catch (error) {
      this.isAwaiting = false;
      console.error(error);
    }
  }

  comeBackTable(){
    this.router.navigate(['/MasterContracts']);
  }

  formatDate(sDate:string):Date{
    console.log(sDate);

    let year = parseInt(sDate.substring(0,4));
    let month = parseInt(sDate.substring(5,7));
    let day = parseInt(sDate.substring(8,10));

    console.log(year,month,day);
    let dateToReturn = new Date(year,month,day);
    console.log(dateToReturn);
    return dateToReturn;
  }
}
