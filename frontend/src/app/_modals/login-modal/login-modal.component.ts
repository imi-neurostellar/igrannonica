import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/_services/auth.service';
import { ElementRef } from '@angular/core';

declare var window: any;

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent implements OnInit {

  loginModal: any;
  username: string = '';
  password: string = '';

  public wrongCreds: boolean = false;      //RAZMOTRITI

  constructor(
    private authService: AuthService,
    private cookie: CookieService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginModal = new window.bootstrap.Modal(
      document.getElementById("modalForLogin")
    );
  }

  openModal() {
    this.loginModal.show();
    //console.log("ok");
    //(<HTMLInputElement>document.getElementById("exampleModal")).style.display = "block";
  }
  doLogin() {
    this.authService.login(this.username, this.password).subscribe((response) => { //ako nisu ok podaci, ne ide hide nego mora opet da ukucava!!!!podesi
      console.log(response);
      this.cookie.set('token', response);
      this.loginModal.hide(); //dodato
      this.router.navigate(['add-model']);
    });
  }
  sendToRegister() {
    
  }
}
