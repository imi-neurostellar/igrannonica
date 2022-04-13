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

  inputs : Column[] = [];


  predictor:Predictor;
  constructor(private predictS : PredictorsService, private route: ActivatedRoute) {
    this.predictor = new Predictor();
   }

  ngOnInit(): void {
    this.route.params.subscribe(url => {
      this.predictS.getPredictor(url["id"]).subscribe(p => {
      
        this.predictor = p;
        this.predictor.inputs.forEach((p,index)=> this.inputs[index] = new Column(p, ""));
      })
    });
  }

  usePredictor(): void{ 
    this.predictS.usePredictor(this.predictor, this.inputs).subscribe(p => {
      shared.openDialog("Obaveštenje", "Prediktor je uspešno poslat na probu."); //pisalo je "na treniranje" ??
    })
  }
}


export class Column {
  constructor(
    public name : string, 
    public value : (number | string)){
  }
}