import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Shared from '../Shared';
import Experiment from '../_data/Experiment';
import Model, { ProblemType } from '../_data/Model';
import { MetricViewComponent } from '../_elements/metric-view/metric-view.component';
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
  @ViewChild(MetricViewComponent) metricViewComponent!: MetricViewComponent;

  myExperiments?: Experiment[];
  selectedExperiment?: Experiment;
  selectedModel?: Model;

  trainingResult: any;

  history: any[] = [];

  term: string = "";

  constructor(private modelsService: ModelsService, private route: ActivatedRoute, private experimentsService: ExperimentsService, private authService: AuthService, private signalRService: SignalRService) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let experimentId = this.route.snapshot.paramMap.get("id");

      this.fetchExperiments(experimentId);

      this.authService.loggedInEvent.subscribe(_ => {
        this.fetchExperiments(experimentId);

        this.signalRService.startConnection();
      });

      console.log(this.signalRService.hubConnection);
      if (this.signalRService.hubConnection) {
        this.signalRService.hubConnection.on("NotifyEpoch", (mName: string, mId: string, stat: string, totalEpochs: number, currentEpoch: number) => {
          console.log(this.selectedModel?._id, mId);
          if (this.selectedModel?._id == mId) {
            stat = stat.replace(/'/g, '"');
            this.trainingResult = JSON.parse(stat);
            //console.log('JSON', this.trainingResult);
            this.history.push(this.trainingResult);
            this.metricViewComponent.update(this.history);
          }
        });
      }
    });
  }

  fetchExperiments(andSelectWithId: string | null = '') {
    this.experimentsService.getMyExperiments().subscribe((experiments) => {
      this.myExperiments = experiments.reverse();

      this.selectedExperiment = this.myExperiments.filter(x => x._id == andSelectWithId)[0];
      if (this.modelLoadComponent)
        this.modelLoadComponent.newModel.type = this.selectedExperiment.type;
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
    this.modelsService.trainModel(this.selectedModel._id, this.selectedExperiment._id).subscribe((response: any) => {
      //console.log('Train model complete!', response);
      Shared.openDialog("Obaveštenje", "Treniranje modela je počelo!");
    });
  }
}
