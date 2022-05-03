import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-save-experiment-dialog',
  templateUrl: './save-experiment-dialog.component.html',
  styleUrls: ['./save-experiment-dialog.component.css']
})
export class SaveExperimentDialogComponent implements OnInit {

  selectedName: string = '';

  constructor(public dialogRef: MatDialogRef<SaveExperimentDialogComponent>) { }

  ngOnInit(): void {
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
