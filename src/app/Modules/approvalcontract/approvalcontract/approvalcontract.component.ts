import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Company } from 'src/app/Models/Company';
import { Contract } from 'src/app/Models/Contract';
import { SecurityValidators } from 'src/app/Models/SecurityValidators';
import { User } from 'src/app/Models/User';
import { AlertService } from 'src/app/services/alert.service';
import { ContractService } from '../../contract/Services/Contract/contract.service';
import { DialogApprovalContract } from '../dialog-approvalcontract/dialog-approvalcontract';
import { ApprovalContractService } from '../services/approvalcontract.service';

@Component({
  selector: 'app-approvalcontract',
  templateUrl: './approvalcontract.component.html',
  styleUrls: ['./approvalcontract.component.scss']
})

export class ApprovalcontractComponent implements OnInit {
  
  constructor(
    public dialog: MatDialog,
    public approvalContractService: ApprovalContractService,
    public contractService: ContractService,
    public alertService: AlertService
  
  ) { }

  company : Company
  dealerID : number;
  contractsToApprove : Contract[] = [];
  contractDialog : Contract = null

  openDialog(idContract : number) {
    this.contractDialog = this.contractsToApprove.find(x => x.id == idContract);
    this.dialog.open(DialogApprovalContract, 
      {
        disableClose: true, /*position : {top : '50px'}*/
        data : this.contractDialog
      }
    );
  }

  ngOnInit(): void {
    this.initdata();
  }
  
  initdata(){
    this.setCompany();
    this.setDealerid();
    
  }

  setDealerid(){
    this.approvalContractService.GetUserWithDealer(this.company.usr_id).subscribe(
      (data : User) =>{
        console.log()
        if(data?.id_group == 3 && data?.dealerid != null ){
          this.dealerID = data?.dealerid;
          this.getContractsToList();
        }
      }
    )
  }

  getContractsToList(){
    this.contractService.getContractPending(this.dealerID).subscribe(
      (data : Contract[]) =>{
        this.contractsToApprove = data
      }
    )
  }

  setCompany(){
    this.company = SecurityValidators.validateUserAndCompany();
  }

  approveContract(contactid : number){
    this.alertService.confirm('¿Está seguro de aprobar el contrato?', () =>{
      this.approvalContractService.updateStateContract(contactid,true).subscribe(
        (data : Contract) =>{
          console.log(data);
          this.getContractsToList();
        }
      )
    })
  }

  declineContract(contactid : number){
    this.alertService.confirm('¿Está seguro de Cancelar el contrato?', () =>{
      this.approvalContractService.updateStateContract(contactid,false).subscribe(
        (data : Contract) =>{
          console.log(data);
          this.getContractsToList();
        }
      )
    })
  }


}
