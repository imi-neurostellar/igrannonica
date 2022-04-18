import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Shared from '../Shared';
import Experiment from '../_data/Experiment';
import Model from '../_data/Model';
import { ExperimentsService } from '../_services/experiments.service';
import { ModelsService } from '../_services/models.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit{

  myExperiments?: Experiment[];
  selectedExperiment?: Experiment;
  selectedModel?: Model;

  trainingResult: any;

  term: string = "";

  constructor(private modelsService: ModelsService, private route: ActivatedRoute, private experimentsService: ExperimentsService) { 
  }

  ngOnInit(): void { 
    this.route.queryParams.subscribe(params => {
      let expId =this.route.snapshot.paramMap.get("id");

      this.experimentsService.getMyExperiments().subscribe((experiments) => {
        this.myExperiments = experiments;
        this.selectedExperiment = this.myExperiments.filter(x => x._id == expId)[0];
      });
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
      //console.log('Train model complete!', response);
      Shared.openDialog("Obaveštenje", "Treniranje modela je uspešno završeno!");
      this.trainingResult = response;
    });
  }
}
