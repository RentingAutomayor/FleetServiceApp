import { Component, EventEmitter, Input, OnInit, Output , OnChanges, SimpleChange, SimpleChanges} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Vehicle } from 'src/app/Models/Vehicle';
import { VehicleModel } from 'src/app/Models/VehicleModel';
import { VehicleService } from '../../Services/Vehicle/vehicle.service';
import { InputValidator } from 'src/app/Utils/InputValidator';
import { SharedFunction } from 'src/app/Models/SharedFunctions' ;
import { VehicleState } from 'src/app/Models/VehicleState';
import { Brand } from 'src/app/Models/Brand';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent implements OnInit {
  frmVehicle: FormGroup;
  error: string;
  formHasError: boolean;

  oCountChanges: number;
  sharedFunction: SharedFunction;

  vehicle: Vehicle = null;
  idTemp: number = 0;
  @Input('vehicleSelected')
  set setVehicle(vehicle: Vehicle){
    this.vehicle = vehicle;
    this.setDataInForm(this.vehicle);
  }

  isFormBlocked: boolean = false;
  @Input('isFormBlocked')
  set setIsFormBlocked(value: boolean){
    this.isFormBlocked = value;
    this.enableOrDisableForm(this.isFormBlocked);
  }

  isToInsert: boolean;
  @Input('isToInsert')
  set setIsToInsert(value: boolean){
    this.isToInsert = value;
  }

  vehicleStateSelected: VehicleState = null;
  brandSelected: Brand = null;

  @Output() vehicleWasSaved = new  EventEmitter<Vehicle>();
  @Output() vehicleWasCancel = new  EventEmitter<boolean>();

  get licensePlateField(){
    return this.frmVehicle.get('licensePlate');
  }

  get chasisCodeField(){
    return this.frmVehicle.get('chasisCode');
  }

  get yearField(){
    return this.frmVehicle.get('year');
  }

  get mileageField(){
    return this.frmVehicle.get('mileage');
  }

  constructor(
    private vehicleService: VehicleService,
    private formBuilder: FormBuilder

  ) {
    this.buildFormVehicle();
    this.sharedFunction = new SharedFunction();
  }

  buildFormVehicle(){
    this.frmVehicle = this.formBuilder.group({
      licensePlate : ['', [Validators.required , Validators.minLength(6), Validators.maxLength(6)]],
      chasisCode: ['', [Validators.required , Validators.minLength(10), Validators.maxLength(17)]],
      year: [''],
      mileage: ['']
    });
  }

  ngOnInit(): void {
    this.initComponents();
  }

  enableOrDisableForm(isBlocked:boolean){
    if(isBlocked){
      this.frmVehicle.disable();
    }else{
      this.frmVehicle.enable();
    }
  }

  initComponents(){
    this.formHasError = false;
    this.error = '';

    this.oCountChanges = 0;

  }

  setVehicleState(state: VehicleState){
    this.vehicleStateSelected = state;
  }

  saveVehicle(){
    const oVehicle = this.setDataVehicle();
    if(this.isToInsert){
      oVehicle.id = this.idTemp;
      this.idTemp --;
    }else{
      oVehicle.id = this.vehicle.id;
    }
    this.saveData(oVehicle);
    this.cleanFormData();
  }

  setDataVehicle(): Vehicle{
    const oVehicle = new Vehicle();
    let partialVehicle: Partial<Vehicle>;
    partialVehicle = this.frmVehicle.value;
    oVehicle.licensePlate = partialVehicle.licensePlate.toUpperCase();
    oVehicle.chasisCode = partialVehicle.chasisCode;
    oVehicle.year = partialVehicle.year;
    oVehicle.mileage = partialVehicle.mileage;
    oVehicle.vehicleState = this.vehicleStateSelected ;
    oVehicle.vehicleModel = this.vehicleService.getVehicleModelSelected();
    return oVehicle;
  }

  saveData(pVehicle: Vehicle){
    this.vehicleWasSaved.emit(pVehicle);
  }

  setDataInForm(pVehicle: Vehicle){
    if(pVehicle){
      this.frmVehicle.patchValue(pVehicle);
      this.vehicleStateSelected = pVehicle.vehicleState;
      this.brandSelected = pVehicle.vehicleModel.brand;

      this.vehicleService.setVehicleTypeSelected(pVehicle.vehicleModel.type);
      this.vehicleService.setVehicleModelSelected(pVehicle.vehicleModel);
      this.oCountChanges += 1 ;
    }else{
      this.cleanFormData();

    }

  }

  cleanFormData(){
    this.frmVehicle.reset();
    this.vehicleStateSelected = null;
    this.brandSelected = null;

    this.vehicleService.setVehicleTypeSelected(null);
    this.vehicleService.setVehicleModelSelected(null);

    this.oCountChanges += 1 ;
  }

  setBrand(brand: Brand){
    this.brandSelected = brand;
  }

  setVehiclType(){
    this.oCountChanges += 1;
  }
  comeBack(){
    this.cleanFormData();
    this.vehicleWasCancel.emit(true);
  }

  valitateTyping(event: any, type: string){
    InputValidator.validateTyping(event, type);
  }

}
