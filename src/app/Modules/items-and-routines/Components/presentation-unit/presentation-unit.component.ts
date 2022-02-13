import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { PresentationUnit } from 'src/app/Models/PresentationUnit';
import { MaintenanceItemService } from '../../Services/MaintenanceItem/maintenance-item.service';
import { TypeOfMaintenanceItems } from 'src/app/Models/enumPresentationUnit';
import { PresentationUnits } from 'src/app/Models/enumPresentationUnit';
import { TypeOfMaintenanceItem } from 'src/app/Models/TypeOfMaintenanceItem';


@Component({
  selector: 'app-presentation-unit',
  templateUrl: './presentation-unit.component.html',
  styleUrls: ['./presentation-unit.component.scss']
})
export class PresentationUnitComponent implements OnInit {
  lsPresentationUnit: PresentationUnit[];
  lsPresentationUnitFiltered: PresentationUnit[];
  frmPresentationUnit: FormGroup;


  @Output() lostFocus = new EventEmitter<PresentationUnit>();
  @Output() changePresentation = new EventEmitter<PresentationUnit>();

  presentationUnitSelected: PresentationUnit;
  @Input('presentationUnit')
  set setPresentationUnit(presentation: PresentationUnit){
    this.presentationUnitSelected = presentation;
    if (this.presentationUnitSelected !== null && this.presentationUnitSelected !== undefined){
      this.setDataInForm(this.presentationUnitSelected);
      this.changePresentation.emit(this.presentationUnitSelected);
    }else{
      this.clearForm();
      this.changePresentation.emit(null);
    }

  }

  idTypeOfItem: number;
  @Input('idTypeOfItem')
  set setIdTypeOfItem(idType: number){
    this.idTypeOfItem = idType;
    if (this.idTypeOfItem !== 0) {
        this.filterPresentationsByType(this.idTypeOfItem);
    }
  }

  disableControls: boolean;
  @Input('disableControls')
  set setDisableControls(value: boolean){
    this.disableControls = value;
    if (this.disableControls){
      this.frmPresentationUnit.disable();
    }else{
      this.frmPresentationUnit.enable();
    }
  }

  constructor(
    private maintenanceItemService: MaintenanceItemService
  ) {
    this.frmPresentationUnit = new FormGroup({
      cmbPresentationUnit: new FormControl('Seleccione ...')
    });
  }

  ngOnInit(): void {
    this.initComponents();
  }


  async initComponents() {
    try {
      this.getPresentationUnits();
    } catch (err) {
      console.error(err.error.Message);
      alert(err.error.Message);
    }
  }

  getPresentationUnits() {
    try {
      if (this.idTypeOfItem !== 0) {
        this.maintenanceItemService.getPresentationUnits()
          .then(presentations => {
            this.lsPresentationUnit = presentations;
            this.filterPresentationsByType(this.idTypeOfItem);
            if (this.presentationUnitSelected  !== null) {
              this.setDataInForm(this.presentationUnitSelected );
            }
          });
      }
    } catch (error) {

    }
  }

  filterPresentationsByType(idType: number) {
    if (this.idTypeOfItem == TypeOfMaintenanceItems.MANO_DE_OBRA) {
      this.lsPresentationUnitFiltered = this.lsPresentationUnit.filter(pres => pres.id === PresentationUnits.HORAS);
    } else {
      this.lsPresentationUnitFiltered = this.lsPresentationUnit.filter(pres => pres.id !== PresentationUnits.HORAS);
    }
  }

  changePresentationUnit(event: any) {
    this.presentationUnitSelected = this.lsPresentationUnitFiltered.find(pu => pu.id == event.target.value);
    this.changePresentation.emit(this.presentationUnitSelected );
  }

  clearForm() {
    this.frmPresentationUnit.controls.cmbPresentationUnit.setValue(0);
  }

  setDataInForm(pPresentation: PresentationUnit) {
    const idPresentation = (pPresentation !== null) ? pPresentation.id : 0;
    this.frmPresentationUnit.controls.cmbPresentationUnit.setValue(idPresentation);
  }

  presentationUnitFocusOut() {
    this.lostFocus.emit(this.presentationUnitSelected);
  }


}
