import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelLoadComponent } from './model-load.component';

describe('ModelLoadComponent', () => {
  let component: ModelLoadComponent;
  let fixture: ComponentFixture<ModelLoadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelLoadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
