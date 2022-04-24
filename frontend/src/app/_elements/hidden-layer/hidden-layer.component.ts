import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-hidden-layer',
  templateUrl: './hidden-layer.component.html',
  styleUrls: ['./hidden-layer.component.css']
})
export class HiddenLayerComponent implements OnInit {
  
  constructor() { }

  ngOnInit(): void {
  }
  selectFormControl = new FormControl('', Validators.required);
}
