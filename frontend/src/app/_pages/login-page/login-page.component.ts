import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  //email: string = '';
  username: string = '';
  password: string = '';

  public wrongCreds: boolean = false;      //RAZMOTRITI
  //public notApproved: boolean = false;     //RAZMOTRITI

  //pattEmail: RegExp = /^[a-zA-Z0-9]+([\.\-\+][a-zA-Z0-9]+)*\@([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}$/;

  constructor(
    private authService: AuthService,
    private cookie: CookieService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    /*if (!this.pattEmail.test(this.email)) {
      console.warn('Bad email!');
      return;
    }
    else {*/
    this.authService.login(this.username, this.password).subscribe((response) => {
      console.log(response);
      this.cookie.set('token', response);
      this.router.navigate(['add-model']);
      //  })
    });
  }

}
