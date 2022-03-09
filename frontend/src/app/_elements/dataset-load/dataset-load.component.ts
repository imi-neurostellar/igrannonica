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

  header: string = "";
  headerOptions: Array<string> = ["Da", "Ne"]; //podrazumevano je "Da" ======> false

  slice: string = "";

  csvRecords: any[] = [];
  rowsNumber: number = 0;
  colsNumber: number = 0;

  constructor(private ngxCsvParser: NgxCsvParser) {
  }

  @ViewChild('fileImportInput', { static: false }) fileImportInput: any;

    changeListener($event: any): void {

    const files = $event.srcElement.files;

    this.ngxCsvParser.parse(files[0], { header: (this.header == "") ? false : (this.header == "Da") ? false : true, delimiter: (this.delimiter == "razmak") ? " " : (this.delimiter == "") ? "," : this.delimiter})
      .pipe().subscribe((result) => {

        console.log('Result', result);
        if (result.constructor === Array) {
          this.csvRecords = result;
          this.rowsNumber = this.csvRecords.length;
          this.colsNumber = this.csvRecords[0].length;
        }
        
      }, (error: NgxCSVParserError) => {
        console.log('Error', error);
      });

  }


}
