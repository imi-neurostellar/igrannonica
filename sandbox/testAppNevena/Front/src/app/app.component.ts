import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { Serve1Service } from './serve1.service';//

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'project';
  a = 0;
  b = 0;
  Sum = "";


  constructor(private serve1: Serve1Service, private router: Router) { } //
  
  sumNumbers() {
    console.log(this.a + ':' + this.b);
    // za slanje back-u, subscribe - asinhrono
    this.serve1.sendNumbers(this.a, this.b).subscribe((serviceSum) => {
      console.log(serviceSum);
      this.Sum = serviceSum;
    })
  }
}