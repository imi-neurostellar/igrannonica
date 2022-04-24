import { Component, ViewEncapsulation } from '@angular/core';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
@Component({
  selector: 'app-experiment',
  templateUrl: './experiment.component.html',
  styleUrls: ['./experiment.component.css']
})
export class ExperimentComponent {

  event: number = 0;

  constructor() { }

  changePage(event: StepperSelectionEvent) {
    this.event = event.selectedIndex;
    console.log(this.event);
  }


}
