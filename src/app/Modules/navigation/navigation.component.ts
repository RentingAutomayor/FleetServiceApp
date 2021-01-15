import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationService } from '../../Services/navigation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit{
  containerMenu: HTMLDivElement;
  @Output() showCloseMenu = new EventEmitter<boolean>();
  constructor(private navigationService: NavigationService,
              private router: Router) {
                    this.loadApp();
   }

  ngOnInit(): void {    
    this.initComponents();
  }

  session: any;
  moduleFathers: any[] = [];
  loadApp(){    
    this.session = JSON.parse(localStorage.getItem('sessionUser'))    
    if (this.session == null) {      
      this.router.navigate(['Login']);      
    }
    this.session.group.modules.forEach(element => {
      if (element.id_moduleF == 0) {
        this.moduleFathers.push(element);  
      }      
    });    

    console.log(this.moduleFathers);
  }

  initComponents() {
    this.containerMenu = document.querySelector("#container__menu");   
  }







}
