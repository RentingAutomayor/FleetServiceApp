import { Component, OnInit } from '@angular/core';
import { City } from 'src/app/Models/City';
import { Client } from 'src/app/Models/Client';
import { ClientService } from '../../Services/client.service';
import { Router } from '@angular/router';
import { NavigationService } from '../../Services/navigation.service';

@Component({
  selector: 'app-tbl-client',
  templateUrl: './tbl-client.component.html',
  styleUrls: ['./tbl-client.component.scss']
})
export class TblClientComponent implements OnInit {
  lsClient: Client[];
  isAwaiting:boolean;
   //pagination
   p:number = 1;
  
  constructor(
    private clientService : ClientService,
    private router: Router,
    private navigationService: NavigationService
  ) {
      this.isAwaiting = false;
   }


  ngOnInit(): void {
    this.initComponents();
  }

  async initComponents(){
    this.navigationService.setItemActive('client');
    this.isAwaiting = true;
    this.clientService.setClientToUpdate(null);
    try{     
      this.lsClient = await this.clientService.getClients();
    }catch(err){
      console.error(err.error.Message);
      alert(err.error.Message);
    }
    this.isAwaiting = false;
  }

  validateCityName(pCity:City):string{
    if(pCity!= null){
      return pCity.name;
    }else{
      return "";
    }
  }

  async updateClient(pId:number){
    try{
      this.isAwaiting = true;
      let oClientDB = await this.clientService.getClientById(pId);
      this.clientService.setClientToUpdate(oClientDB);      
      this.isAwaiting = false;
      this.router.navigate(["/MasterClients/Client"]);
    }catch(err){
      console.error(err.error.Message);
      alert(err.error.Message);
    }
  }

  async deleteClient(pClient:Client){
    try{
      if(confirm("¿Está seguro que desea eliminar este cliente?")){
        this.isAwaiting = true;
        let rta = await this.clientService.deleteClient(pClient);
        this.isAwaiting = false;
        if(rta.response){
          alert(rta.message);
          this.initComponents();
        }
      }
    }catch(err){
      console.error(err.error.Message);
      alert(err.error.Message);
    }
   
  }

  insertClient(){
    this.router.navigate(["/MasterClients/Client"]);
  }

  moveContent(event:any){
    console.log(event);
    let containerContent:HTMLDivElement  = document.querySelector("#container__content"); 
    
    if(event){     
      containerContent.style.marginLeft = "250px";
    }else{
      containerContent.style.marginLeft = "0px";
    }
    
  }

}
