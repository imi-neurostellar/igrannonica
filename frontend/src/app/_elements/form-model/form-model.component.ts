import { Component, OnInit ,Input, ViewChild, Output, EventEmitter} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import Shared from 'src/app/Shared';
import Experiment from 'src/app/_data/Experiment';
import Model, { ActivationFunction, LossFunction, LossFunctionBinaryClassification, LossFunctionMultiClassification, LossFunctionRegression, Metrics, MetricsBinaryClassification, MetricsMultiClassification, MetricsRegression, NullValueOptions, Optimizer, ProblemType } from 'src/app/_data/Model';
import { GraphComponent } from '../graph/graph.component';
import {FormGroupDirective, NgForm} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
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
  selectFormControl = new FormControl('', Validators.required);
  nameFormControl = new FormControl('', [Validators.required, Validators.email]);
  selectTypeFormControl=new FormControl('', Validators.required);
  selectOptFormControl=new FormControl('', Validators.required);
  selectLFFormControl=new FormControl('', Validators.required);
  selectLRFormControl=new FormControl('', Validators.required);
  selectEpochFormControl=new FormControl('', Validators.required);
  selectAFFormControl=new FormControl('', Validators.required);
  selectBSFormControl=new FormControl('', Validators.required);

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
  removeLayer(){
    if(this.newModel.hiddenLayers>0)
    {
      this.newModel.hiddenLayers-=1;
    }
    else
    {
      this.newModel.hiddenLayers=this.newModel.hiddenLayers;
    }
    
  }
  addLayer(){
    if(this.newModel.hiddenLayers<12)
    {
      this.newModel.hiddenLayers+=1;
    }
    else
    {
      this.newModel.hiddenLayers=this.newModel.hiddenLayers;
    }
  }
}
