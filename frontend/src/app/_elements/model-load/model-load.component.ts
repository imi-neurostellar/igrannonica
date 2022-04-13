import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import Shared from 'src/app/Shared';
import Model, { ActivationFunction, LossFunction, LossFunctionBinaryClassification, LossFunctionMultiClassification, LossFunctionRegression, Metrics, MetricsBinaryClassification, MetricsMultiClassification, MetricsRegression, NullValueOptions, Optimizer, ProblemType } from 'src/app/_data/Model';
import { ModelsService } from 'src/app/_services/models.service';
import { GraphComponent } from '../graph/graph.component';


@Component({
  selector: 'app-model-load',
  templateUrl: './model-load.component.html',
  styleUrls: ['./model-load.component.css']
})
export class ModelLoadComponent implements OnInit {

  @ViewChild(GraphComponent) graph!: GraphComponent;
  @Output() selectedModelChangeEvent = new EventEmitter<Model>();

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
  selectedProblemType: string = '';
  selectedMetrics = [];
  lossFunction: any = LossFunction;

  showMyModels: boolean = true;

  constructor(private modelsService: ModelsService) {
    this.modelsService.getMyModels().subscribe((models) => {
      this.myModels = models;
    });
  }

  ngOnInit(): void {
  }

  updateGraph() {
    this.graph.update();
  }

  getMetrics() {
    this.newModel.metrics = [];
    let cb = document.getElementsByName("cbmetrics");

    for (let i = 0; i < cb.length; i++) {
      let chb = <HTMLInputElement>cb[i];
      if (chb.checked == true)
        this.newModel.metrics.push(chb.value);
    }
  }

  uploadModel() {
    this.getMetrics();

    this.newModel.username = Shared.username;

    this.modelsService.addModel(this.newModel).subscribe((response) => {
      Shared.openDialog('Model dodat', 'Model je uspešno dodat u bazu.');
      // treba da se selektuje nov model u listi modela
      //this.selectedModel = 
    }, (error) => {
      Shared.openDialog('Greška', 'Model sa unetim nazivom već postoji u Vašoj kolekciji. Promenite naziv modela i nastavite sa kreiranim datasetom.');
    });
  }

  filterOptions() {
    switch (this.newModel.type) {
      case 'regresioni':
        this.lossFunction = LossFunctionRegression;
        this.metrics = MetricsRegression;
        break;
      case 'binarni-klasifikacioni':
        this.lossFunction = LossFunctionBinaryClassification;
        this.metrics = MetricsBinaryClassification;
        break;
      case 'multi-klasifikacioni':
        this.lossFunction = LossFunctionMultiClassification;
        this.metrics = MetricsMultiClassification;
        break;
      default:
        break;
    }
  }

  viewMyModelsForm() {
    this.showMyModels = true;
  }
  viewNewModelForm() {
    this.showMyModels = false;
  }

  selectThisModel(model: Model) {
    this.selectedModel = model;
    this.selectedModelChangeEvent.emit(this.selectedModel);
  }

}
