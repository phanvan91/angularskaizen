import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DscvctComponent } from './dscvct.component';

describe('DscvctComponent', () => {
  let component: DscvctComponent;
  let fixture: ComponentFixture<DscvctComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DscvctComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DscvctComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
