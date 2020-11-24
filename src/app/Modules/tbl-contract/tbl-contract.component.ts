import { Component, OnInit } from '@angular/core';
import { Contract } from 'src/app/Models/Contract';
import { ContractService } from '../../Services/contract.service';
import { Router } from '@angular/router';
import { ResponseApi } from 'src/app/Models/ResponseAPI';


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

  constructor(
    private contractService:ContractService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initComponents();
  }

  async initComponents(){
    this.isToUpdate = false;
    this.isAwaiting = false;
    this.getListContracts();
  }

  async getListContracts(){
    try{
      this.isAwaiting = true;
      this.lsContracts = await this.contractService.getContracts();
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
    this.router.navigate(['/Contract']);
  }

  async updateContract(pContract:Contract){
    try {
      this.isAwaiting = true;
      let oContractToUpdate = await this.contractService.getContractByID(pContract.id);
      this.isAwaiting = false;
      console.log("[tbl-contract contract-to-update]: ",oContractToUpdate);
      this.contractService.setContract(oContractToUpdate);
      this.router.navigate(['/Contract']);
    } catch (error) {
      console.error(error);
    }     
  }



}
