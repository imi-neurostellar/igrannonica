import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowsePredictorsComponent } from './browse-predictors.component';

describe('BrowsePredictorsComponent', () => {
  let component: BrowsePredictorsComponent;
  let fixture: ComponentFixture<BrowsePredictorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowsePredictorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowsePredictorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
