import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import Dataset from 'src/app/_data/Dataset';
import { DatasetsService } from 'src/app/_services/datasets.service';
import { ModelsService } from 'src/app/_services/models.service';
import shared from 'src/app/Shared';
import { DatatableComponent } from '../datatable/datatable.component';

@Component({
  selector: 'app-add-new-dataset',
  templateUrl: './add-new-dataset.component.html',
  styleUrls: ['./add-new-dataset.component.css']
})
export class AddNewDatasetComponent {

  @Output() newDatasetAdded = new EventEmitter<string>();
  @ViewChild(DatatableComponent) datatable?: DatatableComponent;

  delimiterOptions: Array<string> = [",", ";", "\t", "razmak", "|"]; //podrazumevano ","

  //hasHeader: boolean = true;
  hasInput: boolean = false;

  csvRecords: any[] = [];
  files: File[] = [];
  rowsNumber: number = 0;
  colsNumber: number = 0;

  dataset: Dataset; //dodaj ! potencijalno

  constructor(private ngxCsvParser: NgxCsvParser, private modelsService: ModelsService, private datasetsService: DatasetsService) {
    this.dataset = new Dataset();
  }

  //@ViewChild('fileImportInput', { static: false }) fileImportInput: any; cemu je ovo sluzilo?

  changeListener($event: any): void {
    this.files = $event.srcElement.files;
    if (this.files.length == 0 || this.files[0] == null) {
      //console.log("NEMA FAJLA");
      //this.loaded.emit("not loaded");
      this.hasInput = false;
      return;
    }
    else
      this.hasInput = true;

    this.update();
  }

  update() {

    if (this.files.length < 1)
      return;

    this.datatable!.loaded = false;
    this.datatable!.hasInput = this.hasInput;

    this.ngxCsvParser.parse(this.files[0], { header: false, delimiter: (this.dataset.delimiter == "razmak") ? " " : (this.dataset.delimiter == "") ? "," : this.dataset.delimiter })
      .pipe().subscribe((result) => {

        console.log('Result', result);
        if (result.constructor === Array) {
          if(this.dataset.hasHeader)
            this.csvRecords = result.splice(0,11);
          else
            this.csvRecords=result.splice(0,10);
          if (this.dataset.hasHeader)
            this.rowsNumber = this.csvRecords.length - 1;
          else
            this.rowsNumber = this.csvRecords.length;
          this.colsNumber = this.csvRecords[0].length;

          if (this.dataset.hasHeader) 
            this.dataset.header = this.csvRecords[0];
          
          this.datatable!.data = this.csvRecords;
          this.datatable!.hasHeader = this.dataset.hasHeader;
          this.datatable!.loaded = true;
        }
      }, (error: NgxCSVParserError) => {
        console.log('Error', error);
      });
  }

  checkAccessible() {
    if (this.dataset.isPublic)
      this.dataset.accessibleByLink = true;
  }

  uploadDataset() {
        this.modelsService.uploadData(this.files[0]).subscribe((file) => {
          //console.log('ADD MODEL: STEP 2 - ADD DATASET WITH FILE ID ' + file._id);
            this.dataset.fileId = file._id;
            this.dataset.username = shared.username;

            this.datasetsService.addDataset(this.dataset).subscribe((dataset) => {
             
              this.newDatasetAdded.emit("added");
              //this.refreshMyDatasetList(); refreshuj dataset listu u ds-load i selektuj taj ds
              //this.showMyDatasets = true;
              //this.selectThisDataset(dataset);

              shared.openDialog("Obaveštenje", "Uspešno ste dodali novi izvor podataka u kolekciju. Molimo sačekajte par trenutaka da se procesira.");
            }, (error) => {
              shared.openDialog("Neuspeo pokušaj!", "Dataset sa unetim nazivom već postoji u Vašoj kolekciji. Izmenite naziv ili iskoristite postojeći dataset.");
            }); //kraj addDataset subscribe
        }, (error) => {
          
        }); //kraj uploadData subscribe
  }

}
