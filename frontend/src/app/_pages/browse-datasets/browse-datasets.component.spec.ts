import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseDatasetsComponent } from './browse-datasets.component';

describe('BrowseDatasetsComponent', () => {
  let component: BrowseDatasetsComponent;
  let fixture: ComponentFixture<BrowseDatasetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowseDatasetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseDatasetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
