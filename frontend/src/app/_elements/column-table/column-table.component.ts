import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChildren } from '@angular/core';
import Dataset, { ColumnType } from 'src/app/_data/Dataset';
import Experiment, { ColumnEncoding, Encoding, NullValReplacer, NullValueOptions } from 'src/app/_data/Experiment';
import { DatasetsService } from 'src/app/_services/datasets.service';
import { EncodingDialogComponent } from 'src/app/_modals/encoding-dialog/encoding-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MissingvaluesDialogComponent } from 'src/app/_modals/missingvalues-dialog/missingvalues-dialog.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { CsvParseService } from 'src/app/_services/csv-parse.service';
import { ProblemType } from 'src/app/_data/Model';
import { ExperimentsService } from 'src/app/_services/experiments.service';
import { SaveExperimentDialogComponent } from 'src/app/_modals/save-experiment-dialog/save-experiment-dialog.component';
import { AlertDialogComponent } from 'src/app/_modals/alert-dialog/alert-dialog.component';
import Shared from 'src/app/Shared';

@Component({
  selector: 'app-column-table',
  templateUrl: './column-table.component.html',
  styleUrls: ['./column-table.component.css']
})
export class ColumnTableComponent implements AfterViewInit {

  @Input() dataset?: Dataset;
  @Input() experiment!: Experiment;
  @Output() okPressed: EventEmitter<string> = new EventEmitter();
  @Output() columnTableChanged = new EventEmitter();

  Object = Object;
  Encoding = Encoding;
  NullValueOptions = NullValueOptions;
  ColumnType = ColumnType;
  ProblemType = ProblemType;
  tableData?: any[][];
  nullValOption: string[] = [];

  columnsChecked: boolean[] = []; //niz svih kolona
  loaded: boolean = false;


  constructor(private datasetService: DatasetsService, private experimentService: ExperimentsService, public csvParseService: CsvParseService, public dialog: MatDialog) {
    //ovo mi nece trebati jer primam dataset iz druge komponente
  }

  loadDataset(dataset: Dataset) {
    this.dataset = dataset;

    this.setColumnTypeInitial();

    this.dataset.columnInfo.forEach(column => {
      this.columnsChecked.push(true);
    });

    this.resetInputColumns();
    this.resetOutputColumn();
    this.resetColumnEncodings(Encoding.Label);
    this.setDeleteRowsForMissingValTreatment();

    this.nullValOption = [];
    this.dataset.columnInfo.forEach(colInfo => {
      this.nullValOption.push(`Obriši redove (${colInfo.numNulls})`);
    });

    this.datasetService.getDatasetFilePartial(this.dataset.fileId, 0, 10).subscribe((response: string | undefined) => {
      if (response && this.dataset != undefined) {
        this.tableData = this.csvParseService.csvToArray(response, (this.dataset.delimiter == "razmak") ? " " : (this.dataset.delimiter.toString() == "") ? "," : this.dataset.delimiter);
      }
    });
    this.loaded = true;
  }

  ngAfterViewInit(): void {

  }

  setColumnTypeInitial() {
    if (this.dataset != undefined) {
      for (let i = 0; i < this.dataset.columnInfo.length; i++) {
        this.dataset.columnInfo[i].columnType = (this.dataset.columnInfo[i].isNumber) ? ColumnType.numerical : ColumnType.categorical;
      }
    }
  }

  resetInputColumns() {
    if (this.dataset != undefined) {
      this.experiment.inputColumns = [];
      for (let i = 0; i < this.dataset?.columnInfo.length; i++) {
        this.experiment.inputColumns.push(this.dataset.columnInfo[i].columnName);
      }
    }
  }
  resetOutputColumn() {
    this.experiment.outputColumn = this.experiment.inputColumns[0];
  }

  setDeleteRowsForMissingValTreatment() {
    if (this.experiment != undefined) {
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

  columnTableChangeDetected() {
    this.columnTableChanged.emit();
  }

  columnTypeChanged(columnName: string) {
    if (this.experiment.outputColumn == columnName)
      this.changeOutputColumn(columnName);
    else
      this.columnTableChangeDetected();
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
        if (columnName == this.experiment.outputColumn)
          this.experiment.outputColumn = this.experiment.inputColumns[0];
      }
      this.columnTableChangeDetected();
    }
  }

  changeOutputColumn(columnName: string) {
    if (this.experiment != undefined && this.dataset != undefined) {
      let column = this.dataset.columnInfo.filter(x => x.columnName == this.experiment!.outputColumn)[0];
      if (column.columnType == ColumnType.numerical) {
        this.experiment.type = ProblemType.Regression;
      }
      else {
        if (column.uniqueValues!.length == 2)
          this.experiment.type = ProblemType.BinaryClassification;
        else
          this.experiment.type = ProblemType.MultiClassification;
      }
      this.columnTableChangeDetected();
    }
  }

  resetColumnEncodings(encodingType: Encoding) {
    if (this.experiment != undefined && this.dataset != undefined) {
      this.experiment.encodings = [];
      for (let i = 0; i < this.dataset?.columnInfo.length; i++) {
        this.experiment.encodings.push(new ColumnEncoding(this.dataset?.columnInfo[i].columnName, encodingType));
        //console.log(this.experiment.encodings);
      }
      this.columnTableChangeDetected();
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
          this.nullValOption[i] = "Obriši kolonu";
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
          let numOfRowsToDelete = (this.dataset.columnInfo.filter(x => x.columnName == this.experiment!.inputColumns[i])[0]).numNulls;
          this.nullValOption[i] = "Obriši redove (" + numOfRowsToDelete + ")";
        }
      }
      this.columnTableChangeDetected();
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

  openSaveExperimentDialog() {
    const dialogRef = this.dialog.open(SaveExperimentDialogComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(selectedName => {
      this.experiment.name = selectedName;
      //napravi odvojene dugmice za save i update -> za update nece da se otvara dijalog za ime
      this.experimentService.addExperiment(this.experiment).subscribe((response) => {
        this.experiment = response;
        this.okPressed.emit();
      });
    });
  }

  openUpdateExperimentDialog() {
    this.experimentService.updateExperiment(this.experiment).subscribe((response) => {
      Shared.openDialog("Izmena eksperimenta", "Uspešno ste izmenili podatke o eksperimentu.");
    });
  }

  MissValsDeleteClicked(event: Event, replacementType: NullValueOptions, index: number) {
    if (this.experiment != undefined && this.dataset != undefined) {
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

      let numOfRowsToDelete = (this.dataset.columnInfo.filter(x => x.columnName == this.experiment!.inputColumns[index])[0]).numNulls;
      this.nullValOption[index] = (replacementType == NullValueOptions.DeleteColumns) ? "Obriši kolonu" : "Obriši redove (" + numOfRowsToDelete + ")";
      this.columnTableChangeDetected();
    }
  }

  MissValsReplaceClicked(event: Event, columnName: string, index: number) {
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

      this.nullValOption[index] = "Popuni sa: " + fillValue;
      this.columnTableChangeDetected();
    }
  }
  getValue(columnName: string): string {
    if (<HTMLInputElement>document.getElementById(columnName) != undefined)
      return (<HTMLInputElement>document.getElementById(columnName)).value;
    return '0';
  }
  saveExperiment() {
    this.openSaveExperimentDialog();
  }
  updateExperiment() {
    this.openUpdateExperimentDialog();
  }


  tabs = [
    new Tab(0, 'Podešavanja kolona', Table.Columns),
    new Tab(1, 'Podaci', Table.Data),
    new Tab(2, 'Korelaciona matrica', Table.CorrelationMatrix)
  ]

  selectedTab: Tab = this.tabs[0];
  hoveringOverTab: (Tab | null) = null;

  tabToDisplay: Table = Table.Columns;

  selectTab(index: number) {
    this.selectedTab = this.tabs[index];
    this.tabToDisplay = this.tabs[index].value;
  }

  hoverOverTab(index: number) {
    if (index < 0) {
      this.hoveringOverTab = null;
      this.tabToDisplay = this.selectedTab.value;
    } else {
      this.hoveringOverTab = this.tabs[index];
      this.tabToDisplay = this.tabs[index].value;
    }
  }

  calcZIndex(i: number) {
    let zIndex = (this.tabs.length - i - 1)
    if (this.selectedTab.index == i)
      zIndex = this.tabs.length + 1;
    if (this.hoveringOverTab?.index == i)
      zIndex = this.tabs.length + 2;
    return zIndex;
  }

  Table = Table;
}

export enum Table {
  Columns,
  Data,
  CorrelationMatrix
}

export class Tab {
  constructor(
    public index: number,
    public name: string,
    public value: Table
  ) { }
}
