import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import Dataset from 'src/app/_data/Dataset';
import { FolderFile, FolderType } from 'src/app/_data/FolderFile';
import Model from 'src/app/_data/Model';
import { DatasetsService } from 'src/app/_services/datasets.service';
import Shared from 'src/app/Shared';
import { ModelsService } from 'src/app/_services/models.service';
import { FormDatasetComponent } from '../form-dataset/form-dataset.component';
import Experiment from 'src/app/_data/Experiment';
import { ExperimentsService } from 'src/app/_services/experiments.service';
import { PredictorsService } from 'src/app/_services/predictors.service';
import { SignalRService } from 'src/app/_services/signal-r.service';
import { FormModelComponent } from '../form-model/form-model.component';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.css']
})
export class FolderComponent implements AfterViewInit {

  @ViewChild(FormDatasetComponent) formDataset!: FormDatasetComponent;
  @ViewChild(FormModelComponent) formModel!: FormModelComponent;

  @Input() folderName: string = 'Moji podaci';
  @Input() files!: FolderFile[]

  newFile?: Dataset | Model;

  @Input() type: FolderType = FolderType.Dataset;
  @Input() forExperiment!: Experiment;
  @Input() startingTab!: TabType;

  newFileSelected: boolean = true;

  selectedFileIndex: number = -1;
  selectedFile?: FolderFile;
  hoveringOverFileIndex: number = -1;

  fileToDisplay?: FolderFile;

  @Output() selectedFileChanged: EventEmitter<FolderFile> = new EventEmitter();
  @Output() okPressed: EventEmitter<string> = new EventEmitter();

  searchTerm: string = '';

  constructor(private datasetsService: DatasetsService, private experimentsService: ExperimentsService, private modelsService: ModelsService, private predictorsService: PredictorsService, private signalRService: SignalRService) {
    this.tabsToShow.forEach(tab => this.folders[tab] = []);
  }

  ngAfterViewInit(): void {
    this.refreshFiles(null);

    if (this.signalRService.hubConnection) {
      this.signalRService.hubConnection.on("NotifyDataset", (dName: string, dId: string) => {
        if (this.type == FolderType.Dataset) {
          this.refreshFiles(dId);
        }
      });
    } else {
      console.warn("Dataset-Load: No connection!");
    }
  }

  displayFile() {
    if (this.type == FolderType.Dataset)
      this.formDataset.dataset = <Dataset>this.fileToDisplay;
    else if (this.type == FolderType.Model)
      this.formModel.newModel = <Model>this.fileToDisplay;
  }

  hoverOverFile(i: number) {
    /*this.hoveringOverFileIndex = i;
    if (i != -1) {
      this.fileToDisplay = this.files[i];
    } else {
      if (this.newFileSelected) {
        this.fileToDisplay = this.newFile;
      } else {
        this.fileToDisplay = this.files[this.selectedFileIndex];
      }
    }
    this.displayFile();*/
  }

  selectNewFile() {
    if (!this.newFile) {
      this.createNewFile();
    }
    this.fileToDisplay = this.newFile;
    this.newFileSelected = true;
    this.listView = false;
    this.displayFile();
  }

  selectFile(file?: FolderFile) {
    this.selectedFile = file;
    this.fileToDisplay = file;
    this.newFileSelected = false;
    this.listView = false;
    this.selectedFileChanged.emit(this.selectedFile);
    this.selectTab(TabType.File);
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

  _initialized: boolean = false;

  refreshFiles(selectedDatasetId: string | null) {
    this.files = []
    this.filteredFiles.length = 0;
    this.folders[TabType.NewFile] = [];
    this.folders[TabType.File] = [];
    this.tabsToShow.forEach(tab => {
      this.folders[tab] = [];
    });

    this.datasetsService.getMyDatasets().subscribe((datasets) => {
      this.folders[TabType.MyDatasets] = datasets;
      if (selectedDatasetId) {
        this.selectFile(datasets.filter(x => x._id == selectedDatasetId)[0]);
      }
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

    if (!this._initialized) {
      this.files = this.folders[this.startingTab];
      this.filteredFiles = [];
      this.selectTab(this.startingTab);
      this._initialized = true;
    }

    this.searchTermsChanged();
  }

  saveNewFile() {
    switch (this.type) {
      case FolderType.Dataset:
        this.formDataset!.uploadDataset((dataset: Dataset) => {
          this.newFile = undefined;
          Shared.openDialog("Obaveštenje", "Uspešno ste dodali novi izvor podataka u kolekciju. Molimo sačekajte par trenutaka da se procesira.");
          this.refreshFiles(null);
        },
          () => {
            Shared.openDialog("Neuspeo pokušaj!", "Izvor podataka sa unetim nazivom već postoji u Vašoj kolekciji. Izmenite naziv ili iskoristite postojeći dataset.");
          });
        break;
      case FolderType.Model:
        this.modelsService.addModel(this.formModel.newModel).subscribe(model => {
          this.newFile = undefined;
          Shared.openDialog("Obaveštenje", "Uspešno ste dodali novu konfiguraciju neuronske mreže u kolekciju.");
          this.refreshFiles(null); // todo select model
        }, (err) => {
          Shared.openDialog("Neuspeo pokušaj!", "Konfiguracija neuronske mreže sa unetim nazivom već postoji u Vašoj kolekciji. Izmenite naziv ili iskoristite postojeću konfiguraciju.");
        });
        break;
    }
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
    if (!this.files) return;
    this.filteredFiles.push(...this.files.filter((file) => file.name.toLowerCase().includes(this.searchTerm.toLowerCase())));
    /*if (this.selectedFile) {
      if (!this.filteredFiles.includes(this.selectedFile)) {
        if (this.hoverTab === TabType.None && this.getFolderType(this.selectedTab) === this.type) {
          this.selectFile(undefined);
          console.log(this.getFolderType(this.selectedTab), this.type);
        }
      } else {
        //this.selectedFileIndex = this.filteredFiles.indexOf(this.selectedFile);
      }
    }*/
  }

  listView: boolean = true;

  toggleListView() {
    this.listView = !this.listView;
  }

  deleteFile(file: FolderFile, event: Event) {
    event.stopPropagation();
    //console.log('delete');
    switch (this.type) {
      case FolderType.Dataset:
        this.datasetsService.deleteDataset(<Dataset>file).subscribe((response) => {
          this.filteredFiles.splice(this.filteredFiles.indexOf(file), 1);
          this.refreshFiles(null);
        });
        break;
      case FolderType.Model:
        this.modelsService.deleteModel(<Model>file).subscribe((response) => {
          this.refreshFiles(null);
        });
        break;
      case FolderType.Experiment:
        // this.experimentsService.deleteExperiment(<Model>file).subscribe((response) => {
        //   console.log(response);
        // });
        //todo delete za predictor
        break;
    }
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
  Privacy = Privacy;
  TabType = TabType;

  privacy: Privacy = Privacy.Private;

  @Input() tabsToShow: TabType[] = [
    TabType.MyDatasets,
    TabType.PublicDatasets,
    TabType.MyModels,
    TabType.PublicModels,
    TabType.MyExperiments
  ]

  @Input() selectedTab: TabType = TabType.NewFile;
  hoverTab: TabType = TabType.None;

  selectTab(tab: TabType) {
    setTimeout(() => {
      if (tab == TabType.NewFile) {
        this.selectNewFile();
      }

      this.listView = this.getListView(tab);
      this.type = this.getFolderType(tab);
      this.privacy = this.getPrivacy(tab);
      this.selectedTab = tab;
      this.files = this.folders[tab];

      if (tab !== TabType.File && tab !== TabType.NewFile)
        this.searchTermsChanged();
    });
  }

  getListView(tab: TabType) {
    switch (tab) {
      case TabType.File:
      case TabType.NewFile:
      case TabType.None:
        return false;
      case TabType.MyExperiments:
      case TabType.MyDatasets:
      case TabType.MyModels:
      case TabType.PublicDatasets:
      case TabType.PublicModels:
        return true;
      default:
        return false;
    }
  }

  getFolderType(tab: TabType) {
    switch (tab) {
      case TabType.MyExperiments:
        return FolderType.Experiment;
      case TabType.MyDatasets:
      case TabType.PublicDatasets:
        return FolderType.Dataset;
      case TabType.MyModels:
      case TabType.PublicModels:
        return FolderType.Model;
      default:
        return this.type;
    }
  }

  getPrivacy(tab: TabType) {
    switch (tab) {
      case TabType.PublicDatasets:
      case TabType.PublicModels:
        return Privacy.Public;
      default:
        return Privacy.Private;
    }
  }

  hoverOverTab(tab: TabType) {
    this.listView = this.getListView(tab);
    this.privacy = this.getPrivacy(tab);
    this.hoverTab = tab;
    if (tab == TabType.None) {
      this.listView = this.getListView(this.selectedTab);
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