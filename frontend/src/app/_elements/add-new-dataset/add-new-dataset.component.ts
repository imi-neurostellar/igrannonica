import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import Dataset from 'src/app/_data/Dataset';
import { DatasetsService } from 'src/app/_services/datasets.service';
import { ModelsService } from 'src/app/_services/models.service';
import shared from 'src/app/Shared';
import { DatatableComponent, TableData } from '../datatable/datatable.component';
import { CsvParseService } from 'src/app/_services/csv-parse.service';

@Component({
  selector: 'app-add-new-dataset',
  templateUrl: './add-new-dataset.component.html',
  styleUrls: ['./add-new-dataset.component.css']
})
export class AddNewDatasetComponent {

  @ViewChild(DatatableComponent) datatable!: DatatableComponent;

  delimiterOptions: Array<string> = [",", ";",  "|", "razmak", "novi red"]; //podrazumevano ","

  csvRecords: any[] = [];
  files: File[] = [];
  rowsNumber: number = 0;
  colsNumber: number = 0;

  dataset: Dataset; //dodaj ! potencijalno

  tableData: TableData = new TableData();

  constructor(private modelsService: ModelsService, private datasetsService: DatasetsService, private csv: CsvParseService) {
    this.dataset = new Dataset();
    this.dataset.delimiter = ',';
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

        if (this.dataset.hasHeader)
          this.csvRecords = result.splice(0, 11);
        else
          this.csvRecords = result.splice(0, 10);

        this.colsNumber = result[0].length;
        this.rowsNumber = result.length;

        this.tableData.data = this.csvRecords
        this.tableData.hasHeader = this.dataset.hasHeader;
        this.tableData.loaded = true;
        this.tableData.numCols = this.colsNumber;
        this.tableData.numRows = this.rowsNumber;
      }
    }
    fileReader.readAsText(this.files[0]);
  }

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

}
