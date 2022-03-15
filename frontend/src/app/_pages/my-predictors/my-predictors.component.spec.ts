import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPredictorsComponent } from './my-predictors.component';

describe('MyPredictorsComponent', () => {
  let component: MyPredictorsComponent;
  let fixture: ComponentFixture<MyPredictorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyPredictorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPredictorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
