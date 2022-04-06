import { Component, OnInit } from '@angular/core';
import Experiment, { NullValReplacer, NullValueOptions, ReplaceWith } from '../_data/Experiment';
import Model from '../_data/Model';
import Dataset from '../_data/Dataset';
import { ModelsService } from '../_services/models.service';
import Shared from '../Shared';

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

  constructor(private models: ModelsService) { }

  ngOnInit(): void {
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

  replace(event: Event) {
    let option = (<HTMLInputElement>event.target).value;
    // TODO
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
    this.models.trainModel(this.selectedModel).subscribe((response: any) => {
      console.log('Train model complete!', response);
      this.trainingResult = response;
    });
  }
}
