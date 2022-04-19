import { Component, OnInit,Input } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import {Chart} from 'chart.js';
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})

export class LineChartComponent implements OnInit {
  @Input() dataAcc=[] ;
  @Input() dataEpoch=[];
  constructor() { }

  ngOnInit(): void {
    var myChart=new Chart("myChart",
      {
        type: 'line',
    data: {
        labels:this.dataEpoch,
        datasets: [{
            label: 'Vrednost',
            data: this.dataAcc,
            borderWidth: 1
        }]
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
 