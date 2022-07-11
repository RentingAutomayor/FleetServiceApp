import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Contract } from "src/app/Models/Contract";

@Component({
    selector: 'dialog-approvalcontract',
    templateUrl: 'dialog-approvalcontract.html',
    styleUrls: ['./dialog-approvalcontract.scss']
  })
export class DialogApprovalContract {
  
  constructor(
    public dialogRef: MatDialogRef<DialogApprovalContract>,
    @Inject(MAT_DIALOG_DATA) public data: Contract,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}