import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { LineChartComponent } from '../_charts/line-chart/line-chart.component';

@Component({
  selector: 'app-metric-view',
  templateUrl: './metric-view.component.html',
  styleUrls: ['./metric-view.component.css']
})
export class MetricViewComponent implements OnInit {
  @ViewChild(LineChartComponent) linechartComponent!: LineChartComponent;

  constructor() { }

  ngOnInit(): void {
  }

  history: any[] = [];

  update(history: any[]) {
    const myAcc: number[] = [];
    const myMae: number[] = [];
    const myMse: number[] = [];
    const myLoss: number[] = [];

    const myEpochs: number[] = [];
    this.history = history;
    this.history.forEach((metrics, epoch) => {
      myEpochs.push(epoch + 1);
      for (let key in metrics) {
        let value = metrics[key];
        console.log(key, ':::', value, epoch);
        if (key === 'accuracy') {
          myAcc.push(parseFloat(value));
        }
        else if (key === 'loss') {
          myLoss.push(parseFloat(value));
        }
        else if (key === 'mae') {
          myMae.push(parseFloat(value));
        }
        else if (key === 'mse') {
          myMse.push(parseFloat(value));
        }
      }
    });

    this.linechartComponent.update(myEpochs, myAcc, myLoss, myMae, myMse);
  }
}