import { Component, OnInit } from '@angular/core';
import Experiment, { NullValReplacer, NullValueOptions, ReplaceWith, Encoding } from '../_data/Experiment';
import Model, { ProblemType } from '../_data/Model';
import Dataset, { ColumnInfo } from '../_data/Dataset';
import { ModelsService } from '../_services/models.service';
import Shared from '../Shared';
import { ExperimentsService } from '../_services/experiments.service';
import { ColumnEncoding } from '../_data/Experiment';
import { Router } from '@angular/router';
import { TrainingComponent } from '../training/training.component';
import { NEVER, retryWhen } from 'rxjs';

@Component({
  selector: 'app-experiment',
  templateUrl: './experiment.component.html',
  styleUrls: ['./experiment.component.css']
})
export class ExperimentComponent implements OnInit {

  experiment: Experiment = new Experiment();
  selectedModel?: Model;
  selectedDataset?: Dataset;
  trainingResult: any; // any za sad, promeni kasnije

  NullValueOptions = NullValueOptions;
  ReplaceWith = ReplaceWith;
  Encoding = Encoding;
  ColumnEncoding = ColumnEncoding;
  Object = Object;
  ProblemType = ProblemType;
  selectedColumnsInfoArray: ColumnInfo[] = [];
  selectedNotNullColumnsArray: string[] = [];

  tempTestSetDistribution = 90;
  carouselIndex: number = 0;

  constructor(private experimentsService: ExperimentsService, private router: Router) {
  }

  ngOnInit(): void {
  }

  updateDataset(dataset: Dataset) {
    this.selectedDataset = dataset;
    this.selectedColumnsInfoArray = this.selectedDataset.columnInfo;
    this.selectedNotNullColumnsArray = [];
    this.experiment.outputColumn = this.selectedDataset.columnInfo[this.selectedDataset.columnInfo.length - 1].columnName;

    this.resetColumnEncodings();
  }

  resetColumnEncodings() {
    this.experiment.encodings = [];
    for (let i = 0; i < this.selectedColumnsInfoArray.length; i++) {
      this.experiment.encodings.push(new ColumnEncoding(this.selectedColumnsInfoArray[i].columnName, Encoding.Label));
    }
  }

  getInputById(id: string): HTMLInputElement {
    return document.getElementById(id) as HTMLInputElement;
  }

  arrayColumn = (arr: any[][], n: number) => [...this.dropEmptyString(new Set(arr.map(x => x[n])))];

  dropEmptyString(set: Set<any>): Set<string> {
    if (set.has(""))
      set.delete("");
    if (set.has(null))
      set.delete(null);
    if (set.has(undefined))
      set.delete(undefined);
    return set;
  }

  emptyFillTextInput(colName: string) {
    (<HTMLInputElement>document.getElementById("fillText_" + colName)).value = "";
  }

  checkFillColRadio(colName: string) {
    (<HTMLInputElement>document.getElementById("fillCol_" + colName)).checked = true;
  }

  checkedColumnsChanged(checkedColumnInfo: ColumnInfo, buttonType: number) { //0-input,1-output
    let col = this.selectedColumnsInfoArray.find(x => x.columnName == checkedColumnInfo.columnName);
    if (buttonType == 0) { //inputCol
      if (col == undefined)
        this.selectedColumnsInfoArray.push(checkedColumnInfo);
      else
        this.selectedColumnsInfoArray = this.selectedColumnsInfoArray.filter(x => x.columnName != checkedColumnInfo.columnName);
    }
    else { //outputCol
      if (col == undefined) //ako je vec cekiran neki output, samo dodaj sad ovaj, a taj output postaje input i ostaje u nizu
        this.selectedColumnsInfoArray.push(checkedColumnInfo);
    }
    //console.log(this.selectedColumnsInfoArray);
  }

  replace(event: Event, column: ColumnInfo) {
    let option = (<HTMLInputElement>event.target).value;

    const input = (<HTMLInputElement>document.getElementById("fillText_" + column.columnName));
    if (column.isNumber) {
      switch (option) {
        case ReplaceWith.Max:
          input.value = "" + column.max;
          break;
        case ReplaceWith.Min:
          input.value = "" + column.min;
          break;
        case ReplaceWith.Mean:
          input.value = "" + column.mean;
          break;
        case ReplaceWith.Median:
          input.value = "" + column.median;
          break;
        case ReplaceWith.None:
          break;
      }
    } else {
      input.value = option;
    }
  }

  getSelectedColumnsArrayWithoutNullVals(): string[] {
    let colNames: string[] = [];

    for (let i = 0; i < this.selectedColumnsInfoArray.length; i++) {
      let oneColInfo = this.selectedColumnsInfoArray[i];
      if (oneColInfo.numNulls == 0)
        colNames.push(oneColInfo.columnName);
    }
    return colNames;
  }

  getNullValuesReplacersArray(): NullValReplacer[] {
    let array: NullValReplacer[] = [];

    if (this.experiment.nullValues == NullValueOptions.Replace) {

      for (let i = 0; i < this.selectedColumnsInfoArray.length; i++) {
        let oneColInfo = this.selectedColumnsInfoArray[i];

        if (oneColInfo.numNulls > 0) { //ako kolona nema null vrednosti, ne dodajemo je u niz
          if ((<HTMLInputElement>document.getElementById("delCol_" + oneColInfo.columnName))?.checked) {
            array.push({
              column: oneColInfo.columnName,
              option: NullValueOptions.DeleteColumns,
              value: ""
            });
          }
          else if ((<HTMLInputElement>document.getElementById("delRows_" + oneColInfo.columnName)).checked) {
            array.push({
              column: oneColInfo.columnName,
              option: NullValueOptions.DeleteRows,
              value: ""
            });
          }
          else if (((<HTMLInputElement>document.getElementById("fillCol_" + oneColInfo.columnName)).checked)) {
            array.push({
              column: oneColInfo.columnName,
              option: NullValueOptions.Replace,
              value: (<HTMLInputElement>document.getElementById("fillText_" + oneColInfo.columnName)).value
            });
          }
        }
      }
    }
    return array;
  }

  saveExperiment() {
    if (this.selectedDataset == undefined) {
      Shared.openDialog("Greška", "Izvor podataka nije izabran!");
      return;
    }
    if (this.experiment.outputColumn == '') {
      Shared.openDialog("Greška", "Molimo Vas da izaberete izlaznu kolonu.");
      return;
    }
    if (this.selectedColumnsInfoArray.length <= 1) { //jer izlazna je izabrana
      Shared.openDialog("Greška", "Molimo Vas da izaberete ulazne kolone.");
      return;
    }

    this.experiment._id = '';
    this.experiment.uploaderId = '';
    this.experiment.datasetId = this.selectedDataset._id;

    let pom = this.selectedColumnsInfoArray.filter(x => x.columnName != this.experiment.outputColumn);
    for (let i = 0; i < pom.length; i++)
      this.experiment.inputColumns.push(pom[i].columnName);

    this.selectedColumnsInfoArray = this.selectedColumnsInfoArray.filter(x => x.numNulls > 0); //obavezno
    this.experiment.nullValuesReplacers = this.getNullValuesReplacersArray();

    this.experiment.randomTestSetDistribution = 1 - Math.round(this.tempTestSetDistribution / 100 * 10) / 10;

    //console.log("Eksperiment:", this.experiment);

    this.experimentsService.addExperiment(this.experiment).subscribe((response) => {
      this.experiment = response;

      Shared.openYesNoDialog("Obaveštenje", "Eksperiment je uspešno kreiran. Da li želite da pređete na treniranje modela?", () => {
        this.router.navigate(['/training', this.experiment._id]);
      });
    }, (error) => {
      if (error.error == "Experiment with this name exists") {
        Shared.openDialog("Greška", "Eksperiment sa unetim nazivom već postoji u Vašoj kolekciji. Unesite neki drugi naziv.");
      }
    });
  }

  countSelectedNullCols(): number {
    let counter: number = 0;

    for (let i = 0; i < this.selectedColumnsInfoArray.length; i++) {
      let oneColInfo = this.selectedColumnsInfoArray[i];
      if (oneColInfo.numNulls > 0)
        ++counter;
    }
    return counter;
  }

  updateCarouselIndex(newIndex: number) {
    if (newIndex > 2)
      newIndex = 2;
    else if (newIndex < 0)
      newIndex = 0;

    if (this.carouselIndex == 0 && (newIndex == 1 || newIndex == 2))
      this.checkRequiredData();
    this.carouselIndex = newIndex;
  }

  checkRequiredData() {
    if (this.selectedDataset == undefined) {
      (<HTMLAnchorElement>document.getElementById("firstStep")).click();
      Shared.openDialog("Pažnja", "Potrebno je da dodate ili izabere izvor podataka kako biste prešli na naredni korak (preprocesiranje).");
      return;
    }
  }
}
