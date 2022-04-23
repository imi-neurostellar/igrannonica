import { Component, OnInit ,Input, ViewChild, Output, EventEmitter} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import Shared from 'src/app/Shared';
import Experiment from 'src/app/_data/Experiment';
import Model, { ActivationFunction, LossFunction, LossFunctionBinaryClassification, LossFunctionMultiClassification, LossFunctionRegression, Metrics, MetricsBinaryClassification, MetricsMultiClassification, MetricsRegression, NullValueOptions, Optimizer, ProblemType } from 'src/app/_data/Model';
import { GraphComponent } from '../graph/graph.component';
@Component({
  selector: 'app-form-model',
  templateUrl: './form-model.component.html',
  styleUrls: ['./form-model.component.css']
})
export class FormModelComponent implements OnInit {
  @ViewChild(GraphComponent) graph!: GraphComponent;
  @Input() forExperiment?: Experiment;
  @Output() selectedModelChangeEvent = new EventEmitter<Model>();

  constructor() { }
  
  ngOnInit(): void {
  }
  animalControl = new FormControl('', Validators.required);
  selectFormControl = new FormControl('', Validators.required);
  /*animals: Animal[] = [
    {name: 'Dog', sound: 'Woof!'},
    {name: 'Cat', sound: 'Meow!'},
    {name: 'Cow', sound: 'Moo!'},
    {name: 'Fox', sound: 'Wa-pa-pa-pa-pa-pa-pow!'},
  ];
  */
  newModel: Model = new Model();
  myModels?: Model[];
  selectedModel?: Model;

  ProblemType = ProblemType;
  ActivationFunction = ActivationFunction;
  metrics: any = Metrics;
  LossFunction = LossFunction;
  Optimizer = Optimizer;
  Object = Object;
  document = document;
  shared = Shared;

  term: string = "";
  selectedMetrics = [];
  lossFunction: any = LossFunction;

  showMyModels: boolean = true;

  batchSizePower: number = 2;

  updateGraph() {
    this.graph.update();
  }
}
