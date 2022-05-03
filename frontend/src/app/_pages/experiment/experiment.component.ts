import { AfterViewInit, Component, ElementRef, ViewChild, ViewChildren } from '@angular/core';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';
import Shared from 'src/app/Shared';
import { FolderType } from 'src/app/_data/FolderFile';
import { TabType } from 'src/app/_elements/folder/folder.component';

@Component({
  selector: 'app-experiment',
  templateUrl: './experiment.component.html',
  styleUrls: ['./experiment.component.css']
})
export class ExperimentComponent implements AfterViewInit {

  @ViewChild(MatStepper) stepper!: MatStepper;
  @ViewChild('stepsContainer') stepsContainer!: ElementRef;
  @ViewChildren('steps') steps!: ElementRef[];

  event: number = 0;

  constructor() { }

  stepHeight = this.calcStepHeight();

  calcStepHeight() {
    return window.innerHeight - 64;
  }

  ngAfterViewInit(): void {
    window.addEventListener('resize', () => {
      this.updatePageHeight();
    })
    this.updatePageHeight();

    setInterval(() => {
      this.updatePageIfScrolled();
    }, 100);

    this.stepsContainer.nativeElement.addEventListener('scroll', (event: Event) => {
      Shared.emitBGScrollEvent(this.stepsContainer.nativeElement.scrollTop);
    });
  }

  updatePageIfScrolled() {
    if (this.scrolling) return;
    const currentPage = Math.round(this.stepsContainer.nativeElement.scrollTop / this.stepHeight)
    this.stepper.selectedIndex = currentPage;
  }

  updatePageHeight() {
    this.stepHeight = this.calcStepHeight();
    const stepHeight = `${this.stepHeight}px`;
    this.stepsContainer.nativeElement.style.minHeight = stepHeight;
    this.steps.forEach(step => {
      step.nativeElement.style.minHeight = stepHeight;
    })
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

  columnTableChangedEvent() {
    //sta se desi kad se nesto promeni u column-table komponenti...
    console.log("promenio se column-table");
  }

}
