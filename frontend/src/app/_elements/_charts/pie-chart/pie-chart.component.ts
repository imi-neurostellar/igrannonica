import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {Chart} from 'chart.js';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements AfterViewInit {

  @Input()width?: number;
  @Input()height?: number;
  
  @ViewChild('piechart') chartRef!: ElementRef;
  constructor() { }

  @Input()width?: number;
  @Input()height?: number;
  @Input()uniqueValues?: string[] = [];
  @Input()uniqueValuesPercent?: number[] = [];

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

  ngAfterViewInit(): void {
  const myChart = new Chart(this.chartRef.nativeElement, {
    type: 'pie',
    data: {
      labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
      datasets: [{
        label: "Population (millions)",
        backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
        data: [2478,5267,734,784,433],
      }]
    },
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
             layout: {
              padding: 15}
    }
});

  }


}
