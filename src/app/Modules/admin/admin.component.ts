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

  // others
  lsClient: any[];
  lsDealer: any[];
  lsComp: any[];

  // object to update
  actionToUpdate = new Action();
  actionToView = new Action();
  actionToCreate = new Action();

  groupToUpdate: any = {} ;
  groupToView: any = {} ;
  groupToCreate: any = {} ;

  userToUpdate: any = {} ;
  userToView: any = {} ;
  userToCreate: any = {} ;

  session : any = {};
  isAwaiting:boolean;

   //pagination
   ap:number = 1;
   gp:number = 1;
   up:number = 1;

  constructor(private adminService : AdminService,
              private router:Router) { 
              this.loadApp(); 
              this.isAwaiting = false;
  }

  ngOnInit(): void {
    this.initComponents();  
  }

  loadApp(){    
    this.session = JSON.parse(sessionStorage.getItem('sessionUser'));
    if (this.session == null) {      
      this.router.navigate(['Login']);      
    }else{
      this.loadProfiles();
    }
  } 

  async loadProfiles(){
    this.lsClient = await this.adminService.getClients();
    this.lsDealer = await this.adminService.getDealers();  
    this.lsComp = await this.adminService.getCompanies();  
  }

  async initComponents(tab?: string){
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
    this.comeBackToTable(tab);
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
    this.actionToUpdate = new Action();
    this.actionToCreate = new Action();
    this.actionToView = new Action();
    this.showPopUp('actions');
  }

  insertGroup(){
    this.groupToUpdate = {} ;
    this.groupToView = {} ;
    this.groupToCreate = {} ;
    this.showPopUp('groups');
  }

  insertUser(){
    this.userToUpdate = {} ;
    this.userToView = {} ;
    this.userToCreate = {} ;
    this.showPopUp('users');
  }

  // update

  async updateAction(pId:number){
    try{
      this.isAwaiting = true;
      this.actionToView = new Action();
      this.actionToUpdate = await this.adminService.getActionById(pId);
      this.showPopUp('actions');
      this.isAwaiting = false;
    }catch(err){
      console.error(err.error.Message);
      alert(err.error.Message);
    }
  }  

  async updateGroup(pId:number){
    try{
      this.isAwaiting = true;
      this.groupToView = {};
      this.groupToUpdate = await this.adminService.getGroupById(pId);
      this.showPopUp('groups');
      this.isAwaiting = false;
    }catch(err){
      console.error(err.error.Message);
      alert(err.error.Message);
    }
  }

  async updateUser(pId:number){
    try{
      this.isAwaiting = true;
      this.userToView = {};
      this.userToUpdate = await this.adminService.getUserById(pId);
      this.showPopUp('users');
      this.isAwaiting = false;
    }catch(err){
      console.error(err.error.Message);
      alert(err.error.Message);
    }
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
          this.initComponents("users");
        }
      }
    }catch(err){
      console.error(err.error.Message);
      alert(err.error.Message);
      this.initComponents("users");
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
          this.initComponents("actions");
        }
      }
    }catch(err){
      console.error(err.error.Message);
      alert(err.error.Message);
      this.initComponents("actions");
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
          this.initComponents("groups");
        }
      }
    }catch(err){
      console.error(err.error.Message);
      alert(err.error.Message);
      this.initComponents("groups");
    }
   
  }

  // view

  async viewAction(pId:number){
    try{
      this.isAwaiting = true;
      this.actionToUpdate = new Action();
      this.actionToView = await this.adminService.getActionById(pId);
      this.showPopUp('actions');
      this.isAwaiting = false;
    }catch(err){
      console.error(err.error.Message);
      alert(err.error.Message);
    }
  }

  async viewUser(pId:number){
    try{
      this.isAwaiting = true;
      this.userToUpdate = {};
      this.userToView = await this.adminService.getUserById(pId);
      this.showPopUp('users');
      this.isAwaiting = false;
    }catch(err){
      console.error(err.error.Message);
      alert(err.error.Message);
    }    
  }

  async viewGroup(pId:number){
    try{
      this.isAwaiting = true;
      this.groupToUpdate = {};
      this.groupToView = await this.adminService.getGroupById(pId);
      this.showPopUp('groups');
      this.isAwaiting = false;
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

    let tabLinks = document.getElementsByClassName("tab_link");

    for(let i = 0 ; i < tabLinks.length; i ++){
      tabLinks[i].classList.remove("active");
    }

    let containerTap = document.getElementById(id);

    containerTap.className += " active";
    let containerTabs = document.getElementsByClassName("tab_content");

    for(let i = 0 ; i < containerTabs.length; i ++){
      containerTabs[i].setAttribute("style","display:none");
    }

    let containerToShow_id = `container__${id}`;     
    let containerToShow = document.getElementById(containerToShow_id);

    containerToShow.setAttribute("style","display:blick");


  }

  // refresh

  saveAction(respuesta: any){
    alert(respuesta.message);

    if (respuesta.state) {      
      this.initComponents('actions');
    }    
  }

  saveGroup(respuesta: any){
    alert(respuesta.message);

    if (respuesta.state) {      
      this.initComponents('groups');
    }    
  }

  saveUser(respuesta: any){
    alert(respuesta.message);

    if (respuesta.state) {      
      this.initComponents('users');
    }    
  }

}

