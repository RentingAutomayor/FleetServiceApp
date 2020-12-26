import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../Services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginUserData = { user: '', password: ''};
  mensajeErrorLogin = '';
  Access = false;

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
  }

  loginUser(){

    this.loginService.loginUser(this.loginUserData)
      .subscribe( (user: any) => {
        if (user != null) {
          localStorage.setItem('sessionUser', JSON.stringify(user));
          this.Access = true ;
        }else{
          this.mensajeErrorLogin = 'El usuario no fue encontrado';  
        }
      });   
  }

}
