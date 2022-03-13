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
  }

  doLogin() {
    this.authService.login(this.username, this.password).subscribe((response) => { //ako nisu ok podaci, ne ide hide nego mora opet da ukucava!!!!podesi
      console.log(response);
      this.cookie.set('token', response);
      this.resetData(); //dodato
      this.loginModal.hide(); //dodato
      this.router.navigate(['add-model']);
    }, error => {
      console.warn(error); //NETACNI PODACI
    });
  }
  resetData() {
    this.username = '';
    this.password = '';
  }
}
