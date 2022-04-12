import { Component, Input, OnInit } from '@angular/core';
import Experiment from 'src/app/_data/Experiment';

@Component({
  selector: 'app-item-experiment',
  templateUrl: './item-experiment.component.html',
  styleUrls: ['./item-experiment.component.css']
})
export class ItemExperimentComponent{

  @Input() experiment: Experiment = new Experiment();

  constructor() { }

}
