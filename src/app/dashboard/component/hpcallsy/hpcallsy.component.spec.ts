import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HpcallsyComponent } from './hpcallsy.component';

describe('HpcallsyComponent', () => {
  let component: HpcallsyComponent;
  let fixture: ComponentFixture<HpcallsyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HpcallsyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HpcallsyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
