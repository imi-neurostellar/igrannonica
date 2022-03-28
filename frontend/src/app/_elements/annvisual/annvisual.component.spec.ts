import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnvisualComponent } from './annvisual.component';

describe('AnnvisualComponent', () => {
  let component: AnnvisualComponent;
  let fixture: ComponentFixture<AnnvisualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnvisualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnvisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
