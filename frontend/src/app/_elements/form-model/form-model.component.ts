import { Component, OnInit, Input, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import Shared from 'src/app/Shared';
import Experiment from 'src/app/_data/Experiment';
import Model, { Layer, ActivationFunction, LossFunction, LearningRate, LossFunctionBinaryClassification, LossFunctionMultiClassification, LossFunctionRegression, Metrics, MetricsBinaryClassification, MetricsMultiClassification, MetricsRegression, NullValueOptions, Optimizer, ProblemType, Regularisation, RegularisationRate, BatchSize } from 'src/app/_data/Model';
import { GraphComponent } from '../graph/graph.component';
import { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'app-form-model',
  templateUrl: './form-model.component.html',
  styleUrls: ['./form-model.component.css']
})
export class FormModelComponent implements AfterViewInit {
  @ViewChild(GraphComponent) graph!: GraphComponent;
  @Input() forExperiment!: Experiment;
  @Output() selectedModelChangeEvent = new EventEmitter<Model>();
  @Input() hideProblemType: boolean;
  @Input() forProblemType: ProblemType;
  testSetDistribution: number = 70;
  validationSize: number = 15;
  constructor() {
    this.hideProblemType = false;
    this.forProblemType = ProblemType.BinaryClassification;
  }

  ngAfterViewInit(): void { }

  selectFormControl = new FormControl('', Validators.required);
  nameFormControl = new FormControl('', [Validators.required, Validators.email]);
  selectTypeFormControl = new FormControl('', Validators.required);
  selectOptFormControl = new FormControl('', Validators.required);
  selectLFFormControl = new FormControl('', Validators.required);
  selectLRFormControl = new FormControl('', Validators.required);
  selectEpochFormControl = new FormControl('', Validators.required);
  selectAFFormControl = new FormControl('', Validators.required);
  selectBSFormControl = new FormControl('', Validators.required);
  selectActivationFormControl = new FormControl('', Validators.required);
  selectRegularisationFormControl = new FormControl('', Validators.required);
  selectRRateFormControl = new FormControl('', Validators.required);

  newModel!: Model;

  selectedModel?: Model;

  ProblemType = ProblemType;
  ActivationFunction = ActivationFunction;
  RegularisationRate = RegularisationRate;
  Regularisation = Regularisation;
  metrics: any = Metrics;
  LossFunction = LossFunction;
  Optimizer = Optimizer;
  BatchSize = BatchSize;
  Object = Object;
  document = document;
  shared = Shared;
  LearningRate = LearningRate;
  Layer = Layer;

  term: string = "";
  selectedMetrics = [];
  lossFunctions: { [index: string]: LossFunction[] } = {
    [ProblemType.Regression]: LossFunctionRegression,
    [ProblemType.BinaryClassification]: LossFunctionBinaryClassification,
    [ProblemType.MultiClassification]: LossFunctionMultiClassification
  };

  loadModel(model: Model) {
    this.newModel = model;
    this.forProblemType = model.type;
  }

  updateGraph() {
    //console.log(this.newModel.layers);
    this.graph.update();
  }

  removeLayer() {
    if (this.newModel.hiddenLayers > 1) {
      this.newModel.layers.splice(this.newModel.layers.length - 1, 1);
      this.newModel.hiddenLayers -= 1;
      this.updateGraph();
    }
  }

  addLayer() {
    if (this.newModel.hiddenLayers < 150) {
      this.newModel.layers.push(new Layer(this.newModel.layers.length, this.selectedActivation, this.selectedNumberOfNeurons, this.selectedRegularisation, this.selectedRegularisationRate));

      this.newModel.hiddenLayers += 1;
      this.updateGraph();
    }
  }

  numSequence(n: number): Array<number> {
    return Array(n);
  }

  removeNeuron(index: number) {
    if (this.newModel.layers[index].neurons > 1) {
      this.newModel.layers[index].neurons -= 1;
      this.updateGraph();
    }
  }

  addNeuron(index: number) {
    if (this.newModel.layers[index].neurons < 18) {
      this.newModel.layers[index].neurons += 1;
      this.updateGraph();
    }
  }

  selectedActivation: ActivationFunction = ActivationFunction.Sigmoid;
  selectedRegularisationRate: RegularisationRate = RegularisationRate.RR1;
  selectedRegularisation: Regularisation = Regularisation.L1;
  selectedNumberOfNeurons: number = 3;

  changeAllActivation() {
    for (let i = 0; i < this.newModel.layers.length; i++) {
      this.newModel.layers[i].activationFunction = this.selectedActivation;
    }
  }
  changeAllRegularisation() {
    for (let i = 0; i < this.newModel.layers.length; i++) {
      this.newModel.layers[i].regularisation = this.selectedRegularisation;
    }
  }
  changeAllRegularisationRate() {
    for (let i = 0; i < this.newModel.layers.length; i++) {
      this.newModel.layers[i].regularisationRate = this.selectedRegularisationRate;
    }
  }
  changeAllNumberOfNeurons() {
    for (let i = 0; i < this.newModel.layers.length; i++) {
      this.newModel.layers[i].neurons = this.selectedNumberOfNeurons;
      this.updateGraph();
    }
  }
  updateTestSet(event: MatSliderChange) {
    this.testSetDistribution = event.value!;
  }

  getInputColumns() {
    if (this.forExperiment)
      return this.forExperiment.inputColumns.filter(x => x != this.forExperiment.outputColumn);
    else
      return ['Nisu odabrane ulazne kolone.']
  }

  updateValidation(event: MatSliderChange) {
    this.validationSize = event.value!;
  }
}
