import { Component, OnInit } from '@angular/core';
import Dataset from 'src/app/_data/Dataset';
import Predictor from 'src/app/_data/Predictor';
import { ItemDatasetComponent } from 'src/app/_elements/item-dataset/item-dataset.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  publicDatasets: Dataset[];

  constructor() {
    this.publicDatasets = [
      new Dataset('Dataset1', 'Lorem ipsum dolor sir amet', ['kolona1', 'kolona2', 'kolona3']),
      new Dataset('Drugi Dataset', 'Lorem ipsum dolor sir amet', ['jabuka', 'kruska', 'jagoda']),
      new Dataset('Dataset III', 'Kratak opis izvora podataka', ['c1', 'c2', 'c3', 'c4', 'c5']),
    ]
  }

  ngOnInit(): void {
  }

}
