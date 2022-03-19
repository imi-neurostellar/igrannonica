import { Component, OnInit } from '@angular/core';
import Dataset from 'src/app/_data/Dataset';

@Component({
  selector: 'app-my-datasets',
  templateUrl: './my-datasets.component.html',
  styleUrls: ['./my-datasets.component.css']
})
export class MyDatasetsComponent implements OnInit {

  myDatasets?: Dataset[];

  constructor() {
    this.myDatasets = [
      new Dataset('Titanik', 'Opis titanik', ['K1', 'K2', 'K3', 'Ime', 'Preziveli']),
      new Dataset('Neki drugi set', 'opis', ['a', 'b', 'c']),
      new Dataset('Treci set', 'opis', ['a', 'b', 'c'])
    ];
  }

  ngOnInit(): void {
  }

}
