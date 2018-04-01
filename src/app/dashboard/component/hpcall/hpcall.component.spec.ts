import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HpcallComponent } from './hpcall.component';

describe('HpcallComponent', () => {
  let component: HpcallComponent;
  let fixture: ComponentFixture<HpcallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HpcallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HpcallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
