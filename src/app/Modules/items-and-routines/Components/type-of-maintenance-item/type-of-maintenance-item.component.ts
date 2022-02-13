import { Component, Input, OnInit , Output, EventEmitter} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { TypeOfMaintenanceItems } from 'src/app/Models/enumPresentationUnit';
import { TypeOfMaintenanceItem } from 'src/app/Models/TypeOfMaintenanceItem';
import { MaintenanceItemService } from '../../Services/MaintenanceItem/maintenance-item.service';

@Component({
  selector: 'app-type-of-maintenance-item',
  templateUrl: './type-of-maintenance-item.component.html',
  styleUrls: ['./type-of-maintenance-item.component.scss']
})
export class TypeOfMaintenanceItemComponent implements OnInit {
  frmType: FormGroup;
  lsType: TypeOfMaintenanceItem[];

  @Output() lostFocus = new EventEmitter<TypeOfMaintenanceItem>();
  @Output() chageType = new EventEmitter<TypeOfMaintenanceItem>();

  typeOfItemSelected: TypeOfMaintenanceItem;
  @Input('typeOfItem')
  set setTypeOfItem(type: TypeOfMaintenanceItem){
    this.typeOfItemSelected = type;
    if (this.typeOfItemSelected !== null && this.typeOfItemSelected !== undefined){
      this.setDataInForm(this.typeOfItemSelected);
      this.chageType.emit(this.typeOfItemSelected);
    }else{
      this.clearForm();
      this.chageType.emit(null);
    }
  }

  disableControls: boolean;
  @Input('disableControls')
  set setDisableControls(value: boolean){
    this.disableControls = value;
    if (this.disableControls){
      this.frmType.disable();
    }else{
      this.frmType.enable();
    }
  }

  constructor(
    private maintenanceItemService: MaintenanceItemService
  ) {
    this.frmType = new FormGroup({
      cmbType: new FormControl('Seleccione ...')
    });
  }

  ngOnInit(): void {
    this.initComponents();
  }

  async initComponents(){
    try {
      this.clearForm();
      this.maintenanceItemService.getTypeOfMaintenanceItem()
      .then(lsTypes => {
        this.lsType = lsTypes;
        if (this.typeOfItemSelected !== null){
          this.setDataInForm(this.typeOfItemSelected);
          this.setType(this.typeOfItemSelected);
        }else{
          this.clearForm();
        }
      });
    } catch (err) {
      console.error(err.error.Message);
      alert(err.error.Message);
    }
  }

  setType(event: any){
    this.typeOfItemSelected = this.lsType.find(tp => tp.id == event.value);
    this.chageType.emit(this.typeOfItemSelected);
  }

  setDataInForm(pType: TypeOfMaintenanceItem){
    const indexType = (pType !== null) ? pType.id : 1;
    this.frmType.controls.cmbType.setValue(indexType);
  }

  clearForm(){
    this.frmType.controls.cmbType.setValue(0);
  }

  focusoutType(){
    this.lostFocus.emit(this.typeOfItemSelected);
  }
}
