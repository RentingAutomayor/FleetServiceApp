import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../Services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginUserData = { user: '', password: ''};
  Access = false;

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
  }

  loginUser(){
    console.log(this.loginUserData);

    this.loginService.loginUser(this.loginUserData)
      .subscribe(
        res => console.log(res),
        err => console.log(err)
      );

    this.Access = true;
  }

}
