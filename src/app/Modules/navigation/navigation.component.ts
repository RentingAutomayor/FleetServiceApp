import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavigationService } from '../../Services/navigation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  containerMenu: HTMLDivElement;
  @Output() showCloseMenu = new EventEmitter<boolean>();
  constructor(
    private navigationService: NavigationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initComponents();
  }

  initComponents() {
    this.containerMenu = document.querySelector("#container__menu");
    this.validateItemActive();
  }

  validateItemActive(){
    let itemNav = this.navigationService.getItemActive();
    this.turnOffItems();

    if(itemNav != null){
      this.activateItem(itemNav);
    }
  }

  closeMenu() {
    this.containerMenu.style.width = "0";
    this.showCloseMenu.emit(false);
  }

  openMenu() {
    this.containerMenu.style.width = "250px";
    this.showCloseMenu.emit(true);
  }

  navigateTo(itemNav: string) {
    
    this.turnOffItems();
    this.navigationService.setItemActive(itemNav);
    this.activateItem(itemNav);

    switch (itemNav) {
      case 'client':
          this.router.navigate(["/MasterClients"]);
        break;
      case 'dealer':
          this.router.navigate(["/MasterDealers"]);
        break;
      case 'contract':
        this.router.navigate(["/MasterContracts"]);
        break;
        case 'routine':
          this.router.navigate(["/ItemsAndRoutines"]);          
          break;
      default:
        break;
    }
  }

  activateItem(pItemNav:string){
    let item = `#nav-${pItemNav}`;    
    let itemNavigation: HTMLLinkElement = document.querySelector(item);    
    itemNavigation.classList.add("item-nav-active");
  }

  turnOffItems(){
    let itemsNavigation = document.getElementsByClassName("item-navigation");
    for(let i = 0; i < itemsNavigation.length; i++){
      itemsNavigation[i].classList.remove("item-nav-active");;
    }

  }


}
