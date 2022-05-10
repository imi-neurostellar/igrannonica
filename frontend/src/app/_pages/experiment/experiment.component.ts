import { AfterViewInit, Component, ElementRef, ViewChild, ViewChildren, Input } from '@angular/core';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';
import Shared from 'src/app/Shared';
import { FolderFile, FolderType } from 'src/app/_data/FolderFile';
import { FolderComponent, TabType } from 'src/app/_elements/folder/folder.component';
import Experiment from 'src/app/_data/Experiment';
import { ExperimentsService } from 'src/app/_services/experiments.service';
import { ModelsService } from 'src/app/_services/models.service';
import Model from 'src/app/_data/Model';
import Dataset from 'src/app/_data/Dataset';
import { ColumnTableComponent } from 'src/app/_elements/column-table/column-table.component';
import { SignalRService } from 'src/app/_services/signal-r.service';
import { MetricViewComponent } from 'src/app/_elements/metric-view/metric-view.component';

@Component({
  selector: 'app-experiment',
  templateUrl: './experiment.component.html',
  styleUrls: ['./experiment.component.css']
})
export class ExperimentComponent implements AfterViewInit {

  @ViewChild(MatStepper) stepper!: MatStepper;
  @ViewChild('stepsContainer') stepsContainer!: ElementRef;
  @ViewChildren('steps') steps!: ElementRef[];

  event: number = 0;
  experiment: Experiment;
  dataset?: Dataset;
  @ViewChild("folderDataset") folderDataset!: FolderComponent;
  @ViewChild(ColumnTableComponent) columnTable!: ColumnTableComponent;
  @ViewChild("folderModel") folderModel!: FolderComponent;
  @ViewChild("metricView") metricView!: MetricViewComponent;

  constructor(private experimentsService: ExperimentsService, private modelsService: ModelsService, private signalRService: SignalRService) {
    this.experiment = new Experiment("exp1");
  }

  /*updateExperiment(){

  }*/

  addNewExperiment() {
    this.experimentsService.addExperiment(this.experiment).subscribe(() => { console.log("new Experiment") });
  }

  trainModel() {
    if (!this.modelToTrain) {
      Shared.openDialog('Greška', 'Morate odabrati konfiguraciju neuronske mreže');
    } else {
      this.modelsService.trainModel(this.modelToTrain._id, this.experiment._id).subscribe(() => { console.log("pocelo treniranje") });
    }
  }

  stepHeight = this.calcStepHeight();

  calcStepHeight() {
    return window.innerHeight - 64;
  }

  ngAfterViewInit(): void {
    window.addEventListener('resize', () => {
      this.updatePageHeight();
    })
    this.updatePageHeight();

    setInterval(() => {
      this.updatePageIfScrolled();
    }, 100);

    this.stepsContainer.nativeElement.addEventListener('scroll', (event: Event) => {
      Shared.emitBGScrollEvent(this.stepsContainer.nativeElement.scrollTop);
    });

    if (this.signalRService.hubConnection) {
      this.signalRService.hubConnection.on("NotifyEpoch", (mName: string, mId: string, stat: string, totalEpochs: number, currentEpoch: number) => {
        console.log(this.modelToTrain?._id, mId);
        if (currentEpoch == 0) {
          this.history = [];
        }
        if (this.modelToTrain?._id == mId) {
          stat = stat.replace(/'/g, '"');
          //console.log('JSON', this.trainingResult);
          this.history.push(JSON.parse(stat));
          this.metricView.update(this.history);
        }
      });

    }
  }

  history: any[] = [];

  updatePageIfScrolled() {
    if (this.scrolling) return;
    const currentPage = Math.round(this.stepsContainer.nativeElement.scrollTop / this.stepHeight)
    this.stepper.selectedIndex = currentPage;
  }

  updatePageHeight() {
    this.stepHeight = this.calcStepHeight();
    const stepHeight = `${this.stepHeight}px`;
    this.stepsContainer.nativeElement.style.minHeight = stepHeight;
    this.steps.forEach(step => {
      step.nativeElement.style.minHeight = stepHeight;
    })
  }

  changePage(event: StepperSelectionEvent) {
    this.updatePage(<number>event.selectedIndex)
  }

  goToPage(pageNum: number) {
    this.stepper.selectedIndex = pageNum;
    this.updatePage(pageNum);
  }

  scrollTimeout: any;

  updatePage(pageNum: number) {
    this.scrolling = true;
    this.event = pageNum;
    let scrollAmount = 0;
    this.steps.forEach((step, index) => {
      if (index == pageNum) {
        scrollAmount = step.nativeElement.offsetTop;
      }
    })
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.scrolling = false;
    }, 800);
    this.stepsContainer.nativeElement.scroll({
      top: scrollAmount,
      behavior: 'smooth' //auto, smooth, initial, inherit
    });
  }

  scrolling: boolean = false;

  FolderType = FolderType;

  TabType = TabType;

  columnTableChangedEvent() {
    //sta se desi kad se nesto promeni u column-table komponenti...
    //console.log("promenio se column-table");
  }

  experimentChangedEvent() {
    this.folderModel.updateExperiment();
  }

  setDataset(dataset: FolderFile) {
    const d = <Dataset>dataset;
    this.experiment.datasetId = d._id;
    this.dataset = d;

    this.columnTable.loadDataset(this.dataset);
  }

  modelToTrain?: Model;

  setModel(model: FolderFile) {
    const m = <Model>model;
    this.modelToTrain = m;
  }
}
