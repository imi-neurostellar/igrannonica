import { Component, OnInit } from '@angular/core';
import Dataset from 'src/app/_data/Dataset';
import { DatasetsService } from 'src/app/_services/datasets.service';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})
export class ArchiveComponent implements OnInit {

  publicDatasets: Dataset[] = [];

  constructor(private datasetsService: DatasetsService) { }

  ngOnInit(): void {
    this.datasetsService.getPublicDatasets().subscribe((datasets) => {
      this.publicDatasets = datasets;
      this.publicDatasets.forEach((element, index) => {
        this.publicDatasets[index] = (<Dataset>element);
      })
    });
  }


  changePage(event: StepperSelectionEvent) {
    this.updatePage(<number>event.selectedIndex)
  }

  goToPage(pageNum: number) {
    this.stepper.selectedIndex = pageNum;
    this.updatePage(pageNum);
  }

  scrollTimeout: any;

  updatePage(pageNum: number) {
    this.scrolling = true;
    this.event = pageNum;
    let scrollAmount = 0;
    this.steps.forEach((step, index) => {
      if (index == pageNum) {
        scrollAmount = step.nativeElement.offsetTop;
      }
    })
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.scrolling = false;
    }, 800);
    this.stepsContainer.nativeElement.scroll({
      top: scrollAmount,
      behavior: 'smooth' //auto, smooth, initial, inherit
    });
  }

  scrolling: boolean = false;

  FolderType = FolderType;

  TabType = TabType;

}
