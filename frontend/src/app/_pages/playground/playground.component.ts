import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.css']
})
export class PlaygroundComponent implements OnInit {

  animateBackground = true;
  backgroundFill = 1.0;

  constructor(private cookie: CookieService) { }

  updateBGPrefs() {
    this.cookie.set('animateBackground', "" + this.animateBackground);
    this.cookie.set('backgroundFill', "" + this.backgroundFill);
    console.log(this.animateBackground, this.backgroundFill);
  }

  ngOnInit(): void {
    if (this.cookie.check('animateBackground')) {
      this.animateBackground = this.cookie.get('animateBackground') == 'true';
    }
    if (this.cookie.check('backgroundFill')) {
      this.backgroundFill = parseFloat(this.cookie.get('backgroundFill'));
    }
  }

}
