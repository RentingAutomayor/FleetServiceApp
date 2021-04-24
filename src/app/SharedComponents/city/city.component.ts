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
export class CityComponent implements OnInit, OnChanges {
  @Input() city: City;
  @Input() countChanges: number;
  frmCity: FormGroup;
  lsDepartment: Department[];
  lsCities: City[];

  @Input() blockFieldCity:boolean;


  constructor(
    private cityService: CityService
  ) {
    this.frmCity = new FormGroup({
      cmbDepartment: new FormControl('Seleccione ...'),
      cmbCity: new FormControl('Seleccione ...')
    })

    this.blockFieldCity = false;
  }


  ngOnChanges(changes: SimpleChanges): void {
    for (let change in changes) {
      try {        
        //console.log("[Cambios componente ciudad]");
        //console.log(changes);
        this.city = this.cityService.getSelectedCity();
        //console.log("[ciudad]:",this.city);
        if (this.city != null) {
          this.searchCities(this.city.departmentId);
          this.setDataInForm(this.city);
          this.cityService.setSelectedCity(this.city);
        } else {
          this.frmCity.controls.cmbDepartment.setValue(0);
          this.frmCity.controls.cmbCity.setValue(0);
        }

      } catch (err) {
        console.error(err);
        continue;
      }
    }
  }

  ngOnInit(): void {
    this.initComponents();
  }

  async initComponents() {
    this.countChanges = 0;
    this.lsDepartment = await this.cityService.getDepartments();

    if (this.city != null) {
      this.lsCities = await this.cityService.getCitiesByDepartmentId(this.city.departmentId);
      this.setDataInForm(this.city);
      this.cityService.setSelectedCity(this.city);
    } else {
      this.frmCity.controls.cmbDepartment.setValue(0);
      this.frmCity.controls.cmbCity.setValue(0);
    }

    this.validateBlockFields();

  }

  validateBlockFields(){
    try {
      if(this.blockFieldCity){
        this.frmCity.disable();
      }else{
        this.frmCity.enable();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async searchCities(pDepartment_id: number) {
    this.lsCities = await this.cityService.getCitiesByDepartmentId(pDepartment_id);
  }
  async searchCitiesByDepartmentID(obj: any) {
    let department_id = obj.value;
    this.searchCities(department_id);
  }

  setSelectedCity(obj: any) {
    let selectedCity = this.lsCities.find(cty => cty.id == obj.value);
    this.cityService.setSelectedCity(selectedCity);
  }

  async setDataInForm(pCity: City) {
    this.frmCity.controls.cmbDepartment.setValue(pCity.departmentId);
    this.frmCity.controls.cmbCity.setValue(pCity.id);
  }

}
