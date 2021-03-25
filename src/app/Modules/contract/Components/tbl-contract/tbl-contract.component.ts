import { Component, OnInit } from '@angular/core';
import { Contract } from 'src/app/Models/Contract';
import { ContractService } from '../../Services/Contract/contract.service';
import { Router } from '@angular/router';
import { ResponseApi } from 'src/app/Models/ResponseApi';
import { SecurityValidators } from 'src/app/Models/SecurityValidators';
import { Company } from 'src/app/Models/Company';
import { CompanyType } from 'src/app/Models/CompanyType';
import { FasDirective } from 'angular-bootstrap-md';


@Component({
  selector: 'app-tbl-contract',
  templateUrl: './tbl-contract.component.html',
  styleUrls: ['./tbl-contract.component.scss']
})
export class TblContractComponent implements OnInit {
  isAwaiting:boolean;
  p:number = 1;
  lsContracts: Contract[];
  isToUpdate:boolean;
  companyStorage:Company;
  hideButtonAdd: boolean;

  constructor(
    private contractService:ContractService,
    private router: Router
  ) { 
    this.hideButtonAdd  = false;
  }

  ngOnInit(): void {
    this.initComponents();
  }

  validateCompany(){
    try {
      this.companyStorage = SecurityValidators.validateUserAndCompany();
    } catch (error) {
      console.warn(error);
    }    
  }

  async initComponents(){
    this.validateCompany();
    this.isToUpdate = false;
    this.isAwaiting = false;
    this.getListContracts();
  }

  async getListContracts(){
    try{
      this.isAwaiting = true;

      switch(this.companyStorage.type){
        case CompanyType.DEALER:
          this.lsContracts = await this.contractService.getContracts(this.companyStorage.id);
          this.hideButtonAdd = true;
        break;
        case CompanyType.CLIENT:
          this.lsContracts = await this.contractService.getContracts(0,this.companyStorage.id);
          this.hideButtonAdd = true;
        break;
        default:
          this.lsContracts = await this.contractService.getContracts();
          this.hideButtonAdd = false;
          break;
      }
     
      this.isAwaiting = false;
    }catch(error){  
      console.error(error);
    }
  }
  
  moveContent(event:any){
    console.log(event);
    let containerContent:HTMLDivElement  = document.querySelector("#container__content"); 
    
    if(event){     
      containerContent.style.marginLeft = "250px";
    }else{
      containerContent.style.marginLeft = "0px";
    }
    
  }

  insertContract(){
    this.isToUpdate = false;
    this.contractService.setContract(null);
    this.router.navigate(['/MasterContracts/Contract']);
  }

  async updateContract(pContract:Contract){
    try {
      this.isAwaiting = true;
      let oContractToUpdate = await this.contractService.getContractByID(pContract.id);
      this.isAwaiting = false;
      console.log("[tbl-contract contract-to-update]: ",oContractToUpdate);
      this.contractService.setContract(oContractToUpdate);
      this.router.navigate(['/MasterContracts/Contract']);
    } catch (error) {
      console.error(error);
    }     
  }

  async deleteContract(pContract: Contract){
    try{
      if(confirm("¿Está seguro que desea elminar este contrato?, al hacerlo se eliminará toda la información relacionada")){
        this.isAwaiting = true;
        let rta = await this.contractService.delete(pContract);
        this.isAwaiting = false;
        if(rta.response){
          alert(rta.message);
          this.getListContracts();
        }
      }
    }catch(error){
      console.error(error);
      alert(error);
    }
  }



}
