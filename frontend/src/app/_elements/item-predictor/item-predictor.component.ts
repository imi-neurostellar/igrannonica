import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Predictor from 'src/app/_data/Predictor';

@Component({
  selector: 'app-item-predictor',
  templateUrl: './item-predictor.component.html',
  styleUrls: ['./item-predictor.component.css']
})
export class ItemPredictorComponent implements OnInit {

  @Input() predictor: Predictor = new Predictor();

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  openPredictor() {
    this.router.navigate(['predict/'+ '6244958a26cf2385bc29ba2c']);
    //this.router.navigate(['predict'+this.predictor._id]);
    }

}
