import { Component, OnInit } from '@angular/core';
import {Chart} from 'node_modules/chart.js';

@Component({
  selector: 'app-scatterchart',
  templateUrl: './scatterchart.component.html',
  styleUrls: ['./scatterchart.component.css']
})
export class ScatterchartComponent implements OnInit {

  constructor() { }

  ngOnInit(){
    const myChart = new Chart("ScatterCharts", {
      type: 'scatter',
      data: {
          datasets: [{
              label: 'Scatter Example:',
              data: [{x: 1, y: 11}, {x:2, y:12}, {x: 1, y: 2}, {x: 2, y: 4}, {x: 3, y: 8},{x: 4, y: 16}, {x: 1, y: 3}, {x: 3, y: 4}, {x: 4, y: 6}, {x: 6, y: 9}],
              backgroundColor: 'rgb(255, 99, 132)'
            }]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
  }
}
