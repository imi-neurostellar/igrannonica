import { Component, OnInit } from '@angular/core';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
@Component({
  selector: 'app-experiment',
  templateUrl: './experiment.component.html',
  styleUrls: ['./experiment.component.css']
})
export class ExperimentComponent implements OnInit {

event:number=0;


  constructor() { }

  ngOnInit(): void {
  }

  ChangePage(event:StepperSelectionEvent){
    this.event=event.selectedIndex;
    console.log(this.event);

  }

}
