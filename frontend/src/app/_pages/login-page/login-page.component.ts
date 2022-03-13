import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/_services/auth.service';

import { LoginModalComponent } from 'src/app/_modals/login-modal/login-modal.component';
import { MDBModalRef, MDBModalService } from 'ng-uikit-pro-standard';


declare var window: any;

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  
})
export class LoginPageComponent{

  modalRef?: MDBModalRef;

  //email: string = '';
  username: string = '';
  password: string = '';

  public wrongCreds: boolean = false;      //RAZMOTRITI
  //public notApproved: boolean = false;     //RAZMOTRITI

  formModal: any;

  constructor(
    private authService: AuthService,
    private cookie: CookieService,
    private router: Router,
    private modalService: MDBModalService
  ) { }

  openModal() {
    //this.modalRef = this.modalService.show(LoginModalComponent);
  }
  /*
  ngOnInit(): void {
    this.formModal = new window.bootstrap.Modal(
      document.getElementById("exampleModal")
    );
  }

  openModal() {
    this.formModal.show();
    //console.log("ok");
    //(<HTMLInputElement>document.getElementById("exampleModal")).style.display = "block";
  }

  onSubmit() {

    this.authService.login(this.username, this.password).subscribe((response) => {
      console.log(response);
      this.cookie.set('token', response);
      this.router.navigate(['add-model']);
    });
  }
*/
}
