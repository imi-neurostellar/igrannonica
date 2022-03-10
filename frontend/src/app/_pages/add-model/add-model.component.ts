import { Component, OnInit } from '@angular/core';
import Model from 'src/app/_data/Model';
import { ANNType, Encoding, ActivationFunction, LossFunction, Optimizer } from 'src/app/_data/Model';

@Component({
  selector: 'app-add-model',
  templateUrl: './add-model.component.html',
  styleUrls: ['./add-model.component.css']
})
export class AddModelComponent implements OnInit {

  newModel: Model

  ANNType = ANNType;
  Encoding = Encoding;
  ActivationFunction = ActivationFunction;
  LossFunction = LossFunction;
  Optimizer = Optimizer;
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
