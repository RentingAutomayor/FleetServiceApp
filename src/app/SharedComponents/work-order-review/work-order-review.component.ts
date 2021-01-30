import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Transaction } from 'src/app/Models/Transaction';
import { TransactionService } from '../Services/Transaction/transaction.service';
import { SharedFunction } from 'src/app/Models/SharedFunctions';
import { SecurityValidators } from 'src/app/Models/SecurityValidators';
import { Company } from 'src/app/Models/Company';
import { CompanyType } from 'src/app/Models/CompanyType';


@Component({
  selector: 'app-work-order-review',
  templateUrl: './work-order-review.component.html',
  styleUrls: ['./work-order-review.component.scss']
})
export class WorkOrderReviewComponent implements OnInit, OnChanges {
  frmWorkOrder: FormGroup;
  workOrder: Transaction;
  sharedFunction:SharedFunction;
  companyStorage:Company;
  isDealer: boolean;
  @Input() workOrder_id:number;

  
  constructor(
    private transactionService:TransactionService
  ) { 
    this.isDealer = false;
    this.workOrder_id = 0;
    this.workOrder = new Transaction();
    this.sharedFunction = new SharedFunction();
    this.frmWorkOrder = new FormGroup({
      client_document: new FormControl(''),
      client_name: new FormControl(''),
      contract_code: new FormControl(''),
      vehicle_licensePlate: new FormControl(''),
      vehicle_year: new FormControl(''),
      vehicle_mileage: new FormControl(''),
      vehicle_brand: new FormControl(''),
      vehicle_type: new FormControl(''),
      vehicle_model: new FormControl(''),
      dealer_name: new FormControl(''),
      dealer_branch: new FormControl(''),
      maintenance_routine: new FormControl(''),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    for(let change in changes){
      switch(change){
        case "workOrder_id":
          this.getTransactionById(this.workOrder_id);
          break;
      }
    }
  }

  validateCompany(){
    try {
      this.companyStorage = SecurityValidators.validateUserAndCompany();
      console.log("[validateCompany]");
      console.log(this.companyStorage.type);
      if(this.companyStorage.type == CompanyType.DEALER){
        this.isDealer = true;
      }else{
        this.isDealer = false;
      }
    } catch (error) {
      console.warn(error);
    }    
  }

  ngOnInit(): void {
    this.validateCompany();
    this.getTransactionById(this.workOrder_id);
    
  }

  async getTransactionById(trx_id: number){
    try {
      this.transactionService.getTransactionById(trx_id)
      .then(trx => {
        this.workOrder = trx;
        this.setDataInForm(this.workOrder);
        console.log(this.workOrder);
      }).catch((error)=>{
        console.log(error);
      })
    } catch (error) {
      console.warn(error);
    }
  }

  setDataInForm(workOrder:Transaction){
    let { client_document, client_name, 
      contract_code,vehicle_licensePlate,
      vehicle_year, vehicle_mileage ,vehicle_brand,
      vehicle_type, vehicle_model,dealer_name,
      dealer_branch, maintenance_routine
    } = this.frmWorkOrder.controls;

    client_document.setValue(workOrder.client.document);
    client_name.setValue(workOrder.client.name.toUpperCase());
    contract_code.setValue(workOrder.headerDetails.contract.code);
    vehicle_licensePlate.setValue(workOrder.headerDetails.vehicle.licensePlate.toUpperCase());
    vehicle_year.setValue(workOrder.headerDetails.vehicle.year);
    vehicle_mileage.setValue(this.sharedFunction.formatNumberToString(workOrder.headerDetails.vehicle.mileage));
    vehicle_brand.setValue(workOrder.headerDetails.vehicle.vehicleModel.brand.name.toUpperCase());
    vehicle_type.setValue(workOrder.headerDetails.vehicle.vehicleModel.type.name.toUpperCase());
    vehicle_model.setValue(workOrder.headerDetails.vehicle.vehicleModel.shortName.toUpperCase());
    dealer_name.setValue(workOrder.headerDetails.dealer.name.toUpperCase());
    dealer_branch.setValue(workOrder.headerDetails.branch.name.toUpperCase());
    maintenance_routine.setValue(workOrder.headerDetails.maintenanceRoutine.name.toUpperCase());
  }

}
