import { Injectable } from '@angular/core';
import { ActionType } from 'src/app/Models/ActionType';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  actionToDo: ActionType;

  constructor() { }

  setAction(action: ActionType){
    this.actionToDo = action;
  }

  getAction(): ActionType{
    return this.actionToDo;
  }
}
