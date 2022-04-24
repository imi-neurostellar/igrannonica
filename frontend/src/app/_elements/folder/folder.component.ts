import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Dataset from 'src/app/_data/Dataset';
import Model from 'src/app/_data/Model';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.css']
})
export class FolderComponent implements OnInit {

  @Input() folderName: string = 'Moji podaci';

  @Input() files!: (Dataset | Model)[]

  newFile!: Dataset | Model;

  @Input() type: FolderType = FolderType.Dataset;

  newFileSelected: boolean = true;

  selectedFileIndex: number = -1;
  hoveringOverFileIndex: number = -1;

  fileToDisplay?: (Dataset | Model);

  @Output() selectedFileChanged: EventEmitter<(Dataset | Model)> = new EventEmitter();

  constructor() {
    //PLACEHOLDER
    this.files = [
      new Dataset('Titanik'),
      new Dataset('Dijamanti'),
      new Dataset('Filmovi'),
    ]
  }

  ngOnInit(): void {
    if (this.files.length > 0)
      this.selectFile(0);
    else {
      this.selectNewFile();
    }
  }

  hoverOverFile(i: number) {
    this.hoveringOverFileIndex = i;
    if (i != -1) {
      this.fileToDisplay = this.files[i];
    } else {
      if (this.newFileSelected) {
        this.fileToDisplay = this.newFile;
      } else {
        this.fileToDisplay = this.files[this.selectedFileIndex];
      }
    }
  }

  selectNewFile() {
    if (!this.newFile) {
      this.createNewFile();
    }
    this.fileToDisplay = this.newFile;
    this.selectedFileIndex = -1;
    this.newFileSelected = true;
    this.selectedFileChanged.emit(this.newFile);
  }

  selectFile(index: number) {
    this.selectedFileIndex = index;
    this.fileToDisplay = this.files[index];
    this.newFileSelected = false;
    this.selectedFileChanged.emit(this.files[index]);
  }

  createNewFile() {
    if (this.type == FolderType.Dataset) {
      this.newFile = new Dataset();
    } else if (this.type == FolderType.Model) {
      this.newFile = new Model();
    }
  }

  saveNewFile() {
    // TODO
  }

  calcZIndex(i: number) {
    let zIndex = (this.files.length - i - 1)
    if (this.selectedFileIndex == i)
      zIndex = this.files.length + 2;
    if (this.hoveringOverFileIndex == i)
      zIndex = this.files.length + 3;
    return zIndex;
  }

  newFileZIndex() {
    return (this.files.length + 1);
  }
}

export enum FolderType {
  Dataset,
  Model
} 
