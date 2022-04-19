import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Shared from '../Shared';
import Experiment from '../_data/Experiment';
import Model, { ProblemType } from '../_data/Model';
import { ModelLoadComponent } from '../_elements/model-load/model-load.component';
import { AuthService } from '../_services/auth.service';
import { ExperimentsService } from '../_services/experiments.service';
import { ModelsService } from '../_services/models.service';
import { SignalRService } from '../_services/signal-r.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit {

  @ViewChild(ModelLoadComponent) modelLoadComponent?: ModelLoadComponent;
  @ViewChild("trainButton") trainButtonRef!: ElementRef;
  

  myExperiments?: Experiment[];
  selectedExperiment?: Experiment;
  selectedModel?: Model;

  trainingResult: any;

  term: string = "";

  constructor(private modelsService: ModelsService, private route: ActivatedRoute, private experimentsService: ExperimentsService, private authService: AuthService, private signalRService: SignalRService) {
    if (this.signalRService.hubConnection) {
      this.signalRService.hubConnection.on("NotifyEpoch", (mName: string, mId: string, stat: string, totalEpochs: number, currentEpoch: number) => {
        if (this.selectedModel?._id == mId) {
          this.trainingResult = stat;
        }
      });
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let experimentId = this.route.snapshot.paramMap.get("id");

      this.fetchExperiments(experimentId);

      this.authService.loggedInEvent.subscribe(_ => {
        this.fetchExperiments(experimentId);

        this.signalRService.startConnection()
      });
    });
  }

  fetchExperiments(andSelectWithId: string | null = '') {
    this.experimentsService.getMyExperiments().subscribe((experiments) => {
      this.myExperiments = experiments;

      this.selectedExperiment = this.myExperiments.filter(x => x._id == andSelectWithId)[0];
    });
  }

  selectThisExperiment(experiment: Experiment) {
    this.selectedExperiment = experiment;
    if (this.modelLoadComponent)
      this.modelLoadComponent.newModel.type = this.selectedExperiment.type;
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
    this.trainButtonRef.nativeElement.disabled = true;
    this.modelsService.trainModel(this.selectedModel._id, this.selectedExperiment._id).subscribe((response: any) => {
      //console.log('Train model complete!', response);
      this.trainButtonRef.nativeElement.disabled = false;
      Shared.openDialog("Obaveštenje", "Treniranje modela je uspešno završeno!");
      this.trainingResult = response;
    });
  }
}
