import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChildren } from '@angular/core';
import Dataset from 'src/app/_data/Dataset';
import Experiment, { ColumnEncoding, Encoding, NullValReplacer, NullValueOptions } from 'src/app/_data/Experiment';
import { DatasetsService } from 'src/app/_services/datasets.service';
import { EncodingDialogComponent } from 'src/app/_modals/encoding-dialog/encoding-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MissingvaluesDialogComponent } from 'src/app/_modals/missingvalues-dialog/missingvalues-dialog.component';
import { MatSliderChange } from '@angular/material/slider';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { CsvParseService } from 'src/app/_services/csv-parse.service';

@Component({
  selector: 'app-column-table',
  templateUrl: './column-table.component.html',
  styleUrls: ['./column-table.component.css']
})
export class ColumnTableComponent implements AfterViewInit {

  @Input() dataset?: Dataset;
  @Input() experiment?: Experiment;
  @ViewChildren("nullValMenu") nullValMenus!: ElementRef[];
  @Output() okPressed: EventEmitter<string> = new EventEmitter();
  Object = Object;
  Encoding = Encoding;
  NullValueOptions = NullValueOptions;
  tableData?: any[][];
  nesto = 10;

  testSetDistribution:number=70;
  constructor(private datasetService: DatasetsService, public csvParseService: CsvParseService, public dialog: MatDialog) { 
    //ovo mi nece trebati jer primam dataset iz druge komponente
  }

  ngAfterViewInit(): void {
    this.datasetService.getMyDatasets().subscribe((datasets) => {
      this.dataset = datasets[0];
      //console.log(this.dataset);
      this.experiment = new Experiment();
      for (let i = 0; i < this.dataset?.columnInfo.length; i++) {
        this.experiment?.inputColumns.push(this.dataset.columnInfo[i].columnName);
      }
      this.resetColumnEncodings(Encoding.Label);
      this.setDeleteColumnsForMissingValTreatment();

      /*this.datasetService.getDatasetFile(this.dataset._id).subscribe((file: string | undefined) => {
        if (file) {
          //this.tableData = this.csv.csvToArray(file, (dataset.delimiter == "razmak") ? " " : (dataset.delimiter == "") ? "," : dataset.delimiter);
        }
      });*/
      this.datasetService.getDatasetFilePartial(this.dataset.fileId, 0, 10).subscribe((response: string | undefined) => {
        if (response && this.dataset != undefined) {
          this.tableData = this.csvParseService.csvToArray(response, (this.dataset.delimiter == "razmak") ? " " : (this.dataset.delimiter == "") ? "," : this.dataset.delimiter);
          console.log(this.tableData);
        }
      });
    });
  }

  setDeleteColumnsForMissingValTreatment() {
    console.log("USAOOOO");
    if (this.experiment != undefined) {
      this.experiment.nullValues = NullValueOptions.DeleteColumns;
      this.experiment.nullValuesReplacers = [];
      console.log("duzina",this.experiment.inputColumns.length);
      for (let i = 0; i < this.experiment.inputColumns.length; i++) {
        this.experiment.nullValuesReplacers.push({
          column: this.experiment.inputColumns[i],
          option: NullValueOptions.DeleteColumns,
          value: ""
        });
        console.log(i);
      }
      //console.log("len",this.nullValMenus.length);
      this.nullValMenus.forEach((menu) => {
        //console.log(menu.nativeElement);
        menu.nativeElement.textContent = "Obriši kolonu";
      });
    }
  }

  changeInputColumns(targetMatCheckbox: MatCheckboxChange, columnName: string) {
    if (this.experiment != undefined) {
      if (targetMatCheckbox.checked) {
        if (this.experiment.inputColumns.filter(x => x == columnName)[0] == undefined) {
          this.experiment.inputColumns.push(columnName);
        }
      }
      else {
        this.experiment.inputColumns = this.experiment.inputColumns.filter(x => x != columnName);
        //console.log("Input columns: ", this.experiment.inputColumns);
        //TODO: da se zatamni kolona koja je unchecked
        //this.experiment.encodings = this.experiment.encodings.filter(x => x.columnName != columnName); samo na kraju iz enkodinga skloni necekirane
        this.experiment.nullValuesReplacers = this.experiment.nullValuesReplacers.filter(x => x.column != columnName);
      }
    }
  }

  resetColumnEncodings(encodingType: Encoding) {
    if (this.experiment != undefined && this.dataset != undefined) {
      this.experiment.encodings = [];
      for (let i = 0; i < this.dataset?.columnInfo.length; i++) {
        this.experiment.encodings.push(new ColumnEncoding(this.dataset?.columnInfo[i].columnName, encodingType));
        //console.log(this.experiment.encodings);
      }
    }
  }
  openEncodingDialog() {
      const dialogRef = this.dialog.open(EncodingDialogComponent, {
        width: '300px'
      });
      dialogRef.afterClosed().subscribe(selectedEncoding => {
        if (selectedEncoding != undefined)
          this.resetColumnEncodings(selectedEncoding);
      });
  }

  resetMissingValuesTreatment(selectedMissingValuesOption: NullValueOptions) {
    if (this.experiment != undefined && this.dataset != undefined) {

      if (selectedMissingValuesOption == NullValueOptions.DeleteColumns) {
        this.experiment.nullValues = NullValueOptions.DeleteColumns;
        this.experiment.nullValuesReplacers = [];
        for (let i = 0; i < this.experiment.inputColumns.length; i++) {
          this.experiment.nullValuesReplacers.push({
            column: this.experiment.inputColumns[i],
            option: NullValueOptions.DeleteColumns,
            value: ""
          });
          (<HTMLInputElement>document.getElementById("main_" + this.experiment.inputColumns[i])).textContent = "Obriši kolonu";
        }
      } 
      else if (selectedMissingValuesOption == NullValueOptions.DeleteRows) {
        this.experiment.nullValues = NullValueOptions.DeleteRows;
        this.experiment.nullValuesReplacers = [];
        for (let i = 0; i < this.experiment.inputColumns.length; i++) {
          this.experiment.nullValuesReplacers.push({
            column: this.experiment.inputColumns[i],
            option: NullValueOptions.DeleteRows,
            value: ""
          });
          (<HTMLInputElement>document.getElementById("main_" + this.experiment.inputColumns[i])).textContent = "Obriši redove";
        }
      }
    }
  }
  openMissingValuesDialog() {
    const dialogRef = this.dialog.open(MissingvaluesDialogComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(selectedMissingValuesOption => {
      if (selectedMissingValuesOption != undefined) 
        this.resetMissingValuesTreatment(selectedMissingValuesOption);
    });
  }
  updateTestSet(event:MatSliderChange){
    this.testSetDistribution=event.value!;
  }


  MissValsDeleteClicked(event: Event, replacementType: NullValueOptions) {
    if (this.experiment != undefined) {
      let columnName = (<HTMLInputElement>event.currentTarget).value;
      let arrayElement = this.experiment.nullValuesReplacers.filter(x => x.column == columnName)[0];

      if (arrayElement == undefined) {
        this.experiment.nullValuesReplacers.push({
          column: columnName,
          option: (replacementType == NullValueOptions.DeleteColumns) ? NullValueOptions.DeleteColumns : NullValueOptions.DeleteRows,
          value: ""
        });
      }
      else {
        arrayElement.option = (replacementType == NullValueOptions.DeleteColumns) ? NullValueOptions.DeleteColumns : NullValueOptions.DeleteRows;
        arrayElement.value = "";
      }

      (<HTMLInputElement>document.getElementById("main_" + columnName)).textContent = (replacementType == NullValueOptions.DeleteColumns) ? "Obriši kolonu" : "Obriši redove";
    }
  }

  MissValsReplaceClicked(event: Event, columnName: string) {
    if (this.experiment != undefined) {
      let fillValue = (<HTMLInputElement>event.currentTarget).value;
      let arrayElement = this.experiment.nullValuesReplacers.filter(x => x.column == columnName)[0];
      
      if (arrayElement == undefined) {
        this.experiment.nullValuesReplacers.push({
          column: columnName,
          option: NullValueOptions.Replace,
          value: fillValue
        });
      }
      else {
        arrayElement.option = NullValueOptions.Replace;
        arrayElement.value = fillValue;
      }

      (<HTMLInputElement>document.getElementById("main_" + columnName)).textContent = "Popuni sa: " + fillValue;
    }
  }
  getValue(columnName: string): string {
    if (<HTMLInputElement>document.getElementById(columnName) != undefined)
      return (<HTMLInputElement>document.getElementById(columnName)).value;
    return '0';
  }
  ok() {
    this.okPressed.emit();
  }


} 
