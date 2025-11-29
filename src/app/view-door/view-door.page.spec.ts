import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewDoorPage } from './view-door.page';

describe('ViewDoorPage', () => {
  let component: ViewDoorPage;
  let fixture: ComponentFixture<ViewDoorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDoorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
