import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HaLightPage } from './light.page';

describe('HaLightPage', () => {
  let component: HaLightPage;
  let fixture: ComponentFixture<HaLightPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HaLightPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
