import { Component, OnInit, ViewChild } from '@angular/core';
import Model from 'src/app/_data/Model';
import { ANNType, Encoding, ActivationFunction, LossFunction, Optimizer } from 'src/app/_data/Model';
import { DatasetLoadComponent } from 'src/app/_elements/dataset-load/dataset-load.component';
import { ModelsService } from 'src/app/_services/models.service';
import shared from 'src/app/Shared';
import Dataset from 'src/app/_data/Dataset';


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

  showMyDatasets: boolean = true;
  myDatasets?: Dataset[];
  existingDatasetSelected: boolean = false;
  selectedDataset?: Dataset;

  tempTestSetDistribution: number = 90;

  constructor(private models: ModelsService) {
    this.newModel = new Model();

    this.models.getMyDatasets().subscribe((datasets) => {
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
      this.saveModelWithNewDataset(); 
    else
      this.saveModelWithExistingDataset(); 
  }

  trainModel() {
    this.saveModelWithNewDataset().subscribe((modelId: any) => {
      if (modelId)
        this.models.trainModel(modelId);
    }); //privremeno cuvanje modela => vraca id sacuvanog modela koji cemo da treniramo sad
  }

  saveModelWithNewDataset(): any {

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

              //da se doda taj dataset u listu postojecih, da bude izabran 
              this.refreshMyDatasetList();
              this.showMyDatasets = true;
              this.selectThisDataset(dataset);

              this.newModel.randomTestSetDistribution = 1 - Math.round(this.tempTestSetDistribution / 100 * 10) / 10;
              this.tempTestSetDistribution = 90;
              this.newModel.username = shared.username;

              this.models.addModel(this.newModel).subscribe((response) => {
                console.log('ADD MODEL: DONE! REPLY:\n', response);
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

  saveModelWithExistingDataset(): any {

    if (this.selectedDataset) { //dataset je izabran
      this.getCheckedInputCols();
      this.getCheckedOutputCol();
  
      if (this.validationInputsOutput()) { 
        this.newModel.datasetId = this.selectedDataset._id;
        
        this.newModel.randomTestSetDistribution = 1 - Math.round(this.tempTestSetDistribution / 100 * 10) / 10;
        this.tempTestSetDistribution = 90;
        this.newModel.username = shared.username;
        
        this.models.addModel(this.newModel).subscribe((response) => {
          console.log('ADD MODEL: DONE! REPLY:\n', response);
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
    if (this.showMyDatasets)
      checkboxes = document.getElementsByName("cbsExisting");
    else
      checkboxes = document.getElementsByName("cbsNew"); 
      
    for (let i = 0; i < checkboxes.length; i++) {
      let thatCb = <HTMLInputElement>checkboxes[i];
      if (thatCb.checked == true && thatCb.disabled == false)
        this.newModel.inputColumns.push(thatCb.value);
    }
    //console.log(this.checkedInputCols);
  }
  getCheckedOutputCol() {
    this.newModel.columnToPredict = '';
    let radiobuttons: any;
    if (this.showMyDatasets)
      radiobuttons = document.getElementsByName("rbsExisting");
    else
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

    /*let datasets = document.getElementsByClassName("usersDataset") as HTMLCollection;
    for (let i = 0; i < datasets.length; i++) {
      if (datasets[i]._id == dataset._id)
    }*/

    this.resetCbsAndRbs();
  }

  resetSelectedDataset(): boolean {
    this.existingDatasetSelected = false;
    this.selectedDataset = undefined;
    return true;
  }
  resetCbsAndRbs(): boolean {
    this.uncheckRbs();
    this.checkAllCbs();
    return true;
  }
  checkAllCbs() {
    let checkboxes: any;
    //if (this.showMyDatasets)
      checkboxes = document.getElementsByName("cbsExisting");
    //else
      //checkboxes = document.getElementsByName("cbsNew"); 
      
    for (let i = 0; i < checkboxes.length; i++) {
      (<HTMLInputElement>checkboxes[i]).checked = true;
      (<HTMLInputElement>checkboxes[i]).disabled = false;
    }

    checkboxes = document.getElementsByName("cbsNew"); 
    for (let i = 0; i < checkboxes.length; i++) {
      (<HTMLInputElement>checkboxes[i]).checked = true;
      (<HTMLInputElement>checkboxes[i]).disabled = false;
    }
  }
  uncheckRbs() {
    this.selectedOutputColumnVal = '';
    let radiobuttons: any;
    //if (this.showMyDatasets)
      radiobuttons = document.getElementsByName("rbsExisting");
    //else
      //radiobuttons = document.getElementsByName("rbsNew"); 

    for (let i = 0; i < radiobuttons.length; i++)
      (<HTMLInputElement>radiobuttons[i]).checked = false;
      radiobuttons = document.getElementsByName("rbsNew"); 
      for (let i = 0; i < radiobuttons.length; i++)
      (<HTMLInputElement>radiobuttons[i]).checked = false;
  }

  refreshMyDatasetList() {
    this.models.getMyDatasets().subscribe((datasets) => {
      this.myDatasets = datasets;
    });
  }

}
