import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLaptopComponent } from './new-laptop.component';

describe('NewLaptopComponent', () => {
  let component: NewLaptopComponent;
  let fixture: ComponentFixture<NewLaptopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewLaptopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLaptopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
