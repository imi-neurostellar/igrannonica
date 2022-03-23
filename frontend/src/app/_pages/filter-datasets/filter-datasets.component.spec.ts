import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterDatasetsComponent } from './filter-datasets.component';

describe('FilterDatasetsComponent', () => {
  let component: FilterDatasetsComponent;
  let fixture: ComponentFixture<FilterDatasetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterDatasetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterDatasetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
