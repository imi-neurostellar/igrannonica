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

  @Input()width: number = 600;
  @Input()height: number = 800;
  
  @ViewChild('boxplot') chartRef!: ElementRef;
  constructor() { }

  boxplotData = {
    // define label tree
    labels: ['January'/*, 'February', 'March', 'April', 'May', 'June', 'July'*/],
      datasets: [{
      label: 'Dataset 1',
      backgroundColor: 'rgba(255,0,0,0.5)',
      borderColor: 'red',
      borderWidth: 1,
      outlierColor: '#999999',
      padding: 10,
      itemRadius: 0,
      data: [
      randomValues(100, 0, 100),
      /*randomValues(100, 0, 20),
      randomValues(100, 20, 70),
      randomValues(100, 60, 100),
      randomValues(40, 50, 100),
      randomValues(100, 60, 120),
      randomValues(100, 80, 100)*/
    ]}/*, {
    label: 'Dataset 2',
    backgroundColor: 'rgba(0,0,255,0.5)',
    borderColor: 'blue',
    borderWidth: 1,
    outlierColor: '#999999',
    padding: 10,
    itemRadius: 0,
    data: [
    randomValues(100, 60, 100),
    randomValues(100, 0, 100),
    randomValues(100, 0, 20),
    randomValues(100, 20, 70),
    randomValues(40, 60, 120),
    randomValues(100, 20, 100),
    randomValues(100, 80, 100)
    ]
    }*/]
    };
  ngAfterViewInit(): void {
  const myChart = new Chart(this.chartRef.nativeElement, {
    type: "boxplot",
    data: this.boxplotData,
    options: {
      /*title: {
        display: true,
        text: 'Predicted world population (millions) in 2050'
      }*/
      plugins:{   
        legend: {
          display: false
                },
             },
             scales : {
              y : {
                  min: -50,
                  max: 200
              }
          }
    }
  });
}

}
