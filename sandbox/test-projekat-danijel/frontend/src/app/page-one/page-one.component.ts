import { Component, OnInit } from '@angular/core';
import { ValuesService } from '../values.service';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-one',
  templateUrl: './page-one.component.html',
  styleUrls: ['./page-one.component.css']
})
export class PageOneComponent implements OnInit {

  red: number = 255;
  green: number = 255;
  blue: number = 255;

  color = '#ffffff';

  constructor(private values: ValuesService, private router: Router) { }

  ngOnInit(): void {
  }

  submit() {
    console.log(this.red + ':' + this.green + ':' + this.blue);
    this.values.addColor(this.red, this.green, this.blue).subscribe((color) => {
      console.log(color);
      this.color = color;
    })
  }

  goToColors() {
    this.router.navigate(['boje'])
  }

}
