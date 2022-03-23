import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import User from 'src/app/_data/User';
import { UserInfoService } from 'src/app/_services/user-info.service';
import { AuthService } from 'src/app/_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: User = new User();

  username: string = '';
  email: string = '';
  firstName : string = '';
  lastName : string = '';
  oldPass: string = '';
  newPass1: string = '';
  newPass2: string = '';
  photoId: string = '';

  wrongPassBool: boolean = false;
  wrongNewPassBool: boolean = false;

  constructor(private userInfoService: UserInfoService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.userInfoService.getUserInfo().subscribe((response) => {

      this.user = response;

      this.username = this.user.username;
      this.email = this.user.email;
      this.firstName = this.user.firstName;
      this.lastName = this.user.lastName;
      this.photoId = this.user.photoId;
      console.log(this.user);
    });
  }

  saveInfoChanges() {
    let editedUser: User = {
      _id: this.user._id,
      username: this.username,
      email: this.email,
      password: this.user.password,
      firstName: this.firstName,
      lastName: this.lastName,
      photoId: "1"
    }

    this.userInfoService.changeUserInfo(editedUser).subscribe((response: any) =>{
      if (this.user.username != editedUser.username) { //promenio username, ide logout
        this.user = editedUser;
        alert("Nakon promene korisničkog imena, moraćete ponovo da se ulogujete.");
        this.authService.logOut();
        this.router.navigate(['']);
        return;
      }
      this.user = editedUser;
      console.log(this.user);
    }, (error: any) =>{
      console.log(error);
    });
  }

  savePasswordChanges() {
    if (this.newPass1 == '' && this.newPass2 == '') //ne zeli da promeni lozinku
      return;
    console.log("zeli da promeni lozinku");
    if (this.newPass1 != this.newPass2) { //netacno ponovio novu lozinku
      this.wrongNewPassBool = true;
      this.resetNewPassInputs();
      console.log("Netacno ponovljena lozinka");
      return;
    }

    this.wrongPassBool = false;
    this.wrongNewPassBool = false;

    let passwordArray: string[] = [this.oldPass, this.newPass1];
    this.userInfoService.changeUserPassword(passwordArray).subscribe((response: any) => {
      console.log("PROMENIO LOZINKU");
      this.resetNewPassInputs();
      alert("Nakon promene lozinke, moraćete ponovo da se ulogujete.");
      this.authService.logOut();
      this.router.navigate(['']);
    }, (error: any) => {
      console.log("error poruka: ", error.error);
      if (error.error == 'Wrong old password!') {
        this.wrongPassBool = true;
        (<HTMLSelectElement>document.getElementById("inputPassword")).focus();
        return;
      }
      else if (error.error == 'Identical password!') {
        alert("Stara i nova lozinka su identične.");
        this.resetNewPassInputs();
        (<HTMLSelectElement>document.getElementById("inputNewPassword")).focus();
        return;
      }
    });
  }

  resetNewPassInputs() {
    this.newPass1 = '';
    this.newPass2 = '';
  }

}
