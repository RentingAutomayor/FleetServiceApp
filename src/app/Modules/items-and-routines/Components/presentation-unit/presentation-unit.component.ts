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
export class PresentationUnitComponent implements OnInit, OnChanges {
  lsPresentationUnit: PresentationUnit[];
  lsPresentationUnitFiltered: PresentationUnit[];
  frmPresentationUnit: FormGroup;
  @Input() presentationUnit: PresentationUnit;
  @Input() idTypeOfItem: number
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
    if (this.idTypeOfItem !== 0) {
      this.filterPresentationsByType(this.idTypeOfItem)
    }
    this.setDataInForm(this.presentationUnit)

  }

  ngOnInit(): void {
    this.initComponents();
  }

  getPresentationUnits() {
    try {
      if (this.idTypeOfItem !== 0) {
        this.maintenanceItemService.getPresentationUnits()
          .then(presentations => {
            this.lsPresentationUnit = presentations
            this.filterPresentationsByType(this.idTypeOfItem)

            if (this.presentationUnit !== null) {
              this.setDataInForm(this.presentationUnit)
            }
          })
      }
    } catch (error) {

    }
  }

  filterPresentationsByType(idType: number) {
    if (this.idTypeOfItem == TypeOfMaintenanceItems.MANO_DE_OBRA) {
      this.lsPresentationUnitFiltered = this.lsPresentationUnit.filter(pres => pres.id === PresentationUnits.HORAS)
    } else {
      this.lsPresentationUnitFiltered = this.lsPresentationUnit.filter(pres => pres.id !== PresentationUnits.HORAS)
    }
  }

  async initComponents() {
    try {
      //this.clearForm();
      this.getPresentationUnits();

    } catch (err) {
      console.error(err.error.Message);
      alert(err.error.Message);
    }
  }

  setPresentationUnit(event: any) {
    const oPresentation = this.lsPresentationUnitFiltered.find(pu => pu.id == event.value);
    this.changePresentation.emit(oPresentation);
  }

  clearForm() {
    this.frmPresentationUnit.controls.cmbPresentationUnit.setValue(0);
  }

  setDataInForm(pPresentation: PresentationUnit) {
    let idPresentation = (pPresentation !== null) ? pPresentation.id : 0;
    this.frmPresentationUnit.controls.cmbPresentationUnit.setValue(idPresentation)
  }

  presentationUnitFocusOut() {
    this.lostFocus.emit(true);
  }


}
