import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ContractState } from 'src/app/Models/ContractState';
import { ContractService } from '../../Services/contract.service';


@Component({
  selector: 'app-contract-state',
  templateUrl: './contract-state.component.html',
  styleUrls: ['./contract-state.component.scss']
})
export class ContractStateComponent implements OnInit {
  frmContractState: FormGroup;
  lsStates: ContractState[];
  
  constructor(
    private contractService: ContractService
  ) { 
    this.frmContractState = new FormGroup({
      cmbStates: new FormControl('Seleccione ...')
    });
  }

  ngOnInit(): void {
    this.initComponents();
  }

  async initComponents(){
    try{
      this.lsStates = await this.contractService.getContractStates();
    }catch(error){
      console.error(error);
    }
  }

  setContractState(event:any){
    let oStateTemp = this.lsStates.find(st => st.id = event.value);
    this.contractService.setContractStateSelected(oStateTemp);
  }

}
