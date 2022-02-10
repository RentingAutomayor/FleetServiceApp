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

  @Input() countChanges: number;
  blockFieldCity: boolean;

  city: City;
  @Input('city')
  set setCity(city: City) {
    if(city){
      this.city = city
      this.searchCitiesByDepartmentId(this.city.departmentId)
    }
    this.setDataInForm(this.city);
  }

  @Input('blockFieldCity')
  set setBlockFieldCity(value: boolean) {
    this.blockFieldCity = value;
    if (this.blockFieldCity) {
      this.frmCity.disable()
    } else {
      this.frmCity.enable()
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
    })

    this.blockFieldCity = false;
  }


  // ngOnChanges(changes: SimpleChanges): void {
  //   for (let change in changes) {
  //     try {

  //       //this.city = this.cityService.getSelectedCity();

  //       // if (this.city != null) {
  //       //   this.searchCities(this.city.departmentId);
  //       //   this.cityService.setSelectedCity(this.city);
  //       // } else {

  //       // }

  //     } catch (err) {
  //       console.error(err);
  //       continue;
  //     }
  //   }
  // }

  ngOnInit(): void {
    this.initComponents();
  }

  initComponents() {
    this.countChanges = 0;
    this.getDepartmentsList();
  }

  getDepartmentsList(){
    this.cityService.getDepartments().then(departments => {
      this.lsDepartment = departments;
    });
  }

  searchCitiesByDepartmentId(departmentID: number) {
    let department_id = departmentID;
    this.cityService.getCitiesByDepartmentId(department_id)
      .then(cities => {
        this.lsCities = cities;
      });
  }

  setSelectedCity(obj: any) {
    let selectedCity = this.lsCities.find(cty => cty.id == obj.value);
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



}
