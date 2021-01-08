import { Component, OnInit } from '@angular/core';
import { MaintenanceItem } from 'src/app/Models/MaintenanceItem';
import { ResponseApi } from 'src/app/Models/ResponseAPI';
import { VehicleModel } from 'src/app/Models/VehicleModel';
import { MaintenanceItemService } from '../../Services/maintenance-item.service';
import { VehicleService } from '../../Services/vehicle.service';

@Component({
  selector: 'app-items-and-routines',
  templateUrl: './items-and-routines.component.html',
  styleUrls: ['./items-and-routines.component.scss']
})
export class ItemsAndRoutinesComponent implements OnInit {
  isAwaiting: boolean;
  p: Number = 1;
  oCountChanges: number;
  lsMaintenanceItems: MaintenanceItem[];
  isToUpdate:boolean;
  constructor(
    private vehicleService : VehicleService,
    private maintenanceItemService: MaintenanceItemService
  ) { }

  ngOnInit(): void {
    this.initComponents();
  }

  initComponents(){
    this.hideContainerTabs();
  }

  

  openTab(oButton: any, container: string) {
    let tabLinks = document.getElementsByClassName("tab_link");

    for (let i = 0; i < tabLinks.length; i++) {
      tabLinks[i].classList.remove("active");
    }
    oButton.target.className += " active";
    let containerTabs = document.getElementsByClassName("tab_content");

    for (let i = 0; i < containerTabs.length; i++) {
      containerTabs[i].setAttribute("style", "display:none");
    }

    let containerToShow_id = `container__${container}`;
    let containerToShow = document.getElementById(containerToShow_id);

    //console.log(containerToShow);

    containerToShow.setAttribute("style", "display:block");
    this.vehicleService.setBrandSelected(null);
    this.vehicleService.setVehicleTypeSelected(null);
  }

  hideContainerTabs() {
    let containers = document.getElementsByClassName("tab_inactive");
    for (let i = 0; i < containers.length; i++) {
      containers[i].setAttribute("style", "display:none");
    }
  }


  moveContent(event: any) {
    console.log(event);
    let containerContent: HTMLDivElement = document.querySelector("#container__content");
    if (event) {
      containerContent.style.marginLeft = "250px";
    } else {
      containerContent.style.marginLeft = "60px";
    }
  }




}
