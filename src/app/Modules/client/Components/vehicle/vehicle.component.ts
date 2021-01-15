import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, EventEmitter, Input, OnInit, Output , OnChanges, SimpleChange, SimpleChanges} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Vehicle } from 'src/app/Models/Vehicle';
import { VehicleModel } from 'src/app/Models/VehicleModel';
import { VehicleService } from '../../Services/Vehicle/vehicle.service';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent implements OnInit, OnChanges {
  frmVehicle:FormGroup;
  error:string;
  formHasError:boolean;
  vehicleToUpdate:Vehicle;
  @Output() vehicleWasSaved = new  EventEmitter<boolean>();
  @Output() vehicleWasCancel = new  EventEmitter<boolean>();
  @Input() countVehicle: number;  
  oCountChanges:number;
  

  constructor(
    private vehicleService: VehicleService
  ) { 
    this.frmVehicle = new FormGroup({
      txtLicensePlate : new FormControl(''),
      txtChasisCode: new FormControl(''),
      txtYear: new FormControl(''),
      txtMileage: new FormControl('')
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    for (let change in changes) {
      try {
        //console.log(changes);
        if (change == "countVehicle") {
          this.cleanFormData();
          this.vehicleToUpdate = this.vehicleService.getVehicleToUpdate();
          if(this.vehicleToUpdate != null){
            this.setDataInForm(this.vehicleToUpdate);
            console.log(this.vehicleToUpdate);
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
    this.error='';
    this.countVehicle = 0;
    this.oCountChanges = 0;

  }

  saveVehicle(){
    let oVehicle = this.setDataVehicle();
    this.saveData(oVehicle);
  }

  setDataVehicle():Vehicle{
    let oVehicle = new Vehicle();
    if(this.vehicleToUpdate != null){
      oVehicle.id = this.vehicleToUpdate.id;
    }
    oVehicle.licensePlate = this.frmVehicle.controls.txtLicensePlate.value;
    oVehicle.chasisCode = this.frmVehicle.controls.txtChasisCode.value;
    oVehicle.vehicleState = this.vehicleService.getVehicleStateSelected();
    oVehicle.vehicleModel = this.vehicleService.getVehicleModelSelected();
    oVehicle.year = this.frmVehicle.controls.txtYear.value;
    oVehicle.mileage = this.frmVehicle.controls.txtMileage.value;
    return oVehicle;
  }

  async saveData(pVehicle:Vehicle){
    this.vehicleService.setVehicle(pVehicle);
    console.log('[vehículo a guardar]: ', pVehicle);
    this.vehicleWasSaved.emit(true);
  }

  setDataInForm(pVehicle:Vehicle){
    this.frmVehicle.controls.txtLicensePlate.setValue(pVehicle.licensePlate);
    this.frmVehicle.controls.txtChasisCode.setValue(pVehicle.chasisCode);
    this.frmVehicle.controls.txtYear.setValue(pVehicle.year);
    this.frmVehicle.controls.txtMileage.setValue(pVehicle.mileage); 
    this.vehicleService.setBrandSelected(pVehicle.vehicleModel.brand); 
    this.vehicleService.setVehicleTypeSelected(pVehicle.vehicleModel.type);
    this.vehicleService.setVehicleModelSelected(pVehicle.vehicleModel);
    this.vehicleService.setVehicleStateSelected(pVehicle.vehicleState);
    this.oCountChanges += 1 ;
  }

  cleanFormData(){
    this.frmVehicle.controls.txtLicensePlate.setValue('');
    this.frmVehicle.controls.txtChasisCode.setValue('');
    this.frmVehicle.controls.txtYear.setValue('');
    this.frmVehicle.controls.txtMileage.setValue(''); 
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

}
