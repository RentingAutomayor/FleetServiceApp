import { Component, EventEmitter, Input, OnInit, Output , OnChanges, SimpleChange, SimpleChanges} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Vehicle } from 'src/app/Models/Vehicle';
import { VehicleModel } from 'src/app/Models/VehicleModel';
import { VehicleService } from '../../Services/Vehicle/vehicle.service';
import { InputValidator } from 'src/app/Utils/InputValidator';
import { SharedFunction } from 'src/app/Models/SharedFunctions' ;

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent implements OnInit, OnChanges {
  frmVehicle: FormGroup;
  error: string;
  formHasError: boolean;
  vehicleToUpdate: Vehicle;
  @Output() vehicleWasSaved = new  EventEmitter<boolean>();
  @Output() vehicleWasCancel = new  EventEmitter<boolean>();
  @Input() countVehicle: number;
  oCountChanges: number;
  sharedFunction: SharedFunction;

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


  ngOnChanges(changes: SimpleChanges): void {
    for (const change in changes) {
      try {
        if (change == 'countVehicle') {
          this.cleanFormData();
          this.vehicleToUpdate = this.vehicleService.getVehicleToUpdate();
          if (this.vehicleToUpdate != null){
            this.setDataInForm(this.vehicleToUpdate);
          } else{
            this.cleanFormData();
          }
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

  initComponents(){
    this.formHasError = false;
    this.error = '';
    this.countVehicle = 0;
    this.oCountChanges = 0;

  }

  saveVehicle(){
    const oVehicle = this.setDataVehicle();
    this.saveData(oVehicle);
  }

  setDataVehicle(): Vehicle{
    const oVehicle = new Vehicle();
    if (this.vehicleToUpdate != null){
      oVehicle.id = this.vehicleToUpdate.id;
    }

    let partialVehicle: Partial<Vehicle>;
    partialVehicle = this.frmVehicle.value;

    oVehicle.licensePlate = partialVehicle.licensePlate.toUpperCase();
    oVehicle.chasisCode = partialVehicle.chasisCode;
    oVehicle.year = partialVehicle.year;
    oVehicle.mileage = partialVehicle.mileage;

    oVehicle.vehicleState = this.vehicleService.getVehicleStateSelected();
    oVehicle.vehicleModel = this.vehicleService.getVehicleModelSelected();
    return oVehicle;
  }

  async saveData(pVehicle: Vehicle){
    this.vehicleService.setVehicle(pVehicle);
    this.vehicleWasSaved.emit(true);
  }

  setDataInForm(pVehicle: Vehicle){
    this.frmVehicle.patchValue(pVehicle);
    this.vehicleService.setBrandSelected(pVehicle.vehicleModel.brand);
    this.vehicleService.setVehicleTypeSelected(pVehicle.vehicleModel.type);
    this.vehicleService.setVehicleModelSelected(pVehicle.vehicleModel);
    this.vehicleService.setVehicleStateSelected(pVehicle.vehicleState);
    this.oCountChanges += 1 ;
  }

  cleanFormData(){
    this.frmVehicle.reset();
    this.vehicleService.setBrandSelected(null);
    this.vehicleService.setVehicleTypeSelected(null);
    this.vehicleService.setVehicleModelSelected(null);
    this.vehicleService.setVehicleStateSelected(null);
    this.oCountChanges += 1 ;
  }

  setBrand(){
    this.oCountChanges += 1;
  }

  setVehiclType(){
    this.oCountChanges += 1;
  }
  comeBack(){
    this.vehicleWasCancel.emit(true);
  }

  valitateTyping(event: any, type: string){
    InputValidator.validateTyping(event, type);
  }

}
