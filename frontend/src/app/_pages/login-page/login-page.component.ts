import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
//import { LoginService } from 'src/app/_services/login.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  public pageLoaded: boolean = false; //ako korisnik ne sme da ima pristup stranici (vec je ulogovan itd), ona ne sme ni da se ucita
  email: string = '';
  password: string = '';

  public wrongCreds: boolean = false;      //RAZMOTRITI
  //public notApproved: boolean = false;     //RAZMOTRITI

  pattEmail: RegExp = /^[a-zA-Z0-9]+([\.\-\+][a-zA-Z0-9]+)*\@([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}$/;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
    //private loginService: LoginService
  ) { }

  ngOnInit(): void {
    /*this.authService.checkAccess(this.activatedRoute, this,
      (self: any) => self.pageLoaded = true;
      );*/
  }

  onSubmit() {
    //this.wrongCreds = false;      
    //this.notApproved = false;     RAZMOTRITI

    if (this.pattEmail.test(this.email)) {
      //this.loginService.login(this.email, this.password);
    }
    else {
      //this.wrongCreds = true;     
    }
  }

}
