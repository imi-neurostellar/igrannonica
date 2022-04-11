import { Component, OnInit } from '@angular/core';
import Experiment, { NullValReplacer, NullValueOptions, ReplaceWith } from '../_data/Experiment';
import Model from '../_data/Model';
import Dataset, { ColumnInfo } from '../_data/Dataset';
import { ModelsService } from '../_services/models.service';
import Shared from '../Shared';
import { ExperimentsService } from '../_services/experiments.service';

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
  Object = Object;

  selectedColumnsInfoArray: ColumnInfo[] = [];
  selectedOutputColumnVal: string = '';
  selectedNullColumnsArray: string[] = [];

  constructor(private modelsService: ModelsService, private experimentsService: ExperimentsService) { }

  ngOnInit(): void {
  }

  updateDataset(dataset: Dataset) {
    //console.log(dataset);
    this.selectedDataset = dataset;
    this.selectedColumnsInfoArray = this.selectedDataset.columnInfo;
    this.selectedNullColumnsArray = [];
    console.log("array:", this.selectedColumnsInfoArray);
  }

  updateModel(model: Model) {
    //console.log(model);
    this.selectedModel = model;
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

  getSelectedNullColumnsArray(): string[] {
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
          if ((<HTMLInputElement>document.getElementById("delCol_" + oneColInfo.columnName)).checked) {
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
    //console.log(array);
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

    this.selectedColumnsInfoArray = this.selectedColumnsInfoArray.filter(x => x.numNulls > 0);
    //TREBAJU MI NULLVALUESREPLACERI  
    this.experiment.nullValuesReplacers = this.getNullValuesReplacersArray();

    console.log("Eksperiment:", this.experiment);
    
    this.experimentsService.addExperiment(this.experiment).subscribe((response) => {
      this.experiment = response;

      this.selectedColumnsInfoArray = [];
      this.selectedNullColumnsArray = [];

      Shared.openDialog("Obaveštenje", "Eksperiment je uspešno kreiran.");
    }, (error) => {

    });
  }

  trainModel() {
    this.trainingResult = undefined;
    //console.log('Training model...', this.selectedModel);
    if (!this.selectedDataset) {
      Shared.openDialog('Greška', 'Izvor podataka nije izabran!');
      return;
    }
    // TODO proveri nullValues
    if (!this.selectedModel) {
      Shared.openDialog('Greška', 'Model nije izabran!');
      return;
    }
    this.modelsService.trainModel(this.selectedModel).subscribe((response: any) => {
      console.log('Train model complete!', response);
      this.trainingResult = response;
    });
  }
}
