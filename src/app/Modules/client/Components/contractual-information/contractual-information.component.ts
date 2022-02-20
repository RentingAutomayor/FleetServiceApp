import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { ContractualInformationDTO } from 'src/app/Models/ContractualInformation';
import { QuotaType } from 'src/app/Models/QuotaType';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-contractual-information',
  templateUrl: './contractual-information.component.html',
  styleUrls: ['./contractual-information.component.scss']
})
export class ContractualInformationComponent implements OnInit {
  frmContractualInformation: FormGroup;

  dtServiceInitDate: Date;
  dtServiceEndDate: Date;
  dtQuotaApprovalDate: Date;
  dtQuotaEndingDate: Date;
  quotaTypes: QuotaType[];

  contractualInformation: ContractualInformationDTO = null;
  @Input('contractualInformation')
  set setContractualInformation(info: ContractualInformationDTO){
    this.contractualInformation = info;
    this.setDataInForm(this.contractualInformation);
  }

  quotaApproved: number = 0;
  @Input('quotaApproved')
  set setQuotaApproved(value: number) {
    this.quotaApproved = (value)?value:0;
    const {quotaApproved} = this.frmContractualInformation.controls;
    quotaApproved.setValue(this.quotaApproved);
  }

  isFormBlocked: boolean = false;
  @Input('isFormBlocked')
  set setIsFormBlocked(value: boolean){
    this.isFormBlocked = value;
    this.enableOrDisableForm(this.isFormBlocked);
  }

  @Output()
  onContractualInformationWasSetted = new EventEmitter<ContractualInformationDTO>();

  @Output()
  onPrevStep = new EventEmitter<boolean>();

  get serviceInitDateField(){
    return this.frmContractualInformation.controls.serviceInitDate;
  }

  get serviceEndDateField(){
    return this.frmContractualInformation.controls.serviceEndDate;
  }

  get quotaApprovalDateField(){
    return this.frmContractualInformation.controls.quotaApprovalDate;
  }

  get quotaEndingDateField(){
    return this.frmContractualInformation.controls.quotaEndingDate;
  }

  get adminPercentageField(){
    return this.frmContractualInformation.controls.adminPercentage;
  }

  serviceInitDateTmp:Date = null;
  serviceEndDateTmp:Date = null;
  quotaApprovalDateTmp:Date = null;
  quotaEndingDateTmp:Date = null;

  constructor(
    private formBuilder: FormBuilder,
    public datepipe: DatePipe
  ) {
    this.frmContractualInformation = this.formBuilder.group({
      contractCode: [''],
      adminPercentage: [0, [Validators.min(0), Validators.max(100)]],
      serviceInitDate: [''],
      serviceEndDate:  [''],
      quotaApprovalDate:  [''],
      quotaEndingDate:  [''],
      quotaTypeId: [0],
      paymentAgreement:  [0],
      quotaApproved: [0]
    });

    this.dtServiceInitDate = null;
    this.dtServiceEndDate = null;
    this.dtQuotaApprovalDate = null;
    this.dtQuotaEndingDate = null;
    this.quotaTypes = [
      {
        id: 1,
        name: 'PROPIOS',
        description: 'Cupo aprobado con recursos propios',
        state: true,
        registrationDate: null,
        updateDate: null,
        deleteDate: null
      },
      {
        id: 2,
        name: 'ENTIDAD FINANCIERA',
        description: 'Cupo aprobado con entidad financiera',
        state: true,
        registrationDate: null,
        updateDate: null,
        deleteDate: null
      }
    ];
    this.contractualInformation = null;
    this.serviceInitDateTmp = null;
    this.serviceEndDateTmp = null;
    this.quotaApprovalDateTmp = null;
    this.quotaEndingDateTmp = null;
  }

  ngOnInit(): void {
    //do nothing
  }

  setDataContractualInformation(event: any): void{
    event.preventDefault();
    this.contractualInformation = this.frmContractualInformation.value;
    this.contractualInformation.quotaType = this.quotaTypes.find(qt => qt.id == this.contractualInformation.quotaTypeId);
    this.onContractualInformationWasSetted.emit(this.contractualInformation);
  }

  validateInputDate(event: any): void{
    event.preventDefault();
    return null;
  }

  setDataInForm(info: ContractualInformationDTO): void{
    if(info){
      this.frmContractualInformation.patchValue(info);
      this.frmContractualInformation.controls.quotaTypeId.setValue(info.quotaType.id);
      this.serviceInitDateTmp = info.serviceInitDate;
      this.serviceEndDateTmp = info.serviceEndDate;
      this.quotaApprovalDateTmp = info.quotaApprovalDate;
      this.quotaEndingDateTmp = info.quotaEndingDate;
      this.validateServicesDates();
      this.validateQuotaDates();
    }else{
      this.clearDataForm();
    }
  }

  clearDataForm(): void{
    this.frmContractualInformation.reset();
    this.frmContractualInformation.controls.quotaTypeId.setValue(0);
    this.contractualInformation = null;
    this.serviceInitDateTmp = null;
    this.serviceEndDateTmp = null;
    this.quotaApprovalDateTmp = null;
    this.quotaEndingDateTmp = null;
  }

  enableOrDisableForm(isFormBlocked: boolean): void{
    if(isFormBlocked){
      this.frmContractualInformation.disable();
    }else{
      this.frmContractualInformation.enable();
    }
  }

  prevStep(){
    this.onPrevStep.emit(true);
  }

  setServiceInitDate(initDate: Date){
    this.serviceInitDateTmp = initDate;
  }

  setServiceEndDate(endDate: Date){
    this.serviceEndDateTmp = endDate;

  }

  validateServicesDates(){
    this.validateServiceEndDate(this.serviceInitDateTmp, this.serviceEndDateTmp);
  }

  setQuotaApprovedDate(approvedDate: Date){
    this.quotaApprovalDateTmp = approvedDate;
  }

  setQuotaEndingDate(quotaEnDate: Date){
    this.quotaEndingDateTmp = quotaEnDate;
  }


  validateMinDate(minDate: Date, maxDate: Date ): boolean{
    const minDateFormat = this.datepipe.transform(minDate, 'yyyy/MM/dd');
    const maxDateFormat = this.datepipe.transform(maxDate, 'yyyy/MM/dd');

    const min = new Date(minDateFormat);
    const end = new Date(maxDateFormat);

    console.log(`${min} - ${end}`);

    if ( min > end){
      return true;
    }else{
      return false;
    }
  }


  validateMaxDate(minDate: Date, maxDate: Date ): boolean{
    const minDateFormat = this.datepipe.transform(minDate, 'yyyy/MM/dd');
    const maxDateFormat = this.datepipe.transform(maxDate, 'yyyy/MM/dd');

    const min = new Date(minDateFormat);
    const max = new Date(maxDateFormat);

    console.log(`${min} - ${max}`);

    if ( max < min){
      return true;
    }else{
      return false;
    }
  }

  validateServiceEndDate(initDate: Date, endDate: Date){
    try {
      const isInitDateGreater = this.validateMinDate(initDate, endDate);
      console.log(`isInitDateGrather ${isInitDateGreater}`);
      if(isInitDateGreater){
        this.serviceInitDateField.setErrors({'minDateIsGrather': true});
      }else{
        const isEndDateLessThanInit = this.validateMaxDate(initDate, endDate);
        if(isEndDateLessThanInit){
          this.serviceEndDateField.setErrors({ 'minDate' : true });
        }else{
          this.serviceInitDateField.setErrors(null);
          this.serviceEndDateField.setErrors(null);
        }
      }
    } catch (error) {
      console.warn(error)
    }

  }

  validateQuotaDates(){
    this.validateQuotaEndDate(this.quotaApprovalDateTmp, this.quotaEndingDateTmp);
  }

  validateQuotaEndDate(initDate:Date,endDate: Date){
    try {
      const isInitDateGreater = this.validateMinDate(initDate, endDate);
      console.log(`isInitDateGrather ${isInitDateGreater}`);
      if(isInitDateGreater){
        this.quotaApprovalDateField.setErrors({'minDateIsGrather': true});
      }else{
        const isEndDateLessThanInit = this.validateMaxDate(initDate, endDate);
        if(isEndDateLessThanInit){
          this.quotaEndingDateField.setErrors({ 'minDate' : true });
        }else{
          this.quotaApprovalDateField.setErrors(null);
          this.quotaEndingDateField.setErrors(null);
        }
      }
    } catch (error) {
      console.warn(error)
    }

  }
}
