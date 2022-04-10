import { ElementRef } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertDialogComponent } from './_modals/alert-dialog/alert-dialog.component';

class Shared {
    constructor(
        public loggedIn: boolean,
        public username: string = '',
        public userId: string = '',
        public photoId: string = '1',
        public dialog?: MatDialog
        //public alertDialog?: ElementRef
    ) { }


    openDialog(title: string, message: string): void {

        if (this.dialog) {
            const dialogRef = this.dialog.open(AlertDialogComponent, {
                width: '350px',
                data: { title: title, message: message }
            });
            dialogRef.afterClosed().subscribe(res => {
                //nesto
            });
        }
    }
}

export default new Shared(false);