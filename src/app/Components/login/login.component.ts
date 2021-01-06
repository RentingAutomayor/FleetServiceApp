import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../Services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginUserData = { user: '', password: ''};
  mensajeErrorLogin = '';
  session : any = {};
  Access = false;

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
    this.mensajeErrorLogin = '';
    this.loginService.loginUser(this.loginUserData)
      .subscribe( (user: any) => {    
        if (user != null && user.idUser != 0) {
          this.Access = true ;
          sessionStorage.setItem('sessionUser', JSON.stringify(user));       
          this.session = JSON.parse(sessionStorage.getItem('sessionUser'))     
          this.router.navigate([this.session.group.modules[0].path]);  
        }else{
          this.mensajeErrorLogin = 'La clave o el usuario son incorrectos';  
        }
      });   
  }

}
