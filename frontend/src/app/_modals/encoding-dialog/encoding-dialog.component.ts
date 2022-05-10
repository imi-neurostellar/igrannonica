import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Encoding } from 'src/app/_data/Experiment';


@Component({
  selector: 'app-encoding-dialog',
  templateUrl: './encoding-dialog.component.html',
  styleUrls: ['./encoding-dialog.component.css']
})
export class EncodingDialogComponent implements OnInit {

  selectedEncodingType?: Encoding;
  Encoding = Encoding;
  Object = Object;

  constructor(public dialogRef: MatDialogRef<EncodingDialogComponent>) 
  { 
    this.selectedEncodingType = Encoding.Label;
  }

  ngOnInit(): void {
  }

  onNoClick() {
    this.dialogRef.close();
  }

  withEnterKey(keyboardEvent: KeyboardEvent) {
    if (keyboardEvent.code == "Enter" || keyboardEvent.code == "NumpadEnter") 
      this.onYesClick();
  }

  onYesClick() {
    this.dialogRef.close(this.selectedEncodingType);
  }
} 
