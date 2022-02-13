import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Contract } from 'src/app/Models/Contract';
import { ConstractStates, ContractState } from 'src/app/Models/ContractState';
import { ContractService } from '../../Services/Contract/contract.service';


@Component({
  selector: 'app-contract-state',
  templateUrl: './contract-state.component.html',
  styleUrls: ['./contract-state.component.scss']
})
export class ContractStateComponent implements OnInit, OnChanges {
  frmContractState: FormGroup;
  lsStates: ContractState[];
  contractStateSelected: ContractState;
  @Input() countChanges: number;
  @Output() contractStateWasSelected = new EventEmitter<ContractState>();
  @Input() cmbStateIsDisable: boolean;

  constructor(
    private contractService: ContractService
  ) {
    this.frmContractState = new FormGroup({
      cmbStates: new FormControl('Seleccione ...')
    });

    this.cmbStateIsDisable = false;
  }

  ngOnChanges(changes: SimpleChanges){
    for (const change in changes) {
      if (change == 'countChanges') {
        this.contractStateSelected = this.contractService.getContractStateSelected();
        if (this.contractStateSelected != null && this.contractStateSelected != undefined){
          this.setDataInForm(this.contractStateSelected);
          this.contractStateWasSelected.emit(this.contractStateSelected);
        }
      }
    }

    if (this.cmbStateIsDisable){
      this.frmContractState.disable();
    }else{
      this.frmContractState.enable();
    }

  }

  ngOnInit(): void {
    this.initComponents();
  }

  async initComponents(){
    try{
      this.countChanges = 0;
      this.lsStates = await this.contractService.getContractStates();
    }catch (error){
      console.error(error);
    }
  }

  setContractState(event: any){
    const valueOption = event.value;
    const oStateTemp = this.lsStates.find(st => st.id == valueOption);
    this.contractStateSelected = oStateTemp;
    this.contractService.setContractStateSelected(oStateTemp);
    this.contractStateWasSelected.emit(this.contractStateSelected);
  }

  setDataInForm(state: ContractState){
    const { cmbStates } = this.frmContractState.controls;
    this.contractStateSelected = state;
    cmbStates.setValue(state.id);
  }

  loseFocus(){
    this.contractStateWasSelected.emit(this.contractStateSelected);
  }




}
