import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/Models/Client';
import { ConfigPersonComponent } from 'src/app/Models/ConfigPersonComponent';
import { PersonService } from '../../Services/person.service';
import { ClientService } from '../../Services/client.service';
import { ResponseApi } from 'src/app/Models/ResponseAPI';
import { Person } from 'src/app/Models/Person';
import { Router } from '@angular/router';
import { CityService } from '../../Services/city.service';
import { City } from 'src/app/Models/City';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {
  oConfigPersonComp: ConfigPersonComponent;  
  bFormHasError:boolean;
  errorMessage:string;
  isAwaiting:boolean;
  oPersonToUpdate: Person;
  oClientToUpdate: Client;
  oDataIsToUpdate: boolean;
  sReturnPath:string;
  ROUTE_MASTER_CLIENT:string = "/MasterClients";
  oIsToClient:boolean;
  oClientWasSaved:boolean;
 

  constructor(
    private personService:PersonService,
    private ClientService:ClientService,
    private cityService:CityService,
    private router:Router
  ) { 
    this.loadApp();
    this.bFormHasError = false;
    this.errorMessage = "";
    this.isAwaiting = false;
    this.oDataIsToUpdate = false;  
    this.oIsToClient= true;
  }

  ngOnInit(): void {
    this.initComponents();
  }

  session : any = {};
  modules : any[] = [];
  loadApp(){    
    this.session = JSON.parse(localStorage.getItem('sessionUser'))   
    if (this.session == null) {      
      this.router.navigate(['Login']);      
    }
    console.log(this.session);
    this.session.group.modules.forEach(element => {
      if (element.id_moduleF == 1) {
        this.modules.push(element);  
      }      
    }); 
  }

  activateModule(id: number){
    if (this.modules.find(a => a.id_module == id)) {
      return true;
    }else{
      return false;
    }
  }

  initComponents(){    
    this.oClientWasSaved = false;    
    this.configurePersonComponent();
    this.hideContainerTabs();
    this.sReturnPath = this.ROUTE_MASTER_CLIENT;
    //console.warn("[before]")
    this.oClientToUpdate = this.ClientService.getClientToUpdate();
    //console.log("[Client component] : ", this.oClientToUpdate);
    if(this.oClientToUpdate != null){      
      this.setDataToUpdateClient(this.oClientToUpdate);
      this.oDataIsToUpdate = true;
    }
  }

  configurePersonComponent(){
    this.oConfigPersonComp = new ConfigPersonComponent();    
    this.oConfigPersonComp.documentIsVisible = true;
    this.oConfigPersonComp.nameIsVisible = true;
    this.oConfigPersonComp.phoneIsVisible = true;
    this.oConfigPersonComp.cellphoneIsVisible = true;
    this.oConfigPersonComp.addressIsVisible = true;
    this.oConfigPersonComp.websiteIsVisible = true;
    this.oConfigPersonComp.cityIsVisible = true;
  }

  setDataToUpdateClient(pClient:Client){
    this.oPersonToUpdate = new Person();
    this.oPersonToUpdate.id = pClient.id;
    this.oPersonToUpdate.document = pClient.document;
    this.oPersonToUpdate.name = pClient.name.toLocaleLowerCase();
    this.oPersonToUpdate.phone = pClient.phone;
    this.oPersonToUpdate.cellphone = pClient.cellphone;
    this.oPersonToUpdate.address = (pClient.address != null)?pClient.address.toLowerCase(): "";
    this.oPersonToUpdate.website = (pClient.website != null)?pClient.website.toLowerCase():"";
    this.oPersonToUpdate.city = pClient.city;
  }

 
  async SetDataToSaveClient(){
    this.isAwaiting = true;
    try{      
      let oClient = new Client();
      oClient = this.personService.getPerson();
      //console.log(oClient);
      let rta = new ResponseApi();

      if(this.oDataIsToUpdate){
        rta = await this.ClientService.updateClient(oClient);      
        this.cityService.setSelectedCity(null);       
      }else{
        rta = await this.ClientService.insertClient(oClient);           
      }     

      if(rta.response){
        alert(rta.message);  
        let clientTmp = await this.ClientService.getClientByDocument(oClient.document);
        this.ClientService.setClientToUpdate(clientTmp);        
        this.oClientWasSaved = true; 
             
      }
    }catch(err){
      console.log(err.error.Message);
      this.bFormHasError = true;
      this.errorMessage = err.error.Message;
    } 
    this.isAwaiting = false;
  }


  openTab(oButton:any,container:string){
    let tabLinks = document.getElementsByClassName("tab_link");

    for(let i = 0 ; i < tabLinks.length; i ++){
      tabLinks[i].classList.remove("active");
    }
    oButton.target.className += " active";
    let containerTabs = document.getElementsByClassName("tab_content");

    for(let i = 0 ; i < containerTabs.length; i ++){
      containerTabs[i].setAttribute("style","display:none");
    }

    let containerToShow_id = `container__${container}`;   
    let containerToShow = document.getElementById(containerToShow_id);

    //console.log(containerToShow);

    containerToShow.setAttribute("style","display:blick");
  }

  hideContainerTabs(){
    let containers = document.getElementsByClassName("tab_inactive");
    for(let i = 0 ; i < containers.length; i ++){
      containers[i].setAttribute("style","display:none");
    }
  }

  
  moveContent(event:any){
    //console.log(event);
    let containerContent:HTMLDivElement  = document.querySelector("#container__content"); 
    
    if(event){     
      containerContent.style.marginLeft = "250px";
    }else{
      containerContent.style.marginLeft = "60px";
    }
    
  }
  
}
