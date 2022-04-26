import { Component, Input, OnInit } from '@angular/core';
import Dataset from 'src/app/_data/Dataset';
import Experiment, { ColumnEncoding, Encoding, NullValReplacer, NullValueOptions } from 'src/app/_data/Experiment';
import { DatasetsService } from 'src/app/_services/datasets.service';
import { EncodingDialogComponent } from 'src/app/_modals/encoding-dialog/encoding-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MissingvaluesDialogComponent } from 'src/app/_modals/missingvalues-dialog/missingvalues-dialog.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatMenuItem, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-column-table',
  templateUrl: './column-table.component.html',
  styleUrls: ['./column-table.component.css']
})
export class ColumnTableComponent implements OnInit {

  @Input() dataset?: Dataset;
  @Input() experiment?: Experiment;

  Object = Object;
  Encoding = Encoding;
  NullValueOptions = NullValueOptions;

  constructor(private datasetService: DatasetsService, public dialog: MatDialog) { 
    //ovo mi nece trebati jer primam dataset iz druge komponente
    this.datasetService.getMyDatasets().subscribe((datasets) => {
      this.dataset = datasets[0];
      //console.log(this.dataset);
      this.experiment = new Experiment();
      for (let i = 0; i < this.dataset?.columnInfo.length; i++) {
        this.experiment?.inputColumns.push(this.dataset.columnInfo[i].columnName);
      }
      this.resetColumnEncodings(Encoding.Label);
    });
  }

  ngOnInit(): void {
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

}
