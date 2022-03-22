import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent implements OnInit {

  username: string = '';
  password: string = '';

  wrongCreds: boolean = false;

  constructor(
    private authService: AuthService,
    private cookie: CookieService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  doLogin() {
    if (this.username.length > 0 && this.password.length > 0) {
      this.authService.login(this.username, this.password).subscribe((response) => {
        console.log(response);

        if (response == "Username doesn't exist" || response == "Wrong password") {
          this.wrongCreds = true;
          this.password = '';
        }
        else {
          this.authService.authenticate(response);
          (<HTMLSelectElement>document.getElementById('closeButton')).click();
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
}
