import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent {

  @Input() items: any[] = [];
  @Input() type: string = "Object";

  constructor() { }

  ngOnInit(): void {
  }

}
