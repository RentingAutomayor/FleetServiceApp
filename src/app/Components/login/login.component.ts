import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../Services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginUserData = { usr_user: '', usr_pass: ''};
  mensajeErrorLogin = '';
  mensajeConfirmacionRecover = '' ;
  mensajeErrorRecover = '';
  session : any = {};
  Access = false;
  recoverReload = true;
  recover = false;

  isAwaiting:boolean;

  constructor(private loginService: LoginService, private router: Router) {
    this.session = JSON.parse(sessionStorage.getItem('sessionUser'))       
    if (this.session == null) {      
      this.Access = false;     
    }else{
      this.Access = true;    
      this.router.navigate([this.session.group.modules[0].path]);  
    }
   }

  ngOnInit(): void {
  }

  loginUser(){    
    this.isAwaiting == true;
    this.mensajeErrorLogin = '';
    this.loginService.loginUser(this.loginUserData)
      .subscribe( (user: any) => {    
        if (user != null && user.usr_id != 0) {
          this.Access = true ;
          sessionStorage.setItem('sessionUser', JSON.stringify(user));       
          this.session = JSON.parse(sessionStorage.getItem('sessionUser'))     
          this.router.navigate([this.session.group.modules[0].path]);  
          this.isAwaiting == false;
        }else{
          this.mensajeErrorLogin = 'La clave o el usuario son incorrectos';  
          this.isAwaiting == false;
        }
      });   
  }

  loadRecover(){
    this.mensajeErrorRecover = '';
    this.recoverReload = true;
    this.recover = true ;
  }

  recoverUser(){   
    this.isAwaiting == true;
    this.mensajeErrorLogin = '';
    this.mensajeErrorRecover = '';
    
    if (this.loginUserData.usr_user == undefined || this.loginUserData.usr_user == '') {
      this.mensajeErrorRecover = 'Ingrese un usuario valido.'
      this.isAwaiting == false;
    }else{
      this.loginService.recoverPass(this.loginUserData)
      .subscribe( (send: any) => {    
        if (send == "ok") {          
          this.recoverReload = false ;
          this.isAwaiting == false;
        }
        
        if (send == "noUser") {
          this.mensajeErrorRecover = 'El usuario no existe';  
          this.isAwaiting == false;
        }

        if (send == "errorMail") {
          this.mensajeErrorRecover = 'Error en el envio del email, intente mas tarde o contacte con el administrador.';  
          this.isAwaiting == false;
        }
      });  
      
    }
     
  }

  back(){
    this.recover = false ;
  }


}
