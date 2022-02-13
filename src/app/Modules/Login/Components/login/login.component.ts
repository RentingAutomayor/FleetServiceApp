import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../Services/Login/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginUserData = { user: '', password: ''};
  mensajeErrorLogin = '';
  Access = false;

  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  loginUser(){
    this.loginService.loginUser(this.loginUserData)
      .subscribe( (user: any) => {
        if (user != null) {
          sessionStorage.setItem('sessionUser', JSON.stringify(user));
          this.router.navigate(['/Home']);
        }else{
          this.mensajeErrorLogin = 'El usuario no fue encontrado';
        }
      });
  }

}
