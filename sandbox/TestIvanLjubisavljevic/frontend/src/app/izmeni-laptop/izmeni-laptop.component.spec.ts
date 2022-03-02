import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IzmeniLaptopComponent } from './izmeni-laptop.component';

describe('IzmeniLaptopComponent', () => {
  let component: IzmeniLaptopComponent;
  let fixture: ComponentFixture<IzmeniLaptopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IzmeniLaptopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IzmeniLaptopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
