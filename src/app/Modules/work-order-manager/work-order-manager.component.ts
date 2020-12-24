import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-work-order-manager',
  templateUrl: './work-order-manager.component.html',
  styleUrls: ['./work-order-manager.component.scss', '../../../assets/styles/app.scss']
})
export class WorkOrderManagerComponent implements OnInit {
  isAwaiting:boolean;
  constructor() { }

  ngOnInit(): void {
    this.initComponents();
  }
  async initComponents(){
    this.isAwaiting = false;
  }

}
