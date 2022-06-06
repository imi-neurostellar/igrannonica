import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Dataset from 'src/app/_data/Dataset';
import { FolderType } from 'src/app/_data/FolderFile';
import Model from 'src/app/_data/Model';
import { DatasetsService } from 'src/app/_services/datasets.service';
import { ModelsService } from 'src/app/_services/models.service';

interface DialogData {
  file: (Dataset | Model);
  fileType: FolderType;
}

@Component({
  selector: 'app-share-dialog',
  templateUrl: './share-dialog.component.html',
  styleUrls: ['./share-dialog.component.css']
})
export class ShareDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<ShareDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private modelsService: ModelsService, private datasetsService: DatasetsService) {

  }

  link: string = '';

  ngOnInit(): void {
    let link = window.location.origin;
    if (this.data.fileType == FolderType.Dataset) {
      link += '/dataset/';
    } else if (this.data.fileType == FolderType.Model) {
      link += '/model/';
    }
    link += this.data.file._id;
    this.link = link;
  }

  close() {
    this.dialogRef.close();
  }

  copy() {
    navigator.clipboard.writeText(this.link);
  }

  publicChanged() {
    if (this.data.fileType == FolderType.Dataset) {
      this.datasetsService.updateDatasetIsPublic(this.data.file._id, this.data.file.isPublic).subscribe(() => {
      });
    } else if (this.data.fileType == FolderType.Model) {
      this.modelsService.updateModelIsPublic(this.data.file._id, this.data.file.isPublic).subscribe(() => {
      });
    }

    if (this.data.file.isPublic) {
      this.data.file.accessibleByLink = true;
    }
  }

  linkChanged() {
    if (this.data.fileType == FolderType.Dataset) {
      this.datasetsService.updateDatasetAccessibleByLink(this.data.file._id, this.data.file.accessibleByLink).subscribe(() => {
      });
    } else if (this.data.fileType == FolderType.Model) {
      this.modelsService.updateModelAccessibleByLink(this.data.file._id, this.data.file.accessibleByLink).subscribe(() => {
      });
    }
  }

  FolderType = FolderType;
}
