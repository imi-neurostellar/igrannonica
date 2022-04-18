import { Component, OnInit } from '@angular/core';
import Predictor from 'src/app/_data/Predictor';
import { PredictorsService } from 'src/app/_services/predictors.service';
import shared from 'src/app/Shared';
@Component({
  selector: 'app-my-predictors',
  templateUrl: './my-predictors.component.html',
  styleUrls: ['./my-predictors.component.css']
})
export class MyPredictorsComponent implements OnInit {
  predictors: Predictor[] = [];
  constructor(private predictorsS : PredictorsService) {
  }
  ngOnInit(): void {
    this.predictorsS.getMyPredictors().subscribe((response) => {
      this.predictors = response;
    }, (error) => {
      if (error.error == "Predictor with...") {
        shared.openDialog("Greska", "Greska");
      }
    });
  }

  deleteThisPredictor(predictor: Predictor): void{
    shared.openYesNoDialog('Brisanje prediktora','Da li ste sigurni da želite da obrišete prediktor?',() => {
    this.predictorsS.deletePredictor(predictor).subscribe((response) => {
      this.getAllMyPredictors();
    }, (error) =>{
        if (error.error == "Predictor with name = {name} deleted") {
          shared.openDialog("Obaveštenje", "Greška prilikom brisanja prediktora.");
        }
      });
    });
  }

  getAllMyPredictors(): void{
    this.predictorsS.getMyPredictors().subscribe(p => {
      this.predictors = p;
    });
  }


}
