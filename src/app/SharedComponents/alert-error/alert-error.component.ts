import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert-error',
  templateUrl: './alert-error.component.html',
  styleUrls: ['./alert-error.component.scss']
})
export class AlertErrorComponent implements OnInit {

  title: string = '';
  @Input('title')
  set setTitle(title:string){
    this.title = title;
  }

  errorMessage: string = '';
  @Input('errorMessage')
  set setErrorMessage(msg: string){
    this.errorMessage = msg;
  }

  @Output() onAlertWasClose = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  closeAlert(){
    this.onAlertWasClose.emit(true);
  }

}
