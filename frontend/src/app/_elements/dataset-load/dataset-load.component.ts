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

  checkedInputCols: Array<string> = [];
  checkedOutputCol: string = '';

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

  getCheckedInputCols() : Array<string> {
    this.checkedInputCols = new Array<string>();
    let checkboxes = document.getElementsByName("cbs");

    for (let i = 0; i < checkboxes.length; i++) {
      let thatCb = <HTMLInputElement>checkboxes[i];
      if (thatCb.checked)
        this.checkedInputCols.push(thatCb.value);
    }
    //console.log(this.checkedInputCols);
    return this.checkedInputCols;
  }
  getCheckedOutputCol() : string {
    this.checkedOutputCol = '';
    let radiobuttons = document.getElementsByName("rbs");

    for (let i = 0; i < radiobuttons.length; i++) {
      let thatRb = <HTMLInputElement>radiobuttons[i];
      if (thatRb.checked) {
        this.checkedOutputCol = thatRb.value;
        break; 
      }
    }
    //console.log(this.checkedOutputCol);
    return this.checkedOutputCol;
  }
  validationInputsOutput() {
    if (this.checkedInputCols.length == 0) {
      alert("Molimo Vas da izaberete ulaznu kolonu/kolone za mrežu.")
      return;
    } 
    for (let i = 0; i < this.checkedInputCols.length; i++) {  
      if (this.checkedInputCols[i] == this.checkedOutputCol) {
        let colName = this.checkedOutputCol;
        alert("Izabrali ste istu kolonu (" + colName + ") kao ulaznu i izlaznu iz mreže. Korigujte izbor.");
        return;
      }
    }
  }
}
