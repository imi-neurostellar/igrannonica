import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { response } from 'express';
import { AuthService } from 'src/app/_services/auth.service';
//import { LoginService } from 'src/app/_services/login.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  email: string = '';
  password: string = '';

  public wrongCreds: boolean = false;      //RAZMOTRITI
  //public notApproved: boolean = false;     //RAZMOTRITI

  pattEmail: RegExp = /^[a-zA-Z0-9]+([\.\-\+][a-zA-Z0-9]+)*\@([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}$/;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    if (!this.pattEmail.test(this.email)) {
      console.warn('Bad email!');
      return;
    }
    else {
      this.authService.login(this.email, this.password).subscribe((response) => {
        console.log(response)
      })
    }
  }

}
