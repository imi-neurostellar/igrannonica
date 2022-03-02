import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private router:Router, private cookie:CookieService) { }

  ngOnInit(): void {
  }

  pocetna()
  {
    this.router.navigate(["/homepage"])
  }

  dodaj()
  {
    this.router.navigate(["/newLaptop"])
  }

}
