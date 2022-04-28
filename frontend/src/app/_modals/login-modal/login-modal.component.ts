import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/_services/auth.service';
import { UserInfoService } from 'src/app/_services/user-info.service';
import shared from '../../Shared';
import {AfterViewInit, ElementRef} from '@angular/core';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent implements OnInit {

  @ViewChild('closeButton') closeButton?: ElementRef;
  @ViewChild('pass') passwordInput!: ElementRef;

  username: string = '';
  password: string = '';

  passwordShown: boolean = false;

  wrongCreds: boolean = false;

  constructor(
    private authService: AuthService,
    private cookie: CookieService,
    private router: Router,
    private userInfoService: UserInfoService
  ) { }

  ngOnInit(): void {
  }

  doLogin() {
    if (this.username.length > 0 && this.password.length > 0) {
      this.authService.login(this.username, this.password).subscribe((response) => {

        if (response == "Username doesn't exist" || response == "Wrong password") {
          this.wrongCreds = true;
          this.password = '';
          this.passwordShown = false;
          this.passwordInput.nativeElement.type = "password";
        }
        else {
          this.authService.authenticate(response);
          (<HTMLSelectElement>this.closeButton?.nativeElement).click();
          this.userInfoService.getUserInfo().subscribe((response) => {
            shared.photoId = response.photoId;
          });
        }
      });
    }
    else {
      this.wrongCreds = true;
      this.password = '';
    }
  }
  resetData() {
    this.wrongCreds = false;
    this.username = '';
    this.password = '';
  }

  togglePasswordShown() {
    this.passwordShown = !this.passwordShown;

    if (this.passwordShown)
      this.passwordInput.nativeElement.type = "text";
    else 
      this.passwordInput.nativeElement.type = "password";
  }
}
