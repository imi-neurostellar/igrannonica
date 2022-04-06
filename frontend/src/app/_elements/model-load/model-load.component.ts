import { Component, OnInit } from '@angular/core';
import Shared from 'src/app/Shared';
import Model, { ActivationFunction, Encoding, LossFunction, LossFunctionBinaryClassification, LossFunctionMultiClassification, LossFunctionRegression, Metrics, MetricsBinaryClassification, MetricsMultiClassification, MetricsRegression, NullValueOptions, Optimizer, ProblemType } from 'src/app/_data/Model';
import { ModelsService } from 'src/app/_services/models.service';

@Component({
  selector: 'app-model-load',
  templateUrl: './model-load.component.html',
  styleUrls: ['./model-load.component.css']
})
export class ModelLoadComponent implements OnInit {

  newModel: Model = new Model();

  ProblemType = ProblemType;
  Encoding = Encoding;
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
  tempTestSetDistribution = 90;
  lossFunction: any = LossFunction;

  constructor(private models: ModelsService) { }

  ngOnInit(): void {
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

  addModel() {
    this.getMetrics();

    this.newModel.randomTestSetDistribution = 1 - Math.round(this.tempTestSetDistribution / 100 * 10) / 10;
    this.newModel.username = Shared.username;

    this.models.addModel(this.newModel).subscribe((response) => {
      Shared.openDialog('Model dodat', 'Model je uspešno dodat u bazu.');
      // treba da se selektuje nov model u listi modela
    }, (error) => {
      Shared.openDialog('Greška', 'Model sa unetim nazivom već postoji u Vašoj kolekciji.\nPromenite naziv modela i nastavite sa kreiranim datasetom.');
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
}
