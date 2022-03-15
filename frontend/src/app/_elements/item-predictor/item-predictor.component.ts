import { Component, Input, OnInit } from '@angular/core';
import Predictor from 'src/app/_data/Predictor';

@Component({
  selector: 'app-item-predictor',
  templateUrl: './item-predictor.component.html',
  styleUrls: ['./item-predictor.component.css']
})
export class ItemPredictorComponent implements OnInit {

  @Input() predictor: Predictor = new Predictor();

  constructor() { }

  ngOnInit(): void {
  }

}
