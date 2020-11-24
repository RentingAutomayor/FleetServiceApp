import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Category } from 'src/app/Models/Category';
import { MaintenanceItemService } from '../../Services/maintenance-item.service';

@Component({
  selector: 'app-maintenance-item-category',
  templateUrl: './maintenance-item-category.component.html',
  styleUrls: ['./maintenance-item-category.component.scss']
})
export class MaintenanceItemCategoryComponent implements OnInit, OnChanges {
  frmCategory: FormGroup;
  lsCategory: Category[];
  categorySelected: Category;
  @Input() countChanges:number;

  constructor(
    private maintenanceItemService: MaintenanceItemService
  ) {
    this.frmCategory = new FormGroup({
      cmbCategory: new FormControl('Seleccione ...')
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    for (let change in changes) {
      if (change == "countChanges") {
        this.categorySelected = this.maintenanceItemService.getCategorySelected();

        if (this.categorySelected != null) {
          this.showDataInForm(this.categorySelected);
        } else {
          this.clearDataForm();
        }
      }
    }
  }

  ngOnInit(): void {
    this.initComponents();
  }

  async initComponents() {
    try {
      this.countChanges = 0;
      this.frmCategory.controls.cmbCategory.setValue(0);
      this.lsCategory = await this.maintenanceItemService.getCategories();
    } catch (error) {
      console.error(error);
    }
  }

  setCategory(event: any) {
    let oCategory = this.lsCategory.find(ct => ct.id == event.value);
    this.maintenanceItemService.setCategorySelected(oCategory);
  }

  showDataInForm(pCategory: Category) {    
    this.frmCategory.controls.cmbCategory.setValue(pCategory.id);
  }

  clearDataForm() {
    this.frmCategory.controls.cmbCategory.setValue(0);
  }

}
