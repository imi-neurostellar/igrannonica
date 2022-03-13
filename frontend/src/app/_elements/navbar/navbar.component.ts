import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  currentUrl: string;

  constructor(public location: Location) {
    this.currentUrl = this.location.path();
    this.location.onUrlChange(() => {
      this.currentUrl = this.location.path();
    })
  }

  ngOnInit(): void {
  }

}
