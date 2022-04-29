import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import Dataset from 'src/app/_data/Dataset';
import { FolderFile, FolderType } from 'src/app/_data/FolderFile';
import Model from 'src/app/_data/Model';
import { DatasetsService } from 'src/app/_services/datasets.service';
import shared from 'src/app/Shared';
import { ModelsService } from 'src/app/_services/models.service';
import { FormDatasetComponent } from '../form-dataset/form-dataset.component';
import Experiment from 'src/app/_data/Experiment';
import { ExperimentsService } from 'src/app/_services/experiments.service';
import { PredictorsService } from 'src/app/_services/predictors.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.css']
})
export class FolderComponent implements OnInit {

  @ViewChild(FormDatasetComponent) formDataset?: FormDatasetComponent;

  @Input() folderName: string = 'Moji podaci';

  @Input() files!: FolderFile[]

  newFile!: Dataset | Model;

  @Input() type: FolderType = FolderType.Dataset;

  @Input() forExperiment?: Experiment;

  newFileSelected: boolean = true;

  selectedFileIndex: number = -1;
  selectedFile?: FolderFile;
  hoveringOverFileIndex: number = -1;

  fileToDisplay?: FolderFile;

  @Output() selectedFileChanged: EventEmitter<FolderFile> = new EventEmitter();
  @Output() okPressed: EventEmitter<string> = new EventEmitter();

  searchTerm: string = '';

  constructor(private datasetsService: DatasetsService, private experimentsService: ExperimentsService, private modelsService: ModelsService, private predictorsService: PredictorsService) {
    //PLACEHOLDER
    this.forExperiment = new Experiment();
    this.forExperiment.inputColumns = ['kolona1', 'kol2', '???', 'test'];

    this.folders[TabType.File] = [];
    this.folders[TabType.NewFile] = [];

    this.refreshFiles();

    
  }

  ngOnInit(): void {
    if (this.files.length > 0)
      this.selectFile(0);
    else {
      this.selectNewFile();
    }
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

  ok() {
    this.okPressed.emit();
  }

  refreshFiles(){
    this.datasetsService.getMyDatasets().subscribe((datasets) => {
      this.folders[TabType.MyDatasets] = datasets;
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