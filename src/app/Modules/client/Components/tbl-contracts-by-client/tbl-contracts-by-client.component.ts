import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Contract } from 'src/app/Models/Contract';
import { ContractService } from 'src/app/Modules/contract/Services/Contract/contract.service';

@Component({
  selector: 'app-tbl-contracts-by-client',
  templateUrl: './tbl-contracts-by-client.component.html',
  styleUrls: ['./tbl-contracts-by-client.component.scss']
})
export class TblContractsByClientComponent implements OnInit, OnChanges {
  lsContracts: Contract[];
  isAwaiting: boolean;
  @Input() client_id: number;

  constructor(
    private contractService: ContractService
  ) {
    this.client_id = 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getContractList(this.client_id);
  }

  ngOnInit(): void {
    this.getContractList(this.client_id);
  }

  async getContractList(client_id: number){
    try {
      this.contractService.getContractByClientId(client_id).then(list => this.lsContracts = list);
    } catch (error) {
      console.warn(error);
    }
  }

}
