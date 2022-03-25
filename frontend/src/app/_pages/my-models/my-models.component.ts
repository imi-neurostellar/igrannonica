import { Component, OnInit } from '@angular/core';
import Model from 'src/app/_data/Model';

@Component({
  selector: 'app-my-models',
  templateUrl: './my-models.component.html',
  styleUrls: ['./my-models.component.css']
})
export class MyModelsComponent /*implements OnInit*/ {
  myModels: Model[];

  constructor() {
    this.myModels = [
    new Model('Titanik', 'Opis titanik'),
    new Model('Neki drugi set', 'opis'),
    new Model('Treci set', 'opis')
  ]; }

  /*ngOnInit(): void {
  }
*/
}
