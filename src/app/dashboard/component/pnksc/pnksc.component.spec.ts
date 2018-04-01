import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PnkscComponent } from './pnksc.component';

describe('PnkscComponent', () => {
  let component: PnkscComponent;
  let fixture: ComponentFixture<PnkscComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PnkscComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PnkscComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
