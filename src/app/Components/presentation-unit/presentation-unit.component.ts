import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { PresentationUnit } from 'src/app/Models/PresentationUnit';
import { MaintenanceItemService } from '../../Services/maintenance-item.service';

@Component({
  selector: 'app-presentation-unit',
  templateUrl: './presentation-unit.component.html',
  styleUrls: ['./presentation-unit.component.scss']
})
export class PresentationUnitComponent implements OnInit,OnChanges {
  lsPresentationUnit: PresentationUnit[];
  frmPresentationUnit: FormGroup;
  presentationUnitToUpdate: PresentationUnit
  @Input() countChanges: number;
  constructor(
    private maintenanceItemService: MaintenanceItemService
  ) { 
    this.frmPresentationUnit = new FormGroup({
      cmbPresentationUnit: new FormControl('Seleccione ...')
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (let change in changes) {
      if (change == "countChanges") {
        this.presentationUnitToUpdate = this.maintenanceItemService.getPresentationUnit();
        if (this.presentationUnitToUpdate != null) {
          this.setDataInForm(this.presentationUnitToUpdate);
        } else {
          this.clearForm();
        }
      }
    }
  }

  ngOnInit(): void {
    this.initComponents();
  }

  async initComponents(){
    try{
      this.countChanges = 0;
      this.clearForm();
      this.lsPresentationUnit = await this.maintenanceItemService.getPresentationUnits();
    }catch(err){
      console.error(err.error.Message);
      alert(err.error.Message);      
    }    
  }

  setPresentationUnit(event: any){
    let oPresentation = this.lsPresentationUnit.find(pu => pu.id == event.value);
    //console.log("[presentation unit]: ", oPresentation);
    this.maintenanceItemService.setPresentationUnit(oPresentation);
  }

  clearForm(){
    this.frmPresentationUnit.controls.cmbPresentationUnit.setValue(0);
  }

  setDataInForm(pPresentation:PresentationUnit){
    this.frmPresentationUnit.controls.cmbPresentationUnit.setValue(pPresentation.id);
  }


}
