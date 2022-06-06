import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageDatasetComponent } from './page-dataset.component';

describe('PageDatasetComponent', () => {
  let component: PageDatasetComponent;
  let fixture: ComponentFixture<PageDatasetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageDatasetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageDatasetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
