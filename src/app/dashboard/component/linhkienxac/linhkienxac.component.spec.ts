import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinhkienxacComponent } from './linhkienxac.component';

describe('LinhkienxacComponent', () => {
  let component: LinhkienxacComponent;
  let fixture: ComponentFixture<LinhkienxacComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinhkienxacComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinhkienxacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
