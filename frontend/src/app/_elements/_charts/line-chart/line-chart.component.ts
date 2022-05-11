import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})

export class LineChartComponent implements AfterViewInit {

  dataAcc: number[] = [];
  dataMAE: number[] = [];
  dataMSE: number[] = [];
  dataLOSS: number[] = [];
  dataValAcc:number[]=[];
  dataValMAE:number[]=[];
  dataValMSE:number[]=[];
  dataValLoss:number[]=[];
  dataEpoch: number[] = [];

  constructor() {
  }

  myChart!: Chart;

  update(myEpochs: number[], myAcc: number[], myLoss: number[], myMae: number[], myMse: number[], myValAcc:number[],myValLoss:number[],myValMae:number[],myValMse:number[]) {
    this.dataAcc.length = 0;
    this.dataAcc.push(...myAcc);

    this.dataEpoch.length = 0;
    this.dataEpoch.push(...myEpochs);

    this.dataMAE.length = 0;
    this.dataMAE.push(...myMae);

    this.dataLOSS.length = 0;
    this.dataLOSS.push(...myLoss);

    this.dataMSE.length = 0;
    this.dataMSE.push(...myValAcc);

    this.dataMSE.length = 0;
    this.dataMSE.push(...myValLoss);

    this.dataMSE.length = 0;
    this.dataMSE.push(...myValMae);

    this.dataMSE.length = 0;
    this.dataMSE.push(...myValMse);

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
            borderWidth: 1,
            
          },
          {
            label: 'VAl_Accuracy',
            data: this.dataMSE,
            borderWidth: 1
          },
          {
            label: 'Loss',
            data: this.dataLOSS,
            borderWidth: 1
          },
          {
            label: 'Val_Loss',
            data: this.dataMSE,
            borderWidth: 1
          },
          {
            label: 'MAE',
            data: this.dataMAE,
            borderWidth: 1
          },
          {
            label: 'Val_MAE',
            data: this.dataMSE,
            borderWidth: 1
          },
          {
            label: 'MSE',
            data: this.dataMSE,
            borderWidth: 1
          },
          {
            label: 'Val_MSE',
            data: this.dataMSE,
            borderWidth: 1
          }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,

          plugins: {
            legend: {
                labels: {
                    // This more specific font property overrides the global property
                    color:'white',
                    font: {
                      size: 10
                  }
                }
            }
          },
          scales: {
            x: {
              ticks: {
                color: 'white'
              },
              grid: {
                color: "rgba(0, 99, 171, 0.5)"
              },
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

          },
          animation: {
            duration: 0
          }

        }
      }
    );
  }
}
