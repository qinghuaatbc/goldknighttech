import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewBlindPage } from './view-blind.page';

describe('ViewBlindPage', () => {
  let component: ViewBlindPage;
  let fixture: ComponentFixture<ViewBlindPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBlindPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
