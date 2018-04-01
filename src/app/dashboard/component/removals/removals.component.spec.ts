import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemovalsComponent } from './removals.component';

describe('RemovalsComponent', () => {
  let component: RemovalsComponent;
  let fixture: ComponentFixture<RemovalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemovalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
