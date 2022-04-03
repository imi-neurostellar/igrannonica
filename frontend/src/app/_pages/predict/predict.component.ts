import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Predictor from 'src/app/_data/Predictor';
import { PredictorsService } from 'src/app/_services/predictors.service';
import shared from 'src/app/Shared';

@Component({
  selector: 'app-predict',
  templateUrl: './predict.component.html',
  styleUrls: ['./predict.component.css']
})
export class PredictComponent implements OnInit {

  inputs : String[] = [];

  predictor:Predictor;
  constructor(private predictS : PredictorsService, private route: ActivatedRoute) {
    this.predictor = new Predictor();
   }

  ngOnInit(): void {
    this.route.params.subscribe(url => {
      this.predictS.getPredictor(url["id"]).subscribe(p => {
      
        this.predictor = p;
        console.log(this.predictor);
      })
    });
  }

  usePredictor(): void{ 
    this.predictS.usePredictor(this.predictor, this.inputs).subscribe(p => {
      shared.openDialog("Obaveštenje", "Prediktor je uspešno poslat na probu."); //pisalo je "na treniranje" ??
    })
    console.log(this.inputs);
  }
}
