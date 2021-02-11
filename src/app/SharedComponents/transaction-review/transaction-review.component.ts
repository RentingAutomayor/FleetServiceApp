import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Transaction } from 'src/app/Models/Transaction';
import { TransactionService } from '../Services/Transaction/transaction.service';
import { SharedFunction } from 'src/app/Models/SharedFunctions';
import { SecurityValidators } from 'src/app/Models/SecurityValidators';
import { Company } from 'src/app/Models/Company';
import { CompanyType } from 'src/app/Models/CompanyType';
import { Movement, Movements } from 'src/app/Models/Movement';

@Component({
  selector: 'app-transaction-review',
  templateUrl: './transaction-review.component.html',
  styleUrls: ['./transaction-review.component.scss']
})
export class TransactionReviewComponent implements OnInit {

  frmTransaction: FormGroup;
  transaction: Transaction;
  sharedFunction:SharedFunction;
  companyStorage:Company;
  infoClientIsVisible: boolean;
  infoVehicleIsVisible:boolean;
  infoWorkOrderIsVisible:boolean;
  infoTransactionIsVisible: boolean;
  infoObservationsIsVisible: boolean;
  @Input() trx_id:number;

  
  constructor(
    private transactionService:TransactionService
  ) { 
    this.infoClientIsVisible = false;
    this.infoVehicleIsVisible = false;
    this.infoWorkOrderIsVisible = false;
    this.infoTransactionIsVisible = false;
    this.infoObservationsIsVisible = false;
    this.trx_id = 0;
    this.transaction = new Transaction();
    this.sharedFunction = new SharedFunction();
    this.frmTransaction = new FormGroup({
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
      trx_valueWithoutTaxes: new FormControl(''),
      trx_valueTaxes: new FormControl(''),
      trx_valueWithTaxes: new FormControl(''),
      trx_valueWithoutDiscount: new FormControl(''),
      trx_valueDiscount: new FormControl(''),
      trx_valueWithDiscountWithoutTaxes: new FormControl('')

    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    for(let change in changes){
      switch(change){
        case "trx_id":
          this.validateCompany();
          this.clearBufferTransaction();
          this.getTransactionById(this.trx_id);
          break;
      }
    }
  }

  validateCompany(){
    try {
      this.companyStorage = SecurityValidators.validateUserAndCompany();
      console.log("[validateCompany]");
      console.log(this.companyStorage.type);
      if(this.companyStorage.type == CompanyType.DEALER || this.companyStorage.type == CompanyType.MAIN_COMPANY){
        this.infoClientIsVisible = true;
      }else{
        this.infoClientIsVisible = false;
      }
    } catch (error) {
      console.warn(error);
    }    
  }

  ngOnInit(): void {
    this.validateCompany();
    this.getTransactionById(this.trx_id);
    
    
  }

  async getTransactionById(trx_id: number){
    try {
      this.transactionService.getTransactionById(trx_id)
      .then(trx => {
        this.transaction = trx;
        this.setDataInForm(this.transaction);
        this.validateRenderComponent(this.transaction.movement);
        console.log(this.transaction);
      }).catch((error)=>{
        console.log(error);
      })
    } catch (error) {
      console.warn(error);
    }
  }

  validateRenderComponent(movement: Movement){
    try {
      switch(movement.id){
        case Movements.CREACION_DE_CUPO:
        case Movements.APROBACION_DE_ORDEN_DE_TRABAJO:
        case Movements.CANCELACION_DE_ORDEN_DE_TRABAJO:
        case Movements.CANCELACION_DE_CUPO:
        case Movements.LIBERACION_DE_CUPO:        
          this.infoClientIsVisible = true;
          this.infoVehicleIsVisible = false;
          this.infoWorkOrderIsVisible = false;
          this.infoTransactionIsVisible = true;
          this.infoObservationsIsVisible = true;
          break;
        case Movements.ORDEN_DE_TRABAJO:
          this.validateCompany();
          this.infoVehicleIsVisible = true;
          this.infoWorkOrderIsVisible = true;
          this.infoTransactionIsVisible = true;
          this.infoObservationsIsVisible = true;
          break;
      }
    } catch (error) {
      console.warn(error);
    }
  }

  setDataInForm(transaction:Transaction){
    let { client_document, client_name, 
      contract_code,vehicle_licensePlate,
      vehicle_year, vehicle_mileage ,vehicle_brand,
      vehicle_type, vehicle_model,dealer_name,
      dealer_branch, maintenance_routine, trx_valueWithoutTaxes,trx_valueTaxes,
      trx_valueWithTaxes,trx_valueWithoutDiscount,trx_valueDiscount, trx_valueWithDiscountWithoutTaxes

    } = this.frmTransaction.controls;

    client_document.setValue(transaction.client.document);
    client_name.setValue(transaction.client.name.toUpperCase());
    

    if(transaction.headerDetails != null){
      contract_code.setValue((transaction.headerDetails.contract!=null)?transaction.headerDetails.contract.code:'');

      if(transaction.headerDetails.vehicle != null){
        let licensePlate = (transaction.headerDetails.vehicle!=null)?transaction.headerDetails.vehicle.licensePlate:'';
        vehicle_licensePlate.setValue(licensePlate);
        let year = (transaction.headerDetails.vehicle!=null)?transaction.headerDetails.vehicle.year:'';
        vehicle_year.setValue(year);
        let mileage = (transaction.headerDetails.vehicle.mileage!=null)?transaction.headerDetails.vehicle.mileage:0;
        vehicle_mileage.setValue(this.sharedFunction.formatNumberToString(mileage));
        
        if(transaction.headerDetails.vehicle.vehicleModel!=null){
          let brand = (transaction.headerDetails.vehicle.vehicleModel.brand.name!=null)?transaction.headerDetails.vehicle.vehicleModel.brand.name:'';
          vehicle_brand.setValue(brand.toUpperCase());
          let type = (transaction.headerDetails.vehicle.vehicleModel.type.name != null)? transaction.headerDetails.vehicle.vehicleModel.type.name:'';
          vehicle_type.setValue(type.toUpperCase());
          let model = (transaction.headerDetails.vehicle.vehicleModel.shortName != null) ? transaction.headerDetails.vehicle.vehicleModel.shortName: '';
          vehicle_model.setValue(model.toUpperCase());
        }       
      }

      if(transaction.headerDetails.dealer.name != null){
        dealer_name.setValue(transaction.headerDetails.dealer.name.toUpperCase());
      }

      if(transaction.headerDetails.branch.name != null){
        dealer_branch.setValue(transaction.headerDetails.branch.name.toUpperCase());
      }

      if(transaction.headerDetails.maintenanceRoutine.name != null){
        maintenance_routine.setValue(transaction.headerDetails.maintenanceRoutine.name.toUpperCase());
      }
    }      
    
    trx_valueWithoutDiscount.setValue(this.sharedFunction.formatNumberToString((transaction.valueWithoutDiscount!=null)?transaction.valueWithoutDiscount:0));
    trx_valueDiscount.setValue(this.sharedFunction.formatNumberToString((transaction.discountValue!=null)?transaction.discountValue:0));
    trx_valueWithDiscountWithoutTaxes.setValue(this.sharedFunction.formatNumberToString((transaction.valueWithDiscountWithoutTaxes!=null)?transaction.valueWithDiscountWithoutTaxes:0));
    trx_valueTaxes.setValue(this.sharedFunction.formatNumberToString((transaction.taxesValue!=null)?transaction.taxesValue:0));
    trx_valueWithTaxes.setValue(this.sharedFunction.formatNumberToString((transaction.value!=null)?transaction.value:0));
  }

  clearBufferTransaction(){
    this.frmTransaction.reset();
  }

}
