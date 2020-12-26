import { Component, Input, OnInit , OnChanges, SimpleChanges, Output, EventEmitter} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MaintenanceRoutine } from 'src/app/Models/MaintenanceRoutine';
import { Vehicle } from 'src/app/Models/Vehicle';
import { VehicleModel } from 'src/app/Models/VehicleModel';
import { MaintenanceRoutineService } from '../../Services/maintenance-routine.service';

@Component({
  selector: 'app-routines-by-vehicle-model',
  templateUrl: './routines-by-vehicle-model.component.html',
  styleUrls: ['./routines-by-vehicle-model.component.scss']
})
export class RoutinesByVehicleModelComponent implements OnInit,OnChanges {
  frmRoutineByVehicleModel: FormGroup;
  lsRoutine:MaintenanceRoutine[];  
  maintenanceRoutineSelected: MaintenanceRoutine;
  @Input() vehicleModel: VehicleModel;
  @Input() countChanges:Number;
  @Output() routineWasSetted = new EventEmitter<boolean>();

  constructor(
    private maintenanceRoutineService:MaintenanceRoutineService
  ) {
    this.frmRoutineByVehicleModel = new FormGroup({
      cmbRoutineByVehicleModel: new FormControl('Seleccione')
    })
   }

  ngOnChanges(changes: SimpleChanges): void {
    for(let change in changes){
      console.log("vehicleModel change");
      console.log(this.vehicleModel);
      if(change == "vehicleModel"){
        this.getListMaintenanceRoutines(this.vehicleModel.id);
      }
    }
  }

  ngOnInit(): void {
    this.initComponents();
  }

  initComponents(){
    this.getListMaintenanceRoutines(this.vehicleModel.id);
  }

  async getListMaintenanceRoutines(model_id:number){
    try{
      this.maintenanceRoutineService.getMaintenanceRoutineByModel(model_id).then(data =>{
        this.lsRoutine = data;
        console.log(this.lsRoutine);
      });
    }catch(error){
      console.warn(error);
    }
  }

  setRoutine(event:any){
    let oRoutine = this.lsRoutine.find(rt => rt.id == event.value);
    this.maintenanceRoutineService.setRoutine(oRoutine);
    this.routineWasSetted.emit(true);
  }

}
