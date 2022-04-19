import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-carousel-vertical',
  templateUrl: './carousel-vertical.component.html',
  styleUrls: ['./carousel-vertical.component.css']
})
export class CarouselVerticalComponent implements OnInit, AfterViewInit {

  @ViewChild('wrapper') wrapper!: ElementRef;

  @Input() items!: any[];

  itemsToShow: any[] = [];

  @Input() type: string = "Object";

  scroll = 0;
  height = 9; //rem

  currentIndex = 0;

  @Input() shownElements: number = 5;

  constructor() {
  }

  ngOnInit(): void {
    this.itemsToShow = [...this.items.slice(0, this.shownElements)];
    console.log('0', this.itemsToShow);
  }

  ngAfterViewInit(): void {
    const container = this.wrapper.nativeElement

    container.addEventListener('scroll', (event: Event) => {
      this.scroll = (container.scrollTop / (container.scrollHeight - container.clientHeight));
      if (this.scroll == 1.0) {
        //console.log('removed', this.itemsToShow.splice(0, 1)[0].name);
        const itemToAdd = this.items[(this.currentIndex + this.shownElements) % (this.items.length - 1)];
        this.itemsToShow.push(itemToAdd);
        //console.log('added', itemToAdd.name);
        this.currentIndex = (this.currentIndex + 1);
        container.scrollTop = (container.scrollHeight - container.clientHeight) / 2;
      }
    });
  }

  clickItem(index: number) {
  }

  calcVisibility(i: number) {
    //return ((Math.sin((((i) / this.shownElements) - this.scroll) * Math.PI) + 1) / 2)
    const iPercent = (i + 1 - this.scroll) / this.shownElements;
    return iPercent;
  }

  calcStyle(i: number) {
    const a = this.calcVisibility(i)
    const v = (Math.sin(a * Math.PI) + 1) / 2;
    return `transform: translateY(${v * 100}%) scale(${v}) perspective(${v * 200}em) rotateX(${(1 - a) * 180 - 90}deg);
            opacity: ${v};
            height: ${this.height}rem;`;
  }
}
