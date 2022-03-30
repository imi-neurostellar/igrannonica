import { Component, OnInit } from '@angular/core';
import Predictor from 'src/app/_data/Predictor';

@Component({
  selector: 'app-predict',
  templateUrl: './predict.component.html',
  styleUrls: ['./predict.component.css']
})
export class PredictComponent implements OnInit {

  predictor:Predictor;
  constructor() {
    this.predictor = new Predictor();
   }

  ngOnInit(): void {
  }

}
