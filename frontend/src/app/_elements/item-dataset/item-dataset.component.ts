import { Component, Input, OnInit } from '@angular/core';
import Dataset from 'src/app/_data/Dataset';

@Component({
  selector: 'app-item-dataset',
  templateUrl: './item-dataset.component.html',
  styleUrls: ['./item-dataset.component.css']
})
export class ItemDatasetComponent {

  @Input() dataset: Dataset = new Dataset();

  constructor() {
  }
}
