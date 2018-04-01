import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HpcallsnComponent } from './hpcallsn.component';

describe('HpcallsnComponent', () => {
  let component: HpcallsnComponent;
  let fixture: ComponentFixture<HpcallsnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HpcallsnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HpcallsnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
