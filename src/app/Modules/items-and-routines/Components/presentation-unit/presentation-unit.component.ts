import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { PresentationUnit } from 'src/app/Models/PresentationUnit';
import { MaintenanceItemService } from '../../Services/MaintenanceItem/maintenance-item.service';

@Component({
  selector: 'app-presentation-unit',
  templateUrl: './presentation-unit.component.html',
  styleUrls: ['./presentation-unit.component.scss']
})
export class PresentationUnitComponent implements OnInit,OnChanges {
  lsPresentationUnit: PresentationUnit[];
  frmPresentationUnit: FormGroup;
  presentationUnitToUpdate: PresentationUnit
  @Input() presentationUnit: PresentationUnit;
  @Output() lostFocus = new EventEmitter<boolean>();
  @Output() changePresentation = new EventEmitter<PresentationUnit>();

  constructor(
    private maintenanceItemService: MaintenanceItemService
  ) {
    this.frmPresentationUnit = new FormGroup({
      cmbPresentationUnit: new FormControl('Seleccione ...')
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setDataInForm(this.presentationUnit)
  }

  ngOnInit(): void {
    this.initComponents();
  }

  async initComponents(){
    try{
      this.clearForm();
      this.lsPresentationUnit = await this.maintenanceItemService.getPresentationUnits();
    }catch(err){
      console.error(err.error.Message);
      alert(err.error.Message);
    }
  }

  setPresentationUnit(event: any){
    let oPresentation = this.lsPresentationUnit.find(pu => pu.id == event.value);
    this.changePresentation.emit(oPresentation);
  }

  clearForm(){
    this.frmPresentationUnit.controls.cmbPresentationUnit.setValue(0);
  }

  setDataInForm(pPresentation:PresentationUnit){
    const indexPresentation = (pPresentation !== null)?pPresentation.id:0;
    this.frmPresentationUnit.controls.cmbPresentationUnit.setValue(indexPresentation);
  }

  presentationUnitFocusOut(){
    this.lostFocus.emit(true);
  }


}
