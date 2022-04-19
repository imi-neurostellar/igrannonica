import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SignalRService } from 'src/app/_services/signal-r.service';
import { LineChartComponent } from '../line-chart/line-chart.component';
@Component({
  selector: 'app-metric-view',
  templateUrl: './metric-view.component.html',
  styleUrls: ['./metric-view.component.css']
})
export class MetricViewComponent implements OnInit {
  @ViewChild(LineChartComponent) linechartComponent!: LineChartComponent;

  @Input() history!: any[];

  constructor(private signalRService: SignalRService) { }

  ngOnInit(): void {
  }

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