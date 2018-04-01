import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryoldComponent } from './inventoryold.component';

describe('InventoryoldComponent', () => {
  let component: InventoryoldComponent;
  let fixture: ComponentFixture<InventoryoldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryoldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
