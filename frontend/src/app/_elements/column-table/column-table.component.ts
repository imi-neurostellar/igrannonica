import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import Dataset from 'src/app/_data/Dataset';
import Experiment, { ColumnEncoding, Encoding, ColumnType, NullValueOptions } from 'src/app/_data/Experiment';
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
import { PieChartComponent } from '../_charts/pie-chart/pie-chart.component';
import { BoxPlotComponent } from '../_charts/box-plot/box-plot.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-column-table',
  templateUrl: './column-table.component.html',
  styleUrls: ['./column-table.component.css']
})
export class ColumnTableComponent implements AfterViewInit {

  @ViewChildren(BoxPlotComponent) boxplotComp!: QueryList<BoxPlotComponent>;
  @ViewChildren(PieChartComponent) piechartComp!: QueryList<PieChartComponent>;
  @Input() dataset?: Dataset;
  @Input() experiment!: Experiment;
  @Output() okPressed: EventEmitter<string> = new EventEmitter();
  @Output() columnTableChanged = new EventEmitter();
  @Output() experimentChanged = new EventEmitter();

  Object = Object;
  Encoding = Encoding;
  NullValueOptions = NullValueOptions;
  ColumnType = ColumnType;
  ProblemType = ProblemType;
  tableData?: any[][];
  nullValOption: string[] = [];

  columnsChecked: boolean[] = []; //niz svih kolona
  loaded: boolean = false;

  begin:number=0;
  step:number=10;



  constructor(private datasetService: DatasetsService, private experimentService: ExperimentsService, public csvParseService: CsvParseService, public dialog: MatDialog, private route: ActivatedRoute) {
  }
  resetPagging(){
    this.begin=0;
  }
  goBack(){
    if(this.begin-10<0)
      this.begin=0;
    else
    {
      this.begin-=10;
      this.loadData();
    }

  }
  goForward(){
    if(this.dataset!=undefined){
    this.begin+=10;
    if(this.dataset.rowCount<this.begin)
      this.begin-=10;
    else
      this.loadData();
    }
  }
  getPage(){
    if(this.dataset!=undefined)
      return Math.ceil(this.dataset.rowCount/this.step);
    return 0;
  }


  updateCharts() {
    //min: number, max: number, q1: number, q3: number, median: number
    let i = 0;
    this.boxplotComp.changes.subscribe(() => {
      const bps = this.boxplotComp.toArray();
      this.dataset?.columnInfo.forEach((colInfo, index) => {
        if (this.experiment.columnTypes[index] == ColumnType.numerical) {
          bps[i].updateChart(colInfo!.min, colInfo.max, colInfo.q1, colInfo.q3, colInfo.median);
          i++;
        }
      });
    });
  }

  updatePieChart() {
    //min: number, max: number, q1: number, q3: number, median: number
    let i = 0;
    const pieChart = this.piechartComp.toArray();
    console.log(pieChart)
    this.dataset?.columnInfo.forEach((colInfo, index) => {
      console.log(i)
      if (this.experiment.columnTypes[index] == ColumnType.categorical) {
        console.log("prosao IF")
        pieChart[i].updatePieChart(colInfo!.uniqueValues, colInfo.uniqueValuesPercent);
        i++;
      }
    });
  }

  loadDataset(dataset: Dataset) {
    console.log("LOADED DATASET");

    if (this.route.snapshot.paramMap.get("id") == null) {
      this.dataset = dataset;
      this.setColumnTypeInitial();
  
      this.columnsChecked = [];
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
    }
    else {
      this.dataset = dataset;
      this.experimentChanged.emit();
      this.columnsChecked = [];
      this.dataset.columnInfo.forEach(column => {
        if (this.experiment.inputColumns.find(x => x == column.columnName) != undefined)
          this.columnsChecked.push(true);
        else
          this.columnsChecked.push(false);
      });
      this.nullValOption = [];
      for (let i = 0; i < this.dataset!.columnInfo.length; i++) {
        let nullValRep = this.experiment.nullValuesReplacers.find(x => x.column == this.dataset!.columnInfo[i].columnName);
        if (nullValRep != undefined) {
          if (nullValRep.option == NullValueOptions.DeleteRows)
            this.nullValOption.push(`Obriši redove (${this.dataset.columnInfo[i].numNulls})`);
          else if (nullValRep.option == NullValueOptions.DeleteColumns)
          this.nullValOption.push(`Obriši kolonu`);
          else {
            this.nullValOption.push(`Popuni sa ${nullValRep.value}`);
          }
        }
        else 
          this.nullValOption.push(`Obriši redove (${this.dataset.columnInfo[i].numNulls})`);
      }
    }
    this.resetPagging();
    this.loadData();
    this.loaded = true;
  }

  loadData(){
    if(this.dataset!=undefined)
    this.datasetService.getDatasetFilePartial(this.dataset.fileId, this.begin, this.step).subscribe((response: string | undefined) => {
      if (response && this.dataset != undefined) {
        this.tableData = this.csvParseService.csvToArray(response, (this.dataset.delimiter == "razmak") ? " " : (this.dataset.delimiter == "novi red") ? "\t" : this.dataset.delimiter);
      }
    });
  }

  ngAfterViewInit(): void {
  }

  setColumnTypeInitial() {
    if (this.dataset != undefined) {
      for (let i = 0; i < this.dataset.columnInfo.length; i++) {
        this.experiment.columnTypes[i] = (this.dataset.columnInfo[i].isNumber) ? ColumnType.numerical : ColumnType.categorical;
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
    if (this.experiment.inputColumns.length > 0)
      this.experiment.outputColumn = this.experiment.inputColumns[0];
    else
      this.experiment.outputColumn = '-';
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
      this.changeProblemType();
    else
      this.columnTableChangeDetected();
  }

  changeInputColumns(targetMatCheckbox: MatCheckboxChange, columnName: string) {
    if (this.experiment != undefined) {

      if (targetMatCheckbox.checked) {
        if (this.experiment.inputColumns.filter(x => x == columnName)[0] == undefined) {
          this.experiment.inputColumns.push(columnName);
        }
        if (this.experiment.inputColumns.length == 1)
          this.experiment.outputColumn = this.experiment.inputColumns[0];
      }
      else {
        this.experiment.inputColumns = this.experiment.inputColumns.filter(x => x != columnName);
        //console.log("Input columns: ", this.experiment.inputColumns);
        //TODO: da se zatamni kolona koja je unchecked
        //this.experiment.encodings = this.experiment.encodings.filter(x => x.columnName != columnName); samo na kraju iz enkodinga skloni necekirane
        this.experiment.nullValuesReplacers = this.experiment.nullValuesReplacers.filter(x => x.column != columnName);
        if (columnName == this.experiment.outputColumn) {
          if (this.experiment.inputColumns.length > 0)
            this.experiment.outputColumn = this.experiment.inputColumns[0];
          else
            this.experiment.outputColumn = '-';
        }
      }
      this.columnTableChangeDetected();
    }
  }

  outputColumnChanged() {
    let outputColReplacer = this.experiment.nullValuesReplacers.find(x => x.column == this.experiment.outputColumn);
    let index = this.experiment.nullValuesReplacers.findIndex(x => x.column == this.experiment.outputColumn);
    if (outputColReplacer != undefined) {
      outputColReplacer.option = NullValueOptions.DeleteRows;
      
      let numOfRowsToDelete = (this.dataset!.columnInfo.filter(x => x.columnName == this.experiment.outputColumn)[0]).numNulls;
      this.nullValOption[index] = "Obriši redove (" + numOfRowsToDelete + ")";
    }

    this.changeProblemType();
  }

  changeProblemType() {
    if (this.experiment != undefined && this.dataset != undefined) {
      let i = this.dataset.columnInfo.findIndex(x => x.columnName == this.experiment!.outputColumn);
      if (i == -1 || this.experiment.columnTypes[i] == ColumnType.numerical) {
        this.experiment.type = ProblemType.Regression;
      }
      else {
        if (this.dataset.columnInfo[i].uniqueValues!.length == 2)
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
      for (let i = 0; i < this.dataset.columnInfo.length; i++) {
        this.experiment.encodings.push(new ColumnEncoding(this.dataset?.columnInfo[i].columnName, encodingType));
        //console.log(this.experiment.encodings);
      }
      this.columnTableChangeDetected();
    }
  }
  resetColumnEncodingsGlobalSetting(encodingType: Encoding) {
    if (this.experiment != undefined && this.dataset != undefined) {
      for (let i = 0; i < this.dataset.columnInfo.length; i++) {
        if (this.experiment.columnTypes[i] == ColumnType.categorical && this.dataset.columnInfo[i].columnName != this.experiment.outputColumn) //promeni
          this.experiment.encodings[i].encoding = encodingType;
      }
      this.columnTableChangeDetected();
    }
  }
  openEncodingDialog() {
    const dialogRef = this.dialog.open(EncodingDialogComponent, {
      width: '400px',
      data: { experiment: this.experiment, dataset: this.dataset }
    });
    dialogRef.afterClosed().subscribe(selectedEncoding => {
      if (selectedEncoding != undefined)
        this.resetColumnEncodingsGlobalSetting(selectedEncoding);
    });
  }

  resetMissingValuesTreatment(selectedMissingValuesOption: NullValueOptions) {
    if (this.experiment != undefined && this.dataset != undefined) {

      if (selectedMissingValuesOption == NullValueOptions.DeleteColumns) {
        this.experiment.nullValues = NullValueOptions.DeleteColumns;

        let outputColReplacer = this.experiment.nullValuesReplacers.find(x => x.column == this.experiment.outputColumn);

        this.experiment.nullValuesReplacers = [];
        for (let i = 0; i < this.experiment.inputColumns.length; i++) {
          if (this.experiment.inputColumns[i] != this.experiment.outputColumn) {
            this.experiment.nullValuesReplacers.push({ //ovo zakomentarisano
              column: this.experiment.inputColumns[i],
              option: NullValueOptions.DeleteColumns,
              value: ""
            });
            this.nullValOption[i] = "Obriši kolonu";
          }
          else {
            if (outputColReplacer != undefined) {
              this.experiment.nullValuesReplacers.push(outputColReplacer);
              let numOfRowsToDelete = (this.dataset.columnInfo.filter(x => x.columnName == this.experiment!.inputColumns[i])[0]).numNulls;
              this.nullValOption[i] = (outputColReplacer.option == NullValueOptions.DeleteRows) ? "Obriši redove (" + numOfRowsToDelete + ")" : "Popuni sa " + outputColReplacer.value + "";
            }
          }
        }
        //obrisi kolone koje sadrze nedostajuce vrednosti iz input kolona 
        /*for (let i = 0; i < this.dataset.columnInfo.length; i++) {
          if (this.dataset.columnInfo[i].numNulls > 0) {
            this.experiment.inputColumns = this.experiment.inputColumns.filter(x => x != this.dataset!.columnInfo[i].columnName);
            this.columnsChecked[i] = false;
            console.log(this.dataset!.columnInfo[i].columnName);
          }
        }*/
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
      width: '500px',
      panelClass: 'custom-modalbox'
    });
    dialogRef.afterClosed().subscribe(selectedMissingValuesOption => {
      if (selectedMissingValuesOption != undefined)
        this.resetMissingValuesTreatment(selectedMissingValuesOption);
    });
  }

  openSaveExperimentDialog() {
    const dialogRef = this.dialog.open(SaveExperimentDialogComponent, {
      width: '400px',
      data: { experiment: this.experiment }
    });
    dialogRef.afterClosed().subscribe(experiment => {
      if (experiment) {
        Object.assign(this.experiment, experiment);
        this.experiment._columnsSelected = true;
        this.experimentChanged.emit();
        console.log(this.experiment);
      }
    });
  }

  openUpdateExperimentDialog() {
    this.experimentService.updateExperiment(this.experiment).subscribe((response) => {
      Object.assign(this.experiment, response);
      this.experiment._columnsSelected = true;
      this.experimentChanged.emit();
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
    if (this.experiment.inputColumns.length == 0)
      Shared.openDialog("Upozorenje", "Kako bi eksperiment bio uspešno izveden, neophodno je da izaberete barem dve kolone koje ćete koristiti.");
    else if (this.experiment.inputColumns.length == 1)
      Shared.openDialog("Upozorenje", "Kako bi eksperiment bio uspešno izveden, neophodno je da izaberete barem dve kolone koje ćete koristiti (mora postojati bar jedna ulazna i jedna izlazna kolona).");
    else
      this.openSaveExperimentDialog();
  }
  updateExperiment() {
    if (this.experiment.inputColumns.length == 0)
      Shared.openDialog("Upozorenje", "Kako bi eksperiment bio uspešno izveden, neophodno je da izaberete barem dve kolone koje ćete koristiti.");
    else if (this.experiment.inputColumns.length == 1)
      Shared.openDialog("Upozorenje", "Kako bi eksperiment bio uspešno izveden, neophodno je da izaberete barem dve kolone koje ćete koristiti (mora postojati bar jedna ulazna i jedna izlazna kolona).");
    else
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
    } else {
      this.hoveringOverTab = this.tabs[index];
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


