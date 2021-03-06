import { Component, Input, OnInit, OnChanges, SimpleChanges, ɵConsole } from '@angular/core';
import { Client } from 'src/app/Models/Client';
import { Vehicle } from 'src/app/Models/Vehicle';
import { VehicleModel } from 'src/app/Models/VehicleModel';
import { VehicleService } from '../../../client/Services/Vehicle/vehicle.service';
import { ClientService } from 'src/app/Modules/client/Services/Client/client.service';
import { Contract } from 'src/app/Models/Contract';
import { setTime } from 'ngx-bootstrap/chronos/utils/date-setters';


@Component({
  selector: 'app-tbl-check-vehicles',
  templateUrl: './tbl-check-vehicles.component.html',
  styleUrls: ['./tbl-check-vehicles.component.scss', '../../../../../assets/styles/checkbox.scss']
})
export class TblCheckVehiclesComponent implements OnInit, OnChanges {
  lsVehicles: Vehicle[];
  lsVehiclesSelected: Vehicle[] = [];
  @Input() clientToFilter: Client;
  @Input() lsVehicleModelsToFilter: VehicleModel[] = [];
  @Input() countChanges: number;
  @Input() amountAllowed: number;
  @Input() contractToFilter: Contract;
  @Input() disableChecks: boolean;
  sModels: string;
  lsVehiclesEmty: boolean;


  constructor(
    private vehicleService: VehicleService,
    private clientService: ClientService
  ) {
    this.clientToFilter = new Client();
    this.sModels = "";
    this.disableChecks = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (let change in changes) {
      console.log("[TBL CHECK VEHICLES] [Cambios]", changes)
      switch (change) {
        case "countChanges":
          this.sModels = "";
          this.clientToFilter = this.clientService.getClientSelected();
          this.lsVehicleModelsToFilter = this.vehicleService.getListVehicleModelsSelected();
          this.setModelsString();
          this.lsVehiclesSelected = this.vehicleService.getListVehiclesSelected();
          if (this.lsVehiclesSelected != null && this.lsVehiclesSelected != undefined) {
            this.checkVehiclesSelected(this.lsVehiclesSelected);
            this.lsVehiclesEmty = false;
          } else {
            this.lsVehiclesEmty = true;
          }

          break;
        case "amountAllowed":
          this.lsVehiclesSelected = this.vehicleService.getListVehiclesSelected();
          if (this.lsVehiclesSelected != null && this.lsVehiclesSelected != undefined) {
            this.checkVehiclesSelected(this.lsVehiclesSelected);
            this.lsVehiclesEmty = false;
          } else {
            this.lsVehiclesEmty = true;
          }
          break;
        case "contractToFilter":
          this.lsVehiclesSelected = this.vehicleService.getListVehiclesSelected();
          if (this.lsVehiclesSelected != null && this.lsVehiclesSelected != undefined) {
            this.checkVehiclesSelected(this.lsVehiclesSelected);
            this.lsVehiclesEmty = false;
          } else {
            this.lsVehiclesEmty = true;
          }
          this.getVehicles();         
          break;
        case "disableChecks":
          this.lsVehiclesSelected = this.vehicleService.getListVehiclesSelected();
          if (this.lsVehiclesSelected != null && this.lsVehiclesSelected != undefined) {
            this.checkVehiclesSelected(this.lsVehiclesSelected);
            this.lsVehiclesEmty = false;
          } else {
            this.lsVehiclesEmty = true;
          }
          this.toggleChecks();
          break;

      }

    }
    console.log(this.clientToFilter);
    console.log(this.lsVehicleModelsToFilter);
    this.getVehicles();
    console.log(this.sModels)
  }

  ngOnInit(): void {
    this.initComponents();    
  }

  async initComponents() {
    this.countChanges = 0;
    this.getVehicles();
    setTimeout(()=>{
      this.toggleChecks();
    },800)
    
  }

  setModelsString() {
    try {
      if (this.lsVehicleModelsToFilter != null && this.lsVehicleModelsToFilter != undefined) {
        this.lsVehicleModelsToFilter.forEach(vm => this.sModels += `${vm.id},`);
        this.sModels = this.sModels.substr(0, (this.sModels.length - 1));
        if (this.sModels == "") {
          this.sModels = "0";
        }
        console.log(this.sModels);
      }

    } catch (error) {
      console.warn(error);

    }
  }

  async getVehicles() {
    try {
      if (this.clientToFilter != null && this.clientToFilter != undefined && this.sModels != "") {
        let contract_id = (this.contractToFilter != null && this.contractToFilter != undefined) ? this.contractToFilter.id : 0;
        console.log(`[TBL CHECK VEHICLES] cliente a filtrar ${this.clientToFilter.id} Modelos: ${this.sModels}  Contrato: ${contract_id}`);
        this.lsVehicles = await this.vehicleService.getVehiclesByClientAndModel(this.clientToFilter.id, this.sModels, contract_id);
        console.log("[tbl-chk-veh -- lsVehicles]:", this.lsVehicles);
      } else {
        this.lsVehicles = [];
      }
    } catch (error) {
      console.error(error);
    }
  }

  getIdChk(idVehicle: number): string {
    return `chk_vehicle_${idVehicle}`;
  }

  setVehicleToContract(event: any, pVehicle: Vehicle) {
    if (event.target.checked) {
      if (this.lsVehiclesSelected == null && this.lsVehiclesSelected == undefined) {
        this.lsVehiclesSelected = [];
      }
      console.log(`[TBL CHECK VEHICLES] [Vehículos asociados hasta el momento] ${this.lsVehiclesSelected.length}`);

      if (this.lsVehiclesSelected.length < this.amountAllowed) {
        this.lsVehiclesSelected.push(pVehicle);
      } else {
        alert(`No se puede adicionar este vehículo, puesto que el contrato sólo tiene configurado un máximo de ${this.amountAllowed} vehículos`);
        event.preventDefault();
      }

    } else {
      let vehicle = this.lsVehiclesSelected.find(vh => vh.id == pVehicle.id);
      let index = this.lsVehiclesSelected.indexOf(vehicle);
      if (index != -1) {
        this.lsVehiclesSelected.splice(index, 1);
      }
    }
    console.log(this.lsVehiclesSelected);

    this.vehicleService.setListVehiclesSelected(this.lsVehiclesSelected);
  }

  checkVehiclesSelected(lsVehicles: Vehicle[]) {
    setTimeout(() => {
      lsVehicles.forEach(vh => {
        try {
          let idCheck = `#${this.getIdChk(vh.id)}`;
          console.warn("[checkVehiclesSelected]", idCheck);
          let vehicleCheckbox: HTMLInputElement = document.querySelector(idCheck);
          vehicleCheckbox.checked = true;
        } catch (error) {
          console.warn(error);
        }
      });
    }, 1500)

  }


  toggleChecks(){
    try {
      setTimeout(()=>{
        this.lsVehicles.forEach(vehicle =>{
          let idCheck = `#${this.getIdChk(vehicle.id)}`;
          let vehicleCheckbox: HTMLInputElement = document.querySelector(idCheck);
          vehicleCheckbox.disabled = this.disableChecks;
        })
      },800)
    } catch (error) {
      console.warn("[toggleChecks VEHI]",error);    
    }
  }


}
