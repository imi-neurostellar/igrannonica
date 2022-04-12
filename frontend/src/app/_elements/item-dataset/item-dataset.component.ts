import { Component, Input, OnInit } from '@angular/core';
import Dataset from 'src/app/_data/Dataset';

@Component({
  selector: 'app-item-dataset',
  templateUrl: './item-dataset.component.html',
  styleUrls: ['./item-dataset.component.css']
})
export class ItemDatasetComponent {

  @Input() dataset: Dataset = new Dataset();
  visibleicon='';
  accessibleicon='';
  isShowDiv = true;
  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
  }
  constructor() {
  }
  ngOnInit(): void {
    if(this.dataset.isPublic==true)
    {
      this.visibleicon='visibility'
    }
    else
    {
      this.visibleicon='visibility_off';
    }

    if(this.dataset.accessibleByLink==true)
    {
      this.accessibleicon='link'
    }
    else
    {
      this.accessibleicon='link_off';
    }
  }
}

