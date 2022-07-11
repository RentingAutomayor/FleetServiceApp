import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApprovalcontractComponent } from './approvalcontract/approvalcontract.component';
import { ApprovalContractRoutingModule } from './approvalcontract-routing.module';
import {MatCardModule} from '@angular/material/card';
import {MatProgressBarModule } from '@angular/material/progress-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { DialogApprovalContract } from './dialog-approvalcontract/dialog-approvalcontract';
import {MatFormFieldModule} from '@angular/material/form-field';
@NgModule({
  declarations: [
    ApprovalcontractComponent,
    DialogApprovalContract
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    ApprovalContractRoutingModule,
    MatProgressBarModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule

  ]
})
export class ApprovalcontractModule { }
