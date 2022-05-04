import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import Dataset from 'src/app/_data/Dataset';
import { DatasetsService } from 'src/app/_services/datasets.service';
import { ModelsService } from 'src/app/_services/models.service';
import shared from 'src/app/Shared';
import { DatatableComponent, TableData } from '../datatable/datatable.component';
import { CsvParseService } from 'src/app/_services/csv-parse.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-dataset',
  templateUrl: './form-dataset.component.html',
  styleUrls: ['./form-dataset.component.css']
})
export class FormDatasetComponent {

  @ViewChild(DatatableComponent) datatable!: DatatableComponent;

  nameFormControl = new FormControl('', [Validators.required, Validators.email]);

  delimiterOptions: Array<string> = [",", ";", "|", "razmak", "novi red"]; //podrazumevano ","

  csvRecords: any[] = [];
  files: File[] = [];
  rowsNumber: number = 0;
  colsNumber: number = 0;

  @Input() dataset: Dataset; //dodaj ! potencijalno

  tableData: TableData = new TableData();

  @ViewChild('fileInput') fileInput!: ElementRef

  filename: String;

  constructor(private modelsService: ModelsService, private datasetsService: DatasetsService, private csv: CsvParseService) {
    this.dataset = new Dataset();
    this.dataset.delimiter = ',';
    this.filename = "";
  }

  //@ViewChild('fileImportInput', { static: false }) fileImportInput: any; cemu je ovo sluzilo?

  clear(){
    this.tableData.hasInput = false;
  }

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

  firstInput = false;

  update() {

    this.firstInput = true

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

  loadExisting(){
    this.firstInput = false;

    this.tableData.hasInput = true;
    this.tableData.loaded = false;

    this.datasetsService.getDatasetFile(this.dataset.fileId).subscribe((file: string | undefined) => {
      if (file) {
        this.tableData.loaded = true;
        this.tableData.numRows = this.dataset.rowCount;
        this.tableData.numCols = this.dataset.columnInfo.length;
        this.tableData.data = this.csv.csvToArray(file, (this.dataset.delimiter == "razmak") ? " " : (this.dataset.delimiter == "") ? "," : this.dataset.delimiter);

      }
    });

    
  }

  /*exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.data, 'sample');
  }*/

  checkAccessible() {
    if (this.dataset.isPublic)
      this.dataset.accessibleByLink = true;
  }

  uploadDataset(onSuccess: Function = (dataset: Dataset) => { }, onError: Function = () => { }) {
    if (this.files[0] == undefined) {
      shared.openDialog("Greška", "Niste izabrali fajl za učitavanje.");
      return;
    }

    return this.modelsService.uploadData(this.files[0]).subscribe((file) => {
      //console.log('ADD MODEL: STEP 2 - ADD DATASET WITH FILE ID ' + file._id);
      this.dataset._id = "";
      this.dataset.fileId = file._id;
      this.dataset.uploaderId = shared.userId;

      this.datasetsService.addDataset(this.dataset).subscribe((dataset) => {
        onSuccess();
      }, (error) => {
        onError();
      }); //kraj addDataset subscribe
    }, (error) => {
      onError();
    }); //kraj uploadData subscribe
  }



}
