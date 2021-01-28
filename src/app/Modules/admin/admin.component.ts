import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Action } from 'src/app/Models/Action';
import { AdminService } from 'src/app/Services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  lsActions: Action[];  
  lsGroups: any[];
  lsUsers: any[];

  session : any = {};
  isAwaiting:boolean;

   //pagination
   ap:number = 1;
   gp:number = 1;
   up:number = 1;
   p:number = 1;

  constructor(private adminService : AdminService,
              private router:Router) { 
              this.loadApp(); 
              this.isAwaiting = false;
  }

  ngOnInit(): void {
    this.initComponents();  
  }

  loadApp(){    
    this.session = JSON.parse(sessionStorage.getItem('sessionUser'))   
    if (this.session == null) {      
      this.router.navigate(['Login']);      
    }
  } 

  async initComponents(){
    this.isAwaiting = true;
    this.hideContainerTabs();
    try{       
      this.lsActions = await this.adminService.getActions();
      this.lsGroups = await this.adminService.getGroups();  
      this.lsUsers = await this.adminService.getUsers();  
    }catch(err){
      console.error(err.error.Message);
      alert(err.error.Message);
    }
    this.isAwaiting = false;
  }

  hideContainerTabs(){
    let containers = document.getElementsByClassName("tab_inactive");
    for(let i = 0 ; i < containers.length; i ++){
      containers[i].setAttribute("style","display:none");
    }
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

  comeBackToTable(route: string) {
    this.hidePopUp(route);
  }

  // insert

  insertAction(){
    this.showPopUp('Action');
  }

  insertGroup(){
    this.showPopUp('Group');
  }

  insertUser(){
    this.showPopUp('User');
  }

  // update

  async updateAction(pId:number){
    // try{
    //   this.isAwaiting = true;
    //   let oClientDB = await this.clientService.getClientById(pId);
    //   this.clientService.setClientToUpdate(oClientDB);      
    //   this.isAwaiting = false;
    //   this.router.navigate(["/MasterClients/Client"]);
    // }catch(err){
    //   console.error(err.error.Message);
    //   alert(err.error.Message);
    // }
  }

  // delete

  async deleteUser(pUser: any){
    try{
      if(confirm("¿Está seguro que desea eliminar este usuario?")){
        this.isAwaiting = true;
        let rta = await this.adminService.deleteUser(pUser);
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
  
  async deleteAction(pAction: Action){
    try{
      if(confirm("¿Está seguro que desea eliminar esta accion?")){
        this.isAwaiting = true;
        let rta = await this.adminService.deleteAction(pAction);
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

  async deleteGroup(pGroup: any){
    try{
      if(confirm("¿Está seguro que desea eliminar este grupo?")){
        this.isAwaiting = true;
        let rta = await this.adminService.deleteGroup(pGroup);
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

  // pop up

  showPopUp(id: string) {
    let containerForm = document.getElementById("container__form" + id);
    containerForm.setAttribute("style", "display:block");
  }

  hidePopUp(id: string) {
    let containerForm = document.getElementById("container__form" + id);
    containerForm.setAttribute("style", "display:none");
  }

  // refresh

  saveAction(respuesta: any){
    alert(respuesta.message);

    if (respuesta.state) {      
      this.initComponents();
    }    

    this.comeBackToTable('Action')
  }

}
