import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dataset-load',
  templateUrl: './dataset-load.component.html',
  styleUrls: ['./dataset-load.component.css']
})
export class DatasetLoadComponent {

   //array varibales to store csv data
   lines : any[] = []; //for headings
   linesR : any[] = []; // for rows

/*
    const csv = require('csv-parser')
    const fs = require('fs')
    const res : string[] = [];

    fs.createReadStream('https://raw.githubusercontent.com/sharmaroshan/Churn-Modelling-Dataset/master/Churn_Modelling.csv')
      .pipe(csv())
      .on('data', (data : string) => res.push(data))
      .on('end', () => {
        console.log(res);

*/

  changeListener(files: FileList) {

    console.log(files);

    if(files && files.length > 0) {
    
      let file: File | null = files.item(0);
      if (file == null)
        return;

      if (file) { 
          console.log(file.name);
          console.log(file.size);
          console.log(file.type);
          //File reader method
          let reader: FileReader = new FileReader();
          reader.readAsText(file);
          reader.onload = (e) => {
            let csv: any = reader.result;
            let allTextLines = [];
            allTextLines = csv.split(/\r|\n|\r/);
          
          //Table Headings
            let headers = allTextLines[0].split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
            let data = headers;
            let tarr = [];
            for (let j = 0; j < headers.length; j++) {
              tarr.push(data[j]);
            }
            //Pusd headings to array variable
            this.lines.push(tarr);
            //console.log(this.lines);
            
          
            // Table Rows
            let tarrR : string[] = [];
            
            let arrl = allTextLines.length;
            let rows = [];
            for(let i = 1; i < arrl; i++){
            rows.push(allTextLines[i].split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/));
          
            }
            
            for (let j = 0; j < arrl; j++) {
                tarrR.push(rows[j]);
            }
          //Push rows to array variable
            this.linesR.push(tarrR);
            console.log(this.linesR);
        }
      }
    }
  }

}
