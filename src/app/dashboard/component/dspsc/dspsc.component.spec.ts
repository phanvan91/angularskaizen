import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DspscComponent } from './dspsc.component';

describe('DspscComponent', () => {
  let component: DspscComponent;
  let fixture: ComponentFixture<DspscComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DspscComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DspscComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
