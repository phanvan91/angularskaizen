import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SerialCreateComponent } from './serial-create.component';

describe('SerialCreateComponent', () => {
  let component: SerialCreateComponent;
  let fixture: ComponentFixture<SerialCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SerialCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerialCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
