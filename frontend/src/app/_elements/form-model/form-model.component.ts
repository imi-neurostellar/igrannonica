import { Component, OnInit, Input, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import Shared from 'src/app/Shared';
import Experiment from 'src/app/_data/Experiment';
import Model, { Layer, ActivationFunction, LossFunction, LearningRate, LossFunctionBinaryClassification, LossFunctionMultiClassification, LossFunctionRegression, Metrics, MetricsBinaryClassification, MetricsMultiClassification, MetricsRegression, NullValueOptions, Optimizer, ProblemType, Regularisation, RegularisationRate, BatchSize } from 'src/app/_data/Model';
import { GraphComponent } from '../graph/graph.component';
import { MatSliderChange } from '@angular/material/slider';

import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import Dataset from 'src/app/_data/Dataset';
import { DatatableComponent, TableData } from '../datatable/datatable.component';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-form-model',
  templateUrl: './form-model.component.html',
  styleUrls: ['./form-model.component.css']
})
export class FormModelComponent implements AfterViewInit {
  @ViewChild(GraphComponent) graph!: GraphComponent;
  @Input() forExperiment?: Experiment;
  @Output() selectedModelChangeEvent = new EventEmitter<Model>();
  testSetDistribution: number = 70;
  constructor() { }

  ngAfterViewInit(): void {
  }

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

  newModel: Model = new Model();
  myModels?: Model[];

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
  lossFunction: any = LossFunction;

  showMyModels: boolean = true;

  //
  csvRecords: any[] = [];
  files: File[] = [];
  rowsNumber: number = 0;
  colsNumber: number = 0;

  @Input() dataset: Dataset; //dodaj ! potencijalno

  tableData: TableData = new TableData();

  @ViewChild('fileInput') fileInput! : ElementRef

  filename: String;
  //

  changeListener($event: any): void {
    this.files = $event.srcElement.files;
    if (this.files.length == 0 || this.files[0] == null) {
      this.tableData.hasInput = false;
      return;
    }
    else
      this.tableData.hasInput = true;

    this.filename = this.files[0].name;
    this.tableData.loaded = false;
    this.update();
  }


  update() {

    if (this.files.length < 1)
      return;

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      if (typeof fileReader.result === 'string') {
        const result = this.csv.csvToArray(fileReader.result, (this.dataset.delimiter == "razmak") ? " " : (this.dataset.delimiter == "novi red") ? "\t" : this.dataset.delimiter)

        
        this.csvRecords = result.splice(0, 11);

        this.colsNumber = result[0].length;
        this.rowsNumber = result.length;

        this.tableData.data = this.csvRecords;
        this.tableData.loaded = true;
        this.tableData.numCols = this.colsNumber;
        this.tableData.numRows = this.rowsNumber;
      }
    }
    fileReader.readAsText(this.files[0]);

    this.dataset.name = this.filename.slice(0, this.filename.length - 4);
  }

  uploadDataset() {
    if (this.files[0] == undefined) {
      shared.openDialog("Greška", "Niste izabrali fajl za učitavanje.");
      return;
    }

    this.modelsService.uploadData(this.files[0]).subscribe((file) => {
      //console.log('ADD MODEL: STEP 2 - ADD DATASET WITH FILE ID ' + file._id);
      this.dataset._id = "";
      this.dataset.fileId = file._id;
      this.dataset.uploaderId = shared.userId;

      this.datasetsService.addDataset(this.dataset).subscribe((dataset) => {
        shared.openDialog("Obaveštenje", "Uspešno ste dodali novi izvor podataka u kolekciju. Molimo sačekajte par trenutaka da se procesira.");
      }, (error) => {
        shared.openDialog("Neuspeo pokušaj!", "Izvor podataka sa unetim nazivom već postoji u Vašoj kolekciji. Izmenite naziv ili iskoristite postojeći dataset.");
      }); //kraj addDataset subscribe
    }, (error) => {

    }); //kraj uploadData subscribe
  }

  //

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
    if (this.newModel.hiddenLayers < 128) {
      this.newModel.layers.push(new Layer(this.newModel.layers.length, this.selectedActivation, this.selectedNumberOfNeurons, this.selectedRegularisation, this.selectedRegularisationRate));

      this.newModel.hiddenLayers += 1;
      this.updateGraph();
    }

  }
  /*
  setNeurons()
  {
    for(let i=0;i<this.newModel.hiddenLayers;i++){
      this.newModel.hiddenLayerNeurons[i]=1;
    }
  }*/
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


  displayFile(){
    if(this.type == FolderType.Dataset)
      this.formDataset!.dataset = <Dataset>this.fileToDisplay;
  }

  hoverOverFile(i: number) {
    this.hoveringOverFileIndex = i;
    if (i != -1) {
      this.fileToDisplay = this.files[i];
    } else {
      if (this.newFileSelected) {
        this.fileToDisplay = this.newFile;
      } else {
        this.fileToDisplay = this.files[this.selectedFileIndex];
      }
    }
    this.displayFile();
  }

  selectNewFile() {
    if (!this.newFile) {
      this.createNewFile();
    }
    this.fileToDisplay = this.newFile;
    this.selectedFile = this.newFile;
    this.newFileSelected = true;
    this.listView = false;
    this.selectedFileChanged.emit(this.newFile);
    this.displayFile();
  }

  selectFile(index: number) {
    this.selectedFile = this.filteredFiles[index];
    this.fileToDisplay = this.filteredFiles[index];
    this.newFileSelected = false;
    this.listView = false;
    this.selectedFileChanged.emit(this.selectedFile);
    this.displayFile();
  }
  createNewFile() {
    if (this.type == FolderType.Dataset) {
      this.newFile = new Dataset();
    } else if (this.type == FolderType.Model) {
      this.newFile = new Model();
    }
  }

  refreshFiles(){
    this.datasetsService.getMyDatasets().subscribe((datasets) => {
      this.folders[TabType.MyDatasets] = datasets;
    });

    this.experimentsService.getMyExperiments().subscribe((experiments) => {
      this.folders[TabType.MyExperiments] = experiments;
    });

    this.datasetsService.getPublicDatasets().subscribe((datasets) => {
      this.folders[TabType.PublicDatasets] = datasets;
    });

    this.modelsService.getMyModels().subscribe((models) => {
      this.folders[TabType.MyModels] = models;
    });

    /*this.modelsService.getMyModels().subscribe((models) => {
      this.folders[TabType.PublicModels] = models;
    });*/
    this.folders[TabType.PublicModels] = [];

    this.experimentsService.getMyExperiments().subscribe((experiments) => {
      this.folders[TabType.MyExperiments] = experiments;
    });

    this.files = [];

    this.filteredFiles.length = 0;
    this.filteredFiles.push(...this.files);

    this.searchTermsChanged();

  }

  saveNewFile() {
    if(this.type == FolderType.Dataset)
      this.formDataset!.uploadDataset();
  }


  /*calcZIndex(i: number) {
    let zIndex = (this.files.length - i - 1)
    if (this.selectedFileIndex == i)
      zIndex = this.files.length + 2;
    if (this.hoveringOverFileIndex == i)
      zIndex = this.files.length + 3;
    return zIndex;
  }

  newFileZIndex() {
    return (this.files.length + 1);
  }*/

  clearSearchTerm() {
    this.searchTerm = '';
    this.searchTermsChanged();
  }

  filteredFiles: FolderFile[] = [];

  searchTermsChanged() {
    this.filteredFiles.length = 0;
    this.filteredFiles.push(...this.files.filter((file) => file.name.toLowerCase().includes(this.searchTerm.toLowerCase())));
    if (this.selectedFile) {
      if (!this.filteredFiles.includes(this.selectedFile)) {
        this.selectFile(-1);
      } else {
        this.selectedFileIndex = this.filteredFiles.indexOf(this.selectedFile);
      }
    }
  }

  listView: boolean = false;

  toggleListView() {
    this.listView = !this.listView;
  }

  deleteFile() {
    console.log('delete');
  }

  folders: { [tab: number]: FolderFile[] } = {};

  tabTitles: { [tab: number]: string } = {
    [TabType.File]: 'Fajl',
    [TabType.NewFile]: 'Novi fajl',
    [TabType.MyDatasets]: 'Moji izvori podataka',
    [TabType.PublicDatasets]: 'Javni izvori podataka',
    [TabType.MyModels]: 'Moje konfiguracije neuronske mreže',
    [TabType.PublicModels]: 'Javne konfiguracije neuronske mreže',
    [TabType.MyExperiments]: 'Eksperimenti',
  };

  FolderType = FolderType;

  TabType = TabType;

  @Input() tabsToShow: TabType[] = [
    TabType.MyDatasets,
    TabType.PublicDatasets,
    TabType.MyModels,
    TabType.PublicModels,
    TabType.MyExperiments,
    TabType.File
  ]

  @Input() selectedTab: TabType = TabType.NewFile;
  hoverTab: TabType = TabType.None;

  selectTab(tab: TabType) {
    this.checkListView(tab);
    this.selectedTab = tab;
    this.files = this.folders[tab];

    this.searchTermsChanged();
  }


  checkListView(tab: TabType) {
    switch (tab) {
      case TabType.File:
      case TabType.NewFile:
      case TabType.None:
        this.listView = false;
        break;
      case TabType.MyExperiments:
      case TabType.MyDatasets:
      case TabType.MyModels:
      case TabType.PublicDatasets:
      case TabType.PublicModels:
        this.listView = true;
        break;
    }
  }

  hoverOverTab(tab: TabType) {
    this.checkListView(tab);
    this.hoverTab = tab;
    if (tab == TabType.None) {
      this.checkListView(this.selectedTab);
      this.files = this.folders[this.selectedTab];
    } else {
      this.files = this.folders[tab];
    }
    this.searchTermsChanged();
  }
}

export enum Privacy {
  Private,
  Public
}

export enum TabType {
  NewFile,
  File,
  MyDatasets,
  PublicDatasets,
  MyModels,
  PublicModels,
  MyExperiments,
  None
}
