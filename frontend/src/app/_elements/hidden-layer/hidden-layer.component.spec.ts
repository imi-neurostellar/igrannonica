import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiddenLayerComponent } from './hidden-layer.component';

describe('HiddenLayerComponent', () => {
  let component: HiddenLayerComponent;
  let fixture: ComponentFixture<HiddenLayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiddenLayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiddenLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
