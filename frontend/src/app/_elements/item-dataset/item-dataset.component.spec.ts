import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDatasetComponent } from './item-dataset.component';

describe('ItemDatasetComponent', () => {
  let component: ItemDatasetComponent;
  let fixture: ComponentFixture<ItemDatasetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemDatasetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDatasetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
