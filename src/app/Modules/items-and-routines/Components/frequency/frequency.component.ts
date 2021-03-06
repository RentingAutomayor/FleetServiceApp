import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup,FormControl } from '@angular/forms';
import { Frequency } from 'src/app/Models/Frequency';
import { MaintenanceRoutineService } from '../../Services/MaintenanceRoutine/maintenance-routine.service';


@Component({
  selector: 'app-frequency',
  templateUrl: './frequency.component.html',
  styleUrls: ['./frequency.component.scss','../../../../../assets/styles/app.scss']
})
export class FrequencyComponent implements OnInit, OnChanges {
  frmFrequency:FormGroup;
  lsFrequency:Frequency[];
  @Input() countChanges: number;
  frequencytoUpdate:Frequency;
  @Output() frequencyWasSelected = new EventEmitter<Frequency>();

  constructor(
    private maintenanceRoutineService: MaintenanceRoutineService
  ) { 
    this.frmFrequency = new FormGroup({
      cmbFrequency: new FormControl('Seleccione ...')
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    for(let change in changes){
      if(change == "countChanges"){
        this.frequencytoUpdate = this.maintenanceRoutineService.getFrecuencySelected();
        if(this.frequencytoUpdate  != null){
          this.setDataInForm(this.frequencytoUpdate );
        }else{
          this.clearForm();
        }
      }
    }
  }

  ngOnInit(): void {
    this.initComponents();
  }

  async initComponents(){
    this.countChanges = 0;
    this.lsFrequency = await this.maintenanceRoutineService.getFrequency();
  }

  setFrequency(event:any){
    let oFrequency = this.lsFrequency.find(fq => fq.id == event.value) 
    this.maintenanceRoutineService.setFrecuencySelected(oFrequency);
    this.frequencyWasSelected.emit(oFrequency);
  }

  setDataInForm(pFrequency:Frequency){
    this.frmFrequency.controls.cmbFrequency.setValue(pFrequency.id);
  }

  clearForm(){
    let {cmbFrequency} = this.frmFrequency.controls;
    cmbFrequency.setValue(0);
  }

}
