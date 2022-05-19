import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Chart, LinearScale, CategoryScale } from 'chart.js';
import { BoxPlotController, BoxAndWiskers } from '@sgratzl/chartjs-chart-boxplot';

function randomValues(count: number, min: number, max: number) {
  const delta = max - min;
  return Array.from({ length: count }).map(() => Math.random() * delta + min);
}

Chart.register(BoxPlotController, BoxAndWiskers, LinearScale, CategoryScale);

@Component({
  selector: 'app-box-plot',
  templateUrl: './box-plot.component.html',
  styleUrls: ['./box-plot.component.css']
})
export class BoxPlotComponent implements AfterViewInit {

  @Input() width?: number;
  @Input() height?: number;
  @Input() mean?: number;
  @Input() median?: number;
  @Input() min?: number;
  @Input() max?: number;
  @Input() q1?: number;
  @Input() q3?: number;

  updateChart(min: number, max: number, q1: number, q3: number, median: number) {
    if (this.myChart) {
      this.boxplotData.datasets[0].data = [[min, q1, median, q3, max]]
      this.myChart?.update();
    }
    /*this.boxplotData.datasets = [{
      data: [[min, q1, median, q3, max]],
    }]*/

  };

  /*
  updatePieChart(uniqueValues: string[], uniqueValuesPercent: number[]){
    //console.log(this.uniqueValues, this.uniqueValuesPercent);
    this.pieChartData.datasets =  [{
        label: "%",
        backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850", "#000000"],
        data: uniqueValuesPercent,
      }];
      this.pieChartData.labels = uniqueValues
      console.log(this.uniqueValues, this.uniqueValuesPercent);
      this.myChart?.update() 
    };
  */

  @ViewChild('boxplot') chartRef!: ElementRef;
  constructor() {
    //this.updateChart();
  }

  boxplotData = {
    // define label tree
    //labels: ['January'/*, 'February', 'March', 'April', 'May', 'June', 'July'*/],
    datasets: [{
      label: 'Dataset 1',
      backgroundColor: '#0063AB',
      borderColor: '#dfd7d7',
      borderWidth: 1,
      outlierColor: '#999999',
      scaleFontColor: '#0063AB',
      padding: 10,
      itemRadius: 0,
      data: [
        randomValues(100, 0, 100),
      ]
    }]
  };
  ngAfterViewInit(): void {
    this.myChart = new Chart(this.chartRef.nativeElement, {
      type: "boxplot",
      data: this.boxplotData,
      options: {
        plugins: {
          legend: {
            display: false
          },
        },
        scales: {
          x: {
            ticks: {
              color: '#dfd7d7'
            },
            grid: {
              color: "rgba(0, 99, 171, 0.5)"
            }
          },
          y: {
            min: this.min,
            max: this.max,
            ticks: {
              color: '#dfd7d7'
            },
            grid: {
              color: "rgba(0, 99, 171, 0.5)"
            }
          }
        }
      }
    });
  }

  myChart?: Chart;
}
