import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Vehicle } from 'src/app/Models/Vehicle';
import { VehicleService } from 'src/app/Services/vehicle.service';


@Component({
  selector: 'app-input-search-vehicle',
  templateUrl: './input-search-vehicle.component.html',
  styleUrls: ['./input-search-vehicle.component.scss','../../../assets/styles/searchList.scss']
})
export class InputSearchVehicleComponent implements OnInit {
  frmSearchVehicle: FormGroup;
  listIsvisible:boolean;
  description = new Subject<string>();
  lsVehicles: Vehicle[];
  lsVehicleSuggestion$: Observable<Vehicle[]>;
  @Output() vehicleWasSetted = new EventEmitter<boolean>();

  constructor(
    private vehicleService:VehicleService,
   
  ) { 
    this.frmSearchVehicle = new FormGroup({
      txtLicensePlate : new FormControl('')
    })
  }

  ngOnInit(): void {
    this.initComponents();    
  }

  async initComponents(){
    this.listIsvisible = false;
    this.searchVehicles();
  }

  searchVehicles(){
    this.lsVehicleSuggestion$ = this.description.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((desc:string) => this.vehicleService.getVehiclesByLicensePlate(desc))
    )
  }

  setVehicle(oVehicle:Vehicle){
    let {txtLicensePlate} = this.frmSearchVehicle.controls;
    txtLicensePlate.setValue(oVehicle.licensePlate);    
    this.listIsvisible = false;
    this.vehicleService.setVehicle(oVehicle);
    this.vehicleWasSetted.emit(true);
  }  

  

  searchBydescription(description:string){
    this.listIsvisible = true;
    this.description.next(description);
  }
}
