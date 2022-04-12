import { Component, Input, OnInit } from '@angular/core';
import Model from 'src/app/_data/Model';

@Component({
  selector: 'app-item-model',
  templateUrl: './item-model.component.html',
  styleUrls: ['./item-model.component.css']
})
export class ItemModelComponent implements OnInit {

  @Input() model: Model = new Model();
  isShowDiv = true;
  randomOrd='';

  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
  }
 
  constructor() { }

  ngOnInit(): void {
    /*if(this.model.randomOrder)
    {
      this.randomOrd='Da';
    }
    else
    {
      this.randomOrd='Ne';
    }
*/
  }

}
