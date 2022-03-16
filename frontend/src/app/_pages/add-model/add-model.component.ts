import { Component, OnInit, ViewChild } from '@angular/core';
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
    console.log('ADD MODEL: STEP 1 - UPLOAD FILE');
    if (this.datasetLoadComponent) {
      this.models.uploadData(this.datasetLoadComponent.files[0]).subscribe((fileId) => {
        console.log('ADD MODEL: STEP 2 - ADD DATASET WITH FILE ID ' + fileId);
        if (this.datasetLoadComponent) {
          this.datasetLoadComponent.dataset.fileId = fileId;
          this.models.addDataset(this.datasetLoadComponent.dataset).subscribe((datasetId) => {
            console.log('ADD MODEL: STEP 3 - ADD MODEL WITH DATASET ID ' + datasetId);
            this.newModel.datasetId = datasetId;
            this.getCheckedInputCols();
            this.getCheckedOutputCol();
            if (this.validationInputsOutput())
              this.models.addModel(this.newModel).subscribe((response) => {
                console.log('ADD MODEL: DONE! REPLY:\n' + response);
              });
          }
          );
        }
      });
    }
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
  validationInputsOutput(): boolean {
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
