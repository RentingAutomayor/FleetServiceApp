import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Contract } from 'src/app/Models/Contract';
import { ContractState } from 'src/app/Models/ContractState';
import { ContractService } from '../../Services/contract.service';


@Component({
  selector: 'app-contract-state',
  templateUrl: './contract-state.component.html',
  styleUrls: ['./contract-state.component.scss']
})
export class ContractStateComponent implements OnInit, OnChanges {
  frmContractState: FormGroup;
  lsStates: ContractState[];
  contractStateSelected: ContractState;
  @Input() countChanges:number;
  
  constructor(
    private contractService: ContractService
  ) { 
    this.frmContractState = new FormGroup({
      cmbStates: new FormControl('Seleccione ...')
    });
  }
  ngOnChanges(changes: SimpleChanges){
    for (let change in changes) {
      if (change == "countChanges") {       
        this.contractStateSelected = this.contractService.getContractStateSelected();
        if(this.contractStateSelected != null && this.contractStateSelected != undefined){
          this.setDataInForm(this.contractStateSelected);
        }
      }
    }
    
  }

  ngOnInit(): void {
    this.initComponents();
  }

  async initComponents(){
    try{
      this.countChanges = 0;
      this.lsStates = await this.contractService.getContractStates();
    }catch(error){
      console.error(error);
    }
  }

  setContractState(event:any){
    let oStateTemp = this.lsStates.find(st => st.id = event.value);
    this.contractService.setContractStateSelected(oStateTemp);
  }

  setDataInForm(state: ContractState){
    let { cmbStates } = this.frmContractState.controls;
    cmbStates.setValue(state.id);
  }

}
