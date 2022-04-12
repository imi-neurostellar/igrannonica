import { Component, OnInit } from '@angular/core';
import Shared from '../Shared';
import Experiment from '../_data/Experiment';
import Model from '../_data/Model';
import { DatasetsService } from '../_services/datasets.service';
import { ExperimentsService } from '../_services/experiments.service';
import { ModelsService } from '../_services/models.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent{

  myExperiments?: Experiment[];
  selectedExperiment?: Experiment;
  selectedModel?: Model;

  trainingResult: any;

  term: string = "";

  constructor(private modelsService: ModelsService, private datasetsService: DatasetsService, private experimentsService: ExperimentsService) { 
    this.experimentsService.getMyExperiments().subscribe((experiments) => {
      this.myExperiments = experiments;
      console.log(this.myExperiments);
    });
  }

  selectThisExperiment(experiment: Experiment) {
    this.selectedExperiment = experiment;
  }

  selectModel(model: Model) {
    this.selectedModel = model;
  }

  trainModel() {
    this.trainingResult = undefined;

    if (this.selectedExperiment == undefined) {
      Shared.openDialog("Greška", "Molimo Vas da izaberete eksperiment iz kolekcije.");
      return;
    }
    if (this.selectedModel == undefined) {
      Shared.openDialog("Greška", "Molimo Vas da izaberete model.");
      return;
    }
    this.modelsService.trainModel(this.selectedModel._id, this.selectedExperiment._id).subscribe((response: any) => {
      console.log('Train model complete!', response);
      this.trainingResult = response;
    });
  }
}
