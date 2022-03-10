import { Component, OnInit } from '@angular/core';
import Model from 'src/app/_data/Model';
import { ANNType } from 'src/app/_data/Model';

@Component({
  selector: 'app-add-model',
  templateUrl: './add-model.component.html',
  styleUrls: ['./add-model.component.css']
})
export class AddModelComponent implements OnInit {

  newModel: Model
  ANNType = ANNType;
  Object = Object;

  constructor() {
    this.newModel = new Model();
  }

  ngOnInit(): void {
  }

  addModel() {
    //TODO
  }

}
