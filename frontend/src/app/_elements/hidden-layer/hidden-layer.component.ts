import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import Model from 'src/app/_data/Model';
@Component({
  selector: 'app-hidden-layer',
  templateUrl: './hidden-layer.component.html',
  styleUrls: ['./hidden-layer.component.css']
})
export class HiddenLayerComponent implements OnInit {
  hiddenLayerNum:number=1;
  constructor() { }

  ngOnInit(): void {
  }
  selectActivationFormControl = new FormControl('', Validators.required);
  selectRegularisationFormControl = new FormControl('', Validators.required);
  selectRRateFormControl = new FormControl('', Validators.required);
}
