import { Component, OnInit } from '@angular/core';
import { SecurityValidators } from 'src/app/Models/SecurityValidators';
import { Company } from 'src/app/Models/Company';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', '../../../../../assets/styles/app.scss']
})
export class HomeComponent implements OnInit {
  company:Company;
  frmFilter: FormGroup;
  dtStartingDate: Date;
  dtEndingDate: Date;
  btnSearchIsDisabled: boolean;
  datesAreInvalid: boolean;
  filterInitDate:Date;
  filterEndDate:Date;


  isAwaiting: boolean;
  constructor(
    private formBuilder: FormBuilder
  ) {
    let now = new Date();
    this.dtStartingDate = now;
    this.dtEndingDate = now;
    this.buildFormFilter();
    this.btnSearchIsDisabled = false
    this.datesAreInvalid = false

  }

  get startingDateField() {
    return this.frmFilter.get('startingDate');
  }

  get endingDateField() {
    return this.frmFilter.get('endingDate');
  }

  ngOnInit(): void {
    this.company = this.validateCompany()

  }

  buildFormFilter(): void {
    this.frmFilter = this.formBuilder.group({
      startingDate: [, [Validators.required]],
      endingDate: [, [Validators.required]]
    })
  }

  validateCompany(): Company {
    return SecurityValidators.validateUserAndCompany();
  }

  validateInputDate(event: any) {
    event.preventDefault();
    return null;
  }

  validateInitDate(initDate:any): void {
    this.dtStartingDate = initDate.toISOString()
    this.validateDates( this.dtStartingDate,this.dtEndingDate)
    const initDateIsValid = this.validateDates(this.dtStartingDate,this.dtEndingDate)
    if(!initDateIsValid){
      this.datesAreInvalid = true;
      this.btnSearchIsDisabled = true;
    }else{
      this.datesAreInvalid = false;
      this.btnSearchIsDisabled = false;
    }
  }

  validateEndDate(endDate:any): void {
    this.dtEndingDate = endDate.toISOString()
    const endDateIsValid = this.validateDates(this.dtStartingDate, this.dtEndingDate)
    if(!endDateIsValid){
      this.datesAreInvalid = true;
      this.btnSearchIsDisabled = true;
    }else{
      this.datesAreInvalid = false;
      this.btnSearchIsDisabled = false;
    }
  }

  validateDates(initDate, endDate): boolean{
    console.log(`${initDate} - ${endDate}`)
    if(initDate > endDate){
      return false;
    }else{
      return true;
    }
  }

  filterData(){
    this.filterInitDate = this.dtStartingDate;
    this.filterEndDate = this.dtEndingDate;
  }










}
