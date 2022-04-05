import { Component, OnInit, ViewChild } from '@angular/core';
import { AddNewDatasetComponent } from '../add-new-dataset/add-new-dataset.component';
import { ModelsService } from 'src/app/_services/models.service';
import shared from 'src/app/Shared';
import Dataset from 'src/app/_data/Dataset';
import { DatatableComponent } from 'src/app/_elements/datatable/datatable.component';
import { DatasetsService } from 'src/app/_services/datasets.service';
import { CsvParseService } from 'src/app/_services/csv-parse.service';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dataset-load',
  templateUrl: './dataset-load.component.html',
  styleUrls: ['./dataset-load.component.css']
})
export class DatasetLoadComponent {

  @Output() selectedDatasetChangeEvent = new EventEmitter<Dataset>();

  @ViewChild(AddNewDatasetComponent) addNewDatasetComponent?: AddNewDatasetComponent;
  @ViewChild(AddNewDatasetComponent) datatable?: DatatableComponent;
  datasetLoaded: boolean = false;
  selectedDatasetLoaded: boolean = false;

  showMyDatasets: boolean = true;
  myDatasets?: Dataset[];
  existingDatasetSelected: boolean = false;
  selectedDataset?: Dataset;
  otherDataset?: Dataset;
  otherDatasetFile?: any[];
  datasetFile?: any[];
  datasetHasHeader?: boolean = true;

  term: string = "";

  constructor(private models: ModelsService, private datasets: DatasetsService, private csv: CsvParseService) {
    this.datasets.getMyDatasets().subscribe((datasets) => {
      this.myDatasets = datasets;
    });
  }

  viewMyDatasetsForm() {
    this.showMyDatasets = true;
    this.resetSelectedDataset();
    //this.resetCbsAndRbs();        //TREBA DA SE DESI
  }
  viewNewDatasetForm() {
    this.showMyDatasets = false;
    this.resetSelectedDataset();
    //this.resetCbsAndRbs();        //TREBA DA SE DESI
  }

  selectThisDataset(dataset: Dataset) {
    this.selectedDataset = dataset;
    this.selectedDatasetLoaded = false;
    this.existingDatasetSelected = true;
    this.datasetHasHeader = this.selectedDataset.hasHeader;

    this.datasets.getDatasetFile(dataset.fileId).subscribe((file: string | undefined) => {
      if (file) {
        this.datasetFile = this.csv.csvToArray(file, (dataset.delimiter == "razmak") ? " " : (dataset.delimiter == "") ? "," : dataset.delimiter);
        /*for (let i = this.datasetFile.length - 1; i >= 0; i--) {  //moguce da je vise redova na kraju fajla prazno i sl.
          if (this.datasetFile[i].length != this.datasetFile[0].length)
            this.datasetFile[i].pop();
          else
            break; //nema potrebe dalje
        }*/
        //console.log(this.datasetFile);
        //this.resetCbsAndRbs();                        //TREBA DA SE DESI
        //this.refreshThreeNullValueRadioOptions();       //TREBA DA SE DESI
        this.selectedDatasetLoaded = true;
        //this.scrollToNextForm();
      }
    });
  }

  resetSelectedDataset(): boolean {
    const temp = this.selectedDataset;
    this.selectedDataset = this.otherDataset;
    this.otherDataset = temp;
    const tempFile = this.datasetFile;
    this.datasetFile = this.otherDatasetFile;
    this.otherDatasetFile = tempFile;

    this.selectedDatasetChangeEvent.emit(this.selectedDataset);

    return true;
  }


}
