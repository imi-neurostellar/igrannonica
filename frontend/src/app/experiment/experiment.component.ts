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

  selectedOutputColumnVal: string = '';

  constructor(private modelsService: ModelsService, private experimentsService: ExperimentsService) { }

  ngOnInit(): void {
  }

  updateDataset(dataset: Dataset) {
    //console.log(dataset);
    this.selectedDataset = dataset;
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

  getNullValuesReplacersArray()/*: NullValReplacer[]*/ {
    let array: NullValReplacer[] = [];

    // TODO ispravi
    /*if (this.datasetFile) {

      if (this.newModel.nullValues == NullValueOptions.Replace) {

        for (let i = 0; i < this.datasetFile[0].length; i++) {
          let column = this.datasetFile[0][i];

          if (this.calculateSumOfNullValuesInCol(column) > 0) { //ako kolona nema null vrednosti, ne dodajemo je u niz
            if ((<HTMLInputElement>document.getElementById("delCol_" + column)).checked) {
              array.push({
                column: column,
                option: NullValueOptions.DeleteColumns,
                value: ""
              });
            }
            else if ((<HTMLInputElement>document.getElementById("delRows_" + column)).checked) {
              array.push({
                column: column,
                option: NullValueOptions.DeleteRows,
                value: ""
              });
            }
            else if (((<HTMLInputElement>document.getElementById("fillCol_" + column)).checked)) {
              array.push({
                column: column,
                option: NullValueOptions.Replace,
                value: (<HTMLInputElement>document.getElementById("fillText_" + column)).value
              });
            }
          }
        }
      }
    }
    //console.log(array);
    return array;*/
  }

  saveExperiment() {
    if (this.selectedDataset == undefined) {
      Shared.openDialog("Greška", "Izvor podataka nije izabran!");
      return;
    }
    //ispitivanje da li ima ulazne kolone TODO

    if (this.selectedOutputColumnVal == '') {
      Shared.openDialog("Greška", "Molimo Vas da izaberete izlaznu kolonu.");
      return;
    }
    
    this.experiment.datasetId = this.selectedDataset._id;
    
    this.experimentsService.addExperiment(this.experiment).subscribe((response) => {
      this.experiment = response;
      Shared.openDialog("Obaveštenje", "Eksperiment je uspešno kreiran.");
    }, (error) => {

    });
  }

  trainModel() {
    this.trainingResult = undefined;
    console.log('Training model...', this.selectedModel);
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
