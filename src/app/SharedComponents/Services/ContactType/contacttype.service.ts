import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContactTypeService {

  @Output() dispContactType : EventEmitter<any> = new EventEmitter();


}
