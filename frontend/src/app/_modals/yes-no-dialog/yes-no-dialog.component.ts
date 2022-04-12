import { Component, OnInit } from '@angular/core';
import { Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

interface DialogData {
  title: string;
  message: string;
  yesFunction:Function;
}

@Component({
  selector: 'app-yes-no-dialog',
  templateUrl: './yes-no-dialog.component.html',
  styleUrls: ['./yes-no-dialog.component.css']
})
export class YesNoDialogComponent {
  
  constructor(
    public dialogRef: MatDialogRef<YesNoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    //public dialog: MatDialog
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  onYesClick():void{
    this.data.yesFunction();
    this.dialogRef.close();
  }


}
