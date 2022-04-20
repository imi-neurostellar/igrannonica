import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { AddNewDatasetComponent } from '../add-new-dataset/add-new-dataset.component';
import { ModelsService } from 'src/app/_services/models.service';
import shared from 'src/app/Shared';
import Dataset from 'src/app/_data/Dataset';
import { DatatableComponent, TableData } from 'src/app/_elements/datatable/datatable.component';
import { DatasetsService } from 'src/app/_services/datasets.service';
import { CsvParseService } from 'src/app/_services/csv-parse.service';
import { Output, EventEmitter } from '@angular/core';
import { SignalRService } from 'src/app/_services/signal-r.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-dataset-load',
  templateUrl: './dataset-load.component.html',
  styleUrls: ['./dataset-load.component.css']
})
export class DatasetLoadComponent implements OnInit {

  @Output() selectedDatasetChangeEvent = new EventEmitter<Dataset>();

  @ViewChild(AddNewDatasetComponent) addNewDatasetComponent!: AddNewDatasetComponent;
  @ViewChild(AddNewDatasetComponent) datatable!: DatatableComponent;

  datasetLoaded: boolean = false;
  selectedDatasetLoaded: boolean = false;

  showMyDatasets: boolean = true;
  myDatasets?: Dataset[];
  existingDatasetSelected: boolean = false;
  selectedDataset?: Dataset;

  tableData: TableData = new TableData();

  term: string = "";

  constructor(private models: ModelsService, private datasets: DatasetsService, private csv: CsvParseService, private signalRService: SignalRService, private authService: AuthService) {
    this.fetchDatasets();

    authService.loggedInEvent.subscribe(_ => {
      this.fetchDatasets();
    })
  }

  fetchDatasets() {
    this.datasets.getMyDatasets().subscribe((datasets) => {
      this.myDatasets = datasets;
    });
  }

  viewMyDatasetsForm() {
    this.showMyDatasets = true;
    if (this.selectedDataset != undefined)
      this.resetSelectedDataset();
    //this.resetCbsAndRbs();        //TREBA DA SE DESI
  }
  viewNewDatasetForm() {
    this.showMyDatasets = false;
    if (this.selectedDataset != undefined)
      this.resetSelectedDataset();
    //this.resetCbsAndRbs();        //TREBA DA SE DESI
  }

  selectThisDataset(dataset: Dataset) {
    this.selectedDataset = dataset;
    this.selectedDatasetLoaded = false;
    this.existingDatasetSelected = true;
    this.tableData.hasHeader = this.selectedDataset.hasHeader;

    this.tableData.hasInput = true;
    this.tableData.loaded = false;

    this.datasets.getDatasetFile(dataset.fileId).subscribe((file: string | undefined) => {
      if (file) {
        this.tableData.loaded = true;
        this.tableData.numRows = this.selectedDataset!.rowCount;
        this.tableData.numCols = this.selectedDataset!.columnInfo.length;
        this.tableData.data = this.csv.csvToArray(file, (dataset.delimiter == "razmak") ? " " : (dataset.delimiter == "") ? "," : dataset.delimiter);
        //this.resetCbsAndRbs();                        //TREBA DA SE DESI
        //this.refreshThreeNullValueRadioOptions();       //TREBA DA SE DESI
        this.selectedDatasetLoaded = true;

        this.selectedDatasetChangeEvent.emit(this.selectedDataset);
      }
    });
  }

  resetSelectedDataset(): boolean {
    this.selectedDatasetChangeEvent.emit(this.selectedDataset);
    return true;
  }

  refreshMyDatasets(selectedDatasetId: string | null) {
    this.datasets.getMyDatasets().subscribe((datasets) => {
      this.myDatasets = datasets.reverse();
      this.showMyDatasets = true; 
      this.selectedDataset = this.myDatasets.filter(x => x._id == selectedDatasetId)[0];
      this.resetSelectedDataset();
    });
  }

  ngOnInit(): void {
    if (this.signalRService.hubConnection) {
      this.signalRService.hubConnection.on("NotifyDataset", (dName: string, dId: string) => {
        this.refreshMyDatasets(dId);
      });
    } else {
      console.warn("Dataset-Load: No connection!");
    }
  }
}
