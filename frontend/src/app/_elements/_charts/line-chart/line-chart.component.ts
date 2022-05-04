import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})

export class LineChartComponent implements AfterViewInit {

  dataAcc: number[] = [2,3,5,5,6,7,8,8,4,6,2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97,2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
  dataMAE: number[] = [2,3,5,5,6,7,8,8,4,6,2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97,2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
  dataMSE: number[] = [2,3,5,5,6,7,8,8,4,6,2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97,2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
  dataLOSS: number[] =[2,3,5,5,6,7,8,8,4,6,2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97,2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];

  dataEpoch: number[] = [2,3,5,5,6,7,8,8,4,6,2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97,2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];

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

  ngAfterViewInit(): void {
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
              x:{
                ticks: {
                  color: 'white'
                },
                grid: {
                  color: "rgba(0, 99, 171, 0.5)"
                }
              },
              y: {
                  beginAtZero: true,
                  ticks: {
                    color: 'white'
                  },
                  grid: {
                    color: "rgba(0, 99, 171, 0.5)"
                  }
              }
              
          }
          
          
      }
      }
    );
  }
}
