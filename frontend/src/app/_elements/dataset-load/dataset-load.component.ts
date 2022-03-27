import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import Dataset from 'src/app/_data/Dataset';

@Component({
  selector: 'app-dataset-load',
  templateUrl: './dataset-load.component.html',
  styleUrls: ['./dataset-load.component.css']
})
export class DatasetLoadComponent {

  @Output() loaded = new EventEmitter<string>();

  delimiterOptions: Array<string> = [",", ";", "\t", "razmak", "|"]; //podrazumevano ","

  //hasHeader: boolean = true;
  hasInput: boolean = false;

  csvRecords: any[] = [];
  files: File[] = [];
  rowsNumber: number = 0;
  colsNumber: number = 0;

  dataset: Dataset; //dodaj ! potencijalno

  constructor(private ngxCsvParser: NgxCsvParser) {
    this.dataset = new Dataset();
  }

  @ViewChild('fileImportInput', { static: false }) fileImportInput: any;

  changeListener($event: any): void {
    this.files = $event.srcElement.files;
    if (this.files.length == 0 || this.files[0] == null) {
      //console.log("NEMA FAJLA");
      //this.loaded.emit("not loaded");
      this.hasInput = false;
      return;
    }
    else
      this.hasInput = true;

    this.update();
  }

  update() {

    if (this.files.length < 1)
      return;

    this.ngxCsvParser.parse(this.files[0], { header: false, delimiter: (this.dataset.delimiter == "razmak") ? " " : (this.dataset.delimiter == "") ? "," : this.dataset.delimiter })
      .pipe().subscribe((result) => {

        console.log('Result', result);
        if (result.constructor === Array) {
          this.csvRecords = result;
          if (this.dataset.hasHeader)
            this.rowsNumber = this.csvRecords.length - 1;
          else
            this.rowsNumber = this.csvRecords.length;
          this.colsNumber = this.csvRecords[0].length;

          if (this.dataset.hasHeader) //kasnije dodati opciju kada nema header da korisnik rucno unosi header-e
            this.dataset.header = this.csvRecords[0];

          this.loaded.emit("loaded");
        }
      }, (error: NgxCSVParserError) => {
        console.log('Error', error);
      });
  }

  checkAccessible() {
    if (this.dataset.isPublic)
      this.dataset.accessibleByLink = true;
  }

}
