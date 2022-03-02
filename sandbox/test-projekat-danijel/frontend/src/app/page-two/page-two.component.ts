import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ValuesService } from '../values.service';

@Component({
  selector: 'app-page-two',
  templateUrl: './page-two.component.html',
  styleUrls: ['./page-two.component.css']
})
export class PageTwoComponent implements OnInit {

  colors?: string[];

  constructor(private values: ValuesService, private router: Router) { }

  ngOnInit(): void {
    this.values.getColors().subscribe((colors) => {
      this.colors = colors;
    })
  }

  goToAddColor() {
    this.router.navigate(['']);
  }
}
