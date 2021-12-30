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
  @Output() changeCategory  = new EventEmitter<Category>()

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

  async initComponents() {
    try {
      this.frmCategory.controls.cmbCategory.setValue(0);
      this.lsCategory = await this.maintenanceItemService.getCategories();
    } catch (error) {
      console.error(error);
    }
  }

  setCategory(event: any) {
    let oCategory = this.lsCategory.find(ct => ct.id == event.value);
    this.changeCategory.emit(oCategory);
  }

  showDataInForm(pCategory: Category) {
    const indexCategory = (pCategory !== null)?pCategory.id:0;
    this.frmCategory.controls.cmbCategory.setValue(indexCategory);
  }

  clearDataForm() {
    this.frmCategory.controls.cmbCategory.setValue(0);
  }

}
