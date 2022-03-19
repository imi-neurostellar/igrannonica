import { Component, OnInit, ViewChild } from '@angular/core';
import Model from 'src/app/_data/Model';
import { ANNType, Encoding, ActivationFunction, LossFunction, Optimizer } from 'src/app/_data/Model';
import { DatasetLoadComponent } from 'src/app/_elements/dataset-load/dataset-load.component';
import { ModelsService } from 'src/app/_services/models.service';
import shared from 'src/app/Shared';


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
  shared = shared;

  selectedOutputColumnVal: string = '';

  constructor(private models: ModelsService) {
    this.newModel = new Model();
  }

  ngOnInit(): void {
  }

  addModel() {
    this.saveModel(false); //trajno cuvanje
  }

  trainModel() {
    this.saveModel(true).subscribe((modelId: any) => {
      if (modelId)
        this.models.trainModel(modelId);
    }); //privremeno cuvanje modela => vraca id sacuvanog modela koji cemo da treniramo sad
  }

  saveModel(temporary: boolean): any {
    this.getCheckedInputCols();
    this.getCheckedOutputCol();
    if (this.validationInputsOutput()) {
      console.log('ADD MODEL: STEP 1 - UPLOAD FILE');
      if (this.datasetLoadComponent) {
        this.models.uploadData(this.datasetLoadComponent.files[0]).subscribe((file) => {
          console.log('ADD MODEL: STEP 2 - ADD DATASET WITH FILE ID ' + file._id);
          if (this.datasetLoadComponent) {
            this.datasetLoadComponent.dataset.fileId = file._id;
            this.datasetLoadComponent.dataset.username = shared.username;
            this.models.addDataset(this.datasetLoadComponent.dataset).subscribe((dataset) => {
              console.log('ADD MODEL: STEP 3 - ADD MODEL WITH DATASET ID ', dataset._id);
              this.newModel.datasetId = dataset._id;
              this.newModel.randomTestSetDistribution = 1 - Math.round(this.newModel.randomTestSetDistribution / 100 * 10) / 10;
              this.newModel.username = shared.username;
              this.models.addModel(this.newModel).subscribe((response) => {
                console.log('ADD MODEL: DONE! REPLY:\n', response);
              });
            });
          }
        });
      }
    }
  }

  getCheckedInputCols() {
    this.newModel.inputColumns = [];
    let checkboxes = document.getElementsByName("cbs");

    for (let i = 0; i < checkboxes.length; i++) {
      let thatCb = <HTMLInputElement>checkboxes[i];
      if (thatCb.checked == true && thatCb.disabled == false)
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
  validationInputsOutput(): boolean {
    if (this.newModel.inputColumns.length == 0 && this.newModel.columnToPredict == '') {
      alert("Molimo Vas da izaberete ulazne i izlazne kolone za mrežu.")
      return false;
    }
    else if (this.newModel.inputColumns.length == 0) {
      alert("Molimo Vas da izaberete ulaznu kolonu/kolone za mrežu.")
      return false;
    }
    else if (this.newModel.columnToPredict == '') {
      alert("Molimo Vas da izaberete izlaznu kolonu za mrežu.")
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
