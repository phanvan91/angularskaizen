import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaoHanhComponent } from './bao-hanh.component';

describe('BaoHanhComponent', () => {
  let component: BaoHanhComponent;
  let fixture: ComponentFixture<BaoHanhComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaoHanhComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaoHanhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
