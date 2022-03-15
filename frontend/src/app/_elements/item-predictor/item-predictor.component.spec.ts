import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemPredictorComponent } from './item-predictor.component';

describe('ItemPredictorComponent', () => {
  let component: ItemPredictorComponent;
  let fixture: ComponentFixture<ItemPredictorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemPredictorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemPredictorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
