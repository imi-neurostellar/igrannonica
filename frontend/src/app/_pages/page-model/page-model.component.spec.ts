import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageModelComponent } from './page-model.component';

describe('PageModelComponent', () => {
  let component: PageModelComponent;
  let fixture: ComponentFixture<PageModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
