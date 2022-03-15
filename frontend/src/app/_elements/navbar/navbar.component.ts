import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../../_services/auth.service';
import shared from 'src/app/Shared';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  currentUrl: string;
  shared = shared;

  constructor(public location: Location, private auth: AuthService) {
    this.currentUrl = this.location.path();
    this.location.onUrlChange(() => {
      this.currentUrl = this.location.path();
    })
  }

  ngOnInit(): void {
    this.auth.updateUser();
  }

  logOut() {
    this.auth.logOut();
  }
}
