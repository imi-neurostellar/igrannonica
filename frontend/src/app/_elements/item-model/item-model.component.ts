import { Component, Input, OnInit } from '@angular/core';
import Model from 'src/app/_data/Model';

@Component({
  selector: 'app-item-model',
  templateUrl: './item-model.component.html',
  styleUrls: ['./item-model.component.css']
})
export class ItemModelComponent implements OnInit {

  @Input() model: Model = new Model();

  constructor() { }

  ngOnInit(): void {
  }

}
