import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Department } from 'src/app/Models/Department';
import { City } from '../../Models/City';
import { CityService } from '../Services/City/city.service';


@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent implements OnInit {

  city: City;
  @Input('city')
  set setCity(city: City) {
    this.city = city;
    if (this.city){
      this.searchCitiesByDepartmentId(this.city.departmentId);
      this.setDataInForm(this.city);
    }else{
      this.clearDateForm();
    }

  }

  blockFieldCity: boolean;
  @Input('blockFieldCity')
  set setBlockFieldCity(value: boolean) {
    this.blockFieldCity = value;
    if (this.blockFieldCity) {
      this.frmCity.disable();
    } else {
      this.frmCity.enable();
    }
  }
  frmCity: FormGroup;
  lsDepartment: Department[];
  lsCities: City[];

  constructor(
    private cityService: CityService
  ) {
    this.frmCity = new FormGroup({
      cmbDepartment: new FormControl('Seleccione ...'),
      cmbCity: new FormControl('Seleccione ...')
    });

    this.blockFieldCity = false;
  }

  ngOnInit(): void {
    this.initComponents();
  }

  initComponents() {
    this.getDepartmentsList();
  }

  getDepartmentsList(){
    this.cityService.getDepartments().then(departments => {
      this.lsDepartment = departments;
    });
  }

  searchCitiesByDepartmentId(departmentID: number) {
    const department_id = departmentID;
    this.cityService.getCitiesByDepartmentId(department_id)
      .then(cities => {
        this.lsCities = cities;
      });
  }

  setSelectedCity(obj: any) {
    const selectedCity = this.lsCities.find(cty => cty.id == obj.value);
    this.cityService.setSelectedCity(selectedCity);
  }

  setDataInForm(pCity: City) {
    if (pCity) {
      this.frmCity.controls.cmbDepartment.setValue(pCity.departmentId);
      this.frmCity.controls.cmbCity.setValue(pCity.id);
    } else {
      this.frmCity.controls.cmbDepartment.setValue(0);
      this.frmCity.controls.cmbCity.setValue(0);
    }
  }

  clearDateForm():void{
    this.frmCity.controls.cmbDepartment.setValue(0);
    this.frmCity.controls.cmbCity.setValue(0);
  }



}
