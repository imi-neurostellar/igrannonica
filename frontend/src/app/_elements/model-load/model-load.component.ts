import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import Shared from 'src/app/Shared';
import Experiment from 'src/app/_data/Experiment';
import Model, { ActivationFunction, LossFunction, LossFunctionBinaryClassification, LossFunctionMultiClassification, LossFunctionRegression, Metrics, MetricsBinaryClassification, MetricsMultiClassification, MetricsRegression, NullValueOptions, Optimizer, ProblemType } from 'src/app/_data/Model';
import { AuthService } from 'src/app/_services/auth.service';
import { ModelsService } from 'src/app/_services/models.service';
import { GraphComponent } from '../graph/graph.component';


@Component({
  selector: 'app-model-load',
  templateUrl: './model-load.component.html',
  styleUrls: ['./model-load.component.css']
})
export class ModelLoadComponent implements OnInit {

  @ViewChild(GraphComponent) graph!: GraphComponent;
  @Input() forExperiment?: Experiment;
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
  selectedMetrics = [];
  lossFunction: any = LossFunction;

  showMyModels: boolean = true;

  batchSizePower: number = 2;

  constructor(private modelsService: ModelsService, private authService: AuthService) {
    //console.log("forExperiment = ", this.forExperiment);
    this.fetchModels();

    this.authService.loggedInEvent.subscribe(_ => {
      this.fetchModels();
    })
  }

  fetchModels() {
    //if (this.forExperiment == undefined) {
    this.modelsService.getMyModels().subscribe((models) => {
      this.myModels = models;
    });
    /*}
    else {
      this.modelsService.getMyModelsByType(ProblemType.Regression).subscribe((models) => {
        this.myModels = models;
        //console.log("modeli po tipu: ", this.myModels);
      });
    }*/
  }

  ngOnInit(): void {
  }

  updateBatchSize() {
    this.newModel.batchSize = 2 ** this.batchSizePower;
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

    this.newModel.uploaderId = Shared.userId;

    this.modelsService.addModel(this.newModel).subscribe((response) => {
      Shared.openDialog('Model dodat', 'Model je uspešno dodat u bazu.');
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
