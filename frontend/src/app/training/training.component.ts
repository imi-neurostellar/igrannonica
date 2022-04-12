import { Component, OnInit } from '@angular/core';
import Experiment from '../_data/Experiment';
import Model from '../_data/Model';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  selectedExperiment?: Experiment;
  selectedModel?: Model;

  trainingResult: any;

  selectModel($model: Model) {

  }

  trainModel() {
    //eksperiment i model moraju da budu izabrani
  }
}
