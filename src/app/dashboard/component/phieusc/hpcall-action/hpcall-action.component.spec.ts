import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HpcallActionComponent } from './hpcall-action.component';

describe('HpcallActionComponent', () => {
  let component: HpcallActionComponent;
  let fixture: ComponentFixture<HpcallActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HpcallActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HpcallActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
