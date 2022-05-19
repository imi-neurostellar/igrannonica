import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import Dataset from 'src/app/_data/Dataset';
import { FolderFile, FolderType } from 'src/app/_data/FolderFile';
import Model, { ProblemType } from 'src/app/_data/Model';
import { DatasetsService } from 'src/app/_services/datasets.service';
import Shared from 'src/app/Shared';
import { ModelsService } from 'src/app/_services/models.service';
import { FormDatasetComponent } from '../form-dataset/form-dataset.component';
import Experiment from 'src/app/_data/Experiment';
import { ExperimentsService } from 'src/app/_services/experiments.service';
import { PredictorsService } from 'src/app/_services/predictors.service';
import { SignalRService } from 'src/app/_services/signal-r.service';
import { FormModelComponent } from '../form-model/form-model.component';
import { ActivatedRoute, Router } from '@angular/router';
import Predictor from 'src/app/_data/Predictor';
import FileSaver from 'file-saver';

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
  @Input() archive: boolean = false;
  newFileSelected: boolean = true;

  selectedFileIndex: number = -1;
  selectedFile?: FolderFile;
  hoveringOverFileIndex: number = -1;

  fileToDisplay?: FolderFile;

  @Output() selectedFileChanged: EventEmitter<FolderFile> = new EventEmitter();
  @Output() fileFromRoute: EventEmitter<FolderFile> = new EventEmitter();
  @Output() okPressed: EventEmitter<string> = new EventEmitter();

  searchTerm: string = '';

  constructor(private datasetsService: DatasetsService, private experimentsService: ExperimentsService, private modelsService: ModelsService, private predictorsService: PredictorsService, private signalRService: SignalRService, private router: Router, private route: ActivatedRoute) {
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
    if (this.type == FolderType.Dataset) {
      this.formDataset.dataset = <Dataset>this.fileToDisplay;
      this.formDataset.existingFlag = false;
    }
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
    if (this.type == FolderType.Dataset) {
      this.formDataset.clear();
    }
  }

  selectFile(file?: FolderFile) {
    this.formDataset.resetPagging();
    this.selectedFile = file;
    this.fileToDisplay = file;
    if (this.type == FolderType.Experiment && file) {
      this.router.navigate(['/experiment/' + file._id]);
    }
    this.newFileSelected = false;
    this.listView = false;
    this.selectedFileChanged.emit(this.selectedFile);
    this.selectTab(TabType.File);
    this.displayFile();

    if (this.type == FolderType.Dataset)
      this.formDataset.loadExisting();
  }
  
  goToExperimentPageWithPredictor(file: FolderFile, predictor: Predictor) {
    this.router.navigate(['/experiment/p/' + predictor._id]);
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

  refreshFiles(selectedDatasetId: string | null = null, selectedModelId: string | null = null) {
    
    this.tabsToShow.forEach(tab => {
      this.folders[tab] = [];
    });

    if (this.archive) {
      this.refreshDatasets(selectedDatasetId);
      this.refreshModels(selectedModelId);
      this.refreshExperiments();
    } else {
      switch (this.type) {
        case FolderType.Dataset:
          this.refreshDatasets(selectedDatasetId);
          break;

        case FolderType.Model:
          this.refreshModels(selectedModelId);
          break;

        case FolderType.Experiment:
          this.refreshExperiments();
          break;

        default:
          console.error("Bad folder type.");
          break;
      }
    }

    if (!this._initialized) {
      this.files = this.folders[this.startingTab];
      this.filteredFiles = [];
      this.selectTab(this.startingTab);
      this._initialized = true;
    }
  }

  refreshModels(selectedModelId: string | null) {
    this.modelsService.getMyModels().subscribe((models) => {
      this.folders[TabType.MyModels] = models;
      if (selectedModelId) {
        this.selectFile(models.filter(x => x._id == selectedModelId)[0]);
      }
      this.searchTermsChanged();
    });
    /*this.modelsService.getMyModels().subscribe((models) => {
      this.folders[TabType.PublicModels] = models;
      this.searchTermsChanged();
    });*/

    this.modelsService.getPublicModels().subscribe((models) => {
      this.folders[TabType.PublicModels] = models;
      this.searchTermsChanged();
    });
    //this.folders[TabType.PublicModels] = [];
  }

  refreshDatasets(selectedDatasetId: string | null) {
    this.datasetsService.getMyDatasets().subscribe((datasets) => {
      this.folders[TabType.MyDatasets] = datasets;
      console.log(this.filteredFiles);
      if (selectedDatasetId) {
        this.selectFile(datasets.filter(x => x._id == selectedDatasetId)[0]);
      }
      this.searchTermsChanged();
    });
    this.datasetsService.getPublicDatasets().subscribe((datasets) => {
      this.folders[TabType.PublicDatasets] = datasets;
      this.searchTermsChanged();
    });
  }

  refreshExperiments() {
    this.experimentsService.getMyExperiments().subscribe((experiments) => {
      this.folders[TabType.MyExperiments] = experiments;
      this.predictorsService.getMyPredictors().subscribe((predictors) => {
        this.predictorsForExp = {};
        experiments.forEach(exp => {
          this.predictorsForExp[exp._id] = predictors.filter(pred => pred.experimentId == exp._id);
          /* TODO IZMENI OVO DA SE SETUJE NA BACKU AUTOMATSKI */
          this.predictorsForExp[exp._id].forEach(pred => {
            const model = this.folders[TabType.MyModels].find(model => model._id == pred.modelId);
            pred.name = model?.name!;
            pred.lastUpdated = model?.lastUpdated!;
          })
          /* ------------------------------------------------ */
          this.searchTermsChanged();
        })
      });
    });
  }

  saveNewFile() {
    switch (this.type) {
      case FolderType.Dataset:
        this.formDataset!.uploadDataset((dataset: Dataset) => {
          this.newFile = undefined;
          Shared.openDialog("Obaveštenje", "Uspešno ste dodali novi izvor podataka u kolekciju. Molimo sačekajte par trenutaka da se obradi.");
          this.refreshFiles();
        },
          () => {
            Shared.openDialog("Neuspeo pokušaj!", "Izvor podataka sa unetim nazivom već postoji u Vašoj kolekciji. Izmenite naziv ili iskoristite postojeći dataset.");
          });
        break;
      case FolderType.Model:
        this.formModel.newModel.type = this.formModel.forProblemType;
        this.modelsService.addModel(this.formModel.newModel).subscribe(model => {
          this.newFile = undefined;
          Shared.openDialog("Obaveštenje", "Uspešno ste dodali novu konfiguraciju neuronske mreže u kolekciju.");
          this.refreshFiles(null, model._id); // todo select model
        }, (err) => {
          Shared.openDialog("Neuspeo pokušaj!", "Konfiguracija neuronske mreže sa unetim nazivom već postoji u Vašoj kolekciji. Izmenite naziv ili iskoristite postojeću konfiguraciju.");
        });
        break;
    }
  }

  predictorsForExp: { [expId: string]: Predictor[] } = {}

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

  deleteFile(file: FolderFile, event: Event) {
    event.stopPropagation();
    this.filteredFiles.splice(this.filteredFiles.indexOf(file), 1);
    this.files.splice(this.files.indexOf(file), 1);
    switch (this.type) {
      case FolderType.Dataset:
        this.datasetsService.deleteDataset(<Dataset>file).subscribe((response) => {
          Shared.openDialog("Obaveštenje", "Uspešno ste obrisali odabrani izvor podataka.");
          //this.filteredFiles.splice(this.files.indexOf(file), 1);
          //this.refreshFiles();
        });
        break;
      case FolderType.Model:
        this.modelsService.deleteModel(<Model>file).subscribe((response) => {
          Shared.openDialog("Obaveštenje", "Uspešno ste obrisali odabranu konfiguraciju neuronske mreže.");
          //this.refreshFiles();
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
  downloadFile(file: FolderFile, event: Event) {
    event.stopPropagation();
    if (this.type==FolderType.Dataset) {
        const fileId=(<Dataset>file).fileId;
        const name=(<Dataset>file).name;
        const ext=(<Dataset>file).extension;
        if(fileId!=undefined)
        this.datasetsService.downloadFile(fileId).subscribe((response)=>{
          FileSaver.saveAs(response,name+ext);

        });

    }
  }

  addFile(file: FolderFile, event: Event) {
    event.stopPropagation();
    switch (this.type) {
      case FolderType.Dataset:
        (<Dataset>file)._id = "";
        (<Dataset>file).isPreProcess = true;
        (<Dataset>file).isPublic = false;
        this.datasetsService.stealDataset(<Dataset>file).subscribe((response) => {
          Shared.openDialog("Obaveštenje", "Uspešno ste dodali javni izvor podataka u vašu kolekciju.");
          this.refreshFiles(null);
        }, (error:any) => {
          if (error.error == "Dataset with this name already exists") {
            Shared.openDialog("Obaveštenje", "Izvor podataka sa ovim imenom postoji u vašoj kolekciji.");
          }
        });
        break;
      case FolderType.Model:
        this.modelsService.stealModel(<Model>file).subscribe((response) => {
          Shared.openDialog("Obaveštenje", "Uspešno ste dodali javnu konfiguraciju neuronske mreže u vašu kolekciju.");
          this.refreshFiles(null);
        }, (error:any) => {
          if (error.error == "Model already exisits or validation size is not between 0-1") {
            Shared.openDialog("Obaveštenje", "Model sa ovim imenom postoji u vašoj kolekciji.");
          }
        });
        break;
      case FolderType.Experiment:
        // this.experimentsService.addExperiment(<Model>file).subscribe((response) => {
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
  ProblemType = ProblemType;
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
    // this.listView = this.getListView(tab);
    // this.privacy = this.getPrivacy(tab);
    this.hoverTab = tab;
    // if (tab == TabType.None) {
    //   this.listView = this.getListView(this.selectedTab);
    //   this.files = this.folders[this.selectedTab];
    // } else {
    //   this.files = this.folders[tab];
    // }
    // this.searchTermsChanged();
  }

  updateExperiment() {
    if (this.formModel) {
      setTimeout(() => {
        this.formModel.updateGraph();
      });
    }
  }

  newTabTitles: { [tab: number]: string } = {
    [FolderType.Dataset]: 'Novi izvor podataka',
    [FolderType.Model]: 'Nova konfiguracija neuronske mreže',
  };
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