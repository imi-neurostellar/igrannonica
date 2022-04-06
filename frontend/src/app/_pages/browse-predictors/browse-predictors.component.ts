import { Component, OnInit } from '@angular/core';
import { PredictorsService } from 'src/app/_services/predictors.service';
import Predictor from 'src/app/_data/Predictor';
import {Router} from '@angular/router'
@Component({
  selector: 'app-browse-predictors',
  templateUrl: './browse-predictors.component.html',
  styleUrls: ['./browse-predictors.component.css']
})
export class BrowsePredictorsComponent implements OnInit {

  publicPredictors? :Predictor[];
  term: string="";
  constructor(private predictors: PredictorsService,private router:Router) {
    this.predictors.getPublicPredictors().subscribe((predictors) => {
      this.publicPredictors = predictors;
    });
  }

  ngOnInit(): void {
  }
  openPredictor(id:string):void{
    this.router.navigate(['predict/'+id]);
  };

}
