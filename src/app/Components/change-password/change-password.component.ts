import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  recoverReload = true;
  loginUserData = { usr_user: '', usr_pass: '', usr_conf_pass: ''};
  mensajeErrorRecover = '';
  isAwaiting:boolean;
  Access = false;
  
  constructor() { 
    debugger;
  }

  ngOnInit(): void {
  }

  changePass(){

  }

}
