import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewLightPage } from './view-light.page';

describe('ViewLightPage', () => {
  let component: ViewLightPage;
  let fixture: ComponentFixture<ViewLightPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLightPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
