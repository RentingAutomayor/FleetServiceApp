import { Component, Input, OnInit ,OnChanges, SimpleChange, SimpleChanges} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { TypeOfMaintenanceItem } from 'src/app/Models/TypeOfMaintenanceItem';
import { MaintenanceItemService } from '../../Services/MaintenanceItem/maintenance-item.service';

@Component({
  selector: 'app-type-of-maintenance-item',
  templateUrl: './type-of-maintenance-item.component.html',
  styleUrls: ['./type-of-maintenance-item.component.scss']
})
export class TypeOfMaintenanceItemComponent implements OnInit,OnChanges {
  frmType: FormGroup;
  lsType: TypeOfMaintenanceItem[];
  lsTypeToUpdate: TypeOfMaintenanceItem;
  @Input() countChanges:number;
  constructor(
    private maintenanceItemService:MaintenanceItemService
  ) { 
    this.frmType = new FormGroup({
      cmbType: new FormControl('Seleccione ...')
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    for (let change in changes) {
      if (change == "countChanges") {
        this.lsTypeToUpdate = this.maintenanceItemService.getTypeOfItem();
        if (this.lsTypeToUpdate != null) {
          this.setDataInForm(this.lsTypeToUpdate);
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
    try {
      this.countChanges = 0;
      this.clearForm();
      this.lsType = await this.maintenanceItemService.getTypeOfMaintenanceItem();
    } catch (err) {
      console.error(err.error.Message);
      alert(err.error.Message);
    }
  }

  setType(event:any){
    let typeOfItem = this.lsType.find(tp => tp.id == event.value);
    this.maintenanceItemService.settypeOfItem(typeOfItem);
  }

  setDataInForm(pType:TypeOfMaintenanceItem){
    this.frmType.controls.cmbType.setValue(pType.id);
  }

  clearForm(){
    this.frmType.controls.cmbType.setValue(0);
  }

}
