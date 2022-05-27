import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import Dataset from 'src/app/_data/Dataset';
import { DatasetsService } from 'src/app/_services/datasets.service';
import { ModelsService } from 'src/app/_services/models.service';
import shared from 'src/app/Shared';
import { DatatableComponent, TableData } from '../datatable/datatable.component';
import { CsvParseService } from 'src/app/_services/csv-parse.service';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-form-dataset',
  templateUrl: './form-dataset.component.html',
  styleUrls: ['./form-dataset.component.css']
})
export class FormDatasetComponent {

  @ViewChild(DatatableComponent) datatable!: DatatableComponent;

  nameFormControl = new FormControl('', [Validators.required, Validators.email]);

  delimiterOptions: Array<string> = [",", ";",  "|", "razmak", "novi red"]; //podrazumevano ","

  csvRecords: any[] = [];
  files: File[] = [];
  rowsNumber: number = 0;
  colsNumber: number = 0;

  @Input() dataset: Dataset; //dodaj ! potencijalno

  tableData: TableData = new TableData();

  @ViewChild('fileInput') fileInput! : ElementRef

  filename: String;

  constructor(private modelsService: ModelsService, private datasetsService: DatasetsService, private csv: CsvParseService) {
    this.dataset = new Dataset();
    this.dataset.delimiter = ',';
    this.filename = "";
  }

  //@ViewChild('fileImportInput', { static: false }) fileImportInput: any; cemu je ovo sluzilo?

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

  /*exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.data, 'sample');
  }*/

  checkAccessible() {
    if (this.dataset.isPublic)
      this.dataset.accessibleByLink = true;
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

  changePage(event: StepperSelectionEvent) {
    this.updatePage(<number>event.selectedIndex)
  }

  goToPage(pageNum: number) {
    this.stepper.selectedIndex = pageNum;
    this.updatePage(pageNum);
  }

  scrollTimeout: any;


}
