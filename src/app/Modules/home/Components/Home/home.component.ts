import { Component, OnInit } from '@angular/core';
import { forEach } from 'lodash';
import { SecurityValidators } from 'src/app/Models/SecurityValidators';
import { Company } from 'src/app/Models/Company';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', '../../../../../assets/styles/app.scss']
})
export class HomeComponent implements OnInit {
  company:Company;

  isAwaiting: boolean;  
  constructor(

  ) { }

  ngOnInit(): void {  
    this.company = this.validateCompany()
  }

  validateCompany(): Company {
    return SecurityValidators.validateUserAndCompany();
  }


  

  

  



}
