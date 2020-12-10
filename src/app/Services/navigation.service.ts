import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private itemActive:string;

  constructor() { }

  getItemActive():string{
    return this.itemActive;
  }

  setItemActive(pItem:string){
    this.itemActive = pItem;
  }
}
