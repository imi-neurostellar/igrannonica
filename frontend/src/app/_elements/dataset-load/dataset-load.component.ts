import { Component, ViewChild } from '@angular/core';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';

@Component({
  selector: 'app-dataset-load',
  templateUrl: './dataset-load.component.html',
  styleUrls: ['./dataset-load.component.css']
})
export class DatasetLoadComponent {

  delimiter: string = "";
  delimiterOptions: Array<string> = [",", ";", "\t", "razmak", "|"]; //podrazumevano ","

  hasHeader: boolean = true;

  slice: string = "";

  csvRecords: any[] = [];
  files: any[] = [];
  rowsNumber: number = 0;
  colsNumber: number = 0;

  constructor(private ngxCsvParser: NgxCsvParser) {
  }

  @ViewChild('fileImportInput', { static: false }) fileImportInput: any;

  changeListener($event: any): void {
    this.files = $event.srcElement.files;
    this.update();
  }

  update() {

    if (this.files.length < 1)
      return;

    this.ngxCsvParser.parse(this.files[0], { header: false, delimiter: (this.delimiter == "razmak") ? " " : (this.delimiter == "") ? "," : this.delimiter})
    .pipe().subscribe((result) => {

      console.log('Result', result);
      if (result.constructor === Array) {
        this.csvRecords = result;
        if (this.hasHeader)
          this.rowsNumber = this.csvRecords.length - 1;
        else 
          this.rowsNumber = this.csvRecords.length;
        this.colsNumber = this.csvRecords[0].length;
      }
    }, (error: NgxCSVParserError) => {
      console.log('Error', error);
    });
  }
}
