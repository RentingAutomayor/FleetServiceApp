import { Component, Input, OnInit , OnChanges, SimpleChanges, Output, EventEmitter} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Branch } from 'src/app/Models/Branch';
import { Dealer } from 'src/app/Models/Dealer';
import { BranchService } from 'src/app/SharedComponents/Services/Branch/branch.service';

@Component({
  selector: 'app-branch-by-dealer',
  templateUrl: './branch-by-dealer.component.html',
  styleUrls: ['./branch-by-dealer.component.scss']
})
export class BranchByDealerComponent implements OnInit , OnChanges{
  lsBranch: Branch[];
  frmBranch: FormGroup;
  @Input() branchSelected: Branch;
  @Input() dealer: Dealer;
  @Output() branchWasSetted = new EventEmitter<boolean>();

  constructor(
    private branchService: BranchService
  ) {
    this.frmBranch = new FormGroup({
      cmbBranch: new FormControl('')
    });
   }

  ngOnChanges(changes: SimpleChanges): void {
    for (let  change in changes) {
      if(change == "dealer"){
        this.getListBranchByDealer(this.dealer.id);
      }
    }
  }

  ngOnInit(): void {
    this.initComponents();
  }

  initComponents(){
    this.getListBranchByDealer(this.dealer.id);
  } 

  async getListBranchByDealer(dealer_id:number){
    this.branchService.getBranchs(dealer_id, "DEALER").then(
      data => {
        this.lsBranch = data;
      }
    )
  }

  setBranch(event:any){
    let oBranch = this.lsBranch.find(br => br.id == event.value);
    this.branchService.setBranchSelected(oBranch);
    this.branchWasSetted.emit(true);
  }

}
