import { Component, OnInit } from '@angular/core';
import { City } from 'src/app/Models/City';
import { Client } from 'src/app/Models/Client';
import { ClientService } from '../../Services/Client/client.service';
import { Router } from '@angular/router';
import { NavigationService } from '../../../navigation/Services/Navigation/navigation.service';
import { Company } from 'src/app/Models/Company';
import { CompanyType } from 'src/app/Models/CompanyType';
import { SecurityValidators } from 'src/app/Models/SecurityValidators';
import { ActionType } from 'src/app/Models/ActionType';
import { saveInStorage } from 'src/app/Utils/storage';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-tbl-client',
  templateUrl: './tbl-client.component.html',
  styleUrls: ['./tbl-client.component.scss']
})
export class TblClientComponent implements OnInit {
  lsClient: Client[] = [];
  lsClientFiltered: Client[] = [];
  isAwaiting: boolean;
  company: Company;
  enableButtonsEditAndDelete: boolean;
   // pagination
   p = 1;
   action: ActionType;
   txtFilter: FormControl;

  constructor(
    private clientService: ClientService,
    private router: Router,
    private navigationService: NavigationService
  ) {
      this.isAwaiting = false;
      this.txtFilter = new FormControl();
      this.txtFilter.valueChanges
      .subscribe(description => {
        this.lsClientFiltered = this.lsClient
        .filter(client =>{
          if(description != null){
            return client.document.includes(description) ||
            client.name.toUpperCase().includes(description.toUpperCase())
          }
        })
      })
   }


  ngOnInit(): void {
    this.enableButtonsEditAndDelete = true;
    this.initComponents();
    this.validateCompanyLogged();
  }

  async initComponents(){
    this.navigationService.setItemActive('client');
    this.isAwaiting = true;
    this.clientService.setClientToUpdate(null);
    try{
      this.lsClient = await this.clientService.getClients();
      this.lsClientFiltered = this.lsClient;
    }catch (err){
      console.error(err.error.Message);
      alert(err.error.Message);
    }
    this.isAwaiting = false;
  }

  async validateCompanyLogged() {
    try {
      this.company = SecurityValidators.validateUserAndCompany();
      switch (this.company.type) {
        case CompanyType.DEALER:
        case CompanyType.CLIENT:
            this.enableButtonsEditAndDelete = false;
            break;
        default:
            this.enableButtonsEditAndDelete = true;
            break;
      }
    } catch (error) {
      console.warn(error);
    }
  }

  validateCityName(pCity: City): string{
    if (pCity != null){
      return pCity.name;
    }else{
      return '';
    }
  }


  getDetailsClient(pId: number){
    try{
      this.action = ActionType.READ;
      this.clientService.setAction(this.action);
      saveInStorage('actionToPerform', this.action);
      this.router.navigate(['/MasterClients/Client', pId]);
    }catch (err){
      console.error(err.error.Message);
      alert(err.error.Message);
    }
  }

  updateClient(pId: number){
    try{
      this.action = ActionType.UPDATE;
      this.clientService.setAction(this.action);
      saveInStorage('actionToPerform', this.action);
      this.router.navigate(['/MasterClients/Client', pId]);
    }catch (err){
      console.error(err.error.Message);
      alert(err.error.Message);
    }
  }

  deleteClient(pClient: Client){
    try{
      if (confirm('¿Está seguro que desea eliminar este cliente?')){
        this.isAwaiting = true;
        this.clientService.deleteClient(pClient).then(response => {
          const rta = response;
          this.isAwaiting = false;
          if (rta.response){
            alert(rta.message);
            this.initComponents();
          }
        });
      }
    }catch (err){
      console.error(err.error.Message);
      alert(err.error.Message);
    }

  }

  insertClient(){
    this.action = ActionType.CREATE;
    this.clientService.setAction(this.action);
    saveInStorage('actionToPerform', this.action);
    this.router.navigate(['/MasterClients/Client']);
  }

  moveContent(event: any){
    const containerContent: HTMLDivElement  = document.querySelector('#container__content');
    if (event){
      containerContent.style.marginLeft = '250px';
    }else{
      containerContent.style.marginLeft = '0px';
    }
  }

  removeFilter(){
    this.txtFilter.setValue(null);
    this.lsClientFiltered = this.lsClient
  }

}
