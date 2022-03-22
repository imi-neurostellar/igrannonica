import { Component, OnInit } from '@angular/core';
import User from 'src/app/_data/User';
import { UserInfoService } from 'src/app/_services/user-info.service';

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

  constructor(private userInfoService: UserInfoService) { }

  ngOnInit(): void {
    this.userInfoService.getUsersInfo().subscribe((response) => {

      this.user = response;

      this.user.password = 'sonja123';

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
      this.newPass1 = '';
      this.newPass2 = '';
      console.log("Netacno ponovljena lozinka");
      return;
    }

    this.wrongPassBool = false;
    this.wrongNewPassBool = false;

    this.userInfoService.changeUserPassword(this.oldPass, this.newPass1).subscribe((response) => {
      this.user = response;
      console.log(this.user);
    }, (error: any) => {

    });
  }

}
