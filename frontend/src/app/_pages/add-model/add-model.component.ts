import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import Model from 'src/app/_data/Model';
import { ANNType, Encoding, ActivationFunction, LossFunction, Optimizer } from 'src/app/_data/Model';
import { DatasetLoadComponent } from 'src/app/_elements/dataset-load/dataset-load.component';
import { ModelsService } from 'src/app/_services/models.service';


@Component({
  selector: 'app-add-model',
  templateUrl: './add-model.component.html',
  styleUrls: ['./add-model.component.css']
})
export class AddModelComponent implements OnInit {

  @ViewChild(DatasetLoadComponent) datasetLoadComponent?: DatasetLoadComponent;
  datasetLoaded: boolean = false;

  newModel: Model;

  ANNType = ANNType;
  Encoding = Encoding;
  ActivationFunction = ActivationFunction;
  LossFunction = LossFunction;
  Optimizer = Optimizer;
  Object = Object;

  constructor(private models: ModelsService) {
    this.newModel = new Model();
  }

  ngOnInit(): void {
  }

  addModel() {
    this.saveModel(false); //trajno cuvanje
  }
  trainModel() {
    this.saveModel(true).subscribe((modelId : any) => {
      if (modelId)
        this.models.trainModel(modelId);
    }); //privremeno cuvanje modela => vraca id sacuvanog modela koji cemo da treniramo sad
  }
  saveModel(temporary: boolean) : any {
    if (this.datasetLoadComponent)
      this.models.addDataset(this.datasetLoadComponent?.dataset).subscribe((response) => {//id dataseta je response
        this.newModel.datasetId = response;

        this.getCheckedInputCols();
        this.getCheckedOutputCol();
        if (this.validationInputsOutput()) 
          return this.models.addModel(this.newModel); //id modela
        return of(null);
      });
  }

  getCheckedInputCols() {
    this.newModel.inputColumns = [];
    let checkboxes = document.getElementsByName("cbs");

    for (let i = 0; i < checkboxes.length; i++) {
      let thatCb = <HTMLInputElement>checkboxes[i];
      if (thatCb.checked)
        this.newModel.inputColumns.push(thatCb.value);
    }
    //console.log(this.checkedInputCols);
  }
  getCheckedOutputCol() {
    this.newModel.columnToPredict = '';
    let radiobuttons = document.getElementsByName("rbs");

    for (let i = 0; i < radiobuttons.length; i++) {
      let thatRb = <HTMLInputElement>radiobuttons[i];
      if (thatRb.checked) {
        this.newModel.columnToPredict = thatRb.value;
        break; 
      }
    }
    //console.log(this.checkedOutputCol);
  }
  validationInputsOutput() : boolean {
    if (this.newModel.inputColumns.length == 0) {
      alert("Molimo Vas da izaberete ulaznu kolonu/kolone za mrežu.")
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

}
