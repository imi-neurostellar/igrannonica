import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { DatasetsService } from 'src/app/_services/datasets.service';
import Dataset from 'src/app/_data/Dataset';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-my-datasets',
  templateUrl: './my-datasets.component.html',
  styleUrls: ['./my-datasets.component.css']
})
export class MyDatasetsComponent implements OnInit {
  myDatasets: Dataset[] = [];

  constructor(private datasetsS : DatasetsService) {

    

     }

  ngOnInit(): void {
    this.datasetsS.getMyDatasets();

  }
/*
  editModel(): void{
    this.modelsS.editModel().subscribe(m => {
      this.myModel = m;

    })
  }
*/

deleteThisDataset(dataset: Dataset): void{
  console.log("OK");
  this.datasetsS.deleteDataset(dataset).subscribe((response) => {
    console.log("OBRISANO JE", response);
    //na kraju uspesnog
    this.getAllMyDatasets();
  }, (error) =>{
      if (error.error == "Dataset with name = {name} deleted") {
        alert("Greška pri brisanju dataseta!");
      }
    });

}

  getAllMyDatasets(): void{
    this.datasetsS.getMyDatasets().subscribe(m => {
      
      this.myDatasets = m;
      console.log(this.myDatasets);
    });
  }

}
