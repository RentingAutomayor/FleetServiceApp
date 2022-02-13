import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationService } from '../../Services/Navigation/navigation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit{
  constructor(private navigationService: NavigationService,
              private router: Router) {
                    this.loadApp();
   }
  containerMenu: HTMLDivElement;
  @Output() showCloseMenu = new EventEmitter<boolean>();

  session: any;
  moduleFathers: any[] = [];

  ngOnInit(): void {
    this.initComponents();
  }
  loadApp(){
    this.session = JSON.parse(sessionStorage.getItem('sessionUser'));
    if (this.session == null) {
      this.router.navigate(['Login']);
    }
    this.session.group.modules.forEach(element => {
      if (element.id_moduleF == 0) {
        this.moduleFathers.push(element);
      }
    });


  }

  initComponents() {
    this.containerMenu = document.querySelector('#container__menu');
  }







}
