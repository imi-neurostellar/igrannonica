import { Component, OnInit } from '@angular/core';
import {Chart} from 'node_modules/chart.js';

@Component({
  selector: 'app-scatterchart',
  templateUrl: './scatterchart.component.html',
  styleUrls: ['./scatterchart.component.css']
})

@Input() dataset?: Dataset;
  @Input() experiment?: Experiment;
  @ViewChildren("nullValMenu") nullValMenus!: ElementRef[];
  @Output() okPressed: EventEmitter<string> = new EventEmitter();
  Object = Object;
  Encoding = Encoding;
  NullValueOptions = NullValueOptions;
  ColumnType = ColumnType;
  tableData?: any[][];
  nullValOption: string[] = [];

  columnsChecked: boolean[] = []; //niz svih kolona

export class ScatterchartComponent implements OnInit {

  constructor() { }

  ngOnInit(){
    const myChart = new Chart("ScatterCharts", {
      type: 'scatter',
      data: {
        this.datasetService.getMyDatasets().subscribe((datasets) => {
          this.dataset = datasets[1];
    
          this.setColumnTypeInitial();
          this.experiment = new Experiment();
          this.dataset.columnInfo.forEach(column => {
            this.columnsChecked.push(true);
          });
          console.log(datasets);
          for (let i = 0; i < this.dataset?.columnInfo.length; i++) {
            this.experiment?.inputColumns.push(this.dataset.columnInfo[i].columnName);
          }
          this.resetColumnEncodings(Encoding.Label);
          this.setDeleteColumnsForMissingValTreatment();
    
          this.nullValOption = [].constructor(this.dataset.columnInfo.length).fill('Obriši redove');
    
          this.datasetService.getDatasetFilePartial(this.dataset.fileId, 0, 10).subscribe((response: string | undefined) => {
            if (response && this.dataset != undefined) {
              this.tableData = this.csvParseService.csvToArray(response, (this.dataset.delimiter == "razmak") ? " " : (this.dataset.delimiter.toString() == "") ? "," : this.dataset.delimiter);
            }
          });
        }
          datasets: [{
              label: 'Scatter Example:',
              data: [{x: 1, y: 11}, {x:2, y:12}, {x: 1, y: 2}, {x: 2, y: 4}, {x: 3, y: 8},{x: 4, y: 16}, {x: 1, y: 3}, {x: 3, y: 4}, {x: 4, y: 6}, {x: 6, y: 9},
                {x: 11, y: 9},
                {x: 12, y: 8},
                {x: 13, y: 6},
                {x: 14, y: 0},
                {x: 15, y: 5},
                {x: 16, y: 3},
                {x: 17, y: 2}],
                borderColor: 'white',
            }]
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
  });
  }
}
