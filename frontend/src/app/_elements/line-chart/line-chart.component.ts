import { Component, OnInit, Input } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})

export class LineChartComponent implements OnInit {

  dataAcc: number[] = [];
  dataMAE: number[] = [];
  dataMSE: number[] = [];
  dataLOSS: number[] = [];

  dataEpoch: number[] = [];

  constructor() {
    /*let i = 0;
    setInterval(() => {
      this.dataAcc.push(0.5);
      this.dataEpoch.push(i);
      i++;
      this.update();
    }, 200);*/
  }

  myChart!: Chart;

  update(myEpochs: number[], myAcc: number[], myLoss: number[], myMae: number[], myMse: number[]) {
    this.dataAcc.length = 0;
    this.dataAcc.push(...myAcc);

    this.dataEpoch.length = 0;
    this.dataEpoch.push(...myEpochs);

    this.dataMAE.length = 0;
    this.dataMAE.push(...myMae);

    this.dataLOSS.length = 0;
    this.dataLOSS.push(...myLoss);

    this.dataMSE.length = 0;
    this.dataMSE.push(...myMse);

    this.myChart.update();
  }

  ngOnInit(): void {
    this.myChart = new Chart("myChart",
      {
        type: 'line',
        data: {
          labels: this.dataEpoch,
          datasets: [{
            label: 'Accuracy',
            data: this.dataAcc,
            borderWidth: 1
          },
          {
            label: 'Loss',
            data: this.dataLOSS,
            borderWidth: 1
          },
          {
            label: 'MAE',
            data: this.dataMAE,
            borderWidth: 1
          },
          {
            label: 'MSE',
            data: this.dataMSE,
            borderWidth: 1
          }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      }
    );
  }
}
