import { Component, OnInit, ViewChild } from '@angular/core';
import Model, { NullValReplacer, ReplaceWith } from 'src/app/_data/Model';
import { ProblemType, Encoding, ActivationFunction, LossFunction, Optimizer, NullValueOptions } from 'src/app/_data/Model';
import { DatasetLoadComponent } from 'src/app/_elements/dataset-load/dataset-load.component';
import { ModelsService } from 'src/app/_services/models.service';
import shared from 'src/app/Shared';
import Dataset from 'src/app/_data/Dataset';
import { DatatableComponent } from 'src/app/_elements/datatable/datatable.component';
import { DatasetsService } from 'src/app/_services/datasets.service';
import { NgxCsvParser } from 'ngx-csv-parser';
import { CsvParseService } from 'src/app/_services/csv-parse.service';

@Component({
  selector: 'app-add-model',
  templateUrl: './add-model.component.html',
  styleUrls: ['./add-model.component.css']
})
export class AddModelComponent implements OnInit {

  @ViewChild(DatasetLoadComponent) datasetLoadComponent?: DatasetLoadComponent;
  @ViewChild(DatatableComponent) datatable?: DatatableComponent;
  datasetLoaded: boolean = false;

  newModel: Model;

  ProblemType = ProblemType;
  Encoding = Encoding;
  ActivationFunction = ActivationFunction;
  LossFunction = LossFunction;
  Optimizer = Optimizer;
  NullValueOptions = NullValueOptions;
  ReplaceWith = ReplaceWith;
  Object = Object;
  document = document;
  shared = shared;

  selectedOutputColumnVal: string = '';

  showMyDatasets: boolean = true;
  myDatasets?: Dataset[];
  existingDatasetSelected: boolean = false;
  selectedDataset?: Dataset;
  otherDataset?: Dataset;
  otherDatasetFile?: any[];
  datasetFile?: any[];
  datasetHasHeader?: boolean = true;

  tempTestSetDistribution: number = 90;

  //accepted: Boolean;
  term: string = "";

  constructor(private models: ModelsService, private datasets: DatasetsService, private csv: CsvParseService) {
    this.newModel = new Model();

    this.datasets.getMyDatasets().subscribe((datasets) => {
      this.myDatasets = datasets;
    });
  }

  ngOnInit(): void {
    (<HTMLInputElement>document.getElementById("btnMyDataset")).focus();
  }

  viewMyDatasetsForm() {
    this.showMyDatasets = true;
    this.resetSelectedDataset();
    this.datasetLoaded = false;
    this.resetCbsAndRbs();
  }
  viewNewDatasetForm() {
    this.showMyDatasets = false;
    this.resetSelectedDataset();
    this.resetCbsAndRbs();
  }

  addModel() {
    if (!this.showMyDatasets)
      this.saveModelWithNewDataset(_ => { console.log('MODEL ADDED (with new dataset).') });
    else
      this.saveModelWithExistingDataset(_ => { console.log('MODEL ADDED (with existing dataset).') });
  }

  trainModel() {
    let saveFunc;

    if (!this.showMyDatasets)
      saveFunc = (x: (arg0: any) => void) => { this.saveModelWithNewDataset(x) };
    else
      saveFunc = (x: (arg0: any) => void) => { this.saveModelWithExistingDataset(x) };

    saveFunc(((model: any) => {
      console.log('Saved, training model...', model);
      this.models.trainModel(model).subscribe(response => {
        console.log('Train model complete!', response);
      });
    })); //privremeno cuvanje modela => vraca id sacuvanog modela koji cemo da treniramo sad
  }

  saveModelWithNewDataset(callback: ((arg0: any) => void)) {

    this.getCheckedInputCols();
    this.getCheckedOutputCol();

    if (this.validationInputsOutput()) {
      console.log('ADD MODEL: STEP 1 - UPLOAD FILE');
      if (this.datasetLoadComponent) {
        console.log("this.datasetLoadComponent.files:", this.datasetLoadComponent.files);
        this.models.uploadData(this.datasetLoadComponent.files[0]).subscribe((file) => {
          console.log('ADD MODEL: STEP 2 - ADD DATASET WITH FILE ID ' + file._id);
          if (this.datasetLoadComponent) {
            this.datasetLoadComponent.dataset.fileId = file._id;
            this.datasetLoadComponent.dataset.username = shared.username;

            this.datasets.addDataset(this.datasetLoadComponent.dataset).subscribe((dataset) => {
              console.log('ADD MODEL: STEP 3 - ADD MODEL WITH DATASET ID ', dataset._id);
              this.newModel.datasetId = dataset._id;

              //da se doda taj dataset u listu postojecih, da bude izabran 
              this.refreshMyDatasetList();
              this.showMyDatasets = true;
              this.selectThisDataset(dataset);

              this.newModel.randomTestSetDistribution = 1 - Math.round(this.tempTestSetDistribution / 100 * 10) / 10;
              this.tempTestSetDistribution = 90;
              this.newModel.username = shared.username;

              this.newModel.nullValuesReplacers = this.getNullValuesReplacersArray();

              this.models.addModel(this.newModel).subscribe((response) => {
                callback(response);
              }, (error) => {
                alert("Model sa unetim nazivom već postoji u Vašoj kolekciji.\nPromenite naziv modela i nastavite sa kreiranim datasetom.");
              }); //kraj addModel subscribe
            }, (error) => {
              alert("Dataset sa unetim nazivom već postoji u Vašoj kolekciji.\nIzmenite naziv ili iskoristite postojeći dataset.");
            }); //kraj addDataset subscribe
          } //kraj treceg ifa
        }, (error) => {
          //alert("greska uploadData");
        }); //kraj uploadData subscribe

      } //kraj drugog ifa
    } //kraj prvog ifa
  }

  saveModelWithExistingDataset(callback: ((arg0: any) => void)): any {
    if (this.selectedDataset) { //dataset je izabran
      this.getCheckedInputCols();
      this.getCheckedOutputCol();

      if (this.validationInputsOutput()) {
        this.newModel.datasetId = this.selectedDataset._id;

        this.newModel.randomTestSetDistribution = 1 - Math.round(this.tempTestSetDistribution / 100 * 10) / 10;
        this.tempTestSetDistribution = 90;
        this.newModel.username = shared.username;

        this.newModel.nullValuesReplacers = this.getNullValuesReplacersArray();

        this.models.addModel(this.newModel).subscribe((response) => {
          callback(response);
        }, (error) => {
          alert("Model sa unetim nazivom već postoji u Vašoj kolekciji.\nPromenite naziv modela i nastavite sa kreiranim datasetom.");
        });
      }
    }
    else {
      alert("Molimo Vas da izaberete neki dataset iz kolekcije.");
    }
  }

  getCheckedInputCols() {
    this.newModel.inputColumns = [];
    let checkboxes: any;

    checkboxes = document.getElementsByName("cbsNew");

    for (let i = 0; i < checkboxes.length; i++) {
      let thatCb = <HTMLInputElement>checkboxes[i];
      if (thatCb.checked == true) // && thatCb.disabled == false ne treba nam ovo vise
        this.newModel.inputColumns.push(thatCb.value);
    }
    //console.log(this.checkedInputCols);
  }
  getCheckedOutputCol() {
    this.newModel.columnToPredict = '';
    let radiobuttons: any;

    radiobuttons = document.getElementsByName("rbsNew");

    for (let i = 0; i < radiobuttons.length; i++) {
      let thatRb = <HTMLInputElement>radiobuttons[i];
      if (thatRb.checked) {
        this.newModel.columnToPredict = thatRb.value;
        break;
      }
    }
    //console.log(this.checkedOutputCol);
  }
  validationInputsOutput(): boolean {
    if (this.newModel.inputColumns.length == 0 && this.newModel.columnToPredict == '') {
      alert("Molimo Vas da izaberete ulazne i izlazne kolone za mrežu.");
      return false;
    }
    else if (this.newModel.inputColumns.length == 0) {
      alert("Molimo Vas da izaberete ulaznu kolonu/kolone za mrežu.");
      return false;
    }
    else if (this.newModel.columnToPredict == '') {
      alert("Molimo Vas da izaberete izlaznu kolonu za mrežu.");
      return false;
    }
    for (let i = 0; i < this.newModel.inputColumns.length; i++) {
      if (this.newModel.inputColumns[i] == this.newModel.columnToPredict) {
        let colName = this.newModel.columnToPredict;
        alert("Izabrali ste istu kolonu (" + colName + ") kao ulaznu i izlaznu iz mreže. Korigujte izbor.");
        return false;
      }
    }
    return true;
  }

  selectThisDataset(dataset: Dataset) {
    this.selectedDataset = dataset;
    this.existingDatasetSelected = true;
    this.datasetHasHeader = this.selectedDataset.hasHeader;

    /*let datasets = document.getElementsByClassName("usersDataset") as HTMLCollection;
    for (let i = 0; i < datasets.length; i++) {
      if (datasets[i]._id == dataset._id)
    }*/

    //this.datasetFile = csvRecords;
    this.datasets.getDatasetFile(dataset.fileId).subscribe((file: string | undefined) => {
      if (file) {
        this.datasetFile = this.csv.csvToArray(file, (dataset.delimiter == "razmak") ? " " : (dataset.delimiter == "") ? "," : dataset.delimiter);
        /*for (let i = this.datasetFile.length - 1; i >= 0; i--) {  //moguce da je vise redova na kraju fajla prazno i sl.
          if (this.datasetFile[i].length != this.datasetFile[0].length)
            this.datasetFile[i].pop();
          else
            break; //nema potrebe dalje
        }*/
        console.log(this.datasetFile);
        this.resetCbsAndRbs();
        //this.refreshThreeNullValueRadioOptions();
      }
    });
    //this.datasetHasHeader = false;
  }

  scrollToNextForm() {
    (<HTMLSelectElement>document.getElementById("selectInAndOuts")).scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  }

  resetSelectedDataset(): boolean {
    const temp = this.selectedDataset;
    this.selectedDataset = this.otherDataset;
    this.otherDataset = temp;
    const tempFile = this.datasetFile;
    this.datasetFile = this.otherDatasetFile;
    this.otherDatasetFile = tempFile;
    return true;
  }
  resetCbsAndRbs(): boolean {
    this.uncheckRbs();
    this.checkAllCbs();
    return true;
  }
  checkAllCbs() {
    let checkboxes: any;

    checkboxes = document.getElementsByName("cbsNew");
    for (let i = 0; i < checkboxes.length; i++) {
      (<HTMLInputElement>checkboxes[i]).checked = true;
      (<HTMLInputElement>checkboxes[i]).disabled = false;
    }
  }
  uncheckRbs() {
    this.selectedOutputColumnVal = '';
    let radiobuttons: any;

    radiobuttons = document.getElementsByName("rbsNew");
    for (let i = 0; i < radiobuttons.length; i++)
      (<HTMLInputElement>radiobuttons[i]).checked = false;
  }

  refreshMyDatasetList() {
    this.datasets.getMyDatasets().subscribe((datasets) => {
      this.myDatasets = datasets;
    });
  }

  refreshThreeNullValueRadioOptions() {
    //console.log((<HTMLInputElement>document.getElementById("delRows")).checked);
    const input = document.getElementById('delRows');
  console.log(input); // 👉️ input#subscribe

// ✅ Works
    //input.checked = true;
    (<HTMLInputElement>document.getElementById("delRows")).checked = true;
    (<HTMLInputElement>document.getElementById("delCols")).checked = false;
    (<HTMLInputElement>document.getElementById("replace")).checked = false;
  }

  isChecked(someId: string) { //proveri ako je element sa datim ID-em cekiran
    //console.log(someId);
    //console.log((<HTMLInputElement>document.getElementById(someId)).checked);
    return (<HTMLInputElement>document.getElementById(someId)).checked;
  }

  isNumber(value: string | number): boolean {
    return ((value != null) &&
      (value !== '') &&
      !isNaN(Number(value.toString())));
  }

  findColIndexByName(colName: string) : number {
    if (this.datasetFile) 
      for (let i = 0; i < this.datasetFile[0].length; i++) 
        if (colName === this.datasetFile[0][i]) 
          return i;
    return -1;
  }
  findColNameByIndex(index: number) : string {
    if (this.datasetFile) 
      if (this.datasetHasHeader && index < this.datasetFile[0].length)
        return this.datasetFile[0][index];
    return '';
  }
  emptyFillTextInput(colName: string) {
    (<HTMLInputElement>document.getElementById("fillText_" + colName)).value = "";
  }

  checkFillColRadio(colName: string) {
    (<HTMLInputElement>document.getElementById("fillCol_" + colName)).checked = true;
  }
  calculateSumOfNullValuesInCol(colName: string): number {
    //console.log(this.datasetFile);
    if (this.datasetFile) { 
      let colIndex = this.findColIndexByName(colName);
      let sumOfNulls = 0;

      let startValue = (this.datasetLoadComponent?.dataset.hasHeader) ? 1 : 0;
      for (let i = startValue; i < this.datasetFile.length; i++) {
        if (this.datasetFile[i][colIndex] == "" || this.datasetFile[i][colIndex] == undefined)
          ++sumOfNulls;
      }
      return sumOfNulls;
    }
    return -1;
  }
  calculateMeanColValue(colName: string): number {
    if (this.datasetFile) {
      let colIndex = this.findColIndexByName(colName);
      let sum = 0;
      let n = 0;

      let startValue = (this.datasetLoadComponent?.dataset.hasHeader) ? 1 : 0;
      for (let i = startValue; i < this.datasetFile.length; i++)
        if (this.datasetFile[i][colIndex] != '') {
          sum += Number(this.datasetFile[i][colIndex]);
          ++n;
        }
        console.log(sum / n);
      return (sum != 0)? (sum / n) : 0;
    }
    return 0;
  }
  calculateMedianColValue(colName: string): number {
    if (this.datasetFile) {
      let array = [];
      let colIndex = this.findColIndexByName(colName);

      let startValue = (this.datasetHasHeader) ? 1 : 0;
      for (let i = startValue; i < this.datasetFile.length; i++)
        if (this.datasetFile[i][colIndex] != '')
          array.push(Number(this.datasetFile[i][colIndex]));
          
      array.sort();
      if (array.length % 2 == 0)
        return array[array.length / 2 - 1] / 2;
      else
        return array[(array.length - 1) / 2];
    }
    return 0;
  }
  replaceWithSelectedString(event: Event) {
    let value = (<HTMLInputElement>event.target).value;
    let colIndex = Number(((<HTMLSelectElement>event.target).id).split("replaceOptions")[1]);
    let colName = this.findColNameByIndex(colIndex);

    (<HTMLInputElement>document.getElementById("fillCol_" + colName)).checked = true;

    if (!this.datasetHasHeader)
      (<HTMLInputElement>document.getElementById("fillText_" + colName)).value = value;
    else {
      if (value == colName)
        (<HTMLInputElement>document.getElementById("fillText_" + colName)).value = "";
      else 
        (<HTMLInputElement>document.getElementById("fillText_" + colName)).value = value;
    }
  }
  replaceWithSelectedNumber(event: Event) {
    let option = (<HTMLInputElement>event.target).value;
    let colIndex = Number(((<HTMLSelectElement>event.target).id).split("replaceOptions")[1]);
    let colName = this.findColNameByIndex(colIndex);

    (<HTMLInputElement>document.getElementById("fillCol_" + colName)).checked = true;

    if (option == ReplaceWith.Mean)
      (<HTMLInputElement>document.getElementById("fillText_" + colName)).value = this.calculateMeanColValue(colName).toString();
    else if (option == ReplaceWith.Median)
      (<HTMLInputElement>document.getElementById("fillText_" + colName)).value = this.calculateMedianColValue(colName).toString();
    else if (option == ReplaceWith.None)
      (<HTMLInputElement>document.getElementById("fillText_" + colName)).value = "";
  }

  
  getNullValuesReplacersArray() : NullValReplacer[] {
    let array: NullValReplacer[] = [];

    if (this.datasetFile) {

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
    console.log(array);
    return array;
  }

  getInputById(id: string): HTMLInputElement {
    return document.getElementById(id) as HTMLInputElement;
  }

  arrayColumn = (arr: any[][], n: number) => [...new Set(arr.map(x => x[n]))];
}
