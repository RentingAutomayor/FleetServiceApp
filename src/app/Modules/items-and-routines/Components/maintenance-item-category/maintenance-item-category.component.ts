import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { Category } from 'src/app/Models/Category';
import { MaintenanceItemService } from '../../Services/MaintenanceItem/maintenance-item.service';

@Component({
  selector: 'app-maintenance-item-category',
  templateUrl: './maintenance-item-category.component.html',
  styleUrls: ['./maintenance-item-category.component.scss']
})
export class MaintenanceItemCategoryComponent implements OnInit, OnChanges {
  frmCategory: FormGroup;
  lsCategory: Category[];
  categorySelected: Category;


  @Input() category: Category;

  @Output() changeCategory  = new EventEmitter<Category>();
  @Output() onFocusOut = new EventEmitter<Category>();

  disableControls:boolean
  @Input('disableControls')
  set setDisableControls(value:boolean){
    this.disableControls = value;
    if(this.disableControls){
      this.frmCategory.disable()
    }else{
      this.frmCategory.enable()
    }
  }

  constructor(
    private maintenanceItemService: MaintenanceItemService
  ) {
    this.frmCategory = new FormGroup({
      cmbCategory: new FormControl('Seleccione ...')
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.showDataInForm(this.category);
  }

  ngOnInit(): void {
    this.initComponents();
  }

   initComponents() {
    try {
      this.frmCategory.controls.cmbCategory.setValue(0);
      this.maintenanceItemService.getCategories()
      .then(categories => {
        this.lsCategory =  categories;
      })
    } catch (error) {
      console.error(error);
    }
  }

  setCategory(event: any) {
    this.categorySelected = this.lsCategory.find(ct => ct.id == event.value);
    this.changeCategory.emit(this.categorySelected);
  }

  showDataInForm(pCategory: Category) {
    const indexCategory = (pCategory !== null)?pCategory.id:0;
    this.frmCategory.controls.cmbCategory.setValue(indexCategory);
  }

  clearDataForm() {
    this.frmCategory.controls.cmbCategory.setValue(0);
  }

  focusOut(){
    this.onFocusOut.emit(this.categorySelected)
  }

}
