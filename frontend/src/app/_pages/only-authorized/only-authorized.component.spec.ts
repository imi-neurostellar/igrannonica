import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlyAuthorizedComponent } from './only-authorized.component';

describe('OnlyAuthorizedComponent', () => {
  let component: OnlyAuthorizedComponent;
  let fixture: ComponentFixture<OnlyAuthorizedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlyAuthorizedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlyAuthorizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
