import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PbhhtComponent } from './pbhht.component';

describe('PbhhtComponent', () => {
  let component: PbhhtComponent;
  let fixture: ComponentFixture<PbhhtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PbhhtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PbhhtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
