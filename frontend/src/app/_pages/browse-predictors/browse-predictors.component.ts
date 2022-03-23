import { Component, OnInit } from '@angular/core';
import { PredictorsService } from 'src/app/_services/predictors.service';
import Predictor from 'src/app/_data/Predictor';
@Component({
  selector: 'app-browse-predictors',
  templateUrl: './browse-predictors.component.html',
  styleUrls: ['./browse-predictors.component.css']
})
export class BrowsePredictorsComponent implements OnInit {

  myPredictors? :Predictor[];
  term: string="";
  constructor(private predictors: PredictorsService) {
    this.predictors.getPublicPredictors().subscribe((predictors) => {
      this.myPredictors = predictors;
    });
  }

  ngOnInit(): void {
  }

}
