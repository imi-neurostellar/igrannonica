import { Component, OnInit } from '@angular/core';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
@Component({
  selector: 'app-experiment',
  templateUrl: './experiment.component.html',
  styleUrls: ['./experiment.component.css']
})
export class ExperimentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  test(event:StepperSelectionEvent){
    console.log(event);
  }

}
