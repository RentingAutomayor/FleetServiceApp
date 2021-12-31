import { Component, Input, OnInit ,OnChanges, SimpleChange, SimpleChanges, Output, EventEmitter} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { TypeOfMaintenanceItems } from 'src/app/Models/enumPresentationUnit';
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
  @Input() typeOfItem: TypeOfMaintenanceItem;
  @Output() lostFocus = new EventEmitter<boolean>();
  @Output() chageType = new EventEmitter<TypeOfMaintenanceItem>();

  constructor(
    private maintenanceItemService:MaintenanceItemService
  ) {
    this.frmType = new FormGroup({
      cmbType: new FormControl('Seleccione ...')
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    try {
      this.setDataInForm(this.typeOfItem);
    } catch (error) {
      console.warn(error)
    }
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

        if(this.typeOfItem !== null){
          this.setDataInForm(this.typeOfItem)
        }else{
          this.setDataInForm(null)
          const typeByDefault =  this.lsType.find(tp => tp.id == TypeOfMaintenanceItems.REPUESTO);
          this.setType(typeByDefault)
        }
      });
    } catch (err) {
      console.error(err.error.Message);
      alert(err.error.Message);
    }
  }

  setType(event:any){
    let typeOfItem = this.lsType.find(tp => tp.id == event.value);
    this.chageType.emit(typeOfItem);
  }

  setDataInForm(pType:TypeOfMaintenanceItem){
    const indexType = (pType!==null)?pType.id:1;
    this.frmType.controls.cmbType.setValue(indexType);
  }

  clearForm(){
    this.frmType.controls.cmbType.setValue(0);
  }

  focusoutType(){
    this.lostFocus.emit(true);
  }
}
