import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.css']
})
export class DatatableComponent implements OnInit {

  @Input() hasHeader?: boolean = true;

  @Input() data?: any[] = [];

  hasInput = false;
  loaded = false;

  constructor() { }

  ngOnInit(): void {
  }

}
